<!-- 版块详情 -->
<template>
	<div>
        <div class="el-container text-box" v-loading="isDataLoading">
            <el-row>
                <el-col :span="8">
                    <p><strong>{{topic}}</strong>—<span>{{title}}</span></p>
                </el-col>
            </el-row>
            <div class="text-right">
                <el-button type="primary" @click="copySKU('txt')">复制SKU</el-button>
                <el-button type="primary" @click="addgoods = true">添加商品</el-button>
                <el-button type="danger" @click="removeGood(removeList)">批量删除</el-button>
            </div>

            <div class="el-sub-container">
                <el-table border :data="tableData" @selection-change="changeRemoveList">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="title" label="商品名称"></el-table-column>
                    <el-table-column prop="goods_sn" label="sku"></el-table-column>
                    <el-table-column label="商品图片">
                        <template scope="scope">
                            <a :href="scope.row.good_ulr"><img class="table-img" :src="scope.row.image_url"></a>
                        </template>
                    </el-table-column>
                    <el-table-column label="显示排序">
                        <template scope="scope">
                            <span v-show="!scope.row.showEdit" @click="scope.row.showEdit = true">{{scope.row.order}}</span>
                            <el-input v-show="scope.row.showEdit" v-model="scope.row.order" @blur="saveOrder(scope.row)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inventory" label="库存"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="primary" @click="goEdit" size="small">编辑</el-button>
                            <el-button size="small" type="danger" @click="removeGood(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="el-sub-container text-right">
                    <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[20, 50]" layout="total, sizes, prev, pager, next, jumper" :page-size="option.page_size * 1" :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 弹窗S -->
        <el-dialog v-model="addgoods" size="large">
            <el-row>
                <el-form label-width="80px">
                    <el-col :span="12">
                        <el-form-item label="添加商品">
                            <el-input v-model="searchForm.goods" placeholder="请输入/粘贴多个SKU用英文&quot;,&quot;隔开"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" :offset="1">
                        <el-button type="primary" @click="search">查找</el-button>
                    </el-col>
                </el-form>
            </el-row>
            <el-table border :data="dialogData" @selection-change="changeGoodList">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="title" label="商品名称"></el-table-column>
                <el-table-column prop="goods_sn" label="sku"></el-table-column>
                <el-table-column label="商品图片">
                    <template scope="scope">
                        <a :href="scope.row.goods_url"><img class="table-img" :src="scope.row.image_url"></a>
                    </template>

                </el-table-column>
                <el-table-column prop="cat_name" label="商品分类"></el-table-column>
                <el-table-column label="显示排序">
                    <template scope="scope">
                        <span v-show="!scope.row.showEdit">{{scope.row.sort}}</span>
                        <el-input v-show="scope.row.showEdit" v-model="scope.row.sort"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="inventory" label="库存"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button v-show="!scope.row.showEdit" size="small" type="primary" @click="scope.row.showEdit = true">编辑</el-button>
                        <el-button v-show="scope.row.showEdit" size="small" type="primary" @click="scope.row.showEdit = false">保存</el-button>
                        <el-button size="small" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addGoodBtn">确 认</el-button>
                <el-button @click.native="addgoods = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
        <input id="txt" v-model="txt" class="hidden-input">
	</div>
</template>

<script>

