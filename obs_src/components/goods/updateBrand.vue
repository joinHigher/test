<!-- 品牌编辑 -->
<template>
	<div class="edit-brand">
		<div class="el-container">
			<el-tabs class="full" type="card" @tab-click="langClick" v-model="lang">
				<el-tab-pane v-for="item in langOpt" :label="item.language_ch" :name="item.language_en" :key="item.language_en"></el-tab-pane>
			</el-tabs>
			<el-form :model="brandInfoList" ref="brandInfoList" :rules="rules" label-width="120px">
				<template>
					<el-tabs v-model="activeName_1">
						<el-tab-pane label="品牌基础信息" name="first">
							<el-form-item label="品牌名称:" prop="brandName" v-if="lang === 'en'">
								{{brandInfoList.brandName}}
							</el-form-item>
							<el-form-item label="品牌代码:" prop="brandCode">
								{{brandInfoList.brandCode}}
							</el-form-item>
							<el-form-item label="品牌标题:" prop="brandTitle">
								<el-input v-model.trim="brandInfoList.brandTitle"></el-input>
							</el-form-item>
							<el-form-item label="品牌排序:" prop="sort" v-if="lang === 'en'">
								<el-input v-model.trim="brandInfoList.sort"></el-input v-if="lang === 'en'">
							</el-form-item>
							<el-form-item label="启用状态" v-if="lang === 'en'">
								<el-checkbox v-model="checked_1"><span class="color-danger">*勾选后, 该品牌可在网站展示以及被访问</span></el-checkbox>
							</el-form-item>
<!-- 							<el-form-item label="首页显示" v-if="lang === 'en'">
								<el-checkbox v-model="checked"><span class="color-danger">*勾选后, 该品牌在网站首页展示</span></el-checkbox>
							</el-form-item> -->
							<el-form-item label="品牌简介:" prop="brandBrief">
								<el-input type="textarea" v-model.trim="brandInfoList.brandBrief" :rows="5"></el-input>
							</el-form-item>
<!-- 							<el-form :model="dataForm" ref="formSrc" label-width="120px">
								<el-row v-for="(item, index) in dataForm.shipRegionCompensateList" :key="index" :gutter="10">
									<el-col :span="5">
										<el-form-item :prop="'shipRegionCompensateList.' + index + '.shipRegion'" :rules="rules.brandDesc" :label="index === 0 ? '品牌5句话' : ''">
											<el-input type="textarea" v-model.trim="item.shipRegion" :autosize="{maxRows: 3}"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="10">
										<el-form-item>
                                            <el-button v-if="index === 0" type="primary" @click="shipRegionCompensateAdd"><i class="el-icon-plus"></i></el-button>
											<el-button v-if="dataForm.shipRegionCompensateList.length > 1" type="danger" @click="shipRegionCompensateDel(index)"><i class="el-icon-minus"></i></el-button>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form> -->
							<el-form-item label="品牌视频:" prop="video" v-if="lang === 'en'">
								<el-input v-model.trim="brandInfoList.video"></el-input>
							</el-form-item>
							<el-form-item label="品牌logo图片:" prop="brandLogo" v-if="lang === 'en'">
								<el-input v-model.trim="brandInfoList.brandLogo"></el-input>
							</el-form-item>
						</el-tab-pane>
					</el-tabs>
				</template>
				<template>
					<el-tabs v-model="activeName_2">
						<el-tab-pane label="SEO标题" name="first">
							<el-form-item label="title（SEO）:" prop="seoTitle">
								<el-input v-model.trim="brandInfoList.seoTitle"></el-input>
							</el-form-item>
                            <el-form-item label="关键字（SEO）:" prop="seoKeyWord">
                                <el-input v-model.trim="brandInfoList.seoKeyWord"></el-input>
                            </el-form-item>
							<el-form-item label="描述（SEO）:" prop="seoDesc">
								<el-input v-model.trim="brandInfoList.seoDesc"></el-input>
							</el-form-item>
						</el-tab-pane>
					</el-tabs>
				</template>
				<el-form-item>
					<el-button v-if="self.showAction_('goods/brand/update-brands')" type="primary" @click="saveEdit" style="margin-right: 20px;">保存</el-button>
					<router-link :to="{path:'/goods/brand/list'}">
						<el-button>取消</el-button>
					</router-link>
				</el-form-item>
			</el-form>

		</div>
		<!-- 弹窗S -->
		<!-- 弹窗E -->
	</div>
