<!-- 价格设置记录 -->
<template>
    <div>
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <el-form-item label="SKU" prop="goodSn">
                    <el-input v-model.trim="option.goodSn"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select clearable filterable v-model="option.status" placeholder="请选择">
                        <el-option value="1" label="成功"></el-option>
                        <el-option value="0" label="失败"></el-option>
                    </el-select>
                </el-form-item>
<!--                 <el-form-item label="利润率说明" prop="id">
                    <el-checkbox-group v-model="option.priceMarks">
                        <el-checkbox label="2">限价</el-checkbox>
                        <el-checkbox label="1">最低利润率</el-checkbox>
                    </el-checkbox-group>
                </el-form-item> -->
                <div class="text-right">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container">
                <el-button v-if="self.showAction_('promotion/price/delete')" type="danger" @click="remove" :disabled="checkedRow.length === 0">批量删除</el-button>
                <el-button type="primary" @click="copySku" :disabled="checkedRow.length === 0">复制SKU</el-button>
                <el-button type="primary" @click="tools" :disabled="checkedRow.length === 0">冲突项快捷处理工具</el-button>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading" ref="dataTable" @selection-change="changeRow" @row-click="clickRow">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="goodSn" label="SKU"></el-table-column>
                <el-table-column prop="goodName" label="商品标题"></el-table-column>
                <el-table-column label="渠道">
                    <template scope="scope">
                        {{pipeOpt[scope.row.pipelineCode]}}
                    </template>
                </el-table-column>
                <el-table-column label="仓库">
                    <template scope="scope">
                        {{wareObj[scope.row.warehouseCode]}}
                    </template>
                </el-table-column>
                <el-table-column label="目标价格/利润率">
                    <template scope="scope">
                        {{scope.row.price}}/{{scope.row.rates}}
                    </template>
                </el-table-column>
                <el-table-column label="生效时间" width="180">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}} -
                        {{self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="creatorName" label="操作人"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        {{opOpt[scope.row.opType]}}
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="操作结果">
                    <template scope="scope">
                        {{statusOpt[scope.row.status]}}
                    </template>
                </el-table-column>
                <el-table-column prop="resultDesc" label="结果说明"></el-table-column>
                <el-table-column label="冲突价格/利润率">
                    <template scope="scope">
                        {{scope.row.priceOld.price}}/ {{scope.row.priceOld.rates}}
                    </template>
                </el-table-column>
                <el-table-column prop="priceName" label="组名称"></el-table-column>
                <el-table-column label="冲突生效时间" width="180">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.priceOld.startTime, self.$store.getters.getTimeZone)}} -
                        {{self.timeZone_(scope.row.priceOld.endTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="冲突处理">
                    <template scope="scope">
                        暂无
                    </template>
                </el-table-column>
            </el-table>
            <input id="copyTxt" v-model="copyTxt" class="hidden-input">
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            option: {
                page: 1,
                page_size: 10,
                // priceMarks: [],
                status: '',
                goodSn: '',
                conditionId: this.$route.query.id
            },
            self: this,
            tableLoading: false,
            total: 10,
            tableData: [],
            checkedRow: [],
            wareObj: {},
            copyTxt: '',
            statusOpt: {
                '0': '失败',
                '1': '成功',
                '2': '删除'
            },
            opOpt: {
                '0': '手工创建',
                '1': '工具操作创建并删除',
                '2': '工具操作创建并覆盖',
                '3': '编辑',
                '4': '删除'
            }
        };
    },
    computed: {
        pipeOpt () {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getWare();
        this.getData();
    },
    methods: {
        getWare() {
            this.$http.get('promotion/index/public-virtual-wares').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = {};
                    data.forEach(item => {
                        temp[item.virWhCode] = item.virWhCnName;
                    });
                    this.wareObj = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            let params = {};
            for (let index in this.option) {
                let item = this.option[index];
                    if (item == '' || (item instanceof Array && item.length == 0)) {
                } else {
                    params[index] = item;
                }
            }
            this.tableLoading = true;
            this.$http.get('promotion/price/log-lists', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.total = res.body.data.totalCount;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            })
        },
        remove () {
            if (this.checkedRow && this.checkedRow.length > 0) {
                let params = {};
                let temp = [];
                this.checkedRow.forEach(item => {
                    temp.push({
                        goodSn: item.goodSn,
                        priceId: item.priceId,
                        pipelineCode: item.pipelineCode,
                    });
                });
                params.priceReqs = temp;

                this.$confirm('是否删除选择项?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('promotion/price/delete', params).then(res => {
                        if (res.body.code == 0) {
                            this.getData();
                            this.$message({
                                type: 'success',
                                message: res.body.message
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除!'
                    });
                });
            } else {
                this.$message.warning('至少选择一项');
            }
        },
        changeRow (val) {
            this.checkedRow = val;
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.page_size = val;
            this.getData();
        },
        copySku () {
            if (this.checkedRow.length > 0) {
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
            } else {
                this.$message.warning('至少选择一项');
            }
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
        },
        tools () {
            let temp = [];
            this.checkedRow.forEach(item => {
                temp.push(item.goodSn);
            });
            this.$router.push({
                name: 'marketing_price_errorTools',
                query: {
                    conditionId: this.option.conditionId,
                    goodSns: JSON.stringify(temp),
                }
            })
        },

    }
}
</script>

<style>

</style>
