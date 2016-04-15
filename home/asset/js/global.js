$(function(){

	//link floor to top
	$('a.link-floor').click( function() {
	    $('html, body').animate({
	        scrollTop: $( $.attr(this, 'href') ).offset().top
	    }, 500);
	    return false;
	});	

	//vertical category
	if ( ('.main-category-lv1').length > 0)
	{
		$(document).click(function(e) {
		    if (e.target.id != 'main-category' && !$('#main-category').find(e.target).length) 
		    {
		       	$('.main-category-lv1').find('li.maincat').removeClass('active');
		       	$('.main-category-lv1').find('.vertical-category').css({'opacity': 0, 'visibility': 'hidden'});
		    }
		});

	 	$('.tab-hover > li').click( function(e) {
	 		window.location = $(this).find('a').attr('href');
	 	});

		$('.main-category-lv3 .tab-hover > li ').hover( function(){
		    if($(this).hasClass('hoverblock') || $(this).hasClass('active'))
		    {
		    	return;
		    } else
		    {
		    	if ( $(this).hasClass('has-child') )
		    	{
		    		$(this).find('a').tab('show');
		    	} else 
		    	{
		    		$(this).closest('.sub-category-div').find('.main-category-lv4').find('.tab-pane.active').removeClass('active');
		    		$(this).closest('ul').find('.active').removeClass('active');
		    	}
		    }     
		});

		$('.main-category-lv2 .tab-hover > li ').hover( function(){
		    if($(this).hasClass('hoverblock') || $(this).hasClass('active'))
		    {
		    	return;
		    } else
		    {
		    	if ( $(this).hasClass('has-child') )
		    	{
		    		$(this).find('a').tab('show');
		    	} else 
		    	{
		    		$(this).closest('.sub-category-div').find('.main-category-lv3').find('.tab-pane.active').removeClass('active');
		    		$(this).closest('ul').find('.active').removeClass('active');
		    	}
		    }     
		});

		$('.main-category-lv1 > li').hover( function(e) {
		    e.stopPropagation();

			$(this).closest('.main-category-lv1').find('li.maincat').removeClass('active');
			$(this).closest('.main-category-lv1').find('.vertical-category').css({'opacity': 0, 'visibility': 'hidden'});

			if ($(this).hasClass('has-child'))
			{
				$(this).addClass('active');
				$(this).find('.vertical-category').css({'margin-left' : '0', 
					'visibility' : 'visible',
					'opacity' : 1});
			}
	 	});
	}

	//header sticky
	if ($('.header-sticky').length > 0)
	{
		$(window).scroll( function() {

			var posTop = 1;

			if ($('.navbar-muslim').length > 0)
			{
				posTop = 137;
			} else 
			{
				posTop = 100;
			}

			if ($(this).scrollTop() > posTop) 
			{  
		    	$('.header-sticky').addClass("active");
			} else
			{
			    $('.header-sticky').removeClass("active");
			}
		});
	}

	if ($('.owl-slider').length > 0)
	{
		$('.owl-slider').owlCarousel({
	        loop: true,
	        margin: 0,
    		autoWidth:true,
	        autoplay: true,
	        autoplayTimeout: 2000,
	        autoplayHoverPause: true,
	        responsiveClass: true,
	        responsive:{
	            0:{
	                items:1,
	                nav:true
	            },
	            728:{
	                items:3,
	                nav:false
	            },
	            996:{
	                items:5,
	                nav:true,
	                loop:false
	            } 
	        }
	    });


	    var owl = $(".owl-slider").data('owlCarousel');

	    $('.owlnext').click(function(){
	        owl.next();
	    });

	    $('.owlprev').click(function(){
	        owl.prev();
	    });
	}

	if ($('#carousel-headline').length > 0)
	{
		$('#carousel-headline').carousel({interval: 3000});
	}
	
});

(function($){

	/!* tab display system */
	$.fn.tabDisplay = function(){
		this.each(function(){
			var obj = $(this);
			var trigger = $('.tab-trigger', this);
			var konten = $('.display-list', this);

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
		$(this).on('click', function(e) {
			$('body').addClass('cart-show');
			e.preventDefault();

		});
	};

	$.fn.cartShowOff = function(){
		$(this).on('click', function(e) {
			$('body').removeClass('cart-show');
			e.preventDefault();
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

	FormForgatPassword.init();
	FormRegister.init();

	$('#slide-image').tabDisplay();
	$('#cart-show').cartShow();
	$('#cart-show-sticky').cartShow();
	$('#cart-show-off').cartShowOff();
	$('#cart-show-off-empty').cartShowOff();
	$('#dark-box-off').cartShowOff();

	$('.image-box-hover').on('click', function(){
		var url = $('.carousel-inner').find('.active').data('url')
		window.location = url;
	});

	$("img.lazy").show().lazyload({
        effect : "fadeIn",
        threshold : 200,
        failure_limit : 10
    });

    $('.grid').isotope({
        // options
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

    $('#table-dashboard-order').DataTable({
        "bFilter": false,
        "bInfo": false,
        "pagingType": "full_numbers",
        "order": [[ 1, "desc" ]],
        "aoColumnDefs": [
      	{ 
      		"bSortable": false, "aTargets": [ 1,2,3 ] 
      	}] 
    });

    $('#gender').checkboxpicker({
  		html: true,
  		offLabel: 'Wanita',
  		onLabel: 'Pria'
	}).change(function(){
		
	});

	$('#birthdate').datepicker({
        'format': 'dd-mm-yyyy',
        'autoclose': true
    });

});

//$('.default-slider').unslider();