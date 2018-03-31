<!-- coupon列表 -->
<template>
    <div>
        <div class="el-container">
            <el-form label-width="140px" inline ref="searchForm" :model="option">
                <el-form-item label="适用渠道" prop="pipelineCode">
                    <el-select clearable filterable v-model="option.pipelineCode" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Coupon模板" prop="templateId">
                    <el-select clearable filterable v-model="option.templateId" placeholder="请选择">
                        <el-option v-for="item in tempOpt" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统Coupon" prop="templateCode">
                    <el-input v-model.trim="option.templateCode" placeholder="系统coupon code"></el-input>
                </el-form-item>
                <el-form-item label="Coupon码" prop="code">
                    <el-input v-model.trim="option.code"></el-input>
                </el-form-item>
                <el-form-item label="操作人" prop="creatorName">
                    <el-input v-model.trim="option.creatorName"></el-input>
                </el-form-item>
                <el-form-item label="生效状态" prop="effectStatus">
                    <el-select v-model="option.effectStatus">
                        <el-option v-for="(item, index) in effectOpt" :value="index" :key="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间" prop="sDate">
                    <el-date-picker v-model="option.sDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.sDate)"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="eDate">
                    <el-date-picker v-model="option.eDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.eDate)"></el-date-picker>
                </el-form-item>

                <div class="text-right">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <el-button type="danger" :disabled="checkRow.length === 0" class="fl" @click="bitchRemove">批量删除</el-button>
                <router-link v-if="self.showAction_('promotion/coupon/add')" :to="{name: 'marketing_coupon_couponSet'}" class="el-button el-button--primary">
                    新增Coupon
                </router-link>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading" @selection-change="changeCheck" @row-click="clickRow" ref="dataTable" width="100%">
                <el-table-column type="selection" :selectable="chcekAble"></el-table-column>
                <el-table-column prop="code" label="Coupon码"></el-table-column>
                <el-table-column prop="templateName" label="Coupon码模板"></el-table-column>
                <el-table-column prop="strategys" label="Coupon优惠"></el-table-column>
                <el-table-column label="开始时间" width="170">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" width="170">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="总使用次数">
                    <template scope="scope">
                        <span v-if="scope.row.limitCount == 0">无限制</span>
                        <span v-else>{{scope.row.limitCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userLimitCount" label="单人使用次数"></el-table-column>
                <el-table-column prop="useCount" label="已使用次数"></el-table-column>
                <el-table-column label="使用情况">
                    <template scope="scope">
                        {{usedOpt[scope.row.usedStatus]}}
                    </template>
                </el-table-column>
                <el-table-column prop="creatorName" label="最后操作人"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="生效渠道">
                    <template scope="scope">
                        <span v-for="(item, index) in scope.row.pipeList" :key="index">
                            {{pipeOpt[item]}}
                            <span v-if="index != scope.row.pipeList.length - 1">;</span>
                        </span>
                    </template>
<!--                     <template scope="scope">
                        {{pipeOpt[scope.row.pipelineCode]}}
                    </template> -->
                </el-table-column>
                <el-table-column label="前台展示状态">
                    <template scope="scope">
                         {{effectOpt[scope.row.codeStatus]}}
                    </template>
                </el-table-column>
                <el-table-column label="系统CouponCode">
                    <template scope="scope">
                         <span v-if="scope.row.couponSystemTemplate && scope.row.couponSystemTemplate != '0'">{{scope.row.couponSystemTemplate}}</span>
                         <span v-else>——</span>
                    </template>
                </el-table-column>
                <el-table-column label="来源">
                    <template scope="scope">
                        <span v-if="scope.row.couponResource">{{resourceOpt[scope.row.couponResource]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所属店铺" width="180">
                    <template scope="scope">
                        <span v-for="(item, index) in scope.row.shopList" :key="index">
                            {{storeOpt[item]}}
                            <span v-if="index != scope.row.shopList.length - 1">;</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="创建主体">
                    <template scope="scope">
                        <span v-if="scope.row.sponsor">{{scope.row.sponsor}}</span>
                        <span v-else>GB平台</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" column-key="handle" fixed="right">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="getInfo(scope.row, 1)">详情</el-button>
                        <el-button v-if="self.showAction_('promotion/coupon/edit')" :disabled="scope.row.couponTemplateType == 1 || scope.row.couponSystemTemplate != 0" type="primary" size="small" @click="getInfo(scope.row, 0)">编辑</el-button>
                        <el-button type="primary" size="small" @click="copyCoupon(scope.row)">复制</el-button>
                        <el-button v-if="self.showAction_('promotion/coupon/delete')" :disabled="scope.row.couponTemplateType == 1" :type="scope.row.status == 2 ? 'success':'danger'" size="small" @click="removeItem(scope.row)">
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
                templateId: '',
                code: '',
                creatorName: '',
                sDate: [],
                startDate: '',
                startDateEnd: '',
                eDate: [],
                endDate: '',
                endDateEnd: '',
                effectStatus: '',
                pipelineCode: '',
                templateCode: '',
            },
            resourceOpt: {
                '1': '手工创建',
                '2': '会员创建',
                '3': '邮件订阅',
                '4': '奖品发放',
                '5': '领券中心',
            },
            self: this,
            tableLoading: false,
            total: 10,
            checkRow: '',
            tableData: [],
            tempOpt: [],
            effectOpt: {
                '0': '已使用完',
                '1': '可用',
                '2': '已过期',
            },
            usedOpt: {
                '0': '未使用',
                '1': '使用中',
                '2': '已使用完'
            }
        };
    },
    computed: {
        pipeOpt () {
            return this.$store.getters.getPipe.obj;
        },
        storeOpt () {
            return this.$store.getters.getStore.obj;
        }
    },
    created () {
        this.getTempOpt();
        this.getData();
    },
    methods: {
        chcekAble (row) {
            if (row.couponTemplateType == 0) {
                return true;
            } else {
                return false;
            }
        },
        getTempOpt () {
            let params = {};
            params.lang = 'en';
            params.couponTemplateType = '0';
            params.templateId = '0';

            this.$http.get('promotion/coupon/public-coupon-select', {params: params}).then(res => {
                if (res.body.code === 0) {
                    this.tempOpt = res.body.data.listTemplateCoupon;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        getData () {
            let timeArr1 = this.timeZone_(this.option.sDate, this.$store.getters.getTimeZone);
            this.option.startDate = timeArr1[0];
            this.option.startDateEnd = timeArr1[1];

            let timeArr2 = this.timeZone_(this.option.eDate, this.$store.getters.getTimeZone);
            this.option.endDate = timeArr2[0];
            this.option.endDateEnd = timeArr2[1];

            let params = {};
            for (let i in this.option) {
                if (i !== 'sDate' && i !== 'eDate') {
                    params[i] = this.option[i];
                }
            }

            this.tableLoading = true;

            this.$http.get('promotion/coupon/lists', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data.list;
                    // 添加是否系统coupon标识
                    data.forEach(item => {
                        if (item.type >= 8 && item.type <= 11) {
                            item.couponTemplateType = 0;
                        } else {
                            item.couponTemplateType = 1;
                        }

                        item.shopList = item.shopCode ? item.shopCode.split(',') : [];
                        item.pipeList = item.pipelineCode ? item.pipelineCode.split(',') : [];
                    });
                    this.tableData = data;
                    this.total = res.body.data.totalCount;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
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
        removeItem (row) {
            let params = {
                code: row.code,
            };
            let tip = '删除此coupon码,则此coupon码将不可使用,是否确认删除?';
            if (row.status == 2) {
                tip = '确认启用?';
                params.status = 1;
            } else if(row.startTime <= this.time && row.endTime > this.time) {
                tip = '停用系统Coupon可能导致相关业务无法顺利进行，请确认当前系统Coupon没有被进行中调用';
                params.status = 2;
            } else {
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
        changeCheck (val) {
            if (val.length > 0) {
               let temp = [];
                for (let i in val) {
                    temp.push(val[i].code);
                }
                this.checkRow = temp.join(',');
            } else {
                this.checkRow = '';
            }
        },
        bitchRemove () {
            this.$confirm('是否删除选中项?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('promotion/coupon/delete', {code: this.checkRow, status: 0}).then(res => {
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
        clickRow (row, event, col) {
            if (col.columnKey != 'handle' && row.couponTemplateType == 0) {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
    }
}
</script>

<style>

</style>
