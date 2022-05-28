
        const mongoose = require('mongoose')
        const Schema = mongoose.Schema
        /**
         * each user can initiate a Gift
         */
        const testerSchema = new Schema({
            name: String,
            email: String,
            referralSource: String,
          },
          { timestamps: true }
          );




const Tester = mongoose.model('Tester', testerSchema);

module.exports = Tester