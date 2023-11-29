const jwt = require('jsonwebtoken');
const db = require('../config/connection'); // Import your database module

const checkAdminRole = async (req, res, next) => {
    // Get the user's ID from the JWT payload (assuming it's stored there)
    const token = req.header('cookie').split('=')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const userId = decodedToken.userId;
    console.log(userId)
    
    try {
        // Fetch the user's role from the database
        const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(user.rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. You must be an admin to perform this action.' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error checking admin role:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = checkAdminRole;
