<template>
    <div>
        <div class="el-container mail-content">

            <el-form :inline="true" :model="searchOption" class="mail-search">
                <el-form-item label="来源渠道">
                    <el-select v-model="searchOption.pipelineCode" placeholder="请选择渠道" clearable>
                        <el-option v-for="(item, key) in pipeOpt" :label="item" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="来源端">
                    <el-select v-model="searchOption.platform" placeholder="请选择来源端" clearable>
                        <el-option v-for="(item, key) in platformOpt" :label="item" :value="key" :key="key"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否订阅">
                    <el-select v-model="searchOption.isSubscribed" placeholder="请选择" clearable>
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="订阅时间：">
                    <el-select v-model="searchOption.subDateOperate" placeholder="请选择">
                        <el-option label="晚于" value="2"></el-option>
                        <el-option label="早于" value="3"></el-option>
                        <el-option label="介于" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="searchOption.subDate" type="datetime" :class="{none: searchOption.subDateOperate == 4}" placeholder="选择日期" :picker-options="searchOption.pickerOptions"></el-date-picker>
                    <el-date-picker v-model="searchOption.subDateRange" type="datetimerange" :class="{none: searchOption.subDateOperate != 4}"  placeholder="选择日期范围" :picker-options="searchOption.pickerOptions"></el-date-picker>
                </el-form-item>

                <el-form-item class="search-btn">
                    <el-button type="primary" @click="getData(1)" :disabled="dataLoading">筛选</el-button>
                    <el-button type="danger" @click="handleBtnCancelFilterClick">取消筛选</el-button>
                </el-form-item>

                <div class="el-sub-container text-right">
                    <el-button v-if="this.showAction_('user/mail-subscribe/edit')" type="danger" @click="toggleAllSubscribe(0)" :disabled="multipleSelection.length < 1 || dataLoading">取消订阅</el-button>
                    <!-- <el-button v-if="this.showAction_('user/mail-subscribe/edit')" type="primary" @click="toggleAllSubscribe(1)" :disabled="multipleSelection.length < 1 || dataLoading">全部订阅</el-button> -->
                </div>

            </el-form>

            <el-table ref="multipleTable" :data="tableData" v-loading="dataLoading" border tooltip-effect="dark" @selection-change="selectionChange" @row-click="clickRow">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="userId" label="User-ID"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column label="订阅时间">
                    <template scope="scope">
                        {{ self.timeZone_(scope.row.createDate, self.$store.getters.getTimeZone) }}
                    </template>
                </el-table-column>

                <el-table-column label="来源端">
                    <template scope="scope">
                        {{ platformOpt[scope.row.platform] }}
                    </template>
                </el-table-column>

                <el-table-column label="来源渠道">
                    <template scope="scope">
                        {{ pipeOpt[scope.row.pipelineCode] }}
                    </template>
                </el-table-column>

                <el-table-column prop="isSubscribed" label="是否订阅邮件"  column-key="handle">
                    <template scope="scope">
                        <div>
                            <el-button v-if="self.showAction_('user/mail-subscribe/edit')" type="text" :loading="scope.row.isLoading" @click="handleToggleSubscribeClick(scope.$index)"><i :class="{'el-icon-circle-check color-success': scope.row.isSubscribed == 1, 'el-icon-circle-cross color-danger': scope.row.isSubscribed == 0}"></i>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="el-container last text-right">
                <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="searchOption.pageNo" :page-sizes="[10, 20, 50]" :page-size="searchOption.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchOption.totalCount"></el-pagination>
            </div>

        </div>

    </div>
</template>

