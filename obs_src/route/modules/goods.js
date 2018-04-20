export default [{
    path: '/goods/goods/list',
    meta: {
        title: '商品列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsList'));
        });
    },
    name: 'goods_goodsList'
}, {
    path: '/goods/brand/list',
    meta: {
        title: '商品品牌列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsBrand'));
        });
    },
    name: 'goods_goodsBrand'
},{
    path: '/goods/goods/edit',
    meta: {
        title: '商品编辑',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsEdit'));
        });
    },
    name: 'goods_goodsEdit'
},{
    path: '/goods/brand/updateBrand',
    meta: {
        title: '商品品牌编辑',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/updateBrand'));
        });
    },
    name: 'goods_updateBrand'
}, {
    path: '/goods/goods/get-recycle-list',
    meta: {
        title: '商品回收站',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsBin'));
        });
    },
    name: 'goods_goodsBin'
}, {
    path: '/goods/goods/get-notic-list',
    meta: {
        title: '到货通知',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/arrivalNotice'));
        });
    },
    name: 'goods_arrivalNotice'
}, {
    path: '/goods/category/list',
    meta: {
        title: '站点分类管理',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsClassify'));
        });
    },
    name: 'goods_goodsClassify'
}, {
    path: '/goods/category/add',
    meta: {
        title: '新增商品分类',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsClassifyAdd'));
        });
    },
    name: 'goods_goodsClassifyAdd'
}, {
    path: '/goods/category/edit',
    meta: {
        title: '编辑商品分类',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsClassifyEdit'));
        });
    },
    name: 'goods_goodsClassifyEdit'
}, {
    path: '/goods/category/attr',
    meta: {
        title: '站点分类编辑',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsCatAttr'));
        });
    },
    name: 'goods_goodsCatAttr'
}, {
    path: '/goods/trot/list',
    meta: {
        title: '侵权商品',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsInfringing'));
        });
    },
    name: 'goods_goodsInfringing'
}, {
    path: '/goods/goods/get-price-config',
    meta: {
        title: '价格规则',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/priceRules'));
        });
    },
    name: 'goods_priceRules'
},{
    path: '/goods/viewMessages',
    meta: {
        title: '查看邮件',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/viewMessages'));
        });
    },
    name: 'goods_viewMessages'
},{
    path: '/goods/sendMail',
    meta: {
        title: '发送邮件',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/sendMail'));
        });
    },
    name: 'goods_sendMail'
},{
    path: '/goods/log/query-sync-goods-log',
    meta: {
        title: '商品资料变更日志',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/dataChangeLog'));
        });
    },
    name: 'goods_dataChangeLog'
},{
    path: '/goods/log/query-new-sync-goods-log',
    meta: {
        title: '商品同步日志',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodSynchronousLog'));
        });
    },
    name: 'goods_goodSynchronousLog'
},{
    path: '/goods/log/query-price-change-log',
    meta: {
        title: '商品价格变更日志',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/priceLog'));
        });
    },
    name: 'goods_priceLog'
},{
    path: '/goods/category/custom',
    meta: {
        title: '网站自定义属性',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsCustomAttr'));
        });
    },
    name: 'goods_customAttr'
},{
    path: '/goods/category/customAdd',
    meta: {
        title: '网站自定义属性-新增',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsCustomAttrEdit'));
        });
    },
    name: 'goods_customAttrAdd'
},{
    path: '/goods/category/customEdit',
    meta: {
        title: '网站自定义属性-编辑',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/goodsCustomAttrEdit'));
        });
    },
    name: 'goods_customAttrEdit'
},{
    path: '/goods/pipeCatList',
    meta: {
        title: '渠道分类列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/pipeCatList'));
        });
    },
    name: 'goods_pipeCatList'
},{
    path: '/goods/price/calc-goods-price',
    meta: {
        title: '商品价格试运算',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/calcPrice'));
        });
    },
    name: 'goods_calcPrice'
},{
    path: '/goods/price/batch-update-goods-price',
    meta: {
        title: '商品价格批量更新',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/batchUpdate'));
        });
    },
    name: 'goods_batchUpdate'
},{
    path: '/goods/goods/cut-picture-fail-list',
    meta: {
        title: '商品价格批量更新',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/goods/cropLog'));
        });
    },
    name: 'goods_cropLog'
}];
