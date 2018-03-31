<!-- 价格模板管理 -->
<template>
    <div class="price-temp">
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
                <router-link v-if="self.showAction_('promotion/template/add')" :to="{name: 'marketing_price_priceTempAdd'}" class="el-button el-button--primary">
                    新增模板
                </router-link>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="模板ID"></el-table-column>
                <el-table-column prop="name" label="模板名称"></el-table-column>
                <el-table-column prop="remark" label="说明"></el-table-column>
                <el-table-column prop="paramNames" label="当前配置"></el-table-column>
                <el-table-column prop="siteCodes" label="当前使用网站"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('promotion/template/delete')" type="danger" size="small" @click="removeItem(scope.row)">删除</el-button>
                        <el-button v-if="self.showAction_('promotion/template/setting-site')" type="primary" size="small" @click="changeSiteOpt(scope.row)">配置站点</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="配置站点" v-model="siteDialog" size="tiny">
            <el-form label-width="140px" class="counpon-site-dialog">
                <el-form-item label="批量设置" class="batch-set">
                    <el-radio-group v-model="batchSet">
                        <el-radio @change.native="batchChange('1')" label="1">启用</el-radio>
                        <el-radio @change.native="batchChange('0')" label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-for="item in siteOpt" :label="item.name" :key="item.code">
                    <el-radio-group v-model="item.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postEdit" v-loading="setLoading" :disabled="setLoading">确 定</el-button>
                <el-button type="danger" @click="siteDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            option: {
                name: '',
                page: 1,
                page_size: 10,
                type: 0
            },
            siteId: '',
            self: this,
            tableLoading: false,
            setLoading: false,
            total: 10,
            siteDialog: false,
            siteOpt: [],
            tableData: [],
            batchSet: ''
        };
    },
    created () {
        this.getOpt();
        this.getData();
    },
    methods: {
        getOpt () {
            this.$http.get('base/public/site-list').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let obj = {};
                    data.forEach(item => {
                        item.status = '';
                        obj[item.code] = item;
                    });
                    this.siteOpt = obj;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            this.tableLoading = true;
            this.$http.get('promotion/template/lists', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.total = res.body.data.totalCount;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            })
        },
        removeItem (row) {
            this.$confirm('是否删除该模板，删除模板后只之前生成的价格不受影响?', '删除模板', {
                type: 'warning'
            }).then(() => {
                this.$http.post('promotion/template/delete', {id: row.id}).then(res => {
                    if (res.body.code == 0) {
                        this.getData();
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
        changeSiteOpt (row) {
            for (let i in this.siteOpt) {
                this.siteOpt[i].status = '0';
            }
            let data = row.siteCodes == '' ? [] : row.siteCodes.split(',');
            for (let i in data) {
                let item = data[i];
                if (this.siteOpt[item]) {
                    this.siteOpt[item].status = '1';
                }
            }

            this.batchSet = '';
            this.siteId = row.id;
            this.siteDialog = true;
        },
        postEdit () {
            let params = {};
            let id = this.siteId;
            params.templateSites = [];

            for (let i in this.siteOpt) {
                let item = this.siteOpt[i];
                if (item.status !== '') {
                    params.templateSites.push({
                        templateId: id,
                        siteCode: item.code,
                        status: item.status,
                    })
                }
            }

            this.setLoading = true;
            this.$http.post('promotion/template/setting-site', params).then(res => {
                this.setLoading = false;
                if (res.body.code === 0) {
                    this.getData();
                    this.siteDialog = false;
                    this.$message.success(res.body.message);
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.setLoading = false;
            })
        },
        batchChange (val) {
            for (let i in this.siteOpt) {
                this.siteOpt[i].status = val;
            }
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
            this.$refs.searchForm.resetFields();
        }
    }
}
</script>

<style lang="less">
    .counpon-site-dialog {
        max-height: 400px;
        overflow-y: auto;
    }

    .price-temp {
        .batch-set {
            border-bottom: 1px solid #ccc;
        }
    }
</style>