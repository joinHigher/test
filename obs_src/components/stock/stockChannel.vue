<!-- 渠道个性化仓设置 -->
<template>

    <div>
        <div class="el-container" id="stock-channel-container">
            <el-form inline :model="filter" ref="searchForm">
                <el-form-item label="生效渠道：" prop="pipelineCode">
                    <el-select v-model="filter.pipelineCode" clearable placeholder="请选择渠道">
                        <el-option v-for="val in channels" :label="val.pipeline_name" :value="val.pipeline_code" :key="val.pipeline_code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售仓：" prop="virWhCnName">
                    <span class="ac-sale-list-wrap">
                        <el-autocomplete v-model="filter.name" :fetch-suggestions="querySearch" placeholder="销售仓名称/英文名称/仓编码" icon="circle-close" :on-icon-click="handleSaleListDelIconClick"></el-autocomplete>
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
                <el-form-item class="fr">
                    <el-button type="primary" @click="handleAdd()">+新增渠道配置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" v-loading="isDataLoading" border>
                <el-table-column prop="virWhCnName" label="销售仓"></el-table-column>
                <el-table-column label="生效渠道">
                    <template scope="scope">
                        {{channelsText[scope.row.pipelineCode]}}
                    </template>  
                </el-table-column>
                <el-table-column label="计费价格区间">
                    <template scope="scope">
                        <div v-for="item in scope.row.whCompensationShipRegion" :key="item">{{item}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="计费重量区间">
                    <template scope="scope">
                        <div v-for="item in scope.row.weightZone" :key="item">{{item}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="包邮物流分区ID">
                    <template scope="scope">
                        <div v-for="item in scope.row.weightFreeDivision" :key="item">{{item}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                        <el-popover ref="logistics" placement="right" width="250" trigger="click" class="logistics-pop">
                            <el-input placeholder="输入关键字进行过滤" v-model="filterlogisticsGroupText"></el-input>
                            <div class="tree-wrap">
                                <el-tree class="filter-tree" :data="logisticsGroupRespList" v-loading="isLoadingPartitionIds" :props="logisticsTreeDefaultProps" default-expand-all :filter-node-method="filterlogisticsGroup" ref="logisticsGroupTree"></el-tree>
                            </div>
                        </el-popover>
                        <!-- <el-button size="small" type="primary" v-popover:logistics  @click="handlePartitionIDs(scope.row)">查看分区ID</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.pageNo" :page-sizes="[10, 20, 50]" :page-size="filter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="filter.total_count"></el-pagination>
            </div>
        </div>

        <el-dialog title="包邮物流分区设置" v-model="isShow" width="60%" class="warehouseCompensate-dialog" @close="closeDialog">
            <div class="el-container">
                <el-form :model="form"  ref="form" label-width="120px" :rules="rules">
                    <el-form-item label="销售仓：" prop="virWhCode" required>
                        <el-select v-model="form.virWhCode" filterable clearable placeholder="销售仓名称/英文名称" v-if="!form.id">
                            <el-option v-for="(item, index) in saleWhCodeList" :key="index" :label="item.value" :value="item.virWhCode"></el-option>
                        </el-select>
                        <span v-else>{{saleWhCodeText[form.virWhCode]}}</span>
                    </el-form-item>


                    <el-form-item label="生效渠道：" :prop="form.id ? 'pipelineCode' : 'pipelineCodeList'" required>
                        <el-checkbox-group v-model="form.pipelineCodeList" v-if="!form.id">
                            <el-checkbox v-for="(item, index) in channels" :key="index" :label="item.pipeline_code">{{item.pipeline_name}}</el-checkbox>
                        </el-checkbox-group>
                        <span v-else>{{channelsText[form.pipelineCode]}}</span>
                    </el-form-item>
                    <el-form-item label="包邮物流分区：" class="warehouseCompensate-title" required>
                        <el-col :span="7">
                            <el-form-item label-width="0px">价格区间</el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0px">重量区间</el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0px">包邮物流分区ID</el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" size="small" @click="shipRegionCompensateAdd"> 添加</el-button>
                        </el-col>
                    </el-form-item>
                    <el-form-item v-for="(warehouseCompensate, index) in form.warehouseCompensateList" :key="index" label="">
                        <el-col :span="7">
                            <el-form-item :prop="'warehouseCompensateList.' + index + '.whCompensationShipRegion'" label-width="0px" :rules="ruleRange">
                                <el-input v-model.trim="warehouseCompensate.whCompensationShipRegion" class="warehouse-input" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item :prop="'warehouseCompensateList.' + index + '.weightZone'" label-width="0px" :rules="ruleRange">
                                <el-input v-model.trim="warehouseCompensate.weightZone" class="warehouse-input" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item :prop="'warehouseCompensateList.' + index + '.weightFreeDivision'" label-width="0px" :rules="numberRule">
                                <el-input v-model="warehouseCompensate.weightFreeDivision" class="warehouse-input" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="danger" size="small" @click="shipRegionCompensateDelete(index)">删除</el-button>
                        </el-col>

                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="isDailogLoading" @click="handleBtnClick">保存</el-button>
                <el-button type="danger" @click="handleCancelClick">取消</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>

export default {
    data () {
         let checkRangeFlag = false;
        const checkRanges = (rule, val, callback) => {
            let reg = /^\d+\.?\d*\-\d+\.?\d*$/g;
            let arr = rule.field.split('.');
            // console.log(rule)
            let index = arr[1] - 0;
            let hasError = false;
            if (!val) {
                return callback(new Error('不能为空'));
            }
            if (reg.test(val)) {
                let flag = true;
                let list = val.split('-');
                list.forEach((el) => {
                    if (el.charAt(0) == 0 && el.charAt(1) != '.' && el.charAt(1) != '') {
                        flag = false;
                        return callback(new Error('首位不能为0'));
                    }
                });
                if (flag && (list[1] * 1 <= list[0] * 1)) {
                    return callback(new Error('起始值不能大于或等于结束值'));
                }
            } else {
                return callback(new Error('请输入正确的数值区间'));
            }
            hasError = checkRange(val.split('-'), index, this.form[arr[0]], arr[2]);
            if (hasError) {
                // 仓补偿
                if (arr[0] === 'warehouseCompensateList') {
                    let list = this.form.warehouseCompensateList;
                    // 计费价格区间
                    if (arr[2] === 'weightZone') {
                        // 如果价格区间有交集而重量区间没有交集
                        if (!checkRange(list[index].weightZone.split('-'), index, this.form[arr[0]], 'weightZone')) {
                            return callback();
                        }
                    }
                    // 计费重量区间
                    else {
                        // 如果重量区间有交集而价格区间没有交集
                        if (!checkRange(list[index].whCompensationShipRegion.split('-'), index, this.form[arr[0]], 'whCompensationShipRegion')) {
                            return callback();
                        }
                    }
                }
                return callback(new Error('区间数不能有交集'));
            }
            callback();
        }
        let checkRange = (target, targetIndex, list, type) => {
            let hasError = false;
            target[0] = parseFloat(target[0]);
            target[1] = parseFloat(target[1]);
            for (let i = 0; i < list.length; i++) {
                if (targetIndex === i) {
                    continue;
                }
                let range = list[i][type].split('-');
                range[0] = parseFloat(range[0]);
                range[1] = parseFloat(range[1]);
                // console.log(target, targetIndex, range, i)
                let minAggregate = [target[0], range[0]];
                let maxAggregate = [target[1], range[1]];
                if(Math.max.apply(null, minAggregate) < Math.min.apply(null, maxAggregate)) {
                    hasError = checkIntersection(list, type === 'weightZone' ? 'whCompensationShipRegion' : 'weightZone', i, targetIndex) ? true : false;
                    break;
                }
            }
            return hasError;
        }

        let checkIntersection = (list, type, intersectionIndex, index) => {
            let range1 = list[intersectionIndex][type].split('-');
            let range2 = list[index][type].split('-');
            let minAggregate = [range1[0], range2[0]];
            let maxAggregate = [range1[1], range2[1]];
            return Math.max.apply(null, minAggregate) < Math.min.apply(null, maxAggregate);
        }

        const checkNumber = (rule, val, callback) => {
            if (!val) {
                return callback(new Error('数值不能为空'));
            }
            if(isNaN(Number(val))) {
                return callback(new Error('输入正确的数值'));
            }
            if(val < 0) {
                return callback(new Error('最小值为0'));
            }
             callback();
        }

        return {
            isDataLoading: false,
            isDailogLoading: false,
            saleWhCodeList: [],
            saleWhCodeText: {},
            filter: {
                pageNo: 1,
                pageSize: 10,
                total_count: 0,
                pipelineCode: '',
                // virWhCnName: '',
                name: '',
            },
            form: {
                id: '',
                pipelineCodeList: [], //新增
                pipelineCode: '', // 编辑
                virWhCode: '',
                warehouseCompensateList: [{
                    whCompensationShipRegion: '',
                    weightZone: '',
                    weightFreeDivision: ''
                }],
            },
            isShow: false,

            channels: [],
            channelsText: {},
            tableData: [],
            isLoadingPartitionIds: false,
            filterlogisticsGroupText: '',
            logisticsGroupRespList: [],
            logisticsTreeDefaultProps: {
                children: 'children',
                label: 'label'
            },
            rules: {
                virWhCode: [
                    { required: true, message: '请选择销售仓', trigger: 'change' }
                ],
                 pipelineCodeList: [
                    { type: 'array', required: true, message: '请至少选择一个生效渠道', trigger: 'change' }
                ]
            },
            ruleRange: [{ validator: checkRanges, trigger: 'blur' }],
            numberRule: [{ validator: checkNumber, trigger: 'blur' }]
        };
    },
    watch: {
        filterlogisticsGroupText(val) {
            this.$refs.logisticsGroupTree.filter(val);
        }
    },
    created () {
        this.initData();
    },
    methods: {
        initData() {
            this.getSaleWhCodeListData();
            this.getListData();
            this.getChannels();
        },
        // 获取列表数据
        getListData(page) {
            let params = {};
            if (page) {
                this.filter.pageNo = page;
            }
            params = Object.assign({}, this.filter);

            if(params.name) {
                let temp = [],
                    searchName = params.name.toLowerCase();
                this.wareOpt.forEach(ware => {
                    if (ware.virWhCnName.toLowerCase().indexOf(searchName) != -1 
                        || ware.virWhEnName.toLowerCase().indexOf(searchName) != -1 
                        || ware.value.toLowerCase().indexOf(searchName) != -1 
                        || ware.virWhCode.toLowerCase().indexOf(searchName) != -1) {

                        temp.push(ware.virWhCode);
                    }
                })
                params.virWhCodeList = temp.length > 0 ? temp : ['0'];
            }

            delete params.total_count;
            delete params.name;
            this.isDataLoading = true;
            this.$http.get('stock/wh-pipeline-relation/list', { params: params }).then(res => {
                if (res.body.code === 0) {
                    this.tableData = [];
                    let data = res.body.data.list;
                    data.forEach((item) => {
                        let whCompensationShipRegionArr = item.whCompensationShipRegion.split('|');
                        whCompensationShipRegionArr.pop();
                        item.whCompensationShipRegion = whCompensationShipRegionArr;
                        let weightZoneArr = item.weightZone.split('|');
                        weightZoneArr.pop();
                        item.weightZone = weightZoneArr;
                        let weightFreeDivisionArr = item.weightFreeDivision.split('|');
                        weightFreeDivisionArr.pop();
                        item.weightFreeDivision = weightFreeDivisionArr;
                    });
                    this.tableData = data;
                    this.filter.total_count = res.body.data.totalCount;
                } else {
                    this.tableData = [];
                    this.filter.total_count = 0;
                }
                this.isDataLoading = false;
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
            });
        },
        // 获取渠道
        getChannels() {
            this.$http.get('admin/public/pipelines').then(res => {
                if (res.body.code === 0) {
                    this.channels = res.body.data;
                    let channelsTexts = {}
                    res.body.data.forEach((item) => {
                        channelsTexts[item.pipeline_code] = item.pipeline_name
                    })
                    this.channelsText = channelsTexts;
                }
            })
        },
        // 获取销售仓列表数据
        getSaleWhCodeListData() {
            this.$http.get('stock/warehouse/list', { params: {isPage: 2} }).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    data.list && data.list.forEach((item, index) => {
                        item.value = item.virWhCnName + '（' + item.virWhEnName + '）';

                        item.virWhCode && this.saleWhCodeList.push({
                            value: item.value,
                            code: item.virWhCnName,
                            virWhCode: item.virWhCode
                        });

                        this.wareOpt = data.list;
                        this.saleWhCodeText[item.virWhCode] = item.virWhCnName;
                    });
                }
            })
        },
        // 改变每页页数
        changePageSize(value) {
            this.filter.pageSize = value;
            this.getListData();
        },
        // 改变当前页数
        changePage(value) {
            this.filter.pageNo = value;
            this.getListData();
        },
        // 编辑
        handleEdit(row) {
            this.isShow = true;
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            });
            row = JSON.parse(JSON.stringify(row));
            row.warehouseCompensateList = [];
            if(row.weightFreeDivision.length === row.weightZone.length && row.weightZone.length === row.whCompensationShipRegion.length) {
                let len = row.weightFreeDivision.length;
                for(let i = 0; i < len; i++) {
                    row.warehouseCompensateList.push({
                        whCompensationShipRegion: row.whCompensationShipRegion[i],
                        weightZone: row.weightZone[i],
                        weightFreeDivision: row.weightFreeDivision[i]
                    })
                }
            }
            delete row.weightFreeDivision;
            delete row.weightZone;
            delete row.whCompensationShipRegion;
            delete row.siteCode;
            // delete row.virWhCnName;
            this.$nextTick(() => {
                this.form = Object.assign({}, this.form, row);
            })
            // console.log(this.form);

        },
        // 添加
        handleAdd() {
            this.isShow = true;
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            });
        },
        // 删除
        handleDelete(row) {
            this.$confirm('确认删除？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('stock/wh-pipeline-relation/delete', { virWhCode: row.virWhCode, pipelineCode: row.pipelineCode }).then(res => {
                    if (res.body.code == 0) {
                        this.getListData();
                        this.$message.success(res.body.message);
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            }).catch(() => {
                this.$message.info( '已取消删除');
            });
        },
        // 查看分区ID
        handlePartitionIDs(row) {
            let params = { pipelineCode: row.pipelineCode }; //row.pipelineCode待修改
            this.isLoadingPartitionIds = true;
            this.$http.get('stock/warehouse/get-area-by-pipeline-code', { params }).then(res => {
                this.isLoadingPartitionIds = false;
                if (res.body.code !== 0) {
                    return;
                }
                let data = res.body.data;
                this.logisticsGroupRespList = [];
                if (data) {
                    let strLogistics = JSON.stringify(data);
                    strLogistics = strLogistics.replace(/logisticsAreaList|logisticsWayList/g, 'children');
                    strLogistics = strLogistics.replace(/name"/g, 'label"');
                    strLogistics = strLogistics.replace(/logisticsName/g, 'label');
                    this.logisticsGroupRespList = JSON.parse(strLogistics);
                    this.setLogistics(this.logisticsGroupRespList);
                    // console.log(this.logisticsGroupRespList)
                }
            },

            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
            });
        },
        // 格式化分区ID数据
        setLogistics(arr, level) {
            if (!level) {
                level = 1;
            } else {
                level++;
            }
            arr.forEach((item) => {
                if (level === 3) {
                    item.label = item.label + ' (分区id ' + item.id + ')';
                }
                if (item.children && item.children.length > 0) {
                    this.setLogistics(item.children, level);
                }
            });
        },
        filterlogisticsGroup(value, data, node) {
            // console.log(value);
            // console.log(data);
            // console.log(node);
            if (!value) {
                return true;
            }
            return data.label.indexOf(value) !== -1;
        },
        // 取消帅选销售仓
        handleSaleListDelIconClick() {
            // this.filter.virWhCnName = '';
            this.filter.name = '';
        },
        // 选中销售仓对应项
        // handleSelectSaleWhCode(item) {
        //     this.filter.virWhCnName = item.code;
        //     this.filter.name = item.value;
        // },
        // 销售仓搜索
        querySearch(queryString, cb) {
            let items = this.saleWhCodeList;
            let results = null;
            results = queryString ? items.filter(this.createFilter(queryString)) : items;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        // 取消帅选
        handleBtnCancelFilterClick() {
            // this.filter.virWhCnName = '';
            this.filter.name = '';
            this.filter.pipelineCode = '';
            this.filter.pageNo = 1;
        },
        // 保存
        handleBtnClick() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.isDailogLoading = true;
                    let params = JSON.parse(JSON.stringify(this.form));
                    let whCompensationShipRegions = '';
                    let weightZones = '';
                    let weightFreeDivisions = '';
                    if(!params.id) {
                        delete params.id;
                        delete params.pipelineCode;
                    } else {
                        delete params.pipelineCodeList;
                    }
                    this.form.warehouseCompensateList.forEach((item) => {
                        whCompensationShipRegions += `${item.whCompensationShipRegion}|`;
                        weightZones += `${item.weightZone}|`;
                        weightFreeDivisions += `${item.weightFreeDivision}|`;
                    });
                    params.whCompensationShipRegion = whCompensationShipRegions;
                    params.weightZone = weightZones;
                    params.weightFreeDivision = weightFreeDivisions;
                    
                    delete params.warehouseCompensateList;
                    delete params.virWhCnName;
                    this.$http.post('stock/wh-pipeline-relation/' + (params.id ? 'edit' : 'add'), params).then(res => {
                        this.isDailogLoading = false;
                        if (res.body.code == 0) {
                            this.$message.success(res.body.message || '执行成功');
                            this.isShow = false;
                            if(!this.form.id) {
                                this.$refs.form.resetFields();
                            }
                            this.getListData();
                        } else {
                            this.$message.error(res.body.message || '发生错误');
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 取消
        handleCancelClick() {
            this.isShow = false;
        },
        // 添加包邮物流分区
        shipRegionCompensateAdd() {
            this.form.warehouseCompensateList.push({
                whCompensationShipRegion: '',
                weightZone: '',
                weightFreeDivision: ''
            });
        },
        // 删除包邮物流分区
        shipRegionCompensateDelete(index) {
            if(this.form.warehouseCompensateList.length > 1) {
                this.form.warehouseCompensateList.splice(index, 1);
            }
        },
        // 关闭清楚信息
        closeDialog() {
            if(this.form.id) {
                this.form = {
                    id: '',
                    pipelineCodeList: [], //新增
                    pipelineCode: '', // 编辑
                    virWhCode: '',
                    warehouseCompensateList: [{
                        whCompensationShipRegion: '',
                        weightZone: '',
                        weightFreeDivision: ''
                    }],
                }
            }
        }
    }
}
</script>
<style lang="less">
.ac-sale-list-wrap { display: block; position: relative;
    .el-icon-circle-close { visibility: hidden; z-index: 5; }
    .el-input { z-index: 2; }
    input { background: none; }
    > i { position: absolute; top: 50%; right: 10px; transform: translateY(-50%); color: #bfcbd9; font-size: 12px; z-index: 1; }
    &:hover {
        > i { visibility: hidden; }
        .el-icon-circle-close { visibility: visible; }
    }
}
#stock-channel-container{
    .el-table .cell{
        padding: 10px;
    }
}
.warehouseCompensate-dialog{
    .warehouseCompensate-title{
        margin-bottom: 5px;
    }
    .warehouse-input{
        width: 80%;
    }
}
.tree-wrap { max-height: 400px; overflow: auto; }
</style>
