const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const crypto = require('crypto');
dotenv.config();
// Function to generate JWT secret if not already set in .env
const generateJwtSecretIfNeeded = () => {
    if (!process.env.JWT_SECRET) {
        const jwtSecret = crypto.randomBytes(32).toString('hex');
        console.log(`Generated new JWT secret: ${jwtSecret}`);
        process.env.JWT_SECRET = jwtSecret;
        // Write the new JWT_SECRET to .env file
        const fs = require('fs');
        fs.writeFileSync('.env', `JWT_SECRET=${jwtSecret}\n`, { flag: 'a' });
    }
};

// Generate JWT secret if not already set
generateJwtSecretIfNeeded();

const app = express();
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Admin routes

// Example error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the application if the connection fails
    }
};

connectDB();
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
