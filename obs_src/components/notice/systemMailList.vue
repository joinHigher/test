<template>
	<div>
        <el-breadcrumb separator="/" class="el-container top">
            <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/notice/siteMailList'}">通知管理</el-breadcrumb-item>
            <el-breadcrumb-item>系统邮件</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <router-link :to="{name: 'notice_systemMailAdd'}" class="el-button el-button--primary">新建模板</router-link>
            </div>
            <el-table :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="uuqid" label="唯一识别码"></el-table-column>
                <el-table-column prop="memo" label="中文备注"></el-table-column>
                <el-table-column prop="from" label="发件箱地址"></el-table-column>
                <el-table-column prop="subject" label="主题"></el-table-column>
                <el-table-column label="触发频率">
                    <template scope="scope">
                        暂无数据
                    </template>
                </el-table-column>
                <el-table-column label="最后修改时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.update_date, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="启用状态">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.is_using == '1', 'el-icon-circle-cross color-danger': scope.row.is_using == '0'}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <router-link :to="{name: 'notice_systemMailEdit', query: {id: scope.row.id}}" class="el-button el-button--primary el-button--small">编辑</router-link>
                        <el-button @click="delConfirm(scope.row)" type="danger" size="small">删除</el-button>
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
            self: this,
            tableLoading: false,
			form: {
                lang: '',
                updatetime: ''
			},
			tableData: []
		};
  	},
	created () {
		this.render()
	},
	methods: {
		render () {
            this.tableLoading = true;
			this.$http.get('admin/mail-template/list').then(res => {
                this.tableLoading = false;
                
                if (res.body.code === 0) {
                   this.tableData =res.body.data; 
                }
            })
		},
		handleSizeChange (val) {
			this.pager.size = val;
		},
		handleCurrentChange (val) {
			this.pager.current = val;
		},
		delConfirm (row) {
	         this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/mail-template/delete', {id: row.id}).then(res => {
                    if (res.body.code === 0) {
                        var index = this.tableData.indexOf(row);
                        this.tableData.splice(index, 1);
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
		}
	}
}
</script>

<style>

</style>
