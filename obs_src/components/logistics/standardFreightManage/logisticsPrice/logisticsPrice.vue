<!--标准物流价格-->
<template>
   <div>
    <div class="el-container">
      <el-form inline :model="option" ref="searchForm" class="logistics-price">
        <el-form-item label="物流方式">
          <el-select v-model="option.logisticsCode" @change="logisticsCodeChange(option.logisticsCode)" clearable filterable>
            <el-option v-for="item in logisticsTypeList" :key="item.logisticsCode" :label="item.logisticsName" :value="item.logisticsCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流分区" labelWidth="100px">
          <el-select v-model="option.areaId" clearable filterable>
            <el-option v-for="item in logisticsAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <div class="text-right">
          <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
          <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
        </div>
      </el-form>
    </div>

    <div class="el-container text-right">
      <a :href="downUrl" class="template-Down"><el-button type="primary">模板下载</el-button></a>
      <el-button type="primary" @click="openLeadDialog" v-if="self.showAction_('logistics/area-price/import-standard')">导入分区价格</el-button>
    </div>

    <div class="el-container">
      <el-table border :data="tableData" v-loading="tableLoading" :default-sort="{prop: 'minWeight', order: 'ascending'}">
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="wayName" label="物流方式" header-align="center"></el-table-column>
        <el-table-column prop="areaName" label="物流分区" header-align="center"></el-table-column>
        <el-table-column prop="minWeight" label="物流下限" align="center"></el-table-column>
        <el-table-column prop="maxWeight" label="物流上限"  align="center"></el-table-column>
        <el-table-column prop="calType" label="计费类型" align="center">
          <template scope="scope">
              <span v-if="scope.row.calType == 1">W</span>
              <span v-if="scope.row.calType == 2">P</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格（RMB）" align="center"></el-table-column>
        <el-table-column prop="registerFee" label="挂号费（RMB）"  align="center"></el-table-column>
        <el-table-column label="修改时间" width="180px" align="center">
          <template scope="scope">
              {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="el-container last text-right">
      <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!--导入分区 弹框-->
    <el-dialog title="导入分区价格" v-model="leadDialog" class="log-group" size="small" :before-close="leadDialogClose">
      <el-row>
        <el-col :span="18">
          <el-form  label-width="200px">
            <el-form-item label="物流方式">
              <el-select v-model="leadLogisticsCode" filterable clearable>
                <el-option v-for="item in logisticsTypeList" :key="item.logisticsCode" :label="item.logisticsName" :value="item.logisticsCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传文件">
              <el-upload :action="importUrl" ref="upload" :on-preview="handlePreview" :on-remove="handleRemove"
                         :file-list="fileList" :auto-upload="false"
                         :data="leadObj" :accept="fileType"
                         :on-success="handleBatchImportPreview"
                         :on-error="handleBatchImportError"
                         id="upload"
                         name="file">
                <el-button slot="trigger" type="success">选取文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item class="text-right footer-btn">
              <el-button type="primary" @click="submitUpload">保存</el-button>
              <el-button type="danger" @click="leadDialogClose">返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import Vue from 'vue'
  import logistics from '../../js/logistics'
  Vue.use(logistics);

  export default {
    data () {
      return {
        self: this,
        leadDialog:false,
        tableLoading: false,
        total: 10,
        tableData: [],
        option: {
          pageNo: 1,
          pageSize: 10,
          logisticsCode: '',
          areaId: '',
        },
        shippingAreaList: [], //区域
        logisticsTypeList: [],//物流方式
        logisticsAreaList:[], //物流分区
        downUrl:this.$store.getters.getRootMenu + '/logistics/area-price/public-template',
        importUrl:this.$store.getters.getRootMenu + '/logistics/area-price/import-standard',
        fileList:[],
        leadLogisticsCode:'',
        fileType:'excel',
        leadObj:{
          logisticsCode: '',
        },
        areaRes: [],
      };
    },
    created () {
      this.getWayAndArea();
      this.getData();
    },
    methods: {
        getWayAndArea () {
            this.logisticsTypeList = [];
            this.$http.get('logistics/way-standard/list-area').then(res => {
                if (res.body.code === 0) {
                    this.logisticsTypeList = res.body.data;
                } else {
                    this.logisticsTypeList = [];
                }
            })
        },

      logisticsCodeChange (logisticsCode){
        this.option.areaId = '';
        this.logisticsAreaList = [];
        if (this.option.logisticsCode) {
            this.logisticsTypeList.forEach( item => {
                if (logisticsCode === item.logisticsCode) {
                    let areaArr = item.logisticsAreasResp;
                    areaArr.forEach(area => {
                        this.logisticsAreaList.push({name: area.name, id: area.id});
                    });
                    console.log(this.logisticsAreaList);
                }
            });
        } else {
          this.option.areaId = '';
          this.logisticsAreaList = [];
        }
      },

      getData () {
        this.tableLoading = true;
        this.$http.get('logistics/area-price/list-standard',{params:this.option}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.tableData = res.body.data.list;
            this.total = res.body.data.totalCount;
          }else{
            this.tableData = [];
            this.$message.error(res.body.message);
          }
        })
      },
      //筛选
      getDataBySearch (){
        this.getData();
        this.option.pageNo = 1;
      },

      openLeadDialog (){
        this.leadLogisticsCode = '';
        this.leadDialog = true;
      },

      //关闭导入分区弹框
      leadDialogClose (){
        this.leadLogisticsCode = '';
        this.fileList = [];
        this.leadDialog = false;
      },

      handleRemove(file, fileList) {
        //console.log(file, fileList);
      },
      handlePreview(file) {
        //console.log(file);
      },
      //导入分区弹框 提交
      submitUpload (){
        if(this.leadLogisticsCode ===''){
          this.$message.error('物流方式不能为空');
          return false;
        }
        var sign = document.getElementById('upload').lastChild.hasChildNodes();
        if(!sign){
          this.$message.error('请选择上传文件!');
          return false;
        }
        this.leadObj.logisticsCode = this.leadLogisticsCode;
        this.$refs.upload.submit();
      },

      handleBatchImportPreview (res, file) {
        if (res.code === 0) {
          this.$message.success('导入成功');
          this.leadDialog = false;
          this.getData();
          this.fileList = [];
        } else {
          this.fileList = [];
          this.$alert(res.message,"提示",{
            confirmButtonText : '确定',
            type : 'error' ,
          });
        }
      },

      handleBatchImportError (err, file) {
        this.fileList = [];
        this.$alert(err,"提示",{
          confirmButtonText : '确定',
          type : 'error' ,
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
        this.option.areaId = '';
        this.getDataBySearch();
      }
    }
  }
</script>

<style lang="less">
  .log-group {
    .el-dialog {
      top: 5%!important;

      .el-dialog__body {
        padding: 20px;

        .el-form-item {
          margin-bottom: 5px;
        }
      }
    }
  }
  .template-Down{
    margin-right:10px;
  }

  .el-form .el-form-item{
    margin-bottom:20px !important;
  }

  .footer-btn{
    margin-top:15px;
  }

  .logistics-price {
    .el-select {
      width: 210px !important;
    }
  }
</style>
