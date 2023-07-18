const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const people = google.people('v1');
const cookie = require('cookie');

router.get('/getPeople', async (req, res) => {
  try {
    const tokens = req.headers.authorization.replace('Bearer ', '');

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_SECRET,
      'http://localhost:19006/' // replace with your redirect URI
    );
    oauth2Client.setCredentials({ access_token: tokens });

    const peopleService = google.people({ version: 'v1', auth: oauth2Client });

    const connections = await peopleService.people.connections.list({
      resourceName: 'people/me',
      pageSize: 1000,
      personFields: 'names,emailAddresses',
    });

    res.json(connections.data.connections);
  } catch (error) {
    console.error('Failed to initialize Google API client:', error);
    res.status(500).json({ error: 'Failed to initialize Google API client', message: error.message });
  }
});


router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    res.status(400).send('Missing authorization code');
    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    'https://www.givebundl.com/api/oauth2callback'
  );

  try {

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.cookie('auth', JSON.stringify(tokens), {
      httpOnly: false,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/',
    });

    const people = google.people({ version: 'v1', auth: oauth2Client });
    const me = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names',
    });

    res.redirect('https://www.givebundl.com/order-details');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;