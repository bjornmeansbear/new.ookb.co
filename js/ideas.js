$(window).resize(function() {
  var sw = $(window).width();
  $('#widthcounter p').text(sw);
});

$(window).load(function() {
  var wh = $(window).height();
  var ww = $(window).width();
  if (ww >= 980){
    $("#portrait").css("margin-top",(wh-144));
    $("#intro").css("margin-top",(-216));

    $(window).scroll(function(){
      var s    = $(window).scrollTop();
      var wh   = $(window).height();
      var dh   = $(document).height();

      var ratio1 = wh/(dh-wh-444);

      $("#portrait").css("transform","translateY(" + (s-(s*ratio1)) + "px)");
      $("#intro").css("transform","translateY(" + (s*.55) + "px)");
      $("#location").css("transform","translateY(" + (s*.4) + "px)");
      $("#currently").css("transform","translateY(" + (s*.4) + "px)");
      $("#whatelse").css("transform","translateY(" + (s*.2) + "px)");
      $("#lectures").css("transform","translateY(" + (s*.2) + "px)");
      $("#comma").css("transform","translateY(" + (s*-.1) + "px)");
      $("#bjornmeansbear").css("transform","translateY(" + (s*-.2) + "px)");
      $("#referencelinks").css("transform","translateY(" + (s*-.3) + "px)");
      $("#contact").css("transform","translateY(" + (s*-.4) + "px)");
      $("footer").css("transform","translateY(" + (s*-.5) + "px)");
      if ((s+wh)>=dh) {
        $(window).scrollTop(0);
      } else {}
    });
  } else { }
});

$(window).resize(function() {
  var wh = $(window).height();
  var ww = $(window).width();
  if (ww >= 980){
    $("#portrait").css("margin-top",(wh-144));
    $("#intro").css("margin-top",(-216));

    $(window).scroll(function(){
      var s    = $(window).scrollTop();
      var wh   = $(window).height();
      var dh   = $(document).height();

      var ratio1 = wh/(dh-wh-444);

      $("#portrait").css("transform","translateY(" + (s-(s*ratio1)) + "px)");
      $("#intro").css("transform","translateY(" + (s*.55) + "px)");
      $("#location").css("transform","translateY(" + (s*.4) + "px)");
      $("#currently").css("transform","translateY(" + (s*.4) + "px)");
      $("#whatelse").css("transform","translateY(" + (s*.2) + "px)");
      $("#lectures").css("transform","translateY(" + (s*.2) + "px)");
      $("#comma").css("transform","translateY(" + (s*-.1) + "px)");
      $("#bjornmeansbear").css("transform","translateY(" + (s*-.2) + "px)");
      $("#referencelinks").css("transform","translateY(" + (s*-.3) + "px)");
      $("#contact").css("transform","translateY(" + (s*-.4) + "px)");
      $("footer").css("transform","translateY(" + (s*-.5) + "px)");
      if ((s+wh)>=dh) {
        $(window).scrollTop(0);
      } else {}
    });
  } else { }
});