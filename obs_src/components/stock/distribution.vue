<style lang="less">

</style>
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filter" ref="filterForm" :rules="rules">
                <el-form-item label="商品SKU：" prop="goodSn">
                    <el-input v-model="filter.goodSn" placeholder="填写商品SKU"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleBtnFilterClick"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>

            </el-form>  
        </div>

        <div class="el-container">
            <el-table :data="tableData" v-loading="isDataLoading" border>
                <el-table-column label="SKU">
                    <template scope="scope">
                        <div>{{ scope.$index == 0 ? scope.row.goodSn : '' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="外部产品编码">
                    <template scope="scope">
                        <div>{{ scope.$index == 0 ? scope.row.webGoodSn : '' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="销售站点">
                    <template scope="scope">
                        <div>{{ scope.$index == 0 ? (self.siteCodes[scope.row.siteCode] ? self.siteCodes[scope.row.siteCode] : '') : '' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="virtualWhName" label="销售仓"></el-table-column>
                <el-table-column prop="freeStock" label="实时自由库存"></el-table-column>
                <el-table-column label="库存类型">
                    <template scope="scope">
                        <div>{{ scope.row.isVirtual == 1 ? '虚拟库存' : '真实库存' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="商品状态">
                    <template scope="scope">
                        <div v-for="(item, index) in scope.row.extendsDtoList" :key="index">{{ platformText[item.platform] }}：{{ goodsStatusText[item.goodsStatus] }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <router-link :to="{name: 'stock_distributionDetail', query: { goodSn: scope.row.goodSn, siteCode: scope.row.siteCode }}"><el-button type="text">查看</el-button></router-link>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.pageNo" :page-sizes="[10, 20, 50]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="filter.totalCount"></el-pagination>
            </div>
        </div>

        <!-- 弹窗S -->

        <!-- 弹窗E -->

    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableData: [],
            isDataLoading: false,
            filter: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                goodSn: ''
            },
            rules: {
                goodSn: [{ required: true, message: '请输入该选项', trigger: 'blur' }]
            },
            platformText: {
                '1': 'PC',
                '2': 'Android',
                '3': 'IOS',
                '4': 'PAD',
                '5': 'M版'
            },
            goodsStatusText: {
                '1': '待发布',
                '2': '上架',
                '3': '下架',
                '4': '到货通知',
                '5': '谍照'
            },
            siteCodes: {},
        };
    },
    created () {
        this.getSiteCodes();
        // console.log(typeof(this.$route.query.goodSnList), this.$route.query.goodSnList)
        if (this.$route.query.goodSnList) {
            this.getListData();
        }
    },
    methods: {
        getListData (pageNo) {
            let params = {};
            if (!this.filter.goodSn) {
                this.filter.goodSn = this.$route.query.goodSnList ? this.$route.query.goodSnList : '';
            }
            if (!this.filter.goodSn) {
                this.$message.warning('请输入商品SKU');
                return;
            }
            if (this.isDataLoading) {
                return;
            }
            if (pageNo) {
                this.filter.pageNo = pageNo;
            }
            params = { goodSnList: [this.filter.goodSn] };
            this.isDataLoading = true;
            this.$http.get('stock/distributed/list', { params: params }).then(res => {
                let data = res.body.data;
                let dList = data.goodsStockDistributeListResp || [];
                let list = null;
                this.isDataLoading = false;  
                this.tableData = [];
                this.filter.totalCount = 0;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message);
                    return;
                }
                if (!Array.isArray(dList) || !dList[0] || !Array.isArray(dList[0].siteStockDistributeList) || !dList[0].siteStockDistributeList[0]) {
                    return;
                }
                dList = dList[0].siteStockDistributeList[0];
                list = dList.virtualWhStockList;
                list.forEach((item) => {
                    delete item.realWhStockList;
                    this.tableData.push(Object.assign({}, { webGoodSn: dList.webGoodSn, siteCode: dList.siteCode }, item));
                });
                this.filter.totalCount = list.length;
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
            });
        },
        getSiteCodes () {
            this.$http.get('base/public/site-list').then(res => {
                let obj = {};
                if (res.body.code !== 0) {
                    return;
                }
                Array.isArray(res.body.data) && res.body.data.forEach(item => {
                    obj[item.code] = item.name;
                });
                this.$set(this, 'siteCodes', obj);
            });
        },
        handleBtnFilterClick() {
            let hasError = false;
            this.$refs.filterForm.validate(valid => {
                if (!valid) {
                    hasError = true;
                    return false;
                }
            });
            if (hasError) {
                return;
            }
            this.getListData(1);
        },
        handleBtnCancelFilterClick() {
            this.filter.goodSn = '';
            this.filter.pageNo = 1;
        },
        changePage(value) {
            this.filter.pageNo = value;
            this.getListData();
        },
        changePageSize(value) {
            this.filter.pageSize = value;
            this.getListData();
        }
    }
}
</script>

