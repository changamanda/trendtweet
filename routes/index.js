var express = require('express');
var router = express.Router();
var session = require('express-session');

var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
  consumerKey: process.env.TREND_TWEET_CONSUMER_KEY,
  consumerSecret: process.env.TREND_TWEET_CONSUMER_SECRET,
  callback: 'http://127.0.0.1:3000/callback'
});

router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
      console.log("Error getting OAuth request token : " + error);
    } else {
      req.session.token = requestToken;
      req.session.secret = requestTokenSecret;
      res.render('login', {link: twitter.getAuthUrl(requestToken)});
    }
  });
});

router.get('/callback', function(req, res, next) {
  twitter.getAccessToken(req.session.token, req.session.secret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
    if (error) {
      console.log(error);
    } else {
      req.session.accessToken = accessToken;
      req.session.accessTokenSecret = accessTokenSecret;
      res.redirect('/');
    }
  });
});

module.exports = router;
