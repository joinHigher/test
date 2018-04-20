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
            <el-form :model="option"  label-width="120px" ref="searchForm" inline>
                <el-form-item label="绑定分类馆" prop="">
                    <el-select v-model="option.cat" placeholder="请选择">
                        <el-option value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示位置" prop="">
                    <el-select v-model="option.cat" placeholder="请选择">
                        <el-option value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示" prop="">
                    <el-select v-model="option.cat" placeholder="请选择">
                        <el-option value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>    
        </div>
        <div class="el-container">
            <el-table :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="order" label="ID"></el-table-column>
                <el-table-column prop="order" label="标题"></el-table-column>
                <el-table-column prop="order" label="绑定分类"></el-table-column>
                <el-table-column prop="order" label="语言"></el-table-column>
                <el-table-column prop="order" label="分类馆模板类型"></el-table-column>
                <el-table-column prop="order" label="默认排序"></el-table-column>
                <el-table-column prop="order" label="当前生效的特殊商品"></el-table-column>
                <el-table-column prop="order" label="即将生效的特殊商品"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
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
            option: {
                cat: '',
            }
        };

    },
    created () {

    },
    methods: {
        edit () {

        },
        remove () {

        }
    }
}
</script>
<style>

</style>
