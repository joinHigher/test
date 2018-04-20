<style>
    .user-table {border:1px solid #e0e6ed;}
    .user-table td {border:1px solid #e0e6ed;height: 40px;padding: 0 18px;}
    .date-item .el-date-editor {width: 441px;}
</style>
<template>
	<div>
        <el-breadcrumb separator="/" class="el-container top">
            <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/notice/siteMailList'}">通知管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/notice/siteMailList'}">站内信</el-breadcrumb-item>
            <el-breadcrumb-item>站内信编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="el-container">
            <el-form :model="tableData" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="站内信类型">
                            <el-select v-model="tableData.type" @change="changeType" disabled>
                                <el-option label="管理员通知" :value="1 * 1"></el-option>
                                <el-option label="系统消息" :value="0 * 1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="唯一识别码" v-show="!noteType">
                            <el-select v-model="tableData.uuqid">
                                <el-option v-for="(item, index) in uuqidList" :label="item" :value="index" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标题">
                            <el-input v-model="tableData.title"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="tableData.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发送时间" v-show="noteType" class="date-item">
                            <el-date-picker v-model="tableData.send_time" type="date"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="内容">
                            <el-input type="textarea" v-model="tableData.content" :rows="9"></el-input>
                        </el-form-item>
                        <el-form-item class="text-center">
                            <el-button type="primary" @click="prevDialog = true">预览</el-button>
                            <el-button type="primary" @click="edit" v-loading="editLoading">编辑</el-button>
                            <el-button type="danger" @click="goback">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>    
        </div>
        <!-- 弹窗S -->
        <el-dialog title="预览" v-model="prevDialog" size="normal">
            <div v-html="tableData.content" class="prew-mail"></div>
        </el-dialog>
        <!-- 弹窗E -->
	</div>
</template>

<script>

export default {
  	data () {
		return {
            editLoading: false,
            tableData: {
                id: this.$route.query.id,
                type: '',
                uuqid: '',
                title: '',
                content: '',
                send_time: '',
                remark: ''
            },
            noteType: 0,
            uuqidList: {},
            prevDialog: false,
		};
  	},
	created () {
        this.getUuqid();
        this.getData();
	},
    methods: {
        getUuqid () {
            this.$http.get('admin/message-template/get-uuqids').then(res => {
                if (res.body.code === 0) {
                    this.uuqidList = res.body.data;
                }
            });
        },
        getData () {
            this.$http.get('admin/message-template/info', {params: {id: this.$route.query.id}}).then(res => {
                if (res.body.code === 0) {
                    this.tableData = res.body.data;
                }
            });
        },
        edit () {
            if (typeof this.tableData.send_time === 'object' && this.tableData.send_time != '') {
                this.tableData.send_time = this.fomart(this.tableData.send_time);
            }

            this.editLoading = true;
            this.$http.post('admin/message-template/edit', this.tableData).then(res => {
                this.editLoading = false;
                if (res.body.code === 0) {
                    this.$message({
                      message: res.body.message,
                      type: 'success'
                    });
                    history.back();
                } else {
                    this.$message.error(res.body.message);
                }
            });
        },
        changeType (val) {
            this.noteType = val;
        },
        fomart (date) {
            if (!date) {
                return '';
            } else {
               var str = '',
                    year = date.getFullYear(),
                    mouth = date.getMonth() + 1,
                    day = date.getDate(),
                    hour = date.getHours(),
                    min = date.getMinutes(),
                    second = date.getSeconds(),
                    flag1 = '-',
                    flag2 = ':';

                    if (mouth < 10) {
                        mouth = '0' + mouth;
                    };
                    if (day < 10) {
                        day = '0' + day;
                    };
                    if (hour < 10) {
                        hour = '0' + hour;
                    };
                    if (min < 10) {
                        min = '0' + min;
                    };
                    if (second < 10) {
                        second = '0' + second;
                    };

                    str = year + flag1 + mouth + flag1 + day + ' ' + hour + flag2 + min + flag2 + second;
                return str;
            }
        },
        goback () {
            history.back();
        }
    }
}
</script>