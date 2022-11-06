
const express = require("express");
const router = express.Router();
const Gift = require("../models/Gift");



require("dotenv").config({ path: require("find-config")(".env") });

<<<<<<< HEAD
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//GET ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//find user by id
router.get("/:id", async (req, res) => {
  Gift.findById(req.params.id, (err, gift) => {
    if (err) {
      console.log(err.message);
      const error = {
        userFound: false,
        error: true,
        message: "error could not find user",
      };
      res.status(400).send(error);
    } else {
      res.send(gift);
    }
  });
});
=======
//gifts Home page

router.post("/create", (req, res) => {
  // do we need to add a timestamp object here? or will it timestamp it automatically?
>>>>>>> b5f9e57eace7fb39956854f0f533bd45dc7dc534

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//POST ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//gifts create route
router.post("/create", (req, res) => {
  Gift.create(req.body, (err, createdGift) => {
    if (err) {
      console.log(err.message);
      // handle error
      const error = {
        userFound: false,
        error: true,
        message: "error could not find user",
      };

      res.status(400).send(error);
    }
    console.log("created the following gift in DB", createdGift);

<<<<<<< HEAD
    res.send(createdGift);
=======

    res.send(createdUser);
>>>>>>> b5f9e57eace7fb39956854f0f533bd45dc7dc534
  });
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  PUT / UPDATE ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

router.put("/update/:id", (req, res) => {
  console.log("heres what we got..............", "\n", req.body);
  Gift.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedGift) => {
      if (err) {
        console.log(err.message); // handle error
        const error = {
          userUpdated: false,
          error: true,
          message: "error could not update user",
        };
        res.status(400).send(error);
      }
      console.log("updated the following user in DB", updatedGift);

      res.send(updatedGift);
    }
  );
});

module.exports = router;
