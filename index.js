const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const config = require('./config.js');
const cors = require('cors')
const express = require("express");
const app = express();
const path = require('path');
const axios = require('axios');
var cron = require('node-cron');
const pg = require('pg')
let dotenv = require('dotenv');
dotenv.config()
const stripe = require("stripe")(`${process.env.STRIPE_SECRET}`)
var id_queue = []
var array = []
const bundle_model = require('./db_functions.js');

app.use(cors())
app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

const { MongoClient } = require('mongodb');
const { zip } = require('lodash');
const url = 'mongodb+srv://dcgleason:F1e2n3n4!!@yay-cluster01.lijs4.mongodb.net/test'
const client = new MongoClient(url);
const dbName = 'yay-cluster01';

const PORT = process.env.PORT || 3001;


app.get('/', (req, res) =>{
  res.send('You and Yours API - root');
})

app.get('/secret', async (req, res) => {
   console.log('Making requests!')
   const intent = await stripe.paymentIntents.create({
    amount: 5000,
    currency: 'usd',
    metadata: {integration_check: 'accept_a_payment'}
  });

  const customer = await stripe.customers.create({
    description: 'My First Test Customer (created for API docs)',
  });


  res.json(intent);
})

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
  // need to run this daily to push all emails into mongodb database 

  res.send('messsages');

  var unique_id = req.body.unique;
  var messages = [];
axios
.get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages?q=in:inbox subject:${unique_id}`,{
  headers: {
    authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
  }
})
.then(result => {
  console.log(`statusCode: ${res.status}`)
  console.log(result.data.messages)
  res.send(result.data.messages)
  // in input component post email ID to mongodb
  // query all mongodb document daily and check date field to see if it's greater than 14 days, if it is, query messages by that email ID and then compile (put into local storage, make it into a pdf, post to google drive / dropbox, get link, post to lulu)
  // loop through available email IDS
  messages.push(result.data.messages)


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

app.post('/createdoc', (req, res) => {
  res.send('createdoc');

  var id = req.body.message_id;
  var ownerName = req.body.owner;
  var ownerEmail = req.body.ownerEmail;
  var address = req.body.address;
  var apartment = req.body.apartment;
  var city = req.body.city;
  var state = req.body.state;
  var zipCode = req.body.zipCode;
  var country = req.body.country;
  var phone = req.body.phone;
  var emailID = req.body.email_id
  var name = req.body.name
  var message_id_array = req.body.message_id_array // --> need to do a scheduled job to google inbox to get messages 

  var data = JSON.stringify({
      "datasource": "yay-cluster01",
      "databae": "yay_gift_orders",
      "collection": "dev",
      "document": {
          "createdAt": Date.now(),
          "owner": {
            "ownerName": ownerName,
            "ownerEmail": ownerEmail,
            "shipping": {
              "address": address + apartment,
              "city": city,
              "state": state,
              "zip": zipCode,
              "country": country,
              "phone": phone,
            }
          },
          "gift": {
              "emails" : message_id_array,
              "emailID": emailID,
              "recipient": name,
              "collected": false,
              "sent": false
          }

      }
  });
              
  var config = {
      method: 'post',
      url: 'https://data.mongodb-api.com/app/data-iwimv/endpoint/data/beta/action/insertOne',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': 'ebphXFd0EAI2Z2jxhlMoPLV4JuDxdb07xiwPpGQGuojbFla0NlHu69fJC4BssNfd'
      },
      data : data
  };
              
  axios(config)
      .then(function (response) {
          console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
          console.log(error);
      });


  // var name = req.body.name
  // var unique_id = req.body.unique_id
  // const objCreate = {
  //   values: [name, unique_id]
  // }
  // bundle_model.createBundle(objCreate);
});

const mongoConnect = async () => {
  var fortnightAgo = new Date(Date.now() - 12096e5).getTime();
  var todaysOrders = [];

  try {
   const client = new MongoClient(url);
  await client.connect();
  
  const gifts = client.db("yay_gift_orders").collection("dev");
  const update = await gifts.updateMany(
    { 'createdAt': { $lte: fortnightAgo }},
    { $set: { "gift.collected": true}}
  );
  console.log(update);
  const results = gifts.find(
    { $and: [ {"gift.collected": true}, {'gift.sent': false}] }
  )
  
  results.forEach((gift) => {
    todaysOrders.push(gift);
    })
  } 
  finally {
  await client.close();
  }
  }
  
cron.schedule('* * 12 * * 0-6', () => {
  console.log('Running a job every day at 12:00 pm at America/New_York timezone');
  mongoConnect();
}, {
  scheduled: true,
  timezone: "America/New_York"
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = {
  todaysOrders
}