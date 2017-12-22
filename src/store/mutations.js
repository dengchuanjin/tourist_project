/**
 * Created by leibo on 17/11/29.
 */
import getters from './getters'

const state = {
	//加载动画
	loadingShow: false,
	//初始化动画
	transtionActive: {
		isActive: false,
		isMove: false
	},
  //导游信息
  guiderInfoList:[],
  //初始化修改导游obj
  guiderEditObj:{},
  //预约用户
  sceneryOrderInfoList:[],
  sceneryOrderObj:{},
  //查询注销导游明细
  queryDeleteGuide:[],
  updateDeleteGuideObj:{},
};

const mutations = {
	//loading动画过渡
	showLoading(state) {
		state.loadingShow = true
	},
	hideLoading() {
		state.loadingShow = false
	},
	//初始化动画
	setTranstionFalse(state) {
		state.transtionActive = {
			isActive: false,
			isMove: false
		}
	},
	oPTranstionFalse() {
		state.transtionActive = {
			isActive: !state.transtionActive.isActive,
			isMove: !state.transtionActive.isMove
		}
	},
  initGuiderInfoList(state,data){
	  state.guiderInfoList = data;
  },
  //修改导游obj
  setGuiderEditObj(state,id){
    state.guiderEditObj = state.guiderInfoList.filter(item=>{
      if(item.gi_Code==id){
        return true;
      }
      return false;
    })[0]
  },
  //删除导游
  GuiderDelete(state,id){
    state.guiderInfoList = state.guiderInfoList.filter(item=>{
      if(item.gi_Code==id){
        return false;
      }
      return true;
    })
  },
  //导游预约用户
  initSceneryOrderInfoList(state,data){
    state.sceneryOrderInfoList = data;
  },
  //修改导游预约用户
  setSceneryOrderObj(state,id){
    state.sceneryOrderObj = state.sceneryOrderInfoList.filter(item=>{
      if(item.bg_UserID==id){
        return true;
      }
      return false;
    })[0]
  },
  //查询注销导游明细
  initQueryDeleteGuide(state,data){
    state.queryDeleteGuide = data;
  },
  //初始化修改注销导游明细
  setDeleteGuideObj(state,code){
    state.updateDeleteGuideObj = state.queryDeleteGuide.filter(item=>{
      if(item.cg_Code==code){
        return true
      }
      return false
    })[0]
  }
}

export default {
	getters,
	state,
	mutations
}
