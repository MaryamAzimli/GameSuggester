const express = require('express');
const cors = require('cors');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const port = 3000;

require('events').EventEmitter.defaultMaxListeners = 20;

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

let cachedGameData = null; // In-memory cache for game data
let lastFetchTime = null; // Timestamp of the last fetch

function authorizeAndDownloadFile(fileId, callback) {
  fs.readFile('token.json', (err, token) => {
    if (err) {
      console.error('Error loading token.json:', err);
      getNewToken(fileId, callback);
      return;
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    oAuth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        // Store the refresh_token in my database or file
        fs.writeFileSync('token.json', JSON.stringify(tokens));
      }
    });
    console.log('Token set successfully');
    downloadFile(oAuth2Client, fileId, callback);
  });
}

function getNewToken(fileId, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error while trying to retrieve access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile('token.json', JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to token.json');
      });
      downloadFile(oAuth2Client, fileId, callback);
    });
  });
}

function downloadFile(auth, fileId, callback) {
  const drive = google.drive({ version: 'v3', auth });
  drive.files.get(
    { fileId: fileId, alt: 'media' },
    { responseType: 'stream' },
    (err, res) => {
      if (err) {
        if (err.code === 401 || err.message === 'invalid_grant') {
          console.log('Error downloading file: invalid_grant');
          fs.unlinkSync('token.json'); // Delete the invalid token
          getNewToken(fileId, callback); // Prompt for reauthorization
          return;
        } else {
          console.log('Error downloading file:', err.message);
          return;
        }
      }
      let data = '';
      res.data
        .on('data', chunk => {
          data += chunk;
        })
        .on('end', () => {
          console.log('File download complete');
          callback(data);
          cleanupListeners(res.data);
        })
        .on('error', err => {
          console.log('Error reading file:', err.message);
          cleanupListeners(res.data);
        });
    }
  );
}

function cleanupListeners(stream) {
  stream.removeAllListeners('data');
  stream.removeAllListeners('end');
  stream.removeAllListeners('error');
}

function extractGameData(jsonData) {
  try {
    const gameData = JSON.parse(jsonData);
    return Object.keys(gameData).map(gameId => ({
      id: gameId,
      ...gameData[gameId]
    }));
  } catch (error) {
    console.error('Failed to extract game data:', error);
    return [];
  }
}

const shouldFetchFromDrive = () => {
  // Fetch from Drive if data is not cached or if the cache is older than 24 hours
  return !cachedGameData || (new Date() - lastFetchTime) > 24 * 60 * 60 * 1000;
};

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/games', (req, res) => {
  const fileId = '1l7lbMzTwMRDmpy_rr3HKX3qsOcOkCuyH'; // Replace with your new actual file ID
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const performFetch = () => {
    console.log('Starting authorization and download for file ID:', fileId);
    authorizeAndDownloadFile(fileId, (data) => {
      cachedGameData = extractGameData(data);
      lastFetchTime = new Date();
      console.log('Cached game data:', cachedGameData); // Log the cached game data
      const paginatedGames = cachedGameData.slice((page - 1) * limit, page * limit);
      console.log('Game data to be sent:', paginatedGames);
      res.json(paginatedGames);
    });
  };

  if (shouldFetchFromDrive()) {
    performFetch();
  } else {
    const paginatedGames = cachedGameData.slice((page - 1) * limit, page * limit);
    console.log('Game data to be sent from cache:', paginatedGames);
    res.json(paginatedGames);
  }
});

app.get('/api/search', (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!query) {
    res.status(400).send('Search query is required');
    return;
  }

  const performSearch = (gameData) => {
    console.log('Performing search on game data:', gameData); // Log the game data being searched
    const filteredGames = gameData.filter(game => {
      return game && game.name && game.name.toLowerCase().includes(query.toLowerCase());
    });

    console.log('Filtered games:', filteredGames); // Log the filtered games

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedGames = filteredGames.slice(startIndex, endIndex);

    console.log('Filtered and paginated games:', paginatedGames); // Log the filtered and paginated games

    res.json(paginatedGames);
  };

  if (shouldFetchFromDrive()) {
    console.log('Fetching game data from Drive for search');
    authorizeAndDownloadFile('1l7lbMzTwMRDmpy_rr3HKX3qsOcOkCuyH', (data) => {
      cachedGameData = extractGameData(data);
      lastFetchTime = new Date();
      console.log('Newly fetched game data:', cachedGameData); // Log the newly fetched game data
      performSearch(cachedGameData);
    });
  } else {
    console.log('Using cached game data for search');
    performSearch(cachedGameData);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
