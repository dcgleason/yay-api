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
const { Configuration, OpenAIApi } = require("openai");
const QRCode = require('qrcode');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');




// GET ROUTES

// Get the book associated with a specific user
router.get('/:userId', async (req, res) => {
  try {
    // Find the book by userId
    const book = await Book.findOne({ userID: req.params.userId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Return the entire book object
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

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

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// POST ROUTES
router.post("/:id/message", upload.fields([{ name: 'imageAddress', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), async (req, res) => {
  try {
    let imageURL;
    let audioURL;

    // Upload the image file to S3 if it exists
    const imageFile = req.files['imageAddress'][0];
    if (imageFile) {
      const imageUploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `images/${uuid.v4()}.${imageFile.originalname.split('.').pop()}`, // Generate a unique file name
        Body: imageFile.buffer,
        ContentType: imageFile.mimetype,
      };

      const imageUploadResult = await s3.upload(imageUploadParams).promise();
      imageURL = imageUploadResult.Location;
    }

    // Upload the audio file to S3 if it exists
    let audioFile;
    if (req.files['audio']) {
      audioFile = req.files['audio'][0];
    }
    if (audioFile) {
      const audioUploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `audio/${uuid.v4()}.mp3`, // Generate a unique file name
        Body: audioFile.buffer,
        ContentType: audioFile.mimetype,
      };

      const audioUploadResult = await s3.upload(audioUploadParams).promise();
      audioURL = audioUploadResult.Location;
    }

    // Create the messageData object from req.body (parsed by multer)
    const messageData = {
      layout_id: req.body.layout_id,
      name: req.body.name,
      msg: req.body.msg,
      img_file: imageURL,
      audio_file: audioURL,
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

    // Call the appropriateness check after the response has been sent
    checkAppropriateness(book, messageId, messageData.msg, audioURL);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add message to the book" });
  }
});

async function checkAppropriateness(book, messageId, msg, audioURL) {
  // Create OpenAI instance
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  // Call OpenAI for appropriateness check
  const appropriatenessResponse = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: `Please rate the appropriateness of the following letter (text) on a scale of 1 to 10, where 1 is highly inappropriate and 10 is highly appropriate: ${msg}. If you rate the letter as a 3 or above, please correct any spelling mistakes in the letter and return just the corrected letter. Only give me the letter with correct spelling. If the rating is below a 3, please return the letter as is with the label "inappropriate"`}],
    max_tokens: 900,
    n: 1,
    stop: null,
    temperature: 1,
  });

    // Log the response from the OpenAI API call
    console.log('Appropriateness response:', appropriatenessResponse.data);

  if (appropriatenessResponse) {
    const messageData = book.messages.get(messageId);
    messageData.msg = appropriatenessResponse.data.choices[0].message.content.trim();
    const qrCodeDir = path.join(__dirname, '..', 'qrCodes');

    // Create the qrCodes directory if it doesn't exist
    if (!fs.existsSync(qrCodeDir)){
        fs.mkdirSync(qrCodeDir);
    }
    
    // Generate QR code
    QRCode.toFile(path.join(qrCodeDir, `${messageId}.png`), audioURL, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }, async function (err) {
      if (err) throw err
      console.log('QR code generated and saved to qr.png');
    
      // Upload the QR code file to S3
      const qrCodeFile = fs.createReadStream(path.join(qrCodeDir, `${messageId}.png`));
      const qrCodeUploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `qrCodes/${messageId}.png`,
        Body: qrCodeFile,
        ContentType: 'image/png',
      };
    
      const qrCodeUploadResult = await s3.upload(qrCodeUploadParams).promise();
    
      // Save the URL of the QR code to the message data
      messageData.qr_code_url = qrCodeUploadResult.Location;
    
      book.messages.set(messageId, messageData);
      await book.save();
    });

  } else {
    console.log("No appropriateness response from OpenAI");
    console.log("approp response" + appropriatenessResponse.data.choices[0].message.content.trim());
  }
}

//PUT route to update the book by adding the prompts, recipient name, and welcome message

router.put('/:userId/firstUpdate', async (req, res) => {
  try {
    // Find the book by userId
    const book = await Book.findOne({ userID: req.params.userId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const deliveryDate = new Date(req.body.deliveryDate);
    const physicalBook = req.body.physicalBook;

    // Calculate the process start date
    let processStartDate = new Date(deliveryDate);
    processStartDate.setDate(processStartDate.getDate() - (physicalBook ? 14 : 7));

    console.log('req.body.contributors :', req.body.contributors);
    // Update the book's welcome message, prompts, and recipient's full name
    book.introNote = req.body.introNote;
    book.rec_name = req.body.rec_name;
    book.rec_first_name = req.body.rec_first_name;
    book.contributors = req.body.contributors;

    // Save the updated book
    await book.save();

    // Call the /start-email-process route to start the email process
    const response = await axios.post('https://yay-api.herokuapp.com/book/email/start-email-process', {
      userId: req.params.userId,
      processStartDate: processStartDate.toISOString(),
      physicalBook: physicalBook,
      recipients: req.body.contributors,
    });

    if (response.status === 200) {
      console.log('Email process scheduled successfully');
    } else {
      console.log('Failed to schedule email process:', response.data);
    }

    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// PUT route to update the front and back of a book
router.put('/:userId/updateBook', async (req, res) => {

  try {
    // Find the book by userId
    const book = await Book.findOne({ userID: req.params.userId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update the front and back with the selected book style
    book.doc.front = req.body.chooseStyle;
    book.doc.back = req.body.chooseStyle;

    // Save the updated book
    await book.save();

    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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
    message.email = req.body.email;
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
