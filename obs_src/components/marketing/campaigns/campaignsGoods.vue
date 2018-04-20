<template>
    <div class="campaigns-goods">
        <div class="el-container">
            <div class="part-list-title">
                <span>{{titleOpt.name}}</span>
                <span>{{self.timeZone_(titleOpt.startTime, self.$store.getters.getTimeZone)}} 至 {{self.timeZone_(titleOpt.endTime, self.$store.getters.getTimeZone)}}</span>
                <span>{{titleOpt.activityType}}</span>
                <span>由 {{titleOpt.creatorName}} 创建</span>
            </div>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-left">
                <el-button v-if="self.showAction_('promotion/activity-goods/batch-delete')" :disabled="checkedRow.length === 0" type="danger" @click="batchRemove">批量删除</el-button>
                <el-button :disabled="checkedRow.length === 0" type="primary" @click="copySKU">复制SKU</el-button>
                <el-button :disabled="type == '6'" v-if="self.showAction_('promotion/activity-goods/add')" type="primary fr" @click="addDialog = true">添加商品</el-button>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading" @selection-change="changeCheck" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" width="80px" label="序号"></el-table-column>
                <el-table-column prop="goodsName" label="商品标题"></el-table-column>
                <el-table-column prop="goodSn" label="SKU"></el-table-column>
                <el-table-column prop="imgUrl" label="商品图片" width="126px">
                    <template scope="scope">
                        <img :src="domain + scope.row.imgUrl" width="90" height="120">
                    </template>
                </el-table-column>
                <el-table-column prop="warehouseCode" label="活动仓库"></el-table-column>
                <el-table-column prop="shopPrice" label="本店售价"></el-table-column>
                <el-table-column label="操作" column-key="handle">
                    <template scope="scope">
                        <el-button v-if="self.showAction_('promotion/activity-goods/delete')" type="danger" size="small" @click="removeItem(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
            <input id="copyTxt" v-model="copyTxt" class="hidden-input">
        </div>
        <!-- 弹窗S -->
        <el-dialog title="添加商品" v-model="addDialog" size="large" class="goods-dialog">
            <el-form :model="addForm" label-width="100px" ref="addForm">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="添加商品" prop="goodSnList" :rules="[{validator: checkGoodsSns}]">
                            <el-input v-model.trim="addForm.goodSnList"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" :offset="1">
                        <el-button type="primary" @click="getGoods" v-loading="searchLoading" :disabled="searchLoading">搜索</el-button>
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
                        <td><img :src="domain + item.goodThumbUrl" width="90" height="120" class="table-img"></td>
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
            type: this.$route.query.type,
            checkGoodsSns: checkGoodsSns,
            searchLoading: false,
            postLoading: false,
            option: {
                page: 1,
                page_size: 10,
                lang: 'en',
                activityId:this.$route.query.activityId
            },
            self: this,
            total: 10,
            tableLoading: false,
            tableData: [],
            titleOpt: {
                name: '',
                startTime: '',
                endTime: '',
                type: 1,
                creatorName: ''
            },
            typeOpt: {
                '1': ''
            },
            addDialog: false,
            addForm: {
                goodSnList: '',
                lang: 'en',
                activityId: this.$route.query.activityId
            },
            addSkuArr: [],
            addData: [],
            addCheckedWare: '',
            statusOpt: {},
            copyTxt: '',
            checkedRow: [],
            checkedWare: ''
        };
    },
    created () {
        this.getOpt();
        this.getData();
    },
    computed: {
        domain () {
            return this.$store.getters.getDomain + '/';
        }
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
                    this.getTitle();
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getTitle () {
            this.tableLoading = true;
            this.$http.get('promotion/activity-goods/simple-activity',{params: {activityId: this.option.activityId}}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.titleOpt = res.body.data;
                    this.checkedWare = res.body.data.warehouseCode;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
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
                        activityId: this.$route.query.activityId
                    });
                }
            });
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
                temp.push(item.id);
            });

            this.$confirm(tips, '提示', {
                type: 'warning'
            }).then(() => {
                this.$http.post('promotion/activity-goods/batch-delete', {id: temp.join(',')}).then(res => {
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
                    this.$message.success('复制成功')
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
        resetForm () {
            this.$refs['searchForm'].resetFields();
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.page_size = val;
            this.getData();
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
    .part-list-title {
        span {
            display: inline-block;
            margin-right: 20px;

            &:first-child {
                font-size: 20px;
            }
        }
    }

    .campaigns-goods {
        .goods-dialog {
            .el-dialog {
                max-height: 600px;
                overflow-y: auto;
            }

        }
    }
</style>
