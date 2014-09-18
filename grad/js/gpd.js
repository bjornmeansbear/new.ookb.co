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

});