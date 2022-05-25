
        const mongoose = require('mongoose')
        const Schema = mongoose.Schema
        /**
         * each gift contains a title 
         * the ID of the initiating user
         * and the array of contributorIDs - each page will belong to one contributor
         */
        const giftSchema = new Schema({
            title: String,
            //gifts have one user
            userID: String,
            //contributers are an array of contributer ids
            contributorIDs:[String],
            

          },
          { timestamps: true }
          );




const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift