<template>
  <!--OMS同步的物流信息 详情-->
  <div>
    <div class="el-container">
      <el-tabs active-name="1">
        <el-tab-pane label="基础信息" name="1">
          <el-form :model="detailForm" label-width="140px">
            <el-form-item label="真实仓：">
              {{detailForm.warehouseName}}
            </el-form-item>
            <el-form-item label="物流名称：">
              {{detailForm.logisticsName}}
            </el-form-item>
            <el-form-item label="英文名称：">
              {{detailForm.englishName}}
            </el-form-item>
            <el-form-item label="物流编码：">
              {{detailForm.logisticsCode}}
            </el-form-item>
            <el-form-item label="天数：">
              {{detailForm.minDays}} - {{detailForm.maxDays}}
            </el-form-item>
            <el-form-item label="级别：">
              {{levelOpt[detailForm.logisticsLevel]}}
            </el-form-item>
            <el-form-item label="URL：">
              {{detailForm.url}}
            </el-form-item>
            <el-form-item label="禁用品：">
              {{detailForm.fbAttr}}
            </el-form-item>
            <el-form-item label="计重类型：">
              {{detailForm.calWeigth}}
            </el-form-item>
            <el-form-item label="是否开启体积重：">
              <i
                :class="{'el-icon-circle-check color-success': detailForm.isVolumeWeight == '1', 'el-icon-circle-cross color-danger': detailForm.isVolumeWeight == '0'}"></i>
            </el-form-item>
            <el-form-item label="最大边长(cm)：">
              {{detailForm.maxLengthEdge}}
            </el-form-item>
            <el-form-item label="最小重量(kg)：">
              {{detailForm.minWeight}}
            </el-form-item>
            <el-form-item label="最大重量(kg)：">
              {{detailForm.maxWeight}}
            </el-form-item>
            <el-form-item label="开启状态：">
              <i
                :class="{'el-icon-circle-check color-success': detailForm.status == '1', 'el-icon-circle-cross color-danger': detailForm.status == '0'}"></i>
            </el-form-item>
            <el-form-item label="修改时间：">
              {{self.timeZone_(detailForm.updateTime, self.$store.getters.getTimeZone)}}
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="运费参数：" name="2">
          <el-form :model="cost" label-width="140px">
            <el-form-item label="燃油附加费率：">
              {{cost.fuelSurcharge}}
            </el-form-item>
            <el-form-item label="头程费：">
              {{cost.firstTripTaxFee}}
              &nbsp;
              {{cost.firstTripTaxFeeCurrency}}
              &nbsp;
              {{firstTripTaxFeeTypeArr[cost.firstTripTaxFeeType]}}
            </el-form-item>
            <el-form-item label="过港费：">
              {{cost.portDuesFee}}
              &nbsp;
              {{cost.portDuesFeeCurrency}}
              &nbsp;
              {{portDuesFeeTypeArr[cost.portDuesFeeType]}}
            </el-form-item>
            <el-form-item label="清关费：">
              {{cost.customsClearanceFee}}
              &nbsp;
              {{cost.customsClearanceFeeCurrency}}
              &nbsp;
              {{customsClearanceFeeTypeArr[cost.customsClearanceFeeType]}}
            </el-form-item>
            <el-form-item label="转运费：">
              {{cost.transhipmentChargeFee}}
              &nbsp;
              {{cost.transhipmentChargeFeeCurrency}}
              &nbsp;
              {{transhipmentChargeFeeTypeArr[cost.transhipmentChargeFeeType]}}
            </el-form-item>
            <el-form-item label="处理费：">
              {{cost.dealFee}}
              &nbsp;
              {{cost.dealCurrency}}
              &nbsp;
              {{dealFeeTypeArr[cost.dealFeeType]}}
            </el-form-item>
            <el-form-item label="其他费用：">
              {{cost.otherFee1}}
              &nbsp;
              {{cost.otherCurrency1}}
              &nbsp;
              {{otherFeeType1Arr[cost.otherFeeType1]}}
            </el-form-item>
            <el-form-item label="其他费用3：">
              {{cost.otherFee3}}
              &nbsp;
              {{cost.otherCurrency3}}
              &nbsp;
              {{otherFeeType3Arr[cost.otherFeeType3]}}
            </el-form-item>
            <el-form-item label="折扣：">
              {{cost.discount}}
            </el-form-item>
            <el-form-item label="修改时间：">
              {{self.timeZone_(cost.updateTime, self.$store.getters.getTimeZone)}}
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="多语言" name="3">
          <el-form :model="language" label-width="140px" :rules="rules" ref="FormRules">
            <el-row>
              <el-col :span="6">
                <el-form-item label="英文名称" prop="enName">
                  <el-input v-model="language.enName"></el-input>
                </el-form-item>
                <el-form-item label="日语名称" prop="japaneseName">
                  <el-input v-model="language.japaneseName"></el-input>
                </el-form-item>
                <el-form-item label="法语名称" prop="frenchName">
                  <el-input v-model="language.frenchName"></el-input>
                </el-form-item>
                <el-form-item label="西班牙名称" prop="spainName">
                  <el-input v-model="language.spainName"></el-input>
                </el-form-item>
                <el-form-item label="俄语名称" prop="russiaName">
                  <el-input v-model="language.russiaName"></el-input>
                </el-form-item>
                <el-form-item label="葡语名称" prop="portugueseName">
                  <el-input v-model="language.portugueseName"></el-input>
                </el-form-item>
                <el-form-item label="意大利名称" prop="italianName">
                  <el-input v-model="language.italianName"></el-input>
                </el-form-item>
                <el-form-item label="德语名称" prop="germanName">
                  <el-input v-model="language.germanName"></el-input>
                </el-form-item>
                <el-form-item label="英国英语名称" prop="englishName">
                  <el-input v-model="language.englishName"></el-input>
                </el-form-item>
                <el-form-item label="美国英语名称" prop="americaName">
                  <el-input v-model="language.americaName"></el-input>
                </el-form-item>
                <el-form-item label="巴西名称" prop="brazilsName">
                  <el-input v-model="language.brazilsName"></el-input>
                </el-form-item>
                <el-form-item>
                  <div>
                    <el-button type="primary" @click="handleSave('FormRules')" v-if="self.showAction_('logistics/oms/logistics-edit')">保存</el-button>
                    <el-button type="danger" @click="comeBack">返回</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        self: this,
        detailForm: {},
        cost:{
          fuelSurcharge:'',
          firstTripTaxFee:'',
          firstTripTaxFeeCurrency:'',
          firstTripTaxFeeType:'',
          portDuesFee:'',
          portDuesFeeCurrency:'',
          portDuesFeeType:'',
          customsClearanceFee:'',
          customsClearanceFeeCurrency:'',
          customsClearanceFeeType:'',
          transhipmentChargeFee:'',
          transhipmentChargeFeeCurrency:'',
          transhipmentChargeFeeType:'',
          dealFee:'',
          dealCurrency:'',
          dealFeeType:'',
          otherFee1:'',
          otherCurrency1:'',
          otherFeeType1:'',
          otherFee3:'',
          otherCurrency3:'',
          otherFeeType3:'',
          discount:'',
          updateTime:'',
        },
        language: {
          enName: '',
          japaneseName: '',
          frenchName: '',
          spainName: '',
          russiaName: '',
          portugueseName: '',
          italianName: '',
          germanName: '',
          englishName: '',
          americaName: '',
          brazilsName: '',
        },

        rules: {
          enName: [{required: true, type: 'string', message: '请输入英文名称!', trigger: 'blur'}],
          japaneseName: [{required: true, type: 'string', message: '请输入日语名称!', trigger: 'blur'}],
          frenchName: [{required: true, type: 'string', message: '请输入法语名称!', trigger: 'blur'}],
          spainName: [{required: true, type: 'string', message: '请输入西班牙名称!', trigger: 'blur'}],
          russiaName: [{required: true, type: 'string', message: '请输入俄语名称!', trigger: 'blur'}],
          portugueseName: [{required: true, type: 'string', message: '请输入葡语名称!', trigger: 'blur'}],
          italianName: [{required: true, type: 'string', message: '请输入意大利名称!', trigger: 'blur'}],
          germanName: [{required: true, type: 'string', message: '请输入德语名称!', trigger: 'blur'}],
          englishName: [{required: true, type: 'string', message: '请输入英国英语名称!', trigger: 'blur'}],
          americaName: [{required: true, type: 'string', message: '请输入美国英语名称!', trigger: 'blur'}],
          brazilsName: [{required: true, type: 'string', message: '请输入巴西名称!', trigger: 'blur'}],
        },

        levelOpt: {
          '0': '平邮',
          '1': '慢',
          '2': '中',
          '3': '快',
          '4': '自提'
        },

        firstTripTaxFeeTypeArr: {
            '1': '按订单',
            '2': '按重量'
        },

        portDuesFeeTypeArr: {
          '1': '按订单',
          '2': '按重量'
        },

        customsClearanceFeeTypeArr: {
          '1': '按订单',
          '2': '按重量'
        },

        transhipmentChargeFeeTypeArr: {
          '1': '按订单',
          '2': '按重量'
        },

        dealFeeTypeArr: {
          '1': '按订单',
          '2': '按重量'
        },

        otherFeeType1Arr: {
          '1': '按订单',
          '2': '按重量'
        },

        otherFeeType3Arr: {
          '1': '按订单',
          '2': '按重量'
        }

      };
    },
    created () {
      this.getData();
    },
    methods: {
      getData () {
        this.$http.get('logistics/oms/logistics-info', {params: {id: this.$route.query.id}}).then(res => {
          if (res.body.code === 0) {
            this.detailForm = res.body.data;
            if (res.body.data.freightParamSetting) {
                this.cost = res.body.data.freightParamSetting;
            }
            if(res.body.data.multiLanguage){
              this.langJson = JSON.parse(res.body.data.multiLanguage);
              this.initLan(this.langJson);
            }
          }
        })
      },

      //初始化语言
      initLan (lan){
        //console.log(lan);
        if(lan !== null){
          this.language.enName = lan.enName;
          this.language.japaneseName = lan.japaneseName;
          this.language.frenchName = lan.frenchName;
          this.language.spainName = lan.spainName;
          this.language.russiaName = lan.russiaName;
          this.language.portugueseName = lan.portugueseName;
          this.language.italianName = lan.italianName;
          this.language.germanName = lan.germanName;
          this.language.englishName = lan.englishName;
          this.language.americaName = lan.americaName;
          this.language.brazilsName = lan.brazilsName;
        }
      },

      handleSave (formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.lanSave();
          }else{
            return false;
          }
        });
      },
      lanSave (){
        let params = {
            id: this.$route.query.id,
        };
        let multiLanguage = {
            enName: this.language.enName,
            japaneseName: this.language.japaneseName,
            frenchName: this.language.frenchName,
            spainName: this.language.spainName,
            russiaName: this.language.russiaName,
            portugueseName: this.language.portugueseName,
            italianName: this.language.italianName,
            germanName: this.language.germanName,
            englishName: this.language.englishName,
            americaName: this.language.americaName,
            brazilsName: this.language.brazilsName,
        };
        params.multiLanguage = JSON.stringify(multiLanguage);
        //console.log(params);
        this.$http.post('logistics/oms/logistics-edit', params).then(res => {
          if (res.body.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.comeBack();
          } else {
            this.$message.error(res.body.message);
          }
        })
      },
      comeBack (){
        this.$refs['FormRules'].resetFields();
        this.$router.push({name: 'logistics_omsMessage'});
      },
    }
  }
</script>

<style>

</style>
