<template>
    <div>
        <div class="el-container payment-info">
            <h3>付款单信息</h3>
            <table cellspacing="0" cellpadding="0">
                <tr>
                    <td class="table-td-name">支付方式</td>
                    <td>{{ payChannels[info.channelCode] }}</td>
                    <td class="table-td-name">第三方付款ID</td>
                    <td>{{ info.transactionId }}</td>
                    <td class="table-td-name">支付号</td>
                    <td>{{ info.paySn }}</td>
                    <td class="table-td-name">支付币种</td>
                    <td>{{ currencys[info.currencyCode] }}</td>
                    <td class="table-td-name">支付金额(USD)</td>
                    <td>{{ info.payAmount }}</td>
                    <td class="table-td-name">本币金额({{info.currencyCode}})</td>
                    <td class="no-right-border">{{ info.payCurrencyAmount }}</td>
                </tr>
                <tr>
                    <td class="table-td-name">汇率</td>
                    <td>{{info.currencyRate}}</td>
                    <td class="table-td-name">公司收款账户</td>
                    <td>{{info.payAccount}}</td>
                    <td class="table-td-name">创建时间</td>
                    <td>{{ timeZone_(info.createTime, $store.getters.getTimeZone) }}</td>
                    <td class="table-td-name">最后更新时间</td>
                    <td>{{ timeZone_(info.updateTime, $store.getters.getTimeZone) }}</td>
                    <td class="table-td-name">支付完成时间</td>
                    <td>{{ timeZone_(info.completedTime, $store.getters.getTimeZone) }}</td>
                    <td class="table-td-name">支付错误码</td>
                    <td class="no-right-border">{{info.errorCode || '-'}}</td>
                </tr>
                <tr class="no-bottom-border">
                    <td class="table-td-name">是否二次授权</td>
                    <td>{{info.secondAuth ? '是' : '否'}}</td>
                    <td class="table-td-name">支付状态</td>
                    <td>{{ payStatus[info.payStatus] }}</td>
                    <td class="table-td-name">3D验证</td>
                    <td>{{info.threeDVerification ? '是' : '否'}}</td>
                    <td class="table-td-name">3D结果</td>
                    <td>{{info.threeResult}}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="no-right-border"></td>
                </tr>
            </table>
            <h3>订单关联信息</h3>
            <table cellspacing="0" cellpadding="0">
                <tr>
                    <td class="table-td-name">来源网站</td>
                    <td>{{sites[order.siteCode]}}</td>
                    <td class="table-td-name">顾客邮箱</td>
                    <td>{{order.userEmail}}</td>
                    <td class="table-td-name">订单编号</td>
                    <td>{{order.parentOrderSn}}</td>
                    <td class="table-td-name">渠道</td>
                    <td>{{order.pipelineName}}</td>
                    <td class="table-td-name">渠道域名</td>
                    <td class="no-right-border"> </td>
                </tr>
                <tr class="no-bottom-border">
                    <td class="table-td-name">生效终端</td>
                    <td>{{ terminal[order.platform] }}</td>
                    <td class="table-td-name">收货地址国家</td>
                    <td>{{ countrys[order.countryCode] }}</td>
                    <td class="table-td-name">订单金额</td>
                    <td>{{ order.orderAmount }}</td>
                    <td class="table-td-name">订单币种</td>
                    <td>{{ currencys[order.currencyCode] }}</td>
                    <td class="table-td-name">下单时间</td>
                    <td class="no-right-border">{{ timeZone_(order.orderTime, $store.getters.getTimeZone) }}</td>
                </tr>
            </table>
            <template v-if="log && log.length > 0">
                <h3>支付状态轨迹</h3>
                <div class="pay-trajectory">
                    <p v-for="(item, index) in log" :key="index">支付状态：{{payStatus[item.type]}} &nbsp;&nbsp; 更新时间：{{ timeZone_(item.createTime, $store.getters.getTimeZone) }}</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            payMentinfo: {
                default: null,
                type: Object
            },
            currencys: {
                default: null,
                type: Object
            },
            payChannels: {
                default: null,
                type: Object
            },
            countrys: {
                default: null,
                type: Object
            },
            payStatus: {
                default: null,
                type: Object
            },
            terminal: {
                default: null,
                type: Object
            },
            pipelines: {
                default: null,
                type: Object
            },
            sites: {
                default: null,
                type: Object
            }
        },
        // data() {
        //     return{
        //         info: null,
        //         order: null,
        //         log:  null
        //     }
        // },
        computed: {
            info() {
                return this.payMentinfo && this.payMentinfo.queryPayGatewayDto;
            },
            order() {
                return this.payMentinfo && this.payMentinfo.queryPayGatewayOrderDto;
            },
            log() {
                return this.payMentinfo && this.payMentinfo.queryPayLogDtos;
            }
        },
        // created() {
        //     this.info = this.payMentinfo.queryPayG·atewayDto;
        //     this.order = this.payMentinfo.queryPayGatewayOrderDto;
        //     this.log = this.payMentinfo.queryPayLogDtos;
        // }
    }
</script>
<style lang="less">
    .payment-info{
        h3{
            margin: 20px 0;
        }
        table {
            width: 100%;
            border: 1px solid #dfe6ec;
            td, th {
                height: 40px;
                text-align: center;
                border-bottom: 1px solid #dfe6ec;
                border-right: 1px solid #dfe6ec;
            }
            .no-bottom-border {
                td{
                    border-bottom: 0;
                }
            }
            .no-right-border {
                border-right: 0;
            }
            .table-td-name{
                background-color: #eef1f6;
            }
        }
        .pay-trajectory{
            p {
                margin-bottom: 10px;
            }
        }
    }
</style>
