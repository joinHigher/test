<!-- 侵权商品 -->
<template>
	<div>
		<div class="el-container good-infringing">
			<el-form :model="option" ref="option" label-width="80px" :rules="searchRule">
				<el-form-item label="快捷搜索">
					<el-input v-model.trim="searchCode" class="quick-search" placeholder="SKU/外部商品编码/SPU/外部产品编码">
						<el-select filterable clearable :default-first-option='true' v-model="quickTypeVal" slot="prepend" placeholder="请选择">
							<el-option v-for="(value, key, index) in quickSearchType" :key="index" :label="value" :value="key">
							</el-option>
						</el-select>
					</el-input>
				</el-form-item>
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="来源渠道" prop="tortPipelineCode">
		                    <el-select v-model="option.tortPipelineCode">
		                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
		                    </el-select>
		                </el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="来源平台" prop="tortPlatform">
		                    <el-select v-model="option.tortPlatform">
		                        <el-option v-for="(item, index) in platOpt" :key="index" :value="index" :label="item"></el-option>
		                    </el-select>
		                </el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="侵权原因: ">
							<el-select v-model="option.trotReasonType" placeholder="请选择" filterable clearable :default-first-option='true'>
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
					<el-col :span="10">
						<el-form-item label="所有相册类型:" label-width="100px">
							<el-checkbox-group v-model="tempGalleryType">
								<el-checkbox v-for="(value, key, index) in albumType" name="allPicType" :key="key" :label="value">
								</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row type="flex" justify="end">
					<el-button type="primary" icon="search" @click="getDataTort">筛选</el-button>
					<el-button type="danger" icon="close" @click="resetSearch">重置</el-button>
				</el-row>
			</el-form>
			<el-row style="margin-top:20px;">
				<el-button v-if="self.showAction_('goods/goods/batch-add-recycle')" type="danger" icon="fa-ban" @click="addRecycle" :disabled="this.multipleSelection.length === 0">批量加入回收站</el-button>
				<el-button v-if="self.showAction_('goods/trot/remove-trot')" type="danger" icon="delete" @click="deleteMultiple" :disabled="this.multipleSelection.length === 0">批量删除</el-button>
				<el-button type="primary" icon="fa-files-o" @click="copy('goodSn')" :disabled="this.multipleSelection.length === 0">复制SKU</el-button>
				<el-button type="primary" icon="fa-files-o" @click="copy('goodsWebSku')" :disabled="this.multipleSelection.length === 0">复制外部商品编码</el-button>
				<el-button v-if="self.showAction_('goods/trot/add-trot')" type="primary" icon="plus" style="float:right;" @click="addInfringing">添加侵权商品</el-button>
			</el-row>
			<el-table ref="infringingList" :data="infringingList" border tooltip-effect="dark" style="width: 100%" v-loading="tableLoading" @row-click="handleCurrentChange" @selection-change="multipleSelectionChange" fit>
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column prop="goodsWebSpu" label="外部产品编码">
				</el-table-column>
				<el-table-column prop="goodsSpu" label="SPU">
				</el-table-column>
				<el-table-column prop="goodsWebSku" label="外部商品编码">
				</el-table-column>
				<el-table-column prop="goodSn" label="SKU">
				</el-table-column>
				<el-table-column prop="goodTitle" label="商品标题">
				</el-table-column>
				<el-table-column prop="mainType" label="主图类型">
					<template scope="scope">
						{{masterImgType[scope.row.mainType]}}
					</template>
				</el-table-column>
				<el-table-column prop="galleryTypeList" label="相册类型">
					<template scope="scope">
						<span v-for="(item,index) in scope.row.galleryTypeList">
                      {{albumType[item]}}<label v-if="index!=scope.row.galleryTypeList.length-1">、</label>
                    </span>
					</template>
				</el-table-column>
				<el-table-column prop="addTime" label="添加时间">
					<template scope="scope">
						{{self.timeZone_(scope.row.trotCreateTime, self.$store.getters.getTimeZone)}}
					</template>
				</el-table-column>
				<el-table-column prop="tortPipelineCode" label="来源渠道">
					<template scope="scope">
						{{pipeOpt[scope.row.tortPipelineCode]}}
					</template>
				</el-table-column>
				<el-table-column label="来源平台">
					<template scope="scope">
						{{platOpt[scope.row.tortPlatform]}}
					</template>
				</el-table-column>
				<el-table-column prop="trotReasonType" label="侵权原因">
					<template scope="scope">
						{{infringingReason[scope.row.trotReasonType]}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="170" column-key="handle">
					<template scope="scope">
						<el-button v-if="self.showAction_('goods/goods/batch-add-recycle')" type="primary" size="small" @click="addSingleRecycle(scope.$index, scope.row)">加入回收站
						</el-button>
						<el-button v-if="self.showAction_('goods/trot/remove-trot')" type="danger" size="small" @click="deleteSingleInfringing(scope.$index, scope.row.goodSn)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[20,50,100]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
			<input id="copyTxt" v-model="copyTxt" class="hidden-input">
		</div>
		<!-- 弹窗S -->
		<el-dialog title="加入回收站" :visible.sync="recycleDialogVisible" size="tiny" class="good-infringing">
			<el-form label-width="100px" ref="recycleForm" :model="recycleForm" :label-position="labelPosition" class="recycle-form">
				<el-form-item prop="recycleReasonType" label="添加原因: " :rules="[{ required: true, message: '请选择原因'}]">
					<el-select v-model="recycleForm.recycleReasonType" placeholder="请选择添加原因">
						<el-option v-for="(value, key, index) in recycleReasons" :key="index" :label="value" :value="key"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="recycleReason" label="备注">
					<el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="recycleForm.recycleReason"></el-input>
				</el-form-item>

			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAddRecycle">取 消</el-button>
				<el-button type="primary" @click="confirmRecycle">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="添加侵权商品" :visible.sync="addDialogVisible" size="tiny" class="good-infringing">
			<el-form ref="addForm" :model="addForm" :label-position="labelPosition" class="addForm-form" label-width="140px">
                <el-form-item label="来源平台" prop="tortPlatform" :rules="required">
                    <el-select v-model="addForm.tortPlatform">
                        <el-option v-for="(item, index) in platOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源渠道" prop="tortPipelineCode" :rules="required">
                    <el-select v-model="addForm.tortPipelineCode">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
				<el-form-item prop="goodSnList" label="商品货号sku:" :rules="[{ required: true, message: '请输入商品货号sku'}]">
					<el-input type="textarea" :rows="3" placeholder="多个SKU之间用英文','隔开" v-model="addForm.goodSnList"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="cancleAddInfringing">取 消</el-button>
				<el-button type="primary" @click="confirmAddInfringing">确 定</el-button>
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
                required: [{ required: true, message: '该项不能为空'}],
				self: this,
				option: {
					goodSn: '',
					goodsWebSpu: '',
					goodsSpu: '',
					goodsWebSku: '',
					pageNo: 1,
					pageSize: 20,
					trotReasonType: '',
					mainType: '',
					galleryType: [],
					tortPipelineCode: '',
					tortPlatform: '',
				},
				tempGalleryType: [],
				quickTypeVal: '',
				copyTxt: '',
				searchCode: '',
				infringingList: [],
				multipleSelection: [],
				recycleDialogVisible: false,
				tableLoading: false,
				existsDialogVisible: false,
				addDialogVisible: false,
				addDialogVisibleList: false,
				recycleRemark: '',
				labelPosition: 'right',
				addForm: {
					goodSnList: '',
                    tortPlatform: '',
                    tortPipelineCode: '',
				},
				recycleForm: {
					recycleReasonType: '',
					recycleReason: '',
				},
				existSKU: '',
				vacancy: {},
				quickSearchType: {
					'1': 'sku',
					'2': '外部商品编码',
					'3': 'spu',
					'4': '外部产品编码'
				},
				infringingReason: {
					'1': 'PDM加入侵权',
					'2': '手动，单网侵权'
				},
				masterImgType: {
					'1': '网络图',
					'2': '自拍图',
					'3': '分销图'
				},
				albumType: {
					'1': '网络图',
					'2': '自拍图',
					'3': '分销图'
				},
				recycleReasons: {
					'1': '手动,pdm加入回收站',
					'2': '手动,pdm加入侵权列表',
					'3': '手动,单网侵权',
					'4': '手动,网站不售卖',
					'5': '备注'
				},
				mapBumType: {
					'网络图': 1,
					'自拍图': 2,
					'分销图': 3
				},
				platOpt: {
					'1': 'PC',
					'2': 'M端',
					'3': 'IOS',
					'4': 'ANDROID',
					'5': 'PAD'
				},
				self: this,
				total: 1,
				searchRule: {
					tortPlatform: [{
						required: true,
						message: '该项不能为空',
					}],
					tortPipelineCode: [{
						required: true,
						message: '该项不能为空',
					}],
				}
			};
		},
        mounted() {
            // this.getData();
        },
        computed: {
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            },
        },
		methods: {
			getData() {
				this.$refs.option.validate(async valid => {
					if (valid) {
						if(this.quickTypeVal.toString() == 1) {
							this.option.goodSn = this.searchCode;
							this.option.goodsWebSpu = '';
							this.option.goodsWebSku = '';
							this.option.goodsSpu = ''
						} else if(this.quickTypeVal.toString() == 2) {
							this.option.goodsWebSku = this.searchCode;
							this.option.goodSn = '';
							this.option.goodsWebSpu = '';
							this.option.goodsSpu = ''
						} else if(this.quickTypeVal.toString() == 3) {
							this.option.goodsSpu = [this.searchCode].join(',');
							this.option.goodsWebSpu = '';
							this.option.goodSn = '';
							this.option.goodsWebSku = ''
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

						if(this.tempGalleryType && this.tempGalleryType.length > 0) {
							var tempArray = [];
							for(var i = 0; i < this.tempGalleryType.length; i++) {
								tempArray.push(this.mapBumType[this.tempGalleryType[i]]);
							}
							this.option.galleryType = tempArray;
						} else {
							this.option.galleryType = '';
						}

						let params = {};
						for(let i in this.option) {
							var item = this.option[i];
							if(item != null && item != '') {
								params[i] = item;
							}
						}
						this.infringingList = [];
						this.tableLoading = true;
                        try {
                            const data = await this.httpGet_('goods/trot/list', {
                                params: params
                            });
                            this.infringingList = data.list;
                            this.total = data.totalCount;
                        } finally {
                            this.tableLoading = false;
                        }
					}
				});
			},

			ChangePage(val) {
				this.option.pageNo = val;
				this.getData();
			},

			ChangePageSize(val) {
				this.option.pageSize = val;
				this.getData();
			},

			async deleteSingleInfringing(delIndex, goodSn) {
				var params = {
					goodSnList: [goodSn],
				};
                const data = await this.httpPost_('goods/trot/remove-trot', params);
                this.$message.success(data.message);
                setTimeout(() => {
                    this.getData()
                }, 800);
			},

			async deleteMultiple() {
				var params = {
					goodSnList: []
				};
				for(var i = 0; i < this.multipleSelection.length; i++) {
					params.goodSnList.push(this.multipleSelection[i].goodSn);
				}
                const data = await this.httpPost_('goods/trot/remove-trot', params);
                if(data.data) {
                    this.$message.success(data.message);
                    if(this.infringingList && this.infringingList.length > 0) {
                        var tempList = []
                        for(var i = 0; i < this.infringingList.length; i++) {
                            if(params.goodSnList.indexOf(this.infringingList[i].goodSn) < 0) {
                                tempList.push(this.infringingList[i]);
                            }
                        }
                        this.infringingList = tempList;
                    }
                    return;
                }
                this.$message.success(data.message);
                setTimeout(() => {
                    this.getData()
                }, 800);
			},

			multipleSelectionChange(val) {
				this.multipleSelection = val;
			},

			async addRecycle(index, goodSn) {
				var params = {
					goodSnList: []
				};
				for(var i = 0; i < this.multipleSelection.length; i++) {
					params.goodSnList.push(this.multipleSelection[i].goodSn);
				};
                const res = await this.httpPost_('goods/goods/check-recycle-is-exists', params);
                let data = res.data;
                if(data.goodSnList && data.goodSnList.length > 0) {
                    let str = 'SKU:' + data.goodSnList.join(',') + '已加入回收站'
                    this.$alert(str, '已有商品加入回收站', {
                        type: 'error'
                    })
                } else {
                    this.recycleDialogVisible = true;
                }
			},

			confirmRecycle() {
				this.$refs["recycleForm"].validate((valid) => {
					if(valid) {
						var params = {};
						params = {
							goodSnList: [],
							recycleReasonType: this.recycleForm.recycleReasonType,
							recycleReason: this.recycleForm.recycleReason,
							isForce: 0
						};
						for(var i = 0; i < this.multipleSelection.length; i++) {
							params.goodSnList.push(this.multipleSelection[i].goodSn);
						}
						this.$http.post('goods/goods/batch-add-recycle', params).then(subRes => {
							if(subRes.body.code === 0) {
								let subData = subRes.body.data;
                                if (subData.goodsnNotExist.length > 0 || subData.goodsnNotRealStock.length > 0 | subData.isAlreadyTrotOrRecycle.length > 0) {
                                    this.$confirm('是否继续?', '提示', {
                                        type: 'warning'
                                    }).then(() => {
                                        params.isForce = 1;
                                        this.$http.post('goods/goods/batch-add-recycle', params).then(res => {
                                            if (res.body.code == 0) {
                                                let data = res.body.data;
                                                if (data.goodsnNotExist.length === 0 && data.goodsnNotRealStock.length === 0 && data.isAlreadyTrotOrRecycle.length === 0) {
                                                    this.$message({
                                                        type: 'success',
                                                        message: res.body.message
                                                    });
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
                                            } else {
                                                this.$message.error(res.body.message);
                                            }
                                        });
                                    }).catch(() => {
                                        this.$message({
                                            type: 'info',
                                            message: '已取消!'
                                        });
                                    });
                                } else {
                                    this.$message.success(subRes.body.message);
                                    this.recycleDialogVisible = false;
                                    this.getData();
                                }
							} else {
								this.$message.error(subRes.body.message);
							}
						})
					}
				});
			},

			cancelAddRecycle() {
				this.recycleDialogVisible = false;
			},

			confirmAgainRecycle() {
				this.existsDialogVisible = false;
				this.getData();
				var params = {};
			},

			cancleAgainRecycle() {
				this.existsDialogVisible = false;
			},

			async addSingleRecycle(index, row) {
				this.multipleSelection = [row];
				let recycleBin = {
					goodSnList: [row.goodSn]
				};
                const res = await this.httpPost_('goods/goods/check-recycle-is-exists', recycleBin);
                let data = res.data;
                if(data.goodSnList && data.goodSnList.length > 0) {
                    let str = 'SKU:' + data.goodSnList.join(',') + '已在回收站'
                    this.$alert(str, '已在回收站', {
                        type: 'error'
                    })
                    return
                } else {
                    this.recycleDialogVisible = true;
                }
			},

			addInfringing() {
				this.addDialogVisible = true;
				this.$nextTick(function() {
					this.$refs["addForm"].resetFields();
				});
			},

			cancleAddInfringing() {
				this.addDialogVisible = false;
			},

			confirmAddInfringing() {
				this.$refs["addForm"].validate(async (valid) => {
					if(valid) {
						//调用批量添加侵权的商品的接口
						var params = {
							goodSnList: this.addForm.goodSnList.split(','),
                            tortPipelineCode: this.addForm.tortPipelineCode,
                            tortPlatform: this.addForm.tortPlatform,
						};

                        const res = await this.httpPost_('goods/trot/add-trot', params);
                        let data = res.data;
                        if(data.trotInfoList && data.trotInfoList.length > 0) {
                            let str = 'SKU:' + data.trotInfoList.join(',') + '已加入侵权商品'
                            this.$alert(str, '已有商品加入侵权商品列表', {
                                type: 'error'
                            })
                        } else if(data.siteGoodsList && data.siteGoodsList.length > 0) {
                            let str = 'SKU:' + data.siteGoodsList.join(',') + '站点库不存在该SKU'
                            this.$alert(str, '站点库不存在该SKU', {
                                type: 'error'
                            })
                        } else {
                            this.addDialogVisible = false;
                            this.$message.success(res.message);
                            this.getData()
                        }
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

			resetSearch() {
				this.$refs.option.resetFields();
				this.quickTypeVal = '';
				this.searchCode = '';
				var defaultOption = {
					goodSn: '',
					goodsSpu: '',
					goodsWebSpu: '',
					goodsWebSku: '',
					pageNo: 1,
					pageSize: 10,
					trotReasonType: '',
					mainType: '',
					galleryType: []
				};
				this.tempGalleryType = [];
				this.option = defaultOption
			},

			confirmAddInfringingList() {
				this.getData();
				this.addDialogVisibleList = false
			},

			getDataTort() {
				if(this.quickTypeVal > 0 && (!this.searchCode || this.searchCode.toString().trim() == '')) {
					this.$message('请输入外部商品编码/SKU');
					return;
				} else if(this.quickTypeVal <= 0 && (this.searchCode || !this.searchCode.toString().trim() == '')) {
					this.$message('请选择快捷筛选类型');
					return;
				} else {
					this.getData();
				}
			},

			handleCurrentChange(row, event, column) {
				if(column.columnKey != 'handle') {
					this.$refs.infringingList.toggleRowSelection(row)
				}
			}
		}
	}
</script>
<style lang="less">
	.good-infringing {
		.el-table {
			margin-top: 10px;
		}
		.el-table th,
		.el-table td {
			text-align: center;
		}
		.el-table th>.cell {
			line-height: 1.5;
		}
		.el-table .el-button+.el-button {
			margin-left: 2px;
		}
		.el-pagination {
			text-align: right;
			margin-top: 10px;
		}
		.recycle-tip {
			margin-bottom: 20px;
		}
	}
</style>
