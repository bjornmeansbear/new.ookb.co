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

// HIDE AND SHOW NAV AND MAIN CONTENT FOR LARGER DISPLAYS
    $(document).ready(function(){
      $(".home nav.mainnav").hide();
      $(".home #main article").hide();
      $(".home #pager").hide();
    });
    
    //set width of the nav element at the top
    var w = $(window).width()
    $("nav.mainnav").css("width", w-40 + "px" ); 
    
    // set position for stuff to come in at
    var startY = $('header').position().top + 60;
    
    $(window).scroll(function(){
        checkY();
    });
    
    function checkY(){
      if($(window).scrollTop() > startY ){
         $("nav.mainnav").slideDown(500);
         $("#main article").fadeIn(750);
         $("#pager").fadeIn(750);
         $("#pagedown").fadeOut(250);
      }
    }
    // Do this on load just in case the user starts half way down the page
    checkY();
    
    $("#pagedown").click(function() {
      $(this).fadeOut(750);
    });
// END HIDING/SHOWING NAV    

// Parallax Scrolling for the SiteName -->
$(window).scroll(function(){
  var s = $(window).scrollTop();
  $("header h1 .first").css("transform","translateY(" + (s*-1.11) + "px)");
  $("header h1 .middle").css("-webkit-transform","translateY(" + (s*-2.5) + "px)");
  $("header h1 .last").css("-webkit-transform","translateY(" + (s*-3.25) + "px)");
  $("#array li:nth-child(odd)").css("-webkit-transform","translateY(" + (s*-2.25) + "px)");
  $("#array li:nth-child(2)").css("-webkit-transform","translateY(" + (s*-3.25) + "px)");
  $("#array li:nth-child(4)").css("-webkit-transform","translateY(" + (s*-4) + "px)");
  $("#array li:nth-child(6)").css("-webkit-transform","translateY(" + (s*-3) + "px)");
  $("#array li:nth-child(8)").css("-webkit-transform","translateY(" + (s*-3.75) + "px)");
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
    var numRand    = Math.random()*33;
    var multiplier = Math.round(Math.random())*2-1;
    $(this).css('top', numRand*multiplier );
    $(this).css('left', numRand*multiplier );
    $(this).css("-webkit-transform","rotate(" + numRand*multiplier + "deg)");
  });
});

$(function() {
  $( ".dragme img" ).draggable();
});

// attempt to size the height of the draggable area correctly for now...
$(document).ready(function() {
  $("article.pile").height(867);
});

