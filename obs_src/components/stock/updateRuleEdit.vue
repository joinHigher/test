<!-- 库存更新规则列表新增 -->
<template>

    <div>
        <div class="wrap" v-loading="isDataLoading">
            <p class="head-title">设置可售库存更新规则</p>
            <el-form ref="dataForm" :model="dataForm" :rules="dataFormRules">

                <el-row :gutter="10">
                    <el-col :span="9">
                        <el-form-item label="真实仓：" label-width="100px" prop="realWhCode">
                            <span class="ac-real-list-wrap">
                                <el-autocomplete v-model="dataForm.name" :disabled="isEdit" placeholder="真实仓名称/代码" :fetch-suggestions="querySearch" @select="handleSelectRealWhCode" icon="circle-close" :on-icon-click="handleRealListDelIconClick" class="w598"></el-autocomplete>
                                <i class="el-icon-caret-bottom"></i>
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <div class="notice">
                            <p>注意: </p>
                            <p>1.同步仓库存数会 根据公/私/预留比例 +计算规则 划分库存数并更新。</p>
                            <p>2.若计算结果不为整数，则向下进行取整。</p>
                        </div>
                    </el-col>
                </el-row>

                <!--【公有可售库存】 begin-->
                <el-form-item label-width="25px">
                    <el-row>
                        <el-col>
                            <p class="item-title">【公有可售库存】</p>
                        </el-col>
                    </el-row>
                </el-form-item>

                <div class="item-wrap">
                    <el-form-item label="公有比率：" label-width="100px" style="font-weight: bold;" prop="publicPercent">
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-input value="0" v-model="dataForm.publicPercent" prop="publicRatio"></el-input>
                            </el-col>
                            <el-col :span="1">
                                %
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label-width="100px">
                        <el-row :gutter="10">
                            <el-col :span="20">
                                <p><span class="prompt">设置区间0~100，OMS库存数x公有比率=公有库存数</span></p>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item label="限制规则：" label-width="100px">
                        <el-row :gutter="10">
                            <el-col :span="10">
                                <el-radio-group v-model="dataForm.stockList[0].isEnable" prop="publicisEnable"  @change="changeEnable">
                                    <el-radio label="1">启用</el-radio>
                                    <el-radio label="0">停用</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label-width="100px" prop="publicLimitRules">
                        <el-row :gutter="10">
                            <el-col :span="20">
                                <el-button type="primary" size="small" @click="openDialogSettingRule(1)">设置规则</el-button>
                                <span class="prompt">此计算规则中 库存数 =公有库存数</span>
                            </el-col>
                        </el-row>
                        <div class="item-table">
                            <el-row>
                                <el-col :span="8">条件</el-col>
                                <el-col :span="16">{{dataForm.stockListShow[0].premise ? dataForm.stockListShow[0].premise : '请设置条件'}}</el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">结果</el-col>
                                <el-col :span="16">{{dataForm.stockListShow[0].formula ? dataForm.stockListShow[0].formula : '请设置公式'}}</el-col>
                            </el-row>
                        </div>
                    </el-form-item>
                </div><!--【公有可售库存】 end-->

                <!--【私有可售库存】 begin-->
                <el-form-item label-width="25px" class="mt50">
                    <el-row>
                        <el-col>
                            <p class="item-title">【私有可售库存】</p>
                        </el-col>
                    </el-row>
                </el-form-item>

                <div class="item-wrap">
                    <el-form-item label="私有比率：" label-width="100px" style="font-weight: bold;" prop="privatePercent">
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-input value="100" v-model="dataForm.privatePercent" prop="privateRatio"></el-input>
                            </el-col>
                            <el-col :span="1">
                                %
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label-width="100px">
                        <el-row :gutter="10">
                            <el-col :span="20">
                                <p><span class="prompt">设置区间0~100，OMS库存数x公有比率=公有库存数</span></p>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="限制规则：" label-width="100px">
                        <el-row :gutter="10">
                            <el-col :span="10">
                                <el-radio-group v-model="dataForm.stockList[1].isEnable" prop="privateisEnable" @change="changeEnable">
                                    <el-radio label="1">启用</el-radio>
                                    <el-radio label="0">停用</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label-width="100px" prop="privateLimitRules">
                        <el-row :gutter="10">
                            <el-col :span="20">
                                <el-button type="primary" size="small" @click="openDialogSettingRule(2)">设置规则</el-button>
                                <span class="prompt">此计算规则中 库存数 =公有库存数</span>
                            </el-col>
                        </el-row>
                        <div class="item-table">
                            <el-row>
                                <el-col :span="8">条件</el-col>
                                <el-col :span="16">{{dataForm.stockListShow[1].premise ? dataForm.stockListShow[1].premise : '请设置条件'}}</el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">公式</el-col>
                                <el-col :span="16">{{dataForm.stockListShow[1].formula ? dataForm.stockListShow[1].formula : '请设置公式'}}</el-col>
                            </el-row>
                        </div>
                    </el-form-item>
                </div><!--【私有可售库存】 end-->

                <div class="operateBar">
                    <el-button type="primary" @click="saveRules">保存</el-button>
                    <el-button type="default" @click="back">返回</el-button>
                </div>
            </el-form>
        </div>

        <!--设置规则dialog-->
        <el-dialog title="设置规则" :visible.sync="dialogSettingRule">
            <hr class="dialog-line"/>
            <el-form label-width="100px" :model="calcForm" ref="calcForm" :rules="calcFormRules" class="mt30">
                <el-form-item label="库存条件：">
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-form-item class="inline-block" prop="stockNum1">
                                <el-input size="small" v-model="calcForm.stockNum1" class="w100"></el-input>
                            </el-form-item>
                            <span>=&lt;库存数&lt;=</span>
                            <el-form-item class="inline-block" prop="stockNum2">
                                <el-input size="small" v-model="calcForm.stockNum2" class="w100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="计算公式：" class="calc-bg">
                    <el-row :gutter="20">
                        <el-col :span="20">

                            <!--公式计算器 begin-->
                            <div class="calc-wrap" @click="calcOperate">
                                <div class="calc-operate">
                                    <el-button size="small">库存数</el-button>
                                    <el-button size="small">+</el-button>
                                    <el-button size="small">-</el-button>
                                    <el-button size="small">*</el-button>
                                    <el-button size="small">/</el-button>
                                    <div class="calc-num-wrap">
                                        <el-button size="small">123.</el-button>
                                        <div class="num-list" v-show="calcForm.isShowCalcNumList">
                                            <ul>
                                                <li>
                                                    <span>1</span>
                                                    <span>2</span>
                                                    <span>3</span>
                                                </li>
                                                <li>
                                                    <span>4</span>
                                                    <span>5</span>
                                                    <span>6</span>
                                                </li>
                                                <li>
                                                    <span>7</span>
                                                    <span>8</span>
                                                    <span>9</span>
                                                </li>
                                                <li>
                                                    <span>&nbsp;</span>
                                                    <span>0</span>
                                                    <span>.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <el-button size="small">删除</el-button>
                                </div>
                                <div class="calc-result">
                                    <el-form-item prop="formula">
                                        <el-input type="textarea" :rows="5" v-model="calcForm.formula" readonly placeholder="SKU库存数="></el-input>
                                    </el-form-item>
                                    <p class="calc-notice">*公式仅支持单个运算符</p>
                                </div>
                            </div><!--公式计算器 end-->

                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item class="mt20" label-width="110px">
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-button @click="dialogSettingRule = false">取消</el-button>
                            <el-button @click="saveEditSettingRule" type="primary">保存</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            //验证比率，只能是0-100之间，可以是小数点
            let validateRatio = (rule, value, callback) => {
                let reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;

                if(!value) {
                    return callback(new Error('该项不能为空'));
                }
                if(!reg.test(value)){
                    return callback(new Error('只能输入整数和小数'));
                }
                if(value < 0 || value > 100){
                    return callback(new Error('已超出设置区间'));
                }

                callback();
            };
            let commonNumCheck =  (rule, value, callback)  => {
                let val = value * 1;
                if (!value || !Number.isInteger(val)) {
                    return callback(new Error('只能输入整数'))
                }
                // let reg = new RegExp("^[0-9]*$");

                // if(!value) {
                //     return callback(new Error('该项不能为空'));
                // }
                // if(!reg.test(value)){
                //     return callback(new Error('只能输入整数'));
                // }
            };
            //验证库存条件
            let validateNum1 = (rule, value, callback) => {
                commonNumCheck(rule, value, callback);
                // let val = value * 1;
                // if (value && Number.isInteger(val)) {
                //     callback();
                // } else {
                //     callback(new Error('只能输入整数'))
                // }
                callback();
            };
            let validateNum2 = (rule, value, callback) => {
                commonNumCheck(rule, value, callback);
                if(parseInt(value) <= parseInt(this.calcForm.stockNum1)){
                    return callback(new Error('必须大于第一个值'));
                }
                callback();
            };
            //验证公式正确性
            let validateFormula = (rule, value, callback) => {
                //console.log(value);
                if(!value) {
                    return callback(new Error('公式不能为空'));
                }
                if(value.substr(value.length - 1, 1) === '.'){
                    return callback(new Error('请检查公式规范性，如末尾不能是小数点(.)'));
                }

                let r = value.match(/[\+\-\*\/]/);
                //如果存在运算符
                if(r !== null ){
                    let tempValue = value.split(r[0]);
                    if(tempValue.length > 2
                        || (tempValue[0] !== '' && tempValue[0] !=='库存数')
                        || (tempValue[0] !== '' && tempValue[0] ==='库存数' && tempValue[1] === '')
                        || (tempValue[0] === '' && tempValue[1] === '')){
                        return callback(new Error('请检查公式规范性，只支持两种格式：纯数字/ 库存数&运算符&数字'));
                    }
                } else{
                    //不存在运算符且有库存数
                    if(value.indexOf('库存数') > -1){
                        return callback(new Error('请检查公式规范性，只支持两种格式：纯数字/ 库存数&运算符&数字'));
                    }
                }

                callback();
            };
            //验证公有可售库存限制规则
            let validatePublicRules = (rule, value, callback) => {
                if(this.dataForm.stockList[0].isEnable === '1' && this.dataForm.stockListShow[0].premise === '') {
                    return callback(new Error('该项不能为空，请设置规则'));
                }
                callback();
            };
            //验证私有可售库存限制规则
            let validatePrivateRules = (rule, value, callback) => {
                if(this.dataForm.stockList[1].isEnable === '1' && this.dataForm.stockListShow[1].premise === '') {
                    return callback(new Error('该项不能为空，请设置规则'));
                }
                callback();
            };
            return {
                self: this,
                isDataLoading: false,
                isEdit: false,
                type: false,
                dataForm: {
                    //真实仓
                    realWhCode: '',
                    publicPercent: '',
                    privatePercent: '',
                    stockRestrictRuleList: [],
                    realWhCodeTemp: '',
                    name: '',
                    nameTemp: '',
                    stockList: [
                        {isEnable: '0', premise: '', formula: '', restrictType: 1},  //公有可售库存
                        {isEnable: '0', premise: '', formula: '', restrictType: 2}  //私有可售库存
                    ],
                    stockListShow : [
                        {premise: '', formula: ''}, //公有可售库存-前端显示
                        {premise: '', formula: ''}  //私有可售库存-前端显示
                    ],
                },
                dataFormRules: {
                    realWhCode: [{required: true, message: '该项不能为空'}],
                    publicPercent: [{validator: validateRatio, trigger: 'blur'}],
                    privatePercent: [{validator: validateRatio, trigger: 'blur'}],
                    publicLimitRules: [{validator: validatePublicRules, trigger: 'submit'}],
                    privateLimitRules: [{validator: validatePrivateRules, trigger: 'submit'}],
                },
                calcForm: {
                    stockNum1: '',
                    stockNum2: '',
                    formula: '',
                    type: '', //type 1：公有可售库存；2：私有可售库存
                    isShowCalcNumList: false
                },
                calcFormRules: {
                    stockNum1: [{validator: validateNum1, trigger: 'blur'}],
                    stockNum2: [{validator: validateNum2, trigger: 'blur'}],
                    formula: [{validator: validateFormula, trigger: 'submit'}]
                },
                //真实仓数据
                realWhCodeList: [],
                dialogSettingRule: false,
            };
        },
        created() {
            this.type = this.$route.query['type'];
            let realWhCode = this.$route.query['realWhCode'];   //真实仓code

            if(this.type === 'edit' && typeof realWhCode !== 'undefined') {
                this.isEdit = true;
                this.getDetail(realWhCode);
            }
            this.getRealWhCodeList();
        },
        methods: {
            //获取真实仓
            getRealWhCodeList() {
                this.$http.get('stock/real-warehouse/public-whcodes').then((res) => {
                    if (res.body.code === 0) {
                        let tempArr = [];
                        res.body.data.forEach((item) => {
                            item.whCode && tempArr.push({
                                value: item.name + '（' + item.whCode + '）',
                                code: item.whCode
                            });
                        });
                        this.realWhCodeList = tempArr;
                    }
                });
            },

            /**
             * 打开设置规则对话框
             * @param type 1：公有可售库存；2：私有可售库存
             */
            openDialogSettingRule(type) {
                if(this.dialogSettingRule){
                    return false;
                }

                let tempCalcForm = {};
                tempCalcForm = {
                    stockNum1: this.dataForm.stockList[type - 1].premise.split('|')[0],
                    stockNum2: this.dataForm.stockList[type - 1].premise.split('|')[1],
                    formula: this.dataForm.stockListShow[type - 1].formula.replace('SKU库存数=', ''),
                    isShowCalcNumList: false
                };

                this.calcForm = tempCalcForm;
                this.dialogSettingRule = true;
                this.calcForm.type = type;
            },
            /**
             * 获取详情
             * @param realWhCode  真实仓code
             */
            getDetail(realWhCode){
                this.isDataLoading = true;
                this.$http.get('stock/stock/query-stock-restrict-rule', { params: {realWhCode: realWhCode} }).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;

                        this.dataForm.realWhCode = data.realWhCode;
                        this.dataForm.name = data.realWhName;
                        this.dataForm.publicPercent = data.publicPercent.toString();
                        this.dataForm.privatePercent = data.privatePercent.toString();

                        this.dataForm.stockList = data.stockRestrictRuleRespList;
                        this.dataForm.stockList[0].isEnable = this.dataForm.stockList[0].isEnable.toString();
                        this.dataForm.stockList[1].isEnable = this.dataForm.stockList[1].isEnable.toString();

                        let premise_01 = data.stockRestrictRuleRespList[0].premise.split('|'),
                            premise_02 = data.stockRestrictRuleRespList[1].premise.split('|'),
                            formula_01 = data.stockRestrictRuleRespList[0].formula.split('|'),
                            formula_02 = data.stockRestrictRuleRespList[1].formula.split('|');

                        //
                        if(formula_01 !== '' && formula_01.indexOf('=') > -1){
                            formula_01 = 'SKU库存数=' + formula_01[1];
                        }else{
                            formula_01.length === 1 ? formula_01 = '' : formula_01 = 'SKU库存数=库存数' + formula_01[0] + formula_01[1];
                        }
                        //
                        if(formula_02 !== '' && formula_02.indexOf('=') > -1){
                            formula_02 = 'SKU库存数=' + formula_02[1];
                        }else{
                            formula_02.length === 1 ? formula_02 = '' : formula_02 = 'SKU库存数=库存数' + formula_02[0] + formula_02[1];
                        }

                        this.dataForm.stockListShow = [
                            {premise: premise_01[0] === '' ? '' : (premise_01[0] + '=< SKU库存数<=' + premise_01[1]), formula: formula_01}, //公有可售库存-前端显示
                            {premise: premise_02[0] === '' ? '' : (premise_02[0] + '=< SKU库存数<=' + premise_02[1]), formula: formula_02}  //私有可售库存-前端显示
                        ];
                    } else{
                        this.$notify({
                            title: '警告',
                            message: res.body.message || '发生错误',
                            type: 'warning'
                        });
                    }
                    this.isDataLoading = false;
                },(err) => {
                    this.$notify.error({
                        title: err.body.name || '错误',
                        message: err.body.message || '发生错误'
                    });
                });
            },
            //保存
            saveRules() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            realWhCode:  this.dataForm.realWhCode,
                            publicPercent: this.dataForm.publicPercent,
                            privatePercent: this.dataForm.privatePercent,
                            stockRestrictRuleList: this.dataForm.stockList
                        };

                        let url = this.type === 'add' ? 'stock/stock/add-stock-rule' : 'stock/stock/edit-stock-rule';

                        this.isDataLoading = true;
                        this.$http.post(url, params).then(res => {
                            if (res.body.code === 0) {
                                //跳转到列表页
                                this.$router.push({name: 'stock_updateRule'});
                            } else{
                                this.$notify({
                                    title: '警告',
                                    message: res.body.message || '发生错误',
                                    type: 'warning'
                                });
                            }
                            this.isDataLoading = false;
                        },(err) => {
                            this.$notify.error({
                                title: err.body.name || '错误',
                                message: err.body.message || '发生错误'
                            });
                        });

                    } else {
                        return false;
                    }
                });
            },
            //计算公式操作面板
            calcOperate(e) {
                let val = e.srcElement.innerText;

                // 显示/隐藏数字键盘
                if(val === '123.'){
                    this.calcForm.isShowCalcNumList = !this.calcForm.isShowCalcNumList;
                }
                // 删除
                if(val === '删除'){
                    let reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                    let lastChar = this.calcForm.formula.substr(this.calcForm.formula.length - 1, 1);

                    if(reg.test(lastChar)){
                        this.calcForm.formula = this.calcForm.formula.replace('库存数', '');
                    }else{
                        this.calcForm.formula = this.calcForm.formula.replace(lastChar, '');
                    }
                }
                // 库存数
                if(val === '库存数'){
                    if(this.calcForm.formula.indexOf(val) > -1){
                        return false;
                    }
                    this.calcForm.formula = this.calcForm.formula + val;
                }

                //是否包含运算符
                let hasOperator = this.calcForm.formula.indexOf('+') > -1 || this.calcForm.formula.indexOf('-') > -1 || this.calcForm.formula.indexOf('*') > -1 || this.calcForm.formula.indexOf('/') > -1;

                // +
                if(val === '+' && hasOperator === false){
                    this.calcForm.formula = this.calcForm.formula + val;
                }
                // -
                if(val === '-' && hasOperator === false){
                    this.calcForm.formula = this.calcForm.formula + val;
                }
                // *
                if(val === '*' && hasOperator === false){
                    this.calcForm.formula = this.calcForm.formula + val;
                }
                // /
                if(val === '/' && hasOperator === false){
                    this.calcForm.formula = this.calcForm.formula + val;
                }
                // 0-9
                if(val === '0' || val === '1' || val === '2' || val === '3' || val === '4' || val === '5' || val === '6' || val === '7' || val === '8' || val === '9'){
                    this.calcForm.formula = this.calcForm.formula + val;
                }
                // .
                if(val === '.' && this.calcForm.formula.indexOf(val) <= -1){
                    this.calcForm.formula = this.calcForm.formula + val;
                }
            },
            //保存规则
            saveEditSettingRule() {
                this.$refs['calcForm'].validate((valid) => {
                    if (valid) {
                        //显示
                        this.dataForm.stockListShow[this.calcForm.type - 1].premise = this.calcForm.stockNum1 + '=< SKU库存数<=' + this.calcForm.stockNum2;
                        this.dataForm.stockListShow[this.calcForm.type - 1].formula = 'SKU库存数=' + this.calcForm.formula;

                        //传入后台的参数
                        this.dataForm.stockList[this.calcForm.type - 1].premise = this.calcForm.stockNum1 + '|' + this.calcForm.stockNum2;

                        let tempFormula = this.calcForm.formula;
                        tempFormula = tempFormula.replace('库存数','');
                        let r = tempFormula.match(/[\+\-\*\/]/);
                        if(r !== null){
                            tempFormula = tempFormula.replace(/[\+\-\*\/]/,r[0] + '|');
                        }else{
                            tempFormula = '=|' + tempFormula;
                        }
                        this.dataForm.stockList[this.calcForm.type - 1].formula = tempFormula;
                        this.dialogSettingRule = false;

                        this.$refs['dataForm'].validate();
                    }
                });
            },
            // 真实仓搜索
            querySearch(queryString, cb) {
                let items = this.realWhCodeList;
                let results = null;
                results = (queryString && this.dataForm.name != this.dataForm.nameTemp) ? items.filter(this.createFilter(queryString)) : items;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (item) => {
                    return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            handleSelectRealWhCode(item) {
                this.dataForm.realWhCodeTemp = this.dataForm.realWhCode = item.code;
                this.dataForm.nameTemp = this.dataForm.name;
            },
            handleRealListDelIconClick() {
                this.dataForm.name = this.dataForm.nameTemp = this.dataForm.realWhCode = this.dataForm.realWhCodeTemp = '';
            },
            back() {
                window.history.back();
            },
            //获取cookie
            getCookie(name) {
                let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
                return v ? v[2] : null;
            },
            changeEnable() {
                this.$refs['dataForm'].validate();
            }
        }
    }
