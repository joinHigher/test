<template>
    <div>
        <div class="el-container">
            <el-form>
                <el-row>
                    <el-col :span="6">
                        <el-form-item class="text-center">
                            <span>单位是小时(h), 小于等于0表示不开启cdn缓存</span>
                        </el-form-item>
                        <el-form-item v-for="item in tableData" :label="item.label" :key ="item.name" label-width="100px">
                            <el-input v-model="item.value"></el-input>      
                        </el-form-item>
                        <el-form-item class="text-center">
                            <el-button type="primary" @click="edit()" v-loading="editlock">保存</el-button>
                            <el-button type="primary" @click="clearFormDialog = true">清除cdn</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>  
        </div>        
        <!-- 弹窗S -->
        <el-dialog title="清除cdn" v-model="clearFormDialog" size="tiny">
            <el-form :model="clearForm"  label-width="80px" :rules="postrule" ref="postform">
                <el-form-item label="urls" prop="urls">
                    <el-input type="textarea" :rows="6" v-model="clearForm.urls" placeholder="一行一个"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="self.showAction_('admin/cdn/save-setting')" type="primary" @click="update" v-loading="postlock">确 定</el-button>
                <el-button @click="clearFormDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableData: [{
                label: '',
                name: '',
                value: ''
            }],
            clearForm: {
                urls: ''
            },
            clearFormDialog: false,
            editlock: false,
            postlock: false,
            postrule: {
                urls: [{
                    required: true,
                    message: 'url不能为空',
                    trigger: 'blur'
                }]
            }
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.$http.get('admin/cdn/setting').then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data;
                }
            });
        },
        edit () {
            this.editlock = true;
            var params = {};
            for (var item of this.tableData) {
                params[item.name] = item.value;
            }
            this.$http.post('admin/cdn/save-setting', params).then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                } else {
                    this.$message.error(res.body.message);
                }
                this.editlock = false;
            });
        },
        update () {
            this.$refs.postform.validate(valid => {
                if (valid) {
                    this.postlock = true;
                    this.$http.post('admin/cdn/clear', this.clearForm).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.clearFormDialog = false;
                        } else {
                            this.$message.error(res.body.message);
                        }
                        this.postlock = false;
                    });
                }
            })
        }
    }

}
</script>
<style>

</style>

