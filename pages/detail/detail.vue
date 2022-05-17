<template>
	<view class="detail">
		<!-- 毛玻璃 -->
		<view class="fixbg" :style="{'background-image':`url(${songDetail.al.picUrl})`}" ></view>
		<!-- 自定义导航栏 -->
		<musichead :title='songDetail.name' :icon="true" color='white'></musichead>
		<!-- 滚动区域 -->
		<view class="contion" v-show="!isLoading" >
			<scroll-view scroll-y="true" >
				<view class="detail-play" @tap="handleToPlay">
					<!-- 圆盘中间的图片 -->                        <!--默认自动旋转，所以加上样式-->                           
					<image :src="songDetail.al.picUrl" :class="{'detail-play-run':isPlayRotate}" ></image>
					<!-- 圆盘中间的播放按钮 -->
					<text class="iconfont" :class="iconPlay"></text>
					<!-- 圆盘的白色指针条 -->
					<view></view>
				</view>
				
				<!-- 歌词区域 -->
				<view class="detail-lyric">
					<!-- 歌词要进行滚动 需要另一层容器 -->            
					<view class="detail-lyric-wrap" :style="{transform: `translateY(${-(lyricIndex-1)*82}rpx)`}">
						<!-- <view class="detail-lyric-item">作词：林夕</view> -->
						<view class="detail-lyric-item" :class="{active:lyricIndex==index}" v-for="(item,index) in songLyric" :key="index">{{item.lyric}}</view>
						<!-- <view class="detail-lyric-item">出品：网易云音乐x云上工作室x青云LAB</view> -->
					</view>
				</view>
				<!-- 只在微信小程序显示 -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="detail-see-more">在网易云音乐查看更多歌词</view>
				<!-- 分享按钮 -->
				<button type="default" open-type="share" class="detail-share" >分享给微信好友</button>
				<!-- #endif -->
				<!-- 喜欢这首歌的人也听区域 -->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<!-- 歌曲列表 -->
					<view class="detail-like-items" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
						<!-- 歌曲封面小头像 -->
						<view class="detail-like-img">
							<image :src="item.album.picUrl" mode=""></image>	
						</view>
						
						<view class="detail-items-name">
							<!-- 歌名和演唱者 -->
							<view>{{item.name}}</view>
							<view>
								<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70" src="../../static/img/SQ.png" mode=""></image>
								<image v-if="item.privilege.maxbr == 999000" src="../../static/img/dujia.png" mode=""></image>
								 {{item.album.artists[0].name}}- {{item.album.name}}
							</view>	
						</view>
						<text class="iconfont icon-bofang1"></text>
					</view>				
				</view>
				
				<!-- 评论区域 -->
				<view class="detail-comment">
					<!-- 评论标题 -->
					<view class="detail-comment-head">精彩评论</view>
					<!-- 头像评论点赞总盒子 -->
					<view class="detail-comment-items" v-for="(com,index) in songComment" :key="index">
						<!-- 左侧头像盒子 -->
						<view class="detail-comment-photo">
							<image :src="com.user.avatarUrl"></image>
						</view>
						
						<!-- 昵称点赞评论总盒子 -->
						<view class="detail-comment-content">
							<!-- 昵称点赞总盒子 -->
							<view class="detail-comment-title">
								<!-- 左侧昵称和评论时间盒子 -->
								<view class="detail-comment-name">
									<view>{{com.user.nickname}} <image v-if="com.user.vipType == 11" src="../../static/img/huiyuan.png" mode=""></image></view>
									<view>{{com.time |formatTime}}</view>
								</view>
								<!-- 右边点赞盒子 -->
								<view class="detail-comment-like">
									{{com.likedCount | formatCount}}
									<text class="iconfont icon-dianzan"></text>
								</view>
							</view>
							<!-- 评论内容盒子 -->
							<view class="detail-comment-discuss">{{com.content}}</view>
						</view>
					</view>
								
				</view>
			
			</scroll-view>	
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	// 导入五个请求
	import {songDetail,songSimi,songComment,songLyric,songUrl} from '../../network/api.js'
	export default {
		data() {
			return {
				//歌曲详情数据
				songDetail:{
					//防止出现undefined
					al:{
						picUrl:''
					}
				},
				//相似歌曲数据
				songSimi:[],
				//歌曲评论
				songComment:[],
				//歌词和对应的时间(已转换成秒)
				songLyric:[],
				//歌词高亮效果和索引进行对比和歌曲索引位置
				lyricIndex:0,
				//音乐播放显示不同图标 后面的图标根据播放和暂停判断
				iconPlay:'icon-zanting1',
				//音乐图片是否旋转,默认自动旋转
				isPlayRotate:true,
				//网络请求完毕，显示内容
				isLoading:true

			}
		},
		components:{
			musichead
		},
		onLoad(options){
			this.getMusic(options.ids)
		},
		onUnload(){
			//离开页面关闭定时器
			this.canleLycricIndex()
			
			// #ifdef H5
			//关闭页面时销毁播放实例
			this.innerAudioContext.destroy()
			// #endif
		},
		onHide(){
			//离开时关闭定时器
			this.canleLycricIndex()
			// #ifdef H5
			//离开页面时销毁播放实例
			this.innerAudioContext.destroy()
			// #endif
		},
		methods: {
			getMusic(ids){
				//将当前播放的歌曲id提交到vuex
				this.$store.commit('NEXT_ID',ids)
				//加载过程进行弹窗提示
				uni.showLoading({
					title:"正在加载.."
				})	
				this.isLoading = true
				
				//只有网络请求全部处理完才返回
				Promise.all([songDetail(ids),songSimi(ids),songComment(ids),songLyric(ids),songUrl(ids)]).then(res=>{
					if(res[0][1].data.code=='200'){
						this.songDetail = res[0][1].data.songs[0];
					}
					if(res[1][1].data.code == '200'){
						this.songSimi = res[1][1].data.songs
						
					}
					if(res[2][1].data.code == '200'){
						this.songComment = res[2][1].data.hotComments
					
					}
					if(res[3][1].data.code == '200'){
						let lyric = res[3][1].data.lrc.lyric
						//匹配正则，将歌曲时间和对应的歌词分别取出
						let re =/\[([^\]]+)\]([^\[]+)/g
						//保存正则匹配结果的数组
						var result = [];
						lyric.replace(re,($0,$1,$2)=>{
							//将匹配后的结果添加到数组中
							result.push({"time":this.formatTimeTosec($1) , "lyric":$2})	
						})	
						//将最终转换后的结果保存到data中
						this.songLyric = result
					}
					if(res[4][1].data.code == 200){
						// #ifdef H5
						//解决多个歌曲播放问题
						if(!this.innerAudioContext){
							//判断如果没有实例为false的时候，取反为true进入if，然后再创建实例
							this.innerAudioContext = uni.createInnerAudioContext()
						}
						//歌曲链接
						this.innerAudioContext.src = res[4][1].data.data[0].url || '';
						//H5部分浏览器不支持自动播放
						//按钮图标变成播放
						this.iconPlay = 'icon-bofang'
						//图片不旋转
						this.isPlayRotate = false
						//监听歌曲播放
						this.innerAudioContext.onPlay(()=>{
							//歌曲播放开启定时器
							this.listenLyricIndex()
							//歌曲正在播放，使用暂停图标
							this.iconPlay = 'icon-zanting1'
							//将图片旋转开启
							this.isPlayRotate = true
						})
						//监听歌曲暂停
						this.innerAudioContext.onPause(()=>{
							//将图标设置为开始播放
							this.iconPlay = 'icon-bofang'
							//将图片旋转设置为false
							this.isPlayRotate = false
							//关闭定时器
							this.canleLycricIndex()
						});
						this.innerAudioContext.onEnded(()=>{
							this.getMusic(this.$store.state.nextId)
						})
						// #endif
						
							
						// #ifdef MP-WEIXIN
						//微信小程序使用背景音频,创建背景音频实例
						this.bgAudioManager = uni.getBackgroundAudioManager();
						//必须设置title(歌曲名字)
						this.bgAudioManager.title = this.songDetail.name;
						//歌曲链接
						this.bgAudioManager.src = res[4][1].data.data[0].url || '';
						//以防万一，获取到背景音频就调用歌词事件函数
						this.listenLyricIndex()
						//歌曲播放调用此参数
						this.bgAudioManager.onPlay(()=>{
							//歌曲播放 调用歌词时间函数
							this.listenLyricIndex()
							//歌曲正在播放，使用暂停图标
							this.iconPlay = 'icon-zanting1'
							//将图片旋转开启
							this.isPlayRotate = true
						});
						//歌曲暂停调用此参数
						this.bgAudioManager.onPause(()=>{
							//将图标设置为开始播放
							this.iconPlay = 'icon-bofang'
							//将图片旋转设置为false
							this.isPlayRotate = false
							//关闭定时器
							this.canleLycricIndex()
						})
						//监听歌曲自然播放结束切换下一首
						this.bgAudioManager.onEnded(()=>{
							//重新调用网络请求，将下一首id当作请求参数
							this.getMusic(this.$store.state.nextId)
						})
						// #endif
					
					}
					
					//全部加载完成，显示内容，隐藏弹窗
					this.isLoading = false
					uni.hideLoading()

							
				});
			},
			//将时间转换成秒数
			formatTimeTosec(value){
				//把时间分割出来 从冒号开始
				let arr = value.split(':');
				//分割出来分钟和秒数都转换成数字
				//将分钟*60得到秒数         将秒数只包含一位小数
				return (Number(arr[0]*60) + Number(arr[1])).toFixed(1)
			},
			
			//播放或暂停音乐
			handleToPlay(){
				// #ifdef MP-WEIXIN
				//如果音乐在暂停状态
				if(this.bgAudioManager.paused){
					//则点击播放音乐，会自动触发上面的监听播放暂停函数
					this.bgAudioManager.play()
				//反之暂停音乐
				}else{
					this.bgAudioManager.pause()
				}
				// #endif
				
				// #ifdef H5
				//如果音乐在暂停状态
				if(this.innerAudioContext.paused){
					//则点击播放音乐，会自动触发上面的监听播放暂停函数
					this.innerAudioContext.play()
				//反之暂停音乐
				}else{
					this.innerAudioContext.pause()
				}
				// #endif

			},
			//移动歌词的索引
			listenLyricIndex(){
				//如果已经触发了歌词函数，继续触发先关闭定时器
				clearInterval(this.timer)
				//开启定时器 监听歌词滚动
				this.timer = setInterval(()=>{
					//遍历歌词数据
					for(let i = 0;i<this.songLyric.length; i++){
						//如果歌词没有了，还有音乐，则让歌词一直是最后一个
						if(this.lyricIndex >this.songLyric[this.songLyric.length-1].time){
							this.lyricIndex = this.songLyric.length-1
						}
            
						
						// #ifdef MP-WEIXIN
						//判断当前歌曲时间和遍历后的歌曲时间
						if(this.bgAudioManager.currentTime > this.songLyric[i].time&&this.bgAudioManager.currentTime < this.songLyric[i+1].time){
							this.lyricIndex = i
							
						}
						// #endif
						
						
						// #ifdef H5
						//判断当前歌曲时间和遍历后的歌曲时间
						if(this.innerAudioContext.currentTime > this.songLyric[i].time&&this.innerAudioContext.currentTime < this.songLyric[i+1].time){
							this.lyricIndex = i
							
						}
						// #endif

					}
				},500)
			},
			//清除定时器
			canleLycricIndex(){
				clearInterval(this.timer)
			},
			//点击相似歌曲重新发起详情页网络请求(需要id)
			handleToSimi(songId){
				this.getMusic(songId)
			}
		},
	}
	
