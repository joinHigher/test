<template>
    <div class="good-list">
        <div class="el-container">
            <p class="cat-title"><strong>筛选条件</strong></p>
            <div class="el-sub-container">
                <el-form :inline="true" :model="option" ref="searchForm" :rules="searchRule" label-width="120px" class="search-form">
                    <!-- quick search -->
                    <div>
                        <el-form-item label="快速搜索" prop="keyword">
                            <el-input v-model="option.keyword" class="quick-search" placeholder="外部商品编码(多编号“,”划分)">
                                <el-select filterable clearable v-model="option.field" slot="prepend" placeholder="请选择">
                                    <el-option v-for="(item, index) in opts.quickSearchOpts" :key="index" :label="item.label" :value="index">
                                    </el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="sameType">
                            <el-checkbox v-model="option.sameType">
                                显示同款产品
                                <span class="search-tip">(仅生效于快捷搜索中的SKU、外部商品编码)</span>
                            </el-checkbox>
                        </el-form-item>
                    </div>
                    <hr>
                    <!-- base search -->
                    <h3>商品基础资料筛选</h3>
                    <div>
                        <el-form-item label="分类:" prop="categoryId">
                            <el-cascader filterable clearable v-model="option.categoryId" class="cat-tree" :options="catTree" change-on-select :props="prop"></el-cascader>
                        </el-form-item>
                        <el-form-item label="已翻译语言:" prop="lang">
                            <el-select filterable clearable v-model="option.lang">
                                <el-option v-for="(item, index) in langOpt" :key="item.language_en" :label="item.language_ch" :value="item.language_en">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-form-item label="销售仓库:" prop="virWhCode">
                        <el-select filterable v-model="option.virWhCode" placeholder="请选择" clearable @change="getRealWare">
                            <el-option v-for="item in opts.warehouseOpts" :key="item.virWhCode" :label="item.virWhCnName" :value="item.virWhCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属渠道:" prop="pipelineCode">
                        <el-select filterable clearable v-model="option.pipelineCode" placeholder="请选择所属终端">
                            <el-option v-for="(item, index) in pipeOpt" :key="index" :label="item" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属终端:" prop="platform">
                        <el-select filterable clearable v-model="option.platform" placeholder="请选择所属终端">
                            <el-option v-for="item in opts.platforms" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="平台店铺:" prop="shopCode">
                        <el-select filterable clearable v-model="option.shopCode">
                            <el-option v-for="(item, index) in storeOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品状态:" prop="goodStatus">
                        <el-select filterable clearable v-model="option.goodStatus" placeholder="请选择商品状态">
                            <el-option v-for="item in opts.goodStatusOpts" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="包邮状态:" prop="isFreeShipping">
                        <el-select filterable clearable v-model="option.isFreeShipping" placeholder="请选择">
                            <el-option v-for="item in opts.isFreeShippingOpts" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主图类型:" prop="mainType">
                        <el-select filterable clearable v-model="option.mainType" placeholder="请选择">
                            <el-option v-for="item in opts.mainTypeOpts" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="首次上架时间" prop="firstUpTime">
                        <el-date-picker v-model="option.firstUpTime" type="datetimerange" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="状态变更时间" prop="goodStatusChangeTime">
                        <el-date-picker v-model="option.goodStatusChangeTime" type="datetimerange" :editable="false"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="本店售价:">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item prop="shopPriceStart">
                                    <el-input v-model="option.shopPriceStart"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" class="text-center">—</el-col>
                            <el-col :span="11">
                                <el-form-item prop="shopPriceEnd">
                                    <el-input v-model="option.shopPriceEnd"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
<!--                     <el-form-item label="商品标签:" prop="isLabel">
                        <el-select filterable clearable v-model="option.isLabel" placeholder="请选择">
                            <el-option label="is_cool" :value="1"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="商品类型:" prop="goodsStyle">
                        <el-select filterable clearable v-model="option.goodsStyle" placeholder="请选择">
                            <el-option label="普通商品" :value="1"></el-option>
                            <el-option label="捆绑商品" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-row>
                        <el-col :span="8">
                        </el-col>
                    </el-row>
                    <!-- query search -->
                    <div id="advancedFilter" v-show="isAdvancedFilter">
                        <h3>商品详细资料筛选</h3>
                        <el-form-item label="库存类型:" prop="stockTypeRealWhCodeList">
                            <el-select filterable clearable v-model="option.stockTypeRealWhCodeList" placeholder="请选择真实仓">
                                <el-option v-for="item in realWareOpt" :key="item.realWhCode" :label="item.name" :value="item.realWhCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="isVirtual">
                            <el-select filterable clearable v-model="option.isVirtual" placeholder="请选择">
                                <el-option v-for="item in opts.isVirtualOpts" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="销售标识:" prop="saleMarkRealWhCodeList">
                            <el-select filterable clearable v-model="option.saleMarkRealWhCodeList" placeholder="请选择真实仓">
                                <el-option v-for="item in realWareOpt" :key="item.realWhCode" :label="item.name" :value="item.realWhCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="saleMark">
                            <el-select filterable clearable v-model="option.saleMark" placeholder="请选择">
                                <el-option v-for="item in opts.saleMarkOpts" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="PDM审核状态:" prop="verifyStatus">
                            <el-select filterable clearable v-model="option.verifyStatus" placeholder="请选择">

                                <el-option v-for="item in opts.verifyStatusOpts" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="限价商品:" prop="limitType">
                            <el-select filterable clearable v-model="option.limitType" placeholder="请选择">

                                <el-option v-for="item in opts.limitTypeOpts" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="批发商品:" prop="batchPurchasePrice">
                            <el-select filterable clearable v-model="option.batchPurchasePrice" placeholder="请选择">
                                <el-option v-for="item in opts.wholesaleProOpts" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="PDM销售状态:" prop="saleTypeRealWhCodeList">
                            <el-select filterable clearable v-model="option.saleTypeRealWhCodeList" placeholder="请选择真实仓">
                                <el-option v-for="item in realWareOpt" :key="item.realWhCode" :label="item.name" :value="item.realWhCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="saleType">
                            <el-select filterable clearable v-model="option.saleType" placeholder="请选择">
                                <el-option v-for="item in opts.saleTypeOpts" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="PDM商品状态:" prop="companySourceStatus">
                            <el-select filterable clearable v-model="option.companySourceStatus" placeholder="请选择">
                                <el-option v-for="item in opts.companySourceStatusOpts" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="fold text-center">
                    <el-button @click="isAdvancedFilter = !isAdvancedFilter">
                        <span v-if="isAdvancedFilter">
                            基本筛选<i class="el-icon-arrow-up el-icon--right"></i>
                        </span>
                        <span v-else>
                            高级筛选<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                    </el-button>
                </div>
                <div class="text-right">
                    <el-button type="primary" icon="search" @click="getData()">筛选</el-button>
                    <el-button type="danger" icon="close" @click="resetForm">清空</el-button>
                </div>
            </div>
            <h2><span>筛选结果</span></h2>
            <el-row class="result-operation">
                <el-button :disabled="checkedRow.length === 0" type="primary" icon="fa-files-o" @click="copy('goodsWebSku')">复制外部商品编码</el-button>
                <el-button :disabled="checkedRow.length === 0" type="primary" icon="fa-files-o" @click="copy('goodSn')">复制SKU</el-button>
                <el-button v-if="self.showAction_('goods/goods/batch-save-sort')" :disabled="checkedRow.length === 0" type="primary" icon="fa-random" @click="openDialog('sortDialog')">排序</el-button>
                <el-button v-if="self.showAction_('goods/goods/goods-pipeline-del') && self.showAction_('goods/goods/goods-pipeline-add')" :disabled="checkedRow.length === 0" type="primary" icon="fa-cloud-upload" @click="openDialog('pipeDialog')">编辑商品渠道</el-button>
                <el-button :disabled="checkedRow.length === 0" type="primary" icon="fa-cloud-upload" @click="statusEdit">设置商品状态</el-button>
                <el-button v-if="self.showAction_('goods/goods/batch-save-video')" :disabled="checkedRow.length === 0" type="primary" icon="plus" @click="openDialog('addVideoDialog')">添加视频</el-button>
                <el-button v-if="self.showAction_('goods/goods/batch-set-main-picture')" :disabled="checkedRow.length === 0" type="primary" icon="fa-adjust" @click="openDialog('mainTypeDialog')">调整主图</el-button>
                <el-button v-if="self.showAction_('goods/goods/batch-add-recycle')" :disabled="checkedRow.length === 0" type="primary" icon="fa-ban" @click="openDialog('binDialog')">加入回收站</el-button>
                <el-button v-if="self.showAction_('goods/goods/batch-save-postage')" :disabled="checkedRow.length === 0" type="primary" icon="setting" @click="openDialog('shipDialog')">设置包邮</el-button>

                <el-button v-if="self.showAction_('goods/goods/add-category-good-relation')" :disabled="checkedRow.length === 0" type="primary" icon="fa-bandcamp" @click="openDialog('bindingDialog')">扩展商品分类</el-button>
                <el-button v-if="self.showAction_('goods/goods/transfer-category-good-relation')" :disabled="checkedRow.length === 0" type="primary" icon="fa-share-square-o" @click="openDialog('transportDialog')">设置商品主分类</el-button>
            </el-row>
            <el-row class="result-operation" style="margin:10px 0;">
                <el-button v-if="self.showAction_('goods/goods/batch-set-free-divison')" :disabled="checkedRow.length === 0" type="primary" icon="fa-ship" @click="shipAreaEdit">设置包邮分区</el-button>
                <el-button v-if="self.showAction_('stock/stock/get-real-wares')" :disabled="checkedRow.length === 0" type="primary" icon="fa-share-square-o" @click="openDialog('stockDialog')">设置库存类型</el-button>
                <el-button v-if="self.showAction_('stock/lucky-bag/add')" :disabled="checkedRow.length === 0" type="primary" @click="openDialog('goodsStockDialog')">设置商品库存</el-button>
                <el-button :disabled="checkedRow.length === 0" type="primary" @click="openDialog('goodsStockDialog')">设置商品库存</el-button>
                <el-popover ref="colPopo" placement="bottom" width="300" trigger="click">
                    <div class="good-col-set">
                        <el-checkbox-group v-model="colList">
                            <div>基本信息:</div>
                            <el-checkbox label="brandName">品牌</el-checkbox>
