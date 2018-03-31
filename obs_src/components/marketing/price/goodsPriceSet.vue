<!-- 设置商品价格 -->
<template>
    <div @click="closeTree($event)" class="goods-price-set">
        <div class="el-container">
            <el-form label-width="140px" ref="searchForm" :model="searchForm" inline>
                <p class="cat-title"><strong>商品筛选条件</strong></p>
                <div class="el-sub-container">
                    <div>
                        <el-form-item label="SKU">
                            <el-input v-model.trim="searchForm.goodSn" :rows="4" class="quick-search" type="textarea"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="商品分类" class="coupon-select">
                        <el-input v-model.trim="searchForm.categoryName" @click.native="treeFlag = !treeFlag" class="js_input"></el-input>
                        <el-tree v-show="treeFlag" :data="treeData" :props="treeProps" ref="tree" node-key="id" show-checkbox @check-change="changeTree"></el-tree>
                    </el-form-item>
                    <el-form-item label="商品仓库" prop="warehouseCode" :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]">
                        <el-select filterable clearable v-model="searchForm.warehouseCode">
                            <el-option v-for="item in wareOpt" :key="item.virWhCode" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属店铺" prop="shopCode">
                        <el-select filterable clearable v-model="searchForm.shopCode">
                            <el-option v-for="(item, index) in storeOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="multiple-item">
                        <el-form-item label="产品品牌">
                            <el-select filterable multiple v-model="searchForm.brandCode">
                                <el-option v-for="item in brandOpt" :key="item.id" :value="item.brandCode" :label="item.brandTitle"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-form-item label="PMD产品状态">
                        <el-select filterable clearable v-model="searchForm.status">
                            <el-option v-for="(item, index) in pdmOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="本店售价范围">
                        <el-row class="text-center">
                            <el-col :span="11">
                                <el-input v-model.trim="searchForm.priceStart"></el-input>
                            </el-col>
                            <el-col :span="2">至</el-col>
                            <el-col :span="11">
                                <el-input v-model.trim="searchForm.priceEnd"></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="产品添加时间">
                        <el-date-picker v-model="searchForm.addDate" type="datetimerange" :editable="false" @change="checkDate_($event, searchForm.addDate)"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="特殊标识商品">
                        <el-checkbox-group v-model="searchForm.specialPriceType">
                            <el-checkbox v-for="(item, index) in spcialOpt" :key="index" :label="index">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
                <div class="text-center">
                    <el-button type="primary" @click="getData" v-loading="addLoading" :disabled="addLoading">加入队列</el-button>
                </div>
            </el-form>
        </div>
        <price-temp ref="priceTemp" :show="doneSearch" :memberOpt="memberOpt" type="tabs"></price-temp>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>
