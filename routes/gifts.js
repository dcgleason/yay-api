const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Gift = require("../models/Gift")
const app = express();

//gifts Home page
router.post('/insertOrder', async(req, res)=>{
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


module.exports = router