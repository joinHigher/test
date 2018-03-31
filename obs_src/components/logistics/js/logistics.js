/**
 * Created by wujinyong on 2017/12/5.
 */
export default function (Vue, options){
  /**
   * 获得运费模板数据接口
   */
  Vue.prototype.getTemplateList = function (){
    let templateList = [];
    this.$http.get('logistics/template/name-list').then(res => {
        if (res.body.code === 0 && res.body.data) {
            res.body.data.forEach(item => {
               templateList.push({id: item.id, name: item.name});
            });
        }
    });
    return  templateList;
  };

  /**
   * 获得区域数据接口
   */
  Vue.prototype.getAreaList = function (){
    let areaList = [];
    this.$http.get('logistics/shipping-area/name-list').then(res => {
       if (res.body.code===0 && res.body.data.list) {
           res.body.data.list.forEach(item => {
             areaList.push({id: item.id, name: item.name});
           });
       }
    });
    return areaList;
  };
  /**
   * 获得真实仓数据接口
   */
  Vue.prototype.getRealWareFun = function (){
    let realWareList = [];
    let realWareSession = JSON.parse(sessionStorage.getItem("realWareSession"));
    if (realWareSession && Array.isArray(realWareSession) && realWareSession.length > 0) {
        return realWareSession;
    } else {
        this.$http.get('stock/real-warehouse/public-whcodes').then( res => {
            if (res.body.code ===0 && res.body.data) {
                res.body.data.forEach( item => {
                    if (item.name && item.whCode) {
                        realWareList.push({code: item.whCode, name: item.name});
                    }
                });
                sessionStorage.setItem("realWareSession", JSON.stringify(realWareList));
            }
        });
        return realWareList;
    }
  };
  /**
   * 获得国家数据接口
   */
  Vue.prototype.getCounryListFun = function (){
    let countryList = [];
    let countrySession = JSON.parse(sessionStorage.getItem("countrySession"));
    if (countrySession && Array.isArray(countrySession) && countrySession.length > 0) {
        return countrySession;
    } else {
        this.$http.get('logistics/country-info/list',{params:{page_size:2000,page:1}}).then(res =>{
            if(res.body.code ===0 && res.body.data.list){
                res.body.data.list.forEach( item => {
                    countryList.push({id: item.countryId, code: item.countryCode, name: item.countryName});
                });
            }
            sessionStorage.setItem("countrySession", JSON.stringify(countryList));
        });
        return countryList;
    }
  };

  /**
   * 获得物流方式数据接口
   */
  Vue.prototype.getLogisticsWay = function (){
    let logisticsWayList = [];
    this.$http.get('logistics/way/public-oms-ways').then( res => {
      if(res.body.code === 0){
        res.body.data.infoList.forEach( item => {
           logisticsWayList.push({code: item.logisticsCode, name: item.logisticsName});
        });
      }
    });
    return logisticsWayList;
  };

  /**
   * 获得产品分类数据接口
   */
  Vue.prototype.getCategory = function (){
    let categoryList = [];
    this.$http.get('goods/category/list?isLeaves=false').then( res => {
      if (res.body.code ===0) {
          res.body.data.list.forEach(item => {
             categoryList.push(item);
          });
      }
    });
    return categoryList;
  };

  /**
   *获得产品性质数据接口
   */
  Vue.prototype.getAttrs = function (){
    let attrsList = [];
    this.$http.get('logistics/public/contraband-attributes').then(res => {
      if (res.body.code===0 && res.body.data) {
          res.body.data.forEach(item => {
            attrsList.push(item);
          });
      }
    });
    return attrsList;
  };

  /**
   * 获得渠道数据接口
   */
  Vue.prototype.getPipe = function () {
    let pipeList = [];
    this.$http.get('admin/public/pipelines').then(res => {
      if (res.body.code===0 && res.body.data) {
          res.body.data.forEach(item => {
             pipeList.push({code: item.pipeline_code ,name: item.pipeline_name});
          });
      }
    });
    return pipeList;
  };

  /**
   * 获得全部多语言数据接口
   */
  Vue.prototype.getMultiLan = function (status){
    let multiLanList = [];
    this.$http.post('logistics/multi-language/collection', {status: status}).then( res => {
      if (res.body.code ===0) {
          res.body.data.forEach(item => {
            multiLanList.push({id: item.id, name: item.name, lang: item.lang, langOld: item.langOld, value: ''});
          });
      }
    });
    return multiLanList;
  };

  /**
   * 通过模板id找对应的 区域数据接口
   */
  Vue.prototype.getAreaByTemplate = function (id) {
    let areaList = [];
    this.$http.get('logistics/shipping-area/template-shipping-area' , {params: {id: id }}).then(res => {
      if (res.body.code===0 && res.body.data) {
        res.body.data.forEach(item => {
          areaList.push({id: item.id ,name: item.name});
        });
      }
    });
    return areaList;
  };
  /**
   * 通过模板Id  区域id找对应的 物流分组信息
   */
   Vue.prototype.getGroupByAreaId = function (templateId, shippingAreaId) {
     let groupList = [];
     let obj = {
         searchType: 2,
         templateId: templateId,
         shippingAreaId: shippingAreaId,
     };
     this.$http.get('logistics/partition/public-info' , {params: obj}).then(res => {
       if (res.body.code===0 && res.body.data) {
           res.body.data.baseResultList.forEach(item => {
             groupList.push({id: item.groupId, name: item.groupName});
           });
       }
     });
     return groupList;
   };

  /**
   * 通过物流分组id找对应的 物流方式信息
   */
  Vue.prototype.getLogisticsCodeByGroup = function (groupId) {
    let logisticsCodeList = [];
    let obj = {
        searchType: 3,
        groupId: groupId,
    };
    this.$http.get('logistics/partition/public-info', {params: obj}).then(res => {
      if (res.body.code===0 && res.body.data) {
          res.body.data.baseResultList.forEach(item => {
            logisticsCodeList.push({id: item.wayId, name: item.wayName, code: item.logisticsCode, costQuot: item.costQuot, shippingAreaId: item.shippingAreaId, templateId: item.templateId});
          });
      }
    });
    return logisticsCodeList;
  };

  /**
   * 通过物流方式code找对应的 物流分区信息
   */
  Vue.prototype.getAreaIdByLogisticsCode = function (templateId, shippingAreaId, logisticsCode) {
    let areaIdList = [];
    let obj = {
        searchType: 4,
        templateId: templateId,
        shippingAreaId: shippingAreaId,
        logisticsCode: logisticsCode
    };
    this.$http.get('logistics/partition/public-info' , {params: obj}).then(res => {
      if (res.body.code===0 && res.body.data) {
          res.body.data.baseResultList.forEach(item => {
            areaIdList.push({id: item.areaId, name: item.areaName});
          });
      }
    });
    return areaIdList;
  };

  /**
   * 获得全部的物流分组数据接口
   */
  Vue.prototype.getAllGroupFun = function () {
     let allGroupList = [];
     this.$http.get('logistics/partition/public-info', {params: {searchType: 2}}).then(res => {
        if (res.body.code ===0 && res.body.data.baseResultList) {
            res.body.data.baseResultList.forEach(item => {
              allGroupList.push({id: item.groupId, name: item.groupName});
            });
        }
     });
     return allGroupList;
  };

  /**
   * 获得全部物流方式数据接口
   */
  Vue.prototype.getAllLogisticeWay = function () {
    let allWayList = [];
    this.$http.get('logistics/partition/public-info', {params: {searchType: 3}}).then(res => {
      if (res.body.code ===0 && res.body.data.baseResultList) {
        res.body.data.baseResultList.forEach(item => {
          allWayList.push({id: item.wayId, name: item.wayName, code: item.logisticsCode, costQuot: item.costQuot, shippingAreaId: item.shippingAreaId, templateId: item.templateId});
        });
      }
    });
    return allWayList;
  };

  /**
   *获得销售仓数据接口
   */
  Vue.prototype.getSaleWareData = function () {
    let saleWareList = [];
    this.$http.get('stock/warehouse/get-virtual-wareshouse-list').then(res => {
       if (res.body.code ===0) {
           res.body.data.forEach(item => {
              if (item.status === 1) {
                  saleWareList.push({code: item.virWhCode, name: item.virWhCnName});
              }
           });
       }
    });
    return saleWareList;
  };





};
