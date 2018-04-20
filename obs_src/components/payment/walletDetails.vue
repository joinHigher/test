<template>
    <div class="el-container" v-loading="loading">
        <el-card class="wallet-details-info" >
            <div slot="header" class="card-header">
                <h3>钱包概要信息</h3>
                <router-link :to="{name: 'walletList'}">
                    <el-button>返回列表</el-button>
                </router-link>
            </div>
            <div class="info">
                <el-row :gutter="20">
                    <el-col :span="8" class="info-item">
                        <span class="label">顾客邮箱：</span>
                        <span class="text">{{payWalletInfo.userEmail}}</span>
                    </el-col>
                    <el-col :span="8" class="info-item">
                        <span class="label">来源网站：</span>
                        <span class="text">{{payWalletInfo.siteDomain}}</span>
                    </el-col>
                    <el-col :span="8" class="info-item">
                        <span class="label">电子钱包总余额/$：</span>
                        <span class="text">{{payWalletInfo.totalAmount}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8" class="info-item">
                        <span class="label">可用余额/$：</span>
                        <span class="text">{{payWalletInfo.effectiveAmount}}</span>
                    </el-col>
                    <el-col :span="8" class="info-item">
                        <span class="label">冻结中金额/$：</span>
                        <span class="text">{{payWalletInfo.invalidAmount}}</span>
                    </el-col>
                </el-row>
            </div>
        </el-card>

        <el-card class="wallet-details-list" >
            <el-form inline
                     @submit.prevent="onSearch"
                     :model="searchForm"
                     ref="searchForm"
                     class="search-form">
                <el-form-item label="来源ID：">
                    <el-input v-model.trim="searchForm.sourceId" placeholder="请输入来源ID进行搜索"></el-input>
                </el-form-item>
                <el-form-item label="来源类型：">
                    <el-select v-model="searchForm.sourceType" filterable placeholder="请选择">
                        <el-option
                            v-for="(val, key) in sourceTypes"
                            :key="key"
                            :label="val"
                            :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易类型：">
                    <el-select v-model="searchForm.transactionType" filterable placeholder="请选择">
                        <el-option
                            v-for="(val, key) in transactionTypes"
                            :key="key"
                            :label="val"
                            :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="交易时间：">
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
                    <el-table-column label="序号"
                                     width="100px"
                    >
                        <template scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>

                    <el-table-column label="来源ID">
                        <template scope="scope">
                            <span v-if="scope.row.sourceType == 1">{{scope.row.orderSn}}</span>
                            <span v-else>{{scope.row.sourceId}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="sourceType" label="来源类型">
                        <template scope="scope">
                            {{scope.row.sourceType ? sourceTypes[scope.row.sourceType]: '未知来源' }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="transactionType" label="交易类型">
                        <template scope="scope">
                            {{scope.row.transactionType ? transactionTypes[scope.row.transactionType]: '未知类型' }}
                        </template>
                    </el-table-column>

                    <el-table-column width="150px" prop="amount" label="交易金额"></el-table-column>
                    <el-table-column width="150px" prop="effectiveAmount" label="当前可用余额/$"></el-table-column>
                    <el-table-column width="150px" prop="invalidAmount" label="当前冻结中金额/$"></el-table-column>
                    <el-table-column prop="createTime" label="交易时间">
                        <template scope="scope">
                            {{scope.row.transactionTime ? timeZone_(scope.row.transactionTime, $store.getters.getTimeZone): '暂无' }}
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
                :total="pager.totalCount">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import httpGet from '../../common/baseApi'

    export default {
        data() {
            return {
                list: [],
                loading: false,
                payWalletInfo: {},
                sourceTypes: {
                    '': '全部',
                    '1': '退款',
                    '2': '网站下单',
                    '3': '正常提现',
                    '4': 'Case',
                    '5': '财务扣款'
                },
                transactionTypes: {
                    '': '全部',
                    '1': '收入',
                    '2': '支出',
                    '3': '冻结',
                    '4': '解冻'
                },
                searchForm: {
                    sourceId: '',
                    sourceType: '',
                    transactionType: '',
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
        computed: {
            accountId() {
                return this.$route.query.accountId || ''
            }
        },
        methods: {
            async _getData() {
                const [startTime, endTime] = this.timeZone_(this.searchForm.time, this.$store.getters.getTimeZone)
                const params = {
                    ...this.searchForm,
                    startTime,
                    endTime,
                    accountId: this.accountId,
                    pageSize: this.pager.pageSize,
                    pageNo: this.pager.pageNo
                }

                this.loading = true
                const data = await httpGet('pay/wallet/record', {
                    params
                })

                this.loading = false
                this.payWalletInfo = data.payWalletInfo
                this.list = data.list
                this.pager.totalCount = data.totalCount
            },
            initData() {
                this._getData()
            },
            onSizeChange(val) {
                let curPageNo = this.pager.pageNo

                this.pager.pageNo = 1
                this.pager.pageSize = val

                // 修改pageNo会触发

                curPageNo === 1 && this._getData()

            },
            onSearch() {
                if(this.pager.pageNo === 1){
                    this._getData()
                }else {
                    this.pager.pageNo = 1
                }
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
    .wallet-details-info{

    }
    .wallet-details-list{
        margin-top: 30px;
    }
    .card-header{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .info-item{
        display: flex;
        align-items: center;
        padding: 10px 0;
        color: #48576a;
        font-size: 14px;
        .label{
            width: 150px;
        }
    }
</style>
