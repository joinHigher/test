<!-- 价格监测列表 -->
<template>
    <div class="el-container monitor-list">
        <!--筛选条件-->
        <el-form inline :model="option" ref="searchForm">
            <el-form-item label="处理状态" prop="handle_status">
                <el-select v-model="option.handle_status" clearable placeholder="请选择" class="w100">
                    <el-option v-for="(item, index) in handleOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="监控状态" prop="monitor_status">
                <el-select v-model="option.monitor_status" clearable placeholder="请选择" class="w100">
                    <el-option v-for="(item, index) in monitorOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="抓取状态" prop="catch_status">
                <el-select v-model="option.catch_status" clearable placeholder="请选择" class="w100">
                    <el-option v-for="(item, index) in catchOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="限价状态" prop="limit_price_status">
                <el-select v-model="option.limit_price_status" clearable placeholder="请选择" class="w100">
                    <el-option v-for="(item, index) in limitOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="闪购状态" prop="flash_buy_status">
                <el-select v-model="option.flash_buy_status" clearable placeholder="请选择" class="w100">
                    <el-option v-for="(item, index) in flashOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品状态" prop="goods_status">
                <el-select v-model="option.goods_status" clearable placeholder="请选择" class="w100">
                    <el-option v-for="(item, index) in goodsOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="仓库选择" prop="warehouse">
                <el-select v-model="option.warehouse" clearable placeholder="请选择">
                    <el-option v-for="(item, index) in wareOpt" :key="index" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                </el-select>
            </el-form-item>
            <div>
                <el-form-item label="商品分类" prop="catList">
                    <el-cascader filterable change-on-select class="w400" :options="catOpt" :props="prop" v-model="option.catList" @change="changeDepartment"></el-cascader>
                </el-form-item>
                <el-form-item label="sku" prop="sku">
                    <el-input v-model="option.sku" placeholder="搜索sku,逗号隔开" class="w400"></el-input>
                </el-form-item>
                <el-form-item label="添加时间" prop="date">
                    <el-date-picker v-model="option.date" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
                </el-form-item>
            </div>
        </el-form>
        <div class="text-right el-sub-container">
            <el-button type="primary" @click="update" :disabled="checkRow === ''">更新价格</el-button>
            <el-button type="primary" @click="addDialog = true">添加sku</el-button>
            <el-button type="primary" @click="getData" v-loading="tableLoading" :disabled="tableLoading"><i class="el-icon-search"></i>筛选</el-button>
            <el-button type="danger" @click="resetFrom">清空</el-button>
            <a class="el-button el-button--success" :href="downUrl">导出</a>

            <el-upload class="export" :action="exportUrl" :on-success="handlePreview" :on-error="handleError" :before-upload="handleChange" :multiple="false" name="file" ref="export" :show-file-list="false">
                <el-button type="info">导入</el-button>
            </el-upload>
        </div>
        <!--筛选结果-->
        <div class="el-sub-container">
            <el-table :data="tableData" v-loading="tableLoading" border @selection-change="changeCheck" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="ID" prop="id"></el-table-column>
                <el-table-column label="SKU" prop="sku"></el-table-column>
                <el-table-column label="产品图片" width="127">
                    <template scope="scope">
                        <img width="90" height="120" :src="scope.row.goods_img">
                    </template>
                </el-table-column>
                <el-table-column label="产品标题" prop="goods_title" width="200"></el-table-column>
                <el-table-column label="本站当前售价价格" prop="current_price"></el-table-column>
                <el-table-column label="成本价$" prop="cost_price"></el-table-column>
                <el-table-column label="geekbuying价格" prop="geekbuying_price"></el-table-column>
                <el-table-column label="高出价格" prop="hight_price_1"></el-table-column>
                <el-table-column label="banggood价格" prop="banggood_price"></el-table-column>
                <el-table-column label="高出价格" prop="hight_price_2"></el-table-column>
                <el-table-column label="出货价RMB" prop="chuhuo_price"></el-table-column>
                <el-table-column label="重量KG" prop="weight"></el-table-column>
                <el-table-column label="上次调价时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.last_change_price_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="监控">
                    <template scope="scope">
                        {{monitorOpt[scope.row.is_monitor]}}
                    </template>
                </el-table-column>
                <el-table-column label="处理状态">
                    <template scope="scope">
                        {{handleOpt[scope.row.handle_status]}}
                    </template>
                </el-table-column>
                <el-table-column label="处理人" prop="handle_user"></el-table-column>
                <el-table-column label="处理时间" width="170">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.handle_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="处理备注" prop="handle_remark"></el-table-column>
                <el-table-column label="添加人" prop="add_user"></el-table-column>
                <el-table-column label="添加时间" width="170">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.add_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" columnKey="handle">
                    <template scope="scope">
                        <el-button type="primary" @click="edit(scope.row)" size="small">编辑</el-button>
                        <el-button type="danger" @click="remove(scope.row)" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!--  -->
        <el-dialog title="新增SKU" v-model="addDialog">
            <el-form label-width="130px" :model="addForm" ref="addForm" :rules="addRule">
                <el-form-item label="SKU" prop="sku">
                    <el-input v-model="addForm.sku"></el-input>
                </el-form-item>
                <el-form-item label="仓库" prop="warehouse">
                    <el-select v-model="addForm.warehouse" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in wareOpt" :key="index" :value="item.virWhCode" :label="item.virWhCnName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="geekbuying RUL" prop="geekbuying_url">
                    <el-input v-model="addForm.geekbuying_url"></el-input>
                    <span>以<span class="web"> http://www.geekbuying.com </span>开始，255字符以内</span>
                </el-form-item>
                <el-form-item label="banggood RUL" prop="banggood_url">
                    <el-input v-model="addForm.banggood_url"></el-input>
                    <span>以<span class="web"> http://www.banggoods.com </span>开始，255字符以内</span>
                </el-form-item>
                <el-form-item label="是否监测" prop="is_monitor">
                    <el-radio-group v-model="addForm.is_monitor">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="post" :disabled="postLoading" v-loading="postLoading">确定</el-button>
                <el-button @click="addDialog = false">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑SKU" v-model="editDialog">
            <el-form label-width="130px" :model="editForm" ref="editForm" :rules="addRule">
                <el-form-item label="geekbuying RUL" prop="geekbuying_url">
                    <el-input v-model="editForm.geekbuying_url"></el-input>
                    <span>以<span class="web"> http://www.geekbuying.com </span>开始，255字符以内</span>
                </el-form-item>
                <el-form-item label="banggood RUL" prop="banggood_url">
                    <el-input v-model="editForm.banggood_url"></el-input>
                    <span>以<span class="web"> http://www.banggoods.com </span>开始，255字符以内</span>
                </el-form-item>
                <el-form-item label="是否监测" prop="is_monitor">
                    <el-radio-group v-model="editForm.is_monitor">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postEdit" :disabled="postLoading" v-loading="postLoading">确定</el-button>
                <el-button @click="editDialog = false">返回</el-button>
            </div>
        </el-dialog>
        <!--  -->
    </div>
