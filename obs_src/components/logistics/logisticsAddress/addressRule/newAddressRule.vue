<!--新增地址填写规则-->
<template>
    <div>
        <div class="el-container">
            <el-form :model="option" labelWidth="200px" ref="ruleForm">
                <el-form-item label="名称">
                    <el-row>
                        <el-col :span="6">
                            <el-input v-model="option.name" :maxlength="100"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="物流方式">
                    <el-row>
                        <el-col :span="6">
                            <el-select v-model="option.logisticsCode" filterable placeholder="请选择物流方式" clearable>
                                <el-option v-for="(item, index) in logisticsDataList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="国家">
                    <el-row>
                        <el-col :span="6">
                            <el-input readonly v-model="option.countryNames"></el-input>
                        </el-col>
                        <el-col :span="2" class="margin-left10">
                            <el-button type="primary" @click="editCountry">编 辑</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="限制条件">
                    <el-button type="primary" @click="conditionForm.dialog = true">编 辑</el-button>
                </el-form-item>
                <el-form-item label="已设定条件">
                    <div v-for="(item, index) in condResArr" :key="index" class="cond-item-box" v-if="item.show === true">
                        <el-row>
                            <el-col :span="2">
                                <el-input readonly="readonly" :value="item.conditionName"></el-input>
                            </el-col>
                            <el-col :span="2">&nbsp;</el-col>
                            <el-col :span="2">
                                <el-input placeholder="请输入" v-model="item.beginCount"></el-input>
                            </el-col>
                            <el-col :span="1" class="text-center">到</el-col>
                            <el-col :span="2">
                                <el-input placeholder="请输入" v-model="item.endCount"></el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="1">提示语</el-col>
                            <el-col :span="2">
                                <el-button type="primary" icon="plus" @click="newNotice(index)">添 加</el-button>
                            </el-col>
                        </el-row>
                        <el-row  v-if="item.tips.length !== 0" v-for="(notice, noticeIndex) in item.tips" :key="noticeIndex" class="marginbottom15">
                            <el-col :span="2">
                                <el-input readonly="readonly" :value="notice.lang"></el-input>
                            </el-col>
                            <el-col :span="6" class="marginleft27 notice-content">
                                <el-input readonly="readonly" :value="notice.noticeTxt" :maxlength= '200'></el-input>
                            </el-col>
                            <el-col :span="6" class="marginleft27">
                                <el-button type="primary" icon="edit" @click="editTips(index, noticeIndex)">编辑</el-button>
                                <el-button type="danger" icon="delete" @click="delTips(index, noticeIndex)">删除</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
                <el-form-item label="操作">
                    <el-row>
                        <el-col :span="6">
                            <el-button type="primary" @click="ruleFormSave">保存</el-button>
                            <el-button type="danger" @click="resetForm">返回</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>

        <!--弹窗s-->
        <el-dialog title="选择限制条件" v-model="conditionForm.dialog" class="log-group" size="tiny">
            <el-checkbox-group v-model="conditionForm.checkList">
                <el-row>
                    <el-col :span="12">
                        <h4>英文地址一</h4>
                        <el-checkbox label="1">长度</el-checkbox>
                    </el-col>
                    <el-col :span="12">
                        <h4>英文地址二</h4>
                        <el-checkbox label="2">长度</el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <h4>其他地址一</h4>
                        <el-checkbox label="3">长度</el-checkbox>
                    </el-col>
                    <el-col :span="12">
                        <h4>其他地址二</h4>
                        <el-checkbox label="4">长度</el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <h4>姓名</h4>
                        <el-checkbox label="5">长度</el-checkbox>
                    </el-col>
                    <el-col :span="12">
                        <h4>电话</h4>
                        <el-checkbox label="6">长度</el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <h4>邮编</h4>
                        <el-checkbox label="7">长度</el-checkbox>
                    </el-col>
                </el-row>
            </el-checkbox-group>
            <div class="text-right footer">
                <el-button type="primary" @click="condSubmit">确定</el-button>
                <el-button type="danger" @click="condCancel">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="提示语" v-model="noticeForm.noticeDialog" class="log-group" size="tiny" :before-close="noticeClose">
            <el-form :model="noticeForm" ref="noticeRef" :rules="noticeRules">
                <el-form-item class="language" prop="language">
                    <el-select v-model="noticeForm.language" clearable filterable>
                        <el-option v-for="(item, index) in noticeForm.languageList" :key="item.lang" :value="item.lang" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="noticeTxt">
                    <el-input v-model="noticeForm.noticeTxt" :maxlength= '200'></el-input>
                </el-form-item>
                <div class="text-right footer">
                    <el-button type="primary" @click="noticeSave">确定</el-button>
                    <el-button type="danger" @click="noticeClose">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!--弹窗e-->

        <CountrySelect ref="countrySelect" :countryForm="dialogObj"></CountrySelect>
    </div>
