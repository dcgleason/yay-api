const express = require('express')
const router = express.Router()
const { MongoClient } = require('mongodb');

const url = process.env.DB_URI

// const url = 'mongodb+srv://dcgleason:F1e2n3n4!!@yay-cluster01.lijs4.mongodb.net/test'

// do I need to reconnected to MongoDB here? ^^ 


// gifts Home page
router.post('/check', async (req, res) => { 

    var giftCode = req.body.giftCode
  
    try {
          const client = new MongoClient(url);
          await client.connect();
          console.log('unique - after mongo connect')
        
        const gifts = client.db("yay_gift_orders").collection("gift_orders");
        const order = gifts.findOne({"gift.giftCode": giftCode});
        console.log('order results' + order);
        if(order){
          console.log('in if statement')
          res.send(true)
        }
        else {
          res.send(false)
        }
        
     } 
     finally {
        await client.close();
     }
    })
  

module.exports = router