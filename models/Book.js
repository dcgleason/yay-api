const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
  layout_id: Number,
  name: String,
  msg: String,
  img_file: String,
  audio_file: String,
  qr_code_url: String,
  email: String,
});


const bookSchema = new Schema(
  {
    doc: {
      front: String,
      back: String,
    },
    rec_name: String,
    rec_first_name: String,
    introNote: String,
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: {
      type: Map,
      of: messageSchema,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
  