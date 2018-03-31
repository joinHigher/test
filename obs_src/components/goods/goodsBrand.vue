<!-- 商品品牌 -->
<template>
	<div class="goods-brand">
		<div class="el-container">
			<el-row :gutter="20">
				<el-form :inline="true" :model="params" ref="filter">
					<el-form-item label="快捷搜索">
						<el-input v-model.trim="searchCode" class="quick-search" placeholder="品牌标题/品牌代码">
							<el-select filterable clearable :default-first-option='true' v-model="quickTypeVal" slot="prepend" placeholder="请选择">
								<el-option v-for="(value, key, index) in quickSearchType" :key="index" :label="value" :value="key">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
					<el-form-item label="启用状态:" prop="isUse">
						<el-select v-model="params.isUse" placeholder="请选择" filterable clearable :default-first-option='true'>
							<el-option v-for="(value, key, index) in initiateMode" :key="index" :label="value" :value="key">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-row>

			<el-row type="flex" justify="end">
				<el-button type="primary" icon="search" @click="filtrate">筛选</el-button>
				<el-button type="danger" icon="close" @click="resetFilter">重置</el-button>
			</el-row>
			<el-table ref="multipleTable" :data="brandList" border tooltip-effect="dark" style="width: 100%" fit v-loading="tableLoading">
				<el-table-column prop="id" label="序号">
				</el-table-column>
				<el-table-column prop="brandTitle" label="品牌标题">
				</el-table-column>
				<el-table-column prop="brandLogo" label="品牌logo">
					<template scope="scope">
						<img class="table-img" :src="scope.row.brandLogo" width="90" height="120">
					</template>
				</el-table-column>
				<el-table-column prop="brandBrief" label="品牌简介">
				</el-table-column>
				<el-table-column prop="brandCode" label="品牌代码">
				</el-table-column>
				<el-table-column prop="sort" label="排序">
				</el-table-column>
				<el-table-column prop="status" label="启用状态">
					<template scope="scope">
						<i :class="{'el-icon-circle-check color-success': scope.row.isUse == 1, 'el-icon-circle-cross color-danger': scope.row.isUse == 2}"></i>
					</template>
				</el-table-column>
				<el-table-column label="添加时间">
					<template scope="scope">
						{{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
						<router-link :to="{path:'/goods/brand/updateBrand',query:{brandCode:scope.row.brandCode}}">
							<el-button type="primary" icon="edit" size="small" class="width-plus">编辑</el-button>
						</router-link>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50,100,200,400]" :page-size="params.pageSize" :current-page="params.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 弹窗S -->
		<!-- 弹窗E -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				self: this,
				total: 1,
				brandList: [],
				searchCode: '',
				quickTypeVal: '',
				tableLoading: false,
				params: {
					pageNo: 1,
					pageSize: 10,
					isUse: '',
                    brandCode: '',
                    brandTitle: '',
				},
				initiateMode: {
					'1': '是',
					'2': '否',
				},
				quickSearchType: {
					'1': '品牌标题',
					'2': '品牌代码'
				},
			};
		},

		created() {
			this.getBrandList()
		},

		methods: {
			async getBrandList() {
				this.tableLoading = true;
				if(this.quickTypeVal.toString() == 1) {
					this.params.brandTitle = this.searchCode;
                    this.params.brandCode = '';
				} else if(this.quickTypeVal.toString() == 2) {
					this.params.brandCode = this.searchCode;
                    this.params.brandTitle = '';
				} else {
                    this.params.brandTitle = '';
                    this.params.brandCode = '';
                }
                try {
                    const data = await this.httpGet_('goods/brand/list', {params: this.params});
                    this.brandList = data.list;
                    this.total = data.totalCount;
                } finally {
                    this.tableLoading = false;
                }
			},

			ChangePage(val) {
				this.params.pageNo = val;
				this.getBrandList()
			},

			ChangePageSize(val) {
				this.params.pageSize = val;
				this.getBrandList()
			},

			resetFilter() {
				this.$refs.filter.resetFields();
				this.quickTypeVal = '';
				this.searchCode = ''
			},

			filtrate() {
				if(this.quickTypeVal > 0 && (!this.searchCode || this.searchCode.toString().trim() == '')) {
					this.$message('请输入品牌代码/品牌标题');
					return;
				} else if(this.quickTypeVal <= 0 && (this.searchCode || !this.searchCode.toString().trim() == '')) {
					this.$message('请选择快捷筛选类型');
					return;
				} else {
					this.getBrandList()
				}
			}
		}
	}
</script>

<style lang="less">
	.goods-brand {
		.el-table {
			margin-top: 10px;
		}
		.el-table th,
		.el-table td {
			text-align: center;
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
