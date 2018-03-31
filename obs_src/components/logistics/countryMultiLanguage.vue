<template>
  <!--国家多语言-->
  <div>
    <div class="el-container">
      <el-form  inline :model="option">
        <el-form-item label="国家">
          <el-select v-model="option.countryCode" filterable clearable>
            <el-option v-for="(item, index) in countryList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语言">
          <el-select v-model="option.language" filterable clearable>
            <el-option v-for="(item, index) in languageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <div class="text-right">
          <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
          <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
        </div>
        <div class="text-right btn-style">
          <el-button type="primary" @click="" icon="plus" @click="newMultiLanuage(1)">添加</el-button>
          <el-button type="danger" @click="" icon="delete" @click="batchDelete">批量删除</el-button>
        </div>
      </el-form>
    </div>
    <div class="el-container">
      <el-table border :data="tableData" v-loading="tableLoading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="国家"></el-table-column>
        <el-table-column prop="siteName" label="多语言"></el-table-column>
        <el-table-column prop="wname" label="语言简码"></el-table-column>
        <el-table-column prop="wname" label="原始简码"></el-table-column>
        <el-table-column prop="wname" label="名称"></el-table-column>
        <el-table-column label="修改时间" width="200px">
          <template scope="scope">
            {{self.timeZone_(scope.row.batchDeleteTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column prop="batchDeleteUser" label="修改人"></el-table-column>
        <el-table-column label="操作" width="220">
          <template scope="scope">
            <el-button type="primary" icon="edit"  @click="newMultiLanuage(2,scope.row)">编辑</el-button>
            <el-button type="danger" icon="delete"  @click="removeItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-container last text-right">
      <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!-- 弹窗S -->
    <el-dialog title="添加多语言" :visible.sync="multi_lanDialog" class="log-group multi-lanDialog" size="tiny" :before-close="handleClose">
      <el-form :model="form" label-width="100px"  :rules="rules" ref="FormRules">
        <el-row>
          <el-col :span="22">
            <el-form-item label="国家" prop="countryCode" class="multi-form-item">
              <el-select v-model="form.countryCode" filterable clearable :disabled="isEditWindow">
                <el-option v-for="(item, index) in countryList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="多语言" prop="language" class="multi-form-item">
              <el-select v-model="form.language" filterable clearable :disabled="isEditWindow">
                <el-option v-for="(item, index) in languageList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name" class="multi-form-item">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer text-right">
          <el-button type="primary" @click="handleSave('FormRules')">保存</el-button>
          <el-button type="danger" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗E -->
  </div>
</template>

<script>

  export default {
    data () {
      return {
        self: this,
        countryList: [],
        languageList: [{code: 0, name: 'EN'}, {code: 1, name: 'FR'}, {code: 2, name: 'DE'}],
        option: {
          pageNo: 1,
          pageSize: 10,
          countryCode: '',
          language: ''
        },

        tableLoading: false,
        total: 10,
        tableData: [],
        multi_lanDialog:false,
        form: {
          countryCode: '',
          language: '',
          name: ''
        },
        isEditWindow: false,
        rules: {
          countryCode: [{ required:true, message: '国家不能为空!', trigger: 'change'}],
          language: [{ required:true, type: 'number', message: '多语言不能为空!', trigger: 'change'}],
          name: [{ required:true,  message: '名称不能为空!', trigger: 'blur'}],
        },
      };
    },
    created () {
      this.getCountryList();
      this.getData();
    },
    methods: {
      //获得国家
      getCountryList (){
        this.countryList = [];
        let args = {
          page_size: 2000,
          page: 1,
          countryCode: '',
        };
        this.$http.get('logistics/country-info/list',{params:args}).then(res =>{
          if(res.body.code === 0){
            res.body.data.list.forEach( item => {
              this.countryList.push({ code: item.countryCode, name: item.countryName });
            });
          }
        });
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
          };
        });
      },
      //筛选
      getDataBySearch(){
        this.getData();
        this.option.pageNo = 1;
      },

      //取消筛选
      resetForm () {
        this.option.language = "";
        this.option.countryCode = "";
        this.getData();
        this.option.pageNo = 1;
      },

      //表格勾选
      handleSelectionChange(val) {
          console.log(val);

      },

      //批量删除
      batchDelete (){
        console.log("批量删除");
      },

      //添加 编辑多语言
      newMultiLanuage (type,row){
         if (type===1) {
           this.isEditWindow = false;
         } else  if (type===2) {
           this.isEditWindow = true;
           console.log(row);
         }
        this.multi_lanDialog = true;
      },

      handleSave (formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert("success");
          } else {
            console.log("error");
          }
        });
      },

      handleClose(){
        this.$refs['FormRules'].resetFields();
        this.multi_lanDialog= false ;
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
    } // methods end
  }
</script>

<style lang="less">
  .btn-style {
    margin-top: 15px;
  }
  .log-group {
    .el-dialog {
      top: 5% !important;

      .el-dialog__body {
        padding: 20px;

        .multi-form-item {
          margin-bottom: 20px;
        }
      }
    }
    .dialog-footer {
      margin-top: 10px;
      margin-right: 44px;
    }
  }

</style>
