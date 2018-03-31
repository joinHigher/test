<template>
	<div>
        <el-form inline :model="option" class="el-container" label-width="80px" ref="searchForm">
            <el-form-item label="处理状态" prop="status">
                <el-select v-model="option.status">
                    <el-option label="已处理" value="1"></el-option>
                    <el-option label="未处理" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="sku" prop="goods_sn">
                <el-input v-model="option.goods_sn"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="option.email"></el-input>
            </el-form-item>
            <div>
                <el-form-item label="添加时间" class="date-item" prop="create_time">
                    <el-date-picker v-model="option.create_time" type="datetimerange" :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="处理时间" class="date-item" prop="update_time">
                    <el-date-picker v-model="option.update_time" type="datetimerange" :editable="false"></el-date-picker>
                </el-form-item>
            </div>
            <div class="text-right">
                <el-button type="primary" @click="getData('search')">筛选</el-button>
                <el-button type="danger" @click="resetForm">清空</el-button>
            </div>
        </el-form>
        <div class="el-container">
            <el-table :data="tableData" border>
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="goods_sn" label="SKU"></el-table-column>
                <el-table-column prop="email" label="邮箱地址"></el-table-column>
                <el-table-column prop="url" label="URL链接"></el-table-column>
                <el-table-column prop="remark" label="NOTE简介"></el-table-column>
                <el-table-column label="添加时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="处理时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.process_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template scope="scope" v-if="self.showAction_('admin/parity/process')">
                        <span v-if="scope.row.status == '1'"><el-button type="success" size="small">已处理</el-button></span>
                        <span v-else><el-button v-loading="handleLoading" :disabled="handleLoading" type="danger" size="small" @click="handle(scope.row.id, scope.row)">未处理</el-button></span>
                    </template>
				</el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
	</div>
</template>

<script>

export default {
  	data () {
		return {
            self: this,
            handleLoading: false,
			tableData: [],
            option: {
                goods_sn: '',
                email: '',
                status: '',
                create_time_from: '',
                create_time_to: '',
                update_time_from: '',
                update_time_to: '',
                page: 1,
                page_size: 20,
                create_time: [],
                update_time: []
            },
            total: 20,
		};
  	},
	created () {
        this.initData();
	},
	methods: {
        initData () {
            this.getData();
        },
        getData (search) {
            if (search === 'search') {
                this.option.page = 1;
                this.option.page_size = 20;
            }
            let timeArr1 = this.timeZone_(this.option.create_time, this.$store.getters.getTimeZone);
            this.option.create_time_from = timeArr1[0];
            this.option.create_time_to = timeArr1[1];

            let timeArr2 = this.timeZone_(this.option.update_time, this.$store.getters.getTimeZone);
            this.option.process_time_from = timeArr2[0];
            this.option.process_time_to = timeArr2[1];

            let params = {}; 
            for (let i in this.option) {
                if (i !== 'create_time' && i !== 'update_time') {
                    params[i] = this.option[i];
                }
            }

            this.$http.get('admin/parity/list', {params: params}).then(res => {
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
        handle (id, row) {
            this.handleLoading = true;
            this.$http.post('admin/parity/process', {id: id * 1}).then(res => {
                this.handleLoading = false;
                if (res.body.code == 0) {
                    var index = this.tableData.indexOf(row);

                    this.tableData[index].status = '1';
                    this.tableData[index].process_time = res.body.data.process_time;
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    })
                }
            }).catch(err => {
                this.handleLoading = false;
            }) 
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.option.create_time_from = '';
            this.option.create_time_to = '';
            this.process_time_from = '';
            this.process_time_to = '';
        },
	}
}
</script>
<style>
    .el-form--inline .date-item{width: 450px;}
</style>
