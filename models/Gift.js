
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
           // uniqueId is unqiue to the user
          messages: [{  // array of message objects, added after 5 days are up
            contributor: String,
            giftCode: Number,
            question_responses: [String]  // add and image?
          }],
          //contributers are an array of contributer ids
       //   contributorIDs:[String], <-- what is the thinking behind contributorsIDs? 
          fiveDays: false,
          sent: false
          

        },
        { timestamps: true }
        );

// inputting data to mongoDB database

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift
