<!--OMS同步的物流信息-->
<template>
    <div>
        <div class="el-container">
            <el-form  inline :model="option" ref="searchForm">
                <el-form-item label="真实仓" prop="realWareCode">
                    <el-input v-model="option.realWareCode"></el-input>
                </el-form-item>
                <el-form-item label="物流编码" prop="logisticsCode" labelWidth="100px">
                    <el-input v-model="option.logisticsCode"></el-input>
                </el-form-item>
                <el-form-item   style="float:right;">
                  <el-button type="primary" @click="updateFare" v-if="self.showAction_('logistics/oms/sync-all-freight')">更新运费参数</el-button>
                </el-form-item>
              <el-form-item   style="float:right;">
                <el-button type="primary" @click="updateAll" v-if="self.showAction_('logistics/oms/sync-increment-freight')">全量运费参数</el-button>
              </el-form-item>
              <div class="text-right" style="padding-right: 10px;">
                    <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
                    <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="warehouseName" label="真实仓" width="100px">
                    <template scope="scope">
                        <span v-if="scope.row.warehouseName.length<=25">{{scope.row.warehouseName}}</span>
                        <el-tooltip v-if="scope.row.warehouseName.length>25" :content="scope.row.warehouseName" placement="top" effect="light" popper-class="pop-box">
                            <span class="tip-text">{{scope.row.warehouseName}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="物流名称" width="100px">
                    <template scope="scope">
                        <router-link :to="{name: 'logistics_omsMessageInfo', query: {id: scope.row.id}}" class="">
                            {{scope.row.logisticsName}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="englishName" label="英文名称" width="103px"></el-table-column>
                <el-table-column prop="logisticsCode" label="物流编码" width="100px"></el-table-column>
                <el-table-column label="天数" width="90px" header-align="center">
                    <template scope="scope">
                        {{scope.row.minDays}} - {{scope.row.maxDays}}
                    </template>
                </el-table-column>
                <el-table-column label="级别" width="80px" align="center">
                    <template scope="scope">
                        {{levelOpt[scope.row.logisticsLevel]}}
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="URL" width="130px" header-align="center"></el-table-column>
                <el-table-column prop="fbAttr" label="禁用品" width="112px" header-align="center">
                    <template scope="scope">
                        <span v-if="scope.row.fbAttr.length<=25">{{scope.row.fbAttr}}</span>
                        <el-tooltip v-if="scope.row.fbAttr.length>25" :content="scope.row.fbAttr" placement="top" effect="light" popper-class="pop-box">
                            <span class="tip-text">{{scope.row.fbAttr}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="calWeigth" label="计重类型" width="100px" align="center"></el-table-column>
                <el-table-column label="开启体积重" width="110px" align="center">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.isVolumeWeight == '1', 'el-icon-circle-cross color-danger': scope.row.isVolumeWeight == '0'}"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="maxLengthEdge" label="最大边长(cm)"  width="125px" align="center"></el-table-column>
                <el-table-column prop="minWeight" label="最小重量(kg)"  width="120px" align="center"></el-table-column>
                <el-table-column prop="maxWeight" label="最大重量(kg)"  width="120px" align="center"></el-table-column>
                <el-table-column label="开启状态" width="100px" align="center">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}"></i>
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" width="120px" align="center">
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
            detailDialog: false,
            detailForm: {},
            option: {
                pageNo: 1,
                pageSize: 10,
                logisticsCode: '',
                realWareCode: ''
            },
            levelOpt: {
                '0': '平邮',
                '1': '慢',
                '2': '中',
                '3': '快',
                '4': '自提'
            },
            tableLoading: false,
            total: 10,
            tableData: [],
        };
    },
    created () {
        this.getData();
    },
    methods: {
        //通过接口获得数据
       getDataByport (obj){
         this.tableLoading = true;
         this.$http.get('logistics/oms/logistics-list',{params:obj}).then(res => {
           this.tableLoading = false;
           if (res.body.code === 0) {
             this.tableData = res.body.data.list;
             this.total = res.body.data.totalCount;
           }
         })
       },
        getData (){
            this.tableLoading = true;
            var obj = this.option;
            this.getDataByport(obj);
        },
        //筛选
        getDataBySearch (){
          let obj = {
            pageNo: 1,
            pageSize: 10,
            logisticsCode: this.option.logisticsCode,
            realWareCode: this.option.realWareCode,
          };
          this.getDataByport(obj);
          this.option.pageNo = 1;
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
        updateFare(){
          this.$http.get('logistics/oms/sync-all-freight').then(res =>{
            if(res.body.code ===0){
              this.$message({
                showClose: true,
                message: '更新成功',
                type: 'success'
              });
            }else{
              this.$message.error(res.body.message);
            }
          })
        },
        updateAll(){
          this.$confirm('此操作将会清除之前的全部数据，重新获取全量数据更新，确定执行?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.get('logistics/oms/sync-increment-freight').then(res =>{
              if(res.body.code ===0){
                this.getData();
                this.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                });
              }else{
                this.$message.error(res.body.message);
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消更新'
            });
          });
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
