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
            <div class="el-sub-container">
                <el-button type="primary" :disabled="checkedRow.length === 0" @click="edit()">批量发放</el-button>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading" @selection-change="changeSelect">
                <el-table-column type="selection" v-if="option.activityType == '3'"></el-table-column>
                <el-table-column type="index" label="序号" width="90px"></el-table-column>
                <el-table-column prop="userNick" label="会员昵称"></el-table-column>
                <el-table-column prop="email" label="会员邮箱" width="200px"></el-table-column>
                <el-table-column prop="userLevel" label="会员等级"></el-table-column>
                <el-table-column prop="useCount" label="参与次数"></el-table-column>
                <el-table-column prop="remainUseCount" label="剩余次数">
                    <template scope="scope">
                        <span v-if="scope.row.remainUseCount * 1 < 999999">{{scope.row.remainUseCount}}</span>
                        <span v-else>——</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="订单号" v-if="option.activityType != '3'"></el-table-column>
                <el-table-column prop="orderAmount" label="订单金额" v-if="option.activityType != '3'"></el-table-column>
                <el-table-column prop="paidAmount" label="实付金额" v-if="option.activityType != '3'"></el-table-column>
                <el-table-column prop="activityTypeName" label="优惠类型" v-if="option.activityType != '3'">
                </el-table-column>
                <el-table-column label="奖品名称" v-if="option.activityType == '3'">
                    <template scope="scope">
                        <span>{{scope.row.prizeRank}}等奖</span>
                    </template>
                </el-table-column>
                <el-table-column label="优惠内容" >
                    <template scope="scope">
                        <p v-if="option.activityType != 3" v-for="(item, index) in scope.row.proirityDetailList">
                            <span>{{item.preferentialTypeName}}</span>:
                            <span>{{item.preferentialValue}}</span>
                            <span v-if="item.preferentialType * 1 >= 3">X {{item.singleCount}}</span>
                        </p>
                        <p v-if="option.activityType == 3">
                            <span>{{scope.row.prizeLogTypeName}}: {{scope.row.prizeLogValue}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="中奖时间" width="170px" v-if="option.activityType == '3'">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="发放状态" v-if="option.activityType == '3'">
                    <template scope="scope">
                        <span v-if="scope.row.status == 0">未发放</span>
                        <span v-if="scope.row.status == 1">已发放</span>
                    </template>
                </el-table-column>
                <el-table-column label="发放方式" v-if="option.activityType == '3'">
                    <template scope="scope">
                        <span>{{wayOpt[scope.row.grantWay]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发放时间" width="170px" v-if="option.activityType == '3'">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.grantTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="参与时间" width="170px" v-if="option.activityType != '3'">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if="option.activityType == '3'">
                    <template scope="scope">
                        <el-button v-if="scope.row.status == 0 && self.showAction_('promotion/activity-goods/grant-prizes')" type="primary" size="small" @click="edit(scope.row.id)">发放</el-button>
                        <span v-else>——</span>
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
                status: '',
                prizeType: '',
                prizeRank: '',
                activityType: this.$route.query.activityType,
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
                '0': '价格',
                '1': '折扣',
                '2': '积分',
                '3': 'coupon',
                '4': '商品',
                '5': '抽奖次数'
            },
            wayOpt: {
                '0': '自动发放',
                '1': '人工发放',
                '2': '主动领取',
            },
            couponOpt: {},
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

            this.$http.get('promotion/public/coupon-template-ids-at-system').then(res => {
                if (res.body.code === 0) {
                    let temp = {};
                    res.body.data.forEach(item => {
                        temp[item.templateId] = item.templateName + item.strategys;
                    });
                    this.couponOpt = temp;
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
            this.$http.get('promotion/activity/activity-user', {params: params}).then(res => {
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
        edit (id) {
            let params = {};
            if (typeof id != 'undefined') {
                params.ids = [id];

            } else {
                params.ids = [];
                this.checkedRow.forEach(item => {
                    params.ids.push(item.id);
                });
            }
            this.$confirm('是否确认发放?', '奖品发放', {
                type: 'warning'
            }).then(() => {
                this.$http.post('promotion/activity-goods/grant-prizes', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message.info('已取消!')
            });
        },
        changeSelect (val) {
            this.checkedRow = val;
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
