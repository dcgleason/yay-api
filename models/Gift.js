
const mongoose = require('mongoose');
const { string } = require('pg-format');
        const Schema = mongoose.Schema
        /**
         * each gift contains a title 
         * the ID of the initiating user
         * and the array of contributorIDs - each page will belong to one contributor (dg - what do you mean by this?)
         */
        const addressSchema = new Schema({
          address: String,
          city: String,
          state: String,
          zip: String,
          country: String,
          phone: String
        })

        const ownerSchema = new Schema({
          ownerName: String,
          ownerEmail: String,
          shipping: addressSchema
        })

        const giftSchema = new Schema({
          owner: ownerSchema,
          //gifts have one owner
          giftCode: Number,
          recipient: String,
           // uniqueId is unqiue to the user
          messages: [{  // array of message objects, added after 5 days are up
            contributor: String, // full name of contributor
            contributorEmail: String,
            giftCode: Number,
            question_responses: [String]  // add and image?
            //TODO: add a string array for question objects
          }],
          //contributers are an array of contributer ids
       //   contributorIDs:[String], <-- what is the thinking behind contributorsIDs? 
          fiveDays: false, // for determining if it's been 5 days or not
          sent: false // for determining if it was shipped to end user / recipient
          

        },
        { timestamps: true }
        );

// inputting data to mongoDB database

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift
