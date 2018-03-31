<!--标准物流分区-->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm" class="logistics-price">
                <el-form-item label="物流方式">
                    <el-select v-model="option.logisticsCode" @change="logisticsCodeChange(option.logisticsCode)" filterable clearable>
                        <el-option v-for="item in logisticsTypeList" :key="item.logisticsCode"
                                   :label="item.logisticsName" :value="item.logisticsCode"></el-option>
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
            <el-button type="primary" @click="openLeadDialog" v-if="self.showAction_('logistics/area/import-standard-area')">导入分区</el-button>
            <el-button type="primary" icon="plus" @click="openAreaDialog(1)" v-if="self.showAction_('logistics/area/add-standard-area')">添加物流分区</el-button>
        </div>

        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="ID" align="center" width="180px"></el-table-column>
                <el-table-column prop="logisticsName" label="物流方式" align="center"></el-table-column>
                <el-table-column prop="name" label="运费分区" align="center"></el-table-column>
                <el-table-column prop="area" label="国家" width="300px" header-align="center">
                    <template scope="scope">
                        <span v-if="scope.row.area.length<=116">{{scope.row.area}}</span>
                        <el-tooltip v-if="scope.row.area.length>116" :content="scope.row.area" placement="top" effect="light" popper-class="pop-box">
                            <span class="tip-text">{{scope.row.area}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" width="180px" align="center">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="180px">
                    <template scope="scope">
                        <el-button type="primary" @click="openAreaDialog(2,scope.row)" v-if="self.showAction_('logistics/area/edit-standard-area')">编辑</el-button>
                        <!--<el-button type="danger">删除</el-button>-->
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
        <el-dialog :title="dialogTitle" v-model="areaDialog" class="log-group" size="small"
                   :before-close="areaDialogClose">
            <el-row>
                <el-col :span="18">
                    <el-form label-width="200px" v-model="areaForm">
                        <el-form-item label="运费分区名称">
                            <el-input v-model="areaForm.name"  @change="nameChange"></el-input>
                        </el-form-item>
                        <el-form-item label="物流方式">
                            <el-select v-model="areaForm.logisticsCode" @change="codeChange(areaForm.logisticsCode)"
                                       filterable>
                                <el-option v-for="item in logisticsTypeList" :key="item.logisticsCode"
                                           :label="item.logisticsName" :value="item.logisticsCode"></el-option>
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
                    <el-form label-width="200px">
                        <el-form-item label="物流方式">
                            <el-select v-model="leadLogisticsCode" filterable clearable>
                                <el-option v-for="item in logisticsTypeList" :key="item.logisticsCode"
                                           :label="item.logisticsName" :value="item.logisticsCode"></el-option>
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
                                       id="upload"
                                       name="file">
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
    import logistics from '../../js/logistics'
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
                    pageNo: 1,
                    pageSize: 10,
                    logisticsCode: '',
                    id: '',
                },
                leadLogisticsCode: '',
                logisticsTypeList: [], //物流方式
                logisticsAreaList: [], //物流分区
                downUrl: this.$store.getters.getRootMenu + '/logistics/area/public-template',
                importUrl: this.$store.getters.getRootMenu + '/logistics/area/import-standard-area',
                fileList: [],
                fileType: 'excel',
                leadObj: {
                    logisticsCode: '',
                },
                dialogTitle: '',
                windowType: '',
                areaForm: {
                    name: '',
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

                areaRes: [],
            };
        },
        created () {
            this.getWayAndArea();
            this.getData();
        },
        methods: {
            getWayAndArea () {
                this.logisticsTypeList = [];
                this.$http.get('logistics/way-standard/list-area').then(res => {
                    if (res.body.code === 0) {
                        this.logisticsTypeList = res.body.data;
                    } else {
                        this.logisticsTypeList = [];
                    }
                })
            },

            logisticsCodeChange (logisticsCode){
                this.option.id = '';
                this.logisticsAreaList = [];
                if (this.option.logisticsCode) {
                    this.logisticsTypeList.forEach(item => {
                        if (logisticsCode === item.logisticsCode) {
                            let areaArr = item.logisticsAreasResp;
                            areaArr.forEach(area => {
                                this.logisticsAreaList.push({name: area.name, id: area.id});
                            });
                            //console.log(this.logisticsAreaList);
                        }
                    });
                } else {
                    this.option.id = '';
                    this.logisticsAreaList = [];
                }
            },


            getData () {
                this.tableLoading = true;
                this.$http.get('logistics/area/standard-areas', {params: this.option}).then(res => {
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
                this.fileList = [];
            },

            leadFormClose (){
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
                this.$refs.upload.submit();
            },

            handleBatchImportPreview (res, file) {
                if (res.code === 0) {
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
                if (type === 1) {
                    this.dialogTitle = '添加物流分区';
                    //this.logisticsTypeList = [];
                    this.areaForm.name = '';
                    this.areaForm.logisticsCode = '';
                    this.selectedCountry = [];
                    this.areaForm.countryResp = [];
                }
                if (type === 2) {
                    this.countryArea = row.countryCodeArr;
                    this.rowId = row.id;
                    this.selectedCountry = [];
                    this.areaForm.countryResp = [];
                    this.dialogTitle = '编辑物流分区';
                    this.areaForm.name = row.name;
                    this.areaForm.logisticsCode = row.logisticsCode;
                    this.editInitCode = this.areaForm.logisticsCode;

                    let list = this.countryArea.split(',');
                    this.getCountryList(row.logisticsCode).then(res => {
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

            //添加、编辑物流分区弹窗 获得国家列表
            getCountryList (logisticsCode) {
                let p = new Promise((resolve, reject) => {
                    this.countrysList = [];
                    this.countryLoading = true;
                    let obj = {
                        logisticsCode: logisticsCode,
                    };
                    this.$http.get('logistics/area/standard-country', {params: obj}).then(res => {
                        if (res.body.code === 0) {
                            let list = res.body.data.countryInfoResps;
                            for (let i = 0; i < list.length; i++) {
                                this.countrysList.push({
                                    name: list[i].countryName,
                                    code: list[i].countryCode,
                                    isExistWay: list[i].isExistWay
                                });
                            }
                            this.countrysListLen = this.countrysList.length;
                            resolve(this.countrysListLen);
                        } else {
                            this.countrysList = [];
                        }
                        this.countryLoading = false;
                    });
                });
                return p;
            },

            codeChange (code){
                this.countrysList = [];
                let logisticsCode = code, shippingAreaId = '', templateId = '';
                this.logisticsTypeList.forEach(item => {
                    if (logisticsCode === item.code) {
                        shippingAreaId = item.shippingAreaId;
                        templateId = item.templateId;
                    }
                });

                if (this.areaForm.logisticsCode === '') {
                    return false;
                }

                this.getCountryList(logisticsCode).then(res => {
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

            areaDialogSave (){
                if (this.areaForm.logisticsCode === '') {
                    this.$message.error('物流方式不能为空！');
                    return false;
                }
                if (this.areaForm.countryResp.length === 0) {
                    this.$message.error('请选择国家！');
                    return false;
                }

                if (this.windowType === 1) {
                    let params = {
                        name: this.areaForm.name,
                        logisticsCode: this.areaForm.logisticsCode,
                        type: 1,
                    };
                    this.$http.post('logistics/area/check-standard-name', params).then(res => {  //判断是否重名
                        if (res.body.code === 60047) {
                            this.$message.error('运费分区名称已存在!');
                            return false;
                        } else if (res.body.code === 0) {
                            let objForSave = {
                                name: this.areaForm.name,
                                logisticsCode: this.areaForm.logisticsCode,
                            };
                            let countryArr = [];
                            this.areaForm.countryResp.forEach(item => {
                                countryArr.push({"countryCode": item});
                            });
                            objForSave.countryResp = JSON.stringify(countryArr);
                            this.$http.post('logistics/area/add-standard-area', objForSave).then(res => {
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
                        };
                        this.$http.post('logistics/area/check-standard-name', params1).then(res => {  //判断是否重名
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
                };
                let countryArr = [];
                this.areaForm.countryResp.forEach(item => {
                    countryArr.push({"countryCode": item});
                });
                obj.countryResp = JSON.stringify(countryArr);
                this.$http.post('logistics/area/edit-standard-area', obj).then(res => {
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
