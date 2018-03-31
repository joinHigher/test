<template>
    <div>
        <div class="el-container">
            <el-tabs class="full" active-name="1" @tab-click="changePlatform">
                <el-tab-pane v-for="(item, index) in platformOpt" :label="item" :name="index" :key="index"></el-tab-pane>
            </el-tabs>
            <el-form inline :model="option" label-width="100px" ref="option">
                <el-form-item label="请选择语言" prop="language">
                    <el-select v-model="option.language" @change="changeLang" clearable>
                        <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示位置" prop="position">
                    <el-select v-model="option.position" clearable>
                        <el-option v-for="(label, index) in positionOpt" :value="index" :label="label" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示状态" prop="is_enable">
                    <el-select v-model="option.is_enable" clearable>
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="禁用" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="render">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                    <router-link v-if="self.showAction_('admin/banner/add')" :to="{name: 'showcase_bannerEdit'}" class="el-button el-button--primary">添加广告位</router-link>
                </el-form-item>
            </el-form>
            <el-table :border="true" :data="tableData" v-loading="tableLoading">
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column label="平台">
                    <template scope="scope">
                        {{platformOpt[scope.row.platform]}}
                    </template>
                </el-table-column>
                <el-table-column prop="position" label="显示位置"></el-table-column>
                <el-table-column prop="category_name" label="分类名称"></el-table-column>
                <el-table-column label="图片">
                    <template scope="scope">
                        <img :src="scope.row.image" width="120" height="90">
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="跳转URL"></el-table-column>
                <el-table-column label="编辑时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="开始时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.start_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.end_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
                <el-table-column label="显示状态">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.is_enable == '1', 'el-icon-circle-cross color-danger': scope.row.is_enable == '0'}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <router-link v-if="self.showAction_('admin/banner/info')" :to="{name: 'showcase_bannerEdit', query: {id: scope.row.id, platform: scope.row.platform}}" class="el-button el-button--small el-button--primary">编辑</router-link>
                        <el-button v-if="self.showAction_('admin/banner/delete')" size="small" type="danger" @click="removeRow(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableLoading: false,
            tableData: [],
            searchForm: {},
            option: {
                platform: '1',
                language: '',
                position: '',
                page: 1,
                page_size: 20,
                is_enable: null
            },
            platformOpt: [],
            langOpt: [],
            positionOpt: [],
            total: 0,
            imgUrl: {}
        };
    },
    created () {
        this.initData();
        this.imgUrl = this.$store.getters.getUploadUrl;
    },
    methods: {
        initData () {
            this.getplat();
            this.getLang();
            this.getPosition();
        },
        getData () {
            this.tableLoading = true;
            this.$http.get('admin/banner/list', {params: this.option}).then(res => {
                this.tableLoading = false;

                if (res.body.code === 0) {
                    this.tableData = res.body.data.data;
                    this.total = res.body.data.total * 1;
                }
            }).catch(err => {
                this.tableLoading = false;
            });
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
                    if (self.langOpt.length > 0) {
                        this.option.language = self.langOpt[0].language_en;
                    } else {
                        this.option.language = '';
                    }

                    this.getData();
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
        render () {
            this.getData(this.option);
        },
        resetForm () {
            this.$refs.option.resetFields();
        },
        removeRow (item) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '确认删除', {
                type: 'warning'
            }).then(() => {
                this.$http.post('admin/banner/delete', {id: item.id}).then(res=> {
                    if (res.body.code == 0) {
                        var index = this.tableData.indexOf(item);

                        if (index !== -1) {
                            this.tableData.splice(index, 1)
                        }

                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        changePlatform (val) {
            var self = this;
            self.option.platform = val.name;
            self.getLang(self.option);
        },
        changeLang (val) {
            var self = this;

            self.option.language = val;
        },
        changePageSize (size) {
            this.option.page_size = size * 1;
            this.getData();
        },
        changePage (page) {
            this.option.page = page * 1;
            this.getData();
        },
    }

}
</script>

<style>
    .cell img {
        margin-top: 8px;
    }
</style>


