<template>
    <div class="campaigns-edit" @click="closeTree($event)">
        <div class="el-container" v-loading="fullLoading">
            <el-row>
                <el-col :span="20">
                    <el-form label-width="100px" ref="postForm" :model="option" :rules="postRule">
                        <p class="cat-title"><strong>基础信息</strong></p>
                        <div class="el-sub-container">
                            <el-form-item label="活动名称" prop="activityName">
                                <el-input v-model.trim="option.activityName"></el-input>
                            </el-form-item>
                            <el-form-item label="活动类型" porp="activityType" required>
                                <el-select filterable :disabled="!editAble" v-model="option.activityType" @change="changeType">
                                    <el-option v-for="item in typeOpt" :key="item.value" :label="item.text" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="活动终端" prop="activityConditions.platform">
                                <el-checkbox-group v-model="terminal">
                                    <el-checkbox :disabled="!editAble" v-for="item in terminalOpt" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="生效渠道" prop="pipelineCode">
                                <el-select :disabled="!editAble" clearable filterable v-model="option.pipelineCode">
                                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="适用店铺" prop="shopCodes" v-if="option.activityType != 3">
                                <el-select :disabled="!editAble" multiple :multiple-limit="option.activityType == 1 ? 0 : 1" clearable filterable v-model="option.shopCodes">
                                    <el-option v-for="(item, index) in storeOpt" :key="index" :value="index" :label="item"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="活动时间" prop="editDate">
                                <el-date-picker v-model="option.editDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.editDate)"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="活动备注" prop="remark">
                                <el-input v-model.trim="option.remark" :rows="4" type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item label="参与条件" required prop="activityConditions.userCondition">
                                <el-radio-group class="condition" v-model="option.activityConditions.userCondition" @change="changeCondition">
                                    <el-radio :disabled="!editAble && option.activityType != 4" label="0">全部用户</el-radio>
                                    <el-radio :disabled="!editAble && option.activityType != 4" label="1">新用户</el-radio>
                                    <el-radio :disabled="!editAble && option.activityType != 4" label="2">老用户</el-radio>
                                    <div class="item">
                                        <el-col :span="3" class="level">
                                            <el-radio :disabled="!editAble && option.activityType != 4" label="3">会员等级</el-radio>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-col :span="14">
                                                <el-select filterable :disabled="option.activityConditions.userCondition != '3' || !editAble && option.activityType != 4" v-model="option.activityConditions.userLevelLimit" multiple>
                                                    <el-option v-for="item in memberOpt" :key="item.id" :label="item.levelName" :value="String(item.id)"></el-option>
                                                </el-select>
                                            </el-col>
                                        </el-col>
                                    </div>
                                    <div class="item">
                                        <el-col :span="3" class="level">
                                            <el-radio :disabled="!editAble && option.activityType != 4" label="4">会员标签</el-radio>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-col :span="14">
                                                <el-select filterable multiple :disabled="option.activityConditions.userCondition != '4' || !editAble && option.activityType != 4" v-model="option.activityConditions.userLabel" placeholder="请选择">
                                                    <el-option-group v-for="group in labelOpt" :key="group.id" :label="group.labelTypeName">
                                                        <el-option v-for="item in group.memLabels" :key="item.id" :label="item.name" :value="String(item.id)">
                                                        </el-option>
                                                    </el-option-group>
                                                </el-select>
                                            </el-col>
                                        </el-col>
                                    </div>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="排除条件">
                                <el-radio-group class="condition" v-model="excludeArr">
                                    <div class="item exclude">
                                        <el-col :span="3" class="level">
                                            <el-radio :disabled="!editAble && option.activityType != 4" label="1">会员标签</el-radio>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-col :span="14">
                                                <el-select filterable multiple :disabled="!editAble && option.activityType != 4" v-model="option.activityConditions.excludeUserLabel " placeholder="请选择">
                                                    <el-option-group v-for="group in labelOpt" :key="group.id" :label="group.labelTypeName">
                                                        <el-option v-for="item in group.memLabels" :key="item.id" :label="item.name" :value="String(item.id)">
                                                        </el-option>
                                                    </el-option-group>
                                                </el-select>
                                            </el-col>
                                        </el-col>
                                    </div>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                        <!-- 除抽奖外的活动商品选择 -->
                        <p class="cat-title" v-if="option.activityType != 3"><strong>活动商品</strong></p>
                        <div class="el-sub-container" v-if="option.activityType != 3">
                            <el-form-item label="活动仓库" prop="warehouseCode" :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]">
                                <el-select filterable :disabled="!editAble" v-model="option.warehouseCode">
                                    <el-option v-for="item in wareOpt" :key="item.virWhCode" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="添加方式" prop="addType" v-if="option.activityType == 1 || option.activityType == 2 || option.activityType == 4">
                                <el-radio-group v-model="option.addType">
                                    <el-radio :disabled="!editAble && option.activityType != 4" :label="2">按品牌添加</el-radio>
                                    <el-radio :disabled="!editAble && option.activityType != 4" :label="1">按分类添加</el-radio>
                                </el-radio-group>
                                <div v-show="option.addType == '2'">
                                    <el-select filterable :disabled="!editAble && option.activityType != 4" v-model="option.addArr" multiple>
                                        <el-option v-for="item in brandData" :key="item.id" :label="item.brandTitle" :value="item.brandCode"></el-option>
                                    </el-select>
                                </div>
                                <div class="custom-tree-item" v-show="option.addType == '1'">
                                    <el-input :disabled="!editAble && option.activityType != 4" :readonly="true" v-model="option.addString" @click.native="changeTreeFlag(!editAble && option.activityType != 4)" class="js_input"></el-input >
                                    <el-tree :disabled="!editAble && option.activityType != 4" v-show="treeFlag" :data="treeData" show-checkbox :props="treeProps" ref="tree" node-key="id"></el-tree>
                                    <div class="btn-box">
                                        <el-button type="primary" v-show="treeFlag" @click="changeTree">确认选择</el-button>
                                        <el-button type="danger" v-show="treeFlag" @click="treeFlag = false">取消</el-button>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="添加商品">
                                <template>
                                    <el-button v-if="option.activityType != 6" type="primary" @click="getCat('goods')" v-loading="dialogLoading" :disabled="!editAble || dialogLoading">添加商品</el-button>
                                    <el-button v-if="option.activityType == 6" type="primary" @click="getCat('gift')" v-loading="dialogLoading" :disabled="!editAble || dialogLoading">添加商品</el-button>
                                </template>
                                <el-button type="primary" v-if="option.activityType == 2 || option.activityType == 4 || option.activityType == 5" :disabled="!editAble || !option.goodSns || sameLoading" v-loading="sameLoading" @click="getSame">获取同款SKU</el-button>
