<!--供应商活动-->
<template>
    <div class="el-container">
        <el-form inline :model="option" ref="searchForm" label-width="120px">
            <el-form-item label="活动主题" prop="title">
                <el-input v-model="option.title"></el-input>
            </el-form-item>
            <el-form-item label="活动编码" prop="activity_no">
                <el-input v-model="option.activity_no"></el-input>
            </el-form-item>
            <el-form-item label="活动形式" prop="activity_type_id">
                <el-select clearable v-model="option.activity_type_id">
                    <el-option v-for="(item,index) in activity_types" :label="item" :value="index" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动商品SKU" prop="goods_sn">
                <el-input v-model="option.goods_sn"></el-input>
            </el-form-item>
            <el-form-item label="供应商申请编码" prop="apply_sn">
                <el-input v-model="option.apply_sn"></el-input>
            </el-form-item>
            <el-form-item label="活动时间" prop="activity_time">
                <el-date-picker v-model="option.activity_time" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
            </el-form-item>
            <el-form-item label="活动商品分类" prop="cat_id">
                <el-select clearable v-model="option.cat_id">
                    <el-option v-for="(item, index) in goodsCategoryList" :label="item.name" :value="item.code" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="销售仓库" prop="wh_code">
                <el-select clearable v-model="option.wh_code">
                    <el-option v-for="(item, index) in saleswarehouseList" :label="item.name" :value="item.code" :key="index"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <div class="el-sub-container">
            <div class="text-right">
                <el-button type="primary" icon="search" @click="getData">筛选</el-button>
                <el-button type="danger" icon="close" @click="resetForm">清空</el-button>
            </div>
            <el-button type="primary" icon="fa-ship" @click="setPriceFun" :disabled="multipleSelection .length === 0"
                       v-if="self.showAction_('promotion/supplier-activity/set-price')">
                设置价格
            </el-button>
            <el-button type="primary" icon="fa-files-o" @click="batchCopySku('txtId')" :disabled="multipleSelection .length === 0">批量复制sku</el-button>
        </div>
        <div>
            <el-table :data="tableData" v-loading="tableLoading" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="apply_sn" label="活动申请编码" min-width="140px" header-align="center"></el-table-column>
                <el-table-column prop="goods_sn" label="商品SKU" min-width="120px" header-align="center"></el-table-column>
                <el-table-column prop="product_title" label="商品标题" min-width="200px" header-align="center"></el-table-column>
                <el-table-column prop="wh_name" label="销售仓" min-width="120px" align="center"></el-table-column>
                <el-table-column prop="title" label="活动主题" min-width="120px" header-align="center"></el-table-column>
                <el-table-column prop="activity_no" label="活动编码" min-width="150px" header-align="center"></el-table-column>
                <el-table-column label="活动形式" min-width="120px" align="center">
                    <template scope="scope">
                        {{ activity_types[scope.row.activity_type_id] }}
                    </template>
                </el-table-column>
                <el-table-column label="活动时间" min-width="180px" align="center">
                    <template scope="scope">
                        <div class="activity-time" @click="editTime(scope.row.id, scope.row.time_start, scope.row.time_end)">
                            <p> {{self.timeZone_(scope.row.time_start, self.$store.getters.getTimeZone)}} </p>
                            <p> {{self.timeZone_(scope.row.time_end, self.$store.getters.getTimeZone)}} </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="act_price" label="活动出货价" min-width="120px" align="center"></el-table-column>
                <el-table-column prop="profit_rate" label="利润率" align="center"></el-table-column>
                <el-table-column prop="limit_price" label="限购价" align="center"></el-table-column>
                <el-table-column label="活动审核数量" min-width="150px" align="center">
                    <template scope="scope">
                        <el-input v-model.Number="scope.row.total_count"
                                  @blur="totalCountblur(scope.row.id, scope.row.init_total_count, scope.row.total_count, scope.row.index)"
                                  :disabled="!self.showAction_('promotion/supplier-activity/update')">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="支持金额" min-width="120px" align="center"></el-table-column>
                <el-table-column label="执行状态" min-width="120px" align="center">
                    <template scope="scope">
                        {{ execute_status[scope.row.exec_status] }}
                    </template>
                </el-table-column>
                <el-table-column prop="update_user" label="最后操作人" min-width="120px" align="center"></el-table-column>
                <el-table-column label="日志" min-width="150px" align="center">
                    <template scope="scope">
                        <el-button type="text" @click="viewDetails(scope.row.conditionId)">查看详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="act_desc" label="备注描述" min-width="200px" header-align="center"></el-table-column>
            </el-table>

            <div class="el-container text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page"
                               :page-sizes="[10, 20, 50, 100]" :page-size="option.page_size"
                               layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>

        <input id="txtId" v-model="skus" class="hidden-input">

        <!--弹窗s-->
        <el-dialog title="编辑活动时间" :visible.sync="activitTime.dialogVisible" size="tiny">
            <el-form inline :model="activitTime" label-width="120px">
                <el-form-item label="活动时间" prop="activity_time">
                    <el-date-picker v-model="activitTime.activity_time" type="datetimerange" placeholder="选择时间范围"
                                    :editable="false" :clearable="false" popper-class="update-time"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editActivitTime" v-if="self.showAction_('promotion/supplier-activity/update')">确 定</el-button>
                <el-button @click="activitTime.dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="活动价格设置" :visible.sync="setPrice.dialogVisible" size="small" class="activity-cancel-dialog">
            <div class="set-price-box">
                <price-temp ref="priceTemp" :show="doneSearch" :memberOpt="memberOpt" type="selection"></price-temp>
            </div>
        </el-dialog>
        <!--弹窗e-->
    </div>
