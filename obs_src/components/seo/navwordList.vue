<!-- 导购词推荐 -->
<template>
  <div>
    <div class="el-container">
      <el-form inline :model="option" ref="searchForm">
          <el-form-item label="语言" prop="lang">
              <el-select clearable filterable v-model="option.lang" placeholder="请选择">
                  <el-option v-for="value in langOpt" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="渠道" prop="pipeline_code">
              <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                  <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
              </el-select>
          </el-form-item>
        <el-form-item label="所属平台" prop="platform">
          <el-select clearable v-model="option.platform">
            <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
          </el-select>
        </el-form-item>
<!--         <el-form-item label="显示位置" prop="position">
          <el-select clearable v-model="option.position">
            <el-option v-for="(item, index) in positionList" :value="index" :label="item" :key="index"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="option.position == 'category' || option.position == 'category_search'" label="所属分类" class="date-item" prop="cat_id">
          <el-select clearable v-model="option.cat_id" filterable>
            <el-option v-for="item in catList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示状态" prop="is_show">
            <el-select clearable v-model="option.is_show" class="w-150">
                <el-option value="0" label="不显示"></el-option>
                <el-option value="1" label="显示"></el-option>
            </el-select>
        </el-form-item>
        <div>
            <el-form-item label="更新时间" class="date-item" prop="create_time">
                <el-date-picker v-model="option.create_time" type="datetimerange" :editable="false"></el-date-picker>
            </el-form-item>
        </div>
        <div class="text-right">
            <el-button type="primary" @click="getData">筛选</el-button>
            <el-button type="danger" @click="resetForm">清空</el-button>
        </div>
      </el-form>
    </div>
    <div class="el-container">
        <div class="el-sub-container text-right">
            <el-button type="primary" @click="handleBtnAddClick" v-if="self.showAction_('seo/trend/add')">添加导购词信息</el-button>
        </div>
        <el-table border :data="tableData" v-loading="tableLoading">
            <el-table-column prop="platform" label="平台">
                <template scope="scope">
                    {{platforms[scope.row.platform]}}
                </template>
            </el-table-column>
            <!-- <el-table-column prop="position_text" label="显示位置"></el-table-column> -->
            <el-table-column prop="keywords" label="名称"></el-table-column>
            <el-table-column prop="language" label="语言"></el-table-column>
            <el-table-column label="渠道">
                <template scope="scope">
                    <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="redirect_url" label="链接" width="400px"></el-table-column>
            <el-table-column prop="cat_name" label="所属分类"></el-table-column>
            <el-table-column prop="order" label="排序号"></el-table-column>
            <el-table-column label="显示状态">
                <template scope="scope">
                    <el-button type="text" @click="changeState(scope.row)">
                        <i :class="{'el-icon-circle-check color-success': scope.row.is_show == '1', 'el-icon-circle-cross color-danger': scope.row.is_show == '0'}"></i>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="更新时间" width="190px">
                <template scope="scope">
                    {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="handleBtnEditClick(scope.row)" v-if="self.showAction_('seo/trend/edit')">编辑</el-button>
                    &nbsp;
                    <el-button type="danger" size="small" @click="remove(scope.row)" v-if="self.showAction_('seo/trend/delete')">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>

    <!-- 弹窗S -->
    <el-dialog :title="title" v-model="editDlg.isDlgShow">
        <el-form :model="editDlg" :rules="editDlgRules" ref="editForm" label-width="140px">
            <el-form-item label="平台" prop="platform">
                <el-select v-model="editDlg.platform" @change="changePlat">
                    <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="语言" prop="lang">
                <el-select v-model="editDlg.lang">
                    <el-option v-for="(item, index) in langSeletion" :key="index" :label="item.language_ch" :value="item.language_en"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select v-model="editDlg.pipeline_code" placeholder="请选择">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="导购词" prop="keywords">
                <el-input v-model="editDlg.keywords"></el-input>
            </el-form-item>
            <el-form-item label="链接地址/deeplink" prop="redirect_url">
                <!--<el-input v-model="editDlg.redirect_url" placeholder="请输入以http或https开头的完整url"></el-input>-->
                <el-autocomplete popper-class="my-autocomplete" v-model="editDlg.redirect_url" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" icon="circle-close" :on-icon-click="handleIconClick"></el-autocomplete>
            </el-form-item>
<!--             <el-form-item label="显示位置" prop="position">
                <el-select v-model="editDlg.position">
                    <el-option v-for="(item, index) in positionList" :value="index" :label="item" :key="index"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="所属分类" prop="cat_id" :rules="[{validator: checkNum}]">
                <el-select v-model="editDlg.cat_id" filterable>
                    <el-option v-for="item in catList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="排序号" prop="order" required>
                <el-input v-model="editDlg.order"></el-input>
            </el-form-item>
            <el-form-item label="显示状态" prop="is_show">
                <el-radio-group v-model="editDlg.is_show">
                    <el-radio class="radio" :label="1">启用</el-radio>
                    <el-radio class="radio" :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="default" @click="editDlg.isDlgShow = false">取消</el-button>
            <el-button type="primary" v-loading="editDlg.isLoading" :disabled="editDlg.isLoading" @click="submitDlg">确定</el-button>
        </span>
    </el-dialog>
    <!-- 弹窗E -->
  </div>
</template>

<script>

  export default {
    data () {
      let checkOrder = (rule, value, callback) => {
        if (value && Number.isInteger(value * 1) && value * 1 >= 0) {
          callback();
        } else {
          callback(new Error('排序必须为大于等于0的整数'))
        }
      }

      let checkNum = (rule, value, callback) => {
          if ((value && Number(value)) || value === 0) {
              callback();
          } else {
              callback(new Error('该项不能为空'));
          }
      }
      return {
        checkNum: checkNum,
        title: '添加导购词',
        self: this,
        openFlag: false,
        tableLoading: true,
        tableData: [],
        option: {
          platform: '',
          keywords: '',
          classify: '',
          size: 20,
          page: 1,
          create_time: [],
          cat_id: '',
          // position: '',
          is_show: '',
          lang: '',
            pipeline_code: '',
        },
        total: 10,
        platforms: [],
        catList: [],
        // positionList: {
        //   index: '首页',
        //   category: '分类页',
        // },
        langOpt: {},
        langSeletion: {},
        language: '',
        editDlg: {
          isDlgShow: false,
          isLoading: false,
          isAdd: true,
          index: -1,
          platform: '',
          lang: '',
            pipeline_code: '',
          is_show: '',
          order: '',
          redirect_url: '',
          // position: '',
          cat_id: '',
          keywords: ''
        },
        editDlgRules: {
          //redirect_url: [{type: 'url', required: true, message: '请输入正确的http格式', trigger: 'blur'}],
          keywords: [{required: true, message: '该项不能为空', trigger: 'blur'}],
          order: [{validator: checkOrder, trigger: 'blur'}],
          lang: [{required: true, message: '该项不能为空', trigger: 'change'}],
            pipeline_code: [{required: true, message: '该项不能为空', trigger: 'change'}],
          platform: [{required: true, message: '该项不能为空', trigger: 'change'}],
          // position: [{required: true, message: '该项不能为空', trigger: 'change'}],
          is_show: [{validator: checkNum}],
        },
          deeplinks: []
      };
    },
      computed: {
          pipeOpt() {
              return this.$store.getters.getPipe.obj;
          }
      },
    created () {
      this.initData();
        this.deeplinks = this.$store.getters.getDeeplink;
    },
    methods: {
      initData () {
        Promise.all([this.$http.get('admin/public/platforms'), this.$http.get('admin/public/languages'), this.$http.get('seo/public/category-all')]).then((res) => {
            let flag = true;
            for (let i in res) {
                let code = res[i].body.code;
                if (code != 0) {
                    flag = false;
                    this.$message.error(res[i].body.message);
                    break;
                }
            }
            if (!flag) {
                return false;
            }

            this.platforms = res[0].body.data;

            let temp = {};
            let langOpt = res[1].body.data;
            for (let i in langOpt) {
                let item = langOpt[i];
                temp[item.language_en] = item;
            }
            this.langOpt = temp;
            // this.positionList = res[3].body.data;
            let data = res[2].body.data;
            data[0] = {
              id: 0,
              name: '暂无分类'
            }
            this.catList = data;
            this.getData();
        })
      },
      getData () {
        let timeArr = this.timeZone_(this.option.create_time, this.$store.getters.getTimeZone);
        this.option.start_time = timeArr[0];
        this.option.end_time = timeArr[1];

        let params = {};
        for (let i in this.option) {
          if (i !== 'create_time') {
            params[i] = this.option[i];
          }
        }

        this.tableLoading = true;
        this.$http.get('seo/trend/list', {params: params}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            let data = res.body.data.data;
            for (let item in data) {
              let cat = data[item].cat_id * 1;

              if (typeof this.catList[cat] == 'undefined') {
                data[item].cat_name = '未知分类'
              } else if (cat !== 0) {
                data[item].cat_name = this.catList[cat].name;
              } else {
                data[item].cat_name = '暂无分类';
              }
            }
            this.total = res.body.data.total;
            data.forEach(row => {
                if (this.langOpt[row.lang]) {
                    row.language = this.langOpt[row.lang].language_ch;
                } else {
                    row.language = row.lang;
                }
            });
            this.tableData = data;
          }
        }).catch(err => {
          this.tableLoading = false;
        });
      },
      changeState (row) {
        var params = {};

        for (var i in row) {
          params[i] = row[i];
        }

        if (row.is_show === 0) {
          params.is_show = 1;
        } else {
          params.is_show = 0;
        }

        this.$http.post('seo/trend/edit', params).then(res => {
          if (res.body.code === 0) {
            this.$message({
              message: res.body.message,
              type: 'success'
            });
            row.is_show = params.is_show;
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
      remove (row) {
        this.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('seo/trend/delete', {id: row.id}).then(res => {
            if (res.body.code == 0) {
              var index = this.tableData.indexOf(row);

              this.tableData.splice(index, 1);
              this.$message({
                message: res.body.message,
                type: 'success'
              });
              this.total--;
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
      ChangePage (val) {
        this.option.page = val;
        this.getData();
      },
      ChangePageSize (val) {
        this.option.size = val;
        this.getData();
      },
      goback () {
        history.back();
      },
      resetForm () {
        this.$refs['searchForm'].resetFields();
        this.option.cat_id = '';
      },

      handleBtnAddClick () {
        this.title = '添加导购词';
        this.editDlg.isDlgShow = true;
        this.editDlg.isAdd = true;
        this.editDlg.index = -1;
        this.editDlg.id = -1;
        this.$nextTick(() => {
            this.$refs['editForm'].resetFields();
        });
      },
      handleBtnEditClick(row) {
        this.title = '编辑导购词';
        let index = this.tableData.indexOf(row);
        if (row.id < 0) {
          return;
        }
        this.editDlg.isAdd = false;
        this.editDlg.isDlgShow = true;
        this.editDlg.index = index;
        this.openFlag = true;

        this.$nextTick(() => {
            this.$refs['editForm'].resetFields();
            for (let key in row) {
                this.editDlg[key] = row[key];
            }
        });
      },
      changePlat (val) {
        if (!this.openFlag) {
            this.editDlg.lang = '';
        }
        this.$http.get('admin/public/languages').then(res => {
            if (res.body.code === 0) {
                this.langSeletion = res.body.data;
                this.openFlag = false;
            } else {
                this.$message.error(res.body.message);
            }
        });
      },
      submitDlg () {
        this.editDlg.isLoading = true;

        let hasError = false;
        let params = Object.assign({}, this.editDlg);
        let isAdd = params.isAdd;
        let index = params.index;
        this.$refs['editForm'].validate((valid) => {
          if (!valid) {
            hasError = true;
            this.editDlg.isLoading = false;
            return false;
          }
        });
        if (hasError) {
          return;
        }
        if (isAdd) {
          delete params.id;
        } else if (params.id < 0) {
          return;
        }
        delete params.isLoading;
        delete params.isDlgShow;
        delete params.isAdd;
        delete params.index;
        delete params.create_time;
        delete params.update_time;
        delete params.position_text;
        delete params.cat_name;
        delete params.language;


        this.$http.post('seo/trend/' + (isAdd ? 'add' : 'edit'), params).then(res => {
            this.editDlg.isLoading = false;
            if (res.body.code !== 0) {
                this.$message.error(res.body.message || '失败');
                  return;
            }
            this.editDlg.isDlgShow = false;
            this.$message.success(res.body.message || '成功');

            this.getData();
        }).catch(err => {
            this.editDlg.isLoading = false;
            this.$message.error(err.body.message || '发生错误');
        });
      },
        querySearch(queryString, cb) {
            let items = this.deeplinks;
            let results = null;
            results = queryString ? items.filter(this.createFilter(queryString)) : items;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        handleSelect(item) {
            this.editDlg.redirect_url = item.url;
        },
        handleIconClick() {
            this.editDlg.redirect_url = '';
        }
    }

  }
</script>

<style lang="less">
  table .el-icon-circle-cross {
    cursor: pointer;
  }
</style>


