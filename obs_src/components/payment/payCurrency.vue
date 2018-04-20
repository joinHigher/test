<template>
    <!--支付币种管理-->
    <div>
        <div class="el-container pay-currency" v-loading="isDataLoading">
            <el-tabs v-model="activeTab" type="card">
                <el-tab-pane label="支付渠道" name="payChannels">
                    <el-table :height="tabHeight" :data="payChannels" border tooltip-effect="dark" class="currency-table">
                            <el-table-column width="120" fixed prop="channelName" label="支付渠道" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="channelName" label="默认币种" width="100">
                                <template scope="scope">
                                    <el-select class="select-currency" v-model="scope.row.defaultCurrency" placeholder="请选择默认币种">
                                        <el-option
                                            v-for="item in scope.row.currencyCodes"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column v-for="(item, index) in currencys" :key="index" :label="`${item.currencyName}(${item.currencyCode})`">
                                <template scope="scope">
                                    <el-checkbox v-model="scope.row.currencyCodes" :label="item.currencyCode"></el-checkbox>
                                </template>
                            </el-table-column>
                        </el-table>
                    <div class="el-sub-container text-right">
                        <el-button v-if="showAction_('pay/currency/save')" icon="upload" type="primary" @click="saveCurrency">保存</el-button>
                        <el-button type="danger" @click="initData">取消</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import utils from '../../common/utils'

    export default {
        data() {
            return {
                tabHeight: 600,
                currencys: [],
                isDataLoading: false,
                activeTab: 'payChannels', // payChannels contries
                payChannels: []
            }
        },
        created() {
            this.initData()
        },
        mounted() {
            this._resize = function(e) {
                this.tabHeight = utils.tools.getTableHeight()
            }.bind(this);

            this.$nextTick(() => {
                window.addEventListener("resize", this._resize, false)
                this._resize()
            })
        },
        beforeDestroy(){
            window.removeEventListener('resize', this._resize)
        },
        watch: {
            payChannels: {
                deep: true,
                handler(newVal, oldVal) {
                    if (newVal === oldVal) {
                        // 修改默认 或者修改 可用币种
                        newVal.forEach(item => {
                            if (item.defaultCurrency && item.currencyCodes.indexOf(item.defaultCurrency) > -1) {
                                // ok
                            } else {
                                //
                                item.defaultCurrency = ''
                            }
                        })
                    }
                }
            }
        },
        methods: {
            initData() {
                this.isDataLoading = true
                this.$http.get('pay/currency/list').then(({body: {code, message, data}}) => {
                    this.isDataLoading = false
                    if (code !== 0) {
                        this.$message.error(message)
                        return
                    }
                    this.currencys = data.currencys
                    this._tempData = JSON.parse(JSON.stringify(data.payChannels))

                    this.payChannels = data.payChannels
                });
            },
            _checkData(){
                if (!Array.isArray(this.currencys) || !this.currencys.length) {
                    return false
                }
                if (JSON.stringify(this.payChannels) === JSON.stringify(this._tempData)) {
                    this.$message.warning('没有数据改动')
                    return false
                }

                const hasErr = this.payChannels.some(item => {
                    let currencyCodes = item.currencyCodes
                    if (currencyCodes && currencyCodes.length > 0 && item.defaultCurrency) {
                        // ok
                    }else{
                        this.$message.error(`支付渠道 ${item.channelName} 必须设置可用币种，以及默认币种`)
                        return true
                    }
                })

                if (hasErr) return

                return true
            },
            async saveCurrency() {
                if (this._checkData()) {
                    await this.$confirm('是否确认保存？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })

                    let params = {
                        payChannelCurrencyRelations: []
                    }

                    this.payChannels.forEach(item => {
                        let currencyCodes = item.currencyCodes
                        if (currencyCodes && currencyCodes.length > 0 && item.defaultCurrency) {
                            params.payChannelCurrencyRelations.push({
                                channelCode: item.channelCode,
                                defaultCurrency: item.defaultCurrency,
                                currencyCodes: [...currencyCodes]
                            })
                        }
                    })

                    this.isDataLoading = true
                    this.$http.post('pay/currency/save', params).then(({body: {code, message}}) => {
                        this.isDataLoading = false
                        if (code !== 0) {
                            this.$message.error(message)
                            return
                        }

                        this.$message.success(message)
                        this._tempData = JSON.parse(JSON.stringify(this.payChannels))
                    })
                }
            }
        }
    }
</script>
<style lang="less">
    .currency-table {
        th, td {
            text-align: center;
        }
        th>.cell { padding: 12px 5px; line-height: 16px; }
        td>.cell { padding: 12px 5px; }
        .el-checkbox .el-checkbox__label { display: none; }
    }
</style>

