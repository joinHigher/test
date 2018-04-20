<template>
	<div class="messageList">
		<div class="el-container">
			<el-form :inline="true" :model="params" ref="filter">
				<el-form-item label="模块 : " prop="module">
					<el-select v-model="params.module" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in moduleType" :key="index" :label="item" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="消息状态 : " prop="status">
					<el-select v-model="params.status" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in statusList" :key="index" :label="item" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="处理人 : " prop="handler">
					<el-select v-model="params.handler" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in getUserList" :key="index" :label="item.username" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="抄送人 : " prop="operator">
					<el-select v-model="params.operator" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in getUserList" :key="index" :label="item.username" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="同步时间 : " prop="date1">
					<el-date-picker v-model="params.date1" type="datetimerange" placeholder="选择开始时间" :editable="false"></el-date-picker>
				</el-form-item>
			</el-form>
			<el-row style="margin-top: 30px;">
				<el-row style="float: right;">
					<el-button type="primary" icon="search" @click="filtrate">查询</el-button>
					<el-button type="danger" icon="close" @click="resetFilter">重置</el-button>
				</el-row>
				<el-row style="float: left;">
					<el-button type="primary" @click="batchChange" :disabled="this.multipleSelection.length === 0"><i class="el-icon-share"></i>批量转交</el-button>
					<!--<el-button type="primary" @click="batchChange" :disabled="transfer"><i class="el-icon-share"></i>批量转交</el-button>-->
					<el-button type="danger" @click="batchShelve" :disabled="this.multipleSelection.length === 0"><i class="el-icon-circle-close"></i>批量搁置</el-button>
				</el-row>
			</el-row>
			<el-table ref="messList" :data="messList" border tooltip-effect="dark" v-loading="tableLoading" style="width: 100%" fit :default-sort="{prop: 'date', order: 'descending'}" @row-click="handleCurrentChange" @selection-change="multipleSelectionChange">
				<el-table-column type="selection" :selectable="chcekAble">
				</el-table-column>
				<el-table-column prop="id" label="ID">
				</el-table-column>
				<el-table-column prop="priority" label="优先级" sortable>
				</el-table-column>
				<el-table-column prop="site_code" label="站点">
				</el-table-column>
				<el-table-column label="日期" prop="create_time" sortable>
					<template scope="scope">
						{{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
					</template>
				</el-table-column>
				<el-table-column prop="module_name" label="模块">
				</el-table-column>
				<el-table-column prop="title" label="消息标题">
				</el-table-column>
				<el-table-column prop="content" label="消息类型">
				</el-table-column>
				<el-table-column prop="deal_name" label="处理人">
				</el-table-column>
				<el-table-column prop="ccm_name" label="抄送人">
				</el-table-column>
				<el-table-column prop="status" label="消息状态">
				</el-table-column>
				<el-table-column label="处理时间">
					<template scope="scope">
						{{self.timeZone_(scope.row.op_time, self.$store.getters.getTimeZone)}}
					</template>
				</el-table-column>
				<el-table-column label="编辑">
					<template scope="scope">
						<el-button type="danger" size="small" @click="shelve(scope.row.message_id)" :disabled="scope.row.deal_name!== userName || scope.row.status == '已搁置'|| scope.row.status == '已读'|| scope.row.status == '已转交'|| scope.row.do_url == '已处理'"><i class="el-icon-circle-close"></i>搁置</el-button>
						<el-button type="primary" size="small" @click="revamp(scope.row.message_id, scope.row.site_code, scope.row.module)" :disabled="scope.row.deal_name!== userName || scope.row.status == '已转交'|| scope.row.status == '已读'|| scope.row.do_url == '已处理'"><i class="el-icon-share"></i>转交</el-button>
						<el-button type="primary" size="small" @click="read(scope.row.message_id)" :disabled="scope.row.deal_name!== userName || scope.row.status == '已读'|| scope.row.status == '已转交'|| scope.row.do_url == '已处理'"><i class="el-icon-message"></i>标为已读</el-button>
						<a :href="[scope.row.do_url]" v-if="scope.row.deal_name == userName && scope.row.do_url !==''" target="_blank" id="line">立即处理</a>
						<a :href="[scope.row.detail_url]" v-if="scope.row.deal_name == userName && scope.row.detail_url !==''" target="_blank" id="line">查看详情</a>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50]" :page-size="params.page_size" :current-page="params.page" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 弹窗S -->
		<el-dialog title="转交" :visible.sync="messForm" size="tiny">
			<el-form :model="params_1" :rules="rules" ref="params_1" label-width="70px">
				<el-form-item label="转交人" prop="deliver">
					<el-select v-model="params_1.deliver" @change="deliverType" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in deliverList" :key="item.value" :label="item.username" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editClickCancel">取消</el-button>
				<el-button type="primary" @click="messClick('params_1')">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="批量转交" :visible.sync="batchForm" size="tiny">
			<el-form :model="params_2" :rules="rules_1" ref="params_2" label-width="70px">
				<el-form-item label="转交人" prop="deliver">
					<el-select v-model="params_2.deliver" @change="fatchType" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in deliverList" :key="item.value" :label="item.username" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="batchClickCancel">取消</el-button>
				<el-button type="primary" @click="batchClick('params_2')">确定</el-button>
			</div>
		</el-dialog>
		<!-- 弹窗E -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				self: this,
				total: 1,
				module: '',
				content: '',
				id: '',
				operator_name: '',
				handlerName: '',
				tableLoading: false,
				messForm: false,
				batchForm: false,
				clickDispose: true,
				transferList: '',
				changeNumber: 10,
				type: '',
				type_1: '',
				messList: [],
				messList_1: [],
				deliverList: [],
				multipleSelection: [],
				getUserList: [],
				params: {
					page: 1,
					page_size: 10,
					date1: '',
					module: '',
					status: '',
					handler: '',
					operator: ''
				},
				params_1: {
					deliver: ''
				},
				params_2: {
					deliver: ''
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
					'12': '库存'
				},
				statusList: {
					'1': '未读',
					'2': '已读',
					'3': '已搁置',
					'4': '已处理',
					'5': '已转交'
				},
				rules: {
					deliver: [{
						required: true,
						message: '请选择转交人'
					}]
				},
				rules_1: {
					deliver: [{
						required: true,
						message: '请选择转交人'
					}]
				}
			}
		},

		created() {
			this.getBrandList();
			this.getUser()
		},

		computed: {
			userName() {
				return this.$store.getters.getUserName;
			}
		},

		methods: {
			chcekAble(row) {
				if(row.deal_name == this.$store.getters.getUserName && row.status !== '已读' && row.status !== '已转交') {
					return true;
				} else {
					return false;
				}
			},

			getBrandList() {
				var timeArr = this.timeZone_(this.params.date1, this.$store.getters.getTimeZone);
				if(Array.isArray(timeArr) && timeArr.length >= 2) {
					this.params.startTime = timeArr[0];
					this.params.endTime = timeArr[1]
				};

				this.tableLoading = true;
				this.params.handler = -1;
				this.params.operator = -1;
				this.$http.get('message/msg/list', {
					params: this.params
				}).then(res => {
					this.tableLoading = false;
					if(res.body.code === 0) {
						this.messList = res.body.data.list;
						this.type = res.body.data.type;
						this.total = Number(res.body.data.totalCount);
						/*this.params.handler = this.handlerName;*/
						if(this.type == 0) {
							this.params.handler = '';
							this.params.operator = ''
						} else if(this.type == 1) {
							/*this.params.handler = this.$store.getters.getUserName;*/
							for(var i = 0; i < this.messList.length; i++) {
								if(this.$store.getters.getUserName == this.messList[i].operator_name) {
									this.params.handler = Number(this.messList[i].handler)
								}
							}
							/*this.params.handler = this.handlerName;*/
							this.params.operator = '';
						} else if(this.type == 2) {
							/*this.params.operator = this.$store.getters.getUserName;*/
							/*this.params.operator = this.handlerName;*/
							var ccm_name = '';
							for(var i = 0; i < this.messList.length; i++) {
								/*if(this.$store.getters.getUserName == this.messList[i].ccm_name) {
									this.params.operator = Number(this.messList[i].operator)
								}*/
								ccm_name = this.messList[i].ccm_name.split(',');
							};
							for(var i = 0; i < ccm_name.length; i++) {
								if(this.$store.getters.getUserName == ccm_name[i].ccm_name) {
									this.params.operator = Number(this.messList[i].operator)
								}
							}
							this.params.handler = ''
						}
					}
				})
			},

			getUser() {
				this.$http.get('base/admin/public-base-list').then(res => {
					this.getUserList = res.body.data;
					let virtualName = {
						username: ' ',
						realname: ' ',
						id: -1
					}
					this.getUserList.push(virtualName)
					for(var i = 0; i < this.getUserList.length; i++) {
						if(this.$store.getters.getUserName == this.getUserList[i].username) {
							this.handlerName = this.getUserList[i].id
						}
					}
				})
			},

			revamp(message_id, site_code, module) {
				this.messForm = true;
				/*this.id = id;*/
				this.message_id = message_id;
				this.params_1.deliver = '';
				var adminInfo = {
					site_code: site_code,
					module: module
				};
				this.$http.get('base/admin/public-admin-list', {
					params: adminInfo
				}).then(res => {
					this.deliverList = res.body.data
				})
			},

			shelve(message_id) {
				let shelveId = {};
				shelveId.message_id = [message_id];
				this.$confirm('是否搁置此消息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(res => {
					this.$http.post('message/msg/shelve', shelveId).then(res => {
						this.$message(res.body.message);
						if(res.body.code == 0) {
							this.getBrandList()
						}
					})
				}).catch(res => {
					this.$message.success('已取消');
				})
			},

			batchShelve() {
				let shelveId = {};
				let batchId = [];
				this.multipleSelection.forEach((item) => {
					batchId.push(item.message_id)
				});
				shelveId.message_id = batchId;
				this.$confirm('是否要搁置这' + batchId.length + '条消息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(res => {
					this.$http.post('message/msg/shelve', shelveId).then(res => {
						this.$message(res.body.message);
						if(res.body.code == 0) {
							this.getBrandList()
						}
					})
				}).catch(res => {
					this.$message.success('已取消');
				})
			},

			batchChange() {
				this.batchForm = true;
				let batchParams = {};
				batchParams.module = this.multipleSelection[0].module;
				batchParams.site_code = this.multipleSelection[0].site_code;
				this.$http.get('base/admin/public-admin-list', {
					params: batchParams
				}).then(res => {
					this.deliverList = res.body.data
				})
			},

			batchClick(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let batchParams = {};
						let messTypeList = [];
						batchParams.operator_name = this.operator_name;
						batchParams.operator = this.params_2.deliver;
						batchParams.message_id = messTypeList;
						this.multipleSelection.find((item) => {
							messTypeList.push(item.message_id)
						});
						this.$http.post('message/msg/transfer', batchParams).then(res => {
							this.$message(res.body.message);
							if(res.body.code == 0) {
								this.batchForm = false
							}
						})
					}
				})
			},

			batchClickCancel() {
				this.batchForm = false
			},

			messClick(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let rankParams = {};
						rankParams.message_id = [this.message_id];
						rankParams.operator_name = this.operator_name;
						rankParams.operator = this.params_1.deliver;
						this.$http.post('message/msg/transfer', rankParams).then(res => {
							this.$message(res.body.message);
							if(res.body.code == 0) {
								this.messForm = false;
								this.getBrandList()
							}
						})
					}
				})
			},

			deliverType(value) {
				this.deliverList.find((item) => {
					if(item.id === value) {
						this.operator_name = item.username;
					}
				})
			},

			fatchType(value) {
				this.deliverList.find((item) => {
					if(item.id === value) {
						this.operator_name = item.username;
						console.log(this.operator_name)
					}
				})
			},

			read(message_id) {
				let readId = {};
				readId.message_id = [message_id];
				this.$http.post('message/msg/read', readId).then(res => {
					this.$message(res.body.message);
					if(res.body.code == 0) {
						this.getBrandList()
					}
				})
			},

			editClickCancel() {
				this.messForm = false
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
				var timeArr = this.timeZone_(this.params.date1, this.$store.getters.getTimeZone);
				if(Array.isArray(timeArr) && timeArr.length >= 2) {
					this.params.startTime = timeArr[0];
					this.params.endTime = timeArr[1]
				};
				this.tableLoading = true;
				this.$http.get('message/msg/list', {
					params: this.params
				}).then(res => {
					this.tableLoading = false;
					if(res.body.code === 0) {
						this.messList = res.body.data.list;
						this.total = Number(res.body.data.totalCount);
						this.type = res.body.data.type
					}
				})
			},

			handleCurrentChange(row, event, column) {
				if(row.deal_name == this.$store.getters.getUserName && row.status !== '已读' && row.status !== '已转交') {
					this.$refs.messList.toggleRowSelection(row)
				}
			},

			multipleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}
	}
</script>

<style lang="less">
	.messageList {
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
		#line {
			text-align: center;
			color: #FFFFFF;
			font-size: 8px;
			padding: 5px 20px;
			border-radius: 5px;
			background-color: #20A0FF;
		}
	}
</style>