const express = require("express");
const router = express.Router();
const Contribution = require("../models/Contribution");

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//GET ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//find user by id
router.get("/:id", async (req, res) => {
  Contribution.findById(req.params.id, (err, contribution) => {
    if (err) {
      console.log(err.message);
      const error = {
        userFound: false,
        error: true,
        message: "error could not find user",
      };
      res.status(400).send(error);
    } else {
      res.send(contribution);
    }
  });
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//POST ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.post("/create", (req, res) => {
  Contribution.create(req.body, (err, contribution) => {
    if (err) {
      console.log(err.message);
      // handle error
      const error = {
        userFound: false,
        error: true,
        message: "error could not find user",
      };
    }
    console.log("created the following contribution in DB", contribution);

    res.send(contribution);
  });
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  PUT / UPDATE ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.put("/update/:id", (req, res) => {
  console.log("heres what we got..............", "\n", req.body);
  Contribution.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, contribution) => {
      if (err) {
        console.log(err.message); // handle error
        const error = {
          userUpdated: false,
          error: true,
          message: "error could not update user",
        };
        res.status(400).send(error);
      }
      console.log("updated the following user in DB", contribution);

      res.send(contribution);
    }
  );
});

module.exports = router;
