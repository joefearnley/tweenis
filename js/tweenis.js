/**
 * @author: joe fearnley
 * @date:   03.21.09
 * @file:   tweenis.js
 *
 * This file contains all the javascript for tweenis.net.
 */

$(document).ready(function() {
    $.getJSON('http://search.twitter.com/search.json?q=penis&rpp=10&callback=?', 
        function(response) {
            var html = '';
            $.each(response.results, function(i, tweet) {
                html += (typeof tweet != 'undefined') ?  getTweetContent(tweet) : '';
            });
            $('#main').html(html);
        });
    var interval = setInterval(updateList, 10000);
});

/**
 * Check for update by searching twitter API
 */
function updateList() {
    var firstId = $('#main').find('blockquote:first').attr('id');
    var lastId = $('#main').find('blockquote:last').attr('id');

    $.getJSON('http://search.twitter.com/search.json?q=penis&since_id='+firstId+'&callback=?', 
        function(response) {
            var tweet = response.results[0];
            if(typeof tweet!= 'undefined') {
                var html = getTweetContent(tweet);
                $('#main').prepend(html);
                $('#'+tweet.id).hide();
                $('#'+tweet.profile_image_url).show('slow');
                $('#'+lastId).remove();
            }
        });
    return false;
}

/**
 * Create the html for an individual tweet.
 * @param tweet
 */
function getTweetContent(tweet) {
    var html = '';
    html += '<blockquote id="'+tweet.id+'">';
    html += '<p>';
    html += '<img src="http://img.tweetimag.es/i/'+tweet.from_usert+'_n"  height="48" width="48" />';
    html += '<a href="http://twitter.com/'+tweet.from_user+'" class="bold">'+tweet.from+'</a> says ';
    html += '<br />'+tweet.text.parseURL().parseUsername().parseHashtag();
    html += '</p>';
    html += '</blockquote>';
    return html;
}

/**
 * handle regex for @ replies, links, and hashtags.
 * http://www.simonwhatley.co.uk/parsing-twitter-usernames-hashtags-and-urls-with-javascript
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
