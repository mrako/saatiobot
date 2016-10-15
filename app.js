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

var createTweet = co.wrap(function *(tweet) {
  if (tweet.text) {
    var response = yield twit.post('statuses/update', { status: tweet.text });
  }
});

var createTweetOnlyIfNew = co.wrap(function *(tweet) {
  var newTweet = yield db.Tweet.findOne({ where: { tweet_id: tweet.id } });

  if (!newTweet) {
    yield db.Tweet.create({tweet_id: tweet.id});

    createTweet(tweet);

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

    if (tweets.length > 0) {

      for (var i = 0; i < tweets.length; i++) {
        let tweet = tweets[i];
        
        if (yield createTweetOnlyIfNew(tweet)) {
          break;
        }
      }
    }
  }).catch(onerror);

  setTimeout(searchAndRetweet, 15 * 60 * 1000); // 15 minutes
}

db.sync().then(function() {
  searchAndRetweet();
});
