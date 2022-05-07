//const orders = require('./index.js');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const {parse, stringify, toJSON, fromJSON} = require('flatted');
var cron = require('node-cron');
const doc = new PDFDocument;
const Buffer = require('node:buffer');
let dotenv = require('dotenv');
dotenv.config()

// get email body - loop through all emails. 
// create PDF 
// upload PDF file /folder/recipient.pdf to mongodb database
// query for today's order pdfs
// start upload session for dropbox
// upload to dropbox (1 by 1? file upload limit?)
// get upload links for each one 
// export link to page tahat sends json body to lulu


// get enough storage in dropbox to hold all pdfs. 




const getTodayEmailBodies = () => {

var today_email_bodies = []
var today_email_ids = []
var test_email_ids = ["8343751", "542491602", "41004288", "707993875"]
var message_id = []

// for (let i = 0; i < orders.todaysOrders.length; i++) { 
//     today_email_ids.push(orders.todaysOrders[i].gift.emailID)
// }


//for (let i = 0; i < test_email_ids.length; i++) { 

axios
.get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages?q=in:inbox subject:8343751`,{
  headers: {
    authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
  }
})
.then(data => {
    var json = stringify(data);
    var obj = fromJSON(json);

  //console.log(`statusCode: ${result.status}`)
  console.log("result " + obj)
  //today_email_bodies.push(.data.payload)


 // message_id.push(JSON.parse(result).messages.id)
})
.catch(error => {
  console.error(error)
})
//}

//for (let i = 0; i < message_id.length; i++) { 
// axios
// .get(`https://gmail.googleapis.com/gmail/v1/users/admin@youandyours.io/messages/${message_id[i]}`,{
//   headers: {
//     authorization: `Bearer ${process.env.GMAIL_AUTH_BEARER_TOKEN}`
//   }
// })
// .then(result => {
//   console.log(`statusCode: ${result.status}`)
//   console.log("base64 email body" + result.payload.parts.body.data)
//   let buff = new Buffer(data, 'base64');
//   let textBody = buff.toString('ascii');
//   console.log("emailbody: "+ textBody);
//   //today_email_bodies.push(result.data.payload)
// })
// .catch(error => {
//   console.error(error)
// })

//}



}

//getTodayEmailBodies()

// cron.schedule('* * 15 * * 0-6', () => {
//     console.log('Running a job every day at 3:00 pm at America/New_York timezone');
//     getTodayEmailBodies()
//   }, {
//     scheduled: true,
//     timezone: "America/New_York"
//   });



