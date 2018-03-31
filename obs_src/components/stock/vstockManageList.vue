<!-- 虚拟库存数管理 -->
<template>
    <div class="el-container el-vstock-container">
        <el-form inline :model="filterForm" ref="filterForm" :rules="searchRules">
            <el-form-item label="SKU" prop="skus">
                <el-input v-model="filterForm.skus" placeholder="多个SKU用“,”隔开"></el-input>
            </el-form-item>
            <el-form-item label="虚拟库存数">
                <el-col :span="11">
                    <el-form-item prop="virtualStockMin">
                        <el-input v-model="filterForm.virtualStockMin"  style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="virtualStockMax">
                        <el-input  v-model="filterForm.virtualStockMax" style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="默认初始值" prop="isDefault">
                <el-select v-model="filterForm.isDefault" clearable  placeholder="请选择">
                    <el-option label="使用默认" value="1"></el-option>
                    <el-option label="不使用默认" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="真实仓库" prop="realWhCode">
                <el-select v-model="filterForm.realWhCode" clearable filterable  placeholder="请选择">
                    <el-option v-for="(item, key) in realWhCodeList" :key="key" :label="item" :value="key"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="操作人" prop="operateUser">
                <el-input v-model="filterForm.operateUser"></el-input>
            </el-form-item>

            <el-form-item label="更新时间" prop="updateDate">
                <el-date-picker type="datetimerange" v-model="filterForm.updateDate" placeholder="选择时间范围"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search"><i class="el-icon-search"></i> 筛选</el-button>
                <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
            </el-form-item>
        </el-form>

        <div class="stock-batch-container">
            <el-button type="primary" :disabled="multipleSelection.length === 0" @click="batchUpdate" class="stock-batch-btn">批量更新虚拟库存数</el-button>
            <span class="stock-tip">同步商品可售库存数（SKU+仓）=实际库存数+库存虚拟数</span>
        </div>
        <el-table :data="tableData" border ref="table" v-loading="dataLoading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="商品信息" width="300">
                <template scope="scope">
                    <div class="vstock-manage-info">
                        <p>{{scope.row.goodSn}}</p>
                        <!-- <p>{{scope.row.dec1}}</p>
                        <p>{{scope.row.dec2}}</p> -->
                    </div>
                </template>         
            </el-table-column>
            <el-table-column label="销售仓" prop="virWhName"></el-table-column>
            <el-table-column label="真实仓" prop="realWhName"></el-table-column>
            <el-table-column label="初始值">
                <template scope="scope">
                    {{scope.row.starterStock}}
                </template>  
            </el-table-column>
            <el-table-column prop="transportStock" label="在途库存"></el-table-column>
            <el-table-column prop="virtualStock" label="虚拟库存数"></el-table-column>
            <el-table-column prop="operateUser" label="最近操作人"></el-table-column>
            <el-table-column label="最近更新时间" width="200">
                <template scope="scope">
                    {{ timeZone_(scope.row.updateTime/1000, $store.getters.getTimeZone) }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button  type="text" size="small" @click="update(scope.row)">修改初始值</el-button>
                </template>
            </el-table-column>

        </el-table>

        <div class="text-right el-sub-container">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
        </div>

        <el-dialog :title="stockForm.type === 1 ? '修改商品虚拟库存初始值' : '批量修改商品虚拟库存初始值'"  :visible.sync="stockForm.isShow" @close="handleClose" size="tiny">
            <el-form :model="stockForm" ref="stockForm" :rules="rules">
                <el-form-item :label="stockForm.type === 1 ? '商品SKU：' : '设置范围：'">
                    <div class="stock-text" v-if="stockForm.goodsVirtualStock.length === 1 && stockForm.type === 1"> {{stockForm.goodsVirtualStock[0]['goodSn']}} </div>
                    <div class="stock-text" v-else> 已选中<span class="stock-tip">{{stockForm.goodsVirtualStock.length}}</span>条数据 </div>
                </el-form-item>
                <el-form-item v-if="stockForm.goodsVirtualStock.length === 1 && stockForm.type === 1" label="真实仓：">
                    <div class="stock-text">
                       {{ realWhCodeList[stockForm.goodsVirtualStock[0]['realWhCode']] }}
                    </div>
                </el-form-item>
                <el-form-item label="是否使用默认">
                    <el-radio-group v-model="stockForm.isSetDefault" @change="changeDefault">
                        <el-radio :label="false">使用默认</el-radio>
                        <el-radio :label="true">人工设置</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="初始值：" prop="initValue">
                    <el-input v-model="stockForm.initValue" class="stock-input" :disabled="!stockForm.isSetDefault"></el-input>
                </el-form-item>
<!--                 <el-form-item>
                    <el-checkbox v-model="stockForm.isSetDefault" @change="changeDefault">不使用默认初始值</el-checkbox>
                </el-form-item> -->
            </el-form>
            <p class="p-error">注意：计算存在延迟，修改后请手动刷新页面查看最新虚拟库存数</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="stockForm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

import httpGet, { getRealWhCodeList, httpPost } from '../../common/baseApi'

export default {
    data () {
        let validateRange = (rule, value, callback) => {
            if (value === '') {
                callback();
            } 
            else if(!Number.isInteger(value * 1)){
                callback(new Error('只能为整数'));
            }
            else {
                if (this.filterForm['virtualStockMax'] !== '') {
                    this.$refs.filterForm.validateField('virtualStockMax');
                }
                callback();
            }
        };

        let validateRange2 = (rule, value, callback) => {
            if (value === '') {
                callback();
            } 
            else if(!Number.isInteger(value * 1)){
                callback(new Error('只能为整数'));
            }
            else if (value * 1 <= this.filterForm['virtualStockMin'] * 1) {
                callback(new Error('最大值不能小于等于最小值'));
            } else {
                callback();
            }
        };
        let checkInteger = (rule, value, callback) => {
            if(this.stockForm.isSetDefault) {
                let reg = /0|^[0-9]*[1-9][0-9]*$/;
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error('请输入大于等于0的整数'));
                }
            } 
            return callback();
        };

        let time = new Date(),
        year = time.getFullYear(),
        month = time.getMonth(),
        day = time.getDate();
        
        return {
            filterForm: {
                skus: '',
                realWhCode: '',
                virtualStockMin: '',
                virtualStockMax: '',
                isDefault: '',
                operateUser: '',
                updateDate: [new Date(year, month, day, 0, 0, 0), new Date(year, month, day, 23, 59, 59)]
            },
            stockForm: {
                isShow: false,
                type: 1,
                initValue: '',
                isSetDefault: false,
                goodsVirtualStock: []
            },
            dataLoading: false,
            pagination: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
            },
            realWhCodeList: {},
            tableData: [],
            multipleSelection: [],
            rules: {
                initValue: [
                    { validator: checkInteger, trigger: 'blur' }
                ]
            },
            searchRules: {
                virtualStockMin: [{ validator: validateRange, trigger: 'blur' }],
                virtualStockMax: [{ validator: validateRange2, trigger: 'blur' }]
            },
        }
    },
    created () {
        this.initData();
    },
    methods: {
        initData() {
            this.getRealWhCodeList();
            // this.getListData();
        },
        // 获取列表数据
        async getListData(param) {
            let params = {};
            if (typeof param === 'number') {
                this.pagination.pageNo = param;
            } 
            params = Object.assign({}, this.pagination, this.filterForm);
            if (params.updateDate.length === 2 && params.updateDate[0] && params.updateDate[1]){
                let time1 = this.timeZone_(params.updateDate[0], this.$store.getters.getTimeZone);
                let time2 = this.timeZone_(params.updateDate[1], this.$store.getters.getTimeZone);
                params.startTime = time1 * 1000;
                params.endTime = time2 * 1000;
            }
            if (params.skus) {
                params.goodSnList = params.skus.split(',');
            }
            delete params.skus; 
            delete params.updateDate;
            delete params.totalCount;
            this.dataLoading = true;
            try{
                const { list, totalCount } = await httpGet('stock/virtual-stock/query-goods-virtual-stock-list', {
                    params
                });
                this.tableData = list;
                this.pagination.totalCount = totalCount;
                this.dataLoading = false;

            } finally {
                this.dataLoading = false;
            }
        },
        // 获取真实仓
        async getRealWhCodeList() {
            const data = await getRealWhCodeList();
            let realWhCodeList = {};
            data.forEach((item) => {
                item.whCode && (realWhCodeList[item.whCode] = item.name + '（' + item.whCode + '）');
            });
            this.realWhCodeList = realWhCodeList;
        },
        // 帅选
        search() {
            this.$refs['filterForm'].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    return false;
                }
                const setUpdateDate = () => {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    this.filterForm.updateDate = [start, end];
                }
                if (this.filterForm.skus === '') {
                    if (this.filterForm.updateDate.length === 2 && this.filterForm.updateDate[0] && this.filterForm.updateDate[1]) {
                        let time1 = this.timeZone_(this.filterForm.updateDate[0], this.$store.getters.getTimeZone);
                        let time2 = this.timeZone_(this.filterForm.updateDate[1], this.$store.getters.getTimeZone);
                        if (time2 - time1 > 3600 * 24 * 7) {
                            return this.$message({
                                type: 'error',
                                message: '不限定SKU则最多可查询7天数据'
                            });  
                        }
                    } else {
                        setUpdateDate();
                    }
                }
                this.getListData(1);
            });
        },
        // 取消筛选
        handleBtnCancelFilterClick() {
            this.$refs.filterForm.resetFields();
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
        // 多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 弹框关闭
        handleClose() {
            this.stockForm.isSetDefault = false;
            this.stockForm.type = 1;
            this.stockForm.initValue = '';
            this.$refs['stockForm'].resetFields();
        },
        // 更新库存
        update(row) {
            this.stockForm.goodsVirtualStock = [{
                realWhCode: row.realWhCode,
                goodSn: row.goodSn,
                starterStock: row.starterStock,
                isDefault: row.isDefault
            }];
            this.stockForm.isSetDefault = row.isDefault === 0 ? true : false;
            this.stockForm.initValue = row.isDefault === 0 ? row.starterStock : '';
            this.stockForm.type = 1;
            this.stockForm.isShow = true;
        },
        // 批量更新库存
        batchUpdate() {
            this.stockForm.type = 2;
            let goodsVirtualStock = [];
            this.multipleSelection.forEach((item) => {
                goodsVirtualStock.push({
                    realWhCode: item.realWhCode,
                    goodSn: item.goodSn,
                    starterStock: item.starterStock,
                    isDefault: 1
                });
            });
            this.stockForm.isSetDefault = false;
            this.stockForm.goodsVirtualStock = goodsVirtualStock;
            this.stockForm.initValue = '';
            this.stockForm.isShow = true;
        },
        // 保存更新库存数
        save() {
            // if (!this.stockForm.isSetDefault && this.stockForm.type === 2) { this.stockForm.isShow = false; return; }
            this.$refs['stockForm'].validate(async (valid) => {
                if (valid) {
                    switch(this.stockForm.type) {
                        case 1: 
                            this.stockForm.goodsVirtualStock.forEach((item) => {
                                item.starterStock = this.stockForm.initValue ? this.stockForm.initValue : 0;
                                item.isDefault = this.stockForm.isSetDefault ? 0 : 1;
                            });
                        break;
                        case 2:
                            this.stockForm.goodsVirtualStock.forEach((item) => {
                                item.starterStock = this.stockForm.initValue ? this.stockForm.initValue : 0;
                                item.isDefault = 0;
                            });
                        break;
                    }
                    let params = {
                        goodsVirtualStockReqList: this.stockForm.goodsVirtualStock
                    };
                    try {
                        let { code, message }  = await httpPost('stock/virtual-stock/update-goods-virtual-stock', params)
                        if(code === 0) {
                            this.$message.success(message || '修改商品虚拟库存初始值成功！');
                            this.stockForm.isShow = false;
                            this.getListData();
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
        // 修改是否使用虚拟库存的状态值
        changeDefault(event) {
            if(!event) {
                this.$refs['stockForm'].resetFields();
                if (this.stockForm.type === 1) {
                    this.stockForm.initValue = this.stockForm.goodsVirtualStock[0].starterStock;
                } else {
                    this.stockForm.initValue = '';
                }
            }
        }
    }
}
</script>
<style lang="less">
    .el-vstock-container {
        .stock-input{
            width: 120px;
        }
        .stock-tip {
            color: orange;
        }
        .stock-batch-container{
            margin-bottom: 30px;
            .stock-batch-btn{
                margin-right: 20px;
            }
        }
        .vstock-manage-info p {
            &:nth-child(3) {
                color: #ccc;   
            }
        }

        .p-error {
            color: #ff4949;
        }
    }
</style>
