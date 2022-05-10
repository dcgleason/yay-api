const orders = require('./index.js');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const {parse, stringify, toJSON, fromJSON} = require('flatted');
var cron = require('node-cron');
const doc = new PDFDocument;
const Buffer = require('node:buffer');
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
  for(var i = 0; i<orders.todaysOrders.length; i++){
    gifts.push(orders.todaysOrders[i]); // all order objects that are 14 days past gift initation
  }
  for(var i = 0; i<orders.todaysMessages.length; i++){
    messages.push(orders.todaysMessages[i]); // all message objects that are 14 days past gift iniation
  }

  var messagesByGiftCode= [];


}, {
  scheduled: false,
  timezone: "America/New_York"
});

// for every giftCode in each gift order, match the giftCode to the messages array. 
