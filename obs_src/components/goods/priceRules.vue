<!-- 价格规则 -->
<template>
	<div>
		<div class="el-container priceRules">
			<el-form ref="baseForm" :rules="rules" :model="baseForm" label-width="180px">
				<el-form-item label="商品计费价格(￥)">
					<el-radio-group v-model="baseForm.priceType">
						<el-radio :label="1">出货价</el-radio>
						<el-radio :label="2">进货价/采购价</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="商品批发采购价规则(￥)">
					<el-checkbox v-model="baseForm.useBatchPrice" :label="1">启用</el-checkbox>
				</el-form-item>
				<el-form-item label="站点最低利润率" prop="lowestRate">
					<el-row>
						<el-col :span="5">
							<el-input v-model.trim="baseForm.lowestRate"></el-input>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="网站基础价格汇率" prop="exchangeRate">
					<el-row>
						<el-col :span="5">
							<el-input disabled v-model.trim="baseForm.exchangeRate"></el-input>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="商品价格尾数" prop="baseEndPrice">
					<el-row>
						<el-col :span="5">
							<el-input v-model.trim="baseForm.baseEndPrice"></el-input>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="商品包装费用(＄)" prop="basePackageFee">
					<el-row>
						<el-col :span="5">
							<el-input v-model.trim="baseForm.basePackageFee"></el-input>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-button v-if="self.showAction_('goods/price/virhouse-lowest-rate')" type="primary" @click="baseSubmit"><i class="el-icon-check"></i> 保存基础设置</el-button>
				</el-form-item>
			</el-form>
			<el-tabs active-name="first">
				<el-tab-pane label="商品价格尾数个性化设置" name="first">
					<el-row>
						<el-col :span="21">
							<el-table ref="priceConfigData" :data="priceConfigData" border style="width: 100%">
								<el-table-column prop="goodEndPriceRegion" label="商品价格区间"></el-table-column>
								<el-table-column prop="endPriceRegion" label="商品价格尾数"></el-table-column>
								<el-table-column prop="catName" label="商品分类"></el-table-column>
								<el-table-column prop="endPrice" label="价格尾数统一"></el-table-column>
								<el-table-column label="操作">
									<template scope="scope">
										<el-button v-if="self.showAction_('goods/price/modify-end-price-config')" type="primary" icon="edit" size="small" @click="openEditPrice(scope.row)">编辑</el-button>
										<el-button v-if="self.showAction_('goods/price/delete-end-price-person-config')" type="danger" icon="close" size="small" @click="deleteInPrice(scope.row, scope.$index)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-col>
						<el-col :span="2" style="margin-left: 20px;">
							<el-button v-if="self.showAction_('goods/price/add-end-price-config')" type="primary" icon="plus" @click="addRowInPrice">添加</el-button>
						</el-col>
					</el-row>
				</el-tab-pane>
			</el-tabs>
			<el-tabs active-name="first">
				<el-tab-pane label="商品包装费用个性化设置" name="first">
					<el-row>
						<el-col :span="21">
							<el-table ref="packageFeeData" :data="packageFeeData" border style="width: 100%">
								<el-table-column prop="packagePriceRegion" label="商品计费价格区间"></el-table-column>
								<el-table-column prop="weightRegion" label="商品计费重量区间"></el-table-column>
								<el-table-column prop="catName" label="商品分类"></el-table-column>
								<el-table-column prop="packageFee" label="商品包装费"></el-table-column>
								<el-table-column label="操作">
									<template scope="scope">
										<el-button v-if="self.showAction_('goods/price/update-package-fee-person-config')" type="primary" icon="edit" size="small" @click="openEditPackage(scope.row)">编辑</el-button>
										<el-button v-if="self.showAction_('goods/price/delete-package-fee-person-config')" type="danger" icon="close" size="small" @click="deleteInPackage(scope.row, scope.$index)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-col>
						<el-col :span="2" style="margin-left: 20px;">
							<el-button v-if="self.showAction_('goods/price/batch-insert-package-config')" type="primary" icon="plus" @click="addRowInPackage">添加</el-button>
						</el-col>
					</el-row>
				</el-tab-pane>
			</el-tabs>
		</div>
		<el-dialog title="参数设置" :visible.sync="dialogInPriceVisible">
			<el-form :model="updatedPriceConfig" label-width="160px" :rules="rules_1" ref="updatedPriceConfig" :inline="true">
				<el-row>
					<el-form-item label="商品价格区间" prop="goodEndPriceRegionObj.begin">
						<el-input v-model.trim="updatedPriceConfig.goodEndPriceRegionObj.begin"></el-input>
					</el-form-item>
					<el-form-item>
						-
					</el-form-item>
					<el-form-item prop="goodEndPriceRegionObj.end">
						<el-input v-model.trim="updatedPriceConfig.goodEndPriceRegionObj.end"></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-form-item label="商品价格尾数区间" prop="endPriceRegionObj.begin">
						<el-input v-model.trim="updatedPriceConfig.endPriceRegionObj.begin"></el-input>
					</el-form-item>
					<el-form-item>
						-
					</el-form-item>
					<el-form-item prop="endPriceRegionObj.end">
						<el-input v-model.trim="updatedPriceConfig.endPriceRegionObj.end"></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-form-item label="网站所有分类" prop="category1">
						<el-select v-model="form.category1" placeholder="请选择" multiple filterable :default-first-option='true'>
							<el-option v-for="option in options_1" :key="option.id" :label="option.categoryMultiLang.categoryName" :value="option.id"></el-option>
						</el-select>
					</el-form-item>
				</el-row>

				<el-row>
					<el-form-item label="价格尾数统一" prop="endPrice">
						<el-input v-model.trim="updatedPriceConfig.endPrice"></el-input>
					</el-form-item>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogInPriceVisible = false">取消</el-button>
				<el-button type="primary" @click="editPrice">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="参数设置" :visible.sync="dialogInPackageVisible">
			<el-form :model="updatedPackageFee" label-width="160px" :rules="rules_2" ref="updatedPackageFee" :inline="true">
				<el-row>
					<el-form-item label="商品计费价格区间" prop="packagePriceRegionObj.begin">
						<el-input v-model.trim="updatedPackageFee.packagePriceRegionObj.begin"></el-input>
					</el-form-item>
					<el-form-item>
						-
					</el-form-item>
					<el-form-item prop="packagePriceRegionObj.end">
						<el-input v-model.trim="updatedPackageFee.packagePriceRegionObj.end"></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-form-item label="商品计费重量区间" prop="weightRegionObj.begin">
						<el-input v-model.trim="updatedPackageFee.weightRegionObj.begin"></el-input>
					</el-form-item>
					<el-form-item>
						-
					</el-form-item>
					<el-form-item prop="weightRegionObj.end">
						<el-input v-model.trim="updatedPackageFee.weightRegionObj.end"></el-input>
					</el-form-item>
				</el-row>

				<el-row>
					<el-form-item label="网站所有分类">
						<el-select v-model="form.category1" placeholder="请选择" multiple filterable>
							<el-option v-for="option in options_1" :key="option.id" :label="option.categoryMultiLang.categoryName" :value="option.id"></el-option>
						</el-select>
					</el-form-item>
				</el-row>

				<el-row>
					<el-form-item label="商品包装费" prop="packageFee">
						<el-input v-model.trim="updatedPackageFee.packageFee"></el-input>
					</el-form-item>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogInPackageVisible = false">取消</el-button>
				<el-button type="primary" @click="editPackage">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			let checkRate = (rule, value, callback) => {
				if(Number(value) > 0) {
					callback();
				} else {
					callback(new Error('正数,且不可为0'));
				}
			}
			let checkRate_1 = (rule, value, callback) => {
				let exp = /^[0-9]\d*(\.\d{1,3})?$/
				if(exp.test(value) && value > 0) {
					callback();
				} else {
					callback(new Error('大于0的数值，最多小数位三位'));
				}
			}
			let checkRate_2 = (rule, value, callback) => {
				let exp = /^0\.[0-9]{1,2}?$/
				if(exp.test(value) && value * 1 < 1 || value == "" || value * 1 == 0) {
					callback();
				} else {
					callback(new Error('大于0的小数，最多两位小数'));
				}
			}
			let checkRate_3 = (rule, value, callback) => {
				let exp = /^[0-9]\d*(\.\d+)?$/
				if(exp.test(value) && value * 1 > 0 || value == "") {
					callback();
				} else {
					callback(new Error('大于0的正数'));
				}
			}
			let checkRate_4 = (rule, value, callback) => {
				let exp = /^[0-9]\d*(\.\d{1,2})?$/
				if(!exp.test(value)) {
					callback(new Error('大于等于0的数值，最多两位小数'));
				} else {
					callback();
				}
			}

			let checkRate_5 = (rule, value, callback) => {
				let exp = /^[0-9]\d*(\.\d{1,3})?$/
				if(!exp.test(value) || value * 1 == 0) {
					callback(new Error('大于等于0的数值，最多三位小数'));
				} else {
					callback();
				}
			}
			return {
				self: this,
				items: '',
				editId: '',
				editId_1: '',
				endCategoryIdList: '',
				baseForm: {
					priceType: '',
					useBatchPrice: '',
					lowestRate: '',
					baseEndPrice: '',
					basePackageFee: '',
					exchangeRate: ''
				},
				form: {
					category1: '',
					categoryName: '',
				},
				priceConfigData: [],
				packageFeeData: [],
				dialogInPriceVisible: false,
				dialogInPackageVisible: false,
				updatedPriceConfig: {
					id: '',
					goodEndPriceRegion: '',
					goodEndPriceRegionObj: {
						begin: '',
						end: ''
					},
					endPriceRegion: '',
					endPriceRegionObj: {
						begin: '',
						end: ''
					},
					endCategoryId: '',
					endCategoryIdArr: [],
					endPrice: ''
				},
				updatedPackageFee: {
					id: '',
					packagePriceRegion: '',
					packagePriceRegionObj: {
						begin: '',
						end: ''
					},
					weightRegion: '',
					weightRegionObj: {
						begin: '',
						end: ''
					},
					packageCategoryId: '',
					packageCategoryIdArr: [],
					packageFee: ''
				},
				footCats: [],
				selectedCats: [],
				options_1: [],
				rules: {
					exchangeRate: [{
						required: true,
						message: '请输入数值'
					}, {
						required: true,
						validator: checkRate
					}],
					lowestRate: [{
						required: true,
						message: '请输入数值'
					}, {
						required: true,
						validator: checkRate_1
					}],
					baseEndPrice: [{
						validator: checkRate_2
					}],
					basePackageFee: [{
						validator: checkRate_3
					}]
				},
				rules_1: {
					'goodEndPriceRegionObj.begin': [{
						required: true,
						message: '不能为空'
					}, {
						required: true,
						validator: checkRate_4
					}],
					'goodEndPriceRegionObj.end': [{
						required: true,
						message: '不能为空'
					}, {
						required: true,
						validator: checkRate_4
					}],
					'endPriceRegionObj.begin': [{
						required: true,
						message: '不能为空'
					}, {
						required: true,
						validator: checkRate_2
					}],
					'endPriceRegionObj.end': [{
						required: true,
						message: '不能为空'
					}, {
						required: true,
						validator: checkRate_2
					}],
					endPrice: [{
						required: true,
						validator: checkRate_2
					}]
				},
				rules_2: {
					'packagePriceRegionObj.begin': [{
						required: true,
						message: '不能为空'
					}, {
						required: true,
						validator: checkRate_4
					}],
					'packagePriceRegionObj.end': [{
						required: true,
						message: '不能为空'
					}, {
						required: true,
						validator: checkRate_4
					}],
					'weightRegionObj.begin': [{
						required: true,
						message: '不能为空'
					}, {
						required: true,
						validator: checkRate_5
					}],
					'weightRegionObj.end': [{
						required: true,
						message: '不能为空'
					}, {
						required: true,
						validator: checkRate_5
					}],
					packageFee: [{
						required: true,
						validator: checkRate
					}]
				}
			}
		},

		created() {
			this.getData();
			this.getBootCat()
		},

		methods: {
			async getData() {
                const data = await this.httpGet_('goods/price/get-price-config', {
                    params: {
                        isLeaves: true
                    }
                });
                if(data != '') {
                    this.baseForm = data.basePriceConfigResp[0];
                    this.baseForm.useBatchPrice == 1 ? true : false
                    if(this.baseForm.useBatchPrice == 1) {
                        this.baseForm.useBatchPrice = true;
                    } else if(this.baseForm.useBatchPrice == 2) {
                        this.baseForm.useBatchPrice = false;
                    };

                    this.priceConfigData = data.pricePersonConfigRespList;
                    this.packageFeeData = data.packageFeeList;
                    this.baseForm.priceType = this.baseForm.priceType;
                    this.baseForm.baseEndPrice = this.baseForm.baseEndPrice;
                    this.baseForm.basePackageFee = this.baseForm.basePackageFee
                }
			},

			async getBootCat() {
                const data = await this.httpGet_('goods/category/list', {
                    params: {
                        isLeaves: false,
                        parentId: 0,
                        isPage: 2
                    }
                });
                this.options_1 = data.list;
			},

			baseSubmit() {
				this.$refs.baseForm.validate((valid) => {
					if(valid) {
						if(this.baseForm.useBatchPrice === true) {
							this.baseForm.useBatchPrice = 1;
						} else {
							this.baseForm.useBatchPrice = 2;
						};

						let params = {};
						let paramsRates = {
							lowestRate: this.baseForm.lowestRate
						};

						for(let i in this.baseForm) {
							let item = this.baseForm[i];
							if(Boolean(item)) {
								params[i] = item;
							}
						}
						this.$http.post('goods/price/virhouse-lowest-rate', paramsRates).then(res => {
							if(res.body.data == false) {
								this.$message('站点最低利润率大于分类/仓库利润率，保存失败');
								return
							} else {
								this.$http.post('goods/price/public-insert-base-config', params).then(res => {
									if(res.body.code === 0) {
										this.$message.success(res.body.message);
										if(this.baseForm.useBatchPrice == 1) {
											this.baseForm.useBatchPrice = true;
										} else if(this.baseForm.useBatchPrice == 2) {
											this.baseForm.useBatchPrice = false;
										}
									} else {
										this.$message.error(res.body.message);
									}
								})
							}
						})
					}
				})
			},

			openEditPrice(row) {
				this.dialogInPriceVisible = true;
				if(!row) {
					this.form.category1 = [];
					this.updatedPriceConfig = {
						id: -1,
						goodEndPriceRegionObj: {
							begin: '',
							end: ''
						},
						endPriceRegionObj: {
							begin: '',
							end: ''
						},
						endPrice: ''
					};
					this.editId = '';
					this.selectedCats = [];
				} else {
					this.editId = row.id;
					this.form.category1 = row.endCategoryId ? row.endCategoryId.split(',').map((e) =>{return e * 1 }) : [];

					var goodEndPriceRegion = row.goodEndPriceRegion.split('-');
					var endPriceRegion = row.endPriceRegion.split('-');
					this.updatedPriceConfig.goodEndPriceRegionObj = {
						begin: goodEndPriceRegion[0],
						end: goodEndPriceRegion[1]
					};
					this.updatedPriceConfig.endPriceRegionObj = {
						begin: endPriceRegion[0],
						end: endPriceRegion[1]
					};
					this.updatedPriceConfig.endPrice = row.endPrice;
				}
			},

			editPrice() {
				this.$refs.updatedPriceConfig.validate(async (valid) => {
					if(valid) {
						if(Number(this.updatedPriceConfig.goodEndPriceRegionObj.begin) >= Number(this.updatedPriceConfig.goodEndPriceRegionObj.end)) {
							this.$message.warning('商品价格区间起始值不能大于或等于结束值');
							return
						} else if(Number(this.updatedPriceConfig.endPriceRegionObj.begin) >= Number(this.updatedPriceConfig.endPriceRegionObj.end)) {
							this.$message.warning('商品价格尾数区间起始值不能大于或结束值');
							return
						}
						var categorysList = [];
						categorysList.push(this.form.category1);
						var params = {
							goodEndPriceRegion: this.updatedPriceConfig.goodEndPriceRegionObj.begin + '-' + this.updatedPriceConfig.goodEndPriceRegionObj.end,
							endPriceRegion: this.updatedPriceConfig.endPriceRegionObj.begin + '-' + this.updatedPriceConfig.endPriceRegionObj.end,
							endCategoryId: categorysList.join(','),
							endPrice: this.updatedPriceConfig.endPrice
						};
						if(!this.editId) {
                            const data = await this.httpPost_('goods/price/add-end-price-config', {
                                reqList: [params],
                            });
                            this.dialogInPriceVisible = false;
                            this.$message.success(data.message);
                            this.getData();
						} else {
							params.id = this.editId

                            const data = await this.httpPost_('goods/price/modify-end-price-config', params);
                            this.dialogInPriceVisible = false;
                            this.$message.success(data.message);
                            this.getData();
						}
					}
				})
			},

			openEditPackage(row) {
				this.dialogInPackageVisible = true;
				if(!row) {
					this.form.category1 = [];
					this.updatedPackageFee = {
						id: -1,
						packagePriceRegionObj: {
							begin: '',
							end: ''
						},
						weightRegionObj: {
							begin: '',
							end: ''
						},
						packageFee: ''
					};
					this.selectedCats = [];
				} else {
					this.editId_1 = row.id;
					this.form.category1 = [];
					row.packageCategoryId.split(',').forEach((el) => {
						this.form.category1.push(Number(el))
					});

					var packagePriceRegion = row.packagePriceRegion.split('-');
					this.updatedPackageFee.packagePriceRegionObj = {
						begin: packagePriceRegion[0],
						end: packagePriceRegion[1]
					};

					var weightRegion = row.weightRegion.split('-');
					this.updatedPackageFee.weightRegionObj = {
						begin: weightRegion[0],
						end: weightRegion[1]
					};
					this.updatedPackageFee.packageFee = row.packageFee;
				}
			},

			editPackage() {
				this.$refs.updatedPackageFee.validate(async (valid) => {
					if(valid) {
						if(Number(this.updatedPackageFee.packagePriceRegionObj.begin) >= Number(this.updatedPackageFee.packagePriceRegionObj.end)) {
							this.$message.warning('商品计费价格区间起始值不能大于或等于结束值');
							return
						}
						if(Number(this.updatedPackageFee.weightRegionObj.begin) >= Number(this.updatedPackageFee.weightRegionObj.end)) {
							this.$message.warning('商品计费重量区间间起始值不能大于或等于结束值');
							return
						}
						var categorysList = [];
						categorysList.push(this.form.category1);
						var params = {
							packagePriceRegion: this.updatedPackageFee.packagePriceRegionObj.begin + '-' + this.updatedPackageFee.packagePriceRegionObj.end,
							packageCategoryId: categorysList.join(','),
							weightRegion: this.updatedPackageFee.weightRegionObj.begin + '-' + this.updatedPackageFee.weightRegionObj.end,
							packageFee: this.updatedPackageFee.packageFee
						};

						if(this.updatedPackageFee.id == -1) {
                            const data = await this.httpPost_('goods/price/batch-insert-package-config', {
                                reqList: [params]
                            });
                            this.dialogInPackageVisible = false;
                            this.$message.success(data.message);
                            this.getData();
						} else {
							this.form.category1 = [];
							params.id = this.editId_1;

                            const data = await this.httpPost_('goods/price/update-package-fee-person-config', params);
                            this.dialogInPackageVisible = false;
                            this.$message.success(data.message);
                            this.getData();
						}
					}
				})
			},

			async deleteInPrice(obj, index) {
				if(obj.id == -1) {
					this.priceConfigData.splice(index, 1);
				} else {
					var params = {
						endCategoryId: obj.endCategoryId,
						goodEndPriceRegion: obj.goodEndPriceRegion,
						endPriceRegion: obj.endPriceRegion,
						endPrice: obj.endPrice,
						id: obj.id
					};

                    const data = await this.httpPost_('goods/price/delete-end-price-person-config', params);
                    this.priceConfigData = [];
                    this.$message.success(data.message);
                    this.getData();
				}
			},

			async deleteInPackage(obj, index) {
				if(obj.id === -1) {
					this.packageFeeData.splice(index, 1)
				} else {
					var params = {
						packagePriceRegion: obj.packagePriceRegion,
						packageCategoryId: obj.packageCategoryId,
						weightRegion: obj.weightRegion,
						packageFee: obj.packageFee,
						id: obj.id
					};

                    const data = await this.httpPost_('goods/price/delete-package-fee-person-config', params);
                    this.packageFeeData = [];
                    this.$message.success(data.message);
                    this.getData();
				}
			},

			addRowInPrice() {
				this.openEditPrice();
			},

			addRowInPackage() {
				this.openEditPackage();
			}
		}
	}
</script>

<style scoped>
	.separator {
		padding: 10px 0;
	}
</style>
