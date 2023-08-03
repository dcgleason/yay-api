const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * each gift contains a title
 * the ID of the initiating user
 * and the array of contributorIDs - each page will belong to one contributor (dg - what do you mean by this?)
 */
const giftSchema = new Schema(
  {
    giftOwnerID: String,
    giftOwnerEmail: String,
    recipientName: { type: String, required: true },
    shippingAddress: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    luluOrderString: String,
    returnAddress: String,
    contributerEmails: [String],
    bookTitle: String,
    introNote: String,
    published: Boolean,
    customPrompts: [String],
    contributions: [String],
    fiveDays: false,
    sent: false,
    date: { type: Date, required: true }, // Add the date field here
  },
  { timestamps: true }
);

const Gift = mongoose.model("Gift", giftSchema);

module.exports = Gift;


