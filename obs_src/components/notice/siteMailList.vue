<template>
	<div>
        <el-breadcrumb separator="/" class="el-container top">
            <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/notice/siteMailList'}">通知管理</el-breadcrumb-item>
            <el-breadcrumb-item>站内信</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="el-container">
            <div class="text-right el-sub-container">
                <router-link :to="{name: 'notice_siteMailAdd'}" class="el-button el-button--primary">新建信息</router-link>
            </div>
            <el-table :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column label="发送时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.send_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="typeName" label="类型"></el-table-column>
                <el-table-column prop="uuqidName" label="唯一识别码"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <router-link :to="{name: 'notice_siteMailEdit', query: {id: scope.row.id}}" class="el-button el-button--primary el-button--small">编辑</router-link>
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
			option: {
                country: '',
				platform: '',
                senttime: '',
                page: '',
                page_size: 20
			},
            total: 20,
			tableData: [],
            uuqidList: {},
            typeList: {
                '0': '系统消息',
                '1': '管理员通知'
            }
		};
  	},
	created () {
		this.getUuqid();
	},
	methods: {
        getUuqid () {
            this.$http.get('admin/message-template/get-uuqids').then(res => {
                if (res.body.code === 0) {
                    this.uuqidList = res.body.data;
                    this.render();
                }
            });
        },
		render () {
            this.tableLoading = true;
			this.$http.get('admin/message-template/list').then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    var data = res.body.data;
                    for (var i in data) {
                        var item = data[i];
                        item.uuqidName = this.uuqidList[item.uuqid];
                        item.typeName = this.typeList[item.type];
                    }

                    this.tableData = data;
                }
			});
		},
		changePageSize (val) {
			this.option.page_size = val;
            this.render();
		},
		changePage (val) {
			this.option.page = val;
            this.render();
		},
		delConfirm (row) {
			this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
				type: 'warning'
			}).then(() => {
                this.$http.post('admin/message-template/delete', {id: row.id}).then(res => {
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
