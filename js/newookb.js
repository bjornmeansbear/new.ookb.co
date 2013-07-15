// smooth scrolling links
// Some Custom JS for the site
// scroll to content when you click on the logo. - retrieved from http://www.sycha.com/jquery-smooth-scrolling-internal-anchor-links
$(".scroll").click(function(event){		
	event.preventDefault();
	$('html,body').animate({scrollTop:$(this.hash).offset().top}, 800);
});

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

// setting up the cross bar to nicely frame loaded screen 

$(document).ready(function() {
  var wh = $(window).height();
  $('.jumbotron').css("margin-top",wh-44);
});