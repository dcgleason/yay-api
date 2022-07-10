const mongoose = require('mongoose')
        const Schema = mongoose.Schema
        /**
         * a question will be assosciated with one giftID  <-- might be easier to put this all in a gift schema together as a nested object? no? 
         * a question will have one question and one answer
         * and a question will be associated with on Contributor via contributorID
         * each question document may contain an image (img) represented as a string
         */
        const questionSchema = new Schema({
            giftID: String,
            contributorID: String,
            question: String,
            answer: String,
            img: String,
          },
          { timestamps: true }
          );



const Question = mongoose.model('Question', questionSchema);

module.exports = Question