import priceTemp from '@/pageComponents/marketing/priceTemp'
export default {
    components: {
        priceTemp
    },
    data () {
        return {
            conditionId: '',
            priceType: 1,
            searchForm: {
                goodSn: '',
                categoryName: '',
                categoryId: '',
                warehouseCode: '',
                shopCode: '',
                brandCode: [],
                startTime: '',
                endTime: '',
                addDate: [],
                status: '',
                specialPriceType: [],
                priceStart: '',
                priceEnd: '',
            },
            pdmOpt: {
                '1': '正常',
                '2': '断货',
                '3': '停产'
            },
            spcialOpt: {
                '1': '普通限价',
                '2': '严格限价',
                '3': '清仓'
            },
            addLoading: false,
            postLoading: false,
            total: 10,
            brandOpt: [],
            wareOpt: [],
            treeFlag: false,
            treeData: [],
            treeProps: {
                children: 'subCategoryList',
                label: 'categoryName'
            },
            queryCondition: {},
            count: 0,
            activeTemp: '',
            tempIdOpt: [],
            doneSearch: false,
            memberOpt: [],
            countryOpt: [],
            labelOpt: {},
            tempOpt: [],
            itemOpt: {
                priceName: '',
            },
            nameOpt: {
                priceName: '组名称',
                price: '价格',
                rates: '利润率',
                mantissa: '价格尾数',
                stepPrice: '阶梯价',
                platforms: '平台',
                startTime: '开始时间',
                pipelineCode: ' 渠道编码',
                endTime: '结束时间',
                timerRiseInPrice: '定时价格增长',
                orderChange: '销售量价格变动',
                timerRiseInOrder: '定时订单增长',
                saleQty: '可销售数量',
                virtualSaleQty: '虚拟售出数量',
                buyLimit: '单用户购买数量限制',
                users: '绑定会员',
                userLevel: '会员等级',
                country: '绑定国家',
                ciphertext: '密文',
                isSameStyle: '同款生效',
                isLock: '不参与自动更新',
                integralRate: '积分比率',
                sysLabelId: '系统标签',
                userLabelId: '运营标签',
                excludeSysLabelId: '排除系统标签',
                declare: '说明',
                remark: '备注',
            },
        };
    },
    computed: {
        storeOpt () {
            return this.$store.getters.getStore.obj;
        },
    },
    created () {
        let self = this;
        this.getOpt();
        this.$eventHub.$on('getPostData', this.postEdit);
        this.$eventHub.$on('getActiveTemp', this.getActiveTemp);
        this.$eventHub.$on('cancle', this.cancle);
    },
    beforeDestroy() {
        this.$eventHub.$off('getPostData',this.postEdit);
        this.$eventHub.$off('getActiveTemp',this.getActiveTemp);
        this.$eventHub.$off('cancle',this.cancle);
    },
    methods: {
        getActiveTemp(data) {
            this.activeTemp = data;
        },
        cancle() {
            history.back();
        },
        getOpt () {
            this.$http.get('promotion/index/public-activity-select').then(res => {
                if (res.body.code == 0) {
                    let data = res.body.data;
                    this.brandOpt = data.brand;
                    this.treeData = data.category;
                    this.wareOpt = data.virtualWares;
                    this.memberOpt = data.userLevel;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            this.$refs.searchForm.validate(valid => {
                if (valid) {
                    let timeArr1 = this.timeZone_(this.searchForm.addDate, this.$store.getters.getTimeZone);
                    this.searchForm.startTime = timeArr1[0];
                    this.searchForm.endTime = timeArr1[1];

                    let params = {};
                    for (let i in this.searchForm) {
                        if (i !== 'addDate' && i !== 'specialPriceType' && i !== 'categoryName' && i !== 'brandCode') {
                            params[i] = this.searchForm[i];
                        }
                    }
                    params.brandCode = this.searchForm.brandCode.join(',');
                    params.specialPriceType = this.searchForm.specialPriceType.join(',');

                    this.doneSearch = false;
                    this.addLoading = true;
                    this.$http.get('promotion/price/search-goods', {params: params}).then(res => {
                        this.addLoading = false;
                        if (res.body.code === 0) {
                            if (res.body.data > 0) {
                                this.$confirm('筛选出的商品有' + res.body.data + '个,是否加入队列?', '加入队列', {
                                    type: 'warning'
                                }).then(() => {
                                    this.count = res.body.data;

                                    this.$http.get('promotion/price/condition-id').then(res => {
                                        if (res.body.code === 0) {
                                            this.conditionId = res.body.data;
                                            this.queryCondition = params;
                                            this.doneSearch = true;
                                            this.$refs.priceTemp.changeTemp({name: this.activeTemp});
                                        }
                                    })
                                }).catch(() => {
                                    this.$message({
                                        type: 'info',
                                        message: '已取消'
                                    });
                                });
                            } else {
                                this.$message.warning('没有符合条件的商品');
                            }

                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.addLoading = false;
                    });
                }
            });
        },
        changeTree () {
            let data = this.$refs.tree.getCheckedNodes();
            let temp = [];
            let tempIds = [];
            data.forEach(item => {
                temp.push(item.categoryName);
                tempIds.push(item.id);
            })
            this.searchForm.categoryName = temp.join(',');
            this.searchForm.categoryId = tempIds.join(',');
        },
        closeTree (event) {
            let target = event.target.parentElement._prevClass;
            if (target && target.indexOf('js_input') !== -1) {

            } else {
                this.treeFlag = false;
            }
        },
        // 子组件获取数据后提交
        postEdit (option) {
            option.conditionId = this.conditionId;
            // 待编辑
            let timeArr1 = this.timeZone_(option.times, this.$store.getters.getTimeZone);
            option.startTime = timeArr1[0];
            option.endTime = timeArr1[1];

            let params = {};
            params.priceConditions = [];
            for (let i in option) {
                if (i === 'timerRiseInOrder' || i === 'timerRiseInPrice') {
                    let flag = true;
                    for (let j in option[i]) {
                        let item = option[i][j];
                        if (item == '') {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        params.priceConditions.push({
                            conditionId: option.conditionId,
                            paramId: i,
                            paramName: this.nameOpt[i],
                            paramValue: option[i]
                        });
                    }
                } else if (i === 'stepPrice' || i === 'orderChange') {
                    let flag = true;
                    for (let k in option[i]) {
                        let item = option[i][k];
                        for (let l in item) {
                            if (item[l] == '') {
                                flag = false;
                                break;
                            }
                        }
                    }
                    if (flag) {
                        params.priceConditions.push({
                            conditionId: option.conditionId,
                            paramId: i,
                            paramName: this.nameOpt[i],
                            paramValue: option[i]
                        });
                    }
                } else if (i !== 'times' && i !== 'id' && i !== 'conditionId' && i !== 'priceId' && i !== 'warehouseCode' && i !== 'templateId' && i !== 'goodSn') {
                    if (option[i] === '' || option[i].length === 0) {

                    } else {
                        params.priceConditions.push({
                            conditionId: option.conditionId,
                            paramId: i,
                            paramName: this.nameOpt[i],
                            paramValue: option[i]
                        });
                    }
                }
            }
            params.warehouseCode = this.searchForm.warehouseCode;
            params.templateId = option.templateId;
            params.conditionId = option.conditionId;
            params.count = this.count;

            params.priceConditions.forEach(item => {

                if (item.paramValue instanceof Array) {
                    if (item.paramValue[0] instanceof Object) {
                    } else {
                        item.paramValue = item.paramValue.join(',');
                    }
                }
            });

            params.queryCondition = {};
            for (let i in this.queryCondition) {
                if (this.queryCondition[i]) {
                    params.queryCondition[i] = this.queryCondition[i];
                }
            }

            params.queryCondition = JSON.stringify(params.queryCondition);
            this.$http.post('promotion/price/setting-params', params).then(res => {
                this.$eventHub.$emit('cancleLoading');
                if (res.body.code === 0) {
                    this.$alert('价格设置开始，请到价格设置记录页面查看设置结果', '操作提示', {
                        type: 'success',
                        callback: action => {
                            if (action == 'confirm') {
                                this.$router.push({
                                    name: 'marketing_price_queueInfo',
                                    query: {id: params.conditionId}
                                });
                                this.$nextTick();
                            }
                        }
                    });
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.$eventHub.$emit('cancleLoading');
            })
        },
        goback () {
            history.back();
        },
    }
}
</script>

<style lang="less">
    .goods-price-set {
        .coupon-select {
            position: relative;
            z-index: 10;
            min-height: 36px;

            .el-form-item__content {
                width:400px;
            }

            .el-input {
                position: absolute;
                top: 0;
                left: 0;
            }

            .el-tree {
                position: absolute;
                top: 36px;
                left: 0;
                z-index: 10;
                width: 100%;
                max-height: 300px;
                overflow-y: auto;
                text-align: left;
            }
        }

        .multiple-item {
            .el-form-item__content {width: 600px;}
        }
    }
</style>
