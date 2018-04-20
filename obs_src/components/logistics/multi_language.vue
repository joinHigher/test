<!--多语言-->
<template>
  <div>
    <div class="el-container">
      <el-form  inline :model="option">
        <el-form-item label="语言">
          <el-input v-model="option.name"></el-input>
        </el-form-item>
        <div class="text-right">
          <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
          <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
        </div>
        <div class="text-right btn-style">
          <el-button type="primary"  icon="plus" @click="newMultiLanuage" class="add-lan-btn" v-if="self.showAction_('logistics/multi-language/add')">添加</el-button>
          <!--<el-button type="primary" @click="" icon="fa-refresh" @click="update">更新</el-button>-->
        </div>
      </el-form>
    </div>
    <div class="el-container">
      <el-table border :data="tableData" v-loading="tableLoading" ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="语言" align="center"></el-table-column>
        <el-table-column prop="lang" label="语言简码" align="center"></el-table-column>
        <el-table-column prop="langOld" label="原始简码" align="center"></el-table-column>
        <el-table-column prop="isAppoint" label="状态" align="center">
          <template scope="scope">
            <i :class="{'el-icon-circle-check color-success':scope.row.status == '1','el-icon-circle-cross color-danger':scope.row.isAppoint == '0'}"></i>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="200px" align="center">
          <template scope="scope">
            {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template scope="scope">
            <el-button type="danger" icon="delete"  @click="removeItem(scope.row)" v-if="self.showAction_('logistics/multi-language/delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-container last text-right">
      <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!-- 弹窗S -->
    <el-dialog title="添加多语言" :visible.sync="multi_lanDialog" class="log-group multi-lanDialog" size="small" :before-close="handleClose">
      <el-form :model="form" inline label-width="100" :rules="rules" ref="FormRules">
         <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"></el-input>
         </el-form-item>
         <el-form-item label="原始简码" prop="langOld">
            <el-input v-model="form.langOld"></el-input>
         </el-form-item>
         <el-form-item label="语言简码" prop="lang">
            <el-input v-model="form.lang"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSave('FormRules')">保存</el-button>
                <el-button type="danger" @click="handleClose">取消</el-button>
            </span>
    </el-dialog>
    <!-- 弹窗E -->
  </div>
</template>

<script>

  export default {
    data () {
      return {
        self: this,
        option: {
          pageNo: 1,
          pageSize: 10,
          name: ''
        },
        tableLoading: false,
        total: 0,
        tableData: [],
        multi_lanDialog:false,
        form: {
          name: '',
          langOld: '',
          lang: '',
          status: 1
        },
        rules: {
          name:[{required:true, message:'名称不能为空!', trigger:'blur'}],
          langOld:[{required:true, message:'原始简码不能为空!', trigger:'blur'}],
          lang:{required:true,  message:'语言简码不能为空!', trigger:'blur'},
        },
      };
    },
    created () {
      this.getData();
    },
    methods: {
      //表格勾选
      handleSelectionChange(val) {

      },

      getData () {
        this.tableData = [];
        this.tableLoading = true;
        this.$http.post('logistics/multi-language/list',this.option).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0 && res.body.data.list) {
            this.tableData = res.body.data.list;
            this.total = res.body.data.totalCount;
          }else{
            this.tableData = [];
          }
        });
      },
      //筛选
      getDataBySearch(){
        this.getData();
        this.option.pageNo = 1;
      },

      //取消筛选
      resetForm () {
        this.option.name = "";
        this.getData();
        this.option.pageNo = 1;
      },

      //添加多语言
      newMultiLanuage (){
          this.multi_lanDialog = true;
      },

      //更新
      update (){
          console.log("update");
      },

      handleSave (formName){
        if (!this.form.name.trim()) {
            this.$message.error('请输入名称!');
            return false;
        }
        if (!this.form.langOld.trim()) {
            this.$message.error('请输入原始简码!');
            return false;
        }
        if (!this.form.lang.trim()) {
            this.$message.error('请输入语言简码!');
            return false;
        }

        this.$refs[formName].validate((valid) => {
          if (!valid) {
              return false;
          }
          let params = {
              name: this.form.name.trim(),
              langOld: this.form.langOld.trim(),
              lang: this.form.lang.trim(),
              status: this.form.status
          };
          this.$http.post('logistics/multi-language/add', params).then( res => {
              if (res.body.code === 0) {
                  this.$message.success("新增成功!");
                  this.getDataBySearch();
                  this.handleClose();
              } else {
                  this.$message.error(res.body.message);
              }
          });
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
          this.$http.post('logistics/multi-language/delete', {id: row.id}).then(res => {
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
    margin-right: 28px;
  }
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
  .multi-lanDialog {
    .el-dialog--small { width: auto !important; }
    .dialog-footer{ margin-right: 10px; }
  }

  .add-lan-btn{
    margin-right: 90px;
  }
</style>
