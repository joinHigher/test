<!-- 新增coupon模板 -->
<template>
    <div @click= "closeTree($event)" class="coupon-tpl-add">
        <el-form inline label-width="140px" :model="option" ref="postForm" :rules="postRules">
            <div class="el-container">
                    <el-form-item label="Coupon模板名称" prop="name">
                        <el-input v-model.trim="option.name"></el-input>
                    </el-form-item>
                    <el-form-item label="系统模板">
                        <el-select filterable v-model="isSystem" @change="changeSys">
                            <el-option :value="1" label="是"></el-option>
                            <el-option :value="0" label="否"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Coupon类型" prop="classId">
                        <el-select filterable v-model="option.classId" v-if="isSystem === 0" @change="changeClassId">
                            <el-option v-for="(item, index) in customOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                        <el-select filterable v-model="option.classId" v-if="isSystem === 1" @change="changeClassId">
                            <el-option v-for="(item, index) in systemOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <div>
                        <el-form-item label="生效站点" class="coupon-multiple-site" prop="templateSites">
                            <el-select filterable v-model="option.templateSites" multiple>
                                <el-option v-for="item in siteOpt" :key="item.code" :value="item.code" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="模板说明">
                            <el-input class="quick-search" :rows="4" v-model.trim="option.remark" type="textarea" placeholder="请输入模板说明"></el-input>
                        </el-form-item>
                    </div>
            </div>
            <div class="el-container">
                <table class="price-temp-table table-custom">
                    <thead>
                        <tr>
                            <th>选用</th>
                            <th>Coupon属性</th>
                            <th>默认值</th>
                            <th>必填</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="4" class="table-head">基础设置</td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.couponName.checked"></el-checkbox>
                            </td>
                            <td>
                                Coupon名称
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input :disabled="true" v-model.trim="option.templateParams.couponName.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.couponName.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.code.checked"></el-checkbox>
                            </td>
                            <td>
                                Coupon码
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input :disabled="true" v-model.trim="option.templateParams.code.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.code.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr v-if="option.classId == '8' || option.classId == '11' || option.classId == '12' || option.classId == '15'">
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.fullCondition.checked"></el-checkbox>
                            </td>
                            <td>
                                满额条件
                            </td>
                            <td>
                                <el-form-item class="check-item" prop="templateParams.fullCondition.defaultValue" :rules="[{required: true, message: '该项不能为空'}]">
                                    <el-radio-group v-model="option.templateParams.fullCondition.defaultValue">
                                        <el-radio label="1">金额</el-radio>
                                        <el-radio label="2">数量</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.fullCondition.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr v-if="option.classId != '14' && option.classId != '10' && option.classId">
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.discountForm.checked"></el-checkbox>
                            </td>
                            <td>
                                优惠形式
                            </td>
                            <td>
                                <el-form-item class="check-item" prop="templateParams.discountForm.defaultValue" :rules="[{required: true, message: '该项不能为空'}]">
                                    <el-radio-group v-model="option.templateParams.discountForm.defaultValue">
                                        <el-radio :label="1">
                                            <span v-if="option.classId == '8' || option.classId == 12">金额封顶</span>
                                            <span v-else>减免金额</span>
                                        </el-radio>
                                        <el-radio :label="2" v-if="option.classId == '8' || option.classId == 12">金额不封顶</el-radio>
                                        <el-radio :label="3">百分比减免</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.discountForm.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <template>
                            <tr v-if="discountForm === 1">
                                <td>
                                    <el-checkbox :disabled="true" v-model="option.templateParams.discountPercent.checked"></el-checkbox>
                                </td>
                                <td>
                                    减免百分比
                                </td>
                                <td>
                                    <el-form-item prop="templateParams.discountPercent.defaultValue" :rules="[{validator: checkPositive}]">
                                        <el-row>
                                            <el-col :span="23"><el-input v-model.trim="option.templateParams.discountPercent.defaultValue"></el-input></el-col>
                                            <el-col :span="1">%</el-col>
                                        </el-row>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-checkbox :disabled="true" v-model="option.templateParams.discountPercent.isRequired" true-label="1" false-label="0"></el-checkbox>
                                </td>
                            </tr>
                            <tr v-if="discountForm === 2">
                                <td>
                                    <el-checkbox :disabled="true" v-model="option.templateParams.discountAmount.checked"></el-checkbox>
                                </td>
                                <td>
                                    <span v-if="option.classId == 10 || option.classId == 14">一口价</span>
                                    <span v-else>减免金额</span>
                                </td>
                                <td>
                                    <el-form-item prop="templateParams.discountAmount.defaultValue" :rules="[{validator: checkPositive}]">
                                        <el-input v-model.trim="option.templateParams.discountAmount.defaultValue"></el-input>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-checkbox :disabled="true" v-model="option.templateParams.discountAmount.isRequired" true-label="1" false-label="0"></el-checkbox>
                                </td>
                            </tr>
                            <tr v-if="discountForm === 3">
                                <td>
                                    <el-checkbox :disabled="true" v-model="option.templateParams.discountStrategy.checked"></el-checkbox>
                                </td>
                                <td>
                                    满额优惠
                                </td>
                                <td>
                                    <el-form-item prop="templateParams.discountStrategy" :rules="[{validator: checkDiscount}]">
                                        <el-row>
                                            <el-col :span="2">
                                                <span v-if="option.templateParams.discountForm.defaultValue == 2">每满</span>
                                                <span v-else>满</span>
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model.trim="option.templateParams.discountStrategy.defaultValue1" placeholder="金额/数量"></el-input>
                                            </el-col>
                                            <el-col :span="1">
                                                减
                                            </el-col>
                                            <el-col :span="10">
                                                <el-input v-model.trim="option.templateParams.discountStrategy.defaultValue2"></el-input>
                                            </el-col>
                                            <el-col :span="1" v-if="option.templateParams.discountForm.defaultValue == 3">
                                                %
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-checkbox :disabled="true" v-model="option.templateParams.discountStrategy.isRequired" true-label="1" false-label="0"></el-checkbox>
                                </td>
                            </tr>
                        </template>
                        <tr>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.times.checked"></el-checkbox>
                            </td>
                            <td>
                                生效时间
                            </td>
                            <td>
                                <el-form-item>
                                    <el-date-picker v-model="option.templateParams.times.defaultValue" type="datetimerange" @change="checkDate_($event, option.templateParams.times.defaultValue)"></el-date-picker :editable="false">
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.times.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="table-head">生效配置</td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.platforms.checked"></el-checkbox>
                            </td>
                            <td>
                                适用终端
                            </td>
                            <td>
                                <el-form-item>
                                    <el-checkbox-group v-model="terminal">
                                        <el-checkbox v-for="item in terminalOpt" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
                                    </el-checkbox-group>
<!--                                     <el-checkbox-group v-model="option.templateParams.platforms.defaultValue">
                                        <el-checkbox label="1">PC</el-checkbox>
                                        <el-checkbox label="2">M端</el-checkbox>
                                        <el-checkbox label="3">IOS</el-checkbox>
                                        <el-checkbox label="4">ANDROID</el-checkbox>
                                        <el-checkbox label="5">PAD</el-checkbox>
                                    </el-checkbox-group> -->
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.platforms.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox disabled v-model="option.templateParams.pipelineCode.checked"></el-checkbox>
                            </td>
                            <td>
                                适用渠道
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model="option.templateParams.pipelineCode.defaultValue" disabled></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox disabled v-model="option.templateParams.pipelineCode.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox disabled v-model="option.templateParams.shopCode.checked"></el-checkbox>
                            </td>
                            <td>
                                适用店铺
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model="option.templateParams.shopCode.defaultValue" disabled></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox disabled v-model="option.templateParams.shopCode.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.limitCount.checked"></el-checkbox>
                            </td>
                            <td>
                                总使用次数
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.limitCount.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.limitCount.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.userLimitCount.checked"></el-checkbox>
                            </td>
                            <td>
                                单用户适用次数
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.userLimitCount.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.userLimitCount.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox :disabled="isSystem == 1" v-model="option.templateParams.userIds.checked"></el-checkbox>
                            </td>
                            <td>
                                绑定用户
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input :disabled="isSystem == 1" v-model.trim="option.templateParams.userIds.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="isSystem == 1" v-model="option.templateParams.userIds.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.country.checked"></el-checkbox>
                            </td>
                            <td>
                                适用国家
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select multiple v-model="option.templateParams.country.defaultValue" multiple placeholder="请选择" @change="changeCountry">
                                        <el-option v-for="item in countryOpt" :key="item.countryCode" :value="item.countryCode" :label="item.countryName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.country.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox :disabled="option.classId != 11 && option.classId != 15" v-model="option.templateParams.logisticsCode.checked"></el-checkbox>
                            </td>
                            <td>
                                适用物流
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select :disabled="(option.classId != 11 && option.classId != 15) || (option.templateParams.country.defaultValue.length === 0)" multiple v-model="option.templateParams.logisticsCode.defaultValue" multiple placeholder="请选择">
                                        <el-option v-for="item in logOpt" :key="item.id" :value="item.logisticsCode" :label="item.logisticsName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="option.classId != 11 && option.classId != 15" v-model="option.templateParams.logisticsCode.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.warehouses.checked"></el-checkbox>
                            </td>
                            <td>
                                适用仓库
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select multiple v-model="option.templateParams.warehouses.defaultValue" multiple placeholder="请选择">
                                        <el-option v-for="item in wareOpt" :key="item.virWhCode" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.warehouses.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.brands.checked"></el-checkbox>
                            </td>
                            <td>
                                适用品牌
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select multiple v-model="option.templateParams.brands.defaultValue" multiple placeholder="请选择">
                                        <el-option v-for="item in brandOpt" :key="item.brandCode" :value="item.brandCode" :label="item.brandTitle"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.brands.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.categorys.checked"></el-checkbox>
                            </td>
                            <td>
                                适用分类
                            </td>
                            <td>
                                <el-form-item class="coupon-select">
                                    <el-input :readonly="true" v-model="option.templateParams.categorys.defaultValue" @click.native="treeFlag = !treeFlag" class="js_input"></el-input>
                                    <el-tree v-show="treeFlag" :data="treeData" :props="treeProps" ref="tree" node-key="id" show-checkbox @check-change="changeTree"></el-tree>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.categorys.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.includeGoods.checked" @change="selectInclude('1',$event)"></el-checkbox>
                            </td>
                            <td>
                                适用SKU
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.includeGoods.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.includeGoods.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.excludeGoods.checked" @change="selectInclude('2',$event)"></el-checkbox>
                            </td>
                            <td>
                                不适用SKU
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.excludeGoods.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.excludeGoods.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.isSameStyle.checked"></el-checkbox>
                            </td>
                            <td>
                                同款生效
                            </td>
                            <td>
                                <el-form-item>
                                    <el-radio-group v-model="option.templateParams.isSameStyle.defaultValue">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.isSameStyle.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.memberGrade.checked"></el-checkbox>
                            </td>
                            <td>
                                会员等级
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select multiple v-model="option.templateParams.memberGrade.defaultValue" multiple placeholder="请选择">
                                        <el-option v-for="item in levelOpt" :key="item.id" :value="item.id" :label="item.levelName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.memberGrade.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.priceType.checked"></el-checkbox>
                            </td>
                            <td>
                                价格标签
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select multiple v-model="option.templateParams.priceType.defaultValue" placeholder="请选择">
                                        <el-option value="-1" label="本店售价"></el-option>
                                        <el-option-group v-for="(group, index) in priceOpt" :key="group.index" :label="group.name">
                                            <el-option v-for="item in group.memLabels" :key="item.id" :label="item.name" :value="String(item.labelId)">
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.priceType.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <!-- <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.isConfine.checked"></el-checkbox>
                            </td>
                            <td>
                                coupon限价
                            </td>
                            <td>
                                <el-form-item>
                                    <el-radio-group v-model="option.templateParams.isConfine.defaultValue">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.isConfine.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr> -->
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.newUser.checked"></el-checkbox>
                            </td>
                            <td>
                                仅新用户可购买
                            </td>
                            <td>
                                <el-form-item>
                                    <el-radio-group v-model="option.templateParams.newUser.defaultValue">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.newUser.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.goodLimitCount.checked"></el-checkbox>
                            </td>
                            <td>
                                限制购买数量
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.goodLimitCount.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.goodLimitCount.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.remark.checked"></el-checkbox>
                            </td>
                            <td>
                                Coupon备注
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.remark.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.remark.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.siteLink.checked"></el-checkbox>
                            </td>
                            <td>
                                跳转链接
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.siteLink.defaultValue" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                            <td>

                            </td>
                        </tr>
                        <template v-if="isSystem == 1">
                            <tr>
                                <td colspan="4" class="table-head">发放配置</td>
                            </tr>
                            <tr>
                                <td>
                                    <el-checkbox v-model="option.templateParams.grantTotalCount.checked"></el-checkbox>
                                </td>
                                <td>
                                    发放总数
                                </td>
                                <td>
                                    <el-form-item>
                                        <el-input v-model.trim="option.templateParams.grantTotalCount.defaultValue" :disabled="true"></el-input>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-checkbox v-model="option.templateParams.grantTotalCount.isRequired" true-label="1" false-label="0"></el-checkbox>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-checkbox v-model="option.templateParams.grantUserCount.checked"></el-checkbox>
                                </td>
                                <td>
                                    单用户可领取
                                </td>
                                <td>
                                    <el-form-item>
                                        <el-input v-model.trim="option.templateParams.grantUserCount.defaultValue" :disabled="true"></el-input>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-checkbox v-model="option.templateParams.grantUserCount.isRequired" true-label="1" false-label="0"></el-checkbox>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <div class="el-container text-center">
                <el-button v-if="self.showAction_('promotion/template/add-coupon')" type="primary" @click="postEdit" v-loading="postLoading" :disabled="postLoading">保存</el-button>
                <el-button type="danger" @click="goback">取消</el-button>
            </div>
        </el-form>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let isSystem = this.$route.query.system ? 1 : 0;

        let checkPositive = (rule, val, callback) => {
            let regex = new RegExp('^([1-9]\\d*|0)(\\.\\d+)?$');
            if (regex.test(val)) {
                callback();
            } else {
                callback(new Error('参数应为正数'));
            }
        };

        let checkDiscount = (rule, value, callback) => {
            let val1 = value.defaultValue1 * 1,
                val2 = value.defaultValue2 * 1,
                type = this.option.templateParams.fullCondition.defaultValue;
            if (type == 2) {
                if (!Number.isInteger(val1)) {
                    callback(new Error('数量必须为整数'));
                }
            }
            let regex = new RegExp('^([1-9]\\d*|0)(\\.\\d+)?$');
            if (regex.test(val1) && regex.test(val2)) {
                callback();
            } else {
                callback(new Error('参数应为正数'));
            }

        };
        return {
            checkDiscount: checkDiscount,
            checkPositive: checkPositive,
            terminal: [],
            postLoading: false,
            option: {
                name: '',
                classId: '8',
                type: 1,
                status: 1,
                remark: '',
                templateSites: [],
                templateParams: {
                    couponName: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'couponName'
                    },
                    code: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'code'
                    },
                    fullCondition: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'fullCondition'
                    },
                    discountForm: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'discountForm'
                    },
                    discountPercent: {
                        checked: false,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'discountPercent'
                    },
                    discountAmount: {
                        checked: false,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'discountAmount'
                    },
                    discountStrategy: {
                        checked: false,
                        defaultValue1: '',
                        defaultValue2: '',
                        isRequired: '1',
                        paramId: 'discountStrategy'
                    },
                    platforms: {
                        checked: true,
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'platforms'
                    },
                    pipelineCode: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'pipelineCode'
                    },
                    shopCode: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'shopCode'
                    },
                    times: {
                        checked: true,
                        defaultValue: [],
                        isRequired: '1',
                        paramId: 'times'
                    },
                    limitCount: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'limitCount'
                    },
                    userLimitCount: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'userLimitCount'
                    },
                    userIds: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'userIds'
                    },
                    country: {
                        checked: '',
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'country'
                    },
                    logisticsCode: {
                        checked: '',
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'logisticsCode'
                    },
                    warehouses: {
                        checked: '',
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'warehouses'
                    },
                    brands: {
                        checked: '',
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'brands'
                    },
                    categorys: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'categorys'
                    },
                    includeGoods: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'includeGoods'
                    },
                    excludeGoods: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'excludeGoods'
                    },
                    isSameStyle: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'isSameStyle'
                    },
                    memberGrade: {
                        checked: '',
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'memberGrade'
                    },
                    // isConfine: {
                    //     checked: '',
                    //     defaultValue: '',
                    //     isRequired: '0',
                    //     paramId: 'isConfine'
                    // },
                    goodLimitCount: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'goodLimitCount'
                    },
                    newUser: {
                        checked: '',
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'newUser'
                    },
                    priceType: {
                        checked: '',
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'priceType'
                    },
                    remark: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'remark'
                    },
                    siteLink: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'siteLink'
                    },
                    grantTotalCount: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'grantTotalCount'
                    },
                    grantUserCount: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'grantUserCount'
                    }
                }
            },
            self: this,
            tableLoading: false,
            tableData: [],
            tempOpt: [],
            wareOpt: [],
            brandOpt: [],
            itemOpt: {},
            siteOpt: [],
            logOpt: [],
            levelOpt: [],
            priceOpt: [],
            countryOpt: [],
            customOpt: {
                '8': '满减商品金额',
                '9': '直减',
                '10': '一口价',
                '11': '满减运费金额'
            },
            systemOpt: {
                '12': '满减商品金额(系统)',
                '13': '直减(系统)',
                '14': '一口价(系统)',
                '15': '满减运费金额(系统)',
            },
            isSystem: isSystem,
            treeProps: {
                children: 'subCategoryList',
                label: 'categoryName'
            },
            treeData: [],
            treeFlag: false,
            ids: '',
            postRules: {
                name: [{
                    max: 30,
                    required: true,
                    message: '该项不能为空,最大字符长度30',
                    trigger: 'blur'
                }],
                classId: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                templateSites: [{
                    type: 'array',
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
            }
        };
    },
    created () {
        this.getTempOpt();
    },
    computed: {
        discountForm () {
            this.option.templateParams.discountAmount.checked = false;
            this.option.templateParams.discountPercent.checked = false;
            this.option.templateParams.discountStrategy.checked = false;

            if (this.option.templateParams.discountForm.defaultValue == 3 && (this.option.classId == '9' || this.option.classId == '13')) {
                this.option.templateParams.discountPercent.checked = true;
                return 1;
            } else if ((this.option.templateParams.discountForm.defaultValue == 1 && (this.option.classId == '9' || this.option.classId == '13' )) || this.option.classId == '10' || this.option.classId == '14') {
                this.option.templateParams.discountAmount.checked = true;
                return 2;
            } else {
                if (this.option.templateParams.discountForm.defaultValue) {
                    this.option.templateParams.discountStrategy.checked = true;
                    return 3;
                } else {
                    return null;
                }
            }
        },
        terminalOpt() {
            return this.$store.getters.getTerminal.opt;
        },
        terminalMap() {
            return this.$store.getters.getTerminal.map;
        }
    },
    methods: {
        getTempOpt () {
            this.$http.get('promotion/index/public-activity-select').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;

                    this.tempOpt = data.listTemplate;
                    this.levelOpt = data.userLevel;
                    this.treeData = data.category;
                    this.wareOpt = data.virtualWares;
                    this.brandOpt = data.brand;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/price/label-lists').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.labelSites;
                    let temp = [{
                        name: '系统标签',
                        memLabels: []
                    }, {
                        name: '运营标签',
                        memLabels: []
                    }];

                    data.forEach(item => {
                        if (item.type == '1') {
                            temp[1].memLabels.push(item);
                        } else {
                            temp[0].memLabels.push(item);
                        }
                    });
                    this.priceOpt = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('base/public/site-list').then(res => {
                if (res.body.code === 0) {
                    this.siteOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/index/public-country-list').then(res => {
                if (res.body.code === 0) {
                    this.countryOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        changeCountry (val) {
            if (val.length === 0) {
                this.logOpt = [];
                this.option.templateParams.logisticsCode.defaultValue = [];
            } else {
                this.$http.get('promotion/index/public-country-logistics', {params: {countryCode: val.join(',')}}).then(res => {
                    if (res.body.code === 0) {
                        if (res.body.data instanceof Array && res.body.data.length > 0) {
                            this.logOpt = res.body.data;
                        } else {
                            this.logOpt = [];
                        }
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }
        },
        postEdit () {
            let self = this;
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    // 终端转换平台
                    let tempArr = [],
                        temp = [];
                    this.terminal.forEach(item => {
                        temp = self.terminalMap.filter(e => e.terminal_id == item).map(el => el.platform_id);
                        tempArr = tempArr.concat(temp);
                    });
                    self.option.templateParams.platforms.defaultValue = tempArr.sort();
                    //
                    let params = {};
                    params.templateParams = [];

                    for (let j in this.option) {
                        if (j !== 'templateParams' && j !== 'templateSites') {
                            params[j] = this.option[j];
                        }
                    }

                    params.templateSites = [];
                    for (let l in this.option.templateSites) {
                        params.templateSites.push({
                            siteCode: this.option.templateSites[l]
                        })
                    }

                    for (let i in this.option.templateParams) {
                        let item = this.option.templateParams[i];

                        if (item.checked) {
                            if (item.paramId === 'discountStrategy') {
                                let stsValue;
                                if (!item.defaultValue1 && !item.defaultValue2) {
                                    stsValue = '';
                                } else {
                                    stsValue = item.defaultValue1 + '-' + item.defaultValue2;
                                }
                                params.templateParams.push({
                                    defaultValue: stsValue,
                                    isRequired: item.isRequired,
                                    paramId: item.paramId
                                });
                            } else {
                                params.templateParams.push({
                                    defaultValue: item.defaultValue,
                                    isRequired: item.isRequired,
                                    paramId: item.paramId
                                });
                            }

                        }
                    }

                    for (let k in params.templateParams) {
                        let item = params.templateParams[k];

                        if (item.paramId === 'times') {
                            let timeArr = this.timeZone_(item.defaultValue, this.$store.getters.getTimeZone);
                            item.defaultValue = JSON.stringify({
                                startTime: timeArr[0],
                                endTime: timeArr[1]
                            });
                        } else if (item.defaultValue instanceof Array) {
                            item.defaultValue = item.defaultValue.join(',');
                        }

                        if (item.paramId == 'categorys') {

                            item.defaultValue = this.ids;
                        }
                    }

                    if (this.isSystem == '1') {
                        params.name = params.name + '（系统）'
                    }

                    this.postLoading = true;
                    this.$http.post('promotion/template/add', params).then(res => {
                        this.postLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.$router.push({
                                name: 'marketing_coupon_couponTotalList',
                            })
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoading = false;
                    });
                } else {
                    this.$message.error('请校验输入值');
                }
            })
        },
        changeTree () {
            let data = this.$refs.tree.getCheckedNodes();
            let temp = [];
            let tempStr = [];
            data.forEach(item => {
                temp.push(item.id);
                tempStr.push(item.categoryName)
            })
            this.option.templateParams.categorys.defaultValue = tempStr.join(',');
            this.ids = temp.join(',');
        },
        closeTree (event) {
            let target = event.target.parentElement._prevClass;
            if (target && target.indexOf('js_input') !== -1) {

            } else {
                this.treeFlag = false;
            }
        },
        changeSys (val) {
            if (val == 1) {
                this.option.templateParams.code.isRequired = '0';
                this.option.templateParams.userIds.checked = true;
            } else {
                this.option.templateParams.code.isRequired = '1';
                this.option.templateParams.userIds.checked = false;
            }
            this.option.classId = '';
        },
        selectInclude (type, val) {
            let flag = val.target.checked;
            if (flag) {
                if (type == 1) {
                    this.option.templateParams.excludeGoods.checked = false;
                } else {
                    this.option.templateParams.includeGoods.checked = false;
                }
            }
        },
        changeClassId (val) {
            this.option.templateParams.discountPercent = {
                checked: false,
                defaultValue: '',
                isRequired: '1',
                paramId: 'discountPercent'
            };
            this.option.templateParams.discountAmount = {
                checked: false,
                defaultValue: '',
                isRequired: '1',
                paramId: 'discountAmount'
            };
            this.option.templateParams.discountStrategy = {
                checked: false,
                defaultValue1: '',
                defaultValue2: '',
                isRequired: '1',
                paramId: 'discountStrategy'
            };

            this.option.templateParams.discountForm.defaultValue = null;
            this.option.templateParams.fullCondition.defaultValue = null;

            if (val == 8 || val == 11 || val == 12 || val == 15) {
                this.option.templateParams.fullCondition.checked = true;
                this.option.templateParams.discountForm.checked = true;
            } else if (val == 9 || val == 13) {
                this.option.templateParams.fullCondition.checked = false;
                this.option.templateParams.discountForm.checked = true;
            } else {
                this.option.templateParams.fullCondition.checked = false;
                this.option.templateParams.discountForm.checked = false;
            }

            if (val == 10 || val == 14) {
                this.$nextTick(() => {
                    this.$refs.postForm.$children.forEach(item => {
                        item.validateState = true;
                    })
                })
            }

            if (val != 11 && val != 15) {
                this.option.templateParams.country.checked = false;
                this.option.templateParams.logisticsCode.checked = false;
            }
        },
        goback () {
            history.back();
        }
    }
}
</script>

<style lang="less">
    .coupon-tpl-add {
        .price-temp-table {
            width: 80%;

            th,td {
                padding: 5px;
                text-align: center;

                &.sub-th {
                    background: #475669;
                    color: #fff;
                    text-align: left;
                    padding-left: 50px;
                }

                &.table-head {
                    background: #d1dbe5;
                    text-align: left;
                    padding-left: 70px;
                }
            }

            .el-form-item {
                margin-bottom: 0;

                .el-form-item__content,.el-date-editor--datetimerange.el-input {
                    width: 400px;
                }

                &.check-item {
                    .el-form-item__error {
                        position: static;
                    }
                }
            }
        }

        .coupon-select {
            position: relative;
            z-index: 10;
            min-height: 36px;

            .el-input {
                position: absolute;
                top: 0;
                left: 0;
            }

            .el-tree {
                position: absolute;
                top: 36px;
                left: 0;
                z-index: 10;
                width: 100%;
                max-height: 300px;
                overflow-y: auto;
                text-align: left;
            }
        }

        .coupon-multiple-site {

            .el-form-item__content {
                width: 600px;
            }

        }
    }
</style>
