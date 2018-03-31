<!-- 品牌闪购编辑 -->
<template>
    <div class="el-container gb-flash-sale-edit" v-loading="fullLoading">
        <el-form :model="option" label-width="200px" ref="postForm" :rules="postRule">
            <el-form-item label="请选择语言" prop="lang">
                <el-select v-model="option.lang" filterable placeholder="请选择" @change="changeSelect">
                    <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select filterable v-model="option.pipeline_code" placeholder="请选择" @change="changeSelect">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间段" prop="tid" class="date-txt">
                <el-select v-model="option.tid" :disabled="!option.lang || !option.pipeline_code" clearable>
                    <el-option v-for="(label, index) in dateOpt" :value="label.id" :label="self.timeZone_(label.begin_time, timeZone) + ' 至 ' + self.timeZone_(label.end_time, timeZone)" :key="label.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="平台" prop="platform">
                <el-checkbox-group v-model="option.platform">
                    <el-checkbox v-for="(item, index) in platOpt" :key="index" :label="index">{{item}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="版式" prop="layout">
                <el-radio-group v-model="option.layout">
                    <el-radio :label="1">A(一行显示一个品牌)</el-radio>
                    <el-radio :label="2">B(一行显示两个品牌)</el-radio>
                </el-radio-group>
                <span class="tips">*(在PC,A版式显示5个商品, B版式显示3个商品)</span>
            </el-form-item>
            <el-form-item label="闪购banner" prop="banner">
                <el-input v-model="option.banner"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" prop="banner_logo">
                <el-input v-model="option.banner_logo"></el-input>
            </el-form-item>
            <el-form-item label="品牌名" prop="seo_title">
                <el-input v-model="option.seo_title"></el-input>
            </el-form-item>
            <el-form-item label="闪购描述" prop="seo_desc">
                <el-input v-model="option.seo_desc"></el-input>
            </el-form-item>
            <el-form-item label="URL" prop="banner_link">
                <el-input v-model="option.banner_link"></el-input>
            </el-form-item>
            <el-form-item label="闪购SKU" prop="sku">
                <el-input v-model="option.sku"></el-input>
                <span class="tips">SKU以英文逗号分隔，格式为SKU+仓代码,版式为A时最多5个，版式为B时最多3个;</span>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="option.remark"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="option.sort"></el-input>
            </el-form-item>
            <!--<el-form-item label="APP 编辑项：">
            </el-form-item>-->
            <el-form-item label="APP Banner" prop="app_banner">
                <el-input v-model="option.app_banner"></el-input>
            </el-form-item>
            <el-form-item label="App Banner跳转链接" prop="app_banner_link">
                <!--<el-input v-model="option.app_banner_link"></el-input>-->
                <el-autocomplete popper-class="my-autocomplete" v-model="option.app_banner_link" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" icon="circle-close" :on-icon-click="handleIconClick"></el-autocomplete>
            </el-form-item>
            <el-form-item class="text-center">
                <el-button type="primary" @click="post" v-loading="postLoading" :disabled="postLoading" v-if="ctrl">保存</el-button>
                <el-button type="danger" @click="goback">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
</template>

<script>

export default {
    data () {
        return {
            postLoading: false,
            fullLoading: false,
            self: this,
            langOpt: [],
            dateOpt: [],
            option: {
                lang: 'en',
                pipeline_code: 'GB',
                tid: '',
                platform: [],
                layout: 1,
                banner: '',
                banner_logo: '',
                banner_link: '',
                seo_title: '',
                seo_desc: '',
                sku: '',
                remark: '',
                sort: '',
                app_banner: '',
                app_banner_link: '',
            },
            platOpt:{
                '1': 'PC',
                '2': 'M',
                '3': 'IOS',
                '4': 'ANDROID',
                '5': 'PAD'
            },
            id: this.$route.query.id,
            postRule: {
                lang: [{
                    required: true,
                    message: '该项不能为空',
                }],
                pipeline_code: [{
                    required: true,
                    message: '该项不能为空',
                }],
                banner: [{
                    required: true,
                    message: '该项不能为空',
                }],
                banner_logo: [{
                    required: true,
                    message: '该项不能为空',
                }],
                banner_link: [{
                    required: true,
                    message: '该项不能为空',
                }],
                seo_title: [{
                    required: true,
                    message: '该项不能为空',
                }],
                seo_desc: [{
                    required: true,
                    message: '该项不能为空',
                }],
                sku: [{
                    required: true,
                    message: '该项不能为空',
                }],
                app_banner: [{
                    required: true,
                    message: '该项不能为空',
                }],
                app_banner_link: [{
                    required: true,
                    message: '该项不能为空',
                }],
                layout: [{
                    required: true,
                    message: '该项不能为空',
                }],
            },
            deeplinks: [],
        };
    },
    computed: {
        ctrl() {
            if (this.id) {
                return this.showAction_('promotion/brand-flashsale/edit');
            } else {
                return this.showAction_('promotion/brand-flashsale/add');
            }
        },
        timeZone() {
            return this.$store.getters.getTimeZone;
        },
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.deeplinks = this.$store.getters.getDeeplink;
        this.getOpt();
        this.getDateArea();
        this.getData();
    },
    methods: {
        getOpt() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData() {
            this.fullLoading = true;
            this.$http.get('promotion/brand-flashsale/info', {params: {id: this.id}}).then(res => {
                this.fullLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    //  类型转换
                    data.platform = data.platform.split(',');

                    for (let i in this.option) {
                        if (data[i]) {
                            this.option[i] = data[i];
                        }
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.fullLoading = false;
            })
        },
        changeSelect () {
            this.getDateArea();
        },
        getDateArea() {
            if (this.option.lang === '' || this.option.pipeline_code === '') {
                return;
            }
            let params = {
                lang: this.option.lang,
                pipeline_code: this.option.pipeline_code,
            };
            this.option.tid = null;
            this.$http.get('promotion/brand-flashsale/get-time-select', {params: params}).then(res => {
                if (res.body.code === 0) {
                    this.dateOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        post () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let params = {};
                    for (let i in this.option) {
                        let item = this.option[i];
                         if (i == 'platform'){
                            if (item.length > 0) {
                                params[i] = item.join(',');
                            }  else {
                                params[i] = '';
                            }
                        } else {
                            params[i] = item;
                        }
                    }

                    let src = 'promotion/brand-flashsale/add';
                    if (this.id) {
                        src = 'promotion/brand-flashsale/edit';
                        params.id = this.id;
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
                    });
                }
            });

        },
        goback() {
            this.$router.push({
                name: 'site_flashSaleList'
            })
        },
        querySearch(queryString, cb) {
            let items = this.deeplinks;
            let results = null;
            results = queryString ? items.filter(this.createFilter(queryString)) : items;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        handleSelect(item) {
            this.option.app_banner_link = item.url;
        },
        handleIconClick() {
            this.option.app_banner_link = '';
        }
    }

}
</script>

<style lang="less">
    .gb-flash-sale-edit {
        .el-form-item__content {
            width: 50%;
        }

        .tips {
            margin-left: 10px;
            color: red;
        }
    }
</style>


