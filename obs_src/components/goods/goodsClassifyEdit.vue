<!-- 编辑商品分类 -->
<template>
	<div class="goods-classify-edit">
		<div class="el-container">
			<el-tabs class="full" type="card" @tab-click="langClick" v-model="lang">
				<el-tab-pane v-for="item in langOpt" :label="item.language_ch" :name="item.language_en" :key="item.language_en"></el-tab-pane>
			</el-tabs>
			<el-form label-position="right" ref="form" :rules="rules" :model="form" label-width="160px">
				<el-row v-if="lang === 'en'">
					<el-form-item label="所属分类">
						<template v-for="(item, index) in allAategories_1">
							<el-tag type="primary" style="margin-right: 20px;">{{item.aategories}}</el-tag>
						</template>
					</el-form-item>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item label="分类名称" prop="categoryName">
							<el-col :span="12">
								<el-input v-model.trim="form.categoryName" placeholder="请输入分类名称"></el-input>
							</el-col>
							<el-col :span="5" :offset="1">
								分类ID: {{id}}
							</el-col>
							<el-col :span="5" :offset="1" v-if="lang === 'en'">
								<el-checkbox label="1" v-model="form.isLeaves" @change="showRate" value="1">最底层分类</el-checkbox>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="静态页面文件名称" prop="urlTitle">
							<el-input v-model.trim="form.urlTitle" placeholder="静态页面文件名称" :disabled="fileEdit"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5" style="margin-left: 10px;">
						<span class="color-danger">* 此标题用于生成网站页面链接</span>
					</el-col>
				</el-row>
				<el-row v-if="lang === 'en'">
					<el-col :span="8">
						<el-form-item label="分类权重排序" prop="sort">
							<el-input v-model.trim="form.sort" placeholder="分类权重排序"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="lang === 'en'">
					<el-col :span="12">
						<el-form-item label="启用渠道" prop="pipelineArr" :rules="[{type: 'array', required: true, message: '该项不能为空'}]">
							<el-row>
								<el-col :span="18">
									<el-select disabled multiple v-model="form.pipelineArr" @change="changePipe">
										<el-option value="all" label="全选" v-if="form.pipelineArr.length < pipeOpt.length"></el-option>
				                        <el-option v-for="item in pipeOpt" :key="item.pipeline_code" :value="item.pipeline_code" :label="item.pipeline_name"></el-option>
				                    </el-select>
								</el-col>
							</el-row>
		                    <table class="table-custom el-sub-container">
		                    	<thead>
		                    		<tr>
		                    			<th>站点渠道</th>
		                    			<th>
