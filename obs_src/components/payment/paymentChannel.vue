<template>
  <!--支付渠道管理-->
    <div>
        <div class="el-container site-detail-bar" v-if="siteDetail.show">
            <el-radio-group  v-model="platform" @change="handleNavClick">
                <template v-for="(item, key) in platforms">
                    <el-radio-button :label="item">{{key}}</el-radio-button>
                </template>
            </el-radio-group>
            <el-button type="info" :plain="true" @click="siteDetail.show = false">返回列表</el-button>
        </div>

        <div class="el-container payment-channel" v-loading="isDataLoading">
            <div>
                <el-row>
                    <el-col :span="12"><div class="add-country-label">添加国家：</div></el-col>
                    <el-col :span="12" class="text-right ctr-bar">
                        <template v-if="siteDetail.show">
                            <el-select class="select-site" v-model="pipelineCode" placeholder="请选择">
                                <el-option
                                    v-for="item in siteDetail.siteList"
                                    :key="item.pipeline_code"
                                    :label="item.pipeline_name"
                                    :value="item.pipeline_code">
                                </el-option>
                            </el-select>

                            <!--<el-button type="primary" @click="siteDetail.showSelectSiteList = true">新增生效站点</el-button>-->

                        </template>

                        <el-button type="warning" v-show="!siteDetail.show" @click="siteDetail.show = true">生效站点</el-button>
                        <el-button v-if="showAction_('pay/channel/update-setting')" type="primary" @click="show3DSSetting = true">3DS设置</el-button>
                        <el-button v-if="showAction_('pay/channel/country-relation')" type="primary" @click="handleAddAllCountrys">查看所有国家</el-button>
                        <el-button v-if="showAction_('pay/channel/update-country-relation')" type="primary" @click="handleSaveTableData">保存</el-button>
                        <el-button type="danger" @click="handleDelAllCountrys">全部移除</el-button>
                    </el-col>
                </el-row>
                <div>
                    <el-form :model="countryForm" ref="countryForm" class="country-form" label-width="0">
                        <el-form-item prop="channelCode">
                            <el-select v-model="countryForm.countrys" multiple filterable placeholder="请选择国家或者输入国家关键词" @change="handleCountryChange">
                                <el-option v-for="item in allCountrys" :key="item.countryCode" :label="item.countryName" :value="item.countryName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="table-box" :style="{maxHeight: maxHeight}">
                    <table class="country-table" cellpadding="0" cellspacing="0">
                        <thead>
                        <tr>
                            <th width="100">支付渠道总开关</th>
                            <th class="switch-th" v-for="(item, index) in payChannels" :key="index">
                                <div class="channel-title">{{item.channelName}} <span v-if="item.is3DS == 1" class="pull-right">3DS</span></div>
                                <div class="channel-switchs">
                                    <el-switch v-model="item.enabled" :width="35" on-color="#13ce66" off-color="#ff4949" on-text="" off-text=""></el-switch>
                                </div>
                            </th>
                            <th>操作</th>
                        </tr>
                        <tr>
                            <th width="100">国家子开关全选</th>
                            <th v-for="(item, index) in payChannels" :key="index">
                                <el-checkbox v-model="item.isCheckAll" @change="handleChannelChangeAll(item)" :disabled="!item.enabled"></el-checkbox>
                                <el-checkbox v-if="item.is3DS == 1" v-model="item.isCheckAll3DS" @change="handleChannelChangeAll3DS(item, $event)" :disabled="!item.enabled" class="pull-right"></el-checkbox>
                            </th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(country, index) in tableData" :key="index">
                                <td>{{country.countryName}}</td>
                                <td v-for="(item, index2) in payChannels" :key="item.channelCode">
                                    <el-checkbox v-model="country.channels[index2].isChecked" :label="item.channelCode" :disabled="!item.enabled"></el-checkbox>
                                    <el-checkbox v-if="item.is3DS" v-model="country.tChannels[index2].isChecked" :label="item.channelCode" class="pull-right" :disabled="!item.enabled || !country.channels[index2].isChecked"></el-checkbox>
                                </td>
                                <td>
                                    <el-button type="danger" @click="handleDelTableRow(country, index)">移除</el-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="text-right ctr-bar">
                <template v-if="siteDetail.show">
                    <el-select class="select-site" v-model="pipelineCode" placeholder="请选择">
                        <el-option
                            v-for="item in siteDetail.siteList"
                            :key="item.pipeline_code"
                            :label="item.pipeline_name"
                            :value="item.pipeline_code">
                        </el-option>
                    </el-select>
                    <!--<el-button type="primary" @click="siteDetail.showSelectSiteList = true">新增生效站点</el-button>-->
                </template>

                <el-button type="warning" v-show="!siteDetail.show" @click="siteDetail.show = true">生效站点</el-button>
                <el-button v-if="showAction_('pay/channel/update-setting')" type="primary" @click="show3DSSetting = true">3DS设置</el-button>
                <el-button v-if="showAction_('pay/channel/country-relation')" type="primary" @click="handleAddAllCountrys">查看所有国家</el-button>
                <el-button v-if="showAction_('pay/channel/update-country-relation')" type="primary" @click="handleSaveTableData">保存</el-button>
                <el-button type="danger" @click="handleDelAllCountrys">全部移除</el-button>
            </div>
        </div>

        <!-- 弹窗S -->
        <el-dialog title="3DS设置" v-model="show3DSSetting" size="tiny" class="edit-dlg-wrap">
            <three-ds-seting :payChannels="payChannels" v-model="show3DSSetting"></three-ds-seting>
        </el-dialog>


        <!--选择站点-->
        <!--<el-dialog class="select-site-dialog" title="添加生效站点" v-model="siteDetail.showSelectSiteList" size="tiny">
            <div class="site">
                <el-radio class="radio" v-model="siteDetail.addSite" label="1">备选项</el-radio>
                <el-radio class="radio" v-model="siteDetail.addSite" label="2">备选项</el-radio>
            </div>
            <div slot="footer">
                <el-button :disabled="!siteDetail.addSite" type="primary" @click="onAddSite">确 认</el-button>
            </div>
        </el-dialog>-->
        <!-- 弹窗E -->

    </div>
