<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-row>
                <el-col :span="12">
                    <el-form :model="option"  label-width="140px" ref="postForm">
                        <el-form-item label="标题" prop="">
                            <el-input v-model="option.title"></el-input>
                        </el-form-item>
                        <el-form-item label="图片地址" prop="">
                            <el-input v-model="option.image_link"></el-input>
                        </el-form-item>
                        <el-form-item label="生效时间" prop="">
                            <el-date-picker v-model="option.start_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="失效时间" prop="">
                            <el-date-picker v-model="option.end_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="语言" prop="">
                            <el-select v-model="option.lang">
                                <el-option v-for="(item, index) in langOpt" :key="index" :value="item.language_en" :label="item.language_ch"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关联分类馆" prop="">
                            <el-select v-model="option.category_library_id" placeholder="请选择">
                                <el-option v-for="item in libraryOpt" :key="item.id" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="显示位置" prop="">
                            <el-select v-model="option.type" placeholder="请选择">
                                <el-option v-for="(item, index) in typeOpt" :key="index" :value="index" :label="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="option.type == 'big_banner'" label="是否开启蒙版" prop="">
                            <el-radio-group v-model="option.is_show_mask">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="option.type == 'big_banner'" label="蒙版文字编辑（上）" prop="">
                            <el-input :disabled="option.is_show_mask == '0'" v-model="option.mask_name"></el-input>
                        </el-form-item>
                        <el-form-item v-if="option.type == 'big_banner'" label="蒙版文字编辑（下）" prop="">
                            <el-input :disabled="option.is_show_mask == '0'" v-model="option.mask_description"></el-input>
                        </el-form-item>
                        <el-form-item v-if="option.type == 'e_commerce'" label="广告文字编辑（上）" prop="">
                            <el-input v-model="option.mask_name"></el-input>
                        </el-form-item>
                        <el-form-item v-if="option.type == 'e_commerce'" label="广告文字编辑（下）" prop="">
                            <el-input v-model="option.mask_description"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="">
                            <el-input v-model="option.order"></el-input>
                        </el-form-item>
                        <el-form-item label="是否显示" prop="">
                            <el-radio :label="1" v-model="option.is_show">是</el-radio>
                            <el-radio :label="0" v-model="option.is_show">否</el-radio>
                        </el-form-item>
                        <el-form-item label="备注" prop="">
                            <el-input v-model="option.remark"></el-input>
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
        return {
            option: {
                type: '',
                category_library_id: '',
                title: '',
                image_link: '',
                start_time: '',
                end_time: '',
                lang: '',
                order: '',
                is_show: '',
                remark: '',
                is_show_mask: '',
                mask_description: '',
                mask_name: ''
            },
            langOpt: [],
            libraryOpt: [],
            typeOpt: {},
        };

    },
    created () {
        this.getOpt();
        this.getData();
    },
    methods: {
        getOpt () {
            this.$http.get('admin/category-library-banner/get-category-libraries', {params: {lang: this.option.lang}}).then(res => {
                if (res.body.code === 0) {
                    this.libraryOpt = res.body.data;
                }
            });

            this.$http.get('admin/public/category-library-banner-options', {params: {lang: this.option.lang}}).then(res => {
                if (res.body.code === 0) {
                    this.typeOpt = res.body.data;
                }
            });

            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                }
            });
        },
        getData () {
            if (this.$route.query.id) {
                this.$http.get('admin/category-library-banner/info', {params: {id: this.$route.query.id}}).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        data.start_time = new Date(this.timeZone_(data.start_time, this.$store.getters.getTimeZone));
                        data.end_time = new Date(this.timeZone_(data.end_time, this.$store.getters.getTimeZone));

                        this.option = data;
                    }
                });
            }
        },
        post () {
            let params = {};
            for (let i in this.option) {
                params[i] = this.option[i];
            }

            params.start_time = this.timeZone_(params.start_time, this.$store.getters.getTimeZone);
            params.end_time = this.timeZone_(params.end_time, this.$store.getters.getTimeZone);

            if (params.id) {
                this.$http.post('admin/category-library-banner/edit', params).then(res => {
                    if (res.body.code === 0) {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }
                });
            } else {
                this.$http.post('admin/category-library-banner/add', params).then(res => {
                    if (res.body.code === 0) {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    }
                });
            }
        },
        goback () {
            this.$router.push({
                name: 'site_libraryBanner'
            })
        }
    }
}
</script>
<style>

</style>
