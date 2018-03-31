<template>
    <div class="el-container el-vstock-container">
        <el-form inline :model="filterForm" ref="filterForm">
            <el-form-item label="字段名称" prop="address_name">
                <el-select v-model="filterForm.address_name" clearable  placeholder="请选择">
                    <el-option v-for="(item, key) in fields" :key="key" :label="item" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="指定国家" prop="country">
                <el-select v-model="filterForm.country" clearable filterable  placeholder="请选择">
                    <el-option label="通用" value="all"></el-option>
                    <el-option v-for="(item, key) in countrys" :key="key" :label="item" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="生效状态" prop="status">
                <el-select v-model="filterForm.status" clearable filterable  placeholder="请选择">
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
            </el-form-item>
        </el-form>
        <div class="text-right" style="margin-bottom: 20px;">
            <router-link class="el-button el-button--primary" :to="{name: 'addressCheckAdd'}" v-if="self.showAction_('admin/address-rule/add')">创建新规则</router-link>
        </div>
        <el-table :data="tableData" border ref="table" v-loading="dataLoading">
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="字段名称">
                <template scope="scope">
                    {{ fields[scope.row.address_name] }}
                </template>
            </el-table-column>
            <el-table-column label="指定国家">
                <template scope="scope">
                    {{ scope.row.country !== 'all' ? countrys[scope.row.country] : '通用' }}
                </template>
            </el-table-column>
            <el-table-column label="生效状态">
                <template scope="scope">
                    {{ scope.row.status === 1 ? '启用' : '禁用' }}
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="创建时间">
                <template scope="scope">
                    {{ timeZone_(scope.row.create_time, $store.getters.getTimeZone) }}
                </template>
            </el-table-column>
            <el-table-column label="最后编辑时间">
                <template scope="scope">
                    {{ timeZone_(scope.row.update_time, $store.getters.getTimeZone) }}
                </template>
            </el-table-column>
            <el-table-column prop="update_name" label="最近操作人"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <router-link class="el-button el-button--primary el-button--small" :to="{name: 'addressCheckEdit', query: { id: scope.row.id }}" v-if="self.showAction_('admin/address-rule/info')">编辑</router-link>
                    <el-button  type="danger" size="small" @click="delRuleItem(scope.row)" v-if="self.showAction_('admin/address-rule/delete')">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <div class="text-right el-sub-container">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
        </div>


    </div>
</template>

<script>

import httpGet, { httpPost, getAllCountrys, getFields } from '../../../../common/baseApi'

export default {
    data () {
        return {
            self: this,
            filterForm: {
                address_name: '',
                country: '',
                status: ''
            },
            dataLoading: false,
            pagination: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
            },
            tableData: [],
            countrys: {},
            fields: {}
        }
    },
    created () {
        this.initData();
    },
    methods: {
        initData() {
            this.getFields();
            this.getCountrys();
            this.getListData();
        },
        // 获取列表数据
        async getListData(param) {
            let params = {};
            if (typeof param === 'number') {
                this.pagination.pageNo = param;
            }
            params = Object.assign({}, this.pagination, this.filterForm);
            delete params.totalCount;
            this.dataLoading = true;
            try{
                const { list, totalCount } = await httpGet('admin/address-rule/list', {
                    params
                });
                this.tableData = list;
                this.pagination.totalCount = totalCount;
                this.dataLoading = false;
            } finally {
                this.dataLoading = false;
            }
        },
        // 获取字段名称
        async getFields() {
            const data = await getFields();
            this.fields = data;
        },
        // 获取国家列表
        async getCountrys() {
            const data = await getAllCountrys();
            let countrys = {};
            data.forEach((item) => {
                countrys[item.countryCode] = item.countryName;
            });
            this.countrys = countrys;
        },
        // 取消筛选
        handleBtnCancelFilterClick() {
            this.$refs.filterForm.resetFields();
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
        // 删除地址规则
        delRuleItem(row) {
            if(row.id) {
                this.$confirm('是否确认删除当前地址规则？', '删除规则', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const { code, message } = await httpPost('admin/address-rule/delete', {
                        addressRuleList: [row.id]
                    });
                    if(code === 0) {
                        this.$message({
                            type: 'success',
                            message: message || '删除成功！'
                        });
                        this.getListData();
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        }
    }
}
</script>
<style lang="less">
    .el-vstock-container {
        .stock-input{
            width: 120px;
        }
        .stock-tip {
            color: orange;
        }
        .stock-batch-container{
            margin-bottom: 30px;
            .stock-batch-btn{
                margin-right: 20px;
            }
        }
        .vstock-manage-info p {
            &:nth-child(3) {
                color: #ccc;
            }
        }
    }
</style>
