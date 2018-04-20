<!-- 发送邮件 -->
<template>
	<div class="sendMail">
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
					<el-form-item label="是否发送邮件" prop="isSend">
						<el-select v-model="option.isSend" filterable clearable :default-first-option='true'>
							<el-option v-for="(item, index) in emailSend" :key="index" :value="index" :label="item"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="订阅渠道" prop="pipelineCode">
						<el-select v-model="option.pipelineCode" filterable clearable >
							<el-option v-for="(item, index) in pipeObj" :key="index" :value="index" :label="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订阅平台" prop="platform">
						<el-select v-model="option.platform" filterable clearable>
							<el-option v-for="(item, index) in platOpt" :key="index" :label="item" :value="index">
							</el-option>
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
					<el-table :data="tableData" ref="tableData" border tooltip-effect="dark" style="width: 100%,height:100%" @row-click="handleCurrentChange" @selection-change="multipleSelectionChange">
						<el-table-column type="selection">
						</el-table-column>
						<el-table-column prop="id" label="序号">
						</el-table-column>
						<el-table-column prop="email" label="订阅邮箱" width="200">
						</el-table-column>
						<el-table-column prop="ip" label="订阅用户IP" width="200">
						</el-table-column>
						<el-table-column prop="countryName" label="订阅用户国家" width="200">
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
						<el-table-column label="发送邮件状态">
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
				<div class="electEmail">
					<el-row :gutter="20">
						<el-col :span="2">
							<div class="grid-content">已选邮件({{this.multipleSelection.length}}):</div>
						</el-col>
						<el-col :span="18">
							<ul id="ul" style="width: 100%; height: 200px; border: 1px solid #DFE6EC; overflow: hidden;">
								<li v-for="item in this.multipleSelection" style="display: inline-block;margin-left: 15px;margin-top: 15px;list-style: none;">
									<el-tag type="primary">{{item.email}}</el-tag>
								</li>
							</ul>
						</el-col>
					</el-row>
					<el-form label-width="75px" style="margin-top: 30px;">
						<el-form-item label="价格状态:">
							<el-col>{{this.statePrice}}</el-col>
						</el-form-item>
						<el-form-item label="当前价格:">
							<el-col>{{this.price}}</el-col>
						</el-form-item>
						<el-form-item label="到货日期:">
							<el-date-picker v-model="arrivalDate" type="datetime" placeholder="选择日期" :editable="false">
							</el-date-picker>
						</el-form-item>
					</el-form>
					<el-row type="flex" class="row-bg" justify="center" style="margin-top: 30px;">
						<el-col :span="6">
							<el-button v-if="self.showAction_('goods/goods/arrival-notice-send-mail')" type="primary" :disabled="this.multipleSelection.length == 0" @click="sendMail" size="large"><i class="el-icon-upload2 el-icon--left"></i> 确认发送邮件</el-button>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				self: this,
				arrivalDate: '',
				statePrice: '',
				price: '',
				tableData: [],
				emailTime: [],
				langOpt: [],
				multipleSelection: [],
				total: 1,
				searchCode: '',
				quickTypeVal: '',
				option: {
					platform: '',
					pipelineCode: '',
					pageNo: Number(this.$route.query.pageNo),
					pageSize: Number(this.$route.query.pageSize),
					arrivalNoticeCode: this.$route.query.arrivalNoticeCode,
					virWhCode: this.$route.query.virWhCode,
					goodSn: this.$route.query.goodSn,
					email: '',
					lang: '',
					isSend: '',
					date: []
				},
				date_1: [],
				emailSend: {
					'0': '否',
					'1': '是',
				},
				siteLang: {
					'0': '英语',
					'1': '俄语',
					'2': '西班牙语'
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
				// var timeEnd = this.timeZone_(this.date_1, this.$store.getters.getTimeZone);
				if(Array.isArray(timeEmail) && timeEmail.length >= 2) {
					this.option.subStartTime = timeEmail[0];
					this.option.subEndTime = timeEmail[1];
				};
				// if(Array.isArray(timeEnd) && timeEnd.length >= 1) {
				// 	this.arrivalDate = timeEnd[0];
				// };

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
                this.statePrice = data.priceName;
                this.price = data.price;
                this.arrivalDate = data.arrivalTime ? [new Date(data.arrivalTime * 1000)] : '';
			},

			async getOpt() {
                const data = await this.httpGet_('admin/public/languages');
                this.langOpt = data;
			},

			async sendMail(index) {
				if (!this.arrivalDate) {
                    this.$message.error('到货时间不能为空');
                    return;
				}
                let emailList = [];
				for(var i = 0; i < this.multipleSelection.length; i++) {
					emailList.push({
                        mail: this.multipleSelection[i].email,
                        pipelineCode: this.multipleSelection[i].pipelineCode,
                        platform: this.multipleSelection[i].platform,
                        lang: this.multipleSelection[i].lang,
                    });
				};
                let params = {
                    virWhCode: this.option.virWhCode,
                    goodsSn: this.option.goodSn,
                    emailList: emailList,
                    arrivalTime: this.timeZone_(this.arrivalDate, this.$store.getters.getTimeZone),
                };
                const data = await this.httpPost_('goods/goods/arrival-notice-send-mail');
                this.$message.success(data.message);
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
			},

			multipleSelectionChange(val, index, email) {
				this.multipleSelection = val
			},

			handleCurrentChange(row, event, column) {
				this.$refs.tableData.toggleRowSelection(row)
			},
		}
	}
</script>
<style lang="less">
	.sendMail {
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
		.electEmail {
			margin-top: 100px;
		}
	}
</style>
