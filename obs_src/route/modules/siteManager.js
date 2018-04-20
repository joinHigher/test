export default [{
    path: '/admin/site-version/list',
    name: 'siteManager_versionList',
    meta: {
        title: '版本控制',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/siteManager/versionList'));
        });
    },
}, ];
