
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
/**
 * each user can initiate a Gift <-- user can be placed inside of the gift schema
 */
const userSchema = new Schema({
    name: String,
    email: String,
    giftID: ObjectId
  },
  { timestamps: true }
  );

const User = mongoose.model('User', userSchema);

module.exports = User