<template>
    <div class="goods-eidt-css">
        <div class="el-container">
            <el-form label-width="140px" ref="postForm" :model="option" :rules="postRule">
                <el-tabs class="full good-edit-tabs" active-name="1">
                    <el-tab-pane label="商品基础资料" name="1">
                        <el-form-item label="商品标题">
                            {{option.goodTitle}}
                        </el-form-item>
                        <el-form-item label="商品副标题">
                            {{option.subTitle}}
                        </el-form-item>
                        <el-form-item label="外部商品编号">
                            {{option.webGoodSn}}
                        </el-form-item>
                        <el-form-item label="SKU">
                            {{option.goodSn}}
                        </el-form-item>
                        <el-form-item label="品牌/型号">
                            {{option.brandName}}
                        </el-form-item>
                        <el-form-item label="所属店铺">
                            {{option.shopName}}
                        </el-form-item>
                        <el-form-item label="商品类型">
                            <span v-if="option.goodsStyle == 1">普通商品</span>
                            <span v-if="option.goodsStyle == 2">捆绑商品</span>
                        </el-form-item>
                        <el-form-item label="所含子商品" v-if="option.goodsCombinationList.length > 0">
                            <table class="table-custom good-edit">
                                <thead>
                                    <tr>
                                        <th>商品SKU</th>
                                        <th>数量</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in option.goodsCombinationList" :key="index">
                                        <td>{{item.subGoodSn}}</td>
                                        <td>{{item.num}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <table class="table-custom good-edit">
                                <thead>
                                    <tr>
                                        <th>所属分类</th>
                                        <th>状态</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in option.categoryList" :key="item.categoryId">
                                        <td>{{item.categoryName}}</td>
                                        <td><span v-if="item.isDefault == 1">默认分类</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                        <el-form-item label="页面提示性文字">
                            <el-input v-model="option.tips"></el-input>
                        </el-form-item>
                        <el-form-item label="商品排序" prop="sort">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="渠道" prop="pipelineCode">
                                        <el-select v-model="option.pipelineCode" @change="changePipe">
                                            <el-option v-for="(item, index) in pipeRelationship" :key="index" :value="index" :label="pipeOpt[index]"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="排序值" prop="pipelineCode">
                                        <el-input v-model="option.sort" placeholder="保存时排序不能为空，且为大于0的整数"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品销售资料" name="2">
                        <el-form-item label="商品性质">
                            {{proText}}
                        </el-form-item>
                        <el-form-item label="商品主图类型">
                            <el-row>
                                <el-col :span="16">
                                    <el-select filterable v-model="option.mainType">
                                        <el-option v-for="item in typeOpt" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-button type="primary" @click="prview">设置主图-预览</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="商品视频链接">
                            <el-row :class="{'mrt10': index != 0}" v-for="(item, index) in youtubeList" :key="index">
                                <el-col :span="16">
                                    <el-input v-model="youtubeList[index]"></el-input>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-button v-if="index == 0" type="primary" icon="plus" @click="addYoutube"></el-button>
                                    <el-button v-if="index != 0" type="danger" icon="minus" @click="removeYoutube(item, index)"></el-button>
                                </el-col>
                            </el-row>
   <!--                          <el-input v-model="option.youtube"></el-input> -->
                        </el-form-item>
                        <el-form-item label="商品包邮状态" prop="isFreeShipping">
                            <el-radio-group v-model="option.isFreeShipping">
                                <el-radio :label='1'>包邮</el-radio>
                                <el-radio :label='0'>不包邮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="商品自定包邮分区">
                            <el-form inline>
                                <el-form-item label="渠道" class="el-sub-container">
                                    <el-select v-model="shipPipe" @change="changeShipPipe">
                                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <table class="table-custom good-edit">
                                <thead>
                                    <tr>
                                        <th>所属仓库</th>
                                        <th>包邮分区ID</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in option.goodsWeightFreeDivList" :key="index">
                                        <td>{{item.whName}}</td>
                                        <td>{{item.weightFreeDivision}}</td>
                                        <td>
                                            <el-button v-if="self.showAction_('goods/goods/delete-goods-free-division')" type="danger" size="small" @click="resetShip(item)">重置</el-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                        <el-form-item label="商品默认发货时间">
                            <table class="table-custom good-edit">
                                <thead>
                                    <tr>
                                        <th>所属仓库</th>
                                        <th>默认发货时间</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in option.defaultDeliveryTimeList" :key="index">
                                        <td>{{item.name}}</td>
                                        <td>{{item.defaultDeliveryTime}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                        <el-form-item label="商品自定义发货时间">
                            <el-button type="primary" @click="shipEdit" v-loading="shipEditLoading" :disabled="shipEditLoading">添加发货时间</el-button>
                            <br>
                            <br>
                            <table class="table-custom">
                                <thead>
                                    <tr>
                                        <th>所属仓库</th>
                                        <th>发货天数下限</th>
                                        <th>发货天数上限</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in option.customDeliveryList" :key="index">
                                        <td>{{item.whName}}</td>
                                        <td>{{item.customDeliveryMin}}</td>
                                        <td>{{item.customDeliveryMax}}</td>
                                        <td>
                                            <el-button v-if="self.showAction_('goods/goods/del-custom-delivery')" type="danger" size="small" @click="removeShip(item.virWhCode, index)">删除</el-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                        <el-form-item label="商品基础价格统计">
                            <table class="table-custom">
                                <thead>
                                    <tr>
                                        <th>批发采购价(￥)</th>
                                        <th>商品进货价(￥)</th>
                                        <th>商品出货价(￥)</th>
                                        <th>商品限价($)</th>
                                        <th>限价类型</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in option.queryInfo.goodBasicInfoList" :key="index">
                                        <td>{{item.batchPurchasePrice}}</td>
                                        <td>{{item.purchasePrice}}</td>
                                        <td>{{item.shipPrice}}</td>
                                        <td>{{item.limitPrice}}</td>
                                        <td>
                                            <span v-if="item.limitType == 1">普通限价</span>
                                            <span v-if="item.limitType == 2">严格限价</span>
                                            <span v-if="item.limitType == 3">不限价</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                        <el-form-item label="商品尺寸信息统计">
                            <table class="table-custom">
                                <thead>
                                    <tr>
                                        <th>商品重量(kg)</th>
                                        <th>商品包装重量(kg)</th>
                                        <th>商品销售重量(kg)</th>
                                        <th>商品体积重量(kg)</th>
                                        <th>商品尺寸(cm)</th>
                                        <th>商品包装尺寸(cm)</th>
                                        <th>商品销售尺寸(cm)</th>
                                        <th>超尺寸</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{option.originalWeight}}</td>
                                        <td>{{option.realityWeight}}</td>
                                        <td>{{option.saleWeight}}</td>
                                        <td>{{option.columeWeight}}</td>
                                        <td>{{option.goodSizeLong}} X {{option.goodSizeWide}} X {{option.goodSizeHigh}}</td>
                                        <td>{{option.packSizeLong}} X {{option.packSizeWide}} X {{option.packSizeHigh}}</td>
                                        <td>{{option.queryInfo.goodBasicInfoList[0].saleSizeLong}} X {{option.queryInfo.goodBasicInfoList[0].saleSizeWide}} X {{option.queryInfo.goodBasicInfoList[0].saleSizeHigh}}</td>
                                        <td>
                                            <span v-if="option.isOutSize == 1">是</span>
                                            <span v-else>否</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性资料" name="3">
                        <el-form-item label="商品规格">
                            <el-row>
                                <el-col :span="16">
                                    <table class="table-custom">
                                        <thead>
                                            <tr>
                                                <th>规格名称</th>
                                                <th>规格属性</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in option.goodsAttrList" :key="index">
                                                <td>
                                                    {{item.attrName}}
                                                </td>
                                                <td>
                                                    <span :style="{'background-color': item.attrColorExtend}" class="color-block" v-if="item.attrName === 'color'"></span>
                                                    <span v-if="item.attrValueAlias == ''">{{item.attrValue}}</span>
                                                    <span v-else>{{item.attrValueAlias}}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="商品描述属性">
                            <el-button type="primary" @click="goAttr('option')">预览</el-button>
                        </el-form-item>
                        <el-form-item label="商品详细描述">
                            <el-button type="primary" @click="goDetail(option.goodDesc)">预览</el-button>
                        </el-form-item>
                        <el-form-item label="商品特征">
                            <el-button type="primary" @click="goDetail(option.goodBrief)">预览</el-button>
                        </el-form-item>
                        <h3>商品详细SEO</h3>
                        <el-form-item label="标题(SEO)">
                            <el-input v-model="option.seoTitle" type="textarea" :rows="2"></el-input>
                        </el-form-item>
                        <el-form-item label="关键词(SEO)">
                            <el-input v-model="option.keyWord"></el-input>
                        </el-form-item>
                        <el-form-item label="描述(SEO)">
                            <el-input v-model="option.seoDesc" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品多语言资料" name="4">
                        <el-form label-width="140px" ref="langForm" :model="langForm">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="语言">
                                        <el-select v-model="lang" @change="langClick">
                                            <el-option v-for="item in langInfoList" :label="langObj[item.lang]" :value="item.lang" :key="item.lang"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="18" v-loading="langLoading">
                                    <el-form-item label="商品标题">
                                        {{langForm.goodTitle}}
                                    </el-form-item>
                                    <el-form-item label="商品副标题">
                                        {{langForm.subTitle}}
                                    </el-form-item>
                                    <el-form-item label="商品名称">
                                        {{langForm.goodName}}
                                    </el-form-item>
                                    <el-form-item label="页面提示性文字">
                                        <el-input v-model="langForm.tips"></el-input>
                                    </el-form-item>
                                    <el-form-item label="标题(SEO)">
                                        <el-input v-model="langForm.seoTitle" type="textarea" :rows="2"></el-input>
                                    </el-form-item>
                                    <el-form-item label="关键词(SEO)">
                                        <el-input v-model="langForm.keyWord"></el-input>
                                    </el-form-item>
                                    <el-form-item label="描述(SEO)">
                                        <el-input v-model="langForm.seoDesc" type="textarea" :rows="4"></el-input>
                                    </el-form-item>
                                    <el-form-item label="商品描述属性">
                                        <el-button type="primary" @click="goAttr('langForm')">预览</el-button>
                                    </el-form-item>
                                    <el-form-item label="商品详细描述">
                                        <el-button type="primary" @click="goDetail(langForm.goodDesc)">预览</el-button>
                                    </el-form-item>
                                    <el-form-item label="商品特征">
                                        <el-button type="primary" @click="goDetail(langForm.goodBrief)">预览</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <p class="cat-title"><strong>商品价格信息</strong></p>
            <el-form inline label-width="100px" class="el-container">
                <el-form-item label="生效渠道">
                    <el-select v-model="pricePipe" @change="changePricePipe">
                        <el-option v-for="(item, index) in pipeRelationship" :key="index" :value="index" :label="pipeOpt[index]"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="el-container">
                <table class="table-custom">
                    <thead>
                        <tr>
                            <th>价格类型</th>
                            <th>价格($)</th>
                            <th>利润率</th>
                            <th>价格计算规则</th>
                            <th>所含包邮运费（￥）</th>
                            <th>有效时间</th>
                            <th>当前是否生效</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody v-for="(item, index) in priceForm">
                        <tr>
                            <td colspan="8" class="goods-edit-table-th">
                                {{item.whName}}
                            </td>
                        </tr>
                        <tr>
                            <td>本店售价</td>
                            <td>{{item.shopPrice}}</td>
                            <td>{{item.rate}}</td>
                            <td><span v-if="item.shopPriceResp">{{priceCalcRule[item.shopPriceResp.priceLockType].label}}</span></td>
                            <td><span v-if="item.shopPriceResp">{{item.shopPriceResp.shipFee}}</span></td>
                            <td>---</td>
                            <td><i class="el-icon-circle-check color-success"></i></td>
                            <td><el-button v-if="self.showAction_('goods/goods/update-goods-price')" type="primary" size="small" @click="priceEdit('1', item)">编辑</el-button></td>
                        </tr>
                        <tr>
                            <td>市场售价</td>
                            <td>{{item.markPrice}}</td>
                            <td>{{item.markRate}}</td>
                            <td><span v-if="item.marketPriceResp">{{priceCalcRule[item.marketPriceResp.priceLockType].label}}</span></td>
                            <td><span v-if="item.marketPriceResp">{{item.marketPriceResp.shipFee}}</span></td>
                            <td>---</td>
                            <td><i class="el-icon-circle-check color-success"></i></td>
                            <td><el-button v-if="self.showAction_('goods/goods/update-goods-price')" type="primary" size="small" @click="priceEdit('2', item)">编辑</el-button></td>
                        </tr>
                        <tr>
                            <td>PDM清仓价</td>
                            <td>{{item.clearPrice}}</td>
                            <td>{{item.clearRate}}</td>
                            <td><span v-if="item.clearPriceResp">{{priceCalcRule[item.clearPriceResp.priceLockType].label}}</span></td>
                            <td><span v-if="item.clearPriceResp">{{item.clearPriceResp.shipFee}}</span></td>
                            <td>---</td>
                            <td><i class="el-icon-circle-check color-success"></i></td>
                            <td>不可编辑</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="text-center el-container">
                <el-button v-if="savebtn" type="primary" @click="save" v-loading="saveLoading" :disabled="saveLoading">保存</el-button>
                <el-button type="danger" @click="goback">取消</el-button>
            </div>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="设置自定义发货时间" v-model="shipDialog" size="tiny" @open="openShip">
            <el-form :model="shipForm" label-width="120px" ref="shipForm" :rules="shipRule">
                <el-form-item label="仓库" prop="whCode">
                    <el-select filterable v-model="shipForm.whCode">
                        <el-option v-for="(item, index) in shipOpt" :key="index" :value="item.vwhCode" :label="item.whName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货天数" required>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item prop="startDay">
                                <el-input v-model="shipForm.startDay"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" class="text-center">至</el-col>
                        <el-col :span="11">
                            <el-form-item prop="endDay">
                                <el-input v-model="shipForm.endDay"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="shipDialog = false">取 消</el-button>
                <el-button v-if="self.showAction_('goods/goods/save-custom-delivery')" type="primary" @click="postShip" v-loading="shipLoading" :disabled="shipLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 价格弹窗 -->
        <el-dialog :title="priceTitle" v-model="priceDialog" @open="openPrice">
            <el-form :model="priceEditForm" label-width="120px" ref="priceForm" :rules="priceRule">
                <el-form-item prop="type" label=" ">
                    <el-radio label="1" v-model="priceEditForm.type">输入利润率</el-radio>
                    <el-radio label="2" v-model="priceEditForm.type">输入价格</el-radio>
                </el-form-item>
                <el-form-item label="价格" v-loading="priceLoading" prop="inputPrice" required>
                    <el-input v-model="priceEditForm.inputPrice" :disabled="priceEditForm.type == '1'" @blur="getProfit"></el-input>
                    <span>计算利润率时，修改其他参数，请重置价格</span>
                </el-form-item>
                <el-form-item label="利润率" v-loading="profitLoading" prop="rate" required>
                    <el-input v-model="priceEditForm.rate" :disabled="priceEditForm.type == '2'" @blur="getPrice"></el-input>
                    <span>计算价格时，修改其他参数，请重置利润率</span>
                </el-form-item>
                <el-form-item label="价格尾数" v-if="priceEditForm.type == '1'" prop="endPrice">
                    <el-input v-model="priceEditForm.endPrice" @blur="changeEnd"></el-input>
                    <span>（不填则直接使用利润率计算出的价格，填写示例：0.99）</span>
                </el-form-item>
                <el-form-item label="生效平台">
                     <el-checkbox :disabled="true" :checked="true" v-for="item in platforms" :key="item.value">{{item.label}}</el-checkbox>
                </el-form-item>
                <el-form-item label="批量生效">
                    <el-form-item prop="warehouseIs" class="good-edit-rule-inline">
                        <el-checkbox v-model="priceEditForm.warehouseIs" true-label="1" false-label="2">所有仓库</el-checkbox>
                    </el-form-item>
                    <el-form-item prop="isSameStyle" class="good-edit-rule-inline">
                        <el-checkbox v-model="priceEditForm.isSameStyle" true-label="1" false-label="2">所有同款</el-checkbox>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="priceDialog = false">取 消</el-button>
                <el-button v-if="self.showAction_('goods/goods/update-goods-price')" type="primary" @click="postPrice" v-loading="updateLoading" :disabled="updateLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 商品描述属性 -->
        <el-dialog :title="priceTitle" v-model="attrDialog" class="good-edit-attr-dialog">
            <el-table border :height="attrList.length > 10 ? 400 : ''" :data="attrList">
                <el-table-column prop="descAttrName" label="规格名称"></el-table-column>
                <el-table-column prop="descAttrValue" label="规格属性"></el-table-column>
            </el-table>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="attrDialog = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="描述" v-model="detailDialog" class="good-edit-attr-dialog">
            <div v-html="detailValue"></div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="detailDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="主图预览" v-model="prviewDialog" class="good-prew-dialog">
            <div v-for="(item, index) in prviewForm" :key="index" class="good-edit-prew">
                <div class="item">
                    <h4><el-radio :label="index" v-model="checkType">{{typeOpt[index].label}}</el-radio></h4>
                    <ul>
                        <li v-if="mainTypeOpts[index]">
                            <img :src="mainTypeOpts[index].colorPic" width="90" height="120">
                            <div class="text-center tip">颜色图</div>
                        </li>
                        <li v-for="(img, index) in item" :key="index">
                            <img :src="domain + img.thumbUrl" width="90" height="120">
                            <div class="text-center tip"><span v-if="img.isMain == '1'">主图</span></div>
                        </li>
                    </ul>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="prviewDialog = false">取 消</el-button>
                <el-button v-if="self.showAction_('goods/goods/batch-set-main-picture')" type="primary" @click="postPrview" v-loading="mainLoading" :disabled="mainLoading">确 认</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        function setOpts(arr){
            if(Array.isArray(arr)){
                let temp = {};
                arr.map(item => {
                    let tempArr = item.split('=');
                    temp[tempArr[1]] = {};
                    temp[tempArr[1]].label = tempArr[0];
                    temp[tempArr[1]].value = tempArr[1];
                })

                return temp;
            }else{
                throw new Error('必须传入一组字符串数组,每个字符串格式为"label=value"');
            }
        }

        let checkPrice = function (rule, value, callback) {
            if (Number(value)) {
                callback();
            } else {
                callback(new Error('该项为数字，且不能为0或空'));
            }
        }

        let checkRate = function (rule, value, callback) {
            let exp = /^(0\.\d(\d?){2})$|^([1-9]\d*(\.\d(\d?){2})?)$/;
            if (exp.test(value)) {
                callback();
            } else {
                callback(new Error('该项为正，最多3位小数'));
            }
        }

        let checkEnd = function (rule, value, callback) {
            if (!value || (Number(value) > 0 && Number(value) < 1)) {
                callback();
            } else {
                callback(new Error('该项应为数字,且大于0小于1'));
            }
        }

        let checkSort = function(rule, value, callback) {
            if (Number(value) >= 0 && Number.isInteger(value * 1)) {
                callback();
            } else {
                callback(new Error('排序为大于等于0的整数'));
            }
        }

        return {
            lowestRate: '',
            youtubeList: [''],
            langInfoList: {},
            self: this,
            attrList: [],
            lang: '',
            priceLoading: false,
            profitLoading: false,
            updateLoading: false,
            shipEditLoading: false,
            shipLoading: false,
            mainLoading: false,
            saveLoading: false,
            langLoading: false,
            goodSn: this.$route.query.goodsSn,
            virWhCode: this.$route.query.virWhCode,
            typeOpt: setOpts(['网络图=1','自拍图=2','分销图=3']),
            isVirtualOpts: setOpts(['真实库存=0','虚拟库存=1']),
            platforms: setOpts(['PC=1', 'M端=2', 'IOS=3', 'ANDROID=4','PAD=5']),
            offSheetOpt: setOpts(['系统下架-PDM指令=1','系统下架-分类缺失=2', '系统下架-仓库缺失=3', '手动下架-危险品=4', '手动下架-暂停售卖=8']),
            onSheetOpt: setOpts(['系统上架-PDM指令=5','手动上架-新品=6', '手动上架-单网侵权=7']),
            priceCalcRule: setOpts(['未锁定=0','利润率锁定=1', '包邮运费锁定=2']),
            langOpt: [],
            langObj: {},
            // 0.82新增
            pipeRelationship: {},
            pipeInfo: {},
            pricePipe: '',
            shipPipe: '',
            mainTypeOpts: {},
            detailValue: '',
            langForm: {
                goodTitle: '',
                subTitle: '',
                goodName: '',
                tips: '',
                seoDesc: '',
                seoTitle: '',
                keyWord: '',
                goodDesc: '',
                goodBrief: '',
                proList: [],
                goodsAttrValueList: []
            },
            option: {
                queryInfo: {
                    goodBasicInfoList:[{
                        limitType: ''
                    }]
                },
                descProList: [],
                proList: [],
                goodsStyle: '',
                // categoryFreeShipping: '',
                goodTitle: '',
                subTitle: '',
                goodName: '',
                webGoodSn: '',
                goodSn: '',
                brandName: '',
                pdmAllCatName: '',
                tips: '',
                sort: '',
                pipelineCode: '',

                // remark: '',
                recommendedLevel: '',
                erpLevel: '',
                verifyStatus: '',
                isFreeShipping: '',
                mainType: '',
                youtube: '',
                whName: '',
                customDeliveryList: {
                    customDeliveryMin: '',
                    customDeliveryMax: '',
                },
                goodsAttrList: [],
                goodsAttrValueList: [],
                originalWeight: '',
                realityWeight: '',
                saleWeight: '',
                columeWeight: '',
                goodSizeLong: '',
                goodSizeWide: '',
                goodSizeHigh: '',
                packSizeLong: '',
                packSizeWide: '',
                packSizeHigh: '',
                seoTitle: '',
                keyWord: '',
                seoDesc: '',
                isVirtual: '',
                categoryList: [],
                shopName: '',
                goodsCombinationList: [],
            },
            priceForm: [{
                clearPrice: '',
                clearRate: '',
                markPrice: '',
                markRate: '',
                shopPrice: '',
                rate: '',
                stock: '',
                isVirtual: '',
                vwhCode: '',
                whName: ''
            }],
            priceDialog: false,
            priceEditForm: {
                isSameStyle: '2',
                type: '1',
                rate: '',
                warehouseIs: '2',
                // rule: '0',
                inputPrice: '',
                endPrice: '',
                whCode: '',
            },
            priceTitle: '',
            shipForm: {
                whCode: '',
                startDay: '',
                endDay: '',
            },
            shipOpt: [],
            shipDialog: false,
            attrDialog: false,
            detailDialog: false,
            prviewDialog: false,
            checkType: '',
            prviewForm: {},
            priceRule: {
                endPrice: [{
                    validator: checkEnd,
                    trigger: 'blur'
                }],
                inputPrice: [{
                    validator: checkPrice,
                    trigger: 'blur'
                }],
                rate: [{
                    validator: checkRate,
                    trigger: 'blur'
                }]
            },
            postRule: {
                sort: [{
                    validator: checkSort,
                    trigger: 'blur'
                }]
            },
            shipRule: {
                whCode: [{
                    required: true,
                    message: '该项不能为空',
                }],
                startDay: [{
                    required: true,
                    message: '该项不能为空',
                }],
                endDay: [{
                    required: true,
                    message: '该项不能为空',
                }],
            }
        };
    },
    created () {
        this.getOpt();
        this.getData();
        this.getLowest();
    },
    computed: {
        proText () {
            if (this.option.proList && this.option.proList.length > 0) {
                let temp = [];
                this.option.proList.map(item => {
                    temp.push(item.propertyName);
                });
                return temp.join(',');
            } else {
                return '';
            }
        },
        domain () {
            return this.$store.getters.getDomain + '/';
        },
        savebtn () {
            return this.lang == 'en' ? this.showAction_('goods/goods/save-goods-info') : this.showAction_('goods/goods/save-goods-lang-info');
        },
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        },
        storeOpt () {
            return this.$store.getters.getStore.obj;
        },
    },
    methods: {
        // 获取语言下拉
        async getOpt () {
            const data = await this.httpGet_('admin/public/languages');
            this.langOpt = data;
            this.lang = 'en';

            data.forEach(item => {
                this.langObj[item.language_en] = item.language_ch;
            })
        },
        async getData () {
            let params = {};
            params.virWhCode = this.virWhCode;
            params.goodsSn = this.goodSn;
            params.lang = 'en';

            let res = await this.httpGet_('goods/goods/goods-info', {params: params});

            let data = res.info;
            for (let i in this.option) {
                if (data[i]) {
                    this.option[i] = data[i];
                }
            }

            let keyList = Object.keys(this.option);
            data.siteMultiLangGoodsList.forEach(info => {
                if (info.lang == 'en') {
                    for (let key in info) {
                        if (keyList.indexOf(key) != -1) {
                            this.option[key] = info[key];
                        }
                    }
                }
                this.langInfoList[info.lang] = info;

            });
            this.langClick(this.lang);

            res.price.forEach(item => {
                this.pipeRelationship[item.pipelineCode] = item;
            });


            if (res.price[0]) {
                this.option.pipelineCode = this.pricePipe = this.shipPipe = res.price[0].pipelineCode;
            }

            let mainData = res.images.goodsPictureTypeRelationList[0];
            this.option.mainType = this.checkType = mainData.type + '';

            let picList = {};
            let picObj = {};
            res.images.pictureList.forEach(item => {
                let type = String(item.type);
                if (item.isMain == 1) {
                    picObj[type] = item;
                }
                picList[type] = picList[type] || [];
                picList[type].push(item);
            })

            this.mainTypeOpts = picObj;
            this.prviewForm = picList;

            this.youtubeList = this.option.youtube ? this.option.youtube.split(',') : [''];
        },
        prview () {
            this.prviewDialog = true;
        },
        // 多语言资料展示
        langClick (val) {
            let data = this.langInfoList[val];
            if (data) {
                for (let i in this.langForm) {
                    if (data[i]) {
                        this.langForm[i] = data[i];
                    }
                }
            }
        },
        // 修改渠道获取对应排序
        changePipe(val) {
            this.option.sort = this.pipeRelationship[val].sort;
        },
        // 修改渠道获取对应价格
        changePricePipe(val) {
            this.priceForm = this.pipeRelationship[val].goodsEditPriceList;
        },
        // 修改渠道获取对应包邮分区
        changeShipPipe(val) {
            this.option.goodsWeightFreeDivList = this.pipeRelationship[val].goodsPipelineInfoList;
        },
        // 重置包邮分区
        async resetShip(row) {
            this.$confirm('确认重置包邮分区?', '提示').then(async () => {
                let params = {};
                params.goodSn = this.goodSn;
                params.virWhCode = this.virWhCode;
                params.pipelineCode = this.shipPipe;

                const data = await this.httpPost_('goods/goods/delete-goods-free-division', params);
                this.$message.success(data.message);
                this.getData();
            });
        },
        priceEdit (type, item) {
            if (type == '1') {
                this.priceTitle = '本店售价';
                this.priceEditForm.inputPrice = item.shopPrice;
                this.priceEditForm.rate = item.rate;
            } else {
                this.priceTitle = '市场售价';
                this.priceEditForm.inputPrice = item.markPrice;
                this.priceEditForm.rate = item.markRate;
            }
            this.priceEditForm.whCode = item.vwhCode;
            this.priceEditForm.pipelineCode = this.pricePipe;

            this.priceDialog = true;
        },
        postPrice () {
            this.$refs.priceForm.validate(async valid => {
                if (valid) {
                    let params = {};
                    params.goodSn = this.goodSn;
                    params.virWhCode = this.priceEditForm.whCode;
                    params.shopRateOrPrice = this.priceEditForm.type;
                    params.rate = this.priceEditForm.rate;
                    params.isSameStyle = this.priceEditForm.isSameStyle;
                    params.changeUser = this.$store.getters.getUserName;
                    params.endPrice = this.priceEditForm.endPrice;
                    params.warehouseIs = this.priceEditForm.warehouseIs;
                    params.pipelineCode = this.pricePipe;

                    if (params.shopRateOrPrice == '1') {
                        // params.lockType = this.priceEditForm.rule;
                    } else if (params.shopRateOrPrice == '2') {
                        params.inputPrice = this.priceEditForm.inputPrice;
                    }

                    if (this.priceTitle == '本店售价') {
                        params.updateShopOrMarketPrice = 1;
                    } else {
                        params.updateShopOrMarketPrice = 2;
                    }

                    if (params.shopRateOrPrice == '1' && this.lowestRate > params.rate) {
                        let title = `编辑利润率小于站点最低利润率${this.lowestRate}，是否继续计算商品价格？`;
                        this.$confirm(title, '提示').then(async () => {
                            this.updateLoading = true;
                            try {
                                const data = await this.httpPost_('goods/goods/update-goods-price', params);
                                this.$message.success(data.message);
                                this.priceDialog = false;
                                this.getData();
                            } finally {
                                this.updateLoading = false;
                            }
                        });
                    } else {
                        this.updateLoading = true;
                        try {
                            const data = await this.httpPost_('goods/goods/update-goods-price', params);
                            this.$message.success(data.message);
                            this.priceDialog = false;
                            this.getData();
                        } finally {
                            this.updateLoading = false;
                        }
                    }
                }
            })
        },
        async shipEdit () {
            this.shipEditLoading = true;
            try {
                const data = await this.httpGet_('goods/goods/get-goods-virtual-wares', {params: {goodSnList: [this.goodSn]}});
                this.shipOpt = data.siteGoodsInfo;
                this.shipDialog = true;
            } finally {
                this.shipEditLoading = false;
            }
        },
        postShip () {
            this.$refs.shipForm.validate(async valid => {
                if (valid) {
                    let d1 = this.shipForm.startDay;
                    let d2 = this.shipForm.endDay;

                    if (Number(d1) > 0 && Number.isInteger(d1 * 1) && Number(d2) > 0 && Number.isInteger(d2 * 1) && (Number(d1) <= Number(d2))){

                    } else {
                        this.$message.warning('发货天数只能输入正数，且起始值小于或等于结束值');
                        return;
                    }

                    let params = {};

                    for (let i in this.shipForm) {
                        params[i] = this.shipForm[i];
                    }
                    params.goodSn = this.goodSn;

                    this.shipLoading = true;
                    try {
                        const data = await this.httpPost_('goods/goods/save-custom-delivery', params);
                        this.shipDialog = false;
                        this.getData();
                        this.$message.success(data.message);
                    } finally {
                        this.shipLoading = false;
                    }
                }
            });
        },
        async save () {
            let params = {};
            let src = 'goods/goods/save-goods-info';
            if (this.lang === 'en') {
                this.$refs.postForm.validate(async valid => {
                    if (valid) {
                        let data = this.option;
                        params.goodSn = this.goodSn;
                        params.virWhCode = this.virWhCode;
                        params.isFreeShipping = data.isFreeShipping ? data.isFreeShipping : 2;
                        params.sort = data.sort;
                        // params.youtube = data.youtube;
                        params.youtube = this.youtubeList.join(',');
                        params.tips = data.tips;
                        params.keyword = data.keyWord;
                        params.goodDesc = data.goodDesc;
                        params.seoTitle = data.seoTitle;
                        params.seoDesc = data.seoDesc;
                        params.pipelineCode = data.pipelineCode;

                        let temp = {};
                        for (let i in params) {
                            let item = params[i];
                            if (item === '' || typeof item == 'undefined') {

                            } else {
                                temp[i] = item;
                            }
                        }
                        params = temp;

                        this.saveLoading = true;
                        try {
                            const data = await this.httpPost_(src, params);
                            this.$message.success(data.message);
                        } finally {
                            this.saveLoading = false;
                        }
                    }
                })
            } else {
                params.tips = this.langForm.tips;
                params.seoDesc = this.langForm.seoDesc;
                params.seoTitle = this.langForm.seoTitle;
                params.keyword = this.langForm.keyWord;
                params.lang = this.lang;
                params.goodSn = this.goodSn;
                src = 'goods/goods/save-goods-lang-info';

                this.saveLoading = true;
                try {
                    const data = await this.httpPost_(src, params);
                    this.$message.success(data.message);
                } finally {
                    this.saveLoading = false;
                }
            }
        },
        async getProfit () {
            let exp = /^(0\.\d\d?)$|^([1-9]\d*(\.\d\d?)?)$/;
            if (!exp.test(this.priceEditForm.inputPrice)) {
                this.$message.warning('价格必填，最多2位小数');
                return ;
            }

            let params = {};
            params.calculateType = 1;
            params.promotionPrice = this.priceEditForm.inputPrice;
            params.isSave = false;
            params.goodSn = this.goodSn;
            // 0.82修改
            params.virWhCode = this.priceEditForm.whCode;
            params.pipelineCode = this.priceEditForm.pipelineCode;
            //
            // params.isShipFeeLock = this.priceEditForm.rule == '2' ? 1 : 2;
            // params.isRateLock = this.priceEditForm.rule == '1' ? 1 : 2;
            params.changeUser = this.$store.getters.getUserName;
            params.promotionCalculate = false;

            if (this.priceTitle == '本店售价') {
                params.priceType = 1;
            } else {
                params.priceType = 2;
            }

            this.profitLoading = true;
            try {
                const data = await this.httpGet_('goods/goods/goods-price-rate', {params: params});
                this.priceEditForm.rate = data.goodsPriceList[0].rate;
                this.priceEditForm.inputPrice = data.goodsPriceList[0].shopPrice;

                if (data.goodsPriceList[0].priceMark == 1) {
                    this.$message.warning('已启用最低利润率');
                } else if (data.goodsPriceList[0].priceMark == 2) {
                    this.$message.warning('已启用最低利润率和限价');
                }
            } finally {
                this.profitLoading = false;
            }
        },
        async getPrice () {
            let params = {};
            let exp = /^(0\.\d(\d?){2})$|^([1-9]\d*(\.\d(\d?){2})?)$/;
            if (!exp.test(this.priceEditForm.rate)) {
                this.$message.warning('利润率必填，且为正数，最多3位小数');
                return false;
            }
            if (this.priceEditForm.endPrice) {
                if (this.priceEditForm.endPrice >= 1 || this.priceEditForm.endPrice < 0) {
                    this.$message.warning('价格尾数在0到1之间');
                    return false;
                }
            }
            // params.calculateType = 1;
            params.isSave = false;
            params.goodSn = this.goodSn;
            // 0.82修改
            params.virWhCode = this.priceEditForm.whCode;
            params.pipelineCode = this.priceEditForm.pipelineCode;
            //
            params.rate = this.priceEditForm.rate;
            // params.isShipFeeLock = this.priceEditForm.rule == '2' ? 1 : 2;
            // params.isRateLock = this.priceEditForm.rule == '1' ? 1 : 2;
            params.mantissa = this.priceEditForm.endPrice;
            params.promotionCalculate = false;

            if (this.priceTitle == '本店售价') {
                params.priceType = 1;
            } else {
                params.priceType = 2;
            }

            for (let i in params) {
                if (params[i] == '') {
                    this.$delete(params, i);
                }
            }
            params.changeUser = this.$store.getters.getUserName;

            this.priceLoading = true;
            try {
                const data = await this.httpGet_('goods/goods/goods-price', {params: params});
                this.priceEditForm.rate = data.goodsPriceList[0].rate;
                this.priceEditForm.inputPrice = data.goodsPriceList[0].shopPrice;

                if (data.goodsPriceList[0].priceMark == 1) {
                    this.$message.warning('已启用最低利润率');
                } else if (data.goodsPriceList[0].priceMark == 2) {
                    this.$message.warning('已启用最低利润率和限价');
                }
            } finally {
                this.priceLoading = false;
            }
        },
        async postPrview () {
            let params = {};
            params.type = this.checkType;
            params.goodSnList = [this.goodSn];

            this.mainLoading = true;
            try {
                const data = await this.httpPost_('goods/goods/batch-set-main-picture', params);
                this.getData();
                this.$message.success(data.message);
                this.prviewDialog = false;
            } finally {
                this.mainLoading = false;
            }
        },
        removeShip (whcode, index) {
            this.$confirm('确定删除商品在本仓库的自定义发货时间？', '提示').then(async () => {
                let params = {};
                params.goodsSn = this.goodSn;
                params.vwhCodeList = [whcode];

                const data = await this.httpPost_('goods/goods/del-custom-delivery', params);
                this.$message.success(data.message);
                this.option.customDeliveryList.splice(index, 1);
            }).catch(err => {
                this.$message.info('已取消')
            })
        },
        goDetail (value) {
            this.detailValue = value;
            this.detailDialog = true;
        },
        goback () {
            history.back();
        },
        goAttr (formName) {
            this.attrList = this[formName].goodsAttrValueList;
            this.attrDialog = true;
        },
        openShip () {
            this.$nextTick(() => {
                this.$refs.shipForm.resetFields();
            });
        },
        openPrice () {
            this.$nextTick(() => {
                this.$refs.priceForm.resetFields();
                this.priceEditForm.endPrice = '';
            })
        },
        changeEnd () {
            if (this.priceEditForm.type == 1) {
                this.getPrice();
            } else {
                this.getProfit();
            }
        },
        // 获取最低利润率
        async getLowest() {
            const price = await this.httpGet_('goods/price/get-price-config', {params: {isLeaves:true}});
            this.lowestRate = price.basePriceConfigResp[0].lowestRate;
        },
        // 视频交互
        addYoutube() {
            this.youtubeList.push('');
        },
        removeYoutube(item, index) {
            if (item === '') {
                this.youtubeList.splice(index, 1);
            } else {
                this.$confirm('注意：保存页面数据后，将会删除本条数据。确认是否继续操作？', '提示').then(() => {
                    this.youtubeList.splice(index, 1);
                });
            }
        },
    }

}
</script>
<style lang="less">
    .goods-eidt-css {
        .mrt10 {
            margin-top: 10px;
        }

        .good-edit-tabs {

            .el-tabs__content {
                width: 70%;
            }
        }

        .good-edit-rule-inline {
            margin-left: 10px;
            display: inline-block;
        }

        .good-edit-attr-dialog {

            .el-dialog {
                max-height: 600px;
                overflow-y: auto;
            }

        }

        .goods-edit-table-th {
            background: #58B7FF;
            color: #fff;
        }

        .color-block {
            display: inline-block;
            width: 18px;
            height: 18px;
            vertical-align: middle;
            border: 1px solid #dcdcdc;
        }
    }


    .good-prew-dialog {

        .el-dialog__footer,.el-dialog__body {
            clear: both;
        }

        .good-edit-prew {

            .item {
                clear: both;

                h4 {
                    margin-bottom: 10px;
                }

                ul {
                    list-style: none;
                    clear: both;

                    li {
                        float: left;
                        padding-left: 5px;

                        &:first-child {
                            padding-left: 0;
                        }

                        .tip {
                            height: 36px;
                        }
                    }
                }
            }
        }
    }

</style>

