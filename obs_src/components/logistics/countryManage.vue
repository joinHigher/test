<!--国家管理-->
<template>
    <div>
        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="100" align="center"></el-table-column>
                <el-table-column label="国家" prop="countryName" align="center"></el-table-column>
                <el-table-column label="国家简码" prop="countryCode" align="center"></el-table-column>
                <el-table-column label="修改时间" align="center">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column label="修改人" prop="updateUser" align="center"></el-table-column>
                <el-table-column :render-header="stateRender" column-key="开启状态" width="200px" align="center">
                    <template scope="scope">
                        <label class="item-label">
                            <input type="checkbox" v-model="scope.row.useStatus" :true-value="1" :false-value="0">&nbsp;&nbsp;开启
                        </label>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="footer text-center">
            <el-button type="primary" @click="saveHandle" v-if="self.showAction_('logistics/district-config/edit')">保存</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                self: this,
                tableLoading: false,
                tableData: []
            };
        },
        created () {
            this.getData();
        },

        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            getData (){
                this.tableLoading = true;
                this.$http.get('logistics/district-config/list').then(res => {
                    if (res.body.code === 0) {
                        this.tableData = res.body.data;
                    } else {
                        this.$message.error(res.body.message);
                    }
                    this.tableLoading = false;
                });
            },

            saveHandle () {
                if (this.tableData.length===0) {
                    return false;
                }
                let arr = [];
                this.tableData.forEach(item => {
                    arr.push({countryCode: item.countryCode, userStatus: item.useStatus});
                });
                //console.log(JSON.stringify(arr));
                this.$http.post('logistics/district-config/edit', { data: JSON.stringify(arr) }).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success("保存成功!");
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            },

            checkState (obj, event) {
                if (event.target.checked) {
                    this.tableData.map(item => {
                        item.useStatus = 1;
                    });
                } else {
                    this.tableData.map(item => {
                        item.useStatus = 0;
                    });
                }
            },


            stateRender (h, obj) {
                let self = this;
                return h('el-checkbox', {
                    on: {
                        change: (event) => {
                            self.checkState(obj, event);
                        }
                    },
                }, obj.column.columnKey)
            },
        }
    }
</script>

<style lang="less">
    .footer {
        margin-top: 10px;
    }

    .item-label {
        width: auto;
        height: 100%;
        margin-right: 20px;
        display: inline-block;
        &.disabled {
            cursor: not-allowed;
        }
    }
</style>


