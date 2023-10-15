//RENAMED TO CONTRIBUTION TO CAPTURE CONTRIBUTER RESPONSES
// AS WELL AS CONTRIBUTER INFORMATION
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * Description:
 * Contributers are added to a gift by a user
 * each contributer is associated with one gift
 * and are identified by their _id
 * each contribution will contain all the information necessary to make an entry. images message etc...
 */
//bundle.com/gifts/contribution/kxzjdfl;kasdf

const contributionSchema = new Schema(
  {
    name: String, //guest user name will be used to populate the entry on the page
    message: String, // message that will be attached to the entry in the book
    associatedGiftID: String, // which gift is this entry for
    contributed: Boolean, //did the user submit a response? true or false
    imageAddress: String, // the plan currently is to host these images in an s3 bucket and pull them down as needed when creating the pdf.
    email: String,
  },
  { timestamps: true }
);

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
