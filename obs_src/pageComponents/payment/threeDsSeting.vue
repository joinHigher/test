<template>
    <div class="tds-setting">
        <el-form :model="editDlg" class="editDlg" label-width="150px" ref="editDlg">
            <el-form-item
                label="3DS渠道: "
                :rules="[{ required: true, message: '请选择3DS渠道'}]"
            >
                <el-select v-model="editDlg.channelCode" placeholder="请选择3DS渠道" @change="handleEditDlg3dsChange">
                    <el-option v-for="(item, index) in payChannels"
                               v-if="item.is3DS == 1"
                               :key="index"
                               :value="item.channelCode"
                               :label="item.channelName"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item
                prop="tdsAmount"
                label="开启最低金额($): "
                :rules="[{ required: true, message: '请输入正确的金额'}, { type: 'integer', min: 0, message: '金额必须为不小于0的数值'}]"
            >
                <el-input type="number" v-model.number="editDlg.tdsAmount" :disabled="!editDlg.isEnabled" placeholder="请输入开启最低金额"></el-input>
                <el-button class="ml10" type="primary" :disabled="!editDlg.channelCode" @click="editDlg.isEnabled = true">更 改</el-button>
            </el-form-item>

            <el-form-item>
                <el-button @click="emitHide">取 消</el-button>
                <el-button type="primary"
                           @click="handleSubmit3dsSetting"
                           :disabled="!editDlg.isEnabled"
                           :loading="editDlg.isLoading"
                >确 定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="less">
    .tds-setting{
        .el-input, .el-select{
            width: 220px;
        }
        .ml10{
            margin-left: 10px;
        }
    }
</style>

<script>
    export default {
        props: {
            value: {
                default: false,
                type: Boolean
            },
            payChannels: {
                default: [],
                type: Array
            }
        },
        data() {
            return{
                editDlg: {
                    isLoading: false,
                    isEnabled: false,
                    channelCode: '',
                    tdsAmount: '',
                    id: -1,
                }
            }
        },
        watch: {
            value(newVal) {
                if (newVal) {
                    this.editDlg.isEnabled = false;
                    this.$nextTick(() => {
                        this.$refs['editDlg'].resetFields();
                    });
                }
            }
        },
        methods: {
            emitHide() {
                this.$emit('input', false)
            },
            handleSubmit3dsSetting() {
                let hasError = false;
                let params = {
                    channelCode: this.editDlg.channelCode,
                    tdsAmount: this.editDlg.tdsAmount,
                };
                this.$refs['editDlg'].validate((valid) => {
                    if (!valid) {
                        hasError = true;
                        return false;
                    }
                });
                if (hasError) {
                    return;
                }
                // console.log(params);
                // return;
                this.editDlg.isLoading = true;
                this.$http.post('pay/channel/update-setting', params).then(res => {
                    this.editDlg.isLoading = false;
                    if (res.body.code !== 0) {
                        this.$message.error(res.body.message);
                        return;
                    }
                    this.$message.success(res.body.message);
                    this.emitHide()
                });
            },
            handleEditDlg3dsChange(code) {
                if (!code) { return;}
                this.editDlg.tdsAmount = '';
                this.editDlg.id = -1;
                this.$http.get('pay/channel/setting', {params: {channelCode: code}}).then(res => {
                    if (res.body.code !== 0 || !res.body.data) {
                        this.$refs['editDlg'].resetFields();
                        return;
                    }
                    this.editDlg.tdsAmount = res.body.data.tdsAmount || '';
                    this.editDlg.id = res.body.data.id || -1;
                });
            }
        }
    }

</script>
