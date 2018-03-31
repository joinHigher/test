import Vue from 'vue';
import Router from 'vue-router';

import store from './modules/store';
import goods from './modules/goods';
import authority from './modules/authority';
import member from './modules/member';
import cart from './modules/cart';
import order from './modules/order';
import messageCenter from './modules/messageCenter';
import logistics from './modules/logistics';
import payment from './modules/payment';
import marketing from './modules/marketing';
import stock from './modules/stock';
import seo from './modules/seo';
import siteManager from './modules/siteManager';

Vue.use(Router);

let routes = [];

routes = routes.concat(store);
routes = routes.concat(goods);
routes = routes.concat(authority);
routes = routes.concat(member);
routes = routes.concat(cart);
routes = routes.concat(order);
routes = routes.concat(messageCenter);
routes = routes.concat(logistics);
routes = routes.concat(payment);
routes = routes.concat(marketing);
routes = routes.concat(stock);
routes = routes.concat(seo);
routes = routes.concat(siteManager);

export default new Router({
    routes: routes
});