</script>

<style lang="less">
    .ac-real-list-wrap { display: block; position: relative;
        .el-icon-circle-close { visibility: hidden; z-index: 5; }
        .el-input { z-index: 2; }
        input { background: none; }
        > i { position: absolute; top: 50%; right: 10px; transform: translateY(-50%); color: #bfcbd9; font-size: 12px; z-index: 1; }
        &:hover {
            > i { visibility: hidden; }
            .el-icon-circle-close { visibility: visible; }
        }
        .edit-dlg & { display: inline-block; }
        .edit-dlg & > i { right: 20px; }
    }
    .dialog-line {
        border: 0.5px solid rgba(121, 121, 121, 1);
        margin-top: -10px;
    }
    .el-form-item {
        margin-bottom: 10px !important;
    }

    .wrap {
        background-color: rgba(255, 255, 255, 1);
        -moz-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.349019607843137);
        -webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.349019607843137);
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.349019607843137);
        margin: 10px 20px;
        padding: 20px;
    }

    .head-title {
        color: #169BD5;
        font-weight: 700;
        font-size: 18px;
        border-bottom: 1px solid #797979;
        padding-bottom: 10px;
        margin-bottom: 30px;
    }

    .notice {
        color: #FF6600;
        font-size: 13px;
        margin-left: 30px;
        line-height: 25px;
    }

    .item-title {
        color: #169BD5;
        font-size: 14px;
        font-weight: 700;
    }

    .item-wrap {
        width: 554px;
        padding: 20px 0;
        border: 1px solid rgba(204, 204, 204, 1);
        margin-left: 32px;
        .prompt {
            color: #999999;
            font-size: 13px;
            padding-left: 5px;
        }
        .item-table {
            display: table;
            width: 360px;
            border-right: 1px solid #99CCFF;
            border-bottom: 1px solid #99CCFF;
            text-align: center;
            font-size: 13px;
            margin-top: 10px;
            .el-row {
                display: table-row;
            }
            .el-col {
                display: table-cell;
                border-top: 1px solid #99CCFF;
                border-left: 1px solid #99CCFF;
            }
        }
        .el-form-item__error{
            font-weight: normal;
            padding-left: 5px;
        }
    }

    .mt50 {
        margin-top: 50px;
    }

    .mt20 {
        margin-top: 20px;
    }

    .mt30 {
        margin-top: 30px;
    }

    .operateBar {
        margin-left: 32px;
        margin-top: 30px;
        margin-bottom: 50px;
        .el-button {
            padding: 10px 40px;
        }
    }

    .w100 {
        width: 100px;
    }

    .calc-bg {
        background: #F2F2F2;
        padding: 10px 0;
    }

    .inline-block{
        display: inline-block!important;
    }

    /*公式计算器*/
    .calc-wrap {
        font-size: 13px;
        .calc-num-wrap {
            display: inline-block;
            position: relative;
            margin: 0 5px;
            z-index: 999;
            .num-list{
                position: absolute;
                background: rgba(215, 215, 215, 1);
                padding: 10px;
                top: 35px;
                ul{
                    list-style: none;
                    display: table;
                    width: 130px;
                    border-right: 1px solid #797979;
                    border-bottom: 1px solid #797979;
                    text-align: center;
                    font-size: 12px;
                    line-height: 25px;
                    li{
                        display: table-row;
                        background: rgba(255, 255, 255, 1);
                        span{
                            display: table-cell;
                            cursor: pointer;
                            border-top: 1px solid rgba(121, 121, 121, 1);
                            border-left: 1px solid rgba(121, 121, 121, 1);
                        }
                    }
                }
            }
        }
        .calc-result {
            margin-top: 20px;
        }
        .calc-notice {
            color: #FF9900;
            font-size: 13px;
        }
    }
</style>
