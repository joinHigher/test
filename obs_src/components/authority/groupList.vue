<template>
    <div>
        <div class="el-container">
            <el-tabs v-model="tabPage" @tab-click="handleClick">
                <el-tab-pane label="站点列表" name="1">
                    <div class="el-container">
                        <div class="el-sub-container">
                            <div class="text-right">
                                <el-button type="primary" v-if="self.showAction_('base/site/add')" @click="addSite" v-loading="addLoading" :disabled="addLoading">添加</el-button>
                            </div>
                        </div>
                        <el-table :data="tableData" border class="menu-list-table" v-loading="tableLoading">
                            <el-table-column label="站点名称">
                                <template scope="scope">
                                    <div :class="'level' + scope.row.treeInfo.level">
                                         <a v-if="!scope.row.treeInfo.leaf" class="tree-btn" @click="toggle(scope.row, scope.$index, scope.store)"><i :class="{'el-icon-plus': !scope.row.isToggle, 'el-icon-minus': scope.row.isToggle}"></i>{{scope.row.name}}</a>
                                         <span v-else>{{scope.row.name}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="code" label="站点简码"></el-table-column>
                            <el-table-column prop="domain" label="域名"></el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button type="primary" size="small" v-if="self.showAction_('base/site/edit')" @click="editItem(scope.row)">编辑</el-button>
                                    <el-button type="danger" size="small" v-if="self.showAction_('base/site/delete')" @click="removeItem(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="站群列表" name="2">
                    <div class="el-container">
                        <el-form :model="groupOption" label-width="100px" inline>
                            <el-form-item label="站群名称">
                                <el-input v-model="groupOption.name"></el-input>
                            </el-form-item>
                            <div class="text-right">
                                <el-button type="primary" @click="getGroupData">搜索</el-button>
                                <el-button type="primary" @click="editGroup()" >添加</el-button>
                            </div>
                        </el-form>
                    </div>
                    <el-table :data="groupData" border class="menu-list-table" v-loading="groupLoading">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="name" label="站群名称"></el-table-column>
                        <el-table-column prop="defaultWeb" label="默认主站"></el-table-column>
                        <el-table-column prop="code" label="站群code"></el-table-column>
                        <el-table-column prop="webList" label="所含网站code"></el-table-column>
                        <el-table-column prop="update_user" label="修改人"></el-table-column>
                        <el-table-column label="修改时间">
                            <template scope="scope">
                                {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button type="primary" size="small" @click="editGroup(scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 弹窗S -->
        <!-- 站点 -->
        <el-dialog :title="dialogTitle" v-model="editDialog" size="tiny">
            <el-form :model="editForm" ref="editForm" label-width="100px" :rules="formRule">
                <el-form-item label="所属站群" prop="parent_id">
                    <el-select filterable v-model="editForm.parent_id">
                        <el-option label="顶级站点" :value="0"></el-option>
                        <el-option v-for="item in sitesOpt" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="站点名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="站点简码" prop="code">
                    <el-select filterable v-model="editForm.code" :disabled="!editCode">
                        <el-option v-for="item in codeOpt" :key="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="域名" prop="domain">
                    <el-input v-model="editForm.domain" placeholder="请输入完整的http或https链接"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveSite" v-loading="saveLoading" :disabled="saveLoading">确 定</el-button>
                <el-button type="danger" @click="editDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 站群 -->
        <el-dialog :title="groupDialog.title" v-model="groupDialog.isShow" size="tiny">
            <el-form :model="groupDialog.data" ref="groupForm" label-width="100px">
                <el-form-item label="站群名称" prop="name" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-input v-model="groupDialog.data.name"></el-input>
                </el-form-item>
                <el-form-item label="站群code" prop="code" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-input v-model="groupDialog.data.code"></el-input>
                </el-form-item>
                <el-form-item label="添加站点" prop="sites" :rules="[{type: 'array',required: true, message: '该项不能为空'}]">
                    <el-select v-model="groupDialog.data.sites" multiple filterable value-key="id" @visible-change="changeDone">
                        <el-option v-for="(item, index) in siteList" :key="index" :value="item" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-table :data="groupDialog.data.sites" border>
                    <el-table-column prop="name" label="网站名称"></el-table-column>
                    <el-table-column prop="code" label="网站code"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="primary" size="small" v-if="scope.row.is_default == 0" @click="setDefault(scope.$index)">设为默认</el-button>
                            <span v-else>默认站</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postGroup" v-loading="groupDialog.postLoading" :disabled="groupDialog.postLoading">确 定</el-button>
                <el-button type="danger" @click="groupDialog.isShow = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let checkNum = (rule, value, callback) => {
            if ((value && Number(value)) || value === 0) {
                callback();
            } else {
                callback(new Error('该项不能为空'));
            }
        }
        return {
            groupDialog: {
                isShow: false,
                title: '添加站群',
                postLoading: false,
                data: {
                    code: '',
                    name: '',
                    child: [],
                    sites: []
                }
            },
            siteList: [],
            tabPage: '1',
            tableLoading: false,
            addLoading: false,
            saveLoading: false,
            self: this,
            codeOpt: [],
            dialogTitle: '新增站点',
            sitesOpt: [],
            option: {
                page: 1,
                page_size: 20,
            },
            groupOption: {
                name: '',
            },
            groupData: [],
            groupLoading: false,
            editForm: {
                id: '',
                parent_id: '',
                name: '',
                code: '',
                domain: ''
            },
            tableData: [],
            editCode: true,
            editDialog: false,
            formRule: {
                parent_id: [{
                    validator: checkNum
                }],
                name: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                code: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                domain: [{
                    type: 'url',
                    required: true,
                    message: '请输入正确的url',
                    trigger: 'blur'
                }],
            }
        };
    },
    created () {
        this.getSites();
        this.getData();
    },
    methods: {
        // site list
        getData () {
            this.tableLoading = true;
            this.$http.get('base/site/site-list').then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = [];
                    for (let i in data) {
                        if (data[i].treeInfo.leaf == false) {
                            data[i].isToggle = true;
                        }
                        if (data[i].is_group == 0) {
                            temp.push(data[i]);
                        }
                    }

                    this.siteList = temp;
                    this.tableData = data;
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        // group list
        getGroupData () {
            this.groupLoading = true;
            this.$http.get('base/site/group-list', {params: {name: this.groupOption.name}}).then(res => {
                this.groupLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    data.map(item => {
                        let temp = [];
                        if (item.children && item.children.length > 0) {
                            item.children.map (site => {
                                if (site.is_default == 1) {
                                    item.defaultWeb = site.name;
                                }
                                temp.push(site.code);
                            });
                            item.webList = temp.join(',');
                        }
                    });
                    this.groupData = data;
                }
            }).catch(err => {
                this.groupLoading = false;
            });
        },
        // toggle list  @row, row data;  @index, row index, @tableStore, list data, element-ui callback params.
        // target index slice start
        toggle (row, index, tableStore) {
            let data = tableStore.states;
            let tableData = data._data;
            let targetIndex = index;
            let toggleIndex = '';
            let targetParent = row.parent_id;
            for (let i in tableData) {
                if (i > targetIndex && tableData[i].treeInfo.level <= row.treeInfo.level) {
                    toggleIndex = i;
                    break ;
                } else {
                    toggleIndex = i + 1;
                }
            };

            if (tableStore[row.id] && tableStore[row.id] != '') {
                let tempArrbefore = tableData.slice(0, targetIndex + 1);
                let tempArrafter = tableData.slice(targetIndex + 1);
                let temp = tempArrbefore.concat(tableStore[row.id]);
                let res = temp.concat(tempArrafter);
                this.tableData = res;
                this.tableData[index].isToggle = true;
                tableStore[row.id] = '';
            } else {
                tableStore[row.id] = tableData.slice(targetIndex + 1, toggleIndex);
                this.tableData.splice(targetIndex + 1, toggleIndex - targetIndex -1);
                this.tableData[index].isToggle = false;
            }
        },
        getSites () {
            this.$http.get('base/site/public-get-codes').then(res => {
                if (res.body.code === 0) {
                    this.codeOpt = res.body.data;
                }
            })
        },
        addSite () {
            this.addLoading = true;
            this.editForm = {
                id: 0,
                parent_id: '',
                name: '',
                code: ''
            }
            this.dialogTitle = '新增站点'

            this.$http.get('base/site/public-get-sites').then(res => {
                this.addLoading = false;
                if (res.body.code === 0) {
                    this.sitesOpt = res.body.data;
                    this.editCode = true;
                    this.editDialog = true;
                }
            }).catch(err => {
                this.addLoading = false;
            })
        },
        saveSite () {
            let self = this;
            this.$refs['editForm'].validate(valid => {
                if (valid) {
                    this.saveLoading = true;
                    if (this.editForm.id && this.editForm.id != 0) {
                        this.$http.post('base/site/edit', this.editForm).then(res => {
                            this.saveLoading = false;
                            if (res.body.code === 0) {
                                this.editDialog = false;
                                this.$message.success(res.body.message);
                                self.getData();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.saveLoading = false;
                        });
                    } else {
                        this.$http.post('base/site/add', this.editForm).then(res => {
                            this.saveLoading = false;
                            if (res.body.code === 0) {
                                this.editDialog = false;
                                this.$message.success(res.body.message);
                                self.getData();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.saveLoading = false;
                        });
                    }
                }
            });
        },
        removeItem (row) {
            this.$confirm('是否删除该项?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('base/site/delete', {id: row.id}).then(res => {
                    if (res.body.code == 0) {
                        let index = this.tableData.indexOf(row);
                        this.tableData.splice(index, 1);
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
        editItem (row) {
            this.editForm.id = row.id;
            this.editForm.name = row.name;
            this.editForm.parent_id = row.parent_id;
            this.editForm.code = row.code;
            this.editForm.domain = row.domain;

            this.dialogTitle = '编辑站点';
            this.$http.get('base/site/public-get-sites').then(res => {
                if (res.body.code === 0) {
                    this.sitesOpt = res.body.data;
                    this.editCode = false;
                    this.editDialog = true;
                }
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
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.option.keyword = '';
        },
        handleClick (val) {
            if (val.name === '2') {
                if (this.groupData.length === 0) {
                    this.getGroupData();
                }
            }
        },
        addGroup () {

        },
        changeDone (val) {
            if (!val) {
                this.groupDialog.data.sites.map((item, index) => {
                    if (index === 0) {
                        item.is_default = 1;
                    } else {
                        item.is_default = 0;
                    }
                });
            }
        },
        setDefault (index) {
            this.groupDialog.data.sites.map((item, _index) => {
                if (index === _index) {
                    item.is_default = 1;
                } else {
                    item.is_default = 0;
                }
            });
        },
        editGroup (row) {
            if (row instanceof Object) {
                let data = this.groupDialog.data;
                data.id = row.id;
                data.name = row.name;
                data.code = row.code;
                let temp = [];
                if (row.children && row.children.length > 0) {
                    row.children.map(item => {
                        this.siteList.map(option => {
                            if (option.id == item.id) {
                                temp.push(option);
                            }
                        });
                    });
                }

                data.sites = temp;
                this.groupDialog.type = 'edit';
                this.groupDialog.title = '编辑站群'
            } else {
                this.groupDialog.type = 'add';
                this.groupDialog.title = '新增站群'
            }
            this.groupDialog.isShow = true;
        },
        postGroup () {
            this.$refs.groupForm.validate(valid => {
                if (valid) {
                    let data = this.groupDialog.data;
                    let params = {};
                    let src = 'base/site/group-add';
                    params.name = data.name;
                    params.code = data.code;
                    params.child = [];

                    data.sites.map(item => {
                        params.child.push({
                            id: item.id,
                            is_default: item.is_default
                        })
                    });

                    if (this.groupDialog.type === 'edit') {
                        src = 'base/site/group-edit';
                        params.id = data.id;
                    }

                    this.$http.post(src, params).then(res => {
                        if (res.body.code === 0) {
                            this.getGroupData();
                            this.groupDialog.isShow = false;
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }
            });
        }
    }
}
</script>

<style>
</style>