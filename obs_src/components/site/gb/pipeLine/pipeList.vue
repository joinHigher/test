<!-- gb 渠道列表 -->
<template>
    <div class="el-container gb-lang-list">
        <div class="text-right el-sub-container">
            <el-button type="primary" @click="addDialog = true" v-if="self.showAction_('admin/pipeline/add')">新增</el-button>
        </div>
        <el-table border :data="tableData" v-loading="tableLoading">
            <el-table-column prop="pipeline_name" label="渠道名称"></el-table-column>
            <el-table-column prop="pipeline_code" label="渠道简码"></el-table-column>
            <el-table-column prop="domain" label="渠道域名"></el-table-column>
            <el-table-column prop="platforms" label="平台">
                <template scope="scope">
                    <span style="display: inline-block;" v-for="(item, index) in scope.row.platforms.split(',')">{{ self.platOpt[item] }} {{scope.row.platforms.split(',').length - 1 > index ? ',' : ''}}</span>
                </template>
            </el-table-column>
            <el-table-column label="启用状态">
                <template scope="scope">
                    <i :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}"></i>
                </template>
            </el-table-column>
            <el-table-column prop="languages" label="已启用语言"></el-table-column>
            <el-table-column prop="warehouses" label="已启用仓"></el-table-column>
            <el-table-column label="是否默认">
                <template scope="scope">
                    <span v-if="scope.row.is_default === 1">是</span>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="edit(scope.row.id)" v-if="self.showAction_('admin/pipeline/info')">编辑</el-button>
                    <el-button size="small" :type="scope.row.status == 1 ? 'danger' : 'success'" @click="remove(scope.row)" v-if="self.showAction_('admin/pipeline/change-status')">
                        <span v-if="scope.row.status == 1">停用</span>
                        <span v-else>启用</span>
                    </el-button>
                    <template v-if="self.showAction_('admin/pipeline/set-default')">
                        <el-button type="primary" size="small" v-if="scope.row.is_default === 0" @click="setDefault(scope.row)">设为默认</el-button>
                        <el-button type="danger" size="small" v-if="scope.row.is_default === 1" @click="setDefault(scope.row)">取消默认</el-button>
                    </template>
                    <!-- <span v-if="scope.row.is_default === 1">默认渠道</span> -->
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗S -->
        <el-dialog title="新增" v-model="addDialog" size="tiny">
            <el-form label-width="100px" :model="addForm" ref="addForm">
                <el-form-item label="渠道名称" prop="pipeline_code" :rules="required">
                    <el-select v-model="addForm.pipeline_code">
                        <el-option v-for="(item, index) in pipeList" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用" prop="status" :rules="required">
                    <el-radio-group v-model="addForm.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">不启用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择平台" prop="platforms" :rules="required">
                    <el-checkbox-group v-model="addForm.platforms">
                        <el-checkbox v-for="(key, val) in platOpt" :label="val" :value="key" :key="val">{{key}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="渠道域名" prop="domain" :rules="required">
                    <el-input v-model="addForm.domain"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="add" v-loading="addLoading" :disabled="addLoading">确 定</el-button>
                <el-button @click="addDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>
    export default {
        data() {
            let required = [{required: true, message: '该项不能为空'}];
            return {
                self: this,
                addLoading: false,
                addDialog: false,
                tableLoading: false,
                tableData: [],
                addForm: {
                    pipeline_code: '',
                    status: '',
                    platforms: [],
                    domain: '',
                },
                pipeList: [],
                required: required,
                platOpt: {
                    '1': 'PC',
                    '2': 'Wap',
                    '3': 'IOS',
                    '4': 'Android',
                    '5': 'Pad'
                },
            }
        },
        created() {
            this.getPipeList();
            this.getData();
        },
        methods: {
            getPipeList() {
                this.$http.get('base/public/pipeline-cdp').then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        let temp = {};

                        data.forEach(item => {
                            temp[item.pipeline_code] = item.pipeline_name;
                        });
                        this.pipeList = temp;
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            },
            getData() {
                this.$http.get('admin/pipeline/list').then(res => {
                    if (res.body.code === 0) {
                        this.tableData = res.body.data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            edit(id) {
                this.$router.push({
                    name: 'site_pipeEdit',
                    query: {
                        id: id,
                    }
                })
            },
            remove(row) {
                let params = {};
                params.id = row.id;
                params.status = row.status == 1 ? 0 : 1;
                this.$http.post('admin/pipeline/change-status', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            add () {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        let params = JSON.parse(JSON.stringify(this.addForm));
                        params.pipeline_name = this.pipeList[params.pipeline_code];
                        params.platforms = params.platforms.toString();

                        this.addLoading = true;
                        this.$http.post('admin/pipeline/add', params).then(res => {
                            this.addLoading = false;
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                                this.addDialog = false;
                                this.getData();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.addLoading = false;
                        })
                    }
                })

            },
            setDefault (row) {
                let params = {
                    id: row.id,
                    default: row.is_default == 1 ? 0 : 1,
                };
                this.$http.post('admin/pipeline/set-default', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            },
        },
    }
</script>

<style lang="less">

</style>
