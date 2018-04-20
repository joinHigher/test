<template>
    <div class="addLibrary" @click="closeTree($event)">
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增/编辑分类馆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-row>
                <el-col :span="16">
                    <el-form :model="option"  label-width="100px" ref="postForm" :rules="postRule">
                        <el-form-item label="模板类型" prop="">
                            <el-radio v-for="(item, index) in typeOpt" :key="index" :label="index" v-model="option.type">{{item}}</el-radio>
                        </el-form-item>
                        <el-form-item label="特殊商品设置" prop="" class="set" v-if="option.type !== 'e_commerce'">
                            <el-row>
                                <el-col :span="4" class="text-center">现在生效的 商品SKU</el-col>
                                <el-col :span="5"><el-input v-model="option.sku_info.now.sku" placeholder="最多添加2个，用英文逗号隔开"></el-input></el-col>
                                <el-col :span="2" class="text-center">生效时间</el-col>
                                <el-col :span="8">
                                    <el-date-picker v-model="option.sku_info.now.effectDate" type="datetimerange" :editable="false"></el-date-picker>
                                </el-col>
                                <el-col :span="5">
                                    <el-checkbox true-label="1" false-label="0" v-model="option.sku_info.now.is_count_down">显示倒计时</el-checkbox>
                                    <el-checkbox true-label="1" false-label="0" v-model="option.sku_info.now.is_stock">显示剩余数</el-checkbox>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4" class="text-center">即将生效的 商品SKU</el-col>
                                <el-col :span="5"><el-input v-model="option.sku_info.coming.sku" placeholder="最多添加2个，用英文逗号隔开"></el-input></el-col>
                                <el-col :span="2" class="text-center">生效时间</el-col>
                                <el-col :span="8">
                                    <el-date-picker v-model="option.sku_info.coming.effectDate" type="datetimerange" :editable="false"></el-date-picker>
                                </el-col>
                                <el-col :span="5">
                                    <el-checkbox true-label="1" false-label="0" v-model="option.sku_info.coming.is_count_down">显示倒计时</el-checkbox>
                                    <el-checkbox true-label="1" false-label="0" v-model="option.sku_info.coming.is_stock">显示剩余数</el-checkbox>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="锚点图标" prop="">
                            <div class="icon-zone">
                                <el-radio v-for="(item, index) in iconData" :key="index" :label="item.label" v-model="option.anchor_class_name">
                                    <img :src="item.src" height="25" width="25">
                                </el-radio>
                            </div>
                        </el-form-item>
                        <el-form-item label="图片名称">
                            <el-input v-model="option.anchor_class_name" :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="选择分类" prop="">
                            <el-row>
                                <el-col :span="8">
                                    <div class="custom-tree-item">
                                        <el-input :readonly="true" v-model="option.cat_name" @click.native="changeTreeFlag(false)" class="js_input"></el-input >
                                        <el-tree v-show="treeFlag" :data="treeData" show-checkbox :props="treeProps" ref="tree" node-key="id"></el-tree>
                                        <div class="btn-box">
                                            <el-button type="primary" v-show="treeFlag" @click="changeTree">确认选择</el-button>
                                            <el-button type="danger" v-show="treeFlag" @click="treeFlag = false">取消</el-button>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="3" class="text-center">对应分类ID</el-col>
                                <el-col :span="10">
                                        <el-input v-model="option.cat_ids" :readonly="true"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="语言" prop="">
                            <el-select v-model="option.lang">
                                <el-option v-for="(item, index) in langOpt" :key="index" :value="item.language_en" :label="item.language_ch"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类馆标题" prop="">
                            <el-input v-model="option.name"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="">
                            <el-input v-model="option.order"></el-input>
                        </el-form-item>
                        <el-form-item label="是否显示" prop="">
                            <el-radio label="1" v-model="option.is_show">是</el-radio>
                            <el-radio label="0" v-model="option.is_show">否</el-radio>
                        </el-form-item>
                        <el-form-item label="添加推荐词" prop="trends">
                            <template v-for="(item, index) in option.trends">
                                <el-row class="trends-arr">
                                    <el-col :span="2" class="text-center">推荐词</el-col>
                                    <el-col :span="8">
                                        <el-input v-model="item.name"></el-input>
                                    </el-col>
                                    <el-col :span="2" class="text-center">推荐词url</el-col>
                                    <el-col :span="8">
                                        <el-input v-model="item.url"></el-input>
                                    </el-col>
                                    <el-col :span="4" class="text-center">
                                        <el-button type="primary" icon="plus" @click="addItem"></el-button>
                                        <el-button type="danger" icon="minus" @click="removeItem(index)"></el-button>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" @click="post">保存</el-button>
                            <el-button type="danger" @click="goback">返回列表</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let checkTrends = function(rule, value, callback){
            value.map(item => {
                if ((item.name && item.url) || (!item.name && !item.url)) {

                } else {
                    callback(new Error('推荐词和url需同时填写'))
                }
            });
        }
        return {
            option: {
                name: '',
                type: '',
                anchor_class_name: '',
                lang: '',
                cat_name: '',
                cat_ids: '',
                order: '',
                is_show: '',
                sku_info: {
                    now: {
                        is_count_down: '',
                        is_stock: '',
                        effectDate: []
                    },
                    coming: {
                        is_count_down: '',
                        is_stock: '',
                        effectDate: []
                    }
                },
                trends: [{
                    name: '',
                    url: ''
                }]
            },
            iconArr: ['apple_accessories','baby', 'bags', 'beauty', 'car', 'computer', 'electronics', 'free', 'gift', 'home','led', 'man', 'office', 'phone', 'sport', 'tablet', 'tools', 'topbrand', 'toys', 'warehouse', 'watch','women'],
            iconData: [],
            effectDate: [],
            treeData: [],
            treeProps: {
                children: 'subCategoryList',
                label: 'categoryName'
            },
            treeFlag: false,
            typeOpt: {},
            langOpt: [],
            postRule: {
                trends: [{
                    validator: checkTrends,
                    trigger: 'blur'
                }]
            },
        };

    },
    created () {
        this.iconArr.map(item => {
            this.iconData.push({
                label: item,
                src: 'src/assets/images/' + item + '.png'
            })
        });
        this.getOpt();
        this.getData();
    },
    methods: {
        getData () {
            let self = this;
            if (this.$route.query.id) {
                this.$http.get('admin/category-library/info', {params: {id: this.$route.query.id}}).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        data.sku_info = JSON.parse(data.sku_info);
                        data.trends = JSON.parse(data.trends);
                        let s1 = data.sku_info.now;
                        let s2 = data.sku_info.coming;

                        s1.effectDate = [new Date(self.timeZone_(s1.start_time, self.$store.getters.getTimeZone)), new Date(self.timeZone_(s1.end_time, self.$store.getters.getTimeZone))];

                        s2.effectDate = [new Date(self.timeZone_(s2.start_time, self.$store.getters.getTimeZone)), new Date(self.timeZone_(s2.end_time, self.$store.getters.getTimeZone))];

                        this.option = data;
                    }
                });
            }
        },
        getOpt () {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                }
            });

            this.$http.get('admin/category-library/options').then(res => {
                if (res.body.code === 0) {
                    this.typeOpt = res.body.data;
                }
            });

            this.$http.get('promotion/index/public-category-list', {params: {lang: 'en'}}).then(res => {
                if (res.body.code === 0) {
                    this.treeData = res.body.data;
                }
            });
        },
        changeTreeFlag (flag) {
            if (!flag) {
                this.treeFlag = !this.treeFlag;
            }
        },
        changeTree () {
            let data = this.$refs.tree.getCheckedNodes();
            let cat_name = [];
            let cat_ids = [];
            if (data.length > 0) {
                data.map(item => {
                    cat_name.push(item.categoryName);
                    cat_ids.push(item.id);
                });
                this.option.cat_ids = cat_ids.join(',');
                this.option.cat_name = cat_name.join(',');
            } else {
                this.$message.warning('未选中任何项');
            }

        },
        addItem () {
            if (this.option.trends.length < 5) {
                this.option.trends.push({
                    name: '',
                    url: ''
                });
            }
        },
        removeItem(index) {
            if (this.option.trends.length === 1) {
                this.$message.warning('最后一项不能删除');
            } else {
                this.option.trends.splice(index, 1);
            }
        },
        closeTree (event) {
            let target = event.target.parentElement._prevClass;
            if (target && target.indexOf('js_input') !== -1) {

            } else {
                this.treeFlag = false;
            }
        },
        post () {
            let params = {};
            for (let i in this.option) {
                if (i !== 'trends' && i !== 'sku_info') {
                    params[i] = this.option[i];
                }
            }

            if (params.type !== 'e_commerce') {
                params.sku_info = {
                    now: {},
                    coming: {}
                };
                let timeArr1 = this.timeZone_(this.option.sku_info.now.effectDate, this.$store.getters.getTimeZone);
                this.option.sku_info.now.start_time = timeArr1[0];
                this.option.sku_info.now.end_time = timeArr1[1];

                let timeArr2 = this.timeZone_(this.option.sku_info.coming.effectDate, this.$store.getters.getTimeZone);
                this.option.sku_info.coming.start_time = timeArr2[0];
                this.option.sku_info.coming.end_time = timeArr2[1];

                for (let j in this.option.sku_info.now) {
                    if (j !== 'effectDate') {
                        params.sku_info.now[j] = this.option.sku_info.now[j];
                    }
                }

                for (let k in this.option.sku_info.coming) {
                    if (k !== 'effectDate') {
                        params.sku_info.coming[k] = this.option.sku_info.coming[k];
                    }
                }

                params.sku_info = JSON.stringify(params.sku_info);
            } else {
                params.sku_info = JSON.stringify({
                    now: {
                        is_count_down: '',
                        is_stock: ''
                    },
                    coming: {
                        is_count_down: '',
                        is_stock: ''
                    }
                });
            }

            params.trends = JSON.stringify(this.option.trends);

            if (params.id) {
                this.$http.post('admin/category-library/edit', params).then(res => {
                    if (res.body.code == 0) {
                        this.$message.success(res.body.message);
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            } else {
                this.$http.post('admin/category-library/add', params).then(res => {
                    if (res.body.code == 0) {
                        this.$message.success(res.body.message);
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }
        },
        goback () {
            this.$router.push({
                name: 'site_indexLibrary'
            })
        }
    }
}
</script>
<style lang="less">
    .addLibrary {
        .icon-zone {
            padding: 10px;
            width: 320px;
            background: #423939;

            .el-radio {
                &:first-child {
                    margin-left: 15px;
                }
            }

            img {
                position: relative;
                top: 5px;
            }
        }

        .set {
            width: 1153px;

            .el-date-editor {
                width: 330px;
            }

            .el-row {
                margin-bottom: 10px;
            }
        }

        .trends-arr {
            margin-bottom: 10px;
        }
    }
</style>
