<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/siteList'}">站点设置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/versionList'}">版本控制</el-breadcrumb-item>
                <el-breadcrumb-item>查看版本</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-form class="add-lang" :model="form"  label-width="80px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="平台">
                            <el-input disabled v-model="form.platform"></el-input>
                        </el-form-item>
                        <el-form-item label="版本号">
                            <el-input disabled v-model="form.version"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="版本说明">
                            <el-input disabled type="textarea" :rows="6" v-model="form.comment"></el-input>
                        </el-form-item>
                        <div class="text-right">
                            <router-link :to="'/site/versionEdit?id=' + id" class="el-button el-button--primary">编 辑</router-link>
                            <el-button @click.native.prevent="goback" type="danger">取 消</el-button>
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
            form: {
                platform: '',
                version: '',
                comment: ''
            },
            platformOpt: {},
            id: this.$route.query.id
        };
    },
    created () {
        this.getplatform();
    },
    methods: {
        getplatform () {
            var self = this;

            self.$http.get('admin/public/platforms').then(res => {
                self.platformOpt = res.body.data;
                self.getData();
            });
        },
        getData () {
            var self = this;

            self.$http.get('admin/site-version/info', {params: {id: this.$route.query.id}}).then(res => {
                self.form = res.body.data;
                self.form.platform = self.platformOpt[self.form.platform];
            })
        },
        goback () {
            history.back();
        }
    }

}
</script>

<style>

</style>

