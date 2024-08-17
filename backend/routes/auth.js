const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user'); // Adjust path as necessary
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// Function to generate a random OTP
function generateOTP() {
  return crypto.randomInt(1000, 9999).toString();
}

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password, mail } = req.body;  // Include mail here
 

  try {
    const otp = generateOTP();
    const otpExpiry = Date.now() + 3600000; // OTP expires in 1 hour

    // Assign OTP and OTP Expiry to the user object before saving
    const user = new User({ 
      username, 
      password, 
      mail, 
      otp,         // Save OTP
      otpExpiry    // Save OTP Expiry
    });

    await user.save();

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
      subject: 'Verify your email',
    text: `Your OTP for email verification is: ${otp}. It will expire in 1 hour.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send({ message: 'Error sending OTP email' });
      }
      res.status(200).send({ message: 'Signup successful, please verify your email using the OTP sent to your email.' });
    });


  } catch (error) {
    console.error('Error during signup process:', error);
    // If there is an error during user creation or other steps before sending the email
    return res.status(400).json({ error: error.message });
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

    console.log(`Stored OTP: ${user.otp}, Provided OTP: ${otp}`); // Add logging


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

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  // Here, you can optionally handle token invalidation, like adding it to a blacklist
  // For now, we'll just send a success message

  res.status(200).json({ message: 'Logged out successfully' });
});

// Add a game to favorites
router.post('/addFavorite', async (req, res) => {
  const { userId, appid } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.favorites.includes(appid)) {
      user.favorites.push(appid);
      await user.save();
      res.status(200).json({ message: 'Game added to favorites', favorites: user.favorites });
    } else {
      res.status(400).json({ error: 'Game already in favorites' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a game from favorites
router.post('/removeFavorite', async (req, res) => {
  const { userId, appid } = req.body;
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
router.get('/favorites/:userId', async (req, res) => {
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
