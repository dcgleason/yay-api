const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET) // secret key for test environment, to be replaced by actual prod secret key when we start taking orderes

router.post('/secret', async (req, res) => {
  console.log('Making requests!');

  // Extract the email and amount from the request body
  const customerEmail = req.body.email;
  const amount = req.body.amount;

  const intent = await stripe.paymentIntents.create({
    currency: 'usd',
    amount: amount,
    metadata: { integration_check: 'accept_a_payment' },
    receipt_email: customerEmail, // Add the receipt_email property
  });

  console.log("request complete + intent: ", intent)
  res.json(intent);
});
 
module.exports = router