<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑/新增通用模板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-row>
                <el-col :span="12">
                    <el-form label-width="100px" :model="option" ref="postForm">
                        <el-form-item label="模板语言">
                            <el-select v-model="option.lang">
                                <el-option v-for="(item, index) in langOpt" :key="index" :value="item.language_en" :label="item.language_ch"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="模板主题" prop="">
                            <el-input v-model="option.name"></el-input>
                        </el-form-item>
                        <el-form-item label="内容" prop="">
                            <el-input type="textarea" :rows="6" v-model="option.content"></el-input>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" @click="prevDialog = true">模板预览</el-button>
                            <el-button type="primary" @click="post">保存</el-button>
                            <el-button type="danger" @click="goback">返回</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="预览" v-model="prevDialog" size="normal">
            <div v-html="option.content" class="prew-mail"></div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            option: {
                lang: 'en',
                name: '',
                content: ''
            },
            langOpt: [],
            prevDialog: false
        };

    },
    created () {
        this.getOpt();
    },
    methods: {
        getOpt () {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                }
            });
        },
        post () {
            this.$http.post('admin/general-widget/add', this.option).then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        goback () {
            this.$router.push({
                name: 'site_customTemp'
            })
        }
    }
}
</script>
<style>

</style>
