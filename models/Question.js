const mongoose = require('mongoose')
        const Schema = mongoose.Schema
        
        const questionSchema = new Schema({
            name: String,
            email: String,
            gift: [String],
          },
          { timestamps: true }
          );




const Question = mongoose.model('Question', questionSchema);

module.exports = Question