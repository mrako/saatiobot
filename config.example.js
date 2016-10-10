'use strict';

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://saatiobot:saatiobot@localhost/saatiobot',
  TWITTER: {
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: ''
  }
};
