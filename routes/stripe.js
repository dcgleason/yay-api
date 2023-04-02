const express = require('express')
const router = express.Router()
const stripe = require('stripe')('pk_live_51KtCf1LVDYVdzLHCUtQK32jpPhwyxyjzgPrrkkmMILYyKKIZ0IQMg6qcabL5jZm1Po6hrjoTNPOpkcaCrTyIXPyK00vfZkVAtP') // secret key for test environment, to be replaced by actual prod secret key when we start taking orderes



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