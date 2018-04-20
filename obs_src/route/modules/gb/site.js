export default [
    // faq
    {
        path: '/admin/article/list',
        name: 'site_faqList',
        meta: {
            title: 'FAQ文章管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/faq/faqList'));
            });
        }
    }, {
        path: '/admin/category-page-setting/list',
        name: 'site_categoryList',
        meta: {
            title: '分类页面配置列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/category/categoryList'));
            });
        }
    }, {
        path: '/admin/category-page-setting/add',
        name: 'site_categoryAdd',
        meta: {
            title: '分类页面配置新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/category/categoryEdit'));
            });
        }
    }, {
        path: '/admin/category-page-setting/edit',
        name: 'site_categoryEdit',
        meta: {
            title: '分类页面配置编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/category/categoryEdit'));
            });
        }
    },
    // 商品 faq
    {
        path: '/admin/goods-faq/add',
        name: 'site_commodityFaqAdd',
        meta: {
            title: '商品FAQ新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/commodityFaq/faqSet'));
            });
        }
    }, {
        path: '/admin/goods-faq/edit',
        name: 'site_commodityFaqEdit',
        meta: {
            title: '商品FAQ编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/commodityFaq/faqSet'));
            });
        }
    }, {
        path: '/admin/goods-faq/list',
        name: 'site_commodityFaqList',
        meta: {
            title: '商品FAQ列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/commodityFaq/faqList'));
            });
        }
    }
    // 品牌闪购
    , {
        path: '/promotion/brand-flashsale/lists',
        name: 'site_flashSaleList',
        meta: {
            title: '品牌闪购',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/flashSale/flashSaleList'));
            });
        }
    }, {
        path: '/site/flashSalePage',
        name: 'site_flashSalePage',
        meta: {
            title: '品牌闪购页面编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/flashSale/flashSalePage'));
            });
        }
    }, {
        path: '/site/flashSaleEdit',
        name: 'site_flashSaleEdit',
        meta: {
            title: '品牌闪购版块编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/flashSale/flashSaleEdit'));
            });
        }
    }, {
        path: '/site/flashSaleAdd',
        name: 'site_flashSaleAdd',
        meta: {
            title: '品牌闪购版块新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/flashSale/flashSaleEdit'));
            });
        }
    }
    // deals
    , {
        path: '/admin/deals/list',
        name: 'site_dealsList',
        meta: {
            title: 'deals',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/deals/dealsList'));
            });
        }
    }, {
        path: '/site/dealsEdit',
        name: 'site_dealsEdit',
        meta: {
            title: 'deals编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/deals/dealsEdit'));
            });
        }
    }, {
        path: '/site/dealsAdd',
        name: 'site_dealsAdd',
        meta: {
            title: 'deals新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/deals/dealsEdit'));
            });
        }
    },
    // 通用模板
    {
        path: '/admin/general-widget/edit',
        name: 'site_commonTplEdit',
        meta: {
            title: '通用模板编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/commonTpl/tplSet'));
            });
        }
    }, {
        path: '/admin/general-widget/add',
        name: 'site_commonTplAdd',
        meta: {
            title: '通用模板新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/commonTpl/tplSet'));
            });
        }
    }, {
        path: '/admin/general-widget/list',
        name: 'site_commonTplList',
        meta: {
            title: '通用模板列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/commonTpl/tplList'));
            });
        }
    },
    // 顶部导航
    {
        path: '/admin/top-navigation/list',
        name: 'top_navigationList',
        meta: {
            title: '顶部导航管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/topNavigation/topNavList'));
            });
        }
    }, {
        path: '/admin/top-navigation/edit',
        name: 'top_navigationEdit',
        meta: {
            title: '顶部导航编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/topNavigation/topNavSet'))
            })
        }
    }, {
        path: '/admin/top-navigation/add',
        name: 'top_navigationAdd',
        meta: {
            title: '顶部导航新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/topNavigation/topNavSet'))
            })
        }
    },
    // Sponsored
    {
        path: '/admin/goods-sponsored/list',
        name: 'topic_sponsoredList',
        meta: {
            title: 'Sponsored列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/sponsored/sponsoredList'))
            })
        }
    },
    // 领劵中心
    {
        path: '/admin/coupon-center/list',
        name: 'site_couponCenterList',
        meta: {
            title: '领劵中心',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/couponCenter/couponCenterList'))
            })
        }
    }, {
        path: '/admin/coupon-center/edit',
        name: 'site_couponCenterEdit',
        meta: {
            title: '领劵中心编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/couponCenter/couponCenterEdit'))
            })
        }
    }, {
        path: '/admin/coupon-center/add',
        name: 'site_couponCenterAdd',
        meta: {
            title: '领劵中心新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/couponCenter/couponCenterEdit'))
            })
        }
    }, {
        path: '/admin/coupon-center-category/edit',
        name: 'site_couponCenterCatEdit',
        meta: {
            title: '领劵中心分类编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/couponCenter/couponCenterCatEdit'))
            })
        }
    }, {
        path: '/admin/coupon-center-category/add',
        name: 'site_couponCenterCatAdd',
        meta: {
            title: '领劵中心分类新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/couponCenter/couponCenterCatEdit'))
            })
        }
    },
    // 分类馆管理
    {
        path: '/admin/category-library-banner/list',
        name: 'site_categoryLibraryBannerList',
        meta: {
            title: '分类馆banner列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/categoriesMuseum/bannerList.vue'))
            })
        }
    }, {
        path: '/admin/category-library-banner/add',
        name: 'site_categoryLibraryBannerAdd',
        meta: {
            title: '分类馆banner添加',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/categoriesMuseum/bannerSet.vue'))
            })
        }
    }, {
        path: '/admin/category-library-banner/edit',
        name: 'site_categoryLibraryBannerEdit',
        meta: {
            title: '分类馆banner编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/categoriesMuseum/bannerSet.vue'))
            })
        }
    }, {
        path: '/admin/category-library/list',
        name: 'site_categoryLibraryList',
        meta: {
            title: '首页分类馆列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/categoriesMuseum/indexList.vue'))
            })
        }
    }, {
        path: '/admin/category-library/add',
        name: 'site_categoryLibraryAdd',
        meta: {
            title: '首页分类馆添加',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/categoriesMuseum/indexSet.vue'))
            })
        }
    }, {
        path: '/admin/category-library/edit',
        name: 'site_categoryLibraryEdit',
        meta: {
            title: '首页分类馆编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/categoriesMuseum/indexSet.vue'))
            })
        }
    },
    // 新手导购
    {
        path: '/promotion/new-shopping-guide/lists',
        name: 'site_guideList',
        meta: {
            title: '新手导购列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/guide/guideList'))
            })
        }
    }, {
        path: '/site/guideEdit',
        name: 'site_guideEdit',
        meta: {
            title: '新手导购编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/guide/guideEdit'))
            })
        }
    }, {
        path: '/site/guideAdd',
        name: 'site_guideAdd',
        meta: {
            title: '新手导购新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/guide/guideEdit'))
            })
        }
    }, {
        path: '/site/guidePage',
        name: 'site_guidePage',
        meta: {
            title: '新手导购页面编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/guide/guidePage'))
            })
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
                resolve(require('@/components/site/gb/topic/topicList'));
            });
        }
    }, {
        path: '/admin/special-goods/list',
        name: 'topic_topicGoods',
        meta: {
            title: '专题商品',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/topic/topicGoods'));
            });
        }
    }, {
        path: '/topic/topicEdit',
        name: 'topic_topicEdit',
        meta: {
            title: '编辑专题',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/topic/topicEdit'));
            });
        }
    }, {
        path: '/topic/topicAdd',
        name: 'topic_topicAdd',
        meta: {
            title: '新增专题',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/topic/topicAdd'));
            });
        }
    }, {
        path: '/topic/plateGoods',
        name: 'topic_plateGoods',
        meta: {
            title: '板块详情',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/topic/plateGoods'));
            });
        }
    },
    // 专题板块列表
    {
        path: '/admin/special-position/lists',
        name: 'topic_special_position_list',
        meta: {
            title: '专题板块列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/topic/postionList'));
            });
        }
    },
    // 板块编辑
    {
        path: '/admin/special-position/edit',
        name: 'topic_special_position_edit',
        meta: {
            title: '板块编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/topic/postionListEdit'));
            });
        }
    },
    // 批发询价
    {
        path: '/admin/inquiry/list',
        name: 'personal_wholesalePrice',
        meta: {
            title: '批发询价',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/personal/wholesalePrice'));
            });
        }
    },
    // 广告位
    {
        path: '/admin/banner-position/list',
        name: 'site_adGroupList',
        meta: {
            title: 'banner显示位置设置',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/ads/adGroupList'));
            });
        }
    }, {
        path: '/admin/banner/list',
        name: 'site_adList',
        meta: {
            title: 'banner设置',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/ads/adList'));
            });
        }
    }, {
        path: '/admin/banner/edit',
        name: 'site_adEdit',
        meta: {
            title: 'banner编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/ads/adEdit'));
            });
        }
    }, {
        path: '/admin/banner/add',
        name: 'site_adAdd',
        meta: {
            title: 'banner新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/ads/adEdit'));
            });
        }
    },
    // 品牌列表
    {
        path: '/promotion/brand-active/lists',
        name: 'site_brandList',
        meta: {
            title: '品牌列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/brand/brandList'));
            });
        }
    },{
        path: '/promotion/brand-active/edit',
        name: 'site_brandEdit',
        meta: {
            title: '品牌编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/brand/brandEdit'));
            });
        }
    },{
        path: '/promotion/brand-active/add',
        name: 'site_brandAdd',
        meta: {
            title: '品牌新增',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/brand/brandEdit'));
            });
        }
    },
    // 订单GB列表
    {
        path: '/order/index/list',
        meta: {
            title: '订单列表',
        },
        name: 'order_orderList_gb',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/order/orderList_GB'));
            });
        }
    },

    //订单GB详情
    {
      path: '/order/orderDetail',
      meta: {
        title: '订单详情',
      },
      name:'order_orderDetail_gb',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@/components/site/gb/order/orderDetail_GB'));
        });
      },
    },

    //订单GB配置
    {
      path: '/order/index/order-setting',
      meta: {
        title: '订单配置',
      },
      name:'order_setOrder_gb',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@/components/site/gb/order/setOrder_GB'));
        });
      },
    },

    // pro program
    {
        path: '/site/proProgramList',
        name: 'proProgramList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/proProgram/proProgramList.vue'));
            });
        }
    },
    // gift cards
    {
        path: '/site/giftCardsList',
        name: 'giftCardsList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/giftCards/giftCardsList.vue'));
            });
        }
    },
    // 站点语言管理
    {
        path: '/admin/language/all-list',
        name: 'site_langList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/pipeLine/langList.vue'));
            });
        }
    },
    // 站点-渠道列表
    {
        path: '/base/site/site-pipelines',
        name: 'site_sitePipeList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/pipeLine/sitePipeList.vue'));
            });
        }
    },
    // 渠道列表
    {
        path: '/admin/pipeline/list',
        name: 'site_pipeList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/pipeLine/pipeList.vue'));
            });
        }
    },
    // 渠道编辑
    {
        path: '/site/pipeEdit',
        name: 'site_pipeEdit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/pipeLine/pipeEdit.vue'));
            });
        }
    },
    // blog列表
    {
        path: '/blog/article/list',
        name: 'blogList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/blogs/blogList.vue'));
            });
        }
    },
    // blog 新增
    {
        path: '/blog/article/add',
        name: 'blogAdd',
        meta: {
            title: '新增Blog',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/blogs/blogSet.vue'));
            });
        }
    },
    // blog 编辑
    {
        path: '/blog/article/edit',
        name: 'blogEdit',
        meta: {
            title: '编辑Blog',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/blogs/blogSet.vue'));
            });
        }
    },
    // blog banner列表
    {
        path: '/blog/banner/list',
        name: 'blogBannerList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/blogs/bannerList.vue'));
            });
        }
    },
    // blog 作者
    {
        path: '/blog/author/list',
        name: 'blogAuthorList',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/blogs/authorList.vue'));
            });
        }
    },
    //多语言管理
    {
        path: '/admin/multiple-language/list',
        name: 'multiLangManage',
        meta: {
            title: '多语言管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/multiLang/multiLangManage.vue'));
            });
        }
    },
    //静态语言包管理
    {
        path: '/admin/multiple-language/content-list',
        name: 'staticLangPackManage',
        meta: {
            title: '静态语言包管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/multiLang/staticLangPackManage.vue'));
            });
        }
    },
    //app升级管理
    {
        path: '/admin/app-version/list',
        name: 'appVersionManage',
        meta: {
            title: 'app升级管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/appVersion/appVersionList.vue'));
            });
        }
    },
     {
        path: '/promotion/explore-goods',
        name: 'coolGoodsList',
        meta: {
            title: 'Cool商品管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/coolGoods/list.vue'));
            })
        }
    },
    // 自定义邮件模板列表
    {
        path: '/admin/emailTemplate/list',
        name: 'emailTemplateList',
        meta: {
            title: '自定义邮件模板',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/emailTemplate/list.vue'));
            });
        }
    },

    // 自定义邮件模板编辑或者添加
    {
        path: '/admin/emailTemplate/edit',
        name: 'emailTemplateEdit',
        meta: {
            title: '编辑/添加邮件模板',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/emailTemplate/edit.vue'));
            });
        }
    },

    // 自定义邮件模板 预览
    {
        path: '/admin/emailTemplate/preview',
        name: 'emailTemplatePreview',
        meta: {
            title: '预览邮件模板',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/emailTemplate/preview.vue'));
            });
        }
    },

    // 后台video管理
    {
        path: '/admin/video/list',
        name: 'adminVideoList',
        meta: {
            title: '视频管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/video/list.vue'));
            });
        }
    },
    // 后台video编辑
    {
        path: '/admin/video/edit',
        name: 'adminVideoEdit',
        meta: {
            title: '视频管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/video/edit.vue'));
            })
        }
    },
    // 问题反馈
    {
        path: '/admin/feedback/list',
        name: 'feedbackList',
        meta: {
            title: '问题反馈',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/feedback/list.vue'));
            })
        }
    },
    // 问题反馈详情
    {
        path: '/admin/feedback/info',
        name: 'feedbackInfo',
        meta: {
            title: '问题反馈详情',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/feedback/info.vue'));
            })
        }
    },
    // 活动标签管理>标签列表
    {
        path: '/promotion/label-management/lists',
        name: 'labelManagementLists',
        meta: {
            title: '标签列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/labelManagement/list.vue'));
            })
        }
    },
    // 活动标签管理>标签列表>新增标签
    {
        path: '/promotion/label-management/add',
        name: 'labelManagementAdd',
        meta: {
            title: '新增标签',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/labelManagement/edit.vue'));
            })
        }
    },
    // 活动标签管理>标签列表>编辑标签
    {
        path: '/promotion/label-management/edit',
        name: 'labelManagementEdit',
        meta: {
            title: '编辑标签',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/labelManagement/edit.vue'));
            })
        }
    },
    // 活动标签管理>标签商品列表
    {
        path: '/promotion/label-management/goods-lists',
        name: 'labelManagementGoodsList',
        meta: {
            title: '标签商品列表',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/labelManagement/goodsList.vue'));
            })
        }
    },
    // 地址本管理列表
    {
        path: '/admin/address-rule/list',
        name: 'addressCheckList',
        meta: {
            title: '地址本校验管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/addressCheck/list.vue'));
            })
        }
    },
    {
        path: '/admin/address-rule/add',
        name: 'addressCheckAdd',
        meta: {
            title: '添加地址本校验',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/addressCheck/edit.vue'));
            })
        }
    },
    {
        path: '/admin/address-rule/edit',
        name: 'addressCheckEdit',
        meta: {
            title: '编辑地址本校验',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/site/gb/addressCheck/edit.vue'));
            })
        }
    },
]
