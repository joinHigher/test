<template>
    <div class="user-list">
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <div>
                    <el-form-item label="快速搜索" prop="keyword">
                        <el-input v-model="option.keyword" class="quick-search">
                            <el-select filterable clearable v-model="option.field" slot="prepend" placeholder="请选择">
                                <el-option label="姓名" value="realname"></el-option>
                                <el-option label="用户名" value="username"></el-option>
                                <el-option label="邮箱" value="email"></el-option>
                                <el-option label="最后修改人" value="update_user"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item label="部门">
                    <el-cascader filterable change-on-select class="department-tree" :options="departmentOpt" :props="prop" v-model="option.department_id"></el-cascader>
                </el-form-item>
                <el-form-item label="超级管理员" prop="is_super">
                    <el-select filterable v-model="option.is_super" placeholder="请选择">
                        <el-option v-for="(item, index) in isSuperOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户状态" prop="status">
                    <el-select filterable v-model="option.status" placeholder="请选择">
                        <el-option v-for="(item, index) in statusOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="修改时间" prop="editDate">
                        <el-date-picker v-model="option.editDate" type="datetimerange" :editable="false"></el-date-picker>
                    </el-form-item>
                </div>

                <div class="text-right">
                    <el-button type="primary" @click="getData('search')">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <el-table border :data="tableData" @selection-change="chagenSelect" @row-click="clickRow" ref="dataTable" v-loading="tableLoading">
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="realname" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="department_name" width="180px" label="部门"></el-table-column>
                <el-table-column label="角色" width="140px">
                    <template scope="scope">
                        <div v-for="(item, index) in scope.row.siteRole">
                            <div v-for="(role, _index) in item.role_name" :key="_index">
                                {{item.site_code}} - {{role}}；
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="update_user" label="最后修改人"></el-table-column>
                <el-table-column label="最后修改时间" width="170px">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="最后登录时间" width="170px">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.last_login_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="超级管理员">
                    <template scope="scope">
                        {{isSuperOpt[scope.row.is_super]}}
                    </template>
                </el-table-column>
                <el-table-column label="用户状态">
                    <template scope="scope">
                        {{statusOpt[scope.row.status]}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" column-key="handle">
                    <template scope="scope">
                        <el-button type="primary" size="small" v-if="self.showAction_('base/admin/info') && (admin == '0' || username != scope.row.username)" :disabled="admin == '0' && scope.row.is_super === '1'" @click="goEdit(scope.row)">
                            <span v-if="username == scope.row.username">查看</span>
                            <span v-else>编辑</span>
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
            searchInfo: {},
            tableLoading: false,
            defaultIds: [],
            self: this,
            option: {
                page: 1,
                page_size: 20,
                field: '',
                keyword: '',
                department_id: [],
                is_super: '',
                status: '',
                editDate: [],
                update_time_start: '',
                update_time_end: ''
            },
            selectList: [],
            total: 10,
            departmentOpt: [],
            statusOpt: {
                '0': '禁用',
                '1': '启用',
                '2': '关闭',
            },
            isSuperOpt: {
                '1': '是',
                '0': '否'
            },
            tableData: [],
            valueArr: [],
            prop: {
                value: 'id',
                label: 'name',
                children: 'children'
            }
        };
    },
    created () {
        this.getOpt();
    },
    computed: {
        admin () {
            return this.$store.getters.getAdmin;
        },
        username () {
            return this.$store.getters.getUserName;
        },
    },
    methods: {
        getOpt () {
            this.$http.get('base/department/public-outline').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    if (data.department_ids && data.department_ids.length > 0) {
                        this.option.department_id = data.department_ids;
                        this.defaultIds = data.department_ids;
                        this.setDisabled(data.outline, data.department_ids.length);
                    }
                    this.departmentOpt = data.outline;
                    this.getData();
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        setDisabled (arr, times) {
            if (times > 1) {
                arr[0].disabled = true;
                this.setDisabled(arr[0].children, --times);
            }
            return;
        },
        getData (method) {
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
            if (method === 'search') {
                this.option.page = 1;
                this.option.page_size = 20;
            }
            if ((this.option.keyword && !this.option.field) || (!this.option.keyword && this.option.field)) {
                this.$message.warning('关键字必须匹配搜索类型');
                return ;
            }

            let timeArr = this.timeZone_(this.option.editDate, this.$store.getters.getTimeZone);
            this.option.update_time_start = timeArr[0];
            this.option.update_time_end = timeArr[1];

            let params = {};

            for (let i in this.option) {
                if (i !== 'editDate') {
                    params[i] = this.option[i];
                }
            }

            this.tableLoading = true;
            this.$http.get('base/admin/list', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data.list;
                    this.total = data.total * 1;
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
            this.option.field = '';
            this.option.department_id = this.defaultIds;
        },
        chagenSelect (val) {
            if (val.length === 0) {
                this.selectList = [];
            } else {
                this.selectList = val;
            }
        },
        goEdit (row) {
            sessionStorage.searchInfo = JSON.stringify(this.searchInfo);
            this.$router.push({
                name: 'authority_userEdit',
                query: {
                    id: row.id,
                    editable: this.$store.getters.getUserName == row.username ? 1 : 0
                }
            })
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        }
    }
}
</script>

<style lang="less">
    .user-list {
        .department-tree {
            width: 500px;
        }
    }
</style>