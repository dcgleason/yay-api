const express = require('express');
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

router.post('/sendSMS', (req, res) => {
  const { time, recipient, gifter, to } = req.body;

  const messageBody = `You have ${time} amount left to contribute to ${recipient}'s Bundl that is being gifted by ${gifter}`;

  client.messages
    .create({
      body: messageBody,
      from: '+18449683130', // Replace with your Twilio number
      to: to // The recipient's phone number
    })
    .then(message => {
      console.log(message.sid);
      res.status(200).send({ message: 'SMS sent successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: 'Failed to send SMS' });
    });
});

module.exports = router;
