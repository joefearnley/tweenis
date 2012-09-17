(function ($) {

  var Tweet = Backbone.Model.extend({
    initialize: function() {
      console.log('creating tweet');
    },
    defaults: {
      id: 0,
      text: '',
      username: '',
      img_url: ''  // should have a place holder here.....
    }
  });

  var TweetList = Backbone.Collection.extend({
    model: Tweet
  });

  var TweetView = Backbone.View.extend({
    template: $('#tweetTemplate').html(),
    render: function() {
      var t = _.template(this.template);
      $(this.el).html(t(this.model.toJSON()));
      return this;
    }
  });

  var tweets = [
    { id: 1, text: 'Tweet 1', username: 'twitter user 1', img_url: '' },
    { id: 2, text: 'Tweet 2', username: 'twitter user 2', img_url: '' },
    { id: 3, text: 'Tweet 3', username: 'twitter user 3', img_url: '' },
  ];

  var TweenisView = Backbone.View.extend({
    el: $('#tweets'),

    initialize: function() {
      this.collection = new TweetList(tweets);
      this.render();
    },

    render: function() {
      var that = this;
      _.each(this.collection.models, function(tweet) {
        that.renderTweet(tweet);
      }, this);
    },

    renderTweet: function(tweet) {
      var tweetView = new TweetView({
        model: tweet
      });
      this.$el.append(tweetView.render().el);
    }

  });

  var tweet_view = new TweenisView();
} (jQuery));
