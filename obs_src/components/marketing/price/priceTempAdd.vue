<!-- 新增价格模板 -->
<template>
    <div>
        <el-form inline label-width="120px" :model="option" ref="postForm" :rules="postRule">
            <div class="el-container">
                <el-form-item label="模板名称" prop="name">
                    <el-input v-model.trim="option.name"></el-input>
                </el-form-item>
                <el-form-item label="生效站点" class="price-temp-add-site" prop="templateSites">
                    <el-select filterable v-model="option.templateSites" multiple>
                        <el-option v-for="item in siteOpt" :key="item.code" :value="item.code" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
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
                            <th>选择价格属性</th>
                            <th>默认值</th>
                            <th>必填</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="4" class="sub-th">基础设置</td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.price.checked" @change="setPrice('price', $event)"></el-checkbox>
                            </td>
                            <td>
                                价格
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.price.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.price.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.rates.checked" @change="setPrice('rates', $event)"></el-checkbox>
                            </td>
                            <td>
                                利润率
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.rates.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.rates.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.mantissa.checked" :disabled="!eidtMantissa"></el-checkbox>
                            </td>
                            <td>
                                价格尾数
                            </td>
                            <td>
                                <el-form-item prop="templateParams.mantissa.defaultValue">
                                    <el-input v-model.trim="option.templateParams.mantissa.defaultValue" ></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.mantissa.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.stepPrice.checked" @change="setPrice('stepPrice', $event)"></el-checkbox>
                            </td>
                            <td>
                                阶梯价
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.stepPrice.defaultValue[0].stepFrom" :disabled="true"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled='true' v-model="option.templateParams.stepPrice.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.platforms.checked" :disabled="true"></el-checkbox>
                            </td>
                            <td>
                                终端
                            </td>
                            <td>
                                <el-form-item>
                                    <el-checkbox-group v-model="terminal">
                                        <el-checkbox v-for="item in terminalOpt" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
                                    </el-checkbox-group>
