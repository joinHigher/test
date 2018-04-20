<!-- 广告位显示位置列表 -->
<template>
    <div class="el-container ad-list">
        <div class="text-right el-sub-container">
            <el-button type="primary" @click="add" v-if="self.showAction_('admin/banner-position/add')">新增</el-button>
        </div>
        <el-table :data="tableData" border class="menu-list-table" v-loading="tableLoading">
            <el-table-column prop="id" label="广告位ID"></el-table-column>
            <el-table-column label="位置">
                <template scope="scope">
                    <div :style="{'margin-left': (scope.row.treeInfo.level - 1) * 30 + 'px'}">
                         <a v-if="!scope.row.treeInfo.leaf" class="tree-btn" @click="toggle(scope.row, scope.$index)"><i :class="{'el-icon-plus': !scope.row.toggle, 'el-icon-minus': scope.row.toggle}"></i>{{scope.row.name}}</a>
                         <span v-else>{{scope.row.name}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="order" label="排序"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('admin/banner-position/edit')">编辑</el-button>
                    <!-- <el-button type="danger" size="small" @click="remove(scope.row.id)" v-if="self.showAction_('admin/banner-position/delete')">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗S -->
        <!-- 编辑 -->
        <el-dialog :title="editType == 'edit' ? '编辑' : '新增'" v-model="editDialog" size="tiny">
            <el-form :model="editForm" ref="editForm" label-width="120px">
                <el-form-item label="所属上级" prop="node">
                    <el-cascader :disabled="catOpt[0].children.length === 0" v-model="editForm.node" class="tree" :options="catOpt" change-on-select :props="prop"></el-cascader>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input v-model="editForm.order"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="post" v-loading="editLoading" :disabled="editLoading">确 定</el-button>
                <el-button type="danger" @click="editDialog = false">取 消</el-button>
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
            tableLoading: false,
            editLoading: false,
            editDialog: false,
            editType: 'edit',
            editForm: {
                node: [],
                order: '',
                name: '',
            },
            tableData: [],
            platOpt: {
                '1': 'WEB',
                '2': 'WAP',
                '3': 'IOS',
                '4': 'ANDROID',
                '5': 'PAD',
            },
            prop: {
                value: 'id',
                children: 'children',
                label: 'name'
            },
            catOpt: [{
                name: '顶级分类',
                id: 0,
                children: [],
            }],
        };
    },
    created () {
        this.getData();
        this.getPosition();
    },
    methods: {
        getData() {
            this.tableLoading = true;
            this.$http.get('admin/banner-position/list').then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    data.forEach(item => {
                        item.treeInfo.level = 1;
                    })
                    this.tableData = data;

                    // this.catOpt[0].children = data;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        getPosition() {
            this.$http.get('admin/public/banner-positions').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.catOpt[0].children = data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        toggle (row, index) {

            if (!row.toggle) {
                // 展开
                row.children.forEach(item => {
                    item.treeInfo.level = row.treeInfo.level + 1;
                });
                this.tableData = this.tableData.slice(0, index + 1).concat(row.children).concat(this.tableData.slice(index + 1, this.tableData.length));
                row.toggle = true;
            } else {
                // 收起
                for (let i = index + 1; i < this.tableData.length; i++) {
                    if (this.tableData[i].treeInfo.level <= row.treeInfo.level) {
                        this.tableData.splice(index + 1, i - index -1);
                        break;
                    }

                    if (i == this.tableData.length - 1) {
                        this.tableData.splice(index + 1, i);
                    }
                }
                row.toggle = false;
            }
        },
        edit(row) {
            this.editType = 'edit';
            for (let i in this.editForm) {
                if (i == 'node') {
                    this.editForm[i] = String(row[i]).split(',');
                } else {
                    this.editForm[i] = row[i];
                }
            }
            this.editForm.id = row.id;
            this.editForm.node = this.editForm.node.map(item => {
                return item * 1;
            });
            this.editForm.node.splice(this.editForm.node.length - 1, 1);
            this.editForm.node.unshift(0);
            this.editDialog = true;
        },
        remove(id) {
            this.$confirm('确认删除').then(() => {
                this.$http.post('admin/banner-position/delete', {id: id}).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(err => {
                this.$message.info('已取消');
            });
        },
        add() {
            this.editType = 'add';
            this.editDialog = true;
            this.editForm = {
                node: [],
                order: '',
                name: '',
            };
        },
        post() {
            let params = {};

            for (let i in this.editForm) {
                if (i != 'node') {
                    params[i] = this.editForm[i];
                }
            }
            let node = this.editForm.node;
            params.parent_id = node[node.length - 1];
            let src = 'admin/banner-position/add';
            if (this.editType === 'edit') {
                src = 'admin/banner-position/edit';
            }
            this.$http.post(src, params).then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.getData();
                    this.editDialog = false;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });
        },
    }
}
</script>

<style lang="less" scope>
    .el-cascader {
        &.tree {
            width: 100%
        }
    }

</style>


