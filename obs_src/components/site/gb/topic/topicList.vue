<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label="所属平台" prop="platforms">
                    <el-select v-model="option.platforms" clearable filterable>
                        <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code">
                    <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语言" prop="lang">
                    <el-select v-model="option.lang" clearable filterable>
                        <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专题" prop="">
                    <el-input :placeholder="special.special_placeholder" v-model="special.special_value">
                        <el-select v-model="special.special_type" slot="prepend" @change="togglePlaceholder" class="el-select-special">
                            <el-option label="名称" value="1"></el-option>
                            <el-option label="ID" value="2"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="发布状态" prop="is_publish">
                    <el-select v-model="option.is_publish">
                        <el-option label="未发布" value="0"></el-option>
                        <el-option label="已发布" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关闭状态" prop="is_end">
                    <el-select v-model="option.is_end">
                        <el-option label="已关闭" value="1"></el-option>
                        <el-option label="开启中" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最后操作人" prop="update_user">
                    <el-input v-model="option.update_user"></el-input>
                </el-form-item>
            </el-form>
            <div class="text-right el-sub-container">
                <el-button type="primary" @click="render">筛选</el-button>
                <el-button type="danger" @click="resetForm">清空</el-button>
                <!--<el-button type="danger" class="pull-left" :disabled="!multipleSelection.length" @click="removeTopic('multi')" v-if="self.showAction_('admin/special/batch-delete')">批量删除</el-button>-->
                <router-link class="el-button el-button--primary" :to="{path: '/topic/topicEdit', query: { type: 'add' }}" v-if="self.showAction_('admin/special/add')">新建专题</router-link>
            </div>
            <div class="el-sub-container">
                <el-table border :data="tableData" ref="multipleTable" @selection-change="selectionChange" @row-click="clickRow">
                    <!--<el-table-column type="selection"></el-table-column>-->
                    <el-table-column prop="special_id" label="专题ID" width="80"></el-table-column>
                    <el-table-column prop="name" label="专题名称"></el-table-column>
                    <el-table-column label="是否启用" width="100">
                        <template scope="scope">
                            <div>{{ scope.row.is_end == 0 ? '是' : '否' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="platforms" label="适用平台"></el-table-column>
                    <el-table-column label="语言">
                        <template scope="scope">
                            <span>{{ self.langOpts[scope.row.lang] ? self.langOpts[scope.row.lang] : scope.row.lang }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="渠道" width="80">
                        <template scope="scope">
                            <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="memo" label="备注"></el-table-column>
                    <el-table-column prop="update_user" label="最后操作人" width="120"></el-table-column>
                    <el-table-column label="操作" column-key="handle" width="380">
                        <template scope="scope">
                            <a class="el-button el-button--success el-button--small" :href="scope.row.url" target="_blank">预览</a>
                            <router-link class="el-button el-button--primary el-button--small" :to="{path: '/topic/topicEdit?type=edit&special_id='+ scope.row.special_id +'&lang='+ scope.row.lang }" v-if="self.showAction_('admin/special/detail')">编辑</router-link>
                            <router-link class="el-button el-button--info el-button--small" :to="{path: '/admin/special-position/lists?special_id=' + scope.row.special_id +'&lang='+ scope.row.lang }" v-if="self.showAction_('admin/special-position/lists')">进入版块列表</router-link>
                            <!-- <el-button size="small" type="warning" @click="togglePublish(scope.row)" :disabled="scope.row.is_publish.toString() === '1'" v-if="self.showAction_('admin/special/toggle-publish')">{{ scope.row.is_publish.toString() === '0' ? '发布' : '已发布' }}</el-button> -->
                            <el-button size="small" type="primary" @click="toggleStartOrEnd(scope.row)" v-if="self.showAction_('admin/special/toggle-end')">{{ scope.row.is_end.toString() === '1' ? '开启' : '关闭' }}</el-button>
                            <el-button size="small" type="danger" @click="removeTopic(scope.row.id, scope.row.is_default_lang)" v-if="self.showAction_('admin/special/delete')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="el-sub-container text-right">
                    <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                self: this,
                isDataLoading: false,
                tableData: [],
                multipleSelection: [],
                option: {
                    special_id: '',
                    name: '',
                    platforms: '',
                    lang: '',
                    update_user: '',
                    pipeline_code: '',
                    is_end: '',
                    is_publish: '',
                    pageNo: 1,
                    pageSize: 20,
                },
                total: 0,
                platforms: [],
                langOpt: {},
                special: {
                    special_type: '1',
                    special_value: '',
                    special_placeholder: '请输入专题名称'
                },
                langOpts: {},
            };
        },
        computed: {
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.goTop();
            this.getOpt();
        },
        methods: {
            getOpt() {
                // 平台下拉
                this.$http.get('admin/public/platforms').then(res => {
                    if (res.body.code === 0) {
                        this.platforms = res.body.data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });

                // 语言下拉
                this.$http.get('admin/public/languages').then(res => {
                    this.isDataLoading = true;

                    if (res.body.code === 0) {
                        this.langOpt = res.body.data;
                        let obj = {};
                        this.langOpt.forEach(item => {
                            obj[item.language_en] = item.language_ch;
                        });
                        this.$set(this, 'langOpts', obj);

                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            getData() {
                this.tableData = [];
                // special_type: 1->名称;  2->ID
                if (parseInt(this.special.special_type) === 1) {
                    this.option.special_id = '';
                    this.option.name = this.special.special_value;
                } else if (parseInt(this.special.special_type) === 2) {
                    this.option.name = '';
                    this.option.special_id = this.special.special_value;
                }

                this.isDataLoading = true;
                this.$http.get('admin/special/list', {params: this.option}).then(res => {
                    if (res.body.code !== 0) {
                        this.$message.error(res.body.message);
                        return false;
                    }

                    this.total = res.body.data.total;
                    let tempData = res.body.data.data;

                    // 0.97 如果默认语言关闭，则不展示该条数据
                    tempData.forEach(item => {
                        if (typeof this.langOpts[item.lang] === 'undefined') {
                            return false;
                        }
                        this.tableData.push(item);
                    });

                    this.isDataLoading = false;
                })
            },
            render() {
                this.option.pageNo = 1;
                this.getData();
            },
            removeTopic(id, is_default_lang) {
                let isMulti = id === 'multi';
                let params = isMulti ? {} : {id: id};
                if (isMulti) {
                    let arr = [];
                    this.multipleSelection.forEach(item => {
                        arr.push(item.id);
                    });
                    params.ids = arr.join();
                }

                let title = '';
                if (is_default_lang === 1) {
                    title = '此操作将导致其他语言专题失去公用数据，是否需要删除？';
                } else {
                    title = '此操作将删除当前语言相关数据，是否需要删除？';
                }

                this.$confirm(title, '提示', {
                    type: 'warning'
                }).then(() => {
                    this.isDataLoading = true;
                    this.$http.post('admin/special/' + (isMulti ? 'batch-delete' : 'delete'), params).then(res => {
                        this.isDataLoading = false;
                        if (res.body.code === 0) {
                            this.getData();

                            this.$message({
                                type: 'success',
                                message: res.body.message
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                });
            },
            resetForm() {
                this.$refs['searchForm'].resetFields();

                this.special.special_type = '1';
                this.special.special_value = '';
                this.special.special_placeholder = '请输入专题名称';
            },
            selectionChange(val) {
                this.multipleSelection = val;
            },
            togglePlaceholder(val) {
                val = parseInt(val);
                if (val === 1) {
                    this.special.special_placeholder = '请输入专题名称';
                } else if (val === 2) {
                    this.special.special_placeholder = '请输入专题ID';
                }
            },
            // page
            ChangePage (val) {
                this.option.pageNo = val;
                this.getData();
            },
            ChangePageSize (val) {
                this.option.pageSize = val;
                this.getData();
            },
            clickRow(row, event, col) {
                if (col.columnKey !== 'handle') {
                    this.$refs['multipleTable'].toggleRowSelection(row);
                }
            },
            goTop () {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            },

            // 发布
            togglePublish (row) {
                let params = {
                    id: row.id,
                    is_publish: row.is_publish === 0 ? 1 : 0
                };

                this.$http.post('admin/special/toggle-publish', params).then(res => {
                   if (res.body.code === 0) {
                       this.$message({
                           type: 'success',
                           message: res.body.message
                       });
                       row.is_publish = params.is_publish;
                   } else {
                       this.$message.error(res.body.message);
                   }
                });
            },

            // 关闭/开启
            toggleStartOrEnd (row) {
                let params = {
                    id: row.id,
                    is_end: row.is_end === 0 ? 1: 0,
                };

                this.$http.post('admin/special/toggle-end', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                        row.is_end = params.is_end;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
        }
    }
</script>

<style lang="less">
    .mr10 {
        margin-right: 10px;
    }

    .el-select-special {
        width: 80px;
    }

    .special_model_table {
        width: 100%;
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        margin: 10px 0;
        text-align: center;
        font-size: 12px;
        padding: 0;
        tbody td,thead td {
            height: auto;
            margin: 0;
            padding: 0;
        }
    }
</style>
