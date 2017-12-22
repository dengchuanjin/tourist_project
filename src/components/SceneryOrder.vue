<template>
  <section id="wrap">
    <h1 class="userClass">导游预约信息</h1>
    <!--工具条-->
    <el-col :span="24" class="formSearch">
      <el-form :inline="true" :model="userSearch">
        <el-form-item>
          <span>预约用户筛选:</span>
        </el-form-item>
        <el-form-item>
          <el-input v-model="userSearch.value" placeholder="预约用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="guiderOrderAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table
      v-loading="listLoading"
      highlight-current-row
      :data="sceneryOrderInfoList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="预约用户编码:">
              <span>{{ props.row.bg_UserID }}</span>
            </el-form-item>
            <el-form-item label="预约用户:">
              <span>{{ props.row.bg_UserName }}</span>
            </el-form-item>
            <el-form-item label="预约导游名称:">
              <span>{{ props.row.bg_GuiderName }}</span>
            </el-form-item>
            <el-form-item label="预约开始时间:">
              <span>{{ props.row.bg_BookFromTime }}</span>
            </el-form-item>
            <el-form-item label="预约结束时间:">
              <span>{{ props.row.bg_BookEndTime }}</span>
            </el-form-item>
            <el-form-item label="支付金额:">
              <span>{{ props.row.bg_PayMoney + "元"}}</span>
            </el-form-item>
            <el-form-item label="支付方式:">
              <span>{{ props.row.bg_PayWay }}</span>
            </el-form-item>
            <el-form-item label="创建预约时间:">
              <span>{{ props.row.bg_CreateTime }}</span>
            </el-form-item>
            <el-form-item label="支付时间:">
              <span>{{ props.row.bg_PayTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="预约用户编码"
        prop="bg_UserID">
      </el-table-column>
      <el-table-column
        label="预约用户"
        prop="bg_UserName">
      </el-table-column>
      <el-table-column
        label="预约导游名称"
        prop="bg_GuiderName">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="SceneryOrderEdit(scope.row.bg_UserID)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="SceneryOrderDelete(scope.row.bg_UserID)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="5"
        layout="total, prev, pager, next"
        :total="total"
        v-show="total"
        style="float:right;"
      >
      </el-pagination>
    </el-col>

    <!--添加预约导游-->
    <el-dialog title="添加预约导游" :visible.sync="addSceneryOrderDialog">
      <el-form :model="AddSceneryOrderType">
        <el-form-item label="导游编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddSceneryOrderType.UserID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="导游名称" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="AddSceneryOrderType.UserName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="预约开始时间" :label-width="formLabelWidth" :required="isOff">
          <el-date-picker
            v-model="AddSceneryOrderType.BookFromTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预约结束时间" :label-width="formLabelWidth" :required="isOff">
          <el-date-picker
            v-model="AddSceneryOrderType.BookEndTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付时间" :label-width="formLabelWidth" :required="isOff">
          <el-date-picker
            v-model="AddSceneryOrderType.PayTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSceneryOrderDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSceneryOrderDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改预约导游-->
    <el-dialog title="修改预约导游" :visible.sync="updateSceneryOrderDialog">
      <el-form :model="sceneryOrderObj">
        <el-form-item label="预约编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="sceneryOrderObj.bg_Code" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="预约用户名称" :label-width="formLabelWidth" :required="isOff">
          <el-autocomplete
            v-model="sceneryOrderObj.bg_GuiderName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入预约用户名称"
            @select="updateSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="预约开始时间" :label-width="formLabelWidth" :required="isOff">
          <el-date-picker
            v-model="sceneryOrderObj.bg_BookFromTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预约结束时间" :label-width="formLabelWidth" :required="isOff">
          <el-date-picker
            v-model="sceneryOrderObj.bg_BookEndTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付方式" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="sceneryOrderObj.bg_PayWay" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateSceneryOrderDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateSceneryOrderDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: '',
    data() {
      return {
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() <= Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        formLabelWidth: '120px',
        isOff: true,
        listLoading: false,
        addSceneryOrderDialog: false,
        updateSceneryOrderDialog: false,
        currentPage1: 1,
        total: 0,
        userSearch: {
          value: '',
        },
        //请求参数
        getData: {
          Code: '',
          UserID: '',
          UserName: '',
          BookFromTimefrom: '',
          BookFromTimeto: '',
          BookEndTimefrom: '',
          BookEndTimeto: '',
          GuiderCode: '',
          GuiderName: '',
          PayMoneyfrom: '',
          PayMoneyto: '',
          PayWay: '',
          CreateTimefrom: '',
          CreateTimeto: '',
          PayTimefrom: '',
          PayTimeto: '',
          IsDelete: '',
          PageNum: 1,
          Rows: 5,
        },
        //添加参数
        AddSceneryOrderType: {
          UserID: '',
          UserName: '',
          BookFromTime: '',
          BookEndTime: '',
          GuiderCode: '',
          GuiderName: '',
          PayTime: '',
          SellID: '',
          SellName: ''
        },
        UpdateBookGuider: {
          Code: '',
          UserID: '',
          UserName: '',
          BookFromTime: '',
          BookEndTime: '',
          GuiderCode: '',
          GuiderName: '',
          PayWay: '',
          IsDelete: ''
        }
    }
    },
    computed: mapGetters([
      'sceneryOrderInfoList',
      'sceneryOrderObj'
    ]),
    methods: {
      loadAll(page,name){
       let getData ={
            Code:'',
            Name:name?name:'',
            SceneryID:'',
            SceneryName:'',
            Telephone:'',
            Sex:'',
            DoYears:'',
            CertNo:'',
            HeadImage:'',
            Feefrom:'',
            Feeto:'',
            CreateTimefrom:'',
            CreateTimeto:'',
            IsFree:'',
            IsDelete:'',
            Remark:'',
            PageNum:page,
            Rows:5,
            search:true
        }

        return new Promise((relove,reject)=>{
          this.$store.dispatch('getGuiderInfoList',getData)
            .then(data=>{
              relove(data)
            }, err => {
              this.$message({
                showClose: true,
                message: err,
                type: 'error'
              });
            })
        })

      },
      querySearchAsync(queryString, cb){
        this.loadAll(1,queryString).then(arr=>{
          var data = arr.map(item => {
            return {
              id: item.gi_Code,
              value: item.gi_Name
            }
          })
          this.restaurants = data
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(this.restaurants);
          }, 10);
        })
      },
      updateSelect(item){
        console.log(item)
        this.sceneryOrderObj.GuiderCode = item.id;
        this.sceneryOrderObj.GuiderName = item.value;
      },
      //分页
      handleCurrentChange(num) {
        this.initData(num)
      },
      //初始化
      initData(num) {
        this.getData.PageNum = '' + num;
        this.getData.UserName = this.userSearch.value.trim();
        this.listLoading = true;
        this.$store.dispatch('getSceneryOrderInfoList', this.getData)
          .then(total => {
            this.total = total;
            this.listLoading = false;
          }, err => {
            this.$message({
              showClose: true,
              message: err,
              type: 'error'
            });
          })
      },
      //查询
      search() {
        this.initData(1);
      },
      //添加
      guiderOrderAdd() {
        this.addSceneryOrderDialog = true;
        this.$store.commit('setTranstionFalse');
      },
      //添加提交
      addSceneryOrderDialogSubmit() {
        if (this.AddSceneryOrderType.UserID.trim() == ''
          || this.AddSceneryOrderType.UserName.trim() == ''
          || this.AddSceneryOrderType.BookFromTime == ''
          || this.AddSceneryOrderType.BookEndTime == ''
          || this.AddSceneryOrderType.PayTime == ''
        ) {
          this.$message({
            showClose: true,
            message: '输入内容不能为空！',
            type: 'error'
          });
          return;
        }
        if (isNaN(this.AddSceneryOrderType.UserID)) {
          this.$message({
            showClose: true,
            message: '输入编号不是数字！',
            type: 'error'
          });
          return;
        }
        this.$store.dispatch('AddGuide', this.AddSceneryOrderType)
          .then((total) => {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            })
            this.initData(1)
          }, err => {
            this.$message({
              showClose: true,
              message: err,
              type: 'error'
            });
          })
        this.addSceneryOrderDialog = false;
      },
      //修改
      SceneryOrderEdit(id) {
        this.updateSceneryOrderDialog = true;
        this.$store.commit('setTranstionFalse');
        this.$store.commit('setSceneryOrderObj', id);
      },
      //修改提交
      updateSceneryOrderDialogSubmit() {
        this.$store.dispatch('modifyGuide',{
          Code: this.sceneryOrderObj.bg_Code,
          UserID:  this.sceneryOrderObj.bg_UserID,
          UserName:  this.sceneryOrderObj.bg_UserName,
          BookFromTime:  this.sceneryOrderObj.bg_BookFromTime,
          BookEndTime:  this.sceneryOrderObj.bg_BookEndTime,
          GuiderCode:  this.sceneryOrderObj.GuiderCode,
          GuiderName:  this.sceneryOrderObj.GuiderName,
          PayWay:  this.sceneryOrderObj.bg_PayWay,
          IsDelete: 0
        })
          .then(()=>{
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              });
              this.initData(1);
          },err=>{
            this.$message({
              showClose: true,
              message: err,
              type: 'error'
            })
          })
        this.updateSceneryOrderDialog = false;
      },
      //删除导游预约表
      SceneryOrderDelete(id) {
        this.$store.dispatch('deleteGuide', id)
          .then(()=>{
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.total = 0;
            this.initData(1);
          })
      }
    },
  }

</script>
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  #wrap {
    background: #fff;
  }

  .formSearch {
    padding: 20px 0 0 20px;
  }

  .userClass {
    padding: 20px 0 0 20px;
    font-size: 18px;
  }

</style>
