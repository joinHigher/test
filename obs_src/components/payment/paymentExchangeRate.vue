<template>
  <!--汇率管理-->
    <div class="el-container">
        <el-card class="exchange-rate" v-loading="isDataLoading">
            <div slot="header" class="el-sub-container text-right">
                <!--<span class="pull-left color-silver">汇率在基于Yahoo更新的基础上提高了3%，但可能会有一天的延迟，仅供参考。</span>-->
                <div class="pull-left">
                    <el-form class="search-form" inline ref="searchForm" :model="searchForm">
                        <el-form-item label="货币名称：">
                            <el-input class="w220" :maxlength="25" placeholder="请输入货币名称或简码进行搜索" v-model.trim="searchForm.currencyName"></el-input>
                        </el-form-item>
                        <el-form-item label="更新时间：">
                            <el-date-picker class="w350"
                                            v-model="searchForm.time"
                                            type="datetimerange"
                                            placeholder="选择时间范围"
                                            :picker-options="pickerOptions"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" native-type="submit" @click.prevent="onSearchList" icon="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <el-button v-if="showAction_('pay/rate/add')" type="primary" @click="handleBtnAddExchangeRate"><i class="el-icon-plus"></i> 添加新货币</el-button>
                <el-button v-if="showAction_('pay/rate/delete')" type="danger" @click="delRateDlg.isDlgShow = true"><i class="el-icon-delete"></i> 删除货币</el-button>
            </div>
            <div class="tab-box">
                <el-table :height="tabHeight" :data="tableData" class="table-payment-rate" border>
                    <el-table-column label="货币名称">
                        <template scope="scope">
                            {{scope.row.currencyName}}({{scope.row.currencyCode}})
                        </template>
                    </el-table-column>
                    <el-table-column label="平台汇率" width="120" prop="referenceRate"></el-table-column>
                    <el-table-column label="Mark Up" width="100" prop="markUp"></el-table-column>
                    <el-table-column label="站点汇率" width="100" prop="currencyRate"></el-table-column>
                    <el-table-column label="货币符号" width="100" prop="currencySign"></el-table-column>
                    <el-table-column label="位置" width="100">
                        <template scope="scope">
                            {{scope.row.currencyPosition ? '右边' : '左边'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="自动切换" width="100">
                        <template scope="scope">
                            {{scope.row.isAutoSwitch ? '是' : '否'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="rateUpdateTime" label="汇率最后更新时间">
                        <template scope="scope">
                            {{ scope.row.rateUpdateTime ? timeZone_(scope.row.rateUpdateTime, $store.getters.getTimeZone) : '暂无'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template scope="scope">
                            <el-button v-if="showAction_('pay/rate/update')" @click="onEdit(scope.row.currencyCode)" type="primary" icon="edit">编辑</el-button>
                            <el-button v-if="showAction_('pay/rate/currency-history')" @click="onShowLocus(scope.row.currencyCode)" type="warning" icon="information">更新轨迹</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <!-- 弹窗S -->
        <el-dialog title="添加新货币" v-model="addRateDlg.isDlgShow" size="tiny">
            <div>
                <el-select filterable v-model="addRateDlg.currency" placeholder="请选择" >
                    <el-option v-for="(item, index) in rateListAll" :label="item.currencyName" :value="item.currencyCode" :key="item.currencyCode">
                        <span class="fl">{{item.currencyName}}</span>
                        <span class="fr">{{item.currencyCode}}</span>
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRateDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="addRateDlg.isLoading" @click="handleAddRateBtnOk" :disabled="!addRateDlg.currency">确认</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->

        <!-- 弹窗S -->
        <el-dialog title="删除货币" v-model="delRateDlg.isDlgShow" size="tiny" class="del-rate-dlg">
            <div>
                <el-checkbox-group v-model="delRateDlg.checkedCurrencyRate">
                    <div v-for="(currency, index) in tableData" :key="currency.currencyCode" class="item-currency">
                        <el-checkbox :label="currency.currencyCode">{{currency.currencyName}}</el-checkbox>
                    </div>
                </el-checkbox-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delRateDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="delRateDlg.isLoading" @click="handleDelRateBtnOk" :disabled="!delRateDlg.checkedCurrencyRate.length">确认</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->

        <!--编辑货币 S-->
        <el-dialog title="编辑货币" size="tiny" v-model="editCurrencyDlg.isDlgShow" class="edit-dlg">
            <el-form :model="editCurrencyDlg.form" ref="editRateForm" label-width="150px">
                <el-form-item label="货币名称：">
                    {{editCurrencyDlg.form.currencyName || '无'}}
                </el-form-item>
                <el-form-item label="货币简码：" >
                    {{editCurrencyDlg.form.currencyCode || '无'}}
                </el-form-item>
                <el-form-item label="货币符号：">
                    {{editCurrencyDlg.form.currencySign || '无'}}
                </el-form-item>
                <el-form-item label="历史平台汇率：">
                    {{editCurrencyDlg.form.lastReferenceRate || '无'}}
                </el-form-item>
                <el-form-item label="实时平台汇率：">
                    {{editCurrencyDlg.form.referenceRate || '无'}}
                </el-form-item>
                <el-form-item label="实时浮动值：">
                    {{editCurrencyDlg.form.diffPercent || '无'}}
                </el-form-item>
                <el-form-item label="Mark Up："
                              prop="markUp"
                              class="rate-dlg-line"
                              :rules="[
                                  {required: true, trigger: 'blur', message: '必需为数字选项'},
                                  {validator: function(rule, value, callback) {
                                      if (Number(value) < -100) {
                                          callback(Error('请输入大于 -100 的数字'))
                                      }else{
                                          callback()
                                      }
                                  }, trigger: 'blur'}
                              ]"
                >
                    <el-input class="input w150" type="number" v-model="editCurrencyDlg.form.markUp">
                        <template slot="append">%</template>
                    </el-input>
                    <el-button type="number"
                               @click="computeRate"
                    >计算站点汇率</el-button>
                </el-form-item>
                <el-form-item label="站点汇率：" prop="currencyRate">
                    <el-input class="input w150" type="number" :value="editCurrencyDlg.form.currencyRate" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="货币位置：">
                    <el-select v-model="editCurrencyDlg.form.currencyPosition" clearable placeholder="请选择">
                        <el-option label="左边" :value="0"></el-option>
                        <el-option label="右边" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="自动切换：">
                    <el-select v-model="editCurrencyDlg.form.isAutoSwitch" clearable placeholder="请选择">
                        <el-option label="否" :value="0"></el-option>
                        <el-option label="是" :value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCurrencyDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="editCurrencyDlg.isLoading" @click="onSaveOneRate">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑货币 E-->

        <!--汇率轨迹 S-->
        <el-dialog title="汇率更新轨迹" v-model="locusDlg.isDlgShow" class="locus-dlg">
            <div v-loading="locusDlg.isLoading">
                <div class="dlg-header">
                    <div class="dlg-list">
                        <h4 class="dlg-item">货币名称：<span class="text">{{locusDlg.currencyName}}</span></h4>
                        <h4 class="dlg-item">国际简码：<span class="text">{{locusDlg.currencyCode}}</span></h4>
                    </div>
                </div>
                <el-table :data="locusDlg.list" border>
                    <el-table-column
                        prop="referenceRate"
                        label="平台汇率">
                    </el-table-column>

                    <el-table-column
                        prop="markUp"
                        label="mark up值">
                    </el-table-column>

                    <el-table-column
                        prop="currencyRate"
                        label="站点汇率">
                    </el-table-column>

                    <el-table-column
                        label="时间">
                        <template scope="scope">
                            {{ scope.row.rateUpdateTime ? timeZone_(scope.row.rateUpdateTime, $store.getters.getTimeZone) : '暂无'}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="dlg-pager"
                    @size-change="onHistorySizeChange"
                    @current-change="onHistoryCurrentChange"
                    :current-page="locusDlg.pager.pageNo"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="locusDlg.pager.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="locusDlg.totalCount">
                </el-pagination>
            </div>
        </el-dialog>
        <!--汇率轨迹 E-->
    </div>
</template>

<script>
import httpGet from '../../common/baseApi'
import utils from '../../common/utils'

export default {
    data() {
        return {
            Error: Error,
            tabHeight: 600,
            isDataLoading: false,
            tableData: [],
            rateListAll: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            searchForm: {
                currencyName: '',
                time: []
            },
            addRateDlg: {
                isDlgShow: false,
                isLoading: false,
                currency: '',
            },
            delRateDlg: {
                isDlgShow: false,
                isLoading: false,
                checkedCurrencyRate: [],
            },
            editCurrencyDlg: {
                isDlgShow: false,
                isLoading: false,
                loadingGet: false,
                form: this._getEmptyEditForm()
            },

            locusDlg: {
                isDlgShow: false,
                isLoading: false,
                list: [],
                currencyName: '',
                currencyCode: '',
                totalCount: 0,
                pager: {
                    pageNo: 1,
                    pageSize: 10
                },
            }
        };
    },
    watch: {
        'searchForm.currencyName'(newVal, oldVal) {
            if(newVal === ''){
                this.getData()
            }
        }
    },
    created() {
        this.getData();
    },
    mounted() {
        this._resize = function(e) {
            this.tabHeight = utils.tools.getTableHeight(250)
        }.bind(this);

        window.addEventListener("resize", this._resize, false)
        this._resize()
    },
    beforeDestroy(){
        window.removeEventListener('resize', this._resize)
    },
    methods: {
        computeRate(){
            if (this.editCurrencyDlg.form.referenceRate) {
                const currencyRate = this._save6Dot(this.editCurrencyDlg.form.referenceRate * (1 + Number(this.editCurrencyDlg.form.markUp) / 100))
                if (currencyRate >= 0){
                    this.editCurrencyDlg.form.currencyRate = currencyRate
                }else {
                    this.$message.error('站点汇率不能为负数，请重新设置 Mark Up')
                }
            } else {
                this.$message.error('请先获取实时平台汇率')
            }
        },
        async _getHistoryData() {
            const params = {
                currencyCode: this.locusDlg.currencyCode,
                pageNo: this.locusDlg.pager.pageNo,
                pageSize: this.locusDlg.pager.pageSize
            }
            this.locusDlg.isLoading = true
            try {
                const data = await httpGet('pay/rate/currency-history', {
                    params
                })
                Object.assign(this.locusDlg, {
                    ...data,
                    list: Array.isArray(data.list) ? data.list : []
                })
            } catch (e) {
                this.locusDlg.list = []
                this.locusDlg.currencyName = ''
            } finally {
                  this.locusDlg.isLoading = false
            }
        },
        onHistorySizeChange(val) {
            this.locusDlg.pager.pageNo = 1
            this.locusDlg.pager.pageSize = val
            this._getHistoryData()
        },
        onHistoryCurrentChange(val) {
            this.locusDlg.pager.pageNo = val
            this._getHistoryData()
        },
        onShowLocus(currencyCode) {
            this.locusDlg.isDlgShow = true
            this.locusDlg.pager.pageNo = 1
            this.locusDlg.currencyName = ''
            this.locusDlg.currencyCode = currencyCode
            this._getHistoryData()
        },
        _save6Dot(str) {
            return String(str).replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/,'$1$2.$3')
        },
        _getEmptyEditForm(){
            return {
                currencyName: '',
                currencyCode: '',
                currencySign: '',
                lastReferenceRate: '',
                referenceRate: '',
                markUp: '',
                currencyRate: '',
                currencyPosition:0,
                isAutoSwitch:0,
            }
        },
        onSaveOneRate() {
            this.$refs.editRateForm.validate(valid => {

                if(valid){
                    this.computeRate()

                    this.editCurrencyDlg.isLoading = true

                    const {
                        currencyCode,
                        currencyPosition,
                        isAutoSwitch,
                        currencyRate,
                        referenceRate,
                        markUp
                    } = this.editCurrencyDlg.form

                    this.$http.post('pay/rate/update', {
                        markUp,
                        currencyCode,
                        currencyPosition,
                        isAutoSwitch,
                        currencyRate,
                        referenceRate
                    }).then(({body: {code, message, data}}) => {
                        this.editCurrencyDlg.isLoading = false
                        if (code !== 0) {
                            this.$message.error(message)
                            return
                        }
                        this.getData()
                        this.editCurrencyDlg.isDlgShow = false
                    },err => {
                        this.editCurrencyDlg.isLoading = false
                        this.$message.error(err.body.message || '发生错误')
                    })
                }
            })
        },
        async onEdit(currencyCode){
            this.editCurrencyDlg.isDlgShow = true
            Object.assign(this.editCurrencyDlg.form, this._getEmptyEditForm())
            this.$nextTick(() => {
                this.$refs.editRateForm.resetFields()
            })

            const data = await httpGet('pay/rate/info', {
                params: {
                    currencyCode
                }
            })

            Object.assign(this.editCurrencyDlg.form, data, {
                markUp: String(data.markUp)
            })
        },
        async getData() {
            this.isDataLoading = true
            const {currencyName, time} = this.searchForm
            const [updateTimeStart, updateTimeEnd] = this.timeZone_(time, this.$store.getters.getTimeZone)
            const data = await httpGet('pay/rate/list', {
                params: {
                    updateTimeStart,
                    updateTimeEnd,
                    currencyName
                }
            })
            this.isDataLoading = false
            this.tableData = data.currencys
        },
        onSearchList(){
            this.getData()
        },
        async handleBtnAddExchangeRate() {
            this.addRateDlg.isDlgShow = true
            if (this.rateListAll.length) {
                return;
            }
            const data = await httpGet('pay/platform-rate/list')

            // 没有做去除重复处理
            this.rateListAll = data.currencys.map(item => {
                return {
                    currencyName: item.currencyName,
                    currencyCode: item.currencyCode
                }
            })
        },
        handleAddRateBtnOk() {
            const isExist = this.tableData.some(item => {
                if (this.addRateDlg.currency === item.currencyCode) {
                    return true
                }
            })
            if (isExist) {
                this.$message.error('货币已存在')
                return
            }

            this.addRateDlg.isLoading = true
            this.$http.post('pay/rate/add', {
                currencyCode: this.addRateDlg.currency
            }).then(res => {
                    this.addRateDlg.isLoading = false
                    if (res.body.code !== 0) {
                        this.$message.error(res.body.message || '发生错误')
                        return
                    }
                    this.addRateDlg.currency = ''
                    this.addRateDlg.isDlgShow = false
                    this.getData()
                },err => {
                    this.addRateDlg.isLoading = false
                    this.$notify.error(err.body.message || '发生错误')
                });
        },

        handleDelRateBtnOk() {
            if (!this.delRateDlg.checkedCurrencyRate.length) {
                return
            }

            this.delRateDlg.isLoading = true
            this.$http.post('pay/rate/delete', {
                currencyCodes: this.delRateDlg.checkedCurrencyRate
            }).then(res => {
                this.delRateDlg.isLoading = false
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '发生错误')
                    return
                }
                this.delRateDlg.checkedCurrencyRate = []
                this.delRateDlg.isDlgShow = false
                this.getData()
            }, err => {
                this.$notify.error(err.body.message || '发生错误')
            })
        },
    }
}
</script>

<style lang="less" scoped>
    .w350{
        width: 350px;
    }
    .w220{
        width: 220px;
    }
    .del-rate-dlg {
        .item-currency {
            display: inline-block;
            width: 50%;
            margin-bottom: 10px;
        }
    }
    .exchange-rate{
        .cell {
            padding-left: 5px;
            padding-right: 5px;
        }
    }
    .w150{
        width: 150px !important;
    }
    .rate-dlg-line{
        .input{
            width: auto;
        }
    }
    .locus-dlg{
        .dlg-pager{
            margin-top: 20px;
        }
        .dlg-list{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 10px;
            .dlg-item{
                margin-right: 20px;
            }
        }
    }
</style>

<style lang="less">
.none-spinner input::-webkit-outer-spin-button,
.none-spinner input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
.exchange-rate {
    table {
        th,
        td { text-align: center; }
        td { padding-top: 10px; padding-bottom: 10px; }
    }
}
</style>
