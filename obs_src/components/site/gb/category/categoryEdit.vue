<!-- GB分类页面配置编辑 -->
<template>
    <div class="gb-cat-edit">
        <div class="el-container" v-loading="fullLoading">
            <el-form :inline="true" :model="option" label-width="100px" ref="searchForm" :rules="postRule">
                <el-form-item label="请选择语言" prop="lang">
                    <el-select v-model="option.lang" clearable>
                        <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code">
                    <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类:">
                    <el-select v-model="option.cat_id" clearable filterable>
                        <el-option v-for="catItem in catOpt" :key="catItem.id" :label="catItem.name" :value="catItem.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示位置" prop="type">
                    <el-radio-group v-model="option.type" @change="changeType">
                        <el-radio v-for="(label, index) in typeOpt" :key="index" :label="index">{{label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="标题" prop="name" class="txt">
                    <el-input v-model="option.name"></el-input>
                </el-form-item>
                <template v-for="(item, index) in option.content">
                    <el-row class="content">
                        <el-col :span="6" v-if="option.type == 2">
                            <el-form-item label="产品线标题" :prop="'content.' + index + '.title'" :rules="[{required: true, message: '该项不能为空'}]">
                                <el-input v-model="item.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="option.type == 1 || option.type == 2">
                            <el-form-item label="图片地址" :prop="'content.' + index + '.image_url'" :rules="[{required: true, message: '该项不能为空'}]">
                                <el-input v-model="item.image_url"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="option.type == 1 || option.type == 2">
                            <el-form-item label="跳转URL" :prop="'content.' + index + '.image_link'" :rules="[{required: true, message: '该项不能为空'}]">
                                <el-input v-model="item.image_link"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="option.type == 3">
                            <el-form-item label="热推词" :prop="'content.' + index + '.hot'" :rules="[{required: true, message: '该项不能为空'}]">
                                <el-input v-model="item.hot"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="option.type == 3">
                            <el-form-item label="热推词URL" :prop="'content.' + index + '.hot_url'" :rules="[{required: true, message: '该项不能为空'}]">
                                <el-input v-model="item.hot_url"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="option.type == 4">
                            <el-form-item label="相关类目" prop="" class="cat-select" key="type4">
                                <el-select v-model="cat" multiple clearable filterable @change="changeBindCat($event, item)">
                                    <el-option v-for="catItem in catOpt" :key="catItem.id" :label="catItem.name" :value="String(catItem.id)"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="option.type == 4">
                            <el-form-item label-width="120px" label="对应的分类ID" :prop="'content.' + index + '.cat_ids'" :rules="[{required: true, message: '该项不能为空'}]">
                                <el-input v-model="item.cat_ids" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="option.type == 5">
                            <el-form-item label="品牌名称" :prop="'content.' + index + '.brand_code'" :rules="[{required: true, message: '该项不能为空'}]" key="type5">
                                <!--<el-select v-model="item.brand_code" clearable filterable>
                                    <el-option v-for="item in brandOpt" :key="item.brandCode" :label="item.brandTitle" :value="item.brandCode"></el-option>
                                </el-select>-->
                                <span class="ac-real-list-wrap">
                                    <el-autocomplete v-model="item.brand_code" placeholder="品牌名称" :fetch-suggestions="querySearch" @select="handleSelect($event, index)" icon="circle-close" :on-icon-click="handleIconClick(index)"></el-autocomplete>
                                    <i class="el-icon-caret-bottom"></i>
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="option.type == 5">
                            <el-form-item label="品牌URL" :prop="'content.' + index + '.brand_url'" :rules="[{required: true, message: '该项不能为空'}]">
                                <el-input v-model="item.brand_url"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" v-if="option.type != 4">
                            <el-button type="primary" icon="plus" @click="add"></el-button>
                            <el-button type="danger" icon="minus" @click="remove(index)"></el-button>
                        </el-col>
                    </el-row>
                </template>
                <el-form-item label="是否显示" prop="is_show">
                    <el-radio-group v-model="option.is_show">
                        <el-radio :label="1">显示</el-radio>
                        <el-radio :label="0">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark" class="txt">
                    <el-input v-model="option.remark"></el-input>
                </el-form-item>
                <div class="text-center">
                    <el-button type="primary" @click="post" v-loading="postLoding" :disabled="postLoding" v-if="ctrl">保存</el-button>
                    <el-button type="danger" @click="goback">返回</el-button>
                </div>
            </el-form>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

    export default {
        data () {
            return {
                init: false,
                fullLoading: false,
                postLoding: false,
                option: {
                    lang: '',
                    pipeline_code: '',
                    cat_id: '',
                    type: '1',
                    is_show: '',
                    name: '',
                    remark: '',
                    content: [{
                        image_link: '',
                        image_url: '',
                        title: '',
                        hot: '',
                        hot_url: '',
                        brand_code: '',
                        brand_code_temp: '',
                        brand_name: '',
                        brand_name_temp: '',
                        brand_url: '',
                        cat_ids: '',
                    }],
                },
                lastCategoryMark: '',
                langOpt: [],
                catOpt: {},
                cat: [],
                brandOpt: [],
                typeOpt: {
                    '1': '头部banner',
                    '2': '热推产品线',
                    '3': '热推词',
                    '4': '相关类目',
                    '5': '热推品牌',
                },
                id: this.$route.query.id,
                postRule: {
                    lang: [{
                        required: true,
                        message: '该项不能为空',
                    }],
                    pipeline_code: [{
                        required: true,
                        message: '该项不能为空',
                    }],
                    name: [{
                        required: true,
                        message: '该项不能为空',
                    }],
                    type: [{
                        required: true,
                        message: '该项不能为空',
                    }],
                    cat_id: [{
                        required: true,
                        message: '该项不能为空',
                    }],
                    is_show: [{
                        required: true,
                        message: '该项不能为空',
                    }]
                },
                constOptionData: {},
            };
        },
        computed: {
            ctrl() {
                if (this.id) {
                    return this.showAction_('admin/category-page-setting/edit');
                } else {
                    return this.showAction_('admin/category-page-setting/add');
                }
            },
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created () {
            this.getOpt();
        },
        methods: {
            getOpt() {
                let reqArr = [
                    this.$http.get('admin/public/languages'),
                    this.$http.get('seo/public/category-all'),
                    this.$http.get('goods/public/brands', {params: {pageNo: 1, pageSize: 99999}})
                ]
                this.fullLoading = true;
                Promise.all(reqArr).then(resArr => {
                        let flag = true;
                        for (let i in resArr) {
                            let item = resArr[i].body;
                            if (item.code !== 0) {
                                this.$message.error(item.message);
                                flag = false;
                                break;
                            }
                        }
                        if (!flag) {
                            return false;
                        }

                        // 语言
                        this.langOpt = resArr[0].body.data;
                        // 分类
                        this.catOpt = resArr[1].body.data;

                        //  品牌
                        //this.brandOpt = resArr[2].body.data.list;
                        let tempArr = [];
                        resArr[2].body.data.list.forEach((item) => {
                            tempArr.push({
                                value: item.brandTitle + '（' + item.brandCode + '）',
                                code: item.brandCode
                            });
                        });
                        this.brandOpt = tempArr;

                        if(this.id) {
                            this.getData();
                        }
                        this.fullLoading = false;
                    },
                    err => {
                        this.$notify.error(err.body.message || '发生错误');
                        this.fullLoading = false;
                    })
            },
            getData() {
                this.$http.get('admin/category-page-setting/info', {params: {id: this.id}}).then(res => {
                    if (res.body.code === 0) {
                        this.init = true;
                        let data = res.body.data;

                        data.content = JSON.parse(data.content);
                        data.type = String(data.type);
                        data.cat_id = parseInt(data.cat_id);
                        if (data.type == 4) {
                            this.cat = data.content[0].cat_ids.split(',');
                        }

                        this.option = data;
                        this.constOptionData = JSON.parse(JSON.stringify(data));
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            },
            changeBindCat (val, item) {
                item.cat_ids = val.join(',');
            },
            // content内容
            add () {
                this.option.content.push({
                    image_link: '',
                    image_url: '',
                    title: '',
                    hot: '',
                    hot_url: '',
                    brand_code: '',
                    brand_url: '',
                    cat_ids: '',
                })
            },
            remove(index) {
                this.option.content.splice(index, 1);
            },
            changeType (val) {
                let tempData = JSON.parse(JSON.stringify(this.constOptionData));

                if (val === tempData.type) {
                    this.option = tempData;
                } else {
                    let obj = {
                        image_link: '',
                        image_url: '',
                        title: '',
                        hot: '',
                        hot_url: '',
                        brand_code: '',
                        brand_code_temp: '',
                        brand_name: '',
                        brand_name_temp: '',
                        brand_url: '',
                        cat_ids: '',
                    };
                    this.cat.splice(0, this.cat.length);
                    this.option.content = [obj];
                    this.option.name = '';
                    this.option.is_show = '';
                    this.option.remark = '';
                }
            },
            post() {
                this.$refs.searchForm.validate(valid => {
                    if (valid) {
                        let src = this.id ? 'admin/category-page-setting/edit' : 'admin/category-page-setting/add';
                        let params = JSON.parse(JSON.stringify(this.option));
                        let type = this.option.type;
                        params.content = params.content.map(item => {
                            if (type == 1) {
                                return {
                                    image_link: item.image_link,
                                    image_url: item.image_url,
                                }
                            } else if (type == 2) {
                                return {
                                    title: item.title,
                                    image_link: item.image_link,
                                    image_url: item.image_url,
                                }
                            } else if (type == 3) {
                                return {
                                    hot: item.hot,
                                    hot_url: item.hot_url,
                                }
                            } else if (type == 4) {
                                return {
                                    cat_ids: item.cat_ids,
                                }
                            } else {
                                return {
                                    brand_code: item.brand_code,
                                    brand_url: item.brand_url,
                                }
                            }
                        });

                        if (this.id) {
                            params.id = this.id;
                        }

                        this.postLoding = true;
                        params.content = JSON.stringify(params.content);
                        this.$http.post(src, params).then(res => {
                            this.postLoding = false;
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                                this.goback();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.postLoding = false;
                        });
                    }
                })

            },
            goback() {
                this.$router.push({
                    name: 'site_categoryList'
                })
            },

            // 品牌搜索
            querySearch(queryString, cb) {
                let items = this.brandOpt;
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
            handleSelect(item,index) {
                this.option.content[index].brand_code = item.value;
            },
            handleIconClick(...argument) {
                return () => {
                    this.option.content[argument[0]].brand_code = '';
                };
            },
        }

    }
</script>

<style lang="less">
    .ac-real-list-wrap { display: block; position: relative;
        .el-icon-circle-close { visibility: hidden; z-index: 5; }
        .el-input { z-index: 2; }
        input { background: none; }
        > i { position: absolute; top: 50%; right: 10px; transform: translateY(-50%); color: #bfcbd9; font-size: 12px; z-index: 1; }
        &:hover {
            > i { visibility: hidden; }
            .el-icon-circle-close { visibility: visible; }
        }
        .edit-dlg & { display: inline-block; }
        .edit-dlg & > i { right: 20px; }
    }
    .gb-cat-edit {
        .el-form-item {
            display: block;
        }

        .content {
            .el-form-item__content {
                width: 60%;
            }

            .cat-select {
                .el-form-item__content {
                    width: 80%;
                }
            }
        }

        .txt {
            .el-form-item__content {
                width: 50%;
            }
        }
    }
</style>


