//RENAMED TO CONTRIBUTION TO CAPTURE CONTRIBUTER RESPONSES
// AS WELL AS CONTRIBUTER INFORMATION
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * Description:
 * Contributers are added to a gift by a user
 * each contributer is associated with one gift
 * and are identified by their _id
 * each contributer has an array of questionIDs that contain the contents of
 * each question along with images and responses
 *
 */

const contributionSchema = new Schema(
  {
    name: String, //guest user name
    message: String, // message that will be attached to the entry in the book
    associatedGiftID: String,
    contributed: Boolean,
    ImageAddress: String, // the plan currently is to host these images in an s3 bucket and pull them down as needed when creating the pdf.
    email: String,
  },
  { timestamps: true }
);

const Contrbution = mongoose.model("Contribution", contributionSchema);

module.exports = Contrbution;
