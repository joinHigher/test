<template>
  <!--税号护照新增-->
  <div>
    <div class="el-container">
      <el-form :model="option" label-width="100px" ref="taxAllocationForm" :rules="rules">
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
        <el-form-item label="类型" prop="type">
            <el-row>
                <el-col :span="4">
                    <el-select v-model="option.type" clearable filterable>
                        <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" @click="taxAllocationSave('taxAllocationForm')">保存</el-button>
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
              operateType: 1
            },
            rules: {
              countryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
              logisticsCode: [{ required: true, message: '请选择物流方式', trigger: 'change' }],
              type: [{ required: true, type: 'number', message: '请选择类型', trigger: 'change' }],
            },
            stateCode: [], //国家
            logisticsData: [], //物流方式
            typeList: [
                { id: 1, label: '税号'},
                { id: 2, label: '护照号'},
                { id: 3, label: '关闭'},
                { id: 4, label: '税号+护照号'},
              ],
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

      //添加税号配置 保存
      taxAllocationSave (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$http.post('logistics/passport-tax/tax-add', this.option).then(res => {
              if (res.body.code === 0) {
                  this.$message.success('保存成功');
                  setTimeout(()=>{
                    this.$router.push({name: 'taxManage'});
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
