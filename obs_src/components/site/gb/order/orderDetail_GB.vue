<!--GB订单详情-->
<template>
    <div>
        <el-row>
            <el-col :span="22">
                <div class="el-container order-detail">
                    <div class="text-right">
                        <el-button type="primary" :disabled="hasPrev" @click="getPreOrder" icon="arrow-left">上一个订单
                        </el-button>
                        <el-button type="primary" :disabled="hasNext" @click="getNextOrder">下一个订单<i
                            class="el-icon-arrow-right el-icon--right"></i></el-button>
                    </div>
                    <table class="detail-table m-top add-width" cellpadding="0" cellspacing="0" v-model="orderDetail" id="base">
                        <tbody>
                            <tr>
                                <td class="left-title">订单号</td>
                                <td class="table-text"><span>{{orderDetail.orderSn}}</span></td>
                                <td class="left-title">联合订单号</td>
                                <td class="table-text"><span>{{orderDetail.parentOrderSn}}</span></td>
                            </tr>
                            <tr>
                                <td class="left-title">订单状态</td>
                                <td class="table-text"><span
                                    style="color: red;">{{ orderStatusSequResList[orderDetail.orderStatusSequ]}}</span></td>
                                <td class="left-title">下单时间</td>
                                <td class="table-text">
                                    <span>{{self.timeZone_(orderDetail.createdTime, self.$store.getters.getTimeZone)}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="left-title">支付方式</td>
                                <td class="table-text"><span>{{orderDetail.payChannel}}</span></td>
                                <td class="left-title">完全支付时间</td>
                                <td class="table-text">
                                    <span>{{self.timeZone_(orderDetail.completedTime, self.$store.getters.getTimeZone)}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="left-title">指定物流</td>
                                <td class="table-text">
                                    <span>
                                        <span v-if="orderDetail.logisticsCodeName"> 物流方式：{{ orderDetail.logisticsCodeName }}    ； &nbsp;</span>
                                        <span v-if="orderDetail.logisticsGroupIdName"> 物流分组：{{ orderDetail.logisticsGroupIdName }} </span>
                                    </span>
                                </td>
                                <td class="left-title">是否dropshipping</td>
                                <td class="table-text">
                                    <span>{{ isDropshippingResList[orderInfoExtendResp.isDropshipping]}}</span></td>
                            </tr>
                            <tr>
                                <td class="left-title">国家站渠道</td>
                                <td class="table-text"><span>{{orderDetail.pipelineCodeName}}</span></td>
                                <td class="left-title">设备来源</td>
                                <td class="table-text"><span>{{ platformResList[orderInfoExtendResp.platform] }}</span></td>
                            </tr>
                            <tr>
                                <td class="left-title">订单语言</td>
                                <td class="table-text"><span>{{ langList[orderDetail.orderLanguage] }}</span></td>
                                <td class="left-title">APP版本号</td>
                                <td class="table-text"><span>{{ orderInfoExtendResp.platformVersion }}</span></td>
                            </tr>
                            <tr>
                                <td class="left-title">linkID</td>
                                <td class="table-text" colspan="3"><span>{{ orderInfoExtendResp.wjLinkid }}</span></td>
                            </tr>
                            <tr>
                                <td class="left-title">顾客留言</td>
                                <td class="table-text" colspan="3"><span>{{ orderInfoExtendResp.userRemark }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <div id="sendInfo">
                        <el-tabs v-model="tabs.sendInfoTabs">
                            <el-tab-pane label="发货信息" name="sendInfo"></el-tab-pane>
                        </el-tabs>
                        <div v-if="orderDetail.orderExpressPackageRespList && orderDetail.orderExpressPackageRespList.length === 0">
                            <h4 style="text-align: center">暂无包裹</h4>
                        </div>
                        <div v-if="orderDetail.orderExpressPackageRespList && orderDetail.orderExpressPackageRespList.length > 0">
                            <el-table ref="multipleTable" v-loading.body="tableLoading"
                                      :data="orderDetail.orderExpressPackageRespList" border tooltip-effect="dark">
                                <el-table-column label="发货单" header-align="center" min-width="200px">
                                    <template scope="scope">
                                        <p>物流单号：{{ scope.row.logisticsSn ? scope.row.logisticsSn : '--'}}</p>
                                        <p v-if="scope.row.transferNumber">转单号：{{ scope.row.transferNumber ? scope.row.transferNumber : '--' }}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="物流名称" header-align="center" min-width="150px">
                                    <template scope="scope">
                                        {{ scope.row.logisticsName ? scope.row.logisticsName : '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="goodsSn" label="发货时间" header-align="center" align="center" min-width="110px">
                                    <template scope="scope">
                                        {{ self.timeZone_(orderDetail.deliveryTime, self.$store.getters.getTimeZone) ?
                                           self.timeZone_(orderDetail.deliveryTime, self.$store.getters.getTimeZone) : '--'
                                        }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="goodsSn" label="预计到达时间" header-align="center" min-width="110px">
                                    <template scope="scope">
                                        {{ scope.row.minDay}} - {{scope.row.maxDay}}天，Exact time depends on courier
                                    </template>
                                </el-table-column>
                                <el-table-column label="SKU" header-align="center" min-width="150px">
                                    <template scope="scope">
                                        <p v-for="item in scope.row.goodsSnList">{{ item }},</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="发货仓库" header-align="center" min-width="140px">
                                    <template scope="scope">
                                        <p>销售仓：{{ scope.row.deliveryWarehouseCode ? scope.row.deliveryWarehouseCode : '--' }}</p>
                                        <p>真实仓：{{ scope.row.deliveryWarehouseName ? scope.row.deliveryWarehouseName : '--' }}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="发货状态" header-align="center" align="center" min-width="110px">
                                    <template scope="scope">
                                        {{ logisticsStatusList[scope.row.logisticsStatus] }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="包裹图片" header-align="center" align="center" min-width="150px">
                                    <template scope="scope">
                                        <img v-if="scope.row.hasImg=== 1" class="product-img"
                                             :src="domain + scope.row.imgUrl"
                                             @click="previewClick(domain + scope.row.imgUrl)" style="cursor: pointer"/>
                                        <span v-if="scope.row.hasImg=== 0">无</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div id="goodsInfo">
                        <el-tabs v-model="tabs.goodsInfoTabs">
                            <el-tab-pane label="商品信息" name="goodsInfo"></el-tab-pane>
                        </el-tabs>
                        <el-table ref="multipleTable" v-loading.body="tableLoading" :data="goodsList" border tooltip-effect="dark">
                            <el-table-column prop="goodImage" label="图片" header-align="center" align="center" min-width="150px">
                                <template scope="scope">
                                    <img class="product-img" :src="domain + scope.row.goodImage"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品" header-align="center" min-width="150px">
                                <template scope="scope">
                                    <p>商品标题：<a :href="scope.row.goodsWebUrl" target="_blank"> {{ scope.row.goodName ? scope.row.goodName : '--' }} </a></p>
                                    <p>商品属性：颜色：{{ scope.row.goodsAttrResp.color ? scope.row.goodsAttrResp.color : '--' }}
                                                 / 尺寸：{{ scope.row.goodsAttrResp.size ? scope.row.goodsAttrResp.size : '--' }}
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="内部SKU" header-align="center" align="center" min-width="110px">
                                <template scope="scope">
                                    <span> {{ scope.row.goodsSn }} </span>
                                    <el-button class="@color-blue" v-if="scope.row.goodsStyle === 2" type="text"
                                               @click="lucyBagOpen(scope.row.goodsSn, scope.row.orderSn, scope.row.orderGoodsId)">(福袋)</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="指定仓库和物流" header-align="center" min-width="150px">
                                <template scope="scope">
                                    <div v-for="item in scope.row.orderGoodsExtendRespList" :key="item.id">
                                        <p>仓名称: {{item.realWarehouseName}}</p>
                                        <p>物流: {{item.logisticsName}}</p>
                                        <p>数量: {{ item.freeStockNum + item.activityStockNum}}件</p>
                                        <p></p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="price" label="单价" header-align="center" align="center"
                                             min-width="90px">
                                <template scope="scope">
                                    <span v-if="scope.row.price">$</span>
                                    <span>{{scope.row.price}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="qty" label="数量" header-align="center" align="center"
                                             min-width="60px"></el-table-column>
                            <el-table-column label="SKU优惠分摊" header-align="center" min-width="120px">
                                <template scope="scope">
                                    <p>
                                        活动优惠: {{ scope.row.activityDeductAmount === 0 ? '--' : scope.row.activityDeductAmount}}</p>
                                    <p>
                                        coupon优惠: {{ scope.row.couponDeductAmount === 0 ? '--' : scope.row.couponDeductAmount}}</p>
                                    <p>
                                        积分优惠: {{ scope.row.integralDeductAmount === 0 ? '--' : scope.row.integralDeductAmount}}</p>
                                    <p> 支付优惠: {{ scope.row.payDeductAmount === 0 ? '--' : scope.row.payDeductAmount}}</p>
                                    <el-button class="@color-blue" style="text-decoration: underline" type="text"
                                               @click="apportionDetailOpen(scope.row.orderGoodsId, scope.row.orderSn)">
                                               分摊明细
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="deductPrice" label="SKU折后价" header-align="center" align="center" min-width="90px">
                                <template scope="scope">
                                    <p style="color: red;" v-if="scope.row.deductPrice">
                                        <span v-if="scope.row.price">$</span>
                                        <span>{{scope.row.deductPrice}}</span>
                                    </p>
                                    <p v-if="!scope.row.deductPrice">--</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="价格信息" header-align="center" min-width="120px">
                                <template scope="scope">
                                    <p v-if="scope.row.goodsLabelName"> 系统价格标签: {{ scope.row.goodsLabelName }} </p>
                                    <p v-if="scope.row.priceId"> 价格ID: {{ scope.row.priceId }} </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="所属店铺" header-align="center">
                                <template scope="scope">
                                    {{ scope.row.shopInfo.shopName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="商品类型" align="center" min-width="100px">
                                <template scope="scope">
                                    <span v-if="scope.row.goodsType === 0">普通</span>
                                    <span v-if="scope.row.goodsType === 1">配件</span>
                                    <span v-if="scope.row.goodsType === 2">赠品</span>
                                    <span v-if="scope.row.goodsType === 3">加价购</span>
                                    <span v-if="scope.row.goodsType === 21">买即赠赠品</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div id="clearing">
                        <el-row>
                            <el-col :span="6" style="margin-right: 100px;">
                                <el-tabs v-model="tabs.clearing">
                                    <el-tab-pane label="订单结算" name="clearing"></el-tab-pane>
                                </el-tabs>
                                <table class="detail-table  add-width order-clearing" cellpadding="0" cellspacing="0" border="0" v-model="orderDetail">
                                    <tbody>
                                        <tr>
                                            <td class="account-title" style="width: 146px;">商品总价 : </td>
                                            <td class="amount" style="color: red;">
                                                $<span>{{orderDetail.goodsAmount}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="account-title">活动减免 : </td>
                                            <td class="amount"> -$<span>{{orderDetail.discountAmount}}</span></td>
                                        </tr>
                                        <tr>
                                            <td class="account-title">coupon优惠 : </td>
                                            <td class="amount"> -$<span>{{orderDetail.couponDeductAmount}}</span></td>
                                        </tr>
                                        <tr>
                                            <td class="account-title">积分优惠 : </td>
                                            <td class="amount">
                                                -$<span>{{orderDetail.integralDeductAmount}} (积分数: {{orderInfoExtendResp.usedIntegral}})</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="account-title">运费 : </td>
                                            <td class="amount" style="color: red;">
                                                $<span>{{orderDetail.shippingAmount}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="account-title">运费coupon优惠 : </td>
                                            <td class="amount"> -$<span>{{orderDetail.logisticsCouponDeductAmount}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="account-title">保险费 : </td>
                                            <td class="amount" style="color: red;">
                                                $<span>{{orderDetail.insuranceAmount}}</span></td>
                                        </tr>
                                        <tr>
                                            <td class="account-title">支付折扣 : </td>
                                            <td class="amount"> -$<span>{{orderDetail.payDeductAmount}}</span></td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">
                                                <div style="width: 90%; height: 1px; background-color: #ddd;"></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="account-title">订单应付金额 : </td>
                                            <td class="amount" style="color: red;">
                                                $<span>{{orderDetail.orderAmount}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="account-title">使用积分数 : </td>
                                            <td class="amount"> $<span>{{ orderInfoExtendResp.usedIntegral }}</span></td>
                                        </tr>
                                        <tr  v-if="orderInfoExtendResp.couponCode">
                                            <td class="account-title">使用coupon码 : </td>
                                            <td class="amount">
                                                <span>
                                                    {{ orderInfoExtendResp.couponCode}}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr v-if="orderDetail.logisticsCouponCode">
                                            <td class="account-title">使用物流coupon码 : </td>
                                            <td class="amount">
                                                <span>
                                                    {{ orderDetail.logisticsCouponCode}}
                                                </span>
                                            </td>
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
                            </el-col>
                            <el-col :span="6" style="margin-right: 100px;">
                                <el-tabs v-model="tabs.consignee">
                                    <el-tab-pane label="收货人信息" name="consignee"></el-tab-pane>
                                </el-tabs>
                                <table class="detail-table  add-width order-clearing" cellpadding="0" cellspacing="0" border="0" v-model="orderDetail">
                                    <tbody>
                                        <tr v-if="orderDetail.orderAddressResp.firstName && orderDetail.orderAddressResp.lastName">
                                            <td class="account-title">姓名 : </td>
                                            <td class="amount">
                                                <span>
                                                    {{orderDetail.orderAddressResp.firstName}} {{orderDetail.orderAddressResp.lastName}}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.addressLine1">
                                            <td class="account-title">地址 Line 1 : </td>
                                            <td class="amount">
                                                <span>
                                                    {{orderDetail.orderAddressResp.addressLine1}}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.addressLine2">
                                            <td class="account-title">地址 Line 2 : </td>
                                            <td class="amount">
                                                <span>
                                                    {{orderDetail.orderAddressResp.addressLine2}}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.addressLine3">
                                            <td class="account-title">备用地址 Line 1 : </td>
                                            <td class="amount">
                                                <span>{{orderDetail.orderAddressResp.addressLine3}}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.addressLine4">
                                            <td class="account-title">备用地址 Line 2 : </td>
                                            <td class="amount"><span>{{orderDetail.orderAddressResp.addressLine4}}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.country && orderDetail.orderAddressResp.province && orderDetail.orderAddressResp.city">
                                            <td class="account-title" style="min-width: 130px">国家, 省/区/州, 城市 : </td>
                                            <td class="amount">
                                                <span>
                                                 {{orderDetail.orderAddressResp.country}}，{{orderDetail.orderAddressResp.province}}，{{orderDetail.orderAddressResp.city}}
                                              </span>
                                            </td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.postalCode">
                                            <td class="account-title">邮编 : </td>
                                            <td class="amount"><span>{{orderDetail.orderAddressResp.postalCode}}</span></td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.phone">
                                            <td class="account-title">电话 : </td>
                                            <td class="amount"><span>{{orderDetail.orderAddressResp.phone}}</span></td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.email">
                                            <td class="account-title">邮箱 : </td>
                                            <td class="amount"><span>{{orderDetail.orderAddressResp.email}}</span></td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.taxNumber">
                                            <td class="account-title">税号 : </td>
                                            <td class="amount"><span>{{orderDetail.orderAddressResp.taxNumber}}</span></td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.issuingAgency">
                                            <td class="account-title">颁发机构 : </td>
                                            <td class="amount"><span>{{orderDetail.orderAddressResp.issuingAgency}}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.middleName">
                                            <td class="account-title">middle name : </td>
                                            <td class="amount"><span>{{orderDetail.orderAddressResp.middleName}}</span></td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.passportSerial">
                                            <td class="account-title">passport serial : </td>
                                            <td class="amount"><span>{{orderDetail.orderAddressResp.passportSerial}}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.passportNo">
                                            <td class="account-title">passport number : </td>
                                            <td class="amount"><span>{{orderDetail.orderAddressResp.passportNo}}</span></td>
                                        </tr>
                                        <tr v-if="orderDetail.orderAddressResp.passportIssueDate">
                                            <td class="account-title">passport issue date : </td>
                                            <td class="amount">
                                                <span>{{ self.timeZone_(orderDetail.orderAddressResp.passportIssueDate, self.$store.getters.getTimeZone) }}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </el-col>
                            <el-col :span="6">
                                <el-tabs v-model="tabs.status">
                                    <el-tab-pane label="状态明细" name="status"></el-tab-pane>
                                </el-tabs>
                                <table class="detail-table  add-width order-clearing" cellpadding="0" cellspacing="0"
                                       border="0" v-model="orderDetail">
                                    <tbody>
                                    <tr>
                                        <td class="account-title" style="width: 146px;">订单取消状态 : </td>
                                        <td class="amount"><span>{{ orderStatusResList[orderDetail.orderStatus] }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="account-title">库存扣减状态 : </td>
                                        <td class="amount"><span>{{ stockStatusResList[orderDetail.stockStatus] }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="account-title">支付状态 : </td>
                                        <td class="amount"><span
                                            style="color: red">{{ payStatusResList[orderDetail.payStatus] }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="account-title">配货状态 : </td>
                                        <td class="amount">
                                            <span style="color: red">{{ orderDetail.distributeStatusDesc }}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="account-title">物流状态 : </td>
                                        <td class="amount"><span
                                            style="color: red">{{ orderLogisticsStatusList[orderDetail.orderLogisticsStatus]}}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="account-title">评论状态 : </td>
                                        <td class="amount">
                                        <span>
                                           {{ orderInfoExtendResp.isCommented === 0 ? '未评论' : '已评论' }}
                                        </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="account-title">CASE状态 : </td>
                                        <td class="amount">
                                        <span>
                                           {{orderDetail.caseStatusDesc}}
                                        </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="account-title">RMA状态 : </td>
                                        <td class="amount"><span>{{orderDetail.rmaStatusDesc}}</span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </el-col>
                        </el-row>
                    </div>
                    <div id="track">
                        <el-tabs v-model="tabs.trackTabs">
                            <el-tab-pane label="订单轨迹" name="track"></el-tab-pane>
                        </el-tabs>
                        <table class="detail-table m-top add-width" cellpadding="0" cellspacing="0"
                               v-model="orderDetail" style="width: 30%">
                            <tbody>
                            <tr>
                                <td class="left-title" style="font-weight: bold">操作内容</td>
                                <td class="left-title" style="font-weight: bold">时间</td>
                            </tr>
                            <tr v-for="item in orderDetail.orderTrackRespList" :key="item.key">
                                <td class="left-title">
                                    <span class="track-content">{{ item.content }}</span>
                                </td>
                                <td class="left-title">{{self.timeZone_(item.time, self.$store.getters.getTimeZone)}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </el-col>
            <el-col :span="2">
                <div class="nav">
                    <div class="nav-item">
                        <a href="javascript: void(0);" class="js_base">基础信息</a>
                        <i class="triangle-icon"></i>
                    </div>
                    <div class="nav-item">
                        <a href="javascript: void(0);" class="js_sendInfo">发货信息</a>
                        <i class="triangle-icon"></i>
                    </div>
                    <div class="nav-item">
                        <a href="javascript: void(0);" class="js_goodsInfo">商品信息</a>
                        <i class="triangle-icon"></i>
                    </div>
                    <div class="nav-item">
                        <a href="javascript: void(0);" class="js_clearing">结算收货人状态</a>
                        <i class="triangle-icon"></i>
                    </div>
                    <div class="nav-item">
                        <a href="javascript: void(0);" class="js_track">订单轨迹</a>
                        <i class="triangle-icon"></i>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!--弹窗s-->
        <el-dialog title="预览" :visible.sync="preview.dialogVisible" size="tiny">
            <div class="preview-box">
                <img :src="preview.imgUrl" alt="图片预览" class="preview-img">
            </div>
        </el-dialog>

        <!--福袋弹窗 -->
        <el-dialog :title="luckyBag.title" :visible.sync="luckyBag.dialogVisible" size="large">
            <el-table ref="multipleTable" v-loading.body="this.luckyBag.tableLoading" :data="this.luckyBag.table" border tooltip-effect="dark">
                <el-table-column label="图片" header-align="center" align="center" min-width="150px">
                    <template scope="scope">
                        <img class="luckyBag-product-img" :src="domain + scope.row.goodsImage"/>
                    </template>
                </el-table-column>
                <el-table-column label="真实商品" header-align="center">
                    <template scope="scope">
                        <p>商品标题：<a :href="scope.row.goodsWebUrl" target="_blank"> {{scope.row.goodsTitle}} </a></p>
                        <p>商品属性：颜色：{{scope.row.color}} / 尺寸： {{scope.row.size}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="真实商品SKU" prop="goodsSn" align="center"></el-table-column>
                <el-table-column label="所在仓名称" prop="realWarehouseName" align="center"></el-table-column>
                <el-table-column label="单价" align="center">
                    <template scope="scope">
                        <span>$ {{ scope.row.price }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="qty" align="center"></el-table-column>
                <el-table-column label="SKU优惠分摊" align="center">
                    <template scope="scope">
                        -$ {{ scope.row.combinationDeductAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="SKU折后金额" align="center">
                    <template scope="scope">
                        $ {{ scope.row.goodsAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="所属店铺" align="center">
                    <template scope="scope">
                        {{ scope.row.shopInfo.shopName }}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!--SKU优惠分摊明细弹窗-->
        <el-dialog title="SKU优惠分摊明细" :visible.sync="apportionDetail.dialogVisible" size="large">
            <el-table ref="multipleTable" v-loading.body="this.apportionDetail.tableLoading" :data="this.apportionDetail.table" border tooltip-effect="dark">
                <el-table-column label="SKU" prop="goodsSn" align="center"></el-table-column>
                <el-table-column label="数量" prop="qty" align="center"></el-table-column>
                <el-table-column label="活动优惠" align="center">
                    <template scope="scope">
                        $ {{ scope.row.activityDeductAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="coupon优惠（平台承担）" align="center">
                    <template scope="scope">
                        $ {{ scope.row.couponPlatformAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="coupon优惠（店铺承担）" align="center">
                    <template scope="scope">
                        $ {{ scope.row.couponShopAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="积分优惠" align="center">
                    <template scope="scope">
                        $ {{ scope.row.integralDeductAmount }}
                    </template>
                </el-table-column>
                <el-table-column label="使用积分数" align="center">
                    <template scope="scope">
                        {{ scope.row.useDeductIntegral }}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!--弹窗e-->
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
                        goodsLabelName: '',
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
                self: this,

                orderStatusResList: ['正常', '用户取消', '系统取消', '运营取消', 'Oms取消', '取消申请中'],
                orderStatusSequResList: ['--', '待支付', '待配货(备货)', '待发货(完全配货)', '已删除', '已签收', '已取消', '申请退款', '已退款',
                 '退款中', '待签收(完全发货)', 'pending', '部分支付', '部分配货', '部分发货', '已评论'],
                orderTypeResList: ['线上', '线上付费会员（虚拟订单）', '线上电子产品（虚拟订单）', '线下订单' ],
                stockStatusResList: ['已扣除库存', '已释放库存'],
                isDropshippingResList: ['不是', '是'],
                platformResList: ['', 'WEB', 'WAP', 'IOS', 'ANDROID', 'PAD'],
                langList: {
                    'en': '英语',
                    'ja': '日语',
                    'fr': '法语',
                    'es': '西班牙语',
                    'ru': '俄语',
                    'pt': '葡语',
                    'it': '意大利语',
                    'de': '德语',
                },
                payStatusResList: ['未支付', '部分支付', 'pending', '已支付', '退款中', '已退款'],
                logisticsStatusList: ['已发货', '已更新', '已作废'],
                orderLogisticsStatusList: ['未发货', '部分发货', '完全发货', '手动确认收货', '系统超时确认收货'],
                tabs: {
                    sendInfoTabs: 'sendInfo',
                    goodsInfoTabs: 'goodsInfo',
                    trackTabs: 'track',
                    clearing: 'clearing',
                    consignee: 'consignee',
                    status: 'status',
                },
                orderInfoExtendResp: {},
                orderTrackRespList: [], //订单轨迹
                goodsList: [],
                preview: {
                    dialogVisible: false,
                    imgUrl: '',
                },

                //福袋参数
                luckyBag: {
                    dialogVisible: false,
                    sku: '',
                    title: '',
                    tableLoading: false,
                    table: [],
                },

                //分摊明细参数
                apportionDetail: {
                    dialogVisible: false,
                    table: [],
                    tableLoading: false
                },

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
            previewClick (url) {
                this.preview.dialogVisible = true;
                this.preview.imgUrl = url;
            },
            showOrderDetail () {
                var params = this.detailParams.userId ? this.detailParams : {orderSn: this.detailParams.orderSn};
                this.isShowList = false;
                this.isShowDetail = true;
                this.$http.get('order/index/detail', {params: params}).then(res => {
                    if (res.body.code === 0) {
                        console.log(res.body.data);
                        this.$nextTick(() => {
                            this.orderDetail = res.body.data.data;
                            this.goodsList = this.orderDetail.orderGoodsRespList;
                            this.orderTrackRespList = res.body.data.orderTrackRespList;
                            this.orderInfoExtendResp = Object.assign({}, res.body.data.data.orderInfoExtendResp);
                            //console.log(this.orderInfoExtendResp);
                        });
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
            addGryRow (){   //为 编辑订单删除 已作废  的行背景色设置成灰色
                setTimeout(function () {
                    var cellList = document.getElementsByClassName("cell");
                    if (cellList && cellList.length > 0) {
                        for (let i = 0; i < cellList.length; i++) {
                            var cell = cellList[i];
                            if (cell.innerHTML.indexOf('已作废') !== -1) {
                                var par = cell.parentNode.parentNode;
                                par.style.background = '#D9D9D8';
                            }
                        }
                    }
                }, 500);
            },

            lucyBagOpen (goodsSn, orderSn, orderGoodsId) {
                this.luckyBag.dialogVisible = true;
                this.luckyBag.title = `福袋商品信息（福袋SKU：${goodsSn}）`;
                let params = {
                    orderSn: orderSn,
                    orderGoodsId: orderGoodsId
                };
                console.log(params);
                this.luckyBag.tableLoading = true;
                this.$http.get('order/index/order-goods-combination', {params: params}).then(res => {
                    this.luckyBag.tableLoading = false;
                    if (res.body.code === 0) {
                        this.luckyBag.table = res.body.data;
                        this.luckyBag.table.forEach(item => {
                            let tempGoodsAttr = JSON.parse(item.goodsAttr);
                            item.color = tempGoodsAttr.color || '';
                            item.size = tempGoodsAttr.size || '';
                        });
                    } else {
                        this.luckyBag.table = [];
                    }
                });
            },

            apportionDetailOpen (orderGoodsId, orderSn) {
                this.apportionDetail.dialogVisible = true;
                let params = {
                    orderGoodsId: orderGoodsId,
                    orderSn: orderSn
                };
                this.apportionDetail.tableLoading = true;
                this.$http.get('order/index/order-goods-split', {params: params}).then(res => {
                    this.apportionDetail.tableLoading = false;
                    if (res.body.code === 0) {
                        this.apportionDetail.table = res.body.data;
                    } else {
                        this.apportionDetail.table = [];
                    }
                });

            },
        }
    }

    $(document).on('click', '.js_base', function () {
        let t = $('#base').offset().top;
        $('body,html').animate({
            'scrollTop': 0
        }, 500);
    });
    $(document).on('click', '.js_sendInfo', function () {
        let t = $('#sendInfo').offset().top;
        $('body,html').animate({
            'scrollTop': t - 2
        }, 500);
    });
    $(document).on('click', '.js_goodsInfo', function () {
        let t = $('#goodsInfo').offset().top;
        $('body,html').animate({
            'scrollTop': t - 2
        }, 500);
    });
    $(document).on('click', '.js_clearing', function () {
        let t = $('#clearing').offset().top;
        $('body,html').animate({
            'scrollTop': t - 2
        }, 500);
    });
    $(document).on('click', '.js_track', function () {
        let t = $('#track').offset().top;
        $('body,html').animate({
            'scrollTop': t - 2
        }, 500);
    });
</script>

<style lang="less" scoped>
    .goodsInfo {
        width: 88px;
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

        .order-clearing {
            border: none;
            td, th {
                border: none;
            }
            .account-title {
                text-align: right;
            }
            .amount {
                text-align: left;
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
                width: 10%;
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

    .luckyBag-product-img {
        width: 100%;
        height: 130px;
    }

    .nav {
        width: 160px;
        height: auto;
        position: fixed;
        top: 30%;
        right: 0;
        .nav-item {
            position: relative;
            text-align: right;
            margin-bottom: 10px;
            a {
                display: inline-block;
                width: 130px;
                text-align: center;
                color: #000;
                padding: 10px 0;
                border: 1px solid #ddd;
                border-left: 0;
            }
        ;
            .triangle-icon {
                position: absolute;
                z-index: -1;
                top: 6px;
                left: 14px;
                display: block;
                width: 27px;
                height: 27px;
                background-color: #fff;
                transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                -webkit-transform: rotate(45deg);
                border: 1px solid #ddd;
                border-top: 0;
                border-right: 0;
            }
        }
    }

    .preview-box, .preview-img {
        width: 530px;
        height: 430px;
    }

    .track-content {
        display: inline-block;
        max-width: 200px;
        text-align: left;
        word-wrap: break-word;
        word-break: normal;
    }
</style>
