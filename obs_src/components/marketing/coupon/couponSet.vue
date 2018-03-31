<!-- 设置coupon -->
<template>
    <div @click= "closeTree($event)" class="coupon-set">
        <div class="el-container" v-loading="tableLoading">
            <el-row>
                <el-col :span="14">
                    <el-form label-width="140px" ref="searchForm" :model="option" class="coupon-edit-form">
                        <el-form-item label="Coupon码模板" prop="templateId" :rules="ruleOpt.templateId">
                            <el-select filterable :disabled="editable || editPage" v-model="option.templateId" placeholder="请选择" @change="changeTemp">
                                <el-option v-for="item in tempOpt" :key="item.id" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Coupon码" v-if="itemOpt.code" prop="code" :rules="ruleOpt.code">
                            <el-row>
                                <el-col :span="12">
                                    <el-input :disabled="(editable || editPage) && !copy || this.isSys" v-model.trim="option.code"></el-input>
                                </el-col>
                                <el-col :span="10" :offset="2">
                                    <el-button v-if="!this.isSys" :disabled="(editable || editPage) && !copy" type="primary" @click="exportCoupon">自动生成</el-button>
                                    <el-button v-if="!this.isSys" :disabled="(editable || editPage) && !copy" type="primary" @click="checkCoupon">查看</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="coupon名称" prop="couponName" :rules="ruleOpt.couponName" v-if="itemOpt.couponName">
                            <el-input v-model="option.couponName" :disabled="(editable || editPage) && !copy"></el-input>
                        </el-form-item>
                        <el-form-item label="优惠形式" v-if="itemOpt.discountForm" required prop="discountForm" :rules="ruleOpt.discountForm">
                            <el-radio-group v-model="option.discountForm">
                                <el-radio :disabled="true" label="1">
                                    <span v-if="option.type == '8' || option.type == 12">金额封顶</span>
                                    <span v-else>减免金额</span>
                                </el-radio>
                                <el-radio :disabled="true" label="2" v-if="option.type == '8' || option.type == 12">金额不封顶</el-radio>
                                <el-radio :disabled="true" label="3">百分比减免</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="满额条件" v-if="itemOpt.fullCondition" required prop="fullCondition" :rules="ruleOpt.fullCondition">
                            <el-radio-group v-model="option.fullCondition">
                                <el-radio label="1" :disabled="true">金额</el-radio>
                                <el-radio label="2" :disabled="true">数量</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="(option.type == 10 || option.type == 14) ? '一口价' : '直减'" v-if="option.type == 9 || option.type == 13 || option.type == 10 || option.type == 14" required prop="strategys" :rules="ruleOpt.strategys">
                            <el-row>
                                <el-col :span="16"><el-input :disabled="editable" v-model.trim="option.strategys"></el-input></el-col>
                                <el-col :span="1" v-if="option.discountForm == 3">%</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="coupon减免" v-if="(option.type == 8 || option.type == 12) && option.discountForm != 2" :rules="ruleOpt.strategys" prop="strategys">
                            <template v-for="item in option.strategys">
                                <el-row class="item-arr">
                                    <el-col :span="2" class="text-center">满</el-col>
                                    <el-col :span="6"><el-input :disabled="editable" v-model.trim="item.strategys1"></el-input></el-col>
                                    <el-col :span="1" class="text-center">
                                        <span v-if="option.fullCondition == 2">件</span>
                                        减
                                    </el-col>
                                    <el-col :span="6"><el-input :disabled="editable" v-model.trim="item.strategys2"></el-input></el-col>
                                    <el-col :span="8" class="text-center">
                                        <el-button :disabled="editable" type="primary" icon="plus" @click="addItem"></el-button>
                                        <el-button :disabled="editable" type="danger" icon="minus" @click="removeItem"></el-button>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-form-item>
                        <el-form-item label="coupon减免" v-if="(option.type == 8 || option.type == 12) && option.discountForm == 2" required prop="strategys" :rules="ruleOpt.strategys">
                            <el-row>
                                <el-col :span="2" class="text-center">每满</el-col>
                                <el-col :span="8"><el-input :disabled="editable" v-model.trim="option.strategys.strategys1"></el-input></el-col>
                                <el-col :span="1" class="text-center">
                                    <span v-if="option.fullCondition == 2">件</span>
                                    减
                                </el-col>
                                <el-col :span="8"><el-input :disabled="editable" v-model.trim="option.strategys.strategys2"></el-input></el-col>
                                <el-col :span="1" class="text-center" v-if="option.discountForm == 3">%</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="coupon减免" v-if="option.type == 11 || option.type == 15" required prop="strategys" :rules="ruleOpt.strategys">
                            <el-row>
                                <el-col :span="2" class="text-center">商品满</el-col>
                                <el-col :span="8"><el-input :disabled="editable" v-model.trim="option.strategys.strategys1"></el-input></el-col>
                                <el-col :span="1" class="text-center">
                                    <span v-if="option.fullCondition == 2">件</span>
                                    减
                                </el-col>
                                <el-col :span="8"><el-input :disabled="editable" v-model.trim="option.strategys.strategys2"></el-input></el-col>
                                <el-col :span="1" class="text-center" v-if="option.discountForm == 3">%</el-col>
                                <el-col :span="2" class="text-center">运费</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="适用平台" v-if="itemOpt.platforms" prop="platforms" :rules="ruleOpt.platforms">
                            <el-checkbox-group v-model="terminal">
                                <el-checkbox v-for="item in terminalOpt" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
