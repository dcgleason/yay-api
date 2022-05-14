const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors')
const express = require("express");
const app = express();
const path = require('path');
const axios = require('axios');
var cron = require('node-cron');
const pg = require('pg')
const mongoose= require('mongoose');
const multer  = require('multer')
const model = require('./model');
let dotenv = require('dotenv');
dotenv.config()


const stripe = require("stripe")(`${process.env.STRIPE_SECRET}`)
var id_queue = []
var array = []
var todaysOrders = [];
var todaysMessages = [];

var upload = multer({ dest: 'uploads/' });


app.use(cors({
  origin: "*",
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  exposedHeaders: '*'
}))
app.use(express.json())
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', '*');
//   next();
// });

const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://dcgleason:F1e2n3n4!!@yay-cluster01.lijs4.mongodb.net/test'
const dbName = 'yay-cluster01';

const PORT = process.env.PORT || 3001;


app.get('/', (req, res) =>{
  res.send('Amore Books API - root');
})

app.get('/secret', async (req, res) => {

   console.log('Making requests!')
   const intent = await stripe.paymentIntents.create({
    currency: 'usd',
    metadata: {integration_check: 'accept_a_payment'}
  });

  const customer = await stripe.customers.create({
    description: 'My First Test Customer (created for API docs)',
  });


  res.json(intent);
})

app.post('/updatePaymentIntent', async (req, res) => {

var amount = req.body.price;
var receipt_email = req.body.receipt_email;
  console.log('Making update - for price!')
//   const intent = await stripe.paymentIntents.update({
//    amount: amount,
//    receipt_email: receipt_email,
//    metadata: {integration_check: 'accept_a_payment'}
//  });

 res.json(intent);
})


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.post('/unique',  async (req, res) => { 

  var giftCode = req.body.gifCode

  try {
    const client = new MongoClient(url);
    await client.connect();
   
   const gifts = client.db("yay_gift_orders").collection("gift_orders");
   const order = gifts.findOne({"giftCode": giftCode});
   if(order){
     res.send(true)
   }
   else {
     res.send(false)
   }
  
   } 
   finally {
   await client.close();
   }
  })

app.post('/email', (req, res) => {
  res.send('email');

  var name = req.body.recipient
  var email = req.body.email
  var giftCode = req.body.giftCode
  var ownerName = req.body.ownerName
  var giftOwnerMessage = req.body.giftOwnerMessage;

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
      from: 'Amore Books <admin@youandyours.io', // change email address when we confirm name
      to: email, 
      subject: ownerName + 'selected you to contribute in a gift for ' + recipient + ' !',
      html: '<p> You have been selected to contribute to a Amore Books gift book! This means that' + ownerName + 'has asked you to write a positive or loving message for ' + name + '.  Your gift code is ' + giftCode  + '.  This message is from ' + ownerName+ ': ' + giftOwnerMessage + '. To contribute, go to ' + '<a href="https://amorebooks.io/write">www.amorebooks.io/write</a></p>'
  }
    transport.sendMail( mail_options_two, function(error, result){
    if(error){
          console.log('Error: ',  error)
      }
      else {
          console.log("Success woo!:  ", result)
      }
      transport.close()
  })

})

app.post('/insertOrder', async (req, res) => {
  console.log('createOrder');

  var createdAt= req.body.createdAt
  var ownerName = req.body.owner.ownerName;
  var ownerEmail = req.body.owner.ownerEmail;
  var address = req.body.owner.shipping.address;
  var city = req.body.owner.shipping.city;
  var state = req.body.owner.shipping.state;
  var zipCode = req.body.owner.shipping.zipCode;
  var country = req.body.owner.shipping.country;
  var phone = req.body.owner.shipping.phone;
  var giftCode = req.body.gift.giftCode
  var name = req.body.gift.recipient

  var data = JSON.stringify({
          "createdAt": createdAt,
          "owner": {
            "ownerName": ownerName,
            "ownerEmail": ownerEmail,
            "shipping": {
              "address": address,
              "city": city,
              "state": state,
              "zip": zipCode,
              "country": country,
              "phone": phone,
            }
          },
          "gift": {
              "giftCode": giftCode,
              "recipient": name,
              "messages": [],
              "twoWeeks": false,
              "sent": false
          }
  });
  try {
    const client = new MongoClient(url);
    await client.connect();
   
   const gifts = client.db("yay_gift_orders").collection("gift_orders");
   const results = gifts.insertOne(data);
   console.log(`An order document was inserted with the _id: ${results.insertedId}`);
   } 
   finally {
   await client.close();
   }
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString()+file.originalname)
  }
})
 
