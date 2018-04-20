<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-form :model="option"  label-width="120px" ref="searchForm" inline>
                <div>
                    <el-form-item label="快速搜索" prop="value">
                        <el-input v-model="option.value" class="quick-search">
                            <el-select v-model="option.fields" slot="prepend" placeholder="请选择">
                                <el-option label="邮箱" value="user_email"></el-option>
                                <el-option label="SKU" value="goods_sn"></el-option>
                                <el-option label="处理人" value="update_user"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item label="处理状态" prop="status">
                    <el-select v-model="option.status" placeholder="请选择">
                        <el-option v-for="item in statusOpt" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题类型" prop="type">
                    <el-select v-model="option.type" placeholder="请选择">
                        <el-option v-for="(item, index) in typeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getData">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>    
        </div>
        <div class="el-container">
            <div class="el-sub-container">
                <el-button type="danger" :disabled="checkedRow.length === 0" @click="remove">删除</el-button>
            </div>
            <el-table :data="tableData" border v-loading="tableLoading" @selection-change="changeRow" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="goods_sn" label="sku"></el-table-column>
                <el-table-column prop="user_email" label="邮箱"></el-table-column>
                <el-table-column prop="type" label="问题类型"></el-table-column>
                <el-table-column prop="content" label="detail"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template scope="scope">
                        <el-button :type="scope.row.status == 3 ? 'success' : 'primary'" @click="deal(scope.row)" size="small">
                            <span v-if="scope.row.status == 1">未处理</span>
                            <span v-if="scope.row.status == 2">处理中</span>
                            <span v-if="scope.row.status == 3">已处理</span>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间">
                    <template scope="scope">
                         {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="update_user" label="处理人"></el-table-column>
                <el-table-column label="处理时间">
                    <template scope="scope">
                         {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="1" :page-sizes="[10, 20, 50]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="更改状态" v-model="changeDialog" size="tiny">
            <el-form :model="changeForm" label-width="80px" ref="postform">
                <el-form-item prop="status">
                    <el-radio v-if="checkedStatus.status != 1" label="1" v-model="changeForm.status">未处理</el-radio>
                    <el-input v-if="checkedStatus.status != 1" type="textarea" :rows="4" v-model="changeForm.remark1"></el-input>
                    <el-radio v-if="checkedStatus.status != 2" label="2" v-model="changeForm.status">处理中</el-radio>
                    <el-input v-if="checkedStatus.status != 2" type="textarea" :rows="4" v-model="changeForm.remark2"></el-input>
                    <el-radio v-if="checkedStatus.status != 3" label="3" v-model="changeForm.status">已处理</el-radio>
                    <el-input v-if="checkedStatus.status != 3" type="textarea" :rows="4" v-model="changeForm.remark3"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button  type="primary" @click="post" v-loading="postLoading">确 定</el-button>
                <el-button @click="changeDialog = false">取 消</el-button>
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
            option: {
                page: 1,
                size: 20,
                status: '',
                type: '',
                fields: '',
                value: ''
            },
            total: 10,
            tableData: [],
            postLoading: false,
            tableLoading: false,
            total: 10,
            typeOpt: {},
            statusOpt: {
                '1': '未处理',
                '2': '处理中',
                '3': '已处理'
            },
            changeForm: {
                status: '',
                remark1: '',
                remark2: '',
                remark3: ''
            },
            changeDialog: false,
            checkedRow: [],
            checkedStatus: {}
        };

    },
    created () {
        this.getOpt();
        this.getData();
    },
    methods: {
        getData () {
            this.tableLoading = true;
            this.$http.get('admin/error-report/list', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data.data;
                    data.map(item => {
                        item.remark = JSON.parse(item.remark)
                    });
                    this.tableData = res.body.data.data;
                    this.total = res.body.data.total;
                }
            });
        },
        getOpt () {
            this.$http.get('admin/error-report/question-types').then(res => {
                if (res.body.code === 0) {
                    this.typeOpt = res.body.data;
                }
            });
        },
        changeRow (val) {
            this.checkedRow = val;
        },
        remove () {
            this.$confirm('是否删除选择项?', '提示', {
                type: 'warning'
            }).then(() => {
                let str = [];
                this.checkedRow.forEach(item => {
                    str.push(item.id);
                });
                this.$http.post('admin/error-report/delete', {ids: str.join(',')}).then(res => {
                    if (res.body.code == 0) {
                        this.getData();
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
        deal (row) {
            let remark = row.remark;
            for (let i in remark) {
                this.changeForm['remark' + i] = remark[i];
            }
            this.checkedStatus = row;
            this.changeDialog = true;
        },
        post () {
            let params = {};
            params.id = this.checkedStatus.id;
            params.status = this.changeForm.status;
            params.remark = this.changeForm['remark' + params.status];
            this.$http.post('admin/error-report/process-change', params).then(res => {
                if (res.body.code === 0) {
                    this.getData();
                    this.changeDialog = false;
                    this.$message.success(res.body.message);
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.size = val;
            this.getData();
        },
        resetForm () {
            this.$refs.searchForm.resetFields();
            this.option.fields = '';
        },
        clickRow (row, event, col) {
            this.$refs.dataTable.toggleRowSelection(row);
        }
    }
}
</script>
<style>

</style>
