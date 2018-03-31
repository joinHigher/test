<!--运费渠道模板-->
<template>
    <div class="container">
        <div class="channel-template-box">
            <table width="60%">
                <tbody>
                    <tr v-for="(item, index) in pipelineTempList" :key=item.key>
                        <td width="5%" class="title">
                            渠道：
                        </td>
                        <td width="20%">
                            <span>{{item.pipelineName}}</span>
                        </td>
                        <td width="5%" class="title">
                            模板：
                        </td>
                        <td width="30%">
                            <el-input :value="item.templateName" readonly></el-input>
                        </td>
                        <td>
                            &nbsp;&nbsp;
                            <el-button type="primary" @click="editTemplate(item)" v-if="self.showAction_('logistics/template-pipeline/add')">编辑</el-button>
                        </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!--弹窗s-->
        <el-dialog title="选择运费模板" :visible.sync="templateForm.dialogFormVisible" size="tiny">
            <el-form :model="templateForm">
                <el-form-item label="渠道：">
                    <span>{{ templateForm.pipelineName }}</span>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="templateForm.templateId" placeholder="请选择运费模板" filterable>
                        <el-option v-for="item in templateForm.templateList" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                    <p class="red-text">请确认渠道使用该运费模板</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="templateForm.dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit(templateForm)">确 定</el-button>
            </div>
        </el-dialog>
        <!--弹窗e-->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                self: this,
                pipelineTempList: [],
                templateForm: {
                    dialogFormVisible: false,
                    pipelineName: '',
                    templateId: '',
                    pipelineCode: '',
                    templateList: []
                }
            };
        },

        created() {
            this.initData();
        },

        methods: {
            initData () {
                this.pipelineTempList = [];
                this.templateForm.templateList = [];
                let getPipe = this.$http.get('admin/public/pipelines'),
                    getTemplate = this.$http.get('logistics/template-pipeline/list'),
                    allPipeList = [],
                    setPipeList = [];
                Promise.all([getPipe, getTemplate]).then(([data1, data2]) => {
                    if (data1.body.code === 0 && data2.body.code === 0) {
                        allPipeList = data1.body.data;        // allPipeList：所有渠道
                        setPipeList = data2.body.data.list;   //setPipeList： 被设置的渠道
                        this.templateForm.templateList = data2.body.data.templateList;  // 模板选项

                        allPipeList.forEach(item => {
                            this.pipelineTempList.push({
                                pipelineCode: item.pipeline_code,
                                pipelineName: item.pipeline_name,
                                templateId: "",
                                templateName: "",
                            })
                        });

                        setPipeList.forEach(item1 => {
                            this.pipelineTempList.forEach(item2 => {
                                if (item1.pipelineCode === item2.pipelineCode) {
                                    item2.templateId = item1.templateId;
                                    item2.templateName = item1.templateName;
                                }
                            })
                        });
                        //console.log(this.pipelineTempList);
                    }
                })
            },

            editTemplate (item) {
                this.templateForm.pipelineName = item.pipelineName;
                this.templateForm.templateId = item.templateId;
                this.templateForm.pipelineCode = item.pipelineCode;
                this.templateForm.dialogFormVisible = true;
            },

            submit (obj) {
                let params = {
                    pipelineCode: obj.pipelineCode,
                    templateId: obj.templateId
                };
                this.$http.post('logistics/template-pipeline/add', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success('保存成功！');
                        this.initData();
                        obj.dialogFormVisible = false;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }
        },
    }
</script>

<style lang="less">
    .channel-template-box {
        margin-left: 80px;
        margin-top: 10px;
        table {
            tr {
                height: 60px;
                .title {
                    font-weight: bold;
                }
            }
        }
    }

    .red-text {
        color: red;
    }

</style>
