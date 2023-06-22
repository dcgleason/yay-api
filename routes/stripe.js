const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET) // secret key for test environment, to be replaced by actual prod secret key when we start taking orderes



// Change the route from a GET to a POST
router.post('/secret', async (req, res) => {
  console.log('Making requests!');

  // Extract the email from the request body
  const customerEmail = req.body.email;

  const intent = await stripe.paymentIntents.create({
    currency: 'usd',
    amount: 7900,
    metadata: { integration_check: 'accept_a_payment' },
    receipt_email: customerEmail, // Add the receipt_email property
  });

  res.json(intent);
});
 
module.exports = router