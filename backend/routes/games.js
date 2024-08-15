const express = require('express');
const router = express.Router();
const fs = require('fs');
const { extractGameData, authorizeAndDownloadFile, shouldFetchFromDrive, getCachedGameData } = require('../utils/googleDriveUtils');
const { initializeOAuthClient } = require('../utils/googleDriveUtils');
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8')); // Adjust the path as needed

let oAuth2Client = initializeOAuthClient(credentials);
const fileId = '1-YyLidOBO0D-1ogxkAJs710-K69Ac7z7';

router.get('/download', (req, res) => {
    try {
        authorizeAndDownloadFile(oAuth2Client, fileId, (data) => {
            res.json(data); // Ensure JSON response
        });
    } catch (error) {
        console.error('Error during download:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

router.get('/games', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tags = req.query.tags ? req.query.tags.split(',') : [];

    try {
        const filterGamesByTags = (games) => {
            if (tags.length > 0) {
                return games.filter(game => 
                    tags.every(tag => game.clean_tags.includes(tag))
                );
            }
            return games;
        };
        const fetchData = (data) => {
            const filteredGames = filterGamesByTags(data);
            const paginatedGames = filteredGames.slice((page - 1) * limit, page * limit);
            res.json(paginatedGames);
        };
        if (shouldFetchFromDrive()) {
            console.log('Fetching game data from Drive');
            authorizeAndDownloadFile(oAuth2Client, fileId, (data) => {
                fetchData(data);
            });
        } else {
            console.log('Using cached game data');
            const cachedGameData = getCachedGameData();
            fetchData(cachedGameData);
        }
    } catch (error) {
        console.error('Error handling /games request:', error);
        res.status(500).json({ error: 'Failed to process request' });
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
        try {
            const filteredGames = gameData.filter(game => {
                return game && game.name && game.name.toLowerCase().includes(query.toLowerCase());
            });

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedGames = filteredGames.slice(startIndex, endIndex);
            res.json(paginatedGames);
        } catch (error) {
            console.error('Error performing search:', error);
            res.status(500).json({ error: 'Failed to perform search' });
        }
    };

    try {
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
    } catch (error) {
        console.error('Error handling /search request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

router.get('/games/:id', (req, res) => {
  const gameId = req.params.id;
  
  try {
      const cachedGameData = getCachedGameData();
      if (cachedGameData && cachedGameData.length > 0) {
          const game = cachedGameData.find(g => g.id === gameId);
          if (game) {
              res.json(game);
          } else {
              res.status(404).send('Game not found');
          }
      } else if (shouldFetchFromDrive()) {
          authorizeAndDownloadFile(oAuth2Client, fileId, (data) => {
              const game = data.find(g => g.id === gameId);
              if (game) {
                  res.json(game);
              } else {
                  res.status(404).send('Game not found');
              }
          });
      } else {
          res.status(500).send('Game data is not available');
      }
  } catch (error) {
      console.error('Error handling /games/:id request:', error);
      res.status(500).send('Failed to process request');
  }
});

module.exports = router;
