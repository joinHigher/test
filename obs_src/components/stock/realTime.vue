<style lang="less">

</style>
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filter" ref="filterForm" :rules="filterRules">
                <el-form-item label="商品SKU：" prop="goodSn">
                    <el-input v-model.trim="filter.goodSn" placeholder="填写商品SKU" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="查询日志时间：">
                    <el-date-picker v-model="filter.date" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleBtnFilterClick"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>

            </el-form>  
        </div>

        <div class="el-container">
            <el-table :data="tableData" v-loading="isDataLoading" border>
                <el-table-column prop="goodSn" label="SKU"></el-table-column>
                <el-table-column prop="realWareName" label="所属真实仓库"></el-table-column>
                <el-table-column prop="freeStock" label="实时自由库存"></el-table-column>
                <el-table-column label="最后更新时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.lastTime, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <router-link :to="{name: 'stock_realTimeLog', query: {goodSn: scope.row.goodSn}}"><el-button type="text">查看库存日志</el-button></router-link>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.page" :page-sizes="[10, 20, 50]" :page-size="filter.page_size" layout="total, sizes, prev, pager, next, jumper" :total="filter.totalCount"></el-pagination>
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
                page: 1,
                page_size: 10,
                totalCount: 0,
                date: '',
                goodSn: ''
            },
            filterRules: {
                goodSn: [{ required: true, message: '请输入SKU', trigger: 'blur' }]
            }
        };
    },
    created () {
        this.getListData();
    },
    methods: {
        getListData (page) {
            let params = {};
            if (page) {
                this.filter.page = page;
            }
            params = Object.assign({}, this.filter);
            delete params.totalCount;
            if (this.filter.date[0]) {
                let dateArr = this.timeZone_(this.filter.date, this.$store.getters.getTimeZone);
                params.realtimeStart = dateArr[0];
                params.realtimeEnd = dateArr[1];
            }
            delete params.date;
            this.isDataLoading = true;
            this.$http.get('stock/index/list', { params: params }).then(res => {
                this.isDataLoading = false; 
                if (res.body.code !== 0) {
                    this.tableData = [];
                    return;
                }
                this.tableData = res.body.data.list;
                this.filter.totalCount = res.body.data.totalCount;
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
            });
        },
        handleBtnFilterClick () {
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
            for (let item in this.filter) {
                if (item === 'page' || item === 'page_size' || item === 'totalCount') {
                    continue;
                }
                this.filter[item] = '';
            }
            this.filter.page = 1;
            // this.getListData();
            // console.log(this.filter);
        },
        changePage(value) {
            this.filter.page = value;
            this.getListData();
        },
        changePageSize(value) {
            this.filter.page_size = value;
            this.getListData();
        }
    }
}
</script>

