<!-- 商品排名列表 -->
<template>
    <div class="store-rank-list el-container">
        <p class="el-sub-container">店铺：<strong>{{name}}</strong></p>
        <p class="info-text">
            <i class="el-icon-information info-icon"></i>
            1.每天08:00:00(时间)更新，只展示进入分类前108名的商品排名；2.“<span class="up">&#8593;</span>”为与昨天相比今天上升排名数，“<span class="down">&#8595;</span>”为与昨天相比今天下降排名数；“--”为未进入前108名，无排名；
        </p>
        <el-form inline label-width="100px" :model="option" ref="searchForm">
<!--             <el-form-item label="可售状态" prop="goodStatus">
                <el-select clearable v-model="option.goodStatus">
                    <el-option v-for="(item, index) in statusOpt" :key="index" :label="item" :value="index"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item prop="goodSn">
                <el-input v-model="option.goodSn" placeholder="请输入SKU"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">搜索</el-button>
                <el-button type="danger" @click="resetForm">清空</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border v-loading="tableLoading" empty-text="暂无商品有排名">
            <el-table-column label="商品信息" width="400">
                <template scope="scope">
                    <div class="info">
                        <img :src="scope.row.mainImage" width="90" height="120">
                        <div class="right">
                            <p class="title">{{scope.row.goodTitle}}</p>
                            <div class="sku">
                                SKU: {{scope.row.goodSn}}
                            </div>
                            <div class="price">
                                <p>${{scope.row.price}}</p>
                                <del class="del">${{scope.row.shipPrice}}</del>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="stock" label="可售库存"></el-table-column>
            <el-table-column prop="goodsStatus" label="可售状态">
                <template scope="scope">
                    {{statusOpt[scope.row.goodsStatus]}}
                </template>
            </el-table-column>
            <el-table-column prop="grade" label="商品评分"></el-table-column>
            <el-table-column prop="firstCategory" label="一级分类排名">
                <template scope="scope">
                    <p>
                        <span v-if="scope.row.firstCategory.changRanking === ''">--</span>
                        <span v-else>
                            {{scope.row.firstCategory.ranking}}
                            <span v-if="scope.row.firstCategory.changRanking >= 0" class="up">{{Math.abs(scope.row.firstCategory.changRanking)}}&#8593;</span>
                            <span v-if="scope.row.firstCategory.changRanking < 0 && scope.row.firstCategory.changRanking != -30000" class="down">{{Math.abs(scope.row.firstCategory.changRanking)}}&#8595;</span>
                        </span>
                    </p>
                    <p>{{scope.row.firstCategory.catName}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="secondCategory" label="二级分类排名">
                <template scope="scope">
                    <p>
                        <span v-if="scope.row.secondCategory.changRanking === ''">--</span>
                        <span v-else>
                            {{scope.row.secondCategory.ranking}}
                            <span v-if="scope.row.secondCategory.changRanking >= 0" class="up">{{Math.abs(scope.row.secondCategory.changRanking)}}&#8593;</span>
                            <span v-if="scope.row.secondCategory.changRanking < 0 && scope.row.secondCategory.changRanking != -30000" class="down">{{Math.abs(scope.row.secondCategory.changRanking)}}&#8595;</span>
                        </span>
                    </p>
                    <p>{{scope.row.secondCategory.catName}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="thirdCategory" label="三级分类排名">
                <template scope="scope">
                    <p>
                        <span v-if="scope.row.thirdCategory.changRanking === ''">--</span>
                        <span v-else>
                            {{scope.row.thirdCategory.ranking}}
                            <span v-if="scope.row.thirdCategory.changRanking >= 0" class="up">{{Math.abs(scope.row.thirdCategory.changRanking)}}&#8593;</span>
                            <span v-if="scope.row.thirdCategory.changRanking < 0 && scope.row.thirdCategory.changRanking != -30000" class="down">{{Math.abs(scope.row.thirdCategory.changRanking)}}&#8595;</span>
                        </span>
                    </p>
                    <p>{{scope.row.thirdCategory.catName}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="fourthCategory" label="四级分类排名">
                <template scope="scope">
                    <p>
                        <span v-if="scope.row.fourthCategory.changRanking === ''">--</span>
                        <span v-else>
                            {{scope.row.fourthCategory.ranking}}
                            <span v-if="scope.row.fourthCategory.changRanking >= 0" class="up">{{Math.abs(scope.row.fourthCategory.changRanking)}}&#8593;</span>
                            <span v-if="scope.row.fourthCategory.changRanking < 0 && scope.row.fourthCategory.changRanking != -30000" class="down">{{Math.abs(scope.row.fourthCategory.changRanking)}}&#8595;</span>
                        </span>
                    </p>
                    <p>{{scope.row.fourthCategory.catName}}</p>
                </template>
            </el-table-column>
            <el-table-column label="更新时间" width="170">
                <template scope="scope">
                    {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
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
                name: unescape(this.$route.query.name),
                option: {
                    pageNo: 1,
                    pageSize: 20,
                    // goodStatus: '',
                    shopCode: this.$route.query.shopCode,
                    goodSn: '',
                },
                total: 1,
                statusOpt: {
                    '2': '上架',
                    '3': '下架'
                },
                tableData: [],
                tableLoading: false,
            };
        },
        created() {
            this.getData();
        },
        methods: {
            async getData() {
                const data = await this.httpGet_('store/store-ranking/list', {params: this.option});
                this.tableData = data.list;
                this.total = data.totalCount;
            },
            resetForm() {
                this.$refs.searchForm.resetFields();
            },
            ChangePage (val) {
                this.option.pageNo = val;
                this.getData();
            },
            ChangePageSize (val) {
                this.option.pageSize = val;
                this.getData();
            },
        }
    }
</script>

<style lang="less">
    .store-rank-list {
        .up {
            color: #0C0;
        }

        .down {
            color: #f00;
        }

        .info-icon {
            color: #20A0FF;
        }

        .info-text {
            margin-bottom: 10px;
        }

        .info {
            height: 100%;
            img {
                float: left;
            }

            .right {
                width: 270px;
                float: right;
            }

            .title {
                height: 72px;
            }

            .sku {
                float: left;
            }

            .price {
                width: 50px;
                float: right;

                .del {
                    color: #999;
                }
            }
        }
    }
</style>
