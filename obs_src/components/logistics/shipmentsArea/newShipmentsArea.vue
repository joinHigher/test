<!--新增发货区域-->
<template>
  <div>
    <div class="el-container">
      <el-form :model="option" label-width="100px" ref="ruleForm" :rules="rules">
        <el-form-item label="运费模板" prop="templateId">
          <el-row>
            <el-col :span="4">
              <el-select v-model="option.templateId" clearable filterable>
                <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="区域" prop="shippingAreaId">
          <el-row>
            <el-col :span="4">
              <el-select v-model="option.shippingAreaId" clearable filterable>
                <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="option.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addAreaSave('ruleForm')" v-if="self.showAction_('logistics/template-area-rel/add')">保存</el-button>
          <el-button type="danger" @click="cancelSave" v-if="self.showAction_('logistics/template-area-rel/add')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import logistics from '../js/logistics'
  Vue.use(logistics);

  export default {
    data (){
      return {
        self: this,
        option: {
          templateId: '',
          shippingAreaId: '',
          status: 1,
        },
        areaList: [], //区域列表
        templateList: [], //运费模板list
        rules: {
          templateId: [{required: true, type: 'number', message: '请选择运费模板', trigger: 'change'}],
          shippingAreaId: [{required: true, type: 'number', message: '请选择区域', trigger: 'change'}],
        },
      }
    },
    created (){
      this.templateList = this.getTemplateList();
      this.areaList = this.getAreaList();
    },
    methods: {

      //新增区域 保存
      addAreaSave (formName){
          this.$refs[formName].validate((valid) => {
              if (!valid) {
                  return false;
              }
              console.log(this.option);
              this.$http.post('logistics/template-area-rel/add', this.option).then( res => {
                  if (res.body.code === 0) {
                      this.$message.success("保存成功!");
                      this.$router.push({ name: "shipmentsArea" });
                  } else if (res.body.code === 60068) {
                      this.$message.error("区域关联的运费模板已存在真实仓，不允许添加");
                  } else{
                    this.$message.error(res.body.message);
                  }
              });
          })
      },

      cancelSave (){
          this.$router.push({ name: 'shipmentsArea' });
      },
    } //methods end
  }
</script>

<style lang="less">
  .item-row{
    margin-top: 10px;
  }

</style>
