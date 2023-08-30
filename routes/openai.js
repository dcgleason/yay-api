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
  const userAccessToken = req.body.access_token; // Get the user-specific access token from the request body

  if (!seedTracks || !userGenrePreference || !userAccessToken) {
    console.log('Missing seed_tracks, seed genre, or access token');
    return res.status(400).json({ error: 'Missing seed_tracks, seed genre, or access token' });
  }

  // Initialize OpenAI
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let yourSpotifyUserId;
  try {
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${userAccessToken}`, // Use the user-specific access token here
      },
    });
    yourSpotifyUserId = userResponse.data.id;
  } catch (error) {
    console.error('Error getting Spotify User ID:', error);
    return res.status(401).json({ error: 'Failed to get Spotify User ID' });
  }

  let availableGenres;
  try {
    availableGenres = await axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,  // <-- Use userAccessToken
      },
    });
  } catch (error) {
    console.error('Error getting available genres:', error);
    return res.status(401).json({ error: 'Failed to get available genres' });
  }

  let queryString;
  try {
    const gpt4Response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Return only the final query string....here is the prep process first: give me a comma separated list of gengres associated with the seeed tracks (${seedTracks} and add in the user genre preferences to that list (${userGenrePreference}) -- make these genres work with the spotify api (${availableGenres.data.genres}) . Then this curated list (5 max values for genre) of gengres and seed tracks (as spotify IDs, 5 max spotifyIDs) and make the  query string for a Spotify API request, like this:  https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA. -- return only the final query URL string and include seed tracks (spotify IDs) and seed genre in the query string as both are required.`
        },
      ],
      max_tokens: 300,
    });

    console.log("GPT-4 Response:", gpt4Response.data);

    const startIdx = gpt4Response.data.choices[0].message.content.indexOf("https://api.spotify.com/v1/recommendations?");
      if (startIdx !== -1) {
        queryString = gpt4Response.data.choices[0].message.content.substring(startIdx).split(' ')[0];
      } else {
        console.log("Query string not found in GPT-4 response");
      }
  } catch (error) {
    console.error('Error with GPT-4:', error);
    return res.status(401).json({ error: 'Failed to get query string from GPT-4' });
  }
  let recommendations;
  try {
    console.log("Query String:", queryString);  // Debugging line
    recommendations = await axios.get(queryString, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    console.error('Error Details:', error.response.data);  // Debugging line
    return res.status(401).json({ error: 'Failed to get recommendations' });
  }

  let playlistId;
  try {
    const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${yourSpotifyUserId}/playlists`, {
      name: 'Recommended Playlist for Marriage Proposal',
      description: 'Auto-generated by OpenAI and Spotify API',
      public: false
    }, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
    playlistId = playlistResponse.data.id;
  } catch (error) {
    console.error('Error creating playlist:', error);
    return res.status(401).json({ error: 'Failed to create playlist' });
  }

  try {
    const trackIds = recommendations.data.tracks.map((track) => `spotify:track:${track.id}`);
    await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      uris: trackIds
    }, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
  } catch (error) {
    console.error('Error adding tracks:', error);
    return res.status(401).json({ error: 'Failed to add tracks to playlist' });
  }

  res.json({ message: 'Playlist created', playlistId });
});

module.exports = router;

