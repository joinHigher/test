<!--区域管理-->
<template>
  <div>
    <div class="el-container">
      <el-form inline :model="option" ref="searchForm">
        <el-form-item label="区域" prop="shippingAreaId">
          <el-select v-model="option.shippingAreaId" clearable filterable>
            <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="真实仓" prop="realWhCode" labelWidth="100px">
          <el-select v-model="option.realWhCode" clearable filterable>
            <el-option v-for="item in realWareList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <div class="text-right">
          <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
          <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
        </div>
      </el-form>
    </div>
    <div class="el-container">
      <div class="el-sub-container text-right">
        <el-button type="primary" @click="$router.push({name: 'newZoneManage'})" icon="plus" v-if="self.showAction_('logistics/shipping-area/add')">添加区域</el-button>
      </div>
      <el-table ref="multipleTable" border :data="tableData" v-loading="tableLoading">
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="name" label="区域" align="center"></el-table-column>
        <el-table-column prop="realWhNames" label="真实仓" header-align="center">
            <template scope="scope">
                <span v-if="scope.row.realWhNames.length<=88">{{scope.row.realWhNames}}</span>
                <el-tooltip v-if="scope.row.realWhNames.length>88" :content="scope.row.realWhNames" placement="top" effect="light" popper-class="pop-box">
                    <span class="tip-text">{{scope.row.realWhNames}}</span>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template scope="scope">
            <span v-if="scope.row.status==1">开启</span>
            <span v-if="scope.row.status==0">关闭</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" align="center">
          <template scope="scope">
            {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <router-link :to="{name: 'editZoneManage',query: {row: JSON.stringify(scope.row)}}">
              <el-button type="primary" v-if="self.showAction_('logistics/shipping-area/edit')">编辑</el-button>
            </router-link>            &nbsp;
            <el-button type="danger"  @click="removeItem(scope.row)" v-if="self.showAction_('logistics/shipping-area/delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-container last text-right">
      <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import logistics from '../js/logistics'
  Vue.use(logistics);
  export default {
    data () {
      return {
        self: this,
        option: {
          pageNo: 1,
          pageSize: 10,
          shippingAreaId: '',
          realWhCode: ''
        },
        areaList: [], //区域列表
        realWareList: [], //真实仓列表
        tableLoading: false,
        total: 0,
        tableData: [],
      };
    },
    created () {
        this.getAreaList();
        this.getData();
    },
    mounted () {
        this.realWareList = this.getRealWareFun(); //真实仓列表
    },
    methods: {
      //获得区域列表
      getAreaList (){
          this.$http.get('logistics/shipping-area/name-list').then( res => {
              if (res.body.code ===0) {
                  this.areaList = res.body.data.list;
              } else {
                  this.areaList = [];
              }
          });
      },

      getData () {
        this.tableLoading = true;
        this.$http.get('logistics/shipping-area/list', {params:this.option}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.tableData = res.body.data.list;
            this.total = res.body.data.totalCount;
            this.tableData.forEach(item => {
                item.realWhNames = "";
                item.warehouseList.forEach( item1 => {
                     let temp = item1.realWhName + ';';
                     item.realWhNames += temp;
                });
            });
            //console.log(this.tableData);
          }else{
            this.tableData = [];
            this.total = 0;
          }
        })
      },
      //筛选按钮
      getDataBySearch(){
        this.getData();
        this.option.pageNo = 1;
      },
      //删除单行
      removeItem (row) {
        this.$confirm('是否删除该项?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('logistics/shipping-area/delete', {id: row.id}).then(res => {
            if (res.body.code === 0) {
              let index = this.tableData.indexOf(row);
              this.tableData.splice(index, 1);
              this.total--;
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
            } else if (res.body.code === 60067) {
                this.$message.error("该区域已被关联，不允许删除！");
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
      resetForm () {
        this.option.name = '';
        this.option.realWhCode = '';
        this.getDataBySearch();
      }
    }
  }
</script>

<style lang="less">
    .tip-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        padding: 10px 0;
        cursor: pointer;
        &:hover {
            color: red;
        }
    }

    .pop-box {
        max-width: 1200px;
        line-height: 20px;
        word-wrap: break-word;
    }
</style>
