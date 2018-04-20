<template>
  <div>
    <!--礼品卡管理-->
    <div class="el-container">
      <el-form label-width="80px" inline :model="option" ref="searchForm">
        <el-form-item label="卡号" prop="giftCardSn">
          <el-input v-model="option.giftCardSn"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="createUserName">
          <el-input v-model="option.createUserName"></el-input>
        </el-form-item>
        <el-form-item label="有效日期" prop="validDate">
          <!--<el-date-picker v-model="validDate" type="datetimerange" :editable="false"></el-date-picker>-->
              <el-date-picker v-model="validDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="cardStatus">
          <el-select v-model="option.cardStatus" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in cardStatusList" :key="index" :value="item.code" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn-ml">
          <el-button type="primary" @click="searchData">搜索</el-button>
        </el-form-item>
        <el-form-item class="btn-ml">
          <el-button type="primary" @click="newCard">新建礼品卡</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="el-container">
      <el-table ref="multipleTable" border :data="tableData" v-loading="tableLoading">
        <el-table-column prop="giftCardSn" label="卡号" align="center"></el-table-column>
        <el-table-column prop="cardAmount" label="面值" align="center"></el-table-column>
        <el-table-column prop="availableAmount" label="余额" align="center"></el-table-column>
        <el-table-column prop="expireTime" label="有效期" align="center">
          <template scope="scope">
              {{self.unixFormat(scope.row.expireTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <el-button type="primary" @click="details(scope.row.giftCardSn)">查看</el-button>
            <el-button type="danger" @click="removeItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="el-container last text-right">
      <el-pagination @size-change="ChangePageSize" @current-change="ChangePage" :current-page="option.pageNo" :page-sizes="[10, 20, 50]" :page-size="option.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!--弹窗 s-->

    <!--新建礼品卡弹窗-->
    <el-dialog v-model="newGiftCardDialog" size="tiny" title="新建礼品卡" :before-close="newGiftCardDialogClose">
      <el-form ref="newCardForm" :model="newCardForm"  :rules="newCardFormRules" label-width="80px">
        <el-form-item label="金额" prop="cardAmount">
          <el-input v-model="newCardForm.cardAmount" :placeholder="maxCardAmountPlaceholder"></el-input>
        </el-form-item>
        <el-form-item label="卡主" prop="email">
          <el-input v-model="newCardForm.email" placeholder="用户Email"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="expireTime">
          <el-date-picker type="date" :placeholder="this.maxExpireTimePlaceholder" v-model="newCardForm.expireTime" style="width: 100%;"
                          :editable="false" format="yyyy 年 MM 月 dd 日" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="激活">
          <el-radio-group v-model="newCardForm.cardStatus">
            <el-radio class="radio" :label="1">是</el-radio>
            <el-radio class="radio" :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="newGiftSave('newCardForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--礼品卡详情弹窗-->
    <el-dialog v-model="cardDetailsDialog" size="small" title="礼品卡详情" :before-close="cardDetailsClose">
      <div class="el-container">
        <table class="cardDetailTable">
          <tbody>
            <tr>
              <td>卡号 : </td><td>{{cardDetails.giftCardSn}}</td>
              <td width="300"></td>
              <td>状态 : </td>
              <td v-if="editBtn">{{cardStatusRL[cardDetails.cardStatus]}}</td>
              <td v-if="confirmBtn">
                <el-select v-model="cardDetails.cardStatus" class="statusSelect">
                  <el-option v-for="(item, index) in cardStatusList" :key="index" :value="item.code" :label="item.name"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>面值 : </td><td>${{cardDetails.cardAmount}}</td>
              <td width="300"></td>
              <td>创建人 : </td><td>{{cardDetails.createUserName}}</td>
            </tr>
            <tr>
              <td>余额 : </td><td>${{cardDetails.availableAmount}}</td>
              <td width="300"></td>
              <td>有效期 : </td>
              <td v-if="editBtn"> {{this.cardValidity}} </td>
              <td v-if="confirmBtn">
                 <el-date-picker type="date" placeholder="选择日期" v-model="cardValidity" :editable="false"
                                 @change="cardValidityChange(cardValidity)"></el-date-picker>
              </td>

            </tr>
            <tr>
              <td>卡主 : </td>
              <td v-if="editBtn">{{this.cardUserEmail}}</td>
              <td v-if="confirmBtn">
                  <el-input v-model="cardUserEmail"></el-input>
              </td>
              <td width="300"></td>
              <td>创建时间 : </td>
              <td>{{self.unixFormat(cardDetails.createTime)}}</td>
            </tr>
          </tbody>
        </table>
        <div class="edit-button">
          <el-button type="primary" v-if="editBtn" @click="edit">编辑</el-button>
          <el-button type="primary" v-if="confirmBtn" @click="confirm">确定</el-button>
        </div>
        <div class="transRecord">
          <h3>交易明细</h3>
          <el-table ref="multipleTable" border :data="transRecordTableData" v-loading="transRecordLoading">
            <el-table-column prop="billSn" label="交易单号" align="center"></el-table-column>
            <el-table-column prop="chargeTime" label="交易时间" align="center" width="116px">
              <template scope="scope">
                {{self.timeZone_(scope.row.chargeTime, self.$store.getters.getTimeZone)}}
              </template>
            </el-table-column>
            <el-table-column label="交易类型" align="center">
                <template scope="scope">
                     {{billTypeList[scope.row.billType]}}
                </template>
            </el-table-column>
            <el-table-column prop="chargeAmount" label="变动金额" align="center"></el-table-column>
            <el-table-column prop="availableAmount" label="余额" align="center" width="90px"></el-table-column>
            <el-table-column prop="parentOrderSn" label="联合订单号" align="center"></el-table-column>
            <el-table-column prop="transactionId" label="关联付款单号" align="center"></el-table-column>
          </el-table>
          <div class="text-right arrow-keys">
             <el-button type="primary" @click="prevPage">上一页</el-button>
             <el-button type="primary" @click="nextPage">下一页</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--弹窗 e-->
  </div>
</template>

<script>
  export default {
      data (){
          let that = this;

          let checkCardAmount = (rule, val, callback) => {
            let reg = /^\+?[1-9]\d*$/;
            let num = parseInt(val);
            if (!reg.test(val) || isNaN(num) || num > this.maxCardAmount) {
              return callback(new Error('礼品卡金额为大于0且不超过 ' + this.maxCardAmount + '的整数'));
            }
            callback();
          };

          return {
            self: this,
            tableLoading: false,
            option: {
              giftCardSn: '', //卡号
              createUserName: '', //创建人姓名
              expireTimeStart: '', //到期时间 - 起始
              expireTimeEnd: '', //到期时间 - 结束
              cardStatus: '', //状态
              pageNo: 1,
              pageSize: 10,
            },
            total: 10,
            validDate:  '',
            cardStatusList: [
              {code: 0, name: '未激活'},
              {code: 1, name: '激活'},
            ],
            //礼品卡状态 返回结果
            cardStatusRL: ['未激活', '激活'],
            tableData: [],
            //新建礼品卡 参数
            newGiftCardDialog: false,
            newCardForm: {
              email: '',
              cardAmount: '',
              cardStatus: 1, //新建礼品卡 是否激活
              expireTime: '' //新建礼品卡 有效期
            },
            newCardFormRules: {
              cardAmount: [{ required: true, validator: checkCardAmount, trigger: 'blur' }],
              email: [{ type: 'email', required: true, message: '请输入有效邮箱', trigger: 'blur'}],
              expireTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }]
            },

            cardDetailsDialog: false,
            cardDetailsLoading: false,
            cardDetails: {},
            editBtn: true,
            confirmBtn: false,
            transRecordTableData: [],
            transRecordLoading: false,
            currentGiftCardSn: '', //当前选择的卡号
            transRecordTotalCount: '',
            transRecordPageSize: 5,
            transRecordPageNo: 1,
            billTypeList: ['创建礼品卡','礼品卡支付','电子钱包支付','电子钱包退款入账'],
            cardValidity: '', //有效期
            cardUserEmail: '',//用户email
            maxCardAmount: '', // 最大礼品卡面额
            maxExpireTime: '', //最大有效期（单位：年）
            maxExpireTimeUnix: '',
            maxExpireTimeFormat: '',
            maxCardAmountPlaceholder: '',
            maxExpireTimePlaceholder: '',
            pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > new Date(that.maxExpireTimeFormat);
                },
            },
          }
      },
    created (){
          this.cardSetting();
          this.getData();
    },
    methods: {
      //获得新建礼品卡金额上限和有效期上限
      cardSetting (){
          this.$http.get('pay/card/setting').then( res => {
              if (res.body.code === 0) {
                  this.maxCardAmount = res.body.data.maxCardAmount;
                  this.maxExpireTime = res.body.data.maxExpireTime;
                  this.maxCardAmountPlaceholder = '不能超过' + this.maxCardAmount + '美元';

                  let t = new Date();
                  this.maxExpireTimeUnix = this.formatTime(t.setFullYear(t.getFullYear()+2));
                  this.maxExpireTimeFormat = this.unixFormat(this.maxExpireTimeUnix);
                  this.maxExpireTimePlaceholder = '时间不能超过' + this.maxExpireTimeFormat;
              } else {
                  this.$message.error(res.body.message);
              }
          });
      },

      getData (){
        if(this.validDate && this.validDate.length > 0){
          let timeArr = this.timeZone_(this.validDate, this.$store.getters.getTimeZone);
          if(Array.isArray(timeArr) && timeArr.length>0){
            this.option.expireTimeStart = timeArr[0];
            this.option.expireTimeEnd = timeArr[1] + 86399;
          }
        }
        //console.log(this.option);
        this.tableLoading = true;
        this.tableData = [];
        this.$http.get('pay/card/list', {params: this.option}).then(res => {
          this.tableLoading = false;
          if (res.body.code !== 0) {
              this.tableData =[];
              this.total = 0;
              this.$message.error(res.body.message);
          }
          if (res.body.code === 0 && res.body.data.list) {
              this.tableData = res.body.data.list;
              this.total = res.body.data.totalCount;
          } else {
            this.tableData =[];
            this.total = 0;
          }
        });
      },

      searchData (){
          this.getData();
          this.option.pageNo = 1;
      },

      ChangePageSize (val) {
        this.option.pageSize = val;
        this.getData();
      },
      ChangePage (val) {
        this.option.pageNo = val;
        this.getData();
      },

      removeItem (row){
          this.$confirm('是否删除该项?', '提示', {
            type: 'warning'
          }).then(() => {
            this.$http.post('pay/card/delete', {giftCardSn: row.giftCardSn}).then(res => {
              if (res.body.code === 0) {
                let index = this.tableData.indexOf(row);
                this.tableData.splice(index, 1);
                this.total--;
                this.$message({
                  type: 'success',
                  message: '删除成功！'
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
          })
      },

      details (giftCardSn){
        this.cardDetailsDialog = true;
        this.cardDetailsLoading = true;
        this.currentGiftCardSn = giftCardSn;
        this.$http.get('pay/card/info',{params: {giftCardSn: giftCardSn}}).then( res => {
            this.cardDetailsLoading = false;
            //console.log(res.body.data);
            if (res.body.code === 0) {
                this.cardDetails = res.body.data;
                this.cardValidity = this.unixFormat(this.cardDetails.expireTime);
                this.getEmailById(this.cardDetails.userId);
            } else {
                this.$message.error(res.body.message);
            }
        });
        this.getTransRecord();
      },

      //unix时间戳转换成 yyyy-mm-dd
      unixFormat (u){
          let t = (new Date(u * 1000));
          let y = t.getFullYear();
          let m = t.getMonth() + 1;
          let d = t.getDate();
          let gap = '-';
          if (m<10) {
              m = '0' + m;
          }
          if (d<10) {
              d = '0' + d;
          }
          return y + gap + m + gap + d;
      },
      //有效期改变
      cardValidityChange (cardValidity){
          let t = cardValidity;
          let y = t.getFullYear();
          let m = t.getMonth() + 1;
          let d = t.getDate();
          let gap = '-';
          if (m<10) {
            m = '0' + m;
          }
          if (d<10) {
            d = '0' + d;
          }
          this.cardValidity = y + gap + m + gap + d;
      },
      //通过用户ID找Email
      getEmailById (id){
          this.$http.get('user/index/info',{params:{userId: id}}).then( res => {
              if (res.body.code === 0) {
                  this.cardUserEmail = res.body.data.email;
              } else {
                  this.cardUserEmail = "";
                  this.$message.error(res.body.message);
              }
          });
      },

      getTransRecord (){
          let params = {
              giftCardSn: this.currentGiftCardSn,
              transRecordPageSize: this.transRecordPageSize,
              transRecordPageNo: this.transRecordPageNo
          };
          this.transRecordTableData = [];
          this.transRecordLoading = true;
          this.$http.get('pay/card/use-record', {params: params}).then( res => {
              this.transRecordLoading = false;
              if (res.body.code === 0) {
                  if (res.body.data.list && res.body.data.list.length>0) {
                      this.transRecordTableData = res.body.data.list;
                      this.transRecordTotalCount = res.body.data.totalCount;
                  } else {
                      this.transRecordTableData = [];
                      this.transRecordTotalCount = 0;
                  }
              } else {
                  this.$message.error(res.body.message);
              }

          });
      },

      prevPage (){
          if (this.transRecordPageNo == 1) {
              return false;
          }
          this.transRecordPageNo --;
          this.getTransRecord();
      },

      nextPage (){
          if (this.transRecordPageNo == this.transRecordTotalCount) {
              return false;
          }
          this.transRecordPageNo ++;
          this.getTransRecord();
      },

      edit (){
        this.editBtn = false;
        this.confirmBtn = true;
      },
      //礼品卡修改保存
      confirm (){
        if (!this.cardUserEmail) {
            this.$message.error('卡主不能为空！');
            return false;
        }
        if (!this.cardValidity) {
            this.$message.error('有效期不能为空！');
            return false;
        }
        let reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!reg.test(this.cardUserEmail)) {
            this.$message.error('请输入有效的邮箱格式！');
            return false;
        }
        let params = {
            giftCardSn: this.currentGiftCardSn,
            cardStatus: this.cardDetails.cardStatus,
            email: this.cardUserEmail,
            expireTime: this.formatTime(this.cardValidity),
        };
        this.$http.post('pay/card/edit', params).then( res => {
             console.log(res);
             if (res.body.code === 0) {
                 if (res.body.data) {
                     this.$message.success('保存成功!');
                     this.editBtn = true;
                     this.confirmBtn = false;
                 } else {
                     this.$message.error('保存失败!');
                 }
             } else {
                 this.$message.error(res.body.message);
             }
        });
      },

      cardDetailsClose (){
          this.editBtn = true;
          this.confirmBtn = false;
          this.cardDetailsDialog = false;
      },

      newCard (){
        this.newGiftCardDialog = true;
      },
      newGiftSave (formName){
        let tt = this.formatTime(this.newCardForm.expireTime);
        let params = {
          email: this.newCardForm.email,
          cardAmount: this.newCardForm.cardAmount,
          cardStatus: this.newCardForm.cardStatus,
          expireTime: tt
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$http.post('pay/card/add', params).then( res =>{
                  if (res.body.code === 0) {
                      if (res.body.data) {
                          this.$message.success("新增成功!");
                          this.newGiftCardDialog = false;
                      } else {
                          this.$message.error("新增失败!");
                      }
                  } else {
                      this.$message.error(res.body.message);
                  }
              });
          }
        });
      },
      //时间转换成时间戳
      formatTime (t){
          if (t) {
            let d = new Date(t);
            let currentTime = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + (Number(d.getDate()) + 1);
            let unixTime = Date.parse(new Date(currentTime)) / 1000 - 1;
            return unixTime;
          } else {
              return ""
          }
      },

      newGiftCardDialogClose (){
        this.$refs['newCardForm'].resetFields();
        this.newGiftCardDialog = false;
      }

    },

  }
</script>

<style lang="less">
  .btn-ml{
    margin-left: 40px;
  }
  .cardDetailTable{
    tr{
       height: 36px;
    }
  }
  .edit-button{
    margin-top: 20px;
  }
  .statusSelect{
    height: 30px;
    width: 193px;
  }
  .transRecord{
    margin-top: 30px;
    h3{
      margin-bottom: 10px;
    }
  }
  .arrow-keys{
    margin-top: 20px;
  }

</style>
