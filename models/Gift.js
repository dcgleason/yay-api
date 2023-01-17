const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * each gift contains a title
 * the ID of the initiating user
 * and the array of contributorIDs - each page will belong to one contributor (dg - what do you mean by this?)
 */
const giftSchema = new Schema(
  {
    giftOwnerID: String, //this will be the string representing User._id
    recipientName: { type: String, required: true },
    recipientFirstName: { type: String, required: true },
    recipientLastName: { type: String, required: true },
    shippingAddress: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    luluOrderString: String,
    returnAddress: String,
    contributerEmails: [String], //emails provided by the user for contributers to this gift.
    bookTitle: String,
    published: Boolean,
    customPrompts: [String],
    contributions: [String],
    fiveDays: false, // for determining if it's been 5 days or not
    sent: false, // for determining if it was shipped to end user / recipient
  },
  { timestamps: true }
);


const Gift = mongoose.model("Gift", giftSchema);

module.exports = Gift;

