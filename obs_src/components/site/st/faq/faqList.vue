<template>
  <div>
    <div class="el-container">
      <!-- <el-tabs class="full" active-name="1" @tab-click="changePlatform">
        <el-tab-pane v-for="(item, index) in platformOpt" :label="item" :name="index" :key="index"></el-tab-pane>
      </el-tabs> -->
      <el-row>
          <el-form :inline="true" label-width="100px">
            <!-- <el-form-item label="请选择语言">
              <el-select @change="changeTable" v-model="tableOpt.language">
                <el-option v-for="(item, index) in langOpt" :key="index" :label="item.language_ch"
                           :value="item.language_en" :selected="!index"></el-option>
              </el-select>
            </el-form-item> -->
            <div class="text-right">
                <el-button v-if="self.showAction_('admin/article/add')" type="primary" @click="articeDialog = true">添加文章
              </el-button>
              <el-button v-if="self.showAction_('admin/article-category/add')" type="primary" @click="updateDialog = true">
                添加分类
              </el-button>
            </div>
          </el-form>
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
                <i :class="{'el-icon-circle-check color-success': item.is_enable == '1', 'el-icon-circle-cross color-danger': item.is_enable == '0'}"></i>
              </td>
              <td>
                <router-link v-if="self.showAction_('admin/article/info')" :to="{path: '/site/faqSet', query: {id: item.id, platform: tableOpt.platform, language: tableOpt.language}}" class="el-button el-button--primary el-button--small">编辑
                </router-link>
                <el-button v-if="self.showAction_('admin/article/delete')" type="danger" size="small" @click="removeRow(item.id, index, _index)">删 除</el-button>
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
        <el-form-item label="排序" prop="order" required>
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
                <el-button type="primary" @click="addArticle" v-loading="addArtLoading" :disabled="addArtLoading">确 认</el-button>
                <el-button @click="articeDialog = false">取 消</el-button>
            </span>
    </el-dialog>
    <el-dialog title="添加分类" v-model="updateDialog" size="tiny">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
        <el-form-item label="文章分类" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order" required>
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
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px">
        <el-form-item label="文章分类" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order" required>
          <el-input v-model="editForm.order"></el-input>
        </el-form-item>
        <el-form-item label="是否底部显示">
          <el-radio class="radio" v-model="editForm.is_show_at_bottom" :label="1">显示</el-radio>
          <el-radio class="radio" v-model="editForm.is_show_at_bottom" :label="0">不显示</el-radio>
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
        let checkOrder = (rule, value, callback) => {
            if(Number.isInteger(value * 1) && value * 1 > 0) {
                callback();
            } else {
                callback(new Error('该项不能为空,且为大于0的整数'));
            }
        }
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
                title: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                content: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                order: [{validator: checkOrder, trigger: 'blur'}],
                cat_id: [{ required: true, message: '该项不能为空', trigger: 'change' }],
                is_enable: [{ required: true, message: '该项不能为空', trigger: 'change' }],
            },
            addFormRules: {
                name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                order: [{validator: checkOrder, trigger: 'blur'}],
            },
            editFormRules: {
                name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
                order: [{validator: checkOrder, trigger: 'blur'}],
            }
        };
    },
    created () {
      this.initData();
    },
    methods: {
      initData () {
        this.getCategory();
        this.getplatform();
        this.getLang();
        this.getArticle();
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
        this.$http.get('admin/public/platforms').then(res => {
          if (res.body.code === 0) {
            this.platformOpt = res.body.data;
          }
        });
      },
      getLang () {
        this.$http.get('admin/public/languages').then(res => {
          if (res.body.code === 0) {
            this.langOpt = res.body.data;
          }
        });
      },
      addClass () {
        let hasError = false;
        this.$refs.addForm.validate(valid => {
          if (!valid) {
            hasError = true;
            return false;
          }
        });
        if (hasError) {
          return;
        }

        this.tableOpt.name = this.addForm.name;
        this.tableOpt.order = this.addForm.order;
        this.tableOpt.is_show_at_bottom = this.addForm.is_show_at_bottom;

        this.addClassLoading = true;
        this.$http.post('admin/article-category/add', this.tableOpt).then(res => {
          this.addClassLoading = false;
          if (res.body.code == 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.getArticle(this.tableOpt);
            this.updateDialog = false;
          } else {
            this.$message.error(res.body.message);
            this.updateDialog = false;
          }
        });
      },
      addArticle () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.addArtLoading = true;
            this.$http.post('admin/article/add', this.articeForm).then(res => {
              this.addArtLoading = false;

              if (res.body.code == 0) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.getArticle(this.tableOpt);
                this.articeDialog = false;
              } else {
                this.$message.error(res.body.message);
                this.articeDialog = false;
              }
            });
          }
        });
      },
      editTitle (arr) {
        this.editForm.id = arr.id;
        this.editForm.name = arr.name;
        this.editForm.order = arr.order;
        this.editForm.is_show_at_bottom = arr.is_show_at_bottom;
        this.editTitleDialog = true;
      },
      postEditTitle () {
        let hasError = false;
        this.$refs.editForm.validate(valid => {
          if (!valid) {
            hasError = true;
            return false;
          }
        });
        if (hasError) {
          return;
        }
        this.$http.post('admin/article-category/edit', this.editForm).then(res => {
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
        this.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('admin/article/delete', {id: id}).then(res => {

            if (res.body.code == 0) {
              this.tableData[index].articles.splice(_index, 1);
              this.$message({
                message: res.body.message,
                type: 'success'
              });
            } else {
              this.$message.error(res.body.message);
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
        this.tableOpt.language = val;
        this.getArticle(this.tableOpt);
      },
      changePlatform (val) {
        this.tableOpt.platform = (val.index * 1 + 1) + '';
        this.getArticle(this.tableOpt);
      }
    }

  }
</script>
<style>

</style>


