<!--活动标签列表-->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label="标签名称" prop="label_name">
                    <el-input v-model="option.label_name"></el-input>
                </el-form-item>
                <el-form-item label="标签类型" prop="type">
                    <el-select clearable v-model="option.type">
                        <el-option v-for="(item, index) in typeData" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效状态" prop="is_effective">
                    <el-select clearable v-model="option.is_effective">
                        <el-option v-for="(item, index) in statusData" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动时间" prop="date">
                    <el-date-picker v-model="option.date" type="datetimerange" placeholder="选择时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData()">筛选</el-button>
                    <el-button type="danger" @click="resetForm('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>

            <div class="el-sub-container text-right">
                <router-link :to="{name: 'labelManagementAdd'}" class="el-button el-button--primary" v-if="self.showAction_('promotion/label-management/add')">新增标签</router-link>
            </div>

            <el-table border v-loading="isDataLoading" :data="tableData">
                <el-table-column label="标签ID" prop="id" width="80px"></el-table-column>
                <el-table-column label="标签名称" prop="label_name"></el-table-column>
                <el-table-column label="logo">
                    <template scope="scope">
                        <img :src="scope.row.logo" width="80" height="60" v-if="scope.row.type === 1">
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    <template scope="scope">
                        {{ typeDataText[scope.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column label="筛选项标题" prop="filter_title"></el-table-column>
                <el-table-column label="开始时间" width="110px">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.start_time, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" width="110px">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.end_time, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="生效状态" prop="is_effective">
                    <template scope="scope">
                        {{ statusDataText[scope.row.is_effective] }}
                    </template>
                </el-table-column>
                <el-table-column label="排序" prop="service_order" width="80px"></el-table-column>
                <el-table-column label="最后操作时间" width="180px">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="updater"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="addGoods(scope.row)" v-if="self.showAction_('promotion/label-management/add-label-goods')">添加商品</el-button>
                        <router-link :to="{name: 'labelManagementEdit', query: {id: scope.row.id}}" class="el-button el-button--small el-button--info" v-if="self.showAction_('promotion/label-management/info')">编辑</router-link>
                        <el-button type="danger" size="small" @click="deleteLabel(scope.row)" v-if="self.showAction_('promotion/label-management/delete')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="el-container text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 30, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
            </div>
        </div>

        <!--添加/导入商品dialog begin-->
        <el-dialog title="添加商品" v-model="addGodsDialog" v-loading="goodsForm.loading">
            <el-form :model="goodsForm" ref="goodsForm" label-width="100px">
                <el-form-item label="生效终端：" prop="platform" :rules="required">
                    <el-checkbox-group v-model="goodsForm.platform">
                        <el-checkbox v-for="(item, index) in platformData" :label="item.id" :key="index">{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="生效渠道：" prop="pipeline_code" :rules="required">
                    <el-select multiple v-model="goodsForm.pipeline_code">
                        <el-option v-for="(item, index) in pipeList" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加类型：" prop="type" :rules="required">
                    <el-radio-group v-model="goodsForm.type">
                        <el-radio label="1">添加SKU</el-radio>
                        <el-radio label="2">导入文件</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item label="标签类型：" prop="">
                    <el-radio-group>
                        <el-radio v-for="(item, index) in typeData" :label="item.id" :key="index">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>-->
                <el-form-item label="添加SKU：" prop="goodsList" v-if="goodsForm.type === '1'">
                    <el-input v-model="goodsForm.goodsList" type="textarea" :rows="5" placeholder="请填入SKU_仓库id，多个SKU间换行隔开"></el-input>
                </el-form-item>
                <template v-if="goodsForm.type === '2'">
                    <el-form-item label="导入文件：" :rules="required">
                        <el-col :span="20">
                            <el-upload :action="goodsForm.importUrl" ref="upload" :on-preview="handlePreview" :on-remove="handleRemove"
                                       :file-list="goodsForm.fileList"
                                       :auto-upload="false"
                                       :accept="goodsForm.fileType"
                                       :on-success="handleBatchImportPreview"
                                       :on-error="handleBatchImportError"
                                       :beforeUpload="beforeAvatarUpload"
                                       :multiple="false"
                                       id="upload"
                                       name="file"
                                       :data="{
                                           label_id: this.goodsForm.label_id,
                                           platform: this.goodsForm.platform,
                                           pipeline_code: this.goodsForm.pipeline_code,
                                       }">
                                <el-button slot="trigger" type="success">选取文件</el-button>
                            </el-upload>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="下载模板：">
                        <a :href="this.$store.getters.getRootMenu + '/promotion/label-management/export-template'">下载模板</a>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button @click="cancelAdd">取消</el-button>
                    <el-button type="primary" @click="saveGoods">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog><!--添加/导入商品dialog end-->

        <!--添加/导入结果dialog begin-->
        <el-dialog title="添加/导入结果" v-model="addGoodsResultDialog" size="tiny">
            <el-form label-width="120px">
                <el-form-item label="添加成功数量">
                    <span>{{ resultData.successNum }}</span>
                </el-form-item>
                <el-form-item label="添加失败数量">
                    <span>{{ resultData.failNum }}</span>
                </el-form-item>
                <el-form-item label-width="22px">
                    <el-button type="primary" @click="resultDetail">查看添加/导入结果表</el-button>
                </el-form-item>
            </el-form>
        </el-dialog><!--添加/导入结果dialog end-->

        <!--结果日志dialog begin-->
        <el-dialog title="添加/导入结果详情" v-model="addGoodsResultDetailDialog" size="large">
            <el-tabs v-model="addGoodsResultDetailTag" @tab-click="toggleResultDetail">
                <el-tab-pane label="成功数据" name="success"></el-tab-pane>
                <el-tab-pane label="失败数据" name="fail"></el-tab-pane>
            </el-tabs>
            <el-table border :data="addGoodsResultDetailData">
                <el-table-column label="标签ID" prop="label_id"></el-table-column>
                <el-table-column label="渠道" prop="pipeline_code"></el-table-column>
                <el-table-column label="平台" prop="platform"></el-table-column>
                <el-table-column label="仓库" prop="warehouse_code"></el-table-column>
                <el-table-column label="SKU" prop="goods_sn"></el-table-column>
            </el-table>
        </el-dialog><!--结果日志dialog end-->
    </div>
</template>

<script>
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
                isDataLoading: false,
                required: required,
                checkWid: checkWid,
                tableData: [],
                option: {
                    label_name: '',
                    type: '',
                    is_effective: '',
                    start_time: 0,
                    end_time: 0,
                    date: [],
                    pageNo: 1,
                    pageSize: 10,
                },
                totalCount: 0,
                typeData: [],
                statusData: [],
                typeDataText: [],
                statusDataText: [],
                platformData: [],
                addGodsDialog: false,
                goodsForm: {
                    type: '1',
                    label_id: '',
                    platform: [],
                    pipeline_code: [],
                    goodsList: '',
                    importUrl: this.$store.getters.getRootMenu + '/promotion/label-management/import-label-goods',
                    fileList: [],
                    fileType: 'excel',
                    loading: false,
                },
                addGoodsResultDialog: false,
                addGoodsResultDetailDialog: false,
                addGoodsResultDetailTag: 'success',
                addGoodsResultDetailData: [],
                resultData: {},
            }
        },
        computed: {
            pipeList() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.getCommonData();
            this.getData();
        },
        methods: {
            async getCommonData() {
                const data = await this.httpGet_('promotion/label-management/common-select');
                this.typeData = data.typeData;
                this.statusData = data.statusData;
                this.platformData = data.platformData;

                let typeDataText = [],statusDataText = [];
                this.typeData.forEach(item => {
                    typeDataText[item.id] = item.name;
                });
                this.typeDataText = typeDataText;

                this.statusData.forEach(item => {
                    statusDataText[item.id] = item.name;
                });
                this.statusDataText = statusDataText;
            },
            async getData() {
                this.option.start_time = this.timeZone_(this.option.date[0], this.$store.getters.getTimeZone);
                this.option.end_time = this.timeZone_(this.option.date[1], this.$store.getters.getTimeZone);
                this.isDataLoading = true;
                try {
                    const data = await this.httpGet_('promotion/label-management/lists' , {params: this.option});
                    this.tableData = data.list;
                    this.totalCount = data.totalCount;
                } finally {
                    this.isDataLoading = false;
                }
            },
            //删除
            deleteLabel(row) {
                let index = this.tableData.indexOf(row);

                this.$confirm('操作后，该标签不在显示，操作是否继续？', '删除标签提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.isDataLoading = true;
                    this.$http.post('promotion/label-management/delete', {id: row.id}).then(res => {
                        if (res.body.code === 0) {
                            this.isDataLoading = false;
                            this.tableData.splice(index, 1);
                            this.$message({
                                message: res.body.message,
                                type: 'success'
                            });
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                })
            },
            //添加商品
            addGoods(val) {
                this.goodsForm.label_id = val.id;
                this.addGodsDialog = true;
                this.$nextTick(() => {
                    this.resetForm('goodsForm');
                });
            },
            ChangePage (val) {
                this.option.pageNo = val;
                this.getData();
            },
            ChangePageSize (val) {
                this.option.pageSize = val;
                this.getData();
            },
            resetForm(form) {
                this.$refs[form].resetFields();
            },

            //文件导入
            handleRemove(file, fileList) {
                //console.log(file, fileList);
            },
            handlePreview(file) {
                //console.log(file);
            },

            beforeAvatarUpload (file) {
                let extension1 = file.name.split('.')[1] === 'xls';
                let extension2 = file.name.split('.')[1] === 'xlsx';
                if (!extension1 && !extension2) {
                    this.$message.error("请选择xls，xlsx格式的表格文件！");
                    return false;
                }
            },

            handleBatchImportPreview (res, file) {
                console.log(console.log(res));
                this.goodsForm.loading = true;
                if (res.code === 0) {
                    this.goodsForm.loading = false;

                    this.goodsForm.fileList = [];
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });

                    this.addGodsDialog = false;
                    this.addGoodsResultDialog = true;
                    this.resultData = res.data;

                } else {
                    this.$alert(res.message,"提示",{
                        confirmButtonText : '确定',
                        type : 'error' ,
                    });
                }
            },

            handleBatchImportError (err, file) {
                this.goodsForm.fileList = [];
                this.$alert(err,"提示",{
                    confirmButtonText : '确定',
                    type : 'error' ,
                });
            },

            cancelAdd () {
                this.addGodsDialog = false;
            },

            //添加商品
            saveGoods() {
                this.$refs['goodsForm'].validate(valid => {
                    if (valid) {
                        let src = 'promotion/label-management/add-label-goods';
                        let params = {
                            label_id: this.goodsForm.label_id,
                            platform: this.goodsForm.platform,
                            pipeline_code: this.goodsForm.pipeline_code,
                            goodsList: this.goodsForm.goodsList
                        };

                        if (this.goodsForm.type === '1') {
                            console.log(params);
                            //return;

                            try {
                                this.goodsForm.loading = true;
                                this.$http.post(src, params).then(res => {
                                    if (res.body.code === 0) {
                                        this.$message({
                                            message: res.body.message,
                                            type: 'success'
                                        });
                                        this.addGodsDialog = false;
                                        this.addGoodsResultDialog = true;
                                        this.resultData = res.body.data;

                                    } else {
                                        this.$message.error(res.body.message);
                                    }
                                });
                            } finally {
                                this.goodsForm.loading = false;
                            }
                        } else {
                            this.saveImport();
                        }
                    }
                });
            },

            saveImport () {
                let sign = document.getElementById('upload').lastChild.hasChildNodes();
                if(!sign){
                    this.$message.error('请选择上传文件!');
                    return false;
                }
                let count = document.getElementsByClassName('el-upload-list__item-name').length;
                if (count > 1) {
                    this.$message.error('上传文件数量不能超过1个!');
                    return false;
                }
                this.$refs.upload.submit();
            },

            resultDetail () {
                this.addGoodsResultDialog = false;
                this.addGoodsResultDetailDialog = true;
                this.addGoodsResultDetailData = this.resultData.successData;
            },

            toggleResultDetail (val) {
                if (val.name === 'success') {
                    this.addGoodsResultDetailData = this.resultData.successData;
                } else {
                    this.addGoodsResultDetailData = this.resultData.failData;
                }
            }
        }
    }
</script>

<style scoped>

</style>
