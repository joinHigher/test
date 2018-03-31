<template>
	<div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/site/siteList'}">站点设置</el-breadcrumb-item>
                <el-breadcrumb-item>站点列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-tabs class="full" active-name="1" type="card" @tab-click="getPaneData">
                <el-tab-pane label="网站语言" name="1">
                    <el-row>
                        <el-col :span="4">
                            <el-form label-width="100px">
                                <el-form-item label="选择平台">
                                    <el-select @change="changeTable" v-model="plat">
                                        <el-option v-for="(item, index) in platformOpt" :label="item" :value="index" :selected="!(index - 1)" :key="index">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col class="text-right" :span="20">
                            <button v-if="self.showAction_('base/language/add')" class="el-button el-button--primary" @click="showAddDialog"><i class="el-icon-plus"></i> 添加语言</button>
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
                                    <router-link v-if="self.showAction_('base/language/edit')" :to="{name: 'site_langEdit', query: {id: scope.row.id}}" class="table-a">
                                    编辑
                                    </router-link>
                                    <el-button v-if="self.showAction_('base/language/delete')" size="small" type="text" class="color-danger" @click="removeRow(scope.row.id, scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="登录" name="2">
                    <p class="cat-title"><strong>验证码管理</strong></p>
                    <div class="el-container">
                        <el-row>
                            <el-col :span="12">
                                <el-table class="codeTable" border :data="loginCodeData">
                                    <el-table-column prop="platform" label="平台">
                                    </el-table-column>
                                    <el-table-column inline-template v-for="(item, i) in checkCodeLoop" :label="item.label">
                                        <i :class="{'el-icon-circle-check color-success': row.mode == i + 1, 'el-icon-circle-cross color-danger': row.mode != i + 1}" @click="changeState($index, i + 1, 'loginCodeData')"></i>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <el-button type="primary" @click.native.prevent="showAutoTigger = true">自动触发机制配置</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <p class="cat-title"><strong>IP白名单</strong></p>
                    <div class="el-container">
                        <el-form :inline="true" label-width="80px" :model="addIpData" ref="addIpData-log" :rules="addIpRule">
                            <el-row>
                                <el-col :span="18">
                                    <el-form-item label="开始IP" prop="ip_start">
                                        <el-input v-model="addIpData.ip_start"></el-input>
                                    </el-form-item>
                                    <el-form-item label="结束IP" prop="ip_end">
                                        <el-input v-model="addIpData.ip_end"></el-input>
                                    </el-form-item>
                                    <el-button type="primary" @click.native.prevent="addIP(1)">添加IP</el-button>
                                    <el-button type="primary" @click.native.prevent="searchIP(1)">筛选</el-button>
                                </el-col>
                                <el-col class="text-right" :span="6">
                                    <el-button type="danger" @click.native.prevent="removeSelectedIP(1)">批量删除</el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-table border :data="loginIpData" @selection-change="selectItems">
                            <el-table-column type="selection" >
                            </el-table-column>
                            <el-table-column prop="id" label="ID">
                            </el-table-column>
                            <el-table-column prop="ip_start" label="开始IP">
                            </el-table-column>
                            <el-table-column prop="ip_end" label="开始IP">
                            </el-table-column>
                            <el-table-column prop="comment" label="备注">
                            </el-table-column>
                            <el-table-column inline-template label="操作">
                                <el-button size="small" type="danger" @click.native="removeIp(row.id, 1)">删除</el-button>
                            </el-table-column>
                        </el-table>
                        <div class="el-container last text-right">
                            <el-pagination @size-change="loginChangePageSize" @current-change="loginChangePage" :current-page="1" :page-sizes="[20, 50]" :page-size="loginTable.page_size" layout="total, sizes, prev, pager, next, jumper" :total="this.loginTable.total"></el-pagination>
                        </div>
                    </div>
                    <p class="cat-title"><strong>第三方登录配置</strong></p>
                    <div class="el-container">
                        <table class="table-custom codeTable">
                            <thead>
                                <tr>
                                    <th>第三方</th>
                                    <template v-for="item in loginThirdTh">
                                        <th>
                                            {{item}}
                                        </th>
                                    </template>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in loginThirdData">
                                    <td>{{row.type}}</td>
                                    <template v-for="item in row.data">
                                        <td>
                                            <i :class="{'el-icon-circle-check color-success': item.status == '1', 'el-icon-circle-cross color-danger': item.status == '0'}" @click="changeThird(item.id, item.status)"></i>
                                        </td>
                                    </template>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="注册" name="3">
                    <p class="cat-title"><strong>注册信息限制规则</strong></p>
                    <div class="el-container">
                        <el-row>
                            <el-col :span="12">
                                <el-table border :data="noticeData">
                                    <el-table-column prop="mes" label="注册信息"></el-table-column>
                                    <el-table-column prop="format" label="格式"></el-table-column>
                                    <el-table-column prop="limit" label="字符限制"></el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </div>
                    <p class="cat-title"><strong>验证码管理</strong></p>
                    <div class="el-container">
                        <el-row>
                            <el-col :span="12">
                                <el-table class="codeTable" border :data="registerCodeData">
                                    <el-table-column prop="platform" label="平台">
                                    </el-table-column>
                                    <el-table-column inline-template v-for="(item, i) in checkCodeLoop" :label="item.label">
                                        <i :class="{'el-icon-circle-check color-success': row.mode == i + 1, 'el-icon-circle-cross color-danger': row.mode != i + 1}" @click="changeState($index, i + 1, 'registerCodeData')"></i>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                        <div class="el-sub-container">
                            <p><strong>***自动触发机制***</strong></p>
                            <p>1.正常注册时不需要输入验证码</p>
                            <p>2.同一IP地址在一天中(0点-24点)5次注册成功后，第6次注册要输入普通验证码</p>
                            <p>3.同一IP地址在一天中(0点-24点)10次注册成功后，第11次注册要输入高级验证码,并进入风险名单；</p>
                        </div>
                    </div>
                    <p class="cat-title"><strong>IP白名单</strong></p>
                    <div class="el-container">
                        <el-form :inline="true" label-width="80px" :model="addIpData" ref="addIpData-reg" :rules="addIpRule">
                            <el-row>
                                <el-col :span="18">
                                    <el-form-item label="开始IP" prop="ip_start">
                                    <el-input v-model="addIpData.ip_start"></el-input>
                                </el-form-item>
                                <el-form-item label="结束IP" prop="ip_end">
                                    <el-input v-model="addIpData.ip_end"></el-input>
                                </el-form-item>
                                <el-button type="primary" @click.native.prevent="addIP(2)">添加IP</el-button>
                                <el-button type="primary" @click.native.prevent="searchIP(2)">筛选</el-button>
                                </el-col>
                                <el-col class="text-right" :span="6">
                                    <el-button type="danger" @click.native.prevent="removeSelectedIP(2)">批量删除</el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-table border :data="registerIpData" @selection-change="selectItems">
                            <el-table-column type="selection">
                            </el-table-column>
                            <el-table-column prop="id" label="ID">
                            </el-table-column>
                            <el-table-column prop="ip_start" label="开始IP">
                            </el-table-column>
                            <el-table-column prop="ip_end" label="开始IP">
                            </el-table-column>
                            <el-table-column prop="comment" label="备注">
                            </el-table-column>
                            <el-table-column inline-template label="操作">
                                <el-button size="small" type="danger" @click.native="removeIp(row.id, 2)">删除</el-button>
                            </el-table-column>
                        </el-table>
                        <div class="el-container last text-right">
                            <el-pagination @size-change="registerChangePageSize" @current-change="registerChangePage" :current-page="1" :page-sizes="[20, 50]" :page-size="registerTable.page_size" layout="total, sizes, prev, pager, next, jumper" :total="this.registerTable.total"></el-pagination>
                        </div>
                    </div>
                    <p class="cat-title"><strong>第三方登录配置</strong></p>
                    <div class="el-container">
                        <table class="table-custom codeTable">
                            <thead>
                                <tr>
                                    <th>第三方</th>
                                    <template v-for="item in registerThirdTh">
                                        <th>
                                            {{item}}
                                        </th>
                                    </template>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in registerThirdData">
                                    <td>{{row.type}}</td>
                                    <template v-for="item in row.data">
                                        <td>
                                            <i :class="{'el-icon-circle-check color-success': item.status == '1', 'el-icon-circle-cross color-danger': item.status == '0'}" @click="changeThird(item.id, item.status)"></i>
                                        </td>
                                    </template>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-tab-pane> -->
                <el-tab-pane label="订单" name="4">
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
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="添加语言" v-model="addLang" size="tiny">
            <el-form :model="addform" ref="addform" :rules="addRule" label-width="100px">
                <el-form-item label="国家" prop="country">
                    <el-input v-model="addform.country"></el-input>
                </el-form-item>
                <el-form-item label="语言(中文)" prop="language_ch">
                    <el-input v-model="addform.language_ch"></el-input>
                </el-form-item>
                <el-form-item label="语言(英文)" prop="language_en">
                    <el-input v-model="addform.language_en"></el-input>
                </el-form-item>
                <el-form-item label="货币简码" prop="code">
                    <el-input v-model="addform.code"></el-input>
                </el-form-item>
                <el-form-item label="货币状态" prop="is_enable">
                    <el-radio-group v-model="addform.is_enable">
                        <el-radio class="radio" label="1">启用</el-radio>
                        <el-radio class="radio" label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-loading="addLangLoading" @click="addLangBtn">确 定</el-button>
                <el-button type="danger" @click.native="addLang = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog class="showAutoTigger" title="自动触发配置" v-model="showAutoTigger">
            <el-form :inline="true" :model="autotigger" :rules="aotutiggerRule" ref="autotigger">
                <div>
                    <span class="inline-text">输入</span>
                    <el-form-item prop="normal">
                        <el-input v-model="autotigger.normal"></el-input>
                    </el-form-item>
                    <span class="inline-text">次错误密码后出现普通验证码</span>
                </div>
                <div>
                    <span class="inline-text">输入</span>
                    <el-form-item prop="high">
                        <el-input v-model="autotigger.high"></el-input>
                    </el-form-item>
                    <span class="inline-text">次错误密码后出现高级验证码</span>
                </div>
                <div>
                    <span class="inline-text">输入</span>
                    <el-form-item prop="mail">
                        <el-input v-model="autotigger.mail"></el-input>
                    </el-form-item>
                    <span class="inline-text">次错误密码后触发邮件提醒</span>
                </div>
                <div>
                    <span class="inline-text">一天内同一IP发起</span>
                    <el-form-item prop="risk">
                        <el-input v-model="autotigger.risk"></el-input>
                    </el-form-item>
                    <span class="inline-text">次登陆请求后，出现高级验证码并进入风险名单</span>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="setAutoTigger">确 定</el-button>
                <el-button type="danger" @click.native="showAutoTigger = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
	</div>
