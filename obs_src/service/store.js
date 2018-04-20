import Vue from 'vue';
import Vuex from 'vuex';

// set lang
// import locale from 'element-ui/lib/locale';
// import zhLang from 'element-ui/lib/locale/lang/zh-CN';
// import enLang from 'element-ui/lib/locale/lang/en';
// var langOption = {};
// langOption.zhLang = zhLang;
// langOption.enLang = enLang;

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        routerIndex: [],
        routerList: {},
        timeZone: 8,
        site: '',
        userName: '',
        actionPermissons: [],
        domain: '',
        siteList: {},
        admin: '',
        pipe: {},
        store: {},
        terminal: {},
        deeplinkObj: [],
    },
    mutations: {
        setSiteList (state, index) {
            state.siteList = index;
        },
        setRouterIndex (state, index) {
            state.routerIndex = index;
        },
        setTimeZone (state, index) {
            state.timeZone = index;
        },
        setSite (state, index) {
            state.site = index;
        },
        setAction (state, index) {
            state.actionPermissons = index;
        },
        setAdmin (state, index) {
            state.admin = index;
        },
        setUserName (state, index) {
            state.userName = index;
        },
        setDomain (state, index) {
            state.domain = index;
        },
        setLang (state, index) {
            // set lang
            // locale.use(langOption[index]);
        },
        setPipe (state, index) {
            state.pipe = index;
        },
        setStore (state, index) {
            state.store = index;
        },
        setDeeplink (state, index) {
            state.deeplinkObj = index;
        },
        setTerminal(state, index) {
            state.terminal = index;
        }
    },
    getters: {
        getSiteList: state => {
            return state.siteList;
        },
        getRouterIndex: state => {
            return state.routerIndex;
        },
        getTest: state => {
            return 'test';
        },
        getRootMenu: state => {
            const rootMenu = location.protocol + '//' + location.host;
            if (location.host !== 'localhost:8080') {
                return rootMenu;
            }  else {
                return 'http://www.obs.com';
            }
        },
        getUploadUrl: state => {
            let urlObJ = {};
            let urlOpt = {};

            if (typeof CODE2NAMES !== 'undefined') {
                urlOpt = CODE2NAMES;
            } else {
                urlOpt = {};
            }

            urlObJ.reviewUrl = {
                GLB: 'http://review.stylebest.com',
                TG: 'http://review.trendsgal.com'
            };

            if (typeof DOMAIN_UPLOAD !== 'undefined') {
                urlObJ.uploadUrl = DOMAIN_UPLOAD + '/upload/new-upload?site=' + urlOpt[state.site];
            }  else {
                urlObJ.uploadUrl = 'http://www.upload.com.trunk.cg.egomsl.com';
            }
            return urlObJ;
        },
        getTimeZone: state => {
            return state.timeZone;
        },
        getSite: state => {
            return state.site;
        },
        getAdmin: state => {
            return state.admin;
        },
        getUserName: state => {
            return state.userName;
        },
        getDomain: state => {
            return state.domain;
        },
        getAction: state => {
            return state.actionPermissons;
        },
        getPipe: state => {
            return state.pipe;
        },
        getStore: state => {
            return state.store;
        },
        getTerminal: state => {
            return state.terminal;
        },
        getDeeplink: state => {
            state.deeplinkObj = [
                {value: '分类列表(gearbest://category?category_id=)', url: 'gearbest://category?category_id='},
                {value: '商品详情(gearbest://product?goods_web_sn=&warehouse_code=)', url: 'gearbest://product?goods_web_sn=&warehouse_code='},
                {value: '登录(gearbest://login)', url: 'gearbest://login'},
                {value: '注册(gearbest://register)', url: 'gearbest://register'},
                {value: '个人中心(gearbest://account)', url: 'gearbest://account'},
                {value: '首页(gearbest://home)', url: 'gearbest://home'},
                {value: '搜索(gearbest://search?keyword=)', url: 'gearbest://search?keyword='},
                {value: '品牌墙(gearbest://brandWallDetail?brandCode=&brandName=)', url: 'gearbest://brandWallDetail?brandCode=&brandName='},
                {value: '品牌闪购(gearbest://brandSales?tab=)', url: 'gearbest://brandSales?tab='},
                {value: '个人中心Coupon列表(gearbest://coupon/)', url: 'gearbest://coupon/'},
                {value: 'livePerson客服(gearbest://livePerson/)', url: 'gearbest://livePerson/'},
                {value: '手机浏览器打开网址(gearbest://link?url=)', url: 'gearbest://link?url='},
                {value: '内置浏览器(gearbest://webview?title=&url=)', url: 'gearbest://webview?title=&url='},
                {value: '品牌列表(gearbest://brandList)', url: 'gearbest://brandList'},
                {value: 'deals页面(gearbest://class?type=1)', url: 'gearbest://class?type=1'},
                {value: 'PreSals页面(gearbest://class?type=2)', url: 'gearbest://class?type=2'},
                {value: 'NewGadgets页面(gearbest://class?type=3)', url: 'gearbest://class?type=3'},
            ];

            return state.deeplinkObj;
        }
    }
});
