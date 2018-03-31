<template>
  <div>
    <el-dialog :title="countryForm.title" v-model="countryForm.countryDialog" class="log-group" size="tiny">
      <el-form :model="countryForm" label-width="40px">
        <el-form-item>
          <el-row>
            <el-col :span="10">
              <el-input v-model="countryForm.key" placeholder="请输入国家名称"></el-input>
            </el-col>
            <el-col :span="5" class="text-right">
              <el-button type="primary" icon="search" @click="searchCountry">搜索</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-table  ref="countryTable"  :data="countryForm.countryList" class="countryTable" @selection-change="handlecountrySelect">
            <el-table-column type="selection" width = '30'></el-table-column>
            <el-table-column prop="code" label="全选" width = '100'></el-table-column>
            <el-table-column prop="name"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div class="text-right margin-top10">
            <el-button type="primary" @click="countrySave">确定</el-button>
            <el-button type="danger"  @click="countryCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: 'countrySelect',
    props: ['countryForm'],
    data (){
        return {
           countrysArrSelected: [],
        }
    },
    created (){


    },

    methods: {
      init (){
          let list = this.countryForm.countryCodesSelected;
          if (list) {
              for (let i = 0; i < list.length; i++) {
                  for (let j = 0; j < this.countryForm.countryList.length; j++) {
                      if (list[i] === this.countryForm.countryList[j].code) {
                          this.$refs.countryTable.toggleRowSelection(this.countryForm.countryList[j], true);
                          break;
                      }
                  }
              }
          }
      },

      searchCountry (){
        let key = this.countryForm.key.trim();
        let searchResult = false;
        if (!key) {
          this.$message.error("请输入国家名称!");
          return false;
        }
        for (let i=0;i<this.countryForm.countryList.length;i++) {
          if (key.toUpperCase() === this.countryForm.countryList[i].name.toUpperCase()) {
            this.$refs.countryTable.toggleRowSelection(this.countryForm.countryList[i]);
            let top =  40 * i - 250;
            $('.countryTable').animate({
              'scrollTop': top
            },500);
            searchResult = true;
            break;
          }
        }
        !searchResult ? this.$message.error("没有找到该国家!") : '';
      },

      handlecountrySelect (val){
        this.countrysArrSelected = val;
      },

      countrySave (){
        let list = this.countrysArrSelected;
        if (list.length === 0) {
          this.$message.error("请选择国家!");
          return false;
        }
        this.countryForm.countryNamesSelected = [];
        this.countryForm.countryCodesSelected = [];
        if (list && list.length>0) {
            list.forEach( item => {
              this.countryForm.countryNamesSelected.push(item.name);
              this.countryForm.countryCodesSelected.push(item.code);
            });
        }
        this.countryForm.countryDialog = false;
      },

      countryCancel (){
        this.countryForm.countryDialog = false;
      },
    },
  }
</script>

<style lang="less">
  .margin-top10{
    margin-top: 10px;
  }
  .countryTable {
    height: 600px;
    overflow-y: auto;
  }
</style>
