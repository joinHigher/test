<!-- 商品价格变更日志 -->
<template>
    <div class="seller-list el-container">
        <el-form inline label-width="100px" :model="option">
            <el-form-item label="是否签约" prop="signStatus">
                <el-select clearable v-model="option.signStatus">
                    <el-option v-for="(item,index) in signOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="option.condition" placeholder="请输入ID或卖家账号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">搜索</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button type="primary" @click="add">创建卖家</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border v-loading="tableLoading">
            <el-table-column prop="id" label="卖家ID" width="190"></el-table-column>
            <el-table-column prop="account" label="卖家账号"></el-table-column>
            <el-table-column prop="companyName" label="公司名称"></el-table-column>
            <el-table-column prop="shopName" label="关联店铺"></el-table-column>
            <el-table-column prop="supplier" label="关联供应商"></el-table-column>
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
                    <el-button v-if="scope.row.shopName == ''" type="primary" size="small" @click="addStore(scope.row)">开通店铺</el-button>
                    <el-button v-if="scope.row.shopName != '' && scope.row.signStatus == 0 && scope.row.shopType != 1 && scope.row.supplier != ''" type="primary" size="small" @click="sign(scope.row)">签约</el-button>
                    <el-button v-if="scope.row.shopName != '' && scope.row.signStatus == 1 && scope.row.shopType != 1" type="danger" size="small" @click="unSign(scope.row)">解约</el-button>
                    <el-button type="primary" size="small" @click="edit(scope.row)">修改</el-button>
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
                    condition: '',
                    signStatus: '',
                    pageNo: 1,
                    pageSize: 20,
                },
                total: 1,
                tableData: [],
                tableLoading: false,
                signOpt: {
                    '1': '签约',
                    '2': '未签约'
                }
            };
        },
        created() {
            this.getData();
        },
        methods: {
            async getData () {
                const data = await this.httpGet_('store/seller/list', {params: this.option});
                this.tableData = data.list;
                this.total = data.totalCount;
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
            addStore (row) {
                this.$router.push({
                    name: 'store_storeAdd',
                    query: {
                        sellerId: row.id
                    }
                })
            },
            sign(row) {
                this.$confirm('签约后卖家支持在卖家后台进行数据操作，店铺归属权将属于卖家。是否继续签约操作', '签约卖家').then(async () => {
                    const data = await this.httpPost_('store/seller/sign', {id: row.id});
                    this.getData();
                });
            },
            async unSign(row) {
                this.$confirm('解约后限制卖家在卖家后台进行数据操作，店铺归属权将属于平台。是否继续解约操作？', '解约卖家').then(async () => {
                    const data = await this.httpPost_('store/seller/un-sign', {id: row.id});
                    this.getData();
                });
            },
            add () {
                this.$router.push({
                     name: 'store_sellerAdd',
                })
            },
            edit (row) {
                this.$router.push({
                    name: 'store_sellerEdit',
                    query: {
                        id: row.id
                    }
                })
            },
        }
    }
</script>

<style>

</style>
