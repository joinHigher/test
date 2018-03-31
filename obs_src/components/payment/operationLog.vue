<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="生效终端：" prop="platform">
                    <el-select v-model="filterForm.platform" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in terminalText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效站点：" prop="pipelineCode">
                    <el-select v-model="filterForm.pipelineCode" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in pipelines" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日志类型：" prop="operateType">
                    <el-select v-model="filterForm.operateType" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in logTypeText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作人：" prop="userName">
                    <el-input v-model="filterForm.userName" placeholder="请输入操作人"></el-input>
                </el-form-item>
                <el-form-item label="更新时间：" prop="daterange">
                    <el-date-picker v-model="filterForm.daterange" type="datetimerange" placeholder="选择日期范围"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button>
                </el-form-item>
            </el-form>  


            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column label="ID">
                    <template scope="scope">
                        {{ tableData.indexOf(scope.row) + 1 }}
                    </template>
                </el-table-column>
                <el-table-column label="生效终端">
                    <template scope="scope">
                        {{ terminalText[scope.row.platform] }}
                    </template>
                </el-table-column>
                <el-table-column label="生效站点">
                    <template scope="scope">
                        {{ pipelines[scope.row.pipelineCode] }}
                    </template>
                </el-table-column>
                <el-table-column label="日志类型">
                    <template scope="scope">                    
                        {{ logTypeText[scope.row.operateType] }}
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="操作内容">
                    <template scope="scope"> 
                        <div v-html="scope.row.content"></div>                       
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="操作人"></el-table-column>
                <el-table-column label="更新时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.createTime, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
            </el-table>

            <div class="text-right el-sub-container">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataLoading: false,
                filterForm: {
                    platform: '', // 终端
                    pipelineCode: '', // 生效站点
                    operateType: '', // 日志类型
                    userName: '', //操作者
                    daterange: '' // 发生时间
                },
                terminalText: {
                    '1': 'WEB',
                    '2': 'WAP',
                    '3': 'IOS',
                    '4': 'Android',
                    '5': 'Pad'
                },
                logTypeText: {
                    '1': '支付渠道管理',
                    '2': '金额区间',
                    '3': '支付币种管理',
                    '4': '收款账号管理',
                    '5': '汇率管理',
                    '6': '全站汇率管理',
                    '7': '礼品卡',
                    '8': '支付币种管理', 
                    '9': '支付渠道文案管理', 
                    '10': '支付渠道排序管理', 
                    '11': '信用卡渠道排序管理',
                    '12': '站点交易信息管理',
                    '13': '错误码库',
                    '14': '卡种路由管理',
                    '15': '风控自定义条件列表', 
                    '16': '风控规则',
                    '17': '分期利率设置'
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: [],
                pipelines: []
            }
        },

        created() {
            this.getPipelines();
            this.initData();
        },
        methods: {
            a(row) {
                console.log(row)
            },
            initData() {
                this.getListData();
            },
            // 获取渠道
            getPipelines() {
                this.$http.get('admin/public/pipelines').then((res) => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    let pipelines = {};
                    res.body.data.forEach((item) => {
                        pipelines[item.pipeline_code] = item.pipeline_name;
                    })
                    this.pipelines = pipelines;
                });   
            },
            // 获取列表数据
            getListData(param) {
                let params = {};
                if (typeof param === 'number') {
                    this.pagination.pageNo = param;
                } 
                params = Object.assign({}, this.pagination, this.filterForm);
                delete params.totalCount;
                if(params.daterange.length === 2) {
                    let time1 = this.timeZone_(params.daterange[0], this.$store.getters.getTimeZone);
                    let time2 = this.timeZone_(params.daterange[1], this.$store.getters.getTimeZone);
                    params.startTime = time1;
                    params.endTime = time2;
                }
                delete params.daterange;
                this.dataLoading = true;
                this.$http.get('pay/log/list', { params: params }).then(res => {
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
            }
        }
    }
</script>
<style lang="less">

</style>