var upload = multer({ storage: storage })
app.post('/imageUpload', upload.single('file-upload'), async(req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next("hey error")
  }
    
    
    const imagepost= new model({
      image: file.path
    })
    const savedimage= await imagepost.save()
    res.json(savedimage)
  
})


app.post('/insertMessageBundle', async (req, res) => {
  console.log('createMessages');

  var createdAt = req.body.createdAt
  var contributorName = req.body.contributorName
  var giftCode = req.body.giftCode;
  var messages = req.body.messages;
  var image = req.file
  var data = JSON.stringify({
         "createdAt": createdAt,
         "contributorName": contributorName,
         "giftCode": giftCode,
         "messages": messages,
         "image": image
  });     
 
  try {
    const client = new MongoClient(url);
    await client.connect();
   
   const gifts = client.db("yay_gift_orders").collection("messages");
   const results = gifts.insertOne(data);
   console.log(`An order document was inserted with the _id: ${results.insertedId}`);
   } 
   finally {
   await client.close();
   }
});

const mongoOrderCollect = async () => {
  var fortnightAgo = new Date(Date.now() - 12096e5).getTime(); //two weeks ago in milliseconds

  try {
   const client = new MongoClient(url);
  await client.connect();
  
  const gifts = client.db("yay_gift_orders").collection("gift_orders");
  const update = await gifts.updateMany(
    { 'createdAt': { $lte: fortnightAgo }}, // if the createdAt date is less than or equal to two weeks ago...
    { $set: { "gift.twoWeeks": true}}
  );
  console.log(update);
  const results = gifts.find(
    { $and: [ {"gift.twoWeeks": true}, {'gift.sent': false}] }
  )
  
  results.forEach((gift) => {
    todaysOrders.push(gift);
    })

  return true;
  } 
  finally {
  await client.close();
  }
  }

  const mongoMessagesCollect = async () => {

  
    try {
     const client = new MongoClient(url);
    await client.connect();
    const messages = client.db("yay_gift_orders").collection("messages");

    for(var i =0; i<todaysOrders.length; i++ ){ //loop through orders and match all giftCodes to message objects
    const results = messages.find(
      {"giftCode": todaysOrders[i].gift.giftCode}
    );

    const gifts = client.db("yay_gift_orders").collection("gift_orders");
    
    results.forEach((message) => { //for each message object find the gift order and push the message object with a mathing giftCode into the message array inside the associated gift Order
      todaysMessages.push(message);
      gifts.findOneAndUpdate(
        {'gift.giftCode': message.giftCode},
        { $push: { 'messages': message}} // the message object with name, message (arr), and gift code are all push into the message array in the orders document
      )
      })
    }
    } 
    finally {
    await client.close();
    }
    }
    
  
cron.schedule('* * 12 * * 0-6', () => {
  console.log('Running a job every day at 12:00 pm at America/New_York timezone. Searching for orders that were created more than 14 days ago');
  const done = mongoOrderCollect();
  if (done){
    mongoMessagesCollect();
  }
}, {
  scheduled: false,
  timezone: "America/New_York"
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = {
 today_orders: todaysOrders,
 today_messages: todaysMessages
} 


//get messages from the input --> messages push to api (whenever contributors submit, match the giftCode then put them into the json object)