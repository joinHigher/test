<!-- 新手导购列表 -->
<template>
    <div class="el-container gb-guide">
        <el-form inline :model="option" ref="searchForm">
            <el-form-item label="语言" prop="lang">
                <el-select v-model="option.lang" clearable filterable>
                    <el-option v-for="(item, index) in langs" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <div class="text-right el-sub-container">
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
                <el-button type="primary" @click="add" v-if="self.showAction_('promotion/new-shopping-guide/add')">新增模块</el-button>
                <el-button type="primary" @click="editPage" v-if="self.showAction_('promotion/new-shopping-guide/page-info')">页面编辑</el-button>
            </div>
        </el-form>
        <el-table :border="true" :data="tableData" v-loading="tableLoading" @selection-change="changeSelect" @row-click="clickRow" ref="dataTable">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="temp_type_str" label="模板类型"></el-table-column>
            <el-table-column prop="sort_order" label="排序"></el-table-column>
            <el-table-column prop="platform" label="适用平台"></el-table-column>
            <el-table-column label="语言">
                <template scope="scope">
                    {{ langTexts[scope.row.lang] }}
                </template>
            </el-table-column>
            <el-table-column label="渠道">
                <template scope="scope">
                    <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作时间" width="180">
                <template scope="scope">
                    {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="updater" label="最后操作人"></el-table-column>
            <el-table-column label="操作" column-key="handle">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('promotion/new-shopping-guide/info')">编辑</el-button>
                    <el-button type="danger" size="small" @click="remove(scope.row)" v-if="self.showAction_('promotion/new-shopping-guide/delete')">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-container last text-right">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="option.pageNo" :page-sizes="[20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableLoading: false,
            langs: null,
            langTexts: {},
            option: {
                pageNo: 1,
                pageSize: 20,
                lang: '',
                pipeline_code: '',
            },
            total: 1,
            tableData: [],
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getLangs();
        this.getData();
    },
    methods: {
        // 获取语言列表
        getLangs() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code !== 0) {
                    return;
                }
                this.langs = res.body.data;
                let langTexts = {};
                res.body.data.forEach((item) => {
                    langTexts[item.language_en] = item.language_ch;
                });
                this.langTexts = Object.assign({}, this.langTexts, langTexts);
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getData() {
            this.$http.get('promotion/new-shopping-guide/lists', {params: this.option}).then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.total = res.body.data.totalCount;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });
        },
        remove(row) {
            this.$confirm('确认要删除吗?', '提示').then(() => {
                this.$http.post('promotion/new-shopping-guide/delete', {id: row.id}).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message.info('已取消');
            })
        },
        edit(row) {
            this.$router.push({
                name: 'site_guideEdit',
                query: {
                    id: row.id,
                }
            });
        },
        add() {
            this.$router.push({
                name: 'site_guideAdd',
            });
        },
        editPage() {
            this.$router.push({
                name: 'site_guidePage',
            });
        },
        changePageSize(val) {
            this.option.pageSize = val;
            this.getData();
        },
        changePage(val) {
            this.option.pageNo = val;
            this.getData();
        },
        changeSelect(val) {
            this.select = val;
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
        resetForm() {
            this.$refs.searchForm.resetFields();
        },
    }

}
</script>

<style lang="less">

</style>


