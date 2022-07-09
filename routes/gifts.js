const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Gift = require("../models/Gift")
const app = express();

//gifts Home page
router.get('/',(req, res)=>{
    res.send("GIFTS home page!!!")

    const gift = {
        title:req.body.title, 
        userID:req.body.userID, 
        contributorIDs: req.body.contributorArray
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