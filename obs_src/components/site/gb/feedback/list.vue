<!--问题反馈-->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label="终端" prop="platform">
                    <el-select multiple v-model="option.platform">
                        <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline">
                    <el-select multiple v-model="option.pipeline">
                        <el-option v-for="(item, index) in pipelines" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语言" prop="lang">
                    <el-select multiple v-model="option.lang">
                        <el-option v-for="(item, index) in languages" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源页面" prop="source_type">
                    <el-select filterable multiple v-model="option.source_type" @change="sourceTypeChange">
                        <el-option v-for="(item, index) in pageTypes" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题类型" prop="error_type" v-if="option.source_type.indexOf('goodsDetail') > -1">
                    <el-select multiple v-model="option.error_type">
                        <el-option v-for="(item, index) in errorTypes" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="star">
                    <el-checkbox v-model="option.star" true-label="1">星标</el-checkbox>
                </el-form-item>
                <el-form-item label="sku/内容/ID" prop="keyword">
                    <el-input v-model="option.keyword" placeholder="搜索sku/内容/ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData()">筛选</el-button>
                    <el-button type="danger" @click="resetForm('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table border v-loading="isDataLoading" :data="tableData">
                <el-table-column label="星标" width="80px">
                    <template scope="scope">
                        <label class="click-icon">
                            <i v-if="scope.row.with_star.toString() === '1'" class="el-icon-star-on" @click="setStart(scope.row, 0)"></i>
                            <i v-else class="el-icon-star-off" @click="setStart(scope.row, 1)"></i>
                        </label>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="80px"></el-table-column>
                <el-table-column label="终端" width="100px">
                    <template scope="scope">
                        {{ platforms[scope.row.platform] }}
                    </template>
                </el-table-column>
                <el-table-column label="渠道" width="100px">
                    <template scope="scope">
                        {{ pipelines[scope.row.pipeline] }}
                    </template>
                </el-table-column>
                <el-table-column label="语言" width="100px">
                    <template scope="scope">
                        {{ languages[scope.row.lang] }}
                    </template>
                </el-table-column>
                <el-table-column label="来源页面">
                    <template scope="scope">
                        {{ pageTypes[scope.row.source_type] }}
                    </template>
                </el-table-column>
                <el-table-column prop="sku" label="sku"></el-table-column>
                <el-table-column label="问题类型" width="180px">
                    <template scope="scope">
                        {{ errorTypes[scope.row.error_type] }}
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="反馈内容"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column label="时间" width="110px">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column prop="comment" label="备注"></el-table-column>
                <el-table-column label="操作" width="90px">
                    <template scope="scope">
                        <router-link :to="{name: 'feedbackInfo', query: {id: scope.row.id}}" class="el-button el-button--small el-button--primary" v-if="self.showAction_('admin/feedback/info')">详情</router-link>
                    </template>
                </el-table-column>
            </el-table>

            <div class="el-container text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50, 100]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { getLangsBySite, getPipelines } from '@/common/baseApi'
    export default {
        data () {
            return {
                self: this,
                isDataLoading: false,
                tableData: [],
                option: {
                    platform: [],
                    pipeline: [],
                    lang: [],
                    source_type: [],
                    error_type: [],
                    keyword: '',
                    star: '',
                    page: 1,
                    size: 10,
                },
                total: 0,
                languages: {},
                pipelines: {},
                platforms: {
                    '1': 'WAP',
                    '2': 'PC',
                    '3': 'IOS',
                    '4': 'ANDROID',
                    '5': 'PAD',
                },
                pageTypes: {},
                errorTypes: {
                    '1': 'Product Description',
                    '2': 'Pricing Mistake',
                    '3': 'Photograph / Image',
                    '4': 'Other Issue(s)',
                    '5': 'language error',
                },
            }
        },
        created() {
            this.getCommonData();
            this.getPageType();
            this.getData();
        },
        methods: {
            // 获取公用数据
            async getCommonData() {
                const [languages, pipelines,] = await Promise.all([getLangsBySite(), getPipelines()]);
                //语言
                let languagesText = {};
                languages.forEach((item) => {
                    languagesText[item.language_en] = item.language_ch
                });
                this.languages = languagesText;

                //渠道
                let pipelinesText = {};
                pipelines.forEach((item) => {
                    pipelinesText[item.pipeline_code] = item.pipeline_name;
                });
                this.pipelines = pipelinesText;
            },
            // 获取来源页面
            async getPageType() {
                const data = await this.httpGet_('admin/public/page-type');
                this.pageTypes = data;
            },
            async getData() {
                let params = {
                    platform: this.option.platform.toString(),
                    pipeline: this.option.pipeline.toString(),
                    lang: this.option.lang.toString(),
                    source_type: this.option.source_type.toString(),
                    error_type: this.option.error_type.toString(),
                    keyword: this.option.keyword,
                    star: this.option.star,
                    page: this.option.page,
                    size: this.option.size,
                };

                const data = await this.httpGet_('admin/feedback/list', {params: params});
                this.tableData = data.list;
                this.total = data.total;
            },
            //设置星标
            setStart(row, type) {
                let index = this.tableData.indexOf(row);
                let params = {
                    id: row.id,
                    star: row.with_star === 0 ? 1 : 0
                };
                this.isDataLoading = true;

                this.$http.post('admin/feedback/star', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message({
                            message: res.body.message,
                            type: 'success'
                        });
                        this.tableData[index].with_star = type;
                        this.isDataLoading = false;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            sourceTypeChange() {
                if(this.option.source_type.indexOf('goodsDetail') < 0) {
                    this.option.error_type = [];
                }
            },
            ChangePage (val) {
                this.option.page = val;
                this.getData();
            },
            ChangePageSize (val) {
                this.option.size = val;
                this.getData();
            },
            resetForm(form) {
                this.$refs[form].resetFields();
            },
        }
    }
</script>

<style scoped lang="less">
    .click-icon i{
        cursor: pointer;
    }
</style>
