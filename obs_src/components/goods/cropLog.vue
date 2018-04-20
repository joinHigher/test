<!-- 商品图片切图失败日志 -->
<template>
    <div class="dataChangeLog">
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm" label-width="100px">
                <el-form-item label="SKU" prop="goodSnList">
                    <el-input placeholder="请输入SKU" v-model.trim="option.goodSnList"></el-input>
                </el-form-item>
                <el-form-item label="失败时间" prop="date">
                    <el-date-picker v-model="option.date" type="datetimerange" :editable="false"></el-date-picker>
                </el-form-item>
            </el-form>
            <div class="el-sub-container">
                <div class="text-right el-sub-container">
                    <el-button type="primary" class="fl" :disabled="checkedRow.length === 0" @click="copySKU">复制SKU</el-button>
                    <el-button type="primary" @click="getData">查询</el-button>
                    <el-button type="danger" @click="reset">重置</el-button>
                </div>
                <el-table :data="tableData" border v-loading="tableLoading" @selection-change="changeCheck" @row-click="clickRow" ref="dataTable">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="goodSn" label="SKU"></el-table-column>
                    <el-table-column label="图册类型">
                        <template scope="scope">
                            {{picOpt[scope.row.type]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="version" label="切图版本号"></el-table-column>
                    <el-table-column label="失败时间">
                        <template scope="scope">
                            {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" column-key="handle">
                        <template scope="scope">
                            <el-button v-if="self.showAction_('goods/goods/recut-picture')" type="primary" size="small" @click="post(scope.row)">重新切图</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="el-container last text-right">
                    <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </div>
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
                self: this,
                checkedRow: [],
                copyTxt: '',
                total: 1,
                option: {
                    goodSnList: '',
                    failBeginTime: '',
                    failEndTime: '',
                    date: [],
                    pageNo: 1,
                    pageSize: 20,
                },
                tableData: [],
                tableLoading: false,
                picOpt: {
                    '1': '网络图',
                    '2': '自拍图',
                    '3': '分销图',
                },
            };
        },
        created() {
            this.getData();
        },
        methods: {
            async getData() {
                let params = {};
                let timeArr = this.timeZone_(this.option.date, this.$store.getters.getTimeZone);
                this.option.failBeginTime = timeArr[0];
                this.option.failEndTime = timeArr[1];

                for (let i in this.option) {
                    let item = this.option[i];
                    if (i != 'date' && item) {
                        params[i] = item;
                    }
                }

                if (params.goodSnList) {
                    params.goodSnList = params.goodSnList.split(',');
                }
                this.tableLoading = true;
                try {
                    const data = await this.httpGet_('goods/goods/cut-picture-fail-list', {params: params});
                    this.tableData = data.list;
                    this.total = data.totalCount;
                } finally {
                    this.tableLoading = false;
                }

            },
            ChangePage(val) {
                this.option.pageNo = val;
                this.getData();
            },
            ChangePageSize(val) {
                this.option.pageSize = val;
                this.getData();
            },
            reset() {
                this.$refs.searchForm.resetFields();
            },
            changeCheck(val) {
                this.checkedRow = val;
            },
            clickRow (row, event, col) {
                if (col.columnKey != 'handle') {
                    this.$refs.dataTable.toggleRowSelection(row);
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
            async post(row) {
                let params = {
                    reqList: [{
                        goodSn: row.goodSn,
                        type: row.type
                    }]
                };
                const data = await this.httpPost_('goods/goods/recut-picture', params);
                this.$message.success(data.message);
                this.getData();
            }
        }
    }
</script>

<style lang="less">

</style>
