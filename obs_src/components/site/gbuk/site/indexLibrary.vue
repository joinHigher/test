<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆管理</el-breadcrumb-item>
                <el-breadcrumb-item>首页分类馆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-form :model="option"  label-width="120px" ref="searchForm" inline>
                <el-form-item label="语言" prop="">
                    <el-select v-model="option.lang">
                        <el-option v-for="(item, index) in langOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="text-right">
                <el-button type="primary" @click="getData">筛选</el-button>
                <el-button type="primary" @click="add">新增分类馆</el-button>
            </div>    
        </div>
        <div class="el-container">
            <el-table :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="标题"></el-table-column>
                <el-table-column prop="cat_ids" label="绑定分类"></el-table-column>
                <el-table-column label="语言">
                    <template scope="scope">
                        {{langOpt[scope.row.lang]}}
                    </template>
                </el-table-column>
                <el-table-column label="分类馆模板类型">
                    <template scope="scope">
                        {{typeOpt[scope.row.type]}}
                    </template>
                </el-table-column>
                <el-table-column prop="order" label="默认排序"></el-table-column>
                <el-table-column label="当前生效的特殊商品">
                    <template scope="scope">
                        {{scope.row.sku_info.now.sku}}
                    </template>
                </el-table-column>
                <el-table-column label="即将生效的特殊商品">
                    <template scope="scope">
                        {{scope.row.sku_info.coming.sku}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="1" :page-sizes="[10, 20, 50]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            option: {
                lang: 'en',
                page: 1,
                size: 20
            },
            tableData: [],
            tableLoading: false,
            total: 10,
            langOpt: {},
            typeOpt: {}
        };

    },
    created () {
        this.getOpt();
    },
    methods: {
        getOpt () {
            this.$http.get('base/language/options').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data.code;
                }
            });

            this.$http.get('admin/category-library/options').then(res => {
                if (res.body.code === 0) {
                    this.typeOpt = res.body.data;
                    this.getData();
                }
            });
        },
        getData () {
            this.tableLoading = true;
            this.$http.get('admin/category-library/list', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data.data;
                    data.map(item => {
                        if (item.sku_info) {
                            item.sku_info = JSON.parse(item.sku_info);
                        } else {
                            item.sku_info = {
                                now: {
                                    sku: ''
                                },
                                coming: {
                                    sku: ''
                                }
                            }
                        }
                        item.trends = JSON.parse(item.trends);
                    });
                    this.tableData = data;
                    this.total = res.body.data.total;
                }
            })
        },
        edit (row) {
            this.$router.push({
                name: 'site_addLibrary',
                query: {
                    id: row.id
                }
            });
        },
        remove (row) {
            this.$confirm('是否删除该项?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/category-library/delete', {id: row.id}).then(res => {
                    if (res.body.code == 0) {
                        this.getData();
                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除!'
                });          
            });
        },
        add () {
            this.$router.push({
                name: 'site_addLibrary'
            })
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.size = val;
            this.getData();
        }
    }
}
</script>
<style>

</style>
