<!-- 会员详情 -->
<template>
    <div>
        <div class="el-container">

            <el-tabs v-model="options.tabActive" type="card" v-loading="dataLoading" @tab-click="handleTabClick">
                <el-tab-pane label="会员信息" name="info">
                    <div class="el-sub-menber-container member-info">

                        <el-row class="member-info-border">
                            <el-col :span="5" class="member-info-avatar-container">
                                <div class="member-info-avatar el-sub-menber-container">
                                    <img :src="info.userIcon ? info.userIcon : 'http://iph.href.lu/200x200?text=%E9%BB%98%E8%AE%A4%E5%9B%BE%E7%89%87' " width="200" alt="">
                                    <p class="text-center">{{info.nickName }}</p>
                                </div>
                            </el-col>

                            <el-col :span="19" class="member-info-tags-container">
                                <tags-select
                                    :isShow.sync="isShowTagList"
                                    :tagAttr="tagAttr"
                                    :selectedTags="info.labelList"
                                    :commondTags="commondTagList"
                                    @success="handleSearchForTag"
                                    :closeTransition="true"
                                ></tags-select>
                                <h4>标签印象  <el-button type="text" class="member-info-tags-button" @click="showTafSelect">打标签</el-button> </h4>
                                <el-tag v-for="(item, index) in info.labelList" :key="index" :closable="true" @close="handleDelTagClick(item, index, true)">{{ item.name }}</el-tag>
                            </el-col>
                        </el-row>

                        <el-row class="member-account" :gutter="20">
                            <el-col :span="12">
                                <div class="member-container member-info-border">
                                    <div class="member-header">账号信息</div>
                                    <div class="member-content">
                                        <p><span class="content-title">USER_ID：</span><span>{{info.userId}}</span></p>
                                        <p><span class="content-title">邮箱地址：</span><span>{{info.email}}</span></p>

                                        <p><span class="content-title">Facebook：</span><span v-if="info.bindThrid">{{info.bindThrid.facebook == 1 ? '已绑定' : '未绑定'}}</span></p>
                                        <p><span class="content-title">Gmail：</span><span v-if="info.bindThrid">{{info.bindThrid.google == 1 ? '已绑定' : '未绑定'}}</span></p>
                                        <p><span class="content-title">PayPal：</span><span v-if="info.bindThrid">{{info.bindThrid.paypal == 1  ? '已绑定' : '未绑定'}}</span></p>
                                        <p><span class="content-title">Gearbest：</span><span v-if="info.bindThrid">{{info.bindThrid.gearbest == 1 ? '已绑定' : '未绑定'}}</span></p>
                                        <p><span class="content-title">VKontakte：</span><span v-if="info.bindThrid">{{info.bindThrid.vkontakte == 1 ? '已绑定' : '未绑定'}}</span></p>
                                        <p>
                                            <span class="content-title">激活状态：</span>
                                            <span>{{info.isValidateEmail == 1 ? '已激活' : '未激活'}} </span>
                                            <el-button type="text" class="member-account-button" @click="editStatus('validateEmail')">修改</el-button> 
                                        </p>
                                        <p>
                                            <span class="content-title">订阅状态：</span>
                                            <span>{{info.isEmailSub == 1 ? '已订阅' : '未订阅' }}</span>
                                            <el-button type="text" class="member-account-button" @click="editStatus('emailSubscribe')">修改</el-button>
                                        </p>
                                        <p><span class="content-title">风险监控：</span><span>{{riskStatus[info.riskStatus]}}（{{info.riskScore}}）</span></p>
                                        <p><span class="content-title">会员等级：</span><span>{{ levels[info.levelId] }}</span></p>
                                        <p><span class="content-title">注册时间：</span><span>{{ timeZone_(info.createDate, $store.getters.getTimeZone) }}（{{getRegDays(info.createDate)}}天）</span></p>
                                        <p><span class="content-title">注册渠道：</span><span>{{ info.pipelineCode ?  pipeOpt[info.pipelineCode] : '--' }}</span></p>
                                        <p><span class="content-title">注册端口：</span><span>{{ info.platform ? platformOpt[info.platform] : '--' }}</span></p>
                                    </div>
                                </div>
                            </el-col>

                            <el-col :span="12">
                                <div class="member-container member-info-border">
                                    <div class="member-header">个人资料</div>
                                    <div class="member-content">
                                        <p><span>First Name：</span><span>{{info.firstName}}</span></p>
                                        <p><span>Last Name：</span><span>{{info.lastName}}</span></p>
                                        <p><span>Nick Name：</span><span>{{info.nickName}}</span></p>
                                        <p>
                                            <span>性别：</span>
                                            <span>
                                                <template v-if="info.sex == 0">女</template>
                                                <template v-if="info.sex == 1">男</template>
                                                <template v-if="info.sex == 2">保密</template>
                                            </span>
                                        </p>
                                        <p><span>生日：</span><span>{{info.birthday}}</span></p>
                                        <p><span>电话：</span><span>{{info.phone}}</span></p>
                                        <p><span>上次登录IMEI：</span><span>{{info.lastLoginImei ? info.lastLoginImei : '--'}}</span></p>
                                        <p><span>上次登录IP：</span><span>{{info.lastLoginIpStr}}</span></p>
                                        <p><span>上次登录时间：</span><span>{{ timeZone_(info.lastLoginDate, $store.getters.getTimeZone) }} {{ info.lastLoginDate ? '（' + getRegDays(info.lastLoginDate) + '天）' : '' }}</span></p>
                                        <p><span>首次下单时间：</span><span>{{ timeZone_(info.firstOrderTime, $store.getters.getTimeZone) }}</span></p>
                                        <p><span>上次下单时间：</span><span>{{ timeZone_(info.recentOrderTime, $store.getters.getTimeZone) }}</span></p>
                                        <p><span>上次支付时间：</span><span>{{ timeZone_(info.lastOrderTime, $store.getters.getTimeZone) }}</span></p>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row class="member-message" :gutter="20">
                            <el-col :span="12">
                                <div class="member-container member-info-border">
                                    <div class="member-header">资产信息</div>
                                    <div class="member-content">
                                        <p><span>电子钱包：</span><span>{{ewalletBalance}} &nbsp; USD</span></p>
                                        <p><span>积分余额：</span><span>{{info.pointsBalance}} &nbsp; Point</span></p>
                                        <p><span>成长值：</span><span>{{info.growupNum}}</span></p>
                                    </div>
                                </div>
                            </el-col>

                            <el-col :span="12">
                                <div class="member-container member-info-border">
                                    <div class="member-header">备注信息 <el-button type="primary" size="small" class="fr remark-btn" @click="changeRemark">修改</el-button></div>
                                    <div class="member-content member-remark-content">
                                        <div v-if="remarks">
                                            <p>{{remarks.remark}}</p>
                                            <p class="text-right">
                                                <span class="remark-time">{{ timeZone_(remarks.date, $store.getters.getTimeZone) }}</span>
                                                <span>{{ remarks.userName }}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="订单详情" name="order">
                    <el-table :data="orderData.tableData" border>
                        <el-table-column label="订单编号">
                            <template scope="scope">
                                <router-link :to="{name: 'order_orderDetail_gb', query: {userId: userId, orderSn: scope.row.orderSn}}">{{ scope.row.orderSn }}</router-link>
                            </template>                            
                        </el-table-column>
                        <el-table-column prop="parentOrderSn" label="联合订单号"></el-table-column>
                        <el-table-column label="创建时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createdTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收货人">
                            <template scope="scope">
                                <div>{{ scope.row.firstName + ' ' + scope.row.lastName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="city" label="收货城市"></el-table-column>
                        <el-table-column prop="country" label="收货国家"></el-table-column>
                        <el-table-column prop="orderAmount" label="应付金额"></el-table-column>
                        <el-table-column prop="orderCurrency" label="支付币种"></el-table-column>
                        <el-table-column label="订单状态">
                            <template scope="scope">
                                <div>{{ orderStatus[scope.row.orderStatus] }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="RMA状态">
                            <template scope="scope">
                                <div>{{ rmaStatus[scope.row.rmaStatus] }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="CASE状态">
                            <template scope="scope">
                                <div>{{ caseStatus[scope.row.caseStatus] }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="logisticsCode" label="物流方式"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <router-link :to="{name: 'order_orderDetail_gb', query: {userId: userId, orderSn: scope.row.orderSn}}"><el-button type="text">查看详情</el-button></router-link>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'order')" @current-change="changePage($event, 'order')" :current-page="orderData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="orderData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="orderData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Coupon" name="coupon">
                    <el-table :data="couponData.tableData" border>
                        <el-table-column prop="id" label="编号"></el-table-column>
                        <el-table-column prop="couponCode" label="Coupon码"></el-table-column>
                        <el-table-column prop="templateId" label="Coupon码模板"></el-table-column>
                        <el-table-column label="满额条件">
                            <template scope="scope">
                                <div>{{ scope.row.type == 10 || scope.row.type == 11 || scope.row.type == 12 || scope.row.type == 15 || scope.row.type == 16 || scope.row.type == 17 || scope.row.type == 20 || scope.row.type == 21 ? scope.row.strategys : '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="减免金额">
                            <template scope="scope">
                                <div>{{ scope.row.type == 9 || scope.row.type == 14 ? scope.row.strategys : '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="减免百分比">
                            <template scope="scope">
                                <div>{{ scope.row.type == 8 || scope.row.type == 13 ? scope.row.strategys : '-' }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="开始时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.startTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="结束时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.endTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="次数限制">
                            <template scope="scope">
                                <div>{{ scope.row.useCountLimit == 0 ? '不限制' : scope.row.useCountLimit }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template scope="scope">
                                <div>{{ couponData.statusText[scope.row.status] }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注"></el-table-column>
                        <el-table-column prop="opreator" label="最后操作人"></el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <span>共 {{ couponData.pagination.totalCount }} 条</span>
                        <!-- <el-pagination @size-change="changePageSize($event, 'coupon')" @current-change="changePage($event, 'coupon')" :current-page="couponData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="couponData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="couponData.pagination.totalCount"></el-pagination> -->
                    </div>
                </el-tab-pane>
                <el-tab-pane label="积分明细" name="point">
                    <div class="el-sub-container">
                        <el-form :model="pointData" inline>
                            <el-form-item label="时间">
                                <el-date-picker v-model="pointData.filter.date" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getData('point', 1)">筛选</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table :data="pointData.tableData" border>
                        <el-table-column prop="id" label="序号"></el-table-column>
                        <el-table-column prop="currentNum" label="当前可用积分"></el-table-column>
                        <el-table-column prop="addNum" label="增加"></el-table-column>
                        <el-table-column label="有效期">
                            <template scope="scope" >
                                <template v-if="scope.row.effStartDate && scope.row.effEndDate">
                                    {{ timeZone_(scope.row.effStartDate, $store.getters.getTimeZone) }}
                                    至
                                    {{ timeZone_(scope.row.effEndDate, $store.getters.getTimeZone) }}
                                </template>    
                            </template>
                        </el-table-column>
                        <el-table-column prop="subNum" label="减少"></el-table-column>
                        <el-table-column prop="description" label="内容"></el-table-column>
                        <el-table-column label="时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createDate, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="itemDesc" label="积分类型"></el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'point')" @current-change="changePage($event, 'point')" :current-page="pointData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pointData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pointData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="购物车" name="cart">
                    <el-table :data="cartData.tableData" border>
                        <el-table-column prop="itemId" label="购物车条目ID"></el-table-column>
                        <el-table-column label="商品信息" width="380">
                            <template scope="scope">
                                <div class="good-info-container">
                                    <img :src="scope.row.goodImg" />
                                    <div class="good-info-detail">
                                        <p>{{scope.row.goodTitle}}</p>
                                        <p><span v-if="scope.row.goodSn">SKU：{{scope.row.goodSn}}</span><span v-if="scope.row.shopPrice">${{scope.row.shopPrice}}</span></p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品类型">
                            <template scope="scope">
                                {{ goodTypeText[scope.row.goodType] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="qty" label="加购数"></el-table-column>
                        <el-table-column label="仓名称">
                            <template scope="scope">
                                {{scope.row.warehouseName}}
                            </template>      
                        </el-table-column>
                        <el-table-column label="勾选状态">
                            <template scope="scope">
                                {{scope.row.attr.selected ? '是' : '否'}}
                            </template>      
                        </el-table-column>
                        <el-table-column label="参与活动">
                            <template scope="scope">
                                {{scope.row.attr.activityId}}
                            </template>      
                        </el-table-column>

                        <el-table-column label="来源页面">
                            <template scope="scope">
                                {{scope.row.source === 0 ? '详情页' : '列表页'}}
                            </template>      
                        </el-table-column>

                        <el-table-column label="来源渠道">
                            <template scope="scope">
                                {{scope.row.pipelineName}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="platform" label="来源端">
                           <template scope="scope">
                                {{platformOpt[scope.row.platform]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="加入购物车时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <!-- <span>共 {{ cartData.pagination.totalCount }} 条</span> -->
                        <el-pagination @size-change="changePageSize($event, 'cart')" @current-change="changePage($event, 'cart')" :current-page="cartData.pagination.pageNum" :page-sizes="[10, 20, 50]" :page-size="cartData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="cartData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="收藏商品" name="favoritesgoods">
                    <el-table :data="favoritesgoodsData.tableData" border>
                        <el-table-column prop="id" label="ID"></el-table-column>
                        <el-table-column label="商品信息" width="380">
                            <template scope="scope">
                                <div class="good-info-container">
                                    <img :src="scope.row.imgUrl" />
                                    <div class="good-info-detail">
                                        <p>{{scope.row.goodName}}</p>
                                        <p><span>SKU：{{scope.row.goodSn}}</span><span>${{scope.row.shopPrice}}</span></p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="仓名称">
                            <template scope="scope">
                                {{warehouseList[scope.row.virCode]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="是否加入回收站">
                            <template scope="scope">
                                {{ scope.row.recycleStatus === 1 ? '是' : '否' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="来源渠道">
                            <template scope="scope">
                                {{pipeOpt[scope.row.pipelineCode]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="platform" label="来源端">
                           <template scope="scope">
                                {{platformOpt[scope.row.platform]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="加入收藏夹时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createDate, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'favoritesgoods')" @current-change="changePage($event, 'favoritesgoods')" :current-page="favoritesgoodsData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="favoritesgoodsData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="favoritesgoodsData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>


                <el-tab-pane label="收藏店铺" name="store">
                    <el-table :data="storeData.tableData" border>
                        <el-table-column prop="id" label="ID"></el-table-column>
                        <el-table-column label="店铺信息" width="380">
                            <template scope="scope">
                                <div class="store-info-container">
                                    <div>{{scope.row.shopName}}</div>
                                    <div>店铺编码：{{scope.row.shopCode}}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺类型">
                            <template scope="scope">
                                {{storeText[scope.row.shopType]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="店铺状态">
                            <template scope="scope">
                                {{ scope.row.status == 1 ? '正常' : '关闭' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="来源渠道">
                            <template scope="scope">
                                {{pipeOpt[scope.row.pipelineCode]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="platform" label="来源端">
                           <template scope="scope">
                                {{platformOpt[scope.row.platform]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="加入收藏夹时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createDate, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'store')" @current-change="changePage($event, 'store')" :current-page="storeData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="storeData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="storeData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>


                <el-tab-pane label="地址管理" name="address">
                    <el-table :data="addressData.tableData" border style="width: 100%">
                        <el-table-column prop="id" label="ID"></el-table-column>
                        <el-table-column label="收货人">
                            <template scope="scope">
                                {{scope.row.firstName}}&nbsp;{{scope.row.lastName}}
                            </template>
                        </el-table-column>
                        <el-table-column label="E-mail&Phone" width="150">
                            <template scope="scope">
                                {{scope.row.email}} & {{scope.row.phone}}
                            </template>
                        </el-table-column>
                        <el-table-column label="Country&State&City" :width="200">
                            <template scope="scope">
                                {{scope.row.countryName}} & {{scope.row.provinceName}} & {{scope.row.cityName}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="postalCode" label="ZIP/Postal Code" :width="150"></el-table-column>
                        <el-table-column label="Address" :width="200">
                            <template scope="scope">
                                <p>Line1：{{scope.row.addressLine1}}</p>
                                <p>Line2：{{scope.row.addressLine2}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Street Address" :width="200">
                            <template scope="scope">
                                <p>Line1：{{scope.row.addressLine3}}</p>
                                <p>Line2：{{scope.row.addressLine4}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="taxNumber" label="Tax ID" :width="150"></el-table-column>
                        <el-table-column prop="middleName" label="Middle Name" :width="150"></el-table-column>
                        <el-table-column prop="passportSerial" label="Passport Serial" :width="150"></el-table-column>
                        <el-table-column prop="passportNo" label="Passport Number" :width="160"></el-table-column>
                        <el-table-column prop="passportIssueDate" label="Passport Issue date" :width="180"></el-table-column>
                        <el-table-column prop="ssuingAgency" label="颁发机构" :width="180"></el-table-column>
                        <el-table-column label="来源渠道" :width="150">
                            <template scope="scope">
                                {{pipeOpt[scope.row.pipelineCode]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="platform" label="来源端" :width="150">
                           <template scope="scope">
                                {{platformOpt[scope.row.platform]}}
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" :width="150">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createDate, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="最后编辑时间" :width="150">
                            <template scope="scope">
                                {{ timeZone_(scope.row.updateDate, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'address')" @current-change="changePage($event, 'address')" :current-page="addressData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="addressData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="addressData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>


                <!-- <el-tab-pane label="收藏文章" name="favorites-article">
                    <el-table :data="favoritesarticleData.tableData" border>
                        <el-table-column prop="title" label="title"></el-table-column>
                        <el-table-column prop="type" label="类型"></el-table-column>
                        <el-table-column prop="status" label="文章状态"></el-table-column>
                        <el-table-column prop="publisher" label="文章发布人"></el-table-column>
                        <el-table-column label="添加时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.time, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'favoritesarticle')" @current-change="changePage($event, 'favoritesarticle')" :current-page="favoritesarticleData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="favoritesarticleData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="favoritesarticleData.pagination.totalCount"></el-pagination>
                    </div>

                </el-tab-pane> -->

                <!-- <el-tab-pane label="评论信息" name="reviews">
                    <el-table :data="reviewsData.tableData" border>
                        <el-table-column prop="sku" label="商品SKU"></el-table-column>
                        <el-table-column label="是否点赞">
                            <template scope="scope">
                                {{ scope.row.like_count == 1 ? '是' : '否' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="评论主题"></el-table-column>
                        <el-table-column prop="rate_overall" label="综合星级"></el-table-column>
                        <el-table-column label="评论时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.add_time, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="审核状态"></el-table-column>
                        <el-table-column prop="auditor" label="审核人"></el-table-column>
                        <el-table-column label="审核时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.auditor_time, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <router-link :to="{name: 'order_orderDetail', query: {userId: userId, orderSn: scope.row.orderSn}}"><el-button type="text">查看详情</el-button></router-link>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'reviews')" @current-change="changePage($event, 'reviews')" :current-page="reviewsData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="reviewsData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="reviewsData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane> -->

                <!-- <el-tab-pane label="会员反馈" name="feedbacks">
                    <el-table :data="feedbacksData.tableData" border>
                        <el-table-column prop="no" label="TICKETS编号"></el-table-column>
                        <el-table-column prop="first_cat_name" label="问题类型"></el-table-column>
                        <el-table-column prop="title" label="主题"></el-table-column>
                        <el-table-column label="反馈时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createdTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态">
                            <template scope="scope">
                                {{ feedbacksData.statusText[scope.row.status] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="deal_user" label="处理人"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <router-link :to="{name: 'order_orderDetail', query: {userId: userId, orderSn: scope.row.orderSn}}"><el-button type="text">查看详情</el-button></router-link>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'feedbacks')" @current-change="changePage($event, 'feedbacks')" :current-page="feedbacksData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="feedbacksData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="feedbacksData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane> -->

                <!-- <el-tab-pane label="成长值明细" name="growupLog">
                    <el-table :data="growupLogData.tableData" border>
                        <el-table-column prop="id" label="序号"></el-table-column>
                        <el-table-column prop="levelName" label="会员等级"></el-table-column>
                        <el-table-column prop="totalNum" label="总成长值"></el-table-column>
                        <el-table-column prop="currentNum" label="当前成长值"></el-table-column>
                        <el-table-column prop="description" label="内容"></el-table-column>
                        <el-table-column label="时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createDate, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <router-link :to="{name: 'order_orderDetail', query: {userId: userId, orderSn: scope.row.orderSn}}"><el-button type="text">查看详情</el-button></router-link>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'growupLog')" @current-change="changePage($event, 'growupLog')" :current-page="growupLogData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="growupLogData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="growupLogData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane> -->
            </el-tabs>

        </div>


        <!-- 修改激活状态S -->
        <el-dialog title="修改激活状态" v-model="isValidateEmail" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div class="el-container">
                <el-radio-group v-model="info.isValidateEmail">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelStatus('validateEmail')">取 消</el-button>
                <el-button type="primary" @click="handleBtnSaveClick('activeStatus')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改激活状态E -->


        <!-- 修改订阅状态S -->
        <el-dialog title="修改订阅状态" v-model="isEmailSubscribe" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div class="el-container">
                <el-radio-group v-model="info.isEmailSub">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelStatus('emailSubscribe')">取 消</el-button>
                <el-button type="primary" @click="changeEmailSub">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改订阅状态E -->

        <!-- 弹窗S -->
        <el-dialog title="编辑备注" v-model="remarkForm.isShow" size="tiny">
            <div class="el-container el-remark-container">
                <el-input type="textarea" autosize  placeholder="请输入内容" v-model="remarkForm.remark"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="remarkForm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="handleBtnSaveClick('remark')" :loading="remarkForm.isLoading">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>
// 减免类型(
// 8-无门槛百分比 
// 9-无门槛直减 
// 10-满额百分比
// 11-满额直减封顶 
// 12-满额直减不封顶 
// 13-无门槛百分比（系统）
// 14-无门槛直减（系统）
// 15-满额百分比（系统）
// 16-满额直减封顶（系统）
// 17-满额直减不封顶（系统）
// )
// 标签帅选组件
import tagsSelect from '../../pageComponents/member/tagsSelect'
import httpGet from '@/common/baseApi'
export default {
    components: {
        tagsSelect
    },
    data() {
        return {
            dataLoading: false,
            options: {
                tabActive: 'info'
            },
            isValidateEmail: false,
            isEmailSubscribe: false,
            preValidateEmail: '',
            preEmailSubscribe: '',
            pagination: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
            },
            userId: this.$route.query.userId,
            countries: [],
            levels: {},
            riskStatus: {
                '1': '正常',
                '2': '风险用户',
                '3': '黑名单用户'
            },
            info: {
                labelList: []
            },
            orderStatus: {
                '0': '正常',
                '1': '用户取消',
                '2': '系统取消',
                '3': '运营取消',
                '4': '库存占用失败取消'
            },
            rmaStatus: {
                '0': '正常',
                '1': '未处理',
                '2': '处理中',
                '3': '处理完成',
                '4': '取消'
            },
            caseStatus: {
                '0': '正常',
                '1': '处理中',
                '2': '已完成',
                '3': '已关闭'
            },
            tableData: [],
            orderData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: []
            },
            couponData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: [],
                statusText: {
                    '0': '未生效',
                    '1': '已生效',
                    '2': '已过期'
                }
            },
            pointData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                filter: {
                    date: '',
                    startTime: '',
                    endTime: ''
                },
                tableData: []
            },
            cartData: {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: []
            },
            favoritesgoodsData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: []
            },
            favoritesarticleData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: []
            },
            storeData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                tableData: []
            },

            addressData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: []
            },

            reviewsData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: []
            },
            feedbacksData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: [],
                statusText: {
                    '10': '未处理',
                    '20': '驳回',
                    '30': '待审核',
                    '40': '已处理',
                    '50': '等待客人回复',
                    '60': '已完成'
                }
            },
            growupLogData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: []
            },
            platformOpt: {
                '1': 'PC',
                '2': 'M',
                '3': 'IOS',
                '4': 'Android',
                '5': 'Pad'
            },
            pipeOpt: {},
            remarkForm: {
                isShow: false,
                isLoading: false,
                remark: '',
            },
            remarks: null,
            // 打标签
            isShowTagList: false,
            tagAttr: [],
            commondTagList: [],
            warehouseList: {},
            goodTypeText: {
                '0': '普通',
                '1': '配件',
                '2': '赠品',
                '3': '加价购',
                '21': '买即赠赠品'
            },
            storeText: {
                '1': '自营店铺',
                '2': '第三方店铺',
                '3': '供应商店铺'
            },
            ewalletBalance: 0
        };
    },
    created() {
        let tab = this.$route.query.tab;
        if (tab == 'order') {
            this.options.tabActive = 'order';
            this.getData('order');
        } else if(tab == 'address') {
            this.options.tabActive = 'address';
            this.getData('address');
        } else {
            this.getLevels();
            this.getData('info');
        }
        this.getPipe();
        this.getTagAttr();
        this.getTagsData();
        this.getWarehouseList();
    },
    methods: {
        // 获取销售仓
        getWarehouseList() {
            this.$http.get('stock/warehouse/vir-wh-drop-down').then((res) => {
                let data = res.body.data;
                if (res.body.code !== 0) {
                    return;
                }
                // console.log(data)
                let warehouseList = {};
                data.list.forEach((item) => {
                    warehouseList[item.virWhCode] = item.virWhEnName;
                })
                this.warehouseList = warehouseList;
            });
        },
        // 获取标签列表 
        getTagsData() {
            this.$http.get('user/tag/public-select-list').then((res) => {
                let data = res.body.data.data;
                if (res.body.code !== 0) {
                    return;
                }
                let commondTagList = [];
                Array.isArray(data) && data.forEach((item) => {
                    if(item.commond === 1){
                        commondTagList.push(item);
                    }
                });
                this.commondTagList = commondTagList;
            });
        },
        getTagAttr() {
            this.$http.get('user/tag/public-attr-list').then((res) => {
                if (res.body.code !== 0) {
                    return;
                }
                let tagAttr = [];
                res.body.data.forEach((item) => {
                    tagAttr.push(item);
                });
                this.tagAttr = tagAttr;
            });
        },
        // 时间转化
        getRegDays(date) {
            let timeZone = this.$store.getters.getTimeZone;
            const RegedTime = this.timeZone_(new Date(date*1000), timeZone);
            const nowTime = this.timeZone_(new Date(), timeZone);
            return Math.floor(((nowTime-RegedTime) / (24*60*60)));
        },
        // 获取渠道
        getPipe() {
            this.$http.get('admin/public/pipelines').then(res => {
                if (res.body.code === 0) {
                    // console.log(res.body.data)
                    let pipeOpt = {};
                    res.body.data.forEach((item) => {
                        pipeOpt[item.pipeline_code] = item.pipeline_name;
                    })
                    this.pipeOpt = pipeOpt;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        // 获取数据
        async getData(name, pageNo) {
            // console.log('getData ', name);
            if (this.dataLoading) {
                return;
            }
            this.dataLoading = true;
            if (name == 'info' || !name) {
                let promiseInfo = this.$http.get('user/index/query-mem-detail-info', {params: {userId: this.$route.query.userId}});
                let promiseCountry = this.$http.get('user/address/public-countrys');
                Promise.all([promiseInfo, promiseCountry]).then(async ([data1, data2]) => {
                    if (data1.body.code === 0) {
                        data1.body.data.labelList = data1.body.data.labelList || [];
                        this.info = data1.body.data;
                        this.$nextTick(() => {
                            this.info.labelList = this.info.labelList.concat([]);
                            if (typeof this.info.isValidateEmail == 'undefined') {
                                this.info.isValidateEmail = 0;
                            }
                            this.remarks = this.info.remark ? JSON.parse(this.info.remark) : null;
                        })
                    } else {
                        this.$notify.error(data1.body.message || data1.body.previous.message || '发生错误');
                    }
                    if (data2.body.code === 0) {
                        let countries = [];
                        this.countries = [];
                        data2.body.data.forEach((item) => {
                            countries.push(item);
                        });
                        this.countries = countries;
                    } else {
                        this.$notify.error(data2.body.message || data2.body.previous.message || '发生错误');
                    }
                    this.dataLoading = false;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                    this.dataLoading = false;
                });
                try {
                    const body = await httpGet('pay/wallet/info', {
                        params: {userId: this.$route.query.userId }
                    });
                    this.ewalletBalance = body ? body.totalAmount : 0;
                } catch(e) {
                    this.ewalletBalance = 0;
                }
            } else {
                let dataName = name.replace('-', '') + 'Data';
                let params = {};
                if (pageNo) {
                    if(name === 'cart') {
                        this[dataName].pagination.pageNum = pageNo;
                    } else {
                        this[dataName].pagination.pageNo = pageNo;
                    }
                }
                params = Object.assign({}, this[dataName].pagination);
                params.userId = this.$route.query.userId;
                delete params['totalCount'];
                if (name === 'point') {
                    // console.log(this.pointData.filter.date);
                    // return;
                    if (this.pointData.filter.date && this.pointData.filter.date[1]) {
                        let date = this.timeZone_(this.pointData.filter.date, this.$store.getters.getTimeZone);
                        params.startTime = date[0];
                        params.endTime = date[1];
                    }
                    // return;
                } else if (name === 'growupLog') {
                    name = 'growup-log'
                } else if(name === 'favoritesgoods') {
                    name = 'query-favorites-goods'
                } else if(name === 'address') {
                    name = 'query-address'
                } else if(name === 'store') {
                    name = 'query-favorites-stores'
                }
                let url = '';
                if(name === 'cart') {
                    url = 'order/index/user-cart';
                } else {
                    url = 'user/index/' + name; 
                }

                this.$http.get(url, {params: params}).then(res => {
                    this.dataLoading = false;
                    if (res.body.code !== 0) {
                        this.$notify.error(res.body.message || '发生错误');
                        return;
                    }
                    let list = ( name == 'favorites-article') ? res.body.data : (res.body.data.data || res.body.data.list);
                    this[dataName].tableData = [];
                    if (list && list.length > 0) {
                        let tableData = [];
                        list.forEach((item) => {
                            if (name == 'point' && item.description) {
                                item.description = item.description.search(/desc/) > -1 ? JSON.parse(item.description).desc : item.description;
                            }
                            tableData.push(item);
                        });
                        this[dataName].tableData = tableData;
                        this[dataName].pagination.totalCount = ( name == 'coupon') ? list.length : res.body.data.totalCount;
                    } else {
                        this[dataName].pagination.totalCount = 0;
                    }
                    // console.log(this[dataName])
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                    this.dataLoading = false;
                });
            }
        },
        // 获取会员等级
        getLevels() {
            this.$http.get('user/user-system/level-list').then(res => {
                if (res.body.code !== 0) {
                    this.$notify.error(res.body.message || '发生错误');
                    return;
                }
                let levels = {};
                res.body.data.forEach((item) => {
                    levels[item.id] = item.levelName;
                });
                this.levels = levels;
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        // 切换tab
        handleTabClick(tab) {
            if (!tab.isDataIninted) {
                this.getData(tab.name);
                tab.isDataIninted = true;
            }
        },
        // 修改当前页
        changePage(value, name) {
            if (name) {
                if(name === 'cart') {
                    this[name + 'Data'].pagination.pageNum = value;
                } else {
                    this[name + 'Data'].pagination.pageNo = value;
                }
            } else {
                this.pagination.pageNo = value;
            }
            this.getData(this.options.tabActive);
        },
        // 修改每页显示数
        changePageSize(value, name) {
            // console.log('changePageSize', name)
            if (name) {
                this[name + 'Data'].pagination.pageSize = value;
                if(name === 'cart') {
                    this[name + 'Data'].pagination.pageNum = 1;
                } else {
                    this[name + 'Data'].pagination.pageNo = 1;
                }
            } else {
                this.pagination.pageSize = value;
                this.pagination.pageNo = 1;
            }
            this.getData(this.options.tabActive);
        },
        // 删除标签
        async handleDelTagClick(item, index, isConfirm) {
            if(isConfirm) {
                await  this.$confirm('确定删除该标签?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            }
            this.$http.post('user/index/del-user-label', { labelId: item.id, userId: this.$route.query.userId }).then(res => {
                if (res.body.code !== 0) {
                    this.$message.error('删除出错');
                    return;
                }
                if(isConfirm) {
                    this.$message.success('删除成功');
                    this.info.labelList.splice(index, 1);
                }
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        handleBtnSaveClick(flag) {
            let params = {};
            switch(flag) {
                case 'activeStatus':
                    if(this.info.isValidateEmail == this.preValidateEmail) { this.isValidateEmail = false;  return; }
                    params.isValidateEmail = this.info.isValidateEmail;
                    params.remark = this.info.remark;
                break;
                case 'remark':
                    let date = new Date();
                    if(this.remarkForm.remark) {
                        this.remarks = {
                            userName: this.$store.getters.getUserName,
                            date: date.getTime() / 1000,
                            remark: this.remarkForm.remark
                        };
                    }
                    // params.isValidateEmail = this.info.isValidateEmail;
                    params.remark = JSON.stringify(this.remarks);
                break;
            }            
            params.userId = this.info.userId;
            params.siteCode = this.$store.state.site;
            
            this.$http.post('user/index/edit', params).then(res => {
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '发生错误');
                    return;
                }
                this.isValidateEmail = false;
                this.remarkForm.isShow = false;
                this.$message.success(res.body.message || '保存成功');
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
                this.dataLoading = false;
            });
        },
        // 修改订阅状态
        changeEmailSub() {
            if(this.info.isEmailSub == this.preEmailSubscribe) { this.isEmailSubscribe = false; return; }
            let params = {
                userId: this.$route.query.userId,
                isSubscribed: this.info.isEmailSub
            };
            this.$http.post('user/mail-subscribe/edit', params).then(res => {
                // console.log(res);
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '发生错误');
                    return;
                }
                this.isEmailSubscribe = false;
                this.$message.success(res.body.message || '修改成功');
            }, (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        // 修改状态
        editStatus(status) {
            switch(status) {
                case 'validateEmail':
                    this.preValidateEmail = this.info.isValidateEmail;
                    this.isValidateEmail = true;
                break;

                case 'emailSubscribe':
                    this.preEmailSubscribe = this.info.isEmailSub;
                    this.isEmailSubscribe = true;
                break;
            }
        },
        // 取消修改
        cancelStatus(status) {
            switch(status) {
                case 'validateEmail':
                    this.isValidateEmail = false;
                    this.info.isValidateEmail = this.preValidateEmail;
                break;

                case 'emailSubscribe':
                    this.isEmailSubscribe = false;
                    this.info.isEmailSub = this.preEmailSubscribe;
                break;
            }
        },
        // 新增备注信息
        changeRemark() {
            this.remarkForm.isShow = true;
        },
        // 显示
        showTafSelect() {
            this.info.labelList = this.info.labelList.concat([]);   
            this.$nextTick(() => {
                this.isShowTagList = true;
            }) 
        },
        // 打标签
        handleSearchForTag(selectedTagList) {
            let tags = []; 
            selectedTagList.forEach((item) => {
                tags.push({
                    id: item.id,
                    labelTypeId: item.labelTypeId,
                    labelTypeType: item.labelTypeType
                })
            });
            let params = { memLabelReqs: tags };
            params.userIds = [this.$route.query.userId];
            params.bindSource = 2;
            this.$http.post('user/index/bind-user-label', params).then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.isShowTagList = false;
                    this.$nextTick(() => {
                        this.info.labelList = selectedTagList;
                    });
                } else {
                    this.$message.error(res.body.message);
                }
            },
            (err) => {
                this.$message.error(res.body.message || '发生错误');
            });
        }

    }
}
</script>
<style lang="less">
.line-title { margin-top: 10px; position: relative; //#58B7FF
    &:before { position: absolute; top: 50%; left: 0; right: 0; height: 0; margin-top: -1px; border-bottom: 2px solid #d1dbe5; content: " "; z-index: 1; }
    > span { padding: 0 10px; background: #fff; position: relative; left: 20px; z-index: 2; }
}
.col-info > .el-row { padding: 10px 0; }

.tags-wrap { padding-left: 30px;
    .el-tag { margin: 0 10px 5px 0; }
}

.addrs-wrap { display: flex; flex-wrap: wrap;
    > .box-card { flex: 0; min-width: 350px; margin: 0 20px 20px 0; position: relative; }
    .box-add { min-height: 200px;
        div { position: absolute; top: 0; right: 0; bottom: 0; left: 0; cursor: pointer; }
        i { position: absolute; top: 50%; left: 0; width: 100%; margin-top: -25px; text-align: center; font-size: 50px; }
    }
}
.member-info {
    .member-info-border{
        border: 1px solid #d1dbe5;
    }
    .member-info-col {
        padding-left: 0!important;
        padding-right: 0!important;
    }
    .member-info-row {
        margin-left: 0!important;
        margin-right: 0!important;
    }
    .member-info-avatar-container {
        background: #eaeefb;
        .member-info-avatar {
            width: 200px;
            margin: auto;
        }
    }
    .member-container {
        .member-header{
            background: #eaeefb;
            height: 40px;
            line-height: 40px;
            padding-left: 10px;
            .remark-btn{
                margin-top: 6px;
                margin-right: 6px;
            }
        }
        .member-content{
            padding: 15px;
            p {
                margin-bottom: 15px;
                .content-title{
                    display: inline-block;
                    width: 100px;
                    margin-right: 40px;
                }
            }
        }
    }
    .member-account, .member-message{
        margin-top: 20px;
    }
    .member-info-tags-container{
        padding: 20px;
        .el-tag {
            margin-right: 10px;
            margin-top: 5px;
        }
        .member-info-tags-button{
            margin-left: 20px;
        }
    }
    .member-account-button{
        padding: 0;
        margin-left: 20px;
    }
    .member-remark-content{
        margin-bottom: 10px;
        span.remark-time{
            margin-right: 10px;
        }
        p{
            margin-bottom: 5!important;
        }
    }
}
.el-sub-menber-container{
    padding: 30px 0;
}
.el-remark-container{
    textarea{
        height: 100px!important;
    }
}
.good-info-container{
    margin: 10px;
    & > img, & > div {
        display: inline-block;
    }
    & > img {
        vertical-align: top;
        width: 100px;
        height: 100px;
    }
    & > div {
        width: 200px;
        vertical-align: top;
        & > p {
            margin: 0;
            clear: both;
            & > span {
                &:nth-child(1) {
                    float: left;
                }
                &:nth-child(2) {
                    float: right;
                }
            }
        }
    }
}
</style>
