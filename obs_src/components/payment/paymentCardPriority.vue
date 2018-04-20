<template>
    <div>
        <div class="el-container">
            <el-form inline :model="filterForm" ref="searchForm">
                <el-form-item label="channelCode：" prop="channelCode">
                    <el-input v-model="filterForm.channelCode" placeholder="请输入支付方式名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData"><i class="el-icon-search"></i> 查询</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">清空</el-button>
                    <el-button type="primary"  @click="handlePriority">排序</el-button>
                </el-form-item>
            </el-form>  


            <el-table :data="tableData" border ref="table"  v-loading="dataLoading">
                <el-table-column prop="orderByCode" label="排序"></el-table-column>
                <el-table-column label="channel_name" prop="channelCode"></el-table-column>
            </el-table>

        </div>
        <!-- 移动风控规则  start-->
        <el-dialog title="移动信用卡支付渠道"  :visible.sync="isPriority" size="tiny" class="priority-dialog">
            <draggable v-model="tempTableData" element="ul" :options="{group: 'priority'}" :move="checkMove" @end="endDrag">
                <transition-group name="priority">
                    <li v-for="(item, index) in tempTableData" :key="index" class="priority-item" >
                        {{ item.channelCode }}
                    </li>
                </transition-group>
            </draggable>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isPriority = false">取 消</el-button>
                <el-button type="primary" @click="savePriority">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 移动风控规则  end-->

    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        data() {
            return {
                dataLoading: false,
                filterForm: {
                    channelCode: ''
                },
                tableData: [],
                tempTableData: [],
                payChannels: {},
                dragIndex: null,
                futureIndex: null,
                currentOrders: [],
                isPriority: false
            }
        },

        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.getListData();
            },
            // 获取列表数据
            getListData() {
                let params = {};
                params = Object.assign({}, this.filterForm);
                this.dataLoading = true;
                this.$http.get('pay/sort/credit-list', { params: params }).then(res => {
                    this.dataLoading = false;
                    if (res.body.code !== 0) {
                        return;
                    }
                    let data = res.body.data.queryPayChannelPlatformSortListList;
                    this.tableData = data;
                },
                (err) => {
                    this.$notify.error(err.body.message || '发生错误');
                });
            },
            // 处理优先支付方式
            handlePriority() {
                this.tempTableData = JSON.parse(JSON.stringify(this.tableData));
                let currentOrders = [];
                this.tempTableData.forEach((item) => {
                    currentOrders.push(item.orderByCode);
                });
                this.currentOrders = currentOrders;
                this.$nextTick(() => {
                    this.isPriority = true;
                })
            },
            // 优先级检测拖拽状态
            checkMove(evt) {
                // console.log(evt);
                this.dragIndex = evt.draggedContext.index;
                this.futureIndex = evt.draggedContext.futureIndex;
            },
            // 结束拖拽
            endDrag() {
                // console.log('drag：' + this.dragIndex + 'futureIndex：' + this.futureIndex)
                if(this.dragIndex === this.futureIndex) { return; }
                this.tempTableData.forEach((item, index) => {
                    item.orderByCode = this.currentOrders[index];
                });
                this.dragIndex = null;
                this.futureIndex = null;
            },
            // 保存优先级
            savePriority() {
                this.$http.post('pay/sort/credit-update', {
                    payChannelPlatformDtos: this.tempTableData
                }).then(res => {
                    if (res.body.code == 0) {
                        this.getListData();
                        this.$message.success(res.body.message);
                        this.isPriority = false;
                    } else {
                        this.$message.error(res.body.message);
                    }
                });

            },
            // 取消筛选
            handleBtnCancelFilterClick() {
                this.$refs.searchForm.resetFields();
                this.getListData();
            }
        },
        components: {
            draggable
        }
    }
</script>
<style lang="less">
.priority-dialog {
    .priority-item {
        list-style: none;
        padding: 10px;
        border-bottom: solid 1px;
        transition: all 1s;
        cursor: pointer;
    }
    .priority-enter, .priority-leave-active {
        opacity: 0;
    }
}
</style>
