<template>
    <div>
        <el-breadcrumb separator="/" class="el-container top">
            <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/notice/siteMailList'}">通知管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/notice/systemMailList'}">系统邮件</el-breadcrumb-item>
            <el-breadcrumb-item>编辑邮件模板</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="el-container">
            <el-tabs class="full" active-name="1" type="card">
                <el-tab-pane v-for="(item, index) in platforms" :label="item.language_ch" :key="index"></el-tab-pane>
            </el-tabs>
            <el-form :model="form" label-width="100px" :rules="formRule" ref="form">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="标题" prop="subject">
                            <el-input v-model="form.subject"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" >
                        <el-form-item label="内容" prop="content">
                            <el-input type="textarea" v-model="form.content" :rows="9"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11":offset="1">
                        <el-button type="primary" @click="preview">预览</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="选择识别码" prop="uuqid">
                            <el-select v-model="form.uuqid">
                                <el-option v-for="(item, index) in uuqids" :label="item" :value="index" :key="index">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="form.memo"></el-input>
                        </el-form-item>
                        <el-form-item label="使用状态" prop="is_using">
                            <el-radio-group v-model="form.is_using">
                                <el-radio class="radio" label="1">启用</el-radio>
                                <el-radio class="radio" label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit" v-loading="postLoading">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 弹窗S -->
            <el-dialog title="预览" v-model="prevDialog" size="normal">
                <div v-html="form.content" class="prew-mail"></div>
            </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            postLoading: false,
            form: {
                subject: '',
                content: '',
                memo: '',
                is_using: '0',
                id: 0,
                uuqid: ''
            },
            uuqids: {},
            prevDialog: false,
            platforms: [],
            formRule: {
                subject: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                content: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                uuqid: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                is_using: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }]
            }
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getLang();
            this.getUuqids();
            this.getData();
        },
        getLang () {
            this.$http.get('admin/public/languages').then(res => {
                this.platforms = res.body.data;
            })
        },
        getData () {
            this.$http.get('admin/mail-template/info?id=' + this.$route.query.id).then(res => {
                var data = res.body.data;
                data.is_using += '';
                this.form = data;
            })
        },
        getUuqids () {
            this.$http.get('admin/mail-template/get-uuqids').then(res => {
                this.uuqids = res.body.data;
            })
        },
        onSubmit () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.postLoading = true;
                    this.$http.post('admin/mail-template/edit', this.form).then(res => {
                        this.postLoading = false;

                        if (res.body.code == 0) {
                            history.back();
                            this.$message({
                                type: 'success',
                                message: res.body.message
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }
            });
        },
        goback () {
            history.back();
        },
        preview () {
            this.prevDialog = true;
        }
    }
}
</script>

<style>
    .prew-mail {
        margin: 0 auto;
    }

    .prew-mail meta + table {
        margin: 0 auto;
    }
</style>
