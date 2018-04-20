<template>
    <div>
        <div class="el-container">

            <el-tabs v-model="options.tabActive" v-loading="dataLoading" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="风险名单用户" name="risks">
                    <el-table :data="tableData" border>
                        <el-table-column prop="userId" label="User-ID"></el-table-column>
                        <el-table-column prop="email" label="Email（登录账号）"></el-table-column>
                        <el-table-column prop="ipStr" label="IP地址"></el-table-column>
                        <el-table-column prop="event" label="事件摘要"></el-table-column>
                        <el-table-column label="创建时间">
                            <template scope="scope">
                                {{ scope.row.createDate ? self.timeZone_(scope.row.createDate, self.$store.getters.getTimeZone) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="操作人"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button v-if="self.showAction_('user/black-risk/move-to-black')" type="text" @click="handleBtnMoveClick(scope.row)">添加到黑名单</el-button> &nbsp;
                                <el-button v-if="self.showAction_('user/black-risk/delete-risk')" type="text" @click="handleBtnUnblockClick(scope.row, '用户')">解除状态</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="风险名单IP" name="risksIp">
                    <el-table :data="risksIpData.tableData" border>
                        <el-table-column prop="ipStr" label="IP地址"></el-table-column>
                        <el-table-column prop="event" label="事件摘要"></el-table-column>
                        <el-table-column label="创建时间">
                            <template scope="scope">
                                {{ scope.row.createDate ? self.timeZone_(scope.row.createDate, self.$store.getters.getTimeZone) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="操作人"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button v-if="self.showAction_('user/black-risk/move-to-black')" type="text" @click="handleBtnMoveClick(scope.row)">添加到黑名单</el-button> &nbsp;
                                <el-button v-if="self.showAction_('user/black-risk/delete-risk')" type="text" @click="handleBtnUnblockClick(scope.row, 'IP')">解除状态</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'risksIp')" @current-change="changePage($event, 'risksIp')" :current-page="risksIpData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="risksIpData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="risksIpData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="风险名单设备" name="risksImei">
                    <el-table :data="risksImeiData.tableData" border>
                        <el-table-column prop="imei" label="IMEI"></el-table-column>
                        <el-table-column label="设备类型">
                            <template scope="scope">
                                {{plateformText[scope.row.plateform]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="event" label="事件摘要"></el-table-column>
                        <el-table-column label="创建时间">
                            <template scope="scope">
                                {{ scope.row.createDate ? self.timeZone_(scope.row.createDate, self.$store.getters.getTimeZone) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="操作人"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button v-if="self.showAction_('user/black-risk/move-to-black')" type="text" @click="handleBtnMoveClick(scope.row)">添加到黑名单</el-button> &nbsp;
                                <el-button v-if="self.showAction_('user/black-risk/delete-risk')" type="text" @click="handleBtnUnblockClick(scope.row, 'IMEI')">解除状态</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'risksImei')" @current-change="changePage($event, 'risksImei')" :current-page="risksImeiData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="risksImeiData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="risksImeiData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>


                <el-tab-pane label="黑名单用户" name="blacks">
                    <el-table :data="blacksData.tableData" border>
                        <el-table-column prop="userId" label="User-ID"></el-table-column>
                        <el-table-column prop="email" label="邮箱地址"></el-table-column>
                        <el-table-column prop="ipStr" label="IP地址"></el-table-column>
                        <el-table-column prop="event" label="事件摘要"></el-table-column>
                        <el-table-column label="操作限制">
                            <template scope="scope">
                                {{ limitText[scope.row.limitType] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="解除时间">
                            <template scope="scope">
                                {{ scope.row.relieveDate ? self.timeZone_(scope.row.relieveDate, self.$store.getters.getTimeZone) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="操作人"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button v-if="self.showAction_('user/black-risk/submit-black')" type="text" @click="handleBtnEditBlackClick(scope.row)">修改</el-button> &nbsp;
                                <el-button v-if="self.showAction_('user/black-risk/move-to-risk')" type="text" @click="handleBtnUnblockBlackClick(scope.row, '用户')">解除状态</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'blacks')" @current-change="changePage($event, 'blacks')" :current-page="blacksData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="blacksData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="blacksData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="黑名单IP" name="blacksIp">
                    <el-table :data="blacksIpData.tableData" border>
                        <el-table-column prop="ipStr" label="IP地址"></el-table-column>
                        <el-table-column prop="event" label="事件摘要"></el-table-column>
                        <el-table-column label="操作限制">
                            <template scope="scope">
                                {{ limitText[scope.row.limitType] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="解除时间">
                            <template scope="scope">
                                {{ scope.row.relieveDate ? self.timeZone_(scope.row.relieveDate, self.$store.getters.getTimeZone) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="操作人"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button v-if="self.showAction_('user/black-risk/submit-black')" type="text" @click="handleBtnEditBlackClick(scope.row)">修改</el-button> &nbsp;
                                <el-button v-if="self.showAction_('user/black-risk/move-to-risk')" type="text" @click="handleBtnUnblockBlackClick(scope.row, 'IP')">解除状态</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'blacksIp')" @current-change="changePage($event, 'blacksIp')" :current-page="blacksIpData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="blacksIpData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="blacksIpData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="黑名单设备" name="blacksImei">
                    <el-table :data="blacksImeiData.tableData" border>
                        <el-table-column prop="imei" label="IMEI"></el-table-column>
                        <el-table-column label="设备类型">
                            <template scope="scope">
                                {{plateformText[scope.row.plateform]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="event" label="事件摘要"></el-table-column>
                        <el-table-column label="操作限制">
                            <template scope="scope">
                                {{ limitText[scope.row.limitType] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="解除时间">
                            <template scope="scope">
                                {{ scope.row.relieveDate ? self.timeZone_(scope.row.relieveDate, self.$store.getters.getTimeZone) : '' }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" label="操作人"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button v-if="self.showAction_('user/black-risk/submit-black')" type="text" @click="handleBtnEditBlackClick(scope.row)">修改</el-button> &nbsp;
                                <el-button v-if="self.showAction_('user/black-risk/move-to-risk')" type="text" @click="handleBtnUnblockBlackClick(scope.row, 'IMEI')">解除状态</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="el-container text-right">
                        <el-pagination @size-change="changePageSize($event, 'blacksImei')" @current-change="changePage($event, 'blacksImei')" :current-page="blacksImeiData.pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="blacksImeiData.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="blacksImeiData.pagination.totalCount"></el-pagination>
                    </div>
                </el-tab-pane>


            </el-tabs>
        </div>

        <!-- 移入黑名单弹窗S -->
        <el-dialog :title="editDlg.title" v-model="editDlg.isDlgShow" size="tiny">
            <el-form :model="editDlg" label-width="100px">
                <el-form-item label="事件摘要：">
                    <div>{{ editDlg.event }}</div>
                </el-form-item>
                <el-form-item label="操作限制：">
                    <el-select v-model="editDlg.limitType" :placeholder="editDlg.placeholder">
                        <el-option v-if="options.tabActive == 'risksIp' || options.tabActive == 'blacksIp' || options.tabActive == 'blacksImei' || options.tabActive == 'risksImei'" label="禁止注册" value="3"></el-option>
                        <el-option v-else v-for="(value, key) in limitText2" :label="value" :value="key" :key="key"></el-option>
                        <el-option label="禁止登录" value="1"  v-if="options.tabActive == 'blacksImei' || options.tabActive == 'risksImei'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="解除时间：">
                    <el-date-picker v-model="editDlg.relieveDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    <div class="color-silver">不设置解除时间，则一直处于黑名单状态</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDlg.isDlgShow = false">取消</el-button>
                <el-button type="primary" :loading="editDlg.isLoading" @click="handleBtnOkClick">确认</el-button>
            </span>
        </el-dialog>
        <!-- 移入黑名单弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableData: [],
            dataLoading: false,
            options: {
                tabActive: 'risks',
            },
            pagination: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
            },
            limitText: {
                '1': '禁止登录',
                '2': '禁止下单',
                '3': '禁止注册',
            },
            limitText2: {
                '1': '禁止登录',
                // '2': '禁止下单',
            },
            plateformText: {
                '1': 'PC',
                '2': 'Wap',
                '3': 'IOS',
                '4': 'Android',
                '5': 'Pad'
            },
            editDlg: {
                isDlgShow: false,
                isLoading: false,
                isMoveToBlack: true,
                title: '移动到黑名单',
                placeholder: '',
                id: '',
                event: '',
                limitType: '',
                relieveDate: ''
            },
            blacksData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                    status: 2,
                },
                tableData: []
            },
            risksIpData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                    status: 1,
                },
                tableData: []
            },
            blacksIpData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                    status: 2,
                },
                tableData: []
            },
            risksImeiData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                    status: 1,
                },
                tableData: []
            },
            blacksImeiData: {
                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    totalCount: 0,
                    status: 2,
                },
                tableData: []
            },
        };
    },
    created () {
        this.initData();
        // console.log(this.$store.getters.getAction)
    },
    methods: {
        initData () {
            this.getListData('risks');
        },
        getListData (name) {
            let path = name;
            let params = Object.assign({}, name == 'risks' ? this.pagination : this[name + 'Data'].pagination);
            delete params['totalCount'];
            params.objectId = 1;
            if (name === 'risksIp' || name === 'blacksIp') {
                params.objectId = 2;
                path = path.replace('Ip', '');
            } else if(name === 'risksImei' || name === 'blacksImei'){
                params.objectId = 3;
                path = path.replace('Imei', '');
            }
            this.tableData = [];
            this.dataLoading = true;
            this.$http.get('user/black-risk/' + path, { params: params }).then(res => {
                this.dataLoading = false;
                if (res.body.code !== 0) {
                    this.$notify.error(res.body.message || '发生错误');
                    return;
                }  
                if (name == 'risks') {
                    this.tableData = res.body.data.list.length ?  res.body.data.list : [];
                    this.pagination.totalCount = res.body.data.totalCount;
                } else {
                    this[name + 'Data'].tableData = res.body.data.list.length ? res.body.data.list : [];
                    this[name + 'Data'].pagination.totalCount = res.body.data.totalCount;
                }
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            })
        },
        changePage(value, name) {
            if (name) {
                this[name + 'Data'].pagination.pageNo = value;
            } else {
                this.pagination.pageNo = value;
            }
            this.getListData(this.options.tabActive);
        },
        changePageSize(value, name) {
            if (name) {
                this[name + 'Data'].pagination.pageSize = value;
                this[name + 'Data'].pagination.pageNo = 1;
            } else {
                this.pagination.pageSize = value;
                this.pagination.pageNo = 1;
            }
            this.getListData(this.options.tabActive);
        },
        handleTabClick(tab) {
            // if (!tab.isDataInited) {
            //     this.getListData(tab.name);
            //     tab.isDataInited = true;
            // }
            this.getListData(tab.name);
        },
        handleBtnMoveClick(row) {
            if (!row.id) {
                return;
            }
            let tableData = this.options.tabActive === 'risks' ? this.tableData : this[this.options.tabActive + 'Data'].tableData;
            this.editDlg.title = '移动到黑名单';
            this.editDlg.placeholder = this.options.tabActive === 'risksImei' ? '请选择对IMEI操作限制' : '请选择对用户操作限制';
            this.editDlg.isDlgShow = true;
            this.editDlg.isMoveToBlack = true;
            this.editDlg.id = row.id;
            this.editDlg.event = row.event;
            this.editDlg.limitType = '';
            this.editDlg.relieveDate = '';
            this.editDlg.index = tableData.indexOf(row);
        },
        handleBtnEditBlackClick(row) {
            if (!row.id) {
                return;
            }
            this.editDlg.title = '修改限制条件';
            this.editDlg.placeholder = this.options.tabActive === 'risksImei' ? '请选择对IMEI操作限制' : '请选择对用户操作限制';
            this.editDlg.isDlgShow = true;
            this.editDlg.isMoveToBlack = false;
            this.editDlg.id = row.id;
            this.editDlg.event = row.event;
            this.editDlg.limitType = row.limitType ? '' + row.limitType : '';
            this.editDlg.relieveDate = row.relieveDate ? row.relieveDate * 1000 : '';
            this.editDlg.index = this[this.options.tabActive + 'Data'].tableData.indexOf(row);
        },
        handleBtnOkClick() {
            let params = {
                id: this.editDlg.id,
                limitType: this.editDlg.limitType ? this.editDlg.limitType : '',
                relieveDate: this.editDlg.relieveDate ? (new Date(this.editDlg.relieveDate).getTime() / 1000).toFixed(0) - 0 : ''
            };
            // console.log(params)
            // return;
            this.editDlg.isLoading = true;
            this.$http.post('user/black-risk/move-to-black', params).then(res => {
                // console.log(res);
                let tableData = this.options.tabActive === 'risks' ? this.tableData : this[this.options.tabActive + 'Data'].tableData;
                this.editDlg.isLoading = false;
                this.editDlg.isDlgShow = false;
                if (res.body.code !== 0) {
                    this.$message.error(res.body.message || '保存出错');
                    return;
                }
                this.$message.success(res.body.message || '保存成功');
                // console.log(this.editDlg.index)
                if (this.editDlg.isMoveToBlack) {
                    tableData.splice(this.editDlg.index, 1);
                } else {
                    if (this.editDlg.limitType) {
                        tableData[this.editDlg.index].limitType = this.editDlg.limitType;
                    }
                    tableData[this.editDlg.index].relieveDate = this.editDlg.relieveDate ? (this.editDlg.relieveDate / 1000).toFixed(0) : '';
                    tableData[this.editDlg.index].operator = this.$store.getters.getUserName;
                    // console.log(this.blacksData.tableData[this.editDlg.index])
                }
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
                this.editDlg.isLoading = false;
                this.editDlg.isDlgShow = false;
            });
        },
        handleBtnUnblockClick(row, type) {
            this.$msgbox({
                title: '解除风险名单',
                message: `确认解除该${type}的风险名单？（如果该${type}触发其他风险事件，将再次进入风险名单）`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action !== 'confirm' || !row.id) {
                        done();
                        return;
                    }
                    let tableData = this.options.tabActive === 'risks' ? this.tableData : this[this.options.tabActive + 'Data'].tableData;
                    let index = tableData.indexOf(row);
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    this.$http.post('user/black-risk/delete-risk', { id: row.id }).then(res => {
                        // console.log(res);
                        done();
                        instance.confirmButtonLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message || '发生错误');
                            return;
                        }
                        this.$message.success(res.body.message || '解除成功');
                        tableData.splice(index, 1);
                    });
                }
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },
        handleBtnUnblockBlackClick(row, type) {
            this.$msgbox({
                title: '解除黑名单',
                message: `解除后该${type}会进入到风险用户名单中！`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action !== 'confirm' || !row.id) {
                        done();
                        return;
                    }
                    let tableData = this[this.options.tabActive + 'Data'].tableData;
                    let index = tableData.indexOf(row);
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    this.$http.post('user/black-risk/move-to-risk', { id: row.id }).then(res => {
                        // console.log(res);
                        done();
                        instance.confirmButtonLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message || '发生错误');
                            return;
                        }
                        this.$message.success(res.body.message || '执行成功');
                        tableData.splice(index, 1);
                    });
                }
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        }

    }
}
</script>