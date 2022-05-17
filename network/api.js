// 使用路径发起请求的文件
import {baseUrl} from './config.js'

//首页排行榜请求函数 
export function getTopList (){
	//返回Promise
	return new Promise((reslove,reject)=>{
		//发起请求
		uni.request({
			url:`${baseUrl}/toplist/detail`,
			method:'GET',	
			//请求成功将数据返回给Promise
			success:(value)=>{
				reslove(value)
			},
			//失败就返回失败的数据
			fail:(err)=>{
				reject(err)
			}
		})
	})
}

//排行榜详情请求
export function getTopListItem(id){
		return uni.request({
			url:`${baseUrl}/playlist/detail?id=${id}`,
			method:'GET'
		})
}

//获取歌曲详情
export function songDetail(ids){
		return uni.request({
			url:`${baseUrl}/song/detail?ids=${ids}`,
			method:'GET'
		})
}

//获取相似歌曲
export function songSimi(simiId){
		return uni.request({
			url:`${baseUrl}/Simi/song?id=${simiId}`,
			method:'GET'
		})
}

//获取歌曲评论
export function songComment(commentId){
		return uni.request({
			url:`${baseUrl}/comment/music?id=${commentId}`,
			method:'GET'
		})
}

//获取歌词
export function songLyric(lyricId){
		return uni.request({
			url:`${baseUrl}/lyric?id=${lyricId}`,
			method:'GET'
		})
}

//获取歌曲路径
export function songUrl(songUrlId){
		return uni.request({
			url:`${baseUrl}/song/url?id=${songUrlId}`,
			method:'GET'
		})
}

//热搜榜请求
export function hotMusic(){
	return uni.request({
		url:`${baseUrl}/search/hot/detail`,
		method:'GET'
	})
}

//搜索结果请求
export function searchWord(word){
	return uni.request({
		url:`${baseUrl}/search?keywords=${word}`,
		method:'GET'
	})
}

//搜索下拉提示
export function searchSuggest(word){
	return uni.request({
		url:`${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method:'GET'
	})
}