</template>

<script>
	export default {
		data() {
			let brandRate = (rule, value, callback) => {
				let exp = /^[1-9]\d*$/
				if(exp.test(value)) {
					callback();
				} else {
					callback(new Error('品牌排序为大于0的整数'));
				}
			}
			return {
				self: this,
				brandPamars: {
					brandCode: this.$route.query.brandCode,
					// brandName: this.$route.query.brandName,
					lastModifyTime: '',
					// isHomePageShow: '',
					brandTitle: '',
					brandBrief: '',
					// brandDesc: '',
					seoTitle: '',
					brandTitle: '',
					seoDesc: '',
					sort: 99,
					lang: 'en'
				},
				langPamars: {
					brandCode: this.$route.query.brandCode,
					brandTitle: '',
					brandBrief: '',
					// brandDesc: '',
					seoTitle: '',
					seoDesc: '',
					lang: ''
				},
				// dataForm: {
				// 	shipRegionCompensateList: []
				// },
				// checked: false,
				checked_1: false,
				lang: '',
				brandInfoList: {},
				activeName: 'first',
				activeName_1: 'first',
				activeName_2: 'first',
				date1: [],
				langOpt: [],
				rules: {
					brandTitle: [{
						required: true,
						message: '不能为空'
					}],
					brandBrief: [{
						required: true,
						message: '不能为空'
					}],
					brandLogo: [{
						required: true,
						message: '不能为空'
					}],
					// brandDesc: [{
					// 	required: true,
					// 	message: '不能为空'
					// }],
					/*seoDesc: [{
						trigger: 'blur',
						required: true,
						message: '不能为空'
					}],
					seoTitle: [{
						trigger: 'blur',
						required: true,
						message: '不能为空'
					}],*/
					sort: [{
						required: true,
						validator: brandRate
					}]
				}
			};
		},
		created() {
			this.getOpt();
			this.getBrandInfo()
		},
		methods: {
			async getOpt() {
                const data = await this.httpGet_('admin/public/languages');
                this.langOpt = data;
                this.lang = this.langOpt[0].language_en;
			},

			async langClick(val) {
				if(val.name === 'en') {
					this.brandPamars.lang = this.lang;
					// this.dataForm.shipRegionCompensateList.length = 0;
					this.getBrandInfo();
				} else {
					// this.dataForm.shipRegionCompensateList.length = 0;
					this.langPamars.lang = val.name;

                    const data = await this.httpGet_('goods/brand/brand-info', {
                        params: this.langPamars
                    });
                    this.brandInfoList.brandTitle = data.brandTitle;
                    this.brandInfoList.brandBrief = data.brandBrief;
                    this.brandInfoList.seoTitle = data.seoTitle;
                    this.brandInfoList.seoDesc = data.seoDesc;
                    this.brandInfoList.seoKeyWord = data.seoKeyWord;
                    // var index = 0,
                    //     shipRegion = data.brandDesc.split('br'),
                    //     length = shipRegion.length;

                    // for(index = 0; index < length - 1; index++) {
                    //     this.dataForm.shipRegionCompensateList.push({
                    //         shipRegion: shipRegion[index]
                    //     })
                    // }
				}
			},

			async saveEdit() {
				if(this.lang == 'en') {
					let hasError = false;
					// this.$refs['formSrc'].validate((valid) => {
					// 	if(!valid && this.checked_1 == true) {
					// 		hasError = true;
					// 		return false;
					// 	}
					// })
					this.$refs['brandInfoList'].validate((valid) => {
						if(!valid && this.checked_1 == true) {
							hasError = true;
							return false;
						}
					})
					if(hasError) {
						return;
					};
					// if(this.checked_1 == true && this.dataForm.shipRegionCompensateList.length <= 0) {
					// 	this.$message('启用状态勾选后品牌5句话不能为空');
					// 	return
					// }
					let ts = Math.round(new Date().getTime() / 1000).toString();
					this.brandPamars.createTime = ts;
					let potion = {};
					potion.brandCode = this.brandPamars.brandCode;
					potion.brandName = this.brandInfoList.brandName;
					potion.seoTitle = this.brandInfoList.seoTitle;
					potion.seoDesc = this.brandInfoList.seoDesc;
                    potion.seoKeyWord = this.brandInfoList.seoKeyWord;
					potion.brandBrief = this.brandInfoList.brandBrief;
					potion.brandTitle = this.brandInfoList.brandTitle;
					potion.createTime = this.brandPamars.createTime;
					potion.sort = this.brandInfoList.sort;
					potion.brandLogo = this.brandInfoList.brandLogo;
					potion.video = this.brandInfoList.video;
					potion.isUse = this.brandInfoList.isUse;
					// potion.brandDesc = '';
					// this.dataForm.shipRegionCompensateList.forEach((item) => {
					// 	potion.brandDesc += item.shipRegion + 'br'
					// })

					// if(this.checked === false) {
					// 	potion.isHomePageShow = 2;
					// } else {
					// 	potion.isHomePageShow = 1;
					// };
					if(this.checked_1 === false) {
						potion.isUse = 2;
					} else {
						potion.isUse = 1;
					};

                    const data = await this.httpPost_('goods/brand/update-brands', potion);
                    this.$message.success(data.message);
                    window.history.go(-1);
				} else {
					let hasError = false;
					this.$refs['formSrc'].validate((valid) => {
						if(!valid) {
							hasError = true;
							return false;
						}
					})
					this.$refs['brandInfoList'].validate((valid) => {
						if(!valid) {
							hasError = true;
							return false;
						}
					})
					if(hasError) {
						return;
					};
					// if(this.dataForm.shipRegionCompensateList.length <= 0) {
					// 	this.$message('品牌5句话不能为空');
					// 	return
					// }
					let param = {
						brandCode: this.brandInfoList.brandCode,
						brandTitle: this.brandInfoList.brandTitle,
						brandBrief: this.brandInfoList.brandBrief,
						seoTitle: this.brandInfoList.seoTitle,
						seoDesc: this.brandInfoList.seoDesc,
						lang: this.lang
					}
					// this.dataForm.shipRegionCompensateList.forEach((item) => {
					// 	param.brandDesc += item.shipRegion + 'br'
					// });

                    const data = await this.httpPost_('goods/brand/update-brand-lang', param);
                    this.$message.success(data.message);
                    window.history.go(-1);
				}
			},

			async getBrandInfo() {
                const data = await this.httpGet_('goods/brand/brand-info', {
                    params: this.brandPamars
                });
                this.brandInfoList = data;
                // 排序默认值99
                this.brandInfoList.sort = this.brandInfoList.sort || 99;
                if(this.brandInfoList.isUse == 1) {
                    this.checked_1 = true
                } else if(this.brandInfoList.isUse == 2) {
                    this.checked_1 = false
                }
                // var index = 0,
                //     shipRegion = this.brandInfoList.brandDesc.split('br'),
                //     length = shipRegion.length;

                // for(index = 0; index < length - 1; index++) {
                //     this.dataForm.shipRegionCompensateList.push({
                //         shipRegion: shipRegion[index]
                //     })
                // }
			},

			// shipRegionCompensateDel(index) {
			// 	this.dataForm.shipRegionCompensateList.splice(index, 1);
			// },

			// shipRegionCompensateAdd() {
			// 	this.dataForm.shipRegionCompensateList.push({
			// 		shipRegion: ''
			// 	})
			// }
		}
	}
</script>

<style lang="less">
	.edit-brand {
		.el-form-item {
			width: 45%;
			min-width: 450px;
		}
	}
</style>
