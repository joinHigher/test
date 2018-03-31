<!-- 品牌列表 -->
<template>
    <div class="el-container gb-ad-list">
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
            <el-form-item>
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
            </el-form-item>
            <div class="text-right el-sub-container">
                <el-button type="danger" @click="remove(0)" class="fl" :disabled="select.length === 0" v-if="self.showAction_('promotion/brand-active/batch-delete')">批量删除</el-button>
                <el-button type="primary" @click="add" v-if="self.showAction_('promotion/brand-active/update')">品牌添加</el-button>
            </div>
        </el-form>
        <el-table :border="true" :data="tableData" v-loading="tableLoading" @selection-change="changeSelect" @row-click="clickRow" ref="dataTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="序号" width="80"></el-table-column>
            <el-table-column prop="brand_name" label="品牌标题"></el-table-column>
            <el-table-column prop="brand_code" label="品牌代码"></el-table-column>
            <el-table-column label="语言" width="100">
                <template scope="scope">
                    {{ langTexts[scope.row.lang] }}
                </template>
            </el-table-column>
            <el-table-column label="渠道" width="100">
                <template scope="scope">
                    <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="编辑时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="operator" label="编辑人"></el-table-column>
            <el-table-column label="操作" column-key="handle">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="preview(scope.row)">预览</el-button>
                    <el-button type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('promotion/brand-active/info')">编辑</el-button>
                    <el-button type="danger" size="small" @click="remove(scope.row.id)" v-if="self.showAction_('promotion/brand-active/delete')">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-container last text-right">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
            option: {
                page_size: 20,
                page: 1,
                lang: '',
                pipeline_code: '',
            },
            tableData: [],
            tableLoading: false,
            total: 1,
            select: [],
            langs: null,
            langTexts: {},
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
            this.$http.get('promotion/brand-active/lists', {params: this.option}).then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.total = res.body.data.totalCount;
                }
            }).catch(err => {

            });
        },
        preview (val) {
           window.open(val.url);
        },
        edit (row) {
            this.$router.push({
                name: 'site_brandEdit',
                query: {
                    id: row.id
                }
            });
        },
        add () {
            this.$router.push({
                name: 'site_brandEdit',
            });
        },
        remove (id) {
            let params = {};
            var src = 'promotion/brand-active/delete';
            if (id) {
                params.id = id;
            } else {

                src = 'promotion/brand-active/batch-delete';

                let ids = '';
                let temp = [];
                this.select.forEach(item => {
                    temp.push(item.id);
                });
                params.ids = temp;
            }

            this.$confirm('是否确认删除?', '提示信息').then(() => {
                this.$http.post(src, params).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            });
        },
        changePageSize (size) {
            this.option.page_size = size * 1;
            this.getData();
        },
        changePage (page) {
            this.option.page = page * 1;
            this.getData();
        },
        // 表格选择
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


