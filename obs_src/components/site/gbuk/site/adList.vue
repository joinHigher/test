<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>广告位管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-form :model="option"  label-width="120px" ref="searchForm" inline>
                <div>
                    <el-form-item label="快速搜索" prop="name_value">
                        <el-input v-model="option.name_value" class="quick-search">
                            <el-select v-model="option.name_fields" slot="prepend" placeholder="请选择">
                                <el-option label="标题" value="title"></el-option>
                                <el-option label="URL" value="image_link"></el-option>
                                <el-option label="备注" value="remark"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item label="平台" prop="category_library_id">
                    <el-select v-model="option.category_library_id" placeholder="请选择">
                        <el-option v-for="item in libraryOpt" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示位置" prop="type">
                    <el-select v-model="option.type" placeholder="请选择">
                        <el-option v-for="(item, index) in typeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示" prop="is_show">
                    <el-select v-model="option.is_show" placeholder="请选择">
                        <el-option value="1" label="是"></el-option>
                        <el-option value="0" label="否"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语言" prop="is_show">
                    <el-select v-model="option.is_show" placeholder="请选择">
                        <el-option value="1" label="是"></el-option>
                        <el-option value="0" label="否"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类列表" prop="is_show">
                    <el-select v-model="option.is_show" placeholder="请选择">
                        <el-option value="1" label="是"></el-option>
                        <el-option value="0" label="否"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="时间搜索" prop="time_fields">
                        <el-select v-model="option.time_fields">
                            <el-option value="start_time" label="开始时间"></el-option>
                            <el-option value="end_time" label="结束时间"></el-option>
                            <el-option value="update_time" label="更新时间"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="time_value">
                        <el-date-picker v-model="option.time_value" type="datetimerange" :editable="false"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="text-right">
                    <el-button type="primary" @click="getData">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                    <el-button type="primary" @click="add">新增banner</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <el-table :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="type" label="显示位置"></el-table-column>
                <el-table-column label="图片">
                    <template scope="scope">
                        <img :src="scope.row.image_link">
                    </template>
                </el-table-column>
                <el-table-column prop="image_link" label="跳转URL"></el-table-column>
                <el-table-column prop="order" label="显示"></el-table-column>
                <el-table-column prop="lang" label="语言"></el-table-column>
                <el-table-column prop="order" label="排序"></el-table-column>
                <el-table-column label="开始时间">
                    <template scope="scope">
                         {{self.timeZone_(scope.row.start_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template scope="scope">
                         {{self.timeZone_(scope.row.end_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="编辑时间">
                    <template scope="scope">
                         {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="1" :page-sizes="[10, 20, 50]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            option: {
                lang: 'en',
                page: 1,
                size: 20,
                category_library_id: '',
                type: '',
                editDate: [],
                is_show: '',
                name_value: '',
                name_fields: '',
                time_value: '',
                time_fields: ''
            },
            tableData: [],
            tableLoading: false,
            total: 10,
            libraryOpt: [],
            typeOpt: {},
        };

    },
    created () {
        this.getOpt();
        this.getData();
    },
    methods: {
        getOpt () {
            this.$http.get('admin/category-library-banner/get-category-libraries', {params: {lang: this.option.lang}}).then(res => {
                if (res.body.code === 0) {
                    this.libraryOpt = res.body.data;
                }
            });

            this.$http.get('admin/public/category-library-banner-options', {params: {lang: this.option.lang}}).then(res => {
                if (res.body.code === 0) {
                    this.typeOpt = res.body.data;
                }
            });
        },
        getData () {
            this.tableLoading = true;
            this.$http.get('admin/category-library-banner/list', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.tableData = res.body.data.data;
                    this.total = res.body.data.total;
                }
            })
        },
        add () {
            this.$router.push({
                name: 'site_addLibraryBanner'
            });
        },
        edit (row) {
            this.$router.push({
                name: 'site_addLibraryBanner',
                query: {
                    id: row.id
                }
            });
        },
        remove (row) {
            this.$confirm('是否删除该项?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/category-library-banner/delete', {id: row.id}).then(res => {
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
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.size = val;
            this.getData();
        },
        resetForm () {
            this.$refs.searchForm.resetFields();
            this.option.name_fields = '';
        }
    }
}
</script>
<style>

</style>
