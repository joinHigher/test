<template>
    <div class="model-info-list">
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <el-form-item label="所属分类" prop="cat_id" class="cat-select">
                    <el-select v-model="option.cat_id" filterable clearable>
                        <el-option v-for="item in categories" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="render">筛选</el-button>
                    <router-link v-if="self.showAction_('admin/category-model-info/add')" :to="'/admin/category-model-info/edit?id=0'" class="el-button el-button--primary">新增
                    </router-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="el-container">
            <el-row>
            </el-row>
            <el-table :border="true" :data="tableData" allow-no-selection v-loading="loading">
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="category" label="分类id"></el-table-column>
                <el-table-column prop="type" label="模特类型"></el-table-column>
                <el-table-column inline-template label="模特图片">
                    <img :src="row.image" width="120" height="90">
                </el-table-column>
                <el-table-column label="更新时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column inline-template label="操作">
                    <div>
                        <router-link v-if="self.showAction_('admin/category-model-info/info')" :to="'/admin/category-model-info/edit?id='+row.id" class="el-button el-button--small el-button--primary">编辑
                        </router-link>
                        <el-button v-if="self.showAction_('admin/category-model-info/delete')" size="small" type="danger" @click.native.prevent="removeRow(row)">删除
                        </el-button>
                    </div>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            self: this,
            tableData: [],
            searchForm: {},
            option: {
                cat_id: null,
                page: 1,
                size: 150,
            },
            loading: true,
            categories: [],
            textValue: ''
        };
    },
    created() {
        this.initData();
    },
    methods: {
        initData() {
            this.getCategories().then(() => {
                this.getData();
            });
        },
        getCategories() {
            return this.$http.get('admin/public/category-all', {}).then(res => {
                if (res.body.code === 0) {
                    this.categories = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData() {
            this.$http.get('admin/category-model-info/list', { params: this.option }).then(res => {
                if (res.body.code > 0
                ) {
                    this.$message.error(res.body.message);
                }
                else {
                    this.tableData = res.body.data.data.map((item, index, input) => {
                        let temp = item;
                        let site = this.$store.getters.getSite;

                        temp.image = this.$store.getters.getUploadUrl.reviewUrl[site] + '/' + temp.image;
                        temp.category = item.cat_ids.split(',').map((cat_id) => this.categories[cat_id] ? this.categories[cat_id]['name'] : '未知分类'
                        ).join(',');
                        return temp;

                    });
                }
                this.loading = false;
            });
        },
        removeRow(item) {
            this.$confirm('确定要删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/category-model-info/delete', { id: item.id }).then(res => {
                    if (res.body.code > 0
                    ) {
                        this.$message.error(res.body.message);
                    }
                    else {
                        let index = this.tableData.indexOf(item);
                        if (index !== -1) {
                            this.tableData.splice(index, 1)
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        render() {
            this.loading = true;
            this.getData();
        },
    },
}
</script>
<style lang="less">
    .model-info-list {
        .el-form-item__content {
            width: 400px;
        }
    }
</style>

