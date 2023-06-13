const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const multer = require("multer");
const upload = multer();
const axios = require("axios");
const aws = require("aws-sdk");
require("dotenv").config({ path: require("find-config")(".env") });
const uuid = require("uuid");

// GET ROUTES

// Get the whole book by id
router.get("/:id", async (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      console.log(err.message);
      const error = {
        bookFound: false,
        error: true,
        message: "error could not find book",
      };
      res.status(400).send(error);
    } else {
      res.send(book);
    }
  });
});

// Get all messages from the book
router.get("/:id/messages", async (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      console.log(err.message);
      const error = {
        bookFound: false,
        error: true,
        message: "error could not find book",
      };
      res.status(400).send(error);
    } else {
      res.send(book.messages);
    }
  });
});

// POST ROUTES

// Create a new message in the book
router.post("/:id/messages", upload.single("imageAddress"), async (req, res) => {
  try {
    // Generate the S3 upload URL
    const uploadURL = await generateUploadURL();

    // Upload the file to S3
    const file = req.file;
    if (file) {
      await axios.put(uploadURL, file.buffer, {
        headers: {
          "Content-Type": file.mimetype,
        },
      });
    }

    // Get the image URL
    const imageURL = uploadURL.split("?")[0];

    // Create the messageData object from req.body (parsed by multer)
    const messageData = {
      layout_id: req.body.layout_id,
      name: req.body.name,
      msg: req.body.msg,
      img_file: imageURL,
    };

    // Add the message to the book in the database
    Book.findById(req.params.id, (err, book) => {
      if (err) {
        console.log(err.message);
        const error = {
          bookFound: false,
          error: true,
          message: "error could not find book",
        };
        res.status(400).send(error);
      } else {
        book.messages.set(req.body.messageId, messageData);
        book.save();
        res.status(200).send({ message: "Message successfully added to the book" });
      }
    });
  } catch (err) {
    console.log(err.message);
    // handle error
    const error = {
      messageAdded: false,
      error: true,
      message: "error could not add message to the book",
    };
    res.status(400).send(error);
  }
});

module.exports = router;
