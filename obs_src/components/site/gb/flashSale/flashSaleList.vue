<!-- 品牌闪购 -->
<template>
    <div class="el-container gb-flash-sale">
        <el-form inline :model="option" ref="searchForm">
            <el-form-item label="请选择语言" prop="lang">
                <el-select v-model="option.lang" clearable filterable placeholder="请选择" @change="getDateArea">
                    <el-option v-for="(item, index) in langs" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择" @change="getDateArea">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间段" prop="tid" class="date-txt">
                <el-select :disabled="!option.lang || !option.pipeline_code" v-model="option.tid" clearable>
                    <el-option v-for="(label, index) in dateOpt" :value="label.id" :label="self.timeZone_(label.begin_time, timeZone) + ' 至 ' + self.timeZone_(label.end_time, timeZone)" :key="label.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌" prop="seo_title">
                <el-input v-model="option.seo_title"></el-input>
            </el-form-item>
            <el-form-item label="上线状态" prop="status">
                <el-select v-model="option.status" clearable>
                    <el-option v-for="(label, index) in statusOpt" :value="index" :label="label" :key="index"></el-option>
                </el-select>
            </el-form-item>

            <div class="text-right el-sub-container">
                <el-button type="danger" @click="remove(null, true)" class="fl" v-if="self.showAction_('promotion/brand-flashsale/batch-delete')">批量删除</el-button>
                <el-button type="primary" @click="push(null, true)" class="fl" v-if="self.showAction_('promotion/brand-flashsale/batch-publish')">批量发布</el-button>
                <el-button type="primary" @click="refresh" v-if="self.showAction_('promotion/brand-flashsale/rebuild-cache')">刷新缓存</el-button>
                <el-button type="primary" @click="add" v-if="self.showAction_('promotion/brand-flashsale/add')">新增</el-button>
                <a class="el-button el-button--info" :href="previewFlash" target="_blank">查看</a>
                <el-button type="primary" @click="editPage" v-if="self.showAction_('promotion/brand-flashsale/page-info')">页面编辑</el-button>
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
            </div>
        </el-form>
        <el-table :border="true" :data="tableData" v-loading="tableLoading" @selection-change="changeSelect" @row-click="clickRow" ref="dataTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="闪购banner">
                <template scope="scope">
                    <img :src="scope.row.banner" width="90px" height="120px">
                </template>
            </el-table-column>
            <el-table-column prop="seo_title" label="品牌"></el-table-column>
            <el-table-column prop="timeline" label="闪购时间段" width="200px">
                <template scope="scope">
                    {{ self.timeZone_(scope.row.begin_time, self.$store.getters.getTimeZone) }} 至 {{ self.timeZone_(scope.row.end_time, self.$store.getters.getTimeZone) }}
                </template>
            </el-table-column>
            <el-table-column prop="platform" label="平台"></el-table-column>
            <el-table-column label="语言">
                <template scope="scope">
                    {{ langTexts[scope.row.lang.toLowerCase()] }}
                </template>
            </el-table-column>
            <el-table-column label="渠道">
                <template scope="scope">
                    <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status_str" label="上线状态"></el-table-column>
            <el-table-column prop="layout" label="版式"></el-table-column>
            <el-table-column prop="sku" label="闪购商品SKU" width="200px"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="updater" label="操作人"></el-table-column>
            <el-table-column label="修改时间" width="110">
                <template scope="scope">
                    {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序"></el-table-column>
            <el-table-column label="操作" column-key="handle">
                <template scope="scope">
                    <a :href="scope.row.preview" target="_blank" class="el-button--small el-button el-button--info">预览</a>
                    <el-button type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('promotion/brand-flashsale/info')">编辑</el-button>
                    <el-button type="success" size="small" @click="push(scope.row.id)" v-if="self.showAction_('promotion/brand-flashsale/publish')" :disabled="scope.row.is_pub == 2">
                        <span v-if="scope.row.is_pub == 2">已</span>发布
                    </el-button>
                    <el-button type="danger" size="small" @click="remove(scope.row.id)" v-if="self.showAction_('promotion/brand-flashsale/delete')">删除</el-button>
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
            option: {
                pageNo: 1,
                pageSize: 20,
                lang: '',
                tid: null,
                status: null,
                seo_title: '',
                pipeline_code: ''
            },
            total: 0,
            previewFlash: '',
            langs: null,
            langTexts: {},
            dateOpt: [],
            // positionOpt: {},
            tableData: [],
            tableLoading: false,
            statusOpt: {
                '1': '未上线',
                '2': '预售',
                '3': '在售',
                '4': '已过期'
            },
            select: [],
        };
    },
    computed: {
        timeZone() {
            return this.$store.getters.getTimeZone;
        },
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
                // console.log(res.body.data);
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
        getDateArea() {
            if (this.option.lang === '' || this.option.pipeline_code === '') {
                return;
            }
            let params = {
                lang: this.option.lang,
                pipeline_code: this.option.pipeline_code,
            };
            this.option.tid = null;
            this.$http.get('promotion/brand-flashsale/get-time-select', {params: params}).then(res => {
                if (res.body.code === 0) {
                    this.dateOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        getData(init) {
            if (!init) {
                this.option.pageSize = 20;
                this.option.pageNo = 1;
            }
            this.tableLoading = true;
            this.$http.get('promotion/brand-flashsale/lists', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data.list;
                    this.total = data.totalCount;
                    this.previewFlash = data.previewFlash;
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
        // 分页
        changePageSize(val) {
            this.option.pageSize = val;
            this.getData(true);
        },
        changePage(val) {
            this.option.pageNo = val;
            this.getData(true);
        },
        resetForm() {
            this.$refs.searchForm.resetFields();
        },
        push (id, type) {
            let params = {};
            let src = 'promotion/brand-flashsale/publish';
            if (type) {
                src = 'promotion/brand-flashsale/batch-publish';
                params.ids = [];
                this.select.forEach(item => {
                    params.ids.push(item.id);
                });
            } else {
                params.id = id;
            }
            this.$confirm('确认要发布吗?', '提示').then(() => {
                this.$http.post(src, params).then(res => {
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
        remove (id, type) {
            let params = {};
            let src = 'promotion/brand-flashsale/delete';
            if (type) {
                src = 'promotion/brand-flashsale/batch-delete';
                params.ids = [];
                this.select.forEach(item => {
                    params.ids.push(item.id);
                });
            } else {
                params.id = id;
            }
            this.$confirm('确认要删除吗?', '提示').then(() => {
                this.$http.post(src, params).then(res => {
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
        edit (row) {
            this.$router.push({
                name: 'site_flashSaleEdit',
                query: {
                    id: row.id,
                }
            })
        },
        add () {
            this.$router.push({
                name: 'site_flashSaleAdd',
            })
        },
        editPage () {
            this.$router.push({
                name: 'site_flashSalePage',
            })
        },
        refresh () {
            this.$http.get('promotion/brand-flashsale/rebuild-cache').then(res => {
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.getData();
                } else {
                    this.$message.error(res.body.message);
                }
            })
        }
    }

}
</script>

<style lang="less">
    .gb-flash-sale {
        .date-txt {
            .el-form-item__content {
                width: 400px;
            }

        }
    }
</style>


