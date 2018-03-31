<template>
  <div id="app">
    <header class="site-header">
        <el-row class="row-content">
            <el-col :span="3">
                <span class="logo">环球易购网站管理系统</span>
            </el-col>
            <el-col :span="21">
                <span class="account">
                    <span class="select-zone">
                        <el-form label-width="80px">
                            <el-form-item label="站点">
                                <el-select v-model="site" placeholder="请选择站点" @change="changeSite">
                                    <template v-for="item in siteOpt">
                                        <!-- single site -->
                                        <el-option v-if="!item.children" :key="item.id" :value="item.code" :label="item.name"></el-option>
                                        <!-- group -->
                                        <el-option-group v-if="item.children" :key="item.id" :label="item.name">
                                            <el-option v-for="subItem in item.children" :key="subItem.code" :value="subItem.code" :label="subItem.name"></el-option>
                                        </el-option-group>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </span>
                    <!-- timeZone select -->
                    <span class="select-zone">
                        <el-form label-width="80px">
                            <el-form-item label="时区">
                                <el-select v-model="timeZone" @change="changeTimeZone">
                                    <el-option v-for="(item, index) in timeZoneOpt" :key="index" :label="item.label + ': ' +item.time" :value="item.zone">
                                        <span class="fl">{{item.label}}</span>
                                        <span class="fr">{{item.time}}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </span>
                    <span class="user-name">Hi, <span>{{userName}}</span></span>
                    <el-button type="text" class="color-white" @click="logOut">登出</el-button>
                </span>
            </el-col>
        </el-row>
    </header>
    <el-row class="main-content">
        <el-col :span="3">
            <el-menu ref="nav" class="el-menu-vertical" theme="light-blue" :router="true" :unique-opened="true" :default-active="routeIndex[routeIndex.length - 1]" :default-openeds="routeIndex">
