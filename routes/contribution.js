const express = require("express");
const router = express.Router();
const Contribution = require("../models/Contribution");
const multer = require("multer");
const upload = multer();
const axios = require("axios");
const aws = require("aws-sdk");
require("dotenv").config({ path: require("find-config")(".env") });
const uuid = require("uuid");


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

// code to incorperate 


const region = "us-east-1";
const bucketName = "dgbundle1";
const accessKeyId = process.env.AWS_ACCESS_KEY; //working
const secretAccessKey = process.env.AWS_SECRET; //working

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const generateUploadURL = async () => {
  const randUUID = uuid.v4();
  const imgName = randUUID + ".jpg";

  const params = {
    Bucket: bucketName,
    Key: imgName,
    Expires: 60 * 60 * 24 * 7, // 1 week
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
};


router.post("/create", upload.single("imageAddress"), async (req, res) => {
  try {
    // Generate the S3 upload URL
    const uploadURL = await generateUploadURL();

    // Upload the file to S3
    const file = req.file;
    if (file) {
      await axios.put(uploadURL, file.buffer, {
        headers: {
          "Content-Type": file.mimetype,
        },
      });
    }

    // Get the image URL
    const imageURL = uploadURL.split("?")[0];

    // Add the image URL to the request body as ImageAddress
    req.body.imageAddress = imageURL;

    // Create the contribution in the database
    const contribution = await Contribution.create(req.body);
    console.log("created the following contribution in DB", contribution);

    res.status(200).send({ message: "Contribution successfully created" });
  } catch (err) {
    console.log(err.message);
    // handle error
    const error = {
      userFound: false,
      error: true,
      message: "error could not create contribution",
    };
    res.status(400).send(error);
  }
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
