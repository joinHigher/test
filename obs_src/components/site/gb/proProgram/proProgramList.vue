<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="处理状态：" prop="deal_status">
                    <el-select v-model="filterForm.deal_status" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in dealStatusText" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
               <el-form-item label="时间：" prop="create_time">                            
                    <el-date-picker v-model="filterForm.create_time" type="datetimerange" placeholder="选择日期范围" ></el-date-picker>
                </el-form-item>
                <el-form-item label="搜索类型：" prop="user_search">
                    <el-select v-model="filterForm.user_search" clearable placeholder="请选择" @change="handleUserSearch">
                        <el-option v-for="(item, key) in userSearchText" :label="item" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="0px" prop="keyword">
                    <el-input v-model="filterForm.keyword" placeholder="输入关键词" :disabled="!filterForm.user_search"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                    <el-button type="primary" @click="getListData('导出')">导出</el-button>
                </el-form-item>
            </el-form>  

            <div class="btn-container">
                <el-button type="primary" :disabled="multipleSelection.length === 0" @click="batchStatus('drop')">批量删除</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0" @click="batchStatus(2)">批量处理中</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0" @click="batchStatus(3)">批量已处理</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0" @click="batchStatus('export')">批量导出</el-button>
            </div>

            <el-table :data="tableData" border ref="table"  v-loading="dataLoading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="relevant_url" label="relevant链接"  width="300"></el-table-column>
                <el-table-column prop="goods_url" label="商品链接" width="300"></el-table-column>
                <el-table-column prop="full_name" label="用户名" width="200"></el-table-column>
                <el-table-column prop="ship_addr" label="邮寄地址" width="300"></el-table-column>
                <el-table-column prop="email" label="用户邮箱" width="300"></el-table-column>
                <el-table-column prop="detail" label="详情" width="300"></el-table-column>
                <el-table-column label="状态"  width="80">
                    <template scope="scope">
                        <a href="javasript:void(0);" @click="handleStatus(scope.row)">{{ dealStatusText[scope.row.status] }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" width="200">
                    <template scope="scope">
                        {{ timeZone_(scope.row.create_time, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
            </el-table>

            <div class="text-right el-sub-container">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
            </div>

            <el-dialog title="状态修改" :visible.sync="isShowStatusForm" @close="cancelStatusForm" size="tiny" :inline="true">
                <el-form :model="statusForm" ref="statusForm" :rules="statusFormRules" label-width="80px">
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="statusForm.status">
                            <el-radio label="2">处理中</el-radio>
                            <el-radio label="3">已处理</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注" prop="result">
                        <el-input v-model="statusForm.result" type="textarea" :row="4" class="status-form-item"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelStatusForm">取 消</el-button>
                    <el-button type="primary" @click="doSaveStatus">确 定</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataLoading: false,
                filterForm: {
                    user_search: '',
                    keyword: '',
                    deal_status: 0,
                    create_time: [],
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                tableData: [],
                dealStatusText: ['全部', '未处理 ', '处理中', '处理后'],
                userSearchText: {
                    'id': 'ID', 
                    'relevant_url': 'Relevant链接', 
                    'full_name': '用户名', 
                    'email': '用户邮箱'
                },
                statusForm: {
                    id: '',
                    status: '',
                    result: ''
                },
                isShowStatusForm: false,
                statusFormRules: {
                    status: [
                        { required: true, message: '请选择处理状态', trigger: 'change' }
                    ]
                },
                multipleSelection: [],
                isKeyword: true
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
                params = Object.assign({}, this.pagination, this.filterForm);
                params.create_time = params.create_time.map((item) => {
                    return this.timeZone_(new Date(item), this.$store.getters.getTimeZone)
                });
                delete params.totalCount;

                if(param === '导出') {
                    if(params.create_time.length === 0 || params.create_time[0] == 0) {
                        return this.$message.error('请选择时间范围');
                    }
                    params.export = param;
                    this.getListData();
                    let str = '?export=' + params.export + '&user_search=' + params.user_search + '&keyword=' + params.keyword + '&deal_status=' + params.deal_status + '&pageNo=' + params.pageNo + '&pageSize=' + params.pageSize + '&create_time[0]=' + params.create_time[0] + '&create_time[1]=' + params.create_time[1];
                    location.href = this.$store.getters.getRootMenu + '/promotion/goods-pro/list' + str;
                } else {
                    this.dataLoading = true;
                    this.$http.get('promotion/goods-pro/list', { params: params }).then(res => {
                        this.dataLoading = false;
                        this.tableData = [];
                        if (res.body.code !== 0) {
                            this.pagination.totalCount = 0;
                            return;
                        }
                        let data = res.body.data.list;
                        this.tableData = data;
                        this.pagination.totalCount = res.body.data.totalCount;
                    },
                    (err) => {
                        this.$notify.error(err.body.message || '发生错误');
                    });
                }
            },
            // 取消帅选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
            },
            // 改变每页显示数
            changePageSize(value) {
                this.pagination.pageNo = 1;
                this.pagination.pageSize = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this.pagination.pageNo = value;
                this.getListData();
            },
            // 单个更新状态
            handleStatus(row){
                console.log(row.status)
                this.isShowStatusForm = true;
                this.statusForm.id = row.id;
                this.statusForm.status = row.status != 1 ? String(row.status) : '';
                this.statusForm.result = row.deal_remark;
            },
            // 保存单个更新状态
            doSaveStatus() {
                let params = Object.assign({}, this.statusForm);
                this.$refs.statusForm.validate((valid) => {
                    if (valid) {
                        this.$http.post('promotion/goods-pro/deal-review', params).then(res => {
                            if (res.body.code !== 0) {
                                return this.$message.error(res.body.message);
                            }
                           this.$message.success(res.body.message);
                           this.cancelStatusForm();
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
            // 关闭状态更新弹窗
            cancelStatusForm() {
                this.isShowStatusForm = false;
                this.$refs.statusForm.resetFields();
                this.statusForm = {
                    id: '',
                    status: '',
                    result: ''
                };
            },
            // 多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 批量操作
            async batchStatus(status) {
                let ids = this.multipleSelection.map((item) => {
                    return item.id
                });

                if(status === 'export') {
                    let str = '?type=' + status+ '&checkboxes=' + ids;
                    location.href = this.$store.getters.getRootMenu + '/promotion/goods-pro/batch' + str;
                } else {
                    if(status === 'drop') {
                        await this.$confirm('确定删除?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        });
                    }   
                    this.$http.get('promotion/goods-pro/batch', { params: { type: status, checkboxes: ids.join(',') } }).then(res => {
                        if (res.body.code !== 0) {
                            return this.$message.error(res.body.message);
                        }
                        this.$message.success(res.body.message);
                        this.getListData();
                    },
                    (err) => {
                        this.$notify.error(err.body.message || '发生错误');
                    });
                }
            },
            // 处理搜索的值
            handleUserSearch(val) {
                this.filterForm.keyword = '';
            }
        }
    }
</script>
<style lang="less">
    .status-form-item {
        width: 300px;
    }
    .btn-container{
        margin: 20px 0;
    }
</style>
