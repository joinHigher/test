<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">
            <table class="info-table">
                <tbody>
                    <tr>
                        <td>星标</td>
                        <td>
                            <label class="click-icon" title="点击设置星标">
                                <i v-if="tableData.with_star == '1'" class="el-icon-star-on" @click="setStart()"></i>
                                <i v-else class="el-icon-star-off" @click="setStart()"></i>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td>ID</td>
                        <td><span>{{ tableData.id }}</span></td>
                    </tr>
                    <tr>
                        <td>时间</td>
                        <td><span>{{ self.timeZone_(tableData.create_time, self.$store.getters.getTimeZone) }}</span></td>
                    </tr>
                    <tr>
                        <td>终端</td>
                        <td><span>{{ platforms[tableData.platform] }}</span></td>
                    </tr>
                    <tr>
                        <td>渠道</td>
                        <td><span>{{ pipelines[tableData.pipeline] }}</span></td>
                    </tr>
                    <tr>
                        <td>语言</td>
                        <td><span>{{ languages[tableData.lang] }}</span></td>
                    </tr>
                    <tr>
                        <td>页面类型</td>
                        <td><span>{{ pageTypes[tableData.source_type] }}</span></td>
                    </tr>
                    <tr>
                        <td>来源链接</td>
                        <td><span>{{ tableData.source_url }}</span></td>
                    </tr>
                    <tr>
                        <td>问题类型</td>
                        <td><span>{{ errorTypes[tableData.error_type] }}</span></td>
                    </tr>
                    <tr>
                        <td>反馈内容</td>
                        <td><span>{{ tableData.content }}</span></td>
                    </tr>
                    <tr>
                        <td>邮箱</td>
                        <td><span>{{ tableData.email }}</span></td>
                    </tr>
                    <tr>
                        <td>附件</td>
                        <td>
                            <a target="_blank" class="down-link" v-for="item in tableData.file" :href="item.url">{{ item.name }}</a>
                        </td>
                    </tr>
                    <tr class="edit-comment">
                        <td>备注</td>
                        <td class="clearfix">
                            <el-input type="textarea" :disabled="self.isEditComment === false" v-model="tableData.comment" :rows="3"></el-input>
                            <el-button type="primary" size="small" v-if="self.showAction_('admin/feedback/comment')" @click="editComment(self.isEditComment === true ? 1 : 0)">{{ self.isEditComment === true ? '保存' : '编辑' }}</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { getLangsBySite, getPipelines } from '@/common/baseApi'
    export default {
        data() {
            return {
                self: this,
                id: this.$route.query.id,
                isDataLoading: false,
                tableData: {},
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
                isEditComment: false,
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
                const data = await this.httpGet_('admin/feedback/info', {params: {id: this.id}});
                this.tableData = data;
            },
            //设置星标
            setStart() {
                let params = {
                    id: this.id,
                    star: this.tableData.with_star === 0 ? 1 : 0
                };

                this.isDataLoading = true;

                this.$http.post('admin/feedback/star', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message({
                            message: res.body.message,
                            type: 'success'
                        });
                        this.tableData.with_star = params.star;
                        this.isDataLoading = false;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            //更新备注信息
            editComment(type) {
                this.isEditComment = true;
                if(type === 1) {
                    let params = {
                        id: this.id,
                        comment: this.tableData.comment
                    };

                    this.isDataLoading = true;

                    this.$http.post('admin/feedback/comment', params).then(res => {
                        if (res.body.code === 0) {
                            this.$message({
                                message: res.body.message,
                                type: 'success'
                            });

                        } else {
                            this.$message.error(res.body.message);
                        }

                        this.isDataLoading = false;
                        this.isEditComment = false;
                        this.getData();
                    });
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .click-icon i {
        cursor: pointer;
    }

    .info-table {
        width: 80%;
        border: 1px solid #dfe6ec;
        font-size: 14px;
        border-collapse: collapse;
        tr {
            td {
                border: 1px solid #dfe6ec;
                padding: 10px;
            }
            td:first-child {
                width: 100px;
                font-weight: bold;
            }
        }
    }

    .down-link {
        text-decoration: underline;
        margin-right: 20px;
    }
</style>
