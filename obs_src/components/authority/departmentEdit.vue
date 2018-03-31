<template>
    <div class="department-edit" v-loading="infoLoading">
        <div class="el-container">
            <el-row>
                <el-col :span="18">
                    <el-form label-width="100px" :model="postForm" ref="postForm">
                        <el-form-item label="部门:">
                            <span>{{name}}</span>
                        </el-form-item>
                        <el-form-item label="数据权限">
                            <div>
                                <p>请勾选部门可以访问的站点</p>
                                <div class="department-site">
                                    <div class="title">
                                        <el-checkbox :disabled="editable" v-model="checkSite" :indeterminate="checkSiteMid"  @change="checkAll">全选</el-checkbox>
                                    </div>
                                    <el-checkbox-group v-model="postForm.sites" class="site" @change="changeSites">
                                        <el-checkbox :disabled="editable" v-for="item in siteOpt" :key="item.site_code" :label="item.site_code">{{item.site_code}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                                <p v-if="postForm.sites.length > 0">请配置已选站点的分类访问权限</p>
                                <el-tabs class="department-tab" :value="current" v-if="postForm.sites.length > 0">
                                    <el-tab-pane v-for="item in postForm.sites" :key="item" :label="item" :name="item">
                                        <div class="department-site cat">
                                            <div class="title">
                                                <el-checkbox :disabled="editable" v-model="siteOpt[item].status" :indeterminate="siteOpt[item].status == 2" :true-label="1" :false-label="0"  @change="checkAllCat($event, 'tree_' + item, siteOpt[item])">全选</el-checkbox>
                                            </div>
                                            <el-tree :data="siteOpt[item].categorys" :props="props" show-checkbox :default-checked-keys="siteOpt[item].categorysSelected" node-key="id" :ref="'tree_' + item"></el-tree>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="text-center el-container">
            <el-button type="primary" @click="save" v-loading="postLoading" :disabled="postLoading" v-if="this.showAction_('base/department/edit') && !editable" >保存</el-button>
            <el-button type="danger" @click="goback">返回</el-button>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        let self = this;
        return {
            infoLoading: true,
            current: '',
            self: this,
            name: '',
            option: {
                id: this.$route.query.id,
                lang: 'en',
            },
            postForm: {
                sites: [],
            },
            siteOpt: {},
            maxSiteArr: [],
            postLoading: false,
            checkSite: false,
            checkSiteMid: false,
            editable: this.$route.query.editable == '1',
            props: {
                label: (data, node) => {
                    return node.data.categoryMultiLang.categoryName;
                },
                children: 'children',
                disabled: (data, node) => {
                    return (!node.data.selected && node.data.parentNode) || self.editable;
                }
            }
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.$http.get('base/department/info', {params: this.option}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.name = data.department.name;

                    let temp = [],
                        tempObj = {};

                    data.siteCategory.forEach(item => {
                        if (item.selected) {
                            this.postForm.sites.push(item.site_code);
                        }
                        temp.push(item.site_code);
                        let length = item.categorysSelected.length;
                        item.status = 0;
                        if (length == 0) {
                            item.status = 0;
                        } else if (length < item.categoryLength) {
                            item.status = 2;
                        } else {
                            item.status = 1;
                        }
                        item.topLevel = [];
                        item.categorys.forEach(cat => {
                            item.topLevel.push(cat.id);
                        });
                        tempObj[item.site_code] = JSON.parse(JSON.stringify(item));
                    });
                    // data
                    this.siteOpt = tempObj;
                    this.maxSiteArr = temp;
                    // init
                    let siteLength = this.postForm.sites.length;
                    if (siteLength > 0) {
                        this.current = this.postForm.sites[0];
                    }
                    if (siteLength == data.siteCategory.length) {
                        this.checkSite = true;
                        this.checkSiteMid = false;
                    } else if (siteLength < data.siteCategory.length && siteLength > 0) {
                        this.checkSiteMid = true;
                        this.checkSite = false;
                    } else {
                        this.checkSiteMid = false;
                        this.checkSite = false;
                    }
                } else {
                    this.$message.error(res.body.message);
                }
                this.infoLoading = false;
            });
        },
        checkAll (val) {
            if (val.target.checked) {
                this.postForm.sites = this.maxSiteArr;
                this.current = this.postForm.sites[0];
                this.checkSiteMid = false;
            } else {
                this.postForm.sites = [];
                this.checkSiteMid = false;
            }
        },
        checkAllCat (val, refName, data) {
            if (val.target.checked) {
                data.status = 1;
                this.$refs[refName][0].setCheckedKeys(data.topLevel);
            } else {
                data.status = 0;
                this.$refs[refName][0].setCheckedKeys([]);
            }
        },
        changeSites (val) {
            let length = val.length;
            this.checkSite = length === this.maxSiteArr.length;
            this.checkSiteMid = length > 0 && length < this.maxSiteArr.length;
            this.current = val[0];
        },
        save () {
            let params = {};
            params.id = this.$route.query.id;
            params.data = [];
            this.postForm.sites.forEach(code => {
                let item = this.siteOpt[code];
                let list = this.$refs['tree_' + item.site_code][0].getCheckedNodes();
                let ids = [];
                list.forEach(node => {
                    if (node.parentNode && !node.selected) {

                    } else {
                        ids.push(node.id);
                    }
                });
                params.data.push({
                    site_code: item.site_code,
                    categorys: ids.join(',')
                });
            });

            if (params.data.length === 0) {
                this.$message.warning('至少选择一个站点');
                return false;
            }

            this.postLoading = true;
            this.$http.post('base/department/edit', params).then(res => {
                this.postLoading = false;
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.goback();
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.postLoading = false;
            });
        },
        goback () {
            this.$router.push({
                name: 'authority_departmentsList',
                params: {
                    back: 1,
                }
            })
        }
    }
}
</script>

<style lang="less">
    .department-edit {
        .department-site {
            border: 1px solid #ccc;
            padding: 30px 30px 30px 0;
            position: relative;
            margin-top: 30px;
            margin-bottom: 30px;

            &.cat {
                padding-left: 30px;
            }

            .title {
                position: absolute;
                line-height: 36px;
                top: -18px;
                left: 50px;
                background: #fff;
                padding: 0 15px;
            }

            .el-checkbox-group {
                &.site {
                    .el-checkbox {
                        margin-left: 60px;
                    }
                }
            }

        }

        .department-tab {
            margin-top: 10px;
        }

        .el-tree {
            max-height: 600px;
            overflow-y: auto;
        }
    }
</style>