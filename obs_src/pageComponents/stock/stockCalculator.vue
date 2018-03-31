<template>
    <div>
        <!--公式计算器 begin-->
        <div class="calc-wrap" @click="calcOperate">
            <div class="calc-operate">
                <el-button size="small" v-for="item in calculatorText" :key="item">{{item}}</el-button>
                <el-button size="small">+</el-button>
                <el-button size="small">-</el-button>
                <el-button size="small">*</el-button>
                <el-button size="small">/</el-button>
                <div class="calc-num-wrap">
                    <el-button size="small">123.</el-button>
                    <div class="num-list" v-show="isShowCalcNumList">
                        <ul>
                            <li>
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                            </li>
                            <li>
                                <span>4</span>
                                <span>5</span>
                                <span>6</span>
                            </li>
                            <li>
                                <span>7</span>
                                <span>8</span>
                                <span>9</span>
                            </li>
                            <li>
                                <span>&nbsp;</span>
                                <span>0</span>
                                <span>.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <el-button size="small">删除</el-button>
            </div>
            <div class="calc-result">
                <el-input type="textarea" :rows="5" v-model="formula" readonly :placeholder="placeholder" :style="{width: width }"></el-input>
                <p class="calc-notice">*公式仅支持单个运算符</p>
            </div>
        </div><!--公式计算器 end-->
    </div>
</template>

<script>

    export default {
        props: {
            value: String,
            placeholder: String,
            width: String
        },
        data() {
            return{
                isShowCalcNumList: false,
                formula: '',
                calculatorText: ['初始值', '在途库存']
            }
        },
        watch: {
            formula(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.$emit('input', newVal.replace(/\s/g, ''));
                }
            }
        },
        created() {
            this.formula = this.value;
        },
        methods: {
            // 设置值
            setValue(formula) {
                this.formula = formula;
            },
            //计算公式操作面板
            calcOperate(e) {
                let val = e.srcElement.innerText;
                let reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                // 显示/隐藏数字键盘
                if(val === '123.'){
                    this.isShowCalcNumList = !this.isShowCalcNumList;
                }
                // 删除
                if(val === '删除'){
                    let lastChar = this.formula.substr(this.formula.length - 1, 1);
                    if(reg.test(lastChar)){
                        if(lastChar === this.calculatorText[0][this.calculatorText[0].length - 1]) {
                            this.formula = this.formula.replace(this.calculatorText[0], '');
                        } else {    
                            this.formula = this.formula.replace(this.calculatorText[1], '');
                        }
                        
                    }else{
                        this.formula = this.formula.replace(lastChar, '');
                    }
                }
                // 初始值 || 在途库存
                if(val === this.calculatorText[0] || val === this.calculatorText[1]){
                    if(this.formula.indexOf(val) > -1 || reg.test(this.formula[this.formula.length-1])){
                        return false;
                    }
                    this.formula += val;
                }

                //是否包含运算符
                let hasOperator = this.formula.indexOf('+') > -1 || this.formula.indexOf('-') > -1 || this.formula.indexOf('*') > -1 || this.formula.indexOf('/') > -1;

                // +
                if(val === '+' && hasOperator === false){
                    this.formula = this.formula + val;
                }
                // -
                if(val === '-' && hasOperator === false){
                    this.formula = this.formula + val;
                }
                // *
                if(val === '*' && hasOperator === false){
                    this.formula = this.formula + val;
                }
                // /
                if(val === '/' && hasOperator === false){
                    this.formula = this.formula + val;
                }
                // 0-9
                if(val === '0' || val === '1' || val === '2' || val === '3' || val === '4' || val === '5' || val === '6' || val === '7' || val === '8' || val === '9'){
                    this.formula = this.formula + val;
                }
                // .
                if(val === '.' && this.formula.indexOf(val) <= -1){
                    this.formula = this.formula + val;
                }
            }
        }
    }
</script>
<style lang="less">
    /*公式计算器*/
    .calc-wrap {
        font-size: 13px;
        .calc-num-wrap {
            display: inline-block;
            position: relative;
            margin: 0 5px;
            z-index: 999;
            .num-list{
                position: absolute;
                background: rgba(215, 215, 215, 1);
                padding: 10px;
                top: 35px;
                ul{
                    list-style: none;
                    display: table;
                    width: 130px;
                    border-right: 1px solid #797979;
                    border-bottom: 1px solid #797979;
                    text-align: center;
                    font-size: 12px;
                    line-height: 25px;
                    li{
                        display: table-row;
                        background: rgba(255, 255, 255, 1);
                        span{
                            display: table-cell;
                            cursor: pointer;
                            border-top: 1px solid rgba(121, 121, 121, 1);
                            border-left: 1px solid rgba(121, 121, 121, 1);
                        }
                    }
                }
            }
        }
        .calc-result {
            margin-top: 20px;
        }
        .calc-notice {
            color: #FF9900;
            font-size: 13px;
        }
    }
</style>
