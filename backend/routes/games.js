const express = require('express');
const router = express.Router();
const fs = require('fs');
const { extractGameData, authorizeAndDownloadFile, shouldFetchFromDrive, getCachedGameData } = require('../utils/googleDriveUtils');
const { initializeOAuthClient } = require('../utils/googleDriveUtils');
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8')); // Adjust the path as needed

let oAuth2Client = initializeOAuthClient(credentials);
const fileId = '1l7lbMzTwMRDmpy_rr3HKX3qsOcOkCuyH';

router.get('/download', (req, res) => {
    authorizeAndDownloadFile(oAuth2Client, fileId, (data) => {
        res.json(data); // Ensure JSON response
    });
});

router.get('/games', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (shouldFetchFromDrive()) {
    console.log('Fetching game data from Drive');
    authorizeAndDownloadFile(oAuth2Client, fileId, (data) => {
      const paginatedGames = data.slice((page - 1) * limit, page * limit);
      res.json(paginatedGames);
    });
  } else {
    console.log('Using cached game data');
    const cachedGameData = getCachedGameData();
    const paginatedGames = cachedGameData.slice((page - 1) * limit, page * limit);
    res.json(paginatedGames);
  }
});

router.get('/search', (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const performSearch = (gameData) => {
    const filteredGames = gameData.filter(game => {
      return game && game.name && game.name.toLowerCase().includes(query.toLowerCase());
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedGames = filteredGames.slice(startIndex, endIndex);
    res.json(paginatedGames);
  };

  const cachedGameData = getCachedGameData();
  if (cachedGameData && cachedGameData.length > 0) {
    console.log('Using cached game data for search');
    performSearch(cachedGameData);
  } else if (shouldFetchFromDrive()) {
    authorizeAndDownloadFile(oAuth2Client, fileId, (data) => {
      performSearch(data);
    });
  } else {
    res.status(500).json({ error: 'No game data available' });
  }
});

module.exports = router;
