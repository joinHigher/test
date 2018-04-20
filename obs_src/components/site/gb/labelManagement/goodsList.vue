<!--标签商品列表-->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label="SKU" prop="goods_sn">
                    <el-input v-model="option.goods_sn"></el-input>
                </el-form-item>
                <el-form-item label="标签名称" prop="label_name">
                    <el-input v-model="option.label_name"></el-input>
                </el-form-item>
                <el-form-item label="标签类型" prop="type">
                    <el-select clearable v-model="option.type">
                        <el-option v-for="(item, index) in typeData" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效终端" prop="platform">
                    <el-select clearable v-model="option.platform">
                        <el-option v-for="(item, index) in platformData" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效渠道" prop="pipeline_code">
                    <el-select v-model="option.pipeline_code" clearable>
                        <el-option v-for="(item, index) in pipeList" :label="item" :value="index" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div class="el-sub-container text-right">
                <el-button type="primary" @click="getData()">筛选</el-button>
                <el-button type="danger" @click="resetForm('searchForm')">重置</el-button>
                <el-button type="danger" class="pull-left" :disabled="select.length === 0" @click="batchDelete">批量删除</el-button>
            </div>

            <el-table border v-loading="isDataLoading" :data="tableData" @selection-change="changeSelect" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="序号" prop="id" width="80px"></el-table-column>
                <el-table-column label="商品标题" prop="goods_title"></el-table-column>
                <el-table-column label="主图">
                    <template scope="scope">
                        <span v-if="scope.row.goods_img === ''"></span>
                        <img v-else :src="scope.row.goods_img" width="80" height="60">
                    </template>
                </el-table-column>
                <el-table-column label="sku" prop="goods_sn"></el-table-column>
                <el-table-column label="渠道" prop="pipeline_code">
                    <template scope="scope">
                        {{ pipeList[scope.row.pipeline_code] }}
                    </template>
                </el-table-column>
                <el-table-column label="终端" prop="platform"></el-table-column>
                <el-table-column label="仓库" prop="warehouse_code"></el-table-column>
                <el-table-column label="标签" prop="label_name"></el-table-column>
                <el-table-column label="标签类型" prop="type_txt"></el-table-column>
                <el-table-column label="最后操作时间" width="180px">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="updater"></el-table-column>
                <el-table-column label="操作" column-key="handle" width="80">
                    <template scope="scope">
                        <el-button type="danger" size="small" @click="deleteLabel(scope.row)" v-if="self.showAction_('promotion/label-management/unbind-goods')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="el-container text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
            </div>
        </div>



    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                isDataLoading: false,
                tableData: [],
                option: {
                    goods_sn: '',
                    label_name: '',
                    type: '',
                    platform: '',
                    pipeline_code: '',
                    pageNo: 1,
                    pageSize: 20,
                },
                totalCount: 0,
                select: [],
                typeData: [],
                platformData: [],
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
                this.platformData = data.platformData;
            },
            async getData() {
                this.isDataLoading = true;
                try {
                    const data = await this.httpGet_('promotion/label-management/goods-lists' , {params: this.option});
                    this.tableData = data.list;
                    this.totalCount = data.totalCount;
                } finally {
                    this.isDataLoading = false;
                }
            },
            //删除
            deleteLabel(row) {
                let index = this.tableData.indexOf(row);

                this.$confirm('确定删除？', '提示信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.isDataLoading = true;
                    this.$http.post('promotion/label-management/unbind-goods', {id: row.id}).then(res => {
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
            //批量删除
            batchDelete() {
                this.$confirm('确定删除？', '批量删除提示信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    this.select.forEach(item => {
                        ids.push(item.id);
                    });
                    this.isDataLoading = true;
                    this.$http.post('promotion/label-management/batch-unbind-goods', {ids: ids}).then(res => {
                        if (res.body.code === 0) {
                            this.isDataLoading = false;
                            this.getData();
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
            changeSelect(val) {
                this.select = val;
            },
            clickRow (row, event, col) {
                if (col.columnKey !== 'handle') {
                    this.$refs['dataTable'].toggleRowSelection(row);
                }
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
        }
    }
</script>

<style scoped>

</style>
