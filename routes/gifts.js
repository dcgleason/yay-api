const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Gift = require("../models/Gift")
const app = express();

//gifts Home page
router.get('/',(req, res)=>{
    res.send("GIFTS home page!!!")

    const addressObj = {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phone: req.body.phone
      }

      const ownerObj = {
        ownerName: req.body.ownerName,
        ownerEmail: req.body.ownerEmail,
        shipping: addressObj
      }

      const gift = {
        owner: ownerObj,
        //gifts have one owner
        uniqueId: req.body.uniqueId,
         // uniqueId is unqiue to the user
        messages: req.body.messages,
        //contributers are an array of contributer ids
        contributorIDs: req.body.contributorArray,
        twoWeeks: false,
        sent: false
      }

    // do we need to add a timestamp object here? or will it timestamp it automatically?

    await Gift.create(gift, (err, createdItem)=>{
        if(err){
            console.log(err)
            res.sendStatus(500)
        }
        else {
            console.log(createdItem)
            res.sendStatus(200)

        }
    }) 
})

router.get('/about', (req,res)=>{
    res.send("About GIFTS page")
})

router.post('/insertOrder', async (req, res) => {
    console.log('createOrder');
  
    var createdAt= req.body.createdAt
    var ownerName = req.body.owner.ownerName;
    var ownerEmail = req.body.owner.ownerEmail;
    var address = req.body.owner.shipping.address;
    var city = req.body.owner.shipping.city;
    var state = req.body.owner.shipping.state;
    var zipCode = req.body.owner.shipping.zipCode;
    var country = req.body.owner.shipping.country;
    var phone = req.body.owner.shipping.phone;
    var giftCode = req.body.gift.giftCode
    var name = req.body.gift.recipient
  
    var data = JSON.stringify({
            "createdAt": createdAt,
            "owner": {
              "ownerName": ownerName,
              "ownerEmail": ownerEmail,
              "shipping": {
                "address": address,
                "city": city,
                "state": state,
                "zip": zipCode,
                "country": country,
                "phone": phone,
              }
            },
            "gift": {
                "giftCode": giftCode,
                "recipient": name,
                "messages": [],
                "twoWeeks": false,
                "sent": false
            }
    });
    try {
      const client = new MongoClient(url);
      await client.connect();
     
     const gifts = client.db("yay_gift_orders").collection("gift_orders");
     const results = gifts.insertOne(data);
     console.log(`An order document was inserted with the _id: ${results.insertedId}`);
     } 
     finally {
     await client.close();
     }
  });

module.exports = router