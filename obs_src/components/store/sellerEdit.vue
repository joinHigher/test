<!-- 卖家编辑 -->
<template>
    <div class="seller-edit el-container">
        <el-form label-width="100px" :model="option" class="form" ref="postForm" :rules="postRule">
            <el-form-item label="卖家账号" prop="account">
                <el-input v-model="option.account"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="option.companyName"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
                <el-input v-model="option.contact"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contactMethod">
                <el-input v-model="option.contactMethod"></el-input>
            </el-form-item>
            <el-form-item label="所在地">
                <el-row>
                    <el-col :span="8">
                        <el-form-item class="address">
                            <el-select filterable placeholder="请选择国家" v-model="option.addressCountryCode" @change="getProvince">
                                <el-option v-for="(item, index) in countryOpt" :key="index" :value="item.countryCode" :label="item.countryName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item class="address">
                            <el-select :disabled="!option.addressCountryCode" filterable placeholder="请选择省份" v-model="option.addressProvinceCode" @change="getCity">
                                <el-option v-for="(item, index) in provinceOpt" :key="index" :value="String(item.provinceCode)" :label="item.provinceName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item class="address" prop="addressCityName" v-if="cityOpt.length === 0">
                            <el-input :disabled="!option.addressProvinceCode" v-model="option.addressCityName" placeholder="请输入城市"></el-input>
                        </el-form-item>
                        <el-form-item class="address" prop="addressCityName" v-else>
                            <el-select :disabled="!option.addressProvinceCode" filterable placeholder="请选择城市" v-model="option.addressCityName">
                                <el-option v-for="(item, index) in cityOpt" :key="index" :value="String(item.cityName)" :label="item.cityName"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item prop="addressDetail">
                    <el-input v-model="option.addressDetail" class="address-text" placeholder="请输入详细地址"></el-input>
                </el-form-item>

            </el-form-item>
            <el-form-item class="text-center">
                <el-button v-if="!id" type="primary" @click="post('new')" :disabled="postLoading" v-loading="postLoading">提交并开通店铺</el-button>
                <el-button type="primary" @click="post" :disabled="postLoading" v-loading="postLoading">提交</el-button>
            </el-form-item>
        </el-form>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                postLoading: false,
                option: {
                    account: '',
                    companyName: '',
                    contact: '',
                    contactMethod: '',
                    addressCountryCode: '',
                    addressProvinceCode: '',
                    addressCityName: '',
                    addressDetail: '',
                },
                countryOpt: [],
                provinceOpt: [],
                cityOpt: [],
                id: this.$route.query.id,
                initCountry: true,
                initProvince: true,
                edit: Object.keys(this.$route.query).length > 0,
                postRule: {
                    account: [{
                        type: 'email',
                        required: true,
                        message: '该项不能为空，且需为正确的邮箱格式'
                    }],
                    companyName: [{
                        max: 350,
                        required: true,
                        message: '该项不能为空，长度最大为350'
                    }],
                    contact: [{
                        max: 50,
                        required: true,
                        message: '该项不能为空，长度最大为350'
                    }],
                    contactMethod: [{
                        max: 50,
                        required: true,
                        message: '该项不能为空，长度最大为350'
                    }],
                },
            };
        },
        created() {
            if (this.edit) {
                this.getData();
            }
            this.getCountry();
        },
        methods: {
            async getData () {
                let data = await this.httpGet_('store/seller/detail', {params: {id: this.id}});
                this.$nextTick(() => {
                    for (let i in this.option) {
                        if (data[i]) {
                            this.option[i] = data[i];
                        }
                    }
                })
            },
            async getCountry () {
                let params = {
                    page_size: 2000,
                    page: 1,
                }
                const data = await this.httpGet_('logistics/country-info/list', {params: params});
                this.countryOpt = data.list;
            },
            async getProvince (val) {
                if (!val) {
                    return;
                }
                let params = {
                    countryCode: val
                }
                const data = await this.httpGet_('logistics/public/get-provinces-by-country-code', {params: params});

                if (this.edit && this.initCountry) {
                    this.initCountry = false;
                } else {
                    this.option.addressProvinceCode = '';
                }
                this.provinceOpt = [];

                this.provinceOpt = data;
            },
            async getCity (val) {
                if (!val) {
                    return;
                }
                let params = {
                    provinceCode: val
                }

                const data = await this.httpGet_('logistics/public/get-cities-by-province-code', {params: params});

                this.cityOpt = [];
                if (this.edit && this.initProvince) {
                    this.initProvince = false;
                } else {
                    this.option.addressCityName = '';
                }

                this.cityOpt = data;
            },
            post (type) {
                this.$refs.postForm.validate(async valid => {
                    if (valid) {
                        let src = 'store/seller/add';
                        let params = JSON.parse(JSON.stringify(this.option));

                        if (this.id) {
                            src = 'store/seller/edit';
                            params.id = this.id;
                        }
                        this.postLoading = true;
                        try {
                            const data = await this.httpPost_(src, params);
                            this.$message.success(data.message);
                            if (type === 'new') {
                                this.$router.push({
                                    name: 'store_storeAdd',
                                    query: {
                                        sellerId: data.data,
                                    }
                                });
                            } else {
                                this.$router.push({
                                    name: 'store_sellerList'
                                });
                            }
                        } finally {
                            this.postLoading = false;
                        }
                    }
                })
            },
        }
    }
</script>

<style lang="less">
    .seller-edit {
        .form {
            width: 50%;
        }

        .address {
            padding: 0 5px;
        }

        .address-text {
            margin-top: 10px;
        }
    }
</style>
