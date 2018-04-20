<!-- gb品牌编辑 -->
<template>
    <div class="el-container gb-brand-edit" v-loading="isDataLoading">
        <el-tabs class="full" type="card" @tab-click="langClick" v-model="option.lang">
            <el-tab-pane v-for="item in langOpt" :label="item.language_ch" :name="item.language_en" :key="item.language_en"></el-tab-pane>
        </el-tabs>
        <el-form label-width="140px" :model="option" ref="postForm" :rules="postRule">
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select v-model="option.pipeline_code" filterable @change="changePipeline">
                    <el-option v-for="(item, index) in pipeList" :label="item.pipeline_name" :value="item.pipeline_code" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌标题" prop="brand_name">
                <el-input v-model="option.brand_name"></el-input>
            </el-form-item>
            <el-form-item label="品牌代码" prop="brand_code">
                <!--<el-input :disabled="siDisabled" v-model="option.brand_code"></el-input>-->
                <!--品牌代码可更改-->
                <el-input v-model="option.brand_code"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="option.remark" type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="顶部Banner">
                <el-row v-for="(item, index) in option.top_banner" :key="index" class="item">
                    <el-col :span="3">
                        <el-select v-model="item.platform" placeholder="请选择平台">
                            <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-input v-model="item.imageUrl"></el-input>
                    </el-col>
                    <el-col :span="2"><span class="color-silver">（图片URL）</span></el-col>
                    <el-col :span="6">
                        <el-input v-model="item.linkUrl"></el-input>
                    </el-col>
                    <el-col :span="2"><span class="color-silver">（导航链接）</span></el-col>
                    <el-col :span="4">
                        <el-button type="primary" icon="plus" @click="add('top')"></el-button>
                        <el-button type="danger" icon="minus" @click="remove('top', index)" v-if="option.top_banner.length > 1"></el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="置顶SKU(抢购版块)" prop="">
                <el-input v-model="option.top_sku" type="textarea" :rows="4"></el-input>
                <span class="color-silver">多个sku用"英文“,”分开</span>
            </el-form-item>
            <el-form-item label="专题banner">
                <el-tabs v-model="topicPlatform" type="card">
                    <el-tab-pane label="PC" name="PC">
                        <el-form-item label="导航名" label-width="80px" class="item" prop="topic_banner_nav_name">
                            <el-input v-model="option.topic_banner_pc.nav_name"></el-input>
                        </el-form-item>
                        <el-form-item v-for="(item, index) in option.topic_banner_pc.banner" :key="index" :label="'板式'+(index+1)" label-width="80px" class="item" prop="">
                            <el-row>
                                <el-col :span="9">
                                    <el-input v-model="item[0]"></el-input>
                                </el-col>
                                <el-col :span="2"><span class="color-silver">（图片URL）</span></el-col>
                                <el-col :span="9" :offset="2">
                                    <el-input v-model="item[1]"></el-input>
                                </el-col>
                                <el-col :span="2"><span class="color-silver">（导航链接）</span></el-col>
                            </el-row>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="M" name="M">
                        <el-form-item label="导航名" label-width="80px" class="item" prop="topic_banner_nav_name">
                            <el-input v-model="option.topic_banner_wap.nav_name"></el-input>
                        </el-form-item>
                        <el-form-item label=" " label-width="80px">
                            <el-row v-for="(item, index) in option.topic_banner_wap.banner" :key="index" class="item">
                                <el-col :span="8">
                                    <el-input v-model="item[0]"></el-input>
                                </el-col>
                                <el-col :span="2"><span class="color-silver">（图片URL）</span></el-col>
                                <el-col :span="8" :offset="1">
                                    <el-input v-model="item[1]"></el-input>
                                </el-col>
                                <el-col :span="2"><span class="color-silver">（导航链接）</span></el-col>
                                <el-col :span="3" class="text-center">
                                    <el-button type="primary" icon="plus" @click="add('topic')"></el-button>
                                    <el-button type="danger" icon="minus" @click="remove('topic', index)" v-if="option.topic_banner_wap.banner.length > 1"></el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form-item>
            <el-form-item label="自定义背景色" prop="background_color">
                <el-input v-model.trim="option.background_color">
                    <template slot="prepend">
                        <span class="bg-pre" :style="{background: option.background_color}"></span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="text-center">
                <el-button type="primary" @click="post" v-loading="postLoading" :disabled="postLoading" v-if="self.showAction_('promotion/brand-active/update')">保存</el-button>
                <el-button type="danger" @click="goBack">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- 弹窗S -->

    <!-- 弹窗E -->
</template>

<script>

