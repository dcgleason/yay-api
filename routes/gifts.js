const express = require("express");
const router = express.Router();
const Gift = require("../models/Gift");

require("dotenv").config({ path: require("find-config")(".env") });

//gifts Home page
router.post("/create", (req, res) => {
  // do we need to add a timestamp object here? or will it timestamp it automatically?

  Gift.create(req.body, (err, createdGift) => {
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

router.get("/messages", async (req, res) => {
  res.send("Messages home page!!!");
});

module.exports = router;
