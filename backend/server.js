const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const { authorizeAndDownloadFile, initializeOAuthClient, getCachedGameData } = require('./utils/googleDriveUtils');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Importing routes
const gameRoutes = require('./routes/games');
const authRoutes = require('./routes/auth'); // Assuming you have auth routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// Initialize OAuth Client
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8')); // Adjust the path as needed
let oAuth2Client = initializeOAuthClient(credentials);
const fileId = '1l7lbMzTwMRDmpy_rr3HKX3qsOcOkCuyH';

// Initialize cached data at server startup
authorizeAndDownloadFile(oAuth2Client, fileId, (data) => {
  console.log('Initial game data fetched and cached');
});

// Use routes
app.use('/api', gameRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.get('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  if (cachedGameData) {
    const game = cachedGameData.find(g => g.id === gameId);
    if (game) {
      res.json(game);
    } else {
      res.status(404).send('Game not found');
    }
  } else {
    res.status(500).send('Game data is not available');
  }
});