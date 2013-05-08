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

    initialize: function(parms) {
      this.collection = new TweetList();
      this.render();
      this.template = parms.template;
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
            tweet.attributes.text = linkify(tweet.attributes.text);
            that.renderTweet(that.template, tweet);
          });

          var intervalId = setInterval(function() {
            that.addTweet();
          }, 7000);
        }
      });
    },

    renderTweet: function(template, tweet) {
      var tweetView = new TweetView({
        template: template,
        model: tweet
      });

      this.$el.prepend(tweetView.render().el);
      $('#'+tweet.id).hide().show('slow');
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
          tweetModel.attributes.text = linkify(tweetModel.attributes.text);
          that.renderTweet(that.template, tweetModel);
        }
      });
    }

  });

  var TweetView = Backbone.View.extend({
    initialize: function(parms) {
      this.template = parms.template;
      this.model = parms.model;
    },
    render: function() {
      var html = Mustache.to_html(this.template, this.model.toJSON());
      $(this.el).html(html);
      return this;
    }
  });

  $.get('templates/tweet.html', function(tweetTemplate) {
    var tweenisView = new TweenisView({ template: tweetTemplate });
  });

}(jQuery));
