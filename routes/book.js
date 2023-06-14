const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");
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
  Book.findOne({ userID: req.params.id }, (err, book) => {
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
router.post("/:id/message", upload.single("imageAddress"), async (req, res) => {
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


// POST route to create a new book and attach it to a user
router.post('/create', async (req, res) => {
  // Find the user by ID
  const user = await User.findById(req.body.userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

// Create a new book
const newBook = new Book({
  doc: {
    front: 'front cover text', // front cover ID
    back: 'back cover text', // back cover ID
  },
  rec_name: 'receiver name',
  userID: user._id, // Set the userID field to the ID of the user
  messages: new Map(), // Initialize with an empty Map
});

  try {
    // Save the book to the database
    const savedBook = await newBook.save();

    // Update the user's bookID field with the ID of the new book
    user.bookID = savedBook._id;
    const updatedUser = await user.save();

    // Send the updated user as a response
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
