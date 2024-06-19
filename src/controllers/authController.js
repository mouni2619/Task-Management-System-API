const User = require('../models/User');
const jwt = require('jsonwebtoken');


// Register a new user
exports.register = async (req, res) => {
    const { username, password, isAdmin } = req.body; // Extract isAdmin from request body

    try {
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = new User({ username, password, isAdmin }); // Set isAdmin when creating a new user
        await user.save();

        const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10d' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Login a user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10d' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
