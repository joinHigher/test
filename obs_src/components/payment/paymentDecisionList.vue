<template>
    <div>
        <div class="el-container">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="决策规则" name="decisionRules">
                    <el-form inline :model="decisionRulesFilterForm" ref="decisionRulesSearchForm">
                        <el-form-item label="规则名称：" prop="ruleName">
                            <el-input v-model="decisionRulesFilterForm.ruleName" placeholder="请输入规则名称"></el-input>
                        </el-form-item>
                        <el-form-item label="风险类型：" prop="riskType">
                            <el-select v-model="decisionRulesFilterForm.riskType" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in riskText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="风险决策：" prop="riskDecision">
                            <el-select v-model="decisionRulesFilterForm.riskDecision" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in makingText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="规则状态：" prop="ruleStatus">
                            <el-select v-model="decisionRulesFilterForm.ruleStatus" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in ruleStatusText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="添加时间：" prop="daterange">
                            <el-date-picker v-model="decisionRulesFilterForm.daterange" type="datetimerange" placeholder="选择日期范围"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                            <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                            <el-button type="primary"  @click="addRule">新增规则</el-button>
                            <el-button type="primary"  @click="handlePriority">优先级</el-button>
                        </el-form-item>
                    </el-form> 
                    <el-table :data="decisionRulesTableData" border ref="decisionRulesTable"  v-loading="decisionRulesDataLoading">
                        <el-table-column prop="id" label="ID"></el-table-column>
                        <el-table-column prop="ruleName" label="规则名称"></el-table-column>
                        <el-table-column label="风险类型">
                            <template scope="scope">
                                {{ riskText[scope.row.riskType] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="风险决策">
                            <template scope="scope">
                                {{ makingText[scope.row.riskDecision] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="通道">
                            <template scope="scope">
                                {{ scope.row.riskChannel === '' ? '无需风控' : scope.row.riskChannel }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="riskDescription" label="说明"></el-table-column>
                        <el-table-column label="状态">
                            <template scope="scope">
                                {{ ruleStatusText[scope.row.ruleStatus] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="riskPriority" label="优先级"></el-table-column>
                        <el-table-column label="添加时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button  type="primary" size="small" @click="editRule(scope.row)">编辑</el-button>
                                <el-button  type="danger" size="small" @click="deleteRule(scope.row)">删 除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="text-right el-sub-container">
                        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="decisionRulesPagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="decisionRulesPagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="decisionRulesPagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="自定义列表" name="customList">
                    <el-form inline :model="customListFilterForm" ref="customListSearchForm">
                        <el-form-item label="列表名称：" prop="name">
                            <el-input v-model="customListFilterForm.name" placeholder="请输入规则名称"></el-input>
                        </el-form-item>
                        <el-form-item label="添加时间：" prop="daterange">
                            <el-date-picker v-model="customListFilterForm.daterange" type="datetimerange" placeholder="选择日期范围"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                            <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                            <el-button type="primary"  @click="addList">新增列表</el-button>
                        </el-form-item>
                    </el-form> 
                    <el-table :data="customListTableData" border ref="customListTable"  v-loading="customListDataLoading">
                        <el-table-column prop="id" label="ID"></el-table-column>
                        <el-table-column prop="conditionName" label="列表名称"></el-table-column>
                        <el-table-column prop="description" label="说明"></el-table-column>
                        <el-table-column label="添加时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button  type="primary" size="small" @click="editList(scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="text-right el-sub-container">
                        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="customListPagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="customListPagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="customListPagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 决策规则  start-->
        <el-dialog title="规则自定义"  :visible.sync="ruleForm.isShow" @close="handleRuleClose" class="rule-dialog">
            <el-form :model="ruleForm" ref="ruleForm" :rules="decisionRules" class="rule-form" >
                <fieldset class="rule-fieldset">
                    <legend>基本配置</legend>
                    <el-col :span="12">
                        <el-form-item label="规则名称：" prop="ruleName" label-width="100px">
                            <el-input v-model="ruleForm.ruleName" auto-complete="off" class="rule-input"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="风险类型：" prop="riskType" label-width="100px">
                            <el-select v-model="ruleForm.riskType" placeholder="请选择">
                                <el-option v-for="(item, index) in riskText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="风险决策：" prop="riskDecision" label-width="100px">
                            <el-select v-model="ruleForm.riskDecision" placeholder="请选择">
                                <el-option v-for="(item, index) in makingText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规则状态：" prop="ruleStatus" label-width="100px">
                            <el-select v-model="ruleForm.ruleStatus" placeholder="请选择">
                                <el-option v-for="(item, index) in ruleStatusText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="ruleForm.riskChannel == 2 ? 12 : 24">
                        <el-form-item label="风控通道：" prop="riskChannel" label-width="100px" :class="{'aisle-select': ruleForm.riskChannel != 'RG'}">
                            <el-select v-model="ruleForm.riskChannel" placeholder="请选择">
                                <el-option v-for="(item, index) in riskChannels" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="profileID：" prop="rgProfileId" label-width="100px" v-if="ruleForm.riskChannel == 'RG'">
                            <el-select v-model="ruleForm.rgProfileId" placeholder="请选择">
                                <el-option label="Old Profile ID：200848" value="200848" ></el-option>
                                <el-option label="Risky Profile ID：201365" value="201365" ></el-option>
                                <el-option label="General Profile ID：201366" value="201366" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="说明：" prop="riskDescription" label-width="100px">
                            <el-input v-model="ruleForm.riskDescription" type="textarea" class="rule-input"></el-input>
                        </el-form-item>
                    </el-col>
                </fieldset>
                <fieldset class="rule-fieldset">
                    <legend>条件配置</legend>
                    <el-form-item label="满足以下情况时此规则为真：" prop="judgeType">
                        <el-radio-group v-model="ruleForm.judgeType">
                            <el-radio label="all">下面的全部条件为真</el-radio>
                            <el-radio label="leastOne">下面的至少一个条件为真</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <hr class="hr">
                    <template v-for="(rule, index) in ruleForm.judgeCondition">
                        <el-row :gutter="20" :key="rule.date">
                            <el-col :span="6">
                                <el-form-item label="" label-width="0px" :prop="'judgeCondition.' + index + '.conditionType'"  :rules="[{ required: true, message: '该项必填', trigger: 'change, blur' }]">
                                    <el-select v-model="rule.conditionType" placeholder="请选择" @change="clearCondition(rule, index)">
                                        <el-option v-for="(item, index) in conditionTypeText" :label="item" :value="index" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="" label-width="0px" ref="fieldType" :prop="'judgeCondition.' + index + '.fieldType'" :rules="[{ validator: validateType1, trigger: 'change, blur' }]">
                                    <el-select v-model="rule.fieldType" placeholder="请选择类型" @change="clearSpecified(rule, index)">
                                        <el-option v-for="(item, index) in conditions[rule.conditionType].fieldType" :label="item" :value="String(index)" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="" v-show="rule.conditionType !== 'blackList'" ref="judgeType" label-width="0px" :prop="'judgeCondition.' + index + '.judgeType'" :rules="rule.conditionType !== 'blackList' ? [{ required: true, message: '该项必填', trigger: 'change, blur' }] : []">
                                    <el-select v-model="rule.judgeType" placeholder="请选择比较符号">
                                        <el-option v-for="(item, index) in conditions[rule.conditionType].judgeType" :label="item" :value="String(index)" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">

                                <el-form-item v-if="rule.conditionType === 'threshold'" ref="judgeCtn" label="" label-width="0px" :prop="'judgeCondition.' + index + '.judgeCtn'" :rules="[{ required: true, message: '该项必填', trigger: 'blur' }]">
                                    <el-input v-model="rule.judgeCtn" placeholder="请填写具体值"></el-input>
                                </el-form-item>

                                <el-form-item v-if="rule.conditionType === 'factor'" ref="judgeCtn" label="" label-width="0px" :prop="'judgeCondition.' + index + '.judgeCtn'" :rules="[{ validator: validateType2, trigger: 'change, blur' }]">
                                    <el-select v-model="rule.judgeCtn" placeholder="请选择类型">
                                        <el-option v-for="(item, index) in conditions[rule.conditionType].fieldType" :label="item" :value="String(index)" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item v-if="rule.conditionType === 'custom'" ref="judgeCtn" label="" label-width="0px" :prop="'judgeCondition.' + index + '.judgeCtn'" :rules="[{ required: true, message: '该项必填', trigger: 'change, blur' }]">
                                    <el-select v-model="rule.judgeCtn" placeholder="请选择自定义列表">
                                        <el-option v-for="(item, index) in customList" :label="item" :value="String(index)" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item v-if="rule.conditionType === 'specified'" v-show="rule.fieldType" ref="judgeCtn"  label="" label-width="0px" :prop="'judgeCondition.' + index + '.judgeCtnArr'" :rules="[{type: 'array', required: true, message: '该项必填', trigger: 'change' }]">
                                    <el-select v-model="rule.judgeCtnArr" multiple filterable  v-if="rule.fieldType == 1" placeholder="请选择网站">
                                        <el-option v-for="(item, index) in siteList" :label="item" :value="index" :key="index"></el-option>
                                    </el-select>
                                    <el-select v-model="rule.judgeCtnArr" multiple filterable  v-else-if="rule.fieldType == 2" placeholder="请选择支付方式">
                                        <el-option v-for="(item, index) in channelDtos" :label="item" :value="item" :key="index"></el-option>
                                    </el-select>
                                    <el-select v-model="rule.judgeCtnArr" multiple filterable  v-else-if="rule.fieldType == 7" placeholder="请选择币种">
                                        <el-option v-for="(item, index) in currencysDtos" :label="item.currencyName" :value="item.currencyCode" :key="index"></el-option>
                                    </el-select>
                                    <el-select v-model="rule.judgeCtnArr" multiple filterable  v-else-if="rule.fieldType == 3 || rule.fieldType == 4 || rule.fieldType == 5 || rule.fieldType == 6" placeholder="请选择国家">
                                        <el-option v-for="(item, index) in countryList" :label="item" :value="index" :key="index"></el-option>
                                    </el-select>
                                    <el-select v-model="rule.judgeCtnArr" multiple filterable  v-else-if="rule.fieldType == 8" placeholder="请选择卡种">
                                        <el-option v-for="(item, index) in cardType2Name" :label="item" :value="index" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item v-if="rule.conditionType === 'trueOrFalse'" ref="judgeCtn" label="" label-width="0px" :prop="'judgeCondition.' + index + '.judgeCtn'" :rules="[{ required: true, message: '该项必填', trigger: 'change, blur' }]">
                                    <el-select v-model="rule.judgeCtn" placeholder="请选择">
                                        <el-option label="True" value="1"></el-option>
                                        <el-option label="False" value="0"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item v-if="rule.conditionType === 'blackList'" style="display:none;" ref="judgeCtn" label="" label-width="0px" :prop="'judgeCondition.' + index + '.judgeCtn'">
                                    <el-input v-model="rule.judgeCtn" placeholder="黑名单占位，不显示"></el-input>
                                </el-form-item>

                            </el-col>
                            <el-col :span="2">
                                <el-form-item label="" label-width="0px">
                                    <el-button type="danger" @click="deleteCondition(index)">删除</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <div class="text-right"><el-button :plain="true" type="primary" @click="addCondition">添加新条件</el-button></div>
                </fieldset>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ruleForm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="saveRule">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 决策规则  end-->

        <!-- 自定义列表  start-->
        <el-dialog title="列表自定义"  :visible.sync="customListForm.isShow" @close="handleListClose" class="rule-dialog">
            <el-form :model="customListForm" ref="customListForm" class="rule-form" :rules="listRules">
                <fieldset class="rule-fieldset">
                    <legend>基本配置</legend>
                    <el-form-item label="列表名称：" prop="name" label-width="100px">
                        <el-input v-model="customListForm.name" auto-complete="off" class="rule-input"></el-input>
                    </el-form-item>
                    <el-form-item label="说明字段：" prop="description" label-width="100px">
                        <el-input v-model="customListForm.description" type="textarea" auto-complete="off" class="rule-input"></el-input>
                    </el-form-item>
                </fieldset>
                <fieldset class="rule-fieldset">
                    <legend>条件配置</legend>
                    <el-form-item label="项目：" prop="conditionValues" label-width="100px">
                        <el-input v-model="customListForm.conditionValues" type="textarea" auto-complete="off" class="rule-textarea"></el-input>
                    </el-form-item>
                </fieldset>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="customListForm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="saveList">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 自定义列表  end-->

        <!-- 移动风控规则  start-->
        <el-dialog title="移动风控规则"  :visible.sync="isPriority" size="tiny" @close="priorityDialogClose"  class="priority-dialog">
            <div class="priority-dialog-draggable">    
                <draggable v-model="allRules" element="ul" :options="{group: 'priority'}" :move="checkMove" @end="endDrag">
                    <transition-group name="priority">
                        <li v-for="(item, index) in allRules" :key="index" class="priority-item" >
                            {{ item.value }}
                        </li>
                    </transition-group>
                </draggable>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isPriority = false">取 消</el-button>
                <el-button type="primary" @click="savePriority">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 移动风控规则  end-->

    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import promiseData, { getAllRule } from '@/common/baseApi'

    const defaultListOpt = {
        isShow: false,
        id: '',
        name: '',
        description: '',
        conditionValues: ''
    }

    const defaultRuleOpt = {
        id: '',
        isShow: false,
        isEdit: false,
        ruleName: '',
        riskType: '',
        riskDecision: '',
        ruleStatus: '',
        riskChannel: '',
        rgProfileId: '',
        riskDescription: '',
        judgeType: '',
        judgeCondition: [{
            conditionType: 'threshold',
            fieldType: '',
            judgeType: '',
            judgeCtn: '',
            judgeCtnArr: [],
            date: + new Date()
        }]
    }

    export default {
        data() {
            var validateType1 = (rule, value, callback) => {
                let fields = rule.field.split('.');
                let index = fields[1];
                if (value === '') {
                    callback(new Error('该项不为空'));
                } else {
                    // console.log(this.ruleForm.judgeCondition[index])
                if (this.ruleForm.judgeCondition[index].judgeCtn !== '' && this.ruleForm.judgeCondition[index].conditionType === 'factor') {
                    this.$refs.ruleForm.validateField(`judgeCondition.${index}.judgeCtn`);
                }
                callback();
            }
            };
            var validateType2 = (rule, value, callback) => {
                let fields = rule.field.split('.');
                let index = fields[1];
                if (value === '') {
                    callback(new Error('该项不为空'));
                } else if (value === this.ruleForm.judgeCondition[index].fieldType && this.ruleForm.judgeCondition[index].conditionType === 'factor') {
                    callback(new Error('判断类型不能一致!'));
                } else {
                    callback();
                }
            };

            return {
                activeName: 'decisionRules',
                // 决策规则
                isPriority: false,
                decisionRulesDataLoading: false,
                decisionRulesFilterForm: {
                    ruleName: '',
                    riskType: '',
                    riskDecision: '',
                    ruleStatus: '',
                    daterange: ''
                },
                decisionRulesPagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                riskText: {
                    '1': '欺诈',
                    '2': '洗钱',
                    '3': '恶意',
                    '4': '钓鱼'
                },
                ruleStatusText: {
                    '1': '上线',
                    '0': '下线'
                },
                makingText: {
                    'review': '人工审核',
                    'accept': '通过',
                    'refuse': '拒绝',
                    'monitor': '监控'
                },
                decisionRulesTableData: [],
                tempDecisionRulesTableData: [],
                // 决策规则-优先级
                dragIndex: null,
                futureIndex: null,
                allRules: [],
                currentIds: [],
                ruleForm: JSON.parse(JSON.stringify(defaultRuleOpt)),
                customList: {}, // 决策规则-自定义列表
                countryList: {}, // 决策规则-国家列表
                siteList: {}, // 决策规则-站点列表
                currencysDtos: [], // 决策规则-币种
                channelDtos: [], // 决策规则- 支付渠道
                cardType2Name: [], //决策规则 - 卡种
                riskChannels: {}, // 决策规则 - 风险渠道
                conditions: {
                    blackList: {
                        fieldType: {},
                        judgeType: {},
                    },
                    judgeType: {
                        fieldType: {},
                        judgeType: {},
                    },
                    custom: {
                        fieldType: {},
                        judgeType: {},
                    },
                    factor: {
                        fieldType: {},
                        judgeType: {},
                    },
                    specified: {
                        fieldType: {},
                        judgeType: {},
                    },
                    threshold: {
                        fieldType: {},
                        judgeType: {},
                    },
                    trueOrFalse: {
                        fieldType: {},
                        judgeType: {},
                    }
                }, // 决策规则-条件集合
                conditionTypeText: {}, // 决策规则-条件类型
                // 决策规则-rule
                decisionRules: {
                    ruleName: [
                        { required: true, message: '请填写规则名称', trigger: 'blur' }
                    ],
                    riskType: [
                        { required: true, message: '请选择风险类型', trigger: 'change' }
                    ],
                    riskDecision: [
                        { required: true, message: '请选择风险决策', trigger: 'change' }
                    ],
                    ruleStatus: [
                        { required: true, message: '请选择规则状态', trigger: 'change' }
                    ],
                    riskDescription: [
                        { required: true, message: '请填写说明', trigger: 'blur' }
                    ],
                    judgeType: [
                        { required: true, message: '请选择条件', trigger: 'change' }
                    ],
                    rgProfileId: [
                        { required: true, message: '请选择profileId', trigger: 'change' }
                    ]
                },
                // 判断类型是否一致
                validateType1: validateType1,
                validateType2: validateType2,
                // 自定义列表
                customListDataLoading: false,
                customListFilterForm: {
                    name: '',
                    daterange: ''
                },
                customListPagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                customListTableData: [],
                customListForm: JSON.parse(JSON.stringify(defaultListOpt)),
                // 自定义列表-rule
                listRules: {
                    name: [
                        { required: true, message: '请填写列表名称', trigger: 'blur' }
                    ],   
                    description: [
                        { required: true, message: '请填写说明', trigger: 'blur' }
                    ],
                    conditionValues: [
                        { required: true, message: '请填写项目', trigger: 'blur' }
                    ],
                }
            }
        },

        created() {
            this.initData();
        },
        methods: {
            initData() {
                 // 获取风控规则条件字段
                promiseData('pay/risk/rule-condition-fields').then((data) => {
                    this.riskChannels = data.riskChannels;
                    this.customList = data.customList; 
                    this.countryList = data.countryList;
                    this.siteList = data.siteList;
                    this.currencysDtos = data.currencysDtos;
                    this.channelDtos = data.channelDtos;
                    this.cardType2Name = data.cardType2Name;
                    let conditions = {};
                    let conditionTypeText = {};
                    data.conditions.forEach((item) => {
                        conditions[item.conditionType] = {
                            judgeType: item.judgeType,
                            fieldType: item.fieldType
                        }
                        conditionTypeText[item.conditionType] = item.conditionName;
                    });
                    this.conditions = conditions;
                    // console.log(this.conditions)
                    this.conditionTypeText = conditionTypeText;
                    this.$nextTick(() => {
                        this.getListData();
                    })
                })
            },
            // 获取列表数据
            getListData(param) {
                let params = {};
                if (typeof param === 'number') {
                    this[this.activeName + 'Pagination'].pageNo = param;
                } 
                params = Object.assign({}, this[this.activeName + 'Pagination'], this[this.activeName + 'FilterForm']);
                delete params.totalCount;
                if(params.daterange && params.daterange.length === 2) {
                    let time1 = this.timeZone_(params.daterange[0], this.$store.getters.getTimeZone);
                    let time2 = this.timeZone_(params.daterange[1], this.$store.getters.getTimeZone);
                    params.startTime = time1;
                    params.endTime = time2;
                }
                delete params.daterange;
                switch(this.activeName) {
                    case 'decisionRules':

                    break;

                    case 'customList':

                    break;

                }

                // console.log(params)
                this[this.activeName + 'TableData'] = [];

                const urls = {
                    'decisionRules': 'pay/risk/rule-list',
                    'customList': 'pay/risk/rule-condition-names'
                }

                this[this.activeName + 'DataLoading'] = true;
                this.$http.get(urls[this.activeName], { params: params }).then(res => {
                    this[this.activeName + 'DataLoading'] = false;
                    this[this.activeName + 'TableData'] = [];
                    if (res.body.code !== 0) {
                        this[this.activeName + 'Pagination'].totalCount = 0;
                        return;
                    }
                    let data = res.body.data.list || [];
                    this[this.activeName + 'TableData']= data;
                    this[this.activeName + 'Pagination'].totalCount = res.body.data.totalCount;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },

            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs[this.activeName + 'SearchForm'].resetFields();
            },
            // Tab切换
            handleTabClick(tab) {
                this.activeName = tab.name;
                this.$nextTick(() => {
                    if (!tab.isDataInited) {
                        this.getListData();
                        tab.isDataInited = true;
                    }
                })
            },
            // 改变每页显示数
            changePageSize(value) {
                this[this.activeName + 'Pagination'].pageSize = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this[this.activeName + 'Pagination'].pageNo = value;
                this.getListData();
            },
            // 新增决策规则
            addRule() {
                this.ruleForm.isShow = true;
            },
            // 关闭决策规则弹窗
            handleRuleClose() {
                this.$refs.ruleForm.resetFields();
                this.$nextTick(() => {
                    this.ruleForm = JSON.parse(JSON.stringify(defaultRuleOpt))
                })  
            },
            // 编辑决策规则
            editRule(row) {
                this.$http.get('pay/risk/rule', { params: { id: row.id } }).then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    let data = res.body.data;
                    delete data.riskPriority;
                    data.judgeCondition = JSON.parse(data.judgeCondition);
                    data.judgeCondition.forEach((item, index) => {
                        item.date = +new Date() + index
                        if(item.conditionType === 'specified'){
                            item.judgeCtnArr = item.judgeCtn
                            item.judgeCtn = ''
                        } else {
                            item.judgeCtnArr = []
                        }
                    })
                    data.riskType = String(data.riskType);
                    data.ruleStatus = String(data.ruleStatus);
                    // console.log(data.judgeCondition)
                    this.ruleForm = Object.assign({isEdit: true, isShow: true}, data);
                    // console.log(this.ruleForm)
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 保存决策规则
            saveRule() {
                let params =  JSON.parse(JSON.stringify(this.ruleForm));
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        delete params.isShow;
                        delete params.isEdit;
                        params.judgeCondition.forEach((item) => {
                            if(item.conditionType === 'specified'){
                                item.judgeCtn = item.judgeCtnArr;
                            }
                            delete item.judgeCtnArr
                            delete item.date
                        });
                        params.judgeCondition = JSON.stringify(params.judgeCondition);
                        if(!this.ruleForm.isEdit){ delete params.id; } 
                        
                        this.$http.post('pay/risk/' + (this.ruleForm.isEdit  ? 'update' : 'add') +'-rule' , params).then(res => {
                            if (res.body.code !== 0) {
                                return this.$message.error(res.body.message);
                            }
                           this.$message.success(res.body.message);
                           this.ruleForm.isShow = false;
                           this.ruleForm.isEdit = false;
                           this.getListData();
                        },
                        (err) => {
                            this.$notify.error(err.body.message || '发生错误');
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 清除选中的值
            clearCondition(row, index, val) {
                
                if(this.ruleForm.judgeCondition.indexOf(row) !== index) { return; }

                let currentObj = this.ruleForm.judgeCondition[index];
                currentObj.judgeCtnArr = [];
                currentObj.judgeCtn = '';
                
                if(!this.ruleForm.isEdit) {
                    this.$refs.judgeCtn[index].resetField();
                }
                this.$nextTick(() => {
                    currentObj.judgeType = '';
                    currentObj.fieldType = '';
                    if(!this.ruleForm.isEdit) {
                        this.$refs.judgeType[index].resetField();
                        this.$refs.fieldType[index].resetField();
                    }
                })
            },
            // 清除规定值先关联的数据
            clearSpecified(row, index, val) {
                if(this.ruleForm.judgeCondition.indexOf(row) !== index) { return; }

                let currentObj = this.ruleForm.judgeCondition[index];

                if(currentObj.conditionType === 'specified') {
                    if(!this.ruleForm.isEdit) {
                        this.$refs.judgeCtn[index].resetField();
                    }
                    currentObj.judgeCtnArr = [];
                    currentObj.judgeCtn = '';
                }
            },
            // 删除决策规则
            deleteRule(row) {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('pay/risk/delete-rule', {
                        id: row.id
                    }).then(res => {
                        if (res.body.code == 0) {
                            this.getListData();
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message.info( '已取消删除');
                });
            },
            // 添加条件
            addCondition() {
                if(this.ruleForm.judgeCondition.length === 20) { this.$message.warning('最多添加20个！'); return; } 
                this.ruleForm.judgeCondition.push({     
                    conditionType: 'threshold',
                    fieldType: '',
                    judgeType: '',
                    judgeCtn: '',
                    judgeCtnArr: [],
                    date: + new Date()
                });
            },
            // 删除条件
            deleteCondition(index) {
                if(this.ruleForm.judgeCondition.length === 1) { this.$message.warning('至少保留一个！'); return; }
                this.ruleForm.judgeCondition.splice(index, 1);
            },
            // 优先级弹框关闭
            priorityDialogClose() {
                this.currentIds = [];
            },
            // 处理优先级
            handlePriority() {
                getAllRule().then((data) => {
                    let allRules = [];
                    data.reverse();
                    data.forEach((item) => {
                        let key = Object.keys(item);
                        allRules.push({
                            key: key[0],
                            value: item[key[0]]
                        })
                    })
                    this.allRules = allRules;
                    this.$nextTick(() => {
                        this.isPriority = true;
                    });
                });
            },
            // 优先级检测拖拽状态
            checkMove(evt) {
                // console.log(evt);
                this.dragIndex = evt.draggedContext.index;
                this.futureIndex = evt.draggedContext.futureIndex;
            },
            // 结束拖拽
            endDrag() {
                // console.log('drag：' + this.dragIndex + 'futureIndex：' + this.futureIndex)
                if(this.dragIndex === this.futureIndex) { return; }
                let ids = [];
                for(let item of this.allRules) {
                    ids.push(item.key);
                }
                ids.reverse();
                this.dragIndex = null;
                this.futureIndex = null;
                this.currentIds = ids;
            },
            // 保存优先级
            savePriority() {
                if(this.currentIds.length !== 0) {
                    this.$http.post('pay/risk/update-rule-priority', {
                        queue: this.currentIds
                    }).then(res => {
                        this.isPriority = false;
                        if (res.body.code == 0) {
                            this.getListData();
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                } else {
                    this.$message.warning('优先级没有发生改变！');
                }
            },
            // 添加列表
            addList() {
                this.customListForm.isShow = true;
            },
            // 修改列表
            editList(row) {
                this.$http.get('pay/risk/rule-condition', { params: { conditionId: row.id } }).then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    let data = res.body.data;
                    data.conditionValues = data.conditionValues.join('\n');
                    data.name = data.conditionName;
                    delete data.conditionName;
                    this.customListForm = Object.assign({}, this.customListForm, data);
                    this.customListForm.isShow = true;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },            
            // 关闭自定义列表弹窗触发函数
            handleListClose() {
                this.$refs.customListForm.resetFields();
                this.$nextTick(() => {
                    this.customListForm = Object.assign({}, defaultListOpt);
                })
            },
            // 保存自定义列表
            saveList() {
                let params = Object.assign({}, this.customListForm);
                this.$refs.customListForm.validate((valid) => {
                    if (valid) {
                        delete params.isShow;
                        params.conditionValues = params.conditionValues.split(/\n/);
                        // console.log(params);
                        this.$http.post('pay/risk/' + (params.id ? 'update' : 'add') + '-rule-condition' , params).then(res => {
                            if (res.body.code !== 0) {
                                return this.$message.error(res.body.message);
                            }
                           this.$message.success(res.body.message);
                           this.customListForm.isShow = false;
                           this.getListData();
                           this.initData();
                        },
                        (err) => {
                            this.$notify.error(err.body.message || '发生错误');
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        components: {
            draggable
        }
    }
</script>
<style lang="less">
.rule-dialog{
    .rule-fieldset{
        border: 1px solid #8391a5;
        padding: 20px 30px;
        &:nth-child(2) {
            margin-top: 20px;
        }
    }
    textarea {
        height: 100px;
    }
    .hr{
        margin-bottom: 20px;
    }
    .aisle-select .el-select {
        width: 43.3%;
    }
    .rule-textarea{
        textarea {
            white-space: pre-line;
            height: 200px;
            overflow-y: auto;
        }
    }
}
.priority-dialog {
    .priority-item {
        list-style: none;
        padding: 10px;
        border-bottom: solid 1px;
        transition: all 1s;
        cursor: pointer;
    }
    .priority-enter, .priority-leave-active {
        opacity: 0;
    }
    .priority-dialog-draggable{
        max-height: 600px;
        overflow-y: auto;
    }
}
</style>
