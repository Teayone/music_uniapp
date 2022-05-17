<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 滚动区域的样式 */
	.contion{
		width: 100%;
		height: calc(100vh - 70px);
		overflow: hidden;
	}
	.contion scroll-view{
		height: 100%;
	}
	
	/* 排行榜详情页公共样式 */
	.fixbg{
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		/* background: url(static/img/top-three.png); */
		background-size: cover;
		
		background-position: center 0; 
		/* 背景图片模糊 */
		filter: blur(20px);
		/* 去除模糊之后的白边 */
		transform: scale(1.2);
	}
</style>
