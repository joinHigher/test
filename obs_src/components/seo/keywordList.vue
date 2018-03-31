<!-- 关键词列表 -->
<template>
    <div>

        <div class="el-container">
            <div>
                <el-form inline :model="option" ref="searchForm">
                    <el-form-item label="语言" prop="lang">
                        <el-select v-model="option.lang" clearable placeholder="请选择">
                            <el-option v-for="value in langOpt" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道" prop="pipeline_code">
                        <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                            <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="绑定分类：" prop="auto_cat_name">
                        <el-select v-model="option.cat_id" filterable clearable>
                            <el-option v-for="item in catList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字：" prop="keywords">
                        <el-input v-model="option.keywords"></el-input>
                    </el-form-item>
                    <el-form-item prop="select_mode">
                        <el-select clearable v-model="option.select_mode">
                            <el-option value="all" label="全匹配"></el-option>
                            <el-option value="left" label="左匹配"></el-option>
                            <el-option value="right" label="右匹配"></el-option>
                            <el-option value="fuzzy" label="模糊匹配"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="text-right">
                        <el-button type="primary" @click="getData()">筛选</el-button>
                        <el-button type="danger" @click="resetForm">清空</el-button>
                    </div>
                </el-form>

                <div class="el-sub-container">
                    <el-row>
                        <el-col :span="12">
                            <el-button type="danger" @click="batchRemove" v-if="self.showAction_('seo/abc-index-keyword/match-delete')">批量删除</el-button>
                        </el-col>
                        <el-col :span="12" class="text-right">
                            <el-button type="primary" @click="batchImportDlg.isDlgShow = true" v-if="self.showAction_('seo/abc-index-keyword/import')">批量导入关键词</el-button>
                            <el-button type="primary" @click="batchExportDlg.isDlgShow = true" v-if="self.showAction_('seo/abc-index-keyword/export')">批量导出关键词</el-button> &nbsp;
                            <a :href="downUrl"><el-button type="primary">下载关键词导入模板</el-button></a>
                        </el-col>
                    </el-row>
                </div>

                <el-table v-loading="isDataLoading" border :data="tableData" @selection-change="selectKeywords" @row-click="clickRow" ref="dataTable">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="id" label="关键字ID" width="100px"></el-table-column>
                    <el-table-column prop="keywords" label="关键字"></el-table-column>
                    <el-table-column prop="cat_name" label="绑定分类"></el-table-column>
                    <el-table-column prop="goods_count" label="商品数"></el-table-column>
                    <el-table-column prop="goods_count" label="近2周搜索量"></el-table-column>
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
                    <el-table-column label="操作" column-key="handle" width="100">
                        <template scope="scope" v-if="self.showAction_('seo/abc-index-keyword/info')">
                            <router-link :to="{name: 'seo_keywordEdit', query: {id: scope.row.id}}" class="el-button el-button--small el-button--primary">
                                编辑
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="el-container text-right">
                    <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[20, 100, 200]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </div>
        </div>

        <!-- 导入关键词弹窗S -->
        <el-dialog class="batch-import-dlg" title="导入关键词" v-model="batchImportDlg.isDlgShow" size="tiny">
            <el-form :model="batchImportDlg" label-width="40%" ref="batchImportForm">
                <el-form-item label="绑定语言：" prop="lang" :rules="[{required: true,message: '该项不能为空', trigger: 'change'}]">
                    <el-select v-model="batchImportDlg.lang" placeholder="请选择" :style="{ width: 'auto' }">
                        <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传EXCLE文件：">

                    <el-upload :data="{lang: batchImportDlg.lang}" :action="batchImportDlg.batchImportUrl" :on-success="handleBatchImportPreview" :on-error="handleBatchImportError" :file-list="batchImportDlg.fileList" :on-change="handleBatchImportChange" :multiple="false" :on-remove="handleBatchImportRemove" ref="batchImport" :auto-upload="false">
                        <el-button type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>

            <div class="el-sub-container">
                <p>提示</p>
                <ul>
                    <li>1、格式：.xls。</li>
                    <li>2、最大不超过10M</li>
                    <li>3、文件列对应关系：A=>关键字、 B=>URL、 C=>流量、 D=>排名、 E=>绑定分类 注：第一行默认是标题，不计入</li>
                </ul>
            </div>
            <div class="el-sub-container text-center">
                <el-button type="success" @click="submitBatchImport" :disabled="!importAble || importLoading" v-loading="importLoading">提交</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="batchImportDlg.isDlgShow = false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- 导入关键词弹窗E -->

        <!-- 批量导出关键字弹窗S -->
        <el-dialog class="batch-Export-dlg" title="批量导出关键词" v-model="batchExportDlg.isDlgShow" size="tiny">
            <el-form :model="batchExportDlg" label-width="120px" ref="batchExportFrom" :rules="exportRule">
                <el-form-item label="绑定语言" prop="lang">
                    <el-select v-model="batchExportDlg.lang" placeholder="请选择" :style="{ width: 'auto' }">
                        <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键字id开始" prop="idFrom" required>
                    <el-input v-model="batchExportDlg.idFrom"></el-input>
                </el-form-item>
                <el-form-item label="关键字id结束" prop="idTo" required>
                    <el-input v-model="batchExportDlg.idTo"></el-input>
                </el-form-item>
            </el-form>
            <div class="el-sub-container">
                <br>
                <p>每次最大只能导5000个。</p>
                <br>
                <!-- <p>上次导出日期：2017-05-15 15:13:06。id: 至。个数: 180</p> -->
                <br><br>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="batchExportDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" @click="submitBatchExportDlg">确定</el-button>
            </span>
        </el-dialog>
        <!-- 批量导出关键字弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let batchImportUrl = this.$store.getters.getRootMenu + '/seo/abc-index-keyword/import';
        let batchExportUrl = this.$store.getters.getRootMenu + '/seo/abc-index-keyword/export';
        let downUrl = this.$store.getters.getRootMenu + '/seo/abc-index-keyword/export-template';

        let checkID = (rule, value, callback) => {
            if (Number.isInteger(value * 1) && value * 1 > 0) {
                callback();
            } else {
                callback(new Error('id为正整数'))
            }
        }

        return {
            self: this,
            isDataLoading: true,
            importLoading: false,
            tableData: [],
            option: {
                lang: '',
                pipeline_code: '',
                cat_id: '',
                keywords: '',
                select_mode: 'all',
                size: 20,
                page: 1
            },
            langOpt: '',
            langTexts: {},
            batch: [],
            total: 10,
            idsOpt: {
                ids: '',
                keywords: ''
            },
            importAble: false,
            lastMessage: '',
            exportUrl: batchExportUrl,
            catList: {},

            downUrl: downUrl,
            batchImportDlg: {
                isDlgShow: false,
                isLoading: false,
                lang: 'en',
                batchImportUrl: batchImportUrl,
                fileList: []
            },
            batchExportDlg: {
                isDlgShow: false,
                isLoading: false,
                lang: '',
                idFrom: '',
                idTo: '',
                batchExportUrl: batchExportUrl
            },
            exportRule: {
                lang: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                idFrom: [{
                    validator: checkID,
                    trigger: 'blur'
                }],
                idTo: [{
                    validator: checkID,
                    trigger: 'blur'
                }],
            }
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },

    created () {
        this.getLang();
        this.getCat();
    },
    methods: {
        getLang () {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;

                    let langTexts = {};
                    res.body.data.forEach((item) => {
                        langTexts[item.language_en] = item.language_ch;
                    });
                    this.langTexts = Object.assign({}, this.langTexts, langTexts);
                }
            });
        },
        getCat () {
            this.$http.get('seo/public/category-all').then(res => {
                if (res.body.code === 0) {
                    var data = res.body.data;
                    data[0] = {
                        id: 0,
                        name: '暂无分类'
                    }
                    this.catList = data;

                    this.getData();
                }
            });
        },
        getData (lang) {
            let params = null;
            if (lang) {
                params = Object.assign({}, this.option, {
                    cat_id: '',
                    keywords: '',
                    select_mode: '',
                    size: 20,
                    page: 1,
                    lang: lang
                });
            } else {
                params = Object.assign({}, this.option);
            }
            this.isDataLoading = true;
            this.$http.get('seo/abc-index-keyword/list', { params }).then(res => {
                this.isDataLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data.data;
                    for (let item in data) {
                        let cat = data[item].bind_cat_id;
                        if (typeof this.catList[cat] == 'undefined') {
                            data[item].cat_name = '未知分类'
                        } else if (cat !== 0) {
                            data[item].cat_name = this.catList[cat].name;
                        } else {
                            data[item].cat_name = '暂无分类';
                        }
                    }
                    this.total = res.body.data.total;
                    this.tableData = data;
                }
            }).catch(err => {
                this.isDataLoading = false;
            })
        },
        batchRemove () {
            var self = this;

            if (this.batch.length > 0) {
                self.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    self.$http.post('seo/abc-index-keyword/match-delete', {ids: this.idsOpt.ids}).then(res => {
                        if (res.body.code == 0) {
                            this.getData();
                            self.$message({
                              message: res.body.message,
                              type: 'success'
                            });
                        } else {
                            self.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            } else {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一项！'
                });
            }
        },
        batchEdit () {
            if (this.batch.length > 0) {
                this.$router.push({
                    name: 'seo_keywordEdit',
                    query: {
                        ids: this.idsOpt.ids,
                        keywords: this.idsOpt.keywords
                    }
                });
            } else {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一项！'
                });
            }
        },
        selectKeywords (val) {
            var idsOpt = {
                ids: [],
                keywords: []
            };
            this.batch = val;
            for (var i in val) {
                idsOpt.ids[i] = val[i].id;
                idsOpt.keywords[i] = val[i].keywords;
            }
            idsOpt.ids = idsOpt.ids.join(',');
            idsOpt.keywords = idsOpt.keywords.join(',');
            this.idsOpt = idsOpt;
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
        batchExport () {
            if (this.batch.length > 0) {
                var params = this.idsOpt.ids.replace(',', '%2C');
                location.href = this.$store.getters.getRootMenu + '/seo/abc-index-keyword/export?ids=' + params;
            } else {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一项！'
                });
            }
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.size = val;
            this.getData();
        },
        goback () {
            history.back();
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.option.cat_id = '';
        },

        submitBatchImport () {
            this.importLoading = true;
            this.$refs.batchImportForm.validate(valid => {
                if (valid) {
                    this.$refs.batchImport.submit();
                } else {
                    this.importLoading = false;
                }
            });
        },
        handleBatchImportChange (file, fileList) {
            if (fileList.length > 0) {
                this.importAble = true;
            }
            if (this.batchImportDlg.fileList.length == 2) {
                this.batchImportDlg.fileList.slice(1);
            }
        },
        handleBatchImportRemove (file, fileList) {
            if (fileList.length === 0) {
                this.importAble = false;
            }
        },
        handleBatchImportPreview (res, file) {
            this.importLoading = false;
            if (res.code === 0) {
                this.batchImportDlg.isDlgShow = false;
                this.$notify.success({
                    message: res.message,
                    duration: 8000
                });
                this.getData();
            } else {
                this.$message.error(res.message);
            }
            this.$refs.batchImport.clearFiles();
        },
        handleBatchImportError (err, file) {
            this.importLoading = false;
            this.$message.error(err);
        },

        submitBatchExportDlg () {
            this.$refs.batchExportFrom.validate(valid => {
                if (valid) {
                    let params = {};
                    params.lang = this.option.lang;
                    params.start_id = this.batchExportDlg.idFrom;
                    params.end_id = this.batchExportDlg.idTo;

                    if (params.start_id * 1 >  params.end_id * 1) {
                        this.$message.warning('起始ID必须不大于结束ID');
                        return false;
                    }

                    let str = '?lang=' + params.lang + '&start_id=' + params.start_id + '&end_id=' + params.end_id;

                    location.href = this.$store.getters.getRootMenu + '/seo/abc-index-keyword/export' + str;
                    this.$message.success('已开始下载');
                    this.batchExportDlg.isDlgShow = false;
                }
            });

        }
    }

}
</script>

<style lang="less">
.export { display: inline-block; }
ul { list-style: none; }

.batch-Export-dlg {
    .el-dialog__body { padding-left: 15%; }
    .ipt-range { width: 97px; }
}
</style>


