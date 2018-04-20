<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="名单类型：" prop="type">
                    <el-select v-model="filterForm.type" clearable placeholder="请选择" @change="changeType">
                        <el-option label="黑名单" value="1"></el-option>
                        <el-option label="审核名单" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="名单分类：" prop="list_type">
                    <el-select v-model="filterForm.list_type" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in typeText" :label="item" :value="index" :key="index" v-show="!filterForm.type ? true : (filterForm.type == 1 ? (index <= 2) : (index > 2)) "></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="判断类型：" prop="judgeType">
                    <el-select v-model="filterForm.judgeType" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in judgeTypeText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词查询：" prop="judgeContent">
                    <el-input v-model="filterForm.judgeContent" placeholder="请输入判断内容关键词进行查询"></el-input>
                </el-form-item>

                <el-form-item label="国家：" prop="countryCode">
                    <el-select v-model="filterForm.countryCode" clearable filterable placeholder="请选择">
                        <el-option v-for="(item, index) in countrys" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="州/省：" prop="province">
                    <el-input v-model="filterForm.province"></el-input>
                </el-form-item>
                <el-form-item label="城市：" prop="city">
                    <el-input v-model="filterForm.city"></el-input>
                </el-form-item>
                <el-form-item label="" prop="selectByUpdate">
                    <el-select v-model="filterForm.selectByUpdate" clearable placeholder="请选择">
                        <el-option label="添加时间" value="0" ></el-option>
                        <el-option label="编辑时间" value="1" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="daterange">
                    <el-date-picker v-model="filterForm.daterange" type="datetimerange" placeholder="选择日期范围"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button>
                </el-form-item>
            </el-form>  


            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column prop="orderSn" label="订单编号"></el-table-column>
                <el-table-column label="名单类型">
                    <template scope="scope">
                        {{ scope.row.blacklistType > 2 ? '审核名单' : '黑名单' }}
                    </template>
                </el-table-column>
                <el-table-column label="名单分类">
                    <template scope="scope">
                        {{ typeText[scope.row.blacklistType] }}
                    </template>
                </el-table-column>
                <el-table-column label="判断类型">
                    <template scope="scope">
                        {{ judgeTypeText[scope.row.judgeType] }}
                    </template>
                </el-table-column>
                <el-table-column prop="judgeContent" label="判断内容"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="国家">
                    <template scope="scope">
                        {{ scope.row.countryCode ? countrys[scope.row.countryCode] : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="province" label="州/省"></el-table-column>
                <el-table-column prop="city" label="城市"></el-table-column>
                <el-table-column prop="postcode" label="邮编"></el-table-column>
                <el-table-column prop="createUser" label="添加人"></el-table-column>
                <el-table-column label="添加时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.createTime, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUser" label="最后编辑人"></el-table-column>
                <el-table-column label="最后编辑时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.updateTime, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column  label="状态">
                    <template scope="scope">
                        {{ scope.row.lockStatus ? '启用' : '禁止' }}
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
                    type: '', //名单类型 
                    list_type: '', //名单分类
                    judgeType: '', // 判断类型
                    judgeContent: '', //关键词查询
                    countryCode: '', // 国家
                    province: '', // 省/州
                    city: '', // 城市
                    selectByUpdate: '0', // 事件帅选类型
                    daterange: '' // 时间范围
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                judgeTypeText: {
                    '1': '顾客Email',
                    '5': '收件人Email',
                    '3': '详细地址'
                },
                typeText: {
                    '1': '欺诈类黑名单',
                    '2': '恶意类黑名单',
                    '3': '普通类黑名单',
                    '4': '客服类黑名单',
                    '5': '钓鱼类黑名单',
                    '6': '测试类黑名单'
                },
                tempTypeText: {},
                countrys: [],
                tableData: [],
            }
        },
        created() {
            this.getCountrys();
            this.initData();
        },
        methods: {
            initData() {
                this.getListData();
            },
            // 获取支付国家列表
            getCountrys() {
                this.$http.get('pay/public/countrys').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    let data = res.body.data;
                    let countrys = {};
                    data.forEach((item) => {
                        countrys[item.countryCode] = item.countryName
                    })
                    this.countrys = countrys;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
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
                if(params.list_type) {
                    params.blacklistTypes = [params.list_type];
                } else {
                    switch(params.type) {
                        case '1': 
                            params.blacklistTypes = [1,2];
                        break;
                        case '2':
                            params.blacklistTypes = [3,4,5,6];
                        break;
                    }
                }
                delete params.list_type;
                delete params.type;
                if(params.daterange.length === 2) {
                    let time1 = this.timeZone_(params.daterange[0], this.$store.getters.getTimeZone);
                    let time2 = this.timeZone_(params.daterange[1], this.$store.getters.getTimeZone);
                    params.startTime = time1;
                    params.endTime = time2;
                }
                delete params.daterange;
                this.dataLoading = true;
                this.$http.get('pay/risk/black-list', { params: params }).then(res => {
                    this.dataLoading = false;
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
            // 改变名单类型
            changeType(val) {
                this.filterForm.list_type = '';
            }
        }
    }
</script>
<style lang="less">

</style>
