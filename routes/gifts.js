const express = require('express')
const router = express.Router()
const Gift = require("../models/Gift")
const User = require("../models/User")
const Response = require("../models/Response")
var multer = require('multer');
  
require('dotenv').config({ path: require('find-config')('.env') })


//gifts Home page
router.post('/insertOrder', async(req, res)=>{
    res.send("GIFTS home page!!!")


      const giftObj = {
        ownerName: req.body.owner.ownerName,
        ownerEmail: req.body.owner.ownerEmail,
        recipientName: req.body.gift.recipient
      }

    

    //   const gift = {
    //     owner: ownerObj,
    //     //gifts have one owner
    //     uniqueId: req.body.gift.giftCode,
    //      // uniqueId is unqiue to the user
    //     messages: req.body.messages,
    //     //contributers are an array of contributer ids -- starts as an empty array
    //     contributorIDs: [],
    //     recipient: req.body.gift.recipient,
    //     fiveDays: false,
    //     sent: false
    //   }

    // do we need to add a timestamp object here? or will it timestamp it automatically?

   const insertedGift = await Gift.create(giftObj, (err, createdItem)=>{
        if(err){
            console.log(err)
            res.sendStatus(500)
        }
        else {
            console.log(createdItem)
            res.sendStatus(200)

        }
    })
    // create User collection
    const userObj = {
        ownerName: req.body.owner.ownerName,
        ownerEmail: req.body.owner.ownerEmail,
        giftReference: insertedGift._id
      }

   const insertedUser =  await User.create(userObj, (err, createdItem)=>{
        if(err){
            console.log(err)
            res.sendStatus(500)
        }
        else {
            console.log(createdItem)
            res.sendStatus(200)

        }
    })
    // .then(
    //     user => {
    //       console.log("User marked", user);
    //       const result = User.findById(user._id)
    //         .populate("giftReference");
    //     },
    //     err => next(err)
    //   )
    //   .catch(err => next(err));  
      
      console.log('insertedUser' + insertedUser);
})

router.get('/messages', async(req, res)=>{
    res.send("Messages home page!!!")
})

app.post('/',  (req, res, next) => {
  
   
});

router.post('/messages',  async(req, res)=>{

    const response = {
        giftID: 12345,
        questionOne: req.body.questionOne,
        contributor: req.body.contributorName,
        recipientName: req.body.recipientName,
        recipientStreet: req.body.recipientStreet,
        recipientCity: req.body.recipientCity,
        recipientZip: req.body.recipientZip, 
        recipientCountry: "USA",
        published: false
    } 
    

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

 })



router.get('/about', (req,res)=>{
    res.send("About GIFTS page")
})

module.exports = router