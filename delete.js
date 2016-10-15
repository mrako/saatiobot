'use strict';

var co = require('co');
var Twit = require('twit');

var config = require('./config');

var twit = new Twit(config.TWITTER);

var deleteTweet = co.wrap(function *(tweet_id) {
  yield twit.post('statuses/destroy/:id', { id: tweet_id });
});

if (process.argv.length <= 2) {
  console.log('Usage: node delete.js <tweet id>');
  process.exit(-1);
}

deleteTweet(process.argv[2]);
