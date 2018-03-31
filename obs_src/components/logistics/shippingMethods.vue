<!--物流方式-->
<template>
    <div>
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <el-form-item label="模板" prop="templateId">
                    <el-select v-model="option.templateId" placeholder="请选择" @change="templateChange" clearable filterable>
                        <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域" prop="shippingAreaId">
                    <el-select v-model="option.shippingAreaId" @change="shippingAreaChange" clearable filterable>
                        <el-option v-for="item in shippingAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流分组" prop="groupId">
                    <el-select v-model="option.groupId" clearable filterable>
                        <el-option v-for="item in groupIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-select v-model="option.searchType" placeholder="请选择搜索类型" clearable>
                        <el-option v-for="(value,key,index) in searchItem" :key="index" :label="value" :value="key"></el-option>
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
                           v-if="self.showAction_('logistics/way/add')">批量添加物流方式
                </el-button>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="templateName" label="模板"></el-table-column>
                <el-table-column prop="shippingAreaName" label="区域"></el-table-column>
                <el-table-column prop="groupName" label="物流分组"></el-table-column>
                <el-table-column prop="logisticsName" label="物流方式" width="200px"></el-table-column>
                <el-table-column prop="logisticsLevel" label="物流级别号" align="center"></el-table-column>
                <el-table-column prop="logisticsCode" label="物流编码"></el-table-column>
                <el-table-column label="是否启用" header-align="center">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}"></i>
                        <i :class="{'el-icon-warning color-warning': scope.row.status != scope.row.baseStatus }"></i>
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" width="200px" align="center">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUser" label="修改人" width="200px" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template scope="scope">
                        <el-button type="primary" @click="editWay(scope.row)" v-if="self.showAction_('logistics/way/edit')">编辑
                        </el-button>
                        <el-button type="danger" @click="removeItem(scope.row)" v-if="self.showAction_('logistics/way/delete')">删除
                        </el-button>
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
                        <el-col :span="2" style="text-align: center;">
                            <span>模板</span>
                        </el-col>
                        <el-col :span="4">
                            <el-select v-model="addForm.templateId" @change="addWayTemplateChange" clearable filterable>
                                <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="1">&nbsp;</el-col>
                        <el-col :span="2" style="text-align: center;">
                            <span>区域</span>
                        </el-col>
                        <el-col :span="4">
                            <el-select v-model="addForm.shippingAreaId" @change="addWayshippingAreaChange" clearable filterable>
                                <el-option v-for="item in shippingAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="1">&nbsp;</el-col>
                        <el-col :span="2">
                            <span>物流分组</span>
                        </el-col>
                        <el-col :span="4">
                            <el-select v-model="addForm.groupId" clearable filterable>
                                <el-option v-for="item in groupIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
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
                            <el-select placeholder="请选择搜索类型" v-model="addForm.selectType" @change="selectTypeChange" clearable>
                                <el-option v-for="(value,key,index) in searchItem" :key="index" :label="value" :value="key"></el-option>
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
                    <el-col :span="23">
                        <el-form-item label="物流分组" class="form-item">
                            <el-select v-model="editForm.groupId" :disabled="true">
                                <el-option v-for="item in logisticsGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物流方式" class="form-item">
                            <el-input v-model="editForm.logisticsName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="物流方式级别" class="form-item">
                            <el-input v-model="editForm.logisticsLevel" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="物流编码" class="form-item">
                            <el-input v-model="editForm.logisticsCode" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" class="form-item">
                            <el-radio-group v-model="editForm.status">
                                <el-radio class="radio" :label="1">启用</el-radio>
                                <el-radio class="radio" :label="0">关闭</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="运费" class="form-item">
                            <el-radio-group v-model="editForm.isStandard">
                                <el-radio class="radio" :label="0">自定义运费</el-radio>
                                <el-radio class="radio" :label="1">标准运费</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-for="(item, index) in editForm.langList" :key="item.key">
                    <el-col :span="23">
                        <el-form-item :label="item.name+ '名称'" class="form-item">
                            <el-input v-model="item.value" :maxlength="100"></el-input>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="1" v-if="item.lang.toLowerCase() === 'en'">
                        <span class="red-star">*</span>
                    </el-col>-->
                </el-row>

                <el-row>
                    <el-col :span="23">
                        <el-form-item label="备注">
                            <el-input v-model="editForm.remark" type="textarea" :rows="4" :maxlength="400"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer methodes-footer">
               <el-button type="primary" @click="editWaySave(editForm)">确定</el-button>
               <el-button type="danger" @click="handleClose">取消</el-button>
          </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>
    import Vue from 'vue'
    import logistics from './js/logistics'
    Vue.use(logistics);

    export default {
        data () {
            return {
                addMethodsDialog: false,
                editMethodsDialog: false,
                self: this,
                option: {
                    templateId: '',
                    shippingAreaId: '',
                    pageNo: 1,
                    pageSize: 10,
                    searchType: '',
                    searchKey: '',
                    groupId: '',
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
                    templateId: '',
                    shippingAreaId: '',
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
                    isStandard: '',
                    remark: '',
                    langList: [],
                },

                tableLoading: false,
                total: 10,
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
                    templateId: '',
                    shippingAreaId: '',
                    logisticsLevel: '',
                    logisticsName: '',
                    logisticsCode: ''
                },
                groupIdList: []
            };
        },
        created () {
            this.getData();
        },
        methods: {
            templateChange (){
                this.option.shippingAreaId = '';
                this.shippingAreaList = [];
                this.option.groupId = '';
                this.groupIdList = '';

                if (this.option.templateId) {
                    this.shippingAreaList = this.getAreaByTemplate(this.option.templateId);
                }
            },

            shippingAreaChange () {
                this.option.groupId = '';
                this.groupIdList = '';
                if (this.option.shippingAreaId) {
                    this.groupIdList = this.getGroupByAreaId(this.option.templateId, this.option.shippingAreaId);
                }
            },

            addWayTemplateChange () {
                this.addForm.shippingAreaId = '';
                this.shippingAreaList = [];
                this.addForm.groupId = '';
                this.groupIdList = '';
                this.leftTableData = [];
                this.rightTableData = [];
                if (this.addForm.templateId) {
                    this.shippingAreaList = this.getAreaByTemplate(this.addForm.templateId);
                }
            },

            addWayshippingAreaChange () {
                this.addForm.groupId = '';
                this.groupIdList = '';
                this.leftTableData = [];
                this.rightTableData = [];
                if (this.addForm.shippingAreaId) {
                    this.groupIdList = this.getGroupByAreaId(this.addForm.templateId, this.addForm.shippingAreaId);
                    this.getLeftTableData();
                }
            },

            //获得所有分组为添加
            getAllGroup (){
                this.logisticsGroupList = [];
                this.$http.get('logistics/partition/public-info', {params:{searchType:2}}).then(res => {
                    if (res.body.code === 0) {
                        res.body.data.baseResultList.forEach(item => {
                            this.logisticsGroupList.push({id: item.groupId, name: item.groupName, shippingAreaId: item.shippingAreaId, templateId: item.templateId});
                        });
                    }else{
                        this.$message.error(res.body.message);
                    }
                    console.log(this.logisticsGroupList);
                });
            },

            getData () {
                this.tableLoading = true;
                this.$http.get('logistics/way/list',{params:this.option}).then(res => {
                    this.tableLoading = false;
                    if (res.body.code === 0 && Array.isArray(res.body.data.list)) {
                        this.tableData = res.body.data.list;
                        this.total = res.body.data.totalCount;
                    }else{
                        this.tableData = [];
                    }
                })
            },

            getDataBySearch(){
                if (this.option.searchType && !this.option.searchKey) {
                    this.$message.error('请输入搜索词!');
                    return false;
                }
                if (!this.option.searchType && this.option.searchKey) {
                    this.$message.error('请选择搜索类型!');
                    return false;
                }
                this.getData();
                this.option.pageNo = 1;
            },

            //点击编辑按钮
            editWay (row) {
                this.logisticsGroupList = [];
                this.logisticsGroupList = this.getAllGroupFun();
                this.editForm.langList = [];

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
                        if (row.multiLanguage) {
                            let lanInfo = JSON.parse(row.multiLanguage);
                            let lantempArr = [];
                            for (let item in lanInfo) {
                                let key = item;
                                let val = lanInfo[item];
                                lantempArr.push({lang: key, value: val});
                            }
                            for (let i = 0; i < lantempArr.length; i++) {
                                for (let j = 0; j < this.editForm.langList.length; j++) {
                                    if (lantempArr[i].lang === this.editForm.langList[j].lang) {
                                        this.editForm.langList[j].value = lantempArr[i].value;
                                    }
                                }
                            }
                          }
                        }
                    });

                this.editForm.id = row.id;
                this.editForm.groupId = row.groupId;
                this.editForm.logisticsName = row.logisticsName;
                this.editForm.logisticsLevel = row.logisticsLevel;
                this.editForm.logisticsCode = row.logisticsCode;
                this.editForm.status = row.status;
                this.editForm.isStandard = row.isStandard;
                this.editForm.remark = row.remark;
                this.editMethodsDialog = true;
            },

            //编辑弹框 保存
            editWaySave (editForm){
                let lanList = [];
                this.editForm.langList.forEach(item => {
                    lanList.push({lang: item.lang, value: item.value});
                });
                /*if (!lanList[0].value) {
                    this.$message.error('英文名称不能为空!');
                    return false;
                }*/

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
                    id: this.editForm.id,
                    groupId: this.editForm.groupId,
                    status: this.editForm.status,
                    isStandard: this.editForm.isStandard,
                    remark: this.editForm.remark,
                };
                if (editForm.langList.length > 0) {
                    params.multiLanguage = JSON.stringify(lanObjTemp);
                } else {
                    params.multiLanguage = '';
                }
                //console.log(params);
                this.$http.post('logistics/way/edit', params).then(res => {
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
                    this.$http.post('logistics/way/delete', {id: row.id}).then(res => {
                        if (res.body.code === 0) {
                            let index = this.tableData.indexOf(row);
                            this.tableData.splice(index, 1);
                            this.total--;
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                        } else if (res.body.code === 60068) {
                            this.$message.error("物流方式有关联物流分区，不允许删除");
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
                this.addForm.templateId = '';
                this.addForm.shippingAreaId = '';
                this.addForm.groupId = '';
                this.addForm.logisticsLevel = '';
                this.addForm.selectType = '';
                this.addForm.searchKey = '';
                this.leftTableData = [];
                this.rightTableData = [];
            },

            //选择物流分组 触发获得 leftTableData 方法
            getLeftTableData (){
                this.addFormCondObj.templateId = this.addForm.templateId;
                this.addFormCondObj.shippingAreaId = this.addForm.shippingAreaId;
                this.addFormCondObj.logisticsLevel = '';
                this.addFormCondObj.logisticsName = '';
                this.addFormCondObj.logisticsCode = '';
                this.getLogisticsByport(this.addFormCondObj);
            },

            //获得物流方式 调用接口 方法
            getLogisticsByport (obj){
                this.lefttableLoading = true;
                this.$http.get('logistics/way/public-oms-filter-ways', {params: obj}).then(res => {
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

            selectTypeChange () {
                this.addForm.searchKey = '';
            },

            //添加物流方式 筛选
            addFormSearch (){
                let selectType = this.addForm.selectType;
                if (!this.addForm.templateId) {
                    this.$message.error('请选择模板!');
                    return false;
                }
                if (!this.addForm.shippingAreaId) {
                    this.$message.error('请选择区域!');
                    return false;
                }
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
                this.getLogisticsByport(this.addFormCondObj);
            },

            //leftTable 全选
            handleSelectionChange (val){
                this.leftTableSelect = val;
                //console.log(val);
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
                this.addFormCondObj.templateId = this.addForm.templateId;
                this.addFormCondObj.shippingAreaId = this.addForm.shippingAreaId;
                this.addFormSearch();
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
                if (this.addForm.groupId === '') {
                    this.$message.error('请选择物流分组！');
                    return false;
                }
                let selectDataArr = this.rightTableData;
                if (selectDataArr.length === 0) {
                    this.$message.error('请添加物流方式！');
                    return false;
                }
                let obj = {
                    groupId: this.addForm.groupId,
                    templateId: this.addFormCondObj.templateId,
                    shippingAreaId: this.addFormCondObj.shippingAreaId,
                    baseLogisticsList: []
                };
                selectDataArr.forEach(item => {
                    obj.baseLogisticsList.push({
                        logisticsCode: item.logisticsCode,
                        minDay: item.minDays,
                        maxDay: item.maxDays,
                        status: item.status
                    });
                });

                this.$http.post('logistics/way/add', obj).then(res => {
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
                this.option.templateId = '';
                this.option.shippingAreaId = '';
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
        display: inline-block;
        margin: 10px 0 0 10px;
        color: red;
    }
</style>
