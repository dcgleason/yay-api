const express = require('express')
const router = express.Router()


//gifts Home page
router.get('/',(req, res)=>{
    res.send("GIFTS home page!!!")
})

router.get('/about', (req,res)=>{
    res.send("About GIFTS page")
})

module.exports = router