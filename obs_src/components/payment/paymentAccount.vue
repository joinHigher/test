<template>
    <!--收款账号管理-->
    <div>
        <div class="el-container table-account" v-loading="isDataLoading">
            <!-- <el-table :data="tableData" border stripe>
                <el-table-column prop="channelName" label="收款渠道"></el-table-column>
                <el-table-column label="主账号">
                    <template scope="scope">
                        <el-select v-model="scope.row.sltPrimary" :disabled="scope.row.enabledType == 'primary'">
                            <el-option v-for="(item, index) in scope.row.primaryPayAccounts" :label="item.payAccount" :value="item.payAccount" :key="index"></el-option>
                        </el-select>
                        <i :class="{'el-icon-circle-check color-success': scope.row.enabledType == 'primary', 'el-icon-circle-cross color-danger': scope.row.enabledType == 'standby'}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="备用账号">
                    <template scope="scope">
                        <el-select v-model="scope.row.sltStandby" :disabled="scope.row.enabledType == 'standby'">
                            <el-option v-for="(item, index) in scope.row.standbyPayAccounts" :label="item.payAccount" :value="item.payAccount" :key="index"></el-option>
                        </el-select>
                        <i :class="{'el-icon-circle-check color-success': scope.row.enabledType == 'standby', 'el-icon-circle-cross color-danger': scope.row.enabledType == 'primary'}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" @click="handleBtnToggleClick(scope.row)">切换备用账号</el-button>
                    </template>
                </el-table-column>
            </el-table> -->

            <el-card v-for="(row, index) in tableData" :key="index" :class="{ 'box-card': true, 'box-pp': row.channelCode === 'PAYPAL'}">
                <div slot="header" class="clearfix">
                    <strong>{{ row.channelName }}</strong>
                    <span v-if="row.channelCode === 'PAYPAL' && row.isShowDefaultAccount === 1"> &nbsp; &nbsp; 默认账号：{{ row.defaultAccount }}</span>
                    <span v-if="row.channelCode === 'PAYPAL'" class="pull-right">
                        <el-button v-if="self.showAction_('pay/account/save-rule')" type="primary" @click="handleBtnSaveRangesClick(row)">保存规则</el-button>
                        <el-button v-if="self.showAction_('pay/account/add')" type="primary" @click="handleBtnAddPayAccountClick">新建账号</el-button>
                        <el-button v-if="self.showAction_('pay/account/edit')" type="primary" @click="handleBtnEditPayAccountClick">编辑账号</el-button>
                    </span>
                </div>
                <div class="box-bd">
                    <!-- Paypal订单金额区间处理 -->
                    <div v-if="row.rangeWork && row.channelCode === 'PAYPAL'" class="range-wrap">
                        <el-row v-for="(range, index2) in row.ranges" v-if="range.accountType !== 1" :key="index2">
                            <el-col :span="14">
                                <div class="ipts">
                                    订单金额在
                                    <el-input type="number" v-model.number="range.minAmount" class="range-ipt"></el-input> 至
                                    <el-input type="number" v-model.number="range.maxAmount" class="range-ipt"></el-input> 之间时，指定收款账号为
                                </div>
                                <!-- <div>{{ range }}</div> -->
                            </el-col>
                            <el-col :span="8">
                                <div class="row-type">
                                    <label>主账号：</label>
                                    <el-select v-model="range.sltPrimary" :disabled="range.isPrimary">
                                        <el-option v-for="(item, i) in row.primaryPayAccounts" :label="item.payAccount" :value="item.payAccount" :key="i"></el-option>
                                    </el-select>
                                </div>
                                <div class="row-type">
                                    <label>备用账号：</label>
                                    <el-select v-model="range.sltStandby" :disabled="range.isStandby">
                                        <el-option v-for="(item, index) in row.standbyPayAccounts" :label="item.payAccount" :value="item.payAccount" :key="index"></el-option>
                                    </el-select>
                                </div>
                            </el-col>
                            <el-col :span="2" class="switchs">
                                <div><el-switch v-model="range.isPrimary" @change="handleSwitchChange(row, true, index2)" on-color="#13ce66" on-text="" off-text="" :disabled="!self.showAction_('pay/account/change')"></el-switch></div>
                                <div><el-switch v-model="range.isStandby" @change="handleSwitchChange(row, false, index2)" on-color="#13ce66" on-text="" off-text="" :disabled="!self.showAction_('pay/account/change')"></el-switch></div>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- 非禁用品账号与禁用品账号处理 -->
                    <div v-else-if="row.accountType == 2 || row.accountType == 3" class="range-wrap">
                        <el-row v-for="(range, index2) in row.ranges" :key="index2">
                            <el-col :span="14" class="desc-text">
                                <div v-if="range.accountType == 3">禁运品订单指定收款账号为</div>
                                <div v-else>非禁运品订单指定收款账号为</div>
                            </el-col>
                            <el-col :span="8">
                                <div class="row-type">
                                    <label>主账号：</label>
                                    <el-select v-model="range.sltPrimary" :disabled="range.isPrimary">
                                        <el-option v-for="(item, i) in row.primaryPayAccounts" :label="item.payAccount" :value="item.payAccount" :key="i"></el-option>
                                    </el-select>
                                </div>
                                <div class="row-type">
                                    <label>备用账号：</label>
                                    <el-select v-model="range.sltStandby" :disabled="range.isStandby">
                                        <el-option v-for="(item, index) in row.standbyPayAccounts" :label="item.payAccount" :value="item.payAccount" :key="index"></el-option>
                                    </el-select>
                                </div>
                            </el-col>
                            <el-col :span="2" class="switchs">
                                <div><el-switch v-model="range.isPrimary" @change="handleSwitchChange(row, true, index2)" on-color="#13ce66" on-text="" off-text="" :disabled="!range.sltPrimary || !self.showAction_('pay/account/change')"></el-switch></div>
                                <div><el-switch v-model="range.isStandby" @change="handleSwitchChange(row, false, index2)" on-color="#13ce66" on-text="" off-text="" :disabled="!range.sltStandby || !self.showAction_('pay/account/change')"></el-switch></div>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-else>
                        <el-row>
                            <el-col :span="14">&nbsp;</el-col>
                            <el-col :span="8">
                                <div class="row-type">
                                    <label>主账号：</label>
                                    <el-select v-model="row.sltPrimary" :disabled="row.enabledType == 'primary'">
                                        <el-option v-for="(item, i) in row.primaryPayAccounts" :label="item.payAccount" :value="item.payAccount" :key="i"></el-option>
                                    </el-select>
                                </div>
                                <div class="row-type">
                                    <label>备用账号：</label>
                                    <el-select v-model="row.sltStandby" :disabled="row.enabledType == 'standby'">
                                        <el-option v-for="(item, index) in row.standbyPayAccounts" :label="item.payAccount" :value="item.payAccount" :key="index"></el-option>
                                    </el-select>
                                </div>
                            </el-col>
                            <el-col :span="2" class="switchs">

                                <div><el-switch v-model="row.isPrimary" @change="handleSwitchChange(row, true)" on-color="#13ce66" on-text="" off-text="" :disabled="!row.sltPrimary || !self.showAction_('pay/account/change')"></el-switch></div>
                                <div><el-switch v-model="row.isStandby" @change="handleSwitchChange(row, false)" on-color="#13ce66" on-text="" off-text="" :disabled="!row.sltStandby || !self.showAction_('pay/account/change')"></el-switch></div>

                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-card>




        </div>

        <!--操作日志-->
        <div class="log-box">
          <el-tabs v-model="logTabs">
            <el-tab-pane label="操作日志" name="log"></el-tab-pane>
          </el-tabs>
          <el-table :data="log.logTabelData"  style="width: 50%" :show-header="false">
            <el-table-column prop="createTime" header-align="center" align="center" label="时间">
              <template scope="scope">
                {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
              </template>
            </el-table-column>
            <el-table-column prop="userName" align="left" label="操作人">
              <template scope="scope" v-if="scope.row.userName">
                {{scope.row.userName}}  修改了记录
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template scope="scope">
                <el-button type="primary" @click="logDetails(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="el-container last text-right log-pagination">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="log.params.pageNo" :page-sizes="[10,20,50]"
                           :page-size="log.params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="log.total"></el-pagination>
          </div>
        </div>

        <!-- 弹窗S -->
        <el-dialog :title="toggleDlg.isCloseBoth ? '关闭帐号' : '切换账号'" v-model="toggleDlg.isDlgShow" size="tiny">
            <div class="el-sub-container">{{ toggleDlg.isCloseBoth ? '关闭帐号' : '切换账号' }}会影响收款，请在下面注明{{ toggleDlg.isCloseBoth ? '关闭帐号' : '切换账号' }}的原因</div>
            <br>
            <div class="el-sub-container">
                <el-input v-model.trim="toggleDlg.remark" type="textarea" :rows="5" placeholder="请输入原因"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toggleDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="toggleDlg.isLoading" @click="handleBtnOkToggleClick">确认</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="editDlg.isAdd ? '新建账号' : '编辑账号'" v-model="editDlg.isDlgShow" size="tiny" class="edit-dlg">
            <el-form :model="editDlg" :rules="editDlgRules" class="editDlg" label-width="100px" ref="editDlg">
                <el-form-item v-if="!editDlg.isAdd" prop="sltAccount" label="选择账号：">
                    <el-select v-model="editDlg.sltAccount" @change="handleEditDlgAccountChange">
                        <el-option v-for="(item, index) in editablePaypalAccounts" :key="index" :value="item.payAccount" :label="item.payAccount"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="user" label="User：">
                    <el-input v-model.trim="editDlg.user" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item prop="pwd" label="Password：">
                    <el-input v-model.trim="editDlg.pwd" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item prop="signature" label="Signature：">
                    <el-input v-model.trim="editDlg.signature" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item prop="payAccount" label="账号Email：">
                    <el-input v-model.trim="editDlg.payAccount" :maxlength="100"></el-input>
                </el-form-item>
                <el-form-item prop="flag" label="设置为：">
                    <el-select v-model="editDlg.flag">
                        <el-option :value="0" label="主账号"></el-option>
                        <el-option :value="1" label="备用账号"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="editDlg.isDlgShow = false">取 消</el-button>
                <el-button type="primary" @click="handleBtnEditDlgOkClick" v-loading="editDlg.isLoading">确 定</el-button>
            </div>
        </el-dialog>

        <!--操作日志详情-->
        <el-dialog v-model="log.logDialog" size="small">
          <el-row class="text-left">
            <el-col :span="4">
              {{self.timeZone_(log.logDetailList.createTime, self.$store.getters.getTimeZone)}}
            </el-col>
            <el-col :span="3">{{log.logDetailList.userName}}</el-col>
            <el-col :span="17">
                <div style="word-break: break-all;">
                    {{ log.logDetailList.content }}
                </div>
            </el-col>
          </el-row>
        </el-dialog>
        <!-- 弹窗E -->

    </div>
</template>
<script>
export default {
    data() {
        return {
            self: this,
            isDataLoading: false,
            tableData: [],
            //accountLoggerList: [],
            toggleDlg: {
                isDlgShow: false,
                isLoading: false,
                isPrimaryChange: false,
                isCloseBoth: false,
                remark: '',
                row: null,
                range: null,
            },
            // 初始Paypal订单金额规则，关闭帐号接口使用
            tempPaypalRanges: [],
            //tabLoglist: 'first',

            rangeForm: {},
            rangeFormRules: {},

            // 没有使用的Paypal帐号为可编辑帐号
            editablePaypalAccounts: [],
            editDlg: {
                isDlgShow: false,
                isLoading: false,
                isAdd: true,
                id: -1,
                channelCode: 'PAYPAL',
                sltAccount: '',
                payAccount: '',
                user: '',
                pwd: '',
                signature: '',
                flag: 0,
            },
            editDlgRules: {
                sltAccount: [{ required: true, message: '请选择帐号', trigger: 'change' }],
                payAccount: [{ required: true, type: 'email', message: '请输入正确的Email', trigger: 'blur,change' }],
                user: [{ required: true, message: '不能为空', trigger: 'blur' }],
                pwd: [{ required: true, message: '不能为空', trigger: 'blur' }],
                signature: [{ required: true, message: '不能为空', trigger: 'blur' }],
            },
            platform: 1,
            logTabs: 'log',
            log: {
            params: {
              type: 4,
              pageSize: 10,
              pageNo: 1
            },
            total: 0,
            logTableLoading: false,
            logTabelData: [],
            logDialog: false,
            logDetailList: {
              createTime: '',
              userName: '',
              content: '',
            }
          },
        };
    },
    created() {
        this.getData();
        this.getLog();
    },
    methods: {
        getData() {
            this.isDataLoading = true;
            this.$http.get('pay/account/list').then(res => {
                this.isDataLoading = false;
                this.tableData = [];
                this.tempPaypalRanges = [];

                if (res.body.code !== 0) {
                    this.$message.error(res.body.message);
                    return;
                }
                Array.isArray(res.body.data.queryPayAccountRelations) && res.body.data.queryPayAccountRelations.forEach((item) => {
                    let enabledType = 'standby';
                    let sltPrimary = '';
                    let sltStandby = '';
                    let isPrimary = false;
                    let isStandby = false;
                    let ranges = [];
                    let obj = {};
                    item.primaryPayAccounts && item.primaryPayAccounts.some((item2) => {
                        if (item2.payAccount === item.payAccount) {
                            enabledType = 'primary';
                            isPrimary = true;
                            return true;
                        }
                    });
                    if (enabledType === 'primary') {
                        sltPrimary = item.payAccount;
                        sltStandby = item.standbyPayAccounts[0] ? item.standbyPayAccounts[0].payAccount : '';
                    } else {
                        sltPrimary = item.primaryPayAccounts[0] ? item.primaryPayAccounts[0].payAccount : '';
                        sltStandby = item.payAccount;
                        isStandby = true;
                    }
                    obj = {
                        enabledType,
                        sltPrimary,
                        sltStandby,
                        isPrimary,
                        isStandby,
                    };
                    // Paypal 处理
                    if (item.channelCode === 'PAYPAL' && item.rangeWork) {
                        let isArrayRanges = Array.isArray(item.ranges);
                        this.editablePaypalAccounts = [];
                        item.primaryPayAccounts.some((item2) => {
                            // 如果区间里面没有使用这个帐号，则放入可编辑帐号中
                            let isUsing = false;
                            isArrayRanges && item.ranges.some(range => {
                                if (range.payAccount === item2.payAccount) {
                                    isUsing = true;
                                    return true;
                                }
                            });
                            if (isUsing) {
                                return false;
                            }
                            this.editablePaypalAccounts.push(Object.assign({}, item2, { flag: 0 }));
                        });
                        item.standbyPayAccounts.some((item2) => {
                            // 如果区间里面没有使用这个帐号，则放入可编辑帐号中
                            let isUsing = false;
                            isArrayRanges && item.ranges.some(range => {
                                if (range.payAccount === item2.payAccount) {
                                    isUsing = true;
                                    return true;
                                }
                            });
                            if (isUsing) {
                                return false;
                            }
                            this.editablePaypalAccounts.push(Object.assign({}, item2, { flag: 1 }));
                        });
                        isArrayRanges && item.ranges.forEach(item2 => {
                            let sltPrimary2 = '';
                            let sltStandby2 = '';
                            let isPrimary2 = false;
                            let isStandby2 = false;
                            Array.isArray(item.primaryPayAccounts) && item.primaryPayAccounts.some((item3) => {
                                if (item3.payAccount === item2.payAccount) {
                                    isPrimary2 = true;
                                    sltPrimary2 = item3.payAccount;
                                    if (item.standbyPayAccounts[0]) {
                                        sltStandby2 = item.standbyPayAccounts[0].payAccount;
                                    }
                                    return true;
                                }
                            });
                            Array.isArray(item.standbyPayAccounts) && item.standbyPayAccounts.some((item3) => {
                                if (item3.payAccount === item2.payAccount) {
                                    isStandby2 = true;
                                    sltPrimary2 = item.primaryPayAccounts[0].payAccount;
                                    sltStandby2 = item3.payAccount;
                                    return true;
                                }
                            });
                            if (!isPrimary2 && !isStandby2) {
                                sltPrimary2 = item.primaryPayAccounts[0] ? item.primaryPayAccounts[0].payAccount : '';
                                sltStandby2 = item.standbyPayAccounts[0] ? item.standbyPayAccounts[0].payAccount : '';
                            }
                            ranges.push(Object.assign({}, item2, {
                                isPrimary: isPrimary2,
                                isStandby: isStandby2,
                                sltPrimary: sltPrimary2,
                                sltStandby: sltStandby2
                            }));
                            this.tempPaypalRanges.push(item2);
                        });
                        obj.ranges = ranges;
                    }
                    // 禁用品账号处理
                    if (item.accountType === 2 || item.accountType === 3) {
                        Array.isArray(item.ranges) && item.ranges.forEach(item2 => {
                            let sltPrimary2 = '';
                            let sltStandby2 = '';
                            let isPrimary2 = false;
                            let isStandby2 = false;
                            Array.isArray(item.primaryPayAccounts) && item.primaryPayAccounts.some((item3) => {
                                if (item3.payAccount === item2.payAccount) {
                                    isPrimary2 = true;
                                    sltPrimary2 = item3.payAccount;
                                    sltStandby2 = item.standbyPayAccounts[0] ? item.standbyPayAccounts[0].payAccount : '';
                                    return true;
                                }
                            });
                            Array.isArray(item.standbyPayAccounts) && item.standbyPayAccounts.some((item3) => {
                                if (item3.payAccount === item2.payAccount) {
                                    isStandby2 = true;
                                    sltPrimary2 = item.primaryPayAccounts[0] ? item.primaryPayAccounts[0].payAccount : '';
                                    sltStandby2 = item3.payAccount;
                                    return true;
                                }
                            });
                            if (!isPrimary2 && !isStandby2) {
                                sltPrimary2 = item.primaryPayAccounts[0] ? item.primaryPayAccounts[0].payAccount : '';
                                sltStandby2 = item.standbyPayAccounts[0] ? item.standbyPayAccounts[0].payAccount : '';
                            }
                            ranges.push(Object.assign({}, item2, {
                                isPrimary: isPrimary2,
                                isStandby: isStandby2,
                                sltPrimary: sltPrimary2,
                                sltStandby: sltStandby2
                            }));
                        });

                        obj.ranges = ranges;
                    }
                    this.tableData.push(Object.assign({}, item, obj));
                });
                this.tableData.forEach(item => {
                        item.isShowDefaultAccount = 0;
                        item.defaultAccount = '';
                        item.ranges.forEach(range => {
                            if (range.accountType === 1) {
                                item.isShowDefaultAccount = 1;
                                item.defaultAccount = range.payAccount;
                            }
                        });
                    });
                console.log(this.tableData);
               // this.accountLoggerList = res.body.data.accountLoggerList || [];
            },
            (err) => {
                this.isDataLoading = false;
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        handleSwitchChange (row, isPrimaryChange, index) {
            console.log(row, isPrimaryChange, index);
            // console.log(row.isPrimary, isPrimaryChange);
            let isPaypal = row.channelCode === 'PAYPAL';
            // 禁用品账号处理
            let isType2Or3 = row.accountType === 2 || row.accountType === 3;
            this.toggleDlg.isCloseBoth = false;
            if (isPrimaryChange) {
               // console.log('a');
                this.$nextTick(() => {
                    if (isPaypal) {
                        //console.log('a1');
                        row.ranges[index].isPrimary = !row.ranges[index].isPrimary;
                        // 关闭帐号
                        if (row.ranges[index].isPrimary) {
                            //console.log('a2');
                            this.toggleDlg.isCloseBoth = true;
                        }
                    } else {
                        //console.log('a3');
                        row.isPrimary = !row.isPrimary;
                    }
                });
            } else {
                //console.log('b');
                this.$nextTick(() => {
                    if (isPaypal) {
                        row.ranges[index].isStandby = !row.ranges[index].isStandby;
                        // 关闭帐号
                        if (row.ranges[index].isStandby) {
                            this.toggleDlg.isCloseBoth = true;
                        }
                    } else {
                        row.isStandby = !row.isStandby;
                    }
                });
            }
            if (!isPaypal) {
                //console.log('c');
                if (isType2Or3) {
                   // console.log('c1');
                    this.$nextTick(() => {
                        if (isPrimaryChange) {
                            row.ranges[index].isPrimary = !row.ranges[index].isPrimary;
                        } else {
                            row.ranges[index].isStandby = !row.ranges[index].isStandby;
                        }
                    });
                }
                if ((row.accountType === 2 || row.accountType === 3) && (!row.ranges[index].sltPrimary || !row.ranges[index].sltStandby)) {
                    //console.log('c2');
                    this.$message.error('必须开启一个收款账号');
                    return;
                }
                if (row.accountType !== 2 && row.accountType !== 3 && (!row.sltPrimary || !row.sltStandby)) {
                    //console.log('c3');
                    this.$message.error('必须开启一个收款账号');
                    return;
                }
            }

            if (index && !row.ranges[index].sltStandby) {
                //console.log('d');
                this.$message.error('必须开启一个收款账号');
                return false;
            }

            this.toggleDlg.isDlgShow = true;
            this.toggleDlg.row = row;
            this.toggleDlg.isPrimaryChange = isPrimaryChange;
            this.toggleDlg.range = typeof(index) !== 'undefined' ? row.ranges[index] : null;
        },
        // handleBtnToggleClick(row) {
        //     this.toggleDlg.isDlgShow = true;
        //     this.toggleDlg.row = row;
        // },
        handleBtnOkToggleClick() {
            let row = this.toggleDlg.row;
            let isToStandby = row.enabledType === 'primary';
            let params = null;
            if (!row) {
                return;
            }
            if (this.toggleDlg.remark.length < 5) {
                this.$message.error('切换账号原因不能少于5个字符');
                return;
            }
            params = {
                channelName: row.channelName,
                channelCode: row.channelCode,
                payAccount: isToStandby ? row.sltStandby : row.sltPrimary,
                id: this.toggleDlg.range ? this.toggleDlg.range.id : row.id,
                flag: isToStandby ? 1 : 0,
                remark: this.toggleDlg.remark
            };
            // Paypal 处理
            if (row.rangeWork && row.channelCode === 'PAYPAL') {
                let range = this.toggleDlg.range;
                let isPrimaryChange = this.toggleDlg.isPrimaryChange;
                params.flag = isPrimaryChange ? 0 : 1;
                // console.log(range);
                // 关闭帐号
                if ((range.isPrimary && isPrimaryChange) || (range.isStandby && !isPrimaryChange)) {
                    params.payAccount = '';
                }
                // 切换帐号
                else if (range.isPrimary !== range.isStandby) {
                    params.payAccount = range.isPrimary ? range.sltStandby : range.sltPrimary;
                    params.flag = !range.isPrimary ? 0 : 1;
                }
                // 启用两个关闭中的一个
                if (!range.isPrimary && !range.isStandby) {
                    params.payAccount = !isPrimaryChange ? range.sltStandby : range.sltPrimary;
                }
            }
            // 禁用品账号处理
            if (row.accountType === 2 || row.accountType === 3) {
                let range = this.toggleDlg.range;
                let isPrimaryChange = this.toggleDlg.isPrimaryChange;
                params.payAccount = range.isPrimary ? range.sltStandby : range.sltPrimary;
                params.flag = !range.isPrimary ? 0 : 1;
            }
            if (params.id === -1) {
                return;
            }
            // console.log(params);
            // return;
            // 关闭帐号
            if (params.payAccount === '' && row.channelCode === 'PAYPAL') {
                let obj = {
                    id: params.id,
                    payAccount: ''
                }
                let range = null;
                this.tempPaypalRanges.some(item => {
                    if (item.id === obj.id) {
                        obj.minAmount = item.minAmount;
                        obj.maxAmount = item.maxAmount;
                    }
                });
                if (!obj.maxAmount) {
                    return;
                }
                params = {
                    channelCode: row.channelCode,
                    payChannelAmountRangeDto: [obj],
                    channelName: row.channelName,
                    payAccount: row.payAccount
                };
                // console.log(params, row);
                // return;
                this.toggleDlg.isLoading = true;
                this.$http.post('pay/account/save-rule', params).then(res => {
                    this.toggleDlg.isLoading = false;
                    if (res.body.code !== 0) {
                        this.$message.error(res.body.message);
                        return;
                    }
                    if (!res.body.data) {
                        this.$message.error('切换失败');
                        return;
                    }
                    if (this.toggleDlg.range) {
                        this.toggleDlg.isDlgShow = false;
                        this.toggleDlg.row = null;
                        this.toggleDlg.remark = '';
                        this.toggleDlg.range = null;
                        this.getData();
                        return;
                    }
                },
                (err) => {
                    this.toggleDlg.isLoading = false;
                    this.$notify.error(err.body.message || '发生错误');
                });
                return;
            }
            // 切换帐号
            if (!params.payAccount) {
                this.$message.error('帐号不能为空');
                return;
            }
            this.toggleDlg.isLoading = true;
            this.$http.post('pay/account/change', params).then(res => {
                this.toggleDlg.isLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message);
                    return;
                }
                if (!res.body.data) {
                    this.$message.error('切换失败');
                    return;
                }
                this.toggleDlg.isDlgShow = false;
                this.toggleDlg.row = null;
                this.toggleDlg.remark = '';
                if (this.toggleDlg.range) {
                    this.toggleDlg.range = null;
                    this.getData();
                    return;
                }
                if (isToStandby) {
                    row.enabledType = 'standby';
                    row.isStandby = true;
                    row.isPrimary = false;
                } else {
                    row.enabledType = 'primary';
                    row.isPrimary = true;
                    row.isStandby = false;
                }
            },
            (err) => {
                this.toggleDlg.isLoading = false;
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        handleBtnSaveRangesClick (row) {
            let hasError = false;
            let arrAmount = [];
            let params = {
                channelCode: row.channelCode,
                payChannelAmountRangeDto: []
            };
            if (!Array.isArray(row.ranges)) {
                return;
            }

            row.ranges.some((item, index) => {
                if (item.accountType != 1) {
                    let min = parseFloat(item.minAmount);
                    let max = parseFloat(item.maxAmount);

                    if (isNaN(min) || min < 0 || isNaN(max) || max < 0 || min >= max) {
                        hasError = true;
                        this.$message.error('规则' + (index + 1) + '金额有误');
                        return true;
                    }

                    params.payChannelAmountRangeDto.push({
                        id: item.id,
                        minAmount: item.minAmount,
                        maxAmount: item.maxAmount,
                        payAccount: item.payAccount
                    });
                    arrAmount.push(min);
                    arrAmount.push(max);
                }
            });
            if (hasError) {
                return;
            }
            if (this.checkArrIntersection(arrAmount)) {
                this.$message.error('金额区间不能有交集');
                return;
            }

            this.isDataLoading = true;

            this.$http.post('pay/account/save-rule', params).then(res => {
                this.isDataLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message);
                    return;
                }
                this.$message.success(res.body.message);
            },
            (err) => {
                this.isDataLoading = false;
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        handleBtnAddPayAccountClick () {
            this.editDlg.isAdd = true;
            this.editDlg.isDlgShow = true;
            this.editDlg.id = -1;
            this.$nextTick(() => {
                this.$refs['editDlg'].resetFields();
            });
        },
        handleBtnEditPayAccountClick () {
            this.editDlg.isAdd = false;
            this.editDlg.isDlgShow = true;
            this.editDlg.sltAccount = '';
            this.$nextTick(() => {
                this.$refs['editDlg'].resetFields();
            });
        },
        handleEditDlgAccountChange (val) {
            this.editablePaypalAccounts.some(item => {
                if (item.payAccount === val) {
                    this.editDlg.id = item.id;
                    this.editDlg.flag = item.flag;
                    this.editDlg.payAccount = item.payAccount;
                    this.editDlg.user = item.authCode.user;
                    this.editDlg.pwd = item.authCode.pwd;
                    this.editDlg.signature = item.authCode.signature;
                    return true;
                }
            });
        },
        handleBtnEditDlgOkClick () {
            let hasError = false;
            let params = {};
            this.$refs['editDlg'].validate((valid) => {
                if (!valid) {
                    hasError = true;
                    return false;
                }
            });
            if (hasError) {
                return;
            }
            params = {
                channelCode: this.editDlg.channelCode,
                payAccount: this.editDlg.payAccount,
                flag: this.editDlg.flag,
                authCode: {
                    user: this.editDlg.user,
                    pwd: this.editDlg.pwd,
                    signature: this.editDlg.signature
                }
            }
            if (!this.editDlg.isAdd) {
                params.id = this.editDlg.id;
            }
            // console.log(params);
            // return;
            this.editDlg.isLoading = true;
            this.$http.post('pay/account/' + (this.editDlg.isAdd ? 'add' : 'edit'), params).then(res => {
                this.editDlg.isLoading = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message);
                    return;
                }
                this.$refs['editDlg'].resetFields();
                this.$message.success(res.body.message);
                this.editDlg.isDlgShow = false;
                this.getData();
            },
            (err) => {
                this.editDlg.isLoading = false;
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        // 数组的值是否有交集
        checkArrIntersection(arr) {
            let hasIntersection = false;
            for (let i = 0, len = arr.length; i < len - 1; i++) {
                if (arr[i + 1] - 0 <= arr[i] - 0) {
                    hasIntersection = true;
                    break;
                }
            }
            return hasIntersection;
        },

        getLog() {
          this.log.logTabelData = [];
          this.log.params.platform = this.platform;
          this.log.logTableLoading = true;
          this.$http.get('pay/log/list', {params: this.log.params}).then(res => {
            this.log.logTableLoading = false;
            //console.log(res);
            if (res.body.code !== 0) {
              this.$message.error(res.body.message);
            }
            if (res.body.data.list && res.body.data.list.length>0) {
                this.log.logTabelData = res.body.data.list;
                this.log.total = res.body.data.totalCount;
            }
          });
        },
        ChangePage (val) {
          this.log.params.pageNo = val;
          this.getLog();
        },
        ChangePageSize (val) {
          this.log.params.pageSize = val;
          this.getLog();
        },
        logDetails (row){
          this.log.logDialog = true;
          this.log.logDetailList.createTime = row.createTime;
          this.log.logDetailList.userName = row.userName;
          this.log.logDetailList.content = row.content;
        },
    }
}
</script>
<style lang="less">
.table-account {
    th, td { text-align: center; }
    td { padding-top: 10px; padding-bottom: 10px; }
    .el-select { width: 80%; }
    .el-select + i { margin-left: 10px; }

}
.range-wrap {
    .el-row { padding-top: 20px; border-top: 1px solid #ddd;
        &:first-child { padding-top: 0; border-top: none; }
    }
    .ipts { margin-top: 25px; }
    .range-ipt { margin: 0 10px; width: 120px;
        input { box-shadow: none; }
    }
    .desc-text { line-height: 36px; margin-top: 25px; padding-left: 65px; }
}
.box-card { margin-bottom: 15px;
    .el-card__header { padding-top: 0; padding-bottom: 0; line-height: 36px; }
    &.box-pp {
        .el-card__header { padding-top: 8px; padding-bottom: 8px; }
        .el-card__body { padding-left: 0; padding-right: 0; }
        .ipts { padding-left: 85px; }
    }
    .row-type {
        &:first-child { margin-bottom: 15px; }
        > label { float: left; width: 20%; line-height: 36px; }
    }
    .switchs {
        > div { height: 29px; margin-bottom: 15px; padding: 7px 0 0 20px; }
    }
}
.edit-dlg { min-width: 500px; }
.log-list {
    li { margin-bottom: 20px; }
}
.log-box{
  margin-left: 20px;
  .log-pagination{
    width: 49%;
  }
}
</style>
