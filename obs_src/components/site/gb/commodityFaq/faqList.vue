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
                <el-form-item label="类别" prop="type">
                    <el-select v-model="filterForm.type" clearable placeholder="全部">
                        <el-option v-for="(value, key) in typeText" :label="value" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类" prop="cat_id">
                    <el-select v-model="filterForm.cat_id" clearable filterable  placeholder="所有分类">
                        <el-option v-for="(value, key) in categorys" :label="value.name" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="sku" prop="sku">
                    <el-input v-model="filterForm.sku" clearable placeholder="请输入sku"></el-input>
                </el-form-item>
                <el-form-item label="显示状态" prop="is_show">
                    <el-select v-model="filterForm.is_show" clearable placeholder="全部">
                        <el-option v-for="(value, key) in showText" :label="value" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词" prop="name">
                    <el-input v-model="filterForm.name" clearable placeholder="请输入关键词"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>

            <div class="operate-btn">
                <el-button :plain="true" :disabled="isShowOperateBtn" @click="batchDelete($event)" v-if="self.showAction_('admin/goods-faq/delete')">批量删除</el-button>
                <el-button :plain="true" :disabled="isShowOperateBtn" @click="batchShowStatus(1)" v-if="self.showAction_('admin/goods-faq/batch-show')">批量显示</el-button>
                <el-button :plain="true" :disabled="isShowOperateBtn" @click="batchShowStatus(0)" v-if="self.showAction_('admin/goods-faq/batch-show')">批量不显示</el-button>
                <el-button type="primary" @click="addFaq" class="text-right" v-if="self.showAction_('admin/goods-faq/add')">添加FAQ</el-button>
            </div>

            <el-table :data="tableData" border ref="table" @selection-change="handleSelectionChange" v-loading="dataLoading">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="type" label="类型" width="100">
                    <template scope="scope">
                        {{ typeText[scope.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column label="语言" width="100">
                    <template scope="scope">
                        {{ langTexts[scope.row.lang] }}
                    </template>
                </el-table-column>
                <el-table-column label="渠道" width="100">
                    <template scope="scope">
                        <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="skus" label="sku"></el-table-column>
                <el-table-column label="分类">
                    <template scope="scope">
                        {{ transformCat(scope.row.cat_ids) }}
                    </template>
                </el-table-column>
                <el-table-column label="问题">
                    <template scope="scope">
                        <template v-for="(item, index) in scope.row.content">
                            <p>问题{{index + 1}}：{{item.question}}</p>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="显示" width="80">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.is_show == 1, 'el-icon-circle-cross color-danger': scope.row.is_show == 0}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="最后修改时间" width="170">
                    <template scope="scope">
                        {{ timeZone_(scope.row.update_time, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="138">
                    <template scope="scope">
                        <el-button  type="primary" size="small" @click="editFaq(scope.row)" v-if="self.showAction_('admin/goods-faq/info')">编辑</el-button>
                        <el-button  type="danger" size="small" @click="batchDelete($event,scope.row)" v-if="self.showAction_('admin/goods-faq/delete')">删 除</el-button>
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
                typeText: {
                    '1': '分类',
                    '2': '商品'
                },
                showText: {
                    '1': '显示',
                    '0': '不显示'
                },
                filterForm: {
                    is_show: '',
                    lang: '',
                    pipeline_code: '',
                    type: '',
                    sku: '',
                    cat_id: '',
                    name: ''
                },
                pagination: {
                    page: 1,
                    page_size: 10,
                    total: 0,
                },
                tableData: null,
                categorys: null,
                langs: null,
                langTexts: {},
                multipleSelection: []
            }
        },
        computed: {
            isShowOperateBtn: function () {
                return this.multipleSelection.length > 0 ? false : true;
            },
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.getAllCategory();
                this.getListData();
                this.getLangs();
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
                this.$http.get('admin/goods-faq/list', { params: params }).then(res => {
                    this.dataLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        this.pagination.total = 0;
                        return;
                    }
                    let data = res.body.data.data;
                    data.forEach((item) => {
                        item.content = JSON.parse(item.content);
                    });
                    this.tableData = data;
                    this.pagination.total = res.body.data.total;
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
                    // console.log(res.body.data);
                    this.categorys = res.body.data;
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
            // 改变每页显示数
            changePageSize(value) {
                this.pagination.page = 1;
                this.pagination.page_size = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this.pagination.page = value;
                this.getListData();
            },
            // 编辑FAQ
            editFaq(row) {
                this.$router.push({ name: 'site_commodityFaqEdit', query: { id: row.id }});
            },
            // 添加FAQ
            addFaq() {
                this.$router.push({ name: 'site_commodityFaqAdd' });
            },
            // Faq Item选项发生变化
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // cat_ids转化函数
            transformCat(catIds) {
                let categorys = [];
                catIds.split(',').forEach((item) => {
                    if(this.categorys && this.categorys[item]) {
                        categorys.push(this.categorys[item].name);
                    }
                });
                return categorys.join(',');
            },
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
            },
            // 批量删除
            batchDelete(event, row) {
                let ids;
                if(row) {
                    ids =  row.id;
                } else {
                    let arr = [];
                    this.multipleSelection.forEach((item) => {
                        arr.push(item.id);
                    });
                    if(arr.length === 0) { return; }
                    ids = arr.join(',');
                }
                // console.log(ids)
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('admin/goods-faq/delete', {
                        ids: ids
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
            // 批量显示/批量不显示
            batchShowStatus(isShow) {
                let arr = [];
                this.multipleSelection.forEach((item) => {
                    arr.push(item.id);
                });
                if(arr.length === 0) { return; }
                let ids = arr.join(',');
                this.$confirm('确认' + (isShow === 1 ? '批量显示？' : '批量不显示？'), '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('admin/goods-faq/batch-show', {
                        ids: ids,
                        is_show: isShow
                    }).then(res => {
                        if (res.body.code == 0) {
                            this.getListData();
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message.info( '已取消');
                });
            }
        }
    }
</script>
<style>
    .operate-btn{
        margin: 20px 0;
    }
</style>
