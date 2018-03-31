<style>

</style>
<template>
    <div>
        <div class="el-container top">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/showcase/bannerList' }">橱窗位管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑楼层</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="el-container">
            <el-form v-for="(item, index) in tableData" :key="index" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item  label="楼层名">
                            <el-input v-model="item.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="楼层属性">
                            <el-select v-model="item.attribute">
                                <el-option v-for="(option, index) in propOpt" :key="index" :label="option" :value="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-button type="primary" icon="plus" @click="additem"></el-button>
                        <el-button type="primary" @click="postEdit(item)">保存</el-button>
                        <el-button type="danger"  @click="removeitem(item)">删除</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 弹窗S -->
        
        <!-- 弹窗E -->
    </div>
</template>

<script>

export default {
    data () {
        return {
            propOpt: [],
            option: {
                language: '',
                platform: ''
            },
            tableData: [{name: '',attribute: ''}]
        };
    },
    created () {
        this.$store.commit('admin/setRouterIndex', '/showcase/floorList');
        this.getProp();
        this.getData();
        
    },
    methods: {
        getData () {
            this.option = {
                    language: this.$route.query.language,
                    platform: this.$route.query.platform
                };
            this.$http.get('admin/floor/info', {params: this.option}).then(res => {
                if (res.body.code == 0) {
                    if (res.body.data.length > 0) {
                        this.tableData = res.body.data;
                    }
                }
            })
        },
        getProp () {
            this.$http.get('admin/floor/get-attributes').then(res => {
                if (res.body.code == 0) {
                    this.propOpt = res.body.data;
                } 
            })
        },
        additem () {
            this.tableData.push({
                name: '',
                attribute: ''
            });
        },
        postEdit (item) {
            this.option.id = item.id || '';
            this.option.attribute = item.attribute;
            this.option.name = item.name;
            this.$http.post('admin/floor/edit', this.option).then(res => {
                if (res.body.code === 0) {
                    this.$message({
                        type: 'success',
                        message: res.body.message
                    });
                } else {
                    this.$message.error(res.body.message);
                }
            }) 
        },
        removeitem (item) {
            var index = this.tableData.indexOf(item);

            if (this.tableData.length === 1) {
                this.$message({
                    type: 'warning',
                    message: '最后一项无法删除！'
                });
            } else {
                if (typeof item.id !== 'undefined') {
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '确认删除', {
                        type: 'warning'
                    }).then(() => {
                        this.$http.post('floor/delete', {id: item.id}).then(res=> {
                            if (res.body.code === 0) {
                                this.tableData.splice(index, 1)
                                
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
                            message: '已取消删除'
                        });          
                    });
                } else {
                    this.tableData.splice(index, 1);
                }
            }
        }

    }
}
</script>


