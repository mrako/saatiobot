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

  tweets = _.filter(tweets, function(t) { return /saatio/i.test(t.text); });
  tweets = _.filter(tweets, function(t) { return !t.retweeted_status; });

  return tweets;
};

var createOrUpdateTweet = co.wrap(function *(tweet) {
  var newTweet = yield db.Tweet.findOne({ where: { tweet_id: tweet.id } });

  if (!newTweet) {
    yield db.Tweet.create({tweet_id: tweet.id});
    return true;
  }

  return false;
});

function searchAndRetweet() {
  var search = _.join(config.SEARCH_TERMS, ' OR ');
  console.log(search);
  var params = {q: search, count: 100};

  co(function *() {
    var result = yield twit.get('search/tweets', params);

    var tweets = cleanTwitterData(result);

    console.log('Found ' + tweets.length + ' tweets.');

    for (var i = 0; i < tweets.length; i++) {
      if (yield createOrUpdateTweet(tweets[i])) {
        console.log(tweets[i].text);
      }
    }
  }).catch(onerror);

  setTimeout(searchAndRetweet, 60 * 1000);
}


db.sync().then(function() {
  searchAndRetweet();
});
