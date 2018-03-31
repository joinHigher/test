<template>
    <div>
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
<!--                 <el-form-item label="显示位置" prop="position">
                    <el-select v-model="option.position">
                        <el-option v-for="(item, index) in positionList" :value="index" :label="item" :key="index"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="所属分类" class="date-item" prop="cat_id">
                    <el-select v-model="option.cat_id" filterable>
                        <el-option v-for="item in catList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示状态" prop="is_show">
                    <el-select v-model="option.is_show">
                        <el-option value="0" label="不显示"></el-option>
                        <el-option value="1" label="显示"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="添加时间" class="date-item" prop="create_time">
                        <el-date-picker v-model="option.create_time" type="datetimerange" :editable="false"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="text-right">
                    <el-button type="primary" @click="render">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column type="index" width="100" label="排名"> </el-table-column>
                <el-table-column label="导购词">
                    <template scope="scope">
                        <span>{{scope.row.trend.keywords}}</span>
                    </template>
                </el-table-column>
<!--                 <el-table-column label="显示位置">
                    <template scope="scope">
                        <span>{{scope.row.trend.position_text}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="cat_name" label="所属分类"></el-table-column>
                <el-table-column label="显示状态">
                    <template scope="scope">
                        <i :class="{'el-icon-circle-check color-success': scope.row.trend.is_show == '1', 'el-icon-circle-cross color-danger': scope.row.trend.is_show == '0'}"></i>  
                    </template>
                </el-table-column>
                <el-table-column label="添加时间">
                    <template scope="scope">
                        {{self.timeZone_(scope.row.trend.create_time, self.$store.getters.getTimeZone)}}
                    </template>
                </el-table-column>
                <el-table-column prop="access_times" label="访问次数"></el-table-column>
            </el-table>
            <div class="el-container last text-right">
                <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <!-- 弹窗S -->
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            self: this,
            tableLoading: true,
            option: {
                // position: '',
                cat_id: '',
                is_show: '',
                start_time: '',
                end_time: '',
                page: 1,
                size:20,
                create_time: []
            },
            tableData: [],
            catList: [],
            // positionList: {},
            queryCatlist: [],
            total: 10
        };
    },
    created () {
        this.initData();
    },
    methods: {
        initData () {
            this.getCat();
            // this.getPosition();
        },
        getCat () {
            this.$http.get('seo/public/category-all').then(res => {
                if (res.body.code === 0) {
                    var data = res.body.data;
                    data[0] = {
                        id: 0,
                        name: '暂无分类'
                    }
                    this.catList = data;
                    this.getData();
                    for (var i in data) {
                        this.queryCatlist.push({
                            value: data[i].name,
                            id: data[i].id
                        });
                    }
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        // getPosition () {
        //     this.$http.get('seo/public/trend-position-all').then(res => {
        //         if (res.body.code === 0) {
        //             this.positionList = res.body.data;
        //         } else {
        //             this.$message.error(res.body.message);
        //         }
        //     });
        // },
        getData () {
            let timeArr = this.timeZone_(this.option.create_time, this.$store.getters.getTimeZone);
            this.option.start_time = timeArr[0];
            this.option.end_time = timeArr[1];

            let params = {}; 
            for (let i in this.option) {
                if (i !== 'create_time') {
                    params[i] = this.option[i];
                }
            }

            this.tableLoading = true;
            this.$http.get('seo/trend/statistic-list', {params: params}).then(res => {
                this.tableLoading = false;
                if (res.body.code === 0) {
                    var data = res.body.data.data;
                    for (var item in data) {
                        var cat = data[item].trend.cat_id * 1;

                        if (typeof this.catList[cat] == 'undefined') {
                            data[item].cat_name = '未知分类'
                        } else if (cat !== 0) {
                            data[item].cat_name = this.catList[cat].name;
                        } else {
                            data[item].cat_name = '暂无分类';
                        }
                    }
                    this.total = res.body.data.total * 1;

                    this.tableData = data;
                } else {
                    this.$message.error(res.body.message);
                }
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        ChangePage (val) {
            this.option.page = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.size = val;
            this.getData();
        },
        render () {
            this.getData();
        },
        goback () {
            history.back();
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.option.cat_id = '';
        }
    }

}
</script>

<style>
</style>


