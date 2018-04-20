<template>
    <div>
        <div class="el-container">
            <el-row>
                <el-col :span="16">
                    <el-radio-group v-model="activeName" @change="changeActiveName" class="card-route-radio-group">
                        <el-radio-button label="channel">支付渠道</el-radio-button>
                        <el-radio-button label="country">国家</el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col :span="8" class="text-right">
                    <el-button type="primary" @click="save" :loading="isSaving">保存</el-button>
                    <el-button type="primary" v-show="activeName === 'country'" @click="addCountry">新增国家</el-button>
                </el-col>
            </el-row>
            <el-table :data="cards" border ref="cards"  v-loading="dataLoading" class="card-route-table">
                <el-table-column label="卡种">
                    <template scope="scope">
                        {{ scope.row.value }}
                    </template>
                </el-table-column>

                <el-table-column label="全选" v-if="(activeName === 'country' && countryList.length > 0) || activeName === 'channel'">
                    <template scope="scope">
                        <el-checkbox v-model="scope.row.isCheckd" @change="changeCheckbox($event, scope.row)"></el-checkbox>
                    </template>
                </el-table-column>

                <el-table-column v-if="activeName === 'channel'" v-for="(item, index) in channelList" :label="item" :key="index">
                    <template scope="scope">
                        <el-checkbox  v-model="cardTypes[item]"   :label="scope.row.key"></el-checkbox>
                    </template>
                </el-table-column>

                <el-table-column v-if="activeName === 'country'" v-for="(item, index) in countryList" :label="item.countryName" :key="index">
                    <template scope="scope">
                        <el-checkbox  v-model="cardTypes[item.countryCode]" :label="scope.row.key"></el-checkbox>
                    </template>
                </el-table-column>

            </el-table>

        </div>
        <!-- 添加国家  start-->
        <el-dialog title="添加国家"  :visible.sync="isShow" size="tiny" @close="dialogClose"  class="priority-dialog">
            <div class="country-dialog">
                <el-select v-model="country" clearable filterable placeholder="请选择">
                    <el-option v-for="(item, key) in countys" :key="key" :label="item" :value="key"></el-option>
                </el-select>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="saveCountry">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加国家  end-->

    </div>
</template>

<script>
    import {getCountrys} from '@/common/baseApi'
    export default {
        data() {
            return {
                dataLoading: false,
                activeName: 'channel',
                cards: [],
                countys: {},
                payChannelcardRelations: [],
                channelList: [],
                countryList: [],
                cardTypes: {},
                isShow: false,
                country: '',
                isSaving: false
            }
        },
        created() {
            window.a = this
            this.initData();
        },
        methods: {
            initData() {
                // 获取国家
                getCountrys().then((data) => {
                    let countys = {};
                    data.forEach((item) => {
                        countys[item.countryCode] = item.countryName;
                    });
                    this.countys = countys;
                    console.log(this.countys)
                    this.getCardRelationList();
                });

            },
            // 获取关系列表
            getCardRelationList() {
                this.$http.get(this.activeName === 'channel' ? 'pay/channel/channel-card-list' : 'pay/channel/country-card-list').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    let cardTypes = {};
                    // console.log(res.body.data);
                    // res.body.data.channelList
                    if( this.activeName === 'channel') {
                        this.channelList = res.body.data.channelList;
                        this.channelList.forEach((item) => {
                            cardTypes[item] =  [];
                        })
                        this.cardTypes = cardTypes;
                    }


                    let cardRelations = res.body.data.payChannelcardRelations;
                    let countryList = [];
                    if(cardRelations.length > 0) {
                        let cardTypes = {}
                        cardRelations.forEach((item) => {
                            if(this.activeName === 'channel') {
                               cardTypes[item.channelCode] = JSON.parse(item.cardTypeCode);
                            } else {
                                countryList.push({
                                    countryCode: item.countryCode,
                                    countryName: this.countys[item.countryCode]
                                });
                                cardTypes[item.countryCode] = JSON.parse(item.cardTypeCode);
                            }
                        });
                        this.cardTypes = Object.assign({}, this.cardTypes, cardTypes);

                        if(this.activeName !== 'channel') {
                            this.countryList = countryList;
                            console.log(this.countryList)
                        }
                    }

                    // console.log(this.cardTypes)

                    let cards = res.body.data.cardTypeMap;
                    let cardsArr = [];
                    for(let i in cards) {
                        let isChecked = true;
                        if(JSON.stringify(this.cardTypes) !== '{}') {
                            for(let j in this.cardTypes) {
                                if(this.cardTypes[j].indexOf(i) === -1) {
                                    isChecked = false;
                                }
                            }
                        } else {
                            isChecked = false;
                        }
                        cardsArr.push({
                            key: i,
                            value: cards[i],
                            isCheckd: isChecked,
                        })
                    }
                    this.cards = cardsArr;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            //activename改变
            changeActiveName(val) {
                this.cardTypes = {};
                this.getCardRelationList();
            },
            // 添加国家
            addCountry() {
                this.isShow = true;
            },
            // 弹框关闭
            dialogClose() {
                this.country = '';
            },
            // 保存国家
            saveCountry() {
                if(this.country) {
                    if(this.countryList.some((item) => {
                        return item.countryCode == this.country
                    })) {
                        this.$message.error('列表存在该国家');
                    } else {
                        this.countryList.push({
                            countryCode: this.country,
                            countryName: this.countys[this.country]
                        });
                        let cardType = {};
                        cardType[this.country] = [];
                        this.cardTypes = Object.assign({}, this.cardTypes, cardType);

                    }
                }
                this.isShow = false;
            },
            // 保存
            save() {
                let cardTypes = {};
                for(let i in this.cardTypes) {
                    if(this.cardTypes[i].length !== 0) {
                        cardTypes[i] = this.cardTypes[i]
                    }
                }
                let contrysOrChannels =  Object.keys(this.cardTypes);

                this.isSaving = true;

                this.$http.post(this.activeName === 'channel' ? 'pay/channel/save-channel-card-list' : 'pay/channel/save-country-card-list', {
                    cardTypes: cardTypes,
                    contrysOrChannels: contrysOrChannels.join(',')
                }).then(res => {
                    this.isSaving = false;
                    if (res.body.code == 0) {
                        this.$message.success(res.body.message);
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            // 全选
            changeCheckbox(event, row) {
                let cardTypes = JSON.parse(JSON.stringify(this.cardTypes));
                if (event.target.checked) {
                    for(let i in this.cardTypes) {
                        if(cardTypes[i].indexOf(row.key) === -1) {
                            cardTypes[i].push(row.key)
                        }
                    }
                } else {
                    for(let i in this.cardTypes) {
                        let index = cardTypes[i].indexOf(row.key);
                        if( index > -1) {
                            cardTypes[i].splice(index, 1);
                        }
                    }
                }
                this.cardTypes = cardTypes;
            }
        }
    }
</script>
<style lang="less">
    .card-route-radio-group{
        margin-bottom: 20px;
    }
    .card-route-table{
        .el-checkbox__label{
            display: none;
        }
    }
</style>
