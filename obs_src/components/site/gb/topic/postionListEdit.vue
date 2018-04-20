<!-- google模板编辑 -->
<template>
    <div>
        <div class="el-container topic-edit" v-loading="isDataLoading">
            <el-row class="el-sub-container">
                <el-col class="box" :span="20">
                    <el-form label-width="160px" :model="item" :rules="positionRule" ref="itemForm">

                        <!--语言tabs begin-->
                        <el-tabs v-model="currentLang" @tab-click="toggleLang" class="mb15">
                            <el-tab-pane v-for="(item, index) in specialLangOpt" :label="item.lang === item.default_lang ? langText[item.lang] + '（默认语言）' : langText[item.lang]" :name="item.lang" :key="index" :disabled="isEdit === true && item.lang !== item.default_lang"></el-tab-pane>
                        </el-tabs><!--语言tabs end-->

                        <el-form-item label="版块类型" prop="type" label-width="80px">
                            <el-select v-model="item.type" @change="handlePositionTypeChange" :disabled="!isEdit">
                                <el-option v-for="(item, index) in positionTypes" :label="item" :key="index" :value="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版块排序" prop="order" label-width="80px">
                            <el-input v-model.number="item.order" :maxlength="10" :disabled="!isEdit"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-tabs type="card" v-model="currentPlat" @tab-click="togglePlat">
                                <el-tab-pane label="PC" name="PC"></el-tab-pane>
                                <el-tab-pane label="M" name="M" :disabled="mIsDisabled" v-if="item.type !== 'single_product' && item.type !== 'app_exclusive'"></el-tab-pane>
                            </el-tabs>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="版块名称" prop="name">
                                    <el-input v-model.trim="item.name" :maxlength="100"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="板块View More链接" prop="view_more_link">
                                    <el-input v-model.trim="item.view_more_link" :maxlength="100"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="显示设置" v-if="item.type !== 'app_exclusive'" prop="shows">
                            <el-checkbox-group v-model="item.shows">
                                <el-checkbox v-for="(label, index) in item.goodsListShow" :key="index" :label="index" :disabled="isDisabledPublic">{{label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="板块名称上方代码" prop="header_code">
                            <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="item.header_code"></el-input>
                            <div class="color-silver">（板块与板块之间，板块标题上方的样式，可以修改板块标题，优先级高于板块名称）</div>
                        </el-form-item>
                        <el-form-item label="板块定位标签名" prop="nav_name">
                            <el-input v-model.trim="item.nav_name"></el-input>
                        </el-form-item>
                        <el-form-item label="板块名称下方代码" prop="header_code">
                            <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="item.footer_code"></el-input>
                            <div class="color-silver">（板块与板块之间，板块标题下方，商品之间的样式）</div>
                        </el-form-item>
                        <el-form-item label="板块底部代码" prop="footer_code">
                            <el-input type="textarea" :autosize="{ maxRows: 4}" v-model.trim="item.bottom_code"></el-input>
                            <div class="color-silver">（板块商品下一层的样式）</div>
                        </el-form-item>
                        <el-form-item
                            v-if="item.type !== 'match_sell' && item.type !== 'multiple_time_rush_to_purchase' && item.type !== 'multiple_goods_rush_to_purchase'
                            && item.type !== 'increase_purchase' && item.type !== 'app_exclusive' && item.type !== 'single_product'"
                            label="版块商品" prop="goods" :rules="[{validator: checkWid, trigger: 'blur'}]">
                            <el-input placeholder="多个SKU用英文&quot;,&quot;隔开，" v-model="item.goods" type="textarea" :autosize="{ maxRows: 4}" :disabled="isDisabledPublic"></el-input>
                            <div v-if="item.type === 'rush_to_purchase'" class="color-silver">（请留意商品是否设置抢购数量）</div>
                        </el-form-item>

                        <!--普通商品版块，抢购商品板块，促销码板块 M版-->
                        <div v-if="(item.type == 'normal' || item.type == 'rush_to_purchase' || item.type == 'promotion_code') && currentPlat == 'M'">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="主推商品" prop="main_goods">
                                        <el-input v-model="item.main_goods"></el-input>
                                        <div class="color-silver">（只能填一个sku）</div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="Coupon" prop="main_goods_coupon" v-if="item.type == 'promotion_code'">
                                        <el-input type="text" v-model="item.main_goods_coupon"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="文案说明" prop="main_goods_intro_desc">
                                <el-input type="textarea" :rows="3" v-model="item.main_goods_intro_desc"></el-input>
                            </el-form-item>
                        </div><!--普通商品版块，抢购商品板块，促销码板块 M版-->

                        <!-- 多商品 -->
                        <div v-if="item.type === 'multiple_goods_rush_to_purchase' && item.goods instanceof Array">
                            <div v-for="(good, index) in item.goods" :key="index">
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="抢购分组组别" :prop="'goods.' + index + '.group'" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
                                            <el-input v-model.trim="good.group" :maxlength="100"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="时间段" :prop="'goods.' + index + '.start_time'" :rules="[{ required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }]">
                                            <el-date-picker v-model="good.start_time" type="datetime" placeholder="选择开始时间" @change="handlePositionDateChange($event, index, 'start')"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="5" class="item-end-time">
                                        <el-form-item label="-" :prop="'goods.' + index + '.end_time'" :rules="[{ required: true, type: 'date', message: '请选择结束时间', trigger: 'change' }]" label-width="20px">
                                            <el-date-picker v-model="good.end_time" type="datetime" placeholder="选择结束时间" @change="handlePositionDateChange($event, index, 'end')"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="3" class="text-right">
                                        <el-button v-if="index === 0" type="primary" @click="multipleGoodsAdd">新增</el-button>
                                        <el-button v-if="index > 0" type="danger" @click="multipleGoodsRemove(index)">删除</el-button>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="分组图片" :prop="'goods.' + index + '.group_pic'" :rules="required">
                                            <el-input v-model="good.group_pic"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="分组品牌代码" :prop="'goods.' + index + '.group_brand'" :rules="required">
                                            <el-input v-model="good.group_brand"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label-width="0">
                                            <span class="color-silver">&nbsp;&nbsp;品牌代码通过后台商品品牌列表查询</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="版块商品" :prop="'goods.' + index + '.sku'" :rules="[{validator: checkWid, trigger: 'blur'}]">
                                    <el-input placeholder="多个SKU用英文&quot;,&quot;隔开，" v-model="good.sku" type="textarea" :autosize="{ maxRows: 4}" :disabled="isDisabledPublic"></el-input>
                                    <div class="color-silver">（请留意商品是否设置抢购数量）</div>
                                </el-form-item>
                                <el-form-item label="领劵coupon" :prop="'goods.' + index + '.coupon'" :rules="required">
                                    <el-input placeholder="为空则不显示领券模板" v-model="good.coupon"></el-input>
                                </el-form-item>
                                <el-form-item label="领劵banner" :prop="'goods.' + index + '.coupon_banner'" :rules="required">
                                    <el-input placeholder="为空则不显示领券模板" v-model="good.coupon_banner"></el-input>
                                </el-form-item>
                                <el-form-item label="领劵URL" :prop="'goods.' + index + '.coupon_url'" :rules="required">
                                    <el-input placeholder="为空则不显示领券模板" v-model="good.coupon_url"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <!-- 多商品 -->

                        <!-- 搭售 -->
                        <el-form-item v-if="item.type === 'match_sell' && item.goods instanceof Array" label="版块商品">
                            <el-row v-for="(itemGoods, i) in item.goods" :key="i" class="match-sell">
                                <el-col :span="9">
                                    <el-form-item :prop="'goods.' + i + '.sku'" :rules="[{validator: checkWid, trigger: 'blur'}]">
                                        <el-input v-model.trim="itemGoods.sku" placeholder="主商品SKU"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" class="text-center">+</el-col>
                                <el-col :span="9">
                                    <el-form-item :prop="'goods.' + i + '.accessories_sku'">
                                        <el-input v-model.trim="itemGoods.accessories_sku" placeholder="配对商品SKU，最多输入3个"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5" class="text-center">
                                    <el-button type="primary" icon="plus" @click="addMatchGoods(item.goods)"></el-button>
                                    <el-button type="danger" icon="minus" @click="removeMatchGoods(item.goods, itemGoods)"></el-button>
                                </el-col>
                                <el-col :span="9" :offset="10">
                                    <el-form-item :prop="'goods.' + i + '.buy_gift_sku'" class="buy-gift">
                                        <el-input v-model.trim="itemGoods.buy_gift_sku" placeholder="买即赠商品SKU，最多输入3个"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <!-- 搭售 -->

                        <el-form-item v-if="item.type !== 'match_sell' && item.type !== 'increase_purchase' && item.type !== 'app_exclusive'" label="取该标签下价格" :rules="(item.type === 'rush_to_purchase' || item.type === 'multiple_time_rush_to_purchase') ? [{required: true, message: '该项不能为空'}] : []" prop="price_label_id">
                            <el-select v-model="item.price_label_id" clearable class="w-400" @change="changeTag($event, item)" :disabled="isDisabledPublic">
                                <el-option v-for="(el, index) in priceLabels" :label="el.name" :key="index" :value="String(el.labelId)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="item.type !== 'match_sell' && item.type !== 'increase_purchase' && item.type !== 'app_exclusive' && item.price_label_id" label="价格标签生效时间点" prop="price_label_start" :rules="[{required: true, message: '该项不能为空'}]" :disabled="isDisabledPublic">
                            <el-date-picker v-model="item.price_label_start" type="datetime" placeholder="选择日期" class="w-400" @change="checkDate_($event, item.price_label_start)"></el-date-picker>
                        </el-form-item>
                        <div v-if="item.type === 'rush_to_purchase' || item.type === 'multiple_time_rush_to_purchase' || item.type === 'multiple_goods_rush_to_purchase'">
                            <el-form-item label="如何显示价格" prop="expired_price_is_show">
                                <el-radio v-model="item.expired_price_is_show" :label="1" :disabled="isDisabledPublic">一直显示价格</el-radio>
                                <el-radio v-model="item.expired_price_is_show" :label="0" :disabled="isDisabledPublic">抢购时间内显示价格，其他时间以问号形式显示</el-radio>
                            </el-form-item>
                        </div>
                        <div v-else-if="item.type === 'promotion_code'">
                            <el-form-item label="Coupon码" prop="coupon">
                                <el-input v-model.trim="item.coupon" type="textarea" :maxlength="100" class="w-400"></el-input>
                            </el-form-item>
                        </div>

                        <!-- 多时段抢购版块 -->
                        <div v-if="item.type === 'multiple_time_rush_to_purchase' && item.goods instanceof Array">
                            <div v-for="(good, index) in item.goods" :key="index">
                                <el-form-item label="抢购分组组别" required>
                                    <el-col :span="7">
                                        <el-form-item :prop="'goods.' + index + '.group'" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
                                            <el-input v-model.trim="good.group" :maxlength="100"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="时间段" :prop="'goods.' + index + '.start_time'" :rules="[{ required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }]">
                                            <el-date-picker v-model="good.start_time" type="datetime" placeholder="选择开始时间" :disabled="index > 0" @change="handlePositionDateChange($event, index, 'start')"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="item-end-time">
                                        <el-form-item label="-" :prop="'goods.' + index + '.end_time'" :rules="[{ required: true, type: 'date', message: '请选择结束时间', trigger: 'change' }]" label-width="20px">
                                            <el-date-picker v-model="good.end_time" type="datetime" placeholder="选择结束时间" @change="handlePositionDateChange($event, index, 'end')"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="3" class="text-right">
                                        <el-button v-if="index === 0" type="primary" @click="handlePositionAddTimeClick">新增</el-button>
                                        <el-button v-if="index > 0" type="danger" @click="handlePositionDelTimeClick(index)">删除</el-button>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="版块商品" :prop="'goods.' + index + '.sku'" :rules="[{validator: checkWid, trigger: 'blur'}]">
                                    <el-input placeholder="多个SKU用英文&quot;,&quot;隔开，" v-model="good.sku" type="textarea" :autosize="{ maxRows: 4}" :disabled="isDisabledPublic"></el-input>
                                    <div class="color-silver">（请留意商品是否设置抢购数量）</div>
                                </el-form-item>
                            </div>
                        </div>
                        <!-- 多时段抢购版块 -->

                        <!--加价购板块（0.9新增）-->
                        <div v-if="item.type === 'increase_purchase'">
                            <el-form-item label="加价购活动ID">
                                <el-input v-model.trim="item.activity_id"></el-input>
                            </el-form-item>
                            <el-form-item label="角标文案">
                                <el-input v-model.trim="item.label_desc"></el-input>
                            </el-form-item>
                            <el-form-item label="首个橱窗位图片地址">
                                <el-input v-model.trim="item.banner_image"></el-input>
                            </el-form-item>
                            <el-form-item label="首个橱窗位跳转链接">
                                <el-input v-model.trim="item.banner_link"></el-input>
                            </el-form-item>
                        </div>
                        <!--加价购板块（0.9新增）-->

                        <!--APP专享价板块（0.9新增）-->
                        <div v-if="item.type === 'app_exclusive'">
                            <el-form-item label="版块商品" prop="goods" :rules="[{validator: checkWid, trigger: 'blur'}]">
                                <el-input placeholder="多个SKU用英文&quot;,&quot;隔开，" v-model="item.goods" type="textarea" :autosize="{ maxRows: 4}" :disabled="isDisabledPublic"></el-input>
                                <div class="color-silver">（请留意商品是否已设置手机专享价）</div>
                            </el-form-item>
                            <el-form-item label="首个橱窗位图片地址">
                                <el-input v-model.trim="item.banner_image"></el-input>
                            </el-form-item>
                            <el-form-item label="首个橱窗位跳转链接">
                                <el-input v-model.trim="item.banner_link"></el-input>
                            </el-form-item>
                        </div>
                        <!--APP专享价板块（0.9新增）-->

                        <!--单/双商品板块（0.9新增））-->
                        <div v-if="item.type === 'single_product' && item.goods instanceof Array">
                            <div v-for="(good, index) in item.goods" :key="index" class="single-product">
                                <el-row>
                                    <el-col :span="16">
                                        <el-form-item label="样式类型">
                                            <el-select v-model="good.group" @change="changeSingleProduct($event, index, index)">
                                                <el-option label="单商品" value="1"></el-option>
                                                <el-option label="双商品" value="2"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="3" :offset="1">
                                        <el-button v-if="index === 0" type="primary" @click="singleProductAdd()">新增</el-button>
                                        <el-button v-if="index > 0" type="danger" @click="singleProductRemove(index)">删除</el-button>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="16">
                                        <el-form-item label="版块商品" :prop="'goods.' + index + '.sku'" :rules="[{validator: checkWid, trigger: 'blur'}]">
                                            <el-input placeholder="填写商品sku_仓id" v-model="good.sku" :disabled="isDisabledPublic"></el-input>
                                            <div class="color-silver">{{good.group === '1' ? '只可填写一个sku' : '只可填写两个sku,逗号隔开（必须同为普通商品、抢购商品或促销码商品）'}}</div>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="9">
                                        <el-form-item label="时间段" :prop="'goods.' + index + '.start_time'" :rules="[{ required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }]">
                                            <el-date-picker v-model="good.start_time" type="datetime" placeholder="选择开始时间" @change="handlePositionDateChange($event, index, 'start')"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7" class="item-end-time">
                                        <el-form-item label="-" :prop="'goods.' + index + '.end_time'" :rules="[{ required: true, type: 'date', message: '请选择结束时间', trigger: 'change' }]" label-width="20px">
                                            <el-date-picker v-model="good.end_time" type="datetime" placeholder="选择结束时间" @change="handlePositionDateChange($event, index, 'end')"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="16">
                                        <el-form-item label="一口价Coupon码">
                                            <el-input v-model="good.coupon"></el-input>
                                            <div class="color-silver">{{good.group === '1' ? '只可填写一个coupon码' : '只可填写两个coupon码,逗号隔开'}}</div>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row v-for="(item3, index3) in good.item" :key="index3">
                                    <el-col :span="12">
                                        <el-form-item label="角标文案">
                                            <el-input v-model="item3.label_desc"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="商品介绍文案">
                                            <el-input v-model="item3.intro_desc" type="textarea" :autosize="{ maxRows: 1}"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <!--单/双商品板块（0.9新增））-->

                        <div class="text-right">
                            <el-button type="primary" @click="editItem">保存</el-button>
                            <!--<el-button type="info" @click="cancelEdit">取消</el-button>-->
                            <el-button type="warning" @click="copyData('M')" :disabled="isDisabled" v-if="item.type !== 'single_product' && item.type !== 'app_exclusive' && currentPlat === 'PC'">一键复制到M端</el-button>
                            <router-link class="el-button" :to="{path: '/admin/special-position/lists?special_id=' + special_id + '&lang=' + this.currentLang}">返回版块列表</router-link>
                        </div>
                    </el-form>
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
                message: '该项不能为空',
                trigger: 'blur'
            }];

            let checkWid = (rule, val, callback) => {
                if (!val) {
                    return callback(new Error('该项不能为空'));
                }
                let exp = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+$/;
                let arr = val.split(',');
                let flag = true;
                for (let i in arr) {
                    if (!exp.test(arr[i])) {
                        flag = false;
                        break;
                    }
                }
                if (!flag) {
                    return callback(new Error('该项格式应为SKU_仓ID,多个以逗号隔开'));
                }
                callback();
            };

            return {
                checkWid: checkWid,
                required: required,
                self: this,
                isDisabled: false,
                isEdit: false,
                isDataLoading: false,
                currentPlat: '',
                currentLang: '',
                special_id: this.$route.query['special_id'],
                position_index: this.$route.query['position_index'],
                item: {
                    id: '0',
                    name: '',
                    nav_name: '',
                    header_code: '',
                    footer_code: '',
                    bottom_code: '',
                    view_more_link: '',
                    order: '',
                    shows: [],
                    type: '',
                    goods: '',
                    goodsListShow: {},
                    coupon: '',
                    price_label_id: '',
                    price_label_name: '',
                    expired_price_is_show: '',
                    price_label_start: '',
                    activity_id: '',
                    label_desc: '',
                    banner_image: '',
                    banner_link: '',
                    platform: '',
                    main_goods: '',
                    main_goods_coupon: '',
                    main_goods_intro_desc: '',
                    special_id: '',
                    position_index: '',
                    lang: '',
                    position_id: '',
                },
                langOpt: {},
                langText: {},
                specialLangOpt: {},
                positionTypes: {},
                positionRule: {
                    name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                    order: [{ required: true, type: 'integer', min: 0, message: '该项不能为空，且只能为不小于0的数字', trigger: 'blur' }],
                    goods: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                    type: [{ required: true, message: '请选择版块类型', trigger: 'change' }],
                    expired_price_is_show: [{type: 'number', required: true, message: '请选择如何显示价格', trigger: 'change' }],
                    coupon: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                },
                tempDataForm: {},
                platforms: {},
                goodsList: [],
                positionEmpty: {},
                firstStatus: false,
                mIsDisabled: false,
                isDisabledPublic: false, //多语言公共信息是否可编辑
                defaultLang: '',
                isDefaultLang: true, //是否默认语言
                addOrEdit: 0, // 0->add; 1->edit
                position_id_default: '', // 默认语言M版position_id
            };
        },
        computed: {
            ctrl() {
                if (this.$route.query['type'] === 'edit') {
                    return this.showAction_('admin/special-position/edit');
                } else {
                    return this.showAction_('admin/special-position/add');
                }
            },

            pipeOpt () {
                return this.$store.getters.getPipe.obj;
            }
        },
        created () {
            if (this.$route.query['type'] === 'add') {
                this.isDisabled = true;
                this.isEdit = true;
            } else {
                this.isDisabled = false;
                this.isEdit = false;
            }

            if (typeof this.$route.query['platform'] === 'undefined') {
                this.currentPlat = 'PC';
            } else {
                if (this.$route.query['platform'] === '1') {
                    this.currentPlat = 'PC';
                } else if (this.$route.query['platform'] === '2') {
                    this.currentPlat = 'M';
                }
            }


            this.positionEmpty = Object.assign({}, this.item);

            this.initData();
        },
        methods: {
            initData () {
                this.getLang();
                this.getSpecialLangOpt();
                this.getGoodsList();
                this.getSpecialPositionTypes();
                this.getPriceLabels();
            },

            async getData () {
                if (typeof this.special_id === 'undefined' || typeof this.position_index === 'undefined' || typeof this.currentLang === 'undefined') {
                    return;
                }
                let params = {
                    special_id: this.special_id,
                    position_index: this.position_index,
                    lang: this.currentLang,
                };
                this.isDataLoading = true;
                try {
                    this.$http.get('admin/special-position/detail', {params: params}).then(res => {
                        if (res.body.code === 0) {
                            let data = res.body.data;

                            // 如果没有数据就根据默认语言数据进行分发拷贝
                            if (Array.isArray(data.detail) && data.detail.length === 0) {
                                this.$alert('该语言下无版块信息，已将默认语言数据拷贝作为基础数据！', '提示信息', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        //console.log(action);
                                    }
                                });

                                this.$nextTick(() => {
                                    this.$refs['itemForm'].resetFields();

                                    this.tempDataForm = JSON.parse(JSON.stringify(data.default));
                                    this.item = data.default[this.currentPlat];

                                    this.item.shows = (this.item.shows == '') ? [] : this.item.shows.split(',');
                                    this.filterPriceLabels(this.item.type);
                                    this.dateFormat(this.item);


                                    // M端若无数据，则不可切换M端选项卡
                                    typeof this.tempDataForm['M'] === 'undefined' ? this.mIsDisabled = true : this.mIsDisabled = false;
                                    // PC端若无数据，则一键复制按钮不可用
                                    typeof this.tempDataForm['PC'] === 'undefined' ? this.isDisabled = true : this.isDisabled = false;

                                    this.addOrEdit = 0; // 走新增接口
                                    this.isDefaultLang = false;
                                    this.isDisabledPublic = true;

                                    // 如果默认语言没有M数据，则不可以在多语言下面添加M数据
                                    if (typeof this.tempDataForm['M'] === 'undefined') {
                                        this.position_id_default = '';
                                    } else {
                                        this.position_id_default = this.tempDataForm['M'].position_id;
                                    }

                                });

                            } else {
                                this.tempDataForm = JSON.parse(JSON.stringify(data.detail));
                                this.item = data.detail[this.currentPlat];

                                this.item.shows = (this.item.shows == '') ? [] : this.item.shows.split(',');
                                this.filterPriceLabels(this.item.type);
                                this.dateFormat(this.item);


                                // M端若无数据，则不可切换M端选项卡
                                typeof this.tempDataForm['M'] === 'undefined' ? this.mIsDisabled = true : this.mIsDisabled = false;
                                // PC端若无数据，则一键复制按钮不可用
                                typeof this.tempDataForm['PC'] === 'undefined' ? this.isDisabled = true : this.isDisabled = false;

                                // 判断是否默认语言数据
                                if (this.currentLang === data.default[this.currentPlat].lang) {
                                    this.isDisabledPublic = false;
                                    this.isDefaultLang = true;
                                } else {
                                    this.isDisabledPublic = true;
                                    this.isDefaultLang = false;
                                }

                                this.isEdit = false;
                                this.addOrEdit = 1; // 走编辑接口

                                // 如果默认语言没有M数据，则不可以在多语言下面添加M数据
                                if (typeof data.default['M'] === 'undefined') {
                                    this.position_id_default = '';
                                } else {
                                    this.position_id_default = data.default['M'].position_id;
                                }
                            }
                        }
                    });

                } finally {
                    this.isDataLoading = false;
                }
            },

            // 转化日期格式
            dateFormat (data) {

                // 多时段板块 || 多商品版块 || 单/双商品板块
                if ((data.type === 'multiple_time_rush_to_purchase' || data.type === 'multiple_goods_rush_to_purchase' || data.type === 'single_product') && Array.isArray(data.goods)) {
                    data.goods.forEach(item => {
                        if (item.start_time && item.end_time) {
                            item.start_time = new Date(item.start_time * 1000);
                            item.end_time = new Date(item.end_time * 1000);
                        }
                    })
                }

                // 价格标签生效时间
                if (data.price_label_start) {
                    data.price_label_start = new Date(data.price_label_start * 1000);
                }

            },

            //
            getLang () {
                // 语言下拉
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code === 0) {
                        this.langOpt = res.body.data;
                        let obj = {};
                        this.langOpt.forEach(item => {
                            obj[item.language_en] = item.language_ch;
                        });
                        this.$set(this, 'langText', obj);
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

            // 获取板块所属专题的多语言
            getSpecialLangOpt () {
                this.$http.get('admin/special-position/lang-lists',{params: {special_id: this.special_id}}).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        this.specialLangOpt = data;

                        // 如果是新增版块，语言选项卡选中默认语言
                        if (this.isEdit) {
                            this.specialLangOpt.forEach(item => {
                                this.currentLang = item.default_lang;
                                this.defaultLang = item.default_lang;
                                return;
                            });
                        } else {
                            this.currentLang = this.$route.query['lang'];
                        }

                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            getGoodsList () {
                this.$http.get('admin/special-position/public-get-shows').then(res => {
                    this.goodsList = res.body.data;
                    this.item.goodsListShow = this.goodsList;
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
                        let data = res.body.data;
                        let temp = [];
                        data.forEach(item => {
                            if (item.type == 1) {
                                temp.push(item);
                            }
                        });
                        this.priceLabels = temp;
                    }
                });
            },

            /**
             * 根据版块类型过滤显示设置
             * @param type  版块类型
             */
            filterPriceLabels (type) {
                this.item.goodsListShow = {};

                for (let key in this.goodsList) {
                    // 加价购版块
                    if (type === 'increase_purchase' && key !== 'show-label') {
                        continue;
                    }
                    // 普通商品版块/搭售版块
                    if ((type === 'normal' || type === 'match_sell') && (key !== 'show-promote-icon' && key !== 'show-market-price')) {
                        continue;
                    }
                    // 多时段抢购板块/多商品版块/抢购版块
                    if ((type ==='multiple_time_rush_to_purchase' || type === 'multiple_goods_rush_to_purchase' || type === 'rush_to_purchase') && (key === 'show-label' || key === 'show-limit-quantity' || key === 'show-limit-time' || key === 'show-coupon-time' || key === 'show-coupon-quantity')) {
                        continue;
                    }
                    // APP专享价板块
                    if(type === 'app_exclusive'){
                        break;
                    }
                    // 单/双商品板块
                    if(type === 'single_product' && key !== 'show-label' && key !== 'show-market-price' && key !== 'show-limit-quantity' && key !== 'show-limit-time'){
                        continue;
                    }
                    // 促销码版块
                    if (type === 'promotion_code' && (key !== 'show-promote-icon' && key !== 'show-market-price' && key !== 'show-coupon-time' && key !== 'show-coupon-quantity')) {    //key === 'show-coupon-time' || key === 'show-coupon-quantity'
                        continue;
                    }

                    this.item.goodsListShow[key] = this.goodsList[key];
                }
            },

            editItem () {
                let item = this.item;
                let src = '';
                let params = null;
                let hasError = false;

                this.$refs['itemForm'].validate(valid => {
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
                        if (!el.accessories_sku && !el.buy_gift_sku) {
                            this.$message.error('请输入SKU');
                            hasError = true;
                            return true;
                        }
                    }));
                }

                // 多时段板块 || 多商品版块 || 单/双商品板块
                else if (item.type === 'multiple_time_rush_to_purchase' || item.type === 'multiple_goods_rush_to_purchase' || item.type === 'single_product') {
                    Array.isArray(item.goods) && item.goods.forEach(item => {
                        item.start_timestamp = this.timestamp(item.start_time);
                        item.end_timestamp = this.timestamp(item.end_time);
                    });
                }

                if (hasError) {
                    return;
                }

                params = JSON.parse(JSON.stringify(item));
                params.shows = (params.shows == []) ? '' : params.shows.join(',');

                src = 'admin/special-position/add';
                if (this.addOrEdit === 1) {
                    src = 'admin/special-position/edit';
                }

                params.price_label_id && this.priceLabels.some(item => {
                    if (item.labelId == params.price_label_id) {
                        params.price_label_name = item.name;
                        params.price_label_type = item.type;
                        return true;
                    }
                });

                //平台值
                if (this.currentPlat === 'PC') {
                    params.platform = 1;
                } else if (this.currentPlat === 'M') {
                    params.platform = 2;
                }
                params.position_index = typeof this.item.position_index === 'undefined' ? '' : this.item.position_index;

                // 多时段板块 || 多商品版块 || 单/双商品板块
                if (item.type === 'multiple_time_rush_to_purchase' || item.type === 'multiple_goods_rush_to_purchase' || item.type === 'single_product') {
                    Array.isArray(params.goods) && params.goods.forEach(item => {
                        item.sku = item.sku || '';
                        item.start_time = item.start_timestamp;
                        item.end_time = item.end_timestamp;
                        delete item.start_timestamp;
                        delete item.end_timestamp;
                        delete item.goods;
                    });
                }

                if (params.price_label_start) {
                    params.price_label_start = this.timeZone_(new Date(params.price_label_start), this.$store.getters.getTimeZone);
                }

                params.lang = this.currentLang;
                params.special_id = this.special_id;

                delete params.goodsListShow;

                //console.log(params);
                //return false;

                this.isDataLoading = true;

                this.$http.post(src, params).then(res => {
                    this.isDataLoading = false;
                    if (res.body.code === 0) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });

                        let data = res.body.data;
                        this.position_index = data[this.currentPlat].position_index;
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                        this.isDataLoading = false;
                    }
                }, (err) => {
                    this.isDataLoading = false;
                    this.$message.error(err.body.message);
                });
            },

            // 选择版块类型
            handlePositionTypeChange (val) {
                // 第一次加载的时候不去改变this.item
                if(this.firstStatus === false && this.$route.query['type'] === 'edit'){
                    this.firstStatus = true;
                    return;
                }

                this.item.type = val;
                let item = this.item;
                item.shows = [];

                this.filterPriceLabels(val);

                // 搭售板块
                if (val === 'match_sell') {
                    item.goods = [{
                        sku: '',
                        accessories_sku: '',
                        buy_gift_sku: '',
                    }];
                } else if (val === 'multiple_time_rush_to_purchase') {  //多时段板块
                    item.goods = [
                        {
                            group: '',
                            start_time: '',
                            end_time: '',
                            sku: '',
                        },
                    ];
                } else if (val === 'multiple_goods_rush_to_purchase') { //多商品板块
                    item.goods = [{
                        group: '',
                        group_pic: '',
                        start_time: '',
                        end_time: '',
                        group_brand: '',
                        sku: '',
                        coupon: '',
                        coupon_banner: '',
                        coupon_url: '',
                    }]
                } else if (val === 'single_product') {  //单/双商品板块（0.9新增）
                    item.goods = [{
                        group: '1',
                        start_time: '',
                        end_time: '',
                        sku: '',
                        coupon: '',
                        item: [{
                            label_desc: '',
                            intro_desc: '',
                        }]
                    }]
                } else {
                    item.goods = '';
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
            handlePositionDateChange (val, index, type) {
                let item = this.item;
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

                //多时段抢购版块
                if(item.type === 'multiple_time_rush_to_purchase'){
                    // 选择结束时间时同时设置为下一个时间段的开始时间
                    if (!isStart && index < goods.length - 1) {
                        goods[index + 1].start_time = goods[index].end_time;
                    }
                }
            },

            // 多时段板块新增时间段
            handlePositionAddTimeClick () {
                let item = this.item;
                let startTime = item.goods[item.goods.length - 1].end_time || '';
                item.goods.push({ group: '', start_time: startTime, end_time: '', sku: '' });
            },

            // 多时段板块删除时间段
            handlePositionDelTimeClick (index) {
                this.$confirm('确定删除吗?', '提示', { type: 'warning' }).then(() => {
                    this.item.goods.splice(index, 1);
                }).catch(() => {

                });
            },

            // 多商品新增
            multipleGoodsAdd() {
                let item = this.item;
                let startTime = item.goods[item.goods.length - 1].end_time || '';
                item.goods.push(
                    {
                        group: '',
                        group_pic: '',
                        start_time: startTime,
                        end_time: '',
                        group_brand: '',
                        sku: '',
                        coupon: '',
                        coupon_banner: '',
                        coupon_url: '',
                    }
                );
            },

            // 多商品删除
            multipleGoodsRemove(index) {
                this.$confirm('确定删除吗?', '提示', { type: 'warning' }).then(() => {
                    this.item.goods.splice(index, 1);
                }).catch(() => {

                });
            },

            // 增减搭售商品数
            addMatchGoods (arr) {
                arr.push({
                    sku: '',
                    accessories_sku: '',
                    buy_gift_sku: '',
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

            // 选择价格标签时修改时间
            changeTag(val, item) {
                if (!val) {
                    item.price_label_start = '';
                }
            },

            //
            changeSingleProduct(val, index) {
                let item = this.item;
                //单商品
                if(val === '1' && item.goods[index].item.length > 1){
                    item.goods[index].item.splice(1);
                }
                //双商品
                if(val === '2'){
                    item.goods[index].item.push({
                        label_desc: '',
                        intro_desc: '',
                    });
                }
            },

            // 单/双商品板块新增
            singleProductAdd () {
                this.item.goods.push({
                    group: '1',
                    start_time: '',
                    end_time: '',
                    sku: '',
                    coupon: '',
                    item: [{
                        label_desc: '',
                        intro_desc: '',
                    }]
                });
            },

            // 单/双商品板块删除
            singleProductRemove(index) {
                this.$confirm('确定删除吗?', '提示', { type: 'warning' }).then(() => {
                    this.item.goods.splice(index, 1);
                });
            },

            //取消编辑
            cancelEdit() {
                if (this.isEdit) {
                    this.$refs['itemForm'].resetFields();
                } else {
                    this.togglePlat({name: this.currentPlat});
                }
            },

            goBack() {
                this.$router.push({
                    name: 'topic_special_position_list',
                })
            },

            //切换平台
            togglePlat (val) {
                // 如果是新增则不进行操作
                if (this.isEdit === true) {
                    return;
                }
                let data = JSON.parse(JSON.stringify(this.tempDataForm));

                if (typeof data[val.name] === 'undefined') {

                    this.$refs['itemForm'].resetFields();
                    this.item = this.positionEmpty;
                    if (this.isDefaultLang) {
                        this.addOrEdit = 0; // 走新增接口
                    }

                    // 如果PC端无数据，则去M端取，其他同理
                    if (typeof data['PC'] === 'undefined') {
                        this.item.type = data['M'].type;
                        this.item.order = data['M'].order;
                    } else if (typeof data['M'] === 'undefined') {
                        this.item.type = data['PC'].type;
                        this.item.order = data['PC'].order;
                    }

                    this.handlePositionTypeChange(this.item.type);
                } else {
                    this.item = data[val.name];

                    this.item.shows = (this.item.shows == '') ? [] : this.item.shows.split(',');
                    this.filterPriceLabels(this.item.type);
                    this.dateFormat(this.item);

                    if (this.isDefaultLang) {
                        this.addOrEdit = 1; // 走编辑接口
                    }

                }
            },

            //一键复制
            copyData (plat) {
                let data = JSON.parse(JSON.stringify(this.tempDataForm));

                // 如果是默认语言的一键复制，则全部数据复制
                if (this.isDefaultLang) {

                    //如果无数据，则清空id，走新增接口，否则走修改接口
                    if (typeof data[plat] === 'undefined') {
                        this.$alert('已将PC端数据复制到'+ plat +'端', '提示信息', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.currentPlat = plat;
                                this.item = data['PC'];

                                this.item.shows = (this.item.shows == '') ? [] : this.item.shows.split(',');
                                this.filterPriceLabels(this.item.type);
                                this.dateFormat(this.item);

                                this.addOrEdit = 0;
                            }
                        });
                    } else {
                        this.$alert('已将PC端数据复制到'+ plat +'端', '提示信息', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.currentPlat = plat;
                                this.item = data['PC'];

                                this.item.shows = (this.item.shows == '') ? [] : this.item.shows.split(',');
                                this.filterPriceLabels(this.item.type);
                                this.dateFormat(this.item);

                                this.item.id = data[plat].id;
                                this.addOrEdit = 1;
                            }
                        });
                    }

                } else {    //非默认语言复制

                    if (this.position_id_default === '') {
                        this.$alert('默认语言没有M数据，不允许新增该多语言下的M数据！');
                        return;
                    }
                    //如果无数据，则清空id，走新增接口，否则走修改接口
                    if (typeof data[plat] === 'undefined') {
                        this.$alert('已将PC端数据复制到'+ plat +'端', '提示信息', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.currentPlat = plat;
                                this.item = data['PC'];

                                this.item.shows = (this.item.shows == '') ? [] : this.item.shows.split(',');
                                this.filterPriceLabels(this.item.type);
                                this.dateFormat(this.item);

                                this.item.position_id = this.position_id_default;
                                this.addOrEdit = 0;
                            }
                        });
                    } else {
                        this.$alert('已将PC端数据复制到'+ plat +'端', '提示信息', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.currentPlat = plat;
                                this.item = data['PC'];

                                this.item.shows = (this.item.shows == '') ? [] : this.item.shows.split(',');
                                this.filterPriceLabels(this.item.type);
                                this.dateFormat(this.item);

                                this.item.id = data[plat].id;
                                this.addOrEdit = 1;
                            }
                        });
                    }

                }

            },

            // 切换语言
            toggleLang () {
                this.currentPlat = 'PC';
                this.getData();
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
        .w-230 { width: 230px !important; }
        .w-100p { width: 100% !important; }
        .p10{ padding: 10px; }
        .mr20{margin-right: 20px;}
        .mb15{margin-bottom: 15px;}

        .inline-block { display: inline-block; }

        .box {border: 1px solid #e0e6ed;padding: 15px;border-radius: 5px;}
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
            margin-top: 20px;
        }

        .match-sell:not(:first-child) {
            margin-top: 20px;
        }

        .separation-line{
            margin: 35px 0;
            border: 1px solid gainsboro;
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
