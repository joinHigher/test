<!-- sponsored列表 -->
<template>
    <div class="el-container gb-flash-sale">
        <el-form inline :model="option" label-width="100px" ref="searchForm">
            <el-form-item label="SKU" prop="sku">
                <el-input v-model="option.sku"></el-input>
            </el-form-item>
            <el-form-item label="仓库" prop="wid">
                <el-select :disabled="wareOpt.length == 0" v-model="option.wid">
                    <el-option v-for="item in wareOpt" :key="item.virWhCode" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属顶级分类" prop="top_cat_id">
                <el-select clearable filterable :disabled="catOpt.length == 0" v-model="option.top_cat_id">
                    <el-option v-for="item in catOpt" :key="item.id" :value="item.id" :label="item.categoryMultiLang.categoryName"></el-option>
                </el-select>
            </el-form-item>
            <div class="text-right el-sub-container">
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
                <el-button type="primary" @click="addDialog = true" v-if="self.showAction_('admin/goods-sponsored/add')">添加</el-button>
                <el-button class="fl" type="danger" @click="remove(null, 'batch')" :disabled="select.length === 0" v-if="self.showAction_('admin/goods-sponsored/delete')">批量删除</el-button>
            </div>
        </el-form>
        <el-table :border="true" :data="tableData" v-loading="tableLoading" @selection-change="changeSelect" @row-click="clickRow" ref="dataTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="sku" label="SKU"></el-table-column>
            <el-table-column prop="goodTitle" label="商品标题"></el-table-column>
            <el-table-column prop="mailImage" label="图片">
                <template scope="scope">
                    <img v-if="scope.row.mainImage" :src="self.domain + scope.row.mainImage.imgUrl" width="90px" height="120px">
                </template>
            </el-table-column>
            <el-table-column label="所属顶级分类">
                <template scope="scope">
                    <span v-if="catOpt[scope.row.top_cat_id]">{{catOpt[scope.row.top_cat_id].categoryMultiLang.categoryName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="wid" label="仓位"></el-table-column>
            <el-table-column prop="shopPrice" label="本店售价"></el-table-column>
            <el-table-column prop="stock" label="库存"></el-table-column>
            <el-table-column prop="goodsStatus" label="上下架状态"></el-table-column>
            <el-table-column prop="order" label="排序">
                <template scope="scope">
                    <el-button type="text" v-if="!scope.row.editable" @click="scope.row.editable = true">
                        {{scope.row.order}}
                    </el-button>
                    <el-input v-if="scope.row.editable" v-model="scope.row.order" @blur="changeOrder(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" column-key="handle">
                <template scope="scope">
                    <el-button type="danger" size="small" @click="remove(scope.row)" v-if="self.showAction_('admin/goods-sponsored/delete')">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-container last text-right">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="新增" v-model="addDialog" size="tiny">
            <el-form label-width="100px" :model="addForm" ref="addForm" :rules="addRule">
                <el-form-item label="商品编码" prop="sku_wid">
                    <el-input v-model="addForm.sku_wid" type="textarea" :rows="6"></el-input>
                    <span>SKU以英文逗号分隔，格式为SKU+仓代码</span>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input v-model="addForm.order"></el-input>
                    <span>0-999，排序越大越靠前</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="add">新增</el-button>
                <el-button type="danger" @click="addDialog = false">返回</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let checkInt = (rule, value, callback) => {
            let val = value * 1;
            if (Number.isInteger(val) && val >= 0 && val <= 999) {
                callback();
            } else {
                callback(new Error('排序为0到999的整数'));
            }
        }
        return {
            self: this,
            addDialog: false,
            tableLoading: false,
            tableData: [],
            option: {
                top_cat_id: '',
                wid: '',
                page: 1,
                page_size: 20,
                sku: '',
            },
            total: 1,
            addForm: {
                sku_wid: '',
                order: '0',
            },
            select: [],
            catOpt: [],
            wareOpt: {},
            addRule: {
                sku_wid: [{
                    required: true,
                    message: '该项不能为空'
                }],
                order: [{
                    validator: checkInt,
                }]
            }
        };
    },
    created () {
        this.getOpt();
        this.getData();
    },
    computed: {
        domain () {
            return this.$store.getters.getDomain + '/';
        },
    },
    methods: {
        getOpt() {
            this.$http.get('admin/public/sale-warehouses').then(res => {
                if (res.body.code === 0) {
                    this.wareOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });

            this.$http.get('admin/public/top-category-all').then(res => {
                if (res.body.code === 0) {
                    this.catOpt = res.body.data.list;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });
        },
        getData() {
            this.tableLoading = true;
            this.$http.get('admin/goods-sponsored/list', {params: this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data.data;

                    data.forEach(item => {
                        for (let i in item.info) {
                            item[i] = item.info[i];
                        }
                        item.editable = false;
                    })

                    this.tableData = data;
                    this.total = res.body.data.total;
                } else {
                    this.$message.error(res.body.message);
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
            if (col && col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
        resetForm () {
            this.$refs.searchForm.resetFields();
        },
        add () {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    let params = {};
                    params.order = this.addForm.order;
                    params.sku_wid = this.addForm.sku_wid;
                    this.$http.post('admin/goods-sponsored/add', params).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.addDialog = false;
                            this.getData();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {

                    });
                }
            })
        },
        remove(row, type){
            let ids;
            if (type == 'batch') {
                ids = [];
                this.select.forEach(item => {
                    ids.push(item.id);
                });
                ids = ids.join(',');
            } else {
                ids = row.id
            }
            this.$confirm('确认删除?','提示').then(() => {
                this.$http.post('admin/goods-sponsored/delete', {ids: ids}).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            })
        },
        changePageSize(val) {
            this.option.page_size = val;
            this.getData();
        },
        changePage(val) {
            this.option.page = val;
            this.getData();
        },
        async changeOrder(row) {
            let val = row.order * 1;
            if (!Number.isInteger(val) || val < 0 || val > 999) {
                this.$message.error('排序为0到999的整数');
                return;
            }
            let params = {
                id: row.id,
                order: row.order
            }
            const data = await this.httpPost_('admin/goods-sponsored/edit', params);
            row.editable = false;
            this.$message.success(data.message);
        },
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


