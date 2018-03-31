<template>
  <!--编辑区号-->
  <div>
    <div class="el-container">
      <el-form :model="option" label-width="100px" ref="areaCodeForm" :rules="rules">
        <el-form-item label="国家" prop="countryName">
          <el-row>
            <el-col :span="4">
              <el-select v-model="option.countryName" clearable filterable>
                <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName" :value="item.cName"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="物流方式" prop="logisticsName">
          <el-row>
            <el-col :span="4">
              <el-select v-model="option.logisticsName" clearable filterable>
                <el-option v-for="item in logisticsData" :key="item.code" :label="item.name" :value="item.name"></el-option>
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
          type: '',
          id: '',
          operateType: 2
        },
        rules: {
          countryName: [{ required: true, message: '请选择国家', trigger: 'change' }],
          logisticsName: [{ required: true, message: '请选物流方式', trigger: 'change' }],
        },
        stateCode: [], //国家
        logisticsData: [], //物流方式
      }
    },
    created (){
      this.getStateCode();
      this.getLogisticsData();
      this.getDate();
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

      //通过id获得详细数据
      getDate (){
        this.option.id = this.$route.query.id;
        this.$http.get('logistics/passport-tax/get',{ params:{ id: this.option.id }}).then(res => {
          if (res.body.code === 0) {
            this.option = res.body.data;
          }else{
            this.$message.error(res.body.message);
          }
        })
      },


      //编辑区号 保存
      areaCodeSave (formName){

        //通过国家编码找国家名称
        if (!this.option.countryName) {
          return false;
        }
        for (let i = 0; i < this.stateCode.length; i++) {
          if (this.stateCode[i].cName === this.option.countryName) {
            this.option.countryCode = this.stateCode[i].cCode;
            break;
          }
        }
        //通过物流编码找物流名称
        if (!this.option.logisticsName) {
          return false;
        }
        for (let i = 0; i < this.logisticsData.length; i++) {
          if (this.logisticsData[i].name === this.option.logisticsName) {
            this.option.logisticsCode = this.logisticsData[i].code;
            break;
          }
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('logistics/passport-tax/zip-edit', this.option).then(res => {
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
            this.$message.error('保存失败');
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="less">

</style>
