<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">
            <div class="el-sub-container">
                <el-form inline :model="option" ref="searchForm">
                    <el-form-item label="语言：" prop="lang">
                        <el-select v-model="option.lang">
                            <el-option v-for="(item, index) in langs" :key="index" :label="item.language_ch" :value="item.language_en"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道：" prop="pipeline_code">
                        <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                            <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跳转类型：" prop="type">
                        <el-select clearable v-model="option.type">
                            <el-option v-for="(item, index) in types" :key="index" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="getData">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </el-form>
            </div>
            <div class="el-sub-container text-right">
                <el-button type="primary" @click="handleBtnAddClick" v-if="self.showAction_('seo/seo-redirect/add')">添加跳转</el-button>
            </div>
            <el-table border :data="tableData" ref="dataTable">
                <el-table-column prop="type" label="跳转类型"></el-table-column>
                <el-table-column prop="pre_value" label="跳转前的值"></el-table-column>
                <el-table-column prop="last_value" label="跳转后的值"></el-table-column>
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
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="handleBtnEditClick(scope.row)" v-if="self.showAction_('seo/seo-redirect/edit')">编辑</el-button> &nbsp;
                        <el-button type="danger" size="small" @click="handleBtnDelClick(scope.row)" v-if="self.showAction_('seo/seo-redirect/delete')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>

        <el-dialog :title="editDlg.isAdd ? '添加跳转' : '编辑跳转'" v-model="editDlg.isDlgShow" size="tiny">
            <el-form :model="editDlg" :rules="editDlgRules" ref="editDlg" label-width="120px">
                <el-form-item prop="lang" label="语言：">
                    <el-select clearable filterable v-model="editDlg.lang">
                        <el-option v-for="(item, index) in langs" :key="index" :label="item.language_ch" :value="item.language_en"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道：" prop="pipeline_code">
                    <el-select clearable filterable v-model="editDlg.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type" label="跳转类型：">
                    <el-select v-model="editDlg.type">
                        <el-option v-for="(item, index) in types" :key="index" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="pre_value" label="跳转前的值：">
                    <el-input v-model="editDlg.pre_value"></el-input>
                </el-form-item>
                <el-form-item prop="last_value" label="跳转后的值：">
                    <el-input v-model="editDlg.last_value"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleBtnOkClick" v-loading="editDlg.isLoading">确 定</el-button>
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
            addLoading: false,
            editLoading: false,
            tableData: [],
            types: [],
            editDlg: {
                isDlgShow: false,
                isLoading: false,
                isAdd: true,
                index: -1,
                type: '',
                pre_value: '',
                last_value: '',
                lang: '',
                pipeline_code: '',
            },
            option: {
                lang: '',
                pipeline_code: '',
                type: '',
                size: 20,
                page: 1
            },
            total: 10,
            editDlgRules: {
                type: [{ required: true, message: '请选择跳转类型', trigger: 'change' }],
                pre_value: [{ required: true, message: '请输入跳转前的值', trigger: 'blur' }],
                last_value: [{ required: true, message: '请输入跳转后的值', trigger: 'blur' }],
                lang: [{ required: true, message: '请选择语言', trigger: 'change' }],
                pipeline_code: [{ required: true, message: '请选择渠道', trigger: 'change' }],
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
        this.initData();
    },
    methods: {
        initData () {
            this.getData();
            this.getOptions();
        },
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
        getData () {
            if (this.isDataLoading) {
                return;
            }
            this.isDataLoading = true;
            this.$http.get('seo/seo-redirect/list', { params: this.option }).then(res => {
                this.isDataLoading = false;
                this.tableData = [];
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '发生错误');
                    return;
                }
                // this.tableData = res.body.data.data;
                Array.isArray(res.body.data.data) && res.body.data.data.forEach((item) => {
                    this.tableData.push(item);
                });
                this.total = res.body.data.total;
            },
            (err) => {
                this.isDataLoading = false;
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getOptions () {
            this.$http.get('seo/seo-redirect/options').then(res => {
                if (res.body.code !== 0) {
                    return;
                }
                for (let item in res.body.data) {
                    this.types.push({
                        key: item,
                        value: res.body.data[item]
                    });
                }
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

            setTimeout(() => {
                this.$refs['editDlg'].resetFields();
                this.editDlg.type = row.type;
                this.editDlg.pre_value = row.pre_value;
                this.editDlg.last_value = row.last_value;
                this.editDlg.lang = row.lang;
                this.editDlg.pipeline_code = row.pipeline_code;
            }, 100);
        },
        handleBtnOkClick () {
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

            //console.log(params);

            this.editDlg.isLoading = true;
            this.$http.post('seo/seo-redirect/' + (isAdd ? 'add' : 'edit'), params).then(res => {
                this.editDlg.isLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '失败');
                    return;
                }
                this.editDlg.isDlgShow = false;
                this.$message.success(res.body.message || '成功');

                this.getData();
            });
        },
        handleBtnDelClick (row) {
            this.$confirm('确认删除？', '提示', {
                type: 'warning'
            }).then(() => {
                this.isDataLoading = true;
                this.$http.post('seo/seo-redirect/delete', {id: row.id}).then(res => {
                    let index = this.tableData.indexOf(row);
                    this.isDataLoading = false;
                    if (res.body.code !== 0) {
                        this.$message.error(res.body.message);
                        return;
                    }
                    this.tableData.splice(index, 1);
                    this.total--;
                    this.$message({
                        message: res.body.message,
                        type: 'success'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.size = val;
            this.getData();
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.getData();
        },
    }
}
</script>

<style>
</style>


