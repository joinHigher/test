<template>
  <!--新增/编辑仓库可发国家-->
  <div>
    <div class="el-container">
      <el-form :model="option" label-width="100px" ref="ruleForm" :rules="rules">
        <el-form-item label="真实仓" prop="realWhCode">
          <el-row>
            <el-col :span="4">
              <el-select v-model="option.realWhCode" clearable filterable>
                <el-option v-for="item in realWareList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="渠道" prop="pipelineCode">
          <el-row>
            <el-col :span="4">
              <el-select v-model="option.pipelineCode" clearable filterable>
                <el-option v-for="item in pipelineList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="国家" prop="countryNames">
          <el-row>
            <el-col :span="4">
              <el-input readonly v-model="option.countryNames"></el-input>
            </el-col>
            <el-col :span="2" class="margin-left10">
                <el-button type="primary" @click="editCountry">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="option.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-row>
             <el-col :span="4">
               <el-input type="textarea" :rows="6" v-model="option.remark" :maxlength="400"></el-input>
             </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="" class="">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="danger" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <CountrySelect ref="countrySelect" :countryForm="dialogObj"></CountrySelect>
  </div>
</template>

<script>
  import Vue from 'vue'
  import logistics from '../js/logistics'
  Vue.use(logistics);
  import CountrySelect from '../template/countrySelect'

  export default {
    data (){
      return {
        type: '',
        row: '',
        option: {
          realWhCode: '',
          pipelineCode: '',
          remark: '',
          status: 1,
          countryCodeList: [],
          countryNames: '',
        },
        realWareList: [],
        pipelineList: [],
        rules: {
          realWhCode: [{required: true, message: '请选择真实仓', trigger: 'change'}],
          pipelineCode: [{required: true, message: '请选择渠道', trigger: 'change'}],
          status: [{required: true, type: 'number', message: '请选择状态', trigger: 'blur'}],
          countryNames: [{required: true, message: '请选择国家',}],
        },

        dialogObj: {
            title: '选择国家',
            countryDialog: false,
            key: '',  //查询关键字
            countryList: [], //所有国家列表
            countryNamesSelected: [], //被选择的国家名称
            countryCodesSelected: [], //被选择的国家code
        },

      }
    },
    created (){

    },
    mounted () {
          this.init();
    },
    watch: {
        'dialogObj.countryNamesSelected': function (val, oldval){
             if (val.length > 0) {
                  this.option.countryNames = val.join(";");
             }
        },
        'dialogObj.countryCodesSelected': function (val, oldval){
             if (val.length > 0) {
                  this.option.countryCodeList = val;
             }
        }
    },
    methods: {
       init (){
         this.realWareList = this.getRealWareFun();
         this.pipelineList = this.getPipe();
         this.dialogObj.countryList = this.getCounryListFun();
         this.type = Number(this.$route.query.type);
         if (this.type === 2) {
             this.row = JSON.parse(this.$route.query.row);
             this.option.realWhCode = this.row.realWhCode;
             this.option.pipelineCode = this.row.pipelineCode;
             this.option.status = this.row.status;
             this.option.remark = this.row.remark;
             this.initCountry(this.row.countryRelRespList);
         }
       },

      //初始化国家
      initCountry (list){
          let countrysArrTemp = [];
          if (list && list.length>0) {
              list.forEach(item => {
                  countrysArrTemp.push(item.countryName);
                  this.option.countryCodeList.push(item.countryCode);
              });
              this.option.countryNames = countrysArrTemp.join(";");
              this.dialogObj.countryCodesSelected = this.option.countryCodeList.slice(0);
          }
      },

      editCountry (){
          this.dialogObj.countryDialog = true;
          setTimeout(() => {
            this.$refs.countrySelect.init();
          },500);
      },

      //保存
      save (){
           let params = Object.assign({}, this.option);
           delete params.countryNames;
           let params1 = Object.assign({}, params, {id: this.row.id});
           this.$refs['ruleForm'].validate((valid) => {
              if (!valid) {
                  return false;
              }
             this.type === 1 ? this.saveAjax('logistics/warehouse-deliver-country/add', params) : this.saveAjax('logistics/warehouse-deliver-country/edit', params1);
          });
      },

      saveAjax (url, params){
        this.$http.post(url, params).then(res => {
          if (res.body.code === 0) {
              this.$message.success("保存成功");
              this.$router.push({ name: "wareSentCountry" });
          } else {
              this.$message.error(res.body.message);
          }
        });
      },

      cancel (){
        this.$router.push({ name: "wareSentCountry" });
      },

    }, //methods end

    components: {
       CountrySelect
    }
  }
</script>

<style lang="less">
  .margin-left10{
    margin-left: 10px;
  }

</style>
