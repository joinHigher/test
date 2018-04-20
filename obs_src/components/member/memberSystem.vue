<template>
    <div>
        <div class="el-container">

            <el-tabs v-model="options.tabActive" v-loading="isDataLoading" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="会员等级配置" name="level-list">
                    <div class="el-sub-container">
                        <el-button type="primary" @click="handleBtnEditClick" :disabled="!options.isNotEdit"><i class="el-icon-edit"></i> 编辑全部</el-button>
                    </div>
                    <div class="box-card-wrap">
                        <el-card v-for="(level, index) in dataLevel.levels" :key="index" class="box-card">
                            <div slot="header" class="header">&nbsp;</div>
                            <el-form :model="dataLevel.levels[index]" :rules="dataLevel.levelRules" :ref="'levelForm-' + index" label-width="140px">
                                <el-form-item prop="levelName" class="item-name">
                                    <el-input type="text" v-model.trim="level.levelName" class="ipt-level-name" :readonly="options.isNotEdit && !level.isNew" placeholder="请输入等级名称"></el-input>
                                    <span class="actions">
                                        <el-button type="text" class="icon-save" v-show="level.isNew" @click="handleNewSaveClick(index)"><i class="el-icon-check"></i></el-button>
                                        <el-button type="text" class="icon-del" v-show="!options.isNotEdit || level.isNew" @click="handleDelClick(level)"><i class="el-icon-close"></i></el-button>
                                    </span>
                                </el-form-item>
                                <el-form-item v-for="(value, key) in dataLevel.textOptions" class="el-sub-container item" :label="value" :prop="key" :key="key" v-if="(key == 'standard' || key == 'yearSubtract' || key == 'isPay') || level.isPay === 1" :required="key == 'inEffectDate'">
                                    <el-input v-if="key == 'standard' || key == 'yearSubtract'" v-model="level[key]" :readonly="options.isNotEdit && !level.isNew" size="small"></el-input>
                                    <el-input v-else-if="key != 'isPay'"  :type="key != 'description' ? 'text' : 'textarea'" :autosize="key == 'description'" v-model="level[key]" :readonly="options.isNotEdit && !level.isNew" size="small"></el-input>
                                    <el-radio-group v-if="key == 'isPay'" v-model="level[key]" :disabled="options.isNotEdit && !level.isNew">
                                        <el-radio class="radio" :label="1">是</el-radio>
                                        <el-radio class="radio" :label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-form>
                        </el-card>
                        <el-card v-if="this.showAction_('user/user-system/add-level')" class="box-card box-add">
                            <div @click="handleAddClick"><i class="el-icon-plus"></i></div>
                        </el-card>
                    </div>

                    <div v-if="!options.isNotEdit" class="el-sub-container text-center">
                        <el-button type="primary" @click="handleBtnSaveClick"><i class="el-icon-check"></i> 保存</el-button>
                        <el-button type="default" @click="handleBtnCancelClick">取消</el-button>
                    </div>
                    
                </el-tab-pane>

                <el-tab-pane label="成长值配置" name="growup-list" class="growup">
                    <div class="el-sub-container">
                        <el-button v-if="this.showAction_('user/user-system/save-point-setting')" type="primary" @click="handleBtnEditGrowupClick" :disabled="!dataGrowup.options.isNotEdit || dataGrowup.options.isLoading"><i class="el-icon-edit"></i> 编辑全部</el-button>
                    </div>
                    
                    <div class="el-sub-container">
                        <el-form :model="dataGrowup" ref="growupForm" class="growupForm" label-width="250px">
                            <el-form-item v-for="(item, index) in dataGrowup.growupForm" :prop="'growupForm.' + index + '.attrValue'" :label="item.attrDesc" :key="index" :rules="[{validator: checkGroupNum, trigger: 'blur'}]">
                                <el-row :gutter="10">
                                    <el-col :span="3">
                                        <el-input type="number" v-model="item.attrValue" min="0" :readonly="dataGrowup.options.isNotEdit"></el-input>
                                    </el-col>
                                    <el-col :span="3">
                                        <span v-if="item.attrName == 'loginGrowup'">成长值/天</span>
                                        <span v-else-if="item.attrName == 'affirmGrowup'">成长值/USD</span>
                                        <span v-else-if="item.attrName == 'evaluateGoodsGrowup' || item.attrName == 'evaluateOrderGrowup' || item.attrName == 'recommondGrowup'">成长值/SKU</span>
                                        <span v-else-if="item.attrName == 'inviteGrowup'">成长值/人</span>
                                        <span v-else>成长值</span>
                                        <span v-if="item.attrName == 'perfectGrowup'"> &nbsp; &nbsp;
                                            <el-button type="text" @click="handleGrowupMoreClick(item.id, item.attrValue, index)">更多</el-button>
                                        </span>
                                    </el-col>
                                    <el-col :span="17" class="col-last color-silver">
                                        <span v-if="item.attrName == 'loginGrowup'">*一天（0-24点）登录一次记为一次签到，一天中只可签到一次 &nbsp; *平台：在PC,M,IOS,安卓设备中登录只有第一个设备的成长值有效</span>
                                        <span v-else-if="item.attrName == 'affirmGrowup'">其他币种以美元为汇率基准，四舍五入，取整数</span>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-form>
                        <el-alert title="若成长值为空则该项不增加成长值" type="info" show-icon></el-alert>
                    </div>

                    <div v-if="!dataGrowup.options.isNotEdit || dataGrowup.options.isLoading" class="el-sub-container text-center">
                        <el-button type="primary" @click="handleBtnSaveGrowupClick" :loading="dataGrowup.options.isLoading"><i class="el-icon-check"></i> 保存</el-button>
                        <el-button type="default" @click="handleBtnCancelGrowupClick" :disabled="dataGrowup.options.isLoading">取消</el-button>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="会员特权配置" name="privileges" class="privileges">
                    <div class="el-sub-container">
                        <el-button type="primary" @click="handleBtnEditPrivilegeClick" :disabled="!dataPrivilege.options.isNotEdit || dataPrivilege.options.isLoading"><i class="el-icon-edit"></i> 编辑全部</el-button>
                        <!--!dataPrivilege.options.isNotEdit || dataPrivilege.options.isLoading-->
                    </div>

                    <div class="el-sub-container">
                        <el-form :model="dataPrivilege" ref="privilegeForm" class="privilegeForm" label-width="200px">
                            <el-form-item label="会员等级：">
                                <el-row>
                                    <el-col :span="3">
                                        <el-select v-model="dataPrivilege.options.selectedLevel" placeholder="请选择">
                                            <el-option v-for="(item, key) in dataLevel.levels" v-if="!item.isNew" :label="item.levelName" :value="item.id" :key="key"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="服务：">
                                <el-row>
                                    <el-col :span="3">
                                        <el-checkbox v-model="dataPrivilege.options.checkedAllService" label="(全选)" @change="handleCheckAllPrivilege($event, 0)" :disabled="dataPrivilege.options.isNotEdit"></el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-form-item>

                            <el-form-item v-for="(item, key, index) in dataPrivilege.privilegeForm[dataPrivilege.options.selectedLevel]"
                                    :prop="'privilegeForm[' + dataPrivilege.options.selectedLevel + '][' + key + '].itemValue'" :key="index" :rules="item.type == 2 ? [{ required: true, message: '请输入正确的数值' }, { type: 'number', min: 0, message: '必须为大于等于0的数字'}] : []">
                                <el-row :gutter="10">
                                    <el-col :span="3">
                                        <el-checkbox v-model="item.itemSelect" :true-label="1" :false-label="0" :label="item.itemRemark + '：'" @change="handleCheckedChangePrivilege" :disabled="dataPrivilege.options.isNotEdit"></el-checkbox>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-input v-if="item.type == 2" type="text" v-model.number="item.itemValue" :readonly="dataPrivilege.options.isNotEdit"></el-input>
                                        <el-select v-else v-model="item.itemValue" :disabled="dataPrivilege.options.isNotEdit">
                                            <el-option v-for="n in 10" :label="n - 1" :value="(n - 1) + ''" :key="n - 1"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="18" class="col-last color-silver">
                                        <div v-if="item.type == 1">请在框内填写0-9中的一个数字、对客服的处理速度进行优先级排序（0优先级最高）</div>
                                        <div v-else-if="key == 'birthdayGift'">触发规则：达到该等级，则在用户中心填写的生日当月第一天0点发放COUPON（一个自然年只发放一次）</div>
                                        <div v-else-if="key == 'anniversaryGift'">触发规则：第二个账户周年开始时会享受账户周年礼，在账户周年日的当月第一天0点发放COUPON</div>
                                        <div v-else-if="key == 'gradeGift'">触发规则：到达该等级即可发放COUPON</div>
                                        <div v-else-if="key == 'shareGift'">触发规则：暂未定</div>
                                        <div v-else-if="key == 'integralLimit'">% &nbsp; &nbsp; 请在框内填写数字、最高限制为50%</div>
                                        <div v-else-if="key == 'integralGive'">请填写达到该等级赠送的积分数</div>
                                        <div v-else-if="key == 'logisticsCoupon'">具体优惠额度请在<span class="color-blue">营销模块</span>下进行设置</div>
                                        <div v-else-if="key == 'gradePrice'">请在<span class="color-blue">营销模块</span>进行设置</div>
                                    </el-col>
                                </el-row>
                                <el-row v-if="key == 'order'" class="row-all">
                                    <el-col :span="3">
                                        <span class="item-name">优惠：</span>
                                        <el-checkbox v-model="dataPrivilege.options.checkedAllDiscount" label="(全选)" @change="handleCheckAllPrivilege($event, 1)" :disabled="dataPrivilege.options.isNotEdit"></el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            
                        </el-form>
                    </div>

                    <div v-if="!dataPrivilege.options.isNotEdit || dataPrivilege.options.isLoading" class="el-sub-container text-center">
                        <el-button type="primary" @click="handleBtnSavePrivilegeClick" :loading="dataPrivilege.options.isLoading"><i class="el-icon-check"></i> 保存</el-button>
                        <el-button type="default" @click="handleBtnCancelPrivilegeClick" :disabled="dataPrivilege.options.isLoading">取消</el-button>
                    </div>
                </el-tab-pane>

                <!-- <el-tab-pane label="积分配置" name="point-setting">
                    <div class="el-sub-container">
                        <el-button v-if="this.showAction_('user/user-system/save-point-setting')" type="primary" @click="handleBtnEditPointClick" :disabled="!dataPoint.options.isNotEdit || dataPoint.options.isLoading"><i class="el-icon-edit"></i> 编辑全部</el-button>
                    </div>
                    <el-form :model="dataPoint" ref="pointForm" class="pointForm" label-width="300px">
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <template v-for="(item, index) in dataPoint.pointForm">
                                    <h3 v-if="index === 0">日常行为奖励</h3>
                                    <h3 v-if="index === 4">交易行为奖励</h3>
                                    <h3 v-if="index === 8">积分使用限制</h3>
                                    <el-form-item v-if="index < 12" :prop="'pointForm.' + index + '.attrValue'" :label="item.attrDesc" :rules="[{validator: checkNum, trigger: 'blur'}]">
                                        <el-row>
                                            <el-col :span="12">
                                                <el-input v-model="item.attrValue" :readonly="dataPoint.options.isNotEdit"></el-input>
                                            </el-col>
                                            <el-col :span="8" :offset="1">
                                                <span v-if="index === 3">
                                                    <el-tooltip effect="dark" content="*登录触发赠送积分，一个自然日（0-24点）内仅触发赠送一次，不做平台（PC,M,IOS,android）区分" placement="top-start">
                                                        <i class="el-icon-warning"></i>
                                                    </el-tooltip>
                                                </span>
                                                <span v-else-if="index === 4">
                                                    <span>积分/USD</span>
                                                    <el-tooltip effect="dark" content="其他币种以美元为汇率基准，四舍五入，取整数" placement="top-start">
                                                        <i class="el-icon-warning"></i>
                                                    </el-tooltip>
                                                </span>
                                                <span v-else-if="index === 6">
                                                    <span>积分/USD</span>
                                                    <el-tooltip effect="dark" content="注意：支付来源为电子钱包，退款至电子钱包，不给于奖励" placement="top-start">
                                                        <i class="el-icon-warning"></i>
                                                    </el-tooltip>
                                                </span>
                                                <span v-else-if="index === 7 || index === 8">
                                                    积分/USD
                                                </span>
                                                <span v-else-if="index === 10">
                                                    %
                                                </span>
                                                <span v-else-if="index === 11">
                                                    USD
                                                </span>
                                                <span v-else>积分</span>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </template>
                            </el-col>
                            <el-col :span="12">
                                <template v-for="(item, index) in dataPoint.pointForm">
                                    <h3 v-if="index === 12">
                                        评论行为奖励 
                                        <el-tooltip effect="dark" content="规则说明：该部分取评论系统中数据，如需配置请到评论系统中设置。" placement="top-start">
                                            <i class="el-icon-warning"></i>
                                        </el-tooltip>
                                    </h3>
                                    <el-form-item v-if="index > 11 && index < 21 && index !== 16 && index !== 17" :prop="'pointForm.' + index + '.attrValue'" :label="item.attrDesc">
                                        <el-row>
                                            <el-col :span="4">
                                                {{item.attrValue}}
                                            </el-col>
                                            <el-col :span="8" :offset="1">积分</el-col>
                                        </el-row>
                                    </el-form-item>
                                    <el-form-item v-if="index === 16" :prop="'pointForm.' + index + '.attrValue'" :label="'前' + item.attrValue + '位评论用户获得积分倍数'">
                                        <el-row>
                                            <el-col :span="4">
                                                {{dataPoint.pointForm[index + 1].attrValue}}
                                            </el-col>
                                            <el-col :span="4" :offset="1">倍</el-col>
                                            <el-col :span="14" :offset="1" class="color-silver">图片评论和文字评论都赠送多倍积分</el-col>
                                        </el-row>
                                    </el-form-item>
                                    <p class="text-limit" v-if="index === 21">单品价格少于1美元的商品，从评论获得的积分不能超过{{item.attrValue}}积分</p>
                                    <p class="text-limit" v-if="index === 22">单品价格少于5美元的商品，从评论获得的积分不能超过{{item.attrValue}}积分</p>
                                    <p class="text-limit" v-if="index === 23">单品价格少于10美元的商品，从评论获得的积分不能超过{{item.attrValue}}积分</p>
                                </template>
                                <div class="el-sub-container color-silver text-div">
                                    积分赠送条件： 先送文字积分、审核通过后送图片积分<br>
                                    是否发送评论邀请邮件： 是<br>
                                    评论获得积分后是否发送通知邮件： 否<br>
                                    视频评论被推荐是否发送通知邮件： 否
                                </div>
                            </el-col>
                        </el-row>
                        <el-form-item v-for="(item, index) in dataPoint.pointForm" :prop="'pointForm.' + index + '.attrValue'" :label="item.attrDesc" :key="index" :rules="[{ required: true, message: '请输入数值' }, { type: 'number', message: '请输入正确的数值' }]">
                            <el-row :gutter="10">
                                <el-col :span="3">
                                    <el-input type="text" v-model.number="item.attrValue" :readonly="dataPoint.options.isNotEdit"></el-input>
                                </el-col>
                                <el-col :span="2">
                                    <span v-if="item.attrName == 'login'">积分/天</span>
                                    <span v-else-if="item.attrName == 'orderDelivery' || item.attrName == 'pay'">积分/USD</span>
                                    <span v-else-if="item.attrName == 'evaluateUser'">倍</span>
                                    <span v-else-if="item.attrName == 'integralDisabled'">天</span>
                                    <span v-else>积分</span>
                                </el-col>
                                <el-col :span="18" class="col-last color-silver">
                                    <div v-if="item.attrName == 'tickets' || item.attrName == 'rma' || item.attrName == 'order'">请在框内填写0-9中的一个数字、对客服的处理速度进行优先级排序（0优先级最高）</div>
                                    <div v-else-if="item.attrName == 'login'">*一天（0-24点）登录一次记为一次签到，一天中只可签到一次 &nbsp; *平台：在PC,M,IOS,安卓设备中登录只有第一个设备的成长值有效</div>
                                    <div v-else-if="item.attrName == 'orderDelivery'">其他币种以美元为汇率基准，四舍五入，取整数， 若订单被取消则回滚赠送的这部分积分</div>
                                    <div v-else-if="item.attrName == 'evaluateUser'">前5条多倍积分限制条件： 图片评论和文字评论都赠送多倍积分</div>

                                    <div v-else-if="item.attrName == 'birthdayGift'">触发规则：达到该等级，则在用户中心填写的生日当月第一天0点发放COUPON（一个自然年只发放一次）</div>
                                    <div v-else-if="item.attrName == 'anniversaryGift'">触发规则：第二个账户周年开始时会享受账户周年礼，在账户周年日的当月第一天0点发放COUPON</div>
                                    <div v-else-if="item.attrName == 'gradeGift'">触发规则：到达该等级即可发放COUPON</div>
                                    <div v-else-if="item.attrName == 'shareGift'">触发规则：暂未定</div>
                                    <div v-else-if="item.attrName == 'integralLimit'">% &nbsp; &nbsp; 请在框内填写数字、最高限制为50%</div>
                                    <div v-else-if="item.attrName == 'integralGive'">请填写达到该等级赠送的积分数</div>
                                </el-col>
                            </el-row>
                            <el-row v-if="item.attrName == 'evaluateIntegral'">
                                <el-col>
                                    <div class="el-sub-container color-silver">积分赠送条件： 先送文字积分、审核通过后送图片积分<br>
                                        是否发送评论邀请邮件： 是<br>
                                        评论获得积分后是否发送通知邮件： 否<br>
                                        视频评论被推荐是否发送通知邮件： 否</div>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                    <div v-if="!dataPoint.options.isNotEdit || dataPoint.options.isLoading" class="el-sub-container text-center">
                        <el-button type="primary" @click="handleBtnSavePointClick" :loading="dataPoint.options.isLoading"><i class="el-icon-check"></i> 保存</el-button>
                        <el-button type="default" @click="handleBtnCancelPointClick" :disabled="dataPoint.options.isLoading">取消</el-button>
                    </div>
                </el-tab-pane> -->
            </el-tabs>
        </div>

        <!-- 弹窗S -->
        <el-dialog title="完善个人资料" v-model="dataGrowup.isMoreDlgShow" size="tiny">
            <el-form :model="dataGrowup" ref="growupMoreDlgForm" label-width="150px">
                <el-form-item v-for="(item, index) in dataGrowup.moreInfo" :label="item.attrDesc" :key="index" :rules="[{validator: checkGroupNum, trigger: 'blur'}]">
                    <el-row>
                        <el-col :span="6"><el-input type="number" v-model="item.attrValue" :readonly="dataGrowup.options.isNotEdit"></el-input></el-col>
                        <el-col :span="18">&nbsp; 成长值</el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div class="color-silver">***备注***根据网站实际情况进行调整，如TG站无first name和last name字段</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="dataGrowup.isMoreDlgLoading" @click="handleBtnSaveGrowupMoreDlgClick">确认</el-button>
                <el-button type="danger" @click="dataGrowup.isMoreDlgShow = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let tempForm = null;

        let checkNum = (rule, value, callback) =>{
            if (value === '0' || Number(value) > 0) {
                callback();
            } else {
                callback(new Error('该项必填，且为大于等于0的数字'))
            }
        }

        let numberRule = (rule, value, callback) =>{
            if (value && Number(value) > 0 || value == '0') {
                callback();
            } else {
                callback(new Error('请输入大于0的数字'))
            }
        }

        let checkGroupNum = (rule, value, callback) =>{
            let reg = /^\+?[1-9][0-9]*$/;
            if (reg.test(value) || value == '0') {
                callback();
            } else {
                callback(new Error('该项必填，且为大于等于0的数字'))
            }
        }

        return {
            checkNum: checkNum,
            checkGroupNum: checkGroupNum,
            isDataLoading: false,
            options: {
                tabActive: 'level-list',
                isNotEdit: true,
                tabs: {
                    'level-list': { isDataIninted: true },
                    'privileges': { isDataIninted: false }
                }
            },
            dataLevel: {
                tempForm: null,
                isEditNew: false,
                isShowNew: false,
                textOptions: {
                    standard: '达成所需成长值',
                    yearSubtract: '周年扣减成长值',
                    isPay: '是否付费',
                    sku: 'SKU',
                    inEffectDate: '付费用户生效天数',
                    description: '付费用户备注信息'
                },
                levels: [{
                    sku: '',
                    levelName: '',
                    isPay: '',
                    inEffectDate: '',
                    description: '',
                    yearSubtract: '',
                    standard: ''
                }],
                levelRules: {
                    levelName: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
                    standard: [{validator: numberRule, trigger: 'blur'}],
                    yearSubtract: [{validator: numberRule, trigger: 'blur'}],
                    inEffectDate: [{validator: numberRule, trigger: 'blur'}],
                    sku: [{ required: true, message: '请输入SKU', trigger: 'blur' }]
                }
            },

            // 成长值
            dataGrowup: {
                tempForm: null,
                tempInfo: [],
                options: {
                    isNotEdit: true,
                    isLoading: false
                },
                growupForm: [],
                growupRules: {},
                isMoreDlgShow: false,
                isMoreDlgLoading: false,
                moreInfo: [],
                indexPerfectGrowup: -1
                // moreDlg: {
                //     firstName: 0,
                //     lastName: 0,
                //     nickName: 3,
                //     gender: 2,
                //     birthday: 3,
                //     phone: 2
                // },
                // moreDlgRules: {}
            },

            // 会员特权
            dataPrivilege: {
                tempForm: null,
                options: {
                    isNotEdit: true,
                    isLoading: false,
                    selectedLevel: '1',
                    checkedAllService: false,
                    checkedAllDiscount: false
                },
                levels: {},
                itemGroup: [[], []],
                privilegeForm: {
                    // '1': {
                    //     tickets: {},
                    //     rma: {},
                    //     order: {},
                    //     birthdayGift: {},
                    //     anniversaryGift: {},
                    //     gradeGift: {},
                    //     shareGift: {},
                    //     integralLimit: {},
                    //     integralGive: {}
                    // }
                },
                privilegeRules: {}
            },

            //积分配置
            dataPoint: {
                tempForm: null,
                options: {
                    isNotEdit: true,
                    isLoading: false
                },
                pointForm: [],
                pointRules: {}
            }
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getData('level-list');
        },
        getData (name) {
            this.tableData = [];
            this.isDataLoading = true;
            this.$http.get('user/user-system/' + name).then(res => {
                // console.log(res.body)
                this.isDataLoading = false;
                if (res.body.code !== 0) {
                    this.$notify.error(res.body.message);
                    return;
                }
                if (name === 'level-list') {
                    this.dataLevel.levels = res.body.data;
                    // console.log(this.dataLevel.levels)
                } else if (name === 'privileges') {
                    this.dealPrivilegeData(res.body.data);
                } else if (name === 'point-setting') {
                    let temp = [];
                    let list = ['register', 'uploadIcon', 'email', 'login', 'orderDelivery', 'orderConfirmReceipt', 'refundToEwallet', 'withdrawFromEwallet', 'pay', 'minForCashLimit', 'integralLimit', 'maxForCashLimit', 'evaluateText', 'evaluateImage', 'evaluateVedio', 'evaluateImgVedio', 'evaluateUser', 'evaluatePoint', 'evaluateRecommand', 'evaluateIntegral', 'evaluateMyTicket', 'evaluatePrice0_1', 'evaluatePrice1_5', 'evaluatePrice5_10']
                    let data = res.body.data;
                    list.map(indexName => {
                        for (let i in data) {
                            if (data[i].attrName === indexName) {
                                temp.push(data[i]);
                                break;
                            }
                        }
                    });
                    this.dataPoint.pointForm = temp;
                } else if (name === 'growup-list') {
                    this.dataGrowup.growupForm = res.body.data;
                }
                // console.log(this.dataLevel)
            },
            (err) => {
                this.isDataLoading = false;
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getGrowupInfo (id, attrValue) {
            let params = { id, attrValue };
            this.$http.get('user/user-system/growup-info', { params: params }).then(res => {
                if (res.body.code !== 0) {
                    this.$notify.error(res.body.message);
                    return;
                }
                this.dataGrowup.moreInfo = [];
                res.body.data && res.body.data.forEach((item) => {
                    this.dataGrowup.moreInfo.push(item);
                });
                if (!this.dataGrowup.tempInfo.length) {
                    this.dataGrowup.tempInfo = JSON.parse(JSON.stringify(this.dataGrowup.moreInfo));
                }
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        handleTabClick (tab) {
            if (!this.options.tabs[tab.name]) {
                this.options.tabs[tab.name] = {};
                this.options.tabs[tab.name].isDataIninted = false;
            }
            if (!this.options.tabs[tab.name].isDataIninted) {
                this.getData(tab.name);
                this.options.tabs[tab.name].isDataIninted = true;
            }
        },

        // 等级设置
        handleBtnEditClick (event) {
            this.options.isNotEdit = false;
            this.dataLevel.tempForm = JSON.parse(JSON.stringify(this.dataLevel.levels));
        },
        handleAddClick () {
            this.dataLevel.isShowNew = true;
            this.dataLevel.isEditNew = true;
            this.dataLevel.levels.push({
                levelName: '',
                standard: 0,
                yearSubtract: 0,
                isPay: '',
                sku: '',
                inEffectDate: 0,
                description: '',
                isNew: true
            });
        },
        handleBtnSaveClick (event) {
            let changedItems = [];
            let hasError = false;
            // 检查等级名称是否已存在
            let levelNameArr = [];
            this.dataLevel.levels.forEach((item, i) => {
                levelNameArr.push(item.levelName);
            });
            levelNameArr.sort();
            for (let i = 0, len = levelNameArr.length; i < len; i++) {
                if (levelNameArr[i] === levelNameArr[i + 1]) {
                    this.$message.error('等级名称不能重复');
                    hasError = true;
                    break;
                }
            }
            if (hasError) {
                return;
            }
            this.dataLevel.levels.some((item, index) => {
                this.$refs['levelForm-' + index][0].validate((valid) => {
                    if (!valid) {
                        hasError = true;
                        return false;
                    }
                });
                if (hasError) {
                    return true;
                }
                if (JSON.stringify(item) != JSON.stringify(this.dataLevel.tempForm[index])) {
                    let obj = Object.assign({}, item);
                    delete obj.amount;
                    delete obj.createDate;
                    delete obj.delFlag;
                    delete obj.updateDate;
                    delete obj.isDefaultLevel;
                    changedItems.push(obj);
                }
            });
            if (hasError) {
                return;
            }
            if (!changedItems.length) {
                this.$message.info('没有数据改动，无需保存');
                this.options.isNotEdit = true;
                return;
            }
            // console.log(changedItems);
            // return;
            this.isDataLoading = true;
            this.$http.post('user/user-system/edit-level', { levelInnerReqs: changedItems }).then(res => {
                // console.log(res);
                this.isDataLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '保存出错');
                    return;
                }
                this.$message.success(res.body.message || '保存成功');
                this.options.isNotEdit = true;
                this.options.tabs['privileges'].isDataIninted = false;
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
                this.isDataLoading = false;
            });
        },
        handleBtnCancelClick (event) {
            this.options.isNotEdit = true;
            this.dataLevel.levels = this.dataLevel.tempForm;
            this.$nextTick(() => {
                Array.isArray(this.dataLevel.levels) && this.dataLevel.levels.forEach((item, index) => {
                    this.$refs['levelForm-' + index][0].validate();
                });
            });
        },
        handleNewSaveClick (index) {
            let hasError = false;
            // 检查等级名称是否已存在
            this.dataLevel.levels.some((item, i) => {
                if (index === i) {
                    return false;
                }
                if (item.levelName === this.dataLevel.levels[index].levelName) {
                    this.$message.error('等级名称不能重复');
                    hasError = true;
                    return true;
                }
            });
            if (hasError) {
                return;
            }
            this.$refs['levelForm-' + index][0].validate((valid) => {
                let params = Object.assign({}, this.dataLevel.levels[index]);
                delete params['isNew'];
                if (!valid) {
                    console.log('error submit!!');
                    return false;
                }
                // console.log(params);
                // return;
                this.isDataLoading = true;
                this.$http.post('user/user-system/add-level', params).then(res => {
                    // console.log(res);
                    this.isDataLoading = false;
                    if (res.body.code !== 0) {
                        this.$message.error(res.body.message || '发生错误');
                        return;
                    }
                    this.$message.success(res.body.message || '添加成功');
                    this.dataLevel.levels[index].isNew = false;
                    this.getData('level-list');
                    this.options.tabs['privileges'].isDataIninted = false;
                });
            });
            // this.dataLevel.isEditNew = false;
        },
        handleDelClick (level) {
            // console.log(level);
            if (!level.id && !level.isNew) {
                return;
            }
            this.$confirm('确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action !== 'confirm') {
                        done();
                        return;
                    }
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    if (level.isNew) {
                        this.dataLevel.levels.splice(this.dataLevel.levels.indexOf(level), 1);
                        done();
                        instance.confirmButtonLoading = false;
                        instance.confirmButtonText = '确定';
                        return;
                    }
                    this.$http.post('user/user-system/delete-level', { id: level.id }).then(res => {
                        // console.log(res);
                        done();
                        instance.confirmButtonLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message || '发生错误');
                            return;
                        }
                        this.$message.success(res.body.message);
                        this.dataLevel.levels.splice(this.dataLevel.levels.indexOf(level), 1);
                        this.options.tabs['privileges'].isDataIninted = false;
                    });
                }
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },

        // 成长值设置
        handleBtnEditGrowupClick () {
            this.dataGrowup.tempForm = JSON.parse(JSON.stringify(this.dataGrowup.growupForm));
            this.dataGrowup.tempInfo = JSON.parse(JSON.stringify(this.dataGrowup.moreInfo));
            this.dataGrowup.options.isNotEdit = false;
        },
        handleBtnCancelGrowupClick () {
            this.dataGrowup.growupForm = JSON.parse(JSON.stringify(this.dataGrowup.tempForm));
            this.dataGrowup.moreInfo = JSON.parse(JSON.stringify(this.dataGrowup.tempInfo));
            this.dataGrowup.options.isNotEdit = true;
            this.$nextTick(() => {
                this.$refs['growupForm'].validate();
            });
        },
        handleGrowupMoreClick (id, attrValue, index) {
            this.dataGrowup.isMoreDlgShow = true;
            this.dataGrowup.indexPerfectGrowup = index || -1;
            this.getGrowupInfo(id, attrValue);
        },
        handleBtnSaveGrowupMoreDlgClick () {
            let hasNoError = this.checkArrNumberic(this.dataGrowup.moreInfo);
            // console.log(hasNoError);
            if (!hasNoError) {
                this.$message.error('请输入正确的数值');
                return;
            }
            this.dataGrowup.isMoreDlgShow = false;
            if (this.dataGrowup.indexPerfectGrowup !== -1) {
                let sum = 0;
                for (let item in this.dataGrowup.moreInfo) {
                    // console.log()
                    sum += this.dataGrowup.moreInfo[item].attrValue - 0;
                }
                this.dataGrowup.growupForm[this.dataGrowup.indexPerfectGrowup].attrValue = sum < 0 ? 0 : sum;
            }
            // return;
            // this.dataGrowup.isMoreDlgLoading = true;
            // setTimeout(() => {
            //     this.dataGrowup.isMoreDlgLoading = false;
            //     this.dataGrowup.isMoreDlgShow = false;
            // }, 1000);

        },
        handleBtnSaveGrowupClick () {
            // console.log(this.dataGrowup.growupForm);
            let changedItems = [];
            let indexPerfectGrowup = -1;
            let indexPerfectGrowupChanged = -1;
            let hasError = false;
            this.dataGrowup.growupForm.some((item, index) => {
                let val = parseInt(item.attrValue);
                if (item.attrName === 'perfectGrowup') {
                    indexPerfectGrowup = index;
                }
                if (isNaN(val) || val < 0) {
                    hasError = true;
                    return true;
                }
                if (item.attrValue !== this.dataGrowup.tempForm[index].attrValue) {
                    let i = -1;
                    let obj = Object.assign({}, item);
                    delete obj.updateDate;
                    delete obj.createDate;
                    if (obj.attrValue == '' || obj.attrValue < 0) {
                        obj.attrValue = 0;
                    }
                    i = changedItems.push(obj);
                    if (item.attrName === 'perfectGrowup') {
                        indexPerfectGrowupChanged = i - 1;
                        obj.memGrowupSettingDetaillist = [];
                    }
                }
            });
            if (hasError) {
                return;
            }
            this.dataGrowup.moreInfo.forEach((item, index) => {
                if (item.attrValue !== this.dataGrowup.tempInfo[index].attrValue) {
                    let obj = Object.assign({}, item);
                    delete obj.createDate;
                    if (obj.attrValue == '' || obj.attrValue < 0) {
                        obj.attrValue = 0;
                    }
                    if (!changedItems.length) {
                        changedItems.push(Object.assign({}, this.dataGrowup.growupForm[indexPerfectGrowup], { memGrowupSettingDetaillist: [] }));
                        delete changedItems[0].updateDate;
                        delete changedItems[0].createDate;
                        indexPerfectGrowupChanged = 0;
                    }
                    changedItems[indexPerfectGrowupChanged].memGrowupSettingDetaillist.push(obj);
                }
            });
            if (!changedItems.length) {
                this.$message.info('没有数据改动，无需保存');
                this.dataGrowup.options.isNotEdit = true;
                return;
            }
            this.$refs['growupForm'].validate((valid) => {
                if (valid) {
                    // console.log(changedItems);
                    // return;
                    this.isDataLoading = true;
                    this.$http.post('user/user-system/growup-save', { memGrowupSettingList: changedItems }).then(res => {
                        // console.log(res);
                        this.isDataLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message || '保存出错');
                            return;
                        }
                        this.$message.success(res.body.message || '保存成功');
                        this.dataGrowup.options.isNotEdit = true;
                    },
                    (err) => {
                        this.$notify.error(err.body.message || '发生错误');
                        this.isDataLoading = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 会员特权设置
        dealPrivilegeData (data) {
            // console.log(data);
            this.dataPrivilege.itemGroup = [[], []];
            delete this.dataPrivilege.privilegeForm['1'];
            data.forEach((item) => {
                if (!this.dataPrivilege.privilegeForm[item.levelId]) {
                    this.$set(this.dataPrivilege.privilegeForm, item.levelId, {});
                }
                this.$set(this.dataPrivilege.privilegeForm[item.levelId], item.itemName, item);
                if (item.itemName !== 'tickets' && item.itemName !== 'rma' && item.itemName !== 'order') {
                    this.dataPrivilege.privilegeForm[item.levelId][item.itemName].itemValue -= 0;
                }
                this.dataPrivilege.itemGroup[item.type - 1].push(item.itemName);
            });
            this.dataPrivilege.options.selectedLevel = this.dataLevel.levels[0].id;
        },
        handleBtnEditPrivilegeClick (event) {
            // console.log(this.dataPrivilege.privilegeForm[this.dataPrivilege.options.selectedLevel])
            if (this.dataPrivilege.privilegeForm) {
                this.dataPrivilege.tempForm = JSON.parse(JSON.stringify(this.dataPrivilege.privilegeForm));
            } else {
                this.dataPrivilege.tempForm = {};
            }
            // this.dataPrivilege.tempForm = JSON.parse(JSON.stringify(this.dataPrivilege.privilegeForm[this.dataPrivilege.options.selectedLevel]));
            this.dataPrivilege.options.isNotEdit = false;
        },
        handleBtnCancelPrivilegeClick () {
            this.dataPrivilege.privilegeForm = JSON.parse(JSON.stringify(this.dataPrivilege.tempForm));
            this.dataPrivilege.options.isNotEdit = true;
        },
        handleCheckAllPrivilege (event, index) {
            let isChecked = event.target.checked;
            this.dataPrivilege.itemGroup[index].forEach((item) => {
                this.dataPrivilege.privilegeForm[this.dataPrivilege.options.selectedLevel][item].itemSelect = isChecked ? 1 : 0;
            });
        },
        handleCheckedChangePrivilege (event) {
            let _this = this;
            let checkedCount = 0;
            this.dataPrivilege.itemGroup[0].forEach(function(item) {
                checkedCount += _this.dataPrivilege.privilegeForm[_this.dataPrivilege.options.selectedLevel][item].itemSelect ? 1 : 0;
            });
            this.dataPrivilege.options.checkedAllService = checkedCount == this.dataPrivilege.itemGroup[0].length;
            checkedCount = 0;
            this.dataPrivilege.itemGroup[1].forEach(function(item) {
                checkedCount += _this.dataPrivilege.privilegeForm[_this.dataPrivilege.options.selectedLevel][item].itemSelect ? 1 : 0;
            });
            this.dataPrivilege.options.checkedAllDiscount = checkedCount == this.dataPrivilege.itemGroup[1].length;
        },
        handleBtnSavePrivilegeClick () {
            let changedItems = [];
            for (let item in this.dataPrivilege.privilegeForm) {
                for (let son in this.dataPrivilege.privilegeForm[item]) {
                    let tmp = this.dataPrivilege.privilegeForm[item][son];
                    // 仅提交改动项 暂时取消
                    // if (JSON.stringify(tmp) != JSON.stringify(this.dataPrivilege.tempForm[item][son])) {
                        let obj = {
                            id: tmp.id,
                            levelId: tmp.levelId,
                            type: tmp.type,
                            itemSelect: tmp.itemSelect,
                            itemName: tmp.itemName,
                            itemValue: tmp.itemValue,
                            itemRemark: tmp.itemRemark
                        }
                        changedItems.push(obj);
                    // }
                }
            }

            if (!changedItems.length) {
                this.$message.info('没有数据改动，无需保存');
                this.dataPrivilege.options.isNotEdit = true;
                return;
            }
            this.$refs['privilegeForm'].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    return false;
                }
                // console.log(changedItems);
                // return;
                this.dataPrivilege.options.isLoading = true;
                this.$http.post('user/user-system/privileges-save', { memLevelPrivilegeList: changedItems }).then(res => {
                    // console.log(res);
                    this.dataPrivilege.options.isLoading = false;
                    if (res.body.code !== 0) {
                        this.$message.error(res.body.message || '保存出错');
                        return;
                    }
                    this.$message.success(res.body.message || '保存成功');
                    this.dataPrivilege.options.isNotEdit = true;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                    this.dataPrivilege.options.isLoading = false;
                });
            });
        },

        // 积分设置
        handleBtnEditPointClick () {
            this.dataPoint.tempForm = JSON.parse(JSON.stringify(this.dataPoint.pointForm));
            this.dataPoint.options.isNotEdit = false;
        },
        handleBtnCancelPointClick () {
            this.dataPoint.pointForm = JSON.parse(JSON.stringify(this.dataPoint.tempForm));
            this.dataPoint.options.isNotEdit = true;
            this.$nextTick(() => {
                this.$refs['pointForm'].validate();
            });
        },
        handleBtnSavePointClick () {
            // console.log(this.dataPoint.pointForm);
            let changedItems = [];
            this.dataPoint.pointForm.forEach((item, index) => {
                // console.log(item, index);
                if (item.attrValue !== this.dataPoint.tempForm[index].attrValue) {
                    let obj = Object.assign({}, item);
                    delete obj['updateDate'];
                    delete obj['createDate'];
                    changedItems.push(obj);
                }
            });
            if (!changedItems.length) {
                this.$message.info('没有数据改动，无需保存');
                this.dataPoint.options.isNotEdit = true;
                return;
            }
            this.$refs['pointForm'].validate((valid) => {
                if (valid) {
                    // console.log('ok');
                    // return;
                    this.isDataLoading = true;
                    this.$http.post('user/user-system/save-point-setting', { pointsSettingInnerReqs: changedItems }).then(res => {
                        // console.log(res);
                        this.isDataLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message || '保存出错');
                            return;
                        }
                        this.$message.success(res.body.message || '保存成功');
                        this.dataPoint.options.isNotEdit = true;
                    },
                    (err) => {
                        this.$notify.error(err.body.message || '发生错误');
                        this.isDataLoading = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 对象值是否为数字
        checkArrNumberic (arr) {
            let isNumber = true;
            for (let index = 0, len = arr.length; index < len; index++) {
                let str = String(arr[index].attrValue);
                // console.log(obj[item])
                if (str == '0' || str == '') {
                    continue;
                }
                if (!/^\+?[1-9][0-9]*$/.test(arr[index].attrValue)) {
                    isNumber = false;
                    break;
                }
            }
            return isNumber;
        }

    }
}
</script>
<style lang="less">
.ipt-level-name input {
    &::-webkit-input-placeholder { font-size: 14px; }
    &::-moz-placeholder { font-size: 14px; }
    &:-ms-input-placeholder { font-size: 14px; }
}
.box-card-wrap { display: flex; flex-wrap: wrap;
    .box-add { min-height: 200px;
        div { position: absolute; top: 0; right: 0; bottom: 0; left: 0; cursor: pointer; }
        i { position: absolute; top: 50%; left: 0; width: 100%; margin-top: -25px; text-align: center; font-size: 50px; }
    }
}

.pointForm {
    h3 {
        padding: 10px 100px;
    }

    .text-div {
        padding-left: 100px
    }

    .text-limit {
        color: #48576a;
        padding: 11px 12px 11px 100px;
    }
}

.box-card { flex: 0; min-width: 300px; margin: 0 20px 20px 0; position: relative;
    .item-name { margin-top: -65px;
        > div { margin-left: 0 !important; }
        .el-input input { max-width: 70%; margin: 0 auto; text-align: center; font-size: 18px; }
        .el-form-item__error { top: 130%; left: 40px; }
    }
    .el-input input[readonly],
    .el-textarea textarea[readonly] { border: none; }
    .el-textarea { vertical-align: top;
        textarea { padding-top: 9px; font: 13px Arial; resize: none; }
    }
    .el-col { line-height: 30px; }
    .item { margin-bottom: 0; padding: 7px 0; }
    .actions { position: absolute; top: -10px; right: -20px;
        .el-button { margin-left: 0; padding: 10px 5px; }
    }
}
.privileges {
    .row-all { margin-top: 20px; position: relative;
        .item-name { margin-left: -56px; padding-right: 10px; color: #48576a; }
    }
    .el-checkbox__input.is-disabled+.el-checkbox__label { color: #333; }
    .el-form-item__error { margin-left: 12.5%; }
}
.growup {
    .form-info { width: 300px; text-align: right; }
}
</style>