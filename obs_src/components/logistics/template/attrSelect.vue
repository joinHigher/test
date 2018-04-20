<template>
  <div>
    <el-dialog :title="attrsForm.title" v-model="attrsForm.attrsDialog" class="log-group" size="small">
      <el-form :model="attrsForm" label-width="50px">
        <el-form-item>
          <el-checkbox v-model="attrsForm.checkbox" @change="attrsFormAll">全选</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-tree :data="attrsForm.attrsList" :show-checkbox="true" default-expand-all node-key="propertyCode" ref="attrsTreeRef"
                   highlight-current :props="attrsForm.defaultProps" class="attrs-tree" v-loading="loading"></el-tree>
        </el-form-item>
        <el-form-item>
          <div class="text-right footer">
            <el-button type="primary" @click="attrsDialogSave">确定</el-button>
            <el-button type="danger"  @click="attrsDialogCancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'attrSelect',
    props: ['attrsForm'],
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
        this.attrsForm.attrsList = this.getAttrs();
        setTimeout(() => {
          this.$refs.attrsTreeRef.setCheckedKeys(this.attrsForm.attrsIdSelected);
          this.loading = false;
        },500);
      },
      attrsFormAll (){
        let isChecked = this.attrsForm.checkbox;
        if (isChecked) {
          this.$refs.attrsTreeRef.setCheckedNodes(this.attrsForm.attrsList);
        } else {
          this.$refs.attrsTreeRef.setCheckedNodes([]);
        }
      },

      attrsDialogSave (){
        let itemChecked = [];
        this.attrsForm.attrsIdSelected = [];
        itemChecked = this.$refs.attrsTreeRef.getCheckedNodes();
        /*if (itemChecked.length===0) {
          this.$message.error('请选择产品性质!');
          return false;
        }*/
        itemChecked.forEach(item => {
          this.attrsForm.attrsIdSelected.push(item.propertyCode);
        });
        //this.option.attr = this.attrsForm.attrsIdSelected.join();
        this.attrsForm.attrsDialog = false;
      },
      attrsDialogCancel (){
        this.attrsForm.attrsDialog = false;
      },

    }, //methods end
  }
</script>

<style lang="less">
  .attrs-tree {
    height: 600px !important;
    overflow-y: auto !important;
    margin-bottom:10px;
  }
  .footer{
    margin-top:20px;
  }
</style>