<!--                             <el-checkbox-group v-model="option.platforms">
                                <el-checkbox :disabled="editable" label="1">PC</el-checkbox>
                                <el-checkbox :disabled="editable" label="2">M端</el-checkbox>
                                <el-checkbox :disabled="editable" label="3">IOS</el-checkbox>
                                <el-checkbox :disabled="editable" label="4">ANDROID</el-checkbox>
                                <el-checkbox :disabled="editable" label="5">PAD</el-checkbox>
                            </el-checkbox-group> -->
                        </el-form-item>
                        <el-form-item label="生效渠道" prop="pipelineCode" :rules="ruleOpt.pipelineCode">
                            <el-select :disabled="editable" multiple clearable filterable v-model="option.pipelineCode" @change="changePipe">
                                <el-option v-if="option.pipelineCode.length !== pipeList.length" label="全选" value="checkAll"></el-option>
                                <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="适用店铺" prop="shopCode" :rules="ruleOpt.shopCode">
                            <el-select :disabled="editable" multiple clearable filterable v-model="option.shopCode" @change="changeStroe">
                                <el-option v-if="option.shopCode.length !== shopList.length" label="全选" value="checkAll"></el-option>
                                <el-option v-for="(item, index) in storeOpt" :key="index" :value="index" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生效时间" v-if="(itemOpt.times && !isSys) || (isSys && editPage)" prop="times" :rules="ruleOpt.times">
                            <el-date-picker :disabled="editable" v-model="option.times" type="datetimerange" :editable="false" @change="checkDate_($event, option.times)"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="生效天数" v-if="isSys && !editPage" prop="times" :rules="ruleOpt.times" class="time-set">
                            <div class="item">
                                <el-radio v-model="option.dateType" label="1" @change.native="changeDateType($event)">生效时间段</el-radio>
                                <el-date-picker :disabled="editable || option.dateType == 2" v-model="option.times" type="datetimerange" :editable="false" @change="checkDate_($event, option.times)"></el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="isSys && !editPage" prop="effectDays" :rules="ruleOpt.effectDays" class="time-set">
                            <div class="item">
                                <el-radio v-model="option.dateType" label="2" @change.native="changeDateType($event)">生效时长</el-radio>
                                <el-input :disabled="editable || option.dateType == 1" v-model.trim="option.effectDays" placeholder="天数"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="总使用次数" v-if="itemOpt.limitCount" prop="limitCount" :rules="ruleOpt.limitCount">
                            <el-input :disabled="editable" v-model.trim="option.limitCount"></el-input>
                        </el-form-item>
                        <el-form-item label="单用户使用次数" v-if="itemOpt.userLimitCount" prop="userLimitCount" :rules="ruleOpt.userLimitCount">
                            <el-input :disabled="editable" v-model.trim="option.userLimitCount"></el-input>
                        </el-form-item>
                        <el-form-item label="绑定用户" v-if="itemOpt.userIds" prop="userIds" :rules="ruleOpt.userIds">
                            <el-input :disabled="editable" v-model.trim="option.userIds"></el-input>
                        </el-form-item>
                        <el-form-item class="coupon-select" label="适用分类" v-if="itemOpt.categorys" prop="categorys" :rules="ruleOpt.categorys">
                            <el-input :disabled="editable" v-model.trim="option.categorys" @click.native="showTree(editable)" class="js_input"></el-input>
                            <el-tree v-show="treeFlag" :data="treeData" :props="treeProps" ref="tree" node-key="id" show-checkbox @check-change="changeTree"></el-tree>
                        </el-form-item>
                        <el-form-item label="适用国家" v-if="itemOpt.country" prop="country" :rules="ruleOpt.country" class="country-select">
                            <el-select filterable :disabled="editable" multiple v-model="option.country" placeholder="请选择" @change="changeCountry">
                                 <el-option v-if="option.country.length !== countryList.length" label="全选" value="checkAll"></el-option>
                                <el-option v-for="item in countryOpt" :key="item.countryCode" :value="item.countryCode" :label="item.countryName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="适用物流" v-if="itemOpt.logisticsCode" prop="logisticsCode" :rules="ruleOpt.logisticsCode">
                            <el-select filterable :disabled="editable" multiple v-model="option.logisticsCode" placeholder="若无数据请选择其他国家">
                                <el-option v-for="item in logOpt" :key="item.id" :value="item.logisticsCode" :label="item.logisticsName"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="适用仓库" v-if="itemOpt.warehouses" prop="warehouses" :rules="ruleOpt.warehouses">
                            <el-select filterable :disabled="editable" multiple v-model="option.warehouses" placeholder="请选择">
                                <el-option v-for="item in wareOpt" :key="item.virWhCode" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="适用品牌" v-if="itemOpt.brands" prop="brands" :rules="ruleOpt.brands">
                            <el-select filterable :disabled="editable" multiple v-model="option.brands" placeholder="请选择">
                                <el-option v-for="item in brandOpt" :key="item.brandCode" :value="item.brandCode" :label="item.brandTitle"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="适用SKU" v-if="itemOpt.includeGoods" prop="includeGoods" :rules="ruleOpt.includeGoods">
                            <el-input :disabled="editable" v-model.trim="option.includeGoods"></el-input>
                        </el-form-item>
                        <el-form-item label="不适用SKU" v-if="itemOpt.excludeGoods" prop="excludeGoods" :rules="ruleOpt.excludeGoods">
                            <el-input :disabled="editable" v-model.trim="option.excludeGoods"></el-input>
                        </el-form-item>
                        <el-form-item label="同款生效" v-if="itemOpt.isSameStyle" prop="isSameStyle" :rules="ruleOpt.isSameStyle">
                            <el-radio-group v-model="option.isSameStyle">
                                <el-radio :disabled="editable" label="1">是</el-radio>
                                <el-radio :disabled="editable" label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="会员等级" v-if="itemOpt.memberGrade" prop="memberGrade" :rules="ruleOpt.memberGrade">
                            <el-form-item>
                                <el-select filterable :disabled="editable" multiple v-model="option.memberGrade" multiple placeholder="请选择">
                                    <el-option v-for="item in levelOpt" :key="item.id" :value="String(item.id)" :label="item.levelName"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="价格标签" v-if="itemOpt.priceType" prop="priceType" :rules="ruleOpt.priceType">
                            <el-form-item>
                                <el-select filterable :disabled="editable" multiple v-model="option.priceType" multiple placeholder="请选择">
                                    <el-option value="-1" label="本店售价"></el-option>
                                    <el-option-group v-for="(group, index) in priceOpt" :key="group.index" :label="group.name">
                                        <el-option v-for="item in group.memLabels" :key="item.id" :label="item.name" :value="String(item.labelId)">
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>
                        </el-form-item>
