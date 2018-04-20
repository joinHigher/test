<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/siteList'}">站点设置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/versionList'}">版本控制</el-breadcrumb-item>
                <el-breadcrumb-item>编辑版本</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-form :model="form"  label-width="80px" :rules="rule" ref="form">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="平台" prop="platform">
                            <el-select v-model="form.platform">
                                 <el-option v-for="(item, index) in platformOpt" :label="item" :value="index * 1" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版本号" prop="version">
                            <el-input v-model="form.version"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="版本说明" prop="desc">
                            <el-input type="textarea" :rows="4" v-model="form.desc"></el-input>
                        </el-form-item>
                        <div class="text-right">
                            <el-button v-if="self.showAction_('admin/site-version/edit')" type="primary" @click="save" v-loading="saveLoading">保 存</el-button>
                            <el-button @click="goback" type="danger">取 消</el-button>
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
        return {
            self: this,
            saveLoading: false,
            form: {
                platform: '',
                version: '',
                desc: ''
            },
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

            },
            platformOpt: []
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getData();
            this.getplatform();
        },
        getData () {
            var self = this;

            self.$http.get('admin/site-version/info', {params: {id: this.$route.query.id}}).then(res => {
                self.form = res.body.data;
            })
        },
        getplatform () {
            var self = this;

            self.$http.get('admin/public/platforms').then(res => {
                self.platformOpt = res.body.data;
            });
        },
        save () {
            var self = this;

            self.$refs.form.validate(valid => {
                if (valid) {
                    self.saveLoading = true;
                    self.$http.post('admin/site-version/edit', self.form).then(res => {
                        self.saveLoading = false;
                        if (res.body.code == 0) {
                            self.$message({
                                type: 'success',
                                message: res.body.message
                            });
                            this.$router.push({name: 'site_versionList'});
                        } else {
                            self.$message.error(self.message);
                        }
                    });
                }
            })
        },
        goback() {
            history.back();
        }
    }
}
</script>

<style>

</style>


