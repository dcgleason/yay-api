const express = require('express')
const router = express.Router()
const stripe = require('stripe')('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') // secret key for test environment, to be replaced by actual prod secret key when we start taking orderes



// app route to /secret for Stripe.JS to get the client secret 
router.get('/secret', async (req, res) => {

    console.log('Making requests!')
    const intent = await stripe.paymentIntents.create({
     currency: 'usd',
     amount: 4900,
     metadata: {integration_check: 'accept_a_payment'}
   });
 
 
   res.json(intent);
 })

 
module.exports = router