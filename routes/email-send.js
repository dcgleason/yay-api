const fs = require('fs');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

// Load your service account credentials
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const key = JSON.parse(fs.readFileSync(keyFile));

// Set up the Google API client
const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/gmail.send'],
  null
);

// The email address of the third-party person who granted "Send as" permission
const thirdPartyEmail = 'third.party@example.com';

// The JSON object containing the list of email addresses
const emailList = [
  'person1@example.com',
  'person2@example.com',
  // ...more email addresses
];

// Helper function to create and encode the email
function createEmail(to, subject, body) {
  const email = `Content-Type: text/html; charset="UTF-8"\nMIME-Version: 1.0\nContent-Transfer-Encoding: 7bit\nto: ${to}\nsubject: ${subject}\n\n${body}`;
  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

// Function to send an email using the Gmail API
async function sendEmail(authClient, to, subject, body) {
  const gmail = google.gmail({ version: 'v1', auth: authClient });

  const email = createEmail(to, subject, body);

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: email,
      },
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}

// Main function to authenticate and send emails
async function main() {
  try {
    await jwtClient.authorize();

    const subject = 'Your Subject';
    const body = `
      <html>
        <body>
          <h1>Hello!</h1>
          <p>This is a test email.</p>
        </body>
      </html>
    `;

    for (const email of emailList) {
      await sendEmail(jwtClient, email, subject, body);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();