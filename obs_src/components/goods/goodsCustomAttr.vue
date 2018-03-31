<!-- 网站自定义属性 -->
<template>
    <div class="good-custom-attr">
        <div class="el-container">
            <el-row>
                <el-col :span="18">
                    <el-form :model="option" label-width="100px">
                        <el-form-item label="属性名称">
                            <el-row>
                                <el-col :span="12">
                                    <el-input v-model="option.pdmAttrName" placeholder="支持多属性筛选，请用','隔开"></el-input>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-button type="primary" @click="getData">查询</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="属性列表">
                            <div class="table-title">
                                <el-button type="primary" @click="add" v-if="self.showAction_('goods/category-attribute/add-attr')" >添加属性</el-button>
                            </div>
                            <el-table :data="tableData" border>
                                <el-table-column prop="attrName" label="属性名称"></el-table-column>
                                <el-table-column label="属性值">
                                    <template scope="scope">
                                        <span v-if="scope.row.valueList.length > 0">{{scope.row.valueList.join(',')}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="pdmAttrValue" label="属性类型">
                                    <template scope="scope">
                                        <span v-if="scope.row.templateType == 1">固定值</span>
                                        <span v-if="scope.row.templateType == 2">区间值</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template scope="scope">
                                        <el-button v-if="self.showAction_('goods/category-attribute/update-attr')" type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                                        <el-button v-if="self.showAction_('goods/category-attribute/del-attr')" type="danger" size="small" @click="remove(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="text-right el-sub-container">
                                <el-pagination  @size-change="changeSize" @current-change="ChangePage" :page-sizes="[10,20,50]" :page-size="option.pageSize" :current-page="option.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="option.total">
                                </el-pagination>
                            </div>
                        </el-form-item>

                    </el-form>
                </el-col>
            </el-row>

        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                option: {
                    pdmAttrName: '',
                    total: null,
                    pageSize: 20,
                    pageNo: 1,
                },
                tableData: [],
            }
        },
        created() {
            this.getData();
        },
        methods: {
            ChangePage (val) {
                this.option.pageNo = val;
                this.getData();
            },
            changeSize (val) {
                this.option.pageSize = val;
                this.getData();
            },
            async getData () {
                let params = {};
                params.pageNo = this.option.pageNo;
                params.pageSize = this.option.pageSize;
                if (this.option.pdmAttrName) {
                    params.attrNameList = this.option.pdmAttrName.split(',');
                }

                const data = await this.httpGet_('goods/category-attribute/attr-list', {params: params});
                this.tableData = data.list;
                this.option.total = data.totalCount;
            },
            add () {
                this.$router.push({
                    name: 'goods_customAttrAdd',
                })
            },
            edit (row) {
                this.$router.push({
                    name: 'goods_customAttrEdit',
                    query: {
                        id: row.attrKey,
                        type: row.templateType,
                    }
                })
            },
            remove (row) {
                this.$confirm('是否删除该项?', '提示').then(async () => {
                    const data = await this.httpPost('goods/category-attribute/del-attr', {attrKey: row.attrKey});
                    this.$message.success(data.message);
                    this.getData();
                }).catch(() => {
                    this.$message.info('已取消')
                })

            },
        }
    }
</script>

<style lang="less">
    .good-custom-attr {
        .table-title {
            margin-bottom: 22px;
        }
    }
</style>
