<!-- 店铺详情 -->
<template>
    <div class="store-info el-container">
        <el-form :model="option" label-width="120px" ref="info">
            <el-row>
                <el-col :span="8">
                    <el-card class="box">
                        <div slot="header">
                            <span>卖家信息</span>
                        </div>
                        <p>账号信息</p>
                        <el-form-item label="卖家ID：">
                            {{option.seller.id}}
                        </el-form-item>
                        <el-form-item label="卖家账号：">
                            {{option.seller.account}}
                        </el-form-item>
                        <el-form-item label="注册时间：">
                            {{self.timeZone_(option.seller.createTime, self.$store.getters.getTimeZone)}}
                        </el-form-item>
                        <p>公司资料</p>
                        <el-form-item label="公司名称：">
                            <span v-if="option.seller.companyName">{{option.seller.companyName}}</span>
                            <span v-else>- -</span>
                        </el-form-item>
                        <el-form-item label="联系人：">
                            <span v-if="option.seller.contact">{{option.seller.contact}}</span>
                            <span v-else>- -</span>
                        </el-form-item>
                        <el-form-item label="联系方式：">
                            <span v-if="option.seller.contactMethod">{{option.seller.contactMethod}}</span>
                            <span v-else>- -</span>
                        </el-form-item>
                        <el-form-item label="国家：">
                            <span v-if="option.seller.addressCountryCode">{{option.seller.addressCountryCode}}</span>
                            <span v-else>- -</span>
                        </el-form-item>
                        <el-form-item label="区域：">
                            <span v-if="option.seller.addressProvinceCode || option.seller.addressCityName">{{option.seller.addressProvinceCode}} {{option.seller.addressCityName}}</span>
                            <span v-else>- -</span>
                        </el-form-item>
                        <el-form-item label="详细地址：">
                            <span v-if="option.seller.addressDetail">{{option.seller.addressDetail}}</span>
                            <span v-else>- -</span>
                        </el-form-item>
                    </el-card>
                    <el-card class="box">
                        <div slot="header">
                            <span>供应商信息</span>
                        </div>
                        <p>账号信息</p>
                        <el-form-item label="供应商编码：">
                            {{option.supplier}}
                        </el-form-item>
                    </el-card>
                </el-col>
                <el-col :span="16" class="store-card">
                    <el-card class="box">
                        <div slot="header">
                            <span>店铺资料</span>
                        </div>
                        <el-row>
                            <el-col :span="10">
                                <p>基础资料</p>
                                <el-form-item label="店铺ID：">
                                    {{option.shopCode}}
                                </el-form-item>
                                <el-form-item label="店铺名称：">
                                    {{option.shopName}}
                                </el-form-item>
                                <el-form-item label="运营模式：">
                                    {{operationOpt[option.operationType]}}
                                </el-form-item>
                                <el-form-item label="店铺评分：">
                                    {{option.grade}}
                                </el-form-item>
                                <el-form-item label="显示开关：">
                                    <el-button v-if="option.isShow == 1" type="text" @click="changeShow">显示</el-button>
                                    <el-button v-if="option.isShow == 0" type="text" @click="changeShow">不显示</el-button>
                                </el-form-item>
                                <el-form-item label="营销配置：">
                                    <el-button type="primary" @click="set">配置</el-button>
                                </el-form-item>
                                <el-form-item label="广告语：">
                                    <span v-if="option.slogan">{{option.slogan}}</span>
                                    <span v-else>- -</span>
                                </el-form-item>
                                <el-form-item label="创建时间：">
                                    {{self.timeZone_(option.createTime, self.$store.getters.getTimeZone)}}
                                </el-form-item>
                                <el-form-item label="最后编辑时间：">
                                    {{self.timeZone_(option.updateTime, self.$store.getters.getTimeZone)}}
                                </el-form-item>
                                <el-form-item label="操作人：">
                                    {{option.updateUser}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <p>发货信息</p>
                                <el-form-item label="所在国家：">
                                    <span v-if="option.countryNameLocation">{{option.countryNameLocation}}</span>
                                    <span v-else>- -</span>
                                </el-form-item>
                                <el-form-item label="所在区域：">
                                    <span v-if="option.provinceNameLocation || option.cityNameLocation">
                                        {{option.provinceNameLocation}} {{option.cityNameLocation}}
                                    </span>
                                    <span v-else>- -</span>
                                </el-form-item>
                                <el-form-item label="退货地址：">
                                    {{option.counryNameSalesReturn}} {{option.provinceNameSalesReturn}} {{option.cityNameSalesReturn}} {{option.addressDetail}} {{option.phone}}
                                </el-form-item>
                                <p>SEO信息</p>
                                <el-form-item label="SEO标题：">
                                    <span v-if="option.titleSeo">{{option.titleSeo}}</span>
                                    <span v-else>- -</span>
                                </el-form-item>
                                <el-form-item label="SEO关键词：">
                                    <span v-if="option.keywordSeo">{{option.keywordSeo}}</span>
                                    <span v-else>- -</span>
                                </el-form-item>
                                <el-form-item label="SEO描述：">
                                    <span v-if="option.descriptionSeo">{{option.descriptionSeo}}</span>
                                    <span v-else>- -</span>
                                </el-form-item>
                                <p>Banner Url</p>
                                <el-form-item label="PC：">
                                    {{option.bannerPc}}
                                </el-form-item>
                                <el-form-item label="M：">
                                    {{option.bannerM}}
                                </el-form-item>
                                <el-form-item label="ANDROID：">
                                    {{option.bannerAndroid}}
                                </el-form-item>
                                <el-form-item label="IOS：">
                                    {{option.bannerIos}}
                                </el-form-item>
                                <el-form-item label="PAD：">
                                    {{option.bannerPad}}
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-card>
                    <el-card class="box">
                        <div slot="header">
                            <span>备注信息</span>
                        </div>
                        <p>
                            {{option.updateUser}} {{self.timeZone_(option.updateTime, self.$store.getters.getTimeZone)}}
                        </p>
                        <span>{{option.remark}}</span>
                    </el-card>
                </el-col>
            </el-row>
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
                <el-button type="primary" @click="setPromotion">保存修改</el-button>
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
                id: this.$route.query.id,
                self: this,
                option: {
                    id: '',
                    shopCode: '',
                    shopName: '',
                    shopType: '',
                    operationType: '',
                    grade: '',
                    isShow: '',
                    slogan: '',
                    createTime: '',
                    updateTime: '',
                    updateUser: '',
                    countryCodeLocation: '',
                    countryNameLocation: '',
                    counryNameSalesReturn: '',
                    provinceCodeLocation: '',
                    provinceNameSalesReturn: '',
                    provinceNameLocation: '',
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
                    seller: {},
                    bannerAndroid: '',
                    bannerIos: '',
                    bannerM: '',
                    bannerPad: '',
                    bannerPc: '',
                    supplier: '',
                },
                operationOpt: {
                    '1': '自运营',
                    '2': '代运营',
                    '3': '供应商运营',
                },
                shopOpt: {
                    '1': '自营店铺',
                    '2': '第三方店铺',
                    '3': '供应商店铺',

                },
                //
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
                templateCache: [],
                dataCache: {},
            };
        },
        created() {
            this.getData();
        },
        methods: {
            async getData () {
                let data = await this.httpGet_('store/store/detail', {params: {id: this.id}});
                for (let i in this.option) {
                    if (data[i]) {
                        this.option[i] = data[i];
                    }
                }
                this.couponTemplateId = data.couponTemplateId.split(',');
                this.getPromotionData('sys');
            },
            async changeShow () {
                let params = {
                    id: this.option.id,
                    isShow: this.option.isShow == 1 ? 0 : 1,
                }
                const data = await this.httpPost_('store/store/is-show', params);
                this.option.isShow = this.option.isShow == 1 ? 0 : 1;
                this.$message.success(data.message);
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
                }
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
            async setPromotion () {
                this.option.couponTemplateId = this.couponTemplateId.join(',');

                let src = 'store/store/edit';
                let params = JSON.parse(JSON.stringify(this.option));
                params.id = this.id;

                const data = await this.httpPost_(src, params);
                this.promotionDialog = false;
                this.$message.success(data.message);
                this.goback();
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
                } finally {
                    this.promotionLoading = false;
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
    .store-info {
        .el-card {
            margin-bottom: 10px;

            .el-card__header {
                background: #58B7FF;
                color: #fff;

                .el-button {
                    margin-left: 20px;
                }
            }

            p {
                color:#8492A6;
                font-size:16px;
                margin-bottom: 5px;
            }
        }

        .el-form-item {
            margin-bottom: 0;
        }

        .store-card {
            padding-left: 10px;
        }

        .el-form-item__content {
            word-break: break-all;
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
