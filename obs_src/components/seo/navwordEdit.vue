<template>
    <div>
        <div class="el-container">
            <el-form :model="tableData" label-width="200px" ref="postForm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="显示位置">
                            <el-input v-model="tableData.position_txt" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="语言">
                            <el-select v-model="tableData.lang">
                                <el-option v-for="item in langOpt" :key="item.language_en" :label="item.language_ch" :value="item.language_en"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="导购词">
                            <el-input v-model="tableData.keywords"></el-input>
                        </el-form-item>
                        <el-form-item label="链接">
                            <el-input v-model="tableData.redirect_url" placeholder="请输入完整的http链接地址"></el-input>
                        </el-form-item>
                        <el-form-item label="所属分类" prop="auto_cat_name">
                            <el-autocomplete class="inline-input" v-model="tableData.auto_cat_name" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="getCatId"></el-autocomplete>
                        </el-form-item>
                        <el-form-item label="排序号">
                            <el-input v-model="tableData.order"></el-input>
                        </el-form-item>
                        <el-form-item label="显示状态">
                            <el-radio-group v-model="tableData.is_show">
                                <el-radio class="radio" label="1">启用</el-radio>
                                <el-radio class="radio" label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" @click="postEdit">保存</el-button>
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
                is_show: '0',
                position: '',
                cat_id: '',
                keywords: '',
                lang: '',
                redirect_url: '',
                auto_cat_name: '',
                order: ''
            },
            id: this.$route.query.id,
            catList: [],
            positionList: {},
            langOpt: {},
            queryCatlist: []
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getCat();
            this.getPosition();
            this.getLang();
        },
        getLang () {
            var self = this;

            self.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    self.langOpt = res.body.data;
                }
            });
        },
        getCat () {
            this.$http.get('seo/public/category-all').then(res => {
                if (res.body.code === 0) {
                    var data = res.body.data;
                    data[0] = {
                        id: 0,
                        name: '暂无分类'
                    }
                    this.catList = data;
                    this.getData();
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
            this.$http.get('seo/trend/position-all').then(res => {
                if (res.body.code === 0) {
                    this.positionList = res.body.data;
                }
            });
        },
        getData () {
            this.$http.get('seo/trend/info', {params: {id: this.$route.query.id}}).then(res => {
                if (res.body.code === 0) {
                    var data = res.body.data;
                    data.cat_id = data.cat_id * 1;

                    var tempArr = data.position.split(',');
                    for (var i in tempArr) {
                        tempArr[i] = this.positionList[tempArr[i]];
                    }
                    data.position_txt = tempArr.join(',');

                    let cat = data.cat_id;
                    if (typeof this.catList[cat] == 'undefined') {
                        data.auto_cat_name = '未知分类'
                    } else if (cat !== 0) {
                        data.auto_cat_name = this.catList[cat].name;
                    } else {
                        data.auto_cat_name = '暂无分类';
                    }
                    this.tableData = data;
                }
            });
        },
        postEdit () {
            // this.tableData.is_show = this.tableData.is_show * 1;
            this.$http.post('seo/trend/edit', this.tableData).then(res => {
                if (res.body.code === 0) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.goback();
                } else {
                    this.$message.error(res.body.message);
                }
            });
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


