<template>
    <div>
        <div class="el-container">
            <el-form :model="tableData" ref="postForm">
                <el-row>
                    <el-col :span="10">
                        <table class="table-custom priority-form" v-loading="tableLoading">
                            <thead>
                                <tr>
                                    <th>价格类型</th>
                                    <th>优先级</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(item, index) in tableData">
                                    <tr>
                                        <td>
                                            {{item.templateName}}
                                            <span v-if="item.status === 0" class="color-danger">(停用)</span>
                                        </td>
                                        <td>
                                        <el-form-item :prop="index" :rules="[{validator: checkValue, trigger: 'blur'}]">
                                            <el-input v-model.trim="item.priority"></el-input>
                                        </el-form-item>
                                    </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <div class="text-center el-sub-container">
                            <el-button v-if="self.showAction_('promotion/price/setting-priority')" v-loading="postLoading" :disabled="postLoading" type="primary" @click="postEdit">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let checkValue = function (rule, value, callback) {
            let val = value.priority;
            if ((Number(val) > 0 && Number.isInteger(val * 1) && Number(val) <= 9999)) {
                callback()
            } else {
                callback(new Error('优先级必须为正整数,最大9999'));
            }
        }
        return {
            option: {
                page: 1,
                page_size: 10
            },
            self: this,
            tableLoading: false,
            postLoading: false,
            total: 10,
            tableData: {},
            checkValue: checkValue
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.tableLoading = true;
            this.$http.get('promotion/price/priority-lists', {params: {status: 1, type: 0}}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let temp = {};
                    let data = res.body.data.templateSites;

                    data.map((item, index) => {
                        temp[index] = item;
                    });
                    this.tableData = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            })
        },
        postEdit () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let flag = true;
                    let params = {};
                    params.templateSites = [];
                    for (let i in this.tableData) {
                        let item = this.tableData[i];
                        if (item.priority) {
                            params.templateSites.push({
                                id: item.id,
                                templateId: item.templateId,
                                priority: item.priority
                            });
                        }
                    }
                    this.postLoading = true;
                    this.$http.post('promotion/price/setting-priority', params).then(res => {
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
        },
        goback () {
            history.back();
        }
    }
}
</script>

<style lang="less">
    .priority-form {
        th,td {
            text-align: center;
            padding: 20px;
        }

        .el-form-item {
            margin-bottom: 0;
        }
    }
</style>