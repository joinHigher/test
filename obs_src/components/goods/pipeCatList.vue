<!-- 分类渠道列表 -->
<template>
    <div class="el-container pipe-cat">
        <el-form inline label-width="100px" :model="option" ref="searchForm">
            <el-form-item label="渠道" prop="pipelineCode" :rules="[{required: true, message: '该项不能为空'}]">
                <el-select v-model="option.pipelineCode" placeholder="请先选择渠道">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类查询" prop="searchContent" :rules="[{validator: searchRule}]">
                <el-input v-model="option.searchContent" class="quick-search" placeholder="搜索内容">
                    <el-select filterable clearable v-model="option.searchType" slot="prepend" placeholder="请选择">
                        <el-option label="商品分类ID" value="1"></el-option>
                        <el-option label="商品分类名称" value="2"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <div class="text-right el-sub-container">
                <el-button type="primary" icon="search" @click="getData" :disabled="tableLoading" v-loading="tableLoading">筛选</el-button>
                <el-button type="danger" icon="search" @click="reset">重置</el-button>
            </div>
        </el-form>
        <div class="el-sub-container text-left">
            <el-button :disabled="defaultData.length === 0" type="primary" @click="resetTable" icon="plus">全部收回</el-button>
            <el-button v-if="self.showAction_('goods/category/add-pipeline-category')" type="info" @click="add" icon="plus">新增渠道利润率</el-button>
        </div>
        <!--  -->
        <el-table :data="tableData" border v-loading="tableLoading">
            <el-table-column label="分类名称">
                <template scope="scope">
                    <div :style="{'margin-left': scope.row.level * 30 + 'px'}">
                         <a v-if="scope.row.isLeaves == 0 && scope.row.subCategoryList && scope.row.subCategoryList.length > 0" class="tree-btn" @click="toggle(scope.row, scope.$index)"><i :class="{'el-icon-plus': !scope.row.toggle, 'el-icon-minus': scope.row.toggle}"></i>{{scope.row.categoryMultiLang.categoryName}}</a>
                         <span v-else>{{scope.row.categoryMultiLang.categoryName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="是否显示">
                <template scope="scope">
                    <i :class="{'el-icon-circle-check color-success': scope.row.isDisplay == 1, 'el-icon-circle-cross color-danger': scope.row.isDisplay == 0}"></i>
                </template>
            </el-table-column>
            <el-table-column prop="shipRegion" label="商品计费价格区间(￥)">
                <template scope="scope">
                    <span v-if="scope.row.pipelineCategoryInfo && scope.row.pipelineCategoryInfo.shipRegion">{{scope.row.pipelineCategoryInfo.shipRegion}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="addPrice" label="追加(￥)">
                <template scope="scope">
                    <span v-if="scope.row.pipelineCategoryInfo && scope.row.pipelineCategoryInfo.addPrice">{{scope.row.pipelineCategoryInfo.addPrice}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="rates" label="利润率">
                <template scope="scope">
                    <span v-if="scope.row.pipelineCategoryInfo && scope.row.pipelineCategoryInfo.rates">{{scope.row.pipelineCategoryInfo.rates}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
                <template scope="scope">
                    <el-button v-if="scope.row.isLeaves == 1 && self.showAction_('goods/category/get-pipeline-category-detail')" type="primary" @click="edit(scope.row)" size="small">编辑利润率</el-button>
                    <el-button v-if="scope.row.isLeaves == 1 && self.showAction_('goods/category/del-pipeline-category-rates')" type="danger" size="small" @click="remove(scope.row)">删除利润率</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="编辑/追加利润率" v-model="editDialog">
            <el-form inline :model="editForm" label-width="0" ref="editForm">
                <div>
                    <el-form-item label="分类" prop="categoryId" label-width="100px" class="cat-bar" :rules="[required]">
                        <el-cascader placeholder="此操作进针对所选分类以及下属分类的所有底层分类" :options="catOpt" v-model="editForm.categoryId" filterable change-on-select :props="prop"></el-cascader>
                    </el-form-item>
                </div>
                <el-form-item label="生效渠道" prop="pipelineCodeList" label-width="100px" :rules="[required]">
                    <el-select v-model="editForm.pipelineCodeList" multiple>
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <table class="table-custom">
                    <thead>
                        <tr>
                            <th>计费价格区间</th>
                            <th>追加</th>
                            <th>利润率</th>
                            <th>
                                <el-button type="primary" size="small" @click="addItem">添加</el-button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in editForm.rates">
                            <td>
                                <el-row>
                                    <el-col :span="9">
                                        <el-form-item :prop="'shipRegion.' + index + '.begin'" :rules="[required, {validaotr: checkNum}, {validator: checkBegin(index)}]">
                                            <el-input v-model="editForm.shipRegion[index].begin"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" :offset="1">——</el-col>
                                    <el-col :span="9" :offset="1">
                                        <el-form-item :prop="'shipRegion.' + index + '.end'" :rules="[required, {validaotr: checkNum}, {validator: checkEnd(index)}]">
                                            <el-input v-model="editForm.shipRegion[index].end"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </td>
                            <td>
                                <el-form-item :prop="'addPrice.' + index" :rules="[required, {validaotr: checkNum}]">
                                    <el-input v-model="editForm.addPrice[index]"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item :prop="'rates.' + index" :rules="[required, {validaotr: checkNum}]">
                                    <el-input v-model="editForm.rates[index]"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-button type="danger" size="small" @click="removeItem(index)">删除</el-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button type="primary" @click="post" v-loading="editLoading" :disabled="editLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
    <!-- 弹窗S -->

    <!-- 弹窗E -->
</template>

<script>

export default {
    data () {
        let self = this;
        let checkNum = (rule, val, callback) => {
            if (val * 1 == val) {
                callback()
            } else {
                callback(new Error('该项必须为数字'));
            }
        }

        let checkBegin = (index) => {
            return (rule, val, callback) => {
                let end = self.editForm.shipRegion[index].end;
                if (end && val * 1 < end * 1) {
                    callback();
                } else {
                    callback(new Error('结束值必须大于起始值'));
                }
            }
        }

        let checkEnd = (index) => {
            return (rule, val, callback) => {
                let start = self.editForm.shipRegion[index].begin;
                if (start && val * 1 > start * 1) {
                    callback();
                } else {
                    callback(new Error('结束值必须大于起始值'));
                }
            }
        }

        let required = {required: true, message: '该项不能为空'};

        let searchRule = (rule, val, callback) => {
            if ((this.option.searchContent && this.option.searchType) || (!this.option.searchContent && !this.option.searchType)) {
                callback();
            } else {
                callback(new Error('请输入有效内容'));
            }
        }
        return {
            checkBegin: checkBegin,
            checkEnd: checkEnd,
            searchRule: searchRule,
            required: required,
            checkNum: checkNum,
            self: this,
            tableLoading: false,
            option: {
                pipelineCode: '',
                searchType: '',
                searchContent: '',
                isLeaves: 'false',
                isPage: 2,
                parentId: '0',
            },
            // total: 1,
            catOpt: [],
            tableData: [],
            defaultData: [],
            editDialog: false,
            editLoading: false,
            editForm: {
                pipelineCodeList: [],
                categoryId: [],
                rates: [''],
                shipRegion: [{
                    begin: '',
                    end: '',
                }],
                addPrice: [''],
            },
            prop: {
                label: 'categoryName',
                value: 'id',
                children: 'subCategoryList',
            }
        }
    },
    mounted() {
        let self = this;
        this.getCat();
        setTimeout(() => {
            this.getData();
        }, 1000)
    },
    computed: {
        pipeOpt () {
            let list = this.$store.getters.getPipe.list;
            if (list && list[0]) {
                this.option.pipelineCode = list[0].pipeline_code;
            }
            return this.$store.getters.getPipe.obj;
        },
    },
    methods: {
        // 获取分类
        async getCat() {
            const data = await this.httpGet_('goods/category/category-drop-down');
            this.catOpt = data;
        },
        getData() {
            this.$refs.searchForm.validate(async valid => {
                if (valid) {
                    let params = {};
                    for (let i in this.option) {
                        if (this.option[i]) {
                            params[i] = this.option[i];
                        }
                    }
                    this.tableLoading = true;
                    try {
                        let data = await this.httpGet_('goods/category/list', {params: params});
                        let tmepList = [];
                        data.list.forEach(function(element) {
                            element.level = 0;

                            if(element.isLeaves == 0 && element.subCategoryList && element.subCategoryList.length > 0) {
                                element.toggle = false;
                            } else {
                                element.toggle = true;
                            }
                            tmepList.push(element);
                        });

                        this.tableData = tmepList;

                        this.defaultData = JSON.parse(JSON.stringify(tmepList));
                    } finally {
                        this.tableLoading = false;
                    }

                }
            });
        },
        // page
        // ChangePage (val) {
        //     this.option.pageNo = val;
        //     this.getData();
        // },
        // ChangePageSize (val) {
        //     this.option.pageSize = val;
        //     this.getData();
        // },
        addItem() {
            this.editForm.rates.push('');
            this.editForm.addPrice.push('');
            this.editForm.shipRegion.push({
                begin: '',
                end: '',
            });
        },
        removeItem(index) {
            this.editForm.rates.splice(index, 1);
            this.editForm.addPrice.splice(index, 1);
            this.editForm.shipRegion.splice(index, 1);
        },
        add () {
            this.editDialog = true;
            this.editForm = {
                pipelineCodeList: [],
                categoryId: [],
                rates: [''],
                shipRegion: [{
                    begin: '',
                    end: '',
                }],
                addPrice: [''],
            };
        },
        async edit(row) {
            let params = {};
            params.pipelineCode = this.option.pipelineCode;
            params.categoryId = row.id;
            let data = await this.httpGet_('goods/category/get-pipeline-category-detail', {params: params});
            this.editForm = {
                pipelineCodeList: [],
                categoryId: [],
                rates: [],
                shipRegion: [],
                addPrice: [],
            };
            let priceList = data.addPrice.split('|') ;
            let shipList = data.shipRegion.split('|');
            let rateList = data.rates.split('|');

            shipList.forEach((item, index) => {
                this.editForm.rates.push(rateList[index]);
                this.editForm.addPrice.push(priceList[index]);
                let arr = item.split('-');
                this.editForm.shipRegion.push({
                    begin: arr[0],
                    end: arr[1],
                })
            });

            let temp = [data.categoryId];
            data.categoryPathInfoList.forEach(item => {
                temp.push(item.categoryId);
            });

            this.editForm.categoryId = temp.reverse();
            this.editForm.pipelineCodeList = data.pipelineCode ? [data.pipelineCode] : [];
            // 待编辑
            this.editDialog = true;
        },
        remove(row) {
            let params = {
                pipelineCode: this.option.pipelineCode,
                categoryId: row.id,
            };
            let title = '确认删除分类在' + this.pipeOpt[this.option.pipelineCode] + '配置的利润率?';
            this.$confirm(title, '提示').then(async () => {
                const data = await this.httpPost_('goods/category/del-pipeline-category-rates', params);
                this.$message.success(data.message);
                this.getData();
            });
        },
        post() {
            this.$refs.editForm.validate(async valid => {
                if (valid) {
                    let data = this.editForm;
                    let params = {};
                    let temp = [];
                    params.pipelineCodeList = data.pipelineCodeList;
                    params.categoryId = data.categoryId[data.categoryId.length - 1];
                    params.rates = data.rates.join('|');
                    params.addPrice = data.addPrice.join('|');

                    data.shipRegion.forEach(item => {
                        temp.push(item.begin + '-' + item.end);
                    });
                    params.shipRegion = temp.join('|');

                    const res = await this.httpPost_('goods/category/add-pipeline-category', params);
                    this.editDialog = false;
                    this.getData();
                    this.$message.success(res.message);
                }
            })

        },
        reset() {
            this.$refs.searchForm.resetFields();
            this.option.searchType = '';
        },
        // tree
        toggle (row, index) {
            if (!row.toggle) {
                row.subCategoryList = row.subCategoryList || [];
                row.subCategoryList.forEach(item => {
                    item.level = row.level + 1;
                });
                this.tableData = this.tableData.slice(0, index + 1).concat(row.subCategoryList).concat(this.tableData.slice(index + 1, this.tableData.length));
                row.toggle = true;
            } else {
                for (let i = index + 1; i < this.tableData.length; i++) {
                    if (this.tableData[i].level <= row.level) {
                        this.tableData.splice(index + 1, i - index -1);
                        break;
                    }

                    if (i == this.tableData.length - 1) {
                        this.tableData.splice(index + 1, i);
                    }
                }
                row.toggle = false;
            }

        },
        // 收回
        resetTable () {
            this.tableData = JSON.parse(JSON.stringify(this.defaultData));
        },
    }

}
</script>

<style lang="less">
    .pipe-cat {
        .table-custom {
            .el-form-item {
                margin-bottom: 0;
            }
        }

        .el-col-2 {
            line-height: 36px;
        }

        .cat-bar {
            .el-cascader {
                width: 400px;
            }
        }
    }
</style>


