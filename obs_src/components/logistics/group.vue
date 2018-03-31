<!--物流分组-->
<template>
    <div>
        <div class="el-container">
            <el-form inline :model="option" ref="searcheditForm">
                <el-form-item label="模板">
                    <el-select v-model="option.templateId" filterable clearable @change="templateIdChange(option.templateId)">
                      <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域" labelWidth="100px">
                    <el-select v-model="option.shippingAreaId" filterable clearable>
                      <el-option v-for="item in shippingAreaIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
                    <el-button type="danger" @click="reseteditForm" icon="close">取消筛选</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="el-sub-container text-right">
                <el-button type="primary" @click="openGroupDialog(1)" icon="plus" v-if="self.showAction_('logistics/group/add')">添加物流分组</el-button>
            </div>
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="templateName" label="模板"></el-table-column>
                <el-table-column prop="shippingAreaName" label="区域"></el-table-column>
                <el-table-column prop="name" label="分组名称"></el-table-column>
                <el-table-column label="英文名称" prop="enName"></el-table-column>
                <el-table-column prop="isAppoint" label="允许指定物流">
                  <template scope="scope">
                    <i :class="{'el-icon-circle-check color-success':scope.row.isAppoint == '1','el-icon-circle-cross color-danger':scope.row.isAppoint == '0'}"></i>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="修改时间" width="200px">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateUser" label="修改人"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button type="primary" @click="openGroupDialog(2,scope.row)" v-if="self.showAction_('logistics/group/edit')">编辑</el-button>
                        <el-button type="danger"  @click="removeItem(scope.row)" v-if="self.showAction_('logistics/group/delete')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
          <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <el-dialog :title="dialogTitle" :visible.sync="groupDialog" class="log-group" size="small" :before-close="handleClose">
            <el-form :model="editForm" label-width="140px"  ref="editFormRules">
                  <el-row>
                    <el-col :span="22">
                      <el-form-item label="运费模板" class="form-item" prop="templateId">
                        <el-select v-model="editForm.templateId" @change="templateIdChange(editForm.templateId)" :disabled="isdisabled">
                           <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <span class="red-star">&nbsp;&nbsp;*</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="22">
                      <el-form-item label="区域" class="form-item" prop="shippingAreaId">
                        <el-select v-model="editForm.shippingAreaId" :disabled="isdisabled">
                          <el-option v-for="item in shippingAreaIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                      <span class="red-star">&nbsp;&nbsp;*</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="22">
                      <el-form-item label="分组名称" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                      <span class="red-star">&nbsp;&nbsp;*</span>
                    </el-col>
                  </el-row>
                   <el-form-item label="允许客人指定物流">
                           <el-radio-group v-model="editForm.isAppoint">
                             <el-radio class="radio" :label="1">是</el-radio>
                             <el-radio class="radio" :label="0">否</el-radio>
                           </el-radio-group>
                         </el-form-item>
                   <el-form-item label="是否推荐">
                           <el-radio-group v-model="editForm.isRecommend">
                             <el-radio class="radio" :label="1">是</el-radio>
                             <el-radio class="radio" :label="0">否</el-radio>
                           </el-radio-group>
                         </el-form-item>
                   <el-row>
                      <el-col :span="22">
                         <el-form-item label="推荐优先级" class="form-item" prop="recommendPriority">
                           <el-select v-model="editForm.recommendPriority" clearable>
                             <el-option v-for="item in priorityList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                           </el-select>
                         </el-form-item>
                     </el-col>
                        <span class="red-star">&nbsp;&nbsp;*</span>
                  </el-row>
                  <el-row v-for="(item, index) in editForm.langList" :key="item.key">
                    <el-col :span="22">
                      <el-form-item  :label="item.name+ '名称'"  class="form-item">
                        <el-input v-model="item.value" :maxlength="100"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                      <span class="red-star">&nbsp;&nbsp;*</span>
                    </el-col>
                  </el-row>

                  <el-row>
                      <el-col :span="22">
                          <el-form-item label="备注">
                            <el-input v-model="editForm.remark" type="textarea" :rows="4" :maxlength="400"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleSave(editForm.langList)">保存</el-button>
                    <el-button type="danger" @click="handleClose">取消</el-button>
                </span>
        </el-dialog>
        <!-- 弹窗E -->
    </div>
