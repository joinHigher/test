<template>
	<div>
        <el-breadcrumb separator="/" class="el-container top">
            <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/topic/topicList'}">专题管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/topic/topicList'}">专题列表</el-breadcrumb-item>
            <el-breadcrumb-item>专题编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="el-container">
            <p class="cat-title"><strong>基础信息</strong></p>
            <el-row class="el-sub-container">
                <el-col :span="12">
                    <el-form label-width="100px" :model="dataForm">
                        <el-form-item label="专题名称">
                            <el-input v-model="dataForm.name" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="选择平台">
                            <el-checkbox-group v-model="dataForm.temp_platforms">
                                <el-checkbox v-for="(item, index) in platforms" :key="index" :label="index" :disabled="editInfo">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="URL组件">
                            <el-input v-model="dataForm.url_component" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="专题备注">
                            <el-input v-model="dataForm.memo" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="专题模板">
                            <el-select v-model="dataForm.template_id" :disabled="editInfo">
                                <el-option v-for="(item, index) in templateList" :label="item" :key="index" :value="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="头部图片">
                            <el-input placeholder="请输入专题头部图片地址" v-model="dataForm.header_image_url" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="专题样式">
                            <el-input placeholder="请输入专题CSS样式地址" v-model="dataForm.css_url" :disabled="editInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="头部代码">
                            <el-input type="textarea" :rows="4" v-model="dataForm.header_code" :disabled="editInfo"></el-input>
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
                    <el-form label-width="100px" :model="item">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="版块名称">
                                    <el-input v-model="item.name" :disabled="item.editPosition"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="版块排序">
                                    <el-input v-model="item.order" :disabled="item.editPosition"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="导航名称">
                            <el-input v-model="item.nav_name" :disabled="item.editPosition"></el-input>
                        </el-form-item>
                        <el-form-item label="显示设置">
                            <el-checkbox-group v-model="item.shows">
                                <el-checkbox v-for="(label, index) in goodsList" :label="index" :key="index" :disabled="item.editPosition">{{label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="版块商品">
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
                memo: '',
                template_id: '',
                temp_platforms: [],
                url_component: '',
                header_image_url: '',
                header_code: '',
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
                }]
            },
            editInfo: true,
            editPosition: true,
            option: {},
            platforms: [],
            goodsList: [],
            templateList: [],
            position_option: {}
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
                    resData.temp_platforms = (resData.platforms == '') ? [] :  resData.platforms.split(',');
                    resData.positions.forEach(e => {
                        e.shows = (e.shows == '') ? [] : e.shows.split(',');
                        e.editPosition = true;
                    });
                    resData.platforms = '';

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
            this.dataForm.temp_platforms = [];
        },
        editSpecial () {
            this.editInfo = false;
        },
        saveSpecial () {
            let params = {};
            for (var i in this.dataForm) {
                if (i !== 'temp_platforms' && i !== 'positions' && i !== 'platforms') {
                   params[i] = this.dataForm[i];
                }
            }
            params.platforms = this.dataForm.temp_platforms.join(',');

            let src;
            if (typeof params.id !== 'undefined') {
                src = 'admin/special/edit';
            } else {
                src = 'admin/special/add';
                params.id = 0;
            }

            this.$http.post(src, params).then(res => {
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
                    this.$message({
                        type: 'error',
                        message: res.body.message,
                        customClass: 'tips-limit'
                    });
                }
            })
        }
	}
}
</script>

<style>
    .box {border: 1px solid #e0e6ed;padding: 15px;}
    .tips-limit {height: auto;overflow: auto;}
    .tips-limit .el-message__group {height: auto;}
    .tips-limit p {word-break: break-all; max-width: 600px; white-space: normal;}
</style>
