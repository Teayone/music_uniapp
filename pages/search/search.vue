<template>
	<view class="search">
		<musichead title="搜索" 
		:icon="true" 
		 fontColor="black"
		 textColor="rgba(255,255,255,.2)"
		 :isStyle="true"
		 ></musichead>
		<!-- 滚动区域 --> 
		 <view class="contion"  >
		 	<scroll-view scroll-y="true"  >
				<!-- 搜索框区域 -->
				<view class="search-search">
					<text class="iconfont icon-sousuo serch-icon"></text>
					<input v-model="searchWord" @input="onInput" type="text" placeholder="搜索歌曲" @confirm="handleToSearch(searchWord)" />
					<!-- 输入框X按钮 -->
					<text v-show="searchType!=1" class="iconfont icon-guanbi" @tap="deleteInput"></text>
				</view>
				<block v-if="searchType == 1">
					<!-- 历史记录区域 -->
					<view class="search-history">
						<!-- 历史记录和删除历史记录按钮 -->
						<view class="search-history-head" v-if="searchHistory.length">
							<text>历史记录</text>
							<text class="iconfont icon-shanchu" @tap="deleteHistory"></text>
						</view>
						<!-- 搜索记录区域 -->
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :key="index" @tap="handleToInput(item)">{{item}}</view>
						</view>
					</view>
					
					<!-- 热搜榜区域 -->
					<view class="hot-list">
						<!-- 标题 -->
						<view>热搜榜</view>										
						<!-- 歌曲区域 -->
						<view class="hot-music" v-for="(item,index) in hotList" :key ="index" @tap="handleToInput(item.searchWord)">
							<!-- 左侧序号 -->
							<view class="hot-music-index" :class="{'hot-music-rank':index < 3}">{{index+1}}</view>
							<!-- 中间歌名和广告词 -->
							<view class="hot-music-ad">
								<view class="hot-ad-title">
									{{item.searchWord}}
									<image :src="item.iconUrl" mode="aspectFit"></image>
								</view>
								<view class="hot-music-info">{{item.content}}</view>
							</view>
							<!-- 右侧热度值 -->
							<text class="hot-music-num">{{item.score}}</text>
						</view>
					</view>
				</block>
				<!-- 搜索结果区域 -->
				<block v-else-if="searchType == 2">
					<!-- 整个搜索结果区域 -->
					<view class="search-result ">
						<!-- 歌名和演唱者和播放按钮 -->
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index" @tap="handleToDetail(item.id)">
							<view class="serach-result-words">
								<view>{{item.name}}</view>
								<view>
							<!-- 		<image  src="../../static/img/vip.png" mode=""></image>
									<image src="../../static/img/dujia.png" mode=""></image> -->
									<image src="../../static/img/SQ.png" mode=""></image>
									{{item.artists[0].name}} - {{item.album.name}}
								</view>
							</view>
							<!-- 播放按钮 -->
							<text class="iconfont icon-bofang1"></text>
						</view>
					</view>
				</block>
				
				<!-- 搜索提示区域 -->
				<block v-else-if="searchType == 3">
						<!-- 搜索提示外层容器 -->
						<view class="serach-suggest">
							<!-- 随着输入的文字变化而变化 -->
							<view class="search-suggest-head" @tap="handleToInput(searchWord)">搜索“{{searchWord}}”</view>
							<!-- 搜索提示区域 -->
							<view class="serach-suggest-item" v-for="(item,index) in searchSuggestList" :key="index" @tap="handleToInput(item.keyword)">
								<!-- 放大镜图标 -->
								<text class="iconfont icon-sousuo"></text>
								<!-- 提示的文字 -->
								{{item.keyword}}
							</view>
						</view>	
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import {hotMusic,searchWord,searchSuggest} from '../../network/api.js'
	export default {
		data() {
			return {
				//热搜榜歌曲数据
				hotList:[],
				//搜索词
				searchWord:'',
				//保存历史记录
				searchHistory:[],
				//搜索结果,搜索提示,没有搜索时的页面标记,默认是没有搜索时的页面
				searchType:1,
				//保存搜索结果
				searchList:[],
				//保存搜索提示数据
				searchSuggestList:[]
			}
		},
		onLoad(){
			hotMusic().then(res=>{
				if(res[1].data.code=='200'){
					this.hotList = res[1].data.data
				}
			});
			//页面加载读取历史记录
			uni.getStorage({
				key:'searchHistory',
				success:(res)=>{
					//将本地的历史记录保存到数组中
					this.searchHistory = res.data
				}
			})
		},
		methods: {	
			//点击热搜和历史记录歌曲和搜索提示,将歌曲名放到输入框中
			handleToInput(searchWrod){
				this.searchWord = searchWrod
				//然后发起网络请求,请求搜索结果,如果是搜索提示则也发送网络请求
				this.getSearchList(searchWrod)
			},
			//点击清空按钮清空输入框
			deleteInput(){
				this.searchWord='';
				this.searchType = 1
			},
			//按下回车将历史记录保存
			handleToSearch(word){
				if(word===''){
					return
				}
				this.searchHistory.unshift(word)
				//Set:集合,自动进行数组去重,但返回的值不是数组,所以需要[...new Set]
				this.searchHistory = [...new Set(this.searchHistory)]
				//数组中的历史记录只能保存10个
				if(this.searchHistory.length>10){
					this.searchHistory.length = 10
				}
				//将历史记录存储到本地
				uni.setStorage({
					key:'searchHistory',
					data:this.searchHistory
				})
				
				//调用搜索请求,将文字内容当作请求参数
				this.getSearchList(word)
			},
			//删除所有历史记录按钮
			deleteHistory(){
				//清空本地记录
				uni.removeStorage({
					key:'searchHistory',
					//删除成功的回调
					success:()=>{
						//清空数组
						this.searchHistory=[]
					}
				});
			},
			//请求搜索结果
			getSearchList(word){
				searchWord(word).then(res=>{
					if(res[1].data.code == '200'){
						this.searchList = res[1].data.result.songs;
						//显示搜索结果内容
						this.searchType = 2
					}
				})
			},
			
			//点击跳转到详情页
			handleToDetail(ids){
				uni.navigateTo({
					url:'/pages/detail/detail?ids='+ids
				})
			},
			//如果搜索内容手动删除到空,则显示搜索主页面
			onInput(e){
				let value = e.detail.value
				if(!value){
					this.searchType = 1
					return
				}
				//发起网络请求获取搜索提示数据
				searchSuggest(value).then(res=>{
					if(res[1].data.code == '200'){
						this.searchSuggestList = res[1].data.result.allMatch
						this.searchType = 3
					}
				});
			},
		}
	}
