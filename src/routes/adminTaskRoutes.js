const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const adminTaskController = require('../controllers/adminTaskController');

// GET all tasks for a particular user (admin only)
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
