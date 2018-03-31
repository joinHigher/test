// import plugins
import Vue from 'vue';
import router from './route/index.js';
import siteList from './route/siteList.js';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui';
import store from './service/store.js';
import App from './index.vue';

import './assets/vender/index.css';
import './assets/css/style.less';

// 引入ue
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.js'

// 引入mockjs
require('./mock.js');

// custom timezone
import service from './service/custom.js';
Vue.use(service);

import zhLang from 'element-ui/lib/locale/lang/zh-CN';
import enLang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

locale.use(zhLang);

// use plugins
Vue.use(VueResource);
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
    next();
});

// vue-resource options
Vue.http.options.emulateJSON = true;

const rootMenu = location.protocol + '//' + location.host;
Vue.http.options.root = (location.host === 'localhost:8080') ? '/api-dev' : rootMenu;
// 添加eventBus
Vue.prototype.$eventHub= Vue.prototype.$eventHub ||  new Vue();

const app = new Vue({
    el: '#app',
    store: store,
    router,
    template: '<App/>',
    components: { App }
});

app.$store.commit('setSiteList', siteList);

Vue.http.interceptors.push((req, next) => {
    next(res => {
        if (res.status === 404) {
            app.$message.error('当前状态404，页面未找到');
            return res;
        } else if (res.status !== 200) {
            app.$message.error(res.body.message);
            return res;
        } else {
            if (res.body.code === 403) {
                location.href = 'http://' + location.host + '/base/login/logout';
                return res;
            } else if (res.body.code === 402) {
                app.$message.warning(res.body.message);
                return res;
            } else {
                return res;
            }
        }
    });
});
