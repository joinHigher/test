export default [
    // option
    {
        path: '/admin/language/all-list',
        name: 'site_siteList',
        meta: {
            title: '站点设置',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/option/siteList'));
            });
        }
    },
    {
        path: '/admin/cdn/setting',
        name: 'site_cdnList',
        meta: {
            title: 'cdn配置',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/option/cdnList'));
            });
        }
    },
    // mail
    {
        path: '/admin/mail-template/list',
        name: 'notice_systemMailList',
        meta: {
            title: '邮件模板',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/notice/systemMailList'));
            });
        }
    }, {
        path: '/notice/systemMailEdit',
        name: 'notice_systemMailEdit',
        meta: {
            title: '邮件模板编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/notice/systemMailEdit'));
            });
        }
    }, {
        path: '/notice/systemMailAdd',
        name: 'notice_systemMailAdd',
        meta: {
            title: '邮件模板新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/notice/systemMailAdd'));
            });
        }
    },
    // topic
    {
        path: '/admin/special/list',
        name: 'topic_topicList',
        meta: {
            title: 'google模板',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/topic/topicList'));
            });
        }
    },{
        path: '/admin/special-goods/list',
        name: 'topic_topicGoods',
        meta: {
            title: '专题商品',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/topic/topicGoods'));
            });
        }
    },{
        path: '/topic/topicEdit',
        name: 'topic_topicEdit',
        meta: {
            title: '编辑专题',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/topic/topicEdit'));
            });
        }
    },{
        path: '/topic/topicAdd',
        name: 'topic_topicAdd',
        meta: {
            title: '新增专题',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/topic/topicAdd'));
            });
        }
    },{
        path: '/topic/plateGoods',
        name: 'topic_plateGoods',
        meta: {
            title: '板块详情',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/topic/plateGoods'));
            });
        }
    },
    // personal
    {
        path: '/admin/parity/list',
        name: 'personal_comparePrice',
        meta: {
            title: '比价信息',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/personal/comparePrice'));
            });
        }
    }, {
        path: '/admin/inquiry/list',
        name: 'personal_wholesalePrice',
        meta: {
            title: '批发询价',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/personal/wholesalePrice'));
            });
        }
    },
    // floor
    {
        path: '/admin/floor/list',
        name: 'showcase_floorList',
        meta: {
            title: '楼层管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/showcase/floorList'));
            });
        }
    }, {
        path: '/showcase/floorReplace',
        name: 'showcase_floorReplace',
        meta: {
            title: '楼层编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/showcase/floorReplace'));
            });
        }
    },
    // faq
    {
        path: '/admin/article/list',
        name: 'site_faqList',
        meta: {
            title: 'FAQ文章管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/faq/faqList'));
            });
        }
    },{
        path: '/site/faqSet',
        name: 'site_faqSet',
        meta: {
            title: 'FAQ文章编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/faq/faqSet'));
            });
        }
    },
    //
    {
        path: '/admin/banner/list',
        name: 'showcase_bannerList',
        meta: {
            title: 'Banner管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/banner/bannerList'));
            });
        }
    }, {
        path: '/showcase/bannerEdit',
        name: 'showcase_bannerEdit',
        meta: {
            title: 'Banner编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/banner/bannerEdit'));
            });
        }
    }, {
        path: '/admin/category-model-info/list',
        name: 'categoryModelInfoList',
        meta: {
            title: '分类模特信息设置',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/categoryModel/modelInfoList'));
            });
        }
    }, {
        path: '/admin/category-model-info/edit',
        name: 'categoryModelInfoEdit',
        meta: {
            title: '分类模特信息编辑/新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/categoryModel/modelInfoEdit'));
            });
        }
    }, {
        path: '/admin/goods-description/list',
        name: 'goodsDescriptionList',
        meta: {
            title: '商品描述特征',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/goodsDescription/descriptionList'));
            });
        }
    }, {
        path: '/admin/goods-description/edit',
        name: 'goodsDescriptionEdit',
        meta: {
            title: '商品描述特征编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/goodsDescription/descriptionEdit'));
            });
        }
    }, {
        path: '/admin/index-market-template/list',
        name: 'indexMarketTemplateList',
        meta: {
            title: '首页营销模板',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/indexMarketTemplate/index'));
            });
        }
    }, {
        path: '/admin/index-market-template/edit',
        name: 'indexMarketTemplateEdit',
        meta: {
            title: '首页营销模板编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/st/indexMarketTemplate/edit'));
            });
        }
    },
    // 订单ST列表
    {
      path: '/order/index/list',
      meta: {
        title: '订单列表',
      },
      name:'order_orderList',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@/components/site/st/order/orderList'));
        });
      },
    },
    //订单ST详情
    {
      path: '/order/orderDetail',
      meta: {
        title: '订单详情',
      },
      name:'order_orderDetail',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@/components/site/st/order/orderDetail'));
        });
      },
    },

    //订单ST配置
    {
      path: '/order/index/order-setting',
      meta: {
        title: '订单配置',
      },
      name:'order_setOrder',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@/components/site/st/order/setOrder'));
        });
      },
    },


];
