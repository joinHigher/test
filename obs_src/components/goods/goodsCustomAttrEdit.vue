<!-- 网站自定义属性编辑 -->
<template>
    <div class="good-custom-attr-edit el-container">
        <el-form label-width="180px" :model="option">
            <el-form-item label="属性模板" prop="type" :rules="required">
                <el-select v-model="option.type">
                    <el-option v-for="item in catOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择语言" prop="lang" :rules="required">
                <el-select v-model="option.lang" multiple @change="changeLang" @remove-tag="checkRemove">
                    <el-option v-for="(item, index) in langOpt" :key="item.language_en" :value="item.language_en" :label="item.language_ch"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="显示语言" prop="lang" :rules="required">
                <el-checkbox-group v-model="show">
                    <el-checkbox v-for="(item, index) in option.lang" :key="index" :label="item">{{langObj[item]}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <p class="cat-title"><strong>属性名称</strong></p>
            <template v-for="(item, index) in option.attrList">
                <el-form-item v-if="show.indexOf(item.lang) != -1" :label="item.cnName" :prop="'attrList.' + index + '.attrName'" :rules="required">
                    <el-input v-model="item.attrName"></el-input>
                </el-form-item>
            </template>
            <div v-for="(item, index) in option.attrList[0].list">
                <p class="cat-title">
                    <strong>属性值{{index * 1 + 1}}：</strong>
                    <span class="btn">
                        <el-button type="danger" icon="minus" size="small" v-if="option.attrList[0].list.length > 1" @click="remove(index)" :disabled="removeLoading" v-loading="removeLoading"></el-button>
                        <el-button type="primary" icon="plus" size="small" @click="add"></el-button>
                    </span>
                </p>
                <el-form-item v-for="(subItem, _index) in option.attrList" :key="subItem.lang" :label="subItem.cnName" v-if="option.type == 1 && show.indexOf(subItem.lang) != -1">
                    <el-input v-model="subItem.list[index].attrValue"></el-input>
                </el-form-item>
                <el-form-item v-for="(subItem, _index) in option.attrList" :key="subItem.lang" :label="subItem.cnName" v-if="option.type == 2 && show.indexOf(subItem.lang) != -1">
                    <el-row>
                        <el-col :span="10">
                            <el-input v-model="subItem.list[index].attrValue1"></el-input>
                        </el-col>
                        <el-col :span="4" class="text-center">————</el-col>
                        <el-col :span="10">
                            <el-input v-model="subItem.list[index].attrValue2"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
            </div>
            <div class="text-center">
                <el-button v-if="self.showAction_('goods/category-attribute/add-attr') || self.showAction_('goods/category-attribute/update-attr')" type="primary" @click="post" :disabled="postLoading" v-loading="postLoading">保存</el-button>
                <el-button type="danger" @click="goback">返回</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            let checkValue = (rule, value, callback) => {
                callback();
            }
            return {
                self: this,
                removeLoading: false,
                postLoading: false,
                show: [],
                lastLang: [],
                required: [{required: true, message: '该项不能为空'}],
                editFlag: false,
                route: {},
                checkValue: checkValue,
                listLength: 1,
                langCount: 1,
                attrKey: this.$route.query.id,
                langOpt: {},
                langObj: {},
                catOpt: [{
                    label: '固定值',
                    value: 1,
                }, {
                    label: '区间值',
                    value: 2,
                }],
                option: {
                    type: 1,
                    lang: [],
                    attrList: [{
                        lang: 'en',
                        cnName: '英文',
                        attrName: '',
                        id: null,
                        list: [{
                            attrValue: '',
                            attrValue1: '',
                            attrValue2: '',
                            attrValueKey: '',
                        }],
                    }],
                }
            }
        },
        created() {
            this.getOpt();
        },
        methods: {
            async getOpt () {
                let data = await this.httpGet_('admin/public/languages');
                let route = {};
                this.langOpt = data;
                data.forEach(item => {
                    this.langObj[item.language_en] = item.language_ch
                    route[item.language_en] = {
                        lang: item.language_en,
                        cnName: item.language_ch,
                        attrName: '',
                        id: null,
                        list: [{
                            attrValue: '',
                            attrValueKey: '',
                            attrValue1: '',
                            attrValue2: '',
                        }],
                    };
                });
                this.route = route;

                if (this.$route.query.id) {
                    this.getData();
                } else {
                    this.show.push('en');
                    this.option.lang = this.lastLang = ['en'];
                }
            },
            add () {
                this.option.attrList.forEach(item => {
                    item.list.push({
                        attrValue: '',
                        attrValueKey: '',
                        attrValue1: '',
                        attrValue2: '',
                    });
                })
                this.listLength = this.option.attrList[0].list.length;
            },
            remove (index) {
                let h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('div', null, [
                        h('p', null, '删除后，该属性值将会从系统中删除，是否确认本操作?'),
                        h('p', null, '该属性值所有多语言资料将被清空'),
                        h('p', null, '该属性值与商品分类的绑定关系失效'),
                        ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    callback: async (action) => {
                        if (action === 'confirm') {
                            let temp = [];
                            this.option.attrList.forEach(item => {
                                if (item.list[index].id) {
                                    temp.push(item.list[index].id);
                                }
                            });


                            if (temp.length === 0) {
                                this.option.attrList.forEach(item => {
                                    item.list.splice(index, 1);
                                });
                                this.listLength = this.option.attrList[0].list.length;
                            } else {
                                this.removeLoading = true;
                                try {
                                    const data = await this.httpPost_('goods/category-attribute/del-attr-val', {attrValueIdList: temp});
                                    this.$message.success(data.message);
                                    this.getData();
                                } finally {
                                    this.removeLoading = false;
                                }
                            }

                        } else {
                            this.$message.info('已取消')
                        }
                    }
                })
                // this.option.attrList.forEach(item => {
                //     item.list.splice(index, 1);
                // });
                // this.listLength = this.option.attrList[0].list.length;
            },
            async getData (index) {
                let params = {};
                params.attkey = this.$route.query.id;
                params.type = 3;

                let data = await this.httpGet_('goods/category-attribute/attr-info', {params: params});

                this.option.type = Number(this.$route.query.type);
                let langList = [];
                let temp = [];
                data.attrInfo.forEach((item, index) => {
                    let lang = item.lang;
                    let attrName = item.categoryAttrResp.attrName;
                    let list = [];

                    this.show.push(lang);
                    langList.push(lang);

                    data.attrValueInfo.forEach((info) => {
                        let value = info.langAndAttrValueInfo;
                        if (this.option.type == 1) {
                            list.push({
                                attrValue: value[index].categoryAttrValueResp.attrValue,
                                attrValueKey: value[index].categoryAttrValueResp.attrValueKey,
                                attrValue1: '',
                                attrValue2: '',
                                id: value[index].categoryAttrValueResp.id
                            })
                        } else {
                            let flag = false;
                            let valueList = value[index].categoryAttrValueResp.attrValue.split('-');
                            if (valueList && valueList.length > 0) {
                                flag = true;
                            }
                            list.push({
                                attrValue: '',
                                attrValueKey: value[index].categoryAttrValueResp.attrValueKey,
                                attrValue1: flag ? valueList[0] : '',
                                attrValue2: flag ? valueList[1] : '',
                                id: value[index].categoryAttrValueResp.id
                            })
                        }
                    });

                    temp.push({
                        lang: lang,
                        id: item.categoryAttrResp.id,
                        cnName: this.route[lang].cnName,
                        attrName: attrName,
                        list: list,
                    });
                });

                this.option.lang = langList;
                this.editFlag = true;
                this.option.attrList = temp;
                // 计算用长度
                // this.infoLang = langList;
                this.lastLang  = langList;
                this.langCount = langList.length;
                this.listLength = this.option.attrList[0].list.length;
            },
            checkRemove (val) {
                // 0.82不做删除
                // if (val && val.value === 'en') {
                //     this.$alert('英文不能被删除！');
                //     return;
                // } else {
                //      let indexList = [];
                //     this.option.attrList.forEach(item => {
                //         indexList.push(item.lang);
                //     });
                //     let index = indexList.indexOf(val.value);
                //     this.option.attrList.splice(index, 1);
                // }
                // this.langCount = this.option.lang.length;
            },
            changeLang (val) {
                if (this.editFlag) {
                    this.editFlag = false;
                    return;
                }

                if (this.langCount > val.length) {
                    this.option.lang = this.lastLang;
                    return;
                }
                // 0.82不删除
                // if (val.indexOf('en') === -1) {
                //     this.$alert('英文不能被删除！');
                //     this.option.lang.unshift('en');
                // } else if (this.langCount > val.length){
                //     let value = this.lastLang.pop();
                //     this.checkRemove({value: value});
                // }

                if (this.langCount < val.length) {
                    // 根据选项增加list数组
                    let list = [];
                    for (let i = 0; i < this.listLength; i++) {
                        list.push({
                            attrValue: '',
                            attrValueKey: '',
                            attrValue1: '',
                            attrValue2: '',
                            attrValueKey: this.option.attrList[0].list[i].attrValueKey
                        });
                    };
                    // 数组新增项
                    let pushObj = JSON.parse(JSON.stringify(Object.assign(this.route[val[val.length - 1]], {list: list})));
                    this.option.attrList.push(pushObj);

                    // 计算语言选项条数
                    this.lastLang = this.show = this.option.lang;
                    this.langCount = this.option.lang.length;
                }

            },
            goback () {
                this.$router.push({
                    name: 'goods_customAttr'
                })
            },
            async post () {
                let postType = this.option.type;
                if (!this.option.type) {
                    this.$message('类型不能为空');
                    return false;
                }
                let flag = true;
                for (let i in this.option.attrList) {
                    let item = this.option.attrList[i];
                    if (!item.attrName) {
                        flag = false;
                        break;
                    } else {

                        for (let j in item.list) {
                            let subItem = item.list[j];
                            if (this.option.type == 1 && j == 'attrValue') {
                                if (!subItem.attrValue) {
                                    flag = false;
                                    break;
                                }
                            } else if(j == 'attrValue1' || j == 'attrValue2') {
                                if (!subItem.attrValue) {
                                    flag = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (!flag) {
                    this.$alert('请完善表单内容', '提示');
                    return false;
                }


                let params = {},
                    attrNameList = [],
                    attrValueList = [];

                let src = 'goods/category-attribute/add-attr';

                let length = this.option.attrList[0].list.length;

                for (let i = 0; i < length; i++) {
                    attrValueList[i] = {
                        attrValueLangList: [],
                        attrValueKey: '',
                    };
                }

                if (this.attrKey) {
                    for (let i = 0; i < length; i++) {
                        attrValueList[i] = {
                            attrValueLangList: [],
                        };
                    }
                    src = 'goods/category-attribute/update-attr';

                    this.option.attrList.forEach(item => {
                        let temp = {};

                        if (item.id) {
                            attrNameList.push({
                                lang: item.lang,
                                attrName: item.attrName,
                                attrKey: this.attrKey,
                                id: item.id
                            });
                        } else {
                            attrNameList.push({
                                lang: item.lang,
                                attrName: item.attrName,
                                attrKey: this.attrKey,
                            });
                        }

                        item.list.forEach((attr, index) => {
                            let postValue = '';
                            if (postType == 1) {
                                postValue = attr.attrValue;
                            } else {
                                postValue = attr.attrValue1 + '-' + attr.attrValue2;
                            }
                            let pushItem = {
                                attrValue: postValue,
                                lang: item.lang,
                                attrKey: this.attrKey,
                                attrValueKey: attr.attrValueKey,
                                id: attr.id,
                            };

                            if (!attr.id) {
                                delete pushItem.id
                            }
                            attrValueList[index].attrValueLangList.push(pushItem);
                        })
                    });
                    params = {
                        type: 3,
                        templateType: this.option.type,
                        attrNameList: attrNameList,
                        attrValueList: attrValueList
                    };
                } else {
                    for (let i = 0; i < length; i++) {
                        attrValueList[i] = {
                            attrValueLangList: [],
                        };
                    }
                    this.option.attrList.forEach(item => {
                        let temp = {};
                        attrNameList.push({
                            lang: item.lang,
                            attrName: item.attrName
                        });

                        item.list.forEach((attr, index) => {
                            let postValue = '';
                            if (postType == 1) {
                                postValue = attr.attrValue;
                            } else {
                                postValue = attr.attrValue1 + '-' + attr.attrValue2;
                            }
                            attrValueList[index].attrValueLangList.push({
                                attrValue: postValue,
                                lang: item.lang
                            })
                        })
                    });

                    params = {
                        attrNameList: attrNameList,
                        attrValueList: attrValueList,
                        templateType: this.option.type,
                        type: 3,
                    };
                }

                this.postLoading = true;
                try {
                    const data = await this.httpPost_(src, params);
                    this.$message.success(data.message);
                    this.$router.push({
                        name: 'goods_customAttr'
                    });
                } finally {
                    this.postLoading = false;
                }
            }
        }
    }
</script>

<style lang="less">
    .good-custom-attr-edit {
        .el-form {
            width: 70%;
        }

        .cat-title {
            margin-bottom: 22px;

            .btn {
                float: right;
            }
        }

        .el-tag__close {
            display: none;
        }
    }
</style>
