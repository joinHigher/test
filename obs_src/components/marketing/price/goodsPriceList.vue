<!-- 商品价格列表 -->
<template>
    <div>
        <div class="el-container">
            <el-form label-width="100px" inline ref="searchForm" :model="option">
                <div>
                    <el-form-item label="快速搜索" prop="searchValue">
                        <el-input v-model.trim="option.searchValue" class="quick-search">
                            <el-select clearable filterable v-model="option.searchType" slot="prepend" placeholder="请选择">
                                <el-option v-for="(item, index) in quickOpt" :key="index" :value="index" :label="item"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="价格标签" prop="sysLabelId">
                        <el-select clearable filterable v-model="option.sysLabelId" placeholder="请选择价格标签">
                            <el-option v-for="(item, index) in sysData" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="仓库" prop="warehouseCode">
                    <el-select clearable filterable v-model="option.warehouseCode" placeholder="请选择">
                        <el-option v-for="item in wareOpt" :key="item.virWhCode" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格模板" prop="templateId">
                    <el-select clearable filterable v-model="option.templateId" placeholder="请选择价格模板">
                        <el-option v-for="item in tempOpt" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用渠道" prop="pipelineCode">
                    <el-select clearable filterable v-model="option.pipelineCode" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用店铺" prop="shopCode">
                    <el-select filterable clearable v-model="option.shopCode" placeholder="请选择">
                        <el-option v-for="(item, index) in storeOpt" :key="item.shopCode" :value="item.shopCode" :label="item.shopName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select clearable filterable v-model="option.status" placeholder="请选择">
                        <el-option v-for="(item, index) in statusOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="开始时间" prop="startDate">
                        <el-date-picker v-model="option.startDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.startDate)"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endDate">
                        <el-date-picker v-model="option.endDate" type="datetimerange" :editable="false" @change="checkDate_($event, option.endDate)"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="text-right">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-left">
                <el-button v-if="self.showAction_('promotion/price/delete')" :disabled="checkedRow.length === 0" type="danger" @click="remove(checkedRow)">批量删除</el-button>
                <el-button :disabled="checkedRow.length === 0" type="primary" @click="copySku">批量复制SKU</el-button>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading" @selection-change="changeRow" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="goodSn" label="SKU"></el-table-column>
                <el-table-column prop="goodName" label="商品标题" width="200px"></el-table-column>
                <el-table-column label="商品图片" width="135px">
                    <template scope="scope">
                        <img width="90" height="120" :src="domain + scope.row.goodThumbUrl">
                    </template>
                </el-table-column>
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
                <el-table-column prop="priceName" label="组名称"></el-table-column>
                <el-table-column prop="templateName" label="价格模板"></el-table-column>
                <el-table-column label="价格标签">
                    <template scope="scope">
                        {{sysData[scope.row.sysLabelId]}}
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="价格"></el-table-column>
                <el-table-column prop="usedCount" label="已售数量"></el-table-column>
                <el-table-column prop="rates" label="利润率"></el-table-column>
