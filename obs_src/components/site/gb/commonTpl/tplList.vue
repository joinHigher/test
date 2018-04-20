<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="语言" prop="lang">
                    <el-select v-model="filterForm.lang" clearable placeholder="请选择">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code">
                    <el-select clearable filterable v-model="filterForm.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>
            <div class="btn-container text-right">
                <el-button type="primary" @click="addTpl" v-if="self.showAction_('admin/general-widget/add')">模板添加</el-button>
            </div>
            <el-table :data="tableData" border ref="table" v-loading="dataLoading">
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="name" label="主题"></el-table-column>
                <el-table-column label="语言">
                    <template scope="scope">
                        {{ langTexts[scope.row.lang] }}
                    </template>
                </el-table-column>
                <el-table-column label="渠道">
                    <template scope="scope">
                        <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最后修改时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.update_time, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button  type="primary" size="small" @click="editTpl(scope.row)" v-if="self.showAction_('admin/general-widget/info')">修改</el-button>
                        <el-button  type="danger" size="small" @click="delTpl(scope.row)" v-if="self.showAction_('admin/general-widget/delete')">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-right el-sub-container">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.page" :page-sizes="[10, 20, 50]" :page-size="pagination.page_size" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
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
                dataLoading: false,
                filterForm: {
                    lang: '',
                    pipeline_code: '',
                },
                pagination: {
                    page: 1,
                    page_size: 10,
                    total: 0
                },
                langTexts: {},
                langs: null,
            }
        },
        computed: {
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.getLangs();
                this.getListData();
            },
            // 获取列表数据
            getListData(page) {
                let params = {};
                if (page) {
                    this.pagination.page = page;
                }
                this.dataLoading = true;
                params = Object.assign({}, this.pagination, this.filterForm);
                delete params.total;
                this.$http.get('admin/general-widget/list', { params: params }).then(res => {
                    this.dataLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        this.pagination.total = 0;
                        return;
                    }
                    this.tableData = res.body.data.data;
                    this.pagination.total = res.body.data.total;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 获取语言列表
            getLangs() {
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    this.langs = res.body.data;
                    let langTexts = {};
                    res.body.data.forEach((item) => {
                        langTexts[item.language_en] = item.language_ch;
                    });
                    this.langTexts = Object.assign({}, this.langTexts, langTexts);
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 添加通常模板
            addTpl() {
                this.$router.push({ name: 'site_commonTplAdd' });
            },
            // 编辑通常模板
            editTpl(row) {
                this.$router.push({ name: 'site_commonTplEdit', query: { id: row.id }});
            },
            // 删除通常模板
            delTpl(row) {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('admin/general-widget/delete', {
                        id: row.id
                    }).then(res => {
                        if (res.body.code == 0) {
                            this.getListData();
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message.info( '已取消删除');
                });
            },
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
            },
            // 改变每页显示数
            changePageSize(value) {
                this.pagination.page = 1;
                this.pagination.page_size = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this.pagination.page = value;
                this.getListData();
            }
        }
    }
</script>
<style>
    .btn-container {
        margin: 20px 0;
    }
</style>