<!--             <el-menu ref="nav" class="el-menu-vertical" theme="light-blue" :router="true" :unique-opened="true" @select="changePath" :default-active="routeIndex[routeIndex.length - 1]" :default-openeds="routeIndex"> -->
                <template v-for="(row, index) in tableData">
                    <el-submenu :index="String(row.id)">
                        <template slot="title">
                            <i :class="row.icon_class"></i>
                            <span slot="title">{{row.name}}</span>
                        </template>
                        <el-submenu v-for="(item, _index) in row.children" :key="String(item.id)" :index="'' + item.id" v-if="item.children">
                            <template slot="title">{{item.name}}</template>
                            <el-menu-item v-for="(thirdNav, index) in item.children" :key="index" :index="'/' + thirdNav.route" >
                                {{thirdNav.name}}
                            </el-menu-item>
                        </el-submenu>

                        <el-menu-item v-for="(item, _index) in row.children" :key="item.id" :index="'/' + item.route" v-if="!item.children">
                            {{item.name}}
                        </el-menu-item>
                    </el-submenu>
                </template>
            </el-menu>
        </el-col>
        <el-col :span="21" class="right-part">
            <div class="el-container top">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item v-for="(item, index) in brandList" :key="index">{{item}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <router-view :key="key"></router-view>
        </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
    name: 'app',
    data () {
        sessionStorage.index = sessionStorage.index || '[]';
        let routeIndex = this.$store.getters.getRouterIndex.length === 0 ? JSON.parse(sessionStorage.index) : this.$store.getters.getRouterIndex;
        return {
            // top bar opt
            timeZone: 8,
            timeZoneOpt: [],
            site: '',
            siteOpt: [{
                site_code: '',
                sites: [{
                    sites: ''
                }]
            }],
            changeFlag: false,
            // left menu opt
            navIndex: '0',
            tableData: [{
                name: '',
                children: [{
                    name: '',
                    children: []
                }]
            }],
            userName: '',
            count: 0,
            routeIndex: routeIndex,
            pathArr: {},
            brandList: [],
            fullPermissions: {},
            init: false,
        }
    },
    mounted () {
        let ul = document.getElementsByClassName('el-menu-vertical')[0];
        ul.style.minHeight = (document.documentElement.clientHeight - 56) + 'px';

        this.getMenu();
        this.initTimeZone();
        this.clock();
        this.getPipe();
        this.getStore();
        this.getTerminal();
    },
    watch: {
        key () {
            // save route
            if (this.init) {
                let source = this.fullPermissions;
                let route = this.$route.path;
                let index,
                    parentId,
                    arrList;
                for (let i in source) {
                    if ('/' + source[i].route == route) {
                        index = i;
                        parentId = String(source[i].parent_id);
                        break;
                    }
                }

                if (index) {
                    arrList = [route];
                    this.getPermissionArr(parentId, arrList, source);
                    arrList = arrList.reverse();
                    sessionStorage.index = JSON.stringify(arrList);
                    this.$store.commit('setRouterIndex', arrList);
                    this.routeIndex = arrList;
                }

            }

            this.getBrand();
        }
    },
    computed: {
        key() {
            return this.$route.path + +new Date();
        },
    },
    methods: {
        // 业务相关公用数据
        async getTerminal() {
            const [opt, map] = await Promise.all([this.httpGet_('admin/site/terminals'), this.httpGet_('admin/site/mapping')]);
            this.$store.commit('setTerminal', {
                opt: opt,
                map: map,
            });
        },
        getPipe() {
            this.$http.get('admin/public/pipelines').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = {};
                    data.forEach(item => {
                        temp[item.pipeline_code] = item.pipeline_name;
                    })

                    this.$store.commit('setPipe', {
                        list: data,
                        obj: temp,
                    });
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getStore() {
            this.$http.get('store/store/drop-down-store-list').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = {};
                    data.forEach(item => {
                        temp[item.shopCode] = item.shopName;
                    })

                    this.$store.commit('setStore', {
                        list: data,
                        obj: temp,
                    });
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        //
        clock () {
            let self = this;
            setInterval(() => {
                self.timeZoneOpt.map(item => {
                    return item.time = this.dateToStr_(new Date(new Date().getTime() + 3600000 * (item.zone - 8)));
                });
            }, 1000);
        },
        // timeZoneOpt funtion install in custom.js
        initTimeZone () {
            this.timeZoneOpt = [{
                label: '西七区-美国山地（盐湖城）',
                time: '',
                zone: -7
            },{
                label: '西六区-美国中部（芝加哥）',
                time: '',
                zone: -6
            },{
                label: '西五区-美国东部（纽约/华盛顿）',
                time: '',
                zone: -5
            },{
                label: '西三区-巴西',
                time: '',
                zone: -3
            },{
                label: '零时区-葡萄牙',
                time: '',
                zone: 0
            },{
                label: '东一区-西班牙、法国、德国',
                time: '',
                zone: 1
            },{
                label: '东二区-乌克兰、意大利',
                time: '',
                zone: 2
            },{
                label: '东三区-俄罗斯',
                time: '',
                zone: 3
            },{
                label: '东八区-中国、澳洲西部',
                time: this.dateToStr_(new Date(new Date().getTime())),
                zone: 8
            },{
                label: '东九区-澳洲中部',
                time: '',
                zone: 9
            },{
                label: '东十区-澳洲西部',
                time: '',
                zone: 10
            }]
        },
        getFullPermission (obj, res) {
            for (let i in obj) {
                res[obj[i].id] = obj[i];
                if (obj[i].children && obj[i].children.length > 0) {
                    this.getFullPermission(obj[i].children, res);
                }
            }
            return res;
        },
        getPermissionArr (parentId, arr, source) {
            arr.push(parentId);
            if (source[parentId]) {
                let sub_parentId = String(source[parentId].parent_id);
                if (sub_parentId === '0') {
                    return ;
                } else {
                    this.getPermissionArr(sub_parentId, arr, source);
                }
            } else {
                return ;
            }
        },
        // get left menu data && siteOpt
        getMenu () {
            let loading = this.$loading({fullscreen: true});
            this.$http.get('base/menu/public-menus').then(res => {
                loading.close();
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data.permissions;
                    this.pathArr = JSON.parse(JSON.stringify(this.tableData));

                    this.siteOpt = data.sites;
                    this.site = data.currentSiteCode;
                    this.userName = data.userName;

                    this.$store.commit('setSite', data.currentSiteCode);
                    this.$store.commit('setDomain', data.currentDomain);
                    this.$store.commit('setAdmin', data.isSuper);
                    this.$store.commit('setUserName', data.userName);
                    this.$store.commit('setAction', data.actionPermissions.join(','));

                    let cookie  = document.cookie.split(';');
                    cookie.forEach(item => {
                        let arr = item.split('=');
                        let key = arr[0];

                        if (key === 'SITECODE') {
                            this.$store.commit('setSite', arr[1]);
                        }
                    });

                    let siteList = this.$store.getters.getSiteList[this.site];

                    if (typeof siteList != 'undefined') {
                        this.$router.addRoutes(siteList);
                    }

                    this.fullPermissions = this.getFullPermission(data.permissions, {});
                    this.getBrand();
                }
            });
        },
        // show brand
        getBrand () {
            this.$nextTick(() => {
                let arr = this.$refs.nav.defaultOpeneds;
                // console.log(arr)
                let tempArr = [];
                let temp = [];

                if (this.$route.path != '/') {
                    arr.forEach((item, index) => {
                        if (index === 0) {
                            for (let i in this.pathArr) {
                                let route = this.pathArr[i];
                                if (route.id == item) {
                                    tempArr.push(route.name);
                                    temp = route.children || [];
                                    break;
                                }
                            }
                        } else if (index < arr.length - 1) {
                            temp.forEach(route => {
                                if (route.id == item) {
                                    tempArr.push(route.name);
                                    temp = route.children || [];
                                }
                            });
                        } else {
                            temp.forEach(route => {
                                if ('/' + route.route == item) {
                                    tempArr.push(route.name);
                                    temp = route.children || [];
                                }
                            });
                        }
                    });
                }

                if (this.$route.path != arr[arr.length - 1]) {
                    tempArr.push(this.$route.meta.title);
                }
                this.$set(this, 'brandList', tempArr);
                this.init = true;
            });
        },
        // top bar handle
        changeTimeZone (val) {
            this.$store.commit('setTimeZone', val);
        },
        changeSite (val) {
            this.$store.commit('setSite', val);
            document.cookie = 'SITECODE=' + val;
            if (this.changeFlag) {
                this.getMenu();
            }
            this.changeFlag = true;
            if (this.count > 0) {
                this.$router.push({
                    path: '/'
                });
                window.sessionStorage.clear();
                location.reload();
            } else {
                this.count = 1;
            }
        },
        // menu if scale
        // changePath (value, valuePath) {
        //     sessionStorage.index = JSON.stringify(valuePath);
        //     this.$store.commit('setRouterIndex', valuePath);
        //     this.routeIndex = valuePath;
        // },
        logOut () {
            window.sessionStorage.clear();
            location.href = '/base/login/logout';
        }
    },
}
</script>

<style lang="less">
    body{
        // 全屏弹窗页面抖动
        box-sizing: border-box;
    }
    .select-zone {
        width: 500px;
        display: block;
        height: 56px;
        float: left;

        form {
            margin-top: 10px;

            .el-form-item__label {
                color: #fff;
            }
        }
    }

    .user-name {
        margin-right: 20px;
        font-size: 16px;

        span {
            font-weight: bolder;
        }
    }
</style>
