'use strict';

var co = require('co');
var Twit = require('twit');

var config = require('./config');

var twit = new Twit(config);

function onerror(err) {
  console.error(err.stack);
}

function searchAndRetweet() {
  var params = {q: 'saatio'};

  co(function *() {
    var result = yield twit.get('search/tweets', params);

    if (result.data.statuses) {
      console.log(result.data.statuses[0].text);
    }
  }).catch(onerror);
}

searchAndRetweet();
