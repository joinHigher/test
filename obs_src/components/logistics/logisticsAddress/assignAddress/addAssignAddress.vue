<template>
  <!--新增指定地址-->
  <div>
    <div class="el-container">
      <el-form :model="option" label-width="100px" ref="addAssignAddressForm" :rules="rules">
        <el-form-item label="国家" prop="countryCode">
          <el-row>
            <el-col :span="4">
              <el-select v-model="option.countryCode" clearable filterable @change="countryCodeChange(option.countryCode)">
                <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName" :value="item.cCode"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="提示" prop="tips">
          <el-row>
            <el-col :span="4">
              <el-input type="textarea" :rows="6" placeholder="请输入提示语" v-model="option.tips" :maxlength="400"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="option.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="assignAdressSave('addAssignAddressForm')">保存</el-button>
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
          tips: '',
          status: 1
        },
        rules: {
          countryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
          tips: [{ required: true, message: '请输入提示语', trigger: 'blur' }],
        },
        stateCode: [], //国家
      }
    },
    created (){
      this.getStateCode();
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

      //添加指定地址 保存
      assignAdressSave (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('logistics/appoint-address/add', this.option).then(res => {
              if (res.body.code === 0) {
                this.$message.success('保存成功');
                setTimeout(() => {
                  this.$router.push({name: 'assignAddress'});
                }, 300);
              } else {
                 this.$message.error(res.body.message);
              }
            });
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="less">

</style>
