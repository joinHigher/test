<!-- 置顶管理 -->
<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">
            <div class="el-sub-container">
                <el-form inline :model="option" ref="searchForm">
                    <el-form-item label="语言" prop="lang">
                        <el-select v-model="option.lang" clearable placeholder="请选择">
                            <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道" prop="pipeline_code">
                        <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                            <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="显示位置" prop="position">
                        <el-select v-model="option.position">
                            <el-option v-for="(item, index) in positionList" :value="index" :label="item" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="内部SKU" prop="goods_sku">
                        <el-input v-model="option.goods_sku"></el-input>
                    </el-form-item>
                    <el-form-item label="所属分类" class="date-item" prop="cat_id">
                        <el-select v-model="option.cat_id" filterable>
                            <el-option v-for="item in catList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="显示状态" prop="is_show">
                        <el-select v-model="option.is_show" clearable>
                            <el-option label="启用" :value="1"></el-option>
                            <el-option label="禁用" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="text-right">
                        <el-button type="primary" @click="render">筛选</el-button>
                        <el-button type="danger" @click="resetForm">清空</el-button>
                    </div>
                </el-form>
            </div>
            <div class="el-sub-container">
                <el-row>
                    <el-col :span="12">
                        <el-button type="danger" @click="batchRemove" v-if="self.showAction_('seo/top-goods-setting/match-delete')">批量删除</el-button>
                    </el-col>
                    <el-col :span="12" class="text-right">
                        <router-link :to="{name: 'seo_topAdd'}" class="el-button el-button--primary" v-if="self.showAction_('seo/top-goods-setting/add')">
                            添加置顶信息
                        </router-link>
                    </el-col>
                </el-row>
            </div>
            <el-table border :data="tableData" @selection-change="selectKeywords" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="goods_sku" label="产品编码"></el-table-column>
                <el-table-column prop="keywords" label="关键词"></el-table-column>
                <el-table-column label="分类" width="300">
                    <template scope="scope">
                        <div v-for="(item, index) in scope.row.cat_id.split(',')" class="cat_show">
                            <span v-if="catList[item]" :title="catList[item].name">{{ catList[item].name }}</span>
                            <span v-else>未知</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="position_text" label="显示位置"></el-table-column>
                <el-table-column label="显示状态">
                    <template scope="scope">
                        <i @click="changeState(scope.row)" :class="{'el-icon-circle-check color-success': scope.row.is_show == '1', 'el-icon-circle-cross color-danger': scope.row.is_show == '0'}"></i>
                    </template>
                </el-table-column>
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
                <el-table-column label="开始时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.start_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.end_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" column-key="handle">
                    <template scope="scope">
                        <router-link :to="{name: 'seo_topEdit', query: {id: scope.row.id}}" class="el-button el-button--small el-button--primary" v-if="self.showAction_('seo/top-goods-setting/info')">
                            编辑
                        </router-link>
                        <el-button type="danger" size="small" @click="remove(scope.row)" v-if="self.showAction_('seo/top-goods-setting/delete')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
            self: this,
            isDataLoading: true,
            tableData: [],
            option: {
                goods_sku: '',
                position: '',
                keywords: '',
                cat_id: '',
                size: 20,
                page: 1,
                is_show: null,
                lang: '',
                pipeline_code: '',
            },
            total: 10,
            catList: {},
            positionList: {},
            queryCatlist: [],
            ids: '',
            langTexts: {},
            langs: null,
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getLangs();
        this.initData();
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
        initData () {
            Promise.all([this.$http.get('seo/public/category-all'), this.$http.get('seo/top-goods-setting/position-all')]).then((res) => {
                let data = res[0].body.data;
                this.catList = data;
                this.catList['0'] = {
                    id: 0,
                    name: '暂无分类'
                }
                this.positionList = res[1].body.data;
                this.getData();
            }).catch(err => {
                this.$message.error(err);
            });
        },
        getData () {
            this.isDataLoading = true;
            this.$http.get('seo/top-goods-setting/list', {params: this.option}).then(res => {
                this.isDataLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data.data;
                    this.tableData = data;
                    this.total = res.body.data.total;
                }
            }).catch(err => {
                this.isDataLoading = false;
            })
        },
        changeState (row) {
            var params = {};

            for (var i in row) {
                params[i] = row[i];
            }

            if (row.is_show === '0') {
                params.is_show = '1';
            } else {
                params.is_show = '0';
            }

            this.$http.post('seo/top-goods-setting/edit', params).then(res => {
                if (res.body.code === 0) {
                    this.$message({
                      message: res.body.message,
                      type: 'success'
                    });
                    row.is_show = params.is_show;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        render () {
            this.getData();
        },
        remove (row) {
            var self = this;

            self.$confirm('确认删除？', '提示', {
                type: 'warning'
            }).then(() => {
                self.$http.post('seo/top-goods-setting/delete', {id: row.id}).then(res => {
                    if (res.body.code == 0) {
                        var index = self.tableData.indexOf(row);

                        self.tableData.splice(index, 1);
                        self.total--;
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
        selectKeywords (val) {
            var temp = [];
            for (var i in val) {
                temp.push(val[i].id);
            }
            this.ids = temp.join(',');
        },
        batchRemove () {
            var self = this;
            if (self.ids !== '') {
                self.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    self.$http.post('seo/top-goods-setting/match-delete', {ids: self.ids}).then(res => {
                        if (res.body.code === 0) {
                            self.getData();
                            self.$message({
                              message: res.body.message,
                              type: 'success'
                            });
                        } else {
                            self.$message.error(res.body.message);
                        }
                    });
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            } else {
                self.$message({
                    type: 'warning',
                    message: '请至少选择一项！'
                });
            }
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
    }

}
</script>

<style lang="less" scoped>
    table .el-icon-circle-cross {cursor: pointer;}
    .cat_show {
        width: 280px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>


