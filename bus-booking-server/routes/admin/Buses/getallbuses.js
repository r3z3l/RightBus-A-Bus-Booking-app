const router = require('express').Router();
const Bus = require('../../../models/busSchema');
const pool = require('../../../config/connection');

const bus = new Bus(pool);
// Endpoint to retrieve all buses
router.get('/', async (req, res) => {
  try {
    const buses = await bus.getAllBuses();
    res.json(buses);
  } catch (error) {
    console.error('Error retrieving buses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
