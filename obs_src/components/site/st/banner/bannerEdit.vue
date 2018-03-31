<template>
    <div class="st-banner-edit">
        <div class="el-container">
            <el-row>
                <el-col :span="12">
                    <el-form :model="option" label-width="100px" enctype="multipart/form-date" method="post" :rules="formRule" ref="form">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="option.title"></el-input>
                        </el-form-item>
                        <el-form-item label="请选择平台" prop="platform">
                            <el-select v-model="option.platform" @change="changePlatform">
                                <el-option v-for="(item, index) in platformOpt" :value="index" :label="item" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="请选择语言" prop="language">
                            <el-select :disabled="!option.platform" v-model="option.language" @change="changeLang">
                                <el-option v-for="(item, index) in langOpt" :key="index" :label="item.language_ch" :value="item.language_en"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="显示位置" prop="position">
                            <el-select v-model="option.position">
                                <el-option v-for="(label, index) in positionOpt" :key="index" :value="index" :label="label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="跳转URL" prop="url">
                            <el-input v-model="option.url"></el-input>
                        </el-form-item>
                        <el-form-item label="分类名称">
                            <el-select v-model="option.category_id" filterable>
                                <el-option v-for="item in catList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input type="textarea" :rows="4" v-model="option.comment"></el-input>
                        </el-form-item>
                        <el-form-item label="有效时间" prop="date" required>
                            <el-date-picker v-model="option.date" type="datetimerange" placeholder="选择日期范围" :editable="false"></el-date-picker>
                        </el-form-item>
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="排序" prop="sort">
                                    <el-input v-model="option.sort" placeholder="请输入0到999的数字"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <span class="color-silver tips">数字越小越靠前</span>
                            </el-col>
                        </el-row>

                        <el-form-item label="启用状态" prop="is_enable">
                            <el-radio-group v-model="option.is_enable">
                                <el-radio class="radio" label="1">启用</el-radio>
                                <el-radio class="radio" label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="上传图片">
                            <el-upload drag :action="imgUrl.uploadUrl" :multiple="false" name="files" :file-list="fileList" list-type="picture" :on-success="getRes" :on-error="getError" :before-upload="checkUp">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb. <br />顶部横幅标准规格：1920 px * 80 px;首页banner标准规格1366 px * 600 px</div>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                    <div class="el-sub-container text-center">
                        <el-button v-if="self.showAction_('admin/banner/edit')" type="primary" @click="postEdit" v-loading="postLoading" :disabled="!editable || postLoading">确认</el-button>
                        <el-button type="danger" @click="goback">取消</el-button>
                    </div>
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
        var platform =  this.$route.query.platform;

        let checkDate = (rule, value, callback) => {
            if (!value || !value[0] || !value[1]) {
                callback(new Error('该项不能为空'));
            }
            callback();
        }

        let checkSort = (rule, value, callback) => {
            let exp = /^[1-9]\d{0,2}$/;
            if (value == '0' || exp.test(value)) {
                callback();
            } else {
                callback (new Error('请输入0到999的数字'));
            }
        }

        return {
            self: this,
            catList: {},
            editable: true,
            postLoading: false,
            tableData: [],
            url: '/src/references/site/faqList.json',
            langOpt: [],
            option: {
                title: '',
                date: '',
                platform: platform,
                language: '',
                imgUrl: '',
                position: '',
                is_enable: '',
                category_id: '',
            },
            platformOpt: [],
            imgUrl: {},
            fileList: [],
            positionOpt: [],
            formRule: {
                title: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }],
                platform: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                language: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                position: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                is_enable: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change'
                }],
                url: [{
                    type: 'url',
                    message: '请输入正确的以http或https开头的url'
                }],
                date: [{
                    validator: checkDate
                }],
                sort: [{
                    required: true,
                    message: '该项不能为空'
                }, {
                    validator: checkSort
                }]
            }
        };
    },
    created () {
        this.initData();
        this.imgUrl = this.$store.getters.getUploadUrl;
    },
    methods: {
        initData () {
            this.getCat();
            this.getplat();
            this.getLang();
            this.getData();
            this.getPosition();
        },
        getCat () {
            this.$http.get('admin/public/category-all').then(res => {
                if (res.body.code === 0) {
                    var data = res.body.data;
                    data[0] = {
                        id: 0,
                        name: '暂无分类'
                    }
                    this.catList = data;
                }
            });
        },
        getData () {
            if (typeof this.$route.query.id != 'undefined') {
                this.$http.get('admin/banner/info', {params: {id: this.$route.query.id}}).then((res) => {
                    var data = res.body.data;

                    data.date = [];
                    if (data.start_time && data.end_time) {
                        data.date.push(new Date(data.start_time * 1000));
                        data.date.push(new Date(data.end_time * 1000));
                    }

                    data.is_enable += '';
                    this.option = data;

                    let site = this.$store.getters.getSite;
                    var reviewImg = this.$store.getters.getUploadUrl.reviewUrl[site] + '/' + data.image;
                    this.fileList.push({
                        name: 'default.jpg',
                        url: reviewImg
                    });
                })
            }
        },
        getplat () {
            var self = this;

            self.$http.get('admin/public/platforms').then(res => {
                if (res.body.code === 0) {
                    self.platformOpt = res.body.data;
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
        getPosition () {
            var self = this;

            self.$http.get('admin/public/banner-positions').then(res => {
                if (res.body.code === 0) {
                    self.positionOpt = res.body.data;
                }
            });
        },
        addtitle () {
            this.editForm.subtitles.push({
                key: this.editForm.subtitles.length,
                value: ''
            });
        },
        postEdit () {
            this.postLoading = true;
            this.$refs.form.validate(valid => {
                if (valid) {
                    let src;

                    let timeArr = this.timeZone_(this.option.date, this.$store.getters.getTimeZone);
                    this.option.start_time = timeArr[0];
                    this.option.end_time = timeArr[1];

                    this.option.id = this.$route.query.id || '';

                    if (this.$route.query.id) {
                        src = 'admin/banner/edit';
                    } else {
                        src = 'admin/banner/add';
                    }

                    let params = {};
                    for (let i in this.option) {
                        if (i !== 'date') {
                            params[i] = this.option[i];
                        }
                    }

                    this.$http.post(src, params).then(res => {
                        this.postLoading = false;

                        if (res.body.code == 0) {
                            history.back();
                            this.$message({
                                type: 'success',
                                message: res.body.message
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoading = false;
                    });
                } else {
                    this.postLoading = false;
                }
            });
        },
        goback () {
            this.$router.push({
                name: 'showcase_bannerList',
            })
        },
        removetitle (item) {
            var index = this.editForm.subtitles.indexOf(item);
            if (index !== -1) {
                this.editForm.subtitles.splice(index, 1)
            }
        },
        changePlatform (val) {
            var self = this;

            self.option.platform = val;
            self.option.language = '';
            self.getLang();
        },
        changeLang (val) {
            var self = this;

            self.option.language = val;
        },
        checkUp (file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }

            this.editable = false;
            return isJPG && isLt2M;
        },
        getRes (res, file) {
            this.editable = true;
            if (res.code === 0) {
                this.option.image = res.data;
                this.fileList = [file]
            } else {
                this.$message.error(res.message);
            }
        },
        getError (err, file) {
            this.$message.error(err);
            this.editable = true;
        }
    }
}
</script>

<style lang="less">
    .st-banner-edit {
        .add-box {padding: 50px 0;border:1px solid;}
        .add-box i {font-size:100px; cursor: pointer;}
        .good-list {padding: 50px;border:1px solid;height: 200px;}
        .newDate {z-index: 1100;}
        .upload-btn {margin-right: 10px;}
        .el-draggeer__cover__btns span.btn:nth-child(2) {
            display: none;
        }

        .tips {
            line-height: 36px;
        }
    }
</style>


