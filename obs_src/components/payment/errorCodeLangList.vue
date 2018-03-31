<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <!-- <el-form-item label="语言类型：" prop="lang">
                    <el-select v-model="filterForm.lang" clearable filterable placeholder="请选择">
                        <el-option v-for="(item, index) in langs" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item>
                    <!-- <el-button type="primary" @click="getListData"><i class="el-icon-search"></i> 查询</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button> -->
                    <el-button type="primary" @click="addLang">添加语言</el-button>
                    <router-link :to="{name: 'errorCodeList'}"><el-button type="primary">返回列表</el-button></router-link>
                    <el-button type="primary" @click="save">保存</el-button>
                </el-form-item>
            </el-form>  

            <div class="category-show">
                <span>支付渠道：{{$route.query.channelCode}}</span>
                <span>第三方错误返回值：{{$route.query.errorCode}}</span>
            </div>

            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">

                <el-table-column label="语言">
                    <template scope="scope">
                        {{ langs[scope.row.lang] }}
                    </template>
                </el-table-column>

                <el-table-column label="网站提示语">
                    <template scope="scope">
                        <el-input v-model="scope.row.siteMessage" :disabled="isSaving"></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="最后更新时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.updateTime, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="danger" @click="delLangErrorCode(scope.row)" size="small">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!-- <div class="text-right el-sub-container">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
            </div> -->
        </div>

        <el-dialog title="添加语言"   :visible.sync="isShow"  size="tiny">
            <el-select v-model="selectedLang" clearable filterable placeholder="请选择">
                <el-option v-for="(item, index) in langs" :label="item" :value="index" :key="index"></el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="insertLangToTable">确 定</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
    import {getLangs} from '@/common/baseApi'
    export default {
        data() {
            return {
                dataLoading: false,
                filterForm: {
                    lang: ''
                },
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                },
                langs: {},
                tableData: [],
                isSaving: false,
                isShow: false,
                selectedLang: ''
            }
        },
        created() {
            getLangs().then((data) => {
                let langs = {};
                data.forEach((item) => {
                    langs[item.language_code] = item.language_name;
                })
                this.langs = langs;
                this.$nextTick(() => {
                    this.initData();
                })
            })
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
                params = Object.assign({channelCode: this.$route.query.channelCode, errorCode: this.$route.query.errorCode}, this.filterForm);
                // delete params.totalCount;
                this.dataLoading = true;
                this.tableData = [];
                this.$http.get('pay/code/lang-list', { params: params }).then(res => {
                    this.dataLoading = false;
                    if (res.body.code !== 0) {
                        // this.pagination.totalCount = 0;
                        return;
                    }
                    let data = res.body.data.errorCodeLangs || [];
                    this.tableData = data;
                    // this.pagination.totalCount = res.body.data.totalCount;
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
            // 保存网站提示多语言配置
            save() {
                if(this.tableData.length > 0) {
                    if(!this.tableData.some((item) => {
                        return item.siteMessage === ''
                    })) {
                        this.isSaving = true;
                        this.$http.post('pay/code/lang-update', {
                            channelCode: this.$route.query.channelCode,
                            errorCode: this.$route.query.errorCode,
                            errorCodeLangs: this.tableData
                        }).then(res => {
                            this.isSaving = false;
                            if (res.body.code == 0) {
                                this.getListData();
                                this.$message.success(res.body.message);
                            } else {
                                this.$message.error(res.body.message);
                            }
                        })
                    } else {
                        this.$message.error('网站提示语不能为空！');
                    }
                } else {
                    this.$message.error('语言列表为空！');
                }
            },
            // 删除
            delLangErrorCode(row) {
                let index = this.tableData.indexOf(row);
                this.tableData.splice(index, 1);
                // console.log(this.tableData.indexOf(row))
            },
            // 添加语言
            addLang() {
                this.isShow = true;
            },
            // 添加语言到表格
            insertLangToTable() {
                if(this.selectedLang === '') {  this.$message.error('请选择语言！');  return; }
                if(this.tableData.some((item) => {
                    return item.lang === this.selectedLang
                })){
                     this.$message.error('列表已有当前语言种类！');  return;
                }
                this.tableData.push({
                    lang: this.selectedLang,
                    siteMessage: '',
                    updateTime: ''
                });
                this.$nextTick(() => {
                    this.selectedLang = '';
                    this.isShow = false;
                })
            }
        }
    }
</script>
<style lang="less">
    .category-show {
        color: #333;
        font-weight: bold;
        margin-bottom: 20px;
        span {
            margin-right: 20px;
        }
    }
</style>
