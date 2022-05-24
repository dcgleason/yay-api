
        const mongoose = require('mongoose')
        const Schema = mongoose.Schema
        
        const giftSchema = new Schema({
            name: String,
            //gifts have one user
            user: String,
            //contributers are an array of contributer ids
            contributors:[String],
            

          },
          { timestamps: true }
          );




const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift