const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const waitlistSchema = new Schema(
  {
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const Waitlister = mongoose.model("Waitlister", waitlistSchema);

module.exports = Waitlister;