<template>
    <div class="video-edit-wrap el-container">
        <el-card class="video-card" v-loading="loading">
            <div slot="header" class="card-header">
                <el-radio-group v-model="lang">
                    <el-radio-button v-for="item in langs" :key="item.language_en" :label="item.language_en">{{item.language_ch}}</el-radio-button>
                </el-radio-group>
            </div>
            <div class="form-box">
                <el-form v-if="type === 'WEB'"
                         class="web-class"
                         :model="webForm"
                         ref="webForm"
                         label-width="140px">
                    <el-form-item label="video标题："
                                  prop="title"
                                  :rules="[{required: true, trigger: 'blur' ,message: '该项不能为空'}]"
                                  >
                        <el-input v-model="webForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="More的文案："
                                  prop="more_str">
                        <el-input v-model="webForm.more_str"></el-input>
                    </el-form-item>
                    <el-form-item label="More的跳转："
                                  prop="more_url"
                                  :rules="[
                                      {type: 'url', message: '必须为url', trigger: 'blur'}
                                  ]"
                    >
                        <el-input v-model="webForm.more_url"></el-input>
                    </el-form-item>

                    <el-form-item v-for="(item, index) in webForm.video_id"
                                  :label="index === 0 ? '视频ID：' : ''"
                                  :key="index"
                                  :prop="'video_id.' + index + '.src'"
                                  :rules="[
                                      {required: true, message: '视频ID不能为空', trigger: 'blur'}
                                  ]"
                    >
                        <div class="video-item" >
                            <el-input v-model="item.src" type="text"></el-input>
                            <template v-if="webForm.video_id.length > 1">
                                <el-button type="danger" @click="onRemoveItem(webForm.video_id, item)">删除</el-button>
                            </template>
                            <template v-if="index === 0">
                                <el-button type="primary" @click="webForm.video_id.push({src: ''})">新增</el-button>
                            </template>
                        </div>
                    </el-form-item>

                    <el-form-item label="banner地址："
                                  :rules="[
                                      {required: true, message: 'banner地址不能为空', trigger: 'blur'},
                                      {type: 'url', message: '必须为url', trigger: 'blur'}
                                  ]"
                                  prop="banner_url">
                        <el-input placeholder="标准规格：1920 px * 300 px" v-model="webForm.banner_url"> </el-input>
                        <el-button @click="onShowBanner">查看图片</el-button>
                    </el-form-item>
                    <el-form-item label="banner内容：">
                        <el-input v-model="webForm.banner_content" type="textarea" placeholder="banner内容"></el-input>
                    </el-form-item>
                    <el-form-item label="横条文案：">
                        <div class="flex-row banner-text-row">
                            <el-input v-model="webForm.banner_des" placeholder="请输入横条文案"></el-input>
                            <span class="banner-text-label">字体颜色</span>
                            <el-color-picker size="mini" v-model="webForm.font_color"></el-color-picker>
                            <span class="banner-text-label">横幅颜色</span>
                            <el-color-picker size="mini" v-model="webForm.background_color"></el-color-picker>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <!--<el-button type="danger">取消</el-button>-->
                        <el-button type="primary" icon="upload" @click="onSubmit">保存</el-button>
                    </el-form-item>
                </el-form>

                <el-form v-if="type === 'APP'"
                         class="app-class"
                                >
                    <el-form class="web-class"
                             :model="appForm"
                             ref="appForm"
                             label-width="140px">
                        <el-form-item label="标题：">
                            <el-input v-model="appForm.title" placeholder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item label="描述：">
                            <el-input v-model="appForm.description" placeholder="请输入描述"></el-input>
                        </el-form-item>
                        <el-form-item label="视频链接："
                                      prop="video_url"
                                      :rules="[{
                                          required: true, trigger: 'blur' ,message: '该项不能为空'
                                      }]"
                        >
                            <el-input v-model="appForm.video_url" placeholder="youtube链接"></el-input>
                        </el-form-item>
                        <el-form-item label="商品SKU："
                                      prop="good_sn"
                                      :rules="[
                                          { required: true, trigger: 'blur' ,message: '该项不能为空'},
                                          { validator: function(rule, value, callback) {
                                                if(value.split('\n').every(function(item) {
                                                    return /^[0-9_a-zA-Z]+$/.test(item)
                                                })){
                                                    callback()
                                                }else{
                                                    callback(new Error('请输入合法的sku'))
                                                }
                                          }, trigger: 'blur' }
                                      ]"
                        >
                            <el-input class="textarea" type="textarea" v-model="appForm.good_sn" placeholder="多个SKU用换行符隔开（海外仓书写格式：SKU_wid）"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="upload"  @click="onSubmit" v-if="ctrl">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-form>
            </div>
        </el-card>

        <!-- 查看图片 -->
        <el-dialog
            title="查看图片"
            :visible.sync="bannerDialogVisible"
            size="tiny">
            <div class="dlg-banner-box">
                <img :src="webForm.banner_url" alt="">
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import utils from '@/common/utils'
    import httpGet, { httpPost, getLangs } from '@/common/baseApi'
    export default {
        data() {
            return {
                Error,
                bannerDialogVisible: false,
                loading: false,
                langs: [],
                addCatId: '',   // 先添加之后就会存在 catId
                lang: 'en',
                webForm: {
                    ...this._getEmptyWebData()
                },
                appForm: {
                    ...this._getEmptyAppData()
                }
            }
        },
        watch: {
            lang(newVal, oldVal) {
                if('' !== this.cat_id){
                    this._getFromItem()
                }
            }
        },
        computed: {
            ctrl() {
                if (this.$route.query['id']) {
                    return this.showAction_('promotion/video/pc-edit');
                } else {
                    return this.showAction_('promotion/video/pc-add');
                }
            },
            type() {
                return this.$route.query.type
            },
            cat_id() {
                // 先通过路由 ， 然后编辑后可能存在 cat_id
                return undefined === this.$route.query.cat_id ? this.addCatId : this.$route.query.cat_id
            }
        },
        created() {
            this._initData()
        },
        methods: {
            async _getLangs() {
                this.loading = true
                const langs = await httpGet('admin/public/languages')
                this.langs = langs
                this.loading = false
            },
            async _getFromItem() {
                this.loading = true
                let resData

                //
                const params = {
                    cat_id: this.cat_id,
                    lang: this.lang
                }

                if (this.type === 'WEB') {
                    resData = await httpGet('promotion/video/pc-find-by-lang', {
                        params
                    })

                    resData.data && (resData.data.video_id = resData.data.video_id.split(',').map(item => {
                        return {
                            src: item
                        }
                    }))
                }

                if (this.type === 'APP') {
                    resData = await httpGet('promotion/video/app-find-by-lang', {
                        params
                    })
                    resData.data && (resData.data.good_sn = resData.data.good_sn.replace(/\,/g, '\n'))
                }

                // 空数据  当前 lang cat_id
                Object.assign(this[`${String(this.type).toLocaleLowerCase()}Form`], this._getEmptyFormData(), resData.data)

                console.log(this[`${String(this.type).toLocaleLowerCase()}Form`])

                this.loading = false

                this.$nextTick(() => {
                    const $form = this._getCurrentEditForm()
                    $form && $form.validate()
                })
            },
            _initData() {
                // 语言
                this._getLangs()

                // 默认空数据
                Object.assign(this[`${String(this.type).toLocaleLowerCase()}Form`], this._getEmptyFormData())

                // 编辑回填表单
                if('' !== this.cat_id){
                    this._getFromItem()
                }
            },
            _getEmptyAppData() {
                return {
                    title: '',
                    cat_id: this.addCatId,
                    id: '',
                    lang: '',
                    description: '',
                    video_url: '',
                    good_sn: ''
                }
            },
            _getEmptyWebData() {
                return {
                    cat_id: this.addCatId,
                    lang: '',
                    id: '',
                    title: '',
                    more_str: '',
                    more_url: '',
                    video_id: [{
                        src: ''
                    }],
                    banner_url: '',
                    banner_content: '',
                    banner_des: '',
                    font_color: '',
                    background_color: ''
                }
            },
            _getEmptyFormData() {
                if (this.type === 'WEB') {
                    return this._getEmptyWebData()
                }

                if (this.type === 'APP') {
                    return this._getEmptyAppData()
                }

                return null
            },
            _getCurrentEditForm() {
                let $editForm

                if (this.type === 'WEB') {
                    $editForm = this.$refs.webForm
                }

                if (this.type === 'APP') {
                    $editForm = this.$refs.appForm
                }

                return $editForm
            },
            onShowBanner() {
                this.$refs.webForm.validateField('banner_url', error => {
                    if (! error) {
                        this.bannerDialogVisible = true
                    }
                })
            },
            onRemoveItem(target, item) {
                utils.array.remove(target, item)
            },
            onSubmit() {
                let $editForm = this._getCurrentEditForm()

                $editForm.validate(async valid => {
                    if (valid) {
                        const type = this.type
                        const formData = this[`${String(type).toLocaleLowerCase()}Form`]
                        let postUrl

                        let postData = {
                            lang: this.lang
                        }

                        if( '' !== this.cat_id){
                            postData.cat_id = this.cat_id
                        }

                        formData.loading = true
                        if (type === 'WEB') {
                            Object.assign(postData, {
                                title: formData.title,
                                more_str: formData.more_str,
                                more_url: formData.more_url,
                                video_id: formData.video_id.map(item => {
                                    return item.src
                                }).join(','),
                                banner_url: formData.banner_url,
                                banner_content: formData.banner_content,
                                banner_des: formData.banne_des || formData.banner_des,
                                font_color: formData.font_color,
                                background_color: formData.background_color
                            })

                            if (formData.id) {
                                // 编辑
                                postUrl = 'promotion/video/pc-edit'
                                postData.id = formData.id
                            } else {
                                postUrl = 'promotion/video/pc-add\n'
                            }
                        }

                        if (type === 'APP') {
                            Object.assign(postData, {
                                title: formData.title,
                                description: formData.description,
                                video_url: formData.video_url,
                                good_sn: formData.good_sn.split('\n').join(',')
                            })

                            if (formData.id) {
                                // 编辑
                                postUrl = 'promotion/video/app-edit'
                                postData.id = formData.id
                            } else {
                                postUrl = 'promotion/video/app-add'
                            }
                        }

                        try {
                            this.loading = true

                            const resData = await httpPost(postUrl, postData)

                            this.addCatId = resData.data.cat_id

                            this.$message.success(resData.message)

                            //  清空或者刷新数据
                            this._getFromItem()
                        }catch (e){
                            debugger

                            // nothing ...
                        }finally{
                            this.loading = false
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="less">
.video-edit-wrap{
    .textarea {
        textarea{
            height: 120px;
        }
    }
}
</style>

<style lang="less" scoped>
    .banner-text-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        .banner-text-label{
            margin-left: 20px;
            margin-right: 10px;
        }
    }
    .video-edit-wrap{
        .form-box{
            .el-input, .el-select, .el-textarea{
                width: 400px;
            }
            .textarea {
                textarea{
                    height: 100px;
                }
            }
        }
    }
</style>
