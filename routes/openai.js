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


const getSpotifyIDs = async (songs, artists, accessToken) => {
  const baseURL = 'https://api.spotify.com/v1/search';
  const ids = [];

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    const artist = artists[i];
    const query = encodeURIComponent(`track:${song} artist:${artist}`);
    const url = `${baseURL}?q=${query}&type=track&limit=1`;

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    try {
      const response = await axios.get(url, config);
      if (response.data.tracks.items.length > 0) {
        ids.push(response.data.tracks.items[0].id);
      } else {
        ids.push(null); // Or any placeholder if song isn't found
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Convert the array of IDs to a CSV string
  const csvList = ids.join(',');

  return csvList;
};


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


  try {
    const gpt4Response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Output three arrays, like this tracks: ['contents'] and the other like artists: ['contents'] and the third like this genres: ['contents']. Given the user's seedTracks input preferences (${seedTracks}), clean up the input and give me an array of the user's track names and call the array tracks, and give me another array of the artists associated with the users inputted tracks and call it artists. For the genre's array make an array out of the genres associated with the ${seedTracks} and add in the ${userGenrePreference}. Return these three arrays. `
        },
      ],
      max_tokens: 200,
    });

    console.log("GPT-4 Response:", gpt4Response.data);
    console.log("GPT-4 Message Content:", JSON.stringify(gpt4Response.data.choices[0].message, null, 2));
  
    const responseContent = gpt4Response.data.choices[0].message.content;
    const startIdxTracks = responseContent.indexOf("tracks: [");
    const startIdxArtists = responseContent.indexOf("artists: [");
    const startIdxGenres = responseContent.indexOf("genres: [");
  
    if (startIdxTracks !== -1 && startIdxArtists !== -1 && startIdxGenres !== -1) {
      const endIdxTracks = responseContent.indexOf("]", startIdxTracks);
      const endIdxArtists = responseContent.indexOf("]", startIdxArtists);
      const endIdxGenres = responseContent.indexOf("]", startIdxGenres);
  
      const tracksString = responseContent.substring(startIdxTracks + 9, endIdxTracks);
      const artistsString = responseContent.substring(startIdxArtists + 10, endIdxArtists);
      const genresString = responseContent.substring(startIdxGenres + 9, endIdxGenres);
  
      const tracks = tracksString.split(",").map(s => s.trim());
      const artists = artistsString.split(",").map(s => s.trim());
      const genres = genresString.split(",").map(s => s.trim());
  
      const songIDs = await getSpotifyIDs(tracks, artists, userAccessToken);
  
      // Create the query string for Spotify recommendations
      const seedGenres = genres.join('%2C');
      const seedTracks = songIDs.join('%2C');
  
      const queryString = `https://api.spotify.com/v1/recommendations?&seed_genres=${seedGenres}&seed_tracks=${seedTracks}`;

      console.log('new query string is ' + queryString)
  
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
          
    } else {
      console.log("Arrays not found in GPT-4 response");
    }
  } catch (error) {
    console.error('Error with GPT-4:', error);
    return res.status(401).json({ error: 'Failed to get arrays from GPT-4' });
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

