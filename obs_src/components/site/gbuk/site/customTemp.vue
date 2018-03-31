<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <el-button type="primary" @click="add">模板添加</el-button>
            </div>
            <el-table :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="主题"></el-table-column>
                <el-table-column label="最后修改时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small">编辑</el-button>
                        <el-button type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
            tableData: [],
            tableLoading: false,
            option: {
                lang: 'en'
            }
        };

    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.tableLoading = true;
            this.$http.get('admin/general-widget/list', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.tableData = res.body.data.data;
                }
            })
        },
        add () {
            this.$router.push({
                name: 'site_addCustomTemp'
            })
        }
    }
}
</script>
<style>

</style>
