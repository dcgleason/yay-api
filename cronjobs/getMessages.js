const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors')
const express = require("express");
const app = express();
const path = require('path');
const axios = require('axios');
var cron = require('node-cron');
const pg = require('pg')
const mongoose= require('mongoose');
const multer  = require('multer')
const model = require('./model');
let dotenv = require('dotenv');
dotenv.config()


const mongoMessagesCollect = async () => {

  
    try {
     const client = new MongoClient(url);
    await client.connect();
    const messages = client.db("yay_gift_orders").collection("messages");

    for(var i =0; i<todaysOrders.length; i++ ){ //loop through orders and match all giftCodes to message objects
    const results = messages.find(
      {"giftCode": todaysOrders[i].gift.giftCode}
    );

    const gifts = client.db("yay_gift_orders").collection("gift_orders");
    
    results.forEach((message) => { //for each message object find the gift order and push the message object with a mathing giftCode into the message array inside the associated gift Order
      todaysMessages.push(message);
      gifts.findOneAndUpdate(
        {'gift.giftCode': message.giftCode},
        { $push: { 'messages': message}} // the message object with name, message (arr), and gift code are all push into the message array in the orders document
      )
      })
    }
    } 
    finally {
    await client.close();
    }
    }