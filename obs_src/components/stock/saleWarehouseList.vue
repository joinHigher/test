<!-- 销售仓管理 -->
<template>
        <div class="el-container">
            <el-form inline :model="filter" ref="filterForm">
                <el-form-item label="销售仓：" prop="saleWhCode">
                    <span class="ac-sale-list-wrap">
                        <el-autocomplete v-model="filter.name" :fetch-suggestions="querySearch" placeholder="销售仓名称/英文名称/仓编码" icon="circle-close" :on-icon-click="handleSaleListDelIconClick"></el-autocomplete>
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                </el-form-item>
                <el-form-item label="开启状态">
                    <el-select v-model="filter.status" clearable  placeholder="请选择">
                        <el-option label="开启" :value="1"></el-option>
                        <el-option label="关闭" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleBtnFilterClick"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>
            <div class="el-sub-container text-right pt-0">
                <!-- 待改 -->
                <el-button v-if="this.showAction_('stock/warehouse/add')" type="primary" @click="handleBtnAddClick"><i class="el-icon-plus"></i> 添加销售仓</el-button>
            </div>

            <el-table :data="tableData" v-loading="isDataLoading" border>
                <el-table-column label="销售仓名称">
                    <template scope="scope">
                        {{scope.row.virWhCnName}}
                        <el-tag type="danger" v-if="scope.row.isDefault === 1">默认仓</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="virWhEnName" label="英文名称"></el-table-column>
                <el-table-column prop="virWhCode" label="仓编码"></el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
                <el-table-column label="是否开启">
                    <template scope="scope">
                        <el-button type="text">
                            <i :class="{'el-icon-circle-check color-success': scope.row.status == 1, 'el-icon-circle-cross color-danger': scope.row.status == 0}" @click="handleBtnToggleStatusClick(scope.row)"></i>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="operateUser" label="操作人"></el-table-column>
                <el-table-column label="最近更新时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.lastOperateTime, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('stock/warehouse/edit')" type="text"  @click="handleBtnEditClick(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.pageNo" :page-sizes="[10, 20, 50]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="filter.total_count"></el-pagination>
            </div>
        </div>
</template>

<script>


export default {
    data () {
        return {
            self: this,
            wareOpt: [],
            tableData: [],
            isDataLoading: false,
            saleWhCodeList: [],
            filter: {
                pageNo: 1,
                pageSize: 10,
                total_count: 0,
                // saleWhCode: '',
                name: '',
                status: ''
            },
        };
    },
    created () {
        window.a = this;
        this.getListData();
        this.getDropDownData();
    },
    methods: {
        // 获取下拉框数据
        getDropDownData() {
            this.$http.get('stock/warehouse/vir-wh-drop-down').then(res => {
                if (res.body.code === 0) {
                    let saleWhCodeList = [];
                    let data = res.body.data;
                    data.list && data.list.forEach((item, index) => {
                        item.value = item.virWhCnName + '（' + item.virWhEnName + '）'
                        item.virWhCode && saleWhCodeList.push({
                            value: item.value,
                            code: item.virWhCode
                        });
                    });
                    this.wareOpt = data.list;
                    this.saleWhCodeList = saleWhCodeList;
                }
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
            });
        },
        // 获取列表数据
        getListData(page) {
            let params = {};
            if (page) {
                this.filter.pageNo = page;
            }
            params = Object.assign({}, this.filter);
            if(params.name) {
                let temp = [],
                    searchName = params.name.toLowerCase();
                this.wareOpt.forEach(ware => {
                    if (ware.virWhCnName.toLowerCase().indexOf(searchName) != -1 
                        || ware.virWhEnName.toLowerCase().indexOf(searchName) != -1 
                        || ware.value.toLowerCase().indexOf(searchName) != -1 
                        || ware.virWhCode.toLowerCase().indexOf(searchName) != -1) {

                        temp.push(ware.virWhCode);
                    }
                })
                params.virWhCodeList = temp.length > 0 ? temp : ['0'];
            }
            if(!params.status && params.status !== 0){
                delete params.status;
            }

            delete params.total_count;
            delete params.name;
            // delete params.saleWhCode;
            this.isDataLoading = true;
            this.$http.get('stock/warehouse/list', { params: params }).then(res => {
                if (res.body.code === 0) {
                    this.tableData = [];
                    res.body.data.list && res.body.data.list.forEach((item, index) => {
                        this.tableData.push(Object.assign({}, item, { isRequest: false }));
                    });
                    this.filter.total_count =  res.body.data.totalCount;
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
        // 销售仓搜索
        querySearch(queryString, cb) {
            let items = this.saleWhCodeList;
            let results = null;
            results = queryString ? items.filter(this.createFilter(queryString)) : items;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        // handleSelectSaleWhCode(item) {
        //     this.filter.saleWhCode = item.code;
        //     this.filter.name = item.value;
        // },
        handleSaleListDelIconClick() {
            // this.filter.saleWhCode = '';
            this.filter.name = '';
        },
        handleBtnFilterClick() {
            this.getListData(1);
        },
        handleBtnCancelFilterClick() {
            // this.filter.saleWhCode = '';
            this.filter.name = '';
            this.filter.pageNo = 1;
            this.filter.status = '';
        },
        changePageSize(value) {
            this.filter.pageSize = value;
            this.getListData();
        },
        changePage(value) {
            this.filter.pageNo = value;
            this.getListData();
        },
        handleBtnAddClick() {
            this.$router.push({ name: 'stock_saleWarehouseAdd' });
        },
        handleBtnEditClick(row) {
            this.$router.push({ name: 'stock_saleWarehouseEdit', query: { virWhCode: row.virWhCode }});
        },
        // 快捷修改开启状态
        handleBtnToggleStatusClick(row) {
            if(row.isDefault === 1 && row.status === 1) {
                return this.$message({
                    type: 'warning',
                    message: '默认仓不能关闭！'
                });
            }
            this.$msgbox({
                title:  row.status === 1 ? '关闭销售仓' : '开启销售仓',
                message: row.status === 1 ? '确定要关闭此销售仓吗？（需要对应网站运营负责人审批通过才能关闭）' : '确定要开启此销售仓吗？（开启后将在网站前台显示支持售卖）',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中...';
                        this.$http.post('stock/warehouse/update-vwh-status', { virCode: row.virWhCode, status: row.status === 1 ? 0 : 1 }).then((res) => {
                            done();
                            instance.confirmButtonLoading = false;
                            row.status = row.status === 1 ? 0 : 1;
                             this.$message({
                                type: 'success',
                                message: '处理成功！'
                            });
                        },
                        (err) => {
                            row.isRequest = false;
                            this.$notify.error(err.body.message || '发生错误');
                        });


                    } else {
                        done();
                    }
                }
            }).catch(action => {
                this.$message({
                    type: 'success',
                    message: '已取消'
                });
            });
        }
    }
}
</script>
<style lang="less">

.el-form-item { margin-bottom: 10px; }
.pt-0,
.el-container .pt-0 { padding-top: 0; }
table .el-tag{
    margin-left: 5px;
}
.ac-sale-list-wrap { display: block; position: relative;
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
