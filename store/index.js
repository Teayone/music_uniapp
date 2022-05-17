import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		//自动播放下一首
		topListIds:[],
		nextId:''
	},
	mutations:{
		//当id数组提交到这里时，将数组保存到state
		INIT_TOPLISTIDS(state,payload){
			state.topListIds = payload
		},
		NEXT_ID(state,payload){
			// 遍历state里的id数组
			for(var i = 0;i<state.topListIds.length;i++){
				//如果数组中的某一项id 和 提交过来的id相等时，将下一首id保存
				if(state.topListIds[i].id==payload){
					state.nextId = state.topListIds[i+1].id
				}
			}
			
		}
	}
	
})