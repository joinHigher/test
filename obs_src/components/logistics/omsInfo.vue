<template>
    <!--OMS同步通邮信息-->
    <div>
        <div class="el-container">
            <el-form label-width="100px" inline :model="option" ref="searchForm">
                <el-form-item label="国家" prop="countryKeyWord">
                    <el-input v-model="option.countryKeyWord"></el-input>
                </el-form-item>
                <el-form-item label="物流编码" prop="logisticsCode">
                    <el-input v-model="option.logisticsCode"></el-input>
                </el-form-item>
                <el-form-item label="是否通邮" prop="isPostal">
                    <el-select v-model="option.isPostal" clearable>
                        <el-option v-for="(item,index) in postalOpt" :key="index" :value="index" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <div class="text-right">
                    <el-button type="primary" @click="getDataBySearch" icon="search">筛选</el-button>
                    <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
                </div>
            </el-form>
        </div>
        <div class="el-container">
            <el-table border :data="tableData" v-loading="tableLoading">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="wareName" label="真实仓">
                    <template scope="scope">
                        <span v-if="scope.row.wareName.length<=45">{{scope.row.wareName}}</span>
                        <el-tooltip v-if="scope.row.wareName.length>45" :content="scope.row.wareName" placement="top" effect="light" popper-class="pop-box">
                            <span class="tip-text">{{scope.row.wareName}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="countryName" label="国家"></el-table-column>
                <el-table-column prop="logisticsName" label="物流名称"></el-table-column>
                <el-table-column prop="enName" label="英文名称"></el-table-column>
                <el-table-column prop="logisticsCode" label="物流编码"></el-table-column>
                <el-table-column prop="isPostal" label="是否通邮">
                    <template scope="scope">
                        {{postalOpt[scope.row.isPostal]}}
                    </template>
                </el-table-column>
                <el-table-column label="禁发分类">
                  <template scope="scope">
                    <el-tooltip effect="light" placement="top" popper-class="pop-box">
                        <div slot="content">{{scope.row.categoryIds}}</div>
                        <el-button>禁发分类</el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="禁发属性">
                  <template scope="scope">
                    <el-tooltip effect="light" placement="top" popper-class="pop-box">
                      <div slot="content">{{scope.row.attrIds}}</div>
                      <el-button>禁发属性</el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
        </div>
        <div class="el-container last text-right">
            <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
            option: {
                pageNo: 1,
                pageSize: 10,
                isPostal: '',
                logisticsCode: '',
                countryKeyWord: ''
            },
            postalOpt: {
                '1': '通邮',
                '0': '不通邮'
            },
            tableLoading: false,
            total: 10,
            tableData: [],
        };
    },
    created () {
        this.getData();
    },
    methods: {
      //通过接口获得数据
      getDataByport(obj){
        this.tableLoading = true;
        this.$http.get('logistics/oms/postal-list', {params: obj}).then(res => {
          this.tableLoading = false;
          if (res.body.code === 0) {
              //console.log(res.body.data.list);
            this.tableData = res.body.data.list;
            this.total = res.body.data.totalCount;
          }
        })
      },


        getData () {
          var obj = this.option;
          this.getDataByport(obj);
        },

      //筛选
      getDataBySearch (){
          let obj = {
            pageNo: 1,
            pageSize: 10,
            isPostal: this.option.isPostal,
            logisticsCode: this.option.logisticsCode,
            countryKeyWord: this.option.countryKeyWord,
          };
        this.getDataByport(obj);
        this.option.pageNo = 1;
      },

        ChangePage (val) {
            this.option.pageNo = val;
            this.getData();
        },
        ChangePageSize (val) {
            this.option.pageSize = val;
            this.getData();
        },
        resetForm () {
            this.$refs['searchForm'].resetFields();
            this.getDataBySearch();
        }
    }
}
</script>

<style lang="less">
    .tip-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        padding: 10px 0;
        cursor: pointer;
        &:hover {
            color: red;
        }
    }

    .pop-box {
        max-width: 1200px;
        line-height: 20px;
        word-wrap: break-word;
    }
</style>
