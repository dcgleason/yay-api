const express = require('express')
const router = express.Router()
const Gift = require("../models/Gift")


router.post('/check', async (req, res) => { 

    var giftCode = req.body.giftCode
    const client = new MongoClient(url);
  
    try {
          
        const result = await Gift.findOne({ giftCode: giftCode }).exec();
        if(result){
          console.log('gift code already exists')
          res.send(true)
        }
        else {
          res.send(false)
        }
        
     } 
     catch {
        console.log('error connecting with Gift model');
     }
    res.send(false);
    })
  

module.exports = router