<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="模块：" prop="article_type">
                    <el-select v-model="filterForm.article_type" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in typeText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语言" prop="lang">
                    <el-select v-model="filterForm.lang" clearable placeholder="请选择">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词" prop="keyword">
                    <el-input v-model="filterForm.keyword" placeholder="输入关键词"></el-input>
                </el-form-item>
                <el-form-item label="选择分类：" prop="cat_id">
                    <el-select v-model="filterForm.cat_id" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in CatText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示：" prop="is_display">
                    <el-select v-model="filterForm.is_display" clearable placeholder="请选择">
                        <el-option label="显示" :value="1" ></el-option>
                        <el-option label="不显示" :value="0" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                    <!-- <el-button type="primary">模板管理</el-button> -->
                    <el-button type="primary"  @click="add" v-if="self.showAction_('blog/article/add')">添加文章</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="title" label="标题名称"></el-table-column>
                <el-table-column prop="article_type" label="板块"></el-table-column>
                <el-table-column prop="virtual_visited_count" label="基础浏览量"></el-table-column>
                <el-table-column prop="visited_count" label="实际浏览量"></el-table-column>
                <el-table-column label="是否显示">
                    <template scope="scope">
                        {{ scope.row.is_display == 1 ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间"></el-table-column>
                <el-table-column prop="create_user" label="创建人"></el-table-column>
                <el-table-column prop="update_time" label="最后修改时间"></el-table-column>
                <el-table-column prop="update_user" label="最后编辑人"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button  type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('blog/article/info')">编辑</el-button>
                        <el-button  type="danger" size="small" @click="deleteBlog(scope.row)" v-if="self.showAction_('blog/article/delete')">删 除</el-button>
                        <input type="text" class="article-url" :id="'articleUrl' + scope.row.id" :value="'http://www.gearbest.com/blog/article/info?id=' + scope.row.id" />
                        <el-button  type="primary" size="small"  @click="copy(scope.row)">复制文章链接</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="text-right el-sub-container">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
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
                    lang: 'en',
                    article_type: '',
                    cat_id: '',
                    keyword: '',
                    is_display: 1
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: [],
                langTexts: {},
                langs: null,
                CatText: {
                    '1': 'Xiaomi Gears',
                    '2': 'Phone & Tablets',
                    '3': 'Computers & Networking',
                    '4': 'Electronics & Tools',
                    '5': 'Home & Garden',
                    '6': 'Sports & Outdoors',
                    '7': 'Entertainment',
                    '8': 'Automotive & Industrial',
                    '9': 'Beauty & Fashion'
                },
                typeText: {
                    '1': 'GB Feature',
                    '2': 'New Gear',
                    '3': 'How To',
                    '4': 'Download',
                    '5': 'Buying Guide'
                }
            }
        },

        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.getLangs();
                this.getListData();
            },
            // 获取列表数据
            getListData(param) {
                let params = {};
                if (typeof param === 'number') {
                    this.pagination.pageNo = param;
                }
                params = Object.assign({}, this.pagination, this.filterForm);
                this.dataLoading = true;
                this.$http.get('blog/article/list', { params: params }).then(res => {
                    this.dataLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        this.pagination.totalCount = 0;
                        return;
                    }
                    let data = res.body.data.data;
                    this.tableData = data;
                    this.pagination.totalCount = res.body.data.total;
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
                this.pagination.pageSize = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this.pagination.pageNo = value;
                this.getListData();
            },
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
            },
            // 添加文章
            add() {
                this.$router.push({ name: 'blogAdd' });
            },
            // 编辑
            edit(row) {
                this.$router.push({ name: 'blogEdit', query: { id: row.id }});
            },
            // 删除
            deleteBlog(row) {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('blog/article/delete', {
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
            // 复制文章链接
            copy(row) {
                let urlElement = document.querySelector(`#articleUrl${row.id}`);
                let currentFocus = document.activeElement;
                urlElement.focus();
                urlElement.setSelectionRange(0, urlElement.value.length);
                document.execCommand('copy', true);
                currentFocus.focus();
                this.$message.success('复制成功！');
            }
        }
    }
</script>
<style lang="less">
.article-url{
    position: absolute;
    top: -10000px;
    left: -10000px;
}
</style>
