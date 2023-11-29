const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    try {
        // Get the user from the jwt token and add id to req object
        const authHeader = req.header('Authorization');
        
    
        // Extract the token from the header
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).send({ error: "Please authenticate using a valid token" })
        }
        const data = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.userId = data.userId;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}

module.exports = fetchUser;