<template>
    <span style="display: block;margin:0 auto;text-align: center;padding: 6px 0;">
        <!--双倍积分-->
        <span v-if="+otherTag===1" style="display: inline-block; padding: 0 5px; color: #fff; font: 12px/22px Arial;background: #ff8a00;border-radius: 11px;white-space: nowrap;">DOUBLE POINTS</span>

        <!--显示 coupon-->
        <span v-if="+otherTag===2" style="display: inline-block; padding: 0 5px; color: #ff8a00; font: 12px/22px Arial;white-space: nowrap;border: 1px dashed #ff8a00;">Coupon: 123456</span>

        <!--显示 email only-->
        <span v-if="+otherTag===3" style="padding-left: 23px; color:#e50c0b; font: bold 12px Arial; background: url(https://www.gearbest.com.trunk.s1.egomsl.com/temp/skin4/images/mail_temp/icon-mail.png) 0 20% no-repeat;white-space: nowrap;letter-spacing: -1px;">EMAIL ONLY</span>
    </span>
</template>
<script>
    export default {
        props: {
            otherTag: {
                type: [Number, String],
                default: 0
            }
        }
    }
</script>
