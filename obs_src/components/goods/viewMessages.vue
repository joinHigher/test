<!-- 查看邮件 -->
<template>
	<div class="view">
		<div class="el-container">
			<div class="viewMessages">
				<el-form :model="option" :inline="true" ref="ruleForm">
					<el-form-item label="快捷搜索">
						<el-input v-model.trim="searchCode" class="quick-search" placeholder="IP/E-mail/国家编码">
							<el-select filterable clearable :default-first-option='true' v-model="quickTypeVal" slot="prepend" placeholder="请选择">
								<el-option v-for="(value, key, index) in quickSearchType" :key="index" :label="value" :value="key">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
					<el-form-item label="订阅渠道" prop="pipelineCode">
						<el-select v-model="option.pipelineCode" filterable clearable >
							<el-option v-for="(item, index) in pipeObj" :key="index" :value="index" :label="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发送平台" prop="platform">
						<el-select v-model="option.platform" filterable clearable>
							<el-option v-for="(item, index) in platOpt" :key="index" :label="item" :value="index">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否发送邮件" prop="isSend">
						<el-select v-model="option.isSend" filterable clearable :default-first-option='true'>
							<el-option v-for="(item, index) in emailSend" :key="index" :value="index" :label="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="站点语言" prop="lang">
						<el-select v-model="option.lang" placeholder="请选择" filterable clearable :default-first-option='true'>
							<el-option v-for="item in langOpt" :key="item.language_en" :label="item.language_ch" :value="item.language_en">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订阅时间" prop="date">
						<el-date-picker v-model="option.date" type="datetimerange" placeholder="选择订阅时间" :editable="false"></el-date-picker>
					</el-form-item>
					<el-form-item style="float: right;">
						<el-button type="primary" icon="search" @click="megDataList">搜索</el-button>
						<el-button type="danger" icon="close" @click="resetForm">重置</el-button>
					</el-form-item>
				</el-form>
				<div>
					<el-table :data="tableData" border tooltip-effect="dark" style="width: 100%,height:100%">
						<el-table-column prop="id" label="序号">
						</el-table-column>
						<el-table-column prop="email" label="E-mail" width="200">
						</el-table-column>
						<el-table-column prop="ip" label="IP">
						</el-table-column>
						<el-table-column prop="countryName" label="对应国家" width="200">
						</el-table-column>
						<el-table-column label="订阅时间" width="200">
							<template scope="scope">
								{{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
							</template>
						</el-table-column>
						<el-table-column prop="tortPipelineCode" label="订阅渠道">
							<template scope="scope">
								{{pipeObj[scope.row.pipelineCode]}}
							</template>
						</el-table-column>
						<el-table-column label="订阅平台">
							<template scope="scope">
								{{platOpt[scope.row.platform]}}
							</template>
						</el-table-column>
						<el-table-column label="是否发送邮件">
							<template scope="scope">
								<i :class="{'el-icon-circle-check color-success': scope.row.isSend == 1, 'el-icon-circle-cross color-danger': scope.row.isSend == 0}"></i>
							</template>
						</el-table-column>
						<el-table-column label="发送时间" width="200">
							<template scope="scope">
								{{self.timeZone_(scope.row.sendTime, self.$store.getters.getTimeZone)}}
							</template>
						</el-table-column>
						<el-table-column prop="senderName" label="发送人">
						</el-table-column>
					</el-table>
				</div>
				<div style="float: right;">
					<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50]" :page-size="option.pageSize" :current-page="option.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				pipeOpt: [],
				self: this,
				tableData: [],
				emailTime: [],
				langOpt: [],
				total: 1,
				searchCode: '',
				quickTypeVal: '',
				option: {
					pageNo: Number(this.$route.query.pageNo),
					pageSize: Number(this.$route.query.pageSize),
					arrivalNoticeCode: this.$route.query.arrivalNoticeCode,
					vhCode: this.$route.query.virWhCode,
					goodSn: this.$route.query.goodSn,
					email: '',
					isSend: '',
					lang: '',
					date: []
				},
				emailSend: {
					'0': '否',
					'1': '是',
				},
				quickSearchType: {
					'1': '订阅用户邮箱',
					'2': '订阅用户IP',
					'3': '订阅用户国家'
				},
				platOpt:{
	                '1': 'PC',
	                '2': 'M',
	                '3': 'IOS',
	                '4': 'ANDROID',
	                '5': 'PAD'
	            },
			}
		},

		created() {
			this.getOpt();
			this.megData()
		},
        computed: {
            pipeObj () {
                return this.$store.getters.getPipe.obj;
            }
        },

		methods: {
			async megData() {
				var timeEmail = this.timeZone_(this.option.date, this.$store.getters.getTimeZone);
				if(Array.isArray(timeEmail) && timeEmail.length >= 2) {
					this.option.subStartTime = timeEmail[0];
					this.option.subEndTime = timeEmail[1];
				};

				if(this.quickTypeVal.toString() == 1) {
					this.option.email = this.searchCode;
					this.option.countryName = '';
					this.option.ip = ''
				} else if(this.quickTypeVal.toString() == 2) {
					this.option.ip = this.searchCode;
					this.option.email = '';
					this.option.countryName = ''
				} else if(this.quickTypeVal.toString() == 3) {
					this.option.countryName = this.searchCode;
					this.option.ip = '';
					this.option.email = ''
				} else {
					this.option.countryName = '';
					this.option.ip = '';
					this.option.email = ''
				};

                const data = await this.httpGet_('goods/goods/get-arrival-notice-sub-list', {
                    params: this.option
                });
                this.tableData = data.list;
                this.total = data.totalCount;
			},

			async getOpt() {
                const data = await this.httpGet_('admin/public/languages');
                this.langOpt = res.body.data;
			},

			ChangePage(val) {
				this.option.pageNo = val;
				this.megData();
			},

			ChangePageSize(val) {
				this.option.pageSize = val;
				this.megData();
			},

			resetForm() {
				this.$refs.ruleForm.resetFields();
				this.quickTypeVal = '';
				this.searchCode = ''
			},

			megDataList() {
				if(this.quickTypeVal > 0 && (!this.searchCode || this.searchCode.toString().trim() == '')) {
					this.$message('请输IP/E-mail/国家编码');
					return;
				} else if(this.quickTypeVal <= 0 && (this.searchCode || !this.searchCode.toString().trim() == '')) {
					this.$message('请选择快捷筛选类型');
					return;
				} else {
					this.megData()
				}
			}
		}
	}
</script>
<style lang="less">
	.view {
		.el-table {
			margin-top: 10px;
		}
		.el-table th,
		.el-table td {
			text-align: center;
			padding: 25px 0;
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
