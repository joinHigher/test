<style lang="less">
.form-wrap { padding-bottom: 0; }
.pt-0,
.el-container .pt-0 { padding-top: 0; }
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
            <el-form inline :model="filter" ref="searchForm">
                <el-form-item label="真实仓：">
                    <!-- <el-input v-model="filter.realWhCode" placeholder=""></el-input> -->
                    <span class="ac-real-list-wrap">
                        <el-autocomplete v-model="filter.name" :fetch-suggestions="querySearch" @select="handleSelectRealWhCode" icon="circle-close" :on-icon-click="handleRealListDelIconClick"></el-autocomplete>
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                </el-form-item>
                <el-form-item label="申请站点：">
                    <el-select v-model="filter.siteCode" clearable placeholder="请选择">
                        <el-option v-for="val in sites" :label="val.name" :value="val.code" :key="val.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请状态：">
                    <el-select v-model="filter.approveStatus" clearable placeholder="请选择">
                        <el-option v-for="(val, key) in applyStatusText" :label="val" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请类型：">
                    <el-select v-model="filter.applyType" clearable placeholder="请选择">
                        <el-option v-for="(val, key) in applyTypeText" :label="val" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="申请时间：">
                    <el-date-picker v-model="filter.date" type="datetimerange" placeholder="选择申请时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" v-loading="isDataLoading" border>
                <el-table-column prop="realWhName" label="真实仓名称"></el-table-column>
                <el-table-column prop="realWhCode" label="真实仓代码"></el-table-column>
                <el-table-column label="申请时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="申请站点">
                    <template scope="scope">
                        <div>{{ self.siteCodes[scope.row.siteCode] ? self.siteCodes[scope.row.siteCode] : scope.row.siteCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="虚拟库存">
                    <template scope="scope">
                        <div>{{ scope.row.isVirtual == 1 ? '开' : '关' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="申请类型">
                    <template scope="scope">
                        <div>{{ applyTypeText[scope.row.applyType] }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="申请状态">
                    <template scope="scope">
                        <div>{{ applyStatusText[scope.row.approveStatus] }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('stock/site-access/pass')" type="success" size="small" @click="handleBtnPassClick(scope.$index)" :disabled="scope.row.approveStatus != 3">通过</el-button>
                        <el-button v-if="self.showAction_('stock/site-access/refuse')" type="danger" size="small" @click="handleBtnFailClick(scope.$index)" :disabled="scope.row.approveStatus != 3">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.page" :page-sizes="[10, 20, 50]" :page-size="filter.page_size" layout="total, sizes, prev, pager, next, jumper" :total="filter.totalCount"></el-pagination>
            </div>
        </div>

        <!-- 弹窗S -->
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
        <!-- 弹窗E -->
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
            filter: {
                page: 1,
                page_size: 10,
                totalCount: 0,
                date: '',
                realWhCode: '',
                realWhCodeTemp: '',
                name: '',
                nameTemp: '',
                siteCode: '',
                approveStatus: '',
                applyType: ''
            },
            applyStatusText: {
                '1': '审批通过',
                '2': '审批不通过',
                '3': '未审批',
                '4': '已撤回 '
            },
            applyTypeText: {
                '1': '真实仓接入',
                '2': '真实仓关闭'
            },
            refuseDlg: {
                isDlgShow: false,
                isLoading: false,
                refuseRemark: '',
                index: -1
            },
            siteCodes: {},
            realWhCodeList: [],
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
            delete params.totalCount;
            if (this.filter.date[0]) {
                let dateArr = this.timeZone_(this.filter.date, this.$store.getters.getTimeZone);
                params.applyStartTime = dateArr[0];
                params.applyEndTime = dateArr[1];
            }
            delete params.date;
            delete params.realWhCodeTemp;
            delete params.name;
            delete params.nameTemp;
            // console.log(params);
            // return;
            this.isDataLoading = true;
            this.$http.get('stock/site-access/list', { params: params }).then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list ? res.body.data.list: [];
                    this.filter.totalCount = res.body.data.totalCount;
                } else {
                    this.tableData = [];
                }
                this.isDataLoading = false;
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
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
            this.$http.get('stock/real-warehouse/public-whcodes').then((res) => {
                if (res.body.code === 0) {
                    res.body.data.forEach((item) => {
                        item.whCode && this.realWhCodeList.push({
                            value: item.name + '（' + item.whCode + '）',
                            code: item.whCode
                        });
                    });
                }
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
        handleBtnPassClick(index) {
            let item = this.tableData[index];
            if (!item.realWhCode || !item.siteCode) {
                return;
            }
            this.$confirm('确定将通过该仓库的申请？', '审批通过', {
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
                    this.$http.post('stock/site-access/pass', { siteCode: item.siteCode, realWhCode: item.realWhCode, virWhCode: item.virWhCode }).then(res => {
                        if (res.body.code == 0) {
                            this.$message.success(res.body.message || '执行成功');
                            item.approveStatus = 1;
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
        handleBtnFailClick(index) {
            this.refuseDlg.index = index;
            this.refuseDlg.isDlgShow = true;
        },
        handleBtnOkClick() {
            let item = this.tableData[this.refuseDlg.index];
            if (!item || !item.realWhCode || !item.siteCode) {
                return;
            }
            let params = { siteCode: item.siteCode, realWhCode: item.realWhCode, virWhCode: item.virWhCode };
            params.refuseRemark = this.refuseDlg.refuseRemark;
            this.refuseDlg.isLoading = true;
            this.$http.post('stock/site-access/refuse', params).then(res => {
                if (res.body.code == 0) {
                    this.$message.success(res.body.message || '驳回成功');
                    item.approveStatus = 2;
                } else {
                    this.$message.error(res.body.message || res.body.previous.message);
                }
                this.refuseDlg.isLoading = false;
                this.refuseDlg.isDlgShow = false;
            });
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
    }
}
</script>