<!--                                 <el-checkbox v-if="option.activityType == 2 || option.activityType == 4 || option.activityType == 5" :disabled="!editAble" v-model="option.activityConditions.isSameParagraph" true-label="1" false-label="0">同款生效</el-checkbox> -->
                            </el-form-item>
                            <el-form-item v-if="option.activityType != 3 && option.activityType != 6" label="凑单SKU" prop="goodSns" :rules="[{validator: checkGoodsSns, trigger: 'blur'}, {required: true, message: '该项不能为空'}]">
                                <el-input :disabled="!editAble" v-model.trim="option.goodSns" :rows="4" type="textarea" placeholder="多个SKU之间使用英文,分开"></el-input>
                            </el-form-item>
                            <!-- M原N件 -->
                            <template v-if="option.activityType == 6">
                                <el-form-item label="活动商品">
                                    <el-table :data="selectData" border :height="selectData.length > 4 ? 400 : ''" class="form-table">
                                        <el-table-column prop="goodSn" width="120px" label="SKU"></el-table-column>
                                        <el-table-column prop="mainImage" label="主图" width="150px">
                                            <template scope="scope">
                                                <img class="table-img" :src="self.domain + scope.row.mainImage.thumbUrl" width="90" height="120">
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="商品标题" width="200px">
                                            <template scope="scope">
                                                <pre class="title-pre">{{scope.row.goodTitle}}</pre>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="stock" label="库存"></el-table-column>
                                        <el-table-column label="商品状态" width="170px">
                                            <template scope="scope">
                                                <p v-for="(item, index) in scope.row.goodsInfoExtendList" :key="index">{{self.tableRes('platforms', item.platform)}}: {{self.tableRes('goodStatusOpts', item.goodsStatus)}}</p>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="shopPrice" width="100px" label="本店售价"></el-table-column>
                                        <el-table-column width="150px" label="活动总数">
                                            <template scope="scope">
                                                <el-form-item v-if="option.activityRules[scope.$index]" :prop="'activityRules.' + scope.$index + '.count'" :rules="[{required: true, message: '不能为空'},{validator: checkInt}]">
                                                    <el-input :disabled="!editAble" v-model="option.activityRules[scope.$index].count"></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作">
                                            <template scope="scope">
                                                <el-button :disabled="!editAble" type="danger" @click="removeGift(scope.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </template>
                        </div>
                        <!-- 满减活动规则 -->
                        <p class="cat-title"><strong>活动规则</strong></p>
                        <div class="el-sub-container">
                            <div v-if="option.activityType == 1">
                                <el-form-item label="满减类型" prop="activityConditions.isLimit" :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]">
                                    <el-radio-group :disabled="!editAble" v-model="option.activityConditions.isLimit" @change="changeLimit">
                                        <el-radio label="1">封顶</el-radio>
                                        <el-radio label="0">不封顶</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="满减设置" prop="activityRules" :rules="[{validator: this.checkType1, trigger: 'blur'}]">
                                    <template v-for="(item, index) in option.activityRules">
                                        <el-row class="text-center item-arr">
                                            <el-col :span="1">满</el-col>
                                            <el-col :span="9">
                                                <el-input :disabled="!editAble" v-model.trim="item.meetAmount" placeholder="金额"></el-input>
                                            </el-col>
                                            <el-col :span="1">减</el-col>
                                            <el-col :span="9">
                                                <el-input :disabled="!editAble" v-model.trim="item.preferentialValue" placeholder="金额"></el-input>
                                            </el-col>
                                            <el-col :span="4" v-if="option.activityConditions.isLimit == 1">
                                                <el-button :disabled="!editAble" type="primary" icon="plus" @click="addItem"></el-button>
                                                <el-button :disabled="!editAble" type="danger" icon="minus" @click="removeItem(index)"></el-button>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-form-item>
                            </div>
                            <!-- 满赠活动规则 -->
                            <div v-if="option.activityType == 2">
                                <el-form-item label="最多可选" prop="activityConditions.maxGiftCount" :rules="[{validator: checkInt}, required]">
                                    <el-input :disabled="!editAble" v-model="option.activityConditions.maxGiftCount"></el-input>
                                </el-form-item>
                                <el-form-item label="满赠设置" prop="activityRules" :rules="[{validator: this.checkType2}, {validator: this.checkType2, trigger: 'change'}]">
                                    <template v-for="(item, index) in option.activityRules">
                                        <el-row class="text-center item-arr">
                                            <el-col :span="2">消费满</el-col>
                                            <el-col :span="2">
                                                <el-input :disabled="!editAble" v-model.trim="item.meetAmount" placeholder="金额"></el-input>
                                            </el-col>
                                            <el-col :span="1">赠</el-col>
                                            <el-col :span="3">
                                                <el-select filterable :disabled="!editAble" v-model="item.preferentialType" placeholder="赠品类型">
                                                    <el-option v-for="item in preferentialOpt" :key="item.id" :value="item.value" :label="item.text"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="3">
                                                <span v-if="item.preferentialType == '2'">积分数量</span>
                                                <span v-if="item.preferentialType == '3'">COUPON模板</span>
                                                <span v-if="item.preferentialType == '4'">赠送总数</span>
                                                <span v-if="item.preferentialType == '5'">抽奖活动</span>
                                            </el-col>
                                            <template v-if="item.preferentialType == '2'">
                                                <el-col :span="4">
                                                    <el-input :disabled="!editAble" v-model.trim="item.preferentialValue" placeholder="数量"></el-input>
                                                </el-col>
                                            </template>
                                            <template v-if="item.preferentialType == '3'">
                                                <el-col :span="8">
                                                    <el-select :disabled="!editAble" v-model="item.preferentialValue">
                                                        <el-option v-for="item in couponOpt" :key="item.templateId" :value="String(item.templateId)" :label="item.templateName + item.strategys"></el-option>
                                                    </el-select>
                                                </el-col>
                                            </template>
                                            <template v-if="item.preferentialType == '4'">
                                                <el-col :span="2">
                                                    <el-input :disabled="!editAble" v-model.trim="item.count" placeholder="数量"></el-input>
                                                </el-col>
                                                <el-col :span="3">
                                                    <span>单次赠送数量</span>
                                                </el-col>
                                                <el-col :span="2">
                                                    <el-input disabled v-model.trim="item.preferentialValue" placeholder="数量"></el-input>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-button :disabled="!editAble" type="primary" icon="plus" @click="addItem"></el-button>
                                                    <el-button :disabled="!editAble" type="danger" icon="minus" @click="removeItem(index)"></el-button>
                                                </el-col>
                                                <el-col :span="24">
                                                    <el-input :disabled="!editAble" type="textarea" :rows="4" v-model.trim="option.activityGifts[item.priority].goodSn" placeholder="请输入/粘贴商品SKU,多个SKU之间使用英文,隔开"></el-input>
                                                </el-col>
                                            </template>
                                            <template v-if="item.preferentialType == '5'">
                                                <el-col :span="4">
                                                    <el-select filterable v-model="item.preferentialValue">
                                                        <el-option v-for="item in prizeOpt" :key="item.activityId" :value="item.activityId" :label="item.name"></el-option>
                                                    </el-select>
                                                </el-col>
                                                <el-col :span="2">
                                                    <span>抽奖次数</span>
                                                </el-col>
                                                <el-col :span="2">
                                                    <el-input :disabled="!editAble" v-model.trim="item.singleCount" placeholder="数量"></el-input>
                                                </el-col>
                                            </template>
                                            <el-col :span="4" v-if="item.preferentialType != '4'">
                                                <el-button :disabled="!editAble" type="primary" icon="plus" @click="addItem"></el-button>
                                                <el-button :disabled="!editAble" type="danger" icon="minus" @click="removeItem(index)"></el-button>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-form-item>
                            </div>
                            <!-- 买即赠活动规则 -->
                            <div v-if="option.activityType == 5">
                                <el-form-item label=" ">
                                    <el-button type="primary" @click="getCat('gift')" v-loading="dialogLoading" :disabled="!editAble || dialogLoading">添加赠品</el-button>
                                </el-form-item>
                                <el-form-item label="活动赠品">
                                    <el-table :data="selectData" border :height="selectData.length > 4 ? 400 : ''" class="form-table">
                                        <el-table-column prop="goodSn" width="120px" label="SKU"></el-table-column>
                                        <el-table-column prop="mainImage" label="主图" width="150px">
                                            <template scope="scope">
                                                <img class="table-img" :src="self.domain + scope.row.mainImage.thumbUrl" width="90" height="120">
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="商品标题" width="200px">
                                            <template scope="scope">
                                                <pre class="title-pre">{{scope.row.goodTitle}}</pre>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="stock" label="库存"></el-table-column>
                                        <el-table-column label="商品状态" width="170px">
                                            <template scope="scope">
                                                <p v-for="(item, index) in scope.row.goodsInfoExtendList" :key="index">{{self.tableRes('platforms', item.platform)}}: {{self.tableRes('goodStatusOpts', item.goodsStatus)}}</p>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="shopPrice" width="100px" label="本店售价"></el-table-column>
                                        <el-table-column width="150px" label="单次赠送">
                                            <template scope="scope">
                                                <el-form-item v-if="option.activityRules[scope.$index]" :prop="'activityRules.' + scope.$index + '.singleCount'" :rules="[{required: true, message: '不能为空'},{validator: checkInt}]">
                                                    <el-input :disabled="!editAble" v-model="option.activityRules[scope.$index].singleCount"></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="150px" label="赠品总数">
                                            <template scope="scope">
                                                <el-form-item v-if="option.activityRules[scope.$index]" :prop="'activityRules.' + scope.$index + '.count'" :rules="[{required: true, message: '不能为空'},{validator: checkInt}]">
                                                    <el-input :disabled="!editAble" v-model="option.activityRules[scope.$index].count"></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作">
                                            <template scope="scope">
                                                <el-button size="small" :disabled="!editAble" type="danger" @click="removeGift(scope.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </div>
                            <!-- M元N件活动规则 -->
                            <div v-if="option.activityType == 6">
                                <el-form-item label="条件设置">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item prop="activityConditions.fixedPrice.meetAmount" :rules="[{required: true, message: '该项不能为空',}, {validator: checkInt}]">
                                                <el-input :disabled="!editAble" v-model="option.activityConditions.fixedPrice.meetAmount"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" class="text-center">$,</el-col>
                                        <el-col :span="1" class="text-center">任选</el-col>
                                        <el-col :span="8">
                                            <el-form-item prop="activityConditions.fixedPrice.num" :rules="[{required: true, message: '该项不能为空',}, {validator: checkInt}]">
                                                <el-input :disabled="!editAble" v-model="option.activityConditions.fixedPrice.num"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" class="text-center">件</el-col>
                                    </el-row>
                                </el-form-item>
                            </div>
                            <!-- 抽奖活动规则 -->
                            <div v-if="option.activityType == 3">
                                <el-form-item label="初始次数">
                                    <div class="leto">
                                        <el-row>
<!--                                             <el-col :span="4">
                                                <el-checkbox v-model="prize.dayUseCount">单日参与次数</el-checkbox>
                                            </el-col> -->
                                            <!-- <el-col :span="4" v-if="prize.dayUseCount"> -->
                                            <el-col :span="6">
                                                <el-form-item prop="activityConditions.dayUseCount" :rules="[{validator: checkNature}, {required: true, message: '该项不能为空'}]" label="单个用户单日可参与次数" label-width="200px">
                                                    <el-input v-model.trim="option.activityConditions.dayUseCount"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="9" :offset="9" class="text-left">单个用户单日可参与次数</el-col>
                                        </el-row>
                                    </div>
                                    <div class="leto">
                                        <el-row>
