const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Define the email options
let mailOptions = {
  from: process.env.EMAIL_USERNAME,
  subject: 'Scheduled Email',
  text: 'This is a scheduled email.',
};

// Function to send an email
const sendEmail = async (recipients) => {
  try {
    mailOptions.to = recipients.join(','); // list of receivers
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

// List of all recipients
let allRecipients = ['email1@example.com', 'email2@example.com', 'email3@example.com'];

// List of contributors who have already contributed
let contributors = ['email2@example.com'];

// Filter out the contributors from the recipient list
let recipients = allRecipients.filter(email => !contributors.includes(email));

// Send the first email immediately
sendEmail(recipients);

// Schedule the other emails
// Each day is 24 * 60 * 60 * 1000 milliseconds
setTimeout(() => sendEmail(recipients), 3 * 24 * 60 * 60 * 1000); // Email 2: after 3 days
setTimeout(() => sendEmail(recipients), 5 * 24 * 60 * 60 * 1000); // Email 3: after 5 days
setTimeout(() => sendEmail(recipients), 6 * 24 * 60 * 60 * 1000); // Email 4: after 6 days
setTimeout(() => sendEmail(recipients), 7 * 24 * 60 * 60 * 1000); // Email 5: after 7 days
