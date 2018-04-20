<template>
    <div>
        <div class="el-container">
            <el-form :model="form" ref="form" :rules="rules"  label-width="270px"  class="form">
                <el-form-item label="文章标题：" prop="title">
                    <el-input v-model="form.title" placeholder="请填写文章标题" class="form-item"></el-input>
                    <span>文章标题需统一样式</span>
                </el-form-item>
                <el-form-item label="作者：" prop="author_id">
                    <el-select v-model="form.author_id" placeholder="请选择" class="form-item">
                        <el-option v-for="item in authors" :label="item.author" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模块：" prop="article_type">
                    <el-select v-model="form.article_type" placeholder="请选择" class="form-item">
                        <el-option v-for="(item, index) in typeText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="基础浏览量：" prop="virtual_visited_count">
                    <el-input v-model="form.virtual_visited_count" placeholder="请填写基础浏览量" class="form-item"></el-input>
                    <span v-if="isEdit">&nbsp;实际浏览量 &nbsp; {{visited_count}}</span>
                </el-form-item>
                <el-form-item label="是否显示：" prop="is_display">
                    <el-radio-group v-model="form.is_display">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="头部SEO标题：" prop="seo_title">
                    <el-input v-model="form.seo_title" placeholder="请填写头部SEO标题" class="form-item"></el-input>
                </el-form-item>
                <el-form-item label="SEO关键词：" prop="keyword">
                    <el-input v-model="form.keyword" placeholder="请填写SEO关键词" class="form-item"></el-input>
                </el-form-item>
                <el-form-item label="摘要：" prop="description">
                    <el-input v-model="form.description" type="textarea" :row="4"  class="form-item"></el-input>
                </el-form-item>
                <!-- HOW TO   -->
                <template v-if="form.article_type == 3 || form.article_type == 4">
                    <el-form-item label="选择分类：" prop="cat_id">
                        <el-select v-model="form.cat_id" placeholder="请选择" class="form-item">
                            <el-option v-for="(item, index) in CatText" :label="item" :value="index" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <!-- HOW TO   -->
                <el-form-item label="列表页图片地址：" prop="list_img_url">
                    <el-input v-model="form.list_img_url" placeholder="请填写列表页图片地址" class="form-item"></el-input>
                </el-form-item>
                <!-- Download -->
                <template v-if="form.article_type == 4">
                    <el-form-item label="选择Download文章类型：" prop="download_cat_id">
                        <el-select v-model="form.download_cat_id" placeholder="请选择" class="form-item">
                            <el-option v-for="(item, index) in downloadText" :label="item" :value="index" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <!-- Download -->
                <!-- Download -->
                <template v-for="(annex, index) in form.annexs" v-if="form.article_type == 4">
                    <el-form-item  :label="'附件标题' + (index + 1) + '：'" :key="index" :prop="'annexs.' + index + '.download_title'" :rules="{required: true, message: '附件标题不能为空', trigger: 'blur'}">
                        <el-input v-model="annex.download_title" placeholder="请填写附件标题" class="form-item"></el-input>
                        <el-button @click="addAnnex" type="primary">+</el-button>
                        <el-button @click="removeAnnex(index)" type="danger">-</el-button>
                    </el-form-item>
                    <el-form-item  :label="'附件Url' + (index + 1) + '：'" :key="index" :prop="'annexs.' + index + '.download_files'" :rules="{required: true, message: '附件Url不能为空', trigger: 'blur'}">
                        <el-input v-model="annex.download_files" placeholder="请填写附件Url" class="form-item"></el-input>
                    </el-form-item>
                </template>
                <!-- Download -->
                <el-form-item label="关联的商品SKU：" prop="related_sku">
                    <el-input v-model="form.related_sku" placeholder="请填写关联的商品SKU" type="textarea" :row="4" class="form-item"></el-input>
                     <span>&nbsp;多个以英文逗号分隔</span>
                </el-form-item>
                <el-form-item label="视频地址(youtube):	" prop="video_url">
                    <el-input v-model="form.video_url" placeholder="请填写视频地址(youtube)" class="form-item"></el-input>
                </el-form-item>
                <el-form-item label="列表显示时间：" prop="pre_post_time">
                    <el-date-picker v-model="form.pre_post_time" type="datetime" placeholder="选择日期时间" class="form-item"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="preview" type="primary">模板预览</el-button>
                </el-form-item>
                <el-form-item label="文章内容：" prop="content">
                    <el-input v-model="form.content" type="textarea" class="form-item-textarea"></el-input>
                </el-form-item>
                <el-form-item label="You might also like：" prop="also_like">
                    <el-input v-model="form.also_like"  class="form-item"></el-input>
                    <span>&nbsp;输入文章ID，最多三个，以英文逗号分隔</span>
                </el-form-item>
                <el-form-item label="Banner标题：" prop="banner_name">
                    <el-input v-model="form.banner_name"  placeholder="请填写Banner标题" class="form-item"></el-input>
                </el-form-item>
                <el-form-item label="Banner图片地址：" prop="banner_image">
                    <el-input v-model="form.banner_image"  placeholder="请填写Banner图片地址" class="form-item"></el-input>
                </el-form-item>
                <el-form-item label="Banner跳转链接：" prop="banner_url">
                    <el-input v-model="form.banner_url"  placeholder="请填写Banner跳转链接" class="form-item"></el-input>
                </el-form-item>
                <el-form-item label="banner是否显示：" prop="banner_is_display">
                    <el-radio-group v-model="form.banner_is_display">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" :loading="dataLoading" @click="save" v-if="ctrl">提交</el-button>
                    <el-button type="default" @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="模板预览" :visible.sync="isPreview" @close="closePreview">
            <div class="preview-container" v-html="this.form.content"></div>
        </el-dialog>
    </div>
