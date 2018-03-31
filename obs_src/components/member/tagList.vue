<style lang="less">
.search-form {
    .el-form-item { margin-bottom: 0; }
}
.level-2 { margin-left: 30px; }
</style>

<template>
    <div v-loading="dataLoading">
        <div class="el-container">
            
            <el-form inline :model="options" ref="searchForm" label-position="left" class="search-form">
                <el-alert title="页面展示标签分类及所属标签数据，操作中需要注意：1、对分类进行删除操作，同时删除所属标签；2、将分类下的标签逐一全部删除后，分类同时被删除。" type="info" show-icon></el-alert><br>
                <el-row>
                    <el-col :span="20">
                        <el-form-item prop="labelAttrId" label="标签属性">
                            <el-select v-model="options.labelAttrId" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in tagAttr" :label="item.attrName" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="type" label="标签类型">
                            <el-select v-model="options.type" placeholder="请选择" clearable>
                                <el-option label="可多选" value="1"></el-option>
                                <el-option label="只能单选" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="likeName">
                            <el-input v-model="options.likeName" class="ipt" placeholder="标签名称/标签分类"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getListData(1)">筛选</el-button>
                            <el-button type="danger" @click="handleCancelFilterClick">取消筛选</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" class="text-right">
                        <el-button v-if="this.showAction_('user/tag/add')" type="primary" @click="handleAddOrEditTagClick(false)"><i class="el-icon-plus"></i> 添加标签</el-button>
                    </el-col>
                </el-row>
            </el-form>  
        </div>

        <div class="el-container">
            <el-table :data="tableData" border>
                <el-table-column prop="labelTypeName" label="标签名称">
                    <template scope="scope">
                        <span v-if="!scope.row.labelTypeId" class="level-1">
                            <el-button type="text" @click="toggleFold(scope.row)">
                                <i v-if="!scope.row.isFolded" class="el-icon-minus"></i>
                                <i v-else class="el-icon-plus"></i>
                                {{ scope.row.labelTypeName }}
                            </el-button>
                        </span>
                        <span v-else class="level-2">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="labelAttrName" label="标签属性"></el-table-column>
                <el-table-column label="标签类型">
                    <template scope="scope">
                        {{ scope.row.labelTypeType === 1 ? '可多选' : '只能单选' }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="设为常用">
                    <template scope="scope">
                        <el-button v-if="scope.row.labelTypeId" type="text" :loading="scope.row.isLoading" @click="handleBtnToggleCommondClick(scope.row)"><i :class="{'el-icon-circle-check color-success': scope.row.commond == 1, 'el-icon-circle-cross color-danger': scope.row.commond == 0}"></i></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <span v-if="self.showAction_('user/tag/edit') && !scope.row.labelTypeId && scope.row.editFlag == 1"><el-button type="text" @click="handleAddOrEditTagClick(scope.row)">编辑</el-button> &nbsp;</span>
                        <span v-if="self.showAction_('user/tag/bind-user') && scope.row.labelTypeId"><router-link :to="{name: 'member_memberList', query: {labelId: scope.row.id}}"><el-button type="text">查看用户列表</el-button></router-link> &nbsp;</span>
                        <el-button v-if="self.showAction_('user/tag/delete') && scope.row.editFlag == 1" type="text" @click="handleDelClick(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container text-right">
               <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
            </div>
        </div>

        <!-- 弹窗S -->
        <el-dialog :title="tagAddDlg.isEdit ? '编辑标签' : '创建新标签'" v-model="tagAddDlg.isShowDlg" size="tiny">
            <el-form :model="tagAddForm" ref="tagAddForm" :rules="tagAddRules" label-width="80px">
                <el-form-item label="标签属性" prop="labelAttrId">
                    <el-select v-model="tagAddForm.labelAttrId" placeholder="请选择标签属性">
                        <el-option v-for="(item, index) in tagAttr" v-if="item.editFlag == 1" :label="item.attrName" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签分类" prop="labelTypeName">
                    <el-input v-model="tagAddForm.labelTypeName" placeholder="请输入标签分类名称"></el-input>
                </el-form-item>
                <el-form-item label="标签类型">
                    <el-radio-group v-model="tagAddForm.labelTypeType">
                        <el-radio class="radio" :label="1">可多选</el-radio>
                        <el-radio class="radio" :label="2">只能单选</el-radio>       
                    </el-radio-group>
                </el-form-item>
                <el-row v-for="(item, index) in tagAddForm.memLabelReqs" :key="index">
                    <el-col :span="21">
                        <el-form-item label="标签名称" :prop="'memLabelReqs.' + index + '.name'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                            <el-input v-model="item.name" placeholder="请输入标签名称" :readonly="item.editFlag == 1"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        &nbsp; 
                        <el-button v-if="tagAddForm.memLabelReqs.length > 1" type="text" @click="handleTagAddDel(index)" :disabled="item.editFlag == 1"><i class="el-icon-minus"></i></el-button>
                        <el-button v-if="index === tagAddForm.memLabelReqs.length - 1" type="text" @click="handleTagAddNew"><i class="el-icon-plus"></i></el-button>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tagAddDlg.isShowDlg = false">取 消</el-button>
                <el-button type="primary" @click="handleTagAddOk" :loading="tagAddDlg.isLoading">确 定</el-button>
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
            dataLoading: false,
            options: {
                labelAttrId: '',
                type: '',
                likeName: ''
            },
            pagination: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
            },
            tagAttr: [],
            tagAddDlg: {
                isShowDlg: false,
                isLoading: false,
                isEdit: false
            },
            tagAddForm: {
                labelAttrId: '',
                labelTypeId: '',
                labelTypeName: '',
                labelTypeType: 1,
                memLabelReqs: [{ name: '' }]
            },
            tagAddRules: {
                labelAttrId: [{ type: 'number', required: true, message: '请选择标签属性', trigger: 'change' }],
                labelTypeName: [{ required: true, message: '请输入标签分类名称', trigger: 'blur' }]
            }
        };
    },
    created () {
        this.getListData();
        this.getTagAttr();
    },
    methods: {
        getListData (pageNo) {
            let params = {};
            if (pageNo) {
                this.pagination.pageNo = pageNo;
            }
            params = Object.assign({}, this.pagination, this.options);
            delete params['totalCount'];
            this.dataLoading = true;
            this.$http.get('user/tag/list', { params: params }).then(res => {
                this.dataLoading = false;
                if (res.body.code !== 0) {
                    this.tableData = [];
                    this.pagination.totalCount = 0;
                    return;
                }
                this.tableData = [];
                res.body.data.list.forEach((item, index) => {
                    this.tableData.push(Object.assign({}, item, { isFolded: false }));
                    // if (item.memLabels.length) {
                    //     this.tableData = this.tableData.concat(item.memLabels);
                    // }
                    item.memLabels.length && item.memLabels.forEach((item) => {
                        this.tableData.push(Object.assign({}, item, { isLoading: false }));
                    });
                });
                // console.log(this.tableData)
                this.pagination.totalCount = res.body.data.totalCount;
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getTagAttr() {
            this.$http.get('user/tag/public-attr-list').then((res) => {
                if (res.body.code !== 0) {
                    return;
                }
                res.body.data.forEach((item) => {
                    this.tagAttr.push(item);
                });
            });
        },
        changePage(value) {
            this.pagination.pageNo = value;
            this.getListData();
        },
        changePageSize(value) {
            this.pagination.pageSize = value;
            this.getListData();
        },
        handleCancelFilterClick() {
            this.$refs['searchForm'].resetFields();
            this.pagination.pageNo = 1;
            // this.getListData();
        },
        toggleFold(row) {
            let index = this.tableData.indexOf(row);
            let memLen = row.memLabels.length;
            // console.log(row);
            if (row.isFolded && memLen) {
                row.memLabels.forEach((item, i) => {
                    this.tableData.splice(index + i + 1, 0, item);
                });
            } else if (memLen) {
                row.memLabels.forEach((item, i) => {
                    this.tableData.splice(index + memLen - i, 1);
                });
            }
            row.isFolded = !row.isFolded;
        },
        handleTagAddNew() {
            this.tagAddForm.memLabelReqs.push({
                name: ''
            });
        },
        handleTagAddDel(index) {
            this.tagAddForm.memLabelReqs.splice(index, 1);
        },
        handleTagAddOk() {
            let hasError = false;
            let params = Object.assign({}, this.tagAddForm);
            this.$refs['tagAddForm'].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    hasError = true;
                    return false;
                }
            });
            if (hasError) {
                return;
            }
            // console.log(params);
            // return;
            this.tagAddDlg.isLoading = true;
            this.$http.post('user/tag/' + (this.tagAddDlg.isEdit ? 'edit' : 'add'), params).then(res => {
                this.tagAddDlg.isLoading = false;
                if (res.body.code === 70154) {
                    this.$message.error('标签类型名字不能一样');
                    return;
                } else if (res.body.code === 70155) {
                    this.$message.error('标签名字不能一样');
                    return;
                } else if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '发生错误');
                    return;
                }
                this.$message.success(res.body.message || '执行成功');
                this.tagAddDlg.isShowDlg = false;
                this.getListData();
            },
            (err) => {
                this.tagAddDlg.isLoading = false;
                this.$message.error(res.body.message || '发生错误');
            });
        },
        handleAddOrEditTagClick(row) {
            let isEdit = row ? true : false;
            this.tagAddDlg.isEdit = isEdit;
            this.tagAddDlg.isShowDlg = true;
            this.tagAddForm.labelAttrId = isEdit ? row.labelAttrId : '';
            this.tagAddForm.labelTypeId = isEdit ? row.id : '';
            this.tagAddForm.labelTypeName = isEdit ? row.labelTypeName : '';
            this.tagAddForm.labelTypeType = isEdit ? row.labelTypeType : 1;
            if (isEdit && row.memLabels.length) {
                this.tagAddForm.memLabelReqs = [];
                row.memLabels.forEach((item) => {
                    this.tagAddForm.memLabelReqs.push({ id: item.id, labelTypeId: item.labelTypeId, name: item.name });
                });
            } else {
                this.tagAddForm.memLabelReqs = [{ name: '' }];
            }
        },
        handleDelClick(row) {
            let params = { delType: row.labelTypeId ? 2 : 1 };
            if (row.labelTypeId) {
                params.labelId = row.id;
            } else {
                params.labelTypeId = row.id;
            }
            this.$confirm('执行删除操作后，关联用户的该标签数据会同步删除，是否还要继续删除操作？', '提示', {
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
                    this.$http.post('user/tag/delete', params).then(res => {
                        done();
                        instance.confirmButtonLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message || '删除出错');
                            return;
                        }
                        this.$message.success(res.body.message || '删除成功');
                        this.getListData();
                    });
                }
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },
        handleBtnToggleCommondClick(row) {
            let params = { labelId: row.id };
            if (!row.id || row.isLoading) {
                return;
            }
            params.commond = row.commond === 1 ? 0 : 1;
            row.isLoading = true;
            this.$http.post('user/tag/set-common', params).then(res => {
                row.isLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message);
                    return;
                }
                row.commond = row.commond === 1 ? 0 : 1;
            },
            (err) => {
                row.isLoading = false;
                this.$notify.error(err.body.message || '发生错误');
            });
        },

    }
}
</script>