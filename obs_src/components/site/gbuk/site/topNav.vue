<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类馆banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-form :model="option"  label-width="120px" ref="searchForm" inline>
                <el-form-item label="语言" prop="lang">
                    <el-select v-model="option.lang">
                        <el-option v-for="(item, index) in langOpt" :key="index" :value="item.language_en" :label="item.language_ch"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="导航类型" prop="type">
                    <el-select v-model="option.type">
                        <el-option v-for="(item, index) in typeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getData">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                    <el-button type="primary" @click="addDialog = true">添加导航</el-button>
                </div>
            </el-form>    
        </div>
        <el-table :data="tableData" border class="menu-list-table" v-loading="tableLoading">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="id"></el-table-column>
            <el-table-column label="导航名称">
                <template scope="scope">
                    <div :class="'level' + scope.row.treeInfo.level">
                         <a v-if="!scope.row.treeInfo.leaf" class="tree-btn" @click="toggle(scope.row, scope.$index, scope.store)"><i :class="{'el-icon-plus': !scope.row.isToggle, 'el-icon-minus': scope.row.isToggle}"></i>{{scope.row.name}}</a>
                         <span v-else>{{scope.row.name}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="url" label="url"></el-table-column>
            <el-table-column prop="lang" label="语言"></el-table-column>
            <el-table-column prop="code" label="添加时间">
                <template scope="scope">
                     {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="order" label="排序"></el-table-column>
        </el-table>

        <!-- 弹窗S -->
            <el-dialog title="添加导航" v-model="addDialog" size="tiny">
                <el-form :model="addForm" label-width="80px" ref="postform">
                    <el-form-item label="导航类型" prop="type">
                        <el-select clearable v-model="addForm.type">
                            <el-option v-for="(item, index) in typeOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="导航名称" prop="">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="url" prop="">
                        <el-input v-model="addForm.url"></el-input>
                    </el-form-item>
                    <el-form-item label="语言" prop="lang">
                        <el-select clearable v-model="addForm.lang">
                            <el-option v-for="(item, index) in langOpt" :key="index" :value="item.language_en" :label="item.language_ch"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否显示" prop="">
                        <el-radio-group v-model="addForm.is_show">
                            <el-radio label="1">显示</el-radio>
                            <el-radio label="0">不显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="所属菜单" prop="">
                        <el-autocomplete class="inline-input" v-model="addForm.menuName" :fetch-suggestions="phpSearch" placeholder="请输入内容"></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="排序" prop="">
                        <el-input v-model="addForm.order"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button  type="primary" @click="post" v-loading="postLoading">确 定</el-button>
                    <el-button @click="addDialog = false">取 消</el-button>
                </span>
            </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableData: [],
            tableLoading: false,
            option: {
                lang: 'en',
                type: 'default'
            },
            checkedRow: [],
            langOpt: [],
            typeOpt: {},
            postLoading: false,
            addDialog: false,
            addForm: {
                parent_id: '',
                is_show: '',
                name: '',
                lang: '',
                type: '',
                menuName: ''
            },
            menuList: [],
        };

    },
    created () {
        this.getOpt();
        this.getData();
    },
    methods: {
        getData () {
            this.$http.get('admin/top-navigation/list', {params: this.option}).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    data.map(item => {
                        if (item.treeInfo.leaf == false) {
                            item.isToggle = true;
                        }

                        if (item.treeInfo.level < 3) {
                            item.value = item.name;
                            this.menuList.push(item);
                        }
                    });
                    this.tableData = data;
                }
            });
        },
        getOpt () {
            this.$http.get('base/language/list').then(res => {
                if (res.body.code === 0) {
                    this.langOpt = res.body.data;
                }
            });

            this.$http.get('admin/top-navigation/options').then(res => {
                if (res.body.code === 0) {
                    this.typeOpt = res.body.data;
                }
            });
        },
        resetForm () {
            this.$refs.searchForm.resetFields();
        },
        add () {

        },
        toggle (row, index, tableStore) {
            let data = tableStore.states;
            let tableData = data._data;
            let targetIndex = index;
            let toggleIndex = '';
            let targetParent = row.parent_id;
            for (let i in tableData) {
                if (i > targetIndex && tableData[i].parent_id == targetParent) {
                    toggleIndex = i;
                    break ;
                } else {
                    toggleIndex = i + 1;
                }
            };

            if (tableStore[row.id] && tableStore[row.id] != '') {
                let tempArrbefore = tableData.slice(0, targetIndex + 1);
                let tempArrafter = tableData.slice(targetIndex + 1);
                let temp = tempArrbefore.concat(tableStore[row.id]);
                let res = temp.concat(tempArrafter);
                this.tableData = res;
                this.tableData[index].isToggle = true;
                tableStore[row.id] = '';
            } else {
                tableStore[row.id] = tableData.slice(targetIndex + 1, toggleIndex);
                this.tableData.splice(targetIndex + 1, toggleIndex - targetIndex -1);
                this.tableData[index].isToggle = false;
            }
        },
        post () {

        },
        remove () {
            this.$confirm('是否删除选择项?', '提示', {
                type: 'warning'
            }).then(() => {
                let str = [];
                this.checkedRow.forEach(item => {
                    str.push(item.id);
                });
                this.$http.post('admin/error-report/delete', {ids: str.join(',')}).then(res => {
                    if (res.body.code == 0) {
                        this.getData();
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
                    message: '已取消删除!'
                });          
            });
        },

        phpSearch(queryString, callback) {
            let queryCatlist = this.menuList;
            let results = queryString ? queryCatlist.filter(this.createFilter(queryString)) : queryCatlist;
            // 调用 callback 返回建议列表的数据
            callback(results);
        },
        createFilter(queryString) {
            return (queryCatlist) => {
                return (queryCatlist.value.toUpperCase().indexOf(queryString.toUpperCase()) !== (-1));
            };
        }
    }
}
</script>
<style>

</style>
