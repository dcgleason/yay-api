
const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * each user can initiate a Gift
 */
const userSchema = new Schema({
    name: String,
    email: String,
    giftIDs: [String],
  },
  { timestamps: true }
  );




const User = mongoose.model('User', userSchema);

module.exports = User