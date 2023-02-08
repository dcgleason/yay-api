const express = require("express");
const router = express.Router();
const Contribution = require("../models/Contribution");
// Import
const Transloadit = require('transloadit')
const request = require('request');

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
router.post('/create-document-one', (req, res) => { // two pages with audio

  console.log('req.body: ' + JSON.stringify(req.body.data));

  const options = {
    method: 'POST',
    url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NTUyMDEwMX0.UdXpUB_MtEJjP1BCKyRs0FNSP_53K7AvbEaQ-Fztohc' // fill in
    },
    body: {
      template: {
        id: '',  // first page of text and audio
        data: {
          name: req.body.data.name,
          letter: req.body.data.letter,
          qrcode: req.body.data.qrcode,
        } 
      },
      format: 'pdf',
      output: 'url',
      name: req.body.giftID + "-" + req.body.data.name + "-" + Date.now() // file name
    },
    json: true
  };
  
  request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    console.log("document URL body: " + JSON.stringify(body)); 
    // body.response is the url of the document
    const contribution = await Contribution.findOneAndUpdate({ associatedGiftID: req.body.giftID }, { contributionPageOneURL: body.response });
    if (!contribution) return res.status(404).send('Contribution not found');
    if (contribution){
      const optionsTwo = {
        method: 'POST',
        url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NTUyMDEwMX0.UdXpUB_MtEJjP1BCKyRs0FNSP_53K7AvbEaQ-Fztohc' // fill in
        },
        body: {
          template: {
            id: '',  // second apge of text no audio
            data: {
              name: req.body.data.name, // don't need this
              letter: req.body.data.letterTwo,
            } 
          },
          format: 'pdf',
          output: 'url',
          name: req.body.giftID + "-" + req.body.data.name + "-" + Date.now() // file name
        },
        json: true
      };
      
      request(optionsTwo, async function (error, response, body) {
        if (error) throw new Error(error);
        console.log("document URL body: " + JSON.stringify(body)); 
        // body.response is the url of the document
        const contributionTwo = await Contribution.findOneAndUpdate({ associatedGiftID: req.body.giftID }, { contributionPageTwoURL: body.response });
        if (!contributionTwo) return res.status(404).send('Contribution not found');
    
        res.send([contribution, contributionTwo] );
        
      });
    }
    
  });


  

});
  
router.post('/create-document-two', (req, res) => { // two pages with without audio
  console.log('req.body: ' + JSON.stringify(req.body.data));

  const options = {
    method: 'POST',
    url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NTUyMDEwMX0.UdXpUB_MtEJjP1BCKyRs0FNSP_53K7AvbEaQ-Fztohc' // fill in
    },
    body: {
      template: {
        id: '',  // fill in with page 1 template id
        data: {
          name: req.body.data.name,
          letter: req.body.data.letter,
        }  
      },
      format: 'pdf',
      output: 'url',
      name: req.body.giftID + "-" + req.body.data.name + "-" + Date.now() // file name
    },
    json: true
  };
  
  request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    console.log("document URL body: " + JSON.stringify(body)); 
    // body.response is the url of the document
    const contribution = await Contribution.findOneAndUpdate({ associatedGiftID: req.body.giftID }, { contributionPageOneURL: body.response });
    if (!contribution) return res.status(404).send('Contribution not found');
    if (contribution) {
      const optionsTwo = {
        method: 'POST',
        url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NTUyMDEwMX0.UdXpUB_MtEJjP1BCKyRs0FNSP_53K7AvbEaQ-Fztohc' // fill in
        },
        body: {
          template: {
            id: '', // fill in page 2 template id
            data: {
              name: req.body.data.name, // don't needt his
              letter: req.body.data.letterTwo,
            }  
          },
          format: 'pdf',
          output: 'url',
          name: req.body.giftID + "-" + req.body.data.name + "-" + Date.now() // file name
        },
        json: true
      };
      
      request(optionsTwo, async function (error, response, body) {
        if (error) throw new Error(error);
        console.log("document URL body: " + JSON.stringify(body)); 
        // body.response is the url of the document
        const contributionTwo = await Contribution.findOneAndUpdate({ associatedGiftID: req.body.giftID }, { contributionPageTwoURL: body.response });
        if (!contributionTwo) return res.status(404).send('Contribution not found');
    
        res.send([contribution, contributionTwo]);
        
      });
    }

    
  });



});
  
router.post('/create-document-three', (req, res) => { // one page with audio

  console.log('req.body: ' + JSON.stringify(req.body.data));

  const options = {
    method: 'POST',
    url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NTUyMDEwMX0.UdXpUB_MtEJjP1BCKyRs0FNSP_53K7AvbEaQ-Fztohc' // fill in
    },
    body: {
      template: {
        id: '571024', // fill in with page 1 tempalte ID
        data: {
          name: req.body.data.name,
          letter: req.body.data.letter,
          qrcode: req.body.data.qrcode,
        } 
      },
      format: 'pdf',
      output: 'url',
      name: req.body.giftID + "-" + req.body.data.name + "-" + Date.now() // file name
    },
    json: true
  };
  
  request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    console.log("document URL body: " + JSON.stringify(body)); 
    // body.response is the url of the document
    const contribution = await Contribution.findOneAndUpdate({ associatedGiftID: req.body.giftID }, { contributionPageOneURL: body.response });
    if (!contribution) return res.status(404).send('Contribution not found');
    if (contribution){
      const optionsTwo = {
        method: 'POST',
        url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NTUyMDEwMX0.UdXpUB_MtEJjP1BCKyRs0FNSP_53K7AvbEaQ-Fztohc' // fill in
        },
        body: {
          template: {
            id: '', // fill in with page 2 template id 
            data: { 
              name: req.body.data.name, //
              image: req.body.data.image,
            } 
          },
          format: 'pdf',
          output: 'url',
          name: req.body.giftID + "-" + req.body.data.name + "-" + Date.now() // file name
        },
        json: true
      };
      
      request(options, async function (error, response, body) {
        if (error) throw new Error(error);
        console.log("document URL body: " + JSON.stringify(body)); 
        // body.response is the url of the document
        const contributionTwo = await Contribution.findOneAndUpdate({ associatedGiftID: req.body.giftID }, { contributionPageTwoURL: body.response });
        if (!contributionTwo) return res.status(404).send('Contribution not found');
    
        res.send([contribution, contributionTwo]);
      
    });

    }
  })



});
  
