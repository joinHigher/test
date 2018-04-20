<!-- 订单配置页 -->
<template>
  <div>
    <div class="el-container order-setting">
      <div class="setting-title">
        <h2>订单有效期设置</h2>
      </div>
      <el-table ref="multipleTable" v-loading.body="tableLoading" :data="orderData" border tooltip-effect="dark"  style="width: 100%" :default-sort = "{prop: 'validType', order: 'ascending'}">
        <el-table-column label="订单有效期类型" header-align="center" align="center" prop="validTypeName"></el-table-column>
        <el-table-column label="价格标签" header-align="center" align="center" prop="validType">
          <template scope="scope">
            <span v-if="scope.row.validType !=0">{{scope.row.labelStr}}</span>
            <span v-if="scope.row.validType ==0">默认配置</span>
          </template>
        </el-table-column>
        <el-table-column label="订单有效期" header-align="center" align="center">
          <template scope="scope">
            <span>{{scope.row.validTime}}</span>
            <span v-if="scope.row.validUnit == 0">小时</span>
            <span v-if="scope.row.validUnit == 1">分钟</span>
            <span v-if="scope.row.validUnit == 2">天</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" header-align="center" align="center" prop="isEnable">
          <template scope="scope">
            <span v-if="scope.row.isEnable ==1">是</span>
            <span v-if="scope.row.isEnable ==0">否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template scope="scope">
            <el-button  type="primary" @click="editValidSetting(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <div class="setting-title">
        <h2>自动退款设置</h2>
      </div>
      <div>
        <el-form :inline="true"  :model="orderSetting" ref="settingForm" class="search-form">
          <el-form-item label="自动退款">
            <el-radio-group v-model="orderSetting.order_refund_on_off">
              <el-radio class="radio"  :label="0">关闭</el-radio>
              <el-radio class="radio"  :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item><br>
          <el-form-item label="已支付订单退款起始时间 自付款：" prop="order_refund_timeout">
            <el-input v-model.number="orderSetting.order_refund_timeout" placeholder="请输入" @change="setRefundTime" :maxlength= 'validTime_length'></el-input>
          </el-form-item>
          <el-form-item label="小时"></el-form-item><br>
          <el-form-item label="面向会员等级：">
            <el-table :data="orderSetting.order_rank_on_off" border>
              <el-table-column property="levelName" label="会员等级" header-align="center" align="center" width="300px"></el-table-column>
              <el-table-column property="onOff" label="开启状态" header-align="center" align="center" width="300px">
                <template scope="scope">
                  <i
                    :class="{'el-icon-circle-check color-success': scope.row.onOff == '1', 'el-icon-circle-cross color-danger': scope.row.onOff == '0'}"
                    @click="changeMemberSwitch(scope.row)">
                  </i>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>

      <div class="setting-title">
        <h2>自动签收设置</h2>
      </div>
      <div>
        <el-form :inline="true"  :model="orderSetting" ref="settingForm" class="search-form">
          <el-form-item label="自动签收">
            <el-radio-group v-model="orderSetting.order_receipt_on_off">
              <el-radio class="radio" :label="0">关闭</el-radio>
              <el-radio class="radio" :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item><br>
          <el-form-item label="自动签收时间: 已发货" prop="order_receipt_timeout">
            <el-input v-model.number="orderSetting.order_receipt_timeout" placeholder="请输入" @change="setCheckTime" :maxlength = 'order_receipt_timeout_length'></el-input>
          </el-form-item>
          <el-form-item label="天"></el-form-item><br>
        </el-form>
      </div>

      <div class="el-sub-container text-center">
        <el-button type="primary" @click="saveSetting">保存</el-button>
        <el-button type="danger" @click="revert">取消</el-button>
      </div>
    </div>
    <!-- 弹窗S -->
    <!--订单有效期设置（默认）-->
    <el-dialog title="订单有效期设置" :visible.sync="dialogForDefault" size="tiny">
      <el-form ref="editDefaultRef" label-width="200px" v-model="editDefaultForm">
        <el-form-item label="订单有效期类型:">{{editDefaultForm.validTypeName}}</el-form-item>
        <el-form-item label="标签类型:">
          <span v-if="editDefaultForm.validType === 0">默认配置</span>
          <span v-if="editDefaultForm.validType === 1">配置A</span>
          <span v-if="editDefaultForm.validType === 2">配置C</span>
        </el-form-item>
        <el-form-item label="价格标签:">默认配置</el-form-item>
        <el-form-item label="订单有效期:">
          <el-row>
            <el-col :span="4">
              <el-input v-model="editDefaultForm.validTime" @change="validTimeRule" :maxlength='validTime_length'></el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="7" class="text-right">
              <el-select v-model="editDefaultForm.validUnit">
                <el-option v-for="item in timeUnitItem" :key="item.id" :label="item.type" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否启用:">
          <span v-if="editDefaultForm.isEnable === 1 ">是</span>
          <span v-if="editDefaultForm.isEnable === 0 ">否</span>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="defaultSave" v-if="self.showAction_('order/index/update-order-setting')">保存</el-button>
        <el-button type="danger" @click="dialogForDefault = false">取消</el-button>
      </div>
    </el-dialog>

    <!--订单有效期设置(其他)-->
    <el-dialog title="订单有效期设置" :visible.sync="dialogForOther" size="tiny">
      <el-row>
        <el-col :span="20">
          <el-form ref="editOtherRef" label-width="200px" v-model="editOtherForm">
            <el-form-item label="订单有效期类型:">
              <el-input v-model="editOtherForm.validTypeName" :maxlength='NameMaxLength'></el-input>
            </el-form-item>
          </el-form>
          <h4 class="order-title">选择标签</h4>
          <el-form ref="editOtherRef" label-width="200px" v-model="editOtherForm">
            <el-form-item label="已选择标签:">
              <div class="selectTag">
                <el-tag :key="tag" v-for="tag in dynamicTags" :style="{backgroundColor:tag.indexOf('已删除') !== -1 ? '#CBCBCB' : '#8391a5'}" :closable="true" :close-transition="false" @close="handleClose(tag)">{{tag}}</el-tag>
              </div>
            </el-form-item>
            <el-form-item label="标签类型:">
              <el-select v-model="editOtherForm.labelType" @change="getPriceTags" clearable>
                <el-option v-for="item in tagtypeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="价格标签:">
              <el-select v-model="editOtherForm.labelName" clearable>
                <el-option v-for="item in priceTagsList" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="addSelectItem" class="addToSelected">添加到已选</el-button>
            </el-form-item>
          </el-form>
          <h4 class="order-title">订单设置</h4>
          <el-form ref="editOtherRef" label-width="200px" v-model="editOtherForm">
            <el-form-item label="订单有效期:">
              <el-select v-model="editOtherForm.ordervalidity" clearable>
                <el-option v-for="item in ordervalidityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否启用:">
              <el-radio-group v-model="editOtherForm.isEnable">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <p class="mark" v-if="noticeFlag">提示:点击保存，已删除标签将从已选标签中删除。</p>
          <div class="text-center">
            <el-button type="primary" @click="otherSave">保存</el-button>
            <el-button type="danger" @click=" dialogForOther = false;">取消</el-button>
          </div>
        </el-col>
      </el-row>

    </el-dialog>
    <!-- 弹窗E -->
  </div>
