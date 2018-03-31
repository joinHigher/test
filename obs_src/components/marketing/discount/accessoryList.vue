<template>
    <div @click="closeTree($event)">
        <div class="el-container">
            <el-form label-width="100px" inline ref="searchForm" :model="option" :rules="searchRule">
                <el-form-item label="适用渠道" prop="pipelineCode">
                    <el-select clearable filterable v-model="option.pipelineCode" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="快速搜索" prop="queryType">
                        <el-select clearable filterable v-model="option.queryType" placeholder="请选择">
                            <el-option label="主商品SKU" value="1"></el-option>
                            <el-option label="分类名称" value="2"></el-option>
                            <el-option label="配件SKU" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="accessory-tree-item" prop="goodSnOrCategoryOrPart">
                        <el-input v-model.trim="option.goodSnOrCategoryOrPart" @click.native="changeTreeFlag" class="js_input"></el-input>
                        <el-tree v-show="treeFlag" :data="treeData" accordion :props="treeProps" ref="tree" node-key="id" @node-click="changeTree"></el-tree>
                    </el-form-item>
                    <el-form-item label="销售仓" prop="warehouseCode">
                        <el-select clearable filterable v-model="option.warehouseCode" placeholder="请选择">
                            <el-option v-for="item in wareHouseOpt" :key="item.virWhCode" :label="item.virWhCnName" :value="item.virWhCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="配件状态" prop="isEffect">
                        <el-select clearable filterable v-model="option.isEffect">
                            <el-option v-for="(item, index) in statusOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="配件价格" prop="price">
                        <el-row class="text-center">
                            <el-col :span="11">
                                <el-form-item prop="price">
                                    <el-input v-model.trim="option.price"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">—</el-col>
                            <el-col :span="11">
                                <el-form-item prop="priceEnd">
                                    <el-input v-model.trim="option.priceEnd"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="editDate1">
                        <el-date-picker v-model="option.editDate1" type="datetimerange" :editable="false" @change="checkDate_($event, option.editDate1)"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="editDate2">
                        <el-date-picker v-model="option.editDate2" type="datetimerange" :editable="false" @change="checkDate_($event, option.editDate2)"></el-date-picker>
                    </el-form-item>
                </div>
                <div>
<!--                     <el-form-item label="强制生效：" prop="forcePromotion">
                        <el-checkbox v-model="option.forcePromotion" true-label="1" false-label="2">利润率锁定</el-checkbox>
                        <el-checkbox v-model="option.forceShipping" true-label="1" false-label="2">包邮费用锁定</el-checkbox>
                    </el-form-item> -->
                    <el-form-item label="利润率说明" prop="ratesRemark">
                        <el-checkbox-group v-model="option.ratesRemark">
<!--                             <el-checkbox label="1">最低利润率</el-checkbox> -->
                            <el-checkbox label="2">限价</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
                <div class="text-right">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-left">
                <el-button v-if="self.showAction_('promotion/favorable/delete')" :disabled="checkedRow.length === 0" type="danger" @click="batchRemove">批量删除</el-button>
                <el-button :disabled="checkedRow.length === 0" type="primary" @click="copySKU('boundMain')">复制主商品SKU</el-button>
                <el-button :disabled="checkedRow.length === 0" type="primary" @click="copySKU('partsGoodSn')">复制配件SKU</el-button>
                <router-link v-if="self.showAction_('promotion/favorable/add')" :to="{name: 'marketing_discount_accessoryBinding'}" class="el-button el-button--primary fr">
                    绑定配件
                </router-link>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading" @selection-change="checkRow" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="boundMain" label="SKU/分类ID"></el-table-column>
                <el-table-column prop="mainName" label="商品标题/分类标题" width="160"></el-table-column>
                <el-table-column prop="partsGoodSn" label="配件SKU" width="120"></el-table-column>
                <el-table-column prop="partsName" label="配件名称" width="160"></el-table-column>
                <el-table-column label="生效渠道">
                    <template scope="scope">
                        {{pipeOpt[scope.row.pipelineCode]}}
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="配件价"></el-table-column>
                <el-table-column prop="rates" label="利润率"></el-table-column>
