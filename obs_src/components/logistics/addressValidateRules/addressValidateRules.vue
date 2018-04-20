<template>
  <!--地址校验规则-->
  <div>
    <div class="el-container">
      <el-form label-width="100px" inline :model="option" ref="searchForm">
        <el-form-item label="修改时间">
          <el-date-picker v-model="upDateTime" type="datetimerange" :editable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-select v-model="option.status" clearable>
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="searchType">
          <el-select v-model="option.searchType" placeholder="搜索类型" clearable>
            <el-option v-for="item in searchTypeItem" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模糊搜索" prop="searchKey">
          <el-input v-model="option.searchKey"></el-input>
        </el-form-item>
        <div class="text-right">
          <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
          <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
        </div>
      </el-form>
    </div>
    <div class="el-container">
      <div class="el-sub-container text-right">
        <el-button type="danger" class="fl" icon="delete" @click="batchDelete" v-if="self.showAction_('logistics/rule-info/delete')">批量删除</el-button>
        <template>
          <router-link :to="{name: 'newAddressValidateRules'}">
            <el-button type="primary" icon="plus" v-if="self.showAction_('logistics/rule-info/add')">新建规则</el-button>
          </router-link>
        </template>
      </div>
      <el-table ref="multipleTable" border :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="规则ID" width="100px"></el-table-column>
        <el-table-column prop="name" label="规则名"></el-table-column>
        <el-table-column prop="remark" label="规则说明"></el-table-column>
        <el-table-column prop="remark" label="销售仓"></el-table-column>
        <el-table-column prop="remark" label="真实仓"></el-table-column>
        <el-table-column prop="countrysName" label="生效国家"></el-table-column>
        <el-table-column prop="status" label="启用" width="80px">
          <template scope="scope">
            <i :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}"></i>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间">
          <template scope="scope">
            {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
          </template>
        </el-table-column>
        <el-table-column prop="updateUser" label="修改人"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <router-link :to="{name: 'editAddressValidateRules',query: {id: scope.row.id}}">
              <el-button type="primary" v-if="self.showAction_('logistics/rule-info/edit')">编辑</el-button>
            </router-link>
            <el-button type="danger"  @click="removeItem(scope.row)" v-if="self.showAction_('logistics/rule-info/delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="el-container last text-right">
      <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
        upDateTime: [],
        option: {
          page: 1,
          page_size: 10,
          searchType: '',
          searchKey: '',
          status: '',
          updateStarTime: '',
          updateEndTime: '',
        },
        searchTypeItem :
          [
            { value : 'ruleId', label : '规则Id'},
            { value : 'ruleName', label : '规则名称'},
            { value : 'ruleDescription', label : '规则说明'},
            { value : 'saleWare', label : '销售仓'},
            { value : 'realWare', label : '真实仓'},
            { value : 'countryName', label : '国家'},
            { value : 'updater', label : '修改人'}
          ],
        tableLoading: false,
        total: 10,
        tableData: [],
        ruleList: [],
        ruleIdList:[],
        len:'',
        ruleStr:''
      };
    },
    created () {
      this.getData();
    },
    methods: {
      getData () {
        let updateTime = this.timeZone_(this.upDateTime, this.$store.getters.getTimeZone);
        this.option.updateStarTime = updateTime[0];
        this.option.updateEndTime = updateTime[1];

        this.tableLoading = true;
        this.$http.get('logistics/rule-info/list', {params: this.option}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.tableData = res.body.data.list;
            this.total = res.body.data.totalCount;
          }
        })
      },

      getDataBySearch(){
        this.getData();
        this.option.page = 1;
      },

      removeItem (row) {
        this.$confirm('是否删除该项?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('logistics/rule-info/delete', {id: row.id}).then(res => {
            if (res.body.code === 0) {
              let index = this.tableData.indexOf(row);
              this.tableData.splice(index, 1);
              this.total--;
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
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
        this.ruleList = val;
        this.len = this.ruleList.length;
        if(this.len !== 0){
          for(var i=0;i<this.len;i++){
            this.ruleIdList.push(this.ruleList[i].id);
          }
          this.ruleStr = this.ruleIdList.join();
        }
      },

      batchDelete (){
        if(this.ruleStr === ''){
          this.$message.error('请先选择要删除的项！');
          return false;
        }
        this.$confirm('是否删除选择项?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('logistics/rule-info/delete', {id: this.ruleStr}).then(res => {
            if (res.body.code === 0) {
              for(var i=0;i<this.len;i++){
                var index = this.tableData.indexOf(this.ruleIdList[i].id);
                this.tableData.splice(index,1);
              }
              this.total = this.total - this.len;
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
        this.option.page = val;
        this.getData();
      },
      ChangePageSize (val) {
        this.option.page_size = val;
        this.getData();
      },
      resetForm () {
        this.getTime = '';
        this.option.status = '';
        this.option.searchType = '';
        this.option.searchKey = '';
        this.getDataBySearch();
      }
    }
  }
</script>

<style>

</style>
