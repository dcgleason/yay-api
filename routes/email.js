const express = require('express')
const router = express.Router()


//email send to gift contributors 

router.post('/send', (req, res) => {
   console.log('email inside of post request');
   console.log('gmail client id' + process.env.GMAIL_CLIENT_ID)
  
    var name = req.body.recipient
    var email = req.body.email
    var giftCode = req.body.giftCode
    var ownerName = req.body.ownerName
    var giftOwnerMessage = req.body.giftOwnerMessage;
  
    console.log('emails' + email);
    console.log('questions' + question);

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
        from: 'Amore Books <dan@amorebooks.io', 
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

  module.exports = router