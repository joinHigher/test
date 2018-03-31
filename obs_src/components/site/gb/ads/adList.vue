<!-- 广告位列表 -->
<template>
    <div class="el-container gb-ad-list">
        <el-form inline :model="option" ref="option">
            <el-form-item label="平台" prop="platform">
                <el-select v-model="option.platform" clearable>
                    <el-option v-for="(item, index) in platformOpt" :label="item" :value="index" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="语言" prop="lang">
                <el-select v-model="option.lang" clearable>
                    <el-option v-for="(item, index) in langs" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="显示位置" prop="position" class="position">
                <el-cascader v-model="option.position" class="tree" :options="catOpt" change-on-select :props="prop"></el-cascader>
            </el-form-item>
            <el-form-item label="显示状态" prop="is_show">
                <el-select v-model="option.is_show" clearable>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="update_time_from">
                <el-date-picker v-model="option.update_time_from" placeholder="请选择时间" type="datetime" :editable="false"></el-date-picker>
            </el-form-item>
            <el-form-item prop="update_time_to" label-width="0">
                <el-date-picker v-model="option.update_time_to" placeholder="请选择时间" type="datetime" :editable="false"></el-date-picker>
            </el-form-item>
            <el-form-item label="快速搜索" prop="value">
                <el-input v-model="option.value" class="quick-search">
                    <el-select filterable clearable v-model="option.field" slot="prepend" placeholder="请选择">
                        <el-option v-for="(item, index) in fieldOpt" :key="index" :label="item" :value="index">
                        </el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <div class="text-right el-sub-container">
                <el-button type="danger" class="fl" @click="remove(null, 'batch')" :disabled="select.length <= 0" v-if="self.showAction_('admin/banner/delete')">批量删除</el-button>
                <el-button type="primary" class="fl" @click="batchShow(1)" :disabled="select.length <= 0" v-if="self.showAction_('admin/banner/batch-show')">批量显示</el-button>
                <el-button type="primary" class="fl" @click="batchShow(0)" :disabled="select.length <= 0" v-if="self.showAction_('admin/banner/batch-show')">批量不显示</el-button>
                <el-button type="primary" @click="getData">筛选</el-button>
                <el-button type="danger" @click="resetForm">清空</el-button>
                <el-button type="primary" @click="add" v-if="self.showAction_('admin/banner/add')">添加banner</el-button>
            </div>
        </el-form>
        <el-table :border="true" :data="tableData" v-loading="tableLoading" @selection-change="changeSelect" @row-click="clickRow" ref="dataTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="banner ID"></el-table-column>
            <el-table-column prop="position" label="显示位置"></el-table-column>
            <el-table-column label="平台">
                <template scope="scope">
                    {{platformOpt[scope.row.platform]}}
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
            <el-table-column label="人群">
                <template scope="scope">
                    <span>{{ userTypeListOpt[scope.row.user_type] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="地区">
                <template scope="scope">
                    <span>{{ allCountryListOpt[scope.row.country_code] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="图片/字体logo" width="150px">
                <template scope="scope">
                    <img :src="scope.row.banner_url" width="120" height="90">
                </template>
            </el-table-column>
            <el-table-column prop="banner_link" label="跳转URL" column-key="handle">
                <template scope="scope">
                    <a :href="scope.row.banner_link">{{scope.row.banner_link}}</a>
                </template>
            </el-table-column>
            <el-table-column label="显示状态">
                <template scope="scope">
                    <i :class="{'el-icon-circle-check color-success': scope.row.is_show == '1', 'el-icon-circle-cross color-danger': scope.row.is_show == '0'}"></i>
                </template>
            </el-table-column>
            <el-table-column label="编辑时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
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
            <el-table-column prop="order" label="排序"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作" column-key="handle">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('admin/banner/edit')">编辑</el-button>
                    <el-button type="danger" size="small" @click="remove(scope.row)" v-if="self.showAction_('admin/banner/delete')">删除</el-button>
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
            tableLoading: false,
            tableData: [],
            searchForm: {},
            option: {
                update_time_from: '',
                update_time_to: '',
                platform: '',
                lang: '',
                pipeline_code: '',
                position: [],
                field: '',
                value: '',
                page: 1,
                page_size: 20,
                is_show: null
            },
            select: [],
            platformOpt: [],
            positionOpt: [],
            userTypeListOpt: [],
            allCountryListOpt: [],
            total: 0,
            imgUrl: {},
            //
            fieldOpt: {
                'id': 'banner ID',
                'remark': '备注',
            },
            // Tree
            catOpt: [],
            prop: {
                value: 'id',
                children: 'children',
                label: 'name'
            },
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
        this.initData();
        this.imgUrl = this.$store.getters.getUploadUrl;
    },
    methods: {
        // 表格选择
        changeSelect(val) {
            this.select = val;
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
        initData () {
            this.getplat();
            this.getLangs();
            this.getPosition();
            this.getUserTypeList();
            this.getAllCountryList();
            this.getData();
        },
        getData () {
            let params = {};
            for (let i in this.option) {
                if (i == 'position') {
                    if (this.option[i].length > 0) {
                        let position = this.option[i];
                        params[i] = position.join('-');
                    } else {
                        params[i] = '';
                    }
                } else {
                    params[i] = this.option[i];
                }
            }

            let time1 = params.update_time_from ? this.timeZone_(params.update_time_from, this.$store.getters.getTimeZone) : 0;

            let time2 = params.update_time_to ? this.timeZone_(params.update_time_to, this.$store.getters.getTimeZone) : 0;

            if (time1 && time2 && (time1 >= time2)) {
                this.$message.error('起始时间必须小于结束时间')
                return ;
            }

            params.update_time_from = time1 ? time1 : '';
            params.update_time_to = time2 ? time2 : '';

            this.tableLoading = true;
            this.$http.get('admin/banner/list', {params: params}).then(res => {
                this.tableLoading = false;

                if (res.body.code === 0) {
                    this.tableData = res.body.data.data;
                    this.total = res.body.data.total;
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        getplat () {
            var self = this;

            self.$http.get('admin/public/platforms').then(res => {
                if (res.body.code === 0) {
                    self.platformOpt = res.body.data;
                }
            });
        },
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
        getPosition() {
            this.$http.get('admin/public/banner-positions').then(res => {
                if (res.body.code === 0) {
                    this.catOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        //获取用户类型
        getUserTypeList() {
            this.$http.get('admin/public/user-type-list').then(res => {
                if (res.body.code === 0) {
                    this.userTypeListOpt = res.body.data;
                }
            });
        },
        //获取所有国家列表
        getAllCountryList() {
            this.$http.get('logistics/public/all-list').then(res => {
                if (res.body.code === 0) {
                    let tempData = res.body.data;
                    tempData.forEach(item => {
                       this.allCountryListOpt[item.countryCode] = item.countryName;
                    });
                }
            });
        },
        resetForm () {
            this.$refs.option.resetFields();
        },
        removeRow (item) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '确认删除', {
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/banner/delete', {id: item.id}).then(res=> {
                    if (res.body.code == 0) {
                        var index = this.tableData.indexOf(item);

                        if (index !== -1) {
                            this.tableData.splice(index, 1)
                        }
                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
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
        // 删除
        remove(row, type) {
            this.$confirm('确认删除?', '提示信息').then(() => {
                let id = '';
                if (type === 'batch') {
                    let temp = [];
                    this.select.forEach(item => {
                        temp.push(item.id);
                    });
                    id = temp.join(',');
                } else {
                    id = row.id;
                }
                this.$http.post('admin/banner/batch-delete', {ids: id}).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                }).catch(err => {

                });
            }).catch(err => {
                this.$message.info('已取消');
            })
        },
        // 编辑
        edit(row){
            this.$router.push({
                name: 'site_adEdit',
                query: {
                    id: row.id,
                }
            });
        },
        // 新增
        add(row) {
            this.$router.push({
                name: 'site_adAdd',
            });
        },
        // 批量显示/不显示
        batchShow (val) {
            let temp = [],
                params = {};
            this.select.forEach(item => {
                temp.push(item.id);
            });
            params.ids = temp.join(',');
            params.is_show = val;
            this.$http.post('admin/banner/batch-show', params).then(res => {
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
    .gb-ad-list {
        .tree {
            width: 400px;
        }

        .cell {
            img {
                margin-top: 8px;
            }
        }
    }
</style>


