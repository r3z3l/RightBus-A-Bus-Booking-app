const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../config/connection');
const jwt = require('jsonwebtoken');
const User = require('../../models/userSchema');

const router = express.Router();
const user = new User(pool);

// Endpoint for user sign-in
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userResult = await user.getUserByEmail(email);

    if (userResult === null) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const currentUser = userResult;

    // Check if the provided password is valid
    const isValidPassword = await bcrypt.compare(password, currentUser.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate and send JWT
    const token = jwt.sign(
      { userId: currentUser.id, email: currentUser.email },
      'your_secret_key', // Replace with a secure key in production
      { expiresIn: '1h' }
    );

    // Set the JWT as an HTTP-only cookie
    res.cookie('token', token);

    res.json({ token: token, role: currentUser.role });
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
