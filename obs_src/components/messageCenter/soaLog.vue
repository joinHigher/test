<template>
	<div class="messagesSent">
		<div class="el-container">
			<el-form :inline="true" :model="params" ref="filter">
				<el-form-item label="操作人名称 : " prop="operator">
					<el-select v-model="params.operator" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in addList" :key="item.value" :label="item.username" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模块 : " prop="module">
					<el-select v-model="params.module" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in moduleType" :key="index" :label="item" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型 : " prop="type">
					<el-select v-model="params.type" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in soaType" :key="index" :label="item" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="日期" prop="date1">
					<el-date-picker v-model="params.date1" type="datetimerange" placeholder="选择开始时间" :editable="false"></el-date-picker>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-button type="primary" icon="search" @click="filtrate">查询</el-button>
				<el-button type="danger" icon="close" @click="resetFilter">重置</el-button>
			</el-row>
			<el-table ref="multipleTable" :data="messList" border tooltip-effect="dark" v-loading="tableLoading" style="width: 100%" fit :default-sort="{prop: 'date', order: 'descending'}">
				<el-table-column prop="module" label="模块">
				</el-table-column>
				<el-table-column prop="op_content" label="操作内容">
				</el-table-column>
				<el-table-column prop="ip" label="登陆IP">
				</el-table-column>
				<el-table-column prop="operator_name" label="操作人">
				</el-table-column>
				<el-table-column prop="op_type" label="操作类型">
				</el-table-column>
				<el-table-column label="操作时间">
					<template scope="scope">
						{{self.timeZone_(scope.row.op_time, self.$store.getters.getTimeZone)}}
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50]" :page-size="params.page_size" :current-page="params.page" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 弹窗S -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				self: this,
				total: 1,
				messList: [],
				addList: [],
				params: {
					page: 1,
					page_size: 10,
					module: '',
					date1: '',
					type: '',
					operator: ''
				},
				moduleType: {
					'1': '商品',
					'2': '物流',
					'3': '营销',
					'4': '订单',
					'5': '支付',
					'6': '消息',
					'7': 'UC',
					'8': '优惠',
					'9': '价格',
					'10': 'coupon',
					'11': '活动',
					'12': '库存',
					'13': '会员',
				},
				soaType: {
					'1': '新增',
					'2': '修改',
					'3': '删除',
					'4': '登录',
					'5': '登出'
				}
			}
		},

		created() {
			this.getBrandList();
			this.addContactList()
		},

		methods: {
			getBrandList() {
				var timeArr = this.timeZone_(this.params.date1, this.$store.getters.getTimeZone);
				if(Array.isArray(timeArr) && timeArr.length >= 2) {
					this.params.startTime = timeArr[0];
					this.params.endTime = timeArr[1]
				};

				this.tableLoading = true;
				this.$http.get('message/sys-log/list', {
					params: this.params
				}).then(res => {
					this.tableLoading = false;
					if(res.body.code === 0) {
						this.messList = res.body.data.list;
						this.total = Number(res.body.data.totalCount)
					}
				});
			},

			addContactList() {
				this.$http.get('base/admin/public-base-list').then(res => {
					this.addList = res.body.data
				})
			},

			ChangePage(val) {
				this.params.page = val;
				this.getBrandList()
			},

			ChangePageSize(val) {
				this.params.page_size = val;
				this.getBrandList()
			},

			resetFilter() {
				this.$refs['filter'].resetFields();
				this.getBrandList()
			},

			filtrate() {
				this.getBrandList()
			}
		}
	}
</script>

<style lang="less">
	.messagesSent {
		.el-table {
			margin-top: 10px;
		}
		.el-table th,
		.el-table td {
			text-align: center;
		}
		.el-table .el-button.width-plus {
			padding: 7px 25px;
		}
		.el-table th>.cell {
			line-height: 1.5;
		}
		.el-pagination {
			text-align: right;
			margin-top: 10px;
		}
	}
</style>