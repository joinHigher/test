<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">
            <div class="text-right">
                <router-link class="el-button" :to="{path: '/admin/special/list'}">返回专题列表</router-link>
            </div>

            <!--语言tabs begin-->
            <el-tabs v-model="option.lang" @tab-click="getData">
                <el-tab-pane v-for="(item, index) in specialLangOpt" :label="item.lang === item.default_lang ? langText[item.lang] + '（默认语言）' : langText[item.lang]" :name="item.lang" :key="index"></el-tab-pane>
            </el-tabs><!--语言tabs end-->

            <!--平台tabs begin-->
            <el-tabs v-model="option.platform" @tab-click="getData">
                <el-tab-pane label="PC" name="1"></el-tab-pane>
                <el-tab-pane label="M" name="2"></el-tab-pane>
            </el-tabs><!--平台tabs end-->

            <div class="el-sub-container text-right">
                <!--<el-button type="danger" :disabled="!multipleSelection.length">批量删除</el-button>-->
                <router-link class="el-button el-button--primary" v-if="self.showAction_('admin/special-position/add')" :to="{path: '/admin/special-position/edit?type=add&special_id=' + special_id + '&lang=' + option.lang }">新增版块</router-link>
            </div>

            <div>
                <!--数据表格 begin-->
                <el-table border :data="tableData" ref="multipleTable" @selection-change="selectionChange" @row-click="clickRow" @cell-dblclick="showModifyOrder">
                    <!--<el-table-column type="selection"></el-table-column>-->
                    <el-table-column prop="position_id" label="版块ID" width="100"></el-table-column>
                    <el-table-column prop="name" label="板块名称"></el-table-column>
                    <el-table-column prop="nav_name" label="导航名称"></el-table-column>
                    <el-table-column label="版块类型" width="150">
                        <template scope="scope">
                            {{ positionTypes[scope.row.type] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="平台" width="80">
                        <template scope="scope">
                            {{ platforms[scope.row.platform] }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="shows" label="显示设置" width="500">
                        <template scope="scope">
                            <el-tag type="primary" class="mr10 mb5 mt5" v-if="scope.row.shows !== ''" v-for="item in scope.row.shows.split(',')" :key="item">{{ goodsList[item] }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" width="100" column-key="order">
                        <template scope="scope">
                            <el-input v-model="scope.row.modifyOrderNum" :autofocus="true" @blur="modifyOrder(scope.row)" v-if="scope.row.isEditOrder === true"></el-input>
                            <span v-if="scope.row.isEditOrder === false">{{ scope.row.order }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" column-key="handle">
                        <template scope="scope">
                            <router-link class="el-button el-button--primary el-button--small" v-if="self.showAction_('admin/special-position/detail')" :to="{path: '/admin/special-position/edit?type=edit&special_id='+ special_id + '&lang=' + option.lang + '&position_index=' + scope.row.position_index +'&platform=' + scope.row.platform}">编辑</router-link>
                            <el-button size="small" type="danger" @click="remove(scope.row.id)" v-if="self.showAction_('admin/special-position/delete')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table><!--数据表格 end-->
            </div>

        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                self: this,
                isDataLoading: false,
                special_id: this.$route.query['special_id'],
                tableData: [],
                multipleSelection: [],
                platforms: {
                    '1': 'PC',
                    '2': 'M',
                },
                langOpt: {},
                langText: {},
                positionTypes: {},
                goodsListShow: [],
                goodsList: [],
                option: {
                    lang: this.$route.query['lang'],
                    platform: '1',
                },
                specialLangOpt: {},
            };
        },
        computed: {
            pipeOpt() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.goTop();
            this.getOpt();
            this.getSpecialLangOpt();
            this.getSpecialPositionTypes();
            this.getGoodsList();
            this.getData();
        },
        methods: {
            getOpt() {
                // 语言下拉
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code === 0) {
                        this.langOpt = res.body.data;
                        let obj = {};
                        this.langOpt.forEach(item => {
                            obj[item.language_en] = item.language_ch;
                        });
                        this.$set(this, 'langText', obj);
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            // 获取板块所属专题的多语言
            getSpecialLangOpt () {
                this.$http.get('admin/special-position/lang-lists',{params: {special_id: this.special_id}}).then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        this.specialLangOpt = data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            // 获取板块类型
            getSpecialPositionTypes () {
                this.$http.get('admin/public/special-position-options').then(res => {
                    this.positionTypes = res.body.data;
                });
            },
            // 显示类型
            getGoodsList () {
                this.$http.get('admin/special-position/public-get-shows').then(res => {
                    this.goodsList = res.body.data;
                });
            },
            async getData() {
                if (typeof this.special_id === 'undefined' || typeof this.option.lang === 'undefined') {
                    return;
                }

                let params = {
                    special_id: this.special_id,
                    lang: this.option.lang,
                    platform: this.option.platform
                };

                try {
                    this.isDataLoading = true;
                    let data = await this.httpGet_('admin/special-position/lists', {params: params});
                    data.forEach(item => {
                        item.isEditOrder = false;
                        item.modifyOrderNum = 0;
                    });
                    this.tableData = data;
                } finally {
                    this.isDataLoading = false;
                }
            },
            //删除版块
            remove(id) {
                this.$confirm('此操作将删除板块绑定的商品（及搭售配件）数据', '提示消息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('admin/special-position/delete', {id: id}).then(res => {
                        this.isDataLoading = false;
                        if (res.body.code === 0) {
                            this.getData();

                            this.$message({
                                type: 'success',
                                message: res.body.message
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                });
            },

            // 显示排序输入框
            showModifyOrder (row, column, cell, event) {
                if (column.columnKey === 'order') {
                    this.tableData.forEach(item => {
                        item.isEditOrder = false;
                    });

                    row.isEditOrder = true;
                    row.modifyOrderNum = row.order;
                }
            },
            // 修改排序
            modifyOrder (row) {
                row.isEditOrder = false;
                if (row.modifyOrderNum >= 0 && row.modifyOrderNum <= 127) {
                    this.$http.post('admin/special-position/update-order', {id: row.id, order: row.modifyOrderNum}).then(res => {
                        if (res.body.code === 0) {
                            this.$message({
                                type: 'success',
                                message: res.body.message
                            });
                            row.order = row.modifyOrderNum;
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: '排序值必须在 0 ~ 127之间'
                    });
                }
            },
            selectionChange(val) {
                this.multipleSelection = val;
            },
            clickRow(row, event, col) {
                if (col.columnKey !== 'handle' && col.columnKey !== 'order') {
                    this.$refs['multipleTable'].toggleRowSelection(row);
                }
            },
            goTop () {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
        }
    }
</script>

<style scoped lang="less">
    .mr10 {
        margin-right: 10px;
    }
    .mb5 {
        margin-bottom: 5px;
    }
    .mt5 {
        margin-top: 5px;
    }
</style>
