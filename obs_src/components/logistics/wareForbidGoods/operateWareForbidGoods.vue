<template>
  <!--新增/编辑仓库禁发商品-->
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
        <el-form-item label="产品分类" prop="category">
          <el-row>
            <el-col :span="4">
              <el-input readonly v-model="option.category"></el-input>
            </el-col>
            <el-col :span="2" class="margin-left10">
              <el-button type="primary" @click="editCategory">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="产品性质" prop="attr">
          <el-row>
            <el-col :span="4">
              <el-input readonly v-model="option.attr"></el-input>
            </el-col>
            <el-col :span="2" class="margin-left10">
              <el-button type="primary" @click="editAttrs">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="禁运SKU" prop="forbidSku">
          <el-row>
            <el-col :span="4">
              <el-input type="textarea" :rows="6" v-model="option.forbidSku" :maxlength="2048"></el-input>
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
    <CountrySelect ref="countrySelect" :countryForm="countryDialogObj"></CountrySelect>
    <CategorySelect ref="categorySelect" :categoryForm="categoryDialogObj"></CategorySelect>
    <AttrSelect ref="attrSelect" :attrsForm="attrsDialogObj"></AttrSelect>
  </div>
</template>

<script>
  import Vue from 'vue'
  import logistics from '../js/logistics'
  Vue.use(logistics);
  import CountrySelect from '../template/countrySelect'
  import CategorySelect from '../template/categorySelect'
  import AttrSelect from '../template/attrSelect.vue'

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
          category: '',
          attr: '',
          forbidSku: '',
        },
        realWareList: [],
        pipelineList: [],
        rules: {
          realWhCode: [{required: true, message: '请选择真实仓', trigger: 'change'}],
          pipelineCode: [{required: true, message: '请选择渠道', trigger: 'change'}],
          status: [{required: true, type: 'number', message: '请选择状态', trigger: 'blur'}],
          countryNames: [{required: true, message: '请选择国家',}],
        },

        countryDialogObj: {
          title: '选择国家',
          countryDialog: false,
          key: '',  //查询关键字
          countryList: [], //所有国家列表
          countryNamesSelected: [], //被选择的国家名称
          countryCodesSelected: [], //被选择的国家code
        },
        categoryDialogObj: {
          title: '产品分类',
          categoryDialog: false,
          categoryList: [],
          checkbox: '',
          defaultProps: {
            children: 'subCategoryList',
            label: (data, node) => { return node.data.categoryMultiLang.categoryName;}
          },
          itemIdSelected: [],
        },

        attrsDialogObj: {
          attrsDialog: false,
          title: '产品性质',
          checkbox:'',
          attrsList: [],
          defaultProps:{
            label: 'propertyName'
          },
          attrsIdSelected: [],
        },
      }
    },
    created (){

    },
    mounted (){
       this.init();
    },
    watch: {
      'countryDialogObj.countryNamesSelected': function (val, oldval){
        if (val.length > 0) {
          this.option.countryNames = val.join();
        }
      },
      'countryDialogObj.countryCodesSelected': function (val, oldval){
        if (val.length > 0) {
          this.option.countryCodeList = val;
        }
      },
      'categoryDialogObj.itemIdSelected': function (val, oldval){
          this.option.category = val.join();
      },
      'attrsDialogObj.attrsIdSelected' : function (val, oldval) {
          this.option.attr = val.join();
      },

    },
    methods: {
      init (){
        this.realWareList = this.getRealWareFun();
        this.pipelineList = this.getPipe();
        this.countryDialogObj.countryList = this.getCounryListFun();

        this.type = Number(this.$route.query.type);
        if (this.type === 2) {
            this.row = JSON.parse(this.$route.query.row);
            this.option.realWhCode = this.row.realWhCode;
            this.option.pipelineCode = this.row.pipelineCode;
            this.option.forbidSku = this.row.forbidSku;
            this.option.status = this.row.status;
            this.option.remark = this.row.remark;
            this.initCountry(this.row.countryRelRespList);
            this.initCategory(this.row.category);
            this.initAttrs(this.row.attr);
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
          this.option.countryNames = countrysArrTemp.join();
          this.countryDialogObj.countryCodesSelected = this.option.countryCodeList.slice(0);
        }
      },

      editCountry (){
        this.countryDialogObj.countryDialog = true;
        setTimeout(() => {
          this.$refs.countrySelect.init();
        },500);
      },

      //初始化产品分类
      initCategory (str){
          this.option.category = str;
          this.categoryDialogObj.itemIdSelected = str.split(',');
      },

      editCategory (){
        this.categoryDialogObj.categoryDialog = true;
        this.$refs.categorySelect.init();
      },

      initAttrs (str){
        this.option.attr = str;
        this.attrsDialogObj.attrsIdSelected = str.split(',');
      },

      editAttrs (){
          this.attrsDialogObj.attrsDialog = true;
          this.$refs.attrSelect.init();
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
          if (!this.option.category && !this.option.attr && !this.option.forbidSku) {
               this.$message.error('产品分类、产品性质、禁运SKU必填一项！');
               return false;
          }
          this.type === 1 ? this.saveAjax('logistics/warehouse-forbid-attrs/add', params) : this.saveAjax('logistics/warehouse-forbid-attrs/edit', params1);
        });
      },

      saveAjax (url, params){
        this.$http.post(url, params).then(res => {
          if (res.body.code === 0) {
            this.$message.success("保存成功");
            this.$router.push({ name: "wareForbidGoods" });
          } else {
            this.$message.error(res.body.message);
          }
        });
      },

      cancel (){
        this.$router.push({ name: "wareForbidGoods"} );
      },

    }, //methods end

    components: {
      CountrySelect,
      CategorySelect,
      AttrSelect
    }
  }
</script>

<style lang="less">
  .margin-left10{
    margin-left: 10px;
  }
</style>
