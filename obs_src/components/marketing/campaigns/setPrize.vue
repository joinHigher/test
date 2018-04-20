<!-- 奖品设置 -->
<template>
    <div class="set-prize">
        <div class="el-container">
            <div class="part-list-title">
                <span>{{titleOpt.activityName}}</span>
                <span>{{self.timeZone_(titleOpt.startTime, self.$store.getters.getTimeZone)}} 至 {{self.timeZone_(titleOpt.endTime, self.$store.getters.getTimeZone)}}</span>
                <span>{{titleOpt.activityTypeName}}</span>
                <span>由 {{titleOpt.creatorName}} 创建</span>

            </div>
            <el-button v-if="self.showAction_('promotion/activity-goods/add-prizes')" class="fr" type="primary" @click="open('add')">添加奖品</el-button>
        </div>
        <div class="el-container">
            <h3>奖项设置</h3>
            <br>
            <el-table border :data="tableData">
                <el-table-column prop="prizeName" label="奖品名称"></el-table-column>
                <el-table-column label="奖品类别">
                    <template scope="scope">
                        <span v-if="scope.row.type == '2'">积分</span>
                        <span v-if="scope.row.type == '3'">coupon</span>
                        <span v-if="scope.row.type == '4'">商品</span>
                    </template>
                </el-table-column>
                <el-table-column label="奖励" width="200px">
                    <template scope="scope">
                        <span v-if="scope.row.type == '3'">{{conponText[scope.row.value]}}</span>
                        <span v-else>{{scope.row.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="prizeCount" label="奖励总数"></el-table-column>
                <el-table-column prop="dayUseCount" label="日上限"></el-table-column>
                <el-table-column prop="userLimitCount" label="单用户上限"></el-table-column>
                <el-table-column prop="winProbability" label="中奖概率百分比">
                    <template scope="scope">
                        <span>{{(scope.row.winProbability * 100).toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="中奖限制">
                    <template scope="scope">
                        <span v-if="scope.row.isLimit == '1'">有</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('promotion/activity-goods/edit-prize')" type="primary" size="small" @click="open('edit', scope.row)">编辑</el-button>
                        <el-button v-if="self.showAction_('promotion/activity-goods/delete-prize')" type="danger" size="small" @click="remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹窗S -->
        <el-dialog :title="openTitle" v-model="editDialog" size="tiny">
            <el-form :model="option" label-width="100px" ref="editForm" :rules="editRule">
                <el-form-item label="奖品名称" prop="prizeName">
                    <el-input v-model.trim="option.prizeName"></el-input>
                </el-form-item>
                <el-form-item label="奖品总数" prop="prizeCount">
                    <el-input v-model.trim="option.prizeCount"></el-input>
                </el-form-item>
                <el-form-item label="日抽取上限" prop="dayUseCount">
                    <el-input v-model.trim="option.dayUseCount"></el-input>
                </el-form-item>
                <el-form-item label="单用户上限" prop="userLimitCount">
                    <el-input v-model.trim="option.userLimitCount"></el-input>
                </el-form-item>
                <el-form-item label="奖品类别" prop="type">
                    <el-select :disabled="editable" filterable v-model="option.type" @visible-change="changeType" placeholder="请选择奖品类别，必选">
                        <el-option v-for="(item, index) in typeOpt" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="option.type == 4" label="仓库" prop="warehouseCode" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-select :disabled="editable" v-model="option.warehouseCode" placeholder="请选择仓库">
                        <el-option v-for="item in wareOpt" :key="item.virWhCode" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="option.type == 3" label="设定奖励" prop="value" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-select filterable clearable v-model="option.value">
                        <el-option v-for="item in couponOpt" :key="item.code" :value="String(item.code)" :label="item.templateName + item.strategys"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="option.type != 3" required label="设定奖励" prop="value" :rules="[{validator: checkBonus}]">
                    <el-input v-model.trim="option.value"></el-input>
                </el-form-item>
                <el-form-item v-if="option.type == 2" label="积分有效期" prop="integralLimitTime" :rules="[{validator: checkInt}]">
                    <el-row>
                        <el-col :span="18">
                            <el-input v-model.trim="option.integralLimitTime"></el-input>
                        </el-col>
                        <el-col :span="4">
                            &nbsp;天
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="中奖概率" prop="probability" required>
                    <el-input v-model.trim="option.probability"></el-input>
                </el-form-item>
                <h3>中奖限制：</h3>
                <el-form-item label="会员等级" prop="memberLevel">
                    <el-select :disabled="editable" filterable v-model="option.memberLevel" multiple>
                        <el-option v-for="item in memberOpt" :key="item.id" :label="item.levelName" :value="String(item.id)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="国家地区" prop="country">
                    <el-select :disabled="editable" filterable v-model="option.country" multiple @change="changeCountry" class="country-select">
                        <el-option v-if="option.country.length !== countryList.length" label="全选" value="checkAll"></el-option>
                        <el-option v-for="item in countryOpt" :key="item.countryId" :value="item.countryCode" :label="item.countryName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="新老用户" prop="userType">
                    <el-radio-group v-model="option.userType">
                        <el-radio :label="0">全部用户</el-radio>
                        <el-radio :label="1">新用户</el-radio>
                        <el-radio :label="2">老用户</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="注册时间" prop="regDate">
                    <el-form-item>
                        <el-date-picker :disabled="editable" v-model="option.regDate" type="datetimerange"></el-date-picker>
                </el-form-item>
                </el-form-item>
                <el-form-item label="最后消费" prop="feeDate">
                    <el-form-item>
                        <el-date-picker :disabled="editable" v-model="option.feeDate" type="datetimerange"></el-date-picker>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postAdd" v-loading="postLoading" :disabled="postLoading">确 认</el-button>
                <el-button type="danger" @click="editDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let checkInt = function (rule, value, callback) {
            if ((Number.isInteger(value * 1) && value * 1 >= 0) || value === '') {
                callback();
            } else {
                callback(new Error('该项应为正整数'))
            }
        }

        let checkProbability = function (rule, value, callback) {
            let exp = /^0\.\d\d?\d?\d?$/;
            if (exp.test(value)) {
                callback();
            } else {
                callback('请输入0到1之间的数字，最多保留4位小数');
            }
        }

        let checkGoodsSns = (rule, value, callback) => {
            let exp = /^[0-9a-zA-Z]+$/;
            if (!exp.test(value)) {
                callback(new Error('请输入正确的SKU'));
            }
            callback();
        }

        let checkBonus = (rule, value, callback) => {
            if (this.option.type == 2 || this.option.type == 3) {
                if (Number(value) > 0 && Number.isInteger(value * 1)) {

                } else {
                    callback(new Error('积分应为正整数'))
                }
            } else if (this.option.type == 4) {
                let exp = /^[0-9a-zA-Z]+$/;
                if (!exp.test(value)) {
                    callback(new Error('请输入正确的SKU'));
                }
            }
            callback();
        }

        return {
            countryList: [],
            checkInt: checkInt,
            self: this,
            checkBonus: checkBonus,
            editable: false,
            disabled: false,
            postLoading: false,
            titleOpt: {
                activityName: '',
                startTime: '',
                endTime: '',
                creatorName: '',
                activityTypeName: ''
            },
            memberOpt: [],
            countryOpt: [],
            wareOpt: [],
            typeOpt: {
                '2': '积分',
                '3': 'coupon',
                '4': '商品'
            },
            couponOpt: [],
            conponText: {},
            tableData: [],
            editDialog: false,
            option: {
                id: '',
                regDate: [],
                feeDate: [],
                activityId: this.$route.query.activityId,
                prizeName: '',
                integralLimitTime: '',
                prizeCount: '',
                dayUseCount: '0',
                userLimitCount: '0',
                type: '',
                value: '',
                probability: '',
                memberLevel: [],
                registerTimeStart: '',
                registerTimeEnd: '',
                consumeTimeStart: '',
                consumeTimeEnd: '',
                country: [],
                warehouseCode: '',
                userType: '2',
            },
            openTitle: '添加奖品',
            editRule: {
                prizeName: [{
                    required: true,
                    trigger: 'blur',
                    message: '该项不能为空',
                }],
                prizeCount: [{
                    validator: checkInt,
                    trigger: 'blur'
                }],
                dayUseCount: [{
                    validator: checkInt,
                    trigger: 'blur'
                }],
                userLimitCount: [{
                    validator: checkInt,
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                probability: [{
                    validator: checkProbability,
                    trigger: 'blur'
                }],
                userType: [{
                    required: true,
                    message: '该项不能为空',
                }]
            }
        };
    },
    created () {
        this.getOpt();
        this.getData();
    },
    methods: {
        getOpt () {
            this.$http.get('promotion/index/public-country-list').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = [];
                    data.forEach(item => {
                        temp.push(item.countryCode);
                    });
                    this.countryList = temp;
                    this.countryOpt = data;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/index/public-activity-select').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.memberOpt = data.userLevel;
                    this.wareOpt = data.virtualWares;
                } else {
                    this.$message.error(res.body.message);
                }

            });

            this.$http.get('promotion/public/coupon-template-ids-at-system').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = {};
                    this.couponOpt = data;
                    data.forEach(item => {
                         temp[item.code] = item.templateName + item.strategys;
                    });
                    this.conponText = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            this.$http.get('promotion/activity/prize-lists', {params: {activityId: this.$route.query.activityId}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    for (let i in this.titleOpt) {
                        this.titleOpt[i] = data[i];
                    }

                    this.disabled = data.activityStatus === '进行中';
                    this.tableData = data.prizes;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        changeType (val) {
            if (val) {
                this.option.value = '';
            }
        },
        open (params, row) {
            if (params == 'add') {
                this.editable = false;
                this.openTitle = '添加奖品';
            } else {
                this.editable = this.disabled;
                for (let i in this.option) {
                    if (i == 'country' || i == 'memberLevel') {
                        if (row[i]) {
                            this.option[i] = row[i].split(',');
                        }
                    } else {
                        if (i == 'prizeName' || i == 'type' || i == 'integralLimitTime') {
                            this.option[i] = String(row[i]);
                        } else {
                            this.option[i] = row[i];
                        }
                    }
                }
                if (Boolean(this.option.consumeTimeEnd) && Boolean(this.option.consumeTimeStart)) {
                    this.option.feeDate = [new Date(this.option.consumeTimeStart * 1000), new Date(this.option.consumeTimeEnd * 1000)]
                } else {
                    this.option.feeDate = [];
                }

                if (Boolean(this.option.registerTimeEnd) && Boolean(this.option.registerTimeStart)) {
                    this.option.regDate = [new Date(this.option.registerTimeStart * 1000), new Date(this.option.registerTimeEnd * 1000)]
                } else {
                    this.option.regDate = [];
                }

                this.option.id = row.id;
                this.openTitle = '编辑奖品'
            }

            this.editDialog = true;
            this.$nextTick(() => {
                this.$refs.editForm.$children.forEach(item => {
                    item.validateState = true;
                });
            });
            if (params == 'add') {
                this.option = {
                    id: '',
                    regDate: [],
                    feeDate: [],
                    activityId: this.$route.query.activityId,
                    prizeName: '',
                    prizeCount: '',
                    dayUseCount: '0',
                    userLimitCount: '0',
                    type: '',
                    value: '',
                    probability: '',
                    memberLevel: [],
                    registerTimeStart: '',
                    registerTimeEnd: '',
                    consumeTimeStart: '',
                    consumeTimeEnd: '',
                    country: [],
                    warehouseCode: '',
                    integralLimitTime: '',
                    userType: '2',
                }
            }
        },
        remove (row) {
            if (this.disabled) {
                this.$alert('活动进行中，无法删除活动奖项', {
                    type: 'warning'
                });
            } else {
                this.$confirm('是否删除该项?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('promotion/activity-goods/delete-prize', {id: row.id}).then(res => {
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
            }
        },
        changeCountry(val) {
            if (val.indexOf('checkAll') != -1) {
                this.option.country = this.countryList;
            }
        },
        postAdd () {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    if (typeof this.option.regDate === 'undefined') {
                        this.option.regDate = [];
                    }

                    if (typeof this.option.feeDate === 'undefined') {
                        this.option.feeDate = [];
                    }

                    let timeArr1 = this.timeZone_(this.option.regDate, this.$store.getters.getTimeZone);
                    this.option.registerTimeStart = timeArr1[0];
                    this.option.registerTimeEnd = timeArr1[1];

                    let timeArr2 = this.timeZone_(this.option.feeDate, this.$store.getters.getTimeZone);
                    this.option.consumeTimeStart = timeArr2[0];
                    this.option.consumeTimeEnd = timeArr2[1];

                    if ((timeArr1[0] && timeArr1[0] == timeArr1[1]) || (timeArr2[0] && timeArr2[0] == timeArr2[1])) {
                        this.$message.warning('结束时间必须大于开始时间');
                        return false;
                    }

                    let params = {};
                    for (let i in this.option) {
                        if (i !== 'regDate' && i !== 'feeDate' && i !== 'id') {
                            params[i] = this.option[i];
                        }
                    }
                    params.memberLevel = params.memberLevel.join(',');
                    params.country = params.country.join(',');

                    if (params.prizeCount && params.dayUseCount * 1 > params.prizeCount * 1) {
                        this.$message.warning('奖品总数不能小于日抽取上限');
                        return false;
                    }

                    if (params.prizeCount && params.userLimitCount * 1 > params.prizeCount * 1) {
                        this.$message.warning('奖品总数不能小于单用户上限');
                        return false;
                    }

                    this.postLoading = true;
                    if (this.option.id) {
                        params.id = this.option.id;
                        this.$http.post('promotion/activity-goods/edit-prize', params).then(res => {
                            this.postLoading = false;
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                                this.editDialog = false;
                                this.getData();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.postLoading = false;
                        });
                    } else {
                        this.$http.post('promotion/activity-goods/add-prizes', params).then(res => {
                            this.postLoading = false;
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                                this.editDialog = false;
                                this.getData();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.postLoading = false;
                        });
                    }
                }
            });
        },
    }
}
</script>

<style lang="less">
    .set-prize {
        .el-dialog {
           margin-top: -100px;
        }

        .part-list-title {
            span {
                display: inline-block;
                margin-right: 20px;

                &:first-child {
                    font-size: 20px;
                }
            }
        }

        .country-select {
            .el-select__tags {
                max-height: 100px;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }
</style>
