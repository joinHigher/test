<template>
  <div class="pay-amount el-container">
      <div class="top-search">
          <el-form @submit="onSearch" :inline="true" class="top-search-form">
              <span>channel_code:</span>
              <el-input v-model="channelName" placeholder="请输入内容"></el-input>
              <el-button @click="onSearch" native-type="submit" type="primary" icon="search">查询</el-button>
          </el-form>
          <div class="pager">
              <el-pagination
                  @size-change="handleSizeChange"
                  :current-page.sync="pager.pageNo"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="pager.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="pager.total">
              </el-pagination>
          </div>
      </div>
      <div class="pay-list" v-loading="loading">
          <template v-if="payChannels.length > 0">

              <el-card class="pay-item-card" v-for="(item, payIndex) in payChannels" :key="item.channelCode">
                  <div slot="header" class="pay-item-header">
                      <div class="pay-name">
                          <h2>{{item.channelName}}</h2>
                      </div>
                      <div class="edit-tool flex">
                          <span>生效币种类：</span>
                          <el-select @change="onChangeCurrency(item)" v-model="item.currencyCode" filterable placeholder="请选择">
                              <el-option
                                  v-for="currency in currencyTypeList"
                                  :key="currency.currencyCode"
                                  :label="currency.currencyName"
                                  :value="currency.currencyCode">
                              </el-option>
                          </el-select>
                          <el-button v-if="showAction_('pay/range/save')" icon="plus" class="ml10" @click="onAddRulesByCurrency(item)" type="primary">新增</el-button>
                          <el-button v-if="showAction_('pay/range/save')" :disabled="!item.payChannelAmountRelationList.length > 0" icon="upload" @click="onSaveItem(payIndex)" type="primary">保存</el-button>
                      </div>
                  </div>
                  <div class="pay-list">
                      <template v-if="item.payChannelAmountRelationList && item.payChannelAmountRelationList.length > 0">
                          <el-form :model="item" inline ref="ruleSettingForms" class="rule-form">
                              <div class="line-rule" v-for="(amountRule, index) in item.payChannelAmountRelationList" :key="index" >
                                  <el-form-item :prop="'payChannelAmountRelationList.' + index + '.minAmount'"
                                                :rules="{ validator: function(rule, value, callback) {
                                                if (value === '') {
                                                    if(amountRule.maxAmount === ''){
                                                        callback(new Error('最大最小值不能同时为空'))
                                                    }else{
                                                        callback()
                                                    }
                                                } else {
                                                    if (isNaN(Number(value)) || value < 0 || value > defaultMaxAmount) {
                                                        callback(new Error(`请输入 0 到 ${defaultMaxAmount} 间的数字`))
                                                        return
                                                    }

                                                    if (String(amountRule.maxAmount).trim() !== '' && Number(value) >= Number(amountRule.maxAmount)) {
                                                        callback(new Error('请小于最大金额'))
                                                    } else {
                                                        callback()
                                                    }
                                                }
                                            },trigger: 'blur'}">

                                      <!--:autofocus="index === item.payChannelAmountRelationList.length - 1"-->
                                      <dot-input v-model="amountRule.minAmount" placeholder="请输入金额">
                                          <template slot="prepend">{{item.currencySign}}</template>
                                      </dot-input>
                                  </el-form-item>
                                  <el-form-item label="≤订单金额≤"></el-form-item>
                                  <el-form-item :prop="'payChannelAmountRelationList.' + index + '.maxAmount'"
                                                :rules="{ validator: function(rule, value, callback) {
                                                if (value === '') {
                                                    if(amountRule.minAmount === ''){
                                                        callback(new Error('最大最小值不能同时为空'))
                                                    }else{
                                                        callback()
                                                    }
                                                } else {
                                                    if (isNaN(Number(value)) || value < 0 || value > defaultMaxAmount) {
                                                        callback(new Error(`请输入 0 到 ${defaultMaxAmount} 间的数字`))
                                                        return
                                                    }

                                                    if (String(amountRule.minAmount).trim() !== '' && Number(value) <= Number(amountRule.minAmount)) {
                                                        callback(new Error('请大于最小金额'))
                                                    } else {
                                                        callback()
                                                    }
                                                }
                                            },trigger: 'blur'}">
                                      <dot-input v-model="amountRule.maxAmount" placeholder="请输入金额">
                                          <template slot="prepend">{{item.currencySign}}</template>
                                      </dot-input>
                                  </el-form-item>
                                  <el-form-item>
                                      <el-button :disabled="item.payChannelAmountRelationList.length === 1" @click="onRemoveRule(item.payChannelAmountRelationList, amountRule)" type="danger" icon="delete">删除</el-button>
                                  </el-form-item>
                              </div>
                          </el-form>
                      </template>
                      <template v-else>
                          <div class="empty-text">
                              暂无数据
                          </div>
                      </template>

                  </div>
              </el-card>
              <div class="pager">
                  <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="pager.pageNo"
                      :page-sizes="[10, 20, 30, 50]"
                      :page-size="pager.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="pager.total">
                  </el-pagination>
              </div>
          </template>
          <template v-else>
              <div class="empty-text">
                  {{channelName ? `没有找到 ${channelName} 相关的数据` : '暂无数据..' }}
              </div>
          </template>
      </div>
  </div>
