<!-- 商品价格批量更新 -->
<template>
    <div class="dataChangeLog">
        <div class="el-container">
            <el-form class="batch-update-form" :model="option" ref="postForm" label-width="100px" :rules="postRule">
                <el-form-item label="渠道" prop="pipelineCode">
                    <el-select v-model="option.pipelineCode">
                        <el-option v-for="(item, index) in pipeObj" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售仓" prop="virWhCode">
                    <el-select v-model="option.virWhCode">
                        <el-option v-for="(item, index) in wareOpt" :key="index" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择商品">
                    <el-radio-group v-model="type" @change="changeType">
                        <el-radio label="1">按商品SKU</el-radio>
                        <el-radio label="2">按商品分类</el-radio>
                    </el-radio-group>
                    <el-form-item prop="goodSnList" v-if="type === '1'">
                        <el-input v-model="option.goodSnList" autoize type="textarea" placeholder="多个商品用','隔开,最多支持100个商品SKU"></el-input>
                    </el-form-item>
                    <el-form-item prop="categoryId" v-if="type === '2'">
                        <el-cascader v-if="" filterable clearable v-model="option.categoryId" class="cat-tree" :options="treeData" change-on-select :props="prop"></el-cascader>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="设置价格" prop="settingType">
                    <el-radio-group v-model="option.settingType">
                        <el-radio label="1">按利润率</el-radio>
                        <el-radio label="2">按价格</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-row v-if="option.settingType == '1'">
                    <el-col :span="10">
                        <el-form-item :class="option.useSiteConfig != 1 ? 'is-required' : ''"  label="利润率" prop="inputRate" :rules="[{validator: checkFloatNum(3)}, {validator: checkRate}]">
                            <el-input :disabled="option.useSiteConfig == 1" placeholder="请输入利润率" v-model.trim="option.inputRate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" :offset="2">
                        <el-checkbox v-model="option.useSiteConfig" true-label="1" false-label="0" @change="changeConfig">使用站点配置</el-checkbox>
                    </el-col>
                </el-row>
                <el-row v-if="option.settingType == '1'">
                    <el-col :span="10">
                        <el-form-item v-if="option.settingType == '1'" label="价格尾数" prop="endPrice" :rules="[{validator: checkFloatNum(2, 'end')}]">
                            <el-input :disabled="option.useSiteConfig == 1" placeholder="请输入价格尾数" v-model.trim="option.endPrice"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item v-if="option.settingType == '2'" label="价格" prop="inputPrice" :rules="[{validator: checkFloatNum(2)}, {required: true, message: '该项不能为空'}]">
                    <el-input placeholder="请输入价格" v-model.trim="option.inputPrice"></el-input>
                </el-form-item>
                <el-form-item class="text-center">
                    <el-button type="primary" @click="post" v-loading="postLoading" :disabled="postLoading">批量更新</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>
    export default {
        data() {
            let required = [{required: true, message: '该项不能为空'}];

            let checkFloatNum = (digit, end) => {
                return (rule, value, callback) => {
                    let val = value * 1;
                    let regex = new RegExp('^([1-9]\\d*|0)(\\.\\d{1,' + digit + '})?$');
                    if ((regex.test(val) && val > 0) || value === '') {
                        if (end && val >= 1) {
                            callback(new Error('价格尾数应小于1'))
                        }
                        callback();
                    } else {
                        callback(new Error('该项只可输入大于0的数字，最多' + digit + '位小数'));
                    }
                }
            }

            let checkRate = (rule, val, callback) => {
                if (this.option.useSiteConfig == 1) {
                    callback();
                } else {
                    if (val) {
                        callback();
                    } else {
                        callback(new Error('该项不能为空'));
                    }
                }
            };
            return {
                self: this,
                checkRate: checkRate,
                checkFloatNum: checkFloatNum,
                required: required,
                postLoading: false,
                type: '1',
                wareOpt: [],
                treeData: [],
                prop: {
                    label: 'categoryName',
                    value: 'id',
                    children: 'subCategoryList',
                },
                option: {
                    categoryId: [],
                    goodSnList: '',
                    pipelineCode: '',
                    virWhCode: '',
                    settingType: '1',
                    inputRate: '',
                    useSiteConfig: '0',
                    endPrice: '',
                    inputPrice: '',
                },
                postRule: {
                    pipelineCode: required,
                    virWhCode: required,
                    pipelineCode: required,
                    settingType: required,
                    useSiteConfig: required,
                }
            };
        },
        computed: {
            pipeObj () {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.getWare();
            this.getCat();
        },
        methods: {
            async getWare() {
                const data = await this.httpGet_('stock/warehouse/vir-wh-drop-down');
                this.wareOpt = data.list;
            },
            async getCat() {
                const data = await this.httpGet_('goods/category/category-drop-down');
                this.treeData = data;
            },
            changeType (val) {
                this.option.categoryId = [];
                this.option.goodSnList = '';
            },
            changeConfig(val) {
            },
            post () {
                this.$refs.postForm.validate(async valid => {
                    if (valid) {
                        let params = {};
                        for (let i in this.option) {
                            let item = this.option[i];
                            if (i == 'goodSnList' && item.length > 0) {
                                params[i] = item;
                            } else if (item){
                                params[i] = item;
                            }
                        }
                        if (params.categoryId && params.categoryId.length > 0) {
                            params.categoryId = params.categoryId.pop();
                        } else if (params.goodSnList) {
                            params.goodSnList = params.goodSnList.split(',');
                        }

                        if (this.option.useSiteConfig == 1 || this.option.settingType == 2) {
                            delete params.inputRate;
                            delete params.endPrice;
                        }

                        if (this.option.settingType == 1) {
                            delete params.inputPrice;
                        }

                        this.postLoading = true;
                        try {
                            const data = await this.httpPost_('goods/price/batch-update-goods-price', params);
                            this.$message.success(data.message);

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
    .batch-update-form {
        width: 50%;

        .el-cascader {
            width: 400px;
        }
    }
</style>
