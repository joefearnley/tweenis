/**
 *
 *	@author: joe fearnley
 *	@date:   03.21.09
 *	@file:   tweenis.js
 *
 *	This file contains all the common javascript functions for tweenis.
 */

/**
 * on page load, execute the following
 */
$(document).ready(function() {

	// first check to see if twitter is available.. oh wait, I keep getting a URI denied
	// error even though the documentation says it requires no authentication and I've tried
	// this with jsonp..what the hell?

	// make initial ajax call 
	$.getJSON("http://search.twitter.com/search.json?q=penis&rpp=10&callback=?",
		function(json) {

			// this will be out initial html 
			var html = "";

			// loop through results and build the html
			$.each(json.results, function(i,result) {
						
				// check array 
				if(typeof result != "undefined") {

					// put json data in to appropriate strings
					var tweetImageId = result.id;
					var tweetImageUrl = result.profile_image_url;
					var tweetUser = result.from_user;
					var tweetText =  result.text;
					
					// build new entry html
					html += "<blockquote id=\""+tweetImageId+"\">"
					html += "<p>";

					html += "<img src=\"http://img.tweetimag.es/i/"+tweetUser+"_n\"  height=\"48\" width=\"48\" /> <a href=\"http://twitter.com/"+tweetUser+"\" class=\"bold\">"+tweetUser+"</a> says <br />";
					html += tweetText.parseURL().parseUsername().parseHashtag();
					html += "</p>";
					html += "</blockquote>";
				}
			});

			// add the html to the feed
			$("#main").html(html);
		});

	// now update every 10 seconds
	var interval = setInterval(updateList, 10000);
});

/**
 * check for update by searching twitter API
 */
function updateList() {

	// get the id of the first and last in the list
	var firstId = $('#main').find("blockquote:first").attr("id");
	var lastId = $('#main').find("blockquote:last").attr("id");

	// make ajax call to get update
	$.getJSON("http://search.twitter.com/search.json?q=penis&since_id="+firstId+"&callback=?",
		function(json) {

			var result = json.results[0];

			// check for result
			if(typeof result != "undefined") {

				// put json data in to appropriate strings
				var tweetImageId = result.id;
				var tweetImageUrl = result.profile_image_url;
				var tweetUser = result.from_user;
				var tweetText = result.text;

				// build new entry html
				var html = "";
				html += "<blockquote id=\""+tweetImageId+"\">"
				html += "<p>";
				html += "<img src=\""+tweetImageUrl+"\" height=\"48\" width=\"48\"  /> <a href=\"http://twitter.com/"+tweetUser+"\" class=\"bold\">"+tweetUser+"</a> says <br />";
				html += tweetText.parseURL().parseUsername().parseHashtag();
				html += "</p>";
				html += "</blockquote>";

				// add the html to the feed
				$("#main").prepend(html);
				$("#"+tweetImageId).hide();
				$("#"+tweetImageId).show("slow");

				// remove the last entry in feed
				$("#"+lastId).remove();

			}
	});

	return false;
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
		var tag = t.replace("#","%23")
		return t.link("http://search.twitter.com/search?q="+tag);
	});
};