<!-- 											<el-checkbox disabled v-model="checkPipe" @change="checkAll">全选</el-checkbox> -->
		                    			</th>
		                    		</tr>
		                    	</thead>
		                    	<tbody>
		                    		<tr v-for="(item, index) in form.pipelineCategoryList" :key="index">
		                    			<td>{{item.pipelineName}}</td>
		                    			<td>
											<el-checkbox disabled v-model="item.isShow" :true-label="1" :false-lable="0">显示</el-checkbox>
		                    			</td>
		                    		</tr>
		                    	</tbody>
		                    </table>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="lang === 'en'">
					<el-col :span="12">
						<el-form-item label="是否显示">
							<el-radio-group v-model="form.isDisplay">
								<el-radio :label="1">前台显示</el-radio>
								<el-radio :label="0">不显示</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="lang === 'en'">
					<el-col :span="12">
						<el-form-item label="前端展示样式">
							<el-row>
								<el-col :span="3">
									<el-color-picker v-model="form.colorStyle"></el-color-picker>
								</el-col>
								<el-col :span="6">
									<el-input v-model="form.colorStyle"></el-input>
								</el-col>
								<el-col :span="9" :offset="1">
									<el-checkbox label="1" v-model="form.isFontBold">加粗</el-checkbox>
									<el-checkbox label="1" v-model="form.isFontItalic">倾斜</el-checkbox>
									<el-checkbox label="1" v-model="form.isFontUnderline">下划线</el-checkbox>
								</el-col>
							</el-row>
						</el-form-item>
					</el-col>
				</el-row>
                <el-row v-if="lang === 'en'">
                    <el-col :span="12">
                        <el-form-item label="分类显示模板" prop="displayType">
                            <el-select v-model="form.displayType">
                                <el-option v-for="(item, index) in displayOpt" :key="index" :value="index" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
				<el-row v-if="lang === 'en'">
					<el-col :span="12">
						<el-form-item label="PC分类图片地址">
							<el-input v-model.trim="form.pcPicUrl" placeholder="PC分类图片地址"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="lang === 'en'">
					<el-col :span="12">
						<el-form-item label="IPhone分类图片地址">
							<el-input v-model.trim="form.iphonePicUrl" placeholder="IPhone分类图片地址"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="lang === 'en'">
					<el-col :span="12">
						<el-form-item label="Android分类图片地址">
							<el-input v-model="form.androidPicUrl" placeholder="Android分类图片地址"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="lang === 'en'">
					<el-col :span="12">
						<el-form-item label="M版分类图片地址">
							<el-input v-model.trim="form.moiblePicUrl" placeholder="M版分类图片地址"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="lang === 'en'">
					<el-col :span="12">
						<el-form-item label="PAD版分类图片地址">
							<el-input v-model.trim="form.padPicUrl" placeholder="PAD版分类图片地址"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showRateBlock" v-if="lang === 'en'">
					<el-col :span="12">
						<el-form-item label="是否包邮">
							<el-radio-group v-model="form.isFreeShip">
								<el-radio :label="1">包邮</el-radio>
								<el-radio :label="0">不包邮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showRateBlock" v-if="lang === 'en'">
					<el-form-item label="添加/追加利润率">
						<el-form :model="dataForm" ref="formSrc" :inline="true" class="list-form">
							<el-row class="text-center">
								<el-col :span="7">计费价格区间(￥)</el-col>
								<el-col :span="3">追加价(￥)</el-col>
								<el-col :span="3">利润率</el-col>
								<el-col :span="1">
									<el-button type="primary" size="small" @click="shipRegionCompensateAdd"><i class="el-icon-plus"></i> 添加</el-button>
								</el-col>
							</el-row>
							<el-row class="text-center line36" v-for="(item, index) in dataForm.shipRegionCompensateList" :key="index">
								<el-col :span="3" style="margin-bottom: 12px;">
									<el-form-item :prop="'shipRegionCompensateList.' + index + '.shipRegion.begin'" :rules="[{validator: checkBegin(index)}]">
										<el-input v-model.trim="item.shipRegion.begin" class="ipt" size="small"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="1">——</el-col>
								<el-col :span="3" style="margin-bottom: 12px;">
									<el-form-item :prop="'shipRegionCompensateList.' + index + '.shipRegion.end'" :rules="[{validator: checkEnd(index)}]">
										<el-input v-model.trim="item.shipRegion.end" class="ipt" size="small"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="3">
									<el-form-item :prop="'shipRegionCompensateList.' + index + '.pricePlus'" :rules="rulesCat.ruleNumber">
										<el-input v-model.number="item.pricePlus" class="ipt" size="small"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="3">
									<el-form-item :prop="'shipRegionCompensateList.' + index + '.profitRate'" :rules="rulesCat.ruleNumber">
										<el-input v-model.number="item.profitRate" size="small"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="1">
									<el-button type="danger" size="small" @click="shipRegionCompensateDel(index)"><i class="el-icon-close"></i> 删除</el-button>
								</el-col>
							</el-row>
						</el-form>
					</el-form-item>
				</el-row>
				<el-row>
					<el-row>
						<el-col :span="12 ">
							<el-form-item label="title(SEO)" prop="catTitle">
								<el-input v-model.trim="form.catTitle" placeholder="title(SEO) "></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12 ">
							<el-form-item label="关键字(SEO)" prop="keywords">
								<el-input v-model.trim="form.keywords" placeholder="关键字(SEO) "></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12 ">
							<el-form-item label="描述(SEO)" prop="catDesc">
								<el-input v-model.trim="form.catDesc" placeholder="描述(SEO) "></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12 ">
							<el-form-item label="推荐介绍" prop="recommendInfo">
								<el-input v-model.trim="form.recommendInfo" placeholder="推荐介绍 ">
									<el-button slot="append" @click="previewDialog = true">预览</el-button>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-row>
				<el-row>
					<el-col :span="12 ">
						<el-form-item>
							<el-button v-if="self.showAction_('goods/category/edit-category-lang')" type="primary " @click="onSubmit('from')" v-loading="editLoading" :disabled="editLoading">保存</el-button>
							<el-button @click="$router.push({name: 'goods_goodsClassify'}) ">返回</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<!--  -->
		<el-dialog title="预览" v-model="previewDialog" class="good-edit-attr-dialog">
            <div v-html="form.recommendInfo"></div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="previewDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <!--  -->
	</div>
