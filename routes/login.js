const express = require("express");
var app = express();
const router = express.Router();
const User = require("../models/User");


app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var user = User.findOne({username: username}, function(err, user) {
      if (err) {
        console.log(err);
        res.send(500);
      } else if (!user) {
        res.send(404);
      } else {
        user.comparePassword(password, function(err, isMatch) {
          if (err) {
            console.log(err);
            res.send(500);
          } else if (isMatch) {
            res.send(200);
          } else {
            res.send(401);
          }
        });
      }
    });
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

