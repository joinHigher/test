<template>
    <div>
        <div class="el-container">
            <el-row>
                <template v-for="(item, index) in tableData">
                    <el-col :span="11" :offset="1" class="item-box">
                        <el-form :model="item" label-width="100px" :rules="rule" :ref="'postForm_' + index">
                            <el-form-item label="显示位置" prop="checkList">
                                <el-checkbox-group v-model="item.checkPosition">
                                    <el-checkbox @change.native="checkAll(item)">全选</el-checkbox>
                                </el-checkbox-group>
                                <el-checkbox-group v-model="item.checkList">
                                    <el-checkbox v-for="(position, value) in positionList" :key="value" :label="value" @change.native="checkItem(item)">
                                        {{position}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="语言" prop="lang">
                                <el-select v-model="item.lang">
                                    <el-option v-for="(item, index) in langOpt" :key="index" :label="item.language_ch" :value="item.language_en"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="导购词" prop="keywords">
                                <el-input v-model="item.keywords"></el-input>
                            </el-form-item>
                            <el-form-item label="链接" prop="redirect_url">
                                <el-input v-model="item.redirect_url"></el-input>
                            </el-form-item>
                            <el-form-item label="所属分类" prop="auto_cat_name">
                                <el-autocomplete class="inline-input" v-model="item.auto_cat_name" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
                            </el-form-item>
                            <el-form-item label="排序号" prop="order">
                                <el-input v-model="item.order"></el-input>
                            </el-form-item>
                            <el-form-item label="显示状态" prop="is_show">
                                <el-radio-group v-model="item.is_show">
                                    <el-radio class="radio" label="1">启用</el-radio>
                                    <el-radio class="radio" label="0">禁用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="save('postForm_' + index, item)" v-loading="saveLoading">保存</el-button>
                                <el-button type="danger" @click="goback">返回</el-button>
                                <span>
                                    <el-button type="primary" class="remove" @click="removeItem(item, index)">删除导购词</el-button>
                                    <el-button type="danger" @click="addItem">添加导购词</el-button>
                                </span>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>
            </el-row>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        var checkHttp = (rule, value, callback) => {
            var reg = /^(http:\/\/\S+)|(https:\/\/\S+)/;
            if (value === '') {
                // callback(new Error('该项不能为空'));
            } else {
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的http格式'));
                }
            }
            callback();
        };
        return {
            saveLoading: false,
            tableData: [
                {
                    checkList: [],
                    checkAll: false,
                    lang: '',
                    is_show: '',
                    order: '',
                    redirect_url: '',
                    cat_id: '',
                    keywords: '',
                    auto_cat_name: ''
                }
            ],
            id: this.$route.query.id,
            langOpt: [],
            positionList: {},
            catList: [],
            queryCatlist: [],
            checkAllList: [],
            rule: {
                redirect_url: [{
                    validator: checkHttp,
                    trigger: 'blur'
                }],
                keywords: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                order: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                lang: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                auto_cat_name: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                },{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                is_show: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
            },
        };
    },
    created () {
        this.getLang();
        this.getPosition();
        this.getCat();
    },
    methods: {
        getPosition () {
            this.$http.get('seo/trend/position-all').then(res => {
                if (res.body.code === 0) {
                    var i = 0;
                    var data = res.body.data;
                    this.positionList = data;
                    for (var j in data) {
                        this.checkAllList[i] = j;
                        i++;
                    }
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
                    for (var i in data) {
                        this.queryCatlist.push({
                            value: data[i].name,
                            id: data[i].id
                        });
                    }
                }
            });
        },
        getLang () {
            var self = this;

            self.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    self.langOpt = res.body.data;
                }
            });
        },
        goback () {
            history.back();
        },
        checkAll (item) {
            if (item.checkPosition === true) {
                item.checkList = this.checkAllList;
            } else {
                item.checkList = [];
            }
        },
        checkItem (item) {
            if (item.checkList.length < 4) {
                item.checkPosition = false;
            } else {
                item.checkPosition = true;
            }
        },
        save (formName,item) {
            this.$refs[formName][0].validate((valid) => {
              if (valid) {
                var self = this;
                var params = {
                    keywords : item.keywords,
                    lang: item.lang,
                    redirect_url: item.redirect_url,
                    order: item.order,
                    is_show: item.is_show
                }

                var cat_name = item.auto_cat_name;
                for (var i in this.catList) {
                    if (this.catList[i].name === cat_name) {
                        params.cat_id = i;
                        break;
                    }
                }

                params.position = item.checkList.join(',');

                this.saveLoading = true;
                self.$http.post('seo/trend/add', params).then(res => {
                    this.saveLoading = false;

                    if (res.body.code === 0) {
                        self.$message({
                          message: res.body.message,
                          type: 'success'
                        });
                        item.id = res.body.data.id;
                    } else {
                        self.$message.error(res.body.message);
                    }
                }).catch(err => {
                    this.saveLoading = false;
                });
              } else {
                return false;
              }
            });
        },
        addItem () {
            this.tableData.push({
                    checkList: [],
                    checkAll: false,
                    lang: '',
                    is_show: '',
                    order: '',
                    redirect_url: '',
                    cat_id: '',
                    keywords: '',
                    auto_cat_name: ''
                });
        },
        removeItem (item, index) {
            if (typeof item.id !== 'undefined' && item.id != '0' && item.id !== '') {
                var self = this;

                self.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    self.$http.post('trend/delete', {id: item.id}).then(res => {
                        if (res.body.code == 0) {
                            this.tableData.splice(index, 1);
                            self.$message({
                              message: res.body.message,
                              type: 'success'
                            });
                        } else {
                            self.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            } else {
                this.tableData.splice(index, 1);
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
    .remove {margin-left: 150px;}
    .item-box {border: 1px solid #ddd; padding: 20px;margin-bottom: 20px;}
</style>


