<template>
    <div>
        <div class="el-container form-wrap">
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
                    <el-button type="primary" @click="getListData()"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>

            <div class="el-sub-container text-right">
                <el-button type="primary" @click="handleBtnAddClick" v-if="self.showAction_('seo/custom-sitemap/add')"><i class="el-icon-plus"></i> 添加站点地图</el-button>
            </div>
            <el-table :data="tableData" v-loading="isDataLoading" border>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="type" label="链接类型"></el-table-column>
                <el-table-column prop="name" label="项目名称"></el-table-column>
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
                <el-table-column prop="order" label="排序"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('seo/custom-sitemap/edit')" type="primary" size="small" @click="handleBtnEditClick(scope.row)">编辑</el-button> &nbsp;
                        <el-button v-if="self.showAction_('seo/custom-sitemap/delete')" type="danger" size="small" @click="handleBtnDelClick(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.page" :page-sizes="[10, 20, 50]" :page-size="filter.size" layout="total, sizes, prev, pager, next, jumper" :total="filter.totalCount"></el-pagination>
            </div>
        </div>

        <!-- 弹窗S -->
        <el-dialog :title="editDlg.isAdd ? '添加站点地图' : '编辑站点地图'" v-model="editDlg.isDlgShow" size="tiny">
            <el-form :model="editDlg" :rules="editRules" ref="editForm" label-width="100px">
                <el-form-item label="语言" prop="lang">
                    <el-select v-model="editDlg.lang" clearable placeholder="请选择">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code">
                    <el-select clearable filterable v-model="editDlg.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="项目名称：">
                    <el-input v-model.trim="editDlg.name"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="链接类型：">
                    <el-radio class="radio" v-model="editDlg.type" label="nofollow">nofollow</el-radio>
                    <el-radio class="radio" v-model="editDlg.type" label="dofollow">dofollow</el-radio>
                </el-form-item>
                <el-form-item prop="order" label="排序：">
                    <el-input v-model.trim="editDlg.order"></el-input>
                </el-form-item>
                <el-form-item prop="content" label="内容标题：">
                    <el-input v-model.trim="editDlg.content" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="editDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="editDlg.isLoading" @click="handleBtnOkClick">确认</el-button>
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
            filter: {
                page: 1,
                size: 10,
                totalCount: 0
            },
            editDlg: {
                isDlgShow: false,
                isLoading: false,
                isAdd: true,
                index: -1,
                name: '',
                id: -1,
                type: 'dofollow',
                order: '',
                content: '',
                lang: '',
                pipeline_code: '',
            },
            editRules: {
                name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
                content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                lang: [{ required: true, message: '该项不能为空', trigger: 'change' }],
                pipeline_code: [{ required: true, message: '该项不能为空', trigger: 'change' }],
            },
            filterForm: {
                lang: '',
                pipeline_code: '',
            },
            langTexts: {},
            langs: null,
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getLangs();
        this.getListData();
    },
    methods: {
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
        getListData () {
            let params = Object.assign({}, this.filter,this.filterForm);
            delete params.totalCount;
            // console.log(params);
            // return;
            if (this.isDataLoading) {
                return;
            }
            this.isDataLoading = true;
            this.$http.get('seo/custom-sitemap/list', { params: params }).then(res => {
                this.isDataLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '发生错误');
                    this.tableData = [];
                    return;
                }
                this.tableData = res.body.data.data;
                this.filter.totalCount = res.body.data.total;
            },
            (err) => {
                this.isDataLoading = false;
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        changePage(value) {
            this.filter.page = value;
            this.getListData();
        },
        changePageSize(value) {
            this.filter.size = value;
            this.getListData();
        },
        handleBtnAddClick () {
            this.editDlg.isDlgShow = true;
            this.$nextTick(() => {
                this.$refs['editForm'].resetFields();
            });
            this.editDlg.isAdd = true;
            this.editDlg.index = -1;
            this.editDlg.name = '';
            this.editDlg.id = -1;
            this.editDlg.type = 'dofollow';
            this.editDlg.content = '';
            this.editDlg.order = '';
            this.editDlg.lang = '';
            this.editDlg.pipeline_code = '';
        },
        handleBtnEditClick(row) {
            let index = this.tableData.indexOf(row);
            if (row.id < 0) {
                return;
            }
            this.editDlg.isAdd = false;
            this.editDlg.isDlgShow = true;
            this.editDlg.index = index;
            this.editDlg.name = row.name;
            this.editDlg.id = row.id;
            this.editDlg.type = row.type;
            this.editDlg.content = row.content;
            this.editDlg.order = row.order;
            this.editDlg.lang = row.lang;
            this.editDlg.pipeline_code = row.pipeline_code;
        },
        handleBtnDelClick(row) {
            let index = this.tableData.indexOf(row);
            let params = { id: row.id };
            if (params.id < 0) {
                return;
            }
            this.$confirm('确定要删除吗？', '提示', {
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
                    this.$http.post('seo/custom-sitemap/delete', params).then(res => {
                        done();
                        instance.confirmButtonLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message || '删除出错');
                            return;
                        }
                        this.$message.success(res.body.message || '删除成功');
                        // this.tableData.splice(index, 1);
                        this.getListData();
                    });
                }
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },
        handleBtnOkClick() {
            let hasError = false;
            let params = Object.assign({}, this.editDlg);
            let isAdd = params.isAdd;
            let index = params.index;
            this.$refs['editForm'].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    hasError = true;
                    return false;
                }
            });
            if (hasError) {
                return;
            }
            if (isAdd) {
                delete params.id;
            } else if (params.id < 0) {
                return;
            }
            delete params.isLoading;
            delete params.isDlgShow;
            delete params.isAdd;
            delete params.index;
            // console.log(params, isAdd, index);
            // return;
            this.editDlg.isLoading = true;
            this.$http.post('seo/custom-sitemap/' + (isAdd ? 'add' : 'edit'), params).then(res => {
                this.editDlg.isLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '失败');
                    return;
                }
                this.editDlg.isDlgShow = false;
                this.$message.success(res.body.message || '成功');
                if (isAdd) {
                    this.getListData();
                    return;
                }
                if (!this.tableData[index]) {
                    return;
                }
                this.tableData[index].name = params.name;
                this.tableData[index].type = params.type;
                this.tableData[index].content = params.content;
                this.tableData[index].order = params.order;
                this.tableData[index].lang = params.lang;
                this.tableData[index].pipeline_code = params.pipeline_code;
            },
            (err) => {
                this.editDlg.isLoading = false;
                this.$message.error(err.body.message || '发生错误');
            });
        },
        //
        resetForm() {
            this.$refs.searchForm.resetFields();
        },
    }
}
</script>

