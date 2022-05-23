
        const mongoose = require('mongoose')
        const Schema = mongoose.Schema
        
        const userSchema = new Schema({
            name: String,
            gifts: [Gift]
          },
          { timestamps: true }
          );




const User = mongoose.model('User', userSchema);

module.exports = User