<!--                                     <el-checkbox-group v-model="option.templateParams.platforms.defaultValue">
                                        <el-checkbox label="1" @change="changePlat('1', $event)">PC</el-checkbox>
                                        <el-checkbox label="2" @change="changePlat('2', $event)">M端</el-checkbox>
                                        <el-checkbox label="3" @change="changePlat('3', $event)">IOS</el-checkbox>
                                        <el-checkbox label="4" @change="changePlat('4', $event)">ANDROID</el-checkbox>
                                        <el-checkbox label="5" @change="changePlat('5', $event)">PAD</el-checkbox>
                                    </el-checkbox-group> -->
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.platforms.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.pipelineCode.checked"></el-checkbox>
                            </td>
                            <td>
                                生效渠道
                            </td>
                            <td>
                                <el-form-item prop="pipelineCode">
                                    <el-input v-model="option.templateParams.pipelineCode.defaultValue"disabled></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.pipelineCode.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <!-- <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.compulsoryPackage.checked" :disabled="true"></el-checkbox>
                            </td>
                            <td>
                                价格锁定
                            </td>
                            <td>
                                <el-form-item>
                                    <el-checkbox v-model="option.templateParams.compulsoryPackage.defaultValue" true-label="1" false-label="0" @change="changeType('compulsoryPromotion', $event)">包邮运费锁定</el-checkbox>
                                    <el-checkbox v-model="option.templateParams.compulsoryPromotion.defaultValue" true-label="1" false-label="0" @change="changeType('compulsoryPackage', $event)">利润率锁定</el-checkbox>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.compulsoryPackage.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr> -->
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.times.checked" :disabled="true"></el-checkbox>
                            </td>
                            <td>
                                价格生效时间
                            </td>
                            <td>
                                <el-form-item>
                                   <el-date-picker v-model="option.templateParams.times.defaultValue" type="datetimerange" :editable="false" @change="checkDate_($event, option.templateParams.times.defaultValue)"></el-date-picker>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.times.isRequired" true-label="1" false-label="0" :disabled="true"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.integralRate.checked" :disabled="true"></el-checkbox>
                            </td>
                            <td>
                                积分赠送比例
                            </td>
                            <td>
                                <el-form-item prop="templateParams.integralRate.defaultValue">
                                    <el-input v-model.trim="option.templateParams.integralRate.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.integralRate.isRequired" true-label="1" false-label="0"></el-checkbox>
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
                                    <el-checkbox v-model="option.templateParams.isSameStyle.defaultValue" true-label="1" false-label="0"></el-checkbox>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.isSameStyle.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.sysLabelId.checked" :disabled="true"></el-checkbox>
                            </td>
                            <td>
                                系统标签
                            </td>
                            <td>
                                <el-form-item prop="templateParams.sysLabelId.defaultValue" :rules="[{required: true, message: '该项不能为空'}]">
                                    <el-select filterable v-model="option.templateParams.sysLabelId.defaultValue" placeholder="请选择">
                                        <el-option v-for="item in labelOpt.sys" :key="item.id" :label="item.name" :value="String(item.labelId)">
                                            </el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.sysLabelId.isRequired" true-label="1" false-label="0" :disabled="true"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.userLabelId.checked"></el-checkbox>
                            </td>
                            <td>
                                运营标签
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select filterable multiple v-model="option.templateParams.userLabelId.defaultValue" placeholder="请选择">
                                        <el-option v-for="item in labelOpt.user" :key="item.id" :label="item.name" :value="String(item.labelId)">
                                            </el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.userLabelId.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.declare.checked" :disabled="true"></el-checkbox>
                            </td>
                            <td>
                                说明
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.declare.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.declare.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.remark.checked" :disabled="true"></el-checkbox>
                            </td>
                            <td>
                                备注
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
                                <el-checkbox v-model="option.templateParams.priceName.checked" :disabled="true"></el-checkbox>
                            </td>
                            <td>
                                组名称
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input v-model.trim="option.templateParams.priceName.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.priceName.isRequired" true-label="1" false-label="0" :disabled="true"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="sub-th">
                                生效条件
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.country.checked"></el-checkbox>
                            </td>
                            <td>
                                绑定国家
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select :disabled="true" v-model="option.templateParams.country.defaultValue" multiple>
                                        <el-option value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.country.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.users.checked"></el-checkbox>
                            </td>
                            <td>
                                绑定会员
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input :disabled="true" v-model.trim="option.templateParams.users.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.users.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.userLevel.checked"></el-checkbox>
                            </td>
                            <td>
                                会员等级
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select :disabled="true" v-model="option.templateParams.userLevel.defaultValue" multiple>
                                        <el-option value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.userLevel.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.saleQty.checked"></el-checkbox>
                            </td>
                            <td>
                                可销售数量
                            </td>
                            <td>
                                <el-form-item prop="templateParams.saleQty.defaultValue">
                                    <el-input v-model.trim="option.templateParams.saleQty.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.saleQty.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.buyLimit.checked"></el-checkbox>
                            </td>
                            <td>
                                单账户可购买数量
                            </td>
                            <td>
                                <el-form-item prop="templateParams.buyLimit.defaultValue">
                                    <el-input v-model.trim="option.templateParams.buyLimit.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.buyLimit.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="sub-th">
                                高级设置
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.ciphertext.checked"></el-checkbox>
                            </td>
                            <td>
                                密文
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input :disabled="true" v-model.trim="option.templateParams.ciphertext.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.ciphertext.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.timerRiseInPrice.checked" @change="changePrice('timerRiseInPrice', $event)"></el-checkbox>
                            </td>
                            <td>
                                价格定时增长
                            </td>
                            <td>
                                <el-form-item>
                                    <el-row>
                                        <el-col :span="1">
                                            每
                                        </el-col>
                                        <el-col :span="9">
                                            <el-input :disabled="true" v-model.trim="option.templateParams.timerRiseInPrice.defaultValue.timeOfHourPrice"></el-input>
                                        </el-col>
                                        <el-col :span="4">
                                            小时增长
                                        </el-col>
                                        <el-col :span="9">
                                            <el-input :disabled="true" v-model.trim="option.templateParams.timerRiseInPrice.defaultValue.risePrice"></el-input>
                                        </el-col>
                                        <el-col :span="1">
                                            $
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.timerRiseInPrice.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.orderChange.checked" @change="changePrice('orderChange', $event)"></el-checkbox>
                            </td>
                            <td>
                                价格随销量变动
                            </td>
                            <td>
                                <el-form-item>
                                    <el-row>
                                        <el-col :span="2">
                                            销量
                                        </el-col>
                                        <el-col :span="6">
                                            <el-input :disabled="true" v-model.trim="option.templateParams.orderChange.defaultValue[0].saleQtyFrom"></el-input>
                                        </el-col>
                                        <el-col :span="1">
                                            -
                                        </el-col>
                                        <el-col :span="6">
                                            <el-input :disabled="true" v-model.trim="option.templateParams.orderChange.defaultValue[0].saleQtyTo"></el-input>
                                        </el-col>
                                        <el-col :span="3">
                                            利润率
                                        </el-col>
                                        <el-col :span="6">
                                            <el-input :disabled="true" v-model.trim="option.templateParams.orderChange.defaultValue[0].profitRates"></el-input>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.orderChange.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.timerRiseInOrder.checked" @change="changePrice('timerRiseInOrder', $event)"></el-checkbox>
                            </td>
                            <td>
                                定时销量增长
                            </td>
                            <td>
                                <el-form-item>
                                    <el-row>
                                        <el-col :span="1">
                                            每
                                        </el-col>
                                        <el-col :span="9">
                                            <el-input :disabled="true" v-model.trim="option.templateParams.timerRiseInOrder.defaultValue.timeOfHourOrder"></el-input>
                                        </el-col>
                                        <el-col :span="4">
                                            小时增长
                                        </el-col>
                                        <el-col :span="9">
                                            <el-input :disabled="true" v-model.trim="option.templateParams.timerRiseInOrder.defaultValue.riseOrder"></el-input>
                                        </el-col>
                                        <el-col :span="1">
                                            个
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.timerRiseInOrder.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.virtualSaleQty.checked"></el-checkbox>
                            </td>
                            <td>
                                虚拟售出数量
                            </td>
                            <td>
                                <el-form-item prop="templateParams.virtualSaleQty.defaultValue">
                                    <el-input v-model.trim="option.templateParams.virtualSaleQty.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.virtualSaleQty.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.isLock.checked"></el-checkbox>
                            </td>
                            <td>
                                不参与自动更新
                            </td>
                            <td>
                                <el-form-item>
                                    <el-checkbox v-model="option.templateParams.isLock.defaultValue" true-label="1" false-label="0"></el-checkbox>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.isLock.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox v-model="option.templateParams.excludeSysLabelId.checked"></el-checkbox>
                            </td>
                            <td>
                                排除标签
                            </td>
                            <td>
                                <el-form-item>
                                    <el-select filterable multiple v-model="option.templateParams.excludeSysLabelId.defaultValue" placeholder="请选择">
                                        <el-option v-for="item in totalLabel" :key="item.id" :label="item.name" :value="String(item.labelId)">
                                            </el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox v-model="option.templateParams.excludeSysLabelId.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.applyStockOccupy.checked"></el-checkbox>
                            </td>
                            <td>
                                申请占用库存
                            </td>
                            <td>
                                <el-form-item>
                                    <el-input :disabled="true" v-model.trim="option.templateParams.applyStockOccupy.defaultValue"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-checkbox :disabled="true" v-model="option.templateParams.applyStockOccupy.isRequired" true-label="1" false-label="0"></el-checkbox>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="el-container text-center">
                <el-button v-if="self.showAction_('promotion/template/add')" type="primary" @click="postEdit" v-loading="postLoading" :disabled="postLoading">保存</el-button>
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
        var checkInt = function (rule, value, callback) {
            setTimeout(() => {
                if (value == '' || Number.isInteger(value * 1) && Number(value) > 0) {
                    callback();
                } else {
                    callback(new Error('该项应为正整数'));
                }
            }, 1000);
        }

        var checkFixed = function (rule, value, callback) {
            setTimeout(() => {
                if (value == '') {
                    callback();
                } else {
                    let exp = /^[1-9]\d?\.\d\d?$/;
                    if (exp.test(value)) {
                        callback ();
                    } else {
                        callback(new Error('该项应为数字，最多2位小数'));
                    }
                }
            },1000)
        }

        var checkFloat = function (rule, value, callback) {
            setTimeout(() => {
                if (value == '') {
                    callback();
                } else {
                    let exp = /^0\.\d\d?$/;
                    if (exp.test(value)) {
                        callback();
                    } else {
                        callback(new Error('该项应为0到1的数字，最多2位小数'));
                    }
                }
            }, 1000);
        }

        var checkNumber = function (rule, value, callback) {
            setTimeout(() => {
                if (Number(value) || value == '') {
                    callback();
                } else {
                    callback(new Error('该项应为数字'));
                }
            }, 1000);
        }

        return {
            terminal: [],
            self: this,
            option: {
                name: '',
                remark: '',
                templateSites: [],
                templateParams: {
                    price: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'price'
                    },
                    rates: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'rates'
                    },
                    mantissa: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'mantissa'
                    },
                    stepPrice: {
                        checked: '',
                        defaultValue: [{
                            'stepFrom': null,
                            'stepTo': null,
                            'rates': null,
                        }],
                        isRequired: '1',
                        paramId: 'stepPrice'
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
                    // compulsoryPromotion: {
                    //     checked: true,
                    //     defaultValue: '0',
                    //     isRequired: '0',
                    //     paramId: 'compulsoryPromotion'
                    // },
                    // compulsoryPackage: {
                    //     checked: true,
                    //     defaultValue: '0',
                    //     isRequired: '0',
                    //     paramId: 'compulsoryPackage'
                    // },
                    times: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'times'
                    },
                    integralRate: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'integralRate'
                    },
                    isSameStyle: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'isSameStyle'
                    },
                    sysLabelId: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'sysLabelId'
                    },
                    userLabelId: {
                        checked: false,
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'userLabelId'
                    },
                    excludeSysLabelId: {
                        checked: false,
                        defaultValue: [],
                        isRequired: '0',
                        paramId: 'excludeSysLabelId'
                    },
                    declare: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'declare'
                    },
                    remark: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'remark'
                    },
                    priceName: {
                        checked: true,
                        defaultValue: '',
                        isRequired: '1',
                        paramId: 'priceName'
                    },
                    country: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'country'
                    },
                    users: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'users'
                    },
                    userLevel: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'userLevel'
                    },
                    saleQty: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'saleQty'
                    },
                    buyLimit: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'buyLimit'
                    },
                    ciphertext: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'ciphertext'
                    },
                    timerRiseInPrice: {
                        checked: '',
                        defaultValue: {
                            timeOfHourPrice: null,
                            risePrice: null,
                        },
                        isRequired: '0',
                        paramId: 'timerRiseInPrice'
                    },
                    orderChange: {
                        checked: '',
                        defaultValue: [{
                            'saleQtyFrom': null,
                            'saleQtyTo': null,
                            'profitRates': null,
                        }],
                        isRequired: '0',
                        paramId: 'orderChange'
                    },
                    timerRiseInOrder: {
                        checked: '',
                        defaultValue: {
                            timeOfHourOrder: null,
                            riseOrder: null,
                        },
                        isRequired: '0',
                        paramId: 'timerRiseInOrder'
                    },
                    virtualSaleQty: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'virtualSaleQty'
                    },
                    isLock: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'isLock'
                    },
                    applyStockOccupy: {
                        checked: '',
                        defaultValue: '',
                        isRequired: '0',
                        paramId: 'applyStockOccupy'
                    },
                }
            },
            tableData: [],
            siteOpt: [],
            labelOpt: [],
            totalLabel: [],
            postLoading: false,
            eidtMantissa: true,
            nameOpt: {
                priceName: '组名称',
                price: '价格',
                rates: '利润率',
                mantissa: '价格尾数',
                stepPrice: '阶梯价',
                platforms: '平台',
                pipelineCode: '生效渠道',
                times: '生效时间',
                startTime: '开始时间',
                endTime: '结束时间',
                timerRiseInPrice: '定时价格增长',
                orderChange: '销售量价格变动',
                timerRiseInOrder: '定时订单增长',
                saleQty: '可销售数量',
                virtualSaleQty: '虚拟售出数量',
                // compulsoryPackage: '包邮运费锁定',
                // compulsoryPromotion: '利润率锁定',
                buyLimit: '单用户购买数量限制',
                users: '绑定会员',
                userLevel: '会员等级',
                country: '绑定国家',
                ciphertext: '密文',
                isSameStyle: '同款生效',
                isLock: '不参与自动更新',
                integralRate: '积分比率',
                sysLabelId: '系统标签',
                userLabelId: '运营标签',
                excludeSysLabelId: '排除标签',
                declare: '说明',
                remark: '备注',
            },
            postRule: {
                'name': [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                'templateSites': [{
                    type: 'array',
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                'templateParams.mantissa.defaultValue': [{
                    validator: checkFloat,
                    trigger: 'blur'
                }],
                'templateParams.integralRate.defaultValue': [{
                    validator: checkFixed,
                    trigger: 'blur'
                }],
                'templateParams.buyLimit.defaultValue': [{
                    validator: checkInt,
                    trigger: 'blur'
                }],
                'templateParams.saleQty.defaultValue': [{
                    validator: checkInt,
                    trigger: 'blur'
                }],
                'templateParams.virtualSaleQty.defaultValue': [{
                    validator: checkInt,
                    trigger: 'blur'
                }]
            }
        };
    },
    created () {
        this.getOpt();
    },
    computed: {
        terminalOpt() {
            return this.$store.getters.getTerminal.opt;
        },
        terminalMap() {
            return this.$store.getters.getTerminal.map;
        }
    },
    methods: {
        getOpt () {
            this.$http.get('base/public/site-list').then(res => {
                if (res.body.code === 0) {
                    this.siteOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/price/label-lists').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.labelSites;
                    let temp = {
                        user: [],
                        sys: [],
                    };

                    data.forEach(item => {
                        if (item.type == '1') {
                            temp.user.push(item);
                        } else {
                            temp.sys.push(item);
                        }
                    });
                    this.totalLabel = data;;
                    this.labelOpt = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        changeType (params, event) {
            if (event.target.checked) {
                this.option.templateParams[params].defaultValue = '0';
            }
        },
        setPrice (params, event) {
            let arr = ['price', 'rates', 'stepPrice'];
            if (event.target.checked) {
                if (params == 'rates' || params == 'price') {
                    this.option.templateParams.stepPrice.checked = false;
                }

                if (params == 'stepPrice') {
                    this.option.templateParams.price.checked = false;
                    this.option.templateParams.rates.checked = false;
                }

                if (this.option.templateParams.stepPrice.checked) {
                    this.option.templateParams.mantissa.checked = false;
                    this.eidtMantissa = false;
                } else {
                    this.eidtMantissa = true;
                }
            } else {
                this.eidtMantissa = true;
            }
        },
        changePrice (val, event) {
            if (event.target.checked) {
                if (val === 'timerRiseInPrice') {
                    this.option.templateParams.orderChange.checked = false;
                    this.option.templateParams.timerRiseInOrder.checked = false;
                }

                if (val === 'orderChange') {
                    this.option.templateParams.timerRiseInPrice.checked = false;
                    this.option.templateParams.timerRiseInOrder.checked = false;
                }

                if (val === 'timerRiseInOrder') {
                    this.option.templateParams.timerRiseInPrice.checked = false;
                    this.option.templateParams.orderChange.checked = false;
                }
            }
        },
        // changePlat (params, event) {
        //     if (event.target.checked) {
        //         this.option.templateParams.platforms.defaultValue = [params];
        //     }
        // },
        postEdit () {
            let self = this;
            // this.postLoading = true;
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    if (!this.option.templateParams.price.checked && !this.option.templateParams.rates.checked && !this.option.templateParams.stepPrice.checked) {
                        this.$message.warning('价格、利润率或阶梯价至少选择一项');
                        this.postLoading = false;
                        return ;
                    }

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
                    params.name = this.option.name;
                    params.remark = this.option.remark;
                    params.templateSites = [];
                    params.type = '0';

                    for (let l in this.option.templateSites) {
                        params.templateSites.push({
                            siteCode: this.option.templateSites[l]
                        })
                    }

                    for (let i in this.option.templateParams) {
                        let item = this.option.templateParams[i];

                        if (item.checked) {
                            params.templateParams.push({
                                defaultValue: item.defaultValue,
                                isRequired: item.isRequired,
                                paramId: item.paramId,
                                paramName: this.nameOpt[item.paramId]
                            });
                        }
                    }

                    for (let k in params.templateParams) {
                        let item = params.templateParams[k];

                        if (item.paramId === 'times') {
                            if (item.defaultValue.length > 1) {
                                let timeArr = this.timeZone_(item.defaultValue, this.$store.getters.getTimeZone);
                                item.defaultValue = JSON.stringify({
                                    startTime: timeArr[0],
                                    endTime: timeArr[1]
                                });
                            } else {
                                item.defaultValue = {
                                    startTime: null,
                                    endTime: null
                                }
                            }
                        } else if (item.defaultValue instanceof Array) {
                            if (item.defaultValue[0] instanceof Object) {

                            } else {
                                item.defaultValue = item.defaultValue.join(',');
                            }
                        }
                    }

                    this.$http.post('promotion/template/add', params).then(res => {
                        this.postLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.$router.push({
                                name: 'marketing_price_priceTempList'
                            })
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoading = false;
                    })
                } else {
                    this.postLoading = false;
                    this.$message.error('请输入必填项');
                }
            })
        },
        ChangePage (val) {
            this.option.templateParams.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.templateParams.page_size = val;
            this.getData();
        },
        goback () {
            history.back();
        }
    }
}
</script>

<style lang="less">
    .price-temp-table {
        width: 80%;

        th,td {
            padding: 10px;
            text-align: center;

            &.sub-th {
                background: #475669;
                color: #fff;
                text-align: left;
                padding-left: 50px;
            }
        }

        .el-form-item {
            margin-bottom: 0;

            .el-form-item__content {
                width: 400px;
            }
        }
    }

    .price-temp-add-site {

        .el-form-item__content {
            width: 500px;
        }
    }
</style>
