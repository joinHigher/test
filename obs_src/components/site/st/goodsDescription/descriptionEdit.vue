<template>
    <div>
        <div class="el-container" v-loading="loading" >
            <el-row>
                <el-col :span="20">
                    <el-form :model="tableData" label-width="200px" class="form">
                        <el-form-item label="title">
                            <el-input v-model="tableData.title" placeholder="title"></el-input>
                        </el-form-item>
                        <el-form-item label="内容">
                            <quill-editor ref="editor" v-model="tableData.description" :options="editorOption"></quill-editor>
                            <el-upload name="files" :action="imgUrl.uploadUrl" :before-upload='beforeUpload' :on-success='upScuccess' ref="upload" style="display:none">
                              <el-button id="up-load" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="上传图片中,请稍候"></el-button>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                    <div class="text-center">
                        <el-button v-if="self.showAction_('admin/category-model-info/edit')" type="primary" @click="save" v-loading="postLoading" :disabled="postLoading">保存</el-button>
                        <el-button type="danger" @click="goback">取消</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';

export default {
    data () {
        return {
            self: this,
            postLoading: false,
            addRange: null,
            fullscreenLoading: false,
            tableData: {
                title: '',
                description: ''
            },
            editorOption: {
            },
            imgUrl: this.$store.getters.getUploadUrl,
        };
    },
    created() {
        this.$store.commit('setRouterIndex', 'admin/goods-description/info');
        this.initData();
    },
    mounted() {
        this.$refs.editor.quill.getModule('toolbar').addHandler('image', this.imgHandler);
    },
    methods: {
        initData() {
            this.getData();
        },
        imgHandler (val) {
            this.addRange = this.$refs.editor.quill.getSelection();
            if (val) {
                let btn = document.getElementById('up-load');
                btn.click();
            }
        },
        beforeUpload (file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
              this.$message.error('上传图片只能是 JPG或PNG 格式!');
              return false;
            }
            if (!isLt2M) {
              this.$message.error('上传图片大小不能超过 2MB!');
              return false;
            }

            this.fullscreenLoading = true;

            return isJPG && isLt2M;
        },
        upScuccess (res, file, fileList) {
            let self = this;
            this.fullscreenLoading = false;
            if (res.code === 0) {
                let site = this.$store.getters.getSite;
                let src = self.$store.getters.getUploadUrl.reviewUrl[site] + '/' + res.data;
                self.addRange = self.$refs.editor.quill.getSelection();
                if (self.addRange !== null) {
                    self.$refs.editor.quill.insertEmbed(self.addRange.index, 'image', src,);
                } else {
                    self.$refs.editor.quill.insertEmbed(0, 'image', src,);
                }
            } else {
                this.$message.error(res.message);
            }
            this.$refs['upload'].clearFiles();
        },
        getData() {
            let id = this.$route.query.id;
            if (id !== 'undefined') {
                this.$http.get('admin/goods-description/info', {params: {id: id}}).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        this.tableData.id = id;
                        this.tableData.title = data.title;
                        this.tableData.description = data.description;
                    }
                    this.loading = false;
                });
            }
            this.loading = false;
        },
        save () {
            this.postLoading = true;
            let data = this.tableData;
            let postUrl = this.tableData.id ? 'admin/goods-description/edit' : 'admin/goods-description/add';
            this.$http.post(postUrl, data).then(res => {
                this.postLoading = false;
                if (res.body.code === 0) {
                    this.$message({
                        message: res.body.message,
                        type: 'success'
                    });
                    history.back();
                } else {
                    this.$message.error(res.body.message);
                }
                
            }).catch(err => {
                this.postLoading = false;
            });
        },
        goback () {
            this.$router.push({
                name: 'goodsDescriptionList'
            })
        },
    },
    components: {
        quillEditor
    }
  }
</script>
<style>
  .middle {
    padding-top: 10px;
    clear: both;
  }

  .plusBtn {
    margin-left: 20px;
  }

  .form .el-form-item__content {
    position: relative;
  }

  .form span.tips {
    position: absolute;
    right: -320px;
    top: 0;
    display: block;
    width: 300px;
  }

  .skulist .el-dialog {
    width: 1375px;
  }

  .content {
    clear: both;
  }

  .content ul {
    display: block;
    float: left;
    max-width: 1366px;
  }

  .content li {
    float: left;
    width: 220px;
    height: 120px;
    border: 1px solid #000;
    list-style: none;
  }

  .content li img {
    width: 100px;
    height: 100px;
    float: left;
    margin-left: 20px;
    margin-top: 10px;
  }

  .content .info {
    width: 80px;
    padding: 10px;
    float: left;
  }

  .content .info p {
    margin-bottom: 5px;
  }
</style>
