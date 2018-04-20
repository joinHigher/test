<template>
    <table border="0" align="center" cellpadding="0" cellspacing="0" style="width: 100%;margin-bottom: 10px">
        <tbody>
            <template v-if="data.goods" v-for="(item, index) in data.goods">
                <tr v-if="index%2 === 0">
                    <td style="width: 46%; padding: 40px 0 0 5px;" valign="top">
                        <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" :bgcolor="data.color.background">
                            <tbody>
                                <tr>
                                    <td style="padding: 10px;">
                                        <a :href="item.goods_url || '#'"
                                           target="_blank">
                                            <img :src="item.image"
                                                 style="vertical-align: top;"
                                                 :alt="item.goods_title"
                                                 width="130"
                                                 height="130" border="0"
                                            >
                                        </a>
                                    </td>

                                    <td width="140" style="padding: 15px 10px 0 0;text-align: center;">
                                        <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="center">
                                                    <a :href="item.goods_title || '#'"
                                                       target="_blank"
                                                       style="font-size: 13px; font-weight: bold; text-decoration:none;"
                                                       :style="{color: data.color.title}"
                                                    >
                                                    <span style="margin-top: 10px; height: 28px; line-height: 14px; overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 2;display: -webkit-box; -webkit-box-orient: vertical;">
                                                        {{ item.goods_title }}
                                                    </span>
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <el-tag :otherTag="data.other"></el-tag>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding-top: 25px;">
                                                    <strong style="font:bold 26px Arial;"
                                                            :style="{color: data.color.price}"
                                                    >${{item.shop_price}}</strong>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td valign="top"
                        style="width: 8%; background: url(https://www.gearbest.com.trunk.s1.egomsl.com/temp/skin4/images/mail_temp/line.png) no-repeat center top;"
                        :style="{backgroundPosition: `center ${index === 0 ? 'top' : (index === data.goods.length - 2) || (index === data.goods.length - 1) ? 'bottom' : '-210px'}`}"
                    >
                        <table border="0" align="center" cellpadding="0" cellspacing="0" style="width: 100%;">
                            <tbody>
                            <tr>
                                <td style="height: 20px;padding: 50px 0 22px;">
                                    <span style="float:right; display: block;width:0;height:0;border:10px dashed transparent;border-right: 10px solid #ffffff;"></span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span style="display: block;width:0;height:0;border:10px dashed transparent;border-left: 10px solid #ffffff;"></span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                    <td v-if="data.goods[index + 1]" style="width: 46%; padding: 0 5px 60px 0;" >
                    <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" :bgcolor="data.color.background">
                        <tbody>
                            <tr>
                                <td width="140" style="padding: 10px;text-align: center;">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                        <tr>
                                            <td align="center">
                                                <a :href="data.goods[index + 1].goods_url || '#'"
                                                   target="_blank"
                                                   style="font-size: 13px; font-weight: bold; text-decoration:none;"
                                                   :style="{color: data.color.title}"
                                                >
                                                    <span style="margin-top: 10px; height: 28px; line-height: 14px; overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 2;display: -webkit-box; -webkit-box-orient: vertical;">
                                                        {{ data.goods[index + 1].goods_title }}
                                                    </span>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
                                                <el-tag :otherTag="data.other"></el-tag>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding-top: 25px;">
                                                <strong style="font:bold 26px Arial;"
                                                        :style="{color: data.color.price}"
                                                >${{data.goods[index + 1].shop_price}}</strong>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td style="padding: 10px;">
                                    <a :href="data.goods[index + 1].goods_url || '#'"
                                       target="_blank">
                                        <img style="vertical-align: top;"
                                             :src="data.goods[index + 1].image"
                                             :alt="data.goods[index + 1].goods_title"
                                             width="130" height="130" border="0">
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<script>
    import elTag from './tag.vue'
    export default {
        components: {
            elTag
        },
        props: {
            data: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        }
    }
</script>
