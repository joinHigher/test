<template>
    <!--地址填写规则-->
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label="国家" prop="countryCode">
                    <el-select v-model="option.countryCode" clearable filterable>
                        <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName"
                                   :value="item.cCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" " labelWidth="80px">
                    <el-select v-model="option.searchType" placeholder="请选择搜索类型" clearable>
                        <el-option v-for="(value,key,index) in searchItems" :key="index" :label="value"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="option.searchKey" placeholder="请输入搜索关键字"></el-input>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
                    <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <el-button type="primary" @click="$router.push({name: 'newAddressRule'})" icon="plus" v-if="self.showAction_('logistics/address-rule/add')">添加</el-button>
            </div>
            <el-table ref="multipleTable" border :data="tableData" v-loading="tableLoading"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="logisticsName" label="物流方式" align="center"></el-table-column>
                <el-table-column prop="countryNames" label="国家" header-align="center">
                    <template scope="scope">
                        <span v-if="scope.row.countryNames.length<=70">{{scope.row.countryNames}}</span>
                        <el-tooltip v-if="scope.row.countryNames.length>70" :content="scope.row.countryNames" placement="top" effect="light" popper-class="pop-box">
                            <span class="tip-text">{{scope.row.countryNames}}</span>
                        </el-tooltip>
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
                        <router-link :to="{name: 'editAddressRule',query: {row: JSON.stringify(scope.row)}}">
                            <el-button type="primary" v-if="self.showAction_('logistics/address-rule/edit')">编辑</el-button>
                        </router-link>
                        &nbsp;
                        <el-button type="danger" @click="removeItem(scope.row)" v-if="self.showAction_('logistics/address-rule/delete')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo"
                           :page-sizes="[10, 20, 50]" :page-size="option.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                self: this,
                option: {
                    pageNo: 1,
                    pageSize: 10,
                    countryCode: '', //国家编码
                    searchType: '', //搜索类型
                    searchKey: ''  //搜索关键字
                },
                stateCode: [], //国家
                searchItems: {
                    1: '物流名称',
                    2: '物流编码'
                },
                tableLoading: false,
                total: 0,
                tableData: [],
                taxRowChecked: [], //被选择的行

            };
        },
        created () {
            this.getStateCode();
            this.getData();
        },
        methods: {
            //获得国家
            getStateCode (){
                this.stateCode = [];
                let args = {
                    page_size: 2000,
                    page: 1,
                    countryCode: '',
                };
                this.$http.get('logistics/country-info/list', {params: args}).then(res => {
                    if (res.body.code === 0) {
                        res.body.data.list.forEach(item => {
                            this.stateCode.push({cCode: item.countryCode, cName: item.countryName});
                        });
                    }
                });
            },

            getData () {
                if (this.option.searchType === '' && this.option.searchKey !== '') {
                    this.$message.error('请选择搜索类型');
                    return false;
                }

                if (this.option.searchType !== '' && this.option.searchKey === '') {
                    this.$message.error('请输入搜索关键字');
                    return false;
                }

                this.tableLoading = true;
                this.$http.get('logistics/address-rule/list', {params: this.option}).then(res => {
                    this.tableLoading = false;
                    if (res.body.code === 0 && res.body.data.list) {
                        this.tableData = res.body.data.list;
                        this.tableData.forEach(item => {
                            let countryList = item.countryRelRespList;
                            let countryNames = '';
                            let countryCodes = [];
                            countryList.forEach(country => {
                                let temp = country.countryName + '；';
                                countryNames += temp;
                                countryCodes.push(country.countryCode);
                            });
                            item.countryNames = countryNames;
                            item.countryCodes = countryCodes.slice(0);
                        });
                        this.total = res.body.data.totalCount;
                    } else {
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
                this.taxRowChecked = val;
            },

            //删除单行
            removeItem (row) {
                this.$confirm('是否删除该项?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('logistics/address-rule/delete', {id: row.id}).then(res => {
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
                this.option.searchType = '';
                this.option.searchKey = '';
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
