<!--OMS同步分区价格-->
<template>
  <div>
    <div class="el-container">
      <el-form labe-lWidth="100px" inline :model="option" ref="searchForm">
        <el-form-item label="物流名称" prop="logisticsCode">
          <el-select v-model="option.logisticsCode" clearable filterable>
            <el-option v-for="item in logisticsList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分区" prop="areaName">
          <el-input v-model="option.areaName"></el-input>
        </el-form-item>
        <el-form-item label="价格类型" prop="calType">
          <el-select v-model="option.calType"  clearable>
               <el-option label="W" value="1"></el-option>
               <el-option label="P" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="getDataBySearch">搜索</el-button>
          <el-button type="danger" @click="resetForm" icon="close">取消搜索</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="update" v-if="self.showAction_('logistics/oms/sync-logistics-price')">更新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="el-container">
      <el-table border :data="tableData" v-loading="tableLoading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="索引"></el-table-column>
        <el-table-column prop="logisticsName" label="物流名称"></el-table-column>
        <el-table-column prop="areaName" label="分区"></el-table-column>
        <el-table-column label="价格类型">
          <template scope="scope">
            <span v-if="scope.row.calType == 1">W</span>
            <span v-if="scope.row.calType == 2">p</span>
          </template>
        </el-table-column>
        <el-table-column prop="minWeight" label="下限重量"></el-table-column>
        <el-table-column prop="maxWeight" label="上限重量"></el-table-column>
        <el-table-column prop="costValue" label="成本价格"></el-table-column>
        <el-table-column prop="saleValue" label="销售价格"></el-table-column>
        <el-table-column prop="registerFee" label="挂号费"></el-table-column>
        <el-table-column prop="currency" label="币种"></el-table-column>
        <el-table-column prop="updateUser" label="最后编辑人"></el-table-column>
        <el-table-column label="最后更新时间" width="200px">
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
          logisticsCode:'',
          areaName:'',
          calType:''
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
      //通过接口获得数据
      getDataByport (obj){
        this.tableData = [];
        this.tableLoading = true;
        this.$http.get('logistics/logistics-area-price/list', {params: obj}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
//            console.log(res.body.data);
            this.tableData = res.body.data.list;
            this.total = res.body.data.totalCount;
          }else{
            this.$message.error(res.body.message);
            this.tableData = [];
            this.total = 0;
          }
        })
      },
      //获得数据
      getData () {
        var obj = this.option;
        this.getDataByport(obj);
      },

      //搜索
      getDataBySearch (){
          let obj = {
            pageNo: 1,
            pageSize: 10,
            logisticsCode:this.option.logisticsCode,
            areaName:this.option.areaName,
            calType:this.option.calType,
          };
        this.getDataByport(obj);
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
        this.$refs['searchForm'].resetFields();
        this.getDataBySearch();
      },
      //更新按钮
      update (){
        this.$http.post('logistics/oms/sync-logistics-price').then(res => {
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


