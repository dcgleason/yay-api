
const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * each user can initiate a Gift <-- user can be placed inside of the gift schema
 */
const userSchema = new Schema({
    name: String,
    email: String,
    giftIDs: [String],
  },
  { timestamps: true }
  );

const User = mongoose.model('Tester', userSchema);

module.exports = User