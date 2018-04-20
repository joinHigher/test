<!--GB订单列表-->
<template>
    <div>
        <div class="el-container order-list">
            <el-form label-width="200px" :inline="true" :model="option" ref="searchForm" :label-position="labelPosition" class="search-form">
                <el-form-item label="订单号" labelWidth="100px" prop="orderSn">
                    <el-input v-model="option.orderSn" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item label="联合订单号" prop="parentOrderSn">
                    <el-input v-model="option.parentOrderSn" placeholder="请输入联合订单号"></el-input>
                </el-form-item>
                <el-form-item label="订单状态" class="order-currency-box">
                    <el-input readonly @focus="orderStatusFocus" v-model="orderStatusChecked" icon="close"
                              :on-icon-click="orderStatusHandleIconClick" placeholder="全部"
                              class="order-currencyBox-show"></el-input>
                    <div class="filter-box" v-show="orderStatusBoxShow">
                        <el-transfer filterable v-model="option.orderStatusUnionList" :titles="['订单状态待选项', '订单状态被选项']" :data="orderStatuses"></el-transfer>
                        <div class="text-right footer-btn">
                            <el-button type="primary" @click="orderStatusConfirm">确定</el-button>
                            <el-button type="danger" @click="orderStatusCancel">取消</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="支付状态">
                    <el-select v-model="option.payStatus" placeholder="请选择支付状态" clearable class="select-item">
                        <el-option v-for="(item, index) in payStatuses" :key="index" :value="item.statusCode" :label="item.statusText"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <div class="email-uid-form">
                        <el-row>
                            <el-col :span="7">
                                <el-select v-model="emailOrUid" @change="emailOrUidChange" class="email-or-uid">
                                    <el-option v-for="(item, index) in emailOrUidList" :key="index" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="15" class="email-uid-box">
                                <el-input v-if="emailOrUid === '1'" v-model="option.email" placeholder="请输入注册邮箱"></el-input>
                                <el-input v-if="emailOrUid === '2'" v-model="option.userId" placeholder="请输入用户ID"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
                <el-form-item label="订单币种" class="order-currency-box">
                    <el-input readonly @focus="orderCurrencyFocus" v-model="orderCurrencyChecked" icon="close"
                              :on-icon-click="orderHandleIconClick" placeholder="请选择订单币种" class="order-currencyBox-show">
                    </el-input>
                    <div class="filter-box" v-show="orderCurrencyBoxShow">
                        <el-transfer filterable v-model="option.orderCurrencyList" :titles="['订单币种待选项', '订单币种被选项']" :data="currencys"></el-transfer>
                        <div class="text-right footer-btn">
                            <el-button type="primary" @click="currencyConfirm">确定</el-button>
                            <el-button type="danger" @click="currencyCancel">取消</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="订单类型">
                    <el-select v-model="option.orderType" placeholder="请选择订单类型" clearable class="select-item">
                        <el-option v-for="(item, index) in orderTypes" :key="index" :value="item.typeCode" :label="item.typeName"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="国家站渠道" class="order-currency-box">
                    <el-input readonly @focus="courtryPipeFocus" v-model="courtryPipeChecked" icon="close"
                              :on-icon-click="courtryPipeHandleIconClick" placeholder="请选择渠道"
                              class="order-currencyBox-show">
                    </el-input>
                    <div class="filter-box courtryPipe-box" v-show="courtryPipeBoxShow">
                        <el-transfer filterable v-model="option.pipelineCodeList" :titles="['渠道待选项', '渠道被选项']" :data="courtryPipeList"></el-transfer>
                        <div class="text-right footer-btn">
                            <el-button type="primary" @click="courtryPipeConfirm">确定</el-button>
                            <el-button type="danger" @click="courtryPipeCancel">取消</el-button>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="订单设备来源" style="margin-left: -100px">
                    <el-select placeholder="请选择订单设备来源" v-model="option.platform" clearable class="select-item">
                        <el-option v-for="(item, index) in platformList" :key="index" :value="item.typeCode" :label="item.typeName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式" labelWidth="100px" class="order-currency-box" style="margin-left: 100px">
                    <el-input readonly @focus="payChannelFocus" v-model="payChannelChecked" icon="close"
                              :on-icon-click="payChannelHandleIconClick" placeholder="请选择支付方式"
                              class="order-currencyBox-show">
                    </el-input>
                    <div class="filter-box" v-show="payChannelBoxShow">
                        <el-transfer filterable v-model="option.payChannelList" :titles="['支付方式待选项', '支付方式被选项']" :data="payChannelList"></el-transfer>
                        <div class="text-right footer-btn">
                            <el-button type="primary" @click="payChannelConfirm">确定</el-button>
                            <el-button type="danger" @click="payChannelCancel">取消</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="使用coupon码">
                    <el-input v-model="option.couponCode"></el-input>
                </el-form-item>
                <el-form-item label="使用物流coupon码">
                    <el-input v-model="option.logisticsCouponCode"></el-input>
                </el-form-item>
                <el-form-item label="含预售订单" style="margin-left: -100px">
                    <el-select v-model="option.isPreSold" class="select-item" clearable>
                        <el-option v-for="(item, index) in isPreSoldList" :label="item.name" :value="item.code" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="测试订单" labelWidth="100px" style="margin-left: 100px">
                    <el-select v-model="option.isTest" clearable class="select-item">
                        <el-option v-for="(item, index) in isTestList" :key="index" :value="item.code" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订金应付金额">
                    <el-row class="order-money-box">
                        <el-col :span="10">
                            <el-input v-model="option.minOrderAmount"></el-input>
                        </el-col>
                        <el-col :span="4" class="order-money-gap"><span>到</span></el-col>
                        <el-col :span="10">
                            <el-input v-model="option.maxOrderAmount"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <br/>
                <el-form-item label="">
                    <div>
                        <el-row>
                            <el-col :span="5" style="width: 130px; margin-right: 10px;">
                                <el-select v-model="payTimeOrOrderTime">
                                    <el-option v-for="(item, index) in payTimeOrOrderTimeList" :key="index" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="16" class="email-uid-box" v-if="payTimeOrOrderTime=== '1'">
                                <el-date-picker v-model="payTime" type="datetimerange" placeholder="选择支付完成时间"
                                                :editable="false" @change="payTimeSaveLocal(payTime)">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="16" class="email-uid-box" v-if="payTimeOrOrderTime=== '2'">
                                <el-date-picker v-model="orderTime" type="datetimerange" placeholder="选择订单创建时间"
                                                :editable="false"
                                                :clearable="false" popper-class="create-time"
                                                @change="orderTimeSaveLocal(orderTime)"></el-date-picker>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
            </el-form>

            <el-tabs v-model="activeName" class="advanced-Search-title  search-tab-pane" @tab-click="arrowDown = !arrowDown">
                <div class="text-right icons-box">
                    <i class="el-icon-arrow-down arrow-icon" v-if="arrowDown" @click="arrowDown = !arrowDown"></i>
                    <i class="el-icon-arrow-up arrow-icon" v-if="!arrowDown" @click="arrowDown = !arrowDown"></i>
                </div>
                <el-tab-pane label="使用基本搜索" name="advancedSearch" v-if="!arrowDown"></el-tab-pane>
                <el-tab-pane label="使用高级搜索" name="advancedSearch" v-if="arrowDown"></el-tab-pane>
            </el-tabs>

            <div class="advancedSearchBox" v-if="!arrowDown">
                <h4><span>物流信息</span></h4>
                <el-form label-width="200px" :inline="true" :model="option" ref="searchForm" :label-position="labelPosition" class="search-form">
                    <el-form-item label=" " labelWidth="100px" class="logistics-info  logistics-info-margin">
                        <div class="logistics-info-item">
                            <div>
                                <el-select v-model="logisticsNameOrCode" class="select-item" @change="getLogisticsCodes = ''">
                                    <el-option v-for="(item, index) in logisticsNameOrCodeList" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div class="logistics-info-gap">:</div>
                            <div v-if="logisticsNameOrCode === '1'">
                                <el-select v-model="getLogisticsCodes" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in logisticsTypeList1" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div v-if="logisticsNameOrCode === '2'">
                                <el-select v-model="getLogisticsCodes" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in logisticsTypeList2" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="logistics-info-item">
                            <div>
                                <el-select v-model="logisticsGroupNameOrCode" class="select-item" @change="getLogisticsGroupId = ''">
                                    <el-option v-for="(item, index) in logisticsGroupOrCodeList" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div class="logistics-info-gap">:</div>
                            <div v-if="logisticsGroupNameOrCode === '1'">
                                <el-select v-model="getLogisticsGroupId" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in logisticsGroupList1" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div v-if="logisticsGroupNameOrCode === '2'">
                                <el-select v-model="getLogisticsGroupId" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in logisticsGroupList2" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <h4><span>SKU信息</span></h4>
                <el-form label-width="200px" :inline="true" :model="option" ref="searchForm" :label-position="labelPosition" class="search-form  sku-info-margin">
                    <el-form-item label="商品SKU" labelWidth="100px">
                        <el-input v-model="option.advancedSearchReq.goodsSn" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label=" " class="logistics-info">
                        <div class="logistics-info-item  saleWareName-or-code">
                            <div>
                                <el-select v-model="saleWareNameOrCode" class="select-item" @change="getWarehouseCode = ''">
                                    <el-option v-for="(item, index) in saleWareNameOrCodeList" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div class="logistics-info-gap">:</div>
                            <div v-if="saleWareNameOrCode === '1'">
                                <el-select v-model="getWarehouseCode" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in saleWareList1" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div v-if="saleWareNameOrCode === '2'">
                                <el-select v-model="getWarehouseCode" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in saleWareList2" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="logistics-info-item">
                            <div>
                                <el-select v-model="realWareNameOrCode" class="select-item" @change="getWealWarehouseCode = ''">
                                    <el-option v-for="(item, index) in realWareNameOrCodeList" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div class="logistics-info-gap">:</div>
                            <div v-if="realWareNameOrCode === '1'">
                                <el-select v-model="getWealWarehouseCode" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in realWareList1" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div v-if="realWareNameOrCode === '2'">
                                <el-select v-model="getWealWarehouseCode" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in realWareList2" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="" class="logistics-info shop-info">   <!--0.95-->
                        <div class="logistics-info-item">
                            <div>
                                <el-select v-model="shopNameOrCode" class="select-item" @change="getShopCode = ''">
                                    <el-option v-for="(item, index) in shopNameOrCodeList" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div class="logistics-info-gap">:</div>
                            <div v-if="shopNameOrCode === '1'">
                                <el-select v-model="getShopCode" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in shopList1" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                            <div v-if="shopNameOrCode === '2'">
                                <el-select v-model="getShopCode" class="select-item" filterable clearable>
                                    <el-option v-for="(item, index) in shopList2" :label="item.name" :value="item.code" :key="index"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <h4><span>收货信息</span></h4>
                <el-form label-width="100px" :inline="true" :model="option" ref="searchForm"
                         :label-position="labelPosition" class="search-form address-info-margin">
                    <el-form-item label="所在国家" class="order-currency-box">
                        <el-input readonly @focus="getCountrysFocus" v-model="getCountrysChecked" icon="close" :on-icon-click="getCountrysHandleIconClick"
                                  placeholder="请选择国家" class="order-currencyBox-show">
                        </el-input>
                        <div class="filter-box" v-show="getCountrysShow">
                            <el-transfer filterable v-model="getCountrysList" :titles="['国家待选项', '国家被选项']" :data="countryList"></el-transfer>
                            <div class="text-right footer-btn">
                                <el-button type="primary" @click="getCountrysConfirm">确定</el-button>
                                <el-button type="danger" @click="getCountrysCancel">取消</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="所在的州">
                        <el-select v-model="getProvinceList" placeholder="请选择州" clearable filterable class="select-item"
                                   :disabled="countryCountIsOne">
                            <el-option v-for="(item, index) in provinceNameAndCodeList" :label="item.name"
                                       :value="item.name" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所在的市">
                        <el-input v-model="option.advancedSearchReq.city" placeholder="" :disabled="countryCountIsOne"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" :disabled="countryCountIsOne">
                        <el-input v-model="address" placeholder="" :disabled="countryCountIsOne"></el-input>
                    </el-form-item>
                    <el-form-item label="邮编" labelWidth="100px">
                        <el-input v-model="option.advancedSearchReq.postalCode" placeholder="" :disabled="countryCountIsOne"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="option.advancedSearchReq.phone" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="option.advancedSearchReq.email" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="收货人名">
                        <el-input v-model="option.advancedSearchReq.firstName" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="收货人姓">
                        <el-input v-model="option.advancedSearchReq.lastName" placeholder=""></el-input>
                    </el-form-item>
                </el-form>
                <h4><span>订单状态</span></h4>
                <el-form label-width="150px" :inline="true" :model="option" ref="searchForm"
                         :label-position="labelPosition" class="search-form">
                    <el-form-item label="订单取消状态" labelWidth="100px">
                        <el-select v-model="option.advancedSearchReq.orderStatus" placeholder="请选择" filterable clearable class="select-item">
                            <el-option v-for="(item, index) in orderStatusList" :label="item.name" :value="item.code" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单支付状态">
                        <el-select v-model="option.advancedSearchReq.payStatus" placeholder="请选择" filterable clearable class="select-item">
                            <el-option v-for="(item, index) in payStatusList" :label="item.name" :value="item.code" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单物流状态">
                        <el-select v-model="option.advancedSearchReq.orderLogisticsStatus" placeholder="请选择" filterable clearable class="select-item">
                            <el-option v-for="(item, index) in orderLogisticsStatusList" :label="item.name" :value="item.code" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单配货状态">
                        <el-select v-model="option.advancedSearchReq.distributeStatus" placeholder="请选择" filterable clearable class="select-item">
                            <el-option v-for="(item, index) in distributeStatusList" :label="item.name" :value="item.code" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="CASE状态" labelWidth="100px">
                        <el-select v-model="option.advancedSearchReq.caseStatus" placeholder="请选择" filterable clearable class="select-item">
                            <el-option v-for="(item, index) in caseStatusList" :label="item.name" :value="item.code" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="RMA状态">
                        <el-select v-model="option.advancedSearchReq.rmaStatus" placeholder="请选择" filterable clearable class="select-item">
                            <el-option v-for="(item, index) in rmaStatusList" :label="item.name" :value="item.code" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <div class="text-right buttons-box">
                <el-button type="primary" @click="searchBtnClick" size="large">查询</el-button>
                <el-button type="danger" @click="resetForm" size="large">重置</el-button>
            </div>
            <!--订单排序-->
            <div>
                <el-form :inline="true" :label-position="labelPosition" class="search-form">
                    <el-form-item label="订单排序：">
                        <el-select v-model="orderSortCond" placeholder="请选择订单排序规则" clearable class="select-item" @change="orderSortChange(orderSortCond)">
                            <el-option v-for="(item, index) in orderSortList" :label="item.name" :value="item.code" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <div class="order-table">
                <el-table ref="multipleTable" :data="orderData" border tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
                    <el-table-column prop="orderSn" label="订单号" header-align="center" width="280px">
                        <template scope="scope">
                            <div>
                                <span>订单号：</span>
                                <router-link :to="{name: 'order_orderDetail_gb', query: {orderSn: scope.row.orderSn}}">
                                    {{scope.row.orderSn}}
                                </router-link>
                            </div>
                            <div>
                                <span>联合订单号：</span>
                                <a class="@color-blue link-text"
                                   @click="showUnionOrder(scope.row.parentOrderSn)">{{scope.row.parentOrderSn}}</a>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="注意事项" align="center">
                        <template scope="scope">
                            <el-tag type="danger" v-if="scope.row.caseStatus ===1">CASE</el-tag>
                            <el-tag type="warning" v-if="scope.row.rmaStatus === 1 || scope.row.rmaStatus === 2">RMA</el-tag>
                            <el-tag type="gray" v-if="scope.row.isTest === 1">测试</el-tag>
                            <el-tag type="primary" v-if="scope.row.isPreSold === 1">预售</el-tag>
                            <el-tag type="success" v-if="scope.row.platform === 1">WEB</el-tag>
                            <el-tag type="success" v-if="scope.row.platform === 2">WAP</el-tag>
                            <el-tag type="success" v-if="scope.row.platform === 3">IOS</el-tag>
                            <el-tag type="success" v-if="scope.row.platform === 4">Android</el-tag>
                            <el-tag type="success" v-if="scope.row.platform === 5">PAD</el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column label="时间信息" header-align="center" width="100px" prop="completedTime">
                        <template scope="scope">
                            <div class="red-color">
                                <p>下单：</p>
                                <div style="width: 80px; margin: 0 auto">
                                    {{self.timeZone_(scope.row.createdTime, self.$store.getters.getTimeZone)}}
                                </div>
                            </div>
                            <div>
                                <p>支付：</p>
                                <div style="width: 80px; margin: 0 auto">
                                    {{self.timeZone_(scope.row.completedTime, self.$store.getters.getTimeZone)}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="收货人信息" header-align="center" min-width="200px">
                        <template scope="scope">
                            <p>{{scope.row.orderAddressResp.firstName}} {{scope.row.orderAddressResp.lastName}}:</p>
                            <span class="red-color">{{scope.row.orderAddressResp.country}} </span> >
                            <span>{{scope.row.orderAddressResp.province}} </span> >
                            <span>{{scope.row.orderAddressResp.city}} </span> >
                            <span>{{scope.row.orderAddressResp.addressLine1}} </span>
                            <span> ; </span>
                            <span>{{scope.row.orderAddressResp.addressLine2}} </span>
                            <span
                                v-if="scope.row.orderAddressResp.addressLine3"> / {{scope.row.orderAddressResp.addressLine3}} </span>
                            <span
                                v-if="scope.row.orderAddressResp.addressLine4"> ; {{scope.row.orderAddressResp.addressLine4}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="email" label="注册邮箱" header-align="center" align="left" width="110px">
                        <template scope="scope">
                            <router-link
                                :to="{name: 'member_memberInfo', query: {userId: scope.row.userIdStr,tab: 'order'}}">
                                {{scope.row.email}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="（子）订单应付金额" prop="orderAmount" header-align="center" min-width="120px">
                        <template scope="scope">
                            <p>商品: ${{scope.row.goodsAmount}}</p>
                            <p>运费: ${{scope.row.shippingAmount}}</p>
                            <p>保险费: ${{scope.row.insuranceAmount}}</p>
                            <p>总优惠: ${{scope.row.totalDeductAmount }}</p>
                            <p class="red-color">应付:${{scope.row.orderAmount}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单状态" header-align="center">
                        <template scope="scope">
                            {{orderStatusSequList[scope.row.orderStatusSequ]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="支付信息" header-align="center" align="left" width="120px">
                        <template scope="scope">
                            <p>币种: {{scope.row.orderCurrency}}</p>
                            <p>支付方式：{{scope.row.payChannel}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="couponCode" label="coupon码" header-align="center"></el-table-column>
                    <el-table-column label="指定物流" header-align="center" align="left" width="120px">
                        <template scope="scope">
                            <p v-if="scope.row.logisticsCode">物流方式: {{ scope.row.logisticsCode }}</p>
                            <p v-if="scope.row.logisticsGroupId">
                                物流分组: {{ logisticsGroupBackArr[scope.row.logisticsGroupId] }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="仓信息" header-align="center">
                        <template scope="scope">
                            <p>销售仓: {{scope.row.warehouseInfoResp.warehouseCode}}</p>
                            <p>真实仓:
                                <span
                                    v-for="item in scope.row.warehouseInfoResp.realWarehouseCodeList">{{ realWareBackArr[item]
                                    }}&nbsp;&nbsp;</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" header-align="center" align="center" min-width="110px">
                        <template scope="scope">
                            <el-button v-if="scope.row.isCancel && self.showAction_('order/index/cancel')" class="@color-blue" type="text"
                                       @click="showCancelDialog(scope.row.parentOrderSn, scope.row.userIdStr, scope.row.payStatus, scope.row)">
                                       取消订单
                            </el-button>
                            <el-button class="@color-blue" type="text"
                                       @click="showPayRecord(scope.row.orderSn,scope.row.parentOrderSn)"
                                       v-if="self.showAction_('order/index/pay-record')">
                                       查看支付记录
                            </el-button>
                            <el-button class="@color-blue" type="text" @click="showLog(scope.row.orderSn)"
                                       v-if="self.showAction_('order/index/order-log')">
                                       查看操作日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="el-container last text-right">
                <div style="float: left; margin-top: 10px;">
                    本页订单金额: <span class="red-color">$ {{pageTotalAmount}}</span>
                    <span v-if="total<2000">
                    ,&nbsp;&nbsp;所有订单金额:
                    <span class="red-color">$ {{totalAmount || '0.00'}}</span>
                </span>
                </div>
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
                <el-table-column property="channelCode" label="付款渠道" header-align="center" align="center" width="120px"></el-table-column>
                <el-table-column property="payCurrencyAmount" label="付款金额" header-align="center" align="center" width="165px">
                    <template scope="scope">
                        ${{scope.row.payCurrencyAmount}}
                    </template>
                </el-table-column>
                <el-table-column property="currencyCode" label="付款币种" header-align="center" align="center" width="100px"></el-table-column>
                <el-table-column label="状态" header-align="center" align="center" width="110px">
                    <template scope="scope">
                        <span v-if="scope.row.payStatus === 0">未支付</span>
                        <span v-if="scope.row.payStatus === 1">处理中</span>
                        <span v-if="scope.row.payStatus === 2">已支付</span>
                        <span v-if="scope.row.payStatus === 3">退款中</span>
                        <span v-if="scope.row.payStatus === 4">退款成功</span>
                        <span v-if="scope.row.payStatus === 5">退款失败</span>
                        <span v-if="scope.row.payStatus === 6">支付失败</span>
                    </template>
                </el-table-column>
                <el-table-column property="refundTypeDesc" label="退款方式" header-align="center" align="center" width="100px"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="联合订单号" :visible.sync="unionDialogVisible" size="tiny" class="order-list">
            <table class="union-table" cellpadding="0" cellspacing="0" v-model="unionPrices">
                <tbody>
                <tr>
                    <td>商品应付总金额</td>
                    <td class="table-text red-color"> $ <span>{{unionPrices.goodsAmount}}</span></td>
                </tr>
                <tr>
                    <td>活动折扣</td>
                    <td class="table-text"> -$ <span>{{unionPrices.discountAmount}}</span></td>
                </tr>
                <tr>
                    <td>coupon折扣</td>
                    <td class="table-text"> -$ <span>{{unionPrices.couponDeductAmount}}</span></td>
                </tr>
                <tr>
                    <td>积分折扣</td>
                    <td class="table-text"> -$ <span>{{unionPrices.integralDeductAmount}}</span></td>
                </tr>
                <tr>
                    <td>运费</td>
                    <td class="table-text red-color"> $ <span>{{unionPrices.shippingAmount}}</span></td>
                </tr>
                <tr>
                    <td>运费coupon折扣</td>
                    <td class="table-text"> -$ <span>{{unionPrices.logisticsCouponDeductAmount}}</span></td>
                </tr>
                <tr>
                    <td>保险费</td>
                    <td class="table-text red-color"> $ <span>{{unionPrices.insuranceAmount}}</span></td>
                </tr>
                <tr>
                    <td>支付折扣</td>
                    <td class="table-text"> -$ <span>{{unionPrices.payDeductAmount}}</span></td>
                </tr>
                <tr>
                    <td>联合订单应付总金额</td>
                    <td class="table-text red-color"> $ <span>{{unionPrices.orderAmount}}</span></td>
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
                self: this,
                option: {
                    orderSn: '', //订单号
                    parentOrderSn: '', //联合订单号
                    orderStatusUnionList: [], //订单状态
                    payStatus: '', //支付状态
                    email: '', //注册邮箱
                    userId: '', //用户ID
                    orderCurrencyList: [],// //订单币种
                    orderType: '', //订单类型
                    platform: '',//订单设备来源
                    payChannelList: [], //支付方式
                    couponCode: '', //使用coupon码
                    logisticsCouponCode: '', //使用物流coupon码
                    isPreSold: '', //含预售订单
                    isTest: '', //测试订单
                    minOrderAmount: '',//订金应付金额 起
                    maxOrderAmount: '',//订金应付金额 止
                    completedStartTime: '',//支付完成时间 起
                    completedEndTime: '', //支付完成时间 止
                    createStartTime: '',//订单创建时间 起
                    createEndtime: '',//订单创建时间 止
                    pipelineCodeList: [], //渠道编码
                    pageNum: 1,
                    pageSize: 10,
                    //高级查询条件
                    advancedSearchReq: {
                        logisticsCodeList: [], //物流方式名/物流方式编码
                        logisticsGroupIdList: [], //物流分组名/物流分组ID(统一传logistics_group_id)
                        goodsSn: '', //商品Sku
                        warehouseCodeList: [],//销售仓名称/销售仓编码(统一传warehouseCode)
                        realWarehouseCodeList: [],//真实仓名称/真实仓编码(统一传warehouseCode)
                        shopCode: '',
                        countryCodeList: [], //所在国家(传code值)
                        provinceList: [], //省/区/洲(传名称)
                        city: '', // 市
                        addressLineList: [],//地址
                        email: '', //邮箱 (后台需加密传到数据库)
                        phone: '',
                        postalCode: '',
                        firstName: '',
                        lastName: '',
                        orderStatus: '', //订单取消状态
                        payStatus: '', //订单支付状态
                        orderLogisticsStatus: '', //订单物流状态
                        distributeStatus: '', //订单配货状态
                        caseStatus: '', //CASE状态
                        rmaStatus: '', //RMA状态
                    },
                },
                countryCountIsOne: false, // 所在国家的数量是否大于 1 个
                logisticsNameOrCode: '1', //物流信息查询条件 物流名称或物流编码
                logisticsTypeList1: [],  //物流方式(存物流名称,物流编码)
                logisticsTypeList2: [],  //物流方式(存物流编码,物流编码)
                logisticsTypeBackArr: [],

                logisticsGroupNameOrCode: '1', //物流信息查询条件 物流分组或物流分组ID
                logisticsGroupList1: [],  //物流分组（name,code）
                logisticsGroupList2: [], //物流分组（code,code）
                logisticsGroupBackArr: [],

                saleWareNameOrCode: '1', //销售仓信息查询条件 销售仓名称或编码
                saleWareList1: [],  //销售仓(name,code)
                saleWareList2: [], //销售仓(code,code)

                realWareNameOrCode: '1', //真实仓信息查询条件 真实仓名称或编码
                realWareList1: [],  //真实仓(name,code)
                realWareList2: [], //真实仓(code,code)
                realWareBackArr: [],

                shopNameOrCode: '1', //所在店铺信息查询条件  所在店铺名称或编码
                shopList1: [],  //店铺(name, code)
                shopList2: [], //店铺(code, name)
                provinceNameAndCodeList: [], //省
                orderTime: '', //订单创建时间
                payTime: '', //支付完成时间
                orderStatuses: [
                    {key: 1, label: '待支付'},
                    {key: 2, label: '待配货(备货)'},
                    {key: 3, label: '待发货(完全配货)'},
                    {key: 4, label: '已删除'},
                    {key: 5, label: '已签收'},
                    {key: 6, label: '已取消'},
                    {key: 7, label: '申请退款'},
                    {key: 8, label: '已退款'},
                    {key: 9, label: '退款中'},
                    {key: 10, label: '待签收(完全发货)'},
                    {key: 11, label: 'pending'},
                    {key: 12, label: '部分支付'},
                    {key: 13, label: '部分配货'},
                    {key: 14, label: '部分发货'},
                    {key: 15, label: '已评论'}
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
                platformList: [  //订单设备来源选项
                    {typeCode: '', typeName: '全部'},
                    {typeCode: 1, typeName: 'WEB'},
                    {typeCode: 2, typeName: 'WAP'},
                    {typeCode: 3, typeName: 'IOS'},
                    {typeCode: 4, typeName: 'Android'},
                    {typeCode: 5, typeName: 'PAD'},
                ],
                //支付方式选项
                payChannelList: [],

                //国家站渠道选项
                courtryPipeList: [],

                //含预售订单选项
                isPreSoldList: [
                    {code: '', name: '全部'},
                    {code: '0', name: '不包含'},
                    {code: '1', name: '包含'}
                ],
                //测试订单选项
                isTestList: [
                    {code: '', name: '全部'},
                    {code: '1', name: '测试订单'},
                    {code: '0', name: '非测试订单'}
                ],

                //物流信息 物流方式 选项
                logisticsNameOrCodeList: [
                    {code: '1', name: '物流方式名称'},
                    {code: '2', name: '物流方式编码'}
                ],

                //物流信息 物流分组 选项
                logisticsGroupOrCodeList: [
                    {code: '1', name: '物流分组名称'},
                    {code: '2', name: '物流分组ID'}
                ],

                //SKU信息 销售仓选项
                saleWareNameOrCodeList: [
                    {code: '1', name: '销售仓名称'},
                    {code: '2', name: '销售仓编码'}
                ],

                //SKU信息 真实仓选项
                realWareNameOrCodeList: [
                    {code: '1', name: '真实仓名称'},
                    {code: '2', name: '真实仓编码'}
                ],

                //SKU信息 所在店铺选项
                shopNameOrCodeList: [
                    {code: '1', name: '所在店铺名称'},
                    {code: '2', name: '所在店铺编码'}
                ],

                //订单取消状态 选项
                orderStatusList: [
                    {code: 0, name: '正常'},
                    {code: 1, name: '用户取消'},
                    {code: 2, name: '系统取消'},
                    {code: 3, name: '运营取消'},
                    {code: 4, name: 'OMS取消'},
                    {code: 5, name: '取消申请中'}
                ],

                //订单支付状态 选项
                payStatusList: [
                    {code: 0, name: '未支付'},
                    {code: 1, name: '部分支付'},
                    {code: 2, name: 'pending'},
                    {code: 3, name: '已支付'},
                    {code: 4, name: '退款中'},
                    {code: 5, name: '已退款'}
                ],

                //订单物流状态 选项
                orderLogisticsStatusList: [
                    {code: 0, name: '未发货'},
                    {code: 1, name: '部分发货'},
                    {code: 2, name: '完全发货'},
                    {code: 3, name: '手动确认收货'},
                    {code: 4, name: '系统超时确认收货'}
                ],

                //订单配货状态 选项
                distributeStatusList: [
                    {code: 0, name: '未配货'},
                    {code: 1, name: '部分配货'},
                    {code: 2, name: '完全配货'}
                ],

                //CASE状态 选项
                caseStatusList: [
                    {code: 0, name: '正常'},
                    {code: 1, name: '处理中'},
                    {code: 2, name: '已完成'},
                    {code: 3, name: '已关闭'}
                ],

                //RMA状态 选项
                rmaStatusList: [
                    {code: 0, name: '正常'},
                    {code: 1, name: '未处理'},
                    {code: 2, name: '处理中'},
                    {code: 3, name: '处理完成'},
                    {code: 4, name: '已取消'}
                ],

                emailOrUidList: [
                    { code: '1', name: '注册邮箱' },
                    { code: '2', name: 'User ID' }
                ],
                emailOrUid: '1',

                payTimeOrOrderTimeList: [
                    { code: '1', name: '支付完成时间' },
                    { code: '2', name: '订单创建时间' }
                ],
                payTimeOrOrderTime: '1',

                countriesArr: [],
                orderData: [],

                cancelParam: {
                    parentOrderSn: '',
                    userId: '',
                    payStatus: '',
                    reason: '',
                },
                currenCanceleRow: {},
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
                tableLoading: false,
                labelPosition: 'right',
                total: 10,
                totalAmount: 0,
                pageTotalAmount: 0,
                selectOrderSn: '',
                currencys: [], //币种
                countryList: [],
                getCountrysList: [],
                address: '', //地址(addressLine1/addressLine2)
                getLogisticsCodes: '',
                getLogisticsGroupId: '',
                getWarehouseCode: '',
                getWealWarehouseCode: '',
                getShopCode: '',
                getProvinceList: '',

                //高级搜索参数
                activeName: 'advancedSearch',
                arrowDown: true, //箭头方向参数

                //订单状态返回值
                orderStatusSequList: ['--', '待支付', '待配货(备货)', '待发货(完全配货)', '已删除', '已签收', '已取消', '申请退款', '已退款',
                    '退款中', '待签收(完全发货)', 'pending', '部分支付', '部分配货', '部分发货', '已评论'],
                //case状态返回值
                caseStatusListForTb: ['正常', '处理中', '已完成', '已关闭'],

                //订单排序
                orderSortList: [
                    {code: '1', name: '下单时间倒序'},
                    {code: '2', name: '下单时间正序'},
                    {code: '3', name: '支付时间倒序'},
                    {code: '4', name: '支付时间正序'},
                    {code: '5', name: '子订单应付金额倒序'},
                    {code: '6', name: '子订单应付金额正序'}
                ],
                orderSortCond: '',

                //查询条件选项框参数
                orderCurrencyBoxShow: false,
                orderCurrencyChecked: '',

                orderStatusBoxShow: false,
                orderStatusChecked: '',

                payChannelBoxShow: false,
                payChannelChecked: '',

                getCountrysShow: false,
                getCountrysChecked: '',

                courtryPipeBoxShow: false,
                courtryPipeChecked: ''
            };
        },
        created () {
            this.getLogisticsTypeList();
            this.getLoginsticsGrounpList();
            this.getCurrencysAndCountryList();
            this.getPayChannelList();
            this.getSalesWare();
            this.getRealWare();
            this.getPipe();
            this.getShopList();
            this.initSearch();
            this.getData();

            let that = this;
            let body = document.querySelector('body');
            body.addEventListener('click', function (e) {
                let elem = e.target || e.srcElement;
                while (elem) {
                    let elemClassName = elem.className;
                    if (elemClassName && ((elemClassName.indexOf('order-currencyBox-show') !== -1) || (elemClassName.indexOf('filter-box') !== -1))) {
                        return false;
                    }
                    elem = elem.parentNode;
                }
                that.orderCurrencyBoxShow = false;
                that.orderStatusBoxShow = false;
                that.payChannelBoxShow = false;
                that.getCountrysShow = false;
                that.courtryPipeBoxShow = false;
            })
        },

        watch: {
            'option.orderStatusUnionList': function (val, oldval) {
                if (val.length > 0) {
                    this.option.payStatus = '';
                    this.option.advancedSearchReq.orderStatus = '';
                    this.option.advancedSearchReq.payStatus = '';
                    this.option.advancedSearchReq.orderLogisticsStatus = '';
                    this.option.advancedSearchReq.distributeStatus = '';
                    this.option.advancedSearchReq.caseStatus = '';
                    this.option.advancedSearchReq.rmaStatus = '';
                }
            },
            'option.payStatus': function (val, oldval) {
                if (val) {
                    this.option.orderStatusUnionList = [];
                    this.option.advancedSearchReq.orderStatus = '';
                    this.option.advancedSearchReq.payStatus = '';
                    this.option.advancedSearchReq.orderLogisticsStatus = '';
                    this.option.advancedSearchReq.distributeStatus = '';
                    this.option.advancedSearchReq.caseStatus = '';
                    this.option.advancedSearchReq.rmaStatus = '';
                    this.orderStatusChecked = '';
                }
            },
            'option.advancedSearchReq.orderStatus': function (val, oldval) {
                if (val !== '') {
                    this.option.payStatus = '';
                    this.option.orderStatusUnionList = [];
                    this.orderStatusChecked = '';
                }
            },
            'option.advancedSearchReq.payStatus': function (val, oldval) {
                if (val !== '') {
                    this.option.payStatus = '';
                    this.option.orderStatusUnionList = [];
                    this.orderStatusChecked = '';
                }
            },
            'option.advancedSearchReq.orderLogisticsStatus': function (val, oldval) {
                if (val !== '') {
                    this.option.payStatus = '';
                    this.option.orderStatusUnionList = [];
                    this.orderStatusChecked = '';
                }
            },
            'option.advancedSearchReq.distributeStatus': function (val, oldval) {
                if (val !== '') {
                    this.option.payStatus = '';
                    this.option.orderStatusUnionList = [];
                    this.orderStatusChecked = '';
                }
            },
            'option.advancedSearchReq.caseStatus': function (val, oldval) {
                if (val !== '') {
                    this.option.payStatus = '';
                    this.option.orderStatusUnionList = [];
                    this.orderStatusChecked = '';
                }
            },
            'option.advancedSearchReq.rmaStatus': function (val, oldval) {
                if (val !== '') {
                    this.option.payStatus = '';
                    this.option.orderStatusUnionList = [];
                    this.orderStatusChecked = '';
                }
            },
            'getWarehouseCode': function (val, oldval) {
                if (val !== '') {
                    this.getWealWarehouseCode = '';
                }
            },
            'getWealWarehouseCode': function (val, oldval) {
                if (val !== '') {
                    this.getWarehouseCode = '';
                }
            },
        },
        methods: {
            //get 支付方式选项
            getPayChannelList () {
                this.payChannelList = [];
                this.$http.get('pay/public/channels').then(res => {
                    if (res.body.code === 0 && res.body.data.payChannels) {
                        res.body.data.payChannels.forEach(item => {
                            this.payChannelList.push({ key: item.channelCode, label: item.channelName });
                        });
                    }
                })
            },

            //获得店铺
            getShopList () {
                this.shopList1 = [{name: '全部', code: ''}];
                this.shopList2 = [{name: '全部', code: ''}];
                this.$http.get('store/store/drop-down-store-list').then(res => {
                    if (res.body.code === 0 && res.body.data) {
                        res.body.data.forEach(item => {
                            this.shopList1.push({name: item.shopName, code: item.shopCode});
                            this.shopList2.push({name: item.shopCode, code: item.shopCode});
                        });
                    }
                })
            },

            //获得渠道
            getPipe () {
                this.$http.get('admin/public/pipelines').then(res => {
                    if (res.body.code === 0 && res.body.data) {
                        res.body.data.forEach(item => {
                            this.courtryPipeList.push({key: item.pipeline_code, label: item.pipeline_name});
                        });
                    }
                });
            },

            //获得物流方式
            getLogisticsTypeList (){
                this.logisticsTypeList1 = [{name: '全部', code: ''}];
                this.logisticsTypeList2 = [{name: '全部', code: ''}];
                this.$http.get('logistics/partition/public-info', {params: {searchType: 3}}).then(res => {
                    if (res.body.code === 0 && res.body.data.baseResultList) {
                        res.body.data.baseResultList.forEach((item, index) => {
                            this.logisticsTypeList1.push({name: item.wayName, code: item.logisticsCode});
                            this.logisticsTypeList2.push({name: item.logisticsCode, code: item.logisticsCode});
                            this.logisticsTypeBackArr[item.logisticsCode] = item.wayName;
                        });
                    }
                });
            },

            // 获得物流分组
            getLoginsticsGrounpList (){
                this.logisticsGroupList1 = [{name: '全部', code: ''}];
                this.logisticsGroupList2 = [{name: '全部', code: ''}];
                this.$http.get('logistics/partition/public-info', {params: {searchType: 2}}).then(res => {
                    if (res.body.code === 0 && res.body.data.baseResultList) {
                        res.body.data.baseResultList.forEach((item, index) => {
                            this.logisticsGroupList1.push({name: item.groupName, code: item.groupId});
                            this.logisticsGroupList2.push({name: item.groupId, code: item.groupId});
                            this.logisticsGroupBackArr[item.groupId] = item.groupName;
                        });
                    }
                });
            },

            //获得销售仓
            getSalesWare (){
                this.saleWareList1 = [{name: '全部', code: ''}];
                this.saleWareList2 = [{name: '全部', code: ''}];
                this.$http.get('stock/warehouse/list').then(res => {
                    if (res.body.code === 0 && res.body.data.list) {
                        res.body.data.list.forEach((item, index) => {
                            this.saleWareList1.push({name: item.virWhCnName, code: item.virWhCode});
                            this.saleWareList2.push({name: item.virWhCode, code: item.virWhCode});
                        });
                    }
                });
            },

            //获得真实仓
            getRealWare (){
                this.realWareList1 = [{name: '全部', code: ''}];
                this.realWareList2 = [{name: '全部', code: ''}];
                this.$http.get('stock/real-warehouse/public-whcodes').then(res => {
                    if (res.body.code === 0 && res.body.data) {
                        res.body.data.forEach((item, index) => {
                            if (item.name && item.whCode) {
                                this.realWareList1.push({name: item.name, code: item.whCode});
                                this.realWareList2.push({name: item.whCode, code: item.whCode});
                                this.realWareBackArr[item.whCode] = item.name;
                            }
                        });
                    }
                });
            },
            //获得币种和国家
            getCurrencysAndCountryList (){
                this.currencys = [];
                this.countryList = [];
                this.$http.get('order/index/public-country-currency-list').then(res => {
                    if (res.body.code === 0 && res.body.data) {
                        res.body.data.currencys.forEach((item, index) => {
                            this.currencys.push({
                                key: item.currencyCode,
                                label: item.currencyName + '-' + item.currencyCode
                            });
                        });
                        res.body.data.countrys.forEach((item, index) => {
                            this.countryList.push({key: item.countryCode, label: item.countryName});
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            //切换国家，获得对应的省
            countryChange (){
                let countrys = this.getCountrysList;
                this.provinceNameAndCodeList = [];
                this.getProvinceList = '';
                if (countrys && countrys.length === 1) {
                    this.countryCountIsOne = false;
                    this.$http.get('logistics/public/get-provinces-by-country-code', {params: {countryCode: countrys.toString()}}).then(res => {
                        if (res.body.code === 0 && res.body.data) {
                            res.body.data.forEach(item => {
                                this.provinceNameAndCodeList.push({name: item.provinceName, code: item.provinceCode});
                            });
                        }
                    })
                }
                if (countrys.length > 1) {
                    this.countryCountIsOne = true;
                    this.provinceNameAndCodeList = [];
                    this.getProvinceList = '';
                    this.option.advancedSearchReq.provinceList = [];
                    this.option.advancedSearchReq.city = "";
                    this.address = "";
                    this.option.advancedSearchReq.addressLineList = [];
                    this.option.advancedSearchReq.postalCode = "";
                    return false;
                }
            },

            emailOrUidChange (){
                this.emailOrUid === '1' ? this.option.userId = '' : this.option.email = '';
            },

            //支付完成时间 存入sessionStorage
            payTimeSaveLocal (time){
                time[0] ? sessionStorage.setItem('orderPayTime', time) : sessionStorage.removeItem('orderPayTime');
            },

            //订单创建时间 存入sessionStorage
            orderTimeSaveLocal (time){
                sessionStorage.setItem('orderCreateTime', time);
            },
            //初始化查询
            initSearch (){
                let orderPayTimeStr = sessionStorage.getItem("orderPayTime");
                let orderTimeStr = sessionStorage.getItem("orderCreateTime");
                let searchParams = sessionStorage.getItem("order_params");
                let sortRule = sessionStorage.getItem('sortRule');

                if (sortRule) {
                    this.orderSortCond = sortRule;
                } else {
                    this.orderSortCond = '';
                }

                if (orderPayTimeStr) {
                    let orderPayTimeArr = orderPayTimeStr.split(',');
                    orderPayTimeArr[0] = new Date(orderPayTimeArr[0]);
                    orderPayTimeArr[1] = new Date(orderPayTimeArr[1]);
                    this.payTime = orderPayTimeArr;
                } else {
                    this.payTime = [];
                }

                if (!orderTimeStr) {
                    this.orderTime = [new Date(new Date().getTime() - 30 * 24 * 3600000), new Date()];
                } else {
                    let orderTimeArr = orderTimeStr.split(',');
                    orderTimeArr[0] = new Date(orderTimeArr[0]);
                    orderTimeArr[1] = new Date(orderTimeArr[1]);
                    this.orderTime = orderTimeArr;
                }

                let params = searchParams ? JSON.parse(searchParams) : '';
                this.option.orderSn = params && params.orderSn ? params.orderSn : '';
                this.option.parentOrderSn = params && params.parentOrderSn ? params.parentOrderSn : '';
                this.option.orderStatusUnionList = params && params.orderStatusUnionList ? params.orderStatusUnionList : [];
                this.option.payStatus = params && params.payStatus ? params.payStatus : '';
                this.emailOrUid = params && params.emailOrUid ? params.emailOrUid : '1';
                this.payTimeOrOrderTime = '2';
                this.option.email = params && params.email ? params.email : '';
                this.option.userId = params && params.userId ? params.userId : '';
                this.option.orderCurrencyList = params && params.orderCurrencyList ? params.orderCurrencyList : [];
                this.orderCurrencyChecked = params && params.orderCurrencyList ? params.orderCurrencyList.join() : '';
                this.option.orderType = params && params.orderType ? params.orderType : '';
                this.option.platform = params && params.platform ? params.platform : '';
                this.option.payChannelList = params && params.payChannelList ? params.payChannelList : [];
                this.option.pipelineCodeList = params && params.pipelineCodeList ? params.pipelineCodeList : [];
                this.option.couponCode = params && params.couponCode ? params.couponCode : '';
                this.option.logisticsCouponCode = params && params.logisticsCouponCode ? params.logisticsCouponCode : '';
                this.option.isPreSold = params && params.isPreSold ? params.isPreSold : '';
                this.option.isTest = params && params.isTest ? params.isTest : '';
                this.option.minOrderAmount = params && params.minOrderAmount ? params.minOrderAmount : '';
                this.option.maxOrderAmount = params && params.maxOrderAmount ? params.maxOrderAmount : '';
                this.option.pageNum = params && params.pageNum ? params.pageNum : 1;
                this.option.pageSize = params && params.pageSize ? params.pageSize : 10;

                this.logisticsNameOrCode = params && params.logisticsNameOrCode ? params.logisticsNameOrCode : '1';
                this.getLogisticsCodes = params && params.getLogisticsCodes ? params.getLogisticsCodes : '';
                this.logisticsGroupNameOrCode = params && params.logisticsGroupNameOrCode ? params.logisticsGroupNameOrCode : '1';
                this.getLogisticsGroupId = params && params.getLogisticsGroupId ? params.getLogisticsGroupId : '';
                this.option.advancedSearchReq.goodsSn = params && params.advancedSearchReq.goodsSn ? params.advancedSearchReq.goodsSn : '';
                this.saleWareNameOrCode = params && params.saleWareNameOrCode ? params.saleWareNameOrCode : '1';
                this.getWarehouseCode = params && params.getWarehouseCode ? params.getWarehouseCode : '';
                this.realWareNameOrCode = params && params.realWareNameOrCode ? params.realWareNameOrCode : '1';
                this.shopNameOrCode = params && params.shopNameOrCode ? params.shopNameOrCode : '1';
                this.getWealWarehouseCode = params && params.getWealWarehouseCode ? params.getWealWarehouseCode : '';

                this.getCountrysList = params && params.getCountrysList ? params.getCountrysList : [];
                this.getCountrysChecked = this.getCountrysList.join();
                this.getProvinceList = params && params.getProvinceList ? params.getProvinceList : '';
                this.option.advancedSearchReq.city = params && params.advancedSearchReq.city ? params.advancedSearchReq.city : '';
                this.address = params && params.address ? params.address : '';
                this.option.advancedSearchReq.postalCode = params && params.advancedSearchReq.postalCode ? params.advancedSearchReq.postalCode : '';
                this.option.advancedSearchReq.phone = params && params.advancedSearchReq.phone ? params.advancedSearchReq.phone : '';
                this.option.advancedSearchReq.email = params && params.advancedSearchReq.email ? params.advancedSearchReq.email : '';
                this.option.advancedSearchReq.firstName = params && params.advancedSearchReq.firstName ? params.advancedSearchReq.firstName : '';
                this.option.advancedSearchReq.lastName = params && params.advancedSearchReq.lastName ? params.advancedSearchReq.lastName : '';

                this.option.advancedSearchReq.orderStatus = params ? params.advancedSearchReq.orderStatus : '';
                this.option.advancedSearchReq.payStatus = params ? params.advancedSearchReq.payStatus : '';
                this.option.advancedSearchReq.orderLogisticsStatus = params ? params.advancedSearchReq.orderLogisticsStatus : '';
                this.option.advancedSearchReq.distributeStatus = params ? params.advancedSearchReq.distributeStatus : '';
                this.option.advancedSearchReq.caseStatus = params ? params.advancedSearchReq.caseStatus : '';
                this.option.advancedSearchReq.rmaStatus = params ? params.advancedSearchReq.rmaStatus : '';
                this.getCountrysList.length > 1 ? this.countryCountIsOne = true : this.countryCountIsOne = false;
                this.option.orderBy = params && params.orderBy ? params.orderBy : '';
                this.getShopCode = params ? params.advancedSearchReq.shopCode : '';

                let arrowDownStr = sessionStorage.getItem("arrowDown");
                if (arrowDownStr !== '') {
                    if (arrowDownStr === 'false') {
                        this.arrowDown = false;
                    } else {
                        this.arrowDown = true;
                    }

                } else {
                    this.arrowDown = true;
                }

                if (params && params.orderStatusUnionList) {
                    let orderStatusCheckedArrTemp = [];
                    for (let i = 0; i < this.option.orderStatusUnionList.length; i++) {
                        for (let j = 0; j < this.orderStatuses.length; j++) {
                            if (this.option.orderStatusUnionList[i] === this.orderStatuses[j].key) {
                                orderStatusCheckedArrTemp.push(this.orderStatuses[j].label);
                            }
                        }
                    }
                    this.orderStatusChecked = orderStatusCheckedArrTemp.join();
                }

                if (params && params.payChannelList) {
                    let payChannelCheckedArrTemp = [];
                    for (let i = 0; i < this.option.payChannelList.length; i++) {
                        for (let j = 0; j < this.payChannelList.length; j++) {
                            if (this.option.payChannelList[i] === this.payChannelList[j].key) {
                                payChannelCheckedArrTemp.push(this.payChannelList[j].label);
                            }
                        }
                    }
                    this.payChannelChecked = payChannelCheckedArrTemp.join();
                }

                if (params && params.pipelineCodeList) {
                    let courtryPipeCheckedArrTemp = [];
                    for (let i = 0; i < this.option.pipelineCodeList.length; i++) {
                        for (let j = 0; j < this.courtryPipeList.length; j++) {
                            if (this.option.pipelineCodeList[i] === this.courtryPipeList[j].key) {
                                courtryPipeCheckedArrTemp.push(this.courtryPipeList[j].label);
                            }
                        }
                    }
                    this.courtryPipeChecked = courtryPipeCheckedArrTemp.join();
                }
            },

            getData(){
                if (this.option.orderSn || this.option.parentOrderSn || this.option.email || (this.orderTime && this.orderTime.length > 0)) {
                    let timeArr1 = this.timeZone_(this.orderTime, this.$store.getters.getTimeZone);
                    if (Array.isArray(timeArr1) && timeArr1.length >= 2) {
                        this.option.createStartTime = timeArr1[0];
                        this.option.createEndtime = timeArr1[1];
                    }
                    let timeArr2 = this.timeZone_(this.payTime, this.$store.getters.getTimeZone);
                    if (Array.isArray(timeArr2) && timeArr2.length >= 2) {
                        this.option.completedStartTime = timeArr2[0];
                        this.option.completedEndTime = timeArr2[1];
                    }

                    this.option.advancedSearchReq.countryCodeList = this.getCountrysList;
                    this.option.advancedSearchReq.addressLineList = [];
                    this.option.advancedSearchReq.logisticsCodeList = [];
                    this.option.advancedSearchReq.logisticsGroupIdList = [];
                    this.option.advancedSearchReq.warehouseCodeList = [];
                    this.option.advancedSearchReq.realWarehouseCodeList = [];
                    this.option.advancedSearchReq.shopCode = this.getShopCode;
                    this.option.advancedSearchReq.provinceList = [];

                    this.address ? this.option.advancedSearchReq.addressLineList.push(this.address) : '';
                    this.getLogisticsCodes ? this.option.advancedSearchReq.logisticsCodeList.push(this.getLogisticsCodes) : '';
                    this.getLogisticsGroupId ? this.option.advancedSearchReq.logisticsGroupIdList.push(this.getLogisticsGroupId.toString()) : '';
                    this.getWarehouseCode ? this.option.advancedSearchReq.warehouseCodeList.push(this.getWarehouseCode) : '';
                    this.getWealWarehouseCode ? this.option.advancedSearchReq.realWarehouseCodeList.push(this.getWealWarehouseCode) : '';
                    this.getProvinceList ? this.option.advancedSearchReq.provinceList.push(this.getProvinceList) : '';

                    //验证
                    if (this.option.email) {
                        let reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
                        let isEmail = reg.test(this.option.email);
                        if (!isEmail) {
                            this.$message.warning('请填写正确的注册邮箱!');
                            return false;
                        }
                    }
                    if (this.option.advancedSearchReq.email) {
                        let reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
                        let isEmail = reg.test(this.option.advancedSearchReq.email);
                        if (!isEmail) {
                            this.$message.warning('请填写正确的注册邮箱!');
                            return false;
                        }
                    }
                    if (this.option.minOrderAmount) {
                        let reg = /^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/;
                        let isOK = reg.test(this.option.minOrderAmount);
                        if (!isOK) {
                            this.$message.warning("请输入大于0的两位小数");
                            return false;
                        }
                    }
                    if (this.option.maxOrderAmount) {
                        let reg = /^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/;
                        let isOK = reg.test(this.option.maxOrderAmount);
                        if (!isOK) {
                            this.$message.warning("请输入大于0的两位小数");
                            return false;
                        }
                    }
                    if (this.option.minOrderAmount && !this.option.maxOrderAmount) {
                        this.$message.warning("请输入订单应付金额最大值");
                        return false;
                    }
                    if (!this.option.minOrderAmount && this.option.maxOrderAmount) {
                        this.$message.warning("请输入订单应付金额最小值");
                        return false;
                    }
                    if (this.option.minOrderAmount && this.option.maxOrderAmount && parseFloat(this.option.minOrderAmount) > parseFloat(this.option.maxOrderAmount)) {
                        this.$message.warning("订单应付金额最小值不能大于最大值");
                        return false;
                    }

                    //将查询条件保存到 sessionStorage 中
                    let saveData = this.option;
                    saveData.emailOrUid = this.emailOrUid;
                    saveData.logisticsNameOrCode = this.logisticsNameOrCode;
                    saveData.logisticsGroupNameOrCode = this.logisticsGroupNameOrCode;
                    saveData.saleWareNameOrCode = this.saleWareNameOrCode;
                    saveData.realWareNameOrCode = this.realWareNameOrCode;
                    saveData.shopNameOrCode = this.shopNameOrCode;
                    saveData.getLogisticsCodes = this.getLogisticsCodes;
                    saveData.getLogisticsGroupId = this.getLogisticsGroupId;
                    saveData.getWarehouseCode = this.getWarehouseCode;
                    saveData.getWealWarehouseCode = this.getWealWarehouseCode;
                    saveData.getCountrysList = this.getCountrysList;
                    saveData.getProvinceList = this.getProvinceList;
                    saveData.address = this.address;
                    //console.log(JSON.stringify(saveData));
                    sessionStorage.setItem("order_params", JSON.stringify(saveData));
                    //arrowDown 箭头状态存储
                    sessionStorage.setItem("arrowDown", this.arrowDown);

                    if (this.payTimeOrOrderTime === '1') {
                        this.option.createStartTime = '';
                        this.option.createEndtime = '';
                    } else if (this.payTimeOrOrderTime === '2') {
                        this.option.completedStartTime = '';
                        this.option.completedEndTime = '';
                    }

                    if (this.arrowDown) {
                        let params1 = {
                            orderSn: this.option.orderSn,
                            parentOrderSn: this.option.parentOrderSn,
                            orderStatusUnionList: this.option.orderStatusUnionList,
                            pipelineCodeList: this.option.pipelineCodeList,
                            payStatus: this.option.payStatus,
                            email: this.option.email,
                            userId: this.option.userId,
                            orderCurrencyList: this.option.orderCurrencyList,
                            orderType: this.option.orderType,
                            platform: this.option.platform,
                            payChannelList: this.option.payChannelList,
                            couponCode: this.option.couponCode,
                            logisticsCouponCode: this.option.logisticsCouponCode,
                            isPreSold: this.option.isPreSold,
                            isTest: this.option.isTest,
                            minOrderAmount: this.option.minOrderAmount,
                            maxOrderAmount: this.option.maxOrderAmount,
                            completedStartTime: this.option.completedStartTime,
                            completedEndTime: this.option.completedEndTime,
                            createStartTime: this.option.createStartTime,
                            createEndtime: this.option.createEndtime,
                            pageNum: this.option.pageNum,
                            pageSize: this.option.pageSize,
                            orderBy: this.option.orderBy ? JSON.stringify(this.option.orderBy) : ''
                        };
                        this.getDataByPort(params1);
                    } else {
                        let params2 = {
                            orderSn: this.option.orderSn,
                            parentOrderSn: this.option.parentOrderSn,
                            orderStatusUnionList: this.option.orderStatusUnionList,
                            pipelineCodeList: this.option.pipelineCodeList,
                            payStatus: this.option.payStatus,
                            email: this.option.email,
                            userId: this.option.userId,
                            orderCurrencyList: this.option.orderCurrencyList,
                            orderType: this.option.orderType,
                            platform: this.option.platform,
                            payChannelList: this.option.payChannelList,
                            couponCode: this.option.couponCode,
                            logisticsCouponCode: this.option.logisticsCouponCode,
                            isPreSold: this.option.isPreSold,
                            isTest: this.option.isTest,
                            minOrderAmount: this.option.minOrderAmount,
                            maxOrderAmount: this.option.maxOrderAmount,
                            completedStartTime: this.option.completedStartTime,
                            completedEndTime: this.option.completedEndTime,
                            createStartTime: this.option.createStartTime,
                            createEndtime: this.option.createEndtime,
                            pageNum: this.option.pageNum,
                            pageSize: this.option.pageSize,
                            orderBy: this.option.orderBy ? JSON.stringify(this.option.orderBy) : '',
                            advancedSearchReq: JSON.stringify(this.option.advancedSearchReq),
                        };
                        this.getDataByPort(params2);
                    }
                } else {
                    this.$message.warning('以下参数至少选择一项: 订单号、联合订单号、邮箱、订单时间');
                }
            },

            getDataByPort (params){
                //console.log(params);
                this.tableLoading = true;
                this.$http.post('order/index/list', params).then(res => {
                    this.tableLoading = false;
                    if (res.body.code === 0 && res.body.data && Array.isArray(res.body.data.list)) {
                        this.orderData = res.body.data.list;
                        this.total = res.body.data.totalCount;
                        this.totalAmount = res.body.data.totalAmount;
                        this.pageTotalAmount = res.body.data.pageTotalAmount;
                    } else {
                        this.orderData = [];
                        this.$message.error(res.body.message)
                    }
                });
            },

            searchBtnClick (){
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
            showCancelDialog (parentOrderSn, userIdStr, payStatus, canCancelRow){
                //console.log(canCancelRow);
                this.cancelParam.reason = '';
                this.cancelParam.parentOrderSn = parentOrderSn;
                this.cancelParam.userId = userIdStr;
                this.cancelParam.payStatus = payStatus;
                this.currenCanceleRow = canCancelRow;

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
                                this.currenCanceleRow.isCancel = false;
                                this.getData();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        });
                    }
                    this.currenCanceleRow = {};
                });
            },
            resetCancelDialog(){
                this.cancelDialogVisible = false;
            },
            showLog (orderSn){
                this.logDialogVisible = true;
                this.selectOrderSn = orderSn;
                this.$http.get('order/index/order-log', {params: {orderSn: orderSn}}).then(res => {
                    if (res.body.code === 0) {
                        this.logData = res.body.data.list;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            showPayRecord(orderSn, parentOrderSn){
                this.selectOrderSn = orderSn;
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
                this.unionPrices = {};
                this.$http.get('order/index/union-order-amount', {params: {parentOrderSn: orderId}}).then(res => {
                    if (res.body.code === 0) {
                        this.unionPrices = res.body.data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            resetForm (){
                sessionStorage.removeItem('order_params');
                sessionStorage.removeItem('orderPayTime');
                sessionStorage.removeItem('orderCreateTime');
                this.option.orderSn = '';
                this.option.parentOrderSn = '';
                this.option.orderStatusUnionList = [];
                this.option.pipelineCodeList = [];
                this.option.payStatus = '';
                this.emailOrUid = '1';
                this.payTimeOrOrderTime = '2';
                this.option.email = '';
                this.option.userId = '';
                this.option.orderCurrencyList = [];
                this.option.orderType = '';
                this.option.platform = '';
                this.option.payChannelList = [];
                this.option.couponCode = '';
                this.option.logisticsCouponCode = '';
                this.option.isPreSold = '';
                this.option.isTest = '';
                this.option.minOrderAmount = '';
                this.option.maxOrderAmount = '';
                this.payTime = [];
                this.orderTime = [new Date(new Date().getTime() - 30 * 24 * 3600000), new Date()];
                this.logisticsNameOrCode = '1';
                this.getLogisticsCodes = '';
                this.logisticsGroupNameOrCode = '1';
                this.getLogisticsGroupId = '';
                this.option.advancedSearchReq.goodsSn = '';
                this.saleWareNameOrCode = '1';
                this.getWarehouseCode = '';
                this.realWareNameOrCode = '1';
                this.shopNameOrCode = '1';
                this.getShopCode = '';
                this.getWealWarehouseCode = '';
                this.getCountrysList = [];
                this.getProvinceList = '';
                this.option.advancedSearchReq.city = '';
                this.address = '';
                this.option.advancedSearchReq.postalCode = '';
                this.option.advancedSearchReq.phone = '';
                this.option.advancedSearchReq.email = '';
                this.option.advancedSearchReq.firstName = '';
                this.option.advancedSearchReq.lastName = '';
                this.option.advancedSearchReq.orderStatus = '';
                this.option.advancedSearchReq.payStatus = '';
                this.option.advancedSearchReq.orderLogisticsStatus = '';
                this.option.advancedSearchReq.distributeStatus = '';
                this.option.advancedSearchReq.caseStatus = '';
                this.option.advancedSearchReq.rmaStatus = '';
                this.countryCountIsOne = false;
                this.courtryPipeChecked = '';
                this.orderStatusChecked = '';
                this.orderCurrencyChecked = '';
                this.payChannelChecked = '';
                this.getCountrysChecked = '';
                delete this.option.orderBy;
                this.orderSortCond = '';
            },
            orderSortChange (cond){

                if ('orderBy' in this.option) {
                    delete this.option.orderBy;
                }
                if (cond === '1') {
                    this.option.orderBy = {'createdTime': 0};
                }
                if (cond === '2') {
                    this.option.orderBy = {'createdTime': 1};
                }
                if (cond === '3') {
                    this.option.orderBy = {'completedTime': 0};
                }
                if (cond === '4') {
                    this.option.orderBy = {'completedTime': 1};
                }
                if (cond === '5') {
                    this.option.orderBy = {'orderAmount': 0};
                }
                if (cond === '6') {
                    this.option.orderBy = {'orderAmount': 1};
                }
                sessionStorage.setItem('sortRule', cond);
                if (!cond) {
                    return false;
                }
                this.getData();
            },

            currencyConfirm (){
                this.orderCurrencyChecked = this.option.orderCurrencyList.join();
                this.orderCurrencyBoxShow = false;
            },

            currencyCancel (){
                this.orderCurrencyBoxShow = false;
                this.option.orderCurrencyList = [];
                this.orderCurrencyChecked = '';
            },

            orderHandleIconClick (){
                this.option.orderCurrencyList = [];
                this.orderCurrencyChecked = '';
            },

            orderStatusConfirm (){
                this.orderStatusChecked = '';
                let orderStatusCheckedArrTemp = [];
                for (let i = 0; i < this.option.orderStatusUnionList.length; i++) {
                    for (let j = 0; j < this.orderStatuses.length; j++) {
                        if (this.option.orderStatusUnionList[i] === this.orderStatuses[j].key) {
                            orderStatusCheckedArrTemp.push(this.orderStatuses[j].label);
                        }
                    }
                }
                this.orderStatusChecked = orderStatusCheckedArrTemp.join();
                this.orderStatusBoxShow = false;
            },

            orderStatusCancel (){
                this.orderStatusBoxShow = false;
                this.option.orderStatusUnionList = [];
                this.orderStatusChecked = '';
            },

            orderStatusHandleIconClick (){
                this.option.orderStatusUnionList = [];
                this.orderStatusChecked = '';
            },

            payChannelConfirm (){
                this.payChannelChecked = '';
                let payChannelCheckedArrTemp = [];
                if (this.option.payChannelList && this.option.payChannelList.length > 0) {
                    for (let i = 0; i < this.option.payChannelList.length; i++) {
                        for (let j = 0; j < this.payChannelList.length; j++) {
                            if (this.option.payChannelList[i] === this.payChannelList[j].key) {
                                payChannelCheckedArrTemp.push(this.payChannelList[j].label);
                            }
                        }
                    }
                }
                this.payChannelChecked = payChannelCheckedArrTemp.join();
                this.payChannelBoxShow = false;
            },

            payChannelCancel (){
                this.payChannelBoxShow = false;
                this.option.payChannelList = [];
                this.payChannelChecked = '';
            },

            payChannelHandleIconClick (){
                this.option.payChannelList = [];
                this.payChannelChecked = '';
            },

            courtryPipeConfirm (){
                this.courtryPipeChecked = '';
                let courtryPipeCheckedArrTemp = [];
                if (this.option.pipelineCodeList && this.option.pipelineCodeList.length > 0) {
                    for (let i = 0; i < this.option.pipelineCodeList.length; i++) {
                        for (let j = 0; j < this.courtryPipeList.length; j++) {
                            if (this.option.pipelineCodeList[i] === this.courtryPipeList[j].key) {
                                courtryPipeCheckedArrTemp.push(this.courtryPipeList[j].label);
                            }
                        }
                    }
                }
                this.courtryPipeChecked = courtryPipeCheckedArrTemp.join();
                this.courtryPipeBoxShow = false;
            },

            courtryPipeCancel (){
                this.courtryPipeBoxShow = false;
                this.option.pipelineCodeList = [];
                this.courtryPipeChecked = '';
            },

            courtryPipeHandleIconClick (){
                this.option.pipelineCodeList = [];
                this.courtryPipeChecked = '';
            },

            getCountrysConfirm (){
                this.getCountrysChecked = '';
                this.getCountrysChecked = this.getCountrysList.join();
                this.getCountrysShow = false;
                this.countryChange();
            },

            getCountrysCancel (){
                this.getCountrysShow = false;
                this.getCountrysList = [];
                this.getCountrysChecked = '';
                this.countryCountIsOne = false;
            },

            getCountrysHandleIconClick (){
                this.getCountrysList = [];
                this.getCountrysChecked = '';
                this.countryCountIsOne = false;
            },

            orderStatusFocus (){
                this.orderStatusBoxShow = true;
                this.orderCurrencyBoxShow = false;
                this.payChannelBoxShow = false;
                this.getCountrysShow = false;
                this.courtryPipeBoxShow = false;
            },

            orderCurrencyFocus (){
                this.orderCurrencyBoxShow = true;
                this.orderStatusBoxShow = false;
                this.payChannelBoxShow = false;
                this.getCountrysShow = false;
                this.courtryPipeBoxShow = false;
            },

            payChannelFocus (){
                this.payChannelBoxShow = true;
                this.orderCurrencyBoxShow = false;
                this.orderStatusBoxShow = false;
                this.getCountrysShow = false;
                this.courtryPipeBoxShow = false;
            },

            getCountrysFocus (){
                this.getCountrysShow = true;
                this.payChannelBoxShow = false;
                this.orderCurrencyBoxShow = false;
                this.orderStatusBoxShow = false;
                this.courtryPipeBoxShow = false;
            },

            courtryPipeFocus (){
                this.courtryPipeBoxShow = true;
                this.getCountrysShow = false;
                this.payChannelBoxShow = false;
                this.orderCurrencyBoxShow = false;
                this.orderStatusBoxShow = false;
            },
        } //methods end
    };

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

    .select-item {
        input {
            width: 192px;
        }
    }

    .create-time {
        .el-picker-panel__link-btn {
            display: none;
        }
    }

    .buttons-box {
        margin-top: 10px;
        padding-right: 120px;
    }

    .advanced-Search-title {
        position: relative;
        .el-tabs__content {
            position: absolute;
            top: 20px;
            right: 120px;
            cursor: pointer;
            .arrow-icon {
                font-size: 25px;
            }
        }
        .el-tabs__item {
            padding-left: 2px !important;
        }
    }

    .advancedSearchBox {
        h4 {
            font-weight: normal;
            padding: 0 0 10px 4px;
            margin-bottom: 15px;
            color: #20a0ff;
            span {
                padding: 0 18px 10px 0;
                border-bottom: 1px solid #ddd;
            }
        }
        .logistics-info {
            .logistics-info-item {
                overflow: hidden;
                float: left;
                div {
                    width: 192px;
                    float: left;
                }
                &:last-of-type {
                    margin-left: 114px;
                }
                .logistics-info-gap {
                    width: 20px;
                    text-align: center;
                    font-weight: bold;
                }
            }
        }
        .shop-info {
            margin-left: -14px;
        }
    }

    .logistics-info-margin {
        margin-left: -96px;
    }

    .sku-info-margin {
        margin-left: -26px;
    }

    .address-info-margin {
        margin-left: -28px;
    }

    .saleWareName-or-code {
        margin-left: -102px;
    }

    .multi-select-box {
        .el-select__tags {
            width: 192px !important;
            height: 36px !important;
            overflow: hidden;
            & > span {
                white-space: nowrap;
            }
            .is-undefined {
                display: none;
            }
        }
    }

    .order-money-box {
        width: 192px !important;
        .order-money-gap {
            text-align: center;
        }
    }

    .email-uid-form {
        width: 286px;
        margin-left: 6px;
        .email-or-uid {
            .el-input__inner {
                padding-left: 5px;
                padding-right: 5px;
            }
            .el-input__icon {
                width: 25px;
            }
        }

        .email-uid-box {
            margin-left: 10px;
            width: 192px !important;
        }
    }

    .order-currency-box {
        position: relative;
        .filter-box {
            position: absolute;
            top: 40px;
            left: 0;
            width: 458px;
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            z-index: 999;
            .footer-btn {
                margin-top: 20px;
            }
        }
    }

    .courtryPipe-box {
        left: -306px !important;
    }

    .order-currencyBox-show {
        width: 192px;
    }

    .red-color {
        color: red;
    }

    .order-table {
        .el-tag {
            display: inline-block;
            padding: 0 16px;
            margin-bottom: 5px;
        }
    }

</style>
