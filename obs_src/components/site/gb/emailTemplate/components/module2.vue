<template>
    <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
            <tr>
                <template v-if="data.goods" v-for="(item, index) in data.goods">
                    <td :key="index" valign="top" style="padding: 0 5px" :style="{width: `${100 / data.goods.length }%`}">
                        <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" :bgcolor="data.color.background">
                            <tbody>
                                <tr>
                                    <td width="140" style="padding: 15px 0 0 10px; text-align: center;">
                                        <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="center">
                                                    <a :href="item.goods_url || '#'"
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
                                    <td style="text-align: right;">
                                        <a :href="item.goods_url || '#'"
                                           target="_blank">
                                            <img style="vertical-align: top;"
                                                 :src="item.image"
                                                 :alt="item.goods_title"
                                                 width="160" height="160" border="0">
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </template>
            </tr>
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
