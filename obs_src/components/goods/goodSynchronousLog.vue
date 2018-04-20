<!-- 商品同步日志 -->
<template>
	<div class="goodSynchronousLog">
		<div class="el-container">
			<el-form :inline="true" :model="params" ref="filter">
				<el-form-item label="SKU : " prop="goodSnList">
					<el-input placeholder="请输入SKU" v-model.trim="option.goodSnList">
					</el-input>
				</el-form-item>
				<el-form-item label="同步状态 : " prop="syncStatus">
					<el-select v-model="params.syncStatus"  filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in synchronousRegime" :key="index" :value="index" :label="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="异常原因 : " prop="syncErrorReason">
					<el-select v-model="params.syncErrorReason"  filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in dataType" :key="index" :value="index" :label="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="同步时间 :" prop="date1" :rules="[{validator: checkDate}]">
					<el-date-picker v-model="params.date1" type="datetimerange" placeholder="选择开始时间" :editable="false"></el-date-picker>
				</el-form-item>
			</el-form>
			<div class="text-right">
                <el-button class="fl" :disabled="checkedRow.length === 0" type="primary" @click="copySKU">复制SKU</el-button>
				<el-button type="primary" icon="search" @click="filtrate">筛选</el-button>
				<el-button type="danger" icon="close" @click="resetFilter">重置</el-button>
			</div>
			<el-table ref="multipleTable" :data="SynchronousLogList" border tooltip-effect="dark" v-loading="tableLoading" @selection-change="changeCheck" @row-click="clickRow">
                <el-table-column type="selection"></el-table-column>
				<el-table-column prop="goodSn" label="SKU">
				</el-table-column>
				<el-table-column prop="categoryPath" label="同步网站分类">
				</el-table-column>
				<el-table-column label="同步状态">
					<template scope="scope">
						<i :class="{'el-icon-circle-check color-success': scope.row.syncStatus == 1, 'el-icon-circle-cross color-danger': scope.row.syncStatus == 2}"></i>
					</template>
				</el-table-column>
				<el-table-column label="异常原因">
					<template scope="scope">
						{{dataType[scope.row.syncErrorReason]}}
					</template>
				</el-table-column>
				<el-table-column prop="syncErrorMsg" label="原因备注"></el-table-column>
				<el-table-column label="同步时间">
					<template scope="scope">
						{{self.timeZone_(scope.row.syncTime, self.$store.getters.getTimeZone)}}
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50,100,200,400]" :page-size="params.pageSize" :current-page="params.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
            <input id="copyTxt" v-model="copyTxt" class="hidden-input">
		</div>
		<!-- 弹窗S -->
		<!-- 弹窗E -->
	</div>
</template>

<script>
	export default {
		data() {
            let checkDate = (rule, val, callback) => {
                if (val instanceof Array && val[1]) {
                    callback();
                } else {
                    callback(new Error('该项不能为空'));
                }
            };

            let time = new Date(),
                year = time.getFullYear(),
                month = time.getMonth(),
                day = time.getDate();

			return {
                checkDate: checkDate,
                copyTxt: '',
                checkedRow: [],
				self: this,
				total: 1,
				tableLoading: false,
				SynchronousLogList: [],
				params: {
					pageNo: 1,
					pageSize: 10,
					type: 2,
					goodSnList: '',
					date1: [new Date(year, month, day, 0, 0, 0), new Date(year, month, day, 23, 59, 59)],
					syncStatus: '',
					syncErrorReason: ''
				},
				option: {
					goodSnList: ''
				},
				dataType: {
					'1': '商品基础资料缺失',
					'2': '商品分类已被删除',
					'3': '商品分类为非最底层分类',
					'4': '商品分类页面类型为运营页面',
					'5': '商品不符合网站售卖仓库',
					// '6': '资料变更处理异常',
					'6': '商品无法匹配店铺',
				},
				synchronousRegime: {
					'1': '同步成功',
					'2': '同步失败'
				},
			};
		},
		mounted() {
			this.getBrandList()
		},
		methods: {
			getBrandList() {
                this.$refs.filter.validate(async valid => {
                    if (valid) {
                        let timeArr = this.timeZone_(this.params.date1, this.$store.getters.getTimeZone);
                        if(Array.isArray(timeArr) && timeArr.length >= 2) {
                            this.params.syncTimeBegin = timeArr[0];
                            this.params.syncTimeEnd = timeArr[1];
                        };
                        this.tableLoading = true;
                        try {
                            const data = await this.httpGet_('goods/log/query-new-sync-goods-log', {
                                params: this.params
                            });
                            this.SynchronousLogList = data.list;
                            this.total = data.totalCount;
                        } finally {
                            this.tableLoading = false;
                        }
                    }
                })
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
				this.option.goodSnList = '';
				this.params.goodSnList = '';
				this.getBrandList()
			},

			filtrate() {
				if(this.option.goodSnList == '') {
					this.params.goodSnList = null
				} else {
					this.params.goodSnList = this.option.goodSnList.split(',');
				};
				this.getBrandList()
			},
            changeCheck(val) {
                this.checkedRow = val;
            },
            clickRow (row, event, col) {
                if (col.columnKey != 'handle') {
                    this.$refs.multipleTable.toggleRowSelection(row);
                }
            },
            copySKU () {
                let temp = [];
                this.checkedRow.map(item => {
                    temp.push(item.goodSn);
                });

                this.copyTxt = temp.join(',');
                var cpt = document.getElementById('copyTxt');
                cpt.value = this.copyTxt;
                cpt.select();
                try{
                    if(document.execCommand('copy', false, null)){
                        this.$message.success('复制成功');
                    } else{
                        this.$message({
                            type: 'warning',
                            message: '浏览器不可用复制'
                        });
                    }
                } catch(err){
                    this.$message.error(err);
                }
            },
		}
	}
</script>

<style lang="less">
	.goodSynchronousLog {
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
