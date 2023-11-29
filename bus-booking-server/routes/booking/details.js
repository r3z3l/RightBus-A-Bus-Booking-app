const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/userSchema');
const fetchUser = require('../../middleware/fetchUser');
const pool = require('../../config/connection');

const router = express.Router();
const user = new User(pool);

router.get('/', fetchUser, async (req, res) => {
  try {
    
    // Extract booking details for the user using the model
    const bookingDetails = await user.extractBookingDetails(req.userId);
    res.json(bookingDetails);
  } catch (error) {
    console.error('Error extracting booking details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