</template>

<script>
    export default {
        data() {
            let required = [{required: true, message: '该项不能为空'}];
            return {
                checkRow: '',
                editForm: {
                    sku: '',
                    warehouse: '',
                    geekbuying_url: '',
                    banggood_url: '',
                    is_monitor: '',
                },
                editDialog: false,
                id: '',
                addForm: {
                    sku: '',
                    warehouse: '',
                    geekbuying_url: '',
                    banggood_url: '',
                    is_monitor: '',
                },
                postLoading: false,
                addDialog: false,
                exportUrl: this.$store.getters.getRootMenu + '/promotion/price-monitoring/import',
                downUrl: this.$store.getters.getRootMenu + '/promotion/price-monitoring/export',
                self: this,
                tableData: [],
                tableLoading: false,
                option: {
                    page: 1,
                    page_size: 10,
                    handle_status: '',
                    monitor_status: '',
                    catch_status: '',
                    limit_price_status: '',
                    flash_buy_status: '',
                    warehouse: '',
                    goods_status: '',
                    catList: [],
                    cat_id: '',
                    sku: '',
                    date: [],
                    start_time: '',
                    end_time: '',
                },
                total: 1,
                wareOpt: [],
                catOpt: [],
                handleOpt: {
                    '1': '已处理',
                    '2': '未处理',
                },
                monitorOpt: {
                    '1': '已监控',
                    '2': '不监控',
                },
                catchOpt: {
                    '1': '已抓取',
                    '2': '未抓取',
                },
                limitOpt: {
                    '1': '已限价',
                    '2': '未限价',
                },
                flashOpt: {
                    '1': '闪购生效中',
                    '2': '闪购未生效',
                },
                goodsOpt: {
                    '1': '上架',
                    '2': '下架',
                    '3': '无库存',
                    '4': '清仓'
                },
                prop: {
                    value: 'categoryId',
                    label: 'categoryName',
                    children: 'subCategoryList',
                },
                addRule: {
                    sku: required,
                    is_monitor: required,
                    warehouse: required,
                    banggood_url: [{
                        required: true,
                        max: 255,
                        message: '该项不能为空，最大长度255'
                    }],
                    geekbuying_url: [{
                        max: 255,
                        message: '该项最大长度255'
                    }],
                }
            };
        },
        created() {
            this.getOpt();
            this.getData();
        },
        methods: {
            getOpt() {
                this.$http.get('promotion/index/public-activity-select').then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        this.wareOpt = data.virtualWares;
                        this.catOpt = data.category;
                    }
                })
            },
            getData() {
                let timeArr = this.timeZone_(this.option.date, this.$store.getters.getTimeZone);
                this.option.start_time = timeArr[0];
                this.option.end_time = timeArr[1];

                let params = JSON.parse(JSON.stringify(this.option));
                delete params.catList;

                this.tableLoading = true;
                this.$http.get('promotion/price-monitoring/lists', {params: this.option}).then(res => {
                    this.tableLoading = false;
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        this.tableData = data.data;
                        this.total = data.total;
                    } else {
                        this.$message.error(res.body.message);
                    }
                }).catch(err => {
                    this.tableLoading = false;
                })
            },
            changeDepartment (val) {
                this.option.cat_id = val[val.length - 1];
            },
            handleChange(file, fileList) {

            },
            resetFrom() {
                this.$refs['searchForm'].resetFields();
            },
            changePage(value) {
                this.option.page = value;
                this.getData();
            },
            changePageSize(value) {
                this.option.page_size = value;
                this.getData();
            },
            post () {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        this.postLoading = true;
                        this.$http.post('promotion/price-monitoring/add', this.addForm).then(res => {
                            this.postLoading = false;
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                                this.addDialog = false;
                                this.getData();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.postLoading = false;
                        })
                    }
                });
            },
            postEdit () {
                let params = JSON.parse(JSON.stringify(this.editForm));
                params.id = this.id;
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        this.postLoading = true;
                        this.$http.post('promotion/price-monitoring/edit', params).then(res => {
                            this.postLoading = false;
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                                this.editDialog = false;
                                this.getData();
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.postLoading = false;
                        })
                    }
                });
            },
            remove (row) {
                this.$confirm('确认删除?').then(() => {
                    this.$http.post('promotion/price-monitoring/delete', {id: row.id}).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.getData();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                })
            },
            edit (row) {
                for (let i in this.editForm) {
                    this.editForm[i] = row[i];
                }
                this.editForm.is_monitor = String(this.editForm.is_monitor);
                this.id = row.id;
                this.editDialog = true;
            },
            handlePreview () {
                if (res.code === 0) {
                    this.$message.success(res.message);
                } else {
                    this.$message.error(res.message);
                }
            },
            handleError (err, file) {
                this.$message.error(err);
            },
            changeCheck (val) {
                if (val.length > 0) {
                   let temp = [];
                    for (let i in val) {
                        temp.push(val[i].id);
                    }
                    this.checkRow = temp.join(',');
                } else {
                    this.checkRow = '';
                }
            },
            clickRow (row, event, col) {
                if (col.columnKey != 'handle') {
                    this.$refs.dataTable.toggleRowSelection(row);
                }
            },
            async update () {
                const data = await this.httpPost_('promotion/price-monitoring/refresh', {ids: this.checkRow});
                this.getData();
                this.$message.success(data.message);
            }
        }

    }
</script>

<style lang="less">
    .monitor-list {
        .ml30 {
            margin-left: 30px;
        }
        .mt30 {
            margin-top: 30px;
        }
        .w100{width: 100px;}
        .w400{width: 400px;}

        .export {
            display: inline-block;
        }

        .web {
            color: red;
        }
    }

</style>
