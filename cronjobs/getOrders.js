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



const mongoOrderCollect = async () => {

    var fiveDays = 432000 * 1000 
    var fiveDaysAgo = new Date(Date.now() - fiveDays).getTime(); //5 days ago in milliseconds
  
    try {
     const client = new MongoClient(url);
    await client.connect();
    
    const gifts = client.db("yay_gift_orders").collection("gift_orders");
    const update = await gifts.updateMany(
      { 'createdAt': { $lte: fiveDaysAgo }}, // if the createdAt date is less than or equal to 5 days ago...
      { $set: { "gift.fiveDays": true}} // set fiveDays field to true, to mark that it's been five days 
    );
    console.log(update);
    const results = gifts.find(
      { $and: [ {"gift.fiveDays": true}, {'gift.sent': false}] }
    )
    
    results.forEach((gift) => {
      todaysOrders.push(gift);
      })
  
    return true;
    } 
    finally {
    await client.close();
    }
    }

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


    cron.schedule('* * 12 * * 0-6', () => {
        console.log('Running a job every day at 12:00 pm at America/New_York timezone. Searching for orders that were created more than 5 days ago');
        const done = mongoOrderCollect();
        if (done){
          mongoMessagesCollect();
        }
      }, {
        scheduled: false,
        timezone: "America/New_York"
      });