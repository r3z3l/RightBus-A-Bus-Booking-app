// routes/user/getProfile.js
const express = require('express');
const pool = require('../../config/connection');
const User = require('../../models/userSchema');
const fetchUser = require('../../middleware/fetchUser');

const router = express.Router();
const user = new User(pool);
// Endpoint for getting the user's profile
router.get('/',fetchUser, async (req, res) => {
  // Implement logic to get the user's profile
  // Fetch from 'users' table, etc.
  console.log('hi')
  try{
    const currentUser = await user.getUserById(req.userId);
    console.log(req.userId)
    if(!currentUser){
      return res.status(404).json({error: 'User not found'})
    }
    delete currentUser.password; // Remove the password from the response object
    res.json(currentUser);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
