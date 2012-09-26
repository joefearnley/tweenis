(function ($) {

  var Tweet = Backbone.Model.extend({
    defaults: {
      id: 0,
      text: '',
      from_user_name: '',
      profile_image_url: ''
    }
  });

  var TweetList = Backbone.Collection.extend({
    model: Tweet,
    url: 'http://search.twitter.com/search.json?callback=?',
    parse: function(response) {
      return response.results;
    }
  });

  var TweenisView = Backbone.View.extend({
    el: $('#tweets'),
    initialize: function() {
      this.collection = new TweetList();
      this.render();
    },

    render: function() {
      var that = this;
      this.collection.fetch({
        data: {
          q: 'penis',
          rpp: 10
        },
        success: function(response) {
          $.each(response.models, function(i, tweet) {
            tweet.attributes.text = $.linkify(tweet.attributes.text);
            that.renderTweet(tweet);
          });

          var intervalId = setInterval(function() {
            that.addTweet();
          }, 7000);
        }
      });
    },

    renderTweet: function(tweet) {
      var tweetView = new TweetView({
        model: tweet
      });
      this.$el.prepend(tweetView.render().el);
    },

    addTweet: function() {
      var latestTweetId = $('#tweets').children('div').first().children('blockquote').attr('id');
      var that = this;
      this.collection.fetch({
        data: {
          q: 'penis',
          rpp: 1,
          since_id: latestTweetId
        },
        success: function(response) {
          var tweetModel = response.models[0];
          tweetModel.attributes.text = $.linkify(tweetModel.attributes.text);
          that.renderTweet(tweetModel);
        }
      });
    }

  });

  var TweetView = Backbone.View.extend({
    template: _.template($('#tweetTemplate').html()),
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var tweet_view = new TweenisView();
} (jQuery));
