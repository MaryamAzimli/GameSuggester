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

app.use(cors({
    origin: ['http://localhost:8081'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize OAuth Client
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8')); // Adjust the path as needed
let oAuth2Client = initializeOAuthClient(credentials);
const fileId = '1-YyLidOBO0D-1ogxkAJs710-K69Ac7z7';


// Initialize cached data at server startup
let cachedGameData = []; // Declare cachedGameData
authorizeAndDownloadFile(oAuth2Client, fileId, (data) => {
  cachedGameData = data; // Assign data to cachedGameData
  console.log('Initial game data fetched and cached');
});

// Use routes
app.use('/api', gameRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on https://localhost:${port}`);
});