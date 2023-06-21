
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/**
 * each user can initiate a Gift <-- user can be placed inside of the gift schema as owner of the gift
 */
const userSchema = new Schema(
  {
    bookID: { type: Schema.Types.ObjectId, ref: 'Book' },
    username: String,
    hash: String,
    salt: String,
    name: String,
    shippingAddress: String,
    giftOwnerEmail: String,
    refreshToken: String, // Add this line
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);


module.exports = User;
