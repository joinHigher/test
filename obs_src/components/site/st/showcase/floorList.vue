<style>

</style>
<template>
    <div>
        <div class="el-container">
            <el-table :border="true" :data="tableData" allow-no-selection>
                <el-table-column prop="name" label="楼层名"></el-table-column>
                <el-table-column prop="attribute" label="楼层属性"></el-table-column>
                <el-table-column label="显示SKU" prop="goods_sku">
                </el-table-column>
                <el-table-column label="更新时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <router-link v-if="self.showAction_('admin/floor/info')" :to="'/showcase/floorReplace?id='+ scope.row.id+'&num='+num" class="el-button el-button--small el-button--primary">编辑</router-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableData: [],
            searchForm: {},
            editDialog: false,
            option: {
                platform: '1',
                language: 'en'
            },
            goodsPer: false,
            platformOpt: [],
            langOpt: [],
            num: 0
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getplatform();
            this.getLang();
            this.getData();
        },
        getplatform () {
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
        getData () {
            this.$http.get('admin/floor/list', {params: this.option}).then(res => {
                this.tableData = res.body.data;
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
            self.option.platform = val.label;
            self.option.language = [];

            self.getLang(self.option);
            self.getData();
        },
        changeLang (val) {
            var self = this;

            self.option.language = val;
            self.getData();
        },

    }
}
</script>


