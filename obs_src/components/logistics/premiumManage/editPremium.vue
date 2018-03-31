<!--编辑保费管理-->
<template>
    <div>
        <div class="el-container">
            <el-form :model="option" labelWidth="200px" ref="ruleForm">
                <el-form-item label="国家站渠道" prop="pipelineCode">
                    <el-row>
                        <el-col :span="6">
                            <el-select v-model="option.pipelineCode" clearable>
                                <el-option v-for="item in pipelineList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="国家" prop="countryNames">
                    <el-row>
                        <el-col :span="6">
                            <el-input readonly v-model="option.countryNames"></el-input>
                        </el-col>
                        <el-col :span="2" class="margin-left10">
                            <el-button type="primary" @click="editCountry">编辑</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="提示语">
                    <el-row>
                        <el-col :span="2">
                            <el-button type="primary" icon="plus" @click="newNotice">添加</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="">
                    <el-row  v-if="noticeForm.tips.length !== 0" v-for="(item, index) in noticeForm.tips" :key="index" class="marginbottom15">
                        <el-col :span="2">
                            <el-input readonly="readonly" :value="item.lang"></el-input>
                        </el-col>
                        <el-col :span="6" class="marginleft27 notice-content">
                            <el-input readonly="readonly" :value="item.noticeTxt"></el-input>
                        </el-col>
                        <el-col :span="6" class="marginleft27">
                            <el-button type="primary" icon="edit" @click="editTips(index)">编辑</el-button>
                            <el-button type="danger" icon="delete" @click="delTips(index)">删除</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="状态">
                    <el-row>
                        <el-col :span="6">
                            <el-radio-group v-model="option.status">
                                <el-radio :label="1">开启</el-radio>
                                <el-radio :label="0">关闭</el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="备注">
                    <el-row>
                        <el-col :span="6">
                            <el-input type="textarea" :rows="5" v-model="option.remark" :maxlength= '400' ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="操作">
                    <el-row>
                        <el-col :span="6">
                            <el-button type="primary" @click="saveForm">保存</el-button>
                            <el-button type="danger" @click="resetForm">返回</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>

        <!--弹窗 begin-->
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
        <!--弹窗 end-->

        <CountrySelect ref="countrySelect" :countryForm="dialogObj"></CountrySelect>
    </div>
</template>

