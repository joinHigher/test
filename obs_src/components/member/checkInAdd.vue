<template>
    <div class="check-in-add">
        <div class="el-container">
            <div class="el-sub-container">
                <el-alert title="签到规则技术周期为自然月，每个自然月重新开始统计，其中连续签到的天数范围不能有交集，累计签到天数范围唯一" description="注意：赠送coupon的时候，需要输入营销模块的coupon模板ID，签到奖励的coupon码按照模板规则生成并制定用户使用" :closable="false" type="info" show-icon></el-alert>
            </div>
        </div>
        <div class="el-container">
            <h3>新增签到规则</h3>
            <el-row>
                <el-col :span="17">
                    <el-form :model="option" label-width="140px" ref="postForm" :rules="postRule">
                        <el-form-item label="活动名称" prop="name">
                            <el-input v-model="option.name" placeholder="请输入活动名称"></el-input>
                        </el-form-item>
                        <el-form-item label="活动时间">
                            <el-row v-if="option.isDefault !== 1">
                                <el-col :span="6">
                                    <el-form-item prop="year" class="check-in-add-time" :rules="option.isDefault === 0 ? [{type: 'number', required: true, message: '该项不能为空', trigger: 'change'}] : []">
                                        <el-select :disabled="edit" v-model="option.year" clearable>
                                            <el-option v-for="item in 20" :key="item" :value="item + yearCount - 1" :label="(item + yearCount - 1) + '年'" placeholder="选择年"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4" :offset="1">
                                    <el-form-item prop="month" class="check-in-add-time" :rules="option.isDefault === 0 ? [{type: 'number', required: true, message: '该项不能为空', trigger: 'change'}] : []">
                                        <el-select :disabled="edit" v-model="option.month" clearable>
                                            <el-option v-if="item > monthCount || option.year > yearCount" v-for="item in 12" :key="item" :value="item" :label="item + '月'" placeholder="选择月"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item prop="isDefault" class="check-in-add-time">
                                <el-checkbox :disabled="edit" v-model="option.isDefault" :true-label="1" :false-label="0">默认（无限制）</el-checkbox>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="规则类型" prop="type">
                            <el-radio-group v-model="option.type">
                                <el-radio :disabled="edit" :label="1">连续签到</el-radio>
                                <el-radio :disabled="edit" :label="2">累计签到</el-radio>
                            </el-radio-group>
                            <p class="color-silver">*提交时只会提交当前选择的签到类型</p>
                        </el-form-item>
                        <el-form-item label="规则详情">
                            <template v-for="(item, index) in option.relationList">
                                <div class="item-box">
                                    <el-form-item :prop="'relationList.' + index" :rules="[{validator: checkItem, trigger: 'blur'}]">
                                        <el-row v-if="option.type === 1">
                                            <el-col :span="4" class="text-center required">天数范围</el-col>
                                            <el-col :span="4">
                                                <el-input v-model="item.startDays" placeholder="请输入天数"></el-input>
                                            </el-col>
                                            <el-col :span="1" class="text-center">-</el-col>
                                            <el-col :span="4">
                                                <el-input v-model="item.endDays" placeholder="请输入天数"></el-input>
                                            </el-col>
                                            <el-col :span="9" :offset="1">
                                                <el-button type="primary" @click="addRule">添加规则</el-button>
                                                <el-button type="danger" @click="removeRule(index)">删除规则</el-button>
                                            </el-col>
                                        </el-row>
                                        <el-row v-if="option.type === 2">
                                            <el-col :span="4" class="text-center required">累计天数</el-col>
                                            <el-col :span="6">
                                                <el-input v-model="item.cumulatDays" placeholder="请输入天数"></el-input>
                                            </el-col>
                                            <el-col :span="9" :offset="1">
                                                <el-button type="primary" @click="addRule">添加规则</el-button>
                                                <el-button type="danger" @click="removeRule(index)">删除规则</el-button>
                                            </el-col>
                                        </el-row>
                                        <el-row v-if="option.type === 1">
                                            <el-col :span="4" class="text-center item-title required">每天签到奖励</el-col>
                                            <el-col :span="20">
                                                <el-row class="reward-item" v-for="(reward, _index) in item.everyDayRewardList" :key="_index">
                                                    <el-col :span="5">
                                                        <el-select v-model="reward.rewardType">
                                                            <el-option :value="1" label="积分"></el-option>
                                                            <el-option :value="2" label="coupon模板"></el-option>
                                                        </el-select>
                                                    </el-col>
                                                    <el-col :span="5" :offset="1">
                                                        <el-input v-if="reward.rewardType === 1" v-model="reward.pointNum" placeholder="输入积分数"></el-input>
                                                        <el-input v-if="reward.rewardType === 2" v-model="reward.couponTempId" placeholder="输入系统coupon模板ID"></el-input>
                                                    </el-col>
                                                    <el-col :span="12" :offset="1">
                                                        <el-button type="primary" icon="plus" @click="addItem(item.everyDayRewardList, 1)"></el-button>
                                                        <el-button type="danger" icon="minus" @click="removeItem(item.everyDayRewardList, _index)"></el-button>
                                                        <el-button type="primary" v-if="reward.rewardType === 2" @click="checkCoupon(reward.couponTempId)">检验coupon</el-button>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="4" class="text-center item-title">
                                                <span v-if="option.type === 1">最后一天签到奖励</span>
                                                <span v-else class="required">对应奖励</span>
                                            </el-col>
                                            <el-col :span="20">
                                                <el-row class="reward-item" v-for="(reward, _index) in item.lastDayRewardList" :key="_index">
                                                    <el-col :span="5">
                                                        <el-select v-model="reward.rewardType" :clearable="option.type === 1">
                                                            <el-option :value="1" label="积分"></el-option>
                                                            <el-option :value="2" label="coupon模板"></el-option>
                                                        </el-select>
                                                    </el-col>
                                                    <el-col :span="5" :offset="1">
                                                        <el-input v-if="reward.rewardType === 1" v-model="reward.pointNum" placeholder="输入积分数"></el-input>
                                                        <el-input v-if="reward.rewardType === 2" v-model="reward.couponTempId" placeholder="输入系统coupon模板ID"></el-input>
                                                    </el-col>
                                                    <el-col :span="12" :offset="1">
                                                        <el-button type="primary" icon="plus" @click="addItem(item.lastDayRewardList, 2)"></el-button>
                                                        <el-button type="danger" icon="minus" @click="removeItem(item.lastDayRewardList, _index)"></el-button>
                                                        <el-button type="primary" v-if="reward.rewardType === 2" @click="checkCoupon(reward.couponTempId)">检验coupon</el-button>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </div>
                            </template>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" @click="post" v-loading="postLoading">提交</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="el-container">
            <el-table border :data="couponData" v-if="couponData.length > 0">
                <el-table-column prop="templateId" label="模板ID"></el-table-column>
                <el-table-column prop="templateName" label="Coupon模板类型"></el-table-column>
                <el-table-column label="满额条件">
                    <template scope="scope">
                        <span v-if="scope.row.type != 8 && scope.row.type != 9 && scope.row.type != 13 && scope.row.type != 14">{{scope.row.strategys}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="减免金额">
                    <template scope="scope">
                        <span v-if="scope.row.type == 9 || scope.row.type == 14">{{scope.row.strategys}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="减免百分比">
                    <template scope="scope">
                        <span v-if="scope.row.type == 8 || scope.row.type == 13">{{scope.row.strategys}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="effectDays" label="生效天数"></el-table-column>
                <el-table-column prop="limitCount" label="总使用次数"></el-table-column>
                <el-table-column prop="userLimitCount" label="单人使用次数"></el-table-column>
                <el-table-column prop="useCount" label="已使用次数"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="creatorName" label="操作人"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        let edit,
            title;
        if (this.$route.meta.page === 'checkInEdit') {
            edit = true;
            title = '编辑签到活动';
        } else {
            edit = false;
            title = '新增签到活动';
        }

        let self = this;

        let checkItem = (rule, value, callback) => {
            let type = self.option.type;
            let exp = /^[1-9]\d*$/;

            if (type === 1) {
                let startDays = value.startDays * 1;
                let endDays = value.endDays * 1;
                
                if (exp.test(startDays) && exp.test(endDays) && (endDays > startDays) && endDays <= 31) {

                } else {
                    callback(new Error('天数应为正整数，小于31，且右边大于左边'));
                }

                console.log(value);
                let everyRewad = value.everyDayRewardList;
                everyRewad.forEach(item => {
                    if (!item.rewardType) {
                        callback(new Error('每天签到奖励的类型不能为空'))
                    }

                    if (!item.couponTempId && !item.pointNum) {
                        callback(new Error('每天签到奖励的积分数或coupon不能为空'))
                    }

                    if (item.rewardType === 1 && !exp.test(item.pointNum)) {
                        callback(new Error('积分为正整数'));
                    }
                });

                let lastRewad = value.lastDayRewardList;
                lastRewad.forEach(item => {
                    if (item.rewardType === 1 && !exp.test(item.pointNum)) {
                        callback(new Error('积分为正整数'));
                    }
                });
            } else {
                let cumulatDays = value.cumulatDays;
                if (exp.test(cumulatDays)) {
                }  else {
                    callback(new Error('累计天数必填，且为正整数'));
                }

                let lastRewad = value.lastDayRewardList;
                lastRewad.forEach(item => {
                    if (!item.rewardType) {
                        callback(new Error('对应奖励的类型不能为空'))
                    }

                    if (!item.couponTempId && !item.pointNum) {
                        callback(new Error('对应奖励的积分数或coupon不能为空'))
                    }

                    if (item.rewardType === 1 && !exp.test(item.pointNum * 1)) {
                        callback(new Error('积分为正整数'));
                    }
                });
            }
            callback();
        };

        let checkName = (rule, value, callback) => {
            if (value.length > 20) {
                callback(new Error('名称最大长度为20'));
            } else {
                callback();
            }
        }

        return {
            self: this,
            couponData: [],
            option: {
                name: '',
                year: new Date().getFullYear(),
                month: '',
                type: 1,
                isDefault: 0,
                relationList: [{
                    startDays: '',
                    endDays: '',
                    cumulatDays: '',
                    everyDayRewardList: [{
                        rewardType: '',
                        pointNum: '',
                        couponTempId: '',
                        rewardDaysType: 1,
                    }],
                    lastDayRewardList: [{
                        rewardType: '',
                        pointNum: '',
                        couponTempId: '',
                        rewardDaysType: 2
                    }],
                }],
            },
            postLoading: false,
            yearCount: new Date().getFullYear(),
            monthCount: new Date().getMonth(),
            id: this.$route.query.id,
            title: title,
            edit: edit,
            checkItem: checkItem,
            postRule: {
                name: [{
                    required: true,
                    message: '名称不能为空'
                }, {
                    validator: checkName,
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '签到类型不能为空'
                }]
            }
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            if (this.id) {
               this.$http.get('user/sign/info', {params: {id: this.id}}).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        for (let i in this.option) {
                            if (data[i]) {
                                this.option[i] = data[i];
                            }
                        }
                    }
                }); 
            }
        },
        post () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let src = 'user/sign/add';
                    let params = JSON.parse(JSON.stringify(this.option));
                    let data = params.relationList;

                    let temp = [];
                    let flag = 0;
                    if (params.type === 1) {
                        data.forEach(item => {
                            let startDays = item.startDays * 1;
                            let endDays = item.endDays * 1;
                            for (let i = startDays; i <= endDays; i++) {
                                if (temp.indexOf(i) !== -1) {
                                    flag = 1;
                                    break;
                                } else {
                                    temp.push(i);
                                }
                            }
                        });
                    } else {
                        data.forEach(item => {
                            let cumulatDays = item.cumulatDays * 1;
                            if (temp.indexOf(cumulatDays) !== -1) {
                                flag = 2;
                            } else {
                                temp.push(cumulatDays);
                            }
                        });
                    }

                    if (flag === 1) {
                        this.$message.warning('天数范围不能重复');
                        return false;
                    } else if (flag === 2){
                        this.$message.warning('累计天数不能重复');
                        return false;
                    }

                    if (params.type === 2) {
                        params.relationList.map(item => {
                            this.$delete(item, 'startDays');
                            this.$delete(item, 'endDays');
                            this.$delete(item, 'everyDayRewardList');
                        });
                    } else {

                        params.relationList.map(item => {
                            this.$delete(item, 'cumulatDays');
                        });
                    }

                    params.relationList.map(item => {
                        if (this.edit) {
                            delete item.id;
                            delete item.signId;
                        }

                        if (item.everyDayRewardList) {
                            item.everyDayRewardList.map(subItem => {
                                if (subItem.rewardType === 2) {
                                    delete subItem.pointNum
                                } else {
                                    delete subItem.couponTempId
                                }

                                if (this.edit) {
                                    delete subItem.createTime;
                                    delete subItem.sysUpdateTime;
                                }
                            });
                        }

                        if (item.lastDayRewardList) {
                            let temp = [];
                            item.lastDayRewardList.map(subItem => {
                                if (subItem.rewardType === 2) {
                                    delete subItem.pointNum
                                } else {
                                    delete subItem.couponTempId
                                }

                                if (this.edit) {
                                    delete subItem.createTime;
                                    delete subItem.sysUpdateTime;
                                }

                                if (subItem.rewardType && (subItem.pointNum || subItem.couponTempId)) {
                                    temp.push(subItem);
                                }
                            });
                            item.lastDayRewardList = temp;
                        }
                    });

                    if (this.edit) {
                        params.id = this.$route.query.id;
                        src = 'user/sign/edit';
                    }

                    this.postLoading = true;
                    this.$http.post(src, params).then(res => {
                        this.postLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.$router.push({
                                name: 'member_checkInList',
                            })
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }
            })
        },
        addItem (item, type) {
            item.push({
                rewardDaysType: type,
                rewardType: '',
                pointNum: '',
                couponTempId: ''
            });
        },
        removeItem (item, index) {
            if (item.length === 1) {
                this.$message.warning('最后一项不可删除')
            } else {
                 item.splice(index, 1);
            }
        },
        addRule () {
            this.option.relationList.push({
                startDays: '',
                endDays: '',
                cumulatDays: '',
                everyDayRewardList: [{
                    rewardType: '',
                    pointNum: '',
                    couponTempId: '',
                    rewardDaysType: 1
                }],
                lastDayRewardList: [{
                    rewardType: '',
                    pointNum: '',
                    couponTempId: '',
                    rewardDaysType: 2
                }],
            })
        },
        removeRule (index) {
            if (this.option.relationList.length === 1) {
                this.$message.warning('最后一项不可删除')
            } else {
                this.option.relationList.splice(index, 1);
            }
        },
        goback () {
            this.$router.push({
                name: 'member_checkInList'
            })
        },
        checkCoupon (id) {
            let params = {};
            params.page = 1;
            params.page_size = 1000;
            params.id = id;
            this.$http.get('user/sign/public-coupon-temp', {params: params}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    if (data.length === 0) {
                        this.$message.warning('couponID不存在');
                        return false;
                    } else {
                        let flag = false;
                        this.couponData.forEach(item => {
                            if (item.id === data.id) {
                                flag = true;
                            }
                        });

                        if (!flag) {
                            this.couponData.push(data);
                        }
                    }
                }
            })
        }
    }
}
</script>
<style lang="less">
    .check-in-add {
        .reward-item {
            margin: 10px 0;
        }

        .item-box {
            padding: 10px 10px 20px;
            margin-bottom: 10px;
            border: 1px solid #58B7FF;
            border-radius: 20px;
        }

        .item-title {
            padding-top: 10px;
        }

        .required {
            &:before {
                content: '*';
                color: #ff4949;
                margin-right: 4px;
            }
        }
        .check-in-add-time{
            .el-form-item__content{
                margin-left: 0!important;
            }
        }
    }
    
</style>