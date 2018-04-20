<!--多语言管理-->
<template>
  <div class="el-container">
    <div class="el-sub-container text-right">
      <a :href="downUrl" target="_blank" class="export-button">
          <el-button type="primary" v-if="self.showAction_('admin/multiple-language/export')">导出</el-button>
      </a>
      <el-button type="primary" @click="importFile" v-if="self.showAction_('admin/multiple-language/import')">导入</el-button>
    </div>
    <el-table border :data="tableData" v-loading="tableLoading">
      <el-table-column prop="id" label="编号" align="center"></el-table-column>
      <el-table-column prop="lang" label="语言" align="center"></el-table-column>
      <el-table-column label="最后操作人" align="center">
          <template scope="scope">
             {{ scope.row.update_user || scope.row.create_user }}
           </template>
      </el-table-column>
      <el-table-column label="最后操作时间" align="center">
          <template scope="scope">
            {{ self.timeZone_(scope.row.update_time, self.$store.getters.getTimeZone) || self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone) }}
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
          <template scope="scope">
              <router-link :to="{name: 'staticLangPackManage', query: {lang: scope.row.lang}}">
                <el-button size="small" type="primary" v-if="self.showAction_('admin/multiple-language/content-list')">查看静态语言包</el-button>
              </router-link>
          </template>
      </el-table-column>
    </el-table>

    <!--弹窗start-->
    <el-dialog title="多语言导入" :visible.sync="langDialogForm.dialogFormVisible" size="tiny" v-loading="langDialogForm.loading">
      <el-form :model="langDialogForm" labelWidth="100px">
        <el-form-item label="上传文件：">
            <el-upload :action="langDialogForm.importUrl" ref="upload" :on-preview="handlePreview" :on-remove="handleRemove"
                       :file-list="langDialogForm.fileList"
                       :auto-upload="false"
                       :accept="langDialogForm.fileType"
                       :on-success="handleBatchImportPreview"
                       :on-error="handleBatchImportError"
                       :beforeUpload="beforeAvatarUpload"
                       :multiple="false"
                       id="upload"
                       name="name">
              <el-button slot="trigger" type="success">选取文件</el-button>
            </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveImport">确 定</el-button>
        <el-button type="danger" @click="cancelImport">取 消</el-button>
      </div>
    </el-dialog>
    <!--弹窗end-->
  </div>
</template>

<script>

  export default {
    data () {
      return {
        self: this,
        tableLoading: false,
        tableData: [],
        downUrl: this.$store.getters.getRootMenu + '/admin/multiple-language/export',
        langDialogForm: {
          dialogFormVisible: false,
          importUrl: this.$store.getters.getRootMenu + '/admin/multiple-language/import',
          fileList: [],
          fileType: 'excel',
          loading: false
        },
      };
    },

    created () {
      this.getData();
    },
    methods: {
      getData () {
        this.$http.get('admin/multiple-language/list').then(res => {
          if (res.body.code === 0) {
            this.tableData = res.body.data;
          } else {
            this.$message.error(res.body.message);
          }
        });
      },

      importFile () {
          this.langDialogForm.dialogFormVisible = true;
      },
      handleRemove(file, fileList) {
        //console.log(file, fileList);
      },
      handlePreview(file) {
        //console.log(file);
      },

      beforeAvatarUpload (file) {
        let extension1 = file.name.split('.')[1] === 'xls';
        let extension2 = file.name.split('.')[1] === 'xlsx';
        if (!extension1 && !extension2) {
          this.$message.error("请选择xls，xlsx格式的表格文件！");
          return false;
        }
      },

      handleBatchImportPreview (res, file) {
        this.langDialogForm.loading = true;
        if (res.code === 0) {
          this.langDialogForm.loading = false;
          this.$message.success('导入成功');
          this.langDialogForm.dialogFormVisible = false;
          this.getData();
          this.langDialogForm.fileList = [];
        } else {
          this.$alert(res.message,"提示",{
              confirmButtonText : '确定',
              type : 'error' ,
          });
        }
      },

      handleBatchImportError (err, file) {
        this.langDialogForm.fileList = [];
        this.$alert(err,"提示",{
            confirmButtonText : '确定',
            type : 'error' ,
        });
      },

      cancelImport () {
        this.langDialogForm.fileList = [];
        this.langDialogForm.dialogFormVisible = false;
      },

      saveImport () {
        let sign = document.getElementById('upload').lastChild.hasChildNodes();
        if(!sign){
          this.$message.error('请选择上传文件!');
          return false;
        }
        let count = document.getElementsByClassName('el-upload-list__item-name').length;
        if (count>1) {
          this.$message.error('上传文件数量不能超过1个!');
          return false;
        }
        this.$refs.upload.submit();
      },
    }
  }
</script>

<style lang="less">
  .export-button {
      margin-right: 10px;
  }
</style>
