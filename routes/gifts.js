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


    var data = JSON.stringify({
        "image_template": 6,
        "handwriting_style": 4,
        "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "recipients": [
          {
            "name": "Current Resident",
            "address": "123 Main Street",
            "city": "Fake City",
            "province": "NY",
            "postal_code": "55555",
            "country": "US"
          }
        ]
      });
      
      var config = {
        method: 'post',
        url: 'https://api.thanks.io/api/v2/send/postcard',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });


    const response = {
        giftID: req.body.giftID,
        questionOne: req.body.questionOne,
        contributor: req.body.contributorName,
        recipientName: req.body.recipientName,
        recipientStreet: req.body.recipientStreet,
        recipientCity: req.body.recipientCity,
        recipientZip: req.body.recipientZip, 
        recipientCountry: req.body.recipientCountry,
        published: false
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