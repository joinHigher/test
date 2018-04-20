export default [{
    path: '/base/admin/list',
    name: 'authority_userList',
    meta: {
        title: '用户列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/userList'));
        });
    }
}, {
    path: '/base/admin/edit',
    name: 'authority_userEdit',
    meta: {
        title: '用户编辑',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/userEdit'));
        });
    }
}, {
    path: '/base/department/list',
    name: 'authority_departmentsList',
    meta: {
        title: '部门列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/departmentsList'));
        });
    },
}, {
    path: '/base/department/edit',
    name: 'authority_departmentEdit',
    meta: {
        title: '部门编辑',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/departmentEdit'));
        });
    }
}, {
    path: '/base/role/list',
    name: 'authority_roleList',
    meta: {
        title: '角色列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/roleList'));
        });
    }
}, {
    path: '/base/role/edit',
    name: 'authority_roleEdit',
    meta: {
        title: '角色编辑/新增',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/roleEdit'));
        });
    }
}, {
    path: '/base/admin-log/list',
    name: 'authority_baseLog',
    meta: {
        title: '基础库操作日志',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/baseLog'));
        });
    }
}, {
    path: '/admin/admin-log/list',
    name: 'authority_siteLog',
    meta: {
        title: '管理员操作日志',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/siteLog'));
        });
    }
}, {
    path: '/base/menu/list',
    name: 'authority_menuList',
    meta: {
        title: '菜单列表',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/menuList'));
        });
    }
}, {
    path: '/base/site/site-list',
    name: 'authority_siteList',
    meta: {
        title: '站群/站点管理',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/authority/groupList'));
        });
    }
}];
