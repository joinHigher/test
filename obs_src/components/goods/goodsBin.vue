<!-- 商品回收站 -->
<template>
	<div class="bin">
		<div class="el-container">
			<el-form :model="option" label-width="80px" ref="ruleForm">
				<el-form-item label="快捷搜索">
					<el-input v-model.trim="searchCode" class="quick-search" placeholder="SKU/外部商品编码/SPU/外部产品编码(多个以','号隔开)">
						<el-select filterable clearable :default-first-option='true' v-model="quickTypeVal" slot="prepend" placeholder="请选择">
							<el-option v-for="(value, key, index) in quickSearchType" :key="index" :label="value" :value="key">
							</el-option>
						</el-select>
					</el-input>
				</el-form-item>
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="添加原因: ">
							<el-select v-model="option.recycleReasonType" placeholder="请选择" filterable clearable :default-first-option='true'>
								<el-option v-for="(value, key, index) in infringingReason" :key="index" :label="value" :value="key">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="主图类型: ">
							<el-select v-model="option.mainType" placeholder="请选择" filterable clearable :default-first-option='true'>
								<el-option v-for="(value, key, index) in masterImgType" :key="index" :label="value" :value="key">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="所有相册类型:" label-width="100px">
							<el-checkbox-group v-model="tempGalleryType">
								<el-checkbox v-for="(value, key, index) in photoAlbumType" name="allPicType" :key="key" :label="value">
								</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-row>
				<el-row style="float: left;">
					<el-button v-if="self.showAction_('goods/goods/delete-recycle')" type="primary" icon="fa-undo" @click="massReduction" style="float: left;" :disabled="this.multipleSelection.length === 0">批量还原</el-button>
					<el-button type="primary" icon="fa-files-o" @click="copy('goodSn')" :disabled="this.multipleSelection.length === 0">复制SKU</el-button>
					<el-button type="primary" icon="fa-files-o" @click="copy('goodsWebSku')" :disabled="this.multipleSelection.length === 0">复制外部商品编码</el-button>
				</el-row>
				<el-row style="float: right;">
					<el-button type="primary" icon="search" @click="getRecycleListData">筛选</el-button>
					<el-button type="danger" icon="close" @click="resetForm">重置</el-button>
				</el-row>
			</el-row>
			<el-table :data="RecycleListData" border tooltip-effect="dark" style="width: 100%; margin-top:30px" v-loading="tableLoading" @row-click="handleCurrentChange" @selection-change="multipleSelectionChange" ref="RecycleListData">
				<el-table-column type="selection">
				</el-table-column>
				<el-table-column prop="goodSn" label="sku">
				</el-table-column>
				<el-table-column prop="goodTitle" label="商品标题">
				</el-table-column>
				<el-table-column label="商品主图">
					<template scope="scope" prop="gridUrl">
						<img class="table-img" :src="self.domain + scope.row.mainImage.gridUrl" width="90" height="120">
					</template>
				</el-table-column>
				<el-table-column prop="goodsWebSku" label="外部商品编码">
				</el-table-column>
				<el-table-column prop="goodsSpu" label="SPU">
				</el-table-column>
				<el-table-column prop="goodsWebSpu" label="外部产品编码">
				</el-table-column>
				<el-table-column label="主图类型">
					<template scope="scope">
						{{photoAlbumType[scope.row.mainType]}}
					</template>
				</el-table-column>
				<el-table-column label="相册类型" prop="galleryTypeList">
					<template scope="scope">
						<span v-for="(item,index) in scope.row.galleryTypeList">
                      		{{photoAlbumType[item]}}<label v-if="index!=scope.row.galleryTypeList.length-1">、</label>
                    	</span>
					</template>
				</el-table-column>
				<el-table-column label="添加原因">
					<template scope="scope">
						{{infringingReason[scope.row.recycleReasonType]}}
					</template>
				</el-table-column>
				<el-table-column label="操作" column-key="handle">
					<template scope="scope">
						<el-button v-if="self.showAction_('goods/goods/delete-recycle')" type="primary" size="small" icon="fa-undo" @click="revivification(scope.$index, scope.row)">还原</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50,100,200,400]" :page-size="option.pageSize" :current-page="option.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
			<input id="copyTxt" v-model="copyTxt" class="hidden-input">
		</div>
		<!-- 弹窗S -->
		<el-dialog title="提示" :visible.sync="existsDialogVisible" size="tiny" class="good-infringing">
			<el-form label-width="100px" class="recycle-form">
				<div class="color-danger ">商品还原成功!</div>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="cancleAgainRecycle">取 消</el-button>
				<el-button type="primary" @click="confirmAgainRecycle">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 弹窗E -->
	</div>
</template>

