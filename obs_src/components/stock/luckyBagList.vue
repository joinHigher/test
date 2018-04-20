<template>
    <div class="el-container el-luckybag-container">
        <!-- <div class="el-luckybag-title">
            <span>商品标识：</span>
            <span>福袋SKU</span>
        </div> -->
        <el-form inline :model="filterForm" ref="filterForm">
            <el-form-item label="商品SKU：" prop="skus">
                <el-input v-model="filterForm.skus" placeholder="多个SKU用“,”隔开"></el-input>
            </el-form-item>
            <el-form-item label="真实仓库" prop="realWhCode">
                <el-select v-model="filterForm.realWhCode" clearable filterable  placeholder="请选择">
                    <el-option v-for="(item, key) in realWhCodeList" :key="key" :label="item" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
            </el-form-item>
        </el-form>
        <div class="stock-batch-container">
            <el-button type="primary" :disabled="multipleSelection.length === 0" @click="batchUpdate" class="stock-batch-btn">批量更新福袋库存</el-button>
            <span class="stock-tip">注意：列表中的更新库存数为上次人工更新的库存同步记录，实际剩余可售库存请查询对应商品SKU库存分布</span>
        </div>
        <el-table :data="tableData" border ref="table" v-loading="dataLoading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="goodSn" label="商品SKU"></el-table-column>
            <el-table-column label="所属真实仓">
                <template scope="scope">
                    {{ realWhCodeList[scope.row.realWhCode]  }}
                </template>
            </el-table-column>
            <el-table-column prop="stockNum" label="更新库存数"></el-table-column>
            <el-table-column prop="salePrivateStock" label="可售私有库存数"></el-table-column>
            <el-table-column prop="salePublicStock" label="可售公有库存数"></el-table-column>
            <el-table-column prop="operateUser" label="最近操作人"></el-table-column>
            <el-table-column label="最近更新时间">
                <template scope="scope">
                    {{ timeZone_(scope.row.updateTime/1000, $store.getters.getTimeZone) }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button  type="text" size="small" @click="update(scope.row)">更新库存</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="text-right el-sub-container">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
        </div>

        <el-dialog :title="stockForm.type === 1 ? '更新福袋商品库存' : '批量更新福袋商品库存'"  :visible.sync="stockForm.isShow" @close="handleClose" size="tiny">
            <el-form :model="stockForm" ref="stockForm">
                <el-form-item label="商品SKU：" prop="skus">
                    <div class="stock-text">
                        {{ (stockForm.goodsStock.length === 1 && stockForm.type === 1) ? stockForm.goodsStock[0].goodSn : '已选中' + stockForm.goodsStock.length  + '条数据' }}
                    </div>
                </el-form-item>
                <el-form-item label="更新库存：" prop="inventory" :rules="[{ validator: checkInteger, trigger: 'blur' }]">
                    <el-input v-model="stockForm.inventory" class="stock-input"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <span class="stock-tip">温馨提示</span> 谨慎设置福袋商品库存，尽量少于子商品实际可售库存数，减少超卖风险
                </el-form-item>
            </el-form>
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
        let checkInteger = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('该项不为空'));
            }
            let reg = /^0$|^[1-9]{1}[\d]*$/;
            if (reg.test(value)) {
                return callback();
            } else {
                return callback(new Error('该项必须为正整数'));
            }
        }
        return {
            filterForm: {
                skus: '',
                realWhCode: ''
            },
            stockForm: {
                isShow: false,
                type: 1,
                inventory: '',
                goodsStock: []
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
            checkInteger: checkInteger,
        }
    },
    created () {
        this.initData();
    },
    methods: {
        initData() {
            this.getRealWhCodeList();
            this.getListData();
        },
        // 获取列表数据
        async getListData(param) {
            let params = {};
            if (typeof param === 'number') {
                this.pagination.pageNo = param;
            } 
            params = Object.assign({}, this.pagination, this.filterForm);
            if(params.skus) {
                params.goodSnList = params.skus.split(',');
            }
            delete params.totalCount;
            delete params.skus;
            this.dataLoading = true;
            try{
                const { list, totalCount } = await httpGet('stock/lucky-bag/list', {
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
            this.stockForm.type = 1;
            this.stockForm.inventory = '';
            this.$refs['stockForm'].resetFields();
        },
        // 更新库存
        update(row) {
            this.stockForm.goodsStock = [{
                goodSn: row.goodSn,
                realWhCode: row.realWhCode,
                stockNum: 0
            }];
            this.stockForm.type = 1;
            this.stockForm.isShow = true;
        },
        // 批量更新库存
        batchUpdate() {
            this.stockForm.type = 2;
            // console.log(this.multipleSelection);
            let goodsStock = [];
            this.multipleSelection.forEach((item) => {
                goodsStock.push({
                    goodSn: item.goodSn,
                    realWhCode: item.realWhCode,
                    stockNum: 0
                });
            })
            this.stockForm.goodsStock = goodsStock;
            this.stockForm.isShow = true;
        },
        // 保存更新库存数
        save() {
            this.$refs['stockForm'].validate(async (valid) => {
                if (valid) {
                    try {
                        this.stockForm.goodsStock.forEach((item) => {
                            item.stockNum = this.stockForm.inventory;
                        });
                        let params = {
                            goodsStockReqList: this.stockForm.goodsStock
                        };
                        try {
                            let { code, message }  = await httpPost('stock/lucky-bag/edit', params)
                            if(code === 0) {
                                this.$message.success(message || '更新库存成功');
                                this.stockForm.isShow = false;
                                this.getListData();
                            }
                        } catch(e) {
                            return;
                        }
                    } catch(e) {
                        return;
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="less">
    .el-luckybag-container {
        .stock-tip {
            color: orange;
        }
        .stock-batch-container{
            margin-bottom: 30px;
            .stock-batch-btn{
                margin-right: 20px;
            }
        }
        .stock-text {
            font-weight: 800;
        }
        .stock-input{
            width: 120px;
        }
        .el-luckybag-title{
            margin-bottom: 15px;
            span:first-child{  
                width: 70px;
                display: inline-block;
                padding: 11px 12px 11px 0;
            }
        }
    }
</style>
