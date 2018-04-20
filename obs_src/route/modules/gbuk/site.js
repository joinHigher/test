export default [
    // common
    {
        path: '/admin/site-config/list',
        name: 'site_siteList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/siteList'));
            });
        }
    },{
        path: '/admin/version/list',
        name: 'site_versionList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/versionList'));
            });
        }
    },{
        path: '/site/versionEdit',
        name: 'site_versionEdit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/versionEdit'));
            });
        }
    },{
        path: '/site/versionView',
        name: 'site_versionView',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/versionView'));
            });
        }
    },{
        path: '/site/langEdit',
        name: 'site_langEdit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/langEdit'));
            });
        }
    },{
        path: '/admin/home/create',
        name: 'site_indexPre',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/indexPre'));
            });
        }
    },{
        path: '/admin/cdn/setting',
        name: 'site_cdnList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/cdnList'));
            });
        }
    },{
        path: '/admin/article/list',
        name: 'site_faqList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/faqList'));
            });
        }
    },{
        path: '/site/faqSet',
        name: 'site_faqSet',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/faqSet'));
            });
        }
    },{
        path: '/admin/category-library/list',
        name: 'site_indexLibrary',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/indexLibrary'));
            });
        }
    },{
        path: '/admin/category-library-banner/list',
        name: 'site_libraryBanner',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/libraryBanner'));
            });
        }
    },{
        path: '/admin/category-library/add',
        name: 'site_addLibrary',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/addLibrary'));
            });
        }
    },{
        path: '/site/addLibraryBanner',
        name: 'site_addLibraryBanner',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/addLibraryBanner'));
            });
        }
    },{
        path: '/admin/general-widget/list',
        name: 'site_customTemp',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/customTemp'));
            });
        }
    },{
        path: '/site/addCustomTemp',
        name: 'site_addCustomTemp',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/addCustomTemp'));
            });
        }
    },{
        path: '/site/errorReport',
        name: 'site_errorReport',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/errorReport'));
            });
        }
    },{
        path: '/admin/top-navigation/list',
        name: 'site_topNav',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/topNav'));
            });
        }
    },{
        path: '/site/adList',
        name: 'site_adList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/site/adList'));
            });
        }
    },
    // special
    {
        path: '/admin/special/list',
        name: 'topic_topicList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/topic/topicList'));
            });
        }
    },{
        path: '/admin/special-goods/list',
        name: 'topic_topicGoods',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/topic/topicGoods'));
            });
        }
    },{
        path: '/topic/topicEdit',
        name: 'topic_topicEdit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/topic/topicEdit'));
            });
        }
    },{
        path: '/topic/topicAdd',
        name: 'topic_topicAdd',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/topic/topicAdd'));
            });
        }
    },{
        path: '/topic/plateGoods',
        name: 'topic_plateGoods',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/topic/plateGoods'));
            });
        }
    },

    // lang

    // personal
    {
        path: '/admin/parity/list',
        name: 'personal_comparePrice',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/personal/comparePrice'));
            });
        }
    }, {
        path: '/admin/inquiry/list',
        name: 'personal_wholesalePrice',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/personal/wholesalePrice'));
            });
        }
    },

    {
        path: '/admin/floor/list',
        name: 'showcase_floorList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/showcase/floorList'));
            });
        }
    }, {
        path: '/showcase/floorEdit',
        name: 'showcase_floorEdit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/showcase/floorEdit'));
            });
        }
    }, {
        path: '/showcase/floorReplace',
        name: 'showcase_floorReplace',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/showcase/floorReplace'));
            });
        }
    }, {
        path: '/admin/whats-new-goods/list',
        name: 'showcase_whatIsNew',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gbuk/showcase/whatIsNew'));
            });
        }
    }
];
