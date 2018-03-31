<template>
    <div>
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <div>
                    <el-form-item label="快速搜索" prop="field">
                        <el-input v-model="option.keyword" class="quick-search">
                            <el-select filterable v-model="option.field" slot="prepend" placeholder="请选择">
                                <el-option v-for="(item, index) in fieldOpt" :key="index" :label="item" :value="index"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item label="操作记录表" prop="record_table">
                    <el-select filterable v-model="option.record_table" placeholder="请选择">
                        <el-option v-for="(item, index) in tableOpt" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="修改时间" prop="editDate">
                    <el-date-picker v-model="option.editDate" type="datetimerange" :editable="false"></el-date-picker>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getData('search')">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>  
        </div>
        <div class="el-container">
            <el-table :border="true" :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="日志ID"></el-table-column>
                <el-table-column label="操作时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="日志标题">
                    <template scope="scope">
                        <div v-html="scope.row.title"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="request_route" label="请求路由"></el-table-column>
                <el-table-column prop="ip" label="操作ip"></el-table-column>
                <el-table-column label="日志详情">
                    <template scope="scope">
                        <el-button type="primary" size="small" v-if="self.showAction_('admin/admin-log/detail')" @click="getInfo(scope.row.id)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[20, 100, 200]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="预览" v-model="prevDialog" size="large">
            <div v-html="info" class="log-info"></div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            tableLoading: false,
            self: this,
            option: {
                page: 1,
                page_size: 20,
                field: '',
                keyword: '',
                record_table: '',
                editDate: [],
                create_time_from: '',
                create_time_to: ''
            },
            prevDialog: false,
            info: '',
            total: 10,
            tableData: [],
            fieldOpt: {},
            tableOpt: {},
            optForm: {
                request_route2name: ''
            }
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData (search) {
            if (search === 'search') {
                this.option.page = 1;
                this.option.page_size = 20;
            }
            this.tableLoading = true;

            let timeArr = this.timeZone_(this.option.editDate, this.$store.getters.getTimeZone);
            this.option.create_time_from = timeArr[0];
            this.option.create_time_to = timeArr[1];

            let params = {}; 
            for (let i in this.option) {
                if (i !== 'editDate') {
                    params[i] = this.option[i];
                }
            }

            this.$http.get('admin/admin-log/list', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data.data;
                    this.total = data.total * 1;
                    this.tableOpt = data.tables;
                    this.fieldOpt = data.fields;
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        getInfo (id) {
            this.$http.get('admin/admin-log/detail', {params: {id: id}}).then(res => {
                if (res.body.code == 0) {
                    this.info = res.body.data.detail;
                    this.prevDialog = true;
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
            this.option.keyword = '';
        }
    }
}
</script>

<style>
</style>