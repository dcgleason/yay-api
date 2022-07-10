var cron = require('node-cron');
let dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const Gift = require("../models/Gift")

dotenv.config()


// callback functions 
// remember...that when comparing data future is 'greater' than the past
// may need to use the ISODate() contructor function when comparing data to MongoDB timestamp

const firstReminderEmail = async () => {

    var sevenDays = 604800 * 1000 
    var sixDays = 518400 * 1000
    var sixDaysAgo = new Date(Date.now() - sixDays) // 6 days ago in ISOdate format
    var sevenDaysAgo = new Date(Date.now() - sevenDays) //7 days ago in ISODate - which is the format of the MongoDB timestamp
  
// query db for gifts created between 6 and 7 days ago
        const firstArr = await Gift.find({ createdAt: { $gte: sixDaysAgo, $lte: sevenDaysAgo } });
        console.log('results from gift.find on created between 6-7 days ago ' + arr);
    }

// send email - need to send to through each contributor in gift - loop through gift and contributors inside the gift

            const OAuth2Variable = google.auth.OAuth2
            
            const OAuth2_client_reminder = new OAuth2Variable(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);

            OAuth2_client_reminder.setCredentials( { refresh_token: process.env.GMAIL_REFRESH_TOKEN } );

            let acToken = OAuth2_client_reminder.getAccessToken();

            let tport = nodemailer.createTransport({
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

            const mail_options_reminder_one = {
            from: 'Bundle <dan@amorebooks.io', 
            to: firstArr[i]., 
            subject: ownerName + 'selected you to contribute in a gift for ' + name + ' !',
            html: '<p> You have been selected to contribute to a Bundle for' + name + '! This means that' + ownerName + 'has asked you to write a positive or loving message for ' + name + '.  Your Bundle code is ' + giftCode  + '.  This message is from ' + ownerName+ ': ' + giftOwnerMessage + '. To contribute, go to ' + '<a href="https://bundle.love/write">www.bundle.love/write</a></p>'
            }
            tport.sendMail( mail_options_reminder_one, function(error, result){
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


const secondReminderEmail = async () => {

        var eightDays = 691200 * 1000 
        var sevenDays = 604800 * 1000
        var sevenDaysAgo = new Date(Date.now() - sevenDays) // 7 days ago in ISOdate format
        var eightDaysAgo = new Date(Date.now() - eightDays) // 8 days ago in ISODate - which is the format of the MongoDB timestamp
      
    // query db for gifts created between 7 and 8 days ago
            const secondArr = await Gift.find({ createdAt: { $gte: sevenDaysAgo, $lte: eightDaysAgo } });
            console.log('results from gift.find on created between 7-8 days ago ' + arr);
        }


    // send emails

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


const thirdReminderEmail = async () => {

            var nineDays = 777600 * 1000 
            var eightDays = 691200 * 1000
            var eightDaysAgo = new Date(Date.now() - eightDays) // 8 days ago in ISOdate format
            var nineDaysAgo = new Date(Date.now() - nineDays) // 9 days ago in ISODate - which is the format of the MongoDB timestamp
          
        // query db for gifts created between 8 and 9 days ago
                const thirdArr = await Gift.find({ createdAt: { $gte: eightDaysAgo, $lte: nineDaysAgo } });
                console.log('results from gift.find on created between 8-9 days ago ' + arr);
            }
       // send email 

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
   

// should be getting the same emails as the days go on


cron.schedule('* * 12 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searches for orders that were created 2 days ago - first email reminder');
    // email code
    // query db for gifts where sent = true, and timestamp is between 6-7 days away (1-2 days after start time)
    await Gift.where(createdAt).
    }
    , {
    scheduled: false,
    timezone: "America/New_York"
});


cron.schedule('* * 12 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searches for orders that were created 3 days ago - second email reminder');
    // email code
    // query db for gifts where sent = true, and timestamp is between 7-8 days away (2-3 days after start time)
    }
    , {
    scheduled: false,
    timezone: "America/New_York"
});

cron.schedule('* * 12 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searches for orders that were created 4 days ago - final email reminder');
    // email code
    // query db for gifts where sent = true, and timestamp is between 8-9 days away (3-4 days after start time)
    }
    , {
    scheduled: false,
    timezone: "America/New_York"
});