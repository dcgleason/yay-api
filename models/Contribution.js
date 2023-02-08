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
    associatedGiftID: String, // which gift is this entry for -- in the contribution page url -- this is Gift._id
    associatedGiftOwnerID: String, // added so that we can easily group the gifts by ownern -- this is User._id and the Gift.giftOwnerID
    contributionPageOneURL: String,
    contributionPageTwoURL: String,
    contributed: Boolean, //did the user submit a response? true or false -- might not need this (if only people who have submitted a response are added to the gift)
    imageAddress: String, // the plan currently is to host these images in an s3 bucket and pull them down as needed when creating the pdf.
    audioAddress: String, // the plan currently is to host these images in an s3 bucket and pull them down as needed when creating the pdf.
    email: String,
  },
  { timestamps: true }
);

const Contrbution = mongoose.model("Contribution", contributionSchema);

module.exports = Contrbution;
