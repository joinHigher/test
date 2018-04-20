<template>
  <div>
    <!--产品分类弹窗-->
    <el-dialog :title="categoryForm.title" v-model="categoryForm.categoryDialog" class="log-group" size="small" :before-close="categoryDialogCancel">
      <el-form :model="categoryForm" label-width="50px">
        <el-form-item>
          <el-checkbox v-model="categoryForm.checkbox" @change="categoryAll">全选</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-tree :data="categoryForm.categoryList" :show-checkbox="true" default-expand-all node-key="id" ref="categoryTree" highlight-current
                   :props="categoryForm.defaultProps"  class="category-Tree" v-loading="loading">
          </el-tree>
        </el-form-item>
        <el-form-item>
          <div class="text-right footer">
            <el-button type="primary" @click="categoryDialogSave">确定</el-button>
            <el-button type="danger"  @click="categoryDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
  import Vue from 'vue'
  import logistics from '../js/logistics'
  Vue.use(logistics);

  export default {
    name: 'categorySelect',
    props: ['categoryForm'],
    data (){
      return {
         loading: false
      }
    },
    created (){

    },
    methods: {
      init (){
          this.loading = true;
          this.categoryForm.categoryList = this.getCategory();
          setTimeout(() => {
            this.$refs.categoryTree.setCheckedKeys(this.categoryForm.itemIdSelected);
            this.loading = false;
          },2000);
      },

      categoryAll (){
        let isChecked = this.categoryForm.checkbox;
        isChecked ? this.$refs.categoryTree.setCheckedNodes(this.categoryForm.categoryList)
                  : this.$refs.categoryTree.setCheckedNodes([]);
      },

      categoryDialogSave (){
        this.categoryForm.itemSelected = [];
        this.categoryForm.itemSelected = this.$refs.categoryTree.getCheckedNodes();
        /*if (this.categoryForm.itemSelected.length ===0) {
          this.$message.error('请选择产品分类！');
          return false;
        }*/
        this.categoryForm.itemIdSelected = [];
        this.categoryForm.itemSelected.forEach( item => {
            this.categoryForm.itemIdSelected.push(item.categoryMultiLang.categoryId);
        });
        this.categoryDialogCancel();
      },

      categoryDialogCancel (){
        this.categoryForm.categoryDialog = false;
        this.$refs.categoryTree.setCheckedNodes([]);
        this.categoryForm.checkbox = false;
      },
    }, //methods end
  }
</script>

<style lang="less">
  .category-Tree {
    height: 600px !important;
    overflow-y: auto !important;
    margin-bottom:10px;
  }
</style>