</template>

<script>
  import Vue from 'vue'
  import logistics from './js/logistics'
  Vue.use(logistics);

export default {
    data () {
        return {
            self: this,
            windowType:'', //添加 或 编辑
            dialogTitle:'',
            groupDialog:false,
            isdisabled:'',
            option: {
                pageNo: 1,
                pageSize: 10,
                templateId: '',
                shippingAreaId: ''
            },
            templateList: this.getTemplateList(), //模板list
            shippingAreaIdList: [], //区域list
            salesWare:[],
            tableLoading: false,
            total: 10,
            tableData: [],
            editForm: {
              templateId: '',
              shippingAreaId: '',
              langList: [],
                id:'',
              name: '',
              isAppoint: '',
              isRecommend: '',
              recommendPriority: '',
              remark: '',
            },
            priorityList:[
              {id:1,value:'平邮'},
              {id:2,value:'挂号'},
              {id:3,value:'专线'},
              {id:4,value:'标准'},
              {id:5,value:'特快'},
            ],

        };
    },
    created () {
        this.getData();
    },
    methods: {
      templateIdChange (id) {
          if (id) {
              this.option.shippingAreaId = '';
              this.editForm.shippingAreaId = '';
              this.shippingAreaIdList = this.getAreaByTemplate(id);
          } else {
              this.shippingAreaIdList = [];
              this.option.shippingAreaId = '';
              this.editForm.shippingAreaId = '';
          }
      },

      getData () {
            this.tableData = [];
            this.tableLoading = true;
            this.$http.get('logistics/group/list',{params:this.option}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    this.tableData = res.body.data.list;
                    this.total = res.body.data.totalCount;
                }else{
                  this.tableData = [];
                }
            });
        },

      getDataBySearch(){
            this.getData();
            this.option.pageNo = 1;
        },

      openGroupDialog(type,row){
            this.windowType = type;
            this.editForm.langList = [];
            this.$http.post('logistics/multi-language/collection', {status: 1}).then( res => {
              if (res.body.code ===0) {
                  res.body.data.forEach(item => {
                    this.editForm.langList.push({id: item.id, name: item.name, lang: item.lang, langOld: item.langOld, value: ''});
                  });

                  if (this.windowType === 2 && row.multiLanguage) {
                      let lanInfo = JSON.parse(row.multiLanguage);
                      let lantempArr = [];
                      for (let item in lanInfo) {
                        let key = item;
                        let val = lanInfo[item];
                        lantempArr.push({lang: key, value: val});
                      }

                      for (let i=0;i<lantempArr.length;i++) {
                        for (let j=0;j<this.editForm.langList.length;j++) {
                          if (lantempArr[i].lang===this.editForm.langList[j].lang) {
                            this.editForm.langList[j].value = lantempArr[i].value;
                          }
                        }
                      }
                  }
              }
            });

            this.groupDialog = true;
            if(this.windowType === 1){
              this.dialogTitle = '添加物流分组' ;
              this.isdisabled = false;
              this.editForm.templateId = '';
              this.editForm.shippingAreaId = '';
              this.editForm.name = '';
              this.editForm.isAppoint = 1;
              this.editForm.isRecommend = 1;
              this.editForm.recommendPriority = '' ;
              this.editForm.remark = '';
            }else{
               // console.log(row);
              this.shippingAreaIdList = [];
              this.$http.get('logistics/shipping-area/name-list').then(res => {
                if (res.body.code===0 && res.body.data.list) {
                    res.body.data.list.forEach(item => {
                      this.shippingAreaIdList.push({id: item.id, name: item.name});
                  });
                }
              });
              this.dialogTitle = '编辑物流分组' ;
              this.isdisabled = true;
              this.editForm.id = row.id;
              this.$nextTick(() => {
                this.editForm.shippingAreaId = row.shippingAreaId;
              });
              this.editForm.templateId = row.templateId;
              this.editForm.name = row.name;
              this.editForm.isAppoint = row.isAppoint;
              this.editForm.isRecommend = row.isRecommend;
              this.editForm.recommendPriority = row.recommendPriority;
              this.editForm.remark = row.remark;
            }
        },

      addGroup () {
              let params = this.optionData();
              this.$http.post('logistics/group/add', params).then(res => {
                  if (res.body.code === 0) {
                      this.$message.success('保存成功！');
                      this.getData();
                      this.groupDialog = false;
                  } else {
                      this.$message.error(res.body.message);
                  }
              })
          },

      editGroup (list) {
          let params = this.optionData();
              params.id = this.editForm.id;
              !list ? params.multiLanguage = '': '';
          this.$http.post('logistics/group/edit', params).then(res => {
            if (res.body.code === 0) {
              this.$message.success('保存成功！');
              this.getData();
              this.groupDialog = false;
            } else {
              this.$message.error(res.body.message);
            }
          })
        },

       //为保存组装数据
      optionData (){
         let lanList = [];
         this.editForm.langList.forEach(item => {
           lanList.push({lang: item.lang, value: item.value.trim()});
         });

         let lanArrTemp = [];
         let lanObjTemp ={};
         lanList.forEach(item => {
           let obj ={};
           obj[item.lang] = item.value;
           lanArrTemp.push(obj);
         });

         lanArrTemp.forEach(item => {
           for (let key in item) {
             let key = key;
             let val = item[key];
             lanObjTemp[key] = val;
           }
         });

         let obj = {
             name: this.editForm.name.trim(),
             templateId: this.editForm.templateId,
             shippingAreaId: this.editForm.shippingAreaId,
             multiLanguage: JSON.stringify(lanObjTemp),
             remark: this.editForm.remark.trim(),
             isRecommend: this.editForm.isRecommend,
             recommendPriority: this.editForm.recommendPriority,
             isAppoint: this.editForm.isAppoint,
         };
         return obj;
       },

      validFun (){
           let isOk = true;
           if (!this.editForm.templateId) {
               this.$message.error("请选择运费模板!");
               return isOk = false;
           }
           if (!this.editForm.shippingAreaId) {
               this.$message.error("请选择区域!");
               return isOk = false;
           }
           if (!this.editForm.name.trim()) {
               this.$message.error("请填写分组名称!");
               return isOk = false;
           }
           if (!this.editForm.recommendPriority) {
               this.$message.error("请选择推荐优先级!");
               return isOk = false;
           }
           for (let i=0;i<this.editForm.langList.length;i++) {
                if (!this.editForm.langList[i].value.trim()) {
                    this.$message.error(this.editForm.langList[i].name + '不能为空！');
                    isOk = false;
                    break;
                }
           }
           return isOk;
      },

      handleSave (list){
          let valid = this.validFun();
          if (!valid) {
              return false;
          }
          if (this.windowType === 1) {
            this.addGroup();
          } else {
            this.editGroup(list);
          }
      },

      handleClose(){
          this.$refs['editFormRules'].resetFields();
          this.groupDialog= false ;
      },

      removeItem (row) {
              this.$confirm('是否删除该项?', '提示', {
                  type: 'warning'
              }).then(() => {
                  this.$http.post('logistics/group/delete', {id: row.id}).then(res => {
                      if (res.body.code === 0) {
                          let index = this.tableData.indexOf(row);
                          this.tableData.splice(index, 1);
                          this.total--;
                          this.$message({
                              type: 'success',
                              message: '删除成功'
                          });
                      } else {
                          this.$message.error(res.body.message);
                      }
                  });
              }).catch(() => {
                  this.$message({
                      type: 'info',
                      message: '已取消删除!'
                  });
              });
          },

      ChangePage (val) {
          this.option.pageNo = val;
          this.getData();
      },

      ChangePageSize (val) {
            this.option.pageSize = val;
            this.getData();
      },

      reseteditForm () {
              this.option.templateId = '';
              this.option.shippingAreaId = '';
              this.getData();
              this.option.pageNo = 1;
      },
    },
}
</script>

<style lang="less">
  .log-group {
    .el-dialog {
      top: 5% !important;

      .el-dialog__body {
        padding: 20px;

        .el-form-item {
          margin-bottom: 5px;
        }
      }
    }
  }
  .form-item{
    margin-bottom:18px !important;
  }
  .dialog-footer{
    margin-right:80px;
  }
  .red-star {
    color: red;
    display: inline-block;
    margin-top: 12px;
  }
</style>
