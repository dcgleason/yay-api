
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/**
 * each user can initiate a Gift <-- user can be placed inside of the gift schema as owner of the gift
 */
const userSchema = new Schema(
  {
    associatedGiftIDs: [String],
    firstName: String,
    lastName: String,
    shippingAddress: String,
    email: String,
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);


module.exports = User;
