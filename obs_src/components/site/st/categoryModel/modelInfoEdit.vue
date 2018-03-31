<template>
    <div>
        <div class="el-container" v-loading="loading">
            <el-form :model="tableData" label-width="200px" class="form">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="类别">
                            <el-select v-model="tableData.type" placeholder="请选择">
                                <el-option v-for="item in types" :label="item.label" :value="item.value" :key="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类">
                            <el-tree style="height: 300px; overflow: auto;" :data="categoryTree" show-checkbox node-key="id" ref="tree" :props="defaultProps">
                            </el-tree>
                        </el-form-item>
                        <el-form-item label="模特图片">
                            <el-upload drag :action="imgUrl.uploadUrl" list-type="picture" :on-success="getRes" :multiple="false" name="files" :file-list="fileList">
                                <i class="el-icon-upload"></i>
                                <div class="el-dragger__text">将文件拖到此处，或
                                    <em>点击上传</em>
                                </div>
                                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb.
                                    <br/>
                                </div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="addProperty">+</el-button>
                        </el-form-item>
                        <el-form-item v-for="(item, index) in tableData.info" :key="index" label="模特属性">
                            <el-row :gutter="10">
                                <el-col :span="5" style="padding-left: 0;">
                                    <el-select v-model="item.id" placeholder="请选择">
                                        <el-option v-for="item in marks" :label="item.id" :value="item.id" :key="item.id">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col class="line" :span="1" style="text-align: center;">-</el-col>
                                <el-col :span="7">
                                    <el-input v-model="item.name"></el-input>
                                </el-col>
                            </el-row>
                            <div style="height: 5px;">&nbsp;</div>
                            <el-row :gutter="10">
                                <el-col :span="22">
                                    <el-input type="textarea" :rows="3" v-model="item.description"></el-input>
                                </el-col>
                                <el-col :span="2" style="margin: 0">
                                    <el-button type="danger" icon="delete" @click="delProperty(index)"></el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <div class="text-center">
                            <el-button v-if="self.showAction_('admin/category-model-info/edit')" type="primary" @click="save" v-loading="postLoading" :disabled="postLoading">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            self: this,
            postLoading: false,
            categoryTree: [],
            tableData: {
                cat_ids: '',
                auto_cat_name: '',
                image: '',
                info: [],
                id: 0,
                type: ''
            },
            marks: [
                { id: 'A' },
                { id: 'B' },
                { id: 'C' },
                { id: 'D' },
                { id: 'E' },
                { id: 'F' },
            ],
            markMaps: [],
            viewDialog: false,
            loading: true,
            fileList: [],
            imgUrl: {},
            types: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
        };
    },
    created() {
        this.initData();
    },
    methods: {
        initData() {
            Promise.all([this.getCategories(), this.getTypes()]).then((value) => {
                this.getData();
            });
            this.imgUrl = this.$store.getters.getUploadUrl;
        },
        /**
         * 获取分类列表（树）
         * @returns {*|Promise.<TResult>}
         */
        getCategories() {
            return this.$http.get('admin/public/category-all-tree', {}).then(res => {
                if (res.body.code > 0) {
                    this.$message.error(res.body.message);
                } else {
                    this.categoryTree = res.body.data;
                }
            });
        },
        /**
         * 获取模特的所有类型
         * @returns {*|Promise.<TResult>}
         */
        getTypes() {
            return this.$http.get('admin/public/model-types', {}).then(res => {
                if (res.body.code > 0) {
                    this.$message.error(res.body.message);
                } else {
                    this.types = res.body.data.map((value) => {
                        return {
                            label: value,
                            value: value,
                        };
                    });
                }
            });
        },
        getData() {
            let id = this.$route.query.id;
            if (id !== 'undefined') {
                this.$http.get('admin/category-model-info/info', { params: { id: id } }).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        this.tableData.type = data.type;
                        this.$refs.tree.setCheckedKeys(data.cat_ids.split(',').map((value) => {
                            return parseInt(value)
                        }));
                        let site = this.$store.getters.getSite;
                        let reviewImg = this.$store.getters.getUploadUrl.reviewUrl[site] + '/' + data.image;
                        this.fileList.push({
                            name: 'default.jpg',
                            url: reviewImg
                        });
                        data.info = JSON.parse(data.info);
                        this.tableData = data;

                    }
                    this.loading = false;
                });
            }
            this.loading = false;
        },
        save() {
            this.postLoading = true;

            this.tableData.cat_ids = this.$refs.tree.getCheckedKeys().join(',');
            let data = this.tableData;
            let postUrl = this.tableData.id ? 'admin/category-model-info/edit' : 'admin/category-model-info/add';
            this.$http.post(postUrl, { ...data, info: JSON.stringify(data.info) }).then(res => {
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
        addProperty() {
            this.tableData.info.push({ id: 'A', name: '', description: '' });
        },
        delProperty(index) {
            this.tableData.info.splice(index, 1);
        },
        goback() {
            this.$router.push({
                name: 'categoryModelInfoList'
            })
        },
        getRes(res, file) {
            if (res.code === 0) {
                this.tableData.image = res.data;
            } else {
                this.$message.error(res.message);
            }
        },
    },
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


