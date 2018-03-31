<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="IOS" name="3"></el-tab-pane>
                <el-tab-pane label="安卓" name="4"></el-tab-pane>
            </el-tabs>
            <el-form label-width="160px">
                <el-form-item label="版本升级设置">
                    <el-col :span="18">
                        <el-button type="primary" @click="addNewVersion" class="mb10" v-if="self.showAction_('admin/app-version/add')">添加新版本</el-button>
                        <el-table border :data="tableData">
                            <el-table-column label="版本" prop="version"></el-table-column>
                            <el-table-column label="升级控制">
                                <template scope="scope">
                                    <div class="checkbox-wrap" @click="forceUpdateAppVersion($event,scope.row.id,scope.row.is_force_update)">
                                        <el-checkbox v-model="scope.row.is_force_update" :true-label="1" :false-label="0">强制升级<span class="text-danger">（慎用）</span></el-checkbox>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template scope="scope">
                                    <el-button type="danger" size="mini" @click="deleteVersion(scope.row.id)" v-if="self.showAction_('admin/app-version/delete')">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-form-item>

                <hr class="mb30">

                <div class="version-num-wrap">
                    <el-form-item label="版本号">
                        <el-col :span="5">
                            <el-input v-model="current.version"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="5">
                            <el-radio-group v-model="current.is_tips">
                                <el-radio :label="1">展示升级提示</el-radio>
                                <el-radio :label="0">不展示升级提示</el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="5">
                            <div class="text-right el-sub-container">
                                <el-button type="primary" @click="updateAppVersion(current.id)">保存</el-button>
                            </div>
                        </el-col>
                    </el-form-item>
                </div>

                <hr class="mb30">

                <div class="version-num-wrap">
                    <el-form-item label="升级提示文案">
                        <el-col :span="12">
                            <el-tabs v-model="tips_desc_tabs" @tab-click="handleLangClick">
                                <el-tab-pane v-for="(item, index) in langOpt" :label="item" :name="index" :key="index">
                                    <el-input v-model="content" type="textarea" :rows="6"></el-input>
                                </el-tab-pane>
                            </el-tabs>
                            <div class="text-right el-sub-container">
                                <el-button type="primary" @click="editContent()">保存</el-button>
                            </div>
                        </el-col>
                    </el-form-item>
                </div>

            </el-form>
        </div>

        <!--新增app版本dialog-->
        <el-dialog title="新增app版本" v-model="dialog_add_version" size="tiny">
            <el-form label-width="80px" :model="form">
                <el-form-item label="版本号" prop="version" :rules="required">
                    <el-input v-model="form.version"></el-input>
                </el-form-item>
            </el-form>
            <div class="text-right">
                <el-button type="primary" @click="saveAppNewVersion">确 定</el-button>
                <el-button @click="dialog_add_version = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                required: [{
                    required: true,
                    message: '该项不能为空'
                }],
                langOpt: {},
                isDataLoading: false,
                activeName: '3',
                dialog_add_version: false,
                form: {
                    version: '',
                },
                current: {
                    is_tips: '',
                    version: '',
                    id: ''
                },
                content: '',
                contentId: '',
                tempContent: [],
                tableData: [],
                tips_desc_tabs: 'en',
            };
        },
        created() {
            this.getData();
            this.getLang();
        },
        methods: {
            getData() {
                let params = {};
                params.platform = parseInt(this.activeName);
                this.isDataLoading = true;
                this.$http.get('admin/app-version/list', {params: params}).then(res => {
                    if (res.body.code !== 0) {
                        this.$message.error(res.body.message);
                        return false;
                    }
                    this.isDataLoading = false;
                    let data = res.body.data;
                    this.tableData = data.history;

                    //
                    this.content = '';
                    if(data.current !== null){
                        this.current.id = data.current.id;
                        this.current.version = data.current.version;
                        this.current.is_tips = data.current.is_tips;

                        this.tempContent = data.current.contents;
                        if(this.tempContent.length > 0){
                            this.getContent();
                        }
                    }
                });
            },
            getLang() {
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code === 0) {
                        let temp = {};
                        let data = res.body.data;
                        data.forEach(item => {
                            temp[item.language_en] = item.language_ch;
                        });

                        this.langOpt = temp;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            //新增app版本
            addNewVersion() {
                this.form.version = '';
                this.dialog_add_version = true;
            },
            //保存新版本
            saveAppNewVersion() {
                let params = {};
                params.platform = parseInt(this.activeName);
                params.version = this.form.version;

                this.$http.post('admin/app-version/add', params).then(res => {
                    if(res.body.code === 0){
                        this.dialog_add_version = false;
                        this.getData();
                        this.$message({
                            message: res.body.message,
                            type: 'success'
                        });
                    }else{
                        this.$message.error(res.body.message);
                    }
                });
            },
            //删除版本
            deleteVersion(id) {
                let params = {
                    id: id
                };
                this.isDataLoading = true;
                this.$http.post('admin/app-version/delete', params).then(res => {
                    if(res.body.code === 0){
                        this.isDataLoading = false;
                        this.getData();
                        this.$message({
                            message: res.body.message,
                            type: 'success'
                        });
                    }else{
                        this.isDataLoading = false;
                        this.$message.error(res.body.message);
                    }
                });
            },
            //修改版本
            updateAppVersion(id) {
                let params = {
                    id: id,
                    version: this.current.version,
                    is_tips: this.current.is_tips
                };
                this.isDataLoading = true;
                this.$http.post('admin/app-version/edit', params).then(res => {
                    if(res.body.code === 0){
                        this.isDataLoading = false;
                        this.getData();
                        this.$message({
                            message: res.body.message,
                            type: 'success'
                        });
                    }else{
                        this.isDataLoading = false;
                        this.$message.error(res.body.message);
                    }
                });
            },
            //升级文案
            editContent(){
                let params = {},
                    url = '';

                params.app_version_id = this.current.id;
                params.content = this.content;
                params.lang = this.tips_desc_tabs;

                if(this.contentId !== ''){
                    params.id = this.contentId;
                    url = 'admin/app-version/edit-content';
                }else{
                    url = 'admin/app-version/add-content';
                }

                this.isDataLoading = true;
                this.$http.post(url, params).then(res => {
                    if(res.body.code === 0){
                        this.isDataLoading = false;
                        this.getData();
                        this.$message({
                            message: res.body.message,
                            type: 'success'
                        });
                    }else{
                        this.isDataLoading = false;
                        this.$message.error(res.body.message);
                    }
                });
            },
            //切换平台
            handleClick() {
                this.getData();
                this.tips_desc_tabs = 'en';
            },
            //获取升级提示文案
            getContent() {
                this.contentId = '';
                this.content = '';
                this.tempContent.forEach(item => {
                    if(this.tips_desc_tabs === item.lang){
                        this.content = item.content;
                        this.contentId = item.id;
                    }
                });
            },
            //切换语言
            handleLangClick(){
                this.getContent();
            },
            //强制升级
            forceUpdateAppVersion(event,id,is_force_update){

                // 是否有权限
                if (!this.showAction_('admin/app-version/edit')) {
                    this.$message({
                        type: 'warning',
                        message: '没有操作权限'
                    });
                    return false;
                }

                event.preventDefault();
                let title = '';
                is_force_update === 1 ? title = '是否取消强制升级' : title = '是否强制升级';
                is_force_update === 1 ? is_force_update = 0 : is_force_update = 1;

                this.$confirm(title, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        platform: parseInt(this.activeName),
                        id: id,
                        is_force_update: is_force_update
                    };
                    this.isDataLoading = true;
                    this.$http.post('admin/app-version/edit', params).then(res => {
                        if(res.body.code === 0){
                            this.getData();
                            this.isDataLoading = false;
                            this.$message({
                                message: res.body.message,
                                type: 'success'
                            });
                        }else{
                            this.isDataLoading = false;
                            this.$message.error(res.body.message);
                        }
                    });
                }).catch(() => {

                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .mb30{margin-bottom: 30px;}
    .mb10{margin-bottom: 10px;}
    .w-600{width: 600px;}
    .version-num-wrap{
        .el-form-item{
            margin-bottom: 5px;
        }
    }
    .checkbox-wrap{
        cursor: pointer;
        display: inline-block;
    }
</style>
