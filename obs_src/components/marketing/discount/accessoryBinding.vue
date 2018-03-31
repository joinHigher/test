<template>
    <div @click="closeTree($event)" class="binding-accessory">
        <div class="el-container">
            <el-form inline label-width="100px" ref="postForm" :model="option" :rules="postRule">
                <el-form-item label="选择仓库" prop="warehouseCode">
                    <el-select filterable v-model="option.warehouseCode" placeholder="请选择">
                        <el-option v-for="item in wareHouseOpt" :key="item.virWhCnName" :label="item.virWhCnName" :value="item.virWhCode"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="适用渠道" prop="pipelineCode">
                    <el-select clearable filterable v-model="option.pipelineCode" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="生效时长" prop="editDate">
                    <el-date-picker v-model="option.editDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.editDate)"></el-date-picker>
                </el-form-item>
                <br>
                <el-form-item label="操作备注" prop="remark" class="remark">
                    <el-input v-model.trim="option.remark"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="添加主商品" prop="type">
                    <el-radio-group v-model="option.type" @change="changeType">
                        <el-radio label="1">批量输入</el-radio>
                        <el-radio label="2">按分类添加</el-radio>
                    </el-radio-group>
                    <div>
                        <el-form-item prop="boundMain" class="bound-main">
                            <div class="accessory-tree-item" >
                                <el-input v-model.trim="option.boundMain" placeholder="请输入SKU，多个之间用英文,隔开" v-if="option.type === '1'" @blur="checkGoods(option.boundMain)"></el-input>
                                <el-input v-model.trim="option.boundMain" @click.native="changeTreeFlag" class="js_input" placeholder="请选择分类" :readonly="true" v-if="option.type === '2'"></el-input>
                                <el-tree v-show="treeFlag" :data="treeData" show-checkbox :props="treeProps" ref="tree" node-key="id"></el-tree>
                                <div class="btn-box">
                                    <el-button type="primary" v-show="treeFlag" @click="changeTree">确认选择</el-button>
                                    <el-button type="danger" v-show="treeFlag" @click="treeFlag = false">取消</el-button>
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                </el-form-item>
                <br>
                <el-form-item label="添加配件" required>
                    <el-radio-group v-model="flag">
                        <el-radio label="1" v-model="flag">指定配件SKU</el-radio>
                        <el-radio label="2" v-model="flag">按分类选取</el-radio>
                    </el-radio-group>
                </el-form-item>
                <br>
                <el-form-item v-if="flag == 1" prop="partsList" class="part-list" :rules="[{validator: arrRule}]">
                    <div v-for="(item, index) in option.partsList" :key="index" class="binding-item">
                        <el-row>
                            <el-col :span="3">
                                <el-input v-model.trim="item.partsGoodSn" placeholder="SKU"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-input v-model.trim="item.rates" placeholder="利润率" @blur="getPrice(item, 1)"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-input v-model.trim="item.shopPrice" placeholder="价格预览" readonly></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-input v-model.trim="item.priority" placeholder="排序"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-input v-model.trim="item.limitCount" placeholder="配件总数"></el-input>
                            </el-col>
                            <el-col :span="3">
                                <el-input v-model.trim="item.singleCount" placeholder="每单可选数量"></el-input>
                            </el-col>
                            <el-col :span="4">
                                <el-checkbox v-model="item.sameEffectParts" false-label="0" true-label="1">同款生效</el-checkbox>
                                <el-checkbox v-model="item.recommend" false-label="0" true-label="1">推荐</el-checkbox>
                            </el-col>
                            <el-col :span="3">
                                <el-button type="primary" icon="plus" @click="add"></el-button>
                                <el-button type="danger" icon="minus" @click="remove(index)"></el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
                
            </el-form>
            <el-form v-if="flag == 2"  inline :model="skuSearch" label-width="100px">
                <div class="accessory-card">
                    <el-form-item label="分类:" prop="catIdList">
                        <el-cascader filterable clearable v-model="skuSearch.catIdList" class="cat-tree" :options="catTree" change-on-select :props="prop"></el-cascader>
                    </el-form-item>
                    <br>
                    <el-form-item label="筛选维度">
                        <el-radio v-model="skuSearch.order" label="hot">热卖度</el-radio>
                    </el-form-item>
                    <br>
                    <el-form-item label="关键词">
                        <el-input v-model="skuSearch.keyword"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="筛选数量">
                        <el-select v-model="skuSearch.size">
                            <el-option v-for="i in 10" :key="i" :value="i" :label="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item label="利润率">
                        <el-input v-model="skuSearch.rates"></el-input>
                    </el-form-item>
                    <div class="text-center">
                        <el-button type="primary" @click="getPartGoods" :disabled="getLoading" v-loading="getLoading">筛选</el-button>
                    </div>
                </div>
                <el-table :data="skuSearch.tableData" border @selection-change="checkRow">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="goodsSn" label="SKU"></el-table-column>
                    <el-table-column prop="goodsImage" label="商品图片">
                        <template scope="scope">
                            <img width="90" height="120" :src="scope.row.goodsImage">
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsTitle" label="商品标题"></el-table-column>
                    <el-table-column prop="" label="利润率">
                        <template scope="scope">
                            <el-form-item :prop="'tableData.' + scope.$index + '.rates'" :rules="[{validator: checkRate}]">
                                <el-input placeholder="利润率" v-model="scope.row.rates" @blur="getPrice(scope.row, 2)"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="价格预览">
                        <template scope="scope">
                            <el-form-item :prop="'tableData.' + scope.$index + '.shopPrice'">
                                <el-input readonly placeholder="价格预览" v-model="scope.row.shopPrice"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="排序">
                        <template scope="scope">
                            <el-form-item :prop="'tableData.' + scope.$index + '.priority'" :rules="[{validator: checkPriority}]">
                                <el-input placeholder="排序" v-model="scope.row.priority"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="总数">
                        <template scope="scope">
                            <el-form-item :prop="'tableData.' + scope.$index + '.limitCount'" :rules="[{validator: checkNature}]">
                                <el-input placeholder="总数" v-model="scope.row.limitCount"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="每单最多">
                        <template scope="scope">
                            <el-form-item :prop="'tableData.' + scope.$index + '.singleCount'" :rules="[{validator: checkNature}]">
                                <el-input placeholder="每单最多" v-model="scope.row.singleCount"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="同款生效">
                        <template scope="scope">
                            <el-checkbox v-model="scope.row.sameEffectParts" false-label="0" true-label="1">同款生效</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="推荐">
                        <template scope="scope">
                            <el-checkbox v-model="scope.row.recommend" false-label="0" true-label="1">推荐</el-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            
            <div class="text-center">
                <el-button v-if="self.showAction_('promotion/favorable/add')" type="primary" @click="postEdit" v-loading="editLoading" :disabled="editLoading">确认绑定</el-button>
                <el-button type="danger" @click="goback">取消</el-button>
            </div>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let arrRule = (rule, value, callback) => {
            let ratesExp = /^\d*(\.\d\d?)?$/;

            let tempList = [];
            for (let i in value) {
                let item = value[i];
                if (tempList.indexOf(item.partsGoodSn) != -1) {
                    callback(new Error('SKU不能重复'));
                } else {
                    tempList.push(item.partsGoodSn);
                }

                if (!item.partsGoodSn || !item.priority || !Number.isInteger(item.priority * 1)) {
                    callback(new Error('商品和排序不能为空,排序值为整数'));
                }

                if (!ratesExp.test(item.rates)) {
                    callback(new Error('利润率为数字，最多2位小数'))
                }

                let countA = item.limitCount * 1;
                let countB = item.singleCount * 1;
                if (Number.isInteger(countA) && countA >= 0 && Number.isInteger(countB) && countB >= 0) {

                } else {
                    callback(new Error('数量限制应为自然数'));
                }

                if (countA < countB) {
                    callback(new Error('单次限制数量不能大于总限制数量'));
                }
            }

            callback();
        }

        let checkNature = (rule, val, callback) => {
            if (val * 1 >= 0 && Number.isInteger(val * 1)) {
                callback();
            } else {
                callback(new Error('数量限制应为自然数'));
            }
        }

        let checkRate = (rule, val, callback) => {
            let ratesExp = /^\d*(\.\d\d?)?$/;
            if (!ratesExp.test(val)) {
                callback(new Error('利润率为数字，最多2位小数'))
            } else {
                callback();
            }
        }

        let checkPriority = (rule, val, callback) => {
            if (!val || !Number.isInteger(val * 1)) {
                callback(new Error('排序值应为整数'));
            } else {
                callback();
            }
        }

        let checkBound = (rule, value, callback) => {
            if (this.option.type === '1') {
                let exp = /^[0-9a-zA-Z]+(\,[0-9a-zA-Z]+)*$/;
                if (!exp.test(value)) {
                    callback(new Error('SKU必填，多个以英文,隔开'));
                }

                let arr = value.split(',');
                let temp = [];
                for (let i in arr) {
                    let item = arr[i];
                    if (temp.indexOf(item) === -1) {
                        temp.push(item);
                    }
                }

                if (temp.length < arr.length) {
                    callback(new Error('输入的SKU存在重复，请检查'));
                }
            } else {
                if (!value) {
                    callback(new Error('分类不能为空，至少选择一项'));
                }
            }
            callback();
        }

        return {
            checkNature: checkNature,
            checkPriority: checkPriority,
            checkRate: checkRate,
            arrRule: arrRule,
            selectData: [],
            flag: '1',
            getLoading: false,
            skuSearch: {
                order: '',
                size: '',
                keyword: '',
                catIdList: [],
                tableData: [],
                catId: '',
                rates: '',
            },
            option: {
                type: '1',
                pipelineCode: '',
                lang: 'en',
                warehouseCode: '',
                editDate: [],
                startTime: '',
                endTime: '',
                // forcePromotion: '2',
                // forceShipping: '2',
                remark: '',
                // rates: '',
                boundMain: '',
                partsList: [{
                    partsGoodSn: '',
                    priority: '',
                    sameEffectParts: '0',
                    recommend: '0',
                    rates: '',
                    limitCount: '',
                    singleCount: '',
                    shopPrice: '',
                }],
            },

            self: this,
            editLoading: false,
            treeData: [],
            treeProps: {
                children: 'subCategoryList',
                label: 'categoryName'
            },
            wareHouseOpt: [],
            treeFlag: false,
            catIdList: '',
            postRule: {
                warehouseCode: [{
                    required: true,
                    message: '该项不能为空'
                }],
                pipelineCode: [{
                    required: true,
                    message: '该项不能为空'
                }],
                editDate: [{
                    type: 'array',
                    required: true,
                    message: '该项不能为空'
                }],
                type: [{
                    required: true,
                    message: '该项不能为空'
                }],
                boundMain: [{
                    validator: checkBound
                }],
            },
            // 分类树
            catTree: [],
            prop: {
                label: 'categoryName',
                value: 'id',
                children: 'subCategoryList',
            }
        };
    },
    computed: {
        pipeOpt () {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getOpt();
    },
    methods: {
        changeType () {
            this.option.boundMain = '';
        },
        getOpt () {
            this.$http.get('promotion/index/public-virtual-wares').then(res => {
                if (res.body.code === 0) {
                    this.wareHouseOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            // this.$http.get('promotion/index/public-category-list', {params: {lang: 'en'}}).then(res => {
            //     if (res.body.code === 0) {
            //         this.treeData = res.body.data;
            //     } else {
            //         this.$message.error(res.body.message);
            //     }
            // });

            this.$http.get('goods/category/category-drop-down').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.treeData = data;
                    this.catTree = data;
                }
            })
        },
        add () {
            this.option.partsList.push({
                partsGoodSn: '',
                priority: '',
                sameEffectParts: '0',
                recommend: '0',
                rates: '',
                limitCount: '',
                singleCount: '',
                shopPrice: '',
            });
        },
        remove (index) {
            if (this.option.partsList.length > 1) {
                this.option.partsList.splice(index, 1);
            } else {
                this.$message.warning('最后一项不能删除');
            }

        },
        changeTreeFlag () {
            if (this.option.type == '2') {
                this.treeFlag = !this.treeFlag;
            }
        },
        changeTree () {
            let data = this.$refs.tree.getCheckedNodes();
            let temp = [];
            let tempName = [];
            data.map(item => {
                if (item.subCategoryList && item.subCategoryList.length > 0) {
                } else {
                    temp.push(item.id);
                    tempName.push(item.categoryName);
                }
            });
            this.catIdList = temp.join(',');
            this.option.boundMain = tempName.join(',');
            this.$refs.postForm.validateField('boundMain');
        },
        closeTree (event) {
            let target = event.target.parentElement._prevClass;
            if (target && target.indexOf('js_input') !== -1) {

            } else {
                this.treeFlag = false;
            }
        },
        // changeForce (val, event) {
        //     if (event.target.checked) {
        //         this.option[val] = '2';
        //     }
        // },
        // 获取价格
        getPrice (item, type) {
            // 根据利润率算价格
            let params = {};
            params.rate = item.rates;
            params.virWhCode = this.option.warehouseCode;
            params.goodSn = type === 1 ? item.partsGoodSn : item.goodsSn;
            params.priceType = 4;
            params.promotionCalculate = true;
            params.isSave = true;
            params.changeUser = this.$store.getters.getUserName;
            params.pipelineCode = this.option.pipelineCode;

            if (!params.goodSn || !params.rate || !params.virWhCode || !params.pipelineCode) {
                this.$message.warning('请确认已输入仓库、渠道、sku、利润率');
                return false;
            }
            this.$http.get('goods/goods/goods-price', {params: params}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.goodsPriceList[0];
                    if (type === 1) {
                        this.$set(item, 'shopPrice', data.shopPrice);
                    } else {
                        item.shopPrice = data.shopPrice;
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        postEdit () {
            this.$refs.postForm.validate(async valid => {
                if (valid) {
                    if (this.flag == 2) {
                        if (this.selectData.length === 0) {
                            this.$message.warning('配件不能为空');
                            return;
                        } else {
                            let res = this.selectData.some((el) => {
                                return !el.priority || !el.rates;
                            });
                            if (res) {
                                this.$message.warning('勾选的配件利润率和排序不能为空');
                                return;
                            }
                        }
                    }
                    // 校验配件是否存在及是否福袋
                    let goodsList = [];
                    if (this.flag == 1) {
                        this.option.partsList.forEach(item => {
                            goodsList.push(item.partsGoodSn);
                        });
                    } else {
                        this.selectData.forEach(item => {
                            goodsList.push(item.goodsSn);
                        })
                    }
                    
                    let checkData = {
                        goodSnList: goodsList,
                        virWhCode: this.option.warehouseCode,
                    },
                    str = '';
                    const res = await this.httpPost_('promotion/index/query-goods-style', checkData);
                    const noExist = res.data.notExistGoodsList,
                          goodStyle = res.data.goodsStyleList;
                    if (noExist.length > 0) {
                        str += '配件SKU: '+noExist.join(',') + '当前仓库下不存在';
                    }
                    if (goodStyle.length > 0) {
                        str += '配件SKU: '+goodStyle.join(',') + '为捆绑商品';
                    }

                    if (str !== '') {
                        this.$alert(str, '提示', {
                            type: 'error',
                        });
                        return;
                    }


                    let params = {};
                    let timeArr = this.timeZone_(this.option.editDate, this.$store.getters.getTimeZone);
                    this.option.startTime = timeArr[0];
                    this.option.endTime = timeArr[1];

                    params = JSON.parse(JSON.stringify(this.option));
                    delete params.editDate;

                    // 按分类添加配件
                    if (this.flag == 2) {
                        let tempPartList = [];
                        this.selectData.forEach(item => {
                            tempPartList.push({
                                limitCount: item.limitCount,
                                singleCount: item.singleCount,
                                partsGoodSn: item.goodsSn,
                                priority: item.priority,
                                rates: item.rates,
                                recommend: item.recommend,
                                sameEffectParts: item.sameEffectParts,
                            });
                        });
                        params.partsList = tempPartList;
                    }
                    // 

                    if (params.type == '2') {
                        params.boundMain = this.catIdList;
                    }

                    this.editLoading = true;
                    params.partsList.forEach(item => {
                        this.$delete(item, 'shopPrice');
                        if (!item.limitCount) {
                            delete item.limitCount;
                        }
                        if (!item.singleCount) {
                            delete item.singleCount;
                        }
                    });

                    // 参数需去掉price
                    this.$http.post('promotion/favorable/add', params).then(res => {
                        this.editLoading = false;
                        if (res.body.code === 0) {
                            let data = res.body.data;
                            if (data.notValidData && data.notValidData.length > 0) {
                                let temp = [];
                                data.notValidData.map(item => {
                                    temp.push(item.split('_')[1] + '和' + item.split('_')[0] + data.message);
                                });

                                this.$notify({
                                    type: 'warning',
                                    title: '提示',
                                    message: temp.join(';')
                                })

                            } else {
                                this.$message.success(res.body.message);
                                history.back();
                            }
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.editLoading = false;
                    })
                }
            });

        },
        goback () {
            history.back();
        },
        async checkGoods(val, callback) {
            if (val) {
                let params = {
                    goodSnList: val.split(','),
                    virWhCode: this.option.warehouseCode,
                },
                str = '';
                const res = await this.httpPost_('promotion/index/query-goods-style', params);
                const noExist = res.data.notExistGoodsList,
                      goodStyle = res.data.goodsStyleList;
                if (noExist.length > 0) {
                    str += 'SKU: '+noExist.join(',') + '当前仓库下不存在';
                }
                if (goodStyle.length > 0) {
                    str += 'SKU: '+goodStyle.join(',') + '为捆绑商品';
                }

                if (str !== '') {
                    this.$alert(str, '提示', {
                        type: 'error',
                        callback: (action)=> {
                            if (callback) {
                                callback();
                            }
                        }
                    });
                }
            }
        },
        async getPartGoods(){
            let list = this.skuSearch.catIdList;
            this.skuSearch.catId = list.length > 0 ? list[list.length - 1] : '';

            let params = {};
            for (let i in this.skuSearch) {
                if (i != 'catIdList' && i != 'tableData' && i != 'rates' && this.skuSearch[i]) {
                    params[i] = this.skuSearch[i];
                }
            }

            try {
                const data = await this.httpGet_('promotion/favorable/get-parts-goods', {params: params});
                let rates = this.skuSearch.rates || '';

                data.forEach(item => {
                    item.rates = rates;
                    item.priority = '';
                    item.shopPrice = '';
                    item.limitCount = '';
                    item.singleCount = '';
                    item.sameEffectParts = '0';
                    item.recommend = '0';
                });
                this.skuSearch.tableData = data;
            } finally {
                this.getLoading = false;
            }
        },
        checkRow(val) {
            this.selectData = val;
        },
    }
}
</script>

<style lang="less">
    .binding-accessory {
        .accessory-card {
            margin-left: 100px;

            border: 1px solid #20A0FF;
            border-radius: 25px;
            padding: 10px;
            margin-bottom: 10px;
            width:50%;

            .el-form-item__content {
                width: 400px;

                .cat-tree {
                    width: 400px;
                }
            }
        }

        .part-list {
            .el-form-item__content {
                margin-left: 90px;
            }
            .el-col {
                margin-left: 10px;
            }
        }

        .bound-main {
            width: 600px;
            .el-form-item__content {
                width: 100%;
            }
        }

        .remark {
            width: 600px;
            .el-form-item__content {
                width: 350px;
            }
        }

        .text-center {
            margin-top: 10px;
        }

        // .el-form-item__content {
        //     width:350px;
        // }
    }
    .accessory-tree-item {
        position: relative;

        .el-form-item__content {
            width: 400px;
        }

        .el-tree {
            height: 400px;
            overflow-y: auto;
            position: absolute;
            top: 36px;
            width: 100%;
            z-index: 10;
        }

        .btn-box {
            position: absolute;
            top: 440px;
            z-index: 10;
            width: 100%;
            text-align: center;
        }
    }

    .binding-item {
        margin-bottom: 10px;
    }
</style>
