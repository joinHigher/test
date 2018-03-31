<style>
</style>
<template>
	<div>
        <el-breadcrumb separator="/" class="el-container top">
            <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/personal/comparePrice'}">资讯与询价</el-breadcrumb-item>
            <el-breadcrumb-item>批发询价</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="el-container">
            <el-form inline :model="option" label-width="100px" ref="searchForm">
                <div>
                    <el-form-item label="快速搜索" prop="value">
                        <el-input v-model="option.value" class="quick-search" placeholder="输入关键词">
                            <el-select v-model="option.fields" slot="prepend" placeholder="请选择">
                                <el-option label="商品标题" value="goods_sn"></el-option>
                                <el-option label="姓名" value="name"></el-option>
                                <el-option label="国家/州" value="country"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </div>
                <div class="text-right">
                    <el-button type="primary" @click="getData">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="text-left el-sub-container">
                <el-button type="danger" :disabled="checkedRow.length === 0" @click="remove">删除选择项</el-button>
            </div>
            <el-table :data="tableData" border @selection-change="changeRow" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="goods_title" label="商品标题"></el-table-column>
                <el-table-column prop="price" label="目标价格"></el-table-column>
                <el-table-column prop="quantity" label="批发数量"></el-table-column>
                <el-table-column prop="message" label="详情"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="country" label="国家/州"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="company_name" label="公司"></el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="1" :page-sizes="[20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
	</div>
</template>

<script>

export default {
  	data () {
		return {
            self: this,
            tableData: [],
            option: {
                page: 1,
                page_size: 20,
                fields: '',
                value: ''
            },
            total: 10,
            checkedRow: [],
		};
  	},
	created () {
        this.getData();
	},
	methods: {
        getData () {
            if ((this.option.fields && !this.option.value) || (!this.option.fields && this.option.value)) {
                this.$message.warning('关键字必须匹配类型');
                return;
            }
            this.$http.get('admin/inquiry/list', {params: this.option}).then(res => {
                this.tableData = res.body.data.data;
                this.total = res.body.data.total * 1;
            })
        },
        changePageSize (size) {
            this.option.page_size = size * 1;
            this.getData();
        },
        changePage (page) {
            this.option.page = page * 1;
            this.getData();
        },
        remove () {
            this.$confirm('是否删除选择项?', '提示', {
                type: 'warning'
            }).then(() => {
                let str = [];
                this.checkedRow.forEach(item => {
                    str.push(item.id);
                });
                this.$http.post('admin/inquiry/delete', {ids: str.join(',')}).then(res => {
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
        resetForm () {
            this.$refs['searchForm'].resetFields();
        },
        changeRow (val) {
            this.checkedRow = val;
        },
        clickRow (row, event, col) {
            this.$refs.dataTable.toggleRowSelection(row);
        },
	}
}
</script>

