<template>
    <div class="department-list">
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <div>
                    <el-form-item label="快速搜索" prop="keyword">
                        <el-input v-model="option.keyword" class="quick-search">
                            <el-select filterable clearable v-model="option.field" slot="prepend" placeholder="请选择">
                                <el-option label="部门名称" value="name"></el-option>
                                <el-option label="最后修改人" value="update_user"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item label="部门">
                    <el-cascader filterable change-on-select class="department-tree" :options="departmentOpt" :props="prop" v-model="option.department_id" @change="changeDepartment"></el-cascader>
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
            <el-table border :data="tableData" v-loading="tableLoading" class="menu-list-table">
                <el-table-column prop="name" label="部门名称">
                    <template scope="scope">
                        <div :style="{'margin-left': (scope.row.treeInfo.level - 1) * 30 + 'px'}">
                             <a v-if="!scope.row.treeInfo.leaf" class="tree-btn" @click="toggle(scope.row, scope.$index)"><i :class="{'el-icon-plus': !scope.row.toggle, 'el-icon-minus': scope.row.toggle}"></i>{{scope.row.name}}</a>
                             <span v-else>{{scope.row.name}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="可访问站点">
                    <template scope="scope">
                        <span v-if="scope.row.site_code && scope.row.site_code.length > 0">{{scope.row.site_code.join(',')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="站点可访问分类">
                    <template scope="scope">
                        <span v-if="scope.row.site_code && scope.row.access_category.length > 0">{{scope.row.access_category.join(',')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最后修改时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.sys_update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="update_user" label="最后修改人"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('base/department/info')" size="small" type="primary" @click="goEdit(scope.row)">
                            <span v-if="ownDepartment == scope.row.id">查看</span>
                            <span v-else>编辑</span>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            searchInfo: {},
            ownDepartment: null,
            defaultIds: [],
            option: {
                keyword: '',
                field: '',
                editDate: [],
                update_time_start: '',
                update_time_end: '',
                department_id: [],
            },
            departmentOpt: [],
            tableLoading: false,
            statusOpt: {
                '0': '未启用',
                '1': '启用'
            },
            tableData: [],
            dataStroe: {
                states: {
                    _data: []
                }
            },
            prop: {
                value: 'id',
                label: 'name',
                children: 'children',
            }
        };
    },
    created () {
        this.getOpt();
    },
    methods: {
        getOpt () {
            this.$http.get('base/department/public-outline').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    if (data.department_ids && data.department_ids.length > 0) {
                        this.option.department_id = data.department_ids;
                        this.defaultIds = data.department_ids;
                        this.ownDepartment = data.department_ids.slice(-1)[0];
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
            if (this.option.keyword && !this.option.field || !this.option.keyword && this.option.field) {
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

            this.$http.get('base/department/list', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data.list;
                    this.tableData = data;
                }
            });
        },
        toggle (row, index) {
            if (!row.toggle) {
                this.tableData = this.tableData.slice(0, index + 1).concat(row.children).concat(this.tableData.slice(index + 1, this.tableData.length));
                row.toggle = true;
            } else {
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
        changeDepartment (val) {
        },
        goEdit (row) {
            sessionStorage.searchInfo = JSON.stringify(this.searchInfo);
            this.$router.push({
                name: 'authority_departmentEdit',
                query: {
                    id: row.id,
                    editable: this.ownDepartment == row.id ? 1 : 0
                },
            })
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.option.field = '';
            this.option.department_id = this.defaultIds;
        }
    }
}
</script>

<style lang="less">
    .department-list {
        .department-tree {
            width: 500px;
        }
    }
</style>