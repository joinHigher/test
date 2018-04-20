<template>
    <div>
        <div class="el-container">
            <el-form :model="form" ref="form" :rules="rules"  label-width="270px"  class="form">
                <el-form-item label="地址字段" prop="address_name">
                    <el-select v-model="form.address_name"  placeholder="请选择" class="form-item" @change="checkEXist">
                        <el-option v-for="(item, key) in fields" :key="key" :label="item" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指定国家" prop="country">
                    <el-select v-model="form.country"  placeholder="请选择" class="form-item" @change="checkEXist">
                        <el-option label="通用" value="all"></el-option>
                        <el-option v-for="(item, key) in countrys" :key="key" :label="item" :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="必填限制" prop="is_require">
                    <el-radio-group v-model="form.is_require">
                        <el-radio label="1">必填</el-radio>
                        <el-radio label="0">选填</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="正则表达式" prop="regex">
                    <el-input v-model="form.regex" type="textarea" class="form-item" :rows="4"></el-input>
                </el-form-item>

                <el-form-item label="内容为空提示语（选填）">
                    <el-row class="msg-item" :key="index" v-for="(emptyMsg, index) in form.empty_msg">
                        <el-col :span="4">
                            <el-form-item :prop="'empty_msg.' + index + '.lang'" label-width="0px" :rules="index===0 ? [
                                    { required: true, message: '语言不为空', trigger: 'change' }
                                ] : []">
                                <el-select v-model="emptyMsg.lang"  placeholder="请选择" filterable :disabled="index === 0 ? true : false">
                                    <el-option v-for="item in langs" :key="item.language_code" :label="item.language_name" :value="item.language_code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="7">
                            <el-form-item :prop="'empty_msg.' + index + '.message'" label-width="0px">
                                <el-input v-model="emptyMsg.message"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="3">
                            <el-button @click="add('empty')" type="primary" icon="plus"></el-button>
                            <el-button @click="remove('empty', index)" type="danger" v-if="index !== 0" icon="minus"></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item label="输入错误提示语（选填）">
                    <el-row class="msg-item" :key="index" v-for="(errorMsg, index) in form.error_msg">
                        <el-col :span="4">
                            <el-form-item :prop="'error_msg.' + index + '.lang'" label-width="0px" :rules="index===0 ? [
                                    { required: true, message: '语言不为空', trigger: 'change' }
                                ] : []">
                                <el-select v-model="errorMsg.lang"  placeholder="请选择" filterable :disabled="index === 0 ? true : false">
                                    <el-option v-for="item in langs" :key="item.language_code" :label="item.language_name" :value="item.language_code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="7">
                            <el-form-item :prop="'error_msg.' + index + '.message'" label-width="0px">
                                <el-input v-model="errorMsg.message"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="5">
                            <el-button @click="add('error')" type="primary" icon="plus"></el-button>
                            <el-button @click="remove('error', index)" type="danger" v-if="index !== 0" icon="minus"></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>


                <el-form-item label="文本框内默认提示语（选填）">
                    <el-row class="msg-item" :key="index" v-for="(textInsideMsg, index) in form.text_inside_msg">
                        <el-col :span="4">
                            <el-form-item :prop="'text_inside_msg.' + index + '.lang'" label-width="0px">
                                <el-select v-model="textInsideMsg.lang"  placeholder="请选择" filterable :disabled="index === 0 ? true : false">
                                    <el-option v-for="item in langs" :key="item.language_code" :label="item.language_name" :value="item.language_code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="7">
                            <el-form-item :prop="'text_inside_msg.' + index + '.message'" label-width="0px">
                                <el-input v-model="textInsideMsg.message"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="5">
                            <el-button @click="add('textInside')" type="primary" icon="plus"></el-button>
                            <el-button @click="remove('textInside', index)" type="danger" v-if="index !== 0" icon="minus"></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>


                <el-form-item label="文本框下方提示语（选填）">
                    <el-row class="msg-item" :key="index" v-for="(textBelowMsg, index) in form.text_below_msg">
                        <el-col :span="4">
                            <el-form-item :prop="'text_below_msg.' + index + '.lang'" label-width="0px">
                                <el-select v-model="textBelowMsg.lang"  placeholder="请选择" filterable :disabled="index === 0 ? true : false">
                                    <el-option v-for="item in langs" :key="item.language_code" :label="item.language_name" :value="item.language_code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="7">
                            <el-form-item :prop="'text_below_msg.' + index + '.message'" label-width="0px">
                                <el-input v-model="textBelowMsg.message"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"></el-col>
                        <el-col :span="5">
                            <el-button @click="add('textBelow')" type="primary" icon="plus"></el-button>
                            <el-button @click="remove('textBelow', index)" type="danger" v-if="index !== 0" icon="minus"></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" class="form-item" :rows="4"></el-input>
                </el-form-item>

                <el-form-item label="">
                    <el-button type="primary" :loading="dataLoading" @click="save" v-if="ctrl">确认</el-button>
                    <el-button type="default" @click="goBack">返回</el-button>
                </el-form-item>

            </el-form>

        </div>
    </div>
</template>

