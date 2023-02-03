const express = require("express");
const router = express.Router();
const Contribution = require("../models/Contribution");
// Import
const Transloadit = require('transloadit')

var convertapi = require('convertapi')('vlman1y8KNerUdy7');

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
router.post('/create-document', (req, res) => {

  // create a document from the right template and then store it -- the url
  const request = require('request');

  const options = {
    method: 'POST',
    url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer REPLACE_BEARER_TOKEN' // fill in
    },
    body: {
      template: {
        id: 'REPLACE_TEMPLATE_ID', // fill in with req.body.tempalateID
        data: {id: 123, name: 'John Smith', birthdate: '2000-01-01', role: 'Developer'}   // fill in with req.body
      },
      format: 'pdf',
      output: 'url',
      name: 'Contributor Name + Date' // fill in with req.body.contributorName + Date.now()
    },
    json: true
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body); // upload to MongoDB contributor model as base64
  });

});
  

router.post("/create-book", (req, res) => {
  // get the contribution pages and create a book by first name alphabetical order then submits to Lulu for printing


convertapi.convert('merge', {
    Files: [
      '/path/to/bundlePageSpread.pdf', // url to the bundle page spread
      '/path/to/Bundle Gifter Console Wireframe.pdf'
    ],
    StoreFile: true,
  }, 'pdf').then(function(result) {
      console.log(result.file.url); // donloadable link! --> to send to Lulu
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
