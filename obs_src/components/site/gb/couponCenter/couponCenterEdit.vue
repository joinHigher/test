<!-- gb 领劵中心编辑 -->
<template>
    <div class="gb-coupon-center-edit">
        <div class="el-container" v-loading="fullLoading">
            <el-form :model="option" label-width="150px" ref="postForm">
                <el-form-item label="语言" prop="lang" :rules="required">
                    <el-select clearable filterable v-model="option.lang">
                        <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code" :rules="required">
                    <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台" prop="platform" :rules="required">
                    <el-checkbox-group v-model="option.platform">
                        <el-checkbox v-for="(item, index) in platOpt" :key="index" :label="index">{{item}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="coupon" prop="coupon" :rules="required">
                    <el-row>
                        <el-col :span="12">
                            <el-input v-model="option.coupon"></el-input>
                        </el-col>
                        <el-col :span="6" :offset="1">
                            <el-button v-loading="getLoading" :disabled="getLoading || !option.coupon" type="primary" @click="getCoupon">获取coupon链接</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="option.title" readonly></el-input>
                </el-form-item>
                <el-form-item label="优惠卷类型" prop="coupon_type">
                    <el-select v-model="option.coupon_type" :disabled="true">
                        <el-option v-for="(item, index) in coupon_type_dropdown" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠券分类" prop="category_id" :rules="required">
                    <el-select v-model="option.category_id">
                        <el-option v-for="(item, index) in catOpt" :value="index" :key="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效时间" prop="date">
                    <el-date-picker :disabled="true" v-model="option.date" type="datetimerange" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="领券时间" prop="receiveDate" :rules="[{type: 'array', required: true, message: '该项不能为空'} ,{validator: checkDateArr}]">
                    <el-date-picker v-model="option.receiveDate" type="datetimerange" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="PC端自定义图片" prop="coupon_pc_image">
                    <el-input v-model="option.coupon_pc_image"></el-input>
                </el-form-item>
                <el-form-item label="M端自定义图片" prop="coupon_wap_image">
                    <el-input v-model="option.coupon_wap_image"></el-input>
                </el-form-item>
                <el-form-item label="显示" prop="is_show">
                    <el-radio-group v-model="option.is_show">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="显示剩余数" prop="is_show_process">
                    <el-radio-group v-model="option.is_show_process">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用户类型" prop="user_type">
                    <el-radio-group v-model="option.user_type">
                        <el-radio :disabled="true" label="0">所有用户</el-radio>
                        <el-radio :disabled="true" label="1">新用户</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="优惠券发放数" prop="grant_total_count">
                    <el-input :disabled="true" v-model="option.grant_total_count"></el-input>
                </el-form-item>
                <el-form-item label="单用户领取数" prop="grant_user_count">
                    <el-input :disabled="true" v-model="option.grant_user_count"></el-input>
                </el-form-item>
                <el-form-item label="失效时间" prop="expired_hour">
                    <el-input :disabled="true" v-model="option.expired_hour"></el-input>
                </el-form-item>
                <el-form-item label="coupon使用链接" prop="coupon_use_link">
                    <el-row v-for="(item, index) in option.coupon_use_link" :key="index" class="link-item">
                        <el-col :span="3">{{index}}</el-col>
                        <el-col :span="12">
                            <el-input :disabled="true" v-model="option.coupon_use_link[index]"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
<!--                 <el-form-item label="失效返还" prop="is_invalid_return">
                    <el-radio-group v-model="option.is_invalid_return">
                        <el-radio label="0">否</el-radio>
                        <el-radio label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <div class="text-center">
                    <el-button type="primary" @click="post" v-loading="postLoding" :disabled="postLoding" v-if="ctrl">保存</el-button>
                    <el-button type="danger" @click="goback">返回</el-button>
                </div>
            </el-form>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let checkDateArr = (rule, value, callback) => {
            if (Boolean(value[0]) && Boolean(value[1])) {
                callback();
            } else {
                callback('该项不能为空')
            }
        };

        let required = [{required: true, message: '该项不能为空'}];

        return {
            required: required,
            checkDateArr: checkDateArr,
            postLoding: false,
            fullLoading: false,
            getLoading: false,
            catOpt: {},
            coupon_type_dropdown: {},
            platOpt: {
                '1': 'WEB',
                '2': 'WAP',
                '3': 'IOS',
                '4': 'ANDROID',
                '5': 'PAD',
            },
            option: {
                title: '',
                date: [],
                receiveDate: [],
                platform: [],
                coupon: '',
                category_id: '',
                is_show: '',
                is_show_process: '',
                receive_start_time: '',
                receive_end_time: '',
                expired_hour: '',
                user_type: '',
                coupon_type: '',
                coupon_use_link: {},
                grant_total_count: '',
                grant_user_count: '',
                coupon_pc_image: '',
                coupon_wap_image: '',
                lang: '',
                pipeline_code: '',
            },
            langOpt: {},
            id: this.$route.query.id,
        };
    },
    computed: {
        ctrl() {
            if (this.id) {
                return this.showAction_('admin/coupon-center/edit');
            } else {
                return this.showAction_('admin/coupon-center/add');
            }
        },
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getLangOpt();
        this.getOpt();
    },
    methods: {
        getLangOpt() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        getOpt () {
            this.$http.get('admin/coupon-center-category/category-dropdown').then(res => {
                if (res.body.code === 0) {
                    this.catOpt = res.body.data;
                    if (this.id) {
                        this.getData();
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        getData() {
            this.$http.get('admin/coupon-center/info', {params: {id: this.id}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let keyList = Object.keys(data);

                    this.coupon_type_dropdown = data.coupon_type_dropdown;
                    for (let i in this.option) {
                        if (keyList.indexOf(i) != -1) {
                            this.option[i] = data[i];
                        }
                    }

                    let date1 = this.timeZone_(data.receive_start_time, this.$store.getters.getTimeZone);
                    let date2 = this.timeZone_(data.receive_end_time, this.$store.getters.getTimeZone);
                    this.option.receiveDate = [new Date(date1), new Date(date2)];

                    let date3 = this.timeZone_(data.start_time, this.$store.getters.getTimeZone);
                    let date4 = this.timeZone_(data.end_time, this.$store.getters.getTimeZone);
                    this.option.date = [new Date(date3), new Date(date4)];

                    this.option.platform = this.option.platform.split(',');
                    this.option.category_id = String(this.option.category_id);
                    this.option.coupon_type = String(this.option.coupon_type);
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });
        },
        getCoupon () {
            this.getLoading = true;
            this.$http.get('admin/coupon-center/template-info', {params: {coupon: this.option.coupon}}).then(res => {
                this.getLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.coupon_type_dropdown = data.coupon_type_dropdown;
                    this.option.coupon_type = String(data.coupon_type);
                    if (data.date_type == 2) {
                        this.option.expired_hour = data.expired_hour;
                    } else {
                        let date1 = this.timeZone_(data.start_time, this.$store.getters.getTimeZone);
                        let date2 = this.timeZone_(data.end_time, this.$store.getters.getTimeZone);
                        this.option.date = [new Date(date1), new Date(date2)];
                    }
                    this.option.user_type = data.user_type;
                    this.option.title = data.coupon_name;
                    this.option.grant_total_count = data.grant_total_count;
                    this.option.grant_user_count  = data.grant_user_count;
                    this.option.coupon_use_link = data.coupon_use_link;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.getLoading = false;
            });
        },
        post () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let src = 'admin/coupon-center/add';
                    let params = {};
                    for (let i in this.option) {
                        if (i != 'date' && i != 'receiveDate' && i != 'coupon_use_link' && i != 'grant_total_count' && i != 'grant_user_count' && i != 'user_type') {
                            params[i] = this.option[i];
                        }
                    }

                    if (this.id) {
                        params.id = this.id;
                        src = 'admin/coupon-center/edit';
                    }

                    let timeArr = this.timeZone_(this.option.receiveDate, this.$store.getters.getTimeZone);
                    params.receive_start_time  = timeArr[0];
                    params.receive_end_time = timeArr[1];

                    params.platform = params.platform.join(',');

                    this.postLoding = true;
                    this.$http.post(src, params).then(res => {
                        this.postLoding = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.goback();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoding = false;
                    })
                }
            })

        },
        goback() {
            this.$router.push({
                name: 'site_couponCenterList'
            })
        },
    }

}
</script>

<style lang="less">
    .gb-coupon-center-edit {
        .el-form-item__content {
            width: 60%;
        }

        .link-item {
            margin-bottom: 10px;
        }
    }
</style>


