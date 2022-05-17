import Vue from 'vue'
import App from './App'
import store from 'store/index.js'
import './iconfont/iconfont.css'
Vue.config.productionTip = false

App.mpType = 'app'
// 过滤器 当使用formatCount时会传过来一个value值
Vue.filter('formatCount',function(value){
	// 如果数值大于一万小于一亿
	if(value>=10000&&value<100000000){
		// 将数值除以一万的到准确的万
		value/=10000
		return value.toFixed(1) + '万'
	}else if(value>100000000){//如果大于一亿
		value/=100000000 //除以一亿得到准确的亿
		return value.toFixed(1) + '亿'
	}else{//如果都不满足则直接正常值
		return value
	}
})

//过滤日期
Vue.filter('formatTime',function(value){
	let date = new Date(value)
	return date.getFullYear()+'年' + (date.getMonth()+1) + '月' + date.getDate() + '日'
})
const app = new Vue({
    ...App,
	store
})
app.$mount()