</template>

<script>
    import utils from '../../common/utils'
    const defaultMaxAmount = 99999999.99
    import dotInput from '../../pageComponents/dotInput.vue'

    export default {
        components: {
            dotInput
        },
        data() {
            return {
                defaultMaxAmount,
                Error: Error,
                payChannels: [],
                currencyTypeList: [],
                loading: false,
                pager: {
                    total: 0,
                    pageSize: 10,
                    pageNo: 1
                },
                channelName: ''
            }
        },
        created() {
            this.initData()
        },
        watch: {
            channelName(newVal) {
                // 删除搜索内容不用回车
                if (newVal === '') {
                    this._getRangeList()
                }
            }
        },
        methods: {
            _getCurrencysList() {
                this.$http.get('pay/public/currencys').then(({body: {code, message, data}}) => {
                    if (code !== 0) {
                        this.$message.error(message)
                        return
                    }
                    this.currencyTypeList = data.currencys
                }, err => {
                    this.$notify.error(err.body.message || '发生错误')
                })
            },
            _getRangeList() {
                // 获取渠道对应的 金额区间数据

                // 非第一页搜索会触发两次change
                if(this.loading) return

                this.loading = true
                const {pageSize, pageNo} = this.pager
                const params = {
                    channelName: String(this.channelName).trim(),
                    pageSize,
                    pageNo
                }

                this.$http.get('pay/range/list', {
                    params
                }).then(({body: {code, message, data}}) => {
                    if (code !== 0) {
                        this.$message.error(message)
                        return
                    }

                    this.payChannels = data.list ? data.list.map(item => {
                        if(!Array.isArray(item.payChannelAmountRelationList)){
                            // 添加默认数据
                            item.currencyCode = item.currencyCode || 'USD'
                            item.currencySign = item.currencySign || '$'
                            item.payChannelAmountRelationList = [{
                                maxAmount: '',
                                minAmount: '',
                            }]
                        }
                        return item
                    }) : []

                    this.pager.total = data.totalCount
                    this.loading = false
                }, err => {
                    this.loading = false
                    this.$notify.error(err.body.message || '发生错误')
                })
            },
            _getCurrencySignCodeTable() {
                if(undefined === this._cacheSignCodeTable){
                    const _cacheSignCodeTable = {}
                    this.currencyTypeList.forEach(item => {
                        _cacheSignCodeTable[item.currencyCode] = item.currencySign
                    })
                    this._cacheSignCodeTable = _cacheSignCodeTable
                }
                return this._cacheSignCodeTable
            },
            _getCurrencySignByCode(code) {
                const signCodeTable = this._getCurrencySignCodeTable()
                return signCodeTable ? signCodeTable[code] : ''
            },
            initData() {
                this._getRangeList()
                this._getCurrencysList()
            },
            onSearch(event) {
                event.preventDefault()
                this.pager.pageNo = 1
                this._getRangeList()
            },
            onChangeCurrency(item) {
                let { currencyCode } = item
                item.currencySign = this._getCurrencySignByCode(currencyCode)
            },
            onAddRulesByCurrency(item) {
                if(item.currencyCode){
                    //
                    item.payChannelAmountRelationList.push({
                        maxAmount: '',
                        minAmount: ''
                    })
                }else {
                    this.$message.error('请先选择一种 "生效币种" ')
                }
            },
            onRemoveRule(rulesTarget, rule) {
                utils.array.remove(rulesTarget, rule)
            },
            _checkRange(orig, comp) {
                let {
                    minAmount: origMin,
                    maxAmount: origMax
                } = orig

                let {
                    minAmount: compMin,
                    maxAmount: compMax
                } = comp

                // 两种情况存在重合，
                // 值在最大最小的之间 或者
                // 小的值小于最小的并且大的值大于最大的

                if(
                    (compMin >= origMin && compMin <= origMax) ||     // 小的值在区间内
                    (compMax >= origMin && compMax <= origMax) ||     // 大的值在区间内
                    (compMin <= origMin && compMax >= origMax)        // 区间包含了原区间
                ){
                    return true
                }

                return false
            },
            _checkItem(index) {
                return new Promise((resolve, reject) => {
                    this.$refs.ruleSettingForms[index].validate(valid => {
                        if (valid) {
                            const item = this.payChannels[index]

                            // 长度为1没有区间重合
                            if (item.payChannelAmountRelationList.length === 1) {
                                resolve()
                                return
                            }


                            // 先排序 再做判断
                            const sortArr = item.payChannelAmountRelationList.sort((a, b) => {
                                return a.minAmount - b.minAmount
                            })
                            let curRange = {...sortArr[0]}

                            sortArr.some((item, index) => {
                                if (index !== 0) {
                                    // 从第二个item 开始检测
                                    if (this._checkRange(curRange, item)) {
                                        this.$message.error('已经存在重叠金额区间，请检查')
                                        reject()
                                        return true
                                    }
                                    curRange.minAmount = Math.min(item.minAmount, curRange.minAmount)
                                    curRange.maxAmount = Math.max(item.maxAmount, curRange.maxAmount)
                                }
                            })

                            resolve()
                        } else {
                            reject()
                        }
                    })
                })
            },
            _save2Dot(str) {
                return String(str).replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
            },
            async onSaveItem(index) {
                const item = this.payChannels[index]

                // 保留两位小数点，默认值处理
                item.payChannelAmountRelationList.forEach(itemAmount => {
                    const boolMinEmpty = String(itemAmount.minAmount).trim() === ''
                    const boolMaxEmpty = String(itemAmount.maxAmount).trim() === ''

                    if (boolMinEmpty && boolMaxEmpty) {
                        // 同时为空 不加默认处理
                    } else {
                        itemAmount.minAmount = boolMinEmpty ? 0 : +this._save2Dot(itemAmount.minAmount)
                        itemAmount.maxAmount = boolMaxEmpty ? defaultMaxAmount : +this._save2Dot(itemAmount.maxAmount)
                    }
                })

                // 验证表单
                await this._checkItem(index)

                //
                await this.$confirm('是否确认保存？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                this.loading = true
                let {
                    channelCode,
                    currencyCode,
                    payChannelAmountRelationList: payChannelAmountList
                } = item

                this.$http.post('pay/range/save', {
                    channelCode,
                    currencyCode,
                    payChannelAmountList: JSON.parse(JSON.stringify(payChannelAmountList))
                }).then(({body: {code, message, data}}) => {
                    this.loading = false
                    if (code === 0) {
                        this.$message.success(message)
                    } else {
                        this.$message.error(message)
                    }
                    this._getRangeList()
                }, err => {

                    this.loading = false
                    this.$message.error(err.body.message || '发生错误')
                    this._getRangeList()
                })
            },
            handleSizeChange(val) {
                this.pager.pageNo = 1
                this.pager.pageSize = val
                this._getRangeList()
            },
            handleCurrentChange() {
                this._getRangeList()
            }
        }
    }
</script>
<style lang="less" scoped>
    .flex{
        display: flex;
        align-items: center;
    }
    .top-search{
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
    }
    .pager{
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
    .empty-text{
        color: #8492A6;
        padding: 20px 0;
    }
    .ml10{
        margin-left: 10px;
    }
    .pay-amount{
        .el-input ,.el-select{
            width: auto;
        }
    }
    .pay-list{
        .pay-item-card{
            margin-top: 20px;
        }
        .pay-item-header{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .pager{
            padding: 30px 0;
        }
        .rule-form{
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            /*.el-input {*/
                /*width: 170px;*/
            /*}*/
        }
        .line-rule{
            display: flex;
            align-items: center;
            margin-right: 50px;
            .text{
                margin: 0 10px;
            }
        }
    }

</style>
