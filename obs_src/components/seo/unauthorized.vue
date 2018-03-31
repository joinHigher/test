<template>
    <div>
        <div class="el-container">
            <el-form label-width="200px" class="form">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="过滤未授权品牌词">
                            <el-input  type="textarea" :rows="30" v-model="tableData.unauthorized"></el-input>
                            <span class="tips">一行一个品牌词，不支持词组，不允许品牌词有两个连着的空格</span>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary" @click="edit">保存</el-button>
                            <el-button type="danger">取消</el-button>
                        </div>
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
            tableData: {
                unauthorized: ''
            }
        };
    },
    created () {
        this.getData();
    },
    methods: {
        getData () {
            this.$http.get('seo/seo-setting/list').then(res => {
                if (res.body.code === 0) {
                    this.tableData.unauthorized = res.body.data.unauthorized;
                }
            });
        },
        edit () {
            var params = this.tableData.unauthorized;

            this.$http.post('seo/seo-setting/edit', {unauthorized: params}).then(res => {
                if (res.body.code === 0) {
                    this.$message({
                      message: res.body.message,
                      type: 'success'
                    });
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        goback () {
            history.back();
        }
    }

}
</script>
<style>
    .form .el-textarea {
        position: relative;
    }
    .form span.tips {
        position: absolute;
        right: -320px;
        top: 0;
        display: block;
        width: 300px;
    }
</style>