</template>

<script>
    import utils from '@/common/utils'
    import threeDsSeting from '../../pageComponents/payment/threeDsSeting'
    import { getPipelines, getPlatforms } from '../../common/baseApi'

    export default {
        components: {
            threeDsSeting
        },
        data() {
            return {
                maxHeight: '200px',
                isDataLoading: false,
                platforms:[],
                pipelineCode: '', // 渠道
                platform: '', //平台

                countryFormCountrysChangeFlag: false,
                countryForm: {
                    countrys: '',
                    countryPayTypes: {},
                    payChannelRelations: []
                },
                allCountrys: [],
                allCountrysStr: '',
                countryNameToCode: {},
                tableData: [
                    // {
                    //     channelCode: ['PP'],
                    //     countryCode: 'AF',
                    //     countryName: 'Afghanistan',
                    //     tChannelCode: ['WP'],
                    // }
                ],
                tempTableData: [],
                payChannels: [],
                isAddAllCountry: false,

                show3DSSetting: false,
                siteDetail: {
                    show: false,
                    // showSelectSiteList: false,
                    // addSite: '',
                    siteList: []
                }
            };
        },
        mounted() {
            this._resize = function(e) {
                this.maxHeight = `${utils.tools.getTableHeight(350)}px`
            }.bind(this);

            window.addEventListener("resize", this._resize, false)
            this._resize()
        },
        beforeDestroy(){
            window.removeEventListener('resize', this._resize)
        },
        created() {
            this.initData()
        },
        watch: {
            'siteDetail.show'(newVal){
                if (newVal) {
                    // 显示详细终端 + 站点
                    this.platform = 1
                    this._getPipelines()
                } else {
                    this.platform = ''
                    this.pipelineCode = ''
                }
                this._resetData()
            },
            pipelineCode(){
                this._resetData()
            }
        },
        methods: {
            async _getPipelines() {
                this.siteDetail.siteList = [{
                    pipeline_code: '',
                    pipeline_name: '默认站'
                }]
                // 默认渠道(子站点)
                this.pipelineCode = ''

                const siteList = await getPipelines({
                    params: {
                        platform_id: this.platform
                    }
                })

                this.siteDetail.siteList = this.siteDetail.siteList.concat(siteList)
            },
            async initData(){
                // const getPipelines = this.promiseData('admin/pipeline/list')
                const platforms = await getPlatforms()
                this.platforms = platforms

                this.getData()
            },
            getData() {
                this.isDataLoading = true
                let {platform, pipelineCode} = this
                let params = {platform, pipelineCode}

                // 谜之 siteCode
                // !this.siteDetail.show && (params.siteCode = 'false')

                this.$http.get('pay/channel/list', {
                    params
                }).then(({body: {code, message, data}}) => {
                    this.isDataLoading = false
                    if (code !== 0) {
                        this.$message.error(message)
                        return
                    }

                    // 渠道数据
                    Array.isArray(data.payChannels) && data.payChannels.forEach(item => {
                        this.payChannels.push({
                            ...item,
                            isCheckAll: false,
                            isCheckAll3DS: false
                        })
                    })

                    // 国家数据
                    Array.isArray(data.countrys) && data.countrys.forEach(item => {
                        this.allCountrys.push(item)
                        this.allCountrysStr += item.countryCode + '-'
                        this.countryNameToCode[item.countryName] = item.countryCode
                    })

                }, err => {
                    this.isDataLoading = false
                    this.$notify.error(err.body.message || '发生错误')
                })
            },

            handleCountryChange(arr) {
                let val = [];
                if (this.countryFormCountrysChangeFlag) {
                    return;
                }
                if (this.isAddAllCountry) {
                    //添加所有国家时候不触发change事件
                    return;
                }
                this.countryFormCountrysChangeFlag = true;
                this.countryForm.countrys.sort((a, b) => {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
                val = this.countryForm.countrys.slice(0);
                this.$nextTick(() => {
                    this.countryFormCountrysChangeFlag = false;
                });
                // return;
                let newCountrys = [];
                let toDelCountrys = [];
                val.forEach((item, index) => {
                    // let arr = item.split('-');
                    let countryCode = this.countryNameToCode[item] || '';
                    let isNew = true;
                    this.tableData.some(row => {
                        if (row.countryCode === countryCode) {
                            isNew = false;
                            return true;
                        }
                    });
                    if (isNew) {
                        // let index = null;//this.countryNameToCode.indexOf(item);
                        let arr2 = [];
                        let arr3 = [];
                        let obj = null;
                        for (let i = 0, len = this.payChannels.length; i < len; i++) {
                            arr2.push({isChecked: false});
                            arr3.push({isChecked: false});
                        }
                        obj = {
                            channelCode: [],
                            countryCode: countryCode,
                            countryName: item,
                            tChannelCode: [],
                            channels: arr2,
                            tChannels: arr3,
                        };
                        this.tableData.splice(index, 0, obj);
                        this.tempTableData.splice(index, 0, JSON.parse(JSON.stringify(obj)));
                        newCountrys.push({country: item, index: index});
                    }
                });
                this.tableData.forEach((row, index) => {
                    let isToDel = true;
                    val.some(item => {
                        let countryCode = this.countryNameToCode[item] || '';
                        if (row.countryCode === countryCode) {
                            isToDel = false;
                            return true;
                        }
                    });
                    if (isToDel) {
                        toDelCountrys.push(row);
                        this.tableData.splice(index, 1);
                        this.tempTableData.splice(index, 1);
                    }
                });

                newCountrys.some(item => {
                    // let arr = item.country.split('-');
                    let params = {
                        countryCode: this.countryNameToCode[item.country] || '',
                        countryName: item.country,
                        platform: this.platform,
                        pipelineCode: this.pipelineCode
                    }

                    // 谜之 siteCode
                    // !this.siteDetail.show && (params.siteCode = 'false')

                    // console.log(item);
                    if (!params.countryCode) {
                        return false;
                    }

                    this.$http.get('pay/channel/country-relation', {
                        params
                    }).then(({body: {data, code, message}}) => {
                        let row = this.tableData[item.index];
                        let tempRow = this.tempTableData[item.index];
                        let channel = data.payChannelRelations || data;
                        if (code !== 0 || !channel || !row) {
                            this.$message.error(message)
                            return;
                        }
                        channel[0] && Array.isArray(channel[0].channelCode) && channel[0].channelCode.forEach(item2 => {
                            row.channelCode.push(item2);
                            tempRow.channelCode.push(item2);
                            this.payChannels.some((ch, index) => {
                                if (ch.channelCode === item2) {
                                    row.channels[index].isChecked = true;
                                    tempRow.channels[index].isChecked = true;
                                    return true;
                                }
                            });
                        });
                        channel[0] && Array.isArray(channel[0].tChannelCode) && channel[0].tChannelCode.forEach(item2 => {
                            row.tChannelCode.push(item2);
                            tempRow.tChannelCode.push(item2);
                            this.payChannels.some((ch, index) => {
                                if (ch.is3DS && ch.channelCode === item2) {
                                    row.tChannels[index].isChecked = true;
                                    tempRow.tChannels[index].isChecked = true;
                                    return true;
                                }
                            });
                        });
                        // console.log(row)
                    });
                });
            },
            handleAddAllCountrys() {
                //1.添加选中所有的国家
                this.isAddAllCountry = true;
                this.isDataLoading = true;
                debugger
                const params = {
                    platform: this.platform,
                    countryCode: '',
                    countryName: '',
                    pipelineCode: this.pipelineCode
                }

                // 谜之 siteCode
                // !this.siteDetail.show && (params.siteCode = 'false')

                this.$http.get('pay/channel/country-relation', { params }).then(res => {
                        let list = res.body.data.payChannelRelations || res.body.data;

                        let tempArr = [];
                        this.isDataLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message);
                            return;
                        }
                        this.tableData = [];
                        this.tempTableData = [];
                        this.countryForm.countrys = [];
                        Array.isArray(list) && list.some(item => {
                            if (this.allCountrysStr.indexOf(item.countryCode) === -1) {
                                return false;
                            }
                            // this.tableData.push(Object.assign({}, item));
                            let arr2 = [];
                            let arr3 = [];
                            for (let i = 0, len = this.payChannels.length; i < len; i++) {
                                arr2.push({isChecked: item.channelCode && item.channelCode.indexOf(this.payChannels[i].channelCode) !== -1});
                                arr3.push(this.payChannels[i].is3DS ? {isChecked: item.tChannelCode && item.tChannelCode.indexOf(this.payChannels[i].channelCode) !== -1} : {});
                            }

                            this.tableData.push({
                                channelCode: Array.isArray(item.channelCode) ? item.channelCode : [],
                                tChannelCode: Array.isArray(item.tChannelCode) ? item.tChannelCode : [],
                                countryCode: item.countryCode,
                                countryName: item.countryName,
                                channels: arr2,
                                tChannels: arr3,
                            });
                            this.tempTableData.push({
                                channelCode: Array.isArray(item.channelCode) ? item.channelCode.slice(0) : [],
                                tChannelCode: Array.isArray(item.tChannelCode) ? item.tChannelCode.slice(0) : [],
                                countryCode: item.countryCode,
                                countryName: item.countryName,
                                channels: JSON.parse(JSON.stringify(arr2)),
                                tChannels: JSON.parse(JSON.stringify(arr3)),
                            });
                            tempArr.push(item.countryName);
                        });
                        tempArr.sort((a, b) => {
                            return a.toLowerCase().localeCompare(b.toLowerCase());
                        });
                        this.countryForm.countrys = tempArr.slice(0);
                        this.$nextTick(() => {
                            this.isAddAllCountry = false;
                        });
                    },
                    (err) => {
                        this.isDataLoading = false;
                        this.$notify.error(err.body.message || '发生错误');
                    });
            },

            handleChannelChangeAll(item) {
                let index = this.payChannels.indexOf(item);
                let code = item.channelCode;
                if (index === -1) {
                    return;
                }
                // console.log(index, item);
                this.tableData.forEach((row, index2) => {
                    row.channels[index].isChecked = item.isCheckAll;
                    // row.tChannels[index].isChecked = item.isCheckAll;
                });
            },
            handleChannelChangeAll3DS(item, event) {
                let index = this.payChannels.indexOf(item);
                let code = item.channelCode;
                if (index === -1) {
                    return;
                }
                // console.log(item.isCheckAll3DS, event.target.checked);
                this.tableData.forEach((row, index2) => {
                    // row.channels[index].isChecked = item.isCheckAll;
                    if (row.channels[index].isChecked) {
                        row.tChannels[index].isChecked = event.target.checked;
                    }
                });
            },
            handleDelAllCountrys() {
                this.isAddAllCountry = true;
                this.tableData = [];
                this.tempTableData = [];
                this.countryForm.countrys = [];
                this.$nextTick(() => {
                    this.isAddAllCountry = false;
                });
            },
            handleSaveTableData() {
                // this.countryForm.countrys = ["AF-Afghanistans", "AL-Albania", "DZ-Algeria"];
                // // console.log(this.countryForm.countrys)
                this.$confirm('是否确认保存？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        countrys: [],
                        countryPayTypes: {
                            main: []
                        },
                        pipelineCode: this.pipelineCode,
                        platform: this.platform
                    };
                    this.tableData.some((item, index) => {
                        // console.log('temp ', this.tempTableData[index], 'now ', item);
                        if (JSON.stringify(this.tempTableData[index]) == JSON.stringify(item)) {
                            return false;
                        }
                        params.countrys.push(item.countryCode);
                        params.countryPayTypes[item.countryCode] = []; // item.channelCode.slice(0);
                        this.payChannels.forEach((code, index2) => {
                            if (item.channels[index2].isChecked) {
                                params.countryPayTypes[item.countryCode].push(code.channelCode);
                            }
                            if (code.is3DS && item.tChannels[index2].isChecked) {
                                params.countryPayTypes[item.countryCode].push(code.channelCode + '3DS');
                            }
                        });
                    });

                    params.countrys = params.countrys.join(',');
                    this.payChannels.forEach(item => {
                        if (item.enabled) {
                            params.countryPayTypes.main.push(item.channelCode);
                        }
                    });
                    // console.log(params);
                    // return;
                    if (!params.countryPayTypes.main.length) {
                        params.countryPayTypes.main = '';
                        // this.$message.error('数据有误');
                        // return;
                    }
                    /* if (!params.countrys) {
                         this.$message.warning('没有需要保存的信息');
                         return false;
                         params.countrys = 'main';
                     }*/

                    // 谜之 siteCode
                    // !this.siteDetail.show && (params.siteCode = 'false')

                    this.isDataLoading = true;
                    this.$http.post('pay/channel/update-country-relation', params).then(res => {
                        this.isDataLoading = false;
                        if (res.body.code !== 0) {
                            this.$message.error(res.body.message);
                            return;
                        }
                        this.$message.success(res.body.message);
                        this.tempTableData = JSON.parse(JSON.stringify(this.tableData));
                    }, err => {
                        this.isDataLoading = false;
                        this.$notify.error(err.body.message || '发生错误');
                    })
                }).catch( e =>{})
            },
            handleDelTableRow(country, index) {
                this.$confirm('确定要删除' + country.countryName + '吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        done();
                        if (action !== 'confirm') {
                            return;
                        }
                        this.countryForm.countrys.splice(index, 1);
                    }
                }).catch(() => {

                });
            },
            _resetData() {
                this.tableData = [];
                this.tempTableData = [];
                this.countryForm.countrys = [];
                this.payChannels = [];
                this.allCountrys = []

                this.getData();
            },
            handleNavClick(tab, event) {
                this._getPipelines()
                this._resetData()
            },

