<template>
	<div>
        <el-breadcrumb separator="/" class="el-container top">
            <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/topic/topicList'}">专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="el-container">
            <el-form inline label-width="100px" :model="option" ref="searchForm">
                <el-form-item label="所属平台" prop="platforms">
                    <el-select v-model="option.platforms">
                        <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专题名称" prop="name">
                    <el-input v-model="option.name"></el-input>
                </el-form-item>
                <el-form-item label="最后操作人" prop="update_user">
                    <el-input v-model="option.update_user"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="render">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                    <router-link class="el-button el-button--primary" :to="{path: '/topic/topicAdd'}">新建专题</router-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="el-container">
            <el-table border :data="tableData">
                <el-table-column prop="id" label="专题ID"></el-table-column>
                <el-table-column prop="name" label="专题名称"></el-table-column>
                <el-table-column prop="platforms" label="适用平台"></el-table-column>
                <el-table-column label="专题版块">
                    <template scope="scope">
                        <template v-for="(item, index) in scope.row.positions">
                            <router-link  class="mr10" :to="{path: '/topic/plateGoods?id=' + item.id + '&position_name=' + item.name + '&topic_name=' + scope.row.name}">{{item.name}}</router-link>/
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="memo" label="备注"></el-table-column>
                <el-table-column prop="update_user" label="最后操作人"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <a class="el-button el-button--primary el-button--small" :href="scope.row.url" target="_blank">预览</a>
                        <router-link class="el-button el-button--primary el-button--small" :to="{path: '/topic/topicEdit?id=' + scope.row.id}">编辑</router-link>
                        <el-button size="small" type="danger" @click="removeTopic(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
	</div>
</template>

<script>

export default {
  	data () {
		return {
			tableData: [],
            option: {
                id: '',
                name: '',
                platforms: '',
                update_user: ''
            },
            platforms: []
		};
  	},
	created () {
        this.initData();
	},
	methods: {
		initData () {
            this.getplat();
            this.getData();
        },
        getData () {
            this.$http.get('admin/special/list', {params: this.option}).then(res => {
                this.tableData = res.body.data;
            })
        },
        getplat () {
            this.$http.get('admin/public/platforms').then(res => {
                this.platforms = res.body.data;
            });
        },
        render () {
            this.getData();
        },
        removeTopic (id) {
            var self = this;

            self.$confirm('此操作将删除该专题, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                self.$http.post('admin/special/delete', {id: id}).then(res => {
                    if (res.body.code == 0) {
                        this.getData();

                        self.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        self.$message.error(res.body.message);
                    }
                })
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
        }
	}
}
</script>

<style>
    .mr10{margin-right: 10px;}
</style>

