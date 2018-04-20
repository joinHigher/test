<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/siteList'}">站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>编辑语言</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-form :model="langForm"  label-width="100px" :rules="editRule" ref="langForm">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="语言(中文)" prop="language_ch">
                            <el-input v-model="langForm.language_ch" required></el-input>
                        </el-form-item>
                        <el-form-item label="语言(英文)" prop="language_en">
                            <el-input v-model="langForm.language_en" required></el-input>
                        </el-form-item>
                        <el-form-item label="货币简码" prop="code">
                            <el-input v-model="langForm.code" required></el-input>
                        </el-form-item>
                        <el-form-item label="对应运费国家" prop="country">
                            <el-input v-model="langForm.country" required></el-input>
                        </el-form-item>
                        <el-form-item label="货币状态">
                            <el-radio class="radio" v-model="langForm.is_enable" label="1">启用</el-radio>
                            <el-radio class="radio" v-model="langForm.is_enable" label="0">禁用</el-radio>
                        </el-form-item>
                        <div class="text-right">
                            <el-button v-if="self.showAction_('base/language/edit')" type="primary" v-loading="saveLoading" @click="saveLanguage">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            saveLoading: false,
            langForm: {
                country: '',
                language_ch: '',
                language_en: '',
                code: '',
                platform: '',
                is_enable: ''
            },
            editRule: {
                language_ch: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                language_en: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                code: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                country: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }]
            }
        };

    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.$http.get('base/language/view', {params: {id: this.$route.query.id}}).then(res => {
                if (res.body.code === 0) {
                    this.langForm = res.body.data;
                }
            })
        },
        goback () {
            history.back();
        },
        saveLanguage () {
            var self = this;

            self.$refs.langForm.validate(valid => {
                if (valid) {
                    self.saveLoading = true;
                    self.$http.post('base/language/edit', self.langForm).then(res => {
                        self.saveLoading = false;
                        if (res.body.code == 0) {
                            self.$message({
                                message: res.body.message,
                                type: 'success'
                            });
                            self.goback();
                        } else {
                            self.$message.error(res.body.message);
                        }
                    });
                }
            })

        }
    }
}
</script>
<style>

</style>
