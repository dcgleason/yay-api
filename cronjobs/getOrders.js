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
    var fortnightAgo = new Date(Date.now() - fiveDays).getTime(); //5 days ago in milliseconds
  
    try {
     const client = new MongoClient(url);
    await client.connect();
    
    const gifts = client.db("yay_gift_orders").collection("gift_orders");
    const update = await gifts.updateMany(
      { 'createdAt': { $lte: fortnightAgo }}, // if the createdAt date is less than or equal to two weeks ago...
      { $set: { "gift.twoWeeks": true}} // set fiveDays field to true, to mark that it's been fiveDays 
    );
    console.log(update);
    const results = gifts.find(
      { $and: [ {"gift.twoWeeks": true}, {'gift.sent': false}] }
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