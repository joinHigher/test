<template>
    <div>
        <div class="el-container">
            <el-form :model="faqForm" ref="faqForm" :rules="rules" label-width="270px"  class="faq-form">
                <el-form-item label="语言：" prop="lang">
                    <el-select v-model="faqForm.lang" placeholder="请选择" class="faq-form-item">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道：" prop="pipeline_code">
                    <el-select clearable filterable v-model="faqForm.pipeline_code" placeholder="请选择" class="faq-form-item">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别：" prop="type">
                    <el-select v-model="faqForm.type"  placeholder="全部" class="faq-form-item">
                        <el-option v-for="(value, key) in typeText" :label="value" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类：" prop="cat_ids" v-show="faqForm.type == '1'">
                    <el-select v-model="faqForm.cat_ids" filterable multiple placeholder="所有分类" class="faq-form-item">
                        <el-option v-for="(value, key) in categorys" :label="value.name" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="sku：" prop="skus" v-show="faqForm.type == '2'">
                    <el-input v-model="faqForm.skus" type="textarea" placeholder="请输入sku，以','隔开" class="faq-form-item"></el-input>
                </el-form-item>
                <el-form-item label="" v-show="faqForm.type == '2'">
                    <el-row>
                        <el-col :span="3">
                            <el-button type="primary" @click="searchCategory" :loading="searchCategoryLoading">查询分类</el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="分类Id：" label-width="50px;">
                                <el-input v-model="searchResult.cat_id" :disabled="true" class="faq-form-cat-item"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="分类名称:" label-width="50px;">
                                <el-input v-model="searchResult.cat_name" :disabled="true" class="faq-form-cat-item"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <template v-for="(item, index) in faqForm.faqs">
                    <el-form-item  label="问题：" :key="index" :prop="'faqs.' + index + '.question'">
                        <el-input v-model="item.question" type="textarea" class="faq-form-item" :autosize="{ minRows: 4}"></el-input>
                        <div class="faq-operate-btn">
                            <el-button size="small" @click.prevent="addFaqRow(index)">+</el-button>
                            <el-button size="small" @click.prevent="removeFaqRow(index)">-</el-button>
                            <el-button size="small" @click.prevent="upFaqRow(index)">↑</el-button>
                            <el-button size="small" @click.prevent="downFaqRow(index)">↓</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item  label="答案：" :key="index" :prop="'faqs.' + index + '.answer'">
                        <el-input v-model="item.answer" type="textarea" class="faq-form-item" :autosize="{ minRows: 4}"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="显示：" prop="is_show" >
                    <el-checkbox v-model="faqForm.is_show" :true-label="1" :false-label="0"></el-checkbox>
                </el-form-item>

                <el-form-item label="">
                    <el-button type="primary" :loading="dataLoading" @click="saveFaq" v-if="ctrl">确认</el-button>
                    <el-button type="default" @click="goBack">返回</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                langs: null,
                categorys: null,
                faqForm: {
                    lang: '',
                    pipeline_code: '',
                    type: '1',
                    cat_ids: [],
                    skus: '',
                    is_show: 0,
                    faqs:[{
                        question: '',
                        answer: ''
                    }]
                },
                searchResult: {
                    cat_id: '',
                    cat_name: ''
                },
                typeText: {
                    '1': '分类',
                    '2': '商品'
                },
                dataLoading: false,
                searchCategoryLoading: false,
                rules: {
                    lang: [
                        { required: true, message: '请选择语言', trigger: 'change' }
                    ],
                    pipeline_code: [
                        { required: true, message: '请选择渠道', trigger: 'change' }
                    ]
                },
                isEdit: false
            }
        },
        computed: {
            ctrl() {
                if (this.$route.query['id']) {
                    return this.showAction_('admin/goods-faq/edit');
                } else {
                    return this.showAction_('admin/goods-faq/add');
                }
            },

            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.isEdit = this.$route.query.id ? true : false;
            if(this.isEdit) {
                this.getFaqInfo();
            }
            this.initData();
        },
        methods: {
            initData() {
                this.getLangs();
                this.getAllCategory();
            },
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
            // 获取分类列表
            getAllCategory() {
                this.$http.get('seo/public/category-all').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    this.categorys = res.body.data;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 编辑时获取info
            getFaqInfo() {
                this.$http.get('admin/goods-faq/info', {params: {
                    id: this.$route.query.id
                }}).then(res => {
                    if (res.body.code == 0) {
                        let data = res.body.data;
                        data.cat_ids = data.cat_ids ? data.cat_ids.split(',') : [];
                        data.faqs = JSON.parse(data.content);
                        data.type = String(data.type);
                        delete data.content;
                        delete data.update_time;
                        delete data.create_time;
                        delete data.order;
                        this.faqForm = data;
                        // console.log(this.faqForm)
                    } else {
                        this.$message.error(res.body.message);
                    }
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                })
            },
            // 查询分类
            searchCategory() {
                this.searchCategoryLoading = true;
                this.$http.get('admin/public/valid-same-category-goods').then(res => {
                    this.searchCategoryLoading = false;
                    if (res.body.code !== 0) {
                        return;
                    }
                    this.searchResult = res.body.data;
                    // console.log(this.searchResult)
                },
                (err) => {
                    this.searchCategoryLoading = false;
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 增加问题
            addFaqRow(index) {
                this.faqForm.faqs.push({
                    question: '',
                    answer: ''
                });
            },
            // 删除问题
            removeFaqRow(index) {
                if (index !== 0) {
                    this.faqForm.faqs.splice(index, 1);
                }
            },
            // 向上
            upFaqRow(index) {
                if (index === 0) {
                    return;
                }
                let faqArr = JSON.parse(JSON.stringify(this.faqForm.faqs));
                [faqArr[index], faqArr[index-1]] = [faqArr[index-1], faqArr[index]];
                this.faqForm.faqs = faqArr;

            },
            // 向下
            downFaqRow(index) {
                if(this.faqForm.faqs.length - 1 === index){
                    return;
                }
                let faqArr = JSON.parse(JSON.stringify(this.faqForm.faqs));
                [faqArr[index + 1], faqArr[index]] = [faqArr[index], faqArr[index + 1]];
                this.faqForm.faqs = faqArr;
            },
            // 新增、修改操作
            saveFaq() {
                this.$refs.faqForm.validate((valid) => {
                    if (valid) {
                        this.dataLoading = true;
                        let params = JSON.parse(JSON.stringify(this.faqForm));
                            if(params.type == 1) {
                                params.cat_ids = params.cat_ids ? params.cat_ids.join(',') : '';
                                params.skus = '';
                            } else if(params.type == 2) {
                                params.cat_ids = '';
                            }
                            params.content = JSON.stringify(params.faqs);
                            delete params.faqs;
                        if(this.isEdit) {
                            params.id = this.$route.query.id;
                        }
                        this.$http.post('admin/goods-faq/' + (this.isEdit ? 'edit' : 'add'), params).then(res => {
                            this.dataLoading = false;
                            if (res.body.code == 0) {
                                this.$message.success(res.body.message || '执行成功');
                                if(!this.isEdit){
                                    this.goBack();
                                }
                            } else {
                                this.$message.error(res.body.message || '发生错误');
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 返回
            goBack() {
                this.$router.push({ name: 'site_commodityFaqList' });
            }
        }
    }
</script>
<style lang="less">
    .faq-form{
        width: 70%;
        margin: 20px auto 0 auto;
        .faq-form-item {
            width: 400px;
        }
        .faq-form-cat-item{
            width: 200px;
        }
        .faq-operate-btn{
            display: inline-block;
            margin-left: 20px;
        }
    }
</style>
