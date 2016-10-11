var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/user');
var config = require('../config');
var init = require('./init');

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    
    var searchQuery = {
      someID: profile.id
    };

    var updates = {
      name: profile.displayName,
      someID: profile.id,
      avatar: profile.photos[0].value
    };

    var options = {
      upsert: true,
	  new   : true
    };

    // update the user if s/he exists or add a new user //
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {//this is a mongoose function
      if(err) {
        return done(err);
      } else {
        return done(null, user);//if there is no error returned return the user
      }
    });
  }

));

// serialize user into the session
init();


module.exports = passport;