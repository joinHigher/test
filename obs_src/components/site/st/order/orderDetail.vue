<template>
  <div>  <!--ST订单详情-->
    <div class="el-container order-detail">
      <div class="text-right">
        <el-button type="primary" :disabled="hasPrev" @click="getPreOrder" icon="arrow-left">上一个订单</el-button>
        <el-button type="primary" :disabled="hasNext" @click="getNextOrder">下一个订单<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </div>
      <table class="detail-table m-top add-width" cellpadding="0" cellspacing="0" v-model="orderDetail">
        <tbody>
        <tr>
          <td class="left-title">订单号</td>
          <td class="table-text"><span>{{orderDetail.orderSn}}</span></td>
        </tr>
        <tr>
          <td class="left-title">联合订单号</td>
          <td class="table-text"><span>{{orderDetail.parentOrderSn}}</span></td>
        </tr>
        <tr>
          <td class="left-title">网站订单状态</td>
          <td class="table-text"><span>{{orderDetail.orderStatusDesc}}</span></td>
        </tr>
        </tbody>
      </table>
      <table class="detail-table m-top" cellpadding="0" cellspacing="0" v-model="orderDetail">
        <tbody>
        <tr>
          <td class="left-title">
            <div class="goodsInfo">
              商品信息
            </div>
          </td>
          <td>
            <el-table ref="multipleTable" v-loading.body="tableLoading" :data="orderDetail.orderGoodsRespList" border tooltip-effect="dark" :default-sort = "{prop: 'goodsStatus', order: 'descending'}">
              <el-table-column prop="goodName" label="商品标题" header-align="center" align="left" min-width="150px"></el-table-column>
              <el-table-column prop="goodImage" label="图片" header-align="center" align="center" min-width="210px">
                <template scope="scope">
                  <img class="product-img" :src= "domain + scope.row.goodImage"/>
                </template>
              </el-table-column>
              <el-table-column prop="goodsSn" label="SKU" header-align="center" align="center" min-width="110px"></el-table-column>
              <el-table-column prop="warehouseCode" label="指定仓库" header-align="center" align="left" min-width="100px">
                <template scope="scope">
                  <p v-for="item in scope.row.orderGoodsExtendRespList" :key="item.id">
                    {{ item.realWarehouseCode }}/{{ item.logisticsName }}/{{ item.freeStockNum + item.activityStockNum}}件
                  </p>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="单价" header-align="center" align="center" min-width="100px">
                <template scope="scope">
                  <span v-if="scope.row.price">$</span>
                  <span>{{scope.row.price}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="qty" label="数量" header-align="center" align="center" min-width="70px"></el-table-column>
              <el-table-column prop="deductPrice" label="折后价" header-align="center" align="center" min-width="100px">
                <template scope="scope">
                  <span v-if="scope.row.price">$</span>
                  <span>{{scope.row.deductPrice}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="goodsLabelName" label="系统价格标签" header-align="center" align="left" min-width="100px"></el-table-column>
              <el-table-column prop="priceId" label="价格ID" header-align="center" align="left" min-width="100px"></el-table-column>
              <el-table-column prop="couponDeductAmount" label="coupon优惠" header-align="center" align="center" min-width="90px"></el-table-column>
              <el-table-column prop="activityDeductAmount" label="活动优惠" header-align="center" align="center" min-width="70px"></el-table-column>
              <el-table-column prop="integralDeductAmount" label="积分优惠" header-align="center" align="center" min-width="70px"></el-table-column>
              <el-table-column prop="payDeductAmount" label="支付折扣" header-align="center" align="left" min-width="70px"></el-table-column>
              <el-table-column prop="goodsStatus" label="是否有效" header-align="center" align="center" min-width="70px">
                <template scope="scope">
                  <span>{{ scope.row.goodsStatus == 1  ? '否' : '是'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="goodsStatus" label="备注" header-align="center" align="center" min-width="70px">
                <template scope="scope">
                  <!--<span>{{goodStatuses[scope.row.goodsStatus]}}</span>-->
                  <span v-if="scope.row.goodsStatus == 1">编辑订单删除</span>
                  <span v-if="scope.row.goodsStatus == 3">编辑订单新增</span>
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
        </tbody>
      </table>
      <table class="detail-table m-top add-width" cellpadding="0" cellspacing="0" v-model="orderDetail">
        <tbody>
        <tr>
          <td class="left-title">结算信息</td>
          <td class="table-text">
            <table class="account-table">
              <tbody>
              <tr>
                <td class="account-title">商品总价 : </td>
                <td class="amount"> $<span>{{orderDetail.goodsAmount}}</span></td>
              </tr>
              <tr>
                <td class="account-title">运费 : </td>
                <td class="amount"> $<span>{{orderDetail.shippingAmount}}</span></td>
              </tr>
              <tr>
                <td class="account-title">保险费 : </td>
                <td class="amount"> $<span>{{orderDetail.insuranceAmount}}</span></td>
              </tr>
              <tr>
                <td class="account-title">积分优惠 : </td>
                <td class="amount"> -$<span>{{orderDetail.integralDeductAmount}} (积分数: {{orderDetail.usedIntegral}})</span></td>
              </tr>
              <tr>
                <td class="account-title">coupon优惠 : </td>
                <td class="amount"> -$<span>{{orderDetail.couponDeductAmount}}</span></td>
              </tr>
              <tr>
                <td class="account-title">物流coupon优惠 : </td>
                <td class="amount"> -$<span>{{orderDetail.logisticsCouponDeductAmount}}</span></td>
              </tr>
              <tr>
                <td class="account-title">活动减免 : </td>
                <td class="amount"> -$<span>{{orderDetail.discountAmount}}</span></td>
              </tr>
              <tr>
                <td class="account-title">支付折扣 : </td>
                <td class="amount"> -$<span>{{orderDetail.payDeductAmount}}</span></td>
              </tr>
              <tr>
                <td class="account-title">折后应付金额 : </td>
                <td class="amount"> $<span>{{orderDetail.orderAmount}}</span></td>
              </tr>
              <tr>
                <td class="account-title">实付金额 : </td>
                <td class="amount"> $<span>{{orderDetail.orderAmount}}</span></td>
              </tr>
              <tr>
                <td class="account-title">使用coupon码 : </td>
                <td class="amount"><span>{{orderDetail.couponCode}}</span></td>
              </tr>
              <tr>
                <td class="account-title">使用物流coupon码 : </td>
                <td class="amount"><span>{{orderDetail.logisticsCouponCode}}</span></td>
              </tr>
              <tr>
                <td class="account-title">商品体积总重量 : </td>
                <td class="amount"><span>{{orderDetail.columeWeight}} kg</span></td>
              </tr>
              <tr>
                <td class="account-title">商品销售总重量 : </td>
                <td class="amount"><span>{{orderDetail.saleWeight}} kg</span></td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="left-title">配货信息</td>
          <td class="table-text"><span>{{orderDetail.distributeStatusDesc}}</span></td>
        </tr>
        <tr>
          <td class="left-title">发货信息</td>
          <td class="table-text"><span>{{orderDetail.orderLogisticsStatusDesc}}</span></td>
        </tr>
        <tr>
          <td class="left-title">物流方式</td>
          <td class="table-text">
            <span>{{orderDetail.logisticsName}}</span>
          </td>
        </tr>
        <tr>
          <td class="left-title">CASE状态</td>
          <td class="table-text"><span>{{orderDetail.caseStatusDesc}}</span></td>
        </tr>
        <tr>
          <td class="left-title">RMA状态</td>
          <td class="table-text"><span>{{orderDetail.rmaStatusDesc}}</span></td>
        </tr>
        <tr>
          <td class="left-title">收货人</td>
          <td class="table-text"><span>{{orderDetail.orderAddressResp.firstName}} {{orderDetail.orderAddressResp.lastName}}</span></td>
        </tr>
        <tr>
          <td class="left-title">详细地址</td>
          <td class="table-text"><span>{{orderDetail.orderAddressResp.addressLine1}}</span></td>
        </tr>
        <tr>
          <td class="left-title">国家/州/城市</td>
          <td class="table-text">
            <span v-if="orderDetail.orderAddressResp.country">{{orderDetail.orderAddressResp.country}}/</span>
            <span v-if="orderDetail.orderAddressResp.province">{{orderDetail.orderAddressResp.province}}/</span>
            <span v-if="orderDetail.orderAddressResp.city">{{orderDetail.orderAddressResp.city}}</span>
          </td>
        </tr>
        <tr>
          <td class="left-title">电话</td>
          <td class="table-text"><span>{{orderDetail.orderAddressResp.phone}}</span></td>
        </tr>
        <tr>
          <td class="left-title">支付方式</td>
          <td class="table-text"><span>{{orderDetail.payChannel}}</span></td>
        </tr>
        <tr>
          <td class="left-title">付款时间</td>
          <td class="table-text"><span>{{orderDetail.completedTime ? self.timeZone_(orderDetail.completedTime, self.$store.getters.getTimeZone) :''}}</span></td>
        </tr>
        <tr>
          <td class="left-title">客户留言</td>
          <td class="table-text"><span>{{orderDetail.userRemark}}</span></td>
        </tr>
        <tr>
          <td class="left-title">下单时间</td>
          <td class="table-text">
            <span> {{self.timeZone_(orderDetail.createdTime, self.$store.getters.getTimeZone)}}</span>
          </td>
        </tr>
        <tr>
          <td class="left-title">订单语言</td>
          <td class="table-text">
            <span>{{orderDetail.orderLanguage}}</span>
            <p class="color-light-silver">注：en->英语; ja->日语; fr->法语; es->西班牙语; ru->俄语; pt->葡语; it->意大利语; de->德语; </p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableLoading: false,
        goodStatuses: {
          0: '正常',
          1: '删除',
          2: '退货',
          3: '新增（编辑)',
          4: 'rma新增'
        },
        detailParams: {
          orderSn: '',
          userId: ''
        },
        orderDetail: {
          orderSn: '',
          parentOrderSn: '',
          orderStatusDesc: '',
          goodsAmount: '',
          shippingAmount: '',
          insuranceAmount: '',
          integralDeductAmount: '',
          couponDeductAmount: '',
          discountAmount: '',
          payDeductAmount: '',
          orderAmount: '',
          couponCode: '',
          saleWeight: '',
          distributeStatusDesc: '',
          orderLogisticsStatusDesc: '',
          logisticsCode: '',
          caseStatusDesc: '',
          rmaStatusDesc: '',
          orderStatus: '',
          userRemark: '',
          payChannel: '',
          completedTime: '',
          createdTime: '',
          orderLanguage: '',
          orderGoodsRespList: [{
            goodName: '',
            goodImage: '',
            webGoodSn: '',
            warehouseCode: '',
            price: '',
            deductPrice: '',
            priceTypeName: '',
            goodsLabelName:'',
            priceId: '',
            qty: '',
            couponDeductAmount: '',
            activityDeductAmount: '',
            integralDeductAmount: '',
            payDeductAmount: '',
            goodsStatus: ''
          }],
          orderAddressResp: {
            firstName: '',
            lastName: '',
            addressLine1: '',
            country: '',
            province: '',
            city: '',
            phone: ''
          },
          upOrDownFlag: '',//上一个下一个订单标志，0-上；1-下
        },
        upOrderSn: '',//上个订单编号
        downOrderSn: '',//下个订单编号
        hasPrev: true,
        hasNext: true,
        self: this
      };
    },
    created () {
      this.detailParams.orderSn = this.$route.query.orderSn;
      this.detailParams.userId = this.$route.query.userId;
      this.showOrderDetail();
      this.addGryRow();
    },
    computed: {
      domain () {
        return this.$store.getters.getDomain + '/';
      }
    },
    methods: {
      showOrderDetail () {
        var params = this.detailParams.userId ? this.detailParams : {orderSn: this.detailParams.orderSn};
        this.isShowList = false;
        this.isShowDetail = true;
        this.$http.get('order/index/detail', {params: params}).then(res => {
          if (res.body.code === 0) {
            this.orderDetail = res.body.data.data;
            var goodsList = this.orderDetail.orderGoodsRespList;
            if(goodsList && goodsList.length>0){
              for(let i=0;i<goodsList.length;i++){
                if(goodsList[i].goodsStatus !== 1 && goodsList[i].goodsStatus !== 3){
                  goodsList[i].goodsStatus = 100;
                }
              }
            }
            // console.log(this.orderDetail.orderGoodsRespList);
            this.upOrderSn = res.body.data.upOrderSn;
            this.downOrderSn = res.body.data.downOrderSn;
            this.setDetailBtn();
            this.isShowList = false;
            this.isShowDetail = true;
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
      getPreOrder () {
        if (this.upOrderSn) {
          this.detailParams.orderSn = this.upOrderSn;
          this.showOrderDetail();
        }
      },
      getNextOrder () {
        if (this.downOrderSn) {
          this.detailParams.orderSn = this.downOrderSn;
          this.showOrderDetail();
        }
      },
      setDetailBtn () {
        this.hasPrev = this.upOrderSn ? false : true;
        this.hasNext = this.downOrderSn ? false : true;
      },

      addGryRow (){   //“备注”为 编辑订单删除 的行背景色设置成灰色
        setTimeout(function(){
          var cellList = document.getElementsByClassName("cell");
          if(cellList && cellList.length>0){
            for(let i=0;i<cellList.length;i++){
              var cell = cellList[i];
              if(cell.innerHTML.indexOf('编辑订单删除') !==-1){
                var par = cell.parentNode.parentNode;
                par.style.background = '#D9D9D8';
              }
            }
          }
        },500);
      },

    }
  }
</script>

<style lang="less" scoped>
  .goodsInfo{
    width:88px;
  }
  .order-detail {
    .search-form {
      .el-input {
        width: 217px;
      }
    }

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
        width:6.5%;
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
    .product-img {
      width: 100%;
      height: 130px;
    }
  }
</style>
