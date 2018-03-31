<style>

</style>
<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/showcase/bannerList' }">橱窗位管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑楼层</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-row>
                <el-col :span="12">
                    <el-form label-width="100px">
                        <el-form-item  label="楼层位置">
                            <el-input v-model="replaceForm.attribute" readonly></el-input>
                        </el-form-item>
                        <el-form-item  label="楼层名称">
                            <el-input v-model="replaceForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品SKU">
                            <el-input v-model="replaceForm.goods_sku"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button v-if="self.showAction_('admin/floor/edit')" type="primary" @click="postSave(replaceForm)">保存</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
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
            replaceForm: [],
            resArr: [{
                position: '',
                goods_sn: '',
                date: ''
            },{
                position: '',
                goods_sn: '',
                date: ''
            },{
                position: '',
                goods_sn: '',
                date: ''
            },{
                position: '',
                goods_sn: '',
                date: ''
            },{
                position: '',
                goods_sn: '',
                date: ''
            },{
                position: '',
                goods_sn: '',
                date: ''
            },{
                position: '',
                goods_sn: '',
                date: ''
            },{
                position: '',
                goods_sn: '',
                date: ''
            }],
            option: {},
            num: this.$route.query.num * 1
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.$http.get('admin/floor/info', {params: {id: this.$route.query.id}}).then(res => {
                if (res.body.code === 0) {
                    this.replaceForm = res.body.data;
                }
            });
        },
        postSave (item) {
            this.$http.post('admin/floor/edit', this.replaceForm).then(res => {
                if (res.body.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    })
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        goback () {
            history.back();
        },
        fomart (date) {
            if (typeof date == 'undefined' || date == null) {
                return '';
            }
            var str = '',
                year = date.getFullYear(),
                mouth = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                min = date.getMinutes(),
                second = date.getSeconds(),
                flag1 = '-',
                flag2 = ':';

                if (mouth < 10) {
                    mouth = '0' + mouth;
                };
                if (day < 10) {
                    day = '0' + day;
                };
                if (hour < 10) {
                    hour = '0' + hour;
                };
                if (min < 10) {
                    min = '0' + min;
                };
                if (second < 10) {
                    second = '0' + second;
                };

                str = year + flag1 + mouth + flag1 + day + ' ' + hour + flag2 + min + flag2 + second;
            return str;
        }

    }
}
</script>