export default {
  	data () {
        var id = this.$route.query.id;
        var name = this.$route.query.position_name;
        var topic = this.$route.query.topic_name;
		return {
            isDataLoading: false,
			tableData: [],
            addgoods: false,
            total: 0,
            option: {
                page: 1,
                page_size: 20,
                position_id: id
            },
            topic: topic,
            title: name,
            removeList: '',
            dialogData: [],
            searchForm: {
                goods: '',
                goodsList: ''
            },
            txt: ''
		};
  	},
	created () {
        this.initData();
	},
	methods: {
		initData () {
            this.getData();
        },
        getData () {
            this.isDataLoading = true;
            this.$http.get('admin/special-goods/list', {params: this.option}).then(res => {
                var data = res.body.data.data;
                this.isDataLoading = false;
                for (var i in data) {
                    data[i].showEdit = false;
                }

                this.tableData = data;
                this.total = res.body.data.total * 1;
            })
        },
        saveOrder (row) {
            let order = row.order * 1;

            if (Number.isInteger(order) && order >= 0 && order < 100) {
            } else {
                this.$message.error('排序值位0-99的整数');
                return;
            }
            this.$http.post('admin/special-goods/update-order',{id: row.id, order: row.order}).then(res => {
                if (res.body.code === 0) {
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    });
                } else {
                    this.$message.error(res.body.message);
                }
            });
            row.showEdit = false;
        },
        changeRemoveList (val) {
            var temp = [];
            var tempSku = [];

            for (var i in val) {
                temp.push(val[i].id);
                tempSku.push(val[i].goods_sn);
            }

            this.txt = tempSku.join(',');
            this.removeList = temp.join(',');
        },
        removeGood (row) {
            var self = this;
            var notice;
            var id;

            if (typeof row == 'string') {
                if (row == '') {
                    self.$message({
                        type: 'warning',
                        message: '未选中任何项！'
                    });
                    return false;
                } else {
                    notice = '是否删除选中项？'
                    id = row;
                }
            } else if (typeof row == 'object') {
                notice = '是否删除该项？';
                id = row.id;
            }

            self.$confirm(notice, '提示', {
                type: 'warning'
            }).then(() => {
                self.$http.post('admin/special-goods/delete', {id: id}).then(res => {
                    if (res.body.code == 0) {
                        if (typeof row == 'string') {
                            this.getData();
                        } else {
                            var index = self.tableData.indexOf(row);
                            self.tableData.splice(index, 1);
                        }

                        self.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        self.$message.error(res.body.message);
                    }
                })
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除'
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
        search () {
            this.$http.get('admin/special-goods/search', {params: this.searchForm}).then(res => {
                var j = 0;
                var temp = [];
                for (var i in res.body.data) {
                    temp[j] = res.body.data[i];
                    temp[j].showEdit = false;
                    j++;
                }
                this.dialogData = temp;
            })
        },
        changeGoodList (val) {
            var temp = [];

            for (var i in val) {
                var item = this.dialogData.indexOf(val[i]);
                temp.push(item);
            }

            this.searchForm.goodList = temp;
        },
        addGoodBtn () {
            var params = {};
            var temp = [];
            var data = this.dialogData;
            var originData = this.searchForm.goodList;

            for (var i in originData) {
                var index = originData[i];
                var item = data[index].goods_sn + '|' + data[index].sort;
                temp.push(item);
            }

            params.goods = temp.join(',');
            params.position_id = this.$route.query.id;

            this.$http.post('admin/special-goods/add', params).then(res => {
                if (res.body.code == 0) {

                    this.getData();
                    this.addgoods = false;
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    });
                } else {
                    this.$message.error(res.body.message);
                }
            })

        },
        copySKU (txtId) {
            if (this.txt == '') {
                this.$message({
                    type: 'warning',
                    message: '至少选择一项！'
                });
            } else {
                var cpt = document.getElementById(txtId);
                cpt.value = this.txt;
                cpt.select();
                try{
                    if(document.execCommand('copy', false, null)){
                        this.$message({
                            type: 'success',
                            message: '已复制所选SKU'
                        });
                    } else{
                        this.$message({
                            type: 'warning',
                            message: '浏览器不可用复制'
                        });
                    }
                } catch(err){
                    this.$message.error(err);
                }
            }
        },
        goEdit() {
            this.$router.push({
                name: 'topic_topicEdit',
                query: {
                    id: this.$route.query.id
                }
            })
        }

	}
}
</script>

<style>
    .text-box {line-height: 30px;}
    .table-img{width: 100px;height: 100px;margin: 7px auto;}
</style>