</template>

<script>
    let defaultOpt = {
        title: '',
        author_id: '',
        article_type: '',
        virtual_visited_count: '',
        seo_title: '',
        keyword: '',
        description: '',
        cat_id: '',
        download_cat_id: '',
        is_display: 1,
        banner_is_display: 0,
        list_img_url: '',
        related_sku: '',
        video_url: '',
        pre_post_time: '',
        content: '',
        also_like: '',
        banner_name: '',
        banner_image: '',
        banner_url: '',
        // 附件
        annexs: [
            {
                download_title: '',
                download_files: ''
            }
        ]
    }
    export default {
        data() {
            const checkAlsoLike = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('该项不能为空'));
                } else if(value.split(',').length > 3){
                    return callback(new Error('最多三个文章ID'));
                }else {
                    callback();
                }
            }
            return {
                dataLoading: false,
                form: JSON.parse(JSON.stringify(defaultOpt)),
                authors: null,
                typeText: {
                    '1': 'GB Feature',
                    '2': 'New Gear',
                    '3': 'How To',
                    '4': 'Download',
                    '5': 'Buying Guide'
                },
                CatText: {
                    '1': 'Xiaomi Gears',
                    '2': 'Phone & Tablets',
                    '3': 'Computers & Networking',
                    '4': 'Electronics & Tools',
                    '5': 'Home & Garden',
                    '6': 'Sports & Outdoors',
                    '7': 'Entertainment',
                    '8': 'Automotive & Industrial',
                    '9': 'Beauty & Fashion'
                },
                downloadText: {
                    '1': 'Firmwares',
                    '2': 'updates',
                    '3': 'user manuals',
                    '4': 'cetificates',
                    '5': 'video guides'
                },
                rules: {
                    title: [
                        { required: true, message: '请填写文章标题', trigger: 'blur' }
                    ],
                    author_id: [
                        { required: true, message: '请选择作者', trigger: 'change' }
                    ],
                    article_type: [
                        { required: true, message: '请选择模块', trigger: 'change' }
                    ],
                    seo_title: [
                        { required: true, message: '请填写头部SEO标题', trigger: 'blur' }
                    ],
                    keyword: [
                        { required: true, message: '请填写SEO关键词', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请填写摘要', trigger: 'blur' }
                    ],
                    list_img_url: [
                        { required: true, message: '请填写列表页图片地址', trigger: 'blur' }
                    ],
                    related_sku: [
                        { required: true, message: '请填写关联的商品SKU', trigger: 'blur' }
                    ],
                    pre_post_time: [
                        { required: true, type: 'date', message: '请选择列表显示时间', trigger: 'change' }
                    ],
                    also_like: [
                        { validator: checkAlsoLike, trigger: 'blur' }
                    ],
                    cat_id: [
                        { required: true, message: '请选择分类', trigger: 'change' }
                    ],
                    download_cat_id: [
                        { required: true, message: '请选择Download文章类型', trigger: 'change' }
                    ]
                },
                isEdit: false,
                visited_count: 0,
                isPreview: false
            }
        },
        computed: {
            ctrl() {
                if (this.$route.query['id']) {
                    return this.showAction_('blog/article/edit');
                } else {
                    return this.showAction_('blog/article/add');
                }
            },
        },
        created() {
            this.isEdit = this.$route.query.id ? true : false;
            if(this.isEdit) {
                this.getInfo();
            }
            this.initData();
        },
        methods: {
            initData() {
                this.getAuthors();
            },
            // 获取blog详情
            getInfo() {
                this.$http.get('blog/article/info', {params: {
                    id: this.$route.query.id
                }}).then(res => {
                    if (res.body.code == 0) {
                        let data = res.body.data;
                        let download_files = data.download_files.split(',');
                        let download_title = data.download_title.split(',');
                        let annexs = [];
                        if(download_files.length === download_title.length) {
                            for(let i = 0; i < download_files.length; i++) {
                                annexs.push({
                                    download_title: download_title[i],
                                    download_files: download_files[i]
                                });
                            }
                        }
                        this.visited_count = data.visited_count;
                        delete data.download_files;
                        delete data.download_title;
                        data.annexs = annexs;
                        data.author_id = String(data.author_id);
                        data.article_type = String(data.article_type);
                        data.cat_id = String(data.cat_id);
                        data.download_cat_id = String(data.download_cat_id);
                        data.pre_post_time = new Date(this.timeZone_(data.pre_post_time, this.$store.getters.getTimeZone));
                        this.form = Object.assign({}, defaultOpt, data);
                    } else {
                        this.$message.error(res.body.message);
                    }
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                })
            },
            // 获取作者列表
            getAuthors() {
                this.$http.get('blog/author/list', { params: {
                    pagination: 1
                } }).then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    this.authors = res.body.data.data.map((item) => {
                        return {
                            id: String(item.id),
                            author: item.author
                        }
                    });
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 保存
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.dataLoading = true;
                        let params = JSON.parse(JSON.stringify(this.form));
                        params.pre_post_time = this.timeZone_(new Date(params.pre_post_time), this.$store.getters.getTimeZone);
                        if(params.article_type == 4) {
                            let download_titles = [];
                            let download_files = [];
                            params.annexs.forEach((item) => {
                                download_titles.push(item.download_title);
                                download_files.push(item.download_files);
                            });
                            params.download_title = download_titles.join(',');
                            params.download_files = download_files.join(',');
                            delete params.annexs;
                        } else {
                            delete params.annexs;
                            delete params.download_cat_id;
                        }
                        if(params.article_type != 3 && params.article_type != 4) {
                            delete params.cat_id;
                        }
                        if(this.isEdit) {
                            params.id = this.$route.query.id;
                        }
                        this.$http.post('blog/article/' + (this.isEdit ? 'edit' : 'add'), params).then(res => {
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
                this.$router.push({ name: 'blogList' });
            },
            // 添加附件
            addAnnex() {
                if(this.form.annexs.length === 3) { this.$message.warning('最多三个附件！'); return; }
                this.form.annexs.push({
                    download_title: '',
                    download_files: ''
                });
            },
            // 删除
            removeAnnex(index) {
                if(this.form.annexs.length === 1) { this.$message.warning('至少保留一个！'); return; }
                this.form.annexs.splice(index, 1);
            },
            // 预览
            preview() {
                this.isPreview = true;
            },
            closePreview() {
                this.isPreview = false;
            }
        }
    }
</script>
<style lang="less">
.form{
    .form-item{
        width: 400px;
    }
    .form-item-textarea{
        width: 700px;
        textarea{
            height: 500px;
        }
    }
    .preview-container{
        max-width: 920px;
        overflow-x: auto;
    }
}
</style>
