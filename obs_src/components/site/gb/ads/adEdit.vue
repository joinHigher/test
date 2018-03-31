<!-- 广告位编辑 -->
<template>
    <div class="el-container gb-ad-edit">
        <el-form label-width="160px" :model="option" ref="postForm" :rules="postRule">
            <p class="cat-title"><strong>定位项</strong></p>
            <el-form-item label="平台" prop="platform">
                <el-select v-model="option.platform" clearable filterable>
                    <el-option v-for="(item, index) in platformOpt" :label="item" :value="index" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请选择语言" prop="lang">
                <el-select v-model="option.lang" clearable filterable>
                    <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属上级" prop="position">
                <el-cascader :disabled="catOpt.length === 0" v-model="option.position" class="tree" :options="catOpt" change-on-select :props="prop"></el-cascader>
            </el-form-item>
            <el-form-item label="位置ID">
                <span>{{option.position.join('-')}}</span>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="option.name"></el-input>
            </el-form-item>
            <p class="cat-title"><strong>常规配置项</strong></p>
            <el-form-item label="图片地址/字体logo" prop="banner_url">
                <el-row>
                    <el-col :span="20">
                        <!--<el-input v-model="option.banner_url"></el-input>-->
                        <el-autocomplete popper-class="autocomplete-banner-url" v-model="option.banner_url" :fetch-suggestions="querySearchBannerUrl" custom-item="my-item-zh" placeholder="请输入内容" @select="handleSelectBannerUrl" icon="circle-close" :on-icon-click="handleIconClickBannerUrl"></el-autocomplete>
                    </el-col>
                    <el-col :span="4" class="text-center">
                        <a :href="option.banner_url" target="_blank">查看图片</a>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="跳转URL" prop="banner_link">
                <el-row>
                    <el-col :span="20">
                        <!--<el-input v-model="option.banner_link"></el-input>-->
                        <el-autocomplete v-model="option.banner_link" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" icon="circle-close" :on-icon-click="handleIconClick"></el-autocomplete>
                    </el-col>
                    <el-col :span="4" class="text-center">
                        <a :href="option.banner_link" target="_blank">打开</a>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="是否显示" prop="is_show">
                <el-radio-group v-model="option.is_show">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="0">不显示</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="时间" prop="date">
                <el-date-picker v-model="option.date" type="datetimerange" :editable="false"></el-date-picker>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input v-model="option.order"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="option.remark"></el-input>
            </el-form-item>
