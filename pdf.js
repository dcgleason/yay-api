const orders = require('./index.js');
const PDFDocument = require('pdfkit');
const axios = require('axios');
var cron = require('node-cron');
const doc = new PDFDocument;
let dotenv = require('dotenv');
const { values } = require('lodash');
dotenv.config()


// arrange data so that it's an object of messages divided up by giftCode 
// create PDF 
// upload PDF file /folder/recipient.pdf to mongodb database
// query for today's order pdfs
// start upload session for dropbox
// upload to dropbox (1 by 1? file upload limit?)
// get upload links for each one 
// export link to page tahat sends json body to lulu


// get enough storage in dropbox to hold all pdfs. 

<<<<<<< HEAD
cron.schedule('* * 3 * * 0-6', () => {
  console.log('Running a job every day at 3:00 pm at America/New_York timezone. Searching for orders that were created more than 14 days ago');
  var gifts = []
  var messages = []
  for(var i = 0; i<orders.todaysOrders.length; i++){
    gifts.push(orders.todaysOrders[i]); // all order objects that are 14 days past gift initation
  }
  for(var i = 0; i<orders.todaysMessages.length; i++){
    messages.push(orders.todaysMessages[i]); // all message objects that are 14 days past gift iniation
  }
=======



const getTodayEmailBodies = () => {

var today_email_bodies = []
var today_email_ids = []
var test_email_ids = ["8343751", "542491602", "41004288", "707993875"]

// for (let i = 0; i < orders.todaysOrders.length; i++) { 
//     today_email_ids.push(orders.todaysOrders[i].gift.emailID)
// }


for (let i = 0; i < test_email_ids.length; i++) { 

axios
.get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages?q=in:inbox subject:${test_email_ids[i]}`,{
  headers: {
    authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
  }
})
.then(result => {
  console.log(`statusCode: ${result.status}`)
  console.log("messageID for email: " + result.messages.id)
  //today_email_bodies.push(result.data.payload)

  var message_id = []
  message_id.push(result.messages.id)
})
.catch(error => {
  console.error(error)
})

axios
.get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages/${message_id[0]}`,{
  headers: {
    authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
  }
})
.then(result => {
  console.log(`statusCode: ${result.status}`)
  console.log("base64 email body" + result.payload.parts.body.data)
  //today_email_bodies.push(result.data.payload)

  var message_id = []
  message_id.push(result.messages.id)
})
.catch(error => {
  console.error(error)
})




}

}

getTodayEmailBodies()
>>>>>>> parent of 91c7ff0 (decided to ditch gmail api)

  var messagesByGiftCode= [];


}, {
  scheduled: false,
  timezone: "America/New_York"
});

// for every giftCode in each gift order, match the giftCode to the messages array. 
