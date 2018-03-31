<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">
            <el-form :model="tableData" :rules="rules" ref="mapForm" label-width="200px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="平台" prop="platform">
                            <el-radio-group v-model="tableData.platform" @change="filterChange">
                                <el-radio v-for="(item, index) in terminalText" v-if="index == 1 || index == 2" :label="index" :key="index">{{item}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="tableData.platform == 1">
                    <el-col :span="12">
                        <el-form-item label="渠道" prop="pipeline_code">
                            <el-select v-model="tableData.pipeline_code" filterable clearable placeholder="请选择" @change="filterChange">
                                <el-option v-for="(item, index) in pipelines" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item v-for="data in tableData.data" :label="typeText[data.type]" :key="typeText[data.type]">
                            <el-col :span="11">
                                <el-select v-model="data.weight">
                                    <el-option v-for="(item, index) in rateOption.value" :value="item" :key="index"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="11" :offset="2">
                                <el-select v-model="data.interval">
                                    <el-option v-for="item in rateOption.rule" :key="item.label" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" v-if="self.showAction_('seo/sitemap/edit')" @click="save" v-loading="postLoading" :disabled="postLoading">保存生成频率</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <hr class="mt30">
            <!--robots静态部分文件配置-->
            <el-form label-width="200px" class="mt30">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="robots静态部分文件配置">
                            <el-input v-model="header" type="textarea" :rows="10"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="text-center">
                            <el-button type="primary" @click="saveHeader" v-if="self.showAction_('seo/sitemap/save-header')" v-loading="headerLoading" :disabled="headerLoading">保存</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
import httpGet, {httpPost, getLangs, getPipelines, getPlatforms} from '@/common/baseApi'
let types = [{
    type: 'index',
    weight: '0.1',
    interval: 'never'
},{
    type: 'category',
    weight: '0.1',
    interval: 'never'
},{
    type: 'products',
    weight: '0.1',
    interval: 'never'
},{
    type: 'keywords',
    weight: '0.1',
    interval: 'never'
},{
    type: 'images',
    weight: '0.1',
    interval: 'never'
}]
export default {
    data () {
        const valueArr = [];
        const ruleArr = [{
                    label: '从不更新',
                    value: 'never'
                }, {
                    label: '一直更新',
                    value: 'always'
                },{
                    label: '小时',
                    value: 'hourly'
                },{
                    label: '天',
                    value: 'daily'
                },{
                    label: '周',
                    value: 'weekly'
                },{
                    label: '月',
                    value: 'monthly'
                },{
                    label: '年',
                    value: 'yearly'
                }];

        for (let i = 0.1; i <= 1; i += 0.1) {
            valueArr.push(i.toFixed(1));
        }

        return {
            self: this,
            postLoading: false,
            isDataLoading: false,
            tableData: {
                pipeline_code: 'GB',
                platform: '1',
                data: JSON.parse(JSON.stringify(types))
            },
            langs: {},
            pipelines: {},
            terminalText: {},
            rateOption: {
                value: valueArr.reverse(),
                rule: ruleArr,
            },
            rules: {
                platform:  { required: true, message: '请选择平台', trigger: 'change' },
                pipeline_code:  { required: true, message: '请选择渠道', trigger: 'change' },
                lang:  { required: true, message: '请选择语言', trigger: 'change' }
            },
            typeText: {
                'index': '首页',
                'category': '分类页',
                'products': ' 产品页',
                'keywords': '搜索页',
                'images': '图片页'
            },
            header: '',
            headerLoading: false,
        };
    },
    created () {
        this.getData();
        this.getHeader();
    },
    methods: {
        async getData () {
            this.isDataLoading = true;
            const [pipelines, langs, platforms] = await Promise.all([getPipelines(), getLangs(), getPlatforms()])
            let pipelinesText = {};
            pipelines.forEach((item) => {
                pipelinesText[item.pipeline_code] = item.pipeline_name;
            });
            this.pipelines = pipelinesText;

            let langsText = {};
            langs.forEach((item) => {
                langsText[item.language_code] = item.language_name
            })
            this.langs = langsText;

            let terminalText = {};
            for(let i in platforms) {
                terminalText[platforms[i]] = i
            }
            this.terminalText = terminalText;

            let params = {
                platform: this.tableData.platform
            }
            if (this.tableData.platform == 1) {
                params.pipeline_code = this.tableData.pipeline_code;
            } else if (this.tableData.platform == 2){
                params.pipeline_code = 'GB';
            }

            try {
                const data = await httpGet('seo/sitemap/info', { params });
                this.isDataLoading = false;
                if(data.length > 0) {
                    data.forEach((item) => {
                        let index = this.tableData.data.findIndex((cItem) => {
                            return cItem.type == item.type
                        })
                        if(index > -1) {
                            this.$set(this.tableData.data, index, item);
                        }
                    })
                }
            } catch(e) {
                this.isDataLoading = false;
            }
        },
        save () {
            let params = JSON.parse(JSON.stringify(this.tableData));
            if(params.platform == 2) {
                params.pipeline_code = 'GB'
            }
            this.$refs['mapForm'].validate(async (valid) => {
                if (valid) {
                    this.postLoading = true;
                    try {
                        let {code, message, data} = await httpPost('seo/sitemap/edit', {data: JSON.stringify(params)})
                        this.postLoading = false;
                        if(code === 0) {
                            this.$message({
                                type: 'success',
                                message: message
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: message
                            });
                        }
                    } catch(e) {
                        this.postLoading = false;
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        filterChange() {
            this.tableData.data = JSON.parse(JSON.stringify(types));
            this.$nextTick(() => {
                this.getData();
                this.getHeader();
            });
        },

        // 获取文件头部配置
        getHeader () {
            let params = {
                platform: this.tableData.platform,
                pipeline_code: this.tableData.pipeline_code,
            };
            if(params.platform === '2') {
                params.pipeline_code = 'GB'
            }
            this.$http.get('seo/sitemap/header', {params: params}).then(res => {
                if (res.body.code === 0) {
                    this.header = res.body.data;
                } else {
                    this.header = '';
                }
            });
        },

        // 设置文件头部配置
        saveHeader () {
            this.$refs['mapForm'].validate(async (valid) => {
                if (valid) {
                    if (this.header === '') {
                        this.$message({
                            type: 'warning',
                            message: 'robots静态部分文件配置不能为空'
                        })
                        return;
                    }
                    let params = {
                        platform: this.tableData.platform,
                        pipeline_code: this.tableData.pipeline_code,
                        header: this.header,
                    }
                    if(params.platform === '2') {
                        params.pipeline_code = 'GB'
                    }
                    this.headerLoading = true;
                    try {
                        let {code, message, data} = await httpPost('seo/sitemap/save-header', params)
                        this.headerLoading = false;
                        if(code === 0) {
                            this.$message({
                                type: 'success',
                                message: message
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: message
                            });
                        }
                    } catch(e) {
                        this.headerLoading = false;
                    }
                }
            });
        }
    }

}
</script>

<style lang="less" scoped>
    .mt30{margin-top: 30px;}
</style>


