<!-- 排序规则 -->
<template>
    <div>
        <div class="el-container">
            <el-form label-width="200px" :data="tableData" v-loading="dataLoading">
                <el-row>
                    <el-form-item label="所属分类">
                        <el-col :span="8">
                            <el-select v-model="tableData.cat_id" @change="getData" placeholder="请先选择分类">
                                <el-option v-for="item in catList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-col>
                    </el-form-item> 
                    <el-form-item label="默认排序">
                        <el-col :span="12">
                            <el-radio-group v-model="tableData.default">
                                <el-radio v-for="item in orderList" :key="item.name" class="radio" :label="item.name">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-col>
                        <el-col :span="13">
                            <span>后台设置排序字段为空则默认程序排序</span>
                        </el-col>
                    </el-form-item>
                    <el-form-item v-for="(block, title) in tableData.data" :label="title" :key="title">
                        <el-col :span="12">
                            <div class="order-box">
                                <el-col :span="10" class="order-list">
                                    <p v-for="(item, index) in block.left" :key="index" :class="{active: item.selected}" @click="chooseItem(item)">{{item.text}}</p>
                                </el-col>
                                <el-col :span="2" class="operator">
                                    <el-button type="primary" @click="changeOrder(block.left, block.right, 'right')" icon="arrow-right"></el-button>
                                    <el-button type="primary" @click="changeOrder(block.right, block.left, 'left')" icon="arrow-left"></el-button>
                                </el-col>
                                <el-col :span="10" class="order-list">
                                    <p v-for="(item, index) in block.right" :key="index" :class="{active: item.selected}" @click="chooseItem(item)">{{item.text}}</p>
                                </el-col>
                                <el-col :span="2" class="operator">
                                    <el-button type="primary" @click="changePosition('up', block.right)" icon="arrow-up"></el-button>
                                    <el-button type="primary" @click="changePosition('down', block.right)" icon="arrow-down"></el-button>
                                </el-col>
                            </div>
                        </el-col>
                    </el-form-item>
                    <el-col :span="18" class="text-center">
                        <el-button type="primary" @click="save" v-loading="postLoading" :disabled="tableData.cat_id === '' || postLoading">保存</el-button>
                        <el-button type="danger" @click="goback">取消</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            tableData: {
                cat_id: '',
                id: 0,
                default: '',
                data: {}
            },
            id: this.$route.query.id,
            catList: {},
            orderList: [],
            dataLoading: true,
            postLoading: false,
        };
    },
    created () {
        this.getOrder();
        this.getCat();
    },
    methods: {
        getCat () {
            this.$http.get('seo/public/category-all').then(res => {
                if (res.body.code === 0) {
                    var data = res.body.data;
                    data[0] = {
                        id: 0,
                        name: '暂无分类'
                    }
                    this.catList = data;
                    this.dataLoading = false;
                }
            }).catch(err => {
                this.dataLoading = false;
            });
        },
        getOrder () {
            this.$http.get('seo/public/sort-rule-options').then(res => {
                if (res.body.code === 0) {
                    this.orderList = res.body.data;
                }
            });
        },
        getData () {
            var self = this;

            this.dataLoading = true;
            self.$http.get('seo/sort-rule/info', {params: {cat_id: this.tableData.cat_id}}).then(res => {
                this.dataLoading = false;
                if (res.body.code === 0) {
                    var data = res.body.data.data;
                    for (var i in data) {
                        var leftArr = data[i].left;
                        var rightArr = data[i].right;
                        for (var j in leftArr) {
                            leftArr[j].selected = false;
                        }

                        for (var k in rightArr) {
                            rightArr[k].selected = false;
                        }
                    }

                    this.tableData.default = res.body.data.default;
                    this.tableData.data = data;
                    this.tableData.id = res.body.data.id;
                }
            }).catch(err => {
                this.dataLoading = false;
            })
        },
        changeOrder (source, res, to) {
            if (to === 'right') {
                var rightLength = res.length;
                var count = 0;

                for (var m in source) {
                    if (source[m].selected === true) {
                        count++;
                    }
                }

                if (rightLength + count > 3) {
                    this.$message({
                        type: 'warning',
                        message: '最多使用3条排序规则'
                    });
                    return;
                }
            }
            var k = 0;
            var length = source.length;
            for (var i = 0; i < length ;i++) {
                if (source[i - k].selected) {
                    source[i - k].selected = false;
                    res.splice(0, 0, source[i - k]);
                    source.splice(i - k, 1);
                    k++;
                } 
            }
        },
        changePosition (position, source) {
            var k = 0;
            var index;
            var temp;
            
            for (var i in source) {
                if (source[i].selected === true) {
                    k++;
                    if (k > 1) {
                        this.$message({
                            type: 'error',
                            message: '更改排序时只能选择一项'
                        });
                        return ;
                    } else{
                        index = i;
                    }
                    
                }
            }

            temp = source[index];
            if ((position === 'up' && index == 0) || (position === 'down' && index == source.length - 1)) {
                return false
            } else {
                source.splice(index, 1);

                if (position === 'up') {
                    source.splice(index - 1, 0, temp);
                } else {
                    source.splice(index * 1 + 1, 0, temp);
                }
            }

        },
        save () {
            this.postLoading = true;
            var params;
            let src = 'seo/sort-rule/edit';

            params = JSON.parse(JSON.stringify(this.tableData));
            for (var index in params.data) {
                params.data[index] = params.data[index].right;

                for (var i in params.data[index]) {
                    var obj = params.data[index][i];
                    delete obj.selected;
                }
            }

            params.json_value = JSON.stringify(params.data);

            delete params.data;

            if (params.id == 0) {
                src = 'seo/sort-rule/add'
            }
            this.$http.post(src, params).then(res => {
                this.postLoading = false;
                if (res.body.code === 0) {
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    });
                    this.getData();
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.postLoading = false;
            });
        },
        chooseItem (item) {
            if (item.must === 1) {
                this.$message({
                    type: 'warning',
                    message: '该项不能移动'
                });
                return;
            }
            item.selected = !item.selected;
        },
        goback () {
            history.back();
        },
    }

}
</script>

<style lang="less">
    .middle {margin: 0 20px;}
    .order-box {
        padding: 10px;
        height: 200px;
        border:1px solid #C0CCDA;
        border-radius: 4px;

        .el-col {
            height: 100%;
            border:1px solid #C0CCDA;
            overflow: auto;
        }

        .active {
            background: #ddd
        }

        .operator {
            border: 0;
            text-align: center;
            margin-top: 45px;

            button {
                display: block;
                margin: 5px auto;width: 40px;
                text-align: center;
                padding: 10px 0;
                margin-bottom: 20px;
            }
        }

        .order-list {

            p {
                padding-left: 10px; 
                cursor: pointer;
            }
        }
    }
</style>


