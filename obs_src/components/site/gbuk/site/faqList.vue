<template>
  <div>
    <div class="el-container top">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/site/siteList'}">站点设置</el-breadcrumb-item>
        <el-breadcrumb-item>FAQ管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="el-container">
      <el-tabs class="full" active-name="1" @tab-click="changePlatform">
        <el-tab-pane v-for="(item, index) in platformOpt" :label="item" :name="index" :key="index"></el-tab-pane>
      </el-tabs>
      <el-row>
        <el-col :span="10">
          <el-form :inline="true" label-width="100px">
            <el-form-item label="请选择语言">
              <el-select @change="changeTable" v-model="tableOpt.language">
                <el-option v-for="(item, index) in langOpt" :key="index" :label="item.language_ch"
                           :value="item.language_en" :selected="!index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="text-right" :span="14">
          <el-button v-if="self.showAction_('admin/article/add')" type="primary" @click="articeDialog = true">添加文章
          </el-button>
          <el-button v-if="self.showAction_('admin/article-category/add')" type="primary" @click="updateDialog = true">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <div class="el-sub-container">
        <table class="table-custom" v-loading="tableLoading">
          <thead>
          <tr>
            <th>文章分类</th>
            <th>文章标题</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(arr, index) in tableData">
            <tr v-for="(item, _index) in arr.articles" v-if="arr.articles.length > 0" :key="item.id">
              <td v-if="!(_index)" :rowspan="arr.articles.length">
                <a href="javascript:;" @click="editTitle(arr)">{{arr.name}}</a>
              </td>
              <td>{{item.title}}</td>
              <td>
                <i
                  :class="{'el-icon-circle-check color-success': item.is_enable == '1', 'el-icon-circle-cross color-danger': item.is_enable == '0'}"></i>
              </td>
              <td>
                <router-link
                  :to="'/site/faqSet?id=' + item.id +'&platform=' + tableOpt.platform + '&language=' + tableOpt.language"
                  class="el-button el-button--primary el-button--small">编辑
                </router-link>
                <el-button type="danger" size="small" @click="removeRow(item.id, index, _index)">删 除</el-button>
              </td>
            </tr>
            <tr v-if="arr.articles.length === 0">
              <td><a href="javascript:;" @click="editTitle(arr)">{{arr.name}}</a></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 弹窗S -->
    <el-dialog title="添加文章" v-model="articeDialog" size="tiny">
      <el-form :model="articeForm" label-width="100px" :rules="formRule" ref="form">
        <el-form-item label="文章分类" prop="cat_id">
          <el-select v-model="articeForm.cat_id">
            <el-option v-for="(item, index) in categoryOpt" :label="item" :value="index" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="articeForm.title"></el-input>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="articeForm.url"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input v-model="articeForm.order"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="is_enable">
          <el-col :span="16">
            <el-radio-group v-model="articeForm.is_enable">
              <el-radio class="radio" label="1">启用</el-radio>
              <el-radio class="radio" label="0">禁用</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <el-input type="textarea" :rows="6" v-model="articeForm.content" placeholder="请填写HTML"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addArticle" v-loading="addArtLoading">确 认</el-button>
                <el-button @click="articeDialog = false">取 消</el-button>
            </span>
    </el-dialog>
    <el-dialog title="添加分类" v-model="updateDialog" size="tiny">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="文章分类">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addForm.order"></el-input>
        </el-form-item>
        <el-form-item label="是否底部显示">
          <el-radio class="radio" v-model="addForm.is_show_at_bottom" label="1">显示</el-radio>
          <el-radio class="radio" v-model="addForm.is_show_at_bottom" label="0">不显示</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addClass" v-loading="addClassLoading">确 认</el-button>
                <el-button @click="updateDialog = false">取 消</el-button>
            </span>
    </el-dialog>
    <el-dialog title="修改分类" v-model="editTitleDialog" size="tiny">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="文章分类">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="editForm.order"></el-input>
        </el-form-item>
        <el-form-item label="是否底部显示">
          <el-radio class="radio" v-model="editForm.is_show_at_bottom" label="1">显示</el-radio>
          <el-radio class="radio" v-model="editForm.is_show_at_bottom" label="0">不显示</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="postEditTitle" v-loading="postLoading">确 认</el-button>
                <el-button @click="editTitleDialog = false">取 消</el-button>
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
        addArtLoading: false,
        addClassLoading: false,
        postLoading: false,
        tableLoading: false,
        tableData: [],
        tableOpt: {
          language: 'en',
          platform: '1'
        },
        updateDialog: false,
        articeDialog: false,
        editTitleDialog: false,
        articeForm: {
          title: '',
          order: '',
          url: '',
          is_enable: '',
          content: '',
          cat_id: ''
        },
        addForm: {
          name: '',
          order: '',
          is_show_at_bottom: ''
        },
        editForm: {
          name: '',
          order: '',
          id: '',
          is_show_at_bottom: ''
        },
        platformOpt: [],
        categoryOpt: [],
        langOpt: [],
        formRule: {
          title: [{
            required: true,
            message: '该项不能为空',
            trigger: 'blur'
          }],
          content: [{
            required: true,
            message: '该项不能为空',
            trigger: 'blur'
          }],
          order: [{
            required: true,
            message: '该项不能为空',
            trigger: 'blur'
          }],
          cat_id: [{
            required: true,
            message: '该项不能为空',
            trigger: 'change'
          }],
          is_enable: [{
            required: true,
            message: '该项不能为空',
            trigger: 'change'
          }]
        }
      };
    },
    created () {
      this.initData();
    },
    methods: {
      initData () {
        var self = this;
        self.getCategory();
        self.getplatform();
        self.getLang();
        self.getArticle();
      },
      getCategory () {
        this.$http.get('admin/public/article-category-select-options').then(res => {
          this.categoryOpt = res.body.data;
        });
      },
      getArticle (tableOpt) {
        this.tableLoading = true;
        this.$http.get('admin/article/list', {params: tableOpt}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.tableData = res.body.data;
          }
        });
      },
      getplatform () {
        var self = this;

        self.$http.get('admin/public/platforms').then(res => {
          if (res.body.code === 0) {
            self.platformOpt = res.body.data;
          }
        });
      },
      getLang () {
        var self = this;

        self.$http.get('admin/public/languages').then(res => {
          if (res.body.code === 0) {
            self.langOpt = res.body.data;
          }
        });
      },
      addClass () {
        var self = this;

        self.tableOpt.name = self.addForm.name;
        self.tableOpt.order = self.addForm.order;
        self.tableOpt.is_show_at_bottom = self.addForm.is_show_at_bottom;

        self.addClassLoading = true;
        self.$http.post('admin/article-category/add', self.tableOpt).then(res => {
          self.addClassLoading = false;
          if (res.body.code == 0) {
            self.$message({
              message: '添加成功',
              type: 'success'
            });
            self.getArticle(self.tableOpt);
            self.updateDialog = false;
          } else {
            self.$message.error(res.body.message);
            self.updateDialog = false;
          }
        });
      },
      addArticle () {
        this.$refs.form.validate(valid => {
          if (valid) {
            var self = this;

            self.addArtLoading = true;
            self.$http.post('admin/article/add', self.articeForm).then(res => {
              self.addArtLoading = false;

              if (res.body.code == 0) {
                self.$message({
                  message: '添加成功',
                  type: 'success'
                });
                self.getArticle(self.tableOpt);
                self.articeDialog = false;
              } else {
                self.$message.error(res.body.message);
                self.articeDialog = false;
              }
            });
          }
        });
      },
      editTitle (arr) {
        var self = this;

        self.editForm.id = arr.id;
        self.editForm.name = arr.name;
        self.editForm.order = arr.order;
        self.editForm.is_show_at_bottom = arr.is_show_at_bottom;
        self.editTitleDialog = true;
      },
      postEditTitle () {
        var self = this;

        self.$http.post('admin/article-category/edit', this.editForm).then(res => {
          if (res.body.code == 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.getArticle(this.tableOpt);
            this.editTitleDialog = false;
          } else {
            this.$message.error(res.body.message);
            this.editTitleDialog = false;
          }
        });
      },
      removeRow (id, index, _index) {
        var self = this;

        self.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          self.$http.post('admin/article/delete', {id: id}).then(res => {

            if (res.body.code == 0) {
              self.tableData[index].articles.splice(_index, 1);
              self.$message({
                message: res.body.message,
                type: 'success'
              });
            } else {
              self.$message.error(res.body.message);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      changeTable (val) {
        var self = this;

        self.tableOpt.language = val;
        self.getArticle(self.tableOpt);
      },
      changePlatform (val) {
        var self = this;

        self.tableOpt.platform = (val.index * 1 + 1) + '';
        self.getArticle(self.tableOpt);
      }
    }

  }
</script>
<style>

</style>


