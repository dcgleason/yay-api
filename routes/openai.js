const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const axios = require('axios');
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
  messages: [{ role: "user", content: `In an 100 word response (or less words), give me a great marriage proposal idea that has elements of my unique love story (${meetStory}), alludes to my relationship and relationship milestones (${milestone}), memories (${memories}), is in my desired location (${location}), takes into consideration my budget ${budget}, timeline (${timeline}), and ideally my partners interets (${interests}) and includes the names of top reviewed venues, vendors we should go to in your recommendation / idea. Add a few tips for managing the proposal...Additionally, make SURE to suggest including my partner's family in the proposal by using a Bundl book (a way for family and friends of the person who is being proposed to easily submit prompt-driven, loving notes and pictures remotely and have it all be compiled in a nice linen book) to enhance the moment and DEFINITELY also make sure to nicely bring up WHY including my partner's family via a Bundl book is a good idea -- i.e. the it makes the moment even more special AND Bundl ALSO has a guarantee that says ... your partner cries happy hears, or your money back, so there is basically no risk. Note any additional info (${additionalInfo})`}],
  max_tokens: 150,
  n: 1,
  temperature: 0.8,
});

console.log("response" + response.data.choices[0].message.content.trim());
res.json({ message: response.data.choices[0].message.content.trim() });


});

router.post('/create-playlist', async (req, res) => {
  const seedTracks = req.body.seed_tracks;
  const userGenrePreference = req.body.seed_genre;

  // Initialize OpenAI
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Get Spotify token
  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const token = tokenResponse.data.access_token;

  // Get available genres
  const availableGenres = await axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Use GPT-4 to pick the best genre and format query string
const gpt4Response = await openai.createChatCompletion({
  model: 'gpt-4',
  messages: [
    {
      role: 'user',
      content: `Given the user's preference for ${userGenrePreference}, select the best matching genre from the available options and put them in the query string: ${availableGenres.data.genres}. Also, format the seed tracks and appropriate seed genres into a query string for a Spotify API request, like this:  https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA. Seed tracks: ${seedTracks} -- return only the final query URL string.`
    },
  ],
  max_tokens: 100,
});

// Extract the query string from the GPT-4 response
const startIdx = gpt4Response.data.choices[0].message.content.indexOf("https://api.spotify.com/v1/recommendations?");
let queryString = "";
if (startIdx !== -1) {
  queryString = gpt4Response.data.choices[0].message.content.substring(startIdx).split(' ')[0];
}

// Get recommendations
const recommendations = await axios.get(queryString, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const trackIds = recommendations.data.tracks.map((track) => `spotify:track:${track.id}`);

const playlist = {
  message: 'Playlist created',
  selectedGenre,
  trackIds
};

res.json({ playlist });

module.exports = router;