<script>

    import httpGet, { httpPost, getAllCountrys, getFields, getLangs } from '../../../../common/baseApi'

    let defaultOpt = {
        address_name: '',
        country: '',
        status: '',
        is_require: '',
        regex: '',
        empty_msg: [{
            lang: 'en',
            message: ''
        }],
        error_msg: [{
            lang: 'en',
            message: ''
        }],
        text_inside_msg: [{
            lang: 'en',
            message: ''
        }],
        text_below_msg: [{
            lang: 'en',
            message: ''
        }],
        remark: ''
    }
    export default {
        data() {
            // let checkEmptyMsg = (rule, val, callback) => {
            //     let exp = /^[a-zA-Z\ ]*$/;
            //     if (exp.test(val)) {
            //         callback();
            //     } else {
            //         callback(new Error('输入框限制英文输入'));
            //     }
            // }
            return {
                // checkEmptyMsg: checkEmptyMsg,
                checkFlag: true,
                dataLoading: false,
                form: JSON.parse(JSON.stringify(defaultOpt)),
                langs: null,
                fields: null,
                countrys: null,
                isEdit: false,
                rules: {
                    address_name: [
                        { required: true, message: '请选择地址字段', trigger: 'change' }
                    ],
                    country: [
                        { required: true, message: '请选择指定国家', trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请选择生效状态', trigger: 'change' }
                    ],
                    is_require: [
                        { required: true, message: '请选择必填限制', trigger: 'change' }
                    ],
                    is_require: [
                        { required: true, message: '请选择必填限制', trigger: 'change' }
                    ],
                    regex: [
                        { required: true, message: '请填写正则表达式', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.initData();
        },
        computed: {
            ctrl() {
                if (this.$route.query['id']) {
                    return this.showAction_('admin/address-rule/edit');
                } else {
                    return this.showAction_('admin/address-rule/add');
                }
            },
        },
        methods: {
            
            initData() {
                this.getLangs();
                this.getFields();
                this.getCountrys();
                this.isEdit = this.$route.query.id ? true : false;
                if(this.isEdit) {
                    this.getInfo();
                }
            },
            // 获取语言列表
            async getLangs() {
                const data = await getLangs();
                this.langs = data;                
            },
            // 获取字段名称
            async getFields() {
                const data = await getFields();
                this.fields = data;
            },
            // 获取国家列表
            async getCountrys() {
                const data = await getAllCountrys();
                let countrys = {};
                data.forEach((item) => {
                    countrys[item.countryCode] = item.countryName;
                });
                this.countrys = countrys;
            },

            // 获取banner分类馆详细信息
            async getInfo() {
                this.checkFlag = false;
                let params = {
                    id: this.$route.query.id
                }
                const data = await httpGet('admin/address-rule/info', {
                    params
                });
                let parseData = this.handleEditInitParams(data);
                this.form = Object.assign({}, defaultOpt, parseData);
                this.$nextTick(() => {
                    this.checkFlag = true;
                })
            },
            //编辑附值
            handleEditInitParams(params) {
                params.status = String(params.status);
                params.is_require = String(params.is_require);
                params.empty_msg = JSON.parse(params.empty_msg);
                params.error_msg = JSON.parse(params.error_msg);
                params.text_below_msg = JSON.parse(params.text_below_msg);
                params.text_inside_msg = JSON.parse(params.text_inside_msg);
                delete params.add_time;
                delete params.update_time;
                return params;
            },
            // 添加一行
            add(type) {
                switch(type) {
                    case 'empty':
                        this.form.empty_msg.push({
                            lang: '',
                            message: ''
                        });
                    break;
                    case 'error':
                        this.form.error_msg.push({
                            lang: '',
                            message: ''
                        });
                    break;
                    case 'textInside':
                        this.form.text_inside_msg.push({
                            lang: '',
                            message: ''
                        });
                    break;
                    case 'textInside':
                        this.form.text_below_msg.push({
                            lang: '',
                            message: ''
                        });
                    break;
                }
            },
            // 移除一行
            remove(type, index) {
                switch(type) {
                    case 'empty':
                        this.form.empty_msg.splice(index, 1);
                    break;
                    case 'error':
                        this.form.error_msg.splice(index, 1);
                    break;
                    case 'textInside':
                        this.form.text_inside_msg.splice(index, 1);
                    break;
                    case 'textInside':
                        this.form.text_below_msg.splice(index, 1);
                    break;
                }
            },
            // 保存
            save() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.dataLoading = true;
                        let params = JSON.parse(JSON.stringify(this.form));
                        if(this.isEdit) {
                            params.id = this.$route.query.id;
                        }
                        try {
                            const { code, message } = await httpPost('admin/address-rule/' + (this.isEdit ? 'edit' : 'add'), params);
                            if(code === 0) {
                                this.dataLoading = false;
                                this.$message({
                                    type: 'success',
                                    message: message || '保存成功！'
                                });  
                                if(!this.isEdit){
                                    this.goBack();
                                }
                            }
                        } finally {
                            this.dataLoading = false;
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            async checkEXist() {
                let address_name = this.form.address_name,
                    country = this.form.country;
                if (this.checkFlag && address_name && country) {
                    const data = await this.httpGet_('admin/address-rule/check-address-name-is-exist', {
                        params: {country,address_name}
                    });
                    if (data.isExist) {
                        this.$alert('指定国家+字段不能重复', '提示');
                    }
                }
            },
            // 返回
            goBack() {
                this.$router.push({ name: 'addressCheckList' });
            }
        }
    }
</script>
<style lang="less">
    .form{
        .form-item{
            width: 400px;
        }
        .el-col-1 {
            height: 36px;
            width: 1%;
        }
        .msg-item{
            margin-bottom: 20px;
        }
    }
</style>
