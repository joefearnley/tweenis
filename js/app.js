(function ($) {

  var tweets = [
    { id: 1, text: 'Tweet 1', username: 'twitter user 1', img_url: '' },
    { id: 2, text: 'Tweet 2', username: 'twitter user 2', img_url: '' },
    { id: 3, text: 'Tweet 3', username: 'twitter user 3', img_url: '' },
  ];

  var Tweet = Backbone.Model.extend({
    //initialize: function() {
    //  console.log('creating tweet');
    //},
    defaults: {
      id: 0,
      text: '',
      username: '',
      img_url: ''  // should have a place holder here.....
    }
  });

  var TweetList = Backbone.Collection.extend({
    model: Tweet,
    url: 'http://search.twitter.com/search.json?callback=?',
    parse: function(response) {
      return response.results;
    }
  });

  var TweetView = Backbone.View.extend({
    template: _.template($('#tweetTemplate').html()),

    render: function() {
      console.log(this.model);
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var TweenisView = Backbone.View.extend({
    el: $('#tweets'),

    initialize: function() {
      this.collection = new TweetList();
      this.collection.fetch({
        data: {
          q: 'penis',
          rpp: 10
        }
      });

      this.render();
    },

    render: function() {
      //var that = this;
//      _.each(this.collection.models, function(tweet) {
//        that.renderTweet(tweet);
//      }, this);
        $.each(this.collection.models, function(i, tweet) {
          console.log(tweet);
        });
    },

    renderTweet: function(tweet) {
      var tweetView = new TweetView({
        model: tweet
      });
      this.$el.prepend(tweetView.render().el);
    },

    addTweet: function() {
    }

  });

  var Tweenis2View = Backbone.View.extend({
    initialize: function() {
      this.render();
    },
    render: function() {
      $.getJSON('http://search.twitter.com/search.json?q=penis&rpp=10&callback=?', {
          q: 'penis',
          rpp: 10
        }, function(response) {
          $.each(response.results, function(i, tweet) {
            console.log(tweet);
          });
        })
    },

  });

  //var tweet_view = new TweenisView();
  var tweet_view = new Tweenis2View();
} (jQuery));
