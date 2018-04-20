<template>
    <div class="el-container">
        <el-card class="wallet-list-card" v-loading="loading">
            <div slot="header" class="card-header">
                <h3>电子钱包管理</h3>
            </div>
            <el-form inline
                     @submit.prevent="onSearch"
                     :model="searchForm"
                     ref="searchForm"
                     class="search-form">
                <el-form-item label="顾客邮箱："
                              prop="email"
                              :rules="[{ type: 'email', message: '请输入合法的邮箱地址', trigger: 'blur' }]"
                >
                    <el-input type="email" v-model.trim="searchForm.email" placeholder="请输入顾客邮箱进行搜索"></el-input>
                </el-form-item>

                <el-form-item label="来源网站：">
                    <el-select v-model="searchForm.siteCode" filterable placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="item in sites"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="创建时间：">
                    <el-date-picker class="w350" v-model="searchForm.time" type="datetimerange" placeholder="选择时间范围" ></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button @click.prevent="onSearch" type="primary" native-type="submit" icon="search">查询</el-button>
                </el-form-item>
            </el-form>

            <div class="list-content">
                <el-table :data="list"
                          class="table-list"
                          border>
                    <el-table-column prop="accountId" label="电子钱包ID"></el-table-column>
                    <el-table-column prop="userEmail" label="顾客邮箱"></el-table-column>
                    <el-table-column prop="siteDomain" label="来源网站"></el-table-column>
                    <el-table-column width="150px" prop="totalAmount" label="电子钱包总余额/$"></el-table-column>
                    <el-table-column width="150px" prop="effectiveAmount" label="可用余额/$"></el-table-column>
                    <el-table-column width="150px" prop="invalidAmount" label="冻结中金额/$"></el-table-column>

                    <el-table-column prop="createTime" label="创建时间">
                        <template scope="scope">
                            {{scope.row.createTime ? timeZone_(scope.row.createTime, $store.getters.getTimeZone): '暂无' }}
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="操作"
                        width="180">
                        <template scope="scope">
                            <router-link :to="{name: 'walletDetails', query: {accountId: scope.row.accountId} }">
                                <el-button size="small" type="primary" icon="view">查看</el-button>
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-pagination
                class="pager"
                @size-change="onSizeChange"
                @current-change="onCurrentChange"
                :current-page="pager.pageNo"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pager.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pager.totalCount"
            >
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import httpGet, { getSites } from '../../common/baseApi'

    export default {
        data() {
            return {
                loading: false,
                list: [],
                sites: [],
                searchForm: {
                    email: '',
                    siteCode: '',
                    time: []
                },
                pager: {
                    totalCount: 0,
                    pageSize: 10,
                    pageNo: 1
                }
            }
        },
        created() {
            this.initData()
        },
        methods: {
            async _getData() {
                const [startTime, endTime] = this.timeZone_(this.searchForm.time, this.$store.getters.getTimeZone)

                const params = {
                    ...this.searchForm,
                    startTime,
                    endTime,
                    pageSize: this.pager.pageSize,
                    pageNo: this.pager.pageNo
                }
                delete params.time

                this.loading = true
                const data = await httpGet('pay/wallet/list', {
                    params
                })

                this.loading = false
                this.list = data.list
                this.pager.totalCount = data.totalCount
            },
            async initData() {
                this._getData()

                const sites = await getSites()
                this.sites = sites
            },
            onSizeChange(val) {
                let curPageNo = this.pager.pageNo
                this.pager.pageNo = 1
                this.pager.pageSize = val

                // 修改pageNo会触发
                curPageNo === 1 && this._getData()
            },
            onSearch() {
                this.$refs.searchForm.validate(valid => {
                    if (valid) {
                        if (this.pager.pageNo === 1) {
                            this._getData()
                        } else {
                            this.pager.pageNo = 1
                        }
                    }
                })
            },
            onCurrentChange(val){
                this.pager.pageNo = val
                this._getData()
            }
        }
    }
</script>

<style lang="less" scoped>
    .pager{
        margin-top: 20px;
    }
</style>
