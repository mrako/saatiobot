'use strict';

var sequelize = require('./sequelize');

exports.Tweet = require('./models/tweet');

exports.sync = function(options) {
  return sequelize.sync(options);
};

exports.transaction = function(options) {
  return sequelize.transaction(options);
};
