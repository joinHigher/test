<!-- 店铺列表 -->
<template>
    <div class="seller-list el-container">
        <el-form inline label-width="100px" :model="option">
            <el-form-item label="显示开关">
                <el-select clearable v-model="option.isShow">
                    <el-option value="1" label="显示"></el-option>
                    <el-option value="0" label="不显示"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="运营模式">
                <el-select clearable v-model="option.operationType">
                    <el-option v-for="(item, index) in operationOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="option.keyWord" placeholder="请输入ID或店铺名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">搜索</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button type="primary" @click="add">创建店铺</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border v-loading="tableLoading">
            <el-table-column prop="shopCode" label="店铺ID"></el-table-column>
            <el-table-column prop="shopName" label="店铺名称"></el-table-column>
            <el-table-column label="店铺类型">
                <template scope="scope">
                    {{typeOpt[scope.row.shopType]}}
                </template>
            </el-table-column>
            <el-table-column label="开通状态">
                <template scope="scope">
                    <span v-if="scope.row.status == 1">开通</span>
                    <span v-if="scope.row.status == 0">未开通</span>
                </template>
            </el-table-column>
            <el-table-column prop="isShow" label="显示开关">
                <template scope="scope">
                    <i v-if="scope.row.shopType != 1" :class="{'el-icon-circle-check color-success': scope.row.isShow == 1, 'el-icon-circle-cross color-danger': scope.row.isShow == 0}" @click="changeStatus(scope.row)"></i>
                </template>
            </el-table-column>
            <el-table-column label="运营模式">
                <template scope="scope">
                    {{operationOpt[scope.row.operationType]}}
                </template>
            </el-table-column>
            <el-table-column prop="grade" label="店铺评分"></el-table-column>
            <el-table-column prop="createTime" label="创建时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="最后编辑时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="updateUser" label="操作人"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-popover v-if="scope.row.shopType != 1" ref="popover" placement="left" width="100" trigger="hover">
                        <el-button type="text" size="small" @click="info(scope.row)">店铺详情</el-button>
                        <br>
                        <el-button type="text" size="small" @click="banner(scope.row)">橱窗管理</el-button>
                        <br>
                        <el-button type="text" size="small" @click="edit(scope.row)">编辑店铺</el-button>
                        <br>
                        <el-button type="text" @click="rank(scope.row)" size="small">商品排名</el-button>
                    </el-popover>
                    <el-button v-if="scope.row.shopType != 1" type="primary" size="small" v-popover:popover><i class="el-icon-more"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-sub-container text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                option: {
                    isShow: '',
                    keyWord: '',
                    operationType: '',
                    pageNo: 1,
                    pageSize: 20,
                },
                total: 1,
                tableData: [],
                tableLoading: false,
                typeOpt: {
                    '1': '自营店铺',
                    '2': '第三方店铺',
                    '3': '供应商店铺',
                    '4': 'D类型店铺'
                },
                operationOpt: {
                    '1': '自运营',
                    '2': '代运营',
                },
            };
        },
        created() {
            this.getData();
        },
        methods: {
            async getData () {
                this.tableLoading = true;
                try {
                    const data = await this.httpGet_('store/store/list', {params: this.option});
                    this.tableData = data.list;
                    this.total = data.totalCount;
                } finally {
                    this.tableLoading = false;
                }

            },
            // page
            ChangePage (val) {
                this.option.pageNo = val;
                this.getData();
            },
            ChangePageSize (val) {
                this.option.pageSize = val;
                this.getData();
            },
            add () {
                this.$router.push({
                    name: 'store_storeAdd',
                })
            },
            info (row) {
                this.$router.push({
                    name: 'store_storeInfo',
                    query: {
                        id: row.id
                    }
                })
            },
            banner (row) {
                this.$router.push({
                    name: 'store_showcaseList',
                    query: {
                        shopCode: row.shopCode,
                        name: escape(row.shopName),
                    }
                })
            },
            edit (row) {
                this.$router.push({
                    name: 'store_storeEdit',
                    query: {
                        id: row.id
                    }
                })
            },
            rank (row) {
                this.$router.push({
                    name: 'store_storeRank',
                    query: {
                        shopCode: row.shopCode,
                        name: escape(row.shopName),
                    }
                })
            },
            changeStatus (row) {
                let text = '开启店铺显示开关后，客户端展示店铺入口，是否继续操作?';
                let title = '开启显示';

                if (row.isShow == 1) {
                    text = '关闭店铺显示开关后，客户端不再展示店铺入口，是否继续操作?';
                    title = '关闭显示';
                }

                let params = {
                    id: row.id,
                    isShow: row.isShow == 1 ? 0 : 1,
                }
                this.$confirm(text, title).then(async () => {
                    let data = await this.httpPost_('store/store/is-show', params);
                    this.$message.success(data.message);
                    this.getData();
                })
            },
        }
    }
</script>

<style>

</style>
