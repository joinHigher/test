<style>

</style>
<template>
    <div>
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
                            <el-button v-if="self.showAction_('admin/floor/edit')" type="primary" @click="postSave(replaceForm)" v-loading="postLoading" :disabled="postLoading">保存</el-button>
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
            postLoading: false,
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
            this.postLoading = true;
            this.$http.post('admin/floor/edit', this.replaceForm).then(res => {
                this.postLoading = false;
                if (res.body.code == 0) {
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    });
                    this.goback();
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.postLoading = false;
            });
        },
        goback () {
            this.$router.push({
                name: 'showcase_floorList'
            })
        },
    }
}
</script>


