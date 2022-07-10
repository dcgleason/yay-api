var cron = require('node-cron');
let dotenv = require('dotenv');
const Gift = require("../models/Gift")
dotenv.config()


// callback functions

const firstReminderEmail = async () => {

    var sevenDays = 604800 * 1000 
    var sixDays = 518400 * 1000
    var sixDaysAgo = new Date(Date.now() - sixDays) // 6 days ago in ISOdate format
    var sevenDaysAgo = new Date(Date.now() - sevenDays) //7 days ago in ISODate - which is the format of the MongoDB timestamp
  
// query db for gifts created between 6 and 7 days ago
        const arr = await Gift.find({ createdAt: { $gte: sixDaysAgo, $lte: sevenDaysAgo } });
        console.log('results from gift.find on created between 6-7 days ago ' + arr);
    }

const secondReminderEmail = async () => {

        var eightDays = 691200 * 1000 
        var sevenDays = 604800 * 1000
        var sevenDaysAgo = new Date(Date.now() - sevenDays) // 7 days ago in ISOdate format
        var eightDaysAgo = new Date(Date.now() - eightDays) // 8 days ago in ISODate - which is the format of the MongoDB timestamp
      
    // query db for gifts created between 7 and 8 days ago
            const arr = await Gift.find({ createdAt: { $gte: sevenDaysAgo, $lte: eightDaysAgo } });
            console.log('results from gift.find on created between 7-8 days ago ' + arr);
        }

const thirdReminderEmail = async () => {

            var nineDays = 777600 * 1000 
            var eightDays = 691200 * 1000
            var eightDaysAgo = new Date(Date.now() - eightDays) // 8 days ago in ISOdate format
            var nineDaysAgo = new Date(Date.now() - nineDays) // 9 days ago in ISODate - which is the format of the MongoDB timestamp
          
        // query db for gifts created between 8 and 9 days ago
                const arr = await Gift.find({ createdAt: { $gte: eightDaysAgo, $lte: nineDaysAgo } });
                console.log('results from gift.find on created between 8-9 days ago ' + arr);
            }



cron.schedule('* * 12 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searches for orders that were created 2 days ago - first email reminder');
    // email code
    // query db for gifts where sent = true, and timestamp is between 6-7 days away (1-2 days after start time)
    await Gift.where(createdAt).
    }
    , {
    scheduled: false,
    timezone: "America/New_York"
});


cron.schedule('* * 12 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searches for orders that were created 3 days ago - second email reminder');
    // email code
    // query db for gifts where sent = true, and timestamp is between 7-8 days away (2-3 days after start time)
    }
    , {
    scheduled: false,
    timezone: "America/New_York"
});

cron.schedule('* * 12 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searches for orders that were created 4 days ago - final email reminder');
    // email code
    // query db for gifts where sent = true, and timestamp is between 8-9 days away (3-4 days after start time)
    }
    , {
    scheduled: false,
    timezone: "America/New_York"
});