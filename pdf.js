const orders = require('./index.js');
const PDFDocument = require('pdfkit');
const axios = require('axios');
var cron = require('node-cron');
const doc = new PDFDocument;

// get email body - loop through all emails. 
// create PDF 
// upload PDF file /folder/recipient.pdf to mongodb database
// query for today's order pdfs
// start upload session for dropbox
// upload to dropbox (1 by 1? file upload limit?)
// get upload links for each one 
// export link to page tahat sends json body to lulu


// get enough storage in dropbox to hold all pdfs. 




const getOneEmailBody = () => {
var message_ids = orders.todaysOrders.gift.emails
var email_bodies_today = []

for (let i = 0; i < message_ids.length; i++) { 

axios
.get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages/${message_ids[i]}`,{
  headers: {
    authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
  }
})
.then(result => {
  console.log(`statusCode: ${result.status}`)
  console.log("body (I hope): " + result.data.payload)
  //email_bodies_today.push(result.data.payload)
})
.catch(error => {
  console.error(error)
})
}

}

cron.schedule('* * 15 * * 0-6', () => {
    console.log('Running a job every day at 3:00 pm at America/New_York timezone');
    mongoConnect();
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });



