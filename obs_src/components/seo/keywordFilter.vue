<template>
    <div>
        <div class="el-container">
            <el-form :model="tableData" class="form" label-width="200px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="语言" prop="lang" :rules="required">
                            <el-select v-model="tableData.lang" placeholder="请选择" class="tpl-form-item" @change="getData">
                                <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="渠道" prop="pipeline_code" :rules="required">
                            <el-select clearable filterable v-model="tableData.pipeline_code" placeholder="请选择" class="tpl-form-item" @change="getData">
                                <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="不参与搜索关键词">
                            <el-input type="textarea" :rows="8" v-model="tableData.not_search"></el-input>
                            <span class="tips">以半角逗号隔开，不支持词组，如cell phone</span>
                        </el-form-item>
                        <el-form-item label="以该关键词开始不入库">
                            <el-input type="textarea" :rows="8" v-model="tableData.not2db_start_with"></el-input>
                            <span class="tips">以半角逗号隔开</span>
                        </el-form-item>
                        <el-form-item label="以该关键词结束不入库">
                            <el-input type="textarea" :rows="8" v-model="tableData.not2db_end_with"></el-input>
                            <span class="tips">以半角逗号隔开</span>
                        </el-form-item>
                        <el-form-item label="同义词处理">
                            <el-input type="textarea" :rows="8" v-model="tableData.synonyms"></el-input>
                            <span class="tips">一行一组相近词，不同词用英文逗号分开,同一组词不能有空格</span>
                        </el-form-item>
                        <el-form-item label="替换关键词">
                            <el-input type="textarea" :rows="8" v-model="tableData.replace_keywords"></el-input>
                            <span class="tips">一行一组，用英文逗号分开，搜索结果以最后一个关键字为准。eg: 'Women S ','Womens ','Men S ','Mens '</span>
                        </el-form-item>
                        <el-form-item label="过滤未授权品牌词">
                            <el-input type="textarea" :rows="8" v-model="tableData.unauthorized"></el-input>
                            <span class="tips">一行一个品牌词，不支持词组，不允许品牌词有两个连着的空格</span>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" @click="edit" v-loading="editLoading" v-if="self.showAction_('seo/seo-setting/edit')">保存</el-button>
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
        let required = [{required: true, message: '该项不能为空'}];
        return {
            self: this,
            required: required,
            editLoading: false,
            tableData: {
                synonyms: '',
                not_search: '',
                not2db_start_with: '',
                not2db_end_with: '',
                replace_keywords: '',
                unauthorized: '',
                lang: 'en',
                pipeline_code: 'GB',
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
        this.getData();
    },
    methods: {
        // 获取语言列表
        getLangs() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code !== 0) {
                    return;
                }
                this.langs = res.body.data;
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getData () {
            let params = {
                pipeline_code: this.tableData.pipeline_code,
                lang: this.tableData.lang,
            };
            this.$http.get('seo/seo-setting/list', {params: params}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data;
                }
            });
        },
        edit () {
            this.editLoading = true;
            this.$http.post('seo/seo-setting/edit', this.tableData).then(res => {
                this.editLoading = false;
                if (res.body.code === 0) {
                    this.$message({
                      message: res.body.message,
                      type: 'success'
                    });
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.editLoading = false;
            });
        }
    }

}
</script>

<style>
    .form .el-textarea {
        position: relative;
    }
    .form span.tips {
        position: absolute;
        right: -320px;
        top: 0;
        display: block;
        width: 300px;
    }
</style>

