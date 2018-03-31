<template>
    <div class="template-edit el-container">
        <el-card class="template-card" v-loading="loading">
            <!--<div slot="header" class="card-header">-->
                <!--<h3>编辑/添加邮件模板</h3>-->
            <!--</div>-->
            <el-form @submit.prevent="onSubmit"
                     class="edit-form"
                     label-width="200px"
                     ref="editForm"
                     :model="formData"
            >
                <el-form-item label="选择语言类型："
                              prop="lang"
                              :rules="[{required: true, trigger: 'blur' ,message: '该项不能为空'}]"
                >
                    <el-select v-model="formData.lang" filterable placeholder="请选择">
                        <el-option v-for="lang in langs"
                                   :key="lang.language_code"
                                   :label="lang.language_name"
                                   :value="lang.language_code"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择渠道："
                              prop="pipeline_code"
                              :rules="[{required: true, trigger: 'blur' ,message: '该项不能为空'}]"
                >
                    <el-select v-model="formData.pipeline_code" filterable placeholder="请选择">
                        <el-option v-for="(label, val) in pipeLineObj"
                                   :key="val"
                                   :label="label"
                                   :value="val"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="邮件期号："
                              prop="tp_number"
                              :rules="[{required: true, trigger: 'blur' ,message: '该项不能为空'}]"
                >
                    <el-input v-model="formData.tp_number"
                              placeholder="请输入"
                    ></el-input>
                </el-form-item>

                <el-form-item label="邮件名称："
                              prop="tp_name"
                              :rules="[{required: true, trigger: 'blur' ,message: '该项不能为空'}]"
                >
                    <el-input v-model="formData.tp_name"
                              placeholder="请输入"
                    ></el-input>
                </el-form-item>

                <el-form-item label="邮件类型："
                              prop="tp_type"
                >
                    <el-select v-model="formData.tp_type" placeholder="请选择">
                        <el-option v-for="item in types"
                                   :label="item.name"
                                   :key="item.id"
                                   :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品COOKIE（明文/密文）："
                >
                    <el-input v-model="formData.cookie"
                              placeholder="请输入"
                    ></el-input>
                </el-form-item>

                <el-form-item label="模板背景颜色：">
                    <el-color-picker v-model="formData.bg_color"></el-color-picker>
                </el-form-item>

                <el-form-item label="第一张banner代码：">
                    <el-input type="textarea"
                              v-model="formData.banner"
                              placeholder="banner配置 <a href=''><img src='' alt='banner' /></a>"
                    ></el-input>
                </el-form-item>

                <template v-for="(plateItem, plateIndex) in formData.plate">
                    <el-card class="cardPlateItem">
                        <div slot="header" class="card-header">
                            <h4>{{plateItem.title}}{{`（支持${plateItem.goodsNum[0]} - ${plateItem.goodsNum[1]}个商品) `}}</h4>
                        </div>

                        <el-form-item label="其它选项：">
                            <el-radio-group v-model="plateItem.other">
                                <el-radio class="radio" :label="0">不显示</el-radio>
                                <el-radio class="radio" :label="1">显示双倍积分</el-radio>
                                <el-radio class="radio" :label="2">显示coupon</el-radio>
                                <el-radio class="radio" :label="3">显示email only</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="自定义颜色：">
                            <div class="cardPlateItem-color">
                                <div class="plateColor-item">
                                    <span class="label">标题颜色：</span>
                                    <el-color-picker v-model="plateItem.color.title" ></el-color-picker>
                                </div>
                                <div class="plateColor-item">
                                    <span class="label">价格颜色：</span>
                                    <el-color-picker v-model="plateItem.color.price" ></el-color-picker>
                                </div>
                                <div class="plateColor-item">
                                    <span class="label">商品背景颜色：</span>
                                    <el-color-picker v-model="plateItem.color.background" ></el-color-picker>
                                </div>
                            </div>
                        </el-form-item>
                        <div class="plateGoods" v-if="plateItem.goods.length > 0">
                            <el-card class="plateGoods-item" :key="index" v-for="(plateGoods, index) in plateItem.goods">

                                <div class="plateGoods-deleteBtn">
                                    <el-button type="primary"
                                               icon="plus"
                                               :disabled="plateItem.goods.length >= plateItem.goodsNum[1]"
                                               @click="onAddGoods(plateItem.goods, index)"
                                    >添加</el-button>
                                    <el-button type="danger"
                                               round
                                               :disabled="plateItem.goods.length <= plateItem.goodsNum[0]"
                                               icon="close"
                                               @click="onRemoveGoodsItem(plateItem.goods, plateGoods)"
                                               title="删除"
                                    >删除</el-button>
                                </div>

                                <el-form-item label="商品编码："
                                              :prop="'plate.' + plateIndex + '.goods.' + index + '.goodsSn'"
                                              :rules="{
                                                  required: true, message: '商品编码不能为空', trigger: 'blur'
                                              }"
                                >
                                    <el-input v-model="plateGoods.goodsSn"
                                              placeholder="商品编码"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="仓库："
                                              :prop="'plate.' + plateIndex + '.goods.' + index + '.wareCode'"
                                              :rules="{
                                                  validator: function(rule, value, callback) {
                                                      if(value === ''){
                                                          callback(Error('请选择仓库'))
                                                      }else{
                                                          callback()
                                                      }
                                                  }, trigger: 'change'
                                              }"
                                >
                                    <el-radio-group v-model="plateGoods.wareCode">
                                        <el-radio v-for="ware in wares" class="radio" :label="ware.virWhCode" :key="ware.virWhCode">{{ware.virWhCnName}}</el-radio>
                                    </el-radio-group>

                                </el-form-item>
                                <el-form-item label="自定义图片："
                                              :prop="'plate.' + plateIndex + '.goods.' + index + '.image'"
                                              :rules="{
                                                  type: 'url', message: '请输入合法的图片地址', trigger: 'blur'
                                              }"
                                >
                                    <el-input v-model="plateGoods.image"
                                              placeholder="自定义图片URL"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="coupon码："
                                              :prop="'plate.' + plateIndex + '.goods.' + index + '.coupon'"
                                              :rules="{
                                                  validator: function(rule, value, callback) {
                                                      if(+plateItem.other === 2){
                                                          if(value === '') {
                                                              callback(Error('显示coupon码，必须要输入 coupon 码'))
                                                              return
                                                          }
                                                      }
                                                      callback()
                                                  }, trigger: 'blur'
                                              }"
                                >
                                    <el-input v-model="plateGoods.coupon"
                                              placeholder="coupon码"
                                    ></el-input>
                                </el-form-item>
                            </el-card>
                        </div>
                    </el-card>
                </template>

                <el-form-item label="coupon状态：">
                    <el-radio class="radio" v-model="formData.coupon_state" :label="0">不显示</el-radio>
                    <el-radio class="radio" v-model="formData.coupon_state" :label="1">显示coupon</el-radio>
                </el-form-item>
                <el-form-item label="顶部coupon码：">
                    <el-input v-model="formData.top_coupon"
                              placeholder="请输入"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.prevent="onSubmit" type="primary" native-type="submit" icon="upload">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import getPlate, {getTypes, getEmptyGoodsItem} from '@/config/emailTemplate.config'
    import {getLangs} from '@/common/baseApi'

    import utils from '@/common/utils'
    export default {
        data() {
            return {
                loading: false,
                Error,
                wares: [],
                types: [],
                langs: [],
                formData: this._getEmptyFormData()
            }
        },
        computed: {
            id() {
                return this.formData.id || this.$route.query.id
            },
            pipeLineObj() {
                return this.$store.getters.getPipe.obj;
            }
        },
        created() {
            this.initData()
        },
        methods: {
            async initData() {
                this.loading = true
                this.types = getTypes()
                const [langs, {list}] = await Promise.all([getLangs(), this.httpGet_('stock/warehouse/vir-wh-drop-down')])

                this.langs = langs
                this.wares = list
                this.loading = false

                this._getData()
            },
            _transformPlate(data) {
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
            async _mergeItemData(id) {
                this.loading = true
                const resData = await this.httpGet_('admin/mail-template/info', {
                    params: {
                        id
                    }
                })

                resData.plate = this._transformPlate(resData.plate)
                const plate = getPlate(this.formData.tpId)

                Object.assign(this.formData, resData)
                this.formData.plate = resData.plate.map((item, index) => {
                    item.goods && item.goods.forEach(goods => {
                        delete goods.plate_name
                    })
                    return Object.assign(plate[index], item, {
                        other: Number(item.other)
                    })
                })

                this.loading = false
            },
            _getData() {
                if (this.id) {
                    // 编辑
                    this._mergeItemData(this.id)
                } else {
                    const plate = getPlate(this.formData.tpId)
                    this.formData.plate = plate
                    console.log(this.formData)
                }
            },
            _getEmptyFormData() {
                return {
                    id: '',
                    lang: 'en',       // lang
                    cookie: '',      // cookie
                    tp_number: '',  // 期号
                    tp_name: '',    // name
                    tp_type: 1,     // type
                    bg_color: '#FFFFFF',
                    banner: '',
                    plate: [],      // 通过 type 动态获取
                    coupon_state: 0,
                    top_coupon: '',
                    pipeline_code: '',
                }
            },
            onAddGoods(list, index) {
                list.splice(index + 1, 0, getEmptyGoodsItem())
            },
            onRemoveGoodsItem(target, item) {
                utils.array.remove(target, item)
            },
            async onSubmit() {
                this.$refs.editForm.validate(async valid => {
                    if (valid) {
                        await this.$confirm('是否确认保存？？', '提示', {
                            type: 'warning'
                        })

                        const data = JSON.parse(JSON.stringify(this.formData))
                        data.plate.forEach(item => {
                            delete item.goodsNum
                            delete item.title
                        })

                        const id = data.id
                        this.loading = true

                        try {
                            const resData = await this.httpPost_((undefined === id || '' === id) ? 'admin/mail-template/add' : 'admin/mail-template/edit', data)
                            this.$message.success(resData.data)

                            if (undefined === id || '' === id) {
                                // add
                            } else {
                                this._getData()
                            }
                        } finally {
                            this.loading = false
                        }
                    } else {
                        this.$message.error('表单验证失败，请检查 ')
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .edit-form{
        width: 100%;
    }
    .cardPlateItem{
        margin: 30px 0;
        background: #EFF2F7;
    }
    .plateGoods-item{
        position: relative;
        margin-top: 10px;
        background: #EFF2F7;
        .plateGoods-deleteBtn{
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1;
        }
        .plateGoods-num{
            font-size: 18px;
        }
    }
    .cardPlateItem-color{
        display: flex;
        flex-direction: row;
        .plateColor-item{
            display: flex;
            align-items: center;
            margin-right: 20px;
        }
    }
</style>

<style lang="less">
    .template-edit {
        .el-input, .el-select{
            width: 400px;
        }
        .el-textarea{
            width: 800px;
        }
    }

</style>


