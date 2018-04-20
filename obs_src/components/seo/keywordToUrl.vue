<!-- 关键字跳转URL -->
<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">
            <div class="el-sub-container">
                <el-form inline :model="option" ref="searchForm">
                    <el-form-item label="关键词" prop="keywords">
                        <el-input v-model="option.keywords"></el-input>
                    </el-form-item>
                    <el-form-item label="语言" prop="lang">
                        <el-select clearable filterable v-model="option.lang">
                            <el-option v-for="(item, index) in langOpt" :key="index" :label="item.language_ch" :value="item.language_en"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道" prop="pipeline_code">
                        <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                            <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="text-right">
                        <el-button type="primary" @click="getData">筛选</el-button>
                        <el-button type="danger" @click="resetForm">清空</el-button>
                    </div>
                </el-form>
            </div>
            <div class="el-sub-container">
                <el-row>
                    <el-col :span="12">
                        <el-button :disabled="checkedRow.length === 0" type="danger" @click="batchRemove" v-if="self.showAction_('seo/keyword-redirect/match-delete')">批量删除</el-button>
                    </el-col>
                    <el-col :span="12" class="text-right">
                        <el-button type="primary" @click="handleBtnAddClick" v-if="self.showAction_('seo/keyword-redirect/add')">添加关键词</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table border :data="tableData" @selection-change="selectKeywords" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="keywords" label="关键词"></el-table-column>
                <el-table-column prop="pc_url" label="分类URL"></el-table-column>
                <!-- <el-table-column prop="m_url" label="M分类URL"></el-table-column> -->
                <el-table-column label="语言">
                    <template scope="scope">
                        {{ langText[scope.row.lang] }}
                    </template>
                </el-table-column>
                <el-table-column label="渠道">
                    <template scope="scope">
                        <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px" columnKey="handle">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="handleBtnEditClick(scope.row)" v-if="self.showAction_('seo/keyword-redirect/edit')">编辑</el-button> &nbsp;
                        <el-button type="danger" size="small" @click="remove(scope.row)" v-if="self.showAction_('seo/keyword-redirect/delete')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>

        <el-dialog :title="editDlg.isAdd ? '添加关键词' : '编辑关键词'" v-model="editDlg.isDlgShow" size="tiny">
            <el-form :model="editDlg" :rules="editDlgRules" ref="editDlg" label-width="100px">
                <el-form-item prop="keywords" label="关键词">
                    <el-input v-model="editDlg.keywords"></el-input>
                </el-form-item>
                <el-form-item prop="lang" label="语言">
                    <el-select v-model="editDlg.lang">
                        <el-option v-for="(item, index) in langOpt" :key="index" :label="item.language_ch" :value="item.language_en"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code">
                    <el-select v-model="editDlg.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="pc_url" label="分类URL">
                    <el-input v-model="editDlg.pc_url"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleBtnOkClick" v-loading="editDlg.isLoading" :disabled="editDlg.isLoading">确 定</el-button>
                <el-button type="danger" @click="editDlg.isDlgShow = false">取 消</el-button>
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
            isDataLoading: false,
            langOpt: '',
            langText: {},
            tableData: [],
            addform: {
                keywords: '',
                pc_url: '',
                m_url: '',
            },
            editDlg: {
                isDlgShow: false,
                isLoading: false,
                isAdd: true,
                index: -1,
                keywords: '',
                pc_url: '',
                m_url: '',
                lang: '',
                pipeline_code: '',
            },
            option: {
                keywords: '',
                lang: '',
                pipeline_code: '',
                size: 20,
                page: 1
            },
            addKeyword: false,
            total: 10,
            checkedRow: [],
            ids: '',
            editDlgRules: {
                keywords: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                lang: [{ required: true, message: '请选择语言', trigger: 'change' }],
                pipeline_code: [{ required: true, message: '请选择渠道', trigger: 'change' }],
                pc_url: [{ type: 'url', message: '请输入正确的URL', trigger: 'blur' }]
            }
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getData(true);
        },
        getData (isWithLang) {
            let promiseArr = [];
            this.isDataLoading = true;
            promiseArr[0] = this.$http.get('seo/keyword-redirect/list', {params: this.option});
            if (isWithLang === true) {
                promiseArr[1] = this.$http.get('admin/public/languages');
            }
            Promise.all(promiseArr).then((dataArr) => {
                this.isDataLoading = false;

                if (dataArr[1] && dataArr[1].body.code === 0) {
                    this.langOpt = dataArr[1].body.data;
                    dataArr[1].body.data.forEach((item) => {
                        this.langText[item.language_en] = item.language_ch;
                    });
                }

                this.tableData = [];
                if (dataArr[0].body.code === 0) {
                    Array.isArray(dataArr[0].body.data.data) && dataArr[0].body.data.data.forEach((item) => {
                        this.tableData.push(item);
                    });
                    this.total = dataArr[0].body.data.total || 0;
                } else {
                    this.$notify.error(dataArr[0].body.message || '发生错误');
                }

            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
                this.isDataLoading = false;
            });
        },
        handleBtnAddClick () {
            this.editDlg.isDlgShow = true;
            this.editDlg.isAdd = true;
            this.editDlg.index = -1;
            this.editDlg.id = -1;
            setTimeout(() => {
                this.$refs['editDlg'].resetFields();
            }, 100);
        },
        handleBtnEditClick (row) {
            let index = this.tableData.indexOf(row);
            if (row.id < 0) {
                return;
            }
            this.editDlg.isAdd = false;
            this.editDlg.isDlgShow = true;
            this.editDlg.index = index;
            this.editDlg.id = row.id;
            // console.log(this.editDlg);
            setTimeout(() => {
                this.$refs['editDlg'].resetFields();
                this.editDlg.keywords = row.keywords;
                this.editDlg.lang = row.lang;
                this.editDlg.pipeline_code = row.pipeline_code;
                this.editDlg.pc_url = row.pc_url;
                this.editDlg.m_url = row.m_url;
            }, 100);
        },
        handleBtnOkClick () {
            this.editDlg.isLoading = true;
            this.$nextTick();

            let hasError = false;
            let params = Object.assign({}, this.editDlg);
            let isAdd = params.isAdd;
            let index = params.index;
            this.$refs.editDlg.validate(valid => {
                if (!valid) {
                    hasError = true;
                    return false;
                }
            });
            if (hasError) {
                return;
            }
            delete params.isLoading;
            delete params.isDlgShow;
            delete params.isAdd;
            delete params.index;
            if (isAdd) {
                delete params.id;
            }

            this.$http.post('seo/keyword-redirect/' + (isAdd ? 'add' : 'edit'), params).then(res => {
                this.editDlg.isLoading = false;
                if (res.body.code === 0) {
                    if (res.body.code !== 0) {
                        this.$message.error(res.body.message || '失败');
                        return;
                    }
                    this.editDlg.isDlgShow = false;
                    this.$message.success(res.body.message || '成功');

                    // this.getData();
                    if (isAdd) {
                        this.getData();
                        return;
                    }
                    if (!this.tableData[index]) {
                        return;
                    }
                    this.tableData[index].keywords = params.keywords;
                    this.tableData[index].lang = params.lang;
                    this.tableData[index].pipeline_code = params.pipeline_code;
                    this.tableData[index].pc_url = params.pc_url;
                    this.tableData[index].m_url = params.m_url;
                } else {
                    this.$message.error(res.body.message);
                    this.editDlg.isLoading = false;
                }

            }).catch (err => {
                this.editDlg.isLoading = false;
            });
        },
        remove (row) {
            var self = this;

            self.$confirm('确认删除？', '提示', {
                type: 'warning'
            }).then(() => {
                self.$http.post('seo/keyword-redirect/delete', {id: row.id}).then(res => {
                    if (res.body.code == 0) {
                        var index = self.tableData.indexOf(row);

                        self.tableData.splice(index, 1);
                        self.total--;
                        self.$message({
                          message: res.body.message,
                          type: 'success'
                        });
                    } else {
                        self.$message.error(res.body.message);
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // render () {
        //     this.getData();
        // },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.size = val;
            this.getData();
        },
        goback () {
            history.back();
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
        },
        selectKeywords (val) {
            this.checkedRow = val;
            var temp = [];
            for (var i in val) {
                temp.push(val[i].id);
            }
            this.ids = temp.join(',');
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
        batchRemove () {
            var self = this;
            if (self.ids !== '') {
                self.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    self.$http.post('seo/keyword-redirect/match-delete', {ids: self.ids}).then(res => {
                        if (res.body.code === 0) {
                            self.getData();
                            self.$message({
                              message: res.body.message,
                              type: 'success'
                            });
                        } else {
                            self.$message.error(res.body.message);
                        }
                    });
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            } else {
                self.$message({
                    type: 'warning',
                    message: '请至少选择一项！'
                });
            }
        }
    }
}
</script>

<style>
</style>


