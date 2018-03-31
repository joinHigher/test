<!--运费模板-->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label="模板" prop="id">
                    <el-select v-model="option.id" clearable filterable>
                        <el-option v-for="item in templateList" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
                    <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <el-button type="primary" icon="plus" @click="newItem" v-if="self.showAction_('logistics/template/add')">添加运费模板</el-button>
            </div>
            <el-table ref="multipleTable" border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="name" label="模板名称" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.status==1">开启</span>
                        <span v-if="scope.row.status==0">关闭</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="修改时间" align="center">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <el-button type="primary" @click="editItem(scope.row)" v-if="self.showAction_('logistics/template/edit')">编辑</el-button>
                        <el-button type="danger" @click="removeItem(scope.row)" v-if="self.showAction_('logistics/template/delete')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo"
                           :page-sizes="[10, 20, 50]" :page-size="option.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>

        <!--添加、编辑运费模板弹窗-->
        <el-dialog :title="title" :visible.sync="templateDialog" size="tiny" class="templateDialog"
                   :before-close="cancelDialog">
            <el-row>
                <el-col :span="20">
                    <el-form :model="templateForm" labelWidth="100px" ref="templateForm" :rules="rules">
                        <el-form-item label="模板名称" prop="name">
                            <el-input v-model="templateForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-radio-group v-model="templateForm.status">
                                <el-radio label="1">开启</el-radio>
                                <el-radio label="0">关闭</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" @click="saveItem" v-if="self.showAction_('logistics/template/add')">保存</el-button>
                            <el-button type="danger" @click="cancelDialog" v-if="self.showAction_('logistics/template/add')">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import logistics from './js/logistics'
    Vue.use(logistics);

    export default {
        data () {
            return {
                self: this,
                option: {
                    pageNo: 1,
                    pageSize: 10,
                    id: '',
                },
                templateList: [], //运费模板list
                tableLoading: false,
                total: 0,
                tableData: [],
                title: '',
                titleList: ['新增运费模板', '编辑运费模板'],
                templateDialog: false,
                typeDialog: '',
                templateForm: {
                    name: '',
                    status: "1"
                },
                templateID: '',
                rules: {
                    name: [{required: true, message: '请输入模板名称', trigger: 'blur'}]
                },
            };
        },
        created () {
            this.templateList = this.getTemplateList();
            this.getData();
        },
        methods: {
            getData () {
                this.tableLoading = true;
                this.$http.get('logistics/template/list', {params: this.option}).then(res => {
                    this.tableLoading = false;
                    if (res.body.code === 0) {
                        this.tableData = res.body.data.list;
                        this.total = res.body.data.totalCount;
                    } else {
                        this.tableData = [];
                        this.total = 0;
                    }
                })
            },
            //筛选按钮
            getDataBySearch(){
                this.getData();
                this.option.pageNo = 1;
            },
            //删除单行
            removeItem (row) {
                this.$confirm('是否删除该项?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('logistics/template/delete', {id: row.id}).then(res => {
                        if (res.body.code === 0) {
                            let index = this.tableData.indexOf(row);
                            this.tableData.splice(index, 1);
                            this.total--;
                            this.templateList = this.getTemplateList();
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                        } else if (res.body.code === 60068) {
                            this.$message.error("开启状态或已关联发货区域，不允许删除!");
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除!'
                    });
                });
            },
            ChangePage (val) {
                this.option.pageNo = val;
                this.getData();
            },
            ChangePageSize (val) {
                this.option.pageSize = val;
                this.getData();
            },
            resetForm () {
                this.option.id = '';
                this.getDataBySearch();
            },

            cancelDialog (){
                this.$refs['templateForm'].resetFields();
                this.templateDialog = false;
            },

            newItem (){
                this.title = this.titleList[0];
                this.templateDialog = true;
                this.templateForm.name = '';
                this.templateForm.status = '1';
                this.typeDialog = 1;
            },

            editItem (row){
                this.title = this.titleList[1];
                this.templateDialog = true;
                this.typeDialog = 2;
                this.templateForm.name = row.name;
                this.templateForm.status = row.status.toString();
                this.templateID = row.id;
            },

            saveItem (){
                if (!this.templateForm.name.trim()) {
                    this.$message.error('请填写模板名称');
                    return false;
                }

                this.$refs['templateForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (this.typeDialog === 1) {
                        let params1 = {
                            name: this.templateForm.name.trim(),
                            status: this.templateForm.status
                        };
                        this.$http.post('logistics/template/add', params1).then(res => {
                            if (res.body.code === 0) {
                                this.$message.success("保存成功!");
                                this.templateDialog = false;
                                this.getData();
                                this.templateList = this.getTemplateList();
                            } else if (res.body.code === 60066) {
                                this.$message.error("名称重复，请修改名称!");
                            } else {
                                this.$message.error(res.body.message);
                            }
                        });
                    } else {
                        let params = {
                            id: this.templateID,
                            status: this.templateForm.status,
                            name: this.templateForm.name.trim()
                        };
                        this.$http.post('logistics/template/edit', params).then(res => {
                            if (res.body.code === 0) {
                                this.$message.success("保存成功!");
                                this.templateDialog = false;
                                this.getData();
                                this.templateList = this.getTemplateList();
                            } else if (res.body.code === 60066) {
                                this.$message.error("名称重复，请修改名称!");
                            } else if (res.body.code === 60068) {
                                this.$message.error("该运费模板已被使用，不允许关闭!");
                            } else {
                                this.$message.error(res.body.message);
                            }
                        });
                    }
                })
            },
        }
    }
</script>

<style lang="less">
    .templateDialog {
        .el-dialog--tiny {
            width: 450px !important;
        }
    }
</style>
