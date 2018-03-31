<!-- 设置更新规则 -->
<template>
    <div class="el-container el-stock-rule-container" v-loading.body="dataLoading">
        <el-form :model="stockForm" ref="stockForm" :rules="rules" label-width="200px">
            <el-form-item label="规则名称：" prop="ruleName">
                <el-input v-model="stockForm.ruleName" :maxlength="50" class="stock-rule-input"></el-input>
                <span>{{stockForm.ruleName.length}}/50</span>
            </el-form-item>

            <el-form-item label="是否启用" prop="isEnable">
                <el-radio-group v-model="stockForm.isEnable">
                    <el-radio label="0">停用</el-radio>
                    <el-radio label="1">启用</el-radio>
                </el-radio-group>
                <span style="margin-left: 60px;">启用会自动计算规则范围内全部商品虚拟库存值</span>
            </el-form-item>

            <el-form-item label="限定范围" required>
                <div class="limited-range">
                    <div class="limited-range-tr">
                        <div class="limited-range-th text-center">已选条件</div>
                        <div class="limited-range-th text-center">选择条件</div>
                    </div>
                    <div class="limited-range-tr">
                        <div class="limited-range-td limited-range-border">
                            <div class="limited-range-td-left">
                                <div v-for="(item, key) in selectedCondition" :key="key">
                                    <template v-if="item.isShow">
                                        <el-button type="text" @click="showDialog(key)">{{condition[key]}}</el-button> 
                                        <template v-if="item.data.length > 0">
                                            <div v-if="key === 'realStock'">（{{getRealWarehouse(item.data)}}）</div>
                                            <div v-if="key === 'tag'">（{{getTag(item.data)}}）</div>
                                            <div v-if="key === 'skus'">（{{item.data.join(',')}}）</div>
                                        </template>  
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="limited-range-td">
                            <div class="limited-range-td-right">
                                <div class="limited-range-condition">
                                    <el-checkbox-group v-model="conditionCheckList">
                                        <el-checkbox v-for="(item,key) in condition" :key="key" :label="key">{{item}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="计算公式：" prop="formula">
                <stock-calculator v-model="stockForm.formula" ref="calculator" width="400px"></stock-calculator>
            </el-form-item>

            <el-form-item label="规则描述：" prop="remark">
                <el-input type="textarea" :rows="5" v-model="stockForm.remark" :maxlength="250" class="stock-rule-input"></el-input>
                <div class="description-tip">{{stockForm.remark.length}}/250</div>
            </el-form-item>

            <el-form-item>
                <router-link :to="{ name: 'stock_inventoryRule'}"><el-button> 返回</el-button></router-link>
                <el-button type="primary" @click="save">保存规则</el-button>
            </el-form-item>
        </el-form>

        <el-dialog title="指定真实仓库" :visible.sync="isRealStock" size="tiny" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="el-container">
                <el-transfer filterable :filter-method="filterMethod" :titles="['可选择', '已选择']" :button-texts="['删除', '添加']" v-model="selectedRealWhCode" :data="realWhCodeList">
                </el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelRealStockDialog">取 消</el-button>
                <el-button type="primary" @click="getRealStockDetail">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="指定销售标识" :visible.sync="isTag" size="tiny" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="el-container">
                <el-checkbox-group v-model="selectedTag">
                    <el-checkbox v-for="(item, key) in salesLogo" :key="key" :label="key">{{item}}</el-checkbox>
                </el-checkbox-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelTagsDialog">取 消</el-button>
                <el-button type="primary" @click="getTagsDetail">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="指定商品SKU" :visible.sync="isSkus" size="tiny" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" class="skus-dialog">
            <div class="el-container">
                <el-input type="textarea" :rows="5" v-model="selectedSkus"></el-input>
                <div class="color-warning">*多个SKU请用英文符号“,”分隔</div>
                <div class="error-message color-danger" v-show="errorMessage">{{errorMessage}}</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSkuDialog">取 消</el-button>
                <el-button type="primary" @click="getSkuDetail">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
// 标签帅选组件
import stockCalculator from '../../pageComponents/stock/stockCalculator'
import httpGet, { getRealWhCodeList, httpPost } from '@/common/baseApi'
export default {
    components: {
        stockCalculator
    },
    data () {
        //验证公式正确性
        let validateFormula = (rule, value, callback) => {
            if(!value) {
                return callback(new Error('公式不能为空'));
            }
            if(value.substr(value.length - 1, 1) === '.'){
                return callback(new Error('请检查公式规范性，如末尾不能是小数点(.)'));
            }
            if(/\d[\+\-\*\/]\d/.test(value)){  
                return callback(new Error('不允许运算符前后都为数字'));
            }  
            if(/^[\.0-9]+[\u4E00-\u9FFF]+$|^[\u4E00-\u9FFF]+[\.0-9]+$/.test(value)) {
                return callback(new Error('数字与中文之间必须存在运算符'));
            }
            if(/^[\.0-9\u4E00-\u9FFF]+$/.test(value)) {
                return callback();
            }
            if(!/^[\S]+[\+\-\*\/][\S]+$/.test(value)){  
                return callback(new Error('不允许运算符前/后为空'));
            }  
            callback();
        };
        return {
            stockForm: {
                ruleName: '',
                isEnable: '0',
                formula: '',
                remark: ''
            },
            condition: {
                skus: '商品为指定SKU',
                tag: '商品销售标识为指定标识',
                realStock: '仓库为指定真实仓'
            },
            salesLogo: {
                '3': '清仓',
                '2': '断货',
                '1': '正常'
            },
            dataLoading: false,
            isRealStock: false,
            isTag: false,
            isSkus: false,
            selectedTag: [],
            selectedSkus: '',
            selectedRealWhCode: [],
            realWhCodeList: [],
            realWarehouseNames: {},
            selectedCondition: {
                skus: {
                    isShow: false,
                    data: []
                },
                tag: {
                    isShow: false,
                    data: []
                },
                realStock: {
                    isShow: false,
                    data: []
                }
            },
            conditionCheckList: [],
            rules: {
                ruleName: [
                    { required: true, message: '请输入规则名称', trigger: 'blur' }
                ],
                isEnable: [
                    { required: true, message: '请选择是否启用状态', trigger: 'change' }
                ],
                formula: [
                    { required: true, validator: validateFormula, trigger: 'submit' }
                ]
            },
            errorMessage: ''
        }
    },
    watch: {
        conditionCheckList(newArr) {
            for(let i in this.selectedCondition) {
                if(newArr.indexOf(i) > -1) {
                    this.selectedCondition[i].isShow = true;
                } else {
                    this.selectedCondition[i].isShow = false;
                    this.selectedCondition[i].data = [];
                }
            }
        }
    },
    created () {
        if (this.$route.query.id) { 
            this.getSingleData(this.$route.query.id);
        }
        let realWhCodeList = [], realWarehouseNames = {};
        getRealWhCodeList().then((res) => {
            res.forEach((item) => {
                item && realWhCodeList.push({
                    key: item.whCode,
                    label: item.name,
                    disabled: false
                });
                realWarehouseNames[item.whCode] = item.name;
            })
        })
        this.realWhCodeList = realWhCodeList;
        this.realWarehouseNames = realWarehouseNames;
    },
    methods: {
        // 编辑/复制时获取规则数据
        async getSingleData(id) {
            this.dataLoading = true;
            let params = { id: id };
            const { virtualStockUpdateRuleRespList } = await httpGet('stock/virtual-stock/get-virtual-stock-update-rule-list', {
                params
            });
            this.dataLoading = false;
            let virtualStockUpdateRule  = virtualStockUpdateRuleRespList[0];
            this.stockForm.ruleName = virtualStockUpdateRule.ruleName;
            this.stockForm.isEnable = String(virtualStockUpdateRule.isEnable);
            this.stockForm.formula = virtualStockUpdateRule.formula.split('|').join('').replace('startStock', '初始值').replace('transportStock', '在途库存');
            this.$refs.calculator.setValue(this.stockForm.formula);
            this.stockForm.remark = virtualStockUpdateRule.remark;
            let conditionCheckList = [];
            if(virtualStockUpdateRule.limitGoodSn) {
                this.selectedCondition.skus.isShow = true;
                this.selectedCondition.skus.data = virtualStockUpdateRule.limitGoodSn.split(',');
                conditionCheckList.push('skus');
            }

            if(virtualStockUpdateRule.saleMark) {
                this.selectedCondition.tag.isShow = true;
                this.selectedCondition.tag.data = virtualStockUpdateRule.saleMark.split(',');
                conditionCheckList.push('tag');
            }

            if(virtualStockUpdateRule.limitReallyWarehouse) {
                this.selectedCondition.realStock.isShow = true;
                this.selectedCondition.realStock.data = virtualStockUpdateRule.limitReallyWarehouse.split(',');
                conditionCheckList.push('realStock');
            }
            this.conditionCheckList = conditionCheckList;
        },
        // 打开弹窗
        showDialog(key) {
            switch(key) {
                case 'skus': 
                    this.selectedSkus = this.selectedCondition.skus.data.join(',');
                    this.$nextTick(() => {
                        this.isSkus = true;
                    })
                break;

                case 'tag':
                    this.selectedTag = this.selectedCondition.tag.data;
                    this.$nextTick(() => {
                        this.isTag = true;
                    })
                break;

                case 'realStock':
                    this.selectedRealWhCode = this.selectedCondition.realStock.data;
                    this.$nextTick(() => {
                        this.isRealStock = true;
                    })
                break;
            }
        },
        // 指定真实仓时搜索
        filterMethod(query, item) {
            return item.label.indexOf(query) > -1;
        },
        // 指定真实仓关闭
        cancelRealStockDialog() {
            this.selectedRealWhCode = [];
            this.isRealStock = false;
        },
        // 保存指定真实仓
        getRealStockDetail() {
            this.selectedCondition.realStock.data = this.selectedRealWhCode;
            this.$nextTick(() => {
                this.isRealStock = false;
            })
        },
        // 获取真实仓名称
        getRealWarehouse(data) {
            let newData = data.map((item) => {
                return this.realWarehouseNames[item];
            });
            return newData.join(',')
        },
        // 指定销售标识关闭
        cancelTagsDialog() {
            this.selectedTag = [];
            this.isTag = false;
        },
        // 保存指定销售标识
        getTagsDetail() {
            this.selectedCondition.tag.data = this.selectedTag;
            this.$nextTick(() => {
                this.isTag = false;
            })
        },
        // 获取指定销售标识
        getTag(data) {
            let newData = data.map((item) => {
                return this.salesLogo[item];
            });
            return newData.join(',')
        },
        // 取消指定商品SKU
        cancelSkuDialog() {
            this.selectedSkus = '';
            this.isSkus = false;
        },
        // 保存指定商品SKU
        getSkuDetail() {
            this.errorMessage = ''
            if(!/^[A-Za-z0-9,]+$/.test(this.selectedSkus)) {
                this.errorMessage = '填写字符不合规范：仅限输入字母/数字/英文符号“,”';
                return;
            }
            this.selectedCondition.skus.data = this.selectedSkus.split(',');
            this.$nextTick(() => {
                this.isSkus = false;
            })
        },
        // 保存
        save() {
            if(this.selectedCondition.skus.data.length === 0 && this.selectedCondition.tag.data.length === 0 && this.selectedCondition.realStock.data.length === 0) {
                return this.$message({
                    type: 'error',
                    message: '至少需要一个限定范围条件'
                });  
            }
            this.$refs['stockForm'].validate(async (valid) => {
                if (valid) {
                    let params = Object.assign({}, this.stockForm);
                    let formula = this.stockForm.formula.replace('初始值', 'startStock').replace('在途库存', 'transportStock');
                    let arr = /[\+\-\*\/]/.exec(formula);
                    let formulaArr = [];
                    if(arr) {
                        let param1 = formula.slice(0, arr.index);
                        if(param1){
                            formulaArr.push(param1)
                        }
                        formulaArr.push(arr[0]);
                        let param2 = formula.slice(arr.index + 1);
                        if(param2) {
                            formulaArr.push(param2);
                        }
                    } else {
                        formulaArr = [formula]
                    }
                    params.formula = formulaArr.join('|');
                    params.limitGoodSn = this.selectedCondition.skus.data.join(',');
                    params.saleMark = this.selectedCondition.tag.data.join(',');
                    params.limitReallyWarehouse = this.selectedCondition.realStock.data.join(',');
                    let url = 'stock/virtual-stock/add-virtual-stock-update-rule';
                    if (this.$route.query.id && !this.$route.query.copy) {
                        params.id = this.$route.query.id;
                        url = 'stock/virtual-stock/update-virtual-stock-update-rule';
                    }

                    this.$http.post(url, params).then(res => {
                        if (res.body.code === 0) {
                            this.$message({
                                type: 'success',
                                message: res.body.message || '虚拟库存数更新规则保存成功！'
                            });
                            this.$router.push({ name: 'stock_inventoryRule' });
                        } else if (res.body.code === 14133) {
                            this.$message.error('SKU' + res.body.message + '不存在');
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                    // const { code, message } = await httpPost(url, params);
                    // if(code === 0) {
                    //     this.$message({
                    //         type: 'success',
                    //         message: message || '虚拟库存数更新规则保存成功！'
                    //     });  
                    //     this.$router.push({ name: 'stock_inventoryRule' });
                    // }

                } else {
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="less">
.el-stock-rule-container{
    .stock-rule-input{
        width: 400px;
    }
}
.limited-range{
    display: table;
    width: 800px;
    background-color: #f9fafc;
    border: 1px solid #eaeefb;
    .limited-range-tr {
        display: table-row;
        .limited-range-th{
            display: table-cell;
            background-color: #fff;
            border-bottom: 1px solid #eaeefb;
        }
        .limited-range-td{
            display: table-cell;
            height: 400px; 
            &.limited-range-border{
                border-right: 1px solid #eaeefb;
            }
            .limited-range-td-left{
                padding: 20px;
                width:500px;
            }
            .limited-range-td-right{
                width: 300px;
            }
        }
    }
    .limited-range-condition{
        width: 80%;
        margin: auto;
        .el-checkbox+.el-checkbox {
            margin-left: 0; 
        }
    }
    .description-tip{
        width: 400px;
        text-align: right;
    }
}
.skus-dialog{
    .error-message{
        margin-top: 20px;
        padding: 10px;
        background-color: #f9fafc;
        box-sizing: border-box;
    }
}
</style>
