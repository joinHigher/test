<!-- deals -->
<template>
    <div class="el-container gb-flash-sale">
        <el-form inline :model="option" ref="searchForm">
<!--             <el-form-item label="语言" prop="lang">
                <el-select v-model="option.lang" clearable placeholder="请选择">
                    <el-option v-for="value in langs" :label="value.language_ch" :value="value.language_en" :key="value.id"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="快速搜索" prop="keyword">
                <el-input v-model="keyword" class="quick-search">
                    <el-select filterable clearable v-model="field" slot="prepend" placeholder="请选择">
                        <el-option v-for="(item, index) in fieldOpt" :key="index" :label="item" :value="index">
                        </el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="渠道" prop="pipeline_code">
                <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                    <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="仓库" prop="real_wh_code">
                <el-select v-model="option.real_wh_code" clearable>
                    <el-option v-for="(item, index) in wareOpt" :label="item.virWhCnName" :value="item.virWhCode" :key="item.virWhCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品状态" prop="status">
                <el-select v-model="option.status" clearable>
                    <el-option label="未过期" value="1"></el-option>
                    <el-option label="已过期" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间" prop="date">
                <el-date-picker v-model="option.date" type="datetimerange" :editable="false"></el-date-picker>
            </el-form-item>
            <div class="text-right el-sub-container">
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
                <el-button type="primary" @click="addLikes" v-if="self.showAction_('admin/deals/add')">添加</el-button>
                <el-button type="danger" @click="remove" class="fl"  v-if="self.showAction_('admin/deals/delete')">批量删除</el-button>
            </div>
        </el-form>
        <el-table :border="true" :data="tableData" v-loading="tableLoading" @selection-change="changeSelect" @row-click="clickRow" ref="dataTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="goods_title" label="标题"></el-table-column>
            <el-table-column prop="goods_sn" label="SKU"></el-table-column>
            <el-table-column label="仓库">
                <template scope="scope">
                    {{wareObj[scope.row.real_wh_code]}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="是否过期"></el-table-column>
            <el-table-column prop="goods_brand" label="品牌"></el-table-column>
<!--             <el-table-column label="语言">
                <template scope="scope">
                    {{ langTexts[scope.row.lang] }}
                </template>
            </el-table-column> -->
            <el-table-column label="渠道">
                <template scope="scope">
                    <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="添加时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.create_time, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column label="起始时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.start_time, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column label="截止时间">
                <template scope="scope">
                    {{self.timeZone_(scope.row.end_time, self.$store.getters.getTimeZone)}}
                </template>
            </el-table-column>
            <el-table-column prop="likes" label="赞"></el-table-column>
            <el-table-column label="操作" column-key="handle">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="edit(scope.row)" v-if="self.showAction_('admin/deals/info')">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>
        <!-- 弹窗S -->

        <!-- 弹窗E -->
</template>

<script>

export default {
    data () {
        return {
            field: '',
            keyword: '',
            self: this,
            tableLoading: false,
            tableData: [],
            option: {
                create_start_time: '',
                create_end_time: '',
                status: '',
                date: [],
                real_wh_code: '',
                // lang: '',
                pipeline_code: '',
                pageNo: 1,
                pageSize: 20,
            },
            total: 1,
            select: [],
            wareOpt: [],
            wareObj: {},
            fieldOpt: {
                'id': 'deals id',
                'goods_sn': '商品SKU',
                'goods_title': '商品标题'
            },
            // langs: null,
            langTexts: {},
        };
    },
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
    created () {
        this.getLangs();
        this.getOpt();
        this.getData();
    },
    methods: {
        // 获取语言列表
        getLangs() {
            this.$http.get('admin/public/languages').then(res => {
                if (res.body.code !== 0) {
                    return;
                }
                // this.langs = res.body.data;
                let langTexts = {};
                res.body.data.forEach((item) => {
                    langTexts[item.language_en] = item.language_ch;
                });
                this.langTexts = Object.assign({}, this.langTexts, langTexts);
            },
            (err) => {
                this.$notify.error(err.body.message || '发生错误');
            });
        },
        getOpt() {
            this.$http.get('promotion/index/public-virtual-wares').then(res => {
                if (res.body.code === 0) {
                    let data = res.body.data;
                    let temp = {};
                    this.wareOpt = data;

                    data.forEach(item => {
                        temp[item.virWhCode] = item.virWhCnName;
                    });
                    this.wareObj = temp;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {

            });
        },
        getData() {
            if((this.keyword && this.field) || (!this.keyword && !this.field)) {

            } else {
                this.$message.error('快速搜索项必须匹配');
                return;
            }

            let params = {};
            for (let i in this.option) {
                if (i != 'date') {
                    params[i] = this.option[i];
                }
            }

            let timeArr = this.timeZone_(this.option.date, this.$store.getters.getTimeZone);
            params.create_start_time  = timeArr[0];
            params.create_end_time = timeArr[1];

            if (this.field) {
                params[this.field] = this.keyword;
            }

            this.tableLoading = true;
            this.$http.get('admin/deals/list', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    let data = res.body.data;
                    this.tableData = data.data;
                    this.total = data.total;
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        // 表格选择
        changeSelect(val) {
            this.select = val;
        },
        clickRow (row, event, col) {
            if (col.columnKey != 'handle') {
                this.$refs.dataTable.toggleRowSelection(row);
            }
        },
        // 分页
        resetForm() {
            this.field = this.keyword = '';
            this.$refs.searchForm.resetFields();
        },
        addLikes () {
            this.$router.push({
                name: 'site_dealsEdit',
            })
        },
        remove () {
            let params = [];
            this.select.forEach(item => {
                params.push(item.id)
            });
            this.$confirm('确认删除选择项？', '提示').then(() => {
                this.$http.post('admin/deals/delete', {dealsList: params}).then(res => {
                    if (res.body.code === 0) {
                        this.$message.success(res.body.message);
                        this.getData();
                    } else {
                        this.$message.error(res.body.message);
                    }
                })
            }).catch(() => {
                this.$methods.info('已取消');
            });
        },
        edit (item) {
            this.$router.push({
                name: 'site_dealsEdit',
                query: {
                    id: item.id,
                    sku: item.goods_sn,
                }
            })
        },
        ChangePage (val) {
            this.option.pageNo = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.pageSize = val;
            this.getData();
        },
    }

}
</script>

<style lang="less">
    .gb-flash-sale {
        .date-txt {
            .el-form-item__content {
                width: 400px;
            }

        }
    }
</style>


