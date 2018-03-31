<style>

</style>
<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">
            <el-row>
                <el-col :span="10">
                    <el-form inline>
                        <el-form-item label="请选择平台">
                            <el-select @change="changeTable" clearable v-model="plat">
                                <el-option v-for="(item, index) in platformOpt" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col class="text-right" :span="14">
                    <el-button v-if="self.showAction_('admin/site-version/add')" type="primary" @click="handleBtnAddClick">上传最新版本</el-button>
                </el-col>
            </el-row>

            <el-table :border="true" :data="tableData">
                <el-table-column prop="platform" label="平台"></el-table-column>
                <el-table-column prop="version" label="版本号"></el-table-column>
                <el-table-column prop="desc" label="版本说明"></el-table-column>
                <el-table-column label="上传时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="update_user" label="编辑人"></el-table-column>
                <el-table-column label="编辑时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('admin/site-version/edit')" type="primary" size="small" @click="handleBtnEditClick(scope.row)">查看并编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>

        <!-- 弹窗S -->
        <el-dialog :title="editDlg.isAdd ? '上传版本说明' : '编辑版本说明'" v-model="editDlg.isDlgShow" size="tiny">
            <el-form :model="editDlg"  label-width="80px" :rules="rule" ref="editDlg">
                <el-form-item label="平台" prop="platform">
                    <el-select v-model="editDlg.platform">
                        <el-option v-for="(item, index) in platformOpt" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本号" prop="version">
                    <el-input v-model.trim="editDlg.version" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="版本说明" prop="desc">
                    <el-input type="textarea" :rows="4" v-model.trim="editDlg.desc" :maxlength="2000"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleBtnSaveClick" v-loading="editDlg.isLoading">确 定</el-button>
                <el-button @click="editDlg.isDlgShow = false">取 消</el-button>
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
            isDataLoading: false,
            editDlg: {
                isDlgShow: false,
                isLoading: false,
                isAdd: true,
                id: -1,
                platform: '',
                version: '',
                desc: ''
            },
            plat: '',
            tableData: [],
            platformOpt: [],
            rule: {
                platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
                version: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                desc: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
            },
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getplatform();
            this.changeTable();
        },
        getplatform () {
            this.$http.get('admin/public/platforms').then(res => {
                this.platformOpt = res.body.data;
            });
        },
        // 切换平台
        changeTable (value) {
            this.isDataLoading = true;
            this.$http.get('admin/site-version/list', {params: {platform: value}}).then(res => {
                this.isDataLoading = false;
                this.tableData = res.body.data;
            });
        },
        // 上传新版本
        handleBtnAddClick () {
            this.editDlg.isAdd = true;
            this.editDlg.id = -1;
            this.editDlg.isDlgShow = true;
            this.editDlg.platform = '';
            this.editDlg.version = '';
            this.editDlg.desc = '';
            this.$nextTick(() => {
                this.$refs.editDlg.resetFields();
            });
        },
        handleBtnEditClick (row) {
            this.editDlg.isAdd = false;
            this.editDlg.id = row.id;
            this.editDlg.version = row.version;
            this.editDlg.desc = row.desc;
            this.editDlg.isDlgShow = true;
            for (let item in this.platformOpt) {
                if (this.platformOpt[item] === row.platform) {
                    this.editDlg.platform = item;
                    break;
                }
            }
            this.$nextTick(() => {
                this.$refs.editDlg.validate();
            });
        },
        handleBtnSaveClick () {
            let hasError = false;
            let params = {
                platform: this.editDlg.platform,
                version: this.editDlg.version,
                desc: this.editDlg.desc
            };
            if (this.editDlg.isLoading) {
                return;
            }
            this.$refs.editDlg.validate(valid => {
                if (!valid) {
                    hasError = true;
                }
            });
            if (hasError) {
                return;
            }
            if (!this.editDlg.isAdd) {
                if (this.editDlg.id === -1) {
                    return;
                }
                params.id = this.editDlg.id;
            }
            this.editDlg.isLoading = true;
            this.$http.post('admin/site-version/' + (this.editDlg.isAdd ? 'add' : 'edit'), params).then(res => {
                this.editDlg.isLoading = false;
                if (res.body.code != '0') {
                    this.$message.error(res.body.message);
                    return;
                }
                this.changeTable();
                this.editDlg.isDlgShow = false;
                this.$message.success(res.body.message);
            });
        }
    },
}
</script>

