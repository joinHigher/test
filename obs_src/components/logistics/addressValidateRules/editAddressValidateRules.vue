<template>
  <!--编辑地址校验规则-->
  <div>
    <div class="el-container">
      <el-form :model="option" labelWidth="200px" ref="ruleForm">
        <el-form-item label="规则名称" prop="name" :rules="[{ required: true,message: '请输入规则名称' }]">
          <el-row>
            <el-col :span="6">
              <el-input v-model="option.name"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="销售仓" prop="saleWare">
          <el-row>
            <el-col :span="6">
              <el-input v-model="option.saleWare" readonly="readonly"></el-input>
            </el-col>
            <el-col :span="2">
              <span>&nbsp;&nbsp;</span>
              <el-button type="primary" @click="editSaleWare">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="真实仓" prop="realWare">
          <el-row>
            <el-col :span="6">
              <el-input v-model="option.realWare" readonly="readonly"></el-input>
            </el-col>
            <el-col :span="2">
              <span>&nbsp;&nbsp;</span>
              <el-button type="primary" @click="editRealWare">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-row>
            <el-col :span="6">
              <el-input v-model="option.country" readonly="readonly"></el-input>
            </el-col>
            <el-col :span="2">
              <span>&nbsp;&nbsp;</span>
              <el-button type="primary" @click="editCountry">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="产品分类" prop="category">
          <el-row>
            <el-col :span="6">
              <el-input v-model="option.category" readonly="readonly"></el-input>
            </el-col>
            <el-col :span="2">
              <span>&nbsp;&nbsp;</span>
              <el-button type="primary" @click="editCategory">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="产品性质" prop="nature">
          <el-row>
            <el-col :span="6">
              <el-input v-model="option.nature" readonly="readonly"></el-input>
            </el-col>
            <el-col :span="2">
              <span>&nbsp;&nbsp;</span>
              <el-button type="primary" @click="editNature">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="禁运SKU" prop="prohibitSKU">
          <el-row>
            <el-col :span="6">
              <el-input type="textarea" :rows="5" v-model="option.prohibitSKU"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-row>
            <el-col :span="5">
              <el-radio-group v-model="option.status">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-row>
            <el-col :span="6">
              <el-input type="textarea" :rows="5" v-model="option.remark" :maxlength="400"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="操作">
          <el-row>
            <el-col :span="5">
              <el-button type="primary" @click="saveRule('ruleForm')">保存</el-button>
              <el-button type="danger" @click="resetForm">返回</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <!--弹窗 begin-->
    <!--销售仓弹窗-->
    <el-dialog title="销售仓" v-model="saleWareDialog" class="log-group" size="tiny" :beforeClose="saleWareFormCancel">
      <el-form :model="saleWareForm">
        <el-form-item>
          <el-row>
            <el-col :span="10">
              <el-input v-model="saleWareForm.searchKey" placeholder="请输入销售仓名称"></el-input>
            </el-col>
            <el-col :span="5" class="text-right">
              <el-button type="primary" icon="search" @click="searchSaleWare">搜索</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-table  ref="saleWareTable"  :data="saleWareForm.saleWareList" class="pop-table" @selection-change="handlSaleWareSelect" v-loading = "saleWareLoading">
            <el-table-column type="selection" width = '60'></el-table-column>
            <el-table-column prop="code" label="全选" width = '100'></el-table-column>
            <el-table-column prop="name"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div class="text-right footer">
            <el-button type="primary" @click="saleWareFormSave">确定</el-button>
            <el-button type="danger"  @click="saleWareFormCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--真实仓弹窗-->
    <el-dialog title="真实仓" v-model="realWareDialog" class="log-group" size="tiny" :beforeClose="realWareFormCancel">
      <el-form :model="realWareForm">
        <el-form-item>
          <el-row>
            <el-col :span="10">
              <el-input v-model="realWareForm.searchKey" placeholder="请输入真实仓名称"></el-input>
            </el-col>
            <el-col :span="5" class="text-right">
              <el-button type="primary" icon="search" @click="searchRealWare">搜索</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-table  ref="realWareTable"  :data="realWareForm.realWareList" class="pop-table" @selection-change="handlRealWareSelect" v-loading = "realWareLoading">
            <el-table-column type="selection" width = '60'></el-table-column>
            <el-table-column prop="code" label="全选" width = '100'></el-table-column>
            <el-table-column prop="name"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div class="text-right footer">
            <el-button type="primary" @click="realWareFormSave">确定</el-button>
            <el-button type="danger"  @click="realWareFormCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--国家弹窗-->
    <el-dialog title="国家" v-model="countryDialog" class="log-group" size="tiny" :beforeClose="countryFormCancel">
      <el-form :model="countryForm">
        <el-form-item>
          <el-row>
            <el-col :span="10">
              <el-input v-model="countryForm.searchKey" placeholder="请输入国家名称"></el-input>
            </el-col>
            <el-col :span="5" class="text-right">
              <el-button type="primary" icon="search" @click="searchCountry">搜索</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-table  ref="countryTable"  :data="countryForm.countryList" class="pop-table" @selection-change="handlCountrySelect" v-loading = "countryLoading">
            <el-table-column type="selection" width = '60'></el-table-column>
            <el-table-column prop="code" label="全选" width = '100'></el-table-column>
            <el-table-column prop="name"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div class="text-right footer">
            <el-button type="primary" @click="countryFormSave">确定</el-button>
            <el-button type="danger"  @click="countryFormCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--产品分类弹窗-->
    <el-dialog title="产品分类" v-model="categoryDialog" class="log-group" size="small">
      <el-form :model="categoryForm">
        <el-form-item>
          <el-checkbox v-model="categoryForm.checkAll" @change="categoryCheckAll">全选</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-tree :data="categoryForm.categoryList" :show-checkbox="true" default-expand-all node-key="id" ref="categoryTree" highlight-current
                   :props="categoryForm.defaultProps" class="tree-style" v-loading="categoryLoading"></el-tree>
        </el-form-item>
        <el-form-item>
          <div class="text-right footer">
            <el-button type="primary" @click="categoryFormSave">确定</el-button>
            <el-button type="danger" @click="categoryFormCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--产品性质弹窗-->
    <el-dialog title="产品性质" v-model="natureDialog" class="log-group" size="tiny">
      <el-form v-model="natureForm">
        <el-form-item>
          <el-checkbox v-model="natureForm.checkAll" @change="natureCheckAll">全选</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-tree :data="natureForm.natureList" :show-checkbox="true" default-expand-all node-key="propertyCode" ref="natureTree" highlight-current
                   :props="natureForm.defaultProps" class="tree-style" v-loading="natureLoading"></el-tree>
        </el-form-item>
        <el-form-item>
          <div class="text-right footer">
            <el-button type="primary" @click="natureFormSave">确定</el-button>
            <el-button type="danger" @click="natureFormCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--弹窗 end-->

  </div>
