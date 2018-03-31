<template>
    <div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <router-link v-if="self.showAction_('admin/category-model-info/add')" :to="'/admin/goods-description/edit?id=0'" class="el-button el-button--primary">新增</router-link>
            </div>
            <el-table :border="true" :data="tableData" allow-no-selection v-loading="loading">
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="title" label="title"></el-table-column>
                <el-table-column label="描述">
                    <template scope="scope">
                        <span v-html="scope.row.description"></span>
                    </template>
                </el-table-column>
                <el-table-column inline-template label="操作">
                    <div>
                        <router-link v-if="self.showAction_('admin/category-model-info/info')" :to="'/admin/goods-description/edit?id='+row.id" class="el-button el-button--small el-button--primary">编辑 </router-link>
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
    data () {
        return {
            self: this,
            loading: true,
            tableData: []
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getData();
        },
        getData () {
            this.$http.get('admin/goods-description/list').then(res => {
                if (res.body.code > 0) {
                    this.$message.error(res.body.message);
                } else {
                    this.tableData = res.body.data.data;
                }
                this.loading = false;
            });
        },
        removeRow (item) {
            this.$confirm('确定要删除?', '提示', {
              type: 'warning'
            }).then(() => {
                this.$http.post('admin/goods-description/delete', {id: item.id}).then(res => {
                    if (res.body.code > 0) {
                        this.$message.error(res.body.message);
                        } else {
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
        render () {
            this.loading = true;
            this.getData();
        }
    }
}
</script>
