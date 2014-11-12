# full scroll

full scroll，又一个快速实现整屏滚动的jQuery插件，兼容所有浏览器。

live demo:http://yuqin.github.io/full-scroll/index.html


## 为什么要写这个插件

这两年我写了好几个整屏滚动的页面，是时候沉淀下，将整屏滚动插件化。

直到前两周才发现，已经有很多这样的jQuery插件了，比如fullpage、onepage-scroll。

fullpage：太重量级了，一个插件将近2000行代码，想想也是醉了，不兼容IE6、7。

onepage-scroll：基本没人在维护了，bug比较多，优化的空间也很多，不兼容IE6、7、8。

所以决定自己写，该插件借鉴了onepage-scroll的一些思想，在此对原作者表示感谢。


## 怎么用

页面中添加fullscroll.css、jQuery、jQuery.fullscroll.js。
```
<html>
	<head>
		<link rel="stylesheet" href="path/to/fullscroll.css">
	</head>
	<body>
		<div id="full-scroll">
			<div class="section"></div>
			<div class="section"></div>
			<div class="section"></div>
			<div class="section"></div>
			<div class="section"></div>
		</div>
		<script src="path/to/jquery.min.js"></script>
		<script src="path/to/jquery.fullscroll.min.js"></script>
		<script>
			$("#full-scroll").fullscroll()
		</script>
	</body>
</html>
```

就这么简单，当然也可以根据需要传到相关的参数。

* sectionSelector：section对应的选择器，默认为.section
* middle：section中的内容是否垂直居中  
* loop: 是否循环滚动，即从第一屏滚动到最后一屏，或者最后一屏滚动到第一屏。
* animationDuration: 滚动动画的执行时间，建议不要小于1000
* easing: 如果浏览器不支持translate3d，则使用jQuery实现滚动动画，如果需要使用更多方式的动画，请使用jquery.easing.js
* easingcss3: CSS动画的实现方式
* keyboard: 是否绑定键盘事件  
* pagination: 是否需要右侧的圆圈导航
* beforeMove: 动画开始前回调
* afterMove: 动画完成后回调
* normalSelector: 这些元素上滚动鼠标，不触发整屏滚动事件，比如map，弹层。


自定义
```
$("#full-scroll").fullscroll({
	loop:true,
	beforeMove:function(to,from){
				if(to==0){
					// do something
				} 

				if(to==1 && from ==2){
					// do something
				}
			
			}


})
```

## TODO

1. FF mousewheel bug fixed.
2. Resize,处理resize的情况
3. 是否需要处理menu.
4. body动态添加class  
   比如第一屏添加class fs-page-0 
   第二屏添加fs-page-1

