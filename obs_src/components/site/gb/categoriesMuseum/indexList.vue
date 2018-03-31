<!-- 首页分类馆 -->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="语言" prop="lang">
                    <el-select v-model="filterForm.lang" clearable placeholder="请选择">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code">
                    <el-select clearable filterable v-model="filterForm.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台" prop="platform">
                    <el-radio-group v-model="filterForm.platform">
                        <el-radio  v-for="(item, key) in platformTexts" :label="key" :key="key">{{item}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>
            <div class="btn-container text-right">
                <el-button type="primary" @click="add" class="text-right" v-if="self.showAction_('admin/category-library/add')">添加首页分类馆</el-button>
            </div>
            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column label="平台">
                    <template scope="scope">
                        {{ platformTexts[scope.row.platform] }}
                    </template>
                </el-table-column>
                <el-table-column  label="是否显示">
                    <template scope="scope">
                        {{ showTexts[scope.row.is_show] }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="标题"></el-table-column>
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
                <el-table-column label="绑定分类" width="300">
                    <template scope="scope">
                        <div class="category-wrap">
                            <p v-for="(item, index) in scope.row.category"><strong>{{ index + 1 }}: </strong>{{ item }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  label="分类馆模板类型">
                    <template scope="scope">
                        {{ categorys[scope.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column prop="order" label="默认排序"></el-table-column>
                <el-table-column prop="sku_current" label="当前生效的SKU"></el-table-column>
                <el-table-column prop="sku_coming" label="即将生效的SKU"></el-table-column>
                <el-table-column label="即将生效开始时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.sku_coming_time, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button  type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('admin/category-library/info')">编辑</el-button>
                        <el-button  type="danger" size="small" @click="deleteRow(scope.row)" v-if="self.showAction_('admin/category-library/delete')">删 除</el-button>
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
                    lang: '',
                    pipeline_code: '',
                    platform: ''
                },
                langs: null,
                categorys: null,
                allCategorys: null,
                langTexts: {},
                showTexts: {
                    '1': '显示',
                    '0': '不显示'
                },
                platformTexts: {
                    '1': 'WEB',
                    '2': 'WAP',
                    '3': 'IOS',
                    '4': 'Android'
                },
                pagination: {
                    page: 1,
                    page_size: 10,
                    total: 0,
                },
                tableData: []
            }
        },
        computed: {
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.dataLoading = true;
                // 使用Promise.all解决异步请求时间差异而导致遍历出错
                Promise.all([this.getAllCategory(), this.getLangs(), this.getCategorys()]).then(() => {
                    this.getListData();
                });
            },
            // 获取列表数据
            getListData(page) {
                let params = {};
                if (page) {
                    this.pagination.page = page;
                }
                this.dataLoading = true;
                params = Object.assign({}, this.pagination, this.filterForm);
                delete params.total;
                this.$http.get('admin/category-library/list', { params: params }).then(res => {
                    this.dataLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        this.pagination.total = 0;
                        return;
                    }
                    // console.log(res.body.data.data)
                    let data = res.body.data.data;
                    data.forEach((item) => {
                        if(item.sku_info && item.sku_info !== 'undefined') {
                            let sku_info = JSON.parse(item.sku_info);
                            item.sku_current = sku_info.now ? sku_info.now.sku : '';
                            item.sku_coming = sku_info.coming ? sku_info.coming.sku : '';
                            item.sku_coming_time = sku_info.coming ? sku_info.coming.start_time : '';
                        } else {
                            item.sku_current = '';
                            item.sku_coming = '';
                            item.sku_coming_time = '';
                        }
                        if(item.cat_ids) {
                            let category = [];
                            item.cat_ids.split(',').forEach((index) => {
                                if(this.allCategorys && this.allCategorys.hasOwnProperty(index)){
                                    category.push(this.allCategorys[index].name);
                                }
                            });
                            //item.category = category.join('，');
                            item.category = category;
                        } else {
                            item.category = '';
                        }
                    });

                    this.tableData = data;
                    this.pagination.total = res.body.data.total;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
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
            // 获取所有绑定分类数据
            getAllCategory() {
                return this.$http.get('seo/public/category-all').then(res => {
                    if (res.body.code !== 0) {
                        return Promise.reject();
                    }
                    // console.log(res.body.data);
                    this.allCategorys = res.body.data;
                    return Promise.resolve();
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                    return Promise.reject();
                });
            },
            // 获取语言列表
            getLangs() {
                return this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code !== 0) {
                        return Promise.reject();
                    }
                    // console.log(res.body.data);
                    this.langs = res.body.data;
                    let langTexts = {};
                    res.body.data.forEach((item) => {
                        langTexts[item.language_en] = item.language_ch;
                    });
                    this.langTexts = Object.assign({}, this.langTexts, langTexts);
                    return Promise.resolve();
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                    return Promise.reject();
                });
            },
            // 取消帅选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
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
            // 编辑
            edit(row) {
                this.$router.push({ name: 'site_categoryLibraryEdit', query: { id: row.id }});
            },
            // 删除
            deleteRow(row) {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('admin/category-library/delete', {
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
            },
            // 添加
            add() {
                this.$router.push({ name: 'site_categoryLibraryAdd' });
            }
        }
    }
</script>
<style lang="less" scoped>
    .btn-container{
        margin: 20px 0;
    }
    .category-wrap{
        margin: 5px 0;
        width: 270px;
        max-height: 200px;
        overflow: auto;
    }
</style>
