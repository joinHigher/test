<template>
    <el-dialog title="标签列表" :visible.sync="isShow" size="small" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <el-form :inline="true" :model="tagForm" class="demo-form-inline">
            <el-form-item label="标签属性">
                <el-select v-model="tagForm.labelAttrId" placeholder="请选择属性">
                    <el-option v-for="(item, index) in tagAttr"  :label="item.attrName" :value="item.id" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标签名称">
                <el-input v-model="tagForm.labelName" placeholder="请输入标签名称" @keyup.enter.native="handleSelectTags"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSelectTags"><i class="el-icon-search"></i>筛选</el-button>
            </el-form-item>
        </el-form>
        <div class="tag-contianer">
            <h4>已选择标签：</h4>
            <div class="tag-selected-container tag-child-container">
                <el-tag v-for="tag in selectedTagList" :key="tag" :closable="true" :close-transition="closeTransition" @close="handleClose(tag)"> {{tag.name}} </el-tag>
            </div>
            <h4>常用标签：</h4>
            <div class="tag-commond-container tag-child-container">
                <el-tag v-for="tag in commondTags" :key="tag" :closable="false" :close-transition="closeTransition" @click.native="handleClickTag(tag)"> {{tag.name}} </el-tag>
            </div>
            <h4>搜索结果：</h4>
            <div class="tag-result-container tag-child-container" v-loading="tagForm.isLoading">
                <el-tag v-for="tag in filterResultTags" :key="tag" :closable="false" :close-transition="closeTransition"  @click.native="handleClickTag(tag)"> {{tag.name}} </el-tag>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取 消</el-button>
            <el-button type="primary" @click="handleSearchForTag" >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            closeTransition: {
                type: Boolean,
                default: false
            },
            tagAttr: {
                type: Array,
                default: () => {
                    return []
                }
            },
            selectedTags: {
                type: Array,
                default: () => {
                    return []
                }
            },
            commondTags: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                filterResultTags: [],
                tagForm: {
                    labelAttrId: '',
                    labelName: '',
                    isLoading: false
                },
                selectedTagList: []
            }
        },
        watch: {
            selectedTags: {
                handler(oldVal,newVal){
                    this.selectedTagList = JSON.parse(JSON.stringify(newVal))
                },
                deep: true
            }
        },
        methods: {
            // 标签模糊搜索
            handleSelectTags() {
                this.tagForm.isLoading = true;
                this.$http.get('user/tag/get-by-name-like?labelName=' + encodeURIComponent(this.tagForm.labelName) + '&labelAttrId=' + encodeURIComponent(this.tagForm.labelAttrId)).then(res => {
                    this.tagForm.isLoading = false;
                    if (res.body.code === 0) {
                        this.filterResultTags = res.body.data;
                    } else {
                        this.filterResultTags = [];
                    }
                })
            },
            // 添加标签
            handleClickTag(tag) {
                // console.log(this.selectedTagList)
                if(this.selectedTagList.findIndex((item) => {
                    return item.name === tag.name;
                }) !== -1) {
                    return this.$message.error('已选择！');
                }
                let errorTag = '';
                if(this.selectedTagList.some((item) => {
                    errorTag = item.name;
                    return item.labelTypeId === tag.labelTypeId && item.labelTypeType === 2;
                })){
                    return this.$message.error(`${errorTag}与${tag.name}属于同一分类且不能共存！`);
                }
                this.selectedTagList.push(tag);
            },
            // 删除标签
            handleClose(tag) {
                let index = this.selectedTagList.indexOf(tag);
                this.selectedTagList.splice(index, 1);
                this.$emit('close', tag, index);
            },
            // 确定
            handleSearchForTag() {
                this.$emit('success', JSON.parse(JSON.stringify(this.selectedTagList)));
            },
            // 取消
            cancelDialog() {
                this.$emit('update:isShow', false);
            },
            // 清空已选择标签
            clearSelectedTags() {
                this.selectedTagList = []
            }
        }
    }
</script>

<style lang="less" scoped>
.tag-contianer{
    h4{
        margin: 20px 0;
    }
    .el-tag{
        cursor: pointer;
        margin-right: 10px;
        margin-bottom: 5px;
    }
    .tag-child-container{
        max-height: 200px;
        overflow-y: auto;
    }
}
</style>
