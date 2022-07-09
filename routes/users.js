const express = require('express')
const router = express.Router()


//users Home page
router.get('/',(req, res)=>{
    res.send("Users home page!!!")
})

router.get('/:id',(req, res)=>{
    //get url parameters by accessing the 
    //"dynamically created" property added 
    //in the url of the get request
    // in this case the url say "/:id" which means the "req.params" object
    // that gets returned now has a ".id" property
    // We can use this feature to render a page with the user specific 
    // data or a completely seperate page layout based on the whether
    //the user is signed in or not
    res.send(`${req.params.id}`)


    // implications of this is that a requester could select the questions he wants to ask, along with prompts. 
})

router.get('/about', (req,res)=>{
    res.send("About Users page")
})

module.exports = router