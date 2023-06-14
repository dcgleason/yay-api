
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/**
 * each user can initiate a Gift <-- user can be placed inside of the gift schema as owner of the gift
 */
const userSchema = new Schema(
  {
    bookID: { type: Schema.Types.ObjectId, ref: 'Book' }, // Assuming 'Book' is the name of your book model
    username: String,
    hash: String,
    salt: String,
    name: String,
    shippingAddress: String,
    giftOwnerEmail: String,
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);


module.exports = User;
