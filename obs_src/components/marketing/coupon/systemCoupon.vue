<template>
    <div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <router-link v-if="self.showAction_('promotion/coupon/add')" :to="{name: 'marketing_coupon_couponSet', query: {type: 1}}" class="el-button el-button--primary">
                    添加系统Coupon
                </router-link>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="templateId" label="模板ID"></el-table-column>
                <el-table-column prop="code" label="模板码"></el-table-column>
                <el-table-column prop="couponName" label="coupon名称"></el-table-column>
                <el-table-column prop="templateName" label="Coupon模板类型"></el-table-column>
                <el-table-column label="优惠内容">
                    <template scope="scope">
                        <div v-for="(item, index) in scope.row.strategysList" :key="index">
                            <span v-if="countForm(scope.row) == 0">无门槛减</span>
                            <span v-if="countForm(scope.row) == 1">一口价</span>
                            <span v-if="countForm(scope.row) == 2">满</span>
                            <span v-if="countForm(scope.row) == 3">每满</span>
                            {{item.value1}}<span v-if="scope.row.fullCondition == 2">件</span>
                            <span v-if="item.value2">减{{item.value2}}</span>
                            <span v-if="scope.row.discountForm == 3">%</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="生效天数/生效时间" width="180">
                    <template scope="scope">
                        <span v-if="scope.row.dateType == 2">{{scope.row.effectDays}}天</span>
                        <span v-if="scope.row.dateType == 1">
                            {{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}} -
                            {{self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone)}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="limitCount" label="生成Coupon的总使用次数"></el-table-column>
                <el-table-column prop="userLimitCount" label="生成Coupon的单用户使用次数"></el-table-column>
                <el-table-column prop="grantTotalCount" label="Coupon发放总数"></el-table-column>
                <el-table-column prop="grantUserCount" label="单用户最多可领"></el-table-column>
                <el-table-column prop="alreadyGrantTotalCount" label="实际发放数量"></el-table-column>
                <el-table-column prop="creatorName" label="操作人"></el-table-column>
                <el-table-column label="可用状态">
                    <template scope="scope">
                        <span v-if="scope.row.status == 1">可用</span>
                        <span v-if="scope.row.status == 2">关闭</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('promotion/coupon/edit')" 
                        type="primary" size="small" @click="getInfo(scope.row, 0)">编辑</el-button>
                        <el-button type="primary" size="small" @click="copyCoupon(scope.row)">复制</el-button>
                        <el-button v-if="self.showAction_('promotion/coupon/delete')" type="danger" size="small" @click="removeItem(scope.row)">
                            <span v-if="scope.row.status == 2">启用</span>
                            <template v-else>
                                <span v-if="scope.row.startTime <= time && scope.row.endTime > time">停用</span>
                                <span v-else>删除</span>
                            </template>
                        </el-button>
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
            time: this.timeZone_(new Date(), this.$store.getters.getTimeZone),
            option: {
                page: 1,
                page_size: 10,
            },
            self: this,
            tableLoading: false,
            total: 10,
            tableData: []
        };
    },
    created () {
        this.getData();
    },
    methods: {
        countForm(obj) {
            if (obj.type == 9 || obj.type == 13) {
                // 直减
            } else if (obj.type == 10 || obj.type == 14) {
                // 一口价
                return 1;
            } else if (obj.discountForm == 1 && (obj.type == 8 || obj.type == 12)) {
                // 满减封顶
                return 2;
            } else {
                // 其他
                return 3;
            }
        },
        getData () {
            this.tableLoading = true;
            this.$http.get('promotion/template/sys-lists', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    data.list.forEach(item => {
                        let list = item.strategys.split(',');
                        let temp = [];
                        list = list.map(sub => {
                            let val = sub;
                            if (sub.indexOf('-') != -1) {
                                let arr = sub.split('-');

                                return {
                                    value1: arr[0],
                                    value2: arr[1],
                                };
                            } else {
                                return {
                                    value1: val,
                                    value2: '',
                                }
                            }
                        });

                        item.strategysList = list;
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
        // 删除停用启用
        removeItem (row) {
            let params = {
                code: row.code,
            };
            let tip = '删除此coupon码,则此coupon码将不可使用,是否确认删除?';
            if (row.status == 2) {
                // 启用
                tip = '确认启用?';
                params.status = 1;
            } else if(row.startTime <= this.time && row.endTime > this.time) {
                // 停用
                tip = '停用系统Coupon可能导致相关业务无法顺利进行，请确认当前系统Coupon没有被进行中调用';
                params.status = 2;
            } else {
                // 删除
                params.status = 0;
            }
            this.$confirm(tip, '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('promotion/coupon/delete', params).then(res => {
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
                    message: '已取消删除!'
                });
            });
        },
        // 详情
        getInfo (row, flag) {
            this.$router.push({
                name: 'marketing_coupon_couponSet',
                query: {
                    code: row.code,
                    templateId: row.templateId,
                    editable: flag,
                }
            });
        },
        // 复制
        copyCoupon(row) {
            this.$router.push({
                name: 'marketing_coupon_couponSet',
                query: {
                    code: row.code,
                    templateId: row.templateId,
                    editable: 0,
                    copy: 1,
                }
            });
        },
        // changeShow (row) {
        //     let str = '';
        //     if (row.status == 1) {
        //         str = '不'
        //     }
        //     this.$confirm('是否' + str + '展示该模板？').then(() => {
        //         let params = {
        //             id: row.id,
        //             sysTemplateStatus: row.status == 1 ? 0 : 1
        //         }
        //         this.$http.post('promotion/coupon/toggle-sys-coupon-template', params).then(res => {
        //             if (res.body.code === 0) {
        //                 this.$set(row, 'status', params.sysTemplateStatus);
        //                 this.$message.success(res.body.message);
        //             } else {
        //                 this.$message.error(res.body.message);
        //             }
        //         })
        //     }).catch(err => {

        //     });
        // },
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
    }
}
</script>

<style>

</style>
