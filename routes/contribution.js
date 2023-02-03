const express = require("express");
const router = express.Router();
const Contribution = require("../models/Contribution");
// Import
const Transloadit = require('transloadit')

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
        id: 'REPLACE_TEMPLATE_ID', // fill in
        data: {id: 123, name: 'John Smith', birthdate: '2000-01-01', role: 'Developer'}   // fill in with req.body
      },
      format: 'pdf',
      output: 'base64',
      name: 'Invoice 123'
    },
    json: true
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body); // upload to MongoDB contributor model
  });

});
  


router.post('/audio-concat', (req, res) => {
  
// Init
const transloadit = new Transloadit({
  authKey: 'YOUR_TRANSLOADIT_KEY',
  authSecret: 'MY_TRANSLOADIT_SECRET',
})

// Set Encoding Instructions
const options = {
  files: {
    myfile_1: './dutch-anthem.mp3',
  },
  params: {
    steps: {
      ':original': {
        robot: '/upload/handle',
      },
      imported_postroll: {
        robot: '/http/import',
        url: 'https://demos.transloadit.com/inputs/german-anthem.mp3',
      },
      concatenated: {
        use: {
          steps: [
            {
              name: ':original',
              fields: 'file',
              as: 'audio_1',
            }, 
,            {
              name: 'imported_postroll',
              as: 'audio_2',
            }, 
          ],
        },
        robot: '/audio/concat',
        result: true,
        ffmpeg_stack: 'v4.3.1',
      },
      exported: {
        use: ['imported_postroll', 'concatenated', ':original'],
        robot: '/s3/store',
        credentials: 'YOUR_AWS_CREDENTIALS',
        path: '${unique_prefix}/both-anthems.${file.ext}',
        url_prefix: 'https://demos.transloadit.com/',
      },
    },
  },
}

// Execute
const result = await transloadit.createAssembly(options)

// Show results
console.log({ result })

})

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
