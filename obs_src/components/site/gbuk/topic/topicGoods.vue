<template>
  <div>
    <el-breadcrumb separator="/" class="el-container top">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/topic/topicList'}">专题管理</el-breadcrumb-item>
      <el-breadcrumb-item>专题商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="el-container">
      <el-form inline label-width="100px" :model="option" ref="option">
        <el-form-item label="专题平台" prop="platforms">
          <el-select v-model="option.platforms">
            <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专题名称" prop="special_name">
          <el-input v-model="option.special_name"></el-input>
        </el-form-item>
        <el-form-item label="商品SKU" prop="goods_sn">
          <el-input v-model="option.goods_sn"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button type="primary" @click="render">筛选</el-button>
        <el-button type="danger" @click="resetForm">清空</el-button>
        <el-button type="primary" @click="addGood">添加商品</el-button>
        <el-button type="danger" @click="removeGood(removeList)">批量删除</el-button>
      </div>
    </div>
    <div class="el-container">
      <el-table border :data="tableData" @selection-change="changeRemoveList" @row-click="clickRow" ref="dataTable">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="商品id"></el-table-column>
        <el-table-column prop="title" label="商品名称"></el-table-column>
        <el-table-column prop="goods_sn" label="sku"></el-table-column>
        <el-table-column label="商品图片">
          <template scope="scope">
            <a :href="scope.row.goods_url"><img class="table-img" :src="scope.row.image_url"></a>
          </template>
        </el-table-column>
        <el-table-column label="专题名称">
          <template scope="scope">
            <router-link :to="{name: 'topic_topicEdit', query: {id: scope.row.special.id}}">{{scope.row.special.name}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="适用平台">
          <template scope="scope">
            <span>{{scope.row.special.platforms}}</span>
          </template>
        </el-table-column>
        <el-table-column label="显示排序">
          <template scope="scope">
            <span v-show="!scope.row.showEdit">{{scope.row.order}}</span>
            <el-input v-show="scope.row.showEdit" v-model="scope.row.order"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="handle">
          <template scope="scope">
            <el-button size="small" type="danger" @click="removeGood(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="el-sub-container text-right">
        <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="1"
                       :page-sizes="[20, 50]" layout="total, sizes, prev, pager, next, jumper"
                       :page-size="option.page_size" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 弹窗S -->
    <!-- 添加商品 -->
    <el-dialog v-model="addgoodsDialog" size="large">
      <el-row>
        <el-form label-width="100px">
          <el-col :span="4">
            <el-form-item label="选择专题">
              <el-select @change="changeSpecial" v-model="defaultSpecial">
                <el-option v-for="item in specialList" :value="item" :label="item.name" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="选择版块">
              <el-select v-model="addForm.position_id">
                <el-option v-for="item in positionList" :value="item.id" :label="item.name" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="添加商品">
              <el-input v-model="searchForm.goods" placeholder="请输入/粘贴多个SKU用英文&quot;,&quot;隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button type="primary" @click="search">查找</el-button>
          </el-col>
        </el-form>
      </el-row>
      <el-table border :data="dialogData" @selection-change="changeGoodList">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="title" label="商品名称"></el-table-column>
        <el-table-column prop="goods_sn" label="sku"></el-table-column>
        <el-table-column label="商品图片">
          <template scope="scope">
            <a :href="scope.row.goods_url"><img class="table-img" :src="scope.row.image_url"></a>
          </template>
        </el-table-column>
        <el-table-column prop="cat_name" label="商品分类"></el-table-column>
        <el-table-column label="显示排序">
          <template scope="scope">
            <span v-show="!scope.row.showEdit">{{scope.row.order}}</span>
            <el-input v-show="scope.row.showEdit" v-model="scope.row.order"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="inventory" label="库存"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button v-show="!scope.row.showEdit" size="small" type="primary" @click="scope.row.showEdit = true">编辑
            </el-button>
            <el-button v-show="scope.row.showEdit" size="small" type="primary" @click="scope.row.showEdit = false">保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addGoodBtn">添 加</el-button>
                <el-button @click.native="addgoodsDialog = false">取 消</el-button>
            </span>
    </el-dialog>
    <!-- 编辑 -->
    <!-- 弹窗E -->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableData: [],
        dialogData: [],
        editDialog: false,
        addgoodsDialog: false,
        option: {
          platforms: '',
          special_name: '',
          goods_sn: '',
          page: 1,
          page_size: 20
        },
        defaultSpecial: '',
        total: 0,
        platforms: {},
        removeList: '',
        specialList: [],
        positionList: [],
        searchForm: {
          goods: ''
        },
        addForm: {
          position_id: ''
        }
      };
    },
    created () {
      this.getData();
    },
    methods: {
      getData () {
        this.$http.get('admin/special-goods/list', {params: this.option}).then(res => {
          this.total = res.body.data.total * 1;
          this.platforms = res.body.data.platforms;
          this.tableData = res.body.data.data;
        })
      },
      ChangePage (val) {
        this.option.page = val;
        this.getData();
      },
      ChangePageSize (val) {
        this.option.page_size = val;
        this.getData();
      },
      render () {
        this.getData();
      },
      resetForm () {
        this.$refs.option.resetFields();
      },
      changeRemoveList (val) {
        var temp = [];

        for (var i in val) {
          temp.push(val[i].id);
        }

        this.removeList = temp.join(',');
      },
      clickRow (row, event, col) {
        if (col.columnKey != 'handle') {
          this.$refs.dataTable.toggleRowSelection(row);
        }
      },
      changeGoodList (val) {
        var temp = [];

        for (var i in val) {
          var item = this.dialogData.indexOf(val[i]);
          temp.push(item);
        }

        this.addForm.goodList = temp;
      },
      removeGood (row) {
        var self = this;
        var notice;
        var id;

        if (typeof row == 'string') {
          if (row == '') {
            self.$message({
              type: 'warning',
              message: '未选中任何项！'
            });
            return false;
          } else {
            notice = '是否删除选中项？'
            id = row;
          }
        } else if (typeof row == 'object') {
          notice = '是否删除该项？';
          id = row.id;
        }

        self.$confirm(notice, '提示', {
          type: 'warning'
        }).then(() => {
          self.$http.post('admin/special-goods/delete', {id: id}).then(res => {
            if (res.body.code == 0) {
              if (typeof row == 'string') {
                this.getData();
              } else {
                var index = self.tableData.indexOf(row);
                self.tableData.splice(index, 1);
              }

              self.$message({
                type: 'success',
                message: res.body.message
              });
            } else {
              self.$message.error(res.body.message);
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      addGood () {
        this.$http.get('admin/special/list').then(res => {
          this.specialList = res.body.data;
        })
        this.addgoodsDialog = true;
      },
      search () {
        this.$http.get('admin/special-goods/search', {params: this.searchForm}).then(res => {
          var j = 0;
          var temp = [];
          for (var i in res.body.data) {
            temp[j] = res.body.data[i];
            temp[j].showEdit = false;
            j++;
          }
          this.dialogData = temp;
          this.addForm.goodList = [];
        })
      },
      changeSpecial (val) {
        this.positionList = val.positions;
        this.addForm.position_id = '';
      },
      addGoodBtn () {
        if (this.addForm.position_id) {
          var self = this;
          var temp = [];
          var data = this.dialogData;
          var originData = this.addForm.goodList;

          for (var i in originData) {
            var index = originData[i];
            var item = data[index].goods_sn + '|' + data[index].order;
            temp.push(item);
          }

          this.addForm.goods = temp.join(',');

          var params = {};
          params.goods = this.addForm.goods;
          params.position_id = this.addForm.position_id;

          this.$http.post('admin/special-goods/add', params).then(res => {
            if (res.body.code == 0) {

              this.getData();
              this.addgoodsDialog = false;
              self.$message({
                type: 'success',
                message: res.body.message
              });
              this.addForm.position_id = '';
            } else {
              self.$message.error(res.body.message);
            }
          })
        } else {
          this.$message.warning('版块不能为空')
        }


      }
    }
  }
</script>

<style>
  .text-box {
    line-height: 50px;
    padding-left: 35px
  }

  .text-box img {
    width: 50px;
    height: 50px;
  }

  .table-img {
    width: 100px;
    height: 100px;
    margin: 7px auto;
  }
</style>

