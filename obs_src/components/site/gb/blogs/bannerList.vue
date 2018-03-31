<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="关键词" prop="keyword">
                    <el-input v-model="filterForm.keyword" placeholder="输入关键词"></el-input>
                </el-form-item>
                <el-form-item label="是否显示：" prop="is_display">
                    <el-select v-model="filterForm.is_display" clearable placeholder="请选择">
                        <el-option label="显示" :value="1" ></el-option>
                        <el-option label="不显示" :value="0" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                    <el-button type="primary"  @click="add" v-if="self.showAction_('blog/banner/add')">添加banner</el-button>
                </el-form-item>
            </el-form>


            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="banner_name" label="banner 标题名称"></el-table-column>
                <el-table-column label="图片">
                    <template scope="scope">
                        <div class="img-container">
                            <img :src="scope.row.banner_image" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="banner_url" label="跳转URL"></el-table-column>
                <el-table-column label="是否显示">
                    <template scope="scope">
                        {{ scope.row.is_display == 1 ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="sort_order" label="排序"></el-table-column>
                <el-table-column prop="start_time" label="开始时间"></el-table-column>
                <el-table-column prop="end_time" label="结束时间"></el-table-column>
                <el-table-column prop="update_time" label="最后编辑时间"></el-table-column>
                <el-table-column prop="update_user" label="最近编辑人"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button  type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('blog/banner/edit')">编辑</el-button>
                        <el-button  type="danger" size="small" @click="deleteBanner(scope.row)" v-if="self.showAction_('blog/banner/delete')">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="text-right el-sub-container">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
            </div>
        </div>

        <el-dialog :title="bannerForm.isEdit ? '编辑Banner' : '添加Banner'"  :visible.sync="bannerForm.isShow" @close="handleClose">
            <el-form :model="bannerForm" ref="bannerForm" class="banner-form" :rules="rules">
                <el-form-item label="Banner 标题：" prop="banner_name" label-width="150px">
                    <el-input v-model="bannerForm.banner_name" auto-complete="off" class="banner-input"></el-input>
                </el-form-item>
                <el-form-item label="Banner 图片地址：" prop="banner_image" label-width="150px">
                    <el-input v-model="bannerForm.banner_image" auto-complete="off" class="banner-input"></el-input>
                </el-form-item>
                <el-form-item label="Banner 跳转链接：" prop="banner_url" label-width="150px">
                    <el-input v-model="bannerForm.banner_url" auto-complete="off" class="banner-input"></el-input>
                </el-form-item>
                <el-form-item label="时间：" prop="timeRange" label-width="150px" ref="picker">
                    <el-date-picker v-model="bannerForm.timeRange" type="datetimerange"  placeholder="选择时间范围" align="right" class="banner-input"></el-date-picker>
                </el-form-item>
                <el-form-item label="显示位置：" prop="position" label-width="150px">
                    <el-select v-model="bannerForm.position" placeholder="请选择" class="banner-input">
                        <el-option label="首页" :value="1"></el-option>
                        <el-option label="文章详情页" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示：" prop="is_display" label-width="150px">
                    <el-radio-group v-model="bannerForm.is_display">
                        <el-radio :label="1">显示</el-radio>
                        <el-radio :label="0">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序：" prop="sort_order" label-width="150px">
                    <el-input v-model="bannerForm.sort_order" auto-complete="off" class="banner-input"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="bannerForm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                dataLoading: false,
                filterForm: {
                    keyword: '',
                    is_display: 1
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                bannerForm: {
                    id: '',
                    isShow: false,
                    isEdit: false,
                    banner_name: '',
                    banner_image: '',
                    banner_url: '',
                    timeRange: [],
                    position: 1,
                    is_display: 0,
                    sort_order: ''
                },
                tableData: [],
                rules: {
                    banner_name: [
                        { required: true, message: '请输入banner名称', trigger: 'blur' },
                    ],
                    banner_image: [
                        { required: true, message: '请输入banner 的图片路径', trigger: 'blur' }
                    ],
                    banner_url: [
                        { required: true, message: '请输入banner 的链接地址', trigger: 'blur' }
                    ],
                    timeRange: [
                        { required: true, type: 'array', message: '请选择时间范围', trigger: 'change' }
                    ]
                }
            }
        },

        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.getListData();
            },
            // 获取列表数据
            getListData(param) {
                let params = {};
                if (typeof param === 'number') {
                    this.pagination.pageNo = param;
                }
                params = Object.assign({}, this.pagination, this.filterForm);
                delete params.totalCount;
                this.dataLoading = true;
                this.$http.get('blog/banner/list', { params: params }).then(res => {
                    this.dataLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        this.pagination.totalCount = 0;
                        return;
                    }
                    let data = res.body.data.data;
                    this.tableData = data;
                    this.pagination.totalCount = res.body.data.total;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 改变每页显示数
            changePageSize(value) {
                this.pagination.pageSize = value;
                this.getListData();
            },
            // 改变当前页
            changePage(value) {
                this.pagination.pageNo = value;
                this.getListData();
            },
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
            },
            // 添加banner
            add() {
                this.bannerForm.timeRange = [];
                this.bannerForm.isShow = true;
                this.$nextTick(() => {
                    this.$refs.picker.resetField();
                })
                // console.log(this.$refs.picker.resetField())
            },
            // 编辑
            edit(row) {
                this.bannerForm.isShow = true;
                if(row.start_time && row.end_time) {
                    this.bannerForm.timeRange = [row.start_time, row.end_time];
                }
                this.bannerForm.banner_name = row.banner_name;
                this.bannerForm.banner_image = row.banner_image;
                this.bannerForm.banner_url = row.banner_url;
                this.bannerForm.position = row.position;
                this.bannerForm.is_display = row.is_display;
                this.bannerForm.sort_order = row.sort_order;
                this.bannerForm.id = row.id;
                this.bannerForm.isEdit = true;
            },
            // 删除
            deleteBanner(row) {
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('blog/banner/delete', {
                        id: row.id
                    }).then(res => {
                        if (res.body.code == 0) {
                            this.getListData();
                            this.$message.success(res.body.message);
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(() => {
                    this.$message.info( '已取消删除');
                });
            },
            // 保存
            save() {
                let params = Object.assign({}, this.bannerForm);
                if(params.timeRange.length === 2) {
                    params.start_time = this.timeZone_(new Date(params.timeRange[0]), this.$store.getters.getTimeZone);
                    params.end_time = this.timeZone_(new Date(params.timeRange[1]), this.$store.getters.getTimeZone);
                }
                delete params.timeRange;
                this.$refs.bannerForm.validate((valid) => {
                    if (valid) {
                        delete params.isEdit;
                        delete params.isShow;
                        this.$http.post('blog/banner/' + (params.id ? 'edit' : 'add') , params).then(res => {
                            if (res.body.code !== 0) {
                                return this.$message.error(res.body.message);
                            }
                           this.$message.success(res.body.message);
                           this.bannerForm.isShow = false;
                           this.getListData();
                        },
                        (err) => {
                            this.$notify.error(err.body.message || '发生错误');
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleClose() {
                if(this.bannerForm.id) {
                    this.bannerForm.banner_name = '';
                    this.bannerForm.banner_image = '';
                    this.bannerForm.banner_url = '';
                    this.bannerForm.position = 1;
                    this.bannerForm.is_display = 0;
                    this.bannerForm.sort_order = '';
                    this.bannerForm.id = '';
                    this.bannerForm.timeRange = [];
                    this.bannerForm.isEdit = false;
                } else {
                    this.$refs.bannerForm.resetFields();
                }

            }
        }
    }
</script>
<style lang="less">
.img-container {
    width: 100px;
    height: 50px;
    position: relative;
    img{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
    }
}
.banner-form{
    .banner-input{
        width: 600px;
    }
}
</style>
