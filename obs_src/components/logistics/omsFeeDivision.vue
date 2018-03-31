<!--OMS同步分区-->
<template>
    <div>
        <div class="el-container">
            <el-form labe-lWidth="100px" inline :model="option" ref="searchForm">
              <el-form-item label="物流名称" prop="logisticsCode">
                  <el-select v-model="option.logisticsCode" clearable filterable>
                    <el-option v-for="item in logisticsList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="国家" prop="countryName">
                  <el-select v-model="option.countryName" @change="countryNameChange" clearable filterable>
                    <el-option v-for="item in stateCode" :key="item.cName" :label="item.cName" :value="item.cName"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="国家编码" prop="countryCode">
                  <el-input v-model="option.countryCode" @change="countryCodeChange"></el-input>
              </el-form-item>
              <el-form-item prop="zipMatchType">
                  <el-select  v-model="option.zipMatchType" clearable>
                    <el-option v-for="item in zipMatchTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item prop="zipCode">
                <el-input v-model="option.zipCode"></el-input>
              </el-form-item>
              <el-form-item label="分区" prop="areaName">
                <el-input v-model="option.areaName"></el-input>
              </el-form-item>
              <el-form-item label="匹配类型" prop="matchType">
                <el-select  v-model="option.matchType" clearable>
                  <el-option v-for="item in matchTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="search" @click="getDataBySearch">搜索</el-button>
                <el-button type="danger" @click="resetForm" icon="close">取消搜索</el-button>
              </el-form-item>
              <el-form-item style="float:right">
                    <el-button type="primary" @click="update" v-if="self.showAction_('logistics/oms/sync-logistics-area')">更新</el-button>
              </el-form-item>
            </el-form>
        </div>
        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="索引" width="80px"></el-table-column>
                <el-table-column prop="logisticsName" label="物流名称" width="100px"></el-table-column>
                <el-table-column prop="countryCode" label="国家简码" width="100px"></el-table-column>
                <el-table-column prop="countryName" label="国家全英文名称" width="145px"></el-table-column>
                <el-table-column prop="" label="州省" width="80px"></el-table-column>
                <el-table-column prop="minWeight" label="区分重量下限" width="95px"></el-table-column>
                <el-table-column prop="maxWeight" label="区分重量上限" width="95px"></el-table-column>
                <el-table-column prop="areaName" label="分区" width="80px"></el-table-column>
                <el-table-column prop="matchType" label="匹配类型" width="100px"></el-table-column>
                <el-table-column prop="zipMatchType" label="邮件匹配类型"  width="128px"></el-table-column>
                <el-table-column prop="zipLowerLimit" label="邮编下限"  width="100px"></el-table-column>
                <el-table-column prop="zipUpperLimit" label="邮编上限"  width="100px"></el-table-column>
                <el-table-column prop="zipCode" label="邮编值" width="80px"></el-table-column>
                <el-table-column prop="updateUser" label="最后编辑人" width="108px"></el-table-column>
                <el-table-column label="最后编辑时间" width="170px">
                    <template scope="scope">
                      {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
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
                logisticsCode: '',
                countryCode: '',
                matchType: '',
                zipMatchType: '',
                countryName:'',
                zipCode:'',
                areaName:''
            },

            tableLoading: false,
            total: 10,
            tableData: [],
            stateCode:[],
            matchTypeList:[
              {id:1,name:'按国家匹配'},
              {id:2,name:'按邮编匹配'},
            ],
            zipMatchTypeList:[
              {id:1,name:'按邮编区间匹配'},
              {id:2,name:'按邮编前几位匹配'},
              {id:3,name:'按邮编前几位不属于匹配'},
            ],
            logisticsList:[],
        };
    },
    created () {
        this.getLogisticsList();
        this.getStateCode();
        this.getData();
    },
    methods: {
      //通过接口获得数据
      getDataByport (obj){
        this.tableLoading = true;
        this.$http.get('logistics/logistics-area/list', {params: obj}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.tableData = res.body.data.list;
            this.total = res.body.data.totalCount;
          } else {
            this.$message.error(res.body.message);
            this.tableData = [];
            this.total = 0;
          }
        })
      },

        getData () {
          let obj = {
            pageNo: this.option.pageNo,
            pageSize: this.option.pageSize,
            logisticsCode: this.option.logisticsCode,
            countryCode: this.option.countryCode,
            matchType: this.option.matchType,
            zipMatchType:this.option.zipMatchType,
            zipCode:this.option.zipCode,
            areaName:this.option.areaName
          };
          this.getDataByport(obj);
        },

      //搜索
      getDataBySearch (){
        this.getData();
        this.option.pageNo = 1;
      },

      //获得国家
      getStateCode (){
        this.stateCode = [];
        let args = {
          page_size:2000,
          page:1,
          countryCode:'',
        };
        this.$http.get('logistics/country-info/list',{params:args}).then(res =>{
          if(res.body.code ===0){
            var cCode = '' , cName = '';
            for(var i=0;i<res.body.data.list.length;i++){
              cCode = res.body.data.list[i].countryCode;
              cName = res.body.data.list[i].countryName;
              this.stateCode.push({cCode:cCode,cName:cName});
            }
          }
        });
      },
      //获得物流名称
      getLogisticsList (){
        this.logisticsList = [];
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

      //国家编码改变是，国家名称也改变
      countryCodeChange (){
        var code = this.option.countryCode;
        var name = '';
        for(var i=0;i<this.stateCode.length;i++){
          if( code == this.stateCode[i].cCode){
            name = this.stateCode[i].cName;
            break;
          }
        }
        this.option.countryName = name ;
      },
      //国家名称改变是，国家编码也改变
      countryNameChange(){
        var code = '';
        var name = this.option.countryName;
        for(var i=0;i<this.stateCode.length;i++){
          if( name == this.stateCode[i].cName){
            code = this.stateCode[i].cCode;
            break;
          }
        }
        this.option.countryCode = code ;
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
        this.$http.post('logistics/oms/sync-logistics-area').then(res => {
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

