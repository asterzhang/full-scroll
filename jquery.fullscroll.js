(function($){


$.fn.fullscroll = function(options){

	var defaults = {
		sectionSelector: '.section',   // 与页面自身class冲突时 设置新的class 
		middle:true,  // 是否垂直居中  
		loop: false,   // 是否循环
		animationDuration: 700,  // 动画过渡时间
		animationCD:500,
		easing:'swing',   //动画的方式   jquery.easings.min.js    js实现
		easingcss3: 'ease',  //css3动画的方式	
		keyboard : true,   //
		menu:false,   //
		pagination:true,   //
		beforeMove:null,
		afterMove:null,

		// TODO
		normalElems:'' //todo 这些元素上滚动  不触发整屏滚动   
	}

	var settings = $.extend(defaults,options);

	$.support.displayTable = false;
	$.css3translate = false;
	


	var isMoving = false;
	var isScrolling = false;  
	var isResizing = false;
	var scrollID;
	var movingID;
	var sectionLastIndex = $(settings.sectionSelector).length-1;



	$.support.css3translate = supportCSS3Translate();

	if(!$.support.css3translate){
		elem.addClass("fs-page-absolute")
	}


	// 初始化处理
	
	var elem =$(this);	

	elem.addClass("fs-page");

	$(settings.sectionSelector).addClass("fs-section").wrapInner("<div class='fs-content'></div>").eq(0).addClass("active");


	// 是否对section内容做居中处理
	if(settings.middle){	
		$(".fs-content").each(function(){
			var marginTop = -1*$(this).height()/2+"px";
			$(this).css({"marginTop":marginTop})
		});
	}



	$.fn.moveTo = function(to,from){


		if(!isMoving && to!=from){

			isMoving = true;

			if(from==undefined){
				from = $(".fs-section.active").index();
			}

			// 移动前回调
			if(typeof settings.beforeMove  === "function") {
				settings.beforeMove(to,from);
			}

			

			$(".fs-section").removeClass("active").eq(to).addClass("active");

			var dest = -to*100+"%"

			if($.support.css3translate){
				
				elem.css({
					transform:"translateY("+dest+")",
					transition: "all " + settings.animationDuration + "ms " + settings.easingcss3
				});

				if(typeof settings.afterMove === "function"){
					elem.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
        		settings.afterMove(to,from);
     			});
				}
				

			} else {
				
				elem.animate({"top":dest},settings.animationDuration,settings.easing,function(){
					// 移动完成后回调
					if(typeof settings.afterMove === "function"){
						settings.afterMove(to,from);
					}
				})// jquery top实现

			}

			clearTimeout(movingID)
			movingID = setTimeout(function(){isMoving=false},settings.animationDuration+settings.animationCD)
		}


	}



	$.fn.moveDown = function(){

		var current =  $(".fs-section.active")
		var prev = current.prev(".fs-section");
		
		if(!prev.length){
			settings.loop && (prev = $(".fs-section").last());
		} 
			
		if(prev.length){
			var from = current.index()
			var to = prev.index();
			$.fn.moveTo(to,from);
		}

	}


	$.fn.moveUp = function(){


		var current =  $(".fs-section.active")

		var next = current.next(".fs-section");
		
		if(!next.length){
			settings.loop && (next = $(".fs-section").first());
		} 
			
		if(next.length){

			var from = current.index()
			var to = next.index();

			//console.log(to)

			$.fn.moveTo(to,from);
		}

	}


	function resize(){

		var winWidth = $(window).width(),
			winHeight = $(window).height();


	};

	


	/**
	 * Detecting mousewheel scrolling
	 *
	 * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
	 * http://www.sitepoint.com/html5-javascript-mouse-wheel/
	 */

	function mouseWheelHandler(e) {

		e.preventDefault();

		if (!isScrolling) { 

			isScrolling = true;
				
    	var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail || -e.originalEvent.detailY;
    
			if (delta < 0) {
				elem.moveUp();
				console.log("moveup");
			}else {
				elem.moveDown()
				console.log("movedown")
			}

			clearTimeout(scrollID);
			scrollID = setTimeout(function(){isScrolling = false},200)
		}
		
		
		
	}


	$(document).on('wheel mousewheel DOMMouseScroll',mouseWheelHandler);



	if(settings.keyboard == true) {
      $(document).keydown(function(e) {
        var tag = e.target.tagName.toLowerCase();
        var which = e.which;
        if(tag !== 'input' && tag !== 'textarea'){
        	if(which == 33 || which ==37 || which==38){ // 33 page up; 37 left; 38 up
        		elem.moveDown();
        	} else if(which == 32|| which ==34 || which==39 || which==40 ){ //32 space; 34 page down; 39 right; 40 down
        		elem.moveUp();
        	} else if(which==36){ // Home
        		elem.moveTo(0)
        	} else if(which==35){ // End
        		elem.moveTo(sectionLastIndex);
        	}
        }
      });
    }


    function supportCSS3Translate() {
			var el = document.createElement('p'),
				has3d,
				transforms = {
					'webkitTransform':'-webkit-transform',
					'OTransform':'-o-transform',
					'msTransform':'-ms-transform',
					'MozTransform':'-moz-transform',
					'transform':'transform'
				};

			// Add it to the body to get the computed style.
			document.body.insertBefore(el, null);

			for (var t in transforms) {
				if (el.style[t] !== undefined) {
					el.style[t] = "translate3d(1px,1px,1px)";
					has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
				}
			}

			document.body.removeChild(el);

			return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
		}




	


}

})(jQuery)