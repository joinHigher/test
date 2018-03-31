<!-- 商品价格试运算 -->
<template>
    <div class="dataChangeLog">
        <div class="el-container">
            <el-form :inline="true" :model="option" ref="searchForm" :rules="postRule" label-width="100px">
                <el-form-item label="商品SKU" prop="goodSn">
                    <el-input placeholder="请输入SKU" v-model.trim="option.goodSn"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="pipelineCode">
                    <el-select filterable v-model="option.pipelineCode">
                        <el-option v-for="(item, index) in pipeObj" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售仓" prop="virWhCode">
                    <el-select filterable v-model="option.virWhCode">
                        <el-option v-for="(item, index) in wareOpt" :key="index" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品包邮" prop="isFreeShipping">
                    <el-select v-model="option.isFreeShipping" @change="changeShip">
                        <el-option v-for="(item, index) in shipObj" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流分区" prop="weightFreeDivision" :rules="checkDivision">
                    <el-input :disabled="option.isFreeShipping === '0'" placeholder="请输入物流分区ID" v-model.trim="option.weightFreeDivision"></el-input>
                </el-form-item>
                <el-form-item label="利润率" prop="rate">
                    <el-input placeholder="请输入利润率" v-model.trim="option.rate"></el-input>
                </el-form-item>
                <el-form-item label="价格尾数" prop="endPrice" :rules="[{validator: checkFloatNum(2, true)}]">
                    <el-input placeholder="请输入价格尾数" v-model.trim="option.endPrice"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getData" :disabled="tableLoading" v-loading="tableLoading">开始试运算</el-button>
                </el-form-item>
                <p class="cat-title"><strong>商品SKU价格信息</strong></p>
                <div class="el-sub-container">
                    <el-form-item label="试运算价格:">
                        <el-input disabled v-model="price"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div class="el-sub-container">
                <el-table :data="tableData" border v-loading="tableLoading">
                    <el-table-column prop="goodSn" label="商品SKU"></el-table-column>
                    <el-table-column label="包邮状态">
                        <template scope="scope">
                            <span v-if="scope.row.isFreeShipping">包邮</span>
                            <span v-else>不包邮</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="chargePrice" label="计费价格(￥)"></el-table-column>
                    <el-table-column prop="chargeWeight" label="计费重量(kg)"></el-table-column>
                    <el-table-column label="销售尺寸(cm)">
                        <template scope="scope">
                            {{scope.row.saleSizeLong}}*{{scope.row.saleSizeWide}}*{{scope.row.saleSizeHigh}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="columeWeight" label="体积重量(kg)"></el-table-column>
                    <el-table-column prop="freightPrice" label="包邮运费(￥)"></el-table-column>
                    <el-table-column prop="limitPrice" label="商品限价(＄)"></el-table-column>
                    <el-table-column prop="shopPrice" label="本店售价(＄)"></el-table-column>
                </el-table>
            </div>

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
            };
            return {
                checkDivision: [{required: true, message: '该项不能为空'}],
                checkFloatNum: checkFloatNum,
                wareOpt: [],
                tableLoading: false,
                tableData: [],
                shipObj: {
                    '1': '包邮',
                    '0': '不包邮'
                },
                option: {
                    endPrice: '',
                    rate: '1.000',
                    weightFreeDivision: '',
                    isFreeShipping: '1',
                    virWhCode: '',
                    pipelineCode: '',
                    goodSn: '',
                },
                price: '',
                postRule: {
                    rate: [{validator: checkFloatNum(3)}, {required: true, message: '该项不能为空'}],
                    weightFreeDivision: required,
                    isFreeShipping: required,
                    virWhCode: required,
                    pipelineCode: required,
                    goodSn: required,
                }
            };
        },
        computed: {
            pipeObj () {
                let list = this.$store.getters.getPipe.list;
                if (list && list[0]) {
                    this.option.pipelineCode = list[0].pipeline_code;
                }
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.getWare();
        },
        methods: {
            async getWare() {
                const data = await this.httpGet_('stock/warehouse/vir-wh-drop-down');
                this.option.virWhCode = data.list[0].virWhCode;
                this.wareOpt = data.list;
            },
            getData() {
                this.$refs.searchForm.validate(async valid => {
                    if (valid) {
                        this.tableLoading = true;
                        try {
                            const data = await this.httpGet_('goods/price/calc-goods-price', {params: this.option});
                            this.price = data.shopPrice;
                            this.tableData = [data];
                        } finally {
                            this.tableLoading = false;
                        }
                    }
                })
            },
            changeShip(val) {
                if (val == 1) {
                    this.checkDivision = [{required: true, message: '该项不能为空'}];
                } else {
                    this.option.weightFreeDivision = '';
                    this.checkDivision = [];
                }
            }
        }
    }
</script>

<style lang="less">

</style>
