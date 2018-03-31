<!--保费管理-->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label="国家" prop="countryCode">
                    <el-select v-model="option.countryCode" clearable filterable>
                        <el-option v-for="item in countryList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipelineCode" labelWidth="100px">
                    <el-select v-model="option.pipelineCode" clearable>
                        <el-option v-for="item in pipelineList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
                    <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <el-button type="primary" @click="$router.push({name: 'newPremium'})" icon="plus" v-if="self.showAction_('logistics/premium-check/add')">添加</el-button>
            </div>
            <el-table ref="multipleTable" border :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="pipelineName" label="渠道" align="center"></el-table-column>
                <el-table-column prop="countryNames" label="国家" header-align="center">
                    <template scope="scope">
                        <span v-if="scope.row.countryNames.length<=80">{{scope.row.countryNames}}</span>
                        <el-tooltip v-if="scope.row.countryNames.length>80" :content="scope.row.countryNames" placement="top" effect="light" popper-class="pop-box">
                            <span class="tip-text">{{scope.row.countryNames}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.status==1">开启</span>
                        <span v-if="scope.row.status==0">关闭</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="修改时间" align="center">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <router-link :to="{name: 'editPremium',query: {row: JSON.stringify(scope.row)}}">
                            <el-button type="primary" v-if="self.showAction_('logistics/premium-check/update')">编辑</el-button>
                        </router-link>
                        &nbsp;
                        <el-button type="danger"  @click="removeItem(scope.row)" v-if="self.showAction_('logistics/premium-check/delete')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import logistics from '../js/logistics'
    Vue.use(logistics);

    export default {
        data () {
            return {
                self: this,
                option: {
                    pageNo: 1,
                    pageSize: 10,
                    countryCode: '', //国家编码
                    pipelineCode:'', //渠道编码
                },
                countryList: this.getCounryListFun(), //国家
                pipelineList: this.getPipe(), //渠道
                tableLoading: false,
                total: 0,
                tableData: [],
                rowChecked: [], //被选择的行
            };
        },
        created () {
            this.getData();
        },
        methods: {

            getData () {
                this.tableLoading = true;
                this.$http.get('logistics/premium-check/list',{ params: this.option }).then( res => {
                    this.tableLoading = false;
                    if (res.body.code === 0 && res.body.data.list) {
                        this.tableData = res.body.data.list;
                        this.tableData.forEach(item => {
                            let countrys = '';
                            item.countryRelList.forEach(country => {
                                 let temp = country.countryName + '；';
                                 countrys += temp;
                            });
                            item.countryNames = countrys;
                        });
                        this.total = res.body.data.totalCount;
                    }else{
                        this.tableData = [];
                    }
                })
            },
            //筛选按钮
            getDataBySearch(){
                this.getData();
                this.option.pageNo = 1;
            },

            //表格勾选
            handleSelectionChange(val) {
                this.rowChecked = val;
            },

            //删除单行
            removeItem (row) {
                this.$confirm('是否删除该项?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('logistics/premium-check/delete', {id: row.id}).then(res => {
                        if (res.body.code === 0) {
                            let index = this.tableData.indexOf(row);
                            this.tableData.splice(index, 1);
                            this.total--;
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除!'
                    });
                });
            },


            ChangePage (val) {
                this.option.pageNo = val;
                this.getData();
            },
            ChangePageSize (val) {
                this.option.pageSize = val;
                this.getData();
            },

            resetForm () {
                this.option.countryCode = '';
                this.option.pipelineCode = '';
                this.getDataBySearch();
            }
        }
    }
</script>

<style lang="less">

    .tip-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        padding: 10px 0;
        cursor: pointer;
        &:hover {
            color: red;
        }
    }

    .pop-box {
        max-width: 1200px;
        line-height: 20px;
        word-wrap: break-word;
    }

</style>
