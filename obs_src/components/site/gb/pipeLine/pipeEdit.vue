<!-- gb 渠道列表 -->
<template>
    <div class="el-container gb-pipe-edit">
        <p class="title">当前渠道: <strong>{{option.pipeline_name}}</strong></p>
        <br>
        <p class="title">所属站点: <strong>{{site}}</strong></p>
        <br>
        <el-tabs v-model="activeName" @tab-click="handle">
            <el-tab-pane label="基础配置" name="1">
                <el-form label-width="100px" class="form" :model="option" ref="optionForm">
                    <el-form-item label="渠道域名" prop="domain">
                        <el-col :span="8">
                            <el-input v-model="option.domain"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="启用仓库">
                        <el-row v-for="(item, index) in option.warehouses" :key="index" class="item">
                            <el-col :span="8">
                                <el-form-item :prop="'warehouses.' + index + '.v_wh_code'" :rules="required">
                                    <el-select filterable v-model="item.v_wh_code">
                                        <el-option v-for="(ware, _index) in wareOpt" :key="index" :value="ware.virWhCode" :label="ware.virWhCnName"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="排序" :prop="'warehouses.' + index + '.order'" :rules="required">
                                    <el-input v-model="item.order"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <el-button type="primary" icon="plus" @click="addItem"></el-button>
                                <el-button type="danger" icon="minus" @click="removeItem(index)" v-if="option.warehouses.length > 1"></el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="启用终端" prop="platforms" :rules="required">
                        <el-checkbox-group v-model="option.platforms">
                            <el-checkbox v-for="(key, val) in platOpt" :label="val" :value="key" :key="val">{{key}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item class="text-center">
                        <el-button type="primary" @click="saveBase" v-if="self.showAction_('admin/pipeline/edit')">保存</el-button>
                        <el-button type="danger" @click="goback">返回</el-button>
                    </el-form-item>
                </el-form>
                <div class="text-right el-sub-container">
                    <el-button type="primary" @click="addLang" v-if="self.showAction_('admin/pipeline-language/add')">新增</el-button>
                </div>
                <el-table :data="tableData" border v-loading="tableLoading">
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column label="终端设备">
                        <template scope="scope">
                            {{platOpt[scope.row.platform]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="是否启用">
                        <template scope="scope">
                            <span v-if="scope.row.status == 1">启用</span>
                            <span v-else>不启用</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="开启语言">
                        <template scope="scope">
                            {{langOpt[scope.row.lang]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="展示排序" prop="order"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="primary" size="small" @click="editLang(scope.row)" v-if="self.showAction_('admin/pipeline-language/edit')">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="页面配置" name="2">
                <el-form inline label-width="100px">
                    <el-form-item label="生效终端">
                        <el-select v-model="pagePlat" @change="changePlat">
                            <el-option v-for="(item, index) in platOpt" :key="index" :value="index" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fr">
                        <el-button type="primary" @click="addSet" v-if="self.showAction_('admin/pipeline-setting/add')">新增</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="pageData" border v-loading="pageLoading">
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column label="国家">
                        <template scope="scope">
                            {{countryObj[scope.row.country_code]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="币种">
                        <template scope="scope">
                            {{currencyObj[scope.row.currency]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="语言">
                        <template scope="scope">
                            {{langOpt[scope.row.lang]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="lang" label="语言简码"></el-table-column>
                    <el-table-column label="生效终端">
                        <template scope="scope">
                            <span v-for="(item, index) in scope.row.platforms.split(',')" :key="index">{{ platOpt[item] }} {{ scope.row.platforms.split(',').length - 1 > index ? ',' : '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否默认">
                        <template scope="scope">
                            <span v-if="scope.row.is_default == 1">是</span>
                            <span v-else>否</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="primary" size="small" @click="editPage(scope.row)" v-if="self.showAction_('admin/pipeline-setting/edit')">编辑</el-button>
                            <el-button type="danger" size="small" @click="removePage(scope.row)" v-if="self.showAction_('admin/pipeline-setting/delete')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!-- 弹窗S -->
        <el-dialog v-model="editDialog.isShow" size="tiny">
            <el-form label-width="100px" :model="editForm" ref="editForm">
                <el-form-item label="启用状态" prop="status" :rules="required">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="平台" prop="platform" :rules="required">
                    <el-select v-model="editForm.platform">
                        <el-option v-for="(item, index) in platOpt" :key="index" :value="Number(index)" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用语言" prop="lang" :rules="required">
                    <el-select v-model="editForm.lang">
                        <el-option v-for="(item, index) in langOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="lang">
                    <el-input v-model="editForm.order"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postLang">确 定</el-button>
                <el-button @click="editDialog.isShow = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="pageDialog.isShow" size="tiny">
            <el-form label-width="100px" :model="pageForm" ref="pageForm">
                <el-form-item label="国家" prop="country_code" :rules="required">
                    <el-select filterable v-model="pageForm.country_code">
                        <el-option v-for="(item, index) in countryOpt" :key="item.countryCode" :value="item.countryCode" :label="item.countryName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语言" prop="lang" :rules="required">
                    <el-select filterable v-model="pageForm.lang">
                        <el-option v-for="(item, index) in langOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="货币简码" prop="currency" :rules="required">
                    <el-select filterable v-model="pageForm.currency">
                        <el-option v-for="(item, index) in currencyOpt" :key="index" :value="item.currencyCode" :label="item.currencyName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效终端" prop="platforms" :rules="[{type: 'array', required: true, message: '该项不能为空'}]">
                    <el-checkbox-group v-model="pageForm.platforms">
                        <el-checkbox v-for="(item, index) in platOpt" :key="index" :label="String(index)">{{item}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否默认" prop="is_default" :rules="required">
                    <el-radio-group v-model="pageForm.is_default">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postSet">确 定</el-button>
                <el-button @click="pageDialog.isShow = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                required: [{
                    required: true,
                    message: '该项不能为空'
                }],
                //
                editForm: {
                    status: '',
                    pipeline_code: '',
                    lang: '',
                    platform: '',
                    order: '',
                },
                editDialog: {
                    isShow: false,
                    id: '',
                },
                //
                pageDialog: {
                    isShow: false,
                    id: '',
                },
                pageForm: {
                    country_code: '',
                    pipeline_code: '',
                    lang: '',
                    currency: '',
                    platforms: [],
                    is_default: 0,
                },
                currencyOpt: [],
                currencyObj: {},
                countryOpt: [],
                countryObj: {},
                //
                activeName: '1',
                id: this.$route.query.id,
                wareOpt: [],
                option: {
                    warehouses: [{
                        order: '',
                        v_wh_code: ''
                    }],
                    platforms: [],
                    domain: '',
                },
                tableLoading: false,
                pageLoading: false,
                tableData: [],
                langOpt: {},
                platOpt: {
                    '1': 'PC',
                    '2': 'Wap',
                    '3': 'IOS',
                    '4': 'Android',
                    '5': 'Pad'
                },

                pageData: [],
                pagePlat: '1',
            }
        },
        computed: {
            site() {
                return this.$store.getters.getSite;
            }
        },
        created() {
            this.getPay();
            this.getLang();
            this.getWare();
            this.getData();
        },
        methods: {
            getPay() {
                this.$http.get('pay/public/currency-country').then(res => {
                    if (res.body.code === 0) {
                        let data = res.body.data;
                        this.currencyOpt = data.currencys;
                        this.countryOpt = data.countrys;

                        let tempObj = {};
                        data.currencys.forEach(item => {
                            tempObj[item.currencyCode] = item.currencyName;
                        });
                        this.currencyObj = tempObj;

                        let temp = {};
                        data.countrys.forEach(item => {
                            temp[item.countryCode] = item.countryName;
                        });
                        this.countryObj = temp;
                    }
                })
            },
            getLang() {
                this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code === 0) {
                        let temp = {};
                        let data = res.body.data;
                        data.forEach(item => {
                            temp[item.language_en] = item.language_ch;
                        });

                        this.langOpt = temp;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            getWare() {
                this.$http.get('admin/public/sale-warehouses').then(res => {
                    if (res.body.code === 0) {
                        this.wareOpt = res.body.data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            },
            getData() {
                this.$http.get('admin/pipeline/info', {params: {id: this.id}}).then(res => {
                    if (res.body.code === 0) {
                        this.option = res.body.data;
                        this.tableData = res.body.data.languages;

                        //如果启用仓库是null，则默认加一条空数据
                        if(this.option.warehouses.length === 0){
                            this.option.warehouses.push({
                                order: '',
                                v_wh_code: ''
                            });
                        }

                        if(this.option.platforms.length > 0){
                            this.option.platforms = this.option.platforms.split(',');
                        }
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            },
            // 修改平台获取页面配置列表
            changePlat(val) {
                let params = {};
                params.platform_id = val;
                params.pipeline_code = this.option.pipeline_code;
                this.$http.get('admin/pipeline-setting/list', {params: params}).then(res => {
                    if (res.body.code === 0) {
                        this.pageData = res.body.data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            },
            handle(val) {
                if (val.name == 2) {
                    if (this.pageData.length == 0) {
                        this.changePlat('1');
                    }
                }
            },
            addSet() {
                this.pageForm = {
                    country_code: '',
                    pipeline_code: '',
                    lang: '',
                    currency: '',
                    platforms: [],
                    is_default: 0,
                };
                this.pageDialog.id = '';
                this.pageDialog.isShow = true;
            },
            editPage(row) {
                for (let i in this.pageForm) {
                    let item = this.pageForm[i];
                    if (i == 'platforms') {
                        this.pageForm[i] = row[i].split(',');
                    } else {
                        this.pageForm[i] = row[i];
                    }
                }
                this.pageDialog.id = row.id;
                this.pageDialog.isShow = true;
            },
            postSet() {
                this.$refs.pageForm.validate(valid => {
                    if (valid) {
                        let params = JSON.parse(JSON.stringify(this.pageForm));
                        let src = 'admin/pipeline-setting/add';
                        if (this.pageDialog.id) {
                            params.id = this.pageDialog.id;
                            src = 'admin/pipeline-setting/edit';
                        }

                        params.pipeline_code = this.option.pipeline_code;
                        params.platforms = params.platforms.join(',');
                        this.$http.post(src, params).then(res => {
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                                this.changePlat('1');
                                this.pageDialog.isShow = false;
                            } else {
                                this.$message.error(res.body.message);
                            }
                        }).catch(err => {

                        });
                    }
                })
            },
            removePage(row) {
                this.$confirm('确认删除?').then(() => {
                    this.$http.post('admin/pipeline-setting/delete', {id: row.id}).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.changePlat('1');
                        } else {
                            this.$message.error(res.body.message);
                        }
                    })
                }).catch(err => {
                    this.$message.info('已取消');
                });
            },
            //
            saveBase() {
                this.$refs.optionForm.validate(valid => {
                    if (valid) {
                        let params = {};
                        params.id = this.option.id;
                        params.pipeline_code = this.option.pipeline_code;
                        params.domain = this.option.domain;
                        params.platforms = this.option.platforms.toString();
                        let temp = [];

                        let countArr = [];

                        for (let i in this.option.warehouses) {
                            let item = this.option.warehouses[i];
                            if (countArr.indexOf(item.v_wh_code) != -1) {
                                this.$message.error('所选仓库不能重复');
                                return false;
                            }
                            countArr.push(item.v_wh_code);
                            temp.push({
                                pipeline_code: this.option.pipeline_code,
                                v_wh_code: item.v_wh_code,
                                order: item.order,
                            });
                        }
                        params.pipeline_warehouse = JSON.stringify(temp);

                        this.$http.post('admin/pipeline/edit', params).then(res => {
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                            } else {
                                this.$message.error(res.body.message);
                            }
                        })
                    }
                })
            },
            addLang() {
                this.editForm = {
                    status: '',
                    pipeline_code: '',
                    lang: '',
                    platform: '',
                    order: '',
                };
                this.editDialog.id = '';
                this.editDialog.isShow = true;
            },
            editLang(row) {
                for (let i in this.editForm) {
                    this.editForm[i] = row[i];
                }
                this.editDialog.id = row.id;
                this.editDialog.isShow = true;
            },
            postLang() {
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        let src = 'admin/pipeline-language/add';
                        let params = JSON.parse(JSON.stringify(this.editForm));

                        if (this.editDialog.id) {
                            src = 'admin/pipeline-language/edit';
                            params.id = this.editDialog.id;
                        }
                        params.pipeline_code = this.option.pipeline_code;

                        this.$http.post(src, params).then(res => {
                            if (res.body.code === 0) {
                                this.$message.success(res.body.message);
                                this.getData();
                                this.editDialog.isShow = false;
                            } else {
                                this.$message.error(res.body.message);
                            }
                        })
                    }
                })
            },
            addItem() {
                this.option.warehouses.push({
                    order: '',
                    v_wh_code: ''
                });
            },
            removeItem(index){
                this.option.warehouses.splice(index, 1);
            },
            goback() {
                this.$router.push({
                    name: 'site_pipeList',
                })
            },

        },
    }
</script>

<style lang="less">
    .gb-pipe-edit {
        .title {
            line-height: 20px;
            font-size: 20px;
        }

        .form {
            width: 70%;
        }

        .item {
            margin-bottom: 20px;
        }
    }
</style>
