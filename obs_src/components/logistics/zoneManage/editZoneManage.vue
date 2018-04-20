<!--编辑区域管理-->
<template>
    <div>
        <div class="el-container">
            <el-form :model="option" label-width="100px" ref="areaCodeForm">
                <el-form-item label="区域">
                    <el-row>
                        <el-col :span="4">
                            <el-input v-model="option.name"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="真实仓">
                    <el-row>
                        <el-col :span="4">
                            <el-select v-model="option.realWareCode" clearable filterable>
                                <el-option v-for="item in realWareList" :key="item.code" :label="item.name"
                                           :value="item.code"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2" class="text-right">
                            <el-button type="primary" icon="plus" @click="addVirWhCodes">添加</el-button>
                        </el-col>
                    </el-row>
                    <el-row v-for="(item, index) in option.realWhCodesList" :key="index" class="item-row">
                        <el-col :span="4">
                            <el-input :value="item.name" readonly></el-input>
                        </el-col>
                        <el-col :span="2" class="text-right">
                            <el-button type="primary" icon="delete" @click="delItem(index)">删除</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-radio-group v-model="option.status">
                        <el-radio :label="1">开启</el-radio>
                        <el-radio :label="0">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="editAreaSave">保存</el-button>
                    <el-button type="danger" @click="cancelSave">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import logistics from '../js/logistics'
    Vue.use(logistics);

    export default {
        data (){
            return {
                option: {
                    name: '',
                    realWhCodesList: [],
                    status: 1,
                    realWareCode: '',
                },
                realWareList: [],
                areaList: '',
            }
        },
        mounted (){
            this.init();
        },
        methods: {
            init (){
                this.realWareList = this.getRealWareFun();
                this.areaList = JSON.parse(this.$route.query.row);
                this.option.name = this.areaList.name;
                this.option.status = this.areaList.status;
                this.areaList.warehouseList.forEach(item => {
                    this.option.realWhCodesList.push({code: item.realWhCode, name: item.realWhName});
                });
            },

            addVirWhCodes (){
                if (!this.option.realWareCode) {
                    this.$message.error("请先选择真实仓");
                    return false;
                }

                let tempObj = {};
                for (let i = 0; i < this.realWareList.length; i++) {
                    if (this.option.realWareCode === this.realWareList[i].code) {
                        tempObj.code = this.realWareList[i].code;
                        tempObj.name = this.realWareList[i].name;
                    }
                }

                if (this.option.realWhCodesList.length === 0) {
                    this.option.realWhCodesList.push(tempObj);
                } else {
                    let isExistSome = false;
                    this.option.realWhCodesList.forEach(item => {
                        if (item.code === tempObj.code) {
                            isExistSome = true;
                        }
                    });
                    if (isExistSome) {
                        this.$message.error("该真实仓已存在");
                        return false;
                    } else {
                        this.option.realWhCodesList.push(tempObj);
                    }
                }
            },

            delItem (index){
                this.option.realWhCodesList.splice(index, 1);
            },

            //新增区域 保存
            editAreaSave (){
                if (!this.option.name.trim()) {
                    this.$message.error("请填写区域 !");
                    return false;
                }
                if (this.option.realWhCodesList.length === 0) {
                    this.$message.error("请添加真实仓 !");
                    return false;
                }
                let params = {
                    id: this.areaList.id,
                    name: this.option.name.trim(),
                    status: this.option.status,
                    realWhCodes: []
                };
                this.option.realWhCodesList.forEach(item => {
                    params.realWhCodes.push(item.code);
                });
                this.$http.post('logistics/shipping-area/edit', params).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success("编辑成功!");
                        this.$router.push({name: 'zoneManage'});
                    } else if (res.body.code === 60068) {
                        this.$message.error("区域关联的运费模板已存在真实仓，不允许添加");
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            },
            cancelSave (){
                this.$router.push({ name: "zoneManage"});
            }
        } //methods end
    }
</script>

<style lang="less">
    .item-row {
        margin-top: 10px;
    }
</style>
