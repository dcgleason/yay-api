
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
          uniqueId: String,
           // uniqueId is unqiue to the user
          messages: [String],
          //contributers are an array of contributer ids
          contributorIDs:[String],
          fiveDays: false,
          sent: false
          

        },
        { timestamps: true }
        );

// inputting data to mongoDB database


const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift
