<template>
    <div @click="closeTree($event)">
        <div class="el-container">
            <el-form :model="form" ref="form" :rules="rules"  label-width="270px"  class="form">

                <el-form-item label="平台：" prop="platform">
                    <el-radio-group v-model="form.platform">
                        <el-radio  v-for="(item, key) in platformTexts" :label="key" :key="key">{{item}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="模板类型：" prop="type" v-show="form.platform == 1" :rules="form.platform == 1 ? [{required: true, message: '请选择类型', trigger: 'change'}] : []">
                    <el-radio-group v-model="form.type">
                        <el-radio  v-for="(item, key) in categorys" :label="key" :key="key">{{item}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="特殊商品设置：" v-show="(form.platform == 1 && (form.type == 1 || form.type == 3)) || (form.platform == 3 || form.platform == 4)">
                    <el-row class="special-setting"  v-for="(item, key) in form.sku_info" :key="key">
                        <el-col :span="3" class="text-center">{{ key === 'now' ? '现在生效的商品SKU：' : '即将生效的商品SKU：'}}</el-col>
                        <el-col :span="4">
                            <el-form-item :prop="'sku_info.' + key + '.sku'" label-width="0px" class="form-special-item" :rules="(form.type == 3 &&　form.platform == 1) ? [{required: true, message: '该项必填', trigger: 'change'}] : []">
                                <el-input v-model="item.sku" placeholder="最多添加2个，用英文逗号隔开"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" class="text-center">生效时间：</el-col>
                        <el-col :span="7">
                            <el-form-item :prop="'sku_info.' + key + '.effective_time'" label-width="0px" class="form-special-item" :rules="(form.type == 3 &&　form.platform == 1) ? [{ required: true, validator: validateDate, trigger: 'blur' }] : []">
                                <el-date-picker v-model="item.effective_time" type="datetimerange" placeholder="选择日期范围" ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">&nbsp;</el-col>
                        <el-col :span="2">
                            <el-form-item :prop="'sku_info.' + key + '.is_count_down'" label-width="0px" class="form-special-item">
                                <el-checkbox v-model="item.is_count_down">显示倒计时</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item :prop="'sku_info.' + key + '.is_stock'" label-width="0px" class="form-special-item">
                                <el-checkbox v-model="item.is_stock">显示剩余数</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="品类馆标题：" prop="name">
                    <el-input v-model="form.name" placeholder="请输入标题" class="form-item"></el-input>
                </el-form-item>

                <el-form-item label="URL：" prop="url" v-show="form.platform == 2">
                    <el-input v-model="form.url" placeholder="请输入url" class="form-item"></el-input>
                </el-form-item>

                <el-form-item label="锚点图标：" prop="anchor_class_name" v-show="form.platform == 1" :rules="form.platform == 1 ? [{required: true, message: '请选择锚点图标', trigger: 'change,'}] : []">
                    <el-select v-model="form.anchor_class_name" placeholder="请选择" class="form-item">
                        <el-option v-for="(icon, index) in icons" :value="icon" :key="index" :label="icon">
                            <span style="float: left color: #8492a6; font-size: 13px;">{{icon}}</span>
                            <span style="float: right;font-size: 16px;"><i :class="icon" class="iconfont"></i></span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="语言：" prop="lang">
                    <el-select clearable filterable v-model="form.lang" placeholder="请选择" class="form-item">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="渠道：" prop="pipeline_code">
                    <el-select clearable filterable v-model="form.pipeline_code" class="form-item" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择分类：" prop="cat_names" v-show="form.platform == 1" :rules="form.platform == 1 ? [{required: true, message: '分类不为空', trigger: 'blur,change'}] : []">
                    <el-row>
                        <el-col :span="8" class="tree-item">
                            <el-input v-model.trim="form.cat_names" @click.native="changeTreeFlag" class="form-item tree-input" placeholder="请选择分类" :readonly="true"></el-input>
                            <el-tree v-show="treeFlag" :data="treeData" show-checkbox :props="treeProps" ref="tree" node-key="id" class="form-item"></el-tree>
                        </el-col>
                        <el-col :span="8" v-show="treeFlag">
                            <el-button type="primary"  @click="changeTree">确认选择</el-button>
                            <el-button type="danger"   @click="treeFlag = false">取消</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item label="对应分类ID：" v-show="form.platform == 1" :rules="form.platform == 1 ? [{required: true, message: '分类ID不为空', trigger: 'blur,change'}] : []">
                    <el-input v-model="form.cat_ids"  class="form-item" readonly></el-input>
                </el-form-item>


                <el-form-item label="是否显示：" prop="is_show">
                    <el-radio-group v-model="form.is_show">
                        <el-radio label="1">显示</el-radio>
                        <el-radio label="0">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="排序：" prop="order">
                    <el-input v-model="form.order" placeholder="请输入排序" class="form-item"></el-input>
                </el-form-item>


                <el-form-item v-for="(trend, index) in form.trends" :label="'推荐词' + (index + 1) + '：'" :key="index" v-show="form.platform == 1 || form.platform == 2">
                    <el-row class="trends-item">
                        <el-col :span="4">
                            <el-form-item :prop="'trends.' + index + '.name'" label-width="0px">
                                <el-input v-model="trend.name" placeholder="推荐词名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item :prop="'trends.' + index + '.url'" label-width="0px">
                                <el-input v-model="trend.url" placeholder="推荐词url"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1" v-show="form.platform == 1">字体颜色</el-col>
                        <el-col :span="2" v-show="form.platform == 1">
                            <el-form-item :prop="'trends.' + index + '.color'" label-width="0px">
                                <el-color-picker v-model="trend.color"></el-color-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" v-show="form.platform == 1">
                            <el-form-item :prop="'trends.' + index + '.mark_type'" label-width="0px">
                                <el-radio-group v-model="trend.mark_type">
                                    <el-radio label="1">无标识</el-radio>
                                    <el-radio label="2">New标识</el-radio>
                                    <el-radio label="3">Hot标识</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-button @click="addTrend" type="primary">+</el-button>
                            <el-button @click="removeTrend(index)" type="danger">-</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>


                <el-form-item label="">
                    <el-button type="primary" :loading="dataLoading" @click="save" v-if="ctrl">确认</el-button>
                    <el-button type="default" @click="goBack">返回</el-button>
                </el-form-item>

            </el-form>

        </div>
    </div>
</template>

<script>
    let defaultOpt =  {
        platform: '1',
        type: '1',
        name: '',
        anchor_class_name: '',
        lang: '',
        pipeline_code: '',
        cat_names: '',
        cat_ids: '',
        is_show: '',
        order: '',
        url: '',

        trends: [{
            name: '',
            url: '',
            color: '#000',
            mark_type: ''
        }],

        sku_info: {
            now: {
                sku: '',
                start_time: '',
                end_time: '',
                is_count_down: false,
                is_stock: false,
                effective_time: []
            },
            coming: {
                sku: '',
                start_time: '',
                end_time: '',
                is_count_down: false,
                is_stock: false,
                effective_time: []
            }
        }
    }
    export default {
        data() {
            return {
                dataLoading: false,
                form: JSON.parse(JSON.stringify(defaultOpt)),
                categorys:  null,
                langs: null,
                treeData: [],
                treeProps: {
                    children: 'subCategoryList',
                    label: 'categoryName'
                },
                treeFlag: false,
                treeCheckedTree: [],
                platformTexts: {
                    '1': 'WEB',
                    '2': 'WAP',
                    '3': 'IOS',
                    '4': 'Android'
                },
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
                rules: {
                    platform: [
                        { required: true, message: '请选择平台', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请填写标题', trigger: 'blur' }
                    ],
                    lang: [
                        { required: true, message: '请选择语言', trigger: 'change' }
                    ],
                    pipeline_code: [
                        { required: true, message: '请选择渠道', trigger: 'change' }
                    ]
                },
                isEdit: false,
                categoryList: []
            }
        },

        /*watch: {
            'form.type': function(val, oldVal) {
                if(oldVal == 3 && val != 3) {
                    this.$nextTick(() => {
                        // resetField方法
                        // [https://github.com/ElemeFE/element/blob/dev/packages/form/src/form-item.vue]
                        this.$refs.form && this.$refs.form.fields.forEach((item) => {
                            if(item.$el.classList.contains('form-special-item')) {
                                item.resetField();
                            }
                        });
                    });
                }
            },
            'form.platform': function(val, oldVal) {
                if(val == 3 || val == 4) {
                    this.$nextTick(() => {
                        // resetField方法
                        // [https://github.com/ElemeFE/element/blob/dev/packages/form/src/form-item.vue]
                        this.$refs.form && this.$refs.form.fields.forEach((item) => {
                            if(item.$el.classList.contains('form-special-item')) {
                                item.resetField();
                            }
                        });
                    });
                }
            }
        },*/

        computed: {
            ctrl() {
                if (this.$route.query['special_id']) {
                    return this.showAction_('admin/category-library/edit');
                } else {
                    return this.showAction_('admin/category-library/add');
                }
            },
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.getAllCategory().then(() => {
                this.isEdit = this.$route.query.id ? true : false;
                if(this.isEdit) {
                    this.getInfo();
                }
                this.initData();
            });
        },
        methods: {
            initData() {
                this.getLangs();
                this.getCategorys();
                //this.getAllCategory();
            },
            // 自定义验证规则
            validateDate(rule, value, callback) {
                if (value.length === 0) {
                    callback(new Error('该项必填'));
                } else {
                    callback();
                }
            },
            // 获取分类馆类型列表
            getCategorys() {
                return this.$http.get('admin/public/category-library-options').then(res => {
                    if (res.body.code !== 0) {
                        return Promise.reject();
                    }
                    // console.log(res.body.data);
                    this.categorys = res.body.data;
                    return Promise.resolve();
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                    return Promise.reject();
                });
            },
            // 获取所有绑定分类数据（树形）
            getAllCategory() {
                return this.$http.get('promotion/index/public-category-list', {params: {lang: 'en'}}).then(res => {
                    if (res.body.code === 0) {
                        this.categoryList = [];
                        this.treeData = res.body.data;
                        this.getAllCategoryList(this.treeData);
                        return Promise.resolve();
                    } else {
                        this.$message.error(res.body.message);
                        return Promise.reject();
                    }
                }, (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                    return Promise.reject();
                });
            },

            getAllCategoryList (arr) {
                arr.forEach(item => {
                    this.categoryList.push({ id: item.categoryId, name: item.categoryName });
                    if (Array.isArray(item.subCategoryList) && item.subCategoryList.length > 0) {
                        this.getAllCategoryList(item.subCategoryList);
                    }
                });
            },

            // 获取语言列表
            getLangs() {
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    // console.log(res.body.data);
                    this.langs = res.body.data;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 获取分类馆详情
            getInfo() {
                this.$http.get('admin/category-library/info', {params: {
                    id: this.$route.query.id
                }}).then(res => {
                    if (res.body.code == 0) {
                        let data = this.handleEditInitParams(res.body.data);
                        // console.log(data);
                        this.form = Object.assign({}, defaultOpt, data);
                    } else {
                        this.$message.error(res.body.message);
                    }
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                })
            },
            // 保存
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.dataLoading = true;
                        let params = this.handleParams(JSON.parse(JSON.stringify(this.form)));
                        if(this.isEdit) {
                            params.id = this.$route.query.id;
                        }
                        this.$http.post('admin/category-library/' + (this.isEdit ? 'edit' : 'add'), params).then(res => {
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

            //编辑附值
            handleEditInitParams(params){
                if(params.sku_info) {
                    let sku_info = JSON.parse(params.sku_info);
                    for(let i in sku_info) {
                        let item = sku_info[i];
                        let start_time =  this.timeZone_(item.start_time, this.$store.getters.getTimeZone);
                        let end_time =  this.timeZone_(item.end_time, this.$store.getters.getTimeZone);
                        item.effective_time = [start_time, end_time];
                    }
                    params.sku_info = sku_info;
                }
                if(params.trends) {
                    params.trends = JSON.parse(params.trends);
                }
                params.type = String(params.type);
                params.platform = String(params.platform);
                params.is_show= String(params.is_show);
                this.$refs.tree.setCheckedKeys(params.cat_ids ? params.cat_ids.split(',') : []);

                let cat_ids_arr = params.cat_ids.split(',');
                let tempName = [];
                cat_ids_arr.forEach(item1 => {
                    this.categoryList.forEach(item2 => {
                        if (item1 == item2.id) {
                            tempName.push(item2.name);
                        }
                    });
                });
                params.cat_names = tempName.join(',');

                delete params.update_time;
                delete params.create_time;
                return params;
            },
            // 处理传参
            handleParams(params) {
                const getSkuEffectiveTime = () => {
                    let skus = params.sku_info;
                    for(let i in skus) {
                        if(skus[i].effective_time && skus[i].effective_time.length == 2) {
                            skus[i].start_time = this.timeZone_(new Date(skus[i].effective_time[0]), this.$store.getters.getTimeZone);
                            skus[i].end_time = this.timeZone_(new Date(skus[i].effective_time[1]), this.$store.getters.getTimeZone);
                        } else {
                            skus[i].start_time = '';
                            skus[i].end_time = '';
                        }
                        delete skus[i].effective_time;
                    }
                }
                switch(params.platform) {
                    case '1':
                        delete params.url;
                        delete params.cat_names;
                        if(params.type == 2) {
                            delete params.sku_info;
                        } else {
                            getSkuEffectiveTime();
                            params.sku_info = JSON.stringify(params.sku_info);
                        }
                        params.trends = JSON.stringify(params.trends);
                        return params;
                    break;
                    case '2':
                        delete params.anchor_class_name;
                        delete params.sku_info;
                        delete params.type;
                        delete params.cat_ids;
                        delete params.cat_names;
                        params.trends = JSON.stringify(params.trends);
                        return params;
                    break;

                    case '3':
                    case '4':
                        delete params.url;
                        delete params.anchor_class_name;
                        delete params.type;
                        delete params.trends;
                        delete params.cat_ids;
                        delete params.cat_names;
                        getSkuEffectiveTime();
                        params.sku_info = JSON.stringify(params.sku_info);
                    break;
                }
                return params;
            },
            // 返回
            goBack() {
                this.$router.push({ name: 'site_categoryLibraryList' });
            },
            // toggle 树形菜单
            changeTreeFlag() {
                this.treeFlag = !this.treeFlag;
            },
            // upadte分类树形菜单项
            changeTree () {
                let data = this.$refs.tree.getCheckedNodes();
                // console.log(data);
                let temp = [];
                let tempName = [];
                data.map(item => {
                    if (item.subCategoryList && item.subCategoryList.length > 0) {
                    } else {
                        temp.push(item.id);
                        tempName.push(item.categoryName);
                    }
                });
                this.form.cat_ids = temp.join(',');
                this.form.cat_names = tempName.join(',');
            },
            // 关闭树形菜单
            closeTree (event) {
                // console.log(event.target.parentElement);
                let target = event.target.parentElement._prevClass;
                if (target && target.indexOf('tree-input') !== -1) {
                    return;
                }
                this.treeFlag = false;
            },
            // 添加推荐词
            addTrend() {
                if(this.form.trends.length === 5) { this.$message.warning('最多添加5组推荐词！'); return; }
                this.form.trends.push({
                    name: '',
                    url: '',
                    color: '#000',
                    mark_type: ''
                });
            },
            // 移除推荐词
            removeTrend(index) {
                if(this.form.trends.length === 1) { this.$message.warning('至少保留一项推荐词！'); return; }
                this.form.trends.splice(index, 1);
            }
        }
    }
</script>
<style lang="less">
    @import "http://at.alicdn.com/t/font_471234_y19224agte0442t9.css";
    .form{
        .special-setting{
            &:last-child{
                margin-top: 27px;
            }
        }
        .form-item{
            width: 400px;
        }
        .tree-item {
            position: relative;
            .el-tree {
                height: 400px;
                overflow-y: auto;
                position: absolute;
                top: 36px;
                z-index: 10;
            }
        }
        .trends-item {
            .el-col{
                margin-right: 15px;
            }
        }
    }
</style>
