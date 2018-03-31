<template>
  <!--新增区号-->
  <div>
    <div class="el-container">
      <el-form :model="option" label-width="100px" ref="areaCodeForm" :rules="rules">
        <el-form-item label="国家" prop="countryCode">
          <el-row>
            <el-col :span="4">
              <el-select v-model="option.countryCode" clearable filterable @change="countryCodeChange(option.countryCode)">
                <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName" :value="item.cCode"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="物流方式" prop="logisticsCode">
          <el-row>
            <el-col :span="4">
              <el-select v-model="option.logisticsCode" clearable filterable @change="logisticsCodeChange(option.logisticsCode)">
                <el-option v-for="item in logisticsData" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="option.type">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="areaCodeSave('areaCodeForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data (){
      return {
        option: {
          countryName: '',
          countryCode: '',
          logisticsName: '',
          logisticsCode: '',
          type: 1,
          operateType: 2
        },
        rules: {
          countryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
          logisticsCode: [{ required: true, message: '请选物流方式', trigger: 'change' }],
        },
        stateCode: [], //国家
        logisticsData: [], //物流方式
      }
    },
    created (){
      this.getStateCode();
      this.getLogisticsData();
    },
    methods: {
      //获得国家
      getStateCode (){
        this.stateCode = [];
        let args = {
          page_size: 2000,
          page: 1,
          countryCode: '',
        };
        this.$http.get('logistics/country-info/list',{params:args}).then(res =>{
          if(res.body.code === 0){
            res.body.data.list.forEach( item => {
              this.stateCode.push({ cCode: item.countryCode, cName: item.countryName });
            });
          }
        });
      },

      //获得物流方式
      getLogisticsData (){
        this.logisticsData = [];
        this.$http.get('logistics/way/public-oms-ways').then( res => {
          if(res.body.code === 0){
            res.body.data.infoList.forEach( item => {
              this.logisticsData.push({code: item.logisticsCode, name: item.logisticsName});
            });
          }
        })
      },

      countryCodeChange (countryCode){
        if(!countryCode){
          return false;
        }
        for(let i=0;i<this.stateCode.length;i++){
          if(this.stateCode[i].cCode === countryCode){
            this.option.countryName = this.stateCode[i].cName;
            break;
          }
        }
      },

      logisticsCodeChange (logisticsCode){
        if(!logisticsCode){
          return false;
        }
        for(let i=0;i<this.logisticsData.length;i++){
          if(this.logisticsData[i].code === logisticsCode){
            this.option.logisticsName = this.logisticsData[i].name;
            break;
          }
        }
      },

      //添加区号 保存
      areaCodeSave (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('logistics/passport-tax/zip-add', this.option).then(res => {
              if (res.body.code === 0) {
                this.$message.success('保存成功');
                setTimeout(()=>{
                  this.$router.push({name: 'areaCodeManage'});
                },300);
              } else {
                this.$message.error(res.body.message);
              }
            });
          } else {
            console.log('保存失败');
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="less">

</style>
