const express = require('express');
const pool = require('../../../config/connection');
const Bus = require('../../../models/busSchema');
const fetchUser = require('../../../middleware/fetchUser');
const checkAdminRole = require('../../../middleware/checkAdmin');

const router = express.Router();
const bus = new Bus(pool);

// Endpoint for updating an existing bus by an admin
router.put('/:busId', fetchUser, checkAdminRole, async (req, res) => {
  try {
    const busId = req.params.busId;

    // Validate input
    const { name, route_id, occupancy, total_seats, day_of_working } = req.body;

    if (!name || !route_id || !occupancy || !total_seats || !day_of_working) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Update the bus using the model
    await bus.updateBus(busId, name, route_id, occupancy, total_seats, day_of_working);

    res.json({ message: `Bus with ID ${busId} updated successfully` });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
