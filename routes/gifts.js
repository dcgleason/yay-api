const express = require("express");
const router = express.Router();
const Gift = require("../models/Gift");
const Response = require("../models/Response");
const Image = require("../models/Image");
var multer = require("multer");

require("dotenv").config({ path: require("find-config")(".env") });

//gifts Home page
router.post("/insertOrder", async (req, res) => {
  res.send("GIFTS home page!!!");

  const addressObj = {
    address: req.body.owner.shipping.address,
    city: req.body.owner.shipping.city,
    state: req.body.owner.shipping.state,
    zip: req.body.owner.shipping.zipCode,
    country: req.body.owner.shipping.country,
    phone: req.body.owner.shipping.phone,
  };

  const ownerObj = {
    ownerName: req.body.owner.ownerName,
    ownerEmail: req.body.owner.ownerEmail,
    shipping: addressObj,
  };

  const gift = {
    owner: ownerObj,
    //gifts have one owner
    uniqueId: req.body.gift.giftCode,
    // uniqueId is unqiue to the user
    messages: req.body.messages,
    //contributers are an array of contributer ids -- starts as an empty array
    contributorIDs: [],
    recipient: req.body.gift.recipient,
    fiveDays: false,
    sent: false,
  };

  // do we need to add a timestamp object here? or will it timestamp it automatically?

  await Gift.create(gift, (err, createdItem) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(createdItem);
      res.sendStatus(200);
    }
  });
});

router.get("/messages", async (req, res) => {
  res.send("Messages home page!!!");
});

//router.post("/", upload.single("image"), (req, res, next) => {});

router.post("/messages", upload.single("image"), async (req, res) => {
  const response = {
    giftID: 12345,
    questionOne: req.body.questionOne,
    contributor: req.body.contributorName,
    recipientName: req.body.recipientName,
    recipientStreet: req.body.recipientStreet,
    recipientCity: req.body.recipientCity,
    recipientZip: req.body.recipientZip,
    recipientCountry: "USA",
    published: false,
  };

  var obj = {
    img: {
      data: req.body.image,
      contentType: "image/png",
    },
  };
  Image.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect("/");
    }
  });

  await Response.create(response, (err, createdItem) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(createdItem);
      res.sendStatus(200);
    }
  });
});

router.get("/about", (req, res) => {
  res.send("About GIFTS page");
});

module.exports = router;
