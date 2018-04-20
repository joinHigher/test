import {httpGet, httpPost} from '../common/http'

export default function(Vue, options) {
    Vue.prototype.httpGet_ = httpGet
    Vue.prototype.httpPost_ = httpPost

    // 时间控件选择时调用
    Vue.prototype.checkDate_ = function(dateStr, date) {
        if (dateStr) {
            let arr = dateStr.split(' - ');
            if (arr[0] === arr[1]) {
                this.$message.warning('结束时间必须大于开始时间,请重新选择');
                date.splice(0, 2);
            }
        }
    };

    // 权限控制
    Vue.prototype.showAction_ = function(actionName) {
        if (this.$store.getters.getAction.indexOf(actionName) !== -1) {
            return true;
        } else {
            let arr = actionName.split('/');
            if (arr[arr.length -1].indexOf('public') !== -1) {
                return true;
            } else {
                return false;
            }
        }
    };

    // 时区转换
    Vue.prototype.timeZone_ = function(value, targetTimeZone, localTimeZone) {
        localTimeZone = localTimeZone || 8;
        var timeOffset = targetTimeZone - localTimeZone;

        if (value instanceof Array) {
            let date1,
                date2;

            if (value.length === 0 || (!value[0] && !value[1])) {
               return ['', ''];
            } else {
                date1 = value[0] instanceof Date ? value[0] : new Date(value[0])
                date2 = value[1] instanceof Date ? value[1] : new Date(value[1])
                // if (date1.getTime() === date2.getTime()) {
                //     value.splice(0,2);
                //     this.$message.warning('所选时间段中存在结束时间等于开始时间，请重新选择！');
                //     return false;
                // }
                date1 = new Date(date1.getTime() + 3600000 * timeOffset * (-1));
                date2 = new Date(date2.getTime() + 3600000 * timeOffset * (-1));

                return [parseInt(date1.getTime() / 1000), parseInt(date2.getTime() / 1000)];
            }
        } else if (Boolean(value) && value !== '0') {
            if (value instanceof Object) {
                return parseInt((value.getTime() + 3600000 * timeOffset * (-1)) / 1000);
            } {
                return this.dateToStr_(new Date(new Date(value * 1000).getTime() + 3600000 * timeOffset));
            }
        } else {
            return '';
        }
    };

    // 格式转换
    Vue.prototype.dateFormat_ = function(dateArr) {
        return dateArr instanceof Array ? [this.dateToStr_(dateArr[0]), this.dateToStr_(dateArr[1])] : this.dateToStr_(new Date(dateArr));
    };

    Vue.prototype.dateToStr_ = function(date) {
        if (!date) {
            return '';
        } else {
           let str = '',
                year = date.getFullYear(),
                mouth = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                min = date.getMinutes(),
                second = date.getSeconds(),
                flag1 = '-',
                flag2 = ':';

                if (mouth < 10) {
                    mouth = '0' + mouth;
                };
                if (day < 10) {
                    day = '0' + day;
                };
                if (hour < 10) {
                    hour = '0' + hour;
                };
                if (min < 10) {
                    min = '0' + min;
                };
                if (second < 10) {
                    second = '0' + second;
                };

                str = year + flag1 + mouth + flag1 + day + ' ' + hour + flag2 + min + flag2 + second;
            return str;
        }
    };
};
