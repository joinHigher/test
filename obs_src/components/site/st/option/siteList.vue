<template>
	<div>
        <div class="el-container">
            <el-tabs class="full" active-name="1" type="card" @tab-click="getPaneData">
                <el-tab-pane label="网站语言" name="1">
                    <el-row>
                        <el-col :span="4">
                            <el-form label-width="100px">
                                <el-form-item label="选择平台">
                                    <el-select @change="changeTable" v-model="option.platform">
                                        <el-option v-for="(item, index) in platformOpt" :label="item" :value="index" :selected="!(index - 1)" :key="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col class="text-right" :span="20">
                            <el-button v-if="self.showAction_('admin/language/add')" type="primary" @click="showAddDialog"><i class="el-icon-plus"></i> 添加语言</el-button>
                        </el-col>
                    </el-row>
                    <div class="el-sub-container">
                        <el-table border :data="tableData" v-loading="tableLoading">
                            <el-table-column prop="id" label="编号"></el-table-column>
                            <el-table-column prop="language_ch" label="语言(中文)"></el-table-column>
                            <el-table-column prop="language_en" label="语言(英文)"></el-table-column>
                            <el-table-column prop="code" label="货币简码"></el-table-column>
                            <el-table-column prop="country" label="对应运费国家"></el-table-column>
                            <el-table-column label="启用状态">
                                <template scope="scope">
                                    <i :class="{'el-icon-circle-check color-success': scope.row.is_enable == '1', 'el-icon-circle-cross color-danger': scope.row.is_enable == '0'}"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button v-if="self.showAction_('admin/language/edit')" size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
                                    <el-button v-if="self.showAction_('admin/language/delete')" size="small" type="danger" @click="removeRow(scope.row.id, scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="订单" name="4">
                    <p class="cat-title"><strong>订单状态</strong></p>
                    <el-row>
                        <el-col :span="5">
                            <el-form>
                                <el-form-item label="开启RMA状态显示">
                                    <el-radio-group v-model="orderStatus.show_order_rma_status" @change="statusChange">
                                        <el-radio class="radio" label="1">开启</el-radio>
                                        <el-radio class="radio" label="0">关闭</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="开启CASE状态显示">
                                    <el-radio-group v-model="orderStatus.show_order_case_status" @change="statusChange">
                                        <el-radio class="radio" label="1">开启</el-radio>
                                        <el-radio class="radio" label="0">关闭</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </el-tab-pane> -->
            </el-tabs>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="添加语言" v-model="addLang" size="tiny">
            <el-form :model="addform" ref="addform" :rules="addRule" label-width="100px">
                <el-form-item label="国家" prop="country">
                    <el-input v-model="addform.country"></el-input>
                </el-form-item>
                <el-form-item label="语言" prop="language_en">
                    <el-select v-model="addform.language_en" filterable @change="changeLang">
                        <el-option v-for="item in langOpt" :key="item.language_code" :value="item.language_code" :label="item.language_name">
                            <span class="fl">{{ item.language_name }}</span>
                            <span class="fr">{{ item.language_code }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="货币简码" prop="code">
                    <el-input v-model="addform.code"></el-input>
                </el-form-item>
                <el-form-item label="货币状态" prop="is_enable">
                    <el-radio-group v-model="addform.is_enable">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-loading="addLangLoading" :disabled="addLangLoading" @click="addLangBtn">确 定</el-button>
                <el-button type="danger" @click.native="addLang = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
	</div>
</template>

<script>

export default {
  	data () {
        let self = this;

  		return {
            self: this,
            tableLoading: false,
            addLangLoading: false,
  			tableData: [],
            // 添加语言
            langOpt: {},
            addLang: false,
            addform: {
                is_enable: 0,
                country: '',
                language_ch: '',
                language_en: '',
                code: ''
            },
            option: {
                platform: '1'
            },
            platformOpt: [],
            orderStatus: {
                show_order_rma_status: '',
                show_order_case_status: ''
            },
            addRule: {
                country: [{
                    required: true,
                    message: '请输入国家',
                }],
                language_en: [{
                    required: true,
                    message: '语言不能为空',
                }],
                code: [{
                    required: true,
                    message: '请输入货币简码',
                }],
                is_enable: [{
                    required: true,
                    message: '请选择货币状态',
                }]
            },
  		};
  	},
    // 创建实例时的钩子
    created () {
        this.initData();
    },
    methods: {
        // 初始数据
        initData () {
            this.getplatform();
            this.getOpt();
            this.changeTable();
        },
        getOpt () {
            this.$http.get('base/public/lang-all').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = {};
                    data.forEach(item => {
                        temp[item.language_code] = item;
                    });
                    this.langOpt = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getplatform () {
            var self = this;

            self.$http.get('admin/public/platforms').then(res => {
                self.platformOpt = res.body.data;
            });
        },
        changeLang (val) {
            if (val) {
                this.addform.language_ch = this.langOpt[val].language_name;
            }
        },
        // 改变平台，切换表格
        changeTable () {
            var self = this;
            self.tableLoading = true;
            self.$http.get('admin/language/all-list', {params: {platform: this.option.platform}}).then(res => {
                self.tableLoading = false;
                if (res.body.code === 0) {
                    self.tableData = res.body.data;
                }
            });
        },
        edit (row) {
            this.addform = JSON.parse(JSON.stringify(row));
            this.addLang = true;
        },
        // 删除行
        removeRow (id, index) {
            var self = this;
            self.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                self.$http.post('admin/language/delete', {id: id}).then(res => {
                    self.changeTable();
                    self.$message({
                        type: 'success',
                        message: res.body.message
                    });
                });
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 添加语言弹窗
        showAddDialog () {
            this.addform.is_enable = 0;
            this.addform.country = '';
            this.addform.language_ch = '';
            this.addform.language_en = '';
            this.addform.code = '';
            this.addform.id = '';

            this.addLang = true;
            this.$nextTick(() => {
                this.$refs.addform.$children.forEach(item => {item.validateState = true;});
            });

        },
        // 添加语言弹窗 确定
        addLangBtn () {
            var self = this,
                src = 'admin/language/add';
            if (this.addform.id) {
                src = 'admin/language/edit';
            }
            self.$refs.addform.validate(valid => {
                if (valid) {
                    let params = JSON.parse(JSON.stringify(this.addform));
                    params.platform = this.option.platform;
                    self.addLangLoading = true;
                    self.$http.post(src, params).then(res => {
                        self.addLangLoading = false;

                        if (res.body.code == 0) {
                            self.changeTable(this.addform.platform);
                            self.$message({
                                message: res.body.message,
                                type: 'success'
                            });
                            self.addLang = false;
                        } else {
                            self.$message.error(res.body.message);
                        }
                    }).catch(err => {
                        self.addLangLoading = false;
                    });
                }
            })
        },
        // 切换标签页取值
        getPaneData (value) {
            var action = value.index;
            var self = this;
            if (action == 1) {
                self.getOrderData();
            }
        },
        // 订单状态
        getOrderData () {
            this.$http.get('admin/order-status/info').then(res => {
                if (res.body.code === 0) {
                    this.orderStatus = res.body.data;
                }
            })
        },
        statusChange (label) {
            if (this.changeFlag === 0) {
                this.$http.post('admin/order-status/edit', this.orderStatus).then(res => {
                    if (res.body.code == 0) {
                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            } else {
                this.changeFlag--;
            }
        },
    }
}
</script>

<style>
    .inline-text {line-height: 36px;}
    .codeTable i{cursor: pointer;}
    .showAutoTigger input{width: 120px;}
</style>

