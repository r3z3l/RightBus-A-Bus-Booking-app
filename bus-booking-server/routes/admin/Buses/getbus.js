const express = require('express');
const pool = require('../../../config/connection');
const busUser = require('../../../models/busUserSchema'); // Assuming this function exists
const fetchUser = require('../../../middleware/fetchUser');
const checkAdminRole = require('../../../middleware/checkAdmin');

const router = express.Router();
const bususer = new busUser(pool);

// Endpoint for getting all buses or a specific bus by an admin
router.get('/', fetchUser, checkAdminRole, async (req, res) => {
  try {
    // Get all buses for the admin
    const adminBuses = await bususer.getUserBuses(req.userId);
    res.json(adminBuses);
  } catch (error) {
    console.error('Error getting buses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
