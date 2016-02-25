$(function(){
	$('a').click(function(){
	    $('html, body').animate({
	        scrollTop: $( $.attr(this, 'href') ).offset().top
	    }, 500);
	    return false;
	});
});

(function($){

	/!* tab display system */
	$.fn.tabDisplay = function(){
		this.each(function(){
			var obj = $(this);
			var trigger = $('.tab-trigger' , this);
			var konten = $('.display-list' , this);

			trigger.on('click' , function(){
				var target = $(this).attr('rel');
				trigger.removeClass('tab-on');
				$(this).addClass('tab-on');
				konten.hide();
				$('#'+target , obj).show();
			});
		});
	};

	$.fn.cartShow = function(){
		$(this).on('click' , function(){
			$('body').addClass('cart-show');

		});
	};

	$.fn.cartShowOff = function(){
		$(this).on('click' , function(){
			$('body').removeClass('cart-show');

		});
	};

})(jQuery);

	/!* SLIDER */

	$.fn.sliding_scroll = function(){

		this.each(function(){

			var speed = 500;
			var interval_auto = 3000;
			var slide_skip = 5; 
			var pos = 1;

			var obj = $(this);
			var container = $('.slider-container' , this);
			var nav = $('.navBtn' , this);
			var slide_element = $('.slide_element' , this);
			var slide_child = $('.slide_child' , this);

			var width_container = container.width();
			var width_child = slide_child.width();
			var jumlah_child = (slide_child.length)/slide_skip;
			slide_element.width(width_child*jumlah_child*slide_skip);

			function slide(e){

				if(e == 'next'){

					if(pos < jumlah_child){ //slide maju

						slide_element.animate({
							'left' : '-='+slide_skip*width_child+'px',
						} , speed);

						pos++;

					} else if(pos == jumlah_child){ 

						slide_element.animate({
							'left' : '0',
						} , speed);

						pos = 1;
					}

				} else if(e == 'prev' && pos > 1){ //slide mundur

					slide_element.animate({
						'left' : '+='+slide_skip*width_child+'px',
					} , speed);

					pos--;

				}
			}

			nav.on('click' , function(){

				var method = $(this).attr('rel');

				slide(method); 

			});

			setInterval(function(){ slide('next'); } , interval_auto);


		});

	};

$(function(){
	$('#slide-image').tabDisplay();
	$('#cart-show').cartShow();
	$('#cart-show-off').cartShowOff();
	$('#dark-box-off').cartShowOff();

});


//$('.default-slider').unslider();