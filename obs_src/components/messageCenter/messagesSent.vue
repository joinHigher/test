<template>
	<div class="messagesSent">
		<div class="el-container">
			<el-form :inline="true" :model="params" ref="filter">
				<el-form-item label="处理人 : " prop="operator">
					<el-select v-model="params.operator" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in addList" :key="item.value" :label="item.username" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="消息类型 : " prop="content">
					<el-input placeholder="请输入消息类型" v-model="params.content" icon="search">
					</el-input>
				</el-form-item>
				<el-form-item label="优先级" prop="priority">
					<el-select v-model="params.priority" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in rateType" :key="index" :label="index" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" @click="filtrate">查询</el-button>
					<el-button type="danger" icon="close" @click="resetFilter">重置</el-button>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-button v-if="self.showAction_('message/allot/add')" type="primary" @click="addContact"><i class="el-icon-plus"></i>添加处理人</el-button>
			</el-row>
			<el-table ref="multipleTable" :data="messList" border tooltip-effect="dark" v-loading="tableLoading" style="width: 100%" fit :default-sort="{prop: 'date', order: 'descending'}">
				<el-table-column prop="type_id" label="序号" sortable>
				</el-table-column>
				<el-table-column prop="operator_name" label="处理人">
				</el-table-column>
				<el-table-column prop="siteName" label="站点">
				</el-table-column>
				<el-table-column prop="content" label="消息类型">
				</el-table-column>
				<el-table-column prop="priority" label="优先级" sortable>
				</el-table-column>
				<el-table-column prop="update_user_name" label="修改人">
				</el-table-column>
				<el-table-column label="修改时间">
					<template scope="scope">
						{{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
					</template>
				</el-table-column>
				<el-table-column label="编辑">
					<template scope="scope">
						<el-button v-if="self.showAction_('message/allot/update')" type="primary" size="small" icon="edit" @click="revamp(scope.row)">修改</el-button>
						<el-button v-if="self.showAction_('message/allot/delete')" type="danger" size="small" @click="del(scope.row.id, scope.row.type_id)"><i class="el-icon-delete"></i>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50]" :page-size="params.page_size" :current-page="params.page" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 弹窗S -->
		<el-dialog title="修改" :visible.sync="messForm" size="tiny">
			<el-form :model="params_1" ref="params_1" :rules="rules" label-width="70px">
				<el-form-item label="处理人">
					{{operatorName}}
				</el-form-item>
				<el-form-item label="站点" prop="site">
					<el-select v-model="params_1.site" filterable clearable :default-first-option='true' @change="addSiteType" placeholder="请选择">
						<el-option v-for="(item, index) in sendModules" :key="item.value" :label="item.site_name" :value="item.site_code">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模块" prop="module">
					<el-select v-model="params_1.module" filterable clearable :default-first-option='true' @change="msgType" placeholder="请选择">
						<el-option v-for="(item, index) in modulesList" :key="index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型" prop="typeList">
					<el-select v-model="params_1.typeList" filterable clearable :default-first-option='true' @change="contentType_1" placeholder="请选择">
						<el-option v-for="(item, index) in msgTypeList" :key="index" :label="item.content" :value="item.mtype">
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
		<el-dialog title="添加处理人" :visible.sync="addFrom" size="tiny">
			<el-form :model="addParams" :rules="rules_1" ref="addParams" label-width="70px">
				<el-form-item label="处理人" prop="handler">
					<el-select v-model="addParams.handler" filterable clearable :default-first-option='true' @change="handlerType" placeholder="请选择">
						<el-option v-for="(item, index) in addList" :key="item.value" :label="item.username" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="站点" prop="site">
					<el-select v-model="addParams.site" filterable clearable :default-first-option='true' @change="siteType" placeholder="请选择">
						<el-option v-for="(item, index) in sendModules" :key="item.value" :label="item.site_name" :value="item.site_code">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模块" prop="module">
					<el-select v-model="addParams.module" filterable clearable :default-first-option='true' @change="addType" placeholder="请选择">
						<el-option v-for="(item, index) in modulesList" :key="index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型" prop="typeList">
					<el-select v-model="addParams.typeList" filterable clearable :default-first-option='true' multiple @change="contentType" placeholder="请选择">
						<el-option v-for="(item, index) in msgTypeList" :key="index" :label="item.content" :value="item.mtype">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="抄送人" prop="ccm">
					<el-select v-model="addParams.ccm" filterable clearable multiple :default-first-option='true' placeholder="请选择">
						<el-option v-for="(item, index) in addList" :key="item.value" :label="item.username" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addCancel">取消</el-button>
				<el-button type="primary" @click="addClick('addParams')">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				self: this,
				total: 1,
				operatorName: '',
				content_1: '',
				siteCode_1: '',
				id: '',
				siteName: '',
				type_name_1: '',
				addName: '',
				ccmName: [],
				addSiteName: '',
				tableLoading: false,
				messForm: false,
				addFrom: false,
				messList: [],
				sendModules: [],
				msgTypeList: [],
				addList: [],
				modsList: [],
				typeList: [],
				modulesList: [],
				rankNull: '',
				params: {
					page: 1,
					page_size: 10,
					content: '',
					priority: '',
					operator: ''
				},
				params_1: {
					module: '',
					site: '',
					typeList: ''
				},
				addParams: {
					handler: '',
					module: '',
					site: '',
					typeList: [],
					ccm: []
				},
				operator: {},
				rateType: {
					'A': 'A',
					'B': 'B',
					'C': 'C'
				},
				rules: {
					site: [{
						required: true,
						message: '请选择站点'
					}],
					module: [{
						required: true,
						message: '请选择模块'
					}],
					typeList: [{
						required: true,
						message: '请选择消息类型'
					}]
				},
				rules_1: {
					handler: [{
						required: true,
						message: '请选择处理人'
					}],
					site: [{
						required: true,
						message: '请选择站点'
					}],
					module: [{
						required: true,
						message: '请选择模块'
					}],
					typeList: [{
						required: true,
						message: '请选择消息类型'
					}]
				}
			}
		},

		created() {
			this.getBrandList();
			this.addContactList()
		},

		methods: {
			getBrandList() {

				this.tableLoading = true;
				this.$http.get('message/allot/list', {
					params: this.params
				}).then(res => {
					this.tableLoading = false;
					if(res.body.code === 0) {
						this.messList = res.body.data.list;
						this.total = Number(res.body.data.totalCount)
					}
				});
			},

			revamp(row) {
				this.params_1.module = '';
				this.params_1.site = '';
				this.params_1.typeList = '';

				this.operator.id = row.operator;
				this.messForm = true;
				this.operatorName = row.operator_name;
				this.id = row.id;
				this.content_1 = row.content;
				/*this.content_1 = row.type_id;*/
				this.siteCode_1 = row.siteCode;
				/*this.params_1.site = row.siteCode;*/
				this.$http.get('base/admin/public-admin-info', {
					params: this.operator
				}).then(res => {
					if(res.body.code == 0) {
						this.sendModules = res.body.data;
						for(var i = 0; i < this.sendModules.length; i++) {
							this.modulesList = this.sendModules[i].modules;
							if(this.sendModules[i].site_code == this.siteCode_1 || this.sendModules[i].type_id == this.content_1) {
								this.params_1.site = this.siteCode_1;
								this.params_1.typeList = this.content_1
							}
						}
					}
				})
			},

			del(id, type_id) {
				let deLid = {};
				deLid.id = id;
				this.$confirm('确认删除序号为' + type_id + '的消息类型?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(res => {
					this.$http.post('message/allot/delete', deLid).then(res => {
						this.$message(res.body.message);
						if(res.body.code == 0) {
							this.getBrandList()
						}
					})
				}).catch(res => {
					this.$message.success('已取消');
				})
			},

			msgType() {
				this.params_1.typeList = '';
				var msgTypeParams = {};
				msgTypeParams.module = this.params_1.module;
				this.$http.get('message/type/type', {
					params: msgTypeParams
				}).then(res => {
					if(res.body.code == 0) {
						this.msgTypeList = res.body.data
					}
				})
			},

			addType() {
				var msgTypeParams = {};
				msgTypeParams.module = this.addParams.module;
				this.addParams.typeList.length = 0;
				this.$http.get('message/type/type', {
					params: msgTypeParams
				}).then(res => {
					if(res.body.code == 0) {
						this.msgTypeList = res.body.data;
					}
				})
			},

			siteType(value) {
				this.addParams.module = '';
				this.sendModules.find((item) => {
					if(item.site_code === value) {
						this.siteName = item.site_name;
					}
				});
				for(var i = 0; i < this.sendModules.length; i++) {
					if(this.addParams.site == this.sendModules[i].site_code) {
						this.modulesList = this.sendModules[i].modules;
					}
				}
			},

			contentType() {
				let modList = {};
				let modListsss = [];
				this.typeList = modListsss;
				modList.type_id = '';
				modList.type_name = '';
				for(var i = 0; i < this.addParams.typeList.length; i++) {
					modList.type_id = this.addParams.typeList[i];
					this.msgTypeList.find((item) => {
						if(item.mtype === modList.type_id) {
							modList.type_name = item.content
						};
					});
					modListsss.push({
						type_id: modList.type_id,
						type_name: modList.type_name
					});
				};
			},

			contentType_1(value) {
				this.msgTypeList.find((item) => {
					if(item.mtype === value) {
						this.type_name_1 = item.content
					}
				});
			},

			messClick(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let rankParams = {};
						let siteName = '';
						let type_name = '';
						rankParams.operator = this.operator.id;
						rankParams.operator_name = this.operatorName;
						rankParams.siteCode = this.params_1.site;
						rankParams.siteName = this.siteName;
						rankParams.type_id = this.params_1.typeList;
						rankParams.type_name = this.type_name_1;
						rankParams.id = this.id;
						this.$http.post('message/allot/update', rankParams).then(res => {
							this.$message(res.body.message);
							if(res.body.code == 0) {
								this.messForm = false;
								this.getBrandList()
							}
						})
					}
				})
			},

			handlerType(value) {
				this.addList.find((item) => {
					if(item.id === value) {
						this.addName = item.username;
					}
				});
				this.addParams.site = '';
				this.addParams.module = '';
				this.operator.id = this.addParams.handler;
				this.$http.get('base/admin/public-admin-info', {
					params: this.operator
				}).then(res => {
					if(res.body.code == 0) {
						this.sendModules = res.body.data;
						/*for(var i = 0; i < this.sendModules.length; i++) {
							if (this.addParams.site == this.sendModules[i].site_name) {
								this.modulesList = this.sendModules[i].modules;
							}
						}*/
					}
				})
			},

			addContact() {
				this.addParams.handler = '';
				this.addParams.module = '';
				this.addParams.site = '';
				this.addParams.typeList.length = 0;
				/*this.addParams.ccm.length = 0;*/
				this.addParams.ccm = [];
				this.addFrom = true
			},

			addContactList() {
				this.$http.get('base/admin/public-base-list').then(res => {
					this.addList = res.body.data
				})
			},

			addSiteType(value) {
				this.sendModules.find((item) => {
					if(item.site_code === value) {
						this.siteName = item.site_name;
					}
				})
			},

			addClick(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let rankParams = {};
						let siteName = '';
						let type_name = '';
						rankParams.operator = this.addParams.handler;
						rankParams.operator_name = this.addName;
						rankParams.siteCode = this.addParams.site;
						rankParams.siteName = this.siteName;
						/*rankParams.force = 0;*/
						/*rankParams.type_id = this.addParams.typeList;
						rankParams.type_name = this.type_name;*/
						rankParams.types = this.typeList;
						rankParams.ccm = this.addParams.ccm.join(',');
						for(var i = 0; i < this.addParams.ccm.length; i++) {
							for(var j = 0; j < this.addList.length; j++) {
								if(this.addParams.ccm[i] === this.addList[j].id) {
									this.ccmName.push(this.addList[j].username);
									rankParams.ccm_name = this.ccmName.join(',')
								}
							}
						}
						this.$http.post('message/allot/add', rankParams).then(res => {
							if(res.body.code == 0) {
								this.$message(res.body.message);
								this.addFrom = false;
								this.getBrandList()
							} else if(res.body.code == 1) {
								this.$confirm(res.body.message, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									let rankParams = {};
									let siteName = '';
									let type_name = '';
									rankParams.operator = this.addParams.handler;
									rankParams.operator_name = this.addName;
									rankParams.siteCode = this.addParams.site;
									rankParams.siteName = this.siteName;
									rankParams.force = 1;
									/*rankParams.type_id = this.addParams.typeList;
									rankParams.type_name = this.type_name;*/
									rankParams.types = this.typeList;
									rankParams.ccm = this.addParams.ccm.join(',');
									for(var i = 0; i < this.addParams.ccm.length; i++) {
										for(var j = 0; j < this.addList.length; j++) {
											if(this.addParams.ccm[i] === this.addList[j].id) {
												this.ccmName.push(this.addList[j].username);
												rankParams.ccm_name = this.ccmName.join(',')
											}
										}
									};
									this.$http.post('message/allot/add', rankParams).then(res => {
										this.$message(res.body.message);
										if(res.body.code == 0) {
											this.addFrom = false;
											this.getBrandList()
										}
									})
								}).catch(res => {
									this.$message.success('已取消');
								})
							}
						})
					}
				})
			},

			addCancel() {
				this.addFrom = false;
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