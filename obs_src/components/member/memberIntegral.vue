
<template>
    <!-- 会员积分 -->
    <div>
        <div class="el-container">
            <el-tabs v-model="options.tabActive" v-loading="dataLoading" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="积分规则" name="rule">

                    <el-form inline :model="rule.fliter" ref="ruleSearchForm">
                        <el-form-item label="积分项目">
                            <el-select v-model="rule.fliter.preItemId" clearable placeholder="请选择" @change="changeFilterPreName">
                                <el-option v-for="(item, index) in pointsItems" :label="item.description" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-select v-model="rule.fliter.itemId" :disabled="!rule.fliter.preItemId" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in ruleNames" :label="item.description" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="积分类型">
                            <el-select v-model="rule.fliter.type" clearable placeholder="请选择">
                                <el-option label="赠送" :value="1"></el-option>
                                <el-option label="扣减" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="周期">
                            <el-select v-model="rule.fliter.period" clearable placeholder="请选择">
                                <el-option label="一次性" :value="1"></el-option>
                                <el-option label="每天一次" :value="2"></el-option>
                                <el-option label="不限制" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="针对人群">
                            <el-select v-model="rule.fliter.applyUser" clearable placeholder="请选择">
                                <el-option v-for="item in applyUsers" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="" v-show="rule.fliter.applyUser === 2">
                            <el-radio-group v-model="rule.fliter.userType">
                                <el-radio v-for="(item, index) in newOrOldList" :label="index" :key="index">{{item}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="" v-show="rule.fliter.applyUser === 3">
                            <el-checkbox-group v-model="rule.fliter.userLevel">
                                <el-checkbox v-for="item in levels" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="" v-show="rule.fliter.applyUser === 4">
                            <el-select v-model="rule.fliter.userTags" multiple filterable remote :remote-method="remoteSearch" placeholder="请选择">
                                <el-option
                                    v-for="item in tags"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>


                        <el-form-item>
                            <el-button type="primary" @click="getRuleData('rule', 1)"><i class="el-icon-search"></i> 筛选</el-button>
                            <el-button type="primary" @click="createRule('rule')"><i class="el-icon-plus"></i>创建规则</el-button>
                        </el-form-item>
                    </el-form>  

                    <el-table :data="rule.tableData" border :default-sort = "{prop: 'updateDate', order: 'descending'}" style="width: 100%">
                        <el-table-column prop="itemDesc" label="规则名目"></el-table-column>
                        <el-table-column prop="preItemDesc" label="积分项目"></el-table-column>
                        <el-table-column label="积分类型">
                            <template scope="scope">
                                {{ scope.row.type === 1 ? '赠送' : '扣减' }}
                            </template>   
                        </el-table-column>
                        <el-table-column label="针对人群">
                            <template scope="scope">{{scope.row.applyUserName.join(',')}}</template>
                        </el-table-column>
                        <el-table-column label="周期">
                            <template scope="scope">
                                <template v-if="scope.row.period === 1">一次性</template>
                                <template v-if="scope.row.period === 2">每天一次</template>
                                <template v-if="scope.row.period === 3">不限制</template>
                            </template>
                        </el-table-column>
                        <el-table-column  label="有效期">
                            <template scope="scope">
                                {{ scope.row.isDefaultEffect === 1 ? '默认有效期' : scope.row.effectiveDay ? scope.row.effectiveDay + '天' : '' }}
                            </template>   
                        </el-table-column>
                        <el-table-column prop="value" label="数值"></el-table-column>
                        <el-table-column prop="priority" label="优先级" sortable></el-table-column>
                        <el-table-column label="最后编辑时间">
                            <template scope="scope">
                                {{ scope.row.updateDate ? timeZone_(scope.row.updateDate, $store.getters.getTimeZone) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="创建人"></el-table-column>
                        <!-- self.showAction_权限需要修改 -->
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button v-if="showAction_('user/index/to-edit-point-rule')" type="text" @click="handleBtnEditClick(scope.row, 'rule')">编辑</el-button> &nbsp;
                                <el-button v-if="showAction_('user/index/delete-point-rule')" type="text" @click="handleBtnDelClick(scope.row, 'rule')">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'rule')" @current-change="changePage($event, 'rule')" :current-page="rule.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="rule.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rule.pagination.totalCount"></el-pagination>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="积分限制" name="limit">

                    <el-form inline :model="limit.fliter" ref="limitSearchForm">
                        <el-form-item label="针对人群">
                            <el-select v-model="limit.fliter.applyUser" clearable placeholder="请选择">
                                <el-option v-for="item in applyUsers" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="" v-show="limit.fliter.applyUser === 2">
                            <el-radio-group v-model="limit.fliter.userType">
                                <el-radio v-for="(item, index) in newOrOldList" :label="index" :key="index">{{item}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="" v-show="limit.fliter.applyUser === 3">
                            <el-checkbox-group v-model="limit.fliter.userLevel">
                                <el-checkbox v-for="item in levels" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="" v-show="limit.fliter.applyUser === 4">
                            <el-select v-model="limit.fliter.userTags" multiple filterable remote :remote-method="remoteSearch" placeholder="请选择">
                                <el-option
                                    v-for="item in tags"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="getRuleData('limit', 1)"><i class="el-icon-search"></i> 筛选</el-button>
                            <el-button type="primary" @click="createRule('limit')"><i class="el-icon-plus"></i>创建规则</el-button>
                        </el-form-item>
                    </el-form>  

                    <el-table :data="limit.tableData" border :default-sort = "{prop: 'lastEditTime', order: 'descending'}" style="width: 100%">
                        <el-table-column label="针对人群">
                            <template scope="scope">
                                {{ scope.row.applyUserName.join(',')}}
                            </template>
                        </el-table-column>
                        <el-table-column label="限制条件">
                            <template scope="scope">
                                积分使用门槛{{ scope.row.minForCashLimit }}point，积分最大使用百分比 {{ scope.row.integralLimit }}%，积分最大使用限额{{ scope.row.maxForCashLimit }}USD
                            </template>
                        </el-table-column>
                        <el-table-column prop="priority" label="优先级" sortable></el-table-column>
                        <el-table-column label="最后编辑时间">
                            <template scope="scope">
                                {{ scope.row.updateDate ? timeZone_(scope.row.updateDate, $store.getters.getTimeZone) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="创建人"></el-table-column>
                        <!-- self.showAction_权限需要修改 -->
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button v-if="showAction_('user/index/to-edit-point-limit')" type="text" @click="handleBtnEditClick(scope.row, 'limit')">编辑</el-button> &nbsp;
                                <el-button v-if="showAction_('user/index/delete-point-limit')" type="text" @click="handleBtnDelClick(scope.row, 'limit')">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'limit')" @current-change="changePage($event, 'limit')" :current-page="limit.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="limit.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="limit.pagination.totalCount"></el-pagination>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="基础配置" name="config">
                    <div class="el-sub-container">
                        <el-button v-if="showAction_('user/user-system/save-point-setting')" type="primary" @click="handleBtnEditPointClick" :disabled="!dataPoint.isNotEdit || dataPoint.isLoading"><i class="el-icon-edit"></i> 编辑全部</el-button>
                    </div>
                    <el-form :model="dataPoint" v-if="dataPoint.pointform.length > 0"  ref="pointForm" class="pointForm" label-position="left">
                        <template v-for="(item, index) in dataPoint.pointform">
                            <h3 v-if="index === 0">积分兑换比</h3>
                            <el-form-item v-if="index === 0" :label="item.attrDesc" :key="item.attrName" :prop="'pointform.' + index + '.attrValue'" label-width="100px" :rules="{ validator: checkInteger, trigger: 'blur,change' }">
                                <el-input v-model="item.attrValue" class="point-input" :disabled="dataPoint.isNotEdit"></el-input>
                                <span>积分/USD</span>
                            </el-form-item>
                            <h3 v-if="index === 1">
                                评论行为奖励规则
                                <el-tooltip class="item" effect="dark" placement="right-start">
                                    <div slot="content">1.若订单被取消则回滚赠送的这部分积分；<br/>2.此处展示评论系统的配置数据，通过接口调取评论系统配置数值。</div>
                                    <i class="el-icon-warning"></i>
                                </el-tooltip>
                            </h3>
                        </template>

                        <el-row :gutter="20">
                            <el-col :span="12">
                                <template v-for="(item, index) in dataPoint.pointform">
                                    <el-form-item v-if="index > 0 && index < 10 && index !== 5 && index !== 9" :key="item.attrName" :prop="'pointform.' + index + '.attrValue'" :label="index === 6 ? ('前' + dataPoint.pointform[5].attrValue + '位评论用户获得积分倍数') : item.attrDesc" label-width="250px">
                                        <el-input v-model="item.attrValue" class="point-input" :disabled="true"></el-input>
                                        <span v-if="index !==6 ">积分</span>
                                        <span v-else>倍</span>
                                    </el-form-item>
                                </template>
                            </el-col>
                            <el-col :span="12">
                                <template v-for="(item, index) in dataPoint.pointform">
                                    <el-form-item v-if="index >= 10"  label="" :key="item.attrName" :prop="'pointform.' + index + '.attrValue'">
                                        <span>{{item.attrDesc}}</span>
                                        <el-input v-model="item.attrValue" class="point-input" :disabled="true"></el-input>
                                        <span>积分</span>
                                    </el-form-item>
                                </template>                            
                            </el-col>
                        </el-row>
                    </el-form>

                    <div class="el-sub-container text-center" v-show="!dataPoint.isNotEdit">
                        <el-button v-if="showAction_('user/user-system/save-point-setting')" type="primary" size="large" @click="handleBtnSubmitPointClick"> 保存</el-button>
                        <el-button v-if="showAction_('user/user-system/save-point-setting')" type="danger" size="large" @click="handleBtnCancelPointClick" >取消</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 积分规则创建/编辑 -->
        <el-dialog :title="rule.ruleDlg.isEdit ? '编辑规则' : '创建规则'" v-model="rule.ruleDlg.isDlgShow"  size="tiny">
            <el-form :model="rule.ruleDlg" ref="ruleDlgForm" :rules="rules" label-width="100px">
                <el-form-item label="积分项目：" prop="preItemId">
                    <el-select v-model="rule.ruleDlg.preItemId" :disabled="rule.ruleDlg.isEdit ? true : false"  placeholder="请选择积分项目" @change="changeDialogPreName">
                        <el-option v-for="(item, index) in pointsItems" :label="item.description" :value="String(item.id)" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则名目：" prop="itemId">
                    <el-select v-model="rule.ruleDlg.itemId" :disabled="(rule.ruleDlg.isEdit || !rule.ruleDlg.preItemId) ? true : false"  placeholder="请选择规则项目" @change="changeDialogRuleNames">
                        <el-option v-for="(item, index) in dialogRuleNames" :label="item.description" :value="String(item.id)" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="积分类型" prop="type">
                    <el-radio-group v-model="rule.ruleDlg.type">
                        <el-radio :label="1">赠送</el-radio>
                        <el-radio :label="2" :disabled="rule.ruleDlg.preItemId == 2">扣减</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="周期：">
                    <el-select v-model="rule.ruleDlg.period" placeholder="请选择周期">
                        <el-option label="一次性" :value="1"></el-option>
                        <el-option label="每天一次" :value="2"></el-option>
                        <el-option label="不限制" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="针对人群：">
                    <el-select v-model="rule.ruleDlg.applyUser" placeholder="请选择针对人群">
                        <el-option v-for="item in applyUsers" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-show="rule.ruleDlg.applyUser === 2" prop="userType" :rules="rule.ruleDlg.applyUser === 2 ? [{ required: true, message: '请选择新老用户', trigger: 'change'}] : []">
                    <el-radio-group v-model="rule.ruleDlg.userType">
                        <el-radio v-for="(item, index) in newOrOldList" :label="String(index)" :key="index">{{item}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" v-show="rule.ruleDlg.applyUser === 3"  prop="userLevel" :rules="rule.ruleDlg.applyUser === 3 ? [{ type: 'array', required: true, message: '请至少选择一个会员等级', trigger: 'change' }] : []">
                    <el-checkbox-group v-model="rule.ruleDlg.userLevel">
                        <el-checkbox v-for="item in levels" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="" v-show="rule.ruleDlg.applyUser === 4" prop="userTags" :rules="rule.ruleDlg.applyUser === 4 ? [{ type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }] : []">
                    <el-select v-model="rule.ruleDlg.userTags" multiple filterable remote :remote-method="remoteSearch" placeholder="请选择">
                        <el-option
                            v-for="item in tags"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数值：" prop="value">
                    <el-input v-model.number="rule.ruleDlg.value" type="number" placeholder="请输入对应条件数值">
                        <!-- 电子钱包、购物行为，该值是比例 -->
                        <template slot="append">{{unit === 1 ? 'point' : 'point/USD' }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="有效期：" v-if="rule.ruleDlg.type == 1">
                    <el-row :gutter="20" class="el-row-form">
                        <el-col :span="8">
                            <el-select v-model="rule.ruleDlg.isDefaultEffect">
                                <el-option label="默认有效期" :value="1"></el-option>
                                <el-option label="触发计时" :value="0"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="16" class="el-col-form">
                            <el-form-item label="" v-if="rule.ruleDlg.isDefaultEffect === 0"  prop="effectiveDay" :rules="rule.ruleDlg.isDefaultEffect === 0 ? [{ validator: checkInteger, trigger: 'blur' }] : []">
                                <el-input v-model.number="rule.ruleDlg.effectiveDay">
                                    <template slot="append">天</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item label="优先级：" prop="priority">
                    <el-input v-model.number="rule.ruleDlg.priority" type="number" placeholder="同一规则名目优先级不能重复"></el-input>
                    <div class="color-silver">当用户从属同一规则名目多个数据中，取优先级最高规则！</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="rule.ruleDlg.isLoading" @click="handleBtnCreateRuleClick">保存</el-button>
                <el-button @click="rule.ruleDlg.isDlgShow = false">取消</el-button>
            </span>
        </el-dialog>
         <!-- 积分规则创建/编辑 -->

         <!-- 积分限制创建/编辑 -->
        <el-dialog :title="limit.limitDlg.isEdit ? '编辑限制' : '创建限制'" v-model="limit.limitDlg.isDlgShow"  size="tiny">
            <el-form :model="limit.limitDlg" ref="limitDlgForm" :rules="limitRules"  label-width="130px">

                <el-form-item label="使用门槛：" prop="minForCashLimit">
                    <el-input v-model.number="limit.limitDlg.minForCashLimit" type="number">
                        <template slot="append">积分</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="最大使用百分比：" prop="integralLimit">
                    <el-input v-model.number="limit.limitDlg.integralLimit" type="number">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="最大使用限额：" prop="maxForCashLimit">
                    <el-input v-model.number="limit.limitDlg.maxForCashLimit" type="number">
                        <template slot="append">USD</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="针对人群：">
                    <el-select v-model="limit.limitDlg.applyUser" placeholder="请选择针对人群">
                        <el-option v-for="item in applyUsers" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-show="limit.limitDlg.applyUser === 2" prop="userType" :rules="limit.limitDlg.applyUser === 2 ? [{ required: true, message: '请选择新老用户', trigger: 'change, blur'}] : []">
                    <el-radio-group v-model="limit.limitDlg.userType">
                        <el-radio v-for="(item, index) in newOrOldList" :label="String(index)" :key="index">{{item}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" v-show="limit.limitDlg.applyUser === 3"  prop="userLevel" :rules="limit.limitDlg.applyUser === 3 ? [{ type: 'array', required: true, message: '请至少选择一个会员等级', trigger: 'change, blur' }] : []">
                    <el-checkbox-group v-model="limit.limitDlg.userLevel">
                        <el-checkbox v-for="item in levels" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="" v-show="limit.limitDlg.applyUser === 4" prop="userTags" :rules="limit.limitDlg.applyUser === 4 ? [{ type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change, blur' }] : []">
                    <el-select v-model="limit.limitDlg.userTags" multiple filterable remote :remote-method="remoteSearch" placeholder="请选择">
                        <el-option
                            v-for="item in tags"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="优先级：" prop="priority">
                    <el-input v-model.number="limit.limitDlg.priority" type="number" placeholder="同一规则名目优先级不能重复"></el-input>
                    <div class="color-silver">当用户从属同一规则名目多个数据中，取优先级最高规则！</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="limit.limitDlg.isLoading" @click="handleBtnCreateLimitClick">保存</el-button>
                <el-button @click="limit.limitDlg.isDlgShow = false">取消</el-button>
            </span>
        </el-dialog>
         <!-- 积分限制创建/编辑 -->
         
    </div>
</template>

<script>
import httpGet from '@/common/baseApi'
const ruleDlgOptions = {
    isEdit: false,
    isDlgShow: false,
    isLoading: false,
    id: 0,
    preItemId: '', //积分项目
    itemId: '', // 规则名目
    type: 1, // 积分类型
    period: 1, // 周期
    applyUser: 1, // 针对人群
    applyUserKey: [], //针对人群选项的key值
    value: '', // 数值
    isDefaultEffect: 1, //有效期
    effectiveDay: '', //有效期天数
    priority: '', // 优先级
    userType: '', // 针对人群（新老用户）
    userLevel: [], // 针对人群(用户等级)
    userTags: [] // 针对人群（用户标签）
}

const limitDlgOptions = {
    isEdit: false,
    isDlgShow: false,
    isLoading: false,
    id: 0,
    applyUser: 1, // 针对人群
    applyUserKey: [], //针对人群选项的key值
    priority: '', // 优先级
    minForCashLimit: 1, // 使用门槛
    integralLimit: '', // 最大使用百分比
    maxForCashLimit: '', // 最大限额
    userType: '', // 针对人群（新老用户）
    userLevel: [], // 针对人群(用户等级)
    userTags: [] // 针对人群（用户标签）
}
export default {
    data() {
        let numberRule = (rule, value, callback) =>{
            if (!value && value != '0') {
                return callback(new Error('数字不能为空'));
            }        
            if (value && Number(value) > 0 || value == '0') {
                return callback();
            } else {
                return callback(new Error('请输入大于0的数字'));
            }
        }

        let checkPriority = (rule, value, callback) => {
            if (!value && value != '0') {
                return callback(new Error('数字不能为空'));
            }    
            let reg = /^[0-9]*[1-9][0-9]*$/;
            if (reg.test(value)) {
                // 同一条规则名目下，优先级需要校验唯一,需要异步验证
                // console.log(this.options)
                return callback();
            } else {
                return callback(new Error('该项必填，且为正整数'));
            }

        }

        let checkInteger = (rule, value, callback) => {
            let reg = /^[0-9]*[1-9][0-9]*$/;
            if (reg.test(value)) {
                return callback();
            } else {
                return callback(new Error('该项必须为正整数'));
            }
        }

        let checkPercentage = (rule, value, callback) => {
            let reg = /^[0-9]*[1-9][0-9]*$/;
            if (reg.test(value)) {
               if(value > 50) {
                   return callback(new Error('最大值为50'));
               } else {
                   return callback();
               }
            } else {
                return callback(new Error('该项必须为正整数'));
            }
        }

        return {
            options: {
                tabActive: "rule"
            },
            unit: 1,
            tags: [],
            tagsTemp: [],
            applyUsers: [],
            levels: [],
            newOrOldList: [],
            rules: {
                preItemId: [
                    { required: true, message: '请选择积分项目', trigger: 'change,blur' }
                ],
                itemId: [
                    { required: true, message: '请选择规则项目', trigger: 'change,blur' }
                ],
                type: [
                    { required: true, message: '请选择积分类型' }
                ],
                value: [
                    { required: true, validator: checkInteger, trigger: 'blur' }
                ],
                priority: [
                    { required: true, validator: checkPriority, trigger: 'blur' }
                ]
            },
            limitRules: {
                minForCashLimit: [
                    {required: true, validator: checkInteger, trigger: 'blur' }
                ],
                maxForCashLimit: [
                    {required: true, validator: checkInteger, trigger: 'blur' }
                ],
                integralLimit: [
                    {required: true, validator: checkPercentage, trigger: 'blur' }
                ],
                priority: [
                    {required: true, validator: checkPriority, trigger: 'blur' }
                ]
            },
            checkInteger: checkInteger,
            dataLoading: false,
            pointsItems: [],
            ruleNames: [],
            dialogRuleNames: [],
            tempRuleNames: [],
            rule: {
                fliter: {
                    preItemId: '', //积分项目
                    itemId: '', // 规则名目
                    type: "", // 积分类型
                    applyUser: "", // 针对人群
                    applyUserKey: [], // 针对人群选项的key值
                    userType: '', // 针对人群（新老用户）
                    userLevel: [], // 针对人群(用户等级)
                    userTags: [], // 针对人群（用户标签）
                    period: "" // 周期
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                ruleDlg: JSON.parse(JSON.stringify(ruleDlgOptions)),
                tableData: []
            },
            limit: {
                fliter: {
                    applyUser: "", // 针对人群
                    applyUserKey: [], // 针对人群选项的key值
                    userType: '', // 针对人群（新老用户）
                    userLevel: [], // 针对人群(用户等级)
                    userTags: [] // 针对人群（用户标签）
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                limitDlg: JSON.parse(JSON.stringify(limitDlgOptions)),
                tableData: []
            },
            dataPoint: {
                isNotEdit: true,
                isLoading: false,
                pointform: [],
                tempForm: null,
            }
        };
    },
    created() {
        this.getRuleData('rule');
        this.getRuleData('limit');
        this.getPointRuleList();
        this.getApplyUserList();
        this.getPointSetting();
    },
    methods: {
        // 获取积分配置信息
        getPointSetting() {
            this.$http.get('user/user-system/point-setting').then((res) => {
                if (res.body.code !== 0) {
                    return;
                }
                this.dataPoint.pointform = res.body.data;
            });
        },
        // 获取针对人群信息
        getApplyUserList() {
            this.$http.get('user/index/apply-user').then((res) => {
                if (res.body.code !== 0) {
                    return;
                }
                this.tags = this.tagsTemp = this.getArray(res.body.data.labelMap);
                this.applyUsers = this.getArray(res.body.data.applyUser);
                this.levels = this.getArray(res.body.data.levelMap);
                this.newOrOldList = res.body.data.newOrOldMap;
            });
        },
        // 对象装换成数组
        getArray(obj) {
            let arr = [];
            for(let i in obj){
                arr.push({ label: obj[i], value: Number(i) });
            }
            return arr;
        },
        // 获取积分名目与规则
        getPointRuleList() {
            this.$http.get('user/index/point-rule-list').then((res) => {
                if (res.body.code !== 0) {
                    return;
                }
                this.pointsItems = res.body.data.preItemList;
                // console.log(this.pointsItems)
                this.tempRuleNames = this.dialogRuleNames = this.ruleNames = res.body.data.itemList;
            });  
        },
        // tab切换
        handleTabClick(tab) {
            this.getRuleData(tab.name);
        },
        // 获取积分规则、积分限制列表
        getRuleData(name, page) {
            switch (name) {
                case 'rule':
                    let params = {};
                    if (page) {
                        this.rule.pagination.pageNo = page;
                    }
                    params = Object.assign({}, this.rule.pagination, this.rule.fliter);
                    switch(params.applyUser) {
                        case 2:
                            if(params.userType || params.userType === 0) {
                                params.applyUserKey = [params.userType];
                            }
                        break;
                        case 3: 
                            params.applyUserKey = params.userLevel;
                        break;
                        case 4: 
                            params.applyUserKey = params.userTags;
                        break;
                    }
                    params.siteCode = this.$store.getters.getSite || '';
                    delete params.totalCount;
                    delete params.userType;
                    delete params.userLevel;
                    delete params.userTags;
                    this.dataLoading = true;
                    this.$http.get('user/index/point-rule', {params: params}).then(res => {
                        this.dataLoading = false;
                        if (res.body.code !== 0) {
                            this.$notify.error(res.body.message || '发生错误');
                            return;
                        }
                        this.rule.tableData = res.body.data.list || [];
                        this.rule.pagination.totalCount = res.body.data.totalCount;
                    },
                    (err) => {
                        this.$notify.error(err.body.message || '发生错误');
                        this.dataLoading = false;
                    });
                break;
                case 'limit':
                    let limitParams = {};
                    if (page) {
                        this.limit.pagination.pageNo = page;
                    }
                    limitParams = Object.assign({}, this.limit.pagination, this.limit.fliter);
                    switch(limitParams.applyUser) {
                        case 2:
                            if(limitParams.userType || limitParams.userType === 0) {
                                limitParams.applyUserKey = [limitParams.userType];
                            }
                        break;
                        case 3: 
                            limitParams.applyUserKey = limitParams.userLevel;
                        break;
                        case 4: 
                            limitParams.applyUserKey = limitParams.userTags;
                        break;
                    }
                    delete limitParams.totalCount;
                    delete limitParams.userType;
                    delete limitParams.userLevel;
                    delete limitParams.userTags;
                    this.dataLoading = true;
                    this.$http.get('user/index/point-limit', {params: limitParams}).then(res => {
                        this.dataLoading = false;
                        if (res.body.code !== 0) {
                            this.$notify.error(res.body.message || '发生错误');
                            return;
                        }
                        this.limit.tableData = res.body.data.list || [];
                        this.limit.pagination.totalCount = res.body.data.totalCount;
                    },
                    (err) => {
                        this.$notify.error(err.body.message || '发生错误');
                        this.dataLoading = false;
                    });

                break;
            }
        },
        // 帅选条件，积分规则联动
        changeFilterPreName(val) {
            this.changePreName(val, 1);
        },
        // 弹窗时，帅选条件，积分规则联动
        changeDialogPreName(val) {
            if(val == 2) {
                this.rule.ruleDlg.type = 1;
            }
            this.changePreName(val, 2);
        },
        // 联动处理函数
        changePreName(val, flag) {
            const ruleNames = this.tempRuleNames.filter((item) => {
                return item.parent && item.parent == val;
            });    
            if(flag === 1){
                this.ruleNames = ruleNames;
                this.rule.fliter.itemId = "";
            } else {
                this.dialogRuleNames = ruleNames;
                this.rule.ruleDlg.itemId = "";
            }
        },
        // 修改每页页数
        changePageSize(val, name) {
            switch (name) {
                case 'rule':
                    this.rule.pagination.pageSize = val;
                    this.rule.pagination.pageNo = 1;
                break;
                case 'limit':
                    this.limit.pagination.pageSize = val;
                    this.rule.pagination.pageNo = 1;
                break;
            }
            this.getRuleData(this.options.tabActive);
        },
        // 修改当前页
        changePage(val, name) {
            switch (name) {
                case 'rule':
                    this.rule.pagination.pageNo = val;
                break;
                case 'limit':
                    this.limit.pagination.pageNo = val;
                break;
            }
            this.getRuleData(this.options.tabActive);
        },
        // 积分规则、积分限制编辑函数
        handleBtnEditClick(row, name) {
            switch (name) {
                case 'rule':
                    this.$http.get('user/index/to-edit-point-rule', {params: { id: row.id }}).then((res) => {
                        if (res.body.code !== 0) {
                            return;
                        }
                        this.resetRuleOptions(res.body.data);
                    });    
                break;
                case 'limit':
                    this.$http.get('user/index/to-edit-point-limit', {params: { id: row.id }}).then((res) => {
                        if (res.body.code !== 0) {
                            return;
                        }
                        this.resetLimitOptions(res.body.data);
                    });    
                break;
            }
        },
        // 积分规则、积分限制删除函数
        handleBtnDelClick(row, name) {
            switch (name) {
                case 'rule':
                    this.$confirm('执行删除操作后，该规则将不再生效，是否还要继续删除操作？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http.get('user/index/delete-point-rule', {params: { id: row.id }}).then((res) => {
                            if (res.body.code !== 0) {
                                this.$message.error(res.body.message);
                                return;
                            }
                            this.getRuleData('rule');
                            this.$message.success(res.body.message);
                        });  
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });                    
                break;
                case 'limit':
                    this.$confirm('执行删除操作后，该限制将不再生效，是否还要继续删除操作？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http.get('user/index/delete-point-limit', {params: { id: row.id }}).then((res) => {
                            if (res.body.code !== 0) {
                                this.$message.error(res.body.message);
                                return;
                            }
                            this.getRuleData('limit');
                            this.$message.success(res.body.message);
                        });  
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });                    
                break;
            }
        },
        // 重置积分规则表单项
        resetRuleOptions(row) {
            if(row) {
                console.log(row)
                this.rule.ruleDlg.isEdit = true;
                this.rule.ruleDlg.preItemId = String(row.preItemId);
                this.rule.ruleDlg.type = row.type;
                this.rule.ruleDlg.period = row.period;
                this.rule.ruleDlg.applyUser = row.applyUser;
                this.rule.ruleDlg.applyUserKey = row.applyUserKey;
                this.rule.ruleDlg.value = row.value;
                this.rule.ruleDlg.isDefaultEffect = row.isDefaultEffect;
                this.rule.ruleDlg.effectiveDay = row.effectiveDay;
                this.rule.ruleDlg.priority = row.priority;
                this.rule.ruleDlg.id = row.id;
                if(row.applyUser === 2){
                    this.rule.ruleDlg.userType = String(row.applyUserKey[0]);
                } else if(row.applyUser === 3) {
                    this.rule.ruleDlg.userLevel = row.applyUserKey;
                } else if(row.applyUser === 4){
                    this.rule.ruleDlg.userTags = row.applyUserKey;
                }
                this.$nextTick(() => {
                   this.rule.ruleDlg.itemId = String(row.itemId);
                   this.rule.ruleDlg.isDlgShow = true;
                });
            } else {
                this.rule.ruleDlg = Object.assign({}, this.rule.ruleDlg, ruleDlgOptions);
            }
        },
        // 重置积分限制表单项
        resetLimitOptions(row) {
            if(row) {
                this.limit.limitDlg.isEdit = true;
                this.limit.limitDlg.applyUser = row.applyUser;
                this.limit.limitDlg.applyUserKey = row.applyUserKey;
                this.limit.limitDlg.minForCashLimit = row.minForCashLimit;
                this.limit.limitDlg.integralLimit = row.integralLimit;
                this.limit.limitDlg.maxForCashLimit = row.maxForCashLimit;
                this.limit.limitDlg.priority = row.priority;
                this.limit.limitDlg.id = row.id;
                if(row.applyUser === 2){
                    this.limit.limitDlg.userType = String(row.applyUserKey[0]);
                } else if(row.applyUser === 3) {
                    this.limit.limitDlg.userLevel = row.applyUserKey;
                } else if(row.applyUser === 4){
                    this.limit.limitDlg.userTags = row.applyUserKey;
                }
                this.limit.limitDlg.isDlgShow = true;
            } else {
                this.limit.limitDlg = Object.assign({}, this.limit.limitDlg, limitDlgOptions);
            }
        },
        // 创建积分规则、积分限制的中转函数
        createRule(name) {
            switch(name){
                case 'rule':
                    if(this.rule.ruleDlg.isEdit){
                        this.resetRuleOptions();
                    }
                    this.rule.ruleDlg.isDlgShow = true;
                    this.$nextTick(() => {
                        this.$refs.ruleDlgForm.resetFields();
                    });
                break;

                case 'limit':
                    // console.log(this.limit.limitDlg.isEdit)
                    if(this.limit.limitDlg.isEdit){
                        this.resetLimitOptions();
                    }
                    this.limit.limitDlg.isDlgShow = true;
                break;
            }
        },
        // 创建积分规则
        handleBtnCreateRuleClick() {
            this.$refs['ruleDlgForm'].validate((valid) => {
                if (valid) {

                    let params = Object.assign({}, this.rule.ruleDlg);
                    params.preItemId = Number(params.preItemId);
                    switch(params.applyUser) {
                        case 2:
                            params.applyUserKey = [Number(params.userType)];
                        break;
                        case 3: 
                            params.applyUserKey = params.userLevel;
                        break;
                        case 4: 
                            params.applyUserKey = params.userTags;
                        break;
                    }
                    delete params.userType;
                    delete params.userLevel;
                    delete params.userTags;
                    delete params.isEdit;
                    delete params.isDlgShow;
                    delete params.isLoading;

                    if(this.rule.ruleDlg.type == 2) {
                        params.isDefaultEffect = 0;
                        params.effectiveDay = 0;
                    }

                    if(!this.rule.ruleDlg.isEdit) {
                        delete params.id;
                    }

                    this.$http.post('user/index/' +  (this.rule.ruleDlg.isEdit ? 'edit-point-rule' : 'add-point-rule'), params).then((res) => {
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message);
                            return;
                        }
                        this.getRuleData('rule');
                        this.$message.success(res.body.message);
                        this.rule.ruleDlg.isDlgShow = false;
                        this.resetRuleOptions();
                    });  

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 创建积分限制
        handleBtnCreateLimitClick() {
            this.$refs['limitDlgForm'].validate((valid) => {
                if (valid) {

                    let params = Object.assign({}, this.limit.limitDlg);
                    switch(params.applyUser) {
                        case 2:
                            params.applyUserKey = [Number(params.userType)];
                        break;
                        case 3: 
                            params.applyUserKey = params.userLevel;
                        break;
                        case 4: 
                            params.applyUserKey = params.userTags;
                        break;
                    }
                    delete params.userType;
                    delete params.userLevel;
                    delete params.userTags;
                    delete params.isEdit;
                    delete params.isDlgShow;
                    delete params.isLoading;

                    if(!this.limit.limitDlg.isEdit) {
                        delete params.id;
                    }

                    this.$http.post('user/index/' +  (this.limit.limitDlg.isEdit ? 'edit-point-limit' : 'add-point-limit'), params).then((res) => {
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message);
                            return;
                        }
                        this.getRuleData('limit');
                        this.$message.success(res.body.message);
                        this.limit.limitDlg.isDlgShow = false;
                        this.resetLimitOptions();
                    });  


                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 开启允许积分配置
        handleBtnEditPointClick() {
            this.dataPoint.tempForm = JSON.parse(JSON.stringify(this.dataPoint.pointform));
            this.dataPoint.isNotEdit = false;
        },
        // 保存积分配置
        handleBtnSubmitPointClick() {

            let changedItems = [];
            this.dataPoint.pointform.forEach((item, index) => {
                if (item.attrValue !== this.dataPoint.tempForm[index].attrValue) {
                    let obj = Object.assign({}, item);
                    changedItems.push(obj);
                }
            });
            if (!changedItems.length) {
                this.$message.info('没有数据改动，无需保存');
                this.dataPoint.isNotEdit = true;
                return;
            }

            this.$refs['pointForm'].validate((valid) => {
                if (valid) {
                    // console.log(this.dataPoint.data);
                    // console.log('ok');
                    // return;
                    this.dataPoint.isLoading = true;
                    this.$http.post('user/user-system/save-point-setting', { pointsSettingInnerReqs: changedItems }).then(res => {
                        // console.log(res);
                        this.dataPoint.isLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message || '保存出错');
                            return;
                        }
                        this.$message.success(res.body.message || '保存成功');
                        this.dataPoint.isNotEdit = true;
                    },
                    (err) => {
                        this.$notify.error(err.body.message || '发生错误');
                        this.dataPoint.isLoading = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 取消积分配置
        handleBtnCancelPointClick() {
            this.dataPoint.pointform = JSON.parse(JSON.stringify(this.dataPoint.tempForm));
            this.dataPoint.isNotEdit = true;
            this.$nextTick(() => {
                this.$refs['pointForm'].validate();
            });
        },
        // 选择规则项目
        changeDialogRuleNames(val) {
            if(val !== ''){
                let index = this.tempRuleNames.findIndex((item) => {
                    return item.id == val;
                });
                this.unit = this.tempRuleNames[index].unit;
            }
        },
        // 远程搜索
        async remoteSearch(query) {
            if (query !== '') {
                const params = {
                    labelName: query
                };
                try {
                    const data = await httpGet('user/tag/get-by-name-like',  { params, showErr: false });
                    this.tags = data.map((item) => {
                        return {
                            label: item.name,
                            value: item.id
                        };
                    });
                } catch(e) {
                    this.tags = [];
                }
            } else {
                this.tags = this.tagsTemp;
            }
        }
    }
};
</script>


<style lang="less">
.pointForm {
    h3 {
        margin: 20px 0;
    }
    .point-input {
        width: 100px;
    }
}
.el-row-form.el-row{
    margin-left: 0!important;
    .el-col-8{
        padding-left: 0!important;
    }
}
.el-col-form{
    .el-form-item__content{
        margin-left: 0!important;
    }
}
</style>
