<!--编辑偏远库-->
<template>
    <div class="el-container">
        <p class="ware-name">偏远库名称： {{this.name}}</p>
        <el-tabs v-model="activePage" type="card" @tab-click="handleClick">
            <el-tab-pane label="偏远处理" name="page1">
                <div class="el-sub-container">
                    <el-table :data="tableData" v-loading="tableLoading">
                        <el-table-column prop="logisticsName" label="物流方式"></el-table-column>
                        <el-table-column prop="logisticsCode" label="物流编码"></el-table-column>
                        <el-table-column label="禁用">
                            <template scope="scope">
                                <el-checkbox v-model="scope.row.isValid"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="偏远费单价(CNY)">
                            <template scope="scope">
                                <el-input v-model="scope.row.price"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="最低偏远费(CNY)">
                            <template scope="scope">
                                <el-input v-model="scope.row.minPrice"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="text-right footer">
                        <el-button type="primary" @click="savePage1">保存</el-button>
                        <el-button type="danger" @click="$router.push({name:'logistics_remoteList'})">取消</el-button>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="位数管理" name="page2">
                <div class="el-sub-container">
                    <el-row>
                        <el-col :span="12">
                            <el-form inline :model="digit">
                                <el-form-item label="国家">
                                    <el-select v-model="digit.countryCode" clearable filterable>
                                        <el-option v-for="item in digit.countryList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="12">
                            <div class="text-right digit-search">
                                <el-button type="primary" icon="search" @click="digitSearch">筛 选</el-button>
                                <el-button type="danger" icon="close" @click="digitCancelSearch">取消筛选</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" class="text-right">
                            <el-button type="primary" icon="plus" @click="newArea">添加区域</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="digit.tableData" v-loading="digit.tableLoading" class="digit-table">
                        <el-table-column prop="id" label="ID" align="center"></el-table-column>
                        <el-table-column prop="countryName" label="国家" align="center"></el-table-column>
                        <el-table-column prop="digit" label="位数" align="center"></el-table-column>
                        <el-table-column label="修改时间" align="center">
                            <template scope="scope">
                                {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template scope="scope">
                                <el-button type="primary" @click="editArea(scope.row)" v-if="">编辑</el-button>
                                <el-button type="danger"  @click="deleteArea(scope.row)" v-if="">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="el-container last text-right">
                        <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="digit.pageNo" :page-sizes="[10, 20, 50]"
                                       :page-size="digit.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="digit.totalCount"></el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>

        <!--弹窗s-->
        <el-dialog :title="areaForm.title" v-model="areaForm.dialog" class="log-group" size="tiny" :before-close="areaDialogClose">
            <el-form :model="areaForm" ref="areaRef" :rules="areaRules">
                <el-form-item label="偏远库：">
                    {{this.name}}
                </el-form-item>
                <el-form-item prop="countryCode">
                    <el-select v-model="areaForm.countryCode" clearable filterable placeholder="请选择国家">
                        <el-option v-for="(item, index) in digit.countryList" :key="item.code" :value="item.code" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="digit" class="area-form-item">
                    <el-input v-model="areaForm.digit" :maxlength= '20' placeholder="请输入位数，多个位数以半角“;”分开"></el-input>
                </el-form-item>
                <div class="text-right footer">
                    <el-button type="primary" @click="areaSave">确定</el-button>
                    <el-button type="danger" @click="areaDialogClose">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!--弹窗e-->
    </div>
</template>

<script>
    import Vue from 'vue'
    import logistics from './js/logistics'
    Vue.use(logistics);
    export default {
        data () {
            return {
                self: this,
                activePage: 'page1',
                id: this.$route.query.id || '',
                name: this.$route.query.name || '',
                tableData: [],
                tableLoading: false,
                digit: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                    countryCode: '',
                    countryList: [],
                    tableData: [],
                    tableLoading: false,
                },
                areaForm: {
                    dialog: false,
                    title: '',
                    windowType: '',
                    countryCode: '',
                    digit: '',
                    id: '',
                    initCountryCode: ''
                },
                areaRules: {
                    countryCode: [{required: true, message: '请选择国家', trigger: 'change'}],
                    digit: [{required: true, message: '请输入位数', trigger: 'blur'}],
                }
            }
        },
        created() {
            this.initPag1();
        },
        mounted () {
            this.digit.countryList = this.getCounryListFun();
        },
        methods: {
            initPag1 (){
                this.$http.get('logistics/remote-info/info', {params: {remoteId: this.id}}).then(res => {
                        if (res.body.code === 0) {
                            let list = res.body.data.remoteLogisticsList;
                            if (list !== undefined) {
                                for (let i = 0; i < list.length; i++) {
                                    if (list[i].isValid === 0) {
                                        list[i].isValid = true;
                                    } else if ((list[i].isValid === 1)) {
                                        list[i].isValid = false;
                                    }
                                }
                                this.tableData = list;
                            }
                        } else {
                            this.tableData = [];
                        }
                        this.isDataLoading = false;
                    },
                    (err) => {
                        this.$notify.error({
                            title: err.body.name || '错误',
                            message: err.body.message || '发生错误'
                        });
                    })
            },

            savePage1 (){
                let verifyRes = this.verifyPage1();
                let listBegin = this.tableData;
                let len = listBegin.length;
                if (!verifyRes) {
                    return false;
                }
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        let isdisable = listBegin[i].isValid;
                        let price = listBegin[i].price;
                        let minPrice = listBegin[i].minPrice;
                        //console.log(isdisable);
                        if (isdisable) {
                            if (price !== '' || minPrice !== '') {
                                this.$message({
                                    type: 'error',
                                    message: '偏远库中的物流有且只有一种偏远处理方式（禁用或收取偏远费）'
                                });
                                return false;
                            }
                        }
                        if (!isdisable) {
                            if (price === '' || minPrice === '') {
                                this.$message({
                                    type: 'error',
                                    message: '偏远库中的物流有且只有一种偏远处理方式（禁用或收取偏远费）'
                                });
                                return false;
                            }
                        }
                    }
                    for (let i = 0; i < len; i++) {
                        delete listBegin[i].remoteName;
                        delete listBegin[i].upType;
                        delete listBegin[i].updateTime;
                        delete listBegin[i].updateUser;
                        delete listBegin[i].createUser;
                        delete listBegin[i].createTime;
                        if (listBegin[i].isValid) {
                            listBegin[i].isValid = 0;
                        } else {
                            listBegin[i].isValid = 1;
                        }
                        if (listBegin[i].price === '') {
                            listBegin[i].price = null;
                        }
                        if (listBegin[i].minPrice === '') {
                            listBegin[i].minPrice = null;
                        }
                    }
                }
                let list = JSON.stringify(listBegin);
                this.$http.post('logistics/remote-info/edit', {list: list}).then(res => {
                        if (res.body.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    },
                    (err) => {
                        this.$notify.error({
                            title: err.body.name || '错误',
                            message: err.body.message || '发生错误'
                        });
                    });
                this.initPag1(); //修改保存后重新获取数据显示在页面上
                this.$router.push({name: 'logistics_remoteList'});
            },

            verifyPage1 () {
                let  reg = /^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/,
                     errMsg = '请输入大于等于0且小于99999.99的数字，保留2位小数。',
                     table = this.tableData,
                     verifyRes = true;

                if (table.length === 0) {
                    verifyRes = false;
                    return verifyRes;
                }

                for (let i=0; i<table.length; i++) {
                    if (table[i].price) {
                        let price = Number(table[i].price);
                        if (!reg.test(table[i].price)  || price > 99999.99) {
                            this.$message.error(errMsg);
                            verifyRes = false;
                            break;
                        }
                    } else if (table[i].minPrice) {
                        let minPrice = Number(table[i].minPrice);
                        if (!reg.test(table[i].minPrice) || minPrice > 99999.99) {
                            this.$message.error(errMsg);
                            verifyRes = false;
                            break;
                        }
                    }
                }
                return verifyRes;
            },

            handleClick (tab, event) {
                this.digit.countryCode = '';
                if (tab.name === 'page2' && this.digit.tableData.length === 0) {
                    this.initPage2();
                }
            },

            initPage2 () {
                let params = {
                    pageNo: this.digit.pageNo,
                    pageSize: this.digit.pageSize,
                    countryCode: this.digit.countryCode
                };
                //console.log(params);
                this.digit.tableLoading = true;
                this.$http.get('logistics/remote-num/list', {params: params}).then( res => {
                    this.digit.tableLoading = false;
                    if (res.body.code === 0 && res.body.data) {
                        this.digit.tableData = res.body.data.list;
                        this.digit.totalCount = res.body.data.totalCount;
                    } else {
                        this.digit.tableData = [];
                        this.digit.totalCount = 0;
                    }
                });
            },

            digitSearch () {
                this.initPage2();
                this.digit.pageNo = 1;
            },

            digitCancelSearch () {
                this.digit.countryCode = '';
                this.digitSearch();
            },

            ChangePage (val) {
                this.digit.pageNo = val;
                this.initPage2();
            },

            ChangePageSize (val) {
                this.digit.pageSize = val;
                this.initPage2();
            },

            newArea () {
                this.areaForm.dialog = true;
                this.areaForm.windowType = 1;
                this.areaForm.title = '添加区域';
                this.areaForm.countryCode = '';
                this.areaForm.digit = '';
            },

            editArea (row) {
                //console.log(row);
                this.areaForm.dialog = true;
                this.areaForm.windowType = 2;
                this.areaForm.id = row.id;
                this.areaForm.title = '编辑区域';
                this.areaForm.countryCode = row.countryCode;
                this.areaForm.initCountryCode = row.countryCode;
                this.areaForm.digit = row.digit;
            },

            areaDialogClose () {
                this.$refs['areaRef'].resetFields();
                this.areaForm.dialog = false;
            },

            areaSave () {
                let verifyRes = '';
                let isExistSome = false;
                this.$refs['areaRef'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    verifyRes = this.verifyPage2();
                    if (!verifyRes) {
                        this.$message.error("位数为正整数或多个以分号分割的正整数！");
                        return false;
                    }
                    let type = this.areaForm.windowType;
                    let table = this.digit.tableData;
                    if (type === 1) {  // 新增保存
                        let params = {
                            digit: (this.areaForm.digit.replace(/\ +/g,"")).replace(/[\r\n]/g,""),
                            countryCode: this.areaForm.countryCode
                        };
                        if (table.length === 0) {
                            this.newDiginFun(params);
                        } else {
                            for (let i=0; i<table.length; i++) {
                                if (params.countryCode === table[i].countryCode) {
                                    isExistSome = true;
                                    break;
                                }
                            }
                        }
                        if (isExistSome) {
                            this.$message.error("该国家已经设置了位数");
                            return false;
                        } else {
                            this.newDiginFun(params);
                        }
                    } else {   // 编辑保存
                        let params = {
                            id: this.areaForm.id,
                            digit: (this.areaForm.digit.replace(/\ +/g,"")).replace(/[\r\n]/g,""),
                            countryCode: this.areaForm.countryCode
                        };
                        if (this.areaForm.initCountryCode === this.areaForm.countryCode) {
                            this.editDiginFun(params);
                        } else {
                            for (let i=0; i<table.length; i++) {
                                if (params.countryCode === table[i].countryCode) {
                                    isExistSome = true;
                                    break;
                                }
                            }
                        }
                        if (isExistSome) {
                            this.$message.error("该国家已经设置了位数");
                            return false;
                        } else {
                            this.editDiginFun(params);
                        }
                    }
                })
            },

            newDiginFun (params) {
                this.$http.post('logistics/remote-num/add', params).then( res => {
                    if (res.body.code === 0) {
                        this.$message.success("保存成功！");
                        this.areaDialogClose();
                        this.initPage2();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            editDiginFun (params) {
                this.$http.post('logistics/remote-num/edit', params).then( res => {
                    if (res.body.code === 0) {
                        this.$message.success("保存成功！");
                        this.areaDialogClose();
                        this.initPage2();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            verifyPage2 () {
                let verifyRes = true;
                let numDigit = (this.areaForm.digit.replace(/\ +/g,"")).replace(/[\r\n]/g,"");
                let tempArr1 = numDigit.split(';');
                let tempArr2 = [];
                let reg = /^[1-9]\d*$/;

                if (tempArr1[tempArr1.length - 1] === '') {
                    tempArr2 = tempArr1.slice(0, -1);
                } else {
                    tempArr2 = tempArr1.slice(0);
                }
                for (let i=0; i< tempArr2.length; i++) {
                    if (!reg.test(tempArr2[i])) {
                        verifyRes = false;
                        break;
                    }
                }
                return verifyRes;
            },

            deleteArea (row) {
                this.$confirm('是否删除该项?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('logistics/remote-num/delete', {id: row.id}).then(res => {
                        if (res.body.code === 0) {
                            let index = this.digit.tableData.indexOf(row);
                            this.digit.tableData.splice(index, 1);
                            this.digit.totalCount--;
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
        }
    }
</script>

<style lang="less" scoped>
    .ware-name {
        margin: 10px 0 20px 0;
    }
    .footer {
        margin-top: 20px;
    }
    .digit-search {
        margin-top: 10px;
    }
    .digit-table {
        margin-top: 10px;
    }
    .area-form-item {
        margin-top: 25px;
    }

</style>




