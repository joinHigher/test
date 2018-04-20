<!--OMS同步计费重量-->
<template>
  <div>
    <div class="el-container">
      <el-form labe-lWidth="100px" inline :model="option" ref="searchForm">
        <el-form-item label="物流名称" prop="logisticsCode">
          <el-select v-model="option.logisticsCode" clearable filterable>
            <el-option v-for="item in logisticsList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="update" v-if="self.showAction_('logistics/oms/sync-weight-fee')">更新</el-button>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button type="primary" @click="" icon="search" @click="getDataBySearch">筛选</el-button>
        <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
      </div>
    </div>
    <div class="el-container">
      <el-table border :data="tableData" v-loading="tableLoading">
        <el-table-column prop="id" label="索引"></el-table-column>
        <el-table-column prop="logisticsName" label="物流名称"></el-table-column>
        <el-table-column  label="重量区间一">
            <el-table-column prop="minWeight" label="从"></el-table-column>
            <el-table-column prop="maxWeight" label="到"></el-table-column>
        </el-table-column>
        <el-table-column prop="inaccuracy" label="计费重量一"></el-table-column>
        <el-table-column label="重量区间二">
          <el-table-column  prop="minWeight2" label="从"></el-table-column>
          <el-table-column  prop="maxWeight2" label="到"></el-table-column>
        </el-table-column>
        <el-table-column prop="inaccuracy2" label="计费重量二"></el-table-column>
        <el-table-column  label="重量区间三">
          <el-table-column prop="minWeight3" label="从"></el-table-column>
          <el-table-column prop="maxWeight3" label="到"></el-table-column>
        </el-table-column>
        <el-table-column prop="inaccuracy3" label="计费重量三"></el-table-column>
        <el-table-column prop="updator" label="最后编辑人"></el-table-column>
        <el-table-column prop="updateTime" label="最后编辑时间" width="200px">
          <template scope="scope">
            {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
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

  export default {
    data () {
      return {
        self: this,
        option: {
          pageNo: 1,
          pageSize: 10,
          logisticsCode:''
        },

        tableLoading: false,
        total: 10,
        tableData: [],
        logisticsList:[],
      };
    },
    created () {
      this.getLogisticsList();
      this.getData();
    },
    methods: {
      getData () {
        this.tableLoading = true;
        this.$http.get('logistics/oms/weight-price', {params: this.option}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.tableData = res.body.data.list;
            this.total = res.body.data.totalCount;
          }else{
            this.$message.error(res.body.message);
            this.tableData = [];
            this.total = 0;
          }
        })
      },

      getDataBySearch(){
          this.getData();
          this.option.pageNo = 1;
      },

      //获得物流名称
      getLogisticsList (){
        this.$http.get('logistics/way/public-oms-ways').then(res =>{
          if(res.body.code ===0){
            var list = res.body.data.infoList;
            var len = list.length;
            var code = '' , name = '';
            for(var i=0;i<len;i++){
              code = list[i].logisticsCode;
              name = list[i].logisticsName;
              this.logisticsList.push({code:code,name:name});
            };
            //console.log(this.logisticsList);
          }
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
        this.option.logisticsCode = '';
        this.getDataBySearch();
      },
      //更新按钮
      update (){
        this.$http.post('logistics/oms/sync-weight-fee').then(res => {
          if (res.body.code === 0) {
            this.$message({
              type: 'success',
              message: '更新成功'
            });
          } else {
            this.$message.error(res.body.message);
          }
        })
      },

    }
  }

</script>

