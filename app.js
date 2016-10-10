'use strict';

var co = require('co');
var _ = require('lodash');
var Twit = require('twit');

var config = require('./config');

var db = require('./db/database');

var twit = new Twit(config.TWITTER);

function onerror(err) {
  console.error(err.stack);
}

var cleanTwitterData = function(result) {
  var tweets = _.map(result.data.statuses, function(item){ return item; });
  return _.filter(tweets, function(t) { return /saatio/i.test(t.text); });
  //tweets = _.reject(tweets, function(item) { return _.includes(excludes, item.tweet_id); });

  //return tweets;
};

var createOrUpdateTweet = co.wrap(function *(tweet) {
  var newTweet = yield db.Tweet.findOne({ where: { id: tweet.id } });

  if (!newTweet) {
    yield db.Tweet.create({id: tweet.id});
    return true;
  }

  return false;
});

function searchAndRetweet() {
  var params = {q: 'saatio'};

  co(function *() {
    var result = yield twit.get('search/tweets', params);

    var tweets = cleanTwitterData(result);

    console.log(tweets);

    for (var i = 0; i < tweets.length; i++) {
      if (yield createOrUpdateTweet(tweets[i])) {
        console.log('stored tweet: ' + tweets[i].text);
      }
    }
  }).catch(onerror);
}

searchAndRetweet();
