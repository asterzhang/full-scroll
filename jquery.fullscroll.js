(function($){


$.fn.fullscroll = function(options){

	var defaults = {
		sectionSelector: '.section', 
		middle:true,  // middle the content in sections  
		loop: false,   // 
		animationDuration: 1000,  // suggest bigger than 1000ms
		animationCD:400, // CD  
		easing:'swing',   // jquery.easings.min.js
		easingcss3: 'ease',  // 	
		keyboard : true,   // bind keyboard event
		menu:false,   // TODO
		pagination:true,   // circle navi
		beforeMove:null, 
		afterMove:null,
		normalElems:'' //	TODO elem without handling the mousewheel 
	}

	var settings = $.extend(defaults,options);
	
	var isScrolling = false,
		  isResizing = false,
		  sectionLength = $(settings.sectionSelector).length,
		  elem =$(this);	

	elem.addClass("fs-page");

	$(settings.sectionSelector).addClass("fs-section").wrapInner("<div class='fs-content'></div>").eq(0).addClass("active");

	// middle the content use negative margin-top
	if(settings.middle){	
		$(".fs-content").each(function(){
			var marginTop = -1*$(this).height()/2+"px";
			$(this).css({"marginTop":marginTop})
		});
	}

	$.support.css3translate3d = supportCSS3Translate3d();

	if(!$.support.css3translate3d){
		elem.addClass("fs-page-absolute")
	}

	// circle nav
	if(settings.pagination){
		
		initPagination();

		$(".fs-pagination li a").on("click",function(e){
			var index = $(this).parent("li").index();
			elem.moveTo(index)
		})
	}


	function initPagination(){

		$("body").append('<div class="fs-pagination"></div>');
		var pagination = $(".fs-pagination");

		var html = "<ul>";
		// TODO add extral class name
		for(var i=0;i<sectionLength;i++){
			html += '<li><a href="javascript:;"></a></li>';
		}
		html += "</ul>";

		pagination.append(html).find("li").eq(0).addClass("active");
		pagination.css("marginTop",pagination.height()/2*-1)

	}



	$.fn.moveTo = function(to,from){

		if(to == from){ return false;}
		
		if(from==undefined){
			from = $(".fs-section.active").index();
		}

		// before move callback
		if(typeof settings.beforeMove  === "function") {
			settings.beforeMove(to,from);
		}

		if(settings.pagination){
			$(".fs-pagination li").removeClass("active").eq(to).addClass("active");
		}

		if(settings.menu){

		}

		$(".fs-section").removeClass("active").eq(to).addClass("active");

		var dest = -to*100+"%"

		if($.support.css3translate3d){
			
			// use css3 translate3D which can use hardware acceleration
			elem.css({
				"-webkit-tranform":"translate3d(0,"+dest+",0)",
				"-webkit-transition":"all " + settings.animationDuration + "ms " + settings.easingcss3,
				"-o-tranform":"translate3d(0,"+dest+",0)",
				"-o-transition":"all " + settings.animationDuration + "ms " + settings.easingcss3,
				"-moz-transform-tranform":"translate3d(0,"+dest+",0)",
				"-moz-transition":"all " + settings.animationDuration + "ms " + settings.easingcss3,
				"-ms-tranform":"translate3d(0,"+dest+",0)",
				"-ms-transition":"all " + settings.animationDuration + "ms " + settings.easingcss3,
				"transform":"translate3d(0,"+dest+",0)",
				"transition": "all " + settings.animationDuration + "ms " + settings.easingcss3
			});

			// very powerful
			if(typeof settings.afterMove === "function"){
				elem.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
      		settings.afterMove(to,from);
   			});
			}
			

		} else {
			
			// use jQuery elem.animate function
			elem.animate({"top":dest},settings.animationDuration,settings.easing,function(){
				if(typeof settings.afterMove === "function"){
					settings.afterMove(to,from);
				}
			})

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
			$.fn.moveTo(to,from);
		}

	}


	// TODO 
	function resize(){
		var winWidth = $(window).width(),
			winHeight = $(window).height();
	};



	function mouseWheelHandler(e) {

		e.preventDefault();

		if (!isScrolling) {

			
			var current = $(".fs-section.active").index();

			
			// TODO 鼠标事件的兼容处理
    	var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
			
			if (delta < 0) {
				if(!settings.loop && current == sectionLength-1){
			 		return false;
			 	}
			 	elem.moveUp();
			}else if(delta>0 && current){
				if(!settings.loop && current == 0){
			 		return false;
			 	}
				elem.moveDown()
			}

			isScrolling = true; 
			scrollID = setTimeout(function(){isScrolling = false},settings.animationDuration+settings.animationCD)

		}	
		
	}



	// TODO  FF bug fix
	// TODO 是否绑定Moz。。。事件
	$(document).on('mousewheel DOMMouseScroll',mouseWheelHandler);


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
					elem.moveTo(sectionLength-1);
				}
			}
		});
	}


	function supportCSS3Translate3d() {
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

})(window.jQuery)