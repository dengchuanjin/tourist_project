<template>
  <section id="wrap">
    <h1 class="userClass">注销导游明细</h1>
    <!--工具条-->
    <el-col :span="24" class="formSearch">
      <el-form :inline="true" :model="userSearch">
        <el-form-item>
          <span>注销明细筛选:</span>
        </el-form-item>
        <el-form-item>
          <el-input v-model="userSearch.value" placeholder="注销导游编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="guiderOrderAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--查询-->
    <el-table
      v-loading="listLoading"
      :data="queryDeleteGuide"
      highlight-current-row
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="注销编号:">
              <span>{{ props.row.cg_Code }}</span>
            </el-form-item>
            <el-form-item label="注销时间:">
              <span>{{ props.row.cg_Time }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="注销导游编号"
        prop="cg_GuiderCode">
      </el-table-column>
      <el-table-column
        label="注销原因"
        prop="cg_Reason">
      </el-table-column>
      <el-table-column
        label="是否删除">
        <template slot-scope="scope">
          {{scope.row.cg_IsDelete==0?"未删除":"已删除"}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="UpdateDeleteGuide(scope.row.cg_Code)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="DeleteGuide(scope.row.cg_Code)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条 分页-->
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

    <!--添加注销导游明细-->
    <el-dialog title="添加注销导游明细" :visible.sync="addSceneryOrderDialog">
      <el-form :model="addDeleteGuide">
        <el-form-item label="注销导游编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="addDeleteGuide.GuiderCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注销原因" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="addDeleteGuide.Reason" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSceneryOrderDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSceneryOrderDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改注销导游明细-->
    <el-dialog title="修改注销导游明细" :visible.sync="updateSceneryOrderDialog">
      <el-form :model="updateDeleteGuideObj">
        <el-form-item label="预约编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="updateDeleteGuideObj.cg_Code" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="注销导游编号" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="updateDeleteGuideObj.cg_GuiderCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注销原因" :label-width="formLabelWidth" :required="isOff">
          <el-input v-model="updateDeleteGuideObj.cg_Reason" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否删除" :label-width="formLabelWidth"  :required="isOff">
          <el-select v-model="updateDeleteGuideObj.cg_IsDelete" placeholder="请选择是否删除">
            <el-option label="未删除" value="0"></el-option>
            <el-option label="已删除" value="1"></el-option>
          </el-select>
          <span style="color: green"><span style="color: #f60">温馨提示:</span>(0:未删除;1:已删除)</span>
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
    computed: mapGetters([
      'queryDeleteGuide',
      'updateDeleteGuideObj'
    ]),
    data() {
      return {
        userSearch: {
          value: '',
        },
        formLabelWidth: '120px',
        isOff: true,
        addSceneryOrderDialog: false,
        listLoading: false,
        updateSceneryOrderDialog: false,
        total: 0,
        currentPage1: 1,
        //查询参数
        searchDeleteGuide: {
          Code: '',
          GuiderCode: '',
          Reason: '',
          Timefrom: '',
          Timeto: '',
          IsDelete: 0,
          PageNum: 1,
          Rows: 5
        },
        addDeleteGuide:{
          GuiderCode:'',
          Reason:''
        }
      }
    },
    methods: {
      //分页
      handleCurrentChange(num) {
        this.initSearch(num)
      },
      //初始化查询
      initSearch(num) {
        this.searchDeleteGuide.PageNum = '' + num;
        this.searchDeleteGuide.GuiderCode = this.userSearch.value.trim();
        this.listLoading = true;
        this.$store.dispatch('queryDeleteGuide', this.searchDeleteGuide)
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
        this.initSearch(1);
      },
      //添加
      guiderOrderAdd() {
        this.addSceneryOrderDialog = true;
        this.$store.commit('setTranstionFalse');
      },
      addSceneryOrderDialogSubmit(){
        if( this.addDeleteGuide.GuiderCode == '' ){
          this.$message({
            showClose: true,
            message: '注销导游编号不能为空！',
            type: 'error'
          });
          return;
        }
        this.$store.dispatch('addDeleteGuideDetailed',this.addDeleteGuide)
          .then(()=>{
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            });
            this.initSearch(1);
          },err=>{
            this.$message({
              showClose: true,
              message: err,
              type: 'error'
            });
          })
        this.addSceneryOrderDialog = false;
      },
      //修改注销导游明细
      UpdateDeleteGuide(code){
        this.updateSceneryOrderDialog = true;
        this.$store.commit('setTranstionFalse');
        this.$store.commit('setDeleteGuideObj', code);
      },
      updateSceneryOrderDialogSubmit(){
        if(this.updateDeleteGuideObj.cg_GuiderCode.trim() == ''){
          this.$message({
            showClose: true,
            message: '注销导游编号不能为空！',
            type: 'error'
          });
          return;
        }
        if(this.updateDeleteGuideObj.cg_Reason.trim() == ''){
          this.$message({
            showClose: true,
            message: '注销原因不能为空！',
            type: 'error'
          });
          return;
        }
        this.$store.dispatch('updateDeleteGuideDetailed',{
          Code:this.updateDeleteGuideObj.cg_Code,
          GuiderCode:this.updateDeleteGuideObj.cg_GuiderCode,
          Reason:this.updateDeleteGuideObj.cg_Reason,
          IsDelete:this.updateDeleteGuideObj.cg_IsDelete
        })
          .then(()=>{
            this.$message({
              showClose: true,
              message: '修改成功！',
              type: 'success'
            });
            this.initSearch(1);
          })
        this.updateSceneryOrderDialog = false;
      },
      //删除注销导游明细
      DeleteGuide(id){
        this.$store.dispatch('deleteGuideDelete', id)
          .then(()=>{
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.total = 0;
            this.initSearch(1);
          })
      }
    }

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
    background: #fff;
    padding: 20px 0 0 20px;
  }

  .userClass {
    padding: 20px 0 0 20px;
    font-size: 18px;
  }
</style>
