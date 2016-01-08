$(document).ready(function() {

  $.getJSON('http://2015.micagradshow.com/index.json', function(data) {

    //mustache for images
    var template = $('#student-info').html();
    var info = Mustache.to_html(template, data);
    $('#student-listing .list').html(info);

    var options = {
      valueNames: [ 'fname', 'lname', 'uid', 'program' ]
    };

    var studentList = new List('student-listing', options);

  });

});
