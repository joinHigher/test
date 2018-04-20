<template>
    <div>
        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="priceName" label="组名">
                    <template scope="scope">
                        <router-link :to="{name: 'marketing_price_queueInfo', query: {id: scope.row.conditionId}}">
                            {{scope.row.priceName}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="完成时间">
                    <template scope="scope">
                        <span v-if="scope.row.finishedTime !== ''">{{self.timeZone_(scope.row.finishedTime, self.$store.getters.getTimeZone)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createName" label="最后操作人"></el-table-column>
                <el-table-column label="状态">
                    <template scope="scope">
                        <span v-if="scope.row.finishedTime != ''">已完成</span>
                        <span v-else>未完成</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            option: {
                page: 1,
                page_size: 10
            },
            self: this,
            tableLoading: false,
            total: 10,
            tableData: []
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.tableLoading = true;
            this.$http.get('promotion/price/setting-logs', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.total = res.body.data.totalCount;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            })
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.page_size = val;
            this.getData();
        }
    }
}
</script>

<style>

</style>