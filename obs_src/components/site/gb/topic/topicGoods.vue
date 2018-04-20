<!-- 专题商品 -->
<template>
  <div class="el-container topic-goods-list" v-loading="isDataLoading">
    <el-form inline :model="option" ref="option">
      <el-form-item label="所属平台" prop="platforms">
        <el-select v-model="option.platforms" clearable filterable class="w-150">
          <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道" prop="pipeline_code">
        <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
          <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语言" prop="lang">
        <el-select v-model="option.lang" clearable filterable>
          <el-option v-for="(item, index) in langOpt" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品状态">
        <el-select clearable v-model="option.goods_status" placeholder="请选择" class="w100">
          <el-option label="上架" value="2"></el-option>
          <el-option label="下架" value="1"></el-option>
        </el-select>
      </el-form-item>

      <!--<el-form-item label="专题名称" prop="special_id">
        <el-select v-model="option.special_id" clearable filterable>
          <el-option v-for="item in specialList" :key="item.id" :value="String(item.id)" :label="item.name"></el-option>
        </el-select>
      </el-form-item>-->

      <el-form-item label="专题ID" prop="special_id">
        <el-input v-model="option.special_id"></el-input>
      </el-form-item>
      <el-form-item label="专题版块" prop="position_type">
        <el-select v-model="option.position_type" clearable filterable>
          <el-option v-for="(item, index) in positionTypes" :label="item" :key="index" :value="index"></el-option>
        </el-select>
      </el-form-item>

      <!--<el-form-item label="" v-if="option.position_type == 'multiple_time_rush_to_purchase'">
          <el-select v-model="option.group" clearable :placeholder="!option.special_id ? '请先选择专题' : '请选择'" @change="handleSelectGroup">
              <el-option v-for="item in groupList" :label="item.groupTime" :value="item.group" :key="item.group"></el-option>
          </el-select>
      </el-form-item>-->

      <el-form-item label="SKU" prop="goods_sn">
        <el-input v-model="option.goods_sn" class="w-150"></el-input>
      </el-form-item>
      <div class="text-right el-sub-container">
        <el-button type="primary" @click="filterFormSubmit">筛选</el-button>
        <el-button type="danger" @click="resetForm">清空</el-button>
        <el-button type="danger" class="fl" :disabled="!multipleSelection.length" @click="remove(null, 'batch')" v-if="self.showAction_('admin/special-goods/delete')">批量删除</el-button>
        <el-button type="primary" class="fl" @click="copySKU('txt')">批量复制sku_仓id</el-button>
        <!-- 列表筛选 -->
        <el-popover ref="colPopo" placement="bottom" width="300" trigger="click">
          <div class="good-col-set">
            <el-checkbox-group v-model="colList">
              <el-checkbox label="wid">仓库</el-checkbox>
              <el-checkbox label="coupon">促销码</el-checkbox>
              <el-checkbox label="order">显示排序</el-checkbox>
              <el-checkbox label="goods_status">上下架</el-checkbox>
              <el-checkbox label="stock">实时可售库存</el-checkbox>
              <el-checkbox label="title">商品名称</el-checkbox>
              <el-checkbox label="image_url">商品图片</el-checkbox>
            </el-checkbox-group>
            <div class="el-sub-container text-center">
              <el-button type="primary" @click="saveTitle">保存选择</el-button>
            </div>
          </div>
        </el-popover>
        <el-button class="show-btn fr" type="primary" icon="setting" v-popover:colPopo>设置表格内容</el-button>
      </div>
    </el-form>

    <div class="el-sub-container">
      <el-table border :data="tableData" ref="dataTable" @selection-change="changeSelect" @row-click="clickRow">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column label="适用平台">
          <template scope="scope">
            <span>{{platforms[scope.row.position.platform]}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="专题是否启用">
          <template scope="scope">
            <div>{{ scope.row.is_end == 1 ? '否' : '是' }}</div>
          </template>
        </el-table-column>-->
        <!--<el-table-column label="专题名称" column-key="name">
          <template scope="scope">
            <router-link :to="{name: 'topic_topicEdit', query: {id: scope.row.special.id}}">
              {{scope.row.special.name}}{{ scope.row.special.is_end == 1 ? '（不启用）' : '' }}
            </router-link>
          </template>
        </el-table-column>-->
          <el-table-column label="专题版块">
              <template scope="scope">
                  <div>{{positionTypes[scope.row.position.type]}}</div>
              </template>
          </el-table-column>

        <!--<el-table-column label="板块名称PC + M">
          <template scope="scope">
            <div>{{scope.row.position.name}} <span v-if="scope.row.position.m_name.length > 0"> + </span> {{scope.row.position.m_name}}</div>
          </template>
        </el-table-column>-->

        <el-table-column label="分组(时间)" width="180">
          <template scope="scope">
            <div v-if="scope.row.group_info.group">
              <div>
                <span>组名:</span>
                {{scope.row.group_info.group}}
              </div>
              ({{self.timeZone_(scope.row.group_info.start_time, self.$store.getters.getTimeZone)}}
              <span> - </span>
              {{self.timeZone_(scope.row.group_info.end_time, self.$store.getters.getTimeZone)}})
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称" v-if="colList.indexOf('title') != -1"></el-table-column>
        <el-table-column prop="goods_sn" label="商品编码"></el-table-column>
        <!--<el-table-column prop="buy_gift_sku" label="sku"></el-table-column>-->
        <el-table-column label="商品图片" column-key="img" v-if="colList.indexOf('image_url') != -1">
          <template scope="scope">
            <a :href="scope.row.goods_url ? scope.row.goods_url : 'javascript:;'">
              <img class="table-img" :src="scope.row.image_url">
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="实时可售库存" v-if="colList.indexOf('stock') != -1"></el-table-column>
        <el-table-column prop="wid" label="仓库" v-if="colList.indexOf('wid') != -1"></el-table-column>
        <el-table-column label="上下架" width="130" v-if="colList.indexOf('goods_status') != -1">
          <template scope="scope">
            <p v-for="(item, index) in scope.row.goods_status_list">{{index}}: {{item == 2 ? '上架' : '下架'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="配件">
          <template scope="scope">
            <div>{{scope.row.accessories_sku ? scope.row.accessories_sku : '无'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="促销码" v-if="colList.indexOf('coupon') != -1">
          <template scope="scope">
            <div>{{scope.row.coupon ? scope.row.coupon : '无'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="渠道">
          <template scope="scope">
            <span>{{pipeOpt[scope.row.special.pipeline_code]}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="语言">
          <template scope="scope">
            <span>{{ self.langOpts[scope.row.special.lang] ? self.langOpts[scope.row.special.lang] : scope.row.special.lang }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="显示排序" v-if="colList.indexOf('order') != -1" column-key="order">
          <template scope="scope">
            <span v-show="!scope.row.showEdit" @click="scope.row.showEdit = true">{{scope.row.order}}</span>
            <el-input v-show="scope.row.showEdit" v-model="scope.row.order" @blur="saveOrder(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" column-key="handle">
          <template scope="scope">
            <!--<el-button type="primary" size="small" @click="goEdit(scope.row)">编辑</el-button>-->
            <el-button type="danger" size="small" @click="remove(scope.row)" v-if="self.showAction_('admin/special-goods/delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="el-sub-container text-right">
        <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!--  -->
    <input id="txt" v-model="txt" class="hidden-input">
  </div>
  <!-- 弹窗S -->
  <!-- 弹窗E -->
</template>

<script>
  export default {
    data() {
      return {
        self: this,
        tableData: [],
        dialogData: [],
        isDataLoading: false,
        editDialog: false,
        addgoodsDialog: false,
        option: {
          platforms: '',
          special_id: '',
          position_type: '',
          //group: '',
          goods_sn: '',
          goods_sns: '',
          pipeline_code: '',
          lang: '',
          goods_status: '',
          pageNo: 1,
          pageSize: 10,
        },
        groupList: [],
        total: 0,
        platforms: {},
        removeList: '',
        specialList: [],
        positionList: [],
        searchForm: {
          goods: ''
        },
        addForm: {
          selectedSpecialId: '',
          position_id: ''
        },
        positionTypes: {},
        // 表格选项
        colList: [],
        select: [],
        txt: '',
        multipleSelection: [],
        langOpts: {},
        langOpt: {},
      };
    },
    computed: {
      pipeOpt() {
        return this.$store.getters.getPipe.obj;
      }
    },
    created() {
      this.getOpt();
      this.getAllSpecial();
      this.getSpecialPositionTypes();
    },
    methods: {
      getOpt() {
        // 语言下拉
        this.$http.get('admin/public/languages').then(res => {
          if (res.body.code === 0) {
            this.langOpt = res.body.data;
            let obj = {};
            this.langOpt.forEach(item => {
              obj[item.language_en] = item.language_ch;
            });
            this.$set(this, 'langOpts', obj);
          } else {
            this.$message.error(res.body.message);
          }
        });


        this.getData();
      },
      getData() {
        this.isDataLoading = true;
        this.$http.get('admin/special-goods/list', {params: this.option}).then(res => {
          if (res.body.code !== 0) {
            this.$message.error(res.body.message);
            return false;
          }
          this.getTitle();
          this.total = 0;
          this.tableData = [];
          this.isDataLoading = false;
          if (res.body.code != 0) {
            this.$message.error(res.body.message)
            return;
          }
          let data = res.body.data;
          this.total = data.total * 1;
          this.platforms = data.platforms;
          data.data.forEach(item => {
            item.showEdit = false;
          });

          //this.tableData = data.data;

          Array.isArray(data.data) && data.data.forEach(item => {
            let arr = item.special.platforms.split(',');
            let str = '';

            for (let i = 0, len = arr.length; i < len; i++) {
              str += this.platforms[arr[i]] ? ', ' + this.platforms[arr[i]] : '';
            }
            item.special.platforms = str.slice(1);

            //筛选上下架,2为上架，其他均视为下架
            if(this.option.goods_status !== ''){
              let tag = false;
              for (let key in item.goods_status_list){
                //上架
                if(this.option.goods_status == 2 && this.option.goods_status == item.goods_status_list[key]){
                  tag = true;
                  break;
                }
                //下架
                if(this.option.goods_status == 1 && item.goods_status_list[key] != 2){
                  tag = true;
                  break;
                }
              }
              if(tag){
                this.tableData.push(item);
              }
            }else{
              this.tableData.push(item);
            }
          });
        }).catch(err => {

        });
      },
      // 获取板块类型
      getSpecialPositionTypes() {
        this.$http.get('admin/public/special-position-options').then(res => {
          if (res.body.code !== 0) {
            this.$message.error(res.body.message);
            return;
          }
          this.positionTypes = res.body.data;
        });
      },
      // 获取所有专题
      getAllSpecial() {
        this.$http.get('admin/public/all-special-options').then(res => {
          if (res.body.code !== 0) {
            this.$message.error(res.body.message);
            return;
          }
          this.specialList = res.body.data;
        });
      },

      // 获取专题时段信息
      /*
      getSpecialGroup() {
          let self = this;
          let id = this.option.special_id;
          this.groupList = [];
          this.option.goods_sns = '';
          this.$http.get('admin/special/info', {params: {id}}).then(res => {
              console.log(res.body);
              if (res.body.code != 0 || !Array.isArray(res.body.data.positions)) {
                  return;
              }
              res.body.data.positions.some(item => {
                  if (item.type !== 'multiple_time_rush_to_purchase' || item.type !== 'multiple_goods_rush_to_purchase' || !Array.isArray(item.goods)) {
                      return false;
                  }
                  item.goods.forEach(item2 => {
                      let time = self.timeZone_(item2.end_time, self.$store.getters.getTimeZone);
                      this.groupList.push(Object.assign({}, item2, {groupTime: item2.group + ' - ' + time}));
                      this.option.goods_sns += ',' + item2.goods;
                  });
              });
          });
      },
      */

      // page
      ChangePage (val) {
        this.option.pageNo = val;
        this.getData();
      },
      ChangePageSize (val) {
        this.option.pageSize = val;
        this.getData();
      },
      filterFormSubmit() {
        this.option.pageNo = 1;
        this.getData();
      },
      resetForm() {
        for (let item in this.option) {
          if (item === 'pageNo' || item === 'pageSize') {
            continue;
          }
          this.option[item] = '';
        }
      },

      // 获取多时段抢购版块信息
      /*
      getInfo() {
          if (this.option.position_type === 'multiple_time_rush_to_purchase' || this.option.position_type === 'multiple_goods_rush_to_purchase') {
              this.getSpecialGroup();
          }
      },
      */

      // 选择多时段分组
      handleSelectGroup(val) {
        this.option.goods_sns = '';
        this.groupList.forEach(item => {
          if (!val) {
            this.option.goods_sns += ',' + item.goods;
          } else if (item.group === val) {
            this.option.goods_sns = item.goods;
          }
        });
      },
      // 获取列表筛选项
      getTitle() {
        let user = this.$store.getters.getUserName;
        let site = this.$store.getters.getSite;
        let code = user + '_topic_' + site;
        if (localStorage[code]) {
          this.colList = JSON.parse(localStorage[code]);
        }
      },
      // 保存列表筛选项
      saveTitle() {
        let user = this.$store.getters.getUserName;
        let site = this.$store.getters.getSite;
        let code = user + '_topic_' + site;
        localStorage[code] = JSON.stringify(this.colList);
        this.$message.success('已保存当前列表项选择');
      },
      saveOrder(row) {
        let order = row.order * 1;

        if (Number.isInteger(order) && order >= 0 && order < 100) {
        } else {
          this.$message.error('排序值位0-99的整数');
          return;
        }
        this.$http.post('admin/special-goods/update-order', {id: row.id, order: order}).then(res => {
          if (res.body.code === 0) {
            this.$message({
              type: 'success',
              message: res.body.message
            });
          } else {
            this.$message.error(res.body.message);
          }
        });
        row.showEdit = false;
      },
      remove(row, type) {
        let id;
        if (type == 'batch') {
          let temp = [];
          this.select.forEach(item => {
            temp.push(item.id);
          });
          id = temp.join(',');
        } else {
          id = row.id;
        }
        this.$confirm('确认删除?', '提示').then(() => {
          this.$http.post('admin/special-goods/delete', {id: id}).then(res => {
            if (res.body.code === 0) {
              this.$message.success(res.body.message);
              this.getData();
            } else {
              this.$message.error(res.body.message);
            }
          })
        }).catch(err => {

        });
      },
      // 0.8
      goEdit(row) {
        this.$router.push({
          name: 'topic_topicEdit',
          query: {
            id: row.special_id
          }
        })
      },
      changeSelect(val) {
        this.multipleSelection = val;
        var tempSku = [];

        for (var i in val) {
          tempSku.push(val[i].goods_sn + '_' + val[i].wid);
        }

        this.txt = tempSku.join(',');
        this.select = val;
      },
      clickRow(row, event, col) {
        if (col.columnKey !== 'handle' && col.columnKey !== 'order' && col.columnKey !== 'img' && col.columnKey !== 'name') {
          this.$refs.dataTable.toggleRowSelection(row);
        }
      },
      copySKU(txtId) {
        if (this.txt == '') {
          this.$message({
            type: 'warning',
            message: '至少选择一项！'
          });
        } else {
          var cpt = document.getElementById(txtId);
          cpt.value = this.txt;
          cpt.select();
          try {
            if (document.execCommand('copy', false, null)) {
              this.$message({
                type: 'success',
                message: '已复制所选SKU'
              });
            } else {
              this.$message({
                type: 'warning',
                message: '浏览器不可用复制'
              });
            }
          } catch (err) {
            this.$message.error(err);
          }
        }
      },
    }
  }
</script>

<style lang="less" scope>
  .good-col-set {
    .el-checkbox {
      display: block;
      margin-left: 15px;
    }
  }

  .topic-goods-list {
    .show-btn {
      margin-left: 10px;
    }

    .w-100 {
      width: 100px;
    }
    .w-150 {
      width: 150px;
    }
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

    .ac-ctrl-wrap {
      display: block;
      position: relative;

      .el-icon-circle-close {
        visibility: hidden;
        z-index: 5;
      }

      .el-input {
        z-index: 2;
      }

      input {
        background: none;
      }

      > i {
        position: absolute;
        top: 50%;
        right: 10px;
        margin-top: 2px;
        transform: translateY(-50%);
        color: #bfcbd9;
        font-size: 12px;
        z-index: 1;
      }

      &:hover {
        > i {
          visibility: hidden;
        }
        .el-icon-circle-close {
          visibility: visible;
        }
      }
    }
  }

  .add-goods-dlg {
    .ipt-add-sku {
      min-width: 500px;
    }
  }

  .w100 {
    width: 100px;
  }
</style>

