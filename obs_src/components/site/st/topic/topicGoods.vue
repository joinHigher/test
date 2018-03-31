<template>
  <div>
    <div class="el-container topic-goods-list" v-loading="isDataLoading">
      <el-form inline :model="option" ref="option">
        <el-form-item label="专题平台" prop="platforms">
          <el-select v-model="option.platforms" clearable class="w-150">
            <el-option v-for="(item, index) in platforms" :label="item" :value="index" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专题名称" prop="special_name">
          <!-- <el-input v-model="option.special_name"></el-input> -->
          <!-- <el-select @change="changeSpecialFilter" v-model="option.selectedSpecialId" filterable clearable>
            <el-option v-for="item in specialList" :value="item.id" :label="item.name" :key="item.name"></el-option>
          </el-select> -->
          <span class="ac-ctrl-wrap">
            <el-autocomplete v-model="option.special_name" :fetch-suggestions="querySearch" @select="handleSelectSpecial" icon="circle-close" :on-icon-click="handleDelIconClick" placeholder="请输入或者选择专题名称"></el-autocomplete>
            <i class="el-icon-caret-bottom"></i>
          </span>
        </el-form-item>
        <el-form-item label="版块类型" prop="position_type">
          <el-select v-model="option.position_type" clearable @change="handleSpecialOptionTypeChange">
            <el-option v-for="(item, index) in positionTypes" :label="item" :key="index" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" v-if="option.position_type == 'multiple_time_rush_to_purchase'">
          <el-select v-model="option.group" clearable :placeholder="!option.special_id ? '请先选择专题' : '请选择'" @change="handleSelectGroup">
            <el-option v-for="item in groupList" :label="item.groupTime" :value="item.group" :key="item.group"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="" v-if="option.type == 'multiple_time_rush_to_purchase'">
          <el-select v-model="option.end_time" clearable class="w-150" :placeholder="!option.special_id ? '请先选择专题' : '请选择结束时间'">
            <el-option v-for="item in groupList" :label="item.timeStr" :value="item.end_time" :key="item.end_time"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="SKU" prop="goods_sn">
          <el-input v-model="option.goods_sn" class="w-150"></el-input>
        </el-form-item>
        <el-button type="primary" @click="filterFormSubmit">筛选</el-button>
        <el-button type="danger" @click="resetForm">清空</el-button>
      </el-form>
      <!-- <div>
        <div>{{ option }}</div>
      </div> -->
      <div class="el-sub-container">
        <el-table border :data="tableData" ref="dataTable">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="title" label="商品名称"></el-table-column>
          <el-table-column prop="goods_sn" label="商品编码"></el-table-column>
          <el-table-column label="商品图片" column-key="img">
            <template scope="scope">
              <a :href="scope.row.goods_url ? scope.row.goods_url : 'javascript:;'"><img class="table-img" :src="scope.row.image_url"></a>
            </template>
          </el-table-column>
          <el-table-column label="配件">
            <template scope="scope">
              <div>{{scope.row.accessories_sku ? scope.row.accessories_sku : '无'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="促销码">
            <template scope="scope">
              <div>{{scope.row.coupon ? scope.row.coupon : '无'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="专题名称" column-key="name">
            <template scope="scope">
              <router-link :to="{name: 'topic_topicEdit', query: {id: scope.row.special.id}}">{{scope.row.special.name}}{{ scope.row.special.is_end == 1 ? '（不启用）' : '' }}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="专题是否启用">
            <template scope="scope">
              <div>{{ scope.row.is_end == 1 ? '否' : '是' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="专题板块">
            <template scope="scope">
              <div>{{scope.row.position.name}}</div>
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
        </el-table>
        <div class="el-sub-container text-right">
          <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page"
                         :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper"
                         :page-size="option.page_size" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹窗S -->
    <!-- 弹窗E -->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableData: [],
        dialogData: [],
        isDataLoading: false,
        editDialog: false,
        addgoodsDialog: false,
        option: {
          platforms: '',
          // selectedSpecialId: '',
          special_id: '',
          special_idTemp: '',
          special_name: '',
          special_nameTemp: '',
          position_type: '',
          group: '',
          goods_sn: '',
          goods_sns: '',
          page: 1,
          page_size: 10
        },
        groupList: [],
        // selectedSpecialId: {
        //   positions: []
        // },
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
      };
    },
    created () {
      this.getData();
      this.getAllSpecial();
      this.getSpecialPositionTypes();
    },
    methods: {
      getData () {
        this.isDataLoading = true;
        this.$http.post('admin/special-goods/list', this.option).then(res => {
          this.total = 0;
          this.tableData = [];
          this.isDataLoading = false;
          if (res.body.code != 0) {
            this.$message.error(res.body.message)
            return;
          }
          this.total = res.body.data.total * 1;
          this.platforms = res.body.data.platforms;
          this.tableData = res.body.data.data;
          Array.isArray(res.body.data.data) && res.body.data.data.forEach(item => {
            let arr = item.special.platforms.split(',');
            let str = '';
            for (let i = 0, len = arr.length; i < len; i++) {
              str += this.platforms[arr[i]] ? ', ' + this.platforms[arr[i]] : '';
            }
            item.special.platforms = str.slice(1);
            this.tableData.push(item);
          })
        });
      },
      // 获取板块类型
      getSpecialPositionTypes () {
        this.$http.get('admin/public/special-position-options').then(res => {
          this.positionTypes = res.body.data;
        });
      },
      // 获取所有专题
      getAllSpecial () {
        this.$http.get('admin/public/all-special-options').then(res => {
          if (res.body.code !== 0) {
            return;
          }
          Array.isArray(res.body.data) && res.body.data.forEach((item) => {
            item.id && this.specialList.push({
              value: item.name,
              id: item.id
            });
          });
        });
      },
      // 获取专题时段信息
      getSpecialGroup (id) {
        if (!id) {
          return;
        }
        this.groupList = [];
        this.option.goods_sns = '';
        this.$http.get('admin/special/info', {params: { id }}).then(res => {
          if (res.body.code != 0 || !Array.isArray(res.body.data.positions)) {
            return;
          }
          res.body.data.positions.some(item => {
            if (item.type !== 'multiple_time_rush_to_purchase' || !Array.isArray(item.goods)) {
              return false;
            }
            item.goods.forEach(item2 => {
              let time = this.timeZone_(item2.end_time, this.$store.getters.getTimeZone);
              this.groupList.push(Object.assign({}, item2, { groupTime: item2.group + ' - ' + time }));
              this.option.goods_sns += ',' + item2.goods;
            });
          });
        });
      },
      ChangePage (val) {
        this.option.page = val;
        this.getData();
      },
      ChangePageSize (val) {
        this.option.page_size = val;
        this.getData();
      },
      filterFormSubmit () {
        // console.log(this.option);
        // return;
        this.option.page = 1;
        this.getData();
      },
      resetForm () {
        for (let item in this.option) {
          if (item === 'page' || item === 'page_size') {
            continue;
          }
          this.option[item] = '';
        }
        // this.$refs.option.resetFields();
        // this.getData();
      },
      changeSpecialFilter (val) {

      },
      // 专题过滤
      querySearch(queryString, cb) {
        let items = this.specialList;
        let results = (queryString && this.option.special_name != this.option.special_nameTemp) ? items.filter(this.createFilter(queryString)) : items;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (item) => {
          return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },
      handleSelectSpecial(item) {
        this.option.special_idTemp = this.option.special_id = item.id;
        this.option.special_nameTemp = this.option.special_name;
        if (!item.id || this.option.type !== 'multiple_time_rush_to_purchase') {
          return;
        }
        this.getSpecialGroup(item.id);
      },
      handleDelIconClick() {
          this.option.special_id = this.option.special_idTemp = '';
          this.option.special_name = this.option.special_nameTemp = '';
      },
      handleSpecialOptionTypeChange (val) {
        if (val !== 'multiple_time_rush_to_purchase' || !this.option.special_id) {
          return;
        }
        // 获取专题信息
        this.getSpecialGroup(this.option.special_id);
      },
      // 选择多时段分组
      handleSelectGroup (val) {
        this.option.goods_sns = '';
        this.groupList.forEach(item => {
          if (!val) {
            this.option.goods_sns += ',' + item.goods;
          } else if (item.group === val) {
            this.option.goods_sns = item.goods;
          }
        });
      }
    }
  }
</script>

<style lang="less">
.topic-goods-list {
  .w-100 { width: 100px; }
  .w-150 { width: 150px; }
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

  .ac-ctrl-wrap { display: block; position: relative;
      .el-icon-circle-close { visibility: hidden; z-index: 5; }
      .el-input { z-index: 2; }
      input { background: none; }
      > i { position: absolute; top: 50%; right: 10px; margin-top: 2px; transform: translateY(-50%); color: #bfcbd9; font-size: 12px; z-index: 1; }
      &:hover {
          > i { visibility: hidden; }
          .el-icon-circle-close { visibility: visible; }
      }
  }
}
.add-goods-dlg {
  .ipt-add-sku { min-width: 500px; }
}
</style>

