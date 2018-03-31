<!-- 新手导购编辑 -->
<template>
    <div class="el-container gb-guide-edit">
        <el-form label-width="100px" :model="option" class="content" ref="postForm" :rules="postRule">
            <el-form-item label="语言" prop="lang">
                <el-select clearable filterable v-model="option.lang">
                    <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="平台" prop="platform">
                <el-checkbox-group v-model="option.platform">
                    <el-checkbox v-for="(item, index) in platOpt" :key="index" :label="index">{{item}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="option.title"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort_order">
                <el-input v-model="option.sort_order"></el-input>
            </el-form-item>
            <el-form-item label="模板类型" prop="temp_type">
                <el-radio-group v-model="option.temp_type" @change="changType">
                    <el-radio v-for="(item, index) in tempOpt" :key="index" :label="index">{{item}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="模板数据">
                <template v-if="option.temp_type === '1' ">
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="coupon">
                                <el-input v-model="option.temp_data.coupon_ids"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :offset="1">
                            (多个优惠券用,隔开)
                        </el-col>
                    </el-row>
                </template>
                <template v-if="option.temp_type === '2' ">
                    <el-row v-for="(item, index) in option.temp_data" :key="index" class="cycle">
                        <el-col :span="16">
                            <el-form-item label="分组名称">
                                <el-input v-model="item.group_name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品类型">
                                <el-select v-model="item.goods_type">
                                    <el-option v-for="(opt, _index) in goodsOpt" :key="_index" :value="_index" :label="opt"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="coupon" v-if="item.goods_type === '2'">
                                <el-input v-model="item.coupon_id"></el-input>
                            </el-form-item>
                            <el-form-item label="分组商品">
                                <el-input v-model="item.goods"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :offset="1">
                            <el-button type="primary" icon="plus" @click="add('2')"></el-button>
                            <el-button type="danger" icon="minus" @click="remove('2', index)" v-if="option.temp_data.length > 1"></el-button>
                        </el-col>
                    </el-row>
                </template>
                <template v-if="option.temp_type === '3' ">
                    <el-row v-for="(item, index) in option.temp_data.course" :key="index" class="cycle">
                        <el-col :span="16">
                            <el-form-item label="描述图片">
                                <el-input v-model="item.course_img"></el-input>
                            </el-form-item>
                            <el-form-item label="描述链接">
                                <el-input v-model="item.course_link"></el-input>
                            </el-form-item>
                            <el-form-item label="app跳转链接">
                                <!--<el-input v-model="item.deep_link"></el-input>-->
                                <el-autocomplete popper-class="my-autocomplete" v-model="item.deep_link" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect($event,'course', index)" icon="circle-close" :on-icon-click="handleIconClick('course', index)"></el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :offset="1">
                            <el-button type="primary" icon="plus" @click="add('course')"></el-button>
                            <el-button type="danger" icon="minus" @click="remove('course', index)" v-if="option.temp_data.course.length > 1"></el-button>
                        </el-col>
                    </el-row>
                    <el-row v-for="(item, index) in option.temp_data.question" :key="index" class="cycle">
                        <el-col :span="16">
                            <el-form-item label="常见问题描述">
                                <el-input v-model="item.question_desc"></el-input>
                            </el-form-item>
                            <el-form-item label="描述链接">
                                <el-input v-model="item.question_link"></el-input>
                            </el-form-item>
                            <el-form-item label="app跳转链接">
                                <!--<el-input v-model="item.deep_link"></el-input>-->
                                <el-autocomplete popper-class="my-autocomplete" v-model="item.deep_link" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect($event,'question', index)" icon="circle-close" :on-icon-click="handleIconClick('question', index)"></el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :offset="1">
                            <el-button type="primary" icon="plus" @click="add('question')"></el-button>
                            <el-button type="danger" icon="minus" @click="remove('question', index)" v-if="option.temp_data.question.length > 1"></el-button>
                        </el-col>
                    </el-row>
                </template>
                <template v-if="option.temp_type === '4' ">
                    <el-row v-for="(item, index) in option.temp_data" :key="index" class="cycle">
                        <el-col :span="16">
                            <el-form-item label="banner图片">
                                <el-input v-model="item.banner_img"></el-input>
                            </el-form-item>
                            <el-form-item label="banner链接">
                                <el-input v-model="item.banner_link"></el-input>
                            </el-form-item>
                            <el-form-item label="app跳转链接">
                                <!--<el-input v-model="item.deep_link"></el-input>-->
                                <el-autocomplete popper-class="my-autocomplete" v-model="item.deep_link" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect_4($event, index)" icon="circle-close" :on-icon-click="handleIconClick_4(index)"></el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :offset="1">
                            <el-button type="primary" icon="plus" @click="add('4')"></el-button>
                            <el-button type="danger" icon="minus" @click="remove('4', index)" v-if="option.temp_data.length > 1"></el-button>
                        </el-col>
                    </el-row>
                </template>
            </el-form-item>
            <el-form-item class="text-center">
                <el-button type="primary" @click="post" v-loading="postLoading" :disabled="postLoading" v-if="ctrl">保存</el-button>
                <el-button type="danger" @click="goback">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
</template>

<script>

export default {
    data () {
        let checkInt = (rule, val, callback) => {
            let exp = /^[1-9]\d*$/;
            if (exp.test(val * 1) || val == 0) {
                callback();
            } else {
                callback(new Error('排序必须是大于等于0的整数'));
            }
        }
        return {
            postLoading: false,
            init: false,
            id: this.$route.query.id,
            option: {
                lang: [],
                pipeline_code: [],
                platform: [],
                temp_type: '1',
                sort_order: '',
                title: '',
                temp_data: {
                    coupon_ids: '',
                }
            },
            langOpt: {},
            platOpt:{
                '1': 'PC',
                '2': 'M',
                '3': 'IOS',
                '4': 'ANDROID',
                '5': 'PAD'
            },
            tempOpt: {
                '1': '新手抢券',
                '2': '精选商品',
                '3': '新手教程',
                '4': 'banner入口',
            },
            goodsOpt: {
                '1': '普通商品',
                '2': '配劵商品',
                '3': 'app专享价'
            },
            postRule: {
                title: [{
                    required: true,
                    message: '该项不能为空',
                }],
                temp_type: [{
                    required: true,
                    message: '该项不能为空',

                }],
                sort_order: [{validator: checkInt}],

            },
            deeplinks: []
        };
    },
    created () {
        this.getLangOpt();
        if (this.id) {
            this.getData();
        }
        this.deeplinks = this.$store.getters.getDeeplink;
    },
    computed: {
        ctrl() {
            if (this.id) {
                return this.showAction_('promotion/new-shopping-guide/edit');
            } else {
                return this.showAction_('promotion/new-shopping-guide/add');
            }
        },
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    methods: {
        getLangOpt() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData() {
            this.$http.get('promotion/new-shopping-guide/info', {params: {id: this.id}}).then(res => {
                if (res.body.code === 0) {
                    this.init = true;
                    let data = res.body.data;
                    data.platform = data.platform.split(',');
                    data.temp_type = String(data.temp_type);
                    this.option = data;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            })
        },
        changType(val) {
            if (this.init) {
                this.init = false;
                return false;
            }
            switch (val) {
                case '1':
                    this.option.temp_data = {
                        coupon_ids: '',
                    };
                    break;
                case '2':
                    this.option.temp_data = [{
                        group_name: '',
                        goods_type: '',
                        coupon_id: '',
                        goods: '',
                    }];
                    break;
                case '3':
                    this.option.temp_data = {
                        course: [{
                            course_img: '',
                            course_link: '',
                            deep_link: '',
                        }],
                        question: [{
                            question_desc: '',
                            question_link: '',
                            deep_link: '',
                        }],
                    };
                    break;
                case '4':
                    this.option.temp_data = [{
                        banner_img: '',
                        banner_link: '',
                        deep_link: '',
                    }];
                    break;
            }
        },
        add(val) {
            switch (val) {
                case '2':
                    this.option.temp_data.push({
                        group_name: '',
                        goods_type: '',
                        coupon_id: '',
                        goods: '',
                    });
                    break;
                case '4':
                    this.option.temp_data.push({
                        banner_img: '',
                        banner_link: '',
                        deep_link: '',
                    });
                    break;
                case 'course':
                    this.option.temp_data.course.push({
                        course_img: '',
                        course_link: '',
                        deep_link: '',
                    });
                    break;
                case 'question':
                    this.option.temp_data.question.push({
                        question_desc: '',
                        question_link: '',
                        deep_link: '',
                    });
                    break;
            }
        },
        remove(val, index) {
            switch (val) {
                case '2':
                    this.option.temp_data.splice(index, 1);
                    break;
                case '4':
                    this.option.temp_data.splice(index, 1);
                    break;
                case 'course':
                    this.option.temp_data.course.splice(index, 1)
                    break;
                case 'question':
                    this.option.temp_data.question.splice(index, 1)
                    break;
            }
        },
        post() {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let params = {};
                    let src = 'promotion/new-shopping-guide/add';

                    for (let i in this.option) {
                        if (i == 'platform'){
                            params[i] = this.option[i].join(',');
                        } else {
                            params[i] = this.option[i];
                        }
                    }

                    if (this.id) {
                        params.id = this.id;
                        src = 'promotion/new-shopping-guide/edit';
                    }
                    this.postLoading = true;

                    this.$http.post(src, params).then(res => {
                        this.postLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.goback();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoading = false;
                    });
                }
            })
        },
        goback() {
            this.$router.push({
                name: 'site_guideList',
            })
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
        handleSelect(item,type,index) {
            this.option.temp_data[type][index].deep_link = item.url;
        },
        handleIconClick(...argument) {
            return () => {
                this.option.temp_data[argument[0]][argument[1]].deep_link = '';
            };
        },
        handleSelect_4(item,index) {
            this.option.temp_data[index].deep_link = item.url;
        },
        handleIconClick_4(...argument) {
            return () => {
                this.option.temp_data[argument[0]].deep_link = '';
            };
        }
    }

}
</script>

<style lang="less">
    .gb-guide-edit {
        .content {
            width: 60%;
        }

        .cycle {
            border: 1px solid #8492a6;
            border-radius: 15px;
            padding: 10px;
            margin-bottom: 10px;
            .el-form-item {
                margin-bottom: 10px;
            }
        }
    }
</style>