<!--                         <el-form-item label="coupon限价" v-if="itemOpt.isConfine" prop="isConfine" :rules="ruleOpt.isConfine">
                            <el-form-item>
                                <el-radio-group v-model="option.isConfine">
                                    <el-radio :disabled="editable" label="1">是</el-radio>
                                    <el-radio :disabled="editable" label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form-item> -->
                        <el-form-item label="仅新用户可购买" v-if="itemOpt.newUser" prop="newUser" :rules="ruleOpt.newUser">
                           <el-form-item>
                                <el-radio-group v-model="option.newUser">
                                    <el-radio :disabled="editable" label="1">是</el-radio>
                                    <el-radio :disabled="editable" label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="限制购买数量" v-if="itemOpt.goodLimitCount" prop="goodLimitCount" :rules="ruleOpt.goodLimitCount">
                            <el-input :disabled="editable" v-model.trim="option.goodLimitCount"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" v-if="itemOpt.remark" prop="remark" :rules="ruleOpt.remark">
                            <el-input :disabled="editable" v-model.trim="option.remark"></el-input>
                        </el-form-item>
                        <el-form-item label="单用户可领取数" v-if="itemOpt.grantUserCount && setPage" prop="grantUserCount" :rules="ruleOpt.grantUserCount">
                            <el-input :disabled="editable" v-model.trim="option.grantUserCount"></el-input>
                        </el-form-item>
                        <el-form-item label="发放总数" v-if="itemOpt.grantTotalCount && setPage" prop="grantTotalCount" :rules="ruleOpt.grantTotalCount">
                            <el-input :disabled="editable" v-model.trim="option.grantTotalCount"></el-input>
                        </el-form-item>
                        <el-form-item v-if="itemOpt.siteLink" prop="siteLink" :rules="ruleOpt.siteLink" label-width="0">
                            <template v-for="item in option.siteLink">
                                <el-form-item :label="item.paramId" class="webLink-item">
                                    <el-input v-if="item.paramId === 'webLink' || item.paramId === 'wapLink'" :disabled="editable" v-model="item.paramValue"></el-input>
                                    <el-autocomplete v-else :disabled="editable" v-model="item.paramValue" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect($event, item)" icon="circle-close" :on-icon-click="handleIconClick(item)"></el-autocomplete>
                                </el-form-item>
                            </template>
                        </el-form-item>
                        <div class="text-center">
                            <el-button :disabled="editable" type="info" @click="editable = false" v-show="editable">编辑</el-button>
                            <el-button v-if="editControl" :disabled="editable || postLoading" type="primary" @click="postAdd" v-loading="postLoading">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let self = this;
        let editPage = Boolean(this.$route.query.code);
        let setPage = typeof(this.$route.query.code) == 'undefined';

        let checkInt = function(rule, value, callback) {
            if (value === '' || (Number.isInteger(value * 1) && Number(value) > 0)) {
                callback();
            } else {
                callback(new Error('请输入正整数'));
            }
        }

        let checkNumber = function(rule, value, callback) {
            if (value === '' || (Number.isInteger(value * 1))) {
                callback();
            } else {
                callback(new Error('请输入整数'));
            }
        }

        let checkStrategys = function(rule, value, callback) {
            if (value instanceof Array) {
                value.forEach(item => {
                    if (Number(item.strategys1) >= 0 && Number(item.strategys2) > 0) {

                    } else {
                        callback(new Error('满额大于等于0, 减免大于0'));
                    }
                });
            } else if (value instanceof Object) {
                if (self.option.type == 11 || self.option.type == 15) {
                    if ((value.strategys1 === '0' || Number(value.strategys1) > 0) && Number(value.strategys2) > 0) {

                    } else {
                        callback(new Error('满额大于等于0,减免大于0'));
                    }
                } else {
                    if (Number(value.strategys1) > 0 && Number(value.strategys2) > 0) {

                    } else {
                        callback(new Error('参数必需为正数'));
                    }
                }
            } else {
                if (Number(value) > 0) {
                } else {
                    callback(new Error('参数必需为正数'));
                }
            }

            callback();
        }

        let checkDateArr = (rule, value, callback) => {
            if ((Boolean(value[0]) && Boolean(value[1])) || self.option.dateType == 2) {
                callback();
            } else {
                callback('该项不能为空')
            }
        }

        let checkDays = function(rule, value, callback) {
            if ((Number.isInteger(value * 1) && Number(value) > 0) || self.option.dateType == 1) {
                callback();
            } else {
                callback(new Error('请输入正整数'));
            }
        }

        return {
            terminal: [],
            checkDays: checkDays,
            checkDateArr: checkDateArr,
            checkInt: checkInt,
            checkNumber: checkNumber,
            checkStrategys: checkStrategys,
            tableLoading: false,
            postLoading: false,
            option: {
                templateId: '',
                code: '',
                strategys: '',
                platforms: [],
                limitCount: '',
                userLimitCount: '',
                userIds: '',
                dateType: '1',
                memberGrade: [],
                warehouses: [],
                brands: [],
                categorys: '',
                includeGoods: '',
                excludeGoods: '',
                isSameStyle: '',
                times: [],
                startTime: '',
                endTime: '',
                remark: '',
                country: [],
                logisticsCode: [],
                type: '',
                effectDays: '',
                priceType: [],
                // isConfine: '',
                newUser: '',
                goodLimitCount: '',
                couponName: '',
                discountForm: '',
                fullCondition: '',
                siteLink: [{
                    paramId: 'webLink',
                    paramValue: '',
                },{
                    paramId: 'wapLink',
                    paramValue: '',
                },{
                    paramId: 'androidLink',
                    paramValue: '',
                },{
                    paramId: 'iosLink',
                    paramValue: '',
                },{
                    paramId: 'padLink',
                    paramValue: '',
                }],
                grantUserCount: '',
                grantTotalCount: '',
                pipelineCode: [],
                shopCode: '',
                // couponConditons: '',
            },
            defaultOption: {},
            self: this,
            tableData: [],
            tempOpt: [],
            memberOpt: [],
            wareOpt: [],
            brandOpt: [],
            itemOpt: {},
            logOpt: [],
            levelOpt: [],
            priceOpt: [],
            countryOpt: [],
            treeFlag: false,
            treeProps: {
                children: 'subCategoryList',
                label: 'categoryName'
            },
            treeData: [],
            editable: this.$route.query.editable == '1',
            copy: this.$route.query.copy == '1',
            editPage: editPage,
            setPage: setPage,
            isSys: false,
            ids: '',
            ruleOpt: {
                templateId: [],
                strategys: [{validator: checkStrategys}],
                code: [],
                platforms: [],
                times: [{ validator: checkDateArr, message: '该项不能为空'}],
                effectDays: [{validator: checkDays}],
                limitCount: [{validator: checkNumber}],
                userLimitCount: [{validator: checkNumber}],
                userIds: [],
                categorys: [],
                country: [],
                logisticsCode: [],
                warehouses: [],
                brands: [],
                includeGoods: [],
                excludeGoods: [],
                isSameStyle: [],
                remark: [],
                memberGrade: [],
                priceType: [],
                // isConfine: [],
                newUser: [],
                goodLimitCount: [],
                couponName: [],
                discountForm: [],
                fullCondition: [],
                siteLink: [],
                grantUserCount: [{validator: checkInt}],
                grantTotalCount: [{validator: checkInt}],
                pipelineCode: [],
                shopCode: [],
                // couponConditons: [],
            },
            deeplinks: [],
            pipeList: [],
            shopList: [],
            countryList: [],
        };
    },
    computed: {
        pipeOpt () {
            let obj = this.$store.getters.getPipe.obj;
            if (obj instanceof Object) {
                this.pipeList = Object.keys(obj);
            }
            return obj;
        },
        storeOpt () {
            let obj = this.$store.getters.getStore.obj;
            if (obj instanceof Object) {
                this.shopList = Object.keys(obj);
            }
             return obj;
        },
        terminalOpt() {
            return this.$store.getters.getTerminal.opt;
        },
        terminalMap() {
            return this.$store.getters.getTerminal.map;
        }
    },
    watch: {
        terminal(val,oldVal) {
            let tempArr = [],
                temp = [];
            val.forEach(item => {
                temp = this.terminalMap.filter(e => e.terminal_id == item).map(el => el.platform_id);
                tempArr = tempArr.concat(temp);
            });
            this.option.platforms = tempArr.sort();
        }
    },
    created () {
        this.deeplinks = this.$store.getters.getDeeplink;
        this.defaultOption = JSON.parse(JSON.stringify(this.option));
        this.getTempOpt();
    },
    methods: {
        countForm(obj) {
            if (obj.type == 9 || obj.type == 10 || obj.type == 13 || obj.type == 14) {
                // 直减 一口价
                return 1;
            } else if (obj.discountForm != 2 && (obj.type == 8 || obj.type == 12)) {
                // 满减封顶
                return 2;
            } else {
                // 其他
                return 3;
            }
        },
        editControl () {
            if (this.editPage) {
                return this.showAction_('promotion/coupon/edit');
            } else {
                return this.showAction_('promotion/coupon/add');
            }
        },
        getData () {
            let self = this;
            if (this.editPage) {
               let params = {};
                params.code = this.$route.query.code;
                params.templateId = this.$route.query.templateId;

                this.$http.get('promotion/coupon/coupon-info', {params: params}).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data.coupon;

                        res.body.data.listParam.forEach(item => {
                            if (item.paramId !== 'siteLink' && item.paramId !== 'strategys') {
                                data[item.paramId] = item.defaultValue;
                            }
                        });

                        // linkHandler
                        let linkList = data.siteLink,
                            tempLink = {};
                        linkList.forEach(realink => {
                            tempLink[realink.paramId] = realink;
                        });

                        let finalLink = this.option.siteLink.map(defaultLink => {
                            let id = defaultLink.paramId;
                            if (tempLink[id] instanceof Object) {
                                return tempLink[id];
                            } else {
                                return defaultLink;
                            }
                        });

                        this.isSys = res.body.data.systemTemplate;

                        data.times = [new Date(data.startTime * 1000), new Date(data.endTime * 1000)];
                        this.option = Object.assign(this.option, data, {siteLink: finalLink});
                        this.option.newUser = this.option.userType;
                        this.$delete(this.option, 'userType');

                        // info数据转换
                        for (let i in this.option) {
                            let item = this.option[i];
                            if (i === 'country' || i === 'logisticsCode' || i === 'brands' || i === 'warehouses' || i === 'platforms' || i === 'memberGrade' || i === 'priceType' || i === 'pipelineCode' || i === 'shopCode') {
                                if (item instanceof Array) {

                                } else {
                                    if (item === '') {
                                        this.option[i] = [];
                                    } else {
                                        this.option[i] = item.split(',');
                                    }
                                }
                                // 平台映射转换
                                if (i === 'platforms') {
                                    let tempPlat = [],
                                        tempPlatArr = [];

                                    self.option.platforms.forEach(plat => {
                                        tempPlat = self.terminalMap.filter(e => e.platform_id == plat).map(el => el.terminal_id);
                                        tempPlatArr = tempPlatArr.concat(tempPlat);
                                    });
                                    tempPlatArr.forEach(plat => {
                                        if (self.terminal.indexOf(plat) == -1) {
                                            self.terminal.push(plat);
                                        }
                                    });
                                }
                                //
                            }
                            if (i === 'categorys') {
                                if (item !== '') {
                                    this.ids = item;

                                    let temp = item.split(',');
                                    let tempStr = [];
                                    this.$refs.tree.setCheckedKeys(temp);

                                    let value = this.$refs.tree.getCheckedNodes();
                                    value.forEach(el => {
                                        tempStr.push(el.categoryName);
                                    });

                                    this.option[i] = tempStr.join(',');
                                }
                            }
                        }

                        // coupon类型
                        let discountType = this.countForm(this.option);
                        if (discountType === 2) {
                            let value = data.strategys.split(',');
                            let temp = [];
                            value.forEach(item => {
                                temp.push({
                                    strategys1: item.split('-')[0],
                                    strategys2: item.split('-')[1]
                                });
                            });
                            this.option.strategys = temp;
                        } else if (discountType === 3) {
                            this.option.strategys = this.option.strategys || '-';

                            let temp = this.option.strategys.split('-');
                            this.option.strategys = {};
                            this.option.strategys.strategys1 = temp[0];
                            this.option.strategys.strategys2 = temp[1];
                        }
                        // 0.95 copy
                        if (this.copy && this.option.code) {
                            this.option.code = '';
                        }
                        //
                        this.tableLoading = false;
                    } else {
                        this.$message.error(res.body.message);
                        this.tableLoading = false;
                    }
                }).catch(err => {
                    this.tableLoading = false;
                });
            }
        },
        getTempOpt () {
            this.changeTemp('0');

            this.$http.get('promotion/index/public-country-list').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = [];
                    data.forEach(item => {
                        temp.push(item.countryCode);
                    });
                    this.countryList = temp;
                    this.countryOpt = data;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/price/label-lists').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.labelSites;
                    let temp = [{
                        name: '系统标签',
                        memLabels: []
                    }, {
                        name: '运营标签',
                        memLabels: []
                    }];

                    data.forEach(item => {
                        if (item.type == '1') {
                            temp[1].memLabels.push(item);
                        } else {
                            temp[0].memLabels.push(item);
                        }
                    });
                    this.priceOpt = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/index/public-activity-select').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;

                    this.levelOpt = data.userLevel;
                    this.memberOpt = data.userLevel;
                    this.wareOpt = data.virtualWares;
                    this.brandOpt = data.brand;
                    this.treeData = data.category;
                    this.getData();
                } else {
                    this.$message.error(res.body.message);
                }

            });
        },
        changeTemp (id) {
            // 切换模板时清空数据
            this.option = Object.assign(JSON.parse(JSON.stringify(this.defaultOption)), {templateId: this.option.templateId});
            //
            let self = this;
            let params = {};
            if (!this.$route.query.templateId && typeof id !== 'undefined') {
                params.templateId = id;
            } else {
                params.templateId = this.$route.query.templateId || this.option.templateId;
            }

            if (this.$route.query.type !== 'undefined') {
                params.couponTemplateType = this.$route.query.type;
            } else {
                params.couponTemplateType = null;
            }

            this.tableLoading = true;
            this.$http.get('promotion/coupon/coupon-params', {params: params}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;

                    // 检测空模板
                    if (data.templateIsNull) {
                        this.tableLoading = false;
                        self.$alert('模板为空，请先设置模板', {
                            type: 'error',
                            callback: action => {
                                if (action === 'confirm') {
                                    this.$router.push({
                                        name: 'marketing_coupon_couponAdd'
                                    })
                                } else {
                                    history.back();
                                }
                            }
                        });
                        return false;
                    }

                    this.option.templateId = data.templateId;

                    this.isSys = data.systemTemplate;
                    this.tempOpt = data.listTemplate;
                    this.tempOpt.forEach(item => {
                        if (item.id === data.templateId) {
                            this.option.type = item.classId;
                        }
                    });

                    for (let i in data.listParam) {
                        let para = data.listParam[i];
                        if (para.paramId === 'discountForm') {
                            this.option.discountForm = para.defaultValue;
                            break;
                        }
                    }
                    let discountType = this.countForm(this.option);
                    if (id != 0) {
                        if (!this.editPage) {
                            if (discountType === 2) {
                                // 满减封顶
                                this.option.strategys = [{
                                    strategys1: '',
                                    strategys2: ''
                                }];
                            } else if (discountType === 1) {
                                // 直减 一口价
                                this.option.strategys = '';
                            } else {
                                // 其他
                                this.option.strategys = {
                                    strategys1: '',
                                    strategys2: ''
                                }
                            }
                        }

                        this.itemOpt = {};
                        this.ruleOpt = {
                                templateId: [],
                                strategys: [{validator: this.checkStrategys}],
                                code: [],
                                platforms: [],
                                times: [{ validator: this.checkDateArr, message: '该项不能为空'}],
                                effectDays: [{validator: this.checkDays}],
                                limitCount: [{validator: this.checkNumber}],
                                userLimitCount: [{validator: this.checkNumber}],
                                userIds: [],
                                categorys: [],
                                country: [],
                                logisticsCode: [],
                                warehouses: [],
                                brands: [],
                                includeGoods: [],
                                excludeGoods: [],
                                isSameStyle: [],
                                remark: [],
                                memberGrade: [],
                                priceType: [],
                                // isConfine: [],
                                newUser: [],
                                goodLimitCount: [],
                                couponName: [],
                                discountForm: [],
                                fullCondition: [],
                                siteLink: [],
                                grantUserCount: [{validator: this.checkInt}],
                                grantTotalCount: [{validator: this.checkInt}],
                                pipelineCode: [],
                                shopCode: []
                        };

                        this.$nextTick(() => {
                            data.listParam.forEach(item => {

                                let itemId = item.paramId;
                                this.$set(this.itemOpt, item.paramId, true);
                                // required
                                if (item.isRequired === 1 && itemId !== 'times' && itemId !== 'code' && itemId !== 'strategys' && itemId !== 'siteLink') {
                                    if (itemId == 'categorys') {
                                        this.ruleOpt[itemId] = [{required: true, message: '该项不能为空'}];
                                    } else if (itemId === 'platforms' || itemId === 'warehouses' || itemId === 'brands' || itemId === 'country' || itemId === 'logisticsCode' || itemId === 'memberGrade' || itemId === 'priceType' || itemId === 'shopCode' || itemId === 'pipelineCode') {
                                        this.ruleOpt[itemId].splice(0, 0, {type: 'array',required: true, message: '该项不能为空'});
                                    } else {
                                        this.ruleOpt[itemId].splice(0, 0, {required: true, message: '该项不能为空'});
                                    }
                                }
                                // changevalue
                                if (itemId === 'strategys' && item.defaultValue == '' && (this.option.type == 11 || this.option.type == 15)) {
                                    item.defaultValue = '-';
                                }
                                if(!self.editPage) {
                                    if (itemId === 'times') {
                                        self.option.times = [new Date(self.timeZone_(item.defaultValueArray[0], self.$store.getters.getTimeZone)), new Date(self.timeZone_(item.defaultValueArray[1], self.$store.getters.getTimeZone))];
                                        if (item.defaultValueArray == '' || item.defaultValueArray[0] == '' || item.defaultValueArray[1] == '') {
                                            self.option.times = [];
                                        }
                                    } else if (itemId === 'siteLink') {
                                    } else if (itemId === 'strategys') {
                                        if (discountType === 1) {
                                            self.option.strategys = item.defaultValue;
                                        } else if (discountType === 2){
                                            self.option.strategys = [{
                                                strategys1: item.defaultValue.split('-')[0],
                                                strategys2: item.defaultValue.split('-')[1],
                                            }];
                                        } else {
                                            self.option.strategys = {
                                                strategys1: item.defaultValue.split('-')[0] || '',
                                                strategys2: item.defaultValue.split('-')[1] || '',
                                            };
                                        }
                                    } else if (itemId === 'categorys') {
                                        this.$nextTick(() => {
                                            self.$refs.tree.setCheckedKeys(item.defaultValue.split(','));
                                            let temp = [];
                                            let data = self.$refs.tree.getCheckedNodes();
                                            data.forEach(item => {
                                                temp.push(item.categoryName);
                                            });
                                            self.option.categorys = temp.join(',');
                                        });
                                    } else if (itemId === 'platforms' || itemId === 'warehouses' || itemId === 'brands' || itemId === 'memberGrade' || itemId === 'priceType' || itemId === 'country' || itemId === 'logisticsCode' || itemId === 'shopCode' || itemId === 'pipelineCode') {
                                        if (item.defaultValue == '' || item.defaultValue == '-') {
                                        } else {
                                            self.option[itemId] = item.defaultValue.split(',');
                                        }
                                    } else {
                                        this.option[itemId] = item.defaultValue;
                                    }
                                }
                            });

                            // required
                            if (!this.isSys) {
                                this.ruleOpt.times.splice(0, 0, {type: 'array',required: true, message: '该项不能为空'});
                                this.ruleOpt.code.splice(0, 0, {required: true, message: '该项不能为空'});
                            }

                            this.$refs.searchForm.$children.forEach(item => {
                                item.validateState = true;
                            });
                        });
                    }
                } else {
                    this.$message.error(res.body.message);
                }
                if (!this.editPage) {
                    this.tableLoading = false;
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        exportCoupon () {
            let source = '^0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let temp = '';
            for (let i = 0; i < 10; i++) {
                temp += source.charAt(Math.ceil(Math.random() * 36));
            }
            this.option.code = temp;
        },
        checkCoupon () {
            this.$http.get('promotion/coupon/exists-coupon', {params:{code: this.option.code}}).then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        postAdd () {
            this.$refs.searchForm.validate(valid => {
                if (valid) {
                    let discountType = this.countForm(this.option);

                    let timeArr = this.timeZone_(this.option.times, this.$store.getters.getTimeZone);
                    this.option.startTime = timeArr[0];
                    this.option.endTime = timeArr[1];

                    let params = {};
                    for (let i in this.option) {
                        if (i !== 'times' && i !== 'strategys' && i !== 'overdue' && i !== 'newUser' && i !== 'siteLink' && i !== 'grantTotalCount' && i !== 'grantUserCount' && i !== 'pipelineCode' && i !== 'shopCode') {
                            params[i] = this.option[i];
                        }
                    }
                    params.categorys = this.ids;
                    params.userType = this.option.newUser;
                    params.pipelineCode = this.option.pipelineCode.join(',');
                    params.shopCode = this.option.shopCode.join(',');

                    if (discountType === 2) {
                        let source = this.option.strategys;
                        let temp = [];
                        source.forEach(item => {
                            temp.push(item.strategys1 + '-' + item.strategys2);
                        })
                        params.strategys = temp.join(',');

                    } else if (discountType === 1) {
                        params.strategys = this.option.strategys;
                    } else {
                        params.strategys = this.option.strategys.strategys1 + '-' + this.option.strategys.strategys2;

                    }

                    for (let j in params) {
                        let item = params[j];
                        if (item instanceof Array) {
                            params[j] = item.join(',');
                        }
                    }

                    // 0.8链接和发放数量限制
                    let couponConditons = [];
                    if (this.option.grantTotalCount && this.setPage) {
                        couponConditons.push({
                            paramId: 'grantTotalCount',
                            paramName: '发放总数',
                            paramValue: this.option.grantTotalCount
                        });
                    }

                    if (this.option.grantUserCount && this.setPage) {
                        couponConditons.push({
                            paramId: 'grantUserCount',
                            paramName: '单用户可领取数',
                            paramValue: this.option.grantUserCount
                        });
                    }

                    let siteLink = this.option.siteLink;

                    if (siteLink && siteLink.length > 0) {
                        siteLink.forEach(item => {
                            if (item.paramValue) {
                                couponConditons.push({
                                    paramId: item.paramId,
                                    paramName: item.paramId,
                                    paramValue: item.paramValue
                                });
                            }
                        });
                    }

                    if (couponConditons.length > 0) {
                        params.couponConditons = couponConditons;
                    }

                    //系统coupon
                    params.couponSystemTemplate  = this.isSys ? -1 : 0;

                    // 一口价和直接添加参数
                    if(this.option.type == 10 || this.option.type == 14) {
                        params.discountForm = 1,
                        params.fullCondition = 1
                    }

                    if (this.option.type == 9 || this.option.type == 13) {
                        params.fullCondition = 1;
                    }
                    //
                    if (this.isSys && !this.editPage) {
                        delete params.code;
                    }
                    this.postLoading = true;
                    if (this.editPage || this.isSys) {
                        // 系统coupon
                        if (params.id && !this.copy) {
                            this.$http.post('promotion/coupon/edit', params).then(res => {
                                this.postLoading = false;
                                if (res.body.code === 0) {
                                    this.$message.success(res.body.message);
                                    history.back();
                                } else {
                                    this.$message.error(res.body.message);
                                }
                            }).catch(err => {
                                this.postLoading = false;
                            })
                        } else {
                            this.$http.post('promotion/coupon/add', params).then(res => {
                                this.postLoading = false;
                                if (res.body.code === 0) {
                                    this.$message.success(res.body.message);
                                    history.back();
                                } else {
                                    this.$message.error(res.body.message);
                                }
                            }).catch(err => {
                                this.postLoading = false;
                            })
                        }
                    } else {
                        // 普通coupon

                        this.$http.get('promotion/coupon/exists-coupon', {params:{code: this.option.code}}).then(res => {
                            this.postLoading = false;
                            if (res.body.code === 0) {
                                if (params.id) {
                                    this.$http.post('promotion/coupon/edit', params).then(res => {
                                        if (res.body.code === 0) {
                                            this.$message.success(res.body.message);
                                            history.back();
                                        } else {
                                            this.$message.error(res.body.message);
                                        }
                                    })
                                } else {
                                    this.$http.post('promotion/coupon/add', params).then(res => {
                                        if (res.body.code === 0) {
                                            this.$message.success(res.body.message);
                                            history.back();
                                        } else {
                                            this.$message.error(res.body.message);
                                        }
                                    })
                                }
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.postLoading = false;
                        });
                    }
                }
            });
        },
        changeCountry (val) {
            if (val.indexOf('checkAll') != -1) {
                this.option.country = this.countryList;
                return;
            }

            if (val.length === 0) {
                this.logOpt = [];
            } else {
                this.$http.get('promotion/index/public-country-logistics', {params: {countryCode: this.option.country.join(',')}}).then(res => {
                    if (res.body.code === 0) {
                        this.logOpt = res.body.data;
                    }
                });
            }

        },
        changeTree () {
            let data = this.$refs.tree.getCheckedNodes();
            let temp = [];
            let tempStr = [];

            data.forEach(item => {
                tempStr.push(item.categoryName);
                temp.push(item.id);
            })
            this.option.categorys = tempStr.join(',');
            this.ids = temp.join(',');
        },
        showTree (flag) {
            if (!flag) {
                this.treeFlag = !this.treeFlag
            }
        },
        closeTree (event) {
            let target = event.target.parentElement._prevClass;
            if (target && target.indexOf('js_input') !== -1) {

            } else {
                this.treeFlag = false;
            }
        },
        addItem () {
            this.option.strategys.push({
                strategys1: '',
                strategys2: '',
            })
        },
        removeItem (index) {
            if (this.option.strategys.length > 1) {
                this.option.strategys.splice(index, 1);
            } else {
                this.$message.warning('最后一项不能删除');
            }
        },
        // 选择时间类型
        changeDateType (val) {
            if (val.target.defaultValue == 1) {
                this.option.effectDays = '';
            } else {
                this.option.times = [];
            }
        },
        goback () {
            history.back();
        },
        // 修改渠道
        changePipe (val) {
            if (val.indexOf('checkAll') != -1) {
                this.option.pipelineCode = this.pipeList;
            }
        },
        // 修改店铺
        changeStroe (val) {
            if (val.indexOf('checkAll') != -1) {
                this.option.shopCode = this.shopList;
            }
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
        handleSelect(event, item) {
            item.paramValue = event.url;
        },
        handleIconClick(...argument) {
            return () => {
                if(!this.editable){
                    argument[0].paramValue = '';
                }
            };
        },
    }
}
</script>

<style lang="less">
    .coupon-set {
        .country-select {
            .el-select__tags {
                max-height: 200px;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }

        .item-arr {
            margin-bottom: 10px;
        }

        .webLink-item {
            margin-bottom: 22px;
        }

        .time-set {
            .item {
                .el-input {
                    width: 350px;
                }

                .el-radio {
                    width: 100px;
                    margin-right: 20px;
                }
            }

            .el-form-item__error {
                margin-left: 120px;
            }

            label {
                &:before {
                    content: '*';
                    color: #ff4949;
                    margin-right: 4px;
                }
            }
        }
    }

    .coupon-edit-form {

        .el-form-item {
            position: relative;

            .coupon-tips {
                position: absolute;
                display: inline-block;
                width: 400px;
                line-height: 20px;
                top: 0;
                left: 110%;

                span {
                    color: #ff4949;
                }
            }
        }
    }

    .coupon-select {
        position: relative;
        z-index: 10;
        min-height: 36px;

        .el-input {
            position: absolute;
            top: 0;
            left: 0;
        }

        .el-tree {
            position: absolute;
            top: 36px;
            left: 0;
            z-index: 10;
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
            text-align: left;
        }
    }
</style>
