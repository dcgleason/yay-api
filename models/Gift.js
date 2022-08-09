
const mongoose = require('mongoose');
const { string } = require('pg-format');
        const Schema = mongoose.Schema
        /**
         * each gift contains a title 
         * the ID of the initiating user
         * and the array of contributorIDs - each page will belong to one contributor (dg - what do you mean by this?)
         */
        const giftSchema = new Schema({
          giftID: Number,
          recipient: String,
          fiveDays: false, // for determining if it's been 5 days or not
          sent: false // for determining if it was shipped to end user / recipient
        },
        { timestamps: true }
        );

// inputting data to mongoDB database

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift
