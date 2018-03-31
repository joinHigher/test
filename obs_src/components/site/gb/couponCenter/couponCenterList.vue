<!-- gb 领劵中心列表 -->
<template>
    <div class="el-container gb-coupon-center-page">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="优惠券列表" name="1">
                <el-form inline :model="option" ref="couponForm">
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
                    <el-form-item label="优惠券分类" prop="category_id">
                        <el-select clearable v-model="option.category_id">
                            <el-option v-for="(item, index) in catOpt" :value="index" :key="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="查询类型" prop="query_content">
                        <el-input v-model="option.query_content" class="quick-search" placeholder="外部商品编码(多编号“,”划分)">
                            <el-select filterable clearable v-model="option.query_type" slot="prepend" placeholder="请选择">
                                <el-option v-for="(item, index) in query_type_dropdown" :key="index" :label="item" :value="index">
                                </el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="text-right el-sub-container">
                    <el-button type="primary" @click="getData">查询</el-button>
                    <el-button type="danger" @click="resetForm('coupon')">重置</el-button>
                    <el-button type="primary" @click="addPage('coupon')" v-if="self.showAction_('admin/coupon-center/add')">添加优惠劵</el-button>
                </div>
                <el-table border :data="tableData" v-loading="tableLoading">
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="title" label="标题"></el-table-column>
                    <el-table-column prop="coupon" label="Coupon"></el-table-column>
                    <el-table-column prop="coupon_type_desc" label="优惠券类型"></el-table-column>
                    <el-table-column label="语言">
                        <template scope="scope">
                            {{ langTexts[scope.row.lang] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="渠道">
                        <template scope="scope">
                            <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="使用范围">
                        <template scope="scope">
                            <span v-if="scope.row.use_sku">单品: {{scope.row.use_sku}}</span>
                            <span v-if="scope.row.use_category">分类: {{scope.row.use_category}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="生效时间">
                        <template scope="scope">
                            {{self.timeZone_(scope.row.start_time, self.$store.getters.getTimeZone)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间">
                        <template scope="scope">
                            {{self.timeZone_(scope.row.end_time, self.$store.getters.getTimeZone)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="领取数/发放数">
                        <template scope="scope">
                            {{scope.row.receive_total_count}} / {{scope.row.grant_total_count}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="receive_total_count" label="已使用劵数"></el-table-column>
                    <el-table-column prop="name" label="返还劵数/失效劵数"></el-table-column>
                    <el-table-column label="显示">
                        <template scope="scope">
                            {{is_show_dropdown[scope.row.is_show]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="最后操作人">
                        <template scope="scope">
                            <span v-if="scope.row.update_user">{{scope.row.update_user}}</span>
                            <span v-else>{{scope.row.create_user}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="primary" size="small" @click="edit(scope.row, 'coupon')" v-if="self.showAction_('admin/coupon-center/info')">编辑</el-button>
                            <el-button type="danger" size="small" @click="remove(scope.row, 'coupon')" v-if="self.showAction_('admin/coupon-center/delete')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="el-container last text-right">
                    <el-pagination @size-change="changePageSize($event, 'list')" @current-change="changePage($event, 'list')" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="优惠券分类" name="2">
                <el-form inline label-width="100px" :model="catOption" ref="catForm">
                    <el-form-item label="语言" prop="lang">
                        <el-select clearable filterable v-model="catOption.lang">
                            <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道" prop="pipeline_code">
                        <el-select clearable filterable v-model="catOption.pipeline_code" placeholder="请选择">
                            <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="查询类型" prop="query_content">
                        <el-input v-model="catOption.query_content" class="quick-search" placeholder="外部商品编码(多编号“,”划分)">
                            <el-select filterable clearable v-model="catOption.query_type" slot="prepend" placeholder="请选择">
                                <el-option v-for="(item, index) in cat_query_type_dropdown" :key="index" :label="item" :value="index">
                                </el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="text-right el-sub-container">
                    <el-button type="primary" @click="getCatList">查询</el-button>
                    <el-button type="danger" @click="resetForm('cat')">重置</el-button>
                    <el-button type="primary" @click="addPage('cat')" v-if="self.showAction_('admin/coupon-center-category/add')">添加优惠劵分类</el-button>
                </div>
                <el-table border :data="catList" v-loading="tableLoading">
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="title" label="标题"></el-table-column>
                    <el-table-column prop="sub_title" label="副标题"></el-table-column>
                    <el-table-column label="语言">
                        <template scope="scope">
                            {{ langTexts[scope.row.lang] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="渠道">
                        <template scope="scope">
                            <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="nav_title" label="导航名"></el-table-column>
                    <el-table-column prop="sort_order" label="排序"></el-table-column>
                    <el-table-column label="显示">
                        <template scope="scope">
                            <span v-if="scope.row.is_show == 1">显示</span>
                            <span v-if="scope.row.is_show == 2">不显示</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后操作人">
                        <template scope="scope">
                            <span v-if="scope.row.update_user">{{scope.row.update_user}}</span>
                            <span v-else>{{scope.row.create_user}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="primary" size="small" @click="edit(scope.row, 'cat')" v-if="self.showAction_('admin/coupon-center-category/info')">编辑</el-button>
                            <el-button type="danger" size="small" @click="remove(scope.row, 'cat')" v-if="self.showAction_('admin/coupon-center-category/delete')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="el-container last text-right">
                    <el-pagination @size-change="changePageSize($event, 'cat')" @current-change="changePage($event, 'cat')" :current-page="catOption.page" :page-sizes="[20, 50]" :page-size="catOption.page_size" layout="total, sizes, prev, pager, next, jumper" :total="catTotal"></el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="领取页面编辑" name="3">
                <el-form label-width="100px" :model="pageOption" ref="pageForm" :rules="pageRule">
                    <el-form-item label="语言" prop="lang">
                        <el-select clearable filterable v-model="pageOption.lang">
                            <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道" prop="pipeline_code">
                        <el-select clearable filterable v-model="pageOption.pipeline_code" placeholder="请选择">
                            <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="平台" prop="platform">
                        <el-radio-group v-model="pageOption.platform" @change="getPageInfo">
                            <el-radio v-for="(item, index) in platform_select" :key="index" :label="index">{{item}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="头部图片" prop="top_image">
                        <el-input v-model="pageOption.top_image"></el-input>
                    </el-form-item>
                    <el-form-item label="导航样式" prop="css_path">
                        <el-input v-model="pageOption.css_path"></el-input>
                    </el-form-item>
                    <el-form-item label="标题文字颜色" prop="title_color">
                        <el-input v-model="pageOption.title_color"></el-input>
                    </el-form-item>
                    <el-form-item label="页面背景颜色" prop="bg_color">
                        <el-input v-model="pageOption.bg_color"></el-input>
                    </el-form-item>
                    <el-form-item label="SEO标题" prop="seo_title">
                        <el-input v-model="pageOption.seo_title"></el-input>
                    </el-form-item>
                    <el-form-item label="SEO描述" prop="seo_desc">
                        <el-input v-model="pageOption.seo_desc"></el-input>
                    </el-form-item>
                    <el-form-item label="开启活动推荐" prop="show_activity">
                        <el-radio-group v-model="pageOption.show_activity">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="活动推荐标题" prop="activity_title">
                        <el-input v-model="pageOption.activity_title"></el-input>
                    </el-form-item>
                    <el-form-item label="活动推荐颜色" prop="activity_color">
                        <el-input v-model="pageOption.activity_color"></el-input>
                    </el-form-item>
                    <el-form-item label="活动信息" prop="activity_pic_and_link" class="info">
                        <template v-for="(item, index) in pageOption.activity_pic_and_link">
                            <el-row>
                                <el-col :span="3" class="text-centet">活动图片{{index * 1 + 1}}:</el-col>
                                <el-col :span="9">
                                    <el-input v-model="item.activity_banner"></el-input>
                                </el-col>
                                <el-col :span="4" v-if="pageOption.platform == 2">
                                    <el-select v-model="item.activity_banner_type">
                                        <el-option label="大banner" value="1"></el-option>
                                        <el-option label="小banner" value="2"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-button type="primary" icon="plus" @click="add"></el-button>
                                    <el-button type="danger" icon="minus" @click="removeItem(index)" v-if="pageOption.activity_pic_and_link.length > 1"></el-button>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="3" class="text-centet">活动链接{{index * 1 + 1}}:</el-col>
                                <el-col :span="9">
                                    <el-input v-model="item.activity_banner_link"></el-input>
                                </el-col>
                                <div v-if="pageOption.platform == 2">
                                    <el-col :span="3" :offset="1" class="text-centet">app跳转链接{{index * 1 + 1}}:</el-col>
                                    <el-col :span="8">
                                        <!--<el-input v-model="item.deep_link"></el-input>-->
                                        <el-autocomplete popper-class="my-autocomplete" v-model="item.deep_link" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect($event,index)" icon="circle-close" :on-icon-click="handleIconClick(index)"></el-autocomplete>
                                    </el-col>
                                </div>
                            </el-row>
                        </template>
                        <el-button type="primary" @click="add" v-if="pageOption.activity_pic_and_link.length == 0">添加</el-button>
                    </el-form-item>
                    <el-form-item class="text-center">
                        <el-button type="primary" @click="save" :disabled="pageLoading" v-loading="pageLoading" v-if="self.showAction_('admin/coupon-center-page/save')">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
          </el-tabs>
    </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableLoading: false,
            pageLoading: false,
            pageOption: {
                lang: '',
                pipeline_code: '',
                platform: '1',
                top_image: '',
                css_path: '',
                title_color: '',
                bg_color: '',
                show_activity: '',
                activity_title: '',
                activity_color: '',
                seo_title: '',
                seo_desc: '',
                activity_pic_and_link: [{
                    activity_banner: '',
                    activity_banner_type: '',
                    activity_banner_link: '',
                    deep_link: '',
                }],
            },
            option: {
                query_content: '',
                query_type: '',
                category_id: '',
                lang: '',
                pipeline_code: '',
                page: 1,
                page_size: 20,
            },
            total: 1,
            catTotal: 1,
            catOption: {
                query_content: '',
                query_type: '',
                lang: '',
                pipeline_code: '',
                page: 1,
                page_size: 20,
            },
            catTotal: 1,
            tableData: [],
            catList: [],
            typeOpt: {},
            is_show_dropdown: {},
            query_type_dropdown: {},
            cat_query_type_dropdown: {},
            catOpt: {},
            lang_dropdown: {},
            activeName: '1',
            platform_select: {},
            pageRule: {
                platform: [{required: true, message: '该项不能为空'}],
                lang: [{required: true, message: '该项不能为空'}],
                pipeline_code: [{required: true, message: '该项不能为空'}]
            },
            deeplinks: [],
            langOpt: {},
            langTexts: {},
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getLangOpt();
        this.getOpt();
        this.getData();
        this.deeplinks = this.$store.getters.getDeeplink;
    },
    methods: {
        // 获取语言列表
        getLangOpt() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code !== 0) {
                    return;
                }
                this.langOpt = res.body.data;
                let langTexts = {};
                res.body.data.forEach((item) => {
                    langTexts[item.language_en] = item.language_ch;
                });
                this.langTexts = Object.assign({}, this.langTexts, langTexts);
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getOpt () {
            this.$http.get('admin/coupon-center-category/category-dropdown').then(res => {
                if (res.body.code === 0) {
                    this.catOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });
        },
        getData() {
            if ((!this.option.query_type && this.option.query_content) || (this.option.query_type && !this.option.query_content)) {
                this.$message.error('搜索类型必须匹配关键字')
                return false;
            }
            this.tableLoading = true;
            this.$http.get('admin/coupon-center/list', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data.list;
                    this.is_show_dropdown = data.is_show_dropdown;
                    this.query_type_dropdown = data.query_type_dropdown;
                    this.total = data.total_count;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            })
        },
        getCatList() {
            if ((!this.catOption.query_type && this.catOption.query_content) || (this.catOption.query_type && !this.catOption.query_content)) {
                this.$message.error('搜索类型必须匹配关键字')
                return false;
            }
            this.tableLoading = true;
            this.$http.get('admin/coupon-center-category/list', {params: this.catOption}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.catList = data.list;
                    this.lang_dropdown = data.lang_dropdown;
                    this.cat_query_type_dropdown = data.query_type_dropdown;
                    this.catTotal = data.total_count;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            })
        },
        getPageInfo() {
            this.$http.get('admin/coupon-center-page/info', {params: {platform: this.pageOption.platform}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.platform_select = data.platform_select;

                    for (let i in this.pageOption) {
                        this.pageOption[i] = data.info[i];
                    }
                    this.pageOption.platform = String(this.pageOption.platform);
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });
        },
        handleClick (val) {
            let type = val.name;
            if (type == 1) {
                this.getData();
            } else if (type == 2) {
                this.getCatList();
            } else {
                this.getPageInfo();
            }
        },
        changePageSize(val, type) {
            if (type == 'list') {
                this.option.page_size = val;
                this.getData();
            } else {
                this.catOption.page_size = val;
                this.getCatList();
            }

        },
        changePage(val, type) {
            if (type == 'list') {
                this.option.page = val;
                this.getData();
            } else {
                this.catOption.page = val;
                this.getCatList();
            }
        },
        add () {
            this.pageOption.activity_pic_and_link.push({
                activity_banner: '',
                activity_banner_type: '',
                activity_banner_link: '',
                deep_link: '',
            })
        },
        removeItem(index) {
            this.pageOption.activity_pic_and_link.splice(index, 1);
        },
        save (){
            this.$refs.pageForm.validate(valid => {
                if (valid) {
                    let params = JSON.parse(JSON.stringify(this.pageOption));
                    if (params.platform == 2) {
                        params.activity_pic_and_link.forEach(item => {
                            item.activity_banner_type = '';
                        })
                    }
                    this.pageLoading = true;
                    this.$http.post('admin/coupon-center-page/save', this.pageOption).then(res => {
                        this.pageLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.pageLoading = false;
                    });
                }
            })

        },
        edit(row, type) {
            if (type === 'coupon') {
                this.$router.push({
                    name: 'site_couponCenterEdit',
                    query: {
                        id: row.id,
                    }
                })
            } else {
                this.$router.push({
                    name: 'site_couponCenterCatEdit',
                    query: {
                        id: row.id,
                    }
                })
            }
        },
        addPage (type) {
            if (type == 'coupon') {
                this.$router.push({
                    name: 'site_couponCenterAdd',
                });
            } else {
                this.$router.push({
                    name: 'site_couponCenterCatAdd',
                });
            }

        },
        remove (row, type) {
            let src = 'admin/coupon-center/delete';
            if (type === 'cat') {
                src = 'admin/coupon-center-category/delete';
            }
            this.$confirm('确认删除?','提示').then(() => {
                this.$http.post(src, {id: row.id}).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        if (type === 'cat') {
                            this.getCatList();
                        } else {
                            this.getData();
                        }
                    } else {
                        this.$message.error(res.body.message);
                    }
                }).catch(err => {

                });
            }).catch(() => {
                this.$message.info('已取消')
            })
        },
        resetForm (type) {
            if (type === 'coupon') {
                this.$refs.couponForm.resetFields();
                this.option.query_type = '';
            } else {
                this.$refs.catForm.resetFields();
                this.catOption.query_type = '';
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
        handleSelect(item,index) {
            this.pageOption.activity_pic_and_link[index].deep_link = item.url;
        },
        handleIconClick(...argument) {
            return () => {
                this.pageOption.activity_pic_and_link[argument[0]].deep_link = '';
            };
        },
    }

}
</script>

<style lang="less">
    .gb-coupon-center-page {
        .el-form-item__content {
            width: 60%;
        }

        .info {
            .el-row {
                margin-bottom: 10px;
            }
        }
    }
</style>


