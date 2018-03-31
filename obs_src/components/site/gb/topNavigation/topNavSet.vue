<template>
    <div>
        <div class="el-container">
            <el-form ref="topicForm" class="topic-form" :rules="rules" :model="topicForm" label-width="270px">
            <!--<el-form-item label="平台：" prop="platforms">
                <el-checkbox-group v-model="topicForm.platforms" @change="changePlatforms">
                    <el-checkbox label="1" name="platforms" :disabled="topicForm.platforms.indexOf('3') > -1 || topicForm.platforms.indexOf('4') > -1">PC</el-checkbox>
                    <el-checkbox label="2" name="platforms" :disabled="topicForm.platforms.indexOf('3') > -1 || topicForm.platforms.indexOf('4') > -1">WAP</el-checkbox>
                    <el-checkbox label="3" name="platforms" :disabled="topicForm.platforms.indexOf('1') > -1 || topicForm.platforms.indexOf('2') > -1">iOS</el-checkbox>
                    <el-checkbox label="4" name="platforms" :disabled="topicForm.platforms.indexOf('1') > -1 || topicForm.platforms.indexOf('2') > -1">Android </el-checkbox>
                </el-checkbox-group>
            </el-form-item>-->

            <el-form-item label="平台：" prop="platforms">
                <el-checkbox-group v-model="topicForm.platforms" @change="changePlatforms">
                    <el-checkbox label="1">PC</el-checkbox>
                    <el-checkbox label="2">WAP</el-checkbox>
                    <el-checkbox label="3">iOS</el-checkbox>
                    <el-checkbox label="4">Android </el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="选择类型：" prop="type">
                <el-select v-model="topicForm.type" placeholder="请选择类型" class="topic-form-item" @change="getMenu">
                    <el-option v-for="(value, key) in typeText" :label="value" :value="key" :key="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="导航位置类型：" prop="position_type">
                <el-radio-group v-model="topicForm.position_type" @change="getMenu">
                    <el-radio :label="1">纵向 </el-radio>
                    <el-radio :label="2">横向</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="导航名称：" prop="name">
                <el-input v-model="topicForm.name" class="topic-form-item"></el-input>
            </el-form-item>
            <!-- <el-form-item label="关联分类ID：" prop="cat_ids">
                <el-select v-model="topicForm.cat_ids" filterable multiple placeholder="所有分类" class="faq-form-item">
                    <el-option v-for="(value, key) in categorys" :label="value.name" :value="key" :key="key"></el-option>
                </el-select>
            </el-form-item> -->

            <!--<el-form-item label="url：" prop="url" v-if="topicForm.platforms.indexOf('1') > -1 || topicForm.platforms.indexOf('2') > -1 || topicForm.platforms.length === 0">
                <el-input v-model="topicForm.url" class="topic-form-item" type="url"></el-input>
            </el-form-item>-->
            <el-form-item label="url：">
                <el-autocomplete class="topic-form-item" v-model="topicForm.url" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelectUrl" icon="circle-close" :on-icon-click="handleIconClickUrl"></el-autocomplete>
            </el-form-item>

            <el-form-item label="语言：" prop="lang">
                <el-select v-model="topicForm.lang" placeholder="请选择" class="topic-form-item" @change="getMenu">
                    <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道：" prop="pipeline_code">
                <el-select clearable filterable v-model="topicForm.pipeline_code" placeholder="请选择" class="topic-form-item"  @change="getMenu">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否显示：" prop="is_show">
                <el-radio-group v-model="topicForm.is_show">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="0">不显示</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="标识：" prop="mark_type" v-if="topicForm.platforms.indexOf('1') > -1 && topicForm.position_type == '2'">
                <el-radio-group v-model="topicForm.mark_type">
                    <el-radio :label="1">无标识</el-radio>
                    <el-radio :label="2">Hot</el-radio>
                    <el-radio :label="3">New</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="所属菜单：" prop="parent_id">
                <el-select v-model="topicForm.parent_id" placeholder="请选择所属菜单" class="topic-form-item">
                    <el-option v-for="(item, index) in menuTree" :value="item.id" :label="item.name" :key="index">
                        <span :style="{float: 'left', marginLeft: (item.level * 5) + 'px'}">
                            <template v-if="item.level !== 0">|-</template>
                            {{item.name}}
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="字体Logo：" prop="font_icon">
                <el-select v-model="topicForm.font_icon" placeholder="请选择" class="topic-form-item">
                    <el-option v-for="(icon, index) in icons" :value="icon" :key="index">
                        <span style="float: left; color: #8492a6; font-size: 13px;">{{icon}}</span>
                        <span style="float: right;font-size: 16px;"><i :class="icon" class="iconfont"></i></span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="排序：" prop="order">
                <el-input v-model="topicForm.order" class="topic-form-item"></el-input>
            </el-form-item>
            <el-form-item label="图片地址：" prop="pc_banner_url">
                <el-input v-model="topicForm.pc_banner_url" class="topic-form-item" type="url"></el-input>
            </el-form-item>
            <el-form-item label="跳转URL：" prop="pc_banner_link">
                <el-input v-model="topicForm.pc_banner_link" class="topic-form-item" type="url"></el-input>
            </el-form-item>

            <template>
                <h3>APP选项：</h3>
                <el-form-item label="APP排序：" prop="app_order">
                    <el-input v-model="topicForm.app_order" class="topic-form-item"></el-input>
                </el-form-item>
                <el-form-item label="分类模板：" prop="app_layout_type">
                    <el-radio-group v-model="topicForm.app_layout_type">
                        <el-radio :label="1">默认分类模板 </el-radio>
                        <el-radio :label="2">推荐模板</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="APP Banner：" prop="app_banner_url">
                    <el-input v-model="topicForm.app_banner_url" class="topic-form-item" type="url"></el-input>
                    <p class="color-danger">一级分类banner推荐尺寸：530x215,三级小图：150x150</p>
                </el-form-item>
                <el-form-item label="APP deeplink链接：" prop="app_banner_link" type="url">
                    <!--<el-input v-model="topicForm.app_banner_link" class="topic-form-item"></el-input>-->
                    <el-autocomplete class="topic-form-item" v-model="topicForm.app_banner_link" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" icon="circle-close" :on-icon-click="handleIconClick"></el-autocomplete>
                </el-form-item>
            </template>

            <el-form-item>
                <el-button type="primary" @click="saveTopic" :loading="dataLoading" v-if="ctrl">确定</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            let checkInteger = (rule, value, callback) => {
                let reg = /^[0-9]*[1-9][0-9]*$/;
                if (reg.test(value)) {
                    return callback();
                } else {
                    return callback(new Error('该项必须为正整数'));
                }
            };
            return {
                isEdit: false,
                dataLoading: false,
                topicForm: {
                    platforms: ['1'],
                    type: '1',
                    name: '',
                    position_type: 1,
                    url: '',
                    lang: 'en',
                    pipeline_code: '',
                    is_show: 1,
                    mark_type: 1,
                    parent_id: 0,
                    font_icon: '',
                    order: '',
                    pc_banner_url: '',
                    pc_banner_link: '',
                    app_order: '',
                    app_layout_type: 1,
                    app_banner_url: '',
                    app_banner_link: ''
                },
                typeText: {
                    '1': '默认导航',
                    '2': '其它导航'
                },
                categorys: null,
                langs: null,
                rules: {
                    lang: [
                        { required: true, message: '请选择语言', trigger: 'blur,change' }
                    ],
                    pipeline_code: [
                        { required: true, message: '请选择渠道', trigger: 'change' }
                    ],
                    url: [
                        { required: true, message: '请填写url', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请填写名称', trigger: 'blur' }
                    ],
                    /*order: [
                        { validator: checkInteger, trigger: 'change' }
                    ],
                    app_order: [
                        { validator: checkInteger, trigger: 'change' }
                    ],*/
                },
                menuTree: [],
                icons: ['icon-appliances', 'icon-account', 'icon-airpods', 'icon-add', 'icon-tshirt', 'icon-arrow-left', 'icon-baby',
                    'icon-beauty', 'icon-bags', 'icon-blog', 'icon-car', 'icon-clock', 'icon-cart', 'icon-topbrand', 'icon-tablet',
                    'icon-computers', 'icon-collection', 'icon-delete', 'icon-edit', 'icon-contact', 'icon-electronics', 'icon-email',
                    'icon-email1', 'icon-equal', 'icon-faq', 'icon-fb', 'icon-gaming', 'icon-information', 'icon-ipad', 'icon-home', 'icon-instagram',
                    'icon-gplus', 'icon-like', 'icon-led', 'icon-like1', 'icon-msg', 'icon-msg1', 'icon-office', 'icon-ok', 'icon-iphone', 'icon-pinterest',
                    'icon-party', 'icon-pwd', 'icon-pwd1', 'icon-price', 'icon-qrcode', 'icon-search', 'icon-reddit', 'icon-star', 'icon-sports', 'icon-tax',
                    'icon-star1', 'icon-tools', 'icon-toys', 'icon-video', 'icon-twitter', 'icon-warning', 'icon-vk', 'icon-warehouse', 'icon-watch', 'icon-whatsapp',
                    'icon-youtube', 'icon-arrow-up', 'icon-arrows-small-left', 'icon-arrow-right', 'icon-arrows-small-right', 'icon-arrows-small-up',
                    'icon-arrows-small-down', 'icon-arrow-down1', 'icon-lever', 'icon-tag', 'icon-shield', 'icon-shake-hands', 'icon-airplane', 'icon-reduce',
                    'icon-catelog'
                ],
                deeplinks: []
            }
        },
        computed: {
            ctrl() {
                if (this.$route.query['id']) {
                    return this.showAction_('admin/top-navigation/edit');
                } else {
                    return this.showAction_('admin/top-navigation/add');
                }
            },

            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.isEdit = this.$route.query.id ? true : false;
            if(this.isEdit) {
                this.getTopicInfo();
            }
            this.initData();
            this.deeplinks = this.$store.getters.getDeeplink;
        },
        methods: {
            initData() {
                this.getLangs();
                this.getAllCategory();
                this.getMenu();
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
            // 平台 checkbox change
            changePlatforms(arr) {
                if(arr.indexOf('1') === -1) {
                    this.topicForm.mark_type = 1;
                }
                this.getMenu();
            },
            getTopicInfo() {
                this.$http.get('admin/top-navigation/info', {params: {
                    id: this.$route.query.id
                }}).then(res => {
                    if (res.body.code == 0) {
                        let data = res.body.data;
                        data.platforms = data.platforms.split(',');
                        data.type = String(data.type);
                        // data.parent_id = String(data.parent_id);
                        delete data.checked_icon;
                        delete data.create_time;
                        delete data.not_checked_icon;
                        delete data.update_time;
                        //console.log(data);
                        this.topicForm = data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                })
            },
            // 保存
            saveTopic() {
                this.$refs.topicForm.validate((valid) => {
                    if (valid) {
                        this.dataLoading = true;
                        let params = JSON.parse(JSON.stringify(this.topicForm));
                            params.platforms = params.platforms.length > 0 ? params.platforms.join(',') : '';
                        if(this.isEdit) {
                            params.id = this.$route.query.id;
                        }
                        this.$http.post('admin/top-navigation/' + (this.isEdit ? 'edit' : 'add'), params).then(res => {
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
            // 重置
            resetForm() {
                this.$refs.topicForm.resetFields();
            },
            // 返回
            goBack() {
                this.$router.push({ name: 'top_navigationList' });
            },
            // 获取所属菜单
            getMenu() {
                let params = {
                    lang: this.topicForm.lang,
                    pipeline_code: this.topicForm.pipeline_code,
                    type: this.topicForm.type,
                    position_type: this.topicForm.position_type,
                    platforms: this.topicForm.platforms.toString(),
                };

                this.$http.get('admin/top-navigation/list', {params: params}).then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    this.menuTree = [];
                    res.body.data.forEach((item) => {
                        this.generateTree(item, 0);
                    });
                    this.menuTree.unshift({
                        id: 0,
                        name: '顶级菜单',
                        level: 0
                    });
                    // console.log(this.menuTree);
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 所属菜单生成树
            generateTree(item, level) {
                item = {
                    id: item.id,
                    children: item.children,
                    name: item.name
                };
                if(item.id !== this.$route.query.id) {
                    if(item.children && item.children.length > 0) {
                        item.level = level;
                        this.menuTree.push(item);
                        item.children.forEach((childItem) => {
                            this.generateTree(childItem, level + 1);
                        });
                    } else {
                        item.level = level;
                        this.menuTree.push(item);
                        return;
                    }
                }
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
            handleSelectUrl(item) {
                this.topicForm.url = item.url;
            },
            handleIconClickUrl() {
                this.topicForm.url = '';
            },
            handleSelect(item) {
                this.topicForm.app_banner_link = item.url;
            },
            handleIconClick() {
                this.topicForm.app_banner_link = '';
            },
        }
    }
</script>
<style lang="less">
    @import "http://at.alicdn.com/t/font_471234_y19224agte0442t9.css";
    .topic-form {
        width: 70%;
        margin: 20px auto 0 auto;
        h3 {
            text-align: right;
            width: 270px;
            margin: 30px 0;
        }
        .topic-form-item{
            width: 400px;
        }
    }
</style>