<!--                                             <el-col :span="4">
                                                <el-checkbox v-model="prize.userLimitCount">单用户参与次数</el-checkbox>
                                            </el-col> -->
                                            <!-- <el-col :span="4" v-if="prize.userLimitCount"> -->
                                            <el-col :span="6">
                                                <el-form-item prop="activityConditions.userLimitCount" :rules="[{validator: checkNature}, {required: true, message: '该项不能为空'}]" label="单用户参与次数" label-width="200px">
                                                    <el-input v-model.trim="option.activityConditions.userLimitCount"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="9" :offset="9" class="text-left">活动全程，单用户可用次数</el-col>
                                        </el-row>
                                    </div>
                                </el-form-item>
                                <el-form-item label="赠送规则">
                                    <!-- 积分抽奖 -->
                                    <el-row>
                                        <el-col :span="3">
                                            <el-checkbox :disabled="!editAble" v-model="prize.integralRule">积分兑换</el-checkbox>
                                        </el-col>
                                        <el-col :span="3" v-if="prize.integralRule">
                                            <el-form-item prop="activityConditions.integralRule.integral" :rules="[{validator: checkInt}, {required: true, message: '该项不能为空'}]" required>
                                                    <el-input :disabled="!editAble" v-model.trim="option.activityConditions.integralRule.integral"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="4" class="text-center" v-if="prize.integralRule">
                                            积分/次,最多可兑换
                                        </el-col>
                                        <el-col :span="3" v-if="prize.integralRule">
                                            <el-form-item prop="activityConditions.integralRule.num" :rules="[{validator: checkInt}, {required: true, message: '该项不能为空'}]" required>
                                                    <el-input v-model.trim="option.activityConditions.integralRule.num"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" class="text-center" v-if="prize.integralRule">
                                            次
                                        </el-col>
                                        <el-col :span="7" :offset="prize.integralRule ? 3 : 12" class="text-left">
                                            消耗积分兑换抽奖次数
                                        </el-col>
                                    </el-row>
                                    <!-- 分享赠送 -->
                                    <el-row class="share-rule">
                                        <el-col :span="3">
                                            <el-checkbox :disabled="!editAble" v-model="prize.shareRule">分享赠送</el-checkbox>
                                        </el-col>
                                        <el-col :span="3" v-if="prize.shareRule">
                                            <el-form-item prop="activityConditions.shareRule.shareQty" :rules="[{validator: checkInt}, {required: true, message: '该项不能为空'}]" required>
                                                    <el-input :disabled="!editAble" v-model.trim="option.activityConditions.shareRule.shareQty"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="4" class="text-center" v-if="prize.shareRule">
                                            次分享/次,最多可赠送
                                        </el-col>
                                        <el-col :span="3" v-if="prize.shareRule">
                                            <el-form-item prop="activityConditions.shareRule.num" :rules="[{validator: checkInt}, {required: true, message: '该项不能为空'}]" required>
                                                    <el-input v-model.trim="option.activityConditions.shareRule.num"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" class="text-center" v-if="prize.shareRule">
                                            次
                                        </el-col>
                                        <el-col :span="7" :offset="prize.shareRule ? 3 : 12" class="text-left">
                                            消耗积分兑换抽奖次数
                                        </el-col>
                                    </el-row>
                                    <!-- 支付抽奖 -->
                                    <!-- 0.9删除 -->
                                    <!-- <el-row class="pay-rule">
                                        <el-col :span="3">
                                            <el-checkbox :disabled="!editAble" v-model="prize.payedRule">支付抽奖</el-checkbox>
                                        </el-col>
                                        <el-col :span="2" class="text-center" v-if="prize.payedRule">
                                            支付金额满
                                        </el-col>
                                        <el-col :span="3" v-if="prize.payedRule">
                                            <el-form-item prop="activityConditions.payedRule.payedAmount" :rules="[{validator: checkInt}, {required: true, message: '该项不能为空'}]" required>
                                                    <el-input :disabled="!editAble" v-model.trim="option.activityConditions.payedRule.payedAmount"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2" class="text-center" v-if="prize.payedRule">
                                            获得
                                        </el-col>
                                        <el-col :span="3" v-if="prize.payedRule">
                                            <el-form-item prop="activityConditions.payedRule.num" :rules="[{validator: checkInt}, {required: true, message: '该项不能为空'}]" required>
                                                    <el-input :disabled="!editAble" v-model.trim="option.activityConditions.payedRule.num"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2" class="text-center" v-if="prize.payedRule">
                                            次抽奖
                                        </el-col>
                                    </el-row> -->
                                </el-form-item>
                                <el-form-item label="领奖方式" required>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-radio :disabled="!editAble" v-model="option.activityConditions.grantWay" :label="0">自动发放</el-radio>
                                        </el-col>
                                        <el-col :span="9" :offset="7" class="text-left">
                                            用户抽中奖品立即发放到用户账户
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-radio :disabled="!editAble" v-model="option.activityConditions.grantWay" :label="1">人工发放</el-radio>
                                        </el-col>
                                        <el-col :span="9" :offset="7" class="text-left">
                                            用户抽中奖品后，运营手动点击发放，进行奖品发放
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-radio :disabled="!editAble" v-model="option.activityConditions.grantWay" :label="2">主动领取</el-radio>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="必中设定" required>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-radio-group v-model="option.activityConditions.isRaffle">
                                                <el-radio :disabled="!editAble" :label="0">不必中</el-radio>
                                                <el-radio :disabled="!editAble" :label="1">必中</el-radio>
                                            </el-radio-group>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="奖品时限">
                                    <el-row>
                                        <el-col :span="2" class="text-center">
                                            发放成功后
                                        </el-col>
                                        <el-col :span="3">
                                            <el-form-item prop="activityConditions.day" :rules="[{validator: checkInt, trigger: 'blur'}]">
                                                    <el-input :disabled="!editAble" v-model.trim="option.activityConditions.day"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" class="text-center">
                                            天
                                        </el-col>
                                        <el-col :span='3'>
                                            <el-form-item prop="activityConditions.hour" :rules="[{validator: checkInt, trigger: 'blur'}]">
                                                    <el-input :disabled="!editAble" v-model.trim="option.activityConditions.hour"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1" class="text-center">
                                            小时
                                        </el-col>
                                        <el-col :span="9" :offset="5" class="text-left">
                                            用户抽中实物奖品后，需要在该时间段内完成生单，否则奖品失效
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </div>
                            <!-- 加价购 -->
                            <div v-if="option.activityType == 4">
                                <el-form-item label="最多可选" prop="activityConditions.maxGiftCount" :rules="[{validator: checkInt}, required]">
                                    <el-input v-model="option.activityConditions.maxGiftCount"></el-input>
                                </el-form-item>
                                <el-form-item label="换购单品" class="redemption" prop="activityRules" :rules="[{validator: this.checkType3, trigger: 'blur'}]">
                                    <template v-for="(item, index) in option.activityRules" >
                                        <el-row class="text-center item-arr">
                                            <el-col :span="1" class="add-shop">
                                                <el-checkbox v-model="item.status" :true-label="0" :false-label="1"></el-checkbox>
                                            </el-col>
                                            <el-col :span="2" class="add-shop">
                                                <label style="width: 20px;">满</label>
                                                <div style="margin-left: 20px;">
                                                    <el-input :disabled="!editAble && item.old" v-model.trim="item.meetAmount" placeholder="金额"></el-input>
                                                </div>
                                            </el-col>
                                            <el-col :span="3" class="add-shop">
                                                <label style="width: 40px;">换购</label>
                                                <div style="margin-left: 40px;">
                                                    <el-input :disabled="!editAble && item.old" v-model.trim="item.preferentialValue" placeholder="SKU"></el-input>
                                                </div>
                                            </el-col>
                                            <el-col :span="4" class="add-shop">
                                                <label style="width: 60px;">换购价</label>
                                                <div style="margin-left: 60px;">
                                                    <el-input :disabled="!editAble && item.old" v-model.trim="item.price" placeholder="金额"></el-input>
                                                </div>
                                            </el-col>
                                            <el-col :span="4" class="add-shop">
                                                <label style="width: 70px;">赠品总数</label>
                                                <div style="margin-left: 70px;">
                                                    <el-input v-model.trim="item.count" placeholder="数量"></el-input>
                                                </div>
                                            </el-col>
                                            <el-col :span="4" class="add-shop">
                                                <label style="width: 85px;">单次赠送数</label>
                                                <div style="margin-left: 85px;">
                                                    <el-input disabled v-model.trim="item.singleCount" placeholder="数量"></el-input>
                                                </div>
                                            </el-col>
                                            <el-col :span="3" class="add-shop">
                                                <label style="width: 40px;">排序</label>
                                                <div style="margin-left: 40px;">
                                                    <el-input :disabled="!editAble && item.old" v-model.trim="item.priority" placeholder="序号"></el-input>
                                                </div>
                                            </el-col>
                                            <el-col :span="3">
                                                <el-button type="primary" icon="plus" @click="addFareincrease"></el-button>
                                                <el-button :disabled="!editAble && item.old" type="danger" icon="minus" @click="removeItem(index)"></el-button>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-form-item>
                            </div>
                            <el-form-item label="参与次数" v-if="option.activityType != 3" prop="activityConditions.userCount" :rules="[{validator: checkInt, trigger: 'blur'}]">
                                <el-input :disabled="!editAble && option.activityType != 4" v-model.trim="option.activityConditions.userCount"></el-input>
                            </el-form-item>
                            <el-form-item label="Coupon" v-if="option.activityType != 3" prop="activityConditions.isCoupon" required :rules="[{required: true, message: '该项不能为空'}]">
                                <el-radio-group v-model="option.activityConditions.isCoupon">
                                    <el-radio :disabled="!editAble" label="1">仍可使用</el-radio>
                                    <el-radio :disabled="!editAble" label="0">不可使用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                        <div class="text-center">
                            <el-button type="primary" @click="postEdit" v-if="editControl" v-loading="postLoading" :disabled="postLoading">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <!-- 弹窗S -->
        <el-dialog v-model="goodDialog" size="large" class="marketing-goods-dialog" :lock-scroll="true" top="2%" @open="openCall">
            <el-form label-width="100px" inline ref="searchForm" :model="dialog">
                <el-form-item label="快速搜索" prop="keyword">
                    <el-input v-model="dialog.keyword" class="quick-search" placeholder="外部商品编码(多编号“,”划分)">
                        <el-select filterable clearable v-model="dialog.field" slot="prepend" placeholder="请选择">
                            <el-option v-for="(item, index) in opts.quickSearchOpts" :key="index" :label="item.label" :value="index">
                            </el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <div>
                    <el-form-item label="分类:" prop="categoryList">
                        <el-cascader filterable clearable v-model="dialog.categoryList" class="cat-tree" :options="catTree" change-on-select :props="prop" @change="changeCatTree"></el-cascader>
                    </el-form-item>
                </div>
                <el-form-item label="本店售价:">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item prop="shopPriceStart">
                                <el-input v-model="dialog.shopPriceStart"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" class="text-center">—</el-col>
                        <el-col :span="11">
                            <el-form-item prop="shopPriceEnd">
                                <el-input v-model="dialog.shopPriceEnd"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="生效平台:" prop="platform">
                    <el-select filterable clearable v-model="dialog.platform" placeholder="请选择生效平台">
                        <el-option v-for="item in opts.platforms" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品状态:" prop="goodStatus">
                    <el-select filterable clearable v-model="dialog.goodStatus" placeholder="请选择商品状态">
                        <el-option v-for="item in opts.goodStatusOpts" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" icon="search" @click="getGoodList">筛选</el-button>
                    <el-button type="danger" icon="close" @click="resetForm">清空</el-button>
                </div>
            </el-form>
            <!-- 商品列表 -->
            <el-table :data="tableData" border ref="dataTable" v-loading="tableLoading" height="600" @selection-change="changeSku" @row-click="clickRow">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="goodSn" width="120px" label="SKU"></el-table-column>
                <el-table-column prop="mainImage" label="主图" width="150px">
                    <template scope="scope">
                        <img class="table-img" :src="self.domain + scope.row.mainImage.thumbUrl" width="90" height="120">
                    </template>
                </el-table-column>
                <el-table-column label="商品标题" width="200px">
                    <template scope="scope">
                        <pre class="title-pre">{{scope.row.goodTitle}}</pre>
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="库存"></el-table-column>
                <el-table-column label="商品状态" width="170px">
                    <template scope="scope">
                        <p v-for="(item, index) in scope.row.goodsInfoExtendList" :key="index">{{self.tableRes('platforms', item.platform)}}: {{self.tableRes('goodStatusOpts', item.goodsStatus)}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="shopPrice" width="100px" label="本店售价"></el-table-column>
            </el-table>
            <!--  -->
            <div class="el-container last text-right page-toolbar">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="dialog.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="dialog.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
            <!--  -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addGoods" v-if="this.option.activityType != 6 && this.goodsDialogType === 'goods'">添加到凑单SKU</el-button>
                <el-button type="primary" @click="addActiveGoods" v-if="this.option.activityType == 6 && this.goodsDialogType === 'gift'">添加到活动商品</el-button>
                <el-button type="primary" @click="addActiveGoods" v-if="this.option.activityType == 5 && this.goodsDialogType === 'gift'">添加到活动赠品</el-button>
                <el-button type="danger" @click="goodDialog = false">返回</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        // 格式转换
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

        let self = this;
        let editAble = '';
        if (this.$route.query.id && !this.$route.query.copy) {
            editAble = false;
        }  else {
            editAble = true;
        }

        // 金额有无小数点最多8位，有小数点前面最多6位，大于0
        let exp_2 = /^[1-9]\d{0,7}$|^\d{1,6}(\.\d\d?)$/;
        // let exp_2 = /^(0\.\d\d?)$|^([1-9]\d*(\.\d\d?)?)$/;
        let exp_3 = /^(0\.\d(\d?){2})$|^([1-9]\d*(\.\d(\d?){2})?)$/;

        var checkInt = function (rule, value, callback) {
            if (value === '' || ((Number.isInteger(value * 1) && Number(value) > 0) && value[0] != 0)) {
                callback();
            } else {
                callback(new Error('该项应为正整数'));
            }
        }

        let checkNature = function (rule, value, callback) {
            if (value == 0 || ((Number.isInteger(value * 1) && Number(value) > 0) && value[0] != 0)) {
                callback();
            } else {
                callback(new Error('该项应为大于等于0的整数'));
            }
        }

        // 满减校验
        var checkType1 = function (rule, value, callback) {
            let temp = JSON.parse(JSON.stringify(value));
            temp = temp.sort((a, b) => {
                return a.meetAmount * 1 - b.meetAmount * 1;
            });
            for (let i in temp) {
                let item = temp[i];

                if (i * 1 + 1 < temp.length) {
                    if (temp[i].meetAmount == temp[i * 1 + 1].meetAmount) {
                        callback(new Error('满额条件不能重复'))
                    }
                }

                if (i < temp.length && i > 0) {
                    if (item.preferentialValue * 1 <= temp[i - 1].preferentialValue) {
                        callback(new Error('满额条件与减免金额需要成正比'));
                    }
                }

                if (!exp_2.test(item.meetAmount) || !exp_2.test(item.preferentialValue) || item.meetAmount == 0 | item.preferentialValue == 0) {
                    callback(new Error('满减条件和减免金额必填，且为正数，最多2位小数,有小数时小数点前最多6位，否则最多8位数字'));
                }
            }
            callback();
        }

        // 满赠校验
        var checkType2 = function (rule, value, callback) {
            for (let i in value) {
                let item = value[i];
                let goodsList;

                if (i * 1 + 1 < value.length) {
                    if (value[i].meetAmount == value[i * 1 + 1].meetAmount) {
                        callback(new Error('满额条件不能重复,'))
                    }
                }

                if (!exp_2.test(item.meetAmount) || item.meetAmount == 0) {
                    callback(new Error('满额不能为空，且为正数，最多2位小数,有小数时小数点前最多6位，否则最多8位数字'));
                }

                if (item.preferentialType == '') {
                    callback(new Error('赠品类型不能为空'));
                }
                if (item.preferentialType == 4) {
                    if ((Number.isInteger(item.preferentialValue * 1) && Number(item.preferentialValue) > 0) && (Number.isInteger(item.count * 1) && Number(item.count) > 0)) {

                    } else {
                        callback (new Error('赠品总数和单次赠送数量应为正整数'))
                    }
                } else {
                    if (Number.isInteger(item.preferentialValue * 1) && Number(item.preferentialValue) > 0) {
                    } else {
                        callback (new Error('COUPON模板必选，积分数或抽奖次数应为正整数'))
                    }
                }

                if (item.preferentialType == 4) {
                    goodsList = self.option.activityGifts[item.priority].goodSn;
                    let exp = /^[0-9a-zA-Z]+(\,[0-9a-zA-Z]+)*$/;
                    if (!exp.test(goodsList)) {
                        callback(new Error('赠送商品SKU必填，多个以英文,隔开'));
                    }

                    let arr = goodsList.split(',');
                    let temp = [];
                    for (let i in arr) {
                        let sku = arr[i];
                        if (temp.indexOf(sku) === -1) {
                            temp.push(sku);
                        }
                    }

                    if (temp.length < arr.length) {
                        callback(new Error('输入的赠送商品SKU存在重复，请检查'));
                    }
                }
            }
            callback();
        }

        // 加价购校验
        var checkType3 = function (rule, value, callback) {
            for (let i in value) {
                let item = value[i];

                if (i * 1 + 1 < value.length) {
                    if (value[i].priority == value[i * 1 + 1].priority) {
                        callback(new Error('排序值不能重复'))
                    }
                }

                if (!exp_2.test(item.meetAmount) || item.meetAmount == 0) {
                    callback(new Error('满减条件必填，且为正数，最多2位小数,有小数时小数点前最多6位，否则最多8位数字'));
                }

                if (!exp_2.test(item.price) || item.price == 0) {
                    callback(new Error('换购金额必填，且为正数，最多2位小数,有小数时小数点前最多6位，否则最多8位数字'));
                }

                let exp = /^[0-9a-zA-Z]+$/;
                if (!exp.test(item.preferentialValue)) {
                    callback(new Error('请输入正确的换购商品SKU'));
                }

                if (Number.isInteger(item.count * 1) && Number(item.count) > 0) {

                } else {
                    callback(new Error('赠品总数必填，且为正整数'));
                }

                if (Number.isInteger(item.singleCount * 1) && Number(item.singleCount) > 0) {

                } else {
                    callback(new Error('单次赠送数量必填，且为正整数'));
                }

                if ((Number.isInteger(item.priority * 1) && Number(item.priority) > 0)) {

                } else {
                    callback(new Error('排序值必填，且为正整数'));
                }

            }

            callback();
        }

        let checkDateArr = (rule, value, callback) => {
            if (Boolean(value[0]) && Boolean(value[1])) {
                callback();
            } else {
                callback('该项不能为空')
            }
        }

        let checkGoodsSns = (rule, value, callback) => {
            let exp = /^[0-9a-zA-Z]+(\,[0-9a-zA-Z]+)*$/;
            if (!exp.test(value)) {
                callback(new Error('凑单SKU必填，多个以英文,隔开'));
            }

            let arr = value.split(',');
            let temp = [];
            for (let i in arr) {
                let item = arr[i];
                if (temp.indexOf(item) === -1) {
                    temp.push(item);
                }
            }

            if (temp.length < arr.length) {
                callback(new Error('输入的SKU存在重复，请检查'));
            }
            callback();
        }

        let required = {required: true, message:'该项不能为空'};

        return {
            terminal: [],
            // 排除项
            excludeArr: '1',
            //
            // 配置项
            required: required,
            checkNature: checkNature,
            checkGoodsSns: checkGoodsSns,
            checkDateArr: checkDateArr,
            postLoading: false,
            type: this.$route.query.type,
            id: this.$route.query.id,
            activityId: this.$route.query.activityId,
            copy: this.$route.query.copy,
            unStart: this.$route.query.unStart,
            fullLoading: false,
            checkInt: checkInt,
            checkType1: checkType1,
            checkType2: checkType2,
            checkType3: checkType3,
            // 表单绑定对象
            option: {
                pipelineCode: '',
                shopCodes: [],
                addType: '',
                addString: '',
                addArr: [],
                label: [],
                platforms: [],
                activityName: '',
                activityType: '2',
                activityTypeFlag: '1',
                editDate: [],
                startTime: '',
                endTime: '',
                remark: '',
                warehouseCode: '',
                goodSns: '',
                activityRules: [{
                    preferentialValue: '1',
                    preferentialType: '',
                    meetAmount: '',
                    priority: 1,
                }],
                activityGifts: {
                    '1': {
                        priority: 1,
                        warehouseCode: "",
                        status: 0,
                        goodSn: "",
                        price: 0,
                    }
                },
                activityConditions: {
                    userCondition: '0',
                    excludeUserLabel: [],
                    userLabel: [],
                    isCoupon: '0',
                    isLimit: '',
                    userLevelLimit: [],
                    platform: [],
                    userCount: 1,
                    dayUseCount: 0,
                    userLimitCount: 0,
                    grantWay: 1,
                    integralRule: {
                        num: '',
                        integral: '',
                    },
                    shareRule: {
                        num: '',
                        shareQty: '',
                    },
                    // payedRule: {
                    //     num: '',
                    //     payedAmount: '',
                    // },
                    day: '',
                    hour: '',
                    isRaffle: 0,
                    // isSameParagraph: '0',
                    maxGiftCount: '',
                    fixedPrice: {
                        num: '',
                        meetAmount: '',
                    }
                },
            },
            self: this,
            typeOpt: {},
            statusOpt: {},
            couponOpt: [],
            preferentialOpt: {},
            wareOpt: [],
            labelOpt: [{
                labelTypeName: '',
                id: '',
                memLabels: [{
                    id: '',
                    name: ''
                }]
            }],
            memberOpt: [],
            changeFlag: true,
            defaultSku: '',
            editAble: editAble,
            treeFlag: false,
            brandData: [],
            addId: '',
            treeData: [],
            treeProps: {
                children: 'subCategoryList',
                label: 'categoryName'
            },
            postRule: {
                activityName: [{
                    required: true,
                    message: '该项不能为空',
                    tigger: 'blur'
                }, {
                    validator: (rule, value, callback) => {
                        if (String(value).length > 28) {
                            callback(new Error('标题长度不能大于28个字符'));
                        } else {
                            callback();
                        }
                    },
                }],
                editDate: [{
                    type: 'array',
                    required: true,
                    message: '该项不能为空',
                }, {
                    validator: checkDateArr,
                }],
                activityType: [{
                    required: true,
                    message: '该项不能为空',
                }],
                pipelineCode: [{
                    required: true,
                    message: '该项不能为空',
                }],
                shopCodes: [{
                    type: 'array',
                    required: true,
                    message: '该项不能为空',
                }]
            },
            prize: {
                // useCount: false,
                dayUseCount: false,
                userLimitCount: false,
                integralRule: false,
                shareRule: false,
                // payedRule: false,
            },
            infoData: {},
            prizeOpt: [],

            // 商品弹窗
            goodsDialogType: '',
            goodDialog: false,
            dialogLoading: false,
            addLoading: false,
            tableLoading: false,
            sameLoading: false,
            dialog: {
                keyword: '',
                field: '',
                categoryId: '',
                categoryList: [],
                proCate: [''],
                platform: '',
                goodStatus: '',
                shopPriceStart: '',
                shopPriceEnd: '',
                pageNo: 1,
                pageSize: 10,
            },

            opts: {
                platforms: setOpts(['PC=1', 'M端=2', 'IOS=3', 'ANDROID=4','PAD=5']),
                quickSearchOpts: setOpts(['sku=goodSn', '商品品牌名称=brandName']),
                goodStatusOpts: setOpts(['待发布=1','上架=2','下架=3','到货通知=4','谍照=5']),
            },
            catTree: [],
            prop: {
                label: 'categoryName',
                value: 'id',
                children: 'subCategoryList',
            },
            // classOpt: {},
            tableData: [],
            total: 10,
            styleCount: 0,
            selectSku: [],
            // 买即赠选项
            selectData: [],
        };
    },
    created () {
        this.getOpt();
    },
    computed: {
        domain () {
            return this.$store.getters.getDomain + '/';
        },
        pipeOpt () {
            return this.$store.getters.getPipe.obj;
        },
        storeOpt () {
            return this.$store.getters.getStore.obj;
        },
        terminalOpt() {
            return this.$store.getters.getTerminal.opt;
        },
        terminalMap() {
            return this.$store.getters.getTerminal.map;
        }
    },
    watch: {
        terminal(val,oldVal) {
            let tempArr = [],
                temp = [];
            val.forEach(item => {
                temp = this.terminalMap.filter(e => e.terminal_id == item).map(el => el.platform_id);
                tempArr = tempArr.concat(temp);
            });
            this.option.activityConditions.platform = tempArr.sort();
        }
    },
    methods: {
        // 编辑权限控制
        editControl () {
            if (this.activityId) {
                if (this.option.activityType === 3) {
                    return this.showAction_('promotion/activity/edit-raffle');
                } else {
                    return this.showAction_('promotion/activity/edit');
                }
            } else {
                if (this.option.activityType === 3) {
                    return this.showAction_('promotion/activity/add-raffle');
                } else {
                     return this.showAction_('promotion/activity/add');
                }
            }
        },
        // 获取页面选择项配置
        getOpt () {
            this.fullLoading = true;
            this.$http.get('promotion/index/public-get-dicts', {params: {names: 'activityType,activityStatus,preferentialType'}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    for (let i in data) {
                        let item = data[i];
                        if (item.name === 'activityType') {
                            this.$set(this.typeOpt, item.value, item);
                        }
                        if (item.name === 'activityStatus') {
                            this.$set(this.statusOpt, item.value, item);
                        }

                        if (item.name === 'preferentialType') {
                            item.value = item.value * 1;
                            this.$set(this.preferentialOpt, item.value, item);
                        }
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/index/public-activity-select').then(res => {
                if (!this.id) {
                    this.fullLoading = false;
                }
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.brandData = data.brand;
                    this.treeData = data.category;
                    this.memberOpt = data.userLevel;
                    this.wareOpt = data.virtualWares;
                    this.labelOpt = data.labels;

                    if (this.activityId) {
                        this.getData();
                    }
                } else {
                    this.$message.error(res.body.message);
                }

            });

            this.$http.get('promotion/activity/by-attributes', {params: {activityType: 3}}).then(res => {
                if (res.body.code === 0) {
                    this.prizeOpt = res.body.data.activityDtos;
                }
            });

            this.$http.get('promotion/public/coupon-template-ids-at-system').then(res => {
                if (res.body.code === 0) {
                    this.couponOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        // 获取活动详情
        getData () {
            let self = this;
            let type = this.type;
            let src = 'promotion/activity/info';
            if (type == 3) {
                src = 'promotion/activity/raffle-info';
            }

            this.$http.get(src, {params: {id: this.id}}).then(res => {
                if (res.body.code === 0) {
                    // 
                    this.changeFlag = false;
                    // 
                    let data = res.body.data;
                    let condition = {};
                    this.infoData = data;
                    data.activityType = type + '';

                    if (type == 2) {
                        data.activityGifts = {};
                        for (let i in data.activityRules) {
                            let item = data.activityRules[i];
                            if (item.goodSns) {
                                item.preferentialValue = item.singleCount;
                                data.activityGifts[item.priority] = {
                                    priority: item.priority,
                                    status: 0,
                                    goodSn: item.goodSns
                                }
                            }
                        }
                    }

                    if (type != 3) {
                        for (let j in data.activityConditions) {
                            let item = data.activityConditions[j];
                            let id = item.paramId;
                            if (id == 'userLevelLimit') {
                                condition[id] = item.paramValue.split(',').map(el => {
                                    return String(el);
                                });
                            } else if (id == 'fixedPrice') {
                                condition[id] = JSON.parse(item.paramValue);
                            } else if (id == 'platform' || id == 'userLabel' || id == 'excludeUserLabel') {
                                condition[id] = item.paramValue ? item.paramValue.split(',') : [];
                            } else {
                                condition[id] = item.paramValue;
                            }
                        }
                    } else {
                        // 活动条件写入
                        condition.userCondition = String(data.userCondition);
                        condition.userLabel = data.userLabels ? data.userLabels.split(',') : [];
                        condition.excludeUserLabel = data.excludeUserLabel ? data.excludeUserLabel.split(',') : [];
                        condition.userLevelLimit = data.userLevels ? data.userLevels.split(',') : [];
                        // condition.useCount = data.useCount;
                        condition.dayUseCount = data.dayUseCount;
                        condition.userLimitCount = data.userLimitCount;
                        condition.grantWay = data.grantWay;
                        condition.isRaffle = data.isRaffle;
                        condition.integralRule = data.integralRule;
                        condition.shareRule = data.shareRule;
                        // condition.payedRule = data.payedRule;
                        condition.day = data.prizeTime ? parseInt(data.prizeTime / 24) : '';
                        condition.hour = data.prizeTime ? data.prizeTime % 24 : '';
                        condition.hour = condition.hour == 0 ? '' : condition.hour;

                        this.prize.integralRule = Boolean(data.integralRule.num && data.integralRule.integral);
                        this.prize.shareRule = Boolean(data.shareRule.num && data.shareRule.shareQty);
                        // this.prize.payedRule = Boolean(data.payedRule.num && data.payedRule.payedAmount);
                        // this.prize.useCount = Boolean(data.useCount) || data.useCount === 0;
                        this.prize.dayUseCount = Boolean(data.dayUseCount) || data.dayUseCount === 0;
                        this.prize.userLimitCount = Boolean(data.userLimitCount) || data.userLimitCount === 0;
                    }
                    if (type == 3) {
                        condition.platform = data.platform ? data.platform.split(',') : [];
                    }

                    let defaultCondition = {
                        userCondition: '0',
                        userLabel: [],
                        excludeUserLabel: [],
                        userCount: 1,
                        isCoupon: '0',
                        isLimit: '',
                        userLevelLimit: [],
                        platform: [],

                        dayUseCount: 0,
                        userLimitCount: 0,
                        grantWay: 1,
                        integralRule: {
                            num: '',
                            integral: '',
                        },
                        shareRule: {
                            num: '',
                            shareQty: '',
                        },
                        // payedRule: {
                        //     num: '',
                        //     payedAmount: '',
                        // },
                        fixedPrice: {
                            num: '',
                            meetAmount: '',
                        },
                        day: '',
                        hour: '',
                        isRaffle: 0,
                        // isSameParagraph: '0',
                    };

                    data.activityConditions = Object.assign(defaultCondition, condition);
                    data.editDate = [new Date(data.startTime * 1000), new Date(data.endTime * 1000)];

                    if (data.activityType != '3') {
                        data.shopCodes = data.shopCodes.split(',');
                    }

                    // 加价购可编辑
                    if (data.activityRules) {
                        data.activityRules.forEach(item => {
                            // 删除多余数据
                            delete item.activityId;
                            delete item.id;
                            delete item.goodSn;
                            // delete item.goodSns;
                            delete item.currency;
                            // 空值接口报错
                            item.count = item.count ? item.count : '0';
                            // 
                            item.old = true;
                        });
                    }
                    //
                     
                    // 获取表单数据
                    let temp = {};
                    let formData = this.option;
                    for (let k in formData) {
                        let item = data[k];
                        if (item) {
                            if (k == 'editDate') {
                                // date json之后格式有问题。单独列出
                                formData[k] = item;
                            } else if (item instanceof Object) {
                                formData[k] = JSON.parse(JSON.stringify(Object.assign(formData[k], item)));
                            } else {
                                formData[k] = item;
                            }
                        }
                    }
                    if (formData.activityType == 5 || formData.activityType == 6) {
                        let goodParams = {};
                        let skuList = [];
                        formData.activityRules.forEach(item => {
                            skuList.push(item.preferentialValue);
                        });

                        goodParams.virWhCode = formData.warehouseCode;
                        // goodParams.pipelineCode = formData.pipelineCode;
                        goodParams.goodSn = skuList.join(',');

                        this.$http.get('goods/goods/query-goods-list', {params: goodParams}).then(res => {
                            if (res.body.code === 0) {
                                this.selectData = res.body.data.goodsInfoList;
                            } else {
                                this.$message.error(res.body.message);
                            }
                        });
                    }

                    if (data.brands) {
                        formData.addType = 2;
                        formData.addArr = data.brands.split(',');
                    } else if (data.categorys) {
                        formData.addType = 1;
                        let dataCatList = data.categorys.split(',');
                        this.$refs.tree.setCheckedKeys(dataCatList);
                        let nodes = this.$refs.tree.getCheckedNodes();
                        let temp = [];
                        nodes.forEach(item => {
                            if (dataCatList.indexOf(String(item.id)) != -1) {
                                temp.push(item.categoryName);
                            }
                        })
                        formData.addString = temp.join(',');
                    }

                    // 平台映射转换
                    let tempPlat = [],
                        tempPlatArr = [];
                    this.option.activityConditions.platform.forEach(plat => {
                        tempPlat = self.terminalMap.filter(e => e.platform_id == plat).map(el => el.terminal_id);
                        tempPlatArr = tempPlatArr.concat(tempPlat);
                    });
                    tempPlatArr.forEach(plat => {
                        if (self.terminal.indexOf(plat) == -1) {
                            self.terminal.push(plat);
                        }
                    });
                    //

                    this.defaultSku = data.goodSns;
                    this.fullLoading = false;
                    
                    this.$nextTick(() => {
                        this.changeFlag = true;
                    })
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        // 新增加价购条数
        addFareincrease () {
            let length = this.option.activityRules.length;
            this.option.activityRules.push({
                status: 0,
                preferentialValue: '',
                meetAmount: '',
                count: '0',
                singleCount: '1',
                priority: length + 1,
                preferentialType: '4',
            });
        },
        // 新增满减满赠条数
        addItem () {
            let length = this.option.activityRules.length;
            this.option.activityRules.push({
                preferentialValue: '1',
                preferentialType: '',
                meetAmount: '',
                priority: length + 1
            });
            this.$set(this.option.activityGifts, length + 1, {
                priority: length + 1,
                warehouseCode: "",
                status: 0,
                goodSn: "",
                price: 0,
            });
        },
        // 删除满减满赠条数
        removeItem (index) {
            if (this.option.activityRules.length > 1) {
                this.option.activityRules.splice(index, 1)
            } else {
                this.$message.warning('最后一项无法删除！');
            }
        },
        // 提交修改
        postEdit () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    // 校验买即赠数量关系比例
                    const postType = this.option.activityType;
                    if (postType == 5) {
                        let checkRuleCount = this.option.activityRules;
                        let checkCount = true;
                        checkRuleCount.forEach(rule => {
                            if (rule.count % rule.singleCount != 0) {
                                checkCount = false;
                            }
                        });
                        if (!checkCount) {
                            this.$message.error('买即赠活动 单次赠送数量与总数量不是倍数关系');
                            return;
                        }
                    }
                    this.postLoading = true;
                    let src = '';
                    // check params
                    let timeArr = this.timeZone_(this.option.editDate, this.$store.getters.getTimeZone);
                    this.option.startTime = timeArr[0];
                    this.option.endTime = timeArr[1];

                    let params = {};
                    for (let i in this.option) {
                        if (i !== 'editDate' && i !== 'addString' && i !== 'addArr' && this.option[i] !== '') {
                            params[i] = this.option[i];
                        }
                    }

                    let temp = [];
                    for (let j in this.option.activityGifts) {
                        let item = this.option.activityGifts[j];
                        item.warehouseCode = this.option.warehouseCode;
                        if (item.goodSn !== '') {
                            temp.push(item);
                        }
                    }

                    if (params.activityType == '1') {
                        params.activityRules.forEach(item => {
                            item.preferentialType = '0';
                        })
                    }

                    if (params.addType == '2') {
                        params.brands = this.option.addArr.join(',');
                    } else if (params.addType == '1') {
                        params.categorys = this.addId;
                    }

                    params.activityGifts = temp;

                    if (this.id && (!this.copy || (this.copy && this.unStart) ) ) {
                        // edit
                        src = 'promotion/activity/edit';
                        // unStart 未开始的活动不清空数据
                        if (postType != 3 && postType != 4 && !this.unStart) {
                            // 加价购和抽奖可编辑
                            params = {};
                        }

                        if (postType == 3) {
                        // prize edit
                            src = 'promotion/activity/edit-raffle';
                        } else if (postType == 4) {
                            params.shopCodes = this.option.shopCodes.join(',');
                        }
                        // 0.95修改 清空后编辑赋值
                        params.warehouseCode = this.infoData.warehouseCode;
                        params.goodSns = this.infoData.goodSns;
                        //
                        params.id = this.id;
                        params.activityId = this.activityId;
                        params.activityName = this.option.activityName;
                        params.pipelineCode = this.option.pipelineCode;
                        params.activityType = this.option.activityType;
                        params.startTime = this.option.startTime;
                        params.endTime = this.option.endTime;
                        params.remark = this.option.remark;
                        params.activityRules = this.option.activityRules;
                    } else {
                        // add
                        src = 'promotion/activity/add';
                        if (postType == 3) {
                        // prize add
                            src = 'promotion/activity/add-raffle';
                            var prize = {
                                remark: '',
                                endTime: '',
                                startTime: '',
                                activityName: '',
                                pipelineCode: '',
                                activityConditions: {}
                            };

                            for (let i in prize) {
                                if (params[i]) {
                                   prize[i] = params[i];
                                }
                            }
                            //
                            params = JSON.parse(JSON.stringify(prize));
                            params.activityConditions.prizeTime = params.activityConditions.day * 24 + params.activityConditions.hour * 1;
                            if (params.activityConditions.prizeTime == 0) {
                                params.activityConditions.prizeTime = '';
                            }
                            this.$delete(params.activityConditions, 'day');
                            this.$delete(params.activityConditions, 'hour');

                            for (let j in this.prize) {
                                if (!this.prize[j]) {
                                    if (j == 'integralRule') {
                                        params.activityConditions[j] = {
                                            num: '',
                                            integral: ''
                                        }
                                    } else if (j == 'shareRule') {
                                        params.activityConditions[j] = {
                                            num: '',
                                            shareQty: '',
                                        }
                                    } else {
                                        params.activityConditions[j] = '';
                                    }
                                }
                            }
                            let check = params.activityConditions;
                            if (check.dayUseCount) {
                                if (check.userLimitCount && check.dayUseCount * 1 > check.userLimitCount * 1) {
                                    this.$message.warning('单用户参与次数不能小于单日参与次数');
                                    this.postLoading = false;
                                    return false;
                                }
                            }

                        } else {
                            // 0.9店铺
                            params.shopCodes = this.option.shopCodes.join(',');
                        }
                    }

                    // check params
                    params = JSON.parse(JSON.stringify(params));
                    if (params.activityType == '2') {
                        let ruleList = params.activityRules || [];
                        ruleList.forEach(rule => {
                            if (rule.preferentialType == 4) {
                                rule.singleCount = rule.preferentialValue;
                                this.$delete(rule, 'preferentialValue');
                            }
                        });
                    }

                    let condition = params.activityConditions;
                    if (condition) {
                        // 满赠，加价购，买即赠 同款生效参数
                        // if (postType != 2 && postType != 4 && postType != 5) {
                        //     this.$delete(condition, 'isSameParagraph');
                        // } else {
                        //     params.isSameParagraph = condition.isSameParagraph;
                        // }

                        // 买即赠和加价购增加activityGifts参数,修改activityRules排序
                        if ((postType == 5 || postType == 4)) {
                            let tempArr = [];
                            params.activityRules.forEach((item, index) => {
                                item.priority = item.priority || index;
                                tempArr.push({
                                    priority: item.priority,
                                    price: item.price ? item.price : 0,
                                    warehouseCode: params.warehouseCode,
                                    status: 0,
                                    goodSn: item.preferentialValue
                                })
                            });
                            params.activityGifts = tempArr;
                        }

                        if (postType != '3') {
                            this.$delete(condition, 'integralRule');
                            this.$delete(condition, 'shareRule');
                            // this.$delete(condition, 'payedRule'),
                            this.$delete(condition, 'dayUseCount');
                            this.$delete(condition, 'grantWay');
                            this.$delete(condition, 'isRaffle');
                            this.$delete(condition, 'day');
                            this.$delete(condition, 'hour');
                            // this.$delete(condition, 'useCount');
                            this.$delete(condition, 'userLimitCount');
                        }

                        if (postType != '2' && postType != '4') {
                            this.$delete(condition, 'maxGiftCount');
                        }

                        if (postType != '6') {
                            this.$delete(condition, 'fixedPrice');
                        }
                    }

                    // M元N件 新增和复制时处理
                    if (postType == 6 && (!this.id || this.copy) ) {
                        if (this.selectData.length == 0) {
                            this.$message.warning('请选择活动商品');
                            return false;
                        }
                        let goodSns = [];
                        this.selectData.forEach((item, index) => {
                            goodSns.push(item.goodSn);
                        });

                        params.goodSns = goodSns.join(',');
                        // M元N件排序
                        params.activityRules.forEach((item, index) => {
                            item.priority = index;
                        })
                    }
                    // 0.82新增检验 【排除条件】与【参与条件】中标签出现重复时，只添加排除条件
                    if (params.activityConditions) {
                        let exclueList = params.activityConditions.excludeUserLabel,
                            userList = params.activityConditions.userLabel;
                        if (exclueList && exclueList.length > 0 && userList && userList.length > 0) {
                            exclueList.forEach(item => {
                                let index = userList.indexOf(item);
                                if (index != -1) {
                                    userList.splice(index, 1);
                                }
                            })
                        }
                    }
                    // 
                    // 0.95临时处理
                    // if (!this.id && (postType === '2' || postType === '4')) {
                    //     params.activityRules.forEach(item => {
                    //         item.singleCount = 1;
                    //     });
                    // }

                    if (params.activityRules) {
                        params.activityRules.forEach(item => {
                            item.singleCount = item.singleCount ? item.singleCount : '0';
                            delete item.old;
                            delete item.price;
                            delete item.goodSn;
                            delete item.goodSns;
                        });
                    }
                    
                    //
                    // post
                    this.$http.post(src, params).then(res => {
                        this.postLoading = false;
                        if (res.body.code == -2) {
                            // 部分商品不在指定店铺
                            this.$confirm(res.body.message, '提示').then(() => {
                                params.confirm = 1;
                                this.$http.post(src, params).then(subRes => {
                                    if (subRes.body.code === 0) {
                                        this.$message.success(subRes.body.message);
                                        this.$router.push({
                                            name: 'marketing_campaigns_campaignsList'
                                        });
                                    } else {
                                        this.$message.error(subRes.body.message);
                                    }
                                });
                            }).catch(err => {
                                this.$message.info('已取消')
                            });

                        } else if (res.body.code == 58113 || res.body.code == 58114) {
                            // 捆绑商品校验
                            let err = res.body.data.rawMessage.split(',');
                            if (res.body.code == 58113) {
                                // 参与活动
                                this.$confirm(res.body.data.rawMessage + '为福袋商品,是否删除后保存', '提示').then(() => {
                                    let temp  = params.goodSns.split(',');

                                    err.forEach(goods => {
                                        if (temp.indexOf(goods) != -1) {
                                            temp.splice(temp.indexOf(goods), 1);
                                        }
                                    });
                                    params.goodSns = temp.join(',');

                                    this.post(src, params).then(subRes => {
                                        // 统一结果
                                        if (res.body.code === 0) {
                                            this.$message.success(res.body.message);
                                            this.$router.push({
                                                name: 'marketing_campaigns_campaignsList'
                                            });
                                        } else {
                                            this.$message.error(res.body.message);
                                        }
                                    });
                                });

                            }

                            if (res.body.code == 58114) {
                                this.$confirm('赠品' + res.body.data.rawMessage + '为福袋商品,是否删除后保存', '提示').then(() => {
                                    // 赠品修改
                                    if (params.activityType == '6') {
                                        for (let i=0; i< params.activityRules.length; i++) {
                                            if (err.indexOf(params.activityRules[i].preferentialValue) != -1) {
                                                params.activityRules.splice(i, 1);
                                                i--;
                                            }
                                        }
                                    } else {
                                        for (let i=0; i<params.activityGifts.length; i++) {
                                            let item = params.activityGifts[i];
                                            let temp = item.goodSn.split(',');
                                            err.forEach(goods => {
                                                if (temp.indexOf(goods) != -1) {
                                                    temp.splice(temp.indexOf(goods), 1);
                                                }
                                            });
                                            if (temp.length == 0) {
                                                params.activityRules.splice(i, 1);
                                                params.activityGifts.splice(i, 1);
                                                i--;
                                            } else {
                                                item.activityGifts = temp.join(',');
                                            }
                                        }
                                    }

                                    this.post(src, params).then(subRes => {
                                        // 统一结果
                                        if (res.body.code === 0) {
                                            this.$message.success(res.body.message);
                                            this.$router.push({
                                                name: 'marketing_campaigns_campaignsList'
                                            });
                                        } else {
                                            this.$message.error(res.body.message);
                                        }
                                    });
                                });
                            }
                            //
                        } else {
                            // 统一结果
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                                this.$router.push({
                                    name: 'marketing_campaigns_campaignsList'
                                });
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }
                    })
                }
            });
        },
        // 变更活动类型
        changeType (val) {
            // change init when type changed
            this.editControl();
            this.option.activityTypeFlag = val;
            // 重置数据
            if (this.changeFlag) {
                if (val != 1) {
                    this.option.activityConditions.isLimit = '';
                } else {
                    this.option.activityConditions.isLimit = '1';
                }

                this.option.shopCodes = [];
                if (val == 4) {
                    this.option.activityRules = [{
                        count: '0',
                        singleCount: '1',
                        preferentialValue: '',
                        preferentialType: '4',
                        meetAmount: '',
                        priority: 1,
                        status: 0,
                        price: '',
                    }];
                } else {
                    this.option.activityRules = [{
                        singleCount: '0',
                        preferentialValue: '1',
                        preferentialType: '',
                        meetAmount: '',
                        priority: 1,
                    }];
                }

                this.option.activityGifts = {
                    '1': {
                        priority: 1,
                        warehouseCode: "",
                        status: 0,
                        goodSn: "",
                        price: 0,
                    }
                };

                if (val != 3) {
                    this.option.activityConditions.userLimitCount = 0;
                    this.option.activityConditions.dayUseCount = 0;
                    // this.option.activityConditions.useCount = 0;
                    this.option.activityConditions.grantWay = 1;
                    this.option.activityConditions.isRaffle = 0;
                    this.option.activityConditions.integralRule = {
                        num: '',
                        integral: '',
                    };
                    this.option.activityConditions.shareRule = {
                        num: '',
                        shareQty: '',
                    };
                } else {
                    this.option.activityConditions.isCoupon = '0';
                    this.option.activityConditions.userCount = '';
                }
            }
            let itemEl = this.$refs.postForm.$children;
            itemEl.forEach(item => {
                item.validateState = true;
            });
        },
        // 变更参与条件
        changeCondition (val) {
            if (val != 3) {
                this.option.activityConditions.userLevelLimit = [];
            }
            if (val != 4) {
                this.option.activityConditions.userLabel = [];
            }
        },
        // 变更满赠赠品 暂时无效
        // changeGiftType (item, event) {
        //     if (this.changeFlag) {
        //         item.preferentialValue = '';
        //         if (event != '4') {
        //             this.option.activityGifts[item.priority]. goodSn = '';
        //         }
        //     }

        // },
        // 变更满减 封顶
        changeLimit (val) {
            if (val == 2) {
                this.option.activityRules = [{
                    singleCount: '0',
                    preferentialValue: '',
                    preferentialType: '',
                    meetAmount: '',
                    priority: 1,
                }];
            }
        },
        // tree components
        changeTreeFlag (flag) {
            if (!flag) {
                this.treeFlag = !this.treeFlag;
            }
        },
        changeTree () {
            let data = this.$refs.tree.getCheckedNodes();
            let temp = [];
            let tempName = [];
            data.map(item => {
                if (item.subCategoryList && item.subCategoryList.length > 0) {
                } else {
                    temp.push(item.id);
                    tempName.push(item.categoryName);
                }
            });
            this.addId = temp.join(',');
            this.option.addString = tempName.join(',');
        },
        closeTree (event) {
            let target = event.target.parentElement._prevClass;
            if (target && target.indexOf('js_input') !== -1) {

            } else {
                this.treeFlag = false;
            }
        },
        //跳转
        goback () {
            this.$router.push({
                name: 'marketing_campaigns_campaignsList'
            })
        },
        // 添加商品
        addGoods () {
            let oldGoods = [];
            if (this.option.goodSns) {
                oldGoods = this.option.goodSns.split(',');
            } else {
                oldGoods = [];
            }
            this.selectSku.forEach(item => {
                if (oldGoods.indexOf(item.goodSn) == -1) {
                    oldGoods.push(item.goodSn);
                }
            });
            this.option.goodSns = oldGoods.join(',');
            this.$message.success('已添加')
        },
        // 添加至买即赠活动商品
        addActiveGoods () {
            let data = this.selectSku;
            let temp = [];
            this.selectData.forEach(item => {
                temp.push(item.goodSn);
            })
            // M元N件
            if (this.option.activityType == 6) {
                this.option.activityRules = [];
                data.forEach((item, index) => {
                    if (temp.indexOf(item.goodSn) == -1) {
                        item.index = index;
                        this.selectData.push(item);
                    }
                });

                this.selectData.forEach((item, index) => {
                    this.option.activityRules.push({
                        singleCount: '0',
                        preferentialValue: item.goodSn,
                        preferentialType: 4,
                        meetAmount: 0,
                        priority: '',
                        count: '0',
                    });
                })
            } else if (this.option.activityType == 5) {
                let length = this.selectData.length;
                data.forEach((item, index) => {
                    if (temp.indexOf(item.goodSn) == -1) {
                        length++;
                    }
                });

                if (length > 10) {
                    this.$message.error('赠品不能超过10个');
                    return;
                } else {
                    data.forEach((item, index) => {
                        if (temp.indexOf(item.goodSn) == -1) {
                            item.index = index;
                            this.selectData.push(item);
                        }
                    });

                    this.option.activityRules = [];
                    this.selectData.forEach((item, index) => {
                        this.option.activityRules.push({
                            preferentialValue: item.goodSn,
                            preferentialType: 4,
                            meetAmount: 0,
                            priority: '',
                            count: '0',
                            singleCount: '0',
                        });
                    })

                }
            }
            // this.selectData = data;
            this.$message.success('已添加')
        },
        // 删除买即赠选项
        removeGift (index) {
            this.selectData.splice(index, 1);
            this.option.activityRules.splice(index, 1);
        },
        // 获取分类
        getCat (type) {
            this.goodsDialogType = type;
            if (!this.option.warehouseCode) {
                this.$message.warning('请先选择仓库')
                return ;
            }
            this.tableData = [];
            this.dialogLoading = true;
            //
            this.$http.get('goods/category/category-drop-down').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.catTree = data;
                    this.goodDialog = true;
                    this.dialogLoading = false;
                }
            });
        },
        changeCatTree(val) {
            this.dialog.categoryId = val[val.length - 1];
        },
        // render data
        tableRes (opt, params) {
            let obj = this.opts[opt];
            if (obj[params]) {
                return obj[params].label;
            } else {
                return ''
            }
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
        // 获取商品列表
        getGoodList (page) {
            if ((this.dialog.keyword && !this.dialog.field) || (!this.dialog.keyword && this.dialog.field)) {
                this.$alert('关键字必须匹配搜索类型', '提示');
                return ;
            }

            if (this.dialog.shopPriceStart && this.dialog.shopPriceEnd) {
                if (Number(this.dialog.shopPriceStart) > Number(this.dialog.shopPriceEnd)) {
                    this.$alert('本店售价起始值不能大于结束值', '提示');
                    return ;
                }
            }

            this.$refs.searchForm.validate(valid => {
                if (valid) {
                    let params = {};
                    for (let i in this.dialog) {
                        if (i !== 'proCate' && i !== 'keyword' && i !== 'field' && i !== 'categoryList') {
                            if (this.dialog[i] !== '') {
                               params[i] = this.dialog[i];
                            }
                        }
                    }

                    if (this.dialog.keyword && this.dialog.field) {
                        params[this.dialog.field] = this.dialog.keyword;
                    }

                    if (!page) {
                        params.pageNo = this.dialog.pageNo = 1;
                        params.pageSize = this.dialog.pageSize = 10;
                    }

                    for (let i in params) {
                        if (params[i] === '') {
                            delete params[i]
                        }
                    }
                    params.virWhCode = this.option.warehouseCode;
                    // params.pipelineCode = this.option.pipelineCode;

                    this.tableLoading = true;
                    this.$http.get('goods/goods/query-goods-list', {params: params}).then(res => {
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
        openCall () {
            this.$nextTick(() => {
                this.selectSku = [];
                this.resetForm();
            })
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.dialog.field = '';
            this.dialog.proCate = [''];
            this.dialog.categoryId = '';
        },
        ChangePage (val) {
            this.dialog.pageNo = val;
            this.getGoodList(true);
        },
        ChangePageSize (val) {
            this.dialog.pageSize = val;
            this.getGoodList(true);
        },
        changeSku (val) {
            this.selectSku = val;
        },
        // 获取同款SKU
        async getSame() {
            let params = {
                // pipelineCode: this.option.pipelineCode,
                virWhCode: this.option.warehouseCode,
                goodSn: this.option.goodSns,
                sameType: 1,
            };

            let flag = true;
            for (let i in params) {
                if (!params[i]) {
                    flag = false;
                    break;
                }
            }
            if (!flag) {
                this.$message.error('请先输入仓库以及SKU');
                return;
            }

            this.sameLoading = true;
            try {
                const data = await this.httpGet_('goods/goods/query-goods-list', {params: params});
                let temp = [];
                data.goodsInfoList.forEach(item => {
                    temp.push(item.goodSn);
                });
                this.option.goodSns = temp.join(',');
            } finally {
                this.sameLoading = false;
            }
        },
    }
}
</script>

<style lang="less">

    .campaigns-edit {

        .cat-tree {
            width: 400px;
        }

        .marketing-goods-dialog {

            .el-dialog {
                .el-dialog__header {
                    display: none;
                }
                .el-dialog__body {
                    padding-bottom: 0;
                    padding-top: 10px;

                    .el-table {
                        margin-top: 10px;
                    }
                }
            }
        }

        .add-shop {
            .el-form-item__content {
                &:before {
                    clear: both;
                }
                &:after {
                    clear: both;
                }
            }

            label {
                text-align: right;
                vertical-align: middle;
                float: left;
                font-size: 14px;
                color: #48576a;
                line-height: 1;
                padding: 11px 12px 11px 0;
                box-sizing: border-box;
            }
        }

        .el-button+.el-button {
            margin-left: 0;
        }

        .form-table {
            .el-form-item__error {
                position: static;
            }

            .title-pre {
                white-space: pre-wrap;
                word-wrap: break-word;
            }
        }

        .item-arr {
            margin-bottom: 10px;

            .el-col-4 {
                padding-right: 5px;
            }

            textarea {
                margin-top: 10px;
            }
        }

        .condition {
            display: block;

            .item {
                clear: both;
                padding-top: 10px;

                .level {
                    line-height: 36px;
                }

                &.exclude {
                    clear: none;
                    padding-top: 0;
                }
            }
        }

        .leto {
            margin-bottom: 22px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .redemption {
            text-align: center
        }

        .share-rule {
            margin-top: 10px;
        }

        .temp-tip {
            color: #ff4949;
        }
    }
</style>
