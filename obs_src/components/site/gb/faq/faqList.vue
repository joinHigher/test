<template>
  <div>
    <div class="el-container">
      <el-tabs class="full" active-name="1" @tab-click="changePlatform">
        <el-tab-pane v-for="(item, index) in platformOpt" :label="item" :name="index" :key="index"></el-tab-pane>
      </el-tabs>
      <el-row>
          <el-form :inline="true">
              <el-form-item label="渠道" prop="pipeline">
                  <el-select clearable filterable v-model="tableOpt.pipeline" placeholder="请选择" @change="changePipe">
                      <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                  </el-select>
              </el-form-item>
            <div class="text-right">
                <el-button v-if="self.showAction_('admin/article/add')" type="primary"  @click="handleArticle($event, null, true)">添加文章
              </el-button>
              <el-button v-if="self.showAction_('admin/article-category/add')" type="primary" @click="handleClass($event, null, true)">
                添加分类
              </el-button>
            </div>
          </el-form>
      </el-row>
      <div class="el-sub-container">
        <table class="table-custom" v-loading="tableLoading">
          <thead>
          <tr>
            <th>文章分类</th>
            <th>文章标题</th>
            <th>语言</th>
            <th>渠道</th>
            <th>状态（底部/左侧）</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(arr, index) in tableData">
            <tr v-for="(item, _index) in arr.articles" v-if="arr.articles.length > 0" :key="item.id">
              <td v-if="!(_index)" :rowspan="arr.articles.length">
                <a href="javascript:;" @click="handleClass($event, arr)">{{arr.name}}</a>
              </td>
              <td>{{item.title}}</td>
              <td>{{item.lang}}</td>
              <td>{{item.pipeline}}</td>
              <td>
                <i style="margin-right: 20px;" :class="{'el-icon-circle-check color-success': item.is_show_at_bottom === 1, 'el-icon-circle-cross color-danger': item.is_show_at_bottom === 0}"></i>
                <i :class="{'el-icon-circle-check color-success': item.is_show_at_left === 1, 'el-icon-circle-cross color-danger': item.is_show_at_left === 0}"></i>
              </td>
              <td>
                <el-button v-if="self.showAction_('admin/article/info')" type="primary" size="small" @click="handleArticle($event, item)">编辑</el-button>
                <el-button v-if="self.showAction_('admin/article/delete')" type="danger" size="small" @click="removeRow(item.id, index, _index)">删除</el-button>
              </td>
            </tr>
            <tr v-if="arr.articles.length === 0">
              <td><a href="javascript:;" @click="handleClass($event,arr)">{{arr.name}}</a></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </template>
</tbody>
</table>
</div>
</div>
<!-- 弹窗S -->
<el-dialog :title="articeForm.id ? '编辑文章' : '新增文章'" v-model="articeDialog" top="2%">
    <el-form :model="articeForm" label-width="180px" :rules="formRule" ref="form">
        <el-form-item label="渠道" prop="pipeline">
            <el-select clearable filterable v-model="articeForm.pipeline" placeholder="请选择">
                <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="文章分类" prop="cat_id">
            <el-select v-model="articeForm.cat_id">
                <el-option v-for="(item, index) in categoryOpt" :label="item" :value="index" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="文章标题">
            {{artLangOpt[0].title}}
        </el-form-item>
        <el-form-item label="链接地址/deeplink" prop="url">
            <el-autocomplete popper-class="my-autocomplete" v-model="articeForm.url" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" icon="circle-close" :on-icon-click="handleIconClick"></el-autocomplete>
        </el-form-item>
        <el-form-item label="排序" prop="order">
            <el-input v-model="articeForm.order"></el-input>
        </el-form-item>
        <el-form-item label="是否底部显示" prop="is_show_at_bottom">
            <el-col :span="16">
                <el-radio-group v-model="articeForm.is_show_at_bottom">
                    <el-radio class="radio" :label="1">显示</el-radio>
                    <el-radio class="radio" :label="0">不显示</el-radio>
                </el-radio-group>
            </el-col>
        </el-form-item>
        <el-form-item label="是否左侧显示" prop="is_show_at_left">
            <el-col :span="16">
                <el-radio-group v-model="articeForm.is_show_at_left">
                    <el-radio class="radio" :label="1">显示</el-radio>
                    <el-radio class="radio" :label="0">不显示</el-radio>
                </el-radio-group>
            </el-col>
        </el-form-item>
        <hr class="mb30"/>
        <el-tabs v-model="activeLang">
            <el-tab-pane v-for="(item, index) in artLangOpt" :name="item.lang" :label="langTexts[item.lang]" :key="index">
                <el-form-item label="文章标题名称">
                    <el-input v-model="item.title"></el-input>
                </el-form-item>
                <el-form-item label="关键词">
                    <el-input v-model="item.keywords"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="item.description"></el-input>
                </el-form-item>
                <el-form-item label="文章内容">
                    <el-input type="textarea" :rows="6" v-model="item.content" placeholder="请填写HTML"></el-input>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveArticle" v-loading="addArtLoading" :disabled="addArtLoading">确 认</el-button>
        <el-button @click="articeDialog = false">取 消</el-button>
    </span>
