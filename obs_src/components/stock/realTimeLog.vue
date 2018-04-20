<style lang="less">
    .w160{width: 160px;}
    .notice{
        color: #FF6600;
        font-size: 13px;
    }
    .el-table__header-wrapper{
        td,th{text-align: center;}
    }
</style>
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filter" ref="searchForm" :rules="filterRules">
                <el-form-item label="商品SKU：" prop="goodSn">
                    <el-input v-model="filter.goodSn" placeholder="填写商品SKU"></el-input>
                </el-form-item>
                <el-form-item label="原因类型：" prop="logType">
                    <el-select v-model="filter.logType" clearable filterable placeholder="请选择">
                        <el-option v-for="(val, key) in logTypeText" :label="val" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="反馈站点：" prop="siteCode">
                    <el-select v-model="filter.siteCode" clearable placeholder="请选择">
                        <el-option v-for="(item,index) in sites" :label="item.name" :value="item.code" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipelineCode">
                    <el-select clearable filterable v-model="filter.pipelineCode" placeholder="请选择" class="w160">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="更新时间：" prop="date">
                    <el-date-picker v-model="filter.date" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
                </el-form-item>
            </el-form>
            <div class="text-right el-sub-container clearfix">
                <span class="notice pull-left">注意：不限定SKU则最多可查询1天数据，限定SKU则最多可查询整月数据</span>
                <el-button type="primary" @click="submitSearch"><i class="el-icon-search"></i> 筛选</el-button>
                <el-button type="danger" @click="resetFrom">清空</el-button>
            </div>
        </div>

        <div class="el-container">
            <el-table :data="tableData" v-loading="isDataLoading" border class="text-center">
                <el-table-column prop="goodSn" label="SKU"></el-table-column>
                <el-table-column label="反馈站点">
                    <template scope="scope">
                        <div>{{ self.siteCodes[scope.row.siteCode] ? self.siteCodes[scope.row.siteCode] : scope.row.siteCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="站点渠道">
                    <template scope="scope">
                        <span>{{pipeOpt[scope.row.pipelineCode]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所属真实仓库">
                    <template scope="scope">
                        <div>{{ self.realWhCodes[scope.row.realWhCode] ? self.realWhCodes[scope.row.realWhCode] : scope.row.realWhCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库存变更数" prop="num"></el-table-column>
                <el-table-column prop="activStock" label="原因类型">
                    <template scope="scope">
                        {{logTypeText[scope.row.logType] ? logTypeText[scope.row.logType] : scope.row.logType}}
                    </template>
                </el-table-column>
                <el-table-column prop="orderNo" label="订单号"></el-table-column>
                <el-table-column label="最后更新时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.lastTime / 1000, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.pageNo" :page-sizes="[10, 20, 50]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="filter.totalCount"></el-pagination>
            </div>
        </div>

        <!-- 弹窗S -->

        <!-- 弹窗E -->

    </div>
</template>

<script>

export default {
    data () {
        let validateFilterDate =  (rule, value, callback) => {
            if(typeof value === 'undefined') {
                return callback(new Error('该项不能为空'));
            }

            //不限定SKU则最多可查询1天数据，限定SKU则最多可查询整月数据
            if(this.filter.goodSn.trim() === ''){
                let beginTimeTemp = value[0].getFullYear().toString() + (value[0].getMonth() + 1).toString() + value[0].getDate().toString();
                let endTimeTemp = value[1].getFullYear().toString() + (value[1].getMonth() + 1).toString() + value[1].getDate().toString();

                //时间范围是否在一天内
                if(beginTimeTemp !== endTimeTemp){
                    return callback(new Error('不限定SKU最多可查询1天数据（时间区间不在同一天之内）'));
                }
            }else{
                let beginTimeTemp = value[0].getFullYear().toString() + (value[0].getMonth() + 1).toString();
                let endTimeTemp = value[1].getFullYear().toString() + (value[1].getMonth() + 1).toString();

                //时间范围是否在一个月内
                if(beginTimeTemp !== endTimeTemp){
                    return callback(new Error('限定SKU最多可查询整月数据（时间区间不在同一个月之内）'));
                }
            }
            callback();
        };
        return {
            self: this,
            tableData: [],
            isDataLoading: false,
            sites: [],
            filter: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                date: [],
                logType: '',
                goodSn: '',
                siteCode: this.$store.getters.getSite,
                pipelineCode: ''
            },
            filterRules: {
                date: [{required: true, validator: validateFilterDate ,trigger: 'submit'}],
            },
            logTypeText: {
                //'1': 'OMS每日同步',   //0.9去掉"OMS每日同步"
                '2': '生成订单扣减',
                '3': '超时发起支付扣减成功',
                '4': '超时支付成功扣减成功',
                '6': '订单到期取消',
                '7': '客人取消',
                '8': '运营取消',
                '9': '订单支付超时释放',
                '11': '购物车结算页扣除',
                '12': '购物车超时释放',
                '13': '活动申请库存占用',
                '14': '活动申请扣除自由库存 ',
                '15': '活动释放占用库存',
                '16': '活动释放占用库存回收到自由库存',
                '17': 'pdm下发sku与真实仓的绑定',
                '18': '重新结算释放库存'
            },
            numberTypeText: {
                '1': '交易ID',
                '2': '订单号',
                '3': '价格ID'
            },
            numberTypeText: {
                '1': '交易ID',
                '2': '订单号',
                '3': '价格ID'
            },
            siteCodes: {},
            realWhCodes: {},
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.initDate();
        this.getListData();
        this.getSiteCodes();
        this.getRealWhCodeList();
    },
    methods: {

        //当天时间  2017-12-20 16:20:20
        initDate() {
            let date = new Date(),
                beginTimeTemp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate().toString() +' ' + '00:00:00',
                endTimeTemp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate().toString()  +' ' + '23:59:59';

            this.filter.date = [new Date(beginTimeTemp), new Date(endTimeTemp)];
        },
        getListData () {
            let params = {};

            params = Object.assign({}, this.filter);
            delete params['totalCount'];

            //
            if (this.filter.date.length > 0) {
                params.startTime = this.filter.date[0].getTime();   //获取毫秒
                params.endTime = this.filter.date[1].getTime();
            }
            delete params.date;
            this.isDataLoading = true;

            this.$http.get('stock/stock/query-stock-change-log-list', { params: params }).then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.filter.totalCount = res.body.data.totalCount;
                } else {
                    this.tableData = [];
                }
                this.isDataLoading = false;
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
            });
        },
        getSiteCodes () {
            this.$http.get('base/public/site-list').then(res => {
                let obj = {};
                if (res.body.code !== 0) {
                    return;
                }
                Array.isArray(res.body.data) && res.body.data.forEach(item => {
                    obj[item.code] = item.name;
                    this.sites.push(item);
                });
                this.$set(this, 'siteCodes', obj);
            });
        },
        getRealWhCodeList() {
            this.$http.get('stock/real-warehouse/public-whcodes').then((res) => {
                let obj = {};
                if (res.body.code !== 0 || !Array.isArray(res.body.data)) {
                    return;
                }
                res.body.data.forEach((item) => {
                    obj[item.whCode] = item.name;
                });
                this.$set(this, 'realWhCodes', obj);
            });
        },
        handleBtnFilterClick() {

        },
        changePage(value) {
            this.filter.pageNo = value;
            this.getListData();
        },
        changePageSize(value) {
            this.filter.pageSize = value;
            this.getListData();
        },
        resetFrom () {
            this.$refs.searchForm.resetFields();
            this.filter.pageNo = 1;
            this.getListData();
        },
        submitSearch() {
            this.$refs['searchForm'].validate((valid) => {
                if (valid) {
                    this.filter.pageNo = 1;
                    this.getListData();
                }
            });
        },
    }
}
</script>

