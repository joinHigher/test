<!-- 商品价格变更日志 -->
<template>
	<div class="priceLog">
		<div class="el-container">
			<el-form :inline="true" :model="params" ref="filter">
				<el-form-item label="SKU : " prop="goodSnList">
					<el-input placeholder="请输入SKU" v-model.trim="option.goodSnList">
					</el-input>
				</el-form-item>
				<el-form-item label="生效渠道" prop="pipelineCode">
                    <el-select filterable v-model="params.pipelineCode">
                        <el-option v-for="item in pipeOpt" :key="item.pipeline_code" :value="item.pipeline_code" :label="item.pipeline_name"></el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="销售仓 : " prop="virWhCode">
					<el-select v-model="params.virWhCode" filterable clearable :default-first-option='true'>
						<el-option v-for="item in warehouseData" :key="item.virWhCode" :label="item.virWhCnName" :value="item.virWhCode">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="变更状态 : " prop="changeStatus">
					<el-select v-model="params.changeStatus" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in synchronousRegime" :key="index" :value="index" :label="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="变更来源: " prop="changeSource">
					<el-select v-model="params.changeSource" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in dataType" :key="index" :value="index" :label="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="异常原因 : " prop="errorReason">
					<el-select v-model="params.errorReason" filterable clearable :default-first-option='true'>
						<el-option v-for="(item, index) in anomalousCause" :key="index" :value="index" :label="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="变更时间 : " prop="date1" :rules="[{validator: checkDate}]">
					<el-date-picker v-model="params.date1" type="datetimerange" placeholder="选择开始时间" :editable="false"></el-date-picker>
				</el-form-item>
			</el-form>
			<el-row class="text-right">
                <el-button class="fl" :disabled="checkedRow.length === 0" type="primary" @click="copySKU">复制SKU</el-button>
				<el-button type="primary" icon="search" @click="filtrate">筛选</el-button>
				<el-button type="danger" icon="close" @click="resetFilter">重置</el-button>
			</el-row>
			<el-table ref="multipleTable" :data="priceLogList" border tooltip-effect="dark" v-loading="tableLoading" @selection-change="changeCheck" fit @row-click="clickRow">
                <el-table-column type="selection"></el-table-column>
				<el-table-column prop="goodSn" label="SKU">
				</el-table-column>
				<el-table-column label="销售仓">
					<template scope="scope">
						<span v-if="warehouseData[scope.row.virCode]">
							{{warehouseData[scope.row.virCode].virWhCnName}}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="价格类型">
					<template scope="scope">
						{{priceType[scope.row.priceType]}}
					</template>
				</el-table-column>
				<el-table-column label="变更前价格">
					<template scope="scope">
						<span v-if="scope.row.changeContentMap">{{scope.row.changeContentMap.prePrice}}</span>
					</template>
				</el-table-column>
				<el-table-column label="变更后价格">
					<template scope="scope">
						<span v-if="scope.row.changeContentMap">{{scope.row.changeContentMap.calculatePrice}}</span>
					</template>
				</el-table-column>
				<el-table-column label="变更来源">
					<template scope="scope">
						{{dataType[scope.row.changeSource]}}
					</template>
				</el-table-column>
				<el-table-column label="变更状态">
					<template scope="scope">
						<i :class="{'el-icon-circle-check color-success': scope.row.changeStatus == 1, 'el-icon-circle-cross color-danger': scope.row.changeStatus == 2}"></i>
					</template>
				</el-table-column>
				<el-table-column label="异常原因">
					<template scope="scope">
						{{anomalousCause[scope.row.errorReason]}}
					</template>
				</el-table-column>
				<el-table-column prop="changeUser" label="操作人">
				</el-table-column>
				<el-table-column label="变更时间">
					<template scope="scope">
						{{self.timeZone_(scope.row.changeTime, self.$store.getters.getTimeZone)}}
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50,100,200,400]" :page-size="params.pageSize" :current-page="params.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
        <input id="copyTxt" v-model="copyTxt" class="hidden-input">
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
                checkedRow: [],
                copyTxt: '',

				self: this,
				total: 1,
				tableLoading: false,
				priceLogList: [],
				warehouseData: {},
				params: {
					pageNo: 1,
					pageSize: 10,
					goodSnList: '',
					date1: [new Date(year, month, day, 0, 0, 0), new Date(year, month, day, 23, 59, 59)],
					changeStatus: '',
					changeSource: '',
					virWhCode: '',
					pipelineCode: '',
					errorReason: ''
				},
				option: {
					goodSnList: ''
				},
				dataType: {
					'1': '商品初始化价格',
					'2': '商品基础资料变更',
					'3': '商品价格手动更新',
					'4': '营销计算价格',
					'5': '商品价格批量更新',
				},
				priceType: {
					'1': '本店售价',
					'2': '市场价',
					'3': '清仓价',
                    '4': '营销价',
				},
				synchronousRegime: {
					'1': '成功',
					'2': '失败'
				},
				anomalousCause: {
					'1': '商品无法获取默认分类',
					'2': '商品无法获取商品分类利润率',
					'3': '商品无法获取销售仓',
					'4': '商品无法获取销售仓利润率',
					'5': '计费价格为0',
					'6': '计费利润率为0',
					'7': '计费重量为0',
					'8': '邮运费计算失败',
					'9': '汇率为空',
					'10': '不能获取包邮分区',
					'11': '商品价格计算为0',
					'12': '商品不存在',
					'0': '系统异常'
				}
			};
		},

		created() {
			this.warehouseList();
		},
        computed: {
            pipeOpt () {
                let list = this.$store.getters.getPipe.list;
                if (list && list.length > 0) {
                    this.params.pipelineCode = list[0].pipeline_code;
                }
                return list;
            }
        },
		methods: {
			async getBrandList() {
                this.$refs.filter.validate(async valid => {
                    if (valid) {
                        var timeArr = this.timeZone_(this.params.date1, this.$store.getters.getTimeZone);
                        if(Array.isArray(timeArr) && timeArr.length >= 2) {
                            this.params.changeTimeBegin = timeArr[0];
                            this.params.changeTimeEnd = timeArr[1];
                        };
                        this.tableLoading = true;

                        try {
                            const data = await this.httpGet_('goods/log/query-price-change-log', {
                                params: this.params
                            });
                            this.priceLogList = data.list;
                            this.total = data.totalCount;

                            // for(var i = 0; i < this.priceLogList.length; i++) {
                            //     for(var j = 0; j < this.warehouseData.length; j++) {
                            //         if(this.priceLogList[i].virCode == this.warehouseData[j].virWhCode) {
                            //             this.priceLogList[i].name = this.warehouseData[j].virWhCnName
                            //         }
                            //     }
                            // }
                        } finally {
                            this.tableLoading = false;
                        }
                    }
                });

			},

			async warehouseList() {
                const data = await this.httpGet_('stock/warehouse/vir-wh-drop-down');
                let temp = {};
                data.list.forEach(item => {
                	temp[item.virWhCode] = item;
                });
                this.warehouseData = temp;
                this.getBrandList();
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
				this.$refs['filter'].resetFields();
				this.option.goodSnList = '';
				this.params.goodSnList = ''
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
	.priceLog {
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