<!--             <el-form-item label="人群" prop="user_type">
                <el-select v-model="option.user_type" clearable filterable>
                    <el-option v-for="(item, index) in userTypeListOpt" :label="item" :value="index" :key="index"></el-option>
                </el-select>
            </el-form-item> -->
            <!--  -->
            <el-form-item label="针对人群：" prop="user_type">
                <el-select v-model="option.user_type" placeholder="请选择针对人群">
                    <el-option v-for="item in applyUsers" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" v-show="option.user_type == 2" prop="userType" :rules="option.user_type === 2 ? [{ required: true, message: '请选择新老用户', trigger: 'change'}] : []">
                <el-radio-group v-model="option.userType">
                    <el-radio v-for="(item, index) in newOrOldList" :label="String(index)" :key="index">{{item}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" v-show="option.user_type == 3"  prop="userLevel" :rules="option.user_type === 3 ? [{ type: 'array', required: true, message: '请至少选择一个会员等级', trigger: 'change' }] : []">
                <el-checkbox-group v-model="option.userLevel">
                    <el-checkbox v-for="item in levels" :key="item.value" :label="String(item.value)">{{item.label}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="" v-show="option.user_type == 4" prop="userTags" :rules="option.user_type === 4 ? [{ type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }] : []">
                <el-select v-model="option.userTags" multiple filterable remote :remote-method="remoteSearch" placeholder="请选择">
                    <el-option
                        v-for="item in tags"
                        :key="item.value"
                        :label="item.label"
                        :value="String(item.value)">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--  -->
            <el-form-item label="IP地区" prop="country_code">
                <el-select v-model="option.country_code" clearable multiple placeholder="全部">
                    <el-option v-for="(item, index) in allCountryListOpt" :label="item.countryName" :value="item.countryCode" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <p class="cat-title"><strong>特殊配置项(横向导航广告位)</strong></p>
            <el-row class="content">
                <el-col :span="18">
                    <el-form-item prop="cat_id" label="分类">
                        <el-select v-model="option.cat_id" >
                            <el-option v-for="(cat, _index) in catList" :key="_index" :value="String(cat.id)" :label="cat.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item prop="is_take_effect_goods" label-width="5px">
                        <el-checkbox v-model="option.is_take_effect_goods" :true-label="1" :false-label="0">同时生效于改分类商详页</el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-center">
                <el-button type="primary" @click="post" :disabled="postLoading" v-loading="postLoading" v-if="ctrl">保存</el-button>
                <el-button type="danger" @click="goBack">取消</el-button>
            </div>
        </el-form>
    </div>
    <!-- 弹窗S -->

    <!-- 弹窗E -->
</template>

<script>
import Vue from 'vue';
Vue.component('my-item-zh', {
    /*<i :class="icon" class="iconfont"></i>*/
    functional: true,
    render: function (h, ctx) {
        let item = ctx.props.item;
        return h('li', ctx.data, [
            h('span', { attrs: { class: 'name' } }, [item]),
            h('i', { attrs: { class: 'icon iconfont '+ item +'' } })
        ]);
    }
});

export default {
    data () {
        return {
            postLoading: false,
            id: this.$route.query.id,
            option: {
                date: [],
                start_time: '',
                end_time: '',
                platform: '',
                lang: '',
                pipeline_code: '',
                position: [],
                banner_link: '',
                banner_url: '',
                name: '',
                is_show: '',
                order: '',
                remark: '',
                user_type: '',
                //
                userType: '',
                userLevel: [],
                userTags: [],
                //
                country_code: '',
                cat_id: '',
                is_take_effect_goods: '',
            },
            catList: [],
            catOpt: [],
            langOpt: [],
            platformOpt: [],
            userTypeListOpt: [],
            allCountryListOpt: [],
            prop: {
                value: 'id',
                children: 'children',
                label: 'name'
            },
            postRule: {
                platform: [{
                    required: true,
                    message: '该项不能为空',
                }],
                lang: [{
                    required: true,
                    message: '该项不能为空',
                }],
                pipeline_code: [{
                    required: true,
                    message: '该项不能为空',
                }],
                position: [{
                    required: true,
                    message: '该项不能为空',
                }],
                name: [{
                    required: true,
                    message: '该项不能为空',
                }],
                banner_link: [{
                    required: true,
                    message: '该项不能为空',
                }],
                banner_url: [{
                    required: true,
                    message: '该项不能为空',
                }],
                date: [{
                    required: true,
                    message: '该项不能为空',
                }],
                is_show: [{
                    required: true,
                    message: '该项不能为空',
                }],
                user_type: [{
                    required: true,
                    message: '该项不能为空',
                }],
            },
            icons: ['icon-applicance', 'icon-account', 'icon-airpods', 'icon-add', 'icon-appareal', 'icon-arrow-left', 'icon-baby',
                'icon-beauty', 'icon-bag', 'icon-blog', 'icon-automobile', 'icon-clock', 'icon-cart', 'icon-brand', 'icon-cellphone',
                'icon-computer', 'icon-collection', 'icon-delete', 'icon-edit', 'icon-contact', 'icon-electronics', 'icon-email',
                'icon-email1', 'icon-equal', 'icon-faq', 'icon-fb', 'icon-game', 'icon-information', 'icon-ipad', 'icon-home', 'icon-instagram',
                'icon-gplus', 'icon-like', 'icon-led', 'icon-like1', 'icon-msg', 'icon-msg1', 'icon-office', 'icon-ok', 'icon-phone', 'icon-pinterest',
                'icon-party', 'icon-pwd', 'icon-pwd1', 'icon-price', 'icon-qrcode', 'icon-search', 'icon-reddit', 'icon-star', 'icon-sport', 'icon-tax',
                'icon-star1', 'icon-tool', 'icon-toy', 'icon-video', 'icon-twitter', 'icon-warning', 'icon-vk', 'icon-warehouse', 'icon-watch', 'icon-whatsapp',
                'icon-youtube', 'icon-arrow-up', 'icon-arrows-small-left', 'icon-arrow-right', 'icon-arrows-small-right', 'icon-arrows-small-up',
                'icon-arrows-small-down', 'icon-arrow-down1', 'icon-lever', 'icon-tag', 'icon-shield', 'icon-shake-hands', 'icon-airplane', 'icon-reduce',
                'icon-catelog'
            ],
            deeplinks: [],
            brandOpt: [],
            // 针对人群
            tags: [],
            tagsTemp: [],
            applyUsers: [],
            levels: [],
            newOrOldList: [],
        };
    },
    created () {
        this.initData();
        this.deeplinks = this.$store.getters.getDeeplink;
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        },
        zoneTime() {
            return this.$store.getters.getTimeZone;
        },
        ctrl() {
            if (this.id) {
                return this.showAction_('admin/banner/edit');
            } else {
                return this.showAction_('admin/banner/add');
            }
        },
    },
    methods: {
        initData() {
            this.getApplyUserList();
            this.getplat();
            this.getLang();
            this.getCat();
            this.getPosition();
            this.getUserTypeList();
            this.getAllCountryList();

            if (this.id) {
                this.getData();
            }
        },
        // 获取针对人群信息
        getApplyUserList() {
            this.$http.get('user/index/apply-user').then((res) => {
                if (res.body.code !== 0) {
                    return;
                }
                this.tags = this.tagsTemp = this.getArray(res.body.data.labelMap);
                this.applyUsers = this.getArray(res.body.data.applyUser);
                this.levels = this.getArray(res.body.data.levelMap);
                this.newOrOldList = res.body.data.newOrOldMap;
            });
        },
        getData() {
            let self = this;
            this.$http.get('admin/banner/info', {params: {id: this.id}}).then(res => {
                if (res.body.code === 0) {
                    let data =  res.body.data;
                    data.position = String(data.position).split('-');
                    data.position = data.position.map(item => {
                        return item * 1;
                    });

                    let time1 = this.timeZone_(data.start_time, this.zoneTime);
                    let time2 = this.timeZone_(data.end_time, this.zoneTime);
                    data.date = [new Date(time1), new Date(time2)];

                    // 针对用户
                    data.userType = '';
                    data.userLevel = [];
                    data.userTags = [];
                    //
                    if (data.user_type == '2') {
                        data.userType = data.user_type_values;
                    } else if (data.user_type == '3') {
                        data.userLevel = data.user_type_values ? data.user_type_values.split(',') : [];
                    } else if (data.user_type == '4') {
                        data.userTags = data.user_type_values ? data.user_type_values.split(',') : [];
                    }

                    data.country_code = data.country_code === '' ? [] : data.country_code.split(',');

                    this.option = data;
                    this.option.cat_id = this.option.cat_id.toString();
                }
            })
        },
        getCat() {
            this.$http.get('seo/public/category-all').then(res => {
                if (res.body.code === 0) {
                    this.catList = res.body.data;
                }
            })
        },
        getplat() {
            this.$http.get('admin/public/platforms').then(res => {
                if (res.body.code === 0) {
                    this.platformOpt = res.body.data;
                }
            });
        },
        getPosition() {
            this.$http.get('admin/public/banner-positions').then(res => {
                if (res.body.code === 0) {
                    this.catOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getLang() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                }
            });
        },
        //获取用户类型
        getUserTypeList() {
            this.$http.get('admin/public/user-type-list').then(res => {
                if (res.body.code === 0) {
                    this.userTypeListOpt = res.body.data;
                }
            });
        },
        //获取所有国家列表
        getAllCountryList() {
            this.$http.get('logistics/public/all-list').then(res => {
                if (res.body.code === 0) {
                    this.allCountryListOpt = res.body.data;
                }
            });
        },
        post() {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let self = this;
                    let src = 'admin/banner/add';
                    let params = {};

                    // 转换针对人群格式
                    switch(this.option.user_type) {
                        case 2:
                            params.user_type_values = this.option.userType;
                        break;
                        case 3:
                            params.user_type_values = this.option.userLevel.join(',');
                        break;
                        case 4:
                            params.user_type_values = this.option.userTags.join(',');
                        break;
                    }
                    //

                    for (let i in this.option) {
                        if (i !== 'brands' && i !== 'date' && i !== 'position' && i !== 'user_type_values' && i !== 'userTags' && i !== 'userLevel' && i !== 'userType') {
                             params[i] = this.option[i];
                        }
                    }
                    //

                    if (this.id) {
                        src = 'admin/banner/edit';
                        params.id = this.id;
                    }

                    params.position = this.option.position.join('-');

                    let timeArr = this.timeZone_(this.option.date, self.zoneTime);
                    params.start_time  = timeArr[0];
                    params.end_time = timeArr[1];

                    params.country_code = params.country_code.toString();

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
                    })
                }
            })
        },
        goBack() {
            this.$router.push({
                name: 'site_adList',
            });
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
            this.option.banner_link = item.url;
        },
        handleIconClick() {
            this.option.banner_link = '';
        },

        //图片/字体logo
        querySearchBannerUrl(queryString, cb) {
            let items = this.icons;
            let results = null;
            results = queryString ? items.filter(this.createFilterBannerUrl(queryString)) : items;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilterBannerUrl(queryString) {
            return (item) => {
                return (item.indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        handleSelectBannerUrl(item) {
            this.option.banner_url = item;
        },
        handleIconClickBannerUrl() {
            this.option.banner_url = '';
        },
        // 对象装换成数组
        getArray(obj) {
            let arr = [];
            for(let i in obj){
                arr.push({ label: obj[i], value: Number(i) });
            }
            return arr;
        },
        // 远程搜索
        async remoteSearch(query) {
            if (query !== '') {
                const params = {
                    labelName: query
                };
                try {
                    const data = await httpGet('user/tag/get-by-name-like',  { params, showErr: false });
                    this.tags = data.map((item) => {
                        return {
                            label: item.name,
                            value: item.id
                        };
                    });
                } catch(e) {
                    this.tags = [];
                }
            } else {
                this.tags = this.tagsTemp;
            }
        }
    }
}
</script>

<style lang="less">
    @import "http://at.alicdn.com/t/font_471234_reh6rqt8lbejc3di.css";
    .gb-ad-edit {
        .el-form-item__content {
            width: 60%;
        }

        .tree {
            width: 100%;
        }

        .content {
            margin-bottom: 10px;
            width: 60%;
            .el-form-item__content {
                width: 70%;
            }

            .el-date-editor--datetimerange {
                width: 400px;
            }
        }

        .cat-title {
            margin-bottom: 10px;
        }
    }
    .autocomplete-banner-url{
        li {
            line-height: normal;
            padding: 7px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .icon {
                font-size: 16px;
                float: right;
                margin-right: 10px;
            }

            .highlighted .addr {
                color: #ddd;
            }
        }
    }
</style>


