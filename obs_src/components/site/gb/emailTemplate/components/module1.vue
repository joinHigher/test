<template>
    <table border="0" align="center" cellpadding="0" cellspacing="0" style="width: 100%;">
        <tbody>
            <tr>
                <template v-if="data.goods" v-for="(item, index) in data.goods">
                    <td :key="index" valign="top" style="padding: 0 5px; text-align: center" :style="{width: `${100 / data.goods.length}%`}">
                        <table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" :bgcolor="data.color.background">
                            <tbody>
                                <tr>
                                    <td style="text-align: center;padding: 10px;">
                                        <a :href="item.goods_url || '#'"
                                           target="_blank"
                                           style="font-size: 13px; font-weight: bold; text-decoration:none;">
                                            <img
                                                :src="item.image"
                                                :alt="item.goods_title"
                                                width="180" height="180" style="vertical-align:top" border="0">
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center;padding: 10px;">
                                        <a :href="item.goods_url || '#'"
                                           style="font-size: 13px;font-weight: bold;text-decoration: none;"
                                           :style="{color: data.color.title}"
                                        >
                                            <span style="margin-top: 10px; height: 28px; line-height: 14px; overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 2;display: -webkit-box; -webkit-box-orient: vertical;">
                                                {{ item.goods_title }}
                                            </span>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <el-tag :otherTag="data.other"></el-tag>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px;text-align: center;">
                                        <span style="font:bold 26px Arial;"
                                              :style="{color: data.color.price}"
                                        >${{item.shop_price}}</span>
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
