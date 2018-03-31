export default [{
        path: '/pay/channel/list',
        name: 'payment_channel',
        meta: {
            title: '支付渠道管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentChannel'));
            });
        }
    },
    {
        path: '/pay/range/list',
        name: 'payment_amount',
        meta: {
            title: '金额区间',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/payAmount'));
            });
        }
    },
    {
        path: '/pay/currency/list',
        name: 'pay_currency',
        meta: {
            title: '支付币种管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/payCurrency'));
            });
        }
    },
    {
        path: '/pay/account/list',
        name: 'payment_account',
        meta: {
            title: '收款账号管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentAccount'));
            });
        }
    },
    {
        path: '/pay/rate/list',
        name: 'payment_exchangeRate',
        meta: {
            title: '站点汇率管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentExchangeRate'));
            });
        }
    },
    {
        path: '/pay/platform-rate/list',
        name: 'payment_exchangeRateAll',
        meta: {
            title: '平台汇率管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentExchangeRateAll'));
            });
        }
    },
    {
        path: '/pay/card/list',
        name: 'payment_giftCard',
        meta: {
            title: '礼品卡管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentGiftCard'));
            });
        }
    },
    // 风控管理
    {
        path: '/pay/risk/black-list',
        name: 'payment_riskList',
        meta: {
            title: '名单管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentRiskList'));
            });
        }
    },
    {
        path: '/pay/risk/decision',
        name: 'payment_decisionList',
        meta: {
            title: '决策规则管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentDecisionList'));
            });
        }
    },
    {
        path: '/pay/risk/event-list',
        name: 'payment_eventList',
        meta: {
            title: '事件管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentEventList'));
            });
        }
    },
    // 操作日志
    {
        path: '/pay/log/list',
        name: 'operation_log',
        meta: {
            title: '操作日志',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/operationLog'));
            });
        }
    },
    // 交易路由配置
    {
        path: '/pay/sort/credit-list',
        name: 'creditCardPriority',
        meta: {
            title: '信用卡渠道优先级排序',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentCardPriority'));
            });
        }
    },
    // 引导路由配置
    {
        path: '/pay/channel-letters/list',
        name: 'copyManagement',
        meta: {
            title: '支付渠道文案管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentCopyManagementList'));
            });
        }
    },
    {
        path: '/pay/channel/card-relation-list',
        name: 'cardRouteManage',
        meta: {
            title: '卡种路由管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/cardRouteManage'));
            });
        }
    },
    {
        path: '/pay/channel-letters/copy-management-edit',
        name: 'copyManagementSet',
        meta: {
            title: '支付渠道文案编辑',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/paymentCopyManagementSet'));
            });
        }
    },
    // 站点交易信息管理
    {
        path: '/pay/record/list',
        name: 'tradingInformationList',
        meta: {
            title: '站点交易信息',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/payTradingInformationList'));
            });
        }
    },

    // 巴西分期利率设置
    {
        path: '/pay/installment-brazil/default-list',
        name: 'installmentBrazil',
        meta: {
            title: '巴西分期利率设置',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/installmentBrazil'));
            });
        }
    },
    {
        path: '/pay/installment-mexico/default-list',
        name: 'installmentMexico',
        meta: {
            title: '墨西哥分期利率',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/installmentMexico'));
            });
        }
    },

    // 支付错误码库
    {
        path: '/pay/code/type-list',
        name: 'errorCodeList',
        meta: {
            title: '支付错误码库',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/errorCodeList'));
            });
        }
    },

    // 网站提示多语言配置
    {
        path: '/pay/code/lang-list',
        name: 'langsSetTip',
        meta: {
            title: '网站提示多语言配置',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/errorCodeLangList'));
            });
        }
    },

    // 电子钱包列表
    {
        path: '/pay/wallet/list',
        name: 'walletList',
        meta: {
            title: '电子钱包管理',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/walletList'));
            });
        }
    },

    // 电子钱包详细
    {
        path: '/pay/wallet/record',
        name: 'walletDetails',
        meta: {
            title: '电子钱包详细',
        },
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/payment/walletDetails'));
            });
        }
    }
];
