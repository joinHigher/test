<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/showcase/bannerList' }">橱窗位管理</el-breadcrumb-item>
                <el-breadcrumb-item>what's new 商品推荐管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-tabs class="full" active-name="1" type="card" @tab-click="changePlatform">
                <el-tab-pane v-for="(item, index) in platformOpt" :label="item" :name="index" :key="index"></el-tab-pane>
            </el-tabs>
            <el-row>
                <el-col :span="5">
                    <el-form inline :model="option" label-width="100px">
                        <el-form-item label="请选择语言" prop="language">
                            <el-select v-model="option.language" @change="changeLang">
                                <el-option v-for="(item, index) in langOpt" :key="index" :label="item.language_ch" :value="item.language_en" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-table :border="true" :data="tableData" allow-no-selection>
                <el-table-column label="图片">
                    <template scope="scope">
                        <a :href="scope.row.goods_url"><img class="table-img" :src="scope.row.image_url"></a>
                    </template>
                </el-table-column>
                <el-table-column prop="goods_sn" label="SKU"></el-table-column>
                <el-table-column prop="shopPrice" label="本店售价"></el-table-column>
                <el-table-column prop="create_time" label="添加时间"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="replace(scope.row, $index)">替换</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹窗S -->
        <el-dialog title="替换SKU" v-model="replacegood" size="tiny">
            <el-form label-width="100px">
                <el-form-item label="SKU">
                    <el-input v-model="editoption.goods_sn"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="replaceBtn">确 认</el-button>
                <el-button @click.native="replacegood = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            tableData: [],
            resArr: [{
                create_time: '',
                goods_sn: '',
                id: '',
                position: '',
                update_time: ''
            },{
                create_time: '',
                goods_sn: '',
                id: '',
                position: '',
                update_time: ''
            },{
                create_time: '',
                goods_sn: '',
                id: '',
                position: '',
                update_time: ''
            }],
            searchForm: {},
            addForm: {},
            replacegood: false,
            lang: 123,
            platformOpt: [],
            langOpt: [],
            option: {
                platform: '1',
                language: 'En'
            },
            editoption: {
                id: '',
                goods_sn: '',
                position: ''
            }
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getplat();
            this.getLang();
            this.getData();
        },
        getData () {
            this.$http.get('admin/whats-new-goods/list', {params: this.option}).then(res => {
                if (res.body.code === 0) {
                    var data = res.body.data;
                    var temp = this.resArr;

                    for (var i in data) {
                        temp[i - 1] = data[i];
                    }
                    this.tableData = temp;
                }

            });
        },
        getplat () {
            var self = this;

            self.$http.get('admin/public/platforms').then(res => {
                self.platformOpt = res.body.data;
            });
        },
        getLang () {
            var self = this;

            self.$http.get('admin/public/languages').then(res => {
                self.langOpt = res.body.data;
            });
        },
        removeRow (item) {
            var index = this.tableData.indexOf(item);
            if (index !== -1) {
                this.tableData.splice(index, 1)
            }
        },
        changePlatform (val) {
            var self = this;

            self.option.platform = val.name;
            self.option.language = [];

            self.getLang(self.option);
            self.getData();
        },
        changeLang (val) {
            var self = this;

            self.option.language = val;
            self.getData();
        },
        replace (row, index) {
            index++;
            this.editoption.position = index;
            this.editoption.id = row.id;
            this.replacegood = true;
        },
        replaceBtn () {
            this.$http.post('admin/whats-new-goods/save', this.editoption).then(res => {
                if (res.body.code === 0) {
                    this.tableData[this.editoption.position - 1].goods_sn = this.editoption.goods_sn;
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    });
                    this.replacegood = false;
                } else {
                    this.$message.error(res.body.message);
                }
            })
        }
    }
}
</script>

<style>
    .table-img{width: 100px;height: 100px;margin: 7px auto;}
</style>


