const User = require('../models/User');
const bcrypt = require('bcryptjs');
// GET all non-admin users (admin only)
exports.getAllNonAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    res.send(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Server error' });
  }
};

// DELETE a user by ID (admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST create a new user (admin only)
exports.createUser = async (req, res) => {
  const { username, password, isAdmin } = req.body;

  try {
    const user = new User({ username, password, isAdmin });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error: 'Failed to create user' });
  }
};

// Example admin-specific data fetching (can be customized as per your requirements)
exports.getAdminData = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: true }); // Example: Fetching all admin users
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Server error' });
  }
};


exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, isAdmin } = req.body;
  
    try {
      // Find the user by ID
      let user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user fields
      user.username = username || user.username; // Update username if provided, otherwise keep existing
      user.isAdmin = isAdmin || user.isAdmin; // Update isAdmin status if provided, otherwise keep existing
  
      if (password) {
        // If password is provided, hash it before updating
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      // Save the updated user object
      await user.save();
  
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };