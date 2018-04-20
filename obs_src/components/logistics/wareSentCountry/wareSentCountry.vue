<!--仓库可发国家-->
<template>
  <div>
    <div class="el-container">
      <el-form label-width="100px" inline :model="option" ref="searchForm">
        <el-form-item label="真实仓" prop="realWhCode">
          <el-select v-model="option.realWhCode" placeholder="请选择真实仓" filterable clearable>
            <el-option v-for="item in realWareList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道" prop="pipelineCode">
          <el-select v-model="option.pipelineCode" placeholder="请选择渠道" filterable clearable>
            <el-option v-for="item in pipelineList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家" prop="countryCode">
          <el-select v-model="option.countryCode" placeholder="请选择国家" filterable clearable>
            <el-option v-for="item in countryList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用" prop="status">
          <el-select v-model="option.status" clearable>
            <el-option value="1" label="开启"></el-option>
            <el-option value="0" label="关闭"></el-option>
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
        <!--<el-button type="danger" class="fl" icon="delete" @click="batchDelete">批量删除</el-button>-->
        <template>
          <router-link :to="{name: 'newWareSentCountry', query: {type: 1}}">
            <el-button type="primary" icon="plus" v-if="self.showAction_('logistics/warehouse-deliver-country/add')">新建规则</el-button>
          </router-link>
        </template>
      </div>
      <el-table ref="multipleTable" border :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="pipelineName" label="渠道" align="center"></el-table-column>
        <el-table-column prop="realWhName" label="真实仓" align="center"></el-table-column>
        <el-table-column prop="countrys" label="国家" header-align="center">
            <template scope="scope">
                <span v-if="scope.row.countrys.length<=60">{{scope.row.countrys}}</span>
                <el-tooltip v-if="scope.row.countrys.length>60" :content="scope.row.countrys" placement="top" effect="light" popper-class="pop-box">
                    <span class="tip-text">{{scope.row.countrys}}</span>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="启用" align="center">
          <template scope="scope">
            <i :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}"></i>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" align="center">
          <template scope="scope">
            {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="修改人" header-align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <router-link :to="{name: 'editWareSentCountry',query: {type: 2, row: JSON.stringify(scope.row)}}">
              <el-button type="primary" v-if="self.showAction_('logistics/warehouse-deliver-country/edit')">编辑</el-button>
            </router-link>
            <el-button type="danger"  @click="removeItem(scope.row)" v-if="self.showAction_('logistics/warehouse-deliver-country/delete')">删除</el-button>
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
          pipelineCode: '',
          realWhCode: '',
          countryCode: '',
          status: '',
        },
        realWareList: [],
        pipelineList: this.getPipe(),
        countryList: this.getCounryListFun(),
        tableLoading: false,
        total: 0,
        tableData: [],
        resultList: [],
      };
    },
    created () {
      this.getData();
    },
    mounted () {
        this.realWareList = this.getRealWareFun();
    },
    methods: {
      getData () {
        this.tableLoading = true;
        this.$http.get('logistics/warehouse-deliver-country/list', {params: this.option}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.tableData = res.body.data.list;
            this.tableData.forEach(item => {
                  item.countrys = '';
                  item.countryRelRespList.forEach(item1 => {
                      let countryName = item1.countryName + '；';
                      item.countrys += countryName;
                  });
              });
            this.total = res.body.data.totalCount;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
      },

      getDataBySearch(){
        this.getData();
        this.option.pageNo = 1;
      },

      removeItem (row) {
        this.$confirm('是否删除该项?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('logistics/warehouse-deliver-country/delete', {id: row.id}).then(res => {
            if (res.body.code === 0) {
              let index = this.tableData.indexOf(row);
              this.tableData.splice(index, 1);
              this.total--;
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
            } else if (res.body.code === 60067) {
                this.$message.error('开启状态不允许删除');
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

      handleSelectionChange(val) {
        this.resultList = [];
        if (val && val.length > 0) {
          val.forEach(item => {
            this.resultList.push(item.id);
          });
        }
      },

      //暂未使用
      batchDelete (){
        if(this.resultList.length === 0){
          this.$message.error('请先选择要删除的项！');
          return false;
        }
        this.$confirm('是否删除选择项?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('logistics/rule-info/delete', {id: this.resultList.join()}).then(res => {
            if (res.body.code === 0) {
              for(var i=0;i<this.resultList.length;i++){
                var index = this.tableData.indexOf(this.resultList[i].id);
                this.tableData.splice(index,1);
              }
              this.total = this.total - this.resultList.length;
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.getDataBySearch();
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
        getData();
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
        this.$refs['searchForm'].resetFields();
        this.getDataBySearch();
      },

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
