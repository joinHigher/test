<!-- GB分类页面配置列表 -->
<template>
    <div class="el-container">
        <el-form inline :model="option" ref="searchForm">
            <el-form-item label="请选择语言" prop="lang">
                <el-select v-model="option.lang" clearable>
                    <el-option v-for="(item, index) in langs" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="显示位置" prop="type">
                <el-select v-model="option.type" clearable>
                    <el-option v-for="(label, index) in typeOpt" :value="index" :label="label" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否显示" prop="is_show">
                <el-select v-model="option.is_show" clearable>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <div class="text-right el-sub-container">
                <el-button type="danger" class="fl" @click="batchRemove" :disabled="select.length === 0" v-if="self.showAction_('admin/category-page-setting/batch-delete')">批量删除</el-button>
                <el-button type="primary" @click="add" v-if="self.showAction_('admin/category-page-setting/add')">新增</el-button>
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
            </div>
        </el-form>
        <el-table :border="true" :data="tableData" v-loading="tableLoading" @selection-change="changeSelect" @row-click="clickRow" ref="dataTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="标题"></el-table-column>
            <el-table-column prop="type" label="显示位置">
                <template scope="scope">
                    {{typeOpt[scope.row.type]}}
                </template>
            </el-table-column>
            <el-table-column label="所属类目">
                <template scope="scope">
                    {{ typeof catOpt[scope.row.cat_id] === 'undefined' ? '' : catOpt[scope.row.cat_id].name }}
                </template>
            </el-table-column>
            <el-table-column prop="is_show" label="是否显示">
                <template scope="scope">
                    <span v-if="scope.row.is_show == 1">显示</span>
                    <span v-if="scope.row.is_show == 2">不显示</span>
                </template>
            </el-table-column>
            <el-table-column label="语言">
                <template scope="scope">
                    {{ langOpt[scope.row.lang] }}
                </template>
            </el-table-column>
            <el-table-column label="渠道">
                <template scope="scope">
                    <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="update_user" label="编辑人"></el-table-column>
            <el-table-column label="编辑时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column label="操作" column-key="handle">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('admin/category-page-setting/info')">编辑</el-button>
                    <el-button type="danger" size="small" @click="remove(scope.row.id)" v-if="self.showAction_('admin/category-page-setting/delete')">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-container last text-right">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
                page: 1,
                size: 20,
                lang: 'en',
                pipeline_code: '',
                type: '',
                is_show: '',
                start_time: '',
                end_time: '',
            },
            total: 0,
            langs: null,
            langOpt: {},
            // positionOpt: {},
            tableData: [],
            tableLoading: false,
            typeOpt: {
                '1': '头部banner',
                '2': '热推产品线',
                '3': '热推词',
                '4': '相关类目',
                '5': '热推品牌',
            },
            select: [],
            catOpt: []
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getOpt();
        this.getCatOpt();
        this.getData();
    },
    methods: {
        getOpt() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        // 获取分类
        getCatOpt () {
            this.$http.get('seo/public/category-all').then(res => {
                if (res.body.code === 0) {
                    this.catOpt = res.body.data;
                    console.log(this.catOpt);
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        // 获取语言列表
        getOpt() {
            return this.$http.get('admin/public/languages').then(res => {
                if (res.body.code !== 0) {
                    return Promise.reject();
                }
                this.langs = res.body.data;
                let langTexts = {};
                res.body.data.forEach((item) => {
                    langTexts[item.language_en] = item.language_ch;
                });
                this.langOpt = Object.assign({}, this.langOpt, langTexts);
                return Promise.resolve();
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
                return Promise.reject();
            });
        },
        getData(init) {
            this.tableLoading = true;
            let params = {};
            for (let i in this.option) {
                if (i != 'editDate') {
                    params[i] = this.option[i];
                }
            }

            let timeArr = this.timeZone_(this.option.editDate, this.$store.getters.getTimeZone);
            params.start_time = timeArr[0];
            params.end_time = timeArr[1];

            if (!init) {
                params.page = 1;
                params.size = 20;
            }

            params.is_show === '' && delete params.is_show;

            this.$http.get('admin/category-page-setting/list', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data.data;
                    this.total = data.total;
                }
            }).catch(err => {
                this.tableLoading = false;
            });
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
        // 删除
        remove(id) {
            this.$confirm('确认删除？').then(() => {
                this.$http.post('admin/category-page-setting/delete', {id: id}).then(res => {
                    if (res.body.code === 0) {
                        this.getData();
                        this.$message.success(res.body.message);
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            }).catch(() => {
                this.$message.info('已取消');
            });
        },
        batchRemove() {
            let ids = [];
            this.select.forEach(item => {
                ids.push(item.id);
            })
            this.$confirm('确认删除？').then(() => {
                this.$http.post('admin/category-page-setting/batch-delete', {ids: ids.join(',')}).then(res => {
                    if (res.body.code === 0) {
                        this.getData();
                        this.$message.success(res.body.message);
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            }).catch(() => {
                this.$message.info('已取消');
            });
        },
        // 分页
        changePageSize(val) {
            this.option.size = val;
            this.getData(true);
        },
        changePage(val) {
            this.option.page = val;
            this.getData(true);
        },
        resetForm() {
            this.$refs.searchForm.resetFields();
        },

        add() {
            this.$router.push({
                name: 'site_categoryAdd',
            })
        },
        edit(row) {
            this.$router.push({
                name: 'site_categoryEdit',
                query: {
                    id: row.id
                }
            })
        }
    }

}
</script>

<style>
</style>


