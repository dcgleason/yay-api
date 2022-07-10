var cron = require('node-cron');
let dotenv = require('dotenv');
dotenv.config()


cron.schedule('* * 12 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searche for orders that were created 2 days ago - first email reminder');
    // email code
    }
    , {
    scheduled: false,
    timezone: "America/New_York"
});


cron.schedule('* * 12 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searche for orders that were created 3 days ago - second email reminder');
    // email code
    }
    , {
    scheduled: false,
    timezone: "America/New_York"
});

cron.schedule('* * 12 * * 0-6', () => {
    console.log('Checking for emails to send every day 12:00 pm at America/New_York timezone. Searche for orders that were created 4 days ago - final email reminder');
    // email code
    }
    , {
    scheduled: false,
    timezone: "America/New_York"
});