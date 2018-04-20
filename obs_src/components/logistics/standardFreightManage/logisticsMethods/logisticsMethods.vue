<!--标准物流方式-->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label=" ">
                    <el-select v-model="option.searchType">
                        <el-option v-for="(value,key,index) in searchItem" :key="index" :label="value"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="option.searchKey" placeholder="请输入搜索词"></el-input>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
                    <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <el-button type="primary" @click="batchAddClick" icon="plus"
                           v-if="self.showAction_('logistics/way-standard/batch-save')">批量添加物流方式
                </el-button>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="logisticsName" label="物流方式" align="center"></el-table-column>
                <el-table-column prop="logisticsLevel" label="物流级别" align="center"></el-table-column>
                <el-table-column prop="logisticsCode" label="物流编码" align="center"></el-table-column>
                <el-table-column label="修改时间" width="200px" align="center">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template scope="scope">
                        <el-button type="primary" @click="editWay(scope.row)" v-if="self.showAction_('logistics/way-standard/edit')">编辑</el-button>
                        <!--<el-button type="danger"  @click="removeItem(scope.row)">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo"
                           :page-sizes="[10, 20, 50]" :page-size="option.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="添加物流方式" v-model="addMethodsDialog" class="log-group" size="small">
            <el-form :model="addForm" label-width="10px">
                <el-form-item>
                    <el-row>
                        <el-col :span="2">
                            <span>物流级别</span>
                        </el-col>
                        <el-col :span="4">
                            <el-select v-model="addForm.logisticsLevel" clearable>
                                <el-option v-for="item in Level" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4" class="middleSelect">
                            <el-select placeholder="请选择搜索类型" v-model="addForm.selectType" clearable>
                                <el-option v-for="(value, key) in searchItem" :key="key" :label="value" :value="key"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-input v-model="addForm.searchKey"></el-input>
                        </el-col>
                        <el-col :span="2" class="text-right">
                            <el-button type="primary" @click="addFormSearch">筛选</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div class="el-container">
                <el-row>
                    <el-col :span="11">
                        <el-table border :data="leftTableData" class="leftTable"
                                  @selection-change="handleSelectionChange" ref="leftTableRef"
                                  v-loading="lefttableLoading">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column label="物流名称" prop="logisticsName"></el-table-column>
                            <el-table-column label="物流编码" prop="logisticsCode"></el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="2" class="text-center">
                        <el-button type="primary" @click="DataToRight" class="add-btn">添加</el-button>
                    </el-col>
                    <el-col :span="11">
                        <el-table border :data="rightTableData" class="rigthTable">
                            <el-table-column label="物流名称" prop="logisticsName"></el-table-column>
                            <el-table-column label="物流编码" prop="logisticsCode"></el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button type="danger" @click="rightTableDelete(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>

                </el-row>
            </div>
            <div class="text-right">
                <el-button type="primary" @click="addMethodsDialogSave">确定</el-button>
                <el-button type="danger" @click="addMethodsDialogClose">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑物流方式" :visible.sync="editMethodsDialog" class="log-group" size="small"
                   :before-close="handleClose">
            <el-form :model="editForm" label-width="140px" ref="FormRules">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="物流方式" class="form-item">
                            <el-input v-model="editForm.logisticsName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="物流方式级别" class="form-item">
                            <el-input v-model="editForm.logisticsLevel" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="物流编码" class="form-item">
                            <el-input v-model="editForm.logisticsCode" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-for="(item, index) in editForm.langList" :key="item.key">
                    <el-col :span="22">
                        <el-form-item :label="item.name+ '名称'" class="form-item">
                            <el-input v-model="item.value" :maxlength="100"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <span class="red-star" v-if="item.lang.toLowerCase() === 'en'">&nbsp;&nbsp;*</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注">
                            <el-input v-model="editForm.remark" type="textarea" :rows="4" :maxlength="400"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer methodes-footer">
               <el-button type="primary" @click="handleSave">确定</el-button>
               <el-button type="danger" @click="handleClose">取消</el-button>
          </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>
    import Vue from 'vue'
    import logistics from '../../js/logistics'
    Vue.use(logistics);
    export default {
        data () {
            return {
                self: this,
                addMethodsDialog: false,
                editMethodsDialog: false,
                option: {
                    pageNo: 1,
                    pageSize: 10,
                    searchType: '1',
                    searchKey: ''
                },
                salesWare: [],
                templateList: this.getTemplateList(),
                shippingAreaList: [],
                searchItem: {
                    1: '物流名称',
                    2: '物流编码'
                },
                logisticsGroup: [],
                logisticsType: [],
                addForm: {
                    groupId: '',
                    logisticsLevel: '',
                    selectType: '',//搜索类型
                    searchKey: '',
                },
                editForm: {
                    id: '',
                    groupId: '',
                    logisticsName: '',
                    logisticsLevel: '',
                    logisticsCode: '',
                    status: '',
                    isEnableWebsiteFreight: '',
                    remark: '',
                    langList: [],
                },

                tableLoading: false,
                total: 0,
                tableData: [],
                logisticsGroupList: [],//编辑模块 分组列表
                leftTableData: [],//添加物流方式 左边表数据
                rightTableData: [],//添加物流方式 右边表数据
                //物流级别
                Level: [
                    {id: '', name: '请选择物流级别'},
                    {id: '0', name: '平邮'},
                    {id: '1', name: '慢'},
                    {id: '2', name: '中'},
                    {id: '3', name: '快'},
                    {id: '4', name: '自提'},
                ],
                leftTableSelect: [],
                globalVwareCode: '',
                lefttableLoading: false,
                addFormCondObj: {
                    logisticsLevel: '',
                    logisticsName: '',
                    logisticsCode: ''
                }
            };
        },
        created () {
            this.getData();
        },
        methods: {
            //获得所有分组为添加
            getAllGroup (){
                this.logisticsGroupList = [];
                this.$http.get('logistics/partition/public-info', {params: {searchType: 2}}).then(res => {
                    if (res.body.code === 0) {
                        res.body.data.baseResultList.forEach(item => {
                            this.logisticsGroupList.push({
                                id: item.groupId,
                                name: item.groupName,
                                shippingAreaId: item.shippingAreaId,
                                templateId: item.templateId
                            });
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                    console.log(this.logisticsGroupList);
                });
            },

            getData () {
                this.tableLoading = true;
                this.$http.get('logistics/way-standard/list', {params: this.option}).then(res => {
                    this.tableLoading = false;
                    if (res.body.code === 0) {
                        this.tableData = res.body.data.list;
                        this.total = res.body.data.totalCount;
                    } else {
                        this.tableData = [];
                        this.$message.error(res.body.message);
                    }
                })
            },

            getDataBySearch(){
                this.getData();
                this.option.pageNo = 1;
            },

            //点击编辑按钮
            editWay (row) {
                this.logisticsGroupList = [];
                this.logisticsGroupList = this.getAllGroupFun();
                this.editForm.langList = [];
                if (row.multiLanguage) {
                    let lanInfo = JSON.parse(row.multiLanguage);
                    let lanTempArr = [];
                    for (let item in lanInfo) {
                        let key = item;
                        let val = lanInfo[item];
                        lanTempArr.push({lang: key, value: val});
                    }
                    this.$http.post('logistics/multi-language/collection', {status: 1}).then(res => {
                        if (res.body.code === 0) {
                            res.body.data.forEach(item => {
                                this.editForm.langList.push({
                                    id: item.id,
                                    name: item.name,
                                    lang: item.lang,
                                    langOld: item.langOld,
                                    value: ''
                                });
                            });

                            for (let i = 0; i < lanTempArr.length; i++) {
                                for (let j = 0; j < this.editForm.langList.length; j++) {
                                    if (lanTempArr[i].lang.toUpperCase() === this.editForm.langList[j].lang.toUpperCase()) {
                                        this.editForm.langList[j].value = lanTempArr[i].value;
                                    }
                                }
                            }
                        }
                    });
                }
                this.editForm.logisticsName = row.logisticsName;
                this.editForm.logisticsLevel = row.logisticsLevel;
                this.editForm.logisticsCode = row.logisticsCode;
                this.editForm.remark = row.remark;
                this.editMethodsDialog = true;
            },

            //编辑弹框 保存
            handleSave (){
                let valid = this.validFun();
                if (!valid) {
                    return false;
                }
                this.editWaySave();
            },

            validFun (){
                let isOk = true;
                let list = this.editForm.langList;
                if (!list[0].value) {
                    this.$message.error('英文名称不能为空!');
                    isOk = false;
                }
                return isOk;
            },

            editWaySave (){
                let lanList = [];
                this.editForm.langList.forEach(item => {
                    lanList.push({lang: item.lang, value: item.value});
                });

                let lanArrTemp = [];
                let lanObjTemp = {};
                lanList.forEach(item => {
                    let obj = {};
                    obj[item.lang] = item.value;
                    lanArrTemp.push(obj);
                });

                lanArrTemp.forEach(item => {
                    for (let key in item) {
                        let key = key;
                        let val = item[key];
                        lanObjTemp[key] = val;
                    }
                });
                //console.log(lanObjTemp);
                let params = {
                    logisticsCode: this.editForm.logisticsCode,
                    remark: this.editForm.remark,
                    multiLanguage: JSON.stringify(lanObjTemp)
                };
                //console.log(params);
                this.$http.post('logistics/way-standard/edit', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success('保存成功!');
                        this.getData();
                        this.handleClose();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            removeItem (row) {
                this.$confirm('是否删除该项?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('logistics/way-standard/delete', {logisticsCode: row.logisticsCode}).then(res => {
                        if (res.body.code === 0) {
                            let index = this.tableData.indexOf(row);
                            this.tableData.splice(index, 1);
                            this.total--;
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
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

            handleClose(){
                this.$refs['FormRules'].resetFields();
                this.editMethodsDialog = false;
            },

            //批量添加物流方式
            batchAddClick (){
                this.addMethodsDialog = true;
                this.addForm.groupId = '';
                this.addForm.logisticsLevel = '';
                this.addForm.selectType = '';
                this.addForm.searchKey = '';
                this.leftTableData = [];
                this.rightTableData = [];
                this.getAllGroup();   //获得所有分组
                this.getLeftTableData();
            },

            //选择物流分组 触发获得 leftTableData 方法
            getLeftTableData (){
                this.getLogisticsByport(this.addFormCondObj);
            },

            //获得物流方式 调用接口 方法
            getLogisticsByport (obj){
                this.lefttableLoading = true;
                this.$http.post('logistics/way-standard/base-list', obj).then(res => {
                    if (res.body.code === 0) {
                        this.leftTableData = res.body.data.infoList;
                        //删除左边表格已存在的数据
                        for (var j = 0; j < this.rightTableData.length; j++) {
                            for (var k = 0; k < this.leftTableData.length; k++) {
                                if (this.rightTableData[j].id === this.leftTableData[k].id) {
                                    this.leftTableData.splice(k, 1);
                                }
                            }
                        }
                    } else {
                        this.leftTableData = [];
                        this.$message.error(res.body.message);
                    }
                    this.lefttableLoading = false;
                })
            },

            //添加物流方式 筛选
            addFormSearch (){
                let selectType = this.addForm.selectType;
                if (this.addForm.selectType === '' && this.addForm.searchKey !== '') {
                    this.$message.error('请选择搜索类型!');
                    return false;
                }
                if (this.addForm.selectType !== '' && this.addForm.searchKey === '') {
                    this.$message.error('请输入搜索关键词!');
                    return false;
                }
                this.addFormCondObj.logisticsLevel = this.addForm.logisticsLevel;
                selectType === '1' ? this.addFormCondObj.logisticsName = this.addForm.searchKey : '';
                selectType === '2' ? this.addFormCondObj.logisticsCode = this.addForm.searchKey : '';
                if (!selectType) {
                    this.addFormCondObj.logisticsName = '';
                    this.addFormCondObj.logisticsCode = '';
                }
                console.log(this.addFormCondObj);
                this.getLogisticsByport(this.addFormCondObj);
            },

            //leftTable 全选
            handleSelectionChange (val){
                this.leftTableSelect = val;
            },

            //数据从左边表格到右边表格
            DataToRight (){
                if (this.leftTableSelect.length === 0) {
                    this.$message.error('请先选择需要添加的物流方式！');
                    return false;
                }
                for (var i = 0; i < this.leftTableSelect.length; i++) {
                    this.rightTableData.push(this.leftTableSelect[i]);
                }
                //删除左边表格被移除的数据
                for (var j = 0; j < this.leftTableSelect.length; j++) {
                    for (var k = 0; k < this.leftTableData.length; k++) {
                        if (this.leftTableSelect[j].id === this.leftTableData[k].id) {
                            this.leftTableData.splice(k, 1);
                        }
                    }
                }
                //从新获得左边表格数据
                this.getLeftTableData();
            },

            //右边表数据删除
            rightTableDelete (row){
                //console.log(row);
                let index = this.rightTableData.indexOf(row);
                this.$confirm('是否删除该项?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.rightTableData.splice(index, 1);
                    this.leftTableData.push(row);
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            //添加物流方式保存
            addMethodsDialogSave (){
                let selectDataArr = this.rightTableData;
                if (selectDataArr.length === 0) {
                    this.$message.error('请添加物流方式！');
                    return false;
                }
                let logisticsCodeList = [];
                selectDataArr.forEach(item => {
                    logisticsCodeList.push(item.logisticsCode);
                });

                this.$http.post('logistics/way-standard/batch-save', {logisticsCodeList: logisticsCodeList}).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success('保存成功!');
                        this.addMethodsDialog = false;
                        this.getDataBySearch();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });

            },
            //添加物流方式取消
            addMethodsDialogClose (){
                this.addMethodsDialog = false;
            },

            ChangePage (val) {
                this.option.pageNo = val;
                this.getData();
            },
            ChangePageSize (val) {
                this.option.pageSize = val;
                this.getData();
            },
            resetForm () {
                this.option.searchType = '';
                this.option.searchKey = '';
                this.getDataBySearch();
            }
        }
    }
</script>

<style lang="less">
    .log-group {
        .el-dialog {
            top: 5% !important;

            .el-dialog__body {
                padding: 20px;

                .el-form-item {
                    margin-bottom: 5px;
                }
            }
        }
    }

    .form-item {
        margin-bottom: 18px !important;
    }

    .middleSelect {
        margin: 0 15px;
    }

    .leftTable .el-table__body-wrapper, .rigthTable .el-table__body-wrapper {
        height: 400px !important;
        overflow-y: auto !important;
        overflow-x: hidden;
    }

    .add-btn {
        margin-top: 200px;
    }

    .methodes-footer {
        margin-right: 75px;
    }

    .red-star {
        color: red;
        display: inline-block;
        margin-top: 12px;
    }
</style>

