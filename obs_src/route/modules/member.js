export default [{
    path: '/user/index/list',
    name: 'member_memberList',
    meta: {
        title: '会员列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/memberList'));
        });
    },
},
{
    path: '/user/index/info',
    name: 'member_memberInfo',
    meta: {
        title: '会员详情',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/memberInfo'));
        });
    },
}, 
{
    path: '/user/index/point',
    name: 'member_memberIntegral',
    meta: {
        title: '会员积分',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/memberIntegral'));
        });
    },
}, {
    path: '/user/black-risk/risks',
    name: 'member_blackList',
    meta: {
        title: '风险用户/黑名单',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/blackList'));
        });
    },
}, {
    path: '/user/mail-subscribe/list',
    name: 'member_mailSubscribe',
    meta: {
        title: '邮件订阅',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/mailSubscribe'));
        });
    },
}, {
    path: '/user/user-system/level-list',
    name: 'member_memberSystem',
    meta: {
        title: '会员体系',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/memberSystem'));
        });
    },
}, {
    path: '/user/tag/list',
    name: 'member_tagList',
    meta: {
        title: '标签管理',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/tagList'));
        });
    },
}, {
    path: '/user/sign/list',
    name: 'member_checkInList',
    meta: {
        title: '签到管理',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/checkInList'));
        });
    },
}, {
    path: '/member/checkInAdd',
    name: 'member_checkInAdd',
    meta: {
        page: 'checkInAdd',
        title: '新增签到活动'
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/checkInAdd'));
        });
    },
}, {
    path: '/member/checkInEdit',
    name: 'member_checkInEdit',
    meta: {
        page: 'checkInEdit',
        title: '编辑签到活动'
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/member/checkInAdd'));
        });
    },
}];
