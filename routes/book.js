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
      // Send both the messages and the book's id
      res.send({ messages: book.messages, bookId: book._id, recipient: book.rec_name});
    }
  });
});


// POST ROUTES

router.post("/:id/message", upload.single("imageAddress"), async (req, res) => {
  try {
    let imageURL;

    // Upload the file to S3 if it exists
    const file = req.file;
    if (file) {
      const uploadURL = await generateUploadURL();
      await axios.put(uploadURL, file.buffer, {
        headers: {
          "Content-Type": file.mimetype,
        },
      });
      imageURL = uploadURL.split("?")[0];
    }

    // Create the messageData object from req.body (parsed by multer)
    const messageData = {
      layout_id: req.body.layout_id,
      name: req.body.name,
      msg: req.body.msg,
      img_file: imageURL,
      email: req.body.email,  // Add the email attribute here
    };

     // Add the message to the book in the database
     const book = await Book.findOne({ userID: req.params.id });
     if (!book) {
       return res.status(404).json({ error: "Book not found" });
     }
 
    // Check if the message already exists in the book
    const existingMessage = Array.from(book.messages.values()).find(message => message.email === req.body.email);

    if (existingMessage) {
      return res.status(400).json({ error: "Message already exists in the book" });
    }

    // Generate a unique ID for the message
    const messageId = uuid.v4();

    book.messages.set(messageId, messageData);
    await book.save();

    res.status(200).json({ message: "Message successfully added to the book", messageId: messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add message to the book" });
  }
});





// Update a specific message in a book
router.put('/:userId/message/:messageId', async (req, res) => {
  try {
    // Find the book by userId
    const book = await Book.findOne({ userID: req.params.userId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get the message from the book's messages map
    const message = book.messages.get(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Update the message with the new data
    message.name = req.body.name;
    message.msg = req.body.msg;
    message.img_file = req.body.img_file;

    // Save the updated book
    await book.save();

    res.json({ message: 'Message updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE route to delete a message from a book
router.delete('/:bookId/message/:messageId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.messages.has(req.params.messageId)) {
      return res.status(404).json({ message: 'Message not found' });
    }

    book.messages.delete(req.params.messageId);
    await book.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST route to create a new book and attach it to a user / gifter
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
