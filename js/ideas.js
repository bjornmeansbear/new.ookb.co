$(window).resize(function() {
  var sw = $(window).width();
  $('#widthcounter p').text(sw);
});

$(window).scroll(function(){

  var s  = $(window).scrollTop();
  var wh = $(window).height();
  var dh = $(document).height();

  if ((s+wh)==dh) {
    $(window).scrollTop(0);
  } else {}
  
});
