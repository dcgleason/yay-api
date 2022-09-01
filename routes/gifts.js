const express = require('express')
const router = express.Router()
const Gift = require("../models/Gift")
const Response = require("../models/Response")

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


    const response = {
        giftID: req.body.giftID,
        questionOne: req.body.questionOne,
        questionTwo: req.body.questionTwo,
        questionThree: req.body.questionThree,
        additionalComments: req.body.additionalComments,
        contributor: req.body.contributorName,
        recipientName: req.body.recipientName,
        recipientStreet: req.body.recipientStreet,
        recipientCity: req.body.recipientCity,
        recipientZip: req.body.recipientZip, 
        recipientCountry: req.body.recipientCountry
    } 
    res.send("insert Messages home page!!!")

    if(req.body.contributorName){   // instead of creating a gift - update it with the messages
        await Response.create(response, (err, createdItem)=>{
            if(err){
                console.log(err)
                res.sendStatus(500)
            }
            else {
                console.log(createdItem)
                res.sendStatus(200)
    
            }
        }) 
    }
    else{
        res.send("Messages and/or giftCode not present in the api call")
    }
    })

    router.get('/about', (req,res)=>{
        res.send("About GIFTS page")
})


module.exports = router