<!-- 新增商品分类 -->
<template>
	<div class="el-container goods-classify-add">
		<el-form label-width="180px" :model="option" :rules="postRule" ref="postForm">
			<el-form-item label="所属分类" class="title-label">
				<el-tag v-for="(item, index) in pathList" :key="index" type="primary" style="margin-right: 20px;">{{item}}</el-tag>
			</el-form-item>
			<el-form-item label="选择语言" prop="lang" class="title-label">
				<el-select v-model="option.lang" multiple @change="changeLang" @remove-tag="checkRemove">
					<el-option v-for="(item, index) in langOpt" :key="item.lang" :value="item.lang" :label="item.cnName"></el-option>
				</el-select>
			</el-form-item>
			<p class="cat-title"><strong>商品分类名称</strong></p>
			<template v-for="(item, index) in option.categoryLangList" v-if="item.show">
				<el-form-item :label="item.cnName" :prop="'categoryLangList.' + index + '.categoryName'" :rules="[{required: true, message: '分类名不能为空'}]">
					<el-input v-model="item.categoryName"></el-input>
				</el-form-item>
			</template>
			<p class="cat-title"><strong>商品分类详细信息</strong></p>
			<el-form-item label="权重排序" prop="sort">
				<el-input v-model="option.sort"></el-input>
			</el-form-item>
			<el-form-item label="是否显示" prop="isDisplay">
				<el-radio-group v-model="option.isDisplay">
					<el-radio :label="1">前台显示</el-radio>
					<el-radio :label="0">不显示</el-radio>
				</el-radio-group>
			</el-form-item>
            <el-form-item label="启用渠道" prop="pipelineArr" :rules="[{type: 'array', required: true, message: '该项不能为空'}]">
                <el-select multiple v-model="option.pipelineArr" @change="changePipe">
                    <el-option value="all" label="全选" v-if="option.pipelineArr.length < pipeOpt.length"></el-option>
                    <el-option v-for="item in pipeOpt" :key="item.pipeline_code" :value="item.pipeline_code" :label="item.pipeline_name"></el-option>
                </el-select>
                <table class="table-custom el-sub-container">
                    <thead>
                        <tr>
                            <th>站点渠道</th>
                            <th>
                                <el-checkbox v-model="checkPipe" @change="checkAll">全选</el-checkbox>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in option.pipelineCategoryList" :key="index">
                            <td>{{item.pipelineName}}</td>
                            <td>
                                <el-checkbox v-model="item.isShow" :true-label="1" :false-lable="0">显示</el-checkbox>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </el-form-item>
			<el-form-item label="前端展示样式" prop="colorStyle">
				<el-row>
					<el-col :span="3">
						<el-color-picker v-model="option.colorStyle"></el-color-picker>
					</el-col>
					<el-col :span="5">
						<el-input v-model="option.colorStyle"></el-input>
					</el-col>
					<el-col :span="10" :offset="2">
						<el-checkbox :true-label="1" :false-label="0" v-model="option.isFontBold">加粗</el-checkbox>
						<el-checkbox :true-label="1" :false-label="0" v-model="option.isFontItalic">倾斜</el-checkbox>
						<el-checkbox :true-label="1" :false-label="0" v-model="option.isFontUnderline">下划线</el-checkbox>
					</el-col>
				</el-row>
			</el-form-item>
            <el-form-item label="分类显示模板" prop="displayType">
                <el-select v-model="option.displayType">
                    <el-option v-for="(item, index) in displayOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
			<el-form-item label="PC图片分类地址" prop="pcPicUrl">
				<el-input v-model="option.pcPicUrl"></el-input>
			</el-form-item>
			<el-form-item label="iphone图片分类地址" prop="iphonePicUrl">
				<el-input v-model="option.iphonePicUrl"></el-input>
			</el-form-item>
			<el-form-item label="android图片分类地址" prop="androidPicUrl">
				<el-input v-model="option.androidPicUrl"></el-input>
			</el-form-item>
			<el-form-item label="M图片分类地址" prop="moiblePicUrl">
				<el-input v-model="option.moiblePicUrl"></el-input>
			</el-form-item>
			<el-form-item label="PAD图片分类地址" prop="padPicUrl">
				<el-input v-model="option.padPicUrl"></el-input>
			</el-form-item>
			<el-form-item label="分类类型" prop="isLeaves">
				<el-checkbox v-model="option.isLeaves" :true-label="1" :false-label="0">最底层分类</el-checkbox>
			</el-form-item>
			<div class="leaves-box" v-if="option.isLeaves === 1">
				<el-form-item label="是否包邮" prop="isFreeShip" label-width="100px">
					<el-radio-group v-model="option.isFreeShip">
						<el-radio :label="1">包邮</el-radio>
						<el-radio :label="0">不包邮</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="追加/利润率" label-width="100px">
					<el-row class="text-center">
						<el-col :span="7">出货价区间（人民币）</el-col>
						<el-col :span="5" :offset="1">追加（人民币）</el-col>
						<el-col :span="5" :offset="1">利润率</el-col>
						<el-col :span="4"><el-button type="primary" size="small" icon="plus" @click="addArea"></el-button></el-col>
					</el-row>
					<el-row class="text-center area-item">
						<template v-for="(item, index) in option.area">
							<el-col :span="3">
								<el-form-item :prop="'area.' + index + '.shipRegion.begin'" :rules="[{validator: checkBegin(index)}]">
									<el-input v-model="item.shipRegion.begin"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">——</el-col>
							<el-col :span="3">
								<el-form-item :prop="'area.' + index + '.shipRegion.end'" :rules="[{validator: checkEnd(index)}]">
									<el-input v-model="item.shipRegion.end"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5" :offset="1">
								<el-form-item :prop="'area.' + index + '.addPrice'" :rules="[{validator: checkAdd}]">
									<el-input v-model="item.addPrice"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5" :offset="1">
								<el-form-item :prop="'area.' + index + '.rates'" :rules="[{validator: checkRate}]">
									<el-input v-model="item.rates"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-button type="danger" size="small" icon="minus" @click="removeArea(index)"></el-button>
							</el-col>
						</template>
					</el-row>
				</el-form-item>
			</div>
			<p class="cat-title"><strong>商品分类详细SEO</strong></p>
			<template v-for="item in option.categoryLangList" v-if="item.show">
				<h3 class="cat-h3">{{item.cnName}}</h3>
				<el-form-item label="title(SEO)">
					<el-input v-model="item.catTitle"></el-input>
				</el-form-item>
				<el-form-item label="关键字(SEO)">
					<el-input v-model="item.keywords"></el-input>
				</el-form-item>
				<el-form-item label="描述(SEO)">
					<el-input v-model="item.catDesc"></el-input>
				</el-form-item>
				<el-form-item label="推荐介绍">
					<el-input v-model="item.recommendInfo"></el-input>
				</el-form-item>
			</template>
			<el-form-item class="text-center">
				<el-button v-if="self.showAction_('goods/category/add')" type="primary " @click="postEdit" v-loading="saveLoading" :disabled="saveLoading">保存</el-button>
				<el-button type="danger" @click="$router.push({name: 'goods_goodsClassify'}) ">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			let self = this;
			// 校验区间
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

			// 校验利润率
			let checkRate = function(rule, value, callback) {
				let exp = /^\d+(\.\d{0,2})?$/
				if(exp.test(value)) {
					callback();
				} else {
					callback(new Error('请输入数字,最多2位小数'));
				}
			}

			// 校验追加
			let checkAdd = function(rule, value, callback) {
				let exp = /^\d+(\.\d+)?$/
				if(exp.test(value)) {
					callback();
				} else {
					callback(new Error('请输入数值'));
				}
			}

			let checkSort = (rule, val, callback) => {
				if (Number.isInteger(val * 1) && val * 1 >= 0) {
					callback();
				} else {
					callback(new Error('排序为大于等于0的整数'));
				}
			}

			let checkBegin = (index) => {
	            return (rule, val, callback) => {
	            	if (!val || val * 1 != val) {
	            		callback(new Error('该项不能为空,必须为数字'));
	            	}
	                let end = self.option.area[index].shipRegion.end;
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
	                let begin = self.option.area[index].shipRegion.begin;
	                if (begin && val * 1 > begin * 1) {
	                    callback();
	                } else {
	                    callback(new Error('结束值必须大于起始值'));
	                }
	            }
	        }

			return {
				checkEnd: checkEnd,
				checkBegin: checkBegin,
				self: this,
				checkRate: checkRate,
				checkRange: checkRange,
				checkAdd: checkAdd,
				pathList: [],
				langOpt: {},
				saveLoading: false,
				parentID: [],
				option: {
					area: [{
						shipRegion: {
							begin: '',
							end: '',
						},
						addPrice: '',
						rates: '',
					}],
					lang: [],
					categoryLangList: {},
					sort: null,
					isDisplay: 0,
					colorStyle: '',
					isFontBold: 0,
					isFontItalic: 0,
					isFontUnderline: 0,
					pcPicUrl: '',
                    displayType: '0',
					iphonePicUrl: '',
					androidPicUrl: '',
					padPicUrl: '',
					moiblePicUrl: '',
					isLeaves: 1,
					isFreeShip: 1,
                    pipelineArr: [],
                    pipelineCategoryList: [],
				},
                displayOpt: {
                    '0': '默认模板',
                    '1': '服装模板',
                    '2': '鞋包模板'
                },
				postRule: {
					sort: [{
						required: true,
						message: '该项不能为空',
					}, {
						validator: checkSort,
					}],
                    displayType: [{
                        required: true,
                        message: '该项不能为空',
                    }]
				},
                // 0.82新增渠道
                checkPipe: false,
			}
		},
		created () {
			this.getOpt();
			this.parentID = this.$route.query.cat;
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
		methods: {
            // 0.82新增渠道
			async getOpt () {
                let data = await this.httpGet_('admin/public/languages');
                let object = {};
                data.forEach(item => {
                    object[item.language_en] = {
                        lang: item.language_en,
                        categoryName: '',
                        catTitle: '',
                        catDesc: '',
                        recommendInfo: '',
                        keywords: '',
                        cnName: item.language_ch,
                        show: false,
                    };
                });

                this.langOpt = object;
                this.option.categoryLangList = JSON.parse(JSON.stringify(object));
                this.option.lang.push('en');

                if (this.$route.query.parentId) {
                    this.getData();
                }
	        },
	        async getData() {
                const res = await this.httpGet_('goods/category/get-category-by-id', {params: {id: this.$route.query.parentId, lang: 'en'}});
                let data = res.category;
                this.pathList = data.categoryNamePathList;
	        },
			changeLang (val) {
				for (let i in this.option.categoryLangList) {
					this.option.categoryLangList[i].show = false;
				}
				if (val.length > 0) {
					val.forEach(lang => {
						this.option.categoryLangList[lang].show = true;
					});
				}
			},
			checkRemove (val) {
				if (val.value === 'en') {
					this.$alert('英文不能被删除！');
					this.option.lang.push('en');
				}
			},
			addArea() {
				this.option.area.push({
					shipRegion: {
						begin: '',
						end: '',
					},
					addPrice: '',
					rates: '',
				})
			},
			removeArea (index) {
				this.option.area.splice(index, 1);
			},
			postEdit() {
				this.$refs.postForm.validate(async valid => {
					if (valid) {
						let params = {};
						let temp = [];

						for (let i in this.option) {
							if (i == 'lang' || i == 'categoryLangList' || i == 'area') {

							} else {
								params[i] = this.option[i];
							}
						}

						if (this.option.isLeaves === 1) {
							params.isFreeShip = this.option.isFreeShip;

							if (this.option.area.length == 0) {
								this.$message.warning('利润率/追加/出货价区间不能为空');
								return;
							}
							params.rates = '';
							params.shipRegion = '';
							params.addPrice = '';

							this.option.area.forEach((item, index) => {
								if (index === 0) {
									params.rates += item.rates;
									params.shipRegion += item.shipRegion.begin + '-' + item.shipRegion.end;
									params.addPrice += item.addPrice;
								} else {
									params.rates += '|' + item.rates;
									params.shipRegion += '|' + item.shipRegion.begin + '-' + item.shipRegion.end;
									params.addPrice += '|' + item.addPrice;
								}

							})
						}

						for (let j in this.option.categoryLangList) {
							let item = this.option.categoryLangList[j];
							if (item.show) {
								temp.push({
									lang: item.lang,
									categoryName: item.categoryName,
									catTitle: item.catTitle,
									catDesc: item.catDesc,
									recommendInfo: item.recommendInfo,
									keywords: item.keywords,
								})
							}
						}

                        // 渠道
                        let tempPipe = [];
                        params.pipelineCategoryList.forEach(item => {
                            tempPipe.push({
                                pipelineCode: item.pipelineCode,
                                isShow: item.isShow,
                            })
                        });
                        params.pipelineCategoryReq = tempPipe;
                        delete params.pipelineCategoryList;
                        delete params.pipelineArr;
                        //

						params.categoryLangList = temp;
                        let src = 'goods/category/add';

                        if(this.$route.query.parentId) {
                            params.parentId = this.$route.query.parentId;
                        }
                        this.saveLoading = true;
                        try {
                            const data = await this.httpPost_(src, params);
                            this.$message.success(data.message);
                            this.$router.push({
                                name: 'goods_goodsClassify'
                            });
                        } finally {
                            this.saveLoading = false;
                        }
					}
				})
			},
            // 渠道
            changePipe(val) {
                if (this.changePipeFlag) {
                    this.changePipeFlag = false;
                    return;
                }
                if(val.indexOf('all') != -1) {
                    this.option.pipelineArr = val = this.pipeList;
                }
                this.option.pipelineCategoryList = [];
                if (val.length > 0) {
                    val.forEach(item => {
                        this.option.pipelineCategoryList.push({
                            isShow: 0,
                            pipelineCode: item,
                            pipelineName: this.pipeObj[item],
                        })
                    });
                }
            },
            checkAll(val) {
                if (val.target.checked) {
                    this.option.pipelineCategoryList.forEach(item => {
                        item.isShow = 1;
                    });
                } else {
                    this.option.pipelineCategoryList.forEach(item => {
                        item.isShow = 0;
                    });
                }
            },
		}
	}
</script>

<style lang="less">
	.goods-classify-add {
		padding-right: 40%;

		.title-label {
			.el-form-item__label {
				font-size: 18px;
				font-weight: bold;
				text-align: left;
				padding: 9px 12px 11px 45px;
			}
		}

		.cat-title {
			margin: 10px;
		}

		.leaves-box {
			border: 1px solid #bfcbd9;
			border-radius: 4px;
			margin-left: 80px;
		}

		.cat-h3 {
			margin: 10px 0 10px 100px;
			padding-left: 20px;
			border-bottom: 1px solid #bfcbd9;
		}

		.area-item {

			.el-input {
				margin-bottom: 10px;
			}
		}
	}
</style>
