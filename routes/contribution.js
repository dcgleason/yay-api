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
// Configure AWS S3
// AWS.config.update({
//   accessKeyId: 'YOUR_ACCESS_KEY_ID',
//   secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
// });

// const s3 = new AWS.S3();

// POST route to upload PDF to S3 and store URL in MongoDB
router.post('/create', (req, res) => {

  const base64Data = new Buffer.from(req.body.pdf, 'base64');

  const params = {
    Bucket: 'YOUR_BUCKET_NAME', // add
    Key: `pdfs/${Date.now()}.pdf`,
    Body: base64Data,
    ContentEncoding: 'base64',
    ContentType: 'application/pdf'
  };

  s3.upload(params, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const pdf = new Contribution({ base64ContributionPage: data.Location });
      pdf.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send({ message: 'PDF uploaded and URL stored' });
        }
      });
    }
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
