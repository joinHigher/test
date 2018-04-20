<template>
    <div class="el-container">
        <el-tabs v-model="activeName" @tab-click="handle">
            <el-tab-pane label="站点语言管理" name="1">
                <div class="text-right">
                    <el-button type="primary" @click="add" v-if="self.showAction_('admin/language/add')">添加语言</el-button>
                </div>
                <div class="el-sub-container">
                    <el-table border :data="tableData" v-loading="tableLoading">
                        <el-table-column prop="id" label="编号"></el-table-column>
                        <el-table-column prop="language_ch" label="语言(中文)"></el-table-column>
                        <el-table-column prop="language_en" label="语言(英文)"></el-table-column>
                        <el-table-column label="启用状态">
                            <template scope="scope">
                                <i :class="{'el-icon-circle-check color-success': scope.row.is_enable == '1', 'el-icon-circle-cross color-danger': scope.row.is_enable == '0'}"></i>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" type="primary" @click="edit(scope.row)" v-if="self.showAction_('admin/language/edit')">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="站点终端管理" name="2">
                <el-form :inline="true" label-width="113px">
                    <el-form-item label="映射后终端：">
                        <el-tag class="mr10" v-for="tag in terminalOpt" :key="tag.id" :closable="false" type="primary" @close="deleteTerminal(tag.id)">{{ tag.name }}</el-tag>
                    </el-form-item>
                    <!--<el-form-item>
                        <el-button class="ml20" size="small" type="primary" @click="openTerminalDialog">添加</el-button>
                    </el-form-item>-->
                </el-form>
                <el-table class="mapping-table" border :data="mappingTableData" v-loading="tableLoading">
                    <el-table-column prop="id" label="序号"></el-table-column>
                    <el-table-column prop="platform_name" label="映射前终端名称"></el-table-column>
                    <el-table-column prop="terminal_name" label="映射后终端名称"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" type="primary" @click="editMapping(scope.row)" v-if="self.showAction_('admin/site/update-mapping')">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="站点汇率配置" name="3">
                <el-form :inline="true" :model="rateOption" :rules="rateRule" ref="rateForm" label-width="100px" v-model="isDataLoading">
                    <el-form-item label="汇率设置" prop="rate">
                        <el-input v-model="rateOption.rate"></el-input>
                    </el-form-item>
                    <el-form-item label="商品模块：">
                        <span>{{ rateOption.goodRate }}</span>
                    </el-form-item>
                    <el-form-item label="物流模块：">
                        <span>{{ rateOption.logisticsRate }}</span>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ml20" type="primary" size="small" @click="saveRate" v-if="self.showAction_('admin/site/save-rate')">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <!-- 弹窗S -->
        <el-dialog :title="editDialog.title" v-model="editDialog.isShow" size="tiny">
            <el-form label-width="100px" :model="editForm" ref="editForm">
                <!--<el-form-item label="中文" prop="language_ch" :rules="required">
                    <el-input v-model="editForm.language_ch"></el-input>
                </el-form-item>-->
                <el-form-item label="语言" prop="language_en" :rules="required">
                    <el-select v-model="editForm.language_en" filterable @change="changeLang">
                        <el-option v-for="(item, index) in langOpt" :key="index" :value="index" :label="item">
                            <span class="fl">{{ item }}</span>
                            <span class="fr">{{ index }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否开启" prop="is_enable" :rules="required">
                    <el-radio-group v-model="editForm.is_enable">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="post">确 定</el-button>
                <el-button @click="editDialog.isShow = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗E -->

        <!--添加终端begin-->
        <el-dialog title="添加终端" v-model="addTerminal.isShow" size="tiny">
            <el-form :inline="true" label-width="100px">
                <el-form-item label="终端名：">
                    <el-input v-model="addTerminal.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml20" size="small" type="primary" @click="saveTerminal">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--添加终端end-->

        <!--映射终端begin-->
        <el-dialog title="映射终端配置" v-model="mappingRowData.isShow" size="tiny">
            <el-form label-width="100px">
                <el-form-item label="映射前终端：">
                    <span>{{ mappingRowData.platform_name }}</span>
                </el-form-item>
                <el-form-item label="映射后终端：">
                    <el-select v-model="mappingRowData.terminal_id">
                        <el-option v-for="(item, index) in terminalOpt" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="saveMapping">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--映射终端end-->
    </div>
</template>

<script>

import ElTabPane from "element-ui/packages/tabs/src/tab-pane";

export default {
    components: {ElTabPane},
    data () {
        return {
            required: [{
                required: true,
                message: '该项不能为空',
            }],
            editForm: {
                language_ch: '',
                language_en: '',
                is_enable: 0,
            },
            editDialog: {
                isShow: false,
                title: '新增语言',
                id: '',
            },
            self: this,
            tableLoading: false,
            tableData: [],
            langOpt: {},
            isDataLoading: false,
            activeName: '1',
            rateOption: {
                rate: '',
                goodRate: '',
                logisticsRate: ''
            },
            rateRule: {
                rate: [{required: true, message: '该项不能为空'}],
            },
            addTerminal: {
                isShow: false,
                name: '',
            },
            mappingTableData: [],
            mappingRowData: {
                isShow: false,
                id: '',
                platform_id: '',
                platform_name: '',
                terminal_id: '',
                terminal_name: '',
            },
            terminalOpt: []
        };
    },
    // 创建实例时的钩子
    created () {
        this.getOpt();
        this.getData();

        this.getTerminals();
        this.getRate();
    },
    methods: {
        getOpt () {
            this.$http.get('base/public/lang-all').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = {};
                    data.forEach(item => {
                        temp[item.language_code] = item.language_name;
                    });
                    this.langOpt = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getData() {
            this.$http.get('admin/language/list').then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        add() {
            this.editDialog.id = '';
            this.editDialog.isShow = true;
            this.editDialog.title = '新增语言';
            this.editForm =  {
                language_ch: '',
                language_en: '',
                is_enable: 0,
            };
        },
        edit(row) {
            this.editDialog.id = row.id;
            this.editDialog.isShow = true;
            this.editDialog.title = '编辑语言';

            for (let i in this.editForm) {
                this.editForm[i] = row[i];
            }
        },
        changeLang (val) {
            if (val) {
                this.editForm.language_ch = this.langOpt[val];
            }
        },
        post() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    let params = JSON.parse(JSON.stringify(this.editForm));
                    let src = 'admin/language/add';
                    if (this.editDialog.id) {
                        src = 'admin/language/edit';
                        params.id = this.editDialog.id;
                    }
                    this.$http.post(src, params).then(res => {
                        if (res.body.code === 0) {
                            this.getData();
                            this.$message.success(res.body.message);
                            this.editDialog.isShow = false;
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }
            })
        },
        remove() {
            this.$confirm('确认删除？').then(() => {
                this.$http.post('')
            })
        },
        handle(val) {
            if(val.name === '2') {
                this.getMappingData();
            }
        },
        //获取汇率
        getRate() {
            this.isDataLoading = true;
            this.$http.get('admin/site/rate').then(res => {
               if(res.body.code === 0){
                   let data = res.body.data;
                   this.rateOption.goodRate = data.goodsRate;
                   this.rateOption.logisticsRate = data.logisticsRate;
                   this.isDataLoading = false;
               }
            });
        },
        //设置汇率
        saveRate() {
            this.$refs.rateForm.validate(valid => {
                if(valid){
                    let rate = this.rateOption.rate;
                    this.isDataLoading = true;
                    this.$http.post('admin/site/save-rate', {rate: rate}).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success('设置成功');
                            this.getRate();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }
            });
        },
        //获取映射后的终端列表
        getTerminals() {
            this.$http.get('admin/site/terminals').then(res => {
                if(res.body.code === 0){
                    let data = res.body.data;
                    this.terminalOpt = data;
                }
            });
        },
        openTerminalDialog() {
            this.addTerminal.name = '';
            this.addTerminal.isShow = true;
        },
        //添加终端
        saveTerminal() {
            if(this.addTerminal.name === '') {
                this.$message({
                    message: '请输入终端名',
                    type: 'warning'
                });
                return false;
            }
            this.$http.post('admin/site/add-terminal', {name: this.addTerminal.name}).then(res => {
                if (res.body.code === 0) {
                    this.$message.success('添加成功');
                    this.addTerminal.isShow = false;
                    this.getTerminals();
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        //终端映射--删除终端
        deleteTerminal(id) {
            //去掉删除功能
            /*this.$confirm('确定删除？', '提示信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isDataLoading = true;
                this.$http.post('admin/site/delete-terminal', {id: id}).then(res => {
                    if (res.body.code === 0) {
                        this.isDataLoading = false;
                        this.getTerminals();
                        this.getMappingData();
                        this.$message({
                            message: res.body.message,
                            type: 'success'
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            })*/
        },
        //获取映射关系列表
        getMappingData() {
            this.tableLoading = true;
            this.$http.get('admin/site/mapping').then(res => {
                if(res.body.code === 0){
                    this.tableLoading = false;
                    this.mappingTableData = res.body.data;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        //编辑映射关系
        editMapping(row) {
            let mappingRowData = {
                isShow: true,
                id: row.id,
                platform_id: row.platform_id,
                platform_name: row.platform_name,
                terminal_id: row.terminal_id === 0 ? '' : row.terminal_id,
                terminal_name: row.terminal_name,
            };

            console.log(mappingRowData);

            this.mappingRowData = mappingRowData;
        },
        //保存映射关系
        saveMapping() {
            if(this.mappingRowData.terminal_id === ''){
                this.$message({
                    message: '请选择映射后终端',
                    type: 'warning'
                });
                return false;
            }

            let params = {
                id: this.mappingRowData.id,
                platform_id: this.mappingRowData.platform_id,
                terminal_id: this.mappingRowData.terminal_id,
            };

            this.$http.post('admin/site/update-mapping', params).then(res => {
                if (res.body.code === 0) {
                    this.$message.success('修改成功');
                    this.mappingRowData.isShow = false;
                    this.getMappingData();
                } else {
                    this.$message.error(res.body.message);
                }
            });
        }
    }
}
</script>

<style scoped lang="less">
    .ml20 {margin-left: 20px;}
    .mr10 {margin-right: 10px;}
</style>

