/**
 * Created by Liu.Jun on 2018/1/6.
 */

const api = {
    base: {
        defaultList: 'pay/installment-$1/default-list',         // 默认分期列表

        defaultUpdate: 'pay/installment-$1/default-update',     // 默认分期保存
        siteList: 'pay/installment-$1/site-list',               // 站点分期--列表
        activityList: 'pay/installment-$1/activity-list',       // 活动分期--列表

        siteInfo: 'pay/installment-$1/site-info',               // 站点分期详细
        siteUpdate: 'pay/installment-$1/site-update',           // 站点分期修改
        siteAdd: 'pay/installment-$1/site-add',                 // 站点分期新增
        siteDelete: 'pay/installment-$1/site-delete',           // 站点分期删除

        activityInfo: 'pay/installment-$1/activity-info',               // 活动分期详细
        activityUpdate: 'pay/installment-$1/activity-update',           // 活动分期修改
        activityAdd: 'pay/installment-$1/activity-add',                 // 活动分期新增
        activityDelete: 'pay/installment-$1/activity-delete',           // 活动分期删除
    },
    brazil: {
        countryName: '巴西'
    },
    // 墨西哥
    mexico: {
        countryName: '墨西哥'
    }
}


export default function (country) {
    const apiData = {
        ...api.base
    }

    for (let key in apiData){
        if(apiData.hasOwnProperty(key)){
            apiData[key] = apiData[key].replace(/\$1/g, country)
        }
    }
    return Object.assign(apiData, api[country])
}
