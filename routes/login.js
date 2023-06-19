const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");
const session = require("express-session");
var passport = require("passport");
var crypto = require("crypto");
var LocalStrategy = require("passport-local").Strategy;
var connect = require("../server");
const MongoStoreDB = require("connect-mongo");
const cors = require("cors");
const jwt = require('jsonwebtoken');


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
          // If the user is valid, return the user object including the giftOwnerID
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

const corsOptions = {
  origin: ['https://www.usebundl.com',"https://www.console.givebundl.com","https://console.givebundl.com", 'http://localhost:3000', 'http://localhost:3001', 'https://wwww.usebundl.com/', "https://www.usebundl.com/"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}

router.get('/', (req, res) => {
  console.log('login route')
  res.status(200).send({ message: 'Login route!' });
}


);
// /signin route
router.post('/signin', cors(corsOptions), (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }

      // Define payload for JWT
      const payload = { userId: user._id, username: user.username, name: user.name };

      // Sign the JWT and send it in the response
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          console.error('Error signing token', err);
          return res.status(500).json({ message: 'Error signing token' });
        }

        // Send token as JSON response
        res.json({ token });
      });
    });
  })(req, res, next);
});

router.get("/success", cors(corsOptions), (req, res) => {
  if (req.user) {
    res.json({ userId: req.user._id });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// signup route
router.post("/signup", cors(corsOptions), async (req, res, next) => {
  console.log('inside /signup route');
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  console.log("Connected to MongoDB / inside /signup route");
  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    hash: hash,
    salt: salt,
  });

  try {
    // Save the new user to the database
    const savedUser = await newUser.save();
    console.log(savedUser);

    // Create a new book for the user
    const newBook = new Book({
      doc: {
        front: 'front cover text', // front cover ID
        back: 'back cover text', // back cover ID
      },
      rec_name: 'receiver name',
      userID: savedUser._id, // Set the userID field to the ID of the user
      messages: new Map(), // Initialize with an empty Map
    });

    // Save the new book to the database
    const savedBook = await newBook.save();

    // Send the user's ID as a response
    res.json({ userId: savedUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
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