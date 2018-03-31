<!-- 角色新增/编辑 -->
<template>
    <div class="role-edit" v-loading="loading">
        <div class="el-container">
            <el-form label-width="100px" :model="option" ref="postForm">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="角色名" prop="role_name" :rules="[{required: true, message: '该项不能为空'}]">
                            <el-input v-model="option.role_name"></el-input>
                        </el-form-item>
                        <el-form-item label="角色状态" prop="status" v-if="id" :rules="[{required: '该项不能为空'}]">
                            <el-radio-group v-model="option.status">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="站点" prop="site_code" v-if="!isAdmin" :rules="[{required: true, message:'该项不能为空'}]">
                            <el-select v-model="option.site_code" @change="changeSite">
                                <el-option v-for="(item, index) in tableData" :key="index" :value="item.site_code" :label="item.site_code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="功能权限">
                    <div class="department-site">
                        <div class="title">
                            <el-checkbox @change="checkAll" :indeterminate="checkAllStatus" v-model="checkAllFlag">全选</el-checkbox>
                        </div>
                        <div>
                            <el-checkbox-group v-model="checkedList" @change="changeGroup">
                                <el-tabs v-model="activeName" @tab-click="tabClick">
                                    <el-tab-pane v-for="(item, index) in menuList" :key="item.id" :label="item.name" :name="String(item.id)">
                                        <div>
                                            <el-checkbox :label="item.id" @change="checkModule($event, item)">全选</el-checkbox>
                                        </div>
                                        <my-list :data="item.children" :level="1" @checkCat="checkModule"></my-list>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-checkbox-group>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="el-container text-center">
            <el-button type="primary" v-if="this.showAction_('base/role/edit')" @click="save" v-loading="postLoading" :disabled="postLoading">保存</el-button>
            <el-button type="danger" @click="goback">取消</el-button>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            loading: true,
            id: this.$route.query.id || '',
            checkAllStatus: false,
            checkAllFlag: false,
            activeName: '',
            isAdmin: false,
            checkedList: [],
            option: {
                role_name: '',
                site_code: '',
                status: null,
            },
            menuList: [],
            totalIdList: [],
            groupList: {},
            tableData: {},
            postLoading: false
        };
    },
    created () {
        this.getOpt();
    },
    components: {
        'my-list': {
            template: `<div>
                            <div class="my-list-not-leaf" v-for="(item, index) in data" :key="item.id" v-if="!item.treeInfo.leaf">
                                <el-checkbox :label="item.id" @change="checkCat($event, item)">{{item.name}}</el-checkbox>
                                <name-list :data="item.children" :level="level + 1" @checkCat="checkCat"></name-list>
                            </div>
                            <div class="my-list-leaf">
                                <el-checkbox v-for="(item, index) in data" :key="item.id" v-if="item.treeInfo.leaf" :label="item.id" @change="checkCat($event, item)">{{item.name}}</el-checkbox>
                            </div>

                        </div>`,
            props: ['data', 'level'],
            name: 'name-list',
            methods: {
                checkCat: function(event, params) {
                    this.$emit('checkCat', event, params);
                }
            }
        }
    },
    methods: {
        tabClick () {
            let defaultGroupList;
            let count = 0;
            let groupIndex = this.activeName * 1;
            for (let i in this.menuList) {
                if (this.menuList[i].id == groupIndex) {
                    defaultGroupList = this.menuList[i].childList;
                    break;
                }
            }
            for (let j in defaultGroupList) {
                let id = defaultGroupList[j];
                if (this.checkedList.indexOf(id) !== -1) {
                    count++;
                }
            }
            if (count == defaultGroupList.length) {
                if (this.checkedList.indexOf(groupIndex) == -1) {
                    this.checkedList.push(groupIndex);
                }
            }
        },
        menuOpt () {
            this.activeName = String(this.menuList[0].id);
            // 勾选交互配置
            this.totalIdList = this.getTotalIdList(this.menuList, []);
            this.menuList = this.getChildId(this.menuList);
            this.menuList.forEach(group => {
                this.groupList[group.id] = this.getTotalIdList(group.children, []);
            });
        },
        getOpt () {
            this.$http.get('base/role/forward').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.isAdmin = data.isSuperAdmin;
                    data.sitePrivileges.forEach(item => {
                        this.$set(this.tableData, item.site_code, item);
                    });

                    if (this.isAdmin) {
                        this.menuList = data.sitePrivileges[0].menuList;
                        this.menuOpt();
                    }

                    if (this.$route.query.id) {
                        this.getData();
                    } else {
                        this.loading = false;
                    }

                }
            });
        },
        getData () {
            if (this.id) {
                this.$http.get('base/role/info', {params: {id: this.id}}).then(res => {
                    this.loading = false;
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        this.checkedList = data.privileges.map(item => {return Number(item)});
                        this.option.role_name = data.role_name;
                        this.option.site_code = data.site_code;
                        this.option.status = Number(data.status);

                        if (this.isAdmin) {
                            if (this.checkedList.length > 0 && this.checkedList.length < this.totalIdList.length) {
                                this.checkAllStatus = true;
                            } else if (this.checkedList.length === 0) {
                                this.checkAllStatus = false;
                                this.checkAllFlag = false;
                            } else {
                                this.checkAllFlag = true;
                                this.checkAllStatus = false;
                            }
                        }
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }
        },
        save () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let params = {},
                        src = 'base/role/add';
                    params.privileges = this.checkedList.join(',');
                    params.role_name = this.option.role_name;
                    params.site_code = this.option.site_code;

                    if (params.privileges == '') {
                        this.$message.warning('该角色所拥有的功能权限集合不能为空');
                        return false;
                    }

                    if (this.id) {
                        params.id = this.id;
                        params.status = this.option.status;
                        src = 'base/role/edit';
                    }

                    this.postLoading = true;
                    this.$http.post(src, params).then(res => {
                        this.postLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.goback();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoading = false;
                    });
                }
            });
        },
        checkAll (val) {
            if (val.target.checked) {
                this.checkedList = this.totalIdList;
            } else {
                this.checkedList = [];
            }
            this.checkAllStatus = false;
        },
        checkModule (event, val) {
            let groupIndex = this.activeName;
            let groupList = this.groupList[groupIndex];

            let checkStatus = event.target.checked;
            let subList = [];
            if (val.childList) {
                subList = val.childList;
            }

            if (checkStatus) {
                for (let i in subList) {
                    if (this.checkedList.indexOf(subList[i]) === -1) {
                        this.checkedList.push(subList[i]);
                    }
                }
                this.tabClick();
            } else {
                for (let j in subList) {
                    if (this.checkedList.indexOf(subList[j]) !== -1) {
                        let delIndex = this.checkedList.indexOf(subList[j]);
                        this.checkedList.splice(delIndex, 1);
                    }
                }

                let tempIndex = this.checkedList.indexOf(groupIndex * 1);
                if (tempIndex !== -1) {
                    this.checkedList.splice(tempIndex, 1);
                }
            }
        },
        changeGroup () {
            if (this.checkedList.length > 0 && this.checkedList.length < this.totalIdList.length) {
                this.checkAllStatus = true;
            } else if (this.checkedList.length === 0) {
                this.checkAllStatus = false;
                this.checkAllFlag = false;
            } else {
                this.checkAllFlag = true;
                this.checkAllStatus = false;
            }
        },
        changeSite (val) {
            this.menuList = this.tableData[val].menuList;
            this.menuOpt();
            this.tabClick();

            if (this.checkedList.length > 0 && this.checkedList.length < this.totalIdList.length) {
                this.checkAllStatus = true;
                this.checkAllFlag = false;
            } else if (this.checkedList.length === 0) {
                this.checkAllStatus = false;
                this.checkAllFlag = false;
            } else {
                this.checkAllFlag = true;
                this.checkAllStatus = false;
            }
        },
        getTotalIdList (obj, tempArr) {
            for (let i in obj) {
                tempArr.push(obj[i].id);

                if (typeof obj[i].children === 'object') {
                    this.getTotalIdList(obj[i].children, tempArr);
                }
            }

            return tempArr;
        },
        getChildId (menuList) {
            for (let i in menuList) {
                let item = menuList[i];
                if (item.children && item.children.length > 0) {
                    item.childList = this.getTotalIdList(item.children, []);
                    this.getChildId(item.children)
                }

            }

            return menuList;
        },
        goback () {
            this.$router.push({
                name: 'authority_roleList',
                params: {
                    back: 1,
                }
            })
        },
    }
}
</script>

<style lang="less">
    .role-edit {
        .department-site {
            border: 1px solid #ccc;
            padding: 30px;
            position: relative;
            margin-top: 30px;
            margin-bottom: 30px;

            .title {
                position: absolute;
                line-height: 36px;
                top: -18px;
                left: 50px;
                background: #fff;
                padding: 0 15px;
            }

            .el-checkbox-group {
                &.site {
                    .el-checkbox {
                        margin-left: 60px;
                    }
                }
            }

        }

        .my-list-leaf {
            margin-left: 45px;
            .el-checkbox {
                margin-left: 15px;
            }
        }

        .my-list-not-leaf {
            margin: 10px 0 10px 45px;
            .el-checkbox {
                margin-left: 15px;
            }
        }
    }

</style>