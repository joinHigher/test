<template>
    <div>
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <div>
                    <el-form-item label="快速搜索" prop="keyword">
                        <el-input v-model="option.keyword" class="quick-search">
                            <el-select filterable clearable v-model="option.field" slot="prepend" placeholder="请选择">
                                <el-option label="角色名称" value="role_name"></el-option>
                                <el-option label="最后修改人" value="update_user"></el-option>
                                <el-option label="角色创建人" value="create_user"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item label="角色状态" prop="status">
                    <el-select filterable v-model="option.status" placeholder="请选择">
                        <el-option v-for="(item, index) in statusOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="修改时间" prop="editDate">
                    <el-date-picker v-model="option.editDate" type="datetimerange" :editable="false"></el-date-picker>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <router-link class="el-button el-button--primary" :to="{name: 'authority_roleEdit'}" v-if="this.showAction_('base/role/add')">
                    新增角色
                </router-link>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="role_name" label="角色名称"></el-table-column>
                <el-table-column prop="site_code" label="站点"></el-table-column>
                <el-table-column prop="privileges_num" label="权限数量"></el-table-column>
                <el-table-column prop="create_user" label="角色创建人"></el-table-column>
                <el-table-column prop="update_user" label="最后修改人"></el-table-column>
                <el-table-column label="最后修改时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="角色状态">
                    <template scope="scope">
                        {{statusOpt[scope.row.status]}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
<!--                         <router-link class="el-button el-button--primary el-button--small" v-if="self.showAction_('base/role/info')" :to="{name: 'authority_roleEdit', query: {id: scope.row.id}}">
                            编辑
                        </router-link> -->
                        <el-button type="primary" size="small" v-if="self.showAction_('base/role/info')" @click="edit(scope.row.id)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            tableLoading: false,
            searchInfo: {},
            option: {
                page: 1,
                page_size: 10,
                status: '',
                editDate: [],
                update_time_start: '',
                update_time_end: '',
                field: '',
                keyword: '',
            },
            statusOpt: {
                '0': '禁用',
                '1': '启用'
            },
            total: 10,
            roleOpt: {},
            total: 10,
            self: this,
            tableData: []
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            // init search info
            if (this.$route.params.back == 1 && sessionStorage.searchInfo) {
                let sessionData = JSON.parse(sessionStorage.searchInfo);

                if (sessionData.editDate instanceof Array) {
                    sessionData.editDate = sessionData.editDate.map(item => {
                        if (item) {
                            return new Date(item);
                        }
                    });
                }

                this.option = Object.assign(this.option, sessionData);
                sessionStorage.searchInfo = '';
            }
            this.searchInfo = JSON.parse(JSON.stringify(this.option));

            // search
            if ((this.option.keyword && !this.option.field) || (!this.option.keyword && this.option.field)) {
                this.$message.warning('关键字必须匹配搜索类型');
                return ;
            }

            this.tableLoading = true;
            let timeArr = this.timeZone_(this.option.editDate, this.$store.getters.getTimeZone);
            this.option.update_time_start = timeArr[0];
            this.option.update_time_end = timeArr[1];

            let params = {};
            for (let i in this.option) {
                if (i !== 'editDate') {
                    params[i] = this.option[i];
                }
            }

            this.$http.get('base/role/list', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data.list;
                    this.total = data.total;
                }
            });
        },
        removeItem (row) {
            this.$confirm('是否删除该项?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('base/role/delete', {id: row.id}).then(res => {
                    if (res.body.code == 0) {
                        this.getData();
                        this.$message.success(res.body.message);
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
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.page_size = val;
            this.getData();
        },
        edit (id) {
            sessionStorage.searchInfo = JSON.stringify(this.searchInfo);
            this.$router.push({
                name: 'authority_roleEdit',
                query: {
                    id: id,
                },
            })
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.option.field = '';
            this.option.keyword = '';
            this.option.status = '';
            this.option.editDate = [];
        },
    }
}
</script>

<style>
</style>