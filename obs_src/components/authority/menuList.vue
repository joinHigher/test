<template>
    <div>
        <div class="el-container">
            <div class="el-sub-container">
                <div class="text-right">
                    <el-button type="primary" @click="addMenu" v-if="self.showAction_('base/menu/add')">添加</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="menu-list-table" v-loading="tableLoading">
                <el-table-column label="名称">
                    <template scope="scope">
                        <div :style="{'margin-left': (scope.row.treeInfo.level - 1) * 30 + 'px'}">
                             <a v-if="!scope.row.treeInfo.leaf" class="tree-btn" @click="toggle(scope.row, scope.$index, dataStroe)"><i :class="{'el-icon-plus': !scope.row.isToggle, 'el-icon-minus': scope.row.isToggle}"></i>{{scope.row.name}}</a>
                             <span v-else>{{scope.row.name}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="route" label="php路由"></el-table-column>
                <el-table-column label="菜单图标class">
                    <template class="menu-icon-list" scope="scope">
                        <i :class="scope.row.icon_class"></i>
                    </template>
                </el-table-column>
                <el-table-column label="是否菜单显示">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.type == '1', 'el-icon-circle-cross color-danger': scope.row.type == '0'}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="是否公共接口">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.is_public == '1', 'el-icon-circle-cross color-danger': scope.row.is_public == '0'}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="路由状态">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="order" label="排序"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small" v-if="self.showAction_('base/menu/edit')" @click="editItem(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" v-if="self.showAction_('base/menu/delete')" @click="removeItem(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹窗S -->
        <!-- 编辑 -->
        <el-dialog title="编辑权限" v-model="editDialog" size="tiny">
            <el-form :model="editForm" ref="editForm" label-width="120px" :rules="formRule">
                <el-form-item label="所属分类" prop="parent_id" required>
                    <el-select filterable v-model="editForm.parent_id">
                        <el-option label="顶级菜单" :value="0"></el-option>
                        <el-option v-for="item in classifyList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="Php路由" prop="route">
                    <el-autocomplete class="inline-input" v-model="editForm.route" :fetch-suggestions="phpSearch" placeholder="请输入内容"></el-autocomplete>
                </el-form-item>
                <el-form-item label="排序号" prop="order">
                    <el-input v-model="editForm.order"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon_class">
                    <el-input v-model="editForm.icon_class"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :rows="4" v-model="editForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="是否公共接口" prop="is_public">
                    <el-radio-group v-model="editForm.is_public">
                        <el-radio class="radio" :label="1">是</el-radio>
                        <el-radio class="radio" :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="路由状态" prop="status">
                    <el-radio-group v-model="editForm.status">
                        <el-radio class="radio" :label="1">开启</el-radio>
                        <el-radio class="radio" :label="0">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="权限类型" prop="type" required>
                    <el-radio-group v-model="editForm.type">
                        <el-radio class="radio" :label="1">菜单</el-radio>
                        <el-radio class="radio" :label="0">操作</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveMenu" v-loading="editLoading" :disabled="editLoading">确 定</el-button>
                <el-button type="danger" @click="editDialog = false">取 消</el-button>
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
            self: this,
            addLoading: false,
            editLoading: false,
            tableLoading: false,
            tableData: [],
            editForm: {
                type: 1,
                parent_id: '',
                route: '',
                icon_class: '',
                remark: '',
                status: 1,
                is_public: 0
            },
            editRowIndex: '',
            editDialog: false,
            editDialog: false,
            subClass: false,
            classifyList: [],
            phpRoutes: [],
            formRule: {
                parent_id: [{
                    validator: checkNum
                }],
                name: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                route: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }, {
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                type: [{
                    validator: checkNum
                }]
            },
            dataStroe: {
                states: {
                    _data: []
                }
            }
        };
    },
    created () {
        this.initData();
    },
    watch: {
        tableData (val) {
            this.dataStroe.states._data = val;
        }
    },
    methods: {
        initData () {
            this.getClassify();
            this.getListData();
        },
        getListData () {
            this.tableLoading = true;
            this.$http.get('base/menu/list').then(res => {
                this.tableData = [];
                this.tableLoading = false;
                if (res.body.code === 0) {
                   let data = res.body.data;
                   let temp = [];

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].treeInfo.leaf == false) {
                            data[i].isToggle = true;
                        }
                        if (data[i].parent_id === 0) {

                            for (let j = i + 1; j < data.length; j++) {

                                if (j === data.length - 1 && data[j].parent_id !== 0) {
                                    this.dataStroe[data[i].id] = data.slice(i + 1, j + 1);
                                }

                                if (data[j].parent_id === 0) {
                                    this.dataStroe[data[i].id] = data.slice(i + 1, j);
                                    break;
                                }
                            }
                            data[i].isToggle = false;
                            temp.push(data[i]);
                        }
                    }
                    this.tableData = temp;
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        getClassify () {
            this.$http.get('base/menu/public-select-options').then(res => {
                let data = res.body.data;
                let tempPhp = [];
                for (let i in data.phpRoutes.available) {
                    tempPhp.push({
                        value: data.phpRoutes.available[i]
                    });
                }

                this.classifyList = data.menus;
                this.phpRoutes = tempPhp;
            });
        },
        addMenu () {
            this.getClassify();
            this.editDialog = true;
            this.$nextTick(() => {
                this.$refs.editForm.resetFields();
                this.editForm.is_leader_permission = 1;
                this.editForm.type = 1;
                this.editForm.id = 0;
            });
        },
        editItem (row) {
            this.editDialog = true;
            this.$nextTick(() => {
                for (let i in row) {
                    this.editForm[i] = row[i];
                }
                this.editRowIndex = this.tableData.indexOf(row);
            });
        },
        saveMenu () {
            let self = this;
            this.editForm.treeInfo = '';
            this.editForm.order = this.editForm.order || 0;
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    if (this.editForm.id && this.editForm.id != 0) {
                        this.editLoading = true;

                        this.$http.post('base/menu/edit', this.editForm).then(res => {
                            this.editLoading = false;
                            if (res.body.code === 0) {
                                let data = Object.assign(self.tableData[self.editRowIndex], res.body.data);
                                data.parent_id = data.parent_id + '';
                                data.type = data.type + '';
                                self.tableData.splice(self.editRowIndex, 1, data);

                                this.$message.success(res.body.message);
                                this.editDialog = false;
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.editLoading = false;
                        });
                    } else {
                        this.addLoading = true;

                        this.$http.post('base/menu/add', this.editForm).then(res => {
                            this.addLoading = false;
                            if (res.body.code === 0) {
                                this.editDialog = false;
                                this.$message.success(res.body.message);
                                self.getListData();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.addLoading = false;
                        });
                    }
                }
            });
        },
        removeItem (row) {
            this.$confirm('是否删除该项?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('base/menu/delete', {id: row.id}).then(res => {
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
        changeClass (val) {
            let temp = [];
            for (let i in this.tableData) {
                if (this.tableData[i]['parent_id'] == val && this.tableData[i].top_parent == 0) {
                    temp.push(this.tableData[i])
                }
            }
            if (temp.length < 1 || val == '') {
                this.subClass = false;
            } else {
                this.subClass = temp;
            }
        },
        toggle (row, index, tableStore) {
            let data = tableStore.states;
            let tableData = JSON.parse(JSON.stringify(data._data));
            let targetIndex = index;
            let toggleIndex = '';
            let targetParent = row.parent_id;

            for (let i in tableData) {
                if (i > targetIndex && (tableData[i].treeInfo.level <= row.treeInfo.level)) {
                    toggleIndex = i;
                    break ;
                } else {
                    if (tableData[targetIndex].parent_id == 0) {
                        toggleIndex = i + 1;
                    }
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
        phpSearch(queryString, callback) {
            let queryCatlist = this.phpRoutes;
            let results = queryString ? queryCatlist.filter(this.createFilter(queryString)) : queryCatlist;
            // 调用 callback 返回建议列表的数据
            callback(results);
        },
        createFilter(queryString) {
            return (queryCatlist) => {
                return (queryCatlist.value.toUpperCase().indexOf(queryString.toUpperCase()) !== (-1));
            };
        }
    }
}
</script>

<style>

</style>