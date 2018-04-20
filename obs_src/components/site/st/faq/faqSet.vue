<template>
    <div>
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
                        <el-form-item label="排序" prop="order" required>
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
                            <el-button v-if="self.showAction_('admin/article/edit')" type="primary" @click="postData" v-loading="postLoading" :disabled="postLoading">保存</el-button>
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
        let checkOrder = (rule, value, callback) => {
            if(Number.isInteger(value * 1) && value * 1 > 0) {
                callback();
            } else {
                callback(new Error('该项不能为空,且为大于0的整数'));
            }
        }

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
                    validator: checkOrder,
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
            self.postLoading = true;
            self.$refs.addForm.validate(valid => {
                if (valid) {
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
                    }).catch(err => {
                        self.postLoading = false;
                    });
                } else {
                    self.postLoading = false;
                }
            })
        },
        goback () {
            this.$router.push({
                name: 'site_faqList',
            })
        }
    }
}
</script>