</template>

<script>

  export default {
    data () {
      return {
        noticeFlag: false,
        self: this,
        dialogForDefault:false, //订单有效期设置(默认)
        dialogForOther:false,//订单有效期设置(其他)
        tableLoading: false,
        orderData: [],
        editDefaultForm:{
          id:'',
          validType:'',
          validTypeName:'',
          validTime:'',
          validUnit:'',
          isEnable:'',
        },
        timeUnitItem:[
          { id:0,type:'小时'},
          //{ id:1,type:'分钟'},
          { id:2,type:'天'},
        ],

        editOtherForm:{
          id:'',
          validType:'',
          validTypeName:'',
          labelType:'',
          labelName:'',
          isEnable:'',
          ordervalidity:'',
        },
        priceTagsList:[], //价格标签数组
        tagtypeList:[], //标签类型数组
        dynamicTags: [],
        priceList:[],
        ordervalidityList:[
          {id:15,name:'15 min'}, {id:30,name:'30 min'},
        ],
        orderSetting:{
          order_unpaid_timeout:'',
          order_refund_on_off:0,
          order_refund_timeout:'',
          order_rank_on_off:[],
          order_receipt_on_off:'',
          order_receipt_timeout:'',
          order_valid_time_stock_take:''
        },
        NameMaxLength : 20,
        order_receipt_timeout_length : 3,
        validTime_length : 4,
      };
    },
    created () {
      this.getOrderSetting();
    },
    methods: {
      getOrderSetting(){
        this.tableLoading = true;
        this.$http.get('order/index/order-setting').then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
            this.orderSetting = res.body.data.orderSettingsMap;
            this.orderData = res.body.data.orderSettingsMap.order_valid_time_stock_take;
//            console.log(this.orderData);
//            console.log(this.orderSetting);
          }else{
            this.$message.error(res.body.message);
          }
        });
      },
      //编辑
      editValidSetting (row){
        this.noticeFlag = false;
//        console.log(row);
        if(row.validTypeName ==='默认配置'){
          this.dialogForDefault = true;
          this.editDefaultForm.id = row.id;
          this.editDefaultForm.validType = row.validType;
          this.editDefaultForm.validTypeName = row.validTypeName;
          this.editDefaultForm.validTime = row.validTime;
          this.editDefaultForm.validUnit = row.validUnit;
          this.editDefaultForm.isEnable = row.isEnable;
        }else{
          this.dialogForOther = true;
          this.editOtherForm.id = row.id;
          this.editOtherForm.validType = row.validType;
          this.editOtherForm.validTypeName = row.validTypeName;
          this.editOtherForm.isEnable = row.isEnable;

          //调标签类型接口
          this.tagtypeList = [];
          var resultList = '';
          this.$http.get('promotion/index/public-get-dicts',{params:{names:'labelType'}}).then(res => {
            if (res.body.code === 0) {
              resultList = res.body.data;
//              console.log(resultList);
              for (var i = 0; i < resultList.length; i++) {
                var name = resultList[i].text , id = resultList[i].value ;
                this.tagtypeList.push( { name : name , id : id } );
              }
//              console.log(this.tagtypeList);

            } else {
              this.$message.error(res.body.message);
            }
          });
          //初始化数据
          this.priceList = [];
          this.dynamicTags = [];
          var list = row.priceLabelList;
          for(var i=0;i<list.length;i++){
            var type = list[i].labelType , id = list[i].priceLabelId , name = list[i].labelName , status = list[i].status;
            this.dynamicTags.push(name);
            if(status === 0){
              this.priceList.push({priceLabelId : id , labelType : type , labelName:name , status : status});
            }
          };
          this.editOtherForm.ordervalidity = row.validTime;

          this.dynamicTags.forEach(item => {
            if (item.indexOf('已删除') !== -1) {
              this.noticeFlag = true;
            }
          });
        }
      },

      //调价格标签接口
      getPriceTags (){
        this.priceTagsList = [];
        var resultList = '';

        var typeName = this.editOtherForm.labelType;
        var typeId = '';
        for(var i=0;i< this.tagtypeList.length;i++){
          if( typeName === this.tagtypeList[i].name){
            typeId = this.tagtypeList[i].id;
            break;
          }
        }
        this.$http.get('promotion/price/label-lists',{ params : {labelType : typeId }}).then(res => {
          if (res.body.code === 0) {
            resultList = res.body.data.labelSites;
//            console.log(resultList);
            for (var i = 0; i < resultList.length; i++) {
              var name = resultList[i].name , id = resultList[i].labelId ;
              this.priceTagsList.push( { name : name , id : id } );
            }
//            console.log(this.priceTagsList);

          } else {
            this.$message.error(res.body.message);
          }
        });
      },

      validTimeRule (){
        var time = Number(this.editDefaultForm.validTime),
          unit = Number(this.editDefaultForm.validUnit);
        if(this.editDefaultForm.validTime ===''){
          return false;
        }
        if(unit === 0){
          if(time<1 || time>1440){
            this.$message.error('订单有效期请设置在1-1440小时');
            return false;
          }
        }else{
          if(time<1 || time>60){
            this.$message.error('订单有效期请设置在1-60天');
            return false;
          }
        }
        return true;
      },

      //编辑(默认) 保存
      defaultSave (){
        if(this.editDefaultForm.validTime ===''){
          this.$message.error('请输入订单有效期!');
        }
        if(!this.validTimeRule()){
          return false;
        }
        this.$http.post('order/index/period-stocktack', this.editDefaultForm).then(res => {
          if (res.body.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.dialogForDefault = false;
            this.getOrderSetting();
          } else {
            this.$message.error(res.body.message);
          }
        });
      },
      //添加到已选
      addSelectItem (){
        var str = '' , name = '', type = '';
        var priceLabelId = '' , labelType = '';
        name = this.editOtherForm.labelName ;
        type = this.editOtherForm.labelType;

        for(var i=0;i<this.priceTagsList.length;i++){
          if(name === this.priceTagsList[i].name){
            priceLabelId = this.priceTagsList[i].id;
            break;
          }
        }
        type === '系统标签' ? labelType = 0 : labelType = 1;
        str = name + '-' + type;
        //console.log(str);
        if(!type){
          this.$message.error('请选择标签类型！');
          return false;
        };
        if(!name){
          this.$message.error('请选择价格标签！');
          return false;
        };

        if(this.dynamicTags.length===0){
          this.dynamicTags.push(str);
          this.priceList.push({priceLabelId : priceLabelId , labelType : labelType , labelName : str , status : 0 });
        }else{
          for(var i=0;i<this.dynamicTags.length;i++){
            if(str === this.dynamicTags[i] ){
              this.$message.error('标签已存在！');
              return false;
            }
          };
          this.dynamicTags.push(str);
          this.priceList.push({priceLabelId : priceLabelId , labelType : labelType , labelName : str , status : 0 });
        }
      },

      handleClose(tag){
//        console.log('100');
//        if(tag.indexOf('已删除')){
//           return false;
//        }
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        for(var i=0;i<this.priceList.length;i++){
          if(tag === this.priceList[i].labelName){
            this.priceList.splice(i,1);
          }
        }
      },

      //编辑(其他) 保存
      otherSave (){
        if(this.dynamicTags.length===0){
          this.$message.error('请选择标签!');
          return false;
        };
        if(this.editOtherForm.ordervalidity ===''){
          this.$message.error('请选择订单有效期!');
          return false;
        };
        let params = {
          id : this.editOtherForm.id,
          validType : this.editOtherForm.validType,
          validTypeName : this.editOtherForm.validTypeName,
          priceLabelList : this.priceList,
          validTime : this.editOtherForm.ordervalidity,
          validUnit : 1,
          isEnable : this.editOtherForm.isEnable
        };
        console.log(params);
        this.$http.post('order/index/period-stocktack', params).then(res => {
          if (res.body.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.dialogForOther = false;
            this.editOtherForm.labelType = '';
            this.editOtherForm.labelName = '';
            this.getOrderSetting();
          } else {
            this.$message.error(res.body.message);
          }
        });
      },

      saveSetting(){
        if(this.orderSetting.order_refund_timeout ===''){
          this.$message.error('已支付订单退款起始时间不能为空!');
          return false;
        };
        if(this.orderSetting.order_receipt_timeout ===''){
          this.$message.error('自动签收时间不能为空!');
          return false;
        };

        var siteCode = this.getCook('SITECODE'); //获得站点名称

        var list = this.orderSetting.order_valid_time_stock_take;
        //console.log(list);
        for(var i=0;i<list.length;i++){
          delete(list[i].labelStr);
          var pList = list[i].priceLabelList;
          if(list[i].priceLabelList === null){
            list[i].priceLabelList = [];
          };
          if(pList !== null){
            for(var j=0;j<pList.length;j++){
              delete(pList[j].labelName);
            }
          }
        };
        //console.log(list);

        var memberLeavel = [];
        if (this.orderSetting.order_rank_on_off.length > 0) {
          for (var i in this.orderSetting.order_rank_on_off) {
            let item = this.orderSetting.order_rank_on_off[i];
            memberLeavel.push({id: item.id, onOff: item.onOff});
          }
        };
        var settingParams = {
          siteCode: siteCode,
          configInfoId: this.orderSetting.configInfoId,
          //orderUnpaidTimeout: this.orderSetting.order_unpaid_timeout,
          orderReceiptOnOff: this.orderSetting.order_receipt_on_off,
          orderReceiptTimeout: this.orderSetting.order_receipt_timeout,
          orderRefundOnOff: this.orderSetting.order_refund_on_off,
          orderRefundTimeout: this.orderSetting.order_refund_timeout,
          orderRankOnOff: memberLeavel,
          orderValidTimeStockTake: list,
        };
//        console.log(settingParams);
        this.$http.post('order/index/update-order-setting', settingParams).then(res => {
          if (res.body.code === 0) {
              this.$message.success('保存成功!');
              return;
          }
          this.$message.error(res.body.message);
        });
      },


      getCook (name){
        var strcookie = document.cookie;//获取cookie字符串
        var arrcookie = strcookie.split("; ");//分割
        for (var i = 0; i < arrcookie.length; i++) {
          var arr = arrcookie[i].split("=");
          if (arr[0] == name) {
            return arr[1];
          }
        }
        return "";
      },


      revert(){
        this.getOrderSetting();
      },

      //点击改变开启状态
      changeMemberSwitch(currentMember){
        currentMember.onOff = currentMember.onOff > 0 ? 0 : 1;
//        console.log(this.orderSetting.order_rank_on_off);

      },

      setRefundTime(val){
        var tempValue=val.toString().replace(/\D/g,'');
        this.$nextTick(function () {
          this.orderSetting.order_refund_timeout = tempValue;
        });
      },

      setCheckTime(val){
        var tempValue=val.toString().replace(/\D/g,'');
        this.$nextTick(function () {
          this.orderSetting.order_receipt_timeout = tempValue;
        });
      },

    }
  }
</script>
<style lang="less">
  @import "../../../../assets/css/style";
  .order-setting{
    h2{
      border-bottom: 2px solid @color-blue;
      display: inline-block;
      font-size: 18px;
    }
    .setting-title{
      border-bottom: 1px solid @color-gray;
      margin-bottom: 20px;
    }
  }
  .order-title{
    border-bottom: 1px solid  @color-gray ;
    display: inline-block;
    margin-left: 60px;
    width: 100%;
    margin-bottom:10px;
  }
  .selectTag{
    padding:5px;
    min-height:90px;
    border: 1px solid  @color-gray ;
  }
  .el-tag{
    margin-right:8px;
  }
  .mark{
    color:red;
    padding-left: 128px;
    padding-bottom: 20px;
  }
</style>
