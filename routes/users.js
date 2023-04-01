const express = require("express");
const router = express.Router();
const User = require("../models/User");

//TODO: create the following functionality

// create user : DONE
// find user by id: DONE
// update user info: DONE
// bundle.com/users/
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//GET ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//users Home page
router.get("/", (req, res) => {
  res.send("Users home page!!!");
});

//find user by id
router.get("/:id", async (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log(err.message);
      const error = {
        userFound: false,
        error: true,
        message: "error could not find user"
      }
      res.status(400).send(error);
    } else {
      res.send(user);
    }
  });
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//POST ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/*
CREATE USER: 
create user is a post route that will accept an object with user data 
as an object and will return the created user object for use on the front end
*/
//TODO: TEST WHETHER THE ASSOCIATEDIDS ARRAY IS ABLE TO RECEIVE INFO
router.post("/create", (req, res) => {
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err.message);
      // handle error
      const error = {
        userFound: false,
        error: true,
        message: "error could not find user",
      };
    }
    console.log("created the following user in DB", createdUser);

    res.send(createdUser);
  });
});

// update user info
//when updating from the front end , must pull the original object, then
//push a new item to the gifts array and then use this route.
//this route will REPLACE VALUES especially in the associatedGifts array
router.put("/update/:id", (req, res) => {
  console.log("heres what we got..............", "\n", req.body);
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.log(err.message); // handle error
        const error = {
          userUpdated: false,
          error: true,
          message: "error could not update user",
        };
        res.status(400).send(error);
      }
      console.log("updated the following user in DB", updatedUser);

      res.send(updatedUser);
    }
  );
});

module.exports = router;
