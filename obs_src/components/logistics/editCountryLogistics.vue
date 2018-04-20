<template>
  <!--编辑国家物流-->
  <div>
    <div class="el-container top">
      <div class="el-container">
        <h3 class="title">禁用品</h3>
        <el-form :model="option" label-width="100px" ref="costForm">
          <el-form-item label="产品分类">
            <el-row>
              <el-col :span="5">
                <el-input v-model="option.forbidCatalog" :disabled="true"></el-input>
              </el-col>
              <el-col :span="2" class="text-center">
                <el-button type="primary" @click="catalogEdit">编辑</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="产品性质">
            <el-row>
              <el-col :span="5">
                <el-input v-model="option.forbidAttr" :disabled="true"></el-input>
              </el-col>
              <el-col :span="2" class="text-center">
                <el-button type="primary" @click="forbidAttrEdit">编辑</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="禁运SKU">
            <el-row>
              <el-col :span="5">
                <el-input type="textarea" :rows="5" placeholder="" v-model="option.forbidSku"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="状态">
            <el-row>
              <el-col :span="5">
                <el-radio-group v-model="option.status">
                  <el-radio   :label="1">开启</el-radio>
                  <el-radio   :label="0">关闭</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="5">
                <el-button type="primary" @click="saveData" v-if="self.showAction_('logistics/contraband-setting/edit')">保存</el-button>
                <el-button type="danger" @click="" @click="$router.push({name:'logistics_webAddress'})">返回</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="产品分类" v-model="proTypeDialog" class="log-group" size="small">
      <el-form :model="proTypeForm" label-width="50px">
        <el-form-item>
          <el-checkbox v-model="proTypeForm.checkbox" @change="proTypeAll">全选</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-tree :data="proTypeForm.proTypeList" :show-checkbox="true" :default-checked-keys = "proTypeTreeArr"
                   default-expand-all node-key="id" ref="proTypeTree" highlight-current :props="proTypeForm.defaultProps"
                   class="proTypeTree" v-loading="proTypeForm.proTypeListLoading">
          </el-tree>
        </el-form-item>
        <el-form-item>
          <div class="text-right footer">
            <el-button type="primary" @click="proTypeDialogSave">确定</el-button>
            <el-button type="danger"  @click="proTypeDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="产品性质" v-model="proNatureDialog" class="log-group" size="small">
      <el-form :model="proNatureForm" label-width="50px">
        <el-form-item>
          <el-checkbox v-model="proNatureForm.checkbox" @change="proNatureFormAll">全选</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-tree :data="proNatureForm.proNatureList" :show-checkbox="true" :default-checked-keys = "proNatureTreeArr"
                   default-expand-all node-key="propertyCode" ref="proNatureFormTree" highlight-current
                   :props="proNatureForm.defaultProps"  class="proTypeTree" v-loading="proNatureForm.proNatureListLoading">
          </el-tree>
        </el-form-item>
        <el-form-item>
          <div class="text-right footer">
            <el-button type="primary" @click="proNatureDialogSave">确定</el-button>
            <el-button type="danger"  @click="proNatureDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    export default{
      data () {
        return {
          self: this,
          proTypeTreeArr:[],
          proNatureTreeArr:[],
          option: {
            forbidAttr : this.$route.query.forbidAttr,
            forbidCatalog: this.$route.query.forbidCatalog,
            forbidSku: this.$route.query.forbidSku,
            countryName: this.$route.query.countryName,
            countryCode: this.$route.query.countryCode,
            status: this.$route.query.status,
            areaId: this.$route.query.areaId,
            //createUser: this.$route.query.createUser,
            type:1
          },
          proTypeDialog:false,
          proNatureDialog:false,
          proTypeForm:{
            checkbox:'',
            proTypeList:[],
            defaultProps:{
                children: 'subCategoryList',
                label: (data, node) => { return node.data.categoryMultiLang.categoryName; }
            },
            proTypeListLoading: false,
          },
          proNatureForm:{
            checkbox:'',
            proNatureList:[],
            defaultProps:{
              label: 'propertyName'
            },
            proNatureListLoading: false,
          },


        };
      },
      created (){

      },
      methods: {
        saveData (){
          this.$http.post('logistics/contraband-setting/edit',this.option).then(res => {
            var result = res.body;
            if(res.body.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.$router.push({name:'logistics_webAddress'});
            } else {
              this.$message.error(res.body.message);
            }
          });
        },

        //产品分类 编辑
        catalogEdit (){
          this.proTypeDialog = true;
          this.proTypeForm.proTypeListLoading = true;
          this.$http.get('goods/category/list?isLeaves=false').then(res => {
            this.proTypeForm.proTypeListLoading = false;
            if(res.body.code ===0 ){
              this.proTypeForm.proTypeList = res.body.data.list;
            }else{
              this.$message({
                type:'error',
                message: res.body.message
              });
            }
          });
          this.proTypeTreeArr = this.option.forbidCatalog.split(',').map((el,i)=> +el);
        },

        proTypeAll (){
          var isChecked = this.proTypeForm.checkbox ;
          if(isChecked){
            this.$refs.proTypeTree.setCheckedNodes(this.proTypeForm.proTypeList);
          }else{
            this.$refs.proTypeTree.setCheckedNodes([]);
          }
        },
        proTypeDialogSave() {
          var  condAttr = this.$refs.proTypeTree.getCheckedNodes() ; //被选中的项
          condAttr = this.getArray(condAttr);
          //console.log(condAttr);
          this.option.forbidCatalog = condAttr;
          this.proTypeDialog = false;
        },
        //产品分类 递归遍历已选中的树的节点中的 id 属性值，保存在 condAttrArr 数组中，再转成字符串用 ； 相连
        getArray (data){
          //console.log(data);
          this.condAttrArr = [];
          for (var i in data) {
            if (data[i].id !== undefined) {
              this.condAttrArr.push(data[i].id)
            } else {
              getArray(data[i].children);
            }
          }
          return this.condAttrArr.join();
        },

        proTypeDialogCancel (){
          this.proTypeDialog = false;
        },

        //产品性质 编辑
        forbidAttrEdit (){
          this.proNatureDialog = true;
          this.proNatureForm.proNatureListLoading = true;
          this.$http.get('logistics/public/contraband-attributes').then(res => {
            this.proNatureForm.proNatureListLoading = false;
            if(res.body.code ===0 ){
              //console.log(res.body.data);
              this.proNatureForm.proNatureList = res.body.data;
              //this.proNatureForm.proNatureList
            }else{
              this.$message({
                type:'error',
                message: res.body.message
              });
            }
          });
          this.proNatureTreeArr = this.option.forbidAttr.split(',').map((el,i)=> +el);
        },
        //产品性质 保存
        proNatureDialogSave (){
          var condAttr = this.$refs.proNatureFormTree.getCheckedNodes() ; //被选中的项
          var condAttrArr = [];
          for(var i=0;i<condAttr.length;i++){
             condAttrArr.push(condAttr[i].propertyCode);
          }
          this.option.forbidAttr = condAttrArr.join();
          this.proNatureDialog = false;
        },
        //产品性质 取消
        proNatureDialogCancel (){
          this.proNatureDialog = false;
        },
        //产品性质 全选
        proNatureFormAll (){
          var isChecked = this.proNatureForm.checkbox ;
          if(isChecked){
            this.$refs.proNatureFormTree.setCheckedNodes(this.proNatureForm.proNatureList);
          }else{
            this.$refs.proNatureFormTree.setCheckedNodes([]);
          }
        },



      },

    }

</script>
<style>
  .title{
    margin:10px 0 20px 40px;
  }
  .proTypeTree{
    height: 600px !important;
    overflow-y: auto !important;
    margin-bottom:10px;
  }
  .footer{
    margin-top:20px;
  }
</style>