</template>

<script>
    import Vue from 'vue'
    import logistics from '../../js/logistics'
    Vue.use(logistics);
    import CountrySelect from '../../template/countrySelect'

    export default {
        data () {
            return {
                self: this,
                option: {
                    name: '',
                    logisticsCode: '',
                    logisticsName: '',
                    countryNames: '',
                    countryCodeList: [],
                    itemList: []
                },
                logisticsDataList: this.getLogisticsWay(), //物流方式数组

                conditionForm: {
                    dialog: false,
                    checkList: [],
                },

                condResArr: [
                    {
                        conditionName: '英文地址一',
                        category: 1,
                        attrType: 1,
                        beginCount: '',
                        endCount: '',
                        attrVal: '',
                        tips: [],
                        show: false,
                    },
                    {
                        conditionName: '英文地址二',
                        category: 2,
                        attrType: 1,
                        beginCount: '',
                        endCount: '',
                        attrVal: '',
                        tips: [],
                        show: false,
                    },
                    {
                        conditionName: '其它地址一',
                        category: 3,
                        attrType: 1,
                        beginCount: '',
                        endCount: '',
                        attrVal: '',
                        tips: [],
                        show: false,
                    },
                    {
                        conditionName: '其它地址二',
                        category: 4,
                        attrType: 1,
                        beginCount: '',
                        endCount: '',
                        attrVal: '',
                        tips: [],
                        show: false,
                    },
                    {
                        conditionName: '姓名',
                        category: 5,
                        attrType: 1,
                        beginCount: '',
                        endCount: '',
                        attrVal: '',
                        tips: [],
                        show: false,
                    },
                    {
                        conditionName: '电话',
                        category: 6,
                        attrType: 1,
                        beginCount: '',
                        endCount: '',
                        attrVal: '',
                        tips: [],
                        show: false,
                    },
                    {
                        conditionName: '邮编',
                        category: 7,
                        attrType: 1,
                        beginCount: '',
                        endCount: '',
                        attrVal: '',
                        tips: [],
                        show: false,
                    }
                ],

                //提示语 参数
                noticeForm: {
                    currentCondIndex: '',
                    noticeDialog: false,
                    language: '',
                    noticeTxt: '',
                    languageList: this.getMultiLan(1),
                    windowType: '',
                    noticeIndex: '',
                },

                noticeRules: {
                    language: [{required: true, message: '请选择语言', trigger: 'change'}],
                    noticeTxt: [{required: true, message: '请输入提示信息', trigger: 'blur'}],
                },

                dialogObj: {
                    title: '选择国家',
                    countryDialog: false,
                    key: '',  //查询关键字
                    countryList: [], //所有国家列表
                    countryNamesSelected: [], //被选择的国家名称
                    countryCodesSelected: [], //被选择的国家code
                },
            }
        },

        watch: {
            'dialogObj.countryNamesSelected': function (val, oldval){
                if (val.length > 0) {
                    this.option.countryNames = val.join("；");
                }
            },
            'dialogObj.countryCodesSelected': function (val, oldval){
                if (val.length > 0) {
                    this.option.countryCodeList = val;
                }
            }
        },

        created () {
            this.dialogObj.countryList = this.getCounryListFun();
        },

        methods: {
            editCountry (){
                this.dialogObj.countryDialog = true;
                setTimeout(() => {
                    this.$refs.countrySelect.init();
                },500);
            },

            condSubmit () {
                let list = this.conditionForm.checkList;
                this.condResArr.forEach(item => {
                    item.show = false;
                });
                if (list.length > 0) {
                    this.condResArr.forEach(condition => {
                        list.forEach(item => {
                            if (condition.category === Number(item)) {
                                condition.show = true;
                            }
                        });
                    });
                }
                this.conditionForm.dialog = false;
            },

            condCancel () {
                this.conditionForm.dialog = false;
            },

            newNotice (index) {
                this.noticeForm.windowType = 1;
                this.noticeForm.currentCondIndex = index;
                this.noticeForm.noticeDialog = true;
            },

            noticeSave (){
                let isExistSome = false;
                let currentTips = this.condResArr[this.noticeForm.currentCondIndex].tips;
                this.$refs['noticeRef'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (this.noticeForm.windowType === 1) {  // 新建保存
                        if (currentTips.length === 0) {
                            currentTips.push({ lang: this.noticeForm.language, noticeTxt: this.noticeForm.noticeTxt });
                            this.noticeClose();
                            return false;
                        } else {
                            for (let i=0; i<currentTips.length; i++) {
                                if (this.noticeForm.language === currentTips[i].lang) {
                                    isExistSome = true;
                                    break;
                                }
                            }
                        }
                        if (isExistSome) {
                            this.$message.error("该语言的提示语已存在");
                            return false;
                        } else {
                            currentTips.push({ lang: this.noticeForm.language, noticeTxt: this.noticeForm.noticeTxt });
                            this.noticeClose();
                        }
                    } else {   //编辑保存
                        let initLang = currentTips[this.noticeForm.noticeIndex].lang;
                        if (initLang === this.noticeForm.language) {  //语言类型没被改变
                            currentTips[this.noticeForm.noticeIndex].lang = this.noticeForm.language;
                            currentTips[this.noticeForm.noticeIndex].noticeTxt = this.noticeForm.noticeTxt;
                            this.noticeClose();
                        } else {  //语言类型被改变
                            for (let i=0; i<currentTips.length; i++) {
                                if (this.noticeForm.language === currentTips[i].lang) {
                                    isExistSome = true;
                                    break;
                                }
                            }
                            if (isExistSome) {
                                this.$message.error("该语言的提示语已存在");
                                return false;
                            } else {
                                currentTips[this.noticeForm.noticeIndex].lang = this.noticeForm.language;
                                currentTips[this.noticeForm.noticeIndex].noticeTxt = this.noticeForm.noticeTxt;
                                this.noticeClose();
                            }
                        }
                    }
                })
            },

            noticeClose (){
                this.$refs['noticeRef'].resetFields();
                this.noticeForm.noticeDialog = false;
            },

            editTips (index, noticeIndex){
                let currentTips = this.condResArr[index].tips;
                this.noticeForm.noticeDialog = true;
                this.noticeForm.windowType = 2;
                this.noticeForm.currentCondIndex = index;
                this.noticeForm.noticeIndex = noticeIndex;
                this.noticeForm.language = currentTips[noticeIndex].lang;
                this.noticeForm.noticeTxt = currentTips[noticeIndex].noticeTxt;
            },

            delTips (index, noticeIndex){
                let targerTips = this.condResArr[index].tips;
                this.$confirm('是否删除该项?','提示',{
                    type:'warning'
                }).then(() => {
                    targerTips.splice(noticeIndex,1);
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                }).catch(() => {
                    this.$message({
                        type:'info',
                        message:'已取消删除'
                    });
                });
            },

            ruleFormSave () {
                if (!this.option.name) {
                    this.$message.error("请输入规则名称!");
                    return false;
                }
                if (!this.option.logisticsCode) {
                    this.$message.error("请选择物流方式!");
                    return false;
                }
                if (!this.option.countryNames) {
                    this.$message.error("请选择国家!");
                    return false;
                }
                if (this.conditionForm.checkList.length === 0) {
                    this.$message.error("请设置限制条件!");
                    return false;
                }
                let condListSelected = [];
                this.condResArr.forEach(item => {
                    if (item.show) {
                        condListSelected.push(item);
                    }
                });

                let isOk = '';
                for (let i=0; i<condListSelected.length; i++) {
                    let cond = condListSelected[i];
                    let reg = /^\+?[1-9]\d*$/;
                    let beginValue = parseInt(cond.beginCount);
                    let endValue = parseInt(cond.endCount);
                    if (!cond.beginCount && !cond.endCount) {
                        this.$message.error("请输入起始值和结束值!");
                        isOk = false;
                        break;
                    }
                    if ( (cond.beginCount && !reg.test(cond.beginCount)) || (cond.beginCount && beginValue > 1000) ||
                        (cond.endCount && !reg.test(cond.endCount)) || (cond.endCount && endValue > 1000) ) {
                        this.$message.error('请输入大于0小于1000的整数!');
                        isOk = false;
                        break;
                    }
                    if ( (cond.beginCount && cond.endCount) && (beginValue > endValue) ) {
                        this.$message.error("起始值不能大于结束值!");
                        isOk = false;
                        break;
                    }
                    if (cond.tips.length === 0) {
                        this.$message.error("请添加提示语!");
                        isOk = false;
                        break;
                    }
                    isOk = true;

                    if (!cond.beginCount && cond.endCount) {
                        cond.attrVal = '-' + endValue;
                    }
                    if (cond.beginCount && !cond.endCount) {
                        cond.attrVal = beginValue + '-';
                    }
                    if (cond.beginCount && cond.endCount) {
                        cond.attrVal = beginValue + '-' + endValue;
                    }
                }

                if (!isOk) {
                    return false;
                }

                let params = {
                    name: this.option.name,
                    countryCodes: this.option.countryCodeList.join(),
                    logisticsCode: this.option.logisticsCode,
                    logisticsName: '',
                    itemList: [],
                };

                this.logisticsDataList.forEach(item => {
                    if (this.option.logisticsCode === item.code) {
                        params.logisticsName = item.name;
                    }
                });

                let tempItemList= [];
                condListSelected.forEach(cond => {
                    let tempObj = {};
                    cond.tips.forEach(item => {
                        tempObj[item.lang] = item.noticeTxt;
                    });
                    tempItemList.push(
                        {
                            category: cond.category,
                            attrType: cond.attrType,
                            attrVal: cond.attrVal,
                            tips: JSON.stringify(tempObj)
                        }
                    );
                });

                params.itemList = tempItemList.slice(0);
                console.log(params);
                this.$http.post('logistics/address-rule/add', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success("保存成功!");
                        this.resetForm();
                    } else if (res.body.code === 60069) {
                        this.$message.error("地址填写规则名称不能重复!");
                    } else  {
                        this.$message.error(res.body.message);
                    }
                });
            },

            resetForm () {
                this.$router.push({ name: "addressRule" });
            },
        },

        components: {
            CountrySelect
        }
    }
</script>

<style lang="less" scoped>

    .margin-left10{
        margin-left: 10px;
    }

    .marginbottom15 {
        margin-bottom: 15px;
    }

    .marginleft27 {
        margin-left: 27px;
    }

    .notice-content {
        width: 384px;
    }

    h4 {
        margin-top: 10px;
    }

    .cond-item-box {
        margin-top: 30px;
        padding-bottom: 30px;
        border-bottom: 1px dotted #ccc;

        .el-row {
            margin-top: 20px;
        }
    }

    .language{
        margin-bottom: 20px !important;
    }
    .footer {
        margin-top: 12px;
        margin-right: 10px;
    }
</style>
