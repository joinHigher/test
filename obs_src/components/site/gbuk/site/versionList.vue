<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/siteList'}">站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>版本控制</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-row>
                <el-col :span="5">
                    <el-form label-width="100px">
                        <el-form-item label="请选择平台">
                            <el-select @change="changeTable" v-model="plat">
                                <el-option v-for="(item, index) in platformOpt" :label="item" :value="index" :key="index" :selected="!(index - 1)"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col class="text-right" :span="19">
                    <el-button type="primary" @click="updateDialog = true" v-if="self.showAction_('admin/site-version/add')">上传最新版本</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="el-container">
            <el-table :border="true" :data="tableData" v-loading="tableLoading">
                <el-table-column prop="platform" label="平台"></el-table-column>
                <el-table-column prop="version" label="版本号"></el-table-column>
                <el-table-column prop="desc" label="版本说明"></el-table-column>
                <el-table-column label="上传时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="update_user" label="编辑人"></el-table-column>
                <el-table-column label="编辑时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <router-link v-if="self.showAction_('admin/site-version/info')" :to="{name: 'site_versionView', query: {id: scope.row.id}}">查看并编辑</router-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="上传版本说明" v-model="updateDialog" size="tiny">
            <el-form :model="form"  label-width="80px" :rules="rule" ref="form">
                <el-form-item label="平台">
                    <el-input v-model="form.platform_txt" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="版本号" prop="version">
                    <el-input v-model="form.version"></el-input>
                </el-form-item>
                <el-form-item label="版本说明" prop="desc">
                    <el-input type="textarea" :rows="4" v-model="form.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="update" v-loading="upLoading">上 传</el-button>
                <el-button @click="updateDialog = false">取 消</el-button>
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
            tableLoading: false,
            upLoading: false,
            form: {
                selectAll: false,
                platform: '1',
                platform_txt: 'PC',
                version: '',
                desc: ''
            },
            plat: '1',
            tableData: [],
            updateDialog: false,
            platformOpt: [],
            rule: {
                version: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                desc: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }]
            }
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            var self = this;

            self.getplatform();
            self.changeTable('0');
        },
        getplatform () {
            var self = this;

            self.$http.get('admin/public/platforms').then(res => {
                self.platformOpt = res.body.data;
            });
        },
        // 切换平台
        changeTable (value) {
            var self = this;

            self.tableLoading = true;
            self.$http.get('admin/site-version/list', {params: {platform: value}}).then(res => {
                self.tableLoading = false;
                if (res.body.code === 0) {
                    self.tableData = res.body.data;
                }
            });
            // 切换弹窗的默认平台
            if (value == '0') {
                self.form.selectAll = true;
            } else {
                self.form.selectAll = false;
                self.form.platform_txt = self.platformOpt[value];
                self.form.platform = value;
            }

        },
        // 上传新版本
        update () {
            var self = this;

            self.$refs.form.validate(valid => {
                if (valid) {
                    self.$http.post('admin/site-version/add', self.form).then(res => {
                        if (res.body.code == '0') {
                            self.form.version = '';
                            self.form.desc = '';
                            self.$message({
                              message: res.body.message,
                              type: 'success'
                            });
                            self.tableData.unshift(res.body.data)
                            var val = self.form.selectAll ? '' : self.form.platform
                            self.changeTable(val);
                            self.updateDialog = false;
                        } else {
                            self.$message.error(res.body.message);
                        }
                    });
                }
            })
        }
    }

}
</script>

<style>

</style>

