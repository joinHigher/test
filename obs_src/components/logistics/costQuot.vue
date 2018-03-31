<!--计费系数-->
<template>
  <div>
    <div class="el-container">
      <el-form :model="option" label-width="100px" ref="costForm">
        <el-form-item label="站点">
          {{this.siteName}}
        </el-form-item>
        <el-form-item label="模板">
          <el-row>
            <el-col :span="5">
              <el-select v-model="option.templateId" clearable @change="templateIdChange">
                <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="区域">
          <el-row>
            <el-col :span="5">
              <el-select v-model="option.shippingAreaId" clearable @change="shippingAreaIdChange">
                <el-option v-for="item in shippingAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="物流分组">
          <el-row>
            <el-col :span="5">
              <el-select v-model="option.groupId"  clearable @change="groupIdChange">
                <el-option v-for="item in logisticsGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="物流方式">
          <el-row>
            <el-col :span="5">
              <el-select v-model="option.id" clearable>
                <el-option v-for="item in logisticsType" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="费用系数">
          <el-row>
            <el-col :span="5">
              <el-input v-model="option.costQuot" @blur="validate"></el-input>
            </el-col>
            <el-col :span="7" class="red">&nbsp;* 请输入大于等于0.01且小于等于99.99的数字，保留两位小数</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label=" ">
          <el-row>
            <el-col :span="5">
              <el-button type="primary" @click="saveData" v-if="self.showAction_('logistics/way/update-cost-quot')">保存</el-button>
              <el-button type="danger" @click="comeBack">返回</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import logistics from './js/logistics'
Vue.use(logistics);

export default{
    data () {
        return {
            self: this,
            option:{
              templateId: '',
              shippingAreaId: '',
              groupId: '',
              id: '',
              costQuot:'',
            },
            templateList: this.getTemplateList(),
            siteName:'',
            shippingAreaList: [],
            logisticsGroup:[],
            logisticsType:[],
        };
    },
  created (){
     this.getData();

  },
  methods: {
    templateIdChange () {
        this.option.shippingAreaId = '';
        this.option.groupId = '';
        this.option.id = '';
        this.shippingAreaList = [];
        this.logisticsGroup = [];
        this.logisticsType = [];

        if (this.option.templateId) {
           this.shippingAreaList = this.getAreaByTemplate(this.option.templateId);
        }

    },

    shippingAreaIdChange () {
        this.option.groupId = '';
        this.option.id = '';
        this.logisticsGroup = [];
        this.logisticsType = [];

        if (this.option.shippingAreaId) {
            this.logisticsGroup = this.getGroupByAreaId(this.option.templateId, this.option.shippingAreaId);
        }
    },

    groupIdChange () {
        this.option.id = '';
        this.logisticsType = [];

        if (this.option.groupId) {
           this.logisticsType = this.getLogisticsCodeByGroup(this.option.groupId);
        }
    },

      //获得站点名称
      getData (){
        this.$http.get('logistics/way/cost-quot').then(res =>{
          if(res.body.code ===0){
            this.siteName = res.body.data.siteName;
          }
        });
    },

    //验证费用系数
    validate (){
      var reFloat = /^\d+\.?\d{0,2}$/ ;
      var number = Number(this.option.costQuot);
      if(this.option.costQuot===''){
        this.$message.error('费用系数不能为空');
        return false;
      }
      if (isNaN(this.option.costQuot)) {
        this.$message.error('你输入的费用系数不是数字！');
        return false;
      }
      if(number<0.01){
        this.$message.error('费用系数大于等于0.01！');
        return false;
      }
      if (!reFloat.test(number)) {
        this.$message.error('输入的费用系数只能是两位小数！');
        return false;
      }
      if (number>99.99) {
        this.$message.error('输入的费用系数小于等于99.99！');
        return false;
      }
      return true;
    },
    //保存
    saveData (){
        var sign = true;
            sign = this.validate();
        if (sign) {
          var num = this.option.costQuot;
          num = Number(num.toString().match(/^\d+(?:\.\d{0,2})?/));
          let params = {
            templateId: this.option.templateId,
            shippingAreaId: this.option.shippingAreaId,
            groupId: this.option.groupId,
            id: this.option.id,
            costQuot: num
          };
          this.$confirm('确定修改计费系数吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            this.$http.post('logistics/way/update-cost-quot', params).then(res => {
              if (res.body.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
              } else {
                this.$message.error(res.body.message);
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
    },

    //返回
    comeBack (){
      this.option.templateId = '';
      this.option.shippingAreaId = '';
      this.option.groupId = '';
      this.option.id = '';
      this.option.costQuot = '';
    }
  },
}


</script>


<style>
  .red{
    color:red;
  }
</style>
