<!-- 店铺编辑 -->
<template>
    <div class="store-edit el-container">
        <el-form label-width="100px" :model="option" class="form" ref="postForm" :rules="postRule">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="选择卖家" prop="sellerId">
                        <el-select :disabled="Boolean(this.id)" v-model="option.sellerId">
                            <el-option v-for="(item, index) in sellerOpt" :key="index" :value="String(item.id)" :label="item.account"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺名称" prop="shopName">
                        <el-input v-model="option.shopName"></el-input>
                    </el-form-item>
                    <el-form-item label="广告语" prop="slogan">
                        <el-input v-model="option.slogan"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺类型" prop="shopType">
                        <el-select :disabled="Boolean(this.id)" v-model="option.shopType" @change="changeShop">
                            <el-option v-for="(item, index) in shopOpt" :key="index" :value="Number(index)" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="option.shopType == 3" label="绑定供应商" prop="supplier" :rules="required">
                        <el-input :disabled="Boolean(this.id)" v-model="option.supplier"></el-input>
                    </el-form-item>
                    <el-form-item label="运营模式" prop="operationType">
                        <el-select disabled v-model="option.operationType">
                            <el-option v-for="(item, index) in operationOpt" :key="index" :value="Number(index)" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="显示开关" prop="isShow">
                        <el-radio-group v-model="option.isShow">
                            <el-radio :disabled="option.shopType == 1" :label="1">显示</el-radio>
                            <el-radio :disabled="option.shopType == 1" :label="0">不显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="营销配置" prop="promotionConfiguration">
                        <el-button type="primary" @click="set">设置</el-button>
                    </el-form-item>
                    <el-form-item label="banner" prop="account">
                        <el-row v-for="(item, index) in platOpt" :key="index" class="item">
                            <el-col :span="4">{{item}}</el-col>
                            <el-col :span="20">
                                <el-input v-model="option[index]" placeholder="http://"></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所在地">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item class="address">
                                    <el-select filterable placeholder="请选择国家" v-model="option.countryCodeLocation" @change="getProvince">
                                        <el-option v-for="(item, index) in countryOpt" :key="index" :value="item.countryCode" :label="item.countryName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item class="address">
                                    <el-select :disabled="!option.countryCodeLocation" filterable placeholder="请选择省份" v-model="option.provinceCodeLocation" @change="getCity">
                                        <el-option v-for="(item, index) in provinceOpt" :key="index" :value="item.provinceCode" :label="item.provinceName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item class="address" v-if="cityOpt.length === 0">
                                    <el-input :disabled="!option.provinceCodeLocation" v-model="option.cityNameLocation" placeholder="请输入城市"></el-input>
                                </el-form-item>
                                <el-form-item class="address" v-else>
                                    <el-select :disabled="!option.provinceCodeLocation" filterable placeholder="请选择城市" v-model="option.cityNameLocation">
                                        <el-option v-for="(item, index) in cityOpt" :key="index" :value="item.cityName" :label="item.cityName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="退货地址">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item class="address">
                                    <el-select filterable placeholder="请选择国家" v-model="option.counryCodeSalesReturn" @change="getProvince($event, 'return')">
                                        <el-option v-for="(item, index) in countryOpt" :key="index" :value="item.countryCode" :label="item.countryName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item class="address">
                                    <el-select :disabled="!option.counryCodeSalesReturn" filterable placeholder="请选择省份" v-model="option.provinceCodeSalesReturn" @change="getCity($event, 'return')">
                                        <el-option v-for="(item, index) in returnProvinceOpt" :key="index" :value="item.provinceCode" :label="item.provinceName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item class="address" v-if="returnCityOpt.length === 0">
                                    <el-input :disabled="!option.provinceCodeSalesReturn" v-model="option.cityNameSalesReturn" placeholder="请输入城市"></el-input>
                                </el-form-item>
                                <el-form-item class="address" v-else>
                                    <el-select :disabled="!option.provinceCodeSalesReturn" filterable placeholder="请选择城市" v-model="option.cityNameSalesReturn">
                                        <el-option v-for="(item, index) in returnCityOpt" :key="index" :value="item.cityName" :label="item.cityName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item class="address address-text">
                            <el-input v-model="option.addressDetail" placeholder="Address Line 1"></el-input>
                        </el-form-item>
                        <el-row class="address-text">
                            <el-col :span="12">
                                <el-form-item class="address">
                                    <el-input v-model="option.phone" placeholder="Phone number"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="address">
                                    <el-input v-model="option.zipCode" placeholder="ZIP/Postal Code"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="SEO标题" prop="titleSeo">
                        <el-input type="textarea" :autosize="{maxRows: 5}" v-model="option.titleSeo"></el-input>
                    </el-form-item>
                    <el-form-item label="SEO关键词" prop="keywordSeo">
                        <el-input type="textarea" :autosize="{maxRows: 5}" v-model="option.keywordSeo"></el-input>
                    </el-form-item>
                    <el-form-item label="SEO描述" prop="descriptionSeo">
                        <el-input type="textarea" :autosize="{maxRows: 5}" v-model="option.descriptionSeo"></el-input>
                    </el-form-item>
                    <el-form-item label="备注信息" prop="remark">
                        <el-input type="textarea" :autosize="{maxRows: 5}" v-model="option.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item class="text-center">
                <el-button type="primary" @click="post">提交</el-button>
                <el-button type="danger" @click="goback">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 弹窗S -->
        <el-dialog title="选择营销配置" v-model="promotionDialog" size="tiny">
            <el-row class="set">
                <el-col :span="8">
                    <ul class="title-list">
                        <li v-for="(item, index) in promotionOpt" :key="index" @click="getPromotionData(index)" :class="index === currentIndex ? 'active' : ''">
                            <el-checkbox @change="changePromotion"></el-checkbox>
                            {{item}}
                        </li>
                    </ul>
                </el-col>
                <el-col :span="16" v-loading="promotionLoading">
                    <ul class="data-list" v-for="(item, index) in promotionOpt" :key="index" v-if="index === currentIndex">
                        <li v-for="(_item, _index) in data[index]" :key="_index" @click="checkItem(_item)">
                            <span v-if="index === 'sys'">{{_item.templateName}}</span>
                            <i class="el-icon-check" v-if="_item.checked"></i>
                        </li>
                    </ul>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setPromotion">确 定</el-button>
                <el-button @click="cancer">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>
    export default {
        data() {
            let required = [{required: true, message: '该项不能为空'}];
            return {
                dataCache: {},
                templateCache: [],
                data: {
                    sys: [],
                },
                promotionOpt: {
                    sys: '系统coupon模板',
                },
                index: '',
                currentIndex: '',
                couponTemplateId: [],
                promotionDialog: false,
                promotionLoading: false,
                required: required,
                option: {
                    sellerId: '',
                    shopName: '',
                    shopType: '',
                    supplier: '',
                    operationType: 1,
                    isShow: 1,
                    slogan: '',
                    promotionConfiguration: '',
                    couponTemplateId: '',
                    bannerPc: '',
                    bannerM: '',
                    bannerAndroid: '',
                    bannerIos: '',
                    bannerPad: '',
                    countryCodeLocation: '',
                    provinceCodeLocation: '',
                    cityNameLocation: '',
                    counryCodeSalesReturn: '',
                    provinceCodeSalesReturn: '',
                    cityNameSalesReturn: '',
                    addressDetail: '',
                    phone: '',
                    zipCode: '',
                    titleSeo: '',
                    keywordSeo: '',
                    descriptionSeo: '',
                    remark: '',
                },
                countryOpt: [],
                provinceOpt: [],
                returnProvinceOpt: [],
                cityOpt: [],
                returnCityOpt: [],
                platOpt: {
                    'bannerPc': 'PC',
                    'bannerM': 'M',
                    'bannerAndroid': 'ANDROID',
                    'bannerIos': 'IOS',
                    'bannerPad': 'PAD',
                },
                operationOpt: {
                    '1': '自运营',
                    '2': '代运营',
                    '3': '供应商运营',
                },
                shopOpt: {
                    '1': '自营店铺',
                    // '2': '第三方店铺',
                    '3': '供应商店铺',
                },
                sellerOpt: [],
                initCountry: true,
                initProvince: true,
                initReturnCountry: true,
                initReturnProvince: true,
                id: this.$route.query.id,
                edit: Object.keys(this.$route.query).length > 0,
                postRule: {
                    sellerId: required,
                    shopName: [{
                        max: 30,
                        required: true,
                        message: '该项不能为空，不超过30个字符'
                    }],
                    slogan: [{
                        max: 200,
                        message: '该项不能超过200个字符'
                    }],
                    shopType: required,
                    operationType: required,
                    isShow: required,
                    titleSeo: [{
                        max: 1000,
                        message: '该项不能超过1000个字符'
                    }],
                    keywordSeo: [{
                        max: 1000,
                        message: '该项不能超过1000个字符'
                    }],
                    descriptionSeo: [{
                        max: 1000,
                        message: '该项不能超过1000个字符'
                    }],
                }
            };
        },
        created() {
            if (this.edit && this.id) {
                this.getData();
            }
            if (this.$route.query.sellerId) {
                this.option.sellerId = this.$route.query.sellerId;
            }
            this.getCountry();
            this.getSeller();
        },
        methods: {
            changePromotion (val) {
                switch (this.currentIndex) {
                    case 'sys':
                    let check = val.target.checked;
                    this.couponTemplateId = [];
                    if (check) {
                        this.data.sys.forEach(item => {
                            item.checked = check;
                            this.couponTemplateId.push(item.code);
                        });
                    } else {
                        this.data.sys.forEach(item => {
                            item.checked = check;
                        });
                    }
                    break;
                    default:
                    return;
                };
            },
            checkItem (item) {
                switch (this.currentIndex) {
                    case 'sys':
                    if (!item.checked) {
                        this.couponTemplateId.push(item.code);
                    } else {
                        let index = this.couponTemplateId.indexOf(item.code);
                        this.couponTemplateId.splice(index, 1);
                    }
                    item.checked = !item.checked;
                    break;
                    default:
                    return;
                }
            },
            getPromotionData (index) {
                this.currentIndex = index;
                switch (index) {
                    case 'sys':
                    this.getSys();
                    break;
                    default:
                    return;
                }
            },
            async getSys () {
                if (this.data.sys.length != 0) {
                    return;
                }
                let params = {
                    page: 1,
                    page_size: 100,
                }
                this.promotionLoading = true;
                try {
                    let res = await this.httpGet_('promotion/template/sys-lists', {params: params});
                    let data = res.list;
                    data.forEach(item => {

                        if (this.couponTemplateId.indexOf(String(item.code)) != -1) {
                            item.checked = true;
                        } else {
                            item.checked = false;
                        }
                    })
                    this.data.sys = data;
                    // 缓存data
                    this.dataCache = JSON.parse(JSON.stringify(this.data));
                } finally {
                    this.promotionLoading = false;
                }
            },
            //
            async getData () {
                let data = await this.httpGet_('store/store/detail', {params: {id: this.id}});
                this.couponTemplateId = data.couponTemplateId.split(',');
                for (let i in this.option) {
                    this.option[i] = data[i];
                }
                this.getPromotionData('sys');
            },
            async getSeller () {
                let data = await this.httpGet_('store/seller/drop-down-seller-list');
                this.sellerOpt = data;
            },
            async getCountry () {
                let params = {
                    page_size: 2000,
                    page: 1,
                }
                const data = await this.httpGet_('logistics/country-info/list', {params: params});
                this.countryOpt = data.list;
            },
            async getProvince (val, type) {
                if (!val) {
                    return;
                }
                let params = {
                    countryCode: val
                }
                let data = await this.httpGet_('logistics/public/get-provinces-by-country-code', {params: params});

                if (type == 'return') {
                    if (this.edit && this.initReturnCountry) {
                        this.initReturnCountry = false;
                    } else {
                        this.option.provinceCodeSalesReturn = '';
                    }
                    this.returnProvinceOpt = data;
                } else {
                    if (this.edit && this.initCountry) {
                        this.initCountry = false;
                    } else {
                        this.option.provinceCodeLocation = '';
                    }
                    this.provinceOpt = data;
                }
            },
            async getCity (val, type) {
                if (!val) {
                    return;
                }
                let params = {
                    provinceCode: val
                }
                const data = await this.httpGet_('logistics/public/get-cities-by-province-code', {params: params});
                // 编辑初始化时不改变
                if (type == 'return') {
                    if (this.edit && this.initReturnProvince) {
                        this.initReturnProvince = false;
                    } else {
                        this.option.cityNameSalesReturn = '';
                    }
                    this.returnCityOpt = data;
                } else {
                    if (this.edit && this.initProvince) {
                        this.initProvince = false;
                    } else {
                        this.option.cityNameLocation = '';
                    }
                    this.cityOpt = data;
                }
            },
            post () {
                this.$refs.postForm.validate(async valid => {
                    if (valid) {
                        let src = 'store/store/add';
                        let params = JSON.parse(JSON.stringify(this.option));

                        if (this.id) {
                            src = 'store/store/edit';
                            params.id = this.id;
                        }
                        const data = await this.httpPost_(src, params);
                        this.$message.success(data.message);
                        this.goback();
                    }
                });
            },
            goback () {
                this.$router.push({
                    name: 'store_storeList',
                })
            },
            setPromotion () {
                this.option.couponTemplateId = this.couponTemplateId.join(',');
                this.promotionDialog = false;
            },
            changeShop (val) {
                if (val == 1) {
                    this.option.isShow = 0;
                }
            },
            set () {
                this.dataCache = JSON.parse(JSON.stringify(this.data));
                this.templateCache = JSON.parse(JSON.stringify(this.couponTemplateId));
                this.promotionDialog = true;
            },
            cancer () {
                this.data = JSON.parse(JSON.stringify(this.dataCache));
                this.couponTemplateId = JSON.parse(JSON.stringify(this.templateCache));
                this.promotionDialog = false;
            },
        }
    }
</script>

<style lang="less">
    .store-edit {
        .address {
            padding: 0 5px;
        }

        .address-text {
            margin-top: 10px;
        }

        .item {
            margin-bottom: 10px;
        }

        .set {
            height: 392px;
            border: 1px solid #bfcbd9;

            .el-col {
                height: 100%;
            }

            ul {
                list-style: none;
                height: 100%;

                &.title-list {
                     border-right: 1px solid #bfcbd9;

                     .active {
                        background: #58B7FF;
                     }
                }

                &.data-list {
                    overflow-y: auto;

                    i {
                        line-height: 29px;
                        float: right;
                        color: #13ce66;
                    }

                    li  {

                        &:hover {
                            background: #D3DCE6;
                        }
                    }
                }

                li {
                    padding: 10px;

                    &:hover {
                        background: #58B7FF;
                    }
                }
            }
        }
    }
</style>
