$('#main .slideshow')
  .after(function(){$(this).parent().after('<div id="pager">') })
  .cycle({ 
    fx:    'fade',
    speed: 500,
    timeout: 0,
    next: '#main .ssnav .next',
    prev: '#main .ssnav .prev',
    pager: '#pager' 
});

    //set width of the nav element at the top
    var w = $(window).width()
    $("nav.mainnav").css("width", w-40 + "px" ); 
    

// END HIDING/SHOWING NAV    

// Parallax Scrolling for the SiteName -->
$(window).scroll(function(){
  var s = $(window).scrollTop();
  $("header h1 .first").css("transform","translateY(" + (s*-1.11) + "px)");
  $("header h1 .middle").css("-webkit-transform","translateY(" + (s*-2.5) + "px)");
  $("header h1 .last").css("-webkit-transform","translateY(" + (s*-3.25) + "px)");
});

// Some Custom JS for the site
// scroll to content when you click on the logo. - retrieved from http://www.sycha.com/jquery-smooth-scrolling-internal-anchor-links
$(".scroll").click(function(event){    
  event.preventDefault();
  $('html,body').animate({scrollTop:$(this.hash).offset().top}, 1000);
});

$(document).ready(function() {
  $('#array li img').each(function() {
    var numRand    = Math.random()*99;
    var multiplier = Math.round(Math.random())*2-1;
    $(this).css("-webkit-transform","rotate(" + numRand*multiplier + "deg)");
  });
});

//randomly assign some position values
$(document).ready(function() {
  $('.stack img').each(function() {
    var numRand0   = Math.random();
    var numRand1   = Math.random()*25;
    var numRand2   = Math.random()*50;
    var numRand3   = Math.random()*75;
    var numRand4   = Math.random()*101;
    var multiplier = Math.round(Math.random())*2-1;
    var ratios1    = numRand3/numRand0;
    var ratios2    = numRand4/numRand1;
    $(this).css('top', numRand3*multiplier );
    $(this).css('left', numRand4*multiplier );
    $(this).css("-webkit-transform","rotate(" + numRand1*multiplier + "deg)");
  });
});

$(function() {
  $( ".dragme img" ).draggable();
});

// attempt to size the height of the draggable area correctly for now...
// This needs to be done with a live-querying variable in the future
$(document).ready(function() {
  $("article.pile").height(867);
});


// Modal Window!!!
  $(".nav a.profilelink").click(function(event) {
    event.preventDefault();
    $('#profile').fadeIn(700);
  });

  // Some Custom JS for the site
  $(".ex, #profile").click(function(event) {
    event.preventDefault();
    $("#profile").fadeOut(400);
  });
