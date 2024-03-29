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
    messages: [
      {
        role: "user",
        content: `Give me two almost identical marraige proposal ideas (numbered 1. and 2. be exact with the numbering), in two different responses each 80 words (or less words) that each have elements of my unique love story (${meetStory}), alludes to my relationship and relationship milestones (${milestone}), memories (${memories}), is in my desired location (${location}), takes into consideration my budget ${budget}, timeline (${timeline}), and ideally my partners interets (${interests}) and includes the names of top reviewed venues, vendors we should go to in your recommendation / idea - add a few tips for managing the proposal. The only differnce between the two ideas/responses is that the second idea/response should include using a Bundl book (from the company Bundl) to include my partner's family and friends in the moment. .. make SURE to include a short definition of what a Bundl book in the second idea / response ( definition: a surprise proposal gift book packed with loving letters and images from your partner's family and friends). Include a reason you can come up with, in the second reponse / idea, that giving a bundl book is a good idea (makes the moment more special, etc). Note any additional info I want you to consider: (${additionalInfo})`,
      },
    ],
    max_tokens: 250, // Increased to accommodate two ideas
    n: 1, // Get two completions
    temperature: 0.8,
  });

 
  const fullResponse = response.data.choices[0].message.content.trim();
  
  // Split the full response into two ideas based on your numbering
  const [ideaWithoutBundl, ideaWithBundl] = fullResponse.split("2.");

  console.log("Idea without Bundl:", ideaWithoutBundl);
  console.log("Idea with Bundl:", ideaWithBundl);

  res.json({
    ideaWithoutBundl: ideaWithoutBundl.replace("1.", "").trim(),  // Remove the numbering and trim
    ideaWithBundl: ideaWithBundl.trim(),
  });
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
      console.log("Response Data:", response.data);  // Debug line
      if (response.data.tracks.items.length > 0) {
        ids.push(response.data.tracks.items[0].id);
      } else {
        ids.push(null); // Or any placeholder if song isn't found
      }
    } catch (error) {
      console.error(error);
    }
  }

  const filteredIds = ids.filter(id => id !== null);
  const csvList = filteredIds.join(',');
  console.log("CSV List of IDs:", csvList);  


  return csvList;
};

const getArtistSpotifyIDs = async (artists, accessToken) => {
  const baseURL = 'https://api.spotify.com/v1/search';
  const artistIds = [];

  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i];
    const query = encodeURIComponent(`artist:${artist}`);
    const url = `${baseURL}?q=${query}&type=artist&limit=1`;

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    try {
      const response = await axios.get(url, config);
      if (response.data.artists.items.length > 0) {
        artistIds.push(response.data.artists.items[0].id);
      } else {
        artistIds.push(null); // Or any placeholder if artist isn't found
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Convert the array of IDs to a CSV string
  const csvList = artistIds.join(',');
  return csvList;
};
router.post('/create-playlist', async (req, res) => {
  console.log("Starting playlist creation...");
  
  const seedTracks = req.body.seed_tracks;
  const userGenrePreference = req.body.seed_genre;
  const userAccessToken = req.body.access_token;
  const additionalInfo = req.body.additionalInfo;
  let songs;

  if (!seedTracks || !userGenrePreference || !userAccessToken) {
    console.log("Missing required fields");
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let yourSpotifyUserId;
  try {
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
    yourSpotifyUserId = userResponse.data.id;
    console.log("Spotify User ID obtained:", yourSpotifyUserId);
  } catch (error) {
    console.log("Failed to get Spotify User ID:", error);
    return res.status(401).json({ error: 'Failed to get Spotify User ID' });
  }

  try {
    console.log("Fetching data from GPT-4...");
    const gpt4Response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Give me three arrays in array format [] - don't give me code. Preface each array like "tracks:" for the tracks array,  "artists:" for the artists array and "genres:" for the genre's array, be exact. Generate the arrays from the users input (${seedTracks} and ${userGenrePreference}) and add songs that would fit well with the user inptu. Make it so that the tracks and arists array each has 10 elements and only use the best of the tracks for a marriage proposal....make these songs fitting to be played at a marraige proposal -- return these three arrays only. ${additionalInfo} `
        },
      ],
      max_tokens: 200,
    });

    console.log("GPT-4 data fetched successfully");
    const responseContent = gpt4Response.data.choices[0].message.content;
    const cleanedResponseContent = responseContent.replace(/\\n/g, '').replace(/\\"/g, '"');
    console.log('Cleaned up GPT response ' + cleanedResponseContent);

    const startIdxTracks = cleanedResponseContent.indexOf('tracks: [');
    const startIdxArtists = cleanedResponseContent.indexOf('artists: [');
    const startIdxGenres = cleanedResponseContent.indexOf('genres: [');

    if (startIdxTracks !== -1 && startIdxArtists !== -1 && startIdxGenres !== -1) {
      console.log("Arrays found in GPT-4 response");
      const endIdxTracks = cleanedResponseContent.indexOf("]", startIdxTracks);
      const endIdxArtists = cleanedResponseContent.indexOf("]", startIdxArtists);
      const endIdxGenres = cleanedResponseContent.indexOf("]", startIdxGenres);

      const tracksString = cleanedResponseContent.substring(startIdxTracks + 9, endIdxTracks);
      const artistsString = cleanedResponseContent.substring(startIdxArtists + 10, endIdxArtists);
      const genresString = cleanedResponseContent.substring(startIdxGenres + 9, endIdxGenres);

  
      const tracks = tracksString.split(",").map(s => s.trim().replace(/['"]/g, ''));
      const artists = artistsString.split(",").map(s => s.trim().replace(/['"]/g, ''));
      const genres = genresString.split(",").map(s => s.trim().replace(/['"]/g, ''));
    
      const songIDs = await getSpotifyIDs(tracks, artists, userAccessToken);
    
      // Create the query string for Spotify recommendations
     // const seedArtists = await getArtistSpotifyIDs(artists, userAccessToken);
      const seedTracks = songIDs; 
      songs = seedTracks; 
    
      console.log('seed tracks: ' + seedTracks);
    } else {
      console.log("Arrays not found in GPT-4 response");
    }
  } catch (error) {
    console.log("Failed to get arrays from GPT-4:", error);
    return res.status(401).json({ error: 'Failed to get arrays from GPT-4' });
  }

  let playlistId;
  try {
    console.log("Creating Spotify playlist...");
    const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${yourSpotifyUserId}/playlists`, {
      name: 'Recommended Playlist for Marriage Proposal',
      description: 'Auto-generated by OpenAI and Spotify API via Bundl',
      public: false
    }, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
    playlistId = playlistResponse.data.id;
    console.log("Playlist created:", playlistId);
  } catch (error) {
    console.log("Failed to create playlist:", error);
    return res.status(401).json({ error: 'Failed to create playlist' });
  }

  try {
    if (!songs) {
      console.log("Songs array is undefined");
      return res.status(400).json({ error: 'Songs array is undefined' });
    }

    console.log("Adding tracks to playlist...");
    const songsArray = songs.split(',');
    const trackIds = songsArray.map((track) => `spotify:track:${track}`);

    await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      uris: trackIds
    }, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
    console.log("Tracks added to playlist");
  } catch (error) {
    console.log("Failed to add tracks to playlist:", error);
    return res.status(401).json({ error: 'Failed to add tracks to playlist' });
  }

  console.log("Playlist creation complete. Playlist ID:", playlistId);
  res.json({ playlistId });
});

module.exports = router;

