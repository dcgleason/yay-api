const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  layout_id: Number,
  name: String,
  msg: String,
  img_file: String,
});

const bookSchema = new Schema(
  {
    doc: {
      front: String,
      back: String,
    },
    rec_name: String,
    messages: {
      type: Map,
      of: messageSchema,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
  