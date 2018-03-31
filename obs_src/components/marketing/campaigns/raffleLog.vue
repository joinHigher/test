<!-- 获取次数发放日志 -->
<template>
    <div>
        <div class="el-container">
            <div class="part-list-title">
                <span>{{titleOpt.name}}</span>
                <span>{{self.timeZone_(titleOpt.startTime, self.$store.getters.getTimeZone)}} 至 {{self.timeZone_(titleOpt.endTime, self.$store.getters.getTimeZone)}}</span>
                <span>{{titleOpt.activityType}}</span>
                <span>由 {{titleOpt.creatorName}} 创建</span>
            </div>
        </div>
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <el-form-item label="会员邮箱" prop="email">
                    <el-input v-model.trim="option.email"></el-input>
                </el-form-item>
                <el-form-item label="参与时间" prop="editDate">
                    <el-date-picker v-model="option.editDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.editDate)"></el-date-picker>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column type="index" label="序号" width="90"></el-table-column>
                <el-table-column type="userNick" label="会员昵称" width="100"></el-table-column>
                <el-table-column prop="email" label="会员邮箱" width="200"></el-table-column>
                <el-table-column prop="userLevel" label="会员等级"></el-table-column>
                <el-table-column prop="count" label="赠送次数"></el-table-column>
                <el-table-column prop="typeName" label="赠送渠道"></el-table-column>
                <el-table-column prop="orderSn" label="订单号"></el-table-column>
                <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
                <el-table-column label="赠送时间" width="170">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            checkedRow: [],
            option: {
                page: 1,
                page_size: 10,
                email: '',
                editDate: [],
                startTime: '',
                endTime: '',
                activityId: this.$route.query.activityId
            },
            self: this,
            tableLoading: false,
            total: 10,
            tableData: [],
            titleOpt: {
                name: '',
                startTime: '',
                endTime: '',
                type: 1,
                creatorName: ''
            },
            typeOpt: {
                '1': '后置礼包',
                '2': '会员',
                '3': '订单',
                '4': 'EDM',
            }
        };
    },
    created () {
        this.getTitle();
        this.getData();
    },
    methods: {
        getTitle () {
            this.$http.get('promotion/activity-goods/simple-activity',{params: {activityId: this.option.activityId}}).then(res => {
                if (res.body.code === 0) {
                    this.titleOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            let timeArr = this.timeZone_(this.option.editDate, this.$store.getters.getTimeZone);
            this.option.startTime = timeArr[0];
            this.option.endTime = timeArr[1];

            let params = {};
            for (let i in this.option) {
                if (i !== 'editDate') {
                    params[i] = this.option[i];
                }
            }

            this.tableLoading = true;
            this.$http.get('promotion/activity/raffle-give-count-logs', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.total = res.body.data.totalCount;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.page_size = val;
            this.getData();
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
        }
    }
}
</script>

<style lang="less">
    .part-list-title {
        span {
            display: inline-block;
            margin-right: 20px;

            &:first-child {
                font-size: 20px;
            }
        }
    }
</style>