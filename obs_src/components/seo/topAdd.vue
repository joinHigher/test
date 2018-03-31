<template>
    <div>
        <div class="el-container">
            <el-form :model="tableData"  label-width="200px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="显示位置">
                            <el-select v-model="tableData.position" @change="changePosition">
                                <el-option v-for="(item, index) in positionList" :value="index" :label="item" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属分类" v-show="positionCat">
                            <el-autocomplete class="inline-input" v-model="auto_cat_name" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="getCatId"></el-autocomplete>
                        </el-form-item>
                        <el-form-item label="内部SKU">
                            <el-input v-model="tableData.goods_sku" placeholder="多个产品之间使用英文&quot;,&quot;分割"></el-input>
                        </el-form-item>
                        <el-form-item label="关键词" v-show="positionIndex">
                            <el-input v-model="tableData.keywords" placeholder="搜索结果页要绑定关键词"></el-input>
                        </el-form-item>
                        <el-form-item label="显示时间">
                            <el-date-picker v-model="tableData.tiem_arr" type="datetimerange" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-radio-group v-model="tableData.is_show">
                                <el-radio class="radio" label="1">启用</el-radio>
                                <el-radio class="radio" label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" @click="add">保存</el-button>
                            <el-button type="danger" @click="goback">返回</el-button>
                        </div>
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
                position: '',
                cat_id: '',
                keywords: '',
                goods_sku: '',
                is_show: '',
                tiem_arr: []
            },
            catList: [],
            auto_cat_name: '',
            queryCatlist: [],
            positionList: {},
            positionIndex: true,
            positionCat: true
        };
    },
    created () {
        this.getCat();
        this.getPosition();
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
                    for (var i in data) {
                        this.queryCatlist.push({
                            value: data[i].name,
                            id: data[i].id
                        });
                    }
                }
            });
        },
        getPosition () {
            this.$http.get('seo/top-goods-setting/position-all').then(res => {
                if (res.body.code === 0) {
                    this.positionList = res.body.data;
                }
            });
        },
        changePosition (val) {
            if (val === 'search') {
                this.positionIndex = true;
                this.positionCat = false;
                this.tableData.cat_id = '';
            } else if (val === 'category') {
                this.positionIndex = false;
                this.positionCat = true;
                this.tableData.keywords = '';
                this.auto_cat_name = '';
            } else {
                this.positionIndex = false;
                this.positionCat = false;
                this.tableData.cat_id = '';
                this.tableData.keywords = '';
                this.auto_cat_name = '';
            }
        },
        add () {
            if (typeof this.tableData.tiem_arr === 'object' && this.tableData.tiem_arr != '') {
                this.tableData.start_time = this.fomart(this.tableData.tiem_arr[0]);
                this.tableData.end_time = this.fomart(this.tableData.tiem_arr[1]);
            }
            this.$http.post('seo/top-goods-setting/add', this.tableData).then(res => {
                if (res.body.code === 0) {
                    this.$message({
                      message: res.body.message,
                      type: 'success'
                    });
                    history.back();
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        fomart (date) {
            if (!date) {
                return '';
            } else {
               var str = '',
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
                    };
                    if (day < 10) {
                        day = '0' + day;
                    };
                    if (hour < 10) {
                        hour = '0' + hour;
                    };
                    if (min < 10) {
                        min = '0' + min;
                    };
                    if (second < 10) {
                        second = '0' + second;
                    };

                    str = year + flag1 + mouth + flag1 + day + ' ' + hour + flag2 + min + flag2 + second;
                return str;
            }
        },
        goback () {
            history.back();
        },
        getCatId (val) {
            if (typeof val == 'object') {
                this.tableData.cat_id = val.id;
            }
        },
        querySearch(queryString, callback) {
            var queryCatlist = this.queryCatlist;
            var results = queryString ? queryCatlist.filter(this.createFilter(queryString)) : queryCatlist;
            // 调用 callback 返回建议列表的数据
            callback(results);
        },
        createFilter(queryString) {
            return (queryCatlist) => {
                return (queryCatlist.value.toUpperCase().indexOf(queryString.toUpperCase()) !== -1);
            };
        }
    }

}
</script>

<style>

</style>