</template>

<script>
    import priceTemp from '@/pageComponents/marketing/priceTemp'

    export default {
        components: {
            priceTemp
        },

        data () {
            return {
                self: this,
                activeTemp: '',
                option: {
                    title: '',
                    activity_no: '',
                    activity_type_id: '',
                    goods_sn: '',
                    apply_sn: '',
                    time_start: '',
                    time_end: '',
                    activity_time: [],
                    wh_code: '',
                    cat_id: '',
                    page_size: 10,
                    page: 1,
                },
                activity_types: {
                    '' : '全部',
                    '3': '限时优惠',
                    '4': '限量优惠',
                    '5': '免费样品',
                    '6': '现金支持',
                    '8': '满减优惠',
                    '9': '评测机器',
                },
                execute_status: {
                    '' : '全部',
                    '1': '未执行',
                    '2': '执行中',
                    '3': '执行失败',
                    '4': '执行成功',
                },
                goodsCategoryList: [], //活动商品分类选项
                saleswarehouseList: [], //销售仓库选项
                tableData: [],
                tableLoading: false,
                total: 0,
                multipleSelection: [],
                skus: '',
                goodSns: [],
                ids: [],
                warehouseCode: '',
                activitTime: {
                    dialogVisible: false,
                    activity_time: [],
                    id: '',
                },
                setPrice: {
                    dialogVisible: false,
                    templateId: '',
                    templateIdList: [],
                },
                doneSearch: false,
                memberOpt: [],
                postLoading: false,
            }
        },
        created() {
            let self = this;
            this.getOpt();
            this.getGoodsCategoryList();
            this.getSaleswarehouseList();
            this.getData();
            this.$eventHub.$on('getPostData', this.postEdit);
            this.$eventHub.$on('getActiveTemp', this.getActiveTemp);
            this.$eventHub.$on('cancle',this.cancle);
        },
        beforeDestroy() {
            this.$eventHub.$off('getPostData', this.postEdit);
            this.$eventHub.$off('getActiveTemp', this.getActiveTemp);
            this.$eventHub.$off('cancle', this.cancle);
        },

        methods: {
            cancle() {
                this.setPrice.dialogVisible = false;
            },
            getActiveTemp(data) {
                this.activeTemp = data;
            },
            getOpt () {
                this.$http.get('promotion/index/public-activity-select').then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        this.memberOpt = data.userLevel;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            getGoodsCategoryList () {
                this.goodsCategoryList = [{ name: '全部分类', code: '' }];
                this.$http.get('goods/category/category-drop-down').then(res => {
                    if (res.body.code === 0 && res.body.data) {
                        res.body.data.forEach(item => {
                            this.goodsCategoryList.push({ name: item.categoryName, code: item.id });
                        });
                    } else {
                        this.goodsCategoryList = [];
                    }
                });
            },

            getSaleswarehouseList () {
                this.saleswarehouseList = [{ name: '全部', code: '' }];
                this.$http.get('stock/warehouse/vir-wh-drop-down').then(res => {
                    if (res.body.code === 0 && res.body.data.list) {
                        res.body.data.list.forEach(item => {
                            this.saleswarehouseList.push({ name: item.virWhCnName, code: item.virWhCode });
                        });
                    } else {
                        this.saleswarehouseList = [];
                    }
                });
            },

            getData () {
                if (this.option.activity_time && this.option.activity_time.length > 0) {
                    let timeArr = this.timeZone_(this.option.activity_time, this.$store.getters.getTimeZone);
                    this.option.time_start = timeArr[0];
                    this.option.time_end = timeArr[1];
                }
                let params = Object.assign({}, this.option);
                delete params.activity_time;
                this.tableLoading = true;
                this.$http.get('promotion/supplier-activity/lists', {params: params}).then( res => {
                    this.tableLoading = false;
                    if (res.body.code === 0 && res.body.data.data) {
                        this.tableData = res.body.data.data;
                        this.total = res.body.data.total;
                        this.tableData.forEach( (item, index) => {
                            item.init_total_count = item.total_count;
                            item.index = index;
                        });
                    } else {
                        this.tableData = [];
                        this.total = 0;
                    }
                })
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.ids = [];
                this.goodSns = [];
                this.warehouseCode = "";
                let tempArr = [];
                this.multipleSelection.forEach( item => {
                    this.goodSns.push(item.goods_sn);
                    this.ids.push(item.id);
                    tempArr.push(item.wh_code);
                });
                this.skus = this.goodSns.join();
                this.warehouseCode = tempArr.join();
            },

            batchCopySku (txtId) {
                let cpt = document.getElementById(txtId);
                cpt.value = this.skus;
                cpt.select();
                try {
                    if (document.execCommand('copy', false, null)) {
                        this.$message({
                            type: 'success',
                            message: '已复制所选SKU'
                        });
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '浏览器不可用复制'
                        });
                    }
                } catch (err) {
                    this.$message.error(err);
                }
            },

            viewDetails(conditionId) {
                if (!conditionId) {
                    return;
                }
                let url = 'http://www.obs-gb.com/#/marketing/price/queueInfo?id=' + conditionId;
                window.open(url);
            },

            editTime (id, time_start, time_end) {
                this.activitTime.dialogVisible = true;
                this.activitTime.id = id;
                let ts = this.unixFormat(time_start);
                let te = this.unixFormat(time_end);
                this.activitTime.activity_time = [ts, te];
            },

            unixFormat (u) {
                let timeTemp = new Date(u * 1000);
                let gap1 = '-';
                let gap2 = ':';
                let year = timeTemp.getFullYear();
                let month = timeTemp.getMonth() + 1;
                let day = timeTemp.getDate();
                let h = timeTemp.getHours();
                let m = timeTemp.getMinutes();
                let s = timeTemp.getSeconds();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                if (h < 10) {
                    h = '0' + h;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                if (s < 10) {
                    s = '0' + s;
                }
                return year + gap1 + month + gap1 + day + ' ' + h + gap2 + m + gap2 + s;
            },

            editActivitTime () {
                let timeArr = this.timeZone_(this.activitTime.activity_time, this.$store.getters.getTimeZone);
                let params = {
                    id: this.activitTime.id,
                    time_start: timeArr[0],
                    time_end: timeArr[1]
                };
                this.$http.post('promotion/supplier-activity/update', params).then( res => {
                    if (res.body.code === 0) {
                        this.getData();
                        this.activitTime.dialogVisible = false;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            totalCountblur (id, init_total_count, total_count, index) {
                let reg = /^[0-9]*[1-9][0-9]*$/;
                if (!reg.test(total_count)) {
                    this.$message.error("请输入大于0的整数");
                    this.tableData[index].total_count = init_total_count;
                    return false;
                }
                if (Number(init_total_count) === Number(total_count)) {
                    return false;
                }

                let params = {
                    id: id,
                    total_count: total_count
                };
                this.$http.post('promotion/supplier-activity/update', params).then( res => {
                    if (res.body.code === 0) {
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            setPriceFun () {
                this.setPrice.dialogVisible = true;
                this.doneSearch = true;
                this.$nextTick(() => {
                    this.$refs.priceTemp.changeTemp({name: this.activeTemp});
                });
            },

            postEdit (option) {
                let timeArr1 = this.timeZone_(option.times, this.$store.getters.getTimeZone);
                option.startTime = timeArr1[0];
                option.endTime = timeArr1[1];

                let params = JSON.parse(JSON.stringify(option));
                params.stepPrice = JSON.stringify(params.stepPrice);
                params.orderChange = JSON.stringify(params.orderChange);
                params.timerRiseInPrice = JSON.stringify(params.timerRiseInPrice);
                params.timerRiseInOrder = JSON.stringify(params.timerRiseInOrder);
                params.pipelineCode = params.pipelineCode.join();
                params.ids = this.ids.slice(0);
                params.goodSns = this.goodSns.slice(0);
                params.warehouseCode = this.warehouseCode;
                params.platforms = params.platforms.join();

                let stepPricList = option.stepPrice.slice(0),
                    stepPricLen = stepPricList.length;
                if (stepPricLen === 0) {
                    delete params.stepPrice;
                } else {
                    for (let i=0; i<stepPricLen; i++) {
                         let temp = stepPricList[i];
                         if (!temp.stepFrom || !temp.stepTo || !temp.rates) {
                             delete params.stepPrice;
                             break;
                         }
                    }
                }

                if (!option.timerRiseInPrice.risePrice || !option.timerRiseInPrice.timeOfHourPrice) {
                    delete params.timerRiseInPrice;
                }

                let orderChangeList =  option.orderChange.slice(0),
                    orderChangeLen = orderChangeList.length;
                if (orderChangeLen === 0) {
                    delete params.orderChange;
                } else {
                    for (let i=0; i<orderChangeLen; i++) {
                        let temp = orderChangeList[i];
                        if (!temp.saleQtyFrom || !temp.saleQtyTo || !temp.profitRates) {
                            delete params.orderChange;
                            break;
                        }
                    }
                }

                if (!option.timerRiseInOrder.timeOfHourOrder || !option.timerRiseInOrder.riseOrder) {
                    delete params.timerRiseInOrder;
                }

                delete params.id;
                delete params.conditionId;
                delete params.priceId;
                delete params.goodSn;
                delete params.compulsoryPackage;
                delete params.compulsoryPromotion;
                delete params.times;

                console.log(params);
                this.$http.post('promotion/supplier-activity/set-price', params).then( res => {
                    this.$eventHub.$emit('cancleLoading');
                    if (res.body.code === 0) {
                        this.$message.success('保存成功！');
                        this.setPrice.dialogVisible = false;
                        this.doneSearch = false;
                    } else {
                        this.$message.error(res.body.message);
                    }
                }).catch(err => {
                    this.$eventHub.$emit('cancleLoading');
                });
            },

            ChangePage (val) {
                this.option.page = val;
                this.getData();
            },

            ChangePageSize (val) {
                this.option.page_size = val;
                this.getData();
            },

            resetForm() {
                this.$refs['searchForm'].resetFields();
                this.option.time_start = '';
                this.option.time_end = '';
                this.getData();
            }
        }
    }
</script>

<style lang="less">
    .activity-time {
        cursor: pointer;
        &:hover {
            color: red;
        }
    }

    .update-time {
        .el-picker-panel__link-btn{ display: none !important; }
    }

    .set-price-box {

        height: 650px;
        overflow-y: auto;
        .el-col-15 {
            width: 790px;
        }
    }

    .cancel-btn {
        display: none;
    }
</style>