<!--                 <el-table-column label="强制生效">
                    <template scope="scope">
                        <span v-if="scope.row.forcePromotion == '1'">利润率锁定</span>
                        <span v-if="scope.row.forceShipping == '1'">包邮费用锁定</span>
                        <span v-if="scope.row.forceShipping != '1' && scope.row.forcePromotion != '1'">——</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="priceMark" label="利润率说明">
                    <template scope="scope">
                        {{rateOpt[scope.row.priceMark]}}
                    </template>
                </el-table-column>
                <el-table-column prop="limitCount" label="配件总数"></el-table-column>
                <el-table-column prop="singleCount" label="单次上限"></el-table-column>
                <el-table-column label="仓库">
                    <template scope="scope">
                        {{wareObj[scope.row.warehouseCode]}}
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" width="170px">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" width="170px">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="是否推荐">
                    <template scope="scope">
                        <span v-if="scope.row.recommend == 1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column label="生效状态">
                    <template scope="scope">
                        {{statusOpt[scope.row.isEffect]}}
                    </template>
                </el-table-column>
                <el-table-column prop="priority" label="排序"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="updatorName" label="操作人"></el-table-column>
                <el-table-column label="创建主体">
                    <template scope="scope">
                        <span v-if="scope.row.sponsor">{{scope.row.sponsor}}</span>
                        <span v-else>GB</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" column-key="handle" fixed="right">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('promotion/favorable/add')" type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                        <el-button v-if="self.showAction_('promotion/favorable/delete')" type="danger" size="small" @click="removeItem(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <input id="copyTxt" v-model="copyTxt" class="hidden-input">
        <!-- 弹窗S -->
        <el-dialog title="编辑" v-model="editDialog" size="tiny">
            <el-form :model="editForm" label-width="100px" ref="editDialogForm" :rules="editRule">
                <el-form-item label="生效时长" prop="editDate">
                    <el-date-picker v-model="editForm.editDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.editDate)"></el-date-picker>
                </el-form-item>
                <el-form-item label="生效渠道">
                    {{pipeOpt[editForm.pipelineCode]}}
                </el-form-item>
