<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="" label-width="0px" prop="type">
                    <el-select v-model="filterForm.type" clearable placeholder="请选择" @change="changeType">
                        <el-option label="第三方付款id" :value="1" ></el-option>
                        <el-option label="商户订单号" :value="2" ></el-option>
                        <el-option label="支付号 " :value="3" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width="0px"  prop="transactionId">
                    <el-input v-model="filterForm.transactionId" v-show="filterForm.type === 1"></el-input>
                </el-form-item>
                <el-form-item label="" label-width="0px"  prop="parentOrderSn">
                    <el-input v-model="filterForm.parentOrderSn" v-show="filterForm.type === 2"></el-input>
                </el-form-item>
                <el-form-item label="" label-width="0px"  prop="paySn">
                    <el-input v-model="filterForm.paySn" v-show="filterForm.type === 3"></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="payStatus">
                    <el-select v-model="filterForm.payStatus" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in payStatusText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="channel_code：" prop="channelCode">
                    <el-select v-model="filterForm.channelCode" filterable clearable placeholder="请选择">
                        <el-option v-for="(item, index) in payChannels" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="币种：" prop="currencyCode">
                    <el-select v-model="filterForm.currencyCode" filterable clearable placeholder="请选择">
                        <el-option v-for="(item, index) in currencys" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付错误码：" prop="errorCode">
                    <el-input v-model="filterForm.errorCode"></el-input>
                </el-form-item>
                <el-form-item label="来源网站：" prop="siteCode">
                    <el-select v-model="filterForm.siteCode" clearable placeholder="请选择" @change="siteCodeChange">
                        <el-option v-for="(item, index) in siteText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道：" prop="pipelineCode" v-if="this.filterForm.siteCode">
                    <el-select v-model="filterForm.pipelineCode" filterable clearable placeholder="请选择">
                        <el-option v-for="(item, index) in pipelines" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="终端：" prop="platform">
                    <el-select v-model="filterForm.platform" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in terminalText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收货地址国家：" prop="countryCode">
                    <el-select v-model="filterForm.countryCode" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in countrys" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="更新时间：" prop="daterange">
                    <el-date-picker v-model="filterForm.daterange"
                                    type="datetimerange"
                                    placeholder="选择日期范围">

                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button>
                </el-form-item>
            </el-form>


            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column prop="parentOrderSn" label="商户订单号"></el-table-column>
                <el-table-column prop="paySn" label="支付号"></el-table-column>
                <el-table-column prop="transactionId" label="第三方付款ID"></el-table-column>
                <el-table-column label="来源网站">
                    <template scope="scope">
                        {{ siteText[scope.row.siteCode] }}
                    </template>
                </el-table-column>
                <el-table-column label="渠道" prop="pipelineName"></el-table-column>
                <el-table-column label="终端">
                    <template scope="scope">
                        {{ terminalText[scope.row.platform] }}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template scope="scope">
                        {{ payStatusText[scope.row.payStatus] }}
                    </template>
                </el-table-column>
                <el-table-column label="channel_code">
                    <template scope="scope">
                        {{ payChannels[scope.row.channelCode] }}
                    </template>
                </el-table-column>
                <el-table-column label="币种">
                    <template scope="scope">
                        {{ currencys[scope.row.currencyCode] }}
                    </template>
                </el-table-column>
                <el-table-column prop="payCurrencyAmount" label="金额"></el-table-column>
                <el-table-column label="收货国家">
                    <template scope="scope">
                        {{ countrys[scope.row.countryCode] }}
                    </template>
                </el-table-column>
                <el-table-column label="支付错误码">
                    <template scope="scope">
                        {{ scope.row.errorCode ? scope.row.errorCode : '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.updateTime, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button  type="primary" size="small" @click="showInfo(scope.row)">查看</el-button>
                        <el-button  type="primary" size="small"  v-if="scope.row.payStatus === 0 || scope.row.payStatus === 1" :loading="isThirdLoading"  @click="updateStatus(scope.row.paySn)">更新</el-button>
                        <!-- <el-button  type="primary" @click="changeThirdStatus(scope.row)" size="small">修改状态</el-button> -->
                    </template>
                </el-table-column>

            </el-table>

            <div class="text-right el-sub-container">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
            </div>
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

        <el-dialog title="状态修改" v-model="isStatusShow" size="tiny">
            <el-form  label-width="150px">
                <el-form-item label="商户订单编号：">
                    {{currentSelectedRow.parentOrderSn}}
                </el-form-item>
                <el-form-item label="修改状态：">
                    {{ payStatusText[currentSelectedRow.payStatus] }}
                </el-form-item>
                <el-form-item label="支付号ID：">
                    {{ currentSelectedRow.paySn }}
                </el-form-item>
                <el-form-item label="第三方付款ID：">
                    <el-input v-model="transactionId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveThirdStatus" :loading="isStatusLoading">确认修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


    </div>
</template>

<script>
    // 支付信息展示组件
    import paymentDetails from '../../pageComponents/payment/paymentDetails'
    import {getCurrencys, getCountrys, getChannels, getPipelines, getPlatforms, getSites} from '@/common/baseApi'
    export default {
        components: {
            paymentDetails
        },
        data() {
            return {
                dataLoading: false,
                filterForm: {
                    type: 1, // 搜索类型
                    transactionId: '', // 第三方付款id
                    parentOrderSn: '', // 联合订单号
                    paySn: '', // 支付号
                    payStatus: '', // 状态
                    channelCode: '', // 支付方式
                    currencyCode: '', // 币别code
                    errorCode: '', // 错误码
                    siteCode: '', // 来源网站
                    pipelineCode: '', //渠道
                    platform: '', //终端
                    countryCode: '', //收货地址国家
                    daterange: this.initDate(), //更新时间
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                payStatusText: {
                    '0': '未支付',
                    '1': '处理中',
                    '2': '已支付',
                    '3': '退款中',
                    '4': '退款成功',
                    '5': '退款失败',
                    '6': '支付失败',
                    '7': '部分退款'
                },
                terminalText: {},
                siteText: {},
                pipelines: {},
                payChannels: {},
                currencys: {},
                countrys: {},
                tableData: [],
                isShow: false,
                payMentinfo: {},
                isStatusShow: false,
                isStatusLoading: false,
                isThirdLoading: false,
                currentSelectedRow: {},
                transactionId: ''
            }
        },

        created() {
            this.initData();
        },

        watch: {
            'filterForm.daterange'(newDate){
                if (newDate[1] - newDate[0] > 3600 * 1000 * 24 * 90) {
                    this.$message.error('最多只能选择三个月的数据');
                    this.initDate();
                }
            }
        },
        methods: {
            initDate() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
            },
            async initData() {
                this.dataLoading = true;
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
                this.$nextTick(() => {
                    this.getListData();
                })
            },
            // 获取列表数据
            getListData(param) {
                let params = {};
                if (typeof param === 'number') {
                    this.pagination.pageNo = param;
                }
                params = Object.assign({}, this.pagination, this.filterForm);
                delete params.totalCount;
                delete params.type;
                if(params.daterange.length === 2) {
                    let time1 = this.timeZone_(params.daterange[0], this.$store.getters.getTimeZone);
                    let time2 = this.timeZone_(params.daterange[1], this.$store.getters.getTimeZone);
                    params.updateTimeStart = time1;
                    params.updateTimeEnd = time2;
                }
                delete params.daterange;
                this.dataLoading = true;
                this.$http.get('pay/record/list', { params: params }).then(res => {
                    this.dataLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        this.pagination.totalCount = 0;
                        return;
                    }
                    let data = res.body.data.list || [];
                    this.tableData = data;
                    this.pagination.totalCount = res.body.data.totalCount;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 改变每页显示数
            changePageSize(value) {
                this.pagination.pageSize = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this.pagination.pageNo = value;
                this.getListData();
            },
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
            },
            // 改变类型
            changeType(val) {
                switch(val) {
                    case 1:
                        this.filterForm.parentOrderSn = '';
                        this.filterForm.paySn = '';
                    break;
                    case 2:
                        this.filterForm.transactionId = '';
                        this.filterForm.paySn = '';
                    break;
                    case 3:
                        this.filterForm.transactionId = '';
                        this.filterForm.parentOrderSn = '';
                    break;
                }
            },
            // 查看支付信息
            showInfo(row) {
                this.$http.get('pay/record/info', { params: { paySn: row.paySn } }).then(res => {
                    if (res.body.code !== 0) {
                        return;
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
            // 更新状态
            changeThirdStatus(row) {
                this.currentSelectedRow = row;
                this.$nextTick((item) => {
                    this.isStatusShow = true;
                });
            },
            // 保存状态
            saveThirdStatus() {
                this.isStatusLoading = true;
                this.$http.post('pay/record/update', {
                    paySn: this.currentSelectedRow.paySn,
                    transactionId: this.transactionId
                }).then(res => {
                    this.isStatusLoading = false;
                    if (res.body.code == 0) {
                        this.getListData();
                        this.$message.success(res.body.message);
                    } else {
                        this.$message.error(res.body.message);
                    }
                },
                (err) => {
                    this.isStatusLoading = false;
                    this.$notify.error(err.body.message || '发生错误');
                })
            },
            // 更新第三方状态
            updateStatus(paySn) {
                if(this.isThirdLoading){ return; }
                this.isThirdLoading = true;
                this.$http.post('pay/record/update-third', {
                    paySn: paySn,
                }).then(res => {
                    this.isThirdLoading = false;
                    if (res.body.code == 0) {
                        this.getListData();
                        this.$message.success(res.body.message);
                    } else {
                        this.$message.error(res.body.message);
                    }
                },
                (err) => {
                    this.isStatusLoading = false;
                    this.$notify.error(err.body.message || '发生错误');
                })
            },
            // 来源网站
            async siteCodeChange(val) {
                if (val === '') { return; }
                let params = {
                    SITECODE: val
                }
                this.filterForm.pipelineCode = '';
                this.pipelines = {};
                const pipelines = await getPipelines({ params });
                let pipelinesText = {};
                pipelines.forEach((item) => {
                    pipelinesText[item.pipeline_code] = item.pipeline_name;
                });
                this.pipelines = pipelinesText;
            }
        }
    }
</script>
<style lang="less">

</style>
