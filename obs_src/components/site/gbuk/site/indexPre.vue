<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/siteList'}">站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>首页生成</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-button type="primary" @click="initIndex"  v-loading="lock">生成首页</el-button>
            <a v-if="preview" :href="indexUrl" class="el-button el-button--primary" target="_blank">
                预览首页
            </a>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            indexUrl: '',
            lock: '',
            preview: false,
        };
    },
    created () {
    },
    methods: {
        initIndex () {
            var self = this;
            self.lock = true;

            self.preview = false;
            self.$http.get('admin/home/create').then(res => {
                self.lock = false;
                if (res.body.code === 0) {
                    self.indexUrl = res.body.data.url;
                    self.preview = true;
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: res.body.message
                    });
                }
            })
        }
    }

}
</script>
<style>

</style>