<!--                 <el-form-item label="生效设置">
                    <el-checkbox v-model="editForm.forcePromotion" :true-label="1" :false-label="2" @change="changeForce('forceShipping', $event)">利润率锁定</el-checkbox>
                    <el-checkbox v-model="editForm.forceShipping" :true-label="1" :false-label="2" @change="changeForce('forcePromotion', $event)">包邮费用锁定</el-checkbox>
                </el-form-item> -->
                <el-form-item label="配件利润率" prop="rates">
                    <el-input v-model.trim="editForm.rates" @blur="getPrice"></el-input>
                </el-form-item>
                <el-form-item label="价格预览" prop="shopPrice">
                    <el-input v-model.trim="editForm.shopPrice" readonly placeholder="利润率输入框失去焦点时自动计算"></el-input>
                </el-form-item>
                <el-form-item label="操作备注" prop="remark">
                    <el-input v-model="editForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="显示排序" prop="priority">
                    <el-input v-model.trim="editForm.priority"></el-input>
                </el-form-item>
                <el-form-item label="是否推荐" prop="recommend">
                    <el-radio v-model="editForm.recommend" :label="1">是</el-radio>
                    <el-radio v-model="editForm.recommend" :label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postEdit">确 定</el-button>
                <el-button type="danger" @click="editDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let time = new Date().getTime();

        let checkNumber = (rule, value, callback) => {
            if (value == '' || Number(value) > 0) {
                callback();
            } else {
                callback(new Error('该项应为正数'));
            }
        }

        let checkOrder = (rule, value, callback) => {
            if (Number(value) > 0 && Number.isInteger(value * 1)) {
                callback();
            } else {
                callback(new Error('该项必填，且为正整数'));
            }
        }
        return {
            init: 0,
            option: {
                pipelineCode: '',
                page: 1,
                page_size: 10,
                queryType: '',
                goodSnOrCategoryOrPart: '',
                price: '',
                priceEnd: '',
                warehouseCode: '',
                warehouseCode: '',
                isEffect: '',
                // forcePromotion: '',
                // forceShipping: '',
                editDate1: [new Date(time - 30 * 24 * 3600000), new Date(time + 30 * 24 * 3600000)],
                startDate: '',
                startDateEnd: '',
                editDate2: [new Date(time - 30 * 24 * 3600000), new Date(time + 30 * 24 * 3600000)],
                endDate: '',
                endDateEnd: '',
                ratesRemark: [],
            },
            self: this,
            tableLoading: false,
            total: 10,
            tableData: [],
            wareHouseOpt: [],
            wareObj: {},
            checkedRow: [],
            copyTxt: '',
            editDialog: false,
            editForm: {
                id: '',
                type: '',
                warehouseCode: '',
                boundMain: '',
                partsGoodSn: '',
                startTime: '',
                endTime: '',
                editDate: [],
                // forcePromotion: '2',
                // forceShipping: '2',
                rates: '',
                remark: '',
                priority: 1,
                recommend: 0,
                shopPrice: '',
                priceMark: '',
                pipelineCode: '',
            },
            treeData: [],
            treeProps: {
                children: 'subCategoryList',
                label: 'categoryName'
            },
            treeFlag: false,
            statusOpt: {
                '0': '未生效',
                '1': '生效中',
                '2': '已失效'
            },
            rateOpt: {
                '0': '普通',
                '1': '最低利润率',
                '2': '限价',
                '3': '最低利润率，限价'
            },
            catId: '',
            searchRule: {
                price: [{
                    validator: checkNumber,
                    trigger: 'blur'
                }],
                priceEnd: [{
                    validator: checkNumber,
                    trigger: 'blur'
                }],
            },
            editRule: {
                priority: [{
                    validator: checkOrder,
                    trigger: 'blur'
                }],
                rates: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }, {
                    validator: checkNumber,
                    trigger: 'blur'
                }],
                editDate: [{
                    type: 'array',
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                shopPrice: [{
                    required: true,
                    message: '该项不能为空',
                }]
            },
            flag: false,
        };
    },
    computed: {
        pipeOpt () {
            let temp = this.$store.getters.getPipe.obj;
            for (let i in temp) {
                if (!this.flag) {
                    this.option.pipelineCode = i;
                    this.flag = true;
                    this.getData();
                    break;
                }
            }
            return temp;
        }
    },
    created () {
    },
    methods: {
        getOpt () {
            this.$http.get('promotion/index/public-virtual-wares').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.wareHouseOpt = data;

                    let temp = {};
                    data.forEach(item => {
                        temp[item.virWhCode] = item.virWhCnName;
                    });
                    this.wareObj = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/index/public-category-list', {params: {lang: 'en'}}).then(res => {
                if (res.body.code === 0) {
                    this.treeData = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            let params = {};
            let timeArr1 = this.timeZone_(this.option.editDate1, this.$store.getters.getTimeZone);
            this.option.startDate = timeArr1[0];
            this.option.startDateEnd = timeArr1[1];

            let timeArr2 = this.timeZone_(this.option.editDate2, this.$store.getters.getTimeZone);
            this.option.endDate = timeArr2[0];
            this.option.endDateEnd = timeArr2[1];

            for (let i in this.option) {
                if (i !== 'editDate1' && i !== 'editDate2' && i !== 'ratesRemark') {
                    params[i] = this.option[i]
                }
            }
            params.ratesRemark = this.option.ratesRemark.join(',');

            if (this.option.queryType == '2') {
                params.goodSnOrCategoryOrPart = this.catId;
            }

            this.tableLoading = true;
            this.$http.get('promotion/favorable/parts-lists', {params: params}).then(res => {
                if (this.init === 0) {
                    this.getOpt();
                    this.init = 1;
                }
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.total = res.body.data.totalCount;
                }
            }).catch(err => {
                this.tableLoading = false;
            })
        },
        changeTreeFlag () {
            if (this.option.queryType == '2') {
                this.treeFlag = !this.treeFlag;
            }
        },
        changeTree (data, node) {
            if (node.childNodes.length === 0) {
                this.treeFlag = false;
                this.option.goodSnOrCategoryOrPart = data.categoryName;
                this.catId = data.id;
            }
        },
        closeTree (event) {
            let target = event.target.parentElement._prevClass;
            if (target && target.indexOf('js_input') !== -1) {

            } else {
                this.treeFlag = false;
            }
        },
        changeForce (val, event) {
            if (event.target.checked) {
                this.editForm[val] = '';
            }
        },
        getPrice () {
            // 根据利润率算价格
            let params = {};
            params.rate = this.editForm.rates;
            params.pipelineCode = this.editForm.pipelineCode;
            params.virWhCode = this.editForm.warehouseCode;
            params.goodSn = this.editForm.partsGoodSn;
            params.priceType = 4;
            params.promotionCalculate = true;
            params.isSave = 1;
            params.changeUser = this.$store.getters.getUserName;
            this.$http.get('goods/goods/goods-price', {params: params}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.goodsPriceList[0];
                    this.editForm.shopPrice = data.shopPrice;
                    this.editForm.priceMark = data.priceMark;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        edit (row) {
            // 待编辑
            this.$http.get('promotion/favorable/parts-info', {params: {id: row.id}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    // 重置editform
                    for (let i in this.editForm) {
                        this.editForm[i] = data[i];
                    }
                    this.editForm.shopPrice = data.price;
                    this.editForm.priceMark = '';

                    this.editForm.rates = String(this.editForm.rates);
                    this.editForm.editDate = [new Date(this.editForm.startTime * 1000), new Date(this.editForm.endTime * 1000)];
                    this.editDialog = true;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        postEdit () {
            this.$refs.editDialogForm.validate(valid => {
                if (valid) {
                    let params = {};
                    let timeArr = this.timeZone_(this.editForm.editDate, this.$store.getters.getTimeZone);
                    this.editForm.startTime = timeArr[0];
                    this.editForm.endTime = timeArr[1];

                    for (let i in this.editForm) {
                        if (i !== 'editDate') {
                            params[i] = this.editForm[i];
                        }
                    }

                    this.$http.post('promotion/favorable/edit', params).then(res => {
                        if (res.body.code === 0) {
                            this.editDialog = false;
                            this.getData();
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }
            })
        },
        checkRow (val) {
            this.checkedRow = val;
        },
        copySKU (params) {
            let temp = [];
            this.checkedRow.map(item => {
                temp.push(item[params]);
            });

            this.copyTxt = temp.join(',');
            var cpt = document.getElementById('copyTxt');
            cpt.value = this.copyTxt;
            cpt.select();
            try{
                if(document.execCommand('copy', false, null)){
                    this.$message.success('复制成功')
                } else{
                    this.$message({
                        type: 'warning',
                        message: '浏览器不可用复制'
                    });
                }
            } catch(err){
                this.$message.error(err);
            }
        },
        batchRemove () {
            let temp = [];
            this.checkedRow.map(item => {
                temp.push(item.id);
            });

            this.$confirm('是否删选中项?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('promotion/favorable/delete', {id: temp.join(',')}).then(res => {
                    if (res.body.code == 0) {
                        this.getData();
                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除!'
                });
            });
        },
        removeItem (row) {
            this.$confirm('是否删除该项?', '提示', {
                type: 'warning'
            }).then(() => {

                this.$http.post('promotion/favorable/delete', {id: row.id}).then(res => {
                    if (res.body.code == 0) {
                        let index = this.tableData.indexOf(row);
                        this.tableData.splice(index, 1);
                        this.total--;
                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除!'
                });
            });
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.page_size = val;
            this.getData();
        },
        resetForm () {
            this.$refs.searchForm.resetFields();
            this.option.forceShipping = '';
            this.option.priceEnd = '';
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
    }
}
</script>

<style lang="less">
    .accessory-tree-item {
        position: relative;

        .el-form-item__content {
            width: 300px;
        }

        .el-tree {
            height: 300px;
            overflow-y: auto;
            position: absolute;
            top: 36px;
            width: 100%;
            z-index: 10;
        }
    }
</style>
