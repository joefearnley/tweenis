/**
 * @author: joe fearnley
 *
 * This file contains all the javascript for tweenis.net.
 */

$(function() {

  var tweetTemplate = $('#tweetTemplate').html();
  var errorTemplate =  $('#errorTemplate').html();

  console.log($.load('templates/tweetTemplate.html'));

  $.getJSON('http://search.twitter.com/search.json?q=penis&rpp=10&callback=?',
    function(response) {
      if(response.error) {
        $('#tweets').html(Mustache.to_html(errorTemplate, response));
        return false;
      }

      $.each(response.results, function(i, tweet) {
        tweet.text = $.linkify(tweet.text);
        //console.log(tweet.text);
        console.log(tweetTemplate);
        $('#tweets').prepend(Mustache.to_html(tweetTemplate, tweet));

//        tweet.text = tweet.text.parseURL().parseUsername().parseHashtag();
//        var data = { name: 'google' };
//        var template_t = '<p><a href="http://google.com">{{ name }}</a></p>';
//        console.log(template_t);
//        $('#tweets').prepend(Mustache.to_html(template_t, data));
      });
    });
/*
  var interval = setInterval(function() {
    var latestTweetId = $('#tweets').find('blockquote:first').attr('id');
    var earliestTweetId = $('#tweets').find('blockquote:last').attr('id');

    $.getJSON('http://search.twitter.com/search.json?callback=?', {
        data:
          'q': 'penis',
          'rpp': 1,
          'since_id': latestTweetId
      }, function(response) {
        var template = $('#tweetTemplate').html();
        $.each(response.results, function(i, tweet) {
          var html = Mustache.to_html(template, tweet);
          $('#tweet').prepend(html);
          $('#'+tweet.id).hide();
          $('#'+tweet.id).show('slow');
          $('#'+lastId).remove();
        });

      });
  }, 10000);
*/
});

/**
 * Linkify @ replies , links, and hashtags.
 * http://www.simonwhatley.co.uk/examples/twitter/prototype/
 */
String.prototype.parseURL = function() {
  return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(url) {
    return url.link(url);
  });
};

String.prototype.parseUsername = function() {
  return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
    var username = u.replace("@","")
    return u.link("http://twitter.com/"+username);
  });
};

String.prototype.parseHashtag = function() {
  return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
    var tag = t.replace('#','%23')
    return t.link('http://search.twitter.com/search?q='+tag);
  });
};
