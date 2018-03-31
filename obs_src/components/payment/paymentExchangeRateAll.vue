<template>
  <!--全站汇率管理-->
    <div class="el-container">
        <!--<span class="color-silver">汇率在基于Yahoo更新的基础上提高了3%，但可能会有一天的延迟，仅供参考。</span>-->
        <el-card class="exchange-rate" v-loading="isDataLoading">
            <div slot="header" class="text-right el-sub-container">
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
                <el-button v-if="showAction_('pay/platform-rate/reflush')" type="primary" @click="handleBtnGetAllExchangeRate" icon="circle-check">获取最新外部汇率</el-button>
                <el-button v-if="showAction_('pay/platform-rate/add-currency')" type="primary" @click="handleBtnAddExchangeRate" icon="plus">添加新货币</el-button>
                <el-button v-if="showAction_('pay/platform-rate/delete-currency')" type="danger" @click="delRateDlg.isDlgShow = true" icon="delete">删除货币</el-button>
                <el-button v-if="showAction_('pay/platform-rate/update')" class="btn-save" type="primary" @click="handleBtnSaveExchangeRate" icon="upload">保存</el-button>
                <el-button @click="handleBtnCancelEdit" type="warning" icon="close">取消</el-button>
            </div>

            <div class="table-box">
                <el-table :height="tabHeight" :data="tableData" class="table-left" border>
                    <el-table-column label="货币名称">
                        <template scope="scope">
                            {{scope.row.currencyName}}({{scope.row.currencyCode}})
                        </template>
                    </el-table-column>
                    <el-table-column label="外部汇率">
                        <template scope="scope">
                            <el-input type="number"
                                      class="none-spinner"
                                      :value="scope.row.tmpReferenceRate || scope.row.referenceRate"
                                      :readonly="true"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="Mark Up" width="100" prop="markUp"></el-table-column>
                    <el-table-column label="平台汇率" width="300">
                        <template scope="scope">
                            <el-input type="number"
                                      class="none-spinner"
                                      :value="scope.row.tmpCurrencyRate || scope.row.currencyRate"
                                      :readonly="true"></el-input>

                            <el-button v-if="showAction_('pay/platform-rate/reflush')" @click="handleBtnGetExchangeRate(scope.row, scope.$index)" :disabled="scope.row.currencyCode == 'USD'" :loading="scope.row.isLoading">查询外部汇率</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="currencySign" label="货币符号" width="100"></el-table-column>
                    <el-table-column prop="rateUpdateTime" label="汇率最后更新时间" width="200">
                        <template scope="scope">
                            {{ scope.row.rateUpdateTime ? timeZone_(scope.row.rateUpdateTime, $store.getters.getTimeZone) : '暂无'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="250">
                        <template scope="scope">
                            <el-button v-if="showAction_('pay/platform-rate/currency-update')" @click="onEdit(scope.row.currencyCode)" type="primary" icon="edit">编辑</el-button>
                            <el-button v-if="showAction_('pay/platform-rate/currency-history')" @click="onShowLocus(scope.row.currencyCode)" type="warning" icon="information">更新轨迹</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <!-- 弹窗S -->
        <el-dialog title="添加新货币" v-model="addRateDlg.isDlgShow" size="tiny">
            <el-form :model="addRateForm" ref="addRateForm" :rules="addRateFormRules" label-width="120px">
                <el-form-item label="货币名称：" prop="currencyName">
                    <el-input v-model="addRateForm.currencyName" :maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="国际编码：" prop="currencyCode">
                    <el-input v-model="addRateForm.currencyCode" :maxlength="3"></el-input>
                </el-form-item>
                <el-form-item label="符号：" prop="currencySign">
                    <el-input v-model="addRateForm.currencySign" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="汇率：" prop="currencyRate" class="rate-dlg-line">
                    <el-input class="input" type="number" v-model="addRateForm.currencyRate"></el-input>
                    <el-button :loading="addRateForm.loadingGet" @click="rateDlgGetExchangeRate(addRateForm.currencyCode)">获取官方汇率</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRateDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="addRateDlg.isLoading" @click="handleAddRateBtnOk">确认</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->

        <!-- 弹窗S -->
        <el-dialog title="删除货币" v-model="delRateDlg.isDlgShow" size="tiny" class="del-rate-dlg">
            <div>
                <el-checkbox-group v-model="delRateDlg.checkedCurrencyRate">
                    <div v-for="(currency, index) in tableData" :key="currency.currencyName" class="item-currency">
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
                <el-form-item label="外部汇率："
                              :rules="[{required: true, trigger: 'change', message: '必填选项'}]"
                              prop="referenceRate"
                              class="rate-dlg-line">
                    <el-input class="input w150" type="number" :value="editCurrencyDlg.form.referenceRate" :readonly="true"></el-input>
                    <el-button :loading="editCurrencyDlg.loadingGet"
                               @click="editRateGetExchange(editCurrencyDlg.form.currencyCode)"
                    >获取官方汇率</el-button>
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
                    >计算平台汇率</el-button>
                </el-form-item>
                <el-form-item label="平台汇率：" prop="currencyRate">
                    <el-input class="input w150" type="number" :value="editCurrencyDlg.form.currencyRate" :readonly="true"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCurrencyDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="editCurrencyDlg.isLoading" @click="onSaveOneRate">提交</el-button>
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
                        label="外部汇率">
                    </el-table-column>

                    <el-table-column
                        prop="markUp"
                        label="mark up值">
                    </el-table-column>

                    <el-table-column
                        prop="currencyRate"
                        label="平台汇率">
                    </el-table-column>

                    <el-table-column
                        prop="rateUpdateTime"
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
        let checkCurrencyName = (rule, value, callback) => {
            let pattern = /^[a-zA-Z\u4e00-\u9fa5]+$/;
            if (!pattern.test(value) || value.length > 10) {
                return callback(new Error('必须为中文或者英文，长度不大于10'));
            }
            callback();
        };
        let checkCurrencyCode = (rule, value, callback) => {
            let pattern = /^[a-zA-Z]+$/;
            if (!pattern.test(value) || value.length !== 3) {
                return callback(new Error('必须为英文，且长度为3'));
            }
            callback();
        };
        // 汇率，只能输入大于0的数值，最多支持6位小数
        let checkFloat = (rule, val, callback) => {
            let reg = /^[0-9]+(.[0-9]{1,6})?$/;
            let num = parseFloat(val);
            if (!reg.test(val) || isNaN(num) || num <= 0) {
                return callback(new Error('需大于0，最多6位小数'));
            }
            callback();
        };
        return {
            Error,
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
                // time: [`${utils.tools.formatTime(new Date, 'yyyy-M-d')} 00:00:00`, `${utils.tools.formatTime(new Date, 'yyyy-M-d')} 23:59:59`]
                time: [],
            },
            addRateDlg: {
                isDlgShow: false,
                isLoading: false,
            },
            addRateForm: {
                loadingGet: false,
                currencyName: '',
                currencyCode: '',
                currencyRate: '',
                currencySign: '',
            },
            addRateFormRules: {
                currencyName: [{ required: true, validator: checkCurrencyName, trigger: 'blur' }],
                currencyCode: [{ required: true, validator: checkCurrencyCode, trigger: 'blur' }],
                currencyRate: [{ required: true, validator: checkFloat, trigger: 'blur' }],
                currencySign: [{ required: true, min: 1, message: '请输入符号', trigger: 'blur' }],
            },
            delRateDlg: {
                isDlgShow: false,
                isLoading: false,
                checkedCurrencyRate: [],
            },

            locusDlg: {
                isLoading: false,
                isDlgShow: false,
                list: [],
                currencyName: '',
                currencyCode: '',
                totalCount: 0,
                pager: {
                    pageNo: 1,
                    pageSize: 10
                },
            },

            editCurrencyDlg: {
                isDlgShow: false,
                isLoading: false,
                loadingGet: false,
                form: this._getEmptyEditForm()
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
        this.getData()
    },
    mounted() {
        window.addEventListener("resize", this._resize.bind(this), false)
        this._resize()
    },
    methods: {
        computeRate(){
            if (this.editCurrencyDlg.form.referenceRate){
                const currencyRate = this._save6Dot(this.editCurrencyDlg.form.referenceRate * (1 + Number(this.editCurrencyDlg.form.markUp)/100))
                if (currencyRate >= 0){
                    this.editCurrencyDlg.form.currencyRate = currencyRate
                }else {
                    this.$message.error('平台汇率不能为负数，请重新设置 Mark Up')
                }
            } else {
                $message.error('请先获取官方汇率')
            }
        },

        _resize(){
            this.tabHeight = utils.tools.getTableHeight(250)
        },
        async _getHistoryData() {
            const params = {
                currencyCode: this.locusDlg.currencyCode,
                pageNo: this.locusDlg.pager.pageNo,
                pageSize: this.locusDlg.pager.pageSize
            }
            this.locusDlg.isLoading = true

            try{
                const data = await httpGet('pay/platform-rate/currency-history', {
                    params
                })
                Object.assign(this.locusDlg, {
                    ...data,
                    list: Array.isArray(data.list) ? data.list : []
                })
            } catch(e) {
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
        _getEmptyEditForm(){
            return {
                currencyName: '',
                currencyCode: '',
                currencyRate: '',
                referenceRate: '',
                currencySign: '',
                markUp: '',
                referenceAliexpressRate: '',
            }
        },
        onSearchList(){
            this.getData()
        },
        async onEdit(currencyCode){
            this.editCurrencyDlg.isDlgShow = true
            Object.assign(this.editCurrencyDlg.form, this._getEmptyEditForm())
            this.$nextTick(() => {
                this.$refs.editRateForm.resetFields()
            })

            const data = await httpGet('pay/platform-rate/currency-info', {
                params: {
                    currencyCode
                }
            })

            // 表单验证需要 string ......
            Object.assign(this.editCurrencyDlg.form, data, {
                markUp: String(data.markUp),
                referenceRate: String(data.referenceRate),
                currencyRate: String(data.currencyRate)
            })
        },

        // 获取列表数据
        async getData() {
            this.isDataLoading = true

            const {currencyName, time} = this.searchForm
            const [updateTimeStart, updateTimeEnd] = this.timeZone_(time, this.$store.getters.getTimeZone)

            const data = await httpGet('pay/platform-rate/list', {
                params: {
                    updateTimeStart,
                    updateTimeEnd,
                    currencyName
                }
            })

            this.isDataLoading = false
            this.tableData = data.currencys.map(item => {
                return {
                    ...item,
                    isLoading: false,
                    tmpReferenceRate: '',   // 外部汇率临时值
                    tmpCurrencyRate: '',   // 平台汇率临时
                }
            })
        },

        // 获取汇率接口
        _getExchangeRateData(currencyCodes) {
            return httpGet('pay/platform-rate/reflush', {
                params: {currencyCodes}
            })
        },

        _save6Dot(str) {
            return String(str).replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/,'$1$2.$3')
        },
        // 获取汇率
        async getExchangeRate(currencyCodes, rowIndex) {
            if (!Array.isArray(currencyCodes) || !currencyCodes.length) {
                return
            }
            const isSingle = !(undefined === rowIndex)

            if ((undefined === rowIndex)) {
                // 获取全部
                this.isDataLoading = true
            } else {
                // 获取单个
                if (this.tableData[rowIndex].isLoading) return
                this.tableData[rowIndex].isLoading = true
            }

            try {
                const data = await this._getExchangeRateData(currencyCodes)
                if (isSingle) {
                    const curReferenceRate = data.currencyRates[this.tableData[rowIndex].currencyCode]

                    if(curReferenceRate) {
                        Object.assign(this.tableData[rowIndex], {
                            tmpReferenceRate: curReferenceRate,

                            // 手动更新
                            tmpCurrencyRate: this._save6Dot(curReferenceRate * (1 + this.tableData[rowIndex].markUp/100))
                        })
                    }
                } else {
                    this.tableData.forEach((item) => {
                        if (data.currencyRates[item.currencyCode]) {
                            item.tmpReferenceRate = data.currencyRates[item.currencyCode]

                            // 手动更新
                            item.tmpCurrencyRate = this._save6Dot(item.tmpReferenceRate * (1 + item.markUp/100))
                        }
                    })
                }
            } catch (e) {
                console.error('接口访问错误')
            } finally {
                if (isSingle) {
                    this.tableData[rowIndex].isLoading = false
                } else {
                    this.isDataLoading = false
                }
            }
        },
        handleBtnGetExchangeRate(row, index) {
            if (!row.currencyCode) {
                this.$message.error('获取当前货币失败')
                return
            }
            this.getExchangeRate([row.currencyCode], index)
        },
        handleBtnAddExchangeRate() {
            this.addRateDlg.isDlgShow = true;
            this.$nextTick(() => {
                this.$refs['addRateForm'].resetFields();
            });
        },
        rateDlgGetExchangeRate() {
            this.$refs['addRateForm'].validateField('currencyCode', async errorMessage => {
                if (!errorMessage){
                    this.addRateForm.loadingGet = true
                    try {
                        const data = await this._getExchangeRateData([this.addRateForm.currencyCode])
                        this.addRateForm.currencyRate = data.currencyRates[this.addRateForm.currencyCode]
                        this.$refs['addRateForm'].validateField('currencyRate')

                    }catch (e){
                        this.$message.error('获取失败')
                    } finally {
                        this.addRateForm.loadingGet = false
                    }
                }
            })
        },

        async editRateGetExchange(code){
            this.editCurrencyDlg.loadingGet = true

            try {
                const data = await this._getExchangeRateData([code])

                // el-form 表单验证 require 必须为字符串 ..........
                this.editCurrencyDlg.form.referenceRate = String(data.currencyRates[code])
            }finally {
                this.editCurrencyDlg.loadingGet = false
            }
        },

        // 获取所有汇率
        handleBtnGetAllExchangeRate() {
            let arr = []
            this.tableData.forEach((item) => {
                item.currencyCode && arr.push(item.currencyCode)
            })
            this.getExchangeRate(arr)
        },

        handleBtnCancelEdit() {
            this.tableData.forEach(item => {
                item.tmpReferenceRate = ''
                item.tmpCurrencyRate = ''
            });
        },
        handleBtnSaveExchangeRate() {
            let changedItems = [];

            this.tableData.forEach(item => {
                // 获取过新数据  并且不等于旧数据
                if(
                    item.tmpReferenceRate && parseFloat(item.tmpReferenceRate) !== parseFloat(item.referenceRate) ||
                    item.tmpCurrencyRate && parseFloat(item.tmpCurrencyRate) !== parseFloat(item.currencyRate)
                ){
                    changedItems.push({
                        currencyCode: item.currencyCode,
                        currencyRate: item.tmpCurrencyRate,     // 修改的数据
                        referenceRate: item.tmpReferenceRate,   // 修改的数据
                        referenceAliexpressRate: item.tmpReferenceRate,
                        markUp: item.markUp
                    })
                }
            })

            if (!changedItems.length) {
                this.$message.info('没有数据改动')
                return
            }

            this.isDataLoading = true;
            this.$http.post('pay/platform-rate/update', { currencys: changedItems, }).then(res => {
                this.isDataLoading = false;
                if (res.body.code !== 0 || !res.body.data) {
                    this.$message.error(res.body.message || '保存出错');
                    return;
                }
                this.$message.success(res.body.message || '保存成功');
                this.tableData.forEach((item) => {
                    // 清空临时数据
                    if (item.tmpReferenceRate) {
                        item.referenceRate = item.tmpReferenceRate;
                        item.currencyRate = item.tmpCurrencyRate;
                        item.tmpReferenceRate = item.tmpCurrencyRate = ''
                    }
                })
            },err => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        // 弹窗修改单个
        onSaveOneRate(){
            this.$refs.editRateForm.validate(async valid => {
                if(valid){
                    this.computeRate()

                    await this.$confirm('是否确认提交？？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })

                    this.editCurrencyDlg.isLoading = true

                    const {
                        currencyCode,
                        markUp,
                        currencyRate,
                        referenceRate,
                        referenceAliexpressRate
                    } = this.editCurrencyDlg.form

                    this.$http.post('pay/platform-rate/currency-update', {
                        currencyCode,
                        markUp,
                        currencyRate,
                        referenceRate,
                        referenceAliexpressRate
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

        handleAddRateBtnOk() {
            let isExist = false;
            let hasError = false;
            this.$refs['addRateForm'].validate((valid) => {
                if (!valid) {
                    hasError = true;
                    return false;
                }
            });
            if (hasError) {
                return;
            }
            this.tableData.some((item) => {
                if (this.addRateForm.currencyCode === item.currencyCode || this.addRateForm.currencyName === item.currencyName) {
                    isExist = true;
                    return true;
                }
            });
            if (isExist) {
                this.$message.error('货币已存在');
                return;
            }
            this.addRateDlg.isLoading = true;

            this.$http.post('pay/platform-rate/add-currency', this.addRateForm).then(res => {
                this.addRateDlg.isLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '发生错误');
                    return;
                }

                this.addRateDlg.isDlgShow = false;
                this.addRateForm.currencyCode = '';
                this.addRateForm.currencyName = '';
                this.addRateForm.currencySign = '';
                this.addRateForm.currencyRate = '';
                this.getData();
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },

        handleDelRateBtnOk() {
            if (!this.delRateDlg.checkedCurrencyRate.length) {
                return;
            }
            this.delRateDlg.isLoading = true;
            this.$http.post('pay/platform-rate/delete-currency', { currencyCodes: this.delRateDlg.checkedCurrencyRate }).then(res => {
                this.delRateDlg.isLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '发生错误');
                    return;
                }
                this.delRateDlg.checkedCurrencyRate = [];
                this.delRateDlg.isDlgShow = false;
                this.getData();
            },err => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
    }
}
</script>

<style lang="less">
.none-spinner input::-webkit-outer-spin-button,
.none-spinner input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
.exchange-rate {
    table {
        th,
        td { text-align: center; }
        td { padding-top: 10px; padding-bottom: 10px; }
        .el-input { width: 120px;
            input { box-shadow: none; }
        }
    }
}

</style>

<style lang="less" scoped>
    .btn-save { margin-left: 30px; }
    .w350{
        width: 350px;
    }
    .w150{
        width: 150px !important;
    }
    .w220{
        width: 220px;
    }
    .rate-dlg-line{
        .input{
            width: auto;
        }
    }
    .del-rate-dlg {
        .item-currency { display: inline-block; width: 50%; margin-bottom: 10px; }
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
