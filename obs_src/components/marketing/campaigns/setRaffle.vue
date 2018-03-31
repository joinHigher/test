<!-- 后置礼包 -->
<template>
    <div class="el-container set-raffle">
        <el-tabs v-model="pipelineCode" @tab-click="getData">
            <el-tab-pane v-for="(item, index) in pipeOpt" :key="index" :label="item" :name="index">
                <el-form label-width="150px" :model="option"  :ref="'postForm_' + index" v-loading="infoLoading">
                    <el-form-item label="后置礼包活动选择" prop="data">
                        <el-row v-for="(item, index) in option.data" :key="index" class="item">
                            <el-form-item :prop="'data.' + index" :rules="dataRule" label-width="0">
                                <el-col :span="2" class="text-center">消费满</el-col>
                                <el-col :span="2">
                                    <el-input v-model="item.meetAmountFrom"></el-input>
                                </el-col>
                                <el-col :span="1" class="text-center">——</el-col>
                                <el-col :span="2">
                                    <el-input v-model="item.meetAmountTo"></el-input>
                                </el-col>
                                <el-col :span="2" class="text-center">赠送</el-col>
                                <el-col :span="4">
                                    <el-select v-model="item.activityId">
                                        <el-option label="不开启" value="0"></el-option>
                                        <el-option v-for="act in list" :value="act.activityId" :key="act.activityId" :label="act.name"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="3">
                                    <el-input v-model="item.count"></el-input>
                                </el-col>
                                <el-col :span="1" class="text-center">次</el-col>
                                <el-col :span="5" :offset="1">
                                    <el-button type="primary" icon="plus" @click="add"></el-button>
                                    <el-button type="danger" icon="minus" @click="remove(index)" v-if="option.data.length > 1"></el-button>
                                </el-col>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item class="text-center">
                        <el-button v-if="self.showAction_('promotion/activity/set-raffle-packages')" type="primary" @click="post" :disabled="postLoading" v-loading="postLoading">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let checkData = (rule, val, callback) => {
            if ((val.count * 1 == val.count) && val.count > 0 && Number.isInteger(val.count * 1)) {

            } else {
                callback(new Error('次数必须是大于0的整数'));
            }

            if ((val.meetAmountTo * 1 == val.meetAmountTo) && val.meetAmountTo >= 0 && (val.meetAmountFrom * 1 == val.meetAmountFrom) && val.meetAmountFrom >= 0) {

            } else {
                callback(new Error('消费金额为大于等于0的数字'));
            }

            if (!val.activityId || !val.count || !val.meetAmountFrom || !val.meetAmountTo) {
                callback(new Error('配置项不能为空'));
            }

            if (val.meetAmountFrom * 1 >= val.meetAmountTo * 1) {
                callback(new Error('消费起始值必须小于结束值'));
            }

            callback();
        };
        return {
            self: this,
            postLoading: false,
            infoLoading: false,
            option: {
                data: [{
                    meetAmountFrom: '',
                    meetAmountTo: '',
                    activityId: '',
                    count: '',
                }],
            },
            list: [],
            pipelineCode: '',
            flag: false,
            dataRule: [{
                validator: checkData,
            }]
        };
    },
    created () {
        this.getAct();
    },
    computed: {
        pipeOpt () {
            let temp = this.$store.getters.getPipe.obj;
            for (let i in temp) {
                this.pipelineCode = i;
                if (!this.flag) {
                    this.flag = true;
                    this.getData();
                }
                break;
            }
            return temp;
        },
    },
    methods: {
        getAct () {
            this.$http.get('promotion/index/public-raffle-list').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;

                    data.forEach(item => {
                        let status = item.status;
                        let time = this.timeZone_(new Date(), this.$store.getters.getTimeZone);
                        if (status == 1) {
                            item.name += '(已删除)';
                        } else if (status == 0 && (item.endTime <= time)) {
                            item.name += '(已过期)';
                        }
                    });
                    this.list = data;
                }
            });
        },
        getData () {
            this.infoLoading = true;
            this.$http.get('promotion/activity/get-raffle-packages', {params: {pipelineCode: this.pipelineCode}}).then(res => {
                this.infoLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    if (data.length > 0) {
                        this.option.data = data;
                    } else {
                        this.option.data = [{
                            meetAmountFrom: '',
                            meetAmountTo: '',
                            activityId: '',
                            count: '',
                        }];
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.infoLoading = false;
            });
        },
        add () {
            this.option.data.push({
                meetAmountFrom: '',
                meetAmountTo: '',
                activityId: '',
                count: '',
            });
        },
        remove (index) {
            this.option.data.splice(index, 1);
        },
        post () {
            // 校验区间交叉
            if (this.option.data.length > 1) {
                let data = JSON.parse(JSON.stringify(this.option.data)).sort((a, b) => {
                    return a.meetAmountFrom * 1 > b.meetAmountFrom * 1;
                });
                for (let i = 0; i < data.length - 1; i++) {
                    if (data[i].meetAmountTo >= data[i + 1].meetAmountTo) {
                        this.$message.error('不同行的[消费金额下限]与[消费金额上限]不能存在交叉');
                        return;
                    }
                }
            }

            let ref = 'postForm_' + this.pipelineCode;
            this.$refs[ref][0].validate(valid => {
                if (valid) {
                     let params = {
                        pipelineCode: this.pipelineCode,
                        activityConditions: {
                            postPackages: this.option.data
                        },
                    };
                    this.postLoading = true;
                    this.$http.post('promotion/activity/set-raffle-packages', params).then(res => {
                        this.postLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);

                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoading = false;
                    });
                }
            })
        }
    }
}
</script>

<style lang="less">
    .set-raffle {
        .item  {
            margin-bottom: 20px;
        }
    }
</style>