<!--                             <el-checkbox label="goodTitle">商品标题</el-checkbox> -->
                            <el-checkbox label="shopPrice">本店售价</el-checkbox>
                            <el-checkbox label="limitPrice">限价类型</el-checkbox>
                            <el-checkbox label="stock">库存</el-checkbox>
                            <el-checkbox label="isVirtual">库存类型</el-checkbox>
                            <el-checkbox label="shipDays">发货天数</el-checkbox>
                            <el-checkbox label="isFreeShipping">包邮状态</el-checkbox>
                            <el-checkbox label="mainType">主图类型</el-checkbox>
                            <el-checkbox label="shopCode">所属店铺</el-checkbox>
                            <el-checkbox label="pipelineCodeList">所属渠道</el-checkbox>
                            <el-checkbox label="shipPrice">出货价</el-checkbox>
                            <el-checkbox label="rate">利润率</el-checkbox>
                            <el-checkbox label="goodsSpu">SPU</el-checkbox>
                            <el-checkbox label="goodsWebSku">外部商品编码</el-checkbox>
                            <el-checkbox label="goodsWebSpu">外部产品编码</el-checkbox>
                            <el-checkbox label="sort">商品排序</el-checkbox>
                            <el-checkbox label="isLabel">商品标签</el-checkbox>
                            <el-checkbox label="saleMark">销售标识</el-checkbox>
                            <el-checkbox label="saleWeight">商品销售重量</el-checkbox>
                            <el-checkbox label="goodsAttrList">商品规格</el-checkbox>
                            <div>参考状态:</div>
                            <el-checkbox label="saleType">PDM销售状态</el-checkbox>
                            <el-checkbox label="verifyStatus">PDM审核状态</el-checkbox>
                            <el-checkbox label="companySourceStatus">PDM商品状态</el-checkbox>
                            <el-checkbox label="sourceStatus">PDM货源状态</el-checkbox>
                            <!-- <el-checkbox label="trotStatus">侵权状态</el-checkbox> -->
                            <div>上下架:</div>
                            <el-checkbox label="goodStatus">商品状态</el-checkbox>
                            <el-checkbox label="firstUpTime">首次上架时间</el-checkbox>
                            <el-checkbox label="statusUpdateTime">状态变更时间</el-checkbox>
                            <!-- <el-checkbox label="lastUpTime">最近上架时间</el-checkbox> -->
                        </el-checkbox-group>
                        <div class="el-sub-container text-center">
                            <el-button type="primary" @click="saveTitle">保存选择</el-button>
                        </div>
                    </div>
                </el-popover>
                <el-button type="primary" icon="setting" class="fr" v-popover:colPopo>设置表格内容</el-button>
            </el-row>
            <el-table :data="tableData" border @selection-change="checkRow" @row-click="clickRow" ref="dataTable" v-loading="tableLoading" style="width: 100%" class="list-table">
                <el-table-column type="selection" fixed="left"></el-table-column>
                <el-table-column prop="goodSn" width="120px" label="SKU" fixed="left"></el-table-column>
                <el-table-column width="200px" label="商品标题" v-if="colList.indexOf('goodTitle') !== -1" fixed="left">
                    <template scope="scope">
                        <pre class="title-pre">{{scope.row.goodTitle}}</pre>
                    </template>
                </el-table-column>
                <el-table-column prop="mainImage" label="主图" width="150px" fixed="left">
                    <template scope="scope">
                        <img class="table-img" :src="self.domain + scope.row.mainImage.thumbUrl" width="90" height="120">
                    </template>
                </el-table-column>
                <el-table-column label="商品状态" width="170px" v-if="colList.indexOf('goodStatus') !== -1">
                    <template scope="scope">
                        <p v-for="(item, index) in scope.row.goodsInfoExtendList" :key="index">{{self.tableRes('platforms', item.platform)}}: {{self.tableRes('goodStatusOpts', item.goodsStatus)}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsWebSku" width="140px" label="外部商品编码" v-if="colList.indexOf('goodsWebSku') !== -1"></el-table-column>
                <el-table-column prop="goodsSpu" width="100px" label="SPU" v-if="colList.indexOf('goodsSpu') !== -1"></el-table-column>
                <el-table-column prop="goodsWebSpu" width="140px" label="外部产品编码" v-if="colList.indexOf('goodsWebSpu') !== -1"></el-table-column>
                <el-table-column width="100px" label="商品标签" v-if="colList.indexOf('isLabel') !== -1">
                    <template scope="scope">
                        <span v-if="scope.row.isLabel == 1">is_cool</span>
                    </template>
                </el-table-column>
                <el-table-column label="销售标识" width="100px" v-if="colList.indexOf('saleMark') !== -1">
                    <template scope="scope">
                        {{self.tableRes('saleMarkOpts', scope.row.saleMark)}}
                    </template>
                </el-table-column>
                <el-table-column prop="brandName" width="140px" label="品牌" v-if="colList.indexOf('brandName') !== -1"></el-table-column>
                <el-table-column prop="shopCode" width="140px" label="所属店铺" v-if="colList.indexOf('shopCode') !== -1">
                    <template scope="scope">
                        {{storeOpt[scope.row.shopCode]}}
                    </template>
                </el-table-column>
                <el-table-column prop="shopCode" width="140px" label="所属渠道" v-if="colList.indexOf('pipelineCodeList') !== -1">
                    <template scope="scope">
                        <span v-for="(item, index) in scope.row.pipelineCodeList">
                            <span v-if="index != 0">,</span>
                            <span>{{pipeOpt[item]}}</span>
                        </span>
<!--                         {{pipeOpt[scope.row.pipelineCode]}} -->
                    </template>
                </el-table-column>
                <el-table-column prop="shopPrice" width="100px" label="本店售价" v-if="colList.indexOf('shopPrice') !== -1"></el-table-column>
                <el-table-column label="限价类型" v-if="colList.indexOf('limitPrice') !== -1">
                    <template scope="scope">
                        {{self.tableRes('limitTypeOpts', scope.row.limitType)}}
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="库存" v-if="colList.indexOf('stock') !== -1"></el-table-column>
                <el-table-column label="库存类型" v-if="colList.indexOf('isVirtual') !== -1" width="100px">
                    <template scope="scope">
                        <span v-if="scope.row.isVirtual == 1">虚拟库存</span>
                        <el-button v-else type="text" @click="checkRealWare(scope.row)">真实库存</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="发货天数" v-if="colList.indexOf('shipDays') !== -1">
                    <template scope="scope">
                        {{scope.row.customDeliveryMin}} - {{scope.row.customDeliveryMax}}
                    </template>
                </el-table-column>
                <el-table-column label="包邮状态" v-if="colList.indexOf('isFreeShipping') !== -1">
                    <template scope="scope">
                        {{self.tableRes('isFreeShippingOpts', scope.row.isFreeShipping)}}
                    </template>
                </el-table-column>
                <el-table-column label="主图类型" v-if="colList.indexOf('mainType') !== -1">
                    <template scope="scope">
                        {{self.tableRes('mainTypeOpts', scope.row.mainType)}}
                    </template>
                </el-table-column>
                <el-table-column prop="shipPrice" label="出货价" v-if="colList.indexOf('shipPrice') !== -1"></el-table-column>
                <el-table-column prop="saleWeight" label="商品销售重量" v-if="colList.indexOf('saleWeight') !== -1"></el-table-column>
                <el-table-column prop="goodsAttrList" label="商品规格" v-if="colList.indexOf('goodsAttrList') !== -1" width="100px">
                    <template scope="scope">
                        <span v-for="(item, index) in scope.row.goodsAttrList">
                            <span v-if="index !== 0">/</span>{{item.attrValue}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="rate" label="利润率" v-if="colList.indexOf('rate') !== -1"></el-table-column>
                <el-table-column prop="sort" label="商品排序" v-if="colList.indexOf('sort') !== -1"></el-table-column>
                <el-table-column label="首次上架时间" v-if="colList.indexOf('firstUpTime') !== -1" width="250px">
                    <template scope="scope">
                        <p v-for="(item, index) in scope.row.goodsInfoExtendList" :key="index">{{self.tableRes('platforms', item.platform)}}: {{self.timeZone_(item.firstUpTime, self.$store.getters.getTimeZone)}}</p>
                    </template>
                </el-table-column>
                 <el-table-column label="状态变更时间" v-if="colList.indexOf('statusUpdateTime') !== -1" width="250px">
                    <template scope="scope">
                        <p v-for="(item, index) in scope.row.goodsInfoExtendList" :key="index">{{self.tableRes('platforms', item.platform)}}: {{self.timeZone_(item.statusUpdateTime, self.$store.getters.getTimeZone)}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="PDM销售状态" v-if="colList.indexOf('saleType') !== -1">
                    <template scope="scope">
                        {{self.tableRes('saleTypeOpts', scope.row.saleType)}}
                    </template>
                </el-table-column>
                <el-table-column label="PDM审核状态" v-if="colList.indexOf('verifyStatus') !== -1">
                    <template scope="scope">
                        {{self.tableRes('verifyStatusOpts', scope.row.verifyStatus)}}
                    </template>
                </el-table-column>
                <el-table-column label="PDM商品状态" v-if="colList.indexOf('companySourceStatus') !== -1">
                    <template scope="scope">
                        {{self.tableRes('companySourceStatusOpts', scope.row.companySourceStatus)}}
                    </template>
                </el-table-column>
                <el-table-column label="PDM货源状态" v-if="colList.indexOf('sourceStatus') !== -1">
                    <template scope="scope">
                        {{self.tableRes('sourceStatusOpts', scope.row.sourceStatus)}}
                    </template>
                </el-table-column>

                <el-table-column prop="pcReasonType" label="PC商品状态变更" v-if="colList.indexOf('pcReasonType') !== -1"></el-table-column>
                <el-table-column prop="appReasonType" label="APP商品状态变更" v-if="colList.indexOf('appReasonType') !== -1"></el-table-column>
                <el-table-column prop="remark" label="商品备注" v-if="colList.indexOf('remark') !== -1"></el-table-column>
                <el-table-column prop="adminId" label="最后操作人" v-if="colList.indexOf('adminId') !== -1"></el-table-column>
                <el-table-column label="操作" width="140px" fixed="right" column-key="handle">
                    <template scope="scope">
                        <router-link v-if="self.showAction_('goods/goods/goods-info')" :to="{name: 'goods_goodsEdit', query: {goodsSn: scope.row.goodSn, virWhCode: scope.row.virWhCode}}" class="el-button el-button--primary el-button--small good-list-handle-btn">
                            详情
                        </router-link>
                        <el-button v-if="self.showAction_('goods/goods/modify-default-category')" class="good-list-handle-btn" size="small" @click="editCat(scope.row)">修改商品主分类</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right page-toolbar">
                <span class="style">共 {{styleCount}} 款,</span>
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
            <input id="copyTxt" v-model="copyTxt" class="hidden-input">
        </div>
        <!-- 弹窗S -->
        <el-dialog title="批量调整排序" v-model="sortDialog" @open="openSort">
            <el-form :model="sortForm" label-width="120px" ref="sortDialogForm" :rules="sortRule" >
                <el-form-item label="排序" prop="sortValue">
                    <el-input v-model="sortForm.sortValue"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="pipelineCode">
                    <el-select v-model="sortForm.pipelineCode">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="sortDialog = false">取 消</el-button>
                <el-button type="primary" @click="postSort" v-loading="sortLoading" :disabled="sortLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设置商品状态" v-model="statusDialog" size="large">
            <el-form :model="statusForm" label-width="120px" ref="statusDialogForm">
                <el-form-item label="已选择SKU">
                    <span class="good-dialog-sheet">{{skuList.join(',')}}</span>
                </el-form-item>
                <el-form-item label="设置状态为" prop="type" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-select filterable v-model="statusForm.type">
                        <el-option v-if="self.showAction_('goods/goods/batch-save-up')" :value="2" label="上架"></el-option>
                        <el-option v-if="self.showAction_('goods/goods/batch-save-down')" :value="3" label="下架"></el-option>
                        <el-option v-if="self.showAction_('goods/goods/batch-save-notice')" :value="4" label="到货通知"></el-option>
                        <el-option v-if="self.showAction_('goods/goods/save-good-photos')" :value="5" label="谍照"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择销售仓" v-if="statusForm.type != 4 && statusForm.type != 5">
                    <el-select multiple clearable filterable v-model="selectWare" @change="changeTable($event, 'statusOpt', 'virWhCode')">
                        <el-option v-for="(item, index) in defaultStatusOpt" :key="index" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作" v-if="statusForm.type === 2 || statusForm.type === 3">
                    <el-table :data="statusOpt" border :height="statusOpt.length > 8 ? 250 : 0" empty-text="请选择销售仓">
                        <el-table-column :render-header="sheetRender">
                            <template scope="scope">
                                <el-checkbox v-model="scope.row.checked" @change="checkRowStatus(scope.row, $event)">{{scope.row.virWhCnName}}</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column :label="item.name" v-for="(item, index) in terminalOpt" :key="index">
                            <template scope="scope">
                                <el-checkbox v-model="scope.row.terminal[index].check"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="选择销售仓" prop="warehouse" :rules="[{type: 'array', required: true, message: '该项不能为空', trigger: 'change'}]" v-if="statusForm.type === 4">
                    <el-select multiple clearable filterable v-model="statusForm.warehouse">
                        <el-option v-for="(item, index) in defaultStatusOpt" :key="index" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="到货通知价格" prop="isShopPrice" v-if="statusForm.type === 4">
                    <el-checkbox v-model="statusForm.isShopPrice">本店售价</el-checkbox>
                </el-form-item>
                <el-form-item label="起批量" prop="minWholesaleNum" :rules="[{validator: checkInt, trigger: 'blur' }]" v-if="statusForm.type === 4">
                    <el-input v-model="statusForm.minWholesaleNum"></el-input>
                </el-form-item>
                <el-form-item label="虚拟数" prop="arrivalVirtualNum" :rules="[{validator: checkInt, trigger: 'blur' }]" v-if="statusForm.type === 4">
                    <el-input v-model="statusForm.arrivalVirtualNum"></el-input>
                </el-form-item>
                <el-form-item label="生效时间" prop="editDate" :rules="[{type: 'array', required: true, message: '该项不能为空', trigger: 'blur' }, {validator: checkDateArr, trigger: 'change'}]" v-if="statusForm.type === 4">
                    <el-date-picker v-model="statusForm.editDate" type="datetimerange" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="谍照价格" v-if="statusForm.type === 5">
                    <el-checkbox v-model="statusForm.imgPrice">本店售价</el-checkbox>
                </el-form-item>
                <el-form-item label="选择终端" v-if="statusForm.type === 4 || statusForm.type === 5">
                    <el-checkbox v-model="checkFlag" disabled v-for="item in terminalOpt" :key="item.id">{{item.name}}</el-checkbox>
                </el-form-item>
                <el-form-item label="批量生效" v-if="statusForm.type === 5">
                    <el-checkbox v-model="statusForm.checkAll" :disabled="statusForm.type === 5" :checked="statusForm.type === 5">所有仓库</el-checkbox>
                </el-form-item>
                <el-form-item label="上架原因" v-if="statusForm.type == 2" prop="reasonType" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-select filterable v-model="statusForm.reasonType">
                        <el-option v-for="item in opts.onSheetOpt" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下架原因" v-if="statusForm.type == 3" prop="reasonType" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-select filterable v-model="statusForm.reasonType">
                        <el-option v-for="item in opts.offSheetOpt" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="mark" v-if="statusForm.type === 2 || statusForm.type === 3" label=" ">
                    <el-input class="good-dialog-remark" type="textarea" :rows="4" v-model="statusForm.mark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="statusDialog = false">取 消</el-button>
                <el-button v-if="statusBtn" type="primary" @click="postStatus" v-loading="statusLoading" :disabled="statusLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量添加YouTube视频" v-model="addVideoDialog" @open="openAddVideo">
            <el-form :model="addVideoForm" label-width="120px" ref="videoDialogForm" :rules="videoRule">
                <el-form-item label="Youtube编码" prop="list">
                    <el-row v-for="(item, index) in addVideoForm.list" :key="index" :class="index == 0 ? '' : 'good-dialog-remark'">
                        <el-col :span="16">
                            <el-input v-model="addVideoForm.list[index]" placeholder="请输入完整的视频链接，如：https://youtu.be/oKBdI_U0nHI"></el-input>
                        </el-col>
                        <el-col :span="6" :offset="1">
                            <el-button v-if="index === 0" type="primary" icon="plus" @click="addVideoForm.list.push('')"></el-button>
                            <el-button v-if="index !== 0" type="danger" icon="minus" @click="addVideoForm.list.splice(index, 1)"></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addVideoDialog = false">取 消</el-button>
                <el-button type="primary" @click="postVideo" v-loading="videoLoading" :disabled="videoLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量调整主图" v-model="mainTypeDialog" @open="openMainType">
            <el-form :model="mainTypeForm" label-width="120px" ref="mainDialogForm" :rules="mainRule">
                <el-form-item label="选择相册" prop="type">
                    <el-select filterable v-model="mainTypeForm.type">
                        <el-option v-for="item in opts.mainTypeOpts" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="mainTypeDialog = false">取 消</el-button>
                <el-button type="primary" @click="postMainType" v-loading="mainLoading" :disabled="mainLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="加入回收站" :visible.sync="binDialog" @open="openBin">
            <el-form :model="binForm" label-width="120px" ref="binDialogForm" :rules="binRule">
                <el-form-item>
                    <span>提示：加入之后将会注销该网站所有包含销售、订单等数据。</span>
                </el-form-item>
                <el-form-item label="添加原因" prop="recycleReasonType">
                    <el-select filterable v-model="binForm.recycleReasonType">
                        <el-option label="手动，PDM加入回收站" value="1"></el-option>
                        <el-option label="手动，PDM加入侵权列表" value="2"></el-option>
                        <el-option label="手动，单网侵权" value="3"></el-option>
                        <el-option label="手动，网站不售卖" value="4"></el-option>
                        <el-option label="备注" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="remark">
                    <el-input type="textarea" :rows="4" v-model="binForm.remark" v-if="binForm.recycleReasonType === '5'"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="binDialog = false">取 消</el-button>
                <el-button type="primary" @click="postBin" v-loading="binLoading" :disabled="binLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设置包邮" v-model="shipDialog" @open="openShip">
            <el-form :model="shipForm" label-width="120px" ref="shipDialogForm" :rules="shipRule">
                <el-form-item label="自定义包邮" prop="postage">
                    <el-radio-group v-model="shipForm.postage">
                        <el-radio label="1">包邮</el-radio>
                        <el-radio label="0">不包邮</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="shipDialog = false">取 消</el-button>
                <el-button type="primary" @click="postShip" v-loading="shipLoding" :disabled="shipLoding">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设置商品标签" v-model="labelDialog" @open="openLabel">
            <el-form :model="labelForm" label-width="120px" ref="labelDialogForm">
                <el-form-item label="设置商品标签" prop="isLabel" :rules="[{required: true, message: '至少选择一项'}]">
                    <el-radio-group v-model="labelForm.isLabel">
                        <el-radio label="1">启用is_cool</el-radio>
                        <el-radio label="2">取消is_cool</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="labelDialog = false">取 消</el-button>
                <el-button type="primary" @click="postLabel" v-loading="labelLoading" :disabled="labelLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="扩展商品分类" v-model="bindingDialog">
            <el-form inline :model="bindingForm">
                <el-form-item label="分类:" prop="categoryId">
                    <el-cascader filterable clearable v-model="bindingForm.catList" class="cat-tree" :options="catTree" change-on-select :props="prop" @change="changeDialogCat"></el-cascader>
                </el-form-item>
                <div>
                    <el-form-item class="color-danger">
                        <p>提示: 本操作只生效于最底层分类</p>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="bindingDialog = false">取 消</el-button>
                <el-button type="primary" @click="postBinding" v-loading="bindLoading" :disabled="bindLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="转移商品分类" v-model="transportDialog">
            <el-form inline :model="bindingForm">
                <el-form-item label="分类:" prop="categoryId">
                    <el-cascader filterable clearable v-model="bindingForm.catList" class="cat-tree" :options="catTree" change-on-select :props="prop" @change="changeDialogCat"></el-cascader>
                </el-form-item>
                <div>
                    <el-form-item class="color-danger">
                        <p>提示: 本操作只生效于最底层分类</p>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="transportDialog = false">取 消</el-button>
                <el-button type="primary" @click="postTransport" v-loading="bindLoading" :disabled="bindLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改主分类" v-model="catDialog">
            <table class="table-custom">
                <thead>
                    <tr>
                        <th>商品分类</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in catForm">
                        <td>{{item.categoryName}}</td>
                        <td v-if="item.isDefault == '1'">主分类</td>
                        <td v-else>
                            <el-button type="primary" size="small" @click="postCatEdit(item)">设为主分类</el-button>
                            <el-button v-if="self.showAction_('goods/goods/remove-category-relation')" type="danger" size="small" @click="removeCat(item)">删除</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="catDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量设置库存类型" v-model="stockDialog" @open="openStock">
            <el-form label-width="120px" :model="stockForm" ref="stockDialogForm">
                <el-form-item>
                    <span class="good-dialog-sheet">切换{{skuList.join(',')}}的库存类型为：</span>
                </el-form-item>
                <el-form-item label="销售仓库" prop="ware">
                    <el-select filterable clearable v-model="stockForm.ware" placeholder="请选择" clearable @change="changeStockWare">
                        <el-option v-for="item in opts.warehouseOpts" :key="item.virWhCode" :label="item.virWhCnName" :value="item.virWhCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--  -->
                <el-form-item label="选择真实仓">
                    <el-select :disabled="!stockForm.ware" multiple clearable filterable v-model="selectWare" @change="changeTable($event, 'stockOpt', 'realWhCode')">
                        <el-option v-for="(item, index) in defaultStatusOpt" :key="index" :value="item.realWhCode" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <!--  -->
                <el-form-item>
                    <el-table :data="stockOpt" border class="ship-area-dialog" :height="stockOpt.length > 6 ? 400 : 0" empty-text="请选择真实仓">
                        <el-table-column prop="name" label="真实仓"></el-table-column>
                        <el-table-column label="虚拟库存">
                            <template scope="scope">
                                <el-radio v-model="scope.row.isVirtual" label="1">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column label="真实库存">
                            <template scope="scope">
                                <el-radio v-model="scope.row.isVirtual" label="0">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="stockDialog = false">取 消</el-button>
                <el-button type="primary" @click="postStock" v-loading="stockLoading" :disabled="stockLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 商品渠道编辑 -->
        <el-dialog title="编辑商品渠道" v-model="pipeDialog" @open="openPipe">
            <el-form label-width="120px" :model="pipeForm" ref="pipeDialogForm">
                <el-form-item label="操作类型" prop="type">
                    <el-radio-group v-model="pipeForm.type">
                        <el-radio label="1">新增渠道</el-radio>
                        <el-radio label="2">删除渠道</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择渠道" prop="pipelineCodeList" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-select multiple filterable clearable v-model="pipeForm.pipelineCodeList" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :label="item" :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="pipeDialog = false">取 消</el-button>
                <el-button type="primary" @click="pipeEdit" v-loading="pipeLoading" :disabled="pipeLoading">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 设置包邮分区 -->
        <el-dialog title="批量设置包邮分区" v-model="shipAreaDialog" size="tiny">
            <el-form :model="shipAreaForm" ref="shipAreaForm" label-width="100px">
                <el-form-item>
                    <span class="good-dialog-sheet">切换{{skuList.join(',')}}的包邮分区为：</span>
                </el-form-item>
                <el-form-item label="生效渠道" prop="pipelineCode" :rules="required">
                    <el-select v-model="shipAreaForm.pipelineCode">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择销售仓">
                    <el-select multiple clearable filterable v-model="selectWare" @change="changeTable($event, 'shipAreaList', 'virWhCode')">
                        <el-option v-for="(item, index) in defaultStatusOpt" :key="index" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-table :data="shipAreaList" border class="ship-area-dialog" :height="shipAreaList.length > 6 ? 400 : 0" empty-text="请选择销售仓">
                        <el-table-column prop="virWhCnName" label="销售仓"></el-table-column>
                        <el-table-column label="物流分区">
                            <template scope="scope">
                                <el-input v-model="scope.row.shipArea"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="shipAreaDialog = false">取 消</el-button>
                <el-button type="primary" @click="postShipArea" v-loading="areaLoading" :disabled="areaLoading">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="查看库存类型" v-model="checkRealWareDialog" size="tiny">
            <span>SKU：</span>
            <span>{{cellRealWare.sku}}</span>
            <br/>
            <span>{{cellRealWare.ware}}：</span>
            <span>{{cellRealWare.type}}</span>
            <el-table :data="cellRealWare.list" border>
                <el-table-column prop="realWhName" label="真实仓库"></el-table-column>
                <el-table-column label="库存类型">
                    <template scope="scope">
                        {{self.tableRes('isVirtualOpts', scope.row.isVirtual)}}
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="checkRealWareDialog = false">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设置捆绑商品库存" v-model="goodsStockDialog" size="tiny" @open="openGoodsStock">
            <el-form label-width="100px" :model="goodsStockForm" ref="goodsStockForm">
                <el-form-item label="已选择SKU">
                    <span class="good-dialog-sheet">{{skuList.join(',')}}</span>
                </el-form-item>
                <el-form-item label="销售仓库:" prop="virWhCode">
                    <el-select filterable clearable v-model="goodsStockForm.virWhCode" placeholder="请选择" @change="changeVir">
                        <el-option v-for="item in opts.warehouseOpts" :key="item.virWhCode" :label="item.virWhCnName" :value="item.virWhCode">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择真实仓">
                    <el-select :disabled="!goodsStockForm.virWhCode" multiple clearable filterable v-model="selectWare" @change="changeTable($event, 'goodsStockForm.data', 'realWhCode')">
                        <el-option v-for="(item, index) in defaultStatusOpt" :key="index" :value="item.realWhCode" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-table :data="goodsStockForm.data" border empty-text="请选择真实仓">
                    <el-table-column prop="name" label="真实仓"></el-table-column>
                    <el-table-column label="填写库存值" >
                        <template scope="scope">
                            <el-form-item class="good-dialog-remark" :prop="'data.' + scope.$index + '.stockNum'" :rules="[{validator: checkWare}]" label-width="0px">
                                <el-input v-model="scope.row.stockNum"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form-item class="color-danger">
                        <p>注：本操作只生效于捆绑商品</p>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="goodsStockDialog = false">返回</el-button>
                <el-button type="primary" @click="postGoodsStock" v-loading="goodsStockLoading" :disabled="goodsStockLoading">确定</el-button>
            </div>
        </el-dialog>
        <!--  -->
        <el-dialog title="提示" v-model="pipeEditNotice.isShow" size="tiny" @close="getData" class="pipe-edit-notice">
            <p v-for="(item, index) in pipeEditNotice.exist">
                商品【<span class="color-danger">{{item.join(',')}}</span>】在【<span class="color-danger">{{index}}</span>】的本店售价为0，发布失败;
            </p>
            <p v-if="pipeEditNotice.contain">
                商品【<span class="color-danger">{{pipeEditNotice.contain}}</span>】的所属默认分类未开启渠道；
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="pipeEditNotice.isShow = false">确定</el-button>
            </div>
        </el-dialog>
        <!--  -->
    </div>
</template>

<script>
import {getLangsBySite} from '@/common/baseApi'
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

        let checkInt = function(rule, value, callback) {
            if (!value || (value * 1 > 0 && Number.isInteger(value * 1))) {
                callback()
            } else {
                callback(new Error('该项为正整数'));
            }
        }

        let checkWare = function(rule, value, callback) {
            if (value == '' || value === '0' || (value * 1 > 0 && Number.isInteger(value * 1))) {
                callback();
            } else {
                callback(new Error('该项为0或正整数'));
            }
        }

        let checkNumber = function(rule, value, callback) {
            if (value == '' || value * 1 > 0) {
                callback()
            } else {
                callback(new Error('该项为正数'));
            }
        }

        let checkDateArr = (rule, value, callback) => {
            if (Boolean(value[0]) && Boolean(value[1])) {
                callback();
            } else {
                callback('该项不能为空')
            }
        }

        let checkPrice = function (rule, value, callback) {
            if (value * 1) {
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
            if (!value || (value * 1 > 0 && value * 1 < 1)) {
                callback();
            } else {
                callback(new Error('该项应为数字,且大于0小于1'));
            }
        }

        let required = [{required: true, message: '该项不能为空'}];
        return {
            checkFlag: true,
            required: required,
            checkPrice: checkPrice,
            checkRate: checkRate,
            checkEnd: checkEnd,
            checkRealWareDialog: false,
            sortDialog: false,
            addVideoDialog: false,
            mainTypeDialog: false,
            binDialog: false,
            shipDialog: false,
            bindingDialog: false,
            transportDialog: false,
            catDialog: false,
            stockDialog: false,
            labelDialog: false,
            statusDialog: false,
            shipAreaDialog: false,
            pipeDialog: false,
            goodsStockDialog: false,
            // savePriceDialog: false,
            // updatePriceDialog: false,
            sortLoading: false,
            videoLoading: false,
            mainLoading: false,
            binLoading: false,
            shipLoding: false,
            tableLoading: false,
            bindLoading: false,
            stockLoading: false,
            labelLoading: false,
            areaLoading: false,
            pipeLoading: false,
            goodsStockLoading: false,
            // savePriceLoading: false,
            wareObj: {},
            statusLoading: false,
            checkDateArr: checkDateArr,
            checkInt: checkInt,
            checkWare: checkWare,
            self: this,
            copyTxt: '',
            colList: ['brandName', 'goodTitle', 'goodsSpu', 'goodsWebSku', 'stock', 'isVirtual', 'shopPrice', 'rate', 'isFreeShipping', 'shipDays', 'goodStatus'],
            // classOpt: {},
            // defaultClassOpt: {},
            opts: {
                quickSearchOpts:setOpts(['外部商品编码=goodsWebSku','sku=goodSn','外部产品编码=goodsWebSpu', 'spu=goodsSpu', '商品标题=goodTitle','商品品牌名称=brandName','商品型号=goodModel']),
                warehouseOpts: [],
                isFreeShippingOpts: setOpts(['不包邮=0','包邮=1']),
                goodStatusOpts: setOpts(['待发布=1','上架=2','下架=3','到货通知=4','谍照=5']),
                mainTypeOpts: setOpts(['网络图=1','自拍图=2','分销图=3']),
                isVirtualOpts: setOpts(['真实库存=0','虚拟库存=1']),
                saleMarkOpts: setOpts(['正常=1','断货=2','清仓=3']),
                verifyStatusOpts: setOpts([
                        '待导入图片=1',
                        '待提交=2',
                        '待审核=3',
                        '审核通过（正常产品）=4',
                        '审核不通过（产品信息审核不通过）=5',
                        '审核不通过（产品性质审核不通过）=6',
                        '审核不通过（产品开发重复）=7',
                        '审核通过（疑似侵权）=8',
                        '审核通过（暂不上架）=10',
                        '审核不通过（产品质检不良）=11',
                        '待审核（暂不处理）=12'
                    ]),
                recommendLevelOpts: setOpts(['A=1','B=2','C=3','D=4','E=5','F=6', 'G=7', 'H=8', 'A++=9']),
                erpLevelOpts: setOpts([
                        '活跃有货=1',
                        '不活跃新品=2',
                        '停滞=3',
                        '违禁品=4',
                        '活跃无货近期无销售=5',
                        '不活跃有货=6',
                        '清仓产品=7',
                        '其他活跃产品=8',
                        '不活跃无货近期无销售=9',
                        '其它不活跃=10',
                        '活跃有货近期无销售=11',
                        '不活跃有货近期无销售=12',
                        '婚纱类不参加等级计算=20'
                    ]),
                limitTypeOpts: setOpts(['普通限价=1','严格限价=2','无限价=3']),
                companySourceStatusOpts: setOpts(['正常=1','断货=2','停产=3']),
                saleTypeOpts: setOpts(['正常=0','呆滞品=1','滞销品=2']),
                sourceStatusOpts: setOpts(['正常=1','断货=2','停产=3']),
                wholesaleProOpts: setOpts(['否=1','是=2']),
                platforms: setOpts(['PC=1', 'WAP=2', 'IOS=3', 'ANDROID=4','PAD=5']),
                offSheetOpt: setOpts(['系统下架-PDM指令=1','系统下架-分类缺失=2', '系统下架-仓库缺失=3', '手动下架-危险品=4', '手动下架-单网侵权=7', '手动下架-暂停售卖=8']),
                onSheetOpt: setOpts(['系统上架-PDM指令=5','手动上架-新品=6']),
            },
            // logOpt: [],
            option: {
                lang: '',
                shopCode: '',
                firstUpTime: [],
                // lastUpTime: [],
                goodStatusChangeTime: [],
                stockTypeRealWhCodeList: '',
                saleMarkRealWhCodeList: '',
                saleTypeRealWhCodeList: '',
                isLabel: '',
                platform: '',
                goodStatus: '',
                categoryId: [],
                sameType: '',
                pageSize: 10,
                pageNo: 1,
                // proCate: [''],
                virWhCode: '',
                shopPriceStart: '',
                shopPriceEnd: '',
                isFreeShipping: '',
                pcStatus: '',
                appStatus: '',
                mainType: '',
                // trotStatus: '',
                isVirtual: '',
                saleMark: '',
                verifyStatus: '',
                limitType: '',
                companySourceStatus: '',
                saleType: '',
                batchPurchasePrice: '',
                keyword:'',
                field:'',
                pipelineCode: '',
                goodsStyle: '',
                // lastCategoryMark: ''
            },
            cellRealWare: {
                sku: '',
                list: [],
                ware: '',
                type: '',
            },
            shipAreaList: [],
            isAdvancedFilter: false,
            goodsInfoList: [],
            tableData: [],
            total: 10,
            styleCount: 0,
            checkedRow: [],
            sortForm: {
                sortValue: '',
                pipelineCode: '',
            },
            addVideoForm: {
                youtube: '',
                list: [''],
            },
            mainTypeForm: {
                type: ''
            },
            binForm: {
                recycleReasonType: '5',
                remark: ''
            },
            shipForm: {
                postage: '',
            },
            labelForm: {
                isLabel: ''
            },
            bindingForm: {
                // proCate: [''],
                categoryId: '',
                catList: [],
                // classOpt: {},
            },
            catForm: [],
            // 095 remove
            // updateForm: {
            //     pipelineCode: '',
            // },
            stockForm: {
                ware: ''
            },
            shipAreaForm: {
                pipelineCode: '',
                // templateId: '',
            },
            pipeForm: {
                type: '1',
                pipelineCodeList: [],
            },
            stockOpt: [],
            statusForm: {
                type: 2,
                warehouse: [],
                isShopPrice: '',
                minWholesaleNum: '',
                arrivalVirtualNum: '',
                editDate: [],
                imgPrice: '',
                platforms: [],
                checkAll: '',
                reasonType: '',
                mark: '',
                checked: false
            },
            goodsStockForm: {
                virWhCode: '',
                data: [],
            },
            tempCat: '',
            sheetOpt: [],
            statusOpt: [],
            defaultStatusOpt: [],
            selectWare: [],

            realWareOpt: [],
            defaultWare: {
                // isVirtual: '',
                virWhCode: '',
            },
            // defaultPipe: '',
            sortRule: {
                sortValue: [{
                    required: true,
                    message: '该项不能为空',
                }, {
                    validator: checkInt,
                    trigger: 'blur'
                }],

                pipelineCode: required,
            },
            videoRule: {
                list: [{
                    type: 'array',
                    required: true,
                    message: '该项不能为空',
                }]
            },
            mainRule: {

                type: required,
            },
            binRule: {

                recycleReasonType: required,
            },
            shipRule: {

                postage: required,
            },
            searchRule: {
                shopPriceStart: [{
                    validator: checkNumber,
                    trigger: 'blur'
                }],
                shopPriceEnd: [{
                    validator: checkNumber,
                    trigger: 'blur'
                }],

                virWhCode: required,
            },

            // 树配置
            catTree: [],
            prop: {
                label: 'categoryName',
                value: 'id',
                children: 'subCategoryList',
            },
            // 语言
            langOpt: [],
            // 编辑渠道提示
            pipeEditNotice: {
                isShow: false,
                contain: '',
                exist: '',
            }
        };
    },
    mounted () {
        // this.getLogistics();
        this.getOpt();
    },
    computed: {
        skuList () {
            if (this.checkedRow.length > 0) {
                let temp = [];
                this.checkedRow.map(item => {
                    temp.push(item.goodSn)
                })

                return temp;
            } else {
                return [];
            }
        },
        domain () {
            return this.$store.getters.getDomain + '/';
        },
        statusBtn () {
            if (this.statusForm.type == '2') {
                return this.showAction_('goods/goods/batch-save-up');
            } else if (this.statusForm.type == '3') {
                return this.showAction_('goods/goods/batch-save-down');
            } else if (this.statusForm.type == '4') {
                return this.showAction_('goods/goods/batch-save-notice');
            } else if (this.statusForm.type == '5'){
                return this.showAction_('goods/goods/save-good-photos');
            }
        },
        pipeOpt () {
            // let list = this.$store.getters.getPipe.list;
            // this.defaultPipe = this.option.pipelineCode = list && list[0] ? list[0].pipeline_code : '';
            return this.$store.getters.getPipe.obj;
        },
        storeOpt () {
            return this.$store.getters.getStore.obj;
        },
        terminalOpt() {
            let temp = {};
            let arr = this.$store.getters.getTerminal.opt || [];
            arr.forEach(item => {
                temp[item.id] = {
                    name: item.name,
                    check: false,
                };
            });
            return temp;
        },
        terminalMap() {
            return this.$store.getters.getTerminal.map;
        }
    },
    methods: {
        // getLogistics() {
        //     this.$http.get('logistics/template/name-list').then(res => {
        //         if (res.body.code === 0) {
        //             this.logOpt = res.body.data;
        //         } else {
        //             this.$message.error(res.body.message);
        //         }
        //     })
        // },
        // render data
        tableRes (opt, params) {
            let obj = this.opts[opt];
            if (obj[params]) {
                return obj[params].label;
            } else {
                return ''
            }
        },
        // render th in a dialog table
        sheetRender (h, obj) {
            return h('el-checkbox', {
                on: {
                    change: ((event) => {
                        this.statusForm.checked = !this.statusForm.checked;
                        this.checkAll(event);
                    })
                },
                props: {
                    value: this.statusForm.checked
                }
            }, '销售仓库')
        },

        // dialog category
        changeDialogCat (val) {
            this.bindingForm.categoryId = val[val.length - 1];

        },
        async getOpt () {
            this.$http.get('stock/warehouse/vir-wh-drop-down').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.list;

                    for (let i in data) {
                        let item = data[i];
                        item.checked = false;
                        item.platforms = {
                            '1': false,
                            '2': false,
                            '3': false,
                            '4': false,
                            '5': false
                        };
                        item.terminal = JSON.parse(JSON.stringify(this.terminalOpt));
                        item.shipArea = '';
                        item.showLoading = false,
                        item.shipAreaOpt = [];

                        if (item.isDefault === 1) {
                            // this.defaultWare.isVirtual = item.isVirtual + '';
                            this.defaultWare.virWhCode = this.option.virWhCode = item.virWhCode;
                        }
                    }
                    this.opts.warehouseOpts = data;
                    this.opts.warehouseOpts.map(ware => {
                        this.wareObj[ware.virWhCode] = ware.virWhCnName;
                        this.wareObj[ware.whCode] = ware.name;
                    });
                    this.getData();
                } else {
                    this.$message.error(res.body.message);
                }
            });
            this.$http.get('goods/category/category-drop-down').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.catTree = data;
                }
            });

            this.langOpt = await getLangsBySite();
        },
        getRealWare (val) {
            this.$http.get('stock/stock/get-real-wares', {params: {virCodeList: [val]}}).then(res => {
                if (res.body.code === 0) {
                    this.option.stockTypeRealWhCodeList = '';
                    this.option.saleMarkRealWhCodeList = '';
                    this.option.saleTypeRealWhCodeList = '';

                    this.realWareOpt = res.body.data.realWareHouseList;
                }
            });
        },
        getData (page) {
            if ((this.option.keyword && !this.option.field) || (!this.option.keyword && this.option.field)) {
                this.$alert('关键字必须匹配搜索类型', '提示');
                return ;
            }

            if (this.option.shopPriceStart && this.option.shopPriceEnd) {
                if (Number(this.option.shopPriceStart) > Number(this.option.shopPriceEnd)) {
                    this.$alert('本店售价起始值不能大于结束值', '提示');
                    return ;
                }
            }

            if ((this.option.stockTypeRealWhCodeList && !this.option.isVirtual)) {
                this.$alert('请选择库存类型', '提示');
                return ;
            }

            if ((this.option.saleMarkRealWhCodeList && !this.option.saleMark)) {
                this.$alert('请选销售标识', '提示');
                return ;
            }

            if ((this.option.saleTypeRealWhCodeList && !this.option.saleType)) {
                this.$alert('请选择PDM销售状态', '提示');
                return ;
            }

            this.$refs.searchForm.validate(valid => {
                if (valid) {
                    let params = {};
                    for (let i in this.option) {
                        if (i == 'categoryId') {
                            params[i] = this.option.categoryId[this.option.categoryId.length - 1];
                        } else if (i !== 'keyword' && i !== 'field' && i !== 'stockTypeRealWhCodeList' && i !== 'saleMarkRealWhCodeList' && i !== 'saleTypeRealWhCodeList' && i !== 'firstUpTime' && i !== 'lastUpTime'
                            ) {
                            if (this.option[i] !== '') {
                               params[i] = this.option[i];
                            }
                        }
                    }

                    let timeArr1 = this.timeZone_(this.option.firstUpTime, this.$store.getters.getTimeZone);
                    params.firstUpTimeMin = timeArr1[0];
                    params.firstUpTimeMax = timeArr1[1];

                    let timeArr2 = this.timeZone_(this.option.goodStatusChangeTime, this.$store.getters.getTimeZone);
                    params.goodStatusChangeTimeMin = timeArr2[0];
                    params.goodStatusChangeTimeMax = timeArr2[1];

                    if (this.option.stockTypeRealWhCodeList) {
                        params.stockTypeRealWhCodeList = [this.option.stockTypeRealWhCodeList];
                    }

                    if (this.option.saleMarkRealWhCodeList) {
                        params.saleMarkRealWhCodeList = [this.option.saleMarkRealWhCodeList];
                    }

                    if (this.option.saleTypeRealWhCodeList) {
                        params.saleTypeRealWhCodeList = [this.option.saleTypeRealWhCodeList];
                    }

                    // if (this.option.galleryType.length > 0) {
                    //     params.galleryType = this.option.galleryType.join(',');
                    // }

                    if (this.option.keyword && this.option.field) {
                        params[this.option.field] = this.option.keyword;
                    }

                    params.sameType = params.sameType ? 1 : 0;

                    if (!page) {
                        params.pageNo = this.option.pageNo = 1;
                        params.pageSize = this.option.pageSize = 10;
                    }

                    for (let i in params) {
                        if (params[i] === '') {
                            delete params[i]
                        }
                    }

                    this.tableLoading = true;
                    this.$http.get('goods/goods/query-goods-list', {params: params}).then(res => {
                        this.getTitle();
                        this.tableLoading = false;
                        if (res.body.code === 0) {
                            let data = res.body.data.goodsInfoList;

                            this.tableData = res.body.data.goodsInfoList;
                            this.total = res.body.data.totalCount;
                            this.styleCount = res.body.data.sameGoodsCount;
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.tableLoading = false;
                    });
                }
            });
        },
        resetForm(){
            this.$refs['searchForm'].resetFields();
            this.option.field = '';
            // this.classOpt = this.defaultClassOpt;
            // this.option.proCate = [''];
            // this.option.categoryId = '';
            // this.option.pipelineCode = this.defaultPipe;
            this.option.virWhCode = this.defaultWare.virWhCode;
        },
        checkRow(val) {
            this.checkedRow = val;
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
        addBin (row) {
            this.$refs.dataTable.clearSelection();
            this.checkedRow = [row];
            this.openDialog('binDialog');
        },
        editCat (row) {
            this.$http.get('goods/goods/get-default-category', {params: {goodSn: row.goodSn}}).then(res => {
                if (res.body.code === 0) {
                    this.tempCat = row.goodSn;
                    this.catForm = res.body.data.defaultCategoryList;
                    this.catDialog = true;
                }
            })
        },
        postCatEdit (row) {
            let params = {};
            params.categoryId = row.categoryId;
            params.goodSn = this.tempCat;

            this.$http.post('goods/goods/modify-default-category', params).then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.catDialog = false;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        removeCat (row) {
            let params = {};
            params.categoryId = row.categoryId;
            params.goodSn = this.tempCat;

            this.$http.post('goods/goods/remove-category-relation', params).then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.catDialog = false;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        // page
        ChangePage (val) {
            this.option.pageNo = val;
            this.getData(true);
        },
        ChangePageSize (val) {
            this.option.pageSize = val;
            this.getData(true);
        },
        checkAll (val) {
            let flag = val.target.checked;
            this.statusOpt.map(item => {
                item.checked = flag;
                Object.entries(item.terminal).forEach(el => {
                    item.terminal[el['0']].check = flag;
                });
            });
        },

        checkRowStatus (item, val) {
            let flag = val.target.checked;
            Object.entries(item.terminal).forEach(el => {
                item.terminal[el['0']].check = flag;
            });
        },
        openDialog (dialog) {
            this[dialog] = true;
        },
        // confirm change sort
        postSort () {
            this.$refs.sortDialogForm.validate(valid => {
                if (valid) {
                    let params = {};

                    for (let i in this.sortForm) {
                        params[i] = this.sortForm[i];
                    }

                    let temp = [];
                    this.checkedRow.map(item => {
                        temp.push(item.goodSn);
                    });

                    params.goodSnList = temp;

                    this.sortLoading = true;
                    this.$http.post('goods/goods/batch-save-sort', params).then(res => {
                        this.sortLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.sortDialog = false;
                            this.getData();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.sortLoading = false;
                    });
                }
            })
        },
        // check goods when confirm onSheet
        checkSheet (flag) {
            let info = [];
            //
            this.statusOpt.forEach(item => {
                // 终端映射
                this.terminalMap.forEach(mapItem => {
                    item.platforms[mapItem.platform_id] = item.terminal[mapItem.terminal_id].check;
                });
                //
                for (let i in item.platforms) {
                    if (item.platforms[i]) {
                        this.skuList.map(sku => {
                            info.push({
                                virCode: item.virWhCode,
                                goodSn: sku
                            })
                        });
                        break;
                    }
                }
            });
            if (info.length !== 0) {
                if (flag === 2) {
                    this.$http.get('goods/goods/query-good-virstock-lessthanzero', {params: {reqList: info}}).then(res => {
                        if (res.body.code === 0) {
                            if (res.body.data !== '') {
                                let data = res.body.data.respList;
                                if (data.length === 0) {
                                    this.postSheet(flag);
                                } else {
                                    let temp = '';
                                    let tempObj = {};

                                    if (data instanceof Array) {
                                        data.map(goods => {
                                            let ware = goods.virCode;
                                            tempObj[ware] = tempObj[ware] || [];
                                            tempObj[ware].push(goods.goodSn);
                                        });
                                    }
                                    for (let i in tempObj) {
                                        let item = tempObj[i];
                                        temp += '商品【' + item.join(',') + '】在仓库【' + this.wareObj[i] + '】的库存为0。'
                                    }
                                    this.$confirm(temp + '是否继续操作?', {
                                        type: 'warning'
                                    }).then(() => {
                                        this.postSheet(flag);
                                    }).catch(() => {
                                        this.statusLoading = false;
                                        this.$message({
                                            type: 'info',
                                            message: '已取消!'
                                        });
                                    })
                                }
                            } else {
                                this.postSheet(flag);
                            }
                        } else {
                            this.statusLoading = false;
                            this.$message.error(res.body.message);
                        }
                    }).catch((err) => {
                        this.statusLoading = false;
                    });
                } else {
                    this.postSheet(flag);
                }

            } else {
                this.statusLoading = false;
                this.$message.warning('至少选择一个平台');
            }
        },
        // the method of onSheet and offSheet
        postSheet (flag) {
            let status,
                src,
                dialog,
                list;

            if (flag === 2) {
                status = 2;
                src = 'goods/goods/batch-save-up';
            } else {
                status = 3;
                src = 'goods/goods/batch-save-down';
            }

            let params = {};
            params.goodSnList = this.skuList;
            params.reasonType = this.statusForm.reasonType;
            params.mark = this.statusForm.mark;
            params.warePlatList = [];
            this.statusOpt.map(item => {
                let plat = item.platforms;
                let temp = [];
                for (let i in plat) {
                    if (plat[i]) {
                        temp.push(Number(i));
                    }
                }

                if (temp.length > 0) {
                    params.warePlatList.push({
                        virCode: item.virWhCode,
                        platfromList: temp
                    })
                }
            });

            this.$http.post(src, params).then(res => {
                this.statusLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    if (flag === 2) {
                        let flag1 = data.noCutPicGoodSnList && data.noCutPicGoodSnList.length === 0;
                        let flag2 = data.shopPriceLessZeroRespList && data.shopPriceLessZeroRespList.length === 0;
                        let flag3 = data.noRealWarehouseStockGoodSnList && data.noRealWarehouseStockGoodSnList.length === 0;

                        if (flag1 && flag2 && flag3) {
                            this.$message.success(res.body.message);
                            this.statusDialog = false;
                            this.getData();
                        } else {
                            this.statusDialog = false;
                            let noCutTip = '',
                                stockTip = '',
                                realTip = '';

                            if (data.noCutPicGoodSnList.length > 0) {
                                noCutTip = '商品【' + data.noCutPicGoodSnList.join(',') + '】未切图，不允许上架。';
                            }

                            if (data.shopPriceLessZeroRespList.length > 0) {
                                let tipObj = data.shopPriceLessZeroRespList;
                                let tempObj = {};
                                let temp = '';
                                tipObj.map(good => {
                                    let ware = good.whCode;
                                    tempObj[ware] = tempObj[ware] || [];
                                    tempObj[ware].push(good.goodSn);
                                });

                                for (let i in tempObj) {
                                    let item = tempObj[i];
                                    temp += '商品【' + item.join(',') + '】在仓库【' + this.wareObj[i] + '】的本店售价为0，不允许上架。'
                                }

                                stockTip = temp;
                            }

                            if (data.noRealWarehouseStockGoodSnList.length > 0) {
                                let realTipObj = data.noRealWarehouseStockGoodSnList;
                                let realTempObj = {};
                                let realTemp = '';
                                realTipObj.map(good => {
                                    let ware = good.whCode;
                                    realTempObj[ware] = realTempObj[ware] || [];
                                    realTempObj[ware].push(good.goodSn);
                                });

                                for (let i in realTempObj) {
                                    let item = realTempObj[i];
                                    realTemp += '商品【' + item.join(',') + '】在仓库【' + this.wareObj[i] + '】未与真实仓绑定。'
                                }

                                realTip = realTemp;
                            }

                            let resStr = noCutTip + stockTip + realTip;

                            this.$alert(resStr, '错误', {
                                type: 'error'
                            });
                        }
                    } else {
                        if (res.body.code == '0') {
                            this.$message.success(res.body.message);
                            this.statusDialog = false;
                            this.getData();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            })

        },
        // confirm change video url
        postVideo () {
            this.$refs.videoDialogForm.validate(valid => {
                if (valid) {
                    let params = {};
                    params.youtube = this.addVideoForm.list.join(',');
                    params.goodSnList = this.skuList;
                    this.videoLoading = true;
                    this.$http.post('goods/goods/batch-save-video', params).then(res => {
                        this.videoLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.addVideoDialog = false;
                            this.getData();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.videoLoading = false;
                    });
                }
            })

        },
        // the method of change goods notice
        postnotice () {
            let params = {};
            let timeArr = this.timeZone_(this.statusForm.editDate, this.$store.getters.getTimeZone);
            params.startTime = timeArr[0];
            params.endTime = timeArr[1];

            if (params.startTime * 1000 < new Date().getTime()) {
                this.$message.warning('起始时间不能小于时区当前时间');
                this.statusLoading = false;
                return false;
            }

            params.isShopPrice = this.statusForm.isShopPrice ? 1 : 0;
            params.whCodeList = this.statusForm.warehouse;
            params.goodSnList = this.skuList;

            if (this.statusForm.minWholesaleNum) {
                params.minWholesaleNum = this.statusForm.minWholesaleNum;
            }

            if (this.statusForm.arrivalVirtualNum) {
                params.arrivalVirtualNum = this.statusForm.arrivalVirtualNum;
            }

            if (params.whCodeList.length === 0) {
                this.$message.warning('至少选择一个仓库');
                this.statusLoading = false;
                return false;
            }

            this.$http.post('goods/goods/batch-save-notice', params).then(res => {
                this.statusLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let flag1 = data.noCutPicGoodSnList && data.noCutPicGoodSnList.length === 0;

                    if (flag1) {
                        this.statusDialog = false;
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        let noCutTip = '';
                        if (data.noCutPicGoodSnList.length > 0) {
                            noCutTip = '未切图SKU:' + data.noCutPicGoodSnList.join(',');
                        }

                        this.$alert(noCutTip, '错误', {
                            type: 'error'
                        });
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.statusDialog = false;
            });
        },
        // confirm change mainType
        postMainType () {
            this.$refs.mainDialogForm.validate(valid => {
                if (valid) {
                    let params = {};
                    params.type = this.mainTypeForm.type;
                    params.goodSnList = this.skuList;
                    this.mainLoading = true;
                    this.$http.post('goods/goods/batch-set-main-picture', params).then(res => {
                        this.mainLoading = false;
                        if (res.body.code === 0) {
                            let data = res.body.data;
                            this.mainTypeDialog = false;
                            if (data.goodSnList && data.goodSnList.length > 0) {
                                let str = '商品【' + data.goodSnList.join(',') + '】缺失【' + this.opts.mainTypeOpts[params.type].label + '】，设置失败。'
                                this.$alert(str, '提示', {
                                    type: 'warning',
                                    callback: action => {
                                        this.getData();
                                    }
                                });
                            } else {
                                this.$message.success(res.body.message);
                                this.getData();
                            }
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.mainLoading = false;
                    });
                }
            })
        },
        // confirm add bin
        postBin () {
            this.$refs.binDialogForm.validate(valid => {
                if (valid) {
                    let params = {};
                    params.isForce = 0;
                    params.goodSnList = this.skuList;
                    params.recycleReasonType = this.binForm.recycleReasonType;
                    if (params.recycleReasonType === '5') {
                        params.remark = this.binForm.remark;
                    }

                    this.binLoading = true;
                    this.$http.post('goods/goods/check-recycle-is-exists', {goodSnList: params.goodSnList}).then(res => {
                        this.binLoading = false;
                        if (res.body.code === 0) {
                            let data = res.body.data;
                            if (data.goodSnList && data.goodSnList.length > 0) {
                                let str = 'SKU:' + data.goodSnList.join(',') + '已加入回收站'
                                this.$alert(str, '已有商品加入回收站', {
                                    type: 'error'
                                })
                            } else {
                                this.$http.post('goods/goods/batch-add-recycle', params).then(subRes => {
                                    if (subRes.body.code === 0) {
                                        let subData = subRes.body.data;
                                        if (subData.goodsnNotExist.length > 0 || subData.goodsnNotRealStock.length > 0 | subData.isAlreadyTrotOrRecycle.length > 0) {
                                            this.$confirm('是否继续?', '提示', {
                                                type: 'warning'
                                            }).then(() => {
                                                params.isForce = 1;
                                                this.$http.post('goods/goods/batch-add-recycle', params).then(res => {
                                                    if (res.body.code == 0) {
                                                        let data = res.body.data;
                                                        if (data.goodsnNotExist.length === 0 && data.goodsnNotRealStock.length === 0 && data.isAlreadyTrotOrRecycle.length === 0) {
                                                            this.$message({
                                                                type: 'success',
                                                                message: res.body.message
                                                            });
                                                        } else {
                                                            let resStr = '';
                                                            if (data.goodsnNotExist.length > 0) {
                                                                resStr += 'sku【' + data.goodsnNotExist.join(',') + '】不存在；';
                                                            }
                                                            if (data.goodsnNotRealStock.length > 0) {
                                                                resStr += 'sku【' + data.goodsnNotRealStock.join(',') + '】没有对应的真实仓；';
                                                            }
                                                            if (data.isAlreadyTrotOrRecycle.length > 0) {
                                                                resStr += 'sku【' + data.isAlreadyTrotOrRecycle.join(',') + '】在pdm回收站或者侵权；';
                                                            }
                                                            this.$alert(resStr, '错误', {
                                                                type: 'error'
                                                            });
                                                        }
                                                    } else {
                                                        this.$message.error(res.body.message);
                                                    }
                                                });
                                            }).catch(() => {
                                                this.$message({
                                                    type: 'info',
                                                    message: '已取消!'
                                                });
                                            });
                                        } else {
                                            this.$message.success(subRes.body.message);
                                            this.binDialog = false;
                                            this.getData();
                                        }
                                    } else {
                                        this.$message.error(subRes.body.message);
                                    }
                                });
                            }
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.binLoading = false;
                    });
                }
            })
        },
        // copy text
        copy (params) {
            let temp = [];
            this.checkedRow.map(item => {
                temp.push(item[params]);
            });

            this.copyTxt = temp.join(',');
            var cpt = document.getElementById('copyTxt');
            cpt.value = this.copyTxt;
            cpt.select();
            try{
                if(document.execCommand('copy', false, null)){
                    this.$message.success('复制成功')
                } else{
                    this.$message({
                        type: 'warning',
                        message: '浏览器不可用复制'
                    });
                }
            } catch(err){
                this.$message.error(err);
            }
        },
        // confirm free ship
        postShip () {
            this.$refs.shipDialogForm.validate(valid => {
                if (valid) {
                    let params = {};
                    params.goodSnList = this.skuList;
                    params.postage = this.shipForm.postage;

                    this.shipLoding = true;
                    this.$http.post('goods/goods/batch-save-postage', params).then(res => {
                        this.shipLoding = false;
                        if (res.body.code === 0) {
                            this.getData();
                            this.$message.success(res.body.message);
                            this.shipDialog = false;
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.shipLoding = false;
                    });
                }
            })
        },
        // confirm goods price label
        postLabel () {
            this.$refs.labelDialogForm.validate(valid => {
                if (valid) {
                    let params = {};
                    params.goodSnList = this.skuList;
                    params.isLabel = this.labelForm.isLabel;

                    this.labelLoading = true;
                    this.$http.post('goods/goods/save-goods-label', params).then(res => {
                        this.labelLoading = false;
                        if (res.body.code === 0) {
                            this.getData();
                            this.$message.success(res.body.message);
                            this.labelDialog = false;
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.labelLoading = false;
                    });
                }
            })
        },
        // update goods price  095remove
        // updatePrice () {
        //     let params = {};
        //     params.reqList = [];
        //     params.pipelineCode = this.updateForm.pipelineCode;
        //     params.changeUser = this.$store.getters.getUserName;

        //     for (let i in this.checkedRow) {
        //         let item = this.checkedRow[i];
        //         params.reqList.push({
        //             goodSn: item.goodSn,
        //             virWhCode: item.virWhCode
        //         })
        //     }

        //     this.$http.post('goods/goods/update-batch-shop-price', params).then(res => {
        //         if (res.body.code === 0) {
        //             let data = res.body.data;
        //             if (data && data.length > 0) {
        //                 let str = '商品【' + data.join(',') + '】计算价格失败';
        //                 this.$alert(str, {
        //                     type: 'warning',
        //                     callback: action => {
        //                         this.getData();
        //                     }
        //                 })
        //             } else {
        //                 this.updatePriceDialog = false;
        //                 this.$message.success(res.body.message);
        //                 this.getData();
        //             }
        //         } else {
        //             this.$message.error(res.body.message);
        //         }
        //     });
        // },
        // cofirm binding goods category
        postBinding () {
            if (this.bindingForm.categoryId) {
                let params = {};
                params.goodSnList = this.skuList;
                params.categoryId = this.bindingForm.categoryId;

                this.bindLoading = true;
                this.$http.post('goods/goods/add-category-good-relation', params).then(res => {
                    this.bindLoading = false;
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        if (data && data.length > 0) {
                            let str = '商品【' + data.join(',') + '】已绑定该分类';
                            this.$alert(str, {
                                type: 'warning',
                                callback: action => {
                                    this.bindingDialog = false;
                                    this.getData();
                                }
                            })
                        } else {
                            this.bindingDialog = false;
                            this.$message.success(res.body.message);
                            this.getData();
                        }
                    } else {
                        this.$message.error(res.body.message);
                    }
                }).catch(err => {
                    this.bindLoading = false;
                });
            } else {
                this.$message.warning('请选择至底层分类');
            }

        },
        // cofirm change goods category
        postTransport () {
            if (this.bindingForm.categoryId) {
                let params = {};
                params.goodSnList = this.skuList;
                params.categoryId = this.bindingForm.categoryId;

                this.bindLoading = true;
                this.$http.post('goods/goods/transfer-category-good-relation', params).then(res => {
                    this.bindLoading = false;
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.transportDialog = false;
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                }).catch(err => {
                    this.bindLoading = false;
                });
            } else {
                this.$message.warning('请选择至底层分类');
            }

        },
        // change ware type
        changeStockWare (val) {
            this.$http.get('stock/stock/get-real-wares', {params: {virCodeList: [val]}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.realWareHouseList;
                    data.map(item => {
                        item.isVirtual = '';
                    });
                    this.stockOpt = [];
                    // 选择仓库
                    this.defaultStatusOpt = data;
                    this.selectWare = [];
                }
            });
        },
        // cofirm change goods stock
        postStock () {
            let params = {};
            params.reqList = [];

            this.stockOpt.forEach(item => {
                if (item.isVirtual !== '') {
                    this.skuList.forEach(sku => {
                        params.reqList.push({
                            realCode: item.realWhCode,
                            goodSn: sku,
                            isVirtual: item.isVirtual
                        })
                    });
                }
            });

            if (params.reqList.length === 0) {
                this.$message.warning('至少选择一项操作');
                return false;
            }

            this.stockLoading = true;
            this.$http.post('stock/stock/batch-set-stock-type', params).then(res => {
                this.stockLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data.list;
                    this.$message.success(res.body.message);
                    if (data.length > 0) {
                        let str = '';
                        data.forEach(item => {
                            str += '商品：' + item.goodSn + '在真实仓' + item.realCode + '为清仓，不可设置为虚拟库存;';
                        });
                    }
                    this.$alert(str, '提示');
                    this.getData();
                    this.stockDialog = false;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.stockLoading = false;
            });
        },
        // get table column setting
        getTitle () {
            let user = this.$store.getters.getUserName;
            let site = this.$store.getters.getSite;
            let code = user + '_' + site;
            if (localStorage[code]) {
                this.colList = JSON.parse(localStorage[code]);
            }
        },
        // table column setting saved
        saveTitle () {
            let user = this.$store.getters.getUserName;
            let site = this.$store.getters.getSite;
            let code = user + '_' + site;
            localStorage[code]= JSON.stringify(this.colList);
            this.$message.success('已保存当前列表项选择');
        },
        // method of change goods photo
        postPhoto () {
            let params = {};
            params.goodSnList = this.skuList;
            if (this.statusForm.imgPrice) {
                params.isShopPrice = 1;
            }
            this.$http.post('goods/goods/save-good-photos', params).then(res => {
                this.statusLoading = false;
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.getData();
                    this.statusDialog = false;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.statusDialog = false;
            });
        },
        // shipArea btn
        shipAreaEdit () {
            this.shipAreaList = [];
            // 仓库选择
            this.defaultStatusOpt = JSON.parse(JSON.stringify(this.opts.warehouseOpts));
            this.selectWare = [];
            // 
            this.shipAreaDialog = true;
        },
        // confirm change shipArea
        postShipArea () {
            let params = {};
            params.reqList = [];
            this.shipAreaList.forEach(item => {
                if (item.shipArea !== '') {
                    this.skuList.forEach(sku => {
                        params.reqList.push({
                            goodSn: sku,
                            weightFreeDivision: item.shipArea,
                            virWhCode: item.virWhCode,
                            pipelineCode: this.shipAreaForm.pipelineCode
                        })
                    })
                }
            });

            if (params.reqList.length === 0) {
                this.$message.warning('至少选择一项修改');
                return false;
            }

            // 0.82新增
            // params.templateId = shipAreaForm.templateId;
            // params.pipelineCode = shipAreaForm.pipelineCode;

            this.areaLoading = true;
            this.$http.post('goods/goods/batch-set-free-divison', params).then(res => {
                this.areaLoading = false;
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.getData();
                    this.shipAreaDialog = false;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.areaLoading = false;
            })
        },
        // get shipArea list
        // showOption (data,val) {
        //     if (val) {
        //         if (data.shipAreaOpt && data.shipAreaOpt.length === 0) {
        //             let params = {};
        //             params.vwareCode = data.whCode;
        //             params.isBase = true;
        //             this.$http.get('goods/goods/get-area-by-vware', {params: params}).then(res => {
        //                 if (res.body.code === 0) {
        //                     data.shipAreaOpt = res.body.data.groupList;
        //                 }
        //             });
        //         }
        //     }
        // },
        // change goods status btn
        statusEdit () {
            let data = this.opts.warehouseOpts;
            data.forEach(item => {
                item.checked = false;
                item.terminal = JSON.parse(JSON.stringify(this.terminalOpt));
                item.platforms = {
                    '1': false,
                    '2': false,
                    '3': false,
                    '4': false,
                    '5': false
                };
            });
            this.statusOpt = [];
            // 仓库选择
            this.defaultStatusOpt = JSON.parse(JSON.stringify(data));
            this.selectWare = [];
            // 
            this.statusForm = {
                type: 2,
                warehouse: [],
                isShopPrice: '',
                arrivalVirtualNum: '',
                editDate: [],
                imgPrice: '',
                platforms: [],
                checkAll: '',
                reasonType: '',
                mark: '',
                checked: false,
            };
            this.statusDialog = true;
        },
        // confirm goods status change
        postStatus () {
            this.$refs.statusDialogForm.validate(valid => {
                if (valid) {
                    let data = this.statusForm;
                    this.statusLoading = true;

                    if (data.type === 2 || data.type === 3) {
                        this.checkSheet(data.type);
                    } else if (data.type === 4) {
                        this.postnotice();
                    } else {
                        this.postPhoto();
                    }
                }
            });
        },
        // savePrice () {

        //     this.$refs.savePriceForm.validate(valid => {
        //         if (valid) {
        //             let params = {};
        //             let temp = [];
        //             this.checkedRow.map(item => {
        //                 temp.push(item.goodSn);
        //             });


        //             params.goodSnList = temp;


        //             for (let i in this.savePriceForm) {
        //                 let item = this.savePriceForm[i];
        //                 if (item) {
        //                     params[i] = item;
        //                 }
        //             }


        //             this.savePriceLoading = true;
        //             this.$http.post('goods/goods/batch-save-goods-price', params).then(res => {
        //                 this.savePriceLoading = false;
        //                 if (res.body.code === 0) {
        //                     this.$message.success(res.body.message);
        //                     this.savePriceDialog = false;
        //                     this.getData();
        //                 } else {
        //                     this.$message.error(res.body.message);
        //                 }
        //             }).catch(err => {
        //                 this.savePriceLoading = false;
        //             });
        //         }

        //     })
        // },
        checkRealWare (item) {
            let params = {};
            params.goodsSn = item.goodSn;
            params.virWhCode = item.virWhCode;

            this.cellRealWare.ware = item.vwhName;
            this.cellRealWare.sku = item.goodSn;

            this.$http.get('goods/goods/query-goods-real-warehouse', {params: params}).then(res => {
                if (res.body.code === 0) {
                    let list = res.body.data;
                    this.cellRealWare.list = list;
                    this.cellRealWare.type = '真实库存';

                    for (let i in list) {
                        let item = list[i];
                        if (item.isVirtual == 1) {
                            this.cellRealWare.type = '虚拟库存';
                            break;
                        }
                    }
                    this.checkRealWareDialog = true;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });
        },
        // open dialog
        openSort () {
            this.$nextTick(() => {
                this.$refs.sortDialogForm.resetFields();
            });
        },
        openAddVideo () {
            this.$nextTick(() => {
                this.$refs.videoDialogForm.resetFields();
            });
        },
        openMainType () {
            this.$nextTick(() => {
                this.$refs.mainDialogForm.resetFields();
            });
        },
        openBin () {
            this.$nextTick(() => {
                this.$refs.binDialogForm.resetFields();
            });
        },
        openShip () {
            this.$nextTick(() => {
                this.$refs.shipDialogForm.resetFields();
            });
        },
        openLabel () {
            this.$nextTick(() => {
                this.$refs.labelDialogForm.resetFields();
            });
        },
        openStock () {
            this.$nextTick(() => {
                this.stockOpt = [];
                this.selectWare = [];
                this.$refs.stockDialogForm.resetFields();
            });
        },
        openGoodsStock() {
            this.$nextTick(() => {
                this.goodsStockForm.virWhCode = '';
                this.goodsStockForm.data = [];
                this.selectWare = [];
                // this.$refs.goodsStockForm.resetFields();
            });
        },
        openPipe () {
            this.$nextTick(() => {
                this.$refs.pipeDialogForm.resetFields();
            });
        },
        pipeEdit() {
            this.$refs.pipeDialogForm.validate(valid => {
                if (valid) {
                    let temp = [];
                    this.checkedRow.forEach(item => {
                        temp.push(item.goodSn);
                    });
                    let src;
                    if (this.pipeForm.type == 1) {
                        src = 'goods/goods/goods-pipeline-add';
                    } else {
                        src = 'goods/goods/goods-pipeline-del';
                    }

                    this.pipeLoading = true;
                    try {
                        this.$http.post(src, {
                            pipelineCodeList: this.pipeForm.pipelineCodeList,
                            goodSnList: temp,
                        }).then(res => {
                            if (res.body.code === 0) {
                                let data = res.body.data,
                                    temp = {},
                                    str = '',
                                    containList = data.catPipelineNotContainList,
                                    exist = data.priceNotExistMap;

                                if (Object.keys(exist).length === 0 && containList.length === 0) {
                                    this.$message.success(res.body.message);
                                    this.pipeDialog = false;
                                    this.getData();
                                } else {
                                    // 错误提示
                                    if (containList.length > 0) {
                                        this.pipeEditNotice.contain = containList.join(',');
                                    };

                                    if (Object.keys(exist).length > 0) {
                                        for (let i in exist) {
                                            let item = exist[i];
                                            for (let j in item) {
                                                let subitem = item[j];
                                                temp[subitem] = temp[subitem] || [];
                                                temp[subitem].push(i);
                                            }
                                        };
                                        this.pipeEditNotice.exist = temp;
                                    }
                                    this.pipeDialog = false;
                                    this.pipeEditNotice.isShow = true;
                                }
                            } else {
                                this.$message.error(res.body.message);
                                // 错误提示信息，未完成
                            }
                        });
                    } finally {
                        this.pipeLoading = false;
                    }
                }
            })

        },
        // 0.95新增 设置商品库存
        async changeVir(val) {
            let params = {
                virCodeList: [val]
            };
            let data = await this.httpGet_('stock/stock/get-real-wares', {params: params});
            data.realWareHouseList.forEach(item => {
                item.stockNum = '';
            });
            this.goodsStockForm.data = [];
            // 选择仓库
            this.defaultStatusOpt = data.realWareHouseList;
            this.selectWare = [];
        },
        postGoodsStock() {
            this.$refs.goodsStockForm.validate(async valid => {
                if (valid) {
                    let temp = [],
                        formData = this.goodsStockForm.data;
                    this.checkedRow.forEach(item => {
                        formData.forEach(subItem => {
                            temp.push({
                                realWhCode: subItem.realWhCode,
                                goodSn: item.goodSn,
                                stockNum: subItem.stockNum,
                            })
                        })
                    })
                    let params = {
                        goodsStockReqList: temp
                    };
                    try {
                        const data = await this.httpPost_('stock/lucky-bag/add', params);
                        this.$message.success(data.message);
                    } finally {
                        this.goodsStockLoading = false;
                    }
                }
            })
        },

        // video交互修改
        addVideoInpt() {
            this.addVideoForm.list.push('');
        },
        // 终端修改
        // changeTerminal(val, row, index) {

        //     temp = this.terminalMap.filter(e => e.terminal_id == index).map(el => el.platform_id);
        //     tempArr = tempArr.concat(temp);

        //     row.terminal[index].check = val.target.checked;
        // },
        // 修改可选仓库
        changeTable(val, table, key) {
            // @val 选择器数组
            // @table 表格数据 字符串
            // @key 对比字段 字符串
            let temp = [];
            val.forEach(code => {
                for(let i in this.defaultStatusOpt) {
                    let item = this.defaultStatusOpt[i];
                    if (item[key] === code) {
                        temp.push(item);
                        break;
                    }
                }
            });
            if (table.indexOf('.') === -1) {
                this.$set(this, table, temp);
            } else {
                let keyList = table.split('.');
                this.$set(this[keyList[0]], keyList[1], temp);
            }
            
        },
    }
}
</script>

<style lang="less" >
    .good-col-set {
        height: 300px;
        overflow-y: auto!important;

        .el-checkbox {
            display: block;
            margin-left: 15px;
        }
    }

    .good-list-handle-btn {
        margin-bottom: 5px;
    }

    .ship-area-dialog {
        td {
            padding: 10px;
        }
    }

    .shipArea-group {
        padding-left: 20px;
    }

    .good-list{
        .pipe-edit-notice {
            word-break: break-all;

            p {
                margin-bottom: 5px;
            }
        }

        .cat-tree {
            width: 400px;
        }

        .page-toolbar {
            position: relative;

            .el-pagination {
                display: inline-block;
            }

            .style {
                display: inline-block;
                position: relative;
                font-size: 13px;
                top: 5px;
                left: 16px;
                color: #48576a;
            }
        }

        .list-table {
            .el-table__body-wrapper {
                overflow-x: scroll;
            }
        }

        .search-form {

            &.el-form--inline {

                .el-form-item {
                    margin-right: 0;
                }
            }
        }

        .search-tip {
            font-size: 12px;
            color: #ccc;
        }

        .title-pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .good-dialog-sheet {
            word-break: break-all;
        }

        .good-dialog-remark {
            margin-top: 10px;
        }

        .good-dialog-tbody {
            height: 100px;
            overflow-y: auto;
        }

        h2{border-bottom: 1px solid #ddd;margin-bottom: 20px;padding-bottom: 5px;font-size:18px;font-weight: normal;}
        h2 span{position: relative;display: inline-block;}
        h2 span:after{content:'';display:block;position:absolute;width:100%;border-bottom: 2px solid #20a0ff;bottom:-5px;}
        h3{
            margin: 20px 0;
        }
        .align-center{text-align: center;}
        .fold{border-top: 1px solid #ddd;font-size: 0;}
        .fold button{border-radius: 0;position: relative;top:-1px;border-top: 1px solid #fff;padding-left: 50px;padding-right: 50px;}
        .fold button:hover,.fold button:focus{border-color: #ddd;border-top-color: #fff;}
        .el-table th,.el-table td{text-align: center;}
        .el-table .el-button+.el-button{margin-left: 2px;}
        .el-pagination{text-align: right;margin-top: 10px;}
        .result-operation .el-button{margin-top: 1px;}
        .result-operation .el-button+.el-button{margin-left: 3px;}
        .el-table th>.cell{line-height: 1.5;}
    }
</style>
