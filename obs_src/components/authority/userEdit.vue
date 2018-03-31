<template>
    <div class="user-edit">
        <el-form label-width="100px" :model="option" ref="postForm">
            <div class="el-container">
                <el-form-item label="用户名:">
                    <span>{{userInfo.username}}</span>
                </el-form-item>
                <el-form-item label="姓名:">
                    <span>{{userInfo.realname}}</span>
                </el-form-item>
                <el-form-item label="邮箱:">
                    <span>{{userInfo.email}}</span>
                </el-form-item>
                <el-form-item label="部门:">
                    <span>{{userInfo.department_name}}</span>
                </el-form-item>
                <el-form-item label="超级管理员" prop="is_super" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-radio-group v-model="option.is_super">
                        <el-radio :disabled="admin == '0' || defaultAdmin == '1'" label="1">是</el-radio>
                        <el-radio :disabled="admin == '0' || defaultAdmin == '1'" label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用户状态" prop="status" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-radio-group v-model="option.status">
                        <el-radio :disabled="editable" label="1">启用</el-radio>
                        <el-radio :disabled="editable" label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="数据权限" v-if="option.is_super == '0'">
                    <div>
                        <p>请勾选部门可以访问的站点</p>
                        <div class="department-site">
                            <div class="title">
                                <el-checkbox :disabled="editable" v-model="checkSite" :indeterminate="checkSiteMid"  @change="checkAll">全选</el-checkbox>
                            </div>
                            <el-checkbox-group v-model="option.sites" class="site" @change="changeSites">
                                <el-checkbox :disabled="editable" v-for="item in siteOpt" :key="item.site_code" :label="item.site_code">{{item.site_code}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <p v-if="option.sites.length > 0">请配置已选站点的分类访问权限</p>
                        <el-tabs class="department-tab" :value="current" v-if="option.sites.length > 0">
                            <el-tab-pane v-for="item in option.sites" :key="item" :label="item" :name="item">
                                <div class="department-site cat">
                                    <div class="title">
                                        <el-checkbox :disabled="editable" v-model="siteOpt[item].status" :indeterminate="siteOpt[item].status == 2" :true-label="1" :false-label="0"  @change="checkAllCat($event, 'tree_' + item, siteOpt[item])">全选</el-checkbox>
                                    </div>
                                    <el-tree :data="siteOpt[item].categorys" :props="props" show-checkbox :default-checked-keys="siteOpt[item].categorysSelected" node-key="id" :ref="'tree_' + item" ></el-tree>
                                </div>
                                <p>请为站点{{item}}配置角色</p>
                                <div class="department-site">
                                    <div class="title">
                                        <el-checkbox :disabled="editable" v-model="siteOpt[item].checkAll" :indeterminate="siteOpt[item].checkPart"  @change="checkAllRole($event, siteOpt[item])">全选</el-checkbox>
                                    </div>
                                    <el-checkbox-group v-model="siteOpt[item].rolesSelected" class="site" @change="changeRoles($event, siteOpt[item])">
                                        <el-checkbox :disabled="editable" v-for="role in siteOpt[item].roles" :key="role.role_id" :label="role.role_id">{{role.role_name}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-form-item>
            </div>
        </el-form>
        <div class="el-container text-center">
            <el-button type="primary" v-if="this.showAction_('base/admin/edit') && !editable" @click="save" v-loading="saveLoading" :disabled="saveLoading">保存</el-button>
            <el-button type="danger" @click="goback">返回</el-button>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let self = this;
        return {
            self: this,
            editable: this.$route.query.editable == '1',
            defaultAdmin: '',
            saveLoading: false,
            checkSite: false,
            checkSiteMid: false,
            siteOpt: {},
            current: '',
            userInfo: {
                username: '',
                realname: '',
                email: '',
                department_name: '',
            },
            option: {
                is_super: '',
                status: '',
                sites: [],
            },
            props: {
                label: (data, node) => {
                    return node.data.categoryMultiLang.categoryName;
                },
                children: 'children',
                disabled: (data, node) => {
                    return (!node.data.selected && node.data.parentNode) || self.editable;
                }
            }
        };
    },
    created () {
        this.getData();
    },
    computed: {
        admin () {
            return this.$store.getters.getAdmin;
        }
    },
    components: {
        'my-list': {
            template: `<div>
                            <div class="my-list-not-leaf" v-for="(item, index) in data" :key="item.id" v-if="!item.treeInfo.leaf">
                                <el-checkbox :disabled="true" :checked="true" :label="item.id">{{item.name}}</el-checkbox>
                                <name-list :data="item.children" :level="level + 1"></name-list>
                            </div>
                            <div class="my-list-leaf">
                                <el-checkbox :disabled="true" v-for="(item, index) in data" :key="item.id" v-if="item.treeInfo.leaf" :checked="true" :label="item.id">{{item.name}}</el-checkbox>
                            </div>
                        </div>`,
            props: ['data', 'level'],
            name: 'name-list',
        }
    },
    methods: {
        getData () {
            this.$http.get('base/admin/info', {params: {id: this.$route.query.id}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.userInfo = data.info;
                    this.option.is_super = data.info.is_super;
                    this.defaultAdmin = data.info.is_super;
                    this.option.status = data.info.status;

                    let temp = [],
                        tempObj = {};

                    data.siteCategorys.forEach(item => {
                        //
                        if (item.rolesSelected.length === item.roles.length) {
                            item.checkAll = true;
                            item.checkPart = false;
                        } else if (item.rolesSelected.length.length > 0 && item.rolesSelected.length < item.roles.length) {
                            item.checkAll = false;
                            item.checkPart = true;
                        } else {
                            item.checkAll = false;
                            item.checkPart = false;
                        }
                        //
                        if (item.selected) {
                            this.option.sites.push(item.site_code);
                        }
                        temp.push(item.site_code);
                        //
                        let length = item.categorysSelected.length;
                        item.status = 0;
                        if (length == 0) {
                            item.status = 0;
                        } else if (length < item.categoryLength) {
                            item.status = 2;
                        } else {
                            item.status = 1;
                        }
                        //
                        item.topLevel = [];
                        item.categorys.forEach(cat => {
                            item.topLevel.push(cat.id);
                        });

                        tempObj[item.site_code] = JSON.parse(JSON.stringify(item));
                    });
                    // data
                    this.siteOpt = tempObj;
                    this.maxSiteArr = temp;
                    // init
                    let siteLength = this.option.sites.length;
                    if (siteLength > 0) {
                        this.current = this.option.sites[0];
                    }
                    if (siteLength == data.siteCategorys.length) {
                        this.checkSite = true;
                        this.checkSiteMid = false;
                    } else if (siteLength < data.siteCategorys.length && siteLength > 0) {
                        this.checkSiteMid = true;
                        this.checkSite = false;
                    } else {
                        this.checkSiteMid = false;
                        this.checkSite = false;
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        save () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let params = {};
                    params.id = this.$route.query.id;
                    params.status = this.option.status;
                    params.is_super = this.option.is_super;

                    if (params.is_super == '0') {
                        let temp = [];
                        this.option.sites.forEach(code => {
                            let item = this.siteOpt[code];
                            let list = this.$refs['tree_' + item.site_code][0].getCheckedNodes();
                            let ids = [];
                            list.forEach(node => {
                                if (node.parentNode && !node.selected) {

                                } else {
                                    ids.push(node.id);
                                }
                            });
                            temp.push({
                                site_code: code,
                                categorys: ids,
                                roles: this.siteOpt[code].rolesSelected
                            });
                        });
                        params.siteCategorys = temp;
                    }
                    if (params.is_super == '0' && params.siteCategorys.length === 0) {
                        this.$message.warning('至少选择一个站点');
                        return false;
                    }

                    this.$http.post('base/admin/edit', params).then(res => {
                        this.saveLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.goback()
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.saveLoading = false;
                    });
                }
            })
        },
        changeSites (val) {
            let length = val.length;
            this.checkSite = length === this.maxSiteArr.length;
            this.checkSiteMid = length > 0 && length < this.maxSiteArr.length;
            this.current = val[0];
        },
        checkAll (val) {
            if (val.target.checked) {
                this.option.sites = this.maxSiteArr;
                this.current = this.option.sites[0];
            } else {
                this.option.sites = [];
            }
            this.checkSiteMid = false;
        },
        checkAllCat (val, refName, data) {
            if (val.target.checked) {
                data.status = 1;
                this.$refs[refName][0].setCheckedKeys(data.topLevel);
            } else {
                data.status = 0;
                this.$refs[refName][0].setCheckedKeys([]);
            }
        },
        checkAllRole (val, item) {
            if (val.target.checked) {
                item.roles.forEach(role => {
                    item.rolesSelected.push(role.role_id);
                });
            } else {
                item.rolesSelected = [];
            }
            item.checkPart = false;
        },
        changeRoles (val, item) {
            let length = val.length;
            item.checkAll = length === item.roles.length;
            item.checkPart = length > 0 && length < item.roles.length;
        },
        goback () {
            this.$router.push({
                name: 'authority_userList',
                params: {
                    back: 1,
                }
            });
        }
    }
}
</script>

<style lang="less">
    .user-edit {
        .department-site {
            border: 1px solid #ccc;
            padding: 30px 30px 30px 0;
            position: relative;
            margin-top: 30px;
            margin-bottom: 30px;

            &.cat {
                padding-left: 30px;
            }

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

        .el-tree {
            max-height: 600px;
            overflow-y: auto;
        }
    }
</style>