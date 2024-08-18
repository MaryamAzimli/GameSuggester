const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// Middleware to authenticate using JWT
// Middleware to authenticate using JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Token not found' });

  // Check if the token is blacklisted
  if (tokenBlacklist.has(token)) {
    return res.status(403).json({ message: 'Token is blacklisted' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  });
}


// Password validation
function isValidPassword(password) {
  return password.length >= 6 &&
    password.length <= 100 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /\W/.test(password) &&
    !/\s/.test(password);
}

// Function to suggest a new username if the current one is taken
function suggestNewUsername(username) {
  const randomInt = crypto.randomInt(1, 999);
  const randomSymbol = ['-', '_'][crypto.randomInt(0, 2)];
  let modifiedUsername = username.charAt(0).toUpperCase() + username.slice(1);
  modifiedUsername += randomInt;
  const randomPosition = crypto.randomInt(0, modifiedUsername.length + 1);
  modifiedUsername = modifiedUsername.slice(0, randomPosition) + randomSymbol + modifiedUsername.slice(randomPosition);
  return modifiedUsername;
}

// Email validation regex
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to generate a random OTP
function generateOTP() {
  return crypto.randomInt(1000, 9999).toString();
}

// Function to send OTP via email
async function sendOTPEmail(user, otp, subject, res) {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.mail,
    subject: subject,
    text: `Your OTP for email verification is: ${otp}. It will expire in 1 hour. If you don't see it, please check your spam folder.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ message: 'Error sending OTP email' });
    }
    res.status(200).send({ message: `${subject} sent successfully. Please verify your email using the OTP.` });
  });
}


// Route to check if a username is available
router.post('/check-username', async (req, res) => {
  const { username } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const suggestedUsername = suggestNewUsername(username);
      return res.status(400).json({
        message: 'Username is taken.',
        suggestedUsername: `How about: ${suggestedUsername}?`
      });
    }
    res.status(200).json({ message: 'Username is available' });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password, mail } = req.body;

  try {
    // Validate email format
    if (!validateEmail(mail)) {
      return res.status(400).send({ message: 'Invalid email format' });
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res.status(400).send({ message: 'Password does not meet the criteria.' });
    }

    // Check if the username is already taken
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      const suggestedUsername = suggestNewUsername(username);
      return res.status(400).send({ message: `Username is taken. How about: ${suggestedUsername}?` });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 3600000; // OTP expires in 1 hour

    // Create the new user with the unhashed password, OTP, and OTP expiry
    const user = await User.create({
      username,
      password,  // Pass the raw password, pre-save hook will handle hashing
      mail,
      otp,
      otpExpiry,
    });

    // Send OTP email
    await sendOTPEmail(user, otp, 'Verify your email', res);

    res.status(201).json({
      message: "User successfully created. Please verify your email using the OTP.",
      userId: user._id,
    });

  } catch (error) {
    console.error('Error during signup process:', error);
    res.status(400).json({
      message: "User not successfully created",
      error: error.message,
    });
  }
});
// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { username, otp } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).send({ message: 'Invalid OTP' });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).send({ message: 'OTP expired' });
    }

    user.isVerified = true;
    user.otp = null;  // Clear the OTP after verification
    user.otpExpiry = null;
    await user.save();

    res.status(200).send({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error verifying OTP' });
  }
});

// Resend OTP Route
router.post('/resend-otp', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 3600000; // OTP expires in 1 hour
    await user.save();

    await sendOTPEmail(user, otp, 'Resend OTP', res);
  } catch (error) {
    console.error('Error during resend OTP process:', error);
    return res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      jwtSecret,
      { expiresIn: '1h' } // Set token to expire in 1 hour
    );
    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout Route
const tokenBlacklist = new Set();

router.post('/logout', authenticateToken, (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  tokenBlacklist.add(token);  // Add the token to the blacklist
  res.status(200).json({ message: 'Logged out successfully' });
});

// Add a game to favorites
router.post('/addFavorite', authenticateToken, async (req, res) => {
  const { appid } = req.body;
  const userId = req.user.id; // Use userId from the token

  try {
    if (!appid) {
      return res.status(400).json({ error: 'Invalid appid' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.favorites.includes(appid)) {
      user.favorites.push(appid);
      await user.save();
      res.status(200).json({ message: 'Game added to favorites', favorites: user.favorites });
      console.log('Adding appid:', appid);
      console.log('Current favorites:', user.favorites);
    } else {
      res.status(400).json({ error: 'Game already in favorites' });
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: error.message });
  }
});



// Remove a game from favorites
router.post('/removeFavorite', authenticateToken, async (req, res) => {
  const { appid } = req.body;
  const userId = req.user.id; // Use userId from the token

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.favorites = user.favorites.filter(id => id !== appid);
    await user.save();
    res.status(200).json({ message: 'Game removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's favorite games
router.get('/favorites/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;