<template>
	<!-- 排行榜点击进入的列表页 -->
	<view>
		<view class="fixbg" :style="{'background-image':'url('+songsList.coverImgUrl+')'}" ></view>
		<!-- 设置完毛玻璃效果之后将返回按钮添加上去，不会覆盖 -->
		<musichead title='歌单' :icon="true" color='white'></musichead>
		<!-- 滚动区域 -->
		<view class="contion" v-show="!isLoading">	
			<scroll-view scroll-y="true" >
				<!-- 图片和榜单所有信息的盒子 -->
				<view class="list-head">
					<!-- 歌单图片的盒子 -->
					<view class="list-img">
						<image :src="songsList.coverImgUrl"></image>
						<!-- 播放次数 -->
						<text class="iconfont icon-yousanjiao num">{{songsList.playCount | formatCount}}</text>
					</view>
					
					<!-- 歌单信息的盒子 -->
					<view class="list-info">
						<!-- 排行榜名字 -->
						<view class="list-name">{{songsList.name}}</view>
						<!-- 排行榜作者和图标 -->
						<view class="list-zuozhe">
							<image :src="songsList.creator.avatarUrl" ></image>{{songsList.creator.nickname}}
						</view>
						<!-- 排行榜描述 -->
						<view class="list-describe">
							{{songsList.description}}
						</view>
					</view>
				</view>
				
				<!-- #ifdef MP-WEIXIN -->
				<!-- 分享按钮区域 -->
				<button type="default" open-type="share" class="list-share">
					<text class="iconfont icon-fenxiang"></text>分享给微信好友
				</button>
				<!-- #endif -->
			
				<!-- 歌曲列表区域 -->
			<view class="list-music">
				<!-- 播放全部按钮区域 -->
				<view class="list-music-play">
					<text class="iconfont icon-bofang"></text>
					<text>播放全部</text>
					<text>(共{{songsList.trackCount}}首)</text>
				</view>
				<!-- 歌曲区域 -->
				<view class="list-music-item" v-for="(item,index) in songsList.tracks" :key="item.id" @tap="handleToSongs(item.id)">
					<!-- 分为左中右三个盒子 -->
					<view class="music-item-top">{{index+1}}</view>
					<view  class="music-item-song">
						<view>{{item.name}}</view>
						<view>
							<!-- 判断是否独家和SQ -->
							<image v-if="privileges[index].flag>60&&privileges[index].flag<70" src="../../static/img/dujia.png" mode=""></image>
							<image v-if="privileges[index].maxbr==999000" src="../../static/img/SQ.png" mode=""></image>
							{{item.ar[0].name}} - {{item.name}}
						</view>
					</view>
					<!-- 播放按钮 -->
					<text class="iconfont icon-bofang1"></text>
				</view>											
			</view>
			
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import {getTopListItem} from '../../network/api.js'
	export default {
		data() {
			return {
				//歌曲列表数据
				songsList:{
					//防止出现undefined
					coverImgUrl:'',
					creator:{
						avatarUrl:''
					},
					trackCount:'',	
				},
				//保存独家和SQ数据
				privileges:[],
				//加载完成显示全部内容
				isLoading:true
			}
		},
		components:{
			musichead
		},
		onLoad(event){
			//加载过程进行弹窗提示
			uni.showLoading({
				title:"正在加载.."
			})	
				
			getTopListItem(event.id).then(val=>{
				if(val[1].data.code=='200'){
					//将数据保存到data中
					this.songsList = val[1].data.playlist
					this.privileges = val[1].data.privileges	
					//将歌单公共id保存到vuex中
					this.$store.commit('INIT_TOPLISTIDS',val[1].data.playlist.trackIds)
					
					this.isLoading = false
					//加载完成隐藏弹窗
					uni.hideLoading()
				}
			})
			
		},
		methods: {
			handleToSongs(ids){
				//点击跳转到详情页并发送ids
				uni.navigateTo({
					url:'/pages/detail/detail?ids='+ids
				})
			}
		}
	}
</script>

<style scoped>
/* 榜单详情 */
.list-head{
	display: flex; 
	margin: 30rpx;
}
.list-img{
	width: 264rpx;
	height: 264rpx;
	border-radius: 30rpx;
	overflow: hidden;
	position: relative;
	margin-right: 42rpx;

}
.list-img image{
	width: 100%;
	height: 100%;
}
.list-img text{
	position: absolute;
	right: 8rpx;
	top: 8rpx;
	color: #fff;
	font-size: 26rpx;
}
/* 右侧排行榜信息 */
.list-info{
	color: #f0f2f7;
	flex: 1; /*最外层开启了弹性盒模型*/
}
.list-name{
	color: #fff;
	font-size: 34rpx;
}

.list-zuozhe{
	display: flex;
	margin: 20rpx 0;
	font-size: 24rpx;
	align-items: center;
}

.list-zuozhe image{
	width: 54rpx;
	height: 54rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 14rpx;
}
.list-describe{
	line-height: 34rpx;
	font-size: 22rpx
}

/* 按钮区域 */
.list-share{
	width: 330rpx;
	height: 74rpx;
	line-height: 74rpx;
	background-color: rgba(0,0,0,.4);
	border-radius: 37rpx;
	font-size: 28rpx;
	text-align: center;
	margin: 0 auto;
	color: #DAE2EE;
}
.list-share text{
	margin-right:16rpx ;
}

/* 歌曲列表样式外部容器 */
.list-music{
	background-color: #FFFFFF;
	border-radius:60rpx;
	margin-top: 40rpx;
	overflow: hidden;
}
/* 播放全部区域 */
.list-music-play{
	height: 50rpx;
	margin: 30rpx 0 70rpx 22rpx;
	
}
.list-music-play text:nth-child(1){
	height: 50rpx;
	font-size: 50rpx;
}
.list-music-play text:nth-child(2){
	font-size: 30rpx;
	margin: 0 10rpx 0 26rpx;
}
.list-music-play text:nth-child(3){

	font-size: 26rpx;
	color: #B4B4B4;
}

/* 歌曲区域 */
.list-music-item{
	display: flex;
	margin: 0 32rpx 66rpx 46rpx;
	align-items: center;
}
.music-item-top{
	width: 58rpx;
	color: #999;
	font-size:40;
	line-height: 40rpx;
}
.music-item-song{
	flex: 1;
}
.music-item-song view:nth-child(1){
	font-size: 28rpx;
	width: 70vw;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.music-item-song view:nth-child(2){
	font-size: 20rpx;
	width: 70vw;
	color: #B2B2B2;
	margin-left: -5rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	

}

.music-item-song view:nth-child(2) image{
	width: 32rpx;
	height: 20rpx;
	margin-right: 5rpx;

}
.list-music-item text{
	width: 50rpx;
	height: 50rpx;
	color: #c7c7c7;
	font-size: 50rpx;
	
}
</style>
