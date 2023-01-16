const express = require("express");
const router = express.Router();
const Gift = require("../models/Gift");

require("dotenv").config({ path: require("find-config")(".env") });

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

router.get("user/:id", async (req, res) => {
  Gift.findOne({ giftOwnerID: req.params.giftOwnerID }, (err, gift) => {
    if (err) {
        console.log(err.message);
        const error = {
            userFound: false,
            error: true,
            message: "error could not find gift",
        };
        res.status(400).send(error);
    } else {
        res.send(gift);
    }
});
});

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

    res.send(createdGift);
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
