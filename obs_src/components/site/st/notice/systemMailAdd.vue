<template>
    <div>
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
                            <el-select v-model="form.uuqid" filterable>
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
                        <div class="text-center">
                            <el-button type="primary" @click="onSubmit" v-loading="postLoading" :disabled="postLoading">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </div>
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
            platforms: [],
            prevDialog: false,
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
                }],
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
        },
        getUuqids () {
            this.$http.get('admin/mail-template/get-uuqids').then(res => {
                this.uuqids = res.body.data;
            })
        },
        getLang () {
            this.$http.get('admin/public/languages').then(res => {
                this.platforms = res.body.data;
            })
        },
        onSubmit () {
            this.postLoading = true;
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$http.post('admin/mail-template/add', this.form).then(res => {
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
                    }).catch(err => {
                        this.postLoading = false;
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

</style>
