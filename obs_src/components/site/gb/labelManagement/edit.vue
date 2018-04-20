<!--活动标签编辑-->
<template>
    <div>
        <div class="el-container edit-pane">
            <el-form :model="form" label-width="120px" v-loading="isDataLoading" :rules="postRule" ref="postForm">
                <el-form-item label="标签类型：" prop="type">
                    <el-radio-group v-model="form.type" :disabled="isEdit">
                        <el-radio v-for="(item, index) in typeData" :label="item.id" :key="index">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否生效：" prop="is_effective">
                    <el-radio-group v-model="form.is_effective">
                        <el-radio v-for="(item, index) in statusData" :label="item.id" :key="index">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生效时间：">
                    <el-date-picker type="datetime" placeholder="开始时间" v-model="form.start_time"></el-date-picker>
                    <label>-</label>
                    <el-date-picker type="datetime" placeholder="结束时间" v-model="form.end_time"></el-date-picker>
                </el-form-item>
                <el-form-item label="标签名称：" prop="label_name">
                    <el-input v-model="form.label_name" class="w-400"></el-input>
                </el-form-item>
                <el-form-item label="多语言设置：">
                    <el-tabs type="card" v-model="form.lang" @tab-click="toggleLang">
                        <el-tab-pane v-for="(item, index) in langs" :disabled="isLangTag" :label="item.language_ch" :name="item.language_en" :key="index"></el-tab-pane>
                    </el-tabs>

                    <!--活动标-->
                    <template v-if="form.type === 1">
                        <el-form-item label="筛选项标题：" prop="filter_title" class="item">
                            <el-input v-model="form.filter_title" class="w-800"></el-input>
                        </el-form-item>
                        <el-form-item label="标签logo：" prop="logo" class="item">
                            <el-input v-model="form.logo" class="w-800"></el-input>
                        </el-form-item>
                        <el-form-item label="标签描述：" prop="label_desc" class="item">
                            <el-input v-model="form.label_desc" class="w-800"></el-input>
                        </el-form-item>
                    </template>
                    <!--活动标-->

                    <!--服务标-->
                    <template v-if="form.type === 2">
                        <el-form-item label="文字：" prop="service_text" class="item">
                            <el-input v-model="form.service_text" class="w-800"></el-input>
                        </el-form-item>

                        <div v-if="form.lang === 'en'">
                            <el-form-item label="排序：" prop="service_order" class="item">
                                <el-input v-model="form.service_order" class="w-400"></el-input>
                            </el-form-item>
                            <el-form-item label="文字颜色：" prop="text_color" class="item">
                                <el-input v-model.trim="form.text_color" class="w-400">
                                    <template slot="prepend">
                                        <span class="bg-pre" :style="{background: form.text_color}"></span>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="边框颜色：" prop="border_color" class="item">
                                <el-input v-model.trim="form.border_color" class="w-400">
                                    <template slot="prepend">
                                        <span class="bg-pre" :style="{background: form.border_color}"></span>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="背景颜色：" prop="background_color" class="item">
                                <el-input v-model.trim="form.background_color" class="w-400">
                                    <template slot="prepend">
                                        <span class="bg-pre" :style="{background: form.background_color}"></span>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </div>

                        <el-form-item label="标签描述：" prop="label_desc" class="item">
                            <el-input type="textarea" :rows="4" v-model="form.label_desc" class="w-400"></el-input>
                        </el-form-item>
                    </template>
                    <!--服务标-->

                </el-form-item>
                <el-form-item label-width="240px">
                    <el-button class="w-100" type="primary" @click="post()" v-if="ctrl">保存</el-button>
                    <el-button class="w-100" @click="goBack">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            let required = [{required: true, message: "该项不能为空"}];
            return {
                self: this,
                isDataLoading: false,
                isEdit: false,
                id: '',
                isLangTag: true,
                langs: {},
                form: {
                    type: 0,
                    is_effective: '',
                    start_time: '',
                    end_time: '',
                    label_name: '',
                    lang: 'en',
                    filter_title: '',
                    logo: '',
                    label_desc: '',
                    service_text: '',
                    service_order: '',
                    text_color: '',
                    border_color: '',
                    background_color: '',
                },
                typeData: [],
                statusData: [],
                postRule: {
                    label_name: required,
                    is_effective: required,
                    type: required,
                },
            }
        },
        computed: {
            ctrl() {
                if (this.$route.query['id']) {
                    return this.showAction_('promotion/label-management/edit');
                } else {
                    return this.showAction_('promotion/label-management/add');
                }
            },
        },
        created() {
            this.id = this.$route.query['id'];
            this.getCommonData();
            this.getLangs();

            if(this.id){
                this.isEdit = true;
                this.isLangTag = false;
                this.getData();
            }
        },
        methods: {
            async getCommonData() {
                const data = await this.httpGet_('promotion/label-management/common-select');
                this.typeData = data.typeData;
                this.statusData = data.statusData;
                if(typeof this.id === 'undefined') {
                    this.form.type = this.typeData[0].id;
                }

            },
            async getLangs() {
                const data = await this.httpGet_('admin/public/languages');
                this.langs = data;
            },
            /**
             * 获取详情
             * @param type  1：原始语言；2：其他语言
             * @returns {Promise<void>}
             */
            getData() {
                let params = {};
                params.id = this.id;
                this.isDataLoading = true;
                try {
                    this.$http.get('promotion/label-management/info' , {params: params}).then( res => {
                        if(res.body.code === 0) {
                            let tempData = Object.assign(this.form, res.body.data);
                            this.form = tempData;
                            this.form.start_time = this.timeZone_(this.form.start_time, this.$store.getters.getTimeZone);
                            this.form.end_time = this.timeZone_(this.form.end_time, this.$store.getters.getTimeZone);
                        }
                    });
                } finally {
                    this.isDataLoading = false;
                }
            },
            post() {
                this.$refs['postForm'].validate(valid => {
                   if(valid) {
                       if(this.form.start_time === '') {
                           this.$message({
                               type: 'warning',
                               message: '开始时间不能为空！'
                           });
                           return false;
                       }

                       let src = 'promotion/label-management/add';
                       if (this.id) {
                           src = 'promotion/label-management/edit';
                       }

                       let params = JSON.parse(JSON.stringify(this.form));
                       params.start_time = params.start_time === '' ? '' : this.timeZone_(new Date(params.start_time), this.$store.getters.getTimeZone);
                       params.end_time = params.end_time === '' ? '' : this.timeZone_(new Date(params.end_time), this.$store.getters.getTimeZone);
                       if(this.form.lang === 'en') {
                           delete params.lang;
                       }else {
                           this.form.id = this.id;
                       }

                       this.isDataLoading = true;
                       this.$http.post(src, params).then(res => {
                           this.isDataLoading = false;
                           if (res.body.code === 0) {
                               this.$message.success(res.body.message);
                               this.goBack();
                           } else {
                               this.$message.error(res.body.message);
                           }
                       }).catch(err => {
                           this.isDataLoading = false;
                       });
                   }
                });
            },
            //切换语言
            toggleLang(val) {
                console.log(val);
                if(val.name === 'en') {
                    this.getData();
                }else{
                    let params = {
                        id: this.id,
                        lang: val.name
                    };
                    this.isDataLoading = true;
                    try {
                        this.$http.get('promotion/label-management/info' , {params: params}).then( res => {
                            if(res.body.code === 0) {
                               let tempData = Object.assign(this.form, res.body.data);
                               this.form = tempData;
                            }else {
                                this.form.filter_title = '';
                                this.form.logo = '';
                                this.form.label_desc = '';
                                this.form.service_text = '';
                            }
                        });
                    } finally {
                        this.isDataLoading = false;
                    }
                }
            },
            goBack () {
                this.$router.push({
                    name: 'labelManagementLists'
                })
            },
        }
    }
</script>

<style scoped lang="less">
    .w-100{width: 100px;}
    .w-200{width: 200px;}
    .w-400{width: 400px;}
    .w-800{width: 800px;}
    .item{
        margin: 20px 0;
    }
    .bg-pre {
        height: 28px;
        width: 28px;
        margin-top: 1px;
        border: 1px solid #ccc;
        display: inline-block;
    }
</style>
