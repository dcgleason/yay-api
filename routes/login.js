const express = require("express");
var app = express();
const router = express.Router();
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));


app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


  app.post('/signup', function(req, res) { 
   var username = req.body.username;
  var password = req.body.password;
  var user = new User({username: username, password: password})
  user.save(function(err) {
    if (err) {
        console.log(err);
        res.send(500);
      } else {
        res.send(200);
      }
    });
  });