</script>

<style scoped>
	/* 搜索框 */
	.search-search{
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 50rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 50rpx;
	}
	.search-search text{
		/* font-size: 26rpx; */
		margin: 0 26rpx 0 28rpx;
	}
	.search-search input{
		font-size: 26rpx;
		flex: 1;
	}
	/* 历史记录总区域 */
	.search-history{
		margin: 0 30rpx 50rpx 30rpx;
		font-size: 26rpx;
	}
	/* 历史记录和删除按钮 */
	.search-history-head{
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
	}
	.search-history-head text{
		
	}
	/* 搜索记录 */
	.search-history-list{
		display: flex;
		flex-wrap: wrap;
		
	}
	.search-history-list view{
		padding: 16rpx 28rpx;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		background-color: #f7f7f7;
	}
	/* 热搜榜总区域 */
	.hot-list{
		margin: 0 30rpx;
		font-size: 26rpx;
	}
	.hot-list>view:first-child{
		margin-bottom: 36rpx;
	}
	/* 歌曲容器 */
	.hot-music{
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
	}
	.hot-music .hot-music-index{
		font-size: 36rpx;
		color: #999999;
		width: 60rpx;
		margin-left: 8rpx;
	}
	/* 前三个的数字是红色 */
	.hot-music .hot-music-rank{
		color:#fb2222; 
	}
	/* 歌名和广告词区域 */
	.hot-music-ad{
		flex: 1;
	}
	/* 歌名 */
	.hot-ad-title{
		font-size: 30rpx;
		margin-bottom: 6rpx;

	}
	/* 歌名旁边的小图片 */
	.hot-ad-title image{
		width: 48rpx;
		height: 22rpx;
		margin-left: 10rpx;
	}
	/* 广告词 */
	.hot-music-info{
		font-size: 24rpx;
		color: #878787;
		width: calc(100vw - 280rpx);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/* 右侧热度值 */
	.hot-music-num{
		color: #D2D2D2;
	}
	
	/* 搜索结果区域 */
	.search-result{border-top: 2rpx #e4e4e4 solid; padding: 30rpx;}
	/* 歌名演唱者播放按钮 */
	.search-result-item{display: flex; align-items: center;justify-content: space-between;padding-bottom: 30rpx;border-bottom: 1px solid #e4e4e4;margin-bottom: 30rpx;}
	/* 歌名演唱者 */
	.serach-result-words{}
	/* 歌名 */
	.serach-result-words>view:first-child{
		font-size: 28rpx;
		color: #6383B0;
	}
	/* 演唱者和图标 */
	.serach-result-words>view:last-child{font-size: 22rpx; color: #9C9C9C; padding-top:12rpx; }
	.serach-result-words>view:last-child image{
		width: 30rpx;
		height: 20rpx;
		position: relative;
		top: 2rpx;
		margin-right: 8rpx;
		
	}
	/* 播放按钮 */
	.search-result-item>text{font-size:50rpx; color: #CFCFCF;}
	
	/* 搜索提示区域 */
	/* 最外层容器 */
	.serach-suggest{
		border-top: 2rpx #e4e4e4 solid; 
		padding: 56rpx;
		font-size: 26rpx
	}
	/* 跟随着输入内容而变化的文字 */
	.search-suggest-head{

		color: #7B97BC;
		margin-bottom: 74rpx;
	}
	/* 搜索提示结果 */
	.serach-suggest-item{
		color: #5d5d5d;
		margin-bottom: 74rpx;
	}
	.serach-suggest-item > text{
		margin-right: 28rpx;
		position: relative;
		top: 3rpx;
		color: #bdbdbd;
	}

	
</style>
