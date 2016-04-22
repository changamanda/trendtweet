var express = require('express');
var router = express.Router();
var session = require('express-session');
var shuffle = require('shuffle-array');

var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
  consumerKey: process.env.TREND_TWEET_CONSUMER_KEY,
  consumerSecret: process.env.TREND_TWEET_CONSUMER_SECRET,
  callback: 'http://127.0.0.1:3000/callback'
});

router.get('/trends', function(req, res, next) {
  console.log(req.session);
  twitter.trends("place", { id: "23424977" }, req.session.accessToken, req.session.accessTokenSecret, function(error, data, response) {
    if (error) {
      console.log(error);
    } else {
      var trends = shuffle(data[0].trends).slice(0, 6);
      res.json(trends);
    }
  });
});

module.exports = router;
