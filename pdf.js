const todays_gifts = require('./index.js');
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

cron.schedule('* * 3 * * 0-6', () => {
  console.log('Running a job every day at 3:00 pm at America/New_York timezone. Searching for orders that were created more than 14 days ago');
  var gifts = []
  var messages = []
  for(var i = 0; i<todays_gifts.today_orders.length; i++){
    gifts.push(todays_gifts.today_orders[i]); // all order objects that are 14 days past gift initation
  }
  for(var i = 0; i<todays_gifts.today_messages.length; i++){
    messages.push(todays_gifts.today_messages[i]); // all message objects that are 14 days past gift iniation
  }

}, {
  scheduled: false,
  timezone: "America/New_York"
});

// for every giftCode in each gift order, match the giftCode to the messages array. 
