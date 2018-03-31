<template>
    <div>
        <div class="el-container">
            <el-form inline @submit.prevent="getListData(1)" :model="filterForm" ref="searchForm">
                <el-form-item label="channel_code：" prop="channelCode">
                    <el-input v-model="filterForm.channelCode" placeholder="请输入支付方式名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" type="primary" @click.prevent="getListData(1)" icon="search">搜索</el-button>
                    <el-button type="danger" icon="delete" @click="handleBtnCancelFilterClick">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column prop="mIndex" label="序号"></el-table-column>
                <el-table-column prop="channelCode" label="Channel_name"></el-table-column>
                <el-table-column prop="channelName" label="pay_name"></el-table-column>
                <el-table-column label="更新时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.updateTime, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <router-link :to="{ name: 'copyManagementSet', query: {isCreditCard: scope.row.isCreditCard, channelCode: scope.row.channelCode, channelName: scope.row.channelName}}" tag="a">
                            <el-button type="primary" size="small">编辑</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-right el-sub-container">
                <el-pagination class="pager"
                               @size-change="changePageSize"
                               @current-change="changePage"
                               :current-page.sync="pagination.pageNo"
                               :page-sizes="[10, 20, 30, 50]"
                               :page-size="pagination.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataLoading: false,
                filterForm: {
                    channelCode: ''
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: []
            }
        },

        created() {
            this.initData();
        },
        watch: {
            'filterForm.channelCode'(newVal) {
                // 删除搜索内容不用回车
                if (newVal === '') {
                    this.getListData(1)
                }
            }
        },
        methods: {
            initData() {
                this.getListData()
            },
            // 获取列表数据
            getListData(param) {
                if (this.dataLoading) return

                if (typeof param === 'number') {
                    this.pagination.pageNo = param
                }
                const params = Object.assign({}, this.pagination, this.filterForm)
                delete params.totalCount

                this.dataLoading = true
                this.$http.get('pay/channel-letters/list', {
                    params
                }).then(({body: {code, message, data}}) => {
                    this.dataLoading = false
                    this.tableData = []
                    if (code !== 0) {
                        this.$message.error(message)
                        return
                    }

                    this.tableData = data.list.map((item, index) => {
                        item.mIndex = ++index
                        return item
                    })
                    this.pagination.totalCount = data.totalCount
                }, err => {
                    this.$notify.error(err.body.message || '发生错误')
                })
            },
            // 改变每页显示数
            changePageSize(val) {
                this.pagination.pageNo = 1
                this.pagination.pageSize = val
                this.getListData()
            },
            // 改变当前页
            changePage() {
                this.getListData()
            },
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields()
            },
            // 编辑
            edit(row) {
                if(row.channelCode && row.channelName) {
                    this.$router.push({
                        name: 'copyManagementSet',
                        query: {channelCode: row.channelCode, channelName: row.channelName}
                    })
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .pager{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>
