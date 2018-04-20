<template>
    <div class="el-container cool-goods-list">
        <el-card class="cool-goods" v-loading="loading">
            <div slot="header" class="card-header">
                <el-form @submit.prevent="onSearch" inline :model="formData">
                    <el-form-item label="渠道：">
                        <el-select v-model="formData.pipeline_code">
                            <el-option value="" label="全部"></el-option>
                            <el-option v-for="item in pipelines" :value="item.pipeline_code" :label="item.pipeline_name" :key="item.pipeline_code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="终端：">
                        <el-select clearable v-model="formData.platform" placeholder="请选择">
                            <el-option v-for="(item, index) in platformOpt" :key="index" :value="item.toUpperCase()" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品sku：">
                        <el-input type="text" placeholder="输入sku" v-model="formData.good_sn"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button native-type="submit" @click.prevent="onSearch" type="primary" icon="search">筛选</el-button>
                        <el-button @click.prevent="onResetSearch" type="danger">清空</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="list-content">
                <el-table border
                          :data="list"
                          @selection-change="onSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column prop="pipeline_code_name" label="渠道"></el-table-column>
                    <el-table-column label="终端" prop="platform"></el-table-column>
                    <el-table-column prop="goods_title" label="商品名称"></el-table-column>
                    <el-table-column prop="good_sn" label="sku"></el-table-column>
                    <el-table-column prop="vir_name" label="所在仓库"></el-table-column>
                </el-table>
            </div>
            <div class="contrl-bar">
                <div class="tools-btn">
                    <el-button @click.prevent="onRemove" type="danger" icon="delete" v-if="self.showAction_('promotion/explore-goods/patch-delete')">批量删除</el-button>
                    <el-button @click.prevent="onShowAddDlg" type="primary" icon="plus" v-if="self.showAction_('promotion/explore-goods/patch-add')">批量新增</el-button>
                </div>
                <el-pagination
                    class="list-pager"
                    @size-change="onSizeChange($event)"
                    @current-change="onCurrentChange($event)"
                    :current-page="pager.page"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pager.page_size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pager.totalCount"
                >
                </el-pagination>
            </div>
        </el-card>

        <!--添加弹窗-->
        <el-dialog class="add-dlg" title="新增Cool商品" v-model="addDlg.isDlgShow" size="tiny">
            <el-form :model="addDlg.form" ref="addForm" :rules="addFormRule">
                <el-form-item label="渠道：" prop="pipeLineCode">
                    <el-select clearable v-model="addDlg.form.pipeLineCode">
                        <el-option value="" label="全部"></el-option>
                        <el-option v-for="item in pipelines" :value="item.pipeline_code" :label="item.pipeline_name" :key="item.pipeline_code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="终端：" prop="platform">
                    <el-select multiple v-model="addDlg.form.platform" placeholder="请选择">
                        <el-option v-for="(item, index) in platformOpt" :key="index" :value="item.toUpperCase()" :label="item"></el-option>
                    </el-select>
                </el-form-item>

                <!--<el-form-item prop="goodList"
                              label="新增Cool商品：（输入sku_仓ID，英文逗号隔开)"
                              :rules="[
                                  { required: true, trigger: 'blur' ,message: '该项不能为空'},
                                  { validator: function(rule, value, callback) {
                                        if(value.split(',').every(function(item) {
                                            return /^[0-9_a-zA-Z]+$/.test(item)
                                        })){
                                            callback()
                                        }else{
                                            callback(new Error('请输入合法的sku'))
                                        }
                                  }, trigger: 'blur' }
                              ]" >
                    <el-input type="textarea" class="goods-textarea" v-model.trim="addDlg.form.goodList" placeholder="输入sku_仓ID，英文逗号隔开"></el-input>
                </el-form-item>-->

                <el-form-item prop="goodList"
                              label="新增Cool商品：（输入sku_仓ID，英文逗号隔开)"
                               >
                    <el-input type="textarea" class="goods-textarea" v-model.trim="addDlg.form.goodList" placeholder="输入sku_仓ID，英文逗号隔开"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="addDlg.loading" @click="onDoAdd">保存</el-button>
                <el-button type="default" @click="addDlg.isDlgShow = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import httpGet, { httpPost, getPipelines } from '@/common/baseApi'

    export default {
        data() {
            let required  = [{
                required: true,
                message: '该项不能为空'
            }];
            let checkWid = (rule, val, callback) => {
                if (!val) {
                    return callback(new Error('该项不能为空'));
                }
                let exp = /^[a-zA-Z0-9]+\_[a-zA-Z0-9]+$/;
                let arr = val.split(',');
                let flag = true;
                for (let i in arr) {
                    if (!exp.test(arr[i])) {
                        flag = false;
                        break;
                    }
                }
                if (!flag) {
                    return callback(new Error('该项格式应为SKU_仓ID,多个以逗号隔开'));
                }
                callback();
            };
            return {
                self: this,
                Error,
                loading: false,
                multipleSelection: [],
                pipelines: [],
                platformOpt: [],
                formData: {
                    pipeline_code: '',
                    platform: '',
                    good_sn: ''
                },
                addDlg: {
                    isDlgShow: false,
                    loading: false,
                    form: {
                        goodList: '',
                        pipeLineCode: '',
                        platform: [],
                    }
                },
                addFormRule: {
                    pipeLineCode: required,
                    platform: required,
                    goodList: checkWid,
                },
                list: [],
                pager: {
                    page_size: 10,
                    page: 1,
                    totalCount: 0
                }
            }
        },
        created() {
            this.initData()
            this.getPlatforms()
        },
        methods: {
            async _getList() {
                const params = {
                    ...this.formData,
                    ...this.pager
                }

                delete params.totalCount

                this.loading = true
                const data = await httpGet('promotion/explore-goods/list', {
                    params
                })

                this.list =  data.list
                this.pager.totalCount = data.totalCount
                this.loading = false
            },
            getPlatforms() {
                this.$http.get('admin/public/platforms').then(res => {
                    if (res.body.code === 0) {
                        this.platformOpt = res.body.data;
                    }
                });
            },
            onSearch() {
                this.pager.page = 1
                this._getList()
            },
            onResetSearch() {
                this.formData.pipeline_code = ''
                this.formData.good_sn = ''
                this.formData.platform = ''
                this.onSearch()
            },
            onSelectionChange(value) {
                this.multipleSelection = value
                console.log({
                    ...this.multipleSelection
                })
            },
            onSizeChange(pageSize) {
                this.pager.page = 1
                this.pager.page_size = pageSize
                this._getList()
            },
            onCurrentChange(page) {
                this.pager.page = page
                this._getList()
            },
            async initData() {
                this._getList()

                // 获取子站点渠道
                const pipelines = await getPipelines()
                this.pipelines = pipelines
            },
            onDoAdd() {
                this.$refs.addForm.validate(async valid => {
                    if (valid){
                        this.addDlg.loading = true

                        try {
                            const resData = await httpPost('promotion/explore-goods/patch-add', {
                                goodList: this.addDlg.form.goodList,
                                pipeLineCode: this.addDlg.form.pipeLineCode,
                                platform: this.addDlg.form.platform.toString()
                            })

                            this.$message.success(resData.message)
                            this.addDlg.isDlgShow = false

                            // 刷新数据到第一页
                            this.onSearch()
                        } catch (e) {

                        } finally {
                            this.addDlg.loading = false
                        }

                    }
                })
            },
            async onRemove() {
                if (this.multipleSelection.length > 0) {
                    this.loading = true

                    try {
                        const resData = await httpPost('promotion/explore-goods/patch-delete', {
                            ids: this.multipleSelection.map(item => {
                                return item.id
                            })
                        })
                        this.$message.success(resData.message)
                        this._getList()
                    } catch (e) {
                        //
                    } finally {
                        this.loading = false
                    }

                } else {
                    this.$message.error('请先选择你要删除的行')
                }
            },
            onShowAddDlg() {
                this.addDlg.isDlgShow = true

                this.$nextTick(() => {
                    this.$refs.addForm.resetFields()
                })
            }
        }

    }
</script>

<style lang="less" scoped>
    .cool-goods-list{
        .contrl-bar{
            margin-top: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>

<style lang="less">
    .cool-goods-list{
        .goods-textarea{
            textarea{
                height: 120px;
            }
        }
    }
</style>
