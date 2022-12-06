const express = require("express");
const router = express.Router();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var db = mongoose.connect('mongodb://localhost/test');
var User = new Schema({
  username: String,
  password: String
});

var UserModel = mongoose.model('User', User);

passport.use(new LocalStrategy(
  function(username, password, done) {
    UserModel.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }
));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());

app.use(passport.session());


app.get('/', function(req, res) {
  res.send('Hello World');
});


app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.listen(3000);