</script>

<style scoped>
/* 圆盘区域 */
.detail-play{
	width: 580rpx;
	height: 580rpx;
	background-image: url(~@/static/img/disc.png);
	/* 背景图适应容器大小 */
	background-size: cover;
	margin: 214rpx auto;
	position: relative;
}
.detail-play image{
	width: 370rpx;
	height: 370rpx;
	border-radius: 50%;
	/* 设置图片旋转 */
	animation: 10s linear move infinite;
	/* 控制动画暂停 */
	animation-play-state: paused;
}
/* 设置动画开始 配合布尔值使用*/
.detail-play .detail-play-run{
	animation-play-state: running;
	
}
@keyframes move{
	from{transform: rotate(0deg);}
	to{transform: rotate(360deg);}
}
.detail-play text,.detail-play image{
	/* 图片和播放按钮位于圆盘中间 */
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	margin: auto;

}

.detail-play text{
	width: 100rpx;
	height: 100rpx;
	font-size: 100rpx;
	color: #fff;
}
/* 圆盘的白色指针条 */
.detail-play view{
	width: 250rpx;
	height: 360rpx;
	background: url(~@/static/img/needle.png);
	background-size: cover;
	/* 调整白色指针的位置 */
	position: absolute;
	left: 100rpx;
	right: 0;
	top: -200rpx;
	margin: auto;
	
}

