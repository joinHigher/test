<template>
    <div>
        <!--筛选条件-->
        <div class="el-container">
            <el-form inline :model="filter" ref="searchForm" :rules="filterRules">
                <el-form-item label="商品SKU" prop="goodSn">
                    <el-input v-model="filter.goodSn" placeholder="商品SKU编码"></el-input>
                </el-form-item>
                <el-form-item label="记录说明" prop="logType">
                    <el-select v-model="filter.logType" clearable placeholder="请选择...">
                        <el-option label="更新库存数小于占用库存" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="同步来源" prop="sourceType">
                    <el-select v-model="filter.sourceType" clearable placeholder="请选择">
                        <el-option label="OMS更新" value="1"></el-option>
                        <el-option label="人工更新" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="查询时间" prop="date">
                    <el-date-picker type="datetimerange" v-model="filter.date" placeholder="选择时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item class="ml30">
                    <el-button type="primary" @click="submitSearch"><i class="el-icon-search"></i>筛选</el-button>
                    <el-button type="danger" @click="resetFrom">清空</el-button>
                </el-form-item>
            </el-form>
            <div class="notice">
                <span>注意：不限定SKU则最多可查询1天数据，限定SKU则最多可查询整月数据</span>
            </div>
        </div>

        <!--筛选结果-->
        <div class="el-container">
            <el-table :data="tableData" v-loading="isDataLoading" border class="text-center">
                <el-table-column label="SKU" prop="goodSn"></el-table-column>
                <el-table-column label="所属真实仓库" prop="realWhName"></el-table-column>
                <el-table-column label="同步库存数" prop="omsStock"></el-table-column>
                <el-table-column label="可售公有占用库存" prop="publicOccupyStock"></el-table-column>
                <el-table-column label="可售公有库存" prop="publicStock"></el-table-column>
                <el-table-column label="可售私有占用库存" prop="privateOccupyStock"></el-table-column>
                <el-table-column label="可售私有库存" prop="privateStock"></el-table-column>
                <el-table-column label="同步来源">
                    <template scope="scope">
                        {{ scope.row.sourceType == '1' ? 'OMS更新' : '人工更新' }}
                    </template>
                </el-table-column>
                <el-table-column label="记录说明" width="220">
                    <template scope="scope">
                        {{scope.row.publicStock < 0 || scope.row.privateStock < 0 ? '更新库存数小于网站占用库存' : '--'}}
                    </template>
                </el-table-column>
                <el-table-column label="同步时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.logTime / 1000, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.pageNo" :page-sizes="[10, 20, 50]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
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
                filter: {
                    pageNo: 1,
                    pageSize: 10,
                    goodSn: '',
                    logType: '',
                    sourceType: '',
                    date: []
                },
                filterRules: {
                    date: [{required: true, validator: validateFilterDate ,trigger: 'submit'}],
                },
                totalCount: 0,
            };
        },
        created() {
            this.initDate();
            this.getListData();
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

                //
                if (this.filter.date.length > 0) {
                    params.startTime = this.filter.date[0].getTime();   //获取毫秒
                    params.endTime = this.filter.date[1].getTime();
                }

                delete params.date;
                this.isDataLoading = true;

                this.$http.get('stock/stock/query-oms-stock-sync-log-list', { params: params }).then(res => {
                        if (res.body.code === 0) {
                            this.tableData = res.body.data.list;
                            this.totalCount = res.body.data.totalCount;
                        } else {
                            this.tableData = [];
                            this.totalCount = 0;
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
            submitSearch() {
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        this.filter.pageNo = 1;
                        this.getListData();
                    }
                });
            },
            resetFrom() {
                this.$refs['searchForm'].resetFields();
            },
            changePage(value) {
                this.filter.pageNo = value;
                this.getListData();
            },
            changePageSize(value) {
                this.filter.pageSize = value;
                this.getListData();
            },
        }

    }
</script>

<style lang="less">
    .ml30 {
        margin-left: 30px;
    }

    .notice {
        color: #FF6600;
        font-size: 13px;
    }

    .el-table__header-wrapper{
        td,th{text-align: center;}
    }
</style>
