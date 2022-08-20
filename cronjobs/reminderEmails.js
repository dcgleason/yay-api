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

    var twoDays = 172800 * 1000 
    var oneDay = 86400 * 1000
    var oneDayAgo = new Date(Date.now() - oneDay) // 1 days ago in ISOdate format
    var twoDaysAgo = new Date(Date.now() - twoDays) // 2 days ago in ISODate - which is the format of the MongoDB timestamp
  
// query db for gifts created between 1 and 2 days ago and fiveDays in the gift object is false 
        const firstArr = await Gift.find({ createdAt: { $gte: oneDayAgo, $lte: twoDaysAgo } }, { fiveDays: false});
        console.log('results from gift.find on created between 1-2 days after owner purchased bundle and initial email was sent out ' + firstArr);
    }

// send email - need to send to through each contributor in gift - loop through gift and contributors inside the gift


        for(var i = 0; i< firstArr.length; i++){


            const OAuth2 = google.auth.OAuth2
            
            const OAuth2_client = new OAuth2Variable(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);

            OAuth2_client.setCredentials( { refresh_token: process.env.GMAIL_REFRESH_TOKEN } );

            let accessToken = OAuth2_client.getAccessToken();

            let transport = nodemailer.createTransport({
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
            from: 'Bundle <dan@usebundle.co',
            to: 'danny.c.gleason@gmail.com', //firstArr[i].messages.contributorEmail
            subject: "Reminder: Contribute to" + 'recipient' + "'s Bundle initiated by "+ 'owner name' + "!", //firstArr[i].recipient firstArr[i].owner.ownerName 
            html: '<p> You have 3 more days to write your responses for' + 'recipient' + '! Contribute here: <a href="https://bundle.love/write">www.bundle.love/write</a></p>'
            }
            transport.sendMail( mail_options_reminder_one, function(error, result){
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
        }


const secondReminderEmail = async () => {

        var threeDays = 259200 * 1000 
        var twoDays = 172800 * 1000
        var twoDaysAgo = new Date(Date.now() - twoDays) // 2 days ago in ISOdate format
        var threeDaysAgo = new Date(Date.now() - threeDays) // 3 days ago in ISODate - which is the format of the MongoDB timestamp
      
    // query db for gifts created between 2 and 3 days ago and fiveDays is false in the gift object
            const secondArr = await Gift.find({ createdAt: { $gte: twoDaysAgo, $lte: threeDaysAgo }}, { fiveDays: true});
            console.log('results from gift.find on created between 2-3 days ago ' + secondArr);
        }


    // send emails

            
            
        for(var j = 0; j< secondArr.length; j++){

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

            const mail_options_reminder_two = {
            from: 'Bundle <dan@usebundle.co',
            to: 'danny.c.glesaon@gmail.com', 
            subject: "Reminder: Contribute to" + 'recipient' + "'s Bundle initiated by "+ 'recipient' + "!",
            html: '<p> You have 2 more days to write your responses for' + 'recipient' + '! Contribute here: <a href="https://usebundle.co/messages">www.usebnudle.co/messages</a></p>'
            }
            transport.sendMail( mail_options_reminder_two, function(error, result){
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
        }


const thirdReminderEmail = async () => {

            var threeDays = 259200 * 1000 
            var fourDays = 345600 * 1000
            var threeDaysAgo = new Date(Date.now() - threeDays) // 3 days ago in ISOdate format
            var fourDaysAgo = new Date(Date.now() - fourDays) // 4 days ago in ISODate - which is the format of the MongoDB timestamp
          
        // query db for gifts created between 3 and 4 days ago and fiveDays is false
                const thirdArr = await Gift.find({ createdAt: { $gte: threeDaysAgo, $lte: fourDaysAgo } }, { fiveDays: true});
                console.log('results from gift.find on created between 3-4 days ago ' + thirdArr);
            }
       // send email 
       
     for(var k = 0; k< thirdArr.length; k++){

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
        const mail_options_reminder_three = {
        from: 'Bundle <dan@usebundle.co>',
        to: 'danny.c.gleason@gmail.com', 
        subject: "Reminder: Contribute to" + 'recipient ' + "'s Bundle initiated by "+ ' owner' + "!",
        html: '<p> You have 1 more days to write your responses for' + 'recipeint' + '! Contribute here: <a href="https://bundle.love/write">www.bundle.love/write</a>. This is your last reminder! : ) </p>'
        }
        transport.sendMail( mail_options_reminder_three, function(error, result){
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
    }

// should be getting the same emails as the days go on


cron.schedule('* * 4 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searches for orders that were created 2 days ago - first email reminder');
    // email code
    // query db for gifts where sent = true, and timestamp is between 6-7 days away (1-2 days after start time)
    firstReminderEmail();
    }
    , {
    scheduled: true,
    timezone: "America/New_York"
});


cron.schedule('* * 4 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searches for orders that were created 3 days ago - second email reminder');
    // email code
    // query db for gifts where sent = true, and timestamp is between 7-8 days away (2-3 days after start time)
    secondReminderEmail();
    }
    , {
    scheduled: true,
    timezone: "America/New_York"
});

cron.schedule('* * 4 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searches for orders that were created 4 days ago - final email reminder');
    // email code
    // query db for gifts where sent = true, and timestamp is between 8-9 days away (3-4 days after start time)
    thirdReminderEmail()
    }
    , {
    scheduled: true,
    timezone: "America/New_York"
});