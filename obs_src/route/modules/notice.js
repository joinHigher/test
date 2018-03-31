export default [{
    path: '/admin/message-template/list',
    name: 'notice_siteMailList',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/notice/siteMailList'));
        });
    }
}, {
    path: '/notice/siteMailAdd',
    name: 'notice_siteMailAdd',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/notice/siteMailAdd'));
        });
    }
}, {
    path: '/notice/siteMailEdit',
    name: 'notice_siteMailEdit',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/notice/siteMailEdit'));
        });
    }
}, {
    path: '/admin/mail-template/list',
    name: 'notice_systemMailList',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/notice/systemMailList'));
        });
    }
}, {
    path: '/notice/systemMailEdit',
    name: 'notice_systemMailEdit',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/notice/systemMailEdit'));
        });
    }
}, {
    path: '/notice/systemMailAdd',
    name: 'notice_systemMailAdd',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/notice/systemMailAdd'));
        });
    }
}];
