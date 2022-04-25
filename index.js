const express = require("express");
const router = express.Router()
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const config = require('./config.js');
const cors = require('cors')
const app = express();
const path = require('path');
const axios = require('axios');
const pg = require('pg')
var id_queue = []
var array = []

let dotenv = require('dotenv');

// if .env file is located in root directory
dotenv.config()

app.use(express.static('frontend'));

app.get('/', (req, res) =>{
  res.send('You and Yours API - root');
})


app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001;

const bundle_model = require('./db_functions.js');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://youandyours.heroku.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});



// app.delete('/bundle/:id', (req, res) => {
//   bundle_model.deleteBundle(req.params.id)
//   .then(response => {
//     res.status(200).send(response);
//   })
//   .catch(error => {
//     res.status(500).send(error);
//   })
// })

app.post('/message', async (req,res) =>{

res.send('messsage');
var id = req.body.message_id;

axios
.get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages/${id}`,{
  headers: {
    authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
  }
})
.then(result => {
  console.log(`statusCode: ${result.status}`)
  console.log(result.data)
  res.send(result.data)
})
.catch(error => {
  console.error(error)
})

}
)

app.post('/messages', async (req,res) =>{

  res.send('messsages');

  var unique_id = req.body.unique;

axios
.get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages?q=in:sent subject:${unique_id}`,{
  headers: {
    authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
  }
})
.then(result => {
  console.log(`statusCode: ${res.status}`)
  console.log(result.data.messages)
  res.send(result.data.messages)
})
.catch(error => {
  console.error(error)
})

}
)

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

  app.get('/unique',  async (req, res) => {
  
    array = await bundle_model.getUniqueID();

    console.log("array ids" + array);
    res.send(array);
  })

app.post('/email', (req, res) => {
  res.send('email');

  var name = req.body.name
  var email = req.body.email
  var question = req.body.question
  var unique_id = req.body.unique_id
  console.log('emails' + email);
  console.log('questions' + question);
  console.log('inside post request' + unique_id);
    const OAuth2 = google.auth.OAuth2
  
    const OAuth2_client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);

    OAuth2_client.setCredentials( { refresh_token: process.env.GMAIL_REFRESH_TOKEN } );

    const accessToken = OAuth2_client.getAccessToken();

    const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken
    }
  })
    
    const mail_options_two = {
      from: 'You & Yours admin <admin@youandyours.io',
      to: email, 
      subject: 'Email from You & Yours web app' + '(Email ID: ' + unique_id + ')',
      html: '<h6>' + question  +'</h6>'
  }
    transport.sendMail( mail_options_two, function(error, result){
    if(error){
          console.log('Error: ',  error)
      }
      else {
          console.log("Success woo!:  ", result)
          id_queue.push({
          id: unique_id,
          results: result
          })
      }
      transport.close()
  })

})

app.post('/bundle', (req, res) => {
  res.send('bundle');
  var name = req.body.name
  var unique_id = req.body.unique_id
  const objCreate = {
    values: [name, unique_id]
  }
  bundle_model.createBundle(objCreate);
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = id_queue;