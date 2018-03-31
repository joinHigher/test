<!--物流分区-->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm" class="logistics-price">
                <el-form-item label="模板" prop="templateId">
                    <el-select v-model="option.templateId" placeholder="请选择" filterable clearable @change="templateChange">
                        <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域" prop="shippingAreaId" labelWidth="100px">
                    <el-select v-model="option.shippingAreaId" @change="shippingAreaChange" filterable clearable>
                        <el-option v-for="item in shippingAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流分组" prop="groupId" labelWidth="100px">
                    <el-select v-model="option.groupId" @change="groupChange" filterable clearable>
                        <el-option v-for="item in logisticsGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流方式" labelWidth="100px">
                    <el-select v-model="option.logisticsCode" @change="logisticsCodeChange" filterable clearable>
                        <el-option v-for="item in logisticsTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流分区" labelWidth="100px">
                    <el-select v-model="option.id" filterable clearable>
                        <el-option v-for="item in logisticsAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
                    <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
                </div>
            </el-form>
        </div>

        <div class="el-container text-right">
            <a :href="downUrl" class="template-Down">
                <el-button type="primary">模板下载</el-button>
            </a>
            <el-button type="primary" @click="openLeadDialog" v-if="self.showAction_('logistics/area/import')">导入分区
            </el-button>
            <el-button type="primary" icon="plus" @click="openAreaDialog(1)" v-if="self.showAction_('logistics/area/add')">添加物流分区
            </el-button>
        </div>

        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="templateName" label="模板"></el-table-column>
                <el-table-column prop="shippingAreaName" label="区域"></el-table-column>
                <el-table-column prop="logisticsGroupName" label="物流分组"></el-table-column>
                <el-table-column prop="logisticsName" label="物流方式"></el-table-column>
                <el-table-column prop="name" label="运费分区"></el-table-column>
                <el-table-column prop="area" label="国家" width="200px">
                    <template scope="scope">
                        <span v-if="scope.row.area.length<=70">{{scope.row.area}}</span>
                        <el-tooltip v-if="scope.row.area.length>70" :content="scope.row.area" placement="top"
                                    effect="light" popper-class="pop-box">
                            <span class="tip-text">{{scope.row.area}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" width="200px">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUser" label="修改人"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" @click="openAreaDialog(2,scope.row)" v-if="self.showAction_('logistics/area/edit')">编辑
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

        <!--添加 编辑物流分区 弹框-->
        <el-dialog :title="dialogTitle" v-model="areaDialog" class="log-group" size="small" :before-close="areaDialogClose">
            <el-row>
                <el-col :span="18">
                    <el-form label-width="200px" v-model="areaForm">
                        <el-form-item label="运费分区名称">
                            <el-input v-model="areaForm.name" @change="nameChange"></el-input>
                        </el-form-item>
                        <el-form-item label="运费模板">
                            <el-select v-model="areaForm.templateId" placeholder="请选择" @change="areaFormTemplateChange" filterable clearable>
                                <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="区域">
                            <el-select v-model="areaForm.shippingAreaId" placeholder="请选择" @change="areaFormShippingAreaChange" filterable clearable>
                                <el-option v-for="item in shippingAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物流分组">
                            <el-select v-model="areaForm.groupId" @change="areaFormGroupChange" filterable clearable>
                                <el-option v-for="item in logisticsGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物流方式">
                            <el-select v-model="areaForm.logisticsCode" @change="codeChange" @visible-change="codeVisibleChange" filterable clearable>
                                <el-option v-for="item in logisticsTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="国家">
                            <el-checkbox-group v-model="areaForm.countryResp" v-loading="countryLoading">
                                <el-checkbox v-for="item in countrysList" :label="item.code" :key="item.code"
                                             :disabled="item.isExistWay === 1 ? true : false">{{item.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item class="text-right footer-btn">
                            <el-button type="primary" @click="areaDialogSave">保存</el-button>
                            <el-button type="danger" @click="areaDialogClose">返回</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>

        <!--导入分区 弹框-->
        <el-dialog title="导入分区" v-model="leadDialog" class="log-group" size="small" :before-close="leadFormClose">
            <el-row>
                <el-col :span="18">
                    <el-form label-width="200px" :model="leadForm">
                        <el-form-item label="运费模板">
                            <el-select v-model="leadForm.templateId" placeholder="请选择" @change="leadFormTemplateChaneg"
                                       filterable clearable>
                                <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="区域">
                            <el-select v-model="leadForm.shippingAreaId" placeholder="请选择" @change="leadFormShippingAreaChange" filterable clearable>
                                <el-option v-for="item in shippingAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物流分组">
                            <el-select v-model="leadForm.groupId" @change="leadFormGroupChange" filterable clearable>
                                <el-option v-for="item in logisticsGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物流方式">
                            <el-select v-model="leadLogisticsCode" filterable clearable>
                                <el-option v-for="item in logisticsTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上传文件">
                            <el-upload :action="importUrl" ref="upload" :on-preview="handlePreview"
                                       :on-remove="handleRemove"
                                       :file-list="fileList" :auto-upload="false"
                                       :data="leadObj" :accept="fileType"
                                       :on-success="handleBatchImportPreview"
                                       :on-error="handleBatchImportError"
                                       :multiple="false"
                                       id="upload">
                                <el-button slot="trigger" type="success">选取文件</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item class="text-right footer-btn">
                            <el-button type="primary" @click="submitUpload">保存</el-button>
                            <el-button type="danger" @click="leadFormClose">返回</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>

    </div>
</template>

<script>
    import Vue from 'vue'
    import logistics from './js/logistics'
    Vue.use(logistics);
    export default {
        data () {
            return {
                areaDialog: false,
                leadDialog: false,
                self: this,
                tableLoading: false,
                countryLoading: false,
                total: 10,
                tableData: [],
                option: {
                    templateId: '',
                    shippingAreaId: '',
                    pageNo: 1,
                    pageSize: 10,
                    groupId: '',
                    logisticsCode: '',
                    id: '',
                },
                leadForm: {
                    templateId: '',
                    shippingAreaId: '',
                    groupId: '',
                },
                leadLogisticsCode: '',
                templateList: this.getTemplateList(), //模板
                shippingAreaList: [], //区域
                logisticsGroup: [], //物流分组
                logisticsTypeList: [], //物流方式
                logisticsAreaList: [], //物流分区
                downUrl: this.$store.getters.getRootMenu + '/logistics/area/public-template',
                importUrl: this.$store.getters.getRootMenu + '/logistics/area/import',
                fileList: [],
                fileType: 'excel',
                leadObj: {
                    logisticsCode: '',
                    templateId: '',
                    shippingAreaId: '',
                },
                dialogTitle: '',
                windowType: '',
                rowData: "",
                areaForm: {
                    name: '',
                    templateId: '',
                    shippingAreaId: '',
                    groupId: '',
                    logisticsCode: '',
                    countryResp: [],
                },
                countrysList: '',
                countrysListLen: '',
                countryArea: '',
                isChangeName: 1, //判断运费分区名称是否被改变  1:不变   2:变化
                isChangeCode: 1, //判断物流方式是否被修改  1：没被修改  非 1 ：被修改
                rowId: '',
                editInitCode: '',
                selectedCountry: [],
                isEditStatus: false,
            };
        },
        created () {
            this.getData();
        },
        methods: {
            templateChange (){
                this.option.shippingAreaId = '';
                this.option.groupId = '';
                this.option.logisticsCode = '';
                this.option.areaId = '';
                this.shippingAreaList = [];
                this.logisticsGroup = [];
                this.logisticsTypeList = [];
                this.logisticsAreaList = [];

                if (this.option.templateId) {
                    this.shippingAreaList = this.getAreaByTemplate(this.option.templateId);
                }
            },

            shippingAreaChange (){
                this.option.groupId = '';
                this.option.logisticsCode = '';
                this.option.areaId = '';
                this.logisticsGroup = [];
                this.logisticsTypeList = [];
                this.logisticsAreaList = [];

                if (this.option.shippingAreaId) {
                    this.logisticsGroup = this.getGroupByAreaId(this.option.templateId, this.option.shippingAreaId);
                }
            },

            groupChange (){
                if (this.option.groupId) {
                    this.logisticsTypeList = this.getLogisticsCodeByGroup(this.option.groupId);
                } else {
                    this.option.logisticsCode = '';
                    this.option.areaId = '';
                    this.logisticsTypeList = [];
                    this.logisticsAreaList = [];
                }
            },

            logisticsCodeChange (){
                if (this.option.logisticsCode) {
                    this.logisticsAreaList = this.getAreaIdByLogisticsCode(this.option.templateId, this.option.shippingAreaId, this.option.logisticsCode);
                } else {
                    this.option.id = '';
                    this.logisticsAreaList = [];
                }
            },

            leadFormTemplateChaneg () {
                this.leadForm.shippingAreaId = '';
                this.leadForm.groupId = '';
                this.leadLogisticsCode = '';
                this.shippingAreaList = [];
                this.logisticsGroup = [];
                this.logisticsTypeList = [];

                if (this.leadForm.templateId) {
                    this.shippingAreaList = this.getAreaByTemplate(this.leadForm.templateId);
                }
            },

            leadFormShippingAreaChange () {
                this.leadForm.groupId = '';
                this.leadLogisticsCode = '';
                this.logisticsGroup = [];
                this.logisticsTypeList = [];

                if (this.leadForm.shippingAreaId) {
                    this.logisticsGroup = this.getGroupByAreaId(this.leadForm.templateId, this.leadForm.shippingAreaId);
                }
            },

            leadFormGroupChange () {
                this.leadLogisticsCode = '';
                this.logisticsTypeList = [];

                if (this.leadForm.groupId) {
                    this.logisticsTypeList = this.getLogisticsCodeByGroup(this.leadForm.groupId);
                }
            },

            areaFormTemplateChange () {
                this.areaForm.shippingAreaId = '';
                this.areaForm.groupId = '';
                this.areaForm.logisticsCode = '';
                this.shippingAreaList = [];
                this.logisticsGroup = [];
                this.logisticsTypeList = [];
                if (this.areaForm.templateId) {
                    this.shippingAreaList = this.getAreaByTemplate(this.areaForm.templateId);
                }

            },

            areaFormShippingAreaChange () {
                this.areaForm.groupId = '';
                this.areaForm.logisticsCode = '';
                this.logisticsGroup = [];
                this.logisticsTypeList = [];
                if (this.areaForm.shippingAreaId) {
                    this.logisticsGroup = this.getGroupByAreaId(this.areaForm.templateId, this.areaForm.shippingAreaId);
                }
            },

            areaFormGroupChange () {
                this.areaForm.logisticsCode = '';
                this.logisticsTypeList = [];
                if (this.areaForm.groupId) {
                    this.logisticsTypeList = this.getLogisticsCodeByGroup(this.areaForm.groupId);
                }
            },

            getData () {
                this.tableLoading = true;
                this.$http.get('logistics/area/list', {params: this.option}).then(res => {
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
            //筛选
            getDataBySearch (){
                this.getData();
                this.option.pageNo = 1;
            },

            openLeadDialog (){
                this.leadDialog = true;
                this.shippingAreaList = [];
                this.logisticsGroup = [];
                this.logisticsTypeList = [];
                this.fileList = [];
            },

            leadFormClose (){
                this.leadForm.templateId = '';
                this.leadForm.shippingAreaId = '';
                this.leadForm.groupId = '';
                this.leadLogisticsCode = '';
                this.fileList = [];
                this.leadDialog = false;
            },

            handleRemove(file, fileList) {
                //console.log(file, fileList);
            },
            handlePreview(file) {
                //console.log(file);
            },

            //导入分区弹框 提交
            submitUpload (){
                //console.log("导入提交");
                if (this.leadForm.templateId === '') {
                    this.$message.error('运费模板不能为空');
                    return false;
                }
                if (this.leadForm.shippingAreaId === '') {
                    this.$message.error('区域不能为空');
                    return false;
                }
                if (this.leadForm.groupId === '') {
                    this.$message.error('物流分组不能为空');
                    return false;
                }
                if (this.leadLogisticsCode === '') {
                    this.$message.error('物流方式不能为空');
                    return false;
                }
                var sign = document.getElementById('upload').lastChild.hasChildNodes();
                if (!sign) {
                    this.$message.error('请选择上传文件!');
                    return false;
                }
                this.leadObj.logisticsCode = this.leadLogisticsCode;
                this.leadObj.templateId = this.leadForm.templateId;
                this.leadObj.shippingAreaId = this.leadForm.shippingAreaId;
                this.$refs.upload.submit();
            },

            handleBatchImportPreview (res, file) {
                if (res.code === 0) {
                    //console.log(res);
                    this.$message.success('导入成功');
                    this.leadDialog = false;
                    this.getData();
                    this.fileList = [];
                } else {
                    this.fileList = [];
                    this.$alert(res.message, "提示", {
                        confirmButtonText: '确定',
                        type: 'error',
                    });
                }
            },

            handleBatchImportError (err, file) {
                this.fileList = [];
                this.$alert(err, "提示", {
                    confirmButtonText: '确定',
                    type: 'error',
                });
            },

            openAreaDialog (type, row){
                this.windowType = type;
                this.areaDialog = true;
                this.isChangeName = 1;
                this.isChangeCode = 1;
                this.option.templateId = '';
                this.option.shippingAreaId = '';
                this.option.groupId = '';
                this.option.logisticsCode = '';
                this.option.id = '';
                if (type === 1) {
                    this.dialogTitle = '添加物流分区';
                    this.rowData = "";
                    this.areaForm.name = '';
                    this.areaForm.templateId = '';
                    this.areaForm.shippingAreaId = '';
                    this.areaForm.groupId = '';
                    this.areaForm.logisticsCode = '';
                    this.selectedCountry = [];
                    this.areaForm.countryResp = [];
                    this.shippingAreaList = [];
                    this.logisticsGroup = [];
                    this.logisticsTypeList = [];
                }
                if (type === 2) {
                    this.isEditStatus = true;
                    this.rowData = row;
                    this.dialogTitle = '编辑物流分区';
                    this.countryArea = row.countryCodeArr;
                    this.rowId = row.id;
                    this.selectedCountry = [];
                    this.areaForm.countryResp = [];

                    this.areaForm.name = row.name;
                    this.areaForm.templateId = row.templateId;
                    this.editInitCode = row.logisticsCode;

                    this.loadShippingArea(row.templateId).then((data) => {
                        this.areaForm.shippingAreaId = row.shippingAreaId;
                        this.loadGroup(row.templateId, row.shippingAreaId);
                    }).then((data) => {
                        this.areaForm.groupId = row.groupId;
                        this.loadLogistics(row.groupId);
                    }).then((data) => {
                        this.areaForm.logisticsCode = row.logisticsCode;
                    });

                    let list = this.countryArea.split(',');
                    this.getCountryList(row.logisticsCode, row.shippingAreaId, row.templateId).then((res) => {
                        for (let i = 0; i < list.length; i++) {
                            for (let j = 0; j < res; j++) {
                                if (list[i] === this.countrysList[j].code) {
                                    this.areaForm.countryResp.push(this.countrysList[j].code);
                                    this.countrysList[j].isExistWay = 0;
                                }
                            }
                        }
                        this.selectedCountry = this.areaForm.countryResp;
                    });
                }
            },

            loadShippingArea (templateId) {
                let p = new Promise((resolve, reject) => {
                    this.shippingAreaList = this.getAreaByTemplate(templateId);
                    resolve(this.shippingAreaList);
                });
                return p;
            },

            loadGroup (templateId, shippingAreaId) {
                let p = new Promise((resolve, reject) => {
                    this.logisticsGroup = this.getGroupByAreaId(templateId,shippingAreaId);
                    resolve(this.logisticsGroup);
                });
                return p;
            },

            loadLogistics (groupId) {
                let p = new Promise((resolve, reject) => {
                    this.logisticsTypeList = this.getLogisticsCodeByGroup(groupId);
                    resolve(this.logisticsTypeList);
                });
                return p;
            },

            //添加、编辑物流分区弹窗 获得国家列表
            getCountryList (logisticsCode, shippingAreaId, templateId) {
                let p = new Promise((resolve, reject) => {
                    this.countrysList = [];
                    this.countryLoading = true;
                    let obj = {
                        logisticsCode: logisticsCode,
                        shippingAreaId: shippingAreaId,
                        templateId: templateId
                    };
                    this.$http.get('logistics/area/public-countrys', {params: obj}).then(res => {
                        if (res.body.code === 0) {
                            let list = res.body.data.countryInfoResps;
                            list.forEach(item => {
                                this.countrysList.push({ name: item.countryName, code: item.countryCode, isExistWay: item.isExistWay });
                            });
                            this.countrysListLen = this.countrysList.length;
                            resolve(this.countrysListLen);
                        } else {
                            this.countrysList = [];
                        }
                        this.countryLoading = false;
                    })
                });
                return p;
            },

            codeVisibleChange () {
                this.isEditStatus = false;
            },

            codeChange (){
                if (this.isEditStatus) {
                    return false;
                }
                this.countrysList = [];
                let logisticsCode = this.areaForm.logisticsCode,
                    shippingAreaId = this.areaForm.shippingAreaId,
                    templateId = this.areaForm.templateId;

                if (this.areaForm.logisticsCode === '') {
                    return false;
                }
                this.getCountryList(logisticsCode, shippingAreaId, templateId).then((res) => {
                    if (this.editInitCode !== this.areaForm.logisticsCode) {
                        this.areaForm.countryResp = [];
                    } else {
                        this.areaForm.countryResp = this.selectedCountry;
                        for (let i = 0; i < this.areaForm.countryResp.length; i++) {
                            for (let j = 0; j < res; j++) {
                                if (this.areaForm.countryResp[i] === this.countrysList[j].code) {
                                    this.countrysList[j].isExistWay = 0;
                                }
                            }
                        }
                    }
                });
                this.isChangeCode++;
            },

            nameChange (){
                this.isChangeName = 2;
            },

            areaDialogSave () {
                if (this.areaForm.name === '') {
                    this.$message.error('运费分区名称不能为空！');
                    return false;
                }
                if (this.areaForm.logisticsCode === '') {
                    this.$message.error('物流方式不能为空！');
                    return false;
                }
                if (this.areaForm.countryResp.length === 0) {
                    this.$message.error('请选择国家！');
                    return false;
                }
                //console.log(this.areaForm);
                if (this.windowType === 1) {
                    let params = {
                        name: this.areaForm.name,
                        logisticsCode: this.areaForm.logisticsCode,
                        type: 1,
                        templateId: this.areaForm.templateId,
                        shippingAreaId: this.areaForm.shippingAreaId
                    };
                    this.$http.get('logistics/area/public-check-name', {params: params}).then(res => {  //判断是否重名
                        if (res.body.code === 60047) {
                            this.$message.error('运费分区名称名称已存在!');
                            return false;
                        } else if (res.body.code === 0) {
                            let objForSave = {
                                templateId: this.areaForm.templateId,
                                shippingAreaId: this.areaForm.shippingAreaId,
                                name: this.areaForm.name,
                                logisticsCode: this.areaForm.logisticsCode,
                                countryResp: this.areaForm.countryResp
                            };
                            this.$http.post('logistics/area/add', objForSave).then(res => {
                                if (res.body.code === 0) {
                                    this.$message.success('保存成功！');
                                    this.areaDialog = false;
                                    this.updateWeb();
                                } else {
                                    this.$message.error(res.body.message);
                                }
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                } else if (this.windowType === 2) {
                    if (this.isChangeName === 2 || this.isChangeCode !== 1) { //如果名称或物流编码有改变
                        let params1 = {
                            name: this.areaForm.name,
                            logisticsCode: this.areaForm.logisticsCode,
                            type: 2,
                            id: this.rowId,
                            templateId: this.areaForm.templateId,
                            shippingAreaId: this.areaForm.shippingAreaId
                        };
                        this.$http.get('logistics/area/public-check-name', {params: params1}).then(res => {  //判断是否重名
                            if (res.body.code === 60047) {
                                this.$message.error('运费分区名称已存在!');
                                return false;
                            } else if (res.body.code === 0) {
                                this.editSave();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        });
                    } else {
                        this.editSave();
                    }
                }
            },
            //编辑情况下保存
            editSave (){
                let obj = {
                    id: this.rowId,
                    name: this.areaForm.name,
                    logisticsCode: this.areaForm.logisticsCode,
                    countryResp: this.areaForm.countryResp,
                    templateId: this.areaForm.templateId,
                    shippingAreaId: this.areaForm.shippingAreaId
                };
                this.$http.post('logistics/area/edit', obj).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success('保存成功！');
                        this.updateWeb();
                        this.areaDialog = false;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            areaDialogClose (){
                this.areaDialog = false;
                this.areaForm.name = '';
                this.areaForm.templateId = '';
                this.areaForm.shippingAreaId = '';
                this.areaForm.groupId = '';
                this.areaForm.logisticsCode = '';
                this.areaForm.countryResp = [];
                this.selectedCountry = [];
                this.countrysList = [];
            },

            //新增编辑完成后更新页面
            updateWeb (){
                this.option.pageNo = 1;
                this.getData();
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
                this.option.groupId = '';
                this.option.logisticsCode = '';
                this.option.id = '';
                this.getDataBySearch();
            },
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

    .template-Down {
        margin-right: 10px;
    }

    .el-form .el-form-item {
        margin-bottom: 20px !important;
    }

    .footer-btn {
        margin-top: 15px;
    }

    .logistics-price {
        .el-select {
            width: 210px !important;
        }
    }

    .tip-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        padding: 10px 0;
        cursor: pointer;
        &:hover {
            color: red;
        }
    }

    .pop-box {
        max-width: 1200px;
        line-height: 20px;
        word-wrap: break-word;
    }

</style>
