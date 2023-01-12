//NO LONGER USED THIS WILL BE PART OF THE GIFT SCHEMA

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * a question will be assosciated with one giftID  <-- might be easier to put this all in a gift schema together as a nested object? no?
 * a question will have one question and one answer
 * and a question will be associated with on Contributor via contributorID
 * each question document may contain an image (img) represented as a string
 */
const responseSchema = new Schema(
  {
    giftID: Number,
    contributorID: String,
    questionOne: String,
    // img: String,
    contributor: String,
    recipientName: String,
    recipientStreet: String,
    recipientCity: String,
    recipientZip: Number,
    recipientCountry: String,
    published: Boolean,
  },
  { timestamps: true }
);

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
