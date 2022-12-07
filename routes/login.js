const express = require("express");
var app = express();
const router = express.Router();
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");
var crypto = require("crypto");

const mongoose = require("mongoose");
const session = require("express-session");

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require("connect-mongo")(session);

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Middleware that allows Express to parse through both JSON and x-www-form-urlencoded request bodies
// These are the same as `bodyParser` - you probably would see bodyParser put here in most apps
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connection = mongoose.createConnection(process.env.DB_STRING);

//Note that the `connection` used for the MongoStore is the same connection that we are using above

const sessionStore = new MongoStore({
 mongooseConnection: connection,
 collection: "sessions",
});

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}


passport.use(
  new LocalStrategy(function (username, password, cb) {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return cb(null, false);
        }

        // Function defined at bottom of app.js
        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      })
      .catch((err) => {
        cb(err);
      });
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());


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




