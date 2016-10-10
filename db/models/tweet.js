'use strict';

var Sequelize = require('sequelize');
var sequelize = require('../sequelize');

var Tweet = sequelize.define('tweets', {
  id: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
});

module.exports = Tweet;
