<!-- 站点分类管理 -->
<template>
	<div class="goods-classify">
		<div class="el-container">
			<div class="el-sub-container">
                <el-form inline label-width="100px" ref="searchForm" :model="searchForm">
                    <el-form-item label="分类查询" prop="searchContent" :rules="[{validator: searchRule}]">
                        <el-input v-model="searchForm.searchContent" class="quick-search" placeholder="搜索内容">
                            <el-select filterable clearable v-model="searchForm.searchType" slot="prepend" placeholder="请选择">
                                <el-option label="商品分类ID" value="1"></el-option>
                                <el-option label="商品分类名称" value="2"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="renderTable(2, searchForm)">查询</el-button>
                        <el-button type="danger" @click="resetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
				<div class="text-left">
                    <el-button :disabled="defaultData.length === 0" type="primary" @click="resetTable" icon="plus">全部收回</el-button>
					<el-button type="primary" @click="createCat" icon="plus">添加分类</el-button>
					<el-button type="primary" @click="setPackage" icon="setting">设置包邮</el-button>
					<el-button type="primary" @click="editProfitRate" icon="edit">编辑追加/利润率</el-button>
					<el-button type="primary" @click="openTransferCatDialog" icon="fa-share-square-o">转移商品分类</el-button>
					<router-link class="el-button el-button--primary" icon="edit" tag="li" :to="{name: 'goods_goodsCatAttr'}">编辑商品分类属性</router-link>
				</div>
			</div>
			<el-table :data="tableData" border v-loading="tableLoading">
				<el-table-column label="分类名称">
                    <template scope="scope">
                        <div :style="{'margin-left': scope.row.level * 30 + 'px'}">
                             <a v-if="scope.row.isLeaves == 0 && scope.row.subCategoryList && scope.row.subCategoryList.length > 0" class="tree-btn" @click="toggle(scope.row, scope.$index)"><i :class="{'el-icon-plus': !scope.row.toggle, 'el-icon-minus': scope.row.toggle}"></i>{{scope.row.categoryMultiLang.categoryName}}</a>
                             <span v-else>{{scope.row.categoryMultiLang.categoryName}}</span>
                        </div>
                    </template>
				</el-table-column>
				<el-table-column label="是否显示">
					<template scope="scope">
						<i :class="{'el-icon-circle-check color-success': scope.row.isDisplay == 1, 'el-icon-circle-cross color-danger': scope.row.isDisplay == 0}"></i>
					</template>
				</el-table-column>
				<el-table-column label="包邮状态">
					<template scope="scope">
						<i :class="{'el-icon-circle-check color-success': scope.row.isFreeShip == 1, 'el-icon-circle-cross color-danger': scope.row.isFreeShip == 0}"></i>
					</template>
				</el-table-column>
				<el-table-column label="启用渠道" width="200px">
					<template scope="scope">
						<span v-for="(item, index) in scope.row.pipelineCategory">
							<span v-if="index != 0">,</span>
							{{pipeOpt[item.pipelineCode]}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="shipRegion" label="商品计费价格区间(￥)"></el-table-column>
				<el-table-column prop="addPrice" label="追加(￥)"></el-table-column>
				<el-table-column prop="rates" label="利润率"></el-table-column>
				<el-table-column label="操作时间">
					<template scope="scope">
						{{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200px">
					<template scope="scope">
						<el-popover ref="popover" placement="left" width="100" trigger="hover">
	                        <el-button v-if="scope.row.isLeaves != 1" type="text" size="small" @click="getParentList(scope.row, 'add')">新增</el-button>
	                        <br>
							<el-button type="text" size="small" @click="getParentList(scope.row, 'edit')">编辑</el-button>
							<br>
							<el-button v-if="scope.row.isLeaves == 1" type="text" size='small' @click="openTransferGoodDialog(scope.row.id)">转移商品</el-button>
							<br>
	                        <el-button type="text" size="small" @click="editPipe(scope.row)">编辑分类渠道</el-button>
	                        <br>
	                        <el-button type="text" size="small" @click="editPipeShow(scope.row)">设置分类显示</el-button>
	                        <br>
	                        <el-button v-if="self.showAction_('goods/category/delete')" type="danger" size="small" @click="openCatDelDialog(scope.row.id, scope.row.isLeaves)">删除</el-button>
	                    </el-popover>
	                    <el-button type="primary" size="small" v-popover:popover><i class="el-icon-more"></i></el-button>
						
					</template>
				</el-table-column>
			</el-table>
		</div>

		<el-dialog title="注意" :visible.sync="dialogDeleteVisible" size="tiny">
			<el-form v-if="isLeaveDeleted == 0" :model="delForm" label-position="top">
				<el-form-item label="本操作将会删除商品分类内容，请谨慎操作。">
					<el-radio-group v-model="delForm.type">
						<el-row>
							<el-radio class="radio" label="0">删除当前单个分类，下属分类上移</el-radio>
						</el-row>
						<el-row>
							<el-radio class="radio" label="1">删除当前分类及其下属所有分类</el-radio>
						</el-row>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span v-if="isLeaveDeleted == 1">确认删除最底层分类吗?</span>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogDeleteVisible = false">取消</el-button>
				<el-button type="primary" @click="deleteCat" :disabled="deleteLoading" v-loading="deleteLoading">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="转移商品分类" :visible.sync="dialogTransferCatVisible">
			<h4>将商品分类</h4>
			<el-form inline ref="commonOption" :model="commonOption">
				<el-form-item v-for="(item, index) in commonOption.gabalNara" :key="item.id" v-show="index === 0 || commonOption.gabalNara[index].length != 0">
					<template>
						<el-select v-model="commonOption.proCate[index]" :placeholder="(index * 1 + 1) + '级分类'" @change="changeDialogCat(index, $event)" clearable filterable :default-first-option='true' @clear="clearCat(index)">
							<el-option v-for="(subItem, subIndex) in item" :key="subItem.id" :label="subItem.categoryMultiLang && subItem.categoryMultiLang.categoryName ? subItem.categoryMultiLang.categoryName : '暂无名称' + subItem.id" :value="subIndex">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
			</el-form>
			<h4>转移至</h4>
			<el-form inline ref="commonOption_1" :model="commonOption_1">
				<el-form-item v-for="(item, index) in commonOption_1.gabalNara" :key="item.id" v-show="index === 0 || commonOption_1.gabalNara[index].length != 0">
					<template>
						<el-select :disabled="commonOption.categoryId == ''" v-model="commonOption_1.proCate[index]" :placeholder="(index * 1 + 1) + '级分类'" @change="changeDialogCat_1(index, $event)" clearable filterable :default-first-option='true' @clear="clearCat_1(index)">
							<el-option v-for="(subItem, subIndex) in item" :key="subItem.id" :label="subItem.categoryMultiLang && subItem.categoryMultiLang.categoryName ? subItem.categoryMultiLang.categoryName : '暂无名称' + subItem.id" :value="subIndex">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTransferCatVisible = false">取消</el-button>
				<el-button v-if="self.showAction_('goods/category/migrate-category')" type="primary" @click="transferCat" v-loading="transLoading" :disabled="transLoading">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="转移商品" :visible.sync="dialogTransferGoodVisible" size="small">
			<h4>转移商品至</h4>
			<el-form inline ref="commonOption" :model="commonOption">
				<el-form-item v-for="(item, index) in commonOption.gabalNara" :key="item.id" v-show="index === 0 || commonOption.gabalNara[index].length != 0">
					<template>
						<el-select v-model="commonOption.proCate[index]" :placeholder="(index * 1 + 1) + '级分类'" @change="changeDialogCat(index, $event)" clearable filterable :default-first-option='true' @clear="clearCat(index)">
							<el-option v-for="(subItem, subIndex) in item" :key="subItem.id" :label="subItem.categoryMultiLang && subItem.categoryMultiLang.categoryName ? subItem.categoryMultiLang.categoryName : '暂无名称' + subItem.id" :value="subIndex">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTransferGoodVisible = false">取消</el-button>
				<el-button v-if="self.showAction_('goods/category/migrate-goods')" type="primary" @click="transferGood" v-loading="transLoading" :disabled="transLoading">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="是否设置包邮" :visible.sync="setPackageForm">
			<el-form inline ref="commonOption" :model="commonOption">
				<el-form-item v-for="(item, index) in commonOption.gabalNara" :key="item.id" v-show="index === 0 || commonOption.gabalNara[index].length != 0">
					<template>
						<el-select v-model="commonOption.proCate[index]" :placeholder="(index * 1 + 1) + '级分类'" @change="changeDialogCat(index, $event)" clearable filterable :default-first-option='true' @clear="clearCat(index)">
							<el-option v-for="(subItem, subIndex) in item" :key="subItem.id" :label="subItem.categoryMultiLang && subItem.categoryMultiLang.categoryName ? subItem.categoryMultiLang.categoryName : '暂无名称' + subItem.id" :value="subIndex">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
			</el-form>
			<el-row>
				<el-col :span="4">
					<el-select placeholder="是否包邮" v-model="option.isFreeShip" clearable filterable :default-first-option='true'>
						<el-option v-for="(item, index) in isPackage" :key="index" :value="index" :label="item"></el-option>
					</el-select>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="sitePakgeCancel">取消</el-button>
				<el-button type="primary" @click="sitePakgeClick" v-loading="packageLoading" :disabled="packageLoading">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="提示" :visible.sync="updateDialog">
			<p>
			商品价格更新已进入执行队列，相关详情，请查看
				<el-button type="text" @click="goList">价格变更日志列表</el-button>
			</p>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="updateDialog = false">确定</el-button>
			</div>
		</el-dialog>
		<!-- 0.82新增 -->
		<el-dialog title="更新价格" :visible.sync="updateHandleDialog" size="tiny">
			<el-form label-width="100px" :model="updateData" ref="updateForm">
				<el-form-item>
					请选择本次价格更新生效的渠道
				</el-form-item>
				<el-form-item label="生效渠道" prop="pipelineCode" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-select v-model="updateData.pipelineCode">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="updatePrice" v-loading="updateLoading" :disabled="updateLoading">确定</el-button>
				<el-button type="danger" @click="updateHandleDialog = false">取消</el-button>
			</div>
		</el-dialog>
		<!--  -->
        <!-- 0.95新增 -->
        <el-dialog title="编辑分类渠道" v-model="pipeDialog" size="tiny">
            <el-form label-width="100px" :model="pipeForm" ref="pipeForm">
                <el-form-item prop="type" label="操作类型">
                    <el-radio-group v-model="pipeForm.type">
                        <el-radio label="1">新增渠道</el-radio>
                        <el-radio label="2">删除渠道</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择渠道">
                    <el-select v-model="pipeForm.pipelineCodeList" multiple>
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                    <table class="table-custom el-sub-container">
                        <thead>
                            <tr>
                                <th>站点渠道</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in pipeForm.pipelineCategory" :key="index">
                                <td>{{pipeOpt[item.pipelineCode]}}</td>
                                <td>
                                    <el-checkbox disabled v-model="item.isShow" :true-label="1" :false-label="0">显示</el-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="self.showAction_('goods/category/category-pipeline-add') && self.showAction_('goods/category/category-pipeline-del')" type="primary" @click="postPipe" :disabled="pipeLoading" v-loading="pipeLoading">确定</el-button>
                <el-button type="danger" @click="pipeDialog = false">取消</el-button>
            </div>
        </el-dialog>
        <!--  -->
        <!-- 0.95新增 -->
        <el-dialog title="设置分类显示" v-model="pipeShowDialog" size="tiny">
            <el-form label-width="100px" :model="pipeShowForm" ref="pipeShowForm">
                <el-form-item label="选择渠道">
                    <el-select v-model="pipeShowForm.pipelineCodeList" multiple @change="changeShowPipe">
                        <el-option v-for="(item, index) in pipeShowForm.opt" :key="item.pipelineCode" :value="item.pipelineCode" :label="pipeOpt[item.pipelineCode]"></el-option>
                    </el-select>
                    <table class="table-custom el-sub-container">
                        <thead>
                            <tr>
                                <th>站点渠道</th>
                                <th>
                                	<el-checkbox v-model="selectFlag" @change="selectAllShow">显示</el-checkbox>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in pipeShowForm.list" :key="index">
                                <td>{{pipeOpt[item.pipelineCode]}}</td>
                                <td>
                                    <el-checkbox v-model="item.isShow" :true-label="1" :false-label="0" @change="selectShow">显示</el-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="self.showAction_('goods/category/edit-cat-pipeline-show')" type="primary" @click="postPipeShow" :disabled="pipeShowLoading" v-loading="pipeShowLoading">确定</el-button>
                <el-button type="danger" @click="pipeShowDialog = false">取消</el-button>
            </div>
        </el-dialog>
        <!--  -->

		<el-dialog title="编辑追加/利润率" :visible.sync="editProfitRateForm">
			<el-form inline ref="commonOption" :rules="rules_1" :model="commonOption">
				<el-form-item v-for="(item, index) in commonOption.gabalNara" :key="item.id" v-show="index === 0 || commonOption.gabalNara[index].length != 0" prop='proCate'>
					<template>
						<el-select v-model="commonOption.proCate[index]" :placeholder="(index * 1 + 1) + '级分类'" @change="changeDialogCat(index, $event)" clearable filterable :default-first-option='true' @clear="clearCat(index)">
							<el-option v-for="(subItem, subIndex) in item" :key="subItem.id" :label="subItem.categoryMultiLang && subItem.categoryMultiLang.categoryName ? subItem.categoryMultiLang.categoryName : '暂无名称' + subItem.id" :value="subIndex">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
			</el-form>
			<div class="el-sub-container" style="margin-top: 20px;"></div>
			<el-form :model="dataForm" ref="formSrc" :inline="true" class="list-form">
				<el-row class="text-center" :gutter="10">
					<el-col :span="7">计费价格区</el-col>
					<el-col :span="5">追加价(￥)</el-col>
					<el-col :span="5">利润率</el-col>
					<el-col :span="4">
						<el-button type="primary" size="small" @click="addItem"><i class="el-icon-plus"></i> 添加</el-button>
					</el-col>
				</el-row>
				<el-row class="line36" v-for="(item, index) in dataForm.shipRegionCompensateList" :key="index" :gutter="10">
					<el-col :span="3">
						<el-form-item :prop="'shipRegionCompensateList.' + index + '.shipRegion.begin'" :rules="[{validator: checkBegin(index)}]">
							<el-input v-model.string="item.shipRegion.begin" class="ipt" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="1">——</el-col>
					<el-col :span="3">
						<el-form-item :prop="'shipRegionCompensateList.' + index + '.shipRegion.end'" :rules="[{validator: checkEnd(index)}]">
							<el-input v-model.string="item.shipRegion.end" class="ipt" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item :prop="'shipRegionCompensateList.' + index + '.pricePlus'" :rules="rules.ruleNumber">
							<el-input v-model.string="item.pricePlus" class="ipt" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item :prop="'shipRegionCompensateList.' + index + '.profitRate'" :rules="rules.ruleNumber">
							<el-input v-model.string="item.profitRate" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4" class="text-center">
						<el-button type="danger" size="small" @click="shipRegionCompensateDel(index)"><i class="el-icon-close"></i> 删除</el-button>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editClickCancel">取消</el-button>
				<el-button v-if="self.showAction_('goods/category/batch-set-add-and-rate')" type="primary" @click="editClick('commonOption')" v-loading="rateLoading" :disabled="rateLoading">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			let self = this;
			let tempForm = null;
			let ruleNumber = [{
					required: true,
					message: '请输入数值'
				},
				{
					required: true,
					type: 'number',
					message: '请输入正确的数值'
				}
			];

			let checkRate = function(rule, value, callback) {
				let exp = /^\d+(\.\d+)?$/
				if(exp.test(value)) {
					callback();
				} else {
					callback(new Error('请输入纯数字'));
				}
			}

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
			};

            let searchRule = (rule, val, callback) => {
                if ((val && this.searchForm.searchType) || (!val && !this.searchForm.searchType)) {
                    callback();
                } else {
                    callback(new Error('请输入有效内容'));
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
			return {
				// loading
				deleteLoading: false,
				transLoading: false,
				packageLoading: false,
				updateLoading: false,
				rateLoading: false,
                // 0.95新增
                checkBegin: checkBegin,
                checkEnd: checkEnd,
                searchRule: searchRule,
                searchForm: {
                    searchContent: '',
                    searchType: '',
                },
                pipeDialog: false,
                pipeForm: {
                    pipelineCodeList: [],
                    categoryId: '',
                    type: '1',
                    pipelineCategory: [],
                },
                // 
                selectFlag: false,
                pipeShowLoading: false,
                pipeShowDialog: false,
                pipeShowForm: {
                	pipelineCodeList: [],
                	opt: [],
                	list: [],
                },
                pipeLoading: false,
				// 0.82新增
				updateHandleDialog: false,
				updateData: {
					pipelineCode: '',
					categoryId: '',
				},
				//
				updateDialog: false,
				self: this,
				dialogDeleteVisible: false,
				setPackageForm: false,
				editProfitRateForm: false,
				pageNo: 1,
				pageSize: 10,
				isPage: 1,
				total: 30,
				tableData: [],
                defaultData: [],
				delForm: {
					type: '0'
				},
				deletedId: 0,
				api: 'goods/category/list',
				transferCatId: 0,
				transferGoodId: 0,
				dialogTransferCatVisible: false,
				dialogTransferGoodVisible: false,
				option: {
					"isFreeShip": ''
				},
				isLeaveDeleted: 0,
				excludeIds: [],
				tableLoading: false,
				params: [],
				dataForm: {
					shipRegionCompensateList: [{
						shipRegion: {
							begin: '',
							end: '',
						},
						profitRate: '',
						pricePlus: ''
					}]
				},
				isPackage: {
					'0': '否',
					'1': '是',
				},
				commonOption: {
					gabalNara: {

					},
					proCate: [''],
					categoryId: ''
				},
				commonOption_1: {
					gabalNara: {

					},
					proCate: [''],
					categoryId: ''
				},
				rules_1: {
					proCate: [{
						required: true,
						message: '请选择分类',
						/*trigger: 'change'*/
					}]
				},
				rules: {
					ruleNumber: [{
						required: true,
						message: '请输入数值'
					}, {
						required: true,
						validator: checkRate
					}],
					ruleRange: [{
						validator: checkRange,
						trigger: 'blur'
					}]
				}
			}
		},

		created() {
			this.renderTable(2);
			// setTimeout(() => {
			// 	this.getBootCat()
			// }, 500)
		},
        computed: {
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            },
        },
		methods: {
			getParentList(row, type) {
				this.getArr([], row);
				if(type == 'add') {
					this.$router.push({
						name: 'goods_goodsClassifyAdd',
						query: {
							parentId: row.id,
							cat: JSON.stringify(this.params)
						},
					});
				} else {
					this.$router.push({
						name: 'goods_goodsClassifyEdit',
						query: {
							id: row.id,
							cat: JSON.stringify(this.params)
						},
					});
				}
			},
			getArr(tempArr, item) {
				if(item.parentId == 0) {
					tempArr.push(item.id);

					this.params = tempArr.reverse();
				} else {
					tempArr.push(item.id);
					let data = this.tableData;
					for(let i in data) {
						let row = data[i];
						if(row.id == item.parentId) {
							this.getArr(tempArr, row)
							break;
						}

					}

				}
			},
			async renderTable(isPage, option) {
                let flag = false;
				this.api = 'goods/category/list';
				var params = {
					isLeaves: false,
					parentId: 0,
				};

                if (option) {
                    this.$refs.searchForm.validate(valid => {
                        if (!valid) {
                            flag = true;
                        }
                    })
                    if (flag) {
                        return ;
                    }

                    if (option.searchType && option.searchContent) {
                        params.searchType = option.searchType;
                        params.searchContent = option.searchContent;
                    }
                }
				params.isPage = isPage ? isPage : 2;

				this.tableLoading = true;

                try {
                    let data = await this.httpGet_(this.api, {
                        params: params
                    });
                    var tmepList = [];
                    if(data.list.length > 0 && Object.keys(this.commonOption.gabalNara).length === 0) {
	                    this.$set(this.commonOption.gabalNara, '0', data.list);
	                    this.$set(this.commonOption_1.gabalNara, '0', data.list)
	                }
                    if(data.list != '') {
                        // this.tableData = data.list;
                        data.list.forEach(function(element) {
                            element.level = 0;

                            if(element.isLeaves == 0 && element.subCategoryList && element.subCategoryList.length > 0) {
                                element.toggle = false;
                            } else {
                                element.toggle = true;
                            }
                            tmepList.push(element);
                        });

                        this.tableData = tmepList;

                        this.defaultData = JSON.parse(JSON.stringify(tmepList));
                    } else {
                        this.tableData = []
                    }
                } finally {
                    this.tableLoading = false;
                }
			},

			async renderFootTable() {
				var params = {
					isLeaves: true,
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					isPage: 1
				};

				this.tableLoading = true;
                try {
                    let data = await this.httpGet_(this.api, {
                        params: params
                    });
                    var list = [];

                    data.list.forEach(function(element) {
                        element.level = 0;

                        if(element.isLeaves == 0 && element.subCategoryList && element.subCategoryList.length > 0) {
                            element.toggle = false;
                        } else {
                            element.toggle = true;
                        }

                        list.push(element);
                    });

                    this.tableData = list;
                    this.total = data.totalCount;
                } finally {
                    this.tableLoading = false;
                }
			},
			// 0.82新增渠道
			editPrcie(id) {
				this.updateData.categoryId = id;
				this.updateHandleDialog = true;
			},
 			updatePrice() {
 				this.$refs.updateForm.validate(async valid => {
 					if (valid) {
 						let updateid = {};
						updateid.categoryId = this.updateData.categoryId;
						updateid.pipelineCode = this.updateData.pipelineCode;
						updateid.changeUser = this.$store.getters.getUserName;

						this.updateLoading = true;
						try {
	                        const data = await this.httpPost_('goods/category/update-category-goods-shop-price', updateid);
	                        this.updateHandleDialog = false;
	                        this.updateDialog = true;
	                        this.$message.success(data.message);
	                        this.renderTable(2);
						} finally {
							this.updateLoading = false;
						}
 					}
 				})
			},
			// handleSizeChange(val) {
			// 	this.pageSize = val;

			// 	if(this.api == 'goods/category/list') {
			// 		this.renderTable(1);
			// 	} else {
			// 		this.renderFootTable();
			// 	}
			// },

			// handleCurrentChange(val) {
			// 	this.pageNo = val;

			// 	if(this.api == 'goods/category/list') {
			// 		this.renderTable(1);
			// 	} else {
			// 		this.renderFootTable();
			// 	}
			// },
            // toggle
            toggle (row, index) {
                if (!row.toggle) {
                    row.subCategoryList = row.subCategoryList || [];
                    row.subCategoryList.forEach(item => {
                        item.level = row.level + 1;
                    });
                    this.tableData = this.tableData.slice(0, index + 1).concat(row.subCategoryList).concat(this.tableData.slice(index + 1, this.tableData.length));
                    row.toggle = true;
                } else {
                    for (let i = index + 1; i < this.tableData.length; i++) {
                        if (this.tableData[i].level <= row.level) {
                            this.tableData.splice(index + 1, i - index -1);
                            break;
                        }

                        if (i == this.tableData.length - 1) {
                            this.tableData.splice(index + 1, i);
                        }
                    }
                    row.toggle = false;
                }

            },

			getChildrenCat(row, index) {
				row.iconClass = "el-icon-minus";
				var tempData = this.tableData;
				var childerList = [];
				for(var i = 0; i < tempData.length; i++) {
					if(row.id == tempData[i].id) {
						if(tempData[i].subCategoryList != '') {
							childerList = tempData[i].subCategoryList
						} else {
							row.iconClass = "el-icon-minus";
						}
					}
				}
				childerList.forEach(function(element) {
					element.level = row.level + 1;

					if(element.isLeaves == 0) {
						element.iconClass = 'el-icon-plus';
					} else {
						element.iconClass = 'el-icon-minus';
					}
					tempData.splice(index + 1, 0, element);
					index = index + 1;
				})
				this.tableData = tempData;
			},
			getParentsCat(row, index) {
				if (row.subCategoryList.length > 0) {
					row.iconClass = "el-icon-plus";
					let toggleIndex = '';
					let level = row.level;
					for (let i = index + 1; i < this.tableData.length; i++) {
						let item = this.tableData[i];
						if (item.level > level)  {
							toggleIndex = i;
						}
						else if (item.level == level || i == this.tableData.length - 1) {
							toggleIndex = i;
							break;
						}
					};
					this.tableData.splice(index + 1, toggleIndex - index - 1);
				} else {
					return false;
				}
			},

			// viewFootCat() {
			// 	this.pageNo = 1;
			// 	this.pageSize = 20;

			// 	this.api = 'goods/category/low';
			// 	this.renderFootTable();
			// },
			// addItem() {
	  //           this.editForm.rates.push('');
	  //           this.editForm.addPrice.push('');
	  //           this.editForm.shipRegion.push({
	  //               begin: '',
	  //               end: '',
	  //           });
	  //       },

			addItem() {
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

			// viewAllCat() {
			// 	this.pageNo = 1;
			// 	this.pageSize = 20;

			// 	this.renderTable(1);
			// },

			// async getBootCat() {
   //              const res = await this.httpGet_('goods/category/list', {
   //                  params: {
   //                      isLeaves: false,
   //                      parentId: 0,
   //                      isPage: 2
   //                  }
   //              });
   //              if(res.list.length > 0) {
   //                  let data = res.list;
   //                  this.$set(this.commonOption.gabalNara, '0', data);
   //                  this.$set(this.commonOption_1.gabalNara, '0', data)
   //              }
			// },

			setPackage() {
				this.option.isFreeShip = '';
				this.commonOption.proCate[0] = '';
				this.commonOption.categoryId = '';
				this.setPackageForm = true;
			},

			openTransferCatDialog() {
				this.commonOption.proCate[0] = '';
				this.commonOption_1.proCate[0] = '';
				this.commonOption.categoryId = '';
				this.commonOption_1.categoryId = '';
				this.dialogTransferCatVisible = true
			},

			async transferCat() {
				if(this.commonOption.categoryId && this.commonOption_1.categoryId) {
					if(this.commonOption.categoryId == this.commonOption_1.categoryId) {
						this.$message('原分类不可转移至自身及其下属所有分类');
						return
					};
					var params = {
						categoryId: this.commonOption.categoryId,
						migrateCategoryId: this.commonOption_1.categoryId
					};
					this.transLoading = true;
					try {
						const data = await this.httpPost_('goods/category/migrate-category', params);
	                    this.dialogTransferCatVisible = false;
	                    this.$message.success(data.message);
	                    this.renderTable(2);
					} finally {
						this.transLoading = false;
					}
                    
				} else {
					this.$message('站点分类不能为空');
				}
			},

			async sitePakgeClick() {
				if(this.commonOption.categoryId) {
					if(this.option.isFreeShip == '') {
						this.$message('请填写是否包邮');
						return
					};
					var reqList = {
						categoryId: this.commonOption.categoryId,
						isFreeShip: this.option.isFreeShip
					};
					this.packageLoading = true;
					try {
						const data = await this.httpPost_('goods/category/batch-set-is-free-ship', {
	                        reqList: [reqList]
	                    });
	                    this.$message.success(data.message);
	                    this.renderTable(2);
	                    this.setPackageForm = false;
					} finally {
						this.packageLoading = false;
					}
                    
				} else {
					this.$message('站点分类不能为空');
				}
			},

			editProfitRate() {
				this.commonOption.proCate[0] = '';
				this.commonOption.categoryId = '';
				this.editProfitRateForm = true
			},

			async editClick() {
				if(this.commonOption.categoryId) {
					let hasError = false;
					this.$refs['formSrc'].validate((valid) => {
						if(!valid) {
							hasError = true;
							return false;
						}
					});
					if(hasError) {
						return;
					};
					let hasIntersection = false;
					(() => {
						let arr1 = [];
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
						return;
					}
					var shipRegion = '';
					var addPrice = '';
					var rates = '';
					var categoryId = '';
					this.dataForm.shipRegionCompensateList.forEach((item) => {
						shipRegion += item.shipRegion.begin + '-' + item.shipRegion.end + '|';
						addPrice += item.pricePlus + '|';
						rates += item.profitRate + '|';
						categoryId = this.commonOption.categoryId
					});
					this.rateLoading = true;
                    try {
                        const data = await this.httpPost_('goods/category/batch-set-add-and-rate', {
                            reqList: [{
                                shipRegion: shipRegion.slice(0, shipRegion.length - 1),
                                addPrice: addPrice.slice(0, addPrice.length - 1),
                                rates: rates.slice(0, rates.length - 1),
                                categoryId: this.commonOption.categoryId
                            }]
                        });
                        this.$message(data.message)
                        this.renderTable(2);
                    } finally {
                    	this.rateLoading = false;
                        this.editProfitRateForm = false;
                    }
				} else {
					this.$message('请选择商品分类');
				}
			},

			editClickCancel() {
				this.editProfitRateForm = false;
			},

			openTransferGoodDialog(id) {
				this.commonOption.proCate[0] = '';
				this.commonOption.categoryId = '';
				this.dialogTransferGoodVisible = true;
				this.transferGoodId = id;
			},

			async transferGood() {
				if(this.commonOption.categoryId) {
					this.dialogTransferGoodVisible = false;

					var migrateCategoryId = '';

					var params = {
						categoryId: this.transferGoodId,
						migrateCategoryId: this.commonOption.categoryId
					};
					this.transLoading = true;
					try {
						const data = await this.httpPost_('goods/category/migrate-goods', params);
	                    this.$message.success(data.message);
	                    this.renderTable(2);
					} finally {
						this.transLoading = false;
					}
				} else {
					this.$message('请选择商品分类');
				}
			},

			openCatDelDialog(id, isLeave) {
				this.dialogDeleteVisible = true;
				this.deletedId = id;
				this.isLeaveDeleted = isLeave
			},

			async deleteCat() {
				this.dialogDeleteVisible = false;

				var params = {
					categoryId: this.deletedId,
					type: this.delForm.type
				};

				this.deleteLoading = true;
				try {
					const data = await this.httpPost_('goods/category/delete', params);
	                this.$message.success(data.message);
	                this.renderTable(2);
				} finally {
					this.deleteLoading = false;
				}
                
                // if(this.api == 'goods/category/list') {
                //     this.renderTable(2);
                // } else {
                //     this.renderFootTable();
                // }
			},

			sitePakgeCancel() {
				this.setPackageForm = false
			},

			createCat() {
				this.$router.push({
					name: 'goods_goodsClassifyAdd'
				});
			},

			changeDialogCat(params, val) {
				params = params * 1;
				if(this.commonOption.gabalNara[params].length > 0) {
					let item = this.commonOption.gabalNara[params][val];
					if(item && item.subCategoryList && item.subCategoryList.length > 0) {
						this.commonOption.proCate[params + 1] = '';
						this.commonOption.categoryId = '';
						this.$set(this.commonOption.gabalNara, params + 1, item.subCategoryList);
					} else {
						for(let i in this.commonOption.gabalNara) {
							i *= 1;
							if(i > params) {
								this.$set(this.commonOption.gabalNara, i, []);
							}
						}

						this.commonOption.proCate.splice(params + 1, this.commonOption.proCate.length - params - 1);
					}
					if(typeof item != 'undefined') {
						this.commonOption.categoryId = item.id;
					}
				}
				this.commonOption_1.proCate[0] = '';
			},

			clearCat(index) {
				if(index > 0) {
					this.commonOption.categoryId = this.commonOption.gabalNara[index * 1 - 1][this.commonOption.proCate[index * 1 - 1]].id;
				} else {
					this.commonOption.categoryId = '';
				}
			},

			changeDialogCat_1(params, val) {
				params = params * 1;
				if(this.commonOption_1.gabalNara[params].length > 0) {
					let item = this.commonOption_1.gabalNara[params][val];
					if(item && item.subCategoryList && item.subCategoryList.length > 0) {
						this.commonOption_1.proCate[params + 1] = '';
						this.commonOption_1.categoryId = '';
						this.$set(this.commonOption_1.gabalNara, params + 1, item.subCategoryList);
					} else {
						for(let i in this.commonOption_1.gabalNara) {
							i *= 1;
							if(i > params) {
								this.$set(this.commonOption_1.gabalNara, i, []);
							}
						}

						this.commonOption_1.proCate.splice(params + 1, this.commonOption_1.proCate.length - params - 1);
					}

					if(typeof item != 'undefined') {
						this.commonOption_1.categoryId = item.id;
					}
				}

				if (this.commonOption.categoryId === this.commonOption_1.categoryId) {
					this.commonOption_1.proCate[params] = '';
					this.$message.error('不能转移至当前分类及下属分类!')
				}
			},

			clearCat_1(index) {
				if(index > 0) {
					this.commonOption_1.categoryId = this.commonOption_1.gabalNara[index * 1 - 1][this.commonOption_1.proCate[index * 1 - 1]].id;
				} else {
					this.commonOption_1.categoryId = '';
				}
			},

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
			goList () {
				this.$router.push({
					name: 'goods_priceLog'
				})
			},
            editPipe (row) {
                this.pipeDialog = true;
                this.pipeForm.categoryId = row.id;
                this.pipeForm.pipelineCodeList = [];
                this.pipeForm.pipelineCategory = row.pipelineCategory;

                // let temp = [];
                // row.pipelineCategory.forEach(item => {
                //     temp.push(item.pipelineCode);
                // });
                // this.pipeForm.pipelineCodeList = temp;
            },
            async postPipe() {
                let src = 'goods/category/category-pipeline-add';
                if (this.pipeForm.type === '2') {
                    src = 'goods/category/category-pipeline-del';
                }

                let params = {
                    categoryId: this.pipeForm.categoryId,
                    pipelineCodeList: this.pipeForm.pipelineCodeList,
                };
                this.pipeLoading = true;
                try {
                    const data = await this.httpPost_(src, params);
                    this.pipeDialog = false;
                    this.$message.success(data.message);
                    this.renderTable(2);
                } finally {
                    this.pipeLoading = false;
                }
            },
            checkAll(val) {
                if (val.target.checked) {
                    this.pipeForm.pipelineCategory.forEach(item => {
                        item.isShow = 1;
                    });
                } else {
                    this.pipeForm.pipelineCategory.forEach(item => {
                        item.isShow = 0;
                    });
                }
            },
            // 设置分类显示
            editPipeShow(row) {
            	let list = row.pipelineCategory;
            	this.pipeShowForm = {
                	pipelineCodeList: [],
                	opt: JSON.parse(JSON.stringify(list)),
                	list: JSON.parse(JSON.stringify(list)),
                	categoryId: row.id,
                };
                this.selectFlag = !this.pipeShowForm.list.some(item => {return item.isShow == 0});
                this.pipeShowDialog = true;
            },
            changeShowPipe(val) {
            	if (val.length === 0) {
            		this.pipeShowForm.list = JSON.parse(JSON.stringify(this.pipeShowForm.opt));
            	} else {
            		let temp = [];
            		val.forEach(code => {
            			temp = temp.concat(this.pipeShowForm.opt.filter(item => item.pipelineCode === code));
            		});
            		this.pipeShowForm.list = temp;
            	}
            },
            selectAllShow(val) {
            	if (val.target.checked) {
            		this.pipeShowForm.list.forEach(item => {
	            		item.isShow = 1;
	            	});
            	} else {
            		this.pipeShowForm.list.forEach(item => {
	            		item.isShow = 0;
	            	});
            	}
            },
            async postPipeShow() {
            	let temp = [];
            	this.pipeShowForm.list.forEach(item => {
            		temp.push({
            			pipelineCode: item.pipelineCode,
            			isShow: item.isShow,
            		})
            	});
            	let params = {
            		categoryId: this.pipeShowForm.categoryId,
            		pipelineCategoryList: temp,
            	}
            	this.pipeShowLoading = true;
            	try {
					const data = await this.httpPost_('goods/category/edit-cat-pipeline-show', params);
					this.$message.success(data.message);
					this.renderTable(2);
					this.pipeShowDialog = false;
            	} finally {
            		this.pipeShowLoading = false;
            	}
            },
            selectShow(val) {
            	if (val.target.checked) {
            		this.selectFlag = !this.pipeShowForm.list.some(item => {return item.isShow == 0});
            	} else {
            		this.selectFlag = false;
            	}
            },
            // 
            resetTable () {
                this.tableData = JSON.parse(JSON.stringify(this.defaultData));
            },
            resetSearch() {
                this.searchForm.searchType = this.searchForm.searchContent = '';
            }

		}
	}
</script>

<style lang="less" scoped>
	.goods-classify {
		.line36 {
			line-height: 36px;
		}
	}

	.el-icon-plus {
		cursor: pointer;
	}

	h4 {
		margin-bottom: 5px;
	}

	a {
		cursor: pointer;
	}
</style>
