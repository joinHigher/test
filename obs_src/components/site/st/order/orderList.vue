<template>
  <div>
    <!--订单列表-->
    <div v-show="isShowList" class="el-container order-list">
      <el-form label-width="100px" :inline="true" :model="option" ref="searchForm" :label-position="labelPosition"  class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="option.orderSn" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="联合订单号">
          <el-input v-model="option.parentOrderSn" placeholder="请输入联合订单号"></el-input>
        </el-form-item>
        <el-form-item label="注册邮箱">
          <el-input v-model="option.email" placeholder="请输入注册邮箱"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="option.orderStatusUnion" placeholder="请选择订单状态"  clearable class="select-item">
            <el-option v-for="(item, index) in orderStatuses" :key="index" :value="item.statusCode" :label="item.statusText"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="option.payStatus" placeholder="请选择支付状态"  clearable class="select-item">
            <el-option v-for="(item, index) in payStatuses" :key="index" :value="item.statusCode"  :label="item.statusText"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单设备来源">
          <el-select placeholder="请选择订单设备来源" v-model="option.platform" clearable class="select-item">
            <el-option v-for="(item, index) in platform" :key="index" :value="item.typeCode"  :label="item.typeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="option.orderType" placeholder="请选择订单类型" clearable class="select-item">
            <el-option v-for="(item, index) in orderTypes" :key="index" :value="item.typeCode"  :label="item.typeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单币种">
          <el-select v-model="option.orderCurrency" placeholder="请选择订单币种" clearable filterable class="select-item">
            <el-option v-for="(item, index) in currencys" :label="item.currencyName + '-' + item.currencyCode" :value="item.currencyCode" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流方式">
          <el-select  v-model="option.logisticsCode" clearable class="select-item" filterable>
            <el-option v-for="(item, index) in logisticsTypeList" :key="index" :value="item.code"  :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货国家" prop="countryCode">
          <el-select v-model="option.countryCode" placeholder="请选择收货国家" clearable filterable class="select-item">
            <el-option v-for="(item, index) in countryList" :label="item.countryName" :value="item.countryCode" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货人名">
          <el-input v-model="option.firstName" placeholder="请输入收货人名"></el-input>
        </el-form-item>
        <el-form-item label="收货人姓">
          <el-input v-model="option.lastName" placeholder="请输入收货人姓"></el-input>
        </el-form-item>

        <el-form-item label="测试订单">
          <el-select v-model="option.isTest" clearable class="select-item">
            <el-option v-for="(item, index) in isTest" :key="index" :value="item.code"  :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单创建时间">
          <el-date-picker v-model="orderTime" type="datetimerange" placeholder="选择订单创建时间" :editable="false" :clearable="false"  popper-class="create-time"
                          @change="orderTimeSaveLocal(orderTime)">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBthClick">查询</el-button>
        </el-form-item>
      </el-form>
      <span class="tip bg-danger color-white">
        提示：双击单元格空白处快速全选文本，再复制
      </span>
      <el-table ref="multipleTable" v-loading.body="tableLoading" :data="orderData" border tooltip-effect="dark"  style="width: 100%">
        <el-table-column prop="orderSn" label="订单号" header-align="center" align="center" width="170px">
          <template scope="scope">
            <router-link  :to="{name: 'order_orderDetail', query: {orderSn: scope.row.orderSn}}">
              {{scope.row.orderSn}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="parentOrderSn" label="联合订单号" header-align="center" align="center" width="170px">
          <template scope="scope">
            <a class="@color-blue link-text" @click="showUnionOrder(scope.row.parentOrderSn)">{{scope.row.parentOrderSn}}</a>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" header-align="center" align="center" width="90px">
          <template scope="scope">
            {{self.timeZone_(scope.row.createdTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column label="收货人" header-align="center" align="center" min-width="100px">
            <template scope="scope">
                <span>{{scope.row.orderAddressResp.firstName}} {{scope.row.orderAddressResp.lastName}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="orderAddressResp.city" label="收货城市" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="orderAddressResp.country" label="收货国家" header-align="center"  align="center" min-width="100px"></el-table-column>
        <el-table-column prop="email" label="注册邮箱" header-align="center" align="center" width="110px">
          <template scope="scope">
            <router-link  :to="{name: 'member_memberInfo', query: {userId: scope.row.userIdStr,tab: 'order'}}">
              {{scope.row.email}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="（子）订单应付金额" prop="orderAmount" width="90px" align="center"></el-table-column>
        <el-table-column prop="orderId" label="支付记录" header-align="center" align="center">
          <template scope="scope">
            <el-button class="@color-blue" type="text"   @click="showPayRecord(scope.row.orderSn,scope.row.parentOrderSn)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orderCurrency" label="订单币种" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orderStatusDesc" label="订单状态" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orderTypeDesc" label="订单类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="rmaStatusDesc" label="RMA状态" header-align="center" align="center"></el-table-column>
        <el-table-column prop="caseStatusDesc" label="CASE状态" header-align="center" align="center"></el-table-column>
        <el-table-column prop="logisticsName" label="物流方式" header-align="center" align="center"   min-width="100px"></el-table-column>
        <el-table-column label="操作" header-align="center" align="center" min-width="110px">
          <template scope="scope">
            <el-button v-if="scope.row.isCancel" class="color-danger" type="text"
                       @click="showCancelDialog(scope.row.parentOrderSn, scope.row.userIdStr, scope.row.payStatus, scope.row)">取消订单
            </el-button>
            <el-button class="@color-blue" type="text" @click="showLog(scope.row.orderSn)">查看操作日志</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="el-container last text-right">
        <el-pagination
          @size-change="ChangePageSize"
          @current-change="ChangePage"
          :current-page="option.pageNum"
          :page-sizes="[10,20, 50]"
          :page-size="option.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 弹窗S -->
    <el-dialog title="注意" :visible.sync="cancelDialogVisible" size="samll" class="order-list">
      <el-form :rules="cancelRules" ref="cancelForm" :model="cancelParam">
        <p class="color-danger cancel-tip">
          取消子订单后，该订单对应的联合订单下的其他子订单将被同时取消。
        </p>
        <el-form-item prop="reason">
          <el-input type="textarea" :rows="4" resize="none" placeholder="请输入备注(必填)"
                    v-model="cancelParam.reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetCancelDialog">取 消</el-button>
        <el-button type="primary" @click="cancelOrder">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="'订单'+selectOrderSn+'操作日志'" :visible.sync="logDialogVisible">
      <el-table :data="logData">
        <el-table-column label="时间" width="110" header-align="center" align="center">
          <template scope="scope">
            {{self.timeZone_(scope.row.logTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column property="userName" label="操作人" width="200" header-align="center"
                         align="center"></el-table-column>
        <el-table-column property="logTypeName" label="操作内容" width="200" header-align="center"
                         align="center"></el-table-column>
        <el-table-column property="logNote" label="备注" header-align="center" align="center"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="'订单'+selectOrderSn+'支付记录'" :visible.sync="payDialogVisible" size="large">
      <el-table :data="payRecordData">
        <el-table-column label="创建时间" header-align="center" align="center" width="200px">
          <template scope="scope">
            {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" header-align="center" align="center" width="200px">
          <template scope="scope">
            {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column property="orderSn" label="订单号" header-align="center" align="center" width="230px"></el-table-column>
        <el-table-column property="orderSn" label="联合订单号" header-align="center" align="center" width="230px"></el-table-column>
        <el-table-column property="paySn" label="付款ID" header-align="center" align="center" width="230px"></el-table-column>
        <el-table-column property="channelCode" label="付款渠道" header-align="center" align="center" width="110px"></el-table-column>
        <el-table-column property="payCurrencyAmount" label="付款金额" header-align="center" align="center" width="162px">
          <template scope="scope">
            ${{scope.row.payCurrencyAmount}}
          </template>
        </el-table-column>
        <el-table-column property="currencyCode" label="付款币种" header-align="center" align="center" width="100px"></el-table-column>
        <el-table-column property="payStatusDesc" label="状态" header-align="center" align="center" width="110px"></el-table-column>
        <el-table-column property="refundTypeDesc" label="退款方式" header-align="center" align="center" width="100px"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="联合订单号" :visible.sync="unionDialogVisible" size="tiny" class="order-list">
      <table class="union-table" cellpadding="0" cellspacing="0" v-model="unionPrices">
        <tbody>
        <tr>
          <td>商品应付总金额</td>
          <td class="table-text"> $ <span>{{unionPrices.goodsAmount}}</span></td>
        </tr>
        <tr>
          <td>运费</td>
          <td class="table-text"> $ <span>{{unionPrices.shippingAmount}}</span></td>
        </tr>
        <tr>
          <td>保险费</td>
          <td class="table-text"> $ <span>{{unionPrices.insuranceAmount}}</span></td>
        </tr>
        <tr>
          <td>积分优惠</td>
          <td class="table-text"> -$ <span>{{unionPrices.integralDeductAmount}}</span></td>
        </tr>
        <tr>
          <td>coupon优惠</td>
          <td class="table-text"> -$ <span>{{unionPrices.couponDeductAmount}}</span></td>
        </tr>
        <tr>
          <td>物流coupon优惠</td>
          <td class="table-text"> -$ <span>{{unionPrices.logisticsCouponDeductAmount}}</span></td>
        </tr>
        <tr>
          <td>活动减免</td>
          <td class="table-text"> -$ <span>{{unionPrices.discountAmount}}</span></td>
        </tr>
        <tr>
          <td>支付折扣</td>
          <td class="table-text"> -$ <span>{{unionPrices.payDeductAmount}}</span></td>
        </tr>
        <tr>
          <td>联合订单应付总金额</td>
          <td class="table-text"> $ <span>{{unionPrices.orderAmount}}</span></td>
        </tr>
        <tr>
          <td>实付金额</td>
          <td class="table-text"> $ <span>{{unionPrices.orderAmount}}</span></td>
        </tr>
        </tbody>
      </table>
    </el-dialog>
    <!-- 弹窗E -->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isShowList: true,
        isShowDetail: false,
        option: {
          platform:'',
          payStatus: '',
          firstName: '',
          lastName: '',
          country: '',
          countryCode: '',
          isTest:'',
          logisticsCode:'',
          parentOrderSn: '',
          createStartTime: '',
          createEndtime: '',
          orderSn: '',
          orderCurrency: '',
          orderStatusUnion: '',
          orderType: '',
          email:'',
          pageNum: 1,
          pageSize: 10,
        },
        orderTime: '',
        orderStatuses: [
          {statusCode: '', statusText: '全部'},
          {statusCode: 1, statusText: '待付款'},
          {statusCode: 10, statusText: '付款中'},
          {statusCode: 2, statusText: '待配货'},
          {statusCode: 3, statusText: '待发货'},
          {statusCode: 4, statusText: '已发货'},
          {statusCode: 5, statusText: '已签收'},
          {statusCode: 6, statusText: '已取消'},
          {statusCode: 7, statusText: '申请退款'},
          {statusCode: 9, statusText: '退款中'},
          {statusCode: 8, statusText: '已退款'},

        ],
        payStatuses: [
          {statusCode: '', statusText: '全部'},
          {statusCode: 1, statusText: '未完全支付'},
          {statusCode: 2, statusText: '已完全支付'}
        ],
        orderTypes: [
          {typeCode: '', typeName: '全部'},
          {typeCode: '0', typeName: '线上实物订单'},
          {typeCode: '1', typeName: '付费会员虚拟产品订单'},
          {typeCode: '2', typeName: '软件虚拟产品订单'},
          {typeCode: '3', typeName: '线下订单'}
        ],
        platform:[  //订单设备来源
          {typeCode: '', typeName :'全部'},
          {typeCode: 1, typeName :'WEB'},
          {typeCode: 2, typeName :'WAP'},
          {typeCode: 3, typeName :'Android'},
          {typeCode: 4, typeName :'IOS'},
          {typeCode: 5, typeName :'PAD'},
        ],
        isTest:[ //测试订单
          {code:'', name:'全部'},
          {code:'1', name:'测试订单'},
          {code:'0', name:'非测试订单'},
        ],
        countriesArr: [],
        orderData: [],

        cancelParam: {
          parentOrderSn: '',
          userId:'',
          payStatus: '',
          reason: '',
        },
        currenCanceleRow:{},
        cancelDialogVisible: false,
        cancelRules: {
          reason: [
            {required: true, message: '请输入取消备注', trigger: 'blur'},
          ]
        },

        logDialogVisible: false,
        logData: [],

        payDialogVisible: false,
        payRecordData: [],

        unionDialogVisible: false,
        unionPrices: {
          goodsAmount: '',
          shippingAmount: '',
          insuranceAmount: '',
          integralDeductAmount: '',
          couponDeductAmount: '',
          discountAmount: '',
          payDeductAmount: '',
          orderAmount: ''
        },

        self: this,
        tableLoading: true,
        labelPosition: 'right',
        total: 10,
        selectOrderSn:'',
        logisticsTypeList:[],  //物流方式
        currencys : [], //币种
        countryList :[]
      };
    },
    created () {
      this.initSearch();
      this.getLogisticsTypeList();
      this.getCurrencysAndCountryList();
      this.getData();
    },
    methods: {
       //获得物流方式
      getLogisticsTypeList (){
        this.logisticsTypeList = [{name:'全部',code:''}];
        this.$http.get('logistics/way/public-all').then(res => {
          if (res.body.code === 0) {
            // console.log(res.body.data.wayRelationList);
            var name = '', code = '';
            for (var i = 0; i < res.body.data.wayRelationList.length; i++) {
              name = res.body.data.wayRelationList[i].logisticsName;
              code = res.body.data.wayRelationList[i].logisticsCode;
              this.logisticsTypeList.push({name: name, code: code});
            }
            //console.log(this.logisticsTypeList);
          }
        });
      },

      getCurrencysAndCountryList (){
          this.currencys = [];
          this.countryList = [{countryCode:'',countryName:'全部'}];
          this.$http.get('order/index/public-country-currency-list').then(res => {
              if(res.body.code === 0 && res.body.data){
                 var list1 = res.body.data.currencys ;
                 for(var i =0 ;i<list1.length ; i++){
                   this.currencys.push({currencyCode : list1[i].currencyCode , currencyName : list1[i].currencyName});
                 }
                 var list2 = res.body.data.countrys ;
                for(var j=0;j<list2.length; j++){
                    this.countryList.push({countryCode : list2[j].countryCode , countryName : list2[j].countryName});
                }
              }else{
                 this.$message.error(res.body.message);
              }
              //console.log(this.countryList);
          });
      },

      //订单创建时间 存入sessionStorage
      orderTimeSaveLocal (time){
        sessionStorage.setItem('orderCreateTime',time);
      },
      //初始化查询
      initSearch (){
        let orderTimeStr = sessionStorage.getItem("orderCreateTime");
        let searchParams = JSON.parse(sessionStorage.getItem("params"));

        if (orderTimeStr === null || orderTimeStr === '' || orderTimeStr === 'undefined') {
          this.orderTime = [new Date(new Date().getTime() - 30 * 24 * 3600000), new Date()];
        } else {
          let orderTimeArr = orderTimeStr.split(',');
          orderTimeArr[0] = new Date(orderTimeArr[0]);
          orderTimeArr[1] = new Date(orderTimeArr[1]);
          this.orderTime = orderTimeArr;
        }

        this.option.orderSn = searchParams && searchParams.orderSn ? searchParams.orderSn : '';
        this.option.parentOrderSn = searchParams && searchParams.parentOrderSn ? searchParams.parentOrderSn : '';
        this.option.email = searchParams && searchParams.email ? searchParams.email : '';
        this.option.orderStatusUnion = searchParams && searchParams.orderStatusUnion ? searchParams.orderStatusUnion : '';
        this.option.payStatus = searchParams && searchParams.payStatus ? searchParams.payStatus : '';
        this.option.platform = searchParams && searchParams.platform ? searchParams.platform : '';
        this.option.orderType = searchParams && searchParams.orderType ? searchParams.orderType : '';
        this.option.orderCurrency = searchParams && searchParams.orderCurrency ? searchParams.orderCurrency : '';
        this.option.logisticsCode = searchParams && searchParams.logisticsCode ? searchParams.logisticsCode : '';
        this.option.countryCode = searchParams && searchParams.countryCode ? searchParams.countryCode : '';
        this.option.firstName = searchParams && searchParams.firstName ? searchParams.firstName : '';
        this.option.lastName = searchParams && searchParams.lastName ? searchParams.lastName : '';
        this.option.isTest = searchParams && searchParams.isTest ? searchParams.isTest : '';
        this.option.pageNum = searchParams && searchParams.pageNum ? searchParams.pageNum : 1;
        this.option.pageSize = searchParams && searchParams.pageSize ? searchParams.pageSize : 10;
      },

      getData(){
            if (this.option.orderSn || this.option.parentOrderSn || this.option.email || (this.orderTime && this.orderTime.length > 0)) {
                var timeArr = this.timeZone_(this.orderTime, this.$store.getters.getTimeZone);
                if (Array.isArray(timeArr) && timeArr.length >= 2) {
                    this.option.createStartTime = timeArr[0];
                    this.option.createEndtime = timeArr[1];
                }
                //email 验证
                if(this.option.email){
                    let  reg = /^[\w][\.\w_\\-]+[\w]@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                    let  isEmail = reg.test(this.option.email);
                    if(!isEmail){
                      this.$message.warning('请填写正确的注册邮箱!');
                      return false;
                    }
                }

                let params = {};
                for (let i in this.option) {
                    var item = this.option[i];
                    if (item !== null && item !== '') {
                        params[i] = item;
                    }
                }

                if(this.option.countryCode){
                   let country  = '';
                   for(let i=0;i<this.countryList.length;i++){
                       if(this.option.countryCode === this.countryList[i].countryCode){
                         country = this.countryList[i].countryName;
                       }
                   }
                  params.country = country;
                }
                this.tableLoading = true;
                sessionStorage.setItem("params",JSON.stringify(params));
                this.$http.post('order/index/list', params).then(res => {
                    if (res.body.code === 0) {
                        this.orderData = res.body.data.list;
                        this.total = res.body.data.totalCount;
                        this.tableLoading = false;
                    }
                });
            } else {
                this.$message.warning('以下参数至少选择一项: 订单号、联合订单号、邮箱、订单时间');
            }

      },

      searchBthClick (){
        this.option.pageNum = 1;
        this.option.pageSize = 10;
        this.getData();
      },

      ChangePage (val) {
        this.option.pageNum = val;
        this.getData();
      },
      ChangePageSize (val) {
        this.option.pageSize = val;
        this.getData();
      },
      showCancelDialog (parentOrderSn, userId,payStatus,canCancelRow){
        this.cancelParam.reason = '';
        this.cancelParam.parentOrderSn = parentOrderSn;
        this.cancelParam.userId = userId;
        this.cancelParam.payStatus = payStatus;
        this.currenCanceleRow=canCancelRow;

        this.cancelDialogVisible = true;
        this.$nextTick(function () {
          this.$refs["cancelForm"].resetFields();
        });

      },
      cancelOrder (){
        this.$refs.cancelForm.validate((valid) => {
          if (valid) {
            this.$http.post('order/index/cancel', this.cancelParam).then(res => {
              if (res.body.code === 0) {
                this.$message.success(res.body.message);
                this.cancelDialogVisible = false;
                this.currenCanceleRow.isCancel=false;

              } else {
                this.$message.error(res.body.message);
              }
            });
          }
          this.currenCanceleRow={};
        });
      },
      resetCancelDialog(){
        this.cancelDialogVisible = false;
      },
      showLog (orderSn){
        this.logDialogVisible = true;
        this.selectOrderSn=orderSn;
        this.$http.get('order/index/order-log', {params: {orderSn: orderSn}}).then(res => {
          if (res.body.code === 0) {
            this.logData = res.body.data.list;
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
      showPayRecord(orderSn, parentOrderSn){
        this.selectOrderSn=orderSn;
        this.$http.get('order/index/pay-record', {
          params: {
            orderSn: orderSn,
            parentOrderSn: parentOrderSn
          }
        }).then(res => {
          if (res.body.code === 0) {
            this.payRecordData = res.body.data.payRecords;
            this.payDialogVisible = true;
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
      showUnionOrder(orderId){
        this.unionDialogVisible = true;
        this.unionPrices={};
        this.$http.get('order/index/union-order-amount', {params: {parentOrderSn: orderId}}).then(res => {
          if (res.body.code === 0) {
            this.unionPrices = res.body.data;
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
    }
  }
</script>

<style lang="less">
  .order-list {
    .tip {
      display: inline-block;
      padding: 2px 28px;
      margin: 14px 0;
    }
    .cancel-tip {
      margin-bottom: 20px;
    }
    .m-top {
      margin-top: 20px;
    }
    .union-table, .detail-table {
      border-collapse: collapse;
      border: 1px solid #dfe6ec;
      width: 100%;
      td, th {
        border-collapse: collapse;
        border: 1px solid #dfe6ec;
        text-align: center;
        padding: 8px;
      }

    }
    .cell {
      padding: 5px;
    }
    .link-text {
      cursor: pointer;
    }
    .detail-table {
      .left-title {
        width: 15%;
      }
      .table-text {
        padding-left: 50px;
        text-align: left;
      }
    }
    .account-table {
      td, th {
        border: none;
        padding: 5px 0;
      }
      .account-title {
        text-align: right;
      }
      .amount {
        text-align: left;
      }
    }
  }
  .select-item{
    input{
      width:192px;
    }
  }
  .create-time{
    .el-picker-panel__link-btn{ display: none; }
  }
</style>
