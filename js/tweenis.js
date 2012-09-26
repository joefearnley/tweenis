/**
 * All the javascript for tweenis.net.
 */

$(function() {

  var tweetTemplate = $('#tweetTemplate').html();
  var errorTemplate =  $('#errorTemplate').html();

  $.getJSON('http://search.twitter.com/search.json?q=penis&rpp=10&callback=?',
    function(response) {
      if(response.error) {
        $('#tweets').html(Mustache.to_html(errorTemplate, response));
        return false;
      }

      $.each(response.results, function(i, tweet) {
        tweet.text = $.linkify(tweet.text);
        $('#tweets').prepend(Mustache.to_html(tweetTemplate, tweet));
      });
    });

  var interval = setInterval(function() {
    var latestTweetId = $('#tweets').find('blockquote:first').attr('id');
    var earliestTweetId = $('#tweets').find('blockquote:last').attr('id');

    $.getJSON('http://search.twitter.com/search.json?q=penis&rpp=1&since_id='+latestTweetId+'&callback=?',
      function(response) {
        if(response.error) {
          $('#tweets').html(Mustache.to_html(errorTemplate, response));
          return false;
        }

        $.each(response.results, function(i, tweet) {
          tweet.text = $.linkify(tweet.text);
          $('#tweets').prepend(Mustache.to_html(tweetTemplate, tweet));
          $('#'+tweet.id).hide().show('slow');
          $('#'+earliestTweetId).remove();
        });

      });
  }, 5000);
});
