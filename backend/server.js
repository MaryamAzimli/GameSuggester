const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { google } = require('googleapis');
const port = 3000;

console.log('Starting server...');

let credentials;
try {
  credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
  console.log('Credentials loaded successfully');
} catch (error) {
  console.error('Error loading credentials:', error);
  process.exit(1);
}

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

function authorizeAndDownloadFile(fileId, callback) {
  fs.readFile('token.json', (err, token) => {
    if (err) {
      console.error('Error loading token.json:', err);
      return;
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log('Token set successfully');
    downloadFile(oAuth2Client, fileId, callback);
  });
}

function downloadFile(auth, fileId, callback) {
  const drive = google.drive({ version: 'v3', auth });
  drive.files.get(
    { fileId: fileId, alt: 'media' },
    { responseType: 'stream' },
    (err, res) => {
      if (err) {
        console.log('Error downloading file:', err);
        return;
      }
      let data = '';
      res.data
        .on('data', chunk => {
          data += chunk;
        })
        .on('end', () => {
          console.log('File download complete');
          callback(data);
        })
        .on('error', err => console.log('Error reading file:', err));
    }
  );
}

function extractGameData(jsonData) {
  try {
    //console.log('Raw JSON data:', jsonData);
    const gameData = JSON.parse(jsonData);
    const games = Object.keys(gameData).map(gameId => ({
      id: gameId,
      ...gameData[gameId]
    }));

    //console.log('Game data extracted successfully:', games);
    return games;
  } catch (error) {
    console.error('Failed to extract game data:', error);
    return [];
  }
}

app.get('/api/games', (req, res) => {
  const fileId = '1g3rxWdkl8i6RFn1EUZSuvffocYHcwWaJ'; // Replace with your actual file ID
  console.log('Starting authorization and download for file ID:', fileId);
  authorizeAndDownloadFile(fileId, (data) => {
    const gameData = extractGameData(data);
    //console.log('Game data to be sent:', gameData); // Log game data to terminal
    res.json(gameData);
  });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
  });