<script>
export
default {
    data() {
        return {
            self: this,

            subClass: 'el-icon-circle-check color-success sub-icon',
            unSubClass: 'el-icon-circle-cross color-danger sub-icon',
            searchOption: {
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                subDateOperate: '',
                subDate: '',
                subDateEnd: '',
                subDateRange: '',
                pipelineCode: '',
                platform: '',
                isSubscribed: '',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                }
            },
            tableData: [],
            dataLoading: false,
            multipleSelection: [],
            pipeOpt: {},
            platformOpt: {
                '1': 'PC',
                '2': 'M',
                '3': 'IOS',
                '4': 'Android',
                '5': 'Pad'
            }
        };
    },
    created() {
        this.getData();
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
        getData(pageNo) {
            let params = Object.assign({}, this.searchOption);
            if(params.subDateOperate == 4){
                if(params.subDateRange.length === 2 && params.subDateRange[0] && params.subDateRange[1]){
                    let time1 = this.timeZone_(params.subDateRange[0], this.$store.getters.getTimeZone);
                    let time2 = this.timeZone_(params.subDateRange[1], this.$store.getters.getTimeZone);
                    params.subDate = time1;
                    params.subDateEnd = time2;
                }else{
                    params.subDate = '';
                    params.subDateEnd = '';
                }
            } else {
                if(params.subDate){
                    let time = this.timeZone_(params.subDate, this.$store.getters.getTimeZone);
                    // console.log(params.subDate)
                    params.subDate = time;
                    // console.log(params.subDate)
                    params.subDateEnd = '';
                } else {
                    params.subDate = '';
                    params.subDateEnd = '';
                }
            }

            delete params.pickerOptions;
            delete params.subDateRange;
            delete params.totalCount;

            if (pageNo) {
                this.searchOption.pageNo = params.pageNo = pageNo;
            }

            this.dataLoading = true;
            this.$http.get('user/mail-subscribe/list', {
                params: params
            }).then(res => {
                this.dataLoading = false;
                if (res.body.code !== 0) {
                    this.$notify.error(res.body.message || '发生错误');
                    return;
                }

                this.tableData = [];
                if (res.body.data.totalCount != 0) {
                    res.body.data.list.forEach((item) => {
                        item.isLoading = false;
                        this.tableData.push(item);
                    });
                }
                this.searchOption.totalCount = res.body.data.totalCount;
                
            }, (err) => {
                this.$notify.error(err.body.message || '发生错误');
                this.dataLoading = false;
            })
        },
        handleBtnCancelFilterClick() {
            for (let key in this.searchOption) {
                // console.log(key);
                if (key === 'pageNo' || key === 'pageSize' || key === 'totalCount') {
                    continue;
                }
                this.searchOption[key] = '';
            }
            this.searchOption.pageNo = 1;
        },
        changePage(value) {
            this.searchOption.pageNo = value;
            this.getData();
        },
        changePageSize(value) {
            this.searchOption.pageSize = value;
            this.getData();
        },
        selectionChange(val) {
            this.multipleSelection = val;
        },
        toggleAllSubscribe(status) {
            let ids = [];
            this.multipleSelection.forEach((item) => {
                ids.push(item.id);
            });
            this.setSubscribeStatus(ids, status, null, (code) => {
                if (code !== 0) {
                    return;
                }
                this.getData();
            });
        },
        handleToggleSubscribeClick(index) {
            let row = this.tableData[index];
            if (row.isLoading) {
                return;
            }
            let isSubscribed = row.isSubscribed == 1 ? 0 : 1;
            this.setSubscribeStatus([row.id], isSubscribed, index, (code) => {
                if (code === 0) {
                    row.isSubscribed = isSubscribed;
                }
            });
        },
        setSubscribeStatus(ids, status, rowIndex, callback) {
            if (!ids) {
                return;
            }
            let params = {
                ids: ids.join(','),
                isSubscribed: status || 0
            };
            if (rowIndex == null) {
                this.dataLoading = true;
            } else {
                this.tableData[rowIndex].isLoading = true;
            }
            this.$http.post('user/mail-subscribe/edit', params).then(res => {
                // console.log(res);
                if (res.body.code == 0) {
                    this.$message.success(res.body.message || '修改成功');
                } else {
                    this.$message.error(res.body.message || '发生错误');
                }
                if (rowIndex == null) {
                    this.dataLoading = false;
                } else {
                    this.tableData[rowIndex].isLoading = false;
                }
                if (typeof callback == 'function') {
                    callback(res.body.code, status);
                }
            }, (err) => {
                this.$notify.error(err.body.message || '发生错误');
                if (rowIndex == null) {
                    this.dataLoading = false;
                } else {
                    this.tableData[rowIndex].isLoading = false;
                }
            });
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.multipleTable.toggleRowSelection(row);
            }
        },
    }
}
</script>

