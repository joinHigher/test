<template>
    <div>
        <div class="el-container" v-loading="dataLoading">
            <h3 v-text="channelName" class="manage-title"></h3>
            <el-radio-group  v-model="form.platform" @change="changePlatform">
                <template v-for="(item, key) in platforms">
                    <el-radio-button :label="item">{{key}}</el-radio-button>
                </template>
            </el-radio-group>
            <el-form :model="form"  ref="form" label-width="120px" :rules="rules" class="manage-form">
                <el-form-item label="channel_name：">
                    <el-input v-model="channelName" :disabled="true" class="manage-input"></el-input>
                </el-form-item>
                <el-form-item v-if="!form.creditcard" label="Logo：" prop="channelLogo">
                    <el-input v-model="form.channelLogo" class="manage-input"></el-input>
                    <el-button type="primary" icon="view" @click="onShowLogo">预览</el-button>
                </el-form-item>
                <hr/>
                <h5 class="manage-form-title">请根据多语言进行配置，英语为默认语言。</h5>
                <el-form-item label="配置多语言：" prop="lang">
                    <el-select v-model="form.lang" clearable filterable placeholder="请选择" class="manage-input" @change="changeLang">
                        <el-option v-for="lang in langs" :label="lang.language_ch" :value="lang.language_en" :key="lang.language_code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="pay_name：" prop="paymentName">
                    <el-input v-model="form.paymentName" class="manage-input" placeholder="请输入支付方式名称"></el-input>
                </el-form-item>
                <el-form-item label="支付方式说明：" prop="channelSubject">
                    <el-input v-model="form.channelSubject" type="textarea" class="manage-input" placeholder="请输入说明"></el-input>
                </el-form-item>
                <el-form-item label="支付方式介绍：" prop="channelDescribe">
                    <el-input v-model="form.channelDescribe" type="textarea" class="manage-input" placeholder="请输入支付方式介绍"></el-input>
                </el-form-item>
                <el-form-item v-if="showAction_('pay/channel-letters/update')">
                    <el-button type="primary" @click="onSave" :loading="dataLoading">保存</el-button>
                     <router-link :to="{name: 'copyManagement'}">
                        <el-button>返回列表</el-button>
                    </router-link>
                </el-form-item>
            </el-form>
        </div>

        <el-dialog class="logo-dialog" :visible.sync="dialogLogoVisible">
            <img class="logo-img" :src="form.channelLogo" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import {getLangsBySite, getPlatforms} from '@/common/baseApi'

    export default {
        computed: {
            isCreditCard(){
                return this.$route.query.isCreditCard
            },
            channelName() {
                return this.$route.query.channelName
            },
            channelCode() {
                return this.$route.query.channelCode
            }
        },
        data() {
            return {
                dialogLogoVisible: false,
                dataLoading: false,
                platforms: {},
                langs: [],
                form: {
                    lang: 'en',
                    platform: 1,
                    creditcard: false,
                    channelLogo: '',
                    paymentName: '',
                    channelSubject: '',
                    channelDescribe: ''
                },
                rules: {
                    channelLogo: [
                        { required: true, message: '请输入logo的URL', trigger: 'blur' },
                        { type: 'url', message: '请输入合法的url地址', trigger: 'blur' }
                    ],
                    paymentName: [
                        { required: true, message: '请输入支付方式名称', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.initData()
        },
        methods: {
            async initData() {
                this.dataLoading = true
                const [langs, platforms] = await Promise.all([getLangsBySite(), getPlatforms()])
                this.langs = langs
                this.platforms = platforms
                this.dataLoading = false

                this.getInfo()
            },
            // 获取编辑信息
            getInfo() {
                let {channelCode} = this
                let {platform, lang} = this.form

                if(channelCode === '') return

                this.dataLoading = true
                let params = {
                    channelCode, platform, lang
                }

                this.$http.get('pay/channel-letters/info', {
                    params
                }).then(({body: {code, message, data}}) => {
                    this.dataLoading = false
                    if (code !== 0) {
                        this.$message.error(message)
                        return
                    }

                    this.form = {
                        ...this.form,
                        creditcard: data.creditcard,
                        channelLogo: data.channelLogo,
                        paymentName: data.paymentName,
                        channelSubject: data.channelSubject,
                        channelDescribe: data.channelDescribe
                    }
                },err => {
                    this.$notify.error(err.body.message || '发生错误')
                })
            },

            onShowLogo() {
                this.$refs.form.validateField('channelLogo', valid => {
                    !valid && (this.dialogLogoVisible = true)
                })
            },
            onSave() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        await this.$confirm('是否确认保存？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                        this.dataLoading = true

                        if (this.form.creditcard) {
                            this.form.channelLogo = 'https://www.baidu.com/';
                        }

                        let  params = {
                            channelCode: this.channelCode,
                            ...this.form
                        }

                        this.$http.post('pay/channel-letters/update', params).then(res => {
                            this.dataLoading = false
                            if (res.body.code == 0) {
                                this.$message.success(res.body.message || '执行成功')
                            } else {
                                this.$message.error(res.body.message || '发生错误')
                            }
                        }, err => {
                            this.$notify.error(err.body.message || '发生错误')
                            this.getInfo()
                        })
                    }
                })
            },

            // 改变Platform
            changePlatform() {
                this.getInfo()
            },
            // 改变语言
            changeLang() {
                this.getInfo()
            }
        }
    }
</script>
<style lang="less">
    .manage-title{
        margin: 20px 0;
    }
    .logo-dialog{
        .logo-img{
            display: block;
            max-width: 500px;
            max-height: 500px;
            margin: 0 auto;
        }
    }
    .manage-form{
        margin: 40px 0;
        textarea {
            height: 150px;
        }
        .manage-input{
            width: 400px;
        }
        .manage-form-title{
            margin: 20px 0;
        }
        hr{
            color: #bfcbd9;
        }
    }
</style>
