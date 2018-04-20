<template>
    <div>
        <div class="el-container">
            <h3 class="tpl-title">
                {{isEdit ? '模板编辑' : '模板添加'}}
                <el-button class="goback-btn" type="primary" @click="goBack">返回列表</el-button>
            </h3>
            <el-form :model="tplForm" ref="tplForm" :rules="rules" label-width="100px"  class="tpl-form">
                <el-form-item label="语言：" prop="lang">
                    <el-select v-model="tplForm.lang" placeholder="请选择" class="tpl-form-item">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道：" prop="pipeline_code">
                    <el-select clearable filterable v-model="tplForm.pipeline_code" placeholder="请选择" class="tpl-form-item">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板主题：" prop="name">
                    <el-input v-model="tplForm.name"  placeholder="请输入模板主题" class="tpl-form-item"></el-input>
                </el-form-item>
                <el-form-item label="内容：" prop="content">
                    <el-button @click="preview" type="primary" style="margin-bottom: 10px;">模板预览</el-button>
                    <el-input v-model="tplForm.content" type="textarea"  class="tpl-form-textarea"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary"  :loading="dataLoading" @click="saveTpl" v-if="ctrl">确认</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="模板预览" :visible.sync="isPreview" @close="closePreview" size="full">
            <div class="preview-container" v-html="this.tplForm.content"></div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                isPreview: false,
                langs: null,
                isEdit: false,
                tplForm: {
                    name: '',
                    content: '',
                    lang: '',
                    pipeline_code: '',
                },
                dataLoading: false,
                rules: {
                    lang: [
                        { required: true, message: '请选择语言', trigger: 'change' }
                    ],
                    pipeline_code: [
                        { required: true, message: '请选择渠道', trigger: 'change' }
                    ]
                }
            }
        },
        computed: {
            ctrl() {
                if (this.$route.query['id']) {
                    return this.showAction_('admin/general-widget/edit');
                } else {
                    return this.showAction_('admin/general-widget/add');
                }
            },
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.isEdit = this.$route.query.id ? true : false;
            if(this.isEdit) {
                this.getTplInfo();
            }
            this.initData();
        },
        methods: {
            initData() {
                this.getLangs();
            },
            // 获取语言列表
            getLangs() {
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    this.langs = res.body.data;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 获取模板Info
            getTplInfo() {
                this.$http.get('admin/general-widget/info', {params: {
                    id: this.$route.query.id
                }}).then(res => {
                    if (res.body.code == 0) {
                        let data = res.body.data;
                        delete data.create_time;
                        delete data.update_time;
                        this.tplForm = data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                })
            },
            // 保存
            saveTpl() {
                this.$refs.tplForm.validate((valid) => {
                    if (valid) {
                        this.dataLoading = true;
                        let params = JSON.parse(JSON.stringify(this.tplForm));
                        if(this.isEdit) {
                            params.id = this.$route.query.id;
                        }
                        // console.log(params.content)
                        this.$http.post('admin/general-widget/' + (this.isEdit ? 'edit' : 'add'), params).then(res => {
                            this.dataLoading = false;
                            if (res.body.code == 0) {
                                this.$message.success(res.body.message || '执行成功');
                                if(!this.isEdit){
                                    this.goBack();
                                }
                            } else {
                                this.$message.error(res.body.message || '发生错误');
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 返回
            goBack() {
                this.$router.push({ name: 'site_commonTplList' });
            },
            // 预览
            preview() {
                this.isPreview = true;
            },
            closePreview() {
                this.isPreview = false;
            }

        }
    }
</script>
<style lang="less">
    .tpl-title{
        color: #20A0FF;
        border-bottom: 1px solid #d3dce6;
        position: relative;
        margin-bottom: 27px;
        line-height: 40px;
        &:after{
            position: absolute;
            bottom: 0;
            left: 0;
            content: '';
            width: 100px;
            height: 3px;
            background-color: #20A0FF;
        }
        .goback-btn{
            float: right;
        }
    }
    .tpl-form{
        width: 60%;
        .tpl-form-item{
            width: 400px;
        }
        .tpl-ue-editor{
            .edui-default{
                line-height: 20px;
            }
        }
        .tpl-form-textarea{
            textarea {
                width: 700px;
                height: 500px;
            }
        }
    }
</style>
