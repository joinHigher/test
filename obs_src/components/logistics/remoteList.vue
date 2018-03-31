<!--偏远库管理-->
<template>
    <div>
        <div class="el-container">
             <el-tabs class="full" active-name="country">
                    <el-tab-pane label="偏远库管理" name="country">
                        <el-form inline :model="option" label-width="100px" ref="searchForm">
                            <el-form-item label="偏远库名称">
                                <el-select v-model="option.name" clearable filterable>
                                    <el-option v-for="item in wareName" :key="item.id" :label="item.name" :value="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="修改时间">
                                <el-date-picker v-model="option.editDate" type="datetimerange" :editable="false"></el-date-picker>
                            </el-form-item>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button type="primary" @click="getRemoteWareBysearch" icon="search">筛选</el-button>
                                <el-button type="danger" @click="wareResetForm" icon="close">取消筛选</el-button>
                            </div>
                        </el-form>
                        <div class="el-sub-container text-right">
                            <el-button type="primary" @click="updateWare" v-if="self.showAction_('logistics/remote-info/update-remote-info')">更新偏远库</el-button>
                        </div>
                        <div class="el-sub-container">
                            <el-table border :data="tableData" v-loading="tableLoading">
                                <el-table-column prop="id" label="编号" align="center"></el-table-column>
                                <el-table-column prop="name" label="偏远库名称" align="center"></el-table-column>
                                <el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
                                <el-table-column prop="createTime" label="创建时间" align="center">
                                  <template scope="scope">
                                    {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
                                  </template>
                                </el-table-column>
                                <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
                                <el-table-column prop="updateTime" label="修改时间" align="center">
                                  <template scope="scope">
                                    {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                                  </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template scope="scope">
                                      <router-link :to="{name: 'remoteEdit',query:{id:scope.row.id,name:scope.row.name}}">
                                         <el-button type="primary" v-if="self.showAction_('logistics/remote-info/edit')">编辑</el-button>
                                      </router-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="el-container last text-right">
                          <el-pagination @size-change="wareChangePageSize" @current-change="wareChangePage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="wtotal"></el-pagination>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="偏远地址管理" name="state">
                      <el-form inline :model="addManage" label-width="100px" ref="searchForm">
                        <el-form-item label="国家简码">
                          <el-select v-model="addManage.countryCode" @change="countryCodeChange" clearable filterable>
                            <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cCode" :value="item.cCode"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="国家名称">
                          <el-select v-model="addManage.countryName" @change="countryNameChange" clearable filterable>
                             <el-option v-for="item in stateCode" :key="item.cName" :label="item.cName" :value="item.cName"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="偏远库">
                          <el-select v-model="addManage.remoteId" clearable filterable>
                              <el-option v-for="item in wareName" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            <el-option label="1" value="1">1</el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="城市">
                          <el-input v-model="addManage.cityName"></el-input>
                        </el-form-item>
                        <el-form-item label="是否启用">
                          <el-select v-model="addManage.isActive" clearable>
                            <el-option value="1" label="是"></el-option>
                            <el-option value="0" label="否"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="邮编" class="add-width">
                          <el-input v-model="addManage.zipCode"></el-input>
                        </el-form-item>
                        <el-form-item label="修改时间">
                          <el-date-picker v-model="addManage.editDate" type="datetimerange"></el-date-picker>
                        </el-form-item>
                        <div style="display: flex;justify-content: flex-end">
                          <el-button type="primary" icon="search" @click="getAddManageBySearch">筛选</el-button>
                          <el-button type="danger" icon="close" @click="addResetForm">取消筛选</el-button>
                        </div>
                      </el-form>
                      <div class="el-sub-container text-right">
                        <el-button type="primary" @click="updateAdd" v-if="self.showAction_('logistics/remote-info/update-remote-address')">更新偏远地址</el-button>
                      </div>
                      <div class="el-sub-container">
                        <el-table border :data="addTableData" v-loading="tableLoading">
                          <el-table-column prop="id" label="编号" align="center"></el-table-column>
                          <el-table-column prop="name" label="偏远库名称" align="center"></el-table-column>
                          <el-table-column prop="countryName" label="国家名称" align="center"></el-table-column>
                          <el-table-column prop="cityName" label="城市" align="center"></el-table-column>
                          <el-table-column prop="zipcodeStart" label="邮编起" align="center"></el-table-column>
                          <el-table-column prop="zipcodeEnd" label="邮编末" align="center"></el-table-column>
                          <el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
                          <el-table-column prop="createTime" label="创建时间" width="180px" align="center">
                            <template scope="scope">
                              {{self.timeZone_(scope.row.createTime, self.$store.getters.getTimeZone)}}
                            </template>
                          </el-table-column>
                          <el-table-column prop="updateUser" label="修改人" align="center"></el-table-column>
                          <el-table-column prop="updateTime" label="修改时间" width="180px" align="center">
                            <template scope="scope">
                              {{self.timeZone_(scope.row.updateTime, self.$store.getters.getTimeZone)}}
                            </template>
                          </el-table-column>
                          <el-table-column prop="isActive" label="启用状态" align="center">
                            <template scope="scope">
                              <i :class="{'el-icon-circle-check color-success': scope.row.isActive == '1', 'el-icon-circle-cross color-danger': scope.row.isActive == '0'}"></i>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <div class="el-container last text-right">
                        <el-pagination @size-change="addChangePageSize" @current-change="addChangePage" :current-page="addManage.page" :page-sizes="[10, 20, 50]" :page-size="addManage.page_size" layout="total, sizes, prev, pager, next, jumper" :total="atotal"></el-pagination>
                      </div>
                    </el-tab-pane>
              </el-tabs>
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
            editRemote:false,
            option: {
                page: 1,
                page_size: 10,
                name: '',
                updateStartTime:'',
                updateEndTime:'',
                editDate:[],
            },
            addManage:{
              page:1,
              page_size: 10,
              countryCode:'',
              countryName:'',
              remoteId:'',
              cityCode:'',
              cityName:'',
              zipCode:'',
              updateStartTime:'',
              updateEndTime:'',
              isActive:'',
              editDate:[]
          } ,
            wareName:[],
            stateCode:[],
            cityList:[],
            tableLoading: false,
            wtotal:10,
            atotal:10,
            tableData: [],
            addTableData:[],
        };
    },
    created () {
        this.getRemoteWare();
        this.getAddManage();
        this.getWareName();
        this.getStateCode();
    },
    methods: {
        //getRemoteWareByPort
      getRemoteWareByPort(obj){
        this.tableLoading = true;
        this.$http.get('logistics/remote-info/list',{params:obj}).then(res =>{
          this.tableLoading = false;
          if(res.body.code ===0){
            this.tableData = res.body.data.list;
            this.wtotal = res.body.data.totalCount;
          }
        });
      },

      getRemoteWare () {
        var updateTime = this.timeZone_(this.option.editDate, this.$store.getters.getTimeZone);
        let obj = {
          page: this.option.page,
          page_size: this.option.page_size,
          name: this.option.name,
          updateStartTime:updateTime[0],
          updateEndTime:updateTime[1],
        };
        this.getRemoteWareByPort(obj);
        },
      //筛选偏远库
      getRemoteWareBysearch (){
        this.getRemoteWare();
        this.option.page = 1;
      },

      getAddManageByPort (obj){
        this.tableLoading = true;
        this.$http.get('logistics/remote-info/address-list',{params:obj}).then(res =>{
          this.tableLoading = false;
          if(res.body.code ===0){
            this.addTableData = res.body.data.list;
            this.atotal = res.body.data.totalCount;
          }
        });
      },

      getAddManage (){
        var updateTime = this.timeZone_(this.addManage.editDate, this.$store.getters.getTimeZone);
        this.addManage.updateStartTime = updateTime[0] ;
        this.addManage.updateEndTime = updateTime[1] ;
        var obj = {
            page_size : this.addManage.page_size,
            page : this.addManage.page,
            remoteId : this.addManage.remoteId,
            isActive : this.addManage.isActive,
            countryCode : this.addManage.countryCode,
            cityName : this.addManage.cityName,
            zipCode : this.addManage.zipCode,
            updateStartTime : this.addManage.updateStartTime,
            updateEndTime : this.addManage.updateEndTime
        };
        this.getAddManageByPort(obj);
      },

      getAddManageBySearch (){
        this.getAddManage();
        this.addManage.page = 1;
      },

      getWareName (){
        this.$http.get('logistics/public/remote-info-options').then(res => {
          if (res.body.code === 0 && res.body.data) {
            for (var i = 0; i < res.body.data.length; i++) {
              this.wareName.push({id: res.body.data[i].id, name: res.body.data[i].name});
            }
          }
         // console.log( this.wareName);
        });
      },
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
      countryCodeChange (){
        var code = this.addManage.countryCode;
        var name = '';
        for(var i=0;i<this.stateCode.length;i++){
            if( code == this.stateCode[i].cCode){
                name = this.stateCode[i].cName;
                break;
            }
        }
        this.addManage.countryName = name ;
      },

      countryNameChange(){
        var code = '';
        var name = this.addManage.countryName;
        for(var i=0;i<this.stateCode.length;i++){
          if( name == this.stateCode[i].cName){
            code = this.stateCode[i].cCode;
            break;
          }
        }
        this.addManage.countryCode = code ;
      },
      edit (row){
          this.editRemote = true;
      },

        wareChangePage (val) {
            this.option.page = val;
            this.getRemoteWare();
        },
        wareChangePageSize (val) {
            this.option.page_size = val;
            this.getRemoteWare();
        },
      addChangePageSize (val){
          this.addManage.page_size = val;
          this.getAddManage();
      },
      addChangePage (val){
          this.addManage.page = val;
          this.getAddManage();
      },

        wareResetForm () {
          this.option.name = '';
          this.option.editDate = [];
          this.option.updateStartTime = '';
          this.option.updateEndTime = '';
          this.getRemoteWare();
          this.option.page = 1;
        },
       addResetForm () {
         this.addManage.countryCode = '';
         this.addManage.countryName = '';
         this.addManage.remoteId = '';
         this.addManage.cityCode = '';
         this.addManage.cityName = '';
         this.addManage.zipCode = '';
         this.addManage.updateStartTime = '';
         this.addManage.updateEndTime = '';
         this.addManage.isActive = '';
         this.addManage.editDate = [];
         this.getAddManage();
         this.addManage.page = 1;
      },
      updateWare (){
        this.$http.get('logistics/remote-info/update-remote-info').then(res =>{
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
      updateAdd (){
        this.$http.get('logistics/remote-info/update-remote-address').then(res =>{
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
  .add-width{
    .el-form-item__content{
      width:217px !important;
    }
  }
</style>
