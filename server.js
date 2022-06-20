//imports
require('dotenv').config({ path: require('find-config')('.env') })
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const axios = require('axios')
const stripe = require('stripe')('sk_test_51KtCf1LVDYVdzLHCA31MSSlOKhe7VQtXqJJiPnJK90sRLsmYU3R5MlTljmTe5AGZTNaKzKF0Fr8BC2fNOsTBgDP100TiYqCU9k')


/*
IMPORT ROUTE CONTROLLERS: 
Note: 
All logic relating to sending or receiving data to or from the Database
should live within the resepective file in the routes folder
*/
const users = require('./routes/users')
const gifts = require('./routes/gifts')
const beta = require('./routes/beta')
const lulu = require('./routes/lulu')



//initialization of variables 
const port = process.env.PORT || 3001

//middleware
app.use(express.urlencoded({ extended: true }))
//cors
//dg - added what should work to resolve cors error

app.use(cors({
    origin: "*",
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    exposedHeaders: '*'
  }))

// db connection - mongo atlas
const connectDB = async ()=>{
    await mongoose.connect(
        process.env.DB_URI,
                { useUnifiedTopology: true, useNewUrlParser: true },
                (err)=> {
                    if (err) {
                        console.log("could not connect to mongodb atlas" + '\n' + err)
                    }else {
                        console.log("connected to mongo")
                    }
                    
                }
            )
            
            }
//execute connection
connectDB()


// app route controllers - app.use
app.use("/users", users);
app.use("/gifts", gifts)
app.use("/beta", beta)
app.use("/lulu", lulu) // for all requests that go to the print api



// app root route app.get
app.get("/",(req,res)=>{
    console.log('root')
    res.send("APP ROOT")

    
})

// app route to /secret for Stripe.JS to get the client secret 
app.get('/secret', async (req, res) => {

    console.log('Making requests!')
    const intent = await stripe.paymentIntents.create({
     currency: 'usd',
     amount: 4500,
     metadata: {integration_check: 'accept_a_payment'}
   });
 
 
   res.json(intent);
 })

 // app route to /updatePaymentIntent 

 app.post('/updatePaymentIntent', async (req, res) => {

    var amount = req.body.price;
    var receipt_email = req.body.receipt_email;
      console.log('Making update - for price!')
    
     res.json(intent);
    })

//email send to gift contributors 

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

//server initialization
app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})