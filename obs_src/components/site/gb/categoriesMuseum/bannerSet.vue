<template>
    <div>
        <div class="el-container">
            <el-form :model="form" ref="form" :rules="rules"  label-width="270px"  class="form">

                <el-form-item label="平台：" prop="platform">
                    <el-radio-group v-model="form.platform">
                        <el-radio  v-for="(item, key) in platformTexts" :label="key" :key="key">{{item}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="标题：" prop="title">
                    <el-input v-model="form.title" placeholder="请填写标题" class="form-item"></el-input>
                </el-form-item>

                <el-form-item label="图片地址：" prop="banner_url">
                    <el-input v-model="form.banner_url" placeholder="请填写图片地址" class="form-item"></el-input>
                </el-form-item>

                <el-form-item label="跳转Url：" prop="banner_link">
                    <el-input v-model="form.banner_link" placeholder="请填写图片跳转链接" class="form-item"></el-input>
                </el-form-item>

                <el-form-item label="是否显示：" prop="is_show">
                    <el-radio-group v-model="form.is_show">
                        <el-radio label="1">显示</el-radio>
                        <el-radio label="0">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="banner生效时间：" prop="time_range" v-show="form.platform == 1">
                    <el-date-picker v-model="form.time_range" type="daterange" placeholder="选择banner生效时间范围"></el-date-picker>
                </el-form-item>

                <el-form-item label="语言：" prop="lang">
                    <el-select v-model="form.lang" placeholder="请选择" class="form-item">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="关联品类馆：" prop="category_library_id">
                    <el-select v-model="form.category_library_id" filterable placeholder="请选择" class="form-item">
                        <el-option v-for="item in categoryLibrarys" :label="item.name" :value="String(item.id)" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示位置：" prop="type" v-show="form.platform == 1">
                    <el-select v-model="form.type"  placeholder="请选择" class="form-item">
                        <el-option label="品类馆大banner" value="1"></el-option>
                        <el-option label="品类馆广告位" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否开启蒙版：" prop="is_show_mask" v-show="form.platform == 1 && form.type == 1">
                    <el-radio-group v-model="form.is_show_mask">
                        <el-radio label="1">开启</el-radio>
                        <el-radio label="0">不开启</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="(form.type == 1 && form.platform == 1) ? '蒙版文字编辑（上）：' : '广告位文字（上）：'">
                    <el-col :span="8">
                        <el-form-item prop="mask_name" label-width="0px">
                            <el-input v-model="form.mask_name"  class="form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show="form.platform == 1">
                        <el-form-item prop="mask_name_color" label="字体颜色" label-width="70px">
                            <el-color-picker v-model="form.mask_name_color"></el-color-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item :label="(form.type == 1 && form.platform == 1) ? '蒙版文字编辑（下）：' : '广告位文字（下）：'">
                    <el-col :span="8">
                        <el-form-item prop="mask_description" label-width="0px">
                            <el-input v-model="form.mask_description"  class="form-item"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show="form.platform == 1">
                        <el-form-item prop="mask_description_color" label="字体颜色" label-width="70px">
                            <el-color-picker v-model="form.mask_description_color"></el-color-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="角标文案：" prop="font_mark_name"  v-show="form.platform == 1">
                    <el-input v-model="form.font_mark_name" placeholder="换行符\n，示例123\n456" type="textarea" class="form-item"></el-input>
                </el-form-item>

                <el-form-item label="角标文案颜色：" prop="font_mark_name_color"  v-show="form.platform == 1">
                    <el-color-picker v-model="form.font_mark_name_color"></el-color-picker>
                </el-form-item>

                <el-form-item label="角标底色：" prop="font_mark_background_color"  v-show="form.platform == 1">
                    <el-color-picker v-model="form.font_mark_background_color"></el-color-picker>
                </el-form-item>

                <el-form-item label="排序：" prop="order">
                    <el-input v-model="form.order" placeholder="请填写排序" class="form-item"></el-input>
                </el-form-item>

                <el-form-item label="备注：" prop="remark" v-show="form.platform == 1">
                    <el-input v-model="form.remark" placeholder="请填写备注" class="form-item"></el-input>
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
    let defaultOpt = {
        platform: '1',
        title: '',
        banner_url: '',
        banner_link: '',
        is_show: '',
        time_range: [],
        lang: 'en',
        category_library_id: '',
        type: '1',
        is_show_mask: '1',
        start_time: '',
        end_time: '',
        order: '',
        remark: '',
        mask_name: '',
        mask_name_color: '#000',
        mask_description: '',
        mask_description_color: '#000',
        font_mark_name: '',
        font_mark_name_color: '#fff',
        font_mark_background_color: '#FF8A00'
    }
    export default {
        data() {
            return {
                dataLoading: false,
                form: JSON.parse(JSON.stringify(defaultOpt)),
                platformTexts: {
                    '1': 'WEB',
                    '2': 'WAP'
                },
                langs: null,
                categoryLibrarys: null,
                isEdit: false,
                rules: {
                    platform: [
                        { required: true, message: '请选择平台', trigger: 'change' }
                    ],
                    title: [
                        { required: true, message: '请填写标题', trigger: 'blur' }
                    ],
                    lang: [
                        { required: true, message: '请选择语言', trigger: 'change' }
                    ],
                    category_library_id: [
                        { required: true, message: '请选择关联品类馆', trigger: 'change' }
                    ],
                    banner_url: [
                        { required: true, message: '请填写图片地址', trigger: 'blur' }
                    ],
                    banner_link: [
                        { required: true, message: '请填写跳转url', trigger: 'blur' }
                    ]
                },
                clear_category_library_id: false
            }
        },
        computed: {
            ctrl() {
                if (this.$route.query['id']) {
                    return this.showAction_('admin/category-library-banner/edit');
                } else {
                    return this.showAction_('admin/category-library-banner/add');
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
        watch: {
            'form.lang': function(val, oldVal) {
                if(val !== oldVal) {
                    if(!this.isEdit || this.clear_category_library_id){
                        this.form.category_library_id = '';
                    }
                    this.$nextTick(() => {
                        this.getCategoryLibrarys();
                    });
                }
            },
            'form.platform': function(val, oldVal) {
                if(val !== oldVal) {
                    if(!this.isEdit || this.clear_category_library_id){
                        this.form.category_library_id = '';
                    }
                    this.$nextTick(() => {
                        this.getCategoryLibrarys();
                    });
                }
            }

        },
        methods: {
            initData() {
                this.getLangs();
                if(!this.isEdit) {
                    this.getCategoryLibrarys();
                }
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
            // 获取绑定品类馆列表
            getCategoryLibrarys() {
                this.$http.get('admin/public/get-category-libraries',{params: {
                    lang: this.form.lang,
                    platform: this.form.platform
                }}).then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    this.categoryLibrarys = res.body.data;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 获取banner分类馆详细信息
            getInfo() {
                this.$http.get('admin/category-library-banner/info', {params: {
                    id: this.$route.query.id
                }}).then(res => {
                    if (res.body.code == 0) {
                        let data = this.handleEditInitParams(res.body.data);
                        // console.log(data);
                        this.form = Object.assign({}, defaultOpt, data);
                        this.$nextTick(() => {
                            this.clear_category_library_id = true;
                            // 如果编辑时语言/平台没有发生变化
                            if(this.form.lang == defaultOpt.lang && this.form.platform == defaultOpt.platform) {
                                this.getCategoryLibrarys();
                            }
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                })
            },
            //编辑附值
            handleEditInitParams(params) {
                if(params.start_time && params.end_time) {
                    let start_time =  this.timeZone_(params.start_time, this.$store.getters.getTimeZone);
                    let end_time =  this.timeZone_(params.end_time, this.$store.getters.getTimeZone);
                    params.time_range = [start_time, end_time];
                }
                params.mask_name_color = params.mask_name_color ? params.mask_name_color : '#000';
                params.mask_description_color = params.mask_description_color ? params.mask_description_color : '#000';
                params.font_mark_name_color = params.font_mark_name_color ? params.font_mark_name_color : '#fff';
                params.font_mark_background_color = params.font_mark_background_color ? params.font_mark_background_color : '#FF8A00';
                params.platform = String(params.categoryLibrary.platform);
                params.lang = String(params.categoryLibrary.lang) || 'en';
                params.is_show = String(params.is_show);
                params.is_show_mask = String(params.is_show_mask);
                params.category_library_id = String(params.category_library_id);
                params.type = String(params.type);
                delete params.update_time;
                delete params.create_time;
                delete params.categoryLibrary;
                return params;
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
                        this.$http.post('admin/category-library-banner/' + (this.isEdit ? 'edit' : 'add'), params).then(res => {
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
            // 处理传参
            handleParams(params) {
                switch(params.platform) {
                    case '1':
                        if(params.time_range.length === 2) {
                            params.start_time = this.timeZone_(new Date(params.time_range[0]), this.$store.getters.getTimeZone);
                            params.end_time = this.timeZone_(new Date(params.time_range[1]), this.$store.getters.getTimeZone);
                        } else {
                            params.start_time = '';
                            params.end_time = '';
                        }
                        delete params.time_range;
                        if(params.type == 2) {
                            delete params.is_show_mask;
                        }
                    break;
                    case '2':
                        delete params.start_time;
                        delete params.end_time;
                        delete params.time_range;
                        delete params.remark;
                        delete params.mask_name_color;
                        delete params.mask_description_color;
                        delete params.font_mark_name;
                        delete params.font_mark_name_color;
                        delete params.font_mark_background_color;
                        delete params.is_show_mask;
                        delete params.type;
                    break;
                }
                console.log(params)
                return params;
            },
            // 返回
            goBack() {
                this.$router.push({ name: 'site_categoryLibraryBannerList' });
            },
        }
    }
</script>
<style lang="less">
    .form{
        .form-item{
            width: 400px;
        }
    }
</style>
