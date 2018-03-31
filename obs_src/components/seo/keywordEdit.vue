<!-- 关键词编辑 -->
<template>
    <div>
        <div class="el-container">
            <el-form :model="tableData"  label-width="200px" class="form" v-loading="tableLoading" ref="postForm" :rules="postRule">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="语言" prop="lang">
                            <el-select clearable filterable v-model="tableData.lang" placeholder="请选择" class="tpl-form-item">
                                <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="渠道" prop="pipeline_code">
                            <el-select clearable filterable v-model="tableData.pipeline_code" placeholder="请选择" class="tpl-form-item">
                                <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键词" prop="keywords">
                            <el-input v-model="tableData.keywords" :disabled="!edit"></el-input>
                            <span class="tips">100个字符以内</span>
                        </el-form-item>
                        <el-form-item label="绑定分类" prop="bind_cat_id">
                            <el-select v-model="tableData.bind_cat_id" filterable>
                                <el-option v-for="item in catList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="绑定分类id">
                            <el-input :disabled="true" v-model="tableData.bind_cat_id"></el-input>
                        </el-form-item>
                        <el-form-item label="排除分类">
                            <el-select v-model="tableData.exclude" multiple placeholder="请选择" @change="changeExclude">
                                <el-option v-for="item in catList" :key="item.id" :label="item.name" :value="item.id + ''"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排除分类id">
                            <el-input :disabled="true" v-model="tableData.exclude_cat_ids"></el-input>
                        </el-form-item>
                        <el-form-item label="排除SKU">
                            <el-input v-model="tableData.exclude_goods_skus" placeholder="以','隔开"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="网站标题">
                            <el-input type="textarea" :rows="4" v-model="tableData.site_title"></el-input>
                            <span class="tips">#####将被替换成搜索关键。100个字符以内</span>
                        </el-form-item>
                        <el-form-item label="meta描述">
                            <el-input type="textarea" :rows="4" v-model="tableData.meta_description"></el-input>
                            <span class="tips">#####将被替换成搜索关键。100个字符以内</span>
                        </el-form-item>
                        <el-form-item label="限定分类网站标题">
                            <el-input type="textarea" :rows="4" v-model="tableData.limit_category_site_title"></el-input>
                            <span class="tips">##category：分类，##attribute搜索词“##...”将被替换。100个字符以内</span>
                        </el-form-item>
                        <el-form-item label="限定分类meta关键词">
                            <el-input type="textarea" :rows="4" v-model="tableData.limit_category_meta_keyword"></el-input>
                            <span class="tips">##category：分类，##attribute搜索词“##...”将被替换。500个字符以内</span>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" @click="save" v-loading="saveLoading" :disabled="saveLoading">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
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
        let checkNum = (rule, value, callback) => {
            if ((value && Number(value)) || value === 0) {
                callback();
            } else {
                callback(new Error('该项不能为空'));
            }
        }

        return {
            tableLoading: true,
            saveLoading: false,
            tableData: {
                keywords: '',
                bind_cat_id: '',
                site_title: '',
                limit_category_site_title: '',
                meta_description: '',
                limit_category_meta_keyword: '',
                exclude: [],
                exclude_cat_ids: '',
                exclude_goods_skus: '',
                lang: '',
                pipeline_code: '',
            },
            viewDialog: false,
            id: this.$route.query.id,
            edit: true,
            catList: {},
            postRule: {
                keywords: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur',
                }],
                lang: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change',
                }],
                pipeline_code: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change',
                }],
                bind_cat_id: [{
                    validator: checkNum
                }],
            },
            langs: null,
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getLangs();
        this.getCat();
    },
    methods: {
        // 获取语言列表
        getLangs() {
            this.$http.get('admin/language/list').then(res => {
                if (res.body.code !== 0) {
                    return;
                }
                this.langs = res.body.data;
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getCat () {
            this.$http.get('seo/public/category-all').then(res => {
                if (res.body.code === 0) {
                    var data = res.body.data;
                    data[0] = {
                        id: 0,
                        name: '暂无分类'
                    }
                    this.catList = data;
                    this.getData();
                } else {
                    this.tableLoading = false;
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            var self = this;
            var id = this.$route.query.id;

            if (typeof id !== 'undefined') {

                this.tableLoading = true;
                self.$http.get('seo/abc-index-keyword/info', {params: {id: this.$route.query.id}}).then(res => {
                    if (res.body.code === 0) {
                        var data = res.body.data;
                        data.exclude = data.exclude_cat_ids === '' ? [] : data.exclude_cat_ids.split(',');
                        this.tableData = data;
                        this.$nextTick(() => {
                            this.tableLoading = false;
                        });
                    } else {
                        this.tableLoading = false;
                        this.$message.error(res.body.message);
                    }
                }).catch(err => {
                    this.tableLoading = false;
                });
            } else {
                this.tableLoading = false;

                this.tableData.ids = this.$route.query.ids;
                this.tableData.keywords = this.$route.query.keywords;
                this.edit = false;
            }
        },
        changeExclude (val) {
            if (typeof val === 'object') {
                this.tableData.exclude_cat_ids = val.join(',');
            }
        },
        save () {
            this.saveLoading = true;
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let params = {};

                    for (let i in this.tableData) {
                        if (i !== 'exclude') {
                            params[i] = this.tableData[i];
                        }
                    }

                    if (typeof this.tableData.id !== 'undefined') {
                        this.$http.post('seo/abc-index-keyword/edit', params).then(res => {
                            this.saveLoading = false;
                            if (res.body.code === 0) {
                                this.$message({
                                    message: res.body.message,
                                    type: 'success'
                                });
                                history.back();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.saveLoading = false;
                        });
                    } else {
                        this.$http.post('seo/abc-index-keyword/match-edit', params).then(res => {
                            this.saveLoading = false;
                            if (res.body.code === 0) {
                                this.$message({
                                    message: res.body.message,
                                    type: 'success'
                                });
                                history.back();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.saveLoading = false;
                        });
                    }
                } else {
                    this.saveLoading = false;
                }
            });

        },
        goback () {
            this.$router.push({
                name: 'seo_keywordList'
            })
        },
    }

}
</script>

<style>
    .middle {padding-top: 10px;clear: both;}
    .plusBtn {margin-left: 20px;}
    .form .el-form-item__content {
        position: relative;
    }
    .form span.tips {
        position: absolute;
        right: -320px;
        top: 0;
        display: block;
        width: 300px;
    }

    .skulist .el-dialog{
        width: 1375px;
    }

    .content {
        clear: both;
    }

    .content ul {
        display: block;
        float: left;
        max-width: 1366px;
    }
    .content li {
        float: left;
        width: 220px;
        height: 120px;
        border:1px solid #000;
        list-style: none;
    }

    .content li img {
        width: 100px;
        height: 100px;
        float: left;
        margin-left: 20px;
        margin-top: 10px;
    }

    .content .info {
        width: 80px;
        padding: 10px;
        float: left;
    }

    .content .info p {
        margin-bottom: 5px;
    }
</style>


