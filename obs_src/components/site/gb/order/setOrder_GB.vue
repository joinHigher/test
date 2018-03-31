<!-- GB订单配置页 -->
<template>
    <div>
        <div class="el-container order-setting">
            <div class="setting-title">
                <h2>订单有效期设置</h2>
            </div>
            <el-table ref="multipleTable" v-loading.body="tableLoading" :data="orderData" border tooltip-effect="dark"
                      style="width: 100%" :default-sort="{prop: 'validType', order: 'ascending'}">
                <el-table-column label="订单有效期类型" header-align="center" align="center"
                                 prop="validTypeName"></el-table-column>
                <el-table-column label="价格标签" header-align="center" align="center" prop="validType">
                    <template scope="scope">
                        <span v-if="scope.row.validType !=0">{{scope.row.labelStr}}</span>
                        <span v-if="scope.row.validType ==0">默认配置</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单有效期" header-align="center" align="center">
                    <template scope="scope">
                        <span>{{scope.row.validTime}}</span>
                        <span v-if="scope.row.validUnit == 0">小时</span>
                        <span v-if="scope.row.validUnit == 1">分钟</span>
                        <span v-if="scope.row.validUnit == 2">天</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否启用" header-align="center" align="center" prop="isEnable">
                    <template scope="scope">
                        <span v-if="scope.row.isEnable ==1">是</span>
                        <span v-if="scope.row.isEnable ==0">否</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template scope="scope">
                        <el-button type="primary" @click="editValidSetting(scope.row)" v-if="self.showAction_('promotion/index/public-get-dicts')">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <div class="setting-title">
                <h2>订单赠送积分设置</h2>
            </div>
            <div>
                <el-form :inline="true" :model="orderPresentForm" ref="settingForm" class="search-form">
                    <el-form-item label="订单赠送积分节点：">
                        <el-select v-model="orderPresentForm.orderPresentPointNode" placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in orderPresentPointNodeList" :key="index"
                                       :value="item.code" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <br>
            <div class="setting-title">
                <h2>完全支付订单申请退款设置</h2>
            </div>
            <div>
                <el-form :inline="true" :model="orderSetting" ref="settingForm" class="search-form">
                    <el-form-item label="开启申请退款：">
                        <el-radio-group v-model="orderSetting.order_refund_on_off">
                            <el-radio class="radio" :label="0">关闭</el-radio>
                            <el-radio class="radio" :label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <br>
                    <el-form-item label="申请退款开启时间：  完全支付后" prop="order_refund_timeout">
                        <el-input v-model.number="orderSetting.order_refund_timeout" placeholder="请输入" @change="setRefundTime" :maxlength='validTime_length'></el-input>
                    </el-form-item>
                    <el-form-item label="小时"></el-form-item>
                    <br>
                    <el-form-item label="">
                        <el-table :data="orderSetting.order_rank_on_off" border>
                            <el-table-column property="levelName" label="会员等级" header-align="center" align="center" width="300px"></el-table-column>
                            <el-table-column property="onOff" label="开启状态" header-align="center" align="center" width="300px">
                                <template scope="scope">
                                    <i
                                        :class="{'el-icon-circle-check color-success': scope.row.onOff == '1', 'el-icon-circle-cross color-danger': scope.row.onOff == '0'}"
                                        @click="changeMemberSwitch(scope.row)">
                                    </i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
            </div>

            <div class="setting-title">
                <h2>电子钱包部分支付订单自动申请退款设置</h2>
            </div>
            <div>
                <el-form :inline="true" :model="orderSetting" ref="settingForm" class="search-form">
                    <el-form-item label="自动退款时间： 电子钱包付款后" prop="electronicWalletPartialPaymentAutoRefundTime">
                        <el-input v-model.number="orderSetting.electronicWalletPartialPaymentAutoRefundTime"
                                  placeholder="请输入" @change="setAutoRefundTime"></el-input>
                    </el-form-item>
                    <el-form-item label="小时"></el-form-item>
                    <br>
                </el-form>
            </div>

            <div class="setting-title">
                <h2>自动签收设置</h2>
            </div>
            <div>
                <el-form :inline="true" :model="orderSetting" ref="settingForm" class="search-form">
                    <el-form-item label="自动签收时间： 完全发货" prop="order_receipt_timeout">
                        <el-input v-model.number="orderSetting.order_receipt_timeout" placeholder="请输入"
                                  @change="setCheckTime" :maxlength='order_receipt_timeout_length'></el-input>
                    </el-form-item>
                    <el-form-item label="天"></el-form-item>
                    <br>
                </el-form>
            </div>

            <div class="setting-title">
                <h2>取消订单原因设置</h2>
            </div>
            <div class="reason-tags-box">
                <el-tag :key="item.lang" v-for="item in multiLangCheckedList" :closable="item.lang !== 'en'"
                        :disable-transitions="false" type="success"
                        size="medium" @close="reasonhandleClose(item)">
                        <span @click="tagLangClick(item.lang, item.name)">{{item.name}}</span>
                </el-tag>
            </div>
            <br>
            <div class="new-lang">
                <el-row>
                    <el-col :span="4">
                        <el-select v-model="multiLangTemp" clearable>
                            <el-option v-for="(item, index) in multiLangList" :key="item.index" :label="item.name" :value="item.lang"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        &nbsp;&nbsp;
                        <el-button type="primary" @click="newLang">添加语言</el-button>
                    </el-col>
                </el-row>
            </div>
            <br>
            <div class="text-right">
                <el-button type="primary" @click="newCancelReason">添加取消原因</el-button>
            </div>
            <br>
            <div class="reason-table">
                <el-table v-for="item in reasonTable" :key="item.lang" :data="item.list" border v-loading="reasonLoading" v-show="item.show">
                    <el-table-column label="取消原因-英语" v-if="item.lang === 'en'" prop="reason">
                        <template scope="scope">
                            <el-input v-model="scope.row.reason" class="reason-row"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="取消原因-英语" v-if="item.lang !== 'en'" prop="enReason"></el-table-column>
                    <el-table-column label="是否启用" align="center" v-if="item.lang === 'en'" prop="isEnable">
                        <template scope="scope">
                            <el-radio-group v-model="scope.row.isEnable" @change="radioChange">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="0">不启用</el-radio>
                            </el-radio-group>
                        </template>
                    </el-table-column>
                    <el-table-column label="启用状态" align="center" v-if="item.lang !== 'en'" prop="isEnable">
                        <template scope="scope">
                            <span v-if="scope.row.isEnable === 1">启用</span>
                            <span v-if="scope.row.isEnable === 0">不启用</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" v-if="item.lang === 'en'">
                        <template scope="scope">
                            <el-button type="primary" @click="downMove(scope.row, scope.$index, item.list)"
                                       :disabled="scope.row.orderByCode === maxCode">下移
                            </el-button>
                            <el-button type="primary" @click="upMove(scope.row, scope.$index, item.list)"
                                       :disabled="scope.row.orderByCode === minCode">上移
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column :label="currentEditLang" align="center" v-if="item.lang !== 'en'" prop="reason">
                        <template scope="scope">
                            <el-input v-model="scope.row.reason" class="reason-row"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="el-sub-container text-center" v-if="self.showAction_('order/index/update-order-setting')
                                                         && self.showAction_('order/index/save-cancel-reason')">
                <el-button type="primary" @click="saveSetting">保存</el-button>
                <el-button type="danger" @click="revert">取消</el-button>
            </div>
        </div>

        <!-- 弹窗S -->
        <!--订单有效期设置（默认）-->
        <el-dialog title="订单有效期设置" :visible.sync="dialogForDefault" size="tiny">
            <el-form ref="editDefaultRef" label-width="200px" v-model="editDefaultForm">
                <el-form-item label="订单有效期类型:">{{editDefaultForm.validTypeName}}</el-form-item>
                <el-form-item label="标签类型:">
                    <span v-if="editDefaultForm.validType === 0">默认配置</span>
                    <span v-if="editDefaultForm.validType === 1">配置A</span>
                    <span v-if="editDefaultForm.validType === 2">配置C</span>
                </el-form-item>
                <el-form-item label="价格标签:">默认配置</el-form-item>
                <el-form-item label="订单有效期:">
                    <el-row>
                        <el-col :span="4">
                            <el-input v-model="editDefaultForm.validTime" @change="validTimeRule" :maxlength='validTime_length'></el-input>
                        </el-col>
                        <el-col :span="1">&nbsp;</el-col>
                        <el-col :span="7" class="text-right">
                            <el-select v-model="editDefaultForm.validUnit">
                                <el-option v-for="item in timeUnitItem" :key="item.id" :label="item.type" :value="item.id"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="是否启用:">
                    <span v-if="editDefaultForm.isEnable === 1 ">是</span>
                    <span v-if="editDefaultForm.isEnable === 0 ">否</span>
                </el-form-item>
            </el-form>
            <div class="text-center">
                <el-button type="primary" @click="defaultSave"
                           v-if="self.showAction_('order/index/update-order-setting')">保存
                </el-button>
                <el-button type="danger" @click="dialogForDefault = false">取消</el-button>
            </div>
        </el-dialog>

        <!--订单有效期设置(其他)-->
        <el-dialog title="订单有效期设置" :visible.sync="dialogForOther" size="tiny">
            <el-row>
                <el-col :span="20">
                    <el-form ref="editOtherRef" label-width="200px" v-model="editOtherForm">
                        <el-form-item label="订单有效期类型:">
                            <el-input v-model="editOtherForm.validTypeName" :maxlength='NameMaxLength'></el-input>
                        </el-form-item>
                    </el-form>
                    <h4 class="order-title">选择标签</h4>
                    <el-form ref="editOtherRef" label-width="200px" v-model="editOtherForm">
                        <el-form-item label="已选择标签:">
                            <div class="selectTag">
                                <el-tag :key="tag" v-for="tag in dynamicTags"
                                        :style="{backgroundColor:tag.indexOf('已删除') !== -1 ? '#CBCBCB' : '#8391a5'}"
                                        :closable="true" :close-transition="false" @close="handleClose(tag)">{{tag}}
                                </el-tag>
                            </div>
                        </el-form-item>
                        <el-form-item label="标签类型:">
                            <el-select v-model="editOtherForm.labelType" @change="getPriceTags" clearable>
                                <el-option v-for="item in tagtypeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="价格标签:">
                            <el-select v-model="editOtherForm.labelName" clearable>
                                <el-option v-for="item in priceTagsList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" @click="addSelectItem" class="addToSelected">添加到已选</el-button>
                        </el-form-item>
                    </el-form>
                    <h4 class="order-title">订单设置</h4>
                    <el-form ref="editOtherRef" label-width="200px" v-model="editOtherForm">
                        <el-form-item label="订单有效期:">
                            <el-select v-model="editOtherForm.ordervalidity" clearable>
                                <el-option v-for="item in ordervalidityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否启用:">
                            <el-radio-group v-model="editOtherForm.isEnable">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <p class="mark" v-if="noticeFlag">提示:点击保存，已删除标签将从已选标签中删除。</p>
                    <div class="text-center">
                        <el-button type="primary" @click="otherSave">保存</el-button>
                        <el-button type="danger" @click=" dialogForOther = false;">取消</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

    export default {
        data () {
            return {
                noticeFlag: false,
                self: this,
                dialogForDefault: false, //订单有效期设置(默认)
                dialogForOther: false,//订单有效期设置(其他)
                tableLoading: false,
                orderData: [],
                editDefaultForm: {
                    id: '',
                    validType: '',
                    validTypeName: '',
                    validTime: '',
                    validUnit: '',
                    isEnable: '',
                },
                timeUnitItem: [
                    {id: 0, type: '小时'},
                    {id: 2, type: '天'},
                ],

                editOtherForm: {
                    id: '',
                    validType: '',
                    validTypeName: '',
                    labelType: '',
                    labelName: '',
                    isEnable: '',
                    ordervalidity: '',
                },
                priceTagsList: [], //价格标签数组
                tagtypeList: [], //标签类型数组
                dynamicTags: [],
                priceList: [],
                ordervalidityList: [
                    {id: 15, name: '15 min'},
                    {id: 30, name: '30 min'},
                ],
                orderSetting: {
                    order_unpaid_timeout: '',
                    order_refund_on_off: 0,
                    order_refund_timeout: '',
                    order_rank_on_off: [],
                    order_receipt_timeout: 60,
                    order_valid_time_stock_take: '',
                    electronicWalletPartialPaymentAutoRefundTime: '',
                },
                NameMaxLength: 20,
                order_receipt_timeout_length: 3,
                validTime_length: 4,
                //订单赠送积分设置 参数
                orderPresentForm: {
                    orderPresentPointNode: '',
                },
                orderPresentPointNodeList: [
                    {code: 0, label: '子订单完全发货'},
                    {code: 1, label: '子订单签收'},
                ],
                //多语言
                multiLangList: [],

                multiLangRes: {},

                multiLangCheckedList: [],
                multiLangTemp: '',
                reasonLoading: false,
                reasonTable: [],
                reasonSaveList: [],
                maxCode: '',
                minCode: '',
                maxReasonId: '',
                currentEditLang: '',
            };
        },
        created () {
            this.getOrderSetting();
            this.getMultiLang();
            setTimeout(() => {
                this.getReasonTable();
            }, 500);
        },
        methods: {

            radioChange () {
                this.syncAndSortFun();
            },

            verification () {
                let isOK = true;
                let langCheckedList = this.multiLangCheckedList;
                let reasonList = this.reasonTable;
                let disableCount = 0;
                let enLangList = reasonList[0].list;
                let mulLangTotal = reasonList[0].list.length;
                this.reasonSaveList = [];

                for (let i = 0; i < langCheckedList.length; i++) {
                    for (let j = 0; j < reasonList.length; j++) {
                        if (langCheckedList[i].lang === reasonList[j].lang) {
                            this.reasonSaveList.push(reasonList[j]);
                        }
                    }
                }

                enLangList.forEach(item => {
                    if (item.isEnable === 0) {
                        disableCount++;
                    }
                });

                if (disableCount === mulLangTotal) {
                    return isOK;
                }

                if (langCheckedList.length > reasonList.length) {
                    this.$message.error('语言取消原因不完整!');
                    isOK = false;
                    return false;
                }

                for (let k = 0; k < this.reasonSaveList.length; k++) {
                    let list = this.reasonSaveList[k].list;
                    for (let m = 0; m < list.length; m++) {
                        if (list[m].reason === '' && list[m].isEnable) {
                            this.$message.error('语言取消原因不完整!');
                            isOK = false;
                            break;
                        }
                    }
                }
                return isOK;
            },

            newCancelReason (){
                //console.log(this.maxReasonId);
                let reasonId = this.maxReasonId + 1;
                let maxCode = this.maxCode + 1;
                this.reasonTable[0].list.push({
                    reasonId: reasonId,
                    orderByCode: maxCode,
                    isEnable: 0,
                    reason: '',
                    lang: 'en',
                });
                for (let i = 1; i < this.reasonTable.length; i++) {
                    let arrTemp = this.reasonTable[i].list;
                    let lang = this.reasonTable[i].lang;
                    arrTemp.push({
                        reasonId: reasonId,
                        orderByCode: maxCode,
                        isEnable: 0,
                        reason: '',
                        lang: lang,
                        enReason: '',
                    });
                }
                this.syncAndSortFun();
                this.maxReasonId++;
                //console.log(this.reasonTable);
                //console.log(this.maxReasonId);
            },

            downMove (row, index, list){
                let code1 = row.orderByCode;
                let code2 = list[index + 1].orderByCode;
                list[index].orderByCode = code2;
                list[index + 1].orderByCode = code1;
                this.syncAndSortFun();
                //console.log(this.reasonTable);
            },

            upMove (row, index, list){
                let code1 = row.orderByCode;
                let code2 = list[index - 1].orderByCode;
                //console.log(code1);
                //console.log(code2);
                list[index].orderByCode = code2;
                list[index - 1].orderByCode = code1;
                this.syncAndSortFun();
                //console.log(this.reasonTable);
            },

            tagLangClick (lang, name){
                this.currentEditLang = name;
                sessionStorage.setItem('reasonList', JSON.stringify(this.reasonTable));  //保存上一步操作
                let reasonList = JSON.parse(sessionStorage.getItem('reasonList'));

                let isExist = 0;  //判断返回的数据中是否存在该语言
                for (let i = 0; i < reasonList.length; i++) {
                    if (reasonList[i].lang === lang) {
                        isExist++;
                    }
                }
                if (!isExist) {  //如果没有  新增
                    let obj = {
                        "lang": lang,
                        "show": false,
                        list: []
                    };
                    let arr0 = reasonList[0].list;
                    arr0.forEach(item => {
                        let objTemp = {
                            reasonId: item.reasonId,
                            orderByCode: item.orderByCode,
                            isEnable: item.isEnable,
                            reason: '',
                            lang: lang,
                            enReason: item.lang,
                        };
                        obj.list.push(objTemp);
                    });
                    //console.log(obj);
                    reasonList.push(obj);
                }
                //console.log(reasonList);
                this.reasonTable = reasonList.slice(0);
                this.reasonTable.forEach(item => {
                    item.show = false;
                    if (item.lang === lang) {
                        item.show = true;
                    }
                });
                this.syncAndSortFun();
            },

            //冒泡排序方法
            sortFun (sortArr){
                for (let a = 0; a < sortArr.length; a++) {
                    for (let b = 0; b < sortArr.length - a - 1; b++) {
                        if (sortArr[b].orderByCode > sortArr[b + 1].orderByCode) {
                            let temp = sortArr[b];
                            sortArr[b] = sortArr[b + 1];
                            sortArr[b + 1] = temp;
                        }
                    }
                }
            },

            syncAndSortFun (){
                //同步英语删除原因、排序、是否启用
                let arr0 = this.reasonTable[0].list;
                for (let h = 1; h < this.reasonTable.length; h++) {
                    let arrTemp = this.reasonTable[h].list;
                    for (let i = 0; i < arrTemp.length; i++) {
                        for (let j = 0; j < arr0.length; j++) {
                            if (arrTemp[i].reasonId === arr0[j].reasonId) {
                                arrTemp[i].enReason = arr0[j].reason;
                                arrTemp[i].orderByCode = arr0[j].orderByCode;
                                arrTemp[i].isEnable = arr0[j].isEnable;
                            }
                        }
                    }
                }
                //对list排序
                for (let x = 0; x < this.reasonTable.length; x++) {
                    let sortArr = this.reasonTable[x].list;
                    this.sortFun(sortArr);
                }
                sessionStorage.setItem('reasonList', JSON.stringify(this.reasonTable));  //保存当前操作
                this.maxCode = this.reasonTable[0].list[this.reasonTable[0].list.length - 1].orderByCode;
                this.minCode = this.reasonTable[0].list[0].orderByCode;
            },

            getReasonTable (){
                let getReasonList = [];
                let getReasonEnList = [];
                let reasonEnTxtList = [];
                this.$http.post('order/index/cancel-reason').then(res => {
                    if (res.body.code === 0) {
                        getReasonList = res.body.data;
                        getReasonEnList = getReasonList[0].list;
                        getReasonEnList.forEach(item => {
                            reasonEnTxtList.push(item.reason);
                        });

                        for (let i = 1; i < getReasonList.length; i++) {
                            let tempList = getReasonList[i].list;
                            for (let j = 0; j < tempList.length; j++) {
                                tempList[j].enReason = reasonEnTxtList[j];
                            }
                        }
                        this.reasonTable = getReasonList.slice(0);
                        //console.log(this.reasonTable);
                        sessionStorage.setItem('reasonList', JSON.stringify(this.reasonTable));

                        //添加语言标签
                        this.multiLangCheckedList = [];
                        this.multiLangCheckedList.push({lang: 'en', name: '英语-默认'});
                        for (let m = 1; m < this.reasonTable.length; m++) {
                            let objTemp = {
                                'lang': this.reasonTable[m].lang,
                                'name': this.multiLangRes[this.reasonTable[m].lang]
                            };
                            this.multiLangCheckedList.push(objTemp);
                        }
                        //console.log(this.multiLangCheckedList);

                        //对list排序
                        for (let x = 0; x < this.reasonTable.length; x++) {
                            let sortArr = this.reasonTable[x].list;
                            this.sortFun(sortArr);
                        }
                        sessionStorage.setItem('reasonList', JSON.stringify(this.reasonTable));  //保存当前操作
                        this.maxCode = this.reasonTable[0].list[this.reasonTable[0].list.length - 1].orderByCode;
                        this.minCode = this.reasonTable[0].list[0].orderByCode;
                        this.maxReasonId = this.getmaxReasonId(this.reasonTable[0].list);
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            getmaxReasonId (list) {
                let maxId = list[0].reasonId;
                let len = list.length;
                for (let i = 1; i < len; i++) {
                    if (list[i].reasonId > maxId) {
                        maxId = list[i].reasonId;
                    }
                }
                return maxId;
            },

            reasonhandleClose (tag){
                let deleteIndex = '';
                this.reasonTable.forEach((item, index) => {
                    if (item.lang === tag.lang) {
                        deleteIndex = index;
                    }
                });
                this.multiLangCheckedList.splice(this.multiLangCheckedList.indexOf(tag), 1);
                this.reasonTable.splice(deleteIndex, 1);
                sessionStorage.setItem('reasonList', JSON.stringify(this.reasonTable));
                let reasonList = JSON.parse(sessionStorage.getItem('reasonList'));
                this.reasonTable = reasonList.slice(0);
                this.reasonTable.forEach(item => {
                    item.show = false;
                    if (item.lang === 'en') {
                        item.show = true;
                    }
                });
            },

            getMultiLang (){
                this.$http.post('admin/public/languages').then(res => {
                    if (res.body.code === 0 && res.body.data.length > 0) {
                        res.body.data.forEach(item => {
                            this.multiLangList.push({lang: item.language_en, name: item.language_ch});
                            this.multiLangRes[item.language_en] = item.language_ch;
                        });
                        /*console.log(this.multiLangList);
                         console.log(this.multiLangRes);*/
                    }
                });
            },

            newLang (){
                //console.log(this.multiLangTemp);
                if (!this.multiLangTemp) {
                    this.$message.error("请先选择语言!");
                    return false;
                }
                let isSome = false;
                this.multiLangCheckedList.forEach(item => {
                    if (this.multiLangTemp === item.lang) {
                        this.$message.error("该语言已存在！");
                        isSome = true;
                    }
                });
                if (isSome) {
                    return false;
                }
                let tempObj = {
                    lang: this.multiLangTemp,
                    name: ''
                };
                this.multiLangList.forEach(item => {
                    if (item.lang === this.multiLangTemp) {
                        tempObj.name = item.name;
                    }
                });
                this.multiLangCheckedList.push(tempObj);
                this.tagLangClick(tempObj.lang, tempObj.name);
            },

            getOrderSetting(){
                this.tableLoading = true;
                this.$http.get('order/index/order-setting').then(res => {
                    this.tableLoading = false;
                    if (res.body.code === 0) {
                        this.orderSetting.order_rank_on_off = res.body.data.orderSettingsMap.order_rank_on_off;
                        this.orderSetting.order_receipt_timeout = res.body.data.orderSettingsMap.order_receipt_timeout;
                        this.orderSetting.order_refund_on_off = res.body.data.orderSettingsMap.order_refund_on_off;
                        this.orderSetting.order_refund_timeout = res.body.data.orderSettingsMap.order_refund_timeout;
                        this.orderSetting.electronicWalletPartialPaymentAutoRefundTime = res.body.data.orderSettingsMap.electronic_wallet_partial_payment_auto_refund_time || '';
                        this.orderData = res.body.data.orderSettingsMap.order_valid_time_stock_take;
                        this.orderPresentForm.orderPresentPointNode = res.body.data.orderSettingsMap.order_present_point_node;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            //编辑
            editValidSetting (row){
                this.noticeFlag = false;
                if (row.validTypeName === '默认配置') {
                    this.dialogForDefault = true;
                    this.editDefaultForm.id = row.id;
                    this.editDefaultForm.validType = row.validType;
                    this.editDefaultForm.validTypeName = row.validTypeName;
                    this.editDefaultForm.validTime = row.validTime;
                    this.editDefaultForm.validUnit = row.validUnit;
                    this.editDefaultForm.isEnable = row.isEnable;
                } else {
                    this.dialogForOther = true;
                    this.editOtherForm.id = row.id;
                    this.editOtherForm.validType = row.validType;
                    this.editOtherForm.validTypeName = row.validTypeName;
                    this.editOtherForm.isEnable = row.isEnable;

                    //调标签类型接口
                    this.tagtypeList = [];
                    var resultList = '';
                    this.$http.get('promotion/index/public-get-dicts', {params: {names: 'labelType'}}).then(res => {
                        if (res.body.code === 0) {
                            resultList = res.body.data;
                            for (var i = 0; i < resultList.length; i++) {
                                var name = resultList[i].text, id = resultList[i].value;
                                this.tagtypeList.push({name: name, id: id});
                            }

                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                    //初始化数据
                    this.priceList = [];
                    this.dynamicTags = [];
                    var list = row.priceLabelList;
                    for (var i = 0; i < list.length; i++) {
                        var type = list[i].labelType, id = list[i].priceLabelId, name = list[i].labelName,
                            status = list[i].status;
                        this.dynamicTags.push(name);
                        if (status === 0) {
                            this.priceList.push({priceLabelId: id, labelType: type, labelName: name, status: status});
                        }
                    }
                    this.editOtherForm.ordervalidity = row.validTime;

                    this.dynamicTags.forEach(item => {
                        if (item.indexOf('已删除') !== -1) {
                            this.noticeFlag = true;
                        }
                    });
                }
            },

            //调价格标签接口
            getPriceTags (){
                this.priceTagsList = [];
                var resultList = '';

                var typeName = this.editOtherForm.labelType;
                var typeId = '';
                for (var i = 0; i < this.tagtypeList.length; i++) {
                    if (typeName === this.tagtypeList[i].name) {
                        typeId = this.tagtypeList[i].id;
                        break;
                    }
                }
                this.$http.get('promotion/price/label-lists', {params: {labelType: typeId}}).then(res => {
                    if (res.body.code === 0) {
                        resultList = res.body.data.labelSites;
//            console.log(resultList);
                        for (var i = 0; i < resultList.length; i++) {
                            var name = resultList[i].name, id = resultList[i].labelId;
                            this.priceTagsList.push({name: name, id: id});
                        }
//            console.log(this.priceTagsList);

                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            validTimeRule (){
                var time = Number(this.editDefaultForm.validTime),
                    unit = Number(this.editDefaultForm.validUnit);
                if (this.editDefaultForm.validTime === '') {
                    return false;
                }
                if (unit === 0) {
                    if (time < 1 || time > 1440) {
                        this.$message.error('订单有效期请设置在1-1440小时');
                        return false;
                    }
                } else {
                    if (time < 1 || time > 60) {
                        this.$message.error('订单有效期请设置在1-60天');
                        return false;
                    }
                }
                return true;
            },

            //编辑(默认) 保存
            defaultSave (){
                if (this.editDefaultForm.validTime === '') {
                    this.$message.error('请输入订单有效期!');
                }
                if (!this.validTimeRule()) {
                    return false;
                }
                this.$http.post('order/index/period-stocktack', this.editDefaultForm).then(res => {
                    if (res.body.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.dialogForDefault = false;
                        this.getOrderSetting();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            //添加到已选
            addSelectItem (){
                var str = '', name = '', type = '';
                var priceLabelId = '', labelType = '';
                name = this.editOtherForm.labelName;
                type = this.editOtherForm.labelType;

                for (var i = 0; i < this.priceTagsList.length; i++) {
                    if (name === this.priceTagsList[i].name) {
                        priceLabelId = this.priceTagsList[i].id;
                        break;
                    }
                }
                type === '系统标签' ? labelType = 0 : labelType = 1;
                str = name + '-' + type;
                //console.log(str);
                if (!type) {
                    this.$message.error('请选择标签类型！');
                    return false;
                }
                if (!name) {
                    this.$message.error('请选择价格标签！');
                    return false;
                }

                if (this.dynamicTags.length === 0) {
                    this.dynamicTags.push(str);
                    this.priceList.push({priceLabelId: priceLabelId, labelType: labelType, labelName: str, status: 0});
                } else {
                    for (var i = 0; i < this.dynamicTags.length; i++) {
                        if (str === this.dynamicTags[i]) {
                            this.$message.error('标签已存在！');
                            return false;
                        }
                    }
                    this.dynamicTags.push(str);
                    this.priceList.push({priceLabelId: priceLabelId, labelType: labelType, labelName: str, status: 0});
                }
            },

            handleClose(tag){
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                for (var i = 0; i < this.priceList.length; i++) {
                    if (tag === this.priceList[i].labelName) {
                        this.priceList.splice(i, 1);
                    }
                }
            },

            //编辑(其他) 保存
            otherSave (){
                if (this.dynamicTags.length === 0) {
                    this.$message.error('请选择标签!');
                    return false;
                }
                if (this.editOtherForm.ordervalidity === '') {
                    this.$message.error('请选择订单有效期!');
                    return false;
                }
                let params = {
                    id: this.editOtherForm.id,
                    validType: this.editOtherForm.validType,
                    validTypeName: this.editOtherForm.validTypeName,
                    priceLabelList: this.priceList,
                    validTime: this.editOtherForm.ordervalidity,
                    validUnit: 1,
                    isEnable: this.editOtherForm.isEnable
                };
                //console.log(params);
                this.$http.post('order/index/period-stocktack', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.dialogForOther = false;
                        this.editOtherForm.labelType = '';
                        this.editOtherForm.labelName = '';
                        this.getOrderSetting();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },

            saveSetting(){
                console.log(this.orderSetting);
                if (this.orderPresentForm.orderPresentPointNode === '') {
                    this.$message.error('请选择订单赠送积分节点!');
                    return false;
                }
                if (this.orderSetting.order_refund_timeout === '') {
                    this.$message.error('申请退款开启时间不能为空!');
                    return false;
                }
                if (this.orderSetting.electronicWalletPartialPaymentAutoRefundTime === '') {
                    this.$message.error('自动退款时间不能为空!');
                    return false;
                }
                if (this.orderSetting.order_receipt_timeout === '') {
                    this.$message.error('自动签收时间不能为空!');
                    return false;
                }

                var siteCode = this.getCook('SITECODE'); //获得站点名称

                var list = this.orderSetting.order_valid_time_stock_take;
                //console.log(list);
                for (var i = 0; i < list.length; i++) {
                    delete(list[i].labelStr);
                    var pList = list[i].priceLabelList;
                    if (list[i].priceLabelList === null) {
                        list[i].priceLabelList = [];
                    }
                    if (pList !== null) {
                        for (var j = 0; j < pList.length; j++) {
                            delete(pList[j].labelName);
                        }
                    }
                }
                //console.log(list);

                var memberLeavel = [];
                if (this.orderSetting.order_rank_on_off.length > 0) {
                    for (var i in this.orderSetting.order_rank_on_off) {
                        let item = this.orderSetting.order_rank_on_off[i];
                        memberLeavel.push({id: item.id, onOff: item.onOff});
                    }
                }
                ;
                var settingParams = {
                    siteCode: siteCode,
                    orderReceiptTimeout: this.orderSetting.order_receipt_timeout,
                    orderRefundOnOff: this.orderSetting.order_refund_on_off,
                    orderRefundTimeout: this.orderSetting.order_refund_timeout,
                    orderRankOnOff: memberLeavel,
                    orderPresentPointNode: this.orderPresentForm.orderPresentPointNode,
                    electronicWalletPartialPaymentAutoRefundTime: this.orderSetting.electronicWalletPartialPaymentAutoRefundTime
                };

                //取消理由保存前验证
                let reasonVerification = this.verification();
                if (!reasonVerification) {
                    return false;
                }

                //为取消理由保存组装数据
                let submitList = [];
                let reasonSaveList = this.reasonSaveList;
                let listLen = reasonSaveList[0].list.length;

                let arrTemp = [];
                for (let i = 0; i < listLen; i++) {
                    arrTemp[i] = [];
                    for (let j = 0; j < reasonSaveList.length; j++) {
                        arrTemp[i].push(reasonSaveList[j].list[i]);
                    }
                }

                for (let k = 0; k < arrTemp.length; k++) {
                    let subList = arrTemp[k];
                    let reasonId = subList[0].reasonId;

                    let obj = {
                        reasonId: reasonId,
                        list: [],
                    };

                    for (let m = 0; m < subList.length; m++) {
                        let subObj = {};
                        subObj.isEnable = subList[m].isEnable;
                        subObj.orderByCode = subList[m].orderByCode;
                        subObj.lang = subList[m].lang;
                        subObj.reason = subList[m].reason;
                        obj.list.push(subObj);
                    }
                    submitList.push(obj);
                }

                let promiseInfo1 = this.$http.post('order/index/update-order-setting', settingParams);
                let promiseInfo2 = this.$http.post('order/index/save-cancel-reason', {reasonList: JSON.stringify(submitList)});

                Promise.all([promiseInfo1, promiseInfo2]).then(([data1, data2]) => {
                    if (data1.body.code === 0 && data2.body.code === 0) {
                        this.$message.success('保存成功!');
                    } else if (data1.body.code !== 0) {
                        this.$message.error(data1.body.message);
                    } else if (data2.body.code !== 0) {
                        this.$message.error(data2.body.message);
                    } else {
                        this.$message.error(data1.body.message + ',' + data2.body.message);
                    }
                });
            },

            getCook (name){
                var strcookie = document.cookie;//获取cookie字符串
                var arrcookie = strcookie.split("; ");//分割
                for (var i = 0; i < arrcookie.length; i++) {
                    var arr = arrcookie[i].split("=");
                    if (arr[0] == name) {
                        return arr[1];
                    }
                }
                return "";
            },

            revert(){
                this.getOrderSetting();
                this.getReasonTable();
            },

            //点击改变开启状态
            changeMemberSwitch(currentMember){
                currentMember.onOff = currentMember.onOff > 0 ? 0 : 1;
            },

            setRefundTime(val){
                var tempValue = val.toString().replace(/\D/g, '');
                this.$nextTick(function () {
                    this.orderSetting.order_refund_timeout = tempValue;
                });
            },

            setCheckTime(val){
                let tempValue = val.toString().replace(/\D/g, '');
                let reg = /^\+?[1-9]\d*$/;
                if (!reg.test(tempValue) || Number(tempValue) > 180) {
                    this.$message.error("自动签收时间范围1-180之间的整数");
                    this.orderSetting.order_receipt_timeout = '';
                    return false;
                }
                this.$nextTick(function () {
                    this.orderSetting.order_receipt_timeout = tempValue;
                });
            },

            setAutoRefundTime (val) {
                let tempValue = val.toString().replace(/\D/g, '');
                let reg = /^\+?[1-9]\d*$/;
                if (!reg.test(tempValue)) {
                    this.$message.error("自动退款时间为大于0的整数");
                    this.orderSetting.electronicWalletPartialPaymentAutoRefundTime = '';
                    return false;
                }
                this.$nextTick(function () {
                    this.orderSetting.electronicWalletPartialPaymentAutoRefundTime = tempValue;
                });

            },
        }
    }
</script>
<style lang="less">
    @import "../../../../assets/css/style";

    .order-setting {
        h2 {
            border-bottom: 2px solid @color-blue;
            display: inline-block;
            font-size: 18px;
        }
        .setting-title {
            border-bottom: 1px solid @color-gray;
            margin-bottom: 20px;
        }
    }

    .order-title {
        border-bottom: 1px solid @color-gray;
        display: inline-block;
        margin-left: 60px;
        width: 100%;
        margin-bottom: 10px;
    }

    .selectTag {
        padding: 5px;
        min-height: 90px;
        border: 1px solid @color-gray;
    }

    .el-tag {
        margin-right: 8px;
    }

    .mark {
        color: red;
        padding-left: 128px;
        padding-bottom: 20px;
    }

    .form-item {
        margin-bottom: 18px !important;
    }

    .reason-tags-box {
        border: 1px solid #ddd;
        padding: 10px;
        .el-tag {
            margin-right: 8px;
            font-size: 18px;
            display: inline-block;
            padding: 10px;
            height: 40px !important;
            cursor: pointer;
        }
    }

    .reason-row {
        margin: 8px 0;
    }

</style>
