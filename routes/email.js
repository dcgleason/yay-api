const express = require('express')
const app = express()
const router = express.Router()
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { spawn } = require('child_process');
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send an email
const sendEmail = async (recipients, subject, text, attachments) => {
  try {
    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: recipients.join(','),
      subject: subject,
      text: text,
      attachments: attachments,
    };
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

app.post('/start-email-process', (req, res) => {
  // Get the recipients from the request
  let recipients = req.body.recipients;

  // Get the contributors who have already submitted their contributions
  // This should be replaced with actual code to get this list from your database or other data source
  let contributors = ['contributor1@example.com', 'contributor2@example.com'];

  // Filter out the contributors from the recipients list
  recipients = recipients.filter(recipient => !contributors.includes(recipient));

  // Send the first email immediately
  sendEmail(recipients, 'Email 1', 'This is the first email.');

  // Schedule the other emails
  setTimeout(() => sendEmail(recipients, 'Email 2', 'This is the second email.'), 3 * 24 * 60 * 60 * 1000);
  setTimeout(() => sendEmail(recipients, 'Email 3', 'This is the third email.'), 5 * 24 * 60 * 60 * 1000);
  setTimeout(() => sendEmail(recipients, 'Email 4', 'This is the fourth email.'), 6 * 24 * 60 * 60 * 1000);
  setTimeout(() => sendEmail(recipients, 'Email 5', 'This is the fifth email.'), 7 * 24 * 60 * 60 * 1000);

  // Run the Python script 24 hours after the last email is sent
  setTimeout(() => {
    const python = spawn('python', ['path/to/your/script.py']);

    python.on('close', (code) => {
      console.log(`Python script finished with code ${code}`);

      // Email the generated PDF as an attachment
      sendEmail(recipients, 'Here is your PDF', 'The PDF generated by the Python script is attached.', [
        {
          filename: 'generated.pdf',
          path: 'path/to/generated.pdf',
        },
      ]);
    });
  }, 8 * 24 * 60 * 60 * 1000);

  res.send('Email process started');
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