const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

let cachedGameData = null; // In-memory cache for game data
let lastFetchTime = null; // Timestamp of the last fetch

// Initializes Google OAuth2 client
const initializeOAuthClient = (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
};

// Generates a new token
const getNewToken = (oAuth2Client, fileId, callback) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error('Error retrieving access token', err);
                return;
            }
            oAuth2Client.setCredentials(token);
            fs.writeFile('token.json', JSON.stringify(token), (err) => {
                if (err) {
                    console.error('Error saving token', err);
                }
            });
            callback(oAuth2Client, fileId);
        });
    });
};

// Downloads a file from Google Drive
const downloadFile = (auth, fileId, callback) => {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' },
        (err, res) => {
            if (err) {
                console.error('Error downloading file', err);
                return;
            }
            let data = '';
            res.data
                .on('data', (chunk) => { data += chunk; })
                .on('end', () => {
                    callback(data);
                })
                .on('error', (err) => {
                    console.error('Error reading file:', err.message);
                });
        }
    );
};

// Extracts game data from JSON
const extractGameData = (jsonData) => {
    try {
        const gameData = JSON.parse(jsonData);
        return Object.keys(gameData).map(gameId => ({
            id: gameId,
            ...gameData[gameId]
        }));
    } catch (error) {
        console.error('Error parsing JSON data', error);
        return [];
    }
};

// Determines if data should be fetched from Google Drive
const shouldFetchFromDrive = () => {
    return !cachedGameData || (new Date() - lastFetchTime) > 24 * 60 * 60 * 1000;
};

const authorizeAndDownloadFile = (oAuth2Client, fileId, callback) => {
    fs.readFile('token.json', (err, token) => {
        if (err) {
            getNewToken(oAuth2Client, fileId, callback);
            return;
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        downloadFile(oAuth2Client, fileId, (data) => {
            cachedGameData = extractGameData(data);
            lastFetchTime = new Date();
            callback(cachedGameData);
        });
    });
};

module.exports = {
    initializeOAuthClient,
    getNewToken,
    downloadFile,
    extractGameData,
    shouldFetchFromDrive,
    authorizeAndDownloadFile,
    getCachedGameData: () => cachedGameData // Exporting cachedGameData
};
