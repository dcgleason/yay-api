const express = require('express')
const router = express.Router()
const Gift = require("../models/Gift")

//gifts Home page
router.post('/insertOrder', async(req, res)=>{
    res.send("GIFTS home page!!!")

    const addressObj = {
        address: req.body.owner.shipping.address,
        city: req.body.owner.shipping.city,
        state: req.body.owner.shipping.state,
        zip: req.body.owner.shipping.zipCode,
        country: req.body.owner.shipping.country,
        phone: req.body.owner.shipping.phone
      }

      const ownerObj = {
        ownerName: req.body.owner.ownerName,
        ownerEmail: req.body.owner.ownerEmail,
        shipping: addressObj
      }

      const gift = {
        owner: ownerObj,
        //gifts have one owner
        uniqueId: req.body.gift.giftCode,
         // uniqueId is unqiue to the user
        messages: req.body.messages,
        //contributers are an array of contributer ids -- starts as an empty array
        contributorIDs: [],
        recipient: req.body.gift.recipient,
        fiveDays: false,
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


router.post('/insertmessages', async(req, res)=>{
    res.send("insert Messages home page!!!")

    if(req.body.messages && req.body.giftCode){   // instead of creating a gift - update it with the messages
    var query = { 'giftCode': req.body.giftCode }
    var update = { $push: { messages : req.body.messages}}
    const result = await Gift.findOneAndUpdate(query, update);
    res.send(result)
    }
    else{
        res.send("Messages and/or giftCode not present in the api call")
    }
    })

    router.get('/about', (req,res)=>{
        res.send("About GIFTS page")
})


module.exports = router