</el-dialog>

<el-dialog :title="classForm.id ? '修改分类' : '新增分类'" v-model="isShowTitleDialog" size="tiny">
    <el-form :model="classForm" :rules="classFormRules" ref="classForm" label-width="110px">
        <el-form-item label="渠道" prop="pipeline">
            <el-select disabled clearable filterable v-model="classForm.pipeline" placeholder="请选择">
                <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="文章分类">
            {{langOpt[0].name}}
        </el-form-item>
        <el-form-item label="排序" prop="order">
            <el-input v-model="classForm.order"></el-input>
        </el-form-item>
        <el-form-item label="是否底部显示" prop="is_show_at_bottom">
            <el-radio class="radio" v-model="classForm.is_show_at_bottom" :label="1">显示</el-radio>
            <el-radio class="radio" v-model="classForm.is_show_at_bottom" :label="0">不显示</el-radio>
        </el-form-item>
        <el-form-item label="是否左侧显示" prop="is_show_at_left">
            <el-radio class="radio" v-model="classForm.is_show_at_left" :label="1">显示</el-radio>
            <el-radio class="radio" v-model="classForm.is_show_at_left" :label="0">不显示</el-radio>
        </el-form-item>
        <hr class="mb30"/>
        <el-tabs v-model="activeLang">
            <el-tab-pane v-for="(item, index) in langOpt" :name="item.lang" :label="langTexts[item.lang]" :key="index">
                <el-form-item label="文章分类名称">
                    <el-input v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="关键词">
                    <el-input v-model="item.keywords"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="item.description"></el-input>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveClassChange" v-loading="saveClassLoading">确 认</el-button>
          <el-button @click="isShowTitleDialog = false">取 消</el-button>
      </span>
</el-dialog>


<el-dialog title="预览" v-model="previewDialog" size="normal">
    <div v-html="articeForm.content" class="prew-mail"></div>
</el-dialog>


<!-- 弹窗E -->
</div>
</template>

