import { httpGet, httpPost } from "./http"

// httpPost
export { httpPost, httpGet as default }
from "./http"

// 获取所有语言
export const getLangs = options => httpGet('base/public/lang-all', options)

// 获取站点下所有语言
export const getLangsBySite = options => httpGet('admin/public/languages', options)

// 获取所有终端
export const getPlatforms = options => httpGet('base/public/platform-all', options)

// 站点币种列表
export const getCurrencys = options => httpGet('pay/public/currencys', options)

// 站点支付国家列表
export const getCountrys = options => httpGet('pay/public/countrys', options)

// 站点支付方式列表
export const getChannels = options => httpGet('pay/public/channels', options)

// 获取渠道
export const getPipelines = options => httpGet('admin/public/pipelines', options)

// 获取站点
export const getSites = options => httpGet('base/public/site-list', options)

// 获取所有风控规则
export const getAllRule = options => httpGet('pay/risk/all-rule', options)

// 获取真实仓列表
export const getRealWhCodeList = options => httpGet('stock/real-warehouse/public-whcodes', options)
// 货物所有分类下拉列表
export const getAllCategory = options => httpGet('goods/category/category-drop-down', options)

// 获取所有国家列表
export const getAllCountrys = options => httpGet('promotion/index/public-country-list', options)

// 获取地址本管理字段名称
export const getFields = options => httpGet('admin/address-rule/get-address-name', options)
