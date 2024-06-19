
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Check for token in headers
    const token = req.header('x-auth-token');

    // If no token is found, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user information to the request object
        req.user = decoded.user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If token is invalid, return 401 Unauthorized
        res.status(401).json({ error: 'Token is not valid' });
    }
};
