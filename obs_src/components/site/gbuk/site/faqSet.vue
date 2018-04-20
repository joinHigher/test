<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/siteList'}">站点设置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/faqList'}">FAQ管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-form :model="addForm"  label-width="100px" :rules="addRule" ref="addForm">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="文章分类" prop="cat_id">
                            <el-col :span="16">
                                <el-select v-model="addForm.cat_id">
                                    <el-option v-for="(item, index) in categoryOpt" :label="item" :value="index" :key="index"></el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="文章标题" prop="title">
                            <el-col :span="16">
                                <el-input v-model="addForm.title"></el-input>
                            </el-col>
                            <el-col :span="7" :offset="1">
                                <el-button type="primary" @click="prevDialog = true">预览</el-button>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="地址链接">
                            <el-col :span="16">
                                <el-input v-model="addForm.url"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="排序" prop="order">
                            <el-col :span="16">
                                <el-input v-model="addForm.order"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="是否启用">
                            <el-col :span="16">
                                <el-radio-group v-model="addForm.is_enable">
                                    <el-radio class="radio"  :label="1 * 1">启用</el-radio>
                                    <el-radio class="radio"  :label="0 * 1">禁用</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="文章内容">
                            <el-input type="textarea" :rows="24" v-model="addForm.content"></el-input>
                        </el-form-item>
                        <div class="text-right">
                            <el-button type="primary" @click="postData" v-loading="postLoading">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="预览" v-model="prevDialog" size="normal">
            <div v-html="addForm.content" class="prew-mail"></div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            postLoading: false,
            addForm: {
                title: '',
                order: '',
                is_enable: '',
                url: '',
                cat_id: ''
            },
            addRule: {
                title: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                order: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }]
            },
            option: {
                platform: this.$route.query.platform,
                language: this.$route.query.language
            },
            tableData: [],
            categoryOpt: [],
            prevDialog: false,
        };
    },
    created () {
        var self = this;

        self.getData();
        self.getCategory();
    },
    methods: {
        getData () {
            var self = this;

            self.$http.get('admin/article/info', {params: {id: self.$route.query.id}}).then(res => {
                self.addForm = res.body.data;
                self.addForm.order += '';
                self.addForm.cat_id = self.addForm.cat_id + '';
            })
        },
        getCategory () {
            this.$http.get('admin/public/article-category-select-options').then(res => {
                this.categoryOpt = res.body.data;
            });
        },
        postData () {
            var self = this;
            self.$refs.addForm.validate(valid => {
                if (valid) {
                    self.postLoading = true;
                    let postUrl = self.addForm.id ? 'admin/article/edit' : 'admin/article/add';
                    self.$http.post(postUrl, self.addForm).then(res => {
                        self.postLoading = false;

                        if (res.body.code == '0') {
                            self.$message({
                                type: 'success',
                                message: res.body.message
                            });
                            history.back();
                        } else {
                            self.$message.error(res.body.message);
                        }
                    })
                }
            })
        },
        goback () {
            history.back();
        }
    }
}
</script>
