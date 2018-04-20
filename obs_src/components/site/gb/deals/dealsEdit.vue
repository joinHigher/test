<!-- deals编辑 -->
<template>
    <div class="el-container gb-deals-edit" v-loading="fullLoading">
        <el-form label-width="100px" :model="option" ref="postForm" :rules="postRule">
<!--             <el-form-item label="语言" prop="lang">
                <el-select clearable filterable v-model="option.lang" placeholder="请选择">
                    <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select :disabled="Boolean(id)" v-model="option.pipeline_code" clearable filterable>
                    <el-option v-for="(item, index) in pipeObj" :label="item" :value="index" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SKU" prop="goods_sn">
                <el-row>
                    <el-col :span="16">
                        <el-input v-model.trim="option.goods_sn"></el-input>
                    </el-col>
                    <el-col :span="4" :offset="1">
                        <el-button type="primary" @click="getWare" v-loading="getLoading" :disabled="getLoading">查找</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="仓库" prop="real_wh_code">
                <el-select :disabled="wareOpt.length == 0" v-model="option.real_wh_code" clearable filterable @change="getGoodsInfo" placeholder="请先选择渠道和SKU">
                    <el-option v-for="(item, index) in wareOpt" :label="item.whName || '无名称'" :value="item.vwhCode" :key="item.vwhCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类:">
                <el-select v-model="option.deal_cat_id" clearable filterable>
                    <el-option v-for="catItem in catOpt" :key="catItem.id" :label="catItem.categoryMultiLang.categoryName" :value="catItem.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="goods_title">
                <el-input v-model.trim="option.goods_title" readonly></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="goods_brand">
                <el-input v-model.trim="option.goods_brand" readonly></el-input>
            </el-form-item>
            <el-form-item label="本店售价" prop="shop_price">
                <el-input v-model.trim="option.shop_price" readonly></el-input>
            </el-form-item>
            <el-form-item label="页面价格" prop="page_price">
                <el-input v-model.trim="option.page_price" :disabled="couponLock"></el-input>
            </el-form-item>
            <el-form-item label="展示折扣标" prop="is_discount">
                <el-checkbox v-model.trim="option.is_discount" :true-label="1" :false-label="0"></el-checkbox>
            </el-form-item>
            <el-form-item label="赞" prop="likes">
                <el-input v-model.trim="option.likes"></el-input>
            </el-form-item>
            <el-form-item label="coupon" prop="coupon">
                <el-input v-model.trim="option.coupon" @blur="getCoupon"></el-input>
            </el-form-item>
            <el-form-item label="生效时间" prop="date">
                <el-date-picker v-model="option.date" type="datetimerange" :editable="false"></el-date-picker>
            </el-form-item>
            <el-form-item label="描述" prop="deals_desc">
                <el-input v-model.trim="option.deals_desc" type="textarea" :rows="4"></el-input>
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
        let checkLike = (rule, val, callback) => {
            if (Number.isInteger(val * 1) && val * 1 >= 1) {
                callback();
            } else {
                callback(new Error('赞为大于等于1的整数'))
            }
        }

        let checkNumber = (rule, val, callback) => {
            if (val == val*1) {
                callback();
            } else {
                callback(new Error('该项应为数字'))
            }
        }
        return {
            editFlag: this.$route.query.id ? true : false,
            init: false,
            getLoading: false,
            fullLoading: this.$route.query.id ? true : false,
            postLoading: false,
            couponLock: false,
            id: this.$route.query.id,
            option: {
                // lang: '',
                pipeline_code: '',
                real_wh_code: '',
                goods_sn: '',
                deal_cat_id: '',
                goods_title: '',
                goods_brand: '',
                shop_price: '',
                page_price: '',
                likes: '',
                coupon: '',
                date: [],
                deals_desc: '',
                is_discount: 0,
            },
            wareOpt: [],
            catOpt: [],
            // langs: null,
            postRule: {
                goods_sn: [{
                    required: true,
                    message: '该项不能为空',
                }],
                shop_price: [{
                    required: true,
                    message: '该项不能为空',
                }],
                page_price: [{
                    required: true,
                    message: '该项不能为空',
                }, {
                    validator: checkNumber,
                }],
                likes: [{
                    required: true,
                    message: '该项不能为空',
                }, {
                    validator: checkLike,
                }],
                date: [{
                    type: 'array',
                    required: true,
                    message: '该项不能为空',
                }],
                is_discount: [{
                    required: true,
                    message: '该项不能为空',
                }],
                real_wh_code: [{
                    required: true,
                    message: '该项不能为空',
                }],
                // lang: [{
                //     required: true,
                //     message: '该项不能为空',
                // }],
                pipeline_code: [{
                    required: true,
                    message: '该项不能为空',
                }]
            }
        };
    },
    computed: {
        ctrl() {
            if (this.id) {
                return this.showAction_('admin/deals/edit');
            } else {
                return this.showAction_('admin/deals/add');
            }
        },
        pipeObj () {
            return this.$store.getters.getPipe.obj;
        },
    },
    created () {
        // this.getLangs();
        this.getOpt();
    },
    methods: {
        async getData() {
            try {
                const data = await this.httpGet_('admin/deals/info', {params: {id: this.id}});
                for (let i in this.option) {
                    this.option[i] = data[i];
                }
                let date1 = this.timeZone_(data.start_time, this.$store.getters.getTimeZone);
                let date2 = this.timeZone_(data.end_time, this.$store.getters.getTimeZone);
                this.option.date = [new Date(date1), new Date(date2)];
                this.getWare();
            } finally {
                this.fullLoading  = false;
            }
        },
        // 获取语言列表
        // getLangs() {
        //     this.$http.get('admin/public/languages').then(res => {
        //             if (res.body.code !== 0) {
        //                 return;
        //             }
        //             this.langs = res.body.data;
        //         },
        //         (err) => {
        //             this.$notify.error(err.body.message || '发生错误');
        //         });
        // },
        getWare() {
            this.wareOpt = [];
            this.getLoading = true;
            this.$http.get('goods/goods/get-goods-virtual-wares',
                {params: {goodSnList: [this.option.goods_sn]}}
            ).then(res => {
                this.getLoading  = false;
                if (res.body.code === 0) {
                    this.wareOpt = res.body.data.siteGoodsInfo;
                    if (!this.editFlag) {
                        this.option.real_wh_code = '';
                    } else {
                        this.editFlag = false;
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.getLoading  = false;
            })
        },
        async getGoodsInfo() {
            if (this.init) {
                this.init = false;
                return;
            }
            if (!this.option.real_wh_code) {
                this.option.goods_title = '';
                this.option.shop_price = '';
                this.option.goods_brand = '';
                this.option.deal_cat_id = '';
                return;
            }

            let params = {};
            params.lang = 'en';
            params.virWhCode = this.option.real_wh_code;
            params.goodsSn = this.option.goods_sn;

            const data = await this.httpGet_('goods/goods/goods-info', {params: params});
            let langList = data.info.siteMultiLangGoodsList;
            langList.forEach(item => {
                if (item.lang == 'en') {
                    this.option.goods_title = item.goodTitle;
                }
            });

            let priceList = data.price;
            priceList.forEach(price => {
                if (price.pipelineCode == this.option.pipeline_code) {
                    this.option.shop_price = price.goodsEditPriceList[0].shopPrice;
                }
            });

            data.info.categoryList.forEach(item => {
                if (item.isDefault == 1) {
                    this.option.deal_cat_id = item.categoryId;
                }
            })

            this.option.goods_brand = data.info.brandName;
        },
        // 获取coupon价格
        getCoupon (value) {
            let val = value.target.value;
            if (val) {
                let params = {
                    page: 1,
                    page_size: 1,
                    code: val,
                };
                this.$http.get('promotion/coupon/lists', {params: params}).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        if (data.list.length > 0) {
                            let info = data.list[0];
                           if (info.type == 10 || info.type == 14) {
                                this.option.page_price = info.strategys;
                                this.couponLock = true;
                            }
                        }
                    }
                })
            } else {
                this.couponLock = false;
            }
        },
        async getOpt() {
            const data = await this.httpGet_('goods/category/list', {params: {parentId: 0, isLeaves: false}});
            if (this.id) {
                this.init = true;
                this.getData();
            }
            this.catOpt = data.list;
            // this.$http.get('goods/category/list', {params: {parentId: 0, isLeaves: false}}).then(res => {
            //     if (res.body.code === 0) {
            //         if (this.id) {
            //             this.init = true;
            //             this.getData();
            //         }
            //         this.catOpt = res.body.data.list;
            //     } 
            // }).catch(err => {

            // });
        },
        post() {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let params = {};
                    let src = 'admin/deals/add';
                    if (this.id) {
                        src = 'admin/deals/edit'
                        params.id = this.id;
                    }

                    for (let i in this.option) {
                        if (i != 'date') {
                            params[i] = this.option[i];
                        }
                    }

                    let timeArr = this.timeZone_(this.option.date, this.$store.getters.getTimeZone);
                    params.start_time = timeArr[0];
                    params.end_time = timeArr[1];
                    this.postLoading = true;

                    if (!params.deal_cat_id) {
                        params.deal_cat_id = 0;
                    }
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

            })
        },
        goback () {
            this.$router.push({
                name: 'site_dealsList'
            })
        },
    }

}
</script>

<style lang="less">
    .gb-deals-edit {
        .el-form-item__content {
            width: 50%;
        }
    }
</style>


