<template>
    <div>
        <div class="el-container">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="类目管理" name="categoryManage">
                    <el-form inline :model="categoryManageFilterForm" ref="categoryManageSearchForm">
                        <el-form-item label="错误码类目：" prop="typeName">
                            <el-select v-model="categoryManageFilterForm.typeName" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in allCategory" :key="index"  :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                            <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button>
                            <el-button type="primary" @click="addCategoryManage">添加类目</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="categoryManageTableData" border ref="categoryManageTable"  v-loading="categoryManageDataLoading">
                        <el-table-column prop="typeCode" label="类目错误码"></el-table-column>
                        <el-table-column prop="typeName" label="类目名称"></el-table-column>
                        <el-table-column prop="typeNameCn" label="中文"></el-table-column>
                        <el-table-column prop="typeDescription" label="解释"></el-table-column>
                        <el-table-column label="添加时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button type="primary" @click="editCategoryManage(scope.row)" size="small"> 编辑</el-button>
                                <el-button type="danger" @click="delCategoryManage(scope.row)" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="text-right el-sub-container">
                        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="categoryManagePagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="categoryManagePagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="categoryManagePagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="支付错误码" name="errorCode">
                    <el-form inline :model="errorCodeFilterForm" ref="errorCodeSearchForm">
                        <el-form-item label="支付渠道：" prop="channelCode">
                            <el-select v-model="errorCodeFilterForm.channelCode" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in channels" :key="index" :label="item" :value="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属类目：" prop="typeCode">
                            <el-select v-model="errorCodeFilterForm.typeCode" clearable placeholder="请选择">
                                <el-option v-for="(item, index) in allCategory" :key="index"  :label="item" :value="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否可以路由：" prop="isSupportRouting">
                            <el-select v-model="errorCodeFilterForm.isSupportRouting" clearable placeholder="请选择">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 查询</el-button>
                            <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button>
                            <el-button type="primary" @click="addErrorCode">添加错误码</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table :data="errorCodeTableData" border ref="errorCodeTable"  v-loading="errorCodeDataLoading">
                        <el-table-column prop="channelName" label="支付渠道"></el-table-column>
                        <el-table-column prop="errorCode" label="第三方错误返回值"></el-table-column>
                        <el-table-column prop="description" label="解释"></el-table-column>
                        <el-table-column prop="typeName" label="所属类目"></el-table-column>
                        <el-table-column prop="typeCode" label="统一错误码"></el-table-column>
                        <el-table-column prop="siteMessage" label="默认网站提示语"></el-table-column>
                        <el-table-column label="是否可以路由">
                            <template scope="scope">
                                {{ scope.row.isSupportRouting == 1 ? '是' : '否' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="添加时间">
                            <template scope="scope">
                                {{ timeZone_(scope.row.createTime, $store.getters.getTimeZone) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button type="primary" @click="editErrorCode(scope.row)" size="small"> 编辑</el-button>
                                <el-button type="primary" @click="delErrorCode(scope.row)" size="small">删除</el-button>
                                <el-button type="primary" size="small" @click="langsSet(scope.row)">网站提示多语言配置</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="text-right el-sub-container">
                        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="errorCodePagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="errorCodePagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="errorCodePagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 类目管理  start-->
        <el-dialog :title="categoryManageForm.isEdit ? '编辑类目' : '添加类目'" @close="handleCategoryManageClose"  :visible.sync="categoryManageForm.isShow" class="rule-dialog category-manage-form" size="tiny">
            <el-form :model="categoryManageForm" ref="categoryManageForm" class="rule-form" label-width="140px" :rules="categoryManageRules">

                <el-form-item label="类目错误码：" prop="typeCode">
                    <el-input v-model="categoryManageForm.typeCode" auto-complete="off" :disabled="categoryManageForm.isEdit ? true : false" class="rule-input"></el-input>
                </el-form-item>

                <el-form-item label="类目名称：" prop="typeName">
                    <el-input v-model="categoryManageForm.typeName"  auto-complete="off" class="rule-input"></el-input>
                </el-form-item>

                <el-form-item label="中文：" prop="typeNameCn">
                    <el-input v-model="categoryManageForm.typeNameCn" type="textarea" auto-complete="off" class="rule-textarea"></el-input>
                </el-form-item>

                <el-form-item label="解释：" prop="typeDescription">
                    <el-input v-model="categoryManageForm.typeDescription" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="categoryManageForm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="saveCategoryManageForm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 类目管理  end-->

        <!-- 错误码  start-->
        <el-dialog :title="errorCodeForm.isEdit ? '编辑错误码' : '添加错误码'" @close="handleErrorCodeClose"  :visible.sync="errorCodeForm.isShow" class="rule-dialog" size="tiny">
            <el-form :model="errorCodeForm" ref="errorCodeForm" class="rule-form" label-width="140px" :rules="errorCodeRules">

                <el-form-item label="支付渠道：" prop="channelCode">
                    <el-select v-model="errorCodeForm.channelCode" clearable placeholder="请选择" :disabled="errorCodeForm.isEdit ? true : false">
                        <el-option v-for="(item, index) in channels" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="第三方错误码：" prop="errorCode">
                    <el-input v-model="errorCodeForm.errorCode"  auto-complete="off" :disabled="errorCodeForm.isEdit ? true : false" class="rule-input"></el-input>
                </el-form-item>

                <el-form-item label="解释：" prop="description">
                    <el-input v-model="errorCodeForm.description" auto-complete="off" class="rule-textarea"></el-input>
                </el-form-item>

                <el-form-item label="所属类目：" prop="typeCode">
                    <el-select v-model="errorCodeForm.typeCode" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in allCategory" :key="index"  :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否可以路由：" prop="isSupportRouting">
                    <el-select v-model="errorCodeForm.isSupportRouting" clearable placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="网站提示语：" prop="siteMessage">
                    <el-input v-model="errorCodeForm.siteMessage" type="textarea" auto-complete="off" class="rule-textarea"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="errorCodeForm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="saveErrorCodeForm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 错误码  end-->


    </div>
</template>

<script>
    import {getChannels} from '@/common/baseApi'

    const defaultCatOpt =  {
        isEdit: false,
        isShow: false,
        typeCode: '', // 类目错误码
        typeName: '', // 类目名称
        typeNameCn: '', // 类目名称（中文）
        typeDescription: '' // 类目描述
    }

    const defaultCodeOpt = {
        isEdit: false,
        isShow: false,
        channelCode: '', // 支付方式编码
        typeCode: '', // 类目错误码
        errorCode: '', // 第三方错误码
        description: '', // 错误码描述
        siteMessage: '', //网站提示语
        isSupportRouting: '0' // 是否可以路由
    }
    export default {
        data() {
            return {
                activeName: 'categoryManage',
                // 类目管理
                categoryManageDataLoading: false,
                categoryManageFilterForm: {
                    typeName: '',
                },
                categoryManagePagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                categoryManageTableData: [],
                categoryManageForm: JSON.parse(JSON.stringify(defaultCatOpt)),
                allCategory: {},
                channels: {},
                // 支付错误码
                errorCodeDataLoading: false,
                errorCodeFilterForm: {
                    channelCode: '',
                    typeCode: '',
                    isSupportRouting: ''
                },
                errorCodePagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                errorCodeTableData: [],
                errorCodeForm: JSON.parse(JSON.stringify(defaultCodeOpt)),
                categoryManageRules: {
                    typeCode: [
                        { required: true, message: '请填类目错误码', trigger: 'blur' }
                    ],
                    typeName: [
                        { required: true, message: '请填类目名称', trigger: 'blur' }
                    ],
                    typeNameCn: [
                        { required: true, message: '请填类目名称（中文）', trigger: 'blur' }
                    ],
                    typeDescription: [
                        { required: true, message: '请填写解释', trigger: 'blur' }
                    ]
                },
                errorCodeRules: {
                    channelCode: [
                        { required: true, message: '请填选择支付渠道', trigger: 'change' }
                    ],
                    errorCode: [
                        { required: true, message: '请填第三方错误码', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请填解释', trigger: 'blur' }
                    ],
                    typeCode: [
                        { required: true, message: '请选择类目', trigger: 'change' }
                    ],
                    siteMessage: [
                        { required: true, message: '请填写网站提示语', trigger: 'blur' }
                    ]
                }
            }
        },

        created() {
            this.initData();
        },
        methods: {
            initData() {
                getChannels().then((data) => {
                    let channels = {};
                    data.payChannels.forEach((item) => {
                        channels[item.channelCode] = item.channelName
                    })
                    this.channels = channels;
                })
                this.getAllType();
                this.getListData();
            },
            // 获取列表数据
            getListData(param) {
                let params = {};
                if (typeof param === 'number') {
                    this[this.activeName + 'Pagination'].pageNo = param;
                }
                params = Object.assign({}, this[this.activeName + 'Pagination'], this[this.activeName + 'FilterForm']);
                delete params.totalCount;
                const urls = {
                    'categoryManage': 'pay/code/type-list',
                    'errorCode': 'pay/code/list'
                }
                this[this.activeName + 'DataLoading'] = true;
                this.$http.get(urls[this.activeName], { params: params }).then(res => {
                    this[this.activeName + 'DataLoading'] = false;
                    this[this.activeName + 'TableData'] = [];
                    if (res.body.code !== 0) {
                        this[this.activeName + 'Pagination'].totalCount = 0;
                        return;
                    }
                    let data = res.body.data.list || [];
                    this[this.activeName + 'TableData']= data;
                    this[this.activeName + 'Pagination'].totalCount = res.body.data.totalCount;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 改变每页显示数
            changePageSize(value) {
                this[this.activeName + 'Pagination'].pageSize = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this[this.activeName + 'Pagination'].pageNo = value;
                this.getListData();
            },
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs[this.activeName + 'SearchForm'].resetFields();
            },
            // 切换 tab
            handleTabClick(tab) {
                this.activeName = tab.name;
                this.$nextTick(() => {
                    if (!tab.isDataInited) {
                        this.getListData();
                        tab.isDataInited = true;
                    }
                })
            },
            // 关闭类目管理弹框
            handleCategoryManageClose() {
                this.$refs.categoryManageForm.resetFields();
                this.$nextTick(() => {
                    this.categoryManageForm = Object.assign({}, defaultCatOpt);
                })
            },
            // 添加名目
            addCategoryManage() {
                this.categoryManageForm.isShow = true;
            },
            // 保存名目
            saveCategoryManageForm() {
                let params = Object.assign({}, this.categoryManageForm);
                this.$refs.categoryManageForm.validate((valid) => {
                    if (valid) {
                        let isEdit = params.isEdit ? true : false;
                        delete params.isEdit;
                        delete params.isShow;
                        this.$http.post('pay/code/type-' + (isEdit ? 'update' : 'add') , params).then(res => {
                            if (res.body.code !== 0) {
                                return this.$message.error(res.body.message);
                            }
                           this.$message.success(res.body.message);
                           this.categoryManageForm.isShow = false;
                           this.getListData();
                           this.getAllType();
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
            // 获取所有类目
            getAllType() {
                this.$http.get('pay/code/type-all').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    let allCategory = {};
                    res.body.data.payErrorCodeTypes.forEach((item) => {
                        allCategory[item.typeCode] = item.typeName;
                    })
                    this.allCategory = allCategory;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 编辑名目
            editCategoryManage(row) {
                this.categoryManageForm = Object.assign({}, this.categoryManageForm, row);
                this.categoryManageForm.isEdit = true;
                this.categoryManageForm.isShow = true;
            },
            // 删除名目
            delCategoryManage(row) {
                this.$confirm('确认删除此类目？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('pay/code/type-delete', {
                        typeCode: row.typeCode
                    }).then(res => {
                        if (res.body.code == 0) {
                            this.getListData();
                            this.getAllType();
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message.info( '已取消删除');
                });
            },
            // 关闭错误码弹窗
            handleErrorCodeClose() {
                this.$refs.errorCodeForm.resetFields();
                this.$nextTick(() => {
                    this.errorCodeForm = Object.assign({}, defaultCodeOpt);
                })
            },
            // 编辑错误码
            editErrorCode(row) {
                row.isSupportRouting = String(row.isSupportRouting);
                this.errorCodeForm = Object.assign({}, this.errorCodeForm, row);
                this.errorCodeForm.isEdit = true;
                this.errorCodeForm.isShow = true;
            },
            // 新建错误码
            addErrorCode() {
                this.errorCodeForm.isShow = true;
            },
            // 删除错误码
            delErrorCode(row) {
                this.$confirm('确认删除此错误码？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('pay/code/delete', {
                        channelCode: row.channelCode,
                        errorCode: row.errorCode
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
            // 保存错误码
            saveErrorCodeForm() {
                let params = Object.assign({}, this.errorCodeForm);
                this.$refs.errorCodeForm.validate((valid) => {
                    if (valid) {
                        let isEdit = params.isEdit ? true : false;
                        delete params.isEdit;
                        delete params.isShow;
                        this.$http.post('pay/code/' + (isEdit ? 'update' : 'add') , params).then(res => {
                            if (res.body.code !== 0) {
                                return this.$message.error(res.body.message);
                            }
                           this.$message.success(res.body.message);
                           this.errorCodeForm.isShow = false;
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
            // 网站提示语多语言配置
            langsSet(row) {
                this.$router.push({ name: 'langsSetTip', query: { channelCode: row.channelCode, errorCode: row.errorCode }});
            }
        }
    }
</script>
<style lang="less">

</style>