<script>
    import Vue from 'vue'
    import logistics from '../js/logistics'
    Vue.use(logistics);
    import CountrySelect from '../template/countrySelect'

    export default {
        data (){
            return {
                self: this,
                row: JSON.parse(this.$route.query.row),
                pipelineList: [], //渠道
                option: {
                    countryCodeList: [],
                    countryNames: '',
                    pipelineCode: '',
                    tips: [],
                    status: '',
                    remark: '',
                },

                //提示语 参数
                noticeForm: {
                    noticeDialog: false,
                    language: '',
                    noticeTxt: '',
                    languageList: this.getMultiLan(1),
                    tips: [],
                    windowType: '',
                    index: '',
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
        }, // data end

        created () {
            this.initPage();
            this.pipelineList = this.getPipe();
            this.dialogObj.countryList = this.getCounryListFun();
        },

        watch: {
            'dialogObj.countryNamesSelected': function (val, oldval){
                if (val.length > 0) {
                    this.option.countryNames = val.join(";");
                }
            },
            'dialogObj.countryCodesSelected': function (val, oldval){
                if (val.length > 0) {
                    this.option.countryCodeList = val;
                }
            }
        },

        methods: {
            initPage () {
                this.$nextTick(() => {
                    this.option.pipelineCode = this.row.pipelineCode;
                });
                this.option.countryNames = this.row.countryNames;
                this.dialogObj.countryCodesSelected = this.row.countryCodes.split(',');
                this.option.status = this.row.status;
                this.option.remark = this.row.remark;

                if (this.row.tips) {
                    let tips = JSON.parse(this.row.tips);
                    for (let item in tips) {
                        let key = item;
                        let value = tips[key];
                        this.noticeForm.tips.push({lang: key, noticeTxt: value});
                    }
                }
            },

            editCountry (){
                this.dialogObj.countryDialog = true;
                setTimeout(() => {
                    this.$refs.countrySelect.init();
                },500);
            },

            newNotice (){
                this.noticeForm.windowType = 1;
                this.noticeForm.noticeDialog = true;
            },

            noticeSave (){
                let isExistSome = false;
                this.$refs['noticeRef'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (this.noticeForm.windowType === 1) {
                        if (this.noticeForm.tips.length === 0) {
                            this.noticeForm.tips.push({lang: this.noticeForm.language, noticeTxt: this.noticeForm.noticeTxt});
                            this.noticeClose();
                            return false;
                        } else {
                            for (let i=0; i<this.noticeForm.tips.length; i++) {
                                if (this.noticeForm.language === this.noticeForm.tips[i].lang) {
                                    isExistSome = true;
                                    break;
                                }
                            }
                        }
                        if (isExistSome) {
                            this.$message.error("该语言的提示语已存在");
                            return false;
                        } else {
                            this.noticeForm.tips.push({lang: this.noticeForm.language, noticeTxt: this.noticeForm.noticeTxt});
                            this.noticeClose();
                        }
                    } else {
                        let initLang = this.noticeForm.tips[this.noticeForm.index].lang;
                        if (initLang === this.noticeForm.language) {
                            this.noticeForm.tips[this.noticeForm.index].lang = this.noticeForm.language;
                            this.noticeForm.tips[this.noticeForm.index].noticeTxt = this.noticeForm.noticeTxt;
                            this.noticeClose();
                        } else {
                            for (let i=0; i<this.noticeForm.tips.length; i++) {
                                if (this.noticeForm.language === this.noticeForm.tips[i].lang) {
                                    isExistSome = true;
                                    break;
                                }
                            }
                            if (isExistSome) {
                                this.$message.error("该语言的提示语已存在");
                                return false;
                            } else {
                                this.noticeForm.tips[this.noticeForm.index].lang = this.noticeForm.language;
                                this.noticeForm.tips[this.noticeForm.index].noticeTxt = this.noticeForm.noticeTxt;
                                this.noticeClose();
                            }
                        }
                    }
                });
            },

            noticeClose (){
                this.$refs['noticeRef'].resetFields();
                this.noticeForm.noticeDialog = false;
            },

            editTips (index){
                this.noticeForm.noticeDialog = true;
                this.noticeForm.windowType = 2;
                this.noticeForm.index = index;
                this.noticeForm.language = this.noticeForm.tips[index].lang;
                this.noticeForm.noticeTxt = this.noticeForm.tips[index].noticeTxt;
            },

            delTips (index){
                this.$confirm('是否删除该项?','提示',{
                    type:'warning'
                }).then(() => {
                    this.noticeForm.tips.splice(index,1);
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

            saveForm (){
                let valide = this.formValide();
                if (!valide) {
                    return false;
                }

                let params = {
                    id: this.row.id,
                    pipelineCode: this.option.pipelineCode,
                    countryCodes: this.option.countryCodeList.join(),
                    status: this.option.status,
                    tips: '',
                    remark: this.option.remark,
                };

                let tipsArrTemp = [];
                let tipsObjTemp = {};
                this.noticeForm.tips.forEach( item => {
                    let obj ={};
                    obj[item.lang] = item.noticeTxt;
                    tipsArrTemp.push(obj);
                });

                tipsArrTemp.forEach(item=>{
                    for (let key in item) {
                        let key = key;
                        let val = item[key];
                        tipsObjTemp[key] = val;
                    }
                });
                params.tips = JSON.stringify(tipsObjTemp);

                //console.log(params);
                this.$http.post('logistics/premium-check/update', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success("保存成功!");
                        this.resetForm();
                    } else if (res.body.code === 60070) {
                        this.$message.error('该国家渠道已存在保费记录！');
                    } else {
                        this.$message.error(res.body.message);
                    }
                });

            },

            formValide (){
                if (!this.option.pipelineCode) {
                    this.$message.error('请选择国家站渠道!');
                    return false;
                }
                if (!this.option.countryNames) {
                    this.$message.error('请选择国家!');
                    return false;
                }
                if (this.noticeForm.tips.length === 0) {
                    this.$message.error('请添加提示语!');
                    return false;
                }
                return true;
            },

            resetForm (){
                this.$router.push({ name: "premiumManage" });
            }

        }, // methods end

        components: {
            CountrySelect
        }

    }
</script>

<style lang="less">
    .margin-left10{
        margin-left: 10px;
    }

    .marginleft27 {
        margin-left: 27px;
    }
    .marginbottom15 {
        margin-bottom: 15px;
    }
    .notice-content {
        width: 384px;
    }
    .language{
        margin-bottom: 20px !important;
    }
    .footer {
        margin-top: 12px;
        margin-right: 10px;
    }
</style>