</template>

<script>
  export default {
    data (){
      return {
        self: this,
        option: {
          name: '',
          saleWare: '',
          realWare: '',
          country: '',
          category: '',
          nature: '',
          prohibitSKU: '',
          status: 1,
          remark: '',
        },

        //销售仓弹窗参数
        saleWareDialog: false,
        saleWareForm: {
          searchKey: '',
          saleWareList: [],
        },
        saleWareLoading: false,

        //真实仓弹窗参数
        realWareDialog: false,
        realWareForm: {
          searchKey: '',
          realWareList: [],
        },
        realWareLoading: false,

        //国家弹窗参数
        countryDialog: false,
        countryForm: {
          searchKey: '',
          countryList: [],
          countryListSelect: [],
          countryNamesList: [],
          countryCodesList: [],
          countryNamesString: '',
          countryCodesString: '',
        },
        countryLoading: false,

        //产品分类弹窗参数
        categoryDialog: false,
        categoryForm: {
          checkAll: '',
          categoryList: [],
          defaultProps: {
            children: 'children',
            label: 'name'
          },
        },
        categoryLoading: false,

        //产品性质弹窗参数
        natureDialog: false,
        natureForm: {
          checkAll: '',
          natureList: [],
          defaultProps: {
            label: 'propertyName'
          }
        },
        natureLoading: false,


      }
    },

    created (){



    },

    methods: {

      //销售仓方法
      //销售仓编辑
      editSaleWare (){
        this.saleWareDialog = true;
      },
      //搜索销售仓
      searchSaleWare (){


      },

      //销售仓全选
      handlSaleWareSelect (){

      },

      //销售仓保存
      saleWareFormSave (){

      },

      //销售仓取消
      saleWareFormCancel (){
        this.saleWareForm.searchKey = "";
        this.saleWareDialog = false;
      },
      /**************************************************************************/

      //真实仓方法
      //真实仓编辑
      editRealWare (){
        this.realWareDialog = true;
      },
      //搜索销售仓
      searchRealWare (){


      },

      //销售仓全选
      handlRealWareSelect (){

      },

      //销售仓保存
      realWareFormSave (){

      },

      //销售仓取消
      realWareFormCancel (){
        this.realWareForm.searchKey = "";
        this.realWareDialog = false;
      },
      /**************************************************************************/

      //国家方法
      //国家编辑
      editCountry (){
        this.countryDialog = true;
        this.countryForm.countryList = [];
        this.countryForm.countryListSelect = [];
        this.countryForm.countryNamesList = [];
        this.countryForm.countryCodeList = [];
        this.countryLoading = true;
        this.$http.get('logistics/country-info/list',{params:{page_size:2000,page:1,countryCode:''}}).then(res => {
          if (res.body.code===0) {
            //console.log(res.body.data);
            this.countryLoading = false;
            res.body.data.list.forEach((item) => {
              this.countryForm.countryList.push({ code: item.countryCode, name: item.countryName });
            });
          }
          //console.log(this.countryForm.countryList);
        })


      },
      //搜索国家
      searchCountry (){
        let keyWord = this.countryForm.searchKey.trim(),
          searchResult = false;
        if (!keyWord) {
          this.$message.error("请输入个国家名称！");
          return false;
        }
        for(let i=0;i<this.countryForm.countryList.length;i++){
          if(keyWord.toUpperCase() === this.countryForm.countryList[i].name.toUpperCase()){
            this.$refs.countryTable.toggleRowSelection(this.countryForm.countryList[i]);
              let top =  40 * i - 250;
              $('.countryTable').animate({
                  'scrollTop': top
              },500);
            searchResult = true;
            break;
          }
        }
        !searchResult ? this.$message.error("没有找到该国家!") : '';
      },
      //国家勾选
      handlCountrySelect (val){
        this.countryForm.countryListSelect = [];
        this.countryForm.countryNamesList = [];
        this.countryForm.countryCodesList = [];
        this.countryForm.countryListSelect = val;

        if (this.countryForm.countryListSelect && this.countryForm.countryListSelect.length>0) {
          this.countryForm.countryListSelect.forEach(item => {
            this.countryForm.countryNamesList.push(item.name);
            this.countryForm.countryCodesList.push(item.code);
          });
          this.countryForm.countryNamesString = this.countryForm.countryNamesList.join(";");
          this.countryForm.countryCodesString = this.countryForm.countryCodesList.join(";");
        }
      },
      //国家保存
      countryFormSave (){
        /*console.log(this.countryForm.countryNamesString);
         console.log(this.countryForm.countryCodesString);*/
        this.option.country = this.countryForm.countryNamesString;
        this.countryDialog = false;
      },
      //国家取消
      countryFormCancel (){
        this.countryForm.searchKey = "";
        this.countryDialog = false;
      },
      /**************************************************************************/

      //产品分类方法
      //产品分类编辑
      editCategory (){
        this.categoryDialog = true;
        this.categoryLoading = true;
        this.categoryForm.checkAll = false;
        this.$http.get('logistics/public/category-all').then(res => {
          if (res.body.code===0) {
            console.log(res.body.data);
            this.categoryForm.categoryList = res.body.data;
            this.categoryLoading = false;
          } else {
            this.categoryForm.categoryList = [];
            this.$message.error(res.body.message);
          }
        });
      },
      //产品分类全选
      categoryCheckAll (){
        this.categoryForm.checkAll ? this.$refs.categoryTree.setCheckedNodes(this.categoryForm.categoryList) : this.$refs.categoryTree.setCheckedNodes([]);
      },
      //产品分类保存
      categoryFormSave (){
        let categorySelected = this.$refs.categoryTree.getCheckedNodes();
        let categoryResult = [];
        if (categorySelected.length===0) {
          this.$message.error("请选择产品分类!");
          return false;
        }
        console.log(this.getTreeNamesIds(categorySelected));
        categoryResult = this.getTreeNamesIds(categorySelected);
        this.option.category = categoryResult.treeNames.join(";");

        this.categoryDialog = false;
      },
      //产品分类取消
      categoryFormCancel (){
        this.categoryDialog = false;
      },

      /**************************************************************************/
      //产品性质方法
      //产品性质编辑
      editNature (){
        this.natureDialog = true;
        this.natureLoading = true;
        this.natureForm.checkAll = false;
        this.$http.get('logistics/public/contraband-attributes').then(res => {
          if (res.body.code===0) {
            console.log(res.body.data);
            this.natureForm.natureList = res.body.data;
            this.natureLoading = false;
          } else {
            this.natureForm.natureList = [];
            this.$message.error(res.body.message);
          }
        });
      },

      //产品性质全选
      natureCheckAll (){
        console.log(this.natureForm.checkAll);
        this.natureForm.checkAll ? this.$refs.natureTree.setCheckedNodes(this.natureForm.natureList) : this.$refs.natureTree.setCheckedNodes([]);
      },

      //产品性质保存
      natureFormSave (){

      },

      //产品性质取消
      natureFormCancel (){
        this.natureDialog = false;
      },

      //获得Tree的name和id
      getTreeNamesIds (data){
        let obj = {
          treeNames: [],
          treeIds: []
        };
        data.forEach(item => {
          if (item.name !== undefined) {
            obj.treeNames.push(item.name);
            obj.treeIds.push(item.id);
          } else {
            obj.getTreeNamesIds(item.children);
          }
        });
        return obj;
      },


      //保存规则
      saveRule (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //返回
      resetForm (){
        this.$router.push({name: 'addressValidateRules'});
      }

    }, //methods end
  }
</script>

<style lang="less">
  .pop-table {
    height: 600px;
    overflow-y: auto;
  }
  .footer {
    margin-top: 12px;
  }
  .tree-style {
    height: 600px !important;
    overflow-y: auto !important;
    margin-bottom:10px;
  }


</style>
