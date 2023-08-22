const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("OpenAI api home page");
});

router.post("/gift", async (req, res) => {
    
   var meetStory = req.body.meetStory 
   var milestone = req.body.milestone
   var memories = req.body.memories
   var budget = req.body.budget
   var interests = req.body.interests
   var timeline = req.body.timeline
   var location = req.body.location;
   var additionalInfo = req.body.additionalInfo;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createChatCompletion({
  model: "gpt-4",
  messages: [{ role: "user", content: `Create a marriage proposal idea that has elements of my unique love story (${meetStory}), alludes ro or somehow includes a reference to my relationship and relationship milestones (${milestone}), memories (${memories}), is in my desired location (${location}), takes into consideration my budget ${budget}, timeline (${timeline}), and my partners interets (${interests}) and includes specific links to top reviewed venues, vendors. Add a few tips for managing the proposal...(additionally, mention the importance of including your partner's family in the proposal). Note any additional info (${additionalInfo})`}],
  max_tokens: 400,
  n: 1,
  temperature: 0.5,
});

console.log("response" + response.data.choices[0].message.content.trim());
res.json({ message: response.data.choices[0].message.content.trim() });


});

module.exports = router;

