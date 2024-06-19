const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post('/register', register);
router.post('/login', login);
router.get('/protected', authMiddleware, (req, res) => {
    // Access authenticated user via req.user
    res.json({ user: req.user });
});
module.exports = router;
