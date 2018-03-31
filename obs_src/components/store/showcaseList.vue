<!-- 橱窗列表 -->
<template>
    <div class="seller-list el-container">
        <p class="el-sub-container">店铺：<strong>{{name}}</strong></p>
        <el-form inline label-width="100px" :model="option">
            <el-form-item label="启用状态">
                <el-select clearable v-model="option.isUse">
                    <el-option label="启用" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="option.keyWord" placeholder="请输入ID或橱窗名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">搜索</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button type="primary" @click="addDialog = true" :disabled="this.total >= 10">创建店铺橱窗</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border v-loading="tableLoading">
            <el-table-column prop="id" label="橱窗ID"></el-table-column>
            <el-table-column prop="name" label="橱窗名称"></el-table-column>
            <el-table-column label="启用状态">
                <template scope="scope">
                    <i :class="{'el-icon-circle-check color-success': scope.row.isUse == '1', 'el-icon-circle-cross color-danger': scope.row.isUse == '0'}" @click="changeStatus(scope.row)"></i>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="橱窗排序"></el-table-column>
            <!-- <el-table-column prop="goodsNum" label="橱窗商品数"></el-table-column> -->
            <el-table-column prop="createTime" label="创建时间" width="170">
                <template scope="scope">
                    {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="最后编辑时间" width="170">
                <template scope="scope">
                    {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="updateUser" label="操作人"></el-table-column>
            <el-table-column label="操作" width="220">
                <template scope="scope">
                    <el-button type="info" size="small" @click="goodsInfo(scope.row)">橱窗商品</el-button>
                    <el-button type="primary" size="small" @click="edit(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-sub-container text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="创建店铺橱窗" v-model="addDialog" size="tiny">
            <el-form label-width="100px" :model="addForm" ref="addForm">
                <el-form-item label="启用状态" prop="isUse" :rules="required">
                    <el-radio-group v-model="addForm.isUse">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="橱窗名称" prop="name" :rules="[{required: true, max: 30, message: '该项不能为空，最大30字符'}]">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="橱窗排序" :rules="[{validator: checkOrder}]" prop="sort">
                    <el-input v-model="addForm.sort"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="add" :disabled="addLoading" v-loading="addLoading">确 定</el-button>
                <el-button @click="addDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <!--  -->
        <el-dialog title="编辑店铺橱窗" v-model="editDialog" size="tiny">
            <el-form label-width="100px" :model="editForm" ref="editForm">
                <el-form-item label="橱窗ID">
                    {{this.id}}
                </el-form-item>
                <el-form-item label="启用状态" prop="isUse" :rules="required">
                    <el-radio-group v-model="editForm.isUse">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="橱窗名称" prop="name" :rules="[{required: true, max: 30, message: '该项不能为空，最大30字符'}]">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="橱窗排序" :rules="[{validator: checkOrder}]" prop="sort">
                    <el-input v-model="editForm.sort"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postEdit" :disabled="editLoading" v-loading="editLoading">确 定</el-button>
                <el-button @click="editDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>
    export default {
        data() {
            let required = [{required: true, message: '该项不能为空'}];

            let checkOrder = (rule, val, callback) => {
                if (val * 1 == val && val >= 0 && val <= 255 && Number.isInteger(val * 1)) {
                    callback();
                } else {
                    callback(new Error('排序为0-255的整数'));
                }
            }
            return {
                name: unescape(this.$route.query.name),
                checkOrder: checkOrder,
                required: required,
                self: this,
                option: {
                    pageNo: 1,
                    pageSize: 20,
                    isUse: '',
                    keyWord: '',
                    shopCode: this.$route.query.shopCode,
                },
                id: '',
                total: 1,
                tableData: [],
                tableLoading: false,
                addDialog: false,
                addLoading: false,
                addForm: {
                    isUse: '',
                    name: '',
                    sort: '',
                },
                editDialog: false,
                editLoading: false,
                editForm: {
                    isUse: '',
                    name: '',
                    sort: '',
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
                    const data = await this.httpGet_('store/cabinet/list', {params: this.option});
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
            goodsInfo (row) {
                this.$router.push({
                    name: 'store_showcaseGoods',
                    query: {
                        shopCode: this.option.shopCode,
                        id: row.id,
                        name: escape(row.name),
                    }
                })
            },
            changeStatus (row) {
                let text = '开启店铺橱窗显示开关后，店铺页面展示该橱窗效果，是否继续操作?';
                let title = '开启显示';

                if (row.isUse == 1) {
                    text = '关闭店铺橱窗显示开关后，店铺页面不展示该橱窗效果，是否继续操作?';
                    title = '关闭显示';
                }

                let params = {
                    id: row.id,
                    shopCode: this.option.shopCode,
                    name: row.name,
                    isUse: row.isUse == 1 ? 0 : 1,
                }
                this.$confirm(text, title).then(async () => {
                    const data = await this.httpPost_('store/cabinet/edit', params);
                    this.$message.success(data.message);
                    this.getData();
                })
            },
            add () {
                this.$refs.addForm.validate(async valid => {
                    if (valid) {
                        let params = {
                            sort : this.addForm.sort,
                            isUse: this.addForm.isUse,
                            name: this.addForm.name,
                            shopCode: this.option.shopCode,
                        };
                        this.addLoading = true;
                        try {
                            const data = await this.httpPost_('store/cabinet/add', params);
                            this.$message.success(data.message);
                            this.addDialog = false;
                            this.getData();
                        } finally {
                            this.addLoading = false;
                        }
                    }
                })
            },
            edit (row) {
                this.id = row.id;
                for (let i in this.editForm) {
                    this.editForm[i] = row[i];
                }
                this.editDialog =  true;
            },
            postEdit () {
                this.$refs.editForm.validate(async valid => {
                    if (valid) {
                        let params = {
                            sort : this.editForm.sort,
                            isUse: this.editForm.isUse,
                            name: this.editForm.name,
                            shopCode: this.option.shopCode,
                            id: this.id,
                        };
                        this.editLoading = true;
                        try {
                            const data = await this.httpPost_('store/cabinet/edit', params);
                            this.$message.success(data.message);
                            this.editDialog = false;
                            this.getData();
                        } finally {
                            this.editLoading = false;
                        }
                    }
                })

            },
            remove (row) {
                this.$confirm('是否继续进行店铺橱窗删除操作？', '删除店铺橱窗').then(async () => {
                    const data = await this.httpPost_('store/cabinet/delete', {id: row.id});
                    this.$message.success(data.message);
                    this.getData();
                })
            },
        }
    }
</script>

<style>

</style>
