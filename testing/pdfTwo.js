const request = require('request');
const image = 'https://ibb.co/r6pT5Y2'
const imageSmall = 'https://ibb.co/rxKCVRS'

const Contribution = require("../models/Contribution");

const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwNGI0MGEwNzNlNzFiMTQzMzM2ZGVhZjlkMjFlYTEyZmE4MjVjZDUyNGY0OTlkZTg0ZWI1Njg4YmRkMTc4MTI1Iiwic3ViIjoiZGFuQHVzZWJ1bmRsZS5jbyIsImV4cCI6MTY3NTk0Nzk1MH0.ydVy8CLLbG4a3k-WbR4zFsZZU4FmYohFwjl62duIrv8'

const options = {
    method: 'POST',
    url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + jwt // fill in
    },
    body: {
      template: {
        id: '580509', // fill in with page 1 tempalte ID
        data: {
          name: "Danny",
          text: "Dear Eliza, <br> <br/> Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig Testing testnig  testing test Testing testnig testing test  Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test Testing testnig testing test <br> <br/>  Love, <br><br/> Danny",
          qrcode: 'www.yahoo.com',
        } 
      },
      format: 'pdf',
      output: 'url',
      name: '63c55c5ee92e0ca3cbbececf' + "-" + "Danny" + "-" + Date.now() // file name
    },
    json: true
  };
  
  request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    console.log("document URL body 1: " + JSON.stringify(body)); 
    // body.response is the url of the document
   // const contribution = await Contribution.findOneAndUpdate({ associatedGiftID: '63c55c5ee92e0ca3cbbececf' }, { contributionPageOneURL: body.response });
    // if (!contribution) return res.status(404).send('Contribution not found');
    // if (contribution){
      const optionsTwo = {
        method: 'POST',
        url: 'https://us1.pdfgeneratorapi.com/api/v4/documents/generate',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer '+jwt // fill in
        },
        body: {
          template: {
            id: '582018', // fill in with page 2 template id 
            data: {  //
              image: imageSmall,
            } 
          },
          format: 'pdf',
          output: 'url',
          name: '63c55c5ee92e0ca3cbbececf' + "-" + "Danny 2" + "-" + Date.now() // file name
        },
        json: true
      };
      
      request(optionsTwo, async function (error, response, body) {
        if (error) throw new Error(error);
        console.log("document URL body 2: " + JSON.stringify(body)); 
        // body.response is the url of the document
       // const contributionTwo = await Contribution.findOneAndUpdate({ associatedGiftID: '63c55c5ee92e0ca3cbbececf' }, { contributionPageTwoURL: body.response });
       // if (!contributionTwo) return res.status(404).send('Contribution not found');
    
     //  console.log(contributionTwo);    
    });

    // }
  })
