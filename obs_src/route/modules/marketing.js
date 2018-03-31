export default [{
    path: '/promotion/template/lists',
    name: 'marketing_price_priceTempList',
    meta: {
        title: '价格模板管理',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/priceTempList'));
        });
    }
}, {
    path: '/promotion/template/add-price-tpl',
    name: 'marketing_price_priceTempAdd',
    meta: {
        title: '新建价格模板',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/priceTempAdd'));
        });
    }
}, {
    path: '/promotion/template/website-lists',
    name: 'marketing_price_sitePriceList',
    meta: {
        title: '网站价格模板',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/sitePriceList'));
        });
    }
}, {
    path: '/marketing/price/skuPriceEdit',
    name: 'marketing_price_skuPriceEdit',
    meta: {
        title: '商品价格编辑',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/skuPriceEdit'));
        });
    }
}, {
    path: '/promotion/price/label-lists',
    name: 'marketing_price_labelList',
    meta: {
        title: '价格标签列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/labelList'));
        });
    }
}, {
    path: '/marketing/price/queueInfo',
    name: 'marketing_price_queueInfo',
    meta: {
        title: '价格设置详情',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/queueInfo'));
        });
    }
}, {
    path: '/promotion/price/priority-lists',
    name: 'marketing_price_prioritySet',
    meta: {
        title: '优先级配置',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/prioritySet'));
        });
    }
}, {
    path: '/promotion/price/setting-logs',
    name: 'marketing_price_priceSetLog',
    meta: {
        title: '价格设置记录',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/priceSetLog'));
        });
    }
}, {
    path: '/promotion/price/lists',
    name: 'marketing_price_goodsPriceList',
    meta: {
        title: '商品价格列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/goodsPriceList'));
        });
    }
}, {
    path: '/promotion/price/edit-tpl',
    name: 'marketing_price_goodsPriceSet',
    meta: {
        title: '设置商品价格',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/goodsPriceSet'));
        });
    }
}, {
    path: '/promotion/activity/lists',
    name: 'marketing_campaigns_campaignsList',
    meta: {
        title: '活动列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/campaigns/campaignsList'));
        });
    }
}, {
    path: '/marketing/campaigns/campaignsGoods',
    name: 'marketing_campaigns_campaignsGoods',
    meta: {
        title: '活动商品',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/campaigns/campaignsGoods'));
        });
    }
}, {
    path: '/marketing/campaigns/setPrize',
    name: 'marketing_campaigns_setPrize',
    meta: {
        title: '奖品设置',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/campaigns/setPrize'));
        });
    }
}, {
    path: '/marketing/campaigns/campaignsEdit',
    name: 'marketing_campaigns_campaignsEdit',
    meta: {
        title: '活动设置',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/campaigns/campaignsEdit'));
        });
    }
}, {
    path: '/marketing/campaigns/participateList',
    name: 'marketing_campaigns_participateList',
    meta: {
        title: '参与名单',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/campaigns/participateList'));
        });
    }
}, {
    path: '/marketing/campaigns/raffleLog',
    name: 'marketing_campaigns_raffleLog',
    meta: {
        title: '赠送日志',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/campaigns/raffleLog'));
        });
    }
}, {
    path: '/promotion/activity/get-raffle-packages',
    name: 'marketing_campaigns_setRaffle',
    meta: {
        title: '后置礼包设置',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/campaigns/setRaffle'));
        });
    }
}, {
    path: '/promotion/activity-goods/lists',
    name: 'marketing_campaigns_campaignsGlobel',
    meta: {
        title: '活动商品（全局）',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/campaigns/campaignsGlobel'));
        });
    }
}, {
    path: '/promotion/favorable/pay-discount',
    name: 'marketing_discount_discountList',
    meta: {
        title: '折扣列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/discount/discountList'));
        });
    }
}, {
    path: '/promotion/favorable/parts-lists',
    name: 'marketing_discount_accessoryList',
    meta: {
        title: '配件列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/discount/accessoryList'));
        });
    }
}, {
    path: '/marketing/discount/accessoryBinding',
    name: 'marketing_discount_accessoryBinding',
    meta: {
        title: '绑定配件',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/discount/accessoryBinding'));
        });
    }
},{
    path: '/promotion/coupon/lists',
    name: 'marketing_coupon_couponList',
    meta: {
        title: 'coupon列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/coupon/couponList'));
        });
    }
}, {
    path: '/marketing/coupon/couponSet',
    name: 'marketing_coupon_couponSet',
    meta: {
        title: 'coupon设置',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/coupon/couponSet'));
        });
    }
}, {
    path: '/promotion/template/add-coupon-tpl',
    name: 'marketing_coupon_couponAdd',
    meta: {
        title: '新增coupon模板',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/coupon/couponAdd'));
        });
    }
}, {
    path: '/promotion/template/coupon-lists',
    name: 'marketing_coupon_couponTotalList',
    meta: {
        title: 'coupon模板总表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/coupon/couponTotalList'));
        });
    }
}, {
    path: '/promotion/template/general-lists',
    name: 'marketing_coupon_siteCoupon',
    meta: {
        title: '网站coupon模板',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/coupon/siteCoupon'));
        });
    }
}, {
    path: '/promotion/template/sys-lists',
    name: 'marketing_coupon_systemCoupon',
    meta: {
        title: '系统coupon模板',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/coupon/systemCoupon'));
        });
    }
}, {
    path: '/promotion/price-monitoring/lists',
    name: 'marketing_price_monitorList',
    meta: {
        title: '价格监测列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/monitorList'));
        });
    }
}, {
    path: '/promotion/price/errorTools',
    name: 'marketing_price_errorTools',
    meta: {
        title: '失败项快捷处理工具',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/price/errorTools'));
        });
    }
}, {
    path: '/promotion/supplier-activity/lists',
    name: 'marketing_supplier_activity',
    meta: {
        title: '供应商活动',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/marketing/campaigns/supplierActivityList'));
        });
    }
}];
