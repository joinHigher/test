<template>
  <!--物流费用模拟计算-->
  <div>
    <el-tabs v-model="type" type="card">
      <el-tab-pane label="包邮运费计算" name="freeFreight">
        <el-tabs v-model="calculationMethodFirst">
          <el-tab-pane label="销售仓包邮运费计算" name="first">
            <div class="el-container">
              <el-form inline :model="wareHouseFreeFreightCalculationOption">
                <el-form-item label="渠道">
                  <el-select v-model="wareHouseFreeFreightCalculationOption.pipelineCode" placeholder="请选择" clearable>
                    <el-option v-for="item in pipelineList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="销售仓">
                  <el-select v-model="wareHouseFreeFreightCalculationOption.virWhCode" placeholder="请选择" clearable>
                    <el-option v-for="item in wareHouseOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="sku">
                  <el-input v-model="wareHouseFreeFreightCalculationOption.sku"></el-input>
                </el-form-item>
                <el-button type="primary"
                           @click="wareHouseFreeFreightCalculate(wareHouseFreeFreightCalculationOption, 1)"
                           v-if="self.showAction_('logistics/freight/free-postage-freight')">
                  计算
                </el-button>
              </el-form>
              <el-table border :data="wareHouseFreeFreightCalculationData">
                <el-table-column prop="vwareName" label="销售仓"></el-table-column>
                <el-table-column prop="sku" label="SKU"></el-table-column>
                <el-table-column prop="volumeWeight" label="体积重"></el-table-column>
                <el-table-column prop="weight" label="实际重"></el-table-column>
                <el-table-column prop="areasName" label="包邮分区"></el-table-column>
                <el-table-column prop="costQuot" label="计费系数"></el-table-column>
                <el-table-column prop="logisticsGroupName" label="物流分组"></el-table-column>
                <el-table-column prop="logisticsInfoName" label="物流方式"></el-table-column>
                <el-table-column prop="countryCode" label="区域"></el-table-column>
                <el-table-column prop="logisticsLevel" label="物流级别"></el-table-column>
                <el-table-column prop="freeShipFee" label="销售运费"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="calculationMethodSecond">
          <el-tab-pane label="指定物流分区包邮运费计算" name="second">
            <div class="el-container">
              <el-form inline :model="assignAreaFreeFreightCalculationOption">
                <el-form-item label="sku">
                  <el-input v-model="assignAreaFreeFreightCalculationOption.sku" placeholder="可多个sku，以逗号隔开"></el-input>
                </el-form-item>
                <el-form-item label="分区id">
                  <el-input v-model="assignAreaFreeFreightCalculationOption.areaId"></el-input>
                </el-form-item>
                <el-button type="primary"
                           @click="wareHouseFreeFreightCalculate(assignAreaFreeFreightCalculationOption, 2)"
                           v-if="self.showAction_('logistics/freight/free-postage-freight')">
                  计算
                </el-button>
              </el-form>
              <el-table border :data="assignAreaFreeFreightCalculationData">
                <el-table-column prop="vwareName" label="销售仓"></el-table-column>
                <el-table-column prop="sku" label="SKU"></el-table-column>
                <el-table-column prop="volumeWeight" label="体积重"></el-table-column>
                <el-table-column prop="weight" label="实际重"></el-table-column>
                <el-table-column prop="areasName" label="包邮分区"></el-table-column>
                <el-table-column prop="costQuot" label="计费系数"></el-table-column>
                <el-table-column prop="logisticsGroupName" label="物流分组"></el-table-column>
                <el-table-column prop="logisticsInfoName" label="物流方式"></el-table-column>
                <el-table-column prop="countryCode" label="区域"></el-table-column>
                <el-table-column prop="logisticsLevel" label="物流级别"></el-table-column>
                <el-table-column prop="freeShipFee" label="销售运费"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="calculationMethodThird">
          <el-tab-pane label="指定物流分区包邮运费计算" name="third">
            <div class="el-container">
              <el-form inline :model="assignAreaFreeFreightCalculationOption1">
                <el-form-item label="sku">
                  <el-input v-model="assignAreaFreeFreightCalculationOption1.sku"></el-input>
                </el-form-item>
                <el-form-item label="分区id">
                  <el-input v-model="assignAreaFreeFreightCalculationOption1.areaId"></el-input>
                </el-form-item>
                <el-form-item label="实际重">
                  <el-input v-model="assignAreaFreeFreightCalculationOption1.weight"></el-input>
                </el-form-item>
                <el-form-item label="体积重">
                  <el-input v-model="assignAreaFreeFreightCalculationOption1.volumeWeight"></el-input>
                </el-form-item>
                <!--<span>自由输入信息</span>-->
                <el-button type="primary"
                           @click="wareHouseFreeFreightCalculate(assignAreaFreeFreightCalculationOption1, 3)"
                           v-if="self.showAction_('logistics/freight/free-postage-freight')">
                  计算
                </el-button>
              </el-form>
              <el-table border :data="assignAreaFreeFreightCalculationData1">
                <el-table-column prop="vwareName" label="销售仓"></el-table-column>
                <el-table-column prop="sku" label="SKU"></el-table-column>
                <el-table-column prop="volumeWeight" label="体积重"></el-table-column>
                <el-table-column prop="weight" label="实际重"></el-table-column>
                <el-table-column prop="areasName" label="包邮分区"></el-table-column>
                <el-table-column prop="costQuot" label="计费系数"></el-table-column>
                <el-table-column prop="logisticsGroupName" label="物流分组"></el-table-column>
                <el-table-column prop="logisticsInfoName" label="物流方式"></el-table-column>
                <el-table-column prop="countryCode" label="区域"></el-table-column>
                <el-table-column prop="logisticsLevel" label="物流级别"></el-table-column>
                <el-table-column prop="freeShipFee" label="销售运费"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="实际运费计算" name="realFreight">
        <el-tabs v-model="realFreightType" type="card">
          <el-tab-pane label="计算方式一" name="calculateMethod1">
            <div class="el-container">
              <el-form inline :model="realFreightOption">
                <el-form-item label="运费模板">
                  <el-select v-model="realFreightOption.templateId" placeholder="请选择" clearable>
                    <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="语言" labelWidth="50px">
                  <el-input v-model="realFreightOption.lang"></el-input>
                </el-form-item>
                <el-form-item label="真实仓代码">
                  <el-input v-model="realFreightOption.realWareCode"></el-input>
                </el-form-item>
                <el-form-item label="sku">
                    <el-input v-model="realFreightOption.sku"></el-input>
                </el-form-item>
                <el-form-item label="国家">
                    <el-select v-model="realFreightOption.addressInfo.countryCode" placeholder="请选择"
                               @change="getProvinceList(realFreightOption.addressInfo.countryCode)" clearable filterable>
                      <el-option v-for="item in countryList" :key="item.code" :label="item.name"
                                 :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                <!--<el-form-item label="州、省">
                    <el-select v-model="realFreightOption.addressInfo.provinceCode" placeholder="请选择"
                               @change="getCityList(realFreightOption.addressInfo.provinceCode)" clearable filterable>
                      <el-option v-for="item in provinceList" :key="item.code" :label="item.name"
                                 :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>-->
                  <!--<el-form-item label="城市" labelWidth="55px">
                    <el-select v-model="realFreightOption.addressInfo.cityName" placeholder="请选择" clearable filterable>
                      <el-option v-for="item in cityList" :key="item.code" :label="item.name"
                                 :value="item.name"></el-option>
                    </el-select>
                  </el-form-item>-->
                  <el-form-item label="州、省">
                      <el-input v-model="realFreightOption.addressInfo.provinceCode" placeholder="请输入州、省"></el-input>
                  </el-form-item>
                  <el-form-item label="城市" labelWidth="68px">
                      <el-input v-model="realFreightOption.addressInfo.cityName" placeholder="请输入城市"></el-input>
                  </el-form-item>
                <el-form-item label="详细地址" labelWidth="75px">
                    <el-input v-model="realFreightOption.addressInfo.detailAddr"></el-input>
                  </el-form-item>
                <el-form-item label="邮编" labelWidth="82px">
                    <el-input v-model="realFreightOption.addressInfo.zipCode"></el-input>
                  </el-form-item>
                <el-button type="primary" @click="realFreightCalculation(realFreightOption,1)"
                           v-if="self.showAction_('logistics/freight/real-freight-list')">
                    计算
                  </el-button>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="计算方式二" name="calculateMethod2">
            <div class="el-container">
              <el-form inline :model="wareHouseFreeFreightCalculationOption" class="update-width" labelWidth="100px">
                <el-form-item label="模板">
                  <el-select v-model="realFreightOption.templateId" placeholder="请选择" clearable>
                    <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="语言">
                  <el-input v-model="realFreightOption.lang"></el-input>
                </el-form-item>
                <el-form-item label="真实仓代码">
                  <el-input v-model="realFreightOption.realWareCode"></el-input>
                </el-form-item>
                <el-form-item label="sku" class="ml5">
                  <el-input v-model="realFreightOption.sku"></el-input>
                </el-form-item>
                <el-form-item label="长">
                  <el-input v-model="realFreightOption.length"></el-input>
                </el-form-item>
                <el-form-item label="宽">
                  <el-input v-model="realFreightOption.width"></el-input>
                </el-form-item>
                <el-form-item label="高">
                  <el-input v-model="realFreightOption.height"></el-input>
                </el-form-item>
                <el-form-item label="实际重">
                  <el-input v-model="realFreightOption.weight"></el-input>
                </el-form-item>
                <el-form-item label="体积重">
                  <el-input v-model="realFreightOption.volumeWeight"></el-input>
                </el-form-item>
                <el-form-item label="包邮运费">
                  <el-input v-model="realFreightOption.freeShipFee"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="数量">
                  <el-input v-model="realFreightOption.num"></el-input>
                </el-form-item>
                <el-form-item label="产品分类">
                  <el-input v-model="realFreightOption.forbidCatalog"></el-input>
                  <el-button @click="editCategory">编辑</el-button>
                </el-form-item>
                <el-form-item label="产品性质">
                  <el-input v-model="realFreightOption.forbidAttr"></el-input>
                  <el-button @click="editAttrs">编辑</el-button>
                </el-form-item>
                <el-form-item label="国家">
                  <el-select v-model="realFreightOption.addressInfo.countryCode" placeholder="请选择"   @change="getProvinceList(realFreightOption.addressInfo.countryCode)" clearable filterable>
                    <el-option v-for="item in countryList" :key="item.code" :label="item.name"
                               :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item label="州、省">
                  <el-select v-model="realFreightOption.addressInfo.provinceCode" placeholder="请选择" @change="getCityList(realFreightOption.addressInfo.provinceCode)" clearable filterable>
                    <el-option v-for="item in provinceList" :key="item.code" :label="item.name"
                               :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="城市">
                  <el-select v-model="realFreightOption.addressInfo.cityName" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in cityList" :key="item.code" :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </el-form-item>-->
                  <el-form-item label="州、省">
                      <el-input v-model="realFreightOption.addressInfo.provinceCode" placeholder="请输入州、省"></el-input>
                  </el-form-item>
                  <el-form-item label="城市">
                      <el-input v-model="realFreightOption.addressInfo.cityName" placeholder="请输入城市"></el-input>
                  </el-form-item>
                <el-form-item label="详细地址">
                  <el-input v-model="realFreightOption.addressInfo.detailAddr"></el-input>
                </el-form-item>
                <el-form-item label="邮编">
                  <el-input v-model="realFreightOption.addressInfo.zipCode"></el-input>
                </el-form-item>
                <el-button type="primary"
                           @click="realFreightCalculation(realFreightOption,2)"
                           v-if="self.showAction_('logistics/freight/real-freight-list')">
                  计算
                </el-button>
              </el-form>
            </div>
          </el-tab-pane>
          <a href="logistics/freight/export-log" download="log.txt" v-if="self.showAction_('logistics/freight/export-log')">下载计算流程日志</a>
          <el-tabs v-model="calculationMethodFirst">
            <el-tab-pane label="SKU信息" name="first">
              <div class="el-container">
                <el-table border :data="realFreightData.goodLists">
                  <el-table-column prop="realWareCode" label="真实仓"></el-table-column>
                  <el-table-column prop="sku" label="商品SKU"></el-table-column>
                  <el-table-column prop="length" label="长(CM)"></el-table-column>
                  <el-table-column prop="width" label="宽(CM)"></el-table-column>
                  <el-table-column prop="height" label="高(CM)"></el-table-column>
                  <el-table-column prop="realityWeight" label="实际重(KG)"></el-table-column>
                  <el-table-column prop="isFreeShip" label="包邮"></el-table-column>
                  <el-table-column prop="isOverSize" label="超尺寸"></el-table-column>
                  <el-table-column prop="shippingFee" label="包邮运费"></el-table-column>
                  <el-table-column prop="num" label="数量"></el-table-column>
                  <el-table-column prop="category" label="商品分类"></el-table-column>
                  <el-table-column prop="attr" label="商品性质"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-model="calculationMethodSecond">
            <el-tab-pane label="地址信息" name="second">
              <div class="el-container">
                <el-table border :data="realFreightData.addressInfo">
                  <el-table-column prop="countryCode" label="国家"></el-table-column>
                  <el-table-column prop="provinceName" label="州、省"></el-table-column>
                  <el-table-column prop="cityName" label="城市"></el-table-column>
                  <el-table-column prop="detailAddr" label="详细地址"></el-table-column>
                  <el-table-column prop="zipCode" label="邮编"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-model="calculationMethodThird">
            <el-tab-pane label="物流输出结果" name="third">
              <div class="el-container">
                <el-table border :data="realFreightData.actualList">
                  <el-table-column prop="realWareCode" label="真实仓"></el-table-column>
                  <el-table-column prop="logisticsGroupName" label="物流分组名称（对应语言名称）"></el-table-column>
                  <el-table-column prop="logisticsLevel" label="物流级别"></el-table-column>
                  <el-table-column prop="logisticsCode" label="物流名称（对应语言名称）"></el-table-column>
                  <el-table-column prop="logisticsCode" label="物流方式（物流编码）"></el-table-column>
                  <el-table-column prop="costQuot" label="物流分区"></el-table-column>
                  <el-table-column prop="expectTime" label="预计时间"></el-table-column>
                  <el-table-column prop="costFee" label="成本运费"></el-table-column>
                  <el-table-column prop="saleFee" label="销售运费"></el-table-column>
                  <el-table-column prop="diffFee" label="运费差额（销售运费-抱有运费）"></el-table-column>
                  <el-table-column prop="registerFee" label="挂号费"></el-table-column>
                  <el-table-column prop="serviceFee" label="服务费"></el-table-column>
                  <el-table-column prop="remoteFee" label="偏远费"></el-table-column>
                  <el-table-column prop="shippingFee" label="包邮运费"></el-table-column>
                  <el-table-column prop="actualFee" label="实际运费"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>

    <CategorySelect ref="categorySelect" :categoryForm="categoryDialogObj"></CategorySelect>
    <AttrSelect ref="attrSelect" :attrsForm="attrsDialogObj"></AttrSelect>

  </div>
