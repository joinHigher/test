<!-- 真实仓管理 -->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filter" ref="filterForm" :rules="rules">
                <el-form-item label="真实仓：">
                    <!-- <el-input v-model="filter.realWhCode" placeholder=""></el-input> -->
                    <!-- <el-autocomplete v-model.trim="filter.realWhCode" :fetch-suggestions="querySearch" @select="handleSelectRealWhCode" :disabled="!editDlg.isAdd"></el-autocomplete> -->
                    <span class="ac-real-list-wrap">
                        <el-autocomplete v-model="filter.name" placeholder="真实仓名称/代码" :fetch-suggestions="querySearch" @select="handleSelectRealWhCode" icon="circle-close" :on-icon-click="handleRealListDelIconClick"></el-autocomplete>
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                </el-form-item>
                <el-form-item label="接站审批负责人">
                    <el-input v-model="filter.userName" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <!-- :disabled="!filter.realWhCode || (filter.name != filter.nameTemp)" -->
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>
            <div class="el-sub-container text-right pt-0">
                <el-button v-if="this.showAction_('stock/real-warehouse/add')" type="primary" @click="handleBtnAddClick"><i class="el-icon-plus"></i> 添加管理仓库</el-button>
            </div>
            <el-table :data="tableData" v-loading="isDataLoading" border>
                <el-table-column prop="realWhCode" label="真实仓代码"></el-table-column>
                <el-table-column prop="realWhName" label="真实仓名称"></el-table-column>
                <el-table-column label="接站审批负责人">
                    <template scope="scope">
                        <div v-if="scope.row.siteUser">
                            <span v-for="(item, index) in scope.row.siteUser" :key="index">{{ index == 0 ? '' : ',' }}{{ item.realName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="活动占用库存审批负责人">
                    <template scope="scope">
                        <div v-if="scope.row.activityUser">
                            <span v-for="(item, index) in scope.row.activityUser" :key="index">{{ index == 0 ? '' : ',' }}{{item.realName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('stock/real-warehouse/edit')" type="primary" size="small" @click="handleBtnEditClick(scope.$index)">修改权限</el-button>
                        <el-button v-if="self.showAction_('stock/real-warehouse/delete')" type="danger" size="small" @click="handleBtnDelClick(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="filter.page" :page-sizes="[10, 20, 50]" :page-size="filter.page_size" layout="total, sizes, prev, pager, next, jumper" :total="filter.total_count"></el-pagination>
            </div>
        </div>

        <!-- 弹窗S -->
        <el-dialog :title="editDlg.isAdd ? '添加管理仓库' : '修改权限'" v-model="editDlg.isDlgShow" size="tiny" class="edit-dlg">
            <div class="el-container">
                <div class="el-sub-container">
                    <span>真实仓：</span>
                    <!-- <el-autocomplete v-model.trim="editDlg.realWhCode" :fetch-suggestions="querySearch" @select="handleSelectRealWhCode" :disabled="!editDlg.isAdd"></el-autocomplete> -->
                    <span v-if="editDlg.isAdd">
                        <span class="ac-real-list-wrap">
                            <el-autocomplete v-model="editDlg.name" placeholder="真实仓名称/代码" :fetch-suggestions="querySearch" @select="handleSelectRealWhCode" icon="circle-close" :on-icon-click="handleRealListDelIconClick" :disabled="!editDlg.isAdd"></el-autocomplete>
                            <i class="el-icon-caret-bottom"></i>
                        </span>
                        <span v-show="editDlg.name && !editDlg.realWhCode" class="color-danger">请输入正确的真实仓</span>
                    </span>
                    <span v-else>
                        <div class="el-input"><input type="text" class="el-input__inner" :value="editDlg.realWhName + '（' + editDlg.realWhCode + '）'" readonly></div>
                    </span>
                </div>

                <div class="el-sub-container">
                    <span>设置审批负责人：</span>
                    <el-checkbox v-model="editDlg.isUnifiedSettings" @change="setUnifiedSettings">统一设置审批负责人</el-checkbox>
                </div>
                <div class="el-sub-container">

                    <el-tabs v-model="editDlg.userType" type="card">
                        <el-tab-pane label="接站审批负责人" name="siteUser">
                            <el-transfer v-model="editDlg[editDlg.userType]" :data="editDlg.userData" filterable :titles="['可选择', '已选择']" :button-texts="['删除', '添加']" @change="setUnifiedSettings"></el-transfer>
                        </el-tab-pane>
                        <el-tab-pane label="活动占用审批负责人" name="activityUser">
                            <el-transfer v-model="editDlg[editDlg.userType]" :data="editDlg.userData" filterable :titles="['可选择', '已选择']" :button-texts="['删除', '添加']" @change="setUnifiedSettings"></el-transfer>
                        </el-tab-pane>
                    </el-tabs>

                </div>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="editDlg.isLoading" @click="handleBtnOkClick">确认</el-button>
                <el-button type="danger" @click="editDlg.isDlgShow = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->

    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableData: [],
            isDataLoading: false,
            filter: {
                page: 1,
                page_size: 10,
                total_count: 0,
                userName: '',
                realWhCode: '',
                realWhCodeTemp: '',
                name: '',
                nameTemp: '',
            },
            rules: {
                realWhCode: [{ required: true, message: '请输入该选项', trigger: 'blur' }]
            },
            realWhCodeList: [],
            editDlg: {
                index: -1,
                isDlgShow: false,
                isLoading: false,
                isUnifiedSettings: false,
                isAdd: true,
                realWhCode: '',
                realWhCodeTemp: '',
                name: '',
                nameTemp: '',
                realWhName: '',
                filterText: '',
                userType: 'siteUser',
                userData: [],
                userDataObj: {},
                siteUser: [],
                activityUser: [],
            },
            siteCodes: {},
        };
    },
    computed: {
        isRealWhCodeHasError() {
            return this.editDlg.realWhCode == '';
        }
    },
    created () {
        this.getSiteCodes();
        this.getListData();
        this.getRealWhCodeList();

    },
    methods: {
        getListData (page) {
            let params = {};
            if (page) {
                this.filter.page = page;
            }
            params = Object.assign({}, this.filter);
            // console.log(params)
            // return
            delete params.total_count;
            delete params.realWhCodeTemp;
            delete params.name;
            delete params.nameTemp;
            this.isDataLoading = true;
            this.$http.get('stock/real-warehouse/list', { params: params }).then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list ? res.body.data.list: [];
                    this.filter.total_count = res.body.data.totalCount;
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
            });
        },
        getRealWhCodeList() {
            this.$http.get('stock/real-warehouse/public-whcodes').then((res) => {
                if (res.body.code === 0) {
                    let tempArr = [];
                    res.body.data.forEach((item) => {
                        item.whCode && tempArr.push({
                            value: item.name + '（' + item.whCode + '）',
                            code: item.whCode
                        });
                    });
                    this.realWhCodeList = tempArr;
                }
            });
        },
        getSiteCodes () {
            this.$http.get('base/public/site-list').then(res => {
                let obj = {};
                if (res.body.code !== 0) {
                    return;
                }
                Array.isArray(res.body.data) && res.body.data.forEach(item => {
                    obj[item.code] = item.name;
                });
                this.$set(this, 'siteCodes', obj);
            });
        },
        getUserList() {
            if (this.editDlg.userData.length > 0) {
                return;
            }
            this.$http.get('base/admin/public-base-list').then((res) => {
                if (res.body.code === 0) {
                    let userData = [];
                    res.body.data.forEach((item) => {
                        userData.push({
                            key: parseInt(item.id),
                            label: item.realname,
                            disabled: false
                        });
                        this.editDlg.userDataObj[item.id] = {
                            userId: parseInt(item.id),
                            realName: item.realname
                        };
                    });
                    this.editDlg.userData = userData;
                }
          });
        },
        handleBtnCancelFilterClick() {
            this.filter.realWhCode = this.filter.realWhCodeTemp = '';
            this.filter.name = this.filter.nameTemp = '';
            this.filter.page = 1;
            this.filter.userName = '';
        },
        changePage(value) {
            this.filter.page = value;
            this.getListData();
        },
        changePageSize(value) {
            this.filter.page_size = value;
            this.getListData();
        },
        setUnifiedSettings() {
            if(!this.editDlg.isUnifiedSettings) { return; }
            switch(this.editDlg.userType){
                case 'siteUser':
                    this.editDlg.activityUser = this.editDlg.siteUser;
                break;
                case 'activityUser':
                    this.editDlg.siteUser = this.editDlg.activityUser;
                break;
            }
        },
        initEditDlg() {
            this.editDlg.isUnifiedSettings = false;
            this.editDlg.siteUser = [];
            this.editDlg.activityUser = [];
            this.getUserList();
        },
        handleBtnAddClick() {
            this.editDlg.index = -1;
            this.editDlg.isDlgShow = true;
            this.editDlg.isAdd = true;
            this.editDlg.realWhCode = '';
            this.editDlg.name = '';
            this.editDlg.realWhName = '';
            this.initEditDlg();
        },
        handleBtnEditClick(index) {
            let item = this.tableData[index];
            // console.log(item)
            // console.log(index)
            // return;
            this.editDlg.index = index;
            this.editDlg.isAdd = false;
            this.editDlg.realWhCode = item.realWhCode;
            this.editDlg.realWhName = item.realWhName;
            this.initEditDlg();
            this.$nextTick(function(){
                let siteUser = [];
                item.siteUser && item.siteUser.forEach((obj) => {
                    siteUser.push(obj.userId);
                });
                this.editDlg.siteUser = siteUser;
                let activityUser = [];
                item.activityUser && item.activityUser.forEach((obj) => {
                    activityUser.push(obj.userId);
                });
                this.editDlg.activityUser = activityUser;
                this.editDlg.isDlgShow = true;
            })
            // console.log(this.editDlg);
        },
        handleBtnDelClick(index) {
            let item = this.tableData[index];
            if (!item.realWhCode) {
                return;
            }
            this.$confirm('是否将该仓库从管理列表中删除？', '删除真实仓', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action !== 'confirm') {
                        done();
                        return;
                    }
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    this.$http.post('stock/real-warehouse/delete', { realWhCodeList: [item.realWhCode] }).then(res => {
                        // console.log(res);
                        if (res.body.code == 0) {
                            this.$message.success(res.body.message || '删除成功');
                            this.tableData.splice(index, 1);
                            done();
                            instance.confirmButtonLoading = false;
                        } else {
                            this.$message.error(res.body.message || res.body.previous.message || '删除失败');
                            done();
                            instance.confirmButtonLoading = false;
                        }
                    },
                    (err) => {
                        this.$message.error(err.body.message || '删除失败');
                        done();
                        instance.confirmButtonLoading = false;
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleBtnOkClick() {
            let params = {
                realWhCode: '',
                userReqList: []
            };
            let siteUserNum = 0;
            let activityUserNum = 0;
            if (!this.editDlg.realWhCode) {
                this.$message.warning('请选择真实仓');
                return;
            }

            let flag = this.realWhCodeList.some(e => e.realWhCode === this.editDlg.realWhCode);
            if (flag) {
                this.$message.warning('添加的真实仓重复，请重新选择');
                return;
            }

            params.realWhCode = this.editDlg.realWhCode;
            if (this.editDlg.siteUser.length) {
                let siteUserArr = [];
                this.editDlg.siteUser.forEach((item) => {
                    if (this.editDlg.userDataObj[item]) {
                        let obj = { approveType: 1 };
                        // if (!this.editDlg.isAdd) {
                        //     obj.realWhName = this.editDlg.realWhName;
                        // }
                        siteUserArr.push(Object.assign({}, this.editDlg.userDataObj[item], obj));
                        siteUserNum++;
                    }
                });
                params.userReqList = params.userReqList.concat(siteUserArr);
            }
            if (!this.editDlg.siteUser.length || siteUserNum < 1) {
                this.$message({
                    message: '接站审批负责人不能为空，请至少选择一个负责人',
                    type: 'warning'
                });
                return;
            }
            if (this.editDlg.activityUser.length) {
                let activityUserArr = [];
                this.editDlg.activityUser.forEach((item) => {
                    if (this.editDlg.userDataObj[item]) {
                        let obj = { approveType: 2 };
                        // if (!this.editDlg.isAdd) {
                        //     obj.realWhName = this.editDlg.realWhName;
                        // }
                        activityUserArr.push(Object.assign({}, this.editDlg.userDataObj[item], obj));
                        activityUserNum++;
                    }
                });
                params.userReqList = params.userReqList.concat(activityUserArr);
            }
            if (!this.editDlg.activityUser.length || activityUserNum < 1) {
                this.$message({
                    message: '活动占用库存审批负责人不能为空，请至少选择一个负责人',
                    type: 'warning'
                });
                return;
            }
            // console.log(this.editDlg);
            // console.log(params);
            // return;
            // params = [1, 2];
            this.editDlg.isLoading = true;
            this.$http.post('stock/real-warehouse/' + (this.editDlg.isAdd ? 'add' : 'edit'),  params).then(res => {
                this.editDlg.isLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message);
                    return;
                }
                this.$message.success(res.body.message || '保存成功');
                this.getListData();
                this.editDlg.isDlgShow = false;
            },
            (err) => {
                this.$notify.error(err.body.message);
                this.editDlg.isLoading = false;
            });
        },

        // 真实仓搜索
        querySearch(queryString, cb) {
            let items = this.realWhCodeList;
            let results = null;
            if (!this.editDlg.isDlgShow) {
                results = (queryString && this.filter.name != this.filter.nameTemp) ? items.filter(this.createFilter(queryString)) : items;
            } else {
                results = (queryString && this.editDlg.name != this.editDlg.nameTemp) ? items.filter(this.createFilter(queryString)) : items;
            }

            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        handleSelectRealWhCode(item) {
            if (!this.editDlg.isDlgShow) {
                this.filter.realWhCodeTemp = this.filter.realWhCode = item.code;
                this.filter.nameTemp = this.filter.name;
            } else {
                this.editDlg.realWhCodeTemp = this.editDlg.realWhCode = item.code;
                this.editDlg.nameTemp = this.editDlg.name;
            }
            // this.$refs.filterForm.validate();
        },
        handleRealListDelIconClick() {
            if (!this.editDlg.isDlgShow) {
                this.filter.name = this.filter.nameTemp = this.filter.realWhCode = this.filter.realWhCodeTemp = '';
            } else {
                this.editDlg.name = this.editDlg.nameTemp = this.editDlg.realWhCode = this.editDlg.realWhCodeTemp = '';
            }
        },

        handleBtnFilterDlgClick() {

        }
    }
}
</script>
<style lang="less">
.el-form-item { margin-bottom: 10px; }
.pt-0,
.el-container .pt-0 { padding-top: 0; }
.edit-dlg {
    .el-dialog--tiny { min-width: 564px; }
    .el-select,
    .el-autocomplete { width: auto; }
    .el-input { width: 200px; margin-right: 10px; }
}
.ac-real-list-wrap { display: block; position: relative;
    .el-icon-circle-close { visibility: hidden; z-index: 5; }
    .el-input { z-index: 2; }
    input { background: none; }
    > i { position: absolute; top: 50%; right: 10px; transform: translateY(-50%); color: #bfcbd9; font-size: 12px; z-index: 1; }
    &:hover {
        > i { visibility: hidden; }
        .el-icon-circle-close { visibility: visible; }
    }
    .edit-dlg & { display: inline-block; }
    .edit-dlg & > i { right: 20px; }
}
</style>

