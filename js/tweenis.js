$(function() {

  var TwitterCall = function(data) {
    var tweetTemplate = $('#tweetTemplate').html();
    var errorTemplate =  $('#errorTemplate').html();

    var searchParameters = '';
    $.each(data, function(key, value) {
      searchParameters += key + '=' + value + '&';
    });

    $.getJSON('http://search.twitter.com/search.json?' + searchParameters + '&callback=?',
      function(response) {
        if(response.error) {
          $('#tweets').html(Mustache.to_html(errorTemplate, response));
          return false;
        }

        $.each(response.results, function(i, tweet) {
          tweet.text = $.linkify(tweet.text);
          $('#tweets').prepend(Mustache.to_html(tweetTemplate, tweet));

          if(searchParameters.indexOf('since_id') !== -1) {
            $('#'+tweet.id).hide().show('slow');
          }
        });
      });
  };

  var queryData = {
    'q': 'penis',
    'rrp': 10
  };

  var call = new TwitterCall(queryData);

  var interval = setInterval(function() {
    queryData.since_id = $('#tweets').find('blockquote:first').attr('id');
    queryData.rpp = 1;
    var call = new TwitterCall(queryData);
  }, 5000);

});

