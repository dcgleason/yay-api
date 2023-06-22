const express = require('express')
const router = express.Router()
const Waitlister = require("../models/Waitlister")


//beta sign up route - /beta/signup
router.post('/waitlist', async (req, res) => {
    try {
        const {email} = req.body
        const waitlister = await Waitlister.create({email})
        res.json(waitlister)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            userFound: false,
            error: true,
            message: "Server error"
        })
    }
  
}




module.exports = router