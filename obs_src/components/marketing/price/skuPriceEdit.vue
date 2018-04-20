<!-- sku价格编辑 -->
<template>
    <div class="sku-edit">
        <div class="el-container">
            <el-row v-loading="tableLoading">
                <el-col :span="15">
                    <el-form label-width="140px" ref="postForm" :model="option">
                        <el-form-item label="组名称" prop="priceName" :rules="ruleOpt.priceName" v-if="itemOpt.priceName">
                            <el-input :disabled="true" v-model.trim="option.priceName"></el-input>
                        </el-form-item>
                        <el-form-item label="价格" prop="price" :rules="ruleOpt.price" v-if="itemOpt.price">
                            <el-input v-model.trim="option.price"></el-input>
                        </el-form-item>
                        <el-form-item label="利润率" prop="rates" :rules="ruleOpt.rates" v-if="itemOpt.rates">
                            <el-input v-model.trim="option.rates"></el-input>
                        </el-form-item>
                        <el-form-item label="价格尾数" prop="mantissa" :rules="ruleOpt.mantissa" v-if="itemOpt.mantissa">
                            <el-input v-model.trim="option.mantissa"></el-input>
                        </el-form-item>
                        <el-form-item label="阶梯价" prop="stepPrice" :rules="ruleOpt.stepPrice" v-if="itemOpt.stepPrice">
                            <template v-for="(item, index) in option.stepPrice">
                                <el-row class="item-row">
                                    <el-col :span="3" class="text-center">数量区间：</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="item.stepFrom"></el-input>
                                    </el-col>
                                    <el-col :span="1" class="text-center">-</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="item.stepTo"></el-input>
                                    </el-col>
                                    <el-col :span="3" class="text-center">利润率：</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="item.rates"></el-input>
                                    </el-col>
                                    <el-col :span="6" :offset="2">
                                        <el-button type="primary" icon="plus" @click="addStep"></el-button>
                                        <el-button type="danger" icon="minus" @click="removeStep(index)"></el-button>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-form-item>
                        <el-form-item label="终端" prop="platforms" :rules="ruleOpt.platforms" v-if="itemOpt.platforms">
                            <el-checkbox-group v-model="terminal">
                                <el-checkbox v-for="item in terminalOpt" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="适用渠道">
                            {{pipeOpt[option.pipelineCode]}}
                        </el-form-item>
                        <el-form-item label="时间" prop="times" :rules="ruleOpt.times" v-if="itemOpt.times">
                            <el-date-picker v-model="option.times" type="datetimerange" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="定时价格增长" prop="timerRiseInPrice" :rules="ruleOpt.timerRiseInPrice" v-if="itemOpt.timerRiseInPrice">
                            <div>
                                <el-row>
                                    <el-col :span="1" class="text-center">每</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="option.timerRiseInPrice.timeOfHourPrice"></el-input>
                                    </el-col>
                                    <el-col :span="3" class="text-center">小时，增长</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="option.timerRiseInPrice.risePrice"></el-input>
                                    </el-col>
                                    <el-col :span="1" class="text-center">元</el-col>
                                </el-row>
                            </div>
                        </el-form-item>
                        <el-form-item label="销量价格变动" prop="orderChange" :rules="ruleOpt.orderChange" v-if="itemOpt.orderChange">
                            <template v-for="(item, index) in option.orderChange">
                                <el-row class="item-row">
                                    <el-col :span="3" class="text-center">数量区间：</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="item.saleQtyFrom"></el-input>
                                    </el-col>
                                    <el-col :span="1" class="text-center">-</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="item.saleQtyTo"></el-input>
                                    </el-col>
                                    <el-col :span="3" class="text-center">利润率：</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="item.profitRates"></el-input>
                                    </el-col>
                                    <el-col :span="6" :offset="2">
                                        <el-button type="primary" icon="plus" @click="addChange"></el-button>
                                        <el-button type="danger" icon="minus" @click="removeChange(index)"></el-button>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-form-item>
                        <el-form-item label="定时销量增长" prop="timerRiseInOrder" :rules="ruleOpt.timerRiseInOrder" v-if="itemOpt.timerRiseInOrder">
                            <div>
                                <el-row>
                                    <el-col :span="1" class="text-center">每</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="option.timerRiseInOrder.timeOfHourOrder"></el-input>
                                    </el-col>
                                    <el-col :span="3" class="text-center">小时，增长</el-col>
                                    <el-col :span="3">
                                        <el-input v-model.trim="option.timerRiseInOrder.riseOrder"></el-input>
                                    </el-col>
                                    <el-col :span="1" class="text-center">个</el-col>
                                </el-row>
                            </div>
                        </el-form-item>
                        <el-form-item label="可销售数量" prop="saleQty" :rules="ruleOpt.saleQty" v-if="itemOpt.saleQty">
                            <el-input v-model.trim="option.saleQty"></el-input>
                        </el-form-item>
                        <el-form-item label="虚拟售出数量" prop="virtualSaleQty" :rules="ruleOpt.virtualSaleQty" v-if="itemOpt.virtualSaleQty">
                            <el-input v-model.trim="option.virtualSaleQty"></el-input>
                        </el-form-item>
                        <el-form-item label="单用户购买数量限制" prop="buyLimit" :rules="ruleOpt.buyLimit" v-if="itemOpt.buyLimit">
                            <el-input v-model.trim="option.buyLimit"></el-input>
                        </el-form-item>
                        <el-form-item label="绑定会员" prop="users" :rules="ruleOpt.users" v-if="itemOpt.users">
                            <el-input v-model.trim="option.users"></el-input>
                        </el-form-item>
                        <el-form-item label="会员等级" prop="userLevel" :rules="ruleOpt.userLevel" v-if="itemOpt.userLevel">
                            <el-select filterable v-model="option.userLevel" multiple>
                                <el-option v-for="item in memberOpt" :key="item.id" :label="item.levelName" :value="String(item.id)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="绑定国家" prop="country" :rules="ruleOpt.country" v-if="itemOpt.country" class="country-select">
                            <el-select filterable v-model="option.country" multiple @change="changeCountry">
                                <el-option v-if="option.country.length !== countryList.length" label="全选" value="checkAll"></el-option>
                                <el-option v-for="item in countryOpt" :key="item.countryId" :value="item.countryCode" :label="item.countryName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="密文" prop="ciphertext" :rules="ruleOpt.ciphertext" v-if="itemOpt.ciphertext">
                            <el-row>
                                <el-col :span="16">
                                    <el-input :readonly="true" v-model.trim="option.ciphertext"></el-input>
                                </el-col>
                                <el-col :span="4" :offset="2">
                                    <el-button :disabled="cipherFlag" type="primary" @click="getCipher">生成密文</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="同款生效" prop="isSameStyle" :rules="ruleOpt.isSameStyle" v-if="itemOpt.isSameStyle">
                            <el-checkbox v-model="option.isSameStyle" :true-label="1" :false-label="0"></el-checkbox>
                        </el-form-item>
                        <el-form-item label="不参与自动更新" prop="isLock" :rules="ruleOpt.isLock" v-if="itemOpt.isLock">
                            <el-checkbox v-model="option.isLock" :true-label="1" :false-label="0"></el-checkbox>
                        </el-form-item>
                        <el-form-item label="积分比率(倍数)" prop="integralRate" :rules="ruleOpt.integralRate" v-if="itemOpt.integralRate">
                            <el-input v-model.trim="option.integralRate"></el-input>
                        </el-form-item>
                        <!--  -->
                        <el-form-item label="系统标签" prop="sysLabelId" :rules="ruleOpt.sysLabelId" v-if="itemOpt.sysLabelId">
                            <el-select disabled filterable v-model="option.sysLabelId">
                                <el-option v-for="item in labelOpt.sys" :key="item.id" :label="item.name" :value="String(item.labelId)">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="运营标签" prop="userLabelId" :rules="ruleOpt.userLabelId" v-if="itemOpt.userLabelId">
                            <el-select multiple filterable v-model="option.userLabelId">
                                <el-option v-for="item in labelOpt.user" :key="item.id" :label="item.name" :value="String(item.labelId)">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排除系统标签" prop="excludeSysLabelId" :rules="ruleOpt.excludeSysLabelId" v-if="itemOpt.excludeSysLabelId">
                            <el-select multiple filterable v-model="option.excludeSysLabelId">
                                <el-option v-for="item in labelOpt.sys" :key="item.id" :label="item.name" :value="String(item.labelId)">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="说明" prop="declare" :rules="ruleOpt.declare" v-if="itemOpt.declare">
                            <el-input v-model.trim="option.declare"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark" :rules="ruleOpt.remark" v-if="itemOpt.remark">
                            <el-input v-model.trim="option.remark"></el-input>
                        </el-form-item>
                        <div class="text-center">
                            <el-button v-if="self.showAction_('promotion/price/edit')" type="primary" @click="postEdit" v-loading="postLoading" :disabled="postLoading">保 存</el-button>
                            <el-button type="danger" @click="goback">取 消</el-button>
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
        let checkInt = function(rule, value, callback) {
            if (value === '' || (Number(value) && Number(value) > 0)) {
                callback();
            } else {
                callback(new Error('请输入正整数'));
            }
        }
        let checkMantissa = function(rule, value, callback) {
            let exp = /^0\.\d\d?$/;
            if (value === '' ||  exp.test(value)) {
                callback();
            } else {
                callback('请输入0到1之间的数字，保留2位小数');
            }
        }

        let checkRate = function(rule, value, callback) {
            let exp = /^(0\.\d\d?)$|^([1-9]\d*(\.\d\d?)?)$/;
            if (value === '' ||  (exp.test(value))) {
                callback();
            } else {
                callback('请输入大于0的数字，保留2位小数');
            }
        }

        let checkStep = function(rule, value, callback) {
            if (value.length === 1 && (value[0].stepFrom === '' && value[0].stepTo === '' && value[0].rates === '')) {
                callback();
            }

            value.forEach(item => {
                if (!item.stepFrom || !item.stepTo || !item.rates) {
                    callback (new Error('参数不能为空'));
                }
                if (Number(item.stepFrom) > 0 && Number.isInteger(Number(item.stepFrom)) && Number(item.stepTo) > 0 && Number.isInteger(Number(item.stepTo)) && /^(0\.\d\d?)$|^([1-9]\d*(\.\d\d?)?)$/.test(item.rates)) {

                } else {
                    callback (new Error('数量应为正整数, 利润率大于0，保留2位小数'))
                }
                if (Number(item.stepFrom) >= Number(item.stepTo)) {
                    callback (new Error('数量下限应小于上限'))
                }
            });

            callback();
        }

        let checkOrder = function(rule, value, callback) {
            if (value.length === 1 && (value[0].saleQtyFrom === '' && value[0].saleQtyTo === '' && value[0].profitRates === '')) {
                callback();
            }

            value.forEach(item => {
                if (!item.saleQtyFrom || !item.saleQtyTo || !item.profitRates) {
                    callback (new Error('参数不能为空'));
                }
                if (Number(item.saleQtyFrom) > 0 && Number.isInteger(Number(item.saleQtyFrom)) && Number(item.saleQtyTo) > 0 && Number.isInteger(Number(item.saleQtyTo)) && /^(0\.\d\d?)$|^([1-9]\d*(\.\d\d?)?)$/.test(item.profitRates)) {

                } else {
                    callback (new Error('数量应为正整数, 利润率大于0，保留2位小数'))
                }
                if (Number(item.saleQtyFrom) >= Number(item.saleQtyTo)) {
                    callback (new Error('数量下限应小于上限'))
                }
            });
            callback();
        }

        let checkRiseInOrder = function (rule, value, callback) {
            if ((value.timeOfHourOrder == '' && value.riseOrder == '') || (Number(value.timeOfHourOrder) > 0 && Number(value.riseOrder) > 0)) {
                callback ();
            } else {
                callback (new Error('时间和个数应同时填写，且为数字'));
            }
        }

        let checkRiseInOrderRequired = function (rule, value, callback) {
            if (Boolean(Number(value.timeOfHourOrder)) && Boolean(Number(value.riseOrder))) {
                callback ();
            } else {
                callback (new Error('时间和个数应必填，且为数字'));
            }
        }

        let checkRiseInPrice = function (rule, value, callback) {
            if ((value.timeOfHourPrice == '' && value.risePrice == '') || (Number(value.timeOfHourPrice) > 0 && Number(value.risePrice) > 0)) {
                callback ();
            } else {
                callback (new Error('时间和价格应同时填写，且为数字'));
            }
        }

        let checkRiseInPriceRequired = function (rule, value, callback) {
            if (Boolean(Number(value.timeOfHourPrice)) && Boolean(Number(value.risePrice))) {
                callback ();
            } else {
                callback (new Error('时间和价格必填，且为数字'));
            }
        }

        let checkDateArr = (rule, value, callback) => {
            if (Boolean(value[0]) && Boolean(value[1])) {
                callback();
            } else {
                callback('该项不能为空')
            }
        }

        return {
            countryList: [],
            terminal: [],
            checkDateArr: checkDateArr,
            option: {
                id: '',
                conditionId: '',
                priceId: this.$route.query.priceId,
                warehouseCode: '',
                templateId: '',
                goodSn: this.$route.query.goodSn,
                price: '',
                rates: '',
                platforms: [],
                pipelineCode: this.$route.query.pipelineCode,
                mantissa: '',
                stepPrice: [{
                    'stepFrom': '',
                    'stepTo': '',
                    'rates': '',
                }],
                integralRate: '',
                isSameStyle: '',
                times: [],
                sysLabelId: '',
                userLabelId: [],
                excludeSysLabelId: [],
                declare: '',
                remark: '',
                priceName: '',
                startTime: '',
                endTime: '',
                users: '',
                userLevel: [],
                country: [],
                ciphertext: '',
                buyLimit: '',
                saleQty: '',
                timerRiseInPrice: {
                    timeOfHourPrice: '',
                    risePrice: '',
                },
                orderChange: [{
                    'saleQtyFrom': '',
                    'saleQtyTo': '',
                    'profitRates': '',
                }],
                timerRiseInOrder: {
                    timeOfHourOrder: '',
                    riseOrder: '',
                },
                virtualSaleQty: '',
                isLock: '',
                // compulsoryPackage: '',
                // compulsoryPromotion: ''
            },
            self: this,
            memberOpt: [],
            countryOpt: [],
            labelOpt: [],
            itemOpt: {
                priceName: '',
            },
            nameOpt: {
                priceName: '组名称',
                price: '价格',
                rates: '利润率',
                mantissa: '价格尾数',
                stepPrice: '阶梯价',
                platforms: '平台',
                pipelineCode: '渠道编码',
                startTime: '开始时间',
                endTime: '结束时间',
                timerRiseInPrice: '定时价格增长',
                orderChange: '销售量价格变动',
                timerRiseInOrder: '定时订单增长',
                saleQty: '可销售数量',
                virtualSaleQty: '虚拟售出数量',
                // compulsoryPackage: '包邮运费锁定',
                // compulsoryPromotion: '利润率锁定',
                buyLimit: '单用户购买数量限制',
                users: '绑定会员',
                userLevel: '会员等级',
                country: '绑定国家',
                ciphertext: '密文',
                isSameStyle: '同款生效',
                isLock: '不参与自动更新',
                integralRate: '积分比率',
                sysLabelId: '系统标签',
                userLabelId: '运营标签',
                excludeSysLabelId: '排除系统标签',
                declare: '说明',
                remark: '备注',
            },
            ruleOpt: {
                priceName: [{required: true, message: '该项不能为空,不大于30个字符', max: 30, trigger: 'blur'}],
                price: [{validator: checkRate, trigger: 'blur'}],
                rates: [{validator: checkRate, trigger: 'blur'}],
                mantissa: [{validator: checkMantissa, trigger: 'blur'}],
                stepPrice: [{validator: checkStep, trigger: 'blur'}],
                platforms: [],
                pipelineCode: [],
                times: [{type: 'array', required: true, message: '该项不能为空', trigger: 'change'}, {validator: checkDateArr, trigger: 'change'}],
                timerRiseInPrice: [{validator: checkRiseInPrice, trigger: 'blur'}],
                orderChange: [{validator: checkOrder, trigger: 'blur'}],
                timerRiseInOrder: [{validator: checkRiseInOrder, trigger: 'blur'}],
                saleQty: [{validator: checkInt, trigger: 'blur'}],
                virtualSaleQty: [{validator: checkInt, trigger: 'blur'}],
                buyLimit: [{validator: checkInt, trigger: 'blur'}],
                users: [],
                userLevel: [],
                country: [],
                ciphertext: [],
                isSameStyle: [],
                isLock: [],
                integralRate: [],
                sysLabelId: [],
                userLabelId: [],
                excludeSysLabelId: [],
                declare: [],
                remark: [],
            },
            postLoading: false,
            tableLoading: false,
            cipherFlag: false,
            checkRiseInOrderRequired: checkRiseInOrderRequired,
            checkRiseInPriceRequired: checkRiseInPriceRequired,
        };
    },
    computed: {
        pipeOpt () {
            return this.$store.getters.getPipe.obj;
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
        this.getOpt();
        this.getData();
    },
    methods: {
        getOpt () {
            this.$http.get('promotion/index/public-activity-select').then(res => {
                if (res.body.code == 0) {
                    let data = res.body.data;
                    this.memberOpt = data.userLevel;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/price/label-lists').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.labelSites;
                    let temp = {
                        user: [],
                        sys: [],
                    };

                    data.forEach(item => {
                        if (item.type == '1') {
                            temp.user.push(item);
                        } else {
                            temp.sys.push(item);
                        }
                    });
                    this.labelOpt = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });

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
        },
        getData () {
            let self = this;
            let params = {
                goodSn: this.option.goodSn,
                pipelineCode: this.option.pipelineCode,
                priceId: this.option.priceId,
            };
            this.tableLoading = true;
            this.$http.get('promotion/price/edit-info', {params: params}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.templateParams;
                    let info = res.body.data.price;

                    data.forEach(item => {
                        let itemId = item.paramId;
                        this.itemOpt[itemId] = true;
                        // pipelineCode仅展示，不做限制
                        if ((itemId !== 'times' && itemId !== 'priceName') && item.isRequired === 1) {
                            if (itemId === 'country' || itemId === 'userLevel' || itemId === 'stepPrice' || itemId === 'orderChange' || itemId === 'userLabelId' || itemId === 'excludeSysLabelId' || itemId === 'platforms') {
                                this.ruleOpt[itemId].splice(0, 0, {type: 'array',required: true, message: '该项不能为空', trigger: 'change'})
                            } else if (itemId === 'isSameStyle' || itemId === 'isLock' || itemId === 'sysLabelId') {
                                this.ruleOpt[itemId].splice(0, 0, {required: true, message: '该项不能为空', trigger: 'change'})
                            }  else {
                                if (itemId === 'timerRiseInPrice') {
                                    this.ruleOpt[itemId] = [{validator: this.checkRiseInPriceRequired, trigger: 'blur'}];
                                } else if (itemId === 'timerRiseInOrder') {
                                    this.ruleOpt[itemId] = [{validator: this.checkRiseInOrderRequired, trigger: 'blur'}];
                                } else {
                                    this.ruleOpt[itemId].splice(0, 0, {required: true, message: '该项不能为空', trigger: 'blur'});
                                }
                            }
                        }
                    });

                    for (let i in this.option) {
                        if (info[i] || info[i] === '') {
                            if (i === 'platforms' || i === 'userLabelId' || i === 'excludeSysLabelId' || i === 'country' || i === 'userLevel') {
                                this.option[i] = info[i] === '' ? [] : info[i].split(',');
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
                            } else if (i === 'stepPrice' || i === 'timerRiseInPrice' || i === 'orderChange' || i === 'timerRiseInOrder') {
                                if (info[i]) {
                                    this.option[i] = JSON.parse(info[i]);
                                }
                            } else {
                                this.option[i] = info[i];
                            }
                        }
                    }
                    this.option.times = [new Date(info.startTime * 1000), new Date(info.endTime * 1000)];

                    if (this.option.ciphertext != '') {
                        this.cipherFlag = true;
                    }
                } else {
                    this.$message.error(res.body.message);
                }
                this.tableLoading = false;
            }).catch(err => {
                this.tableLoading = false;
            })
        },
        changeType (params, event) {
            if (event.target.checked) {
                this.option[params] = '0';
            }
        },
        addStep () {
            this.option.stepPrice.push({
                'stepFrom': '',
                'stepTo': '',
                'rates': '',
            })
        },
        removeStep (index) {
            if (this.option.stepPrice.length > 1) {
                this.option.stepPrice.splice(index, 1)
            } else {
                this.$message.warning('最后一项不能删除')
            }
        },
        addChange () {
            this.option.orderChange.push({
                'saleQtyFrom': '',
                'saleQtyTo': '',
                'profitRates': '',
            })
        },
        removeChange (index) {
            if (this.option.orderChange.length > 1) {
                this.option.orderChange.splice(index, 1)
            } else {
                this.$message.warning('最后一项不能删除')
            }
        },
        postEdit () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let itemArr = [];
                    for (let i in this.itemOpt) {
                        itemArr.push(i);
                    }

                    if (itemArr.indexOf('price') == -1) {
                        this.option.price = '';
                    }

                    if (itemArr.indexOf('rates') == -1) {
                        this.option.rates = '';
                    }

                    if (this.option.price && this.option.rates) {
                        this.$message.warning('价格与利润率不能同时设置，请删掉其中一个再试');
                        return ;
                    }

                    if (!this.option.price && !this.option.rates) {
                        this.$message.warning('价格与利润率至少有一项不能为空');
                        return ;
                    }

                    let timeArr1 = this.timeZone_(this.option.times, this.$store.getters.getTimeZone);
                    this.option.startTime = timeArr1[0];
                    this.option.endTime = timeArr1[1];

                    let params = {};
                    params.priceConditions = [];
                    for (let i in this.option) {
                        if (i === 'timerRiseInOrder' || i === 'timerRiseInPrice') {
                            let flag = true;
                            for (let j in this.option[i]) {
                                let item = this.option[i][j];
                                if (item == '') {
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) {
                                params.priceConditions.push({
                                    conditionId: this.option.conditionId,
                                    paramId: i,
                                    paramName: this.nameOpt[i],
                                    paramValue: this.option[i]
                                });
                            }
                        } else if (i === 'stepPrice' || i === 'orderChange') {
                            let flag = true;
                            for (let k in this.option[i]) {
                                let item = this.option[i][k];
                                for (let l in item) {
                                    if (item[l] == '') {
                                        flag = false;
                                        break;
                                    }
                                }
                            }
                            if (flag) {
                                params.priceConditions.push({
                                    conditionId: this.option.conditionId,
                                    paramId: i,
                                    paramName: this.nameOpt[i],
                                    paramValue: this.option[i]
                                });
                            }
                        } else if (i !== 'times' && i !== 'id' && i !== 'conditionId' && i !== 'priceId' && i !== 'warehouseCode' && i !== 'templateId' && i !== 'goodSn') {
                            if (this.option[i] === '' || this.option[i].length === 0) {

                            } else {
                                params.priceConditions.push({
                                    conditionId: this.option.conditionId,
                                    paramId: i,
                                    paramName: this.nameOpt[i],
                                    paramValue: this.option[i]
                                });
                            }
                        }
                    }
                    // params.id = this.option.id;
                    params.conditionId = this.option.conditionId;
                    params.priceId = this.option.priceId;
                    params.warehouseCode = this.option.warehouseCode;
                    params.templateId = this.option.templateId;
                    params.goodSn = this.option.goodSn;
                    params.startTime = this.option.startTime;
                    params.endTime = this.option.endTime;
                    params.pipelineCode = this.option.pipelineCode;
                    let tempArr = [];
                    params.priceConditions.forEach(item => {
                        if (item.paramValue instanceof Array) {
                            if (item.paramValue[0] instanceof Object) {
                            } else {
                                item.paramValue = item.paramValue.join(',');
                            }
                        }

                        if (item.paramValue) {
                            tempArr.push(item);
                        }
                    });
                    params.priceConditions = tempArr;
                    this.postLoading = true;
                    this.$http.post('promotion/price/edit', params).then(res => {
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
            })
        },
        getCipher () {
            let source = '^0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let temp = '';
            for (let i = 0; i < 16; i++) {
                temp += source.charAt(Math.ceil(Math.random() * 36));
            }
            this.option.ciphertext = temp;
        },
        goback () {
            history.back();
        },
        changeCountry(val) {
            if (val.indexOf('checkAll') != -1) {
                this.option.country = this.countryList;
            }
        },
    }
}
</script>

<style lang="less" scope>
    .sku-edit {
        .item-row {
            margin-bottom: 10px;
        }
    }

    .country-select {
        .el-select__tags {
            max-height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
</style>
