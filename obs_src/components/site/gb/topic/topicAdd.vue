<template>
    <div>
        <div class="el-container topic-edit">
            <p class="cat-title"><strong>基础信息</strong></p>
            <el-row class="el-sub-container">
                <el-col :span="12">
                    <el-form label-width="150px" :model="dataForm" :rules="formRule" ref="form">
                        <el-form-item label="专题名称" prop="name">
                            <el-input v-model="dataForm.name" :disabled="editInfo" class="w-400"></el-input>
                        </el-form-item>
                        <el-form-item label="活动截止时间">
                            <el-date-picker v-model="dataForm.date" type="date" placeholder="选择日期" :disabled="editInfo" class="w-400"></el-date-picker> &nbsp;
                            <el-checkbox v-model="dataForm.close">关闭活动</el-checkbox>
                        </el-form-item>
                        <el-form-item label="跳转链接">
                            <el-input v-model="dataForm.jump_link" :disabled="editInfo" class="w-400"></el-input> &nbsp;
                            <span>关闭活动后，指定跳转链接</span>
                        </el-form-item>
                        <el-form-item label="选择平台" prop="platforms">
                            <el-checkbox-group v-model="dataForm.platforms">
                                <el-checkbox v-for="(item, index) in platforms" :key="index" :label="index" :disabled="editInfo">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="专题模板" prop="template_id">
                            <el-select v-model="dataForm.template_id" :disabled="editInfo" class="w-400">
                                <el-option v-for="(item, index) in templateList" :label="item" :key="index" :value="index"></el-option>
                                <el-option label="自定义模板" value="custom"></el-option>
                            </el-select> &nbsp;
                            <span v-if="dataForm.template_id == 'custom'">
                                <span>模板ID</span>
                                <el-input v-model="dataForm.custom_id" class="w-100"></el-input>
                            </span>
                        </el-form-item>
                        <el-form-item label="URL组件" prop="url_component">
                            <el-input v-model="dataForm.url_component" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="专题备注">
                            <el-input v-model="dataForm.memo" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="头部图片">
                            <el-input placeholder="请输入专题头部图片地址" v-model="dataForm.header_image_url" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item v-if="dataForm.template_id != 'custom'" label="移动端头部图片">
                            <el-input placeholder="请输入M版专题头部图片地址" v-model="dataForm.m_header_image_url" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="SEO标题">
                            <el-input v-model="dataForm.seo_title" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="SEO内容">
                            <el-input v-model="dataForm.seo_description" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="SEO关键字">
                            <el-input v-model="dataForm.seo_keywords" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <div v-if="dataForm.template_id != 'custom'">
                            <el-form-item label="专题样式">
                                <el-input placeholder="请输入专题CSS样式地址" v-model="dataForm.css_url" :disabled="editInfo"></el-input>
                            </el-form-item>
                            <el-form-item label="页面头部代码">
                                <el-input type="textarea" :rows="4" v-model="dataForm.header_code" :disabled="editInfo"></el-input>
                            </el-form-item>
                            <el-form-item label="页面底部代码">
                                <el-input type="textarea" :rows="4" v-model="dataForm.footer_code" :disabled="editInfo"></el-input>
                            </el-form-item>
                        </div>
                        <div v-else>
                            <el-form-item label="分享文案">
                                <el-input v-model="dataForm.share_doc" :disabled="editInfo"></el-input>
                            </el-form-item>
                            <el-form-item label="分享图片">
                                <el-input v-model="dataForm.share_image" :disabled="editInfo"></el-input>
                            </el-form-item>
                            <el-form-item label="活动规则">
                                <el-input type="textarea" :rows="4" v-model="dataForm.activity" :disabled="editInfo" placeholder="请输入活动规则，用于活动页面展示"></el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                    <div class="el-sub-container text-center">
                        <el-button v-show="editInfo && !dataForm.id" type="primary" @click="addSpecial">新增</el-button>
                        <el-button v-show="editInfo && dataForm.id" type="primary" @click="editSpecial">编辑</el-button>
                        <el-button v-show="!editInfo" type="primary" @click="saveSpecial">保存</el-button>
                        <el-button v-show="!editInfo" type="danger" @click="editInfo = true">取消</el-button>
                    </div>
                </el-col>
            </el-row>
            <p class="cat-title"><strong>专题版块</strong></p>
            <el-row v-for="(item, index) in dataForm.positions" class="el-sub-container" v-if="dataForm.id" :key="index">
                <el-col class="box" :span="18">
                    <el-form label-width="100px" :model="item" :rules="positionRule" :ref="'position_' + index">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="版块名称" prop="name">
                                    <el-input v-model="item.name" :disabled="item.editPosition"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="版块排序" prop="order">
                                    <el-input v-model="item.order" :disabled="item.editPosition"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="导航名称">
                            <el-input v-model="item.nav_name" :disabled="item.editPosition"></el-input>
                        </el-form-item>
                        <el-form-item label="显示设置">
                            <el-checkbox-group v-model="item.shows">
                                <el-checkbox v-for="(label, index) in goodsList" :key="index" :label="index" :disabled="item.editPosition">{{label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="版块商品" prop="goods">
                            <el-input placeholder="多个SKU用英文&quot;,&quot;隔开，" v-model="item.goods" type="textarea" :rows="4" :disabled="item.editPosition"></el-input>
                        </el-form-item>
                        <div class="text-right">
                            <el-button type="primary" @click="item.editPosition = false" v-show="item.editPosition">编辑</el-button>
                            <el-button type="primary" @click="editItem(item, index)" v-show="!item.editPosition">保存</el-button>
                            <el-button type="danger" @click="item.editPosition = true" v-show="!item.editPosition">取消</el-button>
                            <el-button type="danger"  @click="removeItem(item.id, index)">删除版块</el-button>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
            <div class="text-center el-sub-container">
                <el-button type="primary" @click="addItem">新增版块</el-button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            dataForm: {
                id: '',
                name: '',
                date: '',
                jump_link: '',
                memo: '',
                template_id: '',
                platforms: [],
                url_component: '',
                header_image_url: '',
                m_header_image_url: '',
                header_code: '',
                footer_code: '',
                css_url: '',
                seo_title: '',
                seo_description: '',
                seo_keywords: '',
                positions: [{
                    id: '',
                    name: '',
                    nav_name: '',
                    order: '',
                    goods: '',
                    shows: '',
                    editPosition: true
                }],
                share_doc: '',
                share_image: '',
                activity: '',
            },
            editInfo: true,
            editPosition: true,
            option: {},
            platforms: [],
            goodsList: [],
            templateList: [],
            position_option: {},
            formRule: {
                name: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                url_component: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                template_id: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
            },
            positionRule: {
                name: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                goods: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }]
            }
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getgoodsList();
            this.gettemplate();
            this.getplat();
            this.getData();
        },
        getData () {
            if (typeof this.$route.query.id != 'undefined') {
                this.$http.get('admin/special/info', {params: {id: this.$route.query.id}}).then(res => {
                    var resData = res.body.data;
                    resData.platforms = (resData.platforms == '') ? [] :  resData.platforms.split(',');
                    resData.positions.forEach(e => {
                        e.shows = (e.shows == '') ? [] : e.shows.split(',');
                        e.editPosition = true;
                    });

                    this.dataForm = resData;
                });
            }
        },
        getplat () {
            this.$http.get('admin/public/platforms').then(res => {
                this.platforms = res.body.data;
            });
        },
        getgoodsList () {
            this.$http.get('admin/special-position/public-get-shows').then(res => {
                this.goodsList = res.body.data;
            });
        },
        gettemplate () {
            this.$http.get('admin/special/public-get-templates').then(res => {
                this.templateList = res.body.data;
            });
        },
        addSpecial () {
            this.editInfo = false;
            this.dataForm.platforms = [];
        },
        editSpecial () {
            this.editInfo = false;
        },
        saveSpecial () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let params = {};
                    for (let i in this.dataForm) {
                        if (i !== 'platforms' && i !== 'positions') {
                            params[i] = this.dataForm[i];
                        }
                    }
                    params.platforms = this.dataForm.platforms.join(',');
                    params.id = params.id ? params.id : 0;

                    this.$http.post('admin/special/add', params).then(res => {
                        if (res.body.code == 0) {
                            this.$route.query.id = res.body.data.id
                            this.getData();

                            this.editInfo = true;
                            this.$message({
                                type: 'success',
                                message: res.body.message
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }
            });
        },
        removeItem (id, index) {
            var self = this;

            self.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                if (id == '') {
                    self.dataForm.positions.splice(index, 1);
                    self.$message({
                      message: '删除未保存记录',
                      type: 'warning'
                    });
                    return false;
                }

                self.$http.post('admin/special-position/delete', {id: id}).then(res => {
                    if (res.body.code == 0) {
                        self.dataForm.positions.splice(index, 1);
                        self.$message({
                          message: res.body.message,
                          type: 'success'
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
        addItem () {
            this.dataForm.positions.push({
                id: '',
                special_id: '',
                name: '',
                order: '',
                nav_name: '',
                shows: [],
                goods: '',
                editPosition: true
            })
        },
        editItem (item, index) {
            this.$refs['position_' + index][0].validate(valid => {
                if (valid) {
                     for (var i in item) {
                        this.position_option[i] = item[i];
                    }

                    this.position_option.special_id = this.$route.query.id;
                    this.position_option.shows = (this.position_option.shows == []) ? '' : this.position_option.shows.join(',');

                    let src;
                    if (this.position_option.id && this.position_option.id !== '0') {
                        src = 'admin/special-position/edit';
                    } else {
                        src = 'admin/special-position/add';
                    }

                    this.$http.post(src, this.position_option).then(res => {
                        item.editPosition = true;

                        if (res.body.code == 0) {
                            this.$message({
                              message: res.body.message,
                              type: 'success'
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }
            });
        }
    }
}
</script>

<style lang="less">
.topic-edit {
    .el-date-editor.el-input,
    .el-input, .el-select, .el-autocomplete { width: 100%; }
    .w-100 { width: 100px !important; }
    .w-200 { width: 200px !important; }
    .w-300 { width: 300px !important; }
    .w-400 { width: 400px !important; }
    .w-500 { width: 500px !important; }
    .w-100p { width: 100% !important; }
    .box {border: 1px solid #e0e6ed;padding: 15px;}
}
</style>
