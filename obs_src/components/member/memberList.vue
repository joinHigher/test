<template>
    <div v-loading="dataLoading">
        <div class="el-container">
            <el-form inline :model="options" ref="searchForm">
                <el-form-item label="会员等级">
                    <el-select v-model="options.levelId" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in levels" :label="item.levelName" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮件订阅">
                    <el-select v-model="options.isEmailSub" clearable placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="风险监控">
                    <el-select v-model="options.riskStatus" clearable placeholder="请选择">
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="风险用户" value="2"></el-option>
                        <el-option label="黑名单用户" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="options.sex" clearable placeholder="请选择">
                        <el-option label="女" value="0"></el-option>
                        <el-option label="男" value="1"></el-option>
                        <el-option label="保密" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注册时间：">
                    <el-select v-model="options.regDateOperate" placeholder="请选择">
                        <el-option label="晚于" value="2"></el-option>
                        <el-option label="早于" value="3"></el-option>
                        <el-option label="介于" value="4"></el-option>
                    </el-select>
                </el-form-item label="">
                    <el-date-picker v-model="options.regDate" type="datetime" :class="{none: options.regDateOperate == 4}" placeholder="选择日期" :picker-options="options.pickerOptions"></el-date-picker>
                    <el-date-picker v-model="options.regDateRange" type="datetimerange" :class="{none: options.regDateOperate != 4}"  placeholder="选择日期范围" :picker-options="options.pickerOptions"></el-date-picker>
                <el-form-item>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="options.keyWord" placeholder="请输入ID或邮箱"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getListData(1)"><i class="el-icon-search"></i> 筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                    <el-button type="text" @click="isShowAdvancedSearch = true">高级搜索</el-button>
                </el-form-item>
            </el-form>  
        </div>

        <div class="el-container">
            <div class="el-sub-container">
                <el-row>
                    <el-col :span="12">
                        <tags-select
                            ref="Tagging"
                            :isShow.sync="isTagging"
                            :tagAttr="tagAttr"
                            :commondTags="commondTagList"
                            @success="handleTaggingTag"
                        ></tags-select>
                        <el-button @click="isTagging = true" type="primary" :disabled="multipleSelection.length < 1">打标签</el-button>
                        <el-button @click="riskDialog.isShowDlg = true" type="danger" :disabled="multipleSelection.length < 1">移动到风险名单</el-button>
                        <el-button @click="blackDialog.isShowDlg = true" type="danger" :disabled="multipleSelection.length < 1">移动到黑名单</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" border @row-click="clickRow" class="member-list-table">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="userIdStr" label="user_id"></el-table-column>
                <el-table-column label="用户">
                    <template scope="scope">
                        <div>
                            {{scope.row.nickName ? scope.row.nickName + '&nbsp; &nbsp;' : ''}} 
                            <template v-if="scope.row.sex == 0">女</template>
                            <template v-if="scope.row.sex == 1">男</template>
                            <template v-if="scope.row.sex == 2">保密</template>
                        </div>
                        <div>{{scope.row.email}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="会员等级">
                    <template scope="scope">
                        {{ levels[scope.row.levelId] ? levels[scope.row.levelId].levelName : ''  }}
                    </template>
                </el-table-column>
                <el-table-column label="激活状态">
                    <template scope="scope">
                        {{ scope.row.isValidateEmail == 1 ? '已激活' : '未激活' }}
                    </template>
                </el-table-column>
                <el-table-column label="订阅状态">
                    <template scope="scope">
                        {{ scope.row.isEmailSub == 1 ? '已订阅' : '未订阅' }}
                    </template>
                </el-table-column>
                <el-table-column label="风险监控">
                    <template scope="scope">
                         {{ riskStatus[scope.row.riskStatus] }}（{{scope.row.riskScore}}）
                    </template>
                </el-table-column>
                <el-table-column label="注册来源" width="250">
                    <template scope="scope">
                        <div>{{ scope.row.pipelineCode ?  pipeOpt[scope.row.pipelineCode] + '&nbsp; &nbsp;': '' }}  {{ platformOpt[scope.row.platform] }}</div>
                        <div>{{ timeZone_(scope.row.createDate, $store.getters.getTimeZone) }}（{{getRegDays(scope.row.createDate)}}天）</div>
                    </template>
                </el-table-column>
                <el-table-column label="上次登录" width="250">
                    <template scope="scope">
                        <div>{{scope.row.lastLoginIpStr}}</div>
                        <div>{{ timeZone_(scope.row.lastLoginDate, $store.getters.getTimeZone) }}（{{getRegDays(scope.row.lastLoginDate)}}天）</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" column-key="handle">
                    <template scope="scope">
                        <el-popover ref="popover" placement="left" width="100" trigger="hover">
                            <div class="handle-btn"><router-link :to="{name: 'member_memberInfo', query: {userId: scope.row.userIdStr}}"><el-button type="text" size="small">查看详情</el-button></router-link></div>
                            <div class="handle-btn"><el-button type="text" size="small" @click="showMange(scope.row)">积分管理</el-button></div>
                            <div class="handle-btn"><router-link :to="{name: 'member_memberInfo', query: {userId: scope.row.userIdStr, tab: 'address' }}"><el-button type="text" size="small">地址管理</el-button></router-link></div>
                            <div class="handle-btn"><router-link :to="{name: 'member_memberInfo', query: {userId: scope.row.userIdStr, tab: 'order' }}"><el-button type="text" size="small">查看订单</el-button></router-link></div>
                            <div class="handle-btn"><el-button type="text" size="small" @click="doWriteOff(scope.row)">注销</el-button></div>
                        </el-popover>
                        <el-button type="primary" size="small" v-popover:popover><i class="el-icon-more"></i></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-right el-sub-container">
                <el-pagination v-show="conditionType === 'normal'" @size-change="changePageSize" @current-change="changePage" :current-page="pagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount"></el-pagination>
                <el-pagination v-show="conditionType === 'advanced'" @size-change="changeAdvancedPageSize" @current-change="changeAdvancedPage" :current-page="advancedPagination.pageNo" :page-sizes="[10, 20, 50]" :page-size="advancedPagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="advancedPagination.totalCount"></el-pagination>
            </div>
        </div>

        <!-- 高级搜索弹窗S -->
        <el-dialog title="高级搜索" v-model="isShowAdvancedSearch" size="large" class="dlg-search" top="5%">
            <el-form :model="searchForm" ref="searchAdvancedForm" label-width="150px">
                <div class="el-container">
                    <div class="el-row">
                        <div class="el-col-12">
                            <h4 class="form-title">会员属性</h4>
                            <el-form-item label="登录时间：" prop="loginDate">
                                <el-select v-model="searchForm.loginDateOperate" class="slt-cond" placeholder="请选择">
                                    <el-option label="晚于" value="2"></el-option>
                                    <el-option label="早于" value="3"></el-option>
                                    <el-option label="介于" value="4"></el-option>
                                </el-select>
                                <el-date-picker v-model="searchForm.loginDate" type="date" :class="{none: searchForm.loginDateOperate == 4}" placeholder="选择日期" :picker-options="searchForm.pickerOptions"></el-date-picker>
                                <el-date-picker v-model="searchForm.loginDate" type="daterange" :class="{none: searchForm.loginDateOperate != 4}" placeholder="选择日期范围" :picker-options="searchForm.pickerOptions"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="注册时间：" prop="regDate">
                                <el-select v-model="searchForm.regDateOperate"  class="slt-cond" placeholder="请选择">
                                    <el-option label="晚于" value="2"></el-option>
                                    <el-option label="早于" value="3"></el-option>
                                    <el-option label="介于" value="4"></el-option>
                                </el-select>
                                <el-date-picker v-model="searchForm.regDate"  type="date" :class="{none: searchForm.regDateOperate == 4}" placeholder="选择日期" :picker-options="searchForm.pickerOptions"></el-date-picker>
                                <el-date-picker v-model="searchForm.regDate"  type="daterange" :class="{none: searchForm.regDateOperate != 4}" placeholder="选择日期范围" :picker-options="searchForm.pickerOptions"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="生日：" prop="birthday">
                                <el-select v-model="searchForm.birthdayOperate" class="slt-cond" placeholder="请选择">
                                    <el-option label="晚于" value="2"></el-option>
                                    <el-option label="早于" value="3"></el-option>
                                    <el-option label="介于" value="4"></el-option>
                                </el-select>
                                <el-date-picker v-model="searchForm.birthday"  type="date" :class="{none: searchForm.birthdayOperate == 4}" placeholder="选择日期" :picker-options="searchForm.pickerOptions"></el-date-picker>
                                <el-date-picker v-model="searchForm.birthday"  type="daterange" :class="{none: searchForm.birthdayOperate != 4}" placeholder="选择日期范围" :picker-options="searchForm.pickerOptions"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="初次下单时间：" prop="firstOrderDate">
                                <el-select v-model="searchForm.firstOrderDateOperate"  class="slt-cond" placeholder="请选择">
                                    <el-option label="晚于" value="2"></el-option>
                                    <el-option label="早于" value="3"></el-option>
                                    <el-option label="介于" value="4"></el-option>
                                </el-select>
                                <el-date-picker v-model="searchForm.firstOrderDate"  type="date" :class="{none: searchForm.firstOrderDateOperate == 4}" placeholder="选择日期" :picker-options="searchForm.pickerOptions"></el-date-picker>
                                <el-date-picker v-model="searchForm.firstOrderDate"  type="daterange" :class="{none: searchForm.firstOrderDateOperate != 4}" placeholder="选择日期范围" :picker-options="searchForm.pickerOptions"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="最后下单时间：" prop="lastOrderDate">
                                <el-select v-model="searchForm.lastOrderDateOperate"  class="slt-cond" placeholder="请选择">
                                    <el-option label="晚于" value="2"></el-option>
                                    <el-option label="早于" value="3"></el-option>
                                    <el-option label="介于" value="4"></el-option>
                                </el-select>
                                <el-date-picker v-model="searchForm.lastOrderDate"  type="date" :class="{none: searchForm.lastOrderDateOperate == 4}" placeholder="选择日期" :picker-options="searchForm.pickerOptions"></el-date-picker>
                                <el-date-picker v-model="searchForm.lastOrderDate"  type="daterange" :class="{none: searchForm.lastOrderDateOperate != 4}" placeholder="选择日期范围" :picker-options="searchForm.pickerOptions"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="最后下单距今：">
                                <el-select v-model="searchForm.lastOrderFromNowOperate"  class="slt-cond" placeholder="请选择">
                                    <el-option label="小于等于" value="5"></el-option>
                                    <el-option label="大于等于" value="6"></el-option>
                                    <el-option label="介于" value="4"></el-option>
                                </el-select>
                                <span :class="{rangIpts: searchForm.lastOrderFromNowOperate == 4}">
                                    <el-input v-model="searchForm.lastOrderFromNow"  class="ipt"></el-input>
                                    <span v-if="searchForm.lastOrderFromNowOperate == 4">
                                        <span>-</span>
                                        <el-input v-model="searchForm.lastOrderFromNowEnd"  class="ipt"></el-input> 
                                    </span>                       
                                </span>
                                <span class="form-text">天</span>
                            </el-form-item>
                            <el-form-item label="积分：">
                                <el-select v-model="searchForm.pointOperate"  class="slt-cond" placeholder="请选择">
                                    <el-option label="小于等于" value="5"></el-option>
                                    <el-option label="大于等于" value="6"></el-option>
                                    <el-option label="介于" value="4"></el-option>
                                </el-select>
                                <span :class="{rangIpts: searchForm.pointOperate == 4}">
                                    <el-input v-model="searchForm.point"  class="ipt"></el-input>
                                    <span v-if="searchForm.pointOperate == 4">
                                        <span>-</span>
                                        <el-input v-model="searchForm.pointEnd" class="ipt"></el-input> 
                                    </span>                       
                                </span>
                            </el-form-item>
                            <el-form-item label="成长值：">
                                <el-select v-model="searchForm.growupOperate" class="slt-cond" placeholder="请选择">
                                    <el-option label="小于等于" value="5"></el-option>
                                    <el-option label="大于等于" value="6"></el-option>
                                    <el-option label="介于" value="4"></el-option>
                                </el-select>
                                <span :class="{rangIpts: searchForm.growupOperate == 4}">
                                    <el-input v-model="searchForm.growup" class="ipt"></el-input>
                                    <span v-if="searchForm.growupOperate == 4">
                                        <span>-</span>
                                        <el-input v-model="searchForm.growupEnd" class="ipt"></el-input> 
                                    </span>                       
                                </span>
                            </el-form-item>
                            <el-form-item label="邮件订阅：" prop="isEmailSub">
                                <el-radio-group v-model="searchForm.isEmailSub">
                                    <el-radio class="radio" :label="1">是</el-radio>
                                    <el-radio class="radio" :label="0">否</el-radio>       
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="性别：" prop="sex">
                                <el-radio-group v-model="searchForm.sex">
                                    <el-radio class="radio" :label="1">男</el-radio>
                                    <el-radio class="radio" :label="0">女</el-radio>       
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="账号状态：" prop="isValidateEmail">
                                <el-radio-group v-model="searchForm.isValidateEmail">
                                    <el-radio class="radio" :label="1">激活</el-radio>
                                    <el-radio class="radio" :label="0">未激活</el-radio>       
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="风险状态：" prop="riskStatus">
                                <el-checkbox-group v-model="searchForm.riskStatus">
                                    <el-checkbox :label="1">正常</el-checkbox>
                                    <el-checkbox :label="2">风险名单</el-checkbox>
                                    <el-checkbox :label="3">黑名单</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </div>
                        <div class="el-col-12">
                            <h4 class="form-title">注册来源</h4>
                            <el-form-item label="端口来源：" prop="platformList">
                                <el-select v-model="searchForm.platformOperate"  class="slt-cond" placeholder="请选择">
                                    <el-option label="并且" value="7"></el-option>
                                    <el-option label="或者" value="8"></el-option>
                                </el-select> &nbsp;
                                <el-checkbox-group v-model="searchForm.platformList">
                                    <el-checkbox :label="1">PC</el-checkbox>
                                    <el-checkbox :label="2">Wap</el-checkbox>
                                    <el-checkbox :label="3">IOS</el-checkbox>
                                    <el-checkbox :label="4">Android</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="渠道：" class="item-slts" prop="siteCodeList">
                                <el-select v-model="searchForm.siteCodeOperate"  class="slt-cond" placeholder="请选择">
                                    <el-option label="并且" value="7"></el-option>
                                    <el-option label="或者" value="8"></el-option>
                                </el-select>
                                <div>
                                    <el-select v-model="searchForm.siteCodeList"  class="item-inline" multiple filterable allow-create placeholder="国家选择">
                                        <el-option v-for="item in searchForm.countrySource.options" :key="item.value" :label="item.label" :value="item.value" class="item-inline"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item label="标签筛选：">
                                <el-select v-model="searchForm.labelOperate" class="slt-cond" placeholder="请选择">
                                    <el-option label="或者" value="8"></el-option>
                                </el-select> &nbsp;
                                <div class="el-container tags">
                                    <el-tag v-for="tag in searchForm.selectedTagList" :key="tag" :closable="true" @close="handleTagClose(tag)"> {{tag.name}} </el-tag>
                                </div>
                                <el-button type="default" @click="showTagList">&nbsp; 添加 &nbsp;</el-button>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="searchAdvanced(1)" :loading="searchForm.isLoading">搜索</el-button>
                <el-button type="text" @click="resetForm">清空搜索条件</el-button>
            </span>
        </el-dialog>
        <!-- 高级搜索弹窗E -->

        <!--标签列表S-->
        <tags-select
            :isShow.sync="isShowTagList"
            :tagAttr="tagAttr"
            :selectedTags="searchForm.selectedTagList"
            :commondTags="commondTagList"
            @success="handleSearchForTag"
        ></tags-select>
        <!--标签列表E-->

        <!--积分管理S-->
        <el-dialog title="积分管理" v-model="mangeDialog.isShowDlg" size="tiny">
            <el-form :model="mangeDialog.data" label-width="80px" class="mange-dialog" ref="mangeForm">
                <el-form-item label="邮箱账号" prop="labelAttrId">
                    <p>{{mangeDialog.data.email}}</p>
                    <p>剩余积分:{{mangeDialog.data.pointsBalance}}</p>
                </el-form-item>
                <el-form-item label="" prop="updateNum" :rules="[{validator: checkMange, trigger: 'blur'}]">
                    <el-input v-model="mangeDialog.data.updateNum" class="mange-quick-search" :maxlength="5">
                        <el-select v-model="mangeDialog.data.type" slot="prepend" placeholder="请选择" @change="changeType">
                            <el-option :value="1" label="赠送"></el-option>
                            <el-option :value="2" label="扣减"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="选择原因" :prop="mangeDialog.data.isCustom === 0 ? 'descId' : 'description'" :rules="[{required: true, message: '该项不能为空'}, { max: 250, message: '最多不超过250个字', trigger: 'blur'}]">
                    <el-row>
                        <el-col :span="18">
                            <el-select v-model="mangeDialog.data.descId" clearable placeholder="请选择原因" v-show="mangeDialog.data.isCustom === 0">
                                <el-option v-if="mangeDialog.data.type == 1" v-for="(item, index) in mangeDialog.data.addDescriptionMap" :key="index" :value="index"  :label="item"></el-option>
                                <el-option v-if="mangeDialog.data.type == 2" v-for="(item, index) in mangeDialog.data.subDescriptionMap" :key="index" :value="index"  :label="item"></el-option>
                            </el-select>
                            <el-input v-model="mangeDialog.data.description" placeholder="自定义原因"  v-show="mangeDialog.data.isCustom === 1"></el-input>
                            <p class="mange-dec">输入的原因会直接展示在前台用户界面，请谨慎操作</p>
                        </el-col>
                        <el-col :span="6" class="text-right">
                            <a href="javascript:void(0)" class="mange-custom-btn" @click="switchReason" v-text="mangeDialog.data.isCustom === 0 ? '自定义' : '系统原因'"></a>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="备注" prop="remark" :rules="[{required: true, message: '请输入备注说明', trigger: 'blur' },{ min: 10, max: 350, message: '至少输入10个字，最多不超过350个字', trigger: 'blur'}]">
                    <el-input v-model="mangeDialog.data.remark" placeholder="至少输入10个字的备注说明"> </el-input>
                </el-form-item>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="mangeDialog.isShowDlg = false">取 消</el-button>
                <el-button type="primary" @click="postMange" :loading="mangeDialog.isLoading">确 定</el-button>
            </span>
        </el-dialog>
        <!--积分管理E-->

        <!--移动到风险名单S-->
        <el-dialog title="移动到风险名单" v-model="riskDialog.isShowDlg" size="tiny">
            <el-form :model="riskDialog.data" label-width="100px" ref="riskForm">
                <el-form-item label="事件摘要" prop="event" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-input v-model="riskDialog.data.event" placeholder="请输入移动到风险名单原因"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="riskDialog.isShowDlg = false">取 消</el-button>
                <el-button type="primary" @click="postRisk" :loading="riskDialog.isLoading">确 定</el-button>
            </span>
        </el-dialog>
        <!--移动到风险名单E-->

        <!--移动到黑名单S-->
        <el-dialog title="移动到黑名单" v-model="blackDialog.isShowDlg" size="tiny">
            <el-form :model="blackDialog.data" label-width="100px" ref="blackFrom">
                <el-form-item label="事件摘要" prop="event" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-input v-model="blackDialog.data.event" placeholder="请输入移动到黑名单原因"></el-input>
                </el-form-item>
                <el-form-item label="操作限制" prop="limitType" :rules="[{required: true, message: '该项不能为空'}]">
                    <el-select v-model="blackDialog.data.limitType" placeholder="请选择对用户操作限制">
                        <el-option label="禁止登录" :value="1"></el-option>
                        <!-- <el-option label="禁止下单" :value="2"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="解除时间">
                    <el-date-picker :editable="false" v-model="blackDialog.data.relieveDate" type="datetime" placeholder="请选择解除时间"></el-date-picker>
                    <p>不设置解除时间，则一直处于黑名单状态</p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="blackDialog.isShowDlg = false">取 消</el-button>
                <el-button type="primary" @click="postBlack" :loading="blackDialog.isLoading">确 定</el-button>
            </span>
        </el-dialog>
        <!--移动到黑名单E-->

        <!-- 注销会员S-->
        <el-dialog title="注销会员" v-model="writeoffDialog.isShowDlg" size="tiny">
            <p>执行注销操作后，将删除用户账号及其它用户痕迹，用户无法登录系统，请确认下列信息：</p>
            <p>1.注销后，用户将无法登录网站，请确认用户不存在未签收的订单</p>
            <p>2.注销后，用户将不在接收到EDM营销邮件</p>
            <p>3.注销后，前台不在展示该用户评论内容</p>
            <p>4.注销后，用户可以重新注册，但无法恢复已注销账号所有数据，建议事先沟通好用户礼品卡、电子钱包、积分和coupon资产数据处置方案</p>
            <p>是否还要继续注销操作？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="writeoffDialog.isShowDlg = false">取 消</el-button>
                <el-button type="primary" @click="writeOff" :loading="writeoffDialog.isLoading">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 注销会员E-->
    </div>
</template>

<script>
// 标签帅选组件
import tagsSelect from '../../pageComponents/member/tagsSelect'
export default {
    components: {
        tagsSelect
    },
    data () {
        let checkMange = (rule, value, callback) => {
            let data = this.mangeDialog.data;
            if (data.updateNum && Number(data.updateNum) > 0 && Number.isInteger(data.updateNum * 1)) {
                callback();
            } else {
                callback(new Error('积分数应为正整数'));
            }
        }
        return {
            checkMange: checkMange,
            mangeDialog: {
                data: {
                    email: '',
                    pointsBalance: '',
                    type: 1,
                    userId: '',
                    updateNum: '',
                    descId: '',
                    addDescriptionMap: {},
                    subDescriptionMap: {},
                    isCustom: 0,
                    description: '',
                    remark: ''
                },
                openLoading: false,
                isShowDlg: false,
                isLoading: false
            },
            writeoffDialog: {
                isShowDlg: false,
                isLoading: false,
                deleteUserId: null
            },
            // black 
            blackDialog: {
                data: {
                    event: '',
                    relieveDate: '',
                    limitType: ''
                },
                isShowDlg: false,
                isLoading: false
            },
            // risk
            riskDialog: {
                data: {
                    event: ''
                },
                isShowDlg: false,
                isLoading: false
            },
            tableData: [],
            dataLoading: false,
            options: {
                levelId: '',
                isEmailSub: '',
                riskStatus: '',
                keyWord: '',
                sex: '',
                regDateOperate: '',
                regDate: '',
                regDateEnd: '',
                regDateRange: '', // 避免一个变量造成prop类型错误
                pickerOptions: {
                  disabledDate(time) {
                    return time.getTime() > Date.now();
                  }
                }
            },
            pagination: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
            },
            advancedPagination: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
            },
            levels: {},
            riskStatus: {
                '1': '正常',
                '2': '风险用户',
                '3': '黑名单用户'
            },
            multipleSelection: [],
            tagAttr: [],
            // 高级搜索
            isShowAdvancedSearch: false,
            searchForm: {
                isLoading: false,
                loginDate: '',
                loginDateEnd: '',
                loginDateOperate: '2',
                regDate: '',
                regDateEnd: '',
                regDateOperate: '2',
                birthday: '',
                birthdayEnd: '',
                birthdayOperate: '2',
                firstOrderDate: '',
                firstOrderDateEnd: '',
                firstOrderDateOperate: '2',
                lastOrderDate: '',
                lastOrderDateEnd: '',
                lastOrderDateOperate: '2',
                lastOrderFromNow: '',
                lastOrderFromNowEnd: '',
                lastOrderFromNowOperate: '5',
                point: '',
                pointEnd: '',
                pointOperate: '5',
                growup: '',
                growupEnd: '',
                growupOperate: '5',
                isEmailSub: '',
                sex: '',
                isValidateEmail: '',
                riskStatus: [],
                platformList: [],
                platformOperate: '8',
                countrySource: {
                    options: [{
                        label: '美国',
                        value: 'GBUS'
                    }, {
                        label: '英国',
                        value: 'GBUK'
                    },{
                        label: '法国',
                        value: 'GBFR'
                    },{
                        label: '西班牙',
                        value: 'GBES'
                    }]
                },
                siteCodeList: [],
                siteCodeOperate: '8',
                labelOperate: '8',
                selectedTagList: [],
                pickerOptions: {
                  disabledDate(time) {
                    return time.getTime() > Date.now();
                  }
                }
            },
            isShowTagList: false,
            commondTagList: [],
            conditionType: '', // 搜索条件类型
            pipeOpt: {},
            platformOpt: {
                '1': 'PC',
                '2': 'M',
                '3': 'IOS',
                '4': 'Android',
                '5': 'Pad'
            },
            isTagging: false
        };
    },
    watch: {
        'mangeDialog.isShowDlg': function (newVal) {
            if(!newVal) {
                this.$refs.mangeForm.resetFields();
            }
        }
    },
    created () {
        this.getTagAttr();
        this.getLevelsData();
        this.getListData();
        this.getTagsData();
        this.getPipe();
    },
    methods: {
        // 获取渠道
        getPipe() {
            this.$http.get('admin/public/pipelines').then(res => {
                if (res.body.code === 0) {
                    // console.log(res.body.data)
                    let pipeOpt = {};
                    res.body.data.forEach((item) => {
                        pipeOpt[item.pipeline_code] = item.pipeline_name;
                    })
                    this.pipeOpt = pipeOpt;
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        getListData (pageNo) {
            let params = {};
            if (pageNo) {
                this.pagination.pageNo = pageNo;
            }            
            params = Object.assign({}, this.pagination, this.options);
            if(params.regDateOperate == 4){
                if(params.regDateRange.length === 2 && params.regDateRange[0] && params.regDateRange[1]){
                    let time1 = this.timeZone_(params.regDateRange[0], this.$store.getters.getTimeZone);
                    let time2 = this.timeZone_(params.regDateRange[1], this.$store.getters.getTimeZone);
                    params.regDate = time1;
                    params.regDateEnd = time2;
                }else{
                    params.regDate = '';
                    params.regDateEnd = '';
                }
            } else {
                if(params.regDate){
                    let time = this.timeZone_(params.regDate, this.$store.getters.getTimeZone);
                    params.regDate = time;
                    params.regDateEnd = '';
                } else {
                    params.regDate = '';
                    params.regDateEnd = '';
                }
            }
            delete params['totalCount'];
            delete params['pickerOptions'];
            delete params['regDateRange'];
            if (this.$route.query.labelId) {
                params.labelId = this.$route.query.labelId;
            }
            this.dataLoading = true;
            this.$http.get('user/index/list', { params: params }).then(res => {
                this.dataLoading = false;
                this.conditionType = 'normal';
                this.tableData = [];
                if (res.body.code !== 0) {
                    this.pagination.totalCount = 0;
                    return;
                }
                res.body.data.list.forEach((item) => {
                    this.tableData.push(item);
                });
                this.pagination.totalCount = res.body.data.totalCount;
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getLevelsData() {
            this.$http.get('user/user-system/level-list').then((res) => {
                if (res.body.code !== 0) {
                    this.$notify.error(res.body.message || '发生错误');
                    return;
                }
                // delete this.levels['1'];
                res.body.data.forEach((item) => {
                    this.$set(this.levels, item.id, item);
                    // this.levels[item.id] = Object.assign({}, item);
                });
                // console.log(this.levels);
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getTagsData() {
            this.$http.get('user/tag/public-select-list').then((res) => {
                let data = res.body.data.data;
                if (res.body.code !== 0) {
                    return;
                }
                Array.isArray(data) && data.forEach((item) => {
                    if(item.commond === 1){
                        this.commondTagList.push(item);
                    }
                });
            });
        },
        getTagAttr() {
            this.$http.get('user/tag/public-attr-list').then((res) => {
                if (res.body.code !== 0) {
                    return;
                }
                res.body.data.forEach((item) => {
                    this.tagAttr.push(item);
                });
            });
        },
        getRegDays(date) {
            let timeZone = this.$store.getters.getTimeZone;
            const RegedTime = this.timeZone_(new Date(date*1000), timeZone);
            const nowTime = this.timeZone_(new Date(), timeZone);
            // console.log(newTime)
            // console.log(date*1000)
            return Math.floor(((nowTime-RegedTime) / (24*60*60)));
        },
        handleBtnCancelFilterClick() {
            for (let item in this.options) {
                this.options[item] = '';
            }
            this.pagination.pageNo = 1;
            // this.getListData();
        },
        handleSelectionChange(items) {
            this.multipleSelection = items;
        },
        changePage(value) {
            this.pagination.pageNo = value;
            this.getListData();
        },
        changePageSize(value) {
            this.pagination.pageSize = value;
            this.pagination.pageNo = 1;
            this.getListData();
        },
        changeAdvancedPage(value) {
            this.advancedPagination.pageNo = value;
            this.searchAdvanced();
        },
        changeAdvancedPageSize(value) {
            this.advancedPagination.pageSize = value;
            this.advancedPagination.pageNo = 1;
            this.searchAdvanced();
        },
        resetForm () {
            this.searchForm.point = '';
            this.searchForm.pointEnd = '';
            this.searchForm.growup = '';
            this.searchForm.growupEnd = '';
            this.searchForm.lastOrderFromNow = '';
            this.searchForm.lastOrderFromNowEnd = '';
            this.$refs['searchAdvancedForm'].resetFields();
        },
        handleTagClose(tag) {
            this.searchForm.selectedTagList.splice(this.searchForm.selectedTagList.indexOf(tag), 1);
        },
        postRisk () {
            this.$refs.riskForm.validate(valid => {
                if (valid) {
                    let params = {};
                    params.status = 1;
                    params.userIdList = [];
                    this.multipleSelection.map(item => {
                        params.userIdList.push(item.userId);
                    });
                    params.event = this.riskDialog.data.event;
                    this.$http.post('user/black-risk/batch-move-user', params).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.riskDialog.isShowDlg = false;
                            this.getListData();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }
            })
        },
        postBlack () {
            this.$refs.blackFrom.validate(valid => {
                if (valid) {
                    let params = {};
                    params.status = 2;
                    params.userIdList = [];
                    this.multipleSelection.map(item => {
                        params.userIdList.push(item.userId);
                    });
                    params.event = this.blackDialog.data.event;
                    params.limitType = this.blackDialog.data.limitType;

                    if (Boolean(this.blackDialog.data.relieveDate)) {
                        params.relieveDate = this.timeZone_(this.blackDialog.data.relieveDate, this.$store.getters.getTimeZone)
                    }

                    this.$http.post('user/black-risk/batch-move-user', params).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.blackDialog.isShowDlg = false;
                            this.getListData();
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }
            })
        },
        showMange (row) {
            this.mangeDialog.openLoading = true;
            this.$http.get('user/index/point-info', {params: {userId: row.userId}}).then(res => {
                this.mangeDialog.openLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let formData = this.mangeDialog.data;
                    formData.email = data.email;
                    formData.pointsBalance = data.pointsBalance;
                    formData.addDescriptionMap = data.addDescriptionMap;
                    formData.subDescriptionMap = data.subDescriptionMap;
                    formData.userId = data.userId;

                    this.mangeDialog.data.updateNum = '';
                    this.mangeDialog.data.type = 1;
                    this.mangeDialog.data.descId = '';
                    this.mangeDialog.data.isCustom = 0;
                    this.mangeDialog.data.description = '';
                    this.mangeDialog.data.remark = '';
                    this.mangeDialog.isShowDlg = true;
                }
            })
        },
        switchReason() {
            this.mangeDialog.data.isCustom = this.mangeDialog.data.isCustom === 0 ? 1 : 0;
        },
        doWriteOff(row) {
            this.writeoffDialog.deleteUserId = row.userId;
            this.writeoffDialog.isShowDlg = true;
        },
        writeOff() {
            this.writeoffDialog.isLoading = true;
            this.$http.get('user/index/delete', {params: {userId: this.writeoffDialog.deleteUserId}}).then(res => {
                this.writeoffDialog.isLoading = false;
                if (res.body.code === 0) {
                    this.$message.success(res.body.message);
                    this.getListData();
                } else {
                    this.$message.error(res.body.message);
                }
                this.writeoffDialog.isShowDlg = false;
            })
        },
        postMange () {
            this.$refs.mangeForm.validate(valid => {
                if (valid) {
                    let params = {};
                    let formData = this.mangeDialog.data;
                    params.userId = formData.userId;
                    params.updateNum = formData.updateNum;
                    params.type = formData.type;
                    params.descId = formData.descId;
                    params.description = formData.description;
                    params.isCustom = formData.isCustom;
                    params.remark = formData.remark;
                    this.$http.post('user/index/point-edit', params).then(res => {
                        if (res.body.code === 0) {
                            this.$message.success(res.body.message);
                            this.mangeDialog.isShowDlg = false;
                        } else {
                            this.$message.error(res.body.message);
                        }
                    });
                }
            })
        },
        changeType () {
            this.mangeDialog.data.descId = '';
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.multipleTable.toggleRowSelection(row);
            }
        },
        // 显示标签列表帅选标签弹窗
        showTagList() {
            if(this.tagAttr.length === 0){
                this.getTagAttr();
            }
            this.$nextTick(() => {
                this.isShowTagList = true;
            })
        },
        handleSearchForTag(selectedTagList) {
            this.searchForm.selectedTagList = selectedTagList;
            this.$nextTick(() => {
                this.isShowTagList = false;
            })
        },
        searchAdvanced(pageNo) {
            let params = {};
            if (pageNo) {
                this.advancedPagination.pageNo = pageNo;
            }                     
            params = Object.assign({}, this.advancedPagination, this.searchForm);
            if(params.loginDate.length === 2 && params.loginDate[0] && params.loginDate[1]){
                let time1 = this.timeZone_(params.loginDate[0], this.$store.getters.getTimeZone);
                let time2 = this.timeZone_(params.loginDate[1], this.$store.getters.getTimeZone);
                params.loginDate = time1;
                params.loginDateEnd = time2;
            }else{
                let time1 = this.timeZone_(params.loginDate, this.$store.getters.getTimeZone);
                params.loginDate = time1;
                params.loginDateEnd = '';
            }
            if(params.regDate.length === 2 && params.regDate[0] && params.regDate[1]){
                let time1 = this.timeZone_(params.regDate[0], this.$store.getters.getTimeZone);
                let time2 = this.timeZone_(params.regDate[1], this.$store.getters.getTimeZone);
                params.regDate = time1;
                params.regDateEnd = time2;
            }else{
                let time1 = this.timeZone_(params.regDate, this.$store.getters.getTimeZone);
                params.regDate = time1;
                params.regDateEnd = '';
            }

            if(params.birthday.length === 2 && params.birthday[0] && params.birthday[1]){
                let time1 = this.timeZone_(params.birthday[0], this.$store.getters.getTimeZone);
                let time2 = this.timeZone_(params.birthday[1], this.$store.getters.getTimeZone);
                params.birthday = time1;
                params.birthdayEnd = time2;
            }else{
                let time1 = this.timeZone_(params.birthday, this.$store.getters.getTimeZone);
                params.birthday = time1;
                params.birthdayEnd = '';
            }
            if(params.firstOrderDate.length === 2 && params.firstOrderDate[0] && params.firstOrderDate[1]){
                let time1 = this.timeZone_(params.firstOrderDate[0], this.$store.getters.getTimeZone);
                let time2 = this.timeZone_(params.firstOrderDate[1], this.$store.getters.getTimeZone);
                params.firstOrderDate = time1;
                params.firstOrderDateEnd = time2;
            }else{
                let time1 = this.timeZone_(params.firstOrderDate, this.$store.getters.getTimeZone);
                params.firstOrderDate = time1;
                params.firstOrderDateEnd = '';
            }
            if(params.lastOrderDate.length === 2 && params.lastOrderDate[0] && params.lastOrderDate[1]){
                let time1 = this.timeZone_(params.lastOrderDate[0], this.$store.getters.getTimeZone);
                let time2 = this.timeZone_(params.lastOrderDate[1], this.$store.getters.getTimeZone);
                params.lastOrderDate = time1;
                params.lastOrderDateEnd = time2;
            }else{
                let time1 = this.timeZone_(params.lastOrderDate, this.$store.getters.getTimeZone);
                params.lastOrderDate = time1;
                params.lastOrderDateEnd = '';
            }
            if(params.lastOrderFromNowOperate != 4){
                params.lastOrderFromNowEnd = '';
            }
            if(params.pointOperate != 4){
                params.pointEnd = '';
            }
            if(params.growupOperate != 4){
                params.growupEnd = '';
            }
            params.labelIdList = [];
            params.selectedTagList.forEach((item) => {
                params.labelIdList.push(item.id);
            });
            delete params['totalCount'];
            delete params['pickerOptions'];
            delete params['countrySource'];
            delete params['selectedTagList'];
            delete params['isLoading'];
            // console.log(params);
            this.searchForm.isLoading = true;
            this.$http.post('user/index/advanced-search',  params).then(res => {
                if (res.body.code === 0) {
                    this.conditionType = 'advanced';
                    this.searchForm.isLoading = false;
                    this.tableData = [];
                    if (res.body.code !== 0) {
                        this.advancedPagination.totalCount = 0;
                        return;
                    }
                    res.body.data.list.forEach((item) => {
                        this.tableData.push(item);
                    });
                    this.advancedPagination.totalCount = res.body.data.totalCount;
                    this.isShowAdvancedSearch = false;
                } else {
                    this.$message.error(res.body.message || '发生错误');
                }
            }).catch(err => {
                this.$message.error(err.body.message || '发生错误');
            });
        },
        // 打标签操作
        handleTaggingTag(selectedTagList) {
            let tags = []; 
            selectedTagList.forEach((item) => {
                tags.push({
                    id: item.id,
                    labelTypeId: item.labelTypeId,
                    labelTypeType: item.labelTypeType
                })
            })
            // console.log(tags)
            this.handleMarkTagChange(tags);
        },
        // 打标签
        handleMarkTagChange(tagIds) {
            let userIdArr = [];
            let params = { memLabelReqs: tagIds };
            if (!tagIds.length || !this.multipleSelection.length) {
                return this.$message.warning('没有选中任何标签');
            }
            this.multipleSelection.forEach((item) => {
                userIdArr.push(item.userId);
            });
            params.userIds = userIdArr;
            params.bindSource = 1;
            this.$http.post('user/index/bind-user-label', params).then(res => {
                if (res.body.code === 0) {
                    this.isTagging = false;
                    this.$refs.Tagging.clearSelectedTags();
                    this.$message.success(res.body.message);
                } else {
                    this.$message.error(res.body.message);
                }
            },
            (err) => {
                this.$message.error(res.body.message || '发生错误');
            });
        },

    }
}
</script>

<style lang="less">
.el-select[inline] { width: auto; }
.el-select-dropdown .item-inline.el-select-dropdown__item { float: left; margin-right: 5px; padding-right: 20px; }
.el-select-dropdown.is-multiple .item-inline.el-select-dropdown__item:after { right: 2px; }

.mange-quick-search {
    width: 100%;

    .el-input-group__prepend {
        width: 30%;
    }
}

.dlg-search {
    .slt-cond { width: 100px; }
    .ipt,
    .el-date-editor.el-input { width: 250px; }
    .rangIpts .ipt { width: 118px; }
    .el-checkbox-group { display: inline-block; }
    .el-form-item { margin-bottom: 15px; }
    .item-slts {
        .slt-cond { float: left;
            & + div { margin-left: 110px; }
        }
    }
}
.tags { padding-left: 0;
    .el-tag { margin-right: 10px; }
}
.mark-tags-wrap {
    dl { padding: 10px 0;
        dt { margin-bottom: 6px; }
    }
    .el-radio { margin: 5px 15px 5px 0; }
}

.ac-tag-list-wrap { display: inline-block; position: relative;
    .el-icon-circle-close { visibility: hidden; z-index: 5; }
    .el-input { z-index: 2; }
    input { background: none; }
    > i { position: absolute; top: 50%; right: 10px; transform: translateY(-50%); color: #bfcbd9; font-size: 12px; z-index: 1; }
    &:hover {
        > i { visibility: hidden; }
        .el-icon-circle-close { visibility: visible; }
    }
    &:hover .el-input.is-disabled {
        .el-icon-circle-close { visibility: hidden; }
    }
}
.mange-dialog{
    .mange-custom-btn{
        padding: 2px 10px;
        color: #20a0ff;
        border: 1px solid #20a0ff;
        border-radius: 30px;
    }
    .mange-dec{
        color: #bfcbd9;
    }
}
.tag-contianer{
    h4{
        margin: 20px 0;
    }
    .el-tag{
        cursor: pointer;
        margin-right: 10px;
    }
    .tag-child-container{
        max-height: 200px;
        overflow-y: auto;
    }
}
.member-list-table{
    .handle-btn{
        margin-bottom: 10px;
        button{ 
            width: 100%;
        }
    }
}
</style>

