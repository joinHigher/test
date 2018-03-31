<!-- 搜索词推荐 -->
<template>
    <div>
        <div class="el-container">
            <el-form :model="searchForm" ref="searchForm" :rules="searchRules" inline>
                <el-form-item label="渠道：" prop="pipeline_code">
                    <el-select v-model="searchForm.pipeline_code" filterable clearable placeholder="请选择">
                        <el-option v-for="(item, index) in pipelines" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语言：" prop="lang">
                    <el-select v-model="searchForm.lang" filterable clearable>
                        <el-option v-for="(item, index) in langs" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词：" prop="keywords">
                    <el-input v-model="searchForm.keywords"></el-input>
                </el-form-item>
                <el-form-item label="URL：" prop="url">
                    <el-input v-model="searchForm.url"></el-input>
                </el-form-item>
                <el-form-item label="(类似1-100) 商品数：">
                    <el-form-item prop="goods_count_min" class="range-form-item">
                        <el-input v-model="searchForm.goods_count_min" class="w-150"></el-input>
                    </el-form-item>
                    -
                    <el-form-item prop="goods_count_max">
                        <el-input v-model="searchForm.goods_count_max" class="w-150"></el-input>
                    </el-form-item>
                </el-form-item>

                <el-form-item label="绑定分类：" prop="bind_cat_id">
                    <el-cascader placeholder="请选择" :options="categorys" :show-all-levels="false" v-model="searchForm.bind_cat_id" filterable change-on-select :props="prop"></el-cascader>
                </el-form-item>

                <el-form-item label="显示状态：" prop="is_show">
                    <el-select v-model="searchForm.is_show" placeholder="请选择" class="w-100">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="显示" value="1"></el-option>
                        <el-option label="不显示" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="页面类型：" prop="page_type">
                    <el-select v-model="searchForm.page_type" placeholder="请选择" class="w-100">
                        <el-option v-for="(item, index) in pageTypeText" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="重点推荐：" prop="recommend_type">
                    <el-select v-model="searchForm.recommend_type" placeholder="请选择" class="w-100">
                        <el-option v-for="(item, index) in recommendTypeText" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleBtnSearchFilterClick"><i class="el-icon-search"></i> 查询</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>

            <div class="el-sub-container">
                <el-button type="primary" @click="handleBtnAddClick">批量上传</el-button>
                <a :href="downloadUrl">
                    <el-button type="primary">模板下载</el-button>
                </a>
                <el-button type="primary" :disabled="multipleSelection.length === 0" @click="batchChange('delete')">批量删除</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0"  @click="batchChange('is_show', 1)">批量显示</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0"  @click="batchChange('is_show', 0)">批量不显示</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0"  @click="batchChange('recommend_type', 1)">批量选择新品</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0"  @click="batchChange('recommend_type', 2)">批量选择重点</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0"  @click="batchChange('recommend_type', 3)">批量选择当季</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0"  @click="batchChange('recommend_type', 0)">批量取消重点推荐</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0"  @click="catDlg.isShow = true">批量选择拓展分类</el-button>
                <el-button type="primary" :disabled="multipleSelection.length === 0"  @click="batchChange('extend_cat_ids', '')">批量取消拓展分类</el-button>
            </div>

            <el-table :data="tableData" v-loading="isDataLoading" class="text-center" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" width="80"></el-table-column>
                <el-table-column prop="keywords" label="关键词"></el-table-column>
                <el-table-column prop="url" label="URL" width="200"></el-table-column>
                <el-table-column prop="bind_cat_name" label="绑定分类" width="100"></el-table-column>
                <el-table-column prop="extend_cat_ids" label="拓展分类" width="250"></el-table-column>
                <el-table-column prop="goods_count" label="商品数" width="80"></el-table-column>
                <el-table-column label="页面类型">
                    <template scope="scope">
                        {{pageTypeText[scope.row.page_type]}}
                    </template>
                </el-table-column>
                <el-table-column label="重点推荐">
                    <template scope="scope">
                        {{recommendTypeText[scope.row.recommend_type]}}
                    </template>
                </el-table-column>
                <el-table-column prop="recently_search_count" label="最近1个月搜索量" width="150"></el-table-column>
                <el-table-column label="显示状态" width="100">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.is_show == 1, 'el-icon-circle-cross color-danger': scope.row.is_show == 0}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="语言">
                    <template scope="scope">
                        {{ langs[scope.row.lang] }}
                    </template>
                </el-table-column>
                <el-table-column label="渠道">
                    <template scope="scope">
                        <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="handleBtnEditClick(scope.row)">编辑</el-button> &nbsp;
                        <el-button type="danger" size="small" @click="handleBtnDelClick(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="el-sub-container text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.page" :page-sizes="[10, 20, 50]" :page-size="pagination.size" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
            </div>
        </div>

        <!-- 弹窗S -->
        <el-dialog class="edit-dlg" :title="editDlg.isEdit ? '修改搜索推荐关键字' : '添加搜索推荐关键字'" v-model="editDlg.isShow" size="tiny">
            <el-form :model="editDlg" :rules="editRules" ref="editForm" label-width="120px">
                <el-form-item prop="keywords" label="关键词：">
                    <el-input v-model.trim="editDlg.keywords" :maxlength="100"></el-input> <span>100个字符以内</span>
                </el-form-item>
                <el-form-item prop="url" label="URL：">
                    <el-input v-model.trim="editDlg.url" class="w-300"></el-input>
                </el-form-item>
                <el-form-item prop="pipeline_code" label="渠道：">
                    <el-select v-model="editDlg.pipeline_code" filterable placeholder="请选择">
                        <el-option v-for="(item, index) in pipelines" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="lang" label="语言：">
                    <el-select v-model="editDlg.lang" filterable>
                        <el-option v-for="(item, index) in langs" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="bind_cat_id" label="绑定分类：">
                    <el-cascader placeholder="请选择" :options="categorys" :show-all-levels="false" v-model="editDlg.bind_cat_id" filterable change-on-select :props="prop"></el-cascader>
                </el-form-item>
                <el-form-item prop="extend_cat_ids" label="拓展分类：">
                    <el-tree class="el-tree-seo" :data="categorys" show-checkbox  node-key="id" :default-checked-keys="editDlg.extend_cat_ids" ref="tree" highlight-current :props="prop"></el-tree>
                </el-form-item>
                <el-form-item prop="is_show" label="显示：">
                    <el-checkbox v-model="editDlg.is_show" :true-label="1" :false-label="0"></el-checkbox>
                </el-form-item>
                <el-form-item prop="recommend_type" label="重点推荐：">
                    <el-select v-model="editDlg.recommend_type" placeholder="请选择">
                        <el-option v-for="(item, index) in recommendTypeText" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="editDlg.isShow = false">取消</el-button>
                <el-button type="primary" :loading="editDlg.isLoading" @click="handleBtnOkClick">确认</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->

        <!--批量选择拓展分类-->
        <el-dialog class="cat-dlg" title="批量选择拓展分类" v-model="catDlg.isShow" size="tiny" :before-close="beforeCloseCatDailog">
            <el-tree class="el-tree-seo" :data="categorys" show-checkbox  node-key="id" :default-checked-keys="catDlg.extend_cat_ids" ref="catTree" highlight-current :props="prop"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="catDlg.isShow = false">取消</el-button>
                <el-button type="primary" @click="handleSelectedClick">确认</el-button>
            </span>
        </el-dialog>
        <!--批量选择拓展分类-->

        <!-- 添加弹窗S -->
        <el-dialog class="add-dlg" title="批量导入关键字" v-model="addDlg.isDlgShow" size="tiny">
            <el-form :model="addDlg" label-width="40%">
                <el-form-item label="上传EXCLE文件：">
                    <el-upload ref="upload" :action="importUrl"   :auto-upload="false" :on-success="handleUploadSuccess" :on-error="handleUpdateError" :before-upload="beforeUpdate" :file-list="updateList">
                        <el-button slot="trigger" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="el-sub-container">
                <p>提示</p>
                <ul>
                    <li>1、格式：.xls。</li>
                    <li>2、最大不超过10M</li>
                    <li>3、文件列对应关系：A=>关键字、 B=>URL、 C=>流量、 D=>排名、 E=>绑定分类 注：第一行默认是标题，不计入</li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="submitUpload" v-loading="addDlg.isLoading">提交</el-button>
                <el-button type="default" @click="addDlg.isDlgShow = false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->

    </div>
