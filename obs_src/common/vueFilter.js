/**
 * Created by Liu.Jun on 2017/12/23.
 */

import Vue from 'vue'
import utils from './utils'

Vue.filter('time', function (value) {
    // 返回处理后的值
    if (!isNaN(Number(value))) {
        value = 0
    }

    let timeWithDay = utils.tools.getTimeWithDay(value)
    if (timeWithDay) {
        return `${timeWithDay.days}天${timeWithDay.hours}时${timeWithDay.minutes}分${timeWithDay.seconds}秒`
    }
    return `00天00时00分00秒`
})
