<!--弹窗组件-->
<template>
    <div>
        <el-dialog :title="title" :visible.sync="show" width="30%" :before-close = 'diaCancel'>
            <div>
                <el-table ref="multipleTable" style="width: 100%" @selection-change = 'handleSelectionChange' :data = 'countrysOpt'>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="国家编码" prop="code"></el-table-column>
                    <el-table-column label="国家名称" prop="name"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="diaCancel">取 消</el-button>
                <el-button type="primary" @click="diaCommit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                default: 'title',
                type: String
            },
            show: {
                default: false,
                type: Boolean
            },
            countrysOpt: {
                default: [],
                type: Array
            },
        },

        data () {
            return {
                self: this,
                multipleSelection: [],
            }
        },

        created () {

        },

        methods: {
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },

            diaCommit () {
                this.$eventHub.$emit('getCountry', this.multipleSelection);
            },

            diaCancel () {
                this.$eventHub.$emit('cancel');
            },
        },
    }
</script>
