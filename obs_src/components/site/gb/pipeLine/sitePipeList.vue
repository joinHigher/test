<!-- gb 站点-渠道列表 -->
<template>
    <div class="el-container gb-site-lang-list">
        <el-table :data="tableData" border class="menu-list-table" v-loading="tableLoading">
            <el-table-column label="名称">
                <template scope="scope">
                    <el-button v-if="scope.row.level != 1" type="text" :icon="scope.row.level == 1 ? 'minus' : 'plus'" @click="toggle(scope.row, scope.$index)">{{scope.row.domain}}</el-button>
                    <span v-if="scope.row.level == 1" class="sub">{{scope.row.domain}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="code" label="渠道简码"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableLoading: false,
                tableData: [],
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$http.get('base/site/site-pipelines').then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        data.forEach(item => {
                            item.isToggle = false;
                        })
                        this.tableData = data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            },
            toggle(row, index) {
                if (!row.isToggle) {
                    let tempArr = [];
                    row.pipelines.forEach(item => {
                        tempArr.push({
                            'domain': item.pipeline_name,
                            'code': item.pipeline_code,
                            'level': 1,
                        })
                    })
                    let temp = this.tableData.slice(0, index + 1).concat(tempArr).concat(this.tableData.slice(index + 1, this.tableData.length));
                    this.tableData  = temp;
                    row.isToggle = true;
                } else {
                    this.tableData.splice(index + 1, row.pipelines.length);
                    row.isToggle = false;
                }
            },
        },
    }
</script>

<style lang="less">
    .gb-site-lang-list {
        .sub {
            margin-left: 20px;
        }
    }
</style>