<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filter" ref="searchForm">
                <el-form-item label="真实仓" prop="realWhCode">
                    <span class="ac-real-list-wrap">
                        <el-autocomplete v-model="filter.name" placeholder="真实仓名称/代码" :fetch-suggestions="querySearch" @select="handleSelectRealWhCode" icon="circle-close" :on-icon-click="handleRealListDelIconClick" class="w405"></el-autocomplete>
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                </el-form-item>
                <el-form-item class="ml30">
                    <el-button type="primary" @click="filterForm"><i class="el-icon-search"></i>筛选</el-button>
                    <el-button type="danger" @click="resetFrom">清空</el-button>
                </el-form-item>
            </el-form>

            <div class="text-right el-sub-container">
                <el-row class="text-left setting-wrap pull-left">
                    <el-col :span="14">
                        <span>默认库存更新规则：公有比率（%）=&nbsp;</span>
                        <el-input size="small" disabled class="w100" v-model="defaultPercentRule.publicPercentDefault"></el-input>
                    </el-col>
                    <el-col :span="8">
                        <span>私有比率（%）=&nbsp;</span>
                        <el-input size="small" disabled class="w100" v-model="defaultPercentRule.privatePercentDefault"></el-input>
                    </el-col>
                </el-row>
                <router-link class="el-button el-button--primary" :to="{path: '/stock/update-rule/edit', query: { type: 'add' }}">+新增更新规则</router-link>
            </div>

            <!--筛选结果-->
            <div class="el-sub-container">
                <el-table :data="tableData" v-loading="isDataLoading" border class="text-center">
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="真实仓" prop="realWhName"></el-table-column>
                    <el-table-column label="仓代码" prop="realWhCode"></el-table-column>
                    <el-table-column label="公有比率（%）" prop="publicPercent"></el-table-column>
                    <el-table-column label="私有比率（%）" prop="privatePercent"></el-table-column>
                    <el-table-column label="最近操作人" prop="operateUser"></el-table-column>
                    <el-table-column label="最近更新时间" prop="updateTime">
                        <template scope="scope">
                            {{ self.timeZone_(scope.row.updateTime / 1000, self.$store.getters.getTimeZone) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <router-link class="edit-link" :to="{path: '/stock/update-rule/edit', query: { type: 'edit', realWhCode: scope.row.realWhCode }}">编辑</router-link>
                        </template>
                    </el-table-column>
                </el-table>

                <!--分页-->
                <div class="el-sub-container text-right">
                    <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.pageNo" :page-sizes="[10, 20, 50]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                self: this,
                tableData: [],
                isDataLoading: false,
                filter: {
                    isPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    realWhCode: '',
                    realWhCodeTemp: '',
                    name: '',
                    nameTemp: '',
                },
                defaultPercentRule: {
                    privatePercentDefault: '',
                    publicPercentDefault: ''
                },
                totalCount: 0,
                realWhCodeList: [],
            };
        },
        created() {
            this.getRealWhCodeList();
            this.getDefaultPercentRule();
            this.getListData();
        },
        methods: {
            getListData() {
                let params = Object.assign({}, this.filter);

                delete params.realWhCodeTemp;
                delete params.name;
                delete params.nameTemp;
                this.isDataLoading = true;
                this.$http.get('stock/stock/query-stock-percent-rule-list', { params: params }).then(res => {
                    if (res.body.code === 0) {
                        this.tableData = res.body.data.list;
                        this.totalCount = res.body.data.totalCount;
                    }
                    this.isDataLoading = false;
                },(err) => {
                    this.$notify.error({
                        title: err.body.name || '错误',
                        message: err.body.message || '发生错误'
                    });
                });
            },
            //查询默认库存更新规则
            getDefaultPercentRule() {
                this.$http.get('stock/stock/query-default-stock-percent-rule').then(res => {
                    if (res.body.code === 0) {
                        this.defaultPercentRule = res.body.data;
                    }
                    this.isDataLoading = false;
                },(err) => {
                    this.$notify.error({
                        title: err.body.name || '错误',
                        message: err.body.message || '发生错误'
                    });
                });
            },
            //获取真实仓
            getRealWhCodeList() {
                this.$http.get('stock/real-warehouse/public-whcodes').then((res) => {
                    if (res.body.code === 0) {
                        let tempArr = [];
                        res.body.data.forEach((item) => {
                            item.whCode && tempArr.push({
                                value: item.name + '（' + item.whCode + '）',
                                code: item.whCode
                            });
                        });
                        this.realWhCodeList = tempArr;
                    }
                });
            },
            filterForm() {
                this.filter.pageNo = 1;
                this.getListData();
            },
            resetFrom() {
                this.$refs['searchForm'].resetFields();
                this.handleRealListDelIconClick();
            },
            changePage(value) {
                this.filter.pageNo = value;
                this.getListData();
            },
            changePageSize(value) {
                this.filter.pageSize = value;
                this.getListData();
            },
            // 真实仓搜索
            querySearch(queryString, cb) {
                let items = this.realWhCodeList;
                let results = null;
                results = (queryString && this.filter.name != this.filter.nameTemp) ? items.filter(this.createFilter(queryString)) : items;
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
            },
            handleRealListDelIconClick() {
                this.filter.name = this.filter.nameTemp = this.filter.realWhCode = this.filter.realWhCodeTemp = '';
            },
        }

    }
</script>

<style lang="less">
    .ac-real-list-wrap { display: block; position: relative;
        .el-icon-circle-close { visibility: hidden; z-index: 5; }
        .el-input { z-index: 2; }
        input { background: none; }
        > i { position: absolute; top: 50%; right: 10px; transform: translateY(-50%); color: #bfcbd9; font-size: 12px; z-index: 1; }
        &:hover {
            > i { visibility: hidden; }
            .el-icon-circle-close { visibility: visible; }
        }
        .edit-dlg & { display: inline-block; }
        .edit-dlg & > i { right: 20px; }
    }
    .ml30 {
        margin-left: 30px;
    }
    .w100{width: 100px;}
    .w400{width: 400px;}
    .w405{width: 405px;}
    .setting-wrap{
        width: 650px;
        background: #F2F2F2;
        padding: 6px 10px;
        color: #48576a;
        font-size: 13px;
    }
    .edit-link{
        color: #169BD5;
        &:hover{
            text-decoration: underline;
        }
    }
    .el-table__header-wrapper{
        td,th{text-align: center;}
    }
</style>