//            onAddSite() {
//                this.siteDetail.showSelectSiteList = false
//            }
        }
    }
</script>

<style lang="less" scoped>
    .table-box{
        width: 100%;
        overflow: auto;
        margin-bottom: 40px;
    }
    .select-site-dialog{
        .site{
            &>*{
                margin-left: 15px;
                margin-top: 15px;
            }
        }
    }
    .site-detail-bar{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .ctr-bar{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .select-site{
            width: 180px;
            margin-right: 10px;
        }
    }

</style>

<style lang="less">
    .add-country-label {
        padding-top: 15px;
    }
    .country-form {
        margin-top: 10px;
        &.new-line .el-form-item__content {
            margin-left: 0;
        }
        .el-select__tags {
            max-height: 150px;
            overflow: auto;
        }
    }
    .el-checkbox {
        white-space: normal;
    }
    .payment-channel {
        .country-table {
            table-layout: fixed;
            min-width: 100%;
            &, th, td {
                border-collapse: collapse;
                border: 1px solid #dfe6ec;
            }
            th, td {
                padding: 8px 5px;
                white-space: nowrap;
            }
            th {
                text-align: left;
                background: #eef1f6;
            }
            .channel-title {
                margin-bottom: 10px;
            }
            .channel-switchs {
                .el-checkbox {
                    margin-top: 2px;
                }
            }
            .el-checkbox.pull-right {
                margin-right: 10px;
            }
            tbody .el-checkbox .el-checkbox__label {
                display: none;
            }
        }
    }
</style>
