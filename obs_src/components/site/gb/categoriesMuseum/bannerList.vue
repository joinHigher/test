<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="绑定的品类馆：" prop="category_library_id">
                    <el-select v-model="filterForm.category_library_id" filterable clearable placeholder="请选择">
                        <el-option v-for="item in categoryLibrarys" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示位置：" prop="type">
                    <el-select v-model="filterForm.type" clearable placeholder="请选择">
                        <el-option label="大banner" value="1"></el-option>
                        <el-option label="广告位" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示：" prop="is_show">
                    <el-select v-model="filterForm.is_show" clearable placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="编辑时间：" prop="edit_time_range">
                    <el-date-picker v-model="filterForm.edit_time_range" type="daterange" placeholder="选择日期范围" ></el-date-picker>
                </el-form-item>
                <el-form-item label="语言：" prop="lang" v-show="!isHide">
                    <el-select v-model="filterForm.lang" clearable placeholder="请选择">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索类型：" prop="name_fields">
                    <el-select v-model="filterForm.name_fields" clearable placeholder="请选择">
                        <el-option label="标题" value="title"></el-option>
                        <el-option label="URL" value="banner_link"></el-option>
                        <el-option label="备注" value="remark"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="0px" prop="name_value">
                    <el-input v-model="filterForm.name_value" placeholder="请填写搜索关键词"></el-input>
                </el-form-item>
                <el-form-item label="平台：" prop="platform" v-show="!isHide">
                    <el-radio-group v-model="filterForm.platform">
                        <el-radio  label="1">WEB</el-radio>
                        <el-radio  label="2">WAP</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>
            <div class="btn-container text-right">
                <el-button type="primary" @click="add" class="text-right" v-if="self.showAction_('admin/category-library-banner/add')">添加Banner分类馆</el-button>
            </div>
            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column  label="显示位置">
                    <template scope="scope">
                        {{ scope.row.type == 1 ? '品类馆大banner' : '品类馆广告位' }}
                    </template>
                </el-table-column>
                <el-table-column  label="图片">
                    <template scope="scope">
                        <div class="img-container">
                            <img :src="scope.row.banner_url" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="banner_link" label="跳转URL"></el-table-column>
                <el-table-column  label="显示">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.is_show == 1, 'el-icon-circle-cross color-danger': scope.row.is_show == 0}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="语言">
                    <template scope="scope">
                        {{ langTexts[scope.row.categoryLibrary.lang] }}
                    </template>
                </el-table-column>
                <el-table-column prop="order" label="排序"></el-table-column>
                <el-table-column label="开始时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.start_time, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.end_time, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="编辑时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.update_time, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button  type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('admin/category-library-banner/info')">编辑</el-button>
                        <el-button  type="danger" size="small" @click="deleteRow(scope.row)" v-if="self.showAction_('admin/category-library-banner/delete')">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-right el-sub-container">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.page" :page-sizes="[10, 20, 50]" :page-size="pagination.page_size" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                dataLoading: false,
                filterForm: {
                    category_library_id: '',
                    type: '',
                    is_show: '',
                    lang: '',
                    start_time: '',
                    end_time: '',
                    edit_time_range: [],
                    name_fields: '',
                    name_value: '',
                    platform: ''
                },
                pagination: {
                    page: 1,
                    page_size: 10,
                    total: 0,
                },
                tableData: [],
                langTexts: {},
                langs: null,
                categoryLibrarys: null,
                isHide: false
            }
        },
        watch: {
            'filterForm.category_library_id': function(val) {
                if(val) {
                    this.isHide = true;
                } else {
                    this.isHide = false;
                }
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.getLangs();
                this.getCategoryLibrarys();
                this.getListData();
            },
            // 获取列表数据
            getListData(page) {
                let params = {};
                if (page) {
                    this.pagination.page = page;
                }
                this.dataLoading = true;
                params = Object.assign({}, this.pagination, this.filterForm);
                if(params.edit_time_range.length === 2) {
                    params.start_time = this.timeZone_(new Date(params.edit_time_range[0]), this.$store.getters.getTimeZone);
                    params.end_time = this.timeZone_(new Date(params.edit_time_range[1]), this.$store.getters.getTimeZone);
                }
                if(params.category_library_id) {
                    delete params.lang;
                    delete params.platform;
                }
                delete params.edit_time_range;
                delete params.total;
                console.log(params)
                this.$http.get('admin/category-library-banner/list', { params: params }).then(res => {
                    this.dataLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        this.pagination.total = 0;
                        return;
                    }
                    // console.log(res.body.data.data)
                    let data = res.body.data.data;
                    this.tableData = data;
                    this.pagination.total = res.body.data.total;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
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
            // 获取绑定品类馆列表
            getCategoryLibrarys() {
                this.$http.get('admin/public/get-category-libraries').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    this.categoryLibrarys = res.body.data;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 改变每页显示数
            changePageSize(value) {
                this.pagination.page_size = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this.pagination.page = value;
                this.getListData();
            },
            // 取消帅选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
            },
            // 添加
            add() {
                this.$router.push({ name: 'site_categoryLibraryBannerAdd' });
            },
            // 编辑
            edit(row) {
                this.$router.push({ name: 'site_categoryLibraryBannerEdit', query: { id: row.id }});
            },
            // 删除
            deleteRow(row) {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('admin/category-library-banner/delete', {
                        id: row.id
                    }).then(res => {
                        if (res.body.code == 0) {
                            this.getListData();
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message.info( '已取消删除');
                });
            }
        }
    }
</script>
<style lang="less">
    .btn-container{
        margin: 20px 0;
    }
    .img-container{
        width: 100px;
        height: 100px;
        position: relative;
        img{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            max-width: 100%;
            max-height: 100%;
        }
    }
</style>