export default {
    data () {
        let required = [{required: true, message: "该项不能为空"}];
        return {
            self: this,
            id: this.$route.query.id,
            siDisabled: false,
            isDataLoading: false,
            postLoading: false,
            required: required,
            langOpt: null,
            platforms: null,
            topicPlatform: 'PC',
            brand_code_const: '',
            option: {
                lang: 'en',
                pipeline_code: '',
                brand_code: '',
                brand_name: '',
                remark: '',
                top_banner: [{
                    platform: '',
                    imageUrl: '',
                    linkUrl: ''
                }],
                top_sku: '',
                topic_banner_pc: {
                    nav_name: '',
                    banner: [['',''], ['',''], ['',''], ['',''], ['',''], ['',''] ]
                },
                topic_banner_wap: {
                    nav_name: '',
                    banner: [['','']]
                },
                background_color: '',
            },
            postRule: {
                pipeline_code: required,
                brand_name: required,
                brand_code: required,
            },
        };
    },
    computed: {
        pipeList() {
            return this.$store.getters.getPipe.list;
        }
    },
    created () {
        this.getLangOpt();
        this.getPlatforms();

        if (this.id) {
            this.siDisabled = true;
            this.getData();
        }
    },
    methods: {
        // 获取语言列表
        getLangOpt() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code !== 0) {
                    return;
                }
                this.langOpt = res.body.data;
            },(err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        // 平台下拉
        async getPlatforms() {
            const data = await this.httpGet_('admin/public/platforms');
            this.platforms = data;
        },
        getData () {
            this.isDataLoading = true;
            this.$http.get('promotion/brand-active/info', {params: {id: this.id}}).then(res => {
                if (res.body.code === 0) {
                    this.isDataLoading = false;
                    this.option = res.body.data;
                    this.brand_code_const = this.option.brand_code;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            })
        },
        add (type) {
            if (type === 'top') {
                this.option.top_banner.push({
                    platform: '',
                    imageUrl: '',
                    linkUrl: ''
                });
            } else if (type === 'topic') {
                this.option.topic_banner_wap.banner.push(['','']);
            }
        },
        remove (type, index) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (type === 'top') {
                    this.option.top_banner.splice(index, 1);
                } else if (type === 'topic') {
                    this.option.topic_banner_wap.banner.splice(index, 1);
                }
            });
        },
        post () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let src = 'promotion/brand-active/update';
                    let params = JSON.parse(JSON.stringify(this.option));

                    this.postLoading = true;

                    this.$http.post(src, params).then(res => {
                        this.postLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.goBack();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoading = false;
                    });
                }
            })
        },

        /**
         * 品牌专辑活动（通过品牌代码,渠道，语言）查询
         * @param params
         * @param type  0： 切换语言；1：切换渠道
         */
        getDataByParams(params, type) {
            this.isDataLoading = true;
            this.$http.get('promotion/brand-active/get-info', {params: params}).then(res => {
                this.isDataLoading = false;

                if (res.body.code === 0) {
                    this.option = res.body.data;
                    this.siDisabled = true;
                } else if(res.body.code === 1) {
                    let pipeline_code_temp = this.option.pipeline_code;
                    this.$refs.postForm.resetFields();

                    let tempObj = {
                        lang: params.lang,
                        pipeline_code: type === 0 ? '' : pipeline_code_temp,
                        brand_code: '',
                        brand_name: '',
                        remark: '',
                        top_banner: [{
                            platform: '',
                            imageUrl: '',
                            linkUrl: ''
                        }],
                        top_sku: '',
                        topic_banner_pc: {
                            nav_name: '',
                            banner: [['',''], ['',''], ['',''], ['',''], ['',''], ['',''] ]
                        },
                        topic_banner_wap: {
                            nav_name: '',
                            banner: [['','']]
                        },
                        background_color: '',
                    };

                    this.siDisabled = false;
                    this.option = tempObj;
                }
            })
        },
        langClick(val) {
            let params = {
                brand_code: this.brand_code_const,
                pipeline_code: this.pipeList[0].pipeline_code,
                lang: val.name
            };
            this.getDataByParams(params, 0);
        },
        changePipeline() {
            if(this.id) {
                let params = {
                    brand_code: this.brand_code_const,
                    pipeline_code: this.option.pipeline_code,
                    lang: this.option.lang
                };
                this.getDataByParams(params, 1);
            }
        },
        goBack () {
            this.$router.push({
                name: 'site_brandList'
            })
        }
    }
}
</script>

<style lang="less">
    .gb-brand-edit {

        form {
            width: 80%;
        }

        .item {
            margin-bottom: 20px;
        }

        .bg-pre {
            height: 28px;
            width: 28px;
            margin-top: 1px;
            border: 1px solid #ccc;
            display: inline-block;
        }
    }
</style>