<script>
	export default {
		data() {
			function setOpts(arr) {
				if(Array.isArray(arr)) {
					return arr.map(function(str) {
						var tempArr = str.split('=');
						return {
							label: tempArr[0],
							value: tempArr[1]
						}
					});
				} else {
					throw new Error('必须传入一组字符串数组,每个字符串格式为"label=value"');
				}
			}
			return {
				self: this,
				multipleSelection: [],
				RecycleListData: [],
				tempGalleryType: [],
				existsDialogVisible: false,
				tableLoading: false,
				total: 1,
				copyTxt: '',
				searchCode: '',
				quickTypeVal: '',
				multipleSelection: [],
				option: {
					pageNo: 1,
					pageSize: 10,
					goodsWebSpu: '',
					goodsSpu: '',
					goodsWebSku: '',
					goodSn: '',
					recycleReasonType: '',
					mainType: '',
					galleryType: ''
				},
				singleRecycleParams: {
					goodSnList: [],
				},
				deleteRecycle: {
					goodSnList: [],
				},
				quickSearchType: {
					'1': 'sku',
					'2': '外部商品编码',
					'3': 'spu',
					'4': '外部产品编码'
				},
				infringingReason: {
					'1': '手动,pdm加入回收站',
					'2': '手动,pdm加入侵权列表',
					'3': '手动,单网侵权',
					'4': '手动,网站不售卖',
					'5': '备注',
                    '6': '网站删除仓库',
                    '7': 'PDM下发删除侵权商品指令，加入回收站'
				},
				masterImgType: {
					'1': '网络图',
					'2': '自拍图',
					'3': '分销图'
				},
				mapBumType: {
					'网络图': 1,
					'自拍图': 2,
					'分销图': 3
				},
				photoAlbumType: {
					'1': '网络图',
					'2': '自拍图',
					'3': '分销图'
				}
			}
		},

		created() {
			this.getRecycleList();
		},

		computed: {
			domain() {
				return this.$store.getters.getDomain + '/';
			}
		},

		methods: {
			async getRecycleList() {
				if(this.quickTypeVal.toString() == 1) {
					this.option.goodSn = this.searchCode;
					this.option.goodsWebSku = '';
					this.option.goodsWebSpu = '';
					this.option.goodsSpu = ''
				} else if(this.quickTypeVal.toString() == 2) {
					this.option.goodsWebSku = this.searchCode;
					this.option.goodSn = '';
					this.option.goodsWebSpu = '';
					this.option.goodsSpu = ''
				} else if(this.quickTypeVal.toString() == 3) {
					this.option.goodsSpu = [this.searchCode].join(',');
					this.option.goodsWebSku = '';
					this.option.goodSn = '';
					this.option.goodsWebSpu = ''
				} else if(this.quickTypeVal.toString() == 4) {
					this.option.goodsWebSpu = [this.searchCode].join(',');
					this.option.goodsSpu = '';
					this.option.goodSn = '';
					this.option.goodsWebSku = ''
				} else {
					this.option.goodsWebSpu = '';
					this.option.goodsSpu = '';
					this.option.goodSn = '';
					this.option.goodsWebSku = ''
				};
				if(this.infringingReason.toString() == '0') {
					this.option.recycleReasonType = 0
				};
				if(this.tempGalleryType && this.tempGalleryType.length > 0) {
					var tempString = '';
					for(var i = 0; i < this.tempGalleryType.length; i++) {
						tempString += this.mapBumType[this.tempGalleryType[i]] + ",";
						if(i == this.tempGalleryType.length[i] - 1) {
							tempString += this.mapBumType[this.tempGalleryType]
						};
					};
					this.option.galleryType = tempString
				} else {
					this.option.galleryType = ''
				};

				let params = {};
				for (let i in this.option) {
					if (this.option[i] !== '') {
						params[i] = this.option[i];
					}
				}

				this.tableLoading = true;
                try {
                    const data = await this.httpGet_('goods/goods/get-recycle-list', {params: params});
                    this.RecycleListData = data.list;
                    this.total = data.totalCount;
                } finally {
                    this.tableLoading = false;
                }
			},

			revivification(index, row) {
				this.$confirm('确让将商品从回收站中还原?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.deleteRecycle = {
						goodSnList: [row.goodSn]
					};
					for(var i = 0; i < this.multipleSelection.length; i++) {
						this.deleteRecycle.goodSnList.push(this.multipleSelection[i].goodSn)
					};
                    //

                    let data = await this.httpGet_('goods/goods/query-p-d-m-operation-result', {params: this.deleteRecycle});

                    if (data.goodsnNotExist.length === 0 && data.goodsnNotRealStock.length === 0 && data.isAlreadyTrotOrRecycle.length === 0) {
                        let res = await this.httpPost_('goods/goods/delete-recycle', this.deleteRecycle);
                        this.$message.success(res.message);
                        this.getRecycleList();
                    } else {
                        let resStr = '';
                        if (data.goodsnNotExist.length > 0) {
                            resStr += 'sku【' + data.goodsnNotExist.join(',') + '】不存在；';
                        }
                        if (data.goodsnNotRealStock.length > 0) {
                            resStr += 'sku【' + data.goodsnNotRealStock.join(',') + '】没有对应的真实仓；';
                        }
                        if (data.isAlreadyTrotOrRecycle.length > 0) {
                            resStr += 'sku【' + data.isAlreadyTrotOrRecycle.join(',') + '】在pdm回收站或者侵权；';
                        }
                        this.$alert(resStr, '错误', {
                            type: 'error'
                        });
                    }
				}).catch(res => {
					this.$message.info('已取消还原');
				})
			},

			massReduction() {

				this.$confirm('确让将这' + this.multipleSelection.length + '个商品从回收站中还原?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.deleteRecycle = {
						goodSnList: []
					};
					for(var i = 0; i < this.multipleSelection.length; i++) {
						this.deleteRecycle.goodSnList.push(this.multipleSelection[i].goodSn)
					};

                    let data = await this.httpGet_('goods/goods/query-p-d-m-operation-result', {params: this.deleteRecycle});
                    if (data.goodsnNotExist.length === 0 && data.goodsnNotRealStock.length === 0 && data.isAlreadyTrotOrRecycle.length === 0) {
                        let res = await this.httpPost_('goods/goods/delete-recycle', this.deleteRecycle);
                        this.$message.success(res.message);
                        this.getRecycleList();
                    } else {
                        let resStr = '';
                        if (data.goodsnNotExist.length > 0) {
                            resStr += 'sku【' + data.goodsnNotExist.join(',') + '】不存在；';
                        }
                        if (data.goodsnNotRealStock.length > 0) {
                            resStr += 'sku【' + data.goodsnNotRealStock.join(',') + '】没有对应的真实仓；';
                        }
                        if (data.isAlreadyTrotOrRecycle.length > 0) {
                            resStr += 'sku【' + data.isAlreadyTrotOrRecycle.join(',') + '】在pdm回收站或者侵权；';
                        }
                        this.$alert(resStr, '错误', {
                            type: 'error'
                        });
                    }

					// this.$http.get('goods/goods/query-p-d-m-operation-result', {
					// 	params: this.deleteRecycle
					// }).then(res => {
					// 	if (res.body.code == 0) {
     //                        let data = res.body.data;
     //                        if (data.goodsnNotExist.length === 0 && data.goodsnNotRealStock.length === 0 && data.isAlreadyTrotOrRecycle.length === 0) {
     //                            this.$http.post('goods/goods/delete-recycle', this.deleteRecycle).then(res => {
					// 				if(res.body.code === 0) {
					// 					this.$message.success(res.body.message);
					// 					this.getRecycleList()
					// 				} else {
					// 					this.$message.error(res.body.message);
					// 				}
					// 			})
     //                        } else {
     //                            let resStr = '';
     //                            if (data.goodsnNotExist.length > 0) {
     //                                resStr += 'sku【' + data.goodsnNotExist.join(',') + '】不存在；';
     //                            }
     //                            if (data.goodsnNotRealStock.length > 0) {
     //                                resStr += 'sku【' + data.goodsnNotRealStock.join(',') + '】没有对应的真实仓；';
     //                            }
     //                            if (data.isAlreadyTrotOrRecycle.length > 0) {
     //                                resStr += 'sku【' + data.isAlreadyTrotOrRecycle.join(',') + '】在pdm回收站或者侵权；';
     //                            }
     //                            this.$alert(resStr, '错误', {
     //                                type: 'error'
     //                            });
     //                        }
     //                    } else {
     //                        this.$message.error(res.body.message);
     //                    }
					// })
				}).catch(res => {
					this.$message.info('已取消还原');
				})
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

			resetForm() {
				this.quickTypeVal = '';
				this.searchCode = '';
				this.option.recycleReasonType = '';
				this.option.galleryType = '';
				this.tempGalleryType = [];
				this.option.mainType = '';
				this.$refs.ruleForm.resetFields()
			},

			getRecycleListData() {
				if(this.quickTypeVal > 0 && (!this.searchCode || this.searchCode.toString().trim() == '')) {
					this.$message('请输入外部商品编码/SKU');
					return;
				} else if(this.quickTypeVal <= 0 && (this.searchCode || !this.searchCode.toString().trim() == '')) {
					this.$message('请选择快捷筛选类型');
					return;
				} else {
					this.getRecycleList()
				}
			},

			multipleSelectionChange(val) {
				this.multipleSelection = val
			},

			ChangePage(val) {
				this.option.pageNo = val;
				this.getRecycleList()
			},

			ChangePageSize(val) {
				this.option.pageSize = val;
				this.getRecycleList()
			},

			handleCurrentChange(row, event, column) {
				if(column.columnKey != 'handle') {
					this.$refs.RecycleListData.toggleRowSelection(row)
				}
			},

			confirmAgainRecycle() {
				this.existsDialogVisible = false
				this.getRecycleList()
			},

			cancleAgainRecycle() {
				this.existsDialogVisible = false
			}
		}
	}
</script>

<style lang="less">
	.bin {
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
	}
</style>
