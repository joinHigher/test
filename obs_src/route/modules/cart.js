export default [{
    path: '/promotion/cart/setting-list',
    meta: {
        title: '购物车配置',
    },
    name: 'cart_set',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/cart/set'));
        });
    }
}];
