<template>
  <!--编辑物流规则-->
  <div>
    <div class="el-container">
      <el-form :model="option" label-width="200px" ref="costForm">
        <el-form-item label="规则名称">
          <el-row>
            <el-col :span="5">
              <el-input v-model="option.name" @change="isNameExist"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="设定生效条件">
          <el-row>
            <el-col :span="5">
              <el-select placeholder="请选择" v-model="selectCondition1" @change="changeType" clearable>
                <el-option v-for="item in conditionType" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="5">
              <el-select placeholder="请选择" v-model="selectCondition2" @change="selectType(selectCondition2)" clearable>
                <el-option v-for="item in subCondition" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="已设定条件">
          <el-row  v-if="option.ruleItem.length !== 0" v-for="(item , index) in  option.ruleItem" :key="index" class="ruleItem" >
            <el-col :span="2">
              <el-input  readonly v-if="item.cond == 1" value="产品条件"></el-input>
              <el-input  readonly v-if="item.cond == 2" value="地址条件"></el-input>
              <el-input  readonly v-if="item.cond == 3" value="订单条件"></el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-input  readonly v-if="item.type == 1" value="产品类别"></el-input>
              <el-input  readonly v-if="item.type == 2" value="指定产品数量"></el-input>
              <el-input  readonly v-if="item.type == 3" value="产品性质"></el-input>
              <el-input  readonly v-if="item.type == 4" value="产品编码"></el-input>
              <el-input  readonly v-if="item.type == 5" value="州/省"></el-input>
              <el-input  readonly v-if="item.type == 6" value="城市"></el-input>
              <el-input  readonly v-if="item.type == 7" value="详细地址"></el-input>
              <el-input  readonly v-if="item.type == 8" value="邮编"></el-input>
              <el-input  readonly v-if="item.type == 9" value="订单金额"></el-input>
              <el-input  readonly v-if="item.type == 10" value="订单重量"></el-input>
              <el-input  readonly v-if="item.type == 11" value="指定性质数量"></el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="4">
              <el-input v-model="item.conditionalResult" readonly></el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button type="primary" icon="edit" @click="editItem(index,item)">编辑</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="danger" icon="delete" @click="removeItem(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="生效网站">
          <el-row>
            <el-col :span="5">
              <el-input readonly v-model="option.sitesName"></el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button type="primary" icon="edit" @click="newEditSite">新增/编辑</el-button>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button type="danger" icon="delete" @click="deleteSite">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="生效国家">
          <el-row>
            <el-col :span="5">
              <el-input readonly v-model="effectCountryList"></el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button type="primary" icon="edit" @click="newEditCountry">新增/编辑</el-button>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button type="danger" icon="delete" @click="deleteCountry">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="启用">
          <el-row>
            <el-col :span="5">
              <el-radio-group v-model="option.status">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="优先（必须）使用物流">
          <el-row>
            <el-col :span="5">
              <el-input v-model="option.logisticsValidCode" @focus="clickValidCode"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="不可使用物流">
          <el-row>
            <el-col :span="5">
              <el-input v-model="option.logisticsInvalidCode" @focus="clickInValidCode"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注">
          <el-row>
            <el-col :span="5">
              <el-input type="textarea" :rows="5" v-model="option.remark"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="操作">
          <el-row>
            <el-col :span="5">
              <el-button type="primary" @click="editRuleSave">保存</el-button>
              <el-button type="danger" @click="$router.push({name: 'logistics_bestRule'})">返回</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="产品类别" v-model="proTypeDialog" class="log-group" size="small">
      <el-form :model="proTypeForm" label-width="50px">
        <el-form-item>
          <el-checkbox v-model="proTypeForm.checkbox" @change="proTypeAll">全选</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-tree :data="proTypeForm.proTypeList" :show-checkbox="true" default-expand-all node-key="id" ref="proTypeTree" highlight-current :props="proTypeForm.defaultProps"  class="proTypeTree" v-loading="proTypeListLoading">
          </el-tree>
        </el-form-item>
        <el-form-item label="类型">
            <el-radio-group v-model="proTypeForm.opType">
                <el-radio :label="1">等于</el-radio>
                <el-radio :label="2">不等于</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
           <div class="text-right">
             <el-button type="primary" @click="proTypeDialogSave" v-if="!editProTypeWindow">确定</el-button>
             <el-button type="primary" @click="editProTypeDialogSave" v-if="editProTypeWindow">确定</el-button>
             <el-button type="danger"  @click="proTypeDialogCancel">取消</el-button>
           </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="指定产品数量" v-model="proCountDialog" class="log-group" size="tiny">
      <el-form inline :model="proCountForm" label-width="50px">
          <el-form-item>
            <el-row>
              <el-col :span="2">
                从
              </el-col>
              <el-col :span="10">
                <el-input v-model="proCountForm.beginCount"></el-input>
              </el-col>
              <el-col :span="2" class="text-center">
               到
              </el-col>
              <el-col :span="10">
                <el-input v-model="proCountForm.endCount"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <div class="proCountBtn">
             <el-button type="primary" @click="proCountSave" v-if="!editProCountWindow">确定</el-button>
             <el-button type="primary" @click="editProCountSave" v-if="editProCountWindow">确定</el-button>
             <el-button type="danger"  @click="proCounCancel">取消</el-button>
           </div>
      </el-form>
    </el-dialog>

    <el-dialog title="产品性质" v-model="proNatureDialog" class="log-group" size="small">
      <el-form :model="proNatureForm" label-width="50px">
          <el-form-item>
            <el-checkbox v-model="proNatureForm.checkbox" @change="proNatureFormAll">全选</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-tree :data="proNatureForm.proNatureList" :show-checkbox="true" default-expand-all node-key="propertyCode" ref="proNatureFormTree" highlight-current :props="proNatureForm.defaultProps"  class="proTypeTree" v-loading = "proNatureListLoading">
            </el-tree>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="proNatureForm.opType">
              <el-radio :label="1">等于</el-radio>
              <el-radio :label="2">不等于</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div class="text-right">
              <el-button type="primary" @click="proNatureDialogSave" v-if="!editProNatureWindow">确定</el-button>
              <el-button type="primary" @click="editProNatureDialogSave" v-if="editProNatureWindow">确定</el-button>
              <el-button type="danger"  @click="proNatureDialogCancel">取消</el-button>
            </div>
          </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="产品编码" v-model="proCodeDialog" class="log-group" size="small">
      <p class="proCodeTitle">请输入产品编码，以半角分号(;)分隔：</p>
      <el-form :model="proCodeForm" label-width="50px">
        <el-form-item label="">
          <el-input type="textarea" :rows="5" v-model="proCodeForm.proCode"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="proCodeForm.opType">
            <el-radio :label="1">等于</el-radio>
            <el-radio :label="2">不等于</el-radio>
            <el-radio :label="3">包含</el-radio>
            <el-radio :label="4">不包含</el-radio>
            <el-radio :label="5">开头</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="text-right">
            <el-button type="primary" @click="proCodeDialogSave" v-if="!editProCodeWindow">确定</el-button>
            <el-button type="primary" @click="editProCodeDialogSave" v-if="editProCodeWindow">确定</el-button>
            <el-button type="danger"  @click="proCodeDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="收件州/省" v-model="provinceDialog" class="log-group" size="small">
      <p class="proCodeTitle">请输入收件州/省，以半角分号(;)分隔：</p>
      <el-form :model="provinceForm" label-width="50px">
        <el-form-item label="">
          <el-input type="textarea" :rows="5" v-model="provinceForm.provinceName"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="provinceForm.opType">
            <el-radio :label="1">等于</el-radio>
            <el-radio :label="2">不等于</el-radio>
            <el-radio :label="3">包含</el-radio>
            <el-radio :label="4">不包含</el-radio>
            <el-radio :label="5">开头</el-radio>
            <el-radio :label="6">正则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="text-right">
            <el-button type="primary" @click="provinceDialogSave" v-if="!editProvinceWindow">确定</el-button>
            <el-button type="primary" @click="editProvinceDialogSave" v-if="editProvinceWindow">确定</el-button>
            <el-button type="danger"  @click="provinceDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="收件城市" v-model="cityDialog" class="log-group" size="small">
      <p class="proCodeTitle">请输入收件城市，以半角分号(;)分隔：</p>
      <el-form :model="cityForm" label-width="50px">
        <el-form-item label="">
          <el-input type="textarea" :rows="5" v-model="cityForm.cityName"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="cityForm.opType">
            <el-radio :label="1">等于</el-radio>
            <el-radio :label="2">不等于</el-radio>
            <el-radio :label="3">包含</el-radio>
            <el-radio :label="4">不包含</el-radio>
            <el-radio :label="5">开头</el-radio>
            <el-radio :label="6">正则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="text-right">
            <el-button type="primary" @click="cityDialogSave" v-if="!editCityWindow">确定</el-button>
            <el-button type="primary" @click="editCityDialogSave" v-if="editCityWindow">确定</el-button>
            <el-button type="danger"  @click="cityDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="收件地址" v-model="addressDialog" class="log-group" size="small">
      <p class="proCodeTitle">请输入收件地址，以半角分号(;)分隔：</p>
      <el-form :model="addressForm" label-width="50px">
        <el-form-item label="">
          <el-input type="textarea" :rows="5" v-model="addressForm.addressName"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="addressForm.opType">
            <el-radio :label="1">等于</el-radio>
            <el-radio :label="2">不等于</el-radio>
            <el-radio :label="3">包含</el-radio>
            <el-radio :label="4">不包含</el-radio>
            <el-radio :label="5">开头</el-radio>
            <el-radio :label="6">正则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="text-right">
            <el-button type="primary" @click="addressDialogSave" v-if="!editAddressWindow">确定</el-button>
            <el-button type="primary" @click="editAddressDialogSave" v-if="editAddressWindow">确定</el-button>
            <el-button type="danger"  @click="addressDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="收件邮编" v-model="zipCodeDialog" class="log-group" size="small">
      <p class="proCodeTitle">请输入收件邮编，以半角分号(;)分隔：</p>
      <el-form :model="zipCodeForm" label-width="50px">
        <el-form-item label="">
          <el-input type="textarea" :rows="5" v-model="zipCodeForm.code"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="zipCodeForm.opType">
            <el-radio :label="1">等于</el-radio>
            <el-radio :label="2">不等于</el-radio>
            <el-radio :label="3">包含</el-radio>
            <el-radio :label="4">不包含</el-radio>
            <el-radio :label="5">开头</el-radio>
            <el-radio :label="6">正则</el-radio>
            <br/>
            <el-radio :label="7">区间(-分隔单个区间值;分隔区间 如：100-105；200-205)</el-radio>
            <br/>
            <el-radio :label="8">不等于区间(-分隔单个区间值;分隔区间 如：100-105；200-205)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="text-right">
            <el-button type="primary" @click="zipCodeDialogSave" v-if="!editZipWindow">确定</el-button>
            <el-button type="primary" @click="editZipCodeDialogSave" v-if="editZipWindow">确定</el-button>
            <el-button type="danger"  @click="zipCodeDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--订单金额-->
    <el-dialog title="订单金额" v-model="orderAmountDialog" class="log-group" size="tiny">
      <el-form inline :model="orderAmount" label-width="50px">
        <el-form-item>
          <el-row>
            <el-col :span="2">
              从
            </el-col>
            <el-col :span="10">
              <el-input v-model="orderAmount.beginCount"></el-input>
            </el-col>
            <el-col :span="2" class="text-center">
              到
            </el-col>
            <el-col :span="10">
              <el-input v-model="orderAmount.endCount"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="proCountBtn">
          <el-button type="primary" @click="orderAmountSave" v-if="!editOrderAmountWindow">确定</el-button>
          <el-button type="primary" @click="editOrderAmountSave" v-if="editOrderAmountWindow">确定</el-button>
          <el-button type="danger"  @click="orderAmountCancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--订单重量-->
    <el-dialog title="订单重量" v-model="orderWeightDialog" class="log-group" size="tiny">
      <el-form inline :model="orderWeight" label-width="50px">
        <el-form-item>
          <el-row>
            <el-col :span="2">
              从
            </el-col>
            <el-col :span="10">
              <el-input v-model="orderWeight.beginCount"></el-input>
            </el-col>
            <el-col :span="2" class="text-center">
              到
            </el-col>
            <el-col :span="10">
              <el-input v-model="orderWeight.endCount"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="proCountBtn">
          <el-button type="primary" @click="orderWeightSave" v-if="!editOrderWeightWindow">确定</el-button>
          <el-button type="primary" @click="editOrderWeightSave" v-if="editOrderWeightWindow">确定</el-button>
          <el-button type="danger"  @click="orderWeightCancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--指定性质的产品数量-->
    <el-dialog title="指定性质的产品数量" v-model="appointNatureCountDialog" class="log-group" size="tiny">
      <el-form inline :model="appointNatureCount" label-width="50px">
        <el-form-item>
          <el-row>
            <el-col :span="2">
              从
            </el-col>
            <el-col :span="10">
              <el-input v-model="appointNatureCount.beginCount"></el-input>
            </el-col>
            <el-col :span="2" class="text-center">
              到
            </el-col>
            <el-col :span="10">
              <el-input v-model="appointNatureCount.endCount"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="proCountBtn">
          <el-button type="primary" @click="appointNatureCountSave" v-if="!editAppointNatureCountWindow">确定</el-button>
          <el-button type="primary" @click="editAppointNatureCountSave" v-if="editAppointNatureCountWindow">确定</el-button>
          <el-button type="danger"  @click="appointNatureCountCancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--生效国家-->
    <el-dialog title="生效国家" v-model="effectCountryDialog" class="log-group" size="tiny">
      <el-form :model="effectCountryForm" label-width="40px">
        <el-form-item>
          <el-row>
            <el-col :span="10">
              <el-input v-model="searchCountyKey" placeholder="请输入国家名称"></el-input>
            </el-col>
            <el-col :span="5" class="text-right">
              <el-button type="primary" icon="search" @click="searchEffectCountry">搜索</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-table  ref="effectCountryTable"  :data="effectCountryForm.stateCode" class="effectCountryTable" @selection-change="handlecountrySelect" v-loading = "effectCountryLoading">
            <el-table-column type="selection" width = '30'></el-table-column>
            <el-table-column prop="code" label="全选" width = '100'></el-table-column>
            <el-table-column prop="name"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="effectCountryForm.countrysType">
            <el-radio :label="1">等于</el-radio>
            <el-radio :label="2">不等于</el-radio>
            <el-radio :label="3">正则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="text-right">
            <el-button type="primary" @click="effectCountryDialogSave">确定</el-button>
            <el-button type="danger"  @click="effectCountryDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--生效网站-->
    <el-dialog title="生效网站" v-model="effectSiteDialog" class="log-group effect-site-dialog" size="tiny">
      <el-form :model="effectSiteForm" label-width="10px">
        <el-form-item>
          <el-checkbox v-model="effectSiteForm.siteCheckAll"  :indeterminate="effectSiteForm.isIndeterminate" @change="handleSiteCheckAll" class="siteCheckAll">全选</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="effectSiteForm.checkedSites" @change="handleCheckedSite" v-loading="checkedSitesLoading">
             <el-checkbox v-for="site in effectSiteForm.siteNamesArr" :label="site" :key="site">{{site}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <div class="text-right">
            <el-button type="primary" @click="effectSiteDialogSave">确定</el-button>
            <el-button type="danger"  @click="effectSiteDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--优先（必须）使用物流-->
    <el-dialog title="选择优先使用物流" v-model="ValidCodeDialog" class="log-group" size="small">
        <el-row>
          <el-col :span="12">
             <div class="el-container">
               <el-form label-width="100px" inline :model="ValidCodes" ref="alidCodeSearchForm">
                 <el-row>
                   <el-col :span="4">
                     <span>物流编码</span>
                   </el-col>
                   <el-col :span="14">
                     <el-input v-model="ValidCodes.logisticsCode" @change="LoadValidCodes"></el-input>
                   </el-col>
                   <el-col :span="6">
                     <div class="text-right">
                       <el-button type="primary" icon="search" @click="ValidCodeSearch">搜索</el-button>
                     </div>
                   </el-col>
                 </el-row>
               </el-form>
             </div>
            <div class="el-container ValidCodeStyle">
              <el-table border :data="ValidCodesData" v-loading="ValidCodetableLoading">
                <el-table-column prop="logisticsName" label="物流名称"></el-table-column>
                <el-table-column prop="logisticsCode" label="物流编码"></el-table-column>
                <el-table-column prop="logisticsLevel" label="物流级别"></el-table-column>
                <el-table-column  label="操作">
                  <template scope="scope">
                    <el-button type="primary" @click="addValidCode(scope.row)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="el-container">
                <span>已选物流</span>
            </div>
            <br/>
            <div class="el-container ValidCodeStyle">
              <el-table border :data="selectValidCodesData" v-loading="selectValidCodetableLoading">
                <el-table-column prop="logisticsName" label="物流名称"></el-table-column>
                <el-table-column prop="logisticsCode" label="物流编码"></el-table-column>
                <el-table-column prop="logisticsLevel" label="物流级别"></el-table-column>
                <el-table-column  label="操作">
                    <template scope="scope">
                      <el-button type="danger" @click="removeValidCode(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="text-right ValidCodeFoot">
              <el-button type="primary" @click="ValidCodeDialogSave">确定</el-button>
              <el-button type="danger"  @click="ValidCodeDialogCancel">取消</el-button>
            </div>
          </el-col>
        </el-row>
    </el-dialog>

    <!--不可使用物流-->
    <el-dialog title="选择不可使用物流" v-model="InValidCodeDialog" class="log-group" size="small">
        <el-row>
          <el-col :span="12">
             <div class="el-container">
               <el-form label-width="100px" inline :model="InValidCodes" ref="alidCodeSearchForm">
                 <el-row>
                   <el-col :span="4">
                     <span>物流编码</span>
                   </el-col>
                   <el-col :span="14">
                     <el-input v-model="InValidCodes.logisticsCode" @change="LoadInValidCodes"></el-input>
                   </el-col>
                   <el-col :span="6">
                     <div class="text-right">
                       <el-button type="primary" icon="search" @click="InValidCodeSearch">搜索</el-button>
                     </div>
                   </el-col>
                 </el-row>
               </el-form>
             </div>
            <div class="el-container ValidCodeStyle">
              <el-table border :data="InValidCodesData" v-loading="InValidCodetableLoading">
                <el-table-column prop="logisticsName" label="物流名称"></el-table-column>
                <el-table-column prop="logisticsCode" label="物流编码"></el-table-column>
                <el-table-column prop="logisticsLevel" label="物流级别"></el-table-column>
                <el-table-column  label="操作">
                  <template scope="scope">
                    <el-button type="primary" @click="addInValidCode(scope.row)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="el-container">
                <span>已选物流</span>
            </div>
            <br/>
            <div class="el-container ValidCodeStyle">
              <el-table border :data="selectInValidCodesData" v-loading="selectInValidCodetableLoading">
                <el-table-column prop="logisticsName" label="物流名称"></el-table-column>
                <el-table-column prop="logisticsCode" label="物流编码"></el-table-column>
                <el-table-column prop="logisticsLevel" label="物流级别"></el-table-column>
                <el-table-column  label="操作">
                    <template scope="scope">
                      <el-button type="danger" @click="removeInValidCode(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="text-right ValidCodeFoot">
              <el-button type="primary" @click="InValidCodeDialogSave">确定</el-button>
              <el-button type="danger"  @click="InValidCodeDialogCancel">取消</el-button>
            </div>
          </el-col>
        </el-row>
    </el-dialog>



  </div>
</template>

<script>
export default {
    data (){
        return {
          self : this,
          option : {
            sitesCode:'',
            sitesName:'',
            remark:'',
            logisticsInvalidCode:'',
            countrysType:'',
            countrysCode:'',
            name:'',
            logisticsValidCode:'',
            id:'',
            status:'',
            countrysName:'',
            ruleItem:[
              {
                condAttr : '',
                type : '',
                cond : '',
                opType : '',
                conditionalResult: ''
              }
            ],
          },
          selectCondition1:'',
          selectCondition2:'',
          conditionType:[
            {id:1,name:'产品条件'},
            {id:2,name:'地址条件'},
            {id:3,name:'订单条件'}
          ],
          proCondition:[
            {id:1,name:'产品类别'},
            {id:2,name:'指定产品数量'},
            {id:3,name:'产品性质'},
            {id:4,name:'产品编码'},
            {id:11,name:'指定性质数量'},
          ],
          addCondition:[
            {id:5,name:'州/省'},
            {id:6,name:'城市'},
            {id:7,name:'详细地址'},
            {id:8,name:'邮编'}
          ],
          orderCondition:[
            {id:9,name:'订单金额'},
            {id:10,name:'订单重量'}
          ],
          subCondition:[],
          proTypeDialog:false,
          proCountDialog:false,
          proNatureDialog:false,
          proCodeDialog:false,
          provinceDialog:false,
          cityDialog:false,
          addressDialog:false,
          zipCodeDialog:false,
          effectCountryDialog:false,
          effectSiteDialog:false,
          ValidCodeDialog:false,
          InValidCodeDialog:false,
          condAttrArr:[],
          searchCountyKey:'', //搜索生效国家关键词

          proTypeForm:{
            checkbox:'',
            proTypeList:[],
            opType:1,
            defaultProps:{
              children: 'subCategoryList',
              label: (data, node) => { return node.data.categoryMultiLang.categoryName; }
            }
          },
          editProTypeWindow: "", //是否是产品类别编辑窗口

          proCountForm:{
              beginCount:'',
              endCount:''
          },
          editProCountWindow: "", //是否是指定产品数量编辑窗口

          proNatureForm:{
            checkbox:'',
            proNatureList:[],
            opType:1,
            defaultProps:{
              label: 'propertyName'
            }
          },
          editProNatureWindow: "",//是否是产品性质编辑窗口

          proCodeForm:{
            proCode:'',
            opType:1
          },
          editProCodeWindow: "", //是否是产品编码编辑窗口

          provinceForm:{
            provinceName:'',
            opType:1
          },
          editProvinceWindow: "", //是否是省份编辑窗口

          cityForm:{
            cityName:'',
            opType:1
          },
          editCityWindow: "", //是否是城市编辑窗口

          addressForm:{
            addressName:'',
            opType:1
          },
          editAddressWindow: "", //是否是地址编辑窗口

          zipCodeForm:{
            code:'',
            opType:1
          },
          editZipWindow: "", // 是否是邮编编辑窗口

          //订单金额参数
          orderAmountDialog: false,
          orderAmount: {
            beginCount: '',
            endCount: '',
          },
          orderAmountValidateResult: '', //订单金额验证结果参数
          editOrderAmountWindow: "", //是否是订单金额编辑窗口

          //订单重量参数
          orderWeightDialog: false,
          orderWeight: {
            beginCount: '',
            endCount: '',
          },
          orderWeightValidateResult: '',//订单重量验证结果参数
          editOrderWeightWindow: "", //是否是订单重量编辑窗口

          //指定性质的产品数量参数
          appointNatureCountDialog: false,
          appointNatureCount: {
            beginCount: '',
            endCount: '',
          },
          appointNatureCountValidateResult: '',//指定性质的产品数量验证结果参数
          editAppointNatureCountWindow: "", //是否是指定性质的产品数量编辑窗口

          effectCountryList : '', // 显示生效国家的列表（字符串类型）
          effectCountryForm:{
            countrysType:'', //条件 等于  不等于 正则
            stateCode:[], //保存所有国家信息
            initStateCode:[],
            countrySelectList:[], //保存被选择国家信息
            countrySelectNames:[],
            countrySelectCodes:[],
            countrySelectNamesStr:'',
            countrySelectCodesStr:''
          },
          effectSiteForm:{
            isIndeterminate:false,
            siteCheckAll:false, //全选的 v-model
            checkedSites:[],  //被选择项
            sitesList:[],  //全部项
            siteCodesArr:[],
            siteNamesArr:[],
            siteCodesStr:'',
            siteNamesStr:'',
          },
          //选择优先使用物流
          ValidCodes:{
            logisticsCode:'', //物流编码
          },
          ValidCodetableLoading:false,
          ValidCodesData:[],
          selectValidCodesData:[],
          selectValidCodetableLoading:false,

          //选择不使用物流
          InValidCodes:{
            logisticsCode:'', //物流编码
          },
          InValidCodetableLoading:false,
          InValidCodesData:[],
          selectInValidCodesData:[],
          selectInValidCodetableLoading:false,
          checkedSitesLoading : false,
          effectCountryLoading : false,
          proTypeListLoading : false,
          proNatureListLoading : false,
          isRuleNameExist : '',
          condAttrArrId : [],
        };
    },
  created (){
    this.getDate();
  },
  methods: {
    isNameExist (){
      self.isRuleNameExist = false;
      this.isNameExistMethod(this.option.name,this.option.id,function(){
        self.isRuleNameExist = true;
      })
    },

    isNameExistMethod (name , id , callback){
      this.$http.get('logistics/public/rule-info-is-exist',{params:{name: name , id : id }}).then(res => {
          if(res.body.code ===0 ){
             if(!res.body.data){
                 callback();
                 this.$message({
                   type: 'error',
                   message: '规则名称已存在！'
                 });
             }
          }else{
              this.$message({
                type:'error',
                message: res.body.message
              });
          }
      })
    },
    changeType (){
      this.selectCondition2 = '';
      if(this.selectCondition1 === 1){
        this.subCondition = this.proCondition;
      }else if(this.selectCondition1 === 2){
        this.subCondition = this.addCondition;
      }else if(this.selectCondition1 === 3){
        this.subCondition = this.orderCondition;
      }else if(this.selectCondition1 ===''){
        this.subCondition = '';
      }
    },
    getDate (){
        var id = this.$route.query.id;
        this.$http.get('logistics/rule-info/info',{ params:{ id: id }}).then(res => {
          if (res.body.code === 0) {
              //console.log(res.body.data);
              this.option = res.body.data;
              this.showEffectCountry(this.option.countrysType,this.option.countrysName); //显示生效国家
              this.joinStr(this.option.ruleItem);
              console.log(this.option.ruleItem);
          }else{
              this.$message.error(res.body.message);
          }
        })
    },
    //删除已设定的条件
    removeItem (index){
        this.$confirm('是否删除该项?','提示',{
            type:'warning'
        }).then(() => {
            this.option.ruleItem.splice(index,1);
            this.$message({
              type: 'success',
              message: '删除成功'
            });
        }).catch(() => {
            this.$message({
              type:'info',
              message:'已取消删除'
            });
        });
    },
    //设定生效条件 第二选项 ，根据选择项不同，展示不同窗口
    selectType (index){
        //console.log(index);
        if(index === 1){
          this.proTypeDialog = true;
          this.editProTypeWindow = false;
          this.proTypeForm.opType = 1;
          this.proTypeListLoading = true;
          this.$http.get('goods/category/list?isLeaves=false').then(res => {
            if(res.body.code ===0 ){
               // console.log(res.body.data);
              this.proTypeForm.proTypeList = res.body.data.list;
              this.proTypeListLoading = false;
            }else{
              this.$message({
                type:'error',
                message: res.body.message
              });
            }
          })
        }
        if(index === 2){
          this.proCountDialog = true;
          this.editProCountWindow = false;
          this.proCountForm.beginCount = '';
          this.proCountForm.endCount = '';
        }
        if(index === 3){
          this.proNatureDialog = true;
          this.editProNatureWindow = false;
          this.proNatureForm.opType = 1;
          this.proNatureListLoading = true;
          this.$http.get('logistics/public/contraband-attributes').then(res => {
            if(res.body.code ===0 ){
               //console.log(res.body.data);
               this.proNatureForm.proNatureList = res.body.data;
               this.proNatureListLoading = false;
               //this.proNatureForm.proNatureList
            }else{
              this.$message({
                type:'error',
                message: res.body.message
              });
            }
          })
        }

        if(index === 4){
          this.proCodeDialog = true;
          this.editProCodeWindow = false;
          this.proCodeForm.opType = 1;
          this.proCodeForm.proCode = '';
        }
        if(index === 5){
          this.provinceDialog = true;
          this.editProvinceWindow = false;
          this.provinceForm.opType=1;
          this.provinceForm.provinceName = '';
        }
        if(index === 6){
          this.cityDialog = true;
          this.editCityWindow = false;
          this.cityForm.opType = 1;
          this.cityForm.cityName = '';
        }
        if(index === 7){
          this.addressDialog = true;
          this.editAddressWindow = false;
          this.addressForm.optype = 1;
          this.addressForm.addressName = '';
        }
        if(index === 8){
          this.zipCodeDialog = true;
          this.editZipWindow = false;
          this.zipCodeForm.opType = 1;
          this.zipCodeForm.code = '';
        }
        if(index === 9){
          this.orderAmountDialog = true;
          this.editOrderAmountWindow = false;
          this.orderAmount.beginCount = "";
          this.orderAmount.endCount = "";
        }
        if(index === 10){
          this.orderWeightDialog = true;
          this.editOrderWeightWindow = false;
          this.orderWeight.beginCount = "";
          this.orderWeight.endCount = "";
        }
        if(index === 11){
          this.appointNatureCountDialog = true;
          this.editAppointNatureCountWindow = false;
          this.appointNatureCount.beginCount = "";
          this.appointNatureCount.endCount = "";
        }
    },
    //产品类别 全选
    proTypeAll (){
        var isChecked = this.proTypeForm.checkbox ;
        if(isChecked){
           this.$refs.proTypeTree.setCheckedNodes(this.proTypeForm.proTypeList);
        }else{
          this.$refs.proTypeTree.setCheckedNodes([]);
        }
    },

    getIdArray(data){
      if(!data){
        return false;
      }
      this.condAttrArrId = [];
      data.forEach( item => {
        this.condAttrArrId.push(item.categoryMultiLang.categoryId);
      });
      return this.condAttrArrId.join(';')
    },

   //产品类别 取消
    proTypeDialogCancel (){
        this.proTypeDialog = false;
    },
    //产品类别 保存
    proTypeDialogSave (){
        let isExistAppointCount = this.isExistAppointNatureCount();
        if (isExistAppointCount) {
          this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
          return false;
        }
      var  condAttr = this.$refs.proTypeTree.getCheckedNodes() ; //被选中的项

      if(condAttr.length === 0){
        this.$message.error('请选择产品类别！');
        return false;
      }
      var idArr = this.getIdArray(condAttr);
          //condAttr = this.getArray(condAttr);
      var type = this.selectCondition2;
      var cond = this.selectCondition1;
      var opType = this.proTypeForm.opType;
      var obj = {
              condAttr : idArr,
              type : type,
              cond : cond,
              opType : opType,
        };
      this.option.ruleItem.push(obj);
      this.joinStr(this.option.ruleItem);
      this.proTypeDialog = false;
    },

    //遍历 this.option.ruleItem，将 outStr 和 condAttr 拼接，并将拼接结果赋值给 conditionalResult 属性。
    joinStr (arr){
        var opType , opTypeStr, outStr, type;
        if(arr.length > 0){
          for(var i =0 ;i<arr.length;i++){
            opType = arr[i].opType;
            type = arr[i].type;
            //console.log(opType);
            if(opType === 1 ){
                opTypeStr = '等于';
            };
            if(opType === 2 ){
                opTypeStr = '不等于';
            };
            if(opType === 3 ){
                opTypeStr = '包含';
            };
            if(opType === 4 ){
                opTypeStr = '不包含';
            };
            if(opType === 5 ){
                opTypeStr = '开头';
            };
            if(opType === 6 ){
              opTypeStr = '正则';
            };
            if(opType === 7 ){
              opTypeStr = '区间';
            };
            if(opType === 8 ){
              opTypeStr = '不等于区间';
            };
            outStr = opTypeStr + '"' + arr[i].condAttr + '"';
            if(opType === 0){   //0表示不传该参数，仅仅提供判断是否为指定产品数量的条件
                var countArea = arr[i].condAttr.split('-');
                outStr = '从'+ countArea[0]+ '到' +countArea[1];
            };
            if(opType === 11 && type === 9){
              var orderAmountArea = arr[i].condAttr.split(';');
              outStr = '大于等于'+ orderAmountArea[0]+ '小于等于' + orderAmountArea[1];
            }
            if(opType === 10  && type === 9){
              outStr = "小于等于" +  arr[i].condAttr;
            }
            if(opType === 9  && type === 9){
              outStr = "大于等于" +  arr[i].condAttr;
            }

            if(opType === 11 && type === 10){
              var orderWeightArea = arr[i].condAttr.split(';');
              outStr = '大于等于'+ orderWeightArea[0]+ '小于等于' + orderWeightArea[1];
            }
            if(opType === 10  && type === 10){
              outStr = "小于等于" +  arr[i].condAttr;
            }
            if(opType === 9  && type === 10){
              outStr = "大于等于" +  arr[i].condAttr;
            }
            if(opType === 11 && type === 11){
              let appointNatureCountArr = arr[i].condAttr.split(';');
              outStr = '大于等于' + appointNatureCountArr[0] + '小于等于' + appointNatureCountArr[1];
            }
            arr[i].conditionalResult = outStr;
          }
        }
    },

    //产品数量 保存
    proCountSave (){
      let isExistAppointCount = this.isExistAppointNatureCount();
      if (isExistAppointCount) {
        this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
        return false;
      }

      if(this.proCountForm.beginCount === ''){
        this.$message.error("请输入产品数量起始值！");
        return false;
      }
      if(this.proCountForm.endCount === ''){
        this.$message.error("请输入产品数量结束值！");
        return false;
      }
      if(isNaN(this.proCountForm.beginCount) || isNaN(this.proCountForm.endCount)){
        this.$message.error("你输入的不是数字！");
        return false;
      }
      var begin = Number(this.proCountForm.beginCount) , end = Number(this.proCountForm.endCount) ;
      if(begin>end){
        this.$message.error("起始值不能大于结束值！");
        return false;
      }
      var regCount = /^\+?[1-9]\d*$/;
      if (!regCount.test(begin) || !regCount.test(end)) {
        this.$message.error("请输入大于0的正整数！");
        return false;
      }

        var outStr = parseInt(begin) + '-' + parseInt(end);
        var condAttr = outStr;
            //console.log(condAttr);
        var type = this.selectCondition2;
        var cond = this.selectCondition1;
        var opType = 0;
        var obj = {
          condAttr : condAttr,
          type : type,
          cond : cond,
          opType : opType,
        };
        this.option.ruleItem.push(obj);
        console.log(this.option.ruleItem);
        this.joinStr(this.option.ruleItem);
        this.proCountDialog = false;
    },
    //产品数量 取消
    proCounCancel (){
      this.proCountDialog = false;
    },
    //产品性质 保存
    proNatureDialogSave (){
      if (this.option.ruleItem && this.option.ruleItem.length>0) {
        let tempArr = this.option.ruleItem;
        let appointCount = 0, natureCount = 0;
        tempArr.forEach( (item) => {
          if (item.type === 11) {
            appointCount++;
          }
          if (item.type === 3) {
            natureCount++
          }
        });
        if (appointCount>0 && natureCount>=1) {
          this.$message.error("指定性质的产品数量条件存在时，只允许有一个产品性质条件!");
          return false;
        }
      }

      var condAttr = this.$refs.proNatureFormTree.getCheckedNodes() ; //被选中的项
      if(condAttr.length === 0){
        this.$message.error('请选择产品性质！');
        return false;
      }
        var condAttrStr = '';
        if(condAttr.length>0){
            for(var i=0;i<condAttr.length;i++){
              condAttrStr += condAttr[i].propertyCode+';'
            }
            //console.log(condAttrStr);
        }
        var type = this.selectCondition2;
        var cond = this.selectCondition1;
        var opType = this.proNatureForm.opType;
        var obj = {
          condAttr : condAttrStr,
          type : type,
          cond : cond,
          opType : opType,
        };
        this.option.ruleItem.push(obj);
        this.joinStr(this.option.ruleItem);
        this.proNatureDialog = false;
    },
    //产品性质 取消
    proNatureDialogCancel (){
      this.proNatureDialog = false;
    },
    //产品性质 全选
    proNatureFormAll (){
      var isChecked = this.proNatureForm.checkbox ;
      if(isChecked){
        this.$refs.proNatureFormTree.setCheckedNodes(this.proNatureForm.proNatureList);
      }else{
        this.$refs.proNatureFormTree.setCheckedNodes([]);
      }
    },
    //产品编码 保存
    proCodeDialogSave (){
      let isExistAppointCount = this.isExistAppointNatureCount();
      if (isExistAppointCount) {
        this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
        return false;
      }
      if(this.proCodeForm.proCode === ''){
        this.$message.error('请输入产品编码！');
        return false;
      }
        var condAttr = (this.proCodeForm.proCode.replace(/\ +/g,"")).replace(/[\r\n]/g,"");
        var type = this.selectCondition2;
        var cond = this.selectCondition1;
        var opType = this.proCodeForm.opType;
        var obj = {
          condAttr : condAttr,
          type : type,
          cond : cond,
          opType : opType,
        };
        this.option.ruleItem.push(obj);
        this.joinStr(this.option.ruleItem);
        this.proCodeDialog = false;
    },
    //产品编码 取消
    proCodeDialogCancel (){
      this.proCodeDialog = false;
    },
    //收件州省 保存
    provinceDialogSave (){
      let isExistAppointCount = this.isExistAppointNatureCount();
      if (isExistAppointCount) {
        this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
        return false;
      }
      if(this.provinceForm.provinceName === ''){
        this.$message.error('请输入收件州/省');
        return false;
      }
      var condAttr = this.provinceForm.provinceName;
      var type = this.selectCondition2;
      var cond = this.selectCondition1;
      var opType = this.provinceForm.opType;
      var obj = {
        condAttr : condAttr,
        type : type,
        cond : cond,
        opType : opType,
      };
      this.option.ruleItem.push(obj);
      this.joinStr(this.option.ruleItem);
      this.provinceDialog = false;
    },
    //收件州省 取消
    provinceDialogCancel (){
      this.provinceDialog = false;
    },

    //收件城市 保存
    cityDialogSave (){
      let isExistAppointCount = this.isExistAppointNatureCount();
      if (isExistAppointCount) {
        this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
        return false;
      }
      if(this.cityForm.cityName === ''){
        this.$message.error('请输入收件城市!');
        return false;
      }
      var condAttr = this.cityForm.cityName;
      var type = this.selectCondition2;
      var cond = this.selectCondition1;
      var opType = this.cityForm.opType;
      var obj = {
        condAttr : condAttr,
        type : type,
        cond : cond,
        opType : opType,
      };
      this.option.ruleItem.push(obj);
      this.joinStr(this.option.ruleItem);
      this.cityDialog = false;
    },
    //收件城市 取消
    cityDialogCancel (){
      this.cityDialog = false;
    },

    //收件地址 保存
    addressDialogSave (){
      let isExistAppointCount = this.isExistAppointNatureCount();
      if (isExistAppointCount) {
        this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
        return false;
      }
      if(this.addressForm.addressName === ''){
        this.$message.error('请输入收件地址!');
        return false;
      }
      var condAttr = this.addressForm.addressName;
      var type = this.selectCondition2;
      var cond = this.selectCondition1;
      var opType = this.addressForm.opType;
      var obj = {
        condAttr : condAttr,
        type : type,
        cond : cond,
        opType : opType,
      };
      this.option.ruleItem.push(obj);
      this.joinStr(this.option.ruleItem);
      this.addressDialog = false;
    },
    //收件地址 取消
    addressDialogCancel (){
      this.addressDialog = false;
    },

    //收件邮编 保存
    zipCodeDialogSave (){
      let isExistAppointCount = this.isExistAppointNatureCount();
      if (isExistAppointCount) {
        this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
        return false;
      }
      if(this.zipCodeForm.code === ''){
        this.$message.error('请输入收件邮编!');
        return false;
      }
      var condAttr = this.zipCodeForm.code;
      var type = this.selectCondition2;
      var cond = this.selectCondition1;
      var opType = this.zipCodeForm.opType;
      var obj = {
        condAttr : condAttr,
        type : type,
        cond : cond,
        opType : opType,
      };
      this.option.ruleItem.push(obj);
      this.joinStr(this.option.ruleItem);
      this.zipCodeDialog = false;
    },
    //收件邮编 取消
    zipCodeDialogCancel (){
      this.zipCodeDialog = false;
    },

    //订单金额方法
    //订单金额(重量)验证方法
    ValidateFun (beginVal, endVal, modelName, errorMsg, reg){
      var begin = Number(beginVal),
          end = Number(endVal);
      if (!beginVal && !endVal){

        this.$message.error("请填写" + modelName);
        this.orderAmountValidateResult = false;
        this.orderWeightValidateResult = false;
        return false;
      }
      if (beginVal && !endVal){
        if (isNaN(beginVal) || !reg.test(beginVal) || begin<=0){

          this.$message.error(errorMsg);
          this.orderAmountValidateResult = false;
          this.orderWeightValidateResult = false;
          return false;
        }
      }
      if (!beginVal && endVal){
        if (isNaN(endVal) || !reg.test(endVal) || end<=0){

          this.$message.error(errorMsg);
          this.orderAmountValidateResult = false;
          this.orderWeightValidateResult = false;
          return false;
        }
      }
      if (beginVal && endVal){
        if (isNaN(beginVal) || isNaN(endVal) || !reg.test(beginVal) || !reg.test(endVal) || begin<=0 || end<=0){

          this.$message.error(errorMsg);
          this.orderAmountValidateResult = false;
          this.orderWeightValidateResult = false;
          return false;
        }
      }
      if (beginVal && endVal && begin>end){

        this.$message.error("起始值应小于或等于结束值");
        this.orderAmountValidateResult = false;
        this.orderWeightValidateResult = false;
        return false;
      }
      if (beginVal && endVal){
        if (begin<=0 || end<=0){

          this.$message.error(errorMsg);
          this.orderAmountValidateResult = false;
          this.orderWeightValidateResult = false;
          return false;
        }
      }
      this.orderAmountValidateResult = true;
      this.orderWeightValidateResult = true;
    },

    //保存
    orderAmountSave (){
      let isExistAppointCount = this.isExistAppointNatureCount();
      if (isExistAppointCount) {
        this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
        return false;
      }
      var beginVal = this.orderAmount.beginCount,
        endVal = this.orderAmount.endCount,
        modelName = "订单金额",
        errorMsg = "必须为大于0的2位小数",
        reg = /^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/,
        obj = {
          cond: 3,
          type: 9,
        };
      this.orderAmountValidateResult = true;
      this.ValidateFun (beginVal, endVal, modelName, errorMsg, reg);
      if (!this.orderAmountValidateResult){
        return false;
      }
      if (this.orderAmount.beginCount && this.orderAmount.endCount){  //2个输入框都填写
        obj.opType = 11;
        obj.condAttr = beginVal + ";" + endVal;
      }
      if (!this.orderAmount.beginCount && this.orderAmount.endCount){  //只填写了第二个输入框
        obj.opType = 10;
        obj.condAttr = endVal;
      }
      if (this.orderAmount.beginCount && !this.orderAmount.endCount){  //只填写了第一个输入框
        obj.opType = 9;
        obj.condAttr = beginVal;
      }
      this.option.ruleItem.push(obj);
      this.joinStr(this.option.ruleItem);
      this.orderAmountDialog = false;
    },

    //取消
    orderAmountCancel (){
      this.orderAmountDialog = false;
    },

    //订单重量方法
    orderWeightSave (){
      let isExistAppointCount = this.isExistAppointNatureCount();
      if (isExistAppointCount) {
        this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
        return false;
      }
      var beginVal = this.orderWeight.beginCount,
        endVal = this.orderWeight.endCount,
        modelName = "订单重量",
        errorMsg = "必须为大于0的3位小数",
        reg = /^0{1}([.]\d{1,3})?$|^[1-9]\d*([.]{1}[0-9]{1,3})?$/,
        obj = {
          cond: 3,
          type: 10,
        };
      this.orderWeightValidateResult = true;
      this.ValidateFun (beginVal, endVal, modelName, errorMsg, reg);
      if (!this.orderWeightValidateResult){
        return false;
      }
      if (this.orderWeight.beginCount && this.orderWeight.endCount){  //2个输入框都填写
        obj.opType = 11;
        obj.condAttr = beginVal + ";" + endVal;
      }
      if (!this.orderWeight.beginCount && this.orderWeight.endCount){  //只填写了第二个输入框
        obj.opType = 10;
        obj.condAttr = endVal;
      }
      if (this.orderWeight.beginCount && !this.orderWeight.endCount){  //只填写了第一个输入框
        obj.opType = 9;
        obj.condAttr = beginVal;
      }
      this.option.ruleItem.push(obj);
      this.joinStr(this.option.ruleItem);
      this.orderWeightDialog = false;
    },

    orderWeightCancel (){
      this.orderWeightDialog = false;
    },

    //指定性质的产品数量方法
    appointNatureCountSave (){
      let reg = /^\+?[1-9]\d*$/;
      let beginValid = '', endValid = '';
      beginValid = reg.test(this.appointNatureCount.beginCount) && parseInt(this.appointNatureCount.beginCount) < 1000 && this.appointNatureCount.beginCount;
      endValid = reg.test(this.appointNatureCount.endCount) && parseInt(this.appointNatureCount.endCount) < 1000 && this.appointNatureCount.endCount;
      if (!beginValid && !endValid) {
        this.$message.error('请输入大于0且小于1000的整数!');
        return false;
      }
      if (parseInt(this.appointNatureCount.beginCount)>parseInt(this.appointNatureCount.endCount)) {
        this.$message.error('起始值不能大于结束值!');
        return false;
      }

      if (this.option.ruleItem && this.option.ruleItem.length>0) {
        let tempArr = this.option.ruleItem;
        let appointCount = 0, natureCount = 0, otherCount = 0;
        tempArr.forEach( (item) => {
          if (item.type === 11) {
            appointCount++;
          } else if (item.type === 3) {
            natureCount++;
          } else {
            otherCount++;
          }
        });
        if (appointCount>=1) {
          this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
          return false;
        }
        if (natureCount>=2) {
          this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
          return false;
        }
        if (otherCount>0) {
          this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
          return false;
        }
      }

      let obj = {
        opType: 11,
        cond: 1,
        type: 11,
      };
      if (beginValid && !endValid) {
        obj.condAttr = parseInt(this.appointNatureCount.beginCount) + ';' + 999;
      } else if (!beginValid && endValid) {
        obj.condAttr = 1 + ';' + parseInt(this.appointNatureCount.endCount)
      } else if (beginValid && endValid) {
        obj.condAttr = parseInt(this.appointNatureCount.beginCount) + ';' + parseInt(this.appointNatureCount.endCount)
      }
      this.option.ruleItem.push(obj);
      console.log(this.option.ruleItem);
      this.joinStr(this.option.ruleItem);
      this.appointNatureCountDialog = false;
    },

    appointNatureCountCancel (){
      this.appointNatureCountDialog = false;
    },



    //新增 编辑 生效国家
    newEditCountry (){
      this.effectCountryForm.stateCode = [];
      this.effectCountryDialog = true;
      this.effectCountryLoading = true;
      this.$http.get('logistics/country-info/list',{params:{page_size:2000,page:1,countryCode:''}}).then(res =>{
        if(res.body.code ===0){
//          console.log(res.body.data.list);
          var cCode = '' , cName = '';
          for(var i=0;i<res.body.data.list.length;i++){
            cCode = res.body.data.list[i].countryCode;
            cName = res.body.data.list[i].countryName;
            this.effectCountryForm.stateCode.push({ code:cCode , name:cName });
          }
        }
        //获得当前记录的生效国家
        this.initEffectCountry(this.option.countrysName,this.option.countrysType);
        this.effectCountryLoading = false;
       });
      },
      //勾选国家列表
    handlecountrySelect (val){
        this.effectCountryForm.countrySelectNames = [];
        this.effectCountryForm.countrySelectCodes = [];
        this.effectCountryForm.countrySelectList = val;
        var list = this.effectCountryForm.countrySelectList;
        for(var i=0;i<list.length;i++){
          this.effectCountryForm.countrySelectNames.push(list[i].name);
          this.effectCountryForm.countrySelectCodes.push(list[i].code);
        }
        this.effectCountryForm.countrySelectNamesStr = this.effectCountryForm.countrySelectNames.join(';');
        this.effectCountryForm.countrySelectCodesStr = this.effectCountryForm.countrySelectCodes.join();
    },
    //删除 生效国家
    deleteCountry (){
      this.$confirm('是否删除该项?','提示',{
        type:'warning'
      }).then(() => {
        this.effectCountryList = '';
        this.option.countrysType = 1;
        this.option.countrysName = '';
        this.option.countrysCode = '';
        this.$message({
          type: 'success',
          message: '删除成功'
        });
      }).catch(() => {
        this.$message({
          type:'info',
          message:'已取消删除'
        });
      });
    },
    //生效国家 保存
    effectCountryDialogSave (){
      if(this.effectCountryForm.countrySelectNamesStr ===''){
        this.$message.error('请选择生效国家!');
        return false;
      }
      this.option.countrysType = this.effectCountryForm.countrysType;
      this.option.countrysName = this.effectCountryForm.countrySelectNamesStr;
      this.option.countrysCode = this.effectCountryForm.countrySelectCodesStr;
      this.showEffectCountry(this.option.countrysType,this.option.countrysName);
      this.effectCountryDialog = false;
    },
    //初始化勾选 生效国家
    initEffectCountry (names,type){
        //console.log('获得的name:'+names);
        var namesArr = [];
        var idList = [];
        if(names !== ''){
          namesArr = names.split(";");
        }
        var len = this.effectCountryForm.stateCode.length;
        for(var i=0;i<namesArr.length;i++){
            for(var j=0;j<len;j++){
                if(namesArr[i] === this.effectCountryForm.stateCode[j].name){
                   idList.push(j);
                   this.$refs.effectCountryTable.toggleRowSelection(this.effectCountryForm.stateCode[j],true);
                   break;
                }
            }
        };
        this.effectCountryForm.countrysType = type; //初始化生效国家类型
    },
    //关键字搜索生效国家
    searchEffectCountry (){
      var key = this.searchCountyKey.trim(),
          searchResult = false;

      if (!key){
        this.$message.error("请输入国家名称!");
        return false;
      }
      for(var j=0;j<this.effectCountryForm.stateCode.length;j++){
        if(key ===this.effectCountryForm.stateCode[j].name){
          this.$refs.effectCountryTable.toggleRowSelection(this.effectCountryForm.stateCode[j]);
          searchResult = true;
          break;
        }
      }
      !searchResult ? this.$message.error("没有找到该国家!") : '';
    },
    //显示 生效国家
    showEffectCountry (type,name){
       // console.log(name);
      this.effectCountryList = '';
      var typeStr = '';
      if(type === 1){
          typeStr = '等于';
      };
      if(type === 2){
          typeStr = '不等于';
      };
      if(type === 3){
          typeStr = '正则';
      };
      if(type===''){
          typeStr = '';
      };
      this.effectCountryList = typeStr + '"' + name + '"';
    },
    //生效国家 取消
    effectCountryDialogCancel (){
      this.effectCountryDialog = false;
    },
    //新增 编辑 生效网站
    newEditSite (){
      this.effectSiteDialog = true;
      this.effectSiteForm.sitesList = [];
      this.effectSiteForm.siteNamesArr = [];
      this.checkedSitesLoading = true;
      this.$http.get('api/site/get-site-info').then(res =>{   //获得网站信息
          if(res.body.code ===0 ){
               var code = '' , name = '';
               for(var i=0;i<res.body.data.length;i++){
                 code =  res.body.data[i].code ;
                 name =  res.body.data[i].name ;
                 this.effectSiteForm.sitesList.push({code:code,name:name});
                 this.effectSiteForm.siteNamesArr.push(name);
               }
           }else{
               this.$message.error(res.body.message);
          };
       });
       this.effectSiteForm.checkedSites = this.option.sitesName.split(','); //初始化被选择项
       this.checkedSitesLoading = false;
    },
    //删除 生效网站
    deleteSite (){
      this.$confirm('是否删除该项?','提示',{
        type:'warning'
      }).then(() => {
        this.option.sitesName = '';
        this.option.sitesCode = '';
        this.$message({
          type: 'success',
          message: '删除成功'
        });
      }).catch(() => {
        this.$message({
          type:'info',
          message:'已取消删除'
        });
      });
    },
    //生效网站 全选
    handleSiteCheckAll (event){
      this.effectSiteForm.checkedSites = event.target.checked ? this.effectSiteForm.siteNamesArr : [] ;
      this.effectSiteForm.isIndeterminate = false;
      //console.log(this.effectSiteForm.checkedSites);
    },
    //生效网站 网站选择
    handleCheckedSite (value){
        //console.log(value);
        this.effectSiteForm.checkedSites = value;
    },
    //生效网站 保存
    effectSiteDialogSave (){
      if((this.effectSiteForm.checkedSites.length === 0) || (this.effectSiteForm.checkedSites.length === 1 && this.effectSiteForm.checkedSites[0] === '')){
        this.$message.error('请选择生效网站！');
        return false;
      }
       var namesArr = this.effectSiteForm.checkedSites;
       //去除空元素
      for(var i=0;i<namesArr.length;i++){
          if(namesArr[i] ===''){
            namesArr.splice(i,1);
          };
      };
      //console.log(namesArr);
       var codeArr = [];
       this.option.sitesName = namesArr.join();
       for(var i=0;i<namesArr.length;i++){
           for(var j=0;j<this.effectSiteForm.sitesList.length;j++){
               if(namesArr[i] === this.effectSiteForm.sitesList[j].name ){
                 codeArr.push(this.effectSiteForm.sitesList[j].code);
               }
           }
       }
      this.option.sitesCode = codeArr.join();
      this.effectSiteDialog = false;
    },
    //生效网站 取消
    effectSiteDialogCancel (){
      this.effectSiteDialog = false;
    },
    //优先（必须）使用物流
    clickValidCode (){
      this.ValidCodeDialog = true;
      var infoList = [];
      //console.log(this.selectValidCodesData);
      this.selectValidCodesData = [];
      this.ValidCodetableLoading = true;
      this.$http.get('logistics/way/public-oms-ways').then(res => {
          if (res.body.code === 0) {
            infoList  = res.body.data.infoList;
            //console.log(infoList.length);
            var codesArr = this.option.logisticsValidCode.split(',');
            for(var i=0;i<codesArr.length;i++){
              for(var j=0;j<infoList.length;j++){
                if(codesArr[i] === infoList[j].logisticsCode){
                  this.selectValidCodesData.push(infoList[j]);
                  infoList.splice(j, 1);
                }
              }
            };
            this.ValidCodetableLoading = false;
            this.ValidCodesData = infoList;
            //console.log(this.selectValidCodesData);
          }else{
            this.ValidCodesData = [];
          }
        });
    },

    LoadValidCodes (){
      var keyword = this.ValidCodes.logisticsCode;
      if(keyword ===''){    //查找剩余的全部
        var  infoList = [];
        this.ValidCodetableLoading = true;
        this.$http.get('logistics/way/public-oms-ways').then(res => {
          if(res.body.code === 0){
            infoList  = res.body.data.infoList;
            var codesArr = this.selectValidCodesData;
            for(var i=0;i<codesArr.length;i++){
              for(var j=0;j<infoList.length;j++){
                if(codesArr[i].logisticsCode === infoList[j].logisticsCode){
                  //this.selectValidCodesData.push(infoList[j]);
                  infoList.splice(j, 1);
                }
              }
            };
            this.ValidCodetableLoading = false;
            this.ValidCodesData = infoList;
            //console.log(this.ValidCodesData.length);
          }
        });
        //return false;
      };
    },

    ValidCodeSearch (){
        //console.log(this.ValidCodes.logisticsCode);
        var keyword = this.ValidCodes.logisticsCode;
        var resultSign = 1;
        for(var i=0;i<this.ValidCodesData.length;i++){
            if(keyword===this.ValidCodesData[i].logisticsCode){
              resultSign = 2;
              var result = this.ValidCodesData[i];
              //console.log(result);
              this.ValidCodesData = [];
              this.ValidCodesData.push(result);
              break;
            }
        };
        if(resultSign === 1){
           this.$message.error('找不到符合条件的项');
        };

    },
    //优先（必须）使用物流 确定
    ValidCodeDialogSave (){
      //this.selectValidCodesData
      var selectValidCodeArr = [];
      for(var i=0;i<this.selectValidCodesData.length;i++){
        selectValidCodeArr.push(this.selectValidCodesData[i].logisticsCode);
      }
      this.option.logisticsValidCode = selectValidCodeArr.join();
      this.ValidCodeDialog = false;
    },
    //优先（必须）使用物流 取消
    ValidCodeDialogCancel (){
      this.ValidCodeDialog = false;
    },
    //优先（必须）使用物流 添加物流编码
    addValidCode (row){
      let index = this.ValidCodesData.indexOf(row);
      this.selectValidCodesData.push(row);
      this.ValidCodesData.splice(index, 1);
     // console.log(this.ValidCodesData.length);
    },
    //优先（必须）使用物流 删除物流编码
    removeValidCode (row){
      let index = this.selectValidCodesData.indexOf(row);
      this.$confirm('是否删除该项?','提示',{
        type:'warning'
      }).then(() => {
        this.ValidCodesData.push(row);
        this.selectValidCodesData.splice(index,1);
        this.$message({
          type: 'success',
          message: '删除成功'
        });
      }).catch(() => {
        this.$message({
          type:'info',
          message:'已取消删除'
        });
      });
    },
    //不可使用物流
    clickInValidCode (){
      this.InValidCodeDialog = true;
      var infoList = [];
      this.selectInValidCodesData = [];
      this.InValidCodetableLoading = true;
      this.$http.get('logistics/way/public-oms-ways').then(res => {
        if (res.body.code === 0) {
          infoList = res.body.data.infoList;
          var codesArr = this.option.logisticsInvalidCode.split(',');
          for(var i=0;i<codesArr.length;i++){
              for(var j=0;j<infoList.length;j++) {
                if (codesArr[i] === infoList[j].logisticsCode) {
                  this.selectInValidCodesData.push(infoList[j]);
                  infoList.splice(j, 1);
                }
              }
          };
          this.InValidCodetableLoading = false;
           this.InValidCodesData = infoList;
           //console.log(this.InValidCodesData.length);
        }else{
          this.InValidCodesData = [];
        };
      });
    },

    LoadInValidCodes (){
      var keyword = this.InValidCodes.logisticsCode;
      if(keyword ===''){ //查找剩余的全部
        var  infoList = [];
        this.InValidCodetableLoading = true;
        this.$http.get('logistics/way/public-oms-ways').then(res => {
          if(res.body.code === 0){
            infoList = res.body.data.infoList;
            var codesArr = this.selectInValidCodesData;
            for(var i=0;i<codesArr.length;i++){
              for(var j=0;j<infoList.length;j++){
                if(codesArr[i].logisticsCode === infoList[j].logisticsCode){
                  //this.selectValidCodesData.push(infoList[j]);
                  infoList.splice(j, 1);
                }
              }
            };
            this.InValidCodetableLoading = false;
            this.InValidCodesData = infoList;
           // console.log(this.InValidCodesData.length);
          }
        });
      };
    },

    InValidCodeSearch (){
        var keyword = this.InValidCodes.logisticsCode;
        //console.log(keyword);
      var resultSign = 1;
      for(var i=0;i<this.InValidCodesData.length;i++){
        if(keyword===this.InValidCodesData[i].logisticsCode){
          resultSign = 2;
          var result = this.InValidCodesData[i];
          //console.log(result);
          this.InValidCodesData = [];
          this.InValidCodesData.push(result);
          break;
        }
      };
      if(resultSign === 1){
        this.$message.error('找不到符合条件的项');
      };
    },

    //不可使用物流 确定
    InValidCodeDialogSave (){
      //this.selectValidCodesData
      var selectInValidCodeArr = [];
      for(var i=0;i<this.selectInValidCodesData.length;i++){
        selectInValidCodeArr.push(this.selectInValidCodesData[i].logisticsCode);
      }
      this.option.logisticsInvalidCode = selectInValidCodeArr.join();
      this.InValidCodeDialog = false;
    },
    //不可使用物流 取消
    InValidCodeDialogCancel (){
      this.InValidCodeDialog = false;
    },
    //不可使用物流 添加物流编码
    addInValidCode (row){
      let index = this.InValidCodesData.indexOf(row);
      this.selectInValidCodesData.push(row);
      this.InValidCodesData.splice(index, 1);
    },
    //不可使用物流 删除物流编码
    removeInValidCode (row){
      let index = this.selectInValidCodesData.indexOf(row);
      this.$confirm('是否删除该项?','提示',{
        type:'warning'
      }).then(() => {
        this.InValidCodesData.push(row);
        this.selectInValidCodesData.splice(index,1);
        this.$message({
          type: 'success',
          message: '删除成功'
        });
      }).catch(() => {
        this.$message({
          type:'info',
          message:'已取消删除'
        });
      });
    },
    //保存 最优物流规则编辑
    editRuleSave (){
        var initValidArr = [] , initInValidArr = [] ;
        initValidArr = this.option.logisticsValidCode.split(',');
        initInValidArr = this.option.logisticsInvalidCode.split(',');
        //console.log(initValidArr);
       // console.log(initInValidArr);
        if(this.option.name === ''){
            this.$message.error('规则名称不能为空');
            return false;
        };
        if(self.isRuleNameExist){
          this.$message.error('规则名称已存在!');
          return false;
        };
        if(this.option.sitesName ===''){
            this.$message.error('生效网站不能为空');
            return false;
        };
        if(this.effectCountryList ===''){
            this.$message.error('生效国家不能为空');
            return false;
        };
        if(this.option.logisticsValidCode ==='' && this.option.logisticsInvalidCode ==='' ){
            this.$message.error('优先使用物流和不可使用物流至少要填写一项');
            return false;
        };
        if(initValidArr.length>0 && initInValidArr.length>0){
            for(var i=0;i<initValidArr.length;i++){
                for(var j=0;j<initInValidArr.length;j++){
                    if(initValidArr[i] === initInValidArr[j]){
                      this.$message.error('优先使用物流和不可使用物流不能同时存在相同的项');
                      return false;
                    }
                }
            }
        }

        if (this.option.ruleItem && this.option.ruleItem.length > 0) {
        let tempArr = this.option.ruleItem;
        let appointCount = 0, natureCount = 0, onType ='';
        tempArr.forEach((item) => {
          if (item.type === 11) {
            appointCount++;
          } else if (item.type === 3) {
            natureCount++;
            onType = item.opType;
          }
        });
        if (appointCount>0 && natureCount===0) {
          this.$message.error("指定性质数量只能与产品性质一起设置，并且都只能设置一条");
          return false;
        }
        if (appointCount===1 && natureCount===1 && onType===2) {
          this.$message.error("指定性质数量只能与产品性质一起设置，且产品性质条件只能设置等于");
          return false;
        }
      }

        //删除不需要传参的属性
        delete this.option.updateUser;
        delete this.option.updateTime;
        delete this.option.createTime;
        delete this.option.createUser;
        if(this.option.ruleItem.length > 0){
           for(var i=0;i<this.option.ruleItem.length;i++){
               delete this.option.ruleItem[i].createTime;
               delete this.option.ruleItem[i].updateUser;
               delete this.option.ruleItem[i].updateTime;
               delete this.option.ruleItem[i].createUser;
               delete this.option.ruleItem[i].conditionalResult;
           }
        };
      this.$http.post('logistics/rule-info/edit', this.option).then(res => {
        if (res.body.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功'
          });
          this.$router.push({name: 'logistics_bestRule'});
        } else {
          this.$message.error(res.body.message);
        }
      })
    },

    //已设定条件 编辑
    editItem(index,arr) {
      console.log("index: "+index);
      sessionStorage.setItem("editSub",index);  //把编辑的下标存起来
      let type = arr.type;
      if (type===1){  //产品类型弹窗 begin
        this.proTypeDialog = true;
        this.editProTypeWindow = true;
        this.proTypeListLoading = true;
        this.$http.get('goods/category/list?isLeaves=false').then(res => {
          if(res.body.code ===0 ){
            this.proTypeForm.proTypeList = res.body.data.list;
            this.proTypeListLoading = false;
          }else{
            this.$message({
              type:'error',
              message: res.body.message
            });
          }
        });
        let initCondAttrList = arr.condAttr.split(";");
        setTimeout(()=>{
          this.$refs.proTypeTree.setCheckedKeys(initCondAttrList);
        },500);
        this.proTypeForm.opType = arr.opType;
      }    //产品类型弹窗 end

      if (type===2){ //指定产品数量弹窗 begin
        this.proCountDialog = true;
        this.editProCountWindow = true;
        let countList = arr.condAttr.split("-");
        this.proCountForm.beginCount = countList[0];
        this.proCountForm.endCount = countList[1];
      }  //指定产品数量弹窗 end

      if (type===3){   //产品性质弹窗 begin
        this.proNatureDialog = true;
        this.editProNatureWindow = true;
        this.proNatureListLoading = true;
        this.$http.get('logistics/public/contraband-attributes').then(res => {
          if(res.body.code ===0 ){
            this.proNatureForm.proNatureList = res.body.data;
            this.proNatureListLoading = false;
          }else{
            this.$message({
              type:'error',
              message: res.body.message
            });
          }
        });
        let initCondAttrList = arr.condAttr.split(";");
        initCondAttrList.forEach((item,index) =>{
            if (item===""){
              initCondAttrList.splice(index,1)
            }
        });
        setTimeout(()=> {
          this.$refs.proNatureFormTree.setCheckedKeys(initCondAttrList);
        },500);
        this.proNatureForm.opType = arr.opType;
      }  //产品性质弹窗 end

      if (type===4){ //产品编码弹窗 begin
        this.proCodeDialog = true;
        this.editProCodeWindow = true;
        this.proCodeForm.opType = arr.opType;
        this.proCodeForm.proCode = arr.condAttr;
      }  //产品编码弹窗 end

      if (type===5){ //州/省弹窗 begin
        this.provinceDialog = true;
        this.editProvinceWindow = true;
        this.provinceForm.provinceName = arr.condAttr;
        this.provinceForm.opType = arr.opType;
      }  //州/省弹窗 end

      if (type===6){  //城市弹窗 begin
        this.cityDialog = true;
        this.editCityWindow = true;
        this.cityForm.cityName = arr.condAttr;
        this.cityForm.opType = arr.opType;
      }  //城市弹窗 end

      if (type===7){ //收件地址弹窗 begin
        this.addressDialog = true;
        this.editAddressWindow = true;
        this.addressForm.addressName = arr.condAttr;
        this.addressForm.opType = arr.opType;
      } //收件地址弹窗 end

      if (type===8){ //邮编弹窗 begin
        this.zipCodeDialog = true;
        this.editZipWindow = true;
        this.zipCodeForm.code = arr.condAttr;
        this.zipCodeForm.opType = arr.opType;
      } //邮编弹窗 end

      if (type===9){ //订单金额弹窗 begin
        this.orderAmountDialog = true;
        this.editOrderAmountWindow = true;
        let opType = arr.opType;
        if (opType===9){
          this.orderAmount.beginCount = arr.condAttr;
          this.orderAmount.endCount = "";
        }
        if (opType===10){
          this.orderAmount.beginCount = "";
          this.orderAmount.endCount = arr.condAttr;
        }
        if (opType===11){
          let initcondAttrList = arr.condAttr.split(";");
          this.orderAmount.beginCount = initcondAttrList[0];
          this.orderAmount.endCount = initcondAttrList[1];
        }
      } //订单金额弹窗 end

      if (type===10){ //订单重量弹窗 begin
        this.orderWeightDialog = true;
        this.editOrderWeightWindow = true;
        let opType = arr.opType;
        if (opType===9){
          this.orderWeight.beginCount = arr.condAttr;
          this.orderWeight.endCount = "";
        }
        if (opType===10){
          this.orderWeight.beginCount = "";
          this.orderWeight.endCount = arr.condAttr;
        }
        if (opType===11){
          let initcondAttrList = arr.condAttr.split(";");
          this.orderWeight.beginCount = initcondAttrList[0];
          this.orderWeight.endCount = initcondAttrList[1];
        }
      } //订单重量弹窗 end
      if (type=== 11) {
        this.appointNatureCountDialog = true;
        this.editAppointNatureCountWindow = true;
        let editAppointArr = arr.condAttr.split(";");
        this.appointNatureCount.beginCount = editAppointArr[0];
        this.appointNatureCount.endCount = editAppointArr[1];
      }

    },  //已设定条件 编辑 end

    //编辑产品类别保存
    editProTypeDialogSave (){
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      let condAttr = this.$refs.proTypeTree.getCheckedNodes() ; //被选中的项
      if(condAttr.length === 0){
        this.$message.error('请选择产品类别！');
        return false;
      }
      let idArr = this.getIdArray(condAttr);
      let opType = this.proTypeForm.opType;
      this.option.ruleItem[index].condAttr = idArr;
      this.option.ruleItem[index].opType = opType;
      opType === 1 ? this.option.ruleItem[index].conditionalResult = "等于" + idArr : "";
      opType === 2 ? this.option.ruleItem[index].conditionalResult = "不等于" + idArr : "";
      this.proTypeDialog = false;
    },  //编辑产品类别保存 end

    //编辑指定产品数量保存 begin
    editProCountSave (){
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      let begin = Number(this.proCountForm.beginCount) , end = Number(this.proCountForm.endCount) ;
      let condAttr = "", conditionalResult = "";
      let regCount = /^\+?[1-9]\d*$/;
      if(this.proCountForm.beginCount === ''){
        this.$message.error("请输入产品数量起始值！");
        return false;
      }
      if(this.proCountForm.endCount === ''){
        this.$message.error("请输入产品数量结束值！");
        return false;
      }
      if(isNaN(this.proCountForm.beginCount) || isNaN(this.proCountForm.endCount)){
        this.$message.error("你输入的不是数字！");
        return false;
      }
      if(begin>end){
        this.$message.error("起始值不能大于结束值！");
        return false;
      }
      if (!regCount.test(begin) || !regCount.test(end)) {
        this.$message.error("请输入大于0的正整数！");
        return false;
      }

      condAttr = parseInt(Number(this.proCountForm.beginCount)) + "-" + parseInt(Number(this.proCountForm.endCount));
      conditionalResult = "从" + parseInt(Number(this.proCountForm.beginCount)) + "到" + parseInt(Number(this.proCountForm.endCount));
      this.option.ruleItem[index].condAttr = condAttr;
      this.option.ruleItem[index].conditionalResult = conditionalResult;
      this.proCountDialog = false;
    },  // 编辑指定产品数量保存 end

    //编辑产品性质保存 begin
    editProNatureDialogSave (){
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      let condAttr = this.$refs.proNatureFormTree.getCheckedNodes() ; //被选中的项
      if(condAttr.length === 0){
        this.$message.error('请选择产品性质！');
        return false;
      }
      //console.log(condAttr);
      let idArr = [];
      let opType = this.proNatureForm.opType;
      condAttr.forEach((item)=> {
        idArr.push(item.propertyCode);
      });
      this.option.ruleItem[index].condAttr = idArr.join(";");
      this.option.ruleItem[index].opType = opType;
      opType === 1 ? this.option.ruleItem[index].conditionalResult = "等于" + "\"" + idArr.join(";") + "\"" : "";
      opType === 2 ? this.option.ruleItem[index].conditionalResult = "不等于" + "\"" + idArr.join(";") + "\"" : "";
      this.proNatureDialog = false;
    }, //编辑产品性质保存 end

    //编辑产品编码保存 begin
    editProCodeDialogSave (){
      if(this.proCodeForm.proCode === ''){
        this.$message.error('请输入产品编码！');
        return false;
      }
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      let condAttr = (this.proCodeForm.proCode.replace(/\ +/g,"")).replace(/[\r\n]/g,"");
      let opType = this.proCodeForm.opType;
      this.option.ruleItem[index].condAttr = condAttr;
      this.option.ruleItem[index].opType = opType;
      opType === 1 ? this.option.ruleItem[index].conditionalResult = "等于" + "\"" + condAttr + "\"" : '';
      opType === 2 ? this.option.ruleItem[index].conditionalResult = "不等于" + "\"" + condAttr + "\"" : '';
      opType === 3 ? this.option.ruleItem[index].conditionalResult = "包含" + "\"" + condAttr + "\"" : '';
      opType === 4 ? this.option.ruleItem[index].conditionalResult = "不包含" + "\"" + condAttr + "\"" : '';
      opType === 5 ? this.option.ruleItem[index].conditionalResult = "开头" + "\"" + condAttr + "\"" : '';
      this.proCodeDialog = false;
    },

    //编辑州/省保存 begin
    editProvinceDialogSave (){
      if(this.provinceForm.provinceName === ''){
        this.$message.error('请输入收件州/省');
        return false;
      }
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      let condAttr = this.provinceForm.provinceName;
      let opType = this.provinceForm.opType;
      this.option.ruleItem[index].condAttr = condAttr;
      this.option.ruleItem[index].opType = opType;
      opType === 1 ? this.option.ruleItem[index].conditionalResult = "等于" + "\"" + condAttr + "\"" : '';
      opType === 2 ? this.option.ruleItem[index].conditionalResult = "不等于" + "\"" + condAttr + "\"" : '';
      opType === 3 ? this.option.ruleItem[index].conditionalResult = "包含" + "\"" + condAttr + "\"" : '';
      opType === 4 ? this.option.ruleItem[index].conditionalResult = "不包含" + "\"" + condAttr + "\"" : '';
      opType === 5 ? this.option.ruleItem[index].conditionalResult = "开头" + "\"" + condAttr + "\"" : '';
      opType === 6 ? this.option.ruleItem[index].conditionalResult = "正则" + "\"" + condAttr + "\"" : '';
      this.provinceDialog = false;
    }, //编辑州/省保存 end

    //编辑城市 begin
    editCityDialogSave (){
      if(this.cityForm.cityName === ''){
        this.$message.error('请输入收件城市!');
        return false;
      }
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      let condAttr = this.cityForm.cityName;
      let opType = this.cityForm.opType;
      this.option.ruleItem[index].condAttr = condAttr;
      this.option.ruleItem[index].opType = opType;
      opType === 1 ? this.option.ruleItem[index].conditionalResult = "等于" + "\"" + condAttr + "\"" : '';
      opType === 2 ? this.option.ruleItem[index].conditionalResult = "不等于" + "\"" + condAttr + "\"" : '';
      opType === 3 ? this.option.ruleItem[index].conditionalResult = "包含" + "\"" + condAttr + "\"" : '';
      opType === 4 ? this.option.ruleItem[index].conditionalResult = "不包含" + "\"" + condAttr + "\"" : '';
      opType === 5 ? this.option.ruleItem[index].conditionalResult = "开头" + "\"" + condAttr + "\"" : '';
      opType === 6 ? this.option.ruleItem[index].conditionalResult = "正则" + "\"" + condAttr + "\"" : '';
      this.cityDialog = false;
    }, //编辑城市 end

    //编辑收件地址 begin
    editAddressDialogSave (){
      if(this.addressForm.addressName === ''){
        this.$message.error('请输入收件地址!');
        return false;
      }
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      let condAttr = this.addressForm.addressName;
      let opType = this.addressForm.opType;
      this.option.ruleItem[index].condAttr = condAttr;
      this.option.ruleItem[index].opType = opType;
      opType === 1 ? this.option.ruleItem[index].conditionalResult = "等于" + "\"" + condAttr + "\"" : '';
      opType === 2 ? this.option.ruleItem[index].conditionalResult = "不等于" + "\"" + condAttr + "\"" : '';
      opType === 3 ? this.option.ruleItem[index].conditionalResult = "包含" + "\"" + condAttr + "\"" : '';
      opType === 4 ? this.option.ruleItem[index].conditionalResult = "不包含" + "\"" + condAttr + "\"" : '';
      opType === 5 ? this.option.ruleItem[index].conditionalResult = "开头" + "\"" + condAttr + "\"" : '';
      opType === 6 ? this.option.ruleItem[index].conditionalResult = "正则" + "\"" + condAttr + "\"" : '';
      this.addressDialog = false;
    }, //编辑收件地址 end

    //编辑邮编 begin
    editZipCodeDialogSave (){
      if(this.zipCodeForm.code === ''){
        this.$message.error('请输入收件邮编!');
        return false;
      }
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      let condAttr = this.zipCodeForm.code;
      let opType = this.zipCodeForm.opType;
      this.option.ruleItem[index].condAttr = condAttr;
      this.option.ruleItem[index].opType = opType;
      opType === 1 ? this.option.ruleItem[index].conditionalResult = "等于" + "\"" + condAttr + "\"" : '';
      opType === 2 ? this.option.ruleItem[index].conditionalResult = "不等于" + "\"" + condAttr + "\"" : '';
      opType === 3 ? this.option.ruleItem[index].conditionalResult = "包含" + "\"" + condAttr + "\"" : '';
      opType === 4 ? this.option.ruleItem[index].conditionalResult = "不包含" + "\"" + condAttr + "\"" : '';
      opType === 5 ? this.option.ruleItem[index].conditionalResult = "开头" + "\"" + condAttr + "\"" : '';
      opType === 6 ? this.option.ruleItem[index].conditionalResult = "正则" + "\"" + condAttr + "\"" : '';
      opType === 7 ? this.option.ruleItem[index].conditionalResult = "区间" + "\"" + condAttr + "\"" : '';
      opType === 8 ? this.option.ruleItem[index].conditionalResult = "不等于区间" + "\"" + condAttr + "\"" : '';
      this.zipCodeDialog = false;
    },  //编辑邮编 end

    //编辑订单金额 begin
    editOrderAmountSave (){
      let beginVal = this.orderAmount.beginCount,
          endVal = this.orderAmount.endCount,
          modelName = "订单金额",
          errorMsg = "必须为大于0的2位小数",
          reg = /^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/;
      this.orderAmountValidateResult = true;
      this.ValidateFun (beginVal, endVal, modelName, errorMsg, reg);
      if (!this.orderAmountValidateResult){
        return false;
      }
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      if (this.orderAmount.beginCount && this.orderAmount.endCount){  //两个输入框都填写
        this.option.ruleItem[index].condAttr = beginVal + ";" + endVal;
        this.option.ruleItem[index].opType = 11;
        this.option.ruleItem[index].conditionalResult = "大于等于" + beginVal + "小于等于" + endVal;
      }
      if (!this.orderAmount.beginCount && this.orderAmount.endCount){  //只填写了第二个输入框
        this.option.ruleItem[index].condAttr = endVal;
        this.option.ruleItem[index].opType = 10;
        this.option.ruleItem[index].conditionalResult = "小于等于" + endVal;
      }
      if (this.orderAmount.beginCount && !this.orderAmount.endCount){  //只填写了第一个输入框
        this.option.ruleItem[index].condAttr = beginVal;
        this.option.ruleItem[index].opType = 9;
        this.option.ruleItem[index].conditionalResult = "大于等于" + beginVal;
      }
      this.orderAmountDialog = false;
    }, //编辑订单金额 end

    //编辑订单重量 begin
    editOrderWeightSave (){
      let beginVal = this.orderWeight.beginCount,
          endVal = this.orderWeight.endCount,
          modelName = "订单重量",
          errorMsg = "必须为大于0的3位小数",
          reg = /^0{1}([.]\d{1,3})?$|^[1-9]\d*([.]{1}[0-9]{1,3})?$/;
      this.orderWeightValidateResult = true;
      this.ValidateFun (beginVal, endVal, modelName, errorMsg, reg);
      if (!this.orderWeightValidateResult){
        return false;
      }
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      if (this.orderWeight.beginCount && this.orderWeight.endCount){  //两个输入框都填写
        this.option.ruleItem[index].condAttr = beginVal + ";" + endVal;
        this.option.ruleItem[index].opType = 11;
        this.option.ruleItem[index].conditionalResult = "大于等于" + beginVal + "小于等于" + endVal;
      }
      if (!this.orderWeight.beginCount && this.orderWeight.endCount){  //只填写了第二个输入框
        this.option.ruleItem[index].condAttr = endVal;
        this.option.ruleItem[index].opType = 10;
        this.option.ruleItem[index].conditionalResult = "小于等于" + endVal;
      }
      if (this.orderWeight.beginCount && !this.orderWeight.endCount){  //只填写了第一个输入框
        this.option.ruleItem[index].condAttr = beginVal;
        this.option.ruleItem[index].opType = 9;
        this.option.ruleItem[index].conditionalResult = "大于等于" + beginVal;
      }
      this.orderWeightDialog = false;
    },//编辑订单重量 end

    //编辑指定性质的产品数量 begin
    editAppointNatureCountSave (){
      let reg = /^\+?[1-9]\d*$/;
      let begin = this.appointNatureCount.beginCount;
      let end = this.appointNatureCount.endCount;
      let beginValid = reg.test(begin) && parseInt(begin) < 1000 && begin;
      let endValid = reg.test(end) && parseInt(end) < 1000 && end;

      if (!beginValid && !endValid) {
        this.$message.error('请输入大于0且小于1000的整数!');
        return false;
      }
      if (parseInt(begin)>parseInt(end)) {
        this.$message.error('起始值不能大于结束值!');
        return false;
      }
      let index = sessionStorage.getItem("editSub");  //编辑数组的下标
      if (beginValid && !endValid) {
        this.option.ruleItem[index].condAttr = parseInt(begin) + ';' + 999;
        this.option.ruleItem[index].conditionalResult = '大于等于' + parseInt(begin) + '小于等于' + 999;
      } else  if (!beginValid && endValid) {
        this.option.ruleItem[index].condAttr = 1 + ';' + parseInt(end);
        this.option.ruleItem[index].conditionalResult = '大于等于' + 1 + '小于等于' + parseInt(end);
      } else if (beginValid && endValid) {
        this.option.ruleItem[index].condAttr = parseInt(begin) + ';' + parseInt(end);
        this.option.ruleItem[index].conditionalResult = '大于等于' + parseInt(begin) + '小于等于' + parseInt(end);
      }
      console.log(this.option.ruleItem);
      this.appointNatureCountDialog = false;
    },
    //编辑指定性质的产品数量 end

    //是否存在指定性质的产品数量条件
    isExistAppointNatureCount (){
      if (this.option.ruleItem && this.option.ruleItem.length>0) {
        let tempArr = this.option.ruleItem;
        let count = 0;
        tempArr.forEach( (item) => {
          if (item.type === 11) {
            count ++;
          }
        });
        if (count>=1) {
          return true;
        }
      }
    },

  }, //methods end
}
</script>


<style lang="less">
  .ruleItem{
    margin-bottom:10px;
  }
  .proTypeTree{
    height: 600px !important;
    overflow-y: auto !important;
    margin-bottom:10px;
  }
  .proCountBtn{
    margin:10px 0 0 52%;
  }
  .proCodeTitle{
    padding-left:50px;
  }
  .effectCountryTable{
    height: 600px;
    overflow-y: auto;
  }
  .siteCheckAll{
    padding-left:15px;
  }
  .effect-site-dialog .el-checkbox-group .el-checkbox:first-child{
      margin-left:14px;
  }

  .ValidCodeStyle{
      & > div{
            height: 420px !important;
            overflow-y: auto !important;
          }
  }
  .ValidCodeFoot{
    margin-top:30px;
  }

</style>
