<template>
	<view class="music-head" :style="{color:color}">
		<!-- 返回按钮和首页按钮的图标 -->
		<view class="music-head-icon" v-if="icon" :class="{'music-head-bg':isStyle}">
			<text class="iconfont icon-zuojiantou" @tap="handleToBack" :style='{color:fontColor}'></text>
			<text class="music-head-rule" :style="{color:textColor}">|</text>
			<text class="iconfont icon-shouye" @tap="handleToHome" :style='{color:fontColor}'></text>
		</view>
		<text class="music-head-title">{{title}}</text>
	</view>
</template>

<script>
	export default {
		name:"musichead",
		data() {
			return {
			
			};
		},
		props:['title','icon','color','fontColor','textColor','isStyle'],
		methods:{
			// 点击返回上一级
			handleToBack(){
				uni.navigateBack()
			},
			//点击回到首页
			handleToHome(){
				uni.navigateTo({
					url:'../../pages/index/index'
				})
			}
				
			
		}
	}
</script>

<style scoped>
	/* 导航栏样式 */
	/* 最外层容器 */
	.music-head{
		width: 100%;
		height: 75px;
		text-align: center;
		line-height: 80px;
		font-size: 16px;
		color: black;
		position: relative;
	}
	.music-head-title{
		display: inline-block;
		width: calc(100vw - 200px );
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	/* 里层图标栏 */
	.music-head-icon{
		position: absolute;
		left: 8px;
		top: 26px;
		border-radius: 15px;
		width: 90px;
		height: 31px;
		line-height: 31px;
		color: #fff;
		background-color: rgba(0,0,0,.3);
		display: flex;
		justify-content: space-evenly;	
	}
	.music-head-rule{
		line-height: 28px;
		font-size: 24rpx;
		color: #567196;
	}
	.music-head-bg{
		background-color: #fff;
		border: 1px solid #eaeaea;
	}
</style>