</template>

<script>
import httpGet ,{ httpPost, getLangsBySite, getPipelines, getAllCategory } from '@/common/baseApi'
export default {
    data () {
        let validateRange = (rule, value, callback) => {
            if (value === '') {
                callback();
            }
            else if(!Number.isInteger(value * 1)){
                callback(new Error('只能为正整数'));
            }
            else {
                if (this.searchForm['goods_count_max'] !== '') {
                    this.$refs.searchForm.validateField('goods_count_max');
                }
                callback();
            }
        };

        let validateRange2 = (rule, value, callback) => {
            if (value === '') {
                callback();
            }
            else if(!Number.isInteger(value * 1)){
                callback(new Error('只能为正整数'));
            }
            else if (value * 1 <= this.searchForm['goods_count_min'] * 1) {
                callback(new Error('最大值不能小于等于最小值'));
            } else {
                callback();
            }
        };

        return {
            updateList: [],
            langs: {},
            pipelines: {},
            categorys: [],
            tableData: [],
            isDataLoading: false,
            searchForm: {
                lang: '',
                pipeline_code: '',
                keywords: '',
                url: '',
                goods_count_min: '',
                goods_count_max: '',
                bind_cat_id: [],
                is_show: '',
                page_type: '',
                recommend_type: ''
            },
            pagination: {
                page: 1,
                size: 10,
                total: 0
            },
            multipleSelection: [],
            pageTypeText: {
                '0': '分类页',
                '1': '产品页',
                '2': '搜索页',
                '3': '其它页'
            },
            recommendTypeText: {
                '0': '全部',
                '1': '新品',
                '2': '重点',
                '3': '当季'
            },
            prop: {
                label: 'categoryName',
                value: 'id',
                children: 'subCategoryList',
            },
            editDlg: {
                isEdit: false,
                isShow: false,
                isLoading: false,
                keywords: '',
                url: '',
                pipeline_code: '',
                lang: '',
                bind_cat_id: [],
                bind_cat_name: '',
                extend_cat_ids: [],
                is_show: '',
                recommend_type: ''
            },

            addDlg: {
                isDlgShow: false,
                isLoading: false,
                fileList: []
            },

            queryCatlist: [],
            editRules: {
                keywords: [{ required: true, message: '请输入关键词', trigger: 'blur' }],
                url: [{ required: true, message: '请输入url', trigger: 'blur' }],
                pipeline_code: [{ required: true, message: '请选择渠道', trigger: 'change' }],
                lang: [{ required: true, message: '请选择语言', trigger: 'change' }]
            },
            searchRules: {
                goods_count_min: [{ validator: validateRange, trigger: 'blur' }],
                goods_count_max: [{ validator: validateRange2, trigger: 'blur' }]
            },
            catDlg: {
                isShow: false,
                extend_cat_ids: []
            },

            importUrl: this.$store.getters.getRootMenu + '/seo/search-recommend-keyword/import', // 导入推荐词
            downloadUrl: this.$store.getters.getRootMenu + '/seo/search-recommend-keyword/export-template' // 下载模板
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getCommonData();
        this.getListData();
    },
    methods: {
        // 获取公用数据
        async getCommonData () {
            const [pipelines, langs, categorys] = await Promise.all([getPipelines(), getLangsBySite(), getAllCategory()])
            let pipelinesText = {};
            pipelines.forEach((item) => {
                pipelinesText[item.pipeline_code] = item.pipeline_name;
            });
            this.pipelines = pipelinesText;

            let langsText = {};
            langs.forEach((item) => {
                langsText[item.language_en] = item.language_ch
            });
            this.langs = langsText;

            this.categorys = categorys;
        },
        // 获取列表
        async getListData (pageNo) {
            if (typeof pageNo === 'number') {
                this.pagination.page = pageNo;
            }
            let params = Object.assign({}, this.pagination ,this.searchForm);
            delete params.total;

            let len = params.bind_cat_id.length;
            params.bind_cat_id = len > 0 ? params.bind_cat_id[len - 1] : '';

            if (this.isDataLoading) {
                return;
            }
            this.isDataLoading = true;
            const data = await httpGet('seo/search-recommend-keyword/list',  { params });
            this.isDataLoading = false;
            this.tableData = data.list;
            this.pagination.total =  data.total;
        },
        // 页数改变
        changePage(value) {
            this.pagination.page = value;
            this.getListData();
        },
        // 每页显示数改变
        changePageSize(value) {
            this.pagination.size = value;
            this.getListData();
        },
        handleBtnAddClick () {
            this.addDlg.isDlgShow = true;
        },
        // 编辑seo关键词
        handleBtnEditClick(row) {
            row = JSON.parse(JSON.stringify(row))
            delete row.create_time;
            delete row.goods_count;
            delete row.page_type;
            delete row.recently_search_count;
            delete row.update_time;
            if (!row.id) {
                return;
            }
            row.bind_cat_id = this.getBindCatIds(this.categorys, row.bind_cat_id);
            row.extend_cat_ids = row.extend_cat_ids ? row.extend_cat_ids.split(',') : [];
            row.recommend_type = String(row.recommend_type);
            this.editDlg =  Object.assign({}, { isEdit: true, isShow: true }, row);
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(row.extend_cat_ids)
            })
        },
        doCycle(categorys, bind_cat_id, callback) {
            for (let index = 0; index < categorys.length; index++) {
                if(categorys[index].id == bind_cat_id) {
                    callback(categorys[index])
                    break;
                }
                if(categorys[index].subCategoryList.length > 0) {
                    this.doCycle(categorys[index].subCategoryList, bind_cat_id, callback)
                }
            }
        },
        // 获取父级绑定id，遍历树结构
        getBindCatIds(categorys, bind_cat_id) {
            let catParent;
            let cid = bind_cat_id;
            const parents = [];
            if(!bind_cat_id) {
                return []
            }
            do {
                this.doCycle(categorys, cid, (v) => {
                    catParent = v
                });
                if (catParent && catParent.parentId) {
                    cid = catParent.parentId; // 父级id
                    let result = this.doCycle(categorys, cid, (v) => {
                        parents.push(v);
                    });
                }
            }
            while (catParent && catParent.parentId);
            let parseArr = parents.reverse().map((item) => {
                return item.id
            });
            parseArr.push(bind_cat_id);
            return parseArr;
        },
        // 删除关键词
        handleBtnDelClick(row) {
            let params = { ids: Array.isArray(row) ? row : [row.id] };
            this.$confirm('确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: async (action, instance, done) => {
                    if (action !== 'confirm') {
                        done();
                        return;
                    }
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    try {
                        // debugger
                        let { code, message }  = await httpPost('seo/search-recommend-keyword/delete', params)
                        instance.confirmButtonLoading = false;
                        done();
                        if(code === 0) {
                            this.$message.success(message || '删除成功');
                            this.getListData();
                        }
                    } catch(e) {
                        instance.confirmButtonLoading = false;
                        return;
                    }
                }
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },
        // 保存修改
        async handleBtnOkClick() {
            let hasError = false;
            let params = Object.assign({}, this.editDlg);
            // console.log(params)
            params.bind_cat_id = params.bind_cat_id[params.bind_cat_id.length - 1];
            this.doCycle(this.categorys, params.bind_cat_id, (v) => {
                params.bind_cat_name = v.categoryName
            });
            params.extend_cat_ids = this.$refs.tree.getCheckedKeys().join(',');
            this.$refs['editForm'].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    hasError = true;
                    return false;
                }
            });
            if (hasError) {
                return;
            }
            if (!params.isEdit) {
                delete params.id;
            }
            delete params.isLoading;
            delete params.isShow;
            delete params.isEdit;
            this.editDlg.isLoading = true;
            try {
                let { code, message ,data } = await httpPost('seo/search-recommend-keyword/edit', params)
                if(code === 0) {
                this.$message.success(message);
                this.editDlg.isLoading = false;
                this.editDlg.isShow = false;
                this.editDlg.isEdit = false;
                this.getListData();
                }
            } catch(e) {
                this.editDlg.isLoading = false;
            }
        },
        // 取消筛选
        handleBtnCancelFilterClick() {
            this.$refs['searchForm'].resetFields();
        },
        // 多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 帅选
        handleBtnSearchFilterClick() {
            this.$refs['searchForm'].validate((valid) => {
                if (!valid) {
                    console.log('error submit!!');
                    return false;
                }
                this.getListData(1);
            });
        },
        // 批量操作
        async batchChange(type, value) {
            let ids = this.multipleSelection.map((item) => {
                return item.id
            })
            switch(type) {
                case 'delete':
                    this.handleBtnDelClick(ids)
                break;
                case 'is_show':
                case 'recommend_type':
                case 'extend_cat_ids':
                    try {
                        let { code, message ,data } = await httpPost('seo/search-recommend-keyword/batch-edit', { ids: ids.join(','), field: type, value: value  });
                        this.$message.success(message);
                        this.getListData();
                    } catch(e) {}
                break;
            }
        },
        // 选择
        handleSelectedClick() {
            this.batchChange('extend_cat_ids', this.$refs.catTree.getCheckedKeys().join(','));
            this.$nextTick(() => {
                this.catDlg.isShow = false;
            })
        },
        // 关闭弹框时，清除节点
        beforeCloseCatDailog(done) {
            this.$refs.catTree.setCheckedKeys([]);
            this.$nextTick(() => {
                done();
            })
        },
        // 上传
        submitUpload() {
            this.$refs.upload.submit();
        },
        // 上传前钩子
        beforeUpdate() {
            this.addDlg.isLoading = true;
        },
        // 上传成功
        handleUploadSuccess(response, file, fileList) {
            // console.log(file)
            this.addDlg.isLoading = false;
            if (response.code === 0) {
                this.$message.success('导入成功');
                this.$refs.upload.clearFiles();
                this.addDlg.isDlgShow = false;
                this.getListData();
            } else {
                this.$refs.upload.clearFiles();
                this.$message.error(response.message || `${file.name}导入失败`)
            }
        },
        // 上传失败
        handleUpdateError(err, file, fileList) {
            // console.log(file)
            this.addDlg.isLoading = false;
            this.$message.error(`${file.name}导入失败`)
        }
    }
}
</script>

<style lang="less">
.clearfix:after { display: block; clear: both; height: 0; content: " "; }
.el-table {
    th > .cell { padding: 7px 5px; line-height: 16px; }
    td > .cell { padding-right: 5px; padding-left: 5px; }
    &.text-center th { text-align: center; }
}
// .el-form--inline {
//     .el-input { width: auto; }
// }
.el-autocomplete > .el-input { width: 100% !important; }
.edit-dlg {
    .el-input, .el-select { width: auto; }
}
.add-dlg {
    ul { list-style: none; }
}
.el-tree-seo{
    height: 300px;
    overflow-y: auto;
}
.el-form {
    .w-100 { width: 100px; }
    .w-150 { width: 150px; }
    .w-250 { width: 250px; }
    .w-300 { width: 300px; }
    .range-form-item{
        margin-right: 0
    }
}
</style>
