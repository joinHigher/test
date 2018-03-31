// 引入mockjs
const Mock = require('mockjs');

// 引入模块mock对象
import goods from '@/service/mock/goods';
// import marketing from '@/service/mock/marketing';

let mockList = [];

mockList = mockList.concat(goods);
// mockList = mockList.concat(marketing);

mockList.forEach(item => {
    Mock.mock(item.url, item.type, item.data);
});
