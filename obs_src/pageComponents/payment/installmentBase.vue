<!--分期利率基础模块-->
<!--巴西 墨西哥 必须配置分期利率不同路由区分权限-->

<template>
    <div class="el-container installment-base">
        <el-card class="installment-base-card" >
            <div slot="header" class="card-header">
                <h2>分期利率设置</h2>
            </div>
            <div class="content-box">
                <el-tabs v-model="activeTab" >
                    <el-tab-pane class="defaul5t-tab"
                                 label="默认分期"
                                 v-loading="defaultData.loading"
                                 name="defaultIn">
                        <div class="tab-content">
                            <el-form @submit="onSaveDefault" :model="defaultData" ref="defaultForm" class="default-form">
                                <el-table class="de-table"
                                          :data="defaultData.installmentRates"
                                          row-class-name="tab-row"
                                          border>
                                    <el-table-column
                                        prop="installments"
                                        label="分期数"
                                        width="180">
                                        <template scope="scope">
                                            <el-form-item :prop="'installmentRates.' + scope.$index + '.installments'"
                                                          :rules="[{validator: numValidator, trigger: 'blur'}]">
                                                <dot-input placeholder="分期数"
                                                           v-model="scope.row.installments"
                                                           :maxlength="2"
                                                           :dot-num="0"
                                                ></dot-input>
                                                <!--<el-input type="number"  placeholder="分期数" v-model="scope.row.installments"></el-input>-->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        prop="baseRate"
                                        label="基准利率"
                                        width="180">
                                        <template scope="scope">
                                            <el-form-item :prop="'installmentRates.' + scope.$index + '.baseRate'"
                                                          :rules="[{validator: numValidator, trigger: 'blur'}]">

                                                <dot-input type="number" placeholder="基准利率" v-model="scope.row.baseRate">
                                                    <template slot="append">%</template>
                                                </dot-input>

                                                <!--<el-input type="number" placeholder="基准利率" v-model="scope.row.baseRate">-->
                                                    <!--<template slot="append">%</template>-->
                                                <!--</el-input>-->
                                            </el-form-item>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        prop="effectRate"
                                        label="生效利率"
                                        width="180">
                                        <template scope="scope">
                                            <el-form-item :prop="'installmentRates.' + scope.$index + '.effectRate'"
                                                          :rules="[{validator: numValidator, trigger: 'blur'}]">

                                                <dot-input :max="100" type="number" placeholder="生效利率" v-model="scope.row.effectRate">
                                                    <template slot="append">%</template>
                                                </dot-input>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                        label="操作"
                                        width="180">
                                        <template scope="scope">
                                            <el-form-item>
                                                <el-button @click="onRemove(defaultData.installmentRates, scope.row)" type="danger" icon="delete">删除</el-button>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <el-form-item v-if="showAction_(apiConf.defaultUpdate)" class="mt22">
                                    <el-button type="primary" native-type="submit" icon="upload" @click="onSaveDefault">保存</el-button>
                                    <el-button type="primary" icon="plus" @click="defaultData.installmentRates.push(_getEmptyInstallmentRate())">新增分期</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="站点分期"
                                 name="siteIn"
                                 v-loading="siteData.loading"
                    >
                        <div class="tab-content">
                            <el-form inline
                                     @submit.prevent="onSearchSite"
                                     :model="siteData.searchForm"
                                     ref="siteSearchForm"
                                     class="site-search-form">
                                <el-form-item label="生效终端：">
                                    <el-select v-model="siteData.searchForm.platform" filterable placeholder="请选择">
                                        <el-option
                                            v-for="(val, key) in platforms"
                                            :key="val"
                                            :label="key"
                                            :value="val">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="生效渠道：">
                                    <el-select v-model="siteData.searchForm.pipelineCode" filterable placeholder="请选择">
                                        <el-option
                                            v-for="item in pipelines"
                                            :key="item.id"
                                            :label="item.pipeline_name"
                                            :value="item.pipeline_code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item>
                                    <el-button @click.prevent="onSearchSite" type="primary" native-type="submit" icon="search">查询</el-button>
                                </el-form-item>
                                <el-form-item v-if="showAction_(apiConf.siteAdd)">
                                    <el-button @click.prevent="onAddOrEditSite($event)" type="primary" icon="plus">新增</el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click.prevent="onResetSite" type="warning" icon="delete2">清空</el-button>
                                </el-form-item>
                            </el-form>

                            <el-table :data="siteData.list"
                                      class="installment-table-list"
                                      border>
                                <el-table-column
                                    label="序号"
                                    width="100">
                                    <template scope="scope">
                                        {{scope.$index + 1}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="platform"
                                    label="生效终端"
                                    width="100">
                                    <template scope="scope">
                                        {{manifest.platforms[scope.row.platform] || '所有终端'}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="pipelineCode"
                                    label="生效渠道"
                                    width="100">
                                    <template scope="scope">
                                        {{manifest.pipelines[scope.row.pipelineCode] || '所有渠道'}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="installmentRateCount"
                                    label="期数"
                                    width="80">
                                </el-table-column>

                                <el-table-column
                                    prop="createUser"
                                    label="添加人"
                                    width="100">
                                </el-table-column>

                                <el-table-column
                                    prop="time"
                                    label="生效时间">
                                    <template scope="scope">
                                        {{scope.row | useTime}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="lastTime"
                                    label="最后更新时间">
                                    <template scope="scope">
                                        {{ timeZone_(scope.row.updateTime, $store.getters.getTimeZone) }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template scope="scope">
                                        <el-button v-if="showAction_(apiConf.siteUpdate)" class="ml10" @click="onAddOrEditSite($event, scope.row)" size="small" icon="edit">编辑</el-button>
                                        <el-button v-if="showAction_(apiConf.siteInfo)" class="ml10" @click="onPrevSiteItem($event, scope.row)" size="small" type="primary" icon="view">查看</el-button>
                                        <el-button v-if="showAction_(apiConf.siteDelete)" class="ml10" @click="onRemoveSiteItem($event, scope.row)" size="small" type="danger" icon="delete">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <el-pagination
                            class="pager"
                            @size-change="onSizeChange($event, 'site')"
                            @current-change="onCurrentChange($event, 'site')"
                            :current-page="siteData.pager.pageNo"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="siteData.pager.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="siteData.pager.totalCount">
                        </el-pagination>
                    </el-tab-pane>

                    <el-tab-pane label="活动分期"
                                 name="activityIn"
                                 v-loading="activityData.loading"
                    >
                        <div class="tab-content">
                            <el-form inline
                                     @submit.prevent="onSearchActivity"
                                     :model="activityData.searchForm"
                                     ref="activitySearchForm"
                                     class="activity-search-form">
                                <el-form-item label="活动分期名称：">
                                    <el-input v-model.trim="activityData.searchForm.activityName" placeholder="输入"></el-input>
                                </el-form-item>
                                <el-form-item label="生效终端：">
                                    <el-select v-model="activityData.searchForm.platform" filterable placeholder="请选择">
                                        <el-option
                                            v-for="(val, key) in platforms"
                                            :key="val"
                                            :label="key"
                                            :value="val">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="生效渠道：">
                                    <el-select v-model="activityData.searchForm.pipelineCode" filterable placeholder="请选择">
                                        <el-option
                                            v-for="item in pipelines"
                                            :key="item.id"
                                            :label="item.pipeline_name"
                                            :value="item.pipeline_code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="活动类型：">
                                    <el-select v-model="activityData.searchForm.activityType" filterable placeholder="请选择">
                                        <el-option
                                            v-for="item in types"
                                            :key="item.typeCode"
                                            :label="item.typeName"
                                            :value="item.typeCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item>
                                    <el-button @click.prevent="onSearchActivity" type="primary" native-type="submit" icon="search">查询</el-button>
                                </el-form-item>
                                <el-form-item v-if="showAction_(apiConf.activityAdd)">
                                    <el-button @click.prevent="onAddOrEditActivity" type="primary" icon="plus">新增</el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click.prevent="onResetActivity" type="warning" icon="delete2">清空</el-button>
                                </el-form-item>
                            </el-form>
                            <el-table :data="activityData.list"
                                      class="installment-table-list"
                                      border>

                                <el-table-column
                                    label="序号"
                                    width="100">
                                    <template scope="scope">
                                        {{scope.$index + 1}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="activityName"
                                    label="名称"
                                    width="200">
                                </el-table-column>

                                <el-table-column
                                    prop="platform"
                                    label="生效终端"
                                    width="100">
                                    <template scope="scope">
                                        {{manifest.platforms[scope.row.platform] || '所有终端'}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="pipelineCode"
                                    label="生效渠道"
                                    width="100">
                                    <template scope="scope">
                                        {{manifest.pipelines[scope.row.pipelineCode] || '所有渠道'}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="activityType"
                                    label="活动类型"
                                    width="100">
                                    <template scope="scope">
                                        {{manifest.types[scope.row.activityType]}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="installmentRateCount"
                                    label="期数"
                                    width="80">
                                </el-table-column>

                                <el-table-column
                                    prop="createUser"
                                    label="添加人"
                                    width="100">
                                </el-table-column>

                                <el-table-column
                                    prop="time"
                                    label="生效时间">
                                    <template scope="scope">
                                        {{scope.row | useTime}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="lastTime"
                                    label="最后更新时间">
                                    <template scope="scope">
                                        {{ timeZone_(scope.row.updateTime, $store.getters.getTimeZone) }}
                                    </template>
                                </el-table-column>

                                <el-table-column label="操作">
                                    <template scope="scope">
                                        <el-button v-if="showAction_(apiConf.activityUpdate)" class="ml10" @click="onAddOrEditActivity($event, scope.row)" size="small" icon="edit">编辑</el-button>
                                        <el-button v-if="showAction_(apiConf.activityInfo)" class="ml10" @click="onPrevActivityItem($event, scope.row)" size="small" type="primary" icon="view">查看</el-button>
                                        <el-button v-if="showAction_(apiConf.activityDelete)" class="ml10" @click="onRemoveActivityItem($event, scope.row)" size="small" type="danger" icon="delete">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-pagination
                            class="pager"
                            @size-change="onSizeChange($event, 'activity')"
                            @current-change="onCurrentChange($event, 'activity')"
                            :current-page="activityData.pager.pageNo"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="activityData.pager.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="activityData.pager.totalCount">
                        </el-pagination>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>

        <!--站点配置弹窗-->
        <el-dialog title="站点利率个性化配置"
                   :visible.sync="dialogSiteFormVisible"
                   size="small"
        >
            <div v-loading= "siteData.editForm.loading" class="dlg-box">
                <div class="mask-layer" v-if="siteData.previewSiteItem"></div>
                <el-form :model="siteData.editForm"
                         ref="siteEditForm"
                         label-width="130px"
                         class="dlg-content site-edit-form">
                    <el-form-item label="生效终端：">
                        <el-select class="w350"
                                   v-model="siteData.editForm.platform"
                                   :disabled="!siteData.canEdit"
                                   filterable
                                   placeholder="请选择">
                            <el-option
                                v-for="(val, key) in platforms"
                                v-if="val !== ''"
                                :key="val"
                                :label="key"
                                :value="val">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="生效渠道："
                                  prop="pipelineCode"
                                  :rules="[{ required: true, message: '请选择生效渠道', trigger: 'blur' }]"
                    >
                        <el-select class="w350"
                                   :disabled="!siteData.canEdit"
                                   v-model="siteData.editForm.pipelineCode"
                                   filterable placeholder="请选择">
                            <el-option
                                v-for="item in pipelines"
                                v-if="item.pipeline_code !== ''"
                                :key="item.id"
                                :label="item.pipeline_name"
                                :value="item.pipeline_code">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="生效时间："
                                  prop="time"
                                  :rules="[{validator: siteValidTime, trigger: 'blur'}]"
                    >
                        <el-date-picker class="w350" :disabled="siteData.editForm.isLongEffect" v-model="siteData.editForm.time" type="datetimerange" placeholder="选择时间范围" ></el-date-picker>
                        <el-checkbox class="ml5" v-model="siteData.editForm.isLongEffect">长期有效</el-checkbox>
                    </el-form-item>

                    <el-form-item v-show="!siteData.previewSiteItem" class="text-right">
                        <el-button type="primary" icon="plus" @click="siteData.editForm.installmentRates.push(_getEmptyInstallmentRate())">新增</el-button>
                    </el-form-item>

                    <el-table class="site-conf-table de-table"
                              :data="siteData.editForm.installmentRates"
                              row-class-name="tab-row"
                              border>
                        <el-table-column
                            prop="installments"
                            label="分期数">
                            <template scope="scope">
                                <el-form-item :prop="'installmentRates.' + scope.$index + '.installments'"
                                              label-width="0px"
                                              :rules="[{validator: numValidator, trigger: 'blur'}]">
                                    <dot-input :dot-num="0"
                                               :maxlength="2"
                                               placeholder="分期数"
                                               v-model="scope.row.installments"></dot-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="baseRate"
                            label="基准利率">
                            <template scope="scope">
                                <el-form-item :prop="'installmentRates.' + scope.$index + '.baseRate'"
                                              label-width="0px"
                                              :rules="[{validator: numValidator, trigger: 'blur'}]">
                                    <dot-input type="number" placeholder="基准利率" v-model="scope.row.baseRate">
                                        <template slot="append">%</template>
                                    </dot-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="effectRate"
                            label="生效利率">
                            <template scope="scope">
                                <el-form-item :prop="'installmentRates.' + scope.$index + '.effectRate'"
                                              label-width="0px"
                                              :rules="[{validator: numValidator, trigger: 'blur'}]">
                                    <dot-input type="number" placeholder="生效利率" v-model="scope.row.effectRate">
                                        <template slot="append">%</template>
                                    </dot-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="操作">
                            <template scope="scope">
                                <el-form-item>
                                    <el-button @click="onRemove(siteData.editForm.installmentRates, scope.row)"
                                               size="small"
                                               :disabled="siteData.previewSiteItem"
                                               type="danger"
                                               icon="delete">删除</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-form-item class="mt22 text-right" v-if="!siteData.previewSiteItem">
                        <el-button icon="close" @click="dialogSiteFormVisible = false">取 消</el-button>
                        <el-button icon="upload" native-type="submit" type="primary" @click.prevent="onSaveSiteItem()">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <!--活动配置弹窗-->
        <el-dialog title="活动利率个性化配置"
                   :visible.sync="dialogActivityFormVisible">
            <div v-loading= "activityData.editForm.loading" class="dlg-box">
                <div class="mask-layer" v-if="activityData.previewItem"></div>
                <el-form :model="activityData.editForm"
                         ref="activityEditForm"
                         label-width="130px"
                         class="dlg-content activity-edit-form">

                    <el-form-item label="活动名称："
                                  prop="activityName"
                                  :rules="[{required: true,message: '该项不能为空',trigger: 'blur'}]"
                    >
                        <el-input class="w350" placeholder="请输入活动名" v-model.trim="activityData.editForm.activityName"></el-input>
                    </el-form-item>

                    <el-form-item label="生效终端："
                                  prop="platform"
                    >
                        <el-select v-model="activityData.editForm.platform"
                                   class="w350"
                                   filterable
                                   placeholder="请选择">
                            <el-option
                                v-for="(val, key) in platforms"
                                :key="val"
                                :label="key"
                                :value="val">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="生效渠道："
                                  prop="pipelineCode"
                    >
                        <el-select v-model="activityData.editForm.pipelineCode"
                                   class="w350"
                                   filterable
                                   placeholder="请选择">
                            <el-option
                                v-for="item in pipelines"
                                :key="item.id"
                                :label="item.pipeline_name"
                                :value="item.pipeline_code">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="生效时间："
                                  prop="time"
                                  :rules="[{validator: activityValidTime, trigger: 'blur'}]"
                    >
                        <el-date-picker class="w350" v-model="activityData.editForm.time"  :disabled="activityData.editForm.isLongEffect" type="datetimerange" placeholder="选择时间范围" ></el-date-picker>
                        <el-checkbox class="ml5" v-model="activityData.editForm.isLongEffect">长期有效</el-checkbox>
                    </el-form-item>
                    <el-form-item label="活动类型：">
                        <el-select class="w350"
                                   :disabled="!activityData.canEdit"
                                   v-model="activityData.editForm.activityType"
                                   filterable
                                   placeholder="请选择">
                            <el-option
                                v-for="item in types"
                                v-if="item.typeCode !== ''"
                                :key="item.typeCode"
                                :label="item.typeName"
                                :value="item.typeCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="activityGoods"
                                  :rules="[{validator: goodsIdValidator, trigger: 'blur'}]" >
                        <el-input type="textarea"
                                  :placeholder="`请输入${activityData.editForm.activityType === 1 ? 'sku' : '类目ID'}，使用英文 ',' 隔开 `"
                                  v-model="activityData.editForm.activityGoods"
                        ></el-input>
                    </el-form-item>

                    <el-form-item v-show="!activityData.previewItem" class="text-right">
                        <el-button type="primary" icon="plus" @click="activityData.editForm.installmentRates.push(_getEmptyInstallmentRate())">新增</el-button>
                    </el-form-item>

                    <el-table class="activity-conf-table de-table"
                              :data="activityData.editForm.installmentRates"
                              row-class-name="tab-row"
                              border>
                        <el-table-column
                            prop="installments"
                            label="分期数">
                            <template scope="scope">
                                <el-form-item :prop="'installmentRates.' + scope.$index + '.installments'"
                                              label-width="0px"
                                              :rules="[{validator: numValidator, trigger: 'blur'}]">
                                    <dot-input :dot-num="0"
                                               placeholder="分期数"
                                               :maxlength="2"
                                               v-model="scope.row.installments"></dot-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="baseRate"
                            label="基准利率">
                            <template scope="scope">
                                <el-form-item :prop="'installmentRates.' + scope.$index + '.baseRate'"
                                              label-width="0px"
                                              :rules="[{validator: numValidator, trigger: 'blur'}]">
                                    <dot-input type="number" placeholder="基准利率" v-model="scope.row.baseRate">
                                        <template slot="append">%</template>
                                    </dot-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="effectRate"
                            label="生效利率">
                            <template scope="scope">
                                <el-form-item :prop="'installmentRates.' + scope.$index + '.effectRate'"
                                              label-width="0px"
                                              :rules="[{validator: numValidator, trigger: 'blur'}]">
                                    <dot-input type="number" placeholder="生效利率" v-model="scope.row.effectRate">
                                        <template slot="append">%</template>
                                    </dot-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="操作">
                            <template scope="scope">
                                <el-form-item>
                                    <el-button :disabled="activityData.previewItem" @click="onRemove(activityData.editForm.installmentRates, scope.row)" size="small" type="danger" icon="delete">删除</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div v-if="!activityData.previewItem" class="mt22 text-right">
                        <el-button icon="close" @click="dialogActivityFormVisible = false">取 消</el-button>
                        <el-button icon="upload" native-type="submit" type="primary" @click.prevent="onSaveActivityItem()">保存</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import httpGet, {httpPost, getPipelines, getPlatforms} from '../../common/baseApi'
    import utils from '../../common/utils'
    import Vue from 'vue'
    import store from '../../service/store'

    import dotInput from '../../pageComponents/dotInput.vue'

    export default {
        name: 'installmentBrazil',
        components: {
            dotInput
        },
        props: {
            apiConf: {
                type: Object,
                require: true
            }
        },
        filters: {
            useTime(item) {
                const timeZone = store.getters.getTimeZone
                const vueInstance = new Vue()
                return item.isLongEffect
                    ? '永久生效'
                    : `${vueInstance.timeZone_(item.validStartTime, timeZone)} - ${vueInstance.timeZone_(item.validEndTime, timeZone)}`
            }
        },
        watch: {
            'activityData.searchForm.activityName'(newVal, oldVal) {
                if (newVal === '') {
                    // 清空的时候 请求数据
                    this.onSearchActivity()
                }
            }
        },
        data() {
            function validTime(time, origData) {
                if (!origData.isLongEffect && (!time[0] || !time[0])) {
                    return false
                }
                return true
            }

            return {
                goodsIdValidator(rule, value, callback) {
                    value = String(value).trim()
                    if (!value) {
                        callback(new Error('商品SKU或类目数据不能为空'))
                    } else{
                        let arrIds = value.split(',')
                        const valid = arrIds.every(item => {
                            return /^[0-9a-zA-Z\-]+$/.test(String(item))
                        })
                        if(valid){
                            const tmpSet = new Set(arrIds)
                            if (arrIds.length === tmpSet.size) {
                                callback()
                            } else {
                                callback(new Error('商品SKU或类目id不能重复, 请检查'))
                            }
                        }else{
                            callback(new Error('商品SKU或类目id必须为数字,通过 , 隔开'))
                        }
                    }
                },
                // 分类树
                numValidator(rule, value, callback) {
                    if (value === '' || isNaN(Number(value))) {
                        callback(new Error('必填,并只能为数字'))
                    } else if (value < 0) {
                        callback(new Error('不能为负数'))
                    } else if (value > 100) {
                        callback(new Error('不能大于100'))
                    } else {
                        callback()
                    }
                },
                siteValidTime: (rule, value, callback) => {
                    if (validTime(value, this.siteData.editForm)) {
                        callback()
                    } else {
                        callback(new Error('必须设置时间或者选择长期有效'))
                    }
                },
                activityValidTime: (rule, value, callback) => {
                    if (validTime(value, this.activityData.editForm)) {
                        callback()
                    } else {
                        callback(new Error('必须设置时间或者选择长期有效'))
                    }
                },

                activeTab: 'defaultIn',

                // 站点设置弹窗
                dialogSiteFormVisible: false,

                // 活动配置弹窗
                dialogActivityFormVisible: false,

                pipelines: [],
                types: [{
                    typeCode: '',
                    typeName: '全部'
                },{
                    typeCode: 1,
                    typeName: '商品SKU分期'
                },{
                    typeCode: 2,
                    typeName: '商品类目分期'
                }],

                platforms: {},
                manifest: {
                    platforms: {},
                    pipelines: {},
                    types: {}
                },
                defaultData: {
                    loading: false,
                    installmentRates: []
                },

                siteData: {
                    loading: false,
                    list: [],
                    canEdit: true,
                    searchForm: {
                        platform: '',
                        pipelineCode: ''
                    },
                    previewSiteItem: false,
                    editForm: this._getEmptySiteEditData(),
                    pager: {
                        totalCount: 0,
                        pageNo: 1,
                        pageSize: 10
                    }
                },

                activityData: {
                    loading: false,
                    previewItem: false,
                    canEdit: true,
                    list: [],
                    searchForm: {
                        activityName: '',
                        activityType: '',
                        platform: '',
                        pipelineCode: ''
                    },
                    pager: {
                        totalCount: 0,
                        pageNo: 1,
                        pageSize: 10
                    },
                    editForm: this._getEmptyActivityEditData()
                }
            }
        },
        created() {
            this.initData()
        },
        methods: {
            async initData() {
                 // 并发接口
                 this._getDefaultList()
                 this._getSiteList()
                 this._getActivityList()

                const [pipelines, platforms] = await Promise.all([getPipelines(), getPlatforms()])

                // 终端 渠道子站点
                this.pipelines = [{
                    pipeline_name: '所有渠道',
                    pipeline_code: ''
                }].concat(pipelines)

                this.platforms = {
                    '所有终端': '',
                    ...platforms
                }

                // 转换资源表数据
                this.pipelines.forEach(item => {
                    this.manifest.pipelines[item.pipeline_code] = item.pipeline_name
                })

                this.types.forEach(item => {
                    this.manifest.types[item.typeCode] = item.typeName
                })

                for(let key in this.platforms){
                    this.manifest.platforms[platforms[key]] = key
                }
            },

            async onRemove(list, item){
                utils.array.remove(list, item)
            },

            // 默认分期list
            _getEmptyInstallmentRate() {
                return {
                    installments: '',
                    baseRate: '',
                    effectRate: ''
                }
            },
            _validateTime(form) {
                const {time, isLongEffect} = form
                if (isLongEffect) return true

                const valid = function () {
                    if (time[0] instanceof Date && time[1] instanceof Date) {
                        return +time[0] !== +time[1]
                    } else {
                        return time[0] !== time[1]
                    }
                }()

                if (!valid) {
                    this.$message.error('开始时间不能等于结束时间')
                }

                return valid
            },
            _validateForm(list, isActivity) {
                let newList = new Set()

                if(list.length <= 0) {
                    this.$message.error('必须设置至少一条分期数据，请检查')
                    return false
                }

                // 验证分期数是否为从小到大
                let isOrderEsc = 0,
                    activityHasZero = false ,
                    activityZeroErrIndex = 0

                list.reduce((preValue, curValue, index) => {
                    // 出现过异常 不用继续验证
                    const curInstallments = curValue.installments

                    if(!isOrderEsc && Number(curInstallments) < Number(preValue.installments)) {
                        isOrderEsc = index
                    }

                    // Set 验证全等
                    newList.add(Number(curInstallments))

                    if (isActivity) {
                        // 验证 0 利率
                        if (Number(curValue.effectRate) === 0) {
                            activityHasZero = true

                            // 请设置连续的 0% 分期有效利率
                            if (!activityZeroErrIndex && Number(preValue.effectRate) !== 0) {
                                activityZeroErrIndex = index
                            }
                        }
                    }

                    return curValue
                }, {installments: -1, effectRate: 0})


                // 验证重复
                if (newList.size !== list.length) {
                    this.$message.error('不能有重复的分期数，请检查')
                    return false
                }

                // 验证排序
                if (isOrderEsc){
                    this.$message.error(`分期数请从小到大依次配置，请检查第< ${isOrderEsc + 1} >条数据`)
                    return false
                }


                if (isActivity) {
                    // 活动分期 验证 必须一个利率为 0
                    if (!activityHasZero) {
                        this.$message.error(`活动利率至少有一个必须为0`)
                        return false
                    }

                    // // 活动分期 连续的0%分期有效利率
                    if (activityZeroErrIndex) {
                        this.$message.error(`请设置连续的 0% 分期有效利率，请检查第< ${activityZeroErrIndex + 1} >条数据`)
                        return false
                    }
                }

                return true
            },
            onSaveDefault(event) {
                event.preventDefault()
                this.$refs.defaultForm.validate(async valid => {
                    if (valid && this._validateForm(this.defaultData.installmentRates)) {

                        await this.$confirm('是否确认保存？？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })

                        try {
                            this.defaultData.loading = true
                            const data = await httpPost(this.apiConf.defaultUpdate, {
                                installmentRates: this.defaultData.installmentRates
                            })
                            this.$message.success(data.message)
                            this._getDefaultList()
                        }finally {
                            this.defaultData.loading = false
                        }
                    }
                })
            },

            onSizeChange(val, type) {
                if (type === 'site') {
                    let curPageNo = this.siteData.pager.pageNo

                    this.siteData.pager.pageNo = 1
                    this.siteData.pager.pageSize = val

                    // 修改pageNo会触发
                    curPageNo === 1 && this._getSiteList()
                }
                if (type === 'activity') {
                    let curPageNo = this.activityData.pager.pageNo

                    this.activityData.pager.pageNo = 1
                    this.activityData.pager.pageSize = val

                    curPageNo === 1 &&  this._getActivityList()
                }
            },
            onCurrentChange(val, type) {
                if (type === 'site') {
                    this.siteData.pager.pageNo = val
                    this._getSiteList()
                }
                if (type === 'activity') {
                    this.activityData.pager.pageNo = val
                    this._getActivityList()
                }
            },

            _getEmptySiteEditData() {
                return {
                    loading: false,
                    installmentId: '',
                    isLongEffect: false,
                    platform: 1,
                    pipelineCode: '',
                    time: [],
                    installmentRates: [],
                }
            },

            async _getDefaultList() {
                this.defaultData.loading = true
                const data= await httpGet(this.apiConf.defaultList)
                this.defaultData.loading = false
                this.defaultData.installmentRates = Array.isArray(data.installmentRates) ? data.installmentRates : []
            },

            // 站点分期 list
            async _getSiteList() {
                this.siteData.loading = true

                const params = {
                    ...this.siteData.searchForm,
                    ...this.siteData.pager
                }
                delete params.totalCount

                const data = await httpGet(this.apiConf.siteList, {
                    params
                })
                this.siteData.loading = false

                this.siteData.list = Array.isArray(data.list) ? data.list : []
                this.siteData.pager.totalCount = data.totalCount
            },

            // 活动分期 list
            async _getActivityList() {
                this.activityData.loading = true
                const params = {
                    ...this.activityData.searchForm,
                    ...this.activityData.pager
                }

                const data = await httpGet(this.apiConf.activityList, {
                    params
                })

                 this.activityData.loading = false

                this.activityData.list = Array.isArray(data.list) ? data.list : []
                this.activityData.pager.totalCount = data.totalCount
            },

            _getEmptyActivityEditData() {
                return {
                    loading: false,
                    installmentId: '',
                    isLongEffect: false,
                    activityName: '',
                    platform: '',
                    activityGoods: '',
                    activityType: 1,
                    pipelineCode: '',
                    time: [],
                    installmentRates: [],
                }
            },

            onSearchSite() {
                // 站点分期 搜索
                this.siteData.pager.pageNo = 1
                this._getSiteList()
            },
            onResetSite() {
                // 站点分期重置
                Object.assign(this.siteData.searchForm, {
                    platform: '',
                    pipelineCode: ''
                })
                this.onSearchSite()
            },

            async _setSetItemData(item){
                this.$nextTick(() => {
                    this.$refs.siteEditForm.resetFields()
                })

                this.siteData.editForm.loading = true
                const params = {
                    installmentId: item.installmentId
                }

                const data = await httpGet(this.apiConf.siteInfo, {
                    params
                })

                const curTimeZone = this.$store.getters.getTimeZone

                Object.assign (
                    this.siteData.editForm,
                    {
                        ...data,
                        time: (data.validStartTime && data.validEndTime) ? [this.timeZone_(data.validStartTime, curTimeZone), this.timeZone_(data.validEndTime, curTimeZone)] : []
                    }
                )

                this.siteData.editForm.loading = false
            },
            onAddOrEditSite(event, item) {
                // 站点分期添加
                this.dialogSiteFormVisible = true
                this.siteData.previewSiteItem = false
                this.siteData.canEdit = !item

                // 添加修改站点配置
                if (item) {
                    this._setSetItemData(item)
                } else {
                    this.$nextTick(() => {
                        this.$refs.siteEditForm.resetFields()
                    })
                    Object.assign(this.siteData.editForm, this._getEmptySiteEditData())
                }
            },
            async onRemoveSiteItem(event, item) {
                await this.$confirm('是否确认删除？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                this.siteData.editForm.loading = true

                try {
                    const data = await httpPost(this.apiConf.siteDelete, {
                        installmentId: item.installmentId
                    })
                    this.$message.success(data.message)
                } finally {
                    this.siteData.editForm.loading = false
                }

                this._getSiteList()
            },
            onPrevSiteItem(event, item){
                // 站点分期 查看 单个
                this.dialogSiteFormVisible = true       //  弹窗
                this.siteData.previewSiteItem = true    //  查看只读
                this.siteData.canEdit = true
                this._setSetItemData(item)
            },
            onSaveSiteItem() {
                this.$refs.siteEditForm.validate(async valid => {
                    if (valid && this._validateForm(this.siteData.editForm.installmentRates) && this._validateTime(this.siteData.editForm)) {
                        await this.$confirm('是否确认保存？？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })

                        this.siteData.editForm.loading = true

                        const {
                            installmentId,
                            platform,
                            pipelineCode,
                            time,
                            isLongEffect,
                            installmentRates
                        } = this.siteData.editForm

                        const [validStartTime, validEndTime] = this.timeZone_(time, this.$store.getters.getTimeZone)

                        const params = {
                            platform,
                            pipelineCode,
                            validStartTime,
                            validEndTime,
                            isLongEffect: +isLongEffect,
                            installmentRates
                        }

                        // 修改 或者 添加
                        installmentId ? (params.installmentId = installmentId) : (params.createUser = this.$store.state.userName)

                        try {
                            const data = await httpPost(installmentId ? this.apiConf.siteUpdate : this.apiConf.siteAdd, params)
                            this.$message.success(data.message)

                            this.dialogSiteFormVisible = false
                            this._getSiteList()
                        } finally {
                            this.siteData.editForm.loading = false
                        }
                    }
                })
            },

            // 活动
            onSearchActivity() {
                this.activityData.pager.pageNo = 1
                this._getActivityList()
            },

            async _setActivityItemData(item){
                this.$nextTick(() => {
                    this.$refs.activityEditForm.resetFields()
                })

                this.activityData.editForm.loading = true
                const params = {
                    installmentId: item.installmentId
                }

                const data = await httpGet(this.apiConf.activityInfo, {
                    params
                })

                const curTimeZone = this.$store.getters.getTimeZone

                Object.assign (
                    this.activityData.editForm,
                    {
                        ...data,
                        time: (data.validStartTime && data.validEndTime) ? [this.timeZone_(data.validStartTime, curTimeZone), this.timeZone_(data.validEndTime, curTimeZone)] : []
                    }
                )

                this.activityData.editForm.loading = false
            },
            onAddOrEditActivity(event, item) {
                this.dialogActivityFormVisible = true
                this.activityData.previewItem = false

                this.activityData.canEdit = !item

                // 添加修改站点配置
                if (item) {
                    this._setActivityItemData(item)
                } else {
                    this.$nextTick(() => {
                        this.$refs.activityEditForm.resetFields()
                    })
                    Object.assign(this.activityData.editForm, this._getEmptyActivityEditData())
                }
            },
            async onRemoveActivityItem(event, item) {
                await this.$confirm('是否确认删除？？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                this.activityData.editForm.loading = true

                try {
                    const data = await httpPost(this.apiConf.activityDelete, {
                        installmentId: item.installmentId
                    })
                    this.$message.success(data.message)
                } finally {
                    this.activityData.editForm.loading = false
                }

                this._getActivityList()
            },
            onPrevActivityItem(event, item){
                // 活动分期 查看 单个
                this.dialogActivityFormVisible = true
                this.activityData.previewItem = true
                this.activityData.canEdit = true

                this._setActivityItemData(item)
            },
            onSaveActivityItem() {
                this.$refs.activityEditForm.validate(async valid => {
                    if(valid && this._validateForm(this.activityData.editForm.installmentRates, true) && this._validateTime(this.activityData.editForm)) {
                        if (!this.activityData.editForm.platform && !this.activityData.editForm.pipelineCode) {
                            this.$message.error('不能同时选择所有终端和所有渠道')
                            return false
                        }

                        await this.$confirm('是否确认保存？？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                        this.activityData.editForm.loading = true

                        // 时间
                        const [validStartTime, validEndTime] = this.timeZone_(this.activityData.editForm.time, this.$store.getters.getTimeZone)

                        const {
                            installmentId,
                            activityName,
                            activityType,
                            activityGoods,
                            platform,
                            isLongEffect,
                            pipelineCode,
                            installmentRates
                        } = this.activityData.editForm

                        const params = {
                            activityName,
                            activityType,
                            activityGoods,
                            platform,
                            pipelineCode,
                            validStartTime,
                            validEndTime,
                            installmentRates,
                            isLongEffect: +isLongEffect
                        }

                        // 修改 或者 添加
                        installmentId ? (params.installmentId = installmentId) : (params.createUser = this.$store.state.userName)

                        try {
                            const data = await httpPost(installmentId ? this.apiConf.activityUpdate : this.apiConf.activityAdd, params)
                            this.$message.success(data.message)

                            this.dialogActivityFormVisible = false
                            this._getActivityList()
                        } finally {
                            this.activityData.editForm.loading = false
                        }
                    }
                })
            },
            onResetActivity() {
                // 活动分期重置
                Object.assign(this.activityData.searchForm, {
                    activityName: '',
                    activityType: '',
                    platform: '',
                    pipelineCode: ''
                })
                this.onSearchActivity()
            }
        }
    }
</script>

<style lang="less">
    .installment-base{
        .el-select, .el-input{
            width: auto;
        }
        .de-table{
            td{
                padding-top: 22px;
                height: 60px;
            }
        }
    }
</style>

<style lang="less" scoped>
    .installment-base {
        .ml5{
            margin-left: 5px;
        }
        .w350{
            width: 350px;
        }
        .default-form{
            width: 180*4 + 2px;
        }
        .mt22{
            margin-top: 22px;
        }
        .ml10{
            margin-left: 10px;
        }
        .h400{
            height: 400px;
        }
        .pager{
            margin-top: 20px;
        }
    }
    .dlg-box{
        position: relative;
        .mask-layer{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 2;
        }
        .dlg-content{
            position: relative;
        }
    }
</style>

<style lang="less">
    .installment-table-list{
        table {
            th,
            td { text-align: center; }
            td { padding-top: 10px; padding-bottom: 10px; }
        }
    }
</style>
