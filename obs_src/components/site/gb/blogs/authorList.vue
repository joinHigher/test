<template>
    <div>
        <div class="el-container">
            <div class="text-right" style="margin-bottom: 20px;">
                <el-button type="primary"  @click="add" v-if="self.showAction_('blog/author/add')">添加作者</el-button>
            </div>
            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="author" label="作者"></el-table-column>
                <el-table-column prop="articles_count" label="发表文章数"></el-table-column>
                <el-table-column prop="avatar" label="头像"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button  type="primary" size="small" v-if="self.showAction_('blog/author/edit')" @click="edit(scope.row)">编辑</el-button>
                        <el-button  type="danger" size="small" @click="deleteAuthor(scope.row)" v-if="self.showAction_('blog/author/delete')">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-right el-sub-container">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
            </div>
        </div>
        <el-dialog :title="authorForm.isEdit ? '编辑作者' : '添加作者'" size="tiny" :visible.sync="authorForm.isShow" @close="handleClose">
            <el-form :model="authorForm" ref="authorForm" :rules="rules">
                <el-form-item label="作者：" prop="author" label-width="100px">
                    <el-input v-model="authorForm.author" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="头像URL：" prop="avatar" label-width="100px">
                    <el-input v-model="authorForm.avatar" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="authorForm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                dataLoading: false,
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: [],
                authorForm: {
                    id: '',
                    isShow: false,
                    author: '',
                    avatar: '',
                    isEdit: false
                },
                rules: {
                    author: [
                        { required: true, message: '请输入作者名称', trigger: 'blur' },
                    ],
                    avatar: [
                        { required: true, message: '请输入作者图像URL', trigger: 'blur' }
                    ]
                }
            }
        },

        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.getListData();
            },
            // 获取列表数据
            getListData(param) {
                let params = {};
                if (typeof param === 'number') {
                    this.pagination.pageNo = param;
                }
                params = Object.assign({}, this.pagination);
                this.dataLoading = true;
                this.$http.get('blog/author/list', { params: params }).then(res => {
                    this.dataLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        this.pagination.totalCount = 0;
                        return;
                    }
                    let data = res.body.data.data;
                    this.tableData = data;
                    this.pagination.totalCount = res.body.data.total;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 改变每页显示数
            changePageSize(value) {
                this.pagination.pageSize = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this.pagination.pageNo = value;
                this.getListData();
            },
            // 添加
            add() {
                this.authorForm.isShow = true;
            },
            // 编辑
            edit(row) {
                this.authorForm.id = row.id;
                this.authorForm.author = row.author;
                this.authorForm.avatar = row.avatar;
                this.authorForm.isEdit = true;
                this.authorForm.isShow = true;
            },
            // 删除
            deleteAuthor(row) {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('blog/author/delete', {
                        id: row.id
                    }).then(res => {
                        if (res.body.code == 0) {
                            this.getListData();
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message.info( '已取消删除');
                });
            },
            // 保存
            save() {
                let params = Object.assign({}, this.authorForm);
                this.$refs.authorForm.validate((valid) => {
                    if (valid) {
                        delete params.isEdit;
                        delete params.isShow;
                        this.$http.post('blog/author/' + (params.id ? 'edit' : 'add') , params).then(res => {
                            if (res.body.code !== 0) {
                                return this.$message.error(res.body.message);
                            }
                           this.$message.success(res.body.message);
                           this.authorForm.isShow = false;
                           this.getListData();
                        },
                        (err) => {
                            this.$notify.error(err.body.message || '发生错误');
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleClose() {
                if(this.authorForm.id) {
                    this.authorForm.id = '';
                    this.authorForm.author = '';
                    this.authorForm.avatar = '';
                    this.authorForm.isEdit = false;
                } else {
                    this.$refs.authorForm.resetFields();
                }
            }
        }
    }
</script>
<style lang="less">

</style>
