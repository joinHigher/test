<!-- google模板编辑 -->
<template>
	<div>
        <div class="el-container topic-edit" v-loading="isDataLoading">
            <p class="cat-title"><strong>基础信息</strong></p>
            <el-row class="el-sub-container">
                <el-col :span="15">
                    <el-form label-width="150px" :model="dataForm" :rules="formRule" ref="form">
                        <el-form-item label="专题名称" prop="name">
                            <el-input v-model.trim="dataForm.name" :disabled="editInfo" class="w-400"></el-input>
                        </el-form-item>
                        <el-form-item label="活动截止时间" prop="end_time">
                            <el-date-picker v-model="dataForm.end_time" type="datetime" placeholder="选择日期" :disabled="editInfo" class="w-400"></el-date-picker> &nbsp;
                            <el-checkbox v-model="dataForm.is_end" :true-label="1" :false-label="0" :disabled="editInfo">关闭活动</el-checkbox>
                        </el-form-item>
                        <el-form-item label="跳转链接" prop="jump_link">
                            <el-input v-model.trim="dataForm.jump_link" :disabled="editInfo" class="w-400"></el-input> &nbsp;
                            <span>关闭活动后，指定跳转链接</span>
                        </el-form-item>
                        <el-form-item label="选择平台" prop="temp_platforms">
                            <!-- <div>{{dataForm.temp_platforms}}</div>
                            <div>{{platformsIndex}}</div> -->
                            <el-checkbox-group v-model="dataForm.temp_platforms">
                                <!-- <el-checkbox v-for="(item, index) in platforms" :label="String(index + 1)" :value="index + 1" :key="index" :disabled="editInfo">{{platformsIndex[index + 1]}}</el-checkbox> -->
                                <el-checkbox v-for="(key, val) in platforms" :label="key" :value="key" :key="key" :disabled="editInfo">{{val}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="专题模板" required>
                            <div class="inline-block w-200">
                                <el-form-item prop="type">
                                    <el-select v-model="dataForm.type" :disabled="editInfo">
                                        <el-option v-for="(item, index) in templateList" :label="item" :key="index" :value="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div v-if="dataForm.type == 'custom'" class="inline-block">
                                <span class="inline-block"> &nbsp; 模板ID &nbsp;</span>
                                <el-form-item prop="template_id" class="inline-block">
                                    <el-input v-model.trim="dataForm.template_id" class="w-200" :disabled="editInfo"></el-input>
                                </el-form-item>
                                <span class="inline-block"> &nbsp; 活动ID &nbsp;</span>
                                <el-form-item prop="activity_id" class="inline-block">
                                    <el-input v-model.trim="dataForm.activity_id" class="w-200" :disabled="editInfo"></el-input>
                                </el-form-item>
                            </div>
                        </el-form-item>
                        <el-form-item label="URL组件" prop="url_component">
                            <el-input v-model.trim="dataForm.url_component" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="专题备注">
                            <el-input v-model.trim="dataForm.memo" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="头部图片" prop="header_image_url">
                            <el-input placeholder="请输入专题头部图片地址" v-model.trim="dataForm.header_image_url" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item v-if="dataForm.template_id != 'custom'" label="移动端头部图片" prop="m_header_image_url">
                            <el-input placeholder="请输入M版专题头部图片地址" v-model.trim="dataForm.m_header_image_url" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="SEO标题">
                            <el-input v-model.trim="dataForm.seo_title" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="SEO内容">
                            <el-input v-model.trim="dataForm.seo_description" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="SEO关键字">
                            <el-input v-model.trim="dataForm.seo_keywords" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <div v-if="dataForm.type != 'custom'">
                            <el-form-item label="专题样式" prop="css_url">
                                <el-input placeholder="请输入专题CSS样式地址" v-model.trim="dataForm.css_url" :disabled="editInfo"></el-input>
                            </el-form-item>
                            <el-form-item label="页面头部代码">
                                <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="dataForm.header_code" :disabled="editInfo"></el-input>
                            </el-form-item>
                            <el-form-item label="页面底部代码">
                                <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="dataForm.footer_code" :disabled="editInfo"></el-input>
                            </el-form-item>
                        </div>
                        <div v-else>
                            <el-form-item label="分享文案">
                                <el-input v-model.trim="dataForm.share_doc" :disabled="editInfo"></el-input>
                            </el-form-item>
                            <el-form-item label="分享图片">
                                <el-input v-model.trim="dataForm.share_image" :disabled="editInfo"></el-input>
                            </el-form-item>
                            <el-form-item label="活动规则">
                                <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="dataForm.activity" :disabled="editInfo" placeholder="请输入活动规则，用于活动页面展示"></el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                    <div class="el-sub-container text-center">
                        <el-button v-show="editInfo && !dataForm.id" type="primary" @click="addSpecial">新增</el-button>
                        <el-button v-show="editInfo && dataForm.id" type="primary" @click="editSpecial">编辑</el-button>
                        <el-button v-show="!editInfo" type="primary" @click="saveSpecial">保存</el-button>
                        <el-button v-show="!editInfo" type="danger" @click="onCancelEdit">取消</el-button>
                    </div>
                </el-col>
            </el-row>
            <p class="cat-title"><strong>专题版块</strong></p>
            <el-row v-for="(item, index) in dataForm.positions" class="el-sub-container" v-if="dataForm.id" :key="index" v-loading="item.isLoading">
                <el-col class="box" :span="18">
                    <el-form label-width="120px" :model="item" :rules="positionRule" :ref="'position_' + index">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="版块名称" prop="name">
                                    <el-input v-model.trim="item.name" :disabled="item.editPosition" :maxlength="100"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="版块排序" prop="order">
                                    <el-input v-model.number="item.order" :disabled="item.editPosition" :maxlength="10"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="M版版块名称">
                            <el-input v-model.trim="item.m_name" :disabled="item.editPosition" :maxlength="100"></el-input>
                        </el-form-item>
                        <el-form-item label="版块类型" prop="type">
                            <el-select v-model="item.type" :disabled="item.editPosition" @change="handlePositionTypeChange($event, index)">
                                <el-option v-for="(item, index) in positionTypes" :label="item" :key="index" :value="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="显示设置">
                            <el-checkbox-group v-model="item.shows">
                                <el-checkbox v-for="(label, index) in item.goodsListShow" :key="index" :label="index" :disabled="item.editPosition">{{label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="板块头部代码">
                            <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="item.header_code" :disabled="item.editPosition"></el-input>
                        </el-form-item>
                        <el-form-item label="板块定位标签名">
                            <el-input v-model.trim="item.nav_name" :disabled="item.editPosition"></el-input>
                        </el-form-item>
                        <el-form-item label="板块底部代码">
                            <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="item.footer_code" :disabled="item.editPosition"></el-input>
                        </el-form-item>
                        <el-form-item v-if="item.type != 'match_sell' && item.type != 'multiple_time_rush_to_purchase'" label="版块商品" prop="goods">
                            <el-input placeholder="多个SKU用英文&quot;,&quot;隔开，" v-model="item.goods" type="textarea" :autosize="{ maxRows: 4}" :disabled="item.editPosition"></el-input>
                            <div v-if="item.type === 'rush_to_purchase'" class="color-silver">（请留意商品是否设置抢购数量）</div>
                            <div>
                                <el-checkbox :disabled="item.editPosition" v-model="item.is_same_type" true-label="1" false-lable="0">同款生效</el-checkbox>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="item.type == 'match_sell'" label="版块商品" required>
                            <el-row v-for="(itemGoods, i) in item.goods" :key="i" class="el-sub-container" style="padding-top: 0">
                                <el-col :span="9">
                                    <el-input v-model.trim="itemGoods.sku" :disabled="item.editPosition" placeholder="主商品SKU"></el-input>
                                    <div>
                                        <el-checkbox :disabled="item.editPosition" v-model="itemGoods.is_same_type" true-label="1" false-lable="0">同款生效</el-checkbox>
                                    </div>
                                </el-col>
                                <el-col :span="1" class="text-center">+</el-col>
                                <el-col :span="9">
                                    <el-input v-model.trim="itemGoods.accessories_sku" :disabled="item.editPosition" placeholder="配对商品SKU"></el-input>
                                    <div>
                                        <el-checkbox :disabled="item.editPosition" v-model="itemGoods.is_same_type_for_accessories" true-label="1" false-lable="0">同款生效</el-checkbox>
                                    </div>
                                </el-col>
                                <el-col :span="5" class="text-center">
                                    <el-button type="primary" icon="plus" :disabled="item.editPosition" @click="addMatchGoods(item.goods)"></el-button>
                                    <el-button type="danger" icon="minus" :disabled="item.editPosition" @click="removeMatchGoods(item.goods, itemGoods)"></el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="取该标签下价格" :required="item.type === 'rush_to_purchase' || item.type == 'multiple_time_rush_to_purchase'">
                            <el-select v-model="item.price_label_id" :disabled="item.editPosition" clearable class="w-400">
                                <el-option v-for="(el, index) in priceLabels" :label="el.name" :key="index" :value="el.labelId"></el-option>
                            </el-select>
                        </el-form-item>
                        <div v-if="item.type === 'rush_to_purchase' || item.type == 'multiple_time_rush_to_purchase'">
                            <el-form-item label="如何显示价格" prop="expired_price_is_show">
                                <el-radio v-model="item.expired_price_is_show" label="1">一直显示价格</el-radio>
                                <el-radio v-model="item.expired_price_is_show" label="0">抢购时间内显示价格，其他时间以问号形式显示</el-radio>
                            </el-form-item>
                        </div>
                        <div v-else-if="item.type === 'promotion_code'">
                            <el-form-item label="Coupon码" prop="coupon">
                                <el-input v-model.trim="item.coupon" type="textarea" :maxlength="100" class="w-400" :disabled="item.editPosition"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="item.type === 'multiple_time_rush_to_purchase'">
                            <div v-for="(item2, index2) in item.goods" :key="index2">
                                <el-form-item label="抢购分组组别" required>
                                    <el-col :span="7">
                                        <el-form-item :prop="'goods.' + index2 + '.group'" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
                                            <el-input v-model.trim="item2.group" :maxlength="100" :disabled="item.editPosition"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="时间段" :prop="'goods.' + index2 + '.start_time'" :rules="[{ required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }]">
                                            <!-- <el-date-picker v-model="item2.date" type="datetimerange" placeholder="选择时间段" :disabled="item.editPosition" @change="handlePositionDateChange($event, item, index2)"></el-date-picker> -->
                                            <el-date-picker v-model="item2.start_time" type="datetime" placeholder="选择开始时间" :disabled="item.editPosition || index2 > 0" @change="handlePositionDateChange($event, item, index2, 'start')"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="item-end-time">
                                        <el-form-item label="-" :prop="'goods.' + index2 + '.end_time'" :rules="[{ required: true, type: 'date', message: '请选择结束时间', trigger: 'change' }]" label-width="20px">
                                            <el-date-picker v-model="item2.end_time" type="datetime" placeholder="选择结束时间" :disabled="item.editPosition" @change="handlePositionDateChange($event, item, index2, 'end')"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="3" class="text-right">
                                        <el-button v-if="index2 === 1" type="primary" @click="handlePositionAddTimeClick(item)">新增</el-button>
                                        <el-button v-if="index2 > 1" type="danger" @click="handlePositionDelTimeClick(item, index2)">删除</el-button>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="版块商品" :prop="'goods.' + index2 + '.goods'" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
                                    <el-input placeholder="多个SKU用英文&quot;,&quot;隔开，" v-model="item2.goods" type="textarea" :autosize="{ maxRows: 4}" :disabled="item.editPosition"></el-input>
                                    <div class="color-silver">（请留意商品是否设置抢购数量）</div>
                                    <div>
                                        <el-checkbox :disabled="item.editPosition" v-model="item2.is_same_type" true-label="1" false-lable="0">同款生效</el-checkbox>
                                    </div>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="text-right">
                            <el-button type="primary" @click="show(item)" v-show="item.editPosition">编辑</el-button>
                            <el-button type="primary" @click="editItem(item, index)" v-show="!item.editPosition">保存</el-button>
                            <el-button type="danger" @click="cancelEditItem(item, index)" v-show="!item.editPosition">取消</el-button>
                            <el-button type="danger"  @click="removeItem(item.id, index)">删除版块</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
            <div class="text-center el-sub-container">
                <el-button type="primary" @click="addItem">新增版块</el-button>
            </div>
        </div>
	</div>
</template>

<script>

export default {
  	data () {
		return {
            self: this,
            isDataLoading: false,
            dataForm: {
                id: '',
                name: '',
                end_time: '',
                is_end: 0,
                jump_link: '',
                memo: '',
                type: '',
                template_id: '',
                activity_id: '',
                temp_platforms: [],
                url_component: '',
                header_image_url: '',
                m_header_image_url: '',
                header_code: '',
                footer_code: '',
                css_url: '',
                seo_title: '',
                seo_description: '',
                seo_keywords: '',
                positions: [{
                    id: '',
                    name: '',
                    nav_name: '',
                    order: '',
                    shows: [],
                    type: '',
                    is_same_type: '',
                    editPosition: false,
                    isLoading: false,
                    goodsListShow: [],
                    goods: '',
                    coupon: '',
                    price_label_id: '',
                    price_label_name: '',
                    expired_price_is_show: '',
                }],
                share_doc: '',
                share_image: '',
                activity: '',
            },
            tempDataForm: {},
            positionEmpty: {},
            editInfo: true,
            editPosition: true,
            option: {},
            platforms: {},
            goodsList: [],
            templateList: [],
            position_option: {},
            formRule: {
                name: [{required: true, message: '该项不能为空', trigger: 'blur' }],
                end_time: [{required: true, type: 'date', message: '该项不能为空', trigger: 'change' }],
                temp_platforms: [{required: true, type: 'array', message: '请选择平台', trigger: 'change' }],
                url_component: [{required: true, message: '该项不能为空', trigger: 'blur' }],
                type: [{required: true, message: '请选择专题模板', trigger: 'change' }],
                template_id: [{required: true, message: '该项不能为空', trigger: 'blur' }],
                header_image_url: [{type: 'url', message: '请输入正确的URL链接', trigger: 'blur' }],
                m_header_image_url: [{type: 'url', message: '请输入正确的URL链接', trigger: 'blur' }],
                css_url: [{type: 'url', message: '请输入正确的URL链接', trigger: 'blur' }],
            },
            positionRule: {
                name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                order: [{ required: true, type: 'integer', min: 0, message: '该项不能为空，且只能为不小于0的数字', trigger: 'blur' }],
                goods: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                type: [{ required: true, message: '请选择版块类型', trigger: 'change' }],
                expired_price_is_show: [{ required: true, message: '请选择如何显示价格', trigger: 'change' }],
                coupon: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
            },
            positionTypes: {},
            priceLables: [
                {
                    siteCode: '',
                    labelId: '',
                    name: '',
                    id: 0,
                    type: 0,
                    status: 0
                }
            ],
        };
    },
    created () {
        this.positionEmpty = Object.assign({}, this.dataForm.positions[0]);
        this.initData();
	},
	methods: {
        show (item) {
            item.editPosition = false;
        },
        initData () {
            this.getplat();
            this.getgoodsList();
            this.gettemplate();
            // this.getData();
            this.getSpecialPositionTypes();
            this.getPriceLabels();
        },
        getData () {
            if (typeof this.$route.query.id == 'undefined') {
                this.isDataLoading = false;
                return;
            }
            this.isDataLoading = true;
            this.$http.get('admin/special/info', {params: {id: this.$route.query.id}}).then(res => {
                let resData = res.body.data;
                this.isDataLoading = false;
                resData.temp_platforms = resData.platforms ? resData.platforms.split(',') : [];
                resData.positions.forEach(e => {
                    e.shows = (e.shows == '') ? [] : e.shows.split(',');
                    e.editPosition = true;
                    e.isLoading = false;
                    e.goodsListShow = {};
                    for (let key in this.goodsList) {
                        // 如果是抢购和多时段
                        if (e.type !== 'rush_to_purchase' && e.type !== 'multiple_time_rush_to_purchase'
                            && (key === 'show-time-down' || key === 'show-progress')) {
                            continue;
                        }
                        e.goodsListShow[key] = this.goodsList[key];
                    }
                    // 多时段
                    if (e.type === 'multiple_time_rush_to_purchase' && Array.isArray(e.goods)) {
                        e.goods.forEach(item => {
                            if (item.start_time && item.end_time) {
                                item.start_time = new Date(item.start_time * 1000);
                                item.end_time = new Date(item.end_time * 1000);
                            }

                            item.is_same_type = item.is_same_type || '';
                        })
                        // console.log(e.start_time)
                    } else if (e.type === 'match_sell' && Array.isArray(e.goods)) {
                        e.goods.forEach(item => {
                            item.is_same_type = item.is_same_type || '';
                            item.is_same_type_for_accessories = item.is_same_type_for_accessories || '';
                        });
                    } else {
                        e.is_same_type = e.is_same_type || '';
                    }
                });
                resData.platforms = '';

                if (!resData.type) {
                    resData.type = 'google';
                }
                if (!resData.end_time) {
                    resData.end_time = '';
                } else {
                    resData.end_time = new Date(this.timeZone_(resData.end_time, this.$store.getters.getTimeZone));
                }

                this.dataForm = resData;
                this.tempDataForm = JSON.parse(JSON.stringify(this.dataForm));
            });
        },
        getplat () {
            this.$http.get('admin/public/platforms').then(res => {
                // this.platforms = res.body.data;
                if (res.body.code != 0) {
                    return;
                }
                for (let key in res.body.data) {
                    // this.platforms.push(res.body.data[key]);
                    this.platforms[res.body.data[key]] = key;
                }
            });
        },
        getgoodsList (callback) {
            this.isDataLoading = true;
            this.$http.get('admin/special-position/public-get-shows').then(res => {
                this.goodsList = res.body.data;
                this.getData();
            });
        },
        gettemplate () {
            this.$http.get('admin/special/public-get-templates').then(res => {
                this.templateList = res.body.data;
            });
        },
        // 获取板块类型
        getSpecialPositionTypes () {
            this.$http.get('admin/public/special-position-options').then(res => {
                this.positionTypes = res.body.data;
            });
        },
        // 专题板块价格标签列表
        getPriceLabels () {
            this.priceLabels = [];
            this.$http.get('admin/special-position/public-price-labels').then(res => {
                if (res.body.code === 0) {
                    this.priceLabels = res.body.data;
                }
            });
        },
        addSpecial () {
            this.editInfo = false;
            if (this.dataForm.temp_platforms.length) {
                this.dataForm.temp_platforms = [];
            }
        },
        editSpecial () {
            this.editInfo = false;
            this.tempDataForm = JSON.parse(JSON.stringify(this.dataForm));
        },
        onCancelEdit () {
            this.editInfo = true
            if (JSON.stringify(this.dataForm) != JSON.stringify(this.tempDataForm)) {
                // this.getData();
                this.dataForm = JSON.parse(JSON.stringify(this.tempDataForm));
                this.$refs.form.$children.forEach(item => {
                    item.validateState = true;
                })
            }
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

            if (params.id) {
                src = 'admin/special/edit';
            } else {
                src = 'admin/special/add';
                params.id = 0;
            }

            if (params.type === 'google') {
                delete params.share_doc;
                delete params.share_image;
                delete params.activity;
            } else if (params.type === 'custom') {
                delete params.m_header_image_url;
                delete params.header_code;
                delete params.footer_code;
                delete params.css_url;
            }

            params.end_time = this.timestamp(params.end_time);

            // console.log(params)
            // return;

            this.isDataLoading = true;
            this.$http.post(src, params).then(res => {
                this.isDataLoading = false;
                if (res.body.code == 0) {
                    this.$route.query.id = res.body.data.id
                    this.getData();

                    this.editInfo = true;
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    });
                    this.tempDataForm = JSON.parse(JSON.stringify(this.dataForm));
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
		removeItem (id, index) {
            this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                if (id == '') {
                    this.dataForm.positions.splice(index, 1);
                    this.$message({
                      message: '删除未保存记录',
                      type: 'warning'
                    });
                    return false;
                }

                this.$http.post('admin/special-position/delete', {id: id}).then(res => {
                    if (res.body.code == 0) {
                        this.dataForm.positions.splice(index, 1);
                        this.$message({
                          message: res.body.message,
                          type: 'success'
                        });
                        this.tempDataForm = JSON.parse(JSON.stringify(this.dataForm));
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
        addItem () {
            let row = Object.assign({}, this.positionEmpty);
            let goodsListShow = {};
            for (let key in this.goodsList) {
                goodsListShow[key] = this.goodsList[key];
            }
            row.goodsListShow = goodsListShow;
            this.dataForm.positions.push(row);
        },
        editItem (item, index) {
            let src = '';
            let params = null;
            let hasError = false;
            this.$refs['position_' + index][0].validate(valid => {
                if (!valid) {
                    hasError = true;
                    return false;
                }
            });
            if (hasError) {
                return;
            }
            if ((item.type === 'rush_to_purchase' || item.type === 'multiple_time_rush_to_purchase') && !item.price_label_id) {
                this.$message.error('请选择取该标签下价格选项');
                return;
            }
            // 搭售商品SKU校验
            if (item.type === 'match_sell') {
                if (item.goods.some((el, i) => {
                    if (!el.sku || !el.accessories_sku) {
                        this.$message.error('请输入SKU');
                        hasError = true;
                        return true;
                    }
                }));
            }
            // 多时段板块
            else if (item.type === 'multiple_time_rush_to_purchase') {
                Array.isArray(item.goods) && item.goods.forEach(item2 => {
                    item2.start_timestamp = this.timestamp(item2.start_time);
                    item2.end_timestamp = this.timestamp(item2.end_time);
                });
            }
            // console.log(item);
            // return;
            if (hasError) {
                return;
            }
            params = JSON.parse(JSON.stringify(item)); // Object.assign({}, this.position_option);
            params.special_id = this.$route.query.id;
            params.shows = (params.shows == []) ? '' : params.shows.join(',');
            src = 'admin/special-position/add';
            if (params.id && params.id !== '0') {
                src = 'admin/special-position/edit';
            }
            params.price_label_id && this.priceLabels.some(item2 => {
                // console.log(item2.id, params.price_label_id, item2.id === params.price_label_id)
                if (item2.labelId == params.price_label_id) {
                    params.price_label_name = item2.name;
                    params.price_label_type = item2.type;
                    return true;
                }
            });
            delete params.goodsListShow;
            delete params.editPosition;
            delete params.isLoading;
            // 多时段板块
            if (item.type === 'multiple_time_rush_to_purchase') {
                Array.isArray(params.goods) && params.goods.forEach(item2 => {
                    item2.sku = item2.goods || '';
                    item2.start_time = item2.start_timestamp;
                    item2.end_time = item2.end_timestamp;
                    delete item2.start_timestamp;
                    delete item2.end_timestamp;
                    delete item2.goods;
                });
            }
            // console.log(this.dataForm.positions)
            // console.log(params);
            // return;
            item.isLoading = true;
            this.$http.post(src, params).then(res => {
                item.isLoading = false;
                if (res.body.code == 0) {
                    item.editPosition = true;
                    item.id = res.body.data.id || '';
                    this.$message({
                      message: res.body.message,
                      type: 'success'
                    });
                    this.tempDataForm = JSON.parse(JSON.stringify(this.dataForm));
                } else {
                    this.$message.error(res.body.message);
                }
            },
            (err) => {
                item.isLoading = false;
                this.$message.error(err.body.message);
            });
        },
        cancelEditItem(item, index) {
            item.editPosition = true
            if (JSON.stringify(this.dataForm.positions[index]) != JSON.stringify(this.tempDataForm.positions[index])) {
                this.dataForm.positions.splice(index, 1, JSON.parse(JSON.stringify(this.tempDataForm.positions[index])));
                let ref = this.$refs['position_' + index][0]
                this.$nextTick(() => {
                    ref.validate();
                })
            }
        },
        handlePositionTypeChange (val, index) {
            let item = this.dataForm.positions[index];
            item.shows = [];
            item.goodsListShow = {};
            for (let key in this.goodsList) {
                // 如果是抢购和多时段
                if (val !== 'rush_to_purchase' && val !== 'multiple_time_rush_to_purchase'
                    && (key === 'show-time-down' || key === 'show-progress')) {
                    continue;
                }
                item.goodsListShow[key] = this.goodsList[key];
            }
            // 搭售
            if (val === 'match_sell') {
                this.$delete(item, 'is_same_type');
                item.goods = [{
                    sku: '',
                    accessories_sku: '',
                    is_same_type: '',
                    is_same_type_for_accessories: ''
                }];
            } else if (val === 'multiple_time_rush_to_purchase') {
                this.$delete(item, 'is_same_type');
                item.goods = [
                    { group: '', start_time: '', end_time: '', goods: '', is_same_type: '' },
                    { group: '', start_time: '', end_time: '', goods: '', is_same_type: '' },
                ];
            } else {
                item.goods = '';
                this.$set(item, 'is_same_type', '');
            }
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
        // 多时段板块选择时间事件
        handlePositionDateChange (val, item, index, type) {
            let isStart = type === 'start';
            let goods = item.goods;
            if (!goods[index]) {
                return;
            }
            if (typeof goods[index].start_time.getTime === 'undefined' || typeof goods[index].end_time.getTime === 'undefined') {
                return;
            }
            if (goods[index].end_time.getTime() <= goods[index].start_time.getTime()) {
                this.$message.error('开始时间不能小于等于结束时间');
                goods[index].end_time = '';
                return;
            }
            // 选择结束时间时同时设置为下一个时间段的开始时间
            if (!isStart && index < goods.length - 1) {
                goods[index + 1].start_time = goods[index].end_time;
            }
        },
        // 多时段板块新增时间段
        handlePositionAddTimeClick (item, index) {
            let startTime = item.goods[item.goods.length - 1].end_time || '';
            item.goods.push({ group: '', start_time: startTime, end_time: '', goods: '' });
        },
        // 多时段板块删除时间段
        handlePositionDelTimeClick (item, index) {
            this.$confirm('确定删除吗?', '提示', { type: 'warning' }).then(() => {
                item.goods.splice(index, 1);
            }).catch(() => {

            });
        },

        // 增减搭售商品数
        addMatchGoods (arr) {
            arr.push({
                sku: '',
                accessories_sku: '',
                is_same_type: '',
                is_same_type_for_accessories: ''
            });
        },
        removeMatchGoods (arr, item) {
            let index = arr.indexOf(item);
            let length = arr.length;
            if (length > 1) {
                arr.splice(index, 1);
            } else {
                this.$message.warning('最后一项不能删除');
                return false;
            }
        },
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
    .w-100p { width: 100% !important; }

    .inline-block { display: inline-block; }

    .box {border: 1px solid #e0e6ed;padding: 15px;}
    .tips-limit {height: auto;overflow: auto;}
    .tips-limit .el-message__group {height: auto;}
    .tips-limit p {word-break: break-all; max-width: 600px; white-space: normal;}

    .item-end-time .el-form-item.is-required .el-form-item__label:before { visibility: hidden; }
}
</style>
