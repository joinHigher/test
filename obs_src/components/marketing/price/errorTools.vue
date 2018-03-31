<!-- 价格设置记录 -->
<template>
    <div class="el-container">
        <div class="el-sub-container">
            <el-button type="primary" @click="edit(null, 'batch')">冲突部分覆盖</el-button>
            <el-button type="danger" @click="remove(null, 'batch')">删除并覆盖</el-button>
        </div>
        <el-table border :data="tableData" v-loading="tableLoading" @selection-change="changeRow">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="goodSn" label="SKU"></el-table-column>
            <el-table-column prop="price" label="目标价格"></el-table-column>
            <el-table-column label="生效时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}} - {{self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="goodName" label="冲突价格">
                <template scope="scope">
                    暂无
                </template>
            </el-table-column>
            <el-table-column prop="conflictPriceName" label="组名称"></el-table-column>
            <el-table-column label="生效时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.conflictStartTime, self.$store.getters.getTimeZone)}} - {{self.timeZone_(scope.row.conflictEndTime, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="primary" @click="edit(scope.row)">冲突部分覆盖</el-button>
                    <el-button type="danger" @click="remove(scope.row)">删除并覆盖</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>

    <!-- 弹窗S -->
    <!-- 弹窗E -->
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableLoading: false,
            tableData: [],
            checkedRow: [],
            option: {
                page: 1,
                page_size: 20,
                conditionId: this.$route.query.conditionId,
                goodSns: JSON.parse(this.$route.query.goodSns),
            },
            total: 1,
        };
    },
    computed: {

    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.$http.get('promotion/price/conflict-lists', {params: this.option}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data.list;
                    this.total = data.totalCount;
                }
            })
        },
        changeRow (val) {
            this.checkedRow = val;
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.page_size = val;
            this.getData();
        },
        edit (row, type) {
            let ids = [];
            if (type === 'batch') {
                this.checkedRow.forEach(item => {
                    ids.push(item.id);
                });
            } else {
                ids = [row.id];
            }
            this.$http.post('promotion/price/edit-conflict-logs', {ids: ids}).then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.getData();
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        remove (row, type) {
            let src = 'promotion/price/delete-conflict-logs';
            let params = {
                ids: [],
            };
            if (type === 'batch') {
                src = 'promotion/price/batch-delete-logs';
                this.checkedRow.forEach(item => {
                    params.ids.push(item.id);
                })
            } else {
                params.ids.push(row.id);
            }

            this.$http.post(src, params).then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.getData();
                } else {
                    this.$message.error(res.body.message);
                }
            })
        }
    }
}
</script>

<style>

</style>
