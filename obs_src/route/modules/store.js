export default [
    {
        path: '/store/seller/list',
        name: 'store_sellerList',
        meta: {
            title: '卖家列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/sellerList'));
            });
        },
    }, {
        path: '/store/sellerEdit',
        name: 'store_sellerEdit',
        meta: {
            title: '卖家编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/sellerEdit'));
            });
        },
    }, {
        path: '/store/sellerAdd',
        name: 'store_sellerAdd',
        meta: {
            title: '卖家新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/sellerEdit'));
            });
        },
    }, {
        path: '/store/store/list',
        name: 'store_storeList',
        meta: {
            title: '店铺列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/storeList'));
            });
        },
    }, {
        path: '/store/storeAdd',
        name: 'store_storeAdd',
        meta: {
            title: '店铺新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/storeEdit'));
            });
        },
    }, {
        path: '/store/storeEdit',
        name: 'store_storeEdit',
        meta: {
            title: '店铺编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/storeEdit'));
            });
        },
    }, {
        path: '/store/storeInfo',
        name: 'store_storeInfo',
        meta: {
            title: '店铺详情',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/storeInfo'));
            });
        },
    }, {
        path: '/store/showcaseList',
        name: 'store_showcaseList',
        meta: {
            title: '店铺橱窗列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/showcaseList'));
            });
        },
    }, {
        path: '/store/showcaseGoods',
        name: 'store_showcaseGoods',
        meta: {
            title: '店铺橱窗商品',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/showcaseGoods'));
            });
        },
    }, {
        path: '/store/storeRank',
        name: 'store_storeRank',
        meta: {
            title: '店铺商品排行',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/store/storeRank'));
            });
        },
    },
];
