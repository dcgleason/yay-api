const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    bookID: { type: Schema.Types.ObjectId, ref: 'Book' },
    username: String,
    hash: String,
    salt: String,
    name: String,
    firstName: String,
    lastName: String,
    shippingAddress: String,
    giftOwnerEmail: String,
    refreshToken: String,
    lastEmailed: Date,
    prompts: [String],
    introNote: String,
    recipinet: String,
    recipientFirst: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;