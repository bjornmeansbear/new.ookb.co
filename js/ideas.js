$(window).resize(function() {
  var sw = $(window).width();
  $('#widthcounter p').text(sw);
});

$(window).load(function(){
  //declaring variables
  var s  = $(window).scrollTop();
  var wh = $(window).height();
  var dh = $(document).height();
  var ww = $(window).width();

  if (ww >= 980){
    $("#portrait").css("margin-top",wh+144);
    $(window).scroll(function(){
      var s  = $(window).scrollTop();
      var wh = $(window).height();
      var dh = $(document).height();
      $("#portrait").css("-webkit-transform","translateY(" + (s*-.1) + "px)");
      $("#intro").css("-webkit-transform","translateY(" + (s*-.25) + "px)");
      $("#location").css("-webkit-transform","translateY(" + (s*-.2) + "px)");
      $("#currently").css("-webkit-transform","translateY(" + (s*-.8) + "px)");
      $("#whatelse").css("-webkit-transform","translateY(" + (s*-.4) + "px)");
      $("#lectures").css("-webkit-transform","translateY(" + (s*-1) + "px)");
      $("#comma").css("-webkit-transform","translateY(" + (s*-.6) + "px)");
      $("#bjornmeansbear").css("-webkit-transform","translateY(" + (s*-.8) + "px)");
      $("#referencelinks").css("-webkit-transform","translateY(" + (s*-1) + "px)");
      $("#contact").css("-webkit-transform","translateY(" + (s*-2) + "px)");
      $("footer").css("-webkit-transform","translateY(" + (s*-1) + "px)");
      if ((s+wh)==dh) {
        $(window).scrollTop(0);
      } else {}
    });
  } else {}
  
});