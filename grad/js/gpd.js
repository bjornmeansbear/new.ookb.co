$(document).ready(function() {

  var bgswitch = function() {
    if ($('#bigtabs li.you').hasClass('active') === true) {
      $('.tab-content ').addClass('you').removeClass('youplus');
    }
    if ($('#bigtabs li.youplus').hasClass('active') === true) {
      $('.tab-content ').addClass('youplus').removeClass('you');
    }
  };

  bgswitch();

  $('#bigtabs a').click(function() {
    if ($(this).parent('li').hasClass('you') === true) {
      $('.tab-content ').addClass('you').removeClass('youplus');
    }
    if ($(this).parent('li').hasClass('youplus') === true) {
      $('.tab-content ').addClass('youplus').removeClass('you');
    }
  });

  //make tab activatable by URL

  //trying to make the href location and tabs play along a little better...

  $(".mytabs li a").on("click", function(e) {
    e.preventDefault();
    var id = $(this).attr("href");
    window.location.hash = id;
    history.pushState(null, null, e.href);
    $(this).tab('show');
  });

  // on load of the page: switch to the currently selected tab
  $(window).bind("load", function() {
    var hashy = window.location.hash;
    if (location.hash) {
      console.log(hashy);
      history.pushState(null, null, hashy);
      window.scrollTo(0, 0);
      $('.mytabs li a[href="' + hashy + '"]').tab('show');
    }
    if (hashy === '#entrepreneur' || hashy === '#exhibiting' || hashy === '#writing' || hashy === '#teaching' || hashy === '#curating') {
      $('#bigtabs .you').removeClass('active');
      $('#maintabs .you').removeClass('active');
      $('#bigtabs .youplus').addClass('active');
      $('#maintabs .youplus').addClass('active');
    }
    else {
      $('#bigtabs .youplus').removeClass('active');
      $('#maintabs .youplus').removeClass('active');
      $('#bigtabs .you').addClass('active');
      $('#maintabs .you').addClass('active');
    }

  });

});