</template>

<script>
	export default {
		data() {
			let self = this;
			let tempForm = null;

			let checkRange = (rule, val, callback) => {
				if(!val) {
					return callback(new Error('请输入数值'));
				}
				let reg = /^\d+\.?\d*\-\d+\.?\d*$/g;
				if(reg.test(val)) {
					let flag = true;
					let list = val.split('-');
					list.forEach((el) => {
						if(el.charAt(0) == 0 && el.charAt(1) != '.' && el.charAt(1) != '') {
							flag = false;
							return callback(new Error('首位不能为0'));
						}
					});
					if(flag && (list[1] * 1 <= list[0] * 1)) {
						return callback(new Error('起始值不能大于或等于结束值'));
					}
				} else {
					return callback(new Error('请输入正确的数值区间'));
				}
				callback();
			}
			let checkRate = function(rule, value, callback) {
				let exp = /^\d+(\.\d{2})?$/
				if(exp.test(value)) {
					callback();
				} else {
					callback(new Error('请输入数字'));
				}
			}
			/^[1-9]\d*$/
			let checkRate_1 = function(rule, value, callback) {
				let exp = /^\d+(\.\d+)?$/
				if(exp.test(value)) {
					callback();
				} else {
					callback(new Error('请输入数值'));
				}
			}
			let checkRate_2 = function(rule, value, callback) {
				let exp = /^[1-9]\d*$/
				if(exp.test(value)) {
					callback();
				} else {
					callback(new Error('请输入整数'));
				}
			}

			let checkBegin = (index) => {
	            return (rule, val, callback) => {
	            	if (!val || val * 1 != val) {
	            		callback(new Error('该项不能为空,必须为数字'));
	            	}
	                let end = self.dataForm.shipRegionCompensateList[index].shipRegion.end;
	                if (end && val * 1 < end * 1) {
	                    callback();
	                } else {
	                    callback(new Error('结束值必须大于起始值'));
	                }
	            }
	        }

	        let checkEnd = (index) => {
	            return (rule, val, callback) => {
	            	if (!val || val * 1 != val) {
	            		callback(new Error('该项不能为空,必须为数字'));
	            	}
	                let begin = self.dataForm.shipRegionCompensateList[index].shipRegion.begin;
	                if (begin && val * 1 > begin * 1) {
	                    callback();
	                } else {
	                    callback(new Error('结束值必须大于起始值'));
	                }
	            }
	        }

	        let checkSort = (rule, val, callback) => {
				if (Number.isInteger(val * 1) && val * 1 >= 0) {
					callback();
				} else {
					callback(new Error('排序为大于等于0的整数'));
				}
			}
			return {
				previewDialog: false,
				editLoading: false,
				self: this,
				checkEnd: checkEnd,
				checkBegin: checkBegin,
				id: this.$route.query.id,
				form: {
					pipelineArr: [],
					pipelineCategoryList: [],
					changePipeFlag: false,
					newAddId: '',
					category1: '',
					categoryName: '',
					catName: '',
					sort: '',
					goodsCat: '',
					isFreeShip: 0,
					isDisplay: 1,
					tabIndex: 1,
					colorStyle: '',
					isFontBold: '',
					isFontItalic: '',
					isFontUnderline: '',
                    displayType: '0',
					pcPicUrl: '',
					iphonePicUrl: '',
					androidPicUrl: '',
					moiblePicUrl: '',
					padPicUrl: '',
					// operateUrl: '',
					catTitle: '',
					keywords: '',
					catDesc: '',
					isLeaves: '',
					urlTitle: '',
					recommendInfo: '',
				},
				langPotion: {},
				dataForm: {
					shipRegionCompensateList: []
				},
				categoryLists: [],
				arr1: [],
				category: [],
				langOpt: [],
				showRateBlock: false,
				catEdit: false,
				fileEdit: false,
				parentId: -1,
				lang: '',
				allAategories_1: [],
				// 0.82新增渠道
				// checkPipe: false,
                displayOpt: {
                    '0': '默认模板',
                    '1': '服装模板',
                    '2': '鞋包模板'
                },
				rules: {
					categoryName: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}],
					urlTitle: [{
						required: true,
						message: '请输入静态页面文件名称',
						trigger: 'blur'
					}],
                    displayType: [{
                        return: true,
                        message: '该项不能为空',
                    }],
					sort: [{
						required: true,
						message: '请输入分类权重排序',
						trigger: 'blur',
					}, {
						required: true,
						validator: checkSort
					}]
				},
				rulesCat: {
					ruleNumber: [{
							required: true,
							message: '请输入数值'
						},
						{
							required: true,
							validator: checkRate_1
						}
					],
					ruleRange: [{
						validator: checkRange,
						required: true,
					}]
				}
			}
		},
        computed: {
            pipeObj () {
                return this.$store.getters.getPipe.obj;
            },
            pipeOpt () {
                return this.$store.getters.getPipe.list;
            },
            pipeList () {
                let obj = this.$store.getters.getPipe.obj;
                let temp = [];
                for (let i in obj) {
                    temp.push(i);
                }
                return temp;
            },
        },

		created() {
			this.getOpt();
			if(this.$route.query.parentId) {
				this.parentId = this.$route.query.parentId
			}
		},

		methods: {
			// 0.82新增渠道
	        changePipe(val) {
	        	if (this.changePipeFlag) {
	        		this.changePipeFlag = false;
	        		return;
	        	}
	        	if(val.indexOf('all') != -1) {
	        		this.form.pipelineArr = val = this.pipeList;
	        	}
	        	this.form.pipelineCategoryList = [];
	        	if (val.length > 0) {
	        		val.forEach(item => {
	        			this.form.pipelineCategoryList.push({
	        				isShow: 0,
	        				pipelineCode: item,
	        				pipelineName: this.pipeObj[item],
	        			})
	        		});
	        	}
	        },
	    //     checkAll(val) {
	    //     	if (val.target.checked) {
					// this.form.pipelineCategoryList.forEach(item => {
		   //      		item.isShow = 1;
		   //      	});
	    //     	} else {
	    //     		this.form.pipelineCategoryList.forEach(item => {
		   //      		item.isShow = 0;
		   //      	});
	    //     	}
	    //     },
	        //
			async getOpt() {
                const data = await this.httpGet_('admin/public/languages');
                this.langOpt = data;
                this.lang = this.langOpt[0].language_en;
                this.getData();
			},

			async langClick(val) {
				if(this.$route.query.id) {
					if(val.name == 'en') {
						this.dataForm.shipRegionCompensateList.length = 0;
						this.allAategories_1 = [];
						this.getData()
					} else {
						this.dataForm.shipRegionCompensateList.length = 0;
						this.allAategories_1 = [];
						let params = {};
						params.id = this.$route.query.id;
						params.lang = val.name;

                        const res = await this.httpGet_('goods/category/get-category-by-id', {
                            params: params
                        });
                        let data = res.category.categoryMultiLang;
                        this.form.categoryName = data.categoryName;
                        this.form.catTitle = data.catTitle;
                        this.form.catDesc = data.catDesc;
                        this.form.keywords = data.keywords;
                        this.form.urlTitle = data.urlTitle;
					}
				}
			},

			async getData() {
				if(this.$route.query.id) {
					this.catEdit = true;

                    let data = await this.httpGet_('goods/category/get-category-by-id', {
                        params: {
                            id: this.$route.query.id,
                            lang: this.lang
                        }
                    });

                    let category = data.category;
                    let allAategories = category.categoryNamePathList;
                    this.form.categoryName = category.categoryMultiLang.categoryName;
                    this.form.sort = String(category.sort);
                    this.form.isFreeShip = category.isFreeShip;
                    this.form.isDisplay = category.isDisplay;
                    this.form.displayType = String(category.displayType);
                    this.form.colorStyle = category.colorStyle;
                    this.form.isFontBold = category.isFontBold == 1 ? true : false;
                    this.form.isFontItalic = category.isFontItalic == 1 ? true : false;
                    this.form.isFontUnderline = category.isFontUnderline == 1 ? true : false;
                    this.form.pcPicUrl = category.pcPicUrl;
                    this.form.iphonePicUrl = category.iphonePicUrl;
                    this.form.androidPicUrl = category.androidPicUrl;
                    this.form.moiblePicUrl = category.moiblePicUrl;
                    this.form.padPicUrl = category.padPicUrl;
                    this.form.catTitle = category.categoryMultiLang.catTitle;
                    this.form.keywords = category.categoryMultiLang.keywords;
                    this.form.catDesc = category.categoryMultiLang.catDesc;
                    this.form.isLeaves = category.isLeaves == 1 ? true : false;
                    this.form.urlTitle = category.categoryMultiLang.urlTitle;
                    // 0.82
                    this.form.recommendInfo = category.categoryMultiLang.recommendInfo;

                    let tempArr = [];
                    let tempList = [];
                    category.pipelineCategory.forEach(item => {
                        tempArr.push(item.pipelineCode);
                        tempList.push({
                            isShow: item.isShow,
                            pipelineCode: item.pipelineCode,
                            pipelineName: this.pipeObj[item.pipelineCode],
                        })
                    });
                    this.form.pipelineArr = tempArr;
                    this.form.pipelineCategoryList = tempList;
                    this.changePipeFlag = true;
                    //

                    if(category.isLeaves == 1) {
                        this.showRateBlock = true;
                    };
                    var allCat = allAategories.slice(0, allAategories.length - 1);
                    allCat.forEach((el) => {
                        this.allAategories_1.push({
                            aategories: el
                        })
                    });
                    var index = 0,
                        shipRegion = category.shipRegion.split('|'),
                        addPrice = category.addPrice.split('|'),
                        rates = category.rates.split('|'),
                        length = shipRegion.length;

                    for(index = 0; index < length; index++) {
                        this.dataForm.shipRegionCompensateList.push({
                            // shipRegion: shipRegion[index],
                            profitRate: rates[index],
                            pricePlus: addPrice[index],
                            shipRegion: {
                            	begin: shipRegion[index].split('-')[0],
                            	end: shipRegion[index].split('-')[1],
                            }
                        })
                    }
				} else if(this.$route.query.parentId) {
					this.fileEdit = true;
					this.catEdit = true;

                    const data = await this.httpGet_('goods/category/get-category-by-id', {
                        params: {
                            id: this.$route.query.parentId
                        }
                    });
                    let category = data.category;
                    let allAategories = category.categoryNamePathList;
                    allAategories.forEach((el) => {
                        this.allAategories_1.push({
                            aategories: el
                        })
                    });
				} else {
					this.fileEdit = true;
					this.catEdit = true
				}
			},

			async showRate() {
				if(this.form.isLeaves == 1) {
					this.showRateBlock = true
				} else {
					this.showRateBlock = false
				};
				if(this.$route.query.id) {
					if(this.lang == 'en') {
						var categoryId = {};
						categoryId.categoryId = this.$route.query.id;

                        let data = await this.httpGet_('goods/category/public-is-bottom-category', {
                            params: categoryId
                        });
                        if(data.hasCategory == true && this.form.isLeaves == 1) {
                            this.$confirm('当前分类下存在下级分类，不可设置最底层分类!', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            }).then(() => {
                                this.form.isLeaves = false;
                                this.showRateBlock = false;
                            }).catch(() => {
                                this.form.isLeaves = false;
                                this.showRateBlock = false;
                            })
                        } else if(data.hasGoods == true && this.form.isLeaves == 0) {
                            this.$confirm('当前分类下存在商品, 不可取消最底层设置!', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            }).then(() => {
                                this.form.isLeaves = true;
                                this.showRateBlock = true;
                            }).catch(() => {
                                this.form.isLeaves = true;
                                this.showRateBlock = true;
                            })
                        }
					}
				}
			},

			shipRegionCompensateAdd() {
				this.dataForm.shipRegionCompensateList.push({
					pricePlus: '',
					profitRate: '',
					shipRegion: {
						begin: '',
						end: '',
					}
				});
			},

			shipRegionCompensateDel(index) {
				this.dataForm.shipRegionCompensateList.splice(index, 1);
			},

			// 编辑商品分类公用接口
			async editComm() {
				let data = {
					sort: this.form.sort,
					pcPicUrl: this.form.pcPicUrl,
					iphonePicUrl: this.form.iphonePicUrl,
					androidPicUrl: this.form.androidPicUrl,
					padPicUrl: this.form.padPicUrl,
					moiblePicUrl: this.form.moiblePicUrl,
					isLeaves: this.form.isLeaves ? 1 : 0,
					colorStyle: this.form.colorStyle,
					isFontBold: this.form.isFontBold ? 1 : 0,
					isFontItalic: this.form.isFontItalic ? 1 : 0,
					isFontUnderline: this.form.isFontUnderline ? 1 : 0,
					// operateUrl: this.form.operateUrl,
					isDisplay: this.form.isDisplay,
					isFreeShip: this.form.isFreeShip,
					categoryName: this.form.categoryName,
					catTitle: this.form.catTitle,
					catDesc: this.form.catDesc,
					keywords: this.form.keywords,
					urlTitle: this.form.urlTitle,
					recommendInfo: this.form.recommendInfo,
					displayType: this.form.displayType,
				}

				var shipRegion = '';
				var addPrice = '';
				var rates = '';
				var categoryId = this.$route.query.id;
				this.dataForm.shipRegionCompensateList.forEach((item) => {
					shipRegion += item.shipRegion.begin + '-' + item.shipRegion.end + '|';
					addPrice += item.pricePlus + '|';
					rates += item.profitRate + '|';
				})

				if(this.form.isLeaves == 1) {
					data.shipRegion = shipRegion.slice(0, shipRegion.length - 1);
					data.addPrice = addPrice.slice(0, addPrice.length - 1);
					data.rates = rates.slice(0, rates.length - 1);
					categoryId: categoryId
				} else {
					data.shipRegion = '';
					data.addPrice = '';
					data.rates = '';
					data.isFreeShip = 0;
				}

				if(this.$route.query.id) {
					data.id = this.$route.query.id
				}
				data.lang = 'en';

				// 0.82新增渠道
				let pipeEdit = this.form.pipelineCategoryList;
				let temp = [];
				pipeEdit.forEach(item => {
					temp.push({
						isShow: item.isShow,
						pipelineCode: item.pipelineCode,
					})
				});
				data.pipelineCategoryList = temp;
				//
				this.editLoading = true;
				try {
	                const res = await this.httpPost_('goods/category/edit', data);
	                this.$message.success(res.message);
	                this.$router.push({
	                    name: 'goods_goodsClassify'
	                });
				} finally {
					this.editLoading = false;
				}
			},

			// 添加商品分类公用接口
			async editCommAdd() {
				let data = {
					sort: this.form.sort,
					pcPicUrl: this.form.pcPicUrl,
					iphonePicUrl: this.form.iphonePicUrl,
					androidPicUrl: this.form.androidPicUrl,
					padPicUrl: this.form.padPicUrl,
					moiblePicUrl: this.form.moiblePicUrl,
					isLeaves: this.form.isLeaves ? 1 : 0,
					colorStyle: this.form.colorStyle,
					isFontBold: this.form.isFontBold ? 1 : 0,
					isFontItalic: this.form.isFontItalic ? 1 : 0,
					isFontUnderline: this.form.isFontUnderline ? 1 : 0,
					// operateUrl: this.form.operateUrl,
					isDisplay: this.form.isDisplay,
					isFreeShip: this.form.isFreeShip,
					categoryName: this.form.categoryName,
					catTitle: this.form.catTitle,
					catDesc: this.form.catDesc,
					keywords: this.form.keywords,
					recommendInfo: this.form.recommendInfo,
				};
				var shipRegion = '';
				var addPrice = '';
				var rates = '';
				var categoryId = this.$route.query.id;
				this.dataForm.shipRegionCompensateList.forEach((item) => {
					shipRegion += item.shipRegion.end + '-' + item.shipRegion.end + '|';
					addPrice += item.pricePlus + '|';
					rates += item.profitRate + '|';
				})

				if(this.form.isLeaves == 1) {
					data.shipRegion = shipRegion.slice(0, shipRegion.length - 1);
					data.addPrice = addPrice.slice(0, addPrice.length - 1);
					data.rates = rates.slice(0, rates.length - 1);
					categoryId: categoryId
				} else {
					data.shipRegion = '';
					data.addPrice = '';
					data.rates = '';
					data.isFreeShip = 0;
				}

				if(this.$route.query.parentId) {
					data.parentId = this.$route.query.parentId;
				}

                let res = await this.httpPost_('goods/category/add', data);
                if(!this.$route.query.parentId) {
                    this.newAddId = res.data;
                    this.$confirm('新建分类成功,是否跳转商品分类页面?', '提示', {
                        confirmButtonText: '确定',
                        type: 'success'
                    }).then(() => {
                        this.$router.push({
                            name: 'goods_goodsClassify'
                        })
                    })
                } else {
                    this.$message.success(res.message);
                    this.$router.push({
                        name: 'goods_goodsClassify'
                    })
                }
			},

			// 保存多语言公用接口
			async editCommLang() {
				this.langPotion = {
					catName: this.form.categoryName,
					catTitle: this.form.catTitle,
					catDesc: this.form.catDesc,
					keywords: this.form.keywords,
					lang: this.lang,
					urlTitle: this.form.urlTitle,
					recommendInfo: this.form.recommendInfo,
				}

				if(this.$route.query.id) {
					this.langPotion.categoryId = this.$route.query.id
				} else if(this.$route.query.parentId) {
					this.langPotion.categoryId = this.$route.query.parentId
				} else {
					this.langPotion.categoryId = this.newAddId;
				}

				this.editLoading = true;
				try {
	                const data = await this.httpPost_('goods/category/edit-category-lang', this.langPotion);
	                this.$message.success(data.message);
	                this.$router.push({
	                    name: 'goods_goodsClassify'
	                });
				} finally {
					this.editLoading = false;
				}
			},

			// 判断追加/利润率计费价格区间是否有交集
			checkArrIntersection(arr) {
				let hasIntersection = false;
				for(let i = 0, len = arr.length; i < len - 1; i++) {
					if(arr[i + 1] - 0 < arr[i] - 0) {
						hasIntersection = true;
						break;
					}
				}
				return hasIntersection;
			},

			// 保存分类
			onSubmit() {
				let hasError = false;
				this.$refs['form'].validate((valid) => {
					if(!valid) {
						hasError = true;
						return false;
					}
				})
				if(hasError) {
					return;
				};

				if(this.$route.query.id) {
					if(this.lang === 'en') {
						if(this.form.isLeaves == 1 && this.dataForm.shipRegionCompensateList.length <= 0) {
							this.$message('添加/追加利润率不能为空');
							return
						} else if(this.form.urlTitle==''){
							this.$message('静态文件名称不能为空');
							return
						};
						this.$refs['formSrc'].validate((valid) => {
							if(!valid && this.form.isLeaves == 1) {
								hasError = true;
								return false;
							}
						})
						if(hasError) {
							return;
						}
						let hasIntersection = false;
						(() => {
							var arr1 = [];
							arr1 = [];
							this.dataForm.shipRegionCompensateList.forEach((item, index) => {
								arr1 = arr1.concat([item.shipRegion.begin, item.shipRegion.end]);
							});
							hasIntersection = this.checkArrIntersection(arr1);
							if(hasIntersection) {
								this.$message.error('追加/利润率计费价格区间不能有交集');
								return;
							}
						})();
						if(hasIntersection) {
							return
						}
						this.editComm()
					} else {

						this.editCommLang()
					}
				} else if(this.$route.query.parentId) {
					if(this.lang === 'en') {
						if(this.form.isLeaves == 1 && this.dataForm.shipRegionCompensateList.length <= 0) {
							this.$message('添加/追加利润率不能为空');
							return
						}
						this.$refs['formSrc'].validate((valid) => {
							if(!valid && this.form.isLeaves == 1) {
								hasError = true;
								return false;
							}
						})
						if(hasError) {
							return;
						}
						let hasIntersection = false;
						(() => {
							var arr1 = [];
							arr1 = [];
							this.dataForm.shipRegionCompensateList.forEach((item, index) => {
								arr1 = arr1.concat([item.shipRegion.begin, item.shipRegion.end]);
							});
							hasIntersection = this.checkArrIntersection(arr1);
							if(hasIntersection) {
								this.$message.error('追加/利润率计费价格区间不能有交集');
								return;
							}
						})();
						if(hasIntersection) {
							return
						}

						this.editCommAdd()
					} else {
						this.editCommLang()
					}
				} else {
					if(this.lang === 'en') {
						if(this.form.isLeaves == 1 && this.dataForm.shipRegionCompensateList.length <= 0) {
							this.$message('添加/追加利润率不能为空');
							return
						}
						this.$refs['formSrc'].validate((valid) => {
							if(!valid && this.form.isLeaves == 1) {
								hasError = true;
								return false;
							}
						})
						if(hasError) {
							return;
						}
						let hasIntersection = false;
						(() => {
							var arr1 = [];
							arr1 = [];
							this.dataForm.shipRegionCompensateList.forEach((item, index) => {
								arr1 = arr1.concat([item.shipRegion.begin, item.shipRegion.end]);
							});
							hasIntersection = this.checkArrIntersection(arr1);
							if(hasIntersection) {
								this.$message.error('追加/利润率计费价格区间不能有交集');
								return;
							}
						})();
						if(hasIntersection) {
							return
						}

						this.editCommAdd()
					} else {
						if(typeof this.newAddId == 'undefined') {
							this.$confirm('请先保存分类的默认语言资料!', '提示', {
								confirmButtonText: '确定',
								type: 'warning'
							}).catch(() => {})
							return
						};

						this.editCommLang()
					}
				}
			}
		}

	}
</script>

<style lang="less" scoped>
	.goods-classify-edit {
		.line36 {
			line-height: 36px;
		}
	}
	.rate-table input {
		margin: 6px 0;
	}

	.good-edit-attr-dialog {

        .el-dialog {
            max-height: 600px;
            overflow-y: auto;
        }

    } 
</style>
