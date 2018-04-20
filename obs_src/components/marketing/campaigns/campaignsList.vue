<!-- 活动列表 -->
<template>
    <div>
        <div class="el-container">
            <el-form label-width="100px" inline ref="searchForm" :model="option">
                <el-form-item label="适用渠道" prop="pipelineCode">
                    <el-select clearable filterable v-model="option.pipelineCode">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动类型" prop="activityType">
                    <el-select clearable filterable v-model="option.activityType" placeholder="请选择">
                        <el-option v-for="item in typeOpt" :key="item.id" :value="item.value" :label="item.text"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动名称" prop="activityName">
                    <el-input v-model.trim="option.activityName"></el-input>
                </el-form-item>
                <el-form-item label="操作人" prop="updatorName">
                    <el-input v-model.trim="option.updatorName"></el-input>
                </el-form-item>
                <el-form-item label="活动状态" prop="activityStatus">
                    <el-select clearable filterable v-model="option.activityStatus" >
                        <el-option v-for="item in statusOpt" :key="item.id" :value="item.value" :label="item.text"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="开始时间" prop="startDate">
                        <el-date-picker v-model="option.startDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.startDate)"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endDate">
                        <el-date-picker v-model="option.endDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.endDate)"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="text-right">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <router-link :to="{name: 'marketing_campaigns_campaignsEdit'}" class="el-button el-button--primary">
                    创建活动
                </router-link>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="activityId" label="活动ID"></el-table-column>
                <el-table-column prop="name" label="活动名称"></el-table-column>
                <el-table-column prop="activityType" label="活动类型"></el-table-column>
                <el-table-column label="生效渠道">
                    <template scope="scope">
                        {{pipeOpt[scope.row.pipelineCode]}}
                    </template>
                </el-table-column>
                <el-table-column label="生效店铺">
                    <template scope="scope">
                        <span v-for="(item, index) in scope.row.shopList" :key="index">
                            {{storeOpt[item]}}
                            <span v-if="index != scope.row.shopList.length - 1">;</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="活动商品">
                    <template scope="scope">
                        <router-link v-if="scope.row.type == '3'" :to="{name: 'marketing_campaigns_setPrize',query: {activityId: scope.row.activityId}}">
                            查看奖品
                        </router-link>
                        <router-link v-else :to="{name: 'marketing_campaigns_campaignsGoods',query: {activityId: scope.row.activityId, type: scope.row.type}}">
                            查看详情
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="activityStatus" label="活动状态"></el-table-column>
                <el-table-column prop="updatorName" label="最后操作人"></el-table-column>
                <el-table-column prop="updatorName" label="创建主体">
                    <template scope="scope">
                        <span v-if="scope.row.sponsor && scope.row.sponsor !== '0'">{{scope.row.sponsor}}</span>
                        <span v-else>GB</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button :disabled="scope.row.status == 1" type="primary" size="small" @click="goEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" size="small" @click="copy(scope.row)">复制</el-button>
                        <router-link :to="{name: 'marketing_campaigns_participateList', query: {activityId: scope.row.activityId, id: scope.row.id, activityType: scope.row.type}}" class="el-button el-button--info el-button--small">
                            参与名单
                        </router-link>
                        <el-button type="info" size="small" v-if="scope.row.type == 3" @click="goLog(scope.row)">赠送日志</el-button>
                        <el-button :disabled="scope.row.status == 1" v-if="self.showAction_('promotion/activity/delete')" type="danger" size="small" @click="removeItem(scope.row)">停用</el-button>
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
            option: {
                page: 1,
                page_size: 10,
                activityType: '',
                activityName: '',
                updatorName: '',
                activityStatus: '',
                startDate: [],
                startTimeFrom: '',
                startTimeTo: '',
                endDate: [],
                endTimeFrom: '',
                endTimeTo: '',
                pipelineCode: '',
            },
            self: this,
            typeOpt: {},
            statusOpt: {},
            tableLoading: false,
            total: 10,
            tableData: [],
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        },
        storeOpt () {
            return this.$store.getters.getStore.obj;
        },
    },
    created () {
        this.getOpt();
        this.getData();
    },
    methods: {
        getOpt () {
            this.$http.get('promotion/index/public-get-dicts', {params: {names: 'activityType,activityStatus'}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;

                    for (let i in data) {
                        let item = data[i];
                        if (item.name === 'activityType') {
                            this.typeOpt[item.value] = item;
                        }
                        if (item.name === 'activityStatus') {
                            this.statusOpt[item.value] = item;
                        }
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            let timeArr1 = this.timeZone_(this.option.startDate, this.$store.getters.getTimeZone);
            this.option.startTimeFrom = timeArr1[0];
            this.option.startTimeTo = timeArr1[1];

            let timeArr2 = this.timeZone_(this.option.endDate, this.$store.getters.getTimeZone);
            this.option.endTimeFrom = timeArr2[0];
            this.option.endTimeTo = timeArr2[1];

            let params = {};
            for (let i in this.option) {
                if (i !== 'startDate' && i !== 'endDate') {
                    params[i] = this.option[i];
                }
            }

            this.tableLoading = true;
            this.$http.get('promotion/activity/lists', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    data.list.forEach(item => {
                        item.shopList = item.shopCodes.split(',');
                    })
                    this.tableData = data.list;
                    this.total = data.totalCount;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        removeItem (row) {
            if (row.activityStatus == '进行中') {
                this.$alert('活动进行中，停用活动可能造成用户投诉，请谨慎操作', {
                    type: 'warning',
                    callback: action => {
                        if (action == 'confirm') {
                            this.$confirm('是否停用该项?', '提示', {
                                type: 'warning'
                            }).then(() => {
                                this.$http.post('promotion/activity/delete', {id: row.id}).then(res => {
                                    if (res.body.code == 0) {
                                        this.getData();
                                        this.$message({
                                            type: 'success',
                                            message: res.body.message
                                        });
                                    } else {
                                        this.$message.error(res.body.message);
                                    }
                                });
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消停用!'
                                });
                            });
                        }
                    }
                })
            } else {
                this.$confirm('是否停用该项?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('promotion/activity/delete', {id: row.id}).then(res => {
                        if (res.body.code == 0) {
                            this.getData();
                            this.$message({
                                type: 'success',
                                message: res.body.message
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消停用!'
                    });
                });
            }
        },
        copy(row) {
            this.$router.push({
                name: 'marketing_campaigns_campaignsEdit',
                query: {
                    activityId: row.activityId,
                    id: row.id,
                    type: row.type,
                    copy: 1,
                }
            });
        },
        goEdit (row) {
            let time = this.timeZone_(new Date(), this.$store.getters.getTimeZone);
            if (row.startTime <= time && row.endTime > time) {
                // status = '进行中';
                this.$alert('活动进行中，修改活动可能造成用户投诉，请谨慎操作', {
                    type: 'warning',
                    callback: action => {
                        if (action == 'confirm') {
                            this.$router.push({
                                name: 'marketing_campaigns_campaignsEdit',
                                query: {
                                    activityId: row.activityId,
                                    id: row.id,
                                    type: row.type
                                }
                            });
                        }
                    }
                });
            } else if(row.startTime > time) {
                // status = '未开始'
                this.$router.push({
                    name: 'marketing_campaigns_campaignsEdit',
                    query: {
                        activityId: row.activityId,
                        id: row.id,
                        type: row.type,
                        copy: 1,
                        unStart: 1,
                    }
                });
            } else {
                // 其他
                this.$router.push({
                    name: 'marketing_campaigns_campaignsEdit',
                    query: {
                        activityId: row.activityId,
                        id: row.id,
                        type: row.type,
                    }
                });
            }

            // if (row.activityStatus == '进行中') {
            //     this.$alert('活动进行中，修改活动可能造成用户投诉，请谨慎操作', {
            //         type: 'warning',
            //         callback: action => {
            //             if (action == 'confirm') {
            //                 this.$router.push({
            //                     name: 'marketing_campaigns_campaignsEdit',
            //                     query: {
            //                         activityId: row.activityId,
            //                         id: row.id,
            //                         type: row.type
            //                     }
            //                 });
            //             }
            //         }
            //     });
            // } else {
            //     this.$router.push({
            //         name: 'marketing_campaigns_campaignsEdit',
            //         query: {
            //             activityId: row.activityId,
            //             id: row.id,
            //             type: row.type
            //         }
            //     });
            // }

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
        },
        goLog (row) {
            this.$router.push({
                name: 'marketing_campaigns_raffleLog',
                query: {
                    activityId: row.activityId,
                }
            })
        },
    }
}
</script>

<style>
</style>
