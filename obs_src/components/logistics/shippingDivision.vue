<!--物流可达国家-->
<template>
  <div>
    <div class="el-container">
      <el-form label-width="100px" inline :model="option" ref="searchForm">
        <el-form-item label="模板" prop="templateId">
          <el-select v-model="option.templateId" placeholder="请选择"  filterable clearable @change="templateChange">
            <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="shippingAreaId">
          <el-select v-model="option.shippingAreaId" @change="shippingAreaChange" filterable clearable>
            <el-option v-for="item in shippingAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流分组" prop="groupId">
          <el-select v-model="option.groupId" @change="groupChange" filterable clearable>
            <el-option v-for="item in logisticsGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流方式">
          <el-select v-model="option.logisticsCode" filterable clearable>
            <el-option v-for="item in logisticsTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <el-select v-model="option.countryCode" clearable filterable>
            <el-option v-for="item in stateCode" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-select v-model="option.status" clearable>
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
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
        <el-button type="primary" @click="addCountry" v-if="self.showAction_('logistics/partition/add')">添加国家</el-button>
        <el-button type="primary" @click="batchEdit">批量操作</el-button>
      </div>
      <el-table border :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="templateName" label="模板"></el-table-column>
        <el-table-column prop="shippingAreaName" label="区域"></el-table-column>
        <el-table-column prop="groupName" label="物流分组"></el-table-column>
        <el-table-column prop="logisticsName" label="物流方式" width="200px"></el-table-column>
        <el-table-column prop="countryName" label="国家" width="200px"></el-table-column>
        <el-table-column label="送达时间">
          <template scope="scope">
            {{scope.row.minDay}} - {{scope.row.maxDay}}
          </template>
        </el-table-column>
        <el-table-column prop="costQuot" label="计费系数"></el-table-column>
        <el-table-column prop="status" label="是否启用">
          <template scope="scope">
            <i
              :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}"></i>
            <i :class="{'el-icon-warning color-warning': scope.row.status != scope.row.baseStatus }"></i>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="200px">
          <template scope="scope">
            {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="修改人" width="200px"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="primary" @click="edit(scope.row)" v-if="self.showAction_('logistics/partition/edit')">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-container last text-right">
      <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo"  :page-sizes="[10, 20, 50]" :page-size="option.pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!--编辑物流方式通邮 弹框-->
    <el-dialog title="编辑物流方式通邮" v-model="editDialog" class="log-group" size="tiny">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="物流分组:">{{editForm.groupName}}</el-form-item>
        <el-form-item label="物流方式:">{{editForm.logisticsName}}</el-form-item>
        <el-form-item label="国家:">{{editForm.countryName}}</el-form-item>
        <el-form-item label="启用:">
          <el-radio-group v-model="editForm.status">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="到达天数:">
          <el-row>
            <el-col :span="5">
              <el-input v-model="editForm.minDay"></el-input>
            </el-col>
            <el-col :span="2" class="text-center">
              至
            </el-col>
            <el-col :span="5">
              <el-input v-model="editForm.maxDay"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button type="danger" @click="editDialogClose">取消</el-button>
        <el-button type="primary" @click="editDialogSave">确认</el-button>
      </div>
    </el-dialog>

    <!--批量编辑物流方式通邮 弹框-->
    <el-dialog title="批量编辑物流方式通邮" v-model="batchEditDialog" class="log-group" size="tiny">
      <el-form :model="batchEditForm" label-width="100px">
        <el-form-item label="启用:">
          <el-radio-group v-model="batchEditForm.status">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="到达天数:">
          <el-row>
            <el-col :span="5">
              <el-input v-model="batchEditForm.minDay"></el-input>
            </el-col>
            <el-col :span="2" class="text-center">
              至
            </el-col>
            <el-col :span="5">
              <el-input v-model="batchEditForm.maxDay"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button type="danger" @click="batchEditDialogClose">取消</el-button>
        <el-button type="primary" @click="batchEditDialogSave">确认</el-button>
      </div>
    </el-dialog>

    <!--新建国家 弹框-->
    <el-dialog title="新建国家" v-model="newCountryDialog" class="log-group" size="tiny">
      <el-form :model="newCountryForm" label-width="100px">
        <el-form-item label="物流分组">
          <el-select v-model="newCountryForm.groupId" @change="getNewLogisticsType" clearable filterable>
            <el-option v-for="item in newLogisticsGroup" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流方式">
          <el-select v-model="newCountryForm.logisticsCode" clearable filterable>
            <el-option v-for="item in newLogisticsType" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <el-select v-model="newCountryForm.countryCode" clearable filterable>
            <el-option v-for="item in stateCode" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用:">
          <el-radio-group v-model="newCountryForm.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="到达天数:">
          <el-row>
            <el-col :span="5">
              <el-input v-model="newCountryForm.minDay"></el-input>
            </el-col>
            <el-col :span="2" class="text-center">
              至
            </el-col>
            <el-col :span="5">
              <el-input v-model="newCountryForm.maxDay"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button type="danger" @click="newCountryDialogClose">取消</el-button>
        <el-button type="primary" @click="newCountryDialogSave">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Vue from 'vue'
  import logistics from './js/logistics'
  Vue.use(logistics);

export default {
    data () {
        return {
            self: this,
            detailDialog: false,
            detailForm: {
                a: ''
            },
            option: {
                pageNo: 1,
                pageSize: 10,
                templateId: '',
                shippingAreaId: '',
                groupId: '',
                logisticsCode:'',
                countryCode:'',
                status:'',
            },
            total: 10,
            tableLoading: false,
            tableData: [],
            templateList: this.getTemplateList(), //模板
            shippingAreaList: [], //区域
            logisticsGroup: [], //物流分组
            logisticsTypeList:[], //物流方式
            stateCode: this.getCounryListFun(), //国家
            editDialog:false, //编辑弹框
            editForm: {
              id: [],
              groupName: '',
              logisticsName: '',
              countryName: '',
              status: '',
              minDay: '',
              maxDay: ''
            },
            batchEditDialog: false,//批量编辑弹框
            batchEditForm: {
              idList: [],
              status: '',
              minDay: '',
              maxDay: ''
            },
          newCountryDialog:false,//新增国家弹框
          newCountryForm:{
            groupId: '',
            logisticsCode:'',
            countryCode:'',
            status:'',
            minDay: '',
            maxDay: ''
          },
          newLogisticsGroup:[],//新建国家 物流分组
          newLogisticsType:[],//新建国家 物流方式
          newStateCode:[], //新建国家 国家

        };
    },
    created () {
      this.getData();
    },
    methods: {
      templateChange (){
          this.option.shippingAreaId = '';
          this.option.groupId = '';
          this.option.logisticsCode = '';
          this.shippingAreaList = [];
          this.logisticsGroup = [];
          this.logisticsTypeList = [];

          if (this.option.templateId) {
             this.shippingAreaList = this.getAreaByTemplate(this.option.templateId);
        }
      },

      shippingAreaChange (){
          this.option.groupId = '';
          this.option.logisticsCode = '';
          this.logisticsGroup = [];
          this.logisticsTypeList = [];

          if (this.option.shippingAreaId) {
             this.logisticsGroup = this.getGroupByAreaId(this.option.templateId, this.option.shippingAreaId);
        }
      },

      groupChange (){
          this.option.logisticsCode = '';
          this.logisticsTypeList = [];

          if (this.option.groupId) {
             this.logisticsTypeList = this.getLogisticsCodeByGroup(this.option.groupId);
        }
      },


      getData () {
        this.tableLoading = true;
        this.$http.get('logistics/partition/list', {params: this.option}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.tableData = res.body.data.list;
            this.total = res.body.data.totalCount;
          }
        })
      },

      getDataBySearch(){
          this.getData();
          this.option.pageNo = 1;
      },

      //取消筛选
      resetForm () {
        this.option.templateId = '';
        this.option.shippingAreaId = '';
        this.option.groupId = '';
        this.option.logisticsCode = '';
        this.option.countryCode = '';
        this.option.status = '';
        this.getDataBySearch();
      },
      //编辑
      edit (row){
          //console.log(row);
        this.editForm.id = [];
         this.editDialog = true;
         this.editForm.id.push(row.id);
         this.editForm.groupName = row.groupName;
         this.editForm.logisticsName = row.logisticsName;
         this.editForm.countryName = row.countryName;
         this.editForm.status = row.status;
         this.editForm.minDay = row.minDay;
         this.editForm.maxDay = row.maxDay;
         //console.log(this.editForm.id);
      },
      //编辑弹框 取消
      editDialogClose (){
        this.editDialog = false;
      },
      //编辑弹框 确认
      editDialogSave (){
          if(this.editForm.minDay===''){
             this.$message.error('最小到达天数不能为空！');
             return false;
          };
          if(this.editForm.maxDay===''){
            this.$message.error('最大到达天数不能为空！');
            return false;
          };
          if(Number(this.editForm.minDay) > Number(this.editForm.maxDay)){
            this.$message.error('最小到达天数不能大于最大到达天数！');
            return false;
          }
          let params = {
            status:this.editForm.status,
            minDay:this.editForm.minDay,
            maxDay:this.editForm.maxDay,
            idList:this.editForm.id
          };

        this.$http.post('logistics/partition/edit', params).then(res => {
          if (res.body.code === 0) {

            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.getData();
          }else{
            this.$message.error(res.body.message);
          }
        });
        this.editDialog = false;
      },

      //批量编辑
      batchEdit (){
        this.batchEditDialog = true;
        this.batchEditForm.status = 1
      },
      //批量编辑弹框关闭
      batchEditDialogClose (){
        this.batchEditDialog = false;
      },
      //批量编辑弹框 确认
      batchEditDialogSave (){
         if(this.batchEditForm.idList.length === 0){
           this.$message.error("请先选择要编辑的项！");
           return false;
         };
         if(this.batchEditForm.status ===''){
           this.$message.error("请选择是否启用！");
           return false;
         };
        if(this.batchEditForm.minDay ===''){
          this.$message.error("请填写到达最小天数！");
          return false;
        };
        if(this.batchEditForm.maxDay ===''){
          this.$message.error("请填写到达最大天数！");
          return false;
        };
        if(Number(this.batchEditForm.minDay) > Number(this.batchEditForm.maxDay)){
          this.$message.error("到达最小天数不能大于到达最大天数！");
          return false;
        };

        this.$http.post('logistics/partition/edit', this.batchEditForm).then(res => {
          if (res.body.code === 0) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.getData();
          }else{
            this.$message.error(res.body.message);
          }
        });
        this.batchEditDialog = false;
      },
      //全选
      handleSelectionChange(val) {
        this.batchEditForm.idList = [];
        if(val.length > 0){
          for(var i=0;i<val.length;i++){
            this.batchEditForm.idList.push(val[i].id);
          }
        }
      },

      //添加国家
      addCountry (){
          this.newCountryDialog = true;
          this.newLogisticsGroup = this.getAllGroupFun();
          this.newCountryForm.groupId = '';
          this.newCountryForm.logisticsCode = '';
          this.newCountryForm.countryCode = '';
          this.newCountryForm.status = 1;
          this.newCountryForm.minDay = '';
          this.newCountryForm.maxDay = '';
      },
      //获得 新建国家的 物流方式
      getNewLogisticsType (){
          if (this.newCountryForm.groupId) {
             this.newLogisticsType = this.getLogisticsCodeByGroup(this.newCountryForm.groupId);
          } else {
              this.newCountryForm.logisticsCode = '';
              this.newLogisticsType = [];
          }
      },
      // 新建国家  取消
      newCountryDialogClose (){
        this.newCountryDialog = false;
      },

      // 新建国家  保存
      newCountryDialogSave (){
          if(this.newCountryForm.groupId ===''){
              this.$message.error('物流分组不能为空!');
              return false;
          }
          if(this.newCountryForm.logisticsCode ===''){
              this.$message.error('物流方式不能为空!');
              return false;
          }
          if(this.newCountryForm.countryCode ===''){
              this.$message.error('国家不能为空!');
              return false;
          }
          if(this.newCountryForm.status ===''){
              this.$message.error('请选择是否启用!');
              return false;
          }
          if(this.newCountryForm.minDay ===''){
            this.$message.error('请填写到达最小天数!');
            return false;
          }
          if(this.newCountryForm.maxDay ===''){
            this.$message.error('请填写到达最大天数!');
            return false;
          }
          if(Number(this.newCountryForm.minDay) > Number(this.newCountryForm.maxDay)){
            this.$message.error('到达最小天数不能大于到达最大天数!');
            return false;
          }

        let logisticsWayId = '', costQuot= '', templateId = '', shippingAreaId = '';
        this.newLogisticsType.forEach(item => {
            if (item.code === this.newCountryForm.logisticsCode) {
                logisticsWayId = item.id;
                costQuot = item.costQuot;
                templateId = item.templateId;
                shippingAreaId = item.shippingAreaId;
            }
        });

        let params = {
           templateId: templateId,
           shippingAreaId: shippingAreaId,
           groupId : this.newCountryForm.groupId,
           logisticsWayId : logisticsWayId,
           costQuot : costQuot,
           logisticsCode : this.newCountryForm.logisticsCode,
           status : this.newCountryForm.status,
           minDay : this.newCountryForm.minDay,
           maxDay : this.newCountryForm.maxDay,
           countryCode : this.newCountryForm.countryCode
        };

        this.$http.post('logistics/partition/add',params).then(res => {
          if (res.body.code === 0) {
            this.$message.success('保存成功！');
            this.getData();
            this.newCountryDialog = false;
          }else{
            this.$message.error(res.body.message);
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
    }
}
</script>

<style>

</style>
