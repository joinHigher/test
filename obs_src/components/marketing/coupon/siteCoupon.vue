<template>
    <div>
        <div class="el-container">
            <el-form label-width="140px" inline ref="searchForm" :model="option">
                <el-form-item label="模板名称" prop="name">
                    <el-input v-model.trim="option.name"></el-input>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <router-link v-if="self.showAction_('promotion/coupon/import')" :to="{name: 'marketing_coupon_couponSet', query: {type: 0}}" class="el-button el-button--primary">
                    新增Coupon
                </router-link>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="模板ID"></el-table-column>
                <el-table-column label="模板名称">
                    <template scope="scope">
                        {{scope.row.name}}
                        <span v-if="scope.row.status === 0" class="color-danger">(停用)</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="说明"></el-table-column>
                <el-table-column prop="paramNames" label="当前配置项"></el-table-column>
                <el-table-column label="批量导入" width="150">
                    <template scope="scope">
                        <a v-if="self.showAction_('promotion/coupon/download-tpl')" class="el-button el-button--primary el-button--small" :href="downUrl + '?templateId=' + scope.row.id">下载模板</a>
                        <div v-if="self.showAction_('promotion/coupon/import')">
                            <el-upload class="export" :data="{templateId: scope.row.id, type: scope.row.classId}" :action="exportUrl" :on-success="handlePreview" :on-error="handleError" :before-upload="handleChange" :multiple="false" name="couponFile" ref="export" :show-file-list="false">
                                <el-button type="primary" size="small">批量导入</el-button>
                            </el-upload>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let exportUrl = this.$store.getters.getRootMenu + '/promotion/coupon/import';
        let downUrl = this.$store.getters.getRootMenu + '/promotion/coupon/download-tpl';
        return {
            option: {
                page: 1,
                page_size: 10,
                type: '1',
                name: '',
                couponOpreator: '1'
            },
            self: this,
            typeOpt: {},
            statusOpt: {},
            tableLoading: false,
            total: 10,
            tableData: [],
            exportUrl: exportUrl,
            downUrl: downUrl
        };
    },
    created () {
        this.getOpt();
        this.getData();
    },
    methods: {
        getOpt () {
            this.$http.get('promotion/index/public-get-dicts', {params: {names: 'activityType,activityStatus'}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;

                    for (let i in data) {
                        let item = data[i];
                        if (item.name === 'activityType') {
                            this.typeOpt[item.value] = item;
                        }
                        if (item.name === 'activityStatus') {
                            this.statusOpt[item.value] = item;
                        }
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            this.tableLoading = true;
            this.$http.get('promotion/template/general-lists', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.total = res.body.data.totalCount;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        removeItem (row) {
            this.$confirm('是否删除该项?', '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('promotion/activity/delete', {id: row.id}).then(res => {
                    if (res.body.code == 0) {
                        let index = this.tableData.indexOf(row);
                        this.tableData.splice(index, 1);
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
                    message: '已取消删除!'
                });
            });
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.page_size = val;
            this.getData();
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
        },
        handleChange (file) {
            if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                this.$message.error('请上传xls格式的文档');
                return false;
            } else {
                return true;
            }
        },
        handlePreview (res, file) {
            if (res.code === 0) {
                this.getData();
                let data = res.data;
                const h = this.$createElement;
                let temp = [];
                for (let index in data) {
                    let item = data[index];
                    if (index == 'totalSize') {
                        temp.push(h('p', '导入总条数:' + item));
                    }
                    if (index == 'successSize') {
                        temp.push(h('p', '导入成功的条数:' + item));
                    }
                    if (index == 'errorSize') {
                        temp.push(h('p', '导入失败的条数:' + item));
                    }
                    if (index == 'existCode') {
                        temp.push(h('p', '重复的coupon码:' + item));
                    }
                }
                this.$notify.success({
                    message: h('div', temp),
                    duration: 8000
                });
            } else {
                this.$message.error(res.message);
            }
            this.$refs.export.clearFiles();
        },
        handleError (err, file) {
            this.$message.error(err);
        }
    }
}
</script>

<style>

</style>