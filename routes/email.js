const express = require('express')
const app = express()
const router = express.Router()
const nodemailer = require('nodemailer');
const { google } = require('googleapis');



// google people api contacts 

router.get('/contacts', async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  console.log('access token is ' + accessToken);

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const people = google.people({
    version: 'v1',
    auth: oauth2Client,
  });

  try {
    const response = await people.people.connections.list({
      resourceName: 'people/me',
      pageSize: 100,
      personFields: 'names,emailAddresses',
    });

    const contacts = response.data.connections || [];

    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).send('Error fetching contacts');
  }
});

//email send to gift contributors  

router.post('/send', (req, res) => {

    var ownerName = req.body.ownerName;
    var email = req.body.email;
    var recipient = req.body.recipient;
  
    console.log('email inside of post request');
    console.log('gmail client id' + process.env.GMAIL_CLIENT_ID)
    console.log('recipient email is ' + email);

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
      
      const mail_options= {
        from: 'Bundle <dan@usebundle.co', 
        to: email, 
        subject: ownerName + ', complete your order.',
        html: '<p> Please input your bundle contributors here: <a href="https://usebundle.co/contributors">www.usebundle.co/contributors</a></p>'
    }
      transport.sendMail( mail_options, function(error, result){
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