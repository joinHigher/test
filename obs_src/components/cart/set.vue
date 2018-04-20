<style lang="less">
.form { padding: 50px 0; }
</style>
<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">

            <el-form label-width="250px" inline :model="form" ref="form" class="form">
                <el-row :gutter="10">
                    <el-col :span="10">
                        <el-form-item label="加入购物车最大总商品数：" :prop="'cart_sku_number_' + siteCode" :rules="[{ required: true, validator: this.checknum }]">
                            <el-input v-model="form['cart_sku_number_' + siteCode]" :readonly="!option.isEditable"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="购物车单个商品最大购买数量：" :prop="'sku_buy_number_' + siteCode" :rules="[{ required: true, validator: this.checknum }]">
                            <el-input v-model="form['sku_buy_number_' + siteCode]" :readonly="!option.isEditable"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <!-- <el-col :span="10">
                        <el-form-item label="最大库存占用时间（分钟）：" :prop="'cart_max_stock_keeping_time_' + siteCode" :rules="[{ required: true, validator: this.checknum2 }]">
                            <el-input v-model="form['cart_max_stock_keeping_time_' + siteCode]" :readonly="!option.isEditable"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="14">
                        <el-form-item label="保险费率（百分比）：" :prop="'cart_insurance_rate_' + siteCode" :rules="[{ required: true, validator: this.checknum3 }]">
                            <el-input v-model="form['cart_insurance_rate_' + siteCode]" :readonly="!option.isEditable"></el-input>
                        </el-form-item>
                        <el-form-item label-width="0"><span class="color-danger">%</span> &nbsp; <span class="color-silver">（商品总价-Coupon优惠）*2%+1   单位：美元</span></el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row :gutter="10">
                <el-col :span="20" class="text-center">
                    <el-button type="primary" @click="handleBtnSaveClick" size="large" v-if="self.showAction_('promotion/cart/setting-save')">保存</el-button>
                    <el-button type="default" size="large" @click="handleBtnCancelClick">取消</el-button>
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
        function checknum(rule, val, callback) {
            let reg = /^\+?[1-9][0-9]*$/;
            if (!reg.test(val) && val != '0' || val <= 0) {
                return callback(new Error('只能为数字，且大于0'));
            }
            callback();
        }
        function checknum2(rule, val, callback) {
            let reg = /^\+?[1-9][0-9]*$/;
            if (!reg.test(val) && val != '0' || val < 10) {
                return callback(new Error('只能为数字，且不小于10'));
            }
            callback();
        }
        function checknum3(rule, val, callback) {
            let reg = /^[0-9]+(.[0-9]{1,})?$/;
            if (!reg.test(val) || val < 0) {
                return callback(new Error('只能为数字，且不小于0'));
            }
            callback();
        }
        return {
            self: this,
            isDataLoading: true,
            siteCode: '',
            option: {
                isEditable: false
            },
            tempForm: {},
            form: {},
            checknum: checknum,
            checknum2: checknum2,
            checknum3: checknum3,
        };
    },
    created() {
        // 需等待站点数据获取后
        let timer = setInterval(() => {
            if (!this.$store.getters.getSite) {
                return;
            }
            this.siteCode = this.$store.getters.getSite;
            this.option.isEditable = this.showAction_('promotion/cart/setting-save');
            // this.form['cart_sku_number_' + this.siteCode] = '';
            // this.form['sku_buy_number_' + this.siteCode] = '';
            // this.form['cart_max_stock_keeping_time_' + this.siteCode] = '';
            // this.form['cart_insurance_rate_' + this.siteCode] = '';
            this.getData();
            clearInterval(timer);
        }, 100)
    },
    methods: {
        getData() {
            this.$http.get('promotion/cart/setting-list').then(res => {
                if (res.body.code === 0) {
                    let map = res.body.data.map;
                    for (let item in map) {
                        let key = item.replace(/\./g, '_');
                        // this.form[key] = parseFloat(map[item]);
                        this.$set(this.form, key, parseFloat(map[item]));
                    }
                    this.tempForm = Object.assign({}, this.form);
                    this.$refs.form.validate();
                } else {
                    this.$notify.error({
                        title: '错误' + res.body.code,
                        message: res.body.message
                    });
                }
                this.isDataLoading = false;
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
                this.isDataLoading = false;
            });
        },
        handleBtnCancelClick() {
            this.form = Object.assign({}, this.tempForm);
        },
        handleBtnSaveClick() {
            let hasError = false;
            let params = {};
            if (this.isDataLoading) {
                return;
            }
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    hasError = true;
                    return false;
                }
            });
            if (hasError) {
                return;
            }
            // if (!/^\+?[1-9][0-9]*$/.test(this.form['cart_sku_number_' + this.siteCode])) {
            //     this.$message.error('加入购物车最大总商品数有误，只能数字，且大于0');
            //     return;
            // }
            // if (!/^\+?[1-9][0-9]*$/.test(this.form['sku_buy_number_' + this.siteCode])) {
            //     this.$message.error('购物车单个商品最大购买数量有误，只能数字，且大于0');
            //     return;
            // }
            // if (!/^\+?[1-9][0-9]*$/.test(this.form['cart_max_stock_keeping_time_' + this.siteCode])) {
            //     this.$message.error('最大库存占用时间有误，只能数字');
            //     return;
            // } else if (this.form['cart_max_stock_keeping_time_' + this.siteCode] < 10) {
            //     this.$message.error('最大库存占用时间有误，不得小于10分钟');
            //     return;
            // }
            // if (this.form['cart_insurance_rate_' + this.siteCode] != '0' && !/^[0-9]+(.[0-9]{1,})?$/.test(this.form['cart_insurance_rate_' + this.siteCode])) {
            //     this.$message.error('保险费率有误，只能数字，且大于0');
            //     return;
            // }
            // this.form['cart_insurance_rate_' + this.siteCode] = parseFloat(this.form['cart_insurance_rate_' + this.siteCode]);
            for (let item in this.form) {
                let key = item.replace(/_/g, '.');
                params[key] = this.form[item];
                params[key] = String(params[key]);
            }
            // console.log(params)
            // return;
            this.isDataLoading = true;
            this.$http.post('promotion/cart/setting-save', params).then(res => {
                this.isDataLoading = false;
                if (res.body.code == 0) {
                    this.$message.success(res.body.message || '保存成功');
                    this.tempForm = Object.assign({}, this.form);
                } else {
                    this.$message.error(res.body.message);
                }
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
                this.isDataLoading = false;
            });
        }
    }
}
</script>
