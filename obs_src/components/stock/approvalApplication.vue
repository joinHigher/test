<style lang="less">
.form-wrap { padding-bottom: 0; }
.pt-0,
.el-container .pt-0 { padding-top: 0; }
.table-main {
    .el-button { margin: 3px 0; }
}
.editStockDlg { line-height: 36px;
    @border: 1px solid #ccc;
    .el-row { border: @border; border-top: none;
        &:first-child { border-top: @border; }
        .el-col { padding: 10px 5px; min-height: 56px; border-left: @border;
            &:first-child { border-left: none; }
        }
    }
}
.ac-real-list-wrap { display: block; position: relative;
    .el-icon-circle-close { visibility: hidden; z-index: 5; }
    .el-input { z-index: 2; }
    input { background: none; }
    > i { position: absolute; top: 50%; right: 10px; transform: translateY(-50%); color: #bfcbd9; font-size: 12px; z-index: 1; }
    &:hover {
        > i { visibility: hidden; }
        .el-icon-circle-close { visibility: visible; }
    }
}
</style>
<template>
    <div>
        <div class="el-container form-wrap">
            <el-form inline :model="filter" ref="filterForm">
                <el-form-item label="站点：">
                    <el-select v-model="filter.siteCode" clearable>
                        <el-option v-for="val in sites" :label="val.name" :value="val.code" :key="val.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="真实仓名称：">
                    <!-- <el-autocomplete v-model.trim="filter.realWhCode" :fetch-suggestions="querySearch" @select="handleSelectRealWhCode"></el-autocomplete> -->
                    <span class="ac-real-list-wrap">
                        <el-autocomplete v-model="filter.name" :fetch-suggestions="querySearch" @select="handleSelectRealWhCode" icon="circle-close" :on-icon-click="handleRealListDelIconClick"></el-autocomplete>
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                </el-form-item>
                <el-form-item label="商品SKU：">
                    <el-input v-model="filter.goodSn" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="价格ID：">
                    <el-input v-model="filter.priceId" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="申请时间：">
                    <el-date-picker v-model="filter.applyTime" type="datetimerange" placeholder="选择申请时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item label="生效时间：">
                    <el-date-picker v-model="filter.date" type="datetimerange" placeholder="选择生效时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>  

            <div class="el-sub-container text-right pt-0">
                <el-button v-if="this.showAction_('stock/apply/refuse')" type="danger" @click="handleBtnRefuseClick(-1)" :disabled="multipleSelection.length < 1 || isDataLoading">批量不通过</el-button>
                <el-button v-if="this.showAction_('stock/apply/pass')" type="primary" @click="multipleApprove(1)" :disabled="multipleSelection.length < 1 || isDataLoading">批量通过</el-button>
            </div>
            <el-table ref="multipleTable" :data="tableData" v-loading="isDataLoading" @selection-change="handleSelectionChange" class="table-main" border>
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="序" width="60"></el-table-column>
                <el-table-column label="站点" width="80">
                    <template scope="scope">
                        <div>{{ self.siteCodes[scope.row.siteCode] ? self.siteCodes[scope.row.siteCode] : scope.row.siteCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="goodSn" label="SKU"></el-table-column>
                <el-table-column label="真实仓名称">
                    <template scope="scope">
                        {{ realWhCodeText[scope.row.realWhCode] ? realWhCodeText[scope.row.realWhCode] : scope.row.realWhCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="priceType" label="价格类型"></el-table-column>
                <el-table-column prop="priceId" label="价格ID"></el-table-column>
                <el-table-column prop="price" label="价格/利润率"></el-table-column>
                <el-table-column label="生效时间" width="120px">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone) }} -
                        {{ self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="applyUser" label="申请人"></el-table-column>
                <el-table-column label="申请时间">
                    <template scope="scope">
                        {{ scope.row.applyTime ? self.timeZone_(scope.row.applyTime, self.$store.getters.getTimeZone) : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="applyRemark" label="申请人备注"></el-table-column>
                <el-table-column prop="approveUser" label="审批人"></el-table-column>
                <el-table-column prop="email" label="排序"></el-table-column>
                <el-table-column label="审批时间">
                    <template scope="scope">
                        {{ scope.row.approveTime ? self.timeZone_(scope.row.approveTime, self.$store.getters.getTimeZone) : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="refuseRemark" label="驳回备注"></el-table-column>
                <el-table-column label="是否有效">
                    <template scope="scope">
                        {{ scope.row.applyStatus === 9 ? '有效' : '无效' }}
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="过期提醒"></el-table-column>
                <el-table-column label="操作" width="130">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('stock/apply/edit')" type="primary" size="small" @click="handleBtnEditClick(scope.$index)">编辑申请库存数</el-button>
                        <el-button v-if="self.showAction_('stock/apply/pass')" type="success" size="small" @click="handleBtnPassClick(scope.$index)" :disabled="scope.row.approveResult != 3 || scope.row.applyStatus != 9">通过</el-button>
                        <el-button v-if="self.showAction_('stock/apply/refuse')" type="danger" size="small" @click="handleBtnRefuseClick(scope.$index)" :disabled="scope.row.approveResult != 3 || scope.row.applyStatus != 9">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.page" :page-sizes="[10, 20, 50]" :page-size="filter.page_size" layout="total, sizes, prev, pager, next, jumper" :total="filter.totalCount"></el-pagination>
            </div>
        </div>

        <!-- 驳回理由弹窗S -->
        <el-dialog title="驳回理由" v-model="refuseDlg.isDlgShow" size="tiny">
            <el-form :model="refuseDlg" label-width="0">
                <el-form-item>
                    <el-input type="textarea" :rows="5" placeholder="请输入驳回理由" v-model.trim="refuseDlg.refuseRemark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="refuseDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="refuseDlg.isLoading" @click="handleBtnOkClick">确认</el-button>
            </span>
        </el-dialog>
        <!-- 驳回理由弹窗E -->

        <!-- 编辑申请库存数弹窗S -->
        <el-dialog title="编辑申请库存数" v-model="editStockDlg.isDlgShow" size="tiny" class="editStockDlg">
            <div class="text-center">
                <el-row>
                    <el-col :span="12"><strong>当前库存分布</strong></el-col>
                    <el-col :span="12"><strong>审批库存分配</strong></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">{{ editStockDlg.realWhName }}</el-col>
                    <el-col :span="6">{{ editStockDlg.freeStock }}</el-col>
                    <el-col :span="6">{{ editStockDlg.realWhName }}</el-col>
                    <el-col :span="6">
                        <el-input v-model.number="editStockDlg.freeStock" size="small" :readonly="editStockDlg.approveResult !== 3"></el-input>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="editStockDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="editStockDlg.isLoading" @click="handleEditStockBtnOkClick" :disabled="editStockDlg.approveResult !== 3">确认</el-button>
            </span>
        </el-dialog>
        <!-- 编辑申请库存数弹窗E -->

    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableData: [],
            isDataLoading: false,
            multipleSelection: [],
            sites: [],
            realWhCodeList: [],
            realWhCodeText: {},
            filter: {
                page: 1,
                page_size: 10,
                totalCount: 0,
                siteCode: '',
                realWhCode: '',
                realWhCodeTemp: '',
                name: '',
                nameTemp: '',
                priceId: '',
                priceType: '',
                goodSn: '',
                applyBeginTime: '',
                applyEndTime: '',
                startTime: '',
                endTime: '',
                applyTime: '',
                date: ''
            },
            refuseDlg: {
                isDlgShow: false,
                isLoading: false,
                refuseRemark: '',
                index: -1
            },
            editStockDlg: {
                isDlgShow: false,
                isLoading: false,
                realWhName: '',
                freeStock: '',
                approveResult: 1
            },
            siteCodes: {},
        };
    },
    created () {
        this.getListData();
        this.getSiteCodes();
        this.getRealWhCodeList();
    },
    methods: {
        getListData (page) {
            let params = {};
            if (page) {
                this.filter.page = page;
            }
            params = Object.assign({}, this.filter);
            delete params['totalCount'];
            if (this.filter.applyTime[0]) {
                let dateArr = this.timeZone_(this.filter.applyTime, this.$store.getters.getTimeZone);
                params.applyBeginTime = dateArr[0];
                params.applyEndTime = dateArr[1];
            }
            if (this.filter.date[0]) {
                let dateArr = this.timeZone_(this.filter.date, this.$store.getters.getTimeZone);
                params.startTime = dateArr[0];
                params.endTime = dateArr[1];
            }
            delete params.applyTime;
            delete params.date;
            delete params.realWhCodeTemp;
            delete params.name;
            delete params.nameTemp;
            this.isDataLoading = true;
            this.$http.get('stock/apply/list', { params: params }).then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.filter.totalCount = res.body.data.totalCount;
                } else {
                    this.tableData = [];
                    this.filter.totalCount = 0;
                }
                this.isDataLoading = false;
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
                this.isDataLoading = false;
            });
        },
        getSiteCodes () {
            this.$http.get('base/public/site-list').then(res => {
                let obj = {};
                if (res.body.code !== 0) {
                    return;
                }
                Array.isArray(res.body.data) && res.body.data.forEach(item => {
                    obj[item.code] = item.name;
                    this.sites.push(item);
                });
                this.$set(this, 'siteCodes', obj);
            });
        },
        getRealWhCodeList() {
            if (this.realWhCodeList.length > 0) {
                return;
            }
            this.$http.get('stock/real-warehouse/public-whcodes').then((res) => {
                let obj = {};
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message);
                    return;
                }
                Array.isArray(res.body.data) && res.body.data.forEach((item) => {
                    item.whCode && this.realWhCodeList.push({
                        value: item.name + '（' + item.whCode + '）',
                        code: item.whCode
                    });
                    obj[item.whCode] = item.name;
                });
                this.$set(this, 'realWhCodeText', obj);
          });
        },
        getSkuInfo(goodSn, realWhCode, siteCode) {
            if (!goodSn || !realWhCode || !siteCode) {
                return;
            }
            let params = { goodSn, realWhCode, siteCode };
            this.$http.get('stock/apply/sku-info', { params }).then((res) => {
                let data = res.body.data;
                if (res.body.code !== 0) {
                    this.$message.error('获取真实仓下sku库存分布时出错');
                    return;
                }
                this.editStockDlg = Object.assign({}, this.editStockDlg, data);
          });
        },
        handleBtnCancelFilterClick() {
            for (let item in this.filter) {
                if (item === 'page' || item === 'page_size' || item === 'totalCount') {
                    continue;
                }
                this.filter[item] = '';
            }
            this.filter.page = 1;
            // this.getListData();
            // console.log(this.filter);
        },
        changePage(value) {
            this.filter.page = value;
            this.getListData();
        },
        changePageSize(value) {
            this.filter.page_size = value;
            this.getListData();
        },
        handleSelectionChange(value) {
            this.multipleSelection = value;
        },
        multipleApprove(status, rows) {
            let items = [];
            let isPass = status === 1;
            (!rows ? this.multipleSelection : rows).forEach((item) => {
                items.push({
                    siteCode: item.siteCode,
                    priceId: item.priceId,
                    realCode: item.realWhCode,
                    goodSn: item.goodSn,
                    refuseRemark: isPass ? '' : this.refuseDlg.refuseRemark
                });
            });
            if (!items.length) {
                this.$message({
                    type: 'warning',
                    message: '请选择申请记录'
                });
                return;
            }
            if (isPass) {
                this.approvePass(items);
            } else {
                this.approveRefuse(items);
            }
        },
        approvePass(items) {
            // console.log(items);
            // return;
            this.$confirm('确认通过该库存审批？', '审批通过', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action !== 'confirm') {
                        done();
                        return;
                    }
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    this.$http.post('stock/apply/pass', { stockInfo: items }).then(res => {
                        if (res.body.code == 0) {
                            this.$message.success(res.body.message || '执行成功');
                            this.getListData();
                        } else {
                            this.$message.error(res.body.message || res.body.previous.message);
                        }
                        done();
                        instance.confirmButtonLoading = false;
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        handleBtnPassClick(index) {
            let item = this.tableData[index];
            this.multipleApprove(1, [item]);
        },
        handleBtnRefuseClick(index) {
            this.refuseDlg.index = index;
            this.refuseDlg.isDlgShow = true;
            this.refuseDlg.refuseRemark = '';
        },
        handleBtnOkClick() {
            if (this.refuseDlg.index === -1) {
                this.multipleApprove(0);
            } else {
                let item = this.tableData[this.refuseDlg.index];
                this.multipleApprove(0, [item]);
            }
        },
        approveRefuse(items) {
            // console.log(items)
            // return;
            this.refuseDlg.isLoading = true;
            this.$http.post('stock/apply/refuse', { stockInfo: items }).then(res => {
                if (res.body.code == 0) {
                    this.$message.success(res.body.message || '驳回成功');
                    this.getListData();
                } else {
                    this.$message.error(res.body.message || res.body.previous.message);
                }
                this.refuseDlg.isLoading = false;
                this.refuseDlg.isDlgShow = false;
            });
            this.refuseDlg.index = -1;
        },

        // 真实仓搜索
        querySearch(queryString, cb) {
            let items = this.realWhCodeList;
            let results = (queryString && this.filter.name != this.filter.nameTemp) ? items.filter(this.createFilter(queryString)) : items;         
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        handleSelectRealWhCode(item) {
            this.filter.realWhCodeTemp = this.filter.realWhCode = item.code;
            this.filter.nameTemp = this.filter.name;
            //this.filter.realWhCodeWhCode = item.rwhCode;
        },
        handleRealListDelIconClick() {
            this.filter.realWhCode = this.filter.realWhCodeTemp = '';
            this.filter.name = this.filter.nameTemp = '';
        },
        // querySearch(queryString, callback) {
        //     let list = this.realWhCodeList;
        //     let results = queryString ? list.filter(this.createFilter(queryString, 'value')) : list;
        //     callback(results);
        // },
        // createFilter(queryString, prop) {
        //     return (list) => {
        //         return list[prop].toUpperCase().indexOf(queryString.toUpperCase()) !== -1;
        //     };
        // },
        // handleSelectRealWhCode(val) {
        // },

        handleBtnEditClick(index) {
            let item = this.tableData[index];
            this.editStockDlg.isDlgShow = true;
            this.getSkuInfo(item.goodSn, item.realWhCode, item.siteCode);
        },
        handleEditStockBtnOkClick() {

        }
    }
}
</script>