/* 歌词总区域 */
.detail-lyric{
	font-size: 32rpx;
	color: #6A6B6E;
	line-height: 82rpx;
	height: 246rpx;
	text-align: center;
	overflow: hidden;
	margin: 0 30rpx 0 30rpx;
	margin-top: -180rpx;
	
}
/* 装歌词的外部容器动态移动歌词 */
.detail-lyric-wrap{
	/* 歌曲移动是的过渡时间 */
	transition: .3s;
}
.detail-lyric-item{
	/* 歌词溢出隐藏 */
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	height: 82rpx;
}
/* 歌词高亮文字 */
.detail-lyric-item.active{
	color: #FEFEFE;
}
/* 查看更多歌词 */
.detail-see-more{
	width: 100%;
	line-height: 82rpx;
	font-size: 30rpx;
	text-align: center;
	color: #C0C0C1;
	text-decoration: underline;
}
/* 分享按钮 */
.detail-share{
	width: 380rpx;
	height:80rpx;
	color: #F1F1F1;
	line-height: 80rpx;
	font-size: 30rpx;
	border-radius: 40rpx;
	background-color: transparent;
}

/* 喜欢这首歌的人也听区域 */
.detail-like{
	margin: 30rpx 30rpx;
}
/* 标题 */
.detail-like-head{
	font-size: 40rpx;
	color: #fff;
	margin-bottom: 28rpx;
}
/* 一个歌曲的盒子 */
.detail-like-items{
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}
.detail-like-img{
	width: 82rpx;
	height: 82rpx;
	border-radius: 20rpx;
	overflow: hidden;
	margin-right: 20rpx;
}
.detail-like-img image{
	width: 100%;
	height: 100%;
}
.detail-items-name{
	flex: 1;
}
.detail-items-name view:nth-child(1){
	color: #E7E7E7;
	font-size: 28rpx;
	margin-bottom: 12rpx;
}
.detail-items-name view:nth-child(2){
	font-size: 22rpx;
	color:#6E6E72 ;
}
.detail-items-name view:nth-child(2)>image{
	width: 26rpx;
	height: 20rpx;
	margin-right: 6rpx;
}
.detail-like-items text{
	/* position: absolute; */
	font-size: 50rpx;
/* 	right: 8rpx;
	top: 12rpx; */
	color: #3A3A3F;
}