</template>

<script>

export default {
  	data () {
        let self = this;
        // 检验规则
        var checkIp = (rule, value, callback) => {
            var reg = /(\d{1,3}\.){3}\d{1,3}/;
            if (value === '') {
                callback(new Error('请输入IP'));
            } else {
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的IP格式'));
                }
                callback();
            }
        };

        var checkAuto = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('该项不能为空值'));
            } else {
                if (Math.floor(value) == value && value > 0) {
                    callback();
                } else {
                    callback(new Error('该值只能为正整数'));
                }
            }
        };

  		return {
            self: this,
            tableLoading: false,
            addLangLoading: false,
            // 网络语言表格数据
            plat: '1',
  			tableData: [],
            selection: [],
            // 常量
            noticeData: [{
                mes: '用户名',
                format: '邮箱格式(......)',
                limit: '5-50'
            },{
                mes: '密码',
                format: '全字符(......)',
                limit: '6-24'
            }],
            // 自动触发
            autotigger: {
                normal: 1,
                high: 2,
                mail: 3,
                risk: 4
            },
            showAutoTigger: false,
            // 添加IP容器
            addIpData: {
                ip_start: '',
                ip_end: '',
                action: ''
            },
            // 登录验证码
            loginCodeData: [{
                platform: ''
            }],
            // 登录IP白名单
            loginIpData: [],
            // 登录IP表格规格
            loginTable:{
                page:1,
                page_size:20,
                total: 20
            },
            // 第三方登录配置
            loginThirdData: [{
                platform: ''
            }],
            loginThirdTh: [],
            // 注册验证码
            registerCodeData: [{
                platform: 'pc'
            }],
            // 注册IP白名单
            registerIpData: [],
            // 第三方登录配置
            registerThirdData: [{
                platform: ''
            }],
            registerThirdTh: [],
            // 注册IP表格规格
            registerTable:{
                page: 1,
                size:'20',
                total: 20
            },
            // 添加语言
            addLang: false,
            addform: {
                is_enable: '0',
                country: '',
                language_ch: '',
                language_en: '',
                code: ''
            },

            platformOpt: [],
            checkCodeLoop: [{
                label: '自动触发机制',
                number: 1
            },{
                label: '手动(普通验证)',
                number: 2
            },{
                label: '手动(高级验证)',
                number: 3
            }],
            orderStatus: {
                show_order_rma_status: '',
                show_order_case_status: ''
            },
            addRule: {
                country: [{
                    required: true,
                    message: '请输入国家',
                    trigger: 'blur'
                }],
                language_ch: [{
                    required: true,
                    message: '请输入语言(中文)',
                    trigger: 'blur'
                }],
                language_en: [{
                    required: true,
                    message: '请输入语言(英文)',
                    trigger: 'blur'
                }],
                code: [{
                    required: true,
                    message: '请输入货币简码',
                    trigger: 'blur'
                }],
                is_enable: [{
                    required: true,
                    message: '请选择货币状态',
                    trigger: 'change'
                }]
            },
            addIpRule: {
                ip_start: [{
                    required: true,
                    message: '请输入开始IP',
                    trigger: 'blur'
                }, {
                    validator: checkIp,
                    trigger: 'blur'
                }],
                ip_end: [{
                    required: true,
                    message: '请输入结束IP',
                    trigger: 'blur'
                }, {
                    validator: checkIp,
                    trigger: 'blur'
                }]
            },
            aotutiggerRule: {
                normal: [{
                    validator: checkAuto,
                    trigger: 'blur'
                }],
                high: [{
                    validator: checkAuto,
                    trigger: 'blur'
                }],
                mail: [{
                    validator: checkAuto,
                    trigger: 'blur'
                }],
                risk: [{
                    validator: checkAuto,
                    trigger: 'blur'
                }]
            },
            changeFlag: 2
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
            this.changeTable('1');
        },
        getplatform () {
            var self = this;

            self.$http.get('admin/public/platforms').then(res => {
                self.platformOpt = res.body.data;
            });
        },
        // 改变平台，切换表格
        changeTable (value) {
            var self = this;

            self.addform.platform = value;
            self.tableLoading = true;
            self.$http.get('base/language/list', {params: {platform: value}}).then(res => {
                self.tableLoading = false;
                if (res.body.code === 0) {
                    self.tableData = res.body.data;
                }
            });
        },
        // 删除行
        removeRow (id, index) {
            var self = this;
            self.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                self.$http.post('base/language/delete', {id: id}).then(res => {
                    self.tableData.splice(index, 1);
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
        // 表格选择回调函数
        selectItems (val) {
            var tempArr = [];

            val.forEach(function(el, index) {
                tempArr.push(el.id);
            });
            this.$set(this, 'selection', tempArr);
        },
        // 删除选中的行
        removeSelectedIP (action) {
            this.removeIp(this.selection, action)
        },
        // 添加语言弹窗
        showAddDialog () {
            var self = this;

            self.addform.is_enable = '0';
            self.addform.country = '';
            self.addform.language_ch = '';
            self.addform.language_en = '';
            self.addform.code = '';

            self.addLang = true;
        },
        // 添加语言弹窗 确定
        addLangBtn () {
            var self = this;

            self.$refs.addform.validate(valid => {
                if (valid) {
                    self.addLangLoading = true;
                    self.$http.post('base/language/add', this.addform).then(res => {
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
                    });
                }
            })
        },
        // 设置自动触发机制
        setAutoTigger () {
            var self = this;

            self.$refs.autotigger.validate(valid => {
                if (valid) {
                    self.$http.post('admin/captcha/set', self.autotigger).then(res => {
                        if (res.body.code == 0) {
                            self.$message({
                              message: res.body.message,
                              type: 'success'
                            });
                        } else {
                            self.$message.error(res.body.message);
                        }
                    });
                    self.showAutoTigger = false;
                }
            })

        },
        // 新增ip白名单
        addIP (action) {
            var self = this,
                formName = '';

            action = action *1;
            formName = (action == 1) ? 'addIpData-log' : 'addIpData-reg'

            self.$refs[formName].validate(valid => {
                if (!valid) {
                    return false;
                }
                else {
                    self.addIpData.action = action;
                    self.$http.post('admin/iplist/save', self.addIpData).then(res => {
                        if (res.body.code == 0) {
                            if (action == 1) {
                                self.loginTable.action = action;
                                self.getIpData(self.loginTable);
                            } else {
                                self.registerTable.action = action;
                                self.getIpData(self.registerTable);
                            }

                            self.addIpData.ip_start = '';
                            self.addIpData.ip_end = '';
                            self.$message({
                              message: res.body.message,
                              type: 'success'
                            });
                        } else {
                            self.$message.error(res.body.message);
                        }
                    });
                }
            })

        },
        // 删除IP白名单
        removeIp (id, action) {
            var self = this;
            action = action *1;

            if (typeof id == 'string') {
                var notice = '是否删除此IP';
            } else if (typeof id == 'object') {
                var notice = '是否删除选中的IP';
                id = id.join(',');
            }
            self.$confirm(notice, '提示', {
                type: 'warning'
            }).then(() => {
                self.$http.post('admin/iplist/delete', {id: id}).then(res => {
                    if (res.body.code == 0 ){
                        if (action == 1) {
                            self.loginTable.action = action;
                            self.getIpData(self.loginTable);
                        } else {
                            self.registerTable.action = action;
                            self.getIpData(self.registerTable);
                        }

                        self.$message({
                          message: res.body.message,
                          type: 'success'
                        });
                    } else {
                        self.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 切换标签页取值
        getPaneData (value) {
            var action = value.index;
            var self = this;
            if (action == 1) {
                self.getOrderData();
            }
            // if (action == 1) {
            //     self.loginTable.action = action;

            //     self.getCodeData(action, 'loginCodeData');
            //     self.getIpData(this.loginTable);
            //     self.getAuto();
            //     self.getThirdData(action, 'loginThirdData');
            // } else if (action == 2) {
            //     self.registerTable.action = action;

            //     self.getCodeData(action, 'registerCodeData');
            //     self.getIpData(this.registerTable);
            //     self.getThirdData(action, 'registerThirdData');
            // } else if (action == 3) {
            //     self.getOrderData();
            // }
        },
        // 取自动验证机制
        getAuto () {
            this.$http.get('admin/captcha/auto').then(res => {
                if (res.code === 0) {
                    this.autotigger = res.body.data;
                }
            });
        },
        // 改变验证码状态
        changeState (index, col, obj){
            var id;
            var self = this;

            if (obj == 'loginCodeData') {
                id = index + 1;
            } else {
                id = index + 5;
            }

            if (this[obj][index].mode == col) {
                col = 0;
            }
           self.$http.post('admin/captcha/save', {id: id, mode: col}).then(res => {
                    if (res.body.code == 0) {
                        self.$set(this[obj][index], 'mode', col)
                        self.$message({
                          message: res.body.message,
                          type: 'success'
                        });
                    } else {
                        self.$message.error(res.body.message);
                    }
            });
        },
        // 取验证码
        getCodeData (action, attr) {
            action = action * 1;
            this.$http.get('captcha/list', {params: {action: action}}).then(res => {
                this[attr] = res.body.data;
            });
        },
        // 取IP
        getIpData (option) {
            var self = this;

            if (!option['page_size']) {
                option['page_size'] = 20;
            };
            self.$http.get('iplist/list', {params: option}).then(res => {
                if (option['action'] == 1) {
                    self.loginIpData = res.body.data.data;
                    for (var i in option) {
                        self.loginTable[i] = option[i]
                    }
                    self.loginTable.total = res.body.data.total * 1;
                } else {
                    self.registerIpData = res.body.data.data;
                    for (var i in option) {
                        self.registerTable[i] = option[i]
                    }
                    self.registerTable.total = res.body.data.total * 1;
                }
            })
        },
        // 取第三方登录配置
        getThirdData (action, attr) {
            this.$http.get('admin/thirdparty/list', {params: {action: action}}).then(res => {
                if (res.code === 0) {
                    var data = res.body.data;
                    var tempObj = {};
                    var platformArr = [];
                    var tempArr = [];

                    for (var i in data) {
                        platformArr.push(data[i].type);
                    }
                    for (var j = 0; j < platformArr.length; j++) {
                        if (!tempObj[platformArr[j]]) {
                            tempObj[platformArr[j]] = 1;
                            tempArr.push(platformArr[j])
                        }
                    }
                    this[attr] = [];

                    for (var k = 0; k < tempArr.length; k++) {
                        var resObj = {
                            data: {},
                            platform: [],
                        };

                        resObj['type'] = tempArr[k];
                        for (var i in data) {
                            if (data[i].type == tempArr[k]) {
                                resObj.platform.push(data[i].platform);
                                resObj.data[data[i].platform.toLowerCase()] = data[i];
                            }
                        }
                        this[attr].push(resObj)
                    }
                    if (attr == 'loginThirdData') {
                        this.loginThirdTh = this[attr][0].platform;
                    } else {
                        this.registerThirdTh = this[attr][0].platform;
                    }
                }
            })
        },
        // 修改第三方配置
        changeThird (id, status) {
            var self = this;
            var log;

            status = (status === '1') ? '0' : '1';
            self.$http.post('admin/thirdparty/save', {id: id, status: status}).then(res => {
                if (res.body.code == 0) {
                    log = (res.body.data.action == '1') ? 'loginThirdData' : 'registerThirdData';
                    for (var i in this[log]) {
                        if (this[log][i].type = res.body.data.type) {
                            for (var j in this[log][i].data) {
                                if (this[log][i].data[j].id == res.body.data.id) {
                                    this.$set(this[log][i].data[j], 'status', status);

                                    self.$message({
                                      message: res.body.message,
                                      type: 'success'
                                    });

                                    return false;
                                }
                            }
                        }
                    }

                } else {
                    self.$message.error(res.body.message);
                }
            })
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
        // 分页、搜索
        loginChangePage (index) {
            var self =this;

            self.loginTable.page = index;
            self.getIpData(self.loginTable);
        },
        loginChangePageSize (size) {
            var self =this;

            self.loginTable.page_size = size;
            self.getIpData(self.loginTable);
        },
        registerChangePage (index) {
            var self =this;

            self.registerTable.page = index;
            self.getIpData(self.registerTable);
        },
        registerChangePageSize (size) {
            var self =this;

            self.registerTable.page_size = size;
            self.getIpData(self.registerTable);
        },
        searchIP (action) {
            var self = this;

            if (action == 1) {
                for (var i in this.addIpData) {
                    self.loginTable[i] = this.addIpData[i];
                    self.loginTable.action = 1;
                }
                self.getIpData(this.loginTable);
            } else {

                for (var i in this.addIpData) {
                    self.registerTable[i] = this.addIpData[i];
                    self.registerTable.action = 2;
                }
                self.getIpData(this.registerTable);
            }

        }
    }
}
</script>

<style>
    .inline-text {line-height: 36px;}
    .codeTable i{cursor: pointer;}
    .showAutoTigger input{width: 120px;}
</style>

