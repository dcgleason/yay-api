const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
const { google } = require('googleapis');


//email send to gift contributors 

router.post('/send', (req, res) => {

  
    var name = req.body.recipient
    var email = req.body.email
    var giftCode = req.body.giftCode
    var ownerName = req.body.ownerName
    var giftOwnerMessage = req.body.giftOwnerMessage;
  
    console.log('email inside of post request');
    console.log('gmail client id' + process.env.GMAIL_CLIENT_ID)
    console.log('recipient email is ' + email);
    console.log('gift Code is ' + giftCode);

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
        from: 'Bundle <dan@amorebooks.io', 
        to: email, 
        subject: ownerName + 'selected you to contribute in a gift for ' + name + ' !',
        html: '<p> You have been selected to contribute to a Bundle for' + name + '! This means that' + ownerName + 'has asked you to write a positive or loving message for ' + name + '.  Your Bundle code is ' + giftCode  + '.  This message is from ' + ownerName+ ': ' + giftOwnerMessage + '. To contribute, go to ' + '<a href="https://bundle.love/write">www.bundle.love/write</a></p>'
    }
      transport.sendMail( mail_options_two, function(error, result){
      if(error){
            console.log('Error!!!: ',  error)
            res.sendStatus(500);
        }
        else {
            console.log("Success woo!:  ", result)
            res.sendStatus(200);
        }
        transport.close()
    })

    res.send()
  
  })

  module.exports = router