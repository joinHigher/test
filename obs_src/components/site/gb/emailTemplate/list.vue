<template>
    <div class="template-list el-container">
        <el-card class="template-card" v-loading="loading">
            <div slot="header" class="card-header">
                <el-form @submit.prevent="onSearch" inline class="search-form">
                    <el-form-item label="请输入">
                        <el-input type="text" placeholder="输入goodSn" v-model="formData.goodSn"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.prevent="onSearch" type="primary" native-type="submit" icon="search">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click.prevent="onAddOrEdit($event)" type="primary" icon="plus">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="box-content">
                <el-table :data="list" border style="width: 100%">
                    <el-table-column prop="id" label="编号"></el-table-column>
                    <el-table-column prop="tp_number" label="邮件期号"></el-table-column>
                    <el-table-column prop="tp_name" label="邮件名称"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="primary" size="small" icon="edit" @click="onAddOrEdit(scope.row)">修改</el-button>
                            <el-button type="primary" size="small" icon="view" @click="onPreview(scope.row)">预览</el-button>
                            <el-button type="primary" size="small" icon="check" @click="onDownload(scope.row)">下载</el-button>
                            <el-button type="danger" size="small" icon="delete" @click="onDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                    class="pager"
                    @size-change="onSizeChange($event)"
                    @current-change="onCurrentChange($event)"
                    :current-page="pager.pageNo"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pager.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pager.totalCount">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog v-model="dlgTemplate.show">
            <div class="emailTemplate" ref="emailTemplate" >
                <template v-if="this.dlgTemplate.templateData && this.dlgTemplate.templateData.tp_type === 1">
                    <template1 :templateData="dlgTemplate.templateData"></template1>
                </template>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import template1 from './template/template1.vue'
    import downloadText from '@/common/downloadText'
    import htmlMin from '@/common/htmlMin'
    import getPlate from '@/config/emailTemplate.config'

    export default{
        components: {
            template1
        },
        data() {
            return {
                loading: false,
                formData: {
                    goodSn: ''
                },
                list: [],
                dlgTemplate: {
                    templateData: {},
                    show: false
                },
                pager: {
                    totalCount: 0,
                    pageNo: 1,
                    pageSize: 10
                }
            }
        },
        created() {
            this.initData()
        },
        methods: {
            async _getData() {
                this.loading = true
                const resData = await this.httpGet_('admin/mail-template/list',{
                    params: {
                        ...this.formData
                    }
                })
                this.list = resData.list ? resData.list : []
                this.pager.totalCount = resData.total
                this.loading = false
            },
            initData() {
                const params = {
                    ...this.formData,
                    ...this.pager
                }

                this._getData()

            },
            onSearch() {
                this.pageNo = 1
                this._getData()
            },
            onAddOrEdit({id}) {
                this.$router.push({
                    name: 'emailTemplateEdit',
                    query: {
                        id
                    }
                })
            },
            _mergeData(resData) {
                const {tp_type} = resData
                const plate = getPlate(tp_type || 1)
                resData.plate = resData.plate.map((item, index) => {
                    return Object.assign(plate[index], item, {
                        other: Number(item.other)
                    })
                })
            },
            _transformPlate(resData) {
                let {plate: data} = resData

                // 兼容php 接口
                if (Array.isArray(data)) {
                    return data
                } else {
                    if ('string' === typeof data) {
                        try {
                            data = JSON.parse(data)
                        }catch (e){
                            console.warn('json解析失败')
                        }
                    }

                    const tmp = []
                    for (let i in data) {
                        if (data.hasOwnProperty(i)) {
                            tmp.push({
                                ...data[i],
                                name: i
                            })
                        }
                    }
                    return tmp
                }
            },
            async onPreview(row) {
                const {id} = row

                this.loading = true

                const resData = await this.httpGet_('admin/mail-template/mail-goods', {
                    params: {
                        id
                    }
                })
                resData.plate = this._transformPlate(resData)
                // this._mergeData(resData)
                this.dlgTemplate.templateData = resData
                this.loading = false
                this.dlgTemplate.show = true

                return resData
            },

            async onDownload(row) {
                const resData = await this.onPreview(row)
                this.$nextTick(() => {
                    const html = htmlMin(`<!DOCTYPE html>
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                </head>
                                <body>
                                    ${this.$refs.emailTemplate.innerHTML}
                                </body>
                            </html>`)
                    downloadText(html, `${resData.tp_name}_${resData.id}.html`)
                })
            },
            async onDelete(row) {
                await this.$confirm('是否确认删除？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                this.loading = true
                try {
                    const resData = await this.httpPost_('admin/mail-template/delete', {
                        id: row.id
                    })
                    this.$message.success(resData.message)
                    this.loading = false

                    // 刷新数据到第一页
                    this.onSearch()
                } finally {
                    this.loading = false
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
    .emailTemplate{
        width: 650px;
        background: #FFFFFF;
        margin: 0 auto;
    }
    .card-header{
        .search-form{
            &>div {
                margin-bottom: 0;
            }
        }
    }
    .pager{
        margin-top: 20px;
    }
</style>
