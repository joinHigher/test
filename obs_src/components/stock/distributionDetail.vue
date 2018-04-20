<style lang="less">

</style>
<template>
    <div>
        <div class="el-container">
            <el-table :data="tableData" v-loading="isDataLoading" border>
                <el-table-column prop="goodSn" label="SKU"></el-table-column>
                <el-table-column prop="virtualWhName" label="销售仓库"></el-table-column>
                <el-table-column prop="realWhName" label="真实仓库"></el-table-column>
                <el-table-column prop="freeStock" label="实时自由库存"></el-table-column>
                <el-table-column prop="activityStock" label="实时活动占用库存"></el-table-column>
                <el-table-column label="库存类型">
                    <template scope="scope">
                        <div>{{ scope.row.isVirtual == 1 ? '虚拟库存' : '真实库存' }}</div>
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
                pageSize: 20,
                totalCount: 0,
                goodSn: this.$route.query.goodSn,
                siteCode: this.$route.query.siteCode
            },
        };
    },
    created () {
        this.getListData();
    },
    methods: {
        getListData () {
            if (!this.filter.goodSn || !this.filter.siteCode) {
                this.$message({
                    type: 'warning',
                    message: '参数有误'
                });
                return;
            }
            let params = { goodSn: this.filter.goodSn, siteCode: this.filter.siteCode };
            this.isDataLoading = true;
            this.$http.get('stock/distributed/site-detail', { params: params }).then(res => {
                let list = res.body.data.virtualWhStockList;
                this.isDataLoading = false; 
                this.tableData = [];
                this.filter.totalCount = 0;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message);
                    return;
                }
                list.forEach((item) => {
                    let temp = item.realWhStockList;
                    delete item.realWhStockList;
                    this.tableData.push(item);
                    temp.forEach((el) => {
                        el.isLeaf = true;
                        el.goodSn = '';
                        this.tableData.push(el);
                    });
                });
                // console.log(this.tableData)
                this.filter.totalCount = this.tableData.length;
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        handleBtnFilterClick() {

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

