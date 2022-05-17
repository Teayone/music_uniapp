<template>
	<!-- 主页组件 -->
	<view class="index">
		<!-- 首页导航栏的文字组件 首页不显示图标-->
		<musichead title="网易云音乐" :icon='false'></musichead>
		<!-- 实现滚动区域且头部不会被覆盖 -->
		<view class="contion">
			<scroll-view scroll-y="true" >
				<!-- 搜索框区域 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-sousuo serch-icon"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				<!-- 骨架屏 -->
				<view v-if="isLoading">
					<m-for-skeleton
					:avatarSize="200"
					:row="3"
					:loading="isLoading"
					isarc="square"
					v-for="(item,key) in 4"
					:titleStyle='{}'
					:title="false"
					:key="key">				   
					</m-for-skeleton>
				</view>
			
				<!-- 歌曲排行榜区域 -->
				<view class="ranking-list ">
					<!-- 第一个排行榜  -->
					<view class="ranking-list-item" v-for="(item,index) in topList" :key='item.coverImgId' @tap='handleToList(item.id)'>
						<!-- 左侧图片区域 -->
						<view class="ranking-item-img">
							<image :src="item.coverImgUrl" ></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<!-- 右侧排名前三歌曲区域 -->
						<view class="item-top-three">
							<view v-for="(songs,index) in item.tracks" :key='index'>{{index+1}}.{{songs.first}} - {{songs.second}}</view>
							
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue';
	//导入骨架屏
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	//到入网络请求
	import {getTopList} from '../../network/api.js';
	export default {
		data() {
			return {
			//排行榜数据
			topList:[],
			//骨架屏默认显示
			isLoading:true
			}
		},
		components:{
			musichead,
			//注册骨架屏
			mForSkeleton
		},
		onLoad() {
			//页面加载发起请求
			this.getTopData()
		},
		methods: {
			async getTopData(){
				let {data:res} = await getTopList()
				//将数据保存到data中
				this.topList = res.list.splice(0,4)	
				//请求结束骨架屏消失
				this.isLoading = false
			},
			//跳转到排行榜列表页
			handleToList(id){
				uni.navigateTo({
					url:'/pages/list/list?id='+id
				})
			},
			//跳转到搜索页
			handleToSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.index{}
	/* 搜索框 */
	.index-search{
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 50rpx;
	}
	.index-search text{
		font-size: 26rpx;
		margin: 0 26rpx 0 28rpx;
	}
	.index-search input{
		font-size: 28rpx;
		flex: 1;
	}
	/* 排行榜区域 */
	.ranking-list{
		margin: 70rpx 30rpx 30rpx 30rpx;
	}
	.ranking-list-item{
		display: flex;
		align-items: center;
		position: relative;
		margin-bottom: 34rpx;
	}
	.ranking-list .ranking-item-img{
		width: 212rpx;
		height: 212rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}
	.ranking-list .ranking-item-img image{
		width: 100%;
		height: 100%;
	}

	.ranking-item-img text{
		position: absolute;
		font-size: 20rpx;
		left: 12rpx;
		bottom: 16rpx;
		color: #fff;

	}
	.ranking-list .item-top-three{
		line-height: 66rpx;
		flex: 1;
		margin-left: 22rpx;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
