const express = require('express')
const app = express()
const router = express.Router()
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { spawn } = require('child_process');
const amqp = require('amqplib/callback_api');
const Book = require("../models/Book"); 
const User = require("../models/User")
// Create a Nodemailer transporter


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send an email
const sendEmail = async (recipients, subject, text, userId, attachments) => {
  try {
    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: recipients.join(','),
      subject: subject,
      text: `${text}\n\nContribution link: https://www.givebundl.com/contribute/${userId}`,
      attachments: attachments,
    };
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};



const sendToQueue = (message) => {
  amqp.connect('amqps://b-5b5885c9-d33b-41aa-94fc-faad831a859f.mq.us-east-1.amazonaws.com:5671', (error, connection) => {
    if (error) throw error;
    connection.createChannel((error, channel) => {
      if (error) throw error;
      const queue = 'emailQueue';
      channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    });
  });
};



router.post('/start-email-process', async (req, res) => {
  // Get the user ID and deliveryDate from the request
  let userId = req.body.userId;
  let processStartDate = new Date(req.body.processStartDate);
  let physicalBook = req.body.physicalBook;



  // Check if the process should have already started
  if (new Date() > processStartDate) {
    return res.status(400).json({ message: 'Process start date is in the past' });
  }

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // ...rest of the code to create book and save user...

  // Get the recipients from the request
  let recipients = req.body.recipients;

  // Calculate the delay before starting the email process (in milliseconds)
  let delayBeforeStart = processStartDate - new Date();


  const email1 = {
    recipients,
    subject: 'Email 1',
    text: 'This is the first email.',
    userId: userId.toString(),
    delay: delayBeforeStart
  };


  const email2 = {
    recipients,
    subject: 'Email 2',
    text: 'This is the second email.',
    userId: userId.toString(),
    delay: delayBeforeStart
  };

  const email3 = {
    recipients,
    subject: 'Email 3',
    text: 'This is the third email.',
    userId: userId.toString(),
    delay: delayBeforeStart
  };

  const email4 = {
    recipients,
    subject: 'Email 4',
    text: 'This is the fourth email.',
    userId: userId.toString(),
    delay: delayBeforeStart
  };

  const email5 = {
    recipients,
    subject: 'Email 5',
    text: 'This is the fifth email.',
    userId: userId.toString(),
    delay: delayBeforeStart
  };
  // Schedule the emails
  sendToQueue(email1);
  sendToQueue(email2);
  sendToQueue(email3);
  sendToQueue(email4);
  sendToQueue(email5);
  // ...rest of the code to run Python script...

  res.send('Email process scheduled');
});


// Email send to gift contributors after successful submission
router.post('/sendContributorNotification', (req, res) => {
  const senderEmail = process.env.SENDER_EMAIL; // sender's email
  const senderName = process.env.SENDER_NAME; // sender's name
  const recipientEmail = req.body.email; // recipient's email
  const contributor = req.body.contributor; // contributor's name
  const recipient = req.body.recipient; // gift recipient's name

  const OAuth2 = google.auth.OAuth2;
  const OAuth2_client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);
  OAuth2_client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

  const accessToken = OAuth2_client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: senderEmail,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  const mail_options = {
    from: `${senderName} <${senderEmail}>`,
    to: recipientEmail,
    subject: "New Contribution to your Bundl",
    html: `${contributor} has just contributed to your Bundl for ${recipient}!`
  };

  transport.sendMail(mail_options, (error, result) => {
    if (error) {
      console.error('Error:', error);
      res.sendStatus(500);
    } else {
      console.log("Email sent successfully:", result);
      res.sendStatus(200);
    }
    transport.close();
  });
});

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

// Email send to gift contributors  
router.post('/send', (req, res) => {
  const senderEmail = req.body.senderEmail; // sender's email
  const senderName = req.body.senderName; // sender's name
  const emailSubject = req.body.subject; // email subject
  const emailBody = req.body.body; // email body
  const recipientEmails = req.body.recipients; // array of recipient emails who have not yet submitted a message

  const OAuth2 = google.auth.OAuth2;
  const OAuth2_client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);
  OAuth2_client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

  const accessToken = OAuth2_client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: senderEmail,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  const mail_options = {
    from: `${senderName} <${senderEmail}>`,
    to: recipientEmails.join(','),
    subject: emailSubject,
    html: emailBody
  };

  transport.sendMail(mail_options, (error, result) => {
    if (error) {
      console.error('Error:', error);
      res.sendStatus(500);
    } else {
      console.log("Email sent successfully:", result);
      res.sendStatus(200);
    }
    transport.close();
  });
});

  module.exports = router