<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/'}">站点管理</el-breadcrumb-item>
                <el-breadcrumb-item>自定义活动模板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-tabs class="full" active-name="1" @tab-click="changePlatform">
                <el-tab-pane v-for="(item, index) in platformOpt" :label="item" :name="index" :key="index"></el-tab-pane>
            </el-tabs>
            <el-form inline :model="option" label-width="100px" ref="option">
                <el-form-item label="模板名称" prop="name">
                    <el-input v-model="option.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="initData">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container">
                <el-row>
                    <el-col :span="12">
                        <el-button type="danger" @click="batchRemove" :disabled="!ids.length">批量删除</el-button>
                    </el-col>
                    <el-col :span="12" class="text-right">
                        <router-link :to="'/admin/index-market-template/edit'" class="el-button el-button--primary">新增活动
                        </router-link>
                    </el-col>
                </el-row>
            </div>
            <el-table border :data="tableData" @selection-change="rowSelectChange" v-loading="loading">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="活动ID"></el-table-column>
                <el-table-column label="活动截至时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.end_time, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="活动名称"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="activity_url" label="固定活动URL"></el-table-column>
                <el-table-column inline-template label="操作">
                    <div>
                        <el-button type="primary" size="small" @click="edit(row)">预览</el-button>
                        <el-button type="primary" size="small" @click="edit(row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="remove(row)">删除</el-button>
                    </div>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
                platform: '',
                size: 10,
                page: 1
            },
            total: 10,
            ids: '',
            langOpt: [],
            platformOpt: [],
            loading: true,
        };
    },
    created() {
        this.initData();
    },
    methods: {
        initData() {
            this.getplatform();
            this.getData();
        },
        resetForm() {
            this.option.name = '';
            this.getData();
        },
        getData() {
            this.$http.get('admin/activity/list', { params: this.option }).then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data;
                    this.total = res.body.data.length;
                } else {
                    this.$message.error(res.body.message);
                }
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
        changePlatform(val) {
            this.option.platform = val.label;
            this.initData();
        },
        remove(row) {
            this.$confirm('确认删除？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/activity/delete', { id: row.id }).then(res => {
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
        resetForm() {

        },
        rowSelectChange(val) {
            let temp = [];
            for (let i in val) {
                temp.push(val[i].id);
            }
            this.ids = temp.join(',');
        },
        edit(row) {
            this.$http.get('admin/activity/info', { params: { id: row.id }}).then(res => {
                console.log(res.body);
            });
            // this.$router.push({ path: '/admin/index-market-template/edit', query: { id: row.id } });
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
        format(timestamp) {
            if (typeof timestamp == 'undefined' || timestamp == null) {
                return '';
            }
            let date = new Date(timestamp);
            let str = '',
                year = date.getFullYear(),
                mouth = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                min = date.getMinutes(),
                second = date.getSeconds(),
                flag1 = '-',
                flag2 = ':';

            if (mouth < 10) {
                mouth = '0' + mouth;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (min < 10) {
                min = '0' + min;
            }
            if (second < 10) {
                second = '0' + second;
            }

            str = year + flag1 + mouth + flag1 + day + ' ' + hour + flag2 + min + flag2 + second;
            return str;
        },
    }
}
</script>
