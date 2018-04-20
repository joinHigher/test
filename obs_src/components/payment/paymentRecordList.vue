<style lang="less">
.searchForm {
    .el-select { width: 150px; }
}
</style>
<!--支付信息-->
<template>
    <div>
        <div class="el-container form-wrap" v-loading="isDataLoading">
            <el-form inline :model="searchForm" ref="searchForm" class="searchForm">
                <el-form-item label="">
                    <el-select v-model="searchForm.type" placeholder="请选择">
                        <el-option label="第三方付款ID" value="transactionId"></el-option>
                        <el-option label="联合订单号" value="parentOrderSn"></el-option>
                        <el-option label="支付号" value="paySn"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model.trim="searchForm.typeValue" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="searchForm.payStatus" clearable placeholder="请选择">
                        <el-option v-for="(val, key) in payStatusText" :label="val" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式：">
                    <el-select v-model="searchForm.channelCode" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in payChannels" :label="item.channelName" :value="item.channelCode" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="币种：">
                    <el-select v-model="searchForm.currencyCode" clearable filterable placeholder="请选择">
                        <el-option v-for="(item, index) in currencys" :label="item.currencyName + '-' + item.currencyCode" :value="item.currencyCode" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付完成时间：">
                    <el-date-picker v-model="searchForm.date" type="datetimerange" placeholder="选择申请时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item label="支付错误码： ">
                    <el-input v-model="searchForm.errorCode"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(false, 1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" border>
            <el-table-column prop="transactionId" label="第三方付款ID"></el-table-column>
            <el-table-column prop="parentOrderSn" label="联合订单号"></el-table-column>
            <el-table-column prop="paySn" label="支付号"></el-table-column>
            <el-table-column label="状态">
              <template scope="scope">
                <div>{{ payStatusText[scope.row.payStatus] }}</div>
              </template>
            </el-table-column>
            <el-table-column label="支付方式">
              <template scope="scope">
                <div>{{ payChannelText[scope.row.channelCode] }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="currencyCode" label="币种"></el-table-column>
            <el-table-column prop="payCurrencyAmount" label="金额"></el-table-column>
            <el-table-column label="支付完成时间" width="180px">
              <template scope="scope">
                {{ self.timeZone_(scope.row.completedTime, self.$store.getters.getTimeZone) }}
              </template>
            </el-table-column>
            <el-table-column prop="errorCode" label="支付错误码"></el-table-column>
            <el-table-column label="操作" align="center">
              <template scope="scope">
                <el-button type="primary" @click="handleDetails(scope.row.paySn)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="searchForm.pageNo" :page-sizes="[10, 20, 50]" :page-size="searchForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchForm.totalCount"></el-pagination>
            </div>
        </div>

        <!--弹窗s-->
      <el-dialog title="支付信息详情" v-model="paymentDetails.isDlgShow" size="larger" v-loading="paymentDetails.loading">
          <div>
              <el-table :data="paymentDetails.paymentDetailsTable" border>
              <el-table-column prop="transactionId" label="第三方付款ID" width="170px"></el-table-column>
              <el-table-column prop="parentOrderSn" label="联合订单号" width="170px"></el-table-column>
              <el-table-column prop="paySn" label="支付号" width="170px"></el-table-column>
              <el-table-column label="状态" width="170px">
                <template scope="scope">
                  <div>{{ payStatusText[scope.row.payStatus] }}</div>
                </template>
              </el-table-column>
              <el-table-column label="支付方式" width="170px">
                <template scope="scope" width="170px">
                  <div>{{ payChannelText[scope.row.channelCode] }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="currencyCode" label="币种" width="170px"></el-table-column>
              <el-table-column prop="payCurrencyAmount" label="金额" width="170px"></el-table-column>
            </el-table>
              <el-table :data="paymentDetails.paymentDetailsTable" border>
              <el-table-column prop="createTime" label="创建时间" width="170px">
                  <template scope="scope">
                    {{ self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone) }}
                  </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="更新时间" width="170px">
                  <template scope="scope">
                    {{ self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone) }}
                  </template>
              </el-table-column>
              <el-table-column prop="completedTime" label="完成时间" width="170px">
                    <template scope="scope">
                      {{ self.timeZone_(scope.row.completedTime, self.$store.getters.getTimeZone) }}
                    </template>
              </el-table-column>
              <el-table-column prop="errorCode" label="错误码" width="170px"></el-table-column>
              <el-table-column prop="payAccount" label="收款账号" width="170px"></el-table-column>
              <el-table-column prop="userEmail" label="用户邮箱" width="170px"></el-table-column>
              <el-table-column prop="ip" label="用户IP" width="170px"></el-table-column>
            </el-table>
          </div>
      </el-dialog>
        <!--弹窗e-->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableData: [],
            isDataLoading: false,
            multipleSelection: [],
            sites: [],
            searchForm: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                date: '',
                type: 'transactionId',
                typeValue: '',
                payStatus: '',
                channelCode: '',
                currencyCode: '',
                errorCode: '',
            },
            payStatusText: {
                '0': '未支付',
                '1': '处理中',
                '2': '已支付',
                '3': '退款中',
                '4': '退款成功',
                '5': '退款失败',
                '6': '支付失败',
            },
            payChannelText: {},
            payChannels: [],
            currencys: [],
            paymentDetails: {
              loading: false,
              isDlgShow: false,
              paymentDetailsTable:[],
            },
        };
    },
    created () {
        this.getListData(true);
    },
    methods: {
        getListData (isAll, pageNo) {
            let promiseArr = [];
            if (pageNo) {
                this.searchForm.pageNo = pageNo;
            }
            let params = Object.assign({}, this.searchForm);
            if (Array.isArray(this.searchForm.date) && this.searchForm.date[0]) {
                let dateArr = this.timeZone_(this.searchForm.date, this.$store.getters.getTimeZone);
                params.completeTimeStart = dateArr[0];
                params.completeTimeEnd = dateArr[1];
            }
            if (this.searchForm.typeValue) {
                params[this.searchForm.type] = this.searchForm.typeValue;
            }
            delete params.totalCount;
            delete params.date;
            delete params.type;
            delete params.typeValue;
            // console.log(params);
            // return;
            this.isDataLoading = true;
            promiseArr.push(this.$http.get('pay/record/list', { params: params }));
            if (isAll === true) {
                promiseArr.push(this.$http.get('pay/record/public-pay-channel-currency'));
            }
            Promise.all(promiseArr).then(dataArr => {
                let data1 = dataArr[0].body;
                let data2 = dataArr[1];
                this.isDataLoading = false;
                this.tableData = [];
                if (data1.code !== 0) {
                    this.$message.error(data1.message);
                    return;
                }
                if (isAll === true && data2.body.code === 0) {
                    data2 = data2.body;
                    this.currencys = data2.data.currencys;
                    this.payChannels = data2.data.payChannels;
                    Array.isArray(data2.data.payChannels) && data2.data.payChannels.forEach(item => {
                        this.payChannelText[item.channelCode] = item.channelName;
                    });
                }
                this.tableData = data1.data.list || [];
                this.searchForm.totalCount = data1.data.totalCount || 0;
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        changePage(value) {
            this.searchForm.pageNo = value;
            this.getListData();
        },
        changePageSize(value) {
            this.searchForm.pageSize = value;
            this.getListData();
        },
        handleBtnCancelFilterClick() {
            for (let key in this.searchForm) {
                // console.log(key);
                if (key === 'pageNo' || key === 'pageSize' || key === 'totalCount' || key === 'type') {
                    continue;
                }
                this.searchForm[key] = '';
            }
            this.searchForm.pageNo = 1;
            this.searchForm.type = 'transactionId';
        },
        handleDetails(paySn){
              console.log(paySn);
              this.paymentDetails.paymentDetailsTable = [];
              this.paymentDetails.isDlgShow = true;
              this.paymentDetails.loading = true;
              this.$http.get('pay/record/info', {params: {paySn: paySn}}).then((res) => {
                  this.paymentDetails.loading = false;
                  if (res.body.code === 0) {
                      this.paymentDetails.paymentDetailsTable.push(res.body.data);
                  } else {
                      this.paymentDetails.paymentDetailsTable = [];
                      this.$message.error(res.body.message);
                  }
              });
        },

    }
}
</script>