<script>
    const classDefaultOptions = {
        name: '',
        order: '',
        id: '',
        is_show_at_bottom: '',
        is_show_at_left: '',
        keywords: '',
        description: '',
        lang: '',
        pipeline: '',
        articleName: '',
    };
    const articleDefaultOptions = {
        lang: '',
        pipeline: '',
        title: '',
        order: '',
        url: '',
        is_enable: '',
        content: '',
        id: '',
        cat_id: '',
        keywords: '',
        description: '',
        is_show_at_left: '',
        is_show_at_bottom: '',
        articleTitleName: '',
    };

    export default {
        data() {
            let checkOrder = (rule, value, callback) => {
                if (Number.isInteger(value * 1) && value * 1 > 0) {
                    callback();
                } else {
                    callback(new Error('该项不能为空,且为大于0的整数'));
                }
            };
            return {
                defaultLang: '',
                activeLang: '',
                langOpt: [{
                    name: '',
                }],
                artLangOpt: [{
                    title: '',
                }],
                self: this,
                addArtLoading: false,
                saveClassLoading: false,
                tableLoading: false,
                tableData: [],
                tableOpt: {
                    pipeline: '',
                    platform: '1'
                },
                articeDialog: false,
                isShowTitleDialog: false,
                previewDialog: false,
                articeForm: JSON.parse(JSON.stringify(articleDefaultOptions)),
                classForm: JSON.parse(JSON.stringify(classDefaultOptions)),
                platformOpt: [],
                categoryOpt: [],
                langs: null,
                langTexts: {},
                formRule: {
                    lang: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }],
                    pipeline: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }],
                    order: [{
                        validator: checkOrder,
                        trigger: 'blur'
                    }, {
                        required: true,
                        message: '该项不能为空'
                    }],
                    cat_id: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }],
                    is_enable: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }],
                    is_show_at_left: [{
                        type: 'number',
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }],
                    is_show_at_bottom: [{
                        type: 'number',
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }],
                },
                classFormRules: {
                    order: [{
                        validator: checkOrder,
                        trigger: 'blur'
                    }, {
                        required: true,
                        message: '该项不能为空'
                    }],
                    pipeline: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }],
                    is_show_at_left: [{
                        type: 'number',
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }],
                    is_show_at_bottom: [{
                        type: 'number',
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }],
                },
                deeplinks: []
            };
        },
        computed: {
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.tableOpt.pipeline = this.$store.getters.getPipe.list[0].pipeline_code;
            this.initData();
            this.deeplinks = this.$store.getters.getDeeplink;
        },
        methods: {
            initData() {
                this.getCategory();
                this.getplatform();
                this.getLangs();
                this.getArticle();
            },
            getCategory() {
                this.$http.get('admin/public/article-category-select-options', {params: this.tableOpt}).then(res => {
                    this.categoryOpt = res.body.data;
                });
            },
            getArticle(tableOpt) {
                this.tableLoading = true;
                this.$http.get('admin/article/list', {
                    params: tableOpt
                }).then(res => {
                    this.tableLoading = false;
                    if (res.body.code === 0) {
                        this.tableData = res.body.data;
                    }
                });
            },
            getplatform() {
                this.$http.get('admin/public/platforms').then(res => {
                    if (res.body.code === 0) {
                        this.platformOpt = res.body.data;
                    }
                });
            },
            // 获取语言列表
            getLangs() {
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    let data = res.body.data;
                    this.langs = data;
                    // this.defaultLang = this.langs[0].language_en;
                    this.defaultLang = 'en';
                    let langTexts = {};
                    data.forEach((item) => {
                        langTexts[item.language_en] = item.language_ch;
                    });
                    this.langTexts = Object.assign({}, this.langTexts, langTexts);
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 新增编辑分类
            async handleClass(event,item, flag) {
                if (flag === true) {
                    // 新增
                    this.classForm = JSON.parse(JSON.stringify(classDefaultOptions));
                    //
                    let temp = [];
                    this.langs.forEach(item => {
                        temp.push({
                            name: '',
                            lang: item.language_en,
                            keywords: '',
                            description: '',
                        });
                    });
                    this.langOpt = temp;
                    this.classForm.pipeline = this.tableOpt.pipeline;
                    this.classForm.platform = this.tableOpt.platform;
                } else {
                    const data = await this.httpGet_('admin/article-category/info', {params: {id: item.id}});
                    for (let i in data) {
                        let item = data[i];
                        if (i === 'langData') {
                            if (item.length > 0) {
                                this.langOpt = item;
                            } else {
                                let temp = [];
                                this.langs.forEach(item => {
                                    temp.push({
                                        cid: data.id,
                                        id: '',
                                        name: '',
                                        lang: item.language_en,
                                        keywords: '',
                                        description: '',
                                    });
                                });
                                this.langOpt = temp;
                            }
                        } else {
                            this.classForm[i] = data[i];
                        }
                    }
                }

                this.isShowTitleDialog = true;
                this.activeLang = this.defaultLang;
            },
            // 新增和修改分类
            async saveClassChange() {
                let hasError = false;
                let enData;
                for (let i in this.langOpt) {
                    let lang = this.langOpt[i];
                    if (lang.lang === 'en') {
                        enData = lang;
                        break;
                    }
                }
                for (let i in enData) {
                    if (!enData[i] && i !== 'id') {
                        this.$message.error('英语信息必填')
                        return false;
                    }
                }
                this.classForm.lang = enData.lang;
                this.classForm.description = enData.description;
                this.classForm.keywords = enData.keywords;
                this.classForm.name = enData.name;

                this.$refs.classForm.validate(valid => {
                    if (!valid) {
                        hasError = true;
                        return false;
                    }
                });
                if (hasError) {
                    return;
                }

                let params =  Object.assign({}, this.classForm);
                params.lang_data = this.langOpt;
                if(params.id) {
                    delete params.articles;
                    delete params.create_time;
                    delete params.update_time;
                }
                this.saveClassLoading = true;
                try {
                    const data = await this.httpPost_('admin/article-category/' + (params.id ? 'edit' : 'add'), params);
                    this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    this.getArticle(this.tableOpt);
                    this.isShowTitleDialog = false;
                    this.getCategory();
                } finally {
                    this.saveClassLoading = false;
                }
            },
            //新增修改文章this.articeForm
            async handleArticle(event, item, flag) {
                if (flag === true) {
                    // 新增
                    this.articeForm = JSON.parse(JSON.stringify(articleDefaultOptions));
                    //
                    let temp = [];
                    this.langs.forEach(item => {
                        temp.push({
                            title: '',
                            content: '',
                            lang: item.language_en,
                            keywords: '',
                            description: '',
                        });
                    });
                    this.artLangOpt = temp;
                    this.articeForm.pipeline = this.tableOpt.pipeline;
                    this.articeForm.platform = this.tableOpt.platform;
                } else {
                    const data = await this.httpGet_('admin/article/info', {params: {id: item.id}});
                    for (let i in data) {
                        let item = data[i];
                        if (i === 'langData') {
                            if (item.length > 0) {
                                this.artLangOpt = item;
                            } else {
                                let temp = [];
                                this.langs.forEach(item => {
                                    temp.push({
                                        aid: data.id,
                                        id: '',
                                        title: '',
                                        content: '',
                                        lang: item.language_en,
                                        keywords: '',
                                        description: '',
                                    });
                                });
                                this.artLangOpt = temp;
                            }
                        } else if (i === 'cat_id') {
                            this.articeForm[i] = String(data[i]);
                        } else {
                            this.articeForm[i] = data[i];
                        }
                    }
                }
                this.activeLang = this.defaultLang;
                this.articeDialog = true;
            },
            // 新增/编辑文章
            saveArticle() {
                let enData;
                for (let i in this.artLangOpt) {
                    let lang = this.artLangOpt[i];
                    if (lang.lang === 'en') {
                        enData = {
                            aid: lang.aid,
                            content: lang.content,
                            description: lang.description,
                            id: lang.id,
                            keywords: lang.keywords,
                            lang: lang.lang,
                            title: lang.title,
                        };
                        break;
                    }
                }
                for (let i in enData) {
                    if (!enData[i] && i !== 'id' && i !== 'aid') {
                        this.$message.error('英语信息必填')
                        return false;
                    }
                }
                this.articeForm.lang = enData.lang;
                this.articeForm.description = enData.description;
                this.articeForm.keywords = enData.keywords;
                this.articeForm.content = enData.content;
                this.articeForm.title = enData.title;

                let params =  Object.assign({}, this.articeForm);
                delete params.create_time;
                delete params.update_time;
                delete params.create_user;
                delete params.update_user;
                delete params.title2url;
                params.lang_data = this.artLangOpt;

                this.$refs.form.validate(async valid => {
                    if (valid) {
                        this.addArtLoading = true;
                        try {
                            const data = await this.httpPost_('admin/article/' + (params.id ? 'edit' : 'add'), params);
                            this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                            this.getArticle(this.tableOpt);
                            this.articeDialog = false;
                        } finally {
                            this.addArtLoading = false;
                        }
                    }
                });
            },

            // 删除文章
            removeRow(id, index, _index) {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('admin/article/delete', {
                        id: id
                    }).then(res => {

                        if (res.body.code == 0) {
                            this.tableData[index].articles.splice(_index, 1);
                            this.$message({
                                message: res.body.message,
                                type: 'success'
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 切换平台
            changePlatform(val) {
                this.tableOpt.platform = (val.index * 1 + 1) + '';
                this.getArticle(this.tableOpt);
                this.getCategory();
            },
            // 切换渠道
            changePipe(val) {
                this.getArticle(this.tableOpt);
                this.getCategory();
            },
            querySearch(queryString, cb) {
                let items = this.deeplinks;
                let results = null;
                results = queryString ? items.filter(this.createFilter(queryString)) : items;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (item) => {
                    return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            handleSelect(item) {
                this.articeForm.url = item.url;
            },
            handleIconClick() {
                this.articeForm.url = '';
            },
        },
    }
</script>
<style lang="less">
    .mb30{margin-bottom: 30px;}
</style>
