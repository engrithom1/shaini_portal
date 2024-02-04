/****************************************************************************
 * UkiyoX v1.0
 * NFT Marketplace HTML Template by Gambolthemes
 * Copyright 2021 | Gambolthemes | https://gambolthemes.net
 * @package Gambolthemes
 ****************************************************************************/
 
/*----------------------------------------------
Index Of Script
------------------------------------------------

:: Page Loader
:: Tooltip Widget
:: Gallery filter 
:: See More
:: Dropdown Box Selection
:: Create Radio Button Tabs
:: Purchased Unlock Switch Toggle
:: Advanced Setting Switch Toggle
:: Owl Silder
:: Right Click Disable

------------------------------------------------
Index Of Script
----------------------------------------------*/

/*--- Preloader ---*/
;$(window).on('load', function () {
	$(".loader-ripple").fadeOut();
	$(".loader-container").delay(200).fadeOut("slow")
	
	
/*--- Gallery filter ---*/
	$('.featured-controls li').on('click', function () {
		$('.featured-controls li').removeClass('active');
		$(this).addClass('active');
	});
	if ($('.featured-filter').length > 0) {
		var containerEl = document.querySelector('.featured-filter');
		var mixer = mixitup(containerEl);
	}
});


/*--- Tooltip Widget ---*/
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})


/*---  See All ---*/
function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("readBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "See All"; 
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "See Less"; 
    moreText.style.display = "inline";
  }
}

/*--- Dropdown Box Selection ---*/
$(document).ready(function(){
$("select").change(function(){
	$( "select option:selected").each(function(){
		if($(this).attr("value")=="001"){
			$(".box").hide();
			$(".001").show();
		}
		if($(this).attr("value")=="002"){
			$(".box").hide();
			$(".002").show();
		}
		if($(this).attr("value")=="003"){
			$(".box").hide();
			$(".003").show();
		}
	});
}).change();
});

/*--- Create Radio Button Tabs ---*/
$(document).ready(function(){
    $('input[type="radio"]').click(function(){
        var inputValue = $(this).attr("value");
        var targetBox = $("." + inputValue);
        $(".marketplace_box").not(targetBox).hide();
        $(targetBox).show();
    });
});

/*--- Unlock Switch Button ---*/

$(document).ready(function(){
	$("#purchasedSwitch").on("change", function(e) {
  	const isOn = e.currentTarget.checked;
    
    if (isOn) {
    	$(".hide-redeem-input").show();
    } else {
    	$(".hide-redeem-input").hide();
    }
  });
});

/*--- Advanced Setting Switch Button ---*/

$(document).ready(function(){
	$("#adsettingSwitch").on("change", function(e) {
  	const isOn = e.currentTarget.checked;
    
    if (isOn) {
    	$(".hide-advanced-setting").show();
    } else {
    	$(".hide-advanced-setting").show();
    }
  });
});

/*--- Owl Sliders ---*/

// Top Sellers
$('.top-sellers-slider').owlCarousel({
	items:12,
	loop:false,
	margin:10,
	nav:true,
	dots:false,
	navText: ["<i class='uil uil-angle-left'></i>", "<i class='uil uil-angle-right'></i>"],
	responsive:{
		0:{
			items:2
		},
		600:{
			items:4
		},
		1000:{
			items:5
		},
		1200:{
			items:6
		},
		1400:{
			items:8
		}
	}
})

// Top Buyers
$('.top-buyers-slider').owlCarousel({
	items:12,
	loop:false,
	margin:10,
	nav:true,
	dots:false,
	navText: ["<i class='uil uil-angle-left'></i>", "<i class='uil uil-angle-right'></i>"],
	responsive:{
		0:{
			items:2
		},
		600:{
			items:4
		},
		1000:{
			items:5
		},
		1200:{
			items:6
		},
		1400:{
			items:8
		}
	}
})

// Live Auctions Slider
$('.live-auctions-slider').owlCarousel({
	items:10,
	loop:false,
	margin:20,
	nav:true,
	dots:false,
	navText: ["<i class='uil uil-angle-left'></i>", "<i class='uil uil-angle-right'></i>"],
	responsive:{
		0:{
			items:1
		},
		600:{
			items:2
		},
		800:{
			items:3
		},
		1000:{
			items:3
		},
		1200:{
			items:3
		},
		1400:{
			items:4
		}
	}
})

// Hot Bids Slider
$('.hot-bids-slider').owlCarousel({
	items:10,
	loop:false,
	margin:20,
	nav:true,
	dots:false,
	navText: ["<i class='uil uil-angle-left'></i>", "<i class='uil uil-angle-right'></i>"],
	responsive:{
		0:{
			items:1
		},
		600:{
			items:2
		},
		800:{
			items:3
		},
		1000:{
			items:3
		},
		1200:{
			items:3
		},
		1400:{
			items:4
		}
	}
})

// Hot Collections Slider
$('.hot-collection-slider').owlCarousel({
	items:10,
	loop:false,
	margin:20,
	nav:true,
	dots:false,
	navText: ["<i class='uil uil-angle-left'></i>", "<i class='uil uil-angle-right'></i>"],
	responsive:{
		0:{
			items:1
		},
		600:{
			items:2
		},
		800:{
			items:3
		},
		1000:{
			items:3
		},
		1200:{
			items:3
		},
		1400:{
			items:4
		}
	}
})

// Team Slider
$('.team-slider').owlCarousel({
	items:10,
	loop:false,
	margin:20,
	nav:true,
	dots:false,
	navText: ["<i class='uil uil-angle-left'></i>", "<i class='uil uil-angle-right'></i>"],
	responsive:{
		0:{
			items:1
		},
		600:{
			items:2
		},
		800:{
			items:3
		},
		1000:{
			items:3
		},
		1200:{
			items:3
		},
		1400:{
			items:4
		}
	}
})

// Work With Us Slider
$('.workus-slider').owlCarousel({
	items:3,
	loop:true,
	margin:20,
	nav:true,
	dots:false,
	autoHeight:true,
	navText: ["<i class='uil uil-angle-left'></i>", "<i class='uil uil-angle-right'></i>"],
	responsive:{
		0:{
			items:1
		},
		600:{
			items:1
		},
		800:{
			items:1
		},
		1000:{
			items:2
		},
		1200:{
			items:3
		},
		1400:{
			items:3
		}
	}
})

// Blogs Slider
$('.blogs-slider').owlCarousel({
	items:1,
	loop:true,
	margin:20,
	nav:false,
	dots:true,
	smartSpeed:800,
	autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
	responsive:{
		0:{
			items:1
		},
		600:{
			items:1
		},
		800:{
			items:1
		},
		1000:{
			items:1
		},
		1200:{
			items:1
		},
		1400:{
			items:1
		}
	}
})
/*--- Right Click Disable ---*/
window.oncontextmenu = function () {
	return true;
}
$(document).keydown(function (event) {
	if (event.keyCode == 123) {
		return false;
	}
	else if ((event.ctrlKey && event.shiftKey && event.keyCode == 73) || (event.ctrlKey && event.shiftKey && event.keyCode == 74)) {
		return false;
	}
});