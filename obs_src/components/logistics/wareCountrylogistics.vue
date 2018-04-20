<template>
  <!--销售仓国家物流-->
  <div>
    <div class="el-container">
      <el-form label-width="100px" inline :model="option" ref="searchForm">
        <el-form-item label="销售仓">
          <el-select v-model="option.wcode" clearable @change="wCodeChange(option)">
            <el-option v-for="item in salesWare" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <div class="text-right">
          <el-button type="primary" @click="getData" icon="search" v-if="self.showAction_('logistics/ware-logistics-group/query-group')">筛选</el-button>
          <el-button type="danger" @click="resetForm" icon="close">取消筛选</el-button>
        </div>
      </el-form>
    </div>
    <div class="el-container wareCountryLogistics">
      <el-table border :data="tableData" v-loading="tableLoading" height="700">
        <el-table-column label="国家" prop="country_name"></el-table-column>
        <el-table-column v-for="(value, index) in tableHeader" :key="index" :render-header="sheetRender"
                         :column-key="value">
          <template scope="scope">
            <label class="item-label" :class="{disabled: scope.row[scope.row.id][index].status == 2}">
              <input type="checkbox" v-model="scope.row[scope.row.id][index].status" :true-value="1" :false-value="0"
                     :disabled="scope.row[scope.row.id][index].status == 2">
            </label>
          </template>
        </el-table-column>
        <el-table-column :render-header="autoRender" column-key="AUTO FREE" width="140px">
          <template scope="scope">
            <label class="item-label">
              <input type="checkbox" v-model="scope.row.auto_free_status" :true-value="1" :false-value="0">
            </label>
          </template>
        </el-table-column>
        <el-table-column :render-header="stateRender" column-key="开启状态" width="120px">
          <template scope="scope">
            <label class="item-label">
              <input type="checkbox" v-model="scope.row.reach_country_status" :true-value="1" :false-value="0">
            </label>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer text-center">
      <el-button type="primary" @click="post" v-if="self.showAction_('logistics/ware-logistics-group/edit')">保存</el-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import logistics from './js/logistics'
  Vue.use(logistics);
  export default {
    data () {
      return {
        self: this,
        option: {
          pageNo: 1,
          pageSize: 10,
          wcode: ''
        },
        salesWare: this.getSaleWareData(),
        tableLoading: false,
        total: 10,
        tableHeader: {},
        tableData: []
      };
    },
    created () {

    },
    computed: {
      status (status) {
        if (status == 1) {
          return true;
        }
        if (status == 2) {
          return false;
        }
      }
    },
    methods: {
      getData (){
        if (this.option.wcode === '') {
          this.$message.error('请选择销售仓!');
          return false;
        }
        this.tableLoading = true;
        this.$http.get('logistics/ware-logistics-group/query-group', {params: {vwareCode: this.option.wcode}}).then(res => {
          if (res.body.code === 0) {
            this.tableHeader = res.body.data.header;
            this.tableData = res.body.data.body;
          } else {
            this.$message.error(res.body.message);
          }
          this.tableLoading = false;
        });
      },

      resetForm (){
        this.option.wcode = '';
      },

      post () {
        this.$http.post('logistics/ware-logistics-group/edit', {
          data: JSON.stringify(this.tableData),
          vwareCode: this.option.wcode
        }).then(res => {
          if (res.body.code === 0) {
            this.$message.success(res.body.message);
          } else {
            this.$message.error(res.body.message);
          }
        })
      },
      checkCurrentColumn (obj, event) {
        if (event.target.checked) {
          this.tableData.map(item => {
            if (item[item.id][obj.$index - 1].status != 2) {
              item[item.id][obj.$index - 1].status = 1;
            }
          });
        } else {
          this.tableData.map(item => {
            if (item[item.id][obj.$index - 1].status != 2) {
              item[item.id][obj.$index - 1].status = 0;
            }
          });
        }
      },
      checkAuto (obj, event) {
        if (event.target.checked) {
          this.tableData.map(item => {
            item.auto_free_status = 1;
          });
        } else {
          this.tableData.map(item => {
            item.auto_free_status = 0;
          });
        }
      },
      checkState (obj, event) {
        if (event.target.checked) {
          this.tableData.map(item => {
            item.reach_country_status = 1;
          });
        } else {
          this.tableData.map(item => {
            item.reach_country_status = 0;
          });
        }
      },

      sheetRender(h, obj) {
        let self = this;
        return h('el-checkbox', {
          on: {
            change: (event) => {
              self.checkCurrentColumn(obj, event);
            }
          },
        }, obj.column.columnKey)
      },
      autoRender (h, obj) {
        let self = this;
        return h('el-checkbox', {
          on: {
            change: (event) => {
              self.checkAuto(obj, event);
            }
          },
        }, obj.column.columnKey)
      },

      stateRender (h, obj) {
        let self = this;
        return h('el-checkbox', {
          on: {
            change: (event) => {
              self.checkState(obj, event);
            }
          },
        }, obj.column.columnKey)
      },


      wCodeChange (option) {
//        console.log(option);
        this.tableHeader = {};
        this.tableData = [];
      }
    }
  }

</script>


<style lang="less" scoped>
  .wareCountryLogistics .el-table__body-wrapper {
    height: 480px;
    width: 1600px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .footer {
    margin-top: 10px;
  }

  .item-label {
    width: 100%;
    height: 100%;
    display: inline-block;

  &.disabled {
    cursor: not-allowed;
  }

  }
</style>


