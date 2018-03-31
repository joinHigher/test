<!-- 商品资料变更日志 -->
<template>
	<div class="dataChangeLog">
		<div class="el-container">
			<el-form :inline="true" :model="params" ref="filter">
				<el-form-item label="SKU : " prop="goodSnList">
					<el-input placeholder="请输入SKU" v-model.trim="option.goodSnList">
					</el-input>
				</el-form-item>
				<el-form-item label="同步数据类型 : " prop="syncDataTypeList">
					<el-select v-model="option.syncDataTypeList" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in dataType" :key="index" :value="index" :label="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="同步状态 : " prop="syncStatus" placeholder="请选择">
					<el-select v-model="params.syncStatus" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in synchronousRegime" :key="index" :value="index" :label="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="同步时间 : " prop="date1">
					<el-date-picker v-model="params.date1" type="datetimerange" placeholder="选择开始时间" :editable="false"></el-date-picker>
				</el-form-item>
			</el-form>
			<el-row class="text-right">
                <el-button class="fl" :disabled="checkedRow.length === 0" type="primary" @click="copySKU">复制SKU</el-button>
				<el-button type="primary" icon="search" @click="filtrate">筛选</el-button>
				<el-button type="danger" icon="close" @click="resetFilter">重置</el-button>
			</el-row>
			<el-table ref="multipleTable" :data="logList" border tooltip-effect="dark" v-loading="tableLoading" @selection-change="changeCheck" @row-click="clickRow" fit>
                <el-table-column type="selection"></el-table-column>
				<el-table-column prop="goodSn" label="SKU">
				</el-table-column>
				<el-table-column label="同步数据类型">
					<template scope="scope">
						{{dataType[scope.row.syncDataType]}}
					</template>
				</el-table-column>
				<el-table-column label="同步状态">
					<template scope="scope">
						<i :class="{'el-icon-circle-check color-success': scope.row.syncStatus == 1, 'el-icon-circle-cross color-danger': scope.row.syncStatus == 2}"></i>
					</template>
				</el-table-column>
				<el-table-column prop="syncErrorMsg" label="备注">
				</el-table-column>
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
			return {
                copyTxt: '',
                checkedRow: [],
				self: this,
				total: 1,
				tableLoading: false,
				logList: [],
				params: {
					pageNo: 1,
					pageSize: 10,
					type: 1,
					goodSnList: '',
					syncStatus: '',
					syncDataTypeList: '',
					date1: []
				},
				option: {
					goodSnList: '',
					syncDataTypeList: ''
				},
				dataType: {
					'1': '产品资料变更',
					'2': '商品图册变更',
					'3': '商品多语言变更',
					'4': '商品重量价格变更'
				},
				synchronousRegime: {
					'1': '成功',
					'2': '失败'
				}
			};
		},
		created() {
			this.getBrandList()
		},
		methods: {
			async getBrandList() {

				var timeArr = this.timeZone_(this.params.date1, this.$store.getters.getTimeZone);
				if(Array.isArray(timeArr) && timeArr.length >= 2) {
					this.params.syncTimeBegin = timeArr[0];
					this.params.syncTimeEnd = timeArr[1];
				};
				this.tableLoading = true;

                try {
                    const data = await this.httpGet_('goods/log/query-sync-goods-log', {params: this.params});
                    this.logList = data.list;
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
				this.option.goodSnList = '';
				this.params.goodSnList = '';
				this.option.syncDataTypeList = '';
				this.params.syncDataTypeList = ''
			},

			filtrate() {
				if(this.option.goodSnList == '') {
					this.params.goodSnList = null
				} else {
					this.params.goodSnList = this.option.goodSnList.split(',');
				};

				if(this.option.syncDataTypeList == '') {
					this.params.syncDataTypeList = []
				} else {
					this.params.syncDataTypeList = this.option.syncDataTypeList.split(',');
				}
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
                        this.$message.success('复制成功')
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
	.dataChangeLog {
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
