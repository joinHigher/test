<template>
	<div>
        <div class="el-container" v-loading="isDataLoading">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label="所属平台" prop="platforms">
                    <el-select v-model="option.platforms" clearable>
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
                </el-form-item>
            </el-form>
            <div class="text-right">
                    <el-button type="danger" class="pull-left" :disabled="!multipleSelection.length" @click="removeTopic('multi')">批量删除</el-button>
                    <router-link class="el-button el-button--primary" :to="{path: '/topic/topicEdit', query: { type: 'add' }}">新建专题</router-link>
            </div>

            <div class="el-sub-container">
                <el-table border :data="tableData" ref="multipleTable" @selection-change="selectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="id" label="专题ID"></el-table-column>
                    <el-table-column prop="name" label="专题名称"></el-table-column>
                    <el-table-column label="专题是否启用">
                        <template scope="scope">
                            <div>{{ scope.row.is_end == 1 ? '否' : '是' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="platforms" label="适用平台"></el-table-column>
                    <el-table-column label="专题版块">
                        <template scope="scope">
                            <span v-for="(item, index) in scope.row.positions">
                                <router-link  class="mr10" :to="{path: '/topic/plateGoods?id=' + item.id + '&position_name=' + item.name + '&topic_name=' + scope.row.name}">{{item.name}}</router-link><span v-if="index < scope.row.positions.length - 1">/ </span>
                            </span>
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
	</div>
</template>

<script>

export default {
  	data () {
		return {
            self: this,
            isDataLoading: false,
			tableData: [],
            multipleSelection: [],
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
            this.isDataLoading = true;
            this.$http.get('admin/special/list', {params: this.option}).then(res => {
                this.isDataLoading = false;
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
            let isMulti = id === 'multi';
            let params = isMulti ? {} : { id: id };
            if (isMulti) {
                let arr = [];
                this.multipleSelection.forEach(item => {
                    arr.push(item.id);
                });
                params.ids = arr.join();
            }
            // console.log(params);
            // return;
            this.$confirm('此操作将删除' + (isMulti ? '选中的' + (this.multipleSelection.length + '个') : '该') + '专题, 同时删除专题绑定的板块和商品数据, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                this.isDataLoading = true;
                this.$http.post('admin/special/' + (isMulti ? 'batch-delete' : 'delete'), params).then(res => {
                    this.isDataLoading = false;
                    if (res.body.code == 0) {
                        this.getData();

                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        removeTopicMulti () {
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
        },
        selectionChange(val) {
            this.multipleSelection = val;
        },
	}
}
</script>

<style>
    .mr10{margin-right: 10px;}
</style>

