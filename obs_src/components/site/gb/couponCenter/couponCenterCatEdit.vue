<!-- gb 领劵中心分类编辑 -->
<template>
    <div class="gb-coupon-center-cat-edit" >
        <div class="el-container" v-loading="fullLoading">
            <el-form :model="option" label-width="150px" ref="postForm" :rules="postRule">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="option.title"></el-input>
                </el-form-item>
                <el-form-item label="副标题" prop="sub_title">
                    <el-input v-model="option.sub_title"></el-input>
                </el-form-item>
                <el-form-item label="导航标题" prop="nav_title">
                    <el-input v-model="option.nav_title"></el-input>
                </el-form-item>
                <el-form-item label="语言" prop="lang">
                   <el-select clearable filterable v-model="option.lang">
                       <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code">
                    <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="劵颜色(起始)" prop="bg_color_s">
                    <el-radio-group v-model="option.bg_color_s">
                        <el-radio v-for="(item, index) in colorOpt" :key="index" :label="index">
                            <span :style="{color: index}">{{item}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="劵颜色(结束)" prop="bg_color_e">
                    <el-radio-group v-model="option.bg_color_e">
                        <el-radio v-for="(item, index) in colorOpt" :key="index" :label="index">
                            <span :style="{color: index}">{{item}}</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="显示" prop="is_show">
                    <el-radio-group v-model="option.is_show">
                        <el-radio :label="1">显示</el-radio>
                        <el-radio :label="2">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序" prop="sort_order">
                    <el-input v-model="option.sort_order"></el-input>
                </el-form-item>
                <div class="text-center">
                    <el-button type="primary" @click="post" v-loading="postLoding" :disabled="postLoding" v-if="ctrl">保存</el-button>
                    <el-button type="danger" @click="goback">返回</el-button>
                </div>
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
            postLoding: false,
            fullLoading: false,
            option: {
                title: '',
                sub_title: '',
                nav_title: '',
                is_show: '',
                bg_color_s: '',
                bg_color_e: '',
                sort_order: '',
                lang: '',
                pipeline_code: '',
            },
            langOpt: {},
            colorOpt: {
                '#f4551e': '橙色(默认)',
                '#22d9ca': '蓝色',
                '#f74b4b': '红色',
                '#f7c107': '黄色'
            },
            postRule: {
                title: [{
                    required: true,
                    message: '该项不能为空'
                }],
                is_show: [{
                    required: true,
                    message: '该项不能为空'
                }],
                bg_color_s: [{
                    required: true,
                    message: '该项不能为空'
                }],
                bg_color_e: [{
                    required: true,
                    message: '该项不能为空'
                }],
                lang: [{
                    required: true,
                    message: '该项不能为空'
                }],
                pipeline_code: [{
                    required: true,
                    message: '该项不能为空'
                }]
            },
            id: this.$route.query.id,
        };
    },
    computed: {
        ctrl() {
            if (this.id) {
                return this.showAction_('admin/coupon-center-category/edit');
            } else {
                return this.showAction_('admin/coupon-center-category/add');
            }
        },
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getOpt();
    },
    methods: {
        getOpt() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                    if(this.id) {
                        this.getData();
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            })
        },
        getData() {
            this.$http.get('admin/coupon-center-category/info', {params: {id: this.id}}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    for (let i in this.option) {
                        this.option[i] = data[i];
                    }
                    let arr = data.bg_color.split(',');
                    this.option.bg_color_s = arr[0];
                    this.option.bg_color_e = arr[1];
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });
        },
        post () {
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    let params = JSON.parse(JSON.stringify(this.option));
                    let src = 'admin/coupon-center-category/add';
                    if (this.id) {
                        params.id = this.id;
                        src = 'admin/coupon-center-category/edit';
                    }

                    params.bg_color = params.bg_color_s + ',' + params.bg_color_e;
                    delete params.bg_color_e;
                    delete params.bg_color_s;
                    this.$http.post(src, params).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.goback();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }
            })
        },
        goback() {
            this.$router.push({
                name: 'site_couponCenterList',
            })
        },
    }

}
</script>

<style lang="less">
    .gb-coupon-center-cat-edit {
        .el-form-item__content {
            width: 60%;
        }
    }
</style>