router.post('/create-document-four', (req, res) => { // one page without audio

  console.log('req.body: ' + JSON.stringify(req.body.data));

  const options = {
    method: 'POST',
    url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NTUyMDEwMX0.UdXpUB_MtEJjP1BCKyRs0FNSP_53K7AvbEaQ-Fztohc' // fill in
    },
    body: {
      template: {
        id: '570862', // fill in with req.body.tempalateID
        data: {
          name: req.body.data.name,
          letter: req.body.data.letter,
        }  // fill in with req.body -- qrcode -- needs to proide a link to audio
      },
      format: 'pdf',
      output: 'url',
      name: req.body.giftID + "-" + req.body.data.name + "-" + Date.now() // file name
    },
    json: true
  };
  
  request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    console.log("document URL body: " + JSON.stringify(body)); 
    // body.response is the url of the document
    const contribution = await Contribution.findOneAndUpdate({ associatedGiftID: req.body.giftID }, { contributionPageOneURL: body.response });
    if (!contribution) return res.status(404).send('Contribution not found');
    if (contribution) {
      console.log("contribution: " + JSON.stringify(contribution));

      const optionsTwo = {
        method: 'POST',
        url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NTUyMDEwMX0.UdXpUB_MtEJjP1BCKyRs0FNSP_53K7AvbEaQ-Fztohc' // fill in
        },
        body: {
          template: {
            id: '570862', // fill in with req.body.tempalateID
            data: {
              name: req.body.data.name,
              image: req.body.data.qrcode,
            }  // fill in with req.body -- qrcode -- needs to proide a link to audio
          },
          format: 'pdf',
          output: 'url',
          name: req.body.giftID + "-" + req.body.data.name + "-" + Date.now() // file name
        },
        json: true
      };
      
      request(options, async function (error, response, body) {
        if (error) throw new Error(error);
        console.log("document URL body: " + JSON.stringify(body)); 
        // body.response is the url of the document
        const contributionTwo = await Contribution.findOneAndUpdate({ associatedGiftID: req.body.giftID }, { contributionPageTwoURL: body.response });
        if (!contributionTwo) return res.status(404).send('Contribution not found');
    
        res.send([contribution, contributionTwo]);
        
      });
    }

    
  });


  

});
  

router.post("/create-book", async (req, res) => {

  // get the contribution page URLs from MongoDB and have them listed in alphabetical order by first name

const giftID = req.body.giftID; // from the session data of next/auth when the user is logged in, to be developed.

  const contributions = await Contribution.find({ giftID })
    .sort({ name: 1 });

  const contributionURLArray = [];

  for (const contribution of contributions) {
    contributionURLArray.push(contribution.contributionPageOneURL);
    contributionURLArray.push(contribution.contributionPageTwoURL);
  }


  convertapi.convert('merge', {
    Files: contributionURLArray, // array of urls in alphabetical order per person, for each person it goes urlOne, urlTwo
    StoreFile: true,
  }, 'pdf').then(function(result) {
      console.log(result.file.url); // donloadable link! --> to send to Lulu
});




});

router.post('/convert-audio-to-mp3', async (req, res) => {
  console.log("req.body.blog: " + req);

  const buffer = Buffer.from(req.body.data.blob, 'binary');

  // Convert the buffer to an MP3 audio file using ffmpeg
  return new Promise((resolve, reject) => {
    ffmpeg(buffer)
      .audioCodec('libmp3lame')
      .audioBitrate(128)
      .audioChannels(2)
      .audioFrequency(44100)
      .format('mp3')
      .on('error', reject)
      .on('end', async () => {
        const audioFile = new Contribution({

          audioAddress: `http://localhost:3000/play/${audioFile._id}`,
        });

        // Save the contribution with the audio URL to the database
        try {
          await audioFile.save();
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .save('./audio.mp3');
  })
  .then(() => {
    res.send({
    message: 'Contribution created successfully',
    audioAddress: `http://localhost:3000/play/${audioFile._id}`,
    contribution_id: audioFile._id });
  })
  .catch(err => {
    res.status(500).send({ error: err.message });
  });
});


// route that lets you play the audio file (from the qr code)
router.get('/play/:id', async (req, res) => {
  const contribution = await Contribution.findById(req.params.id);
  if (!contribution) return res.status(404).send('Contribution not found');

  res.set('Content-Type', 'audio/mpeg');
  res.send(contribution.audioAddress);
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
