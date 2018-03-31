<template>
    <div class="video-wrap el-container">
        <el-card class="video-card" v-loading="loading">
            <div slot="header" class="card-header">
                <el-radio-group v-model="type">
                    <el-radio-button label="WEB"></el-radio-button>
                    <!--<el-radio-button label="WAP"></el-radio-button>-->
                    <el-radio-button label="APP"></el-radio-button>
                </el-radio-group>
                <div class="right-align" v-if="type !=='WEB'">
                    <el-button type="danger" icon="delete" @click="onDelete($event)" v-if="self.showAction_('promotion/video/app-delete')">批量删除</el-button>
                    <el-button type="primary" icon="plus" @click="onAddOrEdit($event)" v-if="self.showAction_('promotion/video/pc-add')">新增</el-button>
                </div>
            </div>

            <div class="web-tab" v-if="type==='WEB'">
                <el-table border
                          :data="webData.list"
                >
                    <el-table-column prop="title" label="video标题"></el-table-column>
                    <el-table-column prop="more_str" label="More的文案"></el-table-column>
                    <el-table-column prop="more_url" label="More的跳转"></el-table-column>
                    <el-table-column prop="video_id" label="视频ID"></el-table-column>
                    <el-table-column prop="banner_url" label="上传banner"></el-table-column>
                    <el-table-column prop="banner_content" label="banner内容"></el-table-column>
                    <el-table-column prop="banner_des" label="横条文案"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="primary" size="small" @click="onAddOrEdit($event, scope.row)" v-if="self.showAction_('promotion/video/pc-find-by-lang')">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="wap-tab" v-if="type==='WAP'">
                WAP
            </div>

            <div class="app-tab" v-if="type==='APP'">
                <el-table border
                          :data="appData.list"
                          @selection-change="onSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column prop="title" label="视频标题"></el-table-column>
                    <el-table-column prop="video_url" label="视频链接"></el-table-column>
                    <el-table-column prop="good_sn" label="关联商品SKU"></el-table-column>
                    <el-table-column prop="create_time" label="创建时间"></el-table-column>
                    <el-table-column prop="update_user" label="操作人"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="primary" size="small" @click="onAddOrEdit($event, scope.row)" v-if="self.showAction_('promotion/video/pc-find-by-lang')">编辑</el-button>
                            <el-button type="danger" size="small" @click="onDelete($event, scope.row)" v-if="self.showAction_('promotion/video/app-delete')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--<el-pagination
                    class="pager"
                    @size-change="onSizeChange($event)"
                    @current-change="onCurrentChange($event)"
                    :current-page="webData.pager.pageNo"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="webData.pager.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="webData.pager.totalCount"
                >
                </el-pagination>-->
            </div>
        </el-card>
    </div>
</template>

<script>
    import httpGet, { httpPost } from '@/common/baseApi'

    export default {
        name: 'adminVideoList',
        computed: {
            type: {
                get() {
                    return this.$route.query.type || 'WEB'
                },
                set(type){
                    this.$router.replace({
                        name: 'adminVideoList',
                        query: {
                            type
                        }
                    })
                }
            }
        },
        created() {
            this.initData()
        },
        data() {
            return {
                self: this,
                loading: false,
                multipleSelection: [],
                webData: {
                    pager: {
                        pageSize: 10,
                        pageNo: 1,
                        totalCount: 0
                    },
                    list: []
                },
                appData: {
                    pager: {
                        pageSize: 10,
                        pageNo: 1,
                        totalCount: 0
                    },
                    list: []
                }
            }
        },
        methods: {
            initData() {
                this._getList();
            },
            async _getList(){
                this.loading = true
                let resData

                if (this.type === 'WEB') {
                    resData = await httpGet('promotion/video/pc-lists')
                }
                if (this.type === 'APP') {
                    resData = await httpGet('promotion/video/app-lists')
                }

                this[`${String(this.type).toLocaleLowerCase()}Data`].list = resData ? resData.data : []
                this.loading = false
            },
            onSelectionChange(value) {
                this.multipleSelection = value
                console.log({
                    ...this.multipleSelection
                })
            },
            onAddOrEdit(event, item) {
                let query
                if (item) {
                    query = {
                        type: this.type,
                        id: item.id,
                        cat_id: item.cat_id
                    }
                } else {
                    query = {
                        type: this.type
                    }
                }

                this.$router.push({
                    name: 'adminVideoEdit',
                    query
                })
            },
            async _delete(list) {
                if(list.length > 0){
                    await this.$confirm('确认删除？', '提示', {
                        type: 'warning'
                    })

                    const id = list.map(item => {
                        return item.id
                    })

                    this.loading = true

                    try {
                        await httpPost('promotion/video/app-delete', {
                            id
                        })
                        this._getList()
                    } catch(e){
                        //
                    } finally {
                        this.loading = false
                    }

                } else {
                    this.$message.error('请先选择要删除的行')
                }
            },
            onDelete(event, item) {
                if (item) {
                    this._delete([item])
                }else{
                    this._delete(this.multipleSelection)
                }
            },
            onSizeChange() {

            },
            onCurrentChange() {

            }
        }
    }
</script>
<style lang="less" scoped>
    .card-header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .pager{
        margin-top: 20px;
    }
</style>
