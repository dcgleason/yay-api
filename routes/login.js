const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const session = require("express-session");
var passport = require("passport");
var crypto = require("crypto");
var LocalStrategy = require("passport-local").Strategy;
var connect = require("../server");
const MongoStoreDB = require("connect-mongo");


/*
 * -------------- HELPER FUNCTIONS ----------------
 */

/*
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
 const validPassword = (password, hash, salt) => {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

/*
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 */

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

// Connect to MongoDB
mongoose.connect('mongodb+srv://dcgleason:F1e2n3n4!!@yay-cluster01.lijs4.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const store = MongoStoreDB.create({ 
  mongoUrl: 'mongodb+srv://dcgleason:F1e2n3n4!!@yay-cluster01.lijs4.mongodb.net/?retryWrites=true&w=majority',
  secret: 'story book time',
  touchAfter: 24 * 3600 // time period in seconds
})

// Configure passport and sessions
router.use(session({
  secret: 'story book time',
  resave: false,
  saveUninitialized: false,
  store: store,
}));


router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user) {
       if (validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
    
    }
  }
    
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


/**
 * -------------- ROUTES ----------------
 */

// /signin route
router.post('/signin', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login-failure' }));

// signup route
router.post("/signup", (req, res, next) => {
  console.log('inside /signup route');
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
  console.log("Connected to MongoDB / inside /signup route");
  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
  });

  newUser.save().then((user) => {
    console.log(user);
  });

// });
  res.redirect("/");
});

// Path: routes/index.js
router.get("/", (req, res, next) => {
  res.send("<h1>Home</h1>");
});




// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/signin");
});


router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});


module.exports = router;