<template>
	<div class="messageType">
		<div class="el-container">
			<el-form :inline="true" :model="params" ref="filter">
				<el-form-item label="消息类型 : " prop="content">
					<el-input placeholder="请输入消息类型" v-model="params.content" icon="search">
					</el-input>
				</el-form-item>
			</el-form>
			<el-row style="margin-top: 20px;">
				<el-row style="float: left;">
					<el-button v-if="self.showAction_('message/type/add')" type="primary" icon="plus" @click="addMessage" style="float: left;">添加消息类型</el-button>
				</el-row>
				<el-row style="float: right;">
					<el-button type="primary" icon="search" @click="filtrate">查询</el-button>
					<el-button type="danger" icon="close" @click="resetFilter">重置</el-button>
				</el-row>
			</el-row>
			<el-table ref="multipleTable" :data="messList" border tooltip-effect="dark" v-loading="tableLoading" style="width: 100%" fit :default-sort="{prop: 'date', order: 'descending'}">
				<el-table-column prop="mtype" label="ID">
				</el-table-column>
				<el-table-column prop="module" label="模块" sortable>
					<template scope="scope">
						{{moduleType[scope.row.module]}}
					</template>
				</el-table-column>
				<el-table-column prop="content" label="消息类型">
				</el-table-column>
				<el-table-column prop="priority" label="优先级" sortable>
				</el-table-column>
				<el-table-column label="编辑">
					<template scope="scope">
						<el-button v-if="self.showAction_('message/type/edit')" type="primary" icon="edit" size="small" @click="revamp(scope.row.content, scope.row.module, scope.row.id)">修改</el-button>
						<el-button v-if="self.showAction_('message/type/delete')" type="danger" size="small" @click="del(scope.row.id, scope.row.mtype)"><i class="el-icon-delete"></i>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50]" :page-size="params.page_size" :current-page="params.page" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 弹窗S -->
		<el-dialog title="修改" :visible.sync="messForm" size="tiny">
			<el-form :model="params_1" :rules="rules" ref="params_1" label-width="70px">
				<el-form-item label="模块">
					<el-input v-model="module" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="消息类型">
					<el-input v-model="content" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="优先级" prop="rank">
					<el-select v-model="params_1.rank" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in rateType" :key="index" :label="index" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editClickCancel">取消</el-button>
				<el-button type="primary" @click="messClick('params_1')">确定</el-button>
			</div>
		</el-dialog>
		<!-- 弹窗E -->
		<el-dialog title="添加消息类型" :visible.sync="addMessageForm" size="tiny">
			<el-form :model="addParams" :rules="rules_1" ref="addParams" label-width="70px">
				<el-form-item prop="mtype" label="序号">
					<el-input v-model="addParams.mtype" placeholder="请输入序号"></el-input>
				</el-form-item>
				<el-form-item prop="module" label="模块">
					<el-select v-model="addParams.module" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in moduleType" :key="index" :label="item" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="content" label="类型">
					<el-input v-model="addParams.content"></el-input>
				</el-form-item>
				<el-form-item label="优先级" prop="priority">
					<el-select v-model="addParams.priority" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in rateType" :key="index" :label="index" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addClickCancel">取消</el-button>
				<el-button type="primary" @click="addTypeClick('addParams')">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			let checkRate = function(rule, value, callback) {
				let exp = /^\d+$/
				if(exp.test(value) && value <= 255) {
					callback();
				} else {
					callback(new Error('请输入纯数字并小于255'));
				}
			}
			return {
				self: this,
				total: 1,
				module: '',
				content: '',
				id: '',
				maxNumber: [],
				numberList: '',
				tableLoading: false,
				messForm: false,
				addMessageForm: false,
				messList: [],
				params: {
					page: 1,
					page_size: 10,
					content: ''
				},
				params_1: {
					rank: ''
				},
				addParams: {
					mtype: '',
					module: '',
					content: '',
					priority: ''
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
				rateType: {
					'A': 'A',
					'B': 'B',
					'C': 'C'
				},
				rules: {
					rank: [{
						required: true,
						message: '请选择优先级'
					}]
				},
				rules_1: {
					mtype: [{
						required: true,
						message: '请输入序号'
					}, {
						required: true,
						validator: checkRate
					}],
					module: [{
						required: true,
						message: '请选择模块'
					}],
					content: [{
						required: true,
						message: '请输入消息类型'
					}],
					priority: [{
						required: true,
						message: '请选择序号'
					}]
				}
			}
		},

		created() {
			this.getBrandList()
		},

		methods: {
			getBrandList() {

				this.tableLoading = true;
				this.$http.get('message/type/list', {
					params: this.params
				}).then(res => {
					this.tableLoading = false;
					if(res.body.code === 0) {
						this.messList = res.body.data.list;
						this.total = Number(res.body.data.totalCount);
						for(var i = 0; i < this.messList.length; i++) {
							this.maxNumber.push(this.messList[i].mtype)
						};
						this.numberList = Math.max.apply(null, this.maxNumber) + 1;
					}
				});
			},

			revamp(content, module, id) {
				this.messForm = true;
				this.module = this.moduleType[module];
				this.content = content;
				this.id = id
			},

			del(id, mtype) {
				let deLid = {};
				deLid.id = id;
				this.$confirm('确认删除ID为' + mtype + '的消息类型?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(res => {
					this.$http.post('message/type/delete', deLid).then(res => {
						this.$message(res.body.message);
						if(res.body.code == 0) {
							this.getBrandList()
						}
					})
				}).catch(res=>{
					this.$message.success('已取消');
				})
			},

			messClick(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let rankParams = {};
						rankParams.id = this.id;
						rankParams.priority = this.params_1.rank;
						this.$http.post('message/type/edit', rankParams).then(res => {
							this.$message(res.body.message);
							if(res.body.code == 0) {
								this.messForm = false;
								this.getBrandList()
							}
						})
					}
				})
			},

			addMessage() {
				this.addMessageForm = true;
				this.addParams.mtype = this.numberList
			},

			addTypeClick(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.$http.post('message/type/add', this.addParams).then(res => {
							this.$message(res.body.message);
							if(res.body.code == 0) {
								this.addMessageForm = false;
								this.getBrandList()
							}
						})
					}
				})
			},

			editClickCancel() {
				this.messForm = false
			},

			addClickCancel() {
				this.addMessageForm = false
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
	.messageType {
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