<!--                 <el-table-column label="利润率说明">
                    <template scope="scope">
                        <span v-if="scope.row.priceMark === 2">限价</span>
                        <span v-if="scope.row.priceMark === 1">最低利润率</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="forceType" label="利润率说明"></el-table-column>
                <el-table-column label="开始时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.startTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.endTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="creatorName" label="操作人"></el-table-column>
                <el-table-column label="创建主体">
                    <template scope="scope">
                        <span v-if="scope.row.sponsor == '0'">平台</span>
                        <span v-else>{{scope.row.sponsor}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="生效状态">
                    <template scope="scope">
                        {{tableStatusOpt[scope.row.status]}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" column-key="handle" fixed="right" width="100px">
                    <template scope="scope">
                        <router-link v-if="self.showAction_('promotion/price/edit-info')" class="el-button el-button--primary el-button--small" :to="{name: 'marketing_price_skuPriceEdit', query: {priceId: scope.row.priceId, pipelineCode: scope.row.pipelineCode, goodSn: scope.row.goodSn}}">
                            编辑
                        </router-link>
                        <el-button v-if="self.showAction_('promotion/price/delete')" type="danger" size="small" @click="remove([scope.row])">删除</el-button>
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
        let time = new Date().getTime();
        return {
            test: [new Date(), new Date],
            option: {
                sysLabelId: '',
                shopCode: '',
                page: 1,
                page_size: 10,
                searchValue: '',
                searchType: '',
                warehouseCode: '',
                templateId: '',
                startDate: [new Date(time - 30 * 24 * 360000000), new Date(time + 30 * 24 * 360000000)],
                endDate: [new Date(time - 30 * 24 * 360000000), new Date(time + 30 * 24 * 360000000)],
                startTime: '',
                startTime2: '',
                endTime: '',
                endTime2: '',
                pipelineCode: '',
                status: '',
            },
            self: this,
            tableLoading: false,
            total: 10,
            tableData: [],
            checkedRow: [],
            wareOpt: [],
            wareObj: {},
            tempOpt: [],
            sysData: [],
            quickOpt: {
                '1': 'SKU',
                '2': '商品标题',
                '3': '组名称',
                '4': '外部商品编码'
            },
            copyTxt: '',

            statusOpt: {
                '-1':  '未开始',
                '0': '进行中',
                '1': '已结束'
            },
            tableStatusOpt: {
                '0':  '不可用',
                '1': '可用',
                '2': '删除'
            },
            init: true,
        };
    },
    created () {
        this.getLabel();
        this.getOpt();
        this.getData();
    },
    computed: {
        domain () {
            return this.$store.getters.getDomain + '/';
        },
        pipeOpt () {
            return this.$store.getters.getPipe.obj;
        },
        storeOpt () {
            // let temp = this.$store.getters.getStore.list;
            // if (this.init && temp && temp.length > 0) {
            //     this.init = false;
            //     this.option.shopCode = temp[0].shopCode;
            //     this.getData();
            // }
            return this.$store.getters.getStore.list;
        }
    },
    methods: {
        getLabel () {
            this.$http.get('promotion/price/label-lists').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.labelSites;
                    let sysTemp = {};

                    data.forEach(item => {
                        if (item.type === 0) {
                            sysTemp[item.id] = item.name;
                        }
                    });
                    this.sysData = sysTemp;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        getOpt () {
            this.$http.get('promotion/index/public-virtual-wares').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.wareOpt = data;

                    let temp = {};
                    data.forEach(item => {
                        temp[item.virWhCode] = item.virWhCnName;
                    });
                    this.wareObj = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });

            this.$http.get('promotion/template/public-template-lists', {params: {type: 0}}).then(res => {
                if (res.body.code === 0) {
                    this.tempOpt = res.body.data.templateDtos;
                } else {
                    this.$message.error(res.body.message);
                }
            });

        },
        getData () {
            let self = this;
            if ((this.option.searchValue && !this.option.searchType) || (!this.option.searchValue && this.option.searchType)) {
                this.$message.warning('关键字必须匹配搜索类型');
                return ;
            }
            let timeArr1 = this.timeZone_(this.option.startDate, this.$store.getters.getTimeZone);
            this.option.startTime = timeArr1[0];
            this.option.startTime2 = timeArr1[1];

            let timeArr2 = this.timeZone_(this.option.endDate, this.$store.getters.getTimeZone);
            this.option.endTime = timeArr2[0];
            this.option.endTime2 = timeArr2[1];

            let params = {};
            for (let i in this.option) {
                if (i !== 'startDate' && i !== 'endDate') {
                    params[i] = this.option[i];
                }
            }
            this.tableLoading = true;

            for (let i in params) {
                if (!params[i]) {
                    delete params[i];
                }
            }
            this.$http.get('promotion/price/lists',{params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    // 获取本地时间转换成服务器时区时间
                    let time = self.timeZone_(new Date, self.$store.getters.getTimeZone);
                    data.list.forEach(item => {
                        if (item.status == 1) {
                            if (time >= item.endTime || time <= item.startTime) {
                                item.status = 0;
                            }
                        }
                    });
                    this.tableData = data.list;
                    this.total = data.totalCount;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            })
        },
        changeRow (val) {
            this.checkedRow = val;
        },
        batchSet () {
            let flag = true;
            let temp = [];
            this.checkedRow.forEach(item => {
                if (item.templateId !== this.checkedRow[0].templateId) {
                    flag = false;
                    return ;
                } else {
                    temp.push(item.id);
                }
            });

            if (!flag) {
                this.$message.warning('批量设置模板ID必须一致');
            } else {
                this.$router.push({
                    name: 'marketing_price_batchEdit',
                    query: {
                        ids: temp.join(','),
                        templateId: this.checkedRow[0].templateId,
                        conditionId: this.checkedRow[0].conditionId,
                        warehouseCode: this.checkedRow[0].warehouseCode
                    }
                })
            }
        },
        // batchRemove () {
        //     let params = [];
        //     this.checkedRow.forEach(item => {
        //         params.push(item.id);
        //     });

        //     this.$confirm('删除商品价格影响较大，请谨慎操作，是否确认删除?', '价格删除', {
        //         type: 'warning'
        //     }).then(() => {
        //         this.$http.post('promotion/price/delete', {ids: params.join(',')}).then(res => {
        //             if (res.body.code == 0) {
        //                 this.getData();
        //                 this.$message({
        //                     type: 'success',
        //                     message: res.body.message
        //                 });
        //             } else {
        //                 this.$message.error(res.body.message);
        //             }
        //         });
        //     }).catch(() => {
        //         this.$message({
        //             type: 'info',
        //             message: '已取消删除!'
        //         });
        //     });
        // },
        remove (row) {
            let params = {},
                temp = [];
            row.forEach(item => {
                temp.push({
                    goodSn: item.goodSn,
                    priceId: item.priceId,
                    pipelineCode: item.pipelineCode,
                });
            });
            params.priceReqs = temp;

            this.$confirm('删除商品价格影响较大，请谨慎操作，是否确认删除?', '价格删除', {
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
        resetForm () {
            this.$refs.searchForm.resetFields();
            this.option.forceShipping = '';
            this.option.priceEnd = '';
            this.option.searchType = '';
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
    }
}
</script>

<style>

</style>
