const express = require('express')
const router = express.Router()
const Tester = require("../models/BetaTesters")


//beta sign up route - /beta/signup
router.post('/signup',async (req, res)=>{
    const tester = {
        name:req.body.name,
        email:req.body.email, 
        referralSource: req.body.referralSource
    }

    

    await Tester.create(tester, (err, createdItem)=>{
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




module.exports = router