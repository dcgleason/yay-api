const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Tester = require("../models/BetaTesters")
const cors = require('cors')
const app = express();

//initialize cors options and white list
const whitelist = ['http://localhost:3000', 'https://amorebooks.io']

const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
  }

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://yoursite.com");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


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