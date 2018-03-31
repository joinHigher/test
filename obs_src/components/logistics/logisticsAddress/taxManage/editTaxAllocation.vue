<template>
  <!--税号护照编辑-->
  <div>
    <div class="el-container">
      <el-form :model="option" label-width="100px" ref="taxAllocationForm" :rules="rules">
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
          id: '',
          operateType: 1
        },
        rules: {
            countryName: [{ required: true, message: '请选择国家', trigger: 'change' }],
            logisticsName: [{ required: true, message: '请选择物流方式', trigger: 'change' }],
            type: [{ required: true, type: 'number',message: '请选择类型', trigger: 'change' }],
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
            delete this.option.updateUser;
            delete this.option.updated;
          }else{
            this.$message.error(res.body.message);
          }
        })
      },


      //编辑税号配置 保存
      taxAllocationSave (formName){

        //通过国家名称找国家编码
        if (!this.option.countryName) {
          return false;
        }
        for (let i = 0; i < this.stateCode.length; i++) {
          if (this.stateCode[i].cName === this.option.countryName) {
            this.option.countryCode = this.stateCode[i].cCode;
            break;
          }
        }
        //通过物流名称找物流编码
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
            this.$http.post('logistics/passport-tax/tax-edit', this.option).then(res => {
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
