<!-- 置顶管理编辑 -->
<template>
    <div>
        <div class="el-container">
            <el-form :model="option"  label-width="200px" v-loading="infoLoading" ref="postForm" :rules="postRule">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="语言" prop="lang">
                            <el-select v-model="option.lang" placeholder="请选择" class="tpl-form-item">
                                <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="渠道" prop="pipeline_code">
                            <el-select v-model="option.pipeline_code" placeholder="请选择" class="tpl-form-item">
                                <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="平台" prop="platform">
                            <el-select v-model="option.platform" @change="platformChange">
                                <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="显示位置" prop="position">
                            <el-select v-model="option.position" @change="changePosition" :disabled="option.platform ===''">
                                <el-option v-for="(item, index) in positionList" :value="index" :label="item" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属分类" v-if="positionCat" prop="cat_id" :rules="[{type: 'array', required: true, message: '该项不能为空', trigger: 'change' }]">
                            <el-select v-model="option.cat_id" filterable multiple>
                                <el-option v-for="item in catList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键词" v-if="positionIndex" prop="keywords" :rules="[{required: true, message:'该项不能为空', trigger: 'blur'}]">
                            <el-input v-model="option.keywords" placeholder="搜索结果页要绑定关键词"></el-input>
                        </el-form-item>
                        <el-form-item :label="sku_label" prop="goods_sku">
                            <el-input :rows="4" type="textarea" v-model="option.goods_sku" placeholder="修改不能使用多个产品,多个产品之间使用&quot;,&quot;分割"></el-input>
                        </el-form-item>
                        <el-form-item label="起止时间" prop="time_arr" required>
                            <el-date-picker v-model="option.time_arr" type="datetimerange" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态" prop='is_show'>
                            <el-radio-group v-model="option.is_show">
                                <el-radio class="radio" :label="1">启用</el-radio>
                                <el-radio class="radio" :label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" @click="edit" v-loading="postLoading" :disabled="postLoading" v-if="ctrl">保存</el-button>
                            <el-button type="danger" @click="goBack">返回</el-button>
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

        let checkDate = (rule, value, callback) => {
            if (value instanceof Array && value[0] && value[1]) {
                callback();
            } else {
                callback(new Error('时间不能为空'))
            }
        }

        return {
            postLoading: false,
            option: {
                is_show: '',
                keywords: '',
                time_arr: '',
                goods_sku: '',
                cat_id: [],
                position: '',
                lang: '',
                pipeline_code: '',
                platform: '',
            },
            catList: {},
            queryCatlist: [],
            positionList: {},
            positionIndex: true,
            positionCat: true,
            infoLoading: true,
            title: '编辑',
            postRule: {
                /* goods_sku: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }], */
                position: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                is_show: [{
                    validator: checkNum
                }],
                time_arr: [{
                    validator: checkDate
                }],
                lang: [{required: true,message: '该项不能为空',trigger: 'change'}],
                platform: [{required: true,message: '该项不能为空',trigger: 'change'}],
                pipeline_code: [{required: true,message: '该项不能为空',trigger: 'change'}],
            },
            langs: null,
            platforms: {
                '1': 'WEB',
                '2': 'WAP',
                '3': 'IOS',
                '4': 'Android'
            },
            sku_label: 'SKU',
            constPositionList: {},
        };
    },
    computed: {
        ctrl() {
            if (this.$route.query['id']) {
                return this.showAction_('seo/top-goods-setting/edit');
            } else {
                return this.showAction_('seo/top-goods-setting/add');
            }
        },
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getLangs();
        this.initData();
    },
    methods: {
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
        initData () {
            Promise.all([this.$http.get('seo/public/category-all'), this.$http.get('seo/top-goods-setting/position-all')]).then((res) => {
                let data = res[0].body.data;
                this.catList = data;
                this.catList['0'] = {
                    id: 0,
                    name: '暂无分类'
                };
                this.positionList = res[1].body.data;
                this.constPositionList = this.positionList;
                if (this.$route.name === 'seo_topEdit') {
                    this.getData();
                } else {
                    this.title = '新增';
                    this.infoLoading = false;
                }
            });
        },
        getData () {
            this.$http.get('seo/top-goods-setting/info', {params: {id: this.$route.query.id}}).then(res => {
                this.infoLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;

                    let cat_id_temp = [];
                    data.cat_id.split(',').forEach(item => {
                        cat_id_temp.push(parseInt(item));
                    });
                    data.cat_id = cat_id_temp;

                    data.time_arr = [new Date(data.start_time * 1000), new Date(data.end_time * 1000)];
                    data.platform = data.platform.toString();
                    this.option = data;
                }
            }).catch(err => {
                this.infoLoading = false;
            });
        },
        changePosition (val) {
            if (val === 'search') {
                this.positionIndex = true;
                this.positionCat = false;
                this.option.cat_id = '';
            } else if (val === 'category' || val === 'new') {
                this.positionIndex = false;
                this.positionCat = true;
                this.option.keywords = '';
            } else if(val === 'index_daily_deals' || val === 'index_flash_sale') {
                this.sku_label = 'SKU_仓';
                this.positionIndex = false;
                this.positionCat = true;
                this.option.keywords = '';
            } else {
                this.positionIndex = false;
                this.positionCat = false;
                this.option.cat_id = '';
                this.option.keywords = '';
                this.sku_label = 'SKU';
            }
        },
        edit () {
            this.postLoading = true;
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let params = {};
                    let src = 'seo/top-goods-setting/edit';

                    if (typeof this.option.time_arr != 'undefined') {
                        let timeArr = this.timeZone_(this.option.time_arr, this.$store.getters.getTimeZone);
                        this.option.start_time = timeArr[0];
                        this.option.end_time = timeArr[1];
                    } else {
                        this.option.start_time = 0;
                        this.option.end_time = 0;
                    }

                    for (let i in this.option) {
                        if (i !== 'time_arr') {
                            params[i] = this.option[i];
                        }
                    }
                    if (this.$route.name === 'seo_topEdit') {

                    } else {
                        src = 'seo/top-goods-setting/add'
                    }

                    params.cat_id = params.cat_id.toString();

                    this.$http.post(src, params).then(res => {
                        this.postLoading = false;
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
                        this.postLoading = false;
                    });
                } else {
                    this.postLoading = false;
                }
            });
        },
        goBack () {
            history.back();
        },
        //切换平台
        platformChange() {
            let plat = this.option.platform.toString();
            this.positionList = {};

            for (let key in this.constPositionList) {
                // pc
                if (plat === '1' &&  (key === 'index_daily_deals' || key === 'index_flash_sale' || key === 'app_slae_pirce')) {
                    continue;
                }
                // wap
                if (plat === '2' && (key === 'index_daily_deals' || key === 'index_flash_sale' || key === 'index_recommend' || key === 'app_slae_pirce')) {
                    continue;
                }
                // android/ios
                if ((plat === '3' || plat === '4') && (key === 'index_recommend')) {
                    continue;
                }

                this.positionList[key] = this.constPositionList[key];
            }
        },
    }
}
</script>

<style>

</style>


