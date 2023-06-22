const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    bookID: { type: Schema.Types.ObjectId, ref: 'Book' },
    username: String,
    hash: String,
    salt: String,
    name: String,
    shippingAddress: String,
    giftOwnerEmail: String,
    refreshToken: String,
    lastEmailed: Date,
    prompts: [String],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;