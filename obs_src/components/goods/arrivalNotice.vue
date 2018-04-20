<!-- 到货通知 -->
<template>
	<div class="notice">
		<div class="el-container get-notic-list">
			<div>
				<el-form :inline="true" :model="option" :label-position="labelPosition" ref="option" label-width="100px">
					<el-tabs v-model="activeName">
						<el-tab-pane label="快捷搜索" name="first">
							<el-form-item label="快捷搜索">
								<el-input v-model.trim="searchCode" class="quick-search" placeholder="SKU/外部商品编码/SPU/外部产品编码">
									<el-select filterable clearable :default-first-option='true' v-model="quickTypeVal" slot="prepend" placeholder="请选择">
										<el-option v-for="(value, key, index) in quickSearchType" :key="index" :label="value" :value="key">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-tab-pane>
					</el-tabs>
					<template>
						<el-tabs v-model="activeName">
							<el-tab-pane label="商品筛选" name="first">
								<el-form-item label="仓库" prop="virWhCode">
									<el-select v-model="option.virWhCode" filterable clearable>
										<el-option v-for="item in warehouseData" :key="item.virWhCode" :label="item.virWhCnName" :value="item.virWhCode">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="价格展示" prop="isShopPrice">
									<el-select v-model="option.isShopPrice" filterable clearable :default-first-option='true'>
										<el-option v-for="(item, index) in priceShow" :key="index" :value="index" :label="item"></el-option>
									</el-select>
								</el-form-item>
								<br />
								<el-form-item label="是否发送邮件" prop="isSend">
									<el-select v-model="option.isSend" filterable clearable :default-first-option='true'>
										<el-option v-for="(item, index) in emailSend" :key="index" :value="index" :label="item"></el-option>
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="当前是否生效" prop="currentStatus">
									<el-select v-model="option.currentStatus" filterable clearable :default-first-option='true'>
										<el-option v-for="(item, index) in nowStatus" :key="index" :value="index" :label="item"></el-option>
									</el-select>
								</el-form-item>
								<br />
								<el-form-item label="虚拟数" prop="virtualNumStart">
									<el-input placeholder="数值" icon="search" v-model.trim="option.virtualNumStart">
									</el-input>
								</el-form-item>
								<el-form-item>
									至
								</el-form-item>
								<el-form-item label="" prop="virtualNumEnd">
									<el-input placeholder="数值" icon="search" v-model.trim="option.virtualNumEnd">
									</el-input>
								</el-form-item>
								<el-form-item label="邮箱订阅数" prop="subStart">
									<el-input placeholder="数值" icon="search" v-model.trim="option.subStart">
									</el-input>
								</el-form-item>
								<el-form-item>
									至
								</el-form-item>
								<el-form-item label="" prop="subEnd">
									<el-input placeholder="数值" icon="search" v-model.trim="option.subEnd">
									</el-input>
								</el-form-item>
								<br />
								<el-form-item label="开始时间" prop="date1">
									<el-date-picker v-model="option.date1" type="datetimerange" placeholder="选择开始时间" :editable="false"></el-date-picker>
								</el-form-item>
								<el-form-item label="结束时间" prop="date2">
									<el-date-picker v-model="option.date2" type="datetimerange" placeholder="选择结束时间" :editable="false"></el-date-picker>
								</el-form-item>
								<el-form-item label="起批量" prop="date2">
									<el-date-picker v-model="option.date2" type="datetimerange" placeholder="选择结束时间" :editable="false"></el-date-picker>
								</el-form-item>
								<el-form-item label="最后操作人" prop="adminName">
									<el-input placeholder="快速搜索: 拼音/中文" icon="search" v-model="option.adminName">
									</el-input>
								</el-form-item>
								<el-form-item label="起批量" prop="minWholesaleNumStart">
									<el-input v-model="option.minWholesaleNumStart"></el-input>
								</el-form-item>
								<el-form-item>
									至
								</el-form-item>
								<el-form-item prop="minWholesaleNumEnd">
									<el-input v-model="option.minWholesaleNumEnd"></el-input>
								</el-form-item>
								<el-form-item style="float: right;">
									<el-button type="primary" icon="search" @click="filtrate">筛选</el-button>
									<el-button type="danger" icon="close" @click="resetForm">重置</el-button>
								</el-form-item>
							</el-tab-pane>
						</el-tabs>
					</template>
				</el-form>
			</div>
			<div>
				<template>
					<el-tabs v-model="activeName">
						<el-tab-pane label="批量操作" name="first">
							<el-row type="flex" justify="start" :gutter="10">
								<el-col :span="2">
									<el-button type="primary" icon="fa-files-o" @click="copy('goodSn')" :disabled="this.multipleSelection.length === 0">复制SKU</el-button>
								</el-col>
								<el-col :span="2">
									<el-button type="primary" icon="fa-files-o" @click="copy('goodsWebSku')" :disabled="this.multipleSelection.length === 0">复制外部商品编码</el-button>
								</el-col>
							</el-row>
						</el-tab-pane>
					</el-tabs>
				</template>
			</div>
			<div>
				<el-table :data="tableListData" ref="tableListData" border tooltip-effect="dark" fit v-loading="tableLoading" @row-click="handleCurrentChange" @selection-change="multipleSelectionChange">
					<el-table-column type="selection">
					</el-table-column>
					<el-table-column prop="goodTitle" label="商品标题" width="160">
					</el-table-column>
					<el-table-column label="主图" width="160">
						<template scope="scope">
							<img class="table-img" :src="self.domain + scope.row.mainImage.gridUrl" width="90" height="120">
						</template>
					</el-table-column>
					<el-table-column prop="goodsWebSpu" label="外部产品编码" width="160">
					</el-table-column>
					<el-table-column prop="goodsSpu" label="SPU" width="130">
					</el-table-column>
					<el-table-column prop="goodsWebSku" label="外部商品编码" width="160">
					</el-table-column>
					<el-table-column prop="goodSn" label="SKU" width="130">
					</el-table-column>
					<el-table-column label="价格展示" prop="isShow" width="80">
						<template scope="scope">
							<i :class="{'el-icon-circle-check color-success': scope.row.isShow == 1, 'el-icon-circle-cross color-danger': scope.row.isShow == 0}"></i>
						</template>
					</el-table-column>
					<el-table-column prop="arrivalVirtualNum" label="虚拟数">
					</el-table-column>
					<el-table-column prop="subCount" label="邮箱订阅数">
					</el-table-column>
					<el-table-column label="邮箱发送状态" width="80">
						<template scope="scope">
							<i :class="{'el-icon-circle-check color-success': scope.row.isSend == 1, 'el-icon-circle-cross color-danger': scope.row.isSend == 0}"></i>
						</template>
					</el-table-column>
					<el-table-column prop="minWholesaleNum" label="起批量" width="80">
					</el-table-column>
					<el-table-column label="商品状态" width="150">
						<template scope="scope">
							<p v-for="(item, index) in scope.row.goodsInfoExtendList" :key="index">{{self.tableRes('platforms', item.platform)}}: {{self.tableRes('goodStatusOpts', item.goodsStatus)}}</p>
						</template>
					</el-table-column>
					<el-table-column label="当前生效状态" width="100">
						<template scope="scope">
							{{nowStatus[scope.row.currentStatus]}}
						</template>
					</el-table-column>
					<el-table-column label="生效开始时间" width="150">
						<template scope="scope">
							{{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}}
						</template>
					</el-table-column>
					<el-table-column label="生效结束时间" width="150">
						<template scope="scope">
							{{self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone)}}
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" width="150px" column-key="handle">
						<template scope="scope">
							<router-link :to="{name: 'goods_goodsEdit', query: {goodsSn: scope.row.goodSn, virWhCode: scope.row.vhCode}}">
								<el-button type="primary" size="small" class="btn">查看商品详情</el-button>
							</router-link>
							<div v-if="scope.row.currentStatus == 3 && scope.row.goodsInfoExtendList && scope.row.goodsInfoExtendList.some((item) => {return item.goodsStatus == 2})">
								<router-link :to="{name: 'goods_sendMail', query: {pageNo: 0, pageSize: 10, arrivalNoticeCode: scope.row.arrivalNoticeCode, virWhCode: scope.row.vhCode, goodSn: scope.row.goodSn}}">
									<el-button size="small">发送邮件</el-button>
								</router-link>
							</div>
							<div v-else>
								<router-link :to="{name: 'goods_viewMessages', query: {pageNo: 0, pageSize: 10, arrivalNoticeCode: scope.row.arrivalNoticeCode, virWhCode: scope.row.vhCode, goodSn: scope.row.goodSn}}">
									<el-button type="primary" size="small">查看订阅邮箱</el-button>
								</router-link>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<div>
				<div class="block" style="float: right;margin-top: 30px;">
					<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50,100,200,400]" :page-size="option.pageSize" :current-page="option.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
					<input id="copyTxt" v-model="copyTxt" class="hidden-input">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			function setOpts(arr) {
				if(Array.isArray(arr)) {
					let temp = {};
					arr.map(item => {
						let tempArr = item.split('=');
						temp[tempArr[1]] = {};
						temp[tempArr[1]].label = tempArr[0];
						temp[tempArr[1]].value = tempArr[1];
					})

					return temp;
				} else {
					throw new Error('必须传入一组字符串数组,每个字符串格式为"label=value"');
				}
			}
			let turingNumber = function(rule, value, callback) {
				if(Number(value) > 0) {
					callback()
				} else {
					callback(new Error('请输入数字值且大于0'))
				}
			}
			return {
				self: this,
				copyTxt: '',
				labelPosition: 'right',
				quickTypeVal: '',
				searchCode: '',
				tableLoading: false,
				activeName: 'first',
				tableListData: [],
				warehouseData: [],
				multipleSelection: [],
				total: 1,
				option: {
					pageNo: 1,
					pageSize: 10,
					goodSnList: [],
					goodsWebSpu: '',
					goodsSpu: '',
					goodsWebSku: '',
					isShopPrice: '',
					whName: '',
					virtual: '',
					currentStatus: '',
					// goodStatus: '',
					subStart: '',
					subEnd: '',
					virWhCode: '',
					adminName: '',
					virtualNumStart: '',
					virtualNumEnd: '',
					quickSearch1: '',
					isSend: '',
					date1: [],
					date2: [],
					date3: [],
					minWholesaleNumEnd: '',
					minWholesaleNumStart: ''
				},
				quickSearchType: {
					'1': 'sku',
					'2': '外部商品编码',
					'3': 'spu',
					'4': '外部产品编码'
				},
				// statusOpt: {
				// 	'2': '上架',
				// 	'3': '下架',
				// 	'4': '到货通知',
				// 	'5': '谍照'
				// },
				emailSend: {
					'0': '否',
					'1': '是',
				},
				priceShow: {
					'0': '否',
					'1': '是',
				},
				nowStatus: {
					'1': '未生效',
					'2': '已生效',
					'3': '已失效',
					'4': '已过期'
				},
				opts: {
					platforms: setOpts(['PC=1', 'M版=2', 'IOS=3', 'Android=4', 'PAD=5']),
					goodStatusOpts: setOpts(['上架=2', '下架=3', '到货通知=4', '谍照=5'])
				},
			}
		},

		created() {
			this.warehouseList()
		},

		computed: {
			domain() {
				return this.$store.getters.getDomain + '/';
			}
		},

		methods: {
			tableRes(opt, params) {
				let obj = this.opts[opt];
				if(obj[params]) {
					return obj[params].label;
				} else {
					return ''
				}
			},

			async geTtabList() {
				var timeArr = this.timeZone_(this.option.date1, this.$store.getters.getTimeZone);
				var timeEnd = this.timeZone_(this.option.date2, this.$store.getters.getTimeZone);
				var operateEnd = this.timeZone_(this.option.date3, this.$store.getters.getTimeZone);
				if(Array.isArray(timeArr) && timeArr.length >= 2) {
					this.option.startDateMin = timeArr[0];
					this.option.startDateMax = timeArr[1];
				};
				if(Array.isArray(timeEnd) && timeEnd.length >= 2) {
					this.option.endDateMin = timeEnd[0];
					this.option.endDateMax = timeEnd[1];
				};
				if(Array.isArray(operateEnd) && operateEnd.length >= 2) {
					this.option.lastOperateMin = operateEnd[0];
					this.option.lastOperateMax = operateEnd[1];
				};
				if(this.quickTypeVal.toString() == 1) {
					this.option.goodSnList = this.searchCode.split(',');
					this.option.goodsWebSku = '';
					this.option.goodsWebSpu = '';
					this.option.goodsSpu = ''
				} else if(this.quickTypeVal.toString() == 2) {
					this.option.goodsWebSku = this.searchCode;
					this.option.goodSnList = '';
					this.option.goodsWebSpu = '';
					this.option.goodsSpu = ''
				} else if(this.quickTypeVal.toString() == 3) {
					this.option.goodsSpu = this.searchCode;
					this.option.goodsWebSku = '';
					this.option.goodSnList = '';
					this.option.goodsWebSpu = ''
				} else if(this.quickTypeVal.toString() == 4) {
					this.option.goodsWebSpu = this.searchCode;
					this.option.goodsSpu = '';
					this.option.goodSnList = '';
					this.option.goodsWebSku = ''
				} else {
					this.option.goodsWebSpu = '';
					this.option.goodsSpu = '';
					this.option.goodSnList = '';
					this.option.goodsWebSku = ''
				};

				this.tableLoading = true;

				let params = {};
				for (let i in this.option) {
					if (this.option[i] !== '') {
						params[i] = this.option[i]
					}
				}
                try {
                    let data = await this.httpGet_('goods/goods/get-notice-list', {params: params});
                    this.tableListData = data.list;
                    this.total = data.totalCount;
                } finally {
                    this.tableLoading = false;
                }
			},

			async warehouseList() {
                let data = await this.httpGet_('stock/warehouse/vir-wh-drop-down');
                this.warehouseData = data.list;

                this.warehouseData.forEach((item) => {
                    if(item.isDefault === 1) {
                        this.option.virWhCode = item.virWhCode;
                        this.geTtabList()
                    }
                });
			},

			copy(params) {
				if(this.multipleSelection.length > 0) {
					let temp = [];
					this.multipleSelection.map(item => {
						temp.push(item[params]);
					});

					this.copyTxt = temp.join(',');
					var cpt = document.getElementById('copyTxt');
					cpt.value = this.copyTxt;
					cpt.select();
					try {
						if(document.execCommand('copy', false, null)) {
							this.$message.success('复制成功')
						} else {
							this.$message({
								type: 'warning',
								message: '浏览器不可用复制'
							});
						}
					} catch(err) {
						this.$message.error(err);
					}
				} else {
					this.$message.warning('至少选择一项');
				}
			},

			ChangePage(val) {
				this.option.pageNo = val;
				this.geTtabList();
			},

			ChangePageSize(val) {
				this.option.pageSize = val;
				this.geTtabList();
			},

			resetForm() {
				this.quickTypeVal = '';
				this.searchCode = '';
				this.$refs.option.resetFields();
				this.warehouseData.forEach((item) => {
					if(item.isDefault === 1) {
						this.option.virWhCode = item.virWhCode
					}
				})
			},

			filtrate() {
				if(this.quickTypeVal > 0 && (!this.searchCode || this.searchCode.toString().trim() == '')) {
					this.$message('请输入外部商品编码/SKU');
					return;
				} else if(this.quickTypeVal <= 0 && (this.searchCode || !this.searchCode.toString().trim() == '')) {
					this.$message('请选择快捷筛选类型');
					return;
				} else if(!this.option.virtualNumStart == '' && this.option.virtualNumEnd == '') {
					this.$message('请填写虚拟数结束值');
					return;
				} else if(!this.option.subStart == '' && this.option.subEnd == '') {
					this.$message('请填写邮箱订阅数结束值');
					return;
				} else if(this.option.virtualNumStart == '' && !this.option.virtualNumEnd == '') {
					this.$message('请填写虚拟数起始值');
					return;
				} else if(this.option.subStart == '' && !this.option.subEnd == '') {
					this.$message('请填写邮箱订阅数起始值');
					return;
				} else if(Number(this.option.virtualNumStart) > Number(this.option.virtualNumEnd)) {
					this.$message('虚拟数起始值不能大于结束值');
				} else if(Number(this.option.subStart) > Number(this.option.subEnd)) {
					this.$message('邮箱订阅数起始值不能大于结束值');
				} else if(Number(this.option.minWholesaleNumStart) > Number(this.option.minWholesaleNumEnd)) {
					this.$message('起批量起始值不能大于结束值');
				} else if(this.option.virWhCode == '') {
					this.$message('请选择仓库');
				} else {
					this.geTtabList()
				}
			},

			handleCurrentChange(row, event, column) {
				if(column.columnKey != 'handle') {
					this.$refs.tableListData.toggleRowSelection(row);
				}
			},

			multipleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}
	}
</script>

<style lang="less">
	.notice {
		.el-table {
			margin-top: 10px;
		}
		.el-table th,
		.el-table td {
			text-align: center;
		}
		.el-table .el-button.width-plus {
			padding: 10px 30px;
		}
		.el-table th>.cell {
			line-height: 1.5;
		}
		.el-pagination {
			text-align: right;
			margin-top: 10px;
		}
		.btn {
			margin-bottom: 10px;
		}
		h3 {
			margin-bottom: 20px;
		}
		.item {
			margin-top: 10px;
		}
	}</style>
