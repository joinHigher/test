<!-- 批发询价 -->
<template>
	<div>
        <div class="el-container">
            <el-form inline :model="option" ref="searchForm">
                <el-form-item label="快速搜索" prop="value">
                    <el-input v-model="option.value" class="quick-search" placeholder="输入关键词">
                        <el-select v-model="option.fields" clearable slot="prepend" placeholder="请选择">
                            <el-option label="商品标题" value="goods_title"></el-option>
                            <el-option label="姓名" value="name"></el-option>
                            <el-option label="国家/州" value="country"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="语言" prop="lang">
                    <el-select v-model="option.lang" clearable>
                        <el-option v-for="(item, index) in langs" :label="item.language_ch" :value="item.language_en" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="pipeline_code">
                    <el-select clearable filterable v-model="option.pipeline_code" placeholder="请选择">
                        <el-option v-for="(item, index) in pipeOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getData('search')">筛选</el-button>
                    <el-button type="danger" @click="resetForm">清空</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <div class="text-left el-sub-container">
                <el-button v-if="self.showAction_('admin/inquiry/process')" type="danger" :disabled="checkedRow.length === 0" @click="remove">删除选择项</el-button>
            </div>
            <el-table :data="tableData" border @selection-change="changeRow" @row-click="clickRow" ref="dataTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="goods_title" label="商品标题"></el-table-column>
                <el-table-column prop="price" label="目标价格"></el-table-column>
                <el-table-column prop="quantity" label="批发数量"></el-table-column>
                <el-table-column label="语言">
                    <template scope="scope">
                        {{ langTexts[scope.row.lang] }}
                    </template>
                </el-table-column>
                <el-table-column label="渠道">
                    <template scope="scope">
                        <span>{{pipeOpt[scope.row.pipeline_code]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="message" label="详情"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="country" label="国家/州"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="company_name" label="公司"></el-table-column>
            </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="option.page" :page-sizes="[20, 50]" :page-size="option.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
	</div>
</template>

<script>

export default {
  	data () {
		return {
            self: this,
            tableData: [],
            option: {
                page: 1,
                page_size: 20,
                fields: '',
                value: '',
                lang: '',
                pipeline_code: '',
            },
            total: 10,
            langs: null,
            langTexts: {},
            checkedRow: [],
		};
  	},
    computed: {
        pipeOpt() {
            return this.$store.getters.getPipe.obj;
        }
    },
	created () {
        this.getLangs();
        this.getData();
	},
	methods: {
        // 获取语言列表
        getLangs() {
            this.$http.get('admin/public/languages').then(res => {
                    if (res.body.code !== 0) {
                        return;
                    }
                    // console.log(res.body.data);
                    this.langs = res.body.data;
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
        getData (search) {
            if (search === 'search') {
                this.option.page = 1;
                this.option.page_size = 20;
            }
            if ((this.option.fields && !this.option.value) || (!this.option.fields && this.option.value)) {
                this.$message.warning('关键字必须匹配类型');
                return;
            }
            this.$http.get('admin/inquiry/list', {params: this.option}).then(res => {
                this.tableData = res.body.data.data;
                this.total = res.body.data.total * 1;
            })
        },
        changePageSize (size) {
            this.option.page_size = size * 1;
            this.getData();
        },
        changePage (page) {
            this.option.page = page * 1;
            this.getData();
        },
        remove () {
            this.$confirm('是否删除选择项?', '提示', {
                type: 'warning'
            }).then(() => {
                let str = [];
                this.checkedRow.forEach(item => {
                    str.push(item.id);
                });
                this.$http.post('admin/inquiry/delete', {ids: str.join(',')}).then(res => {
                    if (res.body.code == 0) {
                        this.getData();
                        this.$message({
                            type: 'success',
                            message: res.body.message
                        });
                    } else {
                        this.$message.error(res.body.message);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除!'
                });
            });
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.option.fields = '';
        },
        changeRow (val) {
            this.checkedRow = val;
        },
        clickRow (row, event, col) {
            this.$refs.dataTable.toggleRowSelection(row);
        },
	}
}
</script>
<style>
</style>

