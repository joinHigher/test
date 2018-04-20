<template>
    <div>
        <div class="el-container">
            <div class="el-sub-container">
                <el-row>
                    <el-col :span="12">
                        <el-alert title="在未单独设置月份规则的时候，使用默认活动规则进行奖励发放" :closable="false" type="info" show-icon></el-alert>
                    </el-col>
                    <el-col :span="12" class="text-right">
                        <el-button type="primary" @click="add">新增签到活动</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="el-sub-container text-left">
                <el-button type="primary" v-if="option.desc === 2" @click="sort(1)">有效时间顺序</el-button>
                <el-button type="primary" v-if="option.desc === 1" @click="sort(2)">有效时间倒序</el-button>
            </div>
            <el-table :data="tableData" border>
                <el-table-column prop="name" label="活动名称"></el-table-column>
                <el-table-column label="活动类型">
                    <template scope="scope">
                        <span v-if="scope.row.type === 1">连续签到</span>
                        <span v-else>累计签到</span>
                    </template>
                </el-table-column>
                <el-table-column label="有效时间">
                    <template scope="scope">
                       <span v-if="scope.row.isDefault === 0">
                           {{self.timeZone_(scope.row.validStartTime, self.$store.getters.getTimeZone)}}
                           <br>
                           {{self.timeZone_(scope.row.validEndTime, self.$store.getters.getTimeZone)}}
                           <span v-if="scope.row.validEndTime && (scope.row.validEndTime * 1000 < (new Date().getTime()))">(已结束)</span>
                       </span>
                       <span v-else>默认</span>
                    </template>
                </el-table-column>
                <el-table-column label="规则摘要">
                    <template scope="scope">
                        <p v-for="(item, index) in scope.row.relationList" class="relationList">
                            <span v-if="scope.row.type === 1">连续签到 {{item.startDays}} - {{item.endDays}} 天</span>
                            <span v-if="scope.row.type === 2">累计签到 {{item.cumulatDays}} 天</span>
                            <br>
                            <span v-if="scope.row.type === 1 && item.everyDayRewardList.length > 0">
                                每天获得
                                <span v-for="(reward, _index) in item.everyDayRewardList" :key="_index">
                                    <span v-if="reward.rewardType == 1">{{reward.pointNum}}积分</span>
                                    <span v-else>{{reward.couponTempId}} off coupon</span>
                                    <span v-if="_index !== item.everyDayRewardList.length -1">,</span>
                                </span>
                                <br>
                            </span>
                            <span v-if="item.lastDayRewardList.length > 0">
                                最后一天获得
                                <span v-for="(reward, _index) in item.lastDayRewardList" :key="_index">
                                    <span v-if="reward.rewardType == 1">{{reward.pointNum}}积分</span>
                                    <span v-else>{{reward.couponTempId}} off coupon</span>
                                    <span v-if="_index !== item.everyDayRewardList.length -1">,</span>
                                </span>
                                <br>
                            </span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.sysUpdateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作人"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="edit(scope.row)">修改</el-button>
                        <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="1" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableData: [],
            tableLoading: false,
            total: 10,
            option: {
                pageSize: 10,
                pageNo: 1,
                desc: 1
            }
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.$http.get('user/sign/list', {params: this.option}).then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data.data;
                    this.total = res.body.data.totalCount;
                }
            })
        },
        add () {
            this.$router.push({
                name: 'member_checkInAdd'
            });
        },
        edit (row) {
            this.$router.push({
                name: 'member_checkInEdit',
                query: {
                    id: row.id
                }
            });
        },
        sort (val) {
            this.option.desc = val;
            this.getData();
        },
        remove (row) {
            this.$confirm('是否删除该项?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('user/sign/delete', {id: row.id}).then(res => {
                    if (res.body.code == 0) {
                        this.getData();
                        this.$message.success(res.body.message);
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除!'
                });          
            });
        },
        changePage(value) {
            this.option.pageNo = value
            this.getData();
        },
        changePageSize(value, name) {
            this.option.pageSize = value
            this.getData();
        },
    }
}
</script>
<style lang="less">
    .relationList {
        margin-top: 10px;

        &:first-child {
            margin-top: 0;
        }
    }
</style>