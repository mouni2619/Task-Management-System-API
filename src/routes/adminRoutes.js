
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const adminTaskController = require('../controllers/adminTaskController');
const User = require('../models/User');

// Admin routes for managing users
// GET all non-admin users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

// DELETE a user by ID (admin only)
router.delete('/users/:id', adminAuth, async (req, res) => {
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
});

// POST create a new user (admin only)
router.post('/users', adminAuth, async (req, res) => {
  const { username, password, isAdmin } = req.body;
  try {
    const user = new User({ username, password, isAdmin });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// Admin routes for managing tasks
// GET all tasks for a particular user (admin only)

// Example admin route
router.get('/only', (req, res) => {
    res.status(200).send('Admin access granted');
  });


router.get('/users/:userId/tasks', adminAuth, adminTaskController.getTasksByUser);

// GET all tasks for all users (admin only)
router.get('/tasks', adminAuth, adminTaskController.getAllTasks);

// POST create a task for a particular user (admin only)
router.post('/users/:userId/tasks', adminAuth, adminTaskController.createTaskForUser);

// PUT update a task by ID for a particular user (admin only)
router.put('/users/:userId/tasks/:taskId', adminAuth, adminTaskController.updateTaskForUser);

// DELETE a task by ID for a particular user (admin only)
router.delete('/users/:userId/tasks/:taskId', adminAuth, adminTaskController.deleteTaskForUser);

module.exports = router;

