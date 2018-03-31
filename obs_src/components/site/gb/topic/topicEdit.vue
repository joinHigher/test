<!-- google模板编辑 -->
<template>
    <div>
        <div class="el-container topic-edit" v-loading="isDataLoading">
            <p class="cat-title"><strong>专题信息</strong></p>
            <el-row class="el-sub-container">
                <el-col :span="18">
                    <el-form label-width="150px" :model="dataForm" :rules="formRule" ref="form">
                        <el-form-item label="渠道" prop="pipeline_code">
                            <el-select v-model="dataForm.pipeline_code" filterable class="w-400" :disabled="isDisabled">
                                <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="语言">
                            <el-tabs v-model="dataForm.lang" @tab-click="toggleLang">
                                <el-tab-pane v-for="(item, index) in langOpt" :label="item.language_ch" :name="item.language_en" :key="index"></el-tab-pane>
                            </el-tabs>
                        </el-form-item>

                        <el-form-item label="是否默认语言" prop="default_lang">
                            <el-radio-group v-model="dataForm.isDefaultLang" :disabled="self.$route.query['type'] === 'add' || isDisabled">
                                <el-radio :label="0">是</el-radio>
                                <el-radio :label="1">否</el-radio>
                            </el-radio-group>
                            <span class="ml10 color-silver">（该语言下数据作为默认数据分发）</span>
                        </el-form-item>
                        <el-form-item label="专题名称" prop="name">
                            <el-input v-model.trim="dataForm.name" class="w-400"></el-input>
                        </el-form-item>
                        <el-form-item label="关闭活动">
                            <el-tooltip :content="dataForm.is_end == '0' ? '活动开启' : '活动关闭'" placement="right">
                                <el-switch v-model="dataForm.is_end" on-color="#13ce66" off-color="#ff4949" on-value="0" off-value="1">
                                </el-switch>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="跳转链接" prop="jump_link">
                            <el-input v-model.trim="dataForm.jump_link" class="w-400"></el-input> &nbsp;
                            <span class="ml10 color-silver">（关闭活动后，指定跳转链接）</span>
                        </el-form-item>
                        <el-form-item label="选择平台" prop="temp_platforms">
                            <el-checkbox-group v-model="dataForm.temp_platforms">
                                <el-checkbox :disabled="isDisabled" v-for="(key, val) in platforms" :label="val" :value="val" :key="val">{{key}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <!--专题模板-->
                        <el-form-item label="专题模板" required>
                            <div class="inline-block w-400">
                                <el-form-item prop="type">
                                    <el-select v-model="dataForm.type">
                                        <el-option v-for="(item, index) in templateList" :label="item" :key="index" :value="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div v-if="dataForm.type == 'custom'" class="inline-block">
                                <span class="inline-block"> &nbsp; 模板ID &nbsp;</span>
                                <el-form-item prop="template_id" class="inline-block">
                                    <el-input v-model.trim="dataForm.template_id" class="w-200" :disabled="isDisabled"></el-input>
                                </el-form-item>
                                <span class="inline-block"> &nbsp; 活动ID &nbsp;</span>
                                <el-form-item prop="activity_id" class="inline-block">
                                    <el-input v-model.trim="dataForm.activity_id" class="w-200"></el-input>
                                </el-form-item>
                            </div>
                        </el-form-item>

                        <el-form-item label="URL组件" prop="url_component">
                            <el-input v-model.trim="dataForm.url_component" class="w-600" :disabled="isDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="专题备注">
                            <el-input v-model.trim="dataForm.memo" class="w-600"></el-input>
                        </el-form-item>

                        <el-form-item label="头部图片" prop="header_image_url">
                            <el-input placeholder="请输入专题头部图片地址" v-model.trim="dataForm.header_image_url" class="w-600"></el-input>
                            <span class="ml10 color-silver">（PC的顶部大banner）</span>
                        </el-form-item>
                        <el-form-item v-if="dataForm.template_id != 'custom'" label="移动端头部图片" prop="m_header_image_url">
                            <el-input placeholder="请输入M版专题头部图片地址" v-model.trim="dataForm.m_header_image_url" class="w-600"></el-input>
                            <span class="ml10 color-silver">（M和APP的顶部大banner）</span>
                        </el-form-item>

                        <el-form-item label="banner下面描述" prop="banner_desc">
                            <el-input v-model.trim="dataForm.banner_desc" class="w-600"></el-input>
                            <span class="ml10 color-silver">（大banner下方样式，头部coupon之上）</span>
                        </el-form-item>
                        <el-form-item label="专题样式" prop="css_url">
                            <el-input placeholder="请输入专题CSS样式地址" v-model.trim="dataForm.css_url" class="w-600"></el-input>
                            <span class="ml10 color-silver">（针对整个专题生效的样式，优先级低于背景图/背景色）</span>
                        </el-form-item>

                        <el-form-item label="背景图" prop="background">
                            <el-input v-model.trim="dataForm.background" class="w-600"></el-input>
                            <span class="ml10 color-silver">（整个专题的背景图片，和背景色二选一使用，优先级高于专题样式）</span>
                        </el-form-item>
                        <el-form-item label="背景色" prop="background_color">
                            <el-input v-model.trim="dataForm.background_color" class="w-600">
                                <template slot="prepend">
                                    <span class="bg-pre" :style="{background: dataForm.background_color}"></span>
                                </template>
                            </el-input>
                            <span class="ml10 color-silver">（整个专题的背景颜色，和背景图二选一使用，优先级高于专题样式）</span>
                        </el-form-item>

                        <!--coupon模板-->
                        <el-form-item label="coupon模板ID">
                            <el-input v-model.trim="dataForm.coupon" placeholder="多个以英文逗号隔开" class="w-600" :disabled="isDisabled"></el-input>
                            <el-row v-for="(item, index) in dataForm.coupon_images" :key="index" class="mt15">
                                <el-col :span="18">
                                    <el-form-item label="coupon图片" label-width="100px">
                                        <el-select v-model="item.type" class="w-200 mr20" :disabled="isDisabled">
                                            <el-option label="品牌名称" value="1"></el-option>
                                            <el-option label="图片地址" value="2"></el-option>
                                        </el-select>
                                        <el-button size="small" type="primary" icon="plus" @click="addCoupon" :disabled="isDisabled"></el-button>
                                        <el-button size="small" type="danger" icon="minus" @click="removeCoupon(index)" v-if="dataForm.coupon_images.length > 1" :disabled="isDisabled"></el-button>
                                    </el-form-item>
                                    <el-form-item label-width="100px" class="mt15">
                                        <template v-if="item.type === '1'">
                                            <el-select v-model="item.brand_code" clearable filterable @change="brandCodeChange(index, $event)" class="w-500" :disabled="isDisabled">
                                                <el-option v-for="(item, index) in brandOpt" :label="item.brandDesc" :value="item.brandCode" :key="index"></el-option>
                                            </el-select>
                                        </template>
                                        <el-input v-else v-model="item.image" placeholder="请输入图片地址" class="w-500" :disabled="isDisabled"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>

                        <el-form-item label="页面底部代码">
                            <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="dataForm.footer_code" class="w-600"></el-input>
                            <span class="ml10 color-silver">（页面最底部样式）</span>
                        </el-form-item>

                        <!--SEO-->
                        <hr class="separation-line"/>
                        <el-form-item label="SEO标题">
                            <el-input v-model.trim="dataForm.seo_title" class="w-600"></el-input>
                        </el-form-item>
                        <el-form-item label="SEO内容">
                            <el-input v-model.trim="dataForm.seo_description" class="w-600"></el-input>
                        </el-form-item>
                        <el-form-item label="SEO关键字">
                            <el-input v-model.trim="dataForm.seo_keywords" class="w-600"></el-input>
                        </el-form-item>

                        <!--导航分享-->
                        <hr class="separation-line"/>
                        <el-form-item label="导航分享入口" prop="nav_share_entrance">
                            <el-radio-group v-model="dataForm.nav_share_entrance" :disabled="isDisabled">
                                <el-radio :label="1">开启</el-radio>
                                <el-radio :label="2">关闭</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="分享内容" prop="share_doc">
                            <el-input type="textarea" :autosize="{ maxRows: 4}" v-model="dataForm.share_doc" class="w-600"></el-input>
                        </el-form-item>
                        <el-form-item label="分享图片" prop="share_image">
                            <el-input v-model.trim="dataForm.share_image" class="w-600"></el-input>
                        </el-form-item>

                        <!--专题分享送积分 目前功能不完善 存在刷积分的风险 暂时屏蔽该功能-->
                        <!--<el-form-item label="分享送积分" prop="share_integral">
                            <el-input v-model.trim="dataForm.share_integral" class="w-600" :disabled="isDisabled"></el-input>
                            <span class="ml10 color-silver">（默认不赠送）</span>
                        </el-form-item>
                        <el-form-item label="单用户送积分次数" prop="user_integral_num">
                            <el-input v-model.trim="dataForm.user_integral_num" class="w-600" :disabled="isDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="积分生效时间">
                            <el-date-picker v-model="integral_effective" type="datetimerange" :editable="false" class="w-600" :disabled="isDisabled"></el-date-picker>
                        </el-form-item>-->


                        <template v-if="dataForm.type == 'custom'">
                            <el-form-item label="活动规则">
                                <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="dataForm.activity" placeholder="请输入活动规则，用于活动页面展示" class="w-600"></el-input>
                            </el-form-item>
                        </template>

                        <el-form-item label="二维码图片" prop="qrcode_image">
                            <el-input v-model.trim="dataForm.qrcode_image" class="w-600"></el-input>
                        </el-form-item>
                        <el-form-item label="二维码是否显示" prop="qrcode_image_show">
                            <el-radio-group v-model="dataForm.qrcode_image_show" :disabled="isDisabled">
                                <el-radio :label="1">开启</el-radio>
                                <el-radio :label="2">关闭</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <!--底部banner begin-->
                        <el-form-item label="底部banner" prop="bottomBanner">
                            <el-tabs v-model="bottomBanner" type="card" @tab-click="handleClick">
                                <!--pc-->
                                <el-tab-pane label="PC" name="pc" v-if="dataForm.activity_banner['pc']">
                                    <el-row class="p10">
                                        <el-col :span="18">
                                            <el-form-item label="底部banner介绍">
                                                <el-input v-model="dataForm.activity_banner['pc'].banner_desc" :disabled="isDisabled"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row v-for="(item, index) in dataForm.activity_banner['pc'].item" :key="index" class="cycle">
                                        <el-col :span="18">
                                            <el-form-item label="banner图片">
                                                <el-input v-model="item.banner_image" :disabled="isDisabled"></el-input>
                                            </el-form-item>
                                            <el-form-item label="banner链接">
                                                <el-input v-model="item.banner_link" :disabled="isDisabled"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5" :offset="1">
                                            <el-button size="small" type="primary" icon="plus" @click="addActivityBanner('pc')" :disabled="isDisabled"></el-button>
                                            <el-button size="small" type="danger" icon="minus" @click="removeActivityBanner('pc',index)" v-if="dataForm.activity_banner['pc'].item.length > 1" :disabled="isDisabled"></el-button>
                                        </el-col>
                                    </el-row>
                                </el-tab-pane>
                                <!--m-->
                                <el-tab-pane label="M" name="m" v-if="dataForm.activity_banner['m']">
                                    <el-row class="p10">
                                        <el-col :span="18">
                                            <el-form-item label="底部banner介绍">
                                                <el-input v-model="dataForm.activity_banner['m'].banner_desc" :disabled="isDisabled"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row v-for="(item, index) in dataForm.activity_banner['m'].item" :key="index" class="cycle">
                                        <el-col :span="18">
                                            <el-form-item label="banner尺寸">
                                                <el-select v-model="item.banner_type" class="w-100 mr20" @change="changeActivityBanner($event,index)" :disabled="isDisabled">
                                                    <el-option label="大banner" value="1"></el-option>
                                                    <el-option label="小banner" value="2"></el-option>
                                                </el-select>
                                                <el-button size="small" type="primary" icon="plus" :disabled="isDisabled" @click="addActivityBanner('m')"></el-button>
                                                <el-button size="small" type="danger" icon="minus" :disabled="isDisabled" @click="removeActivityBanner('m',index)" v-if="dataForm.activity_banner['m'].item.length > 1"></el-button>
                                            </el-form-item>
                                            <div v-for="(item2,index2) in item.group" :key="index2">
                                                <el-form-item label="banner图片">
                                                    <el-input v-model="item2.banner_image" :disabled="isDisabled"></el-input>
                                                </el-form-item>
                                                <el-form-item label="banner链接">
                                                    <el-input v-model="item2.banner_link" :disabled="isDisabled"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form-item><!--底部banner end-->

                    </el-form>
                    <div class="el-sub-container text-center">
                        <el-button type="primary" @click="saveSpecial" v-if="ctrl">保存</el-button>
                        <el-button  @click="goBack">返回专题列表</el-button>
                        <router-link class="el-button el-button--info" :to="{path: '/admin/special-position/lists?special_id=' + special_id +'&lang='+ lang }" :disabled="typeof special_id === 'undefined' || typeof lang === 'undefined'">进入版块列表</router-link>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            let required  = [{
                required: true,
                message: '该项不能为空'
            }];

            return {
                langOpt: {},
                required: required,
                self: this,
                isDataLoading: false,
                isEdit: false,
                special_id: this.$route.query['special_id'],
                lang: this.$route.query['lang'],
                integral_effective: [],
                platforms: {
                    '1': 'PC',
                    '2': 'WAP'
                },
                templateList: [],
                bottomBanner: 'pc',
                brandOpt: [],
                dataForm: {
                    id: '',
                    name: '',
                    is_end: '1',
                    jump_link: '',
                    memo: '',
                    type: '',
                    template_id: '',
                    activity_id: '',
                    temp_platforms: [],
                    url_component: '',
                    header_image_url: '',
                    m_header_image_url: '',
                    footer_code: '',
                    css_url: '',
                    seo_title: '',
                    seo_description: '',
                    seo_keywords: '',
                    share_doc: '',
                    share_image: '',
                    activity: '',
                    lang: 'en',
                    banner_desc: '',
                    background: '',
                    background_color: '',
                    coupon: '',
                    nav_share_entrance: 2,
                    share_integral: 0,
                    integral_effective_start: '',
                    integral_effective_end: '',
                    user_integral_num: '',
                    pipeline_code: '',
                    qrcode_image: '',
                    qrcode_image_show: 2,
                    activity_banner: {},
                    coupon_images: [{
                        type: '1',
                        brand_code: '',
                        image: '',
                    }],
                    default_lang: '',
                    isDefaultLang: 0,
                    special_id: ''
                },
                formRule: {
                    lang: [{required: true, message: '该项不能为空'}],
                    pipeline_code: [{required: true, message: '该项不能为空'}],
                    name: [{required: true, message: '该项不能为空', trigger: 'blur' }],
                    temp_platforms: [{required: true, type: 'array', message: '请选择平台', trigger: 'change' }],
                    url_component: [{required: true, message: '该项不能为空', trigger: 'blur' }],
                    type: [{required: true, message: '请选择专题模板', trigger: 'change' }],
                    template_id: [{required: true, message: '该项不能为空', trigger: 'blur' }],
                    header_image_url: [{type: 'url', message: '请输入正确的URL链接', trigger: 'blur' }],
                    m_header_image_url: [{type: 'url', message: '请输入正确的URL链接', trigger: 'blur' }],
                    css_url: [{type: 'url', message: '请输入正确的URL链接', trigger: 'blur' }],
                },
                firstStatus: true,
                dataFormEmpty: {},
                dataFormDefault: {},
                isDisabled: false,
            };
        },
        computed: {
            ctrl() {
                if (this.$route.query['special_id']) {
                    return this.showAction_('admin/special/edit');
                } else {
                    return this.showAction_('admin/special/add');
                }
            },
            pipeOpt () {
                return this.$store.getters.getPipe.obj;
            }
        },
        created () {
            this.initData();
            this.dataFormEmpty = Object.assign({}, this.dataForm);
        },
        methods: {

            initData () {
                this.init_activity_banner(this.dataForm);
                //this.getPlat();
                this.getLang();
                this.getTemplate();
                this.getBrandOpt();

                if (typeof this.special_id !== 'undefined' || typeof this.lang !== 'undefined') {
                    this.getData(1, this.special_id, this.lang);
                    this.isEdit = true;
                } else {
                    this.isEdit = false;
                }
            },

            /**
             * 获取数据
             * @param type 调用类型：1->默认查询调用；2->切换语言时调用
             * @param special_id
             * @param lang
             */
            getData (type, special_id, lang) {
                let params = {
                    special_id: special_id,
                    lang: lang
                };

                this.isDataLoading = true;

                this.$http.get('admin/special/detail', {params: params}).then(res => {
                    this.isDataLoading = false;

                    if (res.body.code === 0) {
                        let resData = res.body.data;

                        this.transformData(resData.detail);
                        this.dataForm = resData.detail;

                        this.dataFormDefault = JSON.parse(JSON.stringify(resData.default));

                        this.isEdit = true;

                        if (this.dataForm.isDefaultLang == '0') {
                            this.isDisabled = false;
                        } else {
                            this.isDisabled = true;
                        }

                    }

                    // 添加或编辑时 如果没有返回数据 表示要新增，否则就是编辑接口
                    if (res.body.code === 1) {
                        if (type === 1) {
                            //console.log('专题不存在！');
                        }

                        // 当type=2时，表示查询该专题该语言的数据，没有数据就需要拷贝默认语言作为基础数据
                        if (type === 2) {
                            let tempData = JSON.parse(JSON.stringify(this.dataFormDefault));

                            delete tempData.lang;
                            tempData.lang = this.dataForm.lang;

                            this.$nextTick(() => {
                                this.$refs['form'].resetFields();
                                this.dataForm = tempData;
                                this.transformData(this.dataForm);
                                this.dataForm.isDefaultLang = 1;
                                this.dataForm.default_lang = '';
                                this.dataForm.special_id = this.$route.query['special_id'];
                            });

                            this.firstStatus = true;
                            this.isEdit = false;
                            this.isDisabled = true;

                            /*this.$message({
                                type: 'success',
                                message: '该语言下无专题信息，已将默认语言数据拷贝作为基础数据！'
                            });*/

                            this.$alert('该语言下无专题信息，已将默认语言数据拷贝作为基础数据！', '提示信息', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    //console.log(action);
                                }
                            });
                        }
                    }
                });
            },

            // 转换数据格式
            transformData (data) {
                data.temp_platforms = data.platforms ? data.platforms.split(',') : [];

                if (!data.type) {
                    data.type = 'google';
                }

                let timeStar = this.timeZone_(data.integral_effective_start, this.$store.getters.getTimeZone);
                let timeEnd = this.timeZone_(data.integral_effective_end, this.$store.getters.getTimeZone);

                // 积分生效时间
                if(timeStar === '' || timeEnd === ''){
                    this.integral_effective = [];
                }else{
                    this.integral_effective = [new Date(timeStar), new Date(timeEnd)];
                }

                // 底部banner
                if (typeof data.activity_banner === 'string') {
                    data.activity_banner = JSON.parse(data.activity_banner);
                }
                if(data.activity_banner.length === 0){
                    this.init_activity_banner(data);
                }

                // coupon图片
                if(data.coupon_images.length === 0){
                    data.coupon_images.push({
                        type: '1',
                        brand_code: '',
                        image: '',
                    });
                }

                data.is_end = data.is_end.toString();

                // 是否默认语言
                data.lang === data.default_lang ? data.isDefaultLang = 0 : data.isDefaultLang = 1;
            },

            init_activity_banner(data) {
                data.activity_banner = {
                    pc: {
                        banner_desc: '',
                        item: [{
                            banner_image: '',
                            banner_link: ''
                        }]
                    },
                    m: {
                        banner_desc: '',
                        item: [{
                            group: [{
                                banner_image: '',
                                banner_link: ''
                            }],
                            banner_type: '1'
                        }]
                    },
                }
            },

            //
            getLang () {
                // 语言下拉
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code === 0) {
                        this.langOpt = res.body.data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            //
            getPlat () {
                this.$http.get('admin/public/platforms').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    for (let key in res.body.data) {
                        //0.9需求，只保留PC和Wap
                        if(key == 3 || key == 4 || key == 5){
                            break;
                        }
                        this.platforms[res.body.data[key]] = key;
                    }
                });
            },

            getTemplate () {
                this.$http.get('admin/special/public-get-templates').then(res => {
                    this.templateList = res.body.data;
                });
            },

            // 获取品牌列表
            async getBrandOpt() {
                const data = await this.httpGet_('promotion/index/public-brand-lists');
                this.brandOpt = data;
            },

            saveSpecial () {
                let params = {};
                let src = '';
                let hasError = false;
                this.$refs.form.validate(valid => {
                    if (!valid) {
                        hasError = true;
                        return false;
                    }
                });
                if (hasError) {
                    return;
                }

                for (let i in this.dataForm) {
                    if (i !== 'temp_platforms' && i !== 'positions' && i !== 'platforms') {
                        params[i] = this.dataForm[i];
                    }
                }
                this.dataForm.temp_platforms.sort((a, b) => {
                    return a - b;
                });
                params.platforms = this.dataForm.temp_platforms.join(',');

                // 默认语言
                if (this.dataForm.isDefaultLang === 0) {
                    params.default_lang = this.dataForm.lang;
                    delete params.isDefaultLang;
                }

                if (this.isEdit) {
                    src = 'admin/special/edit';
                } else {
                    src = 'admin/special/add';
                }

                if (params.type === 'google') {
                    // delete params.share_doc;
                    // delete params.share_image;
                    delete params.activity;
                } else if (params.type === 'custom') {
                    delete params.m_header_image_url;
                    delete params.footer_code;
                    delete params.css_url;
                }


                let timeArr = this.timeZone_(this.integral_effective, this.$store.getters.getTimeZone);

                params.integral_effective_start  = timeArr[0];
                params.integral_effective_end = timeArr[1];

                this.isDataLoading = true;

                this.$http.post(src, params).then(res => {
                    this.isDataLoading = false;
                    if (res.body.code === 0) {
                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                        let data = res.body.data;
                        this.$route.query['special_id'] = data.special_id;
                        this.$route.query['lang'] = data.lang;
                        this.getData(1, data.special_id, data.lang);
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            removeItem (id, index) {
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    if (id === '') {
                        this.dataForm.positions.splice(index, 1);
                        this.$message({
                            message: '删除未保存记录',
                            type: 'warning'
                        });
                        return false;
                    }

                    this.$http.post('admin/special-position/delete', {id: id}).then(res => {
                        if (res.body.code === 0) {
                            this.dataForm.positions.splice(index, 1);
                            this.$message({
                                message: res.body.message,
                                type: 'success'
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            timestamp(time) {
                let stamp = null;
                if (!time) {
                    return '';
                }
                stamp = parseInt(time.getTime() / 1000);
                if (isNaN(stamp)) {
                    return '';
                }
                stamp = parseInt(new Date(this.timeZone_(stamp, this.$store.getters.getTimeZone)).getTime() / 1000);
                if (isNaN(stamp)) {
                    return '';
                }
                return stamp;
            },

            //切换底部banner选项卡
            handleClick(tab, event) {

            },

            //
            changeActivityBanner(val,index) {
                let item = this.dataForm.activity_banner['m'];
                //大banner
                if(val === '1'){
                    item.item[index].group.splice(1);
                }
                //小banner
                if(val === '2'){
                    item.item[index].group.push({
                        banner_image: '',
                        banner_link: '',
                    });
                }
            },

            //添加banner项
            addActivityBanner(type) {
                if(type === 'pc'){
                    this.dataForm.activity_banner['pc'].item.push({
                        banner_image: '',
                        banner_link: ''
                    });
                }

                if(type === 'm'){
                    this.dataForm.activity_banner['m'].item.push({
                        group: [{
                            banner_image: '',
                            banner_link: ''
                        }],
                        banner_type: '1'
                    });
                }
            },

            //删除banner项
            removeActivityBanner(type,index){
                if(type === 'pc'){
                    this.dataForm.activity_banner['pc'].item.splice(index, 1);
                }
                if(type === 'm'){
                    this.dataForm.activity_banner['m'].item.splice(index, 1);
                }
            },

            //添加coupon图片
            addCoupon() {
                this.dataForm.coupon_images.push({
                    type: '1',
                    brand_code: '',
                    image: '',
                });
            },

            //删除coupon图片
            removeCoupon(index) {
                this.dataForm.coupon_images.splice(index, 1);
            },

            brandCodeChange(index, event) {
                // 第一次加载的时候不调用
                if(this.firstStatus === true){
                    this.firstStatus = false;
                    return;
                }

                let tempObj = null;
                this.brandOpt.forEach(item => {
                    if(item.brandCode === event) {
                        tempObj = item;
                    }
                });

                this.dataForm.coupon_images[index].image = tempObj.brandLogo;
            },

            goBack() {
                this.$router.push({
                    name: 'topic_topicList'
                })
            },

            // 切换语言
            toggleLang (val) {

                // 如果是新增
                if (typeof this.$route.query['special_id'] === 'undefined' || typeof this.$route.query['lang'] === 'undefined') {
                    return false;
                }

                this.getData(2, this.$route.query['special_id'], val.name);
            }
        }
    }
</script>

<style lang="less">
    .topic-edit {
        .el-date-editor.el-input,
        .el-input, .el-select, .el-autocomplete { width: 100%; }
        .w-100 { width: 100px !important; }
        .w-200 { width: 200px !important; }
        .w-300 { width: 300px !important; }
        .w-400 { width: 400px !important; }
        .w-500 { width: 500px !important; }
        .w-600 { width: 600px !important; }
        .w-800 { width: 800px !important; }
        .w-230 { width: 230px !important; }
        .w-100p { width: 100% !important; }
        .p10{ padding: 10px; }
        .mr20{margin-right: 20px;}
        .mt15{margin-top: 15px;}
        .mt20{margin-top: 20px;}
        .ml10{margin-left: 10px;}

        .inline-block { display: inline-block; }
        .dis-inline { display: inline!important; }

        .box {border: 1px solid #e0e6ed;padding: 15px;}
        .tips-limit {height: auto;overflow: auto;}
        .tips-limit .el-message__group {height: auto;}
        .tips-limit p {word-break: break-all; max-width: 600px; white-space: normal;}

        .item-end-time .el-form-item.is-required .el-form-item__label:before { visibility: hidden; }

        .bg-pre {
            height: 28px;
            width: 28px;
            margin-top: 1px;
            border: 1px solid #ccc;
            display: inline-block;
        }

        .buy-gift {
            margin-top: 10px;
        }

        .separation-line{
            margin: 35px 0;
            border: 1px solid gainsboro;
            color: #b2dba1;
        }
    }
    .cycle {
        border: 1px solid gainsboro;
        border-radius: 15px;
        padding: 10px;
        margin-bottom: 10px;
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .single-product{
        border: 1px solid gainsboro;
        padding: 25px 10px 10px 0;
        margin-bottom: 20px;
        border-radius: 3px;
    }
</style>
