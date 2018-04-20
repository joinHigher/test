<!-- 新手导购页面编辑 -->
<template>
    <div class="el-container gb-guide-page">
        <el-form label-width="100px" :model="option" class="content" ref="postForm" :rules="postRule">
            <el-form-item label="语言" prop="lang">
                <el-select clearable filterable v-model="option.lang">
                    <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="平台" prop="platform">
                <el-radio-group v-model="option.platform" @change="getData">
                    <el-radio v-for="(item, index) in platOpt" :key="index" :label="index">{{item}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="SEO标题" prop="seo_title">
                <el-input v-model="option.seo_title"></el-input>
            </el-form-item>
            <el-form-item label="SEO描述" prop="seo_description">
                <el-input v-model="option.seo_description"></el-input>
            </el-form-item>
            <el-form-item label="SEO关键字" prop="seo_keywords">
                <el-input v-model="option.seo_keywords"></el-input>
            </el-form-item>
            <el-form-item label="头部banner" prop="top_banner">
                <el-input v-model="option.top_banner"></el-input>
            </el-form-item>
            <el-form-item label="文章内容" prop="coupon_rules">
                <el-input v-model="option.coupon_rules" type="textarea" :rows="8"></el-input>
            </el-form-item>
            <el-form-item class="text-center">
                <el-button type="primary" @click="preDialog = true">预览</el-button>
                <el-button type="primary" @click="post" v-loading="postLoading" :disabled="postLoading" v-if="self.showAction_('promotion/new-shopping-guide/page-edit')">保存</el-button>
                <el-button type="danger" @click="goback">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 弹窗S -->
        <el-dialog title="提示" :visible.sync="preDialog">
            <div v-html="option.coupon_rules"></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="preDialog = false">返回</el-button>
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
            postLoading: false,
            preDialog: false,
            option: {
                platform: '1',
                seo_title: '',
                seo_keywords: '',
                seo_description: '',
                top_banner: '',
                coupon_rules: '',
                id: '',
                lang: '',
                pipeline_code: '',
            },
            platOpt:{
                '1': 'PC',
                '2': 'M',
                '3': 'IOS',
                '4': 'ANDROID',
                '5': 'PAD'
            },
            langOpt: {},
            postRule: {
                seo_title: [{
                    required: true,
                    message: '该项不能为空',
                }],
                seo_description: [{
                    required: true,
                    message: '该项不能为空',
                }],
                seo_keywords: [{
                    required: true,
                    message: '该项不能为空',
                }],
                top_banner: [{
                    required: true,
                    message: '该项不能为空',
                }],
                platform: [{
                    required: true,
                    message: '该项不能为空',
                }],
                coupon_rules: [{
                    required: true,
                    message: '该项不能为空',
                }],
            }
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getLangOpt();
        this.getData();
    },
    methods: {
        getLangOpt() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData() {
            this.$http.get('promotion/new-shopping-guide/page-info', {params: {platform: this.option.platform}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.pageInfo;
                    if (data) {
                        for (let i in this.option) {
                            if (i != 'platform') {
                                this.option[i] = data[i];
                            }
                        }
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            })
        },
        post() {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let src = 'promotion/new-shopping-guide/page-edit';
                    let params = {};
                    for (let i in this.option) {
                        if (i != 'id') {
                            params[i] = this.option[i];
                        }
                    }

                    if (this.option.id) {
                        params.id = this.option.id;
                    }
                    this.postLoading = true;
                    this.$http.post(src, params).then(res => {
                        this.postLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.goback();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoading = false;
                    })
                }
            });
        },
        goback() {
            this.$router.push({
                name: 'site_guideList',
            });
        },
    }

}
</script>

<style lang="less">
    .gb-guide-page {
        .el-form-item__content {
            width: 60%;
        }
    }
</style>


