<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="语言" prop="lang">
                    <el-select clearable filterable v-model="filterForm.lang" placeholder="请选择">
                        <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code">
                    <el-select clearable filterable v-model="filterForm.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="导航类型" prop="type">
                    <el-select v-model="filterForm.type" clearable placeholder="请选择">
                        <el-option v-for="(value, key) in typeText" :label="value" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="导航位置类型" prop="position_type">
                    <el-select v-model="filterForm.position_type" clearable placeholder="请选择">
                        <el-option v-for="(value, key) in positionTypeText" :label="value" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标识" prop="mark_type">
                    <el-select v-model="filterForm.mark_type" clearable placeholder="请选择">
                        <el-option v-for="(value, key) in markTypeText" :label="value" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台" prop="platforms">
                    <el-select v-model="filterForm.platforms" clearable placeholder="请选择">
                        <el-option v-for="(value, key) in platforms" :label="value" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>
            </el-form>
            <el-button class="topic-btn" type="primary" @click="batchDelete" :disabled="!(multipleSelection.length > 0)" v-if="self.showAction_('admin/top-navigation/delete')">批量删除</el-button>
            <el-button class="topic-btn" type="primary" @click="addTopic" v-if="self.showAction_('admin/top-navigation/add')">新增顶部导航</el-button>
            <el-table :data="tableData" border ref="table" v-loading="dataLoading" @selection-change="handleSelectionChange" @select="manualSelect">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column  label="导航名称">
                    <template scope="scope">
                        <span v-if="scope.row.children && scope.row.children.length > 0" :style="{ marginLeft: (scope.row.level * 18) + 'px' }">
                            <el-button type="text" @click="toggleFold(scope.row)">
                                <i v-if="!scope.row.isFolded" class="el-icon-minus"></i>
                                <i v-else class="el-icon-plus"></i>
                            </el-button>
                            <router-link :to="{ name: 'top_navigationEdit', query: { id: scope.row.id }}">{{ scope.row.name }}</router-link>
                        </span>
                        <span v-else :style="{ marginLeft: (scope.row.level * 18) + 'px' }">
                            <router-link :to="{ name: 'top_navigationEdit', query: { id: scope.row.id }}">{{ scope.row.name }}</router-link>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    <template scope="scope">
                        {{ typeText[scope.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column label="导航位置类型">
                    <template scope="scope">
                        {{ positionTypeText[scope.row.position_type] }}
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="url"></el-table-column>
                <el-table-column label="语言">
                    <template scope="scope">
                        {{ langTexts[scope.row.lang] }}
                    </template>
                </el-table-column>
                <el-table-column label="渠道">
                    <template scope="scope">
                        <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="平台">
                    <template scope="scope">
                        <p v-for="item in scope.row.platforms.split(',')">{{ platforms[item] }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间">
                    <template scope="scope">
                        {{ timeZone_(scope.row.create_time, $store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="order" label="排序"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                tableData: [],
                dataLoading: false,
                filterForm: {
                    lang: 'en',
                    pipeline_code: '',
                    type: '',
                    mark_type: '',
                    position_type: '',
                    platforms: '',
                },
                typeText: {
                    '1': '默认导航',
                    '2': '其它导航'
                },
                positionTypeText: {
                    '1': '纵向',
                    '2': '横向'
                },
                markTypeText: {
                    '1': '无标识',
                    '2': 'Hot',
                    '3': 'New'
                },
                langTexts: {},
                langs: null,
                multipleSelection: [],
                platforms: {
                    '1': 'PC',
                    '2': 'WAP',
                    '3': 'iOS',
                    '4': 'Android',
                },
            }
        },
        computed: {
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.getLangs();
                this.getListData();
            },
            // 获取列表数据
            getListData() {
                let params = {};
                this.dataLoading = true;
                params = Object.assign({}, this.filterForm);
                delete params.total;
                this.$http.get('admin/top-navigation/list', { params: params }).then(res => {
                    this.dataLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        return;
                    }
                    res.body.data.forEach((item) => {
                        this.addFieldForData(item, 0);
                    });
                    //console.log(res.body.data);
                    this.tableData = res.body.data;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 递归添加isFolded字段
            addFieldForData(item, level) {
                if(item.children && item.children.length > 0) {
                    item.isFolded = true;
                    item.level = level;
                    item.children.forEach((childItem) => {
                        this.addFieldForData(childItem, level + 1);
                    });
                } else {
                    item.level = level;
                }
            },
            // 展开收缩列表子菜单
            toggleFold(row) {
                let index = this.tableData.indexOf(row);
                if (row.isFolded) {
                    row.children.forEach((item, i) => {
                        this.tableData.splice(index + i + 1, 0, item);
                    });
                } else {
                    row.children.forEach((item, i) => {
                        if(!item.isFolded && item.children) {
                            this.toggleFold(item);
                        }
                        let childIndex = this.tableData.indexOf(item);
                        this.tableData.splice(childIndex, 1);
                    });
                }
                row.isFolded = !row.isFolded;

                if(!row.isFolded){
                    this.toggleSelect(row);
                }
            },
            // 收缩时需splice掉对应已展示的row
            deleteExpansionRow() {

            },
            //
            addOrRemoveMultipleSelection(row, type){
                if(row.children && row.children.length > 0) {
                    row.children.forEach((childItem) => {
                        if(type === 'add'){
                            this.$refs.table.toggleRowSelection(childItem, true);
                        }else{
                            this.$refs.table.toggleRowSelection(childItem, false);
                        }
                        this.addOrRemoveMultipleSelection(childItem, type);
                    });
                }
            },
            //
            toggleSelect(row, isLastChild, tag){
                //如果有子集且子集已展开显示
                if(row.isFolded === false && row.children && row.children.length > 0){
                    row.children.forEach((item) => {
                        //如果当前行是选中则所有已展开的子集选中，为选中则相反
                        if(this.multipleSelection.indexOf(row) > -1){
                            this.$refs.table.toggleRowSelection(item, true);
                        }else{
                            if(row.level === 0){
                                this.$refs.table.toggleRowSelection(item, false);
                            }else{
                                this.multipleSelection.forEach((selectionItem) => {
                                    if(row.parent_id === selectionItem.id){
                                        this.$refs.table.toggleRowSelection(selectionItem, false);
                                    }
                                });
                            }
                        }

                        if(item.isFolded === false && item.children && item.children.length > 0){
                            item.children.forEach((childItem) => {
                                this.multipleSelection.indexOf(item) > -1 ? tag = true : tag = false;
                                this.toggleSelect(childItem, true, tag);
                            });
                        }
                    });
                }else if(this.tableData.indexOf(row) > -1 && isLastChild === true){
                    this.$refs.table.toggleRowSelection(row, tag);

                }else{
                    //如果是第一级则需要把所有子集都添加进去
                    if(row.level === 0){
                        if(this.multipleSelection.indexOf(row) > -1){
                            this.addOrRemoveMultipleSelection(row, 'add');
                        }else{
                            this.addOrRemoveMultipleSelection(row, 'remove');
                        }
                    }else{
                        this.multipleSelection.forEach((selectionItem) => {
                            if(row.parent_id === selectionItem.id){
                                this.$refs.table.toggleRowSelection(selectionItem, false);
                                if(selectionItem.level !== 0)
                                    this.toggleSelect(selectionItem);
                            }
                        });
                    }
                }
            },
            //
            manualSelect(selection,row){
                this.toggleSelect(row);
            },
            // 获取语言列表
            getLangs() {
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    this.langs = res.body.data;
                    let langTexts = {};
                    res.body.data.forEach((item) => {
                        langTexts[item.language_en] = item.language_ch;
                    });
                    this.langTexts = Object.assign({}, this.langTexts, langTexts);
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
            },
            // table item项多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
                // console.log(this.multipleSelection)
            },
            // 批量删除
            batchDelete(event, row) {
                let ids;
                let arr = [];
                this.multipleSelection.forEach((item) => {
                    arr.push(item.id);
                });
                if(arr.length === 0) { return; }
                ids = arr.join(',');
                // console.log(ids)
                this.$confirm('确认删除？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('admin/top-navigation/delete', {
                        ids: ids
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
            // 添加顶部导航
            addTopic() {
                this.$router.push({ name: 'top_navigationAdd' });
            }
        }
    }
</script>
<style lang="less">
    .topic-btn{
        margin: 20px 0;
    }
</style>
