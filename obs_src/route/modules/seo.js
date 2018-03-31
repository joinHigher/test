export default [
{
    path: '/seo/abc-index-keyword/list',
    name: 'seo_keywordList',
    meta: {
        title: 'ABC索引关键字',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/keywordList'));
        });
    }
},{
    path: '/seo/keywordEdit',
    name: 'seo_keywordEdit',
    meta: {
        title: '关键字编辑',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/keywordEdit'));
        });
    }
},{
    path: '/seo/seo-setting/list',
    name: 'seo_keywordFilter',
    meta: {
        title: '搜索关键字过滤设置',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/keywordFilter'));
        });
    }
},{
    path: '/seo/keyword-redirect/list',
    name: 'seo_keywordToUrl',
    meta: {
        title: '关键字跳转指定URL',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/keywordToUrl'));
        });
    }
},{
    path: '/seo/trend/list',
    name: 'seo_navwordList',
    meta: {
        title: '导购词推荐',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/navwordList'));
        });
    }
},{
    path: '/seo/trend/statistic-list',
    name: 'seo_navwordCount',
    meta: {
        title: '导购词统计',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/navwordCount'));
        });
    }
},{
    path: '/seo/public/sort-rule-options',
    name: 'seo_orderRule',
    meta: {
        title: '排序规则',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/orderRule'));
        });
    }
},{
    path: '/seo/sitemap',
    name: 'seo_siteMap',
    meta: {
        title: '站点地图',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/siteMap'));
        });
    }
},{
    path: '/seo/top-goods-setting/list',
    name: 'seo_topList',
    meta: {
        title: '置顶管理',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/topList'));
        });
    }
},{
    path: '/seo/topAdd',
    name: 'seo_topAdd',
    meta: {
        title: '置顶新增',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/topEdit'));
        });
    }
},{
    path: '/seo/topEdit',
    name: 'seo_topEdit',
    meta: {
        title: '置顶编辑',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/topEdit'));
        });
    }
},{
    path: '/seo/seo-keywords/list',
    name: 'seo_unauthorized',
    meta: {
        title: '过滤未授权品牌词',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/unauthorized'));
        });
    }
}, {
    path: '/seo/custom-sitemap/list',
    name: 'seo_customSitemap',
    meta: {
        title: '',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/customSitemap'));
        });
    }
}, {
    path: '/seo/search-recommend-keyword/list',
    name: 'seo_seoRecommend',
    meta: {
        title: '',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/seoRecommend'));
        });
    }
}, {
    path: '/seo/seo-redirect/list',
    name: 'seo_categoryGoodsToUrl',
    meta: {
        title: '',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/categoryGoodsToUrl'));
        });
    }
}, {
    path: '/seo/navwordEdit',
    name: 'seo_navwordEdit',
    meta: {
        title: '',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/navwordEdit'));
        });
    }
},{
    path: '/seo/navwordAdd',
    name: 'seo_navwordAdd',
    meta: {
        title: '',
    },
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/seo/navwordAdd'));
        });
    }
}];
