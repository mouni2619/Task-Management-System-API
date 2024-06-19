
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded.user;

        // Fetch user data from database to check isAdmin
        const user = await User.findById(req.user.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Not authorized as admin' });
        }

        next();
    } catch (error) {
        console.error('Error in adminAuth middleware:', error); // Log the error here
        res.status(401).json({ error: 'Token is not valid' });
    }
};
