<template>
    <div>
        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column type="index" label="序号" width="100px"></el-table-column>
                <el-table-column prop="channelName" label="支付方式"></el-table-column>
                <el-table-column prop="discount" label="支付折扣"></el-table-column>
                <el-table-column label="生效时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="启用/停用">
                    <template scope="scope">
                        <i class="clickable" :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}" @click="changeStatus(scope.row)"></i>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('promotion/favorable/edit-discount')" type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="编辑" v-model="editDialog" size="tiny" class="discount-edit">
            <el-form :model="editForm" ref="editForm" label-width="100px" :rules="editRule">
                <el-form-item label="支付折扣" prop="discountStr" required>
                    <el-input v-model.trim="editForm.discountStr"></el-input>
                </el-form-item>
                <el-form-item label="生效时间" prop="startDate">
                    <el-date-picker v-model="editForm.startDate" type="datetime" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endDate">
                    <el-date-picker v-model="editForm.endDate" type="datetime" :editable="false"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postEdit" v-loading="editLoading" :disabled="editLoading">确 定</el-button>
                <el-button type="danger" @click="editDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let checkRate = function(rule, value, callback) {
            let exp = /^0\.\d\d?$/;
            if (exp.test(value) && (value * 1) > 0) {
                callback();
            } else {
                callback('该项必填，请输0到1之间的数字，保留2位小数');
            }
        }

        return {
            editForm: {
                discountStr: '',
                startDate: '',
                endDate: '',
                status: '',
                startTime: '',
                endTime: ''
            },
            editDialog: false,
            self: this,
            total: 10,
            tableData: [],
            tableLoading: false,
            editLoading: false,
            editRule: {
                discountStr: [{
                    validator: checkRate,
                    trigger: 'blur'
                }],
                startDate: [{
                    type: 'date',
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                endDate: [{
                    type: 'date',
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }]
            },
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.tableLoading = true;
            this.$http.get('promotion/favorable/pay-discount').then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data.list;
                    data.map(item => {
                        if (!item.startTime) {
                            item.startTime = 0;
                        }
                        if (!item.endTime) {
                            item.endTime = 0;
                        }
                    })
                    this.tableData = data;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        edit (row) {
            if (row.id) {
                this.editForm.id = row.id;
            }
            this.editForm.channelName = row.channelName;
            this.editForm.channelCode = row.channelCode;
            this.editForm.discountStr = row.discount;
            this.editForm.startDate = Boolean(row.startTime) ? new Date(row.startTime * 1000) : '';
            this.editForm.endDate = Boolean(row.endTime) ? new Date(row.endTime * 1000) : '';
            this.editDialog = true;
        },
        changeStatus (row) {
            let params = {};
            params.id = row.id;
            params.status = row.status == 1 ? 0 : 1;
            this.$http.post('promotion/favorable/switch-discount', params).then(res => {
                if (res.body.code === 0 && res.body.data) {
                    row.status = params.status;
                    this.$message.success(res.body.message);
                } else {
                    this.$message.error(res.body.message); 
                }
            })
        },
        postEdit () {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    if (this.editForm.startDate) {
                        this.editForm.startTime = this.timeZone_(this.editForm.startDate, this.$store.getters.getTimeZone);
                    }

                    if (this.editForm.endDate) {
                         this.editForm.endTime = this.timeZone_(this.editForm.endDate, this.$store.getters.getTimeZone);
                    }

                    if (this.editForm.endTime < this.editForm.startTime) {
                        this.$message.warning('结束时间不能小于开始时间');
                        return ;
                    }
                    
                    let params = {};
                    for (let i in this.editForm) {
                        if (i !== 'startDate' && i !== 'endDate') {
                            params[i] = this.editForm[i];
                        }
                    }

                    this.editLoading = true;
                    this.$http.post('promotion/favorable/edit-discount', params).then(res => {
                        this.editLoading = false;
                        if (res.body.code === 0 && res.body.data) {
                            this.editDialog = false;
                            this.$message.success(res.body.message);
                            this.getData();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.editLoading = false;
                    });
                }
            });
            
        }
    }
}
</script>

<style lang="less">
    .discount-edit {
        .el-date-editor {
            width: 100%;
        }
    }
</style>