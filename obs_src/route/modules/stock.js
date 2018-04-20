export default [{
        path: '/stock/warehouse/list',
        name: 'stock_saleWarehouseList',
        meta: {
            title: '销售仓管理列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/saleWarehouseList'));
            });
        },
    }, {
        path: '/stock/warehouse/add',
        name: 'stock_saleWarehouseAdd',
        meta: {
            title: '新增销售仓',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/saleWarehouse'));
            });
        },
    },
    {
        path: '/stock/warehouse/edit',
        name: 'stock_saleWarehouseEdit',
        meta: {
            title: '编辑销售仓',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/saleWarehouse'));
            });
        },
    },
    //  {
    //     path: '/stock/index/list',
    //     name: 'stock_realTime',
    //     meta: {
    //         title: '实时库存',
    //     },
    //     component: resolve => {
    //         require.ensure([], () => {
    //             resolve(require('@/components/stock/realTime'));
    //         });
    //     },
    // },
    {
        path: '/stock/realTimeLog',
        name: 'stock_realTimeLog',
        meta: {
            title: '库存日志查询',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/realTimeLog'));
            });
        },
    }, {
        path: '/stock/synchronizationLog',
        name: 'stock_synchronizationLog',
        meta: {
            title: '库存同步日志',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/synchronizationLog'));
            });
        },
    }, {
        path: '/stock/distributed/list',
        name: 'stock_distribution',
        meta: {
            title: '库存分布管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/distribution'));
            });
        },
    }, {
        path: '/stock/distributed/detail',
        name: 'stock_distributionDetail',
        meta: {
            title: '库存分布详情',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/distributionDetail'));
            });
        },
    }, {
        path: '/stock/apply/list',
        name: 'stock_approvalApplication',
        meta: {
            title: '库存占用申请列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/approvalApplication'));
            });
        },
    }, {
        path: '/stock/real-warehouse/list',
        name: 'stock_realWarehouseList',
        meta: {
            title: '真实仓管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/realWarehouseList'));
            });
        },
    }, {
        path: '/stock/site-access/list',
        name: 'stock_salePlatformList',
        meta: {
            title: '销售仓管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/salePlatformList'));
            });
        },
    }, {
        path: '/stock/channel-partition/list',
        name: 'stock_channelPartition',
        meta: {
            title: '渠道个性化',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/stockChannel'));
            });
        },
    }, {
        path: '/stock/update-rule/list',
        name: 'stock_updateRule',
        meta: {
            title: '可售库存更新规则列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/updateRule'));
            });
        },
    }, {
        path: '/stock/update-rule/edit',
        name: 'stock_updateRuleEdit',
        meta: {
            title: '设置可售库存更新规则',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/updateRuleEdit'));
            });
        },
    },
    // 更新福袋库存
    {
        path: '/stock/lucky-bag/list',
        name: 'stock_luckyBagList',
        meta: {
            title: '更新福袋商品库存',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/luckyBagList'));
            });
        },
    },
    // 虚拟库存数管理
    {
        path: '/stock/vstock-manage/list',
        name: 'stock_vstockManage',
        meta: {
            title: '虚拟库存数管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/vstockManageList'));
            });
        },
    },
    // 设置虚拟库存数更新规则
    {
        path: '/stock/inventory-rule/list',
        name: 'stock_inventoryRule',
        meta: {
            title: '设置虚拟库存数更新规则',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/inventoryRuleList'));
            });
        },
    },
    // 设置更新规则
    {
        path: '/stock/inventory-rule/update',
        name: 'stock_inventoryRuleUpdate',
        meta: {
            title: '设置更新规则',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/stock/inventoryRuleUpdate'));
            });
        },
    },
];