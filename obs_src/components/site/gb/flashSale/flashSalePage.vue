<!-- 品牌闪购编辑 -->
<template>
    <div class="el-container gb-flash-sale-page">
        <el-form :model="option" label-width="100px" ref="postForm" :rules="postRule">
            <el-form-item label="请选择语言" prop="lang">
                <el-select v-model="option.lang" filterable @change="changeLang" placeholder="请选择">
                    <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select filterable v-model="option.pipeline_code" @change="changeLang" placeholder="请选择">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SEO标题" prop="seo_title">
                <el-input v-model="option.seo_title"></el-input>
            </el-form-item>
            <el-form-item label="SEO描述" prop="seo_desc">
                <el-input v-model="option.seo_desc"></el-input>
            </el-form-item>
            <el-form-item label="页面banner" prop="banner">
                <el-input v-model="option.banner"></el-input>
            </el-form-item>
            <el-form-item label="banner链接" prop="banner_link">
                <el-input v-model="option.banner_link"></el-input>
            </el-form-item>
            <el-form-item label="App banner" prop="app_banner">
                <el-input v-model="option.app_banner"></el-input>
            </el-form-item>
            <el-form-item label="页面背景色" prop="bg_color">
                <el-input v-model.trim="option.bg_color">
                    <template slot="prepend">
                        <span class="bg-pre" :style="{background: option.bg_color}"></span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="模块时间设置" prop="">
                <div v-for="(item, index) in option.arr" class="date">
                    <el-form-item :prop="'arr.' + index + '.list'" :rules="[{validator: checkDateArr, trigger: 'blur'}]">
                        <el-date-picker v-model="option.arr[index].list" type="datetimerange" :editable="false"></el-date-picker>
                        <el-button type="primary" icon="plus" @click="add"></el-button>
                        <el-button type="danger" icon="minus" @click="remove(item.id, index)" v-if="option.arr.length > 1"></el-button>
                    </el-form-item>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="post" v-loading="postLoading" :disabled="postLoading" v-if="self.showAction_('promotion/brand-flashsale/page-edit')">保存</el-button>
                <el-button type="danger" @click="goback">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- 弹窗S -->

    <!-- 弹窗E -->
</template>

<script>

export default {
    data () {
        let checkDateArr = (rule, value, callback) => {
            if ((Boolean(value[0]) && Boolean(value[1]))) {
                callback();
            } else {
                callback('该项不能为空')
            }
        };
        return {
            checkDateArr: checkDateArr,
            self: this,
            postLoading: false,
            langOpt: [],
            option: {
                lang: 'en',
                pipeline_code: 'GB',
                bg_color: '',
                banner: '',
                seo_desc: '',
                seo_title: '',
                banner_link: '',
                app_banner: '',
                arr: [{
                    id: '',
                    list: [],
                }],
            },
            postRule: {
                pipeline_code: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change',
                }],
                lang: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'change',
                }],
                seo_title: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur',
                }],
                seo_desc: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur',
                }],
                banner: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur',
                }],
                banner_link: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur',
                }],
                bg_color: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur',
                }],
            }
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getOpt();
        this.changeLang();
    },
    methods: {
        getOpt() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        changeLang () {
            if (this.option.lang === '' || this.option.pipeline_code === '') {
                return;
            }
            let params = {
                lang: this.option.lang,
                pipeline_code: this.option.pipeline_code,
            };
            let self = this;
            this.$http.get('promotion/brand-flashsale/page-info', {params: params}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;

                    // 判断是否为空
                    if (data.pageInfo instanceof Object) {
                        this.option = Object.assign(this.option, data.pageInfo);
                    } else {
                        let lang = this.option.lang;
                        let pipeline_code = this.option.pipeline_code;
                        this.option = {
                            lang: '',
                            pipeline_code: '',
                            bg_color: '',
                            banner: '',
                            seo_desc: '',
                            seo_title: '',
                            banner_link: '',
                            app_banner: '',
                            arr: [{
                                id: '',
                                list: [],
                            }],
                        };
                        this.option.lang = lang;
                        this.option.pipeline_code = pipeline_code;
                    }

                    if (data.timeLine instanceof Array && data.timeLine.length > 0) {
                        let temp = [];
                        data.timeLine.forEach(item => {
                            let date1 = self.timeZone_(item.begin_time, self.$store.getters.getTimeZone),
                                date2 = self.timeZone_(item.end_time, self.$store.getters.getTimeZone);
                            temp.push({
                                list: [new Date(date1), new Date(date2)],
                                id: item.id,
                            });
                        });
                        this.option.arr = temp;
                    } else {
                        this.option.arr = [{
                            id: '',
                            list: [],
                        }];
                    }

                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        post() {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let self = this;
                    let params = {};
                    let temp = [];

                    for(let i in this.option) {
                        if (i != 'arr') {
                            params[i] = this.option[i];
                        }
                    }
                    params.json = {
                        update: [],
                        insert: [],
                    }
                    this.option.arr.forEach(date => {
                        temp = self.timeZone_(date.list, self.$store.getters.getTimeZone);
                        if (date.id) {
                            params.json.update.push({
                                begin_time: temp[0],
                                end_time: temp[1],
                                id: date.id,
                            });
                        } else {
                            params.json.insert.push({
                                begin_time: temp[0],
                                end_time: temp[1],
                            })
                        }
                    });

                    params.json = JSON.stringify(params.json);

                    this.postLoading = true;
                    this.$http.post('promotion/brand-flashsale/page-edit', params).then(res => {
                        this.postLoading = false;
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.goback();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        this.postLoading = false;
                    })
                }
            })
        },
        add () {
            this.option.arr.push({
                id: '',
                list: [],
            });
        },
        remove(id, index) {
            this.$confirm('确认删除?', '提示').then(() => {
                if (id) {
                    this.$http.post('promotion/brand-flashsale/timeline-del', {id: id}).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            if (this.option.arr.length > 1) {
                                this.option.arr.splice(index, 1);
                            }
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                } else {
                    if (this.option.arr.length > 1) {
                        this.option.arr.splice(index, 1);
                    }
                }

            }).catch(() => {
                this.$message.info('已取消')
            });
        },
        goback () {
            this.$router.push({
                name: 'site_flashSaleList',
            })
        }
    }

}
</script>

<style lang="less" scoped>
    .gb-flash-sale-page {
        .el-form-item__content {
            width: 70%;
        }

        .date {
            margin-bottom: 10px;
        }
    }

    .bg-pre {
        height: 28px;
        width: 28px;
        margin-top: 1px;
        border: 1px solid #ccc;
        display: inline-block;
    }
</style>


