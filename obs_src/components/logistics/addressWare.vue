<!--地址库-->
<template>
  <div>
    <div class="el-container">
      <el-tabs class="full" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础地址信息" name="base">
          <el-form inline label-width="100px" :model="base" ref="baseForm">
            <el-row>
              <el-col :span="5">
                <el-form-item label="国家">
                  <el-select v-model="base.countryCode" @change="getProvince(base.countryCode)" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName" :value="item.cCode"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="州/省" placeholder="请选择">
                  <el-select v-model="base.provinceCode" @change="getCity(base.provinceCode)" clearable filterable>
                    <el-option v-for="item in province" :key="item.pCode" :label="item.pName" :value="item.pCode"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="市" placeholder="请选择">
                  <el-select v-model="base.cityCode" clearable filterable>
                    <el-option v-for="item in city" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item>
                  <el-button type="primary" icon="search" @click="baseSearch">筛选</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="7" class="text-right">
                <el-form-item>
                  <el-input placeholder="输入邮编" v-model="base.zipcode"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="search" @click="baseSearch" v-if="self.showAction_('logistics/country-info/base-list')">搜索</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="el-sub-container">
            <el-table border :data="baseAddInfo" v-loading.body="loading">
              <el-table-column prop="id" label="地址ID"></el-table-column>
              <el-table-column prop="countryName" label="国家"></el-table-column>
              <el-table-column prop="provinceName" label="州/省"></el-table-column>
              <el-table-column prop="cityName" label="市"></el-table-column>
              <!--<el-table-column prop="" label="市区"></el-table-column>-->
              <!--<el-table-column prop="" label="街道"></el-table-column>-->
              <el-table-column prop="zipcodeStart" label="邮编（起）"></el-table-column>
              <el-table-column prop="zipcodeEnd" label="邮编（止）"></el-table-column>
            </el-table>
          </div>
          <div class="el-container last text-right">
            <el-pagination @size-change="baseChangePageSize" @current-change="baseChangePage" :current-page="base.page"
                           :page-sizes="[10, 20, 50]" :page-size="base.page_size"
                           layout="total, sizes, prev, pager, next, jumper" :total="btotal"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="国家信息" name="country">
          <el-form inline label-width="100px" :model="country" ref="countryForm">
            <el-form-item label="国家">
              <el-select v-model="country.countryCode" placeholder="全部" clearable   @visible-change = "getStateCode"  filterable>
                <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName" :value="item.cCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="countrySearch" v-if="self.showAction_('logistics/country-info/list')">搜索</el-button>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" icon="plus" @click="countryOption(1)" v-if="self.showAction_('logistics/country-info/add')">新增国家</el-button>
            </el-form-item>
          </el-form>
          <div class="el-sub-container">
            <el-table border :data="countryInfo" v-loading.body="loading">
              <el-table-column prop="countryId" label="国家ID"></el-table-column>
              <el-table-column prop="countryName" label="国家"></el-table-column>
              <el-table-column prop="countryCode" label="国家编码"></el-table-column>
              <el-table-column prop="zipcodeStart" label="邮编（起）"></el-table-column>
              <el-table-column prop="zipcodeEnd" label="邮编（止）"></el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button type="primary" @click="countryOption(2,scope.row)" v-if="self.showAction_('logistics/country-info/edit')"> 编辑</el-button>
                  <el-button type="danger" @click="countryDelete(scope.row)" v-if="self.showAction_('logistics/country-info/delete')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="el-container last text-right">
            <el-pagination @size-change="countryChangePageSize" @current-change="countryChangePage"
                           :current-page="country.page" :page-sizes="[10, 20, 50]" :page-size="country.page_size"
                           layout="total, sizes, prev, pager, next, jumper" :total="ctotal"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="州/省信息" name="province">
          <el-form inline label-width="100px" :model="provinceForm" ref="provinceForm">
            <el-form-item label="国家">
              <el-select v-model="provinceForm.countryCode" placeholder="全部"
                         @change="getProvince(provinceForm.countryCode)" clearable filterable>
                <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName"
                           :value="item.cCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="州/省">
              <el-select v-model="provinceForm.provinceCode" placeholder="全部" clearable filterable>
                <el-option v-for="item in province" :key="item.pCode" :label="item.pName"
                           :value="item.pCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="provinceSearch">搜索</el-button>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" icon="plus" @click="provinceOption(1)"  v-if="self.showAction_('logistics/country-info/province-add')">新增州/省</el-button>
            </el-form-item>
          </el-form>
          <div class="el-sub-container">
            <el-table border :data="provinceInfo" v-loading.body="loading">
              <el-table-column prop="id" label="州/省ID"></el-table-column>
              <el-table-column prop="countryName" label="国家"></el-table-column>
              <el-table-column prop="provinceName" label="州/省"></el-table-column>
              <el-table-column prop="provinceCode" label="州/省编码"></el-table-column>
              <el-table-column prop="zipcodeStart" label="邮编（起）"></el-table-column>
              <el-table-column prop="zipcodeEnd" label="邮编（止）"></el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button type="primary" @click="provinceOption(2,scope.row)" v-if="self.showAction_('logistics/country-info/province-edit')"> 编辑</el-button>
                  <el-button type="danger" @click="provinceDelete(scope.row)" v-if="self.showAction_('logistics/country-info/province-delete')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="el-container last text-right">
            <el-pagination @size-change="provinceChangePageSize" @current-change="provinceChangePage"
                           :current-page="provinceForm.page" :page-sizes="[10, 20, 50]"
                           :page-size="provinceForm.page_size" layout="total, sizes, prev, pager, next, jumper"
                           :total="ptotal"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="市信息" name="city">
          <el-form inline label-width="100px" :model="cityForm" ref="cityForm">
            <el-form-item label="国家">
              <el-select v-model="cityForm.countryCode" placeholder="全部" @change="getProvince(cityForm.countryCode)" clearable filterable>
                <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName" :value="item.cCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="州/省">
              <el-select v-model="cityForm.provinceCode" placeholder="全部" @change="getCity(cityForm.provinceCode)" clearable filterable>
                <el-option v-for="item in province" :key="item.pCode" :label="item.pName" :value="item.pCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="市">
              <el-select v-model="cityForm.cityCode" placeholder="全部" clearable filterable>
                <el-option v-for="item in city" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="citySearch" v-if="self.showAction_('logistics/country-info/city-list')">搜索</el-button>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" icon="plus" @click="cityOption(1)" v-if="self.showAction_('logistics/country-info/city-add')">新增城市</el-button>
            </el-form-item>
          </el-form>
          <div class="el-sub-container">
            <el-table border :data="cityTableInfo" v-loading.body="loading">
              <el-table-column prop="id" label="城市ID"></el-table-column>
              <el-table-column prop="countryName" label="国家"></el-table-column>
              <el-table-column prop="provinceName" label="州/省"></el-table-column>
              <el-table-column prop="cityName" label="城市"></el-table-column>
              <el-table-column prop="cityCode" label="城市编码"></el-table-column>
              <el-table-column prop="zipcodeStart" label="邮编（起）"></el-table-column>
              <el-table-column prop="zipcodeEnd" label="邮编（止）"></el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button type="primary" @click="cityOption(2,scope.row)" v-if="self.showAction_('logistics/country-info/city-edit')"> 编辑</el-button>
                  <el-button type="danger" @click="cityDelete(scope.row)" v-if="self.showAction_('logistics/country-info/city-delete')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="el-container last text-right">
            <el-pagination @size-change="cityChangePageSize" @current-change="cityChangePage"
                           :current-page="cityForm.page" :page-sizes="[10, 20, 50]" :page-size="cityForm.page_size"
                           layout="total, sizes, prev, pager, next, jumper" :total="citytotal"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--编辑&新增国家信息 弹框-->
    <el-dialog :title="countryInfoTitle" v-model="countryInfoDialog" class="log-group" size="small"
               :before-close="countryInfoClose">
      <el-row>
        <el-col :span="18">
          <el-form :model="countryInfoForm" label-width="200px" class="dialog-Form" :rules="countryRules"
                   ref="countryRulesForm">
            <el-form-item label="国家" prop="countryName">
              <el-input v-model="countryInfoForm.countryName"
                        @change="isExistCountryByName(countryInfoForm.countryName)"></el-input>
            </el-form-item>
            <el-form-item label="国家简码" prop="countryCode">
              <el-input v-model="countryInfoForm.countryCode"
                        @change="isExistCountryByCode(countryInfoForm.countryCode)"></el-input>
            </el-form-item>
            <el-form-item label="邮编（起）">
              <el-row>
                <el-col :span="10">
                  <el-input v-model="countryInfoForm.zipcodeStart"></el-input>
                </el-col>
                <el-col :span="4" class="text-center">
                  <span>邮编（止）</span>
                </el-col>
                <el-col :span="10">
                  <el-input v-model="countryInfoForm.zipcodeEnd"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="日语名称">
              <el-input v-model="countryInfoForm.lang.japaneseName"></el-input>
            </el-form-item>
            <el-form-item label="意大利名称">
              <el-input v-model="countryInfoForm.lang.italianName"></el-input>
            </el-form-item>
            <el-form-item label="俄语名称">
              <el-input v-model="countryInfoForm.lang.russiaName"></el-input>
            </el-form-item>
            <el-form-item label="法语名称">
              <el-input v-model="countryInfoForm.lang.frenchName"></el-input>
            </el-form-item>
            <el-form-item label="西班牙名称">
              <el-input v-model="countryInfoForm.lang.spainName"></el-input>
            </el-form-item>
            <el-form-item label="德语名称">
              <el-input v-model="countryInfoForm.lang.germanName"></el-input>
            </el-form-item>
            <el-form-item label="葡语名称">
              <el-input v-model="countryInfoForm.lang.portugueseName"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="countryInfoSave">保存</el-button>
              <el-button type="danger" @click="countryInfoClose">返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <!--新增&编辑州/省信息 弹框-->
    <el-dialog :title="provinceInfoTitle" v-model="provinceInfoDialog" class="log-group" size="small"
               :before-close="provinceInfoClose">
      <el-row>
        <el-col :span="18">
          <el-form :model="provinceInfoForm" label-width="200px" class="dialog-Form" :rules="provinceRules"
                   ref="provinceRulesForm">
            <el-form-item label="国家名称" prop="countryCode">
              <el-select v-model="provinceInfoForm.countryCode" clearable :disabled="provinceInfoForm.pIsDisabled" filterable>
                <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName"
                           :value="item.cCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="州/省名称" prop="provinceName">
              <el-input v-model="provinceInfoForm.provinceName"
                        @change="isExistProvinceByName(provinceInfoForm.provinceName)"></el-input>
            </el-form-item>
            <el-form-item label="州/省编码" prop="provinceCode">
              <el-input v-model="provinceInfoForm.provinceCode"
                        @change="isExistProvinceByCode(provinceInfoForm.provinceCode)"></el-input>
            </el-form-item>
            <el-form-item label="邮编（起）">
              <el-row>
                <el-col :span="10">
                  <el-input v-model="provinceInfoForm.zipcodeStart"></el-input>
                </el-col>
                <el-col :span="4" class="text-center">
                  <span>邮编（止）</span>
                </el-col>
                <el-col :span="10">
                  <el-input v-model="provinceInfoForm.zipcodeEnd"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="日语名称">
              <el-input v-model="provinceInfoForm.lang.japaneseName"></el-input>
            </el-form-item>
            <el-form-item label="意大利名称">
              <el-input v-model="provinceInfoForm.lang.italianName"></el-input>
            </el-form-item>
            <el-form-item label="俄语名称">
              <el-input v-model="provinceInfoForm.lang.russiaName"></el-input>
            </el-form-item>
            <el-form-item label="法语名称">
              <el-input v-model="provinceInfoForm.lang.frenchName"></el-input>
            </el-form-item>
            <el-form-item label="西班牙名称">
              <el-input v-model="provinceInfoForm.lang.spainName"></el-input>
            </el-form-item>
            <el-form-item label="德语名称">
              <el-input v-model="provinceInfoForm.lang.germanName"></el-input>
            </el-form-item>
            <el-form-item label="葡语名称">
              <el-input v-model="provinceInfoForm.lang.portugueseName"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="provinceInfoSave">保存</el-button>
              <el-button type="danger" @click="provinceInfoClose">返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <!--新增&编辑市信息 弹框 -->
    <el-dialog :title="cityInfoTitle" v-model="cityInfoDialog" class="log-group" size="small"
               :before-close="cityInfoClose">
      <el-row>
        <el-col :span="18">
          <el-form :model="cityInfoForm" label-width="200px" class="dialog-Form" :rules="cityRules" ref="cityRulesForm">
            <el-form-item label="国家名称" prop="countryCode">
              <el-select v-model="cityInfoForm.countryCode" @change="getProvince(cityInfoForm.countryCode)" clearable
                         :disabled="cityInfoForm.cIsDisabled" filterable>
                <el-option v-for="item in stateCode" :key="item.cCode" :label="item.cName"
                           :value="item.cCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="州/省名称" prop="provinceCode">
              <el-select v-model="cityInfoForm.provinceCode" clearable filterable>
                <el-option v-for="item in province" :key="item.pCode" :label="item.pName"
                           :value="item.pCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市名称" prop="cityName">
              <el-input v-model="cityInfoForm.cityName" @change="isExistCityByName(cityInfoForm.cityName)"></el-input>
            </el-form-item>
            <el-form-item label="城市编码" prop="cityCode">
              <el-input v-model="cityInfoForm.cityCode" @change="isExistCityByCode(cityInfoForm.cityCode)"></el-input>
            </el-form-item>
            <el-form-item label="邮编（起）">
              <el-row>
                <el-col :span="10">
                  <el-input v-model="cityInfoForm.zipcodeStart"></el-input>
                </el-col>
                <el-col :span="4" class="text-center">
                  <span>邮编（止）</span>
                </el-col>
                <el-col :span="10">
                  <el-input v-model="cityInfoForm.zipcodeEnd"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="日语名称">
              <el-input v-model="cityInfoForm.lang.japaneseName"></el-input>
            </el-form-item>
            <el-form-item label="意大利名称">
              <el-input v-model="cityInfoForm.lang.italianName"></el-input>
            </el-form-item>
            <el-form-item label="俄语名称">
              <el-input v-model="cityInfoForm.lang.russiaName"></el-input>
            </el-form-item>
            <el-form-item label="法语名称">
              <el-input v-model="cityInfoForm.lang.frenchName"></el-input>
            </el-form-item>
            <el-form-item label="西班牙名称">
              <el-input v-model="cityInfoForm.lang.spainName"></el-input>
            </el-form-item>
            <el-form-item label="德语名称">
              <el-input v-model="cityInfoForm.lang.germanName"></el-input>
            </el-form-item>
            <el-form-item label="葡语名称">
              <el-input v-model="cityInfoForm.lang.portugueseName"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="cityInfoSave">保存</el-button>
              <el-button type="danger" @click="cityInfoClose">返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        self: this,
        loading: false,
        activeName: 'base',
        stateCode: [],//国家 list
        province: [], //州省 list
        city: [], //城市 list
        //基础地址信息参数
        base: {
          page: 1,
          page_size: 10,
          countryCode: '',
          provinceCode: '',
          cityCode: '',
          zipcode: ''
        },
        btotal: 0,
        baseAddInfo: [],
        //国家信息参数
        country: {
          page: 1,
          page_size: 10,
          countryCode: '',
        },
        ctotal: 10,
        countryInfo: [],
        //编辑&新增国家 弹框 参数
        countryInfoDialog: false,
        countryInfoTitle: '',
        countryWindow: '',
        countryInfoForm: {
          countryName: '',
          countryCode: '',
          zipcodeStart: '',
          zipcodeEnd: '',
          countryId: '',
          beginCountryName: '',
          beginCountryCode: '',
          lang: {
            japaneseName: '',
            italianName: '',
            russiaName: '',
            frenchName: '',
            spainName: '',
            germanName: '',
            portugueseName: ''
          },
        },
        countryRules: {
          countryName: [{required: true, message: '国家名称不能为空！', trigger: 'blur'}],
          countryCode: [{required: true, message: '国家编码不能为空！', trigger: 'blur'}],
        },
        //州省信息参数
        provinceForm: {
          page: 1,
          page_size: 10,
          countryCode: '',
          provinceCode: '',
        },
        ptotal: 10,
        provinceInfo: [],
        //编辑&新增州省 弹框 参数
        provinceInfoDialog: false,
        provinceInfoTitle: '',
        provinceWindow: '',
        provinceInfoForm: {
          countryCode: '',
          provinceName: '',
          provinceCode: '',
          zipcodeStart: '',
          zipcodeEnd: '',
          id: '',
          beginProvinceName: '',
          beginProvinceCode: '',
          pIsDisabled: false,
          lang: {
            japaneseName: '',
            italianName: '',
            russiaName: '',
            frenchName: '',
            spainName: '',
            germanName: '',
            portugueseName: ''
          },
        },
        provinceRules: {
          countryCode: [{required: true, message: '请选择国家名称！', trigger: 'change'}],
          provinceName: [{required: true, message: '州/省名称不能为空！', trigger: 'blur'}],
          provinceCode: [{required: true, message: '州/省编码不能为空！', trigger: 'blur'}],
        },

        //市信息 参数
        cityForm: {
          page: 1,
          page_size: 10,
          countryCode: '',
          provinceCode: '',
          cityCode: '',
        },
        citytotal: 0,
        cityTableInfo: [],
        //编辑&新增城市信息 弹框 参数
        cityInfoDialog: false,
        cityInfoTitle: '',
        cityWindow: '',
        cityInfoForm: {
          countryCode: '',
          provinceCode: '',
          provinceName: '',
          cityName: '',
          cityCode: '',
          zipcodeStart: '',
          zipcodeEnd: '',
          id: '',
          cIsDisabled: false,
          beginCityName: '',
          beginCityCode: '',
          lang: {
            japaneseName: '',
            italianName: '',
            russiaName: '',
            frenchName: '',
            spainName: '',
            germanName: '',
            portugueseName: ''
          },
        },
        cityRules: {
          countryCode: [{required: true, message: '请选择国家名称！', trigger: 'change'}],
          provinceCode: [{required: true, message: '请选择州/省名称！', trigger: 'change'}],
          cityName: [{required: true, message: '城市名称不能为空！', trigger: 'blur'}],
          cityCode: [{required: true, message: '城市编码不能为空！', trigger: 'blur'}],
        },
        isExistCountryName: '',
        isExistCountryCode: '',
        isExistProvinceName: '',
        isExistProvinceCode: '',
        isExistCityName: '',
        isExistCityCode: '',
      };
    },
    created () {
      this.base.countryCode = '';
      this.base.provinceCode = '';
      this.base.cityCode = '';
      this.base.zipcode = '';
      this.getStateCode();
    },
    methods: {
      //获得国家
      getStateCode (){
        this.stateCode = [];
        let args = {
          page_size: 2000,
          page: 1,
          countryCode: '',
        };
        this.$http.get('logistics/country-info/list', {params: args}).then(res => {
          if (res.body.code === 0) {
            var cCode = '', cName = '';
            for (var i = 0; i < res.body.data.list.length; i++) {
              cCode = res.body.data.list[i].countryCode;
              cName = res.body.data.list[i].countryName;
              this.stateCode.push({cCode: cCode, cName: cName});
            }
          }
        });
      },
      //获取洲/省
      getProvince (countryCode){
        this.province = [];
        this.base.provinceCode = '';
        this.provinceForm.provinceCode = '';
        this.cityForm.provinceCode = '';
        this.cityForm.cityCode = '';
        if (countryCode === '') {
          return false;
        }
        this.$http.get('logistics/public/get-provinces-by-country-code', {params: {countryCode: countryCode}}).then(res => {
          if (res.body.code === 0) {
            //console.log(res.body.data);
            var pCode = '', pName = '';
            for (var i = 0; i < res.body.data.length; i++) {
              pCode = res.body.data[i].provinceCode;
              pName = res.body.data[i].provinceName;
              this.province.push({pCode: pCode, pName: pName});
            }
            //console.log(this.province);
          }
        });
      },
      //获取城市
      getCity (provinceCode){
        this.city = [];
        this.base.cityCode = '';
        this.$http.get('logistics/public/get-cities-by-province-code', {params: {provinceCode: provinceCode}}).then(res => {
          if (res.body.code === 0) {
           // console.log(res.body.data);
            var code = '', name = '';
            for (var i = 0; i < res.body.data.length; i++) {
              code = res.body.data[i].cityCode;
              name = res.body.data[i].cityName;
              this.city.push({code: code, name: name});
            }
            //console.log(this.city);
          }
        });
      },
      baseSearch (){
        let params = {
          page_size: this.base.page_size,
          page: this.base.page,
          countryCode: this.base.countryCode,
          provinceCode: this.base.provinceCode,
          cityCode: this.base.cityCode,
          zipcode: this.base.zipcode,
        };
        this.loading = true;
        this.$http.get('logistics/country-info/base-list', {params: params}).then(res => {
          this.loading = false;
          if (res.body.code === 0) {
            //console.log(res.body);
            this.baseAddInfo = res.body.data.list;
            this.btotal = res.body.data.totalCount;
          } else {
            this.baseAddInfo = [];
          }
        })
      },
      baseChangePageSize (val){
        this.base.page_size = val;
        let params = {
          page_size: this.base.page_size,
          page: this.base.page,
          countryCode: this.base.countryCode,
          provinceCode: this.base.provinceCode,
          cityCode: this.base.cityCode,
        };
        this.getBaseAddData(params);
      },
      baseChangePage (val){
        this.base.page = val;
        let params = {
          page_size: this.base.page_size,
          page: this.base.page,
          countryCode: this.base.countryCode,
          provinceCode: this.base.provinceCode,
          cityCode: this.base.cityCode,
        };
        this.getBaseAddData(params);
      },
      //国家信息方法
      countrySearch (){
        this.countryInfo = [];
        let params = {
          page_size: this.country.page_size,
          page: this.country.page,
          countryCode: this.country.countryCode
        };
        this.loading = true;
        this.$http.get('logistics/country-info/list', {params: params}).then(res => {
          this.loading = false;
          if (res.body.code === 0) {
//            console.log(res.body.data.list);
            this.countryInfo = res.body.data.list;
            this.ctotal = res.body.data.totalCount;
          } else {
            this.countryInfo = [];
          }
        })
      },
      countryDelete (row){
        //console.log(row.countryId);
        this.$confirm('是否删除该项?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('logistics/country-info/delete', {country_id: row.countryId}).then(res => {
            if (res.body.code === 0) {
              let index = this.countryInfo.indexOf(row);
              this.countryInfo.splice(index, 1);
              this.ctotal--;
              this.getStateCode();
              this.$message({
                type: 'success',
                message: '删除成功'
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
      countryChangePageSize (val){
        this.country.page_size = val;
        this.countrySearch();
      },
      countryChangePage (val){
        this.country.page = val;
        this.countrySearch();
      },
      //编辑&添加国家信息方法
      countryOption (type, row){
        this.countryInfoDialog = true;
        if (type === 1) {
          this.countryWindow = 1;
          this.countryInfoTitle = '新增国家';
          this.countryInfoForm.countryName = '';
          this.countryInfoForm.countryCode = '';
          this.countryInfoForm.zipcodeStart = '';
          this.countryInfoForm.zipcodeEnd = '';
          this.countryInfoForm.countryId = '';
          this.countryInfoForm.lang.japaneseName = '';
          this.countryInfoForm.lang.italianName = '';
          this.countryInfoForm.lang.russiaName = '';
          this.countryInfoForm.lang.frenchName = '';
          this.countryInfoForm.lang.spainName = '';
          this.countryInfoForm.lang.germanName = '';
          this.countryInfoForm.lang.portugueseName = '';

        } else {
          this.countryWindow = 2;
          this.countryInfoTitle = '编辑国家信息';
          this.countryInfoForm.countryName = row.countryName;
          this.countryInfoForm.countryCode = row.countryCode;
          this.countryInfoForm.zipcodeStart = row.zipcodeStart;
          this.countryInfoForm.zipcodeEnd = row.zipcodeEnd;
          this.countryInfoForm.countryId = row.countryId;
          this.countryInfoForm.beginCountryName = row.countryName;
          this.countryInfoForm.beginCountryCode = row.countryCode;
          var lan = {};
          if (row.lang !== '') {
            lan = JSON.parse(row.lang);
            this.countryInfoForm.lang.japaneseName = lan.japaneseName;
            this.countryInfoForm.lang.italianName = lan.italianName;
            this.countryInfoForm.lang.russiaName = lan.russiaName;
            this.countryInfoForm.lang.frenchName = lan.frenchName;
            this.countryInfoForm.lang.spainName = lan.spainName;
            this.countryInfoForm.lang.germanName = lan.germanName;
            this.countryInfoForm.lang.portugueseName = lan.portugueseName;
          }
        }
      },
      countryInfoClose (){
        this.$refs['countryRulesForm'].resetFields();
        this.countryInfoDialog = false;
      },
      isExistCountryByName (countryName){
        self.isExistCountryName = false;
        if (this.countryWindow === 1) {
          this.isExistCountryByNameMothed(countryName, function () {
            self.isExistCountryName = true;
          });
        } else if (this.countryWindow === 2) {
          if (this.countryInfoForm.beginCountryName !== this.countryInfoForm.countryName) {
            this.isExistCountryByNameMothed(countryName, function () {
              self.isExistCountryName = true;
            });
          }
        }
      },
      isExistCountryByNameMothed (name, callback){
        this.$http.get('logistics/public/is-exist', {params: {fields: 'countryName', value: name}}).then(res => {
          if (res.body.code === 60055) {
            callback();
            this.$message.error('你输入的国家名称已存在!');
          } else if (res.body.code === 0) {
            //console.log('国家名称不存在，可以输入');
          }
        });
      },
      isExistCountryByCode (countrycode){
        self.isExistCountryCode = false;
        if (this.countryWindow === 1) {
          this.isExistCountryByCodeMothed(countrycode, function () {
            self.isExistCountryCode = true;
          });
        } else if (this.countryWindow === 2) {
          if (this.countryInfoForm.beginCountryCode !== this.countryInfoForm.countryCode) {
            this.isExistCountryByCodeMothed(countrycode, function () {
              self.isExistCountryCode = true;
            });
          }
        }
      },
      isExistCountryByCodeMothed (code, callback){
        this.$http.get('logistics/public/is-exist', {params: {fields: 'countryCode', value: code}}).then(res => {
          if (res.body.code === 60023) {
            this.$message.error('你输入的国家编码已存在!');
            callback();
          } else if (res.body.code === 0) {
            //console.log('国家编码不存在，可以输入');
          }
        })
      },
      countryInfoSave (){
        let params = {};
        this.$refs['countryRulesForm'].validate((valid) => {
          if (valid) {
            if (self.isExistCountryName) {
              this.$message.error('你输入的国家名称已存在!');
              return false;
            }
            if (self.isExistCountryCode) {
              this.$message.error('你输入的国家编码已存在!');
              return false;
            }
            if (this.countryWindow === 1) {
              params = {
                countryCode: this.countryInfoForm.countryCode,
                countryName: this.countryInfoForm.countryName,
                zipcodeStart: this.countryInfoForm.zipcodeStart,
                zipcodeEnd: this.countryInfoForm.zipcodeEnd,
                lang: JSON.stringify(this.countryInfoForm.lang)
              };
              this.$http.post('logistics/country-info/add', params).then(res => {
                if (res.body.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  });
                  this.countryInfoDialog = false;
                  this.countrySearch();
                } else {
                  this.$message.error(res.body.message);
                }
              });
            } else if (this.countryWindow === 2) {
              params = {
                countryCode: this.countryInfoForm.countryCode,
                countryName: this.countryInfoForm.countryName,
                zipcodeStart: this.countryInfoForm.zipcodeStart,
                zipcodeEnd: this.countryInfoForm.zipcodeEnd,
                lang: JSON.stringify(this.countryInfoForm.lang),
                countryId: this.countryInfoForm.countryId
              };
              this.$http.post('logistics/country-info/edit', params).then(res => {
                if (res.body.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  });
                  this.countrySearch();
                  this.countryInfoDialog = false;
                } else {
                  this.$message.error(res.body.message);
                }
              });
            }
          } else {
            return false;
          }
        });
      },
      //州省信息方法
      provinceSearch (){
        this.provinceInfo = [];
        let params = {
          page_size: this.provinceForm.page_size,
          page: this.provinceForm.page,
          countryCode: this.provinceForm.countryCode,
          provinceCode: this.provinceForm.provinceCode
        };
        this.loading = true;
        this.$http.get('logistics/country-info/province-list', {params: params}).then(res => {
          this.loading = false;
          if (res.body.code === 0) {
            //console.log(res.body.data.list);
            this.provinceInfo = res.body.data.list;
            this.ptotal = res.body.data.totalCount;
          } else {
            this.provinceInfo = [];
          }
        })
      },
      provinceChangePageSize (val){
        this.provinceForm.page_size = val;
        this.provinceSearch();
      },
      provinceChangePage (val){
        this.provinceForm.page = val;
        this.provinceSearch();
      },
      provinceDelete (row){
        //console.log(row.id);
        this.$confirm('是否删除该项?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('logistics/country-info/province-delete', {province_id: row.id}).then(res => {
            if (res.body.code === 0) {
              let index = this.provinceInfo.indexOf(row);
              this.provinceInfo.splice(index, 1);
              this.ptotal--;
              this.$message({
                type: 'success',
                message: '删除成功'
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
      provinceOption(type, row){
        this.provinceInfoDialog = true;
        this.provinceInfoForm.pIsDisabled = false;
        if (type === 1) {
          this.provinceInfoTitle = '新增州/省';
          this.provinceWindow = 1;
          this.provinceInfoForm.countryCode = '';
          this.provinceInfoForm.provinceName = '';
          this.provinceInfoForm.provinceCode = '';
          this.provinceInfoForm.zipcodeStart = '';
          this.provinceInfoForm.zipcodeEnd = '';
          this.provinceInfoForm.lang.japaneseName = '';
          this.provinceInfoForm.lang.italianName = '';
          this.provinceInfoForm.lang.russiaName = '';
          this.provinceInfoForm.lang.frenchName = '';
          this.provinceInfoForm.lang.spainName = '';
          this.provinceInfoForm.lang.germanName = '';
          this.provinceInfoForm.lang.portugueseName = '';
          this.provinceInfoForm.pIsDisabled = false;
        } else if (type === 2) {
          this.provinceInfoTitle = '编辑州/省';
          this.provinceWindow = 2;
          this.provinceInfoForm.countryCode = row.countryCode;
          this.provinceInfoForm.provinceName = row.provinceName;
          this.provinceInfoForm.provinceCode = row.provinceCode;
          this.provinceInfoForm.zipcodeStart = row.zipcodeStart;
          this.provinceInfoForm.zipcodeEnd = row.zipcodeEnd;
          this.provinceInfoForm.id = row.id;
          this.provinceInfoForm.countryName = row.countryName;
          this.provinceInfoForm.countryCode = row.countryCode;
          this.provinceInfoForm.zipcodeStart = row.zipcodeStart;
          this.provinceInfoForm.zipcodeEnd = row.zipcodeEnd;
          this.provinceInfoForm.beginProvinceName = row.provinceName;
          this.provinceInfoForm.beginProvinceCode = row.provinceCode;
          this.provinceInfoForm.pIsDisabled = true;
          var lan = {};
          if (row.lang !== '') {
            lan = JSON.parse(row.lang);
            this.provinceInfoForm.lang.japaneseName = lan.japaneseName;
            this.provinceInfoForm.lang.italianName = lan.italianName;
            this.provinceInfoForm.lang.russiaName = lan.russiaName;
            this.provinceInfoForm.lang.frenchName = lan.frenchName;
            this.provinceInfoForm.lang.spainName = lan.spainName;
            this.provinceInfoForm.lang.germanName = lan.germanName;
            this.provinceInfoForm.lang.portugueseName = lan.portugueseName;
          }
        }
      },
      provinceInfoClose (){
        this.$refs['provinceRulesForm'].resetFields();
        this.provinceInfoDialog = false;
      },
      isExistProvinceByName (provinceName){
        self.isExistProvinceName = false;
        if (this.provinceWindow === 1) {
          this.isExistProvinceByNameMothed(provinceName, function () {
            self.isExistProvinceName = true;
          });
        } else if (this.provinceWindow === 2) {
          if (this.provinceInfoForm.beginProvinceName !== this.provinceInfoForm.provinceName) {
            this.isExistProvinceByNameMothed(provinceName, function () {
              self.isExistProvinceName = true;
            });
          }
        }
      },
      isExistProvinceByNameMothed (name, callback){
        this.$http.get('logistics/public/province-is-exist', {
          params: {
            fields: 'provinceName',
            value: name
          }
        }).then(res => {
          if (res.body.code === 60056) {
            this.$message.error('你输入的州/省名称已存在!');
            callback();
          } else if (res.body.code === 0) {
            //console.log('州/省不存在，可以输入');
          }
        })
      },
      isExistProvinceByCode (provinceCode){
        self.isExistProvinceCode = false;
        if (this.provinceWindow === 1) {
          this.isExistProvinceByCodeMothed(provinceCode, function () {
            self.isExistProvinceCode = true;
          });
        } else if (this.provinceWindow === 2) {
          if (this.provinceInfoForm.beginProvinceCode !== this.provinceInfoForm.provinceCode) {
            this.isExistProvinceByCodeMothed(provinceCode, function () {
              self.isExistProvinceCode = true;
            });
          }
        }
      },
      isExistProvinceByCodeMothed (code, callback){
        this.$http.get('logistics/public/province-is-exist', {
          params: {
            fields: 'provinceCode',
            value: code
          }
        }).then(res => {
          if (res.body.code === 60024) {
            this.$message.error('你输入的州/省编码已存在!');
            callback();
          } else if (res.body.code === 0) {
            //console.log('州/省不存在，可以输入');
          }
        })
      },
      provinceInfoSave (){
        let params = {};
        this.$refs['provinceRulesForm'].validate((valid) => {
          if (valid) {
            if (self.isExistProvinceName) {
              this.$message.error('你输入的州/省名称已存在!');
              return false;
            }
            if (self.isExistProvinceCode) {
              this.$message.error('你输入的州/省编码已存在!');
              return false;
            }
            if (this.provinceWindow === 1) {
              params = {
                provinceCode: this.provinceInfoForm.provinceCode,
                provinceName: this.provinceInfoForm.provinceName,
                countryCode: this.provinceInfoForm.countryCode,
                zipcodeStart: this.provinceInfoForm.zipcodeStart,
                zipcodeEnd: this.provinceInfoForm.zipcodeEnd,
                lang: JSON.stringify(this.provinceInfoForm.lang),
              };
              this.$http.post('logistics/country-info/province-add', params).then(res => {
                if (res.body.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  });
                  this.provinceInfoDialog = false;
                  this.provinceSearch();
                } else {
                  this.$message.error(res.body.message);
                }
              });
            } else if (this.provinceWindow === 2) {
              params = {
                provinceCode: this.provinceInfoForm.provinceCode,
                provinceName: this.provinceInfoForm.provinceName,
                countryCode: this.provinceInfoForm.countryCode,
                zipcodeStart: this.provinceInfoForm.zipcodeStart,
                zipcodeEnd: this.provinceInfoForm.zipcodeEnd,
                lang: JSON.stringify(this.provinceInfoForm.lang),
                id: this.provinceInfoForm.id,
              };
              this.$http.post('logistics/country-info/province-edit', params).then(res => {
                if (res.body.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  });
                  this.provinceInfoDialog = false;
                  this.provinceSearch();
                } else {
                  this.$message.error(res.body.message);
                }
              });
            }
          }
        });
      },
      //市信息 方法
      citySearch (){
        this.cityTableInfo = [];
        let params = {
          page_size: this.cityForm.page_size,
          page: this.cityForm.page,
          countryCode: this.cityForm.countryCode,
          provinceCode: this.cityForm.provinceCode,
          cityCode: this.cityForm.cityCode
        };
        this.loading = true;
        this.$http.get('logistics/country-info/city-list', {params: params}).then(res => {
          this.loading = false;
          if (res.body.code === 0) {
            //console.log(res.body.data.list);
            this.cityTableInfo = res.body.data.list;
            this.citytotal = res.body.data.totalCount;
          } else {
            this.cityTableInfo = [];
          }
        })
      },
      cityDelete (row){
        //console.log(row.id);
        this.$confirm('是否删除该项?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('logistics/country-info/city-delete', {city_id: row.id}).then(res => {
            if (res.body.code == 0) {
              let index = this.cityTableInfo.indexOf(row);
              this.cityTableInfo.splice(index, 1);
              this.citytotal--;
              this.$message({
                type: 'success',
                message: '删除成功'
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
      cityChangePageSize (val){
        this.cityForm.page_size = val;
        this.citySearch();
      },
      cityChangePage (val){
        this.cityForm.page = val;
        this.citySearch();
      },
      cityOption (type, row){
        this.cityInfoDialog = true;
        this.cityInfoForm.cIsDisabled = false;
        if (type === 1) {
          this.cityWindow = 1;
          this.cityInfoTitle = '新增城市';
          this.cityInfoForm.countryCode = '';
          this.cityInfoForm.provinceCode = '';
          this.cityInfoForm.cityName = '';
          this.cityInfoForm.cityCode = '';
          this.cityInfoForm.zipcodeStart = '';
          this.cityInfoForm.zipcodeEnd = '';
          this.cityInfoForm.lang.japaneseName = '';
          this.cityInfoForm.lang.italianName = '';
          this.cityInfoForm.lang.russiaName = '';
          this.cityInfoForm.lang.frenchName = '';
          this.cityInfoForm.lang.spainName = '';
          this.cityInfoForm.lang.germanName = '';
          this.cityInfoForm.lang.portugueseName = '';
        }
        else {
          this.cityWindow = 2;
          this.cityInfoTitle = '编辑城市信息';
          this.cityInfoForm.cIsDisabled = true;
          this.cityInfoForm.countryCode = row.countryCode;
          this.cityInfoForm.provinceCode = row.provinceCode;
          this.cityInfoForm.cityName = row.cityName;
          this.cityInfoForm.cityCode = row.cityCode;
          this.cityInfoForm.zipcodeStart = row.zipcodeStart;
          this.cityInfoForm.zipcodeEnd = row.zipcodeEnd;
          this.cityInfoForm.id = row.id;
          this.cityInfoForm.beginCityName = row.cityName;
          this.cityInfoForm.beginCityCode = row.cityCode;
          var lan = {};
          if (row.lang != '') {
            lan = JSON.parse(row.lang);
            this.cityInfoForm.lang.japaneseName = lan.japaneseName;
            this.cityInfoForm.lang.italianName = lan.italianName;
            this.cityInfoForm.lang.russiaName = lan.russiaName;
            this.cityInfoForm.lang.frenchName = lan.frenchName;
            this.cityInfoForm.lang.spainName = lan.spainName;
            this.cityInfoForm.lang.germanName = lan.germanName;
            this.cityInfoForm.lang.portugueseName = lan.portugueseName;
          }
        }
      },
      cityInfoClose (){
        this.$refs['cityRulesForm'].resetFields();
        this.cityInfoDialog = false;
      },
      isExistCityByName (cityName){
        self.isExistCityName = false;
        if (this.cityWindow === 1) {
          this.isExistcityByNameMothed(cityName, function () {
            self.isExistCityName = true;
          });
        } else if (this.cityWindow === 2) {
          if (this.cityInfoForm.beginCityName !== this.cityInfoForm.cityName) {
            this.isExistcityByNameMothed(cityName, function () {
              self.isExistCityName = true;
            });
          }
        }
      },
      isExistcityByNameMothed (name, callback){
        this.$http.get('logistics/public/city-is-exist', {params: {fields: 'cityName', value: name}}).then(res => {
          if (res.body.code === 60057) {
            callback();
            this.$message.error('你输入的城市名称已存在!');
          } else if (res.body.code === 0) {
            //console.log('城市名称不存在，可以输入');
          }
        });
      },
      isExistCityByCode (cityCode){
        self.isExistCityCode = false;
        if (this.cityWindow === 1) {
          this.isExistcityByCodeMothed(cityCode, function () {
            self.isExistCityCode = true;
          });
        } else if (this.cityWindow === 2) {
          if (this.cityInfoForm.beginCityCode !== this.cityInfoForm.cityCode) {
            this.isExistcityByCodeMothed(cityCode, function () {
              self.isExistCityCode = true;
            });
          }
        }
      },
      isExistcityByCodeMothed (code, callback){
        this.$http.get('logistics/public/city-is-exist', {params: {fields: 'cityCode', value: code}}).then(res => {
          if (res.body.code === 60025) {
            callback();
            this.$message.error('你输入的城市编码已存在!');
          } else if (res.body.code === 0) {
           // console.log('城市编码不存在，可以输入');
          }
        });
      },
      cityInfoSave (){
        let params = {};
        this.$refs['cityRulesForm'].validate((valid) => {
          if (valid) {
            if (self.isExistCityName) {
              this.$message.error('你输入的城市名称已存在!');
              return false;
            }
            if (self.isExistCityCode) {
              this.$message.error('你输入的城市编码已存在!');
              return false;
            }
            if (this.cityWindow === 1) {
              params = {
                provinceCode: this.cityInfoForm.provinceCode,
                cityCode: this.cityInfoForm.cityCode,
                cityName: this.cityInfoForm.cityName,
                zipcodeStart: this.cityInfoForm.zipcodeStart,
                zipcodeEnd: this.cityInfoForm.zipcodeEnd,
                countryCode: this.cityInfoForm.countryCode,
                lang: JSON.stringify(this.cityInfoForm.lang),
              };
              this.$http.post('logistics/country-info/city-add', params).then(res => {
                if (res.body.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  });
                  this.cityInfoDialog = false;
                  this.citySearch();
                } else {
                  this.$message.error(res.body.message);
                }
                ;
              });
            } else {
              params = {
                provinceCode: this.cityInfoForm.provinceCode,
                cityCode: this.cityInfoForm.cityCode,
                cityName: this.cityInfoForm.cityName,
                zipcodeStart: this.cityInfoForm.zipcodeStart,
                zipcodeEnd: this.cityInfoForm.zipcodeEnd,
                countryCode: this.cityInfoForm.countryCode,
                id: this.cityInfoForm.id,
                lang: JSON.stringify(this.cityInfoForm.lang),
              };
              this.$http.post('logistics/country-info/city-edit', params).then(res => {
                if (res.body.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!'
                  });
                  this.cityInfoDialog = false;
                  this.citySearch();
                } else {
                  this.$message.error(res.body.message);
                }
              });
            }
          } else {
            return false;
          }
        })
      },
      handleClick (tab){
        if (tab.name === "base") {
          this.base.countryCode = '';
          this.base.provinceCode = '';
          this.base.cityCode = '';
          this.base.zipcode = '';
          this.baseAddInfo = [];
          //console.log(this.stateCode);
        }
        if (tab.name === "country") {
          this.country.countryCode = '';
          this.countrySearch(); //加载国家信息数据
          //console.log(this.stateCode);
        }
        if (tab.name === "province") {
          this.provinceForm.countryCode = '';
          this.provinceForm.provinceCode = '';
          this.provinceSearch(); //加载州省信息数据
          //console.log(this.stateCode);
        }
        if (tab.name === "city") {
          this.cityForm.countryCode = '';
          this.cityForm.provinceCode = '';
          this.cityForm.cityCode = '';
          this.cityTableInfo = [];
          //console.log(this.stateCode);
        }
      },
    }
  }
</script>

<style>
  .dialog-Form .el-form-item {
    margin-bottom: 20px !important;
  }
</style>
