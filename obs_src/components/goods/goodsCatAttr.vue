<!-- 站点分类编辑 -->
<template>
    <div class="good-cat-attr" @click="closeTree($event)">
        <div class="el-container">
            <el-form inline ref="commonOption" :model="commonOption">
                <el-form-item label="商品分类:" prop="categoryId">
                    <el-cascader filterable clearable v-model="commonOption.cateList" class="cat-tree" :options="catTree" change-on-select :props="prop" @change="changeCatList"></el-cascader>
                </el-form-item>
                <el-button type="primary" icon="search" @click="queryProperties">查询</el-button>
                <div>
                    <el-form-item label="属性查询">
                        <el-select v-model="active" @change="changeActive">
                            <el-option :value="1" label="PDM描述属性"></el-option>
                            <el-option :value="2" label="PDM规格属性"></el-option>
                            <el-option :value="3" label="网站自定义属性"></el-option>
                        </el-select>
                    </el-form-item>
                    <template v-if="active === 1">
                        <el-form-item class="accessory-tree-item">
                            <el-input v-model="checkedPdmCatNames" @click.native="changeTreeFlag" class="js_input" readonly placeholder="点此选择分类"></el-input>
                            <el-input v-show="treeFlag" class="search js_input" placeholder="请输入关键词过滤" v-model="filterText"></el-input>
                            <el-tree v-show="treeFlag" :data="pdmTopCats" accordion :props="pdmProps" ref="pdmTree" node-key="id" @node-click="changeTree" :filter-node-method=" filterNode" :load="loadPdmNode" lazy :expand-on-click-node="false" placeholder="请选择PDM分类"></el-tree>
                        </el-form-item>
                        <el-button type="primary" :loading="catLoading" icon="search" @click="getPdmCatAttr">查找属性</el-button>
                        <el-button type="danger" icon="close" @click="resetChecked">重选</el-button>
                    </template>
                </div>
            </el-form>
            <!-- 描述属性 -->
            <div v-if="active === 1">
                <el-row>
                    <el-col :span="2">可选属性</el-col>
                    <el-col :span="12">
                        <el-form inline>
                            <el-form-item>
                                <el-input v-model="pdmAttr" placeholder="搜索PDM属性"></el-input>
                            </el-form-item>
                            <el-button type="primary" @click="getPdmCatAttr">查询属性</el-button>
                            <el-table :data="searchedPdmAttrs" border>
                                <el-table-column prop="pdmAttrName" label="属性"></el-table-column>
                                <el-table-column label="属性类型">
                                    <template scope="scope">
                                        <span>PDM描述属性</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template scope="scope">
                                        <el-button type="primary" size="small" @click="seachEdit(scope.row)">添加</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="el-sub-container text-right">
                                <el-pagination @size-change="ChangePageSize_type1" @current-change="ChangePage_type1" :current-page="searchType.pageNo" :page-sizes="[10, 20, 50]" :page-size="searchType.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchType.total"></el-pagination>
                            </div>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <!-- 规格属性 -->
            <div v-if="active === 2">
                <el-row>
                    <el-col :span="2">选择属性</el-col>
                    <el-col :span="12">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-input v-model.trim="attributeParams.specAttrNameList" placeholder="属性名称,多个以','号隔开"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="search" @click="attribute">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" icon="close" @click="reset">重置</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table :data="attributeList" style="width: 100%" border>
                            <el-table-column prop="attrName" label="属性名称"></el-table-column>
                            <el-table-column label="属性类型">
                            <template scope="scope">
                                    <span>PDM规格属性</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" type="primary" icon="plus" @click="openAddToSiteCat(scope.row)">添加至站点分类</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="text-right el-sub-container">
                            <el-pagination @size-change="ChangePageSize_1" @current-change="ChangePage_1" :page-sizes="[10,20,50]" :page-size="attributeParams.pageSize" :current-page="attributeParams.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 自定义属性 -->
            <div v-if="active === 3">
                <el-row>
                    <el-col :span="2">自定义属性</el-col>
                    <el-col :span="13">
                        <el-row>
                            <el-table :data="customAttrTableData" ref="customAttrTableData" border>
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
                                        <el-button size="small" type="primary" icon="plus" @click="addToSiteCatInCustom(scope.row)">添加至分类</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="text-right el-sub-container">
                                <el-pagination  @size-change="customSize" @current-change="customPage" :page-sizes="[10,20,50]" :page-size="customOpt.pageSize" :current-page="customOpt.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="customOpt.total">
                                </el-pagination>
                            </div>
                        </el-row>
                    </el-col>
                </el-row>
            </div>

            <div class="separator"></div>
            <el-row>
                <el-col :span="2">站点分类所有属性</el-col>
                <el-col :span="18">
                    <el-table :data="fullAttrTableData" style="width: 100%" border>
                        <el-table-column prop="attrName" label="属性名称"></el-table-column>
                        <el-table-column prop="aliasAttrName" label="属性别名"></el-table-column>
                        <el-table-column prop="attrSort" label="排序"></el-table-column>
                        <el-table-column prop="valueStr" label="属性值(多个值以||隔开并且括号内为别名)"></el-table-column>
                        <el-table-column label="属性类型">
                            <template scope="scope">
                                <span v-if="scope.row.type == 1">pdm描述属性</span>
                                <span v-if="scope.row.type == 2">pdm规格属性</span>
                                <span v-if="scope.row.type == 3">自定义属性</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button v-if="self.showAction_('goods/category-attribute/attr-val-bind-update')" size="small" type="primary" icon="edit" @click="openUpdateAttrInFull(scope.row,scope.$index)">编辑属性值</el-button>
                                <el-button v-if="self.showAction_('goods/category-attribute/delete-attr-val-bind')" size="small" type="danger" icon="close" @click="deleteAttrInFull(scope.row, scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="el-sub-container text-right">
                        <el-pagination @size-change="ChangeCatPageSize" @current-change="ChangeCatPage" :current-page="catPage.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="catPage.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="catPage.total"></el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- PDM描述属性-表内添加至分类操作 -->
        <el-dialog title="PDM描述属性添加" :visible.sync="searchDialog.show" size="small">
            <el-form :inline="true" :model="searchDialog" ref="desForm">
                <el-form-item label="属性名称:">
                    <el-col>{{searchDialog.pdmAttrName}}</el-col>
                </el-form-item>
                <br />
                <el-form-item label="排序:" prop="attrSort" :rules="[{validator: checkOrder}, {required: true, message: '该项不能为空'}]">
                    <el-input v-model.trim="searchDialog.attrSort"></el-input>
                </el-form-item>
                <br />
                <el-form-item label="属性值:">
                    <el-input v-model.trim="searchDialog.pdmAttrValueName" placeholder="属性值,多个以','号隔开"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="seachEdit(searchDialog, true)">搜索</el-button>
                    <el-button type="danger" @click="resetPdmSearch">重置</el-button>
                </el-form-item>
                <el-table :data="searchDialog.data" height="240" border @selection-change="selectSearch" ref="searchDialogTable">
                    <el-table-column prop="attrValue" label="属性值"></el-table-column>
                    <el-table-column label="排序">
                        <template scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.attrValueSort'" :rules="[{validator: checkOrder}, {required: true, message: '该项不能为空'}]">
                                <el-input v-model="scope.row.attrValueSort"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection"></el-table-column>
                </el-table>
            </el-form>
            <div class="text-right el-sub-container">
                <el-pagination @size-change="changeDialogSize" @current-change="changeDialogPage" :page-sizes="[10,20,50]" :page-size="searchDialog.pageSize" :current-page="searchDialog.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="searchDialog.total"></el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="self.showAction_('goods/category-attribute/attr-val-bind')" type="primary" icon="plus" @click="addToSearch" v-loading="addLoading" :disabled="addLoading">添加至分类</el-button>
                <el-button @click="searchDialog.show = false">取消</el-button>
            </span>
        </el-dialog>

        <!-- 规格属性 表内添加至站点分类 -->
        <el-dialog title="选择添加项" :visible.sync="dialogColorTableVisible" size="small">
            <el-form :inline="true" :model="sizeForm" ref="sizeForm">
                <el-form-item label="属性名称:">
                    <el-col>{{this.attrName}}</el-col>
                </el-form-item>
                <br />
                <el-form-item label="排序:" prop="typeOrder" :rules="[{validator: checkOrder}, {required: true, message: '该项不能为空'}]">
                    <el-input v-model.trim="sizeForm.typeOrder"></el-input>
                </el-form-item>
                <div>
                    <el-form-item label="属性值：">
                        <el-input v-model.trim="colorSearchForm" placeholder="属性值,多个以','号隔开"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="search" @click="searchSiteVal">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" icon="close" @click="SiteValReast">重置</el-button>
                    </el-form-item>
                </div>
                <el-table :data="sizeForm.attrKeyList" height="240" border @selection-change="multipleSelectionChange_1" ref="attrKeyList">
                    <el-table-column prop="attrValue" label="属性值"></el-table-column>
                    <el-table-column label="排序">
                        <template scope="scope">
                            <el-form-item :prop="'attrKeyList.' + scope.$index + '.attrValueSort'" :rules="[{validator: checkOrder}, {required: true, message: '该项不能为空'}]">
                                <el-input v-model="scope.row.attrValueSort" :disabled="!scope.row.lock"></el-input>

                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection"></el-table-column>
                </el-table>
            </el-form>
            <el-pagination style="float: left; margin-top: 10px;" @size-change="ChangePageSize" @current-change="ChangePage" :page-sizes="[10,20,50]" :page-size="paramsSiteCat.pageSize" :current-page="paramsSiteCat.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total_1">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="self.showAction_('goods/category-attribute/attr-val-bind')" type="primary" icon="plus" @click="addColorToSiteCat" :disabled="addLoading" v-loading="addLoading">添加至站点分类</el-button>
                <el-button @click="dialogColorTableVisible = false">取消</el-button>
            </span>
        </el-dialog>

        <!-- 自定义属性-表内添加至分类操作 -->
        <el-dialog title="选择添加项" :visible.sync="dialogCustomTableVisible" size="small">
            <el-form :inline="true">
                <el-form-item label="属性名称:">
                    <el-col>{{this.addName}}</el-col>
                </el-form-item>
                <br />
                <el-form-item label="搜索属性值:">
                    <el-input v-model.trim="customSearchForm" placeholder="属性值,多个以','号隔开" @input="customSearch"></el-input>
                </el-form-item>
            </el-form>
            <el-table :data="customTableList" height="240" border @row-click="handleCurrentChange" @selection-change="multipleSelectionChange" ref="customTableList">
                <el-table-column prop="attrValue" label="属性值"></el-table-column>
                <el-table-column type="selection">
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="self.showAction_('goods/category-attribute/attr-val-bind')" type="primary" icon="plus" @click="addCustomToSiteCat" :disabled="addLoading" v-loading="addLoading">添加至站点分类</el-button>
                <el-button @click="dialogCustomTableVisible = false">取消</el-button>
            </span>
        </el-dialog>

        <!-- 分类表内编辑操作 -->
        <el-dialog title="设置属性别名" :visible.sync="dialogUpdateAttrInFullVisible">
            <el-form :label-position="labelPosition" label-width="90px">
                <el-row>
                    <el-form-item label="属性名称:">
                        <el-col>
                            <span>{{this.attrName}}</span>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="切换语言:">
                        <el-col :span="4">
                            <el-select placeholder="请选择语言" clearable v-model="setForm.lang" @change="changeLang">
                                <el-option v-for="item in langOpt" :key="item.language_en" :label="item.language_ch" :value="item.language_en">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="属性别名:" v-if="this.active == 2|| this.active == 1">
                        <el-col :span="4">
                            <el-input v-model.trim="toBeUpdatedAttrInFull.aliasAttrName" placeholder="属性别名"></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="属性排序:">
                        <el-col :span="5">
                            <el-input placeholder="排序值" v-model.trim="attrSort"></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="搜索属性值:">
                        <el-col :span="7">
                            <el-input placeholder="搜索属性值" v-model.trim="customAttr" @input="searchAttr"></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
            </el-form>
            <el-row>
                <el-table :data="toBeUpdatedAttrInFull.valueList" height="240" width="100%" border ref="table_1">
                    <el-table-column prop="attrValue" label="属性值"></el-table-column>
                    <el-table-column label="属性值别名" v-if="this.active == 1 || this.active == 2">
                        <template scope="scope">
                            <el-input v-model.trim="scope.row.aliasAttrValue"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序">
                        <template scope="scope">
                            <el-input v-model.trim="scope.row.attrValueSort"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="前端呈现">
                        <template scope="scope">
                            <el-checkbox v-model="scope.row.status" :true-label="1" :false-label="2">
                                <span v-if="scope.row.status== 1">显示</span>
                                <span v-else>不显示</span>
                            </el-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <div class="separator"></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitInFull" v-loading="editLoading" :disabled="editLoading">确认</el-button>
                <el-button @click="dialogUpdateAttrInFullVisible = false">取消</el-button>
            </span>
        </el-dialog>

        <!-- 自定义属性-表内编辑操作 -->
        <!-- <el-dialog title="自定义属性" :visible.sync="dialogUpdateAttrInCustomVisible" size="tiny">
            <el-form ref="toBeUpdatedAttrInCustom" :model="toBeUpdatedAttrInCustom" label-width="80px">

                <el-form-item label="切换语言">
                    <el-select placeholder="请选择语言" @change="changeCustomLang" @visible-change="changeCustomLang_1" v-model="setForm.lang" :disabled="isShow_3">
                        <el-option v-for="item in langOpt" :key="item.language_en" :label="item.language_ch" :value="item.language_en">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="属性名称" prop="searchAttrName" :rules="customerRule()">
                    <el-input v-model="toBeUpdatedAttrInCustom.searchAttrName"></el-input>
                </el-form-item>
                <span v-if="isShow">
                    <el-form-item v-for="(item, index) in toBeUpdatedAttrInCustom.valueResp" :key="index" label="属性值" :prop="'valueResp.' + index + '.attrValue'" :rules="customerRule()">
                        <el-row>
                            <el-col :span="15">
                                <el-input v-model.trim="item.attrValue"></el-input>
                            </el-col>
                            <el-col :span="4" :offset="1" v-if="setForm.lang=='en'||addType == 'add'">
                                <el-button type="success" @click="addRowInCustom(item.type)"><i class="el-icon-plus"></i></el-button>
                            </el-col>
                            <el-col :span="4" v-if="setForm.lang=='en'||addType == 'add'">
                                <el-button type="danger" @click="removeRowInCustom(item.attrValueKey, index)"><i class="el-icon-minus"></i></el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </span>
                <span v-if="isShow_1">
                    <el-form-item v-for="(item, index) in toBeUpdatedAttrInCustom.valueResp" :key="index" label="属性值" :rules="customerAttrRule()" :prop="'toBeUpdatedAttrInCustom.valueResp'[index]" :required="setForm.lang == firstLang">
                        <el-row>
                            <el-col :span="6">
                                    <el-input v-model.trim="item.begin"></el-input>
                            </el-col>
                            <el-col :span="1" :offset="1">-</el-col>
                            <el-col :span="6">
                                    <el-input v-model.trim="item.end"></el-input>
                            </el-col>
                            <el-col :span="4" :offset="1" v-if="setForm.lang=='en'||addType == 'add'">
                                <el-button type="success" @click="addRowInCustom(item.type)"><i class="el-icon-plus"></i></el-button>
                            </el-col>
                            <el-col :span="4" v-if="setForm.lang=='en'||addType == 'add'">
                                <el-button type="danger" @click="removeRowInCustom(item.attrValueKey, index)"><i class="el-icon-minus"></i></el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </span>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitInCustom('toBeUpdatedAttrInCustom')">确认</el-button>
                <el-button @click="dialogUpdateAttrInCustomVisible = false">取消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
    export default {
        data() {
            let rule = (rule, value, callback) => {
                let attrValue = this.toBeUpdatedAttrInCustom.valueResp;
                let attrName = this.toBeUpdatedAttrInCustom.searchAttrName;
                let flag = true;
                let type = 'area'
                let keys = Object.keys(attrValue[0]);

                if (keys.indexOf('attrValue') !== -1) {
                    type = 'static'
                }

                if (attrName) {
                    if (type == 'area') {
                        for (let i in attrValue) {
                            let item = attrValue[i];
                            if (!Boolean(item.begin) || !Boolean(item.end)) {
                                flag = false;
                                break;
                            }
                        }
                    } else {
                        for (let i in attrValue) {
                            let item = attrValue[i];
                            if (!Boolean(item.attrValue)) {
                                flag = false;
                                break;
                            }
                        }
                    }
                } else {
                    if (type == 'area') {
                        for (let i in attrValue) {
                            let item = attrValue[i];
                            if (Boolean(item.begin) || Boolean(item.end)) {
                                flag = false;
                                break;
                            }
                        }
                    } else {
                        for (let i in attrValue) {
                            let item = attrValue[i];
                            if (Boolean(item.attrValue)) {
                                flag = false;
                                break;
                            }
                        }
                    }
                }
                if (flag) {
                    callback();
                } else {
                    callback(new Error('属性名称和值需全为空或全填写'));
                }
            };

            let requiredRule = (rule, value, callback) => {
                let attrValue = this.toBeUpdatedAttrInCustom.valueResp;
                let attrName = this.toBeUpdatedAttrInCustom.searchAttrName;
                let flag = true;
                let type = 'area'
                let keys = Object.keys(attrValue[0]);

                if (keys.indexOf('attrValue') !== -1) {
                    type = 'static'
                }

                if (!attrName) {
                    callback(new Error('不能为空'));
                }

                if (type == 'area') {
                    for (let i in attrValue) {
                        let item = attrValue[i];
                        if (!Boolean(item.begin) || !Boolean(item.end)) {
                            flag = false;
                            break;
                        }
                    }
                } else {
                    for (let i in attrValue) {
                        let item = attrValue[i];
                        if (!Boolean(item.attrValue)) {
                            flag = false;
                            break;
                        }
                    }
                }

                if (flag) {
                    callback();
                } else {
                    callback(new Error('不能为空'));
                }
            }

            let customerRule = () => {
                if (this.setForm.lang == this.firstLang) {
                    return [{
                        required: true,
                        message: '不能为空'
                    }]
                }

                return [{
                    validator: rule,
                    trigger: 'blur'
                }]
            }

            let customerAttrRule = () => {
                if (this.setForm.lang == this.firstLang) {
                    return [{
                        validator: requiredRule,
                        trigger: 'blur'
                    }]
                }

                return [{
                    validator: rule,
                    trigger: 'blur'
                }]
            }

            let checkOrder = (rule, val, callback) => {
                if (Number.isInteger(val * 1) && val * 1 >= 0) {
                    callback();
                } else {
                    callback(new Error('排序为大于等于0的整数'))
                }
            }

            return {
                self: this,
                customOpt: {
                    pageNo: 1,
                    pageSize: 20,
                    total: 1,
                },
                searchType: {
                    pageNo: 1,
                    pageSize: 20,
                    total: 0,
                },
                searchDialog: {
                    select: [],
                    pdmAttrName: '',
                    pdmAttrId: null,
                    show: false,
                    pdmAttrValueName: '',
                    pageNo: 1,
                    pageSize: 20,
                    total: 1,
                    data: [],
                    attrSort: '',
                },
                // tree
                treeFlag: false,
                // 切换显示
                active: 1,
                // 自定义属性 校验方法
                checkOrder: checkOrder,
                customerRule: customerRule,
                customerAttrRule: customerAttrRule,
                firstLang: 'en',
                changeLangFlag: false,
                //
                tempAttrName: {},
                langList: {},
                lastParams: [],
                labelPosition: 'right',
                activeName: 'first',
                value: '',
                type: "",
                sort: '',
                filterText: '',
                checkedPdmCatNames: '',
                filterPdm: '',
                attrName: '',
                addName: '',
                attrKey: '',
                customAttrKey: '',
                customTableListAttrKey: '',
                attrValueKeyList: [],
                customAttrParams: '',
                attrKeyId: '',
                addType: '',
                editLang: '',
                customAttrLen: [],
                customParams: {},
                colorSearchForm: '',
                pdmAttrId: '',
                attrSort: '',
                attrSource: '',
                customAttr: '',
                attrName: '',
                pdmAttr: '',
                customSearchForm: '',
                checked: '1',
                total: 1,
                total_1: 1,
                typeInCustom: '1',
                selectedIndex: 0,
                add: {
                    radio2: 3,
                },
                //
                commonOption: {
                    // gabalNara: {

                    // },
                    // proCate: [''],
                    cateList: [],
                    categoryId: ''
                },
                catTree: [],
                prop: {
                    label: 'categoryName',
                    value: 'id',
                    children: 'subCategoryList',
                },
                //

                sizesParams: {
                    pageNo: 1,
                    pageSize: 10
                },
                attributeParams: {
                    pageNo: 1,
                    pageSize: 10,
                    lang: 'en'
                },
                paramsSiteCat: {
                    pageNo: 1,
                    pageSize: 10,
                    lang: 'en'
                },
                total: 1,
                isShow: false,
                isShow_1: false,
                isShow_2: false,
                isShow_3: false,
                catLoading: false,
                showPdmTree: false,
                attributeName: true,
                dialogSizeTableVisible: false,
                dialogSizeTableVisible: false,
                dialogColorTableVisible: false,
                dialogCustomTableVisible: false,
                dialogUpdateAttrInFullVisible: false,
                // dialogUpdateAttrInCustomVisible: false,
                multipleSelection: [],
                multipleSelection_1: [],
                colorItem: [],
                attributeList: [],
                description: [],
                description_1: [],
                description_2: [],
                checkedPdmCatIds: '',
                searchedPdmAttrs: [],
                checkedPdmAttrs: [],
                customAttrTableData: [],
                customAttrTableData_1: [],
                fullAttrTableData: [],
                customTableList: [],
                customTableList_1: [],
                langOpt: [],
                selectionsInCustom: [],
                pdmTopCats: [],
                setForm: {
                    lang: 'en'
                },

                //
                addLoading: false,
                editLoading: false,
                sizeForm: {
                    typeOrder: '0',
                    attrKeyList: [],
                },
                //
                toBeUpdatedAttrInFull: {
                    valueList: []
                },
                toBeUpdatedAttrInCustom: {
                    valueResp: []
                },
                pdmProps: {
                    label: 'name'
                },
                catName: this.$route.query.catName,
                checkType: '',
                // page
                catPage: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 1,
                }
            }
        },

        watch: {
            filterText(val) {
                this.$refs.pdmTree.filter(val);
            }
        },

        created() {
            this.getOpt();
            this.getBootCat();
        },

        methods: {
            // 分类修改
            changeCatList(val) {
                this.commonOption.categoryId = val[val.length - 1];
            },
            // 更改属性类型
            changeActive (val) {
                if (val === 2) {
                    this.attribute();
                }
                if (val === 3) {
                    this.queryCustomAttr();
                }
            },
            // pdm描述属性相关方法
            resetPdmSearch() {
                this.searchDialog.pdmAttrValueName = '';
                this.seachEdit(this.searchDialog);
            },
            async seachEdit (row, search) {
                if (!this.commonOption.categoryId) {
                    this.$message.error('分类不能为空')
                    return;
                }
                let params = {};
                params.attrKey = row.pdmAttrId;
                params.attrSort = row.attrSort;
                params.type = 1;
                params.pdmCategoryCodeList = [this.checkedPdmCatIds];
                params.pageNo = this.searchDialog.pageNo;
                params.pageSize = this.searchDialog.pageSize;
                if (search) {
                    params.attrValueList = this.searchDialog.pdmAttrValueName.split(',');
                }

                this.searchDialog.loading = true;
                // 可选属性 搜索交互
                try {
                    const res = await this.httpGet_('goods/category-attribute/attr-val-list', {params: params});
                    this.searchDialog.attrSort = '0';
                    this.searchDialog.pdmAttrName = row.pdmAttrName;
                    this.searchDialog.pdmAttrId = row.pdmAttrId;
                    this.searchDialog.total = res.totalCount;
                    res.list.forEach(item => {
                        item.attrValueSort = '0';
                    });
                    this.searchDialog.data = res.list;

                    this.searchDialog.show = true;
                } finally {
                    this.searchDialog.loading = false;
                }
            },
            selectSearch (val) {
                this.searchDialog.select = val;
            },
            changeDialogSize (val) {
                this.searchDialog.pageSize = val;
                this.seachEdit(this.searchDialog);
            },
            changeDialogPage (val) {
                this.searchDialog.pageNo = val;
                this.seachEdit(this.searchDialog);
            },

            // pdm描述属性绑定
            addToSearch () {
                this.$refs.desForm.validate(async valid => {
                    if (valid) {
                        let params = {},
                            temp = [];
                        this.searchDialog.select.forEach(item => {
                            temp.push({
                                attrValueKey: item.attrValueKey,
                                attrValueSort: item.attrValueSort
                            });
                        });

                        params.attrValueList = temp;
                        params.categoryId = this.commonOption.categoryId;
                        params.attrSort = this.searchDialog.attrSort;
                        params.attrKey = this.searchDialog.pdmAttrId;
                        params.type = 1;

                        this.addLoading = true;
                        try {
                            const data = await this.httpPost_('goods/category-attribute/attr-val-bind', params);
                            this.$message.success(data.message);
                            this.searchDialog.show = false;
                        } finally {
                            this.addLoading = false;
                        }
                    }
                });
            },
            ChangePage_type1 (val) {
                this.searchType.pageNo = val;
                this.getPdmCatAttr();
            },
            ChangePageSize_type1 (val) {
                this.searchType.pageSize = val;
                this.getPdmCatAttr();
            },
            //
            async getOpt() {
                const data = await this.httpGet_('admin/public/languages');
                this.langOpt = data;
                this.firstLang = this.langOpt[0].language_en;
            },

            resetChecked() {
                this.checkedPdmCatNames = '';
                this.checkedPdmCatIds = '';
            },
            filterNode(value, data) {
                if(!value) return true;
                return data.name.toUpperCase().indexOf(value.toUpperCase()) !== -1;
            },

            searchAttr(v) {
                var searchList = [];
                var searchList_1 = [];
                var searchList_2 = [];
                var val = v.toLowerCase().trim();

                let type = this.checkType;
                // type 1描述 2规格 3自定义
                if(val) {
                    if (type == 2) {
                        this.description.forEach((el) => {
                            if(el.attrValue.toLowerCase().trim().indexOf(val) > -1) {
                                searchList.push(el)
                            }
                        });
                        this.toBeUpdatedAttrInFull.valueList = searchList;
                    } else if(type == 3) {
                        this.description_1.forEach((el) => {
                            if(el.attrValue.toLowerCase().trim().indexOf(val) > -1) {
                                searchList_1.push(el)
                            }
                        });
                        this.toBeUpdatedAttrInFull.valueList = searchList_1;
                    } else {
                        this.description_2.forEach((el) => {
                            if(el.attrValue.toLowerCase().trim().indexOf(val) > -1) {
                                searchList_2.push(el)
                            }
                        });
                        this.toBeUpdatedAttrInFull.valueList = searchList_2;
                    }
                    
                    // if(this.active == 2) {
                    //     this.toBeUpdatedAttrInFull.valueList = searchList
                    // } else if(this.active == 1) {
                    //     this.toBeUpdatedAttrInFull.valueList = searchList_2
                    // } else {
                    //     this.toBeUpdatedAttrInFull.valueList = searchList_1
                    // }
                } else {
                    if(type == 2) {
                        this.toBeUpdatedAttrInFull.valueList = this.description
                    } else if(type == 1) {
                        this.toBeUpdatedAttrInFull.valueList = this.description_2
                    } else {
                        this.toBeUpdatedAttrInFull.valueList = this.description_1
                    }
                }
            },
            customSearch(k) {
                var searchedCustomAttrList = [];
                var val = k.toLocaleLowerCase().trim();
                if(val) {
                    this.customTableList_1.forEach((el) => {
                        if(el.attrValue.toLocaleLowerCase().trim().indexOf(val) > -1) {
                            searchedCustomAttrList.push(el)
                        }
                    })
                    this.customTableList = searchedCustomAttrList
                } else {
                    this.customTableList = this.customTableList_1
                }
            },

            async getPdmTopCats() {
                const data = await this.httpGet_('goods/category-attribute/pdm-top-cate');
                if(data.pdmTopCategoryRespList != '') {
                    this.pdmTopCats = data;
                }
            },

            async loadPdmNode(node, resolve) {
                if(node.level === 0) {
                    this.getPdmTopCats();
                }

                if(node.data.parent) {
                    const data = await this.httpGet_('goods/category-attribute/pdm-child-cate', {
                        params: {
                            pdmParentCategoryCode: node.data.id
                        }
                    });
                    resolve(data);
                } else {
                    resolve([]);
                }
            },

            // pdm分类选择
            changeTreeFlag () {
                 this.treeFlag = !this.treeFlag;
            },
            changeTree (data, node) {
                this.treeFlag = false;
                this.filterText = '';
                this.checkedPdmCatNames = data.name;
                this.checkedPdmCatIds = data.id;
            },
            closeTree (event) {
                let target = event.target.parentElement._prevClass;
                if (target && target.indexOf('js_input') !== -1) {

                } else {
                    this.treeFlag = false;
                    this.filterText = '';
                }
            },
            //
            handlePdmCheckChange() {
                var ids = [],
                    names = [];

                this.$refs.pdmTree.getCheckedNodes().forEach(function(item) {
                    ids.push(item.id);
                    names.push(item.name);
                });

                this.checkedPdmCatIds = ids;
                this.checkedPdmCatNames = names.join(',');
            },

            handleSelectionChange(selecteds) {
                this.selectionsInCustom = selecteds;
            },

            // 自定义属性相关
            customPage (val) {
                this.customOpt.pageNo = val;
                this.queryCustomAttr();
            },
            customSize (val) {
                this.customOpt.pageSize = val;
                this.queryCustomAttr();
            },
            // 获取自定义属性列表
            async queryCustomAttr() {
                var params = {
                    lang: this.setForm.lang,
                    pageNo: this.customOpt.pageNo,
                    pageSize: this.customOpt.pageSize,
                    type: 3,
                }
                const data = await this.httpGet_('goods/category-attribute/attr-list', {params: params});
                let list = data.list;
                this.customOpt.total = data.totalCount;

                list.forEach(item => {
                    if (item.valueList.length > 0) {
                        item.valueName = item.valueList.join('||');
                    } else {
                        item.valueName == '';
                    }

                })

                this.customAttrTableData = list;
            },

            // 根据分类查询 所有属性
            async queryFullAttr() {
                var params = {
                    categoryId: this.commonOption.categoryId,
                    lang: 'en',
                    pageNo: this.catPage.pageNo,
                    pageSize: this.catPage.pageSize,
                };

                let data = await this.httpGet_('goods/category-attribute/get-attr-by-cat-id', {params: params});
                data.list.forEach(item => {
                    let temp = [];
                    item.attrValueNameList.forEach(attr => {
                        temp.push(attr.attrValue);
                    });
                    item.valueStr = temp.join('||');
                })
                this.fullAttrTableData = data.list;
                this.catPage.total = data.totalCount;
            },

            async changeLang() {
                if(row.attrSource == 2) {
                    var params = {
                        catId: this.commonOption.categoryId,
                        pdmAttrId: this.attrKeyId,
                        lang: this.setForm.lang
                    };
                    let res = await this.httpPost_('goods/category/query-pdm-attr-relation', params);
                    let data = res.data;
                    if(data.pdmAttrValueList != '') {
                        this.description_2 = data.pdmAttrValueList.list;
                        this.toBeUpdatedAttrInFull.valueList = this.description_2;
                        this.sort = data.sort;
                    } else {
                        this.toBeUpdatedAttrInFull.valueList = []
                    }
                } else if(row.attrSource == 3) {
                    var params = {
                        catId: this.commonOption.categoryId,
                        attrKey: this.attrKeyId,
                        lang: this.setForm.lang
                    };
                    let res = await this.httpPost_('goods/category/query-pdm-common-relation', params);
                    let data = res.data;
                    if(data.respList != '') {
                        this.description = data.respList;
                        this.toBeUpdatedAttrInFull.valueList = this.description;
                        this.sort = data.sort;
                    } else {
                        this.toBeUpdatedAttrInFull.valueList = []
                    }
                } else {
                    var params = {
                        catId: this.commonOption.categoryId,
                        attrKey: this.attrKeyId,
                        lang: this.setForm.lang
                    };
                    let res = await this.httpGet_('goods/category/get-category-custom-attr-and-value', {
                        params: params
                    });
                    if(res.customAttrCatRespList.length > 0) {
                        this.description_1 = res.customAttrCatValueRespList;
                        this.sort = res.sort;
                        this.toBeUpdatedAttrInFull.valueList = this.description_1;
                    } else {
                        this.toBeUpdatedAttrInFull.valueList = []
                    }
                }
            },

            // 站点所有属性表内操作
            async openUpdateAttrInFull(row, index) {
                this.attrName = row.attrName;
                this.attrKeyId = row.attrKey;
                // this.attrSort = row.attrSort;
                this.setForm.lang = 'en';
                // this.attrSource = row.attrSource;

                this.checkType = row.type;

                let params = {};
                params.categoryId = this.commonOption.categoryId;
                params.attrKey = row.attrKey;
                params.type = row.type;

                const data = await this.httpGet_('goods/category-attribute/attr-val-bind-info', {params: params});
                this.attrSort = data.attrSort;
                this.toBeUpdatedAttrInFull.aliasAttrName = data.aliasAttrName;
                this.toBeUpdatedAttrInFull.valueList = data.attrValueRelationDetail;
                if (row.type === 3) {
                    this.description_1 = data.attrValueRelationDetail;
                } else if (row.type == 1) {
                    this.description_2 = data.attrValueRelationDetail;
                } else {
                    this.description = data.attrValueRelationDetail;
                }
                this.dialogUpdateAttrInFullVisible = true;
            },

            deleteAttrInFull(row, index) {
                this.$confirm('确认删除?').then(async () => {
                    let params = {
                        categoryId: this.commonOption.categoryId,
                        attrKey: row.attrKey,
                    };
                    params.type = row.type;

                    const data = await this.httpPost_('goods/category-attribute/delete-attr-val-bind', params);
                    this.$message.success(data.message);
                    this.queryFullAttr();
                }).catch(err => {
                    this.$message.info('已取消')
                })
            },

            changeCustomLang() {
                this.changeLangFlag = true;
                var params = {
                    attrKey: this.customAttrKey,
                    lang: this.setForm.lang
                };
                this.$http.get('goods/category/query-attr-value', {
                    params: params
                }).then(res => {
                    this.toBeUpdatedAttrInCustom.searchAttrName = res.body.data.attrName;
                    var valueKeyList = res.body.data.respList || [];
                    if(this.setForm.lang == 'en') {
                        var customValue = [];
                        valueKeyList.forEach((item) => {
                            customValue.push(item.attrValueKey);
                        });
                        this.attrValueKeyList = customValue;
                    };

                    this.toBeUpdatedAttrInCustom.valueResp = [];
                    if(this.type == '1') {
                        if(valueKeyList && valueKeyList.length > 0) {
                            this.toBeUpdatedAttrInCustom.valueResp = valueKeyList;
                            if(this.setForm.lang !== 'en') {
                                if(this.customAttrLen.length > valueKeyList.length) {
                                    var emptyLen = this.customAttrLen.length - valueKeyList.length;
                                    for(var i = 0; i < emptyLen; i++) {
                                        this.toBeUpdatedAttrInCustom.valueResp.push({
                                            attrValue: ''
                                        })
                                    }
                                } else if(this.customAttrLen.length < valueKeyList.length) {
                                    var valueKeyClone = [];
                                    for(var i = 0; i < valueKeyList.length; i++) {
                                        for(var j = 0; j < this.attrValueKeyList.length; j++) {
                                            if(valueKeyList[i].attrValueKey == this.attrValueKeyList[j]) {
                                                valueKeyClone.push({
                                                    attrValue: valueKeyList[i].attrValue,
                                                    attrValueKey: valueKeyList[i].attrValueKey
                                                })
                                            }
                                        }
                                    }
                                    this.toBeUpdatedAttrInCustom.valueResp = valueKeyClone;
                                }
                            }
                        } else {
                            for(var i = 0; i < this.customAttrLen.length; i++) {
                                this.toBeUpdatedAttrInCustom.valueResp.push({
                                    attrValue: ''
                                })
                            }
                        }
                    };

                    if(this.type == '2') {
                        var data = [];
                        if(valueKeyList != '') {
                            valueKeyList.forEach((subitem) => {
                                var temp = subitem.attrValue.split('-');
                                data.push({
                                    begin: temp[0],
                                    end: temp[1],
                                    attrValueKey: subitem.attrValueKey
                                })
                            });
                            this.toBeUpdatedAttrInCustom.valueResp = data;
                            if(this.setForm.lang !== 'en') {
                                if(this.customAttrLen.length > valueKeyList.length) {
                                    var emptyLen = this.customAttrLen.length - valueKeyList.length;
                                    for(var i = 0; i < emptyLen; i++) {
                                        this.toBeUpdatedAttrInCustom.valueResp.push({
                                            begin: '',
                                            end: ''
                                        })
                                    }
                                } else if(this.customAttrLen.length < valueKeyList.length) {
                                    var valueKeyClone = [];
                                    for(var i = 0; i < valueKeyList.length; i++) {
                                        var temp = valueKeyList[i].attrValue.split('-');
                                        for(var j = 0; j < this.attrValueKeyList.length; j++) {
                                            if(valueKeyList[i].attrValueKey == this.attrValueKeyList[j]) {
                                                valueKeyClone.push({
                                                    begin: temp[0],
                                                    end: temp[1],
                                                    attrValueKey: valueKeyList[i].attrValueKey
                                                })
                                            }
                                        }
                                    }
                                    this.toBeUpdatedAttrInCustom.valueResp = valueKeyClone
                                }
                            }
                        } else {
                            for(var i = 0; i < this.customAttrLen.length; i++) {
                                this.toBeUpdatedAttrInCustom.valueResp.push({
                                    begin: '',
                                    end: ''
                                })
                            }
                        }
                    }
                    this.$nextTick(() =>{
                        this.$refs.toBeUpdatedAttrInCustom.$children.forEach(item => {
                            item.validateState = true;
                        });
                    });
                })
            },

            changeCustomLang_1(val) {
                this.editLang = val;
                if(val == true) {
                    this.changeSource();
                }
            },

            changeSource() {
                let obj = {};
                let arr = JSON.parse(JSON.stringify(this.toBeUpdatedAttrInCustom.valueResp));
                let arr_1 = [];
                let customAttrLen = [];
                let flag = this.type;
                arr.forEach((el) => {
                    if(Boolean(el.attrValue) || (Boolean(el.begin) && Boolean(el.end))) {
                        arr_1.push({
                            attrValue: this.type == 1 ? el.attrValue : el.begin + '-' + el.end
                        });
                        customAttrLen.push({
                            attrValue: this.type == 1 ? el.attrValue : el.begin + '-' + el.end,
                            attrValueKey: el.attrValueKey
                        })
                    } else {
                        for(var i = 0; i < this.attrValueKeyList.length; i++) {
                            if(el.attrValueKey == this.attrValueKeyList[i]) {
                                this.attrValueKeyList.splice(i, 1)
                            }
                        };
                    }
                });

                for(let i in arr_1) {
                    let item = arr_1[i];
                    obj[i] = item;
                    obj.length = arr_1.length;
                }
                this.langList[this.setForm.lang] = obj;
                this.tempAttrName[this.setForm.lang] = this.toBeUpdatedAttrInCustom.searchAttrName;
                /*this.customAttrLen = this.toBeUpdatedAttrInCustom.valueResp;*/
                if (this.setForm.lang == this.firstLang) {
                    this.customAttrLen = customAttrLen;
                }
            },

            // 自定义属性 添加到分类弹窗
            async addToSiteCatInCustom(row) {
                if(this.commonOption.categoryId) {
                    this.addName = row.attrName;
                    this.customAttrKey = row.attrKey;

                    var params = {
                        attrKey: row.attrKey,
                        type: 3,
                    };
                    const data = await this.httpGet_('goods/category-attribute/attr-val-list', {
                        params: params
                    });
                    this.customTableList_1 = data.list;
                    this.customTableList = this.customTableList_1;
                    this.dialogCustomTableVisible = true;
                } else {
                    this.$message('请先选择商品分类');
                }
            },

            async batchAddToSiteCatInCustom() {
                let data = this.selectionsInCustom;
                if(data && data.length > 0) {
                    let params = {};
                    params.catId = this.commonOption.categoryId;
                    let temp = [];

                    this.selectionsInCustom.forEach(item => {
                        temp.push(item.id);
                    });
                    params.customAttrIdList = temp;

                    const data = await this.httpPost_('goods/category/add-custom-attr-cate-rlation', {
                        reqList: [params]
                    });
                    this.$message.success(data.message);
                    this.queryFullAttr();
                } else {
                    this.$message.warning('至少选择一项');
                }
            },

            // 规格属性 添加至站点分类
            openAddToSiteCat(row) {
                if(this.commonOption.categoryId) {
                    this.attrName = row.attrName;
                    this.attrKey = row.attrKey;
                    // this.dialogColorTableVisible = true;
                    this.searchSiteCat();
                } else {
                    this.$message('请先选择商品分类');
                }
            },

            async searchSiteCat() {
                let params = {};
                params.attrKey = this.attrKey;
                params.type = 2;

                const data = await this.httpGet_('goods/category-attribute/attr-val-list',
                    {params}
                );
                data.list.forEach(item => {
                    item.attrValueSort = '0';
                });
                this.sizeForm.typeOrder = '0';
                this.sizeForm.attrKeyList = data.list;
                this.total_1 = data.totalCount;
                this.dialogColorTableVisible = true;
            },
            // 规格属性弹窗搜索
            async searchSiteVal() {
                let params = {
                    attrValueList: this.colorSearchForm.split(','),
                };
                params.attrKey = this.attrKey;
                params.type = 2;

                const data = await this.httpGet_('goods/category-attribute/attr-val-list', {
                    params: params
                });
                this.sizeForm.attrKeyList = data.list;
                this.total_1 = data.totalCount;
            },
            // 规格属性添加至站点
            async addColorToSiteCat() {
                if(this.multipleSelection_1 && this.multipleSelection_1.length <= 0) {
                    this.$message.warning('请选择属性值');
                    return;
                };
                this.$refs.sizeForm.validate(async valid => {
                    if (valid) {
                        let valueList = [],
                            checkIds = this.colorItem;
                        this.multipleSelection_1.find((item) => {
                            valueList.push({
                                attrValueKey: item.attrValueKey,
                                attrValueSort: item.attrValueSort
                            })
                        });

                        let params = {
                            categoryId: this.commonOption.categoryId,
                            attrKey: this.attrKey,
                            attrValueList: valueList,
                            attrSort: this.sizeForm.typeOrder,
                            type: 2,
                        };
                        this.addLoading = true;
                        try {
                            const data = await this.httpPost_('goods/category-attribute/attr-val-bind', params);
                            this.$message.success(data.message);
                            this.dialogColorTableVisible = false;
                            this.queryFullAttr();
                        } finally {
                            this.addLoading = false;
                        }

                    }
                })
            },

            // 自定义属性 添加至分类
            async addCustomToSiteCat() {
                if(this.multipleSelection && this.multipleSelection.length <= 0) {
                    this.$message('请选择属性值');
                    return;
                };
                var params = {};
                var attrValueList = [];
                this.multipleSelection.find((item) => {
                    attrValueList.push({
                        attrValueKey: item.attrValueKey,
                        attrValueSort: 999,
                    });
                });

                params.categoryId = this.commonOption.categoryId;
                params.attrSort = 999;
                params.attrKey = this.customAttrKey;
                params.attrValueList = attrValueList;
                params.type = 3;

                this.addLoading = true;
                try {
                    const data = await this.httpPost_('goods/category-attribute/attr-val-bind',
                        params
                    );
                    this.$message.success(data.message);
                    this.dialogCustomTableVisible = false;
                    this.queryFullAttr();
                } finally {
                    this.addLoading = false;
                }
                
            },

            defaultLang() {
                var params = {};
                var attrNameList = [];
                var attrValueList = [];
                var valueLangReqs = [];
                var attrValueName = [];
                var valueNameList = [];
                var attrValueLang = [];
                var type = this.typeInCustom;
                var type_1 = this.type;
                var lang_1 = this.setForm.lang;
                this.toBeUpdatedAttrInCustom.valueResp.forEach(function(item) {
                    attrValueLang.push({
                        attrValue: type_1 == '1' ? item.attrValue : item.begin + '-' + item.end,
                        lang: lang_1
                    })
                });

                for(var i = 0; i < attrValueLang.length; i++) {
                    attrValueName.push([{
                        attrValue: attrValueLang[i].attrValue,
                        lang: attrValueLang[i].lang
                    }])
                };

                for(var i = 0; i < attrValueName.length; i++) {
                    valueNameList.push({
                        valueLangReqs: attrValueName[i],
                    })
                };

                for(var i = 0; i < this.attrValueKeyList.length; i++) {
                    valueNameList[i].attrValueKey = this.attrValueKeyList[i]
                };

                attrNameList.push({
                    attrName: this.toBeUpdatedAttrInCustom.searchAttrName,
                    lang: this.setForm.lang
                });
                params.attrValueList = valueNameList;
                params.attrNameList = attrNameList;
                params.attrKey = this.customAttrKey;
                params.type = this.type;
                this.$http.post('goods/category/custom-edit', {
                    reqList: [params]
                }).then(res => {
                    if(res.body.code === 0) {
                        var existAttrDtos = res.body.data.existAttrDtos;
                        var existAttrValueDtos = res.body.data.existAttrValueDtos;
                        var lang = [];
                        var attrName = [];
                        var lang_1 = [];
                        var attrName_1 = [];
                        if(existAttrDtos.length > 0) {
                            for(var i = 0; i < existAttrDtos.length; i++) {
                                lang.push(existAttrDtos[i].lang);
                                attrName.push(existAttrDtos[i].attrName);
                            };
                            this.$confirm('语言为' + lang + '的' + '(' + attrName + ')' + '属性已存在', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {}).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消'
                                });
                            })
                        } else if(existAttrValueDtos.length > 0) {
                            for(var i = 0; i < existAttrValueDtos.length; i++) {
                                lang_1.push(existAttrValueDtos[i].lang);
                                attrName_1.push(existAttrValueDtos[i].attrValue);
                            };
                            this.$confirm('语言为' + lang_1 + '的' + '(' + attrName_1 + ')' + '属性值不能重复', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {}).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消'
                                });
                            })
                        } else {
                            this.$message.success(res.body.message);
                            this.dialogUpdateAttrInCustomVisible = false;
                            this.queryCustomAttr()
                        }
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            },

            SiteValReast() {
                this.colorSearchForm = '';
                this.paramsSiteCat = {
                    pageNo: 1,
                    pageSize: 10,
                    attrKey: this.attrKey,
                    lang: 'en'
                };
                this.searchSiteCat()
            },

            // addRowInCustom() {
            //     if(this.typeInCustom == 1) {
            //         this.toBeUpdatedAttrInCustom.valueResp.push({
            //             type: 1,
            //             valueResp_1: '',
            //         });
            //     } else if(this.typeInCustom == 2) {
            //         this.toBeUpdatedAttrInCustom.valueResp.push({
            //             type: 2,
            //             begin: '',
            //             end: ''
            //         });
            //     }
            // },

            // removeRowInCustom(attrValueKey, index) {
            //     if(this.toBeUpdatedAttrInCustom.valueResp.length !== 1) {
            //         this.toBeUpdatedAttrInCustom.valueResp.splice(index, 1);
            //         for(var i = 0; i < this.attrValueKeyList.length; i++) {
            //             if(attrValueKey == this.attrValueKeyList[i]) {
            //                 this.attrValueKeyList.splice(i, 1)
            //             }
            //         };
            //     }
            // },

            submitInCustom(toBeUpdatedAttrInCustom) {
                this.$refs[toBeUpdatedAttrInCustom].validate((valid) => {
                    if(valid) {
                        this.tempAttrName[this.setForm.lang] = this.toBeUpdatedAttrInCustom.searchAttrName
                        // type  1 固定值; 2区间值
                        var type = this.typeInCustom;
                        var type_1 = this.type;
                        if(this.addType == 'edit') {
                            var attrNameList = [];
                            var attrValueList = [];
                            var valueLangReqs = [];
                            var attrValueName = [];
                            var lastParams_1 = [];
                            var valueNameList = [];
                            var attrValueLang = [];
                            var obj = {};
                            var lang_1 = this.setForm.lang;
                            var lastParams = this.toBeUpdatedAttrInCustom.valueResp;

                            if(lang_1 == 'en' && !this.changeLangFlag) {
                                this.defaultLang()
                            } else {
                                lastParams.forEach((item) => {
                                    if (Boolean(item.attrValue) || (Boolean(item.begin) && Boolean(item.end))) {
                                        lastParams_1.push({
                                            attrValue: type_1 == 1 ? item.attrValue : item.begin + '-' + item.end
                                        })
                                    }
                                });

                                for(var i in lastParams_1) {
                                    obj[i] = lastParams_1[i];
                                };

                                this.langList[this.setForm.lang] = obj;
                                let length;

                                for(let i in this.langList) {
                                    length = this.langList[i].length;
                                    break;
                                };

                                for(let j = 0; j < length; j++) {
                                    let arr = [];
                                    for(let k in this.langList) {
                                        let item = this.langList[k];
                                        if (item[j]) {
                                            if(typeof item[j].attrValue == 'undefined') {
                                                this.$message('默认语言不能为空');
                                                return
                                            } else {
                                                item[j].lang = k;
                                                arr.push(item[j])
                                            }
                                        }
                                    }
                                    attrValueName.push(arr);
                                };

                                for(var i = 0; i < attrValueName.length; i++) {
                                    attrValueList.push({
                                        valueLangReqs: attrValueName[i]
                                    })
                                };
                                this.tempAttrName[this.setForm.lang] = this.toBeUpdatedAttrInCustom.searchAttrName;
                                for(var i in this.tempAttrName) {
                                    attrNameList.push({
                                        attrName: this.tempAttrName[i],
                                        lang: i
                                    })
                                };
                                if(attrValueList.length != 0) {
                                    for(var i = 0; i < this.attrValueKeyList.length; i++) {
                                        attrValueList[i].attrValueKey = this.attrValueKeyList[i]
                                    }
                                };
                                this.customParams.attrValueList = attrValueList;
                                this.customParams.attrNameList = attrNameList;
                                this.customParams.attrKey = this.customAttrKey;
                                this.customParams.type = this.type;
                                //
                                let delList = [];
                                let remainList = [];
                                let remainValue;
                                this.customParams.attrNameList.forEach(nameValue => {
                                    if (nameValue.attrName == '') {
                                        delList.push(nameValue.lang);
                                    } else {
                                        remainList.push(nameValue);
                                    }
                                });
                                this.customParams.attrNameList = remainList;

                                this.customParams.attrValueList.forEach(langReqs => {
                                    remainValue = [];
                                    langReqs.valueLangReqs.forEach(attr => {
                                        if (attr.attrValue == '-' || attr.attrValue == '') {
                                        } else {
                                            remainValue.push(attr);
                                        }
                                    });
                                    langReqs.valueLangReqs = remainValue;
                                });

                                this.$http.post('goods/category/custom-edit', {
                                    reqList: [this.customParams]
                                }).then(res => {
                                    if(res.body.code === 0) {
                                        var existAttrDtos = res.body.data.existAttrDtos;
                                        var existAttrValueDtos = res.body.data.existAttrValueDtos;
                                        var lang = [];
                                        var attrName = [];
                                        var lang_1 = [];
                                        var attrName_1 = [];
                                        if(existAttrDtos.length > 0) {
                                            for(var i = 0; i < existAttrDtos.length; i++) {
                                                lang.push(existAttrDtos[i].lang);
                                                attrName.push(existAttrDtos[i].attrName);
                                            };
                                            this.$confirm('语言为' + lang + '的' + '(' + attrName + ')' + '属性已存在', '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                            }).then(() => {}).catch(() => {
                                                this.$message({
                                                    type: 'info',
                                                    message: '已取消'
                                                });
                                            })
                                        } else if(existAttrValueDtos.length > 0) {
                                            for(var i = 0; i < existAttrValueDtos.length; i++) {
                                                lang_1.push(existAttrValueDtos[i].lang);
                                                attrName_1.push(existAttrValueDtos[i].attrValue);
                                            };
                                            this.$confirm('语言为' + lang_1 + '的' + '(' + attrName_1 + ')' + '属性值不能重复', '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                            }).then(() => {}).catch(() => {
                                                this.$message({
                                                    type: 'info',
                                                    message: '已取消'
                                                });
                                            })
                                        } else {
                                            this.$message.success(res.body.message);
                                            this.dialogUpdateAttrInCustomVisible = false;
                                            this.queryCustomAttr()
                                        }

                                    } else {
                                        this.$message.error(res.body.message);
                                    }
                                })
                            }
                        } else if(this.addType == 'add') {
                            var params = {};
                            var attrNameList = [];
                            var attrValueList = [];
                            var attrValueLangList = [];
                            var attrValueLang = [];
                            var attrValueName = [];
                            var arrtNameList = [];

                            var lang = '';
                            var lang_1 = this.setForm.lang;
                            this.toBeUpdatedAttrInCustom.valueResp.forEach((item) => {
                                attrValueLang.push({
                                    attrValue: type == 1 ? item.attrValue : item.begin + '-' + item.end,
                                    lang: lang_1
                                })
                            });

                            for(var i = 0; i < attrValueLang.length; i++) {
                                attrValueName.push([{
                                    attrValue: attrValueLang[i].attrValue,
                                    lang: attrValueLang[i].lang
                                }])
                            };

                            for(var i = 0; i < attrValueName.length; i++) {
                                arrtNameList.push({
                                    attrValueLangList: attrValueName[i]
                                })
                            };

                            attrNameList.push({
                                attrName: this.toBeUpdatedAttrInCustom.searchAttrName,
                                lang: this.setForm.lang
                            });

                            params.attrValueList = arrtNameList;
                            params.attrNameList = attrNameList;
                            params.type = type;

                            this.$http.post('goods/category/edit-add', {
                                attrList: [params]
                            }).then(res => {
                                if(res.body.code === 0) {
                                    var existAttrDtos = res.body.data.existAttrDtos;
                                    var existAttrValueDtos = res.body.data.existAttrValueDtos;
                                    var lang = [];
                                    var attrName = [];
                                    var lang_1 = [];
                                    var attrName_1 = [];
                                    if(existAttrDtos.length > 0) {
                                        for(var i = 0; i < existAttrDtos.length; i++) {
                                            lang.push(existAttrDtos[i].lang);
                                            attrName.push(existAttrDtos[i].attrName);
                                        };
                                        this.$confirm('语言为' + lang + '的' + '(' + attrName + ')' + '属性已存在', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                        }).then(() => {}).catch(() => {
                                            this.$message({
                                                type: 'info',
                                                message: '已取消'
                                            });
                                        })
                                    } else if(existAttrValueDtos.length > 0) {
                                        for(var i = 0; i < existAttrValueDtos.length; i++) {
                                            lang_1.push(existAttrValueDtos[i].lang);
                                            attrName_1.push(existAttrValueDtos[i].attrValue);
                                        };
                                        this.$confirm('语言为' + lang_1 + '的' + '(' + attrName_1 + ')' + '属性值不能重复', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                        }).then(() => {}).catch(() => {
                                            this.$message({
                                                type: 'info',
                                                message: '已取消'
                                            });
                                        })
                                    } else {
                                        this.dialogUpdateAttrInCustomVisible = false;
                                        this.queryCustomAttr();
                                        this.$message.success(res.body.message);
                                    }
                                } else {
                                    this.$message.error(res.body.message)
                                }
                            })
                        }
                    }
                })
            },

            // createInCustom(type) {
            //     this.setForm.lang = this.firstLang;
            //     this.dialogUpdateAttrInCustomVisible = true;
            //     this.addType = type;
            //     this.isShow_3 = true;
            //     this.isShow_2 = false;
            //     if(this.typeInCustom == 1) {
            //         this.isShow = true;
            //         this.isShow_1 = false;
            //         this.toBeUpdatedAttrInCustom = {
            //             valueResp: [{
            //                 attrValue: ''
            //             }]
            //         };
            //     } else if(this.typeInCustom == 2) {
            //         this.isShow_1 = true;
            //         this.isShow = false;
            //         this.toBeUpdatedAttrInCustom = {
            //             valueResp: [{
            //                 begin: '',
            //                 end: ''
            //             }]
            //         };
            //     }
            // },

            async submitInFull() {
                // 2 描述 3 规格 else自定义
                let temp = [];
                let params = {};
                params.categoryId = this.commonOption.categoryId;
                params.type = this.checkType;
                params.attrKey = this.attrKeyId;
                params.lang = this.setForm.lang;
                params.aliasAttrName = this.toBeUpdatedAttrInFull.aliasAttrName;
                params.attrSort = this.attrSort || 999;
                this.toBeUpdatedAttrInFull.valueList.forEach(item => {
                    temp.push({
                        attrValueKey: item.attrValueKey,
                        aliasAttrValue: item.aliasAttrValue,
                        attrValueSort: item.attrValueSort || 999,
                        status: item.status == 1 ? 1 : 2
                    })
                });
                params.attrValueList = temp;

                this.editLoading = true;
                try {
                    const data = await this.httpPost_('goods/category-attribute/attr-val-bind-update', params);
                    this.$message.success(data.message);
                    this.dialogUpdateAttrInFullVisible = false;
                    this.queryFullAttr();
                } finally {
                    this.editLoading = false;
                }
                
            },

            // pdm描述属性，根据分类或属性名查找
            async getPdmCatAttr() {
                if(this.checkedPdmCatNames == '') {
                    this.$message.warning('请选择PDM分类');
                    return
                };
                this.catLoading = true;
                let params = {};
                params.pdmCategoryCodeList = [this.checkedPdmCatIds];
                params.pageNo = this.searchType.pageNo;
                params.pageSize = this.searchType.pageSize;

                if (this.pdmAttr) {
                    params.pdmAttrName = this.pdmAttr;
                }

                try {
                    const data = await this.httpGet_('goods/category-attribute/pdm-search-attr', {
                        params: params
                    });
                    this.searchedPdmAttrs = data.list;
                    this.searchType.total = data.totalCount;
                } finally {
                    this.catLoading = false;
                }
            },

            // 查询规格属性表数据
            async attribute() {
                let params = {};
                for (let i in this.attributeParams) {
                    let item = this.attributeParams[i];
                    if (i !== 'specAttrNameList') {
                        params[i] = item;
                    }
                }

                if (this.attributeParams.specAttrNameList) {
                    params.specAttrNameList = this.attributeParams.specAttrNameList.split(',');
                }
                const data = await this.httpGet_('goods/category-attribute/pdm-spec-attr', {
                    params: params
                });
                this.attributeList = data.list;
                this.total = data.totalCount;
            },
            reset() {
                this.attributeParams.specAttrNameList = '';
                this.attribute();
            },
            async getBootCat() {
                const data = await this.httpGet_('goods/category/category-drop-down');
                this.catTree = data;
            },
            multipleSelectionChange_1(val) {
                this.sizeForm.attrKeyList.forEach(item => {
                    if (val.indexOf(item) != -1) {
                        item.lock = true;
                    } else {
                        item.lock = false;
                    }
                });
                this.multipleSelection_1 = val;
            },

            handleCurrentChange(row, event, column) {
                this.$refs.customTableList.toggleRowSelection(row)
            },

            multipleSelectionChange(val) {
                this.multipleSelection = val;
            },

            ChangePage(val) {
                this.paramsSiteCat.pageNo = val;
                this.searchSiteCat()
            },

            ChangePageSize(val) {
                this.paramsSiteCat.pageSize = val;
                this.searchSiteCat()
            },

            ChangePage_1(val) {
                this.attributeParams.pageNo = val;
                this.attribute()
            },

            ChangePageSize_1(val) {
                this.attributeParams.pageSize = val;
                this.attribute()
            },

            queryProperties() {
                if(this.commonOption.categoryId) {
                    this.queryFullAttr()
                } else {
                    this.$message('请先选择商品分类');
                }
            },
            //
            // page
            ChangeCatPage (val) {
                this.catPage.pageNo = val;
                this.queryFullAttr();
            },
            ChangeCatPageSize (val) {
                this.catPage.pageSize = val;
                this.queryFullAttr();
            },
        }
    }
</script>

<style lang="less">
    .good-cat-attr {
        .cat-tree {
            width: 400px;
        }

        .accessory-tree-item {
            position: relative;

            .el-form-item__content {
                width: 300px;
            }

            .search {
                position: absolute;
                top:36px;
                z-index: 10;
            }

            .el-tree {
                height: 300px;
                overflow-y: auto;
                position: absolute;
                top: 72px;
                width: 100%;
                z-index: 10;

                .el-tree-node__expand-icon {
                    border-width: 9px;

                    &:hover {
                        border-left-color: #20A0FF;
                    }
                }
            }
        }

        .separator {
            height: 30px;
        }

        .el-tree {
            max-height: 240px;
            overflow-y: scroll;
        }

        .el-checkbox-group .el-checkbox {
            margin-left: 30px;
        }

        .el-checkbox {
            width: 150px;
            overflow: hidden;
        }

        .el-checkbox-group {
            overflow-y: auto;
        }
    }
</style>
