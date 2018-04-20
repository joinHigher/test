<template>
    <div class="campaigns-goods-global">
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <el-form-item label="活动类型" prop="activityType">
                    <el-select clearable filterable v-model="option.activityType">
                        <el-option :disabled="item.value == '6'" v-for="item in typeOpt" :key="item.id" :value="item.value" :label="item.text"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动名称" prop="activityName">
                    <el-input v-model.trim="option.activityName"></el-input>
                </el-form-item>
                <el-form-item label="商品SKU" prop="goodSn">
                    <el-input v-model.trim="option.goodSn"></el-input>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getData">搜索</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-left">
                <el-button v-if="self.showAction_('promotion/activity-goods/batch-delete')" :disabled="checkedRow.length === 0" type="danger" @click="batchRemove">批量删除</el-button>
                <el-button :disabled="checkedRow.length === 0" type="primary" @click="copySKU">复制SKU</el-button>
                <el-button v-if="self.showAction_('promotion/activity-goods/add')" type="primary" class="fr" @click="addDialog = true">添加商品</el-button>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading" @selection-change="changeCheck" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号" width="80px"></el-table-column>
                <el-table-column prop="goodsName" label="商品标题"></el-table-column>
                <el-table-column prop="goodSn" label="SKU"></el-table-column>
                <el-table-column label="商品图片" width="126px">
                    <template scope="scope">
                        <img :src="domain + scope.row.imgUrl" width="90" height="120" class="table-img">
                    </template>
                </el-table-column>
                <el-table-column prop="warehouseCode" label="活动仓库"></el-table-column>
                <el-table-column prop="activityName" label="活动名称"></el-table-column>
                <el-table-column label="活动类型">
                    <template scope="scope">
                        {{typeOpt[scope.row.type].text}}
                    </template>
                </el-table-column>
                <el-table-column prop="activityStatus" label="活动状态"></el-table-column>
                <el-table-column prop="shopPrice" label="本店售价"></el-table-column>
                <el-table-column label="操作" column-key="handle">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('promotion/activity-goods/delete')" type="danger" size="small" @click="removeItem(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <input id="copyTxt" v-model="copyTxt" class="hidden-input">
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="添加商品" v-model="addDialog" size="large" class="goods-dialog">
            <el-form :model="addForm" label-width="100px" ref="addForm">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="选择活动" required>
                            <el-select filterable v-model="addForm.activityId" @change="changeActivity">
                                <el-option :disabled="item.type == '6'" v-for="item in campaignsOpt" :key="item.id" :label="item.name" :value="item.activityId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="添加商品" prop="goodSnList" :rules="[{validator: checkGoodsSns}]">
                            <el-input :disabled="addForm.activityId == ''" v-model.trim="addForm.goodSnList" placeholder="请先选择活动商品"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" :offset="1">
                        <el-button :disabled="addForm.activityId == '' || searchLoading" type="primary" @click="getGoods" v-loading="searchLoading">搜索</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <table class="table-custom">
                <thead>
                    <tr>
                        <th>
                            <el-checkbox @change="checkAll"></el-checkbox>
                        </th>
                        <th>SKU</th>
                        <th>商品图片</th>
                        <th>商品标题</th>
                        <th>库存</th>
                        <th>商品分类</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in addData" :key="index">
                        <td>
                            <el-checkbox v-model="item.checked"></el-checkbox>
                        </td>
                        <td>{{item.goodSn}}</td>
                        <td> <img :src="domain + item.goodThumbUrl" width="90" height="120" class="table-img"></td>
                        <td>{{item.goodName}}</td>
                        <td>{{item.stockCnt}}</td>
                        <td>{{item.categoryName}}</td>
                    </tr>
                </tbody>
            </table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postAdd" v-loading="postLoading" :disabled="postLoading">确 定</el-button>
                <el-button type="danger" @click="addDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let checkGoodsSns = (rule, value, callback) => {
            let exp = /^[0-9a-zA-Z]+(\,[0-9a-zA-Z]+)*$/;
            if (!exp.test(value)) {
                callback(new Error('SKU必填，多个以英文,隔开'));
            }

            let arr = value.split(',');
            let temp = [];
            for (let i in arr) {
                let item = arr[i];
                if (temp.indexOf(item) === -1) {
                    temp.push(item);
                }
            }

            if (temp.length < arr.length) {
                callback(new Error('输入的SKU存在重复，请检查'));
            }
            callback();
        }
        return {
            checkGoodsSns: checkGoodsSns,
            searchLoading: false,
            postLoading: false,
            option: {
                page: 1,
                lang: 'en',
                page_size: 10,
                status: '0',
                activityName: '',
                goodSn: '',
                activityType: ''
            },
            self: this,
            tableLoading: false,
            total: 10,
            tableData: [],
            campaignsOpt: [],
            typeOpt: {},
            statusOpt: {},
            addDialog: false,
            addForm: {
                goodSnList: '',
                lang: 'en',
                activityId: ''
            },
            addSkuArr: [],
            addData: [],
            addCheckedWare: '',
            checkedRow: [],
            copyTxt: '',
            checkedWare: '',
        };
    },
    created () {
        this.getOpt();
    },
    computed: {
        domain () {
            return this.$store.getters.getDomain + '/';
        }
    },
    methods: {
        getOpt () {
            this.$http.get('promotion/activity-goods/public-activity-select', {params: {typeNotEqual: 3}}).then(res => {
                if (res.body.code === 0) {
                    this.campaignsOpt = res.body.data.activityDtos;
                } else {
                    this.$message.error(res.body.message);
                }
            });

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

                    this.getData();
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData () {
            this.tableLoading = true;
            this.$http.get('promotion/activity-goods/lists', {params: this.option}).then(res => {
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
        getGoods () {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.searchLoading = true;
                    this.$http.get('promotion/activity-goods/search-goods', {params: this.addForm}).then(res => {
                        this.searchLoading = false;
                        if (res.body.code === 0) {
                            let data = res.body.data;

                            data.map(item => {
                                item.checked = false;
                            });

                            this.addData = data;
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.searchLoading = false;
                    });
                }
            })
        },
        checkAll (val) {
            if (val.target.checked) {
                this.addData.map(item => {
                    item.checked = true;
                })
            } else {
                this.addData.map(item => {
                    item.checked = false;
                })
            }
        },
        postAdd () {
            let params = {};
            params.lang = 'en';

            let temp = [];
            this.addData.map(item => {
                if (item.checked) {
                    temp.push({
                        goodSn: item.goodSn,
                        warehouseCode: this.checkedWare,
                        activityId: this.addForm.activityId
                    });
                }
            });
            if (temp.length === 0) {
                this.$message.warning('至少选择一项商品');
                return ;
            }
            params.activityGoods = temp;

            this.postLoading = true;
            this.$http.post('promotion/activity-goods/add', params).then(res => {
                this.postLoading = false;
                if (res.body.code == -2) {
                    this.$confirm(res.body.message, '提示').then(() => {
                        params.confirm = 1;
                        this.$http.post('promotion/activity-goods/add', params).then(subRes => {
                            if (subRes.body.code === 0) {
                                this.$message.success(subRes.body.message);
                                this.addDialog = false;
                                this.getData();
                            } else {
                                this.$message.error(subRes.body.message);
                            }
                        })
                    })
                } else {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.addDialog = false;
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                }
            }).catch(err => {
                this.postLoading = false;
            })
        },
        removeItem (row) {
            let tips = '删除活动商品可能导致部分购物车商品失去活动状态,请谨慎操作,是否确认删除?';
            if (row.activityStatus === '进行中') {
                tips = '活动进行中,删除活动商品可能造成用户投诉,请谨慎操作';
            }
            this.$confirm(tips, '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('promotion/activity-goods/delete', {id: row.id}).then(res => {
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
        batchRemove () {
            let tips = '删除活动商品可能导致部分购物车商品失去活动状态,请谨慎操作,是否确认删除?';
            let flag = this.checkedRow.some(item => {
                return item.activityStatus === '进行中'
            });
            if (flag) {
                tips = '活动进行中,删除活动商品可能造成用户投诉,请谨慎操作';
            }
            let temp = [];
            this.checkedRow.map(item => {
                temp.push(item.goodSn);
            });

            this.$confirm(tips, '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('promotion/activity-goods/batch-delete', {goodSns: temp.join(',')}).then(res => {
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
        changeCheck(val) {
            this.checkedRow = val;
        },
        copySKU () {
            let temp = [];
            this.checkedRow.map(item => {
                temp.push(item.goodSn);
            });

            this.copyTxt = temp.join(',');
            var cpt = document.getElementById('copyTxt');
            cpt.value = this.copyTxt;
            cpt.select();
            try{
                if(document.execCommand('copy', false, null)){
                } else{
                    this.$message({
                        type: 'warning',
                        message: '浏览器不可用复制'
                    });
                }
            } catch(err){
                this.$message.error(err);
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
            this.$refs['searchForm'].resetFields();
        },
        changeActivity (val) {
            this.campaignsOpt.map(item => {
                if (item.activityId == val) {
                    this.checkedWare = item.warehouseCode;
                }
            })
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
    }
}
</script>

<style lang="less">
    .campaigns-goods-global {
        .goods-dialog {
            .el-dialog {
                max-height: 600px;
                overflow-y: auto;
            }

        }
    }
</style>
