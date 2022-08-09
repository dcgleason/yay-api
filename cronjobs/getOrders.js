
var cron = require('node-cron');
let dotenv = require('dotenv');
const router = express.Router()
const Gift = require("../models/Gift")
const Response = require("../models/Response");
dotenv.config()


var readyGifts = []
var messagesReadyForPDF = []

const mongoOrderCollect = async () => { // transition to mongoose

    var fiveDays = 432000 * 1000 
    var fiveDaysAgo = new Date(Date.now() - fiveDays) //5 days ago in ISODate - which is the format of the MongoDB timestamp
  
    try {            
            const update = await Gift.updateMany(
            { 'createdAt': { $lte: ISODate(fiveDaysAgo) }}, // if the createdAt date is less than or equal to 5 days ago...
            { "fiveDays": true}// set fiveDays field to true, to mark that it's been five days 
            );

            console.log(update);
            const results = Gift.find(
            { $and: [ {"fiveDays": true}, {'sent': false}] }
            )
            
            results.forEach((gift) => {
                readyGifts.push(gift);
            })
        
            return true;
    } 
    catch {
             console.log('error while collecting Gift Orders')
    }
    }

    const mongoMessagesCollect = async () => { // using the mongo node client instead of mongoose here - should ideally be using mongoose!

  
        try {
                

                for(var i =0; i<readyGifts.length; i++ ){ //loop through orders and match all giftID to message objects
                        const messages = await Response.find(
                        {"giftCode": readyGifts[i].giftID})
                        
                        messages.forEach((message) => { //for each message object  associated to a gift find the gift order and push the message object with a mathing giftCode into the message array inside the associated gift Order
                                messagesReadyForPDF.push({'answer': message.answer, 'person': message.contributor, 'giftID': message.giftID });
                        });
                }

                // create PDF here with messagesReadyForPDF - loop through and giftID is the same, put it in the same PDF template and send each one separately (or batched?) to Lulu
        } 
        catch {
                console.log('error when collecting messages for PDF');
        }
        }


    cron.schedule('* * 12 * * 0-6', () => {
                console.log('Running a job every day at 12:00 pm at America/New_York timezone. Searching for orders that were created more than 5 days ago');
                const done = mongoOrderCollect();
                if (done){
                        mongoMessagesCollect();
                }
      }, {
                scheduled: false,
                timezone: "America/New_York"
      });

