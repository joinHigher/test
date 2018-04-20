<!--网站地址-->
<template>
    <div>
        <div class="el-container">
             <el-tabs class="full" v-model="activeName">
                    <el-tab-pane label="国家" name="country">
                        <el-form inline :model="option">
                            <el-form-item label="国家" placeholder="请选择">
                                <el-select v-model="option.countryCode" clearable filterable>
                                   <el-option v-for="item in countryList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                            <div style="display:flex;justify-content: flex-end">
                                <el-button type="primary" icon="search" @click="getCountryData">筛选</el-button>
                                <el-button type="danger" icon="close" @click="countryDataRest">取消筛选</el-button>
                            </div>
                        </el-form>
                        <div class="el-sub-container">
                            <el-table border :data="countryTableData" v-loading="tableLoading">
                                <el-table-column prop="id" label="国家ID"></el-table-column>
                                <el-table-column prop="countryName" label="国家"></el-table-column>
                                <el-table-column prop="countryCode" label="国家简码"></el-table-column>
                                <el-table-column label="禁止商品分类">
                                    <template scope="scope">
                                        <span v-if="scope.row.forbidCatalog.length<=70">{{scope.row.forbidCatalog}}</span>
                                        <el-tooltip v-if="scope.row.forbidCatalog.length>70" :content="scope.row.forbidCatalog"
                                                    placement="top" effect="light" popper-class="pop-box">
                                            <span class="tip-text">{{scope.row.forbidCatalog}}</span>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column label="禁止商品性质">
                                    <template scope="scope">
                                        <span v-if="scope.row.forbidAttr.length<=70">{{scope.row.forbidAttr}}</span>
                                        <el-tooltip v-if="scope.row.forbidAttr.length>70" :content="scope.row.forbidAttr"
                                                    placement="top" effect="light" popper-class="pop-box">
                                            <span class="tip-text">{{scope.row.forbidAttr}}</span>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="forbidSku" label="禁止SKU"></el-table-column>
                                <el-table-column prop="status" label="状态">
                                    <template scope="scope">
                                      <i :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}"></i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                  <template scope="scope">
                                    <router-link :to="{name: 'editCountryLogistics',query:{forbidAttr:scope.row.forbidAttr , forbidCatalog:scope.row.forbidCatalog , forbidSku:scope.row.forbidSku,
                                    countryName:scope.row.countryName  , countryCode: scope.row.countryCode , status: scope.row.status , areaId:scope.row.areaId , createUser: scope.row.createUser}}">
                                      <el-button type="primary" v-if="self.showAction_('logistics/contraband-setting/edit')">编辑</el-button>
                                    </router-link>
                                  </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="el-container last text-right">
                          <el-pagination @size-change="changeCountryPageSize" @current-change="changeCountryPage" :current-page="option.page" :page-sizes="[10, 20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="ctotal"></el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="州/省" name="province">
                      <el-form inline :model="option1">
                        <el-form-item label="国家">
                          <el-select v-model="option1.countryCode" placeholder="请选择" @change="getProvince" clearable filterable>
                             <el-option v-for="item in countryList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="州/省" labelWidth="100px">
                          <el-select v-model="option1.provinceCode"  placeholder="请选择" clearable filterable>
                            <el-option v-for="item in provinceList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                        <div style="display:flex;justify-content: flex-end">
                          <el-button type="primary" icon="search" @click="getProvinceData">筛选</el-button>
                          <el-button type="danger" icon="close" @click="provinceDataRest">取消筛选</el-button>
                        </div>
                      </el-form>
                      <div class="el-sub-container">
                        <el-table border :data="provinceTableData" v-loading="tableLoading">
                          <el-table-column prop="id" label="州/省ID"></el-table-column>
                          <el-table-column prop="countryName" label="国家"></el-table-column>
                          <el-table-column prop="countryName" label="国家英文名称"></el-table-column> //
                          <el-table-column prop="provinceName" label="州/省"></el-table-column> //
                          <el-table-column prop="provinceName" label="英文名称"></el-table-column>//
                          <el-table-column prop="provinceCode" label="州/省编码"></el-table-column>//
                          <el-table-column prop="fee" label="服务费"></el-table-column>//
                          <el-table-column prop="forbidCatalog" label="禁止商品分类">
                              <template scope="scope">
                                  <span v-if="scope.row.forbidCatalog.length<=70">{{scope.row.forbidCatalog}}</span>
                                  <el-tooltip v-if="scope.row.forbidCatalog.length>70" :content="scope.row.forbidCatalog" placement="top" effect="light" popper-class="pop-box">
                                      <span class="tip-text">{{scope.row.forbidCatalog}}</span>
                                  </el-tooltip>
                              </template>
                          </el-table-column>
                          <el-table-column prop="forbidAttr" label="禁止商品性质">
                              <template scope="scope">
                                  <span v-if="scope.row.forbidAttr.length<=70">{{scope.row.forbidAttr}}</span>
                                  <el-tooltip v-if="scope.row.forbidAttr.length>70" :content="scope.row.forbidAttr" placement="top" effect="light" popper-class="pop-box">
                                      <span class="tip-text">{{scope.row.forbidAttr}}</span>
                                  </el-tooltip>
                              </template>
                          </el-table-column>
                          <el-table-column prop="forbidSku" label="禁止SKU"></el-table-column>
                          <el-table-column prop="status" label="状态">
                              <template scope="scope">
                                <i :class="{'el-icon-circle-check color-success': scope.row.status == '1', 'el-icon-circle-cross color-danger': scope.row.status == '0'}"></i>
                              </template>
                          </el-table-column>
                          <el-table-column label="操作">
                            <template scope="scope">
                              <router-link :to="{name: 'editProvinceLogistics',query:{forbidAttr:scope.row.forbidAttr , forbidCatalog:scope.row.forbidCatalog , forbidSku:scope.row.forbidSku,
                                                 countryName:scope.row.countryName  , countryCode: scope.row.countryCode , status: scope.row.status , areaId:scope.row.areaId ,fee:scope.row.fee}}">
                                <el-button type="primary" v-if="self.showAction_('logistics/contraband-setting/edit')">编辑</el-button>
                              </router-link>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <div class="el-container last text-right">
                        <el-pagination @size-change="changeProvincePageSize" @current-change="changeProvincePage" :current-page="option1.page" :page-sizes="[10, 20, 50]" :page-size="option1.page_size" layout="total, sizes, prev, pager, next, jumper" :total="ptotal"></el-pagination>
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
            activeName:this.$route.query.activeName ||  'country',
            option: {
                page: 1,
                page_size: 10,
                countryCode: '',
                type:1
            },
            option1:{
              page: 1,
              page_size: 10,
              countryCode: '',
              provinceCode:'',
              type:2
            },
            tableLoading: false,
            ctotal: 10,
            ptotal:10,
            total:10,
          countryTableData: [],
          provinceTableData:[],
            countryList:[],
            provinceList:[]
        };
    },
    created () {
        this.getCountryList(); //获得国家下拉选择列表
        this.getCountryData(); //获得国家信息列表
        this.getProvinceData(); //获得州省信息列表
    },
    methods: {
        //获得国家列表
        getCountryList (){
          this.$http.get('logistics/country-info/list',{params:{page_size:2000,page:1}}).then(res =>{
            if(res.body.code ===0){
              var  id = '' , code = '' ,  name = '';
              for(var i=0;i<res.body.data.list.length;i++){
                  id = res.body.data.list[i].countryId;
                code = res.body.data.list[i].countryCode;
                name = res.body.data.list[i].countryName;
                this.countryList.push({id:id ,code:code, name:name});
              }
            }
          });
        },
        //获得州省列表
        getProvince (){
          this.provinceList = [];
          this.option1.provinceCode = '';
          this.$http.get('logistics/country-info/province-list',{params:{page_size:2000, page:1, countryCode:this.option1.countryCode}}).then(res =>{
            if(res.body.code ===0){
              var  id = '' , code = '' ,  name = '';
              for(var i=0;i<res.body.data.list.length;i++){
                id = res.body.data.list[i].id;
                code = res.body.data.list[i].provinceCode;
                name = res.body.data.list[i].provinceName;
                this.provinceList.push({id:id ,code:code, name:name});
              }
            }
          });
        },
      getCountryData () {
        this.tableLoading = true;
        this.$http.get('logistics/contraband-setting/list', {params: this.option}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.countryTableData = res.body.data.list;
            //console.log('id is :' + this.countryTableData[0].id);
            this.ctotal = res.body.data.totalCount;
          } else {
            this.countryTableData = [];
            this.$message.error(res.body.message);
          }
        })
      },
      countryDataRest (){
            this.option.countryCode = '';
            this.getCountryData();
      },
      changeCountryPage(val){
          this.option.page = val;
          this.getCountryData();
      },
      changeCountryPageSize (val) {
        this.option.page_size = val;
        this.getCountryData();
      },

      getProvinceData (){
        this.tableLoading = true;
        this.$http.get('logistics/contraband-setting/list',{params:this.option1}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.provinceTableData = res.body.data.list;
            this.ptotal = res.body.data.totalCount;
          }else{
            this.provinceTableData = [];
            this.$message.error(res.body.message);
          };
        })
      },

      provinceDataRest (){
        this.option1.countryCode='';
        this.option1.provinceCode='';
        this.getProvinceData();
      },

      changeProvincePage(val){
        this.option1.page = val;
        this.getProvinceData();
      },
      changeProvincePageSize (val) {
        this.option1.page_size = val;
        this.getProvinceData();
      },

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
