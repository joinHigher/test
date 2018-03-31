<template>
    <div class="el-container el-inventory-container">
        <h3>虚拟库存数默认初始值</h3>
        <div class="el-inventory-num-container">
            <div class="stock-inventory-container">
                <span class="stock-tip">注意：新增/修改后，对于已有数据不会立即更改，系统自动更新频率为每天</span>
                <el-button type="primary" class="fr" @click="isInventoryTable = true" style="margin-left: 20px;" v-if="!isInventoryTable">解锁</el-button>
                <el-button type="primary" class="fr" @click="addInventoryTable" v-if="isInventoryTable">添加</el-button>  
            </div>
            <el-form :model="inventoryForm" ref="inventoryForm">
                <el-table :data="inventoryForm.stocks" border ref="inventoryTable" >
                    <el-table-column label="商品出货价（¥）">
                        <template scope="scope">
                            <el-form-item class="operate-area-item">
                                <el-col :span="10">
                                    <el-form-item :prop="'stocks.' + scope.$index + '.shipRegionLow'" :rules="[{ validator: checkRanges, trigger: 'blur' }]">
                                        <el-input  v-model="scope.row.shipRegionLow" style="width: 100%;" :disabled="!isInventoryTable"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4" class="text-center">
                                   <=price<
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item :prop="'stocks.' + scope.$index + '.shipRegionHigh'" :rules="[{ validator: checkRanges, trigger: 'blur' }]">
                                        <el-input  v-model="scope.row.shipRegionHigh" style="width: 100%;" :disabled="!isInventoryTable"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="初始值" width="100">
                        <template scope="scope">
                            <el-form-item :prop="'stocks.' + scope.$index + '.defaultStock'" class="operate-area-item" :rules="[{ validator: checkInteger, trigger: 'blur' }]">
                                <el-input  v-model="scope.row.defaultStock" style="width: 100%;" :disabled="!isInventoryTable"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-button  type="text" size="small" @click="delInventoryItem(scope.row)" :disabled="!isInventoryTable">删除</el-button>  
                        </template> 
                    </el-table-column>
                </el-table>
            </el-form>
            <div class="text-center" style="margin-top: 30px;" v-show="isInventoryTable">
                <el-button type="primary"  @click="saveInventory">保存</el-button>  
                <el-button type="primary"  @click="cancelInventory" style="margin-left: 20px;">取消</el-button>
            </div>
        </div>

        <h3>虚拟库存数更新规则</h3>
        <div class="stock-inventory-container">
            <span class="stock-tip">注意：新增/修改后，对于已有数据不会立即更改，系统自动更新频率为每天</span>
            <el-button type="primary" class="fr" style="margin-left: 20px;" @click="addRule">添加更新规则</el-button>
            <el-button type="primary" class="fr" @click="handlePriority">调整优先级</el-button>
        </div>
        <el-table :data="tableData" border ref="table" v-loading="dataLoading">
            <el-table-column prop="sort" label="优先级"></el-table-column>
            <el-table-column prop="ruleName" label="规则名称"></el-table-column>
            <el-table-column label="适用范围">
                <template scope="scope">
                    <span class="rangeSpan" v-if="scope.row.saleMark">指定销售标识</span>
                    <span class="rangeSpan" v-if="scope.row.limitGoodSn">指定SKU</span>
                    <span class="rangeSpan" v-if="scope.row.limitReallyWarehouse">指定真实仓</span>
                </template>    
            </el-table-column>
            <el-table-column label="执行公式">
                <template scope="scope">
                    {{ scope.row.formula | handleFormula }}
                </template>
            </el-table-column>
            <el-table-column label="是否启用">
                <template scope="scope">
                    <el-button type="text" @click="handleToggleStatusClick(scope.row)"><i :class="{'el-icon-circle-check color-success': scope.row.isEnable == 1, 'el-icon-circle-cross color-danger': scope.row.isEnable == 0}"></i></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="operateUser" label="操作人"></el-table-column>
            <el-table-column label="最近操作时间" width="200">
                <template scope="scope">
                    {{ timeZone_(scope.row.updateTime/1000, $store.getters.getTimeZone) }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button  type="text" size="small" @click="editRule(scope.row)">修改</el-button>  
                    <el-button  type="text" size="small" @click="copyRule(scope.row)">复制</el-button>  
                    <el-button  type="text" size="small" @click="delTableItem(scope.row)">删除</el-button>  
                </template>
            </el-table-column>

        </el-table>

        <div class="text-right el-sub-container">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
        </div>

        <!-- 调整规则优先级  start-->
        <el-dialog title="调整规则优先级"  :visible.sync="isPriority" size="tiny" @close="priorityDialogClose"  class="priority-dialog">
            <div class="priority-dialog-draggable">    
                <draggable v-model="allRules" element="ul" :options="{group: 'priority'}">
                    <transition-group name="priority">
                        <li v-for="item in allRules" :key="item.id" class="priority-item" >
                            {{ item.ruleName }}
                        </li>
                    </transition-group>
                </draggable>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isPriority = false">取 消</el-button>
                <el-button type="primary" @click="savePriority">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 调整规则优先级  end-->


    </div>
</template>

<script>
import draggable from 'vuedraggable'
import httpGet, { getRealWhCodeList, httpPost } from '../../common/baseApi'
export default {
    components: {
        draggable
    },
    data () {
        let checkInteger = (rule, value, callback) => {
            let reg = /^0$|^[1-9]{1}[\d]*$/;
            if (reg.test(value)) {
                return callback();
            } else {
                return callback(new Error('该项必须为正整数'));
            }
        }
        let checkRanges = (rule, value, callback) => {
            let arr = rule.field.split('.');
            // console.log(rule);
            let reg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}|0$/;
            if (reg.test(value)) {
                let min = '';
                let max = '';
                switch(arr[2]) {
                    case 'shipRegionLow': 
                        min = value;
                        let shipRegionHigh = this.inventoryForm.stocks[arr[1]].shipRegionHigh;
                        max = shipRegionHigh;
                        if(shipRegionHigh) {
                            this.$refs['inventoryForm'].validateField('stocks.' + arr[1] + '.shipRegionHigh')
                        }
                    break;

                    case 'shipRegionHigh':
                        max = value;
                        let shipRegionLow = this.inventoryForm.stocks[arr[1]].shipRegionLow;
                        min = shipRegionLow;
                        if(shipRegionLow && +shipRegionLow >= +value) {
                            return callback(new Error('最终价不应该小于等于起始价'));
                        }
                    break;
                }
                if (min && max) {
                    let compareArr = JSON.parse(JSON.stringify(this.inventoryForm.stocks)).map((item) => {
                        return [item.shipRegionLow, item.shipRegionHigh];
                    });
                    compareArr.splice(arr[1], 1);
                    if(compareArr.some((item) => {
                        let minAggregate = [item[0], min];
                        let maxAggregate = [item[1], max];
                        return Math.max.apply(null, minAggregate) < Math.min.apply(null, maxAggregate)
                    })) {
                        return callback(new Error('区间不可存在重叠'));
                    }
                }
                return callback();
            } else {
                return callback(new Error('该项必须大于0且最多保留两位小数点'));
            }
        }

        return {
            isPriority: false,
            isInventoryTable: false,
            // 优先级
            allRules: [],
            dataLoading: false,
            pagination: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
            },
            tableData: [],
            inventoryForm: {
                stocks: [
                    { shipRegionLow: '', shipRegionHigh: '', defaultStock: '' },
                ]
            },
            stocks: [],
            deleteIds: [],
            checkInteger: checkInteger,
            checkRanges: checkRanges
        }
    },
    created () {
        this.initData();
    },
    filters: {
        handleFormula(value) {
            let arr = value.split('|');
            let filteredArr = arr.map((item) => {
                if(item === 'startStock') {
                    return '初始值';
                }
                if(item === 'transportStock') {
                    return '在途库存';
                }
                return item;
            });
            return filteredArr.join('');
        }
    },
    methods: {
        initData() {
            this.getListData();
            this.getVirtualStockList();
        },
        // 获取数据
        async getData(params = {}) {
            return await httpGet('stock/virtual-stock/get-virtual-stock-update-rule-list', {
                params
            });
        },
        // 获取列表数据
        async getListData(param) {
            let params = {};
            if (typeof param === 'number') {
                this.pagination.pageNo = param;
            } 
            params = Object.assign({}, this.pagination);
            delete params.totalCount;
            this.dataLoading = true;
            try{
                const { virtualStockUpdateRuleRespList, totalCount } = await this.getData(params);
                this.tableData = virtualStockUpdateRuleRespList;
                this.pagination.totalCount = totalCount;
                this.dataLoading = false;

            } finally {
                this.dataLoading = false;
            }
        },
        // 获取虚拟库存数默认初始值列表
        async getVirtualStockList() {
            const { virtualStockDefaultRespList } = await httpGet('stock/virtual-stock/get-virtual-stock-default-list');
            if(virtualStockDefaultRespList.length > 0) {
                this.stocks = JSON.parse(JSON.stringify(virtualStockDefaultRespList));
                this.inventoryForm.stocks = virtualStockDefaultRespList;
            }
        },
        // 改变每页显示数
        changePageSize(value) {
            this.pagination.pageSize = value;
            this.getListData();
        },
        // 改变当前页
        changePage(value) {
            this.pagination.pageNo = value;
            this.getListData();
        },
        // 添加虚拟库存数默认初始值
        addInventoryTable() {
            this.inventoryForm.stocks.push({ shipRegionLow: '', shipRegionHigh: '', defaultStock: '' });
        },
        // 删除虚拟库存数默认初始值
        delInventoryItem(row) {
            if(row.id) {
                // this.$confirm('确定要删除此虚拟库存数默认初始值数据吗？', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(async () => {
                //     const { code, message } = await httpPost('stock/virtual-stock/delete-virtual-stock-default', { 
                //         delVirtualStockDefaultIdList: [row.id]
                //     });
                //     if(code === 0) {
                //         this.$message({
                //             type: 'success',
                //             message: message || '删除成功！'
                //         });  
                //         this.getVirtualStockList();
                //     }
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '已取消'
                //     });          
                // });  
                this.deleteIds.push(row.id);
            }
            let index = this.inventoryForm.stocks.indexOf(row);
            this.inventoryForm.stocks.splice(index, 1);
        },
        // 保存虚拟库存数默认初始值
        saveInventory() {
            this.$refs['inventoryForm'].validate(async (valid) => {
                if (valid) {
                    try {
                        if (this.deleteIds.length > 0) {
                            try {
                                await httpPost('stock/virtual-stock/delete-virtual-stock-default', { 
                                    delVirtualStockDefaultIdList: this.deleteIds
                                }); 
                            } catch(e) {
                                console.log(e);
                            }
                        }
                        let { code, message }  = await httpPost('stock/virtual-stock/save-virtual-stock-default', { 
                            saveVirtualStockDefaultReqList: this.inventoryForm.stocks
                        })
                        if(code === 0) {
                            this.$message.success(message || '修改商品虚拟库存初始值成功！');
                            this.getVirtualStockList();
                            this.isInventoryTable = false;
                        }
                    } catch(e) {
                        return;
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        // 取消保存虚拟库存数默认初始值
        cancelInventory() {
            this.inventoryForm.stocks = JSON.parse(JSON.stringify(this.stocks));
            this.deleteIds = [];
            this.$nextTick(() => {
                this.isInventoryTable = false;
            });
        },
        // 改变启用状态
        handleToggleStatusClick(row) {
            this.$confirm(row.isEnable === 0 ? '确定要启用此规则吗？' : '确定要停用此规则吗？', '更改规则状态', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let status = row.isEnable === 0 ? 1: 0;
                try {
                    let { code, message }  = await httpPost('stock/virtual-stock/update-virtual-stock-update-rule', { 
                        id: row.id,
                        isEnable: status
                    })
                    if(code === 0) {
                        this.$message.success(message || '设置规则成功！');
                        this.getListData();
                    }
                } catch(e) {
                    return;
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        // 处理优先级
        async handlePriority() {
            let allRules = [];
            const { virtualStockUpdateRuleRespList } = await this.getData();
            virtualStockUpdateRuleRespList.forEach((item) => {
                allRules.push({
                    id: item.id,
                    sort: item.sort,
                    ruleName: item.ruleName
                })
            })
            this.allRules = allRules;
            this.$nextTick(() => {
                this.isPriority = true;
            });
        },
        // 保存优先级
        async savePriority(event, isNotShowTip = false) {
            this.allRules.forEach((item, index) => {
                item.sort = index + 1;
                delete item.ruleName;
            });
            let params = {
                adjustRuleLevelReqList: this.allRules
            };
            const { message, code } = await httpPost('stock/virtual-stock/adjust-rule-level', params);
            if(code === 0 && !isNotShowTip) {
                this.$message({
                    type: 'success',
                    message: message || '调整优先级成功！'
                });  
                this.isPriority = false;
                this.getListData();
            }
        },
        priorityDialogClose() {

        },
        // 删除规则
        delTableItem(row) {
            this.$confirm('确定要删除此规则吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { code, message } = await httpPost('stock/virtual-stock/delete-virtual-stock-update-rule', { id: row.id });
                if(code === 0) {
                    let allRules = [];
                    const { virtualStockUpdateRuleRespList } = await this.getData();
                    virtualStockUpdateRuleRespList.forEach((item) => {
                        allRules.push({
                            id: item.id,
                            sort: item.sort,
                            ruleName: item.ruleName
                        })
                    })
                    this.allRules = allRules;
                    this.$nextTick(() => {
                        this.savePriority(null, true);
                    });
                    this.$message({
                        type: 'success',
                        message: message || '删除成功！'
                    });  
                    this.getListData();
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });  
        },
        // 添加新规则
        addRule() {
            this.$router.push({ name: 'stock_inventoryRuleUpdate' });
        },
        // 复制新规则
        copyRule(row) {
            this.$router.push({ name: 'stock_inventoryRuleUpdate', query: { id: row.id, copy: true }});
        },
        // 修改新规则
        editRule(row) {
            this.$router.push({ name: 'stock_inventoryRuleUpdate', query: { id: row.id }});
        }
    }
}
</script>
<style lang="less">
    .el-inventory-container {
        .el-inventory-num-container{
            width: 680px;
            .operate-area-item{
                margin-top: 22px;
                margin-bottom: 30px;
            }
            margin-bottom: 20px;
        }
        h3 {
            color: #20A0FF;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px #48576a solid;
            position: relative;
            padding-left: 10px;
            &::before{
                content: '';
                position: absolute;
                left: 0;
                bottom: 10px;
                height: 20px;
                width: 3px;
                background-color: #20A0FF;
            }
        }
        .stock-inventory-container{
            margin: 20px 0 30px;
        }
        .stock-tip {
            color: orange;
        }
        .priority-dialog-draggable{
            max-height: 600px;
            overflow-y: auto;
        }
        .priority-dialog{
            .priority-dialog-draggable{
                li {
                    cursor: pointer;
                    padding-left: 5px;
                    height: 30px;
                    line-height: 30px;
                    border: 1px solid #8492A6;
                    background-color: #99A9BF;
                    color: #fff;
                    margin-bottom: 4px;
                    transition: all 1s;
                    &:hover{
                        border: 1px solid #20A0FF;
                        background-color: #58B7FF;
                    }
                }
                .priority-enter, .priority-leave-active {
                    opacity: 0;
                }
            }
        }
        .rangeSpan + .rangeSpan::before {
            content: '、';
        }
    }
</style>
