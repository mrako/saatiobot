'use strict';

var Sequelize = require('sequelize');
var sequelize = require('../sequelize');

var Tweet = sequelize.define('tweets', {
  tweet_id: {
    type: Sequelize.BIGINT,
    unique: true,
    allowNull: false
  }
});

module.exports = Tweet;
