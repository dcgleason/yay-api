const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("OpenAI api home page");
});

router.post("/gift", async (req, res) => {
    
   var age = req.body.age 
   var gender = req.body.gender
   var interests = req.body.interests
   var occasion = req.body.occasion
   var budget = req.body.budget
   var additionalInfo = req.body.additionalInfo
   var relation = req.body.relation;
   var recipient = req.body.giftRecipient;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: `Generate one thoughtful idea for me to give ${recipient}, we are related via as ${relation}. ${recipient} is ${age}-year-old ${gender} and is interested in ${interests}. The occasion is for ${occasion} and my budget is ${budget}. Make the gift appropriate for ${recipient}'s age, gender, and pick only 1 of ${recipient}'s interests, unless you can nicely incorperate mnultiple interests into one gift idea. Make the gift as creative and as personal as possible. When presenting the gift idea, include the gift idea as "Give X" where X is the idea, then follow that with a brief description of X (your idea). Generate a new and different idea with each submission. Additional information: ${additionalInfo}`,
  temperature: 0.5,
  max_tokens: 200,
});

console.log("response" + response.data.choices[0].text);
res.json({ message: response.data.choices[0].text });


});

module.exports = router;
