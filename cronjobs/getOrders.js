
var cron = require('node-cron');
let dotenv = require('dotenv');
dotenv.config()


var readyToSend = []
var associatedMessages = []

const mongoOrderCollect = async () => {

    var fiveDays = 432000 * 1000 
    var fiveDaysAgo = new Date(Date.now() - fiveDays) //5 days ago in ISODate - which is the format of the MongoDB timestamp
  
    try {
    const client = new MongoClient(url);
    await client.connect();
    
    const gifts = client.db("yay_gift_orders").collection("gift_orders");
    const update = await gifts.updateMany(
      { 'createdAt': { $lte: ISODate(fiveDaysAgo) }}, // if the createdAt date is less than or equal to 5 days ago...
      { $set: { "gift.fiveDays": true}} // set fiveDays field to true, to mark that it's been five days 
    );
    console.log(update);
    const results = gifts.find(
      { $and: [ {"gift.fiveDays": true}, {'gift.sent': false}] }
    )
    
    results.forEach((gift) => {
      readyToSend.push(gift);
      })
  
    return true;
    } 
    finally {
    await client.close();
    }
    }

    const mongoMessagesCollect = async () => { // using the mongo node client instead of mongoose here - should ideally be using mongoose!

  
        try {
                const client = new MongoClient(url);
                await client.connect();
                const messages = client.db("yay_gift_orders").collection("messages");

                for(var i =0; i<todaysOrders.length; i++ ){ //loop through orders and match all giftCodes to message objects
                const results = messages.find(
                {"giftCode": readyToSend[i].gift.giftCode}
                );

                const gifts = client.db("yay_gift_orders").collection("gift_orders");
                
                results.forEach((message) => { //for each message object find the gift order and push the message object with a mathing giftCode into the message array inside the associated gift Order
                associatedMessages.push(message);
                gifts.findOneAndUpdate(
                    {'gift.giftCode': message.giftCode},
                    { $push: { 'messages': message}} // the message object with name, message (arr), and gift code are all push into the message array in the orders document
                )
                })
                }
        } 
        finally {
                await client.close();
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