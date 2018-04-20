<!-- 新增/编辑销售仓 -->
<template>
    <div>
        <div class="el-container" v-loading="isDataLoading">

            <div v-show="!isGetDataError" class="el-sub-container">

                <h3 class="stock-title">{{isEdit ? '编辑销售仓' : '新建销售仓'}}</h3>

                <el-form :model="virtualWareHouseInfo" ref="form" :rules="rulesVirtual" label-width="200px">
                    <el-form-item label="仓编码：" v-if="isEdit">
                        <el-row :gutter="10">
                            <el-col :span="5">{{virtualWareHouseInfo.virWhCode}}</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="仓库名称：" prop="virWhCnName">
                        <el-row :gutter="10">
                            <el-col :span="14">
                                <el-input v-model.trim="virtualWareHouseInfo.virWhCnName"></el-input>
                            </el-col>
                            <el-col :span="8">
                                <el-checkbox v-model="virtualWareHouseInfo.status" :true-label="1" :false-label="0" :disabled="virtualWareHouseInfo.isDefault == 1">是否开启</el-checkbox>
                                <el-checkbox v-model="virtualWareHouseInfo.isDefault" :true-label="1" :false-label="2" :disabled="virtualWareHouseInfo.isDefault == 1 || virtualWareHouseInfo.status != 1" @change="handleToggleDefault">设为默认仓</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="英文名称：" prop="virWhEnName">
                        <el-row :gutter="10">
                            <el-col :span="14">
                                <el-input v-model.trim="virtualWareHouseInfo.virWhEnName"></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="排序：" prop="sort">
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-input v-model="virtualWareHouseInfo.sort" min="0"></el-input>
                            </el-col>
                            <el-col :span="6">
                                用于网站展示排序，数字越大越靠前
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="图片链接：" prop="whLogo">
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-input v-model.trim="virtualWareHouseInfo.whLogo"></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="真实仓：">
                        <el-row :gutter="10">
                            <el-col :span="14">
                                <!-- <el-select v-model="realWarehouseSelected" ref="realWarehouseSlt" filterable clearable placeholder="请选择">
                                    <el-option v-for="(item, index) in realList" :label="item.name" :value="item.rwhCode" :key="index"></el-option>
                                </el-select> -->
                                <span class="ac-real-list-wrap">
                                    <el-autocomplete v-model="realWarehouseSelected" :fetch-suggestions="realListQuerySearch" @select="handleSelectRealList" placeholder="请选择实体仓或输入实体仓名称搜索" icon="circle-close" :on-icon-click="handleRealListDelIconClick"></el-autocomplete>
                                    <i class="el-icon-caret-bottom"></i>
                                </span>
                                <div class="el-sub-container">
                                    <el-table :data="realWareHouseList" border>
                                        <el-table-column prop="realWhName" label="实体仓库">
                                            <template scope="scope">
                                                {{scope.row.realWhName}}（{{scope.row.realWhCode}}）
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="是否开启虚拟库存" width="160">
                                            <template scope="scope">
                                                <el-button type="text" @click="handleToggleVirtualClick(scope.$index, scope.row.approveResult, scope.row.id)"><i :class="{'el-icon-circle-check color-success': scope.row.isVirtual == 1, 'el-icon-circle-cross color-danger': scope.row.isVirtual == 0}"></i></el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="私有部分" width="100">
                                            <template scope="scope">
                                                <el-button type="text" @click="handleTogglePublicClick(scope.$index, scope.row.approveResult, scope.row.id)"><i :class="{'el-icon-circle-check color-success': scope.row.isPublic == 2, 'el-icon-circle-cross color-danger': scope.row.isPublic == 1}"></i></el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="公有部分" width="100">
                                            <template scope="scope">
                                                <el-button type="text" @click="handleTogglePublicClick(scope.$index, scope.row.approveResult, scope.row.id)"><i :class="{'el-icon-circle-check color-success': scope.row.isPublic == 1, 'el-icon-circle-cross color-danger': scope.row.isPublic == 2}"></i></el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="审核状态" width="120">
                                            <template scope="scope">
                                                {{ approveStatusText[scope.row.approveResult] }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" width="90">
                                            <template scope="scope">
                                                <el-button type="text" size="small" @click="handleBtnOperateWarhouseClick(scope.$index, scope.row.approveResult)" v-if="scope.row.approveResult === 3"><i class="el-icon-close"></i> {{scope.row.id ? '撤回' : '删除'}} </el-button>
                                                <el-button type="text" :disabled="isPutGray" size="small" @click="handleBtnOperateWarhouseClick(scope.$index, scope.row.approveResult)" v-else-if="scope.row.approveResult === 1"><i class="el-icon-close"></i> 关闭仓</el-button>
                                                <template v-else-if="scope.row.approveResult === 2">
                                                    <el-button type="text" size="small" @click="showReason(scope.row)" >原因</el-button>
                                                    <el-button type="text" size="small" @click="handleBtnOperateWarhouseClick(scope.$index, scope.row.approveResult)" >删除</el-button>
                                                </template>
                                                <el-button type="text" size="small" @click="handleBtnOperateWarhouseClick(scope.$index, scope.row.approveResult)" v-else-if="scope.row.approveResult === 4"><i class="el-icon-close"></i> 撤回</el-button>
                                                <el-button type="text" size="small" @click="handleBtnOperateWarhouseClick(scope.$index, scope.row.approveResult)" v-else-if="scope.row.approveResult === 5"><i class="el-icon-close"></i> 关闭</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <!-- 弹框先写 -->
                                    <!-- <el-button type="danger" size="small" @click="handleBtnCloseWarhouseClick()">关闭</el-button>
                                    <el-button type="primary" size="small" @click="handleBtnProgressWarhouseClick()">查看进度</el-button> -->

                                    <el-dialog title="关闭真实仓" v-model="shutDownWareHouse.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"  class="wareHouse-apply-dialog" size="tiny">
                                        <div class="el-container">
                                            <div class="el-sub-container">
                                                <div class="el-close-tip">确定将[{{shutDownWareHouse.whName}}]下的[{{shutDownWareHouse.item ? shutDownWareHouse.item.realWhName : ''}}]关闭吗？</div>
                                                <div>
                                                    <i class="el-icon-information el-risk"></i>
                                                    <span>此操作存在风险项，请先查询了解！</span>
                                                    <el-button type="warning" size="small" class="el-find-risk-btn" @click="checkRisk(shutDownWareHouse.item,1)" >查询风险</el-button>
                                                </div>
                                                <div class="el-risk-text" v-if="shutDownWareHouse.isShowRisk">
                                                    <div class="el-risk-text-title">
                                                        <span>*</span>以下为销售仓下关联此真实仓的相关影响数据（实时）
                                                    </div>
                                                    <div class="el-risk-text-content" element-loading-text="正在查询中，请不要关闭弹窗" v-loading="shutDownWareHouse.isRiskLoading">
                                                        <template v-if="risks">
                                                            <div><span>商品：</span><span class="num">{{risks.saleGoodsNow}}</span><span>个SKU正在网站售卖</span><span class="fr color-danger">关闭后将下架</span></div>
                                                            <div><span>订单：</span><span class="num">{{risks.freezeStockRecords}}</span><span>个SKU存在冻结记录</span><span class="fr color-danger">关闭后将失效</span></div>
                                                            <div><span>活动：</span><span class="num">{{risks.occupancyApply}}</span><span>个占用申请正在处理中</span><span class="fr color-danger">关闭后将驳回</span></div>
                                                        </template>
                                                    </div>
                                                </div>
                                                <div class="el-warning-tip">提示：需要对应网站运营负责人审批通过才能继续操作关闭</div>
                                            </div>
                                        </div>
                                        <span slot="footer" class="dialog-footer">
                                            <el-button type="primary" :loading="shutDownWareHouse.isLoading" @click="handleBtnApplyClick(shutDownWareHouse.item)">提交申请</el-button>
                                            <el-button type="danger" @click="handleBtnApplyCancelClick">取消</el-button>
                                        </span>
                                    </el-dialog>

                                    <el-dialog title="查看进度" v-model="applyProgress.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="wareHouse-progress-dialog" size="tiny">
                                        <div class="el-container">
                                            <div class="el-step-status">
                                                 <span>关闭[{{applyProgress.item ? applyProgress.item.realWhName : ''}}] 申请状态：审批通过</span>
                                                 <el-button type="warning" size="small" class="el-find-risk-btn" @click="checkRisk(applyProgress.item,2)" >查询风险</el-button>
                                            </div>
                                            <el-steps :space="250" :active="2" :center="true" finish-status="success" class="el-steps">
                                                <el-step title="审批通过" description="绑定真实仓"></el-step>
                                                <el-step title="审批通过" description="解绑真实仓"></el-step>
                                            </el-steps>
                                            <div class="el-risk-text" v-if="applyProgress.isShowRisk">
                                                <div class="el-risk-text-title">
                                                    <span>*</span>以下为销售仓下关联此真实仓的相关影响数据（实时）
                                                </div>
                                                <div class="el-risk-text-content" element-loading-text="正在查询中，请不要关闭弹窗" v-loading="applyProgress.isRiskLoading">
                                                    <template v-if="risks">
                                                        <div><span>商品：</span><span class="num">{{risks.saleGoodsNow}}</span><span>个SKU正在网站售卖</span><span class="fr color-danger">关闭后将下架</span></div>
                                                        <div><span>订单：</span><span class="num">{{risks.freezeStockRecords}}</span><span>个SKU存在冻结记录</span><span class="fr color-danger">关闭后将失效</span></div>
                                                        <div><span>活动：</span><span class="num">{{risks.occupancyApply}}</span><span>个占用申请正在处理中</span><span class="fr color-danger">关闭后将驳回</span></div>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                        <span slot="footer" class="dialog-footer">
                                            <div class="agreement fl">
                                                 <el-checkbox v-model="isSureRisk">我已确认风险项</el-checkbox>
                                            </div>
                                            <el-button type="primary" :loading="applyProgress.isLoading" :disabled="!isSureRisk" @click="handleBtnWithdrawApplyClick(applyProgress.item)">确认关闭</el-button>
                                            <el-button type="danger" @click="handleBtnProgressCancelClick">取消</el-button>
                                        </span>
                                    </el-dialog>

                                </div>
                            </el-col>
                            <el-col :span="8">
                                <el-button type="primary" @click="handleBtnAddRealClick" :disabled="!realWarehouseSelected || !realWarehouseSelectedWhCode || (realWarehouseSelected != realWarehouseSelectedTemp)"><i class="el-icon-plus"></i> 添加</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="关税设置：" prop="customsDutyRate">
                        <el-row :gutter="10">
                            <el-col :span="4">
                                <el-input type="number" v-model.number="virtualWareHouseInfo.customsDutyRate" min="0"><template slot="append">%</template></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="发货时间：" prop="planShipTimeFrom">
                        <div class="plan-ship-time-wrap">
                            <el-input class="inline-input ipt-plan-ship-time" type="number" v-model.number="virtualWareHouseInfo.planShipTimeFrom" min="0"></el-input>
                            <span>-</span>
                            <el-input class="inline-input ipt-plan-ship-time" type="number" v-model.number="virtualWareHouseInfo.planShipTimeTo" min="0"></el-input>
                            <span class="unit">天</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="仓补偿：" required>
                        <el-row class="row-th" :gutter="10">
                            <el-col :span="3">仓补偿出货价区间</el-col>
                            <el-col :span="3">计费重量区间（kg）</el-col>
                            <el-col :span="3">追加价（人民币）</el-col>
                            <el-col :span="3">系数（乘法）</el-col>
                            <el-col :span="4">包邮物流分区（分区ID）</el-col>
                            <el-col :span="4" class="th-last pl-0">
                                <el-button type="primary" size="small" @click="warehouseCompensateAdd"><i class="el-icon-plus"></i> 添加</el-button> &nbsp;
                            </el-col>
                        </el-row>
                        <el-form :model="dataForm" ref="formWc" :inline="true" class="list-form">
                            <el-row v-for="(item, index) in dataForm.warehouseCompensateList" :key="index" :gutter="10" :id="'list-wc-' + index">
                                <el-col :span="3">
                                    <el-form-item :prop="'warehouseCompensateList.' + index + '.whCompensationShipRegion'" :rules="rules.ruleRange">
                                        <el-input v-model.trim="item.whCompensationShipRegion" class="ipt" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item :prop="'warehouseCompensateList.' + index + '.weightZone'" :rules="rules.ruleRange">
                                        <el-input v-model.trim="item.weightZone" class="ipt" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item :prop="'warehouseCompensateList.' + index + '.weightPricePlus'" :rules="rules.ruleNumber">
                                        <el-input v-model.number="item.weightPricePlus" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item :prop="'warehouseCompensateList.' + index + '.weightProfitRate'" :rules="rules.ruleNumber">
                                        <el-input v-model.number="item.weightProfitRate" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item :prop="'warehouseCompensateList.' + index + '.weightFreeDivision'" :rules="rules.ruleNumber">
                                        <el-input v-model.number="item.weightFreeDivision" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="danger" size="small" @click="warehouseCompensateDel(index)"><i class="el-icon-close"></i> 删除</el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div class="el-sub-container"></div>
                    </el-form-item>
                    <el-form-item label="追加/利润率：" required>
                        <el-row class="row-th" :gutter="10">
                            <el-col :span="3">出货价区间(￥)</el-col>
                            <el-col :span="3">追加价(￥)</el-col>
                            <el-col :span="3">利润率</el-col>
                            <el-col :span="4" class="th-last pl-0"><el-button type="primary" size="small" @click="shipRegionCompensateAdd"><i class="el-icon-plus"></i> 添加</el-button></el-col>
                        </el-row>
                        <el-form :model="dataForm" ref="formSrc" :inline="true" class="list-form">
                            <el-row v-for="(item, index) in dataForm.shipRegionCompensateList" :key="index" :gutter="10">
                                <el-col :span="3">
                                    <el-form-item :prop="'shipRegionCompensateList.' + index + '.shipRegion'" :rules="rules.ruleRange">
                                        <el-input v-model.trim="item.shipRegion" class="ipt" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item :prop="'shipRegionCompensateList.' + index + '.pricePlus'" :rules="rules.ruleNumber">
                                        <el-input v-model.number="item.pricePlus" class="ipt" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-form-item :prop="'shipRegionCompensateList.' + index + '.profitRate'" :rules="rules.profitRate">
                                        <el-input type="number" v-model.number="item.profitRate" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="danger" size="small" @click="shipRegionCompensateDel(index)"><i class="el-icon-close"></i> 删除</el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                        <div class="el-sub-container"></div>
                    </el-form-item>
                    <el-form-item label="" prop="tariff">
                        <el-row :gutter="10">
                            <el-col :span="14">
                                <el-checkbox v-model="virtualWareHouseInfo.isUseCategoryRate" :true-label="1" :false-label="0">启用分类</el-checkbox>
                                &nbsp; &nbsp; &nbsp;
                                <span class="color-danger">勾选之后仓库的追加/利润率失效，以分类为准</span>
                            </el-col>
                            <el-col :span="8"></el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>


            <div class="el-sub-container text-center">
                <el-button v-if="(this.showAction_('stock/warehouse/edit') || this.showAction_('stock/warehouse/add')) && !isGetDataError" type="primary" @click="handleBtnSaveClick" :loading="isDataLoading"><i class="el-icon-check"></i> 保存</el-button>
                <el-button v-if="(this.showAction_('stock/warehouse/edit') || this.showAction_('stock/warehouse/add')) && !isGetDataError" type="default" @click="handleBtnCancelClick" :disabled="isDataLoading">返回</el-button>
            </div>

        </div>
    </div>
</template>

<script>

export default {
    data () {
        let tempForm = null;
        let ruleNumber = [
            { required: true, message: '请输入数值' },
            { type: 'number', message: '请输入正确的数值' }
        ];
        let checkRangeFlag = false;
        // 区间数输入校验
        let checkRanges = (rule, val, callback) => {
            let reg = /^\d+\.?\d*\-\d+\.?\d*$/g;
            let arr = rule.field.split('.');
            // console.log(rule)
            let index = arr[1] - 0;
            let hasError = -1;
            if (!val) {
                return callback(new Error('不能为空'));
            }
            if (reg.test(val)) {
                let flag = true;
                let list = val.split('-');
                list.forEach((el) => {
                    if (el.charAt(0) == 0 && el.charAt(1) != '.' && el.charAt(1) != '') {
                        flag = false;
                        return callback(new Error('首位不能为0'));
                    }
                });
                if (flag && (list[1] * 1 <= list[0] * 1)) {
                    return callback(new Error('起始值不能大于或等于结束值'));
                }
            } else {
                return callback(new Error('请输入正确的数值区间'));
            }
            hasError = checkRange(val.split('-'), index, this.dataForm[arr[0]], arr[2]);
            if (hasError) {
                return callback(new Error('区间数不能有交集'));
            }
            callback();
        };
        let checkRange = (target, targetIndex, list, type) => {
            let hasError = false;
            target[0] = parseFloat(target[0]);
            target[1] = parseFloat(target[1]);
            for (let i = 0; i < list.length; i++) {
                if (targetIndex === i) {
                    continue;
                }
                let range = list[i][type].split('-');
                range[0] = parseFloat(range[0]);
                range[1] = parseFloat(range[1]);
                // console.log(target, targetIndex, range, i)
                let minAggregate = [target[0], range[0]];
                let maxAggregate = [target[1], range[1]];
                if(Math.max.apply(null, minAggregate) < Math.min.apply(null, maxAggregate)) {
                    hasError = checkIntersection(list, type === 'weightZone' ? 'whCompensationShipRegion' : 'weightZone', i, targetIndex) ? true : false;
                    break;
                }
            }
            return hasError;
        }
        let checkIntersection = (list, type, intersectionIndex, index) => {
            let range1 = list[intersectionIndex][type].split('-');
            let range2 = list[index][type].split('-');
            let minAggregate = [range1[0], range2[0]];
            let maxAggregate = [range1[1], range2[1]];
            return Math.max.apply(null, minAggregate) < Math.min.apply(null, maxAggregate);
        }
        // 校验利润率，只能输入大于0的数值，最多支持三位小数
        let checkFloat = (rule, val, callback) => {
            let reg = /^[0-9]+(.[0-9]{1,3})?$/;
            let num = parseFloat(val);
            if (!reg.test(val) || isNaN(num) || num <= 0) {
                return callback(new Error('需大于0，最多3位小数'));
            }
            callback();
        };
        let checkSort = (rule, val, callback) => {
            let reg = /^\+?[1-9][0-9]*$/;
            if (!reg.test(val) && val != '0') {
                return callback(new Error('排序只能为正整数'));
            }
            callback();
        };
        return {
            isDataLoading: false,
            isGetDataError: false,
            selectedIndex: 0,
            isEdit: false,
            approveStatusText: {
                '1': '审批通过',
                '2': '审批不通过',
                '3': '未审批',
                '4': '关闭申请',
                '5': '待关闭'
            },
            realList: [],
            realWarehouseSelected: '',
            realWarehouseSelectedTemp: '',
            realWarehouseSelectedWhCode: '',
            realWareHouseList: [],
            tempRealWareHouseList: [],
            dataForm: {
                shipRegionCompensateList: [],
                warehouseCompensateList: [],
                tempShipRegionCompensateList: [],
                tempWarehouseCompensateList: [],
            },
            shutDownWareHouse: {
                isShow: false,
                isLoading: false,
                isRiskLoading: false,
                isShowRisk: false,
                whName: '',
                item: null
            },
            applyProgress: {
                isShow: false,
                isLoading: false,
                isRiskLoading: false,
                isShowRisk: false,
                item: null
            },
            risks: {},
            virtualWareHouseInfo: {
                virWhCnName: '',
                virWhEnName: '',
                oldName: '',
                status: 0,
                isDefault: 2,
                sort: '',
                whLogo: '',
                customsDutyRate: '',
                planShipTimeFrom: '',
                planShipTimeTo: '',
                isUseCategoryRate: 0,
                virWhCode: ''
            },
            warehouseCompensateList: [],
            rulesVirtual: {
                whLogo: [{ required: true, message: '请输入图片链接' }],
                virWhCnName: [{ required: true, message: '请输入仓库名称' }],
                virWhEnName: [{ required: true, message: '请输入仓库英文名称' }],
                sort: [{ required: true, validator: checkSort, trigger: 'blur' }],
                customsDutyRate: [
                    { required: true, message: '请输入关税' },
                    { type: 'number', min: 0, message: '请输入正确的关税' }
                ],
                planShipTimeFrom: [{ required: true, message: '请输入发货时间' }],
            },
            rules: {
                ruleNumber: [
                    { required: true, message: '请输入数值' },
                    { type: 'number', min: 0, message: '请输入正确的数值' }
                ],
                ruleRange: [{ validator: checkRanges, trigger: 'blur' }],
                profitRate: [{ validator: checkFloat, trigger: 'blur' }]
            },
            isSureRisk: false,
        };
    },
    created () {

        this.isEdit = this.$route.query.virWhCode ? true : false;
        if(this.isEdit){
            this.getRealWareHouseList();
            this.getData();
        }
        this.getRealList();
    },
    computed: {
        isPutGray() {
            let filterArr = this.realWareHouseList.filter((item) => {
                return item.approveResult === 1;
            });
            if(filterArr.length === 1) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        getData () {
            let params = { virWhCodeList: this.$route.query.virWhCode };
            this.isDataLoading = true;
            this.$http.get('stock/warehouse/info', { params }).then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data.list[0];
                    this.isGetDataError = false;

                    // 获取真实仓与销售仓绑定的表格数据
                    // this.realWareHouseList = [];
                    // data.realWareHouseList && data.realWareHouseList.forEach((item) => {
                    //     this.realWareHouseList.push(item);
                    // });

                    // 分割发货时间字段
                    let obj = {};
                    if (data.planShipTime) {
                        let arr = data.planShipTime.split('-');
                        if (arr.length === 2) {
                            obj.planShipTimeFrom = arr[0] - 0;
                            obj.planShipTimeTo = arr[1] - 0;
                        }
                    } else {
                        obj.planShipTimeFrom = '';
                        obj.planShipTimeTo = '';
                    }
                    // 设置销售仓基本数据
                    obj.virWhCnName = data.virWhCnName;
                    obj.virWhEnName = data.virWhEnName;
                    obj.oldName = data.virWhCnName;
                    obj.status = data.status;
                    obj.isDefault = data.isDefault;
                    obj.sort = data.sort;
                    obj.whLogo = data.whLogo;
                    obj.customsDutyRate = data.customsDutyRate;
                    obj.isUseCategoryRate = data.isUseCategoryRate;
                    obj.virWhCode = data.virWhCode;
                    this.virtualWareHouseInfo = Object.assign({}, this.virtualWareHouseInfo, obj);

                    // 仓补偿列表数据
                    this.dataForm.warehouseCompensateList = [];
                    let weightFreeDivisionArr = data.weightFreeDivision.split('|');
                    let weightPricePlusArr = data.weightPricePlus.split('|');
                    let weightProfitRateArr = data.weightProfitRate.split('|');
                    let weightZoneArr = data.weightZone.split('|');
                    let whCompensationShipRegionArr = data.whCompensationShipRegion.split('|');

                    if(weightFreeDivisionArr.length === weightPricePlusArr.length && weightPricePlusArr.length === weightProfitRateArr.length) {
                        let len = weightFreeDivisionArr.length - 1;
                        for (let index = 0; index < len; index++) {
                            this.dataForm.warehouseCompensateList.push({
                                weightProfitRate: weightProfitRateArr[index] - 0,
                                weightPricePlus: weightPricePlusArr[index] - 0,
                                weightFreeDivision: weightFreeDivisionArr[index] - 0,
                                weightZone: weightZoneArr[index],
                                whCompensationShipRegion: whCompensationShipRegionArr[index]
                            });
                        }
                    }

                    // 追加/利润率列表数据
                    this.dataForm.shipRegionCompensateList = [];
                    let pricePlusArr = data.pricePlus.split('|');
                    let profitRateArr = data.profitRate.split('|');
                    let shipRegionArr = data.shipRegion.split('|');
                    if(pricePlusArr.length === profitRateArr.length) {
                        let len = pricePlusArr.length - 1;
                        for (let index = 0; index < len; index++) {
                            this.dataForm.shipRegionCompensateList.push({
                                pricePlus: pricePlusArr[index] - 0,
                                profitRate: profitRateArr[index] - 0,
                                shipRegion: shipRegionArr[index]
                            });
                        }
                    }
                } else {
                    this.isGetDataError = true;
                    this.$notify.error(res.body.message || '发生错误');
                }
                this.isDataLoading = false;
            },
            (err) => {
                this.isDataLoading = false;
                this.isGetDataError = true;
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        // 获取真实仓与销售仓绑定的表格数据
        getRealWareHouseList() {
            let params = { virCodeList: this.$route.query.virWhCode };
            this.$http.get('stock/warehouse/get-vir-wh-access-list', { params }).then(res => {
                if (res.body.code !== 0) {
                    return;
                }
                let data = res.body.data;
                this.realWareHouseList = [];
                data && data.forEach((item) => {
                    this.realWareHouseList.push(item);
                });
                // console.log(this.realWareHouseList)
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
            });
        },
        // 获取实体仓的列表
        getRealList() {
            this.$http.get('stock/real-warehouse/public-whcodes').then(res => {
                if (res.body.code !== 0) {
                    return;
                }
                let data = res.body.data;
                // 获取真实仓列表数据
                this.realList = [];
                data && data.forEach((item, index) => {
                    item.whCode && this.realList.push(Object.assign({}, item, { value: item.name + '（' + item.whCode + '）' }));
                });
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
            });
        },
        // 实体仓搜索
        realListQuerySearch(queryString, cb) {
            let items = this.realList;
            let results = (queryString && this.realWarehouseSelected != this.realWarehouseSelectedTemp) ? items.filter(this.realListCreateFilter(queryString)) : items;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        realListCreateFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        handleSelectRealList(item) {
            this.realWarehouseSelectedTemp = this.realWarehouseSelected;
            this.realWarehouseSelectedWhCode = item.whCode;
            // console.log(this.realWarehouseSelectedTemp + ':' + this.realWarehouseSelectedWhCode)
        },
        handleRealListDelIconClick() {
            this.realWarehouseSelected = this.realWarehouseSelectedTemp = '';
            this.realWarehouseSelectedWhCode = '';
        },
        handleBtnCancelClick(event) {
            this.$router.push({ name: 'stock_saleWarehouseList' });
        },
        handleBtnSaveClick(index) {
            let hasError = false;
            let params = {};
            let virtualWarehouse = this.virtualWareHouseInfo;
            let isNew = this.isEdit === false;
            let planShipTimeFrom = parseInt(virtualWarehouse.planShipTimeFrom);
            let planShipTimeTo = parseInt(virtualWarehouse.planShipTimeTo);
            if (isNaN(planShipTimeFrom) || isNaN(planShipTimeTo)
                || planShipTimeFrom < 0 || planShipTimeFrom >= planShipTimeTo) {
                this.$message.error('请输入正确的发货时间');
                return;
            } else {
                virtualWarehouse.planShipTimeFrom = planShipTimeFrom;
                virtualWarehouse.planShipTimeTo = planShipTimeTo;
            }
            if (isNaN(parseInt(virtualWarehouse.sort))) {
                this.$message.error('请输入正确的排序');
                return;
            } else {
                virtualWarehouse.sort = parseInt(virtualWarehouse.sort);
            }
            if (!this.realWareHouseList.length) {
                this.$message.error('请选择实体仓库');
                return;
            }
            if (!this.dataForm.warehouseCompensateList.length) {
                this.$message.error('请添加仓补偿');
                return;
            }
            if (!this.dataForm.shipRegionCompensateList.length) {
                this.$message.error('请添加追加/利润率');
                return;
            }
            // 如果一条数据中都为空则删除此条数据
            for (let index = this.dataForm.warehouseCompensateList.length - 1; index >= 0; index--) {
                let item = this.dataForm.warehouseCompensateList[index];
                let isNotEmpty = false;
                for (let k in item) {
                    if (item[k] != '') {
                        isNotEmpty = true;
                        break;
                    }
                }
                if (!isNotEmpty && this.dataForm.warehouseCompensateList.length > 1) {
                    this.dataForm.warehouseCompensateList.splice(index, 1);
                }
            }
            for (let index = this.dataForm.shipRegionCompensateList.length - 1; index >= 0; index--) {
                let item = this.dataForm.shipRegionCompensateList[index];
                let isNotEmpty = false;
                for (let k in item) {
                    if (item[k] != '') {
                        isNotEmpty = true;
                        break;
                    }
                }
                if (!isNotEmpty && this.dataForm.shipRegionCompensateList.length > 1) {
                    this.dataForm.shipRegionCompensateList.splice(index, 1);
                }
            }
            setTimeout(() => {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        hasError = true;
                        return false;
                    }
                });
                this.$refs['formWc'].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        hasError = true;
                        return false;
                    }
                });
                this.$refs['formSrc'].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!');
                        hasError = true;
                        return false;
                    }
                });
                if (hasError) {
                    return;
                }
                params = Object.assign({}, virtualWarehouse);
                params.realWhList = [];

                this.realWareHouseList.forEach((item) => {
                    let obj = {
                        realWhCode: item.realWhCode,
                        isVirtual: item.isVirtual,
                        isPublic: item.isPublic
                    };
                    if (item.id) {
                        obj.applyId = item.id;
                    }
                    params.realWhList.push(obj);
                });
                params.weightZone = '';
                params.weightProfitRate = '';
                params.weightPricePlus = '';
                params.weightFreeDivision = '';
                params.whCompensationShipRegion = '';
                this.dataForm.warehouseCompensateList.forEach((item) => {
                    params.weightZone += item.weightZone + '|';
                    params.weightProfitRate += item.weightProfitRate + '|';
                    params.weightPricePlus += item.weightPricePlus + '|';
                    params.weightFreeDivision += item.weightFreeDivision + '|';
                    params.whCompensationShipRegion += item.whCompensationShipRegion + '|';
                });
                params.shipRegion = '';
                params.profitRate = '';
                params.pricePlus = '';
                this.dataForm.shipRegionCompensateList.forEach((item) => {
                    params.shipRegion += item.shipRegion + '|';
                    params.profitRate += item.profitRate + '|';
                    params.pricePlus += item.pricePlus + '|';
                });
                params.planShipTime = params.planShipTimeFrom + '-' + params.planShipTimeTo;
                delete params.planShipTimeFrom;
                delete params.planShipTimeTo;
                if(!isNew){
                    params.virWhCode = this.$route.query.virWhCode;
                    delete params.oldName;
                }
                // console.log(params);
                // return;
                this.isDataLoading = true;
                this.$http.post('stock/warehouse/' + (isNew ? 'add' : 'edit'), params).then(res => {
                    if (res.body.code == 0) {
                        this.$message.success(res.body.message || '执行成功');
                        if(isNew){
                            this.handleBtnCancelClick();
                        } else {
                            this.getRealWareHouseList();
                        }
                    } else {
                        this.$message.error(res.body.message || '发生错误');
                    }
                    this.isDataLoading = false;
                });
            }, 50);
        },
        handleToggleDefault(event) {
            // 只有checked为true才会触发，

            this.$nextTick(() => {
                this.virtualWareHouseInfo.isDefault = 2;
            });
            this.$confirm('本操作会更改网站默认仓库，是否继续本操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    done();
                    if (action !== 'confirm') {
                        return;
                    }
                     this.virtualWareHouseInfo.isDefault = 1;
                }
            }).catch(() => {

            });
        },
        handleBtnAddRealClick() {
            // console.log();
            if (!this.realWarehouseSelected || !this.realWarehouseSelectedWhCode) {
                return;
            }
            // console.log(this.realWarehouseSelected, this.$refs.realWarehouseSlt.selectedLabel);
            // return;
            let has = false;
            this.realWareHouseList.some((item) => {
                // console.log(item.realWhName + '（' + item.realWhCode + '）');
                // console.log(this.realWarehouseSelected)
                // 审核驳回的可以重复添加
                if ((item.realWhName === this.realWarehouseSelected || (item.realWhName + '（' + item.realWhCode + '）') === this.realWarehouseSelected)) {
                    has = true;
                    return true;
                }
            });
            if (has) {
                this.$message.error('不能添加重复的实体仓库');
                return;
            }
            // console.log(this.realWarehouseSelectedWhCode, this.realWarehouseSelected, this.realWarehouseSelectedTemp);
            this.realWareHouseList.push({
                realWhCode: this.realWarehouseSelectedWhCode,
                realWhName: this.realWarehouseSelected,
                isVirtual: 0,
                isPublic: 2,
                approveResult: 3
            });
            this.realWarehouseSelected = '';
            this.realWarehouseSelectedTemp = '';
            this.realWarehouseSelectedWhCode = '';
        },
        //流程操作
        handleBtnOperateWarhouseClick(index, status) {
            let item = JSON.parse(JSON.stringify(this.realWareHouseList[index]));
            switch(status) {
                // 审批通过
                case 1:
                    this.handleBtnCloseWarhouseClick(item);
                break;
                // 审批不通过
                case 2:
                    this.$confirm('确定要删除此记录吗？', '删除提示', {
                        type: 'warning'
                    }).then(() => {
                        this.updateApplyStatus(item, 2).then((res) => {
                            this.$message({
                                message: res.body.message,
                                type: 'success'
                            });
                            this.realWareHouseList.splice(index, 1);
                        }, (err) => {
                            this.$message({
                                message: err.body.message,
                                type: 'error'
                            });
                        });
                    }).catch(() => {
                        this.$message.info('已取消');
                    });
                break;
                // 未审批
                case 3:
                    if(item.id) {
                        this.$confirm('确定要撤回此申请并删除记录吗？', '撤回申请', {
                            type: 'warning'
                        }).then(() => {
                            this.updateApplyStatus(item, 1).then((res) => {
                                this.$message({
                                    message: res.body.message,
                                    type: 'success'
                                });
                                this.realWareHouseList.splice(index, 1);
                            }, (err) => {
                                this.$message({
                                    message: err.body.message,
                                    type: 'error'
                                });
                            });
                        }).catch(() => {
                            this.$message.info('已取消');
                        });
                    } else {
                        this.realWareHouseList.splice(index, 1);
                    }
                break;
                // 关闭申请
                case 4:
                    this.$confirm('确定要撤回此申请并删除记录吗？', '撤回申请', {
                        type: 'warning'
                    }).then(() => {
                        this.updateApplyStatus(item, 1).then((res) => {
                            this.$message({
                                message: res.body.message,
                                type: 'success'
                            });
                            this.getRealWareHouseList();
                        }, (err) => {
                            this.$message({
                                message: err.body.message,
                                type: 'error'
                            });
                        });
                    }).catch(() => {
                        this.$message.info('已取消');
                    });
                break;
                // 待关闭
                case 5:
                    this.handleBtnProgressWarhouseClick(item);
                break;
            }
        },
        // 审批不通过-原因想·
        showReason(item) {
            const h = this.$createElement;
            this.$msgbox({
                title: '驳回原因',
                message: h('div', null, [
                    h('p', { style: 'margin-bottom: 10px' }, [
                        h('span', null, '审批人： '),
                        h('span', { style: 'color: #333' }, item.approveUser)
                    ]),
                    h('p', { style: 'margin-bottom: 10px' }, [
                        h('span', null, '驳回原因： '),
                        h('span', { style: 'color: #333' }, item.refuseRemark)
                    ]),
                    h('p', { style: 'margin-bottom: 10px' }, [
                        h('span', null, '审批时间： '),
                        h('span', { style: 'color: #333' }, this.timeZone_(item.approveTime/1000, this.$store.getters.getTimeZone))
                    ])
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            });
        },
        // 更新销售仓接站状态
        updateApplyStatus(item, operateType) {
            return this.$http.post('stock/warehouse/modify-apply-status', {
                realWhCode: item.realWhCode,
                virWhCode: item.virWhCode,
                approveResult: item.approveResult,
                operateType: operateType
            }).then(res => {
                if (res.body.code !== 0) {
                    return Promise.reject(res);
                }
                return Promise.resolve(res);
            },
            (err) => {
                return Promise.reject(err);
            });
        },
        // 关闭真实仓
        handleBtnCloseWarhouseClick(item) {
            this.shutDownWareHouse.item = item;
            this.shutDownWareHouse.whName = this.virtualWareHouseInfo.virWhCnName;
            this.shutDownWareHouse.isShow = true;
        },
        // 关闭真实仓-申请
        handleBtnApplyClick(item) {
            this.shutDownWareHouse.isLoading = true;
            this.updateApplyStatus(item, 3).then((res) => {
                this.getRealWareHouseList();
                this.handleBtnApplyCancelClick();
                this.$nextTick(() => {
                    this.$message({
                        message: res.body.message,
                        type: 'success'
                    });
                })
            }, (err) => {
                this.shutDownWareHouse.isLoading = false;
                this.$message({
                    message: err.body.message,
                    type: 'error'
                });
            });
        },
        // 关闭真实仓-申请（弹窗）
        handleBtnApplyCancelClick() {
            this.shutDownWareHouse.isShow = false;
            this.shutDownWareHouse.isLoading = false;
            this.shutDownWareHouse.isRiskLoading = false;
            this.shutDownWareHouse.isShowRisk = false;
            this.risks = null;
        },
        // 查看申请进度
        handleBtnProgressWarhouseClick(item) {
            this.applyProgress.item = item;
            this.applyProgress.isShow = true;
        },
        // 撤回申请
        handleBtnWithdrawApplyClick(item) {
            this.applyProgress.isLoading = true;
            this.updateApplyStatus(item, 4).then((res) => {
                this.getRealWareHouseList();
                this.handleBtnProgressCancelClick();
                this.$nextTick(() => {
                    this.$message({
                        message: res.body.message,
                        type: 'success'
                    });
                })
            }, (err) => {
                this.applyProgress.isLoading = false;
                this.$message({
                    message: err.body.message,
                    type: 'error'
                });
            });
        },
        // 关闭查看进度弹窗
        handleBtnProgressCancelClick() {
            this.applyProgress.isShow = false;
            this.applyProgress.isLoading = false;
            this.applyProgress.isRiskLoading = false;
            this.applyProgress.isShowRisk = false;
            this.risks = null;
        },
        handleToggleVirtualClick(index, status, id) {
            if(id) {
                this.$message.error('不可修改!');
                return;
            }
            if (typeof index === 'undefined') {
                return;
            }
            let item = this.realWareHouseList[index];
            item.isVirtual = item.isVirtual == 1 ? 0 : 1;
        },
        handleTogglePublicClick(index, status, id) {
            if(id) {
                this.$message.error('不可修改!');
                return;
            }
            if (typeof index === 'undefined') {
                return;
            }
            let item = this.realWareHouseList[index];
            item.isPublic = item.isPublic == 1 ? 2 : 1;
        },
        warehouseCompensateAdd() {
            this.dataForm.warehouseCompensateList.push({
                weightZone: '',
                weightProfitRate: '',
                weightPricePlus: '',
                weightFreeDivision: '',
                whCompensationShipRegion: ''
            });
        },
        warehouseCompensateDel(index) {
            this.dataForm.warehouseCompensateList.splice(index, 1);
        },
        shipRegionCompensateAdd() {
            this.dataForm.shipRegionCompensateList.push({
                pricePlus: '',
                profitRate: '',
                shipRegion: ''
            });
        },
        shipRegionCompensateDel(index) {
            this.dataForm.shipRegionCompensateList.splice(index, 1);
        },
        // 查看风险
        checkRisk(item, status) {
            switch(status) {
                case 1:
                    this.shutDownWareHouse.isShowRisk = true;
                    this.shutDownWareHouse.isRiskLoading = true;
                break;

                case 2:
                    this.applyProgress.isShowRisk = true;
                    this.applyProgress.isRiskLoading = true;
                break;
            }
            let params = {
                realWhCode: item.realWhCode,
                virWhCode: item.virWhCode
            }
            this.$http.get('stock/site-access/re-wh-unbundle-risk', {params: params}).then(res => {
                if(status == 1) {
                    this.shutDownWareHouse.isRiskLoading = false;
                } else {
                    this.applyProgress.isRiskLoading = false;
                }
                if (res.body.code !== 0) {
                    return;
                }
                this.risks = res.body.data;
            },
            (err) => {
                this.$notify.error({
                    title: err.body.name || '错误',
                    message: err.body.message || '发生错误'
                });
            });

        },
        // 数组的值是否有交集
        checkArrIntersection(arr) {
            let hasIntersection = false;
            for (let i = 0, len = arr.length; i < len - 1; i++) {
                if (arr[i + 1] - 0 < arr[i] - 0) {
                    hasIntersection = true;
                    break;
                }
            }
            return hasIntersection;
        }
    }
}
</script>
<style lang="less">
.stock-title{
    color: #20A0FF;
    border-bottom: 1px solid #d3dce6;
    position: relative;
    margin-bottom: 27px;
    line-height: 40px;
    &:after{
        position: absolute;
        bottom: 0;
        left: 0;
        content: '';
        width: 100px;
        height: 3px;
        background-color: #20A0FF;
    }
}
.plan-ship-time-wrap { padding-left: 5px; min-width: 800px;
    .ipt-plan-ship-time { float: left; width: 7.5%; }
    > span { float: left; width: 1%; text-align: center; }
    .unit { width: auto; padding-left: 10px; }
}
.el-form-item { margin-bottom: 22px !important;
    .el-form-item.is-error { margin-bottom: 15px; }
}
.ac-real-list-wrap { display: block; position: relative;
    .el-icon-circle-close { visibility: hidden; z-index: 5; }
    .el-input { z-index: 2; }
    input { background: none; }
    > i { position: absolute; top: 50%; right: 10px; transform: translateY(-50%); color: #bfcbd9; font-size: 12px; z-index: 1; }
    &:hover {
        > i { visibility: hidden; }
        .el-icon-circle-close { visibility: visible; }
    }
}

.tabs-wrap { position: relative;
    .btn-add { position: absolute; top: 0; right: 0; }
}
.row-th {
    .th-last.pl-0 { padding-left: 0 !important; }
}
.list-form { padding-left: 5px; }
.tree-wrap { max-height: 400px; overflow: auto; }
.el-risk-text{
    border: 1px dashed #999;
    .el-risk-text-title{
        span{
            color: #ff4949;
        }
    }
    .el-risk-text-content{
        height: 150px;
        & > div {
            padding: 0 20px;
            .num {
                color: #f7ba2a;
            }
        }
    }
}
.wareHouse-apply-dialog{
    .el-dialog__body{
        padding: 10px 20px;
    }
    .el-risk{
        color: #f7ba2a;
    }
    .el-find-risk-btn {
        margin-left: 60px;
    }
    .el-warning-tip{
        color: #999;
        margin-top: 20px;
    }
}
.wareHouse-progress-dialog{
    .el-risk-text{
        margin-top: 50px;
    }
    .el-dialog__body{
        padding: 10px 20px 40px 20px;
    }
    .el-steps{
        .el-step__title{
            font-weight: normal;
        }
        .el-step__description{
            margin-top: -95px;
            font-size: 14px;
        }
    }
    .el-step-status{
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 50px;
        button{
            margin-left: 118px;
        }
    }
}
</style>