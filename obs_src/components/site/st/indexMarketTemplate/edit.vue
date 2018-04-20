<template>
    <div class="marketing-index">
        <div class="el-container">
            <el-row>
                <el-col :span="20">
                    <el-form ref="form" :model="option" :rules="rules" label-width="100px">
                        <el-form-item label="模板名称" prop="name">
                            <el-input v-model="option.name"></el-input>
                        </el-form-item>
                        <el-form-item label="请选择平台" prop="platform">
                            <el-select v-model="option.platform" @change="changePlatform">
                                <el-option v-for="(item, index) in platformOpt" :value="index" :label="item" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="请选择语言" prop="lang">
                            <el-select :disabled="!option.platform" v-model="option.lang">
                                <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="item.language_en"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="有效时间" prop="date">
                            <el-date-picker v-model="option.date" type="datetimerange" placeholder="选择日期范围"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="启用状态">
                            <el-radio-group v-model="option.status">
                                <el-radio class="radio" :label="1">启用</el-radio>
                                <el-radio class="radio" :label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input v-model="option.order"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input type="textarea" :rows="2" v-model="option.remark"></el-input>
                        </el-form-item>
                        <el-form-item label="选择模板样式">
                            <el-row :gutter="10" style="margin-bottom: 20px">
                                <el-col :span="5" class="grid-content-parent">
                                    <div class="grid-content" :class="[templateStatus.template_1.checked ? 'check-box' : '']" @click="templateSelectedChange(1)">1
                                    </div>
                                    <span class="grid-title">样式模板1</span>
                                </el-col>
                                <el-col :span="5" class="grid-content-parent">
                                    <div class="grid-content" :class="[templateStatus.template_2.checked ? 'check-box' : '']" @click="templateSelectedChange(2)">
                                        <span style="margin-left:-50%;">1</span>
                                        <div class="grid-center" :class="[templateStatus.template_2.checked ? 'check' : '']">2
                                        </div>
                                    </div>
                                    <span class="grid-title">样式模板2</span>
                                </el-col>
                                <el-col :span="5" class="grid-content-parent">
                                    <div class="grid-content" :class="[templateStatus.template_3.checked ? 'check-box' : '']" @click="templateSelectedChange(3)">
                                        <span style="margin-left:-65%;">1</span>
                                        <div class="grid-30-percent" :class="[templateStatus.template_3.checked ? 'check' : '']">2
                                        </div>
                                        <div class="grid-30-percent" :class="[templateStatus.template_3.checked ? 'check' : '']">3
                                        </div>
                                    </div>
                                    <span class="grid-title">样式模板3</span>
                                </el-col>
                                <el-col :span="5" class="grid-content-parent">
                                    <div class="grid-content" :class="[templateStatus.template_4.checked ? 'check-box' : '']" @click="templateSelectedChange(4)">
                                        <span style="margin-left:-50%;">1</span>
                                        <div class="grid-center" :class="[templateStatus.template_4.checked ? 'check' : '']">
                                            <span style="margin-top:-10px;display:block;">2</span>
                                        </div>
                                        <div class="grid-top-center" :class="[templateStatus.template_4.checked ? 'check' : '']">3
                                        </div>
                                    </div>
                                    <span class="grid-title">样式模板4</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" style="margin-left:0">
                                <el-col :span="5" class="grid-content-parent">
                                    <div class="grid-content" :class="[templateStatus.template_5.checked ? 'check-box' : '']" @click="templateSelectedChange(5)">
                                        <span style="margin-left:-75%;">1</span>
                                        <div class="grid-25-percent" :class="[templateStatus.template_5.checked ? 'check' : '']">2
                                        </div>
                                        <div class="grid-25-percent" :class="[templateStatus.template_5.checked ? 'check' : '']">3
                                        </div>
                                        <div class="grid-25-percent" :class="[templateStatus.template_5.checked ? 'check' : '']">4
                                        </div>
                                    </div>
                                    <span class="grid-title">样式模板5</span>
                                </el-col>
                                <el-col :span="5" class="grid-content-parent">
                                    <div class="grid-content" :class="[templateStatus.template_6.checked ? 'check-box' : '']" @click="templateSelectedChange(6)">
                                        <span style="margin-left:-50%;">1</span>
                                        <div class="grid-center" :class="[templateStatus.template_6.checked ? 'check' : '']">
                                            <span style="margin-top:-10px;display:block;">2</span>
                                        </div>
                                        <div class="grid-top-33-percent" style="margin-top:-18px;" :class="[templateStatus.template_6.checked ? 'check' : '']">
                                            <span style="margin-top:-20%;">3</span>
                                        </div>
                                        <div class="grid-top-33-percent" :class="[templateStatus.template_6.checked ? 'check' : '']">4
                                        </div>
                                    </div>
                                    <span class="grid-title">样式模板6</span>
                                </el-col>
                                <el-col :span="5" class="grid-content-parent">
                                    <div class="grid-content" :class="[templateStatus.template_7.checked ? 'check-box' : '']" @click="templateSelectedChange(7)">
                                        <span style="margin-left:-50%;">1</span>
                                        <div class="grid-center" :class="[templateStatus.template_7.checked ? 'check' : '']">
                                            <span style="margin-top:-20%;">2</span>
                                        </div>
                                        <div class="grid-top-center" :class="[templateStatus.template_7.checked ? 'check' : '']">3
                                        </div>
                                        <div class="grid-bottom-center" :class="[templateStatus.template_7.checked ? 'check' : '']">4
                                        </div>
                                    </div>
                                    <span class="grid-title">样式模板7</span>
                                </el-col>
                                <el-col :span="5" class="grid-content-parent">
                                    <div class="grid-content" :class="[templateStatus.template_8.checked ? 'check-box' : '']" @click="templateSelectedChange(8)">
                                        <span style="margin-left:-50%;">1</span>
                                        <div class="grid-center" :class="[templateStatus.template_8.checked ? 'check' : '']">
                                            <span style="margin-top:-20%;">2</span>
                                        </div>
                                        <div class="grid-top-center" :class="[templateStatus.template_8.checked ? 'check' : '']">4
                                        </div>
                                        <div class="grid-vertical-center" :class="[templateStatus.template_8.checked ? 'check' : '']">3
                                        </div>
                                        <span>5</span>
                                    </div>
                                    <span class="grid-title">样式模板8</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="选择模板样式">
                            <template v-for="(template, index) in option.items">
                                <div class="item-box">
                                    <el-form-item>
                                        <p class="title">样式模板{{template.template_id}}</p>
                                        <template v-for="(item, index) in template.base">
                                            <el-row class="item-row">
                                                <el-col :span="3">图片地址{{1+index}}</el-col>
                                                <el-col :span="7">
                                                    <el-input v-model="item.image_link" placeholder="http://example.com"></el-input>
                                                </el-col>
                                                <el-col :span="3" class="text-center">
                                                    <el-upload :action="imgUrl.uploadUrl" name="files" :show-file-list="false" :multiple="false" :before-upload="checkUp(template.template_id)" :on-success="getRes(item, template.template_id)">
                                                        <el-button v-loading="loadingOpt[String(template.template_id)]" size="small" type="primary">点击上传</el-button>
                                                    </el-upload>
                                                </el-col>
                                                <el-col :span="3">跳转URL</el-col>
                                                <el-col :span="7">
                                                    <el-input v-model="item.url" placeholder="http://example.com"></el-input>
                                                </el-col>
                                            </el-row>
                                            <el-row class="item-row">
                                                <el-col :span="3">图片蒙版名称</el-col>
                                                <el-col :span="7">
                                                    <el-input type="textarea" :rows="1" v-model="item.mask_name"></el-input>
                                                </el-col>
                                                <el-col :span="3" :offset="3">图片蒙版描述</el-col>
                                                <el-col :span="7">
                                                    <el-input type="textarea" :rows="1" v-model="item.mask_description"></el-input>
                                                </el-col>
                                            </el-row>
                                            <el-row class="item-row">
                                                <el-col :span="3">是否M版隐藏</el-col>
                                                <el-col :span="7">
                                                    <el-radio-group v-model="item.m_hidden">
                                                        <el-radio class="radio" label="1">是</el-radio>
                                                        <el-radio class="radio" label="0">否</el-radio>
                                                    </el-radio-group>
                                                </el-col>
                                            </el-row>
                                        </template>
                                        <el-row class="item-row">
                                            <el-col :span="3">排序</el-col>
                                            <el-col :span="4">
                                                <el-input v-model="template.order"></el-input>
                                            </el-col>
                                        </el-row>
                                        <el-row v-if="template.template_id != 1" class="item-row">
                                            <el-col :span="3">SKU</el-col>
                                            <el-col :span="4">
                                                <el-input v-model="template.sku_info"></el-input>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </div>
                            </template>
                        </el-form-item>
                    </el-form>
                    <div class="el-sub-container text-center">
                        <el-button v-if="self.showAction_('admin/index-market-template/edit')" type="primary" @click="save" v-loading="postLoading" :disabled="postLoading">确认</el-button>
                        <el-button type="danger" @click="goBack">取消</el-button>
                        <el-button type="primary" @click="prview('pc')">PC预览</el-button>
                        <el-button type="primary" @click="prview('m')">M版预览</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- dialog s -->
        <el-dialog title="预览" v-model="prevDialog" size="full">
            <div :class="style">
                <template v-for="(template, index) in option.items">
                    <div :class="'index-card-' + template.template_id">
                        <template v-for="(link, _index) in template.base" v-if="link.m_hidden != '1'">
                            <a :href="link.url" :class="link.m_hidden == '1' ? 'st-show' : ''">
                                <img :src="link.image_link" alt="">
                                <div class="text" :class="{left: leftCount(template.template_id, _index), top: topCount(template.template_id,_index)}">
                                    <div :class="{bg: bgCount(template.template_id, _index)}">
                                        <h2>{{link.mask_name}}</h2>
                                        <p>{{link.mask_description}}</p>
                                    </div>
                                </div>
                            </a>
                        </template>
                    </div>
                </template>
            </div>
        </el-dialog>
        <!-- dialog e -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            self: this,
            postLoading: false,
            style: '',
            loadingOpt: {
                '1': false,
                '2': false,
                '3': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false,
                '8': false
            },
            Domain: '',
            prevDialog: false,
            option: {
                id: 0,
                date: [],
                platform: this.$route.query.platform,
                lang: '',
                status: '1',
                remark: '',
                items: []
            },
            langOpt: [],
            platformOpt: [],
            templateStatus: {
                'template_1': { checked: false, count: 1 },
                'template_2': { checked: false, count: 2 },
                'template_3': { checked: false, count: 3 },
                'template_4': { checked: false, count: 3 },
                'template_5': { checked: false, count: 4 },
                'template_6': { checked: false, count: 4 },
                'template_7': { checked: false, count: 4 },
                'template_8': { checked: false, count: 5 },
            },
            rules: {
                name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
                platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
                lang: [{ required: true, message: '请选择语言', trigger: 'change' }],
                date: { type: 'array', required: true, message: '请选择日期', trigger: 'change' },
            },
        };
    },
    created() {
        this.imgUrl = this.$store.getters.getUploadUrl;
        this.initData();
    },
    methods: {
        topCount (id, index) {
            return (id == 8 && index > 0) || ((id == 7) && index > 1);
        },
        leftCount (id, index) {
            return ((id == 4 || id == 6) && index > 0) || (id == 7 && index == 1);
        },
        bgCount (id, index) {
            return (id <= 5 && id != 4) || (index == 0);
        },
        initData() {
            this.option.id = this.$route.query.id || '';
            this.getPlat();
            this.getLang();
            this.getData();
            this.Domain = 'http://review.stylebest.com/';
        },
        getData() {
            if (typeof this.$route.query.id != 'undefined' && this.$route.query.id) {
                this.$http.get('admin/index-market-template/info', { params: { id: this.$route.query.id } }).then((res) => {
                    let data = res.body.data;
                    data.date = [];
                    data.date.push(new Date(data.start_time * 1000));
                    data.date.push(new Date(data.end_time * 1000));
                    data.items = JSON.parse(data.item_json);
                    for (let index in data.items) {
                        this.templateStatus['template_' + data.items[index]['template_id']].checked = true;
                    }
                    this.option = data;
                })
            }
        },
        getPlat() {
            this.$http.get('admin/public/platforms').then(res => {
                if (res.body.code === 0) {
                    this.platformOpt = res.body.data;
                }
            });
        },
        getLang() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                }
            });
        },
        save() {
            this.postLoading = true;
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let post = {
                        id: this.option.id,
                        platform: this.option.platform,
                        name: this.option.name,
                        lang: this.option.lang,
                        status: this.option.status,
                        start_time: (this.option.date[0] instanceof Object) ? this.option.date[0].getTime() / 1000 : '',
                        end_time: (this.option.date[1] instanceof Object) ? this.option.date[1].getTime() / 1000 : '',
                        remark: this.option.remark,
                        order: this.option.order,
                        item_json: JSON.stringify(this.option.items),
                    };
                    if (this.option.id) {
                        this.$http.post('admin/index-market-template/edit', post).then(res => {
                            this.postLoading = false;
                            if (res.body.code == 0) {
                                history.back();
                                this.$message({
                                    type: 'success',
                                    message: res.body.message
                                })
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.postLoading = false;
                        })
                    } else {
                        this.$http.post('admin/index-market-template/add', post).then(res => {
                            this.postLoading = false;
                            if (res.body.code == 0) {
                                history.back();
                                this.$message({
                                    type: 'success',
                                    message: res.body.message
                                })
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {
                            this.postLoading = false;
                        })
                    }
                } else {
                    this.postLoading = false;
                    return false;
                }
            });

        },
        goBack() {
            this.$router.push({
                name: 'indexMarketTemplateList'
            })
        },
        templateSelectedChange(id) {
            this.templateStatus['template_' + id].checked = !this.templateStatus['template_' + id].checked;
            if (this.templateStatus['template_' + id].checked) {
                let item = [];
                for (let i = 0; i < this.templateStatus['template_' + id].count; i++) {
                    item.push({
                        image_link: '',
                        url: '',
                        mask_name: '',
                        mask_description: '',
                        m_hidden: '0'
                    });
                }
                let tempData = this.option.items;
                tempData.push({
                    order: 1,
                    sku_info: '',
                    template_id: id,
                    base: item
                });
                tempData.sort(function (a, b) {
                    return a.template_id - b.template_id;
                });
                this.option.items = tempData;
            } else {
                this.option.items = this.option.items.filter(function (obj) {
                    return obj.template_id != id;
                });
            }
        },
        prview (platform) {
            if (this.option.items.length === 0) {
                this.$message.warning('至少选择一项模板');
                return false;
            }
            if (platform === 'm') {
                this.style = platform;
            } else {
                this.style = '';
            }
            this.prevDialog = true;
        },
        checkUp (id) {
            return (file) => {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                  this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                  this.$message.error('上传头像图片大小不能超过 2MB!');
                }

                if (isJPG && isLt2M) {
                    this.loadingOpt[String(id)] = true;
                    return true;
                } else {
                    return false;
                }
            }
        },
        getRes (item, id) {
            return (res, file) => {
                this.loadingOpt[String(id)] = false;
                if (res.code === 0) {
                    this.$message.success(res.message);
                    item.image_link = this.Domain + res.data;
                } else {
                    this.$message.warning(res.message);
                }

            }
        },
        changePlatform (val) {
            this.option.lang = '';
            this.getLang();
        },
    },
}
</script>
<style lang="less">
.marketing-index {
    @mWidth: 580px;
    @pcWidth: 1920px;

    .item-box {
        padding: 10px 10px 20px;
        margin-bottom: 20px;
        border: 1px solid #58B7FF;
        border-radius: 20px;
        position: relative;
    }

    .item-row {
        padding: 10px 0;
        text-align: center;
    }

    .item-box .title {
        position: absolute;
        top: -20px;
        margin: 0;
        padding: 0 5px;
        color: #58B7FF;
        font-size: 12px;
        font-weight: bold;
        background-color: white;
        line-height: 25px;
    }

    .grid-content-parent {
        cursor: pointer;
        position: relative;
    }

    .grid-content {
        border: 1px solid rgb(191, 203, 217);
        height: 50px;
        width: 100%;
        background-color: #FFF;
    }

    .grid-center {
        margin-left: 50%;
        width: 1px;
        background-color: rgb(191, 203, 217);
        height: 50px;
        float: left;
    }

    .grid-bottom-center {
        margin-left: 75%;
        background-color: rgb(191, 203, 217);
        width: 1px;
        height: 25px;
    }

    .grid-top-center {
        height: 1px;
        margin-top: -10px;
        margin-left: 50%;
        width: 50%;
        background-color: rgb(191, 203, 217);
    }

    .grid-30-percent {
        margin-left: 33%;
        width: 1px;
        background-color: rgb(191, 203, 217);
        height: 50px;
        float: left;
    }

    .grid-25-percent {
        margin-left: 25%;
        width: 1px;
        background-color: rgb(191, 203, 217);
        height: 50px;
        float: left;
    }

    .grid-top-33-percent {
        height: 1px;
        margin-left: 50%;
        margin-top: 17px;
        line-height: normal;
        background-color: rgb(191, 203, 217);
    }

    .grid-vertical-center {
        margin-left: 75%;
        margin-top: -50px;
        width: 1px;
        background-color: rgb(191, 203, 217);
        height: 50px;
        float: left;
    }

    .check-box {
        border-color: rgb(255, 191, 0);
        box-shadow: 5px 5px 3px #888888;
        color: rgb(255, 191, 0);
    }

    .check {
        background-color: rgb(255, 191, 0);
    }

    .grid-title {
        color: #58B7FF;
        text-align: center;
    }



    [class^='index-card'] {
        font-size: 0;
        max-width: 1200px;
        overflow: hidden;
        margin: 40px auto;
        >a {
            position: relative;
            img {
                width: 100%;
                height: auto;
            }
        }
        .text {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 50px;
            text-align: center;
            margin: auto;
            &.top {
                bottom: initial;
                top: 20px;
            }
            &.left {
                top: 0;
                left: 40px;
                bottom: 0;
                right: initial;
                text-align: left;
                &:after {
                    content: '';
                    height: 100%;
                    width: 0;
                    vertical-align: middle;
                    display: inline-block;
                }
                >div {
                    vertical-align: middle;
                    height: auto;
                }
            }
            >div {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                &.bg {
                    background: rgba(255, 255, 255, .9);
                }
                display: inline-block;
            }
        }
        h2 {
            margin-bottom: 12px;
            font-family: 'AB';
        }
        p {
            font-family: 'AR';
        }
    }

    .index-card-title {
        text-align: center;
        margin: 20px auto;
        font-size: 34px;
        font-weight: bold;
    }

    .index-card-1 {
        a {
            display: block;
        }
        .text {
            width: 600px;
            height: 120px;
            >div {
                padding: 30px 0px;
            }
        }
        h2 {
            font-size: 30px;
            line-height: 30px;
        }
        p {
            font-size: 16px;
            line-height: 16px;
        }
    }

    .index-card-2 {
        a {
            width: calc(~'50% - 5px');
            display: inline-block;
            &:first-child {
                margin-right: 10px;
            }
        }
        .text {
            height: 120px;
            width: 494px;
            >div {
                padding: 30px 0px;
            }
        }
        h2 {
            font-size: 30px;
            line-height: 22px;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 16px;
        }
    }

    .index-card-3 {
        a {
            width: calc(~'33.333333% - 6.666666px');
            display: inline-block;
            &:nth-child(2) {
                margin: 0 10px;
            }
        }
        .text {
            width: 290px;
            height: 120px;
            >div {
                padding: 30px 0px;
            }
        }
        h2 {
            font-size: 30px;
            line-height: 30px;
        }
        p {
            font-size: 16px;
            line-height: 16px;
        }
    }

    .index-card-4 {
        a {
            display: inline-block;
            float: left;
            width: calc(~'50% - 5px');
            &:first-child {
                margin-right: 10px;
                .text {
                    width: 495px;
                    height: 120px;
                }
            }
            &:nth-of-type(2) {
                margin-bottom: 10px;
            }
        }
        .text {
            >div {
                padding: 25px 0px;
            }
        }
        h2 {
            font-size: 30px;
            line-height: 30px;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 16px;
        }
    }

    .index-card-5 {
        a {
            display: inline-block;
            width: calc(~'25% - 7.5px');
            margin-right: 10px;
            &:last-of-type {
                margin-right: 0;
            }
        }
        .text {
            width: 255px;
            height: 80px;
            bottom: 20px;
            >div {
                padding: 15px 0px;
            }
        }
        h2 {
            font-size: 24px;
            line-height: 24px;
            margin-bottom: 5px;
        }
        p {
            font-size: 14px;
            line-height: 14px;
        }
    }

    .index-card-6 {
        a {
            float: left;
            width: calc(~'50% - 5px');
            &:first-child {
                margin-right: 10px;
                .text {
                    width: 490px;
                    height: 120px;
                }
            }
            &:nth-of-type(3) {
                margin: 10px 0;
            }
        }
        .text {
            >div {
                padding: 20px 0px;
            }
        }
        h2 {
            font-size: 30px;
            line-height: 30px;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 16px;
        }
    }

    .index-card-7 {
        a {
            float: left;
            width: calc(~'50% - 5px');
            &:first-child {
                margin-right: 10px;
                .text {
                    width: 490px;
                    height: 120px;
                }
            }
            &:nth-of-type(n+3) {
                width: calc(~'25% - 7.5px');
            }
            &:nth-of-type(2) {
                margin-bottom: 10px;
            }
            &:nth-of-type(3) {
                margin-right: 10px;
            }
        }
        .text {
            >div {
                padding: 20px 0px;
            }
            &.top {
                h2 {
                    font-size: 18px;
                    line-height: 18px;
                }
                p {
                    font-size: 16px;
                    line-height: 16px;
                }
            }
        }
        h2 {
            font-size: 30px;
            line-height: 30px;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 16px;
        }
    }

    .index-card-8 {
        a {
            float: left;
            width: calc(~'50% - 5px');
            &:first-child {
                margin-right: 10px;
                .text {
                    width: 490px;
                    height: 120px;
                }
            }
            &:nth-of-type(n+2) {
                width: calc(~'25% - 7.5px');
            }
            &:nth-of-type(2n) {
                margin-right: 10px;
            }
            &:nth-of-type(3),
            &:nth-of-type(3) {
                margin-bottom: 10px;
            }
        }
        .text {
            >div {
                padding: 20px 0px;
            }
            &.top {
                h2 {
                    font-size: 18px;
                    line-height: 18px;
                }
                p {
                    font-size: 16px;
                    line-height: 16px;
                }
            }
        }
        h2 {
            font-size: 30px;
            line-height: 30px;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 16px;
        }
    }

    @media screen and (max-width:1200px) {
        [class^='index-card'] {
            .text {
                &.left {
                    left: 3.33333vw;
                }
            }
        }
        .index-card-1 {
            h2 {
                font-size: 2.5vw;
                line-height: 2.5vw;
                margin-bottom: 1vw;
            }
            p {
                font-size: 1.33333vw;
                line-height: 1.33333vw;
            }
            .text {
                >div {
                    padding: 2.5vw 0;
                }
                width:50vw;
                height:10vw;
                bottom:4.16666vw;
            }
        }
        .index-card-2 {
            h2 {
                font-size: 2.5vw;
                line-height: 2.5vw;
                margin-bottom: 1vw;
            }
            p {
                font-size: 1.33333vw;
                line-height: 1.33333vw;
            }
            .text {
                >div {
                    padding: 2.5vw 0;
                }
                width:41.16666vw;
                height:10vw;
                bottom:4.16666vw;
            }
        }
        .index-card-3 {
            h2 {
                font-size: 2.5vw;
                line-height: 2.5vw;
                margin-bottom: 1vw;
            }
            p {
                font-size: 1.33333vw;
                line-height: 1.33333vw;
            }
            .text {
                >div {
                    padding: 2.5vw 0;
                }
                width:24.16666vw;
                height:10vw;
                bottom:4.16666vw;
            }
        }
        .index-card-4 {
            h2 {
                font-size: 2.5vw;
                line-height: 2.5vw;
                margin-bottom: 1vw;
            }
            p {
                font-size: 1.33333vw;
                line-height: 1.33333vw;
            }
            a:first-child {
                .text {
                    width: 41.25vw;
                    height: 10vw;
                    >div {
                        padding: 2.08vw 0;
                    }
                }
            }
            .text {
                >div {
                    padding: 1.25vw 0;
                }
                bottom:4.16666vw;
            }
        }
        .index-card-5 {
            h2 {
                font-size: 2vw;
                line-height: 2vw;
                margin-bottom: 0.4vw;
            }
            p {
                font-size: 1.16666vw;
                line-height: 1.16666vw;
            }
            .text {
                >div {
                    padding: 1.25vw 0;
                }
                width:21.25vw;
                height:6.66666vw;
                bottom:1.16666vw;
            }
        }
        .index-card-6,
        .index-card-7,
        .index-card-8 {
            h2 {
                font-size: 2.5vw;
                line-height: 2.5vw;
                margin-bottom: 1vw;
            }
            p {
                font-size: 1.33333vw;
                line-height: 1.33333vw;
            }
            a:first-child {
                .text {
                    width: 40.83333vw;
                    height: 10vw;
                    >div {
                        padding: 2.08vw 0;
                    }
                }
            }
            .text {
                >div {
                    padding: 1.25vw 0;
                }
                bottom:4.16666vw;
            }
        }
    }

    .m {
        width: 580px;
        margin: auto;

        [class^='index-card'] {
            >a {
                &.st-show {
                    display: none!important;
                }
            }
        }
        .index-card-1 {
            h2 {
                font-size: 2.5 * 0.01 * @mWidth;
                line-height: 2.5 * 0.01 * @mWidth;
                margin-bottom: 1 * 0.01 * @mWidth;
            }
            p {
                font-size: 1.33333 * 0.01 * @mWidth;
                line-height: 1.33333 * 0.01 * @mWidth;
            }
            .text {
                >div {
                    padding: 2.5 * 0.01 * @mWidth 0;
                }
                width:50 * 0.01 * @mWidth;
                height:10 * 0.01 * @mWidth;
                bottom:4.16666 * 0.01 * @mWidth;
            }
        }
        .index-card-2,
        .index-card-3 {
            .text {
                width: 76 * 0.01 * @mWidth;
                height: 18 * 0.01 * @mWidth;
                bottom: 8.33333 * 0.01 * @mWidth;
                >div {
                    padding: 4 * 0.01 * @mWidth 0;
                }
            }
            >a {
                width: 100%;
                margin: 0 0 10px 0!important;
            }
            h2 {
                font-size: 5 * 0.01 * @mWidth;
                line-height: 5 * 0.01 * @mWidth;
                margin-bottom: 3.33333 * 0.01 * @mWidth;
            }
            p {
                font-size: 2.66666 * 0.01 * @mWidth;
                line-height: 2.66666 * 0.01 * @mWidth;
            }
        }
        .index-card-5 {
            >a {
                width: calc(~'50% - 5px');
                display: inline-block;
                margin-right: 0;
                margin-bottom: 10px;
                &:nth-of-type(2n+1) {
                    margin-right: 10px;
                }
            }
            .text {
                width: 39 * 0.01 * @mWidth;
                height: 13 * 0.01 * @mWidth;
                bottom: 3 * 0.01 * @mWidth;
                >div {
                    padding: 2 * 0.01 * @mWidth 0;
                }
            }
            h2 {
                font-size: 5 * 0.01 * @mWidth;
                line-height: 5 * 0.01 * @mWidth;
            }
            p {
                font-size: 3 * 0.01 * @mWidth;
                line-height: 3 * 0.01 * @mWidth;
            }
        }
        .index-card-4,
        .index-card-6 {
            >a {
                display: block;
                width: 100%;
                margin: 0 0 10px 0;
                &:first-child {
                    .text {
                        width: 77 * 0.01 * @mWidth;
                        height: 18 * 0.01 * @mWidth;
                        bottom: 8 * 0.01 * @mWidth;
                        >div {
                            padding: 3 * 0.01 * @mWidth 0;
                        }
                    }
                }
            }
            .text {
                &.left {
                    left: 6.66666 * 0.01 * @mWidth;
                }
            }
            h2 {
                font-size: 5 * 0.01 * @mWidth;
                line-height: 5 * 0.01 * @mWidth;
            }
            p {
                font-size: 3 * 0.01 * @mWidth;
                line-height: 3 * 0.01 * @mWidth;
            }
        }
        .index-card-7 {
            >a {
                &:nth-of-type(1),&:nth-of-type(2) {
                    display: block;
                    width: 100%;
                    margin: 0 0 10px 0;
                    .text {
                        width: 77 * 0.01 * @mWidth;
                        height: 18 * 0.01 * @mWidth;
                        bottom: 8 * 0.01 * @mWidth;
                        >div {
                            padding: 3 * 0.01 * @mWidth 0;
                        }
                        h2 {
                            font-size: 5 * 0.01 * @mWidth;
                            line-height: 5 * 0.01 * @mWidth;
                        }
                        p {
                            font-size: 3 * 0.01 * @mWidth;
                            line-height: 3 * 0.01 * @mWidth;
                        }
                    }
                }
                &:nth-of-type(3),
                &:nth-of-type(4) {
                    width: calc(~'50% - 5px');
                    display: inline-block;
                    margin-right: 0;
                    margin-bottom: 10px;
                }
                &:nth-of-type(3) {
                    margin-right: 10px;
                }
            }
            .text {
                &.left {
                    left: 6.66666 * 0.01 * @mWidth;
                }
                &.top {
                    h2 {
                        font-size: 5 * 0.01 * @mWidth;
                        line-height: 5 * 0.01 * @mWidth;
                    }
                    p {
                        font-size: 3 * 0.01 * @mWidth;
                        line-height: 3 * 0.01 * @mWidth;
                    }
                }
            }
        }
        .index-card-8 {
            >a {
                &:nth-of-type(1) {
                    display: block;
                    width: 100%;
                    margin: 0 0 10px 0;
                    .text {
                        width: 77 * 0.01 * @mWidth;
                        height: 18 * 0.01 * @mWidth;
                        bottom: 8 * 0.01 * @mWidth;
                        >div {
                            padding: 3 * 0.01 * @mWidth 0;
                        }
                        h2 {
                            font-size: 5 * 0.01 * @mWidth;
                            line-height: 5 * 0.01 * @mWidth;
                        }
                        p {
                            font-size: 3 * 0.01 * @mWidth;
                            line-height: 3 * 0.01 * @mWidth;
                        }
                    }
                }
                &:nth-of-type(n+2) {
                    width: calc(~'50% - 5px');
                    display: inline-block;
                    margin-right: 0;
                    margin-bottom: 10px;
                }
                &:nth-of-type(2),&:nth-of-type(4) {
                    margin-right: 10px;
                }
            }
            .text {
                &.left {
                    left: 6.66666 * 0.01 * @mWidth;
                }
                &.top {
                    h2 {
                        font-size: 5 * 0.01 * @mWidth;
                        line-height: 5 * 0.01 * @mWidth;
                    }
                    p {
                        font-size: 3 * 0.01 * @mWidth;
                        line-height: 3 * 0.01 * @mWidth;
                    }
                }
            }
        }
    }
}
</style>