/* 评论区域最外层容器 */
.detail-comment{
	margin: 30rpx 30rpx;
}
/* 评论头 */
.detail-comment-head{
	font-size: 40rpx;
	color: #fff;
	margin-bottom: 28rpx;
}
/* 包含头像昵称点赞评论总盒子 */
.detail-comment-items{
	display: flex;
	margin-bottom: 28rpx;
}
/* 头像盒子 */
.detail-comment-photo{
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	margin-right: 18rpx;
	overflow: hidden;
}
.detail-comment-photo image{
	width: 100%;
	height: 100%;
}
/* 昵称点赞评论总盒子 */
.detail-comment-content{
	flex: 1;
	border-bottom: 1px #e0e0e0 solid;
	padding-bottom: 40rpx;
	
}
/* 昵称点赞盒子 */
.detail-comment-title{
	display: flex;
	/* 一个靠左一个靠右 */
	justify-content: space-between;
	margin-bottom: 20rpx;

}
/* 昵称和评论时间盒子 */
.detail-comment-name{
	
}

/* 昵称盒子 */
.detail-comment-name view:nth-child(1){
	font-size: 26rpx;
	color: #909194;
}
/* 昵称后面的会员图标 */
.detail-comment-name view:nth-child(1) image{
	width: 50rpx;
	height: 20rpx;
	margin-left: 6rpx;
	border-radius: 5rpx;
}

/* 评论时间盒子 */
.detail-comment-name view:nth-child(2){
	font-size: 20rpx;
	color: #404145;
}

/* 点赞盒子 */
.detail-comment-like{
	font-size: 28rpx;
	color: #5A5B5E;
	/* flex: 1; */
	/* text-align: right; */
}
/* 点赞图标 */
.detail-comment-like text{
	font-size: 38rpx;
}

/* 评论盒子 */
.detail-comment-discuss{
	font-size: 30rpx;
	line-height: 40rpx;
	color: #F5F5F6;
}
</style>
