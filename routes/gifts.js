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

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//POST ROUTES
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// gifts create route
router.post("/create", (req, res) => {

  if (!req.body || !req.body.owner || !req.body.gift) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  const { owner, gift } = req.body;
  
  // Extract fields from the request body
  const giftOwnerID = owner.ownerEmail;
  const recipientName = gift.recipient;
  const date = gift.date; // Extract the date field
  
  // Create a new gift object with the extracted fields
  const newGift = {
    giftOwnerID,
    recipientName,
    date // Include the date field
  };

  // Save the new gift object in the database
  Gift.save(newGift, (err, createdGift) => {
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
