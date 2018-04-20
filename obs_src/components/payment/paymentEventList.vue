<!-- 事件管理 -->
<template>
    <div>
        <div class="el-container">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="规则事件" name="regularEvent">
                    <el-form inline :model="regularEventFilterForm" ref="regularEventSearchForm">
                        <el-form-item label="" prop="search_type">
                            <el-select v-model="regularEventFilterForm.search_type" clearable placeholder="请选择">
                                <el-option label="付款单号" value="1"></el-option>
                                <el-option label="商户订单号" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" prop="paySn" v-show="regularEventFilterForm.search_type == 1">
                            <el-input v-model="regularEventFilterForm.paySn" placeholder="请输入支付号"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="orderSn"  v-show="regularEventFilterForm.search_type == 2">
                            <el-input v-model="regularEventFilterForm.orderSn" placeholder="请输入订单号"></el-input>
                        </el-form-item>
                        <el-form-item label="命中规则：" prop="ruleName">
                            <el-input v-model="regularEventFilterForm.ruleName" placeholder="请输入查询内容"></el-input>
                        </el-form-item>
                        <el-form-item label="风险决策：" prop="riskDecision">
                            <el-select v-model="regularEventFilterForm.riskDecision" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in makingText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发生时间：" prop="daterange">
                            <el-date-picker v-model="regularEventFilterForm.daterange" type="datetimerange" placeholder="选择日期范围"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                            <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="regularEventTableData" border ref="regularEventTable"  v-loading="regularEventDataLoading">
                        <el-table-column prop="id" label="事件Id"></el-table-column>
                        <el-table-column prop="paySn" label="付款单号">
                            <template scope="scope">
                                <el-button type="text" @click="showInfo(scope.row)">{{ scope.row.paySn }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderSn" label="商户订单号"></el-table-column>
                        <el-table-column prop="userEmail" label="会员邮箱"></el-table-column>
                        <el-table-column prop="ruleName" label="命中规则名称"></el-table-column>
                        <el-table-column prop="ruleCondition" label="命中条件"></el-table-column>
                        <el-table-column label="风险决策">
                            <template scope="scope">
                                {{ makingText[scope.row.riskDecision] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="riskChannel" label="风控通道"></el-table-column>
                        <el-table-column label="事件发生时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.eventTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="text-right el-sub-container">
                        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="regularEventPagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="regularEventPagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="regularEventPagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="名单事件" name="listEvent">
                    <el-form inline :model="listEventFilterForm" ref="listEventSearchForm">
                        <el-form-item label="" prop="search_type">
                            <el-select v-model="listEventFilterForm.search_type" clearable placeholder="请选择">
                                <el-option label="付款单号" value="1"></el-option>
                                <el-option label="商户订单号" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" prop="paySn" v-show="listEventFilterForm.search_type == 1">
                            <el-input v-model="listEventFilterForm.paySn" placeholder="请输入支付号"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="orderSn" v-show="listEventFilterForm.search_type == 2">
                            <el-input v-model="listEventFilterForm.orderSn" placeholder="请输入订单号"></el-input>
                        </el-form-item>

                        <el-form-item label="判断方式：" prop="judgeMethod">
                            <el-select v-model="listEventFilterForm.judgeMethod" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in judgmentText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="名单类型：" prop="listType">
                            <el-select v-model="listEventFilterForm.listType" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in listTypeText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>


                        <el-form-item label="发生时间：" prop="daterange">
                            <el-date-picker v-model="listEventFilterForm.daterange" type="datetimerange" placeholder="选择日期范围"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                            <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="listEventTableData" border ref="listEventTable"  v-loading="listEventDataLoading">
                        <el-table-column prop="id" label="事件Id"></el-table-column>
                        <el-table-column prop="paySn" label="付款单号">
                            <template scope="scope">
                                <el-button type="text" @click="showInfo(scope.row)">{{ scope.row.paySn }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderSn" label="商户订单号"></el-table-column>
                        <el-table-column label="判断方式">
                            <template scope="scope">
                                {{ judgmentText[scope.row.judgeMethod] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="judgeContent" label="判断内容"></el-table-column>
                        <el-table-column label="名单类型">
                            <template scope="scope">
                                {{ scope.row.blacklistType > 2 ? '审核名单' : '黑名单' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="事件发生时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.eventTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="text-right el-sub-container">
                        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="listEventPagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="listEventPagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listEventPagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="第三方风控事件" name="thirdWindControl">
                    <el-form inline :model="thirdWindControlFilterForm" ref="thirdWindControlSearchForm">
                        <el-form-item label="" prop="search_type">
                            <el-select v-model="thirdWindControlFilterForm.search_type" clearable placeholder="请选择">
                                <el-option label="付款单号" value="1"></el-option>
                                <el-option label="商户订单号" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" prop="paySn" v-show="thirdWindControlFilterForm.search_type == 1">
                            <el-input v-model="thirdWindControlFilterForm.paySn" placeholder="请输入支付号"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="orderSn" v-show="thirdWindControlFilterForm.search_type == 2">
                            <el-input v-model="thirdWindControlFilterForm.orderSn" placeholder="请输入订单号"></el-input>
                        </el-form-item>
                        <el-form-item label="风控渠道：" prop="riskType">
                            <el-select v-model="thirdWindControlFilterForm.riskChannel" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in windControlText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="结果：" prop="riskResult">
                            <el-select v-model="thirdWindControlFilterForm.riskResult" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in resultText" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发生时间：" prop="daterange">
                            <el-date-picker v-model="thirdWindControlFilterForm.daterange" type="datetimerange" placeholder="选择日期范围"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                            <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="thirdWindControlTableData" border ref="thirdWindControlTable"  v-loading="thirdWindControlDataLoading">
                        <el-table-column prop="id" label="事件Id"></el-table-column>
                        <el-table-column prop="paySn" label="付款单号">
                            <template scope="scope">
                                <el-button type="text" @click="showInfo(scope.row)">{{ scope.row.paySn }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderSn" label="商户订单号"></el-table-column>
                        <el-table-column prop="riskChannel" label="风控渠道">
                            <!-- <template scope="scope">
                                {{ windControlText[scope.row.riskType] }}
                            </template> -->
                        </el-table-column>
                        <el-table-column label="结果">
                            <template scope="scope">
                                {{ resultText[scope.row.riskResult] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="事件发生时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.eventTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>

                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button  type="primary" size="small" @click="showThirdWindControl(scope.row)">详情</el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                    <div class="text-right el-sub-container">
                        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="thirdWindControlPagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="thirdWindControlPagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="thirdWindControlPagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>

            </el-tabs>
        </div>
        <el-dialog title="支付信息详情" v-model="isShow" size="large">
            <payment-details
                :payMentinfo="payMentinfo"
                :currencys="currencys"
                :payChannels="payChannels"
                :countrys="countrys"
                :payStatus="payStatusText"
                :terminal="terminalText"
                :sites="siteText"
            ></payment-details>
        </el-dialog>

        <el-dialog title="第三方风控事件详情" v-model="isThirdShow" size="large">
            <template v-if="thirdResult">
                <div class="el-container">
                    <table cellspacing="0" cellpadding="0" class="third-result-table">
                        <tr>
                            <td class="table-td-name" width="100">风控渠道</td>
                            <td class="table-td-value">{{ windControlText[thirdResult.riskType] }}</td>
                            <td class="table-td-name" width="100">风控结果</td>
                            <td class="table-td-value">{{ thirdResult.riskResult }}</td>
                            <td class="table-td-name" width="100">风控分数</td>
                            <td class="table-td-value">{{ thirdResult.riskScore }}</td>
                            <td class="table-td-name">profile ID</td>
                            <td class="table-td-value">{{ thirdResult.profileId }}</td>
                            <td class="table-td-name">AVS Check</td>
                            <td class="table-td-value">{{ thirdResult.avsCheck }}</td>
                            <td class="table-td-name">CVC Check</td>
                            <td class="no-right-border table-td-value" width="160">{{ thirdResult.cvcCheck }}</td>
                            <td class="table-td-name">事件发生时间</td>
                            <td class="no-right-border table-td-value" width="160">{{ timeZone_(thirdResult.eventTime, $store.getters.getTimeZone) }}</td>
                        </tr>
                    </table>
                    <h3 style="margin: 20px 0;">DM rule</h3>
                    <el-table :data="thirdResult.mdRule" style="width: 100%">
                        <el-table-column prop="rule" label="命中rule"></el-table-column>
                        <el-table-column prop="ruleResult" label="rule 结果"></el-table-column>
                    </el-table>
                </div>
            </template>
        </el-dialog>

    </div>
</template>

<script>
    // 支付信息展示组件
    import paymentDetails from '../../pageComponents/payment/paymentDetails'
    import promiseData, {getCurrencys, getCountrys, getChannels, getPipelines, getPlatforms, getSites} from '@/common/baseApi'
    export default {
        components: {
            paymentDetails
        },
        data() {
            return {
                isShow: false,
                payMentinfo: {},
                terminalText: {},
                siteText: {},
                pipelines: {},
                payChannels: {},
                currencys: {},
                countrys: {},
                payStatusText: {
                    '0': '未支付',
                    '1': '处理中',
                    '2': '已支付',
                    '3': '退款中',
                    '4': '退款成功',
                    '5': '退款失败',
                    '6': '支付失败'
                },
                activeName: 'regularEvent',
                // 规则事件
                regularEventDataLoading: false,
                regularEventFilterForm: {
                    search_type: '',
                    paySn: '',
                    orderSn: '',
                    ruleName: '',
                    riskDecision: '',
                    daterange: ''
                },
                regularEventPagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                makingText: {
                    'review': '人工审核',
                    'accept': '通过',
                    'refuse': '拒绝',
                    'monitor': '监控'
                },
                regularEventTableData: [],
                // 名单事件
                listEventDataLoading: false,
                listEventFilterForm: {
                    search_type: '',
                    paySn: '',
                    orderSn: '',
                    judgeMethod: '',
                    listType: '',
                    daterange: ''
                },
                listEventPagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                judgmentText: {
                    '1': '顾客Email',
                    '5': '收件人Email',
                    '3': '详细地址'
                },
                listTypeText: {
                    '1': '黑名单',
                    '2': '审核名单',
                },
                listEventTableData: [],
                // 第三方风控事件
                thirdWindControlDataLoading: false,
                thirdWindControlFilterForm: {
                    search_type: '',
                    paySn: '',
                    orderSn: '',
                    // riskType: '',
                    riskChannel: '',
                    riskResult: '',
                    daterange: ''
                },
                thirdWindControlPagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                windControlText: {},
                resultText: {
                    '1': '通过',
                    '0': '失败',
                    '2': '审核'
                },
                thirdWindControlTableData: [],
                isThirdShow: false,
                thirdResult: null
            }
        },

        created() {
            this.initData();
        },
        methods: {
            async initData() {
                this.getListData();
                const [currencysData, countrys, channels, pipelines, platforms, sites] = await Promise.all([getCurrencys(), getCountrys(), getChannels(), getPipelines(), getPlatforms(), getSites()]);

                let pipelinesText = {};
                pipelines.forEach((item) => {
                    pipelinesText[item.pipeline_code] = item.pipeline_name;
                });
                this.pipelines = pipelinesText;

                let currencysText = {};
                currencysData.currencys.forEach((item) => {
                    currencysText[item.currencyCode] = item.currencyName;
                });
                this.currencys =  currencysText;


                let payChannelsText = {};
                channels.payChannels.forEach((item) => {
                    payChannelsText[item.channelCode] = item.channelName;
                });
                this.payChannels = payChannelsText;


                let countrysText = {};
                countrys.forEach((item) => {
                    countrysText[item.countryCode] = item.countryName;
                });
                this.countrys = countrysText;

                let siteText = {};
                sites.forEach((item) => {
                    siteText[item.code] = item.name;
                })
                this.siteText = siteText;

                let terminalText = {};
                for(let i in platforms) {
                    terminalText[platforms[i]] = i
                }
                this.terminalText = terminalText;

                 // 获取风控渠道字段
                promiseData('pay/risk/public-risk-channel-list').then((data) => {
                    this.windControlText = data.riskChannels;
                });

            },
            // 获取列表数据
            getListData(param) {
                let params = {};
                if (typeof param === 'number') {
                    this[this.activeName + 'Pagination'].pageNo = param;
                }
                params = Object.assign({}, this[this.activeName + 'Pagination'], this[this.activeName + 'FilterForm']);
                delete params.totalCount;
                if(params.daterange.length === 2) {
                    let time1 = this.timeZone_(params.daterange[0], this.$store.getters.getTimeZone);
                    let time2 = this.timeZone_(params.daterange[1], this.$store.getters.getTimeZone);
                    params.startTime = time1;
                    params.endTime = time2;
                }
                delete params.daterange;
                switch(params.search_type) {
                    case '1':
                        delete params.orderSn;
                        this[this.activeName + 'FilterForm'].orderSn = '';
                    break;

                    case '2':
                        delete params.paySn;
                        this[this.activeName + 'FilterForm'].paySn = '';
                    break;

                    default:
                        delete params.paySn;
                        delete params.orderSn;
                        this[this.activeName + 'FilterForm'].paySn = '';
                        this[this.activeName + 'FilterForm'].orderSn = '';
                }

                delete params.search_type;

                let ruleUrl = '';

                switch(this.activeName) {
                    case 'regularEvent':
                        ruleUrl = 'pay/risk/rule-event';
                        // params.eventType = 'rule';
                    break;

                    case 'listEvent':
                        ruleUrl = 'pay/risk/list-event';
                        // params.eventType = 'list';
                        if(params.listType == 1) {
                            params.blacklistTypes = [1,2];
                        } else if(params.listType == 2){
                            params.blacklistTypes = [3,4,5,6];
                        }
                        delete params.listType;
                    break;

                    case 'thirdWindControl':
                        ruleUrl = 'pay/risk/third-event';
                        // params.eventType = 'third';
                    break;
                }

                for (let i in params) {
                    if (params[i] === '') {
                        delete params[i];
                    }
                }
                this[this.activeName + 'DataLoading'] = true;
                this.$http.get(ruleUrl, { params: params }).then(res => {
                    this[this.activeName + 'DataLoading'] = false;
                    this[this.activeName + 'TableData'] = [];
                    if (res.body.code !== 0) {
                        this[this.activeName + 'Pagination'].totalCount = 0;
                        return;
                    }
                    let data = res.body.data.list;
                    this[this.activeName + 'TableData']= data;
                    this[this.activeName + 'Pagination'].totalCount = res.body.data.totalCount;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
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
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs[this.activeName + 'SearchForm'].resetFields();
            },
            // 切换 tab
            handleTabClick(tab) {
                this.activeName = tab.name;
                this.$nextTick(() => {
                    if (!tab.isDataInited) {
                        this.getListData();
                        tab.isDataInited = true;
                    }
                })
            },
            // 展示详细信息
            showInfo(row) {
                this.$http.get('pay/record/info', { params: { paySn: row.paySn } }).then(res => {
                    if (res.body.code !== 0) {
                        return this.$message.error(res.body.message);;
                    }
                    this.payMentinfo = res.body.data;
                    this.$nextTick(() =>{
                        this.isShow = true;
                    });
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 显示第三方风控事件详情
            showThirdWindControl(row) {


                this.$http.get('pay/risk/rule-content', { params: { id: row.id } }).then(res => {
                    if (res.body.code !== 0) {
                        return this.$message.error(res.body.message);
                    }
                    let data = res.body.data;
                    if(data.riskContent) {
                        let riskContent = JSON.parse(data.riskContent);
                        if(JSON.stringify(riskContent.mdRule) !== '{}') {
                            let arr = [];
                            for(let i in riskContent.mdRule) {
                                arr.push({
                                    rule: i,
                                    ruleResult: riskContent.mdRule[i]
                                })
                            }
                            riskContent.mdRule = arr;
                        } else {
                            riskContent.mdRule = [];
                        }
                        riskContent.riskType = res.body.data.riskType;
                        riskContent.eventTime = res.body.data.eventTime;
                        this.thirdResult = riskContent;
                        this.isThirdShow = true;
                    }
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });



            }
        }
    }
</script>
<style lang="less">
.third-result-table {
    width: 100%;
    border: 1px solid #dfe6ec;
    td, th {
        height: 40px;
        text-align: center;
        border-bottom: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
    }
    .no-bottom-border {
        td{
            border-bottom: 0;
        }
    }
    .no-right-border {
        border-right: 0;
    }
    .table-td-name{
        background-color: #eef1f6;
    }
    .table-td-value {
        min-width: 50px;
        max-width: 200px;
    }
}
</style>
