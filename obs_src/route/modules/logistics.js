export default [{
    path: '/logistics/oms/postal-list',
    meta: {
      title: 'OMS同步通邮信息',
    },
    name: 'logistics_omsInfo',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/logistics/omsInfo'));
        });
    }
}, {
    path: '/logistics/oms/logistics-list',
    meta: {
      title: 'OMS同步的物流信息',
    },
    name: 'logistics_omsMessage',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/logistics/omsMessage'));
        });
    }
}, {
    path: '/logistics/omsMessageInfo',
    name: 'logistics_omsMessageInfo',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/logistics/omsMessageInfo'));
        });
    }
}, {
    path: '/logistics/group/list',
    meta: {
      title: '物流分组',
    },
    name: 'logistics_group',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/logistics/group'));
        });
    }
}, {
    path: '/logistics/contraband-setting/list',
    meta: {
      title: '网站地址',
    },
    name: 'logistics_webAddress',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/logistics/webAddress'));
        });
    }
}, {
    path: '/logistics/partition/list',
    meta: {
      title: '物流可达国家',
    },
    name: 'logistics_shippingDivision',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/logistics/shippingDivision'));
        });
    }
}, {
    path: '/logistics/way/list',
    meta: {
      title: '物流方式',
    },
    name: 'logistics_shippingMethods',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/logistics/shippingMethods'));
        });
    }
}, {
    path: '/logistics/remoteList',
    meta: {
      title: '偏远库管理',
    },
    name: 'logistics_remoteList',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/logistics/remoteList'));
        });
    }
}, {
  path: '/logistics/remote-info/edit',
    meta: {
      title: '编辑偏远库',
    },
    name: 'remoteEdit',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/remoteEdit'));
  });
  }
},{
  path: '/logistics/logistics-area/list',
    meta: {
      title: 'OMS同步分区',
    },
    name: 'logistics_area',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/omsFeeDivision'));
  });
  }
}, {
  path: '/logistics/logistics-area-price/list',
    meta: {
      title: 'OMS同步分区价格',
    },
    name: 'logistics_area_price',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/syncZonePrice'));
  });
  }
},{
  path: '/logistics/oms/weight-price',
    meta: {
      title: 'OMS同步计费重量',
    },
    name: 'weight_price',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/syncPriceWeight'));
  });
  }
},{
  path: '/logistics/way/cost-quot',
    meta: {
      title: '计费系数',
    },
    name: 'cost_quot',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/costQuot'));
  });
  }
},{
  path: '/logistics/editCountryLogistics',
    meta: {
        title: '编辑国家物流',
      },
    name: 'editCountryLogistics',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/editCountryLogistics'));
  });
  }
},{
  path: '/logistics/editProvinceLogistics',
    meta: {
      title: '编辑州省物流',
    },
    name: 'editProvinceLogistics',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/editProvinceLogistics'));
  });
  }
},{
  path: '/logistics/rule-info/edit',
    meta: {
      title: '编辑规则',
    },
    name: 'editLogisticsRule',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/editLogisticsRule'));
  });
  }
},{
  path: '/logistics/rule-info/add',
    meta: {
      title: '新建规则',
    },
    name: 'newLogisticsRule',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/newLogisticsRule'));
  });
  }
},{
  path: '/logistics/country-info',
    meta: {
      title: '地址库',
    },
    name: 'country_info',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/addressWare'));
  });
  }
},{
    path: '/logistics/rule-info/list',
    meta: {
      title: '最优物流规则',
    },
    name: 'logistics_bestRule',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/logistics/bestRule'));
        });
    }
},{
  path: '/logistics/ware-logistics-group',
    meta: {
      title: '销售仓国家物流',
    },
    name: 'ware_Country_logistics',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/wareCountrylogistics'));
  });
  }
},{
  path: '/logistics/area-price/list',
    meta: {
      title: '物流价格',
    },
    name: 'logistics_Price',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/logisticsPrice'));
  });
  }
},{
  path: '/logistics/area/list',
    meta: {
      title: '物流分区',
    },
    name: 'logistics_Subarea',
    component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/logisticsSubarea'));
  });
  }
},{
  path: '/logistics/freight-calculation/index',
  meta: {
    title: '物流费用模拟计算',
  },
  name: 'logisticsFreightCalculation',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/freightCalculation/index'));
    });
  }
},{
  path: '/logistics/passport-tax/tax-list',
  meta: {
    title: '税号护照管理',
  },
  name: 'taxManage',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/logisticsAddress/taxManage/taxManage'));
    });
  }
},
  {
    path: '/logistics/passport-tax/tax-add',
    meta: {
      title: '税号护照新增',
    },
    name: 'addTaxAllocation',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/taxManage/addTaxAllocation'));
      });
    }
  },
  {
    path: '/logistics/passport-tax/tax-edit',
    meta: {
      title: '税号护照编辑',
    },
    name: 'editTaxAllocation',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/taxManage/editTaxAllocation'));
      });
    }
  },
  {
  path: '/logistics/address-rule/list',
  meta: {
    title: '地址填写规则',
  },
  name: 'addressRule',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/logistics/logisticsAddress/addressRule/addressRule'));
    });
  }
},
  {
    path: '/logistics/address-rule/add',
    meta: {
      title: '新增地址填写规则',
    },
    name: 'newAddressRule',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/addressRule/newAddressRule'));
      });
    }
  },
  {
    path: '/logistics/address-rule/edit',
    meta: {
      title: '编辑地址填写规则',
    },
    name: 'editAddressRule',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/addressRule/editAddressRule'));
      });
    }
  },
  {
    path: '/logistics/passport-tax/zip-list',
    meta: {
      title: '区号管理',
    },
    name: 'areaCodeManage',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/areaCodeManage/areaCodeManage'));
      });
    }
  },
  {
    path: '/logistics/passport-tax/zip-add',
    meta: {
      title: '新增区号',
    },
    name: 'newAreaCode',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/areaCodeManage/addAreaCode'));
      });
    }
  },
  {
    path: '/logistics/passport-tax/zip-edit',
    meta: {
      title: '编辑区号',
    },
    name: 'editAreaCode',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/areaCodeManage/editAreaCode'));
      });
    }
  },
  {
    path: '/logistics/logisticsAddress/assignAddress',
    meta: {
      title: '指定地址',
    },
    name: 'assignAddress',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/assignAddress/assignAddress'));
      });
    }
  },
  {
    path: '/logisticsAddress/assignAddress/assignAddress/addAssignAddress',
    meta: {
      title: '新增指定地址',
    },
    name: 'newAssignAddress',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/assignAddress/addAssignAddress'));
      });
    }
  },
  {
    path: '/logisticsAddress/assignAddress/assignAddress/editAssignAddress',
    meta: {
      title: '编辑指定地址',
    },
    name: 'editAssignAddress',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/logisticsAddress/assignAddress/editAssignAddress'));
      });
    }
  },
  {
    path: '/logistics/multi-language/list',
    meta: {
      title: '多语言',
    },
    name: 'multi_language',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/multi_language'));
      });
    }
  },
  {
    path: '/logistics/countryMultiLanguage',
    meta: {
      title: '国家多语言',
    },
    name: 'countryMultiLanguage',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/countryMultiLanguage'));
      });
    }
  },
  {
    path: '/logistics/addressValidateRules',
    meta: {
      title: '地址校验规则',
    },
    name: 'addressValidateRules',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/addressValidateRules/addressValidateRules'));
      });
    }
  },
  {
    path: '/logistics/newAddressValidateRules',
    meta: {
      title: '新增地址校验规则',
    },
    name: 'newAddressValidateRules',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/addressValidateRules/newAddressValidateRules'));
      });
    }
  },
  {
    path: '/logistics/editAddressValidateRules',
    meta: {
      title: '编辑地址校验规则',
    },
    name: 'editAddressValidateRules',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/addressValidateRules/editAddressValidateRules'));
      });
    }
  },
  {
    path: '/logistics/shipping-area/list',
    meta: {
      title: '区域管理',
    },
    name: 'zoneManage',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/zoneManage/zoneManage'));
      });
    }
  },
  {
    path: '/logistics/shipping-area/add',
    meta: {
      title: '新增区域',
    },
    name: 'newZoneManage',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/zoneManage/newZoneManage'));
      });
    }
  },
  {
    path: '/logistics/shipping-area/edit',
    meta: {
      title: '编辑区域',
    },
    name: 'editZoneManage',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/zoneManage/editZoneManage'));
      });
    }
  },
  {
    path: '/logistics/template-area-rel/list',
    meta: {
      title: '发货区域',
    },
    name: 'shipmentsArea',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/shipmentsArea/shipmentsAreaManage'));
      });
    }
  },
  {
    path: '/logistics/template-area-rel/add',
    meta: {
      title: '新增发货区域',
    },
    name: 'newShipmentsArea',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/shipmentsArea/newShipmentsArea'));
      });
    }
  },
  {
    path: '/logistics/template-area-rel/edit',
    meta: {
      title: '编辑发货区域',
    },
    name: 'editShipmentsArea',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/shipmentsArea/editShipmentsArea'));
      });
    }
  },
  {
    path: '/logistics/template/list',
    meta: {
      title: '运费模板',
    },
    name: 'freightTemplate',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/freightTemplate'));
      });
    }
  },
  {
    path: '/logistics/warehouse-deliver-country/list',
    meta: {
      title: '仓库可发国家',
    },
    name: 'wareSentCountry',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/wareSentCountry/wareSentCountry'));
      });
    }
  },
  {
    path: '/logistics/warehouse-deliver-country/add',
    meta: {
      title: '新建仓库可发国家',
    },
    name: 'newWareSentCountry',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/wareSentCountry/operateWareSentCountry'));
      });
    }
  },
  {
    path: '/logistics/warehouse-deliver-country/edit',
    meta: {
      title: '编辑仓库可发国家',
    },
    name: 'editWareSentCountry',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/wareSentCountry/operateWareSentCountry'));
      });
    }
  },
  {
    path: '/logistics/warehouse-forbid-attrs/list',
    meta: {
      title: '仓库禁发商品',
    },
    name: 'wareForbidGoods',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/wareForbidGoods/wareForbidGoods'));
      });
    }
  },
  {
    path: '/logistics/warehouse-forbid-attrs/add',
    meta: {
      title: '新建仓库禁发商品',
    },
    name: 'newWareForbidGoods',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/wareForbidGoods/operateWareForbidGoods'));
      });
    }
  },
  {
    path: '/logistics/warehouse-forbid-attrs/edit',
    meta: {
      title: '编辑仓库禁发商品',
    },
    name: 'editWareForbidGoods',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/wareForbidGoods/operateWareForbidGoods'));
      });
    }
  },
  {
    path: '/logistics/district-config/list',
    meta: {
      title: '国家管理',
    },
    name: 'countryManage',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/countryManage'));
      });
    }
  },
  {
    path: '/logistics/way-standard/list',
    meta: {
      title: '标准物流方式',
    },
    name: 'logisticsMethods_',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/standardFreightManage/logisticsMethods/logisticsMethods'));
      });
    }
  },
  {
    path: '/logistics/area-price/list-standard',
    meta: {
      title: '标准物流价格',
    },
    name: 'logisticsPrice_',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/standardFreightManage/logisticsPrice/logisticsPrice'));
      });
    }
  },
  {
    path: '/logistics/area/standard-areas',
    meta: {
      title: '标准物流分区',
    },
    name: 'logisticsSubarea',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/standardFreightManage/logisticsSubarea/logisticsSubarea'));
      });
    }
  },
  {
    path: '/logistics/template-pipeline/list',
    meta: {
      title: '渠道模板',
    },
    name: 'channelTemplate',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('@/components/logistics/channelTemplate'));
      });
    }
  },
  {
        path: '/logistics/premium-check/list',
        meta: {
            title: '保费管理',
        },
        name: 'premiumManage',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/logistics/premiumManage/premiumManage'));
            });
        }
    },
  {
        path: '/logistics/premium-check/add',
        meta: {
            title: '新增保费勾选',
        },
        name: 'newPremium',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/logistics/premiumManage/newPremium'));
            });
        }
    },
  {
        path: '/logistics/premium-check/update',
        meta: {
            title: '编辑保费勾选',
        },
        name: 'editPremium',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/components/logistics/premiumManage/editPremium'));
            });
        }
    },

];
