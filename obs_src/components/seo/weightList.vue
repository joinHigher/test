<style>

</style>
<template>
    <div>
        <div class="el-container">
            <el-form label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="链接地址">
                            <el-input v-model="link"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :offset="1">
                        <el-button type="primary">提交</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            form: {},
            id: this.$route.query.id
        };
    },
    created () {

    },
    methods: {
        getData () {
            var self = this;
            
            self.$http.get('version/view', {params: {id: this.$route.query.id}}).then(res => {
                self.form = res.body.data;
            })
        },
        goback () {
            history.back();
        }
    }

}
</script>