</template>

<script>
  import Vue from 'vue'
  import logistics from '../js/logistics'
  Vue.use(logistics);
  import CategorySelect from '../template/categorySelect'
  import AttrSelect from '../template/attrSelect.vue'

  export default {
    data () {
      return {
        self: this,
        tableData: [],
        type: 'freeFreight',
        calculationMethodFirst: 'first',
        calculationMethodSecond: 'second',
        calculationMethodThird: 'third',
        realFreightType: 'calculateMethod1',
        templateList: this.getTemplateList(), //模板
        wareHouseOption: this.getSaleWareData(),
        pipelineList: this.getPipe(),
        wareHouseFreeFreightCalculationOption: {
          virWhCode: '',
          sku: ''
        },
        wareHouseFreeFreightCalculationData: [],
        assignAreaFreeFreightCalculationOption: {
          virWhCode: '',
          sku: '',
          areaId: ''
        },
        assignAreaFreeFreightCalculationData: [],
        assignAreaFreeFreightCalculationOption1: {
          virWhCode: '',
          sku: '',
          areaId: '',
          weight: '',
          volumeWeight: ''
        },
        assignAreaFreeFreightCalculationData1: [],
        realFreightOption: {
          templateId: '',
          sku: '',
          areaId: '',
          weight: '',
          volumeWeight: null,
          lang: '',
          addressInfo: {
            countryCode: '',
            provinceCode: '',
            cityName: '',
            detailAddr: '',
            zipCode: '',
          },
          length: null,
          width: null,
          height: null,
          realWareCode: null,
          num: null,
          forbidCatalog: '',
          forbidAttr: '',
          freeShipFee: null,
          overSize: null,
        },
        realFreightData: {
          goodLists: [],
          addressInfo: [],
          actualList: [],
        },

        countryList: [],
        provinceList: [],
        cityList: [],
        loading : false,

        categoryDialogObj: {
          title: '产品分类',
          categoryDialog: false,
          categoryList: [],
          checkbox: '',
          defaultProps: {
            children: 'subCategoryList',
            label: (data, node) => { return node.data.categoryMultiLang.categoryName;}
          },
          itemIdSelected: [],
        },

        attrsDialogObj: {
          attrsDialog: false,
          title: '产品性质',
          checkbox:'',
          attrsList: [],
          defaultProps:{
            label: 'propertyName'
          },
          attrsIdSelected: [],
        },

      };
    },
    created () {
      //this.wareHoseList();
      this.getCountryList();
    },
    watch: {
      'categoryDialogObj.itemIdSelected': function (val, oldval){
        this.realFreightOption.forbidCatalog = val.join();
      },
      'attrsDialogObj.attrsIdSelected' : function (val, oldval) {
        this.realFreightOption.forbidAttr = val.join();
      },
    },
    methods: {
      /**
       * 国家列表
       */
      getCountryList() {
        this.countryList = [];
        this.$http.get('logistics/public/all-list', {params: {}}).then(res => {
          if (res.body.code === 0 && res.body.data) {
            this.countryList = res.body.data.map(function (item) {
              return {code: item.countryCode, name: item.countryName};
            });
            //console.log(this.countryList);
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
      /**
       * 省、州列表
       * @param countryCode 国家代码
       */
      getProvinceList(countryCode) {
        if(countryCode === ''){
           return false;
        }
        this.provinceList = [];
        this.cityList = [];
        this.$http.get('logistics/public/get-provinces-by-country-code', {params: {countryCode: countryCode}}).then(res => {
          if (res.body.code === 0 && res.body.data) {
            this.provinceList = res.body.data.map(function (item) {
              return {code: item.provinceCode, name: item.provinceName};
            });
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
      /**
       * 城市列表
       * @param provinceCode 省、州code
       */
      getCityList(provinceCode) {
       if(provinceCode === ''){
           return false;
       }
       this.cityList = [];
        this.$http.get('logistics/public/get-cities-by-province-code', {params: {provinceCode: provinceCode}}).then(res => {
          if (res.body.code === 0 && res.body.data) {
            this.cityList = res.body.data.map(function (item) {
              return {code: item.cityCode, name: item.cityName};
            });
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
      /**
       * 计算
       *
       * @param condition 条件对象
       * @param calculateType 计算类型
       */
      wareHouseFreeFreightCalculate(condition, calculateType) {
        if(calculateType === 1){
            if(this.wareHouseFreeFreightCalculationOption.pipelineCode ==='' || this.wareHouseFreeFreightCalculationOption.virWhCode ==='' || this.wareHouseFreeFreightCalculationOption.sku ===''){
                this.$message.error('渠道、销售仓和sku为必填项 !');
                return false;
            }
        }
        if(calculateType === 2){
          if(this.assignAreaFreeFreightCalculationOption.sku ==='' || this.assignAreaFreeFreightCalculationOption.areaId ===''){
            this.$message.error('sku和分区id为必填项 !');
            return false;
          }
        }
        if(calculateType === 3){
          if(this.assignAreaFreeFreightCalculationOption1.sku ==='' || this.assignAreaFreeFreightCalculationOption1.areaId ==='' ||
              this.assignAreaFreeFreightCalculationOption1.weight ==='' || this.assignAreaFreeFreightCalculationOption1.volumeWeight ===''){
            this.$message.error('sku、分区id、实际重、体积重均为必填项 !');
            return false;
          }
        }
        const filterCondition = {};
        condition.virWhCode && condition.pipelineCode !== '' && (filterCondition.pipelineCode = condition.pipelineCode);
        condition.virWhCode && condition.virWhCode !== '' && (filterCondition.virWhCode = condition.virWhCode);
        condition.sku && condition.sku !== '' && (filterCondition.sku = condition.sku);
        condition.areaId && condition.areaId !== '' && (filterCondition.areaId = condition.areaId);
        condition.weight && condition.weight !== '' && (filterCondition.weight = condition.weight);
        condition.volumeWeight && condition.volumeWeight !== '' && (filterCondition.volumeWeight = condition.volumeWeight);
        if (calculateType === 1) {
           filterCondition.operationType = 1;
        }
        if (calculateType === 2) {
          filterCondition.operationType = 2;
        }
        if (calculateType === 3) {
          filterCondition.operationType = 3;
        }
        //console.log('filter last condition', filterCondition);
        this.$http.get('logistics/freight/free-postage-freight', {params: filterCondition}).then(res => {
          if (res.body.code === 0 && res.body.data.freeShipVos) {
            if (calculateType === 1) {
              this.wareHouseFreeFreightCalculationData = res.body.data.freeShipVos;
            } else if (calculateType === 2) {
              this.assignAreaFreeFreightCalculationData = res.body.data.freeShipVos;
            } else if (calculateType === 3) {
              this.assignAreaFreeFreightCalculationData1 = res.body.data.freeShipVos;
            }
          } else {
            this.wareHouseFreeFreightCalculationData = [];
            this.assignAreaFreeFreightCalculationData = [];
            this.assignAreaFreeFreightCalculationData1 = [];
            this.$message.error(res.body.message);
          }
        });
      },
      /**
       * 真实邮费计算
       *
       * @param condition
       */
      realFreightCalculation(condition,type) {
        //console.log(condition);
        //console.log(type);
        var decide1 = this.realFreightOption.templateId ==='' || this.realFreightOption.lang === ''  || this.realFreightOption.realWareCode === '' || this.realFreightOption.sku ===''
                        || this.realFreightOption.addressInfo.countryCode === '' || this.realFreightOption.addressInfo.provinceCode === '' ||
                       this.realFreightOption.addressInfo.cityName === '' ||  this.realFreightOption.addressInfo.detailAddr === ''|| this.realFreightOption.addressInfo.zipCode === '';

        var decide2 = decide1 || this.realFreightOption.length === '' || this.realFreightOption.width === '' || this.realFreightOption.height === '' || this.realFreightOption.weight === '' ||
                      this.realFreightOption.volumeWeight === '' || this.realFreightOption.overSize === '' || this.realFreightOption.freeShipFee === '' ||
                      this.realFreightOption.num === '' || this.realFreightOption.forbidCatalog === '' || this.realFreightOption.forbidAttr === '';
        if(type === 1){
            if(decide1){
                this.$message.error('所以项都为必填项 !');
                return false;
            }
        }
        if(type === 2){
          if(decide2){
            this.$message.error('所以项都为必填项 !');
            return false;
          }
        }
       // console.log('real freight condition', condition);
        this.realFreightData = {goodLists: [], addressInfo: [], actualList: []};
        const filterCondition = {
          addressInfo: {
            countryCode: '',
            provinceName: '',
            cityName: '',
            detailAddr: '',
            zipCode: '',
          },
          goodList: [],
        };
        let skuInfo = {
          lang: condition.lang,
          freeShipFee: condition.freeShipFee,
          width: condition.width,
          length: condition.length,
          height: condition.height,
          volumeWeight: condition.volumeWeight,
          overSize: condition.overSize,
          num: condition.num,
          forbidCatalog: condition.forbidCatalog,
          forbidAttr: condition.forbidAttr
        };
        for (let obj in skuInfo) {
          if (!skuInfo[obj]) {
            delete  skuInfo[obj];
          }
        }
        if (condition.sku && condition.sku !== '') {
          filterCondition.goodList = condition.sku.split(',').map(function (value) {
            return Object.assign({sku: value}, skuInfo);
          });
        }
        var provinceCode = this.realFreightOption.addressInfo.provinceCode, provinceName = '' , list = this.provinceList , len = this.provinceList.length;
        for(var i=0;i<len;i++){
            if(provinceCode === list[i].code){
               provinceName = list[i].name;
               break;
            }
        }
        condition.templateId && (filterCondition.templateId = condition.templateId);
        condition.realWareCode && (filterCondition.realWareCode = condition.realWareCode);
        condition.addressInfo.countryCode && (filterCondition.addressInfo.countryCode = condition.addressInfo.countryCode);
        condition.addressInfo.provinceCode && (filterCondition.addressInfo.provinceName = provinceName);
        condition.addressInfo.cityName && (filterCondition.addressInfo.cityName = condition.addressInfo.cityName);
        condition.addressInfo.detailAddr && condition.addressInfo.detailAddr !== '' && (filterCondition.addressInfo.detailAddr = condition.addressInfo.detailAddr);
        condition.addressInfo.zipCode && condition.addressInfo.zipCode !== '' && (filterCondition.addressInfo.zipCode = condition.addressInfo.zipCode);
        if (type===1) {
          filterCondition.operationType = 1;
        } else {
          filterCondition.operationType = 2;
        }

        //console.log('filter last condition', filterCondition);
        this.$http.get('logistics/freight/real-freight-list', {params: filterCondition}).then(res => {
          //console.log(res);
          if (res.body.code === 0) {
            if (res.body.data.goodLists) {
              //console.log('sku info', res.body.data.goodLists);
              this.realFreightData.goodLists = res.body.data.goodLists;
            }
            if (res.body.data.addressInfo) {
              //console.log('address info', res.body.data.addressInfo);
              this.realFreightData.addressInfo = [res.body.data.addressInfo];
            }
            if (res.body.data.actualList) {
              //console.log('actual info', res.body.data.actualList);
              this.realFreightData.actualList = res.body.data.actualList;
            }
          } else {
            this.$message.error(res.body.message);
          }
        });
      },

      editCategory (){
        this.categoryDialogObj.categoryDialog = true;
        this.$refs.categorySelect.init();
      },

      editAttrs (){
        this.attrsDialogObj.attrsDialog = true;
        this.$refs.attrSelect.init();
      },

    },
    components: {
      CategorySelect,
      AttrSelect
    },
  }
</script>

<style lang="less">

  .ml15{
    margin-left: 15px;
  }
  .ml5{
    margin-left: 5px;
  }
  .update-width{
    margin-left: -55px;
    .el-form-item__content{
     width:192px;
    }
  }
</style>
