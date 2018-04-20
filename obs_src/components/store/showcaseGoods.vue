<!-- 橱窗商品 -->
<template>
    <div class="shocase-goods el-container">
        <p class="el-sub-container">橱窗：<strong>{{name}}</strong></p>
        <el-form inline label-width="100px" :model="option" ref="searchForm">
            <el-form-item clearable fifterable label="可售状态" prop="goodStatus" ref="searchForm">
                <el-select v-model="option.goodStatus">
                    <el-option v-for="(item, index) in statusOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属仓库" prop="virWhCode">
                <el-select clearable fifterable v-model="option.virWhCode">
                    <el-option v-for="(item, index) in wareObj" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="goodSn">
                <el-input v-model="option.goodSn" placeholder="请输入SKU"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">搜索</el-button>
                <el-button type="danger" @click="resetForm">清空</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button type="primary" @click="addDialog = true" :disabled="this.total >= 50">添加商品</el-button>
            </el-form-item>
        </el-form>
        <div class="text-left el-sub-container">
            <el-button type="danger" @click="removeGoods" :disabled="select.length === 0 || removeLoading" v-loading="removeLoading">移除</el-button>
        </div>
        <el-table :data="tableData" border v-loading="tableLoading" ref="dataTable" @selection-change="changeTableSku" @row-click="clickTableRow">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="商品信息" width="400">
                <template scope="scope">
                    <div class="info">
                        <img :src="scope.row.mainImage" width="90" height="120">
                        <div class="right">
                            <p class="title">{{scope.row.goodTitle}}</p>
                            <div class="sku">
                                SKU: {{scope.row.goodSn}}
                            </div>
                            <div class="price">
                                <p>${{scope.row.price}}</p>
                                <del>${{scope.row.shipPrice}}</del>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="virWhCnName" label="仓名称"></el-table-column>
            <el-table-column prop="stock" label="可售库存"></el-table-column>
            <el-table-column label="可售状态">
                <template scope="scope">
                    {{statusOpt[scope.row.goodsStatus]}}
                </template>
            </el-table-column>
            <el-table-column prop="grade" label="商品评分"></el-table-column>
            <el-table-column label="橱窗商品排序" column-key="handle">
                <template scope="scope">
                    <el-button type="text" @click="showEdit(scope.row)" v-if="!scope.row.show">{{scope.row.sort}}</el-button>
                    <el-input v-model="scope.row.sort" v-if="scope.row.show" @blur="edit(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="最后编辑时间" width="170">
                <template scope="scope">
                    {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
        </el-table>
        <div class="el-sub-container text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="添加橱窗商品" v-model="addDialog" size="large" class="marketing-goods-dialog" top="2%">
            <el-form inline label-width="100px" :model="addForm" ref="addForm">
                <el-form-item label="可售状态" prop="goodStatus">
                    <el-select clearable fifterable v-model="addForm.goodStatus">
                        <el-option v-for="(item, index) in statusOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属仓库" prop="virWhCode">
                    <el-select clearable fifterable v-model="addForm.virWhCode">
                        <el-option v-for="(item, index) in wareObj" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="goodSn">
                    <el-input v-model="addForm.goodSn" placeholder="请输入SKU"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getGoods">搜索</el-button>
                    <el-button type="danger" @click="resetDialog">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="dialogData" border v-loading="dialogLoading" ref="dialogTable" height="600" @selection-change="changeSku">
                <el-table-column type="selection" :selectable="disSelect"></el-table-column>
                <el-table-column label="商品信息" width="400">
                    <template scope="scope">
                        <div class="info">
                            <img :src="scope.row.mainImage" width="90" height="120">
                            <div class="right">
                                <p class="title">{{scope.row.goodTitle}}</p>
                                <div class="sku">
                                    SKU: {{scope.row.goodSn}}
                                </div>
                                <div class="price">
                                    <p>${{scope.row.price}}</p>
                                    <del>${{scope.row.shipPrice}}</del>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="virWhCnName" label="仓名称"></el-table-column>
                <el-table-column prop="stock" label="可售库存"></el-table-column>
                <el-table-column prop="goodsStatus" label="可售状态"></el-table-column>
                <el-table-column label="店铺橱窗">
                    <template scope="scope">
                        <span v-if="scope.row.windowNameList">{{scope.row.windowNameList.join(',')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="grade" label="商品评分"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="170">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="排序" columnKey="handle">
                    <template scope="scope">
                        <el-input v-model="scope.row.sort"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="ChangeDialogPageSize" @current-change="ChangeDialogPage" :current-page="addForm.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="addForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dialogTotal"></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addGoods" :disabled="addLoading || selectSku.length === 0" v-loading="addLoading">确 定</el-button>
                <el-button @click="addDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>
    export default {
        data() {
            let required = [{required: true, message: '该项不能为空'}];
            return {
                name: unescape(this.$route.query.name),
                self: this,
                id: '',
                option: {
                    shopCode: this.$route.query.shopCode,
                    windowId: this.$route.query.id,
                    pageNo: 1,
                    pageSize: 20,
                    virWhCode: '',
                    goodSn: '',
                    goodStatus: '',
                },
                total: 1,
                removeLoading: false,
                tableData: [],
                tableLoading: false,
                statusOpt: {
                    '2': '上架',
                    '3': '下架'
                },
                //
                dialogData: [],
                dialogLoading: false,
                dialogTotal: 1,
                addDialog: false,
                addLoading: false,
                addForm: {
                    goodStatus: '',
                    goodSn: '',
                    virWhCode: '',
                    pageSize: 20,
                    pageNo: 1,
                    shopCode: this.$route.query.shopCode,
                },
                select: [],
                selectSku: [],
                wareObj: {},
            };
        },
        created() {
            this.getOpt();
            this.getData();
        },
        methods: {
            async getOpt() {
                let data = await this.httpGet_('promotion/index/public-virtual-wares');
                let temp = {};
                data.forEach(item => {
                    temp[item.virWhCode] = item.virWhCnName;
                });
                this.wareObj = temp;
            },
            async getData () {
                this.tableLoading = true;
                try {
                    let data = await this.httpGet_('store/cabinet-goods/list', {params: this.option});

                    data.list.forEach(item => {
                        item.show = false;
                    });
                    this.tableData = data.list;
                    this.total = data.totalCount;
                } finally {
                    this.tableLoading = false;
                }
            },
            async getGoods () {
                this.dialogLoading = true;
                try {
                    let data = await this.httpGet_('store/store-goods/list', {params: this.addForm});
                    this.dialogData = data.list;
                    this.dialogTotal = data.totalCount;
                } finally {
                    this.dialogLoading = false;
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
            ChangeDialogPage (val) {
                this.addForm.pageNo = val;
                this.getGoods();
            },
            ChangeDialogPageSize (val) {
                this.addForm.pageSize = val;
                this.getGoods();
            },
            async addGoods () {
                let temp = [];
                let flag = true;

                this.selectSku.forEach(item => {
                    if (item.sort !== '') {
                        if (item.sort != item.sort * 1 || item.sort * 1 < 0 || !Number.isInteger(item.sort * 1)) {
                            flag = false;
                        }
                    }

                    temp.push({
                        virWhCode: item.virWhCode,
                        goodSn: item.goodSn,
                        sort: item.sort ? item.sort : 0,
                    });
                });
                if (!flag) {
                    this.$message.error('所选商品的排序应为大于等于0的整数')
                    return;
                }
                let params = {
                    windowId: this.option.windowId,
                    windowGoodsList: temp,
                }
                const data = await this.httpPost_('store/cabinet-goods/add', params);
                this.$message.success(data.message);
                this.addDialog = false;
                this.getData();
            },
            async edit (row) {
                row.sort = row.sort || 0;
                let sort = row.sort;
                if (sort * 1 == sort && Number.isInteger(sort * 1) && sort * 1 >= 0) {
                } else {
                    this.$message.error('排序值为大于等于0的整数');
                    return false;
                }

                let params = {
                    id: row.id,
                    sort: sort,
                }

                const data = await this.httpPost_('store/cabinet-goods/edit', params);
                this.$message.success(data.message);
                row.show = false;
            },

            removeGoods () {
                this.$confirm('确认删除?').then(async () => {
                    let temp = [];
                    this.select.forEach(item => {
                        temp.push(item.id);
                    })
                    let params = {
                        windowId: this.option.windowId,
                        ids: temp.join(','),
                    }
                    this.removeLoading = true;

                    try {
                        const data = await this.httpPost_('store/cabinet-goods/delete', params);
                        this.$message.success(data.message);
                        this.getData();
                    } finally {
                        this.removeLoading = false;
                    }
                })

            },
            // 表格交互优化
            changeSku (val) {
                this.selectSku = val;
            },
            // clickRow (row, event, col) {
            //     if (col.columnKey != 'handle') {
            //         this.$refs.dialogTable.toggleRowSelection(row);
            //     }
            // },
            changeTableSku (val) {
                this.select = val;
            },
            clickTableRow (row, event, col) {
                if (col.columnKey != 'handle') {
                    this.$refs.dataTable.toggleRowSelection(row);
                }
            },
            //
            resetForm () {
                this.$refs.searchForm.resetFields();
            },
            resetDialog () {
                this.$refs.addForm.resetFields();
            },
            showEdit (row) {
                row.show = !row.show;
            },
            disSelect (row) {
                let id = this.option.windowId;
                if (row.windowIdList && row.windowIdList.indexOf(id) != -1) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
</script>

<style lang="less">
    .shocase-goods {
        .cell {
            padding-top: 5px;
            padding-bottom: 5px;
        }
        .info {
            height: 100%;
            img {
                float: left;
            }

            .right {
                width: 270px;
                float: right;
            }

            .title {
                height: 72px;
            }

            .sku {
                float: left;
            }

            .price {
                width: 50px;
                float: right;
            }
        }

        .marketing-goods-dialog {

            .el-dialog {
                .el-dialog__header {
                    display: none;
                }
                .el-dialog__body {
                    padding-bottom: 0;
                    padding-top: 10px;

                    .el-table {
                        margin-top: 10px;
                    }
                }
            }
        }
    }
</style>
