<!--静态语言包管理-->
<template>
  <div class="el-container">
    <div class="el-sub-container">
       <el-tabs v-model="option.platform_id" type="card" @tab-click="handleClick" class="platform-tabs">
           <el-tab-pane label="PC" name="1"></el-tab-pane>
           <el-tab-pane label="M" name="2"></el-tab-pane>
           <el-tab-pane label="APP" name="3"></el-tab-pane>
       </el-tabs>
       <div class="langChange">
           <el-row>
              <el-col :span="2">
                <span>当前语言：</span>&nbsp;
                <span>{{ multiLangRes[option.lang] }}</span>
              </el-col>
              <el-col :span="2">
                  <el-select v-model="option.lang" placeholder="切换" @change="langChangeFun">
                    <el-option v-for="(item, index) in multiLangList" :key="item.index" :label="item.name" :value="item.lang"></el-option>
                  </el-select>
              </el-col>
           </el-row>
       </div>
      <div>
          <el-form :inline="true" :model="option">
              <el-form-item>
                  <el-select v-model="option.module" placeholder="请选择所属模块" clearable>
                      <el-option v-for="(item, index) in langModulesList" :key="item.index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <el-input v-model="option.remark" placeholder="请输入语言项说明"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-input v-model="option.en_content" placeholder="英语文案内容"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-input v-model="option.content" placeholder="当前语言前端显示内容"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-input v-model="option.page_type" placeholder="输入页面"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="option.is_trans" placeholder="请选择状态" clearable>
                    <el-option label="已处理" value="1"></el-option>
                    <el-option label="未处理" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchData">查询</el-button>
                <el-button type="primary" @click="newLangFun(option.lang, option.platform_id)" v-if="self.showAction_('admin/multiple-language/add')">新增</el-button>
              </el-form-item>
          </el-form>
      </div>
    </div>
    <table class="multi-table" cellpadding="0" cellspacing="0">
        <thead>
             <tr>
                <th>编号</th>
                <th>模块</th>
                <th>页面</th>
                <th>key</th>
                <th>
                    <el-checkbox v-model="allCheckbox" label="前端key" @change="allCheckboxChange"></el-checkbox>
                </th>
                <th>语言项说明</th>
                <th>状态</th>
                <th>英语</th>
                <th v-if="option.lang !=='en'">{{ multiLangRes[option.lang] }}</th>
                <th>最后操作人</th>
                <th>最后操作时间</th>
                <th>操作</th>
             </tr>
        </thead>
        <tbody>
            <tr v-for="(lang, index) in tableData" :key="index">
                <td width="5%" class="th-center"> {{ lang.id }} </td>
                <td width="5%"> {{ langModules[lang.module] }} </td>
                <td width="10%" class="th-center"> {{ lang.page_type }} </td>
                <td width="5%" :class="{ 'text-red' : (option.lang === 'en' && lang.contents[0].is_trans === 0) ||
                                           (option.lang !== 'en' && lang.contents[1] && lang.contents[1].is_trans === 0) }">
                    {{ lang.key_name }}
                </td>
                <td width="5%" class="th-center">
                    <input type="checkbox" v-model="lang.is_js" @change="is_js_change(lang, index)">&nbsp;&nbsp;前端key
                </td>
                <td width="10%">
                    {{ lang.remark }}
                </td>
                <td width="5%" class="th-center">
                    <span v-if="(option.lang ==='en' && lang.contents[0].is_trans === 1) || (option.lang !=='en' && lang.contents[1] && lang.contents[1].is_trans ===1)">已处理</span>
                    <span class="text-red" v-if="(option.lang ==='en' && lang.contents[0].is_trans ===0) || (option.lang !=='en' && lang.contents[1] && lang.contents[1].is_trans ===0)">未处理</span>
                </td>
                <td width="15%">
                    {{ lang.contents[0].content }}
                </td>
                <td v-if="option.lang !=='en'" width="15%">
                    <span v-if="lang.contents[1]"> {{ lang.contents[1].content }}</span>
                    <span v-if="!lang.contents[1]"></span>
                </td>
                <td width="10%" class="th-center">
                    <div v-if="option.lang ==='en'">
                         <span> {{ lang.contents[0].update_user || lang.contents[0].create_user }} </span>
                    </div>
                    <div v-if="option.lang !=='en'">
                        <span v-if="lang.contents[1]">{{ lang.contents[0].update_user || lang.contents[1].create_user }}</span>
                        <span v-if="!lang.contents[1]"></span>
                    </div>
                </td>
                <td width="10%" class="th-center">
                    <div v-if="option.lang === 'en' ">
                        <span>
                            {{ self.timeZone_(lang.contents[0].update_time, self.$store.getters.getTimeZone) ||
                               self.timeZone_(lang.contents[0].create_time, self.$store.getters.getTimeZone)
                            }}
                        </span>
                    </div>
                    <div v-if="option.lang !== 'en' ">
                       <span v-if="lang.contents[1]">
                            {{ self.timeZone_(lang.contents[1].update_time, self.$store.getters.getTimeZone) ||
                               self.timeZone_(lang.contents[1].create_time, self.$store.getters.getTimeZone)
                             }}
                       </span>
                       <span v-if="!lang.contents[1]"></span>
                    </div>
                </td>
                <td width="5%" class="th-center">
                    <el-button size="small" type="primary"  @click="langEdit(option.lang, lang)" v-if="self.showAction_('admin/multiple-language/edit')">修改</el-button>
                    <el-button size="small" type="danger"  @click="deleteLang(option.lang, lang)" v-if="self.showAction_('admin/multiple-language/delete')">删除</el-button>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="el-container last text-right">
      <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <!--弹窗start-->
    <el-dialog title="语言包编辑" :visible.sync="langDialogForm.dialogFormVisible" size="tiny">
      <el-form :model="langDialogForm" labelWidth="120px">
        <el-form-item label="当前语言：">
           <span> {{ multiLangRes[langDialogForm.lang] }}</span>
        </el-form-item>
          <el-form-item label="页面：">
              <el-input v-model="langDialogForm.page_type"></el-input>
          </el-form-item>
        <el-form-item label="语言项说明：">
           <el-input v-model="langDialogForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="是否是前端key：">
            <el-select v-model="langDialogForm.is_js">
                <el-option v-for="(item, index) in langDialogForm.is_jsList" :key="item.key" :label="item.label" :value="item.key"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="模块：">
           <span>{{ langDialogForm.moduleName }}</span>
        </el-form-item>
        <el-form-item label="母文本：" class="mother-lang">
           <span class="mother-lang-txt">{{ langDialogForm.motherText }}</span>
        </el-form-item>
        <el-form-item :label=" multiLangRes[langDialogForm.lang] + '：'">
           <el-input type="textarea" :rows="2" v-model="langDialogForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveLang">确 定</el-button>
        <el-button type="danger" @click="langDialogForm.dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增语言包" :visible.sync="newLangForm.dialogFormVisible" size="tiny" :before-Close="cancelNewLang">
          <el-form :model="langDialogForm" labelWidth="120px">
              <el-form-item label="模块：">
                  <el-select v-model="newLangForm.module" placeholder="请选择模块" clearable>
                      <el-option v-for="(item, index) in langModulesList" :key="item.index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="页面：">
                  <el-input v-model="newLangForm.page_type"></el-input>
              </el-form-item>
              <el-form-item label="key：">
                  <el-input v-model="newLangForm.key_name"></el-input>
              </el-form-item>
              <el-form-item label="前端key：">
                  <el-select v-model="newLangForm.is_js">
                      <el-option v-for="(item, index) in newLangForm.is_jsList" :key="item.key" :label="item.label" :value="item.key"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="语言项说明：">
                  <el-input v-model="newLangForm.remark"></el-input>
              </el-form-item>
              <el-form-item label="英语：" class="mother-lang">
                  <el-input type="textarea" :rows="2" v-model="newLangForm.motherText"></el-input>
              </el-form-item>
              <el-form-item :label=" multiLangRes[newLangForm.lang] + '：'" v-if = "newLangForm.lang !== 'en'">
                  <el-input type="textarea" :rows="2" v-model="newLangForm.content"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="saveNewLang">确 定</el-button>
              <el-button type="danger" @click="cancelNewLang">取 消</el-button>
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
        multiLangList: [],
        multiLangRes: [],
        langModules: {},
        langModulesList: [],
        option: {
          platform_id: '1',
          lang: this.$route.query.lang,
          module: '',
          remark: '',
          content: '',
            page_type: '',
          is_trans: '',
          en_content: '',
          page: 1,
          page_size: 10,
        },
        tableLoading: false,
        tableData: [],
        total: 0,
        allCheckbox: false,
        langDialogForm: {
          dialogFormVisible: false,
          id: '',
          remark: '',
            page_type: '',
          contend_id: '',
          content: '',
          lang: '',
          moduleName: '',
          motherText: '',
          is_js: '',
          is_jsList:[
              {key: 1, label: '是'},
              {key: 0, label: '否'}
          ]
        },

        newLangForm: {
            dialogFormVisible: false,
            platform: '',
            lang: '',
            module: '',
            key_name: '',
            page_type: '',
            is_js: '',
            remark: '',
            motherText: '',
            content: '',
            is_jsList:[
                {key: 1, label: '是'},
                {key: 0, label: '否'}
            ]
        },
      };
    },

    created () {
      this.getMultiLang();
      this.getLangModules();
      this.getData();
    },

    watch: {
        'option.en_content': function (val, oldval) {
            if (val) {
                this.option.content = '';
            }
        },
        'option.content': function (val, oldval) {
            if (val) {
                this.option.en_content = '';
            }
        }
    },

    methods: {
      cancelNewLang () {
            this.clearNewLangForm();
            this.newLangForm.dialogFormVisible = false;
        },

      clearNewLangForm () {
          this.newLangForm.module = '';
          this.newLangForm.page_type = '';
          this.newLangForm.key_name = '';
          this.newLangForm.is_js = '';
          this.newLangForm.remark = '';
          this.newLangForm.motherText = '';
          this.newLangForm.content = '';
      },

      saveNewLang () {
          let validateRes =  this.validateFun(this.newLangForm);
          if (!validateRes) {
              return false;
          }

          let params = {
              platform: this.newLangForm.platform,
              remark: this.newLangForm.remark,
              page_type: this.newLangForm.page_type,
              module: this.newLangForm.module,
              key_name: this.newLangForm.key_name,
              is_js: this.newLangForm.is_js,
              lang: ['en'],
              content: []
          };

          params.content.push(this.newLangForm.motherText);

          if (this.newLangForm.lang !== 'en') {
              params.lang.push(this.newLangForm.lang);
              params.content.push(this.newLangForm.content);
          }

          //console.log(params);
          this.$http.post('admin/multiple-language/add', params).then(res => {
              if (res.body.code === 0) {
                  this.$message.success("保存成功！");
                  this.getData();
                  this.newLangForm.dialogFormVisible = false;
              } else {
                 this.$message.error(res.body.message);
              }
          });
        },

      validateFun (form) {
          if (!form.module) {
              this.$message.error("请选择模块！");
              return false;
          }
          if (!form.key_name) {
              this.$message.error("请填写key！");
              return false;
          }
          if (form.is_js === '') {
              this.$message.error("请选择是否前端key！");
              return false;
          }
          if (!form.remark) {
              this.$message.error("请填写语言项说明！");
              return false;
          }
          if (!form.motherText) {
              this.$message.error("请填写英语内容！");
              return false;
          }
          if (form.lang !== 'en' && !form.content) {
              this.$message.error("请填写" +  this.multiLangRes[form.lang] + "内容！");
              return false;
          }
          return true;
        },

      newLangFun (lang, platform) {
          this.newLangForm.lang = lang;
          this.newLangForm.platform = platform;
          this.clearNewLangForm();
          this.newLangForm.dialogFormVisible = true;
        },

      is_js_change (lang, index) {
          this.$confirm('确定修改前端key?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              if (lang.is_js) {
                  this.tableData[index].is_js = 1;
              } else {
                  this.tableData[index].is_js = 0;
              }
              this.initAllCheckbox();

              let params = {
                  is_js: lang.is_js,
                  ids: lang.id
              };
              this.updateKeyState(params);
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消修改'
              });
              this.getData();
          });
        },

      initAllCheckbox () {
            let checkedCount = 0;
            this.tableData.forEach(item => {
                if (item.is_js === 1) {
                    checkedCount ++;
                }
            });

            if (this.option.page_size === checkedCount) {
                this.allCheckbox = true;
            } else {
                this.allCheckbox = false;
            }
        },

      allCheckboxChange () {

          this.$confirm('确定修改前端key?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {

              let params = {
                  is_js: '',
                  ids: ''
              };
              let tempArr = [];

              if (this.allCheckbox) {
                  this.tableData.forEach(item => {
                      item.is_js = 1;
                      params.is_js = 1;
                  });
              } else {
                  this.tableData.forEach(item => {
                      item.is_js = 0;
                      params.is_js = 0;
                  });
              }

              this.tableData.forEach(item => {
                  tempArr.push(item.id);
              });
              params.ids = tempArr.join();
              this.updateKeyState(params);

          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消修改'
              });
              this.initAllCheckbox();
          });
      },

      updateKeyState (params) {
          this.$http.post('admin/multiple-language/batch-change-js-status', params).then(res => {
              if (res.body.code ===0) {
                  this.$message.success('修改成功！');
                  this.getData();
              } else {
                  this.$message.error(res.body.message);
              }
          });
        },

      handleClick (tab, event) {
         //console.log(tab.name);
         this.langChangeFun();
      },

      getMultiLang () {
        this.$http.post('admin/public/languages').then(res => {
          if (res.body.code === 0 && res.body.data.length>0) {
            res.body.data.forEach(item => {
              this.multiLangList.push({lang: item.language_en, name: item.language_ch});
              this.multiLangRes[item.language_en] = item.language_ch;
            });
          }
        });
      },

      getLangModules () {
          this.$http.get('admin/public/multiple-lang-modules').then( res => {
              if (res.body.code === 0) {
                  this.langModules = res.body.data;
                  for (let key in this.langModules) {
                      this.langModulesList.push({ 'code': key, 'name': key + '=>' + this.langModules[key] });
                  }
              } else {
                  this.$message.error(res.body.message);
              }
          });
      },

      getData() {
        this.tableLoading = true;
        this.$http.get('admin/multiple-language/content-list', {params: this.option}).then( (res)  => {
          this.tableLoading = false;
          if (res.body.code === 0) {
             this.tableData = res.body.data.data;
             this.total = res.body.data.total;
             setTimeout(() => {
                 this.initAllCheckbox();
             },100);
          } else {
             this.tableData = [];
             this.$message.error(res.body.message);
          }
        });
      },

      searchData () {
          this.getData();
          this.option.page = 1;
      },

      langEdit (lang, row) {
         this.langDialogForm.dialogFormVisible = true;
         this.langDialogForm.id = row.id;
         this.langDialogForm.remark = row.remark;
         this.langDialogForm.page_type = row.page_type;
         this.langDialogForm.lang = lang;
         this.langDialogForm.motherText = row.contents[0].content;
         this.langDialogForm.is_js = row.is_js;
         let module = row.module;
         this.langModulesList.forEach(item => {
             if (module === item.code) {
                 this.langDialogForm.moduleName = item.name;
             }
         });
         if (lang === 'en') {
             this.langDialogForm.contend_id = row.contents[0].id;
             this.langDialogForm.content = row.contents[0].content;
         } else {
             this.langDialogForm.contend_id = (row.contents[1] && row.contents[1].id) || '';
             this.langDialogForm.content = (row.contents[1] && row.contents[1].content) || '';
         }
         //console.log(this.langDialogForm);
      },

      saveLang () {
          if (!this.langDialogForm.remark) {
              this.$message.error('请填写语言项说明！');
              return false;
          }
          if (!this.langDialogForm.content) {
              this.$message.error('请填写当前语言文案内容！');
              return false;
          }
          let params = {
              id: this.langDialogForm.id,
              remark: this.langDialogForm.remark,
              page_type: this.langDialogForm.page_type,
              contend_id: this.langDialogForm.contend_id,
              content: this.langDialogForm.content,
              lang: this.langDialogForm.lang,
              is_js: this.langDialogForm.is_js
          };
          //console.log(params);
          this.$http.post('admin/multiple-language/edit', params).then(res => {
              if (res.body.code ===0) {
                  this.$message.success('保存成功！');
                  this.getData();
                  this.langDialogForm.dialogFormVisible = false;
              } else {
                  this.$message.error(res.body.message);
              }
          });
          this.initAllCheckbox();
      },

        deleteLang(lang, row) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    id: row.id,
                };
                if (lang === 'en') {
                    params.content_id = row.contents[0].id;
                } else {
                    params.content_id = (row.contents[1] && row.contents[1].id) || '';
                }

                this.$http.get('admin/multiple-language/delete', {params: params}).then(res => {
                    if (res.body.code ===0) {
                        this.$message.success('删除成功！');
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            });
        },
      langChangeFun () {
          this.option.module = '';
          this.option.remark = '';
          this.option.content = '';
          this.option.is_trans = '';
          this.option.en_content = '';
          this.searchData();
      },

      ChangePage (val) {
        this.option.page = val;
        this.getData();
      },

      ChangePageSize (val) {
        this.option.page_size = val;
        this.getData();
      },
    }
  }
</script>

<style lang="less">
  .platform-tabs {
      .is-active {
          background: #00a0e9;
          color: #fff;
          font-weight: bold;
      }
  }
  .langChange {
     height: 36px;
     line-height: 36px;
     margin-bottom: 20px;
  }
  .text-red {
    color: red;
  }
  .mother-lang {
      .el-form-item__content {
          line-height: normal;
      }
      .mother-lang-txt {
          display: inline-block;
          margin-top: 10px;
      }
  }
  .multi-table { margin-bottom: 40px; width: 100%;
      &, th, td { border-collapse: collapse; border: 1px solid #dfe6ec; }
      th, td { padding: 8px 5px; }
      th { text-align: center; background: #eef1f6; }
      tbody tr{
          .th-center {
              text-align: center;
          }
      }
  }
</style>
