<template>
    <div>
        <div class="el-container">
            <el-tabs class="full" active-name="1" @tab-click="changePlatform">
                <el-tab-pane v-for="(item, index) in platformOpt" :label="item" :name="index" :key="index"></el-tab-pane>
            </el-tabs>
            <el-form inline :model="option" label-width="100px" ref="option">
                <el-form-item label="请选择语言" prop="lang">
                    <el-select v-model="option.lang">
                        <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="item.language_en"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板名称" prop="name">
                    <el-input v-model="option.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container">
                <el-row>
                    <el-col :span="12">
                        <el-button v-if="self.showAction_('admin/index-market-template/batch-delete')" type="danger" @click="batchRemove">批量删除</el-button>
                    </el-col>
                    <el-col :span="12" class="text-right">
                        <router-link v-if="self.showAction_('admin/index-market-template/add')" :to="'/admin/index-market-template/edit'" class="el-button el-button--primary">新增模板
                        </router-link>
                    </el-col>
                </el-row>
            </div>
            <el-table border :data="tableData" @selection-change="rowSelectChange" v-loading="loading">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="模板名称"></el-table-column>
                <el-table-column prop="type" label="模板类型"></el-table-column>
                <el-table-column prop="order" label="排序"></el-table-column>
                <el-table-column label="平台">
                    <template scope="scope">
                        {{platformOpt[scope.row.platform]}}
                    </template>
                </el-table-column>
                <el-table-column prop="lang.language_ch" label="语言"></el-table-column>
                <el-table-column prop="status" label="显示状态"></el-table-column>
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
                <el-table-column label="编辑时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column inline-template label="操作">
                    <div>
                        <el-button v-if="self.showAction_('admin/index-market-template/info')" type="primary" size="small" @click="edit(row)">编辑</el-button>
                        <el-button v-if="self.showAction_('admin/index-market-template/delete')" type="danger" size="small" @click="remove(row)">删除</el-button>
                    </div>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            self: this,
            tableData: [],
            option: {
                name: '',
                lang: '',
                platform: '1',
                size: 20,
                page: 1
            },
            total: 10,
            ids: '',
            langOpt: {
                'en': {
                    language_ch: '',
                    language_en: '',
                }
            },
            platformOpt: [],
            loading: true,
        };
    },
    created() {
        this.initData();
    },
    methods: {
        initData() {
            this.getLang();
            this.getplatform();
        },
        resetForm() {
            this.option.name = '';
            this.option.lang = '';
        },
        getData() {
            this.loading = true;
            this.$http.get('admin/index-market-template/list', { params: this.option }).then(res => {
                this.loading = false;
                if (res.body.code === 0) {
                    let self = this;
                    this.tableData = res.body.data.data.map(function (item) {
                        item.lang = self.langOpt[item.lang] ? self.langOpt[item.lang] : item.lang;
                        item.status = item.status == "1" ? '开启' : '关闭';
                        return item;
                    });
                    this.total = res.body.data.total;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.loading = false;
            });
        },
        getplatform() {
            this.$http.get('admin/public/platforms').then(res => {
                if (res.body.code === 0) {
                    this.platformOpt = res.body.data;
                }
            });
        },
        getLang () {
            var self = this;
            self.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = {};
                    data.forEach(item => {
                        temp[item.language_en] = item;
                    });
                    self.langOpt = temp;
                    if (data.length > 0) {
                        this.option.lang = data[0].language_en;
                    } else {
                        this.option.lang = '';
                    }

                    this.getData();
                }
            });
        },
        changePlatform(val) {
            this.option.platform = val.name;
            this.initData();
        },
        remove(row) {
            this.$confirm('确认删除？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/index-market-template/delete', { id: row.id }).then(res => {
                    if (res.body.code == 0) {
                        let index = this.tableData.indexOf(row);
                        this.tableData.splice(index, 1);
                        this.total--;
                        this.$message({
                            message: res.body.message,
                            type: 'success'
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        ChangePage(val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize(val) {
            this.option.size = val;
            this.getData();
        },
        goback() {
            history.back();
        },
        rowSelectChange(val) {
            let temp = [];
            for (let i in val) {
                temp.push(val[i].id);
            }
            this.ids = temp.join(',');
        },
        edit(row) {
            this.$router.push({ path: '/admin/index-market-template/edit', query: { id: row.id, platform: row.platform} });
        },
        batchRemove() {
            if (this.ids !== '') {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('admin/index-market-template/batch-delete', { ids: this.ids }).then(res => {
                        if (res.body.code === 0) {
                            this.getData();
                            this.$message({
                                message: res.body.message,
                                type: 'success'
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
            } else {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一项！'
                });
            }
        },
    }
}
</script>
