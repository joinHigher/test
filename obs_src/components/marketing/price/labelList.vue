<template>
    <div>
        <div class="el-container">
            <el-row>
                <el-col :span="18">
                    <div class="price-label-box">
                        <el-row>
                            <el-col :span="2" class="text-center">
                                <label>系统标签</label>
                            </el-col>
                            <el-col :span="20">
                                <div class="content">
                                    <el-tag v-for="item in sysData" :key="item.id" type="primary">
                                        {{item.labelId}}.{{item.name}}
                                    </el-tag>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="price-label-box">
                        <el-row>
                            <el-col :span="2" class="text-center">
                                <label>运营标签</label>
                            </el-col>
                            <el-col :span="20">
                                <div class="content">
                                    <el-tag v-for="item in proData" :key="item.id" :closable="self.showAction_('promotion/price/delete-label')" type="primary" @close="handleClose(item)">
                                        {{item.id}}.{{item.name}}
                                    </el-tag>
                                </div>
                            </el-col>
                            <el-col :span="2" class="text-center">
                               <el-button v-if="self.showAction_('promotion/price/add-label')" type="primary" icon="plus" @click="proDialog = true"></el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="添加标签" v-model="proDialog" size="tiny">
            <el-form label-width="100px" class="counpon-site-dialog" :model="option">
                <el-form-item label="标签名称" prop="name" :rules="[{required: true, message: '该项不能为空', trigger: 'blur'}]">
                    <el-input v-model.trim="option.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postEdit" v-loading="postLoading" :disabled="postLoading">确 定</el-button>
                <el-button type="danger" @click="proDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            postLoading: false,
            self: this,
            proDialog: false,
            sysDialog: false,
            sysData: [],
            proData: [],
            option: {
                name: '',
            }
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.$http.get('promotion/price/label-lists').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.labelSites;
                    let sysTemp = [];
                    let proTemp = [];

                    data.forEach(item => {
                        if (item.type === 0) {
                            sysTemp.push(item);
                        } else {
                            proTemp.push(item);
                        }
                    });
                    this.sysData = sysTemp;
                    this.proData = proTemp;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        handleClose (tag) {
            this.$http.post('promotion/price/delete-label', {id: tag.id}).then(res => {
                if (res.body.code === 0) {
                    this.proData.splice(this.proData.indexOf(tag), 1);
                    this.$message.success(res.body.message);
                } else {
                    this.$message.error(res.body.message);
                }
            })
            
        },
        postEdit () {
            let params = {};
            params.name = this.option.name;
            params.type = 1;
            this.postLoading = true;
            this.$http.post('promotion/price/add-label', params).then(res => {
                this.postLoading = false;
                if (res.body.code === 0) {
                    this.getData();
                    this.proDialog = false;
                    this.$message.success(res.body.message);
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.postLoading = false;
            });
        }
    }
}
</script>

<style lang="less">
    .price-label-box {
        clear: both;
        margin-bottom: 20px;

        label {
            display: inline-block;
            line-height: 50px;
        }

        .text-center {
            line-height: 50px;
        }

        .content {
            width: 100%;
            min-height: 50px;
            border: 1px solid #D3DCE6;
            border-radius: 10px;

            .el-tag {
                font-size: 16px;
                margin: 10px;
                border-radius: 10px;
                padding: 0 10px;
                line-height: 30px;
                height: 30px;
            }
        }
    }
</style>