
        const mongoose = require('mongoose')
        const Schema = mongoose.Schema
        /**
         * Description:
         * Contributers are added to a gift by a user
         * each contributer is associated with one gift
         * and are identified by their _id
         * each contributer has an array of questionIDs that contain the contents of 
         * each question along with images and responses
         * 
         */

        const contributerSchema = new Schema({
            name: String,
            email: String,
            //contributers have one gift _id
            giftID: String,
            //contributers will get questions from the question model
            //the questions property will be the _id of the Question model
            //every 
            questionIDs: [String]  
          },
          { timestamps: true }
          );



const Contributer = mongoose.model('Contributer', giftSchema);

module.